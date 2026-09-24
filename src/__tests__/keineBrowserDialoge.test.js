// Keine Browser-Dialoge (confirm / prompt / alert) im ausgelieferten Code.
//
// Bis 24.09.2026 kam vor dem Wiederherstellen einer Sicherung `window.confirm` —
// grau, im Dunkelmodus hell, ohne Sie/Du, am Handy je nach Browser unterdrückbar.
// Jetzt steht die Rückfrage in der Seite (ZipExport.jsx). Die ruhige Vorlage für
// Schwereres ist `components/DatenLoeschen.jsx`.
//
// Erlaubnisliste, nicht Verbotsliste: die eine Ausnahme ist die DEV-Vorschau des
// Sperrbildschirms (main.jsx, `import.meta.env.DEV && view === 'lockpreview'`),
// die nie ausgeliefert wird. `installPrompt.prompt()` ist kein Dialog der Seite.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(__dirname, '..');
const dateien = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return e.name === '__tests__' ? [] : dateien(p);
  return /\.(jsx?|ts)$/.test(e.name) ? [p] : [];
});

const DIALOG = /(?<![.\w])(?:window\.)?(confirm|prompt|alert)\(/g;
const ERLAUBT = [['main.jsx', /alert\('Entsperrt \(Stub\)/]];

describe('keine Browser-Dialoge', () => {
  it('das Muster trifft die Dialoge und nicht installPrompt.prompt()', () => {
    expect("if (!window.confirm(t('x')))".match(DIALOG)).toHaveLength(1);
    expect("alert('x')".match(DIALOG)).toHaveLength(1);
    expect('installPrompt.prompt();'.match(DIALOG)).toBeNull();
    expect('const bestaetigen = () => {}'.match(DIALOG)).toBeNull();
  });

  it('kein confirm/prompt/alert ausserhalb der DEV-Vorschau', () => {
    const befund = [];
    for (const p of dateien(SRC)) {
      const rel = path.relative(SRC, p);
      fs.readFileSync(p, 'utf8').split('\n').forEach((z, i) => {
        if (/^\s*\/\//.test(z) || !DIALOG.test(z)) { DIALOG.lastIndex = 0; return; }
        DIALOG.lastIndex = 0;
        if (!ERLAUBT.some(([d, m]) => d === rel && m.test(z))) befund.push(rel + ':' + (i + 1));
      });
    }
    expect(befund).toEqual([]);
  });
});
