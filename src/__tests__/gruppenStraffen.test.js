import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { MENUE_WERKZEUGE } from '../data/werkzeugRegister.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

// Verbesserungen A1 (docs/entscheide/verbesserungen-2026-11.md, 06.11.2026): zwei Gruppen der Übersicht hatten
// je einen einzigen Eintrag. «Gesundheit» (nur Arztkoffer) geht in «Versicherung & Gesundheit» auf,
// «Unterstützung & Anspruch» (nur «Was steht mir zu?») fällt weg — das steht fest in der Leiste unten.
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');
const gruppen = quelle('components/WerkzeugGruppen.jsx');

// Der Block einer Gruppe: vom Titel bis zum nächsten Titel.
const block = (key) => {
  const start = gruppen.indexOf(`t('dashboard.toolGroups.${key}')`);
  const naechster = gruppen.indexOf("t('dashboard.toolGroups.", start + 1);
  return gruppen.slice(start, naechster === -1 ? undefined : naechster);
};

describe('Übersicht ohne Gruppen mit nur einem Eintrag', () => {
  it('«Gesundheit» und «Unterstützung & Anspruch» sind keine eigenen Gruppen mehr', () => {
    expect(gruppen).not.toContain("t('dashboard.toolGroups.gesundheit')");
    expect(gruppen).not.toContain("t('dashboard.toolGroups.support')");
  });

  it('der Arztkoffer steht in «Versicherung & Gesundheit»', () => {
    expect(block('insurance')).toContain("view: 'gesundheit'");
  });

  it('«Was steht mir zu?» bleibt erreichbar: fest in der Leiste unten', () => {
    expect(MENUE_WERKZEUGE.some((w) => w.view === 'situationen')).toBe(true);
    expect(quelle('MobileNav.jsx')).toMatch(/key: 'situationen', view: 'situationen'/);
  });

  it('die zwei Gruppentitel sind aus allen fünf Sprachen entfernt (keine toten Texte)', () => {
    for (const l of [de, fr, it_, en, rm]) {
      expect(l.dashboard.toolGroups.gesundheit).toBeUndefined();
      expect(l.dashboard.toolGroups.support).toBeUndefined();
    }
  });
});
