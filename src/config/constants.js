// ORDNUNG & RUHE — Data structure with i18n support
// CHAPTERS is now a function that takes t() and returns translated chapters
// Field values stored in localStorage remain language-independent (using option keys)

export const DARK_PALETTE = {
  bg: '#22211F', surface: '#2B2A26', up: '#343330', top: '#3D3B35',
  border: '#423F39', text: '#E6E3DC', mid: '#9CA0A6', soft: '#989CA4',
  // soft (Feintext-Tier) angehoben #8E929A→#989CA4: alt trug auf der häufigen
  // up-Karte (#343330, 184× als bg) nur 4.20:1 → unter AA. Neu 4.76 (up) / 5.22
  // (surface), bleibt aber unter mid (#9CA0A6) → mid/soft-Hierarchie erhalten.
  // top (#3D3B35) wird nie als bg genutzt (0×), daher kein Kontrast-Ziel.
  gold: '#C4A870', sage: '#7E9F8C', rose: '#B87070', sky: '#6E90B0', sand: '#C4A06A',
  onSand: '#2A2620', // dunkler Granit-Text auf Sand-Buttons (WCAG-AA; Sand ist in hell+dunkel gleich)
  // Dunkle, modus-invariante Button-Flächen für weissen Text — sage/rose sind als
  // Fläche zu hell für weissen 15px-Text. Weiss auf sageBtn 8.17:1 / roseBtn 6.65:1 (AA).
  sageBtn: '#3E5449', roseBtn: '#8A4A4A',
  // Legible-Varianten von sand/sky für Vordergrund (Text + bedeutungstragende Graphik):
  // sand besteht im Dunkeln (5.87 auf surface). sky #6E90B0 lag nur bei 4.30 (surface)
  // und fiel auf getönten Flächen (sky+'18') unter AA (3.44–3.78) → #8CAAC6 hält ≥4.75.
  sandDeep: '#C4A06A', skyDeep: '#8CAAC6',
  // roseDeep: lesbare Warnfarbe für Fliesstext/Fehler — rose (#B87070) liegt im
  // Dunkeln nur bei 3.82:1 auf surface. #D98A8A hebt auf 5.44:1 (AA), rose bleibt
  // für Ränder/Flächen/Diagramm-Füllungen (≥3:1) erhalten.
  roseDeep: '#D98A8A',
  // goldDeep: lesbare Gold-Variante für Text — gold (#C4A870) trägt im Dunkeln
  // bereits 6.28:1 auf surface, daher unverändert. Nur der Hellmodus braucht Tiefe.
  goldDeep: '#C4A870',
  sageMist: '#222C27', sageDew: '#28332D', sageDeep: '#8FB0A0'
};

export const LIGHT_PALETTE = {
  bg: '#F2F2F0', surface: '#FAFAF8', up: '#ECECEA', top: '#E4E4E2',
  // mid/soft: Sekundär-/Feintext. Alt-mid (#6A6E74) fiel auf getönten Flächen unter
  // AA: up 4.33 / sageMist 4.49 / top 4.03. Neue Werte halten ≥4.5:1 auf ALLEN Flächen
  // (surface/bg/up/sageMist/top) — mid #5E6167 ≥4.88, soft #5A5D63 ≥5.19. Bleibt ruhig-grau.
  border: '#DCDAD6', text: '#24262A', mid: '#5E6167', soft: '#5A5D63',
  gold: '#C4A870', sage: '#5A7868', rose: '#B87070', sky: '#6E90B0', sand: '#C4A06A',
  onSand: '#2A2620', // dunkler Granit-Text auf Sand-Buttons (WCAG-AA; Sand ist in hell+dunkel gleich)
  // Dunkle, modus-invariante Button-Flächen für weissen Text — sage/rose sind als
  // Fläche zu hell für weissen 15px-Text. Weiss auf sageBtn 8.17:1 / roseBtn 6.65:1 (AA).
  sageBtn: '#3E5449', roseBtn: '#8A4A4A',
  // Legible-Varianten von sand/sky für Vordergrund im Hellmodus: sand (2.34:1) und
  // sky (3.20:1) sind auf surface zu hell für Text. sandDeep alt (#8A6D3B) fiel auf
  // getönten Flächen unter AA (up 4.10 / top 3.81) → #7A5F30 hält ≥4.70 überall.
  // skyDeep 5.42:1 auf surface (≥4.45 auf allen Flächen).
  sandDeep: '#7A5F30', skyDeep: '#4A6A88',
  // roseDeep: lesbare Warnfarbe für Fliesstext/Fehler — rose (#B87070) liegt hell
  // nur bei 3.59:1 auf surface. #9A4A4A hebt auf 5.82:1 (AA), rose bleibt für
  // Ränder/Flächen/Diagramm-Füllungen (≥3:1) erhalten.
  roseDeep: '#9A4A4A',
  // goldDeep: lesbare Gold-Variante für Text — gold (#C4A870) liegt hell nur bei
  // 2.19:1 auf surface. #7C6428 hebt auf 5.42:1 (AA); gold bleibt für Akzente/Ringe.
  goldDeep: '#7C6428',
  sageMist: '#ECF1EE', sageDew: '#DBE6E0', sageDeep: '#4A6657'
};

// ── Farbenblind-Modus (opt-in) ──────────────────────────────────────────
// Das Rot-Grün-Problempaar der App ist sage (grün, positiv) vs. rose (rot,
// Warnung) — für die häufigste Farbenblindheit (Deuteran/Protan) ununter-
// scheidbar. Ist der Modus aktiv, tauschen wir dieses Paar gegen die sichere
// Blau/Orange-Achse (nach Okabe-Ito) und alle sage-Tönungen mit. Die Marken-
// Palette bleibt sonst unberührt (nur wenn eingeschaltet). Das Flag palette.colorBlind
// erlaubt Komponenten, Form-/Symbol-Marker zu ergänzen — Farbe nie allein.
const CB_LIGHT = {
  sage: '#1565A3', rose: '#C25A16', roseDeep: '#A84A12', sageDeep: '#2D5C86',
  sageMist: '#E7EEF5', sageDew: '#D4E2F0',
  // Button-Flächen auf die Blau/Orange-Achse (weiss 7.62:1 / 5.75:1):
  sageBtn: '#14568F', roseBtn: '#A84A12',
};
const CB_DARK = {
  sage: '#6BA6DE', rose: '#E38B4E', roseDeep: '#E38B4E', sageDeep: '#7FA8D0',
  sageMist: '#1E2833', sageDew: '#223140',
  sageBtn: '#14568F', roseBtn: '#A84A12',
};
export function applyColorBlind(palette, active) {
  if (!active) return palette;
  const isDark = palette.bg === DARK_PALETTE.bg;
  return { ...palette, ...(isDark ? CB_DARK : CB_LIGHT), colorBlind: true };
}

// Die Farbtafel aus dem Speicher — für Stellen, die kein `palette` von der App
// bekommen. Das ist genau eine: der Fehlerschirm (`ErrorBoundary`), der ausserhalb
// von AppInner hängt und dort ohne Props gerendert wird. Er zeigte bis 23.09.2026
// immer die dunklen Rückfallwerte, also einen dunklen Absturz-Schirm im Hellmodus.
//
// Dieselbe Quelle und Logik wie main.jsx (`or5_theme` als JSON, ohne Eintrag
// dunkel; `or5_colorblind` als '1') und wie `public/theme-init.js`. Dass es diese
// Funktion gibt, HÄLT die Gleichheit — vorher stand die Logik zweimal da, jetzt
// ist sie hier zentral und theme-init.js bleibt die eine unvermeidliche Kopie:
// das Script läuft im <head>, vor dem Bundle, und kann nichts importieren.
// `fehlerschirmFarben.test.js` prüft, dass alle drei Stellen denselben Schlüssel
// und denselben Default tragen.
export function paletteAusSpeicher(storage) {
  const laden = (key) => {
    try { return (storage || localStorage).getItem(key); } catch (e) { return null; }
  };
  let dunkel = true;
  try { dunkel = JSON.parse(laden('or5_theme') || 'true'); } catch (e) { dunkel = true; }
  return applyColorBlind(dunkel ? DARK_PALETTE : LIGHT_PALETTE, laden('or5_colorblind') === '1');
}

import { getCantonName, CANTON_CODES } from './cantonalData.js';
const cantonOptions = (t) => CANTON_CODES.map(c => ({ value: c, label: getCantonName(c, t) }));

// Helper: create select options from translation keys
// Returns [{value: 'key', label: 'Translated label'}]
function opts(t, chapterKey, fieldKey) {
  const fieldDef = t('chapters.' + chapterKey + '.fields.' + fieldKey);
  if (fieldDef && typeof fieldDef === 'object' && fieldDef.options) {
    return Object.entries(fieldDef.options).map(([value, label]) => ({ value, label }));
  }
  return [];
}

// Get translated field label
function fl(t, chapterKey, fieldKey) {
  const fieldDef = t('chapters.' + chapterKey + '.fields.' + fieldKey);
  if (typeof fieldDef === 'object' && fieldDef.label) return fieldDef.label;
  return typeof fieldDef === 'string' ? fieldDef : fieldKey;
}

// Get translated placeholder
function ph(t, chapterKey, fieldKey) {
  return t('chapters.' + chapterKey + '.placeholders.' + fieldKey);
}

// Get translated hint
function hn(t, chapterKey, fieldKey) {
  return t('chapters.' + chapterKey + '.hints.' + fieldKey);
}

// Get orientation sentence for a field (Helvetia layer)
function or(t, orientationKey) {
  const val = t('orientation.' + orientationKey);
  // Only return if it resolved (not the raw key)
  return val && val !== 'orientation.' + orientationKey ? val : '';
}

// Get section intro sentence (Section Voice layer)
function si(t, chapterKey, sectionKey) {
  const val = t('sectionIntros.' + chapterKey + '.' + sectionKey);
  return val && val !== 'sectionIntros.' + chapterKey + '.' + sectionKey ? val : '';
}

// Get contextual official link for a field
function lk(t, linkKey) {
  const val = t('contextLinks.' + linkKey);
  return val && typeof val === 'object' && val.url ? val : null;
}

// Get translated doc label
function dl(t, chapterKey, docKey) {
  return t('chapters.' + chapterKey + '.docs.' + docKey);
}

// ─── Ableitbare Angaben ergänzen (E36) ──────────────────────────────────────
// Die Tabelle unten nennt je Feld nur, was sich NICHT aus Kapitel- und
// Feld-Schlüssel ergibt. Alles andere folgt immer demselben Übersetzungs-
// Schlüssel und wird hier eingesetzt:
//
//   (immer)      label       = fl(t, kapitel, k)
//   sel: 1       options     = opts(t, kapitel, k)
//   sel: 'x'     options     = opts(t, kapitel, 'x')   — abweichender Schlüssel;
//                              sideIncomeType teilt die Liste von incomeType
//   hint: 1      hint        = hn(t, kapitel, k)
//   ph: 1        placeholder = ph(t, kapitel, k)
//   sec: 'x'     section     = t('sections.<kapitel>.x')  +  sectionIntro = si(…)
//   docs: ['id'] docs        = [{ k: 'id', label: dl(t, kapitel, 'id') }]
//
// Warum: dieselben Aufrufe standen 121-mal wörtlich in der Tabelle und trugen
// rund 12 kB Quelltext, ohne eine einzige Angabe zu tragen, die nicht schon im
// Feld-Schlüssel steht. Das Startbundle ist bei 65 kB gzip gedeckelt
// (`npm run size`); im September 2026 blieben davon 60 Byte Luft, worauf PR #294
// drei Verschlankungsrunden brauchte.
//
// 🛑 Die FORM des Ergebnisses ist unverändert — jede Aufrufstelle sieht dieselben
// Felder wie vorher, nur die Reihenfolge der Schlüssel im Objekt ist anders
// (label steht jetzt hinten). Das ist folgenlos, weil niemand über die Schlüssel
// einer Feld-DEFINITION iteriert; `Object.entries` in zipExport.js läuft über die
// erfassten Daten, nicht über diese Definitionen.
// Festgehalten in src/__tests__/kapitelAbdruck.test.js — Abdruck über alle fünf
// Sprachen, drei Mutationsproben (vertauschte Bezeichnung, verlorenes Merkmal,
// verschluckte Option) rot gesehen.
//
// Zum Nachmessen, was in der Startdatei liegt: scripts/bundle-posten.mjs
function kapitelFuellen(t, kapitel) {
  for (const ch of kapitel) {
    ch.title = t('chapters.' + ch.key + '.title');
    ch.short = t('chapters.' + ch.key + '.short');
    ch.description = t('chapters.' + ch.key + '.description');
    for (const f of ch.fields) {
      // Sonderbauten bringen ihre Beschriftung selbst mit (type 'household')
      if (f.type !== 'household') f.label = fl(t, ch.key, f.k);
      if (f.sel !== undefined) {
        f.options = opts(t, ch.key, f.sel === 1 ? f.k : f.sel);
        delete f.sel;
      }
      if (f.hint === 1) f.hint = hn(t, ch.key, f.k);
      if (f.ph === 1) {
        f.placeholder = ph(t, ch.key, f.k);
        delete f.ph;
      }
      if (f.sec !== undefined) {
        const abschnitt = f.sec;
        delete f.sec;
        f.section = t('sections.' + ch.key + '.' + abschnitt);
        f.sectionIntro = si(t, ch.key, abschnitt);
      }
    }
    if (ch.docs) ch.docs = ch.docs.map((k) => ({ k, label: dl(t, ch.key, k) }));
  }
  return kapitel;
}

// Feld-Merkmale (E17): `mvo` = zählt zur Grundordnung · `recommended` = empfohlen,
// zählt nicht zur Grundordnung · `naOk` = bietet den Schalter «trifft nicht zu» an
// (Markierung in `data[kapitel]._na`, siehe utils/vollstaendigkeit.js).
// K38: `naMit` = Felder, die beim Markieren mitgehen · `naVon` = hängt an einem anderen
// Feld und bleibt verdeckt, solange jenes markiert ist (siehe utils/naGruppen.js).
// K45: `required` zeigt nur den Stern — der Notfallkontakt trägt ihn nicht mehr (er ist
// markierbar); er zählt weiter zur Grundordnung wie `jobTitle`, «trifft nicht zu» erledigt ihn.
export function getChapters(t) {
  return kapitelFuellen(t, [
    {
      key: 'basis',
      fields: [
        { k: 'firstName', type: 'text', required: true, mvo: true, autoComplete: 'given-name', sec: 'person' },
        { k: 'middleName', type: 'text', autoComplete: 'additional-name' },
        { k: 'lastName', type: 'text', required: true, mvo: true, autoComplete: 'family-name' },
        { k: 'academicTitle', hint: 1, type: 'text', autoComplete: 'honorific-prefix' },
        { k: 'dateOfBirth', type: 'date', required: true, mvo: true, autoComplete: 'bday' },
        { k: 'gender', type: 'select', sel: 1 },
        { k: 'pronouns', type: 'select', sel: 1 },
        { k: 'nationality', type: 'select', sel: 1 },
        { k: 'canton', type: 'select', options: cantonOptions(t), mvo: true },
        { k: 'phone', type: 'tel', ph: 1, recommended: true, naOk: true, autoComplete: 'tel', sec: 'contact' },
        { k: 'email', type: 'email', recommended: true, naOk: true, autoComplete: 'email' },
        { k: 'ahv', type: 'text', ph: 1, hint: 1, orientation: or(t, 'ahv') },
        { k: 'maritalStatus', type: 'select', sel: 1, sec: 'family' },
        { k: 'household', type: 'household' },
      ],
      docs: [
        'id',
        'ahv_card',
      ]
    },
    {
      key: 'wohnen',
      fields: [
        { k: 'address', type: 'text', mvo: true, autoComplete: 'street-address', sec: 'address' },
        { k: 'postalCode', type: 'text', mvo: true, autoComplete: 'postal-code' },
        { k: 'city', type: 'text', mvo: true, autoComplete: 'address-level2' },
        { k: 'moveInDate', type: 'date' },
        { k: 'rentAmount', type: 'currency', sec: 'costs', orientation: or(t, 'miete') },
        { k: 'utilities', type: 'currency' },
        // Zimmerzahl: der Mietvergleich im Budget liest sie (sonst Schätzung aus der Haushaltsgrösse).
        { k: 'rooms', type: 'text' },
        { k: 'landlord', type: 'text', sec: 'landlord' },
        { k: 'landlordPhone', type: 'tel' },
        { k: 'mortgageStatus', type: 'select', sel: 1, sec: 'property', secondary: true },
        // Wohnkosten für Eigentümer:innen — das Budget liest den Betrag; ohne Feld blieb er immer 0.
        { k: 'mortgagePayment', type: 'currency', secondary: true },
        { k: 'propertyValue', type: 'currency', secondary: true },
        { k: 'buildingsInsurance', type: 'currency', secondary: true },
        { k: 'residenceType', type: 'select', sel: 1, secondary: true, orientation: or(t, 'wohnform') },
      ],
      docs: [
        'lease',
        'insurance',
        'deposit',
      ]
    },
    {
      key: 'finanzen',
      fields: [
        { k: 'monthlyIncome', type: 'currency', hint: 1, mvo: true, sec: 'income', orientation: or(t, 'einkommen') },
        { k: 'sideIncome', type: 'currency', hint: 1 },
        // Nebenerwerb-Anstellung: nur nötig, wenn daraus ein Brief werden soll. Die Stunden
        // sind Pflicht für jeden Lohn-Befund — ohne sie wird nicht gerechnet (kein 182h-Raten).
        { k: 'sideEmployer', type: 'text', hint: 1 },
        { k: 'sideEmployerAddress', type: 'textarea', hint: 1 },
        { k: 'sideHoursPerWeek', type: 'text', hint: 1 },
        // Spiegelt `incomeType` für den Nebenerwerb. Ohne dieses Feld wäre die Basis des
        // Nebenlohns unbekannt → nie ein Mindestlohn-Befund, und die Nutzerin hätte keinen
        // Weg, das zu ändern (Sackgasse). Der Mindestlohn ist ein BRUTTO-Stundenlohn.
        { k: 'sideIncomeType', type: 'select', sel: 'incomeType' },
        { k: 'taxableIncome', type: 'currency', hint: 1, secondary: true },
        { k: 'incomeType', type: 'select', sel: 1 },
        { k: 'dreizehnter', type: 'select', sel: 1 },
        { k: 'employer', type: 'text', recommended: true, naOk: true },
        { k: 'employerAddress', type: 'textarea', hint: 1, naOk: true },
        { k: 'employmentType', type: 'select', sel: 1 },
        { k: 'startDate', type: 'date', naOk: true },
        { k: 'familienzulagen', type: 'currency', hint: 1 },
        { k: 'alimenteReceived', type: 'currency', hint: 1, naOk: true },
        { k: 'monthlyTax', type: 'currency', hint: 1, sec: 'budgetLight', orientation: or(t, 'steuern') },
        { k: 'groceries', type: 'currency', itemized: true, hint: 1 },
        { k: 'communication', type: 'currency', itemized: true, hint: 1 },
        { k: 'mobility', type: 'currency', hint: 1 },
        { k: 'childcare', type: 'currency', hint: 1 },
        { k: 'otherInsurance', type: 'currency', hint: 1 },
        { k: 'debtPayments', type: 'currency', hint: 1, sec: 'obligations', orientation: or(t, 'schuldenraten') },
        { k: 'alimentePaid', type: 'currency', hint: 1, naOk: true },
        { k: 'savingsGoal', type: 'currency', sec: 'savings' },
        { k: 'savingsAccount', type: 'currency' },
        { k: 'bankName', type: 'text' },
        { k: 'securitiesValue', type: 'currency', hint: 1, sec: 'assets' },
        { k: 'otherAssets', type: 'currency', hint: 1 },
        { k: 'creditCard', type: 'select', sel: 1, sec: 'credit' },
        { k: 'creditCardLimit', type: 'currency', hint: 1 },
        { k: 'creditCardBalance', type: 'currency', hint: 1 },
        { k: 'loans', type: 'currency' },
        { k: 'pension3a', type: 'currency', sec: 'provision', secondary: true, orientation: or(t, 'saeule3a') },
        { k: 'pension3aBalance', type: 'currency', hint: 1, secondary: true },
        { k: 'pension3b', type: 'select', sel: 1, secondary: true, orientation: or(t, 'saeule3b') },
        { k: 'pension3bBalance', type: 'currency', hint: 1, secondary: true },
        { k: 'investmentFunds', type: 'select', sel: 1, secondary: true },
      ],
      docs: [
        'tax_return',
        'income_proof',
        'bank_statement',
      ]
    },
    {
      key: 'versicherungen',
      fields: [
        { k: 'kkInsurer', type: 'text', ph: 1, mvo: true, sec: 'basic', orientation: or(t, 'kvg'), link: lk(t, 'kkWechsel') },
        { k: 'kkModel', type: 'select', sel: 1 },
        { k: 'kkPremium', type: 'currency', mvo: true },
        { k: 'franchise', type: 'select', sel: 1, mvo: true, orientation: or(t, 'franchise') },
        { k: 'kkCardNumber', type: 'text' },
        { k: 'policyNumber', type: 'text', hint: 1 },
        { k: 'kkZusatz', type: 'text', ph: 1 },
        { k: 'bvgInsurer', type: 'text', sec: 'occupational', orientation: or(t, 'bvg') },
        { k: 'bvgContribution', type: 'currency', hint: 1 },
        { k: 'bvgBalance', type: 'currency', hint: 1 },
        { k: 'lifeInsurance', type: 'select', sel: 1 },
        { k: 'freizuegigkeit', type: 'text', ph: 1 },
        { k: 'uvg', type: 'select', sel: 1, sec: 'additional', orientation: or(t, 'uvg') },
        { k: 'ktg', type: 'select', sel: 1, hint: 1 },
        { k: 'liabilityInsurance', type: 'select', sel: 1 },
        { k: 'liabilityAmount', type: 'currency' },
        { k: 'legalInsurance', type: 'select', sel: 1 },
        { k: 'childInsurance', type: 'select', sel: 1 },
        { k: 'householdInsurance', type: 'select', sel: 1, sec: 'property', secondary: true },
        { k: 'householdInsuranceAmount', type: 'currency', secondary: true },
        { k: 'travelInsurance', type: 'select', sel: 1, secondary: true },
        { k: 'cyberInsurance', type: 'select', sel: 1, secondary: true },
        { k: 'autoInsurance', type: 'select', sel: 1, sec: 'mobility', secondary: true },
        { k: 'autoInsuranceAmount', type: 'currency', secondary: true },
        { k: 'ahvContribution', type: 'currency', sec: 'social', orientation: or(t, 'ahvBeitrag'), link: lk(t, 'ahv') },
      ],
      docs: [
        'kkcard',
        'bvg_cert',
        'ahv_confirmation',
        'household_policy',
        'auto_policy',
      ]
    },
    {
      key: 'ausbildung',
      fields: [
        { k: 'schoolName', type: 'text', sec: 'education' },
        { k: 'educationLevel', type: 'select', sel: 1 },
        { k: 'efzNumber', type: 'text' },
        { k: 'certifications', type: 'textarea' },
        { k: 'employer', type: 'text', naOk: true, sec: 'work' },
        // Kein `hint`: das Kapitel „Ausbildung & Arbeit" führt bewusst keine Hinweise.
        // Die Erklärung steht am gekoppelten Feld in Finanzen (Quer-Befüllung, main.jsx).
        { k: 'employerAddress', type: 'textarea', naOk: true },
        { k: 'jobTitle', type: 'text', mvo: true, naOk: true, orientation: or(t, 'beruf') },
        { k: 'employmentStart', type: 'date', naOk: true },
        { k: 'workPermit', type: 'select', sel: 1, orientation: or(t, 'bewilligung_b') },
        { k: 'workHoursPerWeek', type: 'text', naOk: true },
        { k: 'languages', type: 'textarea', sec: 'languages' },
      ],
      docs: [
        'diploma',
        'certificates',
        'cv_file',
      ]
    },
    {
      key: 'behoerden',
      fields: [
        { k: 'cantoneOfTaxation', type: 'select', options: cantonOptions(t), mvo: true, sec: 'taxes', orientation: or(t, 'steuerverwaltung') },
        { k: 'taxId', type: 'text' },
        { k: 'taxFilingDeadline', type: 'date' },
        { k: 'pendingTaxReturns', type: 'text' },
        { k: 'registryOffice', type: 'text', sec: 'legal', orientation: or(t, 'sozialdienst') },
        { k: 'betreibungsStatus', type: 'select', sel: 1, orientation: or(t, 'betreibung') },
        { k: 'courtCases', type: 'select', sel: 1 },
        { k: 'legalRepresentative', type: 'text', sec: 'representation' },
        { k: 'representativePhone', type: 'tel' },
        { k: 'willMade', type: 'select', sel: 1, orientation: or(t, 'testament'), link: lk(t, 'testament') },
      ],
      docs: [
        'betreibungsauszug',
        'will',
        'power_of_attorney',
        'patientenverfuegung',
      ]
    },
    {
      key: 'notfall',
      fields: [
        { k: 'emergencyContact', type: 'text', mvo: true, naOk: true, naMit: ['emergencyPhone'], sec: 'contact' },
        { k: 'emergencyPhone', type: 'tel', mvo: true, naVon: 'emergencyContact' },
        { k: 'bloodType', type: 'select', sel: 1, sec: 'medical' },
        { k: 'allergies', type: 'textarea' },
        { k: 'medications', type: 'textarea' },
        { k: 'chronicDiseases', type: 'textarea' },
        { k: 'doctor', type: 'text', sec: 'care' },
        { k: 'doctorPhone', type: 'tel' },
        { k: 'hospital', type: 'text' },
        { k: 'organDonor', type: 'select', sel: 1, sec: 'provision', secondary: true },
        { k: 'patientenverfuegung', type: 'select', sel: 1, hint: 1, orientation: or(t, 'patientenverfuegung'), link: lk(t, 'patientenverfuegung'), secondary: true },
        { k: 'vorsorgeauftrag', type: 'select', sel: 1, hint: 1, orientation: or(t, 'vorsorgeauftrag'), secondary: true },
        { k: 'bestattungswuensche', type: 'select', sel: 1, hint: 1, secondary: true },
      ],
      docs: [
        'advance_directive',
        'organ_card',
        'blood_card',
      ]
    },
  ]);
}

// Derive display name from firstName + lastName (backward-compat with legacy fullName)
export function getFullName(basisData) {
  if (!basisData) return '';
  // Akademischer/beruflicher Titel (Dr., MSc …) wird dem Namen vorangestellt,
  // sobald er erfasst ist — wirkt damit überall, wo der Name angezeigt wird.
  const title = (basisData.academicTitle || '').trim();
  const first = (basisData.firstName || '').trim();
  const middle = (basisData.middleName || '').trim();
  const last = (basisData.lastName || '').trim();
  if (first || middle || last) return [title, first, middle, last].filter(Boolean).join(' ');
  const fallback = (basisData.fullName || '').trim();
  return fallback ? [title, fallback].filter(Boolean).join(' ') : '';
}

// Keep CHAPTER_KEYS for data initialization (language-independent)
export const CHAPTER_KEYS = ['basis', 'wohnen', 'finanzen', 'versicherungen', 'ausbildung', 'behoerden', 'notfall'];

// Field keys per chapter (for data initialization — no translations needed).
// Wie das Geschwister CHAPTER_KEYS exportiert: sprachunabhängige Feldkarte, damit
// Daten-Init/-Validierung sie ohne getChapters(t) nutzen können.
export const FIELD_KEYS = {
  basis: ['firstName', 'middleName', 'lastName', 'academicTitle', 'dateOfBirth', 'gender', 'pronouns', 'nationality', 'canton', 'phone', 'email', 'ahv', 'maritalStatus'],
  wohnen: ['address', 'postalCode', 'city', 'moveInDate', 'rentAmount', 'utilities', 'rooms', 'landlord', 'landlordPhone', 'mortgageStatus', 'mortgagePayment', 'propertyValue', 'buildingsInsurance', 'residenceType'],
  finanzen: ['monthlyIncome', 'incomeType', 'dreizehnter', 'employer', 'employmentType', 'startDate', 'familienzulagen', 'alimenteReceived', 'monthlyTax', 'groceries', 'communication', 'mobility', 'childcare', 'otherInsurance', 'debtPayments', 'alimentePaid', 'savingsGoal', 'savingsAccount', 'bankName', 'creditCard', 'creditCardLimit', 'creditCardBalance', 'loans', 'pension3a', 'pension3aBalance', 'pension3b', 'pension3bBalance', 'investmentFunds'],
  versicherungen: ['kkInsurer', 'kkModel', 'kkPremium', 'franchise', 'kkCardNumber', 'policyNumber', 'kkZusatz', 'bvgInsurer', 'bvgContribution', 'bvgBalance', 'lifeInsurance', 'freizuegigkeit', 'uvg', 'ktg', 'liabilityInsurance', 'liabilityAmount', 'legalInsurance', 'childInsurance', 'householdInsurance', 'householdInsuranceAmount', 'travelInsurance', 'cyberInsurance', 'autoInsurance', 'autoInsuranceAmount', 'ahvContribution'],
  ausbildung: ['schoolName', 'educationLevel', 'efzNumber', 'certifications', 'employer', 'jobTitle', 'employmentStart', 'workPermit', 'workHoursPerWeek', 'languages'],
  behoerden: ['cantoneOfTaxation', 'taxId', 'taxFilingDeadline', 'pendingTaxReturns', 'registryOffice', 'betreibungsStatus', 'courtCases', 'legalRepresentative', 'representativePhone', 'willMade'],
  notfall: ['emergencyContact', 'emergencyPhone', 'bloodType', 'allergies', 'medications', 'chronicDiseases', 'doctor', 'doctorPhone', 'hospital', 'organDonor', 'patientenverfuegung', 'vorsorgeauftrag', 'bestattungswuensche'],
};

