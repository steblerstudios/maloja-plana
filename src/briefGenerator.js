// ─── Brief-Generator ──────────────────────────────────────
// Pure functions that produce printable Swiss letter HTML.
// Same approach as dossierGenerator: offline-safe, browser-native print.
//
// Usage:
//   getLetterTemplates(t) → array of template definitions
//   generateLetter(templateKey, data, t, options) → HTML string for print
//     options.belege (optional) → für kkReklamation: gewählte kkBelege ({datum,betrag})

import { getFullName } from './config/constants.js';

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
  return [name, street, city].filter(Boolean).join('<br>');
}

function recipientPlaceholder(t) {
  return esc(t('briefe.recipientPlaceholder'));
}

// ─── Template definitions ─────────────────────────────────

export function getLetterTemplates(t) {
  return [
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
  ];
}

// ─── Field extraction helpers ─────────────────────────────

function getLeaseTerminationFields(data, t) {
  const moveDate = data.wohnen?.moveInDate || '';
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
  @media print { body { padding: 0; } .no-print { display: none; } }
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
  let positionsHtml;
  if (belege.length) {
    const lines = belege.map(b => {
      const d = formatDate(b.datum) || t('briefe.fillIn');
      const a = formatAmount(b.betrag) || t('briefe.fillIn');
      return `<p>– ${esc(t('briefe.kkReklamation.position', { date: d, amount: a }))}</p>`;
    }).join('');
    positionsHtml = `<p>${esc(t('briefe.kkReklamation.body2intro'))}</p>${lines}<p>${esc(t('briefe.kkReklamation.body2detail'))}</p>`;
  } else {
    positionsHtml = `<p>${esc(t('briefe.kkReklamation.body2intro'))}</p><p>${esc(t('briefe.kkReklamation.positionScaffold'))}</p>`;
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
      <p>${esc(t('briefe.kkReklamation.body2request'))}</p>
      <p>${esc(t('briefe.kkReklamation.body3'))}</p>
      <p>${esc(t('briefe.kkReklamation.closing'))}</p>
    </div>
    <div class="signature">${getFullName(data.basis) ? esc(getFullName(data.basis)) : fillHint(t)}</div>
    <div class="legal-note">${esc(t('briefe.kkReklamation.legalNote'))}</div>
  `, t);
}

// ─── Public API ───────────────────────────────────────────

const GENERATORS = {
  leaseTermination: generateLeaseTermination,
  addressChange: generateAddressChange,
  taxExtension: generateTaxExtension,
  insuranceSwitch: generateInsuranceSwitch,
  kkReklamation: generateKkReklamation,
};

export function generateLetter(templateKey, data, t, options = {}) {
  const gen = GENERATORS[templateKey];
  if (!gen) return '';
  return gen(data, t, options);
}

