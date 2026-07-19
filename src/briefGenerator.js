// ─── Brief-Generator ──────────────────────────────────────
// Pure functions that produce printable Swiss letter HTML.
// Same approach as dossierGenerator: offline-safe, browser-native print.
//
// Usage:
//   getLetterTemplates(t) → array of template definitions
//   generateLetter(templateKey, data, t, options) → HTML string for print
//     options.belege (optional) → für kkReklamation: gewählte kkBelege ({datum,betrag})
//     options.job    (optional) → für wageClaim/unpaidWage: 'main' (Vorgabe) | 'side'.
//                                 Bestimmt Empfänger UND Zahlen — ein Brief über den
//                                 Nebenjob darf nie den Hauptlohn nennen.

import { getFullName } from './config/constants.js';
import { getCantonName } from './config/cantonalData.js';
import { pruefeStundenlohn, kantonHatMindestlohn, WAGECLAIM_BEREIT } from './data/lohnCheck.js';
import { getLohnKontrollstelle } from './data/lohnRechtsstellen.js';

// ─── Fristen (Tage) ───────────────────────────────────────
// (a) wageClaim/Mindestlohn: 30 Tage — keine gesetzliche Antwortfrist, Lohnkorrektur
//     braucht einen Lohnlauf; ruhiger, nicht konfrontativer Ton.
// (b) unpaidWage/ausstehender Lohn: 10 Tage — Lohn ist bereits fällig (OR 323);
//     ~1 Woche gilt als angemessen, 10 Tage bleibt höflich und hält spätere Schritte offen.
export const FRIST_TAGE = { wageClaim: 30, unpaidWage: 10 };

// Zahl aus Nutzer-Eingabe (String, evtl. mit Komma) robust lesen.
function num(v) {
  return parseFloat(String(v == null ? '' : v).replace(',', '.')) || 0;
}

// Frist-Datum eines Brieftyps: heute + Frist-Tage → { iso, display }.
// EINE Quelle der Wahrheit für Brieftext UND Kalender-Eintrag (addReminder).
export function getFristInfo(templateKey, from = new Date()) {
  const days = FRIST_TAGE[templateKey];
  if (!days) return null;
  const d = new Date(from.getTime());
  d.setDate(d.getDate() + days);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return { days, iso: `${d.getFullYear()}-${month}-${day}`, display: `${day}.${month}.${d.getFullYear()}` };
}

// Welche Anstellung meint der Brief? Haupt- und Nebenerwerb haben eigenen Lohn, eigene
// Stunden und einen eigenen Arbeitgeber — ein Brief über den Nebenjob darf nie die Zahlen
// des Hauptjobs tragen. Das Einkommensmodell der App ist durchgehend „Haupt + Neben“
// (monthlyIncome + sideIncome), dem folgt diese Auswahl.
export function getJobOptions(data) {
  const opts = [{ key: 'main', employer: data?.finanzen?.employer || '', address: data?.finanzen?.employerAddress || '' }];
  if ((data?.finanzen?.sideEmployer || '').trim()) {
    opts.push({ key: 'side', employer: data.finanzen.sideEmployer, address: data?.finanzen?.sideEmployerAddress || '' });
  }
  return opts;
}

export function getJob(data, jobKey) {
  const side = jobKey === 'side';
  return {
    key: side ? 'side' : 'main',
    employer: (side ? data?.finanzen?.sideEmployer : data?.finanzen?.employer) || '',
    address: (side ? data?.finanzen?.sideEmployerAddress : data?.finanzen?.employerAddress) || '',
    lohn: num(side ? data?.finanzen?.sideIncome : data?.finanzen?.monthlyIncome),
    stunden: num(side ? data?.finanzen?.sideHoursPerWeek : data?.ausbildung?.workHoursPerWeek),
    // Der Mindestlohn ist ein BRUTTO-Stundenlohn — ohne bekannte Basis kein Befund.
    // Jeder Job trägt seine eigene Art: der Hauptjob `incomeType`, der Nebenerwerb
    // `sideIncomeType` (Predeploy-Runde 8 ergänzt — vorher gab es für den Nebenerwerb
    // gar keine, der Befund wäre also nie berechenbar gewesen).
    einkommensart: (side ? data?.finanzen?.sideIncomeType : data?.finanzen?.incomeType) || null,
    // Der 13. zählt an den Mindestlohn (Jahres-Boden). Nur der Hauptjob trägt das Feld —
    // für den Nebenerwerb gibt es keine 13.-Angabe (dann voller Boden, sichere Richtung).
    dreizehnter: side ? undefined : (data?.finanzen?.dreizehnter || undefined),
  };
}

// Lohn-Befund autark aus den Daten rechnen (genauere Stundenlohn-Prüfung, wenn Stunden da).
function lohnBefund(data, jobKey) {
  const kanton = data?.basis?.canton || '';
  const job = getJob(data, jobKey);
  const monthlyIncome = job.lohn;
  const wHrs = job.stunden;
  if (monthlyIncome <= 0 || !kanton) return { status: 'unvollstaendig', kanton };
  // WAHRHEITS-DISZIPLIN: keine 182h-Vollzeit-Annahme und keine Brutto-Annahme. Ohne echte
  // Wochenstunden ist der Stundenlohn nicht bestimmbar; ohne bekannte Einkommensart ist er
  // nicht vergleichbar (Netto gegen einen Brutto-Boden erklärt korrekt Bezahlte für
  // unterbezahlt). Dieser Brief geht per Einschreiben an einen Arbeitgeber — eine geratene
  // Zahl wäre eine falsche Anschuldigung. `pruefeStundenlohn` meldet beides selbst
  // ('unvollstaendig' / 'basisUnklar'); die Beträge fallen auf „bitte ergänzen" (hasFigures).
  return pruefeStundenlohn(monthlyIncome, wHrs, kanton, job.einkommensart, job.dreizehnter);
}

// Gesetz + Stelle für den wageClaim-Brief. WAHRHEITS-DISZIPLIN: bei `verify:true`
// (amtlich noch nicht gegengeprüft) NICHT die unsichere Stelle/den Gesetzestitel in
// einen versendbaren Brief schreiben — dann neutrale Formulierung. JU hat keine
// Kontrollstelle → Arbeitsgericht-Fallback; das Wort „Stelle" bleibt bewusst generisch.
function wageClaimRefs(kanton, t) {
  const e = getLohnKontrollstelle(kanton);
  const neutralGesetz = t('briefe.wageClaim.gesetzFallback');
  const neutralStelle = t('briefe.wageClaim.stelleFallback');
  if (!e) return { gesetz: neutralGesetz, stelle: neutralStelle };
  const gesetz = (e.gesetz && !e.verify) ? e.gesetz : neutralGesetz;
  const stelle = e.verify ? neutralStelle : (e.stelle || e.fallback || neutralStelle);
  return { gesetz, stelle };
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function today() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${d.getFullYear()}`;
}

// ISO-Datum (YYYY-MM-DD) → Schweizer Format TT.MM.JJJJ; sonst unverändert.
function formatDate(iso) {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso));
  return m ? `${m[3]}.${m[2]}.${m[1]}` : String(iso);
}

// Betrag → Schweizer Tausendertrennung; leer bei 0/ungültig.
function formatAmount(n) {
  const num = Number(n);
  if (!isFinite(num) || num <= 0) return '';
  return num.toLocaleString('de-CH');
}

function senderBlock(data) {
  const name = getFullName(data.basis) || '';
  const street = data.wohnen?.address || '';
  const city = [(data.wohnen?.postalCode || ''), (data.wohnen?.city || '')].filter(Boolean).join(' ');
  // esc() each field: this block is interpolated raw (${f.sender}) into the letter HTML.
  return [name, street, city].filter(Boolean).map(esc).join('<br>');
}

function recipientPlaceholder(t) {
  return esc(t('briefe.recipientPlaceholder'));
}

// Empfängerblock für Arbeitgeber-Briefe: Name + Adresse, so weit belegt. Was fehlt, wird
// als Lücke markiert statt geraten — der Block sitzt im rechten Sichtfenster des CH-Couverts.
// esc() pro Zeile: der Rückgabewert wird roh ins Brief-HTML interpoliert.
function employerRecipient(job, t) {
  if (!job.employer) return `<div class="placeholder">${recipientPlaceholder(t)}</div>`;
  const name = esc(job.employer);
  const addr = String(job.address || '').split('\n').map(l => l.trim()).filter(Boolean);
  if (!addr.length) return `${name}<div class="placeholder">${esc(t('briefe.fillIn'))}</div>`;
  return `${name}<br>${addr.map(esc).join('<br>')}`;
}

// ─── Template definitions ─────────────────────────────────

export function getLetterTemplates(t, data) {
  const kanton = data?.basis?.canton || '';
  const list = [
    {
      key: 'leaseTermination',
      title: t('briefe.leaseTermination.title'),
      description: t('briefe.leaseTermination.description'),
      icon: 'home',
      legalRef: 'OR Art. 266a',
      // Ablage-Kapitel im Dokumenten-Tresor (Loop-Closure Brief→Scan→Ablage)
      chapter: 'wohnen',
    },
    {
      key: 'addressChange',
      title: t('briefe.addressChange.title'),
      description: t('briefe.addressChange.description'),
      icon: 'home',
      legalRef: '',
      chapter: 'wohnen',
    },
    {
      key: 'taxExtension',
      title: t('briefe.taxExtension.title'),
      description: t('briefe.taxExtension.description'),
      icon: 'calculator',
      legalRef: '',
      chapter: 'behoerden',
    },
    {
      key: 'insuranceSwitch',
      title: t('briefe.insuranceSwitch.title'),
      description: t('briefe.insuranceSwitch.description'),
      icon: 'shield',
      legalRef: 'KVG Art. 7',
      chapter: 'versicherungen',
    },
    {
      key: 'kkReklamation',
      title: t('briefe.kkReklamation.title'),
      description: t('briefe.kkReklamation.description'),
      icon: 'health',
      legalRef: 'ATSG Art. 52',
      chapter: 'versicherungen',
    },
    {
      key: 'unpaidWage',
      title: t('briefe.unpaidWage.title'),
      description: t('briefe.unpaidWage.description'),
      icon: 'money',
      legalRef: 'OR Art. 323',
      chapter: 'finanzen',
    },
  ];
  // 🔴 wageClaim nur anbieten, wenn der Kanton einen gesetzlichen Mindestlohn hat.
  // Sonst behauptet der Brief einen nicht existierenden Mindestlohn (Haftungsrisiko in
  // ~21/26 Kantonen). Kein Kanton gewählt → auch nicht anbieten (nicht raten).
  //
  // 🔴 Predeploy-Runde 8: Das Kanton-Gate allein reichte nicht. Der Brief wurde auch dann
  // angeboten, wenn der Befund 'ok' war — GE/CHF 8'000 auf 42 Std. = 43.96/Std., klar über
  // dem Boden, und trotzdem stand im Brief „dass mein Stundenlohn unter dem … Mindestlohn
  // liegen dürfte", mit leeren Beträgen (`hasFigures` hängt am Befund). Die App hat den
  // Verdacht selbst widerlegt und ihn trotzdem ausformuliert — per Einschreiben an einen
  // Arbeitgeber. Jetzt entscheidet der Befund, nicht der Wohnort.
  //
  // Angeboten wird bei:
  //   'unterMindestlohn' → der Befund trägt den Brief.
  //   'unvollstaendig'/'basisUnklar' → Verdacht möglich, Daten unvollständig; der Brief
  //     formuliert vorsichtig und die Beträge bleiben „[bitte ergänzen]". Das ist kein
  //     Widerspruch: die App weiss es nicht, statt es besser zu wissen.
  // NICHT angeboten bei 'ok' und 'keinGesetz'.
  // Nur über Anstellungen urteilen, für die tatsächlich ein LOHN erfasst ist.
  //
  // ⚠️ Predeploy-Runde 8, ZWEITE Batterie (Code-Review + swiss-precision, gegen den Fix
  // selbst): Der erste Fix fragte `getJobOptions(...).some(...)` und der Kommentar behauptete
  // „nur über Anstellungen urteilen, die es GIBT". `getJobOptions` pusht `main` aber
  // BEDINGUNGSLOS, und ein Job ohne Lohn liefert 'unvollstaendig' — was den Brief öffnet.
  // Zwei belegte Folgen:
  //   · Nur der Nebenjob-NAME erfasst, Hauptjob CHF 8'000 = 43.96/Std. (klar 'ok'):
  //     `some` sah das 'unvollstaendig' des leeren Nebenjobs → Brief angeboten. Und weil
  //     `BriefGenerator` mit `job: 'main'` startet, ging der Verdachts-Brief an den GUT
  //     ZAHLENDEN Hauptarbeitgeber — derselbe Fehler wie vorher bei 'ok', neu verpackt.
  //   · Komplett leerer Datensatz (nur Kanton) → Brief angeboten.
  // Ein Job ohne Lohn ist kein unvollständiger Verdacht, sondern gar kein Verdacht.
  const darfWageClaim = (s) => s === 'unterMindestlohn' || s === 'unvollstaendig' || s === 'basisUnklar';
  // ⚠️ `WAGECLAIM_BEREIT` ist bewusst `false` (Stebler-Studios-Entscheid, Predeploy-Runde 8):
  // Der Befund kennt die gesetzlichen Ausnahmen nicht (Lehre/Praktikum/unter 18/GAV, und GE
  // hat drei Sätze statt einem) — der Brief würde Arbeitgeber beschuldigen, die korrekt
  // zahlen. Begründung und Belege stehen bei der Konstante in `data/lohnCheck.js`.
  // Der Brief-Code bleibt vollständig gebaut, geprüft und getestet; nur das Anbieten ruht.
  // Die Befund-Schleife steht HINTER dem Flag (dritte Prüfung): solange der Brief ruht, ist
  // sie unnötige Arbeit bei jedem Briefe-View-Render (`.filter(getJob).some(pruefeStundenlohn)`).
  const einJobRechtfertigtDenBrief = () => getJobOptions(data)
    .filter((o) => getJob(data, o.key).lohn > 0)
    .some((o) => darfWageClaim(lohnBefund(data, o.key).status));
  if (WAGECLAIM_BEREIT && kantonHatMindestlohn(kanton) && einJobRechtfertigtDenBrief()) {
    list.push({
      key: 'wageClaim',
      title: t('briefe.wageClaim.title'),
      description: t('briefe.wageClaim.description'),
      icon: 'money',
      legalRef: 'OR Art. 322',
      chapter: 'finanzen',
    });
  }
  return list;
}

// ─── Field extraction helpers ─────────────────────────────

function getLeaseTerminationFields(data, t) {
  return {
    sender: senderBlock(data),
    recipient: recipientPlaceholder(t),
    objectAddress: data.wohnen?.address ? esc(data.wohnen.address) : esc(t('briefe.fillIn')),
    city: data.wohnen?.city || '',
    filled: {
      name: !!getFullName(data.basis),
      address: !!data.wohnen?.address,
    },
  };
}

function getTaxExtensionFields(data, t) {
  const year = new Date().getFullYear();
  return {
    sender: senderBlock(data),
    recipient: recipientPlaceholder(t),
    taxYear: year - 1,
    canton: data.basis?.canton || data.wohnen?.canton || '',
    filled: {
      name: !!getFullName(data.basis),
      address: !!data.wohnen?.address,
    },
  };
}

function getInsuranceSwitchFields(data, t) {
  return {
    sender: senderBlock(data),
    recipient: recipientPlaceholder(t),
    currentInsurer: data.versicherungen?.kkInsurer || '',
    // Bewusst NICHT kkCardNumber (Versichertenkarten-Nr. ≠ Policennummer) — sonst stünde
    // im ausgehenden Kündigungsbrief eine falsche Referenz. Ohne echtes Policennummer-Feld leer.
    policyNumber: data.versicherungen?.policyNumber || '',
    filled: {
      name: !!getFullName(data.basis),
      insurer: !!data.versicherungen?.kkInsurer,
    },
  };
}

// ─── HTML generation ──────────────────────────────────────

const LETTER_CSS = `
  @page { size: A4; margin: 25mm 20mm 20mm 20mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #1a1a1a; padding: 25mm 20mm 20mm 20mm; }
  /* Schweizer Geschäftsbrief-Norm: Absender oben links als Briefkopf,
     Empfängeradresse rechts (Position fürs rechte Sichtfenster im CH-Couvert),
     Ort/Datum rechtsbündig, Betreff fett ohne "Betreff:"-Präfix. */
  .sender { margin-bottom: 12mm; font-size: 9pt; color: #555; }
  .recipient { width: 85mm; margin: 0 0 12mm auto; min-height: 28mm; }
  .recipient .placeholder { color: #888; font-style: italic; border-bottom: 1px dashed #ccc; padding-bottom: 2px; }
  .date-line { text-align: right; margin-bottom: 10mm; }
  .subject { font-weight: 700; margin-bottom: 8mm; font-size: 11pt; }
  .body-text { margin-bottom: 6mm; }
  .body-text p { margin-bottom: 4mm; }
  .signature { margin-top: 15mm; }
  .legal-note { margin-top: 10mm; font-size: 9pt; color: #666; border-top: 1px solid #ddd; padding-top: 4mm; }
  .fill-hint { background: #FFFDE7; padding: 2px 6px; border-radius: 3px; font-style: italic; }
  /* Die legal-note ist ein Wegweiser für die NUTZERIN, nicht für den Empfänger — sie
     bleibt auf dem Bildschirm (Vorschau) und geht NICHT ins Couvert. Predeploy-Runde 8,
     Stebler-Studios-Entscheid: gedruckt las der Arbeitgeber "Einschreiben empfohlen" in
     einem Brief, der bereits angekommen ist, "Diese Vorlage ist eine Orientierungshilfe"
     (= das kommt aus einem Generator) und beim unpaidWage "Betreibung" / "fristlose
     Auflösung" — als Hinweis an die Nutzerin gut gehedged, im Couvert eine Drohkulisse.
     Der Brieftext selbst vermeidet genau diesen Ton sorgfältig.
     Der Disclaimer steht dafür neu in der App (briefe.disclaimer) — vorher stand er
     NUR im Brief.
     ACHTUNG: Dieser Block ist ein JS-Template-Literal — keine Backticks im Kommentar. */
  @media print { body { padding: 0; } .no-print, .legal-note { display: none; } }
  @media screen { body { max-width: 210mm; margin: 0 auto; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); min-height: 297mm; } }
`;

function wrapLetter(content, t) {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><title>${esc(t('briefe.title'))}</title>
<style>${LETTER_CSS}</style></head>
<body>${content}</body></html>`;
}

function fillHint(t) {
  return `<span class="fill-hint">${esc(t('briefe.fillIn'))}</span>`;
}

function generateLeaseTermination(data, t) {
  const f = getLeaseTerminationFields(data, t);
  const dateStr = today();
  const cityDate = f.city ? `${esc(f.city)}, ${dateStr}` : dateStr;

  return wrapLetter(`
    <div class="sender">${f.sender || fillHint(t)}</div>
    <div class="recipient"><div class="placeholder">${f.recipient}</div></div>
    <div class="date-line">${cityDate}</div>
    <div class="subject">${esc(t('briefe.leaseTermination.subject'))}</div>
    <div class="body-text">
      <p>${esc(t('briefe.leaseTermination.salutation'))}</p>
      <p>${esc(t('briefe.leaseTermination.body1'))}</p>
      <p>${esc(t('briefe.leaseTermination.body2', { address: f.objectAddress }))}</p>
      <p>${esc(t('briefe.leaseTermination.body3'))}</p>
      <p>${esc(t('briefe.leaseTermination.closing'))}</p>
    </div>
    <div class="signature">${getFullName(data.basis) ? esc(getFullName(data.basis)) : fillHint(t)}</div>
    <div class="legal-note">${esc(t('briefe.leaseTermination.legalNote'))}</div>
  `, t);
}

function getAddressChangeFields(data, t) {
  const street = data.wohnen?.address || '';
  const cityLine = [(data.wohnen?.postalCode || ''), (data.wohnen?.city || '')].filter(Boolean).join(' ');
  const newAddress = [street, cityLine].filter(Boolean).join(', ');
  return {
    sender: senderBlock(data),
    recipient: recipientPlaceholder(t),
    newAddress,
    city: data.wohnen?.city || '',
    filled: {
      name: !!getFullName(data.basis),
      address: !!street,
    },
  };
}

function generateAddressChange(data, t) {
  const f = getAddressChangeFields(data, t);
  const dateStr = today();
  const cityDate = f.city ? `${esc(f.city)}, ${dateStr}` : dateStr;
  // Klartext für t()-Interpolation (wird im ${esc(t(...))} einmal escaped).
  const addressLine = f.newAddress || t('briefe.fillIn');

  return wrapLetter(`
    <div class="sender">${f.sender || fillHint(t)}</div>
    <div class="recipient"><div class="placeholder">${f.recipient}</div></div>
    <div class="date-line">${cityDate}</div>
    <div class="subject">${esc(t('briefe.addressChange.subject'))}</div>
    <div class="body-text">
      <p>${esc(t('briefe.addressChange.salutation'))}</p>
      <p>${esc(t('briefe.addressChange.body1'))}</p>
      <p>${esc(t('briefe.addressChange.body2', { address: addressLine }))}</p>
      <p>${esc(t('briefe.addressChange.body3'))}</p>
      <p>${esc(t('briefe.addressChange.closing'))}</p>
    </div>
    <div class="signature">${getFullName(data.basis) ? esc(getFullName(data.basis)) : fillHint(t)}</div>
  `, t);
}

function generateTaxExtension(data, t) {
  const f = getTaxExtensionFields(data, t);
  const dateStr = today();
  const cityDate = f.city ? `${esc(f.city)}, ${dateStr}` : dateStr;

  return wrapLetter(`
    <div class="sender">${f.sender || fillHint(t)}</div>
    <div class="recipient"><div class="placeholder">${f.recipient}</div></div>
    <div class="date-line">${cityDate}</div>
    <div class="subject">${esc(t('briefe.taxExtension.subject', { year: f.taxYear }))}</div>
    <div class="body-text">
      <p>${esc(t('briefe.taxExtension.salutation'))}</p>
      <p>${esc(t('briefe.taxExtension.body1', { year: f.taxYear }))}</p>
      <p>${esc(t('briefe.taxExtension.body2'))}</p>
      <p>${esc(t('briefe.taxExtension.closing'))}</p>
    </div>
    <div class="signature">${getFullName(data.basis) ? esc(getFullName(data.basis)) : fillHint(t)}</div>
  `, t);
}

function generateInsuranceSwitch(data, t) {
  const f = getInsuranceSwitchFields(data, t);
  const dateStr = today();
  const cityDate = f.city ? `${esc(f.city)}, ${dateStr}` : dateStr;
  // Klartext für t()-Interpolation — die Werte landen in einem ${esc(t(...))} und
  // werden dort einmal escaped. Kein vor-Escapen (sonst doppelt) und kein fillHint-HTML
  // (sonst würden die <span>-Tags als Text im Brief erscheinen).
  const insurerLine = f.currentInsurer || t('briefe.fillIn');
  const policyLine = f.policyNumber || '';

  return wrapLetter(`
    <div class="sender">${f.sender || fillHint(t)}</div>
    <div class="recipient">${f.currentInsurer ? esc(f.currentInsurer) + '<div class="placeholder">' + esc(t('briefe.fillIn')) + '</div>' : '<div class="placeholder">' + f.recipient + '</div>'}</div>
    <div class="date-line">${cityDate}</div>
    <div class="subject">${esc(t('briefe.insuranceSwitch.subject'))}</div>
    <div class="body-text">
      <p>${esc(t('briefe.insuranceSwitch.salutation'))}</p>
      <p>${esc(t('briefe.insuranceSwitch.body1', { insurer: insurerLine }))}</p>
      ${policyLine ? `<p>${esc(t('briefe.insuranceSwitch.policyRef', { number: policyLine }))}</p>` : ''}
      <p>${esc(t('briefe.insuranceSwitch.body2'))}</p>
      <p>${esc(t('briefe.insuranceSwitch.closing'))}</p>
    </div>
    <div class="signature">${getFullName(data.basis) ? esc(getFullName(data.basis)) : fillHint(t)}</div>
    <div class="legal-note">${esc(t('briefe.insuranceSwitch.legalNote'))}</div>
  `, t);
}

function getKkReklamationFields(data, t) {
  return {
    sender: senderBlock(data),
    recipient: recipientPlaceholder(t),
    insurer: data.versicherungen?.kkInsurer || '',
    filled: {
      name: !!getFullName(data.basis),
      insurer: !!data.versicherungen?.kkInsurer,
    },
  };
}

function generateKkReklamation(data, t, options = {}) {
  const f = getKkReklamationFields(data, t);
  const dateStr = today();
  // Klartext für t()-Interpolation (wird im ${esc(t(...))} einmal escaped) — kein
  // fillHint-HTML, das sonst als Tag-Text im Brief erschiene.
  const insurerLine = f.insurer || t('briefe.fillIn');

  // Vom Nutzer gewählte Belege (aus kkBelege). Datum/Betrag werden eingesetzt,
  // die strittige Differenz bleibt bewusst Selbst-Eintrag (haben wir nicht im Modell).
  const belege = Array.isArray(options.belege) ? options.belege : [];
  // Gewählte Beanstandungsgründe (aus dem geführten „was stimmt nicht"-Schritt).
  // Konkretisieren den Brief; ohne Auswahl bleibt der neutrale Ergänzungs-Platzhalter.
  const reasons = Array.isArray(options.reasons) ? options.reasons : [];
  let positionsHtml;
  if (belege.length) {
    const lines = belege.map(b => {
      const d = formatDate(b.datum) || t('briefe.fillIn');
      const a = formatAmount(b.betrag) || t('briefe.fillIn');
      return `<p>– ${esc(t('briefe.kkReklamation.position', { date: d, amount: a }))}</p>`;
    }).join('');
    positionsHtml = `<p>${esc(t('briefe.kkReklamation.body2intro'))}</p>${lines}`;
  } else {
    positionsHtml = `<p>${esc(t('briefe.kkReklamation.body2intro'))}</p><p>${esc(t('briefe.kkReklamation.positionScaffold'))}</p>`;
  }

  // Grund (WARUM die Position nicht stimmt): entweder die gewählten Gründe als
  // klare Liste — oder, nur wenn Belege ohne Grund-Auswahl vorliegen, der bisherige
  // Ergänzungs-Platzhalter. Ohne Belege deckt bereits der positionScaffold das
  // „was stimmt nicht" ab; body2detail wäre dann ein doppelter Platzhalter.
  let reasonHtml = '';
  if (reasons.length) {
    const items = reasons.map(r => `<p>– ${esc(t('briefe.kkReklamation.reasons.' + r))}</p>`).join('');
    reasonHtml = `<p>${esc(t('briefe.kkReklamation.reasonsIntro'))}</p>${items}`;
  } else if (belege.length) {
    reasonHtml = `<p>${esc(t('briefe.kkReklamation.body2detail'))}</p>`;
  }

  return wrapLetter(`
    <div class="sender">${f.sender || fillHint(t)}</div>
    <div class="recipient">${f.insurer ? esc(f.insurer) + '<div class="placeholder">' + esc(t('briefe.fillIn')) + '</div>' : '<div class="placeholder">' + f.recipient + '</div>'}</div>
    <div class="date-line">${dateStr}</div>
    <div class="subject">${esc(t('briefe.kkReklamation.subject'))}</div>
    <div class="body-text">
      <p>${esc(t('briefe.kkReklamation.salutation'))}</p>
      <p>${esc(t('briefe.kkReklamation.body1', { insurer: insurerLine }))}</p>
      ${positionsHtml}
      ${reasonHtml}
      <p>${esc(t('briefe.kkReklamation.body2request'))}</p>
      <p>${esc(t('briefe.kkReklamation.body3'))}</p>
      <p>${esc(t('briefe.kkReklamation.closing'))}</p>
    </div>
    <div class="signature">${getFullName(data.basis) ? esc(getFullName(data.basis)) : fillHint(t)}</div>
    <div class="legal-note">${esc(t('briefe.kkReklamation.legalNote'))}</div>
  `, t);
}

// ─── Lohn-Briefe ──────────────────────────────────────────

// (a) Lohn unter kantonalem Mindestlohn → höfliche Nachforderung an den Arbeitgeber.
// Rechnet den Befund autark; ohne belegbare Zahlen bleiben Felder zum Ausfüllen.
function generateWageClaim(data, t, options = {}) {
  const jobKey = options.job;
  const sender = senderBlock(data);
  const dateStr = today();
  const city = data.wohnen?.city || '';
  const cityDate = city ? `${esc(city)}, ${dateStr}` : dateStr;

  const job = getJob(data, jobKey);
  const employer = job.employer || t('briefe.fillIn');
  const kanton = data?.basis?.canton || '';
  const cantonName = kanton ? getCantonName(kanton, t) : t('briefe.fillIn');

  const befund = lohnBefund(data, jobKey);
  const hasFigures = befund && befund.status === 'unterMindestlohn';
  const lohnStunde = hasFigures ? befund.lohnStunde.toFixed(2) : t('briefe.fillIn');
  const mindestStunde = hasFigures ? befund.mindestStunde.toFixed(2) : t('briefe.fillIn');
  const differenz = hasFigures ? formatAmount(befund.differenzMonat) : t('briefe.fillIn');
  // Jahr inkl. führendem Leerzeichen + Klammern nur wenn belegt (kein doppeltes Leerzeichen).
  const jahr = hasFigures ? ` (${befund.jahr})` : '';

  const frist = getFristInfo('wageClaim').display;
  const refs = wageClaimRefs(kanton, t);

  return wrapLetter(`
    <div class="sender">${sender || fillHint(t)}</div>
    <div class="recipient">${employerRecipient(job, t)}</div>
    <div class="date-line">${cityDate}</div>
    <div class="subject">${esc(t('briefe.wageClaim.subject'))}</div>
    <div class="body-text">
      <p>${esc(t('briefe.wageClaim.salutation'))}</p>
      <p>${esc(t('briefe.wageClaim.body1', { employer, canton: cantonName }))}</p>
      <p>– ${esc(t('briefe.wageClaim.figuresLohn', { amount: lohnStunde }))}</p>
      <p>– ${esc(t('briefe.wageClaim.figuresMindest', { canton: cantonName, jahr, amount: mindestStunde }))}</p>
      <p>– ${esc(t('briefe.wageClaim.figuresDiff', { amount: differenz }))}</p>
      <p>${esc(t('briefe.wageClaim.body2request', { frist }))}</p>
      <p>${esc(t('briefe.wageClaim.closing'))}</p>
    </div>
    <div class="signature">${getFullName(data.basis) ? esc(getFullName(data.basis)) : fillHint(t)}</div>
    <div class="legal-note">${esc(t('briefe.wageClaim.legalNote', { canton: cantonName, gesetz: refs.gesetz, stelle: refs.stelle }))}</div>
  `, t);
}

// (b) Ausstehender Lohn → höfliche Mahnung. FIX A: der Weg führt NICHT über die
// Mindestlohn-Kontrollstelle, sondern über Schlichtungsbehörde/Arbeitsgericht (im
// legalNote/Reminder abgebildet).
//
// 🔴 Predeploy-Runde 8: Der Betrag war mit EINEM Monatslohn vorbefüllt, während der
// Zeitraum `{months}` ein „[bitte ergänzen]" blieb. Der Brief behauptete damit eine
// konkrete Summe für einen Zeitraum, den die App zugibt nicht zu kennen: Wer drei Monate
// schuldig ist (3 × 3'800 = 11'400), mahnte gedruckt CHF 3'800 ein — ein Drittel — und
// legte diese Zahl als eigene Forderung gegenüber dem Arbeitgeber fest.
// Zeitraum und Betrag hängen zusammen: ist der eine offen, ist es der andere auch.
// Das ist dieselbe `hasFigures`-Disziplin wie in `generateWageClaim`.
function generateUnpaidWage(data, t, options = {}) {
  const jobKey = options.job;
  const sender = senderBlock(data);
  const dateStr = today();
  const city = data.wohnen?.city || '';
  const cityDate = city ? `${esc(city)}, ${dateStr}` : dateStr;

  const job = getJob(data, jobKey);
  const months = t('briefe.fillIn');
  // Der Zeitraum ist unbekannt (Selbst-Eintrag) → der Betrag darf es auch bleiben.
  const betrag = t('briefe.fillIn');
  // Der Monatslohn als Anhalt — aber NUR wenn er nachweislich brutto ist.
  //
  // ⚠️ Predeploy-Runde 8, ZWEITE Batterie (Rechts-Prüfer, gegen den Fix selbst): Dieser
  // Satz wurde im selben Commit eingeführt, der die Netto/Brutto-Krankheit für `wageClaim`
  // heilte — und trug sie hier wieder ein. Er sagt „brutto CHF X", `generateUnpaidWage`
  // las `incomeType` aber nie. Bei netto erfasstem Lohn unterschrieb die Nutzerin damit
  // eine falsche Tatsachenbehauptung über die eigene Forderung, ZU IHREN UNGUNSTEN:
  // CHF 3'800 netto sind brutto ~4'300–4'400, und der Arbeitgeber kann den Satz als
  // Zugeständnis der Forderungshöhe lesen. Der ganze Brief ist brutto-gerahmt
  // („in Höhe von brutto CHF …"), während der Feld-Hinweis der App zu Netto rät.
  // Ohne belegtes Brutto steht hier lieber nichts — der Betrag ist ohnehin Selbst-Eintrag.
  const monatslohnHinweis = (job.lohn > 0 && job.einkommensart === 'brutto')
    ? t('briefe.unpaidWage.monthlyHint', { amount: formatAmount(job.lohn) })
    : '';
  const frist = getFristInfo('unpaidWage').display;

  return wrapLetter(`
    <div class="sender">${sender || fillHint(t)}</div>
    <div class="recipient">${employerRecipient(job, t)}</div>
    <div class="date-line">${cityDate}</div>
    <div class="subject">${esc(t('briefe.unpaidWage.subject'))}</div>
    <div class="body-text">
      <p>${esc(t('briefe.unpaidWage.salutation'))}</p>
      <p>${esc(t('briefe.unpaidWage.body1', { months, amount: betrag, frist }))}${monatslohnHinweis ? ' ' + esc(monatslohnHinweis) : ''}</p>
      <p>${esc(t('briefe.unpaidWage.closing'))}</p>
    </div>
    <div class="signature">${getFullName(data.basis) ? esc(getFullName(data.basis)) : fillHint(t)}</div>
    <div class="legal-note">${esc(t('briefe.unpaidWage.legalNote'))}</div>
  `, t);
}

// ─── Public API ───────────────────────────────────────────

const GENERATORS = {
  leaseTermination: generateLeaseTermination,
  addressChange: generateAddressChange,
  taxExtension: generateTaxExtension,
  insuranceSwitch: generateInsuranceSwitch,
  kkReklamation: generateKkReklamation,
  wageClaim: generateWageClaim,
  unpaidWage: generateUnpaidWage,
};

// Reine Funktion: Vorlage + Daten → HTML. Die wageClaim-RUHE (WAGECLAIM_BEREIT) ist eine
// Produkt-Entscheidung und wird an den UI-Grenzen durchgesetzt, wo Briefe ANGEBOTEN und
// VORGESCHAUT werden (`getLetterTemplates` + `briefCanRender` in `BriefGenerator.jsx`), nicht
// hier. So bleibt der Generator direkt testbar — die Korrektheit des Briefes bleibt für den
// Tag des Wiedereinschaltens abgesichert, statt hinter dem Flag zu verrosten.
export function generateLetter(templateKey, data, t, options = {}) {
  const gen = GENERATORS[templateKey];
  if (!gen) return '';
  return gen(data, t, options);
}

// Ob eine Vorlage tatsächlich angezeigt/vorgeschaut werden darf. Predeploy-Runde 8, dritte
// Prüfung: Die Vorlagen-Liste allein reichte nicht — die Vorschau in `BriefGenerator.jsx`
// baut aus `selected` direkt, und ein wiederhergestellter Deep-Link auf 'wageClaim' hätte den
// ruhenden Anschuldigungsbrief trotzdem gerendert. Diese Grenze schliesst das.
export function briefCanRender(templateKey) {
  if (templateKey === 'wageClaim') return WAGECLAIM_BEREIT;
  return true;
}

