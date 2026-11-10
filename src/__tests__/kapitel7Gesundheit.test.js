// Kapitel 7 · Gesundheit (Befund docs/design/kapitel-7-gesundheit.html, Entscheid Stebler Studios 10.11.2026
// «Ja, alles bauen»). Jeder Test pinnt die Sache, die jemanden falsch handeln liess.
import { describe, it, expect, beforeEach } from 'vitest';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { LIGHT_PALETTE } from '../config/constants.js';
import { vorlageHtml } from '../data/vorsorgeauftrag.js';
import { KVGLeistungen } from '../KVGLeistungen.jsx';
import { IvVerfahren } from '../IvVerfahren.jsx';
import { PflegeAblauf } from '../PflegeAblauf.jsx';
import { UnfallKrankheit } from '../UnfallKrankheit.jsx';
import { stufen, ELTERN_TITEL } from '../config/brotkrumePfade.js';

beforeEach(() => { globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }; });
const t = createT({ de }, 'de', 'sie');
const SPRACHEN = { de, fr, it: it_, en, rm };

describe('L1 · Vorlage zum Vorsorgeauftrag ohne Unterschriftslinien (ZGB Art. 361 Abs. 2)', () => {
  const html = vorlageHtml({}, {}, t, 'de');
  it('druckt keine Linie für Ort, Datum oder Unterschrift', () => {
    expect(html).not.toContain('class="pv-linie"');
    expect(html).not.toMatch(/>Unterschrift</);
  });
  it('sagt stattdessen: von Hand auf die Abschrift', () => {
    expect(html).toContain('Ort, Datum und Unterschrift setzen Sie von Hand auf Ihre Abschrift, nicht auf dieses Blatt.');
    expect(html).toContain('auch nicht mit Unterschrift');
  });
  it('hat den Satz in allen fünf Sprachen', () => {
    for (const [lang, d] of Object.entries(SPRACHEN)) {
      const tt = createT({ [lang]: d }, lang, 'sie');
      expect(tt('va.doc.handschrift'), lang).not.toBe('va.doc.handschrift');
    }
  });
});

describe('L4, L5, L8, L9 · KVG-Sätze am Volltext', () => {
  it('L4 freie Spitalwahl unter Listenspitälern (KVG Art. 41 Abs. 1bis)', () => {
    expect(t('kvg.spitalAllgNote')).toContain('auch in einem anderen Kanton');
    expect(t('kvg.spitalAllgNote')).toContain('höchstens nach dem Tarif des Wohnkantons');
  });
  it('L5 Franchise und Selbstbehalt sind zwei Teile, Kinder 350 (KVG Art. 64)', () => {
    expect(t('kvg.franchiseExplain')).not.toContain('Franchise ist Ihr jährlicher Selbstbehalt');
    expect(t('kvg.franchiseExplain')).toContain('für Kinder CHF 350');
  });
  it('L8 Mutterschaftsleistungen während der ganzen Schwangerschaft ohne Kostenbeteiligung (Art. 64 Abs. 7)', () => {
    expect(t('kvg.schwangerschaftDetail2')).toContain('während der ganzen Schwangerschaft ohne Franchise und Selbstbehalt');
    expect(t('kvg.schwangerschaftDetail2')).toContain('ab der 13. Schwangerschaftswoche');
    for (const k of ['schwangerschaftNote', 'mutterschaftNote']) expect(t('kvg.' + k)).not.toContain('franchisefrei');
  });
  it('L9 nach dem Höchstbetrag nicht «100 %»', () => {
    expect(t('kvg.selbstbehaltDone')).not.toContain('100');
    expect(t('kvg.selbstbehaltDone')).toContain('CHF 15 je Spitaltag');
  });
  it('Psychotherapie im Anordnungsmodell seit Juli 2022, in allen Sprachen (KLV Art. 11b)', () => {
    for (const [lang, d] of Object.entries(SPRACHEN)) {
      expect(JSON.stringify(d.kvg.psychoNote) + d.kvg.psychoModell, lang).not.toContain('2023');
    }
  });
});

describe('L10 · Franchise-Rechner kennt Kinder (KVG Art. 64 Abs. 4, KVV Art. 103)', () => {
  const rechne = (franchise) => renderToStaticMarkup(React.createElement(KVGLeistungen, {
    palette: LIGHT_PALETTE, t, initialTab: 'franchise', onUpdateData: () => {}, onNavigate: () => {},
    data: { versicherungen: { franchise, kkBelege: [{ id: 'b1', betrag: 5000, status: 'bezahlt' }] } },
  }));
  it('eine gespeicherte Kinderfranchise bleibt erhalten und rechnet mit höchstens 350', () => {
    const h = rechne('600');
    expect(h).toMatch(/<option value="kind" selected="">/);
    expect(h).toMatch(/<option value="600" selected="">/);
    expect(h).toContain('Selbstbehalt-Maximum: CHF 350');
    expect(h).toContain('CHF 950'); // 600 Franchise + 350 Selbstbehalt bei 5000 Franken Kosten
  });
  it('Erwachsene rechnen weiter mit 700', () => {
    const h = rechne('2500');
    expect(h).toMatch(/<option value="erwachsen" selected="">/);
    expect(h).toContain('Selbstbehalt-Maximum: CHF 700');
    expect(h).toContain('CHF 2’750'); // 2500 + 250
  });
  it('ein unbekannter Wert wird genannt, nicht still zu 300', () => {
    expect(rechne('750')).toContain('Die gespeicherte Franchise (750) passt zu keiner Stufe.');
  });
});

const nurText = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ');
const seite = (C) => nurText(renderToStaticMarkup(React.createElement(C, { palette: LIGHT_PALETTE, t, onNavigate: () => {} })));

describe('L2, L3 · Vertretung und Patientenverfügung am Volltext', () => {
  it('L2 Ehegatten-Vertretung auch bei regelmässigem Beistand, nur ohne Vorsorgeauftrag/Beistandschaft (ZGB Art. 374)', () => {
    const x = t('vorsorgeauftrag.step1Text');
    expect(x).toContain('oder leistet sie Ihnen regelmässig und persönlich Beistand');
    expect(x).toContain('sofern kein Vorsorgeauftrag und keine entsprechende Beistandschaft besteht');
  });
  it('Vertretungsreihe beginnt mit der Person aus dem Vorsorgeauftrag (ZGB Art. 378)', () => {
    expect(t('vorsorgeauftrag.step4Text')).toContain('die im Vorsorgeauftrag bezeichnete Person, eine Beiständin oder ein Beistand');
  });
  it('L3 in der Psychiatrie wird die Patientenverfügung nur berücksichtigt (ZGB Art. 380, 433)', () => {
    expect(t('pv.ui.einstiegPsych')).toContain('wird dort berücksichtigt, ist aber nicht in jedem Fall bindend');
    expect(t('pv.ui.einstiegPsych')).not.toContain('zusätzlich');
  });
  it('Vorsorgeauftrag nur für Handlungsfähige (ZGB Art. 360)', () => {
    expect(t('va.ui.intro')).toContain('nicht unter umfassender Beistandschaft');
    expect(t('va.begleit.alter')).toContain('handlungsfähig');
  });
});

describe('L6 · IV: Vorbescheid und Beschwerde statt Einsprache (IVG Art. 57a, 69)', () => {
  const x = seite(IvVerfahren);
  it('nennt die 30 Tage für Einwände und die direkte Beschwerde', () => {
    expect(x).toContain('innert 30 Tagen Ihre Einwände vor (IVG Art. 57a)');
    expect(x).toContain('gibt es bei der IV keine Einsprache');
    expect(x).toContain('Vorbescheid erhalten am');
  });
  it('die Schritte sind fortlaufend nummeriert', () => {
    expect(x).toMatch(/Schritt 5 von 6 Vorbescheid und Entscheid/);
    expect(x).toMatch(/Schritt 6 von 6 Unterstützung/);
  });
  it('rechnet 30 Tage ab Erhalt des Vorbescheids', () => {
    const quelle = fs.readFileSync(path.resolve(__dirname, '../IvVerfahren.jsx'), 'utf8');
    expect(quelle).toMatch(/id: 'iv-vorbescheid', frist: \(d\) => plusTage\(d, 30\)/);
  });
});

describe('L7 · Kurzurlaub für Erwachsene zahlt der Arbeitgeber, nicht die EO (OR Art. 329h)', () => {
  const x = seite(PflegeAblauf);
  it('steht mit Grenzen und Quelle', () => {
    expect(x).toContain('gibt es keine EO, aber bezahlten Urlaub von der Arbeitgeberin oder dem Arbeitgeber');
    expect(x).toContain('höchstens drei Tage je Ereignis und zehn Tage im Jahr (OR Art. 329h)');
  });
  it('Betreuungsgutschrift nennt den Personenkreis (AHVG Art. 29septies)', () => {
    expect(x).toContain('Schwiegereltern, Stiefkinder');
    expect(x).toContain('nach fünf Jahren im gemeinsamen Haushalt');
  });
});

describe('Organspende · Mindestalter 16 (TxG Art. 8 Abs. 7)', () => {
  it('steht im Rechtsstand', () => { expect(t('organ.rechtsstand')).toContain('wer 16 Jahre alt ist (TxG Art. 8 Abs. 7)'); });
});

describe('Gestaltung A · Gesundheits-Seiten auf der Kapitelseite', () => {
  const quelle = fs.readFileSync(path.resolve(__dirname, '../ChapterView.jsx'), 'utf8');
  const fall = quelle.slice(quelle.indexOf("case 'notfall': return ["), quelle.indexOf('default: return [', quelle.indexOf("case 'notfall': return [")));
  it('«Passend» nennt KVG-Leistungen, Scanner, Arztkoffer, Unfall, IV und Pflege in zwei Gruppen', () => {
    for (const v of ['kvg', 'kk', 'gesundheit', 'unfallkrankheit', 'iv', 'pflege']) expect(fall, v).toContain("weg('" + v + "')");
    expect(fall).toContain("P('gruppeKrankenkasse')");
    expect(fall).toContain("P('gruppePassiert')");
  });
  it('der Arztkoffer hängt in der Brotkrume unter «Gesundheit»', () => {
    expect(stufen('gesundheit').map((x) => x.ziel)).toEqual(['dashboard', 'notfalleinstieg', null]);
    expect(t(ELTERN_TITEL.notfalleinstieg)).toBe('Gesundheit');
  });
});

describe('Gestaltung B · Notrufnummern als Knöpfe', () => {
  const h = renderToStaticMarkup(React.createElement(UnfallKrankheit, { palette: LIGHT_PALETTE, t, onNavigate: () => {} }));
  it('jede Nummer ist mindestens 48 px hoch, 117 ist dabei', () => {
    const tels = h.match(/<a href="tel:[^"]+"[^>]*>/g) || [];
    expect(tels.map((a) => a.match(/tel:(\d+)/)[1])).toEqual(['144', '1414', '145', '117', '112']);
    for (const a of tels) expect(a).toContain('min-height:48px');
  });
});

describe('Gestaltung C · nichts doppelt', () => {
  it('kein Kapitel-Intro mehr über der Zusammenfassung', () => {
    for (const [lang, d] of Object.entries(SPRACHEN)) expect(d.chapters.notfall.intro, lang).toBeUndefined();
  });
  it('die Frage «Patientenverfügung vorhanden?» ist eingeklappt unter einer eigenen Frage', () => {
    const q = fs.readFileSync(path.resolve(__dirname, '../components/NotfallImKapitel.jsx'), 'utf8');
    expect(q).toMatch(/h\('details', \{ 'data-teil': 'notfall-pv-antwort'/);
    expect(t('notfallKapitel.pvSchonFrage')).toContain('zum Beispiel auf Papier');
  });
  it('der Abschnitt der Angaben heisst nicht ein zweites Mal «Vorsorge»', () => {
    expect(t('sections.notfall.provision')).not.toBe(t('notfallKapitel.vorsorgeTitel'));
  });
});

describe('Sprache · S1, S2, S5 im Kapitel', () => {
  it('S5 kein «ruhiger Überblick» in den vier Abläufen, kein «Bleiben Sie ruhig» auf der Notfallkarte', () => {
    for (const [lang, d] of Object.entries(SPRACHEN)) {
      for (const k of ['unfallKrankheit', 'vorsorgeauftrag', 'iv', 'pflege']) {
        expect(JSON.stringify(d[k].intro), lang + ' ' + k).not.toMatch(/ruhige|calme|tranquill|calm |calma/);
      }
      expect(JSON.stringify(d.notfallkarte.step2Text), lang).not.toMatch(/ruhig|calme|calma|calm\b|Stay calm|Resta calm/);
    }
  });
  it('S2 Hausärztin oder Hausarzt, Arbeitgeberin oder Arbeitgeber', () => {
    expect(t('chapters.notfall.fields.doctor')).toBe('Hausärztin oder Hausarzt');
    expect(t('unfallKrankheit.step3Text')).toContain('Ihre Arbeitgeberin oder Ihren Arbeitgeber');
    expect(t('unfallKrankheit.step2UnfallText')).not.toMatch(/\bdem Arbeitgeber\b|beim selben Arbeitgeber/);
  });
  it('S1 kein halber Satz in rm', () => {
    expect(rm.vorsorgeauftrag.footerNote).not.toMatch(/^Quai è orientaziun/);
  });
});
