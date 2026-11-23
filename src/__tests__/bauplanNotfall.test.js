// Wächter · Bauplan Lebensbereich Notfall & Gesundheit (Stebler Studios 18.11.2026: «B · Herz mit Puls», «Ja, so bauen»).
// Drei Fragen, drei Bilder: Franchise = Thermometer · Als Nächstes fällig = Kalenderblatt (Arztkoffer) · Bereit = Herz
// mit Puls (Kapitel Notfall und Kachel). Analyse: stebler-studios/analysen/2026-11-18-notfall-gesundheit-bauplan.md
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import de from '../i18n/de.js';
import { createT } from '../i18n/index.js';
import { LIGHT_PALETTE, getChapters } from '../config/constants.js';
import { DEMO_DATA } from '../config/demoData.js';
import { NotfallImKapitel } from '../components/NotfallImKapitel.jsx';
import { GesundheitZuhause, naechstesFaellig, naechsteVorsorge, lagenStand, bereitschaft, Impfausweis, impfAbstandJahre, naechsteImpfung, KOFFER_FAECHER, impfcheck, impfKosten, impfKostenJahr, impfZahlerVorschlag, IMPF_RICHTPREISE, Karteikarten, karteikarten, diagnosenListe, KARTEI_GRUPPEN, Wochenblister, wochenblister, blisterTage, Blisterpackung, Fiebertagebuch, fiebertagebuch, fieberBehalten, fieberTemp, Fieberkurve, FIEBER_AUFBEWAHREN_TAGE, FranchiseAblesung, GesundheitKoffer } from '../bereiche/notfall/notfall.js';
import { SPECIALTY_GRUPPEN } from '../DoctorManager.jsx';
import { weitereAerzteAusListe, KEINE_AERZTE } from '../utils/weitereAerzte.js';

const t = createT({ de }, 'de', 'sie');
const SRC = path.resolve(__dirname, '..');
const lies = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');
const zaehle = (html, re) => (html.match(re) || []).length;
const HEUTE = new Date('2026-11-18T10:00:00');
const MIT_BELEG = (() => {
  const d = JSON.parse(JSON.stringify(DEMO_DATA));
  d.versicherungen = { ...d.versicherungen, franchise: 'f2500',
    kkBelege: [{ id: 'b1', datum: '2026-10-02', betrag: 820, status: 'offen', frist: '2026-12-15' }] };
  return d;
})();
// Seit 18.11.2026 ist der Arztkoffer Teil des Kapitels: «arztkoffer» = das Kapitel Gesundheit.
const kapitel = (d) => renderToStaticMarkup(React.createElement(NotfallImKapitel, { palette: LIGHT_PALETTE, t, data: d, chapters: getChapters(t),
  onNavigate: () => {}, onUpdate: () => {}, zumFeld: () => {}, karteMoeglich: true }));
const arztkoffer = kapitel;

describe('Bauplan Notfall & Gesundheit · jedes Bild einmal je Seite', () => {
  it('Arztkoffer: ein Thermometer (mittel, im Koffer), ein Kalenderblatt, je eine Hauptzahl daneben', () => {
    const html = arztkoffer(MIT_BELEG);
    expect(zaehle(html, /data-franchise="mittel"/g)).toBe(1);
    expect(zaehle(html, /data-franchise="/g)).toBe(1);
    expect(zaehle(html, /data-teil="kalenderblatt"/g)).toBe(1);
    expect(zaehle(html, /data-instrument-zahl="franchise"/g)).toBe(1);
    expect(zaehle(html, /data-instrument-zahl="faellig"/g)).toBe(1);
    expect(html.indexOf('data-instrument-zahl="franchise"')).toBeGreaterThan(html.indexOf('data-franchise="mittel"'));
    expect(html.indexOf('data-instrument-zahl="faellig"')).toBeGreaterThan(html.indexOf('data-teil="kalenderblatt"'));
    // Seit 20.11.2026 «wie Wohnen» (Stebler Studios: «Ja, A fertig machen»): zuerst der Koffer wie die Strasse — im Deckel Herz,
    // Thermometer, Kalenderblatt nebeneinander, im Boden die Fächer —, dann Anrufen/Krise, was für «Bereit» fehlt,
    // Unterlagen, Vorsorge. Die Krise steht damit unter dem Koffer (vorher ganz oben, Lebenslagen C1+C2).
    const reihe = ['data-teil="teil-koffer"', 'data-teil="gesundheit-koffer"', 'data-teil="gesundheit-bereit"', 'data-teil="gesundheit-franchise"',
      'data-teil="gesundheit-faellig"', 'data-teil="koffer-faecher"', 'data-teil="teil-notfall"', 'data-teil="notfall-krise"', 'data-teil="notfall-bereit"',
      'data-teil="notfall-unterlagen"', 'data-teil="notfall-vorsorge"'].map((x) => html.indexOf(x));
    expect(reihe.every((p) => p > -1)).toBe(true);
    expect([...reihe].sort((x, y) => x - y)).toEqual(reihe);
  });
  it('Arztkoffer ohne Franchise und ohne Termine: kein Bild, ruhige Sätze statt Zahlen', () => {
    const d = JSON.parse(JSON.stringify(DEMO_DATA));
    d.versicherungen = { ...d.versicherungen, franchise: '', kkBelege: [] };
    const html = renderToStaticMarkup(React.createElement(GesundheitZuhause, { palette: LIGHT_PALETTE, t, data: d, onNavigate: () => {}, letzteBesuche: {}, heute: HEUTE }));
    expect(html).not.toContain('data-franchise=');
    expect(html).not.toContain('data-teil="kalenderblatt"');
    expect(html).toContain('data-teil="franchise-leer"');
    expect(html).toContain('data-teil="faellig-leer"');
  });
  // Seit 20.11.2026 («wie Wohnen») steht das Herz in der Strasse im Koffer, mittel, die Zahl darunter; unter
  // «Bereit für den Ernstfall» steht nur noch, was fehlt — kein zweites Herz.
  it('Kapitel: ein Herz mit Puls (mittel, in der Strasse), die Zahl darunter, kein Balken und kein Ring mehr', () => {
    for (const d of [DEMO_DATA, MIT_BELEG, {}]) {
      const html = kapitel(d);
      expect(zaehle(html, /data-teil="herz-puls"/g)).toBe(1);
      expect(html).toMatch(/data-teil="herz-puls" data-groesse="mittel"/);
      expect(zaehle(html, /data-instrument-zahl="bereit"/g)).toBe(1);
      expect(html.indexOf('data-instrument-zahl="bereit"')).toBeGreaterThan(html.indexOf('data-teil="herz-puls"'));
      const strasse = html.slice(html.indexOf('data-teil="koffer-stand"'), html.indexOf('data-teil="koffer-boden"'));
      expect(strasse).toContain('data-teil="herz-puls"');
      expect(html).not.toContain('data-bereit=');
    }
  });
  it('Kachel: dasselbe Herz klein, mit derselben Rechnung', () => {
    const panel = lies('components/InstrumentePanel.jsx');
    expect(panel).toMatch(/HerzPuls, \{ palette, lagen: lagenStand\(data\), groesse: 'klein' \}/);
    expect(panel).not.toMatch(/BereitRingKlein/);
  });
});

describe('Ablesung am Thermometer (Stebler Studios 18.11.2026, «A · Skala am Thermometer»)', () => {
  // Seit 20.11.2026 («B · Zahlen oben, Fächer unten», Thermometer klein, Text daneben) steht im Koffer das Thermometer
  // mittel ohne Ablesewörter; die Ablesung bleibt im KVG-Reiter. Ihre Reihenfolge prüft der Wächter am Bauteil.
  it('Ablesung: Selbstbehalt, Franchise, noch offen, erreicht stehen am Thermometer, in dieser Reihenfolge von oben', () => {
    const html = renderToStaticMarkup(React.createElement(FranchiseAblesung, { palette: LIGHT_PALETTE, t, groesse: 'mittel',
      stand: { franchise: 1500, franchiseVerbraucht: 420, franchiseOffen: 1080, selbstbehalt: 0, selbstbehaltMax: 700 } }));
    expect(arztkoffer(MIT_BELEG)).not.toContain('data-teil="franchise-ablesung"');
    const pos = ['ablese-selbstbehalt', 'ablese-franchise', 'ablese-offen', 'ablese-erreicht'].map((teil) => html.indexOf('data-teil="' + teil + '"'));
    expect(pos.every((p) => p > -1)).toBe(true);
    const top = (teil) => Number((html.match(new RegExp('data-teil="' + teil + '" style="position:absolute;left:0;top:(\\d+)px')) || [])[1]);
    expect(top('ablese-selbstbehalt')).toBeLessThan(top('ablese-franchise'));
    expect(top('ablese-franchise')).toBeLessThan(top('ablese-offen'));
    expect(top('ablese-offen')).toBeLessThan(top('ablese-erreicht'));
  });
  it('KVG-Reiter: die alte Textzeile unter dem Bild ist weg, die Ablesung steht am Thermometer', () => {
    const q = lies('KVGLeistungen.jsx');
    expect(q).toMatch(/FranchiseAblesung, \{ palette, t, stand: result, groesse: 'mittel' \}/);
    expect(q).not.toMatch(/'data-teil': 'franchise-franken'|'data-teil': 'selbstbehalt-franken'/);
  });
});

describe('Kapitel Gesundheit und Arztkoffer sind eine Seite (Stebler Studios 18.11.2026)', () => {
  // Die drei nummerierten Teile (19.11.2026) sind seit 20.11.2026 weg (Stebler Studios: «gleiches Konzept wie beim Wohnen»,
  // «Ja, A fertig machen»): wie Wohnen ohne Nummern, der Koffer zuerst.
  it('wie Wohnen: keine Nummern, der Koffer steht zuerst, der Ernstfall-Knopf bleibt davor angeheftet', () => {
    const html = kapitel(DEMO_DATA);
    expect(html).toContain('data-teil="teil-koffer" aria-labelledby="mp-gesundheit-koffer-titel"');
    expect(html).toMatch(/<h3 id="mp-gesundheit-koffer-titel"[^>]*>.*Arztkoffer/);
    expect(html).toMatch(/<h3 id="mp-notfall-vorsorge" tabindex="-1"[^>]*>.*Vorsorge und Angaben/);
    expect(zaehle(html, /data-teil-nr="/g)).toBe(0);
    expect(html.indexOf('data-teil="teil-koffer"')).toBeLessThan(html.indexOf('data-teil="teil-notfall"'));
    const cv = lies('ChapterView.jsx');
    expect(cv).not.toMatch(/NotfallTeilTitel/);
    expect(cv.indexOf('React.createElement(NotfallErnstfallKnopf')).toBeLessThan(cv.indexOf('React.createElement(NotfallImKapitel'));
  });
  it('Ärzte nicht doppelt: im Formular nur Namen und der Weg zu den Karteikarten', () => {
    const cv = lies('ChapterView.jsx');
    expect(cv).toMatch(/'data-teil': 'aerzte-in-kartei'/);
    expect(cv).toMatch(/'data-teil': 'diagnosen-in-kartei'/); // Stebler Studios 19.11.2026: Diagnosen ebenso nur Verweis
    expect(cv.match(/onNavigate\('karteikarten'\)/g)).toHaveLength(2);
    expect(cv).toMatch(/onNavigate\('karteikarten'\)/);
  });
  it('der offene Koffer: fertige Fächer als Knöpfe im Boden, keine geplanten mehr, keine Notfallkarte doppelt', () => {
    const html = kapitel(DEMO_DATA);
    const boden = html.slice(html.indexOf('data-teil="koffer-boden"'));
    expect(boden.match(/<button[^>]*data-fach="([a-z]+)"/g).map((m) => m.match(/data-fach="([a-z]+)"/)[1])).toEqual(['kvg', 'kkbeleg', 'impfausweis', 'karteikarten', 'blister', 'thermometer']);
    expect(zaehle(html, /data-bald="ja"/g)).toBe(0); // seit dem Fiebertagebuch (20.11.2026) alle Fächer fertig
    expect(zaehle(html, /data-kachel="notfallkarte"/g)).toBe(1);
  });
  // Stebler Studios 20.11.2026, «B · Zahlen oben, Fächer unten» («alle drei Etappen im Koffer»): Franchise und Als Nächstes
  // fällig im Deckel, die Fächer im Boden, darunter nichts. Das Fach heisst nur «Leistungen» (Doppeltes fällt weg).
  it('alles im Koffer: Franchise und fällig im Deckel, die Fächer im Boden, darunter nichts', () => {
    const html = kapitel(MIT_BELEG);
    const deckel = html.slice(html.indexOf('data-teil="koffer-deckel"'), html.indexOf('data-teil="koffer-boden"'));
    const boden = html.slice(html.indexOf('data-teil="koffer-boden"'), html.indexOf('data-teil="teil-notfall"'));
    expect(html.indexOf('data-teil="koffer-boden"')).toBeGreaterThan(html.indexOf('data-teil="koffer-deckel"'));
    expect(zaehle(deckel, /data-teil="gesundheit-franchise" data-im-koffer="ja"/g)).toBe(1);
    expect(zaehle(deckel, /data-teil="gesundheit-faellig" data-im-koffer="ja"/g)).toBe(1);
    expect(zaehle(deckel, /data-franchise="mittel"/g)).toBe(1);
    expect(deckel).not.toContain('data-fach=');
    expect(zaehle(boden, /<button[^>]*data-fach=/g)).toBe(6);
    expect(boden).not.toMatch(/data-teil="gesundheit-(franchise|faellig)"/);
    expect(zaehle(html, /data-teil="gesundheit-franchise"/g)).toBe(1);
    expect(zaehle(html, /data-teil="gesundheit-faellig"/g)).toBe(1);
    expect(html).not.toContain('data-teil="gesundheit-zuhause"'); // nichts mehr unter dem Koffer
    expect(t('arztkoffer.faecher.kvg.title')).toBe('Leistungen');
    expect(lies('components/NotfallImKapitel.jsx')).toMatch(/stand: h\(GesundheitZuhause, \{ palette, t, data: alle, onNavigate, imKoffer: true, mitBereit: true, zuBereit: /);
    // Die Strasse (wie Wohnen, 20.11.2026): drei Gegenstände in einer Reihe, auch auf dem Handy; Herz, Thermometer,
    // Kalenderblatt in dieser Reihenfolge; unter jedem nur Frage, Zahl, Weg (die langen Sätze fallen dort weg).
    expect(deckel).toMatch(/data-teil="koffer-stand" data-strasse="ja" style="display:grid;grid-template-columns:repeat\(3, minmax\(0, 1fr\)\)/);
    const stelle = (x) => deckel.indexOf('data-teil="' + x + '"');
    expect(stelle('gesundheit-bereit')).toBeGreaterThan(-1);
    expect(stelle('gesundheit-bereit')).toBeLessThan(stelle('gesundheit-franchise'));
    expect(stelle('gesundheit-franchise')).toBeLessThan(stelle('gesundheit-faellig'));
    expect(deckel).not.toContain('data-teil="franchise-satz"');
    expect(deckel).not.toContain('data-teil="bereit-satz"');
    expect(deckel).toContain('Zum Rechner ›');
    // Ohne stand bleibt der Koffer wie vorher: Fächer im Deckel, kein Boden.
    const ohne = renderToStaticMarkup(React.createElement(GesundheitKoffer, { palette: LIGHT_PALETTE, t, onNavigate: () => {} }));
    expect(zaehle(ohne.slice(ohne.indexOf('data-teil="koffer-deckel"')), /<button[^>]*data-fach=/g)).toBe(6);
    expect(ohne).not.toContain('data-teil="koffer-boden"');
    const nur = (teil) => renderToStaticMarkup(React.createElement(GesundheitZuhause, { palette: LIGHT_PALETTE, t, data: MIT_BELEG, onNavigate: () => {}, letzteBesuche: {}, heute: HEUTE, teil }));
    expect(nur('franchise')).not.toContain('data-teil="gesundheit-faellig"');
    expect(nur('faellig')).not.toContain('data-teil="gesundheit-franchise"');
  });
  it('die frühere Seite gibt es nicht mehr; #/gesundheit führt zum Koffer im Kapitel', () => {
    expect(fs.existsSync(path.join(SRC, 'ArztkofferView.jsx'))).toBe(false);
    expect(lies('utils/hashRouter.js')).toMatch(/gesundheit: \{ view: 'chapter', chapterIndex: CHAPTER_KEYS\.indexOf\('notfall'\), anker: 'mp-gesundheit-koffer' \}/);
  });
});

describe('Bauplan Notfall & Gesundheit · Rechnungen', () => {
  it('Herz: ein Schlag je Lage, voll nur, wenn alle Angaben der Lage bereit sind', () => {
    const l = lagenStand(DEMO_DATA);
    expect(l.map((x) => x.key)).toEqual(['unfall', 'spital', 'behoerde']);
    expect(l.every((x) => x.voll === (x.erledigt === x.gesamt))).toBe(true);
    expect(lagenStand({}).every((x) => !x.voll)).toBe(true);
    expect(bereitschaft({}).erledigt).toBe(0);
  });
  it('nächste Vorsorge: letzte Untersuchung + Intervall; ohne Datum nichts', () => {
    expect(naechsteVorsorge('2024-03-10', 36)).toBe('2027-03-10');
    expect(naechsteVorsorge('', 36)).toBeNull();
    expect(naechsteVorsorge('2024-03-10', undefined)).toBeNull();
  });
  it('Als Nächstes fällig = das Früheste aus offener Belegfrist und Vorsorge', () => {
    const vorsorgeFrueher = naechstesFaellig(MIT_BELEG, { mammografie: '2024-11-01' }, HEUTE);
    expect(vorsorgeFrueher).toMatchObject({ art: 'vorsorge', key: 'mammografie', iso: '2026-11-01', vorbei: true });
    const belegFrueher = naechstesFaellig(MIT_BELEG, { darmkrebs: '2024-01-01' }, HEUTE);
    expect(belegFrueher).toMatchObject({ art: 'beleg', iso: '2026-12-15', vorbei: false });
    const bezahlt = JSON.parse(JSON.stringify(MIT_BELEG));
    bezahlt.versicherungen.kkBelege[0].status = 'bezahlt';
    expect(naechstesFaellig(bezahlt, {}, HEUTE)).toBeNull();
  });
  it('der Katalog rechnet die nächste Vorsorge mit derselben Funktion (keine eigene Monatsrechnung)', () => {
    const q = lies('KVGLeistungen.jsx');
    expect(q).toMatch(/naechsteVorsorge\(lastVisit, recMonths\)/);
    expect(q).not.toMatch(/setMonth\(next\.getMonth\(\) \+ recMonths\)/);
  });
});

describe('Bauplan Notfall & Gesundheit · Ordnung im Code', () => {
  const appDateien = (dir) => fs.readdirSync(path.join(SRC, dir), { withFileTypes: true }).flatMap((e) => {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' || rel === path.join('bereiche', 'notfall') ? [] : appDateien(rel);
    return /\.(js|jsx)$/.test(e.name) ? [rel] : [];
  });
  it('rechnung.js rechnet nur: kein React, kein Bauteil', () => {
    const q = lies('bereiche/notfall/rechnung.js');
    expect(q).not.toMatch(/from 'react'/);
    expect(q).not.toMatch(/from '[^']+\.jsx'/);
  });
  it('ausserhalb des Bereichs kommt Notfall & Gesundheit nur über bereiche/notfall/notfall.js', () => {
    const falsch = appDateien('.').filter((f) => /from '[^']*bereiche\/notfall\/(?!notfall\.js')[^']*'|import\('[^']*bereiche\/notfall\/(?!notfall\.js')/.test(lies(f)));
    expect(falsch).toEqual([]);
  });
  it('der Eingang heisst nicht index.js', () => {
    expect(fs.existsSync(path.join(SRC, 'bereiche/notfall/index.js'))).toBe(false);
  });
  it('die Bereitschaft wird nur einmal gerechnet: das Kapitel-Bauteil rechnet nicht selbst', () => {
    const k = lies('components/NotfallImKapitel.jsx');
    expect(k).not.toMatch(/export const (bereitschaft|SCENARIOS|NOTFALL_ANGABEN|VORSORGE|BereitRingKlein)\b/);
    expect(fs.existsSync(path.join(SRC, 'components/FranchiseThermometer.jsx'))).toBe(false);
  });
});

// Fach Impfausweis (Stebler Studios 19.11.2026, «A · Liste + fällig», «Ja, mitzählen»). Regel: Schweizerischer Impfplan 2026
// (BAG/EKIF, Stand Februar 2026), Tabelle 1 Fussnote 13, Kap. 1.4/1.5 a) (dT) und Kap. 3 a) (FSME).
describe('Fach Impfausweis · Welche Impfung ist fällig?', () => {
  const mitImpfungen = (impfungen, geburt = '1980-06-15') => {
    const d = JSON.parse(JSON.stringify(MIT_BELEG));
    d.basis = { ...d.basis, dateOfBirth: geburt };
    d.notfall = { ...d.notfall, impfungen };
    return d;
  };
  const fach = (d) => renderToStaticMarkup(React.createElement(Impfausweis, { palette: LIGHT_PALETTE, t, data: d, onUpdateData: () => {}, heute: HEUTE }));

  it('dT: das Alter bei der letzten Dosis bestimmt den Abstand (16–24 → 10, 25–64 → 20, ab 65 → 10 Jahre)', () => {
    expect(impfAbstandJahre('dt', '2000-06-15', '1980-06-15')).toBe(10); // 20-jährig
    expect(impfAbstandJahre('dt', '2005-06-14', '1980-06-15')).toBe(10); // 24-jährig, Tag vor dem 25.
    expect(impfAbstandJahre('dt', '2005-06-15', '1980-06-15')).toBe(20); // 25-jährig
    expect(impfAbstandJahre('dt', '2045-06-14', '1980-06-15')).toBe(20); // 64-jährig
    expect(impfAbstandJahre('dt', '2045-06-15', '1980-06-15')).toBe(10); // 65-jährig
    expect(impfAbstandJahre('dt', '1990-06-15', '1980-06-15')).toBeNull(); // Kind: eigenes Schema
    expect(impfAbstandJahre('dt', '2005-06-15', '')).toBeNull(); // ohne Geburtsdatum keine Frist
    expect(impfAbstandJahre('fsme', '2022-05-02', '')).toBe(10);
    expect(impfAbstandJahre('grippe', '2026-10-01', '1980-06-15')).toBeNull(); // keine erfundene Frist
    expect(impfAbstandJahre('mmr', '1994-01-01', '1980-06-15')).toBeNull();
  });
  it('es zählt die letzte Dosis je Impfung; die früheste Auffrischung gewinnt', () => {
    const d = mitImpfungen([
      { id: 'a', art: 'dt', datum: '2001-03-14' }, { id: 'b', art: 'dt', datum: '2011-03-14' },
      { id: 'f1', art: 'fsme', datum: '2016-03-01' }, { id: 'f2', art: 'fsme', datum: '2016-04-01' }, { id: 'f3', art: 'fsme', datum: '2017-05-02' }, { id: 'd', art: 'grippe', datum: '2026-10-01' },
    ]);
    expect(naechsteImpfung(d, HEUTE)).toMatchObject({ art: 'impfung', key: 'fsme', iso: '2027-05-02', abstand: 10, vorbei: false });
    const ohneFsme = mitImpfungen([{ id: 'a', art: 'dt', datum: '2001-03-14' }, { id: 'b', art: 'dt', datum: '2011-03-14' }]);
    expect(naechsteImpfung(ohneFsme, HEUTE)).toMatchObject({ key: 'dt', iso: '2031-03-14', abstand: 20 }); // mit 30 geimpft
    expect(naechsteImpfung(mitImpfungen([{ id: 'd', art: 'grippe', datum: '2026-10-01' }]), HEUTE)).toBeNull();
  });
  it('«Als Nächstes fällig» zählt die Impfung mit, und der Weg führt ins Fach', () => {
    const d = mitImpfungen([{ id: 'f1', art: 'fsme', datum: '2015-09-01' }, { id: 'f2', art: 'fsme', datum: '2015-10-01' }, { id: 'f3', art: 'fsme', datum: '2016-11-01' }]); // fällig 01.11.2026, vor dem Beleg 15.12.
    expect(naechstesFaellig(d, {}, HEUTE)).toMatchObject({ art: 'impfung', key: 'fsme', iso: '2026-11-01', vorbei: true });
    const html = renderToStaticMarkup(React.createElement(GesundheitZuhause, { palette: LIGHT_PALETTE, t, data: d, onNavigate: () => {}, letzteBesuche: {}, heute: HEUTE }));
    expect(html).toContain('FSME (Zecken) · nächste empfohlene Auffrischimpfung');
    expect(html).toContain('Zum Impfausweis');
    expect(zaehle(html, /data-teil="kalenderblatt"/g)).toBe(1);
  });
  it('Fachseite: ein Kalenderblatt, die Zahl darunter, Liste neueste zuerst, Quelle verlinkt', () => {
    const html = fach(mitImpfungen([{ id: 'a', art: 'dt', datum: '2011-03-14' }, { id: 'f1', art: 'fsme', datum: '2021-03-01' }, { id: 'f2', art: 'fsme', datum: '2021-04-01' }, { id: 'f3', art: 'fsme', datum: '2022-05-02' }]));
    expect(zaehle(html, /data-teil="kalenderblatt"/g)).toBe(1);
    expect(zaehle(html, /data-instrument-zahl="impfung"/g)).toBe(1);
    expect(html.indexOf('data-instrument-zahl="impfung"')).toBeGreaterThan(html.indexOf('data-teil="kalenderblatt"'));
    expect(html).toContain('Auffrischung 20 Jahre nach der letzten Impfung');
    expect(html.indexOf('data-impfung="fsme"')).toBeLessThan(html.indexOf('data-impfung="dt"'));
    expect(html).toContain('href="https://www.bag.admin.ch/de/schweizerischer-impfplan"');
  });
  it('Fachseite ohne Frist: kein Bild, ehrlicher Satz; Starrkrampf ohne Geburtsdatum sagt, was fehlt', () => {
    const leer = fach(mitImpfungen([]));
    expect(leer).not.toContain('data-teil="kalenderblatt"');
    expect(leer).toContain('data-teil="impf-leer"');
    const ohneAlter = fach(mitImpfungen([{ id: 'a', art: 'dt', datum: '2011-03-14' }], ''));
    expect(ohneAlter).not.toContain('data-teil="kalenderblatt"');
    expect(ohneAlter).toContain('data-teil="impf-ohne-alter"');
  });
  it('das Fach steht im Koffer, ist eine Seite mit Adresse und wird lazy über den Eingang geladen', () => {
    expect(KOFFER_FAECHER.find((f) => f.key === 'impfausweis').view).toBe('impfausweis');
    expect(lies('utils/hashRouter.js')).toMatch(/'impfausweis'/);
    // Seit 23.11.2026 ein Baustein für alle vier Fächer (Startbündel): lazy über den Eingang, Ansicht → Fach in fach.jsx.
    expect(lies('main.jsx')).toMatch(/lazyMitTexten\(\(\) => import\('\.\/bereiche\/notfall\/notfall\.js'\)\.then\(\(m\) => \(\{ default: m\.NotfallFach \}\)\)\)/);
    expect(lies('main.jsx')).toMatch(/\['impfausweis', 'karteikarten', 'blister', 'fieber'\]\.includes\(view\) && React\.createElement\(NotfallFach, \{ fach: view/);
    expect(lies('bereiche/notfall/fach.jsx')).toMatch(/impfausweis: Impfausweis\b/);
    expect(lies('bereiche/notfall/impfausweis.jsx')).not.toMatch(/setFullYear|setMonth/); // rechnet nicht selbst
  });
});

// Impfcheck und Kosten (Stebler Studios 19.11.2026: «Ja, nach Alter», Preise «alle drei», abwählbar). Quelle: Referenzdokument
// zu Art. 12a KLV vom 1. Juli 2026, Kap. 2 (seit 1.1.2026 ohne Franchise, Selbstbehalt bleibt) und Kap. 4.
describe('Impfausweis · Impfcheck nach Alter und Kosten', () => {
  const mit = (impfungen, geburt, extra = {}) => ({ basis: { dateOfBirth: geburt, canton: extra.canton || 'ZH' },
    versicherungen: { kkBelege: [] }, notfall: { impfungen, ...extra.notfall } });
  const status = (c) => Object.fromEntries(c.zeilen.map((z) => [z.key, z.status]));

  it('47-jährig: dT, FSME, MMR zählen; Windpocken bis 39 und HPV bis 26 sind vorbei; ab 65 kommt später', () => {
    const c = impfcheck(mit([{ id: 'a', art: 'dt', datum: '2011-03-14' }, { id: 'b', art: 'mmr', datum: '1990-05-01' }], '1979-06-15'), HEUTE);
    expect(c.alter).toBe(47);
    expect(status(c)).toMatchObject({ dt: 'ok', fsme: 'offen', mmr: 'teilweise', varizellen: 'vorbei', hpv: 'vorbei', grippe: 'spaeter', pneumo: 'spaeter', zoster: 'spaeter' });
    expect([c.erledigt, c.gesamt]).toEqual([1, 3]);
  });
  it('70-jährig, vor 1964 geboren: kein MMR; Grippe jährlich; Gürtelrose braucht 2 Dosen', () => {
    const c = impfcheck(mit([{ id: 'z', art: 'zoster', datum: '2026-01-10' }, { id: 'g', art: 'grippe', datum: '2026-10-20' }], '1956-01-01'), HEUTE);
    expect(c.zeilen.some((z) => z.key === 'mmr')).toBe(false);
    expect(status(c)).toMatchObject({ grippe: 'jaehrlich', covid: 'jaehrlich', pneumo: 'offen', zoster: 'teilweise' });
    expect(c.zeilen.find((z) => z.key === 'grippe').letzte).toBe('2026-10-20');
  });
  it('HPV: 2 Dosen bei Beginn vor 15, sonst 3; abgewählt zählt nicht mit', () => {
    const jung = impfcheck(mit([{ id: 'h1', art: 'hpv', datum: '2017-01-01' }, { id: 'h2', art: 'hpv', datum: '2017-07-01' }], '2003-01-01'), HEUTE);
    expect(status(jung).hpv).toBe('ok');
    const spaet = impfcheck(mit([{ id: 'h1', art: 'hpv', datum: '2020-01-01' }, { id: 'h2', art: 'hpv', datum: '2020-07-01' }], '2003-01-01'), HEUTE);
    expect(status(spaet).hpv).toBe('teilweise');
    const mit15 = impfcheck(mit([{ id: 'h1', art: 'hpv', datum: '2018-06-01' }, { id: 'h2', art: 'hpv', datum: '2018-12-01' }], '2003-01-01'), HEUTE);
    expect(status(mit15).hpv).toBe('teilweise'); // Beginn mit 15: 3 Dosen nötig
    const ab = impfcheck(mit([], '1979-06-15', { notfall: { impfcheckAus: ['fsme'] } }), HEUTE);
    expect(status(ab).fsme).toBe('aus');
    expect(ab.gesamt).toBe(2);
  });
  it('ohne Geburtsdatum kein Check; unter 16 nur der Satz zum Kinder-Impfplan', () => {
    expect(impfcheck(mit([], ''), HEUTE)).toMatchObject({ alter: null, zeilen: [] });
    expect(impfcheck(mit([], '2015-01-01'), HEUTE)).toMatchObject({ kind: true, zeilen: [] });
  });
  it('Kosten: Grundversicherung ohne Franchise, 10 % Selbstbehalt; selbst = alles; Zusatz = je nach Police', () => {
    expect(impfKosten({ art: 'fsme', datum: '2026-05-02', zahler: 'kasse', preis: 62, gebuehr: 15 })).toMatchObject({ gesamt: 77, eigen: 7.7, kasse: 69.3, hoechstens: true });
    expect(impfKosten({ datum: '2026-05-02', zahler: 'selbst', preis: 100 })).toMatchObject({ eigen: 100, kasse: 0 });
    expect(impfKosten({ datum: '2026-05-02', zahler: 'zusatz', preis: 100 })).toMatchObject({ eigen: null, grund: 'zusatz' });
    expect(impfKosten({ datum: '2026-05-02', zahler: 'kasse' })).toBeNull();
    // Fachprüfung 19.11.2026: vor 2026 galt die Franchise; HPV nur im kantonalen Programm; ohne Zahler keine Zahl.
    expect(impfKosten({ art: 'fsme', datum: '2025-12-31', zahler: 'kasse', preis: 62 })).toMatchObject({ eigen: null, grund: 'vor2026' });
    expect(impfKosten({ art: 'hpv', datum: '2026-05-02', zahler: 'kasse', preis: 180 })).toMatchObject({ eigen: null, grund: 'hpv' });
    expect(impfKosten({ art: 'fsme', datum: '2026-05-02', preis: 62 })).toMatchObject({ eigen: null, grund: 'offen' });
    const d = mit([{ id: 'a', art: 'fsme', datum: '2026-05-02', zahler: 'kasse', preis: 62, gebuehr: 15 },
      { id: 'b', art: 'hepa', datum: '2026-06-01', zahler: 'zusatz', preis: 90 }, { id: 'c', art: 'dt', datum: '2025-01-01', zahler: 'selbst', preis: 40 }], '1979-06-15');
    expect(impfKostenJahr(d, 2026)).toEqual({ gesamt: 167, eigen: 7.7, offen: 1, mitPreis: 2 });
  });
  it('Vorschlag «wer zahlt»: Grundversicherung nur, wenn für das Alter empfohlen', () => {
    const d = mit([], '1979-06-15');
    expect(impfZahlerVorschlag(d, 'fsme', '2026-05-02')).toBe('kasse');
    expect(impfZahlerVorschlag(d, 'grippe', '2026-10-01')).toBe('selbst'); // 47-jährig, nicht für alle empfohlen
    expect(impfZahlerVorschlag(d, 'hepa', '2026-10-01')).toBe('selbst');
    expect(impfZahlerVorschlag(d, 'dt', '1990-01-01')).toBeNull(); // mit 10: Kinder-Impfplan, kein Vorschlag
    expect(impfZahlerVorschlag(mit([], '2003-01-01'), 'hpv', '2026-01-01')).toBeNull(); // nur kantonales Programm
    expect(impfZahlerVorschlag(mit([], '1960-01-01'), 'mmr', '2026-01-01')).toBe('selbst'); // vor 1964 geboren
  });
  it('Fachseite: drei Fragen, eine Hauptzahl je Frage, ein Kalenderblatt; Kosten lassen sich ausblenden', () => {
    const d = mit([{ id: 'a', art: 'fsme', datum: '2026-05-02', zahler: 'kasse', preis: 62, gebuehr: 15 }, { id: 'b', art: 'dt', datum: '2011-03-14' }], '1979-06-15');
    const html = renderToStaticMarkup(React.createElement(Impfausweis, { palette: LIGHT_PALETTE, t, data: d, onUpdateData: () => {}, heute: HEUTE }));
    for (const z of ['impfung', 'impfcheck', 'impfkosten']) expect(zaehle(html, new RegExp('data-instrument-zahl="' + z + '"', 'g'))).toBe(1);
    expect(zaehle(html, /data-teil="kalenderblatt"/g)).toBe(1);
    expect(html).toContain('Trifft nicht zu');
    expect(html).toContain('ohne Franchise');
    const aus = { ...d, notfall: { ...d.notfall, impfKostenAus: true } };
    const ohne = renderToStaticMarkup(React.createElement(Impfausweis, { palette: LIGHT_PALETTE, t, data: aus, onUpdateData: () => {}, heute: HEUTE }));
    expect(ohne).not.toContain('data-instrument-zahl="impfkosten"');
    expect(ohne).not.toContain('mp-impf-preis');
    expect(ohne).toContain('Kosten zeigen');
  });
  it('Formular: Richtpreis aus der Spezialitätenliste mit Präparat; Apotheke ehrlich benannt; HPV ohne Richtpreis', () => {
    const html = renderToStaticMarkup(React.createElement(Impfausweis, { palette: LIGHT_PALETTE, t, data: mit([], '1979-06-15'), onUpdateData: () => {}, heute: HEUTE }));
    expect(html).toContain('Richtpreis je Dosis, Boostrix (dTpa)');
    expect(html).toContain('In der Apotheke zahlt sie das Impfen nicht');
    expect(IMPF_RICHTPREISE.hpv).toBeUndefined();
    expect(Object.values(IMPF_RICHTPREISE).every((r) => r.chf > 0 && r.praeparat)).toBe(true);
  });
  it('FSME: Auffrischung erst nach 3 Dosen Grundimmunisierung (Referenzdokument 4.11)', () => {
    const zwei = mit([{ id: 'a', art: 'fsme', datum: '2026-03-01' }, { id: 'b', art: 'fsme', datum: '2026-04-01' }], '1979-06-15');
    expect(naechsteImpfung(zwei, HEUTE)).toBeNull();
    expect(impfcheck(zwei, HEUTE).zeilen.find((z) => z.key === 'fsme')).toMatchObject({ status: 'teilweise', anzahl: 2, noetig: 3 });
  });
  it('dT mit 16–24: spätestens zum 25. Geburtstag (dTpa mit 25)', () => {
    const d = mit([{ id: 'a', art: 'dt', datum: '2001-01-01' }], '1984-06-15'); // mit 16 geimpft
    expect(naechsteImpfung(d, HEUTE)).toMatchObject({ key: 'dt', iso: '2009-06-15', mit25: true });
    const spaet = mit([{ id: 'a', art: 'dt', datum: '1999-06-01' }], '1975-06-15'); // mit 23: +10 = 2009, 25. Geburtstag 2000
    expect(naechsteImpfung(spaet, HEUTE).iso).toBe('2000-06-15');
  });
  it('Fachseite nennt Immunsystem, «ersetzt keine Beratung», Höchstwert und Jahresmaximum', () => {
    const html = renderToStaticMarkup(React.createElement(Impfausweis, { palette: LIGHT_PALETTE, t, heute: HEUTE, onUpdateData: () => {},
      data: mit([{ id: 'a', art: 'fsme', datum: '2026-05-02', zahler: 'kasse', preis: 62 }], '1979-06-15') }));
    expect(html).toContain('geschwächtes Immunsystem');
    expect(html).toContain('Ob und wann impfen, klärt die Arztpraxis');
    expect(html).toContain('selbst zu zahlen: höchstens');
    expect(html).toContain('jährlichen Selbstbehalt von');
  });
  it('der Katalog sagt nicht mehr «Franchise» für empfohlene Impfungen', () => {
    expect(t('kvg.impfungenDetail3')).toMatch(/ohne Franchise/);
  });
});

// Fach Karteikarten (Stebler Studios 19.11.2026: «B · Karteikasten», alle vier Inhalte, «Eine Liste, zwei Orte»).
// Analyse §9 in stebler-studios/analysen/2026-11-18-notfall-gesundheit-bauplan.md.
describe('Fach Karteikarten · Wer behandelt mich?', () => {
  const kartei = (notfall, extra = {}) => renderToStaticMarkup(React.createElement(Karteikarten, { palette: LIGHT_PALETTE, t, onUpdateData: () => {},
    data: { ...DEMO_DATA, notfall: { ...notfall } }, ...extra }));
  const LISTE = [
    { name: 'Dr. Meier', specialty: 'zahnarzt', phone: '061 111 22 33' },
    { name: 'Physio am Rhein', specialty: 'physio' },
    { name: 'Dr. med. Lisa Brunner', specialty: 'hausarzt', phone: '+41 44 242 80 00', adresse: 'Bahnhofstrasse 1, 8001 Zürich' },
    { name: '', specialty: 'apotheke' },
    { name: 'Apotheke Post', specialty: 'apotheke', phone: '031 000 00 00' },
  ];
  it('Rechnung: Karten = die Ärzteliste des Kapitels, sortiert nach Fachrichtung, nur mit Namen', () => {
    const s = karteikarten({ notfall: { doctorsList: LISTE } });
    expect(s.anzahl).toBe(4);
    expect(s.karten.map((k) => k.fach)).toEqual(['hausarzt', 'zahnarzt', 'physio', 'apotheke']);
    expect(s.karten.map((k) => k.gruppe)).toEqual(['aerzte', 'aerzte', 'therapien', 'kontakte']);
    expect(s.karten[0].index).toBe(2); // Stelle in doctorsList, zum Bearbeiten
    expect(s.reiter).toEqual(['hausarzt', 'zahnarzt', 'physio', 'apotheke']);
    expect(s.hausarzt).toBe(true);
  });
  it('Rechnung: altes Feld «doctor» ohne Liste wird die Karte Hausärztin; unbekannte Fachrichtung = andere', () => {
    expect(karteikarten({ notfall: { doctor: 'Dr. Alt', doctorPhone: '044 1' } }).karten).toEqual([expect.objectContaining({ name: 'Dr. Alt', fach: 'hausarzt', alt: true, index: -1 })]);
    expect(karteikarten({ notfall: { doctorsList: [{ name: 'X', specialty: 'Chiropraktik' }] } }).karten[0].fach).toBe('other');
    expect(karteikarten({}).anzahl).toBe(0);
  });
  it('eine Liste, zwei Orte: die Fachrichtungen der Eingabe sind dieselben wie die der Rechnung', () => {
    expect(SPECIALTY_GRUPPEN).toEqual(KARTEI_GRUPPEN);
    expect(KEINE_AERZTE).toEqual([...KARTEI_GRUPPEN.therapien, ...KARTEI_GRUPPEN.kontakte]);
    expect(lies('bereiche/notfall/karteikarten.jsx')).toMatch(/schreibe\('doctorsList'/);
    expect(lies('bereiche/notfall/karteikarten.jsx')).toMatch(/schreibe\('chronicDiseasesList'/);
  });
  it('Dossier «Weitere Ärztinnen und Ärzte»: ohne Therapien und Kontakte; die Hausärztin der Liste zählt bei «Bereit»', () => {
    expect(weitereAerzteAusListe({ doctorsList: LISTE }).map((x) => x.name)).toEqual(['Dr. Meier']);
    const ohne = bereitschaft({ notfall: {} }).erledigt;
    expect(bereitschaft({ notfall: { doctorsList: LISTE } }).erledigt).toBe(ohne + 2); // Name und Telefon
  });
  it('Fachseite: ein Karteikasten, die Zahl darunter, Fachrichtungen im Satz, Anrufen als Telefon-Link', () => {
    const html = kartei({ doctorsList: LISTE });
    expect(zaehle(html, /data-teil="karteikasten"/g)).toBe(1);
    expect(zaehle(html, /data-instrument-zahl="karteikarten"/g)).toBe(1);
    expect(html.indexOf('data-instrument-zahl="karteikarten"')).toBeGreaterThan(html.indexOf('data-teil="karteikasten"'));
    expect(html).toContain('4 Karten');
    expect(html).toContain('Hausärztin / Hausarzt, Zahnärztin / Zahnarzt, Physiotherapie, Apotheke');
    expect(html).toContain('href="tel:+41442428000"');
    expect(html).toContain('Bahnhofstrasse 1, 8001 Zürich');
    expect(html).toContain('Gilt als Notfall-Angabe');
    expect(zaehle(html, /data-teil="reiter"/g)).toBe(4);
    expect(zaehle(html, /data-teil="kalenderblatt"|data-franchise=|data-teil="herz-puls"/g)).toBe(0);
  });
  it('Fachseite leer: leerer Kasten, keine Zahl, ruhiger Satz; ohne Hausärztin ein Hinweis', () => {
    const leer = kartei({});
    expect(leer).toContain('data-teil="karteikasten"');
    expect(leer).toContain('data-karten="0"');
    expect(leer).not.toContain('data-instrument-zahl="karteikarten"');
    expect(leer).toContain('data-teil="kartei-leer"');
    expect(leer).toContain('Erste Karte anlegen');
    expect(kartei({ doctorsList: [LISTE[0]] })).toContain('data-teil="kartei-ohne-hausarzt"');
    expect(kartei({ doctorsList: [LISTE[0]] })).toContain('1 Karte');
  });
  it('Was ist festgestellt? Liste ohne Bild, dieselbe Liste wie im Kapitel', () => {
    const html = kartei({ chronicDiseasesList: [{ name: 'Asthma', code: 'J45' }, { name: '' }] });
    expect(html).toContain('Was ist festgestellt?');
    expect(html).toContain('Asthma (J45)');
    expect(zaehle(html, /data-diagnose=/g)).toBe(1);
    expect(diagnosenListe({ notfall: { chronicDiseasesList: [{ name: ' Asthma ' }, null] } })).toEqual([{ name: 'Asthma', code: '', notes: '' }]);
    expect(kartei({})).toContain('data-teil="diagnosen-leer"');
  });
  it('Gesundheitsangabe: Karten und Diagnosen stehen in der Export-Vorschau als heikel', () => {
    expect(lies('exportVorschau.js')).toMatch(/'chronicDiseasesList', 'doctorsList'/);
  });
  it('das Fach steht im Koffer, ist eine Seite mit Adresse und wird lazy über den Eingang geladen', () => {
    expect(KOFFER_FAECHER.find((f) => f.key === 'karteikarten')).toMatchObject({ view: 'karteikarten', icon: 'contacts' });
    expect(lies('utils/hashRouter.js')).toMatch(/'karteikarten'/);
    // Seit 23.11.2026 ein Baustein für alle vier Fächer (Startbündel): lazy über den Eingang, Ansicht → Fach in fach.jsx.
    expect(lies('main.jsx')).toMatch(/lazyMitTexten\(\(\) => import\('\.\/bereiche\/notfall\/notfall\.js'\)\.then\(\(m\) => \(\{ default: m\.NotfallFach \}\)\)\)/);
    expect(lies('main.jsx')).toMatch(/\['impfausweis', 'karteikarten', 'blister', 'fieber'\]\.includes\(view\) && React\.createElement\(NotfallFach, \{ fach: view/);
    expect(lies('bereiche/notfall/fach.jsx')).toMatch(/karteikarten: Karteikarten\b/);
    expect(lies('bereiche/notfall/karteikarten.jsx')).not.toMatch(/\.sort\(|doctorsList\)\.filter/); // rechnet nicht selbst
  });
});

// Fach Wochenblister (Stebler Studios 20.11.2026: «A · Wochenblister», «Nur im Fach», Wochentage wählbar).
// Analyse §11 in stebler-studios/analysen/2026-11-18-notfall-gesundheit-bauplan.md.
describe('Fach Wochenblister · Was nehme ich wann?', () => {
  const blister = (notfall, extra = {}) => renderToStaticMarkup(React.createElement(Wochenblister, { palette: LIGHT_PALETTE, t, onUpdateData: () => {},
    data: { ...DEMO_DATA, notfall: { ...notfall } }, ...extra }));
  const LISTE = [
    { name: 'Euthyrox', dose: '50', unit: 'µg', frequency: ['morgens'] },
    { name: 'Atorvastatin', dose: '20', unit: 'mg', frequency: ['abends'] },
    { name: 'Vitamin D', dose: '5600', unit: 'IE', frequency: ['morgens'], tage: [7] },
    { name: 'Dafalgan', dose: '500', unit: 'mg', frequency: ['beiB'] },
    { name: '', frequency: ['mittags'] },
  ];
  it('Rechnung: Raster 7 Tage × 4 Zeiten aus der Medikamentenliste, Wochentage nach ISO, nur mit Namen', () => {
    const s = wochenblister({ notfall: { medicationsList: LISTE } });
    expect(s.raster).toHaveLength(7);
    expect(s.raster[0]).toEqual([1, 0, 1, 0]); // Montag: Euthyrox morgens, Atorvastatin abends
    expect(s.raster[6]).toEqual([2, 0, 1, 0]); // Sonntag: dazu Vitamin D
    expect(s.regelmaessig).toBe(3);
    expect(s.beiBedarf).toBe(1);
    expect(s.einnahmenMin).toBe(2);
    expect(s.einnahmenMax).toBe(2); // belegte Fächer, nicht Tabletten
    expect(s.medikamente.map((m) => m.name)).toEqual(['Euthyrox', 'Atorvastatin', 'Vitamin D', 'Dafalgan']);
  });
  it('Rechnung: Wochentage ohne Auswahl = jeden Tag; Unsinn fällt weg; verschiedene Tage ergeben eine Spanne', () => {
    expect(blisterTage({})).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(blisterTage({ tage: [] })).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(blisterTage({ tage: [7, 1, 9, '3'] })).toEqual([1, 3, 7]);
    const s = wochenblister({ notfall: { medicationsList: [{ name: 'A', frequency: ['morgens'] }, { name: 'B', frequency: ['nachts'], tage: [3] }] } });
    expect([s.einnahmenMin, s.einnahmenMax]).toEqual([1, 2]);
    expect(wochenblister({}).raster.flat().every((n) => n === 0)).toBe(true);
  });
  it('eine Liste: das Fach schreibt medicationsList; das Formular zeigt nur Namen und den Weg zum Wochenblister', () => {
    expect(lies('bereiche/notfall/wochenblister.jsx')).toMatch(/schreibe\('medicationsList'/);
    const cv = lies('ChapterView.jsx');
    expect(cv).toMatch(/'data-teil': 'medikamente-im-blister'/);
    expect(cv.match(/onNavigate\('blister'\)/g)).toHaveLength(1);
    expect(lies('MedicationManager.jsx')).toMatch(/onUpdate\(\{ tage:/);
    // «Bereit» zählt die Liste weiter mit (Feld medications über feldErledigt)
    const ohne = bereitschaft({ notfall: {} }).erledigt;
    expect(bereitschaft({ notfall: { medicationsList: LISTE } }).erledigt).toBe(ohne + 1);
  });
  it('Fachseite: ein Blister, die Zahl darunter, Medikamente je Zeit, Wochentage im Satz', () => {
    const html = blister({ medicationsList: LISTE });
    expect(zaehle(html, /data-teil="blisterpackung"/g)).toBe(1);
    expect(zaehle(html, /data-instrument-zahl="blister"/g)).toBe(1);
    expect(html.indexOf('data-instrument-zahl="blister"')).toBeGreaterThan(html.indexOf('data-teil="blisterpackung"'));
    expect(html).toContain('2 Einnahmen am Tag');
    expect(html).toContain('3 Medikamente · 1 bei Bedarf');
    expect(zaehle(html, /data-teil="mulde"/g)).toBe(28);
    expect(zaehle(html, /data-teil="tablette"/g)).toBe(15); // 7 × Euthyrox + 7 × Atorvastatin + 1 × Vitamin D
    expect(html).toContain('Vitamin D 5600 IE');
    expect(html).toContain('nur So');
    expect(html).toMatch(/data-zeit="beiB"[\s\S]*Dafalgan 500 mg/);
    expect(html).toContain('Packungsbeilage');
    expect(zaehle(html, /data-teil="kalenderblatt"|data-franchise=|data-teil="herz-puls"|data-teil="karteikasten"/g)).toBe(0);
  });
  it('Fachseite leer und nur bei Bedarf: keine Zahl, ruhiger Satz', () => {
    const leer = blister({});
    expect(leer).toContain('data-teil="blisterpackung"');
    expect(leer).not.toContain('data-instrument-zahl="blister"');
    expect(leer).toContain('data-teil="blister-leer"');
    expect(leer).toContain('Erstes Medikament eintragen');
    expect(blister({ medicationsList: [LISTE[3]] })).toContain('Nur Medikamente bei Bedarf');
    expect(blister({ medicationsList: [{ name: 'Ohne' }] })).toContain('data-teil="blister-ohne-zeit"');
  });
  it('das Bild zeichnet höchstens drei Tabletten je Mulde und trägt die Anzahl', () => {
    const raster = [[5, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    const html = renderToStaticMarkup(React.createElement(Blisterpackung, { palette: LIGHT_PALETTE, t, raster }));
    expect(zaehle(html, /data-teil="tablette"/g)).toBe(3);
    expect(html).toContain('data-anzahl="5"');
    expect(html).toContain('>Morgen<');
    expect(html).toContain('>So<');
  });
  it('Gesundheitsangabe: die Medikamentenliste steht in der Export-Vorschau als heikel', () => {
    expect(lies('exportVorschau.js')).toMatch(/'doctorsList', 'medicationsList'/);
  });
  it('das Fach steht im Koffer, ist eine Seite mit Adresse und wird lazy über den Eingang geladen', () => {
    expect(KOFFER_FAECHER.find((f) => f.key === 'blister')).toMatchObject({ view: 'blister', icon: 'blister' });
    expect(lies('utils/hashRouter.js')).toMatch(/'blister'/);
    // Seit 23.11.2026 ein Baustein für alle vier Fächer (Startbündel): lazy über den Eingang, Ansicht → Fach in fach.jsx.
    expect(lies('main.jsx')).toMatch(/lazyMitTexten\(\(\) => import\('\.\/bereiche\/notfall\/notfall\.js'\)\.then\(\(m\) => \(\{ default: m\.NotfallFach \}\)\)\)/);
    expect(lies('main.jsx')).toMatch(/\['impfausweis', 'karteikarten', 'blister', 'fieber'\]\.includes\(view\) && React\.createElement\(NotfallFach, \{ fach: view/);
    expect(lies('bereiche/notfall/fach.jsx')).toMatch(/blister: Wochenblister\b/);
    expect(lies('bereiche/notfall/wochenblister.jsx')).not.toMatch(/medicationsList\)\.filter|\.reduce\(/); // rechnet nicht selbst
  });
});

// Fach Fiebertagebuch (Stebler Studios 20.11.2026: «A · Kurve auf Kalender», Eintrag mit allem, «Für wen» frei, 30 Tage).
// Analyse §12 in stebler-studios/analysen/2026-11-18-notfall-gesundheit-bauplan.md.
describe('Fach Fiebertagebuch · Wie ging es mir die letzten Tage?', () => {
  const JETZT = new Date('2026-11-20T09:00:00'); // Freitag
  const LISTE = [
    { id: 'a', zeit: '2026-11-17T20:00', temp: 38.4, symptome: ['husten', 'kopfweh'] },
    { id: 'b', zeit: '2026-11-18T08:00', temp: '38,1' },
    { id: 'c', zeit: '2026-11-18T20:00', temp: 38.6, medikament: 'Dafalgan' },
    { id: 'f', zeit: '2026-11-18T22:00', temp: 37.9 }, // später, aber tiefer: der Tag zeigt die höchste
    { id: 'd', zeit: '2026-11-20T08:10', temp: 37.4, symptome: ['husten'], notiz: 'viel getrunken' },
    { id: 'e', zeit: '2026-11-19T19:00', temp: 39.2, fuer: 'Lea', symptome: ['halsweh'] },
    { id: 'alt', zeit: '2026-10-01T08:00', temp: 38 },
    { id: 'frueher', zeit: '2026-11-05T08:00', temp: 37.9 },
  ];
  const seite = (notfall, extra = {}) => renderToStaticMarkup(React.createElement(Fiebertagebuch, { palette: LIGHT_PALETTE, t, onUpdateData: () => {},
    heute: JETZT, data: { ...DEMO_DATA, notfall: { ...notfall } }, ...extra }));
  it('Rechnung: je Person ein Verlauf, neueste zuerst, höchste Temperatur je Tag, Tag seit Beginn', () => {
    const s = fiebertagebuch({ notfall: { fiebertagebuch: LISTE } }, JETZT);
    expect(s.personen).toEqual(['', 'Lea']);
    expect(s.fuer).toBe('');
    expect(s.eintraege.map((e) => e.id)).toEqual(['d', 'f', 'c', 'b', 'a', 'frueher']);
    expect(s.tage.map((d) => d.iso)).toEqual(['2026-11-14', '2026-11-15', '2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20']);
    expect(s.tage.map((d) => d.hoechste)).toEqual([null, null, null, 38.4, 38.6, null, 37.4]); // Lea zählt nicht mit
    expect(s.tage[6].wochentag).toBe(5);
    expect(s.tage.map((d) => d.symptome)).toEqual([false, false, false, true, false, false, true]);
    expect(s.aktuell).toBe(true);
    expect(s.tagNr).toBe(4); // 17. bis 20.: der Eintrag vom 5. liegt über der Lücke
    expect(s.zuletztTemp).toBe(37.4);
    const lea = fiebertagebuch({ notfall: { fiebertagebuch: LISTE } }, JETZT, 'Lea');
    expect(lea.eintraege.map((e) => e.id)).toEqual(['e']);
    expect(lea.tagNr).toBe(2);
  });
  it('Rechnung: 30 Tage aufbewahren, Temperatur nur 34–43 °C, ein alter Verlauf ist nicht «Tag»', () => {
    expect(FIEBER_AUFBEWAHREN_TAGE).toBe(30);
    expect(fieberBehalten(LISTE, JETZT).map((e) => e.id)).not.toContain('alt');
    expect(fieberBehalten([{ zeit: '2026-10-21T08:00' }, { zeit: '2026-10-22T08:00' }, { zeit: 'quatsch' }], JETZT)).toEqual([{ zeit: '2026-10-22T08:00' }]);
    expect([fieberTemp('38,25'), fieberTemp(36), fieberTemp('3.8'), fieberTemp('44'), fieberTemp('')]).toEqual([38.3, 36, null, null, null]);
    const alt = fiebertagebuch({ notfall: { fiebertagebuch: [{ zeit: '2026-11-10T08:00', temp: 38 }, { zeit: '2026-11-11T08:00' }] } }, JETZT);
    expect(alt.aktuell).toBe(false);
    expect(alt.tagNr).toBe(null);
    expect(alt.laufTage).toBe(2);
    expect(fiebertagebuch({}, JETZT)).toMatchObject({ anzahl: 0, zuletzt: null, personen: [] });
  });
  it('Fachseite: eine Fieberkurve, die Zahl darunter, kein Thermometer und keine anderen Bilder', () => {
    const html = seite({ fiebertagebuch: LISTE });
    expect(zaehle(html, /data-teil="fieberkurve"/g)).toBe(1);
    expect(zaehle(html, /data-instrument-zahl="fieber"/g)).toBe(1);
    expect(html.indexOf('data-instrument-zahl="fieber"')).toBeGreaterThan(html.indexOf('data-teil="fieberkurve"'));
    expect(html).toContain('>Tag 4<');
    expect(html).toContain('zuletzt 37,4 °C · Husten');
    expect(zaehle(html, /data-teil="messpunkt"/g)).toBe(3);
    expect(zaehle(html, /data-teil="kurvenstueck"/g)).toBe(1); // 17.–18. verbunden, 19. ohne Messung unterbricht
    expect(zaehle(html, /data-teil="symptomstrich"/g)).toBe(2);
    expect(zaehle(html, /data-teil="fieber-personen"/g)).toBe(1);
    expect(html).toContain('Dafalgan genommen');
    expect(html).toContain('viel getrunken');
    expect(html).not.toContain('Lea</span><span'); // Leas Eintrag steht nicht im Verlauf «Ich selbst»
    expect(zaehle(html, /data-franchise=|data-teil="kalenderblatt"|data-teil="herz-puls"|data-teil="karteikasten"|data-teil="blisterpackung"/g)).toBe(0);
    expect(html).toContain('beurteilt nichts');
    expect(html).toContain('30 Tage');
  });
  it('Fachseite leer: keine Zahl, ruhiger Satz, kein «Alle löschen»; Bild ohne Grenzlinie', () => {
    const leer = seite({});
    expect(leer).toContain('data-teil="fieberkurve"');
    expect(leer).not.toContain('data-instrument-zahl="fieber"');
    expect(leer).toContain('data-teil="fieber-leer"');
    expect(leer).not.toContain('data-teil="fieber-alle-loeschen"');
    expect(lies('bereiche/notfall/bilder.jsx').slice(lies('bereiche/notfall/bilder.jsx').indexOf('export const Fieberkurve'))).not.toMatch(/\b38\b|strokeDasharray/);
  });
  it('Formular: Temperatur, Symptome zum Antippen, Medikament aus dem Wochenblister, Notiz, Für wen', () => {
    const html = seite({ fiebertagebuch: LISTE, medicationsList: [{ name: 'Dafalgan', frequency: ['beiB'] }, { name: '' }] }, { formularOffen: true });
    expect(html).toContain('type="datetime-local"');
    expect(html).toContain('value="2026-11-20T09:00"');
    expect(zaehle(html, /data-symptom="/g)).toBe(8);
    expect(zaehle(html, /aria-pressed="false" data-symptom=/g)).toBe(8);
    expect(html).toMatch(/<datalist id="mp-fieber-medikamente"[^>]*><option value="Dafalgan"><\/option><\/datalist>/);
    expect(html).toContain('id="mp-fieber-notiz"');
    expect(html).toContain('id="mp-fieber-wer"');
    expect(lies('bereiche/notfall/fiebertagebuch.jsx')).toMatch(/schreibe\(\[\.\.\.behalten, \{/);
    expect(lies('bereiche/notfall/fiebertagebuch.jsx')).not.toMatch(/medicationsList/); // eine Liste: nur über wochenblister()
  });
  it('das Bild verbindet nur benachbarte Tage und klemmt die Höhe', () => {
    const tage = [41.5, null, 37, 37.5, null, null, 35].map((hoechste, i) => ({ iso: 'x' + i, wochentag: i + 1, hoechste, symptome: false }));
    const html = renderToStaticMarkup(React.createElement(Fieberkurve, { palette: LIGHT_PALETTE, t, tage }));
    expect(zaehle(html, /data-teil="messpunkt"/g)).toBe(4);
    expect(zaehle(html, /data-teil="kurvenstueck"/g)).toBe(1);
    const ys = [...html.matchAll(/data-teil="messpunkt"[^>]*cy="([\d.]+)"/g)].map((m) => Number(m[1]));
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(10);
    expect(Math.max(...ys)).toBeLessThanOrEqual(74);
    expect(html).toContain('>Mo<');
  });
  it('Gesundheitsangabe: das Fiebertagebuch steht in der Export-Vorschau als heikel', () => {
    expect(lies('exportVorschau.js')).toMatch(/'medicationsList', 'fiebertagebuch'\]/);
  });
  it('das Fach steht im Koffer mit eigenem Zeichen (kein Thermometer), hat eine Adresse und wird lazy geladen', () => {
    expect(KOFFER_FAECHER.find((f) => f.key === 'thermometer')).toMatchObject({ view: 'fieber', icon: 'fieberkurve' });
    expect(lies('IconSystem.jsx')).toMatch(/fieberkurve: _fieberkurve,/);
    expect(lies('config/iconInventar.js')).toMatch(/fieberkurve: "/);
    expect(lies('utils/hashRouter.js')).toMatch(/'blister', 'fieber',/);
    // Seit 23.11.2026 ein Baustein für alle vier Fächer (Startbündel): lazy über den Eingang, Ansicht → Fach in fach.jsx.
    expect(lies('main.jsx')).toMatch(/lazyMitTexten\(\(\) => import\('\.\/bereiche\/notfall\/notfall\.js'\)\.then\(\(m\) => \(\{ default: m\.NotfallFach \}\)\)\)/);
    expect(lies('main.jsx')).toMatch(/\['impfausweis', 'karteikarten', 'blister', 'fieber'\]\.includes\(view\) && React\.createElement\(NotfallFach, \{ fach: view/);
    expect(lies('bereiche/notfall/fach.jsx')).toMatch(/fieber: Fiebertagebuch\b/);
    expect(lies('bereiche/notfall/fiebertagebuch.jsx')).not.toMatch(/\.reduce\(|Math\.max/); // rechnet nicht selbst
  });
});
