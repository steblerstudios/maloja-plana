// Offizielle Schweizer Antrags- und Informationslinks
// Nur verifizierte URLs von Bundesbehörden und ch.ch

export const DIREKTLINKS_VERSION = '2026-06';

export const DIREKTLINKS = [
  {
    id: 'praemienverbilligung',
    kategorie: 'gesundheit',
    name: { de: 'Prämienverbilligung', en: 'Premium subsidy', fr: 'Réduction de primes' },
    beschreibung: { de: 'Verbilligung der Krankenkassenprämie bei tiefem Einkommen', en: 'Health insurance premium reduction for low income', fr: 'Réduction de la prime d\'assurance maladie en cas de faible revenu' },
    url: 'https://www.ch.ch/de/gesundheit/krankenkasse/kosten-fur-krankenkasse/',
    urlBag: 'https://www.bag.admin.ch/de/krankenversicherung-praemienverbilligung',
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

export const CANTONAL_LINKS = {
  ZH: {
    steuererklaerung: 'https://www.zh.ch/de/steuern-finanzen/steuern.html',
    sozialdienst: 'https://www.zh.ch/de/soziales/sozialhilfe.html',
    ipv: 'https://www.zh.ch/de/gesundheit/praemienverbilligung_krankenversicherung.html',
  },
  BE: {
    steuererklaerung: 'https://www.taxme.ch/',
    sozialdienst: 'https://www.asv.dij.be.ch/de/start/themen/pv.html',
    ipv: 'https://www.asv.dij.be.ch/de/start/themen/pv.html',
  },
  LU: {
    steuererklaerung: 'https://steuern.lu.ch/',
    sozialdienst: 'https://disg.lu.ch/themen/sozialhilfe',
    ipv: 'https://www.lu.ch/verwaltung/GSD/Praemienverbilligung',
  },
  BS: {
    steuererklaerung: 'https://www.steuerverwaltung.bs.ch/',
    sozialdienst: 'https://www.sozialhilfe.bs.ch/',
    ipv: 'https://www.praemienverbilligung.bs.ch/',
  },
  GE: {
    steuererklaerung: 'https://ge.ch/tax/',
    sozialdienst: 'https://www.ge.ch/informations-generales-subside-assurance-maladie',
    ipv: 'https://www.ge.ch/demander-subside-assurance-maladie-2026',
  },
  VD: {
    steuererklaerung: 'https://www.vd.ch/themes/etat-droit-finances/impots/',
    sozialdienst: 'https://www.vd.ch/prestation/demander-des-subsides-a-lassurance-maladie',
    ipv: 'https://www.vd.ch/sante-soins-et-handicap/assurance-maladie/subside-a-lassurance-maladie',
  },
  AG: {
    steuererklaerung: 'https://www.ag.ch/de/verwaltung/dfr/steuern',
    sozialdienst: 'https://www.ag.ch/de/verwaltung/dgs/gesellschaft/soziales/sozialhilfe',
    ipv: 'https://www.ag.ch/de/verwaltung/dgs/gesellschaft/soziales/praemienverbilligung',
  },
  SG: {
    steuererklaerung: 'https://www.sg.ch/steuern-finanzen/steuern.html',
    sozialdienst: 'https://www.sg.ch/gesundheit-soziales/soziales/sozialhilfe.html',
    ipv: 'https://www.sg.ch/gesundheit-soziales/gesundheit/krankenversicherung0/praemienverbilligung.html',
  },
  TI: {
    steuererklaerung: 'https://www4.ti.ch/dfe/dc/dichiarazione/',
    sozialdienst: 'https://www4.ti.ch/dss/dasf/temi/sostegno-sociale/prestazioni-finanziarie-di-sostegno-sociale/prestazioni-assistenziali/calcolo-e-funzionamento-della-prestazione-assistenziale-ordinaria',
    ipv: 'https://www4.ti.ch/dss/ias/prestazioni-e-contributi/scheda/p/s/dettaglio/riduzione-dei-premi-dellassicurazione-malattia-ripam-1/riduzione-dei-premi-dellassicurazione-malattia-ripam',
  },
  ZG: {
    steuererklaerung: 'https://zg.ch/de/steuern-finanzen/steuern/natuerliche-personen/steuerabzuege',
    sozialdienst: 'https://zg.ch/de/gesundheit/krankenversicherung/praemienverbilligung',
    ipv: 'https://zg.ch/de/gesundheit/krankenversicherung/praemienverbilligung',
  },
  BL: {
    steuererklaerung: 'https://www.baselland.ch/politik-und-behorden/direktionen/finanz-und-kirchendirektion/steuerverwaltung',
    sozialdienst: 'https://www.baselland.ch/politik-und-behorden/direktionen/volkswirtschafts-und-gesundheitsdirektion/amt-fur-sozialbeitrage',
    ipv: 'https://www.baselland.ch/politik-und-behorden/direktionen/volkswirtschafts-und-gesundheitsdirektion/amt-fur-sozialbeitrage/praemienverbilligung',
  },
  SO: {
    steuererklaerung: 'https://so.ch/verwaltung/finanzdepartement/kantonales-steueramt/',
    sozialdienst: 'https://so.ch/verwaltung/departement-des-innern/amt-fuer-soziale-sicherheit/',
    ipv: 'https://so.ch/verwaltung/departement-des-innern/amt-fuer-soziale-sicherheit/praemienverbilligung/',
  },
  FR: {
    steuererklaerung: 'https://www.fr.ch/de/steuern',
    sozialdienst: 'https://www.fr.ch/de/gesundheit-und-soziales/sozialhilfe',
    ipv: 'https://www.fr.ch/de/gesundheit-und-soziales/praemienverbilligung',
  },
  TG: {
    steuererklaerung: 'https://steuerverwaltung.tg.ch/',
    sozialdienst: 'https://sozialamt.tg.ch/',
    ipv: 'https://gesundheitsamt.tg.ch/praemienverbilligung.html',
  },
  GR: {
    steuererklaerung: 'https://www.gr.ch/DE/institutionen/verwaltung/dfg/stv/Seiten/default.aspx',
    sozialdienst: 'https://www.gr.ch/DE/institutionen/verwaltung/djsg/sa/Seiten/default.aspx',
    ipv: 'https://www.gr.ch/DE/institutionen/verwaltung/djsg/ga/praemienverbilligung/Seiten/default.aspx',
  },
  SH: {
    steuererklaerung: 'https://sh.ch/CMS/Webseite/Kanton-Schaffhausen/Beh-rde/Verwaltung/Finanzdepartement/Steuerverwaltung-3854.html',
    sozialdienst: 'https://sh.ch/CMS/Webseite/Kanton-Schaffhausen/Beh-rde/Verwaltung/Departement-des-Innern/Sozialamt-7390907.html',
    ipv: 'https://sh.ch/CMS/Webseite/Kanton-Schaffhausen/Beh-rde/Verwaltung/Departement-des-Innern/Gesundheitsamt/Pr-mienverbilligung-7390913.html',
  },
  NE: {
    steuererklaerung: 'https://www.ne.ch/autorites/DFS/SCCO/Pages/accueil.aspx',
    sozialdienst: 'https://www.ne.ch/autorites/DEAS/SASO/Pages/accueil.aspx',
    ipv: 'https://www.ne.ch/autorites/DEAS/SASO/subsides-assurance-maladie/Pages/accueil.aspx',
  },
  VS: {
    steuererklaerung: 'https://www.vs.ch/de/web/scc',
    sozialdienst: 'https://www.vs.ch/de/web/sas',
    ipv: 'https://www.vs.ch/de/web/sas/praemienverbilligung',
  },
  JU: {
    steuererklaerung: 'https://www.jura.ch/DFI/CCO.html',
    sozialdienst: 'https://www.jura.ch/DAS/SAS.html',
    ipv: 'https://www.jura.ch/DAS/SSA/Subsides-a-l-assurance-maladie.html',
  },
  UR: {
    steuererklaerung: 'https://www.ur.ch/dienstleistungen/3040',
    sozialdienst: 'https://www.ur.ch/dienstleistungen/3002',
    ipv: 'https://www.ur.ch/dienstleistungen/2991',
  },
  SZ: {
    steuererklaerung: 'https://www.sz.ch/steuern.html',
    sozialdienst: 'https://www.sz.ch/soziales.html',
    ipv: 'https://www.sz.ch/gesundheit/krankenversicherung/praemienverbilligung.html',
  },
  OW: {
    steuererklaerung: 'https://www.ow.ch/de/verwaltung/finanzdepartement/steuerverwaltung/',
    sozialdienst: 'https://www.ow.ch/de/verwaltung/sicherheits-und-justizdepartement/sozialamt/',
    ipv: 'https://www.ow.ch/de/verwaltung/sicherheits-und-justizdepartement/sozialamt/praemienverbilligung/',
  },
  NW: {
    steuererklaerung: 'https://www.nw.ch/steueramt',
    sozialdienst: 'https://www.nw.ch/sozialamt',
    ipv: 'https://www.nw.ch/gesundheitsamt/praemienverbilligung',
  },
  GL: {
    steuererklaerung: 'https://www.gl.ch/verwaltung/finanzen-und-gesundheit/hauptabteilung-steuern.html',
    sozialdienst: 'https://www.gl.ch/verwaltung/bildung-und-kultur/hauptabteilung-soziales.html',
    ipv: 'https://www.gl.ch/verwaltung/finanzen-und-gesundheit/hauptabteilung-gesundheit/praemienverbilligung.html',
  },
  AR: {
    steuererklaerung: 'https://www.ar.ch/verwaltung/departement-finanzen/steuerverwaltung/',
    sozialdienst: 'https://www.ar.ch/verwaltung/departement-gesundheit-und-soziales/amt-fuer-soziales/',
    ipv: 'https://www.ar.ch/verwaltung/departement-gesundheit-und-soziales/amt-fuer-gesundheit/praemienverbilligung/',
  },
  AI: {
    steuererklaerung: 'https://www.ai.ch/themen/finanzen-und-steuern/steuern',
    sozialdienst: 'https://www.ai.ch/themen/soziales/sozialhilfe',
    ipv: 'https://www.ai.ch/themen/gesundheit/praemienverbilligung',
  },
};

export function getCantonalLinks(canton) {
  return CANTONAL_LINKS[canton] || null;
}

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
