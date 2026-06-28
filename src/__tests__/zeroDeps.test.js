import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Capacitor is the native iOS shell only — it must never enter the web bundle.
// Guard against a future `import … from '@capacitor/*'` slipping into src/,
// which would break the zero-runtime-dependency / local-first constraint.
// See docs/TODO.md AUDIT 2026-06-28.
const srcDir = fileURLToPath(new URL('..', import.meta.url));

function collect(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === '__tests__' || entry === 'node_modules') continue;
      collect(full, acc);
    } else if (/\.(jsx?|tsx?)$/.test(entry)) {
      acc.push(full);
    }
  }
  return acc;
}

describe('Zero-Dependency-Constraint', () => {
  it('kein @capacitor-Import irgendwo in src/', () => {
    const offenders = collect(srcDir).filter(f =>
      /['"]@capacitor\//.test(readFileSync(f, 'utf8')),
    );
    expect(offenders, `@capacitor-Import in: ${offenders.join(', ')}`).toEqual([]);
  });
});
