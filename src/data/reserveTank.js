// Reine Logik für die Reserve-Tankanzeige — kein React, damit testbar.
// „Wie viele Monate trägt der Notgroschen?" = liquide Ersparnisse ÷ Monatsausgaben.
// Ruhig, kein Alarm: eine dünne Reserve ist ein Aufbau-Ziel, kein Versagen.
// Nur der liquide Notgroschen (savingsAccount) zählt — 3a/Wertschriften sind
// nicht griffbereit und würden die Reserve schönrechnen.
//
//   noexpenses → keine Ausgaben erfasst: Monate nicht berechenbar (Orientierung)
//   months     → Monate = savings / monthlyExpenses; level empty/low/ok/strong
export function reserveTankState({ savings, monthlyExpenses, recommendMonths = 3, fullMonths = 6 } = {}) {
  const s = Math.max(0, Number(savings) || 0);
  const e = Math.max(0, Number(monthlyExpenses) || 0);
  if (e <= 0) {
    return { show: true, mode: 'noexpenses', savings: s, months: null, needle: null, recommendMonths, fullMonths };
  }
  const months = s / e;
  const level = months >= recommendMonths * 2 ? 'strong'
    : months >= recommendMonths ? 'ok'
    : months > 0 ? 'low'
    : 'empty';
  return {
    show: true,
    mode: 'months',
    savings: s,
    monthlyExpenses: e,
    months: Math.round(months * 10) / 10,   // 1 Nachkommastelle, „rund"
    needle: Math.min(months, fullMonths),    // Zeiger im Skalenbereich (Überfüllung → voll)
    recommendMonths,
    fullMonths,
    level,
  };
}
