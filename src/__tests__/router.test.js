import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { VALID_VIEWS } from '../utils/hashRouter.js';

// Guard against the recurring drift where a new view gets a `view === 'x'`
// render branch + nav entry in main.jsx but is forgotten in the router's
// VALID_VIEWS — making it work on click but break on reload / shared link /
// PWA cold-start (lands back on dashboard). See docs/TODO.md AUDIT 2026-06-28.
describe('hashRouter VALID_VIEWS deckt alle main.jsx-Ansichten', () => {
  const mainSrc = readFileSync(
    fileURLToPath(new URL('../main.jsx', import.meta.url)),
    'utf8',
  );
  const branchViews = [...mainSrc.matchAll(/view === '([a-zA-Z]+)'/g)].map(m => m[1]);
  const uniqueViews = [...new Set(branchViews)];

  it('findet überhaupt view-Branches', () => {
    expect(uniqueViews.length).toBeGreaterThan(20);
  });

  it.each(uniqueViews)('Ansicht "%s" ist deep-linkbar (in VALID_VIEWS)', (view) => {
    expect(VALID_VIEWS.has(view)).toBe(true);
  });
});
