import { describe, it, expect } from 'vitest';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js'; // nicht «it» — das überschriebe vitests it()
import rm from '../i18n/rm.js';

// po.franchiseChangeWhen am Wortlaut von KVV Art. 94 (fedlex, 25.10.2026): eine höhere Franchise nur auf den
// Beginn eines Kalenderjahres (Abs. 1, ohne Frist), eine tiefere mit den Fristen von KVG Art. 7 Abs. 1/2 auf das
// Ende eines Kalenderjahres (Abs. 2). Vorher stand eine Frist «bis Ende November» für jede Änderung.
const sprachen = { de, en, fr, it: itSprache, rm };

describe('po.franchiseChangeWhen', () => {
  it('nennt keine Frist «Ende November» mehr für die höhere Franchise', () => {
    expect(de.po.franchiseChangeWhen).not.toMatch(/Ende November/);
    expect(en.po.franchiseChangeWhen).not.toMatch(/end of November/);
  });

  it.each(Object.entries(sprachen))('%s: zitiert Art. 94 Abs. 1 und 2 und verlinkt auf die Artikel', (_, s) => {
    const txt = s.po.franchiseChangeWhen;
    expect(txt).toMatch(/94 (Abs\.|paras\.|al\.|cpv\.) 1 (und|and|et|e) 2/);
    expect(txt).toMatch(/#art_7\]\]/);
    expect(txt).toMatch(/#art_94\]\]/);
  });
});
