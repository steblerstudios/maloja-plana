import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Icons, muenzenBereit } from '../IconKern.jsx';
import '../IconSystem.jsx';
import { WERKZEUGE } from '../data/werkzeugRegister.js';
import { ansichtIkon } from '../config/ansichtenRegister.js';

// Icon-Plan November 2026, Bauplan B5a (Entscheid Stebler Studios 08.11.2026, «Ja, B5 starten»).
// Funktions-Zeichen nach der Icon-Besprechung: eine Bedeutung, ein Zeichen.
const lies = (d) => readFileSync(resolve(__dirname, '..', d), 'utf8');
const reg = Object.fromEntries(WERKZEUGE.map((w) => [w.view, w.icon]));

describe('B5a · Funktions-Zeichen', () => {
  it('Merkliste = Lesezeichen — überall (Register, Werkzeug-Gruppen, Boden-Anker)', () => {
    expect(reg.merkliste).toBe('lesezeichen');
    expect(lies('components/WerkzeugGruppen.jsx')).toMatch(/view: 'merkliste', icon: 'lesezeichen'/);
    expect(lies('main.jsx')).toMatch(/key: 'merkliste', label: t\('nav\.merkliste'\), icon: 'lesezeichen'/);
  });
  it('Offizielle Links = Kette, Flyer = Teilen (nie mehr Tresor oder Globus)', () => {
    expect(reg.direktlinks).toBe('kette');
    expect(reg.flyer).toBe('teilen');
    expect(lies('components/WerkzeugGruppen.jsx')).not.toMatch(/dokumentTresor/);
  });
  it('Drucken = Drucker, Als App installieren = Handy ohne Abzeichen', () => {
    expect(ansichtIkon('drucken')).toBe('drucker');
    expect(ansichtIkon('installApp')).toBe('handy');
    expect(lies('UnterlagenDrucken.jsx')).toMatch(/name: 'drucker'/);
  });
  it('weggefallen: success, qr, dokumentTresor, exportTool, kalenderUhr', () => {
    expect(['success', 'qr', 'dokumentTresor', 'exportTool', 'kalenderUhr'].filter((n) => Icons[n])).toEqual([]);
  });
});

// Bauplan B5b (08.11.2026): die Leiste nach der Icon-Besprechung 07.11. («G» und «B»).
describe('B5b · Leiste, Schulden-Reiter, Lebensmappe', () => {
  it('① Übersicht = Feldstecher, ④ Was steht mir zu? = Wegweiser, ⑤ Menü = Sackmesser (offen, solange das Menü offen ist)', () => {
    const main = lies('main.jsx');
    expect(main).toMatch(/key: 'dashboard', label: t\('nav\.dashboard'\), icon: 'feldstecher'/);
    expect(main).toMatch(/key: 'situationen', label: t\('dashboard\.anspruchTitle'\), icon: 'wegweiser'/);
    expect(main).toMatch(/key: 'menu', label: t\('nav\.menu'\), icon: 'sackmesser', active: false, offen: menuOffen/);
    expect(main).toMatch(/SackmesserIcon, \{ open: !!it\.offen/);
    expect(main).toMatch(/menuOffen: mobileNavOpen/);
    expect(lies('MobileNav.jsx')).toMatch(/navItem\('dashboard', t\('nav\.dashboard'\), 'feldstecher'/);
  });
  it('die drei Striche und das Geschenk gibt es nicht mehr', () => {
    expect(['menue', 'geschenk'].filter((n) => Icons[n])).toEqual([]);
  });
  it('Schulden-Reiter «Übersicht» = Balken; Lebensmappe = Ordner + du (grünes Abzeichen aus der Ast-Variablen)', () => {
    expect(lies('SchuldenManager.jsx')).toMatch(/key: 'overview', icon: 'balken'/);
    expect(ansichtIkon('lebensmappe')).toBe('lebensmappe');
    expect(lies('IconSystem.jsx')).toMatch(/fill: 'var\(--mp-ast-person, #5A7868\)'/);
  });
});

// Bauplan B5c (08.11.2026): Kalender mit Abzeichen (Punkt 8 «C»).
describe('B5c · Kalender mit Abzeichen', () => {
  it('«Frist erfassen» = Kalender + Plus (leer); überfällig = rotes !, heute fällig = blaue Sanduhr', () => {
    expect(lies('main.jsx')).toMatch(/key: 'calendar', label: t\('nav\.capFrist'\), icon: 'kalenderPlus'/);
    expect(lies('OverdueBanner.jsx')).toMatch(/name: overdue\.length > 0 \? 'kalenderUeberfaellig' : 'kalenderFrist'/);
    expect(lies('OverdueBanner.jsx')).not.toMatch(/'cowbell'/);
  });
  it('Rollenfarben aus der Palette: Blau = Fristen, Rot = warnen', () => {
    expect(lies('main.jsx')).toMatch(/setProperty\('--mp-frist', palette\.sky\); document\.documentElement\.style\.setProperty\('--mp-warnen', palette\.rose\)/);
    expect(lies('IconMuenzen.jsx')).toMatch(/sanduhr: 'var\(--mp-frist, /);
    expect(lies('IconMuenzen.jsx')).toMatch(/ausruf: 'var\(--mp-warnen, /);
    // «+ eintragen» bleibt leer: kein Farbeintrag, Ring und Plus in Textfarbe.
    expect(lies('IconMuenzen.jsx')).not.toMatch(/plus: 'var\(/);
  });
  it('gezeichnet: jedes Zeichen trägt sein eigenes Abzeichen, Farbe nur bei Frist und überfällig', async () => {
    await muenzenBereit();
    const z = (n) => renderToStaticMarkup(React.createElement(Icons[n]));
    expect(z('kalenderPlus')).toContain('d="M15.9 18.3 H20.7 M18.3 15.9 V20.7"');
    expect(z('kalenderPlus')).not.toMatch(/var\(--mp-/);
    expect(z('kalenderFrist')).toContain('d="M16.6 15.9 H20 L18.3 18.3 Z M16.6 20.7 H20 L18.3 18.3 Z"');
    expect(z('kalenderFrist')).toMatch(/fill:var\(--mp-frist/);
    expect(z('kalenderUeberfaellig')).toContain('d="M18.3 15.7 V18.6 M18.3 20.7 V20.75"');
    expect(z('kalenderUeberfaellig')).toMatch(/fill:var\(--mp-warnen/);
    // der Kalender selbst ist drin (Tagesdatum), unten rechts freigeschnitten
    expect(z('kalenderFrist')).toMatch(/<mask id="kal[^"]+a"/);
  });
  it('zwei Kalender nebeneinander bekommen verschiedene Masken', () => {
    const zwei = renderToStaticMarkup(React.createElement('div', null,
      React.createElement(Icons.kalenderFrist, { key: 1 }), React.createElement(Icons.kalenderFrist, { key: 2 })));
    const ids = [...zwei.matchAll(/<mask id="([^"]+)"/g)].map((m) => m[1]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBe(4);
  });
  it('der kleine Knopf «Frist eintragen» (16 px) bleibt beim einfachen Kalender (unter 20 px einfach, 4b)', () => {
    expect(lies('AblaufSchale.jsx')).toMatch(/const zeichen = React\.createElement\(Icon, \{ name: 'calendar', size: 16 \}\);/);
  });
});
