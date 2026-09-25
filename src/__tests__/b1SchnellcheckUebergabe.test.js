import { describe, it, expect, vi, afterEach, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateIPV } from '../config/cantonalData.js';
import { kantoneBelegtSimulieren } from '../config/__tests__/ipvBelegtSimulieren.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';
import { Schnellcheck } from '../Schnellcheck.jsx';
import { QuickCheck } from '../components/Leistungsliste.jsx';

// ─────────────────────────────────────────────────────────────
// B-1 (BUGS.md) · Entscheid E22 vom 16.09.2026
//
// Die Zahlen aus dem Schnellcheck (auch Schritt 1 des Anspruch-Checks) gehen beim
// Klick auf «Prämienverbilligung» an den IPV-Rechner mit. Der Rechner sagt sichtbar
// «Gerechnet mit den Zahlen aus dem Schnellcheck» und bietet «Ins Profil übernehmen».
// Ins Profil geschrieben wird NUR auf diesen Klick.
//
// Ohne DOM: Klicks werden über die onClick-Props ausgelöst, die React.createElement
// beim Rendern bekommt (Spion auf createElement).
// ─────────────────────────────────────────────────────────────

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);

// Rendert und sammelt alle Props, die React.createElement gesehen hat.
const renderMitProps = (C, props) => {
  const gesehen = [];
  const echt = React.createElement;
  const spion = vi.spyOn(React, 'createElement').mockImplementation((typ, p, ...kinder) => {
    if (p) gesehen.push({ typ, p, kinder });
    return echt(typ, p, ...kinder);
  });
  try {
    const html = renderToStaticMarkup(echt(C, { palette, t, ...props }));
    return { html, gesehen };
  } finally {
    spion.mockRestore();
  }
};
const textVon = (e) => e.kinder.flat().filter((k) => typeof k === 'string').join('');

// Das Profil: Kanton Bern, 5000/Monat (BUGS.md B-1, Nachstell-Variante 4).
const profil = (finanzen = { monthlyIncome: 5000 }) => ({
  basis: { canton: 'BS', household: { adults: 1, children: [] } },
  finanzen,
  wohnen: { rentAmount: 1400 },
  versicherungen: { kkPremium: 420 },
});

afterEach(() => vi.restoreAllMocks());

describe('B-1 · der Klick im Schnellcheck nimmt die eingetippten Zahlen mit', () => {
  it('die Zeile «Prämienverbilligung» übergibt Einkommen, Miete und Prämie an den IPV-Rechner', () => {
    // Im Schnellcheck steht, was die Person eingetippt hat: 3000 / 1100 / 380.
    const schnellcheckStand = profil({ monthlyIncome: 3000 });
    schnellcheckStand.wohnen = { rentAmount: 1100 };
    schnellcheckStand.versicherungen = { kkPremium: 380 };
    const onNavigate = vi.fn();
    const { gesehen } = renderMitProps(Schnellcheck, { data: schnellcheckStand, onNavigate });
    const zeile = gesehen.find((e) => e.typ === 'button' && e.p.key === 'ipv');
    expect(zeile).toBeTruthy();
    zeile.p.onClick();
    expect(onNavigate).toHaveBeenCalledWith('premium', undefined, {
      schnellcheck: { monthlyIncome: 3000, rentAmount: 1100, kkPremium: 380 },
    });
  });

  it('auch der Schnell-Check auf dem Dashboard übergibt sein Einkommen', () => {
    const onNavigate = vi.fn();
    const { gesehen } = renderMitProps(QuickCheck, { data: profil({ monthlyIncome: 3000 }), onNavigate });
    const zeile = gesehen.find((e) => e.typ === 'button' && e.p.key === 'ipv');
    expect(zeile).toBeTruthy();
    zeile.p.onClick();
    expect(onNavigate).toHaveBeenCalledWith('premium', undefined, { schnellcheck: { monthlyIncome: 3000 } });
  });

  it('andere Zeilen im Schnellcheck tragen keine Übergabe', () => {
    const onNavigate = vi.fn();
    const stand = profil({ monthlyIncome: 800 });
    const { gesehen } = renderMitProps(Schnellcheck, { data: stand, onNavigate });
    const soz = gesehen.find((e) => e.typ === 'button' && e.p.key === 'soz');
    expect(soz).toBeTruthy();
    soz.p.onClick();
    expect(onNavigate).toHaveBeenCalledWith('sozialhilfe');
    expect(onNavigate.mock.calls[0]).toHaveLength(1);
  });

  it('main.jsx reicht die Übergabe an den IPV-Rechner weiter und trägt sie nur beim Weg dorthin', () => {
    const main = fs.readFileSync(path.resolve(__dirname, '../main.jsx'), 'utf8');
    const nav = main.slice(main.indexOf('const handleNavigate'), main.indexOf('startTransition(() => setView(viewName))'));
    expect(nav).toMatch(/setIpvUebergabe\(viewName === 'premium'/);
    expect(main).toMatch(/view === 'premium' && React\.createElement\(PremiumSubsidy, \{[^}]*schnellcheckZahlen: ipvUebergabe/);
  });
});

describe('B-1 · der IPV-Rechner rechnet mit den Schnellcheck-Zahlen, das Profil bleibt unverändert', () => {
  const zahlen = { monthlyIncome: 3000, rentAmount: 1100, kkPremium: 380 };

  it('rechnet mit 3000 statt 5000 und sagt es sichtbar', () => {
    const writes = [];
    const { html } = renderMitProps(PremiumSubsidy, { data: profil(), schnellcheckZahlen: zahlen, onUpdateData: (...a) => writes.push(a) });
    expect(html).toContain('premium.schnellcheckGerechnet');
    expect(html).toContain('premium.schnellcheckProfilBleibt');
    expect(html).toContain('premium.schnellcheckUebernehmen');
    // BS ist nicht amtlich belegt (E9): neutrale Orientierung, kein Betrag. (Bis 23.09.2026 LU.)
    // Dass mit 3000 statt 5000 gerechnet wird, zeigt der Test mit belegtem Kanton unten.
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain('CHF 3');
    expect(writes).toEqual([]);
  });

  it('Nachstellen Schritt 1–3: Profil ohne Einkommen → kein «Einkommen eingeben», sondern die Schnellcheck-Zahl', () => {
    const writes = [];
    const { html } = renderMitProps(PremiumSubsidy, { data: profil({}), schnellcheckZahlen: { monthlyIncome: 3000 }, onUpdateData: (...a) => writes.push(a) });
    expect(html).not.toContain('premium.enterIncome');
    expect(html).toContain('premium.schnellcheckGerechnet');
    expect(writes).toEqual([]);
  });

  it('erst der Klick auf «Ins Profil übernehmen» schreibt — genau die abweichenden Felder', () => {
    const writes = [];
    const { gesehen } = renderMitProps(PremiumSubsidy, { data: profil(), schnellcheckZahlen: zahlen, onUpdateData: (...a) => writes.push(a) });
    expect(writes).toEqual([]);
    const knopf = gesehen.find((e) => e.typ === 'button' && textVon(e).includes('premium.schnellcheckUebernehmen'));
    expect(knopf).toBeTruthy();
    knopf.p.onClick();
    expect(writes).toEqual([
      ['finanzen', 'monthlyIncome', 3000],
      ['wohnen', 'rentAmount', 1100],
      ['versicherungen', 'kkPremium', 380],
    ]);
  });

  it('gleiche Zahlen wie im Profil → kein Hinweis, kein Knopf', () => {
    const { html } = renderMitProps(PremiumSubsidy, { data: profil(), schnellcheckZahlen: { monthlyIncome: 5000, rentAmount: 1400, kkPremium: 420 }, onUpdateData: () => {} });
    expect(html).not.toContain('premium.schnellcheckGerechnet');
    expect(html).not.toContain('premium.schnellcheckUebernehmen');
  });

  it('ohne Übergabe (Weg über das Menü) rechnet der Rechner mit dem Profil', () => {
    const { html } = renderMitProps(PremiumSubsidy, { data: profil(), onUpdateData: () => {} });
    expect(html).not.toContain('premium.schnellcheckGerechnet');
    expect(html).toContain('ipv.orientierungOffen');
  });

  describe('mit belegtem Kanton (simuliert): der Betrag ist der für die Schnellcheck-Zahl', () => {
    let zuruecksetzen;
    beforeAll(() => { zuruecksetzen = kantoneBelegtSimulieren(['BS']); });
    afterAll(() => zuruecksetzen());

    it('zeigt den Betrag für 3000, nicht «nicht berechtigt» für 5000', () => {
      const mit3000 = calculateIPV({ ...profil(), finanzen: { monthlyIncome: 3000 } });
      expect(mit3000.eligible).toBe(true);
      expect(calculateIPV(profil()).eligible).toBe(false);
      const { html } = renderMitProps(PremiumSubsidy, { data: profil(), schnellcheckZahlen: zahlen, onUpdateData: () => {} });
      expect(html).toContain('premium.eligible');
      expect(html).toContain('CHF ' + mit3000.amount);
      expect(html).not.toContain('premium.notEligible');
    });
  });
});
