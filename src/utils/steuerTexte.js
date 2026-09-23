// K66: gemeinsame Anzeige-Helfer der Steuer-Schätzung, ohne React-Bezug.
// Genutzt von TaxCalculator, FinanzUebersicht, KantonssteuerOrientierung und
// dossierGenerator — alle lazy geladen, darum bleibt dieses Modul aus dem Hauptbundle.

// Tausendertrennung wie in FinanzUebersicht/dossierGenerator — nicht von der Laufzeit-Locale abhängig.
export const chf = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '’');

// R4: die Annahmen hinter einer gezeigten Zahl (annahmen aus steuernFuerProfil), als Sätze.
export const annahmenTexte = (t, annahmen) => [
  annahmen?.ohneDreizehnten && t('tax.annahmeOhneDreizehnten'),
  annahmen?.alleinverdiener && t('tax.annahmeAlleinverdiener'),
  annahmen?.einzeln && t('tax.annahmeEinzeln'),
].filter(Boolean);
