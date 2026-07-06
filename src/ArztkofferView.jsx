import React from 'react';
import FruchtSilhouette from './FruchtSilhouette.jsx';
import { getBereich } from './data/lebensbereiche.js';
import { text, weight, leading, space, radius, shadow, ease, duration } from './config/tokens.js';

// ─── Arztkoffer — das Zuhause für Gesundheit ────────────────────────────────
//
// Gesundheit hatte bisher kein eigenes Kapitel; der Arztkoffer sammelt die
// verstreuten Gesundheits-Werkzeuge als „Instrumente" (Fächer) an einem Ort.
// Identität = Hagebutte + orange-rot (Ast „gesundheit" aus lebensbereiche.js).
// Schutzrecht: bewusst KEIN Schweizer Kreuz.
//
// Ehrlichkeit: Fächer ohne fertiges Werkzeug werden als ruhiges „in
// Vorbereitung" gezeigt (nicht klickbar) — nichts wird vorgetäuscht.

// Die sieben Instrumente des Koffers. `view` gesetzt = fertiges Werkzeug.
const FAECHER = [
  { key: 'kvg',          view: 'kvg' },
  { key: 'kkbeleg',      view: 'kk' },
  { key: 'notfall',      view: 'notfalleinstieg' },
  { key: 'thermometer',  view: null },
  { key: 'blister',      view: null },
  { key: 'karteikarten', view: null },
  { key: 'impfausweis',  view: null },
];

// Ruhige Nebenwege zu bestehenden Abläufen — nichts bleibt verwaist.
const WEGE = [
  { key: 'wechsel', view: 'kvgwechsel' },
  { key: 'zusatz',  view: 'zusatzwechsel' },
  { key: 'unfall',  view: 'unfallkrankheit' },
];

export const ArztkofferView = ({ palette, t, onNavigate, isDarkMode }) => {
  const bereich = getBereich('gesundheit');
  const accent = bereich ? (isDarkMode ? bereich.dark : bereich.light) : palette.rose;

  const ready = FAECHER.filter((f) => f.view);
  const kommend = FAECHER.filter((f) => !f.view);

  const renderFach = (f) => {
    const isReady = Boolean(f.view);
    return React.createElement(isReady ? 'button' : 'div', {
      key: f.key,
      onClick: isReady ? () => onNavigate(f.view) : undefined,
      'aria-label': isReady ? t('arztkoffer.faecher.' + f.key + '.title') : undefined,
      style: {
        display: 'flex', alignItems: 'flex-start', gap: space.sm + 'px',
        textAlign: 'left', width: '100%', fontFamily: 'inherit',
        padding: space.md + 'px',
        background: isReady ? palette.surface : palette.up,
        border: '1px solid ' + (isReady ? accent + '33' : palette.border + '77'),
        borderLeft: '3px solid ' + (isReady ? accent : palette.border),
        borderRadius: radius.md,
        cursor: isReady ? 'pointer' : 'default',
        opacity: isReady ? 1 : 0.72,
        transition: `background ${duration.fast}ms ${ease}`,
      },
      onMouseEnter: isReady ? (e) => { e.currentTarget.style.background = palette.up; } : undefined,
      onMouseLeave: isReady ? (e) => { e.currentTarget.style.background = palette.surface; } : undefined,
    },
      React.createElement('span', {
        style: { color: accent, flexShrink: 0, marginTop: '1px', opacity: isReady ? 1 : 0.6 },
      }, React.createElement(FruchtSilhouette, { name: 'hagebutte', size: 18 })),
      React.createElement('span', { style: { flex: 1, minWidth: 0 } },
        React.createElement('span', {
          style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', flexWrap: 'wrap' },
        },
          React.createElement('span', {
            style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text },
          }, t('arztkoffer.faecher.' + f.key + '.title')),
          !isReady && React.createElement('span', {
            style: {
              fontSize: '10px', color: palette.mid, fontWeight: weight.medium,
              border: '1px solid ' + palette.border, borderRadius: radius.sm,
              padding: '1px 6px', textTransform: 'uppercase', letterSpacing: '0.3px',
            },
          }, t('arztkoffer.inVorbereitung')),
        ),
        React.createElement('span', {
          style: { display: 'block', fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, marginTop: '3px' },
        }, t('arztkoffer.faecher.' + f.key + '.desc')),
      ),
      isReady && React.createElement('span', {
        style: { color: accent, fontSize: text.body, flexShrink: 0, alignSelf: 'center' },
      }, '→'),
    );
  };

  return React.createElement('div', { style: { maxWidth: '720px', margin: '0 auto' } },

    // Kopf — Hagebutte-Identität
    React.createElement('div', {
      style: { textAlign: 'center', marginBottom: space.xl + 'px', paddingTop: space.md + 'px' },
    },
      React.createElement('div', {
        style: { display: 'inline-flex', color: accent, marginBottom: space.sm + 'px' },
      }, React.createElement(FruchtSilhouette, { name: 'hagebutte', size: 40, title: t('arztkoffer.title') })),
      React.createElement('h2', {
        style: { fontSize: text['2xl'], fontWeight: weight.bold, margin: '0 0 8px 0', letterSpacing: '-0.3px' },
      }, t('arztkoffer.title')),
      React.createElement('p', {
        style: { fontSize: text.body, color: palette.mid, margin: 0, lineHeight: leading.relaxed, maxWidth: '460px', marginLeft: 'auto', marginRight: 'auto' },
      }, t('arztkoffer.subtitle')),
    ),

    // Nutzbare Fächer zuerst
    React.createElement('div', {
      style: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: space.lg + 'px' },
    }, ready.map(renderFach)),

    // Fächer in Vorbereitung
    kommend.length > 0 && React.createElement('div', { style: { marginBottom: space.lg + 'px' } },
      React.createElement('div', {
        style: {
          fontSize: text.xs, fontWeight: weight.semi, color: palette.mid,
          textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 ' + space.sm + 'px 2px',
        },
      }, t('arztkoffer.inVorbereitungHint')),
      React.createElement('div', {
        style: { display: 'flex', flexDirection: 'column', gap: '10px' },
      }, kommend.map(renderFach)),
    ),

    // Weitere Wege — bestehende Abläufe, nichts verwaist
    React.createElement('div', {
      style: { paddingTop: space.md + 'px', borderTop: '1px solid ' + palette.border },
    },
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, marginBottom: space.sm + 'px' },
      }, t('arztkoffer.weitereWege')),
      React.createElement('div', {
        style: { display: 'flex', flexWrap: 'wrap', gap: space.sm + 'px' },
      },
        WEGE.map((w) => React.createElement('button', {
          key: w.key,
          onClick: () => onNavigate(w.view),
          style: {
            background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm,
            cursor: 'pointer', padding: '6px 12px', fontSize: text.sm, color: palette.text, fontFamily: 'inherit',
          },
        }, '→ ' + t('arztkoffer.wege.' + w.key))),
      ),
    ),

    React.createElement('button', {
      onClick: () => onNavigate('dashboard'),
      style: {
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: text.sm, color: palette.mid, fontFamily: 'inherit',
        padding: space.sm + 'px 0', marginTop: space.md + 'px',
      },
    }, '← ' + t('arztkoffer.back')),
  );
};

export default ArztkofferView;
