import { describe, it, expect, vi, afterEach } from 'vitest';

// Bugsuche 09.11.2026, B-17 · Mit IK-Auszug rechnet der Vorsorge-Rechner die Jahre bis zum
// Referenzalter hoch, wie ohne IK (Entscheid Stebler Studios 10.11.2026: «Ja, hochrechnen»).
// Vorher: 40 J., IK 20 Jahre à 80 000 → Rente auf 20/44, «fehlend 24»; beim Vorbezug schlug
// der Rechner aber Jahre dazu (63: «fehlend 22»), und projektionAhv las den IK gar nicht.

let reiter = 'ahv';
vi.mock('react', async (original) => {
  const R = await original();
  const useState = (init) => R.useState(init === 'ahv' ? reiter : init);
  return { ...R, useState, default: { ...R.default, useState } };
});

const React = (await import('react')).default;
const { renderToStaticMarkup } = await import('react-dom/server');
const de = (await import('../i18n/de.js')).default;
const { VorsorgeRechner } = await import('../VorsorgeRechner.jsx');
const { vorbelegeIKAuszug, berechneAltersrente } = await import('../data/ahvRechner.js');
const { ikHochrechnen } = await import('../utils/ikHochrechnung.js');
const { zahl } = await import('../utils/geld.js');

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (schluessel, p) => {
  const wert = String(schluessel).split('.').reduce((o, k) => (o == null ? undefined : o[k]), de);
  let text = wert && typeof wert === 'object' ? (wert.sie ?? Object.values(wert)[0]) : wert;
  if (typeof text !== 'string') return schluessel;
  if (p) for (const [k, v] of Object.entries(p)) text = text.split('{' + k + '}').join(String(v));
  return text;
};
const zeichne = (data) => renderToStaticMarkup(React.createElement(VorsorgeRechner, { palette, t, data, onNavigate: () => {}, onUpdateData: () => {} }));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const geburtsjahr = new Date().getFullYear() - 40;
const ohneIk = {
  basis: { canton: 'BS', dateOfBirth: geburtsjahr + '-01-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: 6153.85, incomeType: 'brutto', dreizehnter: 'yes' },
};
const mitIk = (einkommen = 80000) => ({
  ...ohneIk,
  vorsorge: { ikActive: true, ikAuszug: vorbelegeIKAuszug({ geburtsjahr, aktuellesAlter: 40, aktuellesEinkommen: einkommen }) },
});
const vollrente = berechneAltersrente({ geburtsjahr, durchschnittlichesJahreseinkommen: 80000, beitragsjahre: 44, bezugAlter: 65 }).monatsrente;

afterEach(() => { reiter = 'ahv'; });

describe('ikHochrechnen', () => {
  const ik = { beitragsjahre: 20, durchschnittlichesJahreseinkommen: 60000 };
  it('legt die künftigen Jahre dazu, höchstens volle Beitragsdauer', () => {
    expect(ikHochrechnen({ ik, zukunftsJahre: 25, einkommenHeute: 80000, volleDauer: 44 }).beitragsjahreReferenzalter).toBe(44);
    expect(ikHochrechnen({ ik, zukunftsJahre: 10, einkommenHeute: 80000, volleDauer: 44 }).beitragsjahreReferenzalter).toBe(30);
  });
  it('mischt das Einkommen: IK-Summe + heutiges Einkommen je angerechnetem künftigem Jahr', () => {
    // 20 × 60 000 + 24 × 80 000 = 3 120 000 / 44 = 70 909
    expect(ikHochrechnen({ ik, zukunftsJahre: 25, einkommenHeute: 80000, volleDauer: 44 }).durchschnittlichesJahreseinkommen).toBe(70909);
  });
  it('ohne heutiges Einkommen bleibt der IK-Durchschnitt', () => {
    expect(ikHochrechnen({ ik, zukunftsJahre: 25, einkommenHeute: 0, volleDauer: 44 }).durchschnittlichesJahreseinkommen).toBe(60000);
  });
  it('Lücken der Vergangenheit bleiben: nur die Zukunft wird gefüllt', () => {
    const mitLuecken = { beitragsjahre: 15, durchschnittlichesJahreseinkommen: 80000 };
    expect(ikHochrechnen({ ik: mitLuecken, zukunftsJahre: 25, einkommenHeute: 80000, volleDauer: 44 }).beitragsjahreReferenzalter).toBe(40);
  });
});

describe('Vorsorge-Rechner mit IK-Auszug', () => {
  it('IK mit demselben Einkommen wie heute: dieselbe Rente ab 65 wie ohne IK', () => {
    const html = zeichne(mitIk());
    expect(html).toContain('CHF ' + esc(zahl(vollrente)) + ' / ' + t('vr.monat'));
    expect(html).not.toContain(esc(t('vr.fehlendeBeitragsjahre')));
  });

  it('der Zukunft-Reiter nutzt den IK wirklich: andere IK-Einkommen ändern das Bild', () => {
    reiter = 'zukunft';
    const hoch = zeichne(mitIk(80000));
    const tief = zeichne(mitIk(40000));
    const ahv = (html) => (html.match(/AHV CHF[^<]*/) || [''])[0];
    expect(ahv(hoch)).not.toBe('');
    expect(ahv(tief)).not.toBe(ahv(hoch));
  });
});
