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

// Nicht zweimal eingeben: der Vermieter steht im Kapitel «Wohnen» und gehört ins Empfängerfeld.
describe('Kündigungsbrief — Vermieter aus dem Profil', () => {
  const empfaenger = (html) => html.match(/<div class="recipient">([\s\S]*?)<\/div>\s*<div class="date-line">/)[1];
  it('setzt den Vermieter ein, escaped, und markiert die fehlende Adresse', () => {
    const html = generateLetter('leaseTermination', { wohnen: { landlord: 'Huber & Söhne <Verwaltung>' } }, t);
    const block = empfaenger(html);
    expect(block).toContain('Huber &amp; Söhne &lt;Verwaltung&gt;');
    expect(block).toContain('class="placeholder"');
    expect(block).not.toContain(t('briefe.recipientPlaceholder'));
  });
  it('ohne Vermieter (auch nur Leerzeichen) bleibt der Platzhalter', () => {
    for (const landlord of [undefined, '', '   ']) {
      const block = empfaenger(generateLetter('leaseTermination', { wohnen: { landlord } }, t));
      expect(block).toContain(t('briefe.recipientPlaceholder'));
    }
  });
});
