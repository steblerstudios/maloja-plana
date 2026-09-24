// Die Verfügung gilt nur für ihr Jahr und ihren Kanton — Deploy-Gate Runde 3, 24.09.2026.
// Befund: ipvAbzug fragte nur den Status «bestätigt» ab. Eine LU-Verfügung 2026 über 200 wurde
// am 1.2.2027 weiter abgezogen, obwohl die Schätzung «Jahr vorbei, keine Zahl» sagt — ebenso nach
// einem Kantonswechsel. Und die Finanzübersicht zeigte die Schätzung, während Budget, KK-Last-Karte
// und Prämien-Beleg die Verfügung abzogen.
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ, calculateIPV } from '../config/cantonalData.js';
import { calculateMonthlyBudget } from '../budgetSync.js';
import { praemienBelegState } from '../data/praemienBeleg.js';
import { ipvAbzug } from '../data/ipvAbzug.js';
import { readIpvStatus, nextIpvStatus, IPV_STATUS } from '../data/ipvStatus.js';
import { KKLastCard } from '../KKLastCard.jsx';
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

const PLZ = { LU: '6003', ZH: '8004', BS: '4051' };
const person = (canton = 'LU', extra = {}, jahreseinkommen = 20000) => ({
  basis: { canton, dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: jahreseinkommen / 12 },
  wohnen: { postalCode: PLZ[canton] || '', city: '' },
  versicherungen: { kkPremium: 450 },
  ...extra,
});
const verfuegung = (betrag, kanton, jahr, datum = `${jahr}-01-15`) =>
  ({ anspruch: { ipv: { status: 'bestaetigt', betrag, datum, kanton, jahr } } });
// So wie Einträge vor 0.1.40-beta gespeichert sind: ohne Kanton und Jahr.
const alteVerfuegung = (betrag) => ({ anspruch: { ipv: { status: 'bestaetigt', betrag, datum: '2026-01-15' } } });

const am = (datum) => { vi.useFakeTimers(); vi.setSystemTime(new Date(datum)); };
const SEPT_2026 = '2026-09-24T12:00:00';
const FEB_2027 = '2027-02-01T12:00:00';

beforeAll(async () => {
  preloadPLZ();
  await import('../data/plzGemeinde.js');
  await import('../config/ipvLuzern.js');
  await import('../config/ipvZuerich.js');
  await new Promise((r) => setTimeout(r, 0));
});
afterEach(() => vi.useRealTimers());

describe('ipvStatus speichert, wofür die Verfügung gilt', () => {
  it('«Verfügung erhalten» schreibt Kanton und Jahr mit', () => {
    am(SEPT_2026);
    expect(nextIpvStatus(IPV_STATUS.BESTAETIGT, { betrag: 200, kanton: 'LU' }))
      .toEqual({ status: 'bestaetigt', betrag: 200, datum: '2026-09-24', kanton: 'LU', jahr: 2026 });
  });
  it('das Jahr folgt dem Datum, wenn eines mitkommt', () => {
    expect(nextIpvStatus(IPV_STATUS.BESTAETIGT, { betrag: 1, datum: '2025-12-30', kanton: 'ZH' }).jahr).toBe(2025);
  });
  it('ohne Kanton wird keiner erfunden', () => {
    expect(nextIpvStatus(IPV_STATUS.BESTAETIGT, { betrag: 1, datum: '2026-01-01' })).not.toHaveProperty('kanton');
  });
  it('ein alter Eintrag bleibt lesbar, Kanton und Jahr sind leer — nichts gelöscht', () => {
    expect(readIpvStatus(alteVerfuegung(200)))
      .toEqual({ status: 'bestaetigt', betrag: 200, datum: '2026-01-15', kanton: null, jahr: null });
  });
});

describe('Verfügung aus dem Vorjahr: kein Abzug aus der Verfügung', () => {
  it('LU-Verfügung 2026 am 1.2.2027: es gilt die Schätzung («Jahr vorbei» → keine Zahl)', () => {
    am(FEB_2027);
    const d = person('LU', verfuegung(200, 'LU', 2026));
    expect(calculateIPV(d).offen).toBe('jahr');
    expect(ipvAbzug(d)).toEqual(ipvAbzug(person('LU')));
    expect(ipvAbzug(d).betrag).toBe(0);
    expect(calculateMonthlyBudget(d, t).ipvRelief).toBe(0);
    expect(kk(d)).not.toContain('kkLast.ipvRelief(200|');
    expect(praemienBelegState(d)).toMatchObject({ verbilligung: 0, confirmed: false });
  });
  it('ZH-Verfügung 2026 im Jahr 2027: nicht die Verfügung, sondern die Regeln der Schätzung', () => {
    am(FEB_2027);
    const d = person('ZH', verfuegung(123, 'ZH', 2026));
    expect(ipvAbzug(d).grund).not.toBe('bestaetigt');
    expect(ipvAbzug(d)).toEqual(ipvAbzug(person('ZH')));
  });
});

describe('Verfügung aus einem anderen Kanton: kein Abzug aus der Verfügung', () => {
  it('ZH-Verfügung, Wohnkanton jetzt LU nach der Frist → Frist-Regel, 0', () => {
    am(SEPT_2026);
    const d = person('LU', verfuegung(200, 'ZH', 2026));
    expect(ipvAbzug(d)).toEqual(ipvAbzug(person('LU')));
    expect(ipvAbzug(d).grund).toBe('fristVorbei');
    expect(calculateMonthlyBudget(d, t).ipvRelief).toBe(0);
    expect(praemienBelegState(d)).toMatchObject({ mode: 'fristVorbei', verbilligung: 0, confirmed: false });
  });
  it('LU-Verfügung, Wohnkanton jetzt BS (unbelegt) → keine Zahl', () => {
    am(SEPT_2026);
    const d = person('BS', verfuegung(200, 'LU', 2026));
    expect(ipvAbzug(d)).toMatchObject({ betrag: 0, grund: 'keiner' });
  });
  // Runde 4: Altbestand zieht höchstens den Verfügungsbetrag ab, nie mehr als die Schätzung —
  // in LU nach der Frist ist das 0 (Details: ipvAltVerfuegung.test.js).
  it('ein alter Eintrag ohne Kanton/Jahr in LU nach der Frist → wie die Schätzung, 0', () => {
    am(SEPT_2026);
    const d = person('LU', alteVerfuegung(200));
    expect(ipvAbzug(d)).toEqual(ipvAbzug(person('LU')));
    expect(praemienBelegState(d).confirmed).toBe(false);
  });
});

describe('Verfügung laufendes Jahr, aktueller Kanton: ihr Betrag wird abgezogen', () => {
  it('LU 2026 im September 2026 (nach der Frist)', () => {
    am(SEPT_2026);
    const d = person('LU', verfuegung(200, 'LU', 2026));
    expect(ipvAbzug(d)).toEqual({ betrag: 200, grund: 'bestaetigt', frist: null });
    expect(calculateMonthlyBudget(d, t).ipvRelief).toBe(200);
    expect(kk(d)).toContain('kkLast.ipvRelief(200|');
    expect(praemienBelegState(d)).toMatchObject({ verbilligung: 200, confirmed: true });
  });
  it('BS (unbelegt) 2026 im September 2026: die Verfügung liefert den Betrag', () => {
    am(SEPT_2026);
    expect(ipvAbzug(person('BS', verfuegung(150, 'BS', 2026)))).toMatchObject({ betrag: 150, grund: 'bestaetigt' });
  });
});

describe('Finanzübersicht zeigt den Verfügungsbetrag, wo die anderen ihn abziehen', () => {
  const ipvKachel = (html) => {
    const i = html.indexOf('finanzUebersicht.ipv<');
    return i < 0 ? '' : html.slice(i, i + 1200);
  };
  it('ZH, Verfügung 200: Kachel sagt CHF 200 laut Verfügung, nicht die Schätzung', () => {
    am(SEPT_2026);
    const schaetzung = calculateIPV(person('ZH')).amount;
    expect(schaetzung).not.toBe(200);
    const k = ipvKachel(uebersicht(person('ZH', verfuegung(200, 'ZH', 2026))));
    expect(k).toContain('CHF 200');
    expect(k).toContain('finanzUebersicht.ipvLautVerfuegung');
    expect(k).not.toContain('CHF ' + schaetzung + ' ');
  });
  it('hohes Einkommen mit Verfügung: nicht «Kein Anspruch»', () => {
    am(SEPT_2026);
    const k = ipvKachel(uebersicht(person('ZH', verfuegung(90, 'ZH', 2026), 150000)));
    expect(k).not.toContain('finanzUebersicht.notEligible');
    expect(k).toContain('CHF 90');
  });
  it('BS mit Verfügung: nicht «offen»', () => {
    am(SEPT_2026);
    const k = ipvKachel(uebersicht(person('BS', verfuegung(150, 'BS', 2026))));
    expect(k).not.toContain('ipv.statusOffen');
    expect(k).toContain('CHF 150');
  });
  it('Druckfassung: dieselbe Zeile', () => {
    am(SEPT_2026);
    const d = person('ZH', verfuegung(200, 'ZH', 2026));
    const w = { income: 1667, canton: 'ZH', ipv: calculateIPV(d), ipvAbzug: ipvAbzug(d), sozialhilfe: {}, el: {} };
    const zeile = druckAbschnitte(t, w).flatMap((a) => a.zeilen).find((z) => z.label === 'finanzUebersicht.ipv').html;
    expect(zeile).toContain('CHF 200');
    expect(zeile).toContain('finanzUebersicht.ipvLautVerfuegung');
  });
  it('Gegenprobe ZH ohne Verfügung: Kachel und Druck unverändert mit der Schätzung', () => {
    am(SEPT_2026);
    const d = person('ZH');
    const ipv = calculateIPV(d);
    const k = ipvKachel(uebersicht(d));
    expect(k).toContain('CHF ' + ipv.amount);
    expect(k).not.toContain('finanzUebersicht.ipvLautVerfuegung');
    const w = { income: 1667, canton: 'ZH', ipv, ipvAbzug: ipvAbzug(d), sozialhilfe: {}, el: {} };
    const zeile = druckAbschnitte(t, w).flatMap((a) => a.zeilen).find((z) => z.label === 'finanzUebersicht.ipv').html;
    expect(zeile).toContain('✓ CHF ' + ipv.amount);
  });
  it('der Schlüssel existiert in allen fünf Sprachen', () => {
    for (const s of [de, en, fr, itSprache, rm]) expect(typeof s.finanzUebersicht.ipvLautVerfuegung).toBe('string');
  });
});

describe('Budget-Hinweis bei Verfügung', () => {
  it('kein «möglicherweise Anspruch», sondern «laut Verfügung»', () => {
    am(SEPT_2026);
    const recs = calculateMonthlyBudget(person('ZH', verfuegung(200, 'ZH', 2026)), t).recommendations.map((r) => r.text);
    expect(recs).toContain('budget.ipvHintVerfuegung(200)');
    expect(recs.some((x) => x.startsWith('budget.ipvHint('))).toBe(false);
  });
  it('Gegenprobe ohne Verfügung: der bisherige Hinweis', () => {
    am(SEPT_2026);
    const recs = calculateMonthlyBudget(person('ZH'), t).recommendations.map((r) => r.text);
    expect(recs.some((x) => x.startsWith('budget.ipvHint('))).toBe(true);
  });
  it('der Schlüssel existiert in allen fünf Sprachen und trägt {amount}', () => {
    for (const s of [de, en, fr, itSprache, rm]) {
      const v = s.budget.ipvHintVerfuegung;
      for (const txt of typeof v === 'string' ? [v] : [v.sie, v.du]) expect(txt).toContain('{amount}');
    }
  });
});

describe('Luzern «hier nicht abgezogen»: der EL/Sozialhilfe-Satz steht auch dort', () => {
  const letzterSatz = (s) => s.trim().split(/(?<=[.!?])\s+/).pop();
  it('gleicher Schlusssatz wie luFristLaeuft/luFristVorbei, in allen fünf Sprachen', () => {
    for (const s of [de, en, fr, itSprache, rm]) {
      const el = letzterSatz(s.ipv.luFristLaeuft);
      expect(letzterSatz(s.ipv.luFristVorbei)).toBe(el);
      expect(s.ipv.luFristNichtAbgezogen).toContain(el);
    }
  });
});
