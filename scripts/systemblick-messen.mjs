// Systemblick messen — derselbe Musterhaushalt durch alle 26 IPV-Kantonsmodelle, als Markdown.
//
//   node scripts/systemblick-messen.mjs > docs/MESSUNG-systemblick-ipv-<datum>.md
//
// Schreibt nur auf stdout. Keine Nutzerdaten: die Haushalte sind erfunden (data/systemblick.js).
// Konzept und Grenzen: docs/STATISTIK-SYSTEMBLICK.md.

import { MUSTERHAUSHALTE, HAUPTORTE, systemblickIPV } from '../src/data/systemblick.js';

const LOEHNE = [2500, 4000, 6000];
const chf = (n) => (n == null ? '—' : n.toLocaleString('de-CH').replace(/’|'/g, "'"));
const zelle = (z) => (z.art === 'betrag' ? chf(z.jahr) : z.art === 'keinAnspruch' ? '0' : 'keine Zahl');

const out = [];
out.push(`# Messung Systemblick IPV — ${new Date().toISOString().slice(0, 10)}`, '');
out.push('> Erzeugt mit `node scripts/systemblick-messen.mjs`. Prototyp, **nicht veröffentlichen**, bevor das');
out.push('> Konzept (`docs/STATISTIK-SYSTEMBLICK.md`) freigegeben und der swiss-precision-pruefer gelaufen ist.');
out.push('> Werte = Prämienverbilligung pro **Jahr** in CHF, so wie der Maloja-Rechner sie für genau dieses');
out.push('> Profil zeigen würde. Die App rechnet mit dem Nettolohn ×12, die Kantone mit ihrem eigenen');
out.push('> massgebenden Einkommen — darum ist das **kein amtlicher Kantonsvergleich**.', '');
out.push('Legende: Zahl = Verbilligung · `0` = belegt kein Anspruch · `keine Zahl` = das Kantonsmodell zeigt');
out.push('für dieses Profil bewusst keinen Betrag (Grund in der Fussnote).', '');

const gruende = new Map();
for (const [key, h] of Object.entries(MUSTERHAUSHALTE)) {
  const runs = [];
  for (const lohn of LOEHNE) runs.push(await systemblickIPV(key, lohn));
  out.push(`## ${h.bezeichnung}`, '', `Prämie Haushalt: CHF ${h.praemie} pro Monat · Nettolohn pro Monat, ohne 13.`, '');
  out.push(`| Kanton (Hauptort) | ${LOEHNE.map((l) => `Netto ${chf(l)}`).join(' | ')} |`);
  out.push(`|---|${LOEHNE.map(() => '---:').join('|')}|`);
  for (const kt of Object.keys(HAUPTORTE)) {
    const zs = runs.map((r) => r.zeilen.find((z) => z.kanton === kt));
    zs.forEach((z, i) => {
      if (z.art !== 'keineZahl') return;
      const k = `${z.grund}`;
      if (!gruende.has(k)) gruende.set(k, []);
      gruende.get(k).push(`${kt} ${key} ${chf(LOEHNE[i])}`);
    });
    out.push(`| ${kt} (${HAUPTORTE[kt].ort}) | ${zs.map(zelle).join(' | ')} |`);
  }
  out.push('', '| Kennzahl | ' + LOEHNE.map((l) => `Netto ${chf(l)}`).join(' | ') + ' |', `|---|${LOEHNE.map(() => '---:').join('|')}|`);
  for (const [label, f] of [['Kantone mit Betrag', 'mitBetrag'], ['Kantone ohne Anspruch', 'keinAnspruch'], ['Kantone ohne Zahl', 'keineZahl'], ['Tiefster Betrag', 'min'], ['Median', 'median'], ['Höchster Betrag', 'max']]) {
    out.push(`| ${label} | ${runs.map((r) => (['min', 'median', 'max'].includes(f) ? chf(r.kennzahlen[f]) : r.kennzahlen[f])).join(' | ')} |`);
  }
  out.push('');
}

out.push('## Warum «keine Zahl»', '', 'Grund (Schlüssel aus dem Kantonsmodell) → betroffene Zellen (Kanton, Haushalt, Netto).', '');
for (const [g, zellen] of [...gruende].sort((a, b) => b[1].length - a[1].length)) {
  out.push(`- \`${g}\` (${zellen.length}×): ${zellen.length > 12 ? zellen.slice(0, 12).join(' · ') + ' · …' : zellen.join(' · ')}`);
}
out.push('');
process.stdout.write(out.join('\n'));
