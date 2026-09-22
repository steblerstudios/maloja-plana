// Der Organspende-QR trug bis zum 22.09.2026 rohes JSON. Gemessen an zwei Versuchsreihen
// zeigt die normale Kamera eine solche Nutzlast nicht an — sie liest den Code und meldet
// «no usable data found». Beim Nachmessen kam ein zweiter Befund dazu: das JSON hatte
// NIRGENDS im Code einen Leser. Der Ausweis war von beiden Seiten unlesbar.
//
// Diese Tests halten die Zusage fest: die Angaben stehen in Wörtern auf der Karte, die Nummer
// ist wählbar, und nichts fällt stillschweigend weg.
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// QRCode.js hängt sich beim Import an `window`; die Testumgebung ist Node. Deshalb erst die
// Umgebung stellen, dann dynamisch importieren — gleiches Muster wie in qrSicher.test.js.
let organSpendeVcard;
let organOptionen;
let gesetzt = [];

beforeAll(async () => {
  if (!('window' in globalThis)) { globalThis.window = globalThis; gesetzt.push('window'); }
  if (!('document' in globalThis)) gesetzt.push('document');
  globalThis.document = globalThis.document || {
    documentElement: { tagName: 'div' },
    getElementById: () => null,
    createElement: () => ({ style: {}, getContext: () => null, appendChild() {}, setAttribute() {} }),
  };
  ({ organSpendeVcard, organOptionen } = await import('../OrganDonation.jsx'));
});

// Nur abräumen, was dieser Test selbst gesetzt hat.
afterAll(() => { for (const k of gesetzt) delete globalThis[k]; gesetzt = []; });

// Etiketten-Attrappe: gibt den Schlüssel zurück, damit die Tests nicht an Wortlauten kleben.
const t = (k) => ({
  'organ.title': 'Organspende',
  'organ.status': 'Status',
  'organ.registered': 'Registriert',
  'organ.notRegistered': 'Nicht registriert',
  'organ.declined': 'Abgelehnt',
  'organ.organsAndTissue': 'Organe und Gewebe',
  'organ.heart': 'Herz',
  'organ.lungs': 'Lunge',
  'organ.liver': 'Leber',
  'organ.kidneys': 'Nieren',
  'organ.cornea': 'Hornhaut',
  'organ.boneMarrow': 'Knochenmark',
  'notfallSummary.bloodType': 'Blutgruppe',
  'chapters.basis.fields.ahv': 'AHV-Nummer',
}[k] ?? k);

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
const entmaskieren = (wert) => String(wert ?? '').replace(/\\([\\;,n])/g, (_, z) => (z === 'n' ? '\n' : z));
const notizVon = (vcard) => entmaskieren(felderVon(vcard).NOTE);

const basisDaten = {
  basis: { firstName: 'Zoë', lastName: 'Müller', phone: '079 123 45 67', ahv: '756.1234.5678.90' },
  notfall: { bloodType: 'A+' },
};

describe('Organspende-QR als vCard', () => {
  it('ist eine vCard, keine JSON-Zeichenkette', () => {
    const v = organSpendeVcard({ t, data: basisDaten, status: 'registered', organs: {} });
    expect(v.startsWith('BEGIN:VCARD')).toBe(true);
    expect(() => JSON.parse(v)).toThrow();
  });

  it('nennt die Organe in Wörtern, nicht als Schlüssel', () => {
    const v = organSpendeVcard({ t, data: basisDaten, status: 'registered', organs: { heart: true, kidneys: true } });
    const notiz = notizVon(v);
    expect(notiz).toContain('Herz');
    expect(notiz).toContain('Nieren');
    expect(notiz).not.toContain('heart');
    expect(notiz).not.toContain('kidneys');
  });

  it('trägt den Freitext mit seinem Inhalt — nicht als das Wort «other»', () => {
    const v = organSpendeVcard({ t, data: basisDaten, status: 'registered', organs: { other: 'Haut' } });
    const notiz = notizVon(v);
    expect(notiz).toContain('Haut');
    expect(notiz).not.toContain('other');
  });

  it('lässt eine Angabe aus alten Daten stehen, auch wenn ihr Wort fehlt', () => {
    // `pancreas` hat in keiner Sprache ein Etikett und ist in der Oberfläche nicht wählbar.
    // Auf einem Notfall-Ausweis wird trotzdem nichts stillschweigend weggelassen.
    const v = organSpendeVcard({ t, data: basisDaten, status: 'registered', organs: { pancreas: true } });
    expect(notizVon(v)).toContain('pancreas');
  });

  it('führt die Telefonnummer als eigenes Feld — damit sie wählbar ist', () => {
    const v = organSpendeVcard({ t, data: basisDaten, status: 'registered', organs: {} });
    expect(felderVon(v)['TEL;TYPE=CELL']).toBe('079 123 45 67');
  });

  it('maskiert die AHV-Nummer nicht weg und zerlegt sie nicht in Felder', () => {
    const v = organSpendeVcard({ t, data: basisDaten, status: 'registered', organs: {} });
    expect(v.split('\r\n').filter(z => z.startsWith('NOTE:')).length).toBe(1);
    expect(notizVon(v)).toContain('756.1234.5678.90');
  });

  it('gibt jeden der drei Status als Wort wieder', () => {
    for (const [status, wort] of [['registered', 'Registriert'], ['not_registered', 'Nicht registriert'], ['declined', 'Abgelehnt']]) {
      expect(notizVon(organSpendeVcard({ t, data: basisDaten, status, organs: {} }))).toContain(wort);
    }
  });

  it('kommt ohne Daten durch, ohne zu werfen', () => {
    const v = organSpendeVcard({ t, status: 'declined', organs: {} });
    expect(v.startsWith('BEGIN:VCARD')).toBe(true);
    expect(v).not.toContain('TEL');
    expect(felderVon(v).FN).toBe('Organspende');
  });

  it('hält die Etiketten-Liste und die Oberfläche an einer Quelle', () => {
    expect(organOptionen(t).map(o => o.key)).toEqual(['heart', 'lungs', 'liver', 'kidneys', 'corneas', 'bone']);
  });
});
