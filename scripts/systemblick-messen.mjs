// Systemblick messen — die sieben Modellhaushalte des BAG-Monitorings durch alle 26 Kantonsmodelle
// der Prämienverbilligung, als Markdown.
//
//   node scripts/systemblick-messen.mjs > docs/MESSUNG-systemblick-ipv-<datum>.md
//
// Schreibt nur auf stdout. Keine Nutzerdaten: die Haushalte sind die Modellhaushalte des BAG-Monitorings
// (data/systemblick.js). Konzept und Grenzen: docs/STATISTIK-SYSTEMBLICK.md.
// Fachprüfung 24.10.2026: swiss-precision-, rechts- und copy-pruefer eingearbeitet.

import { MUSTERHAUSHALTE, HAUPTORTE, systemblickIPV, musterProfil } from '../src/data/systemblick.js';

const chf = (n) => (n == null ? '—' : Math.round(n).toLocaleString('de-CH').replace(/’/g, "'"));
const pct = (n) => (n == null ? '—' : `${Math.round(n)} %`);
// «kein Anspruch im Modell» statt einer nackten 0: das Ergebnis hängt an Maloja-Annahmen, nicht nur am Kanton.
const zelle = (z) => (z.art === 'betrag' ? chf(z.jahr) : z.art === 'keinAnspruch' ? 'kein Anspruch im Modell' : 'keine Zahl');
const kurz = (k) => `H${k.slice(3)}`; // bag3 → H3
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

// Klartext zu den Gründen, aus den Kommentaren der Kantonsmodule (src/config/ipv*.js). Jeder Satz sagt,
// was MALOJA nicht kann oder nicht weiss — nie, dass eine kantonale Regel unklar oder falsch sei.
const GRUND = {
  haushalt: 'Zwei Erwachsene im Haushalt: rechnet Maloja noch nicht.',
  alter: 'Junge erwachsene Person (19–25) bzw. Altersgrenze: rechnet Maloja nicht.',
  ausbildung: 'Junge erwachsene Person: hängt an einer Ausbildung, nach der Maloja nicht fragt.',
  geJungeErwachsene: 'Junge erwachsene Person: eigene Kategorie, rechnet Maloja nicht.',
  neJeuneAdulte: 'Junge erwachsene Person: eigene Kategorie, rechnet Maloja nicht.',
  vsJungeErwachsene: 'Junge erwachsene Person: eigene Kategorie, rechnet Maloja nicht.',
  tgSteuerbetrag: 'Der Kanton rechnet mit dem Steuerbetrag; den kann Maloja nicht verlässlich schätzen.',
  steuerbaresEinkommen: 'Der Kanton rechnet mit dem steuerbaren Einkommen; das kann Maloja nicht verlässlich schätzen.',
  soSkalaUnklarFristVorbei: 'Maloja zeigt hier nur eine Spanne, keinen Einzelbetrag; die Gesuchsfrist für 2026 ist zudem vorbei.',
  soSkalaUnklar: 'Maloja zeigt hier nur eine Spanne, keinen Einzelbetrag.',
  mindestanspruch: 'Mindestverbilligung für Kinder: Maloja kann den Betrag mit den vorhandenen Angaben nicht sicher bestimmen.',
  agKinder: 'Mindestanspruch der Kinder: braucht deren tatsächliche Prämien, die das Musterprofil nicht einzeln führt.',
  grKinder: 'Haushalt mit Kindern: zwei Lesarten der Regel ergeben verschiedene Beträge; Maloja zeigt darum keinen.',
  tiKinder: 'Haushalt mit Kindern: in Maloja noch nicht gebaut.',
  szKinderMindestanspruch: 'Mindestanspruch der Kinder: Verteilung bei der SVA angefragt, in Maloja noch offen.',
  szGrenzeMietzinsregion: 'Knapp über der Grenze hängt der Anspruch an Mietzinsregion und Alter; Maloja zeigt darum keinen Betrag.',
  zgNaeherung: 'Nahe an der Grenze: Maloja kann nicht sicher sagen, ob ein Anspruch besteht.',
};
const grundText = (g) => `${GRUND[g] || 'Grund ohne Klartext (bitte ergänzen).'} (\`${g}\`)`;

const runs = {};
for (const key of Object.keys(MUSTERHAUSHALTE)) runs[key] = await systemblickIPV(key);
const mitZahl = Object.keys(runs).filter((k) => runs[k].zeilen.some((z) => z.art !== 'keineZahl'));
const ohneZahl = Object.keys(runs).filter((k) => !mitZahl.includes(k));
const datum = new Date().toISOString().slice(0, 10);

const out = [];
out.push(`# Messung Systemblick Prämienverbilligung — Modellhaushalte nach BAG-Monitoring 2020 — ${datum}`, '');
out.push('> **Intern, nicht veröffentlichen**, bevor das Konzept (`docs/STATISTIK-SYSTEMBLICK.md`) freigegeben ist.');
out.push('> Die Spalte H1 (Person im Rentenalter) ist auch dann **nicht zur Veröffentlichung** bestimmt: ihr Ergebnis hängt an');
out.push('> den Annahmen (Vermögen 0, keine Abzüge) stärker als an den Regeln der Kantone.', '');
out.push(`> Modellrechnung von Maloja mit erfundenen Musterhaushalten, Stand ${datum}. Die Zahlen zeigen, wie verschieden`);
out.push('> die kantonalen Regeln wirken. Sie sagen nicht, was eine bestimmte Person erhält. Maloja rechnet vereinfacht');
out.push('> (siehe Methode). Die Kantone rechnen mit ihrem eigenen massgebenden Einkommen. Kein amtlicher Vergleich, weder');
out.push('> vom BAG noch von den Kantonen berechnet oder geprüft. Ob und wie viel Verbilligung jemand erhält, entscheidet');
out.push('> allein die zuständige Stelle des Kantons. Fehler gefunden? info@malojaplana.ch', '');

out.push('## Methode', '');
out.push('**Haushalte:** die sieben Modellhaushalte aus Ecoplan im Auftrag des BAG, «Wirksamkeit der Prämienverbilligung –');
out.push('Monitoring 2020», Mai 2022, S. 12 (Abb. K-2), mit deren Bruttoeinkommen. Die Bezeichnungen hier sind neutral gefasst;');
out.push('der Wortlaut des BAG steht in der Quellenzeile je Haushalt. Das BAG hat die Beträge unten weder berechnet noch geprüft.');
out.push('**Von Maloja gesetzt** (nicht vom BAG): Geburtsjahre; Kinderalter ganzzahlig; Netto aus Brutto mit dem App-Richtwert,');
out.push('**ohne Familienzulagen** (das BAG zählt sie dazu, Anhang B S. 132); **Vermögen 0** (alle Kantone rechnen einen Teil');
out.push('des Vermögens an, BAG S. 11); Rente = AHV-Maximalrente 2026 + BVG-Rest; Franchise CHF 300; ohne 13. Monatslohn.');
out.push('**Prämie:** regionale Durchschnittsprämie 2026 am Hauptort je Person, Standardmodell, alle Versicherer. Das ist weder');
out.push('die «Standardprämie» (teuerste Region) noch die «Mittlere Prämie» (effektiv bezahlt) des Monitorings (BAG S. 134).');
out.push('**Lesart:** Werte = Prämienverbilligung pro Jahr in CHF, so wie der Maloja-Rechner sie für genau dieses Profil zeigen');
out.push('würde. «kein Anspruch im Modell» = Maloja kommt mit diesen Annahmen auf keinen Anspruch · «keine Zahl» = Maloja');
out.push('zeigt für dieses Profil bewusst keinen Betrag (Grund unten).', '');

out.push('## Haushalte, für die Maloja rechnen kann', '');
for (const k of mitZahl) {
  const h = MUSTERHAUSHALTE[k];
  const netto = musterProfil('ZH', k).finanzen;
  const einkommen = h.rente ? `Rente CHF ${chf(h.bruttoJahr)}/Jahr` : `Brutto CHF ${chf(h.bruttoJahr)}/Jahr ≈ Netto CHF ${chf(netto.monthlyIncome)}/Monat`;
  out.push(`- **${kurz(k)} · ${h.bezeichnung.replace(/^Haushalt \d · /, '')}** — ${einkommen} · BAG: «${h.bezeichnungBag}»`);
}
out.push('');
out.push('Je Zelle: Verbilligung CHF pro Jahr · Haushaltsprämie CHF pro Monat · verbilligter Anteil der Prämie.', '');
out.push(`| Kanton (Hauptort) | ${mitZahl.map(kurz).join(' | ')} |`);
out.push(`|---|${mitZahl.map(() => '---:').join('|')}|`);
for (const kt of Object.keys(HAUPTORTE)) {
  const zs = mitZahl.map((k) => runs[k].zeilen.find((z) => z.kanton === kt));
  out.push(`| ${kt} (${HAUPTORTE[kt].ort}) | ${zs.map((z) => `${zelle(z)} · ${chf(z.praemieMonat)} · ${pct(anteil(z))}`).join(' | ')} |`);
}
out.push('', `| Kennzahl | ${mitZahl.map(kurz).join(' | ')} |`, `|---|${mitZahl.map(() => '---:').join('|')}|`);
const zeile = (label, f) => out.push(`| ${label} | ${mitZahl.map((k) => f(runs[k])).join(' | ')} |`);
zeile('Kantone mit Betrag', (r) => r.kennzahlen.mitBetrag);
zeile('Kantone «kein Anspruch im Modell»', (r) => r.kennzahlen.keinAnspruch);
zeile('Kantone «keine Zahl»', (r) => r.kennzahlen.keineZahl);
zeile('Tiefster Betrag (CHF/Jahr, nur Kantone mit Betrag)', (r) => chf(r.kennzahlen.min));
zeile('Median Betrag (CHF/Jahr, nur Kantone mit Betrag)', (r) => chf(r.kennzahlen.median));
zeile('Höchster Betrag (CHF/Jahr, nur Kantone mit Betrag)', (r) => chf(r.kennzahlen.max));
zeile('Median verbilligter Anteil (mit Betrag UND «kein Anspruch» = 0 %)', (r) => pct(median(r.zeilen.map(anteil))));
out.push('');

// Restprämie: was der Haushalt nach der Verbilligung selbst trägt (data/systemblick.js → restpraemie).
const pct1 = (n) => (n == null ? '—' : `${n.toFixed(1)} %`);
const restZelle = (z) => (z.restJahr != null ? `${chf(z.restJahr)} · ${pct1(z.belastung)}`
  : z.restOffen ? 'keine Zahl (Verbilligung über Musterprämie)' : 'keine Zahl');
out.push('## Restprämie', '');
out.push('Die Verbilligung allein sagt nicht, was ein Haushalt trägt: Wo die Prämie hoch ist, ist meist auch die Verbilligung');
out.push('hoch. **Restprämie** = Jahresprämie − Verbilligung (bei «kein Anspruch im Modell» die ganze Prämie). Dazu die');
out.push('**Restprämie in % des Netto-Richtwerts** (Einkommen, mit dem die App rechnet: Nettolohn-Richtwert × 12 bzw. Rente × 12;');
out.push('ohne 13. Monatslohn, ohne Familienzulagen, ohne Steuern). **Nicht vergleichbar** mit der «verbleibenden');
out.push('Prämienbelastung» des BAG (13.7 % bzw. 9.4 %, S. 13): Das BAG teilt durch das verfügbare Einkommen (Steuern abgezogen,');
out.push('mit Familienzulagen, Anhang B S. 132/134) und rechnet mit einer anderen Prämie. Ähnliche Werte sind Zufall.');
out.push('Anders als beim Median der Verbilligung zählt «kein Anspruch im Modell» hier mit: dieser Haushalt trägt die ganze');
out.push('Prämie. «Verbilligung über Musterprämie»: Die Verbilligung des Kantonsmodells liegt über der Musterprämie (z. B. AR,');
out.push('Konzept); eine negative Restprämie gibt es nicht, darum keine Zahl.', '');
out.push(`Einkommen pro Jahr: ${mitZahl.map((k) => `${kurz(k)} CHF ${chf(runs[k].einkommenJahr)}`).join(' · ')}.`, '');
out.push('Je Zelle: Restprämie CHF pro Jahr · Restprämie in % des Netto-Richtwerts.', '');
out.push(`| Kanton (Hauptort) | ${mitZahl.map(kurz).join(' | ')} |`);
out.push(`|---|${mitZahl.map(() => '---:').join('|')}|`);
for (const kt of Object.keys(HAUPTORTE)) {
  const zs = mitZahl.map((k) => runs[k].zeilen.find((z) => z.kanton === kt));
  out.push(`| ${kt} (${HAUPTORTE[kt].ort}) | ${zs.map(restZelle).join(' | ')} |`);
}
out.push('', `| Kennzahl | ${mitZahl.map(kurz).join(' | ')} |`, `|---|${mitZahl.map(() => '---:').join('|')}|`);
zeile('Kantone mit Restprämie (mit Betrag oder «kein Anspruch»)', (r) => r.kennzahlenRest.mitRest);
zeile('Kantone «Verbilligung über Musterprämie»', (r) => r.kennzahlenRest.restOffen);
zeile('Tiefste Restprämie (CHF/Jahr)', (r) => chf(r.kennzahlenRest.restMin));
zeile('Median Restprämie (CHF/Jahr)', (r) => chf(r.kennzahlenRest.restMedian));
zeile('Höchste Restprämie (CHF/Jahr)', (r) => chf(r.kennzahlenRest.restMax));
zeile('Tiefste Restprämie in % des Netto-Richtwerts', (r) => pct1(r.kennzahlenRest.belastungMin));
zeile('Median Restprämie in % des Netto-Richtwerts', (r) => pct1(r.kennzahlenRest.belastungMedian));
zeile('Höchste Restprämie in % des Netto-Richtwerts', (r) => pct1(r.kennzahlenRest.belastungMax));
out.push('');

out.push('## Haushalte, für die Maloja heute keine Zahl nennen kann', '');
out.push('In allen 26 Kantonen «keine Zahl». In 24 Kantonen liegt das an Maloja: Paare und junge Erwachsene (19–25) rechnet');
out.push('die App noch nicht. In TG und JU nennt Maloja schon vorher keine Zahl, weil das Kantonsmodell eine Steuergrösse braucht,');
out.push('die die App nicht verlässlich schätzen kann. Über die Regeln der Kantone sagt das nichts.', '');
for (const k of ohneZahl) {
  const h = MUSTERHAUSHALTE[k];
  const gr = [...new Set(runs[k].zeilen.map((z) => z.grund))].map((g) => `\`${g}\``).join(', ');
  out.push(`- **${kurz(k)} · ${h.bezeichnung.replace(/^Haushalt \d · /, '')}** — Brutto CHF ${chf(h.bruttoJahr)}/Jahr · BAG: «${h.bezeichnungBag}» · Gründe: ${gr}`);
}
out.push('');

const gruende = new Map();
for (const k of mitZahl) {
  for (const z of runs[k].zeilen) {
    if (z.art !== 'keineZahl') continue;
    if (!gruende.has(z.grund)) gruende.set(z.grund, []);
    gruende.get(z.grund).push(`${z.kanton} ${kurz(k)}`);
  }
}
out.push('## Warum «keine Zahl» (rechenbare Haushalte)', '');
for (const [g, zellen] of [...gruende].sort((a, b) => b[1].length - a[1].length)) out.push(`- ${grundText(g)} — ${zellen.join(' · ')}`);
out.push('');
process.stdout.write(out.join('\n'));
