// Kopie von calculateIPV aus v0.1.37-beta (Commit 335a557), umbenannt, ohne Kommentare, Logik unverändert.
// Referenz für den K31-Regressionstest: alle Kantone ausser ZH und BE müssen exakt so rechnen.
// Kein Produktionscode liest diese Datei.
import { CANTONAL_IPV, getHouseholdInfo } from '../cantonalData.js';

export function calculateIPVAlt(data) {
  const canton = data.basis?.canton || '';
  const ipvData = CANTONAL_IPV[canton];
  if (!ipvData) return { eligible: false, amount: 0, noteKey: 'ipv.cantonUnknown', noteParams: {}, canton };

  const hh = getHouseholdInfo(data);
  const income = (Number(data.finanzen?.monthlyIncome || 0) + Number(data.finanzen?.sideIncome || 0) + hh.partnerIncome) * 12;
  const childrenCount = hh.childrenCount;
  const youngAdultsCount = (hh.children || []).filter(c => {
    const age = Number(c.age);
    return age >= 19 && age <= 25;
  }).length;

  if (!(ipvData.beleg && ipvData.beleg.quelle)) return {
    eligible: false, belegt: false, amount: null, noteKey: 'ipv.orientierungOffen',
    anspruchMoeglich: Number(data.versicherungen?.kkPremium) > 0, youngAdultsCount, canton,
  };

  let maxAnnualSubsidy;
  if (childrenCount > 0) {
    maxAnnualSubsidy = ipvData.subsidyFamily + childrenCount * ipvData.subsidyChild;
  } else {
    maxAnnualSubsidy = ipvData.subsidySingle;
  }

  const reductionFactor = income > 0 ? Math.max(0, 1 - (income / ipvData.maxIncome)) : 1;
  const annualSubsidy = Math.round(maxAnnualSubsidy * reductionFactor);
  const monthlySubsidy = Math.round(annualSubsidy / 12);

  if (annualSubsidy <= 0) {
    return { belegt: true, eligible: false, amount: 0, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: ipvData.maxIncome }, canton, cantonData: ipvData };
  }

  return {
    eligible: true,
    belegt: true,
    anspruchMoeglich: true,
    amount: monthlySubsidy,
    annual: annualSubsidy,
    maxAnnual: maxAnnualSubsidy,
    reductionPercent: Math.round(reductionFactor * 100),
    noteKey: ipvData.noteKey,
    noteParams: ipvData.noteParams || {},
    youngAdultsCount,
    canton,
    cantonData: ipvData
  };
}
