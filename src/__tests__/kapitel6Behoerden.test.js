// Kapitel 6 · Behörden & Rechtliches (Befund docs/design/kapitel-6-behoerden.html, Entscheid Stebler Studios
// 10.11.2026 «Ja, alles bauen»). Jeder Test pinnt die Sache, die jemanden falsch handeln liess.
import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';
import { LIGHT_PALETTE, getChapters } from '../config/constants.js';
import { DEMO_DATA } from '../config/demoData.js';
import { Wegzug } from '../Wegzug.jsx';
import { Fuehrerausweis } from '../Fuehrerausweis.jsx';
import { AsylView } from '../AsylView.jsx';
import { ChapterViewComplete } from '../ChapterView.jsx';
import { BehoerdenInstrument } from '../components/BehoerdenInstrument.jsx';
import { erledigtesSteuerjahr } from '../utils/behoerdenGaenge.js';
import { freiwilligeAhv } from '../data/freiwilligeAhv.js';

beforeEach(() => { globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }; });
const t = createT({ de }, 'de', 'sie');
const SPRACHEN = { de, fr, it: it_, en, rm };
const nurText = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ');
const render = (C, props = {}) => renderToStaticMarkup(React.createElement(C, { palette: LIGHT_PALETTE, t, onNavigate: () => {}, ...props }));

describe('L1 · Wegzug mit Ausländerausweis', () => {
  const h = render(Wegzug);
  const text = nurText(h);
  it('nennt die Frist des Bundes, das Erlöschen und die C-Aufrechterhaltung vorher', () => {
    expect(text).toContain('spätestens 14 Tage vor der Ausreise ab (VZAE Art. 15)');
    expect(text).toContain('Mit der Abmeldung erlischt Ihre Bewilligung');
    expect(text).toContain('das Gesuch muss vor Ablauf von sechs Monaten beim Migrationsamt sein (VZAE Art. 79 Abs. 2)');
  });
  it('sagt nicht mehr, der Kanton regle die Frist für alle', () => {
    expect(text).not.toContain('das Bundesrecht verpflichtet die Kantone nur');
    expect(text).toContain('Mit Schweizer Pass legt der Kanton Frist und Unterlagen fest');
  });
  it('fragt das Wegzugsdatum einmal, schon im ersten Schritt — die AHV-Frist nutzt dasselbe Datum', () => {
    expect((h.match(/type="date"/g) || []).length).toBe(2); // Wegzug + Kapitalauszahlung
    expect(h).toContain('id="wegzug-datum"');
    expect(h).not.toContain('id="wegzug-frist"');
    const ahvSchritt = h.indexOf('Mit dem Wohnsitz (und ohne Erwerb');
    expect(ahvSchritt).toBeGreaterThan(-1);
    expect(h.indexOf('id="wegzug-datum"')).toBeLessThan(ahvSchritt);
  });
  it('rechnet die Abmeldefrist 14 Tage vor dem Wegzug', () => {
    const quelle = fs.readFileSync(path.resolve(__dirname, '../Wegzug.jsx'), 'utf8');
    expect(quelle).toMatch(/id: 'wegzug-datum', frist: \(d\) => plusTage\(d, -14\)/);
  });
});

describe('L5 · Rückforderung der Quellensteuer nur mit Doppelbesteuerungsabkommen', () => {
  it('steht im Text und vor der Frist', () => {
    expect(t('wegzug.step4Steuer')).toContain('Sie dort im Sinne dieses Abkommens ansässig sind (QStV Art. 19 Abs. 2 Bst. b)');
    expect(t('wegzug.fristRueckHinweis', { date: '1.1.2030' })).toMatch(/^Nur mit Doppelbesteuerungsabkommen:/);
  });
});

describe('A1 · Mindestbeitrag freiwillige AHV aus der Jahrestabelle', () => {
  it('2026: 870 Fr., 2027: 888 Fr. (AHVG Art. 2, Fassung 1.1.2027)', () => {
    expect(freiwilligeAhv(2026).mindestbeitrag).toBe(870);
    expect(freiwilligeAhv('2027-01-01').mindestbeitrag).toBe(888);
  });
  it('kein fester Betrag mehr im Text, in keiner Sprache', () => {
    for (const [l, d] of Object.entries(SPRACHEN)) {
      expect(d.wegzug.step3Text, l).toContain('{min}');
      expect(d.wegzug.step3Text, l).not.toContain('870');
    }
  });
});

describe('L2 · Asyl: die Rechtsvertretung kann das Mandat beenden', () => {
  it('Beschwerde nennt AsylG Art. 102h und den sofortigen Weg zur Beratungsstelle', () => {
    const text = nurText(render(AsylView, { data: { basis: { canton: 'ZH' } } }));
    expect(text).toContain('kann sie das Mandat beenden (AsylG Art. 102h)');
    expect(text).toContain('die Frist läuft weiter');
    expect(text).not.toContain('Ihre Rechtsvertretung unterstützt Sie.');
  });
});

describe('L9 · F-Flüchtlinge reisen mit dem Reiseausweis für Flüchtlinge', () => {
  it('die F-Zeile trennt Flüchtlinge und ausländische Personen, kein «Pass beim SEM hinterlegt» für alle', () => {
    const f = t('asyl.alltag.f.reisen');
    expect(f).toContain('Reiseausweis für Flüchtlinge (AIG Art. 59)');
    expect(f).not.toContain('Ihr Pass wird beim SEM hinterlegt');
  });
});

describe('L3 · Pass und Identitätskarte nach der Fassung vom 1.11.2026', () => {
  it('Fingerabdrücke auch bei der Identitätskarte mit Chip; Notpass statt provisorischer Pass', () => {
    expect(t('ausweis.step3Text')).toContain('Identitätskarte mit Chip werden zwei Fingerabdrücke erfasst');
    expect(t('ausweis.step3Text')).not.toContain('werden heute keine erfasst');
    for (const k of ['ausweis.step4Text', 'ausweis.step4Dringend']) expect(t(k)).not.toMatch(/provisorische[nr]? Pass/);
    expect(t('ausweis.step4Dringend')).toContain('Notpass');
    expect(t('ausweis.step2Text')).toContain('Identitätskarte ohne Chip nehmen je nach Kanton');
  });
});

describe('L4 · Einsprache Wehrpflichtersatz: 30 Kalendertage', () => {
  it('kein Satz mehr, der nach Arbeitstagen klingt oder Puffer verspricht', () => {
    const s = t('dienst.ersatzHinweis', { date: '1.1.2030' });
    expect(s).toContain('30 Kalendertage; Wochenenden und Feiertage zählen mit');
    expect(s).not.toContain('früher ist nie falsch');
  });
});

describe('L6–L8 · EU/EFTA, Einbürgerungsjahre, Fahren ohne gültigen Ausweis', () => {
  it('L6: EU/EFTA bis drei Monate Meldung; L höchstens zwei Jahre', () => {
    expect(t('zuzug.step1Text')).toContain('Mit EU/EFTA-Pass genügt für eine Stelle bis drei Monate eine Meldung');
    expect(t('bewilligung.step3Text')).toContain('Eine L lässt sich höchstens bis zwei Jahre verlängern (AIG Art. 32)');
  });
  it('L7: Jahre mit L, N oder S zählen nicht', () => {
    expect(t('einbuergerung.step1Text')).toContain('Jahre mit L, N oder S gar nicht (BüG Art. 33)');
  });
  it('L8: nach der Probezeit ohne Kurs und nach zwölf Monaten Wohnsitz nicht mehr fahren', () => {
    expect(t('fuehrerausweis.step4Text')).toContain('ist Fahren nicht mehr erlaubt');
    expect(t('zuzug.step4Text')).toContain('dürfen Sie nur noch mit einem schweizerischen Ausweis fahren');
  });
});

describe('A2 · Kontrolluntersuchung ab 75 rechnet ab der letzten Untersuchung', () => {
  it('Datumsfeld statt 730 Tage ab dem Klick', () => {
    const h = render(Fuehrerausweis);
    expect(h).toContain('id="fuehrerausweis-kontrolle"');
    const quelle = fs.readFileSync(path.resolve(__dirname, '../Fuehrerausweis.jsx'), 'utf8');
    expect(quelle).not.toContain('inDays(730)');
    expect(quelle).toMatch(/frist: \(d\) => plusMonate\(d, 24\)/);
    // Blocker aus der Rechtsprüfung: der 75. Geburtstag ist kein Startpunkt für «zwei Jahre später».
    expect(t('fuehrerausweis.kontrolleLabel')).not.toContain('75');
    expect(t('fuehrerausweis.step3Text')).toContain('kurz nach dem 75. Geburtstag');
  });
});

describe('Kapitelseite', () => {
  const chapters = getChapters(t);
  const kapitel = (basis = DEMO_DATA.basis) => renderToStaticMarkup(React.createElement(ChapterViewComplete, {
    palette: LIGHT_PALETTE, t, chapter: chapters.find((c) => c.key === 'behoerden'), data: DEMO_DATA.behoerden,
    allData: { ...DEMO_DATA, basis }, onUpdate: () => {}, onUpdateIn: () => {}, onNavigate: () => {},
  }));
  it('A: die Abläufe des Kapitels stehen unter «Passend», mit Schweizer Pass ohne Bewilligung und Einbürgerung', () => {
    const swiss = nurText(kapitel({ ...DEMO_DATA.basis, nationality: 'swiss' }));
    for (const k of ['nav.ausweis', 'nav.fuehrerausweis', 'nav.wegzug']) expect(swiss).toContain(t(k));
    expect(swiss).not.toContain(t('nav.bewilligung'));
    const andere = nurText(kapitel({ ...DEMO_DATA.basis, nationality: 'de' }));
    for (const k of ['nav.bewilligung', 'nav.einbuergerung', 'nav.zuzug', 'nav.asyl']) expect(andere).toContain(t(k));
  });
  it('A: Dienst nur in den Jahren der Dienst- und Ersatzpflicht', () => {
    const jahr = new Date().getFullYear();
    expect(nurText(kapitel({ ...DEMO_DATA.basis, dateOfBirth: (jahr - 20) + '-05-01' }))).toContain(t('nav.dienst'));
    expect(nurText(kapitel({ ...DEMO_DATA.basis, dateOfBirth: (jahr - 50) + '-05-01' }))).not.toContain(t('nav.dienst'));
  });
  it('B: Steuerfrist, Behördengänge, Fall der Fälle auf Stufe 3', () => {
    const h = renderToStaticMarkup(React.createElement(BehoerdenInstrument, { palette: LIGHT_PALETTE, t, behoerden: DEMO_DATA.behoerden, onNavigate: () => {}, onToggle: () => {} }));
    expect(h).not.toContain('<h4');
    expect((h.match(/<h3 /g) || []).length).toBe(3);
  });
  it('C: kein Intro mehr, das «Ansprechpersonen» verspricht', () => {
    expect(nurText(kapitel())).not.toContain('Ansprechpersonen');
    for (const [l, d] of Object.entries(SPRACHEN)) expect(d.chapters.behoerden.intro, l).toBeUndefined();
  });
  it('K: Steuerjahr bei verlängerter Frist im laufenden Jahr', () => {
    const heute = new Date(2026, 10, 10);
    expect(erledigtesSteuerjahr({ taxFilingDeadline: '2026-11-30', pendingTaxReturns: '0' }, heute)).toBe(2025);
    expect(erledigtesSteuerjahr({ taxFilingDeadline: '2027-03-31', pendingTaxReturns: '0' }, heute)).toBe(2025);
    expect(erledigtesSteuerjahr({ taxFilingDeadline: '2026-03-31', pendingTaxReturns: '0' }, heute)).toBe(2025);
  });
});

describe('S5 · kein «ruhiger Überblick» in den neun Einleitungen', () => {
  const NS = ['bewilligung', 'fuehrerausweis', 'asyl', 'zuzug', 'einbuergerung', 'wegzug', 'ausweis', 'betreibungsAuszug', 'dienst'];
  it.each(Object.keys(SPRACHEN))('%s', (l) => {
    for (const ns of NS) {
      const v = SPRACHEN[l][ns].intro;
      const s = typeof v === 'string' ? v : v.sie + ' ' + v.du;
      expect(s, ns).not.toMatch(/ruhig|calme|sereine|tranquillité|tranquill|\bcalm\b/i);
    }
  });
});
