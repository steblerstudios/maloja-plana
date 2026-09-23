// Die Kassenkarte ist der Sonderfall unter den drei QR-Codes.
//
// Gemessen 22.09.2026: die normale Kamera zeigt eine JSON-Nutzlast nicht an («no usable data
// found»). Anders als beim Organspende-Code hat das JSON hier aber einen echten Leser —
// `parseKKQRCode` holt die Karte wieder in Maloja herein. Das JSON zu ersetzen hätte diesen
// Weg zerschnitten; der Widerspruch lag in der Beschriftung («Zum Notfall-Pass scannen»).
//
// Darum jetzt zwei Codes. Diese Tests halten fest, dass BEIDE Aufgaben erfüllt bleiben:
// der Rundlauf in die App UND die Lesbarkeit für eine fremde Kamera.
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { generateKKQRCode, parseKKQRCode } from '../kkScanner.js';

let kkNotfallVcard;
let gesetzt = [];

beforeAll(async () => {
  if (!('window' in globalThis)) { globalThis.window = globalThis; gesetzt.push('window'); }
  if (!('document' in globalThis)) gesetzt.push('document');
  globalThis.document = globalThis.document || {
    documentElement: { tagName: 'div' },
    getElementById: () => null,
    createElement: () => ({ style: {}, getContext: () => null, appendChild() {}, setAttribute() {} }),
  };
  ({ kkNotfallVcard } = await import('../KKScanner.jsx'));
});

afterAll(() => { for (const k of gesetzt) delete globalThis[k]; gesetzt = []; });

const t = (k) => ({
  'kkScanner.qrKarteTitel': 'Krankenversicherung',
  'kkScanner.title': 'KK-Karte scannen',
  'kkScanner.insurer': 'Versicherer',
  'kkScanner.cardNumber': 'Kartennummer',
  'kkScanner.ahv': 'AHV-Nummer',
  'kkScanner.franchise': 'Franchise (CHF)',
  'kkScanner.model': 'Modell',
}[k] ?? k);

const kkData = {
  insurer: 'ÖKK', cardNumber: '80756001234567890', holder: 'Zoë Müller',
  ahv: '756.1234.5678.90', franchise: '2500', model: 'Standard',
};

// Entfaltet vor dem Lesen: die Norm bricht Zeilen über 75 Oktette um und setzt der
// Fortsetzung ein Leerzeichen voran (seit 22.09.2026 auch bei uns). Jeder Leser muss das
// rückgängig machen — ein Telefon tut es, dieser Test tut es hier.
const entfalten = (vcard) => String(vcard).replace(/\r\n /g, '');

const felderVon = (vcard) => {
  const aus = {};
  for (const zeile of entfalten(vcard).split('\r\n')) {
    const i = zeile.indexOf(':');
    if (i === -1) continue;
    aus[zeile.slice(0, i)] = zeile.slice(i + 1);
  }
  return aus;
};
const notizVon = (v) => String(felderVon(v).NOTE ?? '').replace(/\\([\\;,n])/g, (_, z) => (z === 'n' ? '\n' : z));

describe('KK-Karte: zwei Codes, zwei Aufgaben', () => {
  it('der Rundlauf in die App bleibt unangetastet', () => {
    // Das ist der Grund, warum das JSON hier NICHT ersetzt wurde.
    const zurueck = parseKKQRCode(generateKKQRCode(kkData));
    expect(zurueck).not.toBeNull();
    expect(zurueck.insurer).toBe('ÖKK');
    expect(zurueck.cardNumber).toBe('80756001234567890');
  });

  it('der lesbare Code ist eine vCard, kein JSON', () => {
    const v = kkNotfallVcard({ t, kkData });
    expect(v.startsWith('BEGIN:VCARD')).toBe(true);
    expect(() => JSON.parse(v)).toThrow();
  });

  it('trägt die Angaben in Wörtern, mit der versicherten Person als Name', () => {
    const v = kkNotfallVcard({ t, kkData });
    expect(felderVon(v).FN).toBe('Zoë Müller');
    const notiz = notizVon(v);
    expect(notiz).toContain('Versicherer: ÖKK');
    expect(notiz).toContain('Kartennummer: 80756001234567890');
    expect(notiz).toContain('AHV-Nummer: 756.1234.5678.90');
  });

  it('nimmt eine Überschrift, die auf einer Karte Sinn ergibt — keine Handlungsaufforderung', () => {
    // `kkScanner.title` heisst «KK-Karte scannen»; das wäre auf einem Notfall-Ausweis Unsinn.
    const notiz = notizVon(kkNotfallVcard({ t, kkData }));
    expect(notiz.split('\n')[0]).toBe('Krankenversicherung:');
    expect(notiz).not.toContain('scannen');
  });

  it('lässt leere Felder weg, statt Etiketten ohne Wert zu zeigen', () => {
    const notiz = notizVon(kkNotfallVcard({ t, kkData: { insurer: 'CSS' } }));
    expect(notiz).toContain('Versicherer: CSS');
    expect(notiz).not.toContain('Kartennummer');
    expect(notiz).not.toContain('Franchise');
  });

  it('kommt ohne Daten durch, ohne zu werfen', () => {
    const v = kkNotfallVcard({ t });
    expect(v.startsWith('BEGIN:VCARD')).toBe(true);
    expect(felderVon(v).FN).toBe('Krankenversicherung');
  });

  it('zerlegt einen Versicherernamen mit Komma nicht in Felder', () => {
    const v = kkNotfallVcard({ t, kkData: { insurer: 'Muster, Kasse AG' } });
    expect(v.split('\r\n').filter(z => z.startsWith('NOTE:')).length).toBe(1);
    expect(notizVon(v)).toContain('Muster, Kasse AG');
  });
});
