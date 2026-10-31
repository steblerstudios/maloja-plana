import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Lebenssituationen, { MIT_ANGABEN_ANKER } from '../Lebenssituationen.jsx';
import { AnspruchCheck } from '../AnspruchCheck.jsx';
import { Schnellcheck } from '../Schnellcheck.jsx';
import { finanzWerte } from '../components/FinanzAuswertung.jsx';
import { calculateIPV, ladeIPVModelle } from '../config/cantonalData.js';
import { ipvAnzeige, sozialhilfeAnzeige } from '../data/anspruchWege.js';
import { ANSPRUCH_GRUPPEN } from '../data/anspruchLandkarte.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { DEMO_DATA } from '../config/demoData.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { betrag } from '../utils/geld.js';

// ─────────────────────────────────────────────────────────────
// «Was steht mir zu?» als eine Seite (Entscheid O, 24.10.2026, VERGLEICH.md; gebaut 27.10.2026,
// F7-A3). Oben die eigenen Angaben mit zwei Pegeln (IPV, Sozialhilfe), darunter die Lebenslagen,
// zuunterst die übrigen Wege zugeklappt. Die Pegel rechnen nichts selbst: dieselben Ergebnisse wie
// das Kapitel Finanzen (components/FinanzAuswertung.jsx), sobald die IPV-Kantonsmodelle geladen sind.
// ─────────────────────────────────────────────────────────────

const t = createT({ de }, 'de', 'sie');
const zeichne = (data) => renderToStaticMarkup(React.createElement(Lebenssituationen, { palette: LIGHT_PALETTE, t, data, onNavigate: () => {} }));
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');

// Vor dem Laden der Kantonsmodelle (dieser Test läuft zuerst in der Datei): kein Betrag, kein
// Wasserstand — «Laden», nie ein geratener Wert (beobachtet bei Maria, VERGLEICH.md «(O)»).
describe('vor dem Laden der IPV-Modelle', () => {
  it('Maria: der IPV-Teil sagt «Laden», kein Pegel-Satz', () => {
    expect(ipvAnzeige(DEMO_DATA).art).toBe('laden');
    const html = zeichne(DEMO_DATA);
    expect(html).toContain(de.common.loading);
    expect(html).not.toContain(de.pegel.over);
  });
  it('die Seite zeichnet nach dem Laden neu (ladeIPVModelle + Zähler)', () => {
    const s = quelle('Lebenssituationen.jsx');
    expect(s).toMatch(/ladeIPVModelle\(\)\.then\(\(\) => \{ if \(aktiv\) setIpvGeladen/);
    // Schritt 1 des geführten Checks ebenso.
    expect(quelle('Schnellcheck.jsx')).toMatch(/ladeIPVModelle\(\)\.then\(\(\) => \{ if \(aktiv\) setIpvGeladen/);
  });
});

describe('Beispiel Maria: dieselben Ergebnisse wie das Kapitel Finanzen', () => {
  beforeAll(async () => { await ladeIPVModelle(); });

  it('IPV-Pegel = IPV-Karte (Anspruch und Betrag)', () => {
    const w = finanzWerte(DEMO_DATA, t);
    const a = ipvAnzeige(DEMO_DATA);
    expect(a.art).toBe('pegel');
    expect(a.pegel.variant).toBe('luft');
    expect(a.pegel.eligible).toBe(w.ipv.eligible);
    expect(a.pegel.amount).toBe(w.ipv.eligible ? w.ipv.amount : 0);
    // Maria liegt über der Grenze (ZH-Modell) — Pegel «over», wie die Karte «über Grenze».
    expect(w.ipv.eligible).toBe(false);
    expect(a.pegel.mode).toBe('over');
  });

  it('Sozialhilfe-Pegel = Sozialhilfe-Karte (keine Aufstockung)', () => {
    const w = finanzWerte(DEMO_DATA, t);
    const p = sozialhilfeAnzeige(DEMO_DATA);
    expect(p.variant).toBe('aufstockung');
    expect(p.amount).toBe(w.sozialhilfe.eligible ? w.sozialhilfe.deficit : 0);
    expect(w.sozialhilfe.eligible).toBe(false);
  });

  it('oben stehen beide Pegel in der Live-Region, mit dem Ergebnis-Satz', () => {
    const html = zeichne(DEMO_DATA);
    const status = html.slice(html.indexOf('role="status"'), html.indexOf(de.wasStehtMirZu.lebenslage.sie));
    expect(status).toContain(de.schnellcheck.ipv);
    expect(status).toContain(de.pegel.over);
    expect(status).toContain(de.nav.sozialhilfe);
    expect(status).toContain(de.pegel.vermoegen);
    expect(status).toContain(de.wasStehtMirZu.ergebnisKeiner);
    // Kein Kompass, kein Prämien-Beleg mehr auf dieser Seite.
    expect(quelle('Lebenssituationen.jsx')).not.toMatch(/PraemienBeleg|LeistungsKompass/);
  });

  it('Marken: Einkommen, Miete, KK, Kanton/Haushalt', () => {
    const html = zeichne(DEMO_DATA);
    expect(html).toContain('Netto ' + betrag(6200) + ' / Mt.');
    expect(html).toContain('Miete ' + betrag(1650));
    expect(html).toContain('KK ' + betrag(540.3));
    expect(html).toContain('Zürich · 1 Person(en)');
  });

  const profil = (canton, postalCode, monthlyIncome) => ({
    basis: { canton, dateOfBirth: '1985-04-12', maritalStatus: 'single', household: { adults: 1, children: [] } },
    finanzen: { monthlyIncome, incomeType: 'netto', dreizehnter: 'nein' },
    wohnen: { rentAmount: 1100, postalCode }, versicherungen: { kkPremium: 380 },
  });

  it('mit Anspruch: der Pegel nennt denselben Betrag wie calculateIPV', () => {
    const data = profil('ZH', '8004', 3000);
    const ipv = calculateIPV(data);
    expect(ipv.eligible).toBe(true);
    expect(ipvAnzeige(data).art).toBe('pegel');
    const html = zeichne(data);
    expect(html).toContain(t('pegel.perMonthPossible', { amount: betrag(ipv.amount) }));
    expect(html).toContain(t('wasStehtMirZu.ergebnisEiner', { weg: de.schnellcheck.ipv }));
  });

  it('Kantonsmodell rechnet anders als der Pegel (BE): derselbe Betrag, aber ohne Glas', () => {
    // Fachprüfung 25.10.2026: pegelState misst das rohe Einkommen, das Berner Modell ein anderes —
    // das Wasser stünde über der Linie neben einem Betrag. Dann keine Wasserlinie, nur die Ablesung.
    const data = profil('BE', '3011', 3000);
    const ipv = calculateIPV(data);
    expect(ipv.eligible).toBe(true);
    expect(ipvAnzeige(data).art).toBe('ohneGlas');
    const html = zeichne(data);
    expect(html).toContain(t('pegel.perMonthPossible', { amount: betrag(ipv.amount) }));
    expect(html).not.toContain(de.pegel.over);
    expect(html).not.toContain(de.pegel.grenze);
  });
});

describe('Aufbau der Seite (Fassung-5-Form)', () => {
  const html = zeichne(DEMO_DATA);

  it('Reihenfolge: Mit Ihren Angaben → Nach Ihrer Lebenslage → Weitere Wege → Schritt für Schritt → Hinweise', () => {
    const stellen = [
      de.dashboard.anspruchTitle, de.wasStehtMirZu.mitAngaben.sie, de.wasStehtMirZu.anpassen, 'role="status"',
      de.wasStehtMirZu.lebenslage.sie, de.schnellcheck.moreWays, de.wasStehtMirZu.schrittTitel,
      de.anspruch.footNote.sie, de.schnellcheck.disclaimer.sie, de.dashboard.highlightPrivacy.sie,
    ].map((x) => html.indexOf(x));
    for (const s of stellen) expect(s).toBeGreaterThan(-1);
    expect([...stellen].sort((a, b) => a - b)).toEqual(stellen);
  });

  it('die Sprungmarke «Mit Ihren Angaben» steht am Zwischentitel', () => {
    expect(html).toContain(`id="${MIT_ANGABEN_ANKER}"`);
  });

  it('die elf Lebenslagen als Knöpfe', () => {
    expect((html.match(/aria-pressed=/g) || []).length).toBeGreaterThanOrEqual(11 + 2); // + netto/brutto
  });

  // VERGLEICH.md nennt «15 Einträge»; der Entwurf listet 14 — so viele hat die Landkarte ohne IPV und Sozialhilfe.
  it('Weitere Wege: zugeklappt, die Landkarte ohne IPV und Sozialhilfe (14 Einträge)', () => {
    const teil = html.slice(html.indexOf(de.schnellcheck.moreWays), html.indexOf(de.wasStehtMirZu.schrittTitel));
    const erwartet = ANSPRUCH_GRUPPEN.flatMap((g) => g.items).filter((i) => i.key !== 'ipv' && i.key !== 'sozialhilfe');
    expect(erwartet.length).toBe(14);
    expect(teil).toContain('>14<');
    for (const i of erwartet) expect(teil).toContain(t('anspruch.items.' + i.key + '.label').replace(/&/g, '&amp;'));
    expect(teil).not.toContain(de.anspruch.items.ipv.label);
    expect(teil).not.toContain(de.anspruch.gefuehrtLink); // steht einmal, unten als «Lieber Schritt für Schritt?»
    expect(html).not.toMatch(/<details[^>]*open[^>]*>[^]*?Weitere Wege/);
  });

  it('kein «Leistungs-Schnellcheck» auf der Seite', () => {
    expect(html).not.toContain(de.schnellcheck.title);
  });

  it('ohne Einkommen: «Angaben anpassen» ist offen, der Satz lädt zum Eintragen ein', () => {
    const leer = zeichne({});
    expect(leer).toMatch(/<details open=""/);
    expect(leer).toContain(de.schnellcheck.enterIncome.sie);
  });
});

describe('Geführter Anspruch-Check: eigener Ablauf, nur von hier', () => {
  it('Schritt 1 ohne den Titel «Leistungs-Schnellcheck»', () => {
    const html = renderToStaticMarkup(React.createElement(AnspruchCheck, { palette: LIGHT_PALETTE, t, data: DEMO_DATA, onNavigate: () => {} }));
    expect(html).not.toContain(de.schnellcheck.title);
    expect(html).toContain(de.anspruchCheck.stepIncome);
  });
  it('Schritt 2 ist dieselbe Auswahl wie auf der Seite, «Fertig» führt zurück', () => {
    const s = quelle('AnspruchCheck.jsx');
    expect(s).toContain('React.createElement(LebenslagenAuswahl');
    expect(s).not.toContain("onNavigate('ansprueche')");
    expect(s).toContain("onNavigate('situationen')");
  });
  it('die Seite führt mit «Lieber Schritt für Schritt?» hinein', () => {
    expect(quelle('Lebenssituationen.jsx')).toContain("onNavigate('anspruchcheck')");
  });
  it('der Schnellcheck rendert ohne Landkarte und ohne eigene Seite', () => {
    const html = renderToStaticMarkup(React.createElement(Schnellcheck, { palette: LIGHT_PALETTE, t, data: {}, onNavigate: () => {} }));
    expect(html).not.toContain(de.schnellcheck.title);
    expect(quelle('Schnellcheck.jsx')).not.toContain('LandkarteGruppen');
  });
});
