// ─── MirrorCards — Living Mirror Layer ─────────────────────
// Renders life sentences and mirror cards for chapters.
// Pure render component — no state, no side effects.
// Uses React.createElement, inline styles, palette-based.
//
// Phase 3B: Transforms data-collection chapters into
// living spaces that reflect a person's situation.

import React from 'react';
import { getCantonName } from './config/cantonalData.js';
import { text, weight, space, radius, leading } from './config/tokens.js';

// ─── Data helpers ──────────────────────────────────────────

function hasMinData(chapterKey, data) {
  if (chapterKey === 'basis') return Boolean(data.firstName);
  if (chapterKey === 'wohnen') return Boolean(data.address || data.city);
  if (chapterKey === 'finanzen') return Boolean(data.monthlyIncome);
  return false;
}

function formatDate(dateStr, t) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return null;
  }
}

function birthYear(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).getFullYear();
  } catch {
    return null;
  }
}

function householdText(data, t) {
  const household = data.household;
  if (!household || typeof household !== 'object') return null;

  const adults = Math.max(1, Number(household.adults) || 1);
  const children = Array.isArray(household.children) ? household.children : [];

  if (children.length === 0) {
    if (adults === 1) return t('mirror.basis.householdAlone');
    return t('mirror.basis.householdAdults', { count: String(adults) });
  }

  const ages = children.map(c => c.age).join(', ');
  if (children.length === 1) {
    return t('mirror.basis.householdWithChild', { count: String(adults), age: ages });
  }
  return t('mirror.basis.householdWithChildren', {
    count: String(adults),
    childCount: String(children.length),
    ages: ages,
  });
}

function maritalLabel(value, t) {
  if (!value) return null;
  return t('chapters.basis.fields.maritalStatus.options.' + value) || value;
}

// ─── Life sentence builders ────────────────────────────────

function buildBasisSentence(data, t) {
  const parts = [];
  const name = [(data.firstName || ''), (data.lastName || '')].filter(Boolean).join(' ');
  if (!name) return null;

  const year = birthYear(data.dateOfBirth);
  const canton = data.canton ? getCantonName(data.canton, t) : null;
  const marital = maritalLabel(data.maritalStatus, t);
  const hh = householdText(data, t);

  // Build sentence progressively
  if (year && canton) {
    parts.push(name + ', ' + t('mirror.basis.born', { year: String(year) }) + ', ' + t('mirror.basis.livingIn', { canton: canton }) + '.');
  } else if (canton) {
    parts.push(name + ', ' + t('mirror.basis.livingIn', { canton: canton }) + '.');
  } else {
    parts.push(name + '.');
  }

  // Second sentence: family situation
  const familyParts = [marital, hh].filter(Boolean);
  if (familyParts.length > 0) {
    const familySentence = familyParts.join(', ');
    parts.push(familySentence.charAt(0).toUpperCase() + familySentence.slice(1) + '.');
  }

  return parts.join(' ');
}

// ─── Wohnen ────────────────────────────────────────────────

function formatCHF(value) {
  const num = Number(value);
  if (!num || isNaN(num)) return null;
  return "CHF " + num.toLocaleString('de-CH');
}

function calcDuration(moveInDate, t) {
  if (!moveInDate) return null;
  try {
    const start = new Date(moveInDate);
    if (isNaN(start.getTime())) return null;
    const now = new Date();
    const totalMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    if (totalMonths < 0) return null;
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    if (years === 0 && months === 0) return t('mirror.wohnen.durationUnder1');
    if (years === 0) return t('mirror.wohnen.durationMonths', { months: String(months) });
    if (months === 0) return t('mirror.wohnen.durationYears', { years: String(years) });
    return t('mirror.wohnen.durationFull', { years: String(years), months: String(months) });
  } catch {
    return null;
  }
}

function addressLine(data) {
  const parts = [];
  if (data.address) parts.push(data.address);
  const plzCity = [(data.postalCode || ''), (data.city || '')].filter(Boolean).join(' ');
  if (plzCity) parts.push(plzCity);
  return parts.length > 0 ? parts.join(', ') : null;
}

function buildWohnenSentence(data, t) {
  const addr = addressLine(data);
  if (!addr) return null;

  const parts = [];

  // First part: address + optional duration
  const duration = calcDuration(data.moveInDate, t);
  if (duration) {
    parts.push(addr + '. ' + t('mirror.wohnen.since', { duration: duration }) + '.');
  } else {
    parts.push(addr + '.');
  }

  // Second part: costs
  const rent = formatCHF(data.rentAmount);
  const utils = formatCHF(data.utilities);
  if (rent && utils) {
    parts.push(t('mirror.wohnen.rentAndUtils', { rent: rent, utilities: utils }) + '.');
  } else if (rent) {
    parts.push(t('mirror.wohnen.rentOnly', { rent: rent }) + '.');
  }

  // Third part: landlord
  if (data.landlord) {
    parts.push(t('mirror.wohnen.landlordLabel') + ': ' + data.landlord + '.');
  }

  return parts.join(' ');
}

// ─── Finanzen ──────────────────────────────────────────────

function sumExpenses(data, allData) {
  const fields = ['monthlyTax', 'groceries', 'communication', 'mobility', 'otherInsurance'];
  let sum = 0;
  fields.forEach(k => { sum += Number(data[k]) || 0; });
  // Cross-chapter: rent + utilities from wohnen
  sum += Number(allData?.wohnen?.rentAmount) || 0;
  sum += Number(allData?.wohnen?.utilities) || 0;
  // Cross-chapter: KK premium from versicherungen
  sum += Number(allData?.versicherungen?.kkPremium) || 0;
  return sum;
}

function employmentLabel(value, t) {
  if (!value) return null;
  return t('chapters.finanzen.fields.employmentType.options.' + value) || value;
}

function buildFinanzenSentence(data, allData, t) {
  const income = formatCHF(data.monthlyIncome);
  if (!income) return null;

  const parts = [];

  // First part: income + employer
  if (data.employer) {
    parts.push(t('mirror.finanzen.incomeAt', { income: income, employer: data.employer }) + '.');
  } else {
    parts.push(t('mirror.finanzen.incomeOnly', { income: income }) + '.');
  }

  // Second part: recorded expenses
  const expSum = sumExpenses(data, allData);
  if (expSum > 0) {
    parts.push(t('mirror.finanzen.expensesRecorded', { amount: formatCHF(expSum) }) + '.');
  }

  // Third part: loans (only if > 0)
  const loans = Number(data.loans) || 0;
  if (loans > 0) {
    parts.push(t('mirror.finanzen.loansOpen', { amount: formatCHF(loans) }) + '.');
  }

  return parts.join(' ');
}

function buildLifeSentence(chapterKey, data, allData, t) {
  if (chapterKey === 'basis') return buildBasisSentence(data, t);
  if (chapterKey === 'wohnen') return buildWohnenSentence(data, t);
  if (chapterKey === 'finanzen') return buildFinanzenSentence(data, allData, t);
  return null;
}

// ─── Mirror section builders ───────────────────────────────

function buildBasisSections(data, t) {
  const sections = [];

  // Section: Person
  const personRows = [];
  const fullName = [(data.firstName || ''), (data.lastName || '')].filter(Boolean).join(' ');
  if (fullName) personRows.push({ label: t('mirror.basis.name'), value: fullName });
  if (data.dateOfBirth) personRows.push({ label: t('mirror.basis.dateOfBirth'), value: formatDate(data.dateOfBirth, t) });
  if (data.canton) personRows.push({ label: t('mirror.basis.canton'), value: getCantonName(data.canton, t) });
  if (data.maritalStatus) personRows.push({ label: t('mirror.basis.maritalStatus'), value: maritalLabel(data.maritalStatus, t) });

  const hh = householdText(data, t);
  if (hh) personRows.push({ label: t('mirror.basis.household'), value: hh });

  if (personRows.length >= 2) {
    sections.push({ title: t('mirror.basis.person'), rows: personRows });
  }

  // Section: Contact & Family
  const contactRows = [];
  if (data.phone) contactRows.push({ label: t('mirror.basis.phone'), value: data.phone });
  if (data.email) contactRows.push({ label: t('mirror.basis.email'), value: data.email });

  if (contactRows.length > 0) {
    sections.push({ title: t('mirror.basis.contact'), rows: contactRows });
  }

  return sections;
}

function buildWohnenSections(data, t) {
  const sections = [];

  // Section: Zuhause
  const homeRows = [];
  const addr = addressLine(data);
  if (addr) homeRows.push({ label: t('mirror.wohnen.address'), value: addr });
  if (data.moveInDate) homeRows.push({ label: t('mirror.wohnen.moveInDate'), value: formatDate(data.moveInDate, t) });
  const duration = calcDuration(data.moveInDate, t);
  if (duration) homeRows.push({ label: t('mirror.wohnen.duration'), value: duration });
  if (data.residenceType) {
    const label = t('chapters.wohnen.fields.residenceType.options.' + data.residenceType) || data.residenceType;
    homeRows.push({ label: t('mirror.wohnen.residenceType'), value: label });
  }

  if (homeRows.length >= 1) {
    sections.push({ title: t('mirror.wohnen.home'), rows: homeRows });
  }

  // Section: Kosten
  const costRows = [];
  if (data.rentAmount) costRows.push({ label: t('mirror.wohnen.rent'), value: formatCHF(data.rentAmount) + '/Mt.' });
  if (data.utilities) costRows.push({ label: t('mirror.wohnen.utilities'), value: formatCHF(data.utilities) + '/Mt.' });

  const rentNum = Number(data.rentAmount) || 0;
  const utilsNum = Number(data.utilities) || 0;
  if (rentNum > 0 && utilsNum > 0) {
    costRows.push({ label: t('mirror.wohnen.totalCost'), value: formatCHF(rentNum + utilsNum) + '/Mt.', bold: true });
  }

  if (costRows.length > 0) {
    sections.push({ title: t('mirror.wohnen.costs'), rows: costRows });
  }

  return sections;
}

function buildFinanzenSections(data, allData, t) {
  const sections = [];

  // Section: Einkommen
  const incomeRows = [];
  if (data.monthlyIncome) incomeRows.push({ label: t('mirror.finanzen.income'), value: formatCHF(data.monthlyIncome) + '/Mt.' });
  if (data.employer) incomeRows.push({ label: t('mirror.finanzen.employer'), value: data.employer });
  if (data.employmentType) incomeRows.push({ label: t('mirror.finanzen.employment'), value: employmentLabel(data.employmentType, t) });

  if (incomeRows.length > 0) {
    sections.push({ title: t('mirror.finanzen.incomeTitle'), rows: incomeRows });
  }

  // Section: Monatliche Ausgaben (own + cross-chapter)
  const expRows = [];
  // Cross-chapter: wohnen
  const rentTotal = (Number(allData?.wohnen?.rentAmount) || 0) + (Number(allData?.wohnen?.utilities) || 0);
  if (rentTotal > 0) expRows.push({ label: t('mirror.finanzen.housing'), value: formatCHF(rentTotal) + '/Mt.' });
  // Cross-chapter: KK
  if (allData?.versicherungen?.kkPremium) expRows.push({ label: t('mirror.finanzen.healthInsurance'), value: formatCHF(allData.versicherungen.kkPremium) + '/Mt.' });
  // Own fields
  if (data.monthlyTax) expRows.push({ label: t('mirror.finanzen.tax'), value: formatCHF(data.monthlyTax) + '/Mt.' });
  if (data.groceries) expRows.push({ label: t('mirror.finanzen.groceries'), value: formatCHF(data.groceries) + '/Mt.' });
  if (data.communication) expRows.push({ label: t('mirror.finanzen.communication'), value: formatCHF(data.communication) + '/Mt.' });
  if (data.mobility) expRows.push({ label: t('mirror.finanzen.mobility'), value: formatCHF(data.mobility) + '/Mt.' });
  if (data.otherInsurance) expRows.push({ label: t('mirror.finanzen.otherInsurance'), value: formatCHF(data.otherInsurance) + '/Mt.' });

  if (expRows.length > 0) {
    sections.push({ title: t('mirror.finanzen.expensesTitle'), rows: expRows });
  }

  // Section: Sparen & Vorsorge (only if data exists)
  const savingsRows = [];
  if (data.savingsGoal) savingsRows.push({ label: t('mirror.finanzen.savingsGoal'), value: formatCHF(data.savingsGoal) + '/Mt.' });
  if (data.pension3a) savingsRows.push({ label: t('mirror.finanzen.pension3a'), value: formatCHF(data.pension3a) + '/J.' });

  if (savingsRows.length > 0) {
    sections.push({ title: t('mirror.finanzen.savingsTitle'), rows: savingsRows });
  }

  // Loans: only if > 0, no section — just a single row appended to expenses or standalone
  const loans = Number(data.loans) || 0;
  if (loans > 0) {
    sections.push({ title: t('mirror.finanzen.loansTitle'), rows: [
      { label: t('mirror.finanzen.loansOpen2'), value: formatCHF(loans) },
    ]});
  }

  return sections;
}

function buildMirrorSections(chapterKey, data, t, allData) {
  if (chapterKey === 'basis') return buildBasisSections(data, t);
  if (chapterKey === 'wohnen') return buildWohnenSections(data, t);
  if (chapterKey === 'finanzen') return buildFinanzenSections(data, allData, t);
  return [];
}

// ─── Render ────────────────────────────────────────────────

function MirrorRow({ label, value, palette, isLast, bold }) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      padding: space.sm + 'px 0',
      borderBottom: isLast ? 'none' : '1px solid ' + palette.border,
      gap: space.md + 'px',
    }
  },
    React.createElement('span', {
      style: { fontSize: text.sm, color: bold ? palette.text : palette.mid, flexShrink: 0, fontWeight: bold ? weight.semi : weight.normal }
    }, label),
    React.createElement('span', {
      style: { fontSize: text.body, color: palette.text, textAlign: 'right', fontWeight: bold ? weight.semi : weight.normal }
    }, value || '—')
  );
}

function MirrorSection({ title, rows, palette }) {
  return React.createElement('div', {
    style: {
      background: palette.up,
      borderRadius: radius.sm,
      padding: space.md + 'px',
      marginBottom: space.md + 'px',
    }
  },
    React.createElement('div', {
      style: {
        fontSize: text.xs,
        color: palette.mid,
        letterSpacing: '0.3px',
        fontWeight: weight.medium,
        marginBottom: space.sm + 'px',
      }
    }, title),
    rows.map((row, idx) =>
      React.createElement(MirrorRow, {
        key: row.label,
        label: row.label,
        value: row.value,
        palette: palette,
        isLast: idx === rows.length - 1,
        bold: row.bold || false,
      })
    )
  );
}

export const MirrorCards = ({ chapterKey, data, allData, palette, t }) => {
  if (!hasMinData(chapterKey, data)) return null;

  const sentence = buildLifeSentence(chapterKey, data, allData, t);
  const sections = buildMirrorSections(chapterKey, data, t, allData);

  if (!sentence && sections.length === 0) return null;

  return React.createElement('div', {
    style: { marginBottom: space.lg + 'px' }
  },
    // Life sentence card
    sentence && React.createElement('div', {
      style: {
        background: palette.surface,
        border: '1px solid ' + palette.border,
        borderRadius: radius.md,
        padding: space.md + 'px',
        marginBottom: sections.length > 0 ? space.md + 'px' : 0,
        fontSize: text.body,
        color: palette.text,
        lineHeight: leading.normal,
      }
    }, sentence),

    // Mirror sections
    sections.map((section) =>
      React.createElement(MirrorSection, {
        key: section.title,
        title: section.title,
        rows: section.rows,
        palette: palette,
      })
    )
  );
};

export default MirrorCards;
