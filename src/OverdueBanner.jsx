import React from 'react';
import { text, weight, radius } from './config/tokens.js';
import { Icon } from './IconSystem.jsx';

// ─── Overdue Reminders Banner ──────────────────────────────
// Shows on Dashboard when there are overdue or due-today reminders.
// Bridges Calendar and Dashboard without duplicating state.
// Reads directly from localStorage (same key as CalendarReminders).

const STORAGE_KEY = 'or5_reminders';

const loadReminders = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
};

const todayISO = () => new Date().toISOString().split('T')[0];

export const OverdueBanner = ({ palette, t, onNavigate }) => {
  const reminders = loadReminders();
  const today = todayISO();

  const overdue = reminders.filter(r => !r.done && r.dueDate < today);
  const dueToday = reminders.filter(r => !r.done && r.dueDate === today);

  if (overdue.length === 0 && dueToday.length === 0) return null;

  const total = overdue.length + dueToday.length;

  return React.createElement('button', {
    onClick: () => onNavigate('calendar'),
    'aria-label': t ? t('overdue.ariaLabel', { count: total }) : total + ' reminders need attention',
    style: {
      width: '100%',
      padding: '12px 16px',
      marginBottom: '16px',
      background: overdue.length > 0
        ? 'linear-gradient(135deg, ' + palette.rose + '22, ' + palette.rose + '11)'
        : 'linear-gradient(135deg, ' + palette.gold + '22, ' + palette.gold + '11)',
      border: '1px solid ' + (overdue.length > 0 ? palette.rose + '44' : palette.gold + '44'),
      borderRadius: radius.sm,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      textAlign: 'left',
      color: palette.text,
      fontFamily: 'DM Sans, sans-serif',
      transition: 'all 0.2s',
    }
  },
    React.createElement('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
      }
    },
      React.createElement(Icon, { name: 'cowbell', size: 18, color: overdue.length > 0 ? palette.rose : palette.gold }),
      React.createElement('span', {
        style: { fontWeight: weight.bold, fontSize: text.body, color: overdue.length > 0 ? palette.rose : palette.gold }
      }, total)
    ),

    React.createElement('div', { style: { flex: 1 } },
      overdue.length > 0 && React.createElement('div', {
        style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: dueToday.length > 0 ? '2px' : 0 }
      }, t ? t('overdue.overdueCount', { count: overdue.length }) : overdue.length + ' overdue'),

      dueToday.length > 0 && React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid }
      }, t ? t('overdue.dueTodayCount', { count: dueToday.length }) : dueToday.length + ' due today')
    ),

    React.createElement('span', {
      style: { fontSize: text.sm, color: palette.mid, flexShrink: 0 }
    }, '→')
  );
};

export default OverdueBanner;
