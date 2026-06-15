// Offizielle Schweizer Antrags- und Informationslinks
// Nur verifizierte URLs von Bundesbehörden und ch.ch

export const DIREKTLINKS_VERSION = '2025-06';

export const DIREKTLINKS = [
  {
    id: 'praemienverbilligung',
    kategorie: 'gesundheit',
    name: { de: 'Prämienverbilligung', en: 'Premium subsidy', fr: 'Réduction de primes' },
    beschreibung: { de: 'Verbilligung der Krankenkassenprämie bei tiefem Einkommen', en: 'Health insurance premium reduction for low income', fr: 'Réduction de la prime d\'assurance maladie en cas de faible revenu' },
    url: 'https://www.ch.ch/de/gesundheit/krankenkasse/kosten-fur-krankenkasse/',
    urlBag: 'https://www.bag.admin.ch/bag/de/home/versicherungen/krankenversicherung/krankenversicherung-versicherte-mit-wohnsitz-in-der-schweiz/praemienverbilligung.html',
    antragsstelle: { de: 'Kantonale Behörde', en: 'Cantonal authority', fr: 'Autorité cantonale' },
  },
  {
    id: 'sozialhilfe',
    kategorie: 'soziales',
    name: { de: 'Sozialhilfe', en: 'Social assistance', fr: 'Aide sociale' },
    beschreibung: { de: 'Finanzielle Unterstützung bei Bedürftigkeit (SKOS-Richtlinien)', en: 'Financial support based on need (SKOS guidelines)', fr: 'Soutien financier en cas de besoin (normes CSIAS)' },
    url: 'https://www.ch.ch/de/soziale-sicherheit/sozialhilfe/',
    urlSkos: 'https://skos.ch/skos-richtlinien/aktuelle-richtlinien/',
    antragsstelle: { de: 'Gemeinde-Sozialdienst', en: 'Municipal social services', fr: 'Service social communal' },
  },
  {
    id: 'ahv',
    kategorie: 'vorsorge',
    name: { de: 'AHV-Rente', en: 'OASI pension', fr: 'Rente AVS' },
    beschreibung: { de: 'Altersrente der 1. Säule anmelden', en: 'Apply for 1st pillar old-age pension', fr: 'Demander la rente vieillesse du 1er pilier' },
    url: 'https://www.ahv-iv.ch/p/3.01.d',
    antragsstelle: { de: 'AHV-Ausgleichskasse', en: 'OASI compensation fund', fr: 'Caisse de compensation AVS' },
  },
  {
    id: 'ergaenzungsleistungen',
    kategorie: 'vorsorge',
    name: { de: 'Ergänzungsleistungen (EL)', en: 'Supplementary benefits', fr: 'Prestations complémentaires (PC)' },
    beschreibung: { de: 'Zusätzliche Leistungen wenn AHV/IV-Rente nicht reicht', en: 'Additional benefits when OASI/DI pension is insufficient', fr: 'Prestations supplémentaires si la rente AVS/AI ne suffit pas' },
    url: 'https://www.ahv-iv.ch/p/5.01.d',
    antragsstelle: { de: 'Kantonale AHV-Zweigstelle', en: 'Cantonal OASI branch', fr: 'Agence cantonale AVS' },
  },
  {
    id: 'arbeitslosigkeit',
    kategorie: 'arbeit',
    name: { de: 'Arbeitslosengeld', en: 'Unemployment benefits', fr: 'Indemnités de chômage' },
    beschreibung: { de: 'Arbeitslosenentschädigung bei Stellenverlust', en: 'Unemployment compensation upon job loss', fr: 'Indemnisation chômage en cas de perte d\'emploi' },
    url: 'https://www.arbeit.swiss/secoalv/de/home/menue/stellensuchende.html',
    antragsstelle: { de: 'RAV (Regionales Arbeitsvermittlungszentrum)', en: 'RAV (Regional employment centre)', fr: 'ORP (Office régional de placement)' },
  },
  {
    id: 'ueberbrueckungsleistungen',
    kategorie: 'arbeit',
    name: { de: 'Überbrückungsleistungen (ÜL)', en: 'Bridge benefits', fr: 'Prestations transitoires' },
    beschreibung: { de: 'Für ältere Arbeitslose ab 60 Jahren', en: 'For older unemployed persons from age 60', fr: 'Pour les chômeurs âgés dès 60 ans' },
    url: 'https://www.bsv.admin.ch/bsv/de/home/sozialversicherungen/uela.html',
    antragsstelle: { de: 'Kantonale AHV-Zweigstelle', en: 'Cantonal OASI branch', fr: 'Agence cantonale AVS' },
  },
  {
    id: 'familienzulagen',
    kategorie: 'familie',
    name: { de: 'Familienzulagen', en: 'Family allowances', fr: 'Allocations familiales' },
    beschreibung: { de: 'Kinder- und Ausbildungszulagen', en: 'Child and education allowances', fr: 'Allocations pour enfants et formation' },
    url: 'https://www.ahv-iv.ch/p/6.01.d',
    antragsstelle: { de: 'Familienausgleichskasse (via Arbeitgeber)', en: 'Family compensation fund (via employer)', fr: 'Caisse d\'allocations familiales (via employeur)' },
  },
  {
    id: 'mutterschaft',
    kategorie: 'familie',
    name: { de: 'Mutterschaftsentschädigung', en: 'Maternity compensation', fr: 'Allocation de maternité' },
    beschreibung: { de: '14 Wochen Erwerbsersatz nach Geburt', en: '14 weeks income compensation after birth', fr: '14 semaines d\'allocation après la naissance' },
    url: 'https://www.ahv-iv.ch/p/6.02.d',
    antragsstelle: { de: 'AHV-Ausgleichskasse (via Arbeitgeber)', en: 'OASI compensation fund (via employer)', fr: 'Caisse de compensation AVS (via employeur)' },
  },
  {
    id: 'vaterschaft',
    kategorie: 'familie',
    name: { de: 'Vaterschaftsentschädigung', en: 'Paternity compensation', fr: 'Allocation de paternité' },
    beschreibung: { de: '2 Wochen Erwerbsersatz nach Geburt', en: '2 weeks income compensation after birth', fr: '2 semaines d\'allocation après la naissance' },
    url: 'https://www.ahv-iv.ch/p/6.03.d',
    antragsstelle: { de: 'AHV-Ausgleichskasse (via Arbeitgeber)', en: 'OASI compensation fund (via employer)', fr: 'Caisse de compensation AVS (via employeur)' },
  },
  {
    id: 'patientenverfuegung',
    kategorie: 'vorsorge',
    name: { de: 'Patientenverfügung', en: 'Advance directive', fr: 'Directives anticipées' },
    beschreibung: { de: 'Medizinische Behandlungswünsche festlegen', en: 'Define medical treatment wishes', fr: 'Définir les souhaits de traitement médical' },
    url: 'https://www.ch.ch/de/gesundheit/patientenverfugung/',
    antragsstelle: { de: 'Selbst erstellen (handschriftlich oder Vorlage)', en: 'Self-created (handwritten or template)', fr: 'Rédiger soi-même (manuscrit ou modèle)' },
  },
  {
    id: 'testament',
    kategorie: 'recht',
    name: { de: 'Testament', en: 'Will', fr: 'Testament' },
    beschreibung: { de: 'Letztwillige Verfügung erstellen', en: 'Create a last will', fr: 'Rédiger un testament' },
    url: 'https://www.ch.ch/de/familie-und-partnerschaft/erbschaft/testament-und-erbvertrag/',
    antragsstelle: { de: 'Selbst erstellen oder Notar', en: 'Self-created or notary', fr: 'Rédiger soi-même ou notaire' },
  },
  {
    id: 'krankenkasse',
    kategorie: 'gesundheit',
    name: { de: 'Krankenkasse wechseln', en: 'Switch health insurer', fr: 'Changer de caisse maladie' },
    beschreibung: { de: 'Obligatorische Krankenversicherung kündigen und wechseln', en: 'Cancel and switch mandatory health insurance', fr: 'Résilier et changer d\'assurance maladie obligatoire' },
    url: 'https://www.ch.ch/de/gesundheit/krankenkasse/krankenkasse-abschliessen--wechseln-oder-kundigen/',
    urlPriminfo: 'https://www.priminfo.admin.ch/de/praemien',
    antragsstelle: { de: 'Neue Krankenkasse', en: 'New health insurer', fr: 'Nouvelle caisse maladie' },
  },
  {
    id: 'steuern',
    kategorie: 'finanzen',
    name: { de: 'Steuerrechner', en: 'Tax calculator', fr: 'Calculateur d\'impôts' },
    beschreibung: { de: 'Steuerbelastung berechnen (ESTV)', en: 'Calculate tax burden (FTA)', fr: 'Calculer la charge fiscale (AFC)' },
    url: 'https://swisstaxcalculator.estv.admin.ch/',
    antragsstelle: { de: 'Kantonales Steueramt', en: 'Cantonal tax office', fr: 'Administration fiscale cantonale' },
  },
  {
    id: 'organspende',
    kategorie: 'gesundheit',
    name: { de: 'Organspende', en: 'Organ donation', fr: 'Don d\'organes' },
    beschreibung: { de: 'Erklärung zur Organspende abgeben', en: 'Declare organ donation preference', fr: 'Déclarer sa volonté en matière de don d\'organes' },
    url: 'https://www.leben-ist-teilen.ch/',
    antragsstelle: { de: 'Organspende-Register', en: 'Organ donation register', fr: 'Registre de don d\'organes' },
  },
  {
    id: 'iv',
    kategorie: 'vorsorge',
    name: { de: 'Invalidenversicherung (IV)', en: 'Disability insurance (DI)', fr: 'Assurance-invalidité (AI)' },
    beschreibung: { de: 'Leistungen bei Invalidität', en: 'Benefits in case of disability', fr: 'Prestations en cas d\'invalidité' },
    url: 'https://www.ahv-iv.ch/p/4.01.d',
    antragsstelle: { de: 'Kantonale IV-Stelle', en: 'Cantonal DI office', fr: 'Office AI cantonal' },
  },
];

export const KATEGORIEN = {
  gesundheit: { de: 'Gesundheit', en: 'Health', fr: 'Santé', icon: 'health' },
  vorsorge: { de: 'Vorsorge & Recht', en: 'Planning & Law', fr: 'Prévoyance & Droit', icon: 'vorsorge' },
  soziales: { de: 'Soziale Sicherheit', en: 'Social security', fr: 'Sécurité sociale', icon: 'insurance' },
  arbeit: { de: 'Arbeit', en: 'Employment', fr: 'Travail', icon: 'budget' },
  familie: { de: 'Familie', en: 'Family', fr: 'Famille', icon: 'family' },
  finanzen: { de: 'Finanzen', en: 'Finances', fr: 'Finances', icon: 'budget' },
  recht: { de: 'Recht', en: 'Law', fr: 'Droit', icon: 'dokumentTresor' },
};

export function getLinksByKategorie(kategorie) {
  return DIREKTLINKS.filter(l => l.kategorie === kategorie);
}

export function getLinkById(id) {
  return DIREKTLINKS.find(l => l.id === id);
}

export function getAllKategorien() {
  const used = new Set(DIREKTLINKS.map(l => l.kategorie));
  return Object.entries(KATEGORIEN)
    .filter(([k]) => used.has(k))
    .map(([k, v]) => ({ id: k, ...v }));
}
