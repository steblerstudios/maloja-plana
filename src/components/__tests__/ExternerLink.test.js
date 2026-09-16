import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ExternerLink, visuallyHiddenStyle } from '../ExternerLink.jsx';

// R4 (WCAG 3.2.5 / G201): jeder externe Link, der in einem neuen Tab öffnet,
// muss das für Screenreader hörbar ankündigen — ein optischer Pfeil allein
// reicht nicht. Dieser Test deckt den gemeinsamen Baustein ab, auf den alle
// bisherigen <a target="_blank">-Aufrufe umgestellt wurden.
const t = (key) => (key === 'a11y.neuerTab' ? 'öffnet in neuem Tab' : key);

describe('ExternerLink', () => {
  it('setzt target="_blank" und rel="noopener noreferrer"', () => {
    const html = renderToStaticMarkup(
      React.createElement(ExternerLink, { t, href: 'https://example.org' }, 'Beispiel')
    );
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('überschreibt ein schwächeres rel (nur "noopener") mit dem vollen Schutz', () => {
    const html = renderToStaticMarkup(
      React.createElement(ExternerLink, { t, href: 'https://example.org', rel: 'noopener' }, 'Beispiel')
    );
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).not.toContain('rel="noopener"');
  });

  it('trägt einen für Screenreader hörbaren, visuell versteckten Hinweis', () => {
    const html = renderToStaticMarkup(
      React.createElement(ExternerLink, { t, href: 'https://example.org' }, 'Beispiel')
    );
    expect(html).toContain('öffnet in neuem Tab');
    // Der Hinweis muss aus dem sichtbaren Layout entfernt sein (sr-only-Muster),
    // nicht per display:none (das würde ihn auch für Screenreader verstecken).
    expect(html).toContain('clip:rect(0, 0, 0, 0)');
    expect(html).not.toContain('display:none');
  });

  it('behält den sichtbaren Linktext unverändert bei (kein neues visuelles Rauschen)', () => {
    const html = renderToStaticMarkup(
      React.createElement(ExternerLink, { t, href: 'https://example.org' }, 'schulden.ch')
    );
    expect(html).toContain('>schulden.ch<');
  });

  it('gibt href und zusätzliche Attribute (z. B. title) unverändert weiter', () => {
    const html = renderToStaticMarkup(
      React.createElement(ExternerLink, { t, href: 'https://example.org', title: 'Extern' }, 'x')
    );
    expect(html).toContain('href="https://example.org"');
    expect(html).toContain('title="Extern"');
  });

  it('visuallyHiddenStyle versteckt optisch, ohne das Element aus dem A11y-Baum zu nehmen', () => {
    expect(visuallyHiddenStyle.position).toBe('absolute');
    expect(visuallyHiddenStyle.width).toBe('1px');
    expect(visuallyHiddenStyle.height).toBe('1px');
    expect(visuallyHiddenStyle.overflow).toBe('hidden');
    expect(visuallyHiddenStyle.display).not.toBe('none');
  });
});
