// CSV/Excel Import Parser

export const parseCSV = (text) => {
  const lines = text.split('\n').filter(l => l.trim());
  const result = [];
  
  for (const line of lines) {
    const parts = line.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      result.push({
        date: parts[0] || new Date().toLocaleDateString('de-CH'),
        description: parts[1] || '',
        amount: parseFloat(parts[2]) || 0,
        category: parts[3] || 'Sonstiges',
        type: parts[4]?.toLowerCase() === 'income' ? 'income' : 'expense'
      });
    }
  }
  return result;
};

export const parseExcel = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const lines = data.split('\n').filter(l => l.trim());
        const result = [];
        
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split('\t').map(p => p.trim());
          if (parts.length >= 2) {
            result.push({
              date: parts[0] || new Date().toLocaleDateString('de-CH'),
              description: parts[1] || '',
              amount: parseFloat(parts[2]) || 0,
              category: parts[3] || 'Sonstiges',
              type: parts[4]?.toLowerCase() === 'income' ? 'income' : 'expense'
            });
          }
        }
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
};

export const parseEBill = (text) => {
  const lines = text.split('\n');
  const result = [];
  
  const patterns = {
    invoice: /^RECHNUNG|^INVOICE/i,
    amount: /CHF\s*([\d.,]+)/,
    date: /(\d{2}\.?\d{2}\.?\d{4})/,
    description: /Leistung|Description|Description|service/i
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.match(patterns.invoice)) {
      const entry = {
        date: new Date().toLocaleDateString('de-CH'),
        description: 'Zahlung (eBill)',
        amount: 0,
        category: 'Zahlungen',
        type: 'expense'
      };

      // Suche nach Betrag
      for (let j = i; j < Math.min(i + 20, lines.length); j++) {
        const match = lines[j].match(patterns.amount);
        if (match) {
          entry.amount = parseFloat(match[1].replace('.', '').replace(',', '.'));
        }
        const dateMatch = lines[j].match(patterns.date);
        if (dateMatch) {
          entry.date = dateMatch[1];
        }
        if (lines[j].match(patterns.description)) {
          entry.description = lines[j].trim();
        }
      }

      if (entry.amount > 0) {
        result.push(entry);
      }
    }
  }

  return result;
};

export const importBudgetFromFile = async (file) => {
  try {
    const text = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });

    // Erkenne Format
    if (file.name.endsWith('.csv')) {
      return parseCSV(text);
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      return await parseExcel(file);
    } else if (file.name.endsWith('.txt') && text.includes('eBill')) {
      return parseEBill(text);
    } else {
      // Versuche CSV
      return parseCSV(text);
    }
  } catch (error) {
    console.error('Import error:', error);
    throw error;
  }
};

export const processBudgetEntries = (entries, currentBudget) => {
  let updated = { ...currentBudget };
  let income = 0;
  let expenses = { rent: 0, utils: 0, health: 0, other: 0 };

  for (const entry of entries) {
    if (entry.type === 'income') {
      income += entry.amount;
    } else {
      const category = (entry.category || '').toLowerCase();
      if (category.includes('miete') || category.includes('rent')) {
        expenses.rent += entry.amount;
      } else if (category.includes('nebenkosten') || category.includes('utilities')) {
        expenses.utils += entry.amount;
      } else if (category.includes('krankenkasse') || category.includes('health') || category.includes('kk')) {
        expenses.health += entry.amount;
      } else {
        expenses.other += entry.amount;
      }
    }
  }

  updated.monthlyIncome = income;
  if (expenses.rent > 0) updated.rentAmount = expenses.rent;
  if (expenses.utils > 0) updated.utilities = expenses.utils;
  if (expenses.health > 0) updated.healthPremium = expenses.health;

  return updated;
};
