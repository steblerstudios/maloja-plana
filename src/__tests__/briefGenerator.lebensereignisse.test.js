import { describe, it, expect } from 'vitest';
import {
  generateLetter, getLetterTemplates, leseAngaben, BRIEF_ANGABEN,
  rechtsvorschlagFrist, klageFrist336b, briefCanRender,
} from '../briefGenerator.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';

// Vier Brief-Vorlagen für Lebensereignisse (Entscheid Stebler Studios 26.09.2026).
// Gesetzesstellen am Wortlaut (lexfind-PDF, 26.09.2026): OR + SchKG Stand 1.1.2026,
// ZPO + ZGB Stand 1.7.2026.

const ALL = { de, en, fr, it: itTranslations, rm };
const t = createT(ALL, 'de', 'sie');
const tDu = createT(ALL, 'de', 'du');
const FILL = '[bitte ergänzen]';
const NEU = ['workReference', 'dismissalObjection', 'debtObjection', 'deathNotice'];

const person = {
  basis: { firstName: 'Alex', lastName: 'Muster' },
  wohnen: { address: 'Seeweg 1', postalCode: '4051', city: 'Basel' },
  finanzen: { employer: 'Beispiel AG', employerAddress: 'Hauptstrasse 5\n8000 Zürich', sideEmployer: 'Neben GmbH', sideEmployerAddress: 'Gasse 2\n3000 Bern' },
};

// Nur der Brieftext (Absätze), ohne Bildschirm-Hinweis — das geht an den Empfänger.
const brief = (html) => html.split('<body>')[1];
const koerper = (html) => html.match(/<div class="body-text">([\s\S]*?)<\/div>/)[1];
const betreff = (html) => html.match(/<div class="subject">([\s\S]*?)<\/div>/)[1];
const empfaenger = (html) => html.match(/<div class="recipient">([\s\S]*?)<\/div>\s*<div class="date-line">/)[1];

describe('Lebensereignis-Briefe — angeboten, renderbar, mit Gesetzesstelle', () => {
  const liste = getLetterTemplates(t, person);
  it.each(NEU)('%s steht in der Liste, mit legalRef und Kapitel', (key) => {
    const v = liste.find(x => x.key === key);
    expect(v).toBeTruthy();
    expect(v.legalRef).toMatch(/Art\. \d/);
    expect(v.chapter).toBeTruthy();
    expect(v.title).not.toMatch(/^briefe\./);
    expect(briefCanRender(key)).toBe(true);
  });
  it('legalRef je Vorlage', () => {
    const ref = Object.fromEntries(liste.map(v => [v.key, v.legalRef]));
    expect(ref.workReference).toBe('OR Art. 330a');
    expect(ref.dismissalObjection).toBe('OR Art. 336b');
    expect(ref.debtObjection).toBe('SchKG Art. 74');
    expect(ref.deathNotice).toBe('ZGB Art. 571');
  });
  it.each(NEU)('%s: ohne Daten und Angaben — nur Platzhalter, keine rohen Schlüssel', (key) => {
    const html = brief(generateLetter(key, {}, t));
    expect(html).toContain(FILL);
    expect(html).not.toMatch(/briefe\.[a-zA-Z]/);
    expect(html).not.toMatch(/\{[a-z]+\}/);
    expect(html).not.toContain('undefined');
    expect(html).not.toContain('NaN');
  });
  it.each(['fr', 'it', 'en', 'rm'])('%s: alle vier Briefe ohne rohe Schlüssel oder Lücken', (lang) => {
    const tl = createT(ALL, lang, 'sie');
    for (const key of NEU) {
      const html = brief(generateLetter(key, person, tl, { angaben: { umfang: 'teil', art: 'voll', begruendung: true, einschaetzung: 'x' } }));
      expect(html).not.toMatch(/briefe\.[a-zA-Z]/);
      expect(html).not.toMatch(/\{[a-z]+\}/);
    }
  });
});

describe('Escaping — jede Eingabe genau einmal', () => {
  const boese = '<script>x</script> & Co';
  const erwartet = '&lt;script&gt;x&lt;/script&gt; &amp; Co';
  const faelle = {
    workReference: { data: { ...person, finanzen: { employer: boese, employerAddress: boese } }, angaben: {} },
    dismissalObjection: { data: person, angaben: { einschaetzung: boese } },
    debtObjection: { data: person, angaben: { betreibungsnummer: boese, glaeubiger: boese } },
    deathNotice: { data: person, angaben: { verstorben: boese, vertragsnummer: boese } },
  };
  it.each(NEU)('%s', (key) => {
    const { data, angaben } = faelle[key];
    const html = generateLetter(key, data, t, { angaben });
    expect(html).toContain(erwartet);
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('&amp;amp;');
    expect(html).not.toContain('&amp;lt;');
  });
});

describe('leseAngaben — Vorgaben, ungültige Wahl, Betrag', () => {
  it('setzt Vorgaben', () => {
    expect(leseAngaben('workReference', undefined)).toEqual({ art: 'voll', zeitpunkt: 'zwischen' });
    expect(leseAngaben('debtObjection', {}).umfang).toBe('ganz');
    expect(leseAngaben('dismissalObjection', {}).begruendung).toBe(true);
  });
  it('ungültige Wahl fällt auf die Vorgabe, Text wird getrimmt, Betrag mit Komma gelesen', () => {
    const a = leseAngaben('debtObjection', { umfang: 'alles', betreibungsnummer: '  123 ', teilbetrag: '250,50' });
    expect(a.umfang).toBe('ganz');
    expect(a.betreibungsnummer).toBe('123');
    expect(a.teilbetrag).toBe(250.5);
    expect(leseAngaben('debtObjection', { teilbetrag: '-5' }).teilbetrag).toBe(0);
  });
  it('jedes Feld hat einen Label-Text in allen Sprachen', () => {
    for (const lang of Object.keys(ALL)) {
      const tl = createT(ALL, lang, 'sie');
      for (const [key, felder] of Object.entries(BRIEF_ANGABEN)) {
        for (const f of felder) {
          const base = `briefe.${key}.felder.${f.key}`;
          expect(tl(base + '.label'), `${lang} ${base}`).not.toBe(base + '.label');
          for (const o of f.optionen || []) expect(tl(`${base}.${o}`), `${lang} ${base}.${o}`).not.toBe(`${base}.${o}`);
        }
      }
    }
  });
});

describe('workReference — OR Art. 330a', () => {
  it('Vollzeugnis nennt Art und Dauer, Leistungen und Verhalten (Abs. 1)', () => {
    const html = generateLetter('workReference', person, t, { angaben: { art: 'voll', zeitpunkt: 'zwischen' } });
    expect(betreff(html)).toContain('Zwischenzeugnis');
    expect(koerper(html)).toMatch(/Art und Dauer.*Leistungen.*Verhalten/);
  });
  it('Schlusszeugnis', () => {
    const html = generateLetter('workReference', person, t, { angaben: { art: 'voll', zeitpunkt: 'schluss' } });
    expect(betreff(html)).toBe('Bitte um ein Arbeitszeugnis');
  });
  it('Arbeitsbestätigung beschränkt sich auf Art und Dauer (Abs. 2) — ohne Leistung/Verhalten', () => {
    for (const zeitpunkt of ['zwischen', 'schluss']) {
      const html = generateLetter('workReference', person, t, { angaben: { art: 'bestaetigung', zeitpunkt } });
      expect(betreff(html)).toContain('Arbeitsbestätigung');
      expect(koerper(html)).toContain('Art und Dauer');
      expect(koerper(html)).not.toMatch(/Leistung|Verhalten/);
    }
  });
  it('Empfänger ist der gewählte Arbeitgeber — Nebenerwerb nie mit dem Hauptarbeitgeber', () => {
    expect(empfaenger(generateLetter('workReference', person, t))).toContain('Beispiel AG');
    const side = empfaenger(generateLetter('workReference', person, t, { job: 'side' }));
    expect(side).toContain('Neben GmbH');
    expect(side).not.toContain('Beispiel AG');
  });
  it('ohne Arbeitgeber: Empfänger-Platzhalter', () => {
    expect(empfaenger(generateLetter('workReference', { basis: person.basis }, t))).toContain(t('briefe.recipientPlaceholder'));
  });
});

describe('dismissalObjection — OR Art. 336b / 335', () => {
  it('Einsprache mit Datum, Begründungsbitte als Vorgabe', () => {
    const html = generateLetter('dismissalObjection', person, t, { angaben: { kuendigungsdatum: '2026-09-15' } });
    expect(betreff(html)).toContain('15.09.2026');
    expect(koerper(html)).toContain('Einsprache');
    expect(koerper(html)).toContain('336b');
    expect(koerper(html)).toContain('335 Abs. 2');
  });
  it('Begründung abwählbar', () => {
    const html = generateLetter('dismissalObjection', person, t, { angaben: { begruendung: false } });
    expect(koerper(html)).not.toContain('335 Abs. 2');
  });
  it('🛑 ohne Einschätzung nennt der Brief keinen Missbrauchsgrund', () => {
    const k = koerper(generateLetter('dismissalObjection', person, t));
    expect(k).not.toMatch(/missbräuchlich|\bRache\b|Diskriminierung|\bweil\b/i);
  });
  it('🛑 eine Einschätzung erscheint als Einschätzung, nicht als Tatsache', () => {
    const k = koerper(generateLetter('dismissalObjection', person, t, { angaben: { einschaetzung: 'meiner Mitgliedschaft in der Gewerkschaft' } }));
    expect(k).toContain('Nach meiner Einschätzung könnte');
    expect(k).toContain('meiner Mitgliedschaft in der Gewerkschaft');
  });
  it('Ende-Datum steht NICHT im Brief (nur Frist-Anzeige)', () => {
    const html = generateLetter('dismissalObjection', person, t, { angaben: { ende: '2026-12-31' } });
    expect(html).not.toContain('31.12.2026');
  });
  it('Klagefrist: 180 Tage nach dem Ende, Tag des Endes zählt nicht', () => {
    expect(klageFrist336b('2026-12-31')).toBe('2027-06-29');
    expect(klageFrist336b('')).toBeNull();
    expect(klageFrist336b('2026-02-31')).toBeNull();
  });
});

describe('debtObjection — SchKG Art. 74', () => {
  const angaben = { betreibungsnummer: '2026-4711', zustelldatum: '2026-09-21', glaeubiger: 'Inkasso AG' };
  it('ganze Forderung: Nummer, Zustelldatum, betreibende Partei, Bescheinigung', () => {
    const html = generateLetter('debtObjection', person, t, { angaben });
    expect(betreff(html)).toContain('2026-4711');
    const k = koerper(html);
    expect(k).toContain('21.09.2026');
    expect(k).toContain('Inkasso AG');
    expect(k).toContain('Rechtsvorschlag gegen die ganze Forderung');
    expect(k).toContain('74 Abs. 3');
  });
  it('Empfänger ist das Betreibungsamt (Platzhalter), nicht ein Arbeitgeber', () => {
    const e = empfaenger(generateLetter('debtObjection', person, t, { angaben }));
    expect(e).toContain('Betreibungsamt');
    expect(e).not.toContain('Beispiel AG');
  });
  it('Teilrechtsvorschlag nennt den Betrag genau (Abs. 2)', () => {
    const k = koerper(generateLetter('debtObjection', person, t, { angaben: { ...angaben, umfang: 'teil', teilbetrag: '1250.5' } }));
    expect(k).toContain('Teil der Forderung');
    expect(k).toMatch(/CHF 1.250\.50/);
  });
  it('Teilrechtsvorschlag ohne Betrag: Platzhalter statt geratener Zahl', () => {
    const k = koerper(generateLetter('debtObjection', person, t, { angaben: { ...angaben, umfang: 'teil' } }));
    expect(k).toContain(`CHF ${FILL}`);
  });
  it('keine Begründung im Brief (Art. 75 Abs. 1)', () => {
    const k = koerper(generateLetter('debtObjection', person, t, { angaben }));
    expect(k).not.toMatch(/\bweil\b|da die Forderung|Begründung/);
  });
  it('🛑 Frist: 10 Tage ab Zustellung, Tag der Zustellung zählt nicht, nie später als das Gesetz', () => {
    expect(rechtsvorschlagFrist('2026-09-21')).toBe('2026-10-01');
    // Monats- und Jahreswechsel
    expect(rechtsvorschlagFrist('2026-12-28')).toBe('2027-01-07');
    // Samstag als letzter Tag: KEINE Verlängerung auf Montag
    expect(rechtsvorschlagFrist('2026-09-16')).toBe('2026-09-26');
    expect(rechtsvorschlagFrist('')).toBeNull();
  });
  it('🛑 Frist-Hinweis in der App: 10 Tage, mündlich möglich, Postaufgabe genügt, Einschreiben', () => {
    for (const tl of [t, tDu]) {
      expect(tl('briefe.debtObjection.frist.title')).toContain('10 Tage');
      expect(tl('briefe.debtObjection.frist.text')).toMatch(/10 Tagen nach der Zustellung/);
      expect(tl('briefe.debtObjection.frist.muendlich')).toMatch(/mündlich/);
      expect(tl('briefe.debtObjection.frist.post')).toMatch(/Post.*ZPO Art\. 143/);
      expect(tl('briefe.debtObjection.frist.post')).toMatch(/eingeschrieben/);
    }
    // Aufgehobene Stelle nicht zitieren: SchKG Art. 32 Abs. 1 ist aufgehoben (ZPO-Anhang).
    for (const lang of Object.values(ALL)) {
      expect(JSON.stringify(lang.briefe.debtObjection)).not.toMatch(/32 (Abs|al|cpv|para)/);
    }
  });
});

describe('deathNotice — keine Annahme der Erbschaft (ZGB Art. 571 Abs. 2)', () => {
  const angaben = { verstorben: 'Kim Muster', todesdatum: '2026-09-10', vertragsnummer: 'P-99' };
  it('Mitteilung mit Name, Todesdatum, Nummer und Fragen', () => {
    const k = koerper(generateLetter('deathNotice', person, t, { angaben }));
    expect(k).toContain('Kim Muster');
    expect(k).toContain('10.09.2026');
    expect(k).toContain('P-99');
    expect(k).toMatch(/welche Unterlagen/);
    expect(k).toMatch(/Schlussabrechnung/);
  });
  it('Absender ist die angehörige Person in eigenem Namen', () => {
    const html = generateLetter('deathNotice', person, t, { angaben });
    expect(html).toMatch(/<div class="signature">Alex Muster<\/div>/);
  });
  // Verbotene Formulierungen: alles, was als Einmischung / Annahme gelesen werden kann.
  // 🛑 Unicode-Wortgrenzen: JS-\b kennt «ü» nicht als Buchstaben — /\bübernehme\b/ trifft
  // «Ich übernehme» NIE (Mutationsprobe 26.09.2026 hat genau das gezeigt).
  const wort = (w) => new RegExp('(?<!\\p{L})' + w + '(?!\\p{L})', 'iu');
  const VERBOTEN = [
    wort('ich (be)?zahle'), wort('überweise'), wort('übernehme'), wort('anerkenne'),
    wort('kündige'), /\bnehme .{0,40}\ban\b/i, wort('als (Erbin|Erbe|Erben)'),
    /auf mein Konto/i, /an mich (aus|zu überweisen)/i, /Zahlung(en)? .{0,20}(leisten|veranlassen)/i,
  ];
  it('Gegenprobe: die Wortgrenzen greifen auch bei Umlauten', () => {
    expect('Ich übernehme die Beträge.').toMatch(wort('übernehme'));
    expect('Ich zahle.').toMatch(wort('ich (be)?zahle'));
    expect('Unternehmensübernehmer').not.toMatch(wort('übernehme'));
  });
  it.each(['de', 'fr', 'it', 'en', 'rm'])('🛑 %s: Brief enthält den Vorbehalt und keine Annahme-Formulierung', (lang) => {
    const tl = createT(ALL, lang, 'sie');
    const k = koerper(generateLetter('deathNotice', person, tl, { angaben }));
    expect(k).toContain(tl('briefe.deathNotice.vorbehalt').replace(/&/g, '&amp;').replace(/'/g, '&#39;').slice(0, 20));
    if (lang === 'de') for (const re of VERBOTEN) expect(k, String(re)).not.toMatch(re);
  });
  it('🛑 UI-Hinweis nennt Einmischung, 3 Monate und die Artikel — Sie und Du', () => {
    for (const tl of [t, tDu]) {
      expect(tl('briefe.deathNotice.erbe.text')).toMatch(/ZGB Art\. 571 Abs\. 2/);
      expect(tl('briefe.deathNotice.erbe.text')).toMatch(/drei Monate.*ZGB Art\. 567/);
      expect(tl('briefe.deathNotice.erbe.miete')).toMatch(/OR Art\. 266i/);
    }
    expect(t('briefe.deathNotice.erbe.brief')).toMatch(/Ergänzen Sie/);
    expect(tDu('briefe.deathNotice.erbe.brief')).toMatch(/Ergänze ihn/);
  });
  it('Empfänger bleibt Platzhalter (die Stelle ist frei wählbar)', () => {
    expect(empfaenger(generateLetter('deathNotice', person, t, { angaben }))).toContain(t('briefe.recipientPlaceholder'));
  });
});

describe('Sie/Du — Hinweise folgen der Anrede, der Brief bleibt «Sie» an die Stelle', () => {
  it('Hinweise unterscheiden sich', () => {
    expect(t('briefe.workReference.hinweis')).toMatch(/können Sie/);
    expect(tDu('briefe.workReference.hinweis')).toMatch(/kannst du/);
    expect(t('briefe.debtObjection.frist.vorbei')).toMatch(/Wenden Sie/);
    expect(tDu('briefe.debtObjection.frist.vorbei')).toMatch(/Wende dich/);
  });
  it.each(NEU)('%s: Brieftext identisch bei Sie und Du', (key) => {
    const a = generateLetter(key, person, t, { angaben: { einschaetzung: 'x' } });
    const b = generateLetter(key, person, tDu, { angaben: { einschaetzung: 'x' } });
    expect(koerper(a)).toBe(koerper(b));
  });
});
