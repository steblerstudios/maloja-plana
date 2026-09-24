import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

// ─────────────────────────────────────────────────────────────
// Die Kontaktadresse im Impressum · Entscheid Stebler Studios 23.09.2026
//
// DER ENTSCHEID: Es steht KEINE Postanschrift im Impressum. Genannt sind
// Name, Ort und E-Mail. Grund: Stebler Studios hat kein Geschäftsdomizil, und
// die Wohnadresse gehört nicht in ein öffentliches Repo. Das hängt am
// Handelsregister-Entscheid (ein Eintrag ist öffentlich, OR Art. 936 Abs. 1;
// die Eintragungspflicht steht in OR Art. 931 — gelesen an Fedlex 24.09.2026),
// deshalb wird beides zusammen entschieden.
//
// Ob UWG Art. 3 Abs. 1 Bst. s Ziff. 1 hier überhaupt greift, ist Frage F0 in
// docs/legal/k48-fragen-juristin.md — hier NICHT zu entscheiden.
//
// WAS DIESER WÄCHTER HÄLT — drei Zusagen, nicht drei Formulierungen:
//
//   1. Kein Platzhalter geht je live. Am 23.09. stand hier kurzzeitig
//      «[Strasse Nr.], [PLZ]»; ein Platzhalter, den niemand bemerkt, wird
//      irgendwann ausgeliefert. Diese Zusage ist billig und dauerhaft.
//   2. Die E-Mail-Adresse steht überall. Sie ist das EINZIGE, was das Gesetz
//      an dieser Stelle ausdrücklich nennt («einschliesslich derjenigen der
//      elektronischen Post»). Fällt sie weg, fällt die Kontaktadresse weg.
//   3. Die öffentliche Seite behauptet UWG-Konformität nicht nackt. Wer den
//      Artikel nennt, muss auch sagen, was er verlangt und was offen ist —
//      sonst steht dort eine Vollständigkeit, die es nicht gibt. Genau das
//      hat eine Durchsicht von aussen am 23.09. bemängelt.
//
// 🛑 Dieselbe Stelle steht im Studio-Impressum
// (stebler-studios/website/impressum.html, 22.09.2026). Zwei Produkte, ein
// Entscheid — wer hier ändert, ändert dort mit.
//
// WENN EINE GESCHÄFTSADRESSE DA IST: an diesen Stellen einsetzen —
//   src/i18n/{de,en,fr,it,rm}.js  →  legal.privacy.responsible1, legal.imprint.operator2
//   scripts/seiten-inhalt.mjs + scripts/seiten/{en,fr,it,rm}.mjs → «Anbieterin»
// danach `node scripts/build-seiten.mjs`, public/ mitcommitten, und Zusage 3
// darf dann zur schlichten Konformitätsangabe zurückgebaut werden.
// ─────────────────────────────────────────────────────────────

const PLATZHALTER = ['[Strasse Nr.]', '[PLZ]', 'TODO', 'XXX'];
const MAIL = 'info@malojaplana.ch';
const SPRACHEN = { de, en, fr, it: it_, rm };
const SEITEN = ['', 'en/', 'fr/', 'it/', 'rm/'];

// Ein i18n-Wert ist entweder ein String oder { sie, du }.
const alsText = (wert) =>
  typeof wert === 'string' ? wert : [wert?.sie, wert?.du].filter(Boolean).join(' ');

const liesSeite = (praefix) =>
  fs.readFileSync(
    path.resolve(process.cwd(), 'public', `${praefix}rechtliches`, 'index.html'),
    'utf8',
  );

describe('Kontaktadresse im Impressum', () => {
  describe.each(Object.entries(SPRACHEN))('%s.js', (_sprache, pakete) => {
    it('trägt keinen Platzhalter', () => {
      const stellen = [
        pakete.legal.privacy.responsible1,
        pakete.legal.imprint.operator2,
      ].map(alsText);
      for (const text of stellen) {
        for (const p of PLATZHALTER) expect(text).not.toContain(p);
      }
    });

    it('nennt die E-Mail-Adresse — das Einzige, was das Gesetz hier ausdrücklich verlangt', () => {
      expect(alsText(pakete.legal.privacy.responsible2)).toContain(MAIL);
      expect(alsText(pakete.legal.imprint.contact1)).toContain(MAIL);
    });
  });

  it.each(SEITEN)('/%srechtliches/ trägt keinen Platzhalter und nennt die E-Mail', (praefix) => {
    const html = liesSeite(praefix);
    for (const p of PLATZHALTER) expect(html).not.toContain(p);
    expect(html).toContain(MAIL);
  });

  it.each(SEITEN)('/%srechtliches/ behauptet UWG-Konformität nicht nackt', (praefix) => {
    const html = liesSeite(praefix);
    // Wer den Artikel nennt, muss auch nennen, was er verlangt. Geprüft wird
    // der Beleg (der Fedlex-Link auf genau diesen Artikel) und das Wort
    // «elektronisch*» aus dem Gesetzeswortlaut — nicht ein deutscher Satz,
    // den vier Übersetzungen ohnehin nicht teilen können.
    const nenntArtikel = /\bUWG\b|\bLCD\b|\bLCSl\b|\bLCSL\b/.test(html);
    expect(nenntArtikel, 'Die Seite nennt den Artikel gar nicht mehr').toBe(true);
    expect(html, 'Artikel genannt, aber ohne Beleg auf Fedlex')
      .toContain('fedlex.admin.ch/eli/cc/1988/223_223_223');
    expect(html, 'Artikel genannt, aber ohne den Wortlaut zur elektronischen Post')
      .toMatch(/elektronisch|électronique|elettronic|electronic|electronica/i);
  });

  // Entscheid Stebler Studios 24.09.2026: «nur Tatsachen». Die Seite legt die Bestimmung
  // nicht aus — sie sagt, was angegeben ist, und dass die Postanschrift-Frage abgeklärt wird.
  const AUSLEGUNG = [
    'nicht in jedem Fall', 'n’impose pas dans tous les cas', 'non prescrive in ogni caso',
    'does not require a postal address in every case', 'na prescriva betg en mintga cas',
  ];
  const ABKLAERUNG = { '': 'wird abgeklärt', 'fr/': 'en cours d’examen', 'it/': 'in fase di chiarimento', 'en/': 'is being clarified', 'rm/': 'vegn sclerì' };
  it.each(SEITEN)('/%srechtliches/ legt die Bestimmung nicht aus, sagt aber, dass abgeklärt wird', (praefix) => {
    const html = liesSeite(praefix);
    for (const satz of AUSLEGUNG) expect(html).not.toContain(satz);
    expect(html).toContain(ABKLAERUNG[praefix]);
  });

  // Gegenprobe: die Platzhalter-Regel darf nicht einfach überall anschlagen.
  it('ein fertiger Adresstext liefe durch', () => {
    const fertig = 'Stebler Studios — Musterweg 1, 4051 Basel, Schweiz';
    for (const p of PLATZHALTER) expect(fertig).not.toContain(p);
  });

  // Gegenprobe: die UWG-Regel muss für eine nackte Behauptung ROT werden.
  it('eine nackte Konformitätsbehauptung würde auffallen', () => {
    const nackt = '<p>Angaben gemäss Art. 3 Abs. 1 lit. s UWG.</p>';
    expect(/\bUWG\b/.test(nackt)).toBe(true);
    expect(nackt).not.toContain('fedlex.admin.ch/eli/cc/1988/223_223_223');
  });
});
