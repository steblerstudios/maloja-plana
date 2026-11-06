import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { VERWANDTE } from '../config/ablaufVerwandte.js';

// Seitenlandkarte V2 (docs/entscheide/seitenlandkarte-2026-11.md, 06.11.2026): drei Werkzeuge waren fast nur
// über Suche und Menü zu finden. Jetzt steht jedes in dem Ablauf, in dem es gebraucht wird — mit der
// Beschriftung, die es schon gab (keine neuen Texte).
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');

describe('Werkzeuge stehen im passenden Ablauf', () => {
  it('«Neuer Job», Schritt Vertrag: Stundenlohn prüfen', () => {
    expect(quelle('NeuerJob.jsx')).toMatch(/label: t\('nav\.stundenlohn'\), onClick: \(\) => onNavigate\('stundenlohn'\)/);
  });

  it('«18 werden», Schritt Verträge allein unterschreiben: lohnt sich die Kreditkarte?', () => {
    expect(quelle('Volljaehrig.jsx')).toMatch(/label: t\('nav\.crosslink\.kreditkarteHint'\), onClick: \(\) => onNavigate\('kreditkarte'\)/);
  });

  it('Digitale Ordnung ist verwandter Ablauf von Todesfall und Vorsorgeauftrag', () => {
    expect(VERWANDTE.todesfall).toContain('digitaleordnung');
    expect(VERWANDTE.vorsorgeauftrag).toContain('digitaleordnung');
  });
});
