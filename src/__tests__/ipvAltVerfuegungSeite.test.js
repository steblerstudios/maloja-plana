// Seite Prämienverbilligung — Deploy-Gate Runde 4, 24.09.2026.
// Befund: die Seite prüfte nur «bestätigt» und zeigte «CHF 200, Betrag aus Ihrer Verfügung»,
// während Budget, Beleg und Kachel die Verfügung (Vorjahr, anderer Kanton) nicht abzogen. Ein
// Altbestand ohne Kanton/Jahr blieb für immer unzugeordnet: das Ändern des Betrags schrieb
// kanton: null zurück. Und das Jahr kam immer vom heutigen Datum.
//
// Ohne DOM: React.useState über einen Slot-Speicher (Muster aus k62Konkubinat.test.js), Klicks
// über die onClick-/onChange-Props der gerenderten Knoten.
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';

const zustand = { slots: [], i: 0 };
vi.mock('react', async (importOriginal) => {
  const R = await importOriginal();
  const useState = (init) => {
    const i = zustand.i++;
    if (!(i in zustand.slots)) zustand.slots[i] = typeof init === 'function' ? init() : init;
    return [zustand.slots[i], (v) => { zustand.slots[i] = typeof v === 'function' ? v(zustand.slots[i]) : v; }];
  };
  const gemockt = { ...R, useState, useContext: () => null };
  return { ...gemockt, default: gemockt };
});

const { preloadPLZ } = await import('../config/cantonalData.js');
const { PremiumSubsidy } = await import('../PremiumSubsidy.jsx');

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);

const knoten = (el, out = []) => {
  if (Array.isArray(el)) { el.forEach((c) => knoten(c, out)); return out; }
  if (!el || typeof el !== 'object' || !el.props) return out;
  out.push(el);
  knoten(el.props.children, out);
  return out;
};
const textVon = (el) => [el.props.children].flat(Infinity).filter((c) => typeof c === 'string').join('');

const PLZ = { LU: '6003', ZH: '8004' };
const person = (canton = 'ZH', ipv) => ({
  basis: { canton, dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: 20000 / 12 },
  wohnen: { postalCode: PLZ[canton] || '', city: '' },
  versicherungen: { kkPremium: 450 },
  ...(ipv ? { anspruch: { ipv } } : {}),
});

const seite = (data) => {
  zustand.slots = [];
  const onUpdateData = vi.fn();
  const render = () => { zustand.i = 0; return knoten(PremiumSubsidy({ palette, t, data, onNavigate: () => {}, onUpdateData })); };
  const alle = render();
  const texte = () => render().map(textVon).join('\n');
  return { alle, render, texte, onUpdateData };
};
const knopf = (alle, anfang) => alle.find((e) => e.type === 'button' && textVon(e).startsWith(anfang));

const am = (datum) => { vi.useFakeTimers(); vi.setSystemTime(new Date(datum)); };
const SEPT_2026 = '2026-09-24T12:00:00';

beforeAll(async () => {
  preloadPLZ();
  await import('../data/plzGemeinde.js');
  await import('../config/ipvLuzern.js');
  await import('../config/ipvZuerich.js');
  await new Promise((r) => setTimeout(r, 0));
});
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

describe('Altbestand ohne Kanton/Jahr: Frage und Knopf, nichts automatisch', () => {
  const alt = { status: 'bestaetigt', betrag: 100, datum: '2026-01-15' };
  it('ruhiger Satz statt «Betrag aus Ihrer Verfügung», dazu die Frage für den Wohnkanton', () => {
    am(SEPT_2026);
    const s = seite(person('ZH', alt));
    const txt = s.texte();
    expect(txt).toContain('ipvStatus.ohneJahrLead');
    expect(txt).toContain('ipvStatus.zuordnenFrage(cantons.ZH|2026)');
    expect(txt).not.toContain('ipvStatus.confirmedLead');
  });
  it('Rendern schreibt nichts; erst der Klick auf «Ja» ergänzt Kanton und Jahr', () => {
    am(SEPT_2026);
    const s = seite(person('ZH', alt));
    expect(s.onUpdateData).not.toHaveBeenCalled();
    knopf(s.alle, 'ipvStatus.zuordnenJa(cantons.ZH|2026)').props.onClick();
    expect(s.onUpdateData).toHaveBeenCalledTimes(1);
    expect(s.onUpdateData).toHaveBeenCalledWith('anspruch', 'ipv',
      { status: 'bestaetigt', betrag: 100, datum: '2026-01-15', kanton: 'ZH', jahr: 2026 });
  });
  it('Betrag ändern lässt die Zuordnung offen (kein kanton, kein jahr)', () => {
    am(SEPT_2026);
    const s = seite(person('ZH', alt));
    const feld = s.alle.find((e) => e.type === 'input' && e.props.type === 'number');
    feld.props.onChange({ target: { value: '120' } });
    const neu = s.render().find((e) => e.type === 'input' && e.props.type === 'number');
    neu.props.onBlur();
    expect(s.onUpdateData).toHaveBeenCalledWith('anspruch', 'ipv', { status: 'bestaetigt', betrag: 120, datum: '2026-01-15' });
  });
});

describe('Verfügung, die nicht gilt: die Seite sagt es wie Budget, Beleg und Kachel', () => {
  it('Vorjahr: «Verfügung für ZH 2025 — gilt nicht für ZH 2026»', () => {
    am(SEPT_2026);
    const txt = seite(person('ZH', { status: 'bestaetigt', betrag: 200, datum: '2025-01-15', kanton: 'ZH', jahr: 2025 })).texte();
    expect(txt).toContain('ipvStatus.giltNicht(cantons.ZH|2025|cantons.ZH|2026)');
    expect(txt).not.toContain('ipvStatus.confirmedLead');
    expect(txt).not.toContain('ipvStatus.zuordnenFrage');
  });
  it('anderer Kanton: «Verfügung für LU 2026 — gilt nicht für ZH 2026»', () => {
    am(SEPT_2026);
    const txt = seite(person('ZH', { status: 'bestaetigt', betrag: 200, datum: '2026-01-15', kanton: 'LU', jahr: 2026 })).texte();
    expect(txt).toContain('ipvStatus.giltNicht(cantons.LU|2026|cantons.ZH|2026)');
    expect(txt).not.toContain('ipvStatus.confirmedLead');
  });
  it('Gegenprobe: gültige Verfügung ZH 2026 → «Betrag aus Ihrer Verfügung», kein «gilt nicht»', () => {
    am(SEPT_2026);
    const txt = seite(person('ZH', { status: 'bestaetigt', betrag: 200, datum: '2026-01-15', kanton: 'ZH', jahr: 2026 })).texte();
    expect(txt).toContain('ipvStatus.confirmedLead');
    expect(txt).not.toContain('ipvStatus.giltNicht');
    expect(txt).not.toContain('ipvStatus.ohneJahrLead');
  });
});

describe('Jahr wählbar beim Eintragen', () => {
  const auswahl = (alle) => alle.find((e) => e.type === 'select');
  it('Auswahl laufendes und folgendes Jahr, Standard laufendes', () => {
    am(SEPT_2026);
    const s = seite(person('ZH'));
    const sel = auswahl(s.alle);
    expect(sel.props.value).toBe('2026');
    expect(knoten(sel.props.children).map((o) => o.props.value)).toEqual(['2026', '2027']);
    knopf(s.alle, 'ipvStatus.markConfirmed').props.onClick();
    expect(s.onUpdateData.mock.calls[0][2]).toMatchObject({ status: 'bestaetigt', kanton: 'ZH', jahr: 2026 });
  });
  it('gewähltes Jahr 2027 wird gespeichert', () => {
    am(SEPT_2026);
    const s = seite(person('ZH'));
    auswahl(s.alle).props.onChange({ target: { value: '2027' } });
    const neu = s.render();
    expect(auswahl(neu).props.value).toBe('2027');
    knopf(neu, 'ipvStatus.markConfirmed').props.onClick();
    expect(s.onUpdateData.mock.calls[0][2]).toMatchObject({ status: 'bestaetigt', kanton: 'ZH', jahr: 2027 });
  });
  it('auch im Zustand «beantragt»', () => {
    am(SEPT_2026);
    const s = seite(person('ZH', { status: 'beantragt' }));
    auswahl(s.alle).props.onChange({ target: { value: '2027' } });
    knopf(s.render(), 'ipvStatus.markConfirmed').props.onClick();
    expect(s.onUpdateData.mock.calls[0][2]).toMatchObject({ jahr: 2027, kanton: 'ZH' });
  });
});
