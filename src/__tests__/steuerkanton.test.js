import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─────────────────────────────────────────────────────────────
// B-2 / E23 · Woher nimmt der Steuerrechner den Kanton?
//
// Das Repo hat kein DOM (kein jsdom, keine Testing Library). Damit die Tests
// trotzdem wie eine Person klicken können, ersetzt dieser Harness die React-Hooks
// durch einen kleinen Speicher: die Komponente wird als Funktion aufgerufen, der
// Baum durchsucht, ein Handler ausgelöst und neu «gerendert».
// ─────────────────────────────────────────────────────────────

const zustand = { slots: [], i: 0 };
vi.mock('react', async (importOriginal) => {
  const R = await importOriginal();
  const useState = (init) => {
    const i = zustand.i++;
    if (!(i in zustand.slots)) zustand.slots[i] = typeof init === 'function' ? init() : init;
    return [zustand.slots[i], (v) => { zustand.slots[i] = typeof v === 'function' ? v(zustand.slots[i]) : v; }];
  };
  const gemockt = { ...R, useState, useEffect: () => {}, useId: () => 'id' };
  return { ...gemockt, default: gemockt };
});

const { TaxCalculator, WohnkantonFrage, steuerkantonVorbelegung, fragtNachWohnkanton, steuerkantonSpeichern } = await import('../TaxCalculator.jsx');
const { LabeledField } = await import('../components/LabeledField.jsx');

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' ? k + '(' + Object.values(p).join('|') + ')' : k);

// Flacht den Element-Baum ab. Render-Props von LabeledField werden aufgelöst,
// WohnkantonFrage (ohne Hooks) wird aufgeklappt; andere Komponenten bleiben
// Blätter (ihr Inneres braucht dieser Test nicht).
const knoten = (el, out = []) => {
  if (Array.isArray(el)) { el.forEach((c) => knoten(c, out)); return out; }
  if (!el || typeof el !== 'object' || !el.props) return out;
  out.push(el);
  let kinder = el.props.children;
  if (el.type === LabeledField && typeof kinder === 'function') kinder = kinder('id');
  if (el.type === WohnkantonFrage) kinder = WohnkantonFrage(el.props);
  knoten(kinder, out);
  return out;
};
const textVon = (el) => knoten(el).map((k) => k.props.children).flat().filter((c) => typeof c === 'string').join('');

// Eine «Sitzung» mit dem Steuerrechner: hält den Datensatz so, wie main.jsx ihn
// nach onSave zusammenführt (writeData(prev => ({ ...prev, ...updatedData }))).
const oeffne = (daten) => {
  const s = { daten };
  zustand.slots = [];
  const render = () => {
    zustand.i = 0;
    s.baum = TaxCalculator({ palette, t, data: s.daten, onSave: (u) => { s.daten = { ...s.daten, ...u }; }, onNavigate: () => {} });
    s.alle = knoten(s.baum);
  };
  render();
  s.render = render;
  s.frage = () => s.alle.find((k) => k.type === WohnkantonFrage);
  s.kantonsfeld = () => s.alle.find((k) => k.type === 'select' && knoten(k.props.children).some((o) => o.props.value === 'GE'));
  s.waehle = (c) => { s.kantonsfeld().props.onChange({ target: { value: c } }); render(); };
  s.knopf = (key) => s.alle.find((k) => k.type === 'button' && textVon(k).includes(key));
  s.klicke = (key) => { s.knopf(key).props.onClick(); render(); };
  s.speichere = () => s.klicke('tax.saveData');
  return s;
};

// Profil wie nach dem Onboarding mit Kanton Zürich: Onboarding schreibt basis.canton,
// updateData füllt behoerden.cantoneOfTaxation, solange es leer ist (main.jsx).
const nachOnboarding = (canton = 'ZH') => ({
  basis: { canton, household: { adults: 1, children: [] } },
  behoerden: { cantoneOfTaxation: canton },
  finanzen: { monthlyIncome: 5000 },
});

beforeEach(() => { zustand.slots = []; zustand.i = 0; });

describe('B-2 · der gespeicherte Steuerkanton kommt beim Wiederöffnen zurück', () => {
  it('Zürich → Genf wählen → speichern → wieder öffnen: Genf ist gewählt', () => {
    const erste = oeffne(nachOnboarding('ZH'));
    expect(erste.kantonsfeld().props.value).toBe('ZH');
    erste.waehle('GE');
    erste.speichere();

    const zweite = oeffne(erste.daten);
    expect(zweite.kantonsfeld().props.value).toBe('GE');
  });
});

describe('E23 · Vorbelegung', () => {
  it('ohne Steuerkanton im Profil: vorbelegt mit dem Wohnkanton basis.canton', () => {
    const s = oeffne({ basis: { canton: 'BE' }, finanzen: {} });
    expect(s.kantonsfeld().props.value).toBe('BE');
  });

  it('ein abweichender Steuerkanton im Profil hat Vorrang vor dem Wohnkanton', () => {
    const s = oeffne({ basis: { canton: 'ZH' }, behoerden: { cantoneOfTaxation: 'SZ' }, finanzen: {} });
    expect(s.kantonsfeld().props.value).toBe('SZ');
  });

  it('alter Schlüssel canton (bis 0.1.28 geschrieben): nur gelesen, wenn cantoneOfTaxation leer ist', () => {
    expect(steuerkantonVorbelegung({ canton: 'GE', basis: { canton: 'ZH' } })).toBe('GE');
    expect(steuerkantonVorbelegung({ canton: 'GE', basis: { canton: 'ZH' }, behoerden: { cantoneOfTaxation: 'ZH' } })).toBe('ZH');
    expect(steuerkantonVorbelegung({ canton: { kein: 'Text' }, basis: { canton: 'ZH' } })).toBe('ZH');
    expect(steuerkantonVorbelegung({})).toBe('');
    expect(steuerkantonVorbelegung(undefined)).toBe('');
  });
});

describe('E23 · Speichern', () => {
  it('schreibt behoerden.cantoneOfTaxation, lässt basis.canton und die übrigen Behörden-Felder stehen', () => {
    const start = { ...nachOnboarding('ZH'), behoerden: { cantoneOfTaxation: 'ZH', taxId: '123' } };
    const s = oeffne(start);
    s.waehle('GE');
    s.klicke('tax.wohnkantonNein');
    s.speichere();
    expect(s.daten.behoerden).toEqual({ cantoneOfTaxation: 'GE', taxId: '123' });
    expect(s.daten.basis.canton).toBe('ZH');
  });

  it('schreibt keinen Kanton mehr auf die oberste Ebene; ein alter Wert bleibt unberührt', () => {
    const neu = oeffne(nachOnboarding('ZH'));
    neu.waehle('GE');
    neu.speichere();
    expect(neu.daten).not.toHaveProperty('canton');

    const alt = oeffne({ ...nachOnboarding('ZH'), canton: 'VD' });
    alt.speichere();
    expect(alt.daten.canton).toBe('VD');
  });

  it('steuerkantonSpeichern: basis nur mit alsWohnkanton', () => {
    const d = { basis: { canton: 'ZH', firstName: 'A' }, behoerden: { taxId: '1' } };
    expect(steuerkantonSpeichern(d, 'GE')).toEqual({ behoerden: { taxId: '1', cantoneOfTaxation: 'GE' } });
    expect(steuerkantonSpeichern(d, 'GE', true)).toEqual({
      behoerden: { taxId: '1', cantoneOfTaxation: 'GE' },
      basis: { canton: 'GE', firstName: 'A' },
    });
  });
});

describe('E23 · Frage «auch Wohnkanton?»', () => {
  it('erscheint nicht beim Öffnen, auch wenn Steuer- und Wohnkanton schon verschieden sind', () => {
    const s = oeffne({ basis: { canton: 'ZH' }, behoerden: { cantoneOfTaxation: 'SZ' }, finanzen: {} });
    expect(s.frage()).toBeUndefined();
  });

  it('erscheint nicht, wenn der gewählte Kanton der Wohnkanton ist', () => {
    const s = oeffne(nachOnboarding('ZH'));
    s.waehle('GE');
    s.waehle('ZH');
    expect(s.frage()).toBeUndefined();
    s.waehle('');
    expect(s.frage()).toBeUndefined();
  });

  it('erscheint bei Abweichung und nennt den gewählten Kanton', () => {
    const s = oeffne(nachOnboarding('ZH'));
    s.waehle('GE');
    expect(s.frage()).toBeTruthy();
    expect(textVon(s.frage())).toContain('tax.wohnkantonFrage(cantons.GE)');
    expect(s.knopf('tax.wohnkantonJa')).toBeTruthy();
    expect(s.knopf('tax.wohnkantonNein')).toBeTruthy();
  });

  it('fragtNachWohnkanton: nur bei gewähltem, abweichendem Kanton', () => {
    expect(fragtNachWohnkanton({ basis: { canton: 'ZH' } }, 'ZH')).toBe(false);
    expect(fragtNachWohnkanton({ basis: { canton: 'ZH' } }, '')).toBe(false);
    expect(fragtNachWohnkanton({ basis: { canton: 'ZH' } }, 'GE')).toBe(true);
    expect(fragtNachWohnkanton({}, 'GE')).toBe(true);
  });

  it('«Nein» lässt basis.canton unverändert und schliesst die Frage', () => {
    const s = oeffne(nachOnboarding('ZH'));
    s.waehle('GE');
    const vorher = s.daten;
    s.klicke('tax.wohnkantonNein');
    expect(s.frage()).toBeUndefined();
    expect(s.daten).toBe(vorher); // nichts geschrieben
    expect(s.daten.basis.canton).toBe('ZH');
    s.speichere();
    expect(s.daten.basis.canton).toBe('ZH');
    expect(s.daten.behoerden.cantoneOfTaxation).toBe('GE');
  });

  it('«Ja» setzt Steuer- und Wohnkanton, sofort und nur auf diesen Klick', () => {
    const s = oeffne(nachOnboarding('ZH'));
    s.waehle('GE');
    expect(s.daten.basis.canton).toBe('ZH'); // Wahl allein ändert nichts
    s.klicke('tax.wohnkantonJa');
    expect(s.daten.basis.canton).toBe('GE');
    expect(s.daten.behoerden.cantoneOfTaxation).toBe('GE');
    expect(s.daten.basis.household).toEqual({ adults: 1, children: [] });
  });

  it('nach «Ja»: Frage weg, ruhige Bestätigung, beim Wiederöffnen beide Kantone Genf', () => {
    const s = oeffne(nachOnboarding('ZH'));
    s.waehle('GE');
    s.klicke('tax.wohnkantonJa'); // rendert neu mit den neuen Daten, wie main.jsx
    expect(s.frage()).toBeUndefined();
    expect(textVon(s.baum)).toContain('tax.wohnkantonUebernommen(cantons.GE)');

    const wieder = oeffne(s.daten);
    expect(wieder.kantonsfeld().props.value).toBe('GE');
    expect(wieder.daten.basis.canton).toBe('GE');
  });
});
