// Beispiel-Einträge für den Kalender im Beispiel Maria (Sophie 24.10.2026: «Beispiel lebendiger»).
//
// Bis dahin begann der Kalender im Beispiel leer (Entscheid 18.10.2026) — der neue Jahreskreis
// zeigte dort nur zwei feste Punkte und wirkte verlassen. Jetzt stehen ein paar persönliche
// Termine von Maria darin. Es bleibt bei der Regel vom 18.10.: im Beispiel wird nichts
// gespeichert (CalendarReminders: `if (!vorlaeufig) saveReminders(...)`), die echten
// Erinnerungen bleiben unsichtbar, und beim «Ausprobieren» beginnt der Kalender weiter leer.
//
// Nur persönliche Termine, keine Fristen mit Rechtsfolge: die festen Stichtage bringt der
// Jahreskreis selbst mit (KVG-Kündigung, Steuerfrist). Daten relativ zu heute, damit das
// Beispiel nie veraltet.

import { inDays } from '../utils/helpers.js';

const BEISPIEL = [
  { key: 'zahnarzt', tage: 12, category: 'health', recurrence: 'yearly' },
  { key: 'velo', tage: 33, category: 'personal', recurrence: 'yearly' },
  { key: 'hausrat', tage: 58, category: 'insurance', recurrence: 'once' },
  { key: 'nebenkosten', tage: 95, category: 'housing', recurrence: 'yearly' },
  // Einmalig: ein erledigter jährlicher Termin würde beim Öffnen sofort ins nächste Jahr rollen
  // (CalendarReminders, Überfällig-Rollover) und stünde dann nicht unter «Erledigt».
  { key: 'hausarzt', tage: -21, category: 'health', recurrence: 'once', erledigt: true },
];

export const kalenderBeispiel = (t) => BEISPIEL.map((b) => ({
  id: 'beispiel-' + b.key,
  title: t('calendar.beispiel.' + b.key),
  dueDate: inDays(b.tage),
  category: b.category,
  recurrence: b.recurrence,
  notes: '',
  art: 'termin',
  done: !!b.erledigt,
  completedDate: b.erledigt ? inDays(b.tage) : null,
  createdDate: inDays(-30),
}));
