import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StipendienView } from '../StipendienView.jsx';
import { LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { GEPRUEFT } from '../../scripts/seiten-inhalt.mjs';

// ─────────────────────────────────────────────────────────────
// Gruppe D «Fachseiten ausserhalb der Kapitel» (Befund 11.11.2026,
// docs/design/gruppe-d-fachseiten.html). Prüft die erzeugten Seiten in public/
// und die Stipendien-Ansicht:
// L1  Sozialhilfe ohne Schweizer Pass: Folgen für die Bewilligung (AIG Art. 62 Abs. 1 Bst. e,
//     Art. 63 Abs. 1 Bst. c, Fassung 1.11.2026) auf /sozialhilfe/ und /was-steht-mir-zu/.
// L2  IPV sistiert für N/S (AsylG Art. 82a Abs. 7) und F (AIG Art. 86 Abs. 2) — nur bei Sozialhilfe.
// L3  Stipendien: «Anderer Status» führt zu «nicht eindeutig», nie zu «Sie erfüllen».
// L4  keine unbelegte «30 Tage»-Frist bei Stipendien.
// L5  Sozialhilfequote: Beschriftung und Quelle nennen dasselbe Jahr.
// A   Stand-Zeile oben auf den vier kurzen Erklärseiten.
// B   Bewegte Fassungen allein geöffnet mit Kopf und Fusszeile (Impressum).
// ─────────────────────────────────────────────────────────────

const lies = (pfad) => fs.readFileSync(path.resolve(process.cwd(), 'public', pfad, 'index.html'), 'utf8');
const nurText = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

describe('Gruppe D · Inhalt', () => {
  it('L1: Sozialhilfe-Seite nennt die Folgen für B, L und C mit Artikel', () => {
    const s = nurText(lies('sozialhilfe'));
    expect(s).toContain('Ohne Schweizer Pass kann der Bezug von Sozialhilfe Folgen für den Aufenthalt haben');
    expect(s).toContain('AIG Art. 62 Abs. 1 Bst. e, Art. 63 Abs. 1 Bst. c');
    expect(s).toContain('Hat Sozialhilfe Folgen für meine Aufenthaltsbewilligung?');
  });

  it('L1: «Was steht mir zu?» sagt nicht mehr «kostet nichts» und verweist auf die Bewilligung', () => {
    const s = nurText(lies('was-steht-mir-zu'));
    expect(s).not.toContain('kostet nichts');
    expect(s).toContain('Folgen für die Aufenthaltsbewilligung');
  });

  it('L2: Prämienverbilligung nennt das Ruhen bei Sozialhilfe für N/S und F, mit Bedingung', () => {
    const s = nurText(lies('praemienverbilligung'));
    expect(s).toMatch(/Ausweis N oder S ist der Anspruch sistiert, solange ganz oder teilweise Sozialhilfe bezogen wird \(AsylG Art\. 82a Abs\. 7\)/);
    expect(s).toContain('AIG Art. 86 Abs. 2');
  });

  it('L6: Rückerstattung und Verwandtenunterstützung (ZGB Art. 328) stehen auf der Sozialhilfe-Seite', () => {
    const s = nurText(lies('sozialhilfe'));
    expect(s).toContain('Muss ich Sozialhilfe zurückzahlen?');
    expect(s).toContain('ZGB Art. 328 Abs. 1');
  });

  it('L7: die Bundesvorgaben (KVG Art. 65 Abs. 1bis, 1ter, 3) stehen auf der Prämienverbilligungs-Seite', () => {
    const s = nurText(lies('praemienverbilligung'));
    expect(s).toContain('mindestens 80 Prozent');
    expect(s).toContain('Art. 65 Abs. 1ter KVG');
    expect(s).toContain('nicht vorschiessen');
  });

  it('L5: die Sozialhilfequote trägt auf beiden Seiten nur das Jahr der Quelle (2025)', () => {
    for (const seite of ['kantone-im-vergleich', 'kantonsatlas']) {
      const s = nurText(lies(seite));
      expect(s, seite).not.toMatch(/Sozialhilfe 2024|Sozialhilfequote[^.]{0,40}2024/);
    }
    expect(nurText(lies('kantone-im-vergleich'))).toContain('% der Bevölkerung; 2025');
  });

  it('Sprache: die Werbe- und Versprechenssätze sind weg', () => {
    const alle = ['was-steht-mir-zu', 'sozialhilfe', 'steuern', 'praemienverbilligung'].map((p) => nurText(lies(p))).join(' ');
    for (const satz of ['rechnet das für Ihre Situation durch', 'meistübersehene', 'das ist das System', 'Hier geht oft Geld verloren', 'Wie viel Sozialhilfe steht mir zu?', 'Trifft nicht zu:']) {
      expect(alle, satz).not.toContain(satz);
    }
  });

  it('Kleines: der SKOS-Satz steht nur, wo die SKOS verlinkt ist', () => {
    expect(nurText(lies('sozialhilfe'))).toContain('die SKOS etwa ist ein Fachverband');
    for (const p of ['steuern', 'praemienverbilligung', 'was-steht-mir-zu']) {
      expect(nurText(lies(p)), p).not.toContain('die SKOS etwa ist ein Fachverband');
    }
  });
});

describe('Gruppe D · Gestaltung', () => {
  it('A: jede kurze Erklärseite trägt das Prüfdatum oben, im Hinweis unter dem Vorspann', () => {
    for (const p of ['was-steht-mir-zu', 'sozialhilfe', 'steuern', 'praemienverbilligung']) {
      const html = lies(p);
      const hinweis = html.match(/<p class="hinweis">([\s\S]*?)<\/p>/);
      expect(hinweis, p).not.toBeNull();
      expect(hinweis[1], p).toContain(`Inhaltlich geprüft: ${GEPRUEFT}.`);
      expect(html.indexOf('class="hinweis"'), p).toBeLessThan(html.indexOf('<h2'));
    }
  });

  it('B: die bewegten Fassungen haben allein geöffnet Kopf, Brotkrume und Fusszeile mit Impressum', () => {
    for (const name of ['dorf', 'alter', 'kostenteil', 'praemie', 'kantone']) {
      const html = fs.readFileSync(path.resolve(process.cwd(), 'public/krankenkasse/bewegt', name, 'index.html'), 'utf8');
      expect(html, name).toContain('<a class="marke" href="/">');
      expect(html, name).toContain('<a href="/krankenkasse/">Krankenkasse erklärt</a>');
      expect(html, name).toMatch(/<footer>[\s\S]*href="\/rechtliches\/"/);
      // Eingebettet in die Hauptseite bleiben Kopf und Fuss aus (rahmen.js setzt .im-rahmen).
      expect(html, name).toContain('.im-rahmen header, .im-rahmen footer{ display:none }');
    }
  });

  it('D: Marke oben und Fragenliste haben eine Trefferfläche von mindestens 44 px', () => {
    const html = lies('krankenkasse');
    expect(html).toMatch(/\.marke\{[^}]*min-height:44px/);
    expect(html).toMatch(/nav\.inhalt a\{[^}]*min-height:44px/);
  });
});

describe('Gruppe D · Stipendien', () => {
  const t = createT({ de }, 'de', 'sie');
  const zeige = () => renderToStaticMarkup(React.createElement(StipendienView, { palette: LIGHT_PALETTE, t, data: { basis: { canton: 'ZH' } } }));

  it('L3: es gibt die Antwort «Anderer Status», und «Sie erfüllen» klingt nicht mehr nach Bescheid', () => {
    const html = zeige();
    expect(html).toContain(t('stip.checkStatusOther'));
    expect(t('stip.checkStatusOther')).toMatch(/Ausweis F/);
    expect(t('stip.resultEligible')).not.toMatch(/^Sie erfüllen/);
    expect(t('stip.resultEligible')).toMatch(/entscheidet die Stipendienstelle/);
    expect(t('stip.resultUnclear')).not.toMatch(/kostenlos/);
  });

  it('L4 und Kleines: keine «30 Tage», keine Anbieterpreise', () => {
    const html = zeige();
    expect(html).not.toMatch(/30 Tage/);
    expect(html).not.toMatch(/CHF 290|CHF 78/);
  });

  it('C: die Listen «Wer kann beantragen?» und «Was wird unterstützt?» erscheinen nicht doppelt', () => {
    const html = zeige();
    expect(html).not.toContain(t('stip.eligibilityTitle'));
    expect(html).not.toContain(t('stip.scopeTitle'));
    // Jede Status-Antwort steht genau einmal (nur als Wahl oben).
    const vorkommen = html.split(t('stip.who.foreigner5y')).length - 1;
    expect(vorkommen).toBe(1);
    // Der Ausschluss steht als Hinweis bei der Frage.
    expect(html).toContain(t('stip.notEligible'));
  });
});
