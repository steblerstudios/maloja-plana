// ─── MirrorCards — Living Mirror Layer ─────────────────────
// Renders life sentences and mirror cards for chapters.
// Pure render component — no state, no side effects.
// Uses React.createElement, inline styles, palette-based.
//
// Phase 3B: Transforms data-collection chapters into
// living spaces that reflect a person's situation.

import React from 'react';
import { getCantonName } from './config/cantonalData.js';
import { text, weight, space, radius, leading, shadow } from './config/tokens.js';

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

const LOCALE_MAP = { de: 'de-CH', en: 'en-CH', fr: 'fr-CH', it: 'it-CH' };

function getLocale() {
  try { const lang = localStorage.getItem('or5_lang') || 'de'; return LOCALE_MAP[lang] || 'de-CH'; }
  catch { return 'de-CH'; }
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString(getLocale(), { day: 'numeric', month: 'long', year: 'numeric' });
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

// Feld-Label robust holen: Select-Felder sind { label, options }, reine
// Text-/Währungsfelder sind ein plain String. Spiegelt fl() aus constants.js.
function fieldLabel(t, chapterKey, fieldKey) {
  const def = t('chapters.' + chapterKey + '.fields.' + fieldKey);
  if (def && typeof def === 'object' && def.label) return def.label;
  return typeof def === 'string' ? def : fieldKey;
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

function buildBehoerdenSections(data, t) {
  const sections = [];

  // Section: Steuersituation
  const taxRows = [];
  if (data.cantoneOfTaxation) taxRows.push({ label: t('mirror.behoerden.taxCanton'), value: getCantonName(data.cantoneOfTaxation, t) });
  if (data.taxFilingDeadline) taxRows.push({ label: t('mirror.behoerden.taxDeadline'), value: formatDate(data.taxFilingDeadline) });
  if (data.pendingTaxReturns) taxRows.push({ label: t('mirror.behoerden.pendingReturns'), value: data.pendingTaxReturns });

  if (taxRows.length > 0) {
    sections.push({ title: t('mirror.behoerden.taxSituation'), rows: taxRows });
  }

  // Section: Rechtliche Situation
  const legalRows = [];
  if (data.betreibungsStatus) legalRows.push({ label: t('mirror.behoerden.betreibung'), value: selectLabel(t, 'behoerden', 'betreibungsStatus', data.betreibungsStatus) });
  if (data.registryOffice) legalRows.push({ label: t('mirror.behoerden.betreibungsamt'), value: data.registryOffice });
  if (data.courtCases) legalRows.push({ label: t('mirror.behoerden.courtCases'), value: selectLabel(t, 'behoerden', 'courtCases', data.courtCases) });

  if (legalRows.length > 0) {
    sections.push({ title: t('mirror.behoerden.legalSituation'), rows: legalRows });
  }

  // Section: Vertretung
  const repRows = [];
  if (data.legalRepresentative) repRows.push({ label: t('mirror.behoerden.legalRep'), value: data.legalRepresentative });
  if (data.representativePhone) repRows.push({ label: t('mirror.behoerden.legalRepPhone'), value: data.representativePhone });

  if (repRows.length > 0) {
    sections.push({ title: t('mirror.behoerden.representation'), rows: repRows });
  }

  // Section: Vorsorge
  const provRows = [];
  if (data.willMade) provRows.push({ label: t('mirror.behoerden.will'), value: selectLabel(t, 'behoerden', 'willMade', data.willMade) });

  if (provRows.length > 0) {
    sections.push({ title: t('mirror.behoerden.provision'), rows: provRows });
  }

  return sections;
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

function vorsorgeStatus(value, t) {
  if (!value) return null;
  if (value === 'yes') return t('mirror.notfall.statusYes');
  if (value === 'declined') return t('mirror.notfall.statusDeclined');
  return t('mirror.notfall.statusNo');
}

function buildNotfallSections(data, t) {
  const sections = [];

  // Section: Notfallkontakt
  const contactRows = [];
  if (data.emergencyContact) contactRows.push({ label: t('mirror.notfall.contactName'), value: data.emergencyContact });
  if (data.emergencyPhone) contactRows.push({ label: t('mirror.notfall.contactPhone'), value: data.emergencyPhone });

  if (contactRows.length > 0) {
    sections.push({ title: t('mirror.notfall.emergencyContact'), rows: contactRows });
  }

  // Section: Ärztliche Betreuung
  const careRows = [];
  if (data.doctor) careRows.push({ label: t('mirror.notfall.doctor'), value: data.doctor });
  if (data.doctorPhone) careRows.push({ label: t('mirror.notfall.doctorPhone'), value: data.doctorPhone });
  if (data.hospital) careRows.push({ label: t('mirror.notfall.hospital'), value: data.hospital });

  if (careRows.length > 0) {
    sections.push({ title: t('mirror.notfall.medicalCare'), rows: careRows });
  }

  // Section: Vorsorge
  const provRows = [];
  if (data.patientenverfuegung) provRows.push({ label: t('mirror.notfall.patientenverfuegung'), value: vorsorgeStatus(data.patientenverfuegung, t) });
  if (data.vorsorgeauftrag) provRows.push({ label: t('mirror.notfall.vorsorgeauftrag'), value: vorsorgeStatus(data.vorsorgeauftrag, t) });
  if (data.bestattungswuensche) provRows.push({ label: t('mirror.notfall.bestattungswuensche'), value: vorsorgeStatus(data.bestattungswuensche, t) });
  if (data.organDonor) provRows.push({ label: t('mirror.notfall.organDonor'), value: selectLabel(t, 'notfall', 'organDonor', data.organDonor) });

  if (provRows.length > 0) {
    sections.push({ title: t('mirror.notfall.provision'), rows: provRows });
  }

  // Section: Gesundheitsdaten (status only — no content)
  const healthRows = [];
  if (data.bloodType && data.bloodType !== 'unknown' && data.bloodType !== '') {
    healthRows.push({ label: t('mirror.notfall.bloodType'), value: data.bloodType });
  }
  if (data.allergies) healthRows.push({ label: t('mirror.notfall.allergiesRecorded'), value: '✓' });
  if (data.medications) healthRows.push({ label: t('mirror.notfall.medicationsRecorded'), value: '✓' });
  if (data.chronicDiseases) healthRows.push({ label: t('mirror.notfall.healthInfoRecorded'), value: '✓' });

  if (healthRows.length > 0) {
    sections.push({ title: t('mirror.notfall.healthData'), rows: healthRows });
  }

  return sections;
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

function buildVersicherungenSections(data, t) {
  const sections = [];
  const mt = t('mirror.versicherungen.perMonth');
  const yr = t('mirror.versicherungen.perYear');

  // Section: Grundversicherung
  const basicRows = [];
  if (data.kkInsurer) basicRows.push({ label: t('mirror.versicherungen.insurer'), value: data.kkInsurer });
  if (data.kkModel) basicRows.push({ label: t('mirror.versicherungen.model'), value: selectLabel(t, 'versicherungen', 'kkModel', data.kkModel) });
  if (data.franchise) basicRows.push({ label: t('mirror.versicherungen.franchise'), value: 'CHF ' + franchiseValue(data, t) });
  if (data.kkPremium) basicRows.push({ label: t('mirror.versicherungen.premium'), value: formatCHF(data.kkPremium) + mt });
  if (data.uvg) basicRows.push({ label: t('mirror.versicherungen.accident'), value: selectLabel(t, 'versicherungen', 'uvg', data.uvg) });

  if (basicRows.length > 0) {
    sections.push({ title: t('mirror.versicherungen.basicInsurance'), rows: basicRows });
  }

  // Section: Berufliche Vorsorge
  const bvgRows = [];
  if (data.bvgInsurer) bvgRows.push({ label: t('mirror.versicherungen.bvg'), value: data.bvgInsurer });
  if (data.bvgContribution) bvgRows.push({ label: t('mirror.versicherungen.bvgContribution'), value: formatCHF(data.bvgContribution) + mt });
  if (data.ahvContribution) bvgRows.push({ label: t('mirror.versicherungen.ahv'), value: formatCHF(data.ahvContribution) + yr });
  if (data.bvgBalance) bvgRows.push({ label: fieldLabel(t, 'versicherungen', 'bvgBalance'), value: formatCHF(data.bvgBalance) });
  if (data.freizuegigkeit) bvgRows.push({ label: fieldLabel(t, 'versicherungen', 'freizuegigkeit'), value: data.freizuegigkeit });

  if (bvgRows.length > 0) {
    sections.push({ title: t('mirror.versicherungen.social'), rows: bvgRows });
  }

  // Section: Weitere Versicherungen (only if any are "yes" or have amounts)
  const addRows = [];
  if (data.liabilityInsurance === 'yes') addRows.push({ label: t('mirror.versicherungen.liability'), value: data.liabilityAmount ? formatCHF(data.liabilityAmount) : '✓' });
  if (data.householdInsurance === 'yes') addRows.push({ label: t('mirror.versicherungen.household'), value: data.householdInsuranceAmount ? formatCHF(data.householdInsuranceAmount) + yr : '✓' });
  if (data.travelInsurance === 'yes') addRows.push({ label: t('mirror.versicherungen.travel'), value: '✓' });
  if (data.cyberInsurance === 'yes') addRows.push({ label: t('mirror.versicherungen.cyber'), value: '✓' });
  if (data.autoInsurance && data.autoInsurance !== 'no') addRows.push({ label: t('mirror.versicherungen.auto'), value: selectLabel(t, 'versicherungen', 'autoInsurance', data.autoInsurance) });
  if (data.lifeInsurance === 'yes') addRows.push({ label: fieldLabel(t, 'versicherungen', 'lifeInsurance'), value: '✓' });
  if (data.legalInsurance === 'yes') addRows.push({ label: fieldLabel(t, 'versicherungen', 'legalInsurance'), value: '✓' });
  if (data.childInsurance === 'yes') addRows.push({ label: fieldLabel(t, 'versicherungen', 'childInsurance'), value: '✓' });

  if (addRows.length > 0) {
    sections.push({ title: t('mirror.versicherungen.additional'), rows: addRows });
  }

  return sections;
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

function buildAusbildungSections(data, t) {
  const sections = [];

  // Section: Bildung
  const eduRows = [];
  if (data.educationLevel) eduRows.push({ label: t('mirror.ausbildung.level'), value: selectLabel(t, 'ausbildung', 'educationLevel', data.educationLevel) });
  if (data.schoolName) eduRows.push({ label: t('mirror.ausbildung.school'), value: data.schoolName });
  if (data.certifications) eduRows.push({ label: t('mirror.ausbildung.certifications'), value: data.certifications });

  if (eduRows.length > 0) {
    sections.push({ title: t('mirror.ausbildung.education'), rows: eduRows });
  }

  // Section: Beruf
  const workRows = [];
  if (data.jobTitle) workRows.push({ label: t('mirror.ausbildung.jobTitle'), value: data.jobTitle });
  if (data.employer) workRows.push({ label: t('mirror.ausbildung.employer'), value: data.employer });
  if (data.employmentStart) workRows.push({ label: t('mirror.ausbildung.since'), value: formatDate(data.employmentStart) });
  if (data.workHoursPerWeek) workRows.push({ label: t('mirror.ausbildung.hoursPerWeek'), value: data.workHoursPerWeek + 'h' });
  if (data.workPermit) workRows.push({ label: t('mirror.ausbildung.workPermit'), value: selectLabel(t, 'ausbildung', 'workPermit', data.workPermit) });

  if (workRows.length > 0) {
    sections.push({ title: t('mirror.ausbildung.work'), rows: workRows });
  }

  // Section: Sprachen
  if (data.languages) {
    sections.push({ title: t('mirror.ausbildung.languagesTitle'), rows: [
      { label: t('mirror.ausbildung.languages'), value: data.languages },
    ]});
  }

  return sections;
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

// ─── Mirror section builders ───────────────────────────────

function buildBasisSections(data, t, allData) {
  const sections = [];

  // Section: Person
  const personRows = [];
  const fullName = [(data.academicTitle || ''), (data.firstName || ''), (data.middleName || ''), (data.lastName || '')].filter(Boolean).join(' ');
  if (fullName) personRows.push({ label: t('mirror.basis.name'), value: fullName });
  if (data.dateOfBirth) personRows.push({ label: t('mirror.basis.dateOfBirth'), value: formatDate(data.dateOfBirth) });
  if (data.canton) personRows.push({ label: t('mirror.basis.canton'), value: getCantonName(data.canton, t) });
  if (data.maritalStatus) personRows.push({ label: t('mirror.basis.maritalStatus'), value: maritalLabel(data.maritalStatus, t) });
  // „Keine Angabe" (none) bewusst nicht spiegeln — nur eine aktive Wahl zeigen.
  if (data.pronouns && data.pronouns !== 'none') personRows.push({ label: t('mirror.basis.pronouns'), value: t('chapters.basis.fields.pronouns.options.' + data.pronouns) });

  const hh = householdText(data, t);
  if (hh) personRows.push({ label: t('mirror.basis.household'), value: hh });

  if (personRows.length >= 2) {
    sections.push({ title: t('mirror.basis.person'), rows: personRows });
  }

  // Section: Contact (E-Mail excluded — no identity/mirror value)
  // Address is stored in the Wohnen chapter, but people instinctively look for
  // it under Basis. Mirror it here (read-only from allData.wohnen) so it is
  // findable where it is expected.
  const contactRows = [];
  const addr = allData && allData.wohnen ? addressLine(allData.wohnen) : null;
  if (addr) contactRows.push({ label: t('mirror.wohnen.address'), value: addr });
  if (data.phone) contactRows.push({ label: t('mirror.basis.phone'), value: data.phone });

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
  if (data.moveInDate) homeRows.push({ label: t('mirror.wohnen.moveInDate'), value: formatDate(data.moveInDate) });
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

  // Section: Eigentum (nur bei Wohneigentum)
  const propRows = [];
  if (data.mortgageStatus && data.mortgageStatus !== 'no') propRows.push({ label: t('mirror.wohnen.mortgage'), value: selectLabel(t, 'wohnen', 'mortgageStatus', data.mortgageStatus) });
  if (data.propertyValue) propRows.push({ label: fieldLabel(t, 'wohnen', 'propertyValue'), value: formatCHF(data.propertyValue) });
  if (propRows.length > 0) {
    sections.push({ title: t('sections.wohnen.property'), rows: propRows });
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

  if (data.familienzulagen) incomeRows.push({ label: t('mirror.finanzen.familienzulagen'), value: formatCHF(data.familienzulagen) + '/Mt.' });
  if (data.alimenteReceived) incomeRows.push({ label: t('mirror.finanzen.alimenteReceived'), value: formatCHF(data.alimenteReceived) + '/Mt.' });

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
  if (data.pension3b === 'yes') savingsRows.push({ label: fieldLabel(t, 'finanzen', 'pension3b'), value: '✓' });
  if (data.investmentFunds === 'yes') savingsRows.push({ label: t('mirror.finanzen.investmentFunds'), value: '✓' });

  if (savingsRows.length > 0) {
    sections.push({ title: t('mirror.finanzen.savingsTitle'), rows: savingsRows });
  }

  // Section: Verpflichtungen
  const obligationRows = [];
  if (data.debtPayments) obligationRows.push({ label: t('mirror.finanzen.debtPayments'), value: formatCHF(data.debtPayments) + '/Mt.' });
  if (data.alimentePaid) obligationRows.push({ label: t('mirror.finanzen.alimentePaid'), value: formatCHF(data.alimentePaid) + '/Mt.' });
  if (data.creditCard && data.creditCard !== 'no') obligationRows.push({ label: t('mirror.finanzen.creditCard'), value: selectLabel(t, 'finanzen', 'creditCard', data.creditCard) });

  if (obligationRows.length > 0) {
    sections.push({ title: t('mirror.finanzen.obligationsTitle'), rows: obligationRows });
  }

  // Loans: only if > 0, no section — just a single row appended to expenses or standalone
  const loans = Number(data.loans) || 0;
  if (loans > 0) {
    sections.push({ title: t('mirror.finanzen.loansTitle'), rows: [
      { label: t('mirror.finanzen.loansOpen2'), value: formatCHF(loans) },
    ]});
  }

  // Section: Monatlicher Spielraum (only when income + expenses exist)
  const totalIncome = sumTotalIncome(data);
  const totalExp = sumAllExpenses(data, allData);
  if (totalIncome > 0 && totalExp > 0) {
    const diff = totalIncome - totalExp;
    let diffValue;
    if (diff > 0) {
      diffValue = formatCHF(diff) + ' ' + t('mirror.finanzen.diffPositiveShort');
    } else if (diff < 0) {
      diffValue = formatCHF(Math.abs(diff)) + ' ' + t('mirror.finanzen.diffNegativeShort');
    } else {
      diffValue = t('mirror.finanzen.diffZeroShort');
    }
    sections.push({ title: t('mirror.finanzen.diffTitle'), rows: [
      { label: t('mirror.finanzen.diffLabel'), value: diffValue, bold: true },
    ]});
  }

  return sections;
}

function buildMirrorSections(chapterKey, data, t, allData) {
  if (chapterKey === 'basis') return buildBasisSections(data, t, allData);
  if (chapterKey === 'wohnen') return buildWohnenSections(data, t);
  if (chapterKey === 'finanzen') return buildFinanzenSections(data, allData, t);
  if (chapterKey === 'behoerden') return buildBehoerdenSections(data, t);
  if (chapterKey === 'notfall') return buildNotfallSections(data, t);
  if (chapterKey === 'versicherungen') return buildVersicherungenSections(data, t);
  if (chapterKey === 'ausbildung') return buildAusbildungSections(data, t);
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
      background: palette.sageMist || palette.up,
      borderRadius: radius.md,
      padding: space.md + 'px',
      marginBottom: space.md + 'px',
      boxShadow: shadow.sm,
      border: '1px solid ' + palette.sage + '22',
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
    // Life sentence card — sage-tinted mirror of your life
    sentence && React.createElement('div', {
      style: {
        background: palette.sageDew || palette.surface,
        border: '1px solid ' + palette.sage + '30',
        borderRadius: radius.md,
        padding: space.lg + 'px ' + space.md + 'px',
        marginBottom: sections.length > 0 ? space.md + 'px' : 0,
        fontSize: text.body,
        color: palette.text,
        lineHeight: leading.relaxed,
        boxShadow: shadow.md,
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
