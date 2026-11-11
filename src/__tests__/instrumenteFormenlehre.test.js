// Formenlehre der Instrumente (Brand Book §7f; Matrix 10.11.2026 §6 Regel 2 + 3; Stebler Studios 11.11.2026
// «und die instrumenten logik»). Die Frage wählt die Form, der Ort nur die Grösse; eine Rechnung je Wahrheit;
// jedes Instrument hat ein Zuhause. Das Register steht in docs/brand/instrumente-register.json.
// Bekannte Abweichungen stehen dort unter «offen» und dürfen nur weniger werden (Sperrklinke).
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const wurzel = fileURLToPath(new URL('../../', import.meta.url));
const register = JSON.parse(readFileSync(wurzel + 'docs/brand/instrumente-register.json', 'utf8'));
const { formen, bereichsbilder, instrumente, offen } = register;

// Die Kapitelzeile aus dem Code, nicht aus dem Register: so fällt ein neues Instrument ohne Eintrag auf.
const dashboard = readFileSync(wurzel + 'src/Dashboard.jsx', 'utf8');
const zeile = dashboard.match(/const INSTRUMENTE_JE_KAPITEL = (\{[^\n]*\});/);
const jeKapitel = Function('return ' + zeile[1])();
const imCode = Object.entries(jeKapitel).flatMap(([kapitel, keys]) => keys.map((key) => [key, kapitel]));

// Sperrklinke: die Zahl der offenen Punkte darf nur sinken. Wer einen behebt, senkt die Zahl hier.
const HOECHSTENS = { formAbweichung: 5, ohneRechnung: 2, zuhauseAnderesBild: 1, ohneZuhause: 9 };

describe('Formenlehre: jedes Instrument steht im Register', () => {
  it('jedes Instrument der Kapitelzeile hat einen Eintrag, im richtigen Kapitel', () => {
    expect(imCode.length).toBeGreaterThan(0);
    for (const [key, kapitel] of imCode) {
      expect(instrumente[key], key).toBeDefined();
      expect(instrumente[key].kapitel, key).toBe(kapitel);
    }
  });
  it('kein Eintrag ohne Instrument (kein toter Eintrag)', () => {
    const keys = new Set(imCode.map(([key]) => key));
    for (const key of Object.keys(instrumente)) expect(keys.has(key), key).toBe(true);
  });
});

describe('Formenlehre: die Frage wählt die Form', () => {
  it('jede Frage-Art ist bekannt', () => {
    for (const [key, i] of Object.entries(instrumente)) expect(Object.keys(formen), key).toContain(i.frage);
  });
  it('Form = gemeinsame Form der Frage, oder ein Bild aus dem Lebensbereich für dieselbe Frage, oder eine benannte Abweichung', () => {
    for (const [key, i] of Object.entries(instrumente)) {
      const passt = i.form === formen[i.frage] || (bereichsbilder[i.frage] || []).includes(i.form);
      if (!passt) expect(offen.formAbweichung[key], key + ': ' + i.form + ' passt nicht zu «' + i.frage + '»').toBeTruthy();
    }
  });
  it('ein Bild, eine Bedeutung: dieselbe Form trägt nie zwei Frage-Arten', () => {
    const frageJeForm = {};
    for (const [key, i] of Object.entries(instrumente)) {
      frageJeForm[i.form] ??= i.frage;
      expect(frageJeForm[i.form], key + ' (' + i.form + ')').toBe(i.frage);
    }
  });
  it('ein Bild aus dem Lebensbereich gehört zu genau einer Frage-Art', () => {
    const alle = Object.values(bereichsbilder).flat();
    expect(new Set(alle).size).toBe(alle.length);
    for (const bild of alle) expect(Object.values(formen), bild).not.toContain(bild);
  });
});

describe('Formenlehre: eine Rechnung je Wahrheit', () => {
  it('jede genannte Rechnung gibt es als Export', async () => {
    for (const [key, i] of Object.entries(instrumente)) {
      if (i.rechnung == null) { expect(offen.ohneRechnung[key], key + ' ohne Rechnung').toBeTruthy(); continue; }
      const [datei, fn] = i.rechnung.split('#');
      expect(existsSync(wurzel + datei), key + ': ' + datei).toBe(true);
      const mod = await import(/* @vite-ignore */ wurzel + datei);
      expect(typeof mod[fn], key + ': ' + i.rechnung).toBe('function');
    }
  });
  it('die Kachel ruft genau diese Rechnung auf (im Panel oder, als Eingabe gereicht, im Dashboard)', () => {
    const panel = readFileSync(wurzel + 'src/components/InstrumentePanel.jsx', 'utf8') + dashboard;
    for (const [key, i] of Object.entries(instrumente)) {
      if (i.rechnung == null) continue;
      expect(panel, key + ': ' + i.rechnung).toMatch(new RegExp('\\b' + i.rechnung.split('#')[1] + '\\('));
    }
  });
});

describe('Formenlehre: jedes Instrument hat ein Zuhause', () => {
  it('Zuhause ist das eigene Kapitel, oder es fehlt benannt', () => {
    for (const [key, i] of Object.entries(instrumente)) {
      if (i.zuhause == null) expect(offen.ohneZuhause[key], key + ' ohne Zuhause').toBeTruthy();
      else expect(i.zuhause, key).toBe(i.kapitel);
    }
  });
});

describe('Formenlehre: offene Punkte werden nur weniger (Sperrklinke)', () => {
  it('jede Liste hat höchstens so viele Einträge wie bisher', () => {
    for (const [liste, n] of Object.entries(HOECHSTENS)) expect(Object.keys(offen[liste] || {}).length, liste).toBeLessThanOrEqual(n);
  });
  it('jeder offene Punkt nennt ein Instrument aus dem Register', () => {
    for (const liste of Object.values(offen)) for (const key of Object.keys(liste)) expect(instrumente[key], key).toBeDefined();
  });
  it('was behoben ist, steht nicht mehr als offen', () => {
    for (const [key, i] of Object.entries(instrumente)) {
      if (offen.formAbweichung[key]) expect(i.form === formen[i.frage] || (bereichsbilder[i.frage] || []).includes(i.form), key + ' ist behoben — aus «offen» streichen').toBe(false);
      if (offen.ohneRechnung[key]) expect(i.rechnung, key).toBeNull();
      if (offen.ohneZuhause[key]) expect(i.zuhause, key).toBeNull();
    }
  });
});
