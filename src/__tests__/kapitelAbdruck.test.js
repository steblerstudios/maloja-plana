import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createT } from '../i18n/index.js';
import { getChapters } from '../config/constants.js';
import deTexte from '../i18n/de.js';
import frTexte from '../i18n/fr.js';
import itTexte from '../i18n/it.js';
import enTexte from '../i18n/en.js';
import rmTexte from '../i18n/rm.js';

// ─────────────────────────────────────────────────────────────────────────────
// Abdruck der Kapitel-Tabelle — Netz für Umbauten in config/constants.js
//
// `getChapters(t)` baut jedes Feld jedes Kapitels: Bezeichnung, Typ, Auswahl-
// Optionen, Merkmale (mvo/required/naOk/…). Diese Tabelle ist die empfindlichste
// Datenstruktur der App: ein stiller Fehler zeigt sich nicht als roter Test,
// sondern als falsche oder fehlende Bezeichnung in der Oberfläche — und das in
// fünf Sprachen.
//
// Der Abdruck hält darum fest, was die Tabelle LIEFERT, nicht wie sie
// geschrieben ist (vgl. die Lektion «ein Test, der die Bauweise festschreibt»).
// Er darf sich ändern, sobald ein Feld absichtlich dazukommt oder umbenannt
// wird — dann zeigt der Diff genau das, und die Zeile wird mit der Änderung
// zusammen erneuert:
//
//   ABDRUCK_ERNEUERN=1 npx vitest run src/__tests__/kapitelAbdruck.test.js
//
// Absichtlich NICHT im Abdruck: die Übersetzungstexte selbst wären ein zweiter
// Ort für dieselbe Wahrheit (die i18n-Dateien sind der erste). Festgehalten wird
// die STRUKTUR plus je Feld eine Prüfsumme der Bezeichnung — damit fällt jede
// vertauschte oder verlorene Bezeichnung auf, ohne den Text zu verdoppeln.
// ─────────────────────────────────────────────────────────────────────────────

const hier = dirname(fileURLToPath(import.meta.url));
const abdruckPfad = join(hier, 'kapitelAbdruck.txt');

// createT(translations, lang, anrede) erwartet eine KARTE lang -> Texte und
// greift auf translations[lang] zu; die Rückfall-Sprache muss mit drin sein,
// sonst zählt der Abdruck Lücken als Treffer der Rückfall-Kette.
const alleTexte = { de: deTexte, fr: frTexte, it: itTexte, en: enTexte, rm: rmTexte };
const sprachen = ['de', 'fr', 'it', 'en', 'rm'];

// Kurze, stabile Prüfsumme eines Textes (FNV-1a, 32 bit, hex).
// Reicht, um Vertauschungen zu erkennen, und bleibt in der Datei lesbar kurz.
function summe(wert) {
  const s = wert === undefined ? '\u0000undef' : wert === null ? '\u0000null' : String(wert);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

// Merkmale, die das Verhalten steuern — genau die müssen einen Umbau überleben.
const MERKMALE = [
  'type', 'required', 'mvo', 'recommended', 'naOk', 'naMit', 'naVon',
  'autoComplete', 'section', 'orientation', 'link', 'hint', 'placeholder',
  'rows', 'min', 'max', 'step', 'unit', 'prefix', 'suffix',
];

function zeileFuerFeld(feld) {
  const teile = [`k=${feld.k}`];
  for (const m of MERKMALE) {
    if (!(m in feld)) continue;
    const v = feld[m];
    if (v === undefined) continue;
    // Texte als Prüfsumme, Schalter als Wert
    if (m === 'section' || m === 'orientation' || m === 'hint' || m === 'placeholder') {
      teile.push(`${m}~${summe(v)}`);
    } else if (m === 'link') {
      teile.push(`link~${summe(v && v.url)}`);
    } else {
      teile.push(`${m}=${JSON.stringify(v)}`);
    }
  }
  teile.push(`label~${summe(feld.label)}`);
  if ('sectionIntro' in feld) teile.push(`sectionIntro~${summe(feld.sectionIntro)}`);
  if (Array.isArray(feld.options)) {
    teile.push(`options=${feld.options.length}`);
    teile.push(`optWerte~${summe(feld.options.map((o) => o.value).join('|'))}`);
    teile.push(`optLabels~${summe(feld.options.map((o) => o.label).join('|'))}`);
  }
  // Unerwartete Zusatz-Schlüssel sichtbar machen, statt sie stumm zu übergehen
  const bekannt = new Set([...MERKMALE, 'k', 'label', 'options', 'sectionIntro']);
  const rest = Object.keys(feld).filter((s) => !bekannt.has(s)).sort();
  if (rest.length) teile.push(`weitere=${rest.join('+')}`);
  return teile.join(' ');
}

function abdruckBauen() {
  const zeilen = [];
  for (const lang of sprachen) {
    const t = createT(alleTexte, lang, 'sie');
    const kapitel = getChapters(t);
    zeilen.push(`# ${lang}: ${kapitel.length} Kapitel`);
    for (const ch of kapitel) {
      zeilen.push(
        `${lang} kapitel=${ch.key} title~${summe(ch.title)} short~${summe(ch.short)} ` +
          `description~${summe(ch.description)} felder=${ch.fields.length} docs=${(ch.docs || []).length}`
      );
      for (const feld of ch.fields) zeilen.push(`${lang}   ${zeileFuerFeld(feld)}`);
      for (const d of ch.docs || []) zeilen.push(`${lang}   doc k=${d.k} label~${summe(d.label)}`);
    }
  }
  return zeilen.join('\n') + '\n';
}

describe('Kapitel-Tabelle: Abdruck über fünf Sprachen', () => {
  const jetzt = abdruckBauen();

  it('liefert dieselbe Tabelle wie der festgehaltene Abdruck', () => {
    if (process.env.ABDRUCK_ERNEUERN === '1' || !existsSync(abdruckPfad)) {
      writeFileSync(abdruckPfad, jetzt);
      // Kein stilles Durchwinken: beim Erneuern schlägt der Test bewusst an,
      // damit die neue Datei im Diff gelesen und mitcommittet wird.
      expect(process.env.ABDRUCK_ERNEUERN).toBe('1');
      return;
    }
    expect(jetzt).toBe(readFileSync(abdruckPfad, 'utf8'));
  });

  it('hält die Zusagen, die der Abdruck allein nicht erzwingt', () => {
    for (const lang of sprachen) {
      const t = createT(alleTexte, lang, 'sie');
      for (const ch of getChapters(t)) {
        for (const feld of ch.fields) {
          // Jedes Feld trägt eine Bezeichnung — ausser den Sonderbauten,
          // die ihre Beschriftung selbst mitbringen (z.B. type 'household').
          if (feld.type !== 'household') {
            expect(typeof feld.label, `${lang}/${ch.key}/${feld.k} label`).toBe('string');
            expect(feld.label.length, `${lang}/${ch.key}/${feld.k} label leer`).toBeGreaterThan(0);
            // Der rohe Schlüssel darf nie als Bezeichnung durchschlagen
            expect(feld.label, `${lang}/${ch.key}/${feld.k} unaufgelöst`).not.toMatch(/^chapters\./);
          }
          // Eine Auswahl ohne Optionen ist eine leere Liste in der Oberfläche
          if (feld.type === 'select') {
            expect(Array.isArray(feld.options), `${lang}/${ch.key}/${feld.k} options`).toBe(true);
            expect(feld.options.length, `${lang}/${ch.key}/${feld.k} options leer`).toBeGreaterThan(0);
          }
        }
      }
    }
  });
});
