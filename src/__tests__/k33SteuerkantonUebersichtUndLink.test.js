import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─────────────────────────────────────────────────────────────
// K33 (Bau-Liste §11) — Entscheid E23 (PR #165) legte fest: Steuer-relevante
// Stellen nutzen den Steuerkanton (behoerden.cantoneOfTaxation, vorbelegt mit
// basis.canton), nicht mehr pauschal den Wohnkanton. Dieser Test deckt die
// zwei Stellen ab, die PR #165 bewusst offengelassen hat:
//   - FinanzUebersicht.jsx: die Steuer-Kachel
//   - OfficialLinkBox.jsx: der Steuererklärungs-Link (TaxCalculator.jsx)
// Überall sonst muss der Wohnkanton stehen bleiben — das wird mitgeprüft.
//
// Kein DOM im Repo: derselbe hakenlose Harness wie steuerkanton.test.js
// (React.useState über einen einfachen Slot-Speicher ersetzt).
// ─────────────────────────────────────────────────────────────

const zustand = { slots: [], i: 0 };
vi.mock('react', async (importOriginal) => {
  const R = await importOriginal();
  const useState = (init) => {
    const i = zustand.i++;
    if (!(i in zustand.slots)) zustand.slots[i] = typeof init === 'function' ? init() : init;
    return [zustand.slots[i], (v) => { zustand.slots[i] = typeof v === 'function' ? v(zustand.slots[i]) : v; }];
  };
  const gemockt = { ...R, useState, useEffect: () => {} };
  return { ...gemockt, default: gemockt };
});
// useVorlesenContext ruft useContext auf — ausserhalb eines echten Renders
// (kein ReactDOM hier) bricht das ohne Provider. Für diesen Test unnötig.
vi.mock('../hooks/vorlesenContext.js', () => ({ useVorlesenContext: () => null }));

const { FinanzUebersicht } = await import('../FinanzUebersicht.jsx');
const { OfficialLinkBox } = await import('../OfficialLinkBox.jsx');
const { CANTONAL_LINKS } = await import('../data/direktLinks.js');
// R4: externe Links rendern seit dem a11y-Hinweis (WCAG 3.2.5) über ExternerLink statt
// eines rohen <a> — knoten() muss es expandieren, damit das erzeugte <a href> gefunden wird.
const { ExternerLink } = await import('../components/ExternerLink.jsx');

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' ? k + '(' + Object.values(p).join('|') + ')' : k);

// Flacht den Element-Baum ab (wie steuerkanton.test.js) — Komponenten wie
// StatusCard bleiben Blätter; ihre Props (status/detail) reichen hier aus.
const knoten = (el, out = []) => {
  if (Array.isArray(el)) { el.forEach((c) => knoten(c, out)); return out; }
  if (!el || typeof el !== 'object' || !el.props) return out;
  out.push(el);
  if (el.type === ExternerLink) knoten(ExternerLink(el.props), out);
  knoten(el.props.children, out);
  return out;
};
const textVon = (el) => knoten(el).flatMap((k) => (Array.isArray(k.props.children) ? k.props.children : [k.props.children]))
  .flat(Infinity).filter((c) => typeof c === 'string').join(' ');

beforeEach(() => { zustand.slots = []; zustand.i = 0; });

const profil = (canton, cantoneOfTaxation) => ({
  basis: { canton, household: { adults: 1, children: [] } },
  behoerden: cantoneOfTaxation ? { cantoneOfTaxation } : {},
  finanzen: { monthlyIncome: 6000 },
});

describe('K33 · FinanzUebersicht: die Steuer-Kachel rechnet mit dem Steuerkanton', () => {
  const renderUebersicht = (data) => {
    zustand.i = 0;
    return knoten(FinanzUebersicht({ palette, t, data, onNavigate: () => {}, isDarkMode: false }));
  };
  const steuerKachel = (alle) => alle.find((k) => k.props && k.props.icon === 'money');

  it('Steuerkanton (GE) ≠ Wohnkanton (ZH): die Kachel weicht vom Wohnkanton-Ergebnis ab', () => {
    const mitAbweichendemSteuerkanton = steuerKachel(renderUebersicht(profil('ZH', 'GE')));
    const alsWaereWohnkantonMassgeblich = steuerKachel(renderUebersicht(profil('ZH', 'ZH')));
    expect(mitAbweichendemSteuerkanton.props.status).not.toBe(alsWaereWohnkantonMassgeblich.props.status);
  });

  it('ohne gespeicherten Steuerkanton: Rückfall auf den Wohnkanton, identisch zur expliziten Wahl', () => {
    const ohneSteuerkanton = steuerKachel(renderUebersicht(profil('ZH', undefined)));
    const expliziterWohnkanton = steuerKachel(renderUebersicht(profil('ZH', 'ZH')));
    expect(ohneSteuerkanton.props.status).toBe(expliziterWohnkanton.props.status);
  });

  it('die allgemeine „Kanton"-Zeile bleibt der Wohnkanton, auch wenn der Steuerkanton abweicht', () => {
    const alle = renderUebersicht(profil('ZH', 'GE'));
    const text = textVon({ props: { children: alle } });
    expect(text).toContain('cantons.ZH');
    expect(text).not.toContain('cantons.GE');
  });
});

describe('K33 · OfficialLinkBox: nur der Steuererklärungs-Link folgt dem Steuerkanton', () => {
  // ZH und GE tragen unterschiedliche echte Amts-URLs (data/direktLinks.js) —
  // die Gegenprobe nutzt diese realen Werte statt erfundener Platzhalter.
  const hatLinkZu = (alle, url) => alle.some((k) => k.type === 'a' && k.props.href === url);

  it('Steuererklärungs-Link (cantonalKey: steuererklaerung) zeigt auf den Steuerkanton, nicht den Wohnkanton', () => {
    const data = profil('ZH', 'GE');
    const alle = knoten(OfficialLinkBox({ palette, t, data, ids: 'steuern', cantonalKey: 'steuererklaerung' }));
    expect(hatLinkZu(alle, CANTONAL_LINKS.GE.steuererklaerung)).toBe(true);
    expect(hatLinkZu(alle, CANTONAL_LINKS.ZH.steuererklaerung)).toBe(false);
  });

  it('andere Links (z. B. Sozialhilfe) bleiben beim Wohnkanton, auch mit abweichendem Steuerkanton', () => {
    const data = profil('ZH', 'GE');
    const alle = knoten(OfficialLinkBox({ palette, t, data, ids: 'sozialhilfe', cantonalKey: 'sozialdienst' }));
    expect(hatLinkZu(alle, CANTONAL_LINKS.ZH.sozialdienst)).toBe(true);
    expect(hatLinkZu(alle, CANTONAL_LINKS.GE.sozialdienst)).toBe(false);
  });

  it('ohne gespeicherten Steuerkanton: der Steuererklärungs-Link fällt auf den Wohnkanton zurück', () => {
    const data = profil('ZH', undefined);
    const alle = knoten(OfficialLinkBox({ palette, t, data, ids: 'steuern', cantonalKey: 'steuererklaerung' }));
    expect(hatLinkZu(alle, CANTONAL_LINKS.ZH.steuererklaerung)).toBe(true);
  });
});
