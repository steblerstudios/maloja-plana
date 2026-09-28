import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { zahl as geldZahl } from '../utils/geld.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';
import { KKLastCard } from '../KKLastCard.jsx';
import { PraemienBeleg } from '../components/PraemienBeleg.jsx';
import { praemienBelegState } from '../data/praemienBeleg.js';
import { calculateMonthlyBudget } from '../budgetSync.js';
import { ipvAbzug } from '../data/ipvAbzug.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js';
import rm from '../i18n/rm.js';

// K31 — der IPV-Rechner zeigt für GE den Betrag nach dem Gruppen-Modell (Barème 2026).
// Was hier sichtbar sein muss:
//   1. ein Betrag nur MIT erfasster Prämie (Art. 22 Abs. 4 LaLAMal deckelt auf die effektive Prämie).
//   2. die amtliche Einkommensgrenze (Art. 21 LaLAMal: 50 000 allein, 151 000 mit einem Kind) — und
//      NICHT die alten Musterwerte (60 000 / 3 600).
//   3. kein Regionssatz und nicht der Aargauer Satz, sondern der Genfer (`ipv.jahrGE`); der Vorbehalt
//      mit dem Basisjahr (RDU aus der Veranlagung von vor zwei Jahren).
//   4. der Antragshinweis unter 15 000 RDU, der Gruppe-9-Hinweis über Gruppe 8.
//   5. (Fachprüfung PR #469) nach dem 30. November in keinem der drei Abzugs-Leser der Luzerner
//      Text (B2), ein eigener Grund für Wohneigentum (W2), der Weg-Satz nennt Frist und Bemessungsjahr (B1).

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data, tt = t) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t: tt, data, onUpdateData: () => {} }));
const kk = (data, tt = t) => renderToStaticMarkup(React.createElement(KKLastCard, { palette, t: tt, data, onNavigate: () => {} }));
const beleg = (data, tt = t) => renderToStaticMarkup(React.createElement(PraemienBeleg, { palette, t: tt, state: praemienBelegState(data) }));
// Mit den echten deutschen Texten: prüft, dass «Luzern» auch nicht über einen anderen Schlüssel kommt.
const tDe = (k, p) => {
  const v = k.split('.').reduce((o, x) => (o == null ? o : o[x]), de);
  const txt = typeof v === 'string' ? v : (v && typeof v.sie === 'string' ? v.sie : k);
  return txt.replace(/\{(\w+)\}/g, (m, n) => (p && p[n] != null ? String(p[n]) : m));
};

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'GE', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome, ...(extra.finanzen || {}) },
  wohnen: { postalCode: extra.plz || '1204', city: extra.city || 'Genève', rentAmount: 1500, ...(extra.wohnen || {}) },
  versicherungen: extra.kkPremium !== undefined ? (extra.kkPremium === null ? {} : { kkPremium: extra.kkPremium }) : { kkPremium: 500 },
});

describe('K31 IPV-Rechner, Kanton Genf', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../config/ipvGenf.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  // Fester Tag vor der Frist (30.11.) — die Antragshinweise hängen sonst am Kalender.
  beforeEach(() => { vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date('2026-09-28T12:00:00')); });
  afterEach(() => vi.useRealTimers());

  it('B1: der Weg-Satz ohne Antragsfall nennt die Frist und das Bemessungsjahr; im Antragsfall kein «automatisch»', () => {
    const normal = render(profil(2000), tDe);
    expect(normal).toContain('In der Regel automatisch');
    expect(normal).toContain('30. November des Anspruchsjahres');
    expect(normal).toContain('Bemessungsjahr');
    expect(normal).not.toContain('Automatisch via SAM');
    const antrag = render(profil(1000), tDe);
    expect(antrag).not.toContain('In der Regel automatisch');
    expect(antrag).not.toContain('Automatisch via SAM');
  });

  it('Wohneigentum: keine Zahl, eigener Grund (W2)', () => {
    const html = render(profil(2000, { wohnen: { propertyValue: 500000 } }));
    expect(html).toContain('ipv.offenGrund.wohneigentumGE');
    expect(html).not.toContain('CHF 4’176');
    expect(html).not.toContain('premium.eligible');
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
    expect(html).toContain('ipv.geAntragNoetig(' + geldZahl(15000) + '|2026)');
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
    expect(html).toContain('ipv.geNurKinder(' + geldZahl(151000) + ')');
  });

  it('über der Grenze: «Einkommen über Grenze» mit der amtlichen Zahl', () => {
    expect(render(profil(4500))).toContain('ipv.incomeAboveLimit(50000)');
  });

  it('kein roher Schlüssel bleibt stehen: alle GE-Texte in allen fünf Sprachen', async () => {
    // Die Sprachdateien NICHT als `it` importieren — das überschriebe vitests `it`.
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = (await import(`../i18n/${sprache}.js`)).default;
      for (const k of ['jahrGE', 'vorbehaltGE', 'geWegAutomatisch', 'geWegAntrag', 'geAntragNoetig', 'geAntragNoetigKinder', 'geAntragFristVorbei', 'geAntragKindNeu', 'geNurKinder']) {
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
      for (const k of ['geAntragNoetig', 'geAntragNoetigKinder', 'geAntragFristVorbei']) {
        expect(texte.ipv[k]).toContain('{value}');
        expect(texte.ipv[k]).toContain('{jahr}');
      }
      expect(texte.ipv.geAntragFristVorbei).toContain('{folgejahr}');
      expect(texte.ipv.geAntragKindNeu).toContain('{basisjahr}');
      expect(texte.ipv.geAntragKindNeu).toContain('{folgejahr}');
      expect(texte.ipv.geNurKinder).toContain('{value}');
      // B1: der pauschale Satz ist weg — nur GE las ihn.
      expect(texte.ipv.noteAutoSam, `${sprache}.js: ipv.noteAutoSam noch da`).toBeUndefined();
      // B2: der Genfer Frist-Text für Budget/KK-Last/Beleg
      expect(typeof texte.ipv.geFristNichtAbgezogen, `${sprache}.js: ipv.geFristNichtAbgezogen fehlt`).toBe('string');
      expect(texte.ipv.geFristNichtAbgezogen).toContain('{jahr}');
    }
  });

  it('Paare, Kinder ohne Alter und Vermögen über 250 000: Orientierung mit Grund statt Zahl', () => {
    const paar = render({ ...profil(2000), basis: { ...profil(2000).basis, maritalStatus: 'married' } });
    expect(paar).toContain('ipv.orientierungOffen');
    expect(render(profil(2000, { children: [{ age: 0 }] }))).toContain('ipv.orientierungOffen');
    const vermoegen = render(profil(2000, { finanzen: { savingsAccount: 300000 } }));
    expect(vermoegen).toContain('ipv.offenGrund.vermoegenAntragGE');
    expect(vermoegen).not.toContain('CHF 4’176');
  });
});

// B2 (Fachprüfung PR #469): nach dem 30. November zeigten KK-Last-Karte, Prämien-Beleg und Budget für
// Genf den Luzerner Text («Frist 31. Oktober 2025 … nur für die Prämien nach der Anmeldung»). Derselbe
// Mechanismus wie FR: das Ergebnis nennt `fristNichtAbgezogenKey`, die Leser nehmen ihn.
describe('K31 GE nach der Antragsfrist (1.12.2026): nirgends abgezogen, Genfer Text in allen drei Lesern', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../config/ipvGenf.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => vi.useRealTimers());
  const am = (datum) => { vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date(datum)); };
  const arm = profil(1000); // 12 000 − 600 Berufskosten = RDU 11 400 < 15 000: Antrag nach beiden Lesarten

  it('Abzug 0, Grund fristVorbei', () => {
    am('2026-12-01T12:00:00');
    expect(ipvAbzug(arm)).toEqual({ betrag: 0, grund: 'fristVorbei', frist: { jahr: 2026, vorjahr: 2025 } });
  });

  it('KK-Last-Karte: der Genfer Text, kein luFrist, kein «Luzern»', () => {
    am('2026-12-01T12:00:00');
    const karte = kk(arm);
    expect(karte).toContain('ipv.geFristNichtAbgezogen(2026|2025)');
    expect(karte).not.toContain('luFrist');
    expect(karte).not.toContain('kkLast.ipvRelief');
    const echt = kk(arm, tDe);
    expect(echt).not.toContain('Luzern');
    expect(echt).toContain('Prämienverbilligung Genf');
    expect(echt).toContain('30. November 2026');
  });

  it('Prämien-Beleg: Modus fristVorbei mit dem Genfer Text, kein «Luzern»', () => {
    am('2026-12-01T12:00:00');
    expect(praemienBelegState(arm)).toMatchObject({ mode: 'fristVorbei', verbilligung: 0, noteKey: 'ipv.geFristNichtAbgezogen' });
    expect(beleg(arm)).not.toContain('luFrist');
    expect(beleg(arm, tDe)).not.toContain('Luzern');
  });

  it('Budget: nichts abgezogen, der Genfer Hinweis, kein «Luzern»', () => {
    am('2026-12-01T12:00:00');
    const b = calculateMonthlyBudget(arm, t);
    expect(b.ipvRelief).toBe(0);
    expect(b.ipvAnmeldefristHinweisKey).toBe('ipv.geFristNichtAbgezogen');
    const texte = b.recommendations.map((r) => r.text).join(' ');
    expect(texte).toContain('ipv.geFristNichtAbgezogen(2026|2025)');
    expect(texte).not.toContain('LuFrist');
    const echt = calculateMonthlyBudget(arm, tDe).recommendations.map((r) => r.text).join(' ');
    expect(echt).not.toContain('Luzern');
    expect(echt).toContain('Prämienverbilligung Genf');
  });

  it('Seite Prämienverbilligung: der Genfer Frist-Satz, kein «Luzern»', () => {
    am('2026-12-01T12:00:00');
    const html = render(arm);
    expect(html).toContain('ipv.geAntragFristVorbei(' + geldZahl(15000) + '|2026|2027)');
    expect(html).not.toContain('ipv.geAntragNoetig(');
    expect(render(arm, tDe)).not.toContain('Luzern');
  });

  it('vor der Frist (29.11.): der geschätzte Betrag wird abgezogen, kein Frist-Text', () => {
    am('2026-11-29T12:00:00');
    expect(ipvAbzug(arm)).toMatchObject({ betrag: 348, grund: 'geschaetzt' });
    const karte = kk(arm);
    expect(karte).toContain('kkLast.ipvRelief(348|');
    expect(karte).not.toContain('FristNichtAbgezogen');
  });

  it('kein Antragsfall (Einkommen 24 000): auch nach dem 30.11. abgezogen — keine Frist', () => {
    am('2026-12-01T12:00:00');
    expect(ipvAbzug(profil(2000))).toMatchObject({ betrag: 348, grund: 'geschaetzt' });
  });

  it('die Genfer Frist-Texte in allen fünf Sprachen nennen Genf und den 30. November, nicht Luzern', () => {
    const genf = { de: /Genf/, fr: /Genève/, it: /Ginevra/, en: /Geneva/, rm: /Genevra/ };
    const nov = { de: /30\. November/, fr: /30 novembre/, it: /30 novembre/, en: /30 November/, rm: /30 da november/ };
    for (const [sprache, texte] of Object.entries({ de, fr, it: itSprache, en, rm })) {
      expect(texte.ipv.geFristNichtAbgezogen, sprache).toMatch(nov[sprache]);
      expect(texte.ipv.geFristNichtAbgezogen, sprache).toMatch(genf[sprache]);
      expect(texte.ipv.geFristNichtAbgezogen, sprache).not.toMatch(/Luzern|Lucerne|Lucerna|31/);
      expect(texte.ipv.offenGrund.wohneigentumGE, sprache).toMatch(/250/);
    }
  });
});
