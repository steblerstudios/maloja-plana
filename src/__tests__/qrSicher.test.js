// K80 (17.09.2026): QR im Notfall-Dossier fehlte bei längeren Angaben — und schon ein
// einziger Umlaut verfälschte die Kodierung. Diese Tests halten beides fest.
import { describe, it, expect, beforeAll } from 'vitest';

// QRCode.js hängt sich beim Import an `window`; die Testumgebung ist Node.
let QRCode;
let qrKuerzen;
let qrZeichnen;
let utf8Laenge;
let QR_MAX_BYTES;

beforeAll(async () => {
  globalThis.window = globalThis;
  globalThis.document = globalThis.document || {
    documentElement: { tagName: 'div' },
    getElementById: () => null,
    createElement: () => ({ style: {}, getContext: () => null, appendChild() {}, setAttribute() {} }),
  };
  ({ default: QRCode } = await import('../vendor/qrcodejs.js'));
  ({ qrKuerzen, qrZeichnen, utf8Laenge, QR_MAX_BYTES } = await import('../utils/qrSicher.js'));
});

const element = () => ({ innerHTML: '', style: {}, title: '', childNodes: [], appendChild() {} });

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

  it('teilt kein Zeichen, wenn schon die erste Zeile zu lang ist', () => {
    const r = qrKuerzen('ü'.repeat(1000), 101);
    expect(utf8Laenge(r.text)).toBeLessThanOrEqual(101);
    expect(r.text).not.toContain('�');
    expect(r.text.split('\n')[0]).toMatch(/^ü+$/);
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
