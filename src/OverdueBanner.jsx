import React from 'react';
import { text, weight } from './config/tokens.js';

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
      borderRadius: '8px',
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
        width: '36px', height: '36px', borderRadius: '50%',
        background: overdue.length > 0 ? palette.rose : palette.gold,
        color: '#000', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontWeight: '700', fontSize: text.body,
        flexShrink: 0,
      }
    }, total),

    React.createElement('div', { style: { flex: 1 } },
      overdue.length > 0 && React.createElement('div', {
        style: { fontSize: '13px', fontWeight: '600', marginBottom: dueToday.length > 0 ? '2px' : 0 }
      }, t ? t('overdue.overdueCount', { count: overdue.length }) : overdue.length + ' overdue'),

      dueToday.length > 0 && React.createElement('div', {
        style: { fontSize: '13px', color: palette.mid }
      }, t ? t('overdue.dueTodayCount', { count: dueToday.length }) : dueToday.length + ' due today')
    ),

    React.createElement('span', {
      style: { fontSize: '13px', color: palette.mid, flexShrink: 0 }
    }, '→')
  );
};

export default OverdueBanner;
