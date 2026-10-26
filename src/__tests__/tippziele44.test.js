// Tippziele ≥ 44 px (Messlatte M7), Seitenrundgang 26.10.2026, R9/R12 — Quelltext-Wächter: an diesen Stellen
// lag die Mindesthöhe darunter (Notruf-Links und Standort-Knopf ~30 px, gerade im Ernstfall; Schublade 24 px;
// Merkliste, Kalender 32 px; Ablage-Filter, Notfallpass 36 px; zwei Zurück-Knöpfe ohne Mindesthöhe).
// Gemessen im Browser am 26.10.2026; hier gehalten, damit niemand die Werte unbemerkt zurücknimmt.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const quelle = (d) => fs.readFileSync(path.resolve(__dirname, '..', d), 'utf8');

// [Datei, eindeutiges Stück der Stelle, Richtung]: 'nach' = Stil-Objekt beginnt bei der Marke (bis zur
// schliessenden Klammer), 'vor' = Knopf, dessen Stil vor dem Beschriftungstext steht.
const STELLEN = [
  ['NotfallVorlesekarte.jsx', '    tel: {', 'nach'],
  ['NotfallVorlesekarte.jsx', 'locBtn: {', 'nach'],
  ['MerklisteView.jsx', 'tagKnopf: {', 'nach'],
  ['DocumentTresor.jsx', "'aria-pressed': aktiv", 'nach'],
  ['NotfallpassBlatt.jsx', 'knopf: {', 'nach'],
  ['ArztkofferView.jsx', "t('arztkoffer.back')", 'vor'],
  ['LegalView.jsx', "t('common.back')", 'vor'],
  ['NotfallDossier.jsx', "t('notfallpass.dossierVerweis')", 'vor'],
  ['CalendarReminders.jsx', "t('calendar.ganzerMonat')", 'vor'],
  ['CalendarReminders.jsx', 'const knopfRuhig', 'nach'],
];

describe('Tippziele ≥ 44 px an den Stellen aus dem Seitenrundgang', () => {
  for (const [datei, marke, richtung] of STELLEN) {
    it(`${datei}: ${marke.trim()}`, () => {
      const src = quelle(datei);
      const i = src.indexOf(marke);
      expect(i, marke).toBeGreaterThan(-1);
      // nach: bis zum Ende des Stil-Objekts; vor: die 400 Zeichen davor (Stil des Knopfs).
      const fenster = richtung === 'nach' ? src.slice(i, src.indexOf('}', i + marke.length) + 1) : src.slice(Math.max(0, i - 400), i);
      expect(fenster).toMatch(/minHeight: '44px'/);
      expect(fenster).not.toMatch(/minHeight: '(24|32|36)px'/);
    });
  }

  it('Kalender: Erledigt- und Löschen-Knopf je 44 × 44', () => {
    const src = quelle('CalendarReminders.jsx');
    expect(src.match(/padding: '6px 10px', minWidth: '44px', minHeight: '44px'/g)).toHaveLength(2);
  });

  it('Schublade «Ansicht & Sprache»: Schliessen 44 × 44 statt 24', () => {
    expect(quelle('MobileNav.jsx')).not.toMatch(/minWidth: '24px', minHeight: '24px'/);
  });
});
