// Fassung 6 · Kapitel Notfall «ein Ort» (Runde 9, Entwurf AE; Sophie 25.10.2026 «Baue Notfall 1 bis 11»):
// Ernstfall-Knopf, der stehen bleibt · «… anrufen» · «Bereit für den Ernstfall 19 von 20» mit dem Fehlenden zum
// Ausfüllen · vier Unterlagen-Kacheln mit der Portemonnaie-Karte · Vorsorge «1 von 4 geregelt» · Zusammenfassung
// mit Blutgruppe und Allergien · Fehlendes in den Angaben · Passend nur Ablage · Namen, Brotkrumen, Suche.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterViewComplete } from '../ChapterView.jsx';
import { NotfallImKapitel, NotfallErnstfallKnopf, NOTFALL_ANKER, knopfRot, NOTFALL_ANGABEN, SCENARIOS, bereitschaft, vorsorgeGeregelt } from '../components/NotfallImKapitel.jsx';
import { getChapters, LIGHT_PALETTE } from '../config/constants.js';
import { stufen } from '../config/brotkrumePfade.js';
import { feldHatWert } from '../utils/vollstaendigkeit.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { DEMO_DATA } from '../config/demoData.js';

const t = createT({ de }, 'de', 'sie');
const chapters = getChapters(t);
const nurText = (html) => html.replace(/\u00AD/g, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ');
const kapitelHtml = (data = DEMO_DATA.notfall, allData = DEMO_DATA, extra = {}) => renderToStaticMarkup(React.createElement(ChapterViewComplete, {
  palette: LIGHT_PALETTE, t, chapter: chapters.find((c) => c.key === 'notfall'), data, allData: { ...allData, notfall: data },
  onUpdate: () => {}, onUpdateIn: () => {}, onNavigate: () => {}, chapters, ...extra,
}));
const ort = (allData = DEMO_DATA, extra = {}) => renderToStaticMarkup(React.createElement(NotfallImKapitel, {
  palette: LIGHT_PALETTE, t, data: allData, chapters, onNavigate: () => {}, onUpdate: () => {}, zumFeld: () => {}, karteMoeglich: true, ...extra,
}));
// Maria ohne Medikament: so stand das Beispiel bis F7-K6-2 (27.10.2026). Bleibt für die Wege, die ein fehlendes
// Medikament zeigen — das Beispiel selbst hat seither «Euthyrox 50 µg».
const OHNE_MEDI = { ...DEMO_DATA, notfall: { ...DEMO_DATA.notfall, medicationsList: [] } };
const QUELLE = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');

describe('Bereit für den Ernstfall', () => {
  it('20 verschiedene Angaben aus den drei Szenarien (9 + 6 + 5 ohne Doppelte)', () => {
    expect(NOTFALL_ANGABEN).toHaveLength(20);
    const alle = SCENARIOS.flatMap((s) => s.fields.map((f) => f.chapter + '.' + f.k));
    expect(new Set(alle).size).toBe(20);
  });
  it('Maria: 19 von 20 — es fehlt nur die Patientenverfügung (Spital), das Medikament ist erfasst (F7-K6-2)', () => {
    const maria = bereitschaft(DEMO_DATA);
    expect([maria.erledigt, maria.gesamt]).toEqual([19, 20]);
    expect(maria.fehlend.map((f) => f.k)).toEqual(['patientenverfuegung']);
    expect(nurText(ort())).toContain('19 von 20');
  });
  it('ohne Medikament: 18 von 20 — es fehlen die Medikamente (Unfall) und die Patientenverfügung (Spital)', () => {
    const b = bereitschaft(OHNE_MEDI);
    expect([b.erledigt, b.gesamt]).toEqual([18, 20]);
    expect(b.fehlend.map((f) => f.k)).toEqual(['medications', 'patientenverfuegung']);
    expect(b.fehlend.map((f) => f.lagen)).toEqual([['unfall'], ['spital']]);
    const text = nurText(ort(OHNE_MEDI));
    expect(text).toContain('18 von 20');
    expect(text).toContain('Patientenverfügung vorhanden? · fehlt für «Spitalaufenthalt» zur Vorsorge ↓');
    expect(text).toContain('Regelmässige Medikamente · fehlt für «Unfall»');
    expect(text).toContain('Ich nehme keine');
  });
  it('Medikamente in der Liste zählen (vorher zählte nur das leere Textfeld)', () => {
    expect(feldHatWert({ medications: '', medicationsList: [{ name: 'Levothyroxin' }] }, 'medications')).toBe(true);
    expect(feldHatWert({ medications: '', medicationsList: [{ name: '' }] }, 'medications')).toBe(false);
    const mit = { ...OHNE_MEDI, notfall: { ...OHNE_MEDI.notfall, medicationsList: [{ name: 'Levothyroxin', dose: '50', unit: 'µg' }] } };
    expect(bereitschaft(mit).erledigt).toBe(19);
    const alles = { ...mit, notfall: { ...mit.notfall, patientenverfuegung: 'yes' } };
    expect(bereitschaft(alles).erledigt).toBe(20);
    expect(nurText(ort(alles))).toContain('Alle Angaben vorhanden.');
  });
  it('«Ich nehme keine» zählt als erledigt', () => {
    const keine = { ...OHNE_MEDI, notfall: { ...OHNE_MEDI.notfall, _na: ['medications'] } };
    expect(bereitschaft(keine).erledigt).toBe(19);
    expect(chapters.find((c) => c.key === 'notfall').fields.find((f) => f.k === 'medications').naOk).toBe(true);
  });
  it('Patientenverfügung zählt erst bei «Ja» (Sophie 25.10.2026)', () => {
    const mit = (pv) => ({ ...DEMO_DATA, notfall: { ...DEMO_DATA.notfall, patientenverfuegung: pv } });
    expect(bereitschaft(mit('no')).fehlend.some((f) => f.k === 'patientenverfuegung')).toBe(true);
    expect(bereitschaft(mit('yes')).fehlend.some((f) => f.k === 'patientenverfuegung')).toBe(false);
    expect(bereitschaft(mit('')).fehlend.some((f) => f.k === 'patientenverfuegung')).toBe(true);
  });
  it('Angaben aus anderen Kapiteln führen in jenes Kapitel, Auswahlfelder zum Feld', () => {
    const leer = nurText(ort({ notfall: {} }));
    expect(leer).toContain('0 von 20');
    expect(leer).toContain('Persönliche Basis ›');
    expect(leer).toContain('ergänzen ↓'); // Blutgruppe, Patientenverfügung
  });
  it('die drei Szenarien zugeklappt mit Stand', () => {
    const html = ort();
    expect(html).toMatch(/<details data-teil="notfall-szenarien"(?![^>]*open)/);
    expect(nurText(html)).toContain('Unfall vollständig · Spitalaufenthalt 9 von 10 · Behördengang vollständig');
    expect(nurText(ort(OHNE_MEDI))).toContain('Unfall 8 von 9 · Spitalaufenthalt 9 von 10 · Behördengang vollständig');
  });
  it('im Beispiel: Feld gesperrt, Hinweis statt «Speichern»', () => {
    const text = nurText(ort(OHNE_MEDI, { demoMode: true }));
    expect(text).toContain(t('demo.readOnlyHint'));
    expect(text).not.toContain('Speichern');
  });
  it('Beispiel Maria zeigt kein leeres Eingabefeld mehr (F7-K6-2)', () => {
    const text = nurText(ort(DEMO_DATA, { demoMode: true }));
    expect(text).not.toContain(t('demo.readOnlyHint'));
    expect(text).not.toContain('Regelmässige Medikamente · fehlt');
  });
});

describe('Im Ernstfall', () => {
  it('roter Knopf mit den Nummern, bleibt stehen — direkt in der Kapitelkarte, mit der Sprungmarke', () => {
    const html = renderToStaticMarkup(React.createElement(NotfallErnstfallKnopf, { palette: LIGHT_PALETTE, t, onNavigate: () => {} }));
    expect(html).toContain(`id="${NOTFALL_ANKER}"`);
    expect(nurText(html)).toContain('Im Ernstfall: Notfallkarte öffnen');
    expect(nurText(html)).toContain('144 Sanität · 117 Polizei · 118 Feuerwehr');
    expect(html).toContain('position:sticky');
  });
  it('weisse Schrift auf genug dunklem Rot, auch im dunklen Modus', () => {
    expect(knopfRot({ roseDeep: '#9A4A4A' })).toBe('#9A4A4A');
    expect(knopfRot({ roseDeep: '#D98A8A' })).toBe('#9A4A4A');
  });
  it('während getippt wird, steht er nicht fest (deckt kein Feld unter der Tastatur)', () => {
    expect(QUELLE('components/NotfallImKapitel.jsx')).toContain("position: tippt ? 'static' : 'sticky'");
  });
  it('«Peter Muster anrufen» als Telefon-Link — nur mit erfasster Nummer', () => {
    expect(ort()).toContain('href="tel:+41796543210"');
    expect(nurText(ort())).toContain('Peter Muster anrufen');
    const ohne = { ...DEMO_DATA, notfall: { ...DEMO_DATA.notfall, emergencyPhone: '' } };
    expect(ort(ohne)).not.toContain('tel:');
  });
});

describe('Unterlagen und Vorsorge', () => {
  it('vier Kacheln: Notfallkarte, Notfallpass, Notfall-Dossier, Portemonnaie-Karte', () => {
    const text = nurText(ort());
    for (const s of ['Ihre Notfall-Unterlagen', 'Notfallkarte Am Telefon vorlesen', 'Notfallpass Auf den Sperrbildschirm', 'Notfall-Dossier Für Helfende', 'Portemonnaie-Karte Zum Drucken']) expect(text).toContain(s);
  });
  it('Vorsorge: Maria hat 1 von 4 geregelt, offene führen zum Werkzeug', () => {
    const text = nurText(ort());
    expect(text).toContain('1 von 4 geregelt.');
    expect(text).toContain('Organspende Zustimmung');
    expect(text).toContain('Patientenverfügung Noch nicht erstellen ›');
    expect(text).toContain('Bestattungswünsche Noch nicht festhalten ›');
  });
  it('geregelt: Organspende jede Wahl ausser «noch nicht entschieden», sonst «Ja»', () => {
    expect(vorsorgeGeregelt({ organDonor: 'declined' }, 'organDonor')).toBe(true);
    expect(vorsorgeGeregelt({ organDonor: 'undecided' }, 'organDonor')).toBe(false);
    expect(vorsorgeGeregelt({ patientenverfuegung: 'no' }, 'patientenverfuegung')).toBe(false);
    expect(vorsorgeGeregelt({ patientenverfuegung: 'yes' }, 'patientenverfuegung')).toBe(true);
  });
});

describe('Barrierefreiheit (A11y-Prüfung 25.10.2026)', () => {
  it('Abschnitte als h3, gleichrangig zu den Angaben-Abschnitten', () => {
    const html = ort();
    for (const id of ['mp-notfall-bereit', 'mp-notfall-unterlagen', 'mp-notfall-vorsorge']) expect(html).toContain(`<h3 id="${id}"`);
  });
  it('Portemonnaie-Karte ohne Angaben: erreichbar, aber aria-disabled', () => {
    const html = ort(DEMO_DATA, { karteMoeglich: false });
    expect(html).toMatch(/aria-disabled="true" data-kachel="portemonnaie"/);
    expect(nurText(html)).toContain('Braucht zuerst Angaben unten');
  });
  it('der stehende Knopf hält per scroll-padding Abstand zum Fokus', () => {
    expect(QUELLE('components/NotfallImKapitel.jsx')).toContain("wurzel.style.scrollPaddingTop = 'calc(var(--mp-sprungabstand, 64px) + 84px)'");
  });
});

describe('Im Kapitel', () => {
  it('Zusammenfassung mit Blutgruppe und Allergien, vor dem Ernstfall', () => {
    const text = nurText(kapitelHtml());
    expect(text).toContain('Ein Hausarzt ist eingetragen. Blutgruppe A+. Allergien: Penicillin.');
    expect(text.indexOf('Allergien: Penicillin.')).toBeLessThan(text.indexOf('Im Ernstfall: Notfallkarte öffnen'));
  });
  // Muster M2 (25.10.2026): «x von n» am Abschnitt, das Übrige in EINER leisen Zeile «Nicht erfasst: …».
  it('Angaben nennen das Fehlende: Medikamente «ergänzen ›», chronische Erkrankungen «nicht erfasst.»', () => {
    const html = kapitelHtml(OHNE_MEDI.notfall, OHNE_MEDI);
    const text = nurText(html);
    expect(html).toMatch(/data-fehlt="medications"[\s\S]*?Regelmässige Medikamente[\s\S]*?ergänzen ›/);
    expect(kapitelHtml()).not.toMatch(/data-fehlt="medications"/);
    expect(text).toContain('Nicht erfasst: Chronische Erkrankungen.');
    expect(html).toMatch(/data-erfasst="\d+\/\d+"/);
  });
  it('Passend: nur noch Dokumente ablegen, mit den Unterlagen des Kapitels', () => {
    const html = kapitelHtml();
    const passend = nurText(html.slice(html.indexOf('data-teil="passend"')));
    expect(passend).toContain('Unterlagen · Patientenverfügung, Organspende-Karte, Blutgruppen-Ausweis');
    expect(passend).not.toContain('Patientenverfügung erstellen');
  });
  it('Passend: Ablauf Vorsorge und Organspende als Eingang (F7-K5-2, F7-L1)', () => {
    const html = kapitelHtml();
    const passend = nurText(html.slice(html.indexOf('data-teil="passend"')));
    expect(passend).toContain('Vorsorgeauftrag & Patientenverfügung');
    expect(passend).toContain('Organspende');
  });
  it('Patientenverfügung nur im Block Vorsorge, nicht in den Angaben (F7-K6-1)', () => {
    const html = kapitelHtml();
    expect(html.slice(html.indexOf('data-teil="notfall-pv-antwort"'))).toContain('mp-notfall-pv');
    expect((html.match(/id="mp-notfall-pv"/g) || []).length).toBe(1);
    expect(html).not.toMatch(/data-fehlt="patientenverfuegung"[^>]*>[\s\S]{0,400}ergänzen ›/);
    const quelle = QUELLE('ChapterView.jsx');
    expect(quelle).toMatch(/const feldSichtbar = \(f\) => !nurImBlock\(f\)/);
    expect(quelle).not.toContain('crosslink-pv');
  });
  it('die Antwort lässt sich dort setzen, das Formular bleibt auch nach «Ja» erreichbar (F7-K6-1)', () => {
    const quelle = QUELLE('components/NotfallImKapitel.jsx');
    expect(quelle).toContain("onUpdate('patientenverfuegung', e.target.value)");
    const ja = { ...DEMO_DATA, notfall: { ...DEMO_DATA.notfall, patientenverfuegung: 'yes' } };
    expect(nurText(ort(ja))).toContain('Patientenverfügung in Fragen erstellen ›');
    expect(nurText(ort(DEMO_DATA))).not.toContain('Patientenverfügung in Fragen erstellen ›');
    expect(ort(DEMO_DATA, { demoMode: true })).toMatch(/<select[^>]*id="mp-notfall-pv"[^>]*disabled/);
  });
  it('die drei Lagen stehen nicht mehr offen unten, der alte Druck-Link ist weg', () => {
    const text = nurText(kapitelHtml());
    expect(text).not.toContain('Was brauchen Sie im Notfall?');
    expect(text).not.toContain('Notfallkarte drucken');
  });
});

describe('Namen, Wege, Suche', () => {
  it('ein Name je Seite', () => {
    expect(t('notfallkarte.title')).toBe('Notfallkarte');
    expect(t('notfallpass.title')).toBe('Notfallpass');
    expect(t('notfallKapitel.portemonnaie')).toBe('Portemonnaie-Karte');
  });
  // Das Notfall-Dossier ist seit 27.10.2026 (F7-S2) eine Auswahl in «Unterlagen drucken» — Brotkrume dort
  // «Übersicht › Meine Unterlagen › Unterlagen drucken» (brotkrume.test.js); die Kachel hier bleibt.
  it('Brotkrume «Übersicht › Notfall › …» für Notfallkarte und Notfallpass', () => {
    for (const v of ['notfallkarte', 'notfallpass']) expect(stufen(v).map((s) => s.ziel)).toEqual(['dashboard', 'notfalleinstieg', null]);
    expect(QUELLE('NotfallVorlesekarte.jsx')).toContain("view: 'notfallkarte'");
  });
  it('Übersichtskarte heisst nicht mehr «Notfallkarte vorbereiten»', () => {
    expect(t('dashboard.highlightNotfall')).toBe('Bereit für den Ernstfall');
  });
  it('alle neuen Texte in fünf Sprachen', () => {
    const blatt = (o, p) => p.split('.').reduce((x, k) => (x == null ? x : x[k]), o);
    const schluessel = Object.keys(de.notfallKapitel).flatMap((k) => (typeof de.notfallKapitel[k] === 'object' && !('sie' in de.notfallKapitel[k]) ? Object.keys(de.notfallKapitel[k]).map((u) => k + '.' + u) : [k]));
    for (const sprache of [en, fr, it_, rm]) {
      for (const k of schluessel) expect(blatt(sprache.notfallKapitel, k), k).toBeTruthy();
      expect(blatt(sprache, 'mirror.notfall.blutgruppe')).toBeTruthy();
      expect(blatt(sprache, 'mirror.notfall.allergien')).toBeTruthy();
    }
  });
});
