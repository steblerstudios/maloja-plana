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
import { GesundheitZuhause, naechstesFaellig, naechsteVorsorge, lagenStand, bereitschaft, Impfausweis, impfAbstandJahre, naechsteImpfung, KOFFER_FAECHER, impfcheck, impfKosten, impfKostenJahr, impfZahlerVorschlag, IMPF_RICHTPREISE } from '../bereiche/notfall/notfall.js';

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
  it('Arztkoffer: ein Thermometer (gross), ein Kalenderblatt, je eine Hauptzahl darunter', () => {
    const html = arztkoffer(MIT_BELEG);
    expect(zaehle(html, /data-franchise="gross"/g)).toBe(1);
    expect(zaehle(html, /data-franchise="/g)).toBe(1);
    expect(zaehle(html, /data-teil="kalenderblatt"/g)).toBe(1);
    expect(zaehle(html, /data-instrument-zahl="franchise"/g)).toBe(1);
    expect(zaehle(html, /data-instrument-zahl="faellig"/g)).toBe(1);
    expect(html.indexOf('data-instrument-zahl="franchise"')).toBeGreaterThan(html.indexOf('data-franchise="gross"'));
    expect(html.indexOf('data-instrument-zahl="faellig"')).toBeGreaterThan(html.indexOf('data-teil="kalenderblatt"'));
    // die Fragen stehen vor den Fächern
    // Reihenfolge der vereinten Seite: Koffer, dann die Fragen (Franchise, fällig), dann Bereit.
    const reihe = ['data-teil="gesundheit-koffer"', 'data-teil="gesundheit-franchise"', 'data-teil="gesundheit-faellig"', 'data-teil="notfall-bereit"'].map((x) => html.indexOf(x));
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
  it('Kapitel Notfall: ein Herz mit Puls (gross), die Zahl darunter, kein Balken und kein Ring mehr', () => {
    for (const d of [DEMO_DATA, MIT_BELEG, {}]) {
      const html = kapitel(d);
      expect(zaehle(html, /data-teil="herz-puls"/g)).toBe(1);
      expect(html).toContain('data-groesse="gross"');
      expect(zaehle(html, /data-instrument-zahl="bereit"/g)).toBe(1);
      expect(html.indexOf('data-instrument-zahl="bereit"')).toBeGreaterThan(html.indexOf('data-teil="herz-puls"'));
      expect(html).not.toContain('data-bereit=');
    }
  });
  it('Kachel: dasselbe Herz klein, mit derselben Rechnung', () => {
    const panel = lies('components/InstrumentePanel.jsx');
    expect(panel).toMatch(/HerzPuls, \{ palette, lagen: lagenStand\(data\), groesse: 'klein' \}/);
    expect(panel).not.toMatch(/BereitRingKlein/);
  });
});

describe('Ablesung am Thermometer (Sophie 18.11.2026, «A · Skala am Thermometer»)', () => {
  it('Arztkoffer: Selbstbehalt, Franchise, noch offen, erreicht stehen am Thermometer, in dieser Reihenfolge von oben', () => {
    const html = arztkoffer(MIT_BELEG);
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

describe('Kapitel Gesundheit und Arztkoffer sind eine Seite (Sophie 18.11.2026)', () => {
  it('der offene Koffer: fertige Fächer als Knöpfe im Deckel, geplante gestrichelt im Boden, keine Notfallkarte doppelt', () => {
    const html = kapitel(DEMO_DATA);
    const deckel = html.slice(html.indexOf('data-teil="koffer-deckel"'), html.indexOf('data-teil="koffer-boden"'));
    expect(deckel.match(/<button[^>]*data-fach="([a-z]+)"/g).map((m) => m.match(/data-fach="([a-z]+)"/)[1])).toEqual(['kvg', 'kkbeleg', 'impfausweis']);
    expect(zaehle(html, /data-bald="ja"/g)).toBe(3);
    expect(zaehle(html, /data-kachel="notfallkarte"/g)).toBe(1);
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

// Fach Impfausweis (Sophie 19.11.2026, «A · Liste + fällig», «Ja, mitzählen»). Regel: Schweizerischer Impfplan 2026
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
      { id: 'c', art: 'fsme', datum: '2017-05-02' }, { id: 'd', art: 'grippe', datum: '2026-10-01' },
    ]);
    expect(naechsteImpfung(d, HEUTE)).toMatchObject({ art: 'impfung', key: 'fsme', iso: '2027-05-02', abstand: 10, vorbei: false });
    const ohneFsme = mitImpfungen([{ id: 'a', art: 'dt', datum: '2001-03-14' }, { id: 'b', art: 'dt', datum: '2011-03-14' }]);
    expect(naechsteImpfung(ohneFsme, HEUTE)).toMatchObject({ key: 'dt', iso: '2031-03-14', abstand: 20 }); // mit 30 geimpft
    expect(naechsteImpfung(mitImpfungen([{ id: 'd', art: 'grippe', datum: '2026-10-01' }]), HEUTE)).toBeNull();
  });
  it('«Als Nächstes fällig» zählt die Impfung mit, und der Weg führt ins Fach', () => {
    const d = mitImpfungen([{ id: 'c', art: 'fsme', datum: '2016-11-01' }]); // fällig 01.11.2026, vor dem Beleg 15.12.
    expect(naechstesFaellig(d, {}, HEUTE)).toMatchObject({ art: 'impfung', key: 'fsme', iso: '2026-11-01', vorbei: true });
    const html = renderToStaticMarkup(React.createElement(GesundheitZuhause, { palette: LIGHT_PALETTE, t, data: d, onNavigate: () => {}, letzteBesuche: {}, heute: HEUTE }));
    expect(html).toContain('FSME (Zecken) · nächste empfohlene Auffrischimpfung');
    expect(html).toContain('Zum Impfausweis');
    expect(zaehle(html, /data-teil="kalenderblatt"/g)).toBe(1);
  });
  it('Fachseite: ein Kalenderblatt, die Zahl darunter, Liste neueste zuerst, Quelle verlinkt', () => {
    const html = fach(mitImpfungen([{ id: 'a', art: 'dt', datum: '2011-03-14' }, { id: 'c', art: 'fsme', datum: '2022-05-02' }]));
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
    expect(lies('main.jsx')).toMatch(/lazyMitTexten\(\(\) => import\('\.\/bereiche\/notfall\/notfall\.js'\)\.then\(\(m\) => \(\{ default: m\.Impfausweis \}\)\)\)/);
    expect(lies('bereiche/notfall/impfausweis.jsx')).not.toMatch(/setFullYear|setMonth/); // rechnet nicht selbst
  });
});

// Impfcheck und Kosten (Sophie 19.11.2026: «Ja, nach Alter», Preise «alle drei», abwählbar). Quelle: Referenzdokument
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
    expect(impfKosten({ zahler: 'kasse', preis: 62, gebuehr: 15 })).toEqual({ gesamt: 77, eigen: 7.7, kasse: 69.3, zahler: 'kasse' });
    expect(impfKosten({ zahler: 'selbst', preis: 100 })).toMatchObject({ eigen: 100, kasse: 0 });
    expect(impfKosten({ zahler: 'zusatz', preis: 100 })).toMatchObject({ eigen: null, kasse: null });
    expect(impfKosten({ zahler: 'kasse' })).toBeNull();
    const d = mit([{ id: 'a', art: 'fsme', datum: '2026-05-02', zahler: 'kasse', preis: 62, gebuehr: 15 },
      { id: 'b', art: 'hepa', datum: '2026-06-01', zahler: 'zusatz', preis: 90 }, { id: 'c', art: 'dt', datum: '2025-01-01', zahler: 'selbst', preis: 40 }], '1979-06-15');
    expect(impfKostenJahr(d, 2026)).toEqual({ gesamt: 167, eigen: 7.7, offen: 1, mitPreis: 2 });
  });
  it('Vorschlag «wer zahlt»: Grundversicherung nur, wenn für das Alter empfohlen', () => {
    const d = mit([], '1979-06-15');
    expect(impfZahlerVorschlag(d, 'fsme', '2026-05-02')).toBe('kasse');
    expect(impfZahlerVorschlag(d, 'grippe', '2026-10-01')).toBe('selbst'); // 47-jährig, nicht für alle empfohlen
    expect(impfZahlerVorschlag(d, 'hepa', '2026-10-01')).toBe('selbst');
  });
  it('Fachseite: drei Fragen, eine Hauptzahl je Frage, ein Kalenderblatt; Kosten lassen sich ausblenden', () => {
    const d = mit([{ id: 'a', art: 'fsme', datum: '2026-05-02', zahler: 'kasse', preis: 62, gebuehr: 15 }], '1979-06-15');
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
  it('der Katalog sagt nicht mehr «Franchise» für empfohlene Impfungen', () => {
    expect(t('kvg.impfungenDetail3')).toMatch(/ohne Franchise/);
  });
});
