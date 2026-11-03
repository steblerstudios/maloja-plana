import { describe, it, expect } from 'vitest';
import { getBehoerdenDossierPreview } from '../dossierGenerator.js';
import { ipvUnterMindestbetrag } from '../config/ipvMindestbetrag.js';
import de from '../i18n/de.js';

// F8-F3: Ein gerechnetes Nein ist kein Entscheid, und unter dem Mindestbetrag kein «kein Anspruch».
const t = (k) => k;
const blatt = (ipv, el) => getBehoerdenDossierPreview({ basis: {}, finanzen: {} }, [], t, { ipv, el });

describe('IPV-Wort im Dossier', () => {
  it('Nein nennt Grund und «kein Entscheid»', () => {
    const a = blatt({ belegt: true, eligible: false, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: 1 } }).sections.find((s) => s.key === 'ipv');
    expect(a.status).toBe('behoerdenDossier.ipvNein');
    expect(a.notes).toEqual(['ipv.incomeAboveLimit']);
  });
  it('Mindestbetrag: keine Auszahlung statt Nein', () => {
    const ipv = { belegt: true, eligible: false, noteKey: 'ipv.luUnterMindestbetrag' };
    expect(ipvUnterMindestbetrag(ipv)).toBe(true);
    expect(blatt(ipv).sections.find((s) => s.key === 'ipv').status).toBe('premium.keineAuszahlung');
  });
  it('EL: bei Rente nie «nur bei AHV- oder IV-Leistung»', () => {
    // Seit 03.11.2026 ist ein Rentenbezug immer «prüfen lassen», nie grün und nie ein «kein Hinweis» aus einer Marge.
    const a = blatt(undefined, { isAHVIV: true, elPruefen: true }).sections.find((s) => s.key === 'el');
    expect(a).toMatchObject({ status: 'sozialhilfe.elPruefen', statusOk: false });
  });
  it('die Grenze trägt Einheit und Bezug', () => {
    expect(de.ipv.incomeAboveLimit).toContain('pro Jahr');
    expect(de.ipv.incomeAboveLimit).toContain('Massgebendes Einkommen');
  });
});
