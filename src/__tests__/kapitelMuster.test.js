// Muster für alle Kapitel M1–M8 (Fassung 6, Sophie 25.10.2026: «Bau M1 bis M8»).
// Befunde und Entscheid: docs/design/mockups-stardust-2026-10-23/VERGLEICH.md «Muster für alle Kapitel»
// (Zweig docs/mockups-stardust). Entwurf: seiten-v5.html?nur=z (Wohnen) und die anderen Kapitel.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterViewComplete } from '../ChapterView.jsx';
import { getChapters, LIGHT_PALETTE, DARK_PALETTE } from '../config/constants.js';
import { ausgabenPosten } from '../components/Geldfluss.jsx';
import { bereichsTon } from '../utils/lebensbereichFruechte.js';
import { getBereichForChapter } from '../data/lebensbereiche.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { DEMO_DATA } from '../config/demoData.js';

const t = createT({ de }, 'de', 'sie');
const chapters = getChapters(t);
const kapitel = (k) => chapters.find((c) => c.key === k);
const render = (key, data = DEMO_DATA[key], extra = {}) => renderToStaticMarkup(React.createElement(ChapterViewComplete, {
  palette: LIGHT_PALETTE, t, chapter: kapitel(key), data, allData: { ...DEMO_DATA, [key]: data },
  onUpdate: () => {}, onUpdateIn: () => {}, onNavigate: () => {}, ...extra,
}));
const nurText = (html) => html.replace(/\u00AD/g, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/[ \t\n]+/g, ' '); // geschützte Leerzeichen bleiben
const QUELLE = fs.readFileSync(path.resolve(__dirname, '../ChapterView.jsx'), 'utf8');

describe('M1 · Angaben als eine ruhige Liste', () => {
  it('eine Liste, keine Karte je Abschnitt (kein gestrichelter oder getönter Kasten)', () => {
    const html = render('wohnen');
    const liste = html.slice(html.indexOf('data-teil="angaben-liste"'));
    expect(html).toContain('data-teil="angaben-liste"');
    expect(liste.slice(0, liste.indexOf('data-teil="passend"'))).not.toMatch(/<section[^>]*style="[^"]*(dashed|background:)/);
  });
  it('PLZ und Ort in einer Zeile', () => {
    const text = nurText(render('wohnen'));
    expect(text).toContain('PLZ · Ort 8004\u00a0Zürich');
    expect(text).not.toMatch(/Postleitzahl 8004/);
  });
});

describe('M1 · Feldnamen ohne das, was der Wert schon sagt', () => {
  const name = (lang, texte) => {
    const tt = createT({ [lang]: texte }, lang, 'sie');
    const html = renderToStaticMarkup(React.createElement(ChapterViewComplete, {
      palette: LIGHT_PALETTE, t: tt, chapter: getChapters(tt).find((c) => c.key === 'wohnen'), data: { ...DEMO_DATA.wohnen, rooms: '' },
      allData: DEMO_DATA, onUpdate: () => {}, onUpdateIn: () => {}, onNavigate: () => {},
    }));
    return nurText(html);
  };
  it.each([['de', de, 'Nettomiete (ohne Nebenkosten) CHF', 'Nicht erfasst: Anzahl Zimmer.'], ['fr', fr, 'Loyer net (sans charges) CHF', 'Nombre de pièces.'],
    ['it', it_, 'Affitto netto (senza spese accessorie) CHF', 'Numero di locali.'], ['en', en, 'Net rent (without utilities) CHF', 'Number of rooms.'], ['rm', rm, 'Tschains net (senza custs accessorics) CHF', 'Dumber da stanzas.']])(
    '%s: «CHF/Monat» und das Eingabe-Beispiel fallen in der Liste weg', (lang, texte, miete, zimmer) => {
      const text = name(lang, texte);
      expect(text).toContain(miete);
      expect(text).toContain(zimmer);
    });
});

describe('M2 · «x von n» und das Fehlende', () => {
  it('am Abschnitt «x von n», das Übrige leise in «Nicht erfasst: …»', () => {
    const html = render('versicherungen');
    expect(html).toMatch(/data-erfasst="6\/7"[^>]*><span aria-hidden="true">6 von 7<\/span><span[^>]*>6 von 7 Angaben erfasst</);
    expect(nurText(html)).toContain('Nicht erfasst: Zusatzversicherung.');
  });
  it('Prämie nur mit ihrer Versicherung: ohne Lebensversicherung fehlt keine Prämie (31.10.2026)', () => {
    expect(nurText(render('versicherungen'))).not.toContain('Lebensversicherung Prämie');
    const mit = nurText(render('versicherungen', { ...DEMO_DATA.versicherungen, lifeInsurance: 'yes' }));
    expect(mit).toContain('Lebensversicherung Prämie');
    const betrag = nurText(render('versicherungen', { ...DEMO_DATA.versicherungen, lifeInsurance: 'no', lifeInsurancePremium: '600' }));
    expect(betrag).toContain('Lebensversicherung Prämie');
  });
  it('wichtige leere Felder (Grundordnung, empfohlen) mit «ergänzen ›»', () => {
    const html = render('basis', { ...DEMO_DATA.basis, phone: '' });
    expect(html).toMatch(/data-fehlt="phone"[\s\S]*?ergänzen ›/);
  });
  it('Finanzen: die Nebenerwerb-Felder fehlen erst mit Nebenerwerb', () => {
    expect(render('finanzen')).not.toMatch(/data-fehlt="side|Nicht erfasst:[^<]*Nebenerwerb/);
  });
});

describe('M2 · Wohnen: Eigentum nur, wo es gilt (Fachprüfung 25.10.2026)', () => {
  it('der Aufenthaltstyp steht bei der Adresse; Eigentum ohne Angabe steht in «… · noch leer»', () => {
    const html = render('wohnen');
    const adresse = nurText(html.slice(html.indexOf('id="mp-section-address"'), html.indexOf('id="mp-section-rentAmount"')));
    expect(adresse).toContain('Aufenthaltstyp Hauptwohnsitz');
    expect(nurText(html.split('data-teil="leere-abschnitte"')[1])).toMatch(/^[^›]*Eigentum ergänzen › noch leer/);
  });
  it('Hypothek «Nein»: Zins, Immobilienwert und Gebäudeversicherung fehlen nicht', () => {
    const html = render('wohnen', { ...DEMO_DATA.wohnen, mortgageStatus: 'no' });
    const eigentum = nurText(html.slice(html.indexOf('id="mp-section-mortgageStatus"')));
    // «Hypothek vorhanden? Nein» ist die einzige Angabe, die zählt — der Abschnitt ist damit vollständig
    expect(eigentum).not.toMatch(/^\s*Eigentum \d+ von/);
    expect(eigentum).not.toContain('Nicht erfasst: Hypothekarzins');
  });
});

describe('M3 · leere Abschnitte in einer Zeile', () => {
  it('Versicherungen (Maria): «Mobilität · Sozialversicherung» mit «ergänzen ›» und «noch leer»', () => {
    const html = render('versicherungen');
    const leer = html.slice(html.indexOf('data-teil="leere-abschnitte"'));
    expect(nurText(leer)).toMatch(/^[^›]*Mobilität · Sozialversicherung ergänzen › noch leer/);
  });
});

describe('M4 · Einheiten und Namen im Wert', () => {
  it('Franchise «CHF 1’500», «Pensionskasse», Kennnummer am Stück', () => {
    const text = nurText(render('versicherungen'));
    expect(text).toContain('Franchise CHF\u00a01’500');
    expect(text).toContain('Pensionskasse BVK');
    expect(text).not.toContain('BVG/Pensionskasse');
    // am Stück per CSS (nowrap), der Text bleibt beim Kopieren dieselbe Nummer
    expect(render('versicherungen')).toMatch(/white-space:nowrap">CSS-2024-7788991</);
  });
  it('Wochenstunden mit Einheit', () => {
    expect(nurText(render('ausbildung'))).toContain('42\u00a0Std./Woche');
  });
});

describe('M6 · «Als Nächstes» ruhig', () => {
  it('zentriert, Umrissknopf statt Goldknopf, keine Versalien', () => {
    const html = render('wohnen', DEMO_DATA.wohnen, { nextChapter: kapitel('finanzen'), onNext: () => {} });
    const ende = html.slice(html.indexOf('data-teil="als-naechstes"'));
    expect(ende).toMatch(/^[^>]*text-align:center/);
    expect(ende).toMatch(/<button[^>]*border:1px solid[^>]*border-radius:9999px[^>]*background:transparent/);
    expect(ende).not.toMatch(/text-transform:uppercase/);
  });
  it('Notfall: «Alle Kapitel durchgegangen» mit «Ihre Daten bleiben auf diesem Gerät.»', () => {
    const text = nurText(render('notfall'));
    expect(text).toContain('Alle Kapitel durchgegangen');
    expect(text).toContain('Ihre Daten bleiben auf diesem Gerät.');
  });
});

describe('M7 · Passend wie im Entwurf', () => {
  it('Wohnen: Untertitel aus dem Entwurf, Umzug mit 4 Schritten', () => {
    const passend = nurText(render('wohnen').split('data-teil="passend"')[1]);
    for (const s of ['Umzug Ablauf · 4 Schritte', 'Nur in einzelnen Kantonen und Gemeinden · je nach Einkommen', 'Ablauf · Fristen und Anfechtung', 'Mietvertrag ablegen Unterlagen · Mietvertrag']) expect(passend, s).toContain(s);
  });
  it('Ausbildung: Namen aus dem Entwurf', () => {
    const passend = nurText(render('ausbildung').split('data-teil="passend"')[1]);
    for (const s of ['Lebenslauf erstellen Aus Ihren Angaben · als PDF', 'Neue Stelle Ablauf · 5 Schritte', 'Stundenlohn & Mindestlohn']) expect(passend, s).toContain(s);
  });
  it('Behörden: Steuern und Briefvorlagen wie im Entwurf', () => {
    const passend = nurText(render('behoerden').split('data-teil="passend"')[1]);
    expect(passend).toContain('Steuern schätzen, Abzüge, Frist verlängern');
    expect(passend).toContain('Fristverlängerung, Wohnungskündigung, Krankenkassenwechsel');
  });
  it('Symbole in einer Kachel (36 px)', () => {
    expect(render('wohnen').split('data-teil="passend"')[1]).toMatch(/width:36px;height:36px;border-radius:10px/);
  });
});

describe('M8 · eine Bereichsfarbe je Kapitel', () => {
  it('Kuchen und Geldfluss: Miete in der Wohnen-Farbe, Krankenkasse in der Versicherungen-Farbe', () => {
    for (const palette of [LIGHT_PALETTE, DARK_PALETTE]) {
      const posten = ausgabenPosten(DEMO_DATA, t, palette);
      const farbe = (k) => posten.find((p) => p.key === k)?.color || posten.find((p) => p.key === k)?.farbe;
      expect(farbe('rent')).toBe(bereichsTon('wohnen', palette));
      expect(farbe('healthInsurance')).toBe(bereichsTon('versicherungen', palette));
    }
  });
  it('hell und dunkel: die Fruchtfarbe des Bereichs (hell der Flächenton lightDeep)', () => {
    expect(bereichsTon('wohnen', LIGHT_PALETTE)).toBe(getBereichForChapter('wohnen').lightDeep);
    expect(bereichsTon('wohnen', DARK_PALETTE)).toBe(getBereichForChapter('wohnen').dark);
  });
  it('der Monatsbalken im Kapitel Finanzen nimmt dieselben Farben', () => {
    expect(QUELLE).toMatch(/key: 'wohnen', wert: [^\n]*farbe: bereichsTon\('wohnen', palette\)/);
    expect(QUELLE).toMatch(/key: 'versicherungen', wert: [^\n]*farbe: bereichsTon\('versicherungen', palette\)/);
  });
});

// A11y-Prüfung 25.10.2026 (WCAG 1.4.11): jedes Kuchenstück der Versicherungen ≥ 3:1 gegen den Grund.
const lum = (h) => { const r = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * r[0] + 0.7152 * r[1] + 0.0722 * r[2]; };
const kontrast = (a, b) => { const x = lum(a); const y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
describe('M8 · Kontrast der Flächen', () => {
  it.each([['hell', LIGHT_PALETTE], ['dunkel', DARK_PALETTE]])('%s: Miete, Krankenkasse, Hausrat, Haftpflicht ≥ 3:1 gegen den Grund', (_n, palette) => {
    const posten = ausgabenPosten(DEMO_DATA, t, palette);
    for (const k of ['rent', 'healthInsurance', 'householdInsurance', 'liabilityInsurance']) {
      const p = posten.find((x) => x.key === k);
      const f = p.color || p.farbe;
      expect(kontrast(f, palette.up), k + ' ' + f).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('Texte in allen fünf Sprachen', () => {
  for (const [name, s] of Object.entries({ en, fr, it: it_, rm })) {
    it(name, () => {
      for (const k of ['erfasst', 'erfasstSr', 'nichtErfasst', 'ergaenzenAria']) expect(s.chapterView.abschnitt[k], name + ' ' + k).toBeTruthy();
      for (const k of ['stdProWoche', 'plzOrt']) expect(s.chapterView[k], name + ' ' + k).toBeTruthy();
      for (const k of Object.keys(de.chapterView.passend)) expect(s.chapterView.passend[k], name + ' passend.' + k).toBeTruthy();
    });
  }
});
