// Systemblick messen — die sieben BAG-Modellhaushalte durch alle 26 IPV-Kantonsmodelle, als Markdown.
//
//   node scripts/systemblick-messen.mjs > docs/MESSUNG-systemblick-ipv-<datum>.md
//
// Schreibt nur auf stdout. Keine Nutzerdaten: die Haushalte sind die Modellhaushalte des BAG-Monitorings
// (data/systemblick.js). Konzept und Grenzen: docs/STATISTIK-SYSTEMBLICK.md.

import { MUSTERHAUSHALTE, HAUPTORTE, systemblickIPV, musterProfil } from '../src/data/systemblick.js';

const chf = (n) => (n == null ? '—' : Math.round(n).toLocaleString('de-CH').replace(/’/g, "'"));
const pct = (n) => (n == null ? '—' : `${Math.round(n)} %`);
const zelle = (z) => (z.art === 'betrag' ? chf(z.jahr) : z.art === 'keinAnspruch' ? '0' : 'keine Zahl');
// Verbilligter Anteil der Jahresprämie — eine ÄHNLICHE Grösse wie im BAG-Monitoring 2020, S. 13
// («Die IPV betrug durchschnittlich … 37% der unverbilligten ‹Mittleren Prämie›»), aber nicht dieselbe:
// anderer Nenner (regionale Durchschnittsprämie 2026 am Hauptort, nicht «Mittlere Prämie» 2020), und
// das BAG nennt einen Mittelwert über Kantone und Haushalte, die Messung hier den Median je Haushalt.
const anteil = (z) => (z.art === 'keineZahl' ? null : (z.jahr / (z.praemieMonat * 12)) * 100);
const median = (xs) => {
  const s = xs.filter((x) => x != null).sort((a, b) => a - b);
  if (!s.length) return null;
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

const runs = {};
for (const key of Object.keys(MUSTERHAUSHALTE)) runs[key] = await systemblickIPV(key);
const mitZahl = Object.keys(runs).filter((k) => runs[k].zeilen.some((z) => z.art !== 'keineZahl'));
const ohneZahl = Object.keys(runs).filter((k) => !mitZahl.includes(k));

const out = [];
out.push(`# Messung Systemblick IPV — BAG-Modellhaushalte — ${new Date().toISOString().slice(0, 10)}`, '');
out.push('> Erzeugt mit `node scripts/systemblick-messen.mjs`. Prototyp, **nicht veröffentlichen**, bevor das');
out.push('> Konzept (`docs/STATISTIK-SYSTEMBLICK.md`) freigegeben ist. Fachprüfung (swiss-precision) 24.10.2026: Befunde eingearbeitet.');
out.push('> **Keine Anspruchszusage.** Ob und wie viel Verbilligung jemand erhält, entscheidet allein die kantonale Stelle.', '');
out.push('**Haushalte:** die sieben Modellhaushalte aus Ecoplan/BAG, «Wirksamkeit der Prämienverbilligung – Monitoring 2020»,');
out.push('Mai 2022, S. 12 (Abb. K-2), mit deren Bruttoeinkommen.');
out.push('**Von Maloja gesetzt** (nicht vom BAG): Geburtsjahre; Kinderalter ganzzahlig; Netto aus Brutto mit dem App-Richtwert,');
out.push('**ohne Familienzulagen** (das BAG zählt sie dazu, Anhang B S. 132); **Vermögen 0** (alle Kantone rechnen einen Teil');
out.push('des Vermögens an, BAG S. 11); Rente = AHV-Maximalrente 2026 + BVG-Rest; Franchise 300; kein 13.');
out.push('**Prämie:** regionale Durchschnittsprämie 2026 am Hauptort je Person, Standardmodell, alle Versicherer. Das ist weder');
out.push('die «Standardprämie» (teuerste Region) noch die «Mittlere Prämie» (effektiv bezahlt) des Monitorings (BAG S. 134).', '');
out.push('**Lesart:** Werte = Prämienverbilligung pro Jahr in CHF, so wie der Maloja-Rechner sie für genau dieses Profil zeigen');
out.push('würde. Die Kantone rechnen mit ihrem eigenen massgebenden Einkommen (meist aus der Steuerveranlagung, nach Abzügen)');
out.push('— **kein amtlicher Kantonsvergleich**.');
out.push('`0` = nach dem Maloja-Modell kein Anspruch (bei der Rentnerin stark von den Vereinfachungen oben abhängig) ·');
out.push('`keine Zahl` = das Kantonsmodell in Maloja zeigt für dieses Profil bewusst keinen Betrag.', '');

out.push('## Haushalte, für die Maloja rechnen kann', '');
for (const k of mitZahl) {
  const h = MUSTERHAUSHALTE[k];
  const netto = musterProfil('ZH', k).finanzen;
  const einkommen = h.rente ? `Rente CHF ${chf(h.bruttoJahr)}/Jahr` : `Brutto CHF ${chf(h.bruttoJahr)}/Jahr ≈ Netto CHF ${chf(netto.monthlyIncome)}/Monat`;
  out.push(`- **${h.bezeichnung}** — ${einkommen}`);
}
out.push('');
out.push(`| Kanton (Hauptort) | ${mitZahl.map((k) => `${k.toUpperCase()} Verbilligung · Prämie/Mt · Anteil`).join(' | ')} |`);
out.push(`|---|${mitZahl.map(() => '---:').join('|')}|`);
for (const kt of Object.keys(HAUPTORTE)) {
  const zs = mitZahl.map((k) => runs[k].zeilen.find((z) => z.kanton === kt));
  out.push(`| ${kt} (${HAUPTORTE[kt].ort}) | ${zs.map((z) => `${zelle(z)} · ${chf(z.praemieMonat)} · ${pct(anteil(z))}`).join(' | ')} |`);
}
out.push('', `| Kennzahl | ${mitZahl.map((k) => k.toUpperCase()).join(' | ')} |`, `|---|${mitZahl.map(() => '---:').join('|')}|`);
const zeile = (label, f) => out.push(`| ${label} | ${mitZahl.map((k) => f(runs[k])).join(' | ')} |`);
zeile('Kantone mit Betrag', (r) => r.kennzahlen.mitBetrag);
zeile('Kantone ohne Anspruch (Maloja-Modell)', (r) => r.kennzahlen.keinAnspruch);
zeile('Kantone ohne Zahl', (r) => r.kennzahlen.keineZahl);
zeile('Tiefster Betrag (CHF/Jahr)', (r) => chf(r.kennzahlen.min));
zeile('Median Betrag (CHF/Jahr)', (r) => chf(r.kennzahlen.median));
zeile('Höchster Betrag (CHF/Jahr)', (r) => chf(r.kennzahlen.max));
zeile('Median verbilligter Anteil (Kantone mit Zahl, inkl. 0)', (r) => pct(median(r.zeilen.map(anteil))));
out.push('');

out.push('## Haushalte, für die Maloja heute keine Zahl zeigt', '');
out.push('In **allen 26 Kantonen** «keine Zahl». In 24 Kantonen liegt das an Maloja selbst:');
out.push('- **zwei Erwachsene** — das Kantonsmodell bricht am Riegel `mehrereErwachsene` ab (`haushalt`);');
out.push('- **junge Erwachsene 19–25** — eigene Kategorie in den Kantonen, oft abhängig von einer Ausbildung, nach der die App');
out.push('  nicht fragt (`alter`, `ausbildung`, `geJungeErwachsene`, `neJeuneAdulte`, `vsJungeErwachsene`).');
out.push('TG und JU halten schon vorher an: Maloja nennt dort bewusst keine Zahl, weil das Modell eine Steuergrösse braucht');
out.push('(`tgSteuerbetrag`, `steuerbaresEinkommen`), die die App nicht verlässlich schätzen kann.', '');
out.push(`Betroffen sind ${ohneZahl.length} von 7 BAG-Modellhaushalten:`, '');
for (const k of ohneZahl) {
  const gr = [...new Set(runs[k].zeilen.map((z) => z.grund))].join(', ');
  out.push(`- **${MUSTERHAUSHALTE[k].bezeichnung}** — Brutto CHF ${chf(MUSTERHAUSHALTE[k].bruttoJahr)}/Jahr · Gründe: \`${gr}\``);
}
out.push('');

const gruende = new Map();
for (const k of mitZahl) {
  for (const z of runs[k].zeilen) {
    if (z.art !== 'keineZahl') continue;
    if (!gruende.has(z.grund)) gruende.set(z.grund, []);
    gruende.get(z.grund).push(`${z.kanton} ${k.toUpperCase()}`);
  }
}
out.push('## Warum «keine Zahl» (rechenbare Haushalte)', '', 'Grund (Schlüssel aus dem Kantonsmodell) → betroffene Zellen.', '');
for (const [g, zellen] of [...gruende].sort((a, b) => b[1].length - a[1].length)) out.push(`- \`${g}\` (${zellen.length}×): ${zellen.join(' · ')}`);
out.push('');
process.stdout.write(out.join('\n'));
