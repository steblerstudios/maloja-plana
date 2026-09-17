// QR sicher erzeugen (K80, 17.09.2026)
//
// Warum: QRCode.js wirft bei zu langem Text (TypeError oder «code length overflow»), und die
// Aufrufer haben das still verschluckt → leere Fläche ohne Hinweis. Ausserdem wird ein Code
// mit über ~600 Bytes auf 180 px so dicht, dass ihn ein Telefon kaum noch liest.
//
// Diese Datei rechnet deshalb in UTF-8-Bytes (nicht in Zeichen — ein Umlaut zählt doppelt),
// kürzt ohne abzubrechen und meldet zurück, ob gezeichnet wurde.
//
// Nachtrag Deploy-Gate 0.1.36 (17.09.2026):
// - Kürzen bricht nicht mehr ab: passt eine Zeile nicht, wird sie übersprungen und die
//   nächste versucht. Vorher fiel z. B. nach einer langen Medikamentenzeile alles Weitere weg.
// - qrNotfallText() nennt im Code selbst, welche Angaben fehlen — wer den Code scannt, sieht
//   den Hinweis in der App nicht.
// - qrZeichnen() entfernt das `title`, das die Bibliothek mit dem ganzen Klartext setzt
//   (Tooltip mit Gesundheits- und AHV-Daten), und beschriftet den Code als Bild.

import QRCode from '../vendor/qrcodejs.js';

// Obergrenze für einen QR auf dem Bildschirm (Fehlerkorrektur M → höchstens Version 19,
// 93 × 93 Module, rund 2 px je Modul bei 180 px; die Bibliothek fasst dort 624 Bytes inkl. BOM).
export const QR_MAX_BYTES = 600;

const KUERZUNGS_ZEILE = '…';
// Höchstlänge der Zeile «Nicht enthalten: …» im Code.
const FEHLT_ZEILE_MAX = 160;

export function utf8Laenge(text) {
  return new TextEncoder().encode(String(text ?? '')).length;
}

// Schneidet `text` so, dass er in `maxBytes` passt, ohne ein Zeichen zu teilen.
function bytesSchneiden(text, maxBytes) {
  let aus = '';
  for (const zeichen of String(text)) {
    if (utf8Laenge(aus + zeichen) > maxBytes) break;
    aus += zeichen;
  }
  return aus;
}

// Kürzt `text` auf höchstens `maxBytes` UTF-8-Bytes. Ganze Zeilen bleiben ganz; eine Zeile, die
// nicht mehr passt, wird übersprungen und die nächste versucht. Nur wenn gar nichts passt, wird die
// erste Zeile angeschnitten. Ist gekürzt worden, steht als letzte Zeile «…».
// Rückgabe: { text, gekuerzt }.
export function qrKuerzen(text, maxBytes = QR_MAX_BYTES) {
  const roh = String(text ?? '');
  if (utf8Laenge(roh) <= maxBytes) return { text: roh, gekuerzt: false };

  const platz = maxBytes - utf8Laenge('\n' + KUERZUNGS_ZEILE);
  const zeilen = roh.split('\n');
  const behalten = [];
  for (const zeile of zeilen) {
    if (utf8Laenge(behalten.concat(zeile).join('\n')) <= platz) behalten.push(zeile);
  }
  if (behalten.length === 0) behalten.push(bytesSchneiden(zeilen[0], platz));
  return { text: behalten.concat(KUERZUNGS_ZEILE).join('\n'), gekuerzt: true };
}

// Baut den Notfall-Text aus Abschnitten ({ key, title, rows: [{ label, value }] }) in der
// übergebenen Reihenfolge. Zeilen, die nicht passen, fallen weg — der Code nennt sie dann am Ende
// («fehltTitel: Medikamente, Hausarzt»), damit niemand aus einer fehlenden Zeile «keine» liest.
// Ein Abschnittstitel steht nur da, wenn mindestens eine seiner Zeilen passt.
// Rückgabe: { text, gekuerzt, fehlt: [label, …] }.
export function qrNotfallText(abschnitte, { maxBytes = QR_MAX_BYTES, fehltTitel = '' } = {}) {
  const zeileVon = r => '  ' + r.label + ': ' + r.value;

  const baue = (budget) => {
    const teile = [];
    const fehlt = [];
    for (const a of abschnitte) {
      let titelDrin = false;
      for (const r of a.rows) {
        const neu = (titelDrin ? [] : [a.title + ':']).concat(zeileVon(r));
        if (utf8Laenge(teile.concat(neu).join('\n')) <= budget) {
          teile.push(...neu);
          titelDrin = true;
        } else {
          fehlt.push(r.label);
        }
      }
    }
    return { teile, fehlt };
  };

  const fehltZeile = (fehlt) => {
    const voll = (fehltTitel ? fehltTitel + ': ' : '') + fehlt.join(', ');
    if (utf8Laenge(voll) <= FEHLT_ZEILE_MAX) return voll;
    return bytesSchneiden(voll, FEHLT_ZEILE_MAX - utf8Laenge(' …')) + ' …';
  };

  let { teile, fehlt } = baue(maxBytes);
  if (!fehlt.length) return { text: teile.join('\n'), gekuerzt: false, fehlt };

  // Platz für die Schlusszeile freihalten und neu bauen; dabei kann weiteres wegfallen.
  ({ teile, fehlt } = baue(maxBytes - FEHLT_ZEILE_MAX - 1));
  const text = teile.concat(fehltZeile(fehlt)).join('\n');
  return { text, gekuerzt: true, fehlt };
}

// Zeichnet `text` als QR in `el`. Gibt true zurück, wenn gezeichnet wurde, sonst false
// (leerer Text, zu lang, oder die Bibliothek wirft). `el` bleibt bei false leer.
// `beschriftung` wird zur Textalternative (role="img" + aria-label) — nie der Inhalt selbst.
export function qrZeichnen(el, text, optionen = {}) {
  if (!el) return false;
  el.innerHTML = '';
  attributeAufraeumen(el);
  const { maxBytes = QR_MAX_BYTES, beschriftung, ...rest } = optionen;
  const inhalt = String(text ?? '');
  if (!inhalt || utf8Laenge(inhalt) > maxBytes) return false;
  try {
    new QRCode(el, { correctLevel: QRCode.CorrectLevel.M, ...rest, text: inhalt });
  } catch {
    el.innerHTML = '';
    attributeAufraeumen(el);
    return false;
  }
  // Die Bibliothek setzt el.title = ganzer Klartext → Tooltip mit persönlichen Daten.
  attributeAufraeumen(el);
  if (beschriftung && typeof el.setAttribute === 'function') {
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', beschriftung);
  }
  return true;
}

function attributeAufraeumen(el) {
  if (typeof el.removeAttribute !== 'function') return;
  el.removeAttribute('title');
  el.removeAttribute('role');
  el.removeAttribute('aria-label');
}
