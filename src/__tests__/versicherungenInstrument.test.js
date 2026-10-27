// Fassung 6 · Kapitel Versicherungen, Schritt 2 (Runde 9, Entwurf AA nachgebessert, Sophie 24./25.10.2026):
// Versicherungen pro Monat, KK-Last gegen WHO 10 %, Schutzschild klein, Franchise-Kreuz klein mit Weg zur
// Übersicht, «Alle Versicherungen auf einen Blick» zuoberst in «Passend».
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { VersicherungenInstrument } from '../components/VersicherungenInstrument.jsx';
import { ChapterViewComplete } from '../ChapterView.jsx';
import { getChapters, LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import { calculateMonthlyBudget } from '../budgetSync.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { DEMO_DATA } from '../config/demoData.js';

const t = createT({ de }, 'de', 'sie');
const nurText = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const instrument = (versicherungen, allData = DEMO_DATA) => renderToStaticMarkup(React.createElement(VersicherungenInstrument, {
  palette: LIGHT_PALETTE, t, versicherungen, allData, onNavigate: () => {}, uebersichtName: 'Prämien-Orientierung',
}));
const QUELLE = fs.readFileSync(path.resolve(__dirname, '../ChapterView.jsx'), 'utf8');

describe('Versicherungen pro Monat', () => {
  it('Maria: CHF 570 = KK 540.30 + Hausrat 20 + Haftpflicht 10 — dieselbe Zahl wie die Budget-Gruppe', () => {
    const text = nurText(instrument(DEMO_DATA.versicherungen));
    expect(text).toContain('Versicherungen pro Monat CHF 570');
    expect(text).toContain('Krankenkasse (Grundversicherung) CHF 540.30');
    expect(text).toContain('Hausrat (CHF 240 / Jahr) CHF 20');
    expect(text).toContain('Haftpflicht (CHF 120 / Jahr) CHF 10');
    expect(text).toContain('Die Pensionskasse (CHF 420) ist schon vom Lohn abgezogen.');
    const b = calculateMonthlyBudget(DEMO_DATA, t);
    expect(Math.round(b.expenses.healthInsurance + b.expenses.householdInsurance + b.expenses.liabilityInsurance + b.expenses.otherInsurance)).toBe(570);
  });
  it('Versicherung «Ja» ohne Prämie: genannt, nicht geschätzt', () => {
    const v = { ...DEMO_DATA.versicherungen, liabilityPremium: '' };
    expect(nurText(instrument(v))).toContain('Haftpflicht: Prämie nicht erfasst.');
  });
  it('Fahrzeugversicherung zählt nicht, mit Satz', () => {
    const v = { ...DEMO_DATA.versicherungen, autoInsurance: 'yes', autoInsuranceAmount: '900' };
    const text = nurText(instrument(v));
    expect(text).toContain('CHF 570');
    expect(text).toContain('Die Fahrzeugversicherung zählt hier nicht mit');
  });
  it('ohne Prämie: kein Geld-Teil, das Netz-Schild steht trotzdem', () => {
    const v = { kkInsurer: 'CSS', uvg: 'employer', liabilityInsurance: 'yes' };
    const html = instrument(v, { ...DEMO_DATA, versicherungen: v });
    expect(html).not.toContain('Versicherungen pro Monat');
    expect(html).toContain('data-schild="netz"');
  });
});

describe('KK-Last', () => {
  it('Maria: 8.7 % des Einkommens, Marke WHO 10 %, Satz «unter 10 %»', () => {
    const text = nurText(instrument(DEMO_DATA.versicherungen));
    expect(text).toContain('8.7 % des Einkommens');
    expect(text).toContain('WHO 10 %');
    expect(text).toContain(de.kkLast.underNote);
  });
  it('über 10 %: Satz «über dem Richtwert» und Weg zur IPV', () => {
    const v = { ...DEMO_DATA.versicherungen, kkPremium: '700' };
    const text = nurText(instrument(v));
    expect(text).toContain(de.kkLast.overNote);
    expect(text).toContain(de.kkLast.ipvLink);
  });
});

describe('Netz-Schild, an einem Ort (F7-K3-6)', () => {
  it('im Instrument das Netz-Schild statt der zwei kleinen Schilde', () => {
    const html = instrument(DEMO_DATA.versicherungen);
    expect(html).toContain('data-schild="netz"');
    expect(html).not.toContain('data-schild="klein"');
  });
  it('das Spinnennetz steht nicht mehr im Kapitel', () => {
    expect(QUELLE).not.toContain('VersicherungsNetz');
  });
  it('das grosse Schild steht nicht mehr im Kapitel', () => {
    expect(QUELLE).not.toContain('React.createElement(Schutzschild');
    expect(QUELLE).toContain("const VersicherungenInstrument = React.lazy(");
  });
});

describe('«Passend»: zuoberst alle Versicherungen auf einen Blick', () => {
  it('erste Zeile führt zur Seite, die Versicherungs-Übersicht wird', () => {
    const chapters = getChapters(t);
    const text = nurText(renderToStaticMarkup(React.createElement(ChapterViewComplete, {
      palette: LIGHT_PALETTE, t, chapter: chapters.find((c) => c.key === 'versicherungen'), data: DEMO_DATA.versicherungen, allData: DEMO_DATA,
      onUpdate: () => {}, onUpdateIn: () => {}, onNavigate: () => {},
    })));
    const passend = text.slice(text.indexOf('Passend zu diesem Bereich'));
    expect(passend.indexOf('Alle Versicherungen auf einen Blick')).toBeGreaterThan(-1);
    expect(passend.indexOf('Alle Versicherungen auf einen Blick')).toBeLessThan(passend.indexOf('Krankenkasse wechseln'));
  });
});

describe('Texte in allen fünf Sprachen', () => {
  const schluessel = Object.keys(de.versInstrument);
  for (const [name, s] of Object.entries({ en, fr, it: it_, rm })) {
    it(name, () => {
      for (const k of schluessel) expect(s.versInstrument?.[k], name + ' ' + k).toBeTruthy();
      expect(s.chapterView.passend.alleVersicherungen).toBeTruthy();
      expect(s.chapterView.passend.alleVersicherungenSub).toBeTruthy();
    });
  }
});

// Fachprüfung und a11y-Prüfung nach dem Bau (25.10.2026).
describe('Nachprüfung', () => {
  const mitFinanzen = (finanzen) => ({ ...DEMO_DATA, finanzen: { ...DEMO_DATA.finanzen, ...finanzen } });
  it('PK-Satz nur bei Angestellten mit netto erfasstem Lohn', () => {
    expect(nurText(instrument(DEMO_DATA.versicherungen))).toContain('Die Pensionskasse (CHF 420)');
    expect(nurText(instrument(DEMO_DATA.versicherungen, mitFinanzen({ incomeType: 'brutto' })))).not.toContain('Die Pensionskasse');
    expect(nurText(instrument(DEMO_DATA.versicherungen, mitFinanzen({ employmentType: 'selfEmployed' })))).not.toContain('Die Pensionskasse');
  });
  it('Kasse erfasst, Prämie nicht: «Krankenkasse» steht zuerst bei «nicht erfasst»', () => {
    const v = { ...DEMO_DATA.versicherungen, kkPremium: '', liabilityPremium: '' };
    expect(nurText(instrument(v))).toContain('Krankenkasse, Haftpflicht: Prämie nicht erfasst.');
  });
  it('KK-Last mit Quelle (WHO) und Marke «Orientierung»', () => {
    const text = nurText(instrument(DEMO_DATA.versicherungen));
    expect(text).toContain('WHO / UNO SDG-Indikator 3.8.2');
  });
  it('Netz-Schild: Stand als Liste mit Rollen und als Satz, nicht nur im Bild', () => {
    const html = instrument(DEMO_DATA.versicherungen);
    expect(html).toContain('role="list"');
    expect(html).toContain('data-teil="netz-schild-satz"');
  });
});
