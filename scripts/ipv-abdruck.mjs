// Abdruck des IPV-Verhaltens — das Beweismittel für einen verhaltensgleichen Umbau.
//
// Läuft VOR und NACH dem Umbau über denselben Fächer von Eingaben und schreibt das
// Ergebnis als sortiertes JSON. Sind die zwei Dateien zeichengleich, hat der Umbau
// nichts am Verhalten geändert — das ist mehr, als grüne Tests zeigen können, weil
// die Tests nur prüfen, woran jemand gedacht hat.
//
//   node scripts/ipv-abdruck.mjs vorher.json
//   node scripts/ipv-abdruck.mjs nachher.json
//   diff vorher.json nachher.json

import { calculateIPV, preloadPLZ } from '../src/config/cantonalData.js';

const ZIEL = process.argv[2];
if (!ZIEL) {
  console.error('Aufruf: node scripts/ipv-abdruck.mjs <zieldatei.json>');
  process.exit(2);
}

// Die Lazy-Chunks müssen geladen sein, sonst antwortet jeder Kanton nur «laden».
preloadPLZ();
await import('../src/data/plzGemeinde.js');
await import('../src/config/ipvZuerich.js');
await import('../src/config/ipvBern.js');
await import('../src/config/ipvAargau.js');
await new Promise((r) => setTimeout(r, 50));

// Bewusst breit gefächert: jeder Riegel soll von beiden Seiten getroffen werden.
const KANTONE = ['ZH', 'BE', 'AG', 'LU', 'SG', 'XX'];
const ORTE = [
  ['8001', 'Zürich'], ['8620', 'Wetzikon'], ['3011', 'Bern'], ['3634', 'Thierachern'],
  ['5000', 'Aarau'], ['9000', 'St.Gallen'], ['0000', 'Nirgendwo'], ['', ''],
];
const EINKOMMEN = [0, 800, 1500, 2500, 4000, 6000, 9000, 20000];
const PRAEMIEN = [null, 0, 200, 450, 700];
const GEBURT = ['1980-05-01', '2000-05-01', '2001-05-01', '2002-05-01', null];
const KINDER = [
  [],
  [{ age: 5 }],
  [{ age: 5 }, { age: 12 }],
  [{ age: 20 }],
  [{}],                      // Kind ohne Alter — der ZH-Befund vom 20.09.
];
const STAND = ['single', 'married', 'cohabiting'];
const VERMOEGEN = [0, 50000, 300000];

const faelle = [];
let n = 0;
for (const canton of KANTONE) {
  for (const [postalCode, city] of ORTE) {
    for (const monthlyIncome of EINKOMMEN) {
      for (const kkPremium of PRAEMIEN) {
        for (const dateOfBirth of GEBURT) {
          for (const children of KINDER) {
            for (const maritalStatus of STAND) {
              for (const savingsAccount of VERMOEGEN) {
                // Vollständig wäre das eine Explosion; jeder 7. Fall deckt den Fächer
                // gleichmässig ab und hält die Datei lesbar.
                if (n++ % 7 !== 0) continue;
                const eingabe = {
                  basis: { canton, dateOfBirth, maritalStatus, household: { adults: 1, children } },
                  finanzen: { monthlyIncome, savingsAccount },
                  wohnen: { postalCode, city },
                  versicherungen: kkPremium != null ? { kkPremium } : {},
                };
                let ausgabe;
                try {
                  ausgabe = calculateIPV(eingabe);
                } catch (e) {
                  ausgabe = { FEHLER: e.message };
                }
                faelle.push({ eingabe, ausgabe });
              }
            }
          }
        }
      }
    }
  }
}

// Zweiter Fächer, gezielt: im ersten laufen die meisten Fälle in einen Riegel
// (Haushalt, Alter), und gerade die Fälle MIT Betrag sind dort dünn. Hier nur
// Eingaben, die durchkommen — damit der Abdruck auch die Rechnung selbst festhält
// und nicht bloss die Riegel davor.
const RECHEN_ORTE = [['8001', 'Zürich'], ['8620', 'Wetzikon'], ['8750', 'Glarus'],
  ['3011', 'Bern'], ['3634', 'Thierachern'], ['2502', 'Biel'], ['5000', 'Aarau'], ['5610', 'Wohlen']];
for (const canton of ['ZH', 'BE', 'AG']) {
  for (const [postalCode, city] of RECHEN_ORTE) {
    for (const monthlyIncome of [0, 500, 1200, 1800, 2400, 3000, 3600, 4200, 5000, 6000]) {
      for (const kkPremium of [150, 320, 480, 650]) {
        for (const children of KINDER.slice(0, 3)) {
          for (const savingsAccount of [0, 30000, 90000]) {
            for (const pension3a of [0, 7056]) {
              const eingabe = {
                basis: { canton, dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children } },
                finanzen: { monthlyIncome, savingsAccount, pension3a },
                wohnen: { postalCode, city },
                versicherungen: { kkPremium },
              };
              let ausgabe;
              try {
                ausgabe = calculateIPV(eingabe);
              } catch (e) {
                ausgabe = { FEHLER: e.message };
              }
              faelle.push({ eingabe, ausgabe });
            }
          }
        }
      }
    }
  }
}

// Schlüssel sortiert, damit ein Diff nur echte Unterschiede zeigt und nicht
// die Reihenfolge, in der ein Objekt zufällig gebaut wurde.
const sortiert = (x) => {
  if (Array.isArray(x)) return x.map(sortiert);
  if (x && typeof x === 'object') {
    return Object.fromEntries(Object.keys(x).sort().map((k) => [k, sortiert(x[k])]));
  }
  return x;
};

const { writeFileSync } = await import('node:fs');
writeFileSync(ZIEL, JSON.stringify(sortiert(faelle), null, 1) + '\n');
console.log(`${faelle.length} Fälle aus ${n} Kombinationen → ${ZIEL}`);
