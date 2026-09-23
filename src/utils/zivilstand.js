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

// true für «verheiratet» und «eingetragene Partnerschaft» — überall dort, wo das Recht
// beide gleich behandelt (gemeinsame Veranlagung, Verheiratetentarif, Plafonierung,
// Haushalt mit zwei Erwachsenen).
export function giltAlsVerheiratet(zivilstand) {
  return zivilstand === ZIVILSTAND_VERHEIRATET || zivilstand === ZIVILSTAND_EINGETRAGEN;
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
