import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { SPRACHEN } from '../../scripts/seiten-sprachen.mjs';
import { HINTERGRUND } from '../../scripts/seiten/krankenkasse.mjs';
import { VALID_VIEWS, UMLEITUNGEN } from '../utils/hashRouter.js';

// Seitenlandkarte E1 (docs/entscheide/seitenlandkarte-2026-11.md, 05.11.2026): Der Knopf «Beispiel
// ansehen» auf den Erklärseiten führte nur auf «/», also ans Beta-Tor und danach in die Übersicht. Wer
// über Sozialhilfe gelesen hatte, musste den Rechner erst suchen. Jetzt führt er direkt zum passenden
// Werkzeug. Das Tor lässt die Adresse durch: nach «Ohne Code ausprobieren» steht man dort
// (im Browser geprüft 05.11.2026).
const WURZEL = process.cwd();
const lies = (p) => fs.readFileSync(path.resolve(WURZEL, 'public', p, 'index.html'), 'utf8');
const knopf = (html) => [...html.matchAll(/<a class="knopf" href="([^"]+)"/g)].map((m) => m[1]);

const ERWARTET = {
  'was-steht-mir-zu': 'situationen',
  praemienverbilligung: 'premium',
  sozialhilfe: 'sozialhilfe',
  steuern: 'tax',
  krankenkasse: 'praemien',
  'kantone-im-vergleich': 'praemien',
  // E-A (Wege durch Maloja, 07.11.2026).
  kantonsatlas: 'praemien',
};

describe('E-A · Kantonsatlas führt in die Versicherungs-Übersicht, Politsystem bleibt bei der Startseite', () => {
  it('kantonsatlas → #/praemien', () => expect(knopf(lies('kantonsatlas'))).toEqual(['/#/praemien']));
  it('politsystem → /', () => expect(knopf(lies('politsystem'))).toEqual(['/']));
});

describe('Erklärseiten führen direkt zum passenden Werkzeug', () => {
  for (const s of SPRACHEN) {
    for (const pfad of ['was-steht-mir-zu', 'praemienverbilligung', 'sozialhilfe', 'steuern']) {
      it(`${s.code}/${pfad} → #/${ERWARTET[pfad]}`, () => {
        expect(knopf(lies(s.praefix + pfad))).toEqual([`/#/${ERWARTET[pfad]}`]);
      });
    }
  }

  for (const h of HINTERGRUND) {
    it(`Hintergrund ${h.pfad} → #/${ERWARTET[h.pfad]}`, () => {
      expect(knopf(lies(h.pfad))).toEqual([`/#/${ERWARTET[h.pfad]}`]);
    });
  }

  it('jedes Ziel ist eine echte Seite der App, keine Umleitung', () => {
    for (const view of new Set(Object.values(ERWARTET))) {
      expect(VALID_VIEWS.has(view), view).toBe(true);
      expect(UMLEITUNGEN[view], view).toBeUndefined();
    }
  });

  it('Rechtliches hat keinen Beispiel-Knopf', () => {
    expect(knopf(lies('rechtliches'))).toEqual([]);
  });
});
