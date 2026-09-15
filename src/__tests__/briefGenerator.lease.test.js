import { describe, it, expect } from 'vitest';
import { generateLetter } from '../briefGenerator.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';

const t = createT({ de, en, fr, it: itTranslations, rm }, 'de');

// Voll-Review 15.09.2026 (Sicherheits-Prüfer): die Objektadresse wurde in den Feldern
// escaped UND beim Einsetzen in body2 nochmals — «Meier & Co» stand als «&amp;amp;» im Brief.
describe('Kündigungsbrief — Objektadresse wird genau einmal escaped', () => {
  const data = {
    basis: { firstName: 'Anna', lastName: 'Muster' },
    wohnen: { address: 'Meier & Co <Hof> 3', city: 'Basel' },
  };
  it('enthält die Adresse einfach escaped, nie doppelt', () => {
    const html = generateLetter('leaseTermination', data, t);
    expect(html).toContain('Meier &amp; Co &lt;Hof&gt; 3');
    expect(html).not.toContain('&amp;amp;');
    expect(html).not.toContain('&amp;lt;');
    expect(html).not.toContain('<Hof>');
  });
  it('zitiert OR Art. 266l für die Schriftform, nicht 266a', () => {
    const html = generateLetter('leaseTermination', data, t);
    expect(html).toContain('266l');
    expect(html).not.toMatch(/266a\b/);
  });
});
