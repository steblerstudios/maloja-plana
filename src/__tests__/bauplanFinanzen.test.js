// Wächter · Bauplan Lebensbereich, Finanzen (Entwurf Stebler Studios 20.11.2026: «Mischung aus S2 und S3 … gerne mal einbauen»).
// Der Monatsring ist die Szene; jedes Ring-Stück trägt das Bild seines Bereichs; Finanzen spricht in Fünflibern; jedes Bild
// einmal. Blatt: _werkbank/FINANZEN-BAUPLAN-2026-11-20.md, Skizze _werkbank/entwuerfe/finanzen-mischung.html.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import de from '../i18n/de.js';
import { createT } from '../i18n/index.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { DEMO_DATA } from '../config/demoData.js';
import { FinanzenSzene, lohnMuenzen, steuerFranken, notgroschen, vermoegenMuenzen, VermoegenStapel, SteuerMuenzen, Sparschwein, LOHN_GRENZEN, VERMOEGEN_HOECHST } from '../bereiche/finanzen/finanzen.js';
import { ringDaten } from '../components/Monatsring.jsx';
import { InstrumentePanel } from '../components/InstrumentePanel.jsx';

const t = createT({ de }, 'de', 'sie');
const SRC = path.resolve(__dirname, '..');
const lies = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');
const zaehle = (html, attr, wert) => (html.match(new RegExp(attr + '="' + wert + '"', 'g')) || []).length;
const szene = (d) => renderToStaticMarkup(React.createElement(FinanzenSzene, {
  palette: LIGHT_PALETTE, t, data: d, isDarkMode: false, onNavigate: () => {},
  einkommen: 6200, verplant: 3965, titel: 'Jeden Monat bleiben', titelJahr: 'Jedes Jahr bleiben', zahl: 2235, kopf: () => null,
}));

describe('Bauplan Finanzen · jedes Bild einmal in der Szene', () => {
  const html = szene(DEMO_DATA);
  it('Münz-Lohn, Steuer-Münzen, Sparschwein, Drittel-Haus, Thermometer und Kalenderblatt je genau einmal', () => {
    expect(zaehle(html, 'data-bild', 'muenz-lohn')).toBe(1);
    expect(zaehle(html, 'data-bild', 'steuer-muenzen')).toBe(1);
    expect(zaehle(html, 'data-bild', 'steuerfranken')).toBe(0);
    expect(zaehle(html, 'data-bild', 'sparschwein')).toBe(1);
    expect(zaehle(html, 'data-teil', 'drittel-haus')).toBe(1);
    expect(zaehle(html, 'data-teil', 'kalenderblatt')).toBe(1);
    expect((html.match(/data-franchise="klein"/g) || []).length).toBe(1);
    expect(zaehle(html, 'data-teil', 'monatsring')).toBe(1);
    expect(zaehle(html, 'data-bild', 'vermoegen-stapel')).toBe(1);
    expect(zaehle(html, 'data-teil', 'tuer')).toBe(1);
  });
  it('die Bilder hängen an ihren Ring-Stücken: Wohnen und Versicherungen davor, die Steuer-Münzen darunter', () => {
    for (const k of ['wohnen', 'versicherungen']) expect(html).toContain('data-ring-bild="' + k + '"');
    expect(html).not.toContain('data-ring-bild="uebriges"');
    const unter = html.slice(html.indexOf('data-teil="ring-unter-steuern"'));
    expect(unter.indexOf('data-bild="steuer-muenzen"')).toBeGreaterThan(-1);
    expect(unter.indexOf('data-bild="steuer-muenzen"')).toBeLessThan(unter.indexOf('data-gruppe='));
  });
  it('«Was sich daraus ergibt» fliesst ein: IPV am Versicherungs-Stück, Vermögen am Sparschwein, Gesundheitskosten am Thermometer', () => {
    expect(html.slice(html.indexOf('data-teil="ring-unter-versicherungen"'))).toContain('Prämienverbilligung');
    const schwein = html.slice(html.indexOf('data-teil="szene-sparschwein"'), html.indexOf('data-teil="szene-rand"'));
    expect(schwein).toContain('Vermögen');
    expect(html.slice(html.indexOf('data-rand="franchise"'))).toContain('Bezahlte Gesundheitskosten');
  });
  it('Steuer-Münzen: eine Münze = 1 % vom Einkommen, der Bund grau zuerst', () => {
    const s = steuerFranken(DEMO_DATA);
    expect(s.anteilEinkommen).toBeGreaterThan(s.bundAnteilEinkommen);
    const m = html.match(/data-bild="steuer-muenzen" data-prozent="(\d+)"/);
    expect(Number(m[1])).toBe(Math.round(s.anteilEinkommen * 100));
  });
  it('unter der Münzleiste: Brutto und der Weg nach Ausbildung & Arbeit (F7-K4-1), dazu die Steuer am Steuerfranken', () => {
    expect(html).toContain('Wo steht Ihr Lohn? ›');
    expect(html).toContain('brutto');
    expect(html).toContain('data-teil="ring-unter-steuern"');
    expect(html).toContain('So viel Einkommenssteuer im Jahr, grob geschätzt');
    expect(html).toContain('Eine Münze = 1 %');
  });
  it('Hauptzahlen stehen unter bzw. neben ihrem Bild (Regel «Zahl»)', () => {
    expect(html.indexOf('data-instrument-zahl="lohn"')).toBeGreaterThan(html.indexOf('data-bild="muenz-lohn"'));
    expect(html.indexOf('data-instrument-zahl="notgroschen"')).toBeGreaterThan(html.indexOf('data-bild="sparschwein"'));
  });
});

// Stebler Studios 20.11.2026 abends (Skizze finanzen-schwein-stapel.html, gewählt P2 · S-a · V3 · «Steuer eigenes Ring-Stück» ·
// «Tür am Mini-Haus»).
describe('Bauplan Finanzen · Stapel, Schwein, Ring-Stück, Tür', () => {
  const html = szene(DEMO_DATA);
  const svgAttr = (markup, bild) => {
    const m = markup.match(new RegExp('<svg width="(\\d+)" height="(\\d+)"[^>]*data-bild="' + bild + '"'));
    return m ? { b: Number(m[1]), h: Number(m[2]) } : null;
  };
  it('Steuer steht als senkrechter Stapel: höher als breit, leere Münzen bis zur nächsten Zehnerstelle', () => {
    const m = svgAttr(html, 'steuer-muenzen');
    expect(m.h).toBeGreaterThan(m.b);
    const einzeln = renderToStaticMarkup(React.createElement(SteuerMuenzen, { palette: LIGHT_PALETTE, anteil: 0.113, bundAnteil: 0.013 }));
    // 11 volle Münzen (1 Bund grau + 10 gold) und 9 leere bis 20
    expect((einzeln.match(/<ellipse/g) || []).length).toBe(11);
    expect((einzeln.match(/fill="none"/g) || []).length).toBe(9);
  });
  it('Vermögen: dieselbe Münze wie die Steuer (1 % vom Jahreseinkommen), je zehn ein Stapel', () => {
    const vm = vermoegenMuenzen(18500, DEMO_DATA);
    expect(vm.muenzen).toBe(Math.round(18500 / (6200 * 12) * 100));
    expect(html).toContain('data-muenzen="' + vm.muenzen + '" data-stapel="' + Math.ceil(vm.muenzen / 10) + '"');
    expect(vermoegenMuenzen(0, DEMO_DATA)).toBeNull();
    const viel = renderToStaticMarkup(React.createElement(VermoegenStapel, { palette: LIGHT_PALETTE, muenzen: 340 }));
    expect(viel).toContain('data-stapel="' + VERMOEGEN_HOECHST + '"');
    const schwein = html.slice(html.indexOf('data-teil="szene-sparschwein"'), html.indexOf('data-teil="szene-rand"'));
    expect(schwein).toContain('data-bild="vermoegen-stapel"');
    expect(schwein).toContain('vom Einkommen im Jahr');
  });
  it('Sparschwein von vorne: runder Körper als Gefäss, Füllung und Marke «empfohlen»', () => {
    const s = renderToStaticMarkup(React.createElement(Sparschwein, { palette: LIGHT_PALETTE, monate: 4.7 }));
    expect(s).toContain('data-teil="sparschwein-fuellung"');
    expect(s).toContain('data-teil="sparschwein-marke"');
    expect(s).toMatch(/<clipPath[^>]*><circle/);
    expect(s).toContain('data-anteil="78"');
  });
  it('die Steuer ist ein eigenes Ring-Stück, die Vorsorge steht daneben (nicht im Übrigen)', () => {
    expect(html).toContain('data-gruppe="steuern"');
    expect(html).not.toContain('Steuern &amp; Vorsorge');
    const r = ringDaten({ data: DEMO_DATA, t, palette: LIGHT_PALETTE, einkommen: 6200, verplant: 3965, steuerEigen: true });
    const steuern = r.gruppen.find((g) => g.key === 'steuern');
    expect(steuern.posten.map((p) => p.key)).toEqual(['tax']);
    const vorsorge = r.gruppen.find((g) => g.key === 'vorsorge');
    if (vorsorge) expect(vorsorge.posten.every((p) => ['pension3a', 'ahvSelbst', 'bvgSelbst'].includes(p.key))).toBe(true);
    expect(r.gruppen.find((g) => g.key === 'uebriges')?.posten.some((p) => p.key === 'pension3a') ?? false).toBe(false);
    // ohne Schalter bleibt die alte Gruppe (Monatsbudget F8-F1)
    const alt = ringDaten({ data: DEMO_DATA, t, palette: LIGHT_PALETTE, einkommen: 6200, verplant: 3965 });
    expect(alt.gruppen.some((g) => g.key === 'vorsorge')).toBe(false);
  });
  it('die Tür sitzt im Mini-Haus am Wohnen-Stück, nirgends sonst', () => {
    const wohnen = html.slice(html.indexOf('data-ring-bild="wohnen"'));
    expect(wohnen.indexOf('data-teil="tuer"')).toBeGreaterThan(-1);
    expect(wohnen.indexOf('data-teil="tuer"')).toBeLessThan(wohnen.indexOf('data-gruppe="wohnen"'));
  });
});

// Stebler Studios 20.11.2026: «Yes, switch tiles» — die Kacheln zeigen dieselben Bilder wie das Kapitel.
describe('Bauplan Finanzen · Kacheln wie das Kapitel', () => {
  const panel = renderToStaticMarkup(React.createElement(InstrumentePanel, { palette: LIGHT_PALETTE, t, data: DEMO_DATA, onNavigate: () => {}, nur: ['steuer', 'tank'] }));
  it('Steuer-Kachel = Münzstapel mit demselben Prozent wie das Kapitel, Tank-Kachel = Sparschwein', () => {
    expect(zaehle(panel, 'data-bild', 'steuer-muenzen')).toBe(1);
    expect(zaehle(panel, 'data-bild', 'sparschwein')).toBe(1);
    const m = panel.match(/data-bild="steuer-muenzen" data-prozent="(\d+)"/);
    expect(Number(m[1])).toBe(Math.round(steuerFranken(DEMO_DATA).anteilEinkommen * 100));
  });
  it('keine Säule und kein Tank mehr in der Kachel', () => {
    const q = lies('components/InstrumentePanel.jsx');
    expect(q).not.toMatch(/miniSaeule\(|h\(ReserveTank|import \{ ReserveTank/);
  });
});

describe('Bauplan Finanzen · keine eigene Rechnung, nur die bestehenden', () => {
  it('rechnung.js ruft lohnBandState, steuernFuerProfil und reserveTankState', () => {
    const r = lies('bereiche/finanzen/rechnung.js');
    for (const f of ['lohnBandState', 'steuernFuerProfil', 'reserveTankState']) expect(r).toContain(f);
  });
  it('Lohn-Münzen: dieselben vier Zonen wie das Lohn-Barometer', () => {
    expect(LOHN_GRENZEN).toHaveLength(5);
    const l = lohnMuenzen(DEMO_DATA);
    expect(l.show).toBe(true);
    expect(l.fuell).toHaveLength(4);
    // gefüllt ist von links nach rechts: keine Zone ist voller als die vor ihr
    for (let i = 1; i < 4; i++) expect(l.fuell[i] <= l.fuell[i - 1] || l.fuell[i - 1] === 1).toBe(true);
  });
  it('Steuerfranken: Bund ist ein Teil der ganzen Steuer', () => {
    const s = steuerFranken(DEMO_DATA);
    expect(s.total).toBeGreaterThan(s.bund);
    expect(s.bundAnteil).toBeGreaterThan(0);
    expect(s.bundAnteil).toBeLessThan(1);
  });
  it('Sparschwein rechnet wie der Tank (Monate, Empfehlung 3, voll 6)', () => {
    const n = notgroschen(DEMO_DATA);
    expect(n.mode).toBe('months');
    expect(n.recommendMonths).toBe(3);
    expect(n.fullMonths).toBe(6);
  });
});

describe('Bauplan Finanzen · nichts doppelt im Kapitel', () => {
  const a = lies('components/FinanzAuswertung.jsx');
  it('kein grosser Tank mehr unter «Was sich daraus ergibt» (das Sparschwein ist der Notgroschen)', () => {
    expect(a).not.toMatch(/React\.createElement\(ReserveTank/);
  });
  it('der Lohn-Kasten zeigt im Kapitel nur noch den Armutsgrenzen-Befund', () => {
    expect(a).toContain("nurArmutsbefund: true");
  });
  it('das Kapitel ruft die Szene, nicht den Ring allein', () => {
    const k = lies('ChapterView.jsx');
    expect(k).toContain("import('./bereiche/finanzen/finanzen.js')");
    expect(k).not.toContain("import('./components/Monatsring.jsx')");
  });
});
