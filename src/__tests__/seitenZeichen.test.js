import { describe, it, expect } from 'vitest';
import { ABLAEUFE, SEARCH_VIEWS } from '../config/ansichtenRegister.js';
import { WERKZEUGE } from '../data/werkzeugRegister.js';
import { astKapitel, getBereich, getBereichForChapter } from '../data/lebensbereiche.js';
import {
  SEITEN_ZEICHEN, ZEICHEN, GELD, GEWOLLTE_ZWILLINGE, LEITFORM_KAPITEL, leitformFuer, abzeichenFarbe,
} from '../config/seitenZeichen.js';

// Icon-Plan November 2026, Bauplan B1 (Entscheid Stebler Studios 07.11.2026, «Ja, B1 starten»).
// Eine Tabelle sagt für jede Seite: Leitform (aus Kapitel/Ast), Zeichen (Wörterbuch), wer mitspielt.
// Die Regel der Besprechung vom 07.11. als Test: «Farbe aus der Architektur; sehen zwei Seiten
// im selben Menü gleich aus, trägt das Zeichen den Unterschied, nicht eine andere Farbe.»

// Alle Seiten mit Ast aus beiden Registern — `bereich` ist die eine Quelle für Kapitel und Ast.
const SEITEN = new Map();
// Abschnitte einer Kapitelseite (view 'chapter', z. B. Mindestlohn) zählen über ihren Schlüssel.
for (const e of [...ABLAEUFE, ...SEARCH_VIEWS, ...WERKZEUGE]) {
  const k = e.key || e.view;
  if (k && k !== 'chapter' && e.bereich) SEITEN.set(k, e.bereich);
}

describe('B1 · eine Tabelle für alle Seiten', () => {
  it('jede Seite mit Ast steht in der Tabelle, und die Tabelle nennt keine, die es nicht gibt', () => {
    expect(Object.keys(SEITEN_ZEICHEN).sort()).toEqual([...SEITEN.keys()].sort());
  });

  it('jede Seite hat ein Kapitel mit Leitform', () => {
    const ohne = [...SEITEN].filter(([, b]) => !LEITFORM_KAPITEL[astKapitel(b)] || !leitformFuer(b)).map(([v]) => v);
    expect(ohne).toEqual([]);
  });

  it('jedes Zeichen steht im Wörterbuch (null nur für die Seite, die selbst das Kapitel-Bild ist)', () => {
    const falsch = Object.entries(SEITEN_ZEICHEN)
      .filter(([v, e]) => (e.zeichen === null ? v !== 'gesundheit' : !ZEICHEN[e.zeichen]))
      .map(([v, e]) => `${v}: ${e.zeichen}`);
    expect(falsch).toEqual([]);
  });

  it('wer mitspielt, ist ein Ast, Geld oder niemand — und nie der eigene Haupt-Ast des Kapitels (dann: leer)', () => {
    const falsch = Object.entries(SEITEN_ZEICHEN).filter(([v, e]) => {
      if (e.mit === null) return false;
      if (e.mit !== GELD && !getBereich(e.mit)) return true;
      const haupt = getBereichForChapter(astKapitel(SEITEN.get(v)));
      return e.mit !== GELD && haupt && haupt.key === e.mit;
    }).map(([v, e]) => `${v}: ${e.mit}`);
    expect(falsch).toEqual([]);
  });

  it('jede Farbe kommt aus lebensbereiche.js (hell und dunkel)', () => {
    for (const [v, e] of Object.entries(SEITEN_ZEICHEN)) {
      for (const dunkel of [false, true]) {
        expect(abzeichenFarbe(SEITEN.get(v), e.mit, dunkel).farbe, `${v} ${dunkel ? 'dunkel' : 'hell'}`).toMatch(/^#[0-9A-F]{6}$/i);
      }
    }
  });
});

describe('B1 · keine zwei Seiten im selben Kapitel-Menü sehen gleich aus', () => {
  // Gleich = gleiche Leitform, gleiches Zeichen, gleiche Abzeichen-Art und -Farbe (aufgelöst,
  // also fällt auch auf, wenn «Geld» und «Ast Finanzen» dasselbe Gold ergeben).
  const bild = (v) => {
    const b = SEITEN.get(v); const e = SEITEN_ZEICHEN[v]; const f = abzeichenFarbe(b, e.mit);
    return [leitformFuer(b), e.zeichen, f.art, f.farbe].join('|');
  };
  const erlaubt = new Set(GEWOLLTE_ZWILLINGE.map((z) => [...z.seiten].sort().join('+')));

  it('nur die gewollten Zwillinge (mit Entscheid) sehen gleich aus', () => {
    const jeKapitel = {};
    for (const v of Object.keys(SEITEN_ZEICHEN)) {
      const k = astKapitel(SEITEN.get(v));
      (jeKapitel[k] ||= {});
      (jeKapitel[k][bild(v)] ||= []).push(v);
    }
    const zwillinge = Object.values(jeKapitel).flatMap((m) => Object.values(m)).filter((l) => l.length > 1)
      .map((l) => l.sort().join('+')).filter((z) => !erlaubt.has(z));
    expect(zwillinge).toEqual([]);
  });

  it('jeder gewollte Zwilling hat einen Grund und sieht wirklich gleich aus (sonst Eintrag löschen)', () => {
    for (const z of GEWOLLTE_ZWILLINGE) {
      expect(z.grund.length, z.seiten.join('+')).toBeGreaterThan(10);
      expect(new Set(z.seiten.map(bild)).size, z.seiten.join('+')).toBe(1);
    }
  });
});
