// B5 · Voll-Audit 10/2026: «Leer starten» und danach «In den Stand übernehmen»
// ersetzten den ganzen Stand, sobald ein einziges Feld getippt war — alle übrigen
// Kapitel waren weg, ohne Rückfrage.
//
// Jetzt fragt Übernehmen nach einem Leer-Start zuerst nach (utils/probeUebernehmen.js).
// Kein DOM-Test (vitest ohne jsdom, siehe zweiTabs.test.js). Belegt sind darum:
//   1. die Entscheidung selbst, am Ablauf Leer-Start → ein Feld → übernehmen,
//   2. Wächter an der Aufrufstelle in main.jsx,
//   3. die drei neuen Texte in allen fünf Sprachen.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { probeUebernehmen } from '../utils/probeUebernehmen.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

const lies = (p) => fs.readFileSync(path.resolve(__dirname, '..', p), 'utf8');

// Der gespeicherte Stand und der Ablauf, wie ihn main.jsx führt:
// blankSandbox → {} ; updateData('person','firstName','Lea') → { person: { firstName } }.
const stand = () => ({
  person: { firstName: 'Anna', lastName: 'Muster' },
  wohnen: { postalCode: '8001', canton: 'ZH' },
  finanzen: { einkommen: 6200 },
  schulden: { liste: [{ id: 1, betrag: 1200 }] },
});
const nachLeerstartEinFeld = () => {
  const probe = {};
  return { ...probe, person: { ...probe.person, firstName: 'Lea' } };
};

// Spielt applySandbox aus main.jsx nach: «fragen» lässt den Stand stehen.
const uebernehmen = (gespeichert, probe, leerGestartet, bestaetigt) => {
  const r = probeUebernehmen({ probe, leerGestartet, bestaetigt });
  return { r, gespeichert: r.aktion === 'ersetzen' ? r.stand : gespeichert };
};

describe('B5 · Leer-Start + ein Feld + übernehmen', () => {
  it('fragt zuerst — alle Kapitel bleiben erhalten', () => {
    const gespeichert = stand();
    const { r, gespeichert: danach } = uebernehmen(gespeichert, nachLeerstartEinFeld(), true, false);
    expect(r.aktion).toBe('fragen');
    expect(danach).toBe(gespeichert);
    expect(Object.keys(danach)).toEqual(['person', 'wohnen', 'finanzen', 'schulden']);
    expect(danach.person.lastName).toBe('Muster');
  });

  it('erst nach ausdrücklicher Bestätigung wird ersetzt', () => {
    const probe = nachLeerstartEinFeld();
    const { r, gespeichert: danach } = uebernehmen(stand(), probe, true, true);
    expect(r.aktion).toBe('ersetzen');
    expect(danach).toBe(probe);
  });

  it('der Klick-Event zählt nicht als Bestätigung (main.jsx übergibt nur true/false)', () => {
    const main = lies('main.jsx');
    expect(main).toMatch(/onClick: \(\) => applySandbox\(false\)/);
    expect(main).toMatch(/onClick: \(\) => applySandbox\(true\)/);
    expect(main).not.toMatch(/onClick: applySandbox\b/);
  });
});

describe('B5 · was gleich bleibt', () => {
  it('Probier-Modus aus einer Kopie des Stands: Übernehmen ersetzt ohne Rückfrage', () => {
    const probe = { ...stand(), finanzen: { einkommen: 7000 } };
    expect(probeUebernehmen({ probe, leerGestartet: false, bestaetigt: false })).toEqual({ aktion: 'ersetzen', stand: probe });
  });

  it('leere Probe ({}) oder keine: nichts ersetzen, auch bestätigt nicht', () => {
    expect(probeUebernehmen({ probe: {}, leerGestartet: true, bestaetigt: true }).aktion).toBe('nichts');
    expect(probeUebernehmen({ probe: null, leerGestartet: false, bestaetigt: false }).aktion).toBe('nichts');
  });
});

describe('B5 · main.jsx', () => {
  const main = lies('main.jsx');

  it('«Leer starten» merkt sich den Leer-Start, «Probier-Modus» aus dem Stand nicht', () => {
    const zeile = (name) => main.split('\n').find((z) => z.includes(`const ${name} = () =>`));
    expect(zeile('blankSandbox')).toContain('setSandboxLeer(true)');
    expect(zeile('enterSandbox')).toContain('setSandboxLeer(false)');
  });

  it('applySandbox fragt, bevor es setData aufruft', () => {
    const fn = main.slice(main.indexOf('const applySandbox ='), main.indexOf('const blankSandbox ='));
    const fragen = fn.indexOf("if (r.aktion === 'fragen') { setErsetzenFragen(true); return; }");
    const ersetzen = fn.indexOf('setData(r.stand)');
    expect(fragen).toBeGreaterThan(-1);
    expect(ersetzen).toBeGreaterThan(fragen);
  });

  it('die Rückfrage zeigt Text und zwei Knöpfe, Fokus auf «Zurück»', () => {
    expect(main).toMatch(/ersetzenFragen \? React\.createElement/);
    expect(main).toMatch(/t\('sandbox\.replaceQuestion'\)/);
    expect(main).toMatch(/autoFocus: true, onClick: rueckfrageZurueck\b/);
    expect(main).toMatch(/t\('sandbox\.replaceConfirm'\)/);
  });
});

describe('B5 · Texte in allen fünf Sprachen', () => {
  const sprachen = { de, fr, it: it_, en, rm };
  for (const [code, s] of Object.entries(sprachen)) {
    it(`${code}: Frage, Zurück, Ersetzen vorhanden und nicht deutsch übernommen`, () => {
      for (const k of ['replaceQuestion', 'replaceBack', 'replaceConfirm']) {
        expect(typeof s.sandbox[k]).toBe('string');
        expect(s.sandbox[k].length).toBeGreaterThan(0);
        if (code !== 'de') expect(s.sandbox[k]).not.toBe(de.sandbox[k]);
      }
    });
  }
});
