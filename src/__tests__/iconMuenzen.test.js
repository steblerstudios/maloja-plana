import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Die zwei Münzen (Finanzen, Behörden) kommen nachgeladen (IconKern, 25.09.2026). Zusagen:
//  1. Vor dem Eintreffen steht ein Platzhalter — gleiche Zeichenfläche, für Screenreader
//     versteckt, ohne Text («HELVETIA» u.ä. dürfen nie vorgelesen werden).
//  2. Die Illustrationen stehen NICHT mehr im Kern — sonst wäre die Luft wieder weg.
const kern = readFileSync(fileURLToPath(new URL('../IconKern.jsx', import.meta.url)), 'utf8');

describe('Münzen nachgeladen', () => {
  it('der Kern trägt die Illustrationen nicht mehr', () => {
    // Als Zeichenkette im Code, nicht in Kommentaren (dort wird die Münze beschrieben).
    expect(kern).not.toMatch(/'HELVETIA'|'5 FR\.?'/);
    expect(kern).toMatch(/import\('\.\/IconMuenzen\.jsx'\)/);
  });

  it('der Platzhalter ist versteckt, gleich gross und ohne Text', async () => {
    // Frisches Modul: die Münzen sind beim ersten Zeichnen noch nicht da.
    const { vi } = await import('vitest');
    vi.resetModules();
    const { Icons } = await import('../IconKern.jsx');
    const html = renderToStaticMarkup(React.createElement('div', null, Icons.finanzen()));
    expect(html).toMatch(/<svg[^>]*viewBox="0 0 48 48"[^>]*aria-hidden="true"/);
    expect(html).not.toMatch(/<text/);
  });

  it('nach dem Laden die volle Münze, weiterhin versteckt', async () => {
    const { Icons, muenzenBereit } = await import('../IconKern.jsx');
    await muenzenBereit();
    const html = renderToStaticMarkup(React.createElement('div', null, Icons.finanzen()));
    expect(html).toMatch(/<svg[^>]*aria-hidden="true"/);
    expect(html).toMatch(/5 FR/);
  });
});
