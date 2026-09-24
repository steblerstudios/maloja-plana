// K66: gemeinsame Anzeige-Helfer der Steuer-Schätzung, ohne React-Bezug.
// Genutzt von TaxCalculator, FinanzUebersicht, KantonssteuerOrientierung und
// dossierGenerator — alle lazy geladen, darum bleibt dieses Modul aus dem Hauptbundle.

// Tausendertrennung wie in FinanzUebersicht/dossierGenerator — nicht von der Laufzeit-Locale abhängig.
import { zahl } from './geld.js';

export const chf = (n) => zahl(n); // seit 24.09.2026 aus utils/geld.js — dieselbe Regel, eine Quelle

// R4: die Annahmen hinter einer gezeigten Zahl (annahmen aus steuernFuerProfil), als Sätze.
export const annahmenTexte = (t, annahmen) => [
  annahmen?.ohneDreizehnten && t('tax.annahmeOhneDreizehnten'),
  annahmen?.alleinverdiener && t('tax.annahmeAlleinverdiener'),
  annahmen?.einzeln && t('tax.annahmeEinzeln'),
  annahmen?.kinderabzugGanz && t('tax.annahmeKinderabzugKonkubinat'),
].filter(Boolean);
