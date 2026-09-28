import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { zahl as geldZahl } from '../utils/geld.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';
import { KKLastCard } from '../KKLastCard.jsx';
import { praemienBelegState } from '../data/praemienBeleg.js';
import { calculateMonthlyBudget } from '../budgetSync.js';

// K31 — der IPV-Rechner zeigt für GE den Betrag nach dem Gruppen-Modell (Barème 2026).
// Was hier sichtbar sein muss:
//   1. ein Betrag nur MIT erfasster Prämie (Art. 22 Abs. 4 LaLAMal deckelt auf die effektive Prämie).
//   2. die amtliche Einkommensgrenze (Art. 21 LaLAMal: 50 000 allein, 151 000 mit einem Kind) — und
//      NICHT die alten Musterwerte (60 000 / 3 600).
//   3. kein Regionssatz und nicht der Aargauer Satz, sondern der Genfer (`ipv.jahrGE`); der Vorbehalt
//      mit dem Basisjahr (RDU aus der Veranlagung von vor zwei Jahren).
//   4. der Antragshinweis unter 15 000 RDU, der Gruppe-9-Hinweis über Gruppe 8.

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'GE', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome, ...(extra.finanzen || {}) },
  wohnen: { postalCode: extra.plz || '1204', city: extra.city || 'Genève', rentAmount: 1500 },
  versicherungen: extra.kkPremium !== undefined ? (extra.kkPremium === null ? {} : { kkPremium: extra.kkPremium }) : { kkPremium: 500 },
});

describe('K31 IPV-Rechner, Kanton Genf', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../config/ipvGenf.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('zeigt den Betrag: 24 000 im Jahr → Gruppe 1, 4 176/Jahr, 348/Monat', () => {
    const html = render(profil(2000));
    expect(html).toContain('premium.eligible');
    expect(html).not.toContain('ipv.orientierungOffen');
    expect(html).toContain('CHF 4’176');
    expect(html).toContain('CHF 348');
  });

  it('ohne erfasste Prämie: keine Zahl, sondern der Grund', () => {
    const html = render(profil(2000, { kkPremium: null }));
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain('ipv.offenGrund.praemie');
    expect(html).not.toContain('CHF 4’176');
  });

  it('nennt die amtliche Einkommensgrenze — 50 000 allein, 121 000 (Erwachsene) mit einem Kind — und keine Musterwerte', () => {
    const allein = render(profil(2000));
    expect(allein).toContain('premium.maxIncome(' + geldZahl(50000) + ')');
    const kind = render(profil(2000, { children: [{ age: 5 }] }));
    expect(kind).toContain('premium.maxIncome(' + geldZahl(121000) + ')');
    expect(kind).not.toContain('premium.maxIncome(' + geldZahl(151000) + ')');
    for (const html of [allein, kind]) {
      for (const zahl of [60000, 3600, 7200]) {
        expect(html).not.toContain(geldZahl(zahl));
      }
    }
  });

  it('kein Regionssatz, nicht der Aargauer Satz — der Genfer Satz und der Genfer Vorbehalt mit Basisjahr', () => {
    const html = render(profil(2000));
    expect(html).toContain('ipv.jahrGE(2026)');
    expect(html).not.toContain('ipv.jahrOhneRegion');
    expect(html).not.toContain('ipv.jahrRegion');
    expect(html).toContain('ipv.vorbehaltGE(2026|2024)');
    expect(html).not.toContain('ipv.vorbehalt(');
  });

  // Rechtsprüfung 28.09.2026 (Blocker): im Antragsfall stand «Automatisch via SAM» in der Kantonskarte
  // und «Berechtigt» als Überschrift — neben dem Satz «prüft nicht automatisch».
  it('unter 15 000 RDU: Antragshinweis mit Grenze und Jahr, Karte «Antrag nötig», Überschrift ohne «Berechtigt»', () => {
    const html = render(profil(1000));
    expect(html).toContain('ipv.geAntragNoetig(15000|2026)');
    expect(html).toContain('premium.note(ipv.geWegAntrag)');
    expect(html).toContain('premium.eligibleAntrag');
    expect(html).not.toMatch(/premium\.eligible[^A]/);
    expect(html).not.toContain('noteAutoSam');
    // der Normalfall: «in der Regel automatisch», Überschrift «Berechtigt»
    const normal = render(profil(2000));
    expect(normal).not.toContain('ipv.geAntragNoetig');
    expect(normal).toContain('premium.note(ipv.geWegAutomatisch)');
    expect(normal).toMatch(/premium\.eligible[^A]/);
    expect(normal).not.toContain('premium.eligibleAntrag');
  });

  it('junge erwachsene Person: eigener Grund mit Antragsfrist statt «Geburtsdatum fehlt»', () => {
    const html = render({ ...profil(2000), basis: { ...profil(2000).basis, dateOfBirth: '2004-05-01' } });
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain('ipv.offenGrund.geJungeErwachsene');
    expect(html).not.toContain('ipv.offenGrund.alter');
  });

  it('über Gruppe 8 mit Kind: nur der Kinderbeitrag, mit dem Gruppe-9-Hinweis', () => {
    const html = render(profil(10500, { children: [{ age: 5 }] }));
    expect(html).toContain('premium.eligible');
    expect(html).toContain('CHF 67');
    expect(html).toContain('ipv.geNurKinder(151000)');
  });

  it('über der Grenze: «Einkommen über Grenze» mit der amtlichen Zahl', () => {
    expect(render(profil(4500))).toContain('ipv.incomeAboveLimit(50000)');
  });

  it('kein roher Schlüssel bleibt stehen: alle GE-Texte in allen fünf Sprachen', async () => {
    // Die Sprachdateien NICHT als `it` importieren — das überschriebe vitests `it`.
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = (await import(`../i18n/${sprache}.js`)).default;
      for (const k of ['jahrGE', 'vorbehaltGE', 'geWegAutomatisch', 'geWegAntrag', 'geAntragNoetig', 'geAntragFristVorbei', 'geFristNichtAbgezogen', 'geAntragKindNeu', 'geNurKinder']) {
        expect(typeof texte.ipv[k], `${sprache}.js: ipv.${k} fehlt`).toBe('string');
        expect(texte.ipv[k].length).toBeGreaterThan(40);
      }
      for (const k of ['vermoegenAntragGE', 'geJungeErwachsene', 'wohneigentumGE']) {
        expect(typeof texte.ipv.offenGrund[k], `${sprache}.js: offenGrund.${k} fehlt`).toBe('string');
      }
      expect(typeof texte.premium.eligibleAntrag, `${sprache}.js: premium.eligibleAntrag fehlt`).toBe('string');
      expect(texte.ipv.jahrGE).toContain('{jahr}');
      expect(texte.ipv.vorbehaltGE).toContain('{basisjahr}');
      expect(texte.ipv.vorbehaltGE).toContain('{jahr}');
      for (const k of ['geAntragNoetig', 'geAntragFristVorbei']) {
        expect(texte.ipv[k]).toContain('{value}');
        expect(texte.ipv[k]).toContain('{jahr}');
      }
      expect(texte.ipv.geAntragFristVorbei).toContain('{folgejahr}');
      expect(texte.ipv.geAntragKindNeu).toContain('{basisjahr}');
      expect(texte.ipv.geAntragKindNeu).toContain('{folgejahr}');
      expect(texte.ipv.geNurKinder).toContain('{value}');
    }
  }, 30000);

  it('Paare, Kinder ohne Alter und Vermögen über 250 000: Orientierung mit Grund statt Zahl', () => {
    const paar = render({ ...profil(2000), basis: { ...profil(2000).basis, maritalStatus: 'married' } });
    expect(paar).toContain('ipv.orientierungOffen');
    expect(render(profil(2000, { children: [{ age: 0 }] }))).toContain('ipv.orientierungOffen');
    const vermoegen = render(profil(2000, { finanzen: { savingsAccount: 300000 } }));
    expect(vermoegen).toContain('ipv.offenGrund.vermoegenAntragGE');
    expect(vermoegen).not.toContain('CHF 4’176');
  });

  it('Wohneigentum: keine Zahl, eigener Grund mit Antrag (W2)', () => {
    const html = render({ ...profil(2000), wohnen: { postalCode: '1204', city: 'Genève', propertyValue: 900000 } });
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain('ipv.offenGrund.wohneigentumGE');
    expect(html).not.toContain('CHF 4’176');
  });
});

// Fachprüfung B2 (PR #469): nach dem 30. November zeigten KK-Last-Karte, Prämien-Beleg und Budget für
// Genf den LUZERNER Text («31. Oktober 2025», «nur für die Prämien, die nach der Anmeldung fällig
// werden»). Jetzt nennt das Ergebnis seinen Schlüssel (`fristNichtAbgezogenKey`, Mechanismus wie FR).
describe('K31 GE nach der Antragsfrist (1.12.2026): nirgends abgezogen, Genfer Text in allen drei Lesern', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../config/ipvGenf.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });
  const arm = () => profil(1000);
  const am = (datum) => { vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date(datum)); };

  it('KK-Last-Karte: der Genfer Text, kein luFrist, kein «Luzern»', () => {
    am('2026-12-01T12:00:00');
    const karte = renderToStaticMarkup(React.createElement(KKLastCard, { palette, t, data: arm(), onNavigate: () => {} }));
    expect(karte).toContain('ipv.geFristNichtAbgezogen');
    expect(karte).not.toContain('luFrist');
    expect(karte).not.toContain('Luzern');
  });

  it('Prämien-Beleg: Modus fristVorbei mit dem Genfer Text', () => {
    am('2026-12-01T12:00:00');
    expect(praemienBelegState(arm())).toMatchObject({ mode: 'fristVorbei', verbilligung: 0, noteKey: 'ipv.geFristNichtAbgezogen' });
  });

  it('Budget: nichts abgezogen, der Genfer Hinweis-Schlüssel', () => {
    am('2026-12-01T12:00:00');
    const b = calculateMonthlyBudget(arm(), t);
    expect(b.ipvRelief ?? 0).toBe(0);
    expect(b.ipvAnmeldefristHinweisKey).toBe('ipv.geFristNichtAbgezogen');
  });

  it('vor der Frist (28.09.2026) wird ganz normal abgezogen', () => {
    am('2026-09-28T12:00:00');
    expect(praemienBelegState(arm()).mode).not.toBe('fristVorbei');
    expect(calculateMonthlyBudget(arm(), t).ipvAnmeldefristHinweisKey ?? null).toBeNull();
  });
});
