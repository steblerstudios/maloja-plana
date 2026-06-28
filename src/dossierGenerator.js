// ─── Dossier Generator ────────────────────────────────────
// Pure functions that produce printable HTML from chapter data.
// No external dependencies. Offline-safe. Browser-native print.
//
// Usage:
//   generateLebensmappe(data, chapters, t, documents) → HTML string
//   getLebensMappePreview(data, chapters, t, documents) → structured data for React preview
//   generateNotfallDossier(data, chapters, t) → HTML string
//   getNotfallDossierPreview(data, chapters, t) → structured data for React preview
//   generateBehoerdenDossier(data, chapters, t, calculations) → HTML string
//   getBehoerdenDossierPreview(data, chapters, t, calculations) → structured data for React preview

import { getFullName } from './config/constants.js';

// ─── Helpers ──────────────────────────────────────────────

// Swiss CHF formatting (matches BudgetSync pattern)
function formatCHF(value) {
  const n = parseFloat(value);
  if (isNaN(n) || n === 0) return '';
  const rounded = Math.round(n);
  const abs = Math.abs(rounded);
  const formatted = abs >= 1000
    ? abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '’')
    : abs.toString();
  return (rounded < 0 ? '− ' : '') + 'CHF ' + formatted;
}

// Format date for display (DD.MM.YYYY — Swiss convention)
function formatDate(value) {
  if (!value) return '';
  // Handle YYYY-MM-DD format from date inputs
  const parts = value.split('-');
  if (parts.length === 3) {
    return parts[2] + '.' + parts[1] + '.' + parts[0];
  }
  return value;
}

// Resolve a select field value to its translated label
function resolveSelect(chapters, chapterKey, fieldKey, value) {
  if (!value) return '';
  const chapter = chapters.find(c => c.key === chapterKey);
  if (!chapter) return value;
  const field = chapter.fields.find(f => f.k === fieldKey);
  if (field && field.options) {
    const opt = field.options.find(o => o.value === value);
    return opt ? opt.label : value;
  }
  return value;
}

// Get field label from chapter definition
function fieldLabel(chapters, chapterKey, fieldKey) {
  const chapter = chapters.find(c => c.key === chapterKey);
  if (!chapter) return fieldKey;
  const field = chapter.fields.find(f => f.k === fieldKey);
  return field ? field.label : fieldKey;
}

// Escape HTML entities
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Lebensmappe Section Definitions ──────────────────────
// Curated fields per section — not a data dump.

function getSections(data, chapters, t) {
  const d = (chapterKey, fieldKey) => (data[chapterKey] || {})[fieldKey] || '';
  const sel = (chapterKey, fieldKey) => resolveSelect(chapters, chapterKey, fieldKey, d(chapterKey, fieldKey));
  const chf = (chapterKey, fieldKey) => formatCHF(d(chapterKey, fieldKey));
  const dt = (chapterKey, fieldKey) => formatDate(d(chapterKey, fieldKey));
  const lbl = (chapterKey, fieldKey) => fieldLabel(chapters, chapterKey, fieldKey);

  return [
    {
      key: 'basis',
      title: t('chapters.basis.title'),
      rows: [
        { label: t('lebensmappe.name'), value: getFullName(data.basis) },
        { label: lbl('basis', 'dateOfBirth'), value: dt('basis', 'dateOfBirth') },
        { label: lbl('basis', 'gender'), value: sel('basis', 'gender') },
        { label: lbl('basis', 'nationality'), value: sel('basis', 'nationality') },
        { label: lbl('basis', 'canton'), value: sel('basis', 'canton') },
        { label: lbl('basis', 'phone'), value: d('basis', 'phone') },
        { label: lbl('basis', 'email'), value: d('basis', 'email') },
        { label: lbl('basis', 'ahv'), value: d('basis', 'ahv') },
        { label: lbl('basis', 'maritalStatus'), value: sel('basis', 'maritalStatus') },
      ].filter(r => r.value),
    },
    {
      key: 'wohnen',
      title: t('chapters.wohnen.title'),
      rows: [
        { label: t('lebensmappe.address'), value: [d('wohnen', 'address'), [d('wohnen', 'postalCode'), d('wohnen', 'city')].filter(Boolean).join(' ')].filter(Boolean).join(', ') },
        { label: lbl('wohnen', 'moveInDate'), value: dt('wohnen', 'moveInDate') },
        { label: lbl('wohnen', 'rentAmount'), value: chf('wohnen', 'rentAmount') },
        { label: lbl('wohnen', 'utilities'), value: chf('wohnen', 'utilities') },
        { label: lbl('wohnen', 'landlord'), value: d('wohnen', 'landlord') },
        { label: lbl('wohnen', 'landlordPhone'), value: d('wohnen', 'landlordPhone') },
      ].filter(r => r.value),
    },
    {
      key: 'finanzen',
      title: t('chapters.finanzen.title'),
      rows: [
        { label: lbl('finanzen', 'monthlyIncome'), value: chf('finanzen', 'monthlyIncome') },
        { label: lbl('finanzen', 'employer'), value: d('finanzen', 'employer') },
        { label: lbl('finanzen', 'employmentType'), value: sel('finanzen', 'employmentType') },
        { label: lbl('finanzen', 'bankName'), value: d('finanzen', 'bankName') },
      ].filter(r => r.value),
    },
    {
      key: 'versicherungen',
      title: t('chapters.versicherungen.title'),
      rows: [
        { label: lbl('versicherungen', 'kkInsurer'), value: d('versicherungen', 'kkInsurer') },
        { label: lbl('versicherungen', 'kkModel'), value: sel('versicherungen', 'kkModel') },
        { label: lbl('versicherungen', 'kkPremium'), value: chf('versicherungen', 'kkPremium') },
        { label: lbl('versicherungen', 'franchise'), value: sel('versicherungen', 'franchise') },
        { label: lbl('versicherungen', 'bvgInsurer'), value: d('versicherungen', 'bvgInsurer') },
      ].filter(r => r.value),
    },
    {
      key: 'ausbildung',
      title: t('chapters.ausbildung.title'),
      rows: [
        { label: lbl('ausbildung', 'educationLevel'), value: sel('ausbildung', 'educationLevel') },
        { label: lbl('ausbildung', 'schoolName'), value: d('ausbildung', 'schoolName') },
        { label: lbl('ausbildung', 'employer'), value: d('ausbildung', 'employer') },
        { label: lbl('ausbildung', 'jobTitle'), value: d('ausbildung', 'jobTitle') },
        { label: lbl('ausbildung', 'employmentStart'), value: dt('ausbildung', 'employmentStart') },
        { label: lbl('ausbildung', 'workPermit'), value: sel('ausbildung', 'workPermit') },
        { label: lbl('ausbildung', 'languages'), value: d('ausbildung', 'languages') },
      ].filter(r => r.value),
    },
    {
      key: 'notfall',
      title: t('chapters.notfall.title'),
      rows: [
        { label: lbl('notfall', 'emergencyContact'), value: d('notfall', 'emergencyContact') },
        { label: lbl('notfall', 'emergencyPhone'), value: d('notfall', 'emergencyPhone') },
        { label: lbl('notfall', 'doctor'), value: d('notfall', 'doctor') },
        { label: lbl('notfall', 'doctorPhone'), value: d('notfall', 'doctorPhone') },
      ].filter(r => r.value),
    },
  ];
}

// ─── Preview Data (for React rendering) ──────────────────

export function getLebensMappePreview(data, chapters, t, documents) {
  const sections = getSections(data, chapters, t);
  const filledSections = sections.filter(s => s.rows.length > 0);
  const emptySections = sections.filter(s => s.rows.length === 0);
  const totalRows = sections.reduce((sum, s) => sum + s.rows.length, 0);

  // Document references
  const docRefs = (documents || []).map(doc => ({
    name: doc.fileName || doc.name || '',
    chapter: doc.chapter || '',
    type: doc.type || '',
  })).filter(d => d.name);

  return {
    name: getFullName(data.basis),
    sections: filledSections,
    emptySections,
    totalRows,
    docCount: docRefs.length,
    docRefs,
    generatedAt: new Date().toISOString(),
  };
}

// ─── Standalone HTML Generator (for print) ────────────────

export function generateLebensmappe(data, chapters, t, documents) {
  const sections = getSections(data, chapters, t);
  const name = getFullName(data.basis) || t('lebensmappe.untitled');
  const now = new Date();
  const dateStr = [
    String(now.getDate()).padStart(2, '0'),
    String(now.getMonth() + 1).padStart(2, '0'),
    now.getFullYear(),
  ].join('.');

  // Document references
  const docRefs = (documents || []).filter(d => d.fileName || d.name);

  // Build section HTML
  const sectionHtml = sections
    .filter(s => s.rows.length > 0)
    .map(s => `
      <div class="lm-section">
        <h2>${esc(s.title)}</h2>
        <table>
          ${s.rows.map(r => `
            <tr>
              <td class="lm-label">${esc(r.label)}</td>
              <td class="lm-value">${esc(r.value)}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    `).join('');

  // Document references section
  const docHtml = docRefs.length > 0 ? `
    <div class="lm-section">
      <h2>${esc(t('lebensmappe.documents'))}</h2>
      <ul class="lm-docs">
        ${docRefs.map(d => `<li>${esc(d.fileName || d.name)}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(t('lebensmappe.title'))} — ${esc(name)}</title>
  <style>
    /* ─── Screen + Print Base ─────────────────────── */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      font-size: 13px;
      line-height: 1.6;
      color: #1C1A17;
      background: #F5F2EE;
      padding: 40px 20px;
    }
    .lm-container {
      max-width: 640px;
      margin: 0 auto;
      background: #fff;
      border: 1px solid #DDD8D0;
      border-radius: 8px;
      padding: 40px 36px;
    }
    .lm-header {
      text-align: center;
      margin-bottom: 32px;
      padding-bottom: 20px;
      border-bottom: 1px solid #DDD8D0;
    }
    .lm-header h1 {
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.3px;
      margin-bottom: 4px;
    }
    .lm-header .lm-name {
      font-size: 15px;
      color: #6B6560;
      margin-bottom: 2px;
    }
    .lm-header .lm-date {
      font-size: 11px;
      color: #A89F94;
    }
    .lm-section {
      margin-bottom: 24px;
    }
    .lm-section h2 {
      font-size: 13px;
      font-weight: 600;
      color: #6B6560;
      letter-spacing: 0.3px;
      margin-bottom: 10px;
      padding-bottom: 4px;
      border-bottom: 1px solid #EAE5DD;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    tr { border-bottom: 1px solid #F0EDE8; }
    tr:last-child { border-bottom: none; }
    td { padding: 5px 0; vertical-align: top; }
    .lm-label {
      width: 45%;
      font-size: 12px;
      color: #6B6560;
    }
    .lm-value {
      font-size: 12px;
      font-weight: 500;
    }
    .lm-docs {
      list-style: none;
      padding: 0;
    }
    .lm-docs li {
      font-size: 12px;
      padding: 3px 0;
      color: #6B6560;
    }
    .lm-docs li::before {
      content: '\\25CB ';
      color: #A89F94;
    }
    .lm-footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #DDD8D0;
      text-align: center;
      font-size: 10px;
      color: #A89F94;
      line-height: 1.6;
    }
    .lm-print-btn {
      display: block;
      margin: 24px auto 0;
      padding: 10px 24px;
      background: #B8956A;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
    }
    .lm-print-btn:hover { opacity: 0.9; }

    /* ─── Print Overrides ─────────────────────────── */
    @media print {
      body { background: #fff; padding: 0; }
      .lm-container {
        border: none;
        border-radius: 0;
        padding: 0;
        max-width: none;
      }
      .lm-print-btn { display: none; }
      .lm-section { break-inside: avoid; }
      @page { margin: 2cm; size: A4; }
    }
  </style>
</head>
<body>
  <div class="lm-container">
    <div class="lm-header">
      <h1>${esc(t('lebensmappe.title'))}</h1>
      <div class="lm-name">${esc(name)}</div>
      <div class="lm-date">${esc(t('lebensmappe.generated', { date: dateStr }))}</div>
    </div>

    ${sectionHtml}
    ${docHtml}

    <div class="lm-footer">
      ${esc(t('lebensmappe.footerPrivacy'))}<br>
      ${esc(t('lebensmappe.footerCredit'))}
    </div>

    <button class="lm-print-btn" onclick="window.print()">
      ${esc(t('lebensmappe.printAction'))}
    </button>
  </div>
</body>
</html>`;
}

// ─── Notfall-Dossier Section Definitions ─────────────────
// Curated, reduced set — not a data dump. Focused on what
// someone else needs when they have to help.

function getNotfallSections(data, chapters, t) {
  const d = (chapterKey, fieldKey) => (data[chapterKey] || {})[fieldKey] || '';
  const sel = (chapterKey, fieldKey) => resolveSelect(chapters, chapterKey, fieldKey, d(chapterKey, fieldKey));
  const dt = (chapterKey, fieldKey) => formatDate(d(chapterKey, fieldKey));
  const lbl = (chapterKey, fieldKey) => fieldLabel(chapters, chapterKey, fieldKey);

  return [
    {
      key: 'person',
      title: t('notfallDossier.sectionPerson'),
      rows: [
        { label: t('lebensmappe.name'), value: getFullName(data.basis) },
        { label: lbl('basis', 'dateOfBirth'), value: dt('basis', 'dateOfBirth') },
        { label: lbl('basis', 'phone'), value: d('basis', 'phone') },
        { label: lbl('wohnen', 'address'), value: [d('wohnen', 'address'), [d('wohnen', 'postalCode'), d('wohnen', 'city')].filter(Boolean).join(' ')].filter(Boolean).join(', ') },
      ].filter(r => r.value),
    },
    {
      key: 'contact',
      title: t('notfallDossier.sectionContact'),
      rows: [
        { label: lbl('notfall', 'emergencyContact'), value: d('notfall', 'emergencyContact') },
        { label: lbl('notfall', 'emergencyPhone'), value: d('notfall', 'emergencyPhone') },
      ].filter(r => r.value),
    },
    {
      key: 'medical',
      title: t('notfallDossier.sectionMedical'),
      rows: [
        { label: lbl('notfall', 'bloodType'), value: sel('notfall', 'bloodType') },
        { label: lbl('notfall', 'allergies'), value: d('notfall', 'allergies') },
        { label: lbl('notfall', 'medications'), value: d('notfall', 'medications') },
        { label: lbl('notfall', 'chronicDiseases'), value: d('notfall', 'chronicDiseases') },
      ].filter(r => r.value),
    },
    {
      key: 'care',
      title: t('notfallDossier.sectionCare'),
      rows: [
        { label: lbl('notfall', 'doctor'), value: d('notfall', 'doctor') },
        { label: lbl('notfall', 'doctorPhone'), value: d('notfall', 'doctorPhone') },
        { label: lbl('notfall', 'hospital'), value: d('notfall', 'hospital') },
      ].filter(r => r.value),
    },
    {
      key: 'provision',
      title: t('notfallDossier.sectionProvision'),
      rows: [
        { label: lbl('notfall', 'organDonor'), value: sel('notfall', 'organDonor') },
        { label: lbl('notfall', 'patientenverfuegung'), value: sel('notfall', 'patientenverfuegung') },
        { label: lbl('notfall', 'vorsorgeauftrag'), value: sel('notfall', 'vorsorgeauftrag') },
        { label: lbl('notfall', 'bestattungswuensche'), value: sel('notfall', 'bestattungswuensche') },
      ].filter(r => r.value),
    },
    {
      key: 'insurance',
      title: t('notfallDossier.sectionInsurance'),
      rows: [
        { label: lbl('versicherungen', 'kkInsurer'), value: d('versicherungen', 'kkInsurer') },
        { label: lbl('versicherungen', 'kkCardNumber'), value: d('versicherungen', 'kkCardNumber') },
        { label: lbl('basis', 'ahv'), value: d('basis', 'ahv') },
      ].filter(r => r.value),
    },
  ];
}

// ─── Notfall Preview Data (for React rendering) ─────────

export function getNotfallDossierPreview(data, chapters, t) {
  const sections = getNotfallSections(data, chapters, t);
  const filledSections = sections.filter(s => s.rows.length > 0);
  const emptySections = sections.filter(s => s.rows.length === 0);

  return {
    name: getFullName(data.basis),
    sections: filledSections,
    emptySections,
    generatedAt: new Date().toISOString(),
  };
}

// ─── Notfall Standalone HTML Generator (for print) ──────

export function generateNotfallDossier(data, chapters, t) {
  const sections = getNotfallSections(data, chapters, t);
  const name = getFullName(data.basis) || t('notfallDossier.untitled');
  const now = new Date();
  const dateStr = [
    String(now.getDate()).padStart(2, '0'),
    String(now.getMonth() + 1).padStart(2, '0'),
    now.getFullYear(),
  ].join('.');

  const sectionHtml = sections
    .filter(s => s.rows.length > 0)
    .map(s => `
      <div class="nd-section">
        <h2>${esc(s.title)}</h2>
        <table>
          ${s.rows.map(r => `
            <tr>
              <td class="nd-label">${esc(r.label)}</td>
              <td class="nd-value">${esc(r.value)}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    `).join('');

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(t('notfallDossier.title'))} — ${esc(name)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      font-size: 13px;
      line-height: 1.6;
      color: #1C1A17;
      background: #F5F2EE;
      padding: 40px 20px;
    }
    .nd-container {
      max-width: 640px;
      margin: 0 auto;
      background: #fff;
      border: 1px solid #DDD8D0;
      border-radius: 8px;
      padding: 40px 36px;
    }
    .nd-header {
      text-align: center;
      margin-bottom: 32px;
      padding-bottom: 20px;
      border-bottom: 1px solid #DDD8D0;
    }
    .nd-header h1 {
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.3px;
      margin-bottom: 4px;
    }
    .nd-header .nd-name {
      font-size: 15px;
      color: #6B6560;
      margin-bottom: 2px;
    }
    .nd-header .nd-date {
      font-size: 11px;
      color: #A89F94;
    }
    .nd-privacy {
      background: #F5F2EE;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 24px;
      font-size: 11px;
      color: #6B6560;
      line-height: 1.5;
    }
    .nd-section {
      margin-bottom: 24px;
    }
    .nd-section h2 {
      font-size: 13px;
      font-weight: 600;
      color: #6B6560;
      letter-spacing: 0.3px;
      margin-bottom: 10px;
      padding-bottom: 4px;
      border-bottom: 1px solid #EAE5DD;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    tr { border-bottom: 1px solid #F0EDE8; }
    tr:last-child { border-bottom: none; }
    td { padding: 5px 0; vertical-align: top; }
    .nd-label {
      width: 45%;
      font-size: 12px;
      color: #6B6560;
    }
    .nd-value {
      font-size: 12px;
      font-weight: 500;
    }
    .nd-footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #DDD8D0;
      text-align: center;
      font-size: 10px;
      color: #A89F94;
      line-height: 1.6;
    }
    .nd-print-btn {
      display: block;
      margin: 24px auto 0;
      padding: 10px 24px;
      background: #B8956A;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
    }
    .nd-print-btn:hover { opacity: 0.9; }

    @media print {
      body { background: #fff; padding: 0; }
      .nd-container {
        border: none;
        border-radius: 0;
        padding: 0;
        max-width: none;
      }
      .nd-print-btn { display: none; }
      .nd-section { break-inside: avoid; }
      @page { margin: 2cm; size: A4; }
    }
  </style>
</head>
<body>
  <div class="nd-container">
    <div class="nd-header">
      <h1>${esc(t('notfallDossier.title'))}</h1>
      <div class="nd-name">${esc(name)}</div>
      <div class="nd-date">${esc(t('notfallDossier.generated', { date: dateStr }))}</div>
    </div>

    <div class="nd-privacy">
      ${esc(t('notfallDossier.privacyNote'))}
    </div>

    ${sectionHtml}

    <div class="nd-footer">
      ${esc(t('notfallDossier.footerPrivacy'))}<br>
      ${esc(t('notfallDossier.footerCredit'))}
    </div>

    <button class="nd-print-btn" onclick="window.print()">
      ${esc(t('notfallDossier.printAction'))}
    </button>
  </div>
</body>
</html>`;
}

// ─── Behörden-Dossier ───────────────────────────────────
// Comprehensive dossier for meetings with authorities:
// personal data + all calculation results (Sozialhilfe, IPV, Steuern).

function getBehoerdenSections(data, chapters, t, calculations) {
  const d = (chapterKey, fieldKey) => (data[chapterKey] || {})[fieldKey] || '';
  const sel = (chapterKey, fieldKey) => resolveSelect(chapters, chapterKey, fieldKey, d(chapterKey, fieldKey));
  const chf = (chapterKey, fieldKey) => formatCHF(d(chapterKey, fieldKey));
  const dt = (chapterKey, fieldKey) => formatDate(d(chapterKey, fieldKey));
  const lbl = (chapterKey, fieldKey) => fieldLabel(chapters, chapterKey, fieldKey);
  const { sozialhilfe, ipv, el, tax } = calculations || {};

  const sections = [
    {
      key: 'person',
      title: t('behoerdenDossier.sectionPerson'),
      rows: [
        { label: t('lebensmappe.name'), value: getFullName(data.basis) },
        { label: lbl('basis', 'dateOfBirth'), value: dt('basis', 'dateOfBirth') },
        { label: lbl('basis', 'ahv'), value: d('basis', 'ahv') },
        { label: lbl('basis', 'nationality'), value: sel('basis', 'nationality') },
        { label: lbl('basis', 'maritalStatus'), value: sel('basis', 'maritalStatus') },
        { label: lbl('basis', 'canton'), value: sel('basis', 'canton') },
        { label: t('lebensmappe.address'), value: [d('wohnen', 'address'), [d('wohnen', 'postalCode'), d('wohnen', 'city')].filter(Boolean).join(' ')].filter(Boolean).join(', ') },
        { label: lbl('basis', 'phone'), value: d('basis', 'phone') },
        { label: lbl('basis', 'email'), value: d('basis', 'email') },
      ].filter(r => r.value),
    },
    {
      key: 'finanzen',
      title: t('behoerdenDossier.sectionFinanzen'),
      rows: [
        { label: lbl('finanzen', 'monthlyIncome'), value: chf('finanzen', 'monthlyIncome') },
        { label: lbl('finanzen', 'employmentType'), value: sel('finanzen', 'employmentType') },
        { label: lbl('finanzen', 'employer'), value: d('finanzen', 'employer') },
        { label: lbl('wohnen', 'rentAmount'), value: chf('wohnen', 'rentAmount') },
        { label: lbl('versicherungen', 'kkPremium'), value: chf('versicherungen', 'kkPremium') },
        { label: lbl('versicherungen', 'franchise'), value: sel('versicherungen', 'franchise') },
        { label: lbl('finanzen', 'securitiesValue'), value: chf('finanzen', 'securitiesValue') },
        { label: lbl('finanzen', 'otherAssets'), value: chf('finanzen', 'otherAssets') },
      ].filter(r => r.value),
    },
  ];

  if (sozialhilfe) {
    const sRows = [
      { label: t('sozialhilfe.basicNeeds'), value: formatCHF(sozialhilfe.grundbedarf) },
      { label: t('sozialhilfe.housingCosts'), value: formatCHF(sozialhilfe.effectiveRent) },
      { label: t('sozialhilfe.healthInsurance'), value: formatCHF(sozialhilfe.effectiveKK) },
      { label: t('sozialhilfe.totalNeeds'), value: formatCHF(sozialhilfe.totalBedarf), bold: true },
      { label: t('sozialhilfe.deductIncome'), value: '− ' + formatCHF(sozialhilfe.income) },
      { label: t('sozialhilfe.deficit'), value: formatCHF(sozialhilfe.deficit) + t('common.perMonth'), bold: true },
    ].filter(r => r.value);
    const status = sozialhilfe.eligible
      ? t('sozialhilfe.entitled')
      : t('sozialhilfe.notEntitled');
    sections.push({
      key: 'sozialhilfe',
      title: t('behoerdenDossier.sectionSozialhilfe'),
      rows: sRows,
      status,
      statusColor: sozialhilfe.eligible ? '#7A8B6F' : '#6B6560',
    });
  }

  if (ipv) {
    const iRows = [];
    if (ipv.eligible) {
      iRows.push({ label: t('premium.monthlySubsidy'), value: formatCHF(ipv.amount) + t('common.perMonth'), bold: true });
      iRows.push({ label: t('premium.annualSubsidy'), value: formatCHF(ipv.amount * 12) + t('common.perYear') });
    }
    const status = ipv.eligible
      ? t('premium.eligible')
      : t('premium.notEligible');
    sections.push({
      key: 'ipv',
      title: t('behoerdenDossier.sectionIPV'),
      rows: iRows,
      status,
      statusColor: ipv.eligible ? '#7A8B6F' : '#6B6560',
    });
  }

  if (el) {
    sections.push({
      key: 'el',
      title: t('behoerdenDossier.sectionEL'),
      rows: [],
      status: el.eligible ? t('sozialhilfe.elPossible') : t('behoerdenDossier.elNotApplicable'),
      statusColor: el.eligible ? '#7A8B6F' : '#6B6560',
    });
  }

  if (tax && tax.total > 0) {
    const taxRows = [
      { label: t('tax.taxableIncome'), value: formatCHF(tax.taxableIncome) },
      { label: t('tax.federalTax'), value: formatCHF(tax.total) + t('common.perYear') },
    ];
    if (tax.kantonal) {
      taxRows.push(
        { label: t('tax.cantonalAndMunicipal') + ' (' + tax.kantonal.hauptort + ')', value: formatCHF(tax.kantonal.kantonalUndGemeinde) + t('common.perYear') },
        { label: t('tax.totalEstimate'), value: formatCHF(tax.kantonal.total) + t('common.perYear'), bold: true },
      );
    } else {
      taxRows[taxRows.length - 1].bold = true;
    }
    sections.push({
      key: 'steuern',
      title: t('behoerdenDossier.sectionSteuern'),
      rows: taxRows.filter(r => r.value),
    });
  }

  try {
    const checklistRaw = localStorage.getItem('or5_behoerden_checklist');
    if (checklistRaw) {
      const checked = JSON.parse(checklistRaw);
      const items = [
        { id: 'betreibungsauszug', key: 'checklist.betreibungsauszug' },
        { id: 'steuererklaerung', key: 'checklist.steuererklaerung' },
        { id: 'wohnsitzbestaetigung', key: 'checklist.wohnsitzbestaetigung' },
        { id: 'ausweisRenewal', key: 'checklist.ausweisRenewal' },
        { id: 'strafregisterauszug', key: 'checklist.strafregisterauszug' },
        { id: 'patientenverfuegung', key: 'checklist.patientenverfuegung' },
      ];
      const rows = items.map(item => ({
        label: t(item.key),
        value: checked[item.id] ? '✓' : '—',
      }));
      const done = items.filter(i => checked[i.id]).length;
      if (done > 0) {
        sections.push({
          key: 'checklist',
          title: t('checklist.title') + ' (' + done + '/' + items.length + ')',
          rows,
        });
      }
    }
  } catch {}

  return sections;
}

export function generateBehoerdenJSON(data, calculations) {
  const basis = data.basis || {};
  const finanzen = data.finanzen || {};
  const wohnen = data.wohnen || {};
  const versicherungen = data.versicherungen || {};
  const { sozialhilfe, ipv, el, tax } = calculations || {};

  const dossier = {
    schema: 'maloja-plana-dossier',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    person: {
      firstName: basis.firstName || '',
      lastName: basis.lastName || '',
      dateOfBirth: basis.dateOfBirth || '',
      ahvNumber: basis.ahv || '',
      nationality: basis.nationality || '',
      civilStatus: basis.maritalStatus || '',
      phone: basis.phone || '',
      email: basis.email || '',
    },
    address: {
      street: wohnen.address || '',
      postalCode: wohnen.postalCode || '',
      city: wohnen.city || '',
      canton: basis.canton || '',
      moveInDate: wohnen.moveInDate || '',
    },
    finances: {
      monthlyIncome: parseFloat(finanzen.monthlyIncome) || 0,
      employmentType: finanzen.employmentType || '',
      employer: finanzen.employer || '',
      rent: parseFloat(wohnen.rentAmount) || 0,
      utilities: parseFloat(wohnen.utilities) || 0,
      securities: parseFloat(finanzen.securitiesValue) || 0,
      otherAssets: parseFloat(finanzen.otherAssets) || 0,
    },
    insurance: {
      insurer: versicherungen.kkInsurer || '',
      model: versicherungen.kkModel || '',
      premium: parseFloat(versicherungen.kkPremium) || 0,
      franchise: versicherungen.franchise || '',
    },
    calculations: {},
  };

  if (sozialhilfe) {
    dossier.calculations.sozialhilfe = {
      eligible: !!sozialhilfe.eligible,
      grundbedarf: sozialhilfe.grundbedarf || 0,
      effectiveRent: sozialhilfe.effectiveRent || 0,
      rentLimit: sozialhilfe.rentLimit || 0,
      effectiveKK: sozialhilfe.effectiveKK || 0,
      totalBedarf: sozialhilfe.totalBedarf || 0,
      income: sozialhilfe.income || 0,
      deficit: sozialhilfe.deficit || 0,
      householdSize: sozialhilfe.householdSize || 1,
    };
  }
  if (ipv) {
    dossier.calculations.ipv = {
      eligible: !!ipv.eligible,
      monthlyAmount: ipv.amount || 0,
      annualAmount: (ipv.amount || 0) * 12,
    };
  }
  if (el) {
    dossier.calculations.el = { eligible: !!el.eligible };
  }
  if (tax && tax.total > 0) {
    dossier.calculations.tax = {
      taxableIncome: tax.taxableIncome || 0,
      federalTax: tax.total || 0,
      cantonalAndMunicipal: tax.kantonal ? tax.kantonal.kantonalUndGemeinde : 0,
      totalEstimate: tax.kantonal ? tax.kantonal.total : tax.total,
    };
  }

  return dossier;
}

export function getBehoerdenDossierPreview(data, chapters, t, calculations) {
  const sections = getBehoerdenSections(data, chapters, t, calculations);
  const filledSections = sections.filter(s => s.rows.length > 0 || s.status);

  return {
    name: getFullName(data.basis),
    sections: filledSections,
    generatedAt: new Date().toISOString(),
  };
}

export function generateBehoerdenDossier(data, chapters, t, calculations) {
  const sections = getBehoerdenSections(data, chapters, t, calculations);
  const name = getFullName(data.basis) || t('lebensmappe.untitled');
  const now = new Date();
  const dateStr = [
    String(now.getDate()).padStart(2, '0'),
    String(now.getMonth() + 1).padStart(2, '0'),
    now.getFullYear(),
  ].join('.');

  const sectionHtml = sections
    .filter(s => s.rows.length > 0 || s.status)
    .map(s => `
      <div class="bd-section">
        <h2>${esc(s.title)}</h2>
        ${s.status ? `<div class="bd-status" style="color:${s.statusColor || '#6B6560'}">${esc(s.status)}</div>` : ''}
        ${s.rows.length > 0 ? `<table>
          ${s.rows.map(r => `
            <tr>
              <td class="bd-label">${esc(r.label)}</td>
              <td class="bd-value${r.bold ? ' bd-bold' : ''}">${esc(r.value)}</td>
            </tr>
          `).join('')}
        </table>` : ''}
      </div>
    `).join('');

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(t('behoerdenDossier.title'))} — ${esc(name)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      font-size: 13px;
      line-height: 1.6;
      color: #1C1A17;
      background: #F5F2EE;
      padding: 40px 20px;
    }
    .bd-container {
      max-width: 640px;
      margin: 0 auto;
      background: #fff;
      border: 1px solid #DDD8D0;
      border-radius: 8px;
      padding: 40px 36px;
    }
    .bd-header {
      text-align: center;
      margin-bottom: 32px;
      padding-bottom: 20px;
      border-bottom: 1px solid #DDD8D0;
    }
    .bd-header h1 {
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.3px;
      margin-bottom: 4px;
    }
    .bd-header .bd-name {
      font-size: 15px;
      color: #6B6560;
      margin-bottom: 2px;
    }
    .bd-header .bd-date {
      font-size: 11px;
      color: #A89F94;
    }
    .bd-section {
      margin-bottom: 24px;
    }
    .bd-section h2 {
      font-size: 13px;
      font-weight: 600;
      color: #6B6560;
      letter-spacing: 0.3px;
      margin-bottom: 10px;
      padding-bottom: 4px;
      border-bottom: 1px solid #EAE5DD;
    }
    .bd-status {
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    table { width: 100%; border-collapse: collapse; }
    tr { border-bottom: 1px solid #F0EDE8; }
    tr:last-child { border-bottom: none; }
    td { padding: 5px 0; vertical-align: top; }
    .bd-label { width: 55%; font-size: 12px; color: #6B6560; }
    .bd-value { font-size: 12px; font-weight: 500; text-align: right; }
    .bd-bold { font-weight: 700; }
    .bd-disclaimer {
      background: #F5F2EE;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 24px;
      font-size: 11px;
      color: #6B6560;
      line-height: 1.5;
    }
    .bd-footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #DDD8D0;
      text-align: center;
      font-size: 10px;
      color: #A89F94;
      line-height: 1.6;
    }
    .bd-print-btn {
      display: block;
      margin: 24px auto 0;
      padding: 10px 24px;
      background: #B8956A;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
    }
    .bd-print-btn:hover { opacity: 0.9; }

    @media print {
      body { background: #fff; padding: 0; }
      .bd-container { border: none; border-radius: 0; padding: 0; max-width: none; }
      .bd-print-btn { display: none; }
      .bd-section { break-inside: avoid; }
      @page { margin: 2cm; size: A4; }
    }
  </style>
</head>
<body>
  <div class="bd-container">
    <div class="bd-header">
      <h1>${esc(t('behoerdenDossier.title'))}</h1>
      <div class="bd-name">${esc(name)}</div>
      <div class="bd-date">${esc(t('behoerdenDossier.generated', { date: dateStr }))}</div>
    </div>

    <div class="bd-disclaimer">
      ${esc(t('behoerdenDossier.disclaimer'))}
    </div>

    ${sectionHtml}

    <div class="bd-footer">
      ${esc(t('behoerdenDossier.footerPrivacy'))}<br>
      ${esc(t('behoerdenDossier.footerCredit'))}
    </div>

    <button class="bd-print-btn" onclick="window.print()">
      ${esc(t('behoerdenDossier.printAction'))}
    </button>
  </div>
</body>
</html>`;
}
