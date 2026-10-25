// Zweiter Nachtrag (Sophie 25.10.2026: «ok sauber weiter bitte»):
// 1. Schutzschild: Pensionskasse als «trifft nicht zu» markiert, obwohl in der Regel Pflicht → die Lücke bleibt,
//    ein ruhiger Satz sagt warum (BVG Art. 2, 7; Ausnahmen BVV 2 Art. 1j).
// 2. AHV-Orientierung: «Ihr Arbeitgeber zahlt die andere Hälfte» galt nur für Angestellte.
// 3. Italienisch nach fedlex (ZGB Art. 370 «direttive del paziente»); Abschnitt «Vorsorge» it/fr nach dem ZGB-Titel.
import { describe, it, expect } from 'vitest';
import { schildState } from '../data/schutzschild.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

const pflichtig = { employed: true, annualIncome: 80000, lohnBasis: 'brutto' };

describe('Schutzschild · Pensionskasse «trifft nicht zu»', () => {
  it('bei Pflicht: Lücke bleibt, bvgNa gesetzt', () => {
    const st = schildState({ kkInsurer: 'CSS', _na: ['bvgInsurer', 'bvgContribution', 'bvgBalance'] }, pflichtig);
    expect(st.bvgNa).toBe(true);
    expect(st.pflicht.covered).toBeLessThan(st.pflicht.total);
  });
  it('ohne Markierung oder ohne Pflicht: kein Satz', () => {
    expect(schildState({ kkInsurer: 'CSS' }, pflichtig).bvgNa).toBe(false);
    expect(schildState({ kkInsurer: 'CSS', _na: ['bvgInsurer'] }, { employed: true, annualIncome: 10000, lohnBasis: 'brutto' }).bvgNa).toBe(false);
  });
  it('mit erfasster Kasse: kein Satz, auch wenn markiert', () => {
    expect(schildState({ bvgInsurer: 'BVK', _na: ['bvgInsurer'] }, pflichtig).bvgNa).toBe(false);
  });
});

describe('Texte', () => {
  it('AHV-Orientierung nennt Selbständige und Nichterwerbstätige', () => {
    expect(de.orientation.ahvBeitrag.sie).toContain('Selbständige und Nichterwerbstätige zahlen ihren Beitrag in der Regel selbst');
    expect(de.orientation.ahvBeitrag.du).toContain('Als angestellte Person zahlst du');
  });
  it.each(Object.entries({ de, en, fr, it: it_, rm }))('%s: bvgNa und ahvBeitrag vorhanden', (_n, s) => {
    expect(s.schutzschild.bvgNa).toContain('{schwelle}');
    expect(s.orientation.ahvBeitrag.sie && s.orientation.ahvBeitrag.du).toBeTruthy();
  });
  it('Schwelle «mehr als» wie BVG Art. 2 und 7 (Code: >)', () => {
    expect(de.schutzschild.bvgNa).toContain('mehr als CHF {schwelle}');
    expect(rm.schutzschild.bvgNa).toContain('«Na concerna betg»');
  });
  it('Abschnitt Vorsorge im Notfall: ein neutraler Titel je Sprache', () => {
    for (const [s, w] of [[fr, 'Dispositions personnelles'], [it_, 'Disposizioni personali'], [en, 'Personal arrangements']]) {
      expect(s.sections.notfall.provision).toBe(w);
      expect(JSON.stringify(s)).toContain('"sectionProvision":"' + w + '"');
    }
  });
  it('Italienisch: «direttive del paziente» wie ZGB Art. 370; «Direttive anticipate» nur als Titel der ASSM-Richtlinie', () => {
    const roh = JSON.stringify(it_);
    expect(roh.match(/[Dd]irettive anticipate/g)).toEqual(['Direttive anticipate']);
    expect(roh).toContain('«Direttive anticipate»');
  });
});
