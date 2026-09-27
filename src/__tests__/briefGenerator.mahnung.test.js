import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { generateLetter, getLetterTemplates, BRIEF_ANGABEN, briefCanRender, mahnFrist, angabenEingetippt } from '../briefGenerator.js';
import BriefGenerator, { briefUebersetzer } from '../BriefGenerator.jsx';
import { MahnungErhalten } from '../MahnungErhalten.jsx';
import { LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';

// Mahnung (Entscheid Stebler Studios 27.09.2026: «beides» — erhalten und selbst mahnen).
// Gesetzesstellen am Wortlaut (Fedlex-Filestore, 27.09.2026): OR Stand 1.1.2026, SchKG
// Stand 1.1.2026, KVG Stand 1.7.2026, KVV Stand 1.8.2026.
// Diese Tests pinnen die SACHE (Rechtsregel), nicht die Schreibweise.

const ALL = { de, en, fr, it: itTranslations, rm };
const t = createT(ALL, 'de', 'sie');
const FILL = '[bitte ergänzen]';
const NEU = ['paymentReminder', 'claimDispute', 'installmentRequest'];
const person = { basis: { firstName: 'Alex', lastName: 'Muster' }, wohnen: { address: 'Seeweg 1', postalCode: '4051', city: 'Basel' } };

// Nur ab <body>: der Kopf trägt Stil-Regeln, keine Brieftexte (wie briefGenerator.lebensereignisse.test.js).
const brief = (html) => html.split('<body>')[1];
const koerper = (html) => html.match(/<div class="body-text">([\s\S]*?)<\/div>/)[1];
const betreff = (html) => html.match(/<div class="subject">([\s\S]*?)<\/div>/)[1];
const hinweis = (html) => (html.match(/<div class="legal-note">([\s\S]*?)<\/div>/) || [, ''])[1];

describe('Mahnung-Briefe — angeboten und renderbar', () => {
  const liste = getLetterTemplates(t, person);
  it.each(NEU)('%s steht in der Liste, mit Kapitel finanzen', (key) => {
    const v = liste.find(x => x.key === key);
    expect(v).toBeTruthy();
    expect(v.chapter).toBe('finanzen');
    expect(v.title).not.toMatch(/^briefe\./);
    expect(briefCanRender(key)).toBe(true);
  });
  it('Gesetzesstelle nur, wo sie die Grundlage ist', () => {
    const ref = Object.fromEntries(liste.map(v => [v.key, v.legalRef]));
    expect(ref.paymentReminder).toBe('OR Art. 102');
    expect(ref.claimDispute).toBe('');
    expect(ref.installmentRequest).toBe(''); // OR 135 ist die Warnung, nicht die Grundlage
  });
  it.each(NEU)('%s: ohne Angaben — Platzhalter, keine rohen Schlüssel', (key) => {
    const html = brief(generateLetter(key, {}, t));
    expect(html).toContain(FILL);
    expect(html).not.toMatch(/briefe\.[a-zA-Z]/);
    expect(html).not.toMatch(/\{[a-z]+\}/);
    expect(html).not.toContain('undefined');
    expect(html).not.toContain('NaN');
  });
  it.each(['fr', 'it', 'en', 'rm'])('%s: alle drei Briefe ohne rohe Schlüssel', (lang) => {
    const tl = createT(ALL, lang, 'sie');
    for (const key of NEU) {
      const html = brief(generateLetter(key, person, tl, { angaben: { betrag: '120', rate: '40' } }));
      expect(html, `${lang}/${key}`).not.toMatch(/briefe\.[a-zA-Z]/);
      expect(html, `${lang}/${key}`).not.toMatch(/\{[a-z]+\}/);
    }
  });
  it('rm: Briefe kommen auf Deutsch (rm-Fassung fehlt), die Ansicht bleibt rätoromanisch', () => {
    const tRm = createT(ALL, 'rm', 'sie');
    for (const key of NEU) {
      expect(briefUebersetzer({ lang: 'rm', anrede: 'sie', selected: key, t: tRm, geladen: { de, rm } })).not.toBe(tRm);
    }
  });
});

describe('paymentReminder — selbst mahnen (OR Art. 102, 104)', () => {
  const a = { grund: 'Darlehen vom 3. März 2026', betrag: "1'250", faellig: '2026-06-30', frist: '20' };
  it('Erinnerung: freundlich, OHNE Zins und OHNE Betreibung', () => {
    const k = koerper(generateLetter('paymentReminder', person, t, { angaben: a }));
    expect(k).toContain('CHF 1’250');
    expect(k).toContain('30.06.2026');
    expect(k).not.toMatch(/Verzugszins|5 %/);
    expect(k).not.toContain('Betreibung');
  });
  it('Mahnung: Zins nur VORBEHALTEN (kein berechneter Betrag), Betreibung als geprüfter Schritt', () => {
    const html = generateLetter('paymentReminder', person, t, { angaben: { ...a, stufe: 'mahnung' } });
    const k = koerper(html);
    expect(k).toContain('Ich behalte mir vor, Verzugszins von 5 % pro Jahr zu verlangen (Art. 104 Abs. 1 OR).');
    expect(k).toContain('Betreibung');
    expect(betreff(html)).toMatch(/^Mahnung/);
    // Kein aufgelaufener Zinsbetrag: die App kennt weder Verzugsbeginn noch Verfalltag.
    expect(k.match(/CHF [\d’.]+/g)).toEqual(['CHF 1’250']);
  });
  it('Frist ab heute nach Wahl, ungültige Wahl → Vorgabe 20 Tage', () => {
    expect(mahnFrist('10', '2026-09-27')).toBe('2026-10-07');
    expect(mahnFrist('30', '2026-12-15')).toBe('2027-01-14');
    expect(mahnFrist('x', '2026-09-27')).toBeNull();
    const k = koerper(generateLetter('paymentReminder', person, t, { angaben: { ...a, frist: '99' } }));
    expect(k).not.toContain(FILL);
  });
  it('Zahlungsverbindung erscheint nur, wenn eingetippt', () => {
    expect(koerper(generateLetter('paymentReminder', person, t, { angaben: a }))).not.toContain('Zahlungsverbindung');
    expect(koerper(generateLetter('paymentReminder', person, t, { angaben: { ...a, zahlungsweg: 'CH00 0000' } }))).toContain('Zahlungsverbindung: CH00 0000');
  });
  it('Eingaben werden escaped', () => {
    const k = koerper(generateLetter('paymentReminder', person, t, { angaben: { ...a, grund: '<script>x</script>' } }));
    expect(k).not.toContain('<script>');
  });
});

describe('claimDispute — bestreiten, nichts anerkennen', () => {
  it('ganze Forderung: bestritten, Unterlagen verlangt, keine Zahlungszusage', () => {
    const k = koerper(generateLetter('claimDispute', person, t, { angaben: { rechnungsnummer: 'R-17', rechnungsdatum: '2026-05-02' } }));
    expect(k).toContain('Ich bestreite diese Forderung.');
    expect(k).toContain('Aufstellung');
    // OR Art. 135 Ziff. 1: keine Anerkennung, auch keine des «Rests».
    expect(k).not.toMatch(/anerkenn|begleiche|bezahle ich|zahle ich/i);
  });
  it('Teilbestreitung nennt den Betrag genau — und anerkennt den Rest NICHT', () => {
    const k = koerper(generateLetter('claimDispute', person, t, { angaben: { umfang: 'teil', teilbetrag: '80.50' } }));
    expect(k).toContain('im Umfang von CHF 80.50');
    expect(k).not.toMatch(/anerkenn|übrigen|restlich/i);
  });
  it('mehrdeutiger Betrag → Platzhalter statt falscher Zahl', () => {
    const k = koerper(generateLetter('claimDispute', person, t, { angaben: { umfang: 'teil', teilbetrag: '1.234,50' } }));
    expect(k).toContain('CHF ' + FILL);
  });
  it('«bereits bezahlt» nur auf Wahl der Person; Einschätzung nur als solche', () => {
    const ohne = koerper(generateLetter('claimDispute', person, t, { angaben: {} }));
    expect(ohne).not.toContain('bereits bezahlt');
    expect(ohne).not.toContain('Einschätzung');
    const mit = koerper(generateLetter('claimDispute', person, t, { angaben: { grund: 'bezahlt', einschaetzung: 'doppelt verrechnet' } }));
    expect(mit).toContain('bereits bezahlt');
    expect(mit).toContain('Meine Einschätzung: doppelt verrechnet');
  });
  it('Bildschirm-Hinweis: kein Rechtsvorschlag, SchKG Art. 74', () => {
    expect(hinweis(generateLetter('claimDispute', person, t))).toContain('SchKG Art. 74');
  });
});

describe('installmentRequest — Vorschlag, Anerkennungs-Falle vorne', () => {
  it('Raten und Beginn im Brief, um Bestätigung gebeten', () => {
    const k = koerper(generateLetter('installmentRequest', person, t, { angaben: { rechnungsnummer: 'R-9', betrag: '900', rate: '150', ab: '2026-10-31' } }));
    expect(k).toContain('CHF 900');
    expect(k).toContain('Raten von CHF 150');
    expect(k).toContain('31.10.2026');
    expect(k).toContain('schriftlich');
  });
  it('keine Rechnung «Anzahl Raten» — Zins und Gebühren kennt die App nicht', () => {
    const k = koerper(generateLetter('installmentRequest', person, t, { angaben: { betrag: '900', rate: '150' } }));
    expect(k).not.toMatch(/\b6\b.*Raten|sechs/);
  });
  it('Bildschirm-Hinweis nennt OR Art. 135', () => {
    expect(hinweis(generateLetter('installmentRequest', person, t))).toContain('OR Art. 135');
  });
});

describe('Briefgenerator-Ansicht — Hinweis VOR dem Formular', () => {
  const render = (initialTemplate) => renderToStaticMarkup(React.createElement(BriefGenerator, { palette: LIGHT_PALETTE, t, data: {}, onNavigate: () => {}, initialTemplate }));
  it('Ratengesuch: die Anerkennungs-Warnung steht vor den Angaben', () => {
    const html = render('installmentRequest');
    const warnung = html.indexOf('als Anerkennung der Forderung');
    expect(warnung).toBeGreaterThan(-1);
    expect(warnung).toBeLessThan(html.indexOf(de.briefe.angaben.title));
  });
  it('Bestreiten: Zahlungsbefehl → Rechtsvorschlag', () => {
    expect(render('claimDispute')).toContain('SchKG Art. 74');
  });
  it.each(NEU)('%s: Angaben sind nicht eingetippt, solange leer (Export-Vorschau)', (key) => {
    expect(angabenEingetippt(key, {})).toBe(false);
    expect(BRIEF_ANGABEN[key].length).toBeGreaterThan(0);
  });
});

describe('Ablauf «Mahnung erhalten»', () => {
  const html = renderToStaticMarkup(React.createElement(MahnungErhalten, { palette: LIGHT_PALETTE, t, onNavigate: () => {} }));
  it('rendert ohne rohe Schlüssel, mit allen drei Brief-Wegen', () => {
    expect(html).not.toMatch(/mahnung\.[a-zA-Z]|briefe\.[a-zA-Z]/);
    for (const k of ['paymentReminder', 'claimDispute', 'installmentRequest']) expect(html).toContain(de.briefe.ablaufLink[k]);
  });
  it('Miete: 30 Tage Frist bei Wohnungen (OR Art. 257d) steht drin', () => {
    expect(html).toContain('mindestens 30 Tage');
    expect(html).toContain('OR Art. 257d');
  });
  it('keine Behauptung, Mahngebühren seien verboten oder erlaubt — nur die Frage nach der Grundlage', () => {
    expect(html).toContain('worauf sie sich stützen');
    expect(html).not.toMatch(/Mahngebühren sind (nicht )?(erlaubt|verboten|unzulässig)/);
  });
});
