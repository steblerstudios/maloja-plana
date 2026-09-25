import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateIPV } from '../config/cantonalData.js';
import { kantoneBelegtSimulieren } from '../config/__tests__/ipvBelegtSimulieren.js';
import { CANTONAL_LINKS } from '../data/direktLinks.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';
import { Schnellcheck } from '../Schnellcheck.jsx';
import { SozialhilfeView } from '../SozialhilfeView.jsx';
import { FinanzUebersicht, druckAbschnitte } from '../FinanzUebersicht.jsx';
import { KKLastCard } from '../KKLastCard.jsx';
import { QuickCheck } from '../components/Leistungsliste.jsx';
import { buildIpvDokument } from '../premiumCalc.js';
import { calculateMonthlyBudget, createBudgetReport } from '../budgetSync.js';
import { leiteKategorienAb } from '../exportVorschau.js';
import { getBehoerdenDossierPreview, generateBehoerdenJSON } from '../dossierGenerator.js';
import { anspruchSignale } from '../data/anspruchSignale.js';

// ─────────────────────────────────────────────────────────────
// E9 (Entscheid 16.09.2026, Bau-Liste M13): Die kantonalen IPV-Werte sind
// mustergeneriert. Solange ein Kanton nicht amtlich belegt ist, erscheint an
// KEINER Stelle ein IPV-Betrag, ein «Berechtigt» oder eine Einkommensgrenze —
// nur der neutrale Hinweis «ob ein Anspruch besteht und wie hoch er ist, legt der
// Kanton fest» — ohne Einschätzung aus der (unbelegten) Grenze, bei tiefem und hohem
// Einkommen gleich. Ein belegter Kanton (hier simuliert) zeigt den Betrag wie bisher.
// ─────────────────────────────────────────────────────────────

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (C, props) => renderToStaticMarkup(React.createElement(C, { palette, t, onNavigate: () => {}, ...props }));
const fmt = (n) => 'CHF ' + Number(n || 0).toLocaleString('de-CH', { maximumFractionDigits: 0 });

// BS, Einperson, 2000/Monat: nach dem (unbelegten) Muster klar unter der Grenze.
// (Bis 23.09.2026 stand hier LU; seither rechnet LU nach eigenem Modell.)
const profil = (extra = {}) => ({
  basis: { canton: 'BS', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: 2000 },
  wohnen: {},
  versicherungen: { kkPremium: 450 },
  ...extra,
});

// QuickCheck füllt seit 25.09.2026 nur mit bekannter Einkommensart vor (EinkommenFeld).
const nettoProfil = () => { const p = profil(); return { ...p, finanzen: { ...p.finanzen, incomeType: 'netto' } }; };

// Der Betrag, den das Muster rechnen WÜRDE — er darf unbelegt nirgends stehen.
let musterBetrag;
beforeAll(() => {
  const zurueck = kantoneBelegtSimulieren(['BS']);
  musterBetrag = calculateIPV(profil());
  zurueck();
});

describe('E9 · Kanton nicht belegt: kein Betrag an keiner Stelle', () => {
  it('Voraussetzung: das Muster hätte einen Betrag gerechnet', () => {
    expect(musterBetrag.eligible).toBe(true);
    expect(musterBetrag.amount).toBeGreaterThan(0);
    const r = calculateIPV(profil());
    expect(r.belegt).toBe(false);
    expect(r.anspruchMoeglich).toBe(true);
    expect(r.amount).toBeNull();
  });

  it('tiefes und hohes Einkommen: dieselbe Ausgabe im Rechner, Schnellcheck, Budget und in der Finanzübersicht', () => {
    const tief = profil({ finanzen: { monthlyIncome: 800 } });
    const hoch = profil({ finanzen: { monthlyIncome: 25000 } });
    expect(calculateIPV(hoch)).toEqual(calculateIPV(tief));
    expect(render(PremiumSubsidy, { data: hoch, onUpdateData: () => {} })).toBe(render(PremiumSubsidy, { data: tief, onUpdateData: () => {} }));
    expect(calculateMonthlyBudget(hoch, t).recommendations.map((r) => r.text)).toContain('budget.ipvHintOhneBetrag');
    const ipvZeile = (d) => render(Schnellcheck, { data: { ...d, finanzen: { ...d.finanzen, incomeType: 'netto' } } }).includes('schnellcheck.ipvOhneBetragNote');
    expect(ipvZeile(hoch)).toBe(true);
    expect(ipvZeile(tief)).toBe(true);
    expect(render(FinanzUebersicht, { data: hoch })).toContain('ipv.statusOffen');
  });

  it('Verfahrens-Hinweis je Kanton ist ausgeblendet, der Link zur Stelle bleibt', () => {
    const html = render(PremiumSubsidy, { data: profil({ basis: { canton: 'GL', household: { adults: 1, children: [] } } }), onUpdateData: () => {} });
    expect(html).not.toContain('premium.note');
    expect(html).not.toContain('ipv.noteAutoTaxData');
    expect(html).toContain('href="' + CANTONAL_LINKS.GL.ipv + '"');
  });

  it('IPV-Rechner: Orientierung + Link zur kantonalen Stelle, kein Betrag, kein Verdikt, keine Grenze', () => {
    const html = render(PremiumSubsidy, { data: profil(), onUpdateData: () => {} });
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain('ipv.zurStelle');
    expect(html).toContain('href="' + CANTONAL_LINKS.BS.ipv + '"');
    expect(html).toContain('ipvStatus.orientierungLead');
    expect(html).not.toContain('premium.eligible');
    expect(html).not.toContain('premium.notEligible');
    expect(html).not.toContain('premium.monthlySubsidy');
    expect(html).not.toContain('premium.annualSubsidy');
    expect(html).not.toContain('premium.maxIncome');
    expect(html).not.toContain('premium.compareCantons');
    expect(html).not.toContain('ipvStatus.geschaetztLead');
    expect(html).not.toContain('CHF ' + musterBetrag.amount);
  });

  it('IPV-Rechner bei hohem Einkommen: auch kein «nicht berechtigt» und keine Grenze', () => {
    const html = render(PremiumSubsidy, { data: profil({ finanzen: { monthlyIncome: 20000 } }), onUpdateData: () => {} });
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).not.toContain('premium.notEligible');
    expect(html).not.toContain('ipv.incomeAboveLimit');
  });

  it('Schnellcheck: IPV als Weg «prüfen», Beleg ohne Betrag', () => {
    const html = render(Schnellcheck, { data: nettoProfil() });
    expect(html).toContain('schnellcheck.ipvOhneBetragNote');
    expect(html).toContain('schnellcheck.pruefen');
    expect(html).toContain('beleg.orientierung');
    expect(html).not.toContain('beleg.geschaetzt');
    expect(html).not.toContain(fmt(musterBetrag.amount));
  });

  it('Anspruch-Signale (Anspruch-Check, Kapitel-Ringe) nennen den Weg, ohne Betrag', () => {
    const sig = anspruchSignale(profil());
    expect(JSON.stringify(sig)).toContain('"key":"ipv"');
    expect(JSON.stringify(sig)).not.toMatch(/amount|betrag/i);
  });

  it('Budget: kein Betrag fliesst ins Budget, nur der Hinweis ohne Betrag', () => {
    const b = calculateMonthlyBudget(profil(), t);
    expect(b.ipvRelief).toBe(0);
    expect(b.ipvOrientierung).toBe(true);
    const texte = b.recommendations.map((r) => r.text);
    expect(texte).toContain('budget.ipvHintOhneBetrag');
    expect(texte.some((x) => x.startsWith('budget.ipvHint('))).toBe(false);
    expect(createBudgetReport(profil(), t).details.income.ipvRelief).toBe(0);
  });

  it('IPV-Antrag (JSON): nur Einschätzung, Hinweis und Stelle — kein Betrag, keine Grenze', () => {
    const dok = buildIpvDokument(profil(), t, calculateIPV(profil()));
    expect(dok.result).toEqual({
      belegt: false,
      einschaetzung: 'beim-kanton-pruefen',
      hinweis: 'ipv.orientierungOffen',
      kantonaleStelle: CANTONAL_LINKS.BS.ipv,
    });
    expect(JSON.stringify(dok)).not.toMatch(/amount|annual|maxIncome|subsidy/);
  });

  it('Export-Vorschau nennt «Einschätzung ohne Betrag» statt «geschätzte Verbilligung»', () => {
    const dok = buildIpvDokument(profil(), t, calculateIPV(profil()));
    const ids = leiteKategorienAb('ipvJson', { dokument: dok }).kategorien.map((k) => k.id);
    expect(ids).toContain('ipvOrientierung');
    expect(ids).not.toContain('ipvErgebnis');
    const report = createBudgetReport(profil(), t);
    const bIds = leiteKategorienAb('budgetJson', { report, data: profil() }).kategorien.map((k) => k.id);
    expect(bIds).toContain('ipvOrientierung');
    expect(bIds).not.toContain('ipvErgebnis');
  });

  it('Behörden-Dossier (Druck + JSON): Status als Orientierung, keine Beträge', () => {
    const ipv = calculateIPV(profil());
    const preview = getBehoerdenDossierPreview(profil(), [], t, { ipv });
    const abschnitt = preview.sections.find((s) => s.key === 'ipv');
    expect(abschnitt.status).toBe('ipv.statusOffen');
    expect(abschnitt.rows).toEqual([]);
    const json = generateBehoerdenJSON(profil(), { ipv });
    expect(json.calculations.ipv).toEqual({ eligible: false, belegt: false, einschaetzung: 'beim-kanton-pruefen' });
  });

  it('Finanzübersicht (Karte + Druck): Orientierung statt Betrag oder «nicht berechtigt»', () => {
    const html = render(FinanzUebersicht, { data: profil() });
    expect(html).toContain('ipv.statusOffen');
    expect(html).not.toContain('finanzUebersicht.notEligible');
    expect(html).not.toContain('ipv.incomeAboveLimit');
    const zeilen = druckAbschnitte(t, { income: 2000, canton: 'BS', ipv: calculateIPV(profil()), sozialhilfe: {}, el: {} })
      .flatMap((a) => a.zeilen || a.rows || []);
    const ipvZeile = JSON.stringify(zeilen);
    expect(ipvZeile).toContain('ipv.statusOffen');
    expect(ipvZeile).not.toContain('finanzUebersicht.notEligible');
  });

  it('Sozialhilfe-Ansicht: Orientierung, kein «Berechtigt: CHF …»', () => {
    const html = render(SozialhilfeView, { data: profil() });
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).not.toContain('premium.eligible');
  });

  it('KK-Last-Karte: Orientierung statt Entlastungsbetrag oder «kein Anspruch»', () => {
    const html = render(KKLastCard, { data: profil() });
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).not.toContain('kkLast.ipvRelief');
    expect(html).not.toContain('kkLast.ipvNoClaim');
  });

  it('Dashboard (Kurz-Check): kein IPV-Betrag in der Zeile', () => {
    const html = render(QuickCheck, { data: nettoProfil() });
    expect(html).toContain('dashboard.quickCheckIpv');
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).not.toContain('dashboard.quickCheckResult');
    expect(html).not.toContain('≈ CHF');
  });
});

describe('E9 · belegter Kanton (simuliert): Betrag wie bisher', () => {
  let zuruecksetzen;
  beforeAll(() => { zuruecksetzen = kantoneBelegtSimulieren(['BS']); });
  afterAll(() => zuruecksetzen());

  it('IPV-Rechner zeigt «Berechtigt» und die Beträge', () => {
    const r = calculateIPV(profil());
    const html = render(PremiumSubsidy, { data: profil(), onUpdateData: () => {} });
    expect(html).toContain('premium.eligible');
    expect(html).toContain('premium.monthlySubsidy');
    expect(html).toContain('CHF ' + r.amount);
    expect(html).toContain('premium.maxIncome');
    expect(html).toContain('premium.compareCantons');
    expect(html).not.toContain('ipv.orientierungOffen');
  });

  it('Schnellcheck zeigt den Betrag', () => {
    const html = render(Schnellcheck, { data: nettoProfil() });
    expect(html).toContain(fmt(calculateIPV(profil()).amount));
    expect(html).not.toContain('schnellcheck.ipvOhneBetragNote');
  });

  it('Budget übernimmt die Entlastung', () => {
    const b = calculateMonthlyBudget(profil(), t);
    expect(b.ipvRelief).toBe(calculateIPV(profil()).amount);
    expect(b.ipvOrientierung).toBe(false);
  });

  it('IPV-Antrag und Dossier enthalten den Betrag', () => {
    const ipv = calculateIPV(profil());
    expect(buildIpvDokument(profil(), t, ipv).result.amount).toBe(ipv.amount);
    expect(leiteKategorienAb('ipvJson', { dokument: buildIpvDokument(profil(), t, ipv) }).kategorien.map((k) => k.id)).toContain('ipvErgebnis');
    expect(generateBehoerdenJSON(profil(), { ipv }).calculations.ipv.monthlyAmount).toBe(ipv.amount);
    expect(getBehoerdenDossierPreview(profil(), [], t, { ipv }).sections.find((s) => s.key === 'ipv').status).toBe('premium.eligible');
  });

  it('Finanzübersicht und Dashboard zeigen den Betrag', () => {
    // Geprüft wird der BETRAG, nicht das Zeichen davor. Die erste Fassung
    // verlangte `'✓ '` als Stellvertreter für «berechtigt» — sie wurde rot, als
    // der Haken am 20.09.2026 ein Piktogramm wurde, obwohl die Zahl unverändert
    // dastand. Ein Test soll die Aussage halten, nicht ihre Schreibweise.
    const fu = render(FinanzUebersicht, { data: profil() });
    expect(fu).toContain(fmt(calculateIPV(profil()).amount));
    expect(fu).not.toContain('✓');   // keine rohe Glyphe mehr
    const html = render(QuickCheck, { data: nettoProfil() });
    expect(html).toContain('dashboard.quickCheckResult');
    expect(html).toContain('≈ CHF');
  });
});
