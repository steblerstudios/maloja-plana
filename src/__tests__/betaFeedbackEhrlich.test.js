// Beta-Feedback · der Knopf sagt, was er tut (26.10.2026)
//
// Befund vom 26.10.: Der Knopf hiess «Feedback senden», schickte aber nichts. Die drei
// Antworten landeten nur im Gerätespeicher (`or5_beta_feedback_data`), wo sie niemand
// liest. Der Name versprach mehr, als der Knopf tat.
//
// Entscheid Sophie, 26.10.2026: Mail-Entwurf, ehrlich bis zum Ende.
// - Knopf «Als E-Mail vorbereiten», darunter: gesendet wird erst mit dem eigenen Klick.
// - Vor dem Klick steht der Entwurfstext sichtbar da, genau das, was rausgehen würde.
// - Ausweg «Text kopieren» für alle ohne Mailprogramm.
// - Der Dank sagt nicht «erhalten», sondern «kommt an, sobald Sie ihn senden».
// - Auf dem Gerät bleibt nur der Merker «erledigt», die Antworten nicht mehr.
//
// Die Zusage, die hier festgehalten wird: nichts verlässt das Gerät ohne den Klick der
// Person im eigenen Mailprogramm. Kein Netzaufruf, kein Formular-Versand.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createT } from '../i18n/index.js';
import { betaFeedbackText, betaFeedbackHref } from '../utils/betaFeedbackMail.js';
// 🛑 Nicht `import it from '../i18n/it.js'` — das überschreibt vitests `it`.
import deTexte from '../i18n/de.js';
import enTexte from '../i18n/en.js';
import frTexte from '../i18n/fr.js';
import itTexte from '../i18n/it.js';
import rmTexte from '../i18n/rm.js';

const SPRACHEN = { de: deTexte, en: enTexte, fr: frTexte, it: itTexte, rm: rmTexte };
const ALTE_KNOEPFE = ['Feedback senden', 'Send feedback', 'Envoyer le feedback', 'Invia feedback', 'Trametter il feedback'];
const NEUE_SCHLUESSEL = ['submit', 'submitHint', 'previewTitle', 'to', 'copy', 'copied', 'copyFailed', 'noMailApp', 'reopen', 'thanks', 'thanksDetail', 'thanksLater'];

const dashboard = fs.readFileSync(path.resolve(__dirname, '..', 'Dashboard.jsx'), 'utf8');
const komponente = dashboard.slice(dashboard.indexOf('const BetaFeedback'), dashboard.indexOf('// Merged status surface'));

describe('Der Knopf verspricht kein Senden mehr', () => {
  for (const [lang, texte] of Object.entries(SPRACHEN)) {
    for (const anrede of ['sie', 'du']) {
      const t = createT({ [lang]: texte }, lang, anrede);
      it(`${lang}/${anrede}: neuer Knopftext, Hinweis aufs eigene Senden, alle Schlüssel da`, () => {
        expect(ALTE_KNOEPFE).not.toContain(t('beta.feedback.submit'));
        expect(t('beta.feedback.submitHint')).toContain('info@malojaplana.ch');
        for (const k of NEUE_SCHLUESSEL) {
          expect(t('beta.feedback.' + k), k).not.toBe('beta.feedback.' + k);
          expect(t('beta.feedback.' + k), k).toBeTruthy();
        }
      });
    }
  }

  it('der Untertitel behauptet nicht mehr «alles bleibt auf dem Gerät»', () => {
    const t = createT({ de: deTexte }, 'de', 'sie');
    expect(t('beta.feedback.subtitle')).not.toMatch(/Alles bleibt auf Ihrem Gerät/);
    expect(t('beta.feedback.thanks') + t('beta.feedback.thanksDetail')).toMatch(/senden/);
  });
});

describe('Der Entwurf enthält die Antworten, lesbar in der Sprache der Person', () => {
  const t = createT({ de: deTexte }, 'de', 'sie');

  it('nennt Fragen und gewählte Antworten, dazu den Kontext-Block', () => {
    const text = betaFeedbackText({ q1: 'mostly', q2: 'high', q3: 'Die Grafik fehlt.', t, version: '9.9.9', lang: 'de' });
    expect(text).toContain(t('beta.feedback.q1'));
    expect(text).toContain(t('beta.feedback.scaleMostly'));
    expect(text).toContain(t('beta.feedback.trustHigh'));
    expect(text).toContain('Die Grafik fehlt.');
    expect(text).toContain('Version: 9.9.9');
    expect(text).toContain('Ansicht: Beta-Feedback');
    expect(text).toContain('Sprache: de');
  });

  it('lässt unbeantwortete Fragen weg', () => {
    const text = betaFeedbackText({ q1: '', q2: 'low', q3: '', t, version: '1', lang: 'de' });
    expect(text).not.toContain(t('beta.feedback.q1'));
    expect(text).not.toContain(t('beta.feedback.q3'));
    expect(text).toContain(t('beta.feedback.trustLow'));
  });

  it('wird ein mailto-Entwurf an das eine Postfach, sauber kodiert', () => {
    const text = betaFeedbackText({ q1: 'yes', q2: '', q3: 'a & b?', t, version: '1', lang: 'de' });
    const href = betaFeedbackHref(text);
    expect(href.startsWith('mailto:info@malojaplana.ch?subject=')).toBe(true);
    expect(href).toContain('&body=' + encodeURIComponent(text));
    expect(decodeURIComponent(href.split('&body=')[1])).toBe(text);
  });
});

describe('Nichts verlässt das Gerät ohne den eigenen Klick', () => {
  it('die Komponente nutzt den Entwurf und kopiert über den bestehenden Helfer', () => {
    expect(komponente).toContain('betaFeedbackHref(');
    expect(komponente).toContain('inZwischenablage(');
    expect(komponente).toContain("t('beta.feedback.previewTitle')");
  });

  it('kein Netzaufruf, kein Formular', () => {
    expect(komponente).not.toMatch(/fetch\(|XMLHttpRequest|navigator\.sendBeacon|createElement\('form'/);
  });

  it('die Antworten werden nicht mehr im Gerätespeicher abgelegt', () => {
    expect(komponente).not.toContain("storageKey + '_data'");
    expect(komponente).not.toContain('JSON.stringify');
  });
});
