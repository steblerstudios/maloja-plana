// Text in die Zwischenablage — eigenes kleines Blatt, weil das Dashboard (Startbündel) sie braucht.
// Bis 26.10.2026 stand sie in utils/notfallpass.js; der Import im Dashboard (#609) zog damit die ganze
// Notfallpass-Datei mit ihren Feldlisten ins Startbündel (Rollup nimmt ein Modul immer ganz, wie K67).

// Kopiert Text in die Zwischenablage. Erst navigator.clipboard (braucht einen sicheren
// Kontext), sonst der alte Weg über ein unsichtbares Textfeld. Gibt true/false zurück und
// wirft nie — die Oberfläche sagt dann ruhig, dass von Hand abgeschrieben werden kann.
export async function inZwischenablage(text, umgebung = globalThis) {
  const wert = String(text ?? '');
  if (!wert) return false;
  try {
    const cb = umgebung?.navigator?.clipboard;
    if (cb && typeof cb.writeText === 'function') {
      await cb.writeText(wert);
      return true;
    }
  } catch {
    // weiter zum Rückfall
  }
  try {
    const doc = umgebung?.document;
    if (!doc || typeof doc.execCommand !== 'function') return false;
    const feld = doc.createElement('textarea');
    feld.value = wert;
    feld.setAttribute('readonly', '');
    feld.style.position = 'fixed';
    feld.style.opacity = '0';
    doc.body.appendChild(feld);
    feld.select();
    const ok = doc.execCommand('copy');
    doc.body.removeChild(feld);
    return !!ok;
  } catch {
    return false;
  }
}
