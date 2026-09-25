// Gate 24.09.2026 (0.1.40-beta) · Konkubinat mit Kindern: der Kinderabzug ist ganz der Person
// zugerechnet. Nach ESTV-Kreisschreiben Nr. 30, Ziff. 14.8.1 (unverheiratete Eltern im gemeinsamen
// Haushalt, gemeinsame elterliche Sorge, keine Unterhaltszahlungen) kann jeder Elternteil «je den
// halben Kinderabzug» geltend machen. Die App kennt die Sorge nicht und rechnet den ganzen Abzug —
// das muss neben der Zahl stehen, wie die Einzelbesteuerung (K62.1).
import { describe, it, expect } from 'vitest';
import { steuernFuerProfil } from '../data/kantonaleSteuerdaten.js';
import { annahmenTexte } from '../utils/steuerTexte.js';
import { generateBehoerdenJSON, STEUER_KENNUNG } from '../dossierGenerator.js';

const t = (k) => k;
const fall = {
  kanton: 'ZH', nettolohnJahr: 70000, verheiratet: false, konkubinat: true,
  kinder: 2, elterntarif: true, partnerEinkommen: 0, partnerAngegeben: true,
};

describe('Konkubinat mit Kindern · Annahme «Kinderabzug ganz bei Ihnen»', () => {
  it('die Rechnung meldet die Annahme', () => {
    const s = steuernFuerProfil(fall);
    expect(s.bund).not.toBeNull();
    expect(s.annahmen.kinderabzugGanz).toBe(true);
  });

  it('sie erscheint als Satz neben der Einzelbesteuerung', () => {
    const s = steuernFuerProfil(fall);
    expect(annahmenTexte(t, s.annahmen)).toEqual(['tax.annahmeEinzeln', 'tax.annahmeKinderabzugKonkubinat']);
  });

  it('und in der Dossier-Datei mit eigener Kennung', () => {
    // K125: ZH zeigt im Konkubinat mit Kindern keine Kantonszahl mehr, und die Bundessteuer ist hier 0 —
    // ohne beides kein Steuerblock im Dossier. Beispiel darum AG («ganz»-Kanton).
    const s = steuernFuerProfil({ ...fall, kanton: 'AG' });
    const json = generateBehoerdenJSON({}, { tax: { total: s.bund.steuer, annahmen: s.annahmen, kantonal: s.kanton.kantonal, basis: 'estv' } }, t).calculations.tax;
    expect(json.assumptions).toContainEqual({ code: 'kinderabzug_ganz_konkubinat', text: 'behoerdenDossier.jsonTexte.annahmeKinderabzugKonkubinat' });
    expect(STEUER_KENNUNG.annahmeKinderabzugKonkubinat).toBe('kinderabzug_ganz_konkubinat');
  });

  it('nicht ohne Kinder, nicht verheiratet, nicht alleinstehend', () => {
    expect(steuernFuerProfil({ ...fall, kinder: 0, elterntarif: false }).annahmen.kinderabzugGanz).toBe(false);
    expect(steuernFuerProfil({ ...fall, konkubinat: false }).annahmen.kinderabzugGanz).toBe(false);
    expect(steuernFuerProfil({ ...fall, konkubinat: false, verheiratet: true }).annahmen.kinderabzugGanz).toBe(false);
  });

  it('nicht bei einem direkt eingetragenen Wert aus der Veranlagung (dort ist der Abzug schon verteilt)', () => {
    const s = steuernFuerProfil({ ...fall, direktSteuerbar: 60000, direktKinder: 2, direktVerheiratet: false });
    expect(s.quelle).toBe('direkt');
    expect(s.annahmen.kinderabzugGanz).toBe(false);
  });
});
