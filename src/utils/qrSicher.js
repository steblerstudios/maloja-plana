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

// Obergrenze für eine fertige vCard-Nutzlast. Höher als QR_MAX_BYTES, weil der vCard-Rahmen
// (~95 Bytes) plus die Maskierung sonst vom INHALT abgingen: dieselben Angaben, die heute als
// Klartext passen, fielen sonst beim Umstieg hinten heraus.
//
// 🛑 Diese Zahl ist GEMESSEN, aber an genau einem Gerät (22.09.2026, Versuch 2,
// `qr-versuch-2-vcard.html`): 639 Bytes → 97 × 97 Module → 1,9 px je Modul auf 180 px,
// von der normalen iPhone-Kamera gelesen und mit allen Angaben angezeigt. Das ist FEINER als
// der bisherige Notfall-QR (2,0 px je Modul) und trotzdem gegangen.
// Ein Gerät ist keine Gattung — wer sie anhebt, muss neu messen, nicht schätzen.
export const QR_MAX_BYTES_VCARD = 640;

// Ein QR-Code wird dunkel auf hell gezeichnet — immer, unabhängig vom Thema.
//
// 🛑 Gefunden am 22.09.2026 beim Nachsehen im Dark Mode: `KKScanner` und `OrganDonation`
// übergaben `colorDark: palette.text` und `colorLight: palette.surface`. Im dunklen Thema
// ist `palette.text` HELL — die dunklen Module wurden also hell gezeichnet und die hellen
// dunkel. Der Code war invertiert, und viele Lesegeräte scheitern daran.
// (Das Notfall-Dossier war nie betroffen: es setzte diese zwei Werte von Hand fest.)
//
// Die Farbwahl gehört deshalb nicht an die Aufrufstelle, sondern hierher. Ein Notfall-Code
// ist kein Gestaltungselement: er muss lesbar sein, auch wenn er im dunklen Thema laut wirkt.
export const QR_DUNKEL = '#1a1a1a';
export const QR_HELL = '#ffffff';

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

// ── vCard ────────────────────────────────────────────────────────────────────────────────
//
// Warum überhaupt: gemessen am 22.09.2026 an zwei Versuchsreihen zeigt die normale
// iPhone-Kamera eine KLARTEXT-Nutzlast nicht an — sie liest den Code und meldet
// «no usable data found». Drei Klartext-Codes scheiterten, zwei Adress-Codes gingen; Dichte
// und Fläche sind ausgeschieden (ein Code mit 51 Bytes bei 5,4 px je Modul scheiterte ebenso,
// derselbe Inhalt auf doppelter Fläche auch). Die Ursache ist der TYP der Nutzlast.
//
// Ein Notfall-Code, den die normale Kamera nicht anzeigt, verfehlt genau den Fall, für den er
// da ist: eine fremde Person, die im Notfall mit ihrem eigenen Telefon draufhält — ohne
// Scanner-App, unter Zeitdruck. vCard ist ein Typ, den die Kamera kennt, und sie braucht
// dafür weder Netz noch Server: die Daten bleiben auf dem Gerät.

// Maskiert einen Wert für ein vCard-Feld (RFC 6350 §3.4): Backslash zuerst, sonst würden die
// danach eingefügten Fluchtzeichen selbst wieder maskiert.
export function vcardMaskieren(wert) {
  return String(wert ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

// Baut eine vCard 3.0. Zeilen werden mit CRLF getrennt, wie die Norm es verlangt.
// `tel` wird als eigenes Feld geführt — nicht als Text in der Notiz —, damit die Nummer auf
// der Kontaktkarte WÄHLBAR ist statt abgetippt werden zu müssen. Das ist der eigentliche
// Gewinn gegenüber dem Klartext und im Notfall der Unterschied, auf den es ankommt.
//
// Faltet eine vCard-Zeile nach der Norm (RFC 2426 §2.6): höchstens 75 Oktette je Zeile,
// jede Fortsetzung beginnt mit EINEM Leerzeichen, das beim Lesen wieder wegfällt.
//
// Gezählt wird in UTF-8-Bytes, nicht in Zeichen — sonst bräche die Zeile mitten in einem
// Umlaut. Zwei Dinge bleiben darum zusammen: ein Zeichen selbst, und ein maskiertes Paar
// (\\; \\, \\\\ \\n) — träfe die Faltung zwischen Backslash und Zeichen, läse das
// Telefon die Maskierung falsch. Die Fortsetzungszeile trägt ihr Leerzeichen im Budget mit,
// darum 74 Oktette Inhalt statt 75.
export function vcardFalten(zeile, maxOktette = 75) {
  const zeichen = [...String(zeile ?? '')];
  const teile = [];
  let aktuell = '';
  let grenze = maxOktette;
  for (let i = 0; i < zeichen.length; i++) {
    let stueck = zeichen[i];
    if (stueck === '\\' && i + 1 < zeichen.length) { stueck += zeichen[i + 1]; i += 1; }
    if (aktuell && utf8Laenge(aktuell + stueck) > grenze) {
      teile.push(aktuell);
      aktuell = stueck;
      grenze = maxOktette - 1;
    } else {
      aktuell += stueck;
    }
  }
  if (aktuell || teile.length === 0) teile.push(aktuell);
  return teile[0] + teile.slice(1).map((t) => '\r\n ' + t).join('');
}

// Zeilenfaltung eingebaut am 22.09.2026 (vorher stand hier die Lücke als bekannt vermerkt).
// Sie kostet je Umbruch drei Oktette (CRLF + Leerzeichen) — die wiegen mit, weil
// qrNotfallVcard die FERTIGE Karte misst und nicht den Inhalt davor.
export function vcardBauen({ name = '', tel = '', notiz = '' } = {}) {
  const anzeige = String(name ?? '').trim();
  const nummer = String(tel ?? '').trim();
  const zeilen = ['BEGIN:VCARD', 'VERSION:3.0'];
  if (anzeige) {
    zeilen.push('N:' + vcardMaskieren(anzeige) + ';;;;');
    zeilen.push('FN:' + vcardMaskieren(anzeige));
  }
  if (nummer) zeilen.push('TEL;TYPE=CELL:' + vcardMaskieren(nummer));
  if (notiz) zeilen.push('NOTE:' + vcardMaskieren(notiz));
  zeilen.push('END:VCARD');
  return zeilen.map((z) => vcardFalten(z)).join('\r\n') + '\r\n';
}

// Baut die Notfall-Angaben als vCard und hält dabei die FERTIGE Nutzlast unter `maxBytes`.
//
// 🛑 Der Punkt, an dem eine naive Umstellung falsch würde: gekürzt wird der INHALT, gemessen
// wird die fertige vCard. Rahmen und Maskierung wiegen mit — und die Maskierung hängt vom
// Inhalt ab (jedes Komma, Semikolon und jeder Zeilenumbruch wird zwei Zeichen), lässt sich
// also nicht als feste Zahl abziehen. Darum wird gebaut, gewogen und bei Überhang genau um
// diesen Überhang nachgekürzt, bis es passt. Ohne das kürzt die App am falschen Ende und
// wirft Angaben weg, die problemlos gepasst hätten.
//
// Rückgabe wie qrNotfallText, plus `inhalt` (der Text in der Notiz) und `bytes`.
export function qrNotfallVcard(abschnitte, {
  maxBytes = QR_MAX_BYTES_VCARD, fehltTitel = '', name = '', tel = '',
} = {}) {
  const rahmen = utf8Laenge(vcardBauen({ name, tel, notiz: '' }));
  let budget = Math.max(0, maxBytes - rahmen);
  let letzte = null;

  // Höchstens sechs Runden: jede Runde kürzt um mindestens den gemessenen Überhang, das
  // konvergiert. Die Schranke verhindert eine Endlosschleife, falls es das nicht tut.
  for (let runde = 0; runde < 6 && budget > 0; runde++) {
    const inhalt = qrNotfallText(abschnitte, { maxBytes: budget, fehltTitel });
    const vcard = vcardBauen({ name, tel, notiz: inhalt.text });
    const gewicht = utf8Laenge(vcard);
    letzte = { text: vcard, inhalt: inhalt.text, gekuerzt: inhalt.gekuerzt, fehlt: inhalt.fehlt, bytes: gewicht };
    if (gewicht <= maxBytes) return letzte;
    budget -= (gewicht - maxBytes);
  }

  // Passt selbst der Rahmen nicht mehr: lieber nichts zeichnen als einen halben Ausweis.
  if (!letzte || letzte.bytes > maxBytes) {
    return { text: '', inhalt: '', gekuerzt: true, fehlt: abschnitte.flatMap(a => a.rows.map(r => r.label)), bytes: 0 };
  }
  return letzte;
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
    new QRCode(el, {
      correctLevel: QRCode.CorrectLevel.M,
      colorDark: QR_DUNKEL, colorLight: QR_HELL,
      ...rest,
      text: inhalt,
    });
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
