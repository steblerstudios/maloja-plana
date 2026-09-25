// ─── Export-Vorschau: welche Angaben stehen in der Datei? (Bau-Liste K3, IDEEN §13) ───
//
// Reine Ableitung, ohne React, ohne Speicherzugriff — damit testbar und deterministisch.
// Der ruhige Zwischenschritt vor Export, Dossier und Brief zeigt in Worten, welche
// Kategorien in der Datei stehen werden. Die Liste kommt aus DENSELBEN Daten, die der
// jeweilige Export schreibt, nie aus einer generischen Aufzählung:
//   • Datei-Exporte (JSON, CSV, Manifest, Sicherung): aus `data` und den Listen, die der
//     Export tatsächlich mitnimmt (siehe zipExport.js und backupCrypto.collectBackupData).
//   • Dossiers: aus den Vorschau-Abschnitten — dieselbe getSections-Quelle, aus der auch
//     das Druck-HTML entsteht (dossierGenerator.js).
//   • Behörden-JSON: aus dem Objekt, das generateBehoerdenJSON gleich schreiben wird.
//   • Brief: aus den Feldern, die der jeweilige Brief-Generator liest (briefGenerator.js).
//
// Rückgabe: { form: 'datei' | 'druck', verschluesselt: boolean, kategorien: [...] }
// Eine Kategorie ist { id, chapter?, label?, detail?, count? }; die Anzeige übersetzt `id`
// über `zipExport.vorschau.kat.<id>` (Kapitel über `chapters.<key>.title`).
//
// Grundsatz: lieber eine Kategorie zu viel nennen als eine zu wenig. Zählt ein Wert als
// «erfasst», steht die Kategorie da. 0 und false gelten als nicht erfasst — das sind die
// üblichen Voreinstellungen, keine Angaben der Person.

export const KAPITEL = ['basis', 'wohnen', 'finanzen', 'versicherungen', 'ausbildung', 'behoerden', 'notfall'];

// Felder mit Gesundheitsangaben — in der Vorschau eigens genannt, weil sie besonders
// heikel sind. Nur Namen von Feldern, keine Werte.
const GESUNDHEIT = {
  notfall: ['bloodType', 'allergies', 'medications', 'chronicDiseases'],
  versicherungen: ['kkBelege'],
};

export function hatWert(v) {
  if (v == null) return false;
  if (typeof v === 'string') return v.trim() !== '';
  if (typeof v === 'number') return Number.isFinite(v) && v !== 0;
  if (typeof v === 'boolean') return v;
  if (Array.isArray(v)) return v.some(hatWert);
  if (typeof v === 'object') return Object.values(v).some(hatWert);
  return false;
}

const anzahl = (liste) => (Array.isArray(liste) ? liste.length : 0);

// Kapitel mit mindestens einem erfassten Wert, in fester Reihenfolge; weitere Bereiche
// (Rechner, Abläufe: z. B. `vorsorge`, `anspruch`) werden gezählt, nicht einzeln benannt.
// Schlüssel mit `_` sind interne Verwaltungsfelder (`_version`, `_migratedAt`).
// K38: auch innerhalb eines Bereichs zählen `_`-Felder (z. B. `_na`, «trifft nicht zu») nicht
// als Angabe — ein Kapitel, das nur Markierungen trägt, «hat» keine Angaben.
const ohneIntern = (v) => (v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.entries(v).filter(([k]) => !k.startsWith('_')))
  : v);

function kapitelAus(data) {
  const d = data && typeof data === 'object' ? data : {};
  const out = KAPITEL.filter(k => hatWert(ohneIntern(d[k]))).map(k => ({ id: 'kapitel', chapter: k }));
  const weitere = Object.keys(d).filter(k => !k.startsWith('_') && !KAPITEL.includes(k) && hatWert(ohneIntern(d[k])));
  if (weitere.length) out.push({ id: 'weitere', count: weitere.length });
  return out;
}

function merkmaleAus(data) {
  const d = data && typeof data === 'object' ? data : {};
  const out = [];
  if (hatWert(d.basis?.ahv)) out.push({ id: 'ahv' });
  const gesundheit = Object.entries(GESUNDHEIT).some(([k, felder]) => felder.some(f => hatWert(d[k]?.[f])));
  if (gesundheit) out.push({ id: 'gesundheit' });
  return out;
}

// Die Felder, die das MANIFEST.txt tatsächlich ausschreibt (zipExport.js, generateZipManifest).
const MANIFEST_FELDER = {
  basis: ['firstName', 'middleName', 'lastName', 'fullName', 'dateOfBirth', 'ahv', 'phone', 'email'],
  wohnen: ['address', 'rentAmount', 'utilities'],
  finanzen: ['monthlyIncome', 'employer', 'pension3a'],
  versicherungen: ['kkInsurer', 'kkPremium', 'franchise', 'bvgContribution'],
  ausbildung: ['jobTitle', 'employer', 'educationLevel'],
  behoerden: ['cantoneOfTaxation', 'betreibungsStatus', 'willMade'],
  notfall: ['bloodType', 'emergencyContact', 'allergies', 'organDonor'],
};

function manifestKategorien(data, documents) {
  const d = data && typeof data === 'object' ? data : {};
  const out = KAPITEL
    .filter(k => MANIFEST_FELDER[k].some(f => hatWert(d[k]?.[f])))
    .map(k => ({ id: 'kapitel', chapter: k }));
  if (hatWert(d.basis?.ahv)) out.push({ id: 'ahv' });
  if (hatWert(d.notfall?.bloodType) || hatWert(d.notfall?.allergies)) out.push({ id: 'gesundheit' });
  const docs = anzahl(documents);
  if (docs) out.push({ id: 'dokumenteListe', count: docs });
  return out;
}

// Behörden-JSON: die Blöcke des Objekts, das gleich geschrieben wird.
function dossierJsonKategorien(dossier) {
  const o = dossier && typeof dossier === 'object' ? dossier : {};
  const out = [];
  if (hatWert(o.person)) out.push({ id: 'person' });
  if (hatWert(o.person?.ahvNumber)) out.push({ id: 'ahv' });
  if (hatWert(o.address)) out.push({ id: 'adresse' });
  if (hatWert(o.finances)) out.push({ id: 'kapitel', chapter: 'finanzen' });
  if (hatWert(o.insurance)) out.push({ id: 'kapitel', chapter: 'versicherungen' });
  const berechnungen = Object.keys(o.calculations || {}).length;
  if (berechnungen) out.push({ id: 'berechnungen', count: berechnungen });
  return out;
}

// Brief: welche Angaben der gewählte Brief aus den Daten übernimmt (briefGenerator.js).
// Alle Briefe: Name (Absender, Unterschrift) und Wohnadresse (Absenderblock).
function briefKategorien(q) {
  const d = q.data && typeof q.data === 'object' ? q.data : {};
  const b = d.basis || {};
  const w = d.wohnen || {};
  const f = d.finanzen || {};
  const v = d.versicherungen || {};
  const out = [];
  if (hatWert(b.firstName) || hatWert(b.middleName) || hatWert(b.lastName) || hatWert(b.fullName)) out.push({ id: 'name' });
  if (hatWert(w.address) || hatWert(w.postalCode) || hatWert(w.city)) out.push({ id: 'adresse' });
  switch (q.templateKey) {
    case 'taxExtension':
      if (hatWert(b.canton) || hatWert(w.canton)) out.push({ id: 'kanton' });
      break;
    case 'insuranceSwitch':
      if (hatWert(v.kkInsurer) || hatWert(v.policyNumber)) out.push({ id: 'versicherung' });
      break;
    case 'kkReklamation':
      if (hatWert(v.kkInsurer)) out.push({ id: 'versicherung' });
      if (q.belegeCount > 0) out.push({ id: 'belege', count: q.belegeCount });
      break;
    // Lebensereignis-Briefe (26.09.2026): Arbeitgeber aus dem Profil …
    case 'workReference':
    case 'dismissalObjection': {
      const side = q.job === 'side';
      if (hatWert(side ? f.sideEmployer : f.employer) || hatWert(side ? f.sideEmployerAddress : f.employerAddress)) out.push({ id: 'arbeitgeber' });
      break;
    }
    case 'wageClaim':
    case 'unpaidWage': {
      const side = q.job === 'side';
      const employer = side ? f.sideEmployer : f.employer;
      const address = side ? f.sideEmployerAddress : f.employerAddress;
      const lohn = side ? f.sideIncome : f.monthlyIncome;
      if (hatWert(employer) || hatWert(address)) out.push({ id: 'arbeitgeber' });
      if (hatWert(lohn)) out.push({ id: 'lohn' });
      break;
    }
    default:
      break;
  }
  // … und die im Briefgenerator eingetippten Angaben (Nummern, Daten, Namen). Sie stammen
  // nicht aus dem Profil, stehen aber im Brief — also werden sie hier genannt. Ob etwas
  // eingetippt ist, entscheidet `angabenEingetippt` aus briefGenerator.js (Wahlfelder zählen nicht).
  if (q.angabenEingetippt) out.push({ id: 'briefAngaben' });
  return out;
}

// ─── K20: die übrigen Stellen, an denen Daten das Gerät als Datei oder Druck verlassen ───
// Jede Ableitung liest das Objekt (oder den Text), das der jeweilige Export gleich
// schreibt — nicht die Rohdaten. Fällt ein Export ohne Namen auf einen Platzhalter
// zurück (Budget-Bericht, Lebenslauf), zählt der Name aus den Daten, nicht aus dem Platzhalter.

const hatName = (b) => !!b && (hatWert(b.firstName) || hatWert(b.middleName) || hatWert(b.lastName) || hatWert(b.fullName));

// IPV-Antrag (PremiumSubsidy): das Objekt aus buildIpvDokument (premiumCalc.js).
function ipvKategorien(dok) {
  const o = dok && typeof dok === 'object' ? dok : {};
  const out = [];
  if (hatWert(o.applicant)) out.push({ id: 'name' });
  if (hatWert(o.ahv)) out.push({ id: 'ahv' });
  if (hatWert(o.canton)) out.push({ id: 'kanton' });
  // Das Ergebnis steht immer in der Datei — auch «kein Anspruch». Darum Vorhandensein
  // statt hatWert: `{ eligible: false, amount: 0 }` ist eine Aussage, keine Leerstelle.
  // E9: ohne amtlich belegten Kanton steht dort nur eine Einschätzung ohne Betrag.
  if (o.result != null) out.push({ id: o.result.belegt === false ? 'ipvOrientierung' : 'ipvErgebnis' });
  return out;
}

// Budget-Bericht (BudgetSync): das Objekt aus createBudgetReport (budgetSync.js).
// Schuldenabzahlungen eigens genannt, weil sie heikel sind — wie die Gesundheitsangaben.
function budgetKategorien(report, data) {
  const b = (report && report.budget) || {};
  const ausgaben = { ...(b.expenses || {}) };
  const schulden = ausgaben.debtPayments;
  delete ausgaben.debtPayments;
  const out = [];
  if (hatName(data && data.basis)) out.push({ id: 'name' });
  if (hatWert(b.income) || hatWert(b.incomeDetail)) out.push({ id: 'einkommen' });
  if (hatWert(b.ipvRelief)) out.push({ id: 'ipvErgebnis' });
  else if (b.ipvOrientierung) out.push({ id: 'ipvOrientierung' });
  if (hatWert(ausgaben) || hatWert(b.reference)) out.push({ id: 'ausgaben' });
  if (hatWert(schulden)) out.push({ id: 'schulden' });
  if (hatWert(b.householdContext)) out.push({ id: 'haushalt' });
  return out;
}

// Lebenslauf als HTML (CVGenerator): das Objekt aus generateCVTemplate, das
// generateCVHTML ausschreibt. Die aktuelle Stelle erscheint dort nur mit Berufsbezeichnung.
function cvHtmlKategorien(cv, data) {
  const c = cv && typeof cv === 'object' ? cv : {};
  const h = c.header || {};
  const exp = c.experience || {};
  const out = [];
  if (hatName(data && data.basis)) out.push({ id: 'name' });
  if (hatWert(h.phone) || hatWert(h.email)) out.push({ id: 'kontakt' });
  if (hatWert(h.address) || hatWert(h.city)) out.push({ id: 'adresse' });
  if (hatWert(c.personal)) out.push({ id: 'persoenlich' });
  if (hatWert(exp.current && exp.current.title) || hatWert(exp.previous)) out.push({ id: 'beruf' });
  if (hatWert(c.education)) out.push({ id: 'ausbildung' });
  if (hatWert(c.languages && c.languages.list)) out.push({ id: 'sprachen' });
  return out;
}

// Lebenslauf als JSON Resume (CVGenerator): das Objekt aus generateJSONResume.
// Bewusst ohne Geburtsdatum und Zivilstand — darum hier keine «persoenlich»-Kategorie.
function cvJsonKategorien(resume) {
  const r = resume && typeof resume === 'object' ? resume : {};
  const b = r.basics || {};
  const ort = { ...(b.location || {}) };
  delete ort.countryCode;   // fest «CH», keine Angabe der Person
  const out = [];
  if (hatWert(b.name)) out.push({ id: 'name' });
  if (hatWert(b.email) || hatWert(b.phone)) out.push({ id: 'kontakt' });
  if (hatWert(ort)) out.push({ id: 'adresse' });
  if (hatWert(b.label) || hatWert(r.work)) out.push({ id: 'beruf' });
  if (hatWert(r.education)) out.push({ id: 'ausbildung' });
  if (hatWert(r.languages)) out.push({ id: 'sprachen' });
  return out;
}

// Kalender (.ics): gezählt wird im Text, den buildICS schreibt (utils/icsExport.js).
// Ein Termin ohne Datum fällt dort weg und zählt darum auch hier nicht.
function kalenderKategorien(ics) {
  const n = String(ics || '').split(/\r?\n/).filter(l => l === 'BEGIN:VEVENT').length;
  return n ? [{ id: 'kalenderTermine', count: n }] : [];
}

// q je Art:
//   json      { data, documents }
//   csv       { data }
//   manifest  { data, documents }
//   sicherung / sicherungVerschluesselt  { data, documents, reminders, contacts, merkliste } (Anzahlen oder Listen)
//   dossier   { abschnitte: [{ titel, felder: [label…] }], dokumente, name? }  (Druck; auch
//             Finanzübersicht und Notfallkarte, K20)
//   dossierJson { dossier }
//   brief     { data, templateKey, belegeCount, job }  (Druck)
//   ipvJson   { dokument }          (buildIpvDokument)
//   budgetJson { report, data }     (createBudgetReport)
//   cvHtml    { cv, data }          (generateCVTemplate)
//   cvJson    { resume }            (generateJSONResume)
//   kalender  { ics }               (Text aus buildICS)
export function leiteKategorienAb(art, q = {}) {
  const zahl = (x) => (typeof x === 'number' ? x : anzahl(x));
  switch (art) {
    case 'json': {
      const out = [...kapitelAus(q.data), ...merkmaleAus(q.data)];
      const docs = anzahl(q.documents);
      if (docs) out.push({ id: 'dokumenteListe', count: docs });
      return { form: 'datei', verschluesselt: false, kategorien: out };
    }
    case 'csv':
      return { form: 'datei', verschluesselt: false, kategorien: [...kapitelAus(q.data), ...merkmaleAus(q.data)] };
    case 'manifest':
      return { form: 'datei', verschluesselt: false, kategorien: manifestKategorien(q.data, q.documents) };
    case 'sicherung':
    case 'sicherungVerschluesselt': {
      const out = [...kapitelAus(q.data), ...merkmaleAus(q.data)];
      const docs = zahl(q.documents);
      if (docs) out.push({ id: 'dokumenteInhalt', count: docs });
      const termine = zahl(q.reminders);
      if (termine) out.push({ id: 'termine', count: termine });
      const kontakte = zahl(q.contacts);
      if (kontakte) out.push({ id: 'kontakte', count: kontakte });
      const merkliste = zahl(q.merkliste);
      if (merkliste) out.push({ id: 'merkliste', count: merkliste });
      out.push({ id: 'einstellungen' });
      return { form: 'datei', verschluesselt: art === 'sicherungVerschluesselt', kategorien: out };
    }
    case 'dossier': {
      // `name: true`, wenn der Druck den Namen im Titel trägt (Finanzübersicht, K20).
      const out = q.name ? [{ id: 'name' }] : [];
      out.push(...(Array.isArray(q.abschnitte) ? q.abschnitte : [])
        .filter(a => a && a.titel)
        .map(a => ({ id: 'abschnitt', label: a.titel, detail: (a.felder || []).filter(Boolean).join(', ') })));
      const docs = zahl(q.dokumente);
      if (docs) out.push({ id: 'dokumenteListe', count: docs });
      return { form: 'druck', verschluesselt: false, kategorien: out };
    }
    case 'dossierJson':
      return { form: 'datei', verschluesselt: false, kategorien: dossierJsonKategorien(q.dossier) };
    case 'brief':
      return { form: 'druck', verschluesselt: false, kategorien: briefKategorien(q) };
    case 'ipvJson':
      return { form: 'datei', verschluesselt: false, kategorien: ipvKategorien(q.dokument) };
    case 'budgetJson':
      return { form: 'datei', verschluesselt: false, kategorien: budgetKategorien(q.report, q.data) };
    case 'cvHtml':
      return { form: 'datei', verschluesselt: false, kategorien: cvHtmlKategorien(q.cv, q.data) };
    case 'cvJson':
      return { form: 'datei', verschluesselt: false, kategorien: cvJsonKategorien(q.resume) };
    case 'kalender':
      return { form: 'datei', verschluesselt: false, kategorien: kalenderKategorien(q.ics) };
    default:
      return { form: 'datei', verschluesselt: false, kategorien: [] };
  }
}
