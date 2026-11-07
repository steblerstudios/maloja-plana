import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ABLAEUFE, ANKOMMEN } from '../config/ansichtenRegister.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

// Seitenlandkarte G1 (docs/entscheide/seitenlandkarte-2026-11.md, 05.11.2026): Wer neu in die Schweiz
// kommt, braucht fünf Abläufe aus drei Lebensbereichen nacheinander. In der Übersicht standen sie
// verstreut unter den 34 «Lebensereignissen». Jetzt gibt es eine eigene Gruppe «Ankommen in der
// Schweiz» in dieser Reihenfolge. Die Abläufe bleiben auch unter «Lebensereignisse» stehen.
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');

describe('Gruppe «Ankommen in der Schweiz» in der Übersicht', () => {
  it('fünf Abläufe in der Reihenfolge, in der man sie braucht', () => {
    expect(ANKOMMEN).toEqual(['zuzug', 'kkerst', 'bewilligung', 'quellensteuer', 'einbuergerung']);
  });

  it('jeder Eintrag ist ein Ablauf aus dem Register, also mit Titel, Untertitel und Zeichen', () => {
    const views = new Set(ABLAEUFE.map((a) => a.view));
    for (const v of ANKOMMEN) expect(views.has(v), v).toBe(true);
  });

  it('der Gruppentitel steht in allen fünf Sprachen', () => {
    const titel = [de, fr, it_, en, rm].map((l) => l.dashboard.toolGroups.ankommen);
    expect(titel).toEqual(['Ankommen in der Schweiz', 'Arrivée en Suisse', 'Arrivo in Svizzera', 'Arriving in Switzerland', 'Arrivada en Svizra']);
  });

  // Seit der Seiten-Architektur (06.11.2026) stehen davor die 7 Kapitel, danach «Mit 18» und die Klammer.
  it('die Übersicht zeigt die Gruppe direkt nach den Kapiteln', () => {
    const d = quelle('components/WerkzeugGruppen.jsx');
    const a = d.indexOf('...kapitelGruppen');
    const b = d.indexOf("t('dashboard.toolGroups.ankommen')");
    const c = d.indexOf("t('dashboard.toolGroups.mit18')");
    expect(a).toBeGreaterThan(-1);
    expect(b).toBeGreaterThan(a);
    expect(c).toBeGreaterThan(b);
  });

  it('offene Gruppen merken sich ihren Titel, nicht ihre Stelle — sonst öffnete eine neue Gruppe die falsche', () => {
    const d = quelle('components/WerkzeugGruppen.jsx');
    expect(d).toMatch(/offen\.includes\(g\.label\)/);
    expect(d).toMatch(/merkeGruppe\(g\.label,/);
  });
});
