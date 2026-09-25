// ─── Fristen ab dem Ereignis ─────────────────────────────────────────────────
// Befund 24.09.2026 (Fachprüfung): zehn Frist-Knöpfe rechneten ab HEUTE — wer
// den Ablauf erst nach der Zustellung, der Geburt oder dem Todesfall öffnete,
// bekam eine Erinnerung, die NACH der echten Frist lag. Beim Rechtsvorschlag
// oder bei der Ausschlagung einer Erbschaft ist das kein Schönheitsfehler.
//
// Darum rechnet jede Frist hier ab einem Datum, das die Person selbst eingibt,
// und die Regel für alles in dieser Datei lautet:
//
//   NIE SPÄTER ALS DAS GESETZ.
//
// Verlängerungen (Wochenende, Feiertag, Betreibungsferien) bilden wir bewusst
// NICHT ab: sie sind kantonal verschieden, und eine zu früh angezeigte Frist
// schadet nicht — eine zu späte schon. Die Texte sagen das dazu.
//
// Rechenregeln nach OR Art. 77 Abs. 1 (sinngemäss auch ZPO Art. 142):
//   Tage   — der Tag des Ereignisses zählt nicht mit, die Frist endet am letzten Tag.
//   Monate — Ende am Tag mit derselben Zahl; fehlt er, am letzten Tag des Monats.

const ISO = /^\d{4}-\d{2}-\d{2}$/;

const zuIso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Ein Kalenderdatum aus der Eingabe — oder null. `new Date('2026-02-31')` rollt
// still in den März; das fangen wir ab, statt ein falsches Datum weiterzurechnen.
export const leseDatum = (iso) => {
  if (!ISO.test(iso || '')) return null;
  const [j, m, t] = iso.split('-').map(Number);
  const d = new Date(j, m - 1, t);
  if (d.getFullYear() !== j || d.getMonth() !== m - 1 || d.getDate() !== t) return null;
  return d;
};

export const plusTage = (iso, n) => {
  const d = leseDatum(iso);
  if (!d) return null;
  d.setDate(d.getDate() + n);
  return zuIso(d);
};

export const plusMonate = (iso, n) => {
  const d = leseDatum(iso);
  if (!d) return null;
  const tag = d.getDate();
  const ziel = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const letzter = new Date(ziel.getFullYear(), ziel.getMonth() + 1, 0).getDate();
  ziel.setDate(Math.min(tag, letzter));
  return zuIso(ziel);
};

export const heuteIso = () => zuIso(new Date());

// Liegt die Frist schon hinter uns? (Der letzte Tag selbst zählt noch.)
export const istVorbei = (fristIso, heute = heuteIso()) => !!fristIso && fristIso < heute;
