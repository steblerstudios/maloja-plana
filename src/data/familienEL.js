// Ergänzungsleistungen für Familien (Familien-EL) — eine kantonale Bedarfsleistung für
// Familien mit knappem Einkommen. NUR wenige Kantone haben sie — deshalb kanton-bewusst wie
// mietzinsbeitraege.js / regionaleVerguenstigungen.js: nur Kantone mit verifizierter offizieller
// Seite sind gelistet ('has'); alle anderen zeigen den Eintrag GAR NICHT (kein falsches
// Versprechen). Kein Rechner — Einkommensgrenzen und Regeln variieren je Kanton.
//
// Alle URLs 2026-07 einzeln web-verifiziert (offizielle Kantonsportale). Dies sind die
// vier kanonischen Familien-EL-Kantone (TI Pionier 1997, VD, SO, GE).
//
// Rechtsgrundlagen am 04.11.2026 an den amtlichen Texten bzw. Kantonsseiten gelesen
// (Fachprüfung swiss-precision + sozio-pruefer). Der Befund, der die App-Texte prägt:
// Weder «kleine Kinder» noch «erwerbstätig» gilt für alle vier — die Altersgrenzen reichen
// von unter 6 (SO) bis unter 18/25 (GE), und nur GE verlangt eine Erwerbstätigkeit
// (TI schliesst das ausdrücklich aus). Darum nennt der Text in lebenszustaende keine der beiden.

const FAMILIEN_EL = {
  TI: 'https://www4.ti.ch/dss/ias/prestazioni-e-contributi/scheda/p/s/dettaglio/assegno-familiare-integrativo-afi-e-assegno-di-prima-infanzia-api',
  VD: 'https://www.vd.ch/aides-financieres-et-soutien-social/aides-financieres-et-comment-les-demander/pc-familles',
  SO: 'https://so.ch/verwaltung/departement-des-innern/amt-fuer-gesellschaft-und-soziales/kinder-jugendliche-und-familien/familienergaenzungsleistungen/',
  GE: 'https://www.ge.ch/demander-prestations-complementaires-familiales',
};

// Je Kanton: Gesetz, Fassung, Altersgrenze und Erwerbs-Bedingung — so wie gelesen, mit der
// Stelle, an der es steht. Die Anzeige liest nur die Altersgrenze daraus, als Zahl in
// FAMILIEN_EL_KINDER_UNTER unten.
export const FAMILIEN_EL_GRUNDLAGE = {
  TI: {
    gesetz: 'Legge sugli assegni di famiglia (LAF) del 18 dicembre 2008; Legge sull’armonizzazione e il coordinamento delle prestazioni sociali (LAPS) del 5 giugno 2000',
    fassung: 'Informazioni periodiche valide dal 1° gennaio 2026 (ti.ch)',
    kinder: 'AFI: Kinder unter 15; API: bis Ende des Monats, in dem das letzte Kind die Schulpflicht beginnt',
    erwerb: 'nicht verlangt — «indipendentemente dallo statuto professionale»',
    gelesen: '2026-11-04, ti.ch (Seite der URL oben)',
  },
  VD: {
    gesetz: 'Loi sur les prestations complémentaires cantonales pour familles et les prestations cantonales de la rente-pont (LPCFam), BLV 850.053; Règlement RLPCFam, BLV 850.053.1',
    fassung: 'LPCFam Stand 1.1.2026, RLPCFam Stand 1.1.2023 (laut vd.ch)',
    kinder: 'unter 16 — «enfants âgés de moins de 16 ans»',
    erwerb: 'nicht ausdrücklich verlangt; Einkünfte reichen für die Ausgaben nicht',
    gelesen: '2026-11-04, vd.ch (Seite der URL oben), Gesetzestext selbst nicht gelesen',
  },
  SO: {
    gesetz: 'Sozialgesetz (SG) vom 31. Januar 2007, BGS 831.1, § 85bis ff.',
    fassung: 'Stand 1. September 2026',
    kinder: 'unter 6 — § 85bis Abs. 1 lit. b',
    erwerb: 'Mindest-Bruttoeinkommen (7 500 / 15 000 / 30 000 Franken je nach Familie) — § 85bis Abs. 1 lit. c',
    gelesen: '2026-11-04, Volltext so.lexwork.naz.ch/de/dta/831-1.pdf',
  },
  GE: {
    gesetz: 'Loi sur les prestations complémentaires cantonales (LPCC) du 25 octobre 1968, rsGE J 4 25, art. 36A',
    fassung: 'letzte Änderung 29.8.2023; Art. 36A zuletzt geändert 2020',
    kinder: 'unter 18, in Ausbildung unter 25 — art. 36A al. 1 let. b',
    erwerb: 'unselbständige Erwerbstätigkeit, mind. 40 % (eine erwachsene Person) bzw. 90 % (zwei) — art. 36A al. 1 let. c, al. 4',
    gelesen: '2026-11-04, silgeneve.ch/legis/data/rsg_j4_25.htm',
  },
};

// Liefert { has, url } für einen Kanton. Kanton ohne Familien-EL → has:false (Eintrag
// wird in Lebenssituationen.jsx gar nicht gerendert).
export function getFamilienEL(canton) {
  const url = FAMILIEN_EL[(canton || '').trim()];
  return url ? { has: true, url } : { has: false, url: null };
}

// Altersgrenze je Kanton: Kinder «unter» dieser Zahl (aus FAMILIEN_EL_GRUNDLAGE.kinder, ein Test
// hält beides gleich). Getrennt gehalten, damit die Anzeige die langen Rechtstexte nicht ins
// Startbündel zieht. TI: AFI (unter 15) ist die weitere der zwei Leistungen. GE: 25, weil die
// App nicht weiss, ob ein Kind über 18 in Ausbildung ist — lieber zeigen als still ausschliessen.
export const FAMILIEN_EL_KINDER_UNTER = { TI: 15, VD: 16, SO: 6, GE: 25 };

// Alter eines Kindes, nur wenn es bekannt ist: aus dem Geburtsdatum, sonst aus einer
// eingetragenen Zahl über 0. «0» ohne Geburtsdatum ist der Vorgabewert eines neu angelegten
// Kindes (ChapterView) und heisst darum «unbekannt», nicht «Säugling».
function bekanntesAlter(kind, heute) {
  const bd = typeof kind?.birthDate === 'string' && /^\d{4}-\d{2}-\d{2}/.test(kind.birthDate) ? new Date(kind.birthDate.slice(0, 10)) : null;
  if (bd && !Number.isNaN(bd.getTime())) {
    let alter = heute.getFullYear() - bd.getFullYear();
    if (heute.getMonth() < bd.getMonth() || (heute.getMonth() === bd.getMonth() && heute.getDate() < bd.getDate())) alter--;
    return Math.max(0, alter);
  }
  const zahl = Number(kind?.age);
  return Number.isFinite(zahl) && zahl > 0 ? zahl : null;
}

// Passt die Familie zur Altersgrenze des Kantons? Nein nur dann, wenn JEDES Kind ein bekanntes
// Alter auf oder über der Grenze hat. Ein Kind mit unbekanntem Alter hält die Karte sichtbar
// (sozio-pruefer, Frage 6: niemand fällt still aus der Anzeige). Ohne Kinderliste: sichtbar.
export function familienELPasstZumKindesalter(canton, children, heute = new Date()) {
  const grenze = FAMILIEN_EL_KINDER_UNTER[(canton || '').trim()];
  if (!grenze || !Array.isArray(children) || children.length === 0) return true;
  return children.some((k) => {
    const alter = bekanntesAlter(k, heute);
    return alter === null || alter < grenze;
  });
}
