import { describe, it, expect, vi, afterEach } from 'vitest';

// Audit B9 (Voll-Audit 10/2026): Beitragsjahre leer → die AHV-Schätzung ab Bezug rechnete mit
// den Jahren BIS HEUTE (alter − 20). 40 J., Ø 80'000 → 20/44 der Vollrente, und das «Total
// 1. + 2. Säule» zählte diese abgeschnittene AHV zur bis zum Bezug hochgerechneten BVG.
// Geprüft am gezeichneten Rechner: Reiter «AHV» und Reiter «Vergleich» (dort steht das Total).
// Der Reiter wird über den Startwert von useState gewählt, sonst bleibt alles echt.
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
const { berechneAltersrente } = await import('../data/ahvRechner.js');
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
// HTML-Escaping von renderToStaticMarkup nachbilden (Apostroph im Zahlformat, Klammern im Text).
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Das Beispiel aus dem Audit: 40 Jahre, Bruttolohn 80'000 (6153.85 × 13), kein Geschlecht → Referenzalter 65.
const geburtsjahr = new Date().getFullYear() - 40;
const profil = {
  basis: { canton: 'BS', dateOfBirth: geburtsjahr + '-01-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: 6153.85, incomeType: 'brutto', dreizehnter: 'yes' },
};
const rente = (jahre) => berechneAltersrente({ geburtsjahr, durchschnittlichesJahreseinkommen: 80000, beitragsjahre: jahre, bezugAlter: 65 }).monatsrente;
const annahme = esc(t('vr.beitragsjahreAngenommen', { alter: '65 ' + t('vr.jahre'), jahre: 44 }));

afterEach(() => { reiter = 'ahv'; });

describe('Vorsorge-Rechner: leere Beitragsjahre = Beiträge bis zum Bezug (B9)', () => {
  it('Reiter AHV: 44/44 statt 20/44, Rente der vollen Skala, Annahme sichtbar', () => {
    const html = zeichne(profil);
    expect(rente(20)).toBeLessThan(rente(44) * 0.5);        // der Fehler war gross, nicht kosmetisch
    expect(html).toContain('(44/44 ' + t('vr.jahre') + ')');
    expect(html).not.toContain('(20/44 ' + t('vr.jahre') + ')');
    expect(html).toContain('CHF ' + esc(zahl(rente(44))) + ' / ' + t('vr.monat'));
    expect(html).not.toContain('CHF ' + esc(zahl(rente(20))) + ' / ');
    expect(html).toContain(annahme);
  });

  it('Reiter Vergleich: das Total zählt die AHV bis 65 zur BVG bis 65, mit Annahme', () => {
    reiter = 'vergleich';
    const html = zeichne(profil);
    expect(html).toContain(t('vr.totalRente'));
    expect(html).toContain('AHV CHF ' + esc(zahl(rente(44))) + ' + BVG CHF ');
    expect(html).toContain(annahme);
  });

  it('das leere Feld zeigt die angenommenen 44 Jahre als Platzhalter', () => {
    const html = zeichne(profil);
    const feld = html.match(new RegExp('<input[^>]*aria-label="' + t('vr.beitragsjahre') + '"[^>]*>'));
    expect(feld && feld[0]).toContain('placeholder="44"');
    expect(feld && feld[0]).toContain('value=""');
  });
});

describe('Text der Annahme in allen fünf Sprachen', () => {
  it('vorhanden, mit beiden Platzhaltern', async () => {
    for (const lang of ['de', 'fr', 'it', 'en', 'rm']) {
      const txt = (await import('../i18n/' + lang + '.js')).default.vr.beitragsjahreAngenommen;
      expect(typeof txt, lang).toBe('string');
      expect(txt, lang).toContain('{alter}');
      expect(txt, lang).toContain('{jahre}');
    }
  });
});
