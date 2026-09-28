// ─── MirrorCards — Living Mirror Layer ─────────────────────
// Renders the life sentence for a chapter.
// Pure render component — no state, no side effects.
// Uses React.createElement, inline styles, palette-based.
//
// Phase 3B: Transforms data-collection chapters into
// living spaces that reflect a person's situation.

import React from 'react';
import { getCantonName } from './config/cantonalData.js';
import { text, space, radius, leading, shadow } from './config/tokens.js';
import { zivilstandLabel } from './utils/zivilstand.js';
import { betrag } from './utils/geld.js';

// ─── Data helpers ──────────────────────────────────────────

function hasMinData(chapterKey, data) {
  if (chapterKey === 'basis') return Boolean(data.firstName);
  if (chapterKey === 'wohnen') return Boolean(data.address || data.city);
  if (chapterKey === 'finanzen') return Boolean(data.monthlyIncome);
  if (chapterKey === 'behoerden') return Boolean(data.cantoneOfTaxation);
  if (chapterKey === 'notfall') return Boolean(data.emergencyContact);
  if (chapterKey === 'versicherungen') return Boolean(data.kkInsurer);
  if (chapterKey === 'ausbildung') return Boolean(data.jobTitle || data.employer || data.educationLevel);
  return false;
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
  return zivilstandLabel(value, t);
}

// ─── Life sentence builders ────────────────────────────────

function buildBasisSentence(data, t) {
  const parts = [];
  const name = [(data.firstName || ''), (data.middleName || ''), (data.lastName || '')].filter(Boolean).join(' ');
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
  return betrag(num, { hoechstens: 2 });
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

function sumAllExpenses(data, allData) {
  let sum = sumExpenses(data, allData);
  sum += Number(data.debtPayments) || 0;
  sum += Number(data.alimentePaid) || 0;
  return sum;
}

function sumTotalIncome(data) {
  let sum = Number(data.monthlyIncome) || 0;
  sum += Number(data.familienzulagen) || 0;
  sum += Number(data.alimenteReceived) || 0;
  return sum;
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

  // Third part: financial difference
  const totalIncome = sumTotalIncome(data);
  const totalExp = sumAllExpenses(data, allData);
  if (totalIncome > 0 && totalExp > 0) {
    const diff = totalIncome - totalExp;
    if (diff > 0) {
      parts.push(t('mirror.finanzen.remainsPositive', { amount: formatCHF(diff) }) + '.');
    } else if (diff < 0) {
      parts.push(t('mirror.finanzen.remainsNegative', { amount: formatCHF(Math.abs(diff)) }) + '.');
    } else {
      parts.push(t('mirror.finanzen.remainsZero') + '.');
    }
  }

  // Fourth part: loans (only if > 0)
  const loans = Number(data.loans) || 0;
  if (loans > 0) {
    parts.push(t('mirror.finanzen.loansOpen', { amount: formatCHF(loans) }) + '.');
  }

  return parts.join(' ');
}

// ─── Generic select label helper ──────────────────────────

function selectLabel(t, chapterKey, fieldKey, value) {
  if (!value) return null;
  return t('chapters.' + chapterKey + '.fields.' + fieldKey + '.options.' + value) || value;
}

// ─── Behörden ─────────────────────────────────────────────

function buildBehoerdenSentence(data, t) {
  if (!data.cantoneOfTaxation) return null;

  const canton = getCantonName(data.cantoneOfTaxation, t);

  if (data.legalRepresentative) {
    return t('mirror.behoerden.taxCantonWithRep', { canton: canton });
  }

  return t('mirror.behoerden.taxCantonSentence', { canton: canton });
}

// ─── Notfall ──────────────────────────────────────────────

function buildNotfallSentence(data, t) {
  if (!data.emergencyContact) return null;

  const hasDoctor = Boolean(data.doctor);
  const vorsorgeKeys = ['patientenverfuegung', 'vorsorgeauftrag'];
  const hasProvision = vorsorgeKeys.some(k => data[k] && data[k] !== 'no');
  const hasHealth = Boolean(data.allergies || data.medications || data.chronicDiseases);

  if (hasDoctor && hasProvision) return t('mirror.notfall.contactDoctorProvision');
  if (hasDoctor) return t('mirror.notfall.contactAndDoctor');
  if (hasProvision) return t('mirror.notfall.contactAndProvision');
  if (hasHealth) return t('mirror.notfall.contactAndHealth');
  return t('mirror.notfall.contactSentence');
}

// ─── Versicherungen ───────────────────────────────────────

function franchiseValue(data, t) {
  if (!data.franchise) return null;
  const label = selectLabel(t, 'versicherungen', 'franchise', data.franchise);
  return label;
}

function buildVersicherungenSentence(data, t) {
  if (!data.kkInsurer) return null;

  const franchise = franchiseValue(data, t);
  const hasBvg = Boolean(data.bvgInsurer);

  if (franchise && hasBvg) {
    return t('mirror.versicherungen.insurerFranchiseBvg', { insurer: data.kkInsurer, franchise: franchise });
  }
  if (franchise) {
    return t('mirror.versicherungen.insurerAndFranchise', { insurer: data.kkInsurer, franchise: franchise });
  }
  return t('mirror.versicherungen.insurerSentence', { insurer: data.kkInsurer });
}

// ─── Ausbildung ───────────────────────────────────────────

function buildAusbildungSentence(data, t) {
  const job = data.jobTitle;
  const employer = data.employer;
  const level = data.educationLevel ? selectLabel(t, 'ausbildung', 'educationLevel', data.educationLevel) : null;

  // Priority: education + job combined, then job alone, then education alone
  if (level && job) {
    return t('mirror.ausbildung.educationAndJob', { level: level, job: job });
  }
  if (job && employer) {
    return t('mirror.ausbildung.jobSentence', { job: job, employer: employer });
  }
  if (job) {
    return t('mirror.ausbildung.jobOnly', { job: job });
  }
  if (employer) {
    return t('mirror.ausbildung.employerOnly', { employer: employer });
  }
  if (level) {
    return t('mirror.ausbildung.educationSentence', { level: level });
  }
  return null;
}

// ─── Life sentence dispatcher ─────────────────────────────

function buildLifeSentence(chapterKey, data, allData, t) {
  if (chapterKey === 'basis') return buildBasisSentence(data, t);
  if (chapterKey === 'wohnen') return buildWohnenSentence(data, t);
  if (chapterKey === 'finanzen') return buildFinanzenSentence(data, allData, t);
  if (chapterKey === 'behoerden') return buildBehoerdenSentence(data, t);
  if (chapterKey === 'notfall') return buildNotfallSentence(data, t);
  if (chapterKey === 'versicherungen') return buildVersicherungenSentence(data, t);
  if (chapterKey === 'ausbildung') return buildAusbildungSentence(data, t);
  return null;
}

// ─── Render ────────────────────────────────────────────────

// Nur der Lebenssatz: die Kapitelseite zeigt die Werte selbst als Abschnittsliste
// (27.09.2026, #425). Die frühere Abschnitts-Spiegelung ist entfernt.
export const MirrorCards = ({ chapterKey, data, allData, palette, t }) => {
  if (!hasMinData(chapterKey, data)) return null;

  const sentence = buildLifeSentence(chapterKey, data, allData, t);
  if (!sentence) return null;

  return React.createElement('div', {
    style: { marginBottom: space.lg + 'px' }
  },
    // Life sentence card — sage-tinted mirror of your life
    React.createElement('div', {
      style: {
        background: palette.sageDew || palette.surface,
        border: '1px solid ' + palette.sage + '30',
        borderRadius: radius.md,
        padding: space.lg + 'px ' + space.md + 'px',
        marginBottom: 0,
        fontSize: text.body,
        color: palette.text,
        lineHeight: leading.relaxed,
        boxShadow: shadow.md,
      }
    }, sentence)
  );
};

export default MirrorCards;
