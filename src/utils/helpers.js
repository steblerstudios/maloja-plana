// ============================================================================
// DATE HELPERS
// ============================================================================
export function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('de-CH', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

// Local-date helpers for the guided flows (Abläufe). Built from local date parts on
// purpose — toISOString() would convert to UTC and shift the date by a day in the CH
// timezone. inDays/inMonths return an ISO date (yyyy-mm-dd) n days/months from today;
// formatDE renders such an ISO date as dd.mm.yyyy.
const toLocalISO = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export function inDays(n) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return toLocalISO(d);
}

export function inMonths(n) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setMonth(d.getMonth() + n);
  return toLocalISO(d);
}

export function formatDE(iso) {
  const [y, m, day] = iso.split('-');
  return `${day}.${m}.${y}`;
}

// ============================================================================
// PRINT HELPERS
// ============================================================================

// Escape HTML entities before user-entered text is written into a print/export
// document via document.write. Print windows opened with window.open('', '_blank')
// share the app's origin (and its localStorage) and inherit its CSP (script-src
// 'self', no inline scripts) — so escape every value that can come from data or an
// imported backup, not only free text. A name or medication that contains <, > or &
// would otherwise also break the printed layout. Escape at the point of
// interpolation. Also used as esc() by briefGenerator.js/dossierGenerator.js (K97).
// K97: only null/undefined/false/'' become empty — 0 stays «0»; ' is escaped too.
export function escapeHtml(str) {
  if (str == null || str === false) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Druck-Knöpfe im Druckfenster verdrahten. Das Fenster ist about:blank und erbt die
// CSP der App (script-src 'self') — ein Inline-Handler wie onclick="window.print()"
// wird dort blockiert, der Knopf tat nichts (gemessen 25.09.2026 in der Konsole).
// Darum hängt die App den Druck von aussen an. Das onclick bleibt im HTML stehen,
// weil es in einer gespeicherten Datei (ohne CSP) weiter gilt; hier wird es entfernt,
// damit kein Browser zwei Druckdialoge öffnet.
export function druckKnoepfeVerdrahten(win) {
  const knoepfe = win.document.querySelectorAll('[data-druck]');
  knoepfe.forEach((k) => {
    k.removeAttribute('onclick');
    k.addEventListener('click', () => { win.focus(); win.print(); });
  });
  return knoepfe.length;
}

export function openPrintWindow(html) {
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    druckKnoepfeVerdrahten(win);
    return win;
  }
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'maloja-plana-' + toLocalISO(new Date()) + '.html';
  a.click();
  URL.revokeObjectURL(url);
  return null;
}
