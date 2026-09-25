import { describe, it, expect } from 'vitest';
import {
  grundbedarfFuerHaushalt,
  einkommensfreibetrag,
  berechneSozialhilfe,
  vergleicheHaushaltGroessen,
  berechneExistenzminimum,
  vermoegensfreibetragSKOS,
  vermoegensfreibetragKanton,
  rueckerstattungsFreibetrag,
  SKOS_PARAMS,
  SKOS_DATA_VERSION,
  berechneArmutsgrenze,
  ARMUTSGRENZE_PAUSCHALE_AB16,
} from '../sozialhilfeRechner.js';
import { vermoegensfreibetragUnbestaetigt, VFB_UNBESTAETIGT, VFB_UNBESTAETIGT_MIT_KINDERN } from '../vermoegensfreibetragUnbestaetigt.js';

describe('rueckerstattungsFreibetrag — höher als der Bezugs-Freibetrag, ohne Deckel', () => {
  it('Einzelperson 30k, Paar 50k, + 15k pro minderjährigem Kind', () => {
    expect(rueckerstattungsFreibetrag(1, 0)).toBe(30000);
    expect(rueckerstattungsFreibetrag(2, 0)).toBe(50000);
    expect(rueckerstattungsFreibetrag(1, 2)).toBe(60000);
    expect(rueckerstattungsFreibetrag(2, 3)).toBe(95000);
  });
  it('kein Deckel (anders als der Bezugs-Freibetrag mit max. 15k)', () => {
    expect(rueckerstattungsFreibetrag(2, 5)).toBe(125000);
    // Kontrast: der Freibetrag WÄHREND des Bezugs ist bei 15k gedeckelt
    expect(vermoegensfreibetragSKOS(2, 5)).toBe(15000);
  });
  it('robust bei negativen Kinderzahlen', () => {
    expect(rueckerstattungsFreibetrag(1, -3)).toBe(30000);
  });
});

// Vermögensfreibetrag je Kanton (Entscheid 16.09.2026). Sollwerte aus
// docs/sources/skos-vermoegensfreibetrag-2026.md (PR #166), dort je Kanton mit Zitat.
describe('vermoegensfreibetragKanton — je Kanton, gekennzeichnet', () => {
  // [Einzel, Paar, Paar + 1 Kind, Paar mit vielen Kindern (= Höchstbetrag)]
  const eigeneZahl = {
    AG: [1500, 3000, 4500, 4500],     // «pro Person 1'500, max. 4'500 pro Unterstützungseinheit» (§ 11 Abs. 4 SPV)
    SH: [2000, 4000, 4000, 4000],     // Einzel 2'000 / Paar 4'000; Kind + Max nicht geregelt (Ziff. D.6.1)
    SO: [2000, 4000, 5000, 5000],     // 2'000/4'000/+1'000/max. 5'000 (§ 93 Abs. 1 Bst. j SV)
    BE: [4000, 8000, 10000, 10000],   // 4'000/8'000/+2'000/max. 10'000 (Art. 8n SHV)
    NE: [4000, 8000, 10000, 10000],   // Art. 18 ANCAM
    GE: [4000, 8000, 10000, 10000],   // Art. 3 RASLP
    BS: [8000, 16000, 20000, 20000],  // 8'000/16'000/+4'000/max. 20'000 (WSU-Richtlinien Ziff. 14)
  };
  for (const [kt, [einzel, paar, paarKind, max]] of Object.entries(eigeneZahl)) {
    it(`${kt}: eigene kantonale Zahl, ohne Kinder nicht gekennzeichnet`, () => {
      expect(vermoegensfreibetragKanton(kt, 1, 0)).toBe(einzel);
      expect(vermoegensfreibetragKanton(kt, 2, 0)).toBe(paar);
      expect(vermoegensfreibetragKanton(kt, 2, 1)).toBe(paarKind);
      expect(vermoegensfreibetragKanton(kt, 2, 6)).toBe(max);
      expect(vermoegensfreibetragUnbestaetigt(kt)).toBe(false);
      expect(vermoegensfreibetragUnbestaetigt(kt, 2)).toBe(VFB_UNBESTAETIGT_MIT_KINDERN.includes(kt));
    });
  }

  it('SH und AG: Kennzeichnung nur für Haushalte mit minderjährigen Kindern (Kinder-Regel gedeutet)', () => {
    for (const kt of VFB_UNBESTAETIGT_MIT_KINDERN) {
      expect(vermoegensfreibetragUnbestaetigt(kt), kt).toBe(false);
      expect(vermoegensfreibetragUnbestaetigt(kt, 0), kt).toBe(false);
      expect(vermoegensfreibetragUnbestaetigt(kt, 1), kt).toBe(true);
      expect(vermoegensfreibetragUnbestaetigt(kt, 3), kt).toBe(true);
    }
    expect([...VFB_UNBESTAETIGT_MIT_KINDERN].sort()).toEqual(['AG', 'SH']);
    // Rechnung unverändert: SH ohne Kinderzuschlag, AG +1'500 je Kind bis 4'500
    expect(vermoegensfreibetragKanton('SH', 1, 2)).toBe(2000);
    expect(vermoegensfreibetragKanton('AG', 1, 1)).toBe(3000);
    // Andere Kantone mit eigener Zahl bleiben auch mit Kindern ungekennzeichnet
    expect(vermoegensfreibetragUnbestaetigt('BE', 2)).toBe(false);
  });

  it('SO: Einzelperson mit Kindern staffelt bis zum Höchstbetrag', () => {
    expect(vermoegensfreibetragKanton('SO', 1, 2)).toBe(4000);  // 2'000 + 2×1'000
    expect(vermoegensfreibetragKanton('SO', 1, 4)).toBe(5000);  // gedeckelt
  });

  // ZH/GR/JU/VS: eigene Zahl = SKOS D.3.1; ZG/SZ/LU/NW/GL/TG/AR/UR: Verweis auf SKOS
  const skosKantone = ['ZH', 'GR', 'JU', 'VS', 'ZG', 'SZ', 'LU', 'NW', 'GL', 'TG', 'AR', 'UR'];
  it.each(skosKantone)('%s: SKOS-Standard 6000/12000/+3000/max. 15000, nicht gekennzeichnet', (kt) => {
    expect(vermoegensfreibetragKanton(kt, 1, 0)).toBe(6000);
    expect(vermoegensfreibetragKanton(kt, 2, 0)).toBe(12000);
    expect(vermoegensfreibetragKanton(kt, 1, 1)).toBe(9000);
    expect(vermoegensfreibetragKanton(kt, 2, 3)).toBe(15000);
    expect(vermoegensfreibetragUnbestaetigt(kt)).toBe(false);
  });

  it('ohne oder mit unbekanntem Kanton: SKOS-Empfehlung, nicht gekennzeichnet', () => {
    expect(vermoegensfreibetragKanton('', 2, 1)).toBe(15000);
    expect(vermoegensfreibetragKanton(undefined, 1, 0)).toBe(6000);
    expect(vermoegensfreibetragKanton('XX', 2, 0)).toBe(12000);
    expect(vermoegensfreibetragSKOS(2, 0)).toBe(12000);
    expect(vermoegensfreibetragUnbestaetigt('')).toBe(false);
    expect(vermoegensfreibetragUnbestaetigt(undefined)).toBe(false);
  });

  it('unbestätigte Kantone tragen die Kennzeichnung; Einzelbetrag = SKOS-Karte (Stand 1.1.2026)', () => {
    const karte = { BL: 2200, SG: 2500, FR: 4000, VD: 4000, AI: 6000, OW: 6000, TI: 10000 };
    for (const [kt, einzel] of Object.entries(karte)) {
      expect(vermoegensfreibetragUnbestaetigt(kt)).toBe(true);
      expect(vermoegensfreibetragUnbestaetigt(kt, 2)).toBe(true);
      expect(vermoegensfreibetragKanton(kt, 1, 0)).toBe(einzel);
    }
    expect([...VFB_UNBESTAETIGT].sort()).toEqual(Object.keys(karte).sort());
  });

  it('unbestätigte Kantone: Staffel nur, wo das Beleg-Dokument sie nennt', () => {
    // SG: Beiblatt KOS-Handbuch (Stadt Wil) 2'500/5'000/+1'250/max. 6'250
    expect(vermoegensfreibetragKanton('SG', 2, 1)).toBe(6250);
    expect(vermoegensfreibetragKanton('SG', 1, 1)).toBe(3750);
    // FR/VD: veraltete Quelle 4'000/8'000/+2'000/max. 10'000
    expect(vermoegensfreibetragKanton('FR', 2, 3)).toBe(10000);
    expect(vermoegensfreibetragKanton('VD', 1, 1)).toBe(6000);
    // AI/OW: Kartenwert = SKOS-Einzelbetrag → SKOS-Staffel
    expect(vermoegensfreibetragKanton('AI', 2, 1)).toBe(15000);
    // BL/TI: keine Staffel belegt → nur der Einzelbetrag, für jede Haushaltsgrösse
    expect(vermoegensfreibetragKanton('BL', 2, 2)).toBe(2200);
    expect(vermoegensfreibetragKanton('TI', 2, 2)).toBe(10000);
  });

  it('berechneSozialhilfe rechnet mit dem Kantonswert', () => {
    const basis = { adults: 2, kinderImHaushalt: 1, miete: 1200, krankenkassePraemie: 400, vermoegen: 9000 };
    const be = berechneSozialhilfe({ ...basis, kanton: 'BE' });
    expect(be.vermoegensfreibetrag).toBe(10000);
    expect(be.anrechenbaresVermoegen).toBe(0);
    const ag = berechneSozialhilfe({ ...basis, kanton: 'AG' });
    expect(ag.vermoegensfreibetrag).toBe(4500);
    expect(ag.anrechenbaresVermoegen).toBe(4500);
    expect(ag.hatAnspruch).toBe(false);
    const ti = berechneSozialhilfe({ ...basis, kanton: 'TI' });
    expect(ti.vermoegensfreibetrag).toBe(10000);
    expect(berechneSozialhilfe(basis).vermoegensfreibetrag).toBe(15000); // ohne Kanton: SKOS
  });
});

describe('SKOS_PARAMS', () => {
  it('exports version and key constants', () => {
    expect(SKOS_DATA_VERSION).toBe('2026-01');
    expect(SKOS_PARAMS.gblEinperson).toBe(1061);
    expect(SKOS_PARAMS.efbMax).toBe(400); // vorsichtig, Regel BS (data/sozialhilfeKern.js)
    expect(SKOS_PARAMS.izuStandard).toBe(100);
    expect(SKOS_PARAMS.franchiseStandard).toBe(300);
  });
});

describe('grundbedarfFuerHaushalt', () => {
  it('returns correct GBL for 1–7 persons', () => {
    expect(grundbedarfFuerHaushalt(1)).toBe(1061);
    expect(grundbedarfFuerHaushalt(2)).toBe(1624);
    expect(grundbedarfFuerHaushalt(3)).toBe(1974);
    expect(grundbedarfFuerHaushalt(4)).toBe(2271);
    expect(grundbedarfFuerHaushalt(5)).toBe(2568);
    expect(grundbedarfFuerHaushalt(6)).toBe(2784);
    expect(grundbedarfFuerHaushalt(7)).toBe(3000);
  });

  it('adds CHF 216 per person beyond 7', () => {
    expect(grundbedarfFuerHaushalt(8)).toBe(3216);
    expect(grundbedarfFuerHaushalt(10)).toBe(3648);
  });

  it('returns 0 for invalid input', () => {
    expect(grundbedarfFuerHaushalt(0)).toBe(0);
    expect(grundbedarfFuerHaushalt(-1)).toBe(0);
  });
});

describe('einkommensfreibetrag', () => {
  it('returns 0 for no income', () => {
    expect(einkommensfreibetrag(0)).toBe(0);
    expect(einkommensfreibetrag(-500)).toBe(0);
  });

  it('ein Drittel des Erwerbseinkommens (BS URL 2026 Ziff. 12.1)', () => {
    expect(einkommensfreibetrag(900)).toBe(300);
  });

  it('höchstens 400 (BS; SKOS-Untergrenze für eine Vollanstellung, D.2 Abs. 3)', () => {
    expect(einkommensfreibetrag(5000)).toBe(400);
  });

  it('nie höher als der Lohn selbst (Fachprüfung zu PR #389)', () => {
    for (const lohn of [1, 100, 300, 399]) expect(einkommensfreibetrag(lohn)).toBeLessThan(lohn + 1);
  });
});

describe('berechneSozialhilfe', () => {
  it('calculates basic case: single person, no income', () => {
    const r = berechneSozialhilfe({
      haushaltGroesse: 1,
      miete: 1200,
      krankenkassePraemie: 380,
    });
    expect(r.gbl).toBe(1061);
    expect(r.wohnkosten).toBe(1200);
    expect(r.bedarf).toBe(1061 + 1200 + 380);
    expect(r.sozialhilfeAnspruch).toBe(r.bedarf);
    expect(r.hatAnspruch).toBe(true);
  });

  it('reduces support by earned income minus EFB', () => {
    const r = berechneSozialhilfe({
      haushaltGroesse: 1,
      miete: 1200,
      krankenkassePraemie: 380,
      erwerbseinkommen: 2000,
      erwerbstaetig: true,
    });
    const efb = einkommensfreibetrag(2000);
    expect(r.efb).toBe(efb);
    expect(r.anrechenbaresEinkommen).toBe(2000 - efb);
    expect(r.sozialhilfeAnspruch).toBe(r.bedarf - r.anrechenbaresEinkommen);
  });

  it('adds IZU for integration measures (non-employed)', () => {
    const r = berechneSozialhilfe({
      haushaltGroesse: 1,
      miete: 1200,
      krankenkassePraemie: 380,
      integrationsMassnahme: true,
      erwerbstaetig: false,
    });
    expect(r.izu).toBe(100);
    expect(r.totalUnterstuetzung).toBe(r.sozialhilfeAnspruch + 100);
  });

  it('no IZU when employed', () => {
    const r = berechneSozialhilfe({
      haushaltGroesse: 1,
      miete: 1200,
      krankenkassePraemie: 380,
      integrationsMassnahme: true,
      erwerbstaetig: true,
      erwerbseinkommen: 1000,
    });
    expect(r.izu).toBe(0);
  });

  it('denies claim when assets exceed Vermögensfreibetrag', () => {
    const r = berechneSozialhilfe({
      haushaltGroesse: 1,
      miete: 1200,
      krankenkassePraemie: 380,
      vermoegen: 10000,
    });
    expect(r.vermoegensfreibetrag).toBe(6000); // SKOS D.3.1 Einzelperson
    expect(r.anrechenbaresVermoegen).toBe(4000);
    expect(r.hatAnspruch).toBe(false);
  });

  it('Vermögensfreibetrag scales with household size', () => {
    const r = berechneSozialhilfe({
      haushaltGroesse: 4,
      miete: 1800,
      krankenkassePraemie: 500,
      vermoegen: 8000,
    });
    expect(r.vermoegensfreibetrag).toBe(15000); // 6000 + 3×3000 → 15000
    expect(r.hatAnspruch).toBe(true);
  });

  it('no claim when income exceeds needs', () => {
    const r = berechneSozialhilfe({
      haushaltGroesse: 1,
      miete: 1000,
      krankenkassePraemie: 300,
      erwerbseinkommen: 5000,
      erwerbstaetig: true,
    });
    expect(r.sozialhilfeAnspruch).toBe(0);
    expect(r.hatAnspruch).toBe(false);
  });

  it('handles family of 4', () => {
    const r = berechneSozialhilfe({
      haushaltGroesse: 4,
      miete: 1800,
      krankenkassePraemie: 800,
      erwerbseinkommen: 3000,
      erwerbstaetig: true,
      kinderImHaushalt: 2,
    });
    expect(r.gbl).toBe(2271);
    expect(r.bedarf).toBe(2271 + 1800 + 800);
    expect(r.kinderImHaushalt).toBe(2);
    expect(r.sozialhilfeAnspruch).toBeGreaterThan(0);
  });
});

describe('vergleicheHaushaltGroessen', () => {
  it('returns 7 entries with decreasing per-person GBL', () => {
    const vgl = vergleicheHaushaltGroessen(1200, 380);
    expect(vgl).toHaveLength(7);
    expect(vgl[0].personen).toBe(1);
    expect(vgl[0].gbl).toBe(1061);
    for (let i = 1; i < vgl.length; i++) {
      expect(vgl[i].gblProPerson).toBeLessThan(vgl[i - 1].gblProPerson);
    }
  });
});

describe('berechneExistenzminimum', () => {
  it('sums GBL + Miete + KVG', () => {
    const r = berechneExistenzminimum({
      haushaltGroesse: 2,
      miete: 1500,
      krankenkassePraemie: 600,
    });
    expect(r.gbl).toBe(1624);
    expect(r.existenzminimum).toBe(1624 + 1500 + 600);
    expect(r.existenzminimumJahr).toBe(r.existenzminimum * 12);
  });
});

describe('berechneArmutsgrenze — BFS-Methodik (Grundbedarf + Wohnkosten + 100/Person ab 16)', () => {
  it('Pauschale: CHF 100 pro Person ab 16, sonst nichts', () => {
    expect(ARMUTSGRENZE_PAUSCHALE_AB16).toBe(100);
    expect(berechneArmutsgrenze({ grundbedarf: 0, personenAb16: 1 })).toBe(100);
    expect(berechneArmutsgrenze({ grundbedarf: 0, personenAb16: 2 })).toBe(200);
    expect(berechneArmutsgrenze({ grundbedarf: 0, personenAb16: 0 })).toBe(0);
    expect(berechneArmutsgrenze({ grundbedarf: 0, personenAb16: -1 })).toBe(0); // Guard
  });

  it('Einzelperson: Grundbedarf + effektive Miete + 100', () => {
    expect(berechneArmutsgrenze({ grundbedarf: 1061, effektiveWohnkosten: 1200, personenAb16: 1 }))
      .toBe(1061 + 1200 + 100); // 2361
  });

  it('reproduziert den BFS-Durchschnitt 2024 (CHF 2388, Einzelperson) bei mittlerer Miete', () => {
    // BFS «Armut in der Schweiz», Ø 2024: Einzelperson CHF 2388/Monat.
    // SKOS-Grundbedarf 1061 + 100 Pauschale → CHF 1227 mittlere Wohnkosten.
    expect(berechneArmutsgrenze({ grundbedarf: 1061, effektiveWohnkosten: 1227, personenAb16: 1 }))
      .toBe(2388);
  });

  it('zwei Erwachsene: Pauschale zählt pro Person ab 16 (2×100)', () => {
    expect(berechneArmutsgrenze({ grundbedarf: 1624, effektiveWohnkosten: 1500, personenAb16: 2 }))
      .toBe(1624 + 1500 + 200);
  });

  it('Guards: negative/fehlende Bausteine ergeben nie Negatives', () => {
    expect(berechneArmutsgrenze({ grundbedarf: -5, effektiveWohnkosten: -10, personenAb16: -1 })).toBe(0);
    expect(berechneArmutsgrenze({})).toBe(100); // personenAb16 default 1 → nur Pauschale
  });
});

