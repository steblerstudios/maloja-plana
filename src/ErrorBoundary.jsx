import React from 'react';
import { text, weight, radius , leading , space, fontFamily } from './config/tokens.js';

// ─── Error Boundary ────────────────────────────────────────
// Catches runtime errors in the component tree and shows a
// calm recovery UI instead of a white screen.
// Local-first: no error reporting, no telemetry.

export class ErrorBoundary extends React.Component {
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

  render() {
    if (!this.state.hasError) return this.props.children;

    const { palette, t } = this.props;
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
          React.createElement('polyline', { points: '3,19 8,9 11,14 15,7 20,19', fill: 'none', stroke: sand, strokeWidth: '2.2', strokeLinejoin: 'round', strokeLinecap: 'round' }),
          React.createElement('circle', { cx: '15', cy: '7', r: '1.7', fill: '#C4A870' })
        ),
        React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.sm } },
          t ? t('error.title') : 'Something went wrong'
        ),
        React.createElement('p', { style: { fontSize: text.sm, color: palette?.mid || '#888', marginBottom: space.lg, lineHeight: 1.5 } },
          t ? t('error.message') : 'Your data is safe — it is stored locally on your device. Please try again.'
        ),

        React.createElement('div', { style: { display: 'flex', gap: space.sm, justifyContent: 'center' } },
          React.createElement('button', {
            onClick: this.handleReset,
            style: {
              padding: '10px 20px', background: sand, color: '#000',
              border: 'none', borderRadius: radius.sm, cursor: 'pointer',
              fontWeight: weight.semi, fontSize: text.sm
            }
          }, t ? t('error.tryAgain') : 'Try again'),
          React.createElement('button', {
            onClick: this.handleHardReset,
            style: {
              padding: '10px 20px', background: 'transparent', color: textColor,
              border: '1px solid ' + border, borderRadius: radius.sm,
              cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm
            }
          }, t ? t('error.reload') : 'Reload page')
        ),

        React.createElement('p', { style: { fontSize: text.xs, color: palette?.mid || '#888', marginTop: '20px' } },
          t ? t('error.privacy') : 'No data was sent anywhere. Everything stays on your device.'
        )
      )
    );
  }
}

export default ErrorBoundary;
