// Melde-Weg VOR dem Beta-Gate (M-1, 23.09.2026)
//
// Befund vom 23.09.: beide In-App-Melde-Türen (Fusszeile, Fehlerschirm) liegen HINTER
// dem Gate. Wer ohne Code kam, sah nur die Code-Wand; dort führte allein der
// Rechtliches-Link zur Adresse im Impressum — kein benannter Melde-Weg. Die
// öffentlichen Erklärseiten hatten die Adresse als Kontakt, aber ebenfalls keinen
// Meldeweg.
//
// Kein Formular, an keiner der beiden Stellen: das wäre ein Datenabfluss und
// widerspricht local-first / CSP self-only.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import deTexte from '../i18n/de.js';
import enTexte from '../i18n/en.js';
import frTexte from '../i18n/fr.js';
import itTexte from '../i18n/it.js';
import rmTexte from '../i18n/rm.js';

const quelle = (...teile) => fs.readFileSync(path.resolve(__dirname, '..', ...teile), 'utf8');
const gate = quelle('BetaGate.jsx');
const sprachen = fs.readFileSync(path.resolve(__dirname, '..', '..', 'scripts', 'seiten-sprachen.mjs'), 'utf8');
const bauSeiten = fs.readFileSync(path.resolve(__dirname, '..', '..', 'scripts', 'build-seiten.mjs'), 'utf8');

describe('Die Code-Wand nennt einen Melde-Weg', () => {
  it('trägt einen mailto-Link auf dasselbe Postfach wie die Fusszeile', () => {
    expect(gate).toContain('mailto:info@malojaplana.ch');
  });

  it('nutzt denselben Wortlaut wie der Fehlerschirm — eine Zusage, ein Schlüssel', () => {
    expect(gate).toContain("t('error.report')");
    // Kein zweiter Schlüssel für dieselbe Sache (das war die Falle vom 21.09.).
    expect(gate).not.toMatch(/beta\.reportLink|beta\.meldenLink/);
  });

  it('sagt im Entwurf, woher die Meldung kommt', () => {
    expect(gate).toContain('Ansicht: Code-Wand');
  });

  it('ist ein Link, und nichts auf der Wand ruft ins Netz', () => {
    // 🛑 Nicht «kein <form>» prüfen: die Code-Wand HAT eines — die Code-Eingabe
    // (`BetaGate.jsx:106`). Der erste Anlauf dieses Tests war deshalb rot, und der
    // Fehler lag am Messgerät, nicht am Code. Die Zusage ist nicht «kein Formular»,
    // sondern **nichts verlässt das Gerät**: der Melde-Weg ist ein `mailto`-Anker,
    // und auf der ganzen Wand gibt es keinen Netzaufruf.
    const ankerStelle = gate.indexOf('mailto:info@malojaplana.ch');
    expect(gate.lastIndexOf("createElement('a'", ankerStelle)).toBeGreaterThan(-1);
    expect(gate).not.toMatch(/fetch\(|XMLHttpRequest|navigator\.sendBeacon/);
    // Das eine Formular ist die Code-Eingabe und bleibt genau eines.
    expect((gate.match(/createElement\('form'/g) || []).length).toBe(1);
  });

  it('hält das Trefferflächen-Mass (44 px) und setzt die Farbe explizit', () => {
    const block = gate.slice(gate.indexOf('mailto:info@malojaplana.ch'));
    expect(block).toContain("minHeight: '44px'");
    expect(block).toContain('color: palette.mid');
  });
});

describe('Die öffentlichen Erklärseiten nennen einen Melde-Weg', () => {
  it('die Fusszeile trägt den Melde-Link mit Betreff', () => {
    expect(bauSeiten).toContain('R.meldenLink');
    expect(bauSeiten).toMatch(/mailto:info@malojaplana\.ch\?subject=/);
  });

  it('der Text steht in allen fünf Sprachen der Seiten-Quelle', () => {
    const treffer = sprachen.match(/meldenLink:/g) || [];
    expect(treffer.length, 'meldenLink fehlt in einer Sprache').toBe(5);
  });
});

describe('error.report bleibt in allen fünf App-Sprachen vorhanden', () => {
  // Der Gate-Link hängt jetzt daran — fällt der Schlüssel in einer Sprache weg,
  // stünde dort ein leerer Link statt eines Melde-Wegs.
  it('fünf Sprachen, fünf Texte', () => {
    for (const [name, satz] of [['de', deTexte], ['en', enTexte], ['fr', frTexte], ['it', itTexte], ['rm', rmTexte]]) {
      const wert = satz.error.report;
      const text = typeof wert === 'string' ? wert : wert?.sie;
      expect(text, name + ': error.report fehlt').toBeTruthy();
    }
  });

  it('rm nutzt den Hausbegriff «annunziar», nicht eine frische Übersetzung', () => {
    // 28 bestehende Wendungen im rm-Korpus nutzen ihn («Annunziar midadas»,
    // «S’annunziar baud a l’AI» …) — das ist der Beleg, nicht mein Sprachgefühl.
    expect(String(rmTexte.error.report).toLowerCase()).toContain('annunziar');
  });
});
