import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';

// Sicherheitsprüfung 25.09.2026: die GitHub Actions liefen auf Versions-Tags (`@v4`).
// Ein verschobener Tag hätte fremden Code in den Lauf gebracht. Jede `uses:`-Zeile
// muss deshalb auf einen vollen Commit-Hash zeigen, mit der Version als Kommentar.

const ORDNER = new URL('../../.github/workflows/', import.meta.url);
const DATEIEN = readdirSync(ORDNER).filter((d) => /\.ya?ml$/.test(d));

function usesZeilen() {
  return DATEIEN.flatMap((datei) =>
    readFileSync(new URL(datei, ORDNER), 'utf8')
      .split('\n')
      .map((zeile, i) => ({ datei, nr: i + 1, zeile }))
      .filter(({ zeile }) => /^\s*-?\s*uses:/.test(zeile)),
  );
}

describe('GitHub Actions auf feste Commits gepinnt', () => {
  it('findet überhaupt Workflows mit Actions (sonst prüft der Test nichts)', () => {
    expect(DATEIEN.length).toBeGreaterThan(0);
    expect(usesZeilen().length).toBeGreaterThan(0);
  });

  it('jede `uses:` zeigt auf einen 40-stelligen Hash und nennt die Version', () => {
    const ungepinnt = usesZeilen()
      .filter(({ zeile }) => !/uses:\s*[\w.-]+\/[\w.\/-]+@[0-9a-f]{40}\s+#\s*v\d/.test(zeile))
      .map(({ datei, nr, zeile }) => `${datei}:${nr} ${zeile.trim()}`);
    expect(ungepinnt).toEqual([]);
  });
});
