import { describe, it, expect } from 'vitest';
import { herkunftName, ansichtName, ABLAEUFE } from '../config/ansichtenRegister.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import en from '../i18n/en.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

// Seitenrundgang 27.09.2026: «Zurück zu …» gab es nur nach einem Kapitel.
describe('herkunftName', () => {
  const t = createT({ de }, 'de', 'sie');
  const chapters = [{ title: 'Persönliche Basis' }, { title: 'Wohnen & Leben' }];

  it('nennt Werkzeuge, Abläufe und die Suche', () => {
    expect(herkunftName({ view: 'finanzuebersicht' }, 'tax', chapters, t)).toBe('Finanz-Übersicht');
    expect(herkunftName({ view: 'heirat' }, 'kind', chapters, t)).toBe('Heirat oder Partnerschaft');
    expect(herkunftName({ view: 'search' }, 'umzug', chapters, t)).toBe('Suche');
  });

  it('nennt das Kapitel, wie bisher', () => {
    expect(herkunftName({ view: 'chapter', chapterIndex: 1 }, 'premium', chapters, t)).toBe('Wohnen & Leben');
  });

  it('keine Zeile bei Direkteinstieg, von der Übersicht, Kapitel → Kapitel oder ohne Namen', () => {
    expect(herkunftName(null, 'tax', chapters, t)).toBeNull();
    expect(herkunftName({ view: 'dashboard' }, 'tax', chapters, t)).toBeNull();
    expect(herkunftName({ view: 'chapter', chapterIndex: 0 }, 'chapter', chapters, t)).toBeNull();
    expect(herkunftName({ view: 'lockpreview' }, 'tax', chapters, t)).toBeNull();
    expect(herkunftName({ view: 'chapter', chapterIndex: 9 }, 'tax', chapters, t)).toBeNull();
  });

  it('jeder Ablauf und jeder zusätzliche Name ist in allen fünf Sprachen übersetzt', () => {
    const views = [...ABLAEUFE.map((a) => a.view), 'search', 'settings', 'ansprueche', 'situationen', 'schnellcheck', 'notfalleinstieg', 'notfallkarte', 'gesundheit', 'briefe', 'obstgarten', 'gepaeck', 'legal', 'mietzins', 'finanzuebersicht', 'tax', 'premium'];
    for (const [lang, tr] of Object.entries({ de, fr, en, it: it_, rm })) {
      const tl = createT({ [lang]: tr, de }, lang, 'sie');
      for (const v of views) {
        expect(ansichtName(v), v).toBeTruthy();
        expect(herkunftName({ view: v }, 'x', chapters, tl), lang + ':' + v).toBeTruthy();
      }
    }
  });
});
