import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { generateBehoerdenDossier, getLebensMappePreview, generateLebensmappe, getNotfallDossierPreview } from '../dossierGenerator.js';
import { getChapters } from '../config/constants.js';
import { DEMO_DATA } from '../config/demoData.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { VorsorgeRechner } from '../VorsorgeRechner.jsx';

// Fassung 8, Besprechen-Punkte entschieden von Stebler Studios am 05.11.2026 («Alle so übernehmen»).
// Geprüft wird, was gedruckt oder angezeigt wird, nicht die Hilfsfunktion.
const SPRACHEN = { de, en, fr, it: itTranslations, rm };
const t = createT(SPRACHEN, 'de');
const chapters = getChapters(t);
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });

describe('F8-P1 · Blatt fürs Amt ohne App-Anleitung', () => {
  const calc = { tax: { total: 4200, taxableIncome: 61000, taxableQuelle: 'estv', kantonal: null, annahmen: { ohneDreizehnten: true }, kantonOhneZahl: false } };
  const html = generateBehoerdenDossier(DEMO_DATA, chapters, t, calc);

  it('nennt die Annahme, aber nicht, wo man sie in der App angibt', () => {
    expect(html).toContain('Ohne 13. Monatslohn gerechnet — mit einem 13. Monatslohn liegt die Steuer höher.');
    expect(html).not.toMatch(/Angeben lässt sich/);
    expect(html).not.toMatch(/im Kapitel «Finanzen/);
  });

  it('die App selbst behält den Hinweis', () => {
    expect(t('tax.annahmeOhneDreizehnten')).toContain('Angeben lässt sich das im Kapitel');
  });

  it('der Blatt-Satz besteht in allen Sprachen', () => {
    for (const [l, d] of Object.entries(SPRACHEN)) expect(d.tax.annahmeOhneDreizehntenBlatt, l).toBeTruthy();
  });
});

describe('F8-P2 · Patientenverfügung «Noch nicht» ist eine Antwort', () => {
  it('Maria hat «nein» angegeben, das Dossier zeigt es wie das Kapitel', () => {
    expect(DEMO_DATA.notfall.patientenverfuegung).toBe('no');
    const v = getNotfallDossierPreview(DEMO_DATA, chapters, t);
    const zeile = v.sections.flatMap((s) => s.rows).find((r) => r.feld === 'notfall.patientenverfuegung');
    expect(zeile.value).toBe(t('chapters.notfall.fields.patientenverfuegung.options.no'));
  });

  it('ohne Antwort wird nichts gedruckt', () => {
    const daten = { ...DEMO_DATA, notfall: { ...DEMO_DATA.notfall, patientenverfuegung: '' } };
    const v = getNotfallDossierPreview(daten, chapters, t);
    expect(v.sections.flatMap((s) => s.rows).some((r) => r.feld === 'notfall.patientenverfuegung')).toBe(false);
  });
});

describe('F8-P3 · Lebensmappe: Arbeitgeber einmal, Gesundheit nur als Verweis', () => {
  const v = getLebensMappePreview(DEMO_DATA, chapters, t, []);
  const alle = v.sections.flatMap((s) => s.rows.map((r) => r.value));

  it('Maria: Kantonsspital Zürich steht einmal', () => {
    expect(alle.filter((w) => w === 'Kantonsspital Zürich')).toHaveLength(1);
  });

  it('ein anderer Arbeitgeber in Ausbildung & Beruf bleibt sichtbar', () => {
    const daten = { ...DEMO_DATA, ausbildung: { ...DEMO_DATA.ausbildung, employer: 'Lehrbetrieb Muster AG' } };
    const w = getLebensMappePreview(daten, chapters, t, []).sections.flatMap((s) => s.rows.map((r) => r.value));
    expect(w).toContain('Kantonsspital Zürich');
    expect(w).toContain('Lehrbetrieb Muster AG');
  });

  it('keine Gesundheitsdaten, aber der Verweis aufs Notfall-Dossier', () => {
    const html = generateLebensmappe(DEMO_DATA, chapters, t, []);
    expect(html).not.toContain('Penicillin');
    expect(html).not.toContain('Euthyrox');
    expect(html).toContain('Blutgruppe, Allergien und Medikamente stehen im Notfall-Dossier.');
    expect(html).not.toContain('alle wichtigen Angaben');
  });

  it('ohne Gesundheitsangaben kein Verweis', () => {
    const nf = { ...DEMO_DATA.notfall, bloodType: '', allergies: '', medications: '', medicationsList: [] };
    const html = generateLebensmappe({ ...DEMO_DATA, notfall: nf }, chapters, t, []);
    expect(html).not.toContain('stehen im Notfall-Dossier');
  });
});

describe('F8-R1 · keine Fachwörter Break-even und KVG-Tracker', () => {
  const texte = (o) => (typeof o === 'string' ? [o] : o && typeof o === 'object' ? Object.values(o).flatMap(texte) : []);
  for (const [l, d] of Object.entries(SPRACHEN)) {
    it(l, () => {
      const alle = texte(d);
      expect(alle.filter((s) => /break-even/i.test(s)), l).toEqual([]);
      expect(alle.filter((s) => /KVG-Tracker|tracker LAMal|health insurance tracker/i.test(s)), l).toEqual([]);
    });
  }
  it('Referenz heisst jetzt, was es ist: der Tarif der eigenen Kasse', () => {
    expect(de.vu.referenz).toBe('Tarif der Kasse CHF {betrag}');
  });
});

describe('F8-V1 · Vorsorge-Rechner schlägt das geschätzte Brutto vor, übernimmt es aber nicht', () => {
  const render = (data) => renderToStaticMarkup(React.createElement(VorsorgeRechner, { palette, t, data, onNavigate: () => {}, onUpdateData: () => {} }));
  const LOHN = 5137; // netto, unverwechselbar

  it('netto erfasst: Feld leer, Vorschlag mit Knopf und «Schätzung»', () => {
    const html = render({ ...DEMO_DATA, finanzen: { ...DEMO_DATA.finanzen, monthlyIncome: LOHN, incomeType: 'netto' } });
    expect(html).toContain('data-vr-vorschlag');
    expect(html).toContain('Schätzung übernehmen');
    expect(html).toContain('Geschätzt aus dem Nettolohn im Profil (CHF 5’137 im Monat)');
    // nichts automatisch im Feld: kein value mit dem Vorschlag
    const betrag = /rund CHF ([\d’]+) brutto im Jahr/.exec(html)[1].replace(/’/g, '');
    expect(Number(betrag)).toBeGreaterThan(LOHN * 12);
    expect(html).not.toContain(`value="${betrag}"`);
  });

  it('brutto erfasst: vorbefüllt wie bisher, kein Vorschlag', () => {
    const html = render({ ...DEMO_DATA, finanzen: { ...DEMO_DATA.finanzen, monthlyIncome: LOHN, incomeType: 'brutto', dreizehnter: 'no' } });
    expect(html).toContain(`value="${LOHN * 12}"`);
    expect(html).not.toContain('data-vr-vorschlag');
  });

  it('Art offen: kein Vorschlag (Einkommensart nicht geraten)', () => {
    const html = render({ ...DEMO_DATA, finanzen: { ...DEMO_DATA.finanzen, monthlyIncome: LOHN, incomeType: '' } });
    expect(html).not.toContain('data-vr-vorschlag');
  });

  it('die Texte bestehen in allen Sprachen', () => {
    for (const [l, d] of Object.entries(SPRACHEN)) {
      expect(d.vr.bruttoVorschlag, l).toContain('{betrag}');
      expect(d.vr.bruttoUebernehmen, l).toBeTruthy();
    }
  });
});
