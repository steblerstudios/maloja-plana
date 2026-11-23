// Eigene Datei (10.11.2026): steuerfrist.js gehört zum Startbündel (Dashboard), diese Regel brauchen nur
// nachgeladene Teile — so bleibt sie draussen.
// Abstand zu einer Frist in Tagen bzw. Monaten — EINE Regel für das Kapitel Behörden (relativ) und die
// Instrument-Kachel (10.11.2026): unter 60 Tagen in Tagen, sonst in Monaten (auf 30 Tage gerundet).
// `iso` als JJJJ-MM-TT; `jetzt` als Zeitpunkt (Default: jetzt).
export const fristAbstand = (iso, jetzt = Date.now()) => {
  const t = new Date(String(iso || '').slice(0, 10) + 'T12:00:00').getTime();
  if (isNaN(t)) return null;
  const tage = Math.round((t - jetzt) / 86400000);
  const betrag = Math.abs(tage);
  return { tage, n: betrag < 60 ? betrag : Math.round(betrag / 30), einheit: betrag < 60 ? 'tage' : 'monate', vorbei: tage < 0 };
};
