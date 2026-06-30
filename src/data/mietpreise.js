// Durchschnittliche Netto-Monatsmiete (ohne Neben-/Heizkosten) pro Wohnung,
// nach Kanton und Zimmerzahl. Quelle: BFS Strukturerhebung, Tabelle
// „Mietpreis in Franken nach Zimmerzahl und Kanton" (asset 20784921), Stand 2020.
// CHF — direkt vergleichbar mit wohnen.rentAmount (ebenfalls Nettomiete).
//
// WICHTIG (Ehrlichkeit): der Total-Schnitt mischt Wohnungsgrössen und ist
// irreführend (Städte mit vielen kleinen Wohnungen wirken „billig"). Darum
// vergleichen wir size-matched nach Zimmerzahl — abgeleitet aus der
// Haushaltsgrösse (Heuristik) oder, falls erfasst, aus der Zimmerzahl direkt.
//
// Werte je Kanton: [Total, 1, 2, 3, 4, 5, 6+] Zimmer.
export const MIETPREIS_DATA_YEAR = 2020;
export const MIETPREIS_DATA_SOURCE = 'BFS';

const arr = (a) => ({ total: a[0], r1: a[1], r2: a[2], r3: a[3], r4: a[4], r5: a[5], r6: a[6] });

export const RENT_NATIONAL = arr([1373, 819, 1111, 1327, 1578, 1928, 2429]);

export const RENT_BY_CANTON = {
  ZH: arr([1597, 989, 1339, 1538, 1827, 2262, 2988]),
  BE: arr([1233, 733, 998, 1193, 1420, 1722, 2096]),
  LU: arr([1364, 745, 1062, 1325, 1506, 1826, 2142]),
  UR: arr([1164, 641, 903, 1077, 1288, 1470, 1954]),
  SZ: arr([1566, 782, 1152, 1483, 1756, 2113, 2517]),
  OW: arr([1356, 756, 996, 1311, 1509, 1958, 1963]),
  NW: arr([1494, 705, 1118, 1426, 1667, 2032, 2167]),
  GL: arr([1169, 576, 879, 1136, 1318, 1602, 1701]),
  ZG: arr([1824, 890, 1366, 1686, 2049, 2598, 3025]),
  FR: arr([1242, 716, 1000, 1217, 1444, 1785, 2041]),
  SO: arr([1196, 693, 944, 1153, 1373, 1686, 2020]),
  BS: arr([1340, 817, 1099, 1331, 1717, 2302, 2816]),
  BL: arr([1418, 739, 1119, 1350, 1624, 2059, 2888]),
  SH: arr([1218, 684, 1010, 1143, 1346, 1734, 1786]),
  AR: arr([1207, 554, 917, 1119, 1341, 1498, 1963]),
  AI: arr([1307, null, 1033, 1209, 1598, 1625, 1666]),
  SG: arr([1247, 687, 1002, 1208, 1375, 1643, 1952]),
  GR: arr([1242, 731, 1018, 1254, 1454, 1624, 1805]),
  AG: arr([1381, 762, 1111, 1325, 1555, 1877, 2149]),
  TG: arr([1268, 714, 991, 1215, 1409, 1679, 1927]),
  TI: arr([1192, 739, 982, 1199, 1428, 1780, 2138]),
  VD: arr([1384, 817, 1118, 1377, 1726, 2079, 2920]),
  VS: arr([1147, 676, 948, 1174, 1363, 1561, 1822]),
  NE: arr([1026, 630, 814, 952, 1229, 1528, 1916]),
  GE: arr([1462, 941, 1157, 1383, 1621, 1939, 2679]),
  JU: arr([957, 595, 785, 870, 1091, 1420, 1263]),
};

// Methode 3: explizite Zimmerzahl → Spalte (auf 1–6 begrenzt).
export function roomKeyFromRooms(rooms) {
  const r = Math.round(Number(rooms));
  if (!r || r < 1) return null;
  if (r <= 1) return 'r1';
  if (r >= 6) return 'r6';
  return 'r' + r;
}

// Methode 2: Haushaltsgrösse → typische Zimmerzahl (Heuristik, da Schweizer
// Wohnungen meist mehr Zimmer als Bewohner haben). Verfeinerbar via roomKeyFromRooms.
export function roomKeyFromHousehold(size) {
  const n = Number(size);
  if (!n || n < 1) return 'total';
  if (n === 1) return 'r3';
  if (n === 2) return 'r4';
  if (n === 3) return 'r4';
  if (n === 4) return 'r5';
  return 'r6';
}

// Vergleicht die Miete der Wohngemeinde (Kanton) mit dem Schweizer Schnitt —
// size-matched (gleiche Zimmerzahl), gleiche Quelle/Definition. null wenn unbekannt.
export function getRentComparison(cantonCode, { rooms, householdSize } = {}) {
  const c = RENT_BY_CANTON[cantonCode];
  if (!c) return null;
  let rk = roomKeyFromRooms(rooms) || roomKeyFromHousehold(householdSize);
  // Fallback auf Total, wenn die Zimmer-Spalte (z.B. AI 1-Zimmer) nicht publiziert ist.
  if (c[rk] == null || RENT_NATIONAL[rk] == null) rk = 'total';
  const regional = c[rk];
  const national = RENT_NATIONAL[rk];
  if (regional == null || national == null) return null;
  const diffPct = ((regional - national) / national) * 100;
  return { regional, national, diffPct, roomKey: rk, year: MIETPREIS_DATA_YEAR };
}
