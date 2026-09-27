import { heuteIso, leseDatum } from './utils/fristen.js';

// Schulden Manager und Betreibungsregister

// Übersicht der Schulden — überarbeitet 27.09.2026 (Befund Stebler Studios: «wie gehts dem Abbau-Plan?»).
// Vorher: «Gesamtschulden» zählte Bezahltes mit, «Bald fällig» nahm jede Schuld OHNE Datum auf
// (new Date('') ist ungültig, jeder Vergleich false), und der Status «Überfällig» zählte nicht.
// Jetzt: offen = nicht bezahlt; überfällig = Status «overdue» ODER Datum vor heute;
// noch nicht fällig = gültiges Datum ab heute; der Rest ist «offen ohne Fälligkeitsdatum».
// Datum als ISO-Text verglichen (Eingabe aus <input type="date">), ungültig = ohne Datum.
// Überfällig = so erfasst ODER Fälligkeit vorbei. Eine Regel für Übersicht und Karte:
// bis 27.09.2026 zählte die Übersicht eine Busse mit vergangenem Datum als überfällig,
// ihre Karte sagte «Offen».
export const istUeberfaellig = (debt, heute = heuteIso()) => {
  if (!debt || debt.status === 'paid') return false;
  if (debt.status === 'overdue') return true;
  return !!leseDatum(debt.dueDate) && debt.dueDate < heute;
};

export const calculateDebtStatus = (debts, heute = heuteIso()) => {
  let offen = 0;
  let overdue = 0;
  let upcoming = 0;
  let ohneDatum = 0;
  let paid = 0;

  for (const debt of debts || []) {
    const amount = Number(debt.amount) || 0;
    if (debt.status === 'paid') { paid += amount; continue; }
    offen += amount;
    const due = leseDatum(debt.dueDate) ? debt.dueDate : null;
    if (istUeberfaellig(debt, heute)) overdue += amount;
    else if (due) upcoming += amount;
    else ohneDatum += amount;
  }

  return { totalDebt: offen, overdue, upcoming, ohneDatum, paid, remaining: offen };
};

const rappen = (x) => Math.round(x * 100) / 100;

// Abbau-Plan als Richtwert — überarbeitet 27.09.2026. Vorher: fest CHF 500/Monat, EIN Zinssatz
// (der der ersten Schuld) für die Summe inkl. Bezahltem, und reichte die Rate nicht für die
// Zinsen, lief die Schleife 240 Monate mit wachsender Schuld weiter.
// Jetzt je offene Schuld mit ihrem eigenen Satz, in der Reihenfolge von `prioritizeDebts`
// (Stufe, dann Lawine/Schneeball). Vereinfacht: die ganze Rate geht an die erste offene Schuld,
// die Zinsen der übrigen laufen weiter (Jahressatz / 12, einfach je Monat). Keine Gebühren.
// Ergebnis: { machbar: true, monate, zinsTotal, reihenfolge[{id, creditor, monat}] }
//        oder { machbar: false, grund: 'zins', zinsMonat } | { machbar: false, grund: 'dauer' }
//        oder null (keine Rate, keine offene Schuld).
export const PLAN_MAX_MONATE = 360;
export const createDebtPlan = (debts, monthlyPayment, method = 'lawine') => {
  const rate = Number(monthlyPayment);
  const offen = prioritizeDebts(debts, method)
    .map(d => ({ id: d.id, creditor: d.creditor, rest: Number(d.amount) || 0, zins: Math.max(0, Number(d.interestRate) || 0) }))
    .filter(d => d.rest > 0);
  if (!(rate > 0) || offen.length === 0) return null;

  const fertig = {};
  let monat = 0;
  let zinsTotal = 0;
  while (offen.some(d => d.rest > 0) && monat < PLAN_MAX_MONATE) {
    monat++;
    let zinsMonat = 0;
    for (const d of offen) {
      if (d.rest <= 0) continue;
      const z = d.rest * d.zins / 100 / 12;
      d.rest += z;
      zinsMonat += z;
    }
    // Jeden Monat prüfen, nicht nur im ersten (Fach-Prüfer 27.09.): wächst eine verzinste Schuld,
    // während eine zinslose abbezahlt wird, übersteigen die Zinsen die Rate erst später.
    if (zinsMonat >= rate) return { machbar: false, grund: 'zins', zinsMonat: rappen(zinsMonat) };
    zinsTotal += zinsMonat;
    let budget = rate;
    for (const d of offen) {
      if (d.rest <= 0 || budget <= 0) continue;
      const teil = Math.min(budget, d.rest);
      d.rest -= teil;
      budget -= teil;
      if (d.rest < 0.005) { d.rest = 0; fertig[d.id] = monat; }
    }
  }
  if (offen.some(d => d.rest > 0)) return { machbar: false, grund: 'dauer' };
  return { machbar: true, monate: monat, zinsTotal: rappen(zinsTotal), reihenfolge: offen.map(d => ({ id: d.id, creditor: d.creditor, monat: fertig[d.id] })) };
};

// Betreibungen im Verhältnis zum Einkommen — überarbeitet 27.09.2026. Vorher: ohne Einkommen
// wurde durch 1 geteilt und «kritisch» gemeldet; die Schwellen 10/25/50 % und die Wertungen
// («unter Kontrolle», «ernst») hatten keine Quelle. Jetzt nur eine neutrale Zahl, und nur mit
// Einkommen: wie viele Monatseinkommen die erfassten Betreibungen ausmachen.
// Bezahlte/erledigte Betreibungen zählen nicht mit (Fach-Prüfer 27.09.2026).
export const calculateBetreibungsRegisterImpact = (registerEntries, monthlyIncome) => {
  const totalDebt = (registerEntries || [])
    .filter(e => e.status !== 'paid' && e.status !== 'erledigt')
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const income = Number(monthlyIncome) || 0;
  return {
    totalDebt,
    monatseinkommen: income > 0 ? Math.round((totalDebt / income) * 10) / 10 : null,
  };
};

export const formatVerlustschein = (verlustschein) => {
  return {
    id: verlustschein.id || Date.now(),
    date: verlustschein.date || heuteIso(),
    debtor: verlustschein.debtor || '',
    amount: Number(verlustschein.amount || 0),
    creditor: verlustschein.creditor || '',
    reason: verlustschein.reason || '',
    court: verlustschein.court || '',
    status: verlustschein.status || 'open',
    notes: verlustschein.notes || '',
    uploadedFile: verlustschein.uploadedFile || null
  };
};

// Konsequenz-orientierte Reihenfolge. Belegt 27.09.2026 (vorher nur «CH-Schuldenberatungs-
// Praxis» ohne Quelle): schuldeninfo.ch «Weiterleben mit Schulden» (2011): zuerst die
// LAUFENDEN lebensnotwendigen Rechnungen — Wohnungsmiete, Krankenkasse, Alimente, Heiz- und
// Kochenergie. Für RÜCKSTÄNDE tragen die Folgen: Miete → Kündigung (OR 257d), Krankenkasse →
// Betreibung (KVG 64a).
// Caritas, Ratgeber Schuldensanierung: Bussen und Geldstrafen müssen auch in einer Sanierung
// zu 100 % bezahlt werden → ebenfalls vorne. Steuern: laufende Steuern gehören ins Budget
// (Caritas); ein Erlass der Bundessteuer nur vor dem Zahlungsbefehl (DBG Art. 167 Abs. 4).
// Danach die übrigen nach Methode (Lawine = höchster Zins zuerst; Schneeball = kleinster
// Betrag zuerst). Reine Orientierung, keine Beratung.
const CATEGORY_TIER = {
  wohnen: 1, krankenkasse: 1, alimente: 1, bussen: 1,
  steuern: 2,
  kredit: 3, sonstige: 3,
};

export const prioritizeDebts = (debts, method = 'lawine') => {
  const tierOf = (d) => CATEGORY_TIER[d.category] || 3;
  const open = (debts || []).filter(d => d.status !== 'paid');
  return [...open].sort((a, b) => {
    const ta = tierOf(a), tb = tierOf(b);
    if (ta !== tb) return ta - tb;
    if (ta === 3) {
      return method === 'schneeball'
        ? Number(a.amount || 0) - Number(b.amount || 0)
        : Number(b.interestRate || 0) - Number(a.interestRate || 0);
    }
    // Innerhalb der Stufen 1 und 2: grösster Betrag zuerst — eigene Entscheidung, keine Quelle.
    return Number(b.amount || 0) - Number(a.amount || 0);
  }).map(d => ({ ...d, tier: tierOf(d) }));
};
