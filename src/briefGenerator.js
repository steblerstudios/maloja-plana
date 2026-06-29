// ─── Brief-Generator ──────────────────────────────────────
// Pure functions that produce printable Swiss letter HTML.
// Same approach as dossierGenerator: offline-safe, browser-native print.
//
// Usage:
//   getLetterTemplates(t) → array of template definitions
//   generateLetter(templateKey, data, t) → HTML string for print

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
  .sender { margin-bottom: 8mm; font-size: 10pt; }
  .recipient { margin-bottom: 12mm; min-height: 30mm; }
  .recipient .placeholder { color: #888; font-style: italic; border-bottom: 1px dashed #ccc; padding-bottom: 2px; }
  .date-line { text-align: right; margin-bottom: 10mm; }
  .subject { font-weight: 600; margin-bottom: 8mm; font-size: 12pt; }
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
    <div class="signature">${f.sender || fillHint(t)}</div>
    <div class="legal-note">${esc(t('briefe.leaseTermination.legalNote'))}</div>
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
    <div class="signature">${f.sender || fillHint(t)}</div>
  `, t);
}

function generateInsuranceSwitch(data, t) {
  const f = getInsuranceSwitchFields(data, t);
  const dateStr = today();
  const cityDate = f.city ? `${esc(f.city)}, ${dateStr}` : dateStr;
  const insurerLine = f.currentInsurer ? esc(f.currentInsurer) : fillHint(t);
  const policyLine = f.policyNumber ? esc(f.policyNumber) : '';

  return wrapLetter(`
    <div class="sender">${f.sender || fillHint(t)}</div>
    <div class="recipient"><div class="placeholder">${f.recipient}</div></div>
    <div class="date-line">${cityDate}</div>
    <div class="subject">${esc(t('briefe.insuranceSwitch.subject'))}</div>
    <div class="body-text">
      <p>${esc(t('briefe.insuranceSwitch.salutation'))}</p>
      <p>${esc(t('briefe.insuranceSwitch.body1', { insurer: insurerLine }))}</p>
      ${policyLine ? `<p>${esc(t('briefe.insuranceSwitch.policyRef', { number: policyLine }))}</p>` : ''}
      <p>${esc(t('briefe.insuranceSwitch.body2'))}</p>
      <p>${esc(t('briefe.insuranceSwitch.closing'))}</p>
    </div>
    <div class="signature">${f.sender || fillHint(t)}</div>
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

function generateKkReklamation(data, t) {
  const f = getKkReklamationFields(data, t);
  const dateStr = today();
  const insurerLine = f.insurer ? esc(f.insurer) : fillHint(t);

  return wrapLetter(`
    <div class="sender">${f.sender || fillHint(t)}</div>
    <div class="recipient"><div class="placeholder">${f.recipient}</div></div>
    <div class="date-line">${dateStr}</div>
    <div class="subject">${esc(t('briefe.kkReklamation.subject'))}</div>
    <div class="body-text">
      <p>${esc(t('briefe.kkReklamation.salutation'))}</p>
      <p>${esc(t('briefe.kkReklamation.body1', { insurer: insurerLine }))}</p>
      <p>${esc(t('briefe.kkReklamation.body2'))}</p>
      <p>${esc(t('briefe.kkReklamation.body3'))}</p>
      <p>${esc(t('briefe.kkReklamation.closing'))}</p>
    </div>
    <div class="signature">${f.sender || fillHint(t)}</div>
    <div class="legal-note">${esc(t('briefe.kkReklamation.legalNote'))}</div>
  `, t);
}

// ─── Public API ───────────────────────────────────────────

const GENERATORS = {
  leaseTermination: generateLeaseTermination,
  taxExtension: generateTaxExtension,
  insuranceSwitch: generateInsuranceSwitch,
  kkReklamation: generateKkReklamation,
};

export function generateLetter(templateKey, data, t) {
  const gen = GENERATORS[templateKey];
  if (!gen) return '';
  return gen(data, t);
}

