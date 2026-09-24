// Fehlerschirm · Melde-Weg und Sprache (23.09.2026)
//
// Zwei Befunde, beide hier festgehalten, damit sie nicht zurückkommen:
//
// 1. Der Fehlerschirm bot keinen Melde-Weg. Genau im Moment, in dem eine Meldung
//    am meisten wert ist, standen nur «Erneut versuchen» und «Seite neu laden» da
//    — und weil es bewusst keine Telemetrie gibt, war ein Absturz, über den
//    niemand schreibt, unsichtbar.
// 2. Der Schirm sprach immer Englisch. `ErrorBoundary` wird in main.jsx OHNE Props
//    gerendert, also war `t` nie da und jede Sprache sah den Rückfalltext.
//
// Der Schirm wird direkt instanziiert: `renderToString` ruft keine
// Fehlergrenze auf, ein werfendes Kind würde also durchschlagen statt gefangen.
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import ErrorBoundary from '../ErrorBoundary.jsx';
import { version as APP_VERSION } from '../../package.json';
// 🛑 Nicht `import it from '../i18n/it.js'` — das überschreibt vitests `it`,
// und dann lädt kein einziger Test mehr (Falle vom 20.09.2026).
import deTexte from '../i18n/de.js';
import enTexte from '../i18n/en.js';
import frTexte from '../i18n/fr.js';
import itTexte from '../i18n/it.js';
import rmTexte from '../i18n/rm.js';

const schirm = ({ props = {}, context = null, meldung = 'Kaputt', fehler = null } = {}) => {
  const eb = new ErrorBoundary(props);
  eb.state = { hasError: true, error: fehler || new Error(meldung) };
  eb.context = context;
  return renderToString(eb.render());
};

// href aus dem gerenderten HTML, Entitäten zurückgedreht.
const meldeAdresse = (html) => {
  const treffer = html.match(/href="(mailto:[^"]*)"/);
  return treffer ? treffer[1].replace(/&amp;/g, '&').replace(/&#x27;/g, "'") : null;
};

describe('Der Fehlerschirm bietet einen Melde-Weg', () => {
  it('nennt das Postfach aus BUGS.md', () => {
    const adresse = meldeAdresse(schirm());
    expect(adresse).toBeTruthy();
    expect(adresse).toContain('mailto:info@malojaplana.ch');
  });

  it('legt Version, Ansicht, Sprache und die Fehlerart in den Entwurf', () => {
    const adresse = meldeAdresse(schirm({ context: { t: () => '', lang: 'fr' }, fehler: new TypeError('Boom') }));
    const entwurf = decodeURIComponent(adresse.split('&body=')[1]);
    expect(entwurf).toContain('Version: ' + APP_VERSION);
    expect(entwurf).toContain('Ansicht: Fehlerschirm');
    expect(entwurf).toContain('Sprache: fr');
    expect(entwurf).toContain('Fehler: TypeError');
  });

  // K119 (24.09.2026): bis dahin ging `error.message` mit, auf 200 Zeichen
  // gekürzt. Ein echter Browser-Fehler zitiert die Eingabe — Kürzen schützt
  // davor nicht. Der Fehler hier ist echt erzeugt, nicht ausgedacht.
  it('trägt keine Eingabe aus der Fehlermeldung in den Entwurf', () => {
    let echt;
    try { JSON.parse('Alex Muster, Basel'); } catch (e) { echt = e; }
    // Vorbedingung: die Meldung zitiert die Eingabe wirklich — sonst prüfte der Test nichts.
    expect(echt.message).toContain('Alex Muster');
    const entwurf = decodeURIComponent(meldeAdresse(schirm({ fehler: echt })).split('&body=')[1]);
    expect(entwurf).toContain('Fehler: SyntaxError');
    expect(entwurf).not.toContain('Alex');
    expect(entwurf).not.toContain('Basel');
  });

  it('nimmt nur einen schlichten Fehlernamen — alles andere wird zu «—»', () => {
    for (const name of ['Alex Muster', 'Fehler: 8001 Zürich', '', 'x'.repeat(41), '1Error']) {
      const fehler = new Error('egal');
      fehler.name = name;
      const entwurf = decodeURIComponent(meldeAdresse(schirm({ fehler })).split('&body=')[1]);
      expect(entwurf, JSON.stringify(name)).toContain('Fehler: —');
      if (name) expect(entwurf, JSON.stringify(name)).not.toContain(name);
    }
  });

  it('schickt nichts von selbst — ein Link zum Mailprogramm, kein Formular', () => {
    const html = schirm();
    expect(html).not.toContain('<form');
    expect(html).not.toMatch(/fetch\(|XMLHttpRequest/);
  });
});

describe('Der Fehlerschirm spricht die Sprache der Person', () => {
  it('nimmt t aus dem I18n-Kontext, obwohl er ohne Props gerendert wird', () => {
    const texte = {
      'error.title': 'Etwas ist schiefgelaufen',
      'error.tryAgain': 'Erneut versuchen',
      'error.reload': 'Seite neu laden',
      'error.report': 'Problem melden',
    };
    const html = schirm({ context: { t: (k) => texte[k] || '', lang: 'de' } });
    expect(html).toContain('Etwas ist schiefgelaufen');
    expect(html).toContain('Problem melden');
    expect(html).not.toContain('Something went wrong');
  });

  it('bleibt beim englischen Rückfalltext, wenn keine Sprache geladen ist — nie ein leerer Knopf', () => {
    const html = schirm();
    expect(html).toContain('Something went wrong');
    expect(html).toContain('Report a problem');
  });

  it('hat den Melde-Text in allen fünf Sprachen (Parität)', () => {
    for (const [name, satz] of [['de', deTexte], ['en', enTexte], ['fr', frTexte], ['it', itTexte], ['rm', rmTexte]]) {
      const wert = satz.error.report;
      const text = typeof wert === 'string' ? wert : wert?.sie;
      expect(text, name + ': error.report fehlt').toBeTruthy();
    }
  });
});
