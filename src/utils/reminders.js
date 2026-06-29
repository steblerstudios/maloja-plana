// Gemeinsame Schreib-API für den Kalender (or5_reminders).
// Damit jeder Ablauf eine Frist in den Kalender legen kann — ruhig, ohne Duplikate.
// CalendarReminders.jsx nutzt dieselben load/save-Funktionen (eine Quelle der Wahrheit).

const STORAGE_KEY = 'or5_reminders';

const todayISO = () => new Date().toISOString().split('T')[0];

export const loadReminders = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
};

export const saveReminders = (reminders) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders)); }
  catch { /* Speicher voll — still scheitern, kein Absturz */ }
};

// Legt eine Erinnerung an. Idempotent: existiert schon eine offene Erinnerung
// mit gleichem Titel und Datum, wird sie nicht doppelt angelegt (gibt die
// bestehende zurück). So darf ein Ablauf den Knopf gefahrlos mehrfach anbieten.
export const addReminder = ({ title, dueDate, category = 'personal', recurrence = 'once', notes = '' }) => {
  if (!title || !dueDate) return null;
  const reminders = loadReminders();
  const existing = reminders.find(r => !r.done && r.title === title && r.dueDate === dueDate);
  if (existing) return existing;
  const reminder = {
    id: Date.now().toString() + '_' + Math.random().toString(36).slice(2, 8),
    title,
    dueDate,
    category,
    recurrence,
    notes,
    done: false,
    completedDate: null,
    createdDate: todayISO(),
  };
  saveReminders([...reminders, reminder]);
  return reminder;
};
