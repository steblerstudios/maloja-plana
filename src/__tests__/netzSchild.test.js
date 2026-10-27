// Netz-Schild (F7-K3-6, Stebler Studios 27.10.2026): ein Schild aus Teilen statt Spinnennetz und zwei Schilden.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { netzSchildTeile, teilWinkel } from '../data/netzSchild.js';
import { NetzSchild } from '../components/NetzSchild.jsx';
import { schildOptionen } from '../data/schutzschild.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { DEMO_DATA } from '../config/demoData.js';

const t = createT({ de }, 'de', 'sie');
const nurText = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const angestellt = { employed: true, annualIncome: 80000, lohnBasis: 'brutto' };

describe('Teile', () => {
  it('Haftpflicht unten an der Spitze, dann im Uhrzeigersinn Hausrat, Pensionskasse, Krankenkasse, Unfall', () => {
    const { teile } = netzSchildTeile({ kkInsurer: 'CSS' }, angestellt);
    expect(teile.map((p) => p.key)).toEqual(['haftpflicht', 'hausrat', 'bvg', 'kk', 'uvg']);
    expect(teilWinkel(0, 5)).toBe(90);
  });
  it('ohne Anstellung keine Teile für Unfall und Pensionskasse — keine falsche Lücke', () => {
    const { teile } = netzSchildTeile({ kkInsurer: 'CSS' }, { employed: false });
    expect(teile.map((p) => p.key)).toEqual(['haftpflicht', 'hausrat', 'kk']);
  });
  it('Krankenkasse in zwei Stufen: Grundversicherung, mit Zusatz', () => {
    const stufe = (v) => netzSchildTeile(v, {}).teile.find((p) => p.key === 'kk').stufe;
    expect(stufe({ liabilityInsurance: 'yes' })).toBe(0);
    expect(stufe({ kkInsurer: 'CSS' })).toBe(1);
    expect(stufe({ kkInsurer: 'CSS', kkZusatz: 'Spital halbprivat' })).toBe(2);
  });
  it('andere Teile: noch nicht gedeckt oder gedeckt', () => {
    const { teile, offen } = netzSchildTeile({ kkInsurer: 'CSS', liabilityInsurance: 'yes', householdInsurance: 'no' }, {});
    expect(teile.find((p) => p.key === 'haftpflicht').stufe).toBe(2);
    expect(offen).toEqual(['hausrat']);
  });
});

describe('Bild und Text', () => {
  const html = (v, o = {}) => renderToStaticMarkup(React.createElement(NetzSchild, { palette: LIGHT_PALETTE, t, versicherungen: v, ...o }));
  it('nichts eingetragen: kein Schild', () => {
    expect(html({})).toBe('');
  });
  it('Satz «Noch nicht gedeckt: …» und je Teil eine Zeile mit Wort, nicht nur Farbe', () => {
    const text = nurText(html({ kkInsurer: 'CSS', liabilityInsurance: 'yes' }));
    expect(text).toContain('Noch nicht gedeckt: Hausrat.');
    expect(text).toContain('Grundversicherung');
    expect(text).toContain('Privathaftpflicht · freiwillig gedeckt');
  });
  it('alles gedeckt: still vollständig', () => {
    expect(nurText(html({ kkInsurer: 'CSS', kkZusatz: 'x', liabilityInsurance: 'yes', householdInsurance: 'yes' }))).toContain('Alle Teile gedeckt.');
  });
  it('das Bild hat einen Namen für Bildschirmleser mit dem Stand je Teil', () => {
    expect(html({ kkInsurer: 'CSS' })).toMatch(/aria-label="Schild aus Versicherungsteilen\. Haftpflicht: noch nicht gedeckt; Hausrat: noch nicht gedeckt; Krankenkasse: Grundversicherung\."/);
  });
  it('Beispiel Maria zeigt das Schild', () => {
    expect(html(DEMO_DATA.versicherungen, schildOptionen(DEMO_DATA))).toContain('data-schild="netz"');
  });
  it('alle Texte in fünf Sprachen', () => {
    const blatt = (o, p) => p.split('.').reduce((x, k) => (x == null ? x : x[k]), o);
    const keys = ['intro', 'aria', 'offen', 'grund', 'zusatz', 'gedeckt', 'pflicht', 'freiwillig', 'nochOffen', 'ganz', 'kurz.kk', 'kurz.uvg', 'kurz.bvg', 'kurz.haftpflicht', 'kurz.hausrat'];
    for (const sprache of [de, en, fr, it_, rm]) for (const k of keys) expect(blatt(sprache, 'netzSchild.' + k)).toBeTruthy();
  });
});
