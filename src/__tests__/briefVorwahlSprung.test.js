// 27.09.2026: Kommt die Person aus einem Ablauf mit vorgewählter Vorlage, springt die Ansicht
// zum Formular — sonst sah sie nur die Vorlagen-Liste und merkte nicht, dass der Brief offen ist.
// Kein DOM in dieser Testumgebung (kein jsdom) → der Vertrag wird am Quelltext gehalten;
// das Verhalten selbst ist im Browser geprüft (PR-Beschreibung).
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const src = fs.readFileSync(path.join(__dirname, '..', 'BriefGenerator.jsx'), 'utf8');

describe('Brief-Vorwahl springt zum Formular', () => {
  // Gruppe B Gestaltung A (Entscheid Stebler Studios 11.11.2026): seither springt auch die eigene Kartenwahl —
  // auf dem Handy stand das Formular rund 3700 px unter der Liste, nach dem Antippen geschah sichtbar nichts.
  it('der Sprung hängt an der Vorwahl und an der eigenen Kartenwahl', () => {
    const ende = '}, [initialTemplate, sprung]);';
    const effekt = src.slice(src.indexOf('const formAnfangRef'), src.indexOf(ende, src.indexOf('const formAnfangRef')) + ende.length);
    expect(effekt).toContain('if (!initialTemplate && !sprung) return');
    expect(effekt).toContain('scrollIntoView');
    expect(effekt.endsWith(ende)).toBe(true);
  });
  it('respektiert «weniger Bewegung» (Einstellung und System)', () => {
    expect(src).toMatch(/or5_reducemotion[\s\S]{0,200}prefers-reduced-motion[\s\S]{0,120}behavior: reduce \? 'auto' : 'smooth'/);
  });
  it('das Sprungziel steht nach der Vorlagen-Liste und vor den Angaben, mit Abstand zur Kopfzeile', () => {
    const ziel = src.indexOf('ref: formAnfangRef');
    expect(ziel).toBeGreaterThan(src.indexOf('// Template cards'));
    expect(ziel).toBeLessThan(src.indexOf('// Anstellungs-Auswahl'));
    expect(src.slice(ziel, ziel + 160)).toContain("scrollMarginTop: 'var(--mp-sprungabstand)'");
  });
});
