import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { Vorsorgeauftrag } from '../Vorsorgeauftrag.jsx';

// F7-A6 (Entscheid Stebler Studios 27.10.2026, nur der Ablauf-Teil): im Schritt «Patientenverfügung» ein Knopf
// zum Formular `patientenverfuegung`. Die Kapitel Notfall/Behörden bleiben (Besprechung offen).
beforeEach(() => { globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }; });
const t = createT({ de }, 'de', 'sie');

describe('Vorsorgeauftrag: Knopf «Patientenverfügung erstellen»', () => {
  it('steht im Schritt 4 als Hauptknopf und führt ins Formular', () => {
    const html = renderToStaticMarkup(React.createElement(Vorsorgeauftrag, { palette: LIGHT_PALETTE, t, data: {}, chapters: [], onNavigate: () => {} }));
    const schritt4 = html.slice(html.indexOf('data-ablauf-schritt="4"'), html.indexOf('data-ablauf-schritt="5"'));
    expect(schritt4).toContain('data-pv-knopf');
    expect(schritt4).toContain(t('vorsorgeauftrag.step4LinkPv'));
    const src = readFileSync(resolve(__dirname, '..', 'Vorsorgeauftrag.jsx'), 'utf8');
    expect(src).toMatch(/'data-pv-knopf'[^\n]*onNavigate\('patientenverfuegung'\)/);
  });
});
