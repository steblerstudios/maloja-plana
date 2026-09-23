import React from 'react';
import { version as APP_VERSION } from '../package.json';
import { text, weight, radius, space, fontFamily } from './config/tokens.js';
import { paletteAusSpeicher } from './config/constants.js';
import { I18nContext } from './i18n/index.js';
import { tMitRueckfall } from './utils/tRueckfall.js';

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
  meldeHref(tx) {
    const meldung = String(this.state.error?.message || '').slice(0, 200);
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
    const bg = palette?.bg || '#1a1a18';
    const textColor = palette?.text || '#e8e6e0';
    const surface = palette?.surface || '#2a2a28';
    const border = palette?.border || '#3a3a38';
    const sand = palette?.sand || '#c8a96e';

    return React.createElement('div', {
      role: 'alert',
      style: {
        width: '100vw', height: '100vh', background: bg, color: textColor,
        fontFamily: fontFamily,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', boxSizing: 'border-box'
      }
    },
      React.createElement('div', {
        style: {
          maxWidth: '420px', width: '100%', padding: space.xl,
          background: surface, borderRadius: radius.md,
          border: '1px solid ' + border, textAlign: 'center'
        }
      },
        React.createElement('svg', { width: '36', height: '36', viewBox: '0 0 24 24', fill: 'none', style: { marginBottom: space.md }, 'aria-hidden': 'true' },
          React.createElement('polyline', { points: '3,19 8,9 11,14 15,7 20,19', fill: 'none', stroke: sand, strokeWidth: '1.5', strokeLinejoin: 'round', strokeLinecap: 'round' }),
          React.createElement('circle', { cx: '15', cy: '7', r: '1.7', fill: '#C4A870' })
        ),
        React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, color: textColor, marginBottom: space.sm } },
          tx('error.title', 'Something went wrong')
        ),
        React.createElement('p', { style: { fontSize: text.sm, color: palette?.mid || '#888', marginBottom: space.lg, lineHeight: 1.5 } },
          tx('error.message', 'Your data is safe — it is stored locally on your device. Please try again.')
        ),

        React.createElement('div', { style: { display: 'flex', gap: space.sm, justifyContent: 'center' } },
          React.createElement('button', {
            onClick: this.handleReset,
            style: {
              padding: '10px 20px', background: sand, color: '#000',
              border: 'none', borderRadius: radius.sm, cursor: 'pointer',
              fontWeight: weight.semi, fontSize: text.sm
            }
          }, tx('error.tryAgain', 'Try again')),
          React.createElement('button', {
            onClick: this.handleHardReset,
            style: {
              padding: '10px 20px', background: 'transparent', color: textColor,
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

        React.createElement('p', { style: { fontSize: text.xs, color: palette?.mid || '#888', marginTop: space.sm } },
          tx('error.privacy', 'No data was sent anywhere. Everything stays on your device.')
        )
      )
    );
  }
}

export default ErrorBoundary;
