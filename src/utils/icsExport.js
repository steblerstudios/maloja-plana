// iCal/.ics-Export der Termine & Fristen. Reiner Generator (testbar) +
// kleiner Download-Helper. All-Day-Events; Wiederkehr via RRULE; Erinnerung
// 1 Tag vorher (VALARM). Keine Dependency.

const esc = (s) => String(s == null ? '' : s)
  .replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

const pad = (n) => String(n).padStart(2, '0');
const toICSDate = (iso) => (iso || '').slice(0, 10).replace(/-/g, ''); // YYYY-MM-DD → YYYYMMDD

const RRULE = { weekly: 'FREQ=WEEKLY', monthly: 'FREQ=MONTHLY', yearly: 'FREQ=YEARLY' };

function dtstamp(now = new Date()) {
  return now.getUTCFullYear() + pad(now.getUTCMonth() + 1) + pad(now.getUTCDate())
    + 'T' + pad(now.getUTCHours()) + pad(now.getUTCMinutes()) + pad(now.getUTCSeconds()) + 'Z';
}

// reminders: [{ id, title, dueDate (ISO), category, recurrence }]
// t (optional): Übersetzer für Kategorie-Labels.
export function buildICS(reminders, t) {
  const stamp = dtstamp();
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Maloja Plana//Termine//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Maloja Plana',
  ];
  for (const r of (reminders || [])) {
    const date = toICSDate(r && r.dueDate);
    if (!date) continue;
    const uid = (r.id || (date + '-' + Math.abs(hash(r.title || '')))) + '@malojaplana.ch';
    const cat = r.category ? (t ? (t('calendar.categories.' + r.category) || r.category) : r.category) : '';
    lines.push('BEGIN:VEVENT');
    lines.push('UID:' + uid);
    lines.push('DTSTAMP:' + stamp);
    lines.push('DTSTART;VALUE=DATE:' + date);
    lines.push('SUMMARY:' + esc(r.title));
    lines.push('DESCRIPTION:' + esc((cat ? cat + ' · ' : '') + 'Maloja Plana'));
    if (r.recurrence && RRULE[r.recurrence]) lines.push('RRULE:' + RRULE[r.recurrence]);
    lines.push('BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:' + esc(r.title), 'END:VALARM');
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

// Stabiler kleiner Hash als UID-Fallback, falls kein id vorhanden.
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
  return h;
}

// Lädt die .ics-Datei herunter (Browser).
export function downloadICS(reminders, t, filename = 'maloja-plana-termine.ics') {
  const ics = buildICS(reminders, t);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
