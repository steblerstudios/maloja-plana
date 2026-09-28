// Eine Stelle für den IPV-Abzug (data/ipvAbzug.js) — Deploy-Gate Runde 2, 24.09.2026.
// Luzern, SRL 866 § 12 Abs. 3: nach der Anmeldefrist (31. Oktober des Vorjahres) werden nur die
// Prämien verbilligt, die nach dem Gesuch fällig werden. #324 hatte das nur im Budget; KK-Last-Karte
// und Prämien-Beleg zogen den vollen Anspruch weiter ab. Hier: alle drei Leser, eine Regel.
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ, calculateIPV } from '../config/cantonalData.js';
import { calculateMonthlyBudget } from '../budgetSync.js';
import { praemienBelegState } from '../data/praemienBeleg.js';
import { ipvAbzug, fristHinweisKey } from '../data/ipvAbzug.js';
import { KKLastCard } from '../KKLastCard.jsx';
import { PraemienBeleg } from '../components/PraemienBeleg.jsx';
import FinanzUebersicht from '../FinanzUebersicht.jsx';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js';
import rm from '../i18n/rm.js';

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const kk = (data) => renderToStaticMarkup(React.createElement(KKLastCard, { palette, t, data, onNavigate: () => {} }));
const beleg = (data) => renderToStaticMarkup(React.createElement(PraemienBeleg, { palette, t, state: praemienBelegState(data) }));

// 20 000 im Jahr, Stadt Luzern, Prämie 450 → Anspruch 282/Monat; Prämie 27 % des Einkommens.
const person = (canton = 'LU', extra = {}) => ({
  basis: { canton, dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: 20000 / 12 },
  wohnen: { postalCode: canton === 'ZH' ? '8004' : '6003', city: '' },
  versicherungen: { kkPremium: 450 },
  ...extra,
});
// Verfügung 2026 für den Kanton der Person (seit Runde 3 gilt sie nur für ihr Jahr und ihren Kanton).
const bestaetigt = (betrag, kanton = 'LU') => ({ anspruch: { ipv: { status: 'bestaetigt', betrag, datum: '2026-01-15', kanton, jahr: 2026 } } });
const HINWEIS = 'ipv.luFristNichtAbgezogen(2026|2025)';
const FRIST_LAEUFT = '2025-10-15T12:00:00';
const FRIST_VORBEI = '2026-09-24T12:00:00';
const am = (datum) => { vi.useFakeTimers(); vi.setSystemTime(new Date(datum)); };

beforeAll(async () => {
  preloadPLZ();
  await import('../data/plzGemeinde.js');
  await import('../config/ipvLuzern.js');
  await import('../config/ipvZuerich.js');
  await new Promise((r) => setTimeout(r, 0));
});
afterEach(() => vi.useRealTimers());

describe('ipvAbzug · die Regel', () => {
  it('Frist läuft: der geschätzte Anspruch', () => {
    am(FRIST_LAEUFT);
    const a = ipvAbzug(person());
    expect(a.grund).toBe('geschaetzt');
    expect(a.betrag).toBe(calculateIPV(person()).amount);
    expect(a.betrag).toBeGreaterThan(0);
  });
  it('Frist vorbei: 0, mit Grund und Jahr', () => {
    am(FRIST_VORBEI);
    expect(ipvAbzug(person())).toEqual({ betrag: 0, grund: 'fristVorbei', frist: { jahr: 2026, vorjahr: 2025 } });
  });
  it('Verfügung mit Betrag: der bestätigte Betrag gilt, auch nach der Frist', () => {
    am(FRIST_VORBEI);
    expect(ipvAbzug(person('LU', bestaetigt(200)))).toEqual({ betrag: 200, grund: 'bestaetigt', frist: null });
  });
  it('Verfügung ohne Betrag belegt keine Zahl: es bleibt bei der Frist-Regel', () => {
    am(FRIST_VORBEI);
    expect(ipvAbzug(person('LU', bestaetigt(0))).grund).toBe('fristVorbei');
  });
  it('«beantragt» ist keine Verfügung: kein Abzug nach der Frist', () => {
    am(FRIST_VORBEI);
    expect(ipvAbzug(person('LU', { anspruch: { ipv: { status: 'beantragt' } } })).betrag).toBe(0);
  });
  it('unbelegter Kanton: 0, nie ein Betrag', () => {
    expect(ipvAbzug(person('BS'))).toMatchObject({ betrag: 0, grund: 'keiner' });
  });
});

describe('Luzern, Anmeldefrist vorbei (September 2026)', () => {
  it('KK-Last-Karte: kein Abzug, der Hinweis steht da', () => {
    am(FRIST_VORBEI);
    const html = kk(person());
    expect(html).not.toContain('kkLast.ipvRelief');
    expect(html).not.toContain('kkLast.underWithIpv');
    expect(html).toContain(HINWEIS);
  });
  it('Prämien-Beleg: kein Abzug, Prämie ganz selbst, der Hinweis steht da', () => {
    am(FRIST_VORBEI);
    const s = praemienBelegState(person());
    expect(s).toMatchObject({ mode: 'fristVorbei', verbilligung: 0, praemie: 450, selbst: 450, confirmed: false });
    const html = beleg(person());
    expect(html).toContain(HINWEIS);
    expect(html).not.toContain('CHF 282');
  });
  it('Finanzübersicht: der Anspruch bleibt stehen, der Frist-Hinweis steht daneben', () => {
    am(FRIST_VORBEI);
    const html = renderToStaticMarkup(React.createElement(FinanzUebersicht, { palette, t, data: person(), onNavigate: () => {} }));
    expect(html).toContain('ipv.luFristVorbei(2026|2025|2027)');
    am(FRIST_LAEUFT);
    const vorher = renderToStaticMarkup(React.createElement(FinanzUebersicht, { palette, t, data: person(), onNavigate: () => {} }));
    expect(vorher).not.toContain('ipv.luFristVorbei');
  });
  it('Budget: wie seit #324 — nichts abgezogen, eigener Hinweis', () => {
    am(FRIST_VORBEI);
    const b = calculateMonthlyBudget(person(), t);
    expect(b.ipvRelief).toBe(0);
    expect(b.ipvAnmeldefristVorbei).toEqual({ jahr: 2026, vorjahr: 2025 });
  });
});

describe('Luzern, Frist läuft (Oktober 2025): Abzug wie bisher', () => {
  it('KK-Last-Karte und Beleg ziehen den Anspruch ab', () => {
    am(FRIST_LAEUFT);
    expect(kk(person())).toContain('kkLast.ipvRelief(282|');
    expect(kk(person())).not.toContain(HINWEIS);
    expect(praemienBelegState(person())).toMatchObject({ mode: 'eligible', verbilligung: 282, selbst: 168 });
  });
});

describe('Verfügung eingetragen: der bestätigte Betrag, in allen drei Lesern', () => {
  it('Luzern nach der Frist', () => {
    am(FRIST_VORBEI);
    const d = person('LU', bestaetigt(200));
    expect(kk(d)).toContain('kkLast.ipvRelief(200|');
    expect(kk(d)).not.toContain(HINWEIS);
    expect(praemienBelegState(d)).toMatchObject({ mode: 'eligible', verbilligung: 200, selbst: 250, confirmed: true });
    const b = calculateMonthlyBudget(d, t);
    expect(b.ipvRelief).toBe(200);
    expect(b.ipvAnmeldefristVorbei).toBeNull();
  });
  it('Zürich: die Verfügung ersetzt die Schätzung', () => {
    am(FRIST_VORBEI);
    const d = person('ZH', bestaetigt(123, 'ZH'));
    expect(calculateMonthlyBudget(d, t).ipvRelief).toBe(123);
    expect(praemienBelegState(d)).toMatchObject({ verbilligung: 123, confirmed: true });
  });
});

describe('Gegenprobe Zürich ohne Verfügung: unverändert, auch nach dem 31. Oktober', () => {
  it('alle drei Leser ziehen den geschätzten Anspruch ab', () => {
    am(FRIST_VORBEI);
    const ipv = calculateIPV(person('ZH'));
    expect(ipv.eligible && ipv.belegt).toBe(true);
    const betrag = Math.min(450, ipv.amount);
    expect(betrag).toBeGreaterThan(0);
    expect(calculateMonthlyBudget(person('ZH'), t).ipvRelief).toBe(ipv.amount);
    expect(praemienBelegState(person('ZH'))).toMatchObject({ mode: 'eligible', verbilligung: betrag, selbst: 450 - betrag });
    expect(kk(person('ZH'))).toContain(`kkLast.ipvRelief(${betrag}|`);
    expect(kk(person('ZH'))).not.toContain('ipv.luFristNichtAbgezogen');
  });
});

describe('Hinweis-Text in allen fünf Sprachen', () => {
  it('ipv.luFristNichtAbgezogen existiert und trägt {jahr} und {vorjahr}', () => {
    for (const s of [de, en, fr, itSprache, rm]) {
      const txt = s.ipv.luFristNichtAbgezogen;
      expect(typeof txt).toBe('string');
      expect(txt).toContain('{jahr}');
      expect(txt).toContain('{vorjahr}');
    }
  });
});

// Wächter: kein Leser zieht an ipvAbzug vorbei einen IPV-Betrag von der Prämie ab, und die
// Frist-Regel wird nirgends sonst gelesen. Erlaubnislisten statt Verbotslisten.
const SRC = path.resolve(__dirname, '..');
const quellen = () => {
  const out = [];
  const lauf = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { if (e.name !== '__tests__' && e.name !== 'i18n' && e.name !== 'assets') lauf(p); }
      else if (/\.(js|jsx)$/.test(e.name) && !/\.test\./.test(e.name)) out.push(p);
    }
  };
  lauf(SRC);
  return out;
};
// Kommentare weg, damit Erklärungen («nie ipv.amount direkt») den Wächter nicht auslösen.
const code = (p) => fs.readFileSync(p, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
const rel = (p) => path.relative(SRC, p).split(path.sep).join('/');

const LESER = ['budgetSync.js', 'KKLastCard.jsx', 'data/praemienBeleg.js'];
const IPV_BETRAG = /\bipv\w*\??\.amount\b/i;
// Eine Subtraktion, deren rechte Seite ein roher IPV-Betrag ist.
const ABZUG_ROH = /-\s*(?:\(\s*)?(?:Number\()?\s*[\w.?]*\bipv\w*\??\.amount\b/i;

describe('Wächter · eine Stelle für den IPV-Abzug', () => {
  it('die Muster schlagen an (Probe gegen erfundene Zeilen)', () => {
    expect(ABZUG_ROH.test('const netto = premium - ipv.amount;')).toBe(true);
    expect(ABZUG_ROH.test('praemie - (ipvResult.amount || 0)')).toBe(true);
    expect(ABZUG_ROH.test('x - Number(ipv?.amount)')).toBe(true);
    expect(ABZUG_ROH.test('praemie - verbilligung')).toBe(false);
    expect(IPV_BETRAG.test('ipv.eligible ? ipv.amount : 0')).toBe(true);
  });

  it('der Scan sieht Dateien, und die drei Leser sind darunter', () => {
    const alle = quellen().map(rel);
    expect(alle.length).toBeGreaterThan(100);
    for (const l of LESER) expect(alle).toContain(l);
  });

  it('die drei Leser rufen ipvAbzug und lesen weder ipv.amount noch die Frist selbst', () => {
    for (const l of LESER) {
      const c = code(path.join(SRC, l));
      expect(c, l).toMatch(/\bipvAbzug\(/);
      expect(IPV_BETRAG.test(c), l + ' liest ipv.amount').toBe(false);
      expect(/anmeldefristVorbei/.test(c.replace(/ipvAnmeldefristVorbei/g, '')), l + ' liest die Frist').toBe(false);
    }
  });

  it('nirgends in src zieht Code einen rohen IPV-Betrag ab', () => {
    const treffer = quellen().filter((p) => ABZUG_ROH.test(code(p))).map(rel);
    expect(treffer).toEqual([]);
  });

  // Seit 28.09.2026 setzen auch Freiburg (ORP Art. 2 al. 1: Antrag bis 31. August), Genf (RaLAMal
  // Art. 10A: nur die Antragsfälle, vor dem 30. November), Obwalden (EV KVG Art. 10), das Tessin
  // (LCAMal Art. 25 Abs. 3, Fachprüfung #484) und Schaffhausen (Dekret SHR 832.110 § 15 Abs. 3 —
  // ohne Antrag bis 30. April verwirkt, Fachprüfung #471, eigener Hinweis-Schlüssel
  // `ipv.shFristNichtAbgezogen`) die Frist.
  it('die Frist-Angabe setzen nur Kantonsmodule mit Anmeldefrist (LU, FR, GE, OW, TI, SH) und liest nur ipvAbzug', () => {
    const erlaubt = ['config/ipvLuzern.js', 'config/ipvFreiburg.js', 'config/ipvGenf.js', 'config/ipvObwalden.js', 'config/ipvTicino.js', 'config/ipvSchaffhausen.js', 'data/ipvAbzug.js'];
    const treffer = quellen().filter((p) => /\banmeldefristVorbei\b/.test(code(p))).map(rel);
    expect(treffer.sort()).toEqual(erlaubt.sort());
  });
});

// Ruling nach der Fachprüfung #472 (28.09.2026): der Frist-Hinweis ist kantonal. Jedes Kantonsmodul,
// das `anmeldefristVorbei` setzt, nennt seinen eigenen Hinweis (`fristNichtAbgezogenKey`) — einzig LU
// darf ohne, weil die drei Leser für LU den Luzerner Text kennen. Ein neuer Kanton mit Frist ohne
// eigenen Schlüssel fiele sonst auf den neutralen Text; hier wird er ROT, bevor das passiert.
describe('Wächter · Frist-Hinweis je Kanton', () => {
  const OHNE_EIGENEN_SCHLUESSEL = ['config/ipvLuzern.js'];
  const module = () => quellen().filter((p) => /^config\/ipv[A-Z]\w*\.js$/.test(rel(p)));

  it('der Scan findet die Kantonsmodule', () => {
    expect(module().map(rel)).toContain('config/ipvFreiburg.js');
    expect(module().map(rel)).toContain('config/ipvObwalden.js');
    expect(module().map(rel)).toContain('config/ipvLuzern.js');
  });

  it('jedes Modul, das die Frist setzt, nennt seinen Hinweis-Schlüssel — ausser LU', () => {
    const fehlt = module()
      .filter((p) => /\banmeldefristVorbei\b/.test(code(p)) && !OHNE_EIGENEN_SCHLUESSEL.includes(rel(p)))
      .filter((p) => !/\bfristNichtAbgezogenKey\s*:\s*'ipv\.\w+'/.test(code(p)))
      .map(rel);
    expect(fehlt).toEqual([]);
  });

  it('Gegenprobe: das Muster erkennt ein Modul ohne Schlüssel', () => {
    const ohne = "extra: { anmeldefristVorbei: fristVorbei }";
    const mit = "extra: { anmeldefristVorbei: fristVorbei, fristNichtAbgezogenKey: 'ipv.xyFristNichtAbgezogen' }";
    expect(/\bfristNichtAbgezogenKey\s*:\s*'ipv\.\w+'/.test(ohne)).toBe(false);
    expect(/\bfristNichtAbgezogenKey\s*:\s*'ipv\.\w+'/.test(mit)).toBe(true);
  });

  it('die Leser: eigener Schlüssel vor LU, LU nur für LU, sonst neutral', () => {
    expect(fristHinweisKey({ canton: 'FR', fristNichtAbgezogenKey: 'ipv.frFristNichtAbgezogen' })).toBe('ipv.frFristNichtAbgezogen');
    expect(fristHinweisKey({ canton: 'FR', fristNichtAbgezogenKey: 'ipv.frFristNichtAbgezogen' }, 'budget')).toBe('ipv.frFristNichtAbgezogen');
    expect(fristHinweisKey({ canton: 'OW', fristNichtAbgezogenKey: 'ipv.owFristNichtAbgezogen' })).toBe('ipv.owFristNichtAbgezogen');
    expect(fristHinweisKey({ canton: 'OW', fristNichtAbgezogenKey: 'ipv.owFristNichtAbgezogen' }, 'budget')).toBe('ipv.owFristNichtAbgezogen');
    expect(fristHinweisKey({ canton: 'LU' })).toBe('ipv.luFristNichtAbgezogen');
    expect(fristHinweisKey({ canton: 'LU' }, 'budget')).toBe('budget.ipvHintLuFristVorbei');
    expect(fristHinweisKey({ canton: 'GE' })).toBe('ipv.fristNichtAbgezogen');
    expect(fristHinweisKey({ canton: 'GE' }, 'budget')).toBe('budget.ipvHintFristVorbei');
    expect(fristHinweisKey(null)).toBe('ipv.fristNichtAbgezogen');
  });

  it('die Leser tragen den Luzerner Text nicht mehr selbst', () => {
    for (const l of LESER) {
      const c = code(path.join(SRC, l));
      expect(/luFristNichtAbgezogen|ipvHintLuFristVorbei/.test(c), l).toBe(false);
      expect(c, l).toMatch(/\bfristHinweisKey\(/);
    }
  });

  it('die neutralen Texte gibt es in allen fünf Sprachen, mit {jahr}', () => {
    for (const s of [de, en, fr, itSprache, rm]) {
      expect(s.ipv.fristNichtAbgezogen).toContain('{jahr}');
      expect(s.budget.ipvHintFristVorbei).toContain('{jahr}');
    }
  });
});
