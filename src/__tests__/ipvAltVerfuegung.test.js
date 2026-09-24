// Altbestand: Verfügungen von vor 0.1.40-beta — Deploy-Gate Runde 4, 24.09.2026.
// Befund (gemessen auf 3fdd170): ein Eintrag {status:'bestaetigt', betrag, datum} OHNE kanton/jahr
// galt als «nicht zuordenbar» und fiel ganz auf die Schätzung zurück. ZH, 20 000 Fr./Jahr,
// gespeicherte Verfügung 100: Abzug «geschaetzt» 308 in Budget, Beleg und Kachel, dazu der
// Budget-Hinweis «möglicherweise Anspruch ca. 308». Die Verfügung sagt aber 100.
// Regel (data/ipvAbzug.js): Abzug = min(Verfügungsbetrag, Schätzung nach allen ihren Regeln).
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ, calculateIPV } from '../config/cantonalData.js';
import { calculateMonthlyBudget } from '../budgetSync.js';
import { praemienBelegState } from '../data/praemienBeleg.js';
import { ipvAbzug, verfuegungZuordnung } from '../data/ipvAbzug.js';
import { nextIpvStatus, IPV_STATUS } from '../data/ipvStatus.js';
import { KKLastCard } from '../KKLastCard.jsx';
import { PraemienBeleg } from '../components/PraemienBeleg.jsx';
import FinanzUebersicht, { druckAbschnitte } from '../FinanzUebersicht.jsx';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js';
import rm from '../i18n/rm.js';

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const kk = (data) => renderToStaticMarkup(React.createElement(KKLastCard, { palette, t, data, onNavigate: () => {} }));
const uebersicht = (data) => renderToStaticMarkup(React.createElement(FinanzUebersicht, { palette, t, data, onNavigate: () => {} }));
const ipvKachel = (html) => {
  const i = html.indexOf('finanzUebersicht.ipv<');
  return i < 0 ? '' : html.slice(i, i + 1200);
};
const druckZeile = (d) => {
  const w = { income: 1667, canton: d.basis.canton, ipv: calculateIPV(d), ipvAbzug: ipvAbzug(d), sozialhilfe: {}, el: {} };
  return druckAbschnitte(t, w).flatMap((a) => a.zeilen).find((z) => z.label === 'finanzUebersicht.ipv').html;
};

const PLZ = { LU: '6003', ZH: '8004', BS: '4051' };
const person = (canton = 'ZH', extra = {}, jahreseinkommen = 20000) => ({
  basis: { canton, dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: jahreseinkommen / 12 },
  wohnen: { postalCode: PLZ[canton] || '', city: '' },
  versicherungen: { kkPremium: 450 },
  ...extra,
});
// So wie Einträge vor 0.1.40-beta gespeichert sind: ohne Kanton und Jahr.
const alteVerfuegung = (betrag) => ({ anspruch: { ipv: { status: 'bestaetigt', betrag, datum: '2026-01-15' } } });
const teilVerfuegung = (felder) => ({ anspruch: { ipv: { status: 'bestaetigt', betrag: 100, datum: '2026-01-15', ...felder } } });

const am = (datum) => { vi.useFakeTimers(); vi.setSystemTime(new Date(datum)); };
const SEPT_2026 = '2026-09-24T12:00:00';

beforeAll(async () => {
  preloadPLZ();
  await import('../data/plzGemeinde.js');
  await import('../config/ipvLuzern.js');
  await import('../config/ipvZuerich.js');
  await new Promise((r) => setTimeout(r, 0));
});
afterEach(() => vi.useRealTimers());

describe('Messpunkt: ZH, 20 000 Fr./Jahr — die Schätzung ist 308', () => {
  it('ohne Verfügung zieht alles 308 ab (Abdruck aus #325/#326 unverändert)', () => {
    am(SEPT_2026);
    const d = person('ZH');
    expect(ipvAbzug(d)).toEqual({ betrag: 308, grund: 'geschaetzt', frist: null });
    expect(calculateMonthlyBudget(d, t).ipvRelief).toBe(308);
  });
});

describe('Altbestand ZH, Verfügung 100: überall 100, nicht 308', () => {
  it('ipvAbzug: höchstens der Verfügungsbetrag, eigener Grund', () => {
    am(SEPT_2026);
    const d = person('ZH', alteVerfuegung(100));
    expect(verfuegungZuordnung(d)).toBe('unzugeordnet');
    expect(ipvAbzug(d)).toEqual({ betrag: 100, grund: 'verfuegungUnzugeordnet', frist: null });
  });
  it('Budget: 100 abgezogen, Hinweis sagt «höchstens die Verfügung», nicht «möglicherweise Anspruch ca. 308»', () => {
    am(SEPT_2026);
    const b = calculateMonthlyBudget(person('ZH', alteVerfuegung(100)), t);
    expect(b.ipvRelief).toBe(100);
    const recs = b.recommendations.map((r) => r.text);
    expect(recs).toContain('budget.ipvHintVerfuegungUnzugeordnet(100)');
    expect(recs.some((x) => x.startsWith('budget.ipvHint('))).toBe(false);
  });
  it('KK-Last-Karte: 100', () => {
    am(SEPT_2026);
    const html = kk(person('ZH', alteVerfuegung(100)));
    expect(html).toContain('kkLast.ipvRelief(100|');
    expect(html).not.toContain('kkLast.ipvRelief(308|');
  });
  it('Prämien-Beleg: 100, kein Stempel, «Verfügung ohne Jahr» statt «geschätzt»', () => {
    am(SEPT_2026);
    const s = praemienBelegState(person('ZH', alteVerfuegung(100)));
    expect(s).toMatchObject({ mode: 'eligible', verbilligung: 100, selbst: 350, confirmed: false, verfuegungOhneJahr: true });
    const html = renderToStaticMarkup(React.createElement(PraemienBeleg, { palette, t, state: s }));
    expect(html).toContain('beleg.verfuegungOhneJahr');
    expect(html).not.toContain('beleg.geschaetzt');
    expect(html).not.toContain('ipvStatus.stamp');
  });
  it('Finanzübersicht: Kachel und Druck sagen 100, nicht 308', () => {
    am(SEPT_2026);
    const d = person('ZH', alteVerfuegung(100));
    const k = ipvKachel(uebersicht(d));
    expect(k).toContain('CHF 100');
    expect(k).toContain('finanzUebersicht.ipvVerfuegungOhneJahr');
    expect(k).not.toContain('CHF 308');
    const zeile = druckZeile(d);
    expect(zeile).toContain('CHF 100');
    expect(zeile).toContain('finanzUebersicht.ipvVerfuegungOhneJahr');
    expect(zeile).not.toContain('CHF 308');
  });
});

describe('Altbestand: nie mehr als die Schätzung', () => {
  it('Verfügung 500 > Schätzung 308 → 308', () => {
    am(SEPT_2026);
    const d = person('ZH', alteVerfuegung(500));
    expect(ipvAbzug(d)).toEqual({ betrag: 308, grund: 'verfuegungUnzugeordnet', frist: null });
    expect(calculateMonthlyBudget(d, t).ipvRelief).toBe(308);
    expect(praemienBelegState(d).verbilligung).toBe(308);
  });
  it('Luzern nach der Anmeldefrist → 0, Grund der Frist', () => {
    am(SEPT_2026);
    const d = person('LU', alteVerfuegung(200));
    expect(calculateIPV(person('LU')).anmeldefristVorbei).toBe(true);
    expect(ipvAbzug(d)).toMatchObject({ betrag: 0, grund: 'fristVorbei' });
    expect(calculateMonthlyBudget(d, t).ipvRelief).toBe(0);
    expect(praemienBelegState(d)).toMatchObject({ mode: 'fristVorbei', verbilligung: 0 });
  });
  it('unbelegter Kanton (E9) → 0, keine Zahl', () => {
    am(SEPT_2026);
    expect(ipvAbzug(person('BS', alteVerfuegung(200)))).toMatchObject({ betrag: 0, grund: 'keiner' });
  });
  it('kein Anspruch nach der Schätzung → 0', () => {
    am(SEPT_2026);
    expect(ipvAbzug(person('ZH', alteVerfuegung(100), 150000))).toMatchObject({ betrag: 0, grund: 'keiner' });
  });
});

describe('Was bekannt ist und nicht passt, gilt nicht (wie #326)', () => {
  it('Kanton ZH ohne Jahr, Wohnkanton jetzt LU → Schätzung von LU', () => {
    am(SEPT_2026);
    const d = person('LU', teilVerfuegung({ kanton: 'ZH' }));
    expect(verfuegungZuordnung(d)).toBe('giltNicht');
    expect(ipvAbzug(d)).toEqual(ipvAbzug(person('LU')));
  });
  it('Jahr 2025 ohne Kanton, im Jahr 2026 → Schätzung', () => {
    am(SEPT_2026);
    const d = person('ZH', teilVerfuegung({ jahr: 2025 }));
    expect(verfuegungZuordnung(d)).toBe('giltNicht');
    expect(ipvAbzug(d)).toEqual(ipvAbzug(person('ZH')));
  });
  it('Kanton passt, Jahr fehlt → noch unzugeordnet (gedeckelt)', () => {
    am(SEPT_2026);
    const d = person('ZH', teilVerfuegung({ kanton: 'ZH' }));
    expect(ipvAbzug(d)).toMatchObject({ betrag: 100, grund: 'verfuegungUnzugeordnet' });
  });
  it('Gegenprobe: Verfügung ZH 2026 gilt ganz (auch über der Schätzung)', () => {
    am(SEPT_2026);
    expect(ipvAbzug(person('ZH', teilVerfuegung({ kanton: 'ZH', jahr: 2026, betrag: 400 }))))
      .toEqual({ betrag: 400, grund: 'bestaetigt', frist: null });
  });
});

describe('nextIpvStatus: nichts wird still zugeordnet', () => {
  it('jahr: null bleibt offen (Betrag ändern am Altbestand)', () => {
    const next = nextIpvStatus(IPV_STATUS.BESTAETIGT, { betrag: 120, datum: '2026-01-15', kanton: null, jahr: null });
    expect(next).toEqual({ status: 'bestaetigt', betrag: 120, datum: '2026-01-15' });
  });
  it('ein gewähltes Jahr wird gespeichert, auch das folgende', () => {
    am(SEPT_2026);
    expect(nextIpvStatus(IPV_STATUS.BESTAETIGT, { betrag: 80, kanton: 'ZH', jahr: 2027 }))
      .toEqual({ status: 'bestaetigt', betrag: 80, datum: '2026-09-24', kanton: 'ZH', jahr: 2027 });
  });
});

describe('Texte in allen fünf Sprachen', () => {
  const sprachen = [de, en, fr, itSprache, rm];
  const alle = (v) => (typeof v === 'string' ? [v] : [v.sie, v.du]);
  it('Budget-Hinweis trägt {amount}', () => {
    for (const s of sprachen) for (const x of alle(s.budget.ipvHintVerfuegungUnzugeordnet)) expect(x).toContain('{amount}');
  });
  it('Seite Prämienverbilligung: Zuordnen-Frage, Knopf, «gilt nicht», Jahr', () => {
    for (const s of sprachen) {
      expect(typeof s.ipvStatus.ohneJahrLead).toBe('string');
      for (const k of ['zuordnenFrage', 'zuordnenJa']) {
        expect(s.ipvStatus[k]).toContain('{kanton}');
        expect(s.ipvStatus[k]).toContain('{jahr}');
      }
      for (const p of ['{kanton}', '{jahr}', '{aktKanton}', '{aktJahr}']) expect(s.ipvStatus.giltNicht).toContain(p);
      expect(typeof s.ipvStatus.jahrLabel).toBe('string');
      expect(typeof s.beleg.verfuegungOhneJahr).toBe('string');
      expect(typeof s.finanzUebersicht.ipvVerfuegungOhneJahr).toBe('string');
    }
  });
});
