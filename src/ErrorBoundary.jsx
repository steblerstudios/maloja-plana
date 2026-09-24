import React from 'react';
import { version as APP_VERSION } from '../package.json';
import { text, weight, radius, space, fontFamily } from './config/tokens.js';
import { paletteAusSpeicher, DARK_PALETTE } from './config/constants.js';
import { I18nContext } from './i18n/index.js';
import { tMitRueckfall } from './utils/tRueckfall.js';
import { meldungOhneEingaben } from './utils/meldungOhneEingaben.js';

// ─── Error Boundary ────────────────────────────────────────
// Catches runtime errors in the component tree and shows a
// calm recovery UI instead of a white screen.
// Local-first: keine Telemetrie, kein automatischer Fehlerbericht. Gemeldet wird
// nur, was die Person selbst abschickt — der Knopf unten öffnet einen Mail-Entwurf,
// den sie vorher liest und ändern kann.

export class ErrorBoundary extends React.Component {
  // Dieser Schirm wird ohne Props gerendert (main.jsx: ErrorBoundary umschliesst
  // BetaGate). Bis 23.09.2026 hiess das: t war nie da, und jede Person sah den
  // englischen Rückfalltext, egal in welcher Sprache sie unterwegs war. Die
  // Sprache kommt deshalb aus dem Kontext, sonst (wenn der Provider selbst
  // gestorben ist) aus der schon geladenen Sprache — K64/K71.
  static contextType = I18nContext;

  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Local-only logging — no external services
    console.error('[Maloja Plana] Component error:', error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleHardReset = () => {
    window.location.reload();
  };

  // Melde-Entwurf: Betreff + abgetrennter Kontext-Block, gleiche Bauweise wie der
  // Feedback-Link in der Fusszeile (main.jsx). Drei unkritische Werte plus die
  // Fehlermeldung des Browsers — ohne sie ist eine Absturz-Meldung kaum
  // nachstellbar. Sie ist auf 200 Zeichen gekürzt, damit keine langen
  // Zwischenstände mitwandern, steht sichtbar im Entwurf und ist löschbar.
  // Gesendet wird nichts automatisch.
  // K119: ohne Zitate und Ziffernfolgen — manche Browser zitieren die Eingabe in der Meldung.
  meldeHref(tx) {
    const meldung = meldungOhneEingaben(this.state.error?.message);
    const body = '\n\n\n— — —\n' + tx('beta.feedbackContext', '') + '\n'
      + 'Version: ' + APP_VERSION + '\n'
      + 'Ansicht: Fehlerschirm\n'
      + 'Sprache: ' + (this.context?.lang || '—') + '\n'
      + 'Fehler: ' + (meldung || '—');
    return 'mailto:info@malojaplana.ch?subject='
      + encodeURIComponent('Maloja Plana Fehler')
      + '&body=' + encodeURIComponent(body);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    // Farben: das übergebene palette, sonst das Thema aus dem Speicher — dieselbe
    // Quelle wie die App. Bis 23.09.2026 standen hier dunkle Rückfallwerte, also
    // erschien der Absturz-Schirm im Hellmodus dunkel.
    const palette = this.props.palette || paletteAusSpeicher();
    // Erst das übergebene t, sonst der Kontext, sonst die geladene Sprache. Fehlt
    // ein Schlüssel, bleibt der englische Rückfalltext stehen — nie ein leerer Knopf.
    const tt = tMitRueckfall(this.props.t, this.context?.t, 'Fehlerschirm');
    const tx = (key, fallback) => tt(key) || fallback;
    // Rückfall aus DARK_PALETTE statt eigener Hex-Kopie (Gate 24.09.2026). Kein neues Risiko:
    // paletteAusSpeicher kommt schon aus demselben Modul — ist constants.js kaputt, fehlte der
    // Schirm auch vorher. Dunkel, wie der Default von paletteAusSpeicher und theme-init.js.
    const farbe = (k) => palette?.[k] || DARK_PALETTE[k];
    const bg = farbe('bg');
    const textColor = farbe('text');
    const surface = farbe('surface');
    const border = farbe('border');
    const sand = farbe('sand');
    const mid = farbe('mid');

    return React.createElement('div', {
      role: 'alert',
      style: {
        // Drei Dinge, die vorher `width:100vw; height:100vh; align-items:center` waren:
        //
        // 1. `height` → `minHeight`, dazu `overflowY:auto`. Mit fester Höhe hatte der
        //    Schirm keinen Scrollweg: Auf dem Handy QUER (667x375 gemessen) ist die Karte
        //    höher als der Schirm, und `align-items:center` schiebt ihren oberen Rand über
        //    die Kante hinaus — 8 bis 19 px, je nach Sprache und Lese-Modus. Nach oben
        //    scrollen war unmöglich (`window.scrollTo(0,-9999)` liess scrollY auf 0).
        //    Heute fällt nur Polsterung weg; bis zum Symbol sind es ~25 px. Wächst der
        //    Text — längere Übersetzung, eine Zeile mehr —, verschwinden Symbol, Titel
        //    und irgendwann der Melde-Weg **unerreichbar** nach oben. Genau auf diesem
        //    Schirm ist das am teuersten.
        // 2. Zentriert wird über `margin:auto` am Kind statt über `align-items:center`.
        //    Auto-Ränder werden nie negativ: passt die Karte, sitzt sie mittig; passt sie
        //    nicht, beginnt sie oben und bleibt vollständig erreichbar.
        // 3. `100vw` → `100%`: 100vw rechnet die Breite der Bildlaufleiste mit und erzeugt
        //    zusammen mit dem neuen senkrechten Scrollweg einen waagrechten dazu.
        width: '100%', minHeight: '100dvh', background: bg, color: textColor,
        fontFamily: fontFamily,
        display: 'flex', overflowY: 'auto',
        padding: '20px', boxSizing: 'border-box'
      }
    },
      React.createElement('div', {
        style: {
          maxWidth: '420px', width: '100%', padding: space.xl,
          margin: 'auto',
          background: surface, borderRadius: radius.md,
          border: '1px solid ' + border, textAlign: 'center'
        }
      },
        React.createElement('svg', { width: '36', height: '36', viewBox: '0 0 24 24', fill: 'none', style: { marginBottom: space.md }, 'aria-hidden': 'true' },
          React.createElement('polyline', { points: '3,19 8,9 11,14 15,7 20,19', fill: 'none', stroke: sand, strokeWidth: '1.5', strokeLinejoin: 'round', strokeLinecap: 'round' }),
          React.createElement('circle', { cx: '15', cy: '7', r: '1.7', fill: sand })
        ),
        React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, color: textColor, marginBottom: space.sm } },
          tx('error.title', 'Something went wrong')
        ),
        React.createElement('p', { style: { fontSize: text.sm, color: mid, marginBottom: space.lg, lineHeight: 1.5 } },
          tx('error.message', 'Your data is safe — it is stored locally on your device. Please try again.')
        ),

        React.createElement('div', { style: { display: 'flex', gap: space.sm, justifyContent: 'center' } },
          React.createElement('button', {
            type: 'button',
            onClick: this.handleReset,
            style: {
              // mind. 44 hoch wie der Melde-Link darunter (WCAG 2.2, 2.5.8: mind. 24).
              minHeight: '44px', padding: '10px 20px', background: sand, color: '#000',
              border: 'none', borderRadius: radius.sm, cursor: 'pointer',
              fontWeight: weight.semi, fontSize: text.sm
            }
          }, tx('error.tryAgain', 'Try again')),
          React.createElement('button', {
            type: 'button',
            onClick: this.handleHardReset,
            style: {
              minHeight: '44px', padding: '10px 20px', background: 'transparent', color: textColor,
              border: '1px solid ' + border, borderRadius: radius.sm,
              cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm
            }
          }, tx('error.reload', 'Reload page'))
        ),

        // Der Melde-Weg — genau hier, wo eine Meldung am meisten wert ist. Ein Link,
        // kein Knopf: er öffnet das Mailprogramm mit einem Entwurf, nichts geht von
        // selbst hinaus. Trefferfläche mind. 44 px (A11y), Farbe explizit gesetzt.
        React.createElement('p', { style: { marginTop: space.lg, marginBottom: 0 } },
          React.createElement('a', {
            href: this.meldeHref(tx),
            style: {
              display: 'inline-block', minHeight: '44px', lineHeight: '44px',
              padding: '0 8px', fontSize: text.sm, color: textColor,
              textDecoration: 'underline', textUnderlineOffset: '2px'
            }
          }, tx('error.report', 'Report a problem'))
        ),

        React.createElement('p', { style: { fontSize: text.xs, color: mid, marginTop: space.sm } },
          tx('error.privacy', 'No data was sent anywhere. Everything stays on your device.')
        )
      )
    );
  }
}

export default ErrorBoundary;
