// Jedes Zeichen aus dem Register ist für Screenreader unsichtbar — egal, wie es
// aufgerufen wird.
//
// Warum: der Schirm stand nur in `<Icon>`. Zehn Stellen rufen die Fabrik direkt
// (`IconFn()`), und die Kapitel-Zeichen tragen echten SVG-Text. Am 24.09.2026
// las ein Screenreader auf dem Dashboard 17 solche Wörter vor — «HELVETIA»
// siebenmal, «5 FR.», «2026», «Fr» — teils mitten im Namen eines Knopfs.
//
// Geprüft wird die Zusage, nicht die Bauweise: das äusserste Element, das eine
// Fabrik liefert, trägt `aria-hidden="true"`. Wo das herkommt, ist frei.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Icons } from '../IconSystem.jsx';
import { muenzenBereit } from '../IconKern.jsx';

const wurzel = (html) => html.match(/^<svg\b[^>]*>/)?.[0] ?? '';

describe('Zeichen aus dem Register sind versteckt', () => {
  const namen = Object.keys(Icons);

  it('das Register ist nicht leer (sonst prüft der Rest die leere Menge)', () => {
    expect(namen.length).toBeGreaterThan(50);
  });

  it('jede Fabrik liefert ein <svg> mit aria-hidden="true" und focusable="false"', () => {
    const offen = namen.filter((n) => {
      const kopf = wurzel(renderToStaticMarkup(Icons[n]()));
      return !/aria-hidden="true"/.test(kopf) || !/focusable="false"/.test(kopf);
    });
    expect(offen).toEqual([]);
  });

  it('auch die Zeichen mit echtem Text — der Fall, der aufgefallen ist', () => {
    const mitText = namen.filter((n) => /<text\b/.test(renderToStaticMarkup(Icons[n]())));
    expect(mitText.length).toBeGreaterThan(0);
    for (const n of mitText) {
      expect(wurzel(renderToStaticMarkup(Icons[n]())), n).toMatch(/aria-hidden="true"/);
    }
  });

  it('direkter Aufruf ohne <Icon> — so wie Dashboard, MobileNav und Baum3D es tun', async () => {
    // Die Münzen kommen nachgeladen (IconKern, 25.09.2026): erst warten, dann prüfen.
    await muenzenBereit();
    const html = renderToStaticMarkup(
      React.createElement('button', null, 'Pensionierung', React.createElement('div', null, Icons.behoerden())),
    );
    expect(html).toMatch(/<svg[^>]*aria-hidden="true"[^>]*>.*HELVETIA/);
  });
});

describe('Register ergänzen: Ladereihenfolge', () => {
  it('eine Nicht-Funktion wird beim Eintragen mit Namen abgewiesen, nicht erst beim Zeichnen', async () => {
    const { zeichenErgaenzen } = await import('../IconKern.jsx');
    expect(() => zeichenErgaenzen({ zzHalbGeladen: undefined })).toThrow(/zzHalbGeladen/);
    expect(Icons.zzHalbGeladen).toBeUndefined();
  });

  it('die Zeichen aus IconMuenzen.jsx sind Hüllen, die erst beim Zeichnen nachschlagen', async () => {
    // Quelltext statt Laufzeit: die Reihenfolge, in der es schiefging, lässt sich im Test nicht
    // erzwingen (lokal 0 von 25 Läufen rot). Geprüft wird darum, dass kein importierter Wert aus
    // IconMuenzen.jsx direkt ins Register geht.
    const fs = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const quelle = fs.readFileSync(fileURLToPath(new URL('../IconSystem.jsx', import.meta.url)), 'utf8');
    const kopf = quelle.match(/import \{([^}]*)\} from '\.\/IconMuenzen\.jsx'/);
    expect(kopf).not.toBeNull();
    const lokal = kopf[1].split(',').map((s) => s.trim().split(/\s+as\s+/).pop()).filter(Boolean);
    expect(lokal.length).toBeGreaterThan(0);
    for (const name of lokal) {
      expect(quelle, name).not.toMatch(new RegExp(`:\\s*${name}\\s*,`));
    }
  });
});
