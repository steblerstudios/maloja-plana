import fs from 'node:fs';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SozialhilfeView } from '../SozialhilfeView.jsx';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';

// Fassung 8, Sozialhilfe (Stebler Studios, 02.11.2026): eine Rechnung, die den Eingaben folgt.
const t = createT({ de, en, fr, it: itTranslations, rm }, 'de');
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const profil = (finanzen) => ({
  basis: { canton: 'ZH', dateOfBirth: '1986-03-01', household: { adults: 1, children: [] } },
  finanzen: { employmentType: 'employed', incomeType: 'netto', ...finanzen },
  wohnen: { rentAmount: 1200 }, versicherungen: { kkPremium: 300 },
});
const seite = (d) => renderToStaticMarkup(React.createElement(SozialhilfeView, { palette, t, data: d, onNavigate: () => {} }));

describe('F8-S1, S2: eine Rechnung', () => {
  it('der Block aus dem Profil ist weg, der Pegel bleibt', () => {
    const html = seite(profil({ monthlyIncome: 800 }));
    expect(html).not.toContain('SKOS-Bedarfsrechnung');
    expect(html).not.toContain(de.sozialhilfe.notEntitled);
    expect(html).toContain('pegel-aufstockung');
  });
  it('die Mietzins-Limite steht bei der Rechnung', () => {
    expect(seite(profil({ monthlyIncome: 800 }))).toContain(t('sozialhilfe.rentLimitUnbekannt'));
  });
});

describe('F8-S3, S5: was fehlt, ist benannt', () => {
  it('Erwerbstätig ohne Mehrkosten: 4 von 5, der Hinweis steht beim Ergebnis', () => {
    const html = seite(profil({ monthlyIncome: 800, savingsAccount: 0 }));
    expect(html).toContain(t('rechnerForm.vonN', { x: 4, n: 5 }));
    expect(html).toContain(de.sozialhilfe.erwerbsunkostenOffen);
    expect(de.sozialhilfe.erwerbsunkostenOffen).not.toContain('unten');
  });
});

describe('F8-S4: leeres Einkommen ergibt keinen Betrag', () => {
  const d = profil({});
  it('kein Betrag, die Seite fragt nach dem Einkommen', () => {
    const html = seite(d);
    expect(html).not.toContain('/ ' + de.sh.monat);
    expect(html).toContain(de.sh.einkommenEingeben.sie);
  });
  it('Gegenprobe: eine 0 ist eine Antwort', () => {
    expect(seite(profil({ monthlyIncome: 0, savingsAccount: 0 }))).not.toContain(de.sh.einkommenEingeben.sie);
  });
});

describe('F8-S6: Nächste Schritte nur, wo sie etwas bringen', () => {
  it('Einkommen deckt den Bedarf: keine Schritte', () => {
    expect(seite(profil({ monthlyIncome: 6000 }))).not.toContain(de.sozialhilfe.step1);
  });
  it('Gegenprobe: mit Betrag stehen sie', () => {
    expect(seite(profil({ monthlyIncome: 800 }))).toContain(de.sozialhilfe.step1);
  });
});

describe('F8-S7: keine Klammer-Mehrzahl', () => {
  it('die Haushalt-Texte nehmen die fertige Personenzahl', () => {
    expect(de.wasStehtMirZu.markeHaushalt).not.toContain('(en)');
    expect(de.schnellcheck.contextCanton).not.toContain('(en)');
    const quelle = fs.readFileSync(new URL('../Lebenssituationen.jsx', import.meta.url), 'utf8');
    expect(quelle).toContain("hh.householdSize === 1 ? 'common.person' : 'common.persons'");
  });
});
