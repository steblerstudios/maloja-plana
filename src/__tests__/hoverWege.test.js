import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Hover für Weg-Knöpfe (25.09.2026). Zwei Zusagen:
//  1. Die Regel unterstreicht nur — ändert weder Farbe noch Deckkraft (Kontrast bleibt)
//     und greift nur mit echtem Zeiger (auf dem Handy bleibt nichts hängen).
//  2. Jeder Knopf, der aus einem Kapitel woandershin führt, trägt sie. Ein neuer
//     Querverweis ohne Klasse wird hier rot — nicht erst beim nächsten Durchsehen.
const lies = (pfad) => readFileSync(fileURLToPath(new URL(pfad, import.meta.url)), 'utf8');

describe('Hover-Regel .mp-link', () => {
  const css = lies('../tokens.css');
  const block = css.match(/@media \(hover: hover\) \{\s*\.mp-link:hover \{([^}]*)\}\s*\}/);

  it('steht in @media (hover: hover)', () => {
    expect(block).not.toBeNull();
  });

  it('unterstreicht und rührt Farbe und Deckkraft nicht an', () => {
    const regel = block[1];
    expect(regel).toMatch(/text-decoration-line:\s*underline/);
    expect(regel).not.toMatch(/(^|[^-])color\s*:|opacity|filter|background/);
  });

  it('es gibt keine zweite, ungeschützte .mp-link:hover-Regel', () => {
    expect(css.match(/\.mp-link:hover/g)).toHaveLength(1);
  });
});

describe('Weg-Knöpfe tragen die Klasse', () => {
  it('jeder onNavigate-Knopf im Kapitel', () => {
    const src = lies('../ChapterView.jsx');
    const zeilen = src.split('\n');
    const ohne = [];
    zeilen.forEach((z, i) => {
      if (!/onClick: \(\) => onNavigate\(/.test(z)) return;
      // Das Knopf-Objekt beginnt höchstens ein paar Zeilen darüber.
      const davor = zeilen.slice(Math.max(0, i - 4), i).join('\n');
      if (!/className: 'mp-link'/.test(davor)) ohne.push(i + 1 + ': ' + z.trim());
    });
    expect(zeilen.filter((z) => /onClick: \(\) => onNavigate\(/.test(z)).length).toBeGreaterThan(5);
    expect(ohne).toEqual([]);
  });

  it('die «→»-Verweise der Abläufe (AblaufLink, FristButton)', () => {
    const src = lies('../AblaufSchale.jsx');
    expect(src.match(/className: 'mp-link', style: s\.link/g)).toHaveLength(2);
    expect(src.match(/style: s\.link/g)).toHaveLength(2);
  });

  it('«Übersicht» oben in jeder Ansicht', () => {
    const src = lies('../main.jsx');
    expect(src).toMatch(/'aria-label': t\('nav\.backToDashboard'\),\s*className: 'mp-link'/);
  });
});
