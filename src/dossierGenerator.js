// ─── Dossier Generator ────────────────────────────────────
// Pure functions that produce printable HTML from chapter data.
// No external dependencies. Offline-safe. Browser-native print.
//
// Usage:
//   generateLebensmappe(data, chapters, t, documents) → HTML string
//   getLebensMappePreview(data, chapters, t, documents) → structured data for React preview

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
