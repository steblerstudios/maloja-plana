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

const { TaxCalculator } = await import('../TaxCalculator.jsx');
const { LabeledField } = await import('../components/LabeledField.jsx');

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' ? k + '(' + Object.values(p).join('|') + ')' : k);

// Flacht den Element-Baum ab. Render-Props von LabeledField werden aufgelöst;
// andere Komponenten bleiben Blätter (ihr Inneres braucht dieser Test nicht).
const knoten = (el, out = []) => {
  if (Array.isArray(el)) { el.forEach((c) => knoten(c, out)); return out; }
  if (!el || typeof el !== 'object' || !el.props) return out;
  out.push(el);
  let kinder = el.props.children;
  if (el.type === LabeledField && typeof kinder === 'function') kinder = kinder('id');
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
