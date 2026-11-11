// Wohnen international (Stebler Studios 11.11.2026: «das Schild rechts neben dem Vergleichshaus … internationaler
// Vergleich und EU und wie viel wir drüber/drunter sind, mit Fähnchen»).
//
// Quelle (am 11.11.2026 an der Eurostat-API nachgelesen, Quellenprüfung swiss-precision-pruefer):
//   Eurostat, prc_ppp_ind_1 «Purchasing power parities, price level indices … based on COICOP 2018», aktualisiert
//   09.07.2026, Indikator PLI_EU27_2020 (EU27 = 100), Kategorie A0104 «Housing, water, electricity, gas and other
//   fuels», Jahr 2025. Keine Status-Markierung (vorläufig/geschätzt) in der Antwort.
// Vorbehalte, die im Satz stehen müssen:
//   • Es ist «Wohnen und Energie», KEIN reiner Mietvergleich (Wasser, Strom, Gas, Brennstoffe gehören dazu). Eine
//     amtliche Grösse nur für Mieten zwischen der Schweiz und der EU gibt es nicht.
//   • Umgerechnet zu Wechselkursen: ein grosser Teil des Abstands kommt vom allgemein hohen Schweizer Preisniveau.
//   • Landesdurchschnitt; NICHT mit der BFS-Miete in Franken (Vergleichshaus) verrechnen oder in Euro umrechnen.
export const WOHNEN_INTERNATIONAL = {
  quelle: 'Eurostat, prc_ppp_ind_1, A0104',
  url: 'https://ec.europa.eu/eurostat/databrowser/view/prc_ppp_ind_1/default/table',
  jahr: 2025,
  stand: '2026-07-09',
  // Preisniveau-Index, EU27 = 100
  index: { CH: 213.1, EU: 100, DE: 113.9, FR: 120.7, IT: 91.4, AT: 113.4 },
};

// Wie viel teurer (+) oder günstiger (−) Wohnen und Energie in der Schweiz sind als in … — auf ganze Prozent.
export function schweizGegen(stand = WOHNEN_INTERNATIONAL) {
  const ch = stand.index.CH;
  return ['EU', 'DE', 'AT', 'FR', 'IT'].map((code) => ({ code, pct: Math.round((ch / stand.index[code] - 1) * 100) }));
}

// Stöcke im Vergleichshaus (Stebler Studios 11.11.2026: «EU und international im Vergleichshaus eingebaut, so wie BS
// und CH»). Es gibt keine gemessene EU-Miete in Franken. Die Höhe wird darum ABGELEITET: Schweizer Schnitt × Preis-
// niveau(Land) ÷ Preisniveau(CH) — «so viel wie der Schweizer Schnitt, zum Preisniveau für Wohnen und Energie des
// Landes». Die Fahne trägt deshalb Prozent, nie Franken; der Satz unter der Strasse sagt es.
export function auslandStoecke(chSchnitt, stand = WOHNEN_INTERNATIONAL) {
  if (!(chSchnitt > 0)) return null;
  const hoehe = (code) => chSchnitt * stand.index[code] / stand.index.CH;
  const pct = (code) => Math.round((stand.index[code] / stand.index.CH - 1) * 100);
  const nachbarn = ['DE', 'AT', 'FR', 'IT'];
  const hoehen = nachbarn.map(hoehe);
  const prozente = nachbarn.map(pct);
  return {
    eu: { hoehe: hoehe('EU'), pct: pct('EU') },
    nachbarn: { von: Math.min(...hoehen), bis: Math.max(...hoehen), pctVon: Math.min(...prozente), pctBis: Math.max(...prozente), codes: nachbarn },
  };
}
