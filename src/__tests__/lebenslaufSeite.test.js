// F7-R5 (31.10.2026): Die Seite «Lebenslauf» zeigt das Blatt aus dem Kapitel, «Als PDF drucken» ist der Hauptweg,
// HTML und JSON stehen unter «Weitere Formate». Auch vor dem Drucken steht die Export-Vorschau (K20), weil der Druck
// mehr enthält als das Blatt.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CVGenerator } from '../CVGenerator.jsx';
import { LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { DEMO_DATA } from '../config/demoData.js';

const t = createT({ de }, 'de', 'sie');
const seite = (data = DEMO_DATA, onNavigate = () => {}) => renderToStaticMarkup(React.createElement(CVGenerator, { palette: LIGHT_PALETTE, t, data, onNavigate }));
const QUELLE = fs.readFileSync(path.resolve(__dirname, '../CVGenerator.jsx'), 'utf8');

describe('Lebenslauf als Vorschau plus PDF', () => {
  it('zeigt das Blatt und einen Hauptknopf, nicht mehr die Datenmaske', () => {
    const html = seite();
    expect(html).toContain('data-teil="lebenslauf-blatt"');
    expect(html).toContain('Maria Muster');
    expect(html).toContain('Als PDF drucken');
    expect(html).not.toContain('monospace');
  });
  it('HTML und JSON liegen unter «Weitere Formate»', () => {
    const html = seite();
    const unten = html.slice(html.indexOf('data-teil="weitere-formate"'));
    expect(unten).toContain('Weitere Formate');
    expect(unten).toContain('HTML Download');
    expect(unten).toContain('JSON (ATS)');
    expect(html.slice(0, html.indexOf('data-teil="weitere-formate"'))).not.toContain('JSON (ATS)');
  });
  it('vor dem Drucken die Export-Vorschau, gedruckt wird aus dem App-Fenster', () => {
    expect(QUELLE).toContain("onClick: () => setVorschau('druck')");
    expect(QUELLE).toContain('win.print()');
  });
  it('ohne Angaben: ein Satz und der Weg ins Kapitel, kein leeres Blatt', () => {
    const html = seite({});
    expect(html).toContain('data-teil="lebenslauf-leer"');
    expect(html).toContain('Angaben ergänzen ›');
    expect(html).not.toContain('Als PDF drucken');
  });
  it('kein Knopf ohne Navigation', () => {
    expect(renderToStaticMarkup(React.createElement(CVGenerator, { palette: LIGHT_PALETTE, t, data: {} }))).not.toContain('Angaben ergänzen');
  });
});
