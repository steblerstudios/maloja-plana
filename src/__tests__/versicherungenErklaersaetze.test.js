import { describe, it, expect } from 'vitest';
import { getChapters } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

// Lebenslagen C5 (Entscheid Stebler Studios 07.11.2026, «Ja, mit Fachprüfung», dann «Ja, bauen»): vier Felder im
// Kapitel Versicherungen bekommen einen Erklärsatz. Wortlaut nach swiss-precision-, rechts- und copy-pruefer, Belege in
// docs/entscheide/versicherungen-erklaersaetze-2026-11.md. Dieser Wächter hält die Aussagen fest, die die Prüfung
// verlangt hat — wer einen Satz kürzt, soll hier merken, was nicht wegfallen darf.
const t = createT({ de }, 'de', 'sie');
const feld = (k) => getChapters(t).find((c) => c.key === 'versicherungen').fields.find((f) => f.k === k);
const satz = (k) => de.orientation[k].sie;

describe('Versicherungen: Erklärsätze nach Prüfung', () => {
  it.each([['liabilityInsurance', 'haftpflicht'], ['householdInsurance', 'hausrat'], ['legalInsurance', 'rechtsschutz'], ['ktg', 'ktg']])(
    'das Feld %s zeigt orientation.%s', (k, schluessel) => {
      expect(feld(k).orientation).toBe(satz(schluessel));
    });

  it('Haftpflicht: nur wofür man haftet, je nach Vertrag, «allgemein» nicht vorgeschrieben, keine unbelegte Häufigkeit', () => {
    expect(satz('haftpflicht')).toMatch(/je nach Vertrag/);
    expect(satz('haftpflicht')).toMatch(/für die Sie haften/);
    expect(satz('haftpflicht')).toMatch(/Allgemein vorgeschrieben ist sie nicht/);
    expect(satz('haftpflicht')).not.toMatch(/oft|meist|freiwillig/);
  });

  it('Hausrat: die Pflicht gilt für Feuer und Naturgefahren, ohne Kantonsnamen', () => {
    expect(satz('hausrat')).toMatch(/gegen Feuer und Naturgefahren Pflicht/);
    expect(satz('hausrat')).toMatch(/je nach Vertrag/);
    expect(satz('hausrat')).not.toMatch(/Waadt|Nidwalden|Vaud/);
  });

  it('Rechtsschutz: die unentgeltliche Rechtspflege muss zurückgezahlt werden', () => {
    expect(satz('rechtsschutz')).toMatch(/unentgeltliche Rechtspflege/);
    expect(satz('rechtsschutz')).toMatch(/zurückgezahlt/);
    expect(satz('rechtsschutz')).toMatch(/Die Versicherung ist freiwillig/);
  });

  it('Krankentaggeld: Arbeits- oder Gesamtarbeitsvertrag, beschränkte Zeit, Selbständige', () => {
    expect(satz('ktg')).toMatch(/Arbeits- oder Gesamtarbeitsvertrag/);
    expect(satz('ktg')).toMatch(/beschränkte Zeit/);
    expect(satz('ktg')).toMatch(/Selbständige erhalten dann nichts/);
  });

  it('der UVG-Satz spricht nicht mehr vom Krankentaggeld (Krankheit gehört nicht in den Unfall-Satz)', () => {
    for (const l of [de, fr, it_, en, rm]) {
      const u = l.orientation.uvg;
      for (const s of typeof u === 'string' ? [u] : [u.sie, u.du]) expect(s).not.toMatch(/KTG|IJM|IGM|Krankentaggeld|sickness/);
    }
  });

  it('alle vier Sätze in fünf Sprachen, Sie und Du wo die Sprache sie kennt', () => {
    for (const l of [de, fr, it_, rm]) for (const k of ['haftpflicht', 'hausrat', 'rechtsschutz', 'ktg']) {
      expect(typeof l.orientation[k].sie, k).toBe('string');
      expect(typeof l.orientation[k].du, k).toBe('string');
    }
    for (const k of ['haftpflicht', 'hausrat', 'rechtsschutz', 'ktg']) expect(typeof en.orientation[k], k).toBe('string');
  });
});
