import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ABLAEUFE, MIT18 } from '../config/ansichtenRegister.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

// Seitenlandkarte G2 (docs/entscheide/seitenlandkarte-2026-11.md, 06.11.2026): «Mit 18» als Reihe in der
// Übersicht. Damit dafür im Startbündel Platz ist, laden die Werkzeuggruppen seit G2 nach
// (components/WerkzeugGruppen.jsx) — die Übersicht selbst trägt sie nicht mehr.
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');

describe('Gruppe «Mit 18» in der Übersicht', () => {
  it('vier Abläufe in der Reihenfolge, wie «18 werden» sie selbst verlinkt', () => {
    expect(MIT18).toEqual(['volljaehrig', 'lehre', 'dienst', 'neuerjob']);
  });

  it('jeder Eintrag ist ein Ablauf aus dem Register', () => {
    const views = new Set(ABLAEUFE.map((a) => a.view));
    for (const v of MIT18) expect(views.has(v), v).toBe(true);
  });

  it('der Gruppentitel steht in allen fünf Sprachen', () => {
    expect([de, fr, it_, en, rm].map((l) => l.dashboard.toolGroups.mit18)).toEqual(['Mit 18', 'À 18 ans', 'A 18 anni', 'At 18', 'Cun 18 onns']);
  });

  it('die Gruppe steht nach «Ankommen in der Schweiz» und vor der Klammer (Kalender, Merkliste & Unterlagen)', () => {
    const g = quelle('components/WerkzeugGruppen.jsx');
    const a = g.indexOf("t('dashboard.toolGroups.ankommen')");
    const b = g.indexOf("t('dashboard.toolGroups.mit18')");
    const c = g.indexOf("t('dashboard.toolGroups.klammer')");
    expect(a).toBeGreaterThan(-1);
    expect(b).toBeGreaterThan(a);
    expect(c).toBeGreaterThan(b);
  });

  it('die Gruppen laden nach — die Übersicht im Startbündel trägt sie nicht mehr', () => {
    const d = quelle('Dashboard.jsx');
    expect(d).toContain("lazyMitTexten(() => import('./components/WerkzeugGruppen.jsx'))");
    expect(d).not.toContain('dashboard.toolGroups.');
  });
});
