// KVG-Leistungskatalog, Franchise/Selbstbehalt, Taxpunktwerte
// Quellen: BAG KVG Art. 25–31, KLV, TARDOC/Tarmed, santésuisse
export const KVG_DATA_VERSION = '2026-06';

// Franchise-Stufen (KVG Art. 64)
export const FRANCHISE_STUFEN = [300, 500, 1000, 1500, 2000, 2500];
export const FRANCHISE_KINDER = [0, 100, 200, 300, 400, 500, 600];
export const SELBSTBEHALT_RATE = 0.10;
export const SELBSTBEHALT_MAX = 700;
export const SELBSTBEHALT_MAX_KINDER = 350;

// selbstbehaltMax (optional): Kinder haben CHF 350 statt 700 (SELBSTBEHALT_MAX_KINDER).
// franchise 0 (Kinder ohne Franchise) ist gültig — daher kein `|| 300` (würde 0 zu 300
// machen); nur fehlende/ungültige Werte fallen auf 300 zurück.
export function berechneFranchise(franchise, kosten, selbstbehaltMax = SELBSTBEHALT_MAX) {
  const n = Number(franchise);
  const fr = Number.isFinite(n) ? n : 300;
  const k = Number(kosten) || 0;
  const sbMax = Number.isFinite(Number(selbstbehaltMax)) ? Number(selbstbehaltMax) : SELBSTBEHALT_MAX;
  const franchiseVerbraucht = Math.min(k, fr);
  const franchiseOffen = fr - franchiseVerbraucht;
  const kostenUeberFranchise = Math.max(0, k - fr);
  const selbstbehalt = Math.min(kostenUeberFranchise * SELBSTBEHALT_RATE, sbMax);
  const kasseZahlt = Math.max(0, k - franchiseVerbraucht - selbstbehalt);
  const eigenanteil = franchiseVerbraucht + selbstbehalt;
  return {
    franchise: fr,
    kosten: k,
    franchiseVerbraucht,
    franchiseOffen,
    selbstbehalt,
    selbstbehaltMax: sbMax,
    kasseZahlt,
    eigenanteil,
    selbstbehaltAusgeschoepft: selbstbehalt >= sbMax,
  };
}

// Taxpunktwert (TPW) pro Kanton in CHF, für freipraktizierende Ärztinnen und Ärzte.
// Seit 1.1.2026 gilt TARDOC + ambulante Pauschalen; die TARMED-Taxpunktwerte sind per
// 31.12.2025 «ausnahmslos dahingefallen» (RRB ZH 1299/2025, Ziff. A). Der Bundesrat empfahl,
// die kantonalen TPW 2026 auf dem Stand 2025 zu belassen; die Kantone setzen sie meist
// provisorisch fest, oft je Leistungserbringer und Versicherergruppe verschieden.
// Amtlich geprüft, abgerufen 15.09.2026:
//   ZH 0.91 — RRB ZH Nr. 1299/2025 vom 10.12.2025, Dispositiv I.1 (provisorisch ab 1.1.2026,
//             freipraktizierende Ärzte ↔ HSK, tarifsuisse, CSS)
//             https://www.zh.ch/bin/zhweb/publish/regierungsratsbeschluss-unterlagen./2025/1299/RRB-2025-1299.pdf
//   BE 0.86 — GSI BE, Verfügung 2025.GSI.2252 vom 22.01.2026: für die BEKAG am 9.12.2025
//             provisorisch 0.86 verfügt; Dispositiv 3.6 (übrige Leistungserbringer) 0.86
//             https://www.gsi.be.ch/content/dam/gsi/dokumente-bilder/de/themen/gesundheit/gesundheitsversorger/verfuegung-prov-tpw-tardoc-2026-de.pdf
//   BS 0.91 — Regierungsrat BS, Bulletin 10.02.2026: bisheriger TARMED-TPW 0.91 als provisorischer Tarif
//             https://www.bs.ch/medienmitteilungen/2026-kurzmitteilungen-aus-der-regierungsrats-sitzung-bulletin-2
//
// K22, abgerufen 16.09.2026 — behördliche Quelle (Festsetzung oder amtliche Publikation):
//   LU 0.85 — RRB des Regierungsrats des Kantons Luzern Nr. 1487/2025 vom 16.12.2025, Ziff. 1:
//             «für die Vergütung der ambulanten ärztlichen Leistungen nach KVG der frei
//             praktizierenden oder in einer ambulanten Einrichtung tätigen Ärztinnen und Ärzte
//             des Kantons Luzern durch die tarifsuisse ag vertretenen Krankenversicherer ein
//             provisorischer Tardoc-Taxpunktwert von Fr. 0.85». Wörtlich wiedergegeben im
//             Urteil des Bundesverwaltungsgerichts C-437/2026 vom 12.03.2026 (auf die
//             Beschwerde der Versicherer wurde nicht eingetreten, der RRB bleibt in Kraft).
//             https://entscheidsuche.ch/docs/CH_BVGer/CH_BVGE_001_C-437-2026_2026-03-12.pdf
//   SG 0.86 — Kanton St. Gallen, Gesundheitsdepartement, «OKP-Tarife Ambulant ärztliche
//             Leistungen 2019-2028», Stand 1.9.2026, Zeile «Freipraktizierende Ärztinnen und
//             Ärzte», Spalte 2026: CSS 0.86 · HSK 0.86 · santéservices 0.86 (vormals tarifsuisse)
//             https://www.sg.ch/gesundheit-soziales/gesundheit/gesundheitsversorgung--spitaeler/tarife/_jcr_content/Par/sgch_accordion_list/AccordionListPar/sgch_accordion/AccordionPar/sgch_downloadlist/DownloadListPar/sgch_download_288047036.ocFile/Homepage%20OKP-Tariflisten%20ambulant%20aerztliche%20Leistungen%202019-2028%20(1).pdf
//   UR 0.88 — Kanton Uri, Medienmitteilung des Regierungsrats vom 23.12.2025 «Kanton Uri setzt
//             neuen Arbeitstarif für ambulante ärztliche Leistungen fest»: «Ab dem 1. Januar
//             gilt im Kanton Uri für ambulante ärztliche Leistungen ein neuer Arbeitstarif von
//             0.88 Franken pro Taxpunkt» — provisorisch bis zum definitiven Tarif
//             https://www.ur.ch/mmregierungsrat/132029
//             Zugrunde liegt RRB Nr. 2025-768 R-721-13 vom 16.12.2025 (Arbeitstarif Fr. 0.88
//             praxisambulant, im Verhältnis zur Einkaufsgemeinschaft HSK AG), wiedergegeben im
//             Urteil BVGer C-409/2026 vom 12.03.2026 (Nichteintreten)
//             https://entscheidsuche.ch/docs/CH_BVGer/CH_BVGE_001_C-409-2026_2026-03-12.pdf
//   ZG 0.82 — Gesundheitsdirektion Kanton Zug, «Ambulante Tarife 2026 Kanton Zug», Stand
//             13.1.2026, Ziff. 2 «Freie Praxis», Ärzte-Gesellschaft des Kantons Zug (AGZG):
//             prov. 0.82 für tarifsuisse ag, HSK AG und CSS AG. Die Übersicht nennt sich selbst
//             nicht rechtsverbindlich; massgebend bleiben Verträge und Beschlüsse
//             https://cdn.zg.ch/dam/jcr:faa702d4-e5ed-41ab-a2c2-343c249c3798/Ambulante%20Tarife%202026%20(Stand%2013.%20Januar%202026).pdf
//   AR 0.86 — Beschluss des Regierungsrates Appenzell Ausserrhoden vom 12.01.2026, Ziff. 5
//             (publiziert 16.01.2026, Publ.-Nr. RS-AR20-0000000610): «für alle ambulanten
//             Leistungen, welche in einer Arztpraxis erbracht werden (freiberufliche Ärztinnen
//             und Ärzte) … als vorsorgliche Tarife, gültig ab 1. Januar 2026, festgesetzt:
//             tarifsuisse ag Fr. 0.86 · Einkaufsgemeinschaft HSK AG Fr. 0.86 · CSS Fr. 0.86»
//             https://amtsblattportal.ch/api/v1/publications/261ae13b-1a69-475a-bac6-f40c18f7e696/attachments/36e30134-6bd5-4601-a192-c0a62e3ec610
//   FR 0.91 — Conseil d'État FR, «Ordonnance fixant le tarif provisoire TARDOC et forfaits
//             ambulatoires» vom 13.01.2026, RSF 842.1.24, Art. 2: «La valeur provisoire du point
//             tarifaire TARDOC et forfaits ambulatoires est de Fr. 0.91 pour les médecins selon
//             l'article 35 al. 2 let. a LAMal». Gilt für alle Versicherer; spitalambulant 0.90
//             https://bdlf.fr.ch/app/fr/texts_of_law/842.1.24
//   GE 0.94 — Conseil d'État GE, «Communiqué hebdomadaire du Conseil d'État du 24 juin 2026»,
//             S. 7: «Le Conseil d'Etat a adopté un arrêté fixant à 0,94 francs la valeur de point
//             TARDOC provisoire applicable en 2026 … de CSS Assurance-maladie SA. Cette décision
//             concerne … l'association des médecins du canton de Genève.»
//             ⚠️ Belegt ist damit NUR der Wert für die CSS. Für santéservices und HSK wurde für
//             2026 kein Wert gefunden (der Conseil d'État genehmigte am 01.04.2026 zwei
//             Konventionen ohne Zahlenangabe). Der bisherige App-Wert 0.96 war der Genfer
//             TARMED-Wert; TARMED ist per 31.12.2025 dahingefallen, deshalb der belegte
//             TARDOC-Wert statt des abgelaufenen
//             https://www.ge.ch/document/communique-hebdomadaire-du-conseil-etat-du-24-juin-2026
//   GR 0.86 — Gesundheitsamt Graubünden, «TARDOC-Taxpunktwerte 2026», Stand 07.09.2026, Zeile
//             «Bündner Ärzteverein»: 0.86 bei santéservices ag, CSS und HSK. Legende:
//             provisorisch geltend bzw. Genehmigungsverfahren hängig
//             https://www.gr.ch/DE/institutionen/verwaltung/djsg/ga/InstitutionenGesundeitswesens/Spitaeler/Dok%20Spitler/%c3%9cbersicht%20Taxpunktwerte%202017-2026%20%28Stand%2007.09.2026%29.pdf
//   TG 0.86 — Amt für Gesundheit Kanton Thurgau, «Tarifübersicht Tarife ambulant Kanton
//             Thurgau», Stand 19.08.2026, Zeile «Ärztegesellschaft Thurgau», Tarif 2026:
//             HSK 0.86 · CSS 0.86 · santéservices 0.86 (provisorisch festgelegt).
//             Wert unverändert, aber neu belegt
//             https://gesundheit.tg.ch/public/upload/assets/185106/Tarif%C3%BCbersicht%20Ambulante%20Tarife%20OKP%202020%20bis%202026.pdf
//   TI 0.93 — Consiglio di Stato TI, «Decreto esecutivo concernente il valore del punto tariffale
//             provvisionale applicabile dal 1° gennaio 2026 per le prestazioni ambulatoriali dei
//             medici liberi professionisti …» vom 11.02.2026, Art. 1: «è applicabile in via
//             provvisionale un valore del punto tariffale pari a 0.93 franchi per la retribuzione
//             delle prestazioni ambulatoriali dei medici liberi professionisti». Ein Wert für
//             alle Versicherer. Bollettino ufficiale delle leggi Nr. 6 vom 13.02.2026, S. 64–65
//             https://www3.ti.ch/CAN/fu/2026/BU_006.pdf
//   VD 0.94 — Conseil d'État VD, Sitzung vom 20.05.2026: «Le Conseil d'État a approuvé un arrêté
//             fixant de manière provisoire la valeur du point TARDOC entre santéservices SA et la
//             Société vaudoise de médecine dès le 1er janvier 2026 à 0.94 franc.» santéservices
//             SA ist die frühere tarifsuisse ag. Für HSK und CSS wurde für die Waadtländer
//             Praxisärzte kein Wert gefunden (die gleichentags festgesetzten 0.92 betreffen
//             HSK ↔ Vaud Cliniques, also Privatkliniken)
//             https://www.vd.ch/actualites/decisions-du-conseil-detat/seance-du-conseil-detat/seance/1032981
//
// K22, abgerufen 16.09.2026 — Quelle: Tarifpartner, keine behördliche Festsetzung.
// Vereinigung Zentralschweizer Ärztegesellschaften (VZAG) / Ärztegesellschaft des Kantons
// Luzern, «Update Taxpunktwert Kanton Luzern» (die Seite trägt kein Publikationsdatum; sie
// nennt die Beschwerde gegen den Luzerner Beschluss als noch hängig, stammt also aus dem
// ersten Quartal 2026 — abgerufen 16.09.2026), Abschnitt «Zur Übersicht die aktuellen
// Taxpunktwerte ab 1. Januar … in der Region Zentralschweiz»; jeweils «provisorischer
// Arbeitstarif festgelegt durch» die jeweilige Kantonsregierung:
//   OW 0.86 · NW 0.88
//   SZ 0.85 — für tarifsuisse (heute santéservices). Für CSS und HSK gilt in SZ 0.86; die App
//             führt den Wert der grössten Einkaufsgemeinschaft, die für alle übrigen
//             Versicherer verhandelt. Der Wert 0.86 für die CSS ist zusätzlich behördlich
//             belegt: Verfügung Nr. 909/25 des Departements des Innern des Kantons Schwyz
//             vom 23.12.2025, Ziff. 1, wiedergegeben im Urteil BVGer C-718/2026 vom 15.04.2026
//             https://entscheidsuche.ch/docs/CH_BVGer/CH_BVGE_001_C-718-2026_2026-04-15.pdf
//   (LU 0.85 und UR 0.88 werden dort ebenfalls genannt, deckungsgleich mit RRB LU 1487/2025
//   und der Urner Medienmitteilung. Für LU hält die Seite fest, dass HSK und CSS die 0.85
//   nicht angefochten haben — der RRB selbst regelt nur das Verhältnis zu tarifsuisse.)
//   https://aerzte-zs.ch/luzern/news-events/news/596-update-taxpunktwert-luzern.html
//
// Neun Kantone bleiben UNGEPRÜFT — Stand 2025 (TARMED), keine Quelle 2026 gefunden:
//   AG, BL, SO — die Kantone publizieren nur stationäre Tarife; die Tarifinformation der
//                kantonalen Ärztegesellschaften liegt im Mitgliederbereich. Für SO sind im
//                RRB-Register zwar Beschlüsse zum TARDOC-Taxpunktwert verzeichnet, ihr Text
//                ist dort aber nicht abrufbar
//   AI, GL, SH — keine Festsetzung oder Publikation 2026 auffindbar. SH nennt auf seiner Seite
//                zur Tariffestsetzung für freipraktizierende Ärzte weiterhin den Stand 2019
//   JU, NE, VS — kein Arrêté und keine Tarifliste 2026 zu den freipraktizierenden Ärztinnen
//                und Ärzten gefunden; die publizierten Listen betreffen stationäre Tarife
// Ihre Werte stehen bewusst unverändert. Lieber ein alter, als Stand 2025 gekennzeichneter
// Wert als eine plausible Zahl ohne Beleg.
export const TAXPUNKTWERT = {
  AG: 0.89, AI: 0.89, AR: 0.86, BE: 0.86, BL: 0.89, BS: 0.91,
  FR: 0.91, GE: 0.94, GL: 0.87, GR: 0.86, JU: 0.88, LU: 0.85,
  NE: 0.92, NW: 0.88, OW: 0.86, SG: 0.86, SH: 0.87, SO: 0.89,
  SZ: 0.85, TG: 0.86, TI: 0.93, UR: 0.88, VD: 0.94, VS: 0.86,
  ZG: 0.82, ZH: 0.91,
};

// K27 (Bauliste §10, E29): der Taxpunktwert-Block bekommt einen eigenen Datenstand statt
// nur der einen KVG_DATA_VERSION für den ganzen Datensatz — sonst datiert eine Zahl den
// ganzen Katalog mit. Stand = letzte Prüfrunde der Taxpunktwerte oben (K22, 16.09.2026).
export const TAXPUNKTWERT_DATA_VERSION = '2026-09-16';

// K26/K30 (Bauliste §9/§10, E28): die neun Kantone ohne belegten Wert 2026 — Stand 2025
// (TARMED), siehe Kommentar oben "Neun Kantone bleiben UNGEPRÜFT". Für die Fussnote
// kvg.tpwNote, damit sie die Kantone nennt statt nur allgemein zu warnen. Seit R4 (16.09.2026)
// füllt die App den Platzhalter {kantone} in kvg.tpwNote aus dieser Liste und zeigt je
// gewähltem Kanton «Stand 2025, provisorisch» (kvg.tpwStandUnbelegt).
export const TAXPUNKTWERT_UNBELEGT_2026 = ['AG', 'BL', 'SO', 'AI', 'GL', 'SH', 'JU', 'NE', 'VS'];

// E41 (Entscheid 17.09.2026): die Quelle je Kanton als Daten, damit die App sie verlinken kann.
// Nur die URLs aus dem Kommentar oben — je Kanton die Quelle, die den geführten Wert trägt:
//   art 'behoerde'     = Festsetzung oder amtliche Publikation (bei LU der wörtlich wiedergegebene
//                        RRB im BVGer-Urteil; bei UR die Medienmitteilung des Regierungsrats)
//   art 'tarifpartner' = Übersicht der Ärztegesellschaften (OW, NW; SZ 0.85 für santéservices —
//                        das BVGer-Urteil C-718/2026 belegt dort nur den CSS-Wert 0.86)
// Die neun Kantone aus TAXPUNKTWERT_UNBELEGT_2026 haben bewusst keinen Eintrag.
const VZAG_LU = 'https://aerzte-zs.ch/luzern/news-events/news/596-update-taxpunktwert-luzern.html';
export const TAXPUNKTWERT_QUELLEN = {
  AR: { art: 'behoerde', url: 'https://amtsblattportal.ch/api/v1/publications/261ae13b-1a69-475a-bac6-f40c18f7e696/attachments/36e30134-6bd5-4601-a192-c0a62e3ec610' },
  BE: { art: 'behoerde', url: 'https://www.gsi.be.ch/content/dam/gsi/dokumente-bilder/de/themen/gesundheit/gesundheitsversorger/verfuegung-prov-tpw-tardoc-2026-de.pdf' },
  BS: { art: 'behoerde', url: 'https://www.bs.ch/medienmitteilungen/2026-kurzmitteilungen-aus-der-regierungsrats-sitzung-bulletin-2' },
  FR: { art: 'behoerde', url: 'https://bdlf.fr.ch/app/fr/texts_of_law/842.1.24' },
  GE: { art: 'behoerde', url: 'https://www.ge.ch/document/communique-hebdomadaire-du-conseil-etat-du-24-juin-2026' },
  GR: { art: 'behoerde', url: 'https://www.gr.ch/DE/institutionen/verwaltung/djsg/ga/InstitutionenGesundeitswesens/Spitaeler/Dok%20Spitler/%c3%9cbersicht%20Taxpunktwerte%202017-2026%20%28Stand%2007.09.2026%29.pdf' },
  LU: { art: 'behoerde', url: 'https://entscheidsuche.ch/docs/CH_BVGer/CH_BVGE_001_C-437-2026_2026-03-12.pdf' },
  NW: { art: 'tarifpartner', url: VZAG_LU },
  OW: { art: 'tarifpartner', url: VZAG_LU },
  SG: { art: 'behoerde', url: 'https://www.sg.ch/gesundheit-soziales/gesundheit/gesundheitsversorgung--spitaeler/tarife/_jcr_content/Par/sgch_accordion_list/AccordionListPar/sgch_accordion/AccordionPar/sgch_downloadlist/DownloadListPar/sgch_download_288047036.ocFile/Homepage%20OKP-Tariflisten%20ambulant%20aerztliche%20Leistungen%202019-2028%20(1).pdf' },
  // K92: in SZ gilt 0.85 nur für tarifsuisse (heute santéservices), für CSS und HSK 0.86 — Zusatz im Linktext.
  SZ: { art: 'tarifpartner', url: VZAG_LU, zusatz: 'SZ' },
  TG: { art: 'behoerde', url: 'https://gesundheit.tg.ch/public/upload/assets/185106/Tarif%C3%BCbersicht%20Ambulante%20Tarife%20OKP%202020%20bis%202026.pdf' },
  TI: { art: 'behoerde', url: 'https://www3.ti.ch/CAN/fu/2026/BU_006.pdf' },
  UR: { art: 'behoerde', url: 'https://www.ur.ch/mmregierungsrat/132029' },
  VD: { art: 'behoerde', url: 'https://www.vd.ch/actualites/decisions-du-conseil-detat/seance-du-conseil-detat/seance/1032981' },
  ZG: { art: 'behoerde', url: 'https://cdn.zg.ch/dam/jcr:faa702d4-e5ed-41ab-a2c2-343c249c3798/Ambulante%20Tarife%202026%20(Stand%2013.%20Januar%202026).pdf' },
  ZH: { art: 'behoerde', url: 'https://www.zh.ch/bin/zhweb/publish/regierungsratsbeschluss-unterlagen./2025/1299/RRB-2025-1299.pdf' },
};

export function berechneArztrechnung(taxpunkte, canton) {
  const tpw = TAXPUNKTWERT[canton] || 0.89;
  return {
    taxpunkte,
    taxpunktwert: tpw,
    betrag: Math.round(taxpunkte * tpw * 100) / 100,
    canton,
  };
}

// KVG-Leistungskatalog: was zahlt die Grundversicherung?
// Kategorien: covered (ja), limited (mit Bedingungen), excluded (nein)
// interval: Häufigkeit falls limitiert
export const KVG_KATALOG = [
  // ─── Arztbesuche ─────────────────────────────────────
  { key: 'hausarzt',       cat: 'arzt',    status: 'covered',  intervalKey: null },
  { key: 'spezialist',     cat: 'arzt',    status: 'covered',  intervalKey: null },
  { key: 'notfall',        cat: 'arzt',    status: 'covered',  intervalKey: null },
  { key: 'zweitmeinung',   cat: 'arzt',    status: 'covered',  intervalKey: null },

  // ─── Vorsorge & Screening ───────────────────────────
  { key: 'gynaeko',        cat: 'vorsorge', status: 'limited',  intervalKey: 'gynaeko3j' },
  { key: 'mammografie',    cat: 'vorsorge', status: 'limited',  intervalKey: 'mammografie2j' },
  { key: 'darmkrebs',      cat: 'vorsorge', status: 'limited',  intervalKey: 'darmkrebs10j' },
  { key: 'impfungen',      cat: 'vorsorge', status: 'covered',  intervalKey: 'impfBag' },
  { key: 'checkup',        cat: 'vorsorge', status: 'excluded', intervalKey: null },
  { key: 'augenarzt',      cat: 'vorsorge', status: 'excluded', intervalKey: null },

  // ─── Labor & Tests ──────────────────────────────────
  { key: 'bluttest',       cat: 'labor',   status: 'covered',  intervalKey: 'mitVerordnung' },
  { key: 'std',            cat: 'labor',   status: 'excluded', intervalKey: null },
  { key: 'schwangerschaft',cat: 'labor',   status: 'covered',  intervalKey: 'schwangerschaftFrei' },
  { key: 'genetik',        cat: 'labor',   status: 'limited',  intervalKey: 'mitVerordnung' },

  // ─── Medikamente ────────────────────────────────────
  { key: 'slMedi',         cat: 'medi',    status: 'covered',  intervalKey: null },
  { key: 'nichtSlMedi',    cat: 'medi',    status: 'excluded', intervalKey: null },
  { key: 'generika',       cat: 'medi',    status: 'covered',  intervalKey: 'generikaBonus' },

  // ─── Spital ─────────────────────────────────────────
  { key: 'spitalAllg',     cat: 'spital',  status: 'covered',  intervalKey: null },
  { key: 'spitalHalbpriv', cat: 'spital',  status: 'excluded', intervalKey: null },
  { key: 'ambulant',       cat: 'spital',  status: 'covered',  intervalKey: null },
  { key: 'reha',           cat: 'spital',  status: 'limited',  intervalKey: 'mitVerordnung' },

  // ─── Zähne ──────────────────────────────────────────
  { key: 'zahnarzt',       cat: 'dental',  status: 'excluded', intervalKey: null },
  { key: 'zahnUnfall',     cat: 'dental',  status: 'covered',  intervalKey: null },
  { key: 'kieferChirurgie',cat: 'dental',  status: 'limited',  intervalKey: 'mitVerordnung' },

  // ─── Therapien ──────────────────────────────────────
  { key: 'physio',         cat: 'therapie',status: 'covered',  intervalKey: 'physio9' },
  { key: 'ergo',           cat: 'therapie',status: 'covered',  intervalKey: 'mitVerordnung' },
  { key: 'psycho',         cat: 'therapie',status: 'covered',  intervalKey: 'psychoModell' },
  { key: 'chiropraktik',   cat: 'therapie',status: 'covered',  intervalKey: null },
  { key: 'akupunktur',     cat: 'therapie',status: 'limited',  intervalKey: 'mitVerordnung' },
  { key: 'homoeoDurch',    cat: 'therapie',status: 'limited',  intervalKey: 'aerztlich' },

  // ─── Hilfsmittel & Diverses ─────────────────────────
  { key: 'brille',         cat: 'divers',  status: 'limited',  intervalKey: 'brilleKinder' },
  { key: 'hoergeraet',     cat: 'divers',  status: 'limited',  intervalKey: 'mitVerordnung' },
  { key: 'transport',      cat: 'divers',  status: 'limited',  intervalKey: 'transport50' },
  { key: 'ausland',        cat: 'divers',  status: 'limited',  intervalKey: 'auslandNotfall' },
  { key: 'mutterschaft',   cat: 'divers',  status: 'covered',  intervalKey: 'mutterschaftFrei' },
  { key: 'spitex',         cat: 'divers',  status: 'covered',  intervalKey: null },
];

export const KVG_CATEGORIES = ['arzt', 'vorsorge', 'labor', 'medi', 'spital', 'dental', 'therapie', 'divers'];

// Belegbare internationale Vorsorge-Empfehlungen als ruhige Orientierung neben der
// KVG-Deckung (Faden 3-II). KEINE Angst-Differenz: bei diesen Screenings deckt die
// Grundversicherung den empfohlenen Rhythmus — beim Zervix-Screening empfiehlt die WHO
// sogar längere Intervalle als die Schweizer Praxis (entkräftet den „Pap-Mythos").
// Konsistente Referenz-Anker: KVG (Deckung, oben) + WHO + EU — aber EHRLICH pro Screening,
// nur Anker zeigen, die belegbar existieren. Darmkrebs: die WHO hat KEIN eigenes Screening-
// Intervall (who:false) → nicht erfinden, nur EU. Texte liegen in i18n
// (kvg.<key>Who / <key>Eu / <key>Synthese / <key>Quelle).
// Quellen: WHO-Leitlinie 2021 (Zervix), WHO/ECIBC (Mammografie), Europäischer Kodex gegen Krebs 5. Aufl.
export const VORSORGE_EMPFEHLUNGEN = {
  gynaeko:     { who: true,  eu: true },
  mammografie: { who: true,  eu: true },
  darmkrebs:   { who: false, eu: true },
};

// Belegbare „Was genau gedeckt ist"-Details für Einträge, deren Note zu knapp ist
// (Faden 3-II). Wert = Anzahl Detail-Zeilen in i18n (kvg.<key>Detail1..N + <key>DetailQuelle).
// Gleiche einklappbare Mechanik wie die WHO/EU-Empfehlung, ruhige Grunddichte.
// Quellen: KVG/KLV Art. 13–14 (Schwangerschaft), Schweizerischer Impfplan (Impfungen).
export const KVG_DETAILS = {
  schwangerschaft: 3,
  impfungen: 3,
  transport: 3,
  ausland: 3,
};

// Kantone OHNE organisiertes Brustkrebs-Früherkennungsprogramm (Faden 3-II/3).
// „Organisiert" = der Kanton lädt Frauen 50–74 per Brief ein; im Programm übernimmt die
// Grundversicherung die Kosten OHNE Franchise, es bleibt nur der Selbstbehalt von 10 %
// (KVG Art. 64 Abs. 6). Wo es fehlt, organisiert man die Vorsorge selbst (opportunistisch,
// nach ärztlicher Überweisung) — dann wird die Franchise erhoben.
// Stand 07.2026 nach Swiss Cancer Screening (nationale Dachorganisation): 18 Kantone MIT
// Programm (inkl. LU), 8 OHNE (Liste unten). Ändert sich laufend → Live-Link im UI-Text.
// Quelle: swisscancerscreening.ch (Angebote nach Kanton).
export const MAMMO_KANTONE_OHNE_PROGRAMM = ['ZH', 'ZG', 'SZ', 'UR', 'OW', 'NW', 'GL', 'SH'];
export const MAMMO_GEO_STAND = '07.2026';
export const MAMMO_GEO_URL = 'https://www.swisscancerscreening.ch/de/angebote-in-ihrem-kanton';

// Empfohlenes Intervall in Monaten für den opt-in persönlichen Abgleich (Faden 3-II/2).
// = KVG-gedeckter / CH-klinischer Rhythmus (konkret + belegbar). Der „liegt länger
// zurück"-Hinweis ist nie aggressiver als dieser Wert (dignity-first; der WHO/EU-Kontext
// — z. T. längere Intervalle — steht weiter oben im Empfehlungsblock).
export const VORSORGE_INTERVAL_MONATE = {
  gynaeko: 36,
  mammografie: 24,
  darmkrebs: 120,
};
