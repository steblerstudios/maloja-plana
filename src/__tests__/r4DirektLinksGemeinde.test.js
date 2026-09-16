// R4 (Predeploy-Gate 16.09.): DirektLinks riet die Gemeinde-Adresse als
// https://www.<ort>.ch. Im Repo gibt es keine belegten Gemeinde-Websites
// (plzGemeinde.js führt nur Name, BFS-Nr. und Kanton) — also kein Gemeinde-Link,
// nur der Name mit einem ruhigen Hinweis und der Kantons-Link.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

const src = readFileSync(new URL('../DirektLinks.jsx', import.meta.url), 'utf8');

describe('DirektLinks: keine geratene Gemeinde-Adresse', () => {
  it('baut keine www.<ort>.ch-Adresse mehr', () => {
    expect(src).not.toContain('communeUrl');
    expect(src).not.toMatch(/'https:\/\/www\.' \+ slug/);
  });
  it('zeigt die Gemeinde als Text mit Hinweis', () => {
    expect(src).toContain("t('legal.resources.communeHint', { city })");
  });
  it('Hinweis in allen 5 Sprachen mit {city}', () => {
    for (const [lang, d] of Object.entries({ de, en, fr, it: it_, rm })) {
      const h = d.legal.resources.communeHint;
      const texte = typeof h === 'string' ? [h] : [h.sie, h.du];
      for (const x of texte) expect(x, lang).toContain('{city}');
    }
  });
});
