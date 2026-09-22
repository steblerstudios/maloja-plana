// K80 (17.09.2026): QR im Notfall-Dossier fehlte bei längeren Angaben — und schon ein
// einziger Umlaut verfälschte die Kodierung. Diese Tests halten beides fest.
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// QRCode.js hängt sich beim Import an `window`; die Testumgebung ist Node.
let QRCode;
let qrKuerzen;
let qrNotfallText;
let qrZeichnen;
let gesetzt = [];
let utf8Laenge;
let QR_MAX_BYTES;
let vcardMaskieren;
let vcardBauen;
let qrNotfallVcard;
let QR_MAX_BYTES_VCARD;
let QR_DUNKEL;
let QR_HELL;

beforeAll(async () => {
  if (!('window' in globalThis)) { globalThis.window = globalThis; gesetzt.push('window'); }
  if (!('document' in globalThis)) gesetzt.push('document');
  globalThis.document = globalThis.document || {
    documentElement: { tagName: 'div' },
    getElementById: () => null,
    createElement: () => ({ style: {}, getContext: () => null, appendChild() {}, setAttribute() {} }),
  };
  ({ default: QRCode } = await import('../vendor/qrcodejs.js'));
  ({
    qrKuerzen, qrNotfallText, qrZeichnen, utf8Laenge, QR_MAX_BYTES,
    vcardMaskieren, vcardBauen, qrNotfallVcard, QR_MAX_BYTES_VCARD, QR_DUNKEL, QR_HELL,
  } = await import('../utils/qrSicher.js'));
});

// Nur abräumen, was dieser Test selbst gesetzt hat (Qualitäts-Prüfer, Deploy-Gate 0.1.36).
afterAll(() => { for (const k of gesetzt) delete globalThis[k]; gesetzt = []; });

// Attrappe eines DOM-Elements, die Attribute mitschreibt (die Bibliothek setzt `title` direkt).
const element = () => {
  const attr = {};
  return {
    innerHTML: '', style: {}, childNodes: [], appendChild() {}, attr,
    get title() { return attr.title ?? ''; }, set title(v) { attr.title = String(v); },
    setAttribute(k, v) { attr[k] = String(v); },
    removeAttribute(k) { delete attr[k]; },
  };
};

// Kodiert nur (ohne Zeichnen) und gibt die Nutzdaten ohne das vorangestellte BOM zurück.
function kodierteBytes(text) {
  const q = new QRCode(element(), { text: '', correctLevel: QRCode.CorrectLevel.M });
  q._oDrawing = { draw() {}, clear() {} };
  q.makeImage = () => {};
  q.makeCode(text);
  const bytes = q._oQRCode.dataList[0].parsedData;
  const utf8 = new TextEncoder().encode(text);
  return bytes.length === utf8.length + 3 ? bytes.slice(3) : bytes;
}

const langerText = ('Allergien: Nüsse, Pollen\n  Notfallkontakt: Müller, 079 000 00 00\n').repeat(40);

describe('QRCode.js · UTF-8-Kodierung (Patch K80)', () => {
  it.each([
    ['Umlaut mitten im Text', 'Blutgruppe: ä und dann ASCII'],
    ['Zeilenumbrüche und Umlaute', 'Person:\n  Name: Zoë Müller\n  Ort: Genève'],
    ['Grenzzeichen 128 und 2048', 'x' + String.fromCharCode(128) + 'y' + String.fromCharCode(2048) + 'z'],
    ['nur ASCII', 'Blutgruppe: A'],
    ['Emoji (ausserhalb der BMP)', 'Allergie 🥜 Erdnuss, dann ü'],
  ])('%s: kodiert genau die UTF-8-Bytes', (_name, text) => {
    expect(kodierteBytes(text)).toEqual([...new TextEncoder().encode(text)]);
  });
});

describe('qrKuerzen', () => {
  it('lässt kurzen Text unverändert', () => {
    expect(qrKuerzen('Blutgruppe: A')).toEqual({ text: 'Blutgruppe: A', gekuerzt: false });
  });

  it('rechnet in Bytes: 400 × «ä» sind 800 Bytes und werden gekürzt', () => {
    const r = qrKuerzen('ä'.repeat(400));
    expect(r.gekuerzt).toBe(true);
    expect(utf8Laenge(r.text)).toBeLessThanOrEqual(QR_MAX_BYTES);
    expect(r.text.endsWith('\n…')).toBe(true);
  });

  it('kürzt langen gemischten Text an Zeilengrenzen und bleibt unter der Grenze', () => {
    const r = qrKuerzen(langerText);
    expect(r.gekuerzt).toBe(true);
    expect(utf8Laenge(r.text)).toBeLessThanOrEqual(QR_MAX_BYTES);
    const zeilen = r.text.split('\n');
    expect(zeilen.at(-1)).toBe('…');
    // Jede behaltene Zeile ist eine ganze Zeile aus dem Original.
    const original = new Set(langerText.split('\n'));
    zeilen.slice(0, -1).forEach(z => expect(original.has(z)).toBe(true));
  });

  it('bricht nach einer zu langen Zeile nicht ab, sondern füllt weiter', () => {
    const text = ['Kurz eins', 'x'.repeat(200), 'Kurz zwei'].join('\n');
    const r = qrKuerzen(text, 60);
    expect(r.gekuerzt).toBe(true);
    expect(r.text.split('\n')).toEqual(['Kurz eins', 'Kurz zwei', '…']);
  });

  it('teilt kein Zeichen, wenn schon die erste Zeile zu lang ist', () => {
    const r = qrKuerzen('ü'.repeat(1000), 101);
    expect(utf8Laenge(r.text)).toBeLessThanOrEqual(101);
    expect(r.text).not.toContain('�');
    expect(r.text.split('\n')[0]).toMatch(/^ü+$/);
  });
});

describe('qrNotfallText', () => {
  const abschnitte = [
    { key: 'medical', title: 'Medizinische Angaben', rows: [
      { label: 'Blutgruppe', value: 'A+' },
      { label: 'Medikamente', value: 'Marcoumar 3 mg, ' + 'Tablette täglich '.repeat(30) },
      { label: 'Chronische Erkrankungen', value: 'Vorhofflimmern' },
    ] },
    { key: 'contact', title: 'Notfallkontakt', rows: [ { label: 'Name', value: 'Zoë Müller' } ] },
    { key: 'person', title: 'Person', rows: [ { label: 'Adresse', value: 'Weg ' + 'ü'.repeat(300) } ] },
  ];

  it('lässt ganz, was passt, in der übergebenen Reihenfolge', () => {
    const r = qrNotfallText([abschnitte[1], { key: 'medical', title: 'Medizin', rows: [abschnitte[0].rows[0]] }]);
    expect(r).toEqual({ text: 'Notfallkontakt:\n  Name: Zoë Müller\nMedizin:\n  Blutgruppe: A+', gekuerzt: false, fehlt: [] });
  });

  it('überspringt die zu lange Zeile, behält die folgenden und nennt, was fehlt', () => {
    const r = qrNotfallText(abschnitte, { fehltTitel: 'Nicht enthalten' });
    expect(r.gekuerzt).toBe(true);
    expect(utf8Laenge(r.text)).toBeLessThanOrEqual(QR_MAX_BYTES);
    expect(r.text).toContain('  Blutgruppe: A+');
    expect(r.text).toContain('  Chronische Erkrankungen: Vorhofflimmern');
    expect(r.text).toContain('  Name: Zoë Müller');
    expect(r.fehlt).toEqual(['Medikamente', 'Adresse']);
    expect(r.text.split('\n').at(-1)).toBe('Nicht enthalten: Medikamente, Adresse');
  });

  it('setzt keinen Abschnittstitel ohne Zeile darunter', () => {
    const r = qrNotfallText(abschnitte, { fehltTitel: 'Nicht enthalten' });
    expect(r.text).not.toContain('Person:');
  });

  it('kürzt eine sehr lange Fehlend-Liste und bleibt unter der Grenze', () => {
    const viele = [{ key: 'x', title: 'X', rows: Array.from({ length: 40 }, (_, i) => ({ label: 'Angabe Nummer ' + i, value: 'ä'.repeat(40) })) }];
    const r = qrNotfallText(viele, { fehltTitel: 'Nicht enthalten' });
    expect(utf8Laenge(r.text)).toBeLessThanOrEqual(QR_MAX_BYTES);
    expect(r.text.split('\n').at(-1)).toMatch(/^Nicht enthalten: .* …$/);
  });
});

// Gemessen am 22.09.2026: die normale iPhone-Kamera zeigt eine Klartext-Nutzlast nicht an
// («no usable data found»), eine vCard schon. Diese Tests halten die ZUSAGE fest — die Angaben
// kommen an und die Notfallnummer ist wählbar —, nicht die heutige Schreibweise der vCard.
describe('vCard als Nutzlast', () => {
  // Minimaler Leser: trennt die Felder so, wie ein Kontaktprogramm es täte.
  const felderVon = (vcard) => {
    const aus = {};
    for (const zeile of vcard.split('\r\n')) {
      const i = zeile.indexOf(':');
      if (i === -1) continue;
      aus[zeile.slice(0, i)] = zeile.slice(i + 1);
    }
    return aus;
  };
  const entmaskieren = (wert) =>
    wert.replace(/\\([\\;,n])/g, (_, z) => (z === 'n' ? '\n' : z));

  it('hält Komma und Semikolon im Wert, statt daraus neue Felder zu machen', () => {
    const wert = 'Penicillin, Jod; Erdnuss\\Nuss';
    const vcard = vcardBauen({ name: 'Notfall', notiz: wert });
    // Genau eine NOTE-Zeile — kein Komma hat ein zweites Feld erzeugt.
    expect(vcard.split('\r\n').filter(z => z.startsWith('NOTE:')).length).toBe(1);
    expect(entmaskieren(felderVon(vcard).NOTE)).toBe(wert);
  });

  it('überlebt einen mehrzeiligen Text als EINE Notiz', () => {
    const vcard = vcardBauen({ name: 'N', notiz: 'Zeile eins\nZeile zwei' });
    expect(vcard.split('\r\n').filter(z => z.startsWith('NOTE:')).length).toBe(1);
    expect(entmaskieren(felderVon(vcard).NOTE)).toBe('Zeile eins\nZeile zwei');
  });

  it('führt die Notfallnummer als eigenes Feld — damit sie wählbar ist, nicht abgetippt', () => {
    const vcard = vcardBauen({ name: 'N', tel: '079 123 45 67', notiz: 'x' });
    const felder = felderVon(vcard);
    expect(felder['TEL;TYPE=CELL']).toBe('079 123 45 67');
    expect(felder.NOTE).not.toContain('079 123 45 67');
  });

  it('lässt leere Felder weg, statt leere Zeilen zu schreiben', () => {
    const vcard = vcardBauen({ name: 'Nur Name' });
    expect(vcard).not.toContain('TEL');
    expect(vcard).not.toContain('NOTE');
    expect(vcard.startsWith('BEGIN:VCARD')).toBe(true);
    expect(vcard.trimEnd().endsWith('END:VCARD')).toBe(true);
  });

  describe('qrNotfallVcard', () => {
    // Werte voller Kommas: die Maskierung lässt die Nutzlast wachsen, während gekürzt wird.
    const vieleKommas = [{
      key: 'medical', title: 'Medizinisches', rows: Array.from({ length: 30 }, (_, i) => ({
        label: 'Angabe ' + i, value: 'ein, zwei, drei, vier, fünf, sechs, sieben',
      })),
    }];

    it('bleibt unter der Grenze — gemessen wird die FERTIGE vCard, nicht der Inhalt', () => {
      const r = qrNotfallVcard(vieleKommas, { fehltTitel: 'Nicht enthalten', name: 'Notfall', tel: '079 123 45 67' });
      expect(utf8Laenge(r.text)).toBeLessThanOrEqual(QR_MAX_BYTES_VCARD);
      expect(r.bytes).toBe(utf8Laenge(r.text));
      expect(r.gekuerzt).toBe(true);
    });

    it('kürzt den Inhalt und NICHT den Rahmen — die Nummer bleibt wählbar, auch wenn viel wegfällt', () => {
      const r = qrNotfallVcard(vieleKommas, { fehltTitel: 'Nicht enthalten', name: 'Notfall', tel: '079 123 45 67' });
      expect(r.text).toContain('BEGIN:VCARD');
      expect(r.text).toContain('END:VCARD');
      expect(felderVon(r.text)['TEL;TYPE=CELL']).toBe('079 123 45 67');
      expect(r.fehlt.length).toBeGreaterThan(0);
    });

    it('trägt die Angaben, die passen, bis zur Kontaktkarte durch', () => {
      const r = qrNotfallVcard(
        [{ key: 'medical', title: 'Medizinisches', rows: [{ label: 'Blutgruppe', value: 'A positiv' }] }],
        { name: 'Notfall', tel: '079 123 45 67' },
      );
      expect(r.gekuerzt).toBe(false);
      expect(entmaskieren(felderVon(r.text).NOTE)).toContain('Blutgruppe: A positiv');
    });

    it('nutzt den Platz aus: dieselben Angaben passen als vCard wie als Klartext', () => {
      // Die Regression, vor der die Umstellung sonst stünde: wenn der Rahmen vom Inhalt
      // abginge, fielen Angaben weg, die heute passen.
      const abschnitte = [{
        key: 'medical', title: 'Medizinisches', rows: Array.from({ length: 12 }, (_, i) => ({
          label: 'Angabe ' + i, value: 'Wert ' + i,
        })),
      }];
      const klartext = qrNotfallText(abschnitte);
      const vcard = qrNotfallVcard(abschnitte, { name: 'Notfall', tel: '079 123 45 67' });
      expect(klartext.gekuerzt).toBe(false);
      expect(vcard.gekuerzt).toBe(false);
      expect(vcard.inhalt).toBe(klartext.text);
    });

    it('zeichnet lieber nichts als einen halben Ausweis, wenn nicht einmal der Rahmen passt', () => {
      const r = qrNotfallVcard(
        [{ key: 'x', title: 'X', rows: [{ label: 'A', value: 'B' }] }],
        { maxBytes: 10, name: 'Notfall', tel: '079 123 45 67' },
      );
      expect(r.text).toBe('');
    });
  });
});

// Am 22.09.2026 im Dark Mode gefunden: KKScanner und OrganDonation übergaben
// `colorDark: palette.text`. Im dunklen Thema ist das HELL — die dunklen Module wurden hell
// gezeichnet, der Code war invertiert, und viele Lesegeräte scheitern daran.
describe('QR-Farben kommen nie aus dem Thema', () => {
  const helligkeit = (hex) => {
    const n = parseInt(hex.replace('#', ''), 16);
    return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  };

  it('zeichnet dunkel auf hell — als Eigenschaft, nicht als Farbwert', () => {
    // Geprüft wird das Verhältnis, nicht die konkrete Farbe: sie darf sich ändern.
    expect(helligkeit(QR_DUNKEL)).toBeLessThan(0.3);
    expect(helligkeit(QR_HELL)).toBeGreaterThan(0.8);
  });

  it('keine Aufrufstelle nimmt die Farben aus der Palette', () => {
    const wurzel = path.resolve(__dirname, '..');
    const dateien = fs.readdirSync(wurzel).filter(f => f.endsWith('.jsx'));
    const treffer = [];
    for (const datei of dateien) {
      const src = fs.readFileSync(path.join(wurzel, datei), 'utf8');
      if (/color(Dark|Light):\s*palette\./.test(src)) treffer.push(datei);
    }
    expect(treffer).toEqual([]);
  });
});

describe('qrZeichnen', () => {
  // Zeichnen braucht mehr Browser als Node hat; hier zählt, dass nichts wirft und das
  // Ergebnis ehrlich zurückkommt. Das Bild selbst ist im Browser geprüft (PR-Beschreibung).
  const ohneZeichnen = (fn) => {
    const alt = QRCode.prototype.makeCode;
    QRCode.prototype.makeCode = function (text) {
      this._oDrawing = { draw() {}, clear() {} };
      this.makeImage = () => {};
      return alt.call(this, text);
    };
    try { return fn(); } finally { QRCode.prototype.makeCode = alt; }
  };

  it('zeichnet den gekürzten langen Umlaut-Text', () => {
    const { text } = qrKuerzen(langerText);
    expect(ohneZeichnen(() => qrZeichnen(element(), text))).toBe(true);
  });

  it('entfernt den Klartext-Tooltip der Bibliothek und beschriftet den Code als Bild', () => {
    const el = element();
    expect(ohneZeichnen(() => qrZeichnen(el, 'AHV: 756.1234.5678.90', { beschriftung: 'Notfall-QR' }))).toBe(true);
    expect(el.attr).toEqual({ role: 'img', 'aria-label': 'Notfall-QR' });
  });

  it('räumt Beschriftung und Tooltip weg, wenn nicht gezeichnet wird', () => {
    const el = element();
    el.setAttribute('role', 'img'); el.setAttribute('aria-label', 'alt'); el.title = 'alt';
    expect(ohneZeichnen(() => qrZeichnen(el, langerText, { beschriftung: 'Notfall-QR' }))).toBe(false);
    expect(el.attr).toEqual({});
  });

  it('weist zu langen Text ab, statt zu werfen', () => {
    const el = element();
    el.innerHTML = 'alt';
    expect(ohneZeichnen(() => qrZeichnen(el, langerText))).toBe(false);
    expect(el.innerHTML).toBe('');
  });

  it('meldet false bei leerem Text und fehlendem Element', () => {
    expect(qrZeichnen(element(), '')).toBe(false);
    expect(qrZeichnen(null, 'x')).toBe(false);
  });

  it('meldet false, wenn die Bibliothek wirft', () => {
    const alt = QRCode.prototype.makeCode;
    QRCode.prototype.makeCode = () => { throw new TypeError('kaputt'); };
    try {
      expect(qrZeichnen(element(), 'Blutgruppe: A')).toBe(false);
    } finally { QRCode.prototype.makeCode = alt; }
  });
});
