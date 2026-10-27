import React, { useState, useEffect, useRef } from 'react';
import { inDays } from './utils/helpers.js';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import { Icon, hinweisZeichen, aufklappZeichen } from './IconSystem.jsx';
import { buildICS, downloadICS } from './utils/icsExport.js';
import { ExportVorschau } from './components/ExportVorschau.jsx';
import { text, weight, space, radius, fontFamily, fontFamilyDisplay, ease, duration, leading } from './config/tokens.js';
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
import { naechsterTermin, bisHeuteWeiter, INTERVALLE } from './utils/wiederholung.js';
import { Jahreskreis } from './components/Jahreskreis.jsx';
import { kalenderBeispiel } from './demo/kalenderBeispiel.js';
import { laufendeAblaeufe, bandFarbe, bandImFenster, fensterStart, fensterTage, ABLAEUFE_MIT_STAND } from './utils/laufendeAblaeufe.js';
import landschaft from './assets/berge/landschaft.webp?url';

// ─── Helpers ────────────────────────────────────────────────
const daysBetween = (a, b) => {
  const msPerDay = 86400000;
  return Math.round((new Date(b) - new Date(a)) / msPerDay);
};

// «Heute» nach Schweizer Uhr, nicht nach UTC. Bis 24.09.2026 stand hier
// `new Date().toISOString()` — zwischen Mitternacht und 1/2 Uhr ist das in UTC noch
// gestern: eine heute fällige Frist galt als morgen, eine gestrige als heute.
const todayISO = () => inDays(0);

// Wiederholungen nach Kalender (utils/wiederholung.js): bis 26.10.2026 feste Tageszahlen (30 / 365)
// und das Ergebnis in UTC — Termine wanderten, nachts kam der Vortag heraus.

// Aus letztem Besuch + Intervall den nächsten empfohlenen Termin ableiten —
// damit man egal wann im Jahr startet sinnvoll geplant wird. Standard: jährlich.
const nextDueFrom = (lastVisit, recurrence) => {
  if (!lastVisit) return '';
  // Ohne bekannte Wiederholung (auch «once»): jährlich, wie bisher.
  return naechsterTermin(lastVisit, INTERVALLE[recurrence] ? recurrence : 'yearly') || '';
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
  if (erledigt) return React.createElement('span', { 'aria-hidden': 'true', style: { ...basis, borderRadius: radius.full, border: '1.5px solid ' + palette.mid } });
  const form = art === 'termin' ? { transform: 'rotate(45deg) scale(.85)', borderRadius: 0 }
    : art === 'aufgabe' ? { borderRadius: 0 }
    : { borderRadius: radius.full };
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
  const monateRef = useRef(null);
  // «Ganzer Monat» / «Ganzes Jahr»: offen oder zu, damit das Zeichen + zu − wird.
  const [offenIn, setOffenIn] = useState({});
  const aufklappSchalter = (wo) => (e) => { const offen = e.currentTarget.open; setOffenIn(p => (p[wo] === offen ? p : { ...p, [wo]: offen })); };

  // Auto-generate recurring instances
  useEffect(() => {
    const today = todayISO();
    let changed = false;
    // Bis heute weiterschalten, mit Ankertag (utils/wiederholung.js); ohne bekannte Wiederholung bleibt der
    // Eintrag, wie er ist (Prüfung 26.10.2026).
    const updated = reminders.map(r => {
      const weiter = bisHeuteWeiter(r, today);
      if (weiter) { changed = true; return weiter; }
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
  // Begonnene, nicht fertige Abläufe (z. B. Umzug): grünes Band über der Tagesleiste, Bogen im Jahreskreis.
  const laufend = laufendeAblaeufe(reminders, vorlaeufig, today);
  const bandText = (a) => t(a.titelKey) + ' · ' + t('onboarding.stepOf', { current: a.schritt, total: a.total });

  const getDueLabel = (dueDate) => {
    const days = daysBetween(today, dueDate);
    if (days < 0) return t('calendar.overdueDays', { days: Math.abs(days) });
    if (days === 0) return t('calendar.dueToday');
    if (days === 1) return t('calendar.dueTomorrow');
    return t('calendar.dueIn', { days });
  };

  const categories = Object.keys(CATEGORY_ICON_KEYS);

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: radius.sm,
    border: '1px solid ' + palette.border, background: palette.up,
    color: palette.text, boxSizing: 'border-box', fontSize: text.sm,
    fontFamily: fontFamily, marginBottom: '12px'
  };

  // Fassung G (Entwurf «Zeitleiste», 27.10.2026): eine Zeile je Eintrag statt einer Karte — links das
  // Datum, dann die Kachel in der Farbe des Bereichs, Titel und «Art · Fällig in … · Herkunft», rechts
  // der runde Abhak-Kreis. Löschen wie im Entwurf nicht in der Liste, sondern im Tagespanel (Tag oben antippen).
  const ablaufName = (name) => { const a = ABLAEUFE_MIT_STAND.find(x => x.name === name); return a ? t(a.titelKey) : name; };
  const leiseKnopf = { minWidth: '44px', minHeight: '44px', display: 'grid', placeItems: 'center', background: 'none', border: 'none', borderRadius: radius.full, cursor: 'pointer', padding: 0, flexShrink: 0, fontFamily: 'inherit' };
  const zeile = ({ key, iso, art, bereich, icon, titel, herkunft, wann, done, isJustDone, onToggle, toggleLabel, extra }) => {
    const farbe = bereichZeichenFarbe(bereich, palette);
    const dueColor = !done && iso && iso < today ? (palette.sandDeep || palette.sand) : palette.soft; // nie rot (Entwurf G); sandDeep hält 4.5:1 auch hell
    const d = iso ? datumVon(iso) : null;
    const artName = art === 'aufgabe' ? t('calendar.aufgabe') : t('calendar.legende.' + art);
    return React.createElement('div', {
      key, 'data-zeile': art,
      style: {
        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', minHeight: '64px', borderBottom: '1px solid ' + palette.border,
        background: isJustDone ? palette.sage + '12' : 'none',
        transition: `background ${duration.slow}ms ${ease}`,
      },
    },
      React.createElement('div', { 'aria-hidden': 'true', style: { width: '44px', flexShrink: 0, textAlign: 'center', color: palette.text, fontVariantNumeric: 'tabular-nums' } },
        React.createElement('div', { style: { fontFamily: fontFamilyDisplay, fontSize: '20px', fontWeight: weight.bold, lineHeight: 1 } }, d ? d.getDate() : ''),
        React.createElement('div', { style: { fontSize: '11px', color: palette.soft } }, d ? d.toLocaleDateString(LOCALE, { month: 'short' }) : '')
      ),
      React.createElement('span', { 'aria-hidden': 'true', style: { width: '36px', height: '36px', borderRadius: radius.md, display: 'grid', placeItems: 'center', flexShrink: 0, background: farbe + '2E', boxShadow: 'inset 0 0 0 1px ' + farbe + '4D', color: farbe } },
        React.createElement(Icon, { name: icon, size: 16 })),
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        isJustDone && React.createElement('div', { style: { fontSize: text.xs, fontWeight: weight.semi, color: palette.sageDeep, marginBottom: '2px', animation: 'mp-check-pop 0.4s ease-out forwards' } }, hinweisZeichen('check'), t('calendar.nicelyDone')),
        React.createElement('div', { style: { fontSize: text.sm, color: done ? palette.soft : palette.text, textDecoration: done ? 'line-through' : 'none', overflowWrap: 'break-word', hyphens: 'auto', WebkitHyphens: 'auto' } }, titel),
        // «Termin · Fällig in 3 Tagen · aus dem Ablauf Umzug» ruhig wie im Entwurf; nur die Art etwas heller.
        React.createElement('div', { style: { fontSize: '12px', color: palette.soft, marginTop: '1px', lineHeight: leading.normal } },
          React.createElement('span', { style: { color: palette.mid } }, artName), ' · ', React.createElement('span', { style: { color: dueColor } }, wann), herkunft ? ' · ' + herkunft : null),
        extra
      ),
      React.createElement('button', { type: 'button', 'aria-label': toggleLabel + ': ' + titel + (d ? ', ' + datumLang(iso) : ''), onClick: onToggle, style: leiseKnopf },
        React.createElement('span', { 'aria-hidden': 'true', style: { width: '22px', height: '22px', borderRadius: radius.full, display: 'grid', placeItems: 'center', boxSizing: 'border-box', border: '2px solid ' + (done ? palette.sage : palette.mid), background: done ? palette.sage : 'none', color: palette.bg } },
          done ? React.createElement(Icon, { name: 'check', size: 12 }) : null)),
    );
  };

  const renderReminderCard = (r) => zeile({
    key: r.id, iso: r.done ? (r.completedDate || r.dueDate) : r.dueDate, art: artVon(r), bereich: kategorieBereich(r.category),
    icon: CATEGORY_ICON_KEYS[r.category] || 'basis', titel: r.title,
    herkunft: [r.ablauf && t('calendar.ausAblauf', { name: ablaufName(r.ablauf) }), r.recurrence && r.recurrence !== 'once' && t('calendar.' + r.recurrence)].filter(Boolean).join(' · '),
    wann: r.done ? t('calendar.completed') : getDueLabel(r.dueDate), done: r.done, isJustDone: justCompleted === r.id,
    onToggle: () => toggleDone(r.id), toggleLabel: r.done ? t('calendar.undo') : t('calendar.markDone'),
    extra: [
      r.coverageThisYear && React.createElement('div', { key: 'dk', style: { fontSize: text.xs, color: palette.soft, marginTop: '4px', fontStyle: 'italic' } }, t('calendar.coverageThisYear.cardPrefix') + ': ' + t('calendar.coverageThisYear.' + r.coverageThisYear)),
      r.notes && React.createElement('div', { key: 'nz', style: { fontSize: text.xs, color: palette.mid, marginTop: '4px', fontStyle: 'italic' } }, r.notes),
    ],
  });

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

  // Beim Öffnen und beim Monatswechsel: Tagesleiste an den Anfang, Monatsknöpfe zum gewählten Monat.
  useEffect(() => {
    // Das Fenster beginnt schon drei Tage vor heute bzw. vor dem Ersten (Entwurf G) — also ganz links.
    const el = leisteRef.current;
    if (el) el.scrollLeft = 0;
    // Die Monatsknöpfe zeigen den gewählten Monat, mit einem Knopf davor (Entwurf G: «Juli Aug Sept [Okt] Nov»).
    const reihe = monateRef.current;
    const aktiv = reihe && reihe.querySelector('[aria-pressed="true"]');
    if (aktiv) reihe.scrollLeft = Math.max(0, aktiv.offsetLeft - reihe.offsetLeft - 64);
  }, [calYear, calMonth]);

  const renderAufgabe = (m) => {
    const iso = m.done ? m.erledigtAm : m.tag;
    return zeile({
      key: 'm' + m.id, iso, art: 'aufgabe', bereich: merkpunktBereich(m.link), icon: merkpunktZeichen(m.link), titel: m.text,
      herkunft: [t('calendar.ausMerkliste'), m.wiederholung === WIEDERHOLUNG_JAEHRLICH && t('calendar.yearly')].filter(Boolean).join(' · '),
      wann: m.done ? t('merkliste.erledigtAm', { datum: datumLang(iso) }) : getDueLabel(iso), done: m.done,
      onToggle: () => todoUmschalten(m.id), toggleLabel: m.done ? t('calendar.undo') : t('calendar.markDone'),
    });
  };

  // Bevorstehend: Erinnerungen und Aufgaben zusammen nach Datum; Erledigt: neueste zuerst.
  // `titel`/`herkunft` tragen «Als Nächstes» oben auf der Seite.
  const offenAlle = [
    ...upcoming.map(r => ({ datum: r.dueDate, titel: r.title, ablauf: r.ablauf || '', herkunft: r.ablauf ? t('calendar.ausAblauf', { name: ablaufName(r.ablauf) }) : '', el: () => renderReminderCard(r) })),
    ...aufgabenOffen.map(m => ({ datum: m.tag, titel: m.text, herkunft: t('calendar.ausMerkliste'), el: () => renderAufgabe(m) })),
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
  // Reiter wie im Entwurf G: Text mit Strich darunter statt Kasten.
  const reiter = (aktiv) => ({ flex: 1, padding: '0 12px', minHeight: '44px', background: 'none', color: aktiv ? palette.text : palette.mid, border: 'none', borderBottom: '2px solid ' + (aktiv ? bereichZeichenFarbe('finanzen', palette) : 'transparent'), cursor: 'pointer', font: 'inherit', fontSize: '14px', fontWeight: aktiv ? weight.medium : weight.normal });
  const gruppenKopf = (titel) => React.createElement('h3', { style: { fontFamily: fontFamilyDisplay, fontSize: text.body, fontWeight: weight.semi, color: palette.text, margin: '20px 0 2px' } }, titel);

  // «Als Nächstes» (Entwurf G): der früheste offene Eintrag, gross. Überfällig zählt mit.
  const naechst = offenAlle[0];
  const naechstWann = (iso) => {
    const days = daysBetween(today, iso);
    if (days < 0) return t('calendar.verpasst');
    if (days === 0) return t('calendar.today');
    if (days === 1) return t('calendar.morgen');
    return t('calendar.inTagen', { days });
  };

  // Kopf wie die Kapitel (Muster M5, Fassung 6): Landschaftsband, darauf «Übersicht › Was ansteht»,
  // darunter Kachel, Titel und Untertitel. Keine Karte mehr um die Seite (Entwurf G).
  return React.createElement('div', { 'data-seite': 'was-ansteht', style: { maxWidth: '720px' } },
    React.createElement('div', { style: { marginBottom: space.lg + 'px' } },
      React.createElement('div', { 'aria-hidden': 'true', style: { position: 'relative', height: '112px', margin: '0 -20px', overflow: 'hidden' } },
        React.createElement('div', { style: { position: 'absolute', inset: 0, backgroundImage: 'url(' + landschaft + ')', backgroundSize: 'cover', backgroundPosition: 'center 72%', opacity: 0.5 } }),
        React.createElement('div', { style: { position: 'absolute', inset: '0 0 -1px 0', background: 'linear-gradient(to bottom, ' + palette.sage + '38 0%, transparent 45%, ' + palette.bg + ' 100%)' } })
      ),
      React.createElement('nav', { 'aria-label': t('nav.pfad'), style: { position: 'relative', marginTop: '-46px', marginBottom: space.md + 'px' } },
        React.createElement('ol', { style: { listStyle: 'none', margin: 0, padding: '0 10px', display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: '0 6px', borderRadius: radius.full, background: palette.bg + 'E6', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', fontSize: text.sm } },
          React.createElement('li', null, React.createElement('button', {
            type: 'button', className: 'mp-link', onClick: () => onNavigate && onNavigate('dashboard'),
            style: { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, color: palette.mid, padding: '0 4px', margin: '0 -4px', minHeight: '44px' },
          }, t('nav.backToDashboard'))),
          React.createElement('li', { 'aria-hidden': 'true', style: { color: palette.mid } }, '›'),
          React.createElement('li', { 'aria-current': 'page', style: { color: palette.text, fontWeight: weight.medium } }, t('nav.wasAnsteht'))
        )
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: space.sm + 'px' } },
        React.createElement('span', { 'aria-hidden': 'true', style: { width: '52px', height: '52px', borderRadius: radius.lg, display: 'grid', placeItems: 'center', flexShrink: 0, background: palette.sage + '2E', boxShadow: 'inset 0 0 0 1px ' + palette.sage + '4D', color: palette.sageDeep || palette.sage } },
          React.createElement(Icon, { name: ansichtIkon('calendar'), size: 26 })),
        React.createElement(PageTitle, { palette, style: { color: palette.text, minWidth: 0, fontFamily: fontFamilyDisplay, fontSize: '30px', lineHeight: 1.05, letterSpacing: '-0.015em' } }, t('nav.wasAnsteht'))
      ),
      React.createElement('p', { style: { fontSize: text.body, color: palette.mid, margin: 0, lineHeight: leading.relaxed, maxWidth: '560px' } }, t('calendar.untertitel'))
    ),

    // Als Nächstes — nur, wenn etwas offen ist (sonst sagt die leere Liste unten genug).
    // Gross wie im Entwurf (44 px). Verpasst steht ruhig als «verpasst», darunter «Was jetzt?» als Weg
    // (Entwurf G: «verpasst — was jetzt?», nie rot; Stebler Studios 27.10.2026). Der Weg führt in den
    // Ablauf, aus dem die Frist kommt (dort steht, was nach der Frist gilt), sonst zum Tag im Kalender.
    naechst && React.createElement('div', { 'data-als-naechstes': naechst.datum < today ? 'verpasst' : 'true', style: { borderTop: '1px solid ' + palette.border, borderBottom: '1px solid ' + palette.border, padding: '18px 0 22px', marginBottom: '18px' } },
      React.createElement('div', { style: { fontSize: text.xs, color: palette.soft } }, t('calendar.alsNaechstes')),
      React.createElement('div', { style: { fontFamily: fontFamilyDisplay, fontWeight: weight.bold, fontSize: '44px', lineHeight: 1, letterSpacing: '-0.025em', margin: '8px 0 6px', color: palette.text, fontVariantNumeric: 'tabular-nums' } }, naechstWann(naechst.datum)),
      React.createElement('p', { style: { fontSize: '14px', color: palette.mid, margin: 0, lineHeight: leading.relaxed } }, naechst.titel + (naechst.herkunft ? ' · ' + naechst.herkunft : '')),
      naechst.datum < today && React.createElement('button', {
        type: 'button', className: 'mp-link', 'aria-label': t('calendar.wasJetzt') + ' ' + naechst.titel,
        style: { ...knopfRuhig, borderRadius: radius.full, marginTop: space.sm + 'px', padding: '8px 16px', fontSize: text.sm, color: palette.text },
        onClick: () => {
          const ablauf = ABLAEUFE_MIT_STAND.find(a => a.name === naechst.ablauf);
          if (ablauf && ablauf.view && onNavigate) { onNavigate(ablauf.view); return; }
          const [j, m] = naechst.datum.split('-').map(Number);
          setCalYear(j); setCalMonth(m - 1); setSelDate(naechst.datum);
          const el = leisteRef.current;
          if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        },
      }, t('calendar.wasJetzt') + ' ›')
    ),

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
          React.createElement('span', { 'aria-hidden': 'true', style: { width: '8px', height: '8px', borderRadius: radius.full, background: palette.sage, flexShrink: 0 } }),
          React.createElement('span', { style: { flex: 1, minWidth: 0 } }, t('anspruch.items.' + sig.key + '.label')
            + (sig.mitGanzerMiete ? ' (' + t('sozialhilfe.mitGanzerMiete') + ')' : ''))
        ))
      );
    })(),

    // Kalender wie Entwurf G «Zeitleiste» (27.10.2026, Masse aus seiten-v5.html): ‹ Monat › und «Heute»,
    // zwölf Monatsknöpfe, die Tagesleiste als durchgehendes Fenster über den Monatswechsel (am Ersten
    // steht der Monat statt des Wochentags), darunter je laufender Ablauf eine Pille in der Farbe seines
    // Bereichs, die Legende, dann aufklappbar «Ganzer Monat» (Raster) und «Ganzes Jahr» (Jahreskreis,
    // Stebler Studios 27.10.2026: «Monatsknöpfe und Ring»). Tag antippen öffnet das Tagespanel — oder
    // legt eine Aufgabe auf diesen Tag («Noch ohne Tag»). Namen aus Intl (Swiss-Locale).
    (() => {
      const first = new Date(calYear, calMonth, 1);
      const startWd = (first.getDay() + 6) % 7; // Montag = 0 (CH)
      const dim = new Date(calYear, calMonth + 1, 0).getDate();
      const cells = [];
      for (let i = 0; i < startWd; i++) cells.push(null);
      for (let d = 1; d <= dim; d++) cells.push(d);
      const isoOf = (d) => calYear + '-' + String(calMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      const wdNames = []; for (let i = 0; i < 7; i++) wdNames.push(new Date(2024, 0, 1 + i).toLocaleDateString(LOCALE, { weekday: 'short' }));
      const monName = (m) => new Date(2024, m, 1).toLocaleDateString(LOCALE, { month: 'short' });
      const monatJahr = (j, m) => new Date(j, m, 1).toLocaleDateString(LOCALE, { month: 'long', year: 'numeric' });
      const springe = (j, m) => { setCalYear(j); setCalMonth(m); setSelDate(null); };
      const vorher = calMonth === 0 ? [calYear - 1, 11] : [calYear, calMonth - 1];
      const nachher = calMonth === 11 ? [calYear + 1, 0] : [calYear, calMonth + 1];
      const proMonat = Array(12).fill(0);
      offenAlle.forEach(e => { if (e.datum.slice(0, 4) === String(calYear)) proMonat[Number(e.datum.slice(5, 7)) - 1] += 1; });
      const start = fensterStart(calYear, calMonth, today);
      const fenster = fensterTage(start);

      const navBtn = { width: '44px', height: '44px', background: 'none', border: 'none', borderRadius: radius.md, cursor: 'pointer', color: palette.mid, fontFamily: 'inherit', fontSize: '22px', lineHeight: 1 };
      const pille = (aktiv) => ({ flex: '0 0 auto', minHeight: '44px', padding: '0 12px', borderRadius: radius.full, cursor: 'pointer', fontFamily: 'inherit', fontSize: text.xs, color: aktiv ? palette.bg : palette.mid, background: aktiv ? palette.text : 'none', border: '1px solid ' + (aktiv ? palette.text : palette.border), display: 'inline-flex', alignItems: 'center', gap: '5px' });
      // minHeight 44 statt nur aspectRatio 1 (a11y-Prüfung 26.10.2026: bei 375 px 34 px hoch).
      const dayCell = (iso, isToday) => ({ position: 'relative', aspectRatio: '1', minHeight: '44px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', borderRadius: radius.md, cursor: 'pointer', color: palette.text, fontFamily: 'inherit', fontSize: text.xs, fontVariantNumeric: 'tabular-nums', background: iso === selDate ? palette.sand + '2E' : 'none', border: 'none', boxShadow: isToday ? 'inset 0 0 0 1.5px ' + palette.text : 'none' });
      const tagKnopf = { flex: '0 0 46px', minHeight: '88px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '6px 0 0', border: 0, background: 'none', cursor: 'pointer', fontFamily: 'inherit', color: palette.mid };
      // Heute: Zahl im gefüllten Kreis; angetippt: Sand-Ring um die Zahl.
      const tagZahl = (d, isToday, gewaehlt) => React.createElement('span', { style: { width: '32px', height: '32px', borderRadius: radius.full, display: 'grid', placeItems: 'center', fontSize: text.sm, fontVariantNumeric: 'tabular-nums', fontWeight: isToday ? weight.semi : weight.normal, color: isToday ? palette.bg : palette.text, background: isToday ? palette.text : 'none', boxShadow: gewaehlt ? '0 0 0 2px ' + (palette.sandDeep || palette.sand) : 'none' } }, d);
      const markenReihe = (iso) => React.createElement('span', { style: { display: 'flex', gap: '3px', alignItems: 'center', height: '10px' } }, ...markenZeile(iso));
      const aufklapp = { cursor: 'pointer', listStyle: 'none', fontSize: '14px', color: palette.sandDeep || palette.sand, minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' };

      // Band je laufendem Ablauf: Pille in der Bereichsfarbe, Schrift in der Grundfarbe (Entwurf G).
      // Ein Tag = 46 px. Rund, wo sie beginnt und an der Frist endet; gerade, wo sie aus dem Fenster läuft.
      const baender = laufend.map(a => {
        const lage = bandImFenster(a, start, today);
        if (!lage) return null;
        const r = (an) => (an ? '13px' : '0');
        return React.createElement('div', { key: 'band-' + a.name, 'data-ablauf-band': a.name, style: { position: 'relative', height: '26px', width: (fenster.length * 46) + 'px', marginTop: '2px' } },
          React.createElement('div', {
            title: bandText(a),
            style: {
              position: 'absolute', top: 0, height: '26px', left: (lage.von * 46) + 'px', width: ((lage.bis - lage.von + 1) * 46) + 'px', boxSizing: 'border-box',
              borderRadius: [r(!lage.weiterLinks), r(!lage.weiterRechts), r(!lage.weiterRechts), r(!lage.weiterLinks)].join(' '),
              display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '12px', fontWeight: weight.medium, whiteSpace: 'nowrap', overflow: 'hidden',
              // Bandfarbe so gesetzt, dass die Schrift in der Grundfarbe 4.5:1 hält (utils/laufendeAblaeufe.js).
              color: palette.bg, background: bandFarbe(a.bereich, palette),
            },
          }, bandText(a))
        );
      }).filter(Boolean);

      const selReminders = selDate ? reminders.filter(r => r.dueDate === selDate).sort((a, b) => Number(a.done) - Number(b.done)) : [];
      const selAufgaben = selDate ? todos.filter(m => (m.done ? m.erledigtAm : m.tag) === selDate) : [];
      // Legende in den Farben, mit denen die Marken im Beispiel des Entwurfs stehen (Wohnen, Finanzen, Versicherungen).
      const legende = [['frist', 'wohnen'], ['termin', 'finanzen'], ['aufgabe', 'versicherungen']];

      return React.createElement('div', { role: 'group', 'aria-label': t('calendar.calAria'), style: { marginBottom: space.sm } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '4px' } },
          React.createElement('button', { type: 'button', 'aria-label': monatJahr(vorher[0], vorher[1]), style: navBtn, onClick: () => springe(vorher[0], vorher[1]) }, '‹'),
          React.createElement('span', { 'aria-live': 'polite', style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text, minWidth: '120px', textAlign: 'center' } }, monatJahr(calYear, calMonth)),
          React.createElement('button', { type: 'button', 'aria-label': monatJahr(nachher[0], nachher[1]), style: navBtn, onClick: () => springe(nachher[0], nachher[1]) }, '›'),
          React.createElement('button', { type: 'button', style: { ...knopfRuhig, marginLeft: 'auto', borderRadius: radius.full, padding: '8px 14px', fontSize: text.sm }, onClick: () => { setCalYear(now.getFullYear()); setCalMonth(now.getMonth()); setSelDate(today); } }, t('calendar.today'))
        ),
        React.createElement('div', { 'data-monatsknoepfe': 'true', ref: monateRef, style: { display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none', margin: '4px -20px 2px', padding: '4px 20px' } },
          ...Array.from({ length: 12 }, (_, m) => React.createElement('button', {
            key: m, type: 'button', 'aria-pressed': m === calMonth, 'aria-label': monatJahr(calYear, m) + (proMonat[m] ? ' · ' + proMonat[m] : ''),
            style: pille(m === calMonth), onClick: () => { setCalMonth(m); setSelDate(null); },
          }, monName(m).replace('.', ''), proMonat[m] > 0 && m !== calMonth ? React.createElement('span', { 'aria-hidden': 'true', style: { width: '5px', height: '5px', borderRadius: radius.full, background: palette.sage } }) : null))
        ),
        // Tagesleiste und Bänder im selben Wisch-Bereich, bis an den Rand (Entwurf: margin 0 -20px).
        React.createElement('div', {
          ref: leisteRef, role: 'group', 'aria-label': monatJahr(calYear, calMonth),
          style: { overflowX: 'auto', scrollbarWidth: 'none', margin: '0 -20px 2px', padding: '4px 20px', outline: verteilen ? '1px dashed ' + palette.sand : 'none', outlineOffset: '-2px' },
        },
          React.createElement('div', { style: { display: 'flex', width: (fenster.length * 46) + 'px' } },
            ...fenster.map(iso => {
              const d = Number(iso.slice(8)), isToday = iso === today, dt = datumVon(iso);
              return React.createElement('button', {
                key: iso, type: 'button', 'data-heute': isToday ? 'true' : undefined,
                'aria-pressed': iso === selDate, 'aria-label': tagAria(iso),
                style: tagKnopf, onClick: () => tagAntippen(iso),
              },
                React.createElement('span', { style: { fontSize: '10.5px', color: d === 1 ? palette.text : palette.soft, fontWeight: d === 1 ? weight.medium : weight.normal } },
                  d === 1 ? dt.toLocaleDateString(LOCALE, { month: 'short' }).replace('.', '') : dt.toLocaleDateString(LOCALE, { weekday: 'short' })),
                tagZahl(d, isToday, iso === selDate),
                markenReihe(iso)
              );
            })),
          ...baender
        ),
        React.createElement('div', { 'data-legende': 'true', style: { display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: '12px', color: palette.soft, margin: '8px 0 0', alignItems: 'center' } },
          ...legende.map(([art, bereich]) => React.createElement('span', { key: art, style: { display: 'inline-flex', alignItems: 'center', gap: '4px' } },
            React.createElement(ArtMarke, { art, farbe: bereichZeichenFarbe(bereich, palette), palette }), art === 'aufgabe' ? t('calendar.aufgabe') : t('calendar.legende.' + art))),
          React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '4px' } }, React.createElement(ArtMarke, { art: 'frist', erledigt: true, farbe: palette.soft, palette }), t('calendar.legende.erledigt')),
          React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '4px' } }, React.createElement('span', { 'aria-hidden': 'true', style: { width: '10px', height: '10px', borderRadius: radius.full, background: palette.text } }), t('calendar.legende.heute'))
        ),
        // Ganzer Monat — das Monatsraster, aufklappbar
        React.createElement('details', { style: { marginTop: '10px' }, open: verteilen ? true : undefined, onToggle: aufklappSchalter('monat') },
          React.createElement('summary', { className: 'mp-summary', style: aufklapp }, t('calendar.ganzerMonat'), React.createElement('span', { 'aria-hidden': 'true' }, offenIn.monat || verteilen ? '−' : '+')),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center' } },
            ...wdNames.map((w, i) => React.createElement('div', { key: 'w' + i, style: { fontSize: '11px', color: palette.soft, padding: '4px 0' } }, w)),
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
        // Ganzes Jahr — der Jahreskreis (24.10.2026), seit Fassung G aufklappbar unter dem Monat.
        // Darauf nur Hinterlegtes: eigene offene Einträge, die KVG-Kündigung (fristen.js, Werktag davor
        // nach BAG) und die eigene Steuerfrist aus dem Kapitel Behörden. Kantonale IPV-Fristen fehlen
        // bewusst (erst 5 von 26 hinterlegt). Laufende Abläufe mit Frist als Bogen bis zur Frist.
        React.createElement('details', { 'data-ganzes-jahr': 'true', onToggle: aufklappSchalter('jahr') },
          React.createElement('summary', { className: 'mp-summary', style: aufklapp }, t('calendar.ganzesJahr'), React.createElement('span', { 'aria-hidden': 'true' }, offenIn.jahr ? '−' : '+')),
          React.createElement('div', { style: { paddingTop: space.xs + 'px' } },
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
              // Nur Abläufe mit Frist: der Bogen braucht ein Ende. Anfang ist heute (kein Startdatum gespeichert).
              baender: laufend.filter(a => a.frist).map(a => ({ key: a.name, von: today, bis: a.frist, farbe: bereichZeichenFarbe(a.bereich, palette) })),
            })
          )
        ),
        // Tagespanel: Einträge des angetippten Tages + Brücke zum Hinzufügen
        selDate && React.createElement('div', { role: 'region', 'aria-live': 'polite', 'aria-label': datumVon(selDate).toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' }), style: { marginTop: space.sm + 'px', paddingTop: space.sm + 'px', borderTop: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: space.sm + 'px' } }, datumVon(selDate).toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' })),
          selReminders.length + selAufgaben.length > 0
            ? [
              ...selReminders.map(r => React.createElement('div', { key: r.id, style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px' } },
                React.createElement(ArtMarke, { art: artVon(r), erledigt: r.done, farbe: bereichZeichenFarbe(kategorieBereich(r.category), palette), palette, gross: true }),
                React.createElement('span', { style: { flex: 1, minWidth: 0, fontSize: text.sm, color: r.done ? palette.mid : palette.text, textDecoration: r.done ? 'line-through' : 'none' } }, r.title),
                // Löschen steht hier statt in der Liste (Entwurf G zeigt dort nur den Abhak-Kreis).
                React.createElement('button', { type: 'button', 'aria-label': t('common.delete') + ': ' + r.title, onClick: () => deleteReminder(r.id), style: { ...leiseKnopf, color: palette.mid } },
                  React.createElement(Icon, { name: 'kreuz', size: 12 }))
              )),
              ...selAufgaben.map(m => React.createElement('div', { key: m.id, style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', marginBottom: space.xs + 'px' } },
                React.createElement(ArtMarke, { art: 'aufgabe', erledigt: m.done, farbe: bereichZeichenFarbe(merkpunktBereich(m.link), palette), palette, gross: true }),
                React.createElement('span', { style: { fontSize: text.sm, color: m.done ? palette.mid : palette.text, textDecoration: m.done ? 'line-through' : 'none' } }, m.text),
                React.createElement('span', { style: { fontSize: text.xs, color: palette.mid } }, t('calendar.aufgabe'))
              )),
            ]
            : React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.sm + 'px' } }, t('calendar.noRemindersTitle')),
          React.createElement('button', { type: 'button', style: { ...knopfRuhig, borderRadius: radius.full, marginTop: space.xs + 'px' }, onClick: () => { setNewDate(selDate); setView('add'); } }, '+ ' + t('calendar.addReminder'))
        )
      );
    })(),

    // «Bevorstehend / Erledigt» mit Zahl (Strich darunter) als Knopfgruppe — ohne Tab-Panel wäre role=tab
    // eine falsche Ansage (a11y-Prüfung 27.10.2026). Darunter «+ Erinnerung hinzufügen» als Pille.
    React.createElement('div', { role: 'group', 'aria-label': t('calendar.upcoming') + ' / ' + t('calendar.completed'), style: { display: 'flex', gap: '4px', borderBottom: '1px solid ' + palette.border, marginTop: '16px', marginBottom: '4px' } },
      React.createElement('button', { type: 'button', 'aria-pressed': view === 'upcoming', style: reiter(view === 'upcoming'), onClick: () => setView('upcoming') }, offenAlle.length + ' ' + t('calendar.upcoming')),
      React.createElement('button', { type: 'button', 'aria-pressed': view === 'completed', style: reiter(view === 'completed'), onClick: () => setView('completed') }, erledigtAlle.length + ' ' + t('calendar.completed'))
    ),
    // Ruhiger Hinweis, wo gelöscht wird (Stebler Studios 27.10.2026): seit Entwurf G nicht mehr als × in der
    // Liste, sondern im Tagespanel. Nur, wenn es etwas zu löschen gibt.
    upcoming.length + completed.length > 0 && React.createElement('p', { 'data-loesch-hinweis': 'true', style: { fontSize: text.xs, color: palette.soft, margin: space.xs + 'px 0 0', lineHeight: leading.normal } }, t('calendar.loeschHinweis')),
    React.createElement('button', {
      type: 'button', 'aria-expanded': view === 'add',
      style: { padding: '10px 16px', minHeight: '44px', marginTop: '12px', marginBottom: space.sm, background: view === 'add' ? palette.sand : 'none', color: view === 'add' ? palette.onSand : palette.text, border: '1px solid ' + (view === 'add' ? palette.sand : palette.border), borderRadius: radius.full, cursor: 'pointer', font: 'inherit', fontSize: text.sm, fontWeight: weight.semi },
      onClick: () => setView(view === 'add' ? 'upcoming' : 'add'),
    }, '+ ' + t('calendar.addReminder')),

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
              gruppenKopf(t('calendar.overdue')),
              gUeberfaellig.map(e => e.el())
            ),

            // Due today
            gHeute.length > 0 && React.createElement('div', { style: { marginBottom: space.md } },
              gruppenKopf(t('calendar.today')),
              gHeute.map(e => e.el())
            ),

            // This week
            gWoche.length > 0 && React.createElement('div', { style: { marginBottom: space.md } },
              gruppenKopf(t('calendar.thisWeek')),
              gWoche.map(e => e.el())
            ),

            // Later
            gSpaeter.length > 0 && React.createElement('div', { style: { marginBottom: space.md } },
              gruppenKopf(t('calendar.later')),
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
      React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, margin: '0 0 ' + space.sm + 'px' } }, t('calendar.nochOhneTag'),
        React.createElement('span', { style: { fontWeight: weight.normal, color: palette.mid, marginLeft: '8px', fontSize: text.xs } }, t('calendar.ausMerkliste'))),
      React.createElement('div', { role: 'status', 'aria-live': 'polite' },
        verteilen && React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: space.sm, marginBottom: space.sm, fontSize: text.sm, color: palette.text } },
          React.createElement('span', null, t('calendar.jetztTagAntippen')),
          React.createElement('button', { type: 'button', style: knopfRuhig, onClick: () => setVerteilen(null) }, t('common.cancel'))
        )
      ),
      ...ohneTag.map(m => React.createElement('div', { key: m.id, style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid ' + palette.border } },
        (() => { const f = bereichZeichenFarbe(merkpunktBereich(m.link), palette); return React.createElement('span', { 'aria-hidden': 'true', style: { width: '36px', height: '36px', borderRadius: radius.md, display: 'grid', placeItems: 'center', flexShrink: 0, background: f + '2E', boxShadow: 'inset 0 0 0 1px ' + f + '4D', color: f } }, React.createElement(Icon, { name: merkpunktZeichen(m.link), size: 16 })); })(),
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
