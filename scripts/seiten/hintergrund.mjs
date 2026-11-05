// ─── Alle Hintergrundseiten ──────────────────────────────────────────────────
// Längere, nur deutsche Seiten mit Zahlen und Bildern, gebaut von
// scripts/build-seiten.mjs (hintergrundBauen). Jede Seite steht in ihrer
// eigenen Datei; hier nur die Liste, in der Reihenfolge der Sitemap.
//
// krankenkasse.mjs exportiert weiter HINTERGRUND = [KRANKENKASSE] für die
// Prüfungen in src/__tests__/hintergrundSeiten.test.js, die dort Zahlen der
// Krankenkasse voraussetzen. /politsystem/ hat eigene: politsystemSeite.test.js.

import { KRANKENKASSE } from './krankenkasse.mjs';
import { POLITSYSTEM } from './politsystem.mjs';

export const HINTERGRUND = [KRANKENKASSE, POLITSYSTEM];
