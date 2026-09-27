// 27.09.2026: Kommt die Person aus einem Ablauf mit vorgewählter Vorlage, springt die Ansicht
// zum Formular — sonst sah sie nur die Vorlagen-Liste und merkte nicht, dass der Brief offen ist.
// Kein DOM in dieser Testumgebung (kein jsdom) → der Vertrag wird am Quelltext gehalten;
// das Verhalten selbst ist im Browser geprüft (PR-Beschreibung).
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const src = fs.readFileSync(path.join(__dirname, '..', 'BriefGenerator.jsx'), 'utf8');

describe('Brief-Vorwahl springt zum Formular', () => {
  it('der Sprung hängt nur an der Vorwahl, nicht an der eigenen Kartenwahl', () => {
    const effekt = src.slice(src.indexOf('const formAnfangRef'), src.indexOf('}, [initialTemplate]);', src.indexOf('const formAnfangRef')) + '}, [initialTemplate]);'.length);
    expect(effekt).toContain('if (!initialTemplate) return');
    expect(effekt).toContain('scrollIntoView');
    expect(effekt).toMatch(/\}, \[initialTemplate\]\);$/);
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
