// Fassung 5 · Rechner IPV (Entscheide Stebler Studios 23.10.2026, VERGLEICH.md «Rechner IPV · entschieden»).
// Geprüft: «Jährlich erinnern» in jedem Schritt als jährliche Merkliste-Aufgabe (ohne Duplikat),
// der Regler mit «Ins Profil übernehmen», die Überschriften wie die App, «Ihre Lage», Glossar im
// Titel, «Möglicher Betrag — nur auf Antrag» unter «Berechtigt», wenn kein Betrag gerechnet ist.
//
// Ohne DOM: React.useState über einen Slot-Speicher (Muster aus ipvAltVerfuegungSeite.test.js),
// Klicks über die onClick-/onChange-Props der gerenderten Knoten.
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';

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

// Ein Schalter, damit ein Test einen Kanton «berechtigt, aber ohne Betrag» vorgeben kann.
const ersatz = { ergebnis: null };
vi.mock('../config/cantonalData.js', async (importOriginal) => {
  const echt = await importOriginal();
  return { ...echt, calculateIPV: (d) => ersatz.ergebnis || echt.calculateIPV(d) };
});

const { preloadPLZ } = await import('../config/cantonalData.js');
const { PremiumSubsidy } = await import('../PremiumSubsidy.jsx');
const { tagInEinemJahr, ipvErinnerung, erinnerungLiegtSchon, IPV_ERINNERUNG_LINK } = await import('../data/ipvErinnerung.js');

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
// erledigtZeichen liefert ein Fragment; der Knopf-Text steckt eine Ebene tiefer.
const tiefText = (el) => knoten(el).map(textVon).join('');

const person = (ipv, income = 20000 / 12) => ({
  basis: { canton: 'ZH', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: income },
  wohnen: { postalCode: '8004', city: '' },
  versicherungen: { kkPremium: 450 },
  ...(ipv ? { anspruch: { ipv } } : {}),
});

const seite = (data, extra = {}) => {
  zustand.slots = [];
  const onUpdateData = vi.fn();
  const render = () => { zustand.i = 0; return knoten(PremiumSubsidy({ palette, t, data, onNavigate: () => {}, onUpdateData, ...extra })); };
  const texte = () => render().map(textVon).join('\n');
  return { render, texte, onUpdateData };
};
const knopfMit = (alle, teil) => alle.find((e) => e.type === 'button' && tiefText(e).includes(teil));

let store;
beforeEach(() => {
  store = {};
  globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
});
afterEach(() => { ersatz.ergebnis = null; vi.useRealTimers(); });

beforeAll(async () => {
  preloadPLZ();
  await import('../data/plzGemeinde.js');
  await import('../config/ipvZuerich.js');
  await new Promise((r) => setTimeout(r, 0));
});

describe('tagInEinemJahr — dieselbe Rechnung wie vorher fürs Kalender-Angebot', () => {
  it('Verfügungs-Datum + 1 Jahr', () => expect(tagInEinemJahr('2026-03-15')).toBe('2027-03-15'));
  it('ohne Datum: heute + 1 Jahr (lokaler Tag, kein UTC-Sprung)', () => {
    expect(tagInEinemJahr(null, new Date(2026, 9, 23, 23, 30))).toBe('2027-10-23');
  });
  it('29. Februar → 1. März im Folgejahr (wie setFullYear)', () => expect(tagInEinemJahr('2028-02-29')).toBe('2029-03-01'));
});

describe('ipvErinnerung — der Merkpunkt', () => {
  it('Titel, Link, Tag und Wiederholung', () => {
    expect(ipvErinnerung(t, '2026-03-15')).toEqual({
      text: 'ipvStatus.reminderTitle', link: 'premium', tag: '2027-03-15', wiederholung: 'jaehrlich',
    });
  });
  it('liegt schon offen auf der Merkliste → erkannt; erledigt oder im Beispiel → nicht', () => {
    store.or5_merkliste = JSON.stringify([{ id: 'a', text: 'X', link: IPV_ERINNERUNG_LINK, done: false }]);
    expect(erinnerungLiegtSchon('X', false)).toBe(true);
    expect(erinnerungLiegtSchon('X', true)).toBe(false);
    store.or5_merkliste = JSON.stringify([{ id: 'a', text: 'X', link: IPV_ERINNERUNG_LINK, done: true }]);
    expect(erinnerungLiegtSchon('X', false)).toBe(false);
  });
});

describe('«Jährlich erinnern» in jedem Schritt des IPV-Wegs', () => {
  const schritte = {
    geschaetzt: undefined,
    beantragt: { status: 'beantragt' },
    bestaetigt: { status: 'bestaetigt', betrag: 80, datum: '2026-03-15', kanton: 'ZH', jahr: 2026 },
  };
  for (const [name, ipv] of Object.entries(schritte)) {
    it(`${name}: Knopf da, legt eine jährliche Aufgabe auf die Merkliste`, () => {
      const s = seite(person(ipv));
      const k = knopfMit(s.render(), 'ipvStatus.renewAdd');
      expect(k, 'Knopf «Jährlich erinnern» fehlt').toBeTruthy();
      k.props.onClick();
      const liste = JSON.parse(store.or5_merkliste);
      expect(liste).toHaveLength(1);
      expect(liste[0]).toMatchObject({ text: 'ipvStatus.reminderTitle', link: 'premium', done: false });
      // Danach «Erinnerung gesetzt», gedrückt.
      const danach = knopfMit(s.render(), 'ipvStatus.renewAdded');
      expect(danach.props['aria-pressed']).toBe(true);
    });
  }

  it('kein Duplikat: zweiter Klick und neue Seite legen nichts dazu, Knopf zeigt «gesetzt»', () => {
    const s = seite(person());
    knopfMit(s.render(), 'ipvStatus.renewAdd').props.onClick();
    knopfMit(s.render(), 'ipvStatus.renewAdded').props.onClick();
    expect(JSON.parse(store.or5_merkliste)).toHaveLength(1);
    // Neue Seite (frischer Zustand): erkennt den offenen Punkt.
    const neu = seite(person());
    expect(knopfMit(neu.render(), 'ipvStatus.renewAdded')).toBeTruthy();
  });

  it('bestätigt: der Tag hängt am Verfügungs-Datum (gleiche Rechnung wie vorher)', () => {
    // Die heutige addTodo-Funktion speichert nur {text, link}; geprüft wird das übergebene Objekt.
    const datum = schritte.bestaetigt.datum;
    expect(ipvErinnerung(t, datum).tag).toBe('2027-03-15');
  });

  it('die Seite schreibt keine Kalender-Erinnerung mehr (or5_reminders bleibt leer)', () => {
    const s = seite(person(schritte.bestaetigt));
    knopfMit(s.render(), 'ipvStatus.renewAdd').props.onClick();
    expect(store.or5_reminders).toBeUndefined();
  });
});

describe('Regler mit «Ins Profil übernehmen»', () => {
  it('rechnet mit dem Reglerwert, Profil bleibt bis zum Klick', () => {
    const s = seite(person(undefined, 3000));
    const regler = s.render().find((e) => e.type === 'input' && e.props.id === 'ipv-regler');
    expect(regler, 'Regler fehlt').toBeTruthy();
    expect(regler.props.value).toBe(3000);
    expect(s.texte()).not.toContain('premium.schnellcheckUebernehmen');
    regler.props.onChange({ target: { value: '4500' } });
    const alle = s.render();
    expect(alle.find((e) => e.props.id === 'ipv-regler').props.value).toBe(4500);
    expect(s.texte()).toContain('premium.schnellcheckProfilBleibt');
    // Kein Schnellcheck: die Liste «Gerechnet mit den Zahlen aus dem Schnellcheck» bleibt weg.
    expect(s.texte()).not.toContain('premium.schnellcheckGerechnet');
    expect(s.onUpdateData).not.toHaveBeenCalled();
    knopfMit(alle, 'premium.schnellcheckUebernehmen').props.onClick();
    expect(s.onUpdateData).toHaveBeenCalledWith('finanzen', 'monthlyIncome', 4500);
  });

  it('Regler zurück auf den Profilwert: nichts offen', () => {
    const s = seite(person(undefined, 3000));
    const r = () => s.render().find((e) => e.props.id === 'ipv-regler');
    r().props.onChange({ target: { value: '4500' } });
    r().props.onChange({ target: { value: '3000' } });
    expect(s.texte()).not.toContain('premium.schnellcheckUebernehmen');
  });

  it('Regler bewegt + Schnellcheck: Einkommen aus dem Regler, Miete/Prämie weiter aus dem Schnellcheck', () => {
    const s = seite(person(undefined, 3000), { schnellcheckZahlen: { monthlyIncome: 2500, kkPremium: 380 } });
    s.render().find((e) => e.props.id === 'ipv-regler').props.onChange({ target: { value: '4000' } });
    knopfMit(s.render(), 'premium.schnellcheckUebernehmen').props.onClick();
    expect(s.onUpdateData.mock.calls).toEqual([
      ['versicherungen', 'kkPremium', 380],
      ['finanzen', 'monthlyIncome', 4000],
    ]);
  });

  it('ohne Einkommen kein Regler, sondern das Eingabefeld wie bisher', () => {
    const s = seite(person(undefined, ''));
    const txt = s.texte();
    expect(txt).toContain('premium.enterIncome');
    expect(s.render().some((e) => e.props.id === 'ipv-regler')).toBe(false);
  });
});

describe('Aufbau wie die App-Überschriften', () => {
  it('«Ihre Lage» als Überschrift, Aufklapp-Zeilen Anspruch (offen), Dokumente, Offizielle Stelle', () => {
    const alle = seite(person()).render();
    const h3 = alle.find((e) => e.type === 'h3' && e.props.id === 'ipv-lage-titel');
    expect(textVon(h3)).toBe('premium.lageTitle');
    const zeilen = alle.filter((e) => e.type === 'details').map((d) => ({ titel: textVon(knoten(d).find((e) => e.type === 'summary')), offen: !!d.props.open }));
    expect(zeilen.slice(0, 3)).toEqual([
      { titel: 'premium.permitTitle', offen: true },
      { titel: 'premium.requiredDocs', offen: false },
      { titel: 'dl.mirrorTitle', offen: false },
    ]);
    // Die Offizielle-Stelle-Box darin ohne eigenen Kasten/Titel.
    const box = alle.find((e) => e.props && e.props.ohneRahmen === true);
    expect(box && box.props.ids).toBe('praemienverbilligung');
  });

  it('Titel mit Glossar (IPV ⓘ)', () => {
    const alle = seite(person()).render();
    const glossar = alle.find((e) => e.type && e.type.name === 'GlossarText' && textVon(e) === 'premium.title');
    expect(glossar).toBeTruthy();
  });

  it('«Unterlagen für den Antrag merken» → Merkliste, danach «Auf der Merkliste»', () => {
    const s = seite(person());
    knopfMit(s.render(), 'premium.permitTodoAdd').props.onClick();
    expect(JSON.parse(store.or5_merkliste)[0]).toMatchObject({ text: 'premium.permitTodoText', link: 'tresor' });
    expect(knopfMit(s.render(), 'premium.permitTodoAdded')).toBeTruthy();
  });

  it('Kanton fehlt: Wahl unter «Ihre Lage», Anspruch-Zeile und Merken-Knopf bleiben', () => {
    const d = person();
    d.basis = { ...d.basis, canton: '' };
    d.wohnen = {};
    const alle = seite(d).render();
    expect(alle.some((e) => e.type === 'select' && e.props.id === 'ipv-kanton')).toBe(true);
    expect(alle.some((e) => e.type === 'h3' && textVon(e) === 'premium.lageTitle')).toBe(true);
    expect(knopfMit(alle, 'premium.permitTodoAdd')).toBeTruthy();
  });
});

describe('Berechtigt ohne gerechneten Betrag', () => {
  const basis = { eligible: true, belegt: true, anspruchMoeglich: true, noteKey: 'ipv.note', noteParams: {}, canton: 'ZH', cantonData: { modelKey: 'm', noteKey: 'n', maxIncome: 61090 } };
  it('«Berechtigt» und darunter «Möglicher Betrag — nur auf Antrag», keine Beträge', () => {
    ersatz.ergebnis = { ...basis, amount: null };
    const zeilen = seite(person()).texte().split('\n');
    expect(zeilen).toContain('premium.eligible');
    expect(zeilen).toContain('premium.eligibleAntrag');
    const txt = zeilen.join('\n');
    expect(txt).not.toContain('premium.monthlySubsidy');
  });
  it('mit gerechnetem Betrag: wie bisher die Beträge, kein Antrags-Satz', () => {
    ersatz.ergebnis = { ...basis, amount: 120, annual: 1440 };
    const txt = seite(person()).texte();
    expect(txt).toContain('premium.monthlySubsidy');
    expect(txt).not.toContain('premium.eligibleAntrag');
  });
});
