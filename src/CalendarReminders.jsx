import React, { useState, useEffect, useRef } from 'react';
import { inDays } from './utils/helpers.js';
import { Eyebrow, PageTitle, PanelTitle } from './components/Heading.jsx';
import { Icon, hinweisZeichen, erledigtZeichen, aufklappZeichen } from './IconSystem.jsx';
import { buildICS, downloadICS } from './utils/icsExport.js';
import { ExportVorschau } from './components/ExportVorschau.jsx';
import { text, weight, space, radius, fontFamily, ease, duration, leading } from './config/tokens.js';
import { loadReminders, saveReminders } from './utils/reminders.js';
import { useVorlaeufig } from './hooks/vorlaeufigContext.js';
import { EmptyState } from './components/EmptyState.jsx';
import { anspruchSignaleListe } from './data/anspruchSignale.js';
import { GlossarText } from './GlossarBegriff.jsx';
import { ZielHinweis } from './components/ExternerLink.jsx';
import { ansichtIkon } from './config/ansichtenRegister.js';
import { loadTodos, saveTodos, merkpunktUmschalten, merkpunktTagSetzen, WIEDERHOLUNG_JAEHRLICH } from './utils/merkliste.js';
import { merkpunktBereich, merkpunktZeichen, kategorieBereich, bereichZeichenFarbe } from './data/aufgabenBereiche.js';
import { werktagAmOderDavor } from './utils/fristen.js';
import { Jahreskreis } from './components/Jahreskreis.jsx';
import { kalenderBeispiel } from './demo/kalenderBeispiel.js';

// ─── Helpers ────────────────────────────────────────────────
const daysBetween = (a, b) => {
  const msPerDay = 86400000;
  return Math.round((new Date(b) - new Date(a)) / msPerDay);
};

// «Heute» nach Schweizer Uhr, nicht nach UTC. Bis 24.09.2026 stand hier
// `new Date().toISOString()` — zwischen Mitternacht und 1/2 Uhr ist das in UTC noch
// gestern: eine heute fällige Frist galt als morgen, eine gestrige als heute.
const todayISO = () => inDays(0);

const INTERVALS = {
  once: null,
  daily: 1,
  weekly: 7,
  monthly: 30,
  quarterly: 91,
  halfYearly: 182,
  yearly: 365,
};

// Aus letztem Besuch + Intervall den nächsten empfohlenen Termin ableiten —
// damit man egal wann im Jahr startet sinnvoll geplant wird. Standard: jährlich.
const nextDueFrom = (lastVisit, recurrence) => {
  if (!lastVisit) return '';
  const interval = INTERVALS[recurrence] || 365;
  const next = new Date(new Date(lastVisit).getTime() + interval * 86400000);
  return isNaN(next.getTime()) ? '' : next.toISOString().split('T')[0];
};

// Pre-built templates for Swiss life
const TEMPLATES = (t) => [
  { title: t('calendar.templates.doctorYearly'), category: 'health', recurrence: 'yearly', daysFromNow: 30, coverage: t('calendar.coverage.doctor') },
  { title: t('calendar.templates.dentistYearly'), category: 'health', recurrence: 'yearly', daysFromNow: 60, coverage: t('calendar.coverage.dentist') },
  { title: t('calendar.templates.gynYearly'), category: 'health', recurrence: 'yearly', daysFromNow: 90, coverage: t('calendar.coverage.gyn') },
  { title: t('calendar.templates.taxDeadline'), category: 'finance', recurrence: 'yearly', daysFromNow: 120 },
  { title: t('calendar.templates.insuranceRenewal'), category: 'insurance', recurrence: 'yearly', daysFromNow: 180 },
  { title: t('calendar.templates.permitRenewal'), category: 'admin', recurrence: 'yearly', daysFromNow: 365 },
  { title: t('calendar.templates.ravAppointment'), category: 'admin', recurrence: 'monthly', daysFromNow: 14 },
  { title: t('calendar.templates.integrationCourse'), category: 'education', recurrence: 'weekly', daysFromNow: 7 },
  { title: t('calendar.templates.vaccinations'), category: 'health', recurrence: 'yearly', daysFromNow: 180, coverage: t('calendar.coverage.vaccinations') },
  { title: t('calendar.templates.medicationRefill'), category: 'health', recurrence: 'quarterly', daysFromNow: 60, coverage: t('calendar.coverage.medication') },
  { title: t('calendar.templates.kkChange'), category: 'insurance', recurrence: 'yearly', daysFromNow: daysBetween(todayISO(), new Date().getFullYear() + '-11-30') },
];

// Icon keys mapping to IconSystem — used for category display
const CATEGORY_ICON_KEYS = {
  health: 'health', admin: 'behoerden', finance: 'money', insurance: 'insurance',
  work: 'work', family: 'family', education: 'ausbildung', housing: 'home',
  legal: 'legal', personal: 'basis'
};

// Fassung 5 (Stebler Studios, 23.10.2026): Form trägt die Art, Farbe den Bereich — Graustufen-tauglich.
//   Punkt = Frist · Raute = Termin · Quadrat = Aufgabe aus der Merkliste · leerer Kreis = erledigt.
// Was Sie hier selbst eintragen (Formular, Vorlage), ist ein Termin (art: 'termin'); was ein
// Ablauf oder Rechner über utils/reminders.js anlegt — und alles Ältere ohne `art` — eine Frist.
const artVon = (r) => (r.art === 'termin' ? 'termin' : 'frist');

const ArtMarke = ({ art, farbe, erledigt, palette, gross }) => {
  const g = gross ? 8 : 6;
  const basis = { display: 'inline-block', width: g + 'px', height: g + 'px', flexShrink: 0, boxSizing: 'border-box' };
  if (erledigt) return React.createElement('span', { 'aria-hidden': 'true', style: { ...basis, borderRadius: '50%', border: '1.5px solid ' + palette.mid } });
  const form = art === 'termin' ? { transform: 'rotate(45deg) scale(.85)', borderRadius: 0 }
    : art === 'aufgabe' ? { borderRadius: 0 }
    : { borderRadius: '50%' };
  return React.createElement('span', { 'aria-hidden': 'true', style: { ...basis, ...form, background: farbe } });
};

// ─── Component ──────────────────────────────────────────────
// isMobile brauchte nur das alte Monatsraster (6 statt 12 Spalten); seit dem Jahreskreis ungenutzt.
export const CalendarReminders = ({ palette, t, data, onNavigate, beispiel }) => {
  // Im Beispiel und beim Ausprobieren (Entscheid 18.10.2026): der Kalender beginnt leer, was
  // man einträgt, liegt nur im Arbeitsspeicher. Die echten Erinnerungen bleiben unsichtbar
  // und unberührt. main.jsx hängt den Kalender beim Moduswechsel neu ein (key: datenModus).
  const vorlaeufig = useVorlaeufig();
  // Seit 24.10.2026 beginnt nur das Beispiel Maria mit ein paar Terminen (demo/kalenderBeispiel.js);
  // beim Ausprobieren bleibt der Kalender leer. Gespeichert wird im Beispiel weiterhin nichts.
  const [reminders, setReminders] = useState(() => (vorlaeufig ? (beispiel ? kalenderBeispiel(t) : []) : loadReminders()));
  const [view, setView] = useState('upcoming'); // upcoming, completed, add
  const [showTemplates, setShowTemplates] = useState(false);
  // Visueller Kalender: Jahresband (12 Monate) + Monatsraster des gewählten Monats.
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selDate, setSelDate] = useState(null); // ISO des angetippten Tages
  // Export-Vorschau (K20): erst zeigen, was in der .ics-Datei steht, dann herunterladen.
  const [icsVorschau, setIcsVorschau] = useState(false);

  // New reminder form
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCategory, setNewCategory] = useState('personal');
  const [newRecurrence, setNewRecurrence] = useState('once');
  const [newNotes, setNewNotes] = useState('');
  // Optional, nur bei Gesundheits-Terminen: Deckung dieses Jahr (gedeckt/selbst/unsicher).
  const [newCoverage, setNewCoverage] = useState('');
  // Optional, nur bei Gesundheit: letzter Besuch → berechnet den nächsten Termin.
  const [newLastVisit, setNewLastVisit] = useState('');

  // Persist on change
  useEffect(() => { if (!vorlaeufig) saveReminders(reminders); }, [reminders, vorlaeufig]);

  // Merkliste als To-dos (Fassung 5): Merkpunkte mit Tag stehen hier als Aufgabe. Dieselbe
  // Liste (or5_merkliste) und dieselben Umformungen wie MerklisteView — abhaken an beiden
  // Orten, gleicher Zustand. Gespeichert wird nur bei einer Änderung, nie im Beispiel.
  const [todos, setTodos] = useState(() => (vorlaeufig ? [] : loadTodos()));
  const aendereTodos = (fn) => setTodos(prev => { const neu = fn(prev); if (!vorlaeufig) saveTodos(neu); return neu; });
  const [verteilen, setVerteilen] = useState(null); // id des Merkpunkts, der gerade einen Tag bekommt
  const leisteRef = useRef(null);

  // Auto-generate recurring instances
  useEffect(() => {
    const today = todayISO();
    let changed = false;
    const updated = reminders.map(r => {
      if (r.done && r.recurrence !== 'once' && r.dueDate <= today) {
        const interval = INTERVALS[r.recurrence];
        if (interval) {
          const nextDate = new Date(new Date(r.dueDate).getTime() + interval * 86400000);
          const nextISO = nextDate.toISOString().split('T')[0];
          changed = true;
          return { ...r, dueDate: nextISO, done: false, completedDate: null };
        }
      }
      return r;
    });
    if (changed) setReminders(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Einmaliger Überfällig-Rollover beim Mount; `reminders` bewusst KEINE Dep (sonst würde der Rollover bei jeder Änderung erneut laufen).
  }, []);

  const addReminder = () => {
    if (!newTitle.trim() || !newDate) return;
    const reminder = {
      id: Date.now().toString() + '_' + Math.random().toString(36).slice(2, 8),
      title: newTitle.trim(),
      dueDate: newDate,
      category: newCategory,
      recurrence: newRecurrence,
      notes: newNotes.trim(),
      coverageThisYear: newCategory === 'health' ? newCoverage : '',
      art: 'termin',
      done: false,
      completedDate: null,
      createdDate: todayISO()
    };
    setReminders(prev => [...prev, reminder]);
    setNewTitle(''); setNewDate(''); setNewNotes('');
    setNewCategory('personal'); setNewRecurrence('once'); setNewCoverage(''); setNewLastVisit('');
    setView('upcoming');
  };

  const addFromTemplate = (template) => {
    const dueDate = inDays(template.daysFromNow || 30); // lokal, wie todayISO
    const reminder = {
      id: Date.now().toString() + '_' + Math.random().toString(36).slice(2, 8),
      title: template.title,
      dueDate,
      category: template.category,
      recurrence: template.recurrence,
      // Deckungs-Orientierung wandert in die Notiz, damit sie am Termin bleibt.
      notes: template.coverage || '',
      art: 'termin',
      done: false,
      completedDate: null,
      createdDate: todayISO()
    };
    setReminders(prev => [...prev, reminder]);
  };

  const [justCompleted, setJustCompleted] = useState(null);

  const toggleDone = (id) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder && !reminder.done) {
      setJustCompleted(id);
      setTimeout(() => setJustCompleted(null), 800);
    }
    setReminders(prev => prev.map(r =>
      r.id === id ? { ...r, done: !r.done, completedDate: r.done ? null : todayISO() } : r
    ));
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  // Categorize
  const today = todayISO();
  const upcoming = reminders.filter(r => !r.done).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const completed = reminders.filter(r => r.done).sort((a, b) => (b.completedDate || '').localeCompare(a.completedDate || ''));

  const getDueLabel = (dueDate) => {
    const days = daysBetween(today, dueDate);
    if (days < 0) return t('calendar.overdueDays', { days: Math.abs(days) });
    if (days === 0) return t('calendar.dueToday');
    if (days === 1) return t('calendar.dueTomorrow');
    return t('calendar.dueIn', { days });
  };

  const getDueColor = (dueDate) => {
    const days = daysBetween(today, dueDate);
    // Textfarbe: die tiefen Töne halten AA (4.5:1); die hellen nur als Rand.
    if (days < 0) return palette.roseDeep || palette.rose;
    if (days === 0) return palette.goldDeep || palette.gold;
    if (days <= 7) return palette.skyDeep || palette.sky;
    return palette.mid;
  };

  const categories = Object.keys(CATEGORY_ICON_KEYS);

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: radius.sm,
    border: '1px solid ' + palette.border, background: palette.up,
    color: palette.text, boxSizing: 'border-box', fontSize: text.sm,
    fontFamily: fontFamily, marginBottom: '12px'
  };

  const renderReminderCard = (r) => {
    const dueColor = r.done ? palette.sage : getDueColor(r.dueDate);
    const iconKey = CATEGORY_ICON_KEYS[r.category] || 'basis';
    const catLabel = t('calendar.categories.' + r.category) || r.category;

    const isJustDone = justCompleted === r.id;

    return React.createElement('div', {
      key: r.id,
      style: {
        padding: '12px 16px', background: isJustDone ? palette.sage + '12' : palette.up, borderRadius: radius.sm,
        border: '1px solid ' + (isJustDone ? palette.sage : r.done ? palette.sage + '44' : dueColor + '66'),
        marginBottom: space.sm, opacity: r.done && !isJustDone ? 0.7 : 1,
        transition: `background ${duration.slow}ms ${ease}, border-color ${duration.slow}ms ${ease}, opacity ${duration.slow}ms ${ease}`,
      }
    },
      isJustDone && React.createElement('div', {
        style: { textAlign: 'center', fontSize: text.sm, fontWeight: weight.semi, color: palette.sageDeep, marginBottom: '6px', animation: 'mp-check-pop 0.4s ease-out forwards' }
      }, hinweisZeichen('check'), t('calendar.nicelyDone')),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '12px' } },
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: space.sm, marginBottom: space.xs } },
            React.createElement(Icon, { name: iconKey, size: 16 }),
            React.createElement('span', { style: { fontWeight: weight.semi, fontSize: text.sm, textDecoration: r.done ? 'line-through' : 'none' } }, r.title)
          ),
          React.createElement('div', { style: { display: 'flex', gap: space.sm, alignItems: 'center', fontSize: text.sm, color: palette.mid, marginTop: space.xs } },
            React.createElement('span', { style: { color: dueColor, fontWeight: weight.semi } }, r.done ? erledigtZeichen(true, t('calendar.completed')) : getDueLabel(r.dueDate)),
            React.createElement('span', null, '|'),
            React.createElement('span', null, catLabel),
            r.recurrence !== 'once' && React.createElement('span', null, '| ', hinweisZeichen('recurring', 12), t('calendar.' + r.recurrence))
          ),
          r.coverageThisYear && React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: '4px', fontStyle: 'italic' } }, t('calendar.coverageThisYear.cardPrefix') + ': ' + t('calendar.coverageThisYear.' + r.coverageThisYear)),
          r.notes && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '6px', fontStyle: 'italic' } }, r.notes)
        ),
        React.createElement('div', { style: { display: 'flex', gap: space.xs, flexShrink: 0 } },
          React.createElement('button', {
            'aria-label': r.done ? t('calendar.undo') : t('calendar.markDone'),
            onClick: () => toggleDone(r.id),
            style: {
              padding: '6px 10px', minWidth: '44px', minHeight: '44px', background: r.done ? palette.gold : palette.sageBtn,
              color: r.done ? palette.onSand : '#fff', border: 'none', borderRadius: radius.xs,
              cursor: 'pointer', fontSize: text.xs, fontWeight: weight.semi
            }
          }, hinweisZeichen(r.done ? 'recurring' : 'check', 12)),
          React.createElement('button', {
            'aria-label': t('common.delete'),
            onClick: () => deleteReminder(r.id),
            style: {
              padding: '6px 10px', minWidth: '44px', minHeight: '44px', background: palette.roseBtn,
              color: '#fff', border: 'none', borderRadius: radius.xs,
              cursor: 'pointer', fontSize: text.xs, fontWeight: weight.semi
            }
          }, React.createElement(Icon, { name: 'kreuz', size: 12 }))
        )
      )
    );
  };

  // ─── Merkliste im Kalender (Fassung 5) ───────────────────────
  const LOCALE = t('calendar.locale');
  const datumVon = (iso) => new Date(iso + 'T00:00:00');
  const datumLang = (iso) => datumVon(iso).toLocaleDateString(LOCALE, { day: 'numeric', month: 'long' });
  // Offene Aufgaben am geplanten Tag; erledigte am Tag, an dem sie erledigt wurden
  // (nur seit Fassung 5 abgehakte tragen erledigtAm — ältere erfinden kein Datum).
  const aufgabenOffen = todos.filter(m => !m.done && m.tag).sort((a, b) => String(a.tag).localeCompare(String(b.tag)));
  const aufgabenErledigt = todos.filter(m => m.done && m.erledigtAm);
  const ohneTag = todos.filter(m => !m.done && !m.tag);
  const todoUmschalten = (id) => aendereTodos(prev => merkpunktUmschalten(prev, id, today));

  // Ein Tag in der Leiste oder im ganzen Monat: legt den gewählten Merkpunkt auf diesen Tag,
  // sonst öffnet er das Tagespanel wie bisher.
  const tagAntippen = (iso) => {
    if (verteilen) {
      aendereTodos(prev => merkpunktTagSetzen(prev, verteilen, iso));
      setVerteilen(null);
      return;
    }
    setSelDate(iso === selDate ? null : iso);
  };

  // Alle Marken eines Tages, in einer Form-Sprache für Leiste, Raster und Tagespanel.
  const markenAm = {};
  const markeDazu = (iso, m) => { (markenAm[iso] = markenAm[iso] || []).push(m); };
  reminders.forEach(r => {
    const iso = r.done ? (r.completedDate || r.dueDate) : r.dueDate;
    markeDazu(iso, { key: 'r' + r.id, art: artVon(r), bereich: kategorieBereich(r.category), erledigt: r.done, titel: r.title });
  });
  aufgabenOffen.forEach(m => markeDazu(m.tag, { key: 'm' + m.id, art: 'aufgabe', bereich: merkpunktBereich(m.link), erledigt: false, titel: m.text }));
  aufgabenErledigt.forEach(m => markeDazu(m.erledigtAm, { key: 'm' + m.id, art: 'aufgabe', bereich: merkpunktBereich(m.link), erledigt: true, titel: m.text }));
  const markenZeile = (iso) => (markenAm[iso] || []).slice(0, 4).map(m => React.createElement(ArtMarke, { key: m.key, art: m.art, erledigt: m.erledigt, farbe: bereichZeichenFarbe(m.bereich, palette), palette }));
  const tagAria = (iso) => {
    const marken = markenAm[iso] || [];
    return datumVon(iso).toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' })
      + (iso === today ? ', ' + t('calendar.today') : '')
      + (marken.length ? ' · ' + marken.map(m => (m.art === 'aufgabe' ? t('calendar.aufgabe') + ' ' : '') + m.titel).join(', ') : '');
  };

  // Die Tagesleiste zeigt beim Öffnen und beim Monatswechsel heute (bzw. den Monatsanfang).
  useEffect(() => {
    const el = leisteRef.current;
    if (!el) return;
    const ziel = el.querySelector('[data-heute="true"]');
    el.scrollLeft = ziel ? Math.max(0, ziel.offsetLeft - el.offsetLeft - 48) : 0;
  }, [calYear, calMonth]);

  const renderAufgabe = (m) => {
    const iso = m.done ? m.erledigtAm : m.tag;
    const farbe = bereichZeichenFarbe(merkpunktBereich(m.link), palette);
    const dueColor = m.done ? palette.sage : getDueColor(iso);
    const wann = m.done ? t('merkliste.erledigtAm', { datum: datumLang(iso) }) : getDueLabel(iso);
    return React.createElement('div', {
      key: 'm' + m.id,
      style: { padding: '12px 16px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + (m.done ? palette.sage + '44' : dueColor + '66'), marginBottom: space.sm, opacity: m.done ? 0.7 : 1 },
    },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '12px' } },
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: space.sm, marginBottom: space.xs } },
            React.createElement('span', { 'aria-hidden': 'true', style: { display: 'inline-flex', color: farbe } }, React.createElement(Icon, { name: merkpunktZeichen(m.link), size: 16 })),
            React.createElement('span', { style: { fontWeight: weight.semi, fontSize: text.sm, color: palette.text, textDecoration: m.done ? 'line-through' : 'none' } }, m.text)
          ),
          React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.sm, alignItems: 'center', fontSize: text.sm, color: palette.mid, marginTop: space.xs } },
            React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: palette.text } }, React.createElement(ArtMarke, { art: 'aufgabe', erledigt: m.done, farbe, palette, gross: true }), t('calendar.aufgabe')),
            React.createElement('span', null, '|'),
            React.createElement('span', { style: { color: dueColor, fontWeight: weight.semi } }, wann),
            React.createElement('span', null, '|'),
            React.createElement('span', null, t('calendar.ausMerkliste')),
            m.wiederholung === WIEDERHOLUNG_JAEHRLICH && React.createElement('span', null, '| ', hinweisZeichen('recurring', 12), t('calendar.yearly'))
          )
        ),
        React.createElement('button', {
          type: 'button',
          'aria-label': (m.done ? t('calendar.undo') : t('calendar.markDone')) + ': ' + m.text,
          onClick: () => todoUmschalten(m.id),
          style: { padding: '6px 10px', background: m.done ? palette.gold : palette.sageBtn, color: m.done ? palette.onSand : '#fff', border: 'none', borderRadius: radius.xs, cursor: 'pointer', fontSize: text.xs, fontWeight: weight.semi, flexShrink: 0 },
        }, hinweisZeichen(m.done ? 'recurring' : 'check', 12))
      )
    );
  };

  // Bevorstehend: Erinnerungen und Aufgaben zusammen nach Datum; Erledigt: neueste zuerst.
  const offenAlle = [
    ...upcoming.map(r => ({ datum: r.dueDate, el: () => renderReminderCard(r) })),
    ...aufgabenOffen.map(m => ({ datum: m.tag, el: () => renderAufgabe(m) })),
  ].sort((a, b) => a.datum.localeCompare(b.datum));
  const erledigtAlle = [
    ...completed.map(r => ({ datum: r.completedDate || '', el: () => renderReminderCard(r) })),
    ...aufgabenErledigt.map(m => ({ datum: m.erledigtAm, el: () => renderAufgabe(m) })),
  ].sort((a, b) => b.datum.localeCompare(a.datum));
  const gruppe = (pruef) => offenAlle.filter(e => pruef(e.datum));
  const gUeberfaellig = gruppe(d => d < today);
  const gHeute = gruppe(d => d === today);
  const gWoche = gruppe(d => d > today && daysBetween(today, d) <= 7);
  const gSpaeter = gruppe(d => d > today && daysBetween(today, d) > 7);

  const knopfRuhig = { background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm, padding: '5px 12px', minHeight: '44px', fontSize: text.xs, color: palette.text, cursor: 'pointer', fontFamily: 'inherit' };
  const reiter = (aktiv) => ({ flex: 1, padding: '10px 12px', minHeight: '44px', background: aktiv ? palette.surface : 'none', color: palette.text, border: '1px solid ' + (aktiv ? palette.sand : 'transparent'), borderRadius: radius.sm, cursor: 'pointer', font: 'inherit', fontSize: text.sm, fontWeight: aktiv ? weight.semi : weight.normal });

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: ansichtIkon('calendar'), size: 22 }), style: { marginBottom: space.md } }, t('nav.wasAnsteht')),

    // Möglicherweise für dich (Anspruch-Signale, Variante C, #4.4): ruhiger Hinweis
    // auf gedeckte Ansprüche — dieselbe ehrliche Logik wie der Ring am Baum. Kein
    // Muss, nur ein „schau mal hier"; jede Zeile verlinkt in ihr Zuhause.
    (() => {
      const list = onNavigate ? anspruchSignaleListe(data) : [];
      if (!list.length) return null;
      return React.createElement('div', {
        style: { background: palette.sage + '10', border: '1px solid ' + palette.sage + '2e', borderRadius: radius.sm, padding: space.md + 'px', marginBottom: space.md },
      },
        React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: '2px' } }, t('calendar.anspruchTitle')),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm + 'px', lineHeight: leading.relaxed } }, t('calendar.anspruchIntro')),
        ...list.map((sig) => React.createElement('button', {
          key: sig.key, type: 'button', onClick: () => onNavigate(sig.view),
          style: {
            display: 'flex', alignItems: 'center', gap: '8px', width: '100%', textAlign: 'left', boxSizing: 'border-box',
            padding: '9px 11px', marginBottom: space.xs + 'px',
            background: palette.surface, color: palette.text, border: '1px solid ' + palette.border, borderRadius: radius.sm,
            cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, fontWeight: weight.medium,
          },
        },
          React.createElement('span', { 'aria-hidden': 'true', style: { width: '8px', height: '8px', borderRadius: '50%', background: palette.sage, flexShrink: 0 } }),
          React.createElement('span', { style: { flex: 1, minWidth: 0 } }, t('anspruch.items.' + sig.key + '.label')
            + (sig.mitGanzerMiete ? ' (' + t('sozialhilfe.mitGanzerMiete') + ')' : ''))
        ))
      );
    })(),

    // Tagesleiste mit Monatssprung (‹ Monat ›, zwölf Monate, Heute), darunter aufklappbar
    // «Ganzer Monat» als Monatsraster (Fassung 5). Tag antippen öffnet das Tagespanel mit
    // der Brücke zum Hinzufügen — oder legt eine Aufgabe auf diesen Tag («Noch ohne Tag»).
    // Monatsnamen/Wochentage aus Intl (Swiss-Locale), damit keine 12×5-Namenspflege nötig ist.
    (() => {

      const first = new Date(calYear, calMonth, 1);
      const startWd = (first.getDay() + 6) % 7; // Montag = 0 (CH)
      const dim = new Date(calYear, calMonth + 1, 0).getDate();
      const cells = [];
      for (let i = 0; i < startWd; i++) cells.push(null);
      for (let d = 1; d <= dim; d++) cells.push(d);
      const isoOf = (d) => calYear + '-' + String(calMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      const wdNames = []; for (let i = 0; i < 7; i++) wdNames.push(new Date(2024, 0, 1 + i).toLocaleDateString(LOCALE, { weekday: 'short' }));
      const monatJahr = (j, m) => new Date(j, m, 1).toLocaleDateString(LOCALE, { month: 'long', year: 'numeric' });
      const springe = (j, m) => { setCalYear(j); setCalMonth(m); setSelDate(null); };
      const vorher = calMonth === 0 ? [calYear - 1, 11] : [calYear, calMonth - 1];
      const nachher = calMonth === 11 ? [calYear + 1, 0] : [calYear, calMonth + 1];

      const navBtn = { background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm, minWidth: '44px', height: '44px', cursor: 'pointer', color: palette.text, fontFamily: 'inherit', fontSize: text.md, lineHeight: 1 };
      const verteilRand = verteilen ? palette.sage : palette.border;
      // minHeight 44 statt nur aspectRatio 1 (a11y-Prüfung 26.10.2026: bei 375 px 34 px hoch).
      const dayCell = (iso, isToday) => ({ position: 'relative', aspectRatio: '1', minHeight: '44px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', borderRadius: radius.sm, cursor: 'pointer', color: palette.text, fontFamily: 'inherit', fontSize: text.xs, background: iso === selDate ? palette.sand + '2E' : 'none', border: '1px solid ' + (iso === selDate ? palette.sand : (isToday ? palette.sky : 'transparent')), fontWeight: isToday ? weight.semi : weight.normal });
      const stripTag = (iso, isToday) => ({ flex: '0 0 46px', minHeight: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: '3px', padding: '6px 0', borderRadius: radius.sm, cursor: 'pointer', fontFamily: 'inherit', color: palette.text, background: iso === selDate ? palette.sand + '2E' : (isToday ? palette.surface : 'none'), border: '1px solid ' + (iso === selDate ? palette.sand : (isToday ? palette.text : 'transparent')) });
      const markenReihe = (iso) => React.createElement('span', { style: { display: 'flex', gap: '2px', alignItems: 'center', minHeight: '8px' } }, ...markenZeile(iso));

      const selReminders = selDate ? reminders.filter(r => r.dueDate === selDate).sort((a, b) => Number(a.done) - Number(b.done)) : [];
      const selAufgaben = selDate ? todos.filter(m => (m.done ? m.erledigtAm : m.tag) === selDate) : [];

      return React.createElement('div', { role: 'group', 'aria-label': t('calendar.calAria'), style: { background: palette.up, border: '1px solid ' + palette.border, borderRadius: radius.sm, padding: space.md + 'px', marginBottom: space.md } },
        // Kopf: ‹ Monat Jahr › (über den Jahreswechsel) + Heute
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: space.sm + 'px', marginBottom: space.sm + 'px' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: space.xs + 'px' } },
            React.createElement('button', { type: 'button', 'aria-label': monatJahr(vorher[0], vorher[1]), style: navBtn, onClick: () => springe(vorher[0], vorher[1]) }, '‹'),
            React.createElement('span', { 'aria-live': 'polite', style: { fontSize: text.md, fontWeight: weight.semi, color: palette.text, minWidth: '112px', textAlign: 'center' } }, monatJahr(calYear, calMonth)),
            React.createElement('button', { type: 'button', 'aria-label': monatJahr(nachher[0], nachher[1]), style: navBtn, onClick: () => springe(nachher[0], nachher[1]) }, '›')
          ),
          React.createElement('button', { type: 'button', style: { ...knopfRuhig, color: palette.mid }, onClick: () => { setCalYear(now.getFullYear()); setCalMonth(now.getMonth()); setSelDate(today); } }, t('calendar.today'))
        ),
        // Jahreskreis statt der zwölf Monatsknöpfe (Stebler Studios 24.10.2026: «Ring als Hauptansicht»).
        // Ein Monat im Ring wählt ihn für die Tagesleiste darunter. Darauf nur Hinterlegtes:
        // eigene offene Einträge, die KVG-Kündigung (fristen.js, Werktag davor nach BAG) und die
        // eigene Steuerfrist aus dem Kapitel Behörden. Kantonale IPV-Fristen fehlen bewusst
        // (erst 5 von 26 hinterlegt).
        React.createElement(Jahreskreis, {
          jahr: calYear, heuteIso: today, gewaehlterMonat: calMonth, locale: LOCALE, palette, t, eingebettet: true,
          onMonat: (m) => { setCalMonth(m); setSelDate(null); },
          eintraege: [
            ...upcoming.map(r => ({ key: 'r' + r.id, iso: r.dueDate, art: artVon(r), farbe: bereichZeichenFarbe(kategorieBereich(r.category), palette), titel: r.title })),
            ...aufgabenOffen.map(m => ({ key: 'm' + m.id, iso: m.tag, art: 'aufgabe', farbe: bereichZeichenFarbe(merkpunktBereich(m.link), palette), titel: m.text })),
            // Als Fenster ohne festen Anfang: das Recht beginnt mit der eigenen Prämienmitteilung
            // (KVG Art. 7 Abs. 2), die spätestens am 31. Oktober da sein muss (BAG, priminfo) —
            // der Strich dort ist «spätestens», kein Beginn (Fachprüfung 24.10.2026).
            { key: 'fest-kvg', iso: werktagAmOderDavor(calYear + '-11-30'), art: 'frist', auslauf: 61, merke: calYear + '-10-31', farbe: bereichZeichenFarbe(kategorieBereich('insurance'), palette), titel: t('calendar.jahreskreis.kvgTitle'), quelle: t('calendar.jahreskreis.kvgSource') },
            data?.behoerden?.taxFilingDeadline && { key: 'fest-steuer', iso: data.behoerden.taxFilingDeadline, art: 'frist', farbe: bereichZeichenFarbe(kategorieBereich('finance'), palette), titel: t('calendar.templates.taxDeadline'), quelle: t('calendar.jahreskreis.taxSource') },
          ].filter(Boolean),
        }),
        // Tagesleiste: die Tage des Monats, wischbar
        React.createElement('div', {
          ref: leisteRef, role: 'group', 'aria-label': monatJahr(calYear, calMonth),
          style: { display: 'flex', gap: '2px', overflowX: 'auto', padding: '4px 2px', border: '1px solid ' + verteilRand, borderRadius: radius.sm, scrollbarWidth: 'thin' },
        },
          ...Array.from({ length: dim }, (_, i) => {
            const d = i + 1, iso = isoOf(d), isToday = iso === today;
            const wd = new Date(calYear, calMonth, d).toLocaleDateString(LOCALE, { weekday: 'short' });
            return React.createElement('button', {
              key: iso, type: 'button', 'data-heute': isToday ? 'true' : undefined,
              'aria-pressed': iso === selDate, 'aria-label': tagAria(iso),
              style: stripTag(iso, isToday), onClick: () => tagAntippen(iso),
            },
              React.createElement('span', { style: { fontSize: '11px', color: palette.mid } }, wd),
              React.createElement('span', { style: { fontSize: text.sm, fontWeight: isToday ? weight.semi : weight.normal, color: palette.text } }, d),
              markenReihe(iso)
            );
          })
        ),
        // Ganzer Monat — das bisherige Monatsraster, aufklappbar
        React.createElement('details', { style: { marginTop: space.sm + 'px' }, open: verteilen ? true : undefined },
          React.createElement('summary', { style: { cursor: 'pointer', fontSize: text.sm, fontWeight: weight.semi, color: palette.text, minHeight: '44px', display: 'flex', alignItems: 'center' } }, t('calendar.ganzerMonat')),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px', margin: space.sm + 'px 0 ' + space.xs + 'px' } },
            ...wdNames.map((w, i) => React.createElement('div', { key: i, style: { textAlign: 'center', fontSize: text.xs, color: palette.mid } }, w))
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' } },
            ...cells.map((d, i) => {
              if (d === null) return React.createElement('div', { key: 'b' + i });
              const iso = isoOf(d), isToday = iso === today;
              return React.createElement('button', {
                key: iso, type: 'button', 'aria-label': tagAria(iso),
                'aria-pressed': iso === selDate, style: dayCell(iso, isToday), onClick: () => tagAntippen(iso),
              }, d, markenReihe(iso));
            })
          )
        ),
        // Tagespanel: Einträge des angetippten Tages + Brücke zum Hinzufügen
        selDate && React.createElement('div', { style: { marginTop: space.md + 'px', paddingTop: space.sm + 'px', borderTop: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: space.sm + 'px' } }, datumVon(selDate).toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' })),
          selReminders.length + selAufgaben.length > 0
            ? [
              ...selReminders.map(r => React.createElement('div', { key: r.id, style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', marginBottom: space.xs + 'px' } },
                React.createElement(ArtMarke, { art: artVon(r), erledigt: r.done, farbe: bereichZeichenFarbe(kategorieBereich(r.category), palette), palette, gross: true }),
                React.createElement('span', { style: { fontSize: text.sm, color: r.done ? palette.mid : palette.text, textDecoration: r.done ? 'line-through' : 'none' } }, r.title)
              )),
              ...selAufgaben.map(m => React.createElement('div', { key: m.id, style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', marginBottom: space.xs + 'px' } },
                React.createElement(ArtMarke, { art: 'aufgabe', erledigt: m.done, farbe: bereichZeichenFarbe(merkpunktBereich(m.link), palette), palette, gross: true }),
                React.createElement('span', { style: { fontSize: text.sm, color: m.done ? palette.mid : palette.text, textDecoration: m.done ? 'line-through' : 'none' } }, m.text),
                React.createElement('span', { style: { fontSize: text.xs, color: palette.mid } }, t('calendar.aufgabe'))
              )),
            ]
            : React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.sm + 'px' } }, t('calendar.noRemindersTitle')),
          React.createElement('button', { type: 'button', style: { ...knopfRuhig, marginTop: space.xs + 'px' }, onClick: () => { setNewDate(selDate); setView('add'); } }, '+ ' + t('calendar.addReminder'))
        )
      );
    })(),

    // Reiter «Bevorstehend / Erledigt» mit Zahl, daneben «+ Erinnerung hinzufügen»
    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.sm, alignItems: 'stretch', marginBottom: space.md } },
      React.createElement('div', { role: 'tablist', 'aria-label': t('calendar.upcoming') + ' / ' + t('calendar.completed'), style: { display: 'flex', gap: '4px', flex: '1 1 260px', background: palette.up, borderRadius: radius.sm, padding: '3px' } },
        React.createElement('button', { type: 'button', role: 'tab', 'aria-selected': view === 'upcoming', style: reiter(view === 'upcoming'), onClick: () => setView('upcoming') }, offenAlle.length + ' ' + t('calendar.upcoming')),
        React.createElement('button', { type: 'button', role: 'tab', 'aria-selected': view === 'completed', style: reiter(view === 'completed'), onClick: () => setView('completed') }, erledigtAlle.length + ' ' + t('calendar.completed'))
      ),
      React.createElement('button', {
        type: 'button', 'aria-expanded': view === 'add',
        style: { padding: '10px 14px', minHeight: '44px', background: view === 'add' ? palette.sand : palette.up, color: view === 'add' ? palette.onSand : palette.text, border: '1px solid ' + (view === 'add' ? palette.sand : palette.border), borderRadius: radius.sm, cursor: 'pointer', font: 'inherit', fontSize: text.sm, fontWeight: weight.semi },
        onClick: () => setView(view === 'add' ? 'upcoming' : 'add'),
      }, '+ ' + t('calendar.addReminder'))
    ),

    // Add view
    view === 'add' && React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, marginBottom: space.md, border: '1px solid ' + palette.sand } },
      React.createElement(PanelTitle, { palette, style: { marginBottom: '12px' } }, t('calendar.addReminder')),

      React.createElement('input', {
        type: 'text', value: newTitle,
        onChange: (e) => setNewTitle(e.target.value),
        placeholder: t('calendar.addReminder') + '...', 'aria-label': t('calendar.addReminder'),
        style: inputStyle
      }),

      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: space.sm, marginBottom: '12px' } },
        React.createElement('div', null,
          React.createElement('label', { htmlFor: 'cal-neu-datum', style: { fontSize: text.sm, color: palette.mid, display: 'block', marginBottom: space.xs } }, t('chapterView.expiryDate')),
          React.createElement('input', { id: 'cal-neu-datum', type: 'date', value: newDate, onChange: (e) => setNewDate(e.target.value), style: { ...inputStyle, marginBottom: 0 } })
        ),
        React.createElement('div', null,
          React.createElement('label', { htmlFor: 'cal-neu-kategorie', style: { fontSize: text.sm, color: palette.mid, display: 'block', marginBottom: space.xs } }, t('calendar.category')),
          React.createElement('select', { id: 'cal-neu-kategorie', value: newCategory, onChange: (e) => setNewCategory(e.target.value), style: { ...inputStyle, marginBottom: 0 } },
            categories.map(cat => React.createElement('option', { key: cat, value: cat }, t('calendar.categories.' + cat)))
          )
        )
      ),

      // Optional, nur bei Gesundheit: letzter Besuch → berechnet den nächsten Termin
      newCategory === 'health' && React.createElement('div', { style: { marginBottom: '12px' } },
        React.createElement('label', { htmlFor: 'cal-neu-letzterbesuch', style: { fontSize: text.sm, color: palette.mid, display: 'block', marginBottom: space.xs } }, t('calendar.lastVisit.label')),
        React.createElement('input', {
          id: 'cal-neu-letzterbesuch',
          type: 'date',
          value: newLastVisit,
          onChange: (e) => { const v = e.target.value; setNewLastVisit(v); if (v) setNewDate(nextDueFrom(v, newRecurrence)); },
          style: { ...inputStyle, marginBottom: '4px' }
        }),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.soft } }, t('calendar.lastVisit.hint'))
      ),

      // Optional, nur bei Gesundheit: Deckung dieses Jahr (gedeckt/selbst/unsicher; erneut klicken = leer)
      newCategory === 'health' && React.createElement('div', { style: { marginBottom: '12px' } },
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, display: 'block', marginBottom: space.xs } }, t('calendar.coverageThisYear.label')),
        React.createElement('div', { role: 'group', 'aria-label': t('calendar.coverageThisYear.label'), style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } },
          ['covered', 'selfpay', 'unsure'].map(opt =>
            React.createElement('button', {
              key: opt,
              type: 'button',
              'aria-pressed': newCoverage === opt,
              onClick: () => setNewCoverage(newCoverage === opt ? '' : opt),
              style: {
                padding: '6px 12px', borderRadius: radius.xs, cursor: 'pointer',
                fontSize: text.sm, fontWeight: newCoverage === opt ? '600' : '400',
                background: newCoverage === opt ? palette.sand : palette.surface,
                color: newCoverage === opt ? palette.onSand : palette.text,
                border: '1px solid ' + (newCoverage === opt ? palette.sand : palette.border)
              }
            }, t('calendar.coverageThisYear.' + opt))
          )
        )
      ),

      React.createElement('div', { style: { marginBottom: '12px' } },
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, display: 'block', marginBottom: space.xs } }, t('calendar.recurring')),
        React.createElement('div', { role: 'group', 'aria-label': t('calendar.recurring'), style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } },
          ['once', 'daily', 'weekly', 'monthly', 'quarterly', 'halfYearly', 'yearly'].map(freq =>
            React.createElement('button', {
              key: freq,
              'aria-pressed': newRecurrence === freq,
              onClick: () => { setNewRecurrence(freq); if (newLastVisit) setNewDate(nextDueFrom(newLastVisit, freq)); },
              style: {
                padding: '6px 12px', borderRadius: radius.xs, cursor: 'pointer',
                fontSize: text.sm, fontWeight: newRecurrence === freq ? '600' : '400',
                background: newRecurrence === freq ? palette.sand : palette.surface,
                color: newRecurrence === freq ? palette.onSand : palette.text,
                border: '1px solid ' + (newRecurrence === freq ? palette.sand : palette.border)
              }
            }, freq === 'once' ? t('calendar.oneTime') : t('calendar.' + freq))
          )
        )
      ),

      React.createElement('textarea', {
        value: newNotes, onChange: (e) => setNewNotes(e.target.value),
        placeholder: t('common.optional') + '...',
        'aria-label': t('calendar.noteLabel'),
        style: { ...inputStyle, minHeight: '60px', resize: 'vertical' }
      }),

      React.createElement('button', {
        onClick: addReminder,
        disabled: !newTitle.trim() || !newDate,
        style: {
          width: '100%', padding: '10px', borderRadius: radius.sm,
          background: newTitle.trim() && newDate ? palette.sageBtn : palette.mid,
          color: '#fff', border: 'none', cursor: newTitle.trim() && newDate ? 'pointer' : 'not-allowed',
          fontWeight: weight.semi, fontSize: text.sm
        }
      }, '+ ' + t('calendar.addReminder')),

      // Templates
      React.createElement('div', { style: { marginTop: space.md } },
        React.createElement('button', {
          'aria-expanded': showTemplates,
          onClick: () => setShowTemplates(!showTemplates),
          style: { width: '100%', padding: space.sm, background: 'transparent', color: palette.mid, border: '1px solid ' + palette.border, borderRadius: radius.sm, cursor: 'pointer', fontSize: text.sm, fontWeight: weight.semi }
        }, aufklappZeichen(showTemplates), t('calendar.templates.title')),

        showTemplates && React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '6px', marginTop: space.sm } },
          TEMPLATES(t).map((tmpl, idx) =>
            React.createElement('button', {
              key: idx,
              onClick: () => addFromTemplate(tmpl),
              style: {
                padding: '8px 12px', background: palette.surface, border: '1px solid ' + palette.border,
                borderRadius: radius.sm, cursor: 'pointer', fontSize: text.sm, textAlign: 'left',
                color: palette.text, transition: `border-color ${duration.normal}ms ${ease}`
              },
              onMouseEnter: (e) => { e.currentTarget.style.borderColor = palette.sand; },
              onMouseLeave: (e) => { e.currentTarget.style.borderColor = palette.border; }
            },
              React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, React.createElement(Icon, { name: CATEGORY_ICON_KEYS[tmpl.category] || 'basis', size: 14 }), tmpl.title),
              React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } }, hinweisZeichen('recurring', 12), t('calendar.' + tmpl.recurrence)),
              // Ruhige Deckungs-Orientierung (KVG-faktisch, keine medizinische Empfehlung)
              tmpl.coverage && React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: '4px', lineHeight: leading.normal, fontStyle: 'italic' } }, hinweisZeichen(), tmpl.coverage)
            )
          )
        )
      )
    ),

    // Upcoming view — Erinnerungen und Aufgaben aus der Merkliste, nach Datum
    view === 'upcoming' && React.createElement('div', null,
      offenAlle.length === 0
        ? React.createElement(EmptyState, {
            palette,
            icon: React.createElement(Icon, { name: 'cowbell', size: 28, color: palette.mid }),
            title: t('calendar.noRemindersTitle'),
            description: t('calendar.noReminders'),
          })
        : React.createElement('div', null,
            // Overdue section
            gUeberfaellig.length > 0 && React.createElement('div', { style: { marginBottom: space.md } },
              React.createElement(Eyebrow, { palette, style: { color: palette.roseDeep, marginBottom: space.sm } }, t('calendar.overdue') + ' (' + gUeberfaellig.length + ')'),
              gUeberfaellig.map(e => e.el())
            ),

            // Due today
            gHeute.length > 0 && React.createElement('div', { style: { marginBottom: space.md } },
              React.createElement(Eyebrow, { palette, style: { color: palette.goldDeep, marginBottom: space.sm } }, t('calendar.today') + ' (' + gHeute.length + ')'),
              gHeute.map(e => e.el())
            ),

            // This week
            gWoche.length > 0 && React.createElement('div', { style: { marginBottom: space.md } },
              React.createElement(Eyebrow, { palette, style: { color: palette.skyDeep, marginBottom: space.sm } }, t('calendar.thisWeek') + ' (' + gWoche.length + ')'),
              gWoche.map(e => e.el())
            ),

            // Later
            gSpaeter.length > 0 && React.createElement('div', { style: { marginBottom: space.md } },
              React.createElement(Eyebrow, { palette, style: { color: palette.mid, marginBottom: space.sm } }, t('calendar.later')),
              gSpaeter.map(e => e.el())
            )
          )
    ),

    // Completed view
    view === 'completed' && React.createElement('div', null,
      erledigtAlle.length === 0
        ? React.createElement('div', { style: { textAlign: 'center', padding: '40px 20px', color: palette.mid, fontSize: text.sm } }, t('common.none'))
        : erledigtAlle.map(e => e.el())
    ),

    // Fach «Noch ohne Tag»: offene Merkpunkte ohne Tag. «Auf einen Tag legen», dann oben
    // einen Tag in der Leiste oder im ganzen Monat antippen.
    ohneTag.length > 0 && React.createElement('div', { style: { marginTop: space.md, paddingTop: space.sm, borderTop: '1px solid ' + palette.border } },
      React.createElement(Eyebrow, { palette, style: { color: palette.mid, marginBottom: space.sm } }, t('calendar.nochOhneTag') + ' · ' + t('calendar.ausMerkliste')),
      React.createElement('div', { role: 'status', 'aria-live': 'polite' },
        verteilen && React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: space.sm, marginBottom: space.sm, fontSize: text.sm, color: palette.text } },
          React.createElement('span', null, t('calendar.jetztTagAntippen')),
          React.createElement('button', { type: 'button', style: knopfRuhig, onClick: () => setVerteilen(null) }, t('common.cancel'))
        )
      ),
      ...ohneTag.map(m => React.createElement('div', { key: m.id, style: { display: 'flex', alignItems: 'center', gap: space.sm, padding: '6px 0', borderBottom: '1px solid ' + palette.border + '66' } },
        React.createElement('span', { 'aria-hidden': 'true', style: { display: 'inline-flex', color: bereichZeichenFarbe(merkpunktBereich(m.link), palette) } }, React.createElement(Icon, { name: merkpunktZeichen(m.link), size: 16 })),
        React.createElement('span', { style: { flex: 1, minWidth: 0, fontSize: text.sm, color: palette.text } }, m.text),
        React.createElement('button', {
          type: 'button', 'aria-pressed': verteilen === m.id, style: { ...knopfRuhig, borderColor: verteilen === m.id ? palette.sage : palette.border },
          onClick: () => {
            const an = verteilen === m.id ? null : m.id;
            setVerteilen(an);
            if (an && leisteRef.current && leisteRef.current.scrollIntoView) leisteRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
          },
        }, t('calendar.aufTagLegen'))
      ))
    ),

    // Kalender-Export (.ics) — Termine ins eigene Kalender-App übernehmen (Fassung 5: am Ende)
    upcoming.length > 0 && React.createElement('div', { style: { marginTop: space.md } },
      React.createElement('button', {
        type: 'button',
        onClick: () => setIcsVorschau(true),
        style: {
          background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm,
          padding: space.xs + 'px ' + space.md + 'px', fontSize: text.xs, color: palette.mid,
          cursor: 'pointer', fontFamily: 'inherit',
        }
      }, React.createElement(ZielHinweis, { t, art: 'download' }), t('calendar.exportIcs')),
      React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.xs } }, t('calendar.exportIcsHint')),

      // Export-Vorschau (K20) direkt unter dem Knopf, der sie geöffnet hat.
      icsVorschau && React.createElement(ExportVorschau, {
        palette, t, art: 'kalender',
        quelle: { ics: buildICS(upcoming, t) },
        onWeiter: () => { setIcsVorschau(false); downloadICS(upcoming, t); },
        onZurueck: () => setIcsVorschau(false),
      })
    ),

    // Disclaimer
    React.createElement('div', { style: { marginTop: space.md, padding: '10px', background: palette.up, borderRadius: radius.sm, fontSize: text.xs, color: palette.mid } },
      hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('calendar.disclaimer'))
    )
  );
};

export default CalendarReminders;
