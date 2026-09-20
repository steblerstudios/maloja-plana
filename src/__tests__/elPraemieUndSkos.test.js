import { describe, it, expect } from 'vitest';
// Mit Absicht umbenannt: ein `import it from '../i18n/it.js'` ueberschreibt
// vitests `it` — die Testdatei laedt dann keinen einzigen Test («default.each
// is not a function»). Genau das ist beim ersten Lauf passiert.
import deTexte from '../i18n/de.js';
import frTexte from '../i18n/fr.js';
import itTexte from '../i18n/it.js';
import enTexte from '../i18n/en.js';
import rmTexte from '../i18n/rm.js';

// ─────────────────────────────────────────────────────────────
// Zwei Fachfehler, gefunden von swiss-precision-pruefer und rechts-pruefer am
// 20.09.2026 bei der Prüfung der neuen öffentlichen Erklärseiten — beide lagen
// aber nicht dort, sondern in der ausgelieferten App.
//
// ① «Wer EL bezieht, ist von den Prämien befreit» ist falsch.
//    ELG (SR 831.30) Art. 10 Abs. 3 lit. d, wörtlich von Fedlex geholt:
//      «der Betrag für die obligatorische Krankenpflegeversicherung; er
//       entspricht einem jährlichen Pauschalbetrag in der Höhe der kantonalen
//       beziehungsweise regionalen Durchschnittsprämie für die obligatorische
//       Krankenpflegeversicherung (inkl. Unfalldeckung), höchstens jedoch der
//       tatsächlichen Prämie»
//    Die Prämie ist also eine ANERKANNTE AUSGABE in der EL-Berechnung, gedeckelt
//    auf die kantonale Durchschnittsprämie. Wessen Prämie darüber liegt, trägt
//    die Differenz. Der alte Satz liess Nullkosten erwarten.
//
// ② «Die SKOS-Richtlinien bestimmen die Höhe der Sozialhilfe» ist zu stark.
//    Sie empfehlen; verbindlich sind sie erst, soweit ein Kanton sie in sein
//    eigenes Recht übernimmt. Die öffentliche Seite /sozialhilfe/ sagt es
//    richtig — die Glossartexte widersprachen ihr.
//
// Beide Aussagen standen in ALLEN fünf Sprachen. Dieser Wächter prüft alle
// fünf, damit eine Korrektur nicht nur auf Deutsch ankommt (i18n/CLAUDE.md).
// ─────────────────────────────────────────────────────────────

const SPRACHEN = { de: deTexte, fr: frTexte, it: itTexte, en: enTexte, rm: rmTexte };

const wert = (obj, pfad) => pfad.split('.').reduce((o, k) => o?.[k], obj);

// Manche Texte sind { sie, du } statt eines Strings — beide Fassungen prüfen.
const alleFassungen = (v) => (typeof v === 'string' ? [v] : Object.values(v || {}));

describe('EL und Krankenkassenprämie — keine Befreiung behaupten', () => {
  const PFAD = 'lebenszustaende.beeintraechtigung.berechtigungen.ipv.text';

  it.each(Object.keys(SPRACHEN))('%s: der Schlüssel existiert', (code) => {
    expect(wert(SPRACHEN[code], PFAD)).toBeTruthy();
  });

  // Das Muster trifft die BEHAUPTUNG, nicht das Wort. Erste Fassung dieses
  // Tests verbot «exonération» überhaupt — und schlug prompt auf dem eigenen
  // Korrekturtext an («Ce n'est pas une exonération»). Ein Verbot, das die
  // Verneinung mitfängt, misst die Buchstaben statt der Aussage.
  const BEHAUPTET_BEFREIUNG =
    /ist von den Prämien befreit|sind von den Prämien befreit|sont exonérés des primes|è esentato dai premi|are exempt from premiums|è exonerà da las premias/i;

  it.each(Object.keys(SPRACHEN))('%s: behauptet KEINE Befreiung', (code) => {
    for (const t of alleFassungen(wert(SPRACHEN[code], PFAD))) {
      expect(t, `Befreiung behauptet in ${code}`).not.toMatch(BEHAUPTET_BEFREIUNG);
    }
  });

  it.each(Object.keys(SPRACHEN))('%s: stellt ausdrücklich klar, dass es keine ist', (code) => {
    // Der Irrtum ist verbreitet genug, dass ihn die Seite aktiv ausräumen soll —
    // nicht nur vermeiden.
    const verneinung = /Eine Befreiung ist es nicht|pas une exonération|non è un esonero|not an exemption|betg ina exoneraziun/i;
    for (const t of alleFassungen(wert(SPRACHEN[code], PFAD))) {
      expect(t, `Klarstellung fehlt in ${code}`).toMatch(verneinung);
    }
  });

  it.each(Object.keys(SPRACHEN))('%s: nennt stattdessen die Pauschale', (code) => {
    const richtig = /pauschal|forfait|forfetar|forfettario|flat amount/i;
    for (const t of alleFassungen(wert(SPRACHEN[code], PFAD))) {
      expect(t, `Pauschale fehlt in ${code}`).toMatch(richtig);
    }
  });
});

describe('SKOS-Richtlinien — empfehlen, nicht bestimmen', () => {
  const PFADE = ['glossar.skos', 'orientation.skos'];

  for (const pfad of PFADE) {
    it.each(Object.keys(SPRACHEN))(`%s · ${pfad}: existiert`, (code) => {
      expect(wert(SPRACHEN[code], pfad)).toBeTruthy();
    });

    it.each(Object.keys(SPRACHEN))(`%s · ${pfad}: sagt NICHT «bestimmen/festlegen»`, (code) => {
      const verboten = /bestimmen|bestimmt|legt die Richtlinien fest|déterminent|détermine|\bfixe\b|fixescha|determinano|determineschan|\bdetermine\b|\bsets the guidelines\b/i;
      for (const t of alleFassungen(wert(SPRACHEN[code], pfad))) {
        expect(t, `zu starke Aussage in ${code}`).not.toMatch(verboten);
      }
    });

    it.each(Object.keys(SPRACHEN))(`%s · ${pfad}: sagt «empfehlen»`, (code) => {
      const richtig = /empfiehlt|empfehlen|recommande|recommandent|raccomanda|raccomandano|recommend|recumonda|recumondan/i;
      for (const t of alleFassungen(wert(SPRACHEN[code], pfad))) {
        expect(t, `«empfehlen» fehlt in ${code}`).toMatch(richtig);
      }
    });
  }
});

describe('der Wächter würde den alten Zustand bemerken', () => {
  // Gegenprobe auf den echten alten Wortlaut je Sprache — sonst misst der Test
  // nur sich selbst (vgl. «eine Kennzahl muss unterscheiden»).
  const alt = {
    de: 'Wer EL bezieht, ist von den Prämien befreit; bei tiefem Einkommen besteht sonst oft trotzdem Anspruch auf Hilfe.',
    fr: 'Les bénéficiaires de PC sont exonérés des primes ; avec un faible revenu, on a souvent droit à une aide malgré tout.',
    it: 'Chi riceve PC è esentato dai premi; con un reddito basso si ha comunque spesso diritto a un aiuto.',
    en: 'Those on supplementary benefits are exempt from premiums; others on a low income still often qualify for help.',
    rm: 'Tgi che survegn PC è exonerà da las premias; cun in bass retgav ha ins savens tuttina dretg sin in agid.',
  };
  const BEHAUPTET_BEFREIUNG =
    /ist von den Prämien befreit|sind von den Prämien befreit|sont exonérés des primes|è esentato dai premi|are exempt from premiums|è exonerà da las premias/i;

  it.each(Object.keys(alt))('%s: der alte Satz fällt durch', (code) => {
    expect(alt[code]).toMatch(BEHAUPTET_BEFREIUNG);
  });

  it('der alte SKOS-Satz fällt durch', () => {
    const verbotenSkos = /bestimmen|bestimmt|legt die Richtlinien fest|déterminent|\bfixe\b|fixescha|determinano|determineschan|\bsets the guidelines\b/i;
    expect('Die SKOS-Richtlinien bestimmen die Höhe der Sozialhilfe.').toMatch(verbotenSkos);
    expect('SKOS guidelines determine social assistance levels.').not.toMatch(/empfiehlt|recommend/i);
  });
});
