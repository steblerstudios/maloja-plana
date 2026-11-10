// Arbeitsverhältnis aus dem Stellenantritt (Kapitel Ausbildung & Arbeit, `employmentStart`) — für die
// Instrument-Kachel «Dienstjahre» (10.11.2026, Stebler Studios «Dienstjahre + Kündigungsfrist»).
//
// Gesetzliche Regel, nur wenn Vertrag oder GAV nichts anderes vorsehen:
//   • Probezeit: ohne andere Abrede der erste Monat, Kündigungsfrist 7 Tage (OR Art. 335b Abs. 1).
//   • Danach Kündigungsfrist je auf Ende eines Monats (OR Art. 335c Abs. 1):
//     im 1. Dienstjahr 1 Monat, im 2. bis und mit 9. Dienstjahr 2 Monate, danach 3 Monate.
// Wie in NeuerJob.jsx: der Vertrag kann eine längere Probezeit (bis 3 Monate) und andere Fristen vorsehen.
//
// Eigene Datei, damit nichts davon ins Startbündel reist (nur die nachgeladene Kachel braucht sie).

const datum = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12);
  return isNaN(d.getTime()) || d.getDate() !== Number(m[3]) ? null : d;
};

// Volle Monate zwischen zwei Daten (ein angefangener Monat zählt nicht).
const volleMonate = (von, bis) => {
  let n = (bis.getFullYear() - von.getFullYear()) * 12 + (bis.getMonth() - von.getMonth());
  if (bis.getDate() < von.getDate()) n -= 1;
  return Math.max(0, n);
};

// { monate, jahre, dienstjahr, inProbezeit, kuendigungsfristMonate } oder null (ohne gültiges Datum
// oder mit Stellenantritt in der Zukunft).
export function dienstLage(employmentStart, heute = new Date()) {
  const start = datum(employmentStart);
  if (!start) return null;
  const jetzt = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate(), 12);
  if (start > jetzt) return null;
  const monate = volleMonate(start, jetzt);
  const jahre = Math.floor(monate / 12);
  const dienstjahr = jahre + 1;
  const inProbezeit = monate < 1;
  const kuendigungsfristMonate = dienstjahr <= 1 ? 1 : dienstjahr <= 9 ? 2 : 3;
  return { monate, jahre, dienstjahr, inProbezeit, kuendigungsfristMonate };
}
