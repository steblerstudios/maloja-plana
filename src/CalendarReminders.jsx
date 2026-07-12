import React, { useState, useEffect } from 'react';
import { Eyebrow, PageTitle, PanelTitle } from './components/Heading.jsx';
import { Icon } from './IconSystem.jsx';
import { downloadICS } from './utils/icsExport.js';
import { text, weight, space, radius, fontFamily, ease, duration, leading } from './config/tokens.js';
import { loadReminders, saveReminders } from './utils/reminders.js';
import { EmptyState } from './components/EmptyState.jsx';
import { anspruchSignaleListe } from './data/anspruchSignale.js';

// ─── Helpers ────────────────────────────────────────────────
const daysBetween = (a, b) => {
  const msPerDay = 86400000;
  return Math.round((new Date(b) - new Date(a)) / msPerDay);
};

const todayISO = () => new Date().toISOString().split('T')[0];

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

// ─── Component ──────────────────────────────────────────────
export const CalendarReminders = ({ palette, t, data, onNavigate, isMobile }) => {
  const [reminders, setReminders] = useState(loadReminders);
  const [view, setView] = useState('upcoming'); // upcoming, completed, add
  const [showTemplates, setShowTemplates] = useState(false);
  // Visueller Kalender: Jahresband (12 Monate) + Monatsraster des gewählten Monats.
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selDate, setSelDate] = useState(null); // ISO des angetippten Tages

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
  useEffect(() => { saveReminders(reminders); }, [reminders]);

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
    const dueDate = new Date(Date.now() + (template.daysFromNow || 30) * 86400000).toISOString().split('T')[0];
    const reminder = {
      id: Date.now().toString() + '_' + Math.random().toString(36).slice(2, 8),
      title: template.title,
      dueDate,
      category: template.category,
      recurrence: template.recurrence,
      // Deckungs-Orientierung wandert in die Notiz, damit sie am Termin bleibt.
      notes: template.coverage || '',
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
  const overdue = upcoming.filter(r => r.dueDate < today);
  const dueToday = upcoming.filter(r => r.dueDate === today);
  const dueSoon = upcoming.filter(r => r.dueDate > today && daysBetween(today, r.dueDate) <= 7);

  const getDueLabel = (dueDate) => {
    const days = daysBetween(today, dueDate);
    if (days < 0) return t('calendar.overdueDays', { days: Math.abs(days) });
    if (days === 0) return t('calendar.dueToday');
    if (days === 1) return t('calendar.dueTomorrow');
    return t('calendar.dueIn', { days });
  };

  const getDueColor = (dueDate) => {
    const days = daysBetween(today, dueDate);
    if (days < 0) return palette.rose;
    if (days === 0) return palette.gold;
    if (days <= 7) return palette.sky;
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
        transition: `all ${duration.slow}ms ${ease}`,
      }
    },
      isJustDone && React.createElement('div', {
        style: { textAlign: 'center', fontSize: text.sm, fontWeight: weight.semi, color: palette.sageDeep, marginBottom: '6px', animation: 'mp-check-pop 0.4s ease-out forwards' }
      }, '✓ ' + (t('calendar.nicelyDone') || 'Erledigt')),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '12px' } },
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: space.sm, marginBottom: space.xs } },
            React.createElement(Icon, { name: iconKey, size: 16 }),
            React.createElement('span', { style: { fontWeight: weight.semi, fontSize: text.sm, textDecoration: r.done ? 'line-through' : 'none' } }, r.title)
          ),
          React.createElement('div', { style: { display: 'flex', gap: space.sm, alignItems: 'center', fontSize: text.sm, color: palette.mid, marginTop: space.xs } },
            React.createElement('span', { style: { color: dueColor, fontWeight: weight.semi } }, r.done ? '✓ ' + t('calendar.completed') : getDueLabel(r.dueDate)),
            React.createElement('span', null, '|'),
            React.createElement('span', null, catLabel),
            r.recurrence !== 'once' && React.createElement('span', null, '| ↻ ' + t('calendar.' + r.recurrence))
          ),
          r.coverageThisYear && React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: '4px', fontStyle: 'italic' } }, t('calendar.coverageThisYear.cardPrefix') + ': ' + t('calendar.coverageThisYear.' + r.coverageThisYear)),
          r.notes && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '6px', fontStyle: 'italic' } }, r.notes)
        ),
        React.createElement('div', { style: { display: 'flex', gap: space.xs, flexShrink: 0 } },
          React.createElement('button', {
            'aria-label': r.done ? t('calendar.undo') : t('calendar.markDone'),
            onClick: () => toggleDone(r.id),
            style: {
              padding: '6px 10px', background: r.done ? palette.gold : palette.sage,
              color: '#000', border: 'none', borderRadius: '4px',
              cursor: 'pointer', fontSize: text.xs, fontWeight: weight.semi
            }
          }, r.done ? '↩' : '✓'),
          React.createElement('button', {
            'aria-label': t('common.delete'),
            onClick: () => deleteReminder(r.id),
            style: {
              padding: '6px 10px', background: palette.roseBtn,
              color: '#fff', border: 'none', borderRadius: '4px',
              cursor: 'pointer', fontSize: text.xs, fontWeight: weight.semi
            }
          }, '✕')
        )
      )
    );
  };

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'cowbell', size: 22 }), style: { marginBottom: space.md } }, t('calendar.title')),

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
          React.createElement('span', { style: { flex: 1, minWidth: 0 } }, t('anspruch.items.' + sig.key + '.label')),
          React.createElement('span', { 'aria-hidden': 'true', style: { color: palette.sage, flexShrink: 0 } }, '→')
        ))
      );
    })(),

    // Visueller Kalender: Jahresband (12 Monate, Monatspunkte) + Monatsraster
    // (Tagespunkte). Ruhige Übersicht über der Manager-Liste; Tag antippen öffnet
    // ein Tagespanel mit Brücke zum Hinzufügen-Formular. Monatsnamen/Wochentage
    // aus Intl (Swiss-Locale), damit keine 12×5-Namenspflege nötig ist.
    (() => {
      const LOCALE = t('calendar.locale') || 'de-CH';
      const byDate = {};
      reminders.forEach(r => { if (!r.done) (byDate[r.dueDate] = byDate[r.dueDate] || []).push(r); });
      const monthCount = Array(12).fill(0), monthOverdue = Array(12).fill(false);
      Object.keys(byDate).forEach(d => { const dt = new Date(d); if (dt.getFullYear() === calYear) { monthCount[dt.getMonth()] += byDate[d].length; if (d < today) monthOverdue[dt.getMonth()] = true; } });

      const first = new Date(calYear, calMonth, 1);
      const startWd = (first.getDay() + 6) % 7; // Montag = 0 (CH)
      const dim = new Date(calYear, calMonth + 1, 0).getDate();
      const cells = [];
      for (let i = 0; i < startWd; i++) cells.push(null);
      for (let d = 1; d <= dim; d++) cells.push(d);
      const isoOf = (d) => calYear + '-' + String(calMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      const wdNames = []; for (let i = 0; i < 7; i++) wdNames.push(new Date(2024, 0, 1 + i).toLocaleDateString(LOCALE, { weekday: 'short' }));
      const monName = (m) => new Date(2024, m, 1).toLocaleDateString(LOCALE, { month: 'short' });

      const navBtn = { background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm, width: '30px', height: '30px', cursor: 'pointer', color: palette.text, fontFamily: 'inherit', fontSize: text.md, lineHeight: 1 };
      const monthBtn = (m) => ({ position: 'relative', ...(isMobile ? { minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: space.sm + 'px' } : { padding: space.xs + 'px 0 ' + (space.sm) + 'px' }), border: '1px solid ' + (m === calMonth ? palette.sand : 'transparent'), background: m === calMonth ? palette.sand + '22' : 'none', borderRadius: radius.sm, cursor: 'pointer', color: palette.text, fontFamily: 'inherit', fontSize: text.xs, textAlign: 'center' });
      const dayCell = (iso, isToday) => ({ position: 'relative', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: radius.sm, cursor: 'pointer', color: palette.text, fontFamily: 'inherit', fontSize: text.xs, background: iso === selDate ? palette.sand + '2E' : 'none', border: '1px solid ' + (iso === selDate ? palette.sand : (isToday ? palette.sky : 'transparent')), fontWeight: isToday ? weight.semi : weight.normal });
      const dot = (col) => React.createElement('span', { 'aria-hidden': 'true', style: { position: 'absolute', bottom: '3px', left: '50%', transform: 'translateX(-50%)', width: '5px', height: '5px', borderRadius: '50%', background: col } });

      const selReminders = selDate ? reminders.filter(r => r.dueDate === selDate).sort((a, b) => Number(a.done) - Number(b.done)) : [];

      return React.createElement('div', { role: 'group', 'aria-label': t('calendar.calAria'), style: { background: palette.up, border: '1px solid ' + palette.border, borderRadius: radius.sm, padding: space.md + 'px', marginBottom: space.md } },
        // Jahr-Kopf: ‹ Jahr › + Heute
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.sm + 'px' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px' } },
            React.createElement('button', { type: 'button', 'aria-label': String(calYear - 1), style: navBtn, onClick: () => setCalYear(calYear - 1) }, '‹'),
            React.createElement('span', { style: { fontSize: text.md, fontWeight: weight.semi, color: palette.text, minWidth: '52px', textAlign: 'center' } }, calYear),
            React.createElement('button', { type: 'button', 'aria-label': String(calYear + 1), style: navBtn, onClick: () => setCalYear(calYear + 1) }, '›')
          ),
          React.createElement('button', { type: 'button', style: { background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm, padding: '5px 12px', fontSize: text.xs, color: palette.mid, cursor: 'pointer', fontFamily: 'inherit' }, onClick: () => { setCalYear(now.getFullYear()); setCalMonth(now.getMonth()); setSelDate(today); } }, t('calendar.today'))
        ),
        // Jahresband: 12 Monate mit Punkt bei Terminen
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(' + (isMobile ? 6 : 12) + ', 1fr)', gap: isMobile ? '6px 4px' : '2px', marginBottom: space.md + 'px' } },
          ...Array.from({ length: 12 }, (_, m) => React.createElement('button', {
            key: m, type: 'button', 'aria-pressed': m === calMonth, 'aria-label': monName(m) + (monthCount[m] ? ' · ' + monthCount[m] : ''),
            style: monthBtn(m), onClick: () => { setCalMonth(m); setSelDate(null); },
          }, monName(m), monthCount[m] > 0 ? dot(monthOverdue[m] ? palette.rose : palette.sage) : null))
        ),
        // Wochentagskopf (Mo-first)
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px', marginBottom: space.xs + 'px' } },
          ...wdNames.map((w, i) => React.createElement('div', { key: i, style: { textAlign: 'center', fontSize: text.xs, color: palette.mid } }, w))
        ),
        // Monatsraster
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' } },
          ...cells.map((d, i) => {
            if (d === null) return React.createElement('div', { key: 'b' + i });
            const iso = isoOf(d), isToday = iso === today, cnt = byDate[iso] ? byDate[iso].length : 0;
            return React.createElement('button', {
              key: iso, type: 'button', 'aria-label': new Date(iso).toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' }) + (cnt ? ' · ' + cnt : ''),
              'aria-pressed': iso === selDate, style: dayCell(iso, isToday), onClick: () => setSelDate(iso === selDate ? null : iso),
            }, d, cnt > 0 ? dot(getDueColor(iso)) : null);
          })
        ),
        // Tagespanel: Einträge des angetippten Tages + Brücke zum Hinzufügen
        selDate && React.createElement('div', { style: { marginTop: space.md + 'px', paddingTop: space.sm + 'px', borderTop: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: space.sm + 'px' } }, new Date(selDate).toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' })),
          selReminders.length > 0
            ? selReminders.map(r => React.createElement('div', { key: r.id, style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', marginBottom: space.xs + 'px' } },
                React.createElement('span', { 'aria-hidden': 'true', style: { width: '6px', height: '6px', borderRadius: '50%', background: r.done ? palette.sage : getDueColor(r.dueDate), flexShrink: 0 } }),
                React.createElement('span', { style: { fontSize: text.sm, color: r.done ? palette.mid : palette.text, textDecoration: r.done ? 'line-through' : 'none' } }, r.title)
              ))
            : React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.sm + 'px' } }, t('calendar.noRemindersTitle')),
          React.createElement('button', { type: 'button', style: { background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm, padding: '5px 12px', fontSize: text.xs, color: palette.text, cursor: 'pointer', fontFamily: 'inherit', marginTop: space.xs + 'px' }, onClick: () => { setNewDate(selDate); setView('add'); } }, '+ ' + t('calendar.addReminder'))
        )
      );
    })(),

    // Kalender-Export (.ics) — Termine ins eigene Kalender-App übernehmen
    upcoming.length > 0 && React.createElement('div', { style: { marginBottom: space.md } },
      React.createElement('button', {
        type: 'button',
        onClick: () => downloadICS(upcoming, t),
        style: {
          background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm,
          padding: space.xs + 'px ' + space.md + 'px', fontSize: text.xs, color: palette.mid,
          cursor: 'pointer', fontFamily: 'inherit',
        }
      }, '↧ ' + t('calendar.exportIcs')),
      React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.xs } }, t('calendar.exportIcsHint'))
    ),

    // Stats
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: space.sm, marginBottom: space.md } },
      React.createElement('button', { type: 'button', 'aria-pressed': view === 'upcoming', style: { padding: '12px', background: palette.up, color: palette.text, borderRadius: radius.sm, textAlign: 'center', cursor: 'pointer', border: '1px solid ' + (view === 'upcoming' ? palette.sand : palette.border), font: 'inherit' }, onClick: () => setView('upcoming') },
        React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text } }, upcoming.length),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t('calendar.upcoming'))
      ),
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: overdue.length > 0 ? palette.rose : palette.text } }, overdue.length),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t('calendar.overdue'))
      ),
      React.createElement('button', { type: 'button', 'aria-pressed': view === 'completed', style: { padding: '12px', background: palette.up, color: palette.text, borderRadius: radius.sm, textAlign: 'center', cursor: 'pointer', border: '1px solid ' + (view === 'completed' ? palette.sand : palette.border), font: 'inherit' }, onClick: () => setView('completed') },
        React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text } }, completed.length),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t('calendar.completed'))
      ),
      React.createElement('button', { type: 'button', 'aria-pressed': view === 'add', style: { padding: '12px', background: view === 'add' ? palette.sand : palette.up, color: palette.text, borderRadius: radius.sm, textAlign: 'center', cursor: 'pointer', border: '1px solid ' + (view === 'add' ? palette.sand : palette.border), font: 'inherit' }, onClick: () => setView('add') },
        React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: view === 'add' ? palette.onSand : palette.text } }, '+'),
        React.createElement('div', { style: { fontSize: text.xs, color: view === 'add' ? palette.onSand : palette.mid } }, t('calendar.addReminder'))
      )
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
          React.createElement('label', { style: { fontSize: text.sm, color: palette.mid, display: 'block', marginBottom: space.xs } }, t('chapterView.expiryDate')),
          React.createElement('input', { type: 'date', value: newDate, onChange: (e) => setNewDate(e.target.value), 'aria-label': t('chapterView.expiryDate'), style: { ...inputStyle, marginBottom: 0 } })
        ),
        React.createElement('div', null,
          React.createElement('label', { style: { fontSize: text.sm, color: palette.mid, display: 'block', marginBottom: space.xs } }, t('calendar.category')),
          React.createElement('select', { value: newCategory, onChange: (e) => setNewCategory(e.target.value), 'aria-label': t('calendar.category'), style: { ...inputStyle, marginBottom: 0 } },
            categories.map(cat => React.createElement('option', { key: cat, value: cat }, t('calendar.categories.' + cat)))
          )
        )
      ),

      // Optional, nur bei Gesundheit: letzter Besuch → berechnet den nächsten Termin
      newCategory === 'health' && React.createElement('div', { style: { marginBottom: '12px' } },
        React.createElement('label', { style: { fontSize: text.sm, color: palette.mid, display: 'block', marginBottom: space.xs } }, t('calendar.lastVisit.label')),
        React.createElement('input', {
          type: 'date',
          value: newLastVisit,
          'aria-label': t('calendar.lastVisit.label'),
          onChange: (e) => { const v = e.target.value; setNewLastVisit(v); if (v) setNewDate(nextDueFrom(v, newRecurrence)); },
          style: { ...inputStyle, marginBottom: '4px' }
        }),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.soft } }, t('calendar.lastVisit.hint'))
      ),

      // Optional, nur bei Gesundheit: Deckung dieses Jahr (gedeckt/selbst/unsicher; erneut klicken = leer)
      newCategory === 'health' && React.createElement('div', { style: { marginBottom: '12px' } },
        React.createElement('label', { style: { fontSize: text.sm, color: palette.mid, display: 'block', marginBottom: space.xs } }, t('calendar.coverageThisYear.label')),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } },
          ['covered', 'selfpay', 'unsure'].map(opt =>
            React.createElement('button', {
              key: opt,
              type: 'button',
              'aria-pressed': newCoverage === opt,
              onClick: () => setNewCoverage(newCoverage === opt ? '' : opt),
              style: {
                padding: '6px 12px', borderRadius: '4px', cursor: 'pointer',
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
        React.createElement('label', { style: { fontSize: text.sm, color: palette.mid, display: 'block', marginBottom: space.xs } }, t('calendar.recurring')),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } },
          ['once', 'daily', 'weekly', 'monthly', 'quarterly', 'halfYearly', 'yearly'].map(freq =>
            React.createElement('button', {
              key: freq,
              onClick: () => { setNewRecurrence(freq); if (newLastVisit) setNewDate(nextDueFrom(newLastVisit, freq)); },
              style: {
                padding: '6px 12px', borderRadius: '4px', cursor: 'pointer',
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
          background: newTitle.trim() && newDate ? palette.sage : palette.mid,
          color: '#000', border: 'none', cursor: newTitle.trim() && newDate ? 'pointer' : 'not-allowed',
          fontWeight: weight.semi, fontSize: text.sm
        }
      }, '+ ' + t('calendar.addReminder')),

      // Templates
      React.createElement('div', { style: { marginTop: space.md } },
        React.createElement('button', {
          'aria-expanded': showTemplates,
          onClick: () => setShowTemplates(!showTemplates),
          style: { width: '100%', padding: space.sm, background: 'transparent', color: palette.mid, border: '1px solid ' + palette.border, borderRadius: radius.sm, cursor: 'pointer', fontSize: text.sm, fontWeight: weight.semi }
        }, (showTemplates ? '▼' : '▶') + ' ' + t('calendar.templates.title')),

        showTemplates && React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '6px', marginTop: space.sm } },
          TEMPLATES(t).map((tmpl, idx) =>
            React.createElement('button', {
              key: idx,
              onClick: () => addFromTemplate(tmpl),
              style: {
                padding: '8px 12px', background: palette.surface, border: '1px solid ' + palette.border,
                borderRadius: radius.sm, cursor: 'pointer', fontSize: text.sm, textAlign: 'left',
                color: palette.text, transition: `all ${duration.normal}ms ${ease}`
              },
              onMouseEnter: (e) => { e.currentTarget.style.borderColor = palette.sand; },
              onMouseLeave: (e) => { e.currentTarget.style.borderColor = palette.border; }
            },
              React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, React.createElement(Icon, { name: CATEGORY_ICON_KEYS[tmpl.category] || 'basis', size: 14 }), tmpl.title),
              React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } }, '↻ ' + t('calendar.' + tmpl.recurrence)),
              // Ruhige Deckungs-Orientierung (KVG-faktisch, keine medizinische Empfehlung)
              tmpl.coverage && React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: '4px', lineHeight: leading.normal, fontStyle: 'italic' } }, 'ⓘ ' + tmpl.coverage)
            )
          )
        )
      )
    ),

    // Upcoming view
    view === 'upcoming' && React.createElement('div', null,
      upcoming.length === 0
        ? React.createElement(EmptyState, {
            palette,
            icon: React.createElement(Icon, { name: 'cowbell', size: 28, color: palette.mid }),
            title: t('calendar.noRemindersTitle'),
            description: t('calendar.noReminders'),
          })
        : React.createElement('div', null,
            // Overdue section
            overdue.length > 0 && React.createElement('div', { style: { marginBottom: space.md } },
              React.createElement(Eyebrow, { palette, style: { color: palette.roseDeep, marginBottom: space.sm } }, t('calendar.overdue') + ' (' + overdue.length + ')'),
              overdue.map(r => renderReminderCard(r))
            ),

            // Due today
            dueToday.length > 0 && React.createElement('div', { style: { marginBottom: space.md } },
              React.createElement(Eyebrow, { palette, style: { color: palette.goldDeep, marginBottom: space.sm } }, t('calendar.today') + ' (' + dueToday.length + ')'),
              dueToday.map(r => renderReminderCard(r))
            ),

            // This week
            dueSoon.length > 0 && React.createElement('div', { style: { marginBottom: space.md } },
              React.createElement(Eyebrow, { palette, style: { color: palette.skyDeep, marginBottom: space.sm } }, t('calendar.thisWeek') + ' (' + dueSoon.length + ')'),
              dueSoon.map(r => renderReminderCard(r))
            ),

            // Later
            upcoming.filter(r => r.dueDate > today && daysBetween(today, r.dueDate) > 7).length > 0 && React.createElement('div', { style: { marginBottom: space.md } },
              React.createElement(Eyebrow, { palette, style: { color: palette.mid, marginBottom: space.sm } }, t('calendar.later')),
              upcoming.filter(r => r.dueDate > today && daysBetween(today, r.dueDate) > 7).map(r => renderReminderCard(r))
            )
          )
    ),

    // Completed view
    view === 'completed' && React.createElement('div', null,
      completed.length === 0
        ? React.createElement('div', { style: { textAlign: 'center', padding: '40px 20px', color: palette.mid, fontSize: text.sm } }, t('common.none'))
        : completed.map(r => renderReminderCard(r))
    ),

    // Disclaimer
    React.createElement('div', { style: { marginTop: space.md, padding: '10px', background: palette.up, borderRadius: radius.sm, fontSize: text.xs, color: palette.mid } },
      'ⓘ ' + t('calendar.disclaimer')
    )
  );
};

export default CalendarReminders;
