import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Icons, KERN_NAMEN } from '../IconKern.jsx';
import '../IconSystem.jsx';
import { WERKZEUGE } from '../data/werkzeugRegister.js';
import { ansichtIkon } from '../config/ansichtenRegister.js';

// Icon-Plan November 2026, Schritt 3 (docs/ICON-PLAN-2026-11.md): eine Quelle.
// Vorher zeichneten der Boden-Anker (main.jsx `bottomIcon`) und das Menü (MobileNav `linie`)
// Rucksack, Sackmesser, Geschenk, Plus, Quittung, Menü, Ordner, Haken und Kalender je selbst —
// drei Fassungen derselben Zeichen, mit drei Strichstärken (1,6 · 1,7 · 1,8).
// Entscheid E2 (06.11.2026): `mappe` geht in `ordner` auf. E3: `plus` kommt ins Register.

const SRC = resolve(__dirname, '..');
const lesen = (datei) => readFileSync(resolve(SRC, datei), 'utf8');
const svgAnzahl = (txt) => (txt.match(/createElement\(\s*'svg'/g) || []).length;

describe('Boden-Anker und Menü zeichnen keine eigenen Icons', () => {
  it('main.jsx: nur das bewegte Sackmesser zeichnet selbst', () => {
    // SackmesserIcon klappt die Werkzeuge aus, wenn die Übersicht offen ist — eine Bewegung,
    // kein zweites Zeichen. Die ruhende Form steht im Register (`sackmesser`).
    expect(svgAnzahl(lesen('main.jsx').replace(/const SackmesserIcon[\s\S]*?\n};\n/, ''))).toBe(0);
  });
  it('MobileNav.jsx zeichnet nichts selbst', () => {
    expect(svgAnzahl(lesen('MobileNav.jsx'))).toBe(0);
  });
  it('die Zeichen der Leiste stehen im Kern (der Boden-Anker liegt im Startbündel)', () => {
    // Seit Bauplan B5b (08.11.2026): ① Übersicht = Feldstecher, ④ Was steht mir zu? = Wegweiser, ⑤ Menü = Sackmesser.
    for (const n of ['rucksack', 'sackmesser', 'feldstecher', 'wegweiser', 'plus', 'quittung', 'ordner', 'lesezeichen', 'calendar']) {
      expect(KERN_NAMEN, n).toContain(n);
    }
  });
});

describe('ein Ding, ein Zeichen', () => {
  it('«mappe» gibt es nicht mehr (E2: geht in «ordner» auf)', () => {
    expect(Icons.mappe).toBeUndefined();
    for (const datei of ['FinanzUebersicht.jsx', 'ChapterView.jsx', 'components/NotfallImKapitel.jsx']) {
      expect(lesen(datei), datei).not.toMatch(/'mappe'/);
    }
  });
  // Seit Bauplan B5b (08.11.2026): Wegweiser statt Geschenk (Icon-Besprechung 07.11., «G»).
  it('«Was steht mir zu?» trägt in Leiste, Menü und Register denselben Wegweiser', () => {
    expect(WERKZEUGE.find((w) => w.view === 'situationen').icon).toBe('wegweiser');
    expect(lesen('main.jsx')).toMatch(/key: 'situationen'[^\n]*icon: 'wegweiser'/);
    expect(lesen('MobileNav.jsx')).toMatch(/key: 'situationen'[^\n]*icon: 'wegweiser'/);
    // In den Werkzeuggruppen steht «Was steht mir zu?» seit A1 (06.11.2026, #719) nicht mehr — die Seite
    // steht fest in der Leiste unten. Steht sie dort je wieder, dann mit dem Geschenk.
    const gruppen = lesen('components/WerkzeugGruppen.jsx');
    if (/view: 'situationen'/.test(gruppen)) expect(gruppen).toMatch(/view: 'situationen', icon: 'wegweiser'/);
  });
  it('der Weg zur Sicherung trägt das Sicherungs-Zeichen, nicht das Schloss', () => {
    expect(lesen('components/UnterlagenWege.jsx')).toMatch(/icon: 'sicherung', onClick: \(\) => onNavigate\('export'\)/);
  });
  // Icon-Besprechung 07.11.2026: Notfallpass = Handy (das Gerät), Notfall-Dossier = Stapel; der
  // Arztkoffer («notfall») erscheint nie in den roten Kacheln (Rechts-Prüfung, Bauplan B2).
  it('Notfallpass und Notfall-Dossier im Kapitel tragen ihr eigenes Zeichen, nie den Koffer', () => {
    const k = lesen('components/NotfallImKapitel.jsx');
    expect(k).toMatch(/kachel\('notfallpass'[^\n]*'handy', \(\) => onNavigate\('notfallpass'\)/);
    expect(k).toMatch(/kachel\('notfalldossier'[^\n]*'documents', \(\) => onNavigate\('notfalldossier'\)/);
  });
  it('das Behörden-Dossier trägt überall die Waage, wie seine Seite', () => {
    expect(lesen('BehoerdenDossier.jsx')).toMatch(/name: 'legal'/);
    expect(lesen('FinanzUebersicht.jsx')).toMatch(/name: 'legal', size: 16 \}\), t\('finanzUebersicht\.toDossier'\)/);
    expect(lesen('ChapterView.jsx')).toMatch(/onNavigate\('behoerdendossier'\), ikon: 'legal'/);
  });
  it('jeder Name, den ein Werkzeug oder eine Ansicht nennt, ist gezeichnet', () => {
    for (const w of WERKZEUGE) expect(Icons[w.icon], w.view).toBeTypeOf('function');
    expect(Icons[ansichtIkon('situationen')]).toBeTypeOf('function');
  });
});
