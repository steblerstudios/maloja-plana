import { UMLEITUNGEN } from '../utils/hashRouter.js';
import { describe, it, expect } from 'vitest';
import { GEGENSTAENDE, alleWege, wegeCount, gegenstandReadiness } from '../data/gepaeck.js';
import { EREIGNIS_PFADE } from '../data/ereignisZeichen.js';
import { ABLAEUFE } from '../config/ansichtenRegister.js';
import { DEMO_DATA } from '../config/demoData.js';
import { VALID_VIEWS } from '../utils/hashRouter.js';

// Das Gepäck verlinkt jeden Weg in einen bestehenden geführten Ablauf. Diese Tests
// halten die Registry ehrlich: keine toten Links, keine doppelten Schlüssel, echte Zahlen.

describe('Gepäck-Registry', () => {
  it('jeder Weg zeigt auf eine gültige View', () => {
    for (const w of alleWege()) {
      expect(VALID_VIEWS.has(w.view), `Weg "${w.key}" → unbekannte View "${w.view}"`).toBe(true);
    }
  });

  it('alle Gegenstands- und Weg-Schlüssel sind eindeutig', () => {
    const objKeys = GEGENSTAENDE.map((g) => g.key);
    expect(new Set(objKeys).size).toBe(objKeys.length);
    const wegKeys = alleWege().map((w) => w.key);
    expect(new Set(wegKeys).size).toBe(wegKeys.length);
  });

  // Seit dem Icon-Plan (Schritt 7b, 06.11.2026) nennt jeder Weg ein Register-Zeichen statt eigener
  // Pfade; die Pfade stehen in data/ereignisZeichen.js. Gruppe und Einheit prüft zeichenOrdnung.test.js.
  it('jeder Weg hat ein Zeichen mit mindestens einem Pfad', () => {
    for (const w of alleWege()) {
      const pfade = EREIGNIS_PFADE[w.icon];
      expect(Array.isArray(pfade) && pfade.length > 0, `Weg "${w.key}" ohne Zeichen`).toBe(true);
    }
  });

  it('Reife-Pünktchen: leere Daten = nichts gepackt', () => {
    for (const g of GEGENSTAENDE) {
      const r = gegenstandReadiness(g.key, {});
      expect(r.total).toBeGreaterThan(0);
      expect(r.done).toBe(0);
    }
  });

  it('Reife-Pünktchen: Demo-Daten füllen ehrlich (done>0, nie über total)', () => {
    for (const g of GEGENSTAENDE) {
      const r = gegenstandReadiness(g.key, DEMO_DATA);
      expect(r.done).toBeGreaterThan(0);
      expect(r.done).toBeLessThanOrEqual(r.total);
    }
    // Ja/Nein-Feld: willMade:'no' zählt NICHT als gepackt.
    const abschiedNo = gegenstandReadiness('abschied', { behoerden: { willMade: 'no' }, notfall: {} });
    expect(abschiedNo.done).toBe(0);
    const abschiedYes = gegenstandReadiness('abschied', { behoerden: { willMade: 'yes' }, notfall: {} });
    expect(abschiedYes.done).toBe(1);
  });

  it('wegeCount zählt echt', () => {
    expect(wegeCount('wohnen')).toBe(12);
    expect(wegeCount('abschied')).toBe(3);
    expect(wegeCount('gibtsnicht')).toBe(0);
    expect(alleWege().length).toBe(GEGENSTAENDE.reduce((n, g) => n + g.wege.length, 0));
  });
});

// Befund 24.09.2026: vier Abläufe (Zusatzversicherung, Betreibung, Führerausweis,
// Asyl) fehlten im Gepäck — nicht als Entscheid, sondern weil niemand sie
// nachtrug. Stebler Studios: «nein, bitte ändere das». Seither gilt: jeder geführte
// Ablauf liegt in einem Gegenstand.
describe('Gepäck ist vollständig', () => {
  it('jeder geführte Ablauf aus dem Register liegt in einem Gegenstand', () => {
    const imGepaeck = new Set(alleWege().map((w) => w.view));
    // F7-L11: Abläufe, die nur noch als Umleitung in einen anderen bestehen (Ausgesteuert → Stelle verloren), zählen über ihr Ziel.
    for (const a of ABLAEUFE) expect(imGepaeck.has(a.view) || imGepaeck.has(UMLEITUNGEN[a.view]?.view), `${a.view} fehlt im Gepäck`).toBe(true);
  });
});

