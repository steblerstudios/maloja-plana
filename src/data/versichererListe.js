// Auto-generated from BAG zugelassene Krankenversicherer
// Source: priminfo.admin.ch — Stand 01.01.2026
// Run: node scripts/build-praemien-data.mjs

const V = [{"nr":1560,"name":"Agrisano","ort":"5200 Brugg"},{"nr":1507,"name":"AMB Assurances SA","ort":"1934 Le Châble"},{"nr":32,"name":"Aquilana","ort":"5401 Baden"},{"nr":1542,"name":"Assura-Basis SA","ort":"1009 Pully"},{"nr":312,"name":"Atupri Gesundheitsversicherung AG","ort":"3000 Bern"},{"nr":343,"name":"Avenir Krankenversicherung AG","ort":"1919 Martigny"},{"nr":1322,"name":"Birchmeier","ort":"5444 Künten"},{"nr":290,"name":"CONCORDIA","ort":"6002 Luzern"},{"nr":8,"name":"CSS","ort":"6002 Luzern"},{"nr":820,"name":"curaulta","ort":"7144 Vella"},{"nr":881,"name":"EGK","ort":"4242 Laufen"},{"nr":134,"name":"Einsiedler Krankenkasse","ort":"8840 Einsiedeln"},{"nr":1386,"name":"GALENOS AG","ort":"3000 Bern"},{"nr":780,"name":"Glarner","ort":"8762 Schwanden"},{"nr":1562,"name":"Helsana","ort":"8600 Dübendorf"},{"nr":376,"name":"KPT","ort":"3000 Bern"},{"nr":360,"name":"Luzerner Hinterland","ort":"6144 Zell"},{"nr":1479,"name":"Mutuel Krankenversicherung AG","ort":"1919 Martigny"},{"nr":1535,"name":"Philos Krankenversicherung AG","ort":"1919 Martigny"},{"nr":1401,"name":"rhenusana","ort":"9435 Heerbrugg"},{"nr":1568,"name":"sana24","ort":"3000 Bern"},{"nr":1509,"name":"Sanitas","ort":"8021 Zürich"},{"nr":923,"name":"SLKK","ort":"8042 Zürich"},{"nr":941,"name":"sodalis","ort":"3930 Visp"},{"nr":246,"name":"Steffisburg","ort":"3612 Steffisburg"},{"nr":194,"name":"Sumiswalder","ort":"3454 Sumiswald"},{"nr":1384,"name":"SWICA","ort":"8401 Winterthur"},{"nr":1113,"name":"Vallée d’Entremont","ort":"1937 Orsières"},{"nr":1555,"name":"Visana","ort":"3000 Bern"},{"nr":1040,"name":"Visperterminen","ort":"3932 Visperterminen"},{"nr":966,"name":"vita surselva","ort":"7130 Ilanz"},{"nr":509,"name":"Vivao Sympany","ort":"4001 Basel"},{"nr":1318,"name":"Wädenswil","ort":"8820 Wädenswil"},{"nr":455,"name":"ÖKK","ort":"7302 Landquart"}];

export function getAllInsurers() {
  return V.map(v => v.name);
}

export function searchInsurers(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return V.filter(v => v.name.toLowerCase().includes(q)).map(v => v.name);
}

export function getInsurerInfo(name) {
  return V.find(v => v.name === name) || null;
}

export const INSURER_COUNT = 34;
export const INSURER_DATA_VERSION = '2026-01-01';
export const INSURER_DATA_SOURCE = 'BAG priminfo.admin.ch';
