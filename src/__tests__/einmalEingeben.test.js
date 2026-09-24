import { describe, it, expect, vi } from 'vitest';

// Nicht zweimal eingeben — geprüft am gezeichneten Rechner, nicht nur an der Hilfsfunktion:
// eine Vorbefüllung, die an der Aufrufstelle verloren geht (useState('')), fällt nur hier auf.
//
// Der Vorsorge-Rechner zeigt das BVG-Feld erst im Tab «BVG». Damit das statische Zeichnen ihn
// erreicht, startet useState hier mit 'bvg' statt 'ahv' — sonst bleibt alles echt. Ebenso der
// Schulden-Manager: 'debts' statt 'overview', damit das Erfassungsformular gezeichnet wird.
vi.mock('react', async (original) => {
  const R = await original();
  const useState = (init) => R.useState(init === 'ahv' ? 'bvg' : init === 'overview' ? 'debts' : init);
  return { ...R, useState, default: { ...R.default, useState } };
});

const React = (await import('react')).default;
const { renderToStaticMarkup } = await import('react-dom/server');
const de = (await import('../i18n/de.js')).default;
const { SozialhilfeRechner } = await import('../SozialhilfeRechner.jsx');
const { VorsorgeRechner } = await import('../VorsorgeRechner.jsx');
const { SchuldenManager } = await import('../SchuldenManager.jsx');
const { EOrechner } = await import('../EOrechner.jsx');

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (schluessel, p) => {
  const wert = String(schluessel).split('.').reduce((o, k) => (o == null ? undefined : o[k]), de);
  let text = wert && typeof wert === 'object' ? (wert.sie ?? Object.values(wert)[0]) : wert;
  if (typeof text !== 'string') return schluessel;
  if (p) for (const [k, v] of Object.entries(p)) text = text.split('{' + k + '}').join(String(v));
  return text;
};
const zeichne = (Komponente, data) => renderToStaticMarkup(React.createElement(Komponente, { palette, t, data, onNavigate: () => {}, onUpdateData: () => {} }));
const feldWert = (html, label) => {
  const m = html.match(new RegExp('<input[^>]*aria-label="' + label.replace(/[()]/g, '\\$&') + '"[^>]*>'));
  return m && (m[0].match(/value="([^"]*)"/) || [])[1];
};

const profil = {
  basis: { canton: 'BS', dateOfBirth: '1980-03-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: 5200, incomeType: 'netto', employmentType: 'employed', familienzulagen: 215, alimenteReceived: 600, savingsAccount: 4000, securitiesValue: 2500 },
  wohnen: { rentAmount: 1400 },
  versicherungen: { kkPremium: 420, bvgBalance: 85000 },
};

describe('Sozialhilfe-Rechner übernimmt, was im Profil steht', () => {
  const html = zeichne(SozialhilfeRechner, profil);
  it('andere Einkünfte und Vermögen sind vorbefüllt, mit Hinweis', () => {
    expect(feldWert(html, t('sh.einkommen'))).toBe('5200');
    expect(feldWert(html, t('sh.andereEinkuenfte'))).toBe('815');
    expect(feldWert(html, t('sh.vermoegen'))).toBe('6500');
    expect(html).toContain(t('sh.ausProfilHint'));
  });
  it('«erwerbstätig» ist angekreuzt', () => {
    expect(html).toMatch(/<input type="checkbox" checked=""[^>]*\/>\s*Erwerbstätig/);
  });
  it('Konkubinat: Partnerlohn nicht übernommen, Hinweis am Feld', () => {
    const konk = zeichne(SozialhilfeRechner, { ...profil, basis: { ...profil.basis, maritalStatus: 'cohabiting', household: { adultsList: [{}], partnerIncome: '3000' } } });
    expect(feldWert(konk, t('sh.andereEinkuenfte'))).toBe('815');
    expect(konk).toContain(t('sh.konkubinatHint'));
  });
  it('Konkubinat: 1 unterstützt + 1 weitere, Wohnform «gemeinsam», Grundbedarf 812 (GR-Merkblatt)', () => {
    const konk = zeichne(SozialhilfeRechner, { ...profil, basis: { ...profil.basis, maritalStatus: 'cohabiting', household: { adultsList: [{}] } } });
    expect(konk).toMatch(/aria-label="Weitere Personen im Haushalt"[^>]*>(?:(?!<\/select>).)*<option value="1" selected=""/s);
    expect(konk).toMatch(/<input type="radio" name="sh-wohnform"(?=[^>]*checked="")(?=[^>]*value="familienaehnlich")[^>]*>/);
    expect(konk).toContain(t('sh.mieteAnteilHint'));
    expect(konk).toMatch(/Anteil 1 von 2 Pers\.\)<\/td><td[^>]*>812</);
  });
  it('allein: kein Wohnform-Block, Grundbedarf 1061', () => {
    expect(html).not.toContain('name="sh-wohnform"');
    expect(html).toMatch(/\(1 Pers\.\)<\/td><td[^>]*>1(?:&#x27;|’|'|\.)061</);
  });
  it('leeres Profil: keine Vorbefüllung, kein Hinweis', () => {
    const leer = zeichne(SozialhilfeRechner, {});
    expect(feldWert(leer, t('sh.vermoegen'))).toBe('');
    expect(leer).not.toContain(t('sh.ausProfilHint'));
  });
});

describe('Vorsorge-Rechner übernimmt das BVG-Guthaben', () => {
  it('Feld «BVG-Guthaben» trägt den Wert aus dem Kapitel Versicherungen', () => {
    const html = zeichne(VorsorgeRechner, profil);
    expect(html).toContain('value="85000"');
  });
  it('ohne erfasstes Guthaben bleibt das Feld leer', () => {
    const html = zeichne(VorsorgeRechner, { ...profil, versicherungen: {} });
    expect(html).not.toContain('value="85000"');
  });
});

describe('Schulden-Manager schlägt die Darlehen aus dem Kapitel Finanzen vor', () => {
  const betrag = (html) => feldWert(html, t('schulden.amount'));
  it('leere Liste: Betrag vorbefüllt, Kategorie Kredit, Hinweis sichtbar', () => {
    const html = zeichne(SchuldenManager, { finanzen: { loans: 12000 } });
    expect(betrag(html)).toBe('12000');
    expect(html).toMatch(/<option value="kredit" selected="">/);
    expect(html).toContain(t('schulden.ausProfilHint'));
  });
  it('schon Schulden erfasst: kein Vorschlag', () => {
    const html = zeichne(SchuldenManager, { finanzen: { loans: 12000 }, schulden: [{ id: 1, creditor: 'Bank', amount: 12000, status: 'open', category: 'kredit' }] });
    expect(betrag(html)).toBe('');
    expect(html).not.toContain(t('schulden.ausProfilHint'));
  });
});

describe('EO- und Vorsorge-Rechner: Bruttojahreslohn, nie ein Nettolohn', () => {
  const brutto13 = { ...profil, finanzen: { monthlyIncome: 5000, incomeType: 'brutto', dreizehnter: 'yes' } };
  const netto = { ...profil, finanzen: { monthlyIncome: 5000, incomeType: 'netto' } };
  it('EO: brutto mit 13. → 65000', () => {
    expect(feldWert(zeichne(EOrechner, brutto13), t('eo.einkommen'))).toBe('65000');
  });
  it('EO: netto → leer, mit Hinweis', () => {
    const html = zeichne(EOrechner, netto);
    expect(feldWert(html, t('eo.einkommen'))).toBe('');
    expect(html).toContain(t('eo.nettoHint'));
  });
  it('Vorsorge: brutto mit 13. → 65000; netto → Hinweis statt Wert', () => {
    expect(zeichne(VorsorgeRechner, brutto13)).toContain('value="65000"');
    const html = zeichne(VorsorgeRechner, netto);
    expect(html).not.toContain('value="60000"');
    expect(html).toContain(t('vr.nettoHint'));
  });
});

describe('Vorsorge-Rechner: Nettolohn Partner/in ist nicht der AHV-Lohn', () => {
  it('verheiratet mit Partnerlohn im Profil: Feld leer, Hinweis statt Wert', () => {
    const html = zeichne(VorsorgeRechner, { ...profil, basis: { ...profil.basis, maritalStatus: 'married', household: { adultsList: [{}], partnerIncome: '4000' } } });
    expect(feldWert(html, t('vr.einkommenPartner'))).toBe('');
    expect(html).not.toContain('value="48000"');
    expect(html).toContain(t('vr.partnerNettoHint'));
  });
  it('jedes Zahlenfeld des Vorsorge-Rechners hat einen Namen für Screenreader', () => {
    const html = zeichne(VorsorgeRechner, profil);
    const felder = html.match(/<input[^>]*type="number"[^>]*>/g) || [];
    expect(felder.length).toBeGreaterThan(3);
    expect(felder.filter(f => !/aria-label="[^"]+"/.test(f))).toEqual([]);
  });
});
