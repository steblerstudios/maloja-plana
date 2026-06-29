import React, { useState, useEffect } from 'react';
import { Icon } from './IconSystem.jsx';
import { downloadICS } from './utils/icsExport.js';
import { text, weight, space, radius, fontFamily, ease, duration } from './config/tokens.js';
import { loadReminders, saveReminders } from './utils/reminders.js';

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

// Pre-built templates for Swiss life
const TEMPLATES = (t) => [
  { title: t('calendar.templates.doctorYearly'), category: 'health', recurrence: 'yearly', daysFromNow: 30 },
  { title: t('calendar.templates.dentistYearly'), category: 'health', recurrence: 'yearly', daysFromNow: 60 },
  { title: t('calendar.templates.gynYearly'), category: 'health', recurrence: 'yearly', daysFromNow: 90 },
  { title: t('calendar.templates.taxDeadline'), category: 'finance', recurrence: 'yearly', daysFromNow: 120 },
  { title: t('calendar.templates.insuranceRenewal'), category: 'insurance', recurrence: 'yearly', daysFromNow: 180 },
  { title: t('calendar.templates.permitRenewal'), category: 'admin', recurrence: 'yearly', daysFromNow: 365 },
  { title: t('calendar.templates.ravAppointment'), category: 'admin', recurrence: 'monthly', daysFromNow: 14 },
  { title: t('calendar.templates.integrationCourse'), category: 'education', recurrence: 'weekly', daysFromNow: 7 },
  { title: t('calendar.templates.vaccinations'), category: 'health', recurrence: 'yearly', daysFromNow: 180 },
  { title: t('calendar.templates.kkChange'), category: 'insurance', recurrence: 'yearly', daysFromNow: daysBetween(todayISO(), new Date().getFullYear() + '-11-30') },
];

// Icon keys mapping to IconSystem — used for category display
const CATEGORY_ICON_KEYS = {
  health: 'health', admin: 'behoerden', finance: 'money', insurance: 'insurance',
  work: 'work', family: 'family', education: 'ausbildung', housing: 'home',
  legal: 'legal', personal: 'basis'
};

// ─── Component ──────────────────────────────────────────────
export const CalendarReminders = ({ palette, t, data }) => {
  const [reminders, setReminders] = useState(loadReminders);
  const [view, setView] = useState('upcoming'); // upcoming, completed, add
  const [showTemplates, setShowTemplates] = useState(false);

  // New reminder form
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCategory, setNewCategory] = useState('personal');
  const [newRecurrence, setNewRecurrence] = useState('once');
  const [newNotes, setNewNotes] = useState('');

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
      done: false,
      completedDate: null,
      createdDate: todayISO()
    };
    setReminders(prev => [...prev, reminder]);
    setNewTitle(''); setNewDate(''); setNewNotes('');
    setNewCategory('personal'); setNewRecurrence('once');
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
      notes: '',
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
        style: { textAlign: 'center', fontSize: text.sm, fontWeight: weight.semi, color: palette.sage, marginBottom: '6px', animation: 'mp-check-pop 0.4s ease-out forwards' }
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
              padding: '6px 10px', background: palette.rose,
              color: '#fff', border: 'none', borderRadius: '4px',
              cursor: 'pointer', fontSize: text.xs, fontWeight: weight.semi
            }
          }, '✕')
        )
      )
    );
  };

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
    React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md, display: 'flex', alignItems: 'center', gap: space.sm } }, React.createElement(Icon, { name: 'cowbell', size: 20 }), t('calendar.title')),

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
        React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: view === 'add' ? '#fff' : palette.text } }, '+'),
        React.createElement('div', { style: { fontSize: text.xs, color: view === 'add' ? '#fff' : palette.mid } }, t('calendar.addReminder'))
      )
    ),

    // Add view
    view === 'add' && React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, marginBottom: space.md, border: '1px solid ' + palette.sand } },
      React.createElement('h3', { style: { fontSize: text.body, fontWeight: weight.semi, marginBottom: '12px' } }, t('calendar.addReminder')),

      React.createElement('input', {
        type: 'text', value: newTitle,
        onChange: (e) => setNewTitle(e.target.value),
        placeholder: t('calendar.addReminder') + '...',
        style: inputStyle
      }),

      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: space.sm, marginBottom: '12px' } },
        React.createElement('div', null,
          React.createElement('label', { style: { fontSize: text.sm, color: palette.mid, display: 'block', marginBottom: space.xs } }, t('chapterView.expiryDate')),
          React.createElement('input', { type: 'date', value: newDate, onChange: (e) => setNewDate(e.target.value), style: { ...inputStyle, marginBottom: 0 } })
        ),
        React.createElement('div', null,
          React.createElement('label', { style: { fontSize: text.sm, color: palette.mid, display: 'block', marginBottom: space.xs } }, t('calendar.category')),
          React.createElement('select', { value: newCategory, onChange: (e) => setNewCategory(e.target.value), style: { ...inputStyle, marginBottom: 0 } },
            categories.map(cat => React.createElement('option', { key: cat, value: cat }, t('calendar.categories.' + cat)))
          )
        )
      ),

      React.createElement('div', { style: { marginBottom: '12px' } },
        React.createElement('label', { style: { fontSize: text.sm, color: palette.mid, display: 'block', marginBottom: space.xs } }, t('calendar.recurring')),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } },
          ['once', 'daily', 'weekly', 'monthly', 'quarterly', 'halfYearly', 'yearly'].map(freq =>
            React.createElement('button', {
              key: freq,
              onClick: () => setNewRecurrence(freq),
              style: {
                padding: '6px 12px', borderRadius: '4px', cursor: 'pointer',
                fontSize: text.sm, fontWeight: newRecurrence === freq ? '600' : '400',
                background: newRecurrence === freq ? palette.sand : palette.surface,
                color: newRecurrence === freq ? '#fff' : palette.text,
                border: '1px solid ' + (newRecurrence === freq ? palette.sand : palette.border)
              }
            }, freq === 'once' ? t('calendar.oneTime') : t('calendar.' + freq))
          )
        )
      ),

      React.createElement('textarea', {
        value: newNotes, onChange: (e) => setNewNotes(e.target.value),
        placeholder: t('common.optional') + '...',
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
              React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } }, '↻ ' + t('calendar.' + tmpl.recurrence))
            )
          )
        )
      )
    ),

    // Upcoming view
    view === 'upcoming' && React.createElement('div', null,
      upcoming.length === 0
        ? React.createElement('div', { style: { padding: '40px 20px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, textAlign: 'center' } },
            React.createElement('div', { style: { marginBottom: '12px' } }, React.createElement(Icon, { name: 'cowbell', size: 28 })),
            React.createElement('p', { style: { fontSize: text.body, color: palette.text, margin: '0 0 6px 0' } }, t('calendar.noReminders'))
          )
        : React.createElement('div', null,
            // Overdue section
            overdue.length > 0 && React.createElement('div', { style: { marginBottom: space.md } },
              React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.rose, marginBottom: space.sm, textTransform: 'uppercase' } }, t('calendar.overdue') + ' (' + overdue.length + ')'),
              overdue.map(r => renderReminderCard(r))
            ),

            // Due today
            dueToday.length > 0 && React.createElement('div', { style: { marginBottom: space.md } },
              React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.gold, marginBottom: space.sm, textTransform: 'uppercase' } }, t('calendar.today') + ' (' + dueToday.length + ')'),
              dueToday.map(r => renderReminderCard(r))
            ),

            // This week
            dueSoon.length > 0 && React.createElement('div', { style: { marginBottom: space.md } },
              React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.sky, marginBottom: space.sm, textTransform: 'uppercase' } }, t('calendar.thisWeek') + ' (' + dueSoon.length + ')'),
              dueSoon.map(r => renderReminderCard(r))
            ),

            // Later
            upcoming.filter(r => r.dueDate > today && daysBetween(today, r.dueDate) > 7).length > 0 && React.createElement('div', { style: { marginBottom: space.md } },
              React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.mid, marginBottom: space.sm, textTransform: 'uppercase' } }, t('calendar.later')),
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
