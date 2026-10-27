// «Verwandte Ereignisse» je Ablauf (F7-A4, Entscheid Stebler Studios 27.10.2026): unten in JEDEM Ablauf,
// vorher nur in fünf (Heirat, Kind, Bewilligung, Führerausweis, Zuzug — deren Verweise sind hier
// übernommen). Nur bestehende Abläufe aus dem Register (config/ansichtenRegister.js ABLAEUFE), keine
// erfundenen Ziele; der Name kommt aus dem Register (nav), also derselbe wie in Suche und Menü.
// Gewählt nach dem, was im Leben meist zusammen kommt oder als Nächstes folgt — kein Fachinhalt.
// Wächter: ablaufVerwandte.test.js (jeder Ablauf hat Verwandte, jedes Ziel ist ein Ablauf, kein Selbstverweis).
// Liegt bewusst nicht im Register (Startbündel), sondern nur hier, nachgeladen mit der Ablauf-Schale.
export const VERWANDTE = {
  kkerst: ['kvgwechsel', 'zuzug', 'volljaehrig'],
  kvgwechsel: ['kkerst', 'umzug', 'unfallkrankheit'],
  neuerjob: ['stelleverloren', 'lehre', 'selbstaendigkeit', 'quellensteuer'],
  stelleverloren: ['neuerjob', 'unfallkrankheit', 'ergaenzungsleistungen'],
  unfallkrankheit: ['iv', 'stelleverloren', 'pflege'],
  umzug: ['wohnunggekuendigt', 'zusammenziehen', 'zuzug', 'wegzug'],
  pensionierung: ['ergaenzungsleistungen', 'vorsorgeauftrag', 'pflege'],
  mahnung: ['betreibung', 'betreibungsauszug'],
  betreibung: ['mahnung', 'betreibungsauszug'],
  selbstaendigkeit: ['neuerjob', 'stelleverloren'],
  heirat: ['kind', 'trennung', 'zusammenziehen'],
  kind: ['heirat', 'adoption'],
  trennung: ['heirat', 'umzug'],
  bewilligung: ['kkerst', 'neuerjob', 'einbuergerung'],
  fuehrerausweis: ['umzug', 'pensionierung', 'zuzug'],
  asyl: ['bewilligung', 'kkerst'],
  iv: ['unfallkrankheit', 'ergaenzungsleistungen', 'pflege'],
  pflege: ['iv', 'ergaenzungsleistungen', 'vorsorgeauftrag'],
  wohnunggekuendigt: ['umzug', 'mahnung'],
  quellensteuer: ['neuerjob', 'bewilligung', 'wegzug'],
  // Umleitung auf «Stelle verloren» (letzter Teil dort); der Eintrag zählt trotzdem als Ablauf im Register.
  aussteuerung: ['stelleverloren', 'ergaenzungsleistungen'],
  zuzug: ['umzug', 'einbuergerung', 'kkerst', 'bewilligung'],
  einbuergerung: ['bewilligung', 'zuzug', 'ausweis'],
  vorsorgeauftrag: ['pensionierung', 'todesfall', 'pflege'],
  ergaenzungsleistungen: ['pensionierung', 'iv', 'pflege'],
  zusammenziehen: ['heirat', 'umzug'],
  adoption: ['kind', 'heirat'],
  wegzug: ['umzug', 'quellensteuer', 'ausweis'],
  ausweis: ['einbuergerung', 'wegzug', 'volljaehrig'],
  betreibungsauszug: ['umzug', 'betreibung'],
  lehre: ['volljaehrig', 'neuerjob', 'dienst'],
  volljaehrig: ['lehre', 'dienst', 'kkerst'],
  dienst: ['volljaehrig', 'lehre'],
  todesfall: ['vorsorgeauftrag', 'pensionierung'],
};
