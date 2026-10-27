import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { RECHNER_KAPITEL } from '../config/brotkrumePfade.js';
import { CHAPTER_KEYS } from '../config/constants.js';
import { AlvRechner } from '../AlvRechner.jsx';
import { EOrechner } from '../EOrechner.jsx';
import { Stundenlohn } from '../Stundenlohn.jsx';
import { Kreditkarte } from '../Kreditkarte.jsx';
import { MietzinsOrientierung } from '../MietzinsOrientierung.jsx';
import { StipendienView } from '../StipendienView.jsx';
import { VorsorgeRechner } from '../VorsorgeRechner.jsx';
import { SchuldenManager } from '../SchuldenManager.jsx';
import { Tabs } from '../components/RechnerForm.jsx';

// Rechner-Form X (Entscheid Stebler Studios 24.10.2026, gebaut F7-A2 27.10.2026): in jedem umgestellten Rechner
// steht das Ergebnis ZUERST (role="status"), dann «Ihre Angaben», dann was zu tun ist, die offizielle Stelle und
// zuletzt die Quelle. Geprüft an den `data-teil`-Marken der Hülle components/RechnerForm.jsx, nicht an Texten.
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = createT({ de, en, fr, it: itTranslations, rm }, 'de');
const render = (C, data, extra = {}) => renderToStaticMarkup(React.createElement(C, { palette, t, data, onNavigate: () => {}, onUpdateData: () => {}, ...extra }));

const leer = { basis: {}, finanzen: {}, wohnen: {} };
const maria = { basis: { canton: 'ZH', dateOfBirth: '1992-03-14' }, finanzen: { monthlyIncome: 5200, incomeType: 'netto' }, wohnen: {} };

// [Ansicht, Komponente, Profil mit Ergebnis]
const RECHNER = [
  ['alv', AlvRechner, { ...maria, finanzen: { monthlyIncome: 6000, incomeType: 'brutto' } }],
  ['stundenlohn', Stundenlohn, { ...maria, finanzen: { stundenlohnRechner: { betrag: '24', wochenstunden: '20', kanton: 'GE', ferienForm: 'dazu' } } }],
  ['kreditkarte', Kreditkarte, { finanzen: { kreditkarten: [{ name: 'Testkarte', jahresgebuehr: '100', ausgabenMonat: '800', cashback: '1' }] } }],
  ['mietzins', MietzinsOrientierung, { basis: { canton: 'BS', household: { adults: 1, children: [] } }, finanzen: { monthlyIncome: 3000, incomeType: 'netto' }, wohnen: { rentAmount: 1200 } }],
  ['stipendien', StipendienView, { basis: { canton: 'BE' } }],
  ['vorsorge', VorsorgeRechner, { ...maria, finanzen: { monthlyIncome: 6000, incomeType: 'brutto' } }],
  ['schulden', SchuldenManager, { schulden: [{ id: 1, creditor: 'Test AG', amount: '500', status: 'open', category: 'sonstige' }] }],
  ['eo', EOrechner, { ...maria, finanzen: { monthlyIncome: 6000, incomeType: 'brutto' } }],
];

// Schulden: der Start-Reiter «Übersicht» hat keine Eingaben — «Ihre Angaben» steht in den Reitern Plan und
// Forderungen (eigener Test unten).
const OHNE_ANGABEN_START = new Set(['schulden']);

const TEILE = ['kopf', 'ergebnis', 'angaben', 'tun', 'stelle', 'quelle'];
const reihenfolge = (html) => TEILE.map((teil) => html.indexOf('data-teil="' + teil + '"')).filter((i) => i >= 0);

describe('Rechner-Form X: Ergebnis vor den Angaben, role=status', () => {
  for (const [view, C, mitErgebnis] of RECHNER) {
    for (const [fall, data] of [['ohne Angaben', leer], ['mit Ergebnis', mitErgebnis]]) {
      it(`${view} (${fall}): Teile in der Reihenfolge der Form`, () => {
        const html = render(C, data);
        expect(html).toContain('data-rechner-form="' + view + '"');
        const pos = reihenfolge(html);
        expect(pos.length).toBeGreaterThanOrEqual(4);
        expect([...pos].sort((a, b) => a - b)).toEqual(pos);
        if (!OHNE_ANGABEN_START.has(view)) expect(html.indexOf('data-teil="ergebnis"')).toBeLessThan(html.indexOf('data-teil="angaben"'));
      });
      it(`${view} (${fall}): Ergebnis ist eine Live-Region, Angaben aufgeklappt mit «x von n»`, () => {
        const html = render(C, data);
        expect(html).toMatch(/data-teil="ergebnis" role="status" aria-live="polite"/);
        if (OHNE_ANGABEN_START.has(view)) return;
        expect(html).toMatch(/<details data-teil="angaben" open=""/);
        expect(html).toMatch(/\d+ von \d+/);
      });
      it(`${view} (${fall}): Quelle als feste letzte Zeile`, () => {
        const html = render(C, data);
        const q = html.indexOf('data-teil="quelle"');
        expect(q).toBeGreaterThan(html.indexOf('data-teil="ergebnis"'));
        expect(reihenfolge(html).at(-1)).toBe(q);
      });
    }
    it(`${view}: Brotkrume «Übersicht › Kapitel › Rechner» im Kopf`, () => {
      const html = render(C, leer);
      const kapitel = RECHNER_KAPITEL[view];
      expect(CHAPTER_KEYS).toContain(kapitel);
      expect(html).toContain('<nav aria-label="' + de.nav.pfad + '"');
      expect(html).toContain('>' + de.chapters[kapitel].title.replace(/&/g, '&amp;') + '</button>');
      expect(html).toMatch(/aria-current="page"/);
    });
  }
  it('jeder Eintrag in RECHNER_KAPITEL ist hier geprüft', () => {
    expect(Object.keys(RECHNER_KAPITEL).sort()).toEqual(RECHNER.map(([v]) => v).sort());
  });
});

describe('ALV in der Form X', () => {
  it('Einzelwahl als radiogroup mit role=radio und aria-checked', () => {
    const html = render(AlvRechner, leer);
    expect((html.match(/role="radiogroup"/g) || []).length).toBe(2);
    expect(html).toMatch(/role="radio" aria-checked="(true|false)"/);
  });
  it('ohne Lohn: an der Stelle des Ergebnisses der App-Satz', () => {
    const html = render(AlvRechner, leer);
    const ergebnis = html.slice(html.indexOf('data-teil="ergebnis"'), html.indexOf('data-teil="angaben"'));
    expect(ergebnis).toContain(de.alv.enterBrutto.sie);
    expect(ergebnis).toContain('data-ergebnis-art="schaetzung"');
  });
  it('F7-R4: Netto im Profil → Brutto geschätzt vorbelegt und sichtbar markiert', () => {
    const html = render(AlvRechner, maria);
    expect(html).toContain('data-geschaetzt=""');
    expect(html).toMatch(/id="alv-brutto"[^>]*value="\d{4,5}"/);
    expect(html).toContain('Geschätzt aus dem Nettolohn im Profil');
    // Das Ergebnis rechnet mit der Schätzung.
    expect(html).toContain('data-grosse-zahl');
  });
  it('F7-R4: Brutto im Profil → keine Marke, der hinterlegte Wert gilt', () => {
    const html = render(AlvRechner, { ...maria, finanzen: { monthlyIncome: 6100, incomeType: 'brutto' } });
    expect(html).not.toContain('data-geschaetzt');
    expect(html).toMatch(/id="alv-brutto"[^>]*value="6100"/);
  });
  it('Befund X: ein Kind über 25 (nur Geburtsdatum) belegt «Kinder: ja» nicht vor', () => {
    const kind = (k) => render(AlvRechner, { ...leer, basis: { household: { adults: 1, children: [k] } } });
    const kinderJa = (html) => /aria-labelledby="alv-kinder-label"[^>]*><button type="button" role="radio" aria-checked="true"/.test(html);
    expect(kinderJa(kind({ birthDate: '1990-01-01', age: '' }))).toBe(false);
    expect(kinderJa(kind({ birthDate: '2015-01-01', age: '' }))).toBe(true);
    expect(kinderJa(kind({ age: 30 }))).toBe(false);
    expect(kinderJa(kind({}))).toBe(true); // ohne Alter zählt das Kind (überschreibbar)
  });
  it('ein Name für Titel, Menü und Suche: «Arbeitslosenentschädigung», «ALV-Taggeld» bleibt Suchwort', async () => {
    for (const sprache of [de, en, fr, itTranslations, rm]) expect(sprache.nav.alv).toBe(sprache.alv.title);
    const { SEARCH_VIEWS } = await import('../config/ansichtenRegister.js');
    expect(SEARCH_VIEWS.find((v) => v.view === 'alv').aliases).toContain('alv-taggeld');
  });
});

const ergebnisTeil = (html) => html.slice(html.indexOf('data-teil="ergebnis"'), html.indexOf('data-teil="angaben"'));

describe('Stundenlohn in der Form X', () => {
  const mit = { finanzen: { stundenlohnRechner: { betrag: '24', wochenstunden: '20', kanton: 'GE', ferienForm: 'dazu' } } };
  it('Rechnung und Mindestlohn-Einordnung stehen im Ergebnis, vor den Angaben', () => {
    const teil = ergebnisTeil(render(Stundenlohn, mit));
    expect(teil).toContain(de.stundenlohnView.rechnungTitel);
    expect(teil).toContain(de.stundenlohnView.einordnungTitel);
  });
  it('ohne Betrag: der App-Satz an der Stelle des Ergebnisses', () => {
    expect(ergebnisTeil(render(Stundenlohn, leer))).toContain(de.stundenlohnView.brauchtBetrag);
  });
  it('Ja/Nein/Weiss-nicht-Fragen als radiogroup', () => {
    expect((render(Stundenlohn, mit).match(/role="radiogroup"/g) || []).length).toBeGreaterThanOrEqual(3);
  });
});

describe('Kreditkarte in der Form X', () => {
  it('Ergebnis-Satz und Balken vor den Angaben; ohne Ausgaben der App-Satz', () => {
    const mit = ergebnisTeil(render(Kreditkarte, { finanzen: { kreditkarten: [{ jahresgebuehr: '100', ausgabenMonat: '800', cashback: '1' }] } }));
    expect(mit).toContain(de.kreditkarteView.rechnungTitel);
    expect(ergebnisTeil(render(Kreditkarte, leer))).toContain(de.kreditkarteView.ergebnis_brauchtAusgaben);
  });
});

describe('Mietzinsbeiträge in der Form X', () => {
  const bs = { basis: { canton: 'BS', household: { adults: 1, children: [] } }, finanzen: { monthlyIncome: 3000, incomeType: 'netto' }, wohnen: { rentAmount: 1200 } };
  it('Einschätzung zuerst, mit dem Miet-Barometer (F7-R3) im Ergebnis', () => {
    const teil = ergebnisTeil(render(MietzinsOrientierung, bs));
    expect(teil).toContain(de.mietzinsView.compareTitle.sie || de.mietzinsView.compareTitle);
    expect(teil.indexOf('data-ergebnis-art')).toBeGreaterThan(0);
  });
  it('ohne Kanton: der App-Satz an der Stelle des Ergebnisses', () => {
    expect(ergebnisTeil(render(MietzinsOrientierung, leer))).toContain(de.mietzinsView.enterCanton.sie || de.mietzinsView.enterCanton);
  });
});

describe('Stipendien in der Form X', () => {
  it('Kurz-Check: Fragen als radiogroup, ohne Antwort die Frage an der Stelle des Ergebnisses', () => {
    const html = render(StipendienView, leer);
    expect((html.match(/role="radiogroup"/g) || []).length).toBe(2);
    expect(ergebnisTeil(html)).toContain(de.stip.checkTitle.sie);
    expect(ergebnisTeil(html)).toContain('data-ergebnis-art="vorpruefung"');
  });
});

describe('Tabs (a11y M4): tablist/tab/tabpanel, roving tabindex', () => {
  const html = renderToStaticMarkup(React.createElement(Tabs, { palette, id: 'x', label: 'Reiter', aktiv: 'b', onWahl: () => {},
    liste: [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }] }, 'Inhalt'));
  it('Rollen und Verknüpfung', () => {
    expect(html).toContain('role="tablist" aria-label="Reiter"');
    expect((html.match(/role="tab"/g) || []).length).toBe(2);
    expect(html).toMatch(/id="x-tab-b"[^>]*role="tab" aria-selected="true" aria-controls="x-panel" tabindex="0"/);
    expect(html).toMatch(/id="x-tab-a"[^>]*aria-selected="false"[^>]*tabindex="-1"/);
    expect(html).toContain('role="tabpanel" id="x-panel" aria-labelledby="x-tab-b"');
  });
  it('Pfeiltasten wählen den nächsten Reiter (rundum), Pos1/Ende springen', () => {
    const gewaehlt = [];
    const el = Tabs({ palette, id: 'y', label: 'R', aktiv: 'a', onWahl: (k) => gewaehlt.push(k), liste: [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }, { key: 'c', label: 'C' }] });
    const knoepfe = el.props.children[0].props.children;
    const druck = (i, key) => knoepfe[i].props.onKeyDown({ key, preventDefault: () => {} });
    druck(0, 'ArrowRight'); druck(0, 'ArrowLeft'); druck(1, 'End'); druck(2, 'Home');
    expect(gewaehlt).toEqual(['b', 'c', 'c', 'a']);
  });
});

describe('Vorsorge in der Form X', () => {
  const mit = { ...maria, finanzen: { monthlyIncome: 6000, incomeType: 'brutto' } };
  it('Reiter über die Tabs-Komponente; Ergebnis (AHV-Rente) vor den Angaben im Reiter-Feld', () => {
    const html = render(VorsorgeRechner, mit);
    expect(html).toContain('id="vr-tab-ahv"');
    const panel = html.indexOf('role="tabpanel"');
    expect(panel).toBeGreaterThan(0);
    expect(panel).toBeLessThan(html.indexOf('data-teil="ergebnis"'));
    expect(ergebnisTeil(html)).toContain(de.vr.ahvRente);
  });
  it('Verheiratet als radiogroup', () => {
    expect(render(VorsorgeRechner, mit)).toContain('aria-labelledby="vr-verheiratet-label"');
  });
});

describe('Schulden in der Form X', () => {
  const mit = { schulden: [{ id: 1, creditor: 'Test AG', amount: '500', status: 'open', category: 'sonstige' }] };
  it('fünf Reiter über die Tabs-Komponente, Beratung als «was zu tun ist»', () => {
    const html = render(SchuldenManager, mit, { onSave: () => {} });
    expect((html.match(/role="tab"/g) || []).length).toBe(5);
    expect(html).toContain('id="schulden-tab-overview"');
    expect(html.slice(html.indexOf('data-teil="tun"'))).toContain('0800 708 708');
  });
  it('Reiter «Forderungen» und «Plan»: Ergebnis vor «Ihre Angaben»', () => {
    for (const startView of ['debts', 'plan']) {
      const html = render(SchuldenManager, mit, { onSave: () => {}, startView });
      expect(html).toMatch(/<details data-teil="angaben" open=""/);
      expect(html.indexOf('data-teil="ergebnis"')).toBeLessThan(html.indexOf('data-teil="angaben"'));
    }
  });
  it('ohne Forderungen: der Leer-Satz an der Stelle des Ergebnisses', () => {
    expect(ergebnisTeil(render(SchuldenManager, leer, { onSave: () => {} })).length).toBeGreaterThan(0);
    expect(render(SchuldenManager, leer, { onSave: () => {} })).toContain(de.schulden.emptyDebts.sie || de.schulden.emptyDebts);
  });
});
