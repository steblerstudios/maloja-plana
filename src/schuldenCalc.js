// Schulden Manager und Betreibungsregister

export const calculateDebtStatus = (debts) => {
  let totalDebt = 0;
  let overdue = 0;
  let upcoming = 0;
  let paid = 0;

  for (const debt of debts) {
    const amount = Number(debt.amount || 0);
    const dueDate = new Date(debt.dueDate);
    const today = new Date();

    totalDebt += amount;

    if (debt.status === 'paid') {
      paid += amount;
    } else if (dueDate < today) {
      overdue += amount;
    } else {
      upcoming += amount;
    }
  }

  return { totalDebt, overdue, upcoming, paid, remaining: totalDebt - paid };
};


export const createDebtPlan = (totalDebt, monthlyPayment, interestRate = 0) => {
  const plan = [];
  let remaining = totalDebt;
  let month = 0;

  while (remaining > 0 && month < 240) {
    const interest = (remaining * (interestRate / 100)) / 12;
    const principal = Math.min(monthlyPayment - interest, remaining);
    remaining -= principal;

    plan.push({
      month: month + 1,
      payment: (principal + interest).toFixed(2),
      principal: principal.toFixed(2),
      interest: interest.toFixed(2),
      remaining: Math.max(0, remaining).toFixed(2)
    });

    month++;
  }

  return plan;
};


export const calculateBetreibungsRegisterImpact = (registerEntries, income) => {
  const totalDebt = registerEntries.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const debtToIncomeRatio = (totalDebt / income * 100).toFixed(1);
  
  let severity = 'low';
  if (debtToIncomeRatio > 50) severity = 'critical';
  else if (debtToIncomeRatio > 25) severity = 'high';
  else if (debtToIncomeRatio > 10) severity = 'medium';

  return {
    totalDebt,
    debtToIncomeRatio: parseFloat(debtToIncomeRatio),
    severity,
    recommendationKey: 'debtRecommendations.' + severity,
  };
};

export const formatVerlustschein = (verlustschein) => {
  return {
    id: verlustschein.id || Date.now(),
    date: verlustschein.date || new Date().toLocaleDateString('de-CH'),
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

export const createBetreibungsAuszugTemplate = () => {
  return {
    id: Date.now(),
    requestDate: new Date().toLocaleDateString('de-CH'),
    requestedFrom: 'Betreibungsamt',
    canton: '',
    holder: '',
    status: 'requested',
    results: []
  };
};

export const parseBetreibungsAuszugFile = (fileContent) => {
  const lines = fileContent.split('\n');
  const entries = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Suche nach Einträgen (vereinfachtes Format)
    if (line.match(/^\d+\./)) {
      const entry = {
        creditor: extractValue(lines, i, 'Gläubiger'),
        amount: extractAmount(lines, i),
        registerDate: extractDate(lines, i),
        status: extractValue(lines, i, 'Status') || 'open'
      };

      if (entry.amount > 0) {
        entries.push(entry);
      }
    }
  }

  return entries;
};

const extractValue = (lines, startIdx, keyword) => {
  for (let i = startIdx; i < Math.min(startIdx + 5, lines.length); i++) {
    if (lines[i].includes(keyword)) {
      return lines[i].split(':')[1]?.trim() || '';
    }
  }
  return '';
};

const extractAmount = (lines, startIdx) => {
  for (let i = startIdx; i < Math.min(startIdx + 5, lines.length); i++) {
    const match = lines[i].match(/CHF\s*([\d.,]+)/i);
    if (match) {
      return parseFloat(match[1].replace(',', '.').replace('.', ''));
    }
  }
  return 0;
};

const extractDate = (lines, startIdx) => {
  for (let i = startIdx; i < Math.min(startIdx + 5, lines.length); i++) {
    const match = lines[i].match(/(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}`;
    }
  }
  return new Date().toLocaleDateString('de-CH');
};

// Konsequenz-orientierte Reihenfolge (CH-Schuldenberatungs-Praxis): existenz-
// sichernde/privilegierte Schulden zuerst (Wohnen, Krankenkasse, Alimente,
// Bussen), dann amtliche (Steuern), dann die übrigen — diese nach gewählter
// Methode (Lawine = höchster Zins zuerst; Schneeball = kleinster Betrag zuerst).
// Reine Orientierung, keine Beratung.
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
    return Number(b.amount || 0) - Number(a.amount || 0);
  }).map(d => ({ ...d, tier: tierOf(d) }));
};
