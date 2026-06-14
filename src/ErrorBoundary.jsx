import React from 'react';
import { text } from './config/tokens.js';

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
    const text = palette?.text || '#e8e6e0';
    const surface = palette?.surface || '#2a2a28';
    const border = palette?.border || '#3a3a38';
    const sand = palette?.sand || '#c8a96e';

    return React.createElement('div', {
      role: 'alert',
      style: {
        width: '100vw', height: '100vh', background: bg, color: text,
        fontFamily: 'DM Sans, sans-serif',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', boxSizing: 'border-box'
      }
    },
      React.createElement('div', {
        style: {
          maxWidth: '420px', width: '100%', padding: '32px',
          background: surface, borderRadius: '12px',
          border: '1px solid ' + border, textAlign: 'center'
        }
      },
        React.createElement('svg', { width: '36', height: '36', viewBox: '0 0 24 24', fill: 'none', stroke: sand, strokeWidth: '1.8', strokeLinecap: 'round', style: { marginBottom: '16px' } },
          React.createElement('path', { d: 'M 3 17 Q 7 9 12 12 Q 17 15 21 7' }),
          React.createElement('path', { d: 'M 3 20 Q 8 14 12 16 Q 16 18 21 13', opacity: '0.4' })
        ),
        React.createElement('h2', { style: { fontSize: '18px', fontWeight: '600', marginBottom: '8px' } },
          t ? t('error.title') : 'Something went wrong'
        ),
        React.createElement('p', { style: { fontSize: '13px', color: palette?.mid || '#888', marginBottom: '24px', lineHeight: 1.5 } },
          t ? t('error.message') : 'Your data is safe — it is stored locally on your device. Please try again.'
        ),

        React.createElement('div', { style: { display: 'flex', gap: '8px', justifyContent: 'center' } },
          React.createElement('button', {
            onClick: this.handleReset,
            style: {
              padding: '10px 20px', background: sand, color: '#000',
              border: 'none', borderRadius: '6px', cursor: 'pointer',
              fontWeight: '600', fontSize: '13px'
            }
          }, t ? t('error.tryAgain') : 'Try again'),
          React.createElement('button', {
            onClick: this.handleHardReset,
            style: {
              padding: '10px 20px', background: 'transparent', color: text,
              border: '1px solid ' + border, borderRadius: '6px',
              cursor: 'pointer', fontWeight: '600', fontSize: '13px'
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
