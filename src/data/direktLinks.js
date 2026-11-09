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
    url: 'https://skos.ch/themen/sozialhilfe',
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
    id: 'prosenectute',
    kategorie: 'vorsorge',
    name: { de: 'Pro Senectute', en: 'Pro Senectute', fr: 'Pro Senectute' },
    beschreibung: { de: 'Kostenlose Sozialberatung und finanzielle Unterstützung im AHV-Alter', en: 'Free social counselling and financial support in retirement age', fr: 'Conseil social gratuit et soutien financier à l’âge AVS' },
    url: 'https://www.prosenectute.ch/',
    antragsstelle: { de: 'Pro Senectute (kantonale Beratungsstelle)', en: 'Pro Senectute (cantonal advice centre)', fr: 'Pro Senectute (antenne cantonale)' },
  },
  {
    id: 'arbeitslosigkeit',
    kategorie: 'arbeit',
    name: { de: 'Arbeitslosenentschädigung', en: 'Unemployment benefits', fr: 'Indemnités de chômage' },
    beschreibung: { de: 'Arbeitslosenentschädigung bei Stellenverlust', en: 'Unemployment compensation upon job loss', fr: 'Indemnisation chômage en cas de perte d\'emploi' },
    url: 'https://www.arbeit.swiss/de/stellensuchende',
    antragsstelle: { de: 'RAV (Regionales Arbeitsvermittlungszentrum)', en: 'RAV (Regional employment centre)', fr: 'ORP (Office régional de placement)' },
  },
  {
    id: 'ueberbrueckungsleistungen',
    kategorie: 'arbeit',
    name: { de: 'Überbrückungsleistungen (ÜL)', en: 'Bridge benefits', fr: 'Prestations transitoires' },
    beschreibung: { de: 'Für ältere Arbeitslose ab 60 Jahren', en: 'For older unemployed persons from age 60', fr: 'Pour les chômeurs âgés dès 60 ans' },
    url: 'https://www.bsv.admin.ch/bsv/de/home/sozialversicherungen/uela.html',
    // ÜLG Art. 19: zuständig sind die EL-Stellen des Wohnkantons (ELG Art. 21 Abs. 2),
    // nicht die AHV-Zweigstelle (Fachprüfung 24.09.2026).
    antragsstelle: { de: 'EL-Stelle des Wohnkantons', en: 'Supplementary-benefits office of your canton', fr: 'Organe PC du canton de domicile' },
  },
  {
    id: 'familienzulagen',
    kategorie: 'familie',
    name: { de: 'Familienzulagen', en: 'Family allowances', fr: 'Allocations familiales' },
    beschreibung: { de: 'Kinder- und Ausbildungszulagen', en: 'Child and education allowances', fr: 'Allocations pour enfants et formation' },
    // Merkblatt 6.08 «Familienzulagen» (Stand 1.1.2025, geprüft 21.10.2026); vorher 6.01 = EO für Dienstleistende.
    url: 'https://www.ahv-iv.ch/p/6.08.d',
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
    // Merkblatt 6.04 «Entschädigung des andern Elternteils EAE» (Stand 1.1.2024, geprüft 21.10.2026); vorher 6.03 = Corona-Erwerbsersatz.
    url: 'https://www.ahv-iv.ch/p/6.04.d',
    antragsstelle: { de: 'AHV-Ausgleichskasse (via Arbeitgeber)', en: 'OASI compensation fund (via employer)', fr: 'Caisse de compensation AVS (via employeur)' },
  },
  {
    id: 'patientenverfuegung',
    kategorie: 'vorsorge',
    name: { de: 'Patientenverfügung', en: 'Patient decree', fr: 'Directives anticipées' },
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
  recht: { de: 'Recht', en: 'Law', fr: 'Droit', icon: 'legal' },
};

// Beratung & Hilfe: gemeinnützige Beratungs-Anlaufstellen (kostenlos/niederschwellig)
// — weder amtlicher Antrag noch persönliche Herzensempfehlung, darum eigenes Buch
// im Regal. Ohne antragsstelle. Stabile, breit vertraute Non-Profits; URLs bei
// Änderung prüfen. Kuratierbar.
export const BERATUNG_HILFE = [
  {
    id: 'budgetberatung',
    name: { de: 'Budgetberatung Schweiz', en: 'Budget counselling Switzerland', fr: 'Conseils budgétaires Suisse' },
    beschreibung: { de: 'Kostenlose Richtwerte und persönliche Beratung rund ums Haushaltsbudget', en: 'Free reference values and personal advice on household budgeting', fr: 'Valeurs indicatives gratuites et conseils personnels sur le budget du ménage' },
    url: 'https://www.budgetberatung.ch/',
  },
  {
    id: 'caritas-schulden',
    name: { de: 'Caritas — Schuldenberatung', en: 'Caritas — debt counselling', fr: 'Caritas — désendettement' },
    beschreibung: { de: 'Vertrauliche Hilfe bei Schulden und Betreibungen, schweizweit', en: 'Confidential help with debt and debt collection, nationwide', fr: 'Aide confidentielle en cas de dettes et de poursuites, dans toute la Suisse' },
    url: 'https://www.caritas.ch/de/schuldenberatung/',
  },
  {
    id: 'pro-senectute',
    name: { de: 'Pro Senectute', en: 'Pro Senectute', fr: 'Pro Senectute' },
    beschreibung: { de: 'Beratung und Unterstützung im Alter — Finanzen, Wohnen, Alltag', en: 'Advice and support in old age — finances, housing, everyday life', fr: 'Conseils et soutien pour les personnes âgées — finances, logement, quotidien' },
    url: 'https://www.prosenectute.ch/',
  },
  // Pro Juventute 147 bewusst NICHT hier: liegt bereits als help2 (tel:147) in den
  // Beratungsstellen (legal.resources.help2) — eine Wahrheit, kein Duplikat.
];

// Herzensempfehlungen (persönlich, von Stebler Studios kuratiert): Name + Ziel-Link sind
// sprachunabhängig (Eigennamen), nur die Beschreibung kommt aus i18n
// (legal.resources.heartfeltN — geteilt mit LegalView). url: null = bewusst kein
// Link (App-Store-App ohne Website, oder defektes HTTPS-Zertifikat). group →
// Themengruppe (Render gruppiert). GETEILTE QUELLE: sowohl Bücherregal (DirektLinks)
// als auch LegalView importieren diese Liste — nur EINE Wahrheit, kein Duplikat.
//
// affiliate: true → Provision, transparent als "Affiliate" gekennzeichnet. Ein
// bezahlter Eintrag braucht ZUSÄTZLICH ein Feld `branche` aus BRANCHEN_ERLAUBT
// (siehe unten). Das ist keine Formalie: eine Provision von einem Versicherer oder
// einer Bank macht aus Maloja eine Versicherungsvermittlerin (VAG Art. 40) bzw. eine
// Anlageberaterin (FIDLEG) — mit Informations-, Verhaltens- und allenfalls
// Registerpflichten. Eine Erlaubnisliste statt einer Verbotsliste, weil eine
// Verbotsliste an jedem Namen vorbeigeht, den sie nicht kennt: «VIAC», «frankly»,
// «neon» und «Raiffeisen» tragen kein Wort, das nach Finanz klingt.
export const BRANCHEN_ERLAUBT = ['digital', 'kultur', 'gemeinnuetzig', 'handwerk', 'konsumschutz', 'tiere', 'gesundheit', 'bildung'];
export const HEARTFELT = [
  { key: 'heartfelt1', name: 'Ecosia', url: 'https://www.ecosia.org', group: 'digital' },
  { key: 'heartfelt2', name: 'Infomaniak', url: 'https://www.infomaniak.com', group: 'digital' }, // zugleich unser Hoster — kein bezahlter Link, aber eine Geschäftsbeziehung; steht darum auch in der Beschreibung (legal.resources.heartfelt2)
  { key: 'heartfelt3', name: 'Posteo', url: 'https://posteo.de', group: 'digital' },
  { key: 'heartfelt4', name: 'artfuljana', url: 'https://artfuljana.ch', group: 'kunst' },
  { key: 'heartfelt5', name: 'Baukunst Nick', url: null, group: 'kunst' }, // HTTPS-Zertifikat defekt – vorerst kein Link
  { key: 'heartfelt6', name: 'plaant', url: 'https://www.plaant.ch/', group: 'kunst' }, // vormals «Living Dream Design» – neuer Name + Domain (Begrünungen, Pratteln)
  { key: 'heartfelt7', name: 'Pfadibewegung Schweiz', url: 'https://pfadi.swiss', group: 'gemeinschaft' },
  { key: 'heartfelt8', name: 'Tierschutz beider Basel', url: 'https://www.tbb.ch', group: 'tiere' },
  { key: 'heartfelt9', name: 'Abschiedsagentur', url: 'https://abschiedsagentur.ch', group: 'gemeinschaft' },
  { key: 'heartfelt10', name: 'Xdo', url: 'https://xdo-app.com', group: 'digital' }, // Rau Media (David Rau); Website ist eine Einseiten-App — nur die Startseite verlinken, geprüft 25.09.2026
  { key: 'heartfelt11', name: 'Schule für Blindenführhunde Allschwil', url: 'https://www.blindenhundeschule.ch', group: 'tiere' },
  { key: 'heartfelt12', name: 'Blindenhundeschule Liestal', url: 'https://www.blindenhund.ch', group: 'tiere' },
  { key: 'heartfelt13', name: 'Abstraktum Odemis', url: 'https://www.abstraktum-odemis.ch', group: 'gesundheit' },
  { key: 'heartfelt14', name: 'K-Tipp', url: 'https://www.ktipp.ch', group: 'konsum' },
  { key: 'heartfelt15', name: 'Saldo', url: 'https://www.saldo.ch', group: 'konsum' },
  { key: 'heartfelt16', name: 'SRF Kassensturz', url: 'https://www.srf.ch/sendungen/kassensturz-espresso', group: 'konsum' },
  { key: 'heartfelt17', name: 'Foodshiner', url: null, group: 'digital' }, // foodshiner.app – HTTPS-Zertifikat abgelaufen, App Store, vorerst kein Link
  { key: 'heartfelt18', name: 'Typewise', url: 'https://www.typewise.app/', group: 'digital' },
  { key: 'heartfelt19', name: 'moody.marinoko', url: 'https://www.instagram.com/moody.marinoko', group: 'kunst' }, // Tattoo-Artist, z.Zt. nur Instagram
  { key: 'heartfelt20', name: 'nottietatts', url: 'https://www.instagram.com/nottietatts', group: 'kunst' }, // Tattoo-Artist, z.Zt. nur Instagram
  { key: 'heartfelt21', name: 'Malergeschäft Hammel', url: 'https://www.nunningen.swiss/leben/gewerbe.html/50/company/41', group: 'kunst' }, // keine eigene Website – Gemeinde-Verzeichnis
  { key: 'heartfelt22', name: 'Unimed TCM', url: 'https://www.unimed-tcm.ch/', group: 'gesundheit' },
  { key: 'heartfelt23', name: 'Winterhilfe Schweiz', url: 'https://www.winterhilfe.ch', group: 'soziales' },
  { key: 'heartfelt24', name: 'Stiftung Rheinleben', url: 'https://www.rheinleben.ch', group: 'soziales' },
  { key: 'heartfelt25', name: 'Leihlager', url: 'https://www.leihlager.ch/', group: 'gemeinschaft' }, // gemeinnützige Leihplattform Basel («Leihen statt kaufen»), ehrenamtlich
  { key: 'heartfelt26', name: 'utopi', url: 'https://utopi.one/', group: 'tiere' }, // Wildblumen-Saatgut für Wildbienen (Shop, PRTGNST GmbH/MONTY., DE; liefert in die CH) – kein Affiliate, geprüft 19.09.2026
  { key: 'heartfelt28', name: 'Reclaim City', url: 'https://play.multiversegames.ai/reclaim-city/', group: 'digital' }, // Datenschutz-Spiel (Multiverse), englisch, kein Affiliate; Anstoss für «Digitale Ordnung», angesehen 01.11.2026
  { key: 'heartfelt29', name: 'Proton Mail', url: 'https://proton.me/mail', group: 'digital' }, // Proton AG, Plan-les-Ouates GE, Datenschutzerklärung Stand 12.05.2026; kein Affiliate, Beispiel nach Entscheid 01.11.2026 (Konzept §6)
  { key: 'heartfelt27', name: 'Nexter', url: 'https://crewz.io/de/nexter/', group: 'digital' }, // Habit-Tracker der Crewz GmbH (Freiburg i. Br.) – kein Affiliate, Seite geprüft 25.09.2026 (erfundene Adresse → 404)
];

// Reihenfolge der Gruppen in der Anzeige.
export const HEARTFELT_GROUPS = ['digital', 'soziales', 'konsum', 'tiere', 'gesundheit', 'kunst', 'gemeinschaft'];

export const CANTONAL_LINKS = {
  ZH: {
    steuererklaerung: 'https://www.zh.ch/de/steuern-finanzen/steuern.html',
    sozialdienst: 'https://www.zh.ch/de/soziales/sozialhilfe.html',
    ipv: 'https://www.zh.ch/de/gesundheit/praemienverbilligung_krankenversicherung.html',
  },
  BE: {
    steuererklaerung: 'https://www.taxme.ch/',
    // Bis 09.11.2026 stand hier die IPV-Seite (identisch mit `ipv`). Sozialhilfe = GSI, Amt für Integration und Soziales.
    sozialdienst: 'https://www.gsi.be.ch/de/start/themen/soziales/sozialhilfe.html',
    ipv: 'https://www.asv.dij.be.ch/de/start/themen/pv.html',
  },
  LU: {
    steuererklaerung: 'https://steuern.lu.ch/',
    sozialdienst: 'https://disg.lu.ch/themen/sozialhilfe',
    ipv: 'https://www.lu.ch/verwaltung/GSD/Praemienverbilligung',
  },
  BS: {
    steuererklaerung: 'https://www.steuerverwaltung.bs.ch/',
    sozialdienst: 'https://www.bs.ch/wsu/sozialhilfe',
    ipv: 'https://www.bs.ch/themen/finanzielle-hilfe/leistungen/praemienverbilligung',
  },
  GE: {
    steuererklaerung: 'https://ge.ch/tax/',
    // Bis 09.11.2026 stand hier eine IPV-Seite (subside). Die Sozialhilfe führt das Hospice général (öffentlich-rechtliche Anstalt des Kantons).
    sozialdienst: 'https://www.hospicegeneral.ch/obtenir-de-laide/',
    // Bis 09.11.2026 die Antragsseite «…-2026»: an ein Jahr gebunden. Die allgemeine Seite ohne Jahr
    // verweist auf die Antragsseiten des laufenden und des nächsten Jahres (gemessen 09.11.2026).
    ipv: 'https://www.ge.ch/informations-generales-subside-assurance-maladie',
  },
  VD: {
    steuererklaerung: 'https://www.vd.ch/themes/etat-droit-finances/impots/',
    // Bis 09.11.2026 stand hier eine IPV-Seite (subsides). Sozialhilfe heisst in VD Revenu d'insertion (RI), Antrag beim CSR.
    sozialdienst: 'https://www.vd.ch/aides-financieres-et-soutien-social/aides-financieres-et-comment-les-demander/revenu-dinsertion-ri',
    ipv: 'https://www.vd.ch/sante-soins-et-handicap/assurance-maladie/subside-a-lassurance-maladie',
  },
  AG: {
    steuererklaerung: 'https://www.ag.ch/de/themen/steuern-finanzen/steuern-startseite',
    sozialdienst: 'https://www.ag.ch/de/themen/soziales-gesellschaft/soziale-sicherheit/sozialhilfe',
    ipv: 'https://www.sva-aargau.ch/private/ihre-private-situation/finanzielle-unterstuetzung/praemienverbilligung/allgemeine',
  },
  SG: {
    steuererklaerung: 'https://www.sg.ch/steuern-finanzen/steuern.html',
    sozialdienst: 'https://www.sg.ch/gesundheit-soziales/soziales/sozialhilfe.html',
    ipv: 'https://www.sg.ch/gesundheit-soziales/gesundheit/krankenversicherung0/praemienverbilligung.html',
  },
  TI: {
    steuererklaerung: 'https://www4.ti.ch/dfe/dc/dichiarazione/',
    sozialdienst: 'https://www4.ti.ch/dss/dasf/temi/sostegno-sociale/prestazioni-finanziarie-di-sostegno-sociale/prestazioni-assistenziali-assistenza/calcolo-e-funzionamento-della-prestazione-assistenziale-ordinaria',
    ipv: 'https://www4.ti.ch/dss/ias/prestazioni-e-contributi/scheda/p/s/dettaglio/riduzione-dei-premi-dellassicurazione-malattia-ripam-1/riduzione-dei-premi-dellassicurazione-malattia-ripam',
  },
  ZG: {
    steuererklaerung: 'https://zg.ch/de/steuern-finanzen/steuern/natuerliche-personen/steuerabzuege',
    // Bis 09.11.2026 stand hier die IPV-Seite (identisch mit `ipv`).
    sozialdienst: 'https://zg.ch/de/soziales/sozialhilfe/persoenliche-und-wirtschaftliche-sozialhilfe',
    ipv: 'https://zg.ch/de/gesundheit/krankenversicherung/praemienverbilligung',
  },
  // BL: baselland.ch blockt automatisierte Zugriffe (Cloudflare, HTTP 403) — Links dort nur im
  // Browser prüfbar. Bei Pflege manuell prüfen.
  BL: {
    steuererklaerung: 'https://www.baselland.ch/politik-und-behorden/direktionen/finanz-und-kirchendirektion/steuerverwaltung',
    // Bis 09.11.2026 das Amt für Sozialbeiträge (führt u. a. die IPV). Neu die Themenseite Sozialhilfe, im Browser geprüft von Stebler Studios.
    sozialdienst: 'https://www.baselland.ch/themen/sozialhilfe',
    // Bis 09.11.2026 baselland.ch/…/amt-fur-sozialbeitrage/praemienverbilligung: im Browser am
    // 09.11.2026 abends «Nicht gefunden» (HTTP 404, nach der Cloudflare-Prüfung). Neu die IPV-Seite der
    // SVA Basel-Landschaft (Ausgleichskasse, führt die IPV): curl 200, Titel «SVA Basel-Landschaft:
    // Individuelle Prämienverbilligung (IPV)»; Gegenprobe …/individuelle-praemienverbilligung-ipv/
    // gibts-nicht-xyz → 404.
    ipv: 'https://www.sva-bl.ch/de/ausgleichskasse/individuelle-praemienverbilligung-ipv',
  },
  SO: {
    steuererklaerung: 'https://so.ch/verwaltung/finanzdepartement/steueramt/',
    sozialdienst: 'https://so.ch/verwaltung/departement-des-innern/amt-fuer-gesellschaft-und-soziales/sozialhilfe-und-asyl/sozialhilfe/ansprechstellen-in-der-sozialhilfe/', // Verzeichnis der Sozialregionen
    ipv: 'https://www.akso.ch/dienstleistungen/praemienverbilligung-ipv',
  },
  FR: {
    steuererklaerung: 'https://www.fr.ch/de/steuern',
    sozialdienst: 'https://www.fr.ch/dsas/sasoc',
    ipv: 'https://www.fr.ch/vie-quotidienne/assurances/assurance-maladie-et-assurance-accident/primes-maladie-changement-de-caisse-maladie-assurance-maladie-et-reduction-de-primes',
  },
  TG: {
    steuererklaerung: 'https://steuerverwaltung.tg.ch/',
    sozialdienst: 'https://sozialamt.tg.ch/sozialhilfe.html/4501', // bis 09.11.2026 Startseite Sozialamt
    ipv: 'https://gesundheit.tg.ch/bevoelkerung/krankenversicherung/praemienverbilligung.html/5578',
  },
  GR: {
    steuererklaerung: 'https://www.gr.ch/DE/institutionen/verwaltung/dfg/stv/Seiten/startseite.aspx',
    sozialdienst: 'https://www.gr.ch/DE/institutionen/verwaltung/dvs/soa/beratung/finanzielle-unterstuetzung/sozialhilfe/Seiten/default.aspx', // bis 09.11.2026 Startseite Amt für Soziales
    ipv: 'https://www.sva.gr.ch/praemienverbilligung.html',
  },
  SH: {
    steuererklaerung: 'https://www.steuern.sh.ch/',
    sozialdienst: 'https://sh.ch/CMS/Webseite/Kanton-Schaffhausen/Beh-rde/Verwaltung/Departement-des-Innern/Sozialamt-2795-DE.html',
    ipv: 'https://www.svash.ch/ipv/',
  },
  NE: {
    steuererklaerung: 'https://www.ne.ch/themes/Pages/impots.aspx',
    sozialdienst: 'https://www.ne.ch/autorites/decs/saso',
    ipv: 'https://www.ne.ch/themes/social/assurance-maladie/subsides-assurance-maladie-lamal',
  },
  VS: {
    steuererklaerung: 'https://www.vs.ch/de/web/scc',
    // Bis 09.11.2026 die Startseite der Dienststelle für Sozialwesen (Sozialhilfe, Asyl, Opferhilfe …).
    // Neu ihre Seite «Sozialhilfe» (gemessen mit curl 09.11.2026 abends: 200, Titel «Sozialhilfe»,
    // Gegenprobe vs.ch/de/web/sas/gibts-nicht-xyz → 404).
    sozialdienst: 'https://www.vs.ch/de/web/sas/aide-sociale',
    // Bis 09.11.2026 vs.ch/de/web/ssp/subsides-assurance-maladie: eine französische Sammelseite der
    // Dienststelle für Gesundheitswesen zur ganzen Krankenversicherung, die IPV nur als Abschnitt mit
    // Verweis auf die Ausgleichskasse. Neu die deutsche IPV-Seite der Ausgleichskasse des Kantons
    // Wallis, die den Anspruch feststellt (200, Titel «Prämienverbilligung»; Gegenprobe
    // ahvwallis.ch/de/Versicherungen/Gibt-es-nicht-xyz.html → 404).
    ipv: 'https://www.ahvwallis.ch/de/Versicherungen/IPV-Pramienverbilligungen-in-der-Krankenversicherung/Pramienverbilligung/Praemienverbilligung.html',
  },
  JU: {
    steuererklaerung: 'https://www.jura.ch/fr/Autorites/Administration/DFI/CTR/Service-des-contributions-CTR.html',
    sozialdienst: 'https://www.jura.ch/sas',
    // Bis 09.11.2026 die Seite «Informations générales 2026»: an ein Jahr gebunden, eine Fassung 2027
    // gibt es nicht (404). Die Bereichsseite ohne Jahr leitet auf die aktuelle Seite weiter und führt
    // im Menü alle Seiten zur RPI (gemessen 09.11.2026).
    ipv: 'https://www.ecasjura.ch/fr/Assurances/Assurance-maladie.html',
  },
  UR: {
    steuererklaerung: 'https://www.ur.ch/finanzen/1570', // «Natürliche Personen» mit eTax.UR (geprüft 21.10.2026); vorher 3040 = Organisation von Anlässen
    sozialdienst: 'https://www.ur.ch/dienstleistungen/8953',
    ipv: 'https://www.ur.ch/dienstleistungen/3519',
  },
  SZ: {
    steuererklaerung: 'https://www.sz.ch/behoerden/verwaltung/finanzdepartement/steuerverwaltung.html/8756-8758-8802-10332-10354',
    sozialdienst: 'https://www.sz.ch/behoerden/verwaltung/departement-des-innern/amt-fuer-gesundheit-und-soziales/soziales.html/8756-8758-8802-9316-9317-12842',
    ipv: 'https://www.sva-sz.ch/dienstleistungen/pr%C3%A4mienverbilligung-ipv',
  },
  OW: {
    steuererklaerung: 'https://www.ow.ch/aemter/186',
    sozialdienst: 'https://www.ow.ch/familie/5447', // bis 09.11.2026 Kantonales Sozialamt (aemter/244); Gesuche laufen über den Regionalen Sozialdienst
    ipv: 'https://www.ow.ch/fachbereiche/2737',
  },
  NW: {
    steuererklaerung: 'https://www.nw.ch/steueramt',
    sozialdienst: 'https://www.nw.ch/sozialdienst/1138', // bis 09.11.2026 nw.ch/sozialamt (Amtsseite)
    ipv: 'https://www.aknw.ch/dienstleistungen/praemienverbilligung-ipv',
  },
  GL: {
    steuererklaerung: 'https://www.gl.ch/verwaltung/finanzen-und-gesundheit/steuern.html/507',
    sozialdienst: 'https://www.gl.ch/verwaltung/volkswirtschaft-und-inneres/soziales/sozialhilfe.html/978',
    ipv: 'https://www.gl.ch/verwaltung/finanzen-und-gesundheit/steuern/individuelle-praemienverbilligung-ipv.html/502',
  },
  AR: {
    steuererklaerung: 'https://www.ar.ch/verwaltung/departement-finanzen/steuerverwaltung/',
    sozialdienst: 'https://ar.ch/verwaltung/departement-gesundheit-und-soziales/amt-fuer-soziales/abteilung-sozialhilfe-und-asyl/sozialhilfe/adressen-sozialaemter/', // Adressen der Sozialämter; bis 09.11.2026 Amtsseite
    ipv: 'https://ar.ch/verwaltung/departement-gesundheit-und-soziales/sozialversicherungen-appenzell-ausserrhoden/',
  },
  AI: {
    steuererklaerung: 'https://www.ai.ch/themen/steuern',
    sozialdienst: 'https://www.ai.ch/themen/gesundheit-alter-und-soziales/sozialhilfe',
    ipv: 'https://www.ai.ch/themen/gesundheit-alter-und-soziales/individuelle-praemienverbilligung',
  },
};

// Prüfdatum je Link (Felder `ipv` und `sozialdienst`), gemessen mit curl (Status, Titel/h1,
// Gegenprobe mit erfundenem Pfad je Domain). Getrennt von CANTONAL_LINKS, weil DirektLinks.jsx
// jedes Feld dort als Link anzeigt. `null` heisst: nicht geprüft, mit Grund im Kommentar.
//   VS: ⟨erledigt⟩ vs.ch antwortete curl am 09.11.2026 tagsüber auf JEDEN Pfad mit 404, im Browser
//       «Wartungsarbeiten» (Stebler Studios). Am Abend desselben Tags wieder erreichbar: beide
//       Links mit curl geprüft und ersetzt (Kommentare beim Eintrag VS oben).
//   OW, NW, SO, AR, GR, TG: sozialdienst am 09.11.2026 auf die genauere Seite gesetzt (Gesuchsstelle
//       bzw. Verzeichnis statt Amtsstartseite), Quelle docs/sources/sozialhilfe-kantone-2026.md.
//   BL: baselland.ch zeigt curl nur die Cloudflare-Schranke (403). sozialdienst am 09.11.2026
//       im Browser geprüft und ersetzt (Stebler Studios). ipv am 09.11.2026 abends im Browser:
//       alter Link 404, ersetzt durch die Seite der SVA BL (mit curl geprüft).
const G = '2026-11-09';
export const CANTONAL_LINKS_GEPRUEFT = {
  ZH: { ipv: G, sozialdienst: G }, BE: { ipv: G, sozialdienst: G }, LU: { ipv: G, sozialdienst: G },
  UR: { ipv: G, sozialdienst: G }, SZ: { ipv: G, sozialdienst: G }, OW: { ipv: G, sozialdienst: G },
  NW: { ipv: G, sozialdienst: G }, GL: { ipv: G, sozialdienst: G }, ZG: { ipv: G, sozialdienst: G },
  FR: { ipv: G, sozialdienst: G }, SO: { ipv: G, sozialdienst: G }, BS: { ipv: G, sozialdienst: G },
  BL: { ipv: G, sozialdienst: G },
  SH: { ipv: G, sozialdienst: G }, AR: { ipv: G, sozialdienst: G }, AI: { ipv: G, sozialdienst: G },
  SG: { ipv: G, sozialdienst: G }, GR: { ipv: G, sozialdienst: G }, AG: { ipv: G, sozialdienst: G },
  TG: { ipv: G, sozialdienst: G }, TI: { ipv: G, sozialdienst: G }, VD: { ipv: G, sozialdienst: G },
  VS: { ipv: G, sozialdienst: G },
  NE: { ipv: G, sozialdienst: G }, GE: { ipv: G, sozialdienst: G }, JU: { ipv: G, sozialdienst: G },
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
