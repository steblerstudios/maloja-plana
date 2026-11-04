// ─── Figuren und Zahlen für die Hintergrundseiten ────────────────────────────
//
// Die Hintergrundseite /krankenkasse/ (scripts/seiten/krankenkasse.mjs) nennt
// Zahlen — anders als die Erklärseiten. Damit sie nicht zu Handabschriften
// werden, kommt alles, was Maloja selbst führt, beim Bauen aus Malojas Daten:
//
//   • Prämien 2027 je Kantonsregion   src/data/praemienRegionenDaten.js
//   • Schweizer Mittel 2027           src/data/praemienRegionen.js
//   • Franchisen, Selbstbehalt, Dach  src/data/kvgLeistungen.js
//   • Kantonsnamen                    src/i18n/de.js
//
// Was Maloja nicht führt (BAG-Kostenstatistik EFIND 2024), steht hier einmal,
// mit Quelle, und speist Figur UND Tabelle — es gibt keine zweite Abschrift.
//
// Die Figuren sind ruhige, statische SVG ohne Skript: die Seite lädt weiterhin
// kein JavaScript (CSP default-src 'none'). Farben kommen über Klassen aus dem
// Seitenstil, damit hell und dunkel stimmen.
//
// Build-Zeit — liegt bewusst NICHT unter src/, damit nichts ins Bundle rutscht.

import { PRAEMIEN, PRAEMIEN_QUELLEN } from '../src/data/praemienRegionenDaten.js';
import { NATIONAL_AVG_PREMIUM_JE_JAHR } from '../src/data/praemienRegionen.js';
import {
  FRANCHISE_STUFEN, SELBSTBEHALT_RATE, SELBSTBEHALT_MAX, SELBSTBEHALT_MAX_KINDER, berechneFranchise,
} from '../src/data/kvgLeistungen.js';
import de from '../src/i18n/de.js';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const FIGUREN = resolve(dirname(fileURLToPath(import.meta.url)), 'seiten', 'figuren');

export const PRAEMIENJAHR = '2027';

// ─── Zahlenformat ────────────────────────────────────────────────────────────
// Schweizer Schreibweise wie im übrigen Text: 50'000, 324.90.
const tausender = (s) => s.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
export const fr = (n) => tausender(String(Math.round(n)));
export const rp = (n) => {
  const [ganz, rest] = Number(n).toFixed(2).split('.');
  return `${tausender(ganz)}.${rest}`;
};

// ─── BAG EFIND 2024 — nicht in Maloja geführt, darum hier, einmal ────────────
// Kostenstufen: Tabelle 1.1, auf 100 Menschen gerundet. Die Höhe ist die Mitte
// der Stufe; die oberste steht auf ihrer Untergrenze (über 50'000).
export const DORF_STUFEN = [
  { menschen: 16, hoehe: 0, gruppe: 'nichts abgerechnet' },
  { menschen: 19, hoehe: 250, gruppe: "bis 2'000 Franken" },
  { menschen: 12, hoehe: 750, gruppe: "bis 2'000 Franken" },
  { menschen: 14, hoehe: 1500, gruppe: "bis 2'000 Franken" },
  { menschen: 18, hoehe: 3500, gruppe: "2'000 bis 10'000 Franken" },
  { menschen: 10, hoehe: 7500, gruppe: "2'000 bis 10'000 Franken" },
  { menschen: 6, hoehe: 15000, gruppe: "10'000 bis 50'000 Franken" },
  { menschen: 4, hoehe: 35000, gruppe: "10'000 bis 50'000 Franken" },
  { menschen: 1, hoehe: 50000, gruppe: "über 50'000 Franken" },
];

// Kosten je versicherte Person nach Alter, nach Abzug der Kostenbeteiligung,
// Tabelle 2.2. Schnitt ab 26: gewichtet ab 26 Jahren (eigene Rechnung).
export const ALTER_KOSTEN = [
  ['0–5', 1622], ['6–10', 1126], ['11–15', 1445], ['16–20', 1715], ['21–25', 1703], ['26–30', 1903],
  ['31–35', 2252], ['36–40', 2252], ['41–45', 2349], ['46–50', 2779], ['51–55', 3454], ['56–60', 4203],
  ['61–65', 5233], ['66–70', 6690], ['71–75', 8488], ['76–80', 10582], ['81–85', 12738], ['86–90', 15710],
  ['über 90', 20389],
];
export const ALTER_SCHNITT_AB_26 = 4863;

// Kosten je Person 2024 in sechs Kantonen (Franken im Jahr) — nur für die
// Vergleichstabelle; die Prämien daneben kommen aus Malojas Daten.
export const KANTON_KOSTEN_2024 = { ZG: 3869, AI: 3366, ZH: 4516, BS: 5591, TI: 5796, GE: 5616 };

// ─── Prämien 2027 aus Malojas Daten ──────────────────────────────────────────
// PRAEMIEN[Jahr][Kanton+Region] = [Kinder, Junge Erwachsene, Erwachsene].
// Region 0 heisst: der Kanton hat nur eine Prämienregion. Für Kantone mit
// mehreren Regionen führt die BAG-Datei nur die Werte je Region, keinen
// Kantonsmittelwert — die Seite zeigt darum ehrlich die Spanne der Regionen
// statt einer selbst gemittelten Zahl.
export function kantonsPraemien(jahr = PRAEMIENJAHR) {
  const tabelle = PRAEMIEN[jahr];
  if (!tabelle) throw new Error(`Keine Prämien für ${jahr} in praemienRegionenDaten.js`);
  const je = {};
  for (const [schluessel, werte] of Object.entries(tabelle)) {
    const k = schluessel.slice(0, 2), region = Number(schluessel.slice(2));
    (je[k] ||= []).push({ region, erwachsene: werte[2] });
  }
  return Object.entries(je).map(([kanton, regionen]) => {
    regionen.sort((a, b) => a.region - b.region);
    const werte = regionen.map((r) => r.erwachsene);
    return {
      kanton,
      name: de.cantons[kanton],
      regionen,
      tief: Math.min(...werte),
      hoch: Math.max(...werte),
      eineRegion: regionen.length === 1,
    };
  }).sort((a, b) => a.hoch - b.hoch || a.kanton.localeCompare(b.kanton));
}

export const praemienQuelle = (jahr = PRAEMIENJAHR) => PRAEMIEN_QUELLEN[jahr];

const praemieText = (k) => (k.eineRegion
  ? rp(k.tief)
  : `${rp(k.tief)} bis ${rp(k.hoch)} <span class="leise">(${k.regionen.length} Regionen)</span>`);

// ─── Platzhalter im Text ─────────────────────────────────────────────────────
// Der Text schreibt {{schluessel}}; hier steht, woher die Zahl kommt. Ein
// unbekannter Schlüssel bricht den Bau ab, statt leer durchzurutschen.
export function zahlen() {
  const mittel = NATIONAL_AVG_PREMIUM_JE_JAHR[PRAEMIENJAHR];
  if (!mittel) throw new Error(`Kein Schweizer Mittel für ${PRAEMIENJAHR}`);
  const kantone = kantonsPraemien();
  const billig = kantone[0], teuer = kantone[kantone.length - 1];
  // Der Text sagt «im Schnitt in …» — das stimmt nur für Kantone mit einer Region.
  if (!billig.eineRegion || !teuer.eineRegion) {
    throw new Error(`Tiefster oder höchster Wert ist eine Region (${billig.kanton}/${teuer.kanton}) — Satz «im Schnitt in …» in krankenkasse.mjs anpassen`);
  }
  const frMin = Math.min(...FRANCHISE_STUFEN), frMax = Math.max(...FRANCHISE_STUFEN);
  // Höchstrabatt für eine höhere Franchise: 70 % des zusätzlichen Risikos (KVV Art. 95 Abs. 2bis).
  const rabattJahr = 0.7 * (frMax - frMin);
  const dorf = (gruppe) => DORF_STUFEN.filter((s) => s.gruppe === gruppe).reduce((n, s) => n + s.menschen, 0);
  return {
    jahr: PRAEMIENJAHR,
    'mittel.erwachsene': rp(mittel.erwachsene),
    'mittel.junge': rp(mittel.junge),
    'mittel.kinder': rp(mittel.kinder),
    'mittel.gesamt': rp(mittel.gesamt),
    'mittel.gesamtFr': fr(mittel.gesamt),
    // 16 bis 19 % vermeidbare Kosten (INFRAS/WIG), grob auf 5 Franken gerundet.
    'vermeidbar.tief': fr(Math.floor((0.16 * mittel.gesamt) / 5) * 5),
    'vermeidbar.hoch': fr(Math.ceil((0.19 * mittel.gesamt) / 5) * 5),
    'kanton.tiefName': billig.name,
    'kanton.tief': rp(billig.tief),
    'kanton.hochName': teuer.name,
    'kanton.hoch': rp(teuer.hoch),
    'franchise.min': fr(frMin),
    'franchise.max': fr(frMax),
    'franchise.differenz': fr(frMax - frMin),
    'selbstbehalt.satz': String(Math.round(SELBSTBEHALT_RATE * 100)),
    'selbstbehalt.max': fr(SELBSTBEHALT_MAX),
    'selbstbehalt.kinder': fr(SELBSTBEHALT_MAX_KINDER),
    'dach.min': fr(frMin + SELBSTBEHALT_MAX),
    'dach.max': fr(frMax + SELBSTBEHALT_MAX),
    'rabatt.jahr': fr(rabattJahr),
    'rabatt.monat': fr(rabattJahr / 12),
    'dorf.null': String(dorf('nichts abgerechnet')),
    'dorf.bis2000': String(dorf("bis 2'000 Franken")),
    'dorf.bis10000': String(dorf("2'000 bis 10'000 Franken")),
    'dorf.bis50000': String(dorf("10'000 bis 50'000 Franken")),
    'dorf.ueber50000': String(dorf("über 50'000 Franken")),
    'alter.schnitt': fr(ALTER_SCHNITT_AB_26),
    'alter.jung': fr(ALTER_KOSTEN.find(([a]) => a === '26–30')[1]),
    'alter.alt': fr(ALTER_KOSTEN.find(([a]) => a === '81–85')[1]),
  };
}

// `ctx` zählt die Abbildungen über die ganze Seite (Abb. 1, 2, …).
export function einsetzen(html, werte, bloecke = {}, ctx = { abb: 0 }) {
  return html
    .replace(/<!--(FIG|TAB):([a-z]+)-->/g, (_, art, name) => {
      const f = bloecke[`${art}:${name}`];
      if (!f) throw new Error(`Unbekannter Block ${art}:${name}`);
      return f(ctx);
    })
    .replace(/\{\{([a-zA-Z0-9.]+)\}\}/g, (_, k) => {
      if (!(k in werte)) throw new Error(`Unbekannte Zahl {{${k}}}`);
      return werte[k];
    });
}

// ─── Standbilder: Hairline- und Anatomy-Figuren ──────────────────────────────
// Die Figuren aus «Krankenkasse erklärt», im Ruhezustand als SVG abgelegt
// (scripts/seiten/figuren/_HERKUNFT.md). Hier bekommen sie Titel und
// Beschreibung für Vorlese-Programme und eine Karte im Maloja-Stil: «Abb. n»
// oben links, Kurztitel oben rechts, der Wert unten rechts. Im Bild selbst
// steht kein Text — so bleibt es auf dem Handy lesbar, und die Zahlen stehen
// in Zeilen und Tabellen darunter (Farb- und Daten-System: keine Labels auf
// dem Balken).
const svgEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function standbildSvg(datei, id, titel, beschreibung) {
  const roh = readFileSync(resolve(FIGUREN, datei), 'utf8');
  const kopf = roh.match(/^<svg\b[^>]*>/);
  const vb = kopf && kopf[0].match(/viewBox="([^"]+)"/);
  if (!vb) throw new Error(`${datei}: kein <svg viewBox> am Anfang`);
  // Der Kopf wird ersetzt (er trägt bei Anatomy den xmlns-Namensraum); geprüft wird der Inhalt.
  const innen = roh.slice(kopf[0].length, roh.lastIndexOf('</svg>'));
  if (/<script|<foreignObject|<image|\bon[a-z]+\s*=\s*"|javascript:|https?:/i.test(innen)) {
    throw new Error(`${datei}: enthält Ausführbares oder einen Fremdverweis`);
  }
  return `<svg viewBox="${vb[1]}" role="img" aria-labelledby="${id}-t ${id}-d" focusable="false">` +
    `<title id="${id}-t">${svgEsc(titel)}</title><desc id="${id}-d">${svgEsc(beschreibung)}</desc>${innen}</svg>`;
}

function abbildung(ctx, { id, datei, stil, kurz, titel, beschreibung, wert, legende, nachher = '' }) {
  ctx.abb += 1;
  return `
        <figure class="abb" id="${id}">
          <div class="abb-karte">
            <p class="abb-kopf" aria-hidden="true"><span>Abb. ${ctx.abb}</span><span>${kurz}</span></p>
            <div class="abb-bild ${stil}">${standbildSvg(datei, id, titel, beschreibung)}</div>
            <p class="abb-fuss"><span class="abb-wert">${wert}</span></p>
          </div>
          <figcaption><strong>Abb. ${ctx.abb}.</strong> ${legende}</figcaption>${nachher}
        </figure>`;
}

export function figurPraemie(ctx) {
  const m = NATIONAL_AVG_PREMIUM_JE_JAHR[PRAEMIENJAHR];
  return abbildung(ctx, {
    id: 'abb-praemie', datei: 'krankenkasse-praemie.svg', stil: 'iso', kurz: 'Die Prämie als Messaufbau',
    titel: `Die Prämie als Messaufbau, Prämienjahr ${PRAEMIENJAHR}`,
    beschreibung: 'Auf einer Grundplatte steht ein Stapel aus Endmassen, jedes so hoch wie eine Kostengruppe der Grundversicherung je Monat und Person. Daneben steht ein Höhenmessgerät auf einem Sockel. Der Sockel ist so hoch wie der eigene Anteil der Versicherten; dort liegt der Nullpunkt. Der Taster liegt oben auf dem Stapel und zeigt die mittlere Monatsprämie.',
    wert: `${PRAEMIENJAHR} · mittlere Prämie ${fr(m.gesamt)} Fr.`,
    legende: 'Der Stapel zeigt, was die Grundversicherung je Person und Monat kostet: sechs Kostenblöcke, oben ein schmaler Rest für Verwaltung und Reserven. Der Sockel ist der eigene Anteil aus Franchise und Selbstbehalt; er zählt nicht zur Prämie. Der Taster misst den Teil darüber, die mittlere Prämie. Blöcke nach dem BAG-Faktenblatt 2025, gleichmässig mit dem Kostenwachstum hochgerechnet (eigene Rechnung). [[q:leistungen2025]] [[q:mittel]]',
  });
}

export function figurDorf(ctx) {
  const z = zahlen();
  return abbildung(ctx, {
    id: 'abb-dorf', datei: 'krankenkasse-dorf.svg', stil: 'hl', kurz: 'Ein Dorf mit 100 Menschen',
    titel: 'Ein Dorf mit 100 Menschen, ein Haus je Person, so hoch wie ihre Kosten 2024',
    beschreibung: `Ein Raster aus hundert Häusern. Die meisten sind flach oder niedrig, ${z['dorf.null']} haben gar keine Höhe. Wenige stehen hoch, und ein einziger Turm in der Mitte überragt alle: er steht für Kosten über 50'000 Franken.`,
    wert: `${z['dorf.null']} ohne Rechnung · 1 über 50'000 Fr.`,
    legende: 'Jedes Haus ist ein Mensch, die Höhe ist, was 2024 für diese Person über die Grundversicherung abgerechnet wurde, ohne Kantonsanteil am Spital. Das höchste Haus steht auf der Untergrenze von 50\'000 Franken; in Wirklichkeit ragt es oft weit höher. [[q:efind]]',
  });
}

export function figurAlter(ctx) {
  const z = zahlen();
  return abbildung(ctx, {
    id: 'abb-alter', datei: 'krankenkasse-alter.svg', stil: 'hl', kurz: 'Kosten nach Alter',
    titel: 'Kosten je versicherte Person nach Alter, 2024',
    beschreibung: `Eine Reihe von neunzehn Säulen, eine je Altersgruppe von 0–5 bis über 90 Jahre. Sie bleiben bis Mitte fünfzig niedrig und steigen dann steil an; die letzte ist die höchste mit ${fr(ALTER_KOSTEN[ALTER_KOSTEN.length - 1][1])} Franken. Die erste Säule über dem Schnitt aller ab 26 ist hervorgehoben.`,
    wert: `26–30: ${z['alter.jung']} Fr. · 81–85: ${z['alter.alt']} Fr.`,
    legende: `Eine Säule je Altersgruppe, so hoch wie die Kosten je versicherte Person 2024 nach Abzug der Kostenbeteiligung. Hervorgehoben ist die erste Säule über dem Schnitt aller ab 26 Jahren (${z['alter.schnitt']} Franken). [[q:efind]]`,
  });
}

export function figurKostenteil(ctx) {
  const frBild = 1000;
  return abbildung(ctx, {
    id: 'abb-kostenteil', datei: 'krankenkasse-kostenteil.svg', stil: 'hl', kurz: 'Der eigene Anteil',
    titel: `Der eigene Anteil je nach Jahreskosten, bei Franchise ${fr(frBild)}`,
    beschreibung: `Eine Treppe aus 25 Pfosten, einer je 500 Franken Jahreskosten. Bis zur Franchise von ${fr(frBild)} Franken steigt sie steil, danach flacher mit ${Math.round(SELBSTBEHALT_RATE * 100)} Prozent, und ab dem Dach von ${fr(frBild + SELBSTBEHALT_MAX)} Franken bleibt sie gleich hoch.`,
    wert: `Franchise ${fr(frBild)} · höchstens ${fr(frBild + SELBSTBEHALT_MAX)} Fr. im Jahr`,
    legende: `Ein Pfosten je 500 Franken Jahreskosten, so hoch wie der eigene Anteil, bei einer Franchise von ${fr(frBild)} Franken. Erwachsene, Grundregel: Franchise, danach ${Math.round(SELBSTBEHALT_RATE * 100)} % Selbstbehalt bis höchstens ${fr(SELBSTBEHALT_MAX)} Franken. Ohne Spitalbeitrag und ohne den höheren Selbstbehalt bei gewissen Medikamenten. [[q:kvg]]`,
    nachher: tabelleDach(),
  });
}

// Das Dach je Franchise, aus kvgLeistungen.js gerechnet.
export function tabelleDach() {
  const zeilen = FRANCHISE_STUFEN.map((f) => `              <tr><td class="n">${fr(f)}</td><td class="n">${fr(berechneFranchise(f, 1e6).eigenanteil)}</td></tr>`).join('\n');
  return `
          <div class="tabelle"><table>
            <caption>Höchstens selbst bezahlt im Jahr, Erwachsene</caption>
            <tr><th scope="col" class="n">Franchise, Fr.</th><th scope="col" class="n">Franchise und Selbstbehalt zusammen höchstens, Fr.</th></tr>
${zeilen}
          </table></div>`;
}

export function figurKantone(ctx) {
  const kantone = kantonsPraemien();
  const billig = kantone[0], teuer = kantone[kantone.length - 1];
  const mehrere = kantone.filter((k) => !k.eineRegion).length;
  const regionen = kantone.reduce((n, k) => n + k.regionen.length, 0);
  return abbildung(ctx, {
    id: 'abb-kantone', datei: 'krankenkasse-kantone.svg', stil: 'hl', kurz: `Prämien ${PRAEMIENJAHR} je Region`,
    titel: `Mittlere Monatsprämie für Erwachsene ${PRAEMIENJAHR}, je Prämienregion`,
    beschreibung: `Eine Reihe von ${regionen} Pfosten auf einer Grundplatte, ein Pfosten je Prämienregion, nach Kanton gruppiert und nach der teuersten Region sortiert: vorne ${billig.name} mit ${rp(billig.tief)} Franken, hinten ${teuer.name} mit ${rp(teuer.hoch)} Franken, fast doppelt so hoch.`,
    wert: `${billig.name} ${rp(billig.tief)} · ${teuer.name} ${rp(teuer.hoch)} Fr.`,
    legende: `Ein Pfosten je Prämienregion, so hoch wie die mittlere Prämie für Erwachsene ab 26, alle Kassen zusammen. ${kantone.length - mehrere} Kantone haben eine Region, ${mehrere} haben zwei oder drei; deren Pfosten stehen nebeneinander. Die Pfosten beginnen bei null, das Verhältnis stimmt. Daten: ${quelleLesbar()}, in Maloja Plana geführt. [[q:praemienKantone]]`,
    nachher: tabelleKantoneAlle(kantone),
  });
}

function tabelleKantoneAlle(kantone) {
  const alle = kantone.map((k) => `              <tr><td>${k.name}</td><td class="n">${k.regionen
    .map((r) => (k.eineRegion ? rp(r.erwachsene) : `Region ${r.region}: ${rp(r.erwachsene)}`)).join('<br>')}</td></tr>`).join('\n');
  return `
          <details>
            <summary>Alle ${kantone.length} Kantone als Tabelle</summary>
            <div class="tabelle"><table>
              <caption>Mittlere Monatsprämie Erwachsene ${PRAEMIENJAHR}, je Kanton und Prämienregion, sortiert nach der teuersten Region</caption>
              <tr><th scope="col">Kanton</th><th scope="col" class="n">Franken im Monat</th></tr>
${alle}
            </table></div>
          </details>`;
}

// «priminfo.admin.ch — praemienregionen-2027.xlsx, Stand 22.10.2026 (…)» →
// «Prämiendaten des Bundes (priminfo.admin.ch), Stand 22. Oktober 2026».
// Das Datum kommt aus der Datenquelle, nicht von Hand.
const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
function quelleLesbar() {
  const m = praemienQuelle().match(/Stand (\d{2})\.(\d{2})\.(\d{4})/);
  if (!m) throw new Error(`Kein Stand-Datum in der Prämienquelle: ${praemienQuelle()}`);
  return `Prämiendaten des Bundes (priminfo.admin.ch), Stand ${Number(m[1])}. ${MONATE[Number(m[2]) - 1]} ${m[3]}`;
}

export function tabelleDorf() {
  const gruppen = [];
  for (const s of DORF_STUFEN) {
    const g = gruppen.find((x) => x.gruppe === s.gruppe);
    if (g) g.menschen += s.menschen; else gruppen.push({ gruppe: s.gruppe, menschen: s.menschen });
  }
  const zeilen = gruppen.map((g) => `          <tr><td>${g.gruppe}</td><td class="n">${g.menschen}</td></tr>`).join('\n');
  return `<div class="tabelle"><table>
          <caption>Über die Grundversicherung abgerechnet 2024, auf 100 Menschen gerundet</caption>
          <tr><th scope="col">Kosten im Jahr</th><th scope="col" class="n">Menschen</th></tr>
${zeilen}
        </table></div>`;
}

export function tabelleKantone() {
  const je = Object.fromEntries(kantonsPraemien().map((k) => [k.kanton, k]));
  const zeilen = Object.keys(KANTON_KOSTEN_2024)
    .sort((a, b) => je[a].hoch - je[b].hoch)
    .map((k) => `          <tr><td>${je[k].name}</td><td class="n">${praemieText(je[k])}</td><td class="n">${fr(KANTON_KOSTEN_2024[k])}</td></tr>`)
    .join('\n');
  return `<div class="tabelle"><table>
          <caption>Prämie und Kosten in sechs Kantonen</caption>
          <tr><th scope="col">Kanton</th><th scope="col" class="n">Prämie Erwachsene ${PRAEMIENJAHR}, Fr./Mt.</th><th scope="col" class="n">Kosten je Person 2024, Fr./Jahr</th></tr>
${zeilen}
        </table></div>`;
}

export function tabelleMittel() {
  const m = NATIONAL_AVG_PREMIUM_JE_JAHR[PRAEMIENJAHR];
  return `<div class="tabelle"><table>
          <caption>Mittlere Monatsprämie ${PRAEMIENJAHR}, ganze Schweiz</caption>
          <tr><th scope="col">Altersgruppe</th><th scope="col" class="n">Franken</th></tr>
          <tr><td>Erwachsene ab 26</td><td class="n">${rp(m.erwachsene)}</td></tr>
          <tr><td>Junge Erwachsene 19 bis 25</td><td class="n">${rp(m.junge)}</td></tr>
          <tr><td>Kinder bis 18</td><td class="n">${rp(m.kinder)}</td></tr>
          <tr><td>Alle zusammen</td><td class="n">${rp(m.gesamt)}</td></tr>
        </table></div>`;
}

export const BLOECKE = {
  'FIG:praemie': figurPraemie,
  'FIG:dorf': figurDorf,
  'TAB:dorf': tabelleDorf,
  'FIG:alter': figurAlter,
  'FIG:kostenteil': figurKostenteil,
  'FIG:kantone': figurKantone,
  'TAB:kantone': tabelleKantone,
  'TAB:mittel': tabelleMittel,
};
