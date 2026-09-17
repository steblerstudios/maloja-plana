// QR sicher erzeugen (K80, 17.09.2026)
//
// Warum: QRCode.js wirft bei zu langem Text (TypeError oder «code length overflow»), und die
// Aufrufer haben das still verschluckt → leere Fläche ohne Hinweis. Ausserdem wird ein Code
// mit über ~600 Bytes auf 180 px so dicht, dass ihn ein Telefon kaum noch liest.
//
// Diese Datei rechnet deshalb in UTF-8-Bytes (nicht in Zeichen — ein Umlaut zählt doppelt),
// kürzt an Zeilengrenzen und meldet zurück, ob gezeichnet wurde.

import QRCode from '../vendor/qrcodejs.js';

// Obergrenze für einen QR auf dem Bildschirm (Fehlerkorrektur M → höchstens Version 19,
// 93 × 93 Module, rund 2 px je Modul bei 180 px).
export const QR_MAX_BYTES = 600;

const KUERZUNGS_ZEILE = '…';

export function utf8Laenge(text) {
  return new TextEncoder().encode(String(text ?? '')).length;
}

// Schneidet eine einzelne Zeile so, dass sie in `maxBytes` passt, ohne ein Zeichen zu teilen.
function zeileSchneiden(zeile, maxBytes) {
  let aus = '';
  for (const zeichen of zeile) {
    if (utf8Laenge(aus + zeichen) > maxBytes) break;
    aus += zeichen;
  }
  return aus;
}

// Kürzt `text` auf höchstens `maxBytes` UTF-8-Bytes. Ganze Zeilen bleiben ganz; ist gekürzt
// worden, steht als letzte Zeile «…». Rückgabe: { text, gekuerzt }.
export function qrKuerzen(text, maxBytes = QR_MAX_BYTES) {
  const roh = String(text ?? '');
  if (utf8Laenge(roh) <= maxBytes) return { text: roh, gekuerzt: false };

  const platz = maxBytes - utf8Laenge('\n' + KUERZUNGS_ZEILE);
  const behalten = [];
  for (const zeile of roh.split('\n')) {
    const kandidat = behalten.concat(zeile).join('\n');
    if (utf8Laenge(kandidat) > platz) {
      // Passt schon die erste Zeile nicht, wird sie selbst gekürzt — sonst bliebe nichts übrig.
      if (behalten.length === 0) behalten.push(zeileSchneiden(zeile, platz));
      break;
    }
    behalten.push(zeile);
  }
  return { text: behalten.concat(KUERZUNGS_ZEILE).join('\n'), gekuerzt: true };
}

// Zeichnet `text` als QR in `el`. Gibt true zurück, wenn gezeichnet wurde, sonst false
// (leerer Text, zu lang, oder die Bibliothek wirft). `el` bleibt bei false leer.
export function qrZeichnen(el, text, optionen = {}) {
  if (!el) return false;
  el.innerHTML = '';
  const { maxBytes = QR_MAX_BYTES, ...rest } = optionen;
  const inhalt = String(text ?? '');
  if (!inhalt || utf8Laenge(inhalt) > maxBytes) return false;
  try {
    new QRCode(el, { correctLevel: QRCode.CorrectLevel.M, ...rest, text: inhalt });
    return true;
  } catch {
    el.innerHTML = '';
    return false;
  }
}
