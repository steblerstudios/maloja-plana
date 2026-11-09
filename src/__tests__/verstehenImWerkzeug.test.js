import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { VerstehenImWerkzeug, VERSTEHEN, KANTONSKARTE, NachladeGrenze } from '../components/ErklaerseiteLink.jsx';
import KantonsKarteKlein from '../components/KantonsKarteKlein.jsx';
import ErklaerFigurKlein from '../components/ErklaerFigurKlein.jsx';
import { KARTEN, KARTE_GEO, STUFEN_FARBEN } from '../data/kantonskarten.js';
import { ERKLAERFIGUREN } from '../data/erklaerfiguren.js';
import { erzeugeKarten, erzeugeFiguren, svgVerstoesse } from '../../scripts/app-verstehen.mjs';
import { STUFEN_FARBEN as ATLAS_FARBEN, LEGENDE } from '../../scripts/seiten/kantonsatlas.mjs';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { LIGHT_PALETTE, DARK_PALETTE } from '../config/constants.js';

// C + D, Entscheid Stebler Studios 09.11.2026 («Ja, C + D bauen»): Karte mit dem eigenen Kanton und
// Erklärfigur direkt im Werkzeug, Pilot Kapitel Versicherungen. Die Daten erzeugt
// scripts/app-verstehen.mjs aus denselben Quellen wie /kantonsatlas/ und /krankenkasse/.
// Nachgeschärft nach den sechs Prüfern vom 09.11.2026 (Fachlogik, a11y, Sicherheit, Qualität, Gestaltung, Wording).
const SRC = path.resolve(__dirname, '..');
const quelle = (datei) => fs.readFileSync(path.resolve(SRC, datei), 'utf8');
const t = createT({ de }, 'de', 'sie');
const P = LIGHT_PALETTE;
const karte = (palette, k, kanton) => renderToStaticMarkup(React.createElement(KantonsKarteKlein, { palette, t, karte: k, kanton }));

describe('Erzeugte Daten sind frisch (eine Quelle mit den öffentlichen Seiten)', () => {
  it('src/data/kantonskarten.js = was scripts/app-verstehen.mjs jetzt erzeugt', () => {
    expect(quelle('data/kantonskarten.js')).toBe(erzeugeKarten());
  });
  it('src/data/erklaerfiguren.js = was scripts/app-verstehen.mjs jetzt erzeugt', () => {
    expect(quelle('data/erklaerfiguren.js')).toBe(erzeugeFiguren());
  });
  it('Stufenfarben und Legenden sind die des Atlas, nicht abgeschrieben', () => {
    expect(STUFEN_FARBEN).toEqual(ATLAS_FARBEN);
    expect(quelle('components/KantonsKarteKlein.jsx')).not.toMatch(/#[0-9A-Fa-f]{6}/);
    for (const [k, K] of Object.entries(KARTEN)) expect(LEGENDE[k], k).toContain(K.legende);
  });
});

describe('Die Karte (C)', () => {
  it('26 Kantone, jede Karte hat einen Wert und eine Stufe 1–4 je Kanton', () => {
    expect(Object.keys(KARTE_GEO.kantone)).toHaveLength(26);
    for (const K of Object.values(KARTEN)) {
      expect(Object.keys(K.werte)).toHaveLength(26);
      for (const w of Object.values(K.werte)) expect([1, 2, 3, 4]).toContain(w.s);
    }
  });

  it('der Anker jeder Karte ist dieselbe Karte, auf die der Textlink zeigt', () => {
    for (const [view, v] of Object.entries(VERSTEHEN)) {
      expect(KANTONSKARTE[view], view).toBe(`/kantonsatlas/#${KARTEN[v.karte].anker}`);
    }
  });

  it('mit Kanton: markiert, Wert und Schweiz daneben, kein Platz', () => {
    const html = karte(P, 'praemie', 'ZH');
    expect(html.match(/data-eigen="ja"/g)).toHaveLength(1);
    expect(html).toContain(`${t('cantons.ZH')}: `);
    expect(html).toContain(KARTEN.praemie.werte.ZH.text);
    expect(html).toContain(KARTEN.praemie.ch);
    expect(html).not.toMatch(/Platz|Rang\b|\d+\. von 26/);
  });

  // Swiss-Precision-Prüfung: In der App fehlten Jahr, Rahmung und Quelle, die auf der Atlas-Seite stehen.
  it('Jahr, Rahmung und Quelle stehen bei der Karte', () => {
    expect(karte(P, 'praemie', 'ZH')).toContain('Erwachsene 2027');
    const last = karte(P, 'lastNachIpv', 'ZH');
    expect(last).toContain('nicht die Last einer bestimmten Person');
    expect(last).toContain('Prämie 2026, dem Einkommen 2022 und der Verbilligung 2025');
    for (const K of Object.values(KARTEN)) {
      expect(K.quellen.length).toBeGreaterThan(0);
      for (const q of K.quellen) expect(q.url).toMatch(/^https:\/\/[^/]+\/.+/);
    }
  });

  // «Beides» (Sophie 09.11.2026): bei der Last nach Verbilligung auch die Last davor, als Zahl, nicht als Karte.
  it('Last nach Verbilligung: Tabelle vor/nach für den Kanton und die Schweiz, Werte aus der Atlas-Datei', () => {
    const last = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'scripts', 'daten', 'kantonsatlas', 'last.json'), 'utf8'));
    const pz = (n) => `${Number(n).toFixed(1).replace('.', ',')} %`;
    const html = karte(P, 'lastNachIpv', 'ZH');
    expect(html).toContain('data-teil="vor-nach"');
    const zeileZH = html.match(new RegExp(`<tr><th scope="row"[^>]*>${t('cantons.ZH')}</th>(.*?)</tr>`))[1];
    expect(zeileZH.match(/<td[^>]*>([^<]+)<\/td>/g).map((z) => z.replace(/<[^>]+>/g, ''))).toEqual([pz(last.ZH.lastSingle), pz(last.ZH.lastNachIpv)]);
    const zeileCH = html.match(new RegExp(`<tr><th scope="row"[^>]*>${t('erklaerseite.ganzeSchweiz')}</th>(.*?)</tr>`))[1];
    expect(zeileCH.match(/<td[^>]*>([^<]+)<\/td>/g).map((z) => z.replace(/<[^>]+>/g, ''))).toEqual([pz(last.CH.lastSingle), pz(last.CH.lastNachIpv)]);
    // Spaltenköpfe in dieser Reihenfolge: erst vor, dann nach
    expect(html.indexOf('Prämienlast vor Verbilligung')).toBeLessThan(html.indexOf('Prämienlast nach Verbilligung</th>'));
    // ohne Kanton: nur die Schweiz und der Hinweis
    const ohne = karte(P, 'lastNachIpv', '');
    expect(ohne.match(/<tr><th scope="row"/g)).toHaveLength(1);
    expect(ohne).toContain(`«${t('chapters.basis.title')}»`);
    // bei der Prämie keine Tabelle
    expect(karte(P, 'praemie', 'ZH')).not.toContain('data-teil="vor-nach"');
  });

  // a11y-Prüfung: ein Ring in Textfarbe allein verschwand auf der dunkelsten Stufe (hell 2,1:1, dunkel 1,2:1).
  it('zwei Ringe, breiter aussen in der Flächenfarbe, in Bildschirm-Pixeln', () => {
    for (const palette of [P, DARK_PALETTE]) {
      const html = karte(palette, 'praemie', 'TI');
      const ringe = [...html.matchAll(/<path d="[^"]+" fill="none" stroke="([^"]+)" stroke-width="([\d.]+)" vector-effect="non-scaling-stroke"/g)];
      expect(ringe.map((r) => r[1])).toEqual([palette.surface, palette.text]);
      expect(Number(ringe[0][2])).toBeGreaterThan(Number(ringe[1][2]));
    }
  });

  it('ohne Kanton: keine Markierung, ein Hinweis mit dem echten Namen des Bereichs', () => {
    const html = karte(P, 'lastNachIpv', '');
    expect(html).not.toContain('data-eigen');
    expect(html).toContain(`«${t('chapters.basis.title')}»`);
    expect(t('erklaerseite.ohneKanton')).not.toContain('Grunddaten');
  });

  it('dunkler Modus: dunkle Stufen des Atlas und der passende Satz', () => {
    const hell = karte(P, 'praemie', 'BE');
    const dunkel = karte(DARK_PALETTE, 'praemie', 'BE');
    expect(hell).toContain(STUFEN_FARBEN.hell[4]);
    expect(dunkel).toContain(STUFEN_FARBEN.dunkel[4]);
    expect(dunkel).not.toContain(STUFEN_FARBEN.hell[4]);
    expect(hell).toContain(t('erklaerseite.stufenHinweis'));
    expect(dunkel).toContain(t('erklaerseite.stufenHinweisDunkel'));
    expect(dunkel).not.toContain(t('erklaerseite.stufenHinweis'));
    // Der Vorlesetext darf keine Farbe behaupten, die nur in einem Modus stimmt.
    expect(t('erklaerseite.karteBeschreibungMit')).not.toMatch(/dunkl|hell/i);
  });
});

describe('Die Erklärfigur (D)', () => {
  // Sicherheitsprüfung: Erlaubnisliste statt Verbotsliste.
  it('das SVG hält die Erlaubnisliste, mit Titel für Vorlese-Programme', () => {
    for (const F of Object.values(ERKLAERFIGUREN)) {
      expect(svgVerstoesse(F.svg)).toEqual([]);
      expect(F.svg).toMatch(/^<svg [^>]*role="img"/);
      expect(F.svg).toContain('<title id=');
    }
  });

  it('die Erlaubnisliste weist ab, was die alte Verbotsliste durchliess', () => {
    expect(svgVerstoesse('<svg><style>body{display:none}</style></svg>')).toContain('Element <style>');
    expect(svgVerstoesse('<svg><a href="//fremd.ch"><path d="M0 0"/></a></svg>')).toContain('Element <a>');
    expect(svgVerstoesse('<svg><use href="//fremd.ch#x"/></svg>')).toContain('Element <use>');
    expect(svgVerstoesse('<svg><img src="x"></svg>')).toContain('Element <img>');
    expect(svgVerstoesse("<svg><path onclick='x' d='M0 0'/></svg>")).toContain('Attribut onclick');
    expect(svgVerstoesse('<svg><rect fill="url(//fremd.ch/x)"/></svg>')).toContain('url(//fremd.ch/x)');
  });

  it('jede id ist eindeutig vorgesilbt, und jeder Verweis zeigt auf eine vorhandene id', () => {
    for (const F of Object.values(ERKLAERFIGUREN)) {
      const ids = [...F.svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
      for (const id of ids) expect(id).toMatch(/^app-/);
      const verweise = [...F.svg.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1])
        .concat(...[...F.svg.matchAll(/aria-labelledby="([^"]+)"/g)].map((m) => m[1].split(' ')));
      for (const v of verweise) expect(ids, v).toContain(v);
    }
  });

  it('Quelle als Link auf den Artikel, weitere Stellen genannt', () => {
    const F = ERKLAERFIGUREN.kostenteil;
    expect(F.quellen.length).toBeGreaterThan(0);
    for (const q of F.quellen) expect(q.url).toMatch(/^https:\/\/[^/]+\/.+/);
    expect(F.quellen.some((q) => q.url.endsWith('#art_64'))).toBe(true);
    expect(F.weitereStellen).toMatch(/KVV Art\. 93 und 103/);
  });

  it('die bewegte Fassung ist ein Link auf eine Seite, die es gibt (kein Rahmen)', () => {
    const html = renderToStaticMarkup(React.createElement(ErklaerFigurKlein, { palette: P, t, figur: 'kostenteil' }));
    expect(html).not.toContain('<iframe');
    expect(html).toContain('href="/krankenkasse/bewegt/kostenteil/"');
    expect(html).toContain('target="_blank"');
    expect(fs.existsSync(path.resolve(process.cwd(), 'public', 'krankenkasse', 'bewegt', 'kostenteil', 'index.html'))).toBe(true);
  });

  // a11y-Prüfung: «Quelle» und der Linktext sind übersetzt und dürfen nicht als Deutsch vorgelesen werden.
  it('lang="de" nicht auf der ganzen Figur, nur auf den deutschen Teilen', () => {
    const html = renderToStaticMarkup(React.createElement(ErklaerFigurKlein, { palette: P, t, figur: 'kostenteil' }));
    expect(html).toMatch(/^<figure data-teil="erklaerfigur-klein" style/);
    expect(html).toContain(`<p lang="de" style="margin:4px 0 0;font-size:15px;color:${P.text}">${ERKLAERFIGUREN.kostenteil.legende.replace(/'/g, '&#x27;')}</p>`);
  });
});

describe('Erst beim Aufklappen geladen', () => {
  it('zu: nur die Zeilen, weder Karte noch Figur im Markup, Ansage-Zeile schon da', () => {
    const html = renderToStaticMarkup(React.createElement(VerstehenImWerkzeug, { palette: P, t, view: 'praemien', kanton: 'ZH' }));
    expect(html).toContain(t('erklaerseite.karteMitKanton'));
    expect(html).toContain(t('erklaerseite.imBild'));
    expect(html).not.toContain('data-kanton');
    expect(html).not.toContain('mp-hl');
    expect(html.match(/role="status" aria-live="polite"/g)).toHaveLength(2);
    // wie die übrigen Aufklapper der App
    expect(html.match(/class="mp-summary"/g)).toHaveLength(2);
  });

  it('ohne Kanton heisst die Zeile anders', () => {
    const html = renderToStaticMarkup(React.createElement(VerstehenImWerkzeug, { palette: P, t, view: 'premium', kanton: '' }));
    expect(html).toContain(t('erklaerseite.karteOhneKanton'));
    expect(html).not.toContain(t('erklaerseite.imBild'));
  });

  // Qualitätsprüfung: Nach einem Ladefehler half nur ein Neuladen der Seite.
  it('nach einem Ladefehler: Satz, Knopf «Nochmals versuchen», und der Knopf löst einen neuen Versuch aus', () => {
    const nochmals = vi.fn();
    const onFehler = vi.fn();
    const g = new NachladeGrenze({ palette: P, t, nochmals, onFehler, children: 'inhalt' });
    g.state = NachladeGrenze.getDerivedStateFromError(new Error('Failed to fetch dynamically imported module'));
    const spion = vi.spyOn(console, 'error').mockImplementation(() => {});
    g.componentDidCatch(new Error('x'));
    spion.mockRestore();
    expect(onFehler).toHaveBeenCalledOnce();
    const el = g.render();
    const html = renderToStaticMarkup(el);
    expect(html).toContain(t('erklaerseite.ladeFehler'));
    expect(html).toContain(t('erklaerseite.nochmals'));
    const knopf = el.props.children.find((c) => c && c.type === 'button');
    knopf.props.onClick();
    expect(nochmals).toHaveBeenCalledOnce();
    // Ein neuer Versuch braucht ein neues React.lazy: der Aufklapper baut es je Versuch neu.
    expect(quelle('components/ErklaerseiteLink.jsx')).toMatch(/useMemo\(\(\) => React\.lazy\(laden\), \[laden, versuch\]\)/);
  });

  // Qualitätsprüfung: Der alte Wächter las nur einzeilige Importe in src/*.jsx.
  it('kein statischer Import der beiden Teile oder ihrer Daten, nirgends in src/', () => {
    const statisch = /(^|\n)\s*import[^(]*?from\s*['"][^'"]*(KantonsKarteKlein|ErklaerFigurKlein|data\/kantonskarten|data\/erklaerfiguren)(\.jsx?)?['"]/;
    const erlaubt = new Set(['components/KantonsKarteKlein.jsx', 'components/ErklaerFigurKlein.jsx']);
    const lauf = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) return e.name === '__tests__' ? [] : lauf(p);
      return /\.(jsx?|mjs)$/.test(e.name) ? [p] : [];
    });
    const dateien = lauf(SRC);
    expect(dateien.length).toBeGreaterThan(100);
    for (const d of dateien) {
      const rel = path.relative(SRC, d);
      if (erlaubt.has(rel)) continue;
      expect(fs.readFileSync(d, 'utf8'), rel).not.toMatch(statisch);
    }
    // die Probe: der Ausdruck erkennt auch mehrzeilige Importe
    expect("import {\n  KARTEN,\n} from '../data/kantonskarten.js';").toMatch(statisch);
  });

  // Wenn ein Build da ist: das Startbündel enthält weder Kartenpfade noch die Figur.
  it.skipIf(!fs.existsSync(path.resolve(process.cwd(), 'dist', 'assets')))('Build: Karte und Figur in eigenen Chunks, nicht im Startbündel', () => {
    const assets = fs.readdirSync(path.resolve(process.cwd(), 'dist', 'assets'));
    expect(assets.some((f) => /^KantonsKarteKlein-.*\.js$/.test(f))).toBe(true);
    expect(assets.some((f) => /^ErklaerFigurKlein-.*\.js$/.test(f))).toBe(true);
    for (const f of assets.filter((n) => /^index-.*\.js$/.test(n))) {
      const inhalt = fs.readFileSync(path.resolve(process.cwd(), 'dist', 'assets', f), 'utf8');
      expect(inhalt, f).not.toContain(KARTE_GEO.kantone.ZH.slice(0, 40));
      expect(inhalt, f).not.toContain('app-kostenteil-hl-fd1');
    }
  });

  it.each([['PraemienOrientierung.jsx', 'praemien'], ['PremiumSubsidy.jsx', 'premium']])('%s zeigt den Block', (datei, view) => {
    expect(quelle(datei)).toMatch(new RegExp(`VerstehenImWerkzeug, \\{ palette, t, view: '${view}', kanton:`));
  });
});
