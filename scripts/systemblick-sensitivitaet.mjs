// Systemblick, Sensitivität und Schwellenfächer für H3 (Einelternfamilie) — Rohausgabe auf stdout.
//   node scripts/systemblick-sensitivitaet.mjs
// Liest nur data/systemblick.js und config/cantonalData.js; ändert nichts. Auswertung:
// docs/SENSITIVITAET-systemblick-h3-2026-10-24.md. Keine Nutzerdaten (Musterhaushalt nach BAG-Monitoring 2020).
const W = new URL('../src', import.meta.url).pathname;
const sb = await import(`${W}/data/systemblick.js`);
const cd = await import(`${W}/config/cantonalData.js`);
await cd.ladeIPVModelle();

const H = 'bag3';
function lauf(brutto, vermoegen) {
  return cd.CANTON_CODES.map((kt) => {
    const p = sb.musterProfil(kt, H, brutto);
    if (vermoegen) p.finanzen.savingsAccount = vermoegen;
    const ek = sb.einkommenJahr(p);
    const z = { ...sb.einordnen(kt, cd.calculateIPV(p)), praemieMonat: p.versicherungen.kkPremium };
    return { ...z, ...sb.restpraemie(z, ek), ek };
  });
}
const med = (xs) => { const s = xs.filter((x) => x != null).sort((a, b) => a - b); const n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : null; };
const f1 = (x) => (x == null ? '—' : x.toFixed(1));

console.log('## A Vermögen (Brutto 60000)');
const basis = lauf(60000, 0);
const basisKt = basis.filter((z) => z.art === 'betrag').map((z) => z.kanton);
for (const v of [0, 25000, 50000, 100000, 150000]) {
  const r = lauf(60000, v);
  const art = (a) => r.filter((z) => z.art === a).length;
  // nur die 16 Basis-Kantone, damit die Mischung gleich bleibt
  const gleich = r.filter((z) => basisKt.includes(z.kanton));
  const ipvMed = med(gleich.map((z) => (z.art === 'keineZahl' ? null : z.jahr)));
  const restMed = med(gleich.map((z) => z.belastung));
  const keineZahlNeu = gleich.filter((z) => z.art === 'keineZahl').map((z) => `${z.kanton}:${z.grund}`);
  console.log(`V ${v}: betrag ${art('betrag')} keinAnspr ${art('keinAnspruch')} keineZahl ${art('keineZahl')} | in Basis-16: IPV-Median ${ipvMed} Rest%-Median ${f1(restMed)} | neu keineZahl ${keineZahlNeu.join(' ') || '-'}`);
}
console.log('je Kanton IPV bei V 0 / 50000 / 100000:');
const v50 = lauf(60000, 50000), v100 = lauf(60000, 100000);
for (const kt of basisKt) {
  const g = (r) => { const z = r.find((x) => x.kanton === kt); return z.art === 'betrag' ? z.jahr : z.art === 'keinAnspruch' ? 0 : `?${z.grund}`; };
  console.log(`  ${kt}: ${g(basis)} / ${g(v50)} / ${g(v100)}`);
}

console.log('\n## B Schwellenfächer (Vermögen 0)');
const stufen = []; for (let b = 40000; b <= 100000; b += 4000) stufen.push(b);
const laeufe = Object.fromEntries(stufen.map((b) => [b, lauf(b, 0)]));
for (const b of stufen) {
  const r = laeufe[b];
  const n = (a) => r.filter((z) => z.art === a).length;
  console.log(`B ${b}: netto/J ${r[0].ek} betrag ${n('betrag')} keinAnspr ${n('keinAnspruch')} keineZahl ${n('keineZahl')} | IPV-Med(betrag) ${med(r.filter((z) => z.art === 'betrag').map((z) => z.jahr))} | Rest%-Med ${f1(med(r.map((z) => z.belastung)))}`);
}
// Was bleibt von 4000 mehr Brutto: Δ(Netto − Restprämie) / ΔBrutto, je Kanton, nur wo beide Stufen eine Restprämie haben
console.log('\nAbschöpfung: Anteil von 4000 CHF mehr Brutto, der NICHT beim Haushalt bleibt (Abzüge + weniger IPV)');
for (let i = 1; i < stufen.length; i++) {
  const a = laeufe[stufen[i - 1]], b = laeufe[stufen[i]];
  const q = cd.CANTON_CODES.map((kt) => {
    const x = a.find((z) => z.kanton === kt), y = b.find((z) => z.kanton === kt);
    if (x.restJahr == null || y.restJahr == null) return null;
    const bleibt = (y.ek - y.restJahr) - (x.ek - x.restJahr);
    return { kt, abschoepf: 1 - bleibt / 4000 };
  }).filter(Boolean);
  const hoch = q.filter((z) => z.abschoepf >= 0.5).map((z) => `${z.kt} ${Math.round(z.abschoepf * 100)}%`);
  const ueber100 = q.filter((z) => z.abschoepf > 1).map((z) => z.kt);
  console.log(`${stufen[i - 1]}→${stufen[i]}: n ${q.length}, Median ${Math.round(med(q.map((z) => z.abschoepf)) * 100)} %, ≥50 %: ${hoch.join(', ') || '-'}${ueber100.length ? ' | >100 % (weniger übrig): ' + ueber100.join(', ') : ''}`);
}
