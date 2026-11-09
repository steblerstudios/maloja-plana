import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Icons } from '../IconKern.jsx';
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
