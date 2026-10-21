// Zivilstand — eine Wahrheit für alle Rechner.
//
// Die eingetragene Partnerschaft ist steuerlich und im Sozialversicherungsrecht der Ehe
// gleichgestellt. Belegt am 23.09.2026 an Fedlex (konsolidierte Fassungen):
//   · DBG Art. 9 Abs. 1bis (SR 642.11): «Die Stellung eingetragener Partnerinnen oder Partner
//     entspricht in diesem Gesetz derjenigen von Ehegatten.»
//     https://fedlex.data.admin.ch/eli/cc/1991/1184_1184_1184
//   · StHG Art. 3 Abs. 4 (SR 642.14): dasselbe für die Kantons- und Gemeindesteuern.
//     https://fedlex.data.admin.ch/eli/cc/1991/1256_1256_1256
//   · ATSG Art. 13a Abs. 1 (SR 830.1): «Solange eine eingetragene Partnerschaft dauert, ist sie
//     im Sozialversicherungsrecht einer Ehe gleichgestellt.» (gilt für AHV, BVG u. a.)
//     https://fedlex.data.admin.ch/eli/cc/2002/510
//   · PartG Art. 1 (SR 211.231): seit 1.7.2022 (Ehe für alle) regelt das Gesetz nur noch die
//     vorher begründeten Partnerschaften; neue werden keine mehr eingetragen. Umwandlung in
//     eine Ehe: Art. 35/35a. https://fedlex.data.admin.ch/eli/cc/2005/782
//
// Darum fragt jeder Rechner hier, statt `=== 'married'` selbst zu schreiben: eine zweite
// Bedingung an sieben Stellen wird an der achten vergessen.

export const ZIVILSTAND_VERHEIRATET = 'married';
export const ZIVILSTAND_EINGETRAGEN = 'registeredPartnership';

// «Aufgelöste Partnerschaft» — der amtliche Zivilstand nach dem Ende einer eingetragenen
// Partnerschaft. Belegt am 23.09.2026 an Fedlex:
//   · ZStV Art. 8 lit. d Ziff. 1 (SR 211.112.2, Fassung 1.6.2025): kennt drei Status —
//     «gerichtlich aufgelöste Partnerschaft / durch Tod aufgelöste Partnerschaft / durch
//     Verschollenerklärung aufgelöste Partnerschaft»; fr «partenariat dissous», it «unione
//     domestica sciolta», rm «partenadi schlià». https://fedlex.data.admin.ch/eli/cc/2004/362
//   · ATSG Art. 13a Abs. 2 und 3 (SR 830.1): die überlebende Person ist «einem Witwer
//     gleichgestellt», die gerichtliche Auflösung «einer Scheidung».
//   · DBG Art. 9 Abs. 1bis (SR 642.11, Fassung 2.9.2026): zusammengerechnet wird nur «in
//     rechtlich und tatsächlich ungetrennter eingetragener Partnerschaft»; für Unterhalt und
//     Auseinandersetzung «bei … Auflösung» gilt dasselbe wie für Ehegatten — also wie
//     geschieden bzw. verwitwet: Einzeltarif, Elterntarif nur mit Kindern im Haushalt.
// Maloja fragt die drei Arten nicht einzeln: kein Rechner behandelt «geschieden» oder
// «verwitwet» heute besonders — alle rechnen wie alleinstehend. Wird einmal eine
// Hinterlassenenrente gerechnet, muss die Art der Auflösung dazu (Witwer-, nicht Witwenregeln).
export const ZIVILSTAND_AUFGELOEST = 'dissolvedPartnership';

// true für «verheiratet» und «eingetragene Partnerschaft» — überall dort, wo das Recht
// beide gleich behandelt (gemeinsame Veranlagung, Verheiratetentarif, Plafonierung,
// Haushalt mit zwei Erwachsenen). Die aufgelöste Partnerschaft gehört nicht dazu.
export function giltAlsVerheiratet(zivilstand) {
  return zivilstand === ZIVILSTAND_VERHEIRATET || zivilstand === ZIVILSTAND_EINGETRAGEN;
}

// true, wenn es (mindestens) eine Ehe oder eingetragene Partnerschaft gab oder gibt — auch nach
// Scheidung, Verwitwung oder Auflösung. Gebraucht für die AHV-Erziehungs-/Betreuungsgutschriften:
// «Bei Ehepaaren werden die Erziehungsgutschriften während der Kalenderjahre der Ehe (zwingend)
// hälftig geteilt» (BSV-Merkblatt 1.07, Stand 1.1.2016, Nachdruck Nov. 2024, Ziff. 1;
// gleich Merkblatt 3.01, Stand 1.1.2026, Ziff. 19/20). Die Teilung hängt an den Ehejahren,
// nicht am heutigen Zivilstand.
export function warVerheiratet(zivilstand) {
  return giltAlsVerheiratet(zivilstand) || zivilstand === ZIVILSTAND_AUFGELOEST
    || zivilstand === 'divorced' || zivilstand === 'widowed';
}

// Anzeige-Text eines gespeicherten Zivilstands in der aktuellen Sprache. Unbekannte oder
// alte Werte (z. B. von Hand importiert) erscheinen unverändert statt als roher Schlüssel.
export function zivilstandLabel(wert, t) {
  if (!wert) return '';
  if (typeof t !== 'function') return wert;
  const schluessel = 'chapters.basis.fields.maritalStatus.options.' + wert;
  const text = t(schluessel);
  return typeof text === 'string' && text && text !== schluessel ? text : wert;
}
