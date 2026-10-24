// Durchschnittliche Netto-Monatsmiete (ohne Neben-/Heizkosten) pro Wohnung,
// nach Kanton und Zimmerzahl. Quelle: BFS, Mietpreis-Strukturerhebung, Tabelle
// „Durchschnittlicher Mietpreis in Franken nach Zimmerzahl und Kanton" (je-d-09.03.03.01,
// asset 36398431, veröffentlicht 05.03.2026), Blatt «2024». Fussnote 1 der Tabelle:
// «Monatlicher Netto-Mietzins (ohne Neben- und Heizkosten) der Mieter- und Genossenschafterwohnungen».
// Nachgezogen 25.10.2026 von Stand 2020 (asset 20784921). Gegenprobe beim Übertragen: das
// Blatt «2020» derselben Datei ergab alle 27 Zeilen der bisherigen Werte genau (0 Abweichungen) —
// die Spalten sind also richtig gelesen. Datei-Prüfsumme SHA-256 cbe010c3e9c3ab18…
// AI 1 Zimmer: in der Tabelle «X» (nicht publiziert) → null, wie bisher.
// Hinweis der Tabelle: wegen methodischer Änderungen ab 2018 nur bedingt mit Jahren vor 2018 vergleichbar.
// Nachgesehen 24.10.2026 beim BFS (je-d-09.03.03.01): Erhebung heisst «Mietpreis-Strukturerhebung»
// (fr «Enquête de structure sur les loyers», it «Rilevazione strutturale sugli affitti») — so steht
// es jetzt in der Quellenzeile (vorher «Mietpreiserhebung»). Eine neuere Ausgabe 2010–2024 ist am
// 05.03.2026 erschienen (asset 36398431); die Werte hier sind noch die von 2020.
// → Erledigt 25.10.2026: Werte unten sind die von 2024 (siehe Kopf).
// CHF — direkt vergleichbar mit wohnen.rentAmount (ebenfalls Nettomiete).
//
// WICHTIG (Ehrlichkeit): der Total-Schnitt mischt Wohnungsgrössen und ist
// irreführend (Städte mit vielen kleinen Wohnungen wirken „billig"). Darum
// vergleichen wir size-matched nach Zimmerzahl — abgeleitet aus der
// Haushaltsgrösse (Heuristik) oder, falls erfasst, aus der Zimmerzahl direkt.
//
// Werte je Kanton: [Total, 1, 2, 3, 4, 5, 6+] Zimmer.
export const MIETPREIS_DATA_YEAR = 2024;
export const MIETPREIS_DATA_SOURCE = 'BFS';

const arr = (a) => ({ total: a[0], r1: a[1], r2: a[2], r3: a[3], r4: a[4], r5: a[5], r6: a[6] });

export const RENT_NATIONAL = arr([1485, 902, 1217, 1446, 1708, 2068, 2578]);

export const RENT_BY_CANTON = {
  ZH: arr([1768, 1108, 1510, 1732, 2016, 2446, 3236]),
  BE: arr([1319, 805, 1078, 1288, 1536, 1812, 2095]),
  LU: arr([1500, 890, 1202, 1448, 1655, 2020, 2334]),
  UR: arr([1219, 709, 988, 1203, 1335, 1505, 1600]),
  SZ: arr([1719, 850, 1270, 1655, 1927, 2295, 2781]),
  OW: arr([1449, 739, 1151, 1406, 1644, 2156, 2000]),
  NW: arr([1590, 796, 1189, 1547, 1821, 2159, 2122]),
  GL: arr([1299, 706, 1030, 1242, 1476, 1669, 1625]),
  ZG: arr([2024, 1029, 1579, 1875, 2270, 2770, 3428]),
  FR: arr([1328, 758, 1074, 1299, 1539, 1867, 2262]),
  SO: arr([1281, 776, 1041, 1228, 1463, 1844, 2059]),
  BS: arr([1451, 907, 1201, 1445, 1891, 2463, 3174]),
  BL: arr([1528, 845, 1219, 1469, 1760, 2195, 2699]),
  SH: arr([1287, 836, 1095, 1211, 1422, 1788, 2007]),
  AR: arr([1320, 794, 968, 1266, 1432, 1750, 1914]),
  AI: arr([1448, null, 1032, 1230, 1672, 2008, 2139]),
  SG: arr([1343, 747, 1075, 1312, 1503, 1770, 2062]),
  GR: arr([1368, 741, 1117, 1382, 1603, 1830, 1966]),
  AG: arr([1494, 866, 1208, 1440, 1691, 1986, 2274]),
  TG: arr([1373, 813, 1115, 1308, 1543, 1755, 2094]),
  TI: arr([1245, 797, 1043, 1249, 1472, 1830, 2254]),
  VD: arr([1465, 896, 1198, 1477, 1807, 2266, 2762]),
  VS: arr([1227, 740, 1028, 1260, 1459, 1745, 1862]),
  NE: arr([1091, 676, 888, 1024, 1303, 1613, 2149]),
  GE: arr([1573, 995, 1218, 1483, 1744, 2097, 3158]),
  JU: arr([999, 590, 864, 926, 1128, 1249, 1890]),
};

// Zellen, die das BFS mit «( )» kennzeichnet: «Extrapolation aufgrund von weniger als 50
// Beobachtungen. Die Resultate sind mit grosser Vorsicht zu interpretieren.» Das Kennzeichen steht
// NICHT im Zellwert, nur im Zahlenformat `[Black]\(#\ ###\)__` — wer nur Werte liest, verliert es
// (beim Stand 2020 passiert: 29 Zellen ohne Hinweis angezeigt). Fachprüfung 25.10.2026; aus dem
// Blatt «2024» per Zahlenformat gelesen, 26 Zellen, von der Prüfung unabhängig gleich gezählt.
// Beim nächsten Nachzug: Werte UND Zahlenformate lesen.
export const RENT_LOW_N = {
  UR: ['r1', 'r2', 'r6'],
  SZ: ['r6'],
  OW: ['r1', 'r5', 'r6'],
  NW: ['r1', 'r6'],
  GL: ['r1', 'r5', 'r6'],
  SO: ['r6'],
  SH: ['r1', 'r6'],
  AR: ['r1', 'r6'],
  AI: ['r2', 'r3', 'r4', 'r5', 'r6'],
  GR: ['r6'],
  VS: ['r6'],
  JU: ['r1', 'r6'],
};

// Methode 3: explizite Zimmerzahl → Spalte (auf 1–6 begrenzt).
// Eingetippt wird, wie man es kennt: «3.5», «3,5», «3½» oder «3 ½» (Feld wohnen.rooms, Text).
export function roomKeyFromRooms(rooms) {
  const text = String(rooms ?? '').trim().replace(/\s*½$/, '.5').replace(',', '.');
  const r = Math.round(Number(text));
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
  const ausZimmern = roomKeyFromRooms(rooms);
  let rk = ausZimmern || roomKeyFromHousehold(householdSize);
  // Fallback auf Total, wenn die Zimmer-Spalte (z.B. AI 1-Zimmer) nicht publiziert ist.
  const ohneWert = rk !== 'total' && (c[rk] == null || RENT_NATIONAL[rk] == null);
  if (ohneWert) rk = 'total';
  const regional = c[rk];
  const national = RENT_NATIONAL[rk];
  if (regional == null || national == null) return null;
  const diffPct = ((regional - national) / national) * 100;
  // Für die Anzeige (Fachprüfung 25.10.2026): womit verglichen wird, ob die Grösse nur aus der
  // Haushaltsgrösse angenommen ist, ob die gewünschte Grösse keinen BFS-Wert hat, und ob der Wert
  // auf weniger als 50 Beobachtungen beruht.
  return {
    regional, national, diffPct, roomKey: rk, year: MIETPREIS_DATA_YEAR,
    zimmerAngenommen: !ausZimmern && rk !== 'total',
    ohneWertFuerGroesse: ohneWert,
    wenigeAntworten: (RENT_LOW_N[cantonCode] || []).includes(rk),
  };
}
