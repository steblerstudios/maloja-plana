import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';
import i18nDe from '../i18n/de.js';
import i18nFr from '../i18n/fr.js';
import i18nIt from '../i18n/it.js';
import i18nEn from '../i18n/en.js';
import i18nRm from '../i18n/rm.js';

// Sprachdateien (zusammen ~3,8 MB) statisch laden: ein import() im Testkörper zählt gegen
// das 5-s-Testtimeout und lief unter Last der vollen Suite darüber (Pre-Commit 18.10.2026).
const TEXTE = { de: i18nDe, fr: i18nFr, it: i18nIt, en: i18nEn, rm: i18nRm };

// K31 — der IPV-Rechner zeigt für TG bewusst keinen Betrag, sondern den Grund: der Kanton rechnet
// nach der einfachen Steuer zu 100 % (TG KVV § 14), die die App nicht kennt. Sichtbar sein muss:
//   1. die Orientierung mit dem Thurgauer Grund, nie ein Betrag und nie «berechtigt»
//   2. keine Musterwerte (48 000 / 2 400) und keine Einkommensgrenze
//   3. der Grund-Text in allen fünf Sprachen, mit den amtlichen Ansätzen und der Frist

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'TG', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome },
  wohnen: { postalCode: '8500', city: 'Frauenfeld', rentAmount: 1200 },
  versicherungen: { kkPremium: 400 },
});

describe('K31 IPV-Rechner, Kanton Thurgau', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../config/ipvThurgau.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  // Ohne Einkommen fragt die Anzeige zuerst danach (wie in jedem Kanton) — das ist hier nicht Thema.
  it('keine Zahl, sondern der Thurgauer Grund — tief und hoch dasselbe', () => {
    for (const lohn of [800, 1500, 6000]) {
      const html = render(profil(lohn));
      expect(html).toContain('ipv.orientierungOffen');
      expect(html).toContain('ipv.offenGrund.tgSteuerbetrag');
      expect(html).not.toContain('premium.eligible');
      expect(html).not.toContain('premium.maxIncome');
    }
  });

  it('keine Musterwerte', () => {
    const html = render(profil(1500, { children: [{ age: 4 }] }));
    for (const z of ['48000', '48’000', '2400', '2’400']) expect(html).not.toContain(z);
  });

  it('der Grund-Text in allen fünf Sprachen, mit den Ansätzen 2026 und der Frist', async () => {
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = TEXTE[sprache];
      const g = texte.ipv.offenGrund.tgSteuerbetrag;
      expect(typeof g, `${sprache}: offenGrund.tgSteuerbetrag`).toBe('string');
      for (const z of ['3 408', '2 556', '1 704', '1 236', '1 600', '100 000', '200 000', '30', 'Krankenkassenkontrollstelle']) expect(g, `${sprache}: ${z}`).toContain(z);
      // Mit Kontext gepinnt (Prüfung #474, 💡 2): «600» steckt sonst schon in «1 600», «31» fast überall.
      const kontext = {
        de: ['Fr. 400 ', 'Fr. 600 ', 'Fr. 800 ', '31. Dezember'], en: ['CHF 400,', 'CHF 600,', 'CHF 800,', '31 December'],
        fr: ['400 francs', ' 600 francs, 2', '800 francs', '31 décembre'], it: ['400 franchi', ' 600 franchi, 2', '800 franchi', '31 dicembre'],
        rm: ['fr. 400 ', 'fr. 600 ', 'fr. 800 ', '31 da december'],
      }[sprache];
      for (const z of kontext) expect(g, `${sprache}: «${z}»`).toContain(z);
      expect(typeof texte.ipv.noteApplyKkKontrollstelle, `${sprache}: noteApplyKkKontrollstelle`).toBe('string');
    }
  }, 30000);
});
