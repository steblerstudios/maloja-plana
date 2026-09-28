import React from 'react';
import { ExternerLink } from './components/ExternerLink.jsx';
import { ANSPRUCH_GRUPPEN } from './data/anspruchLandkarte.js';
import { text, weight, leading, space, radius, duration, ease } from './config/tokens.js';

// Anspruchs-Landkarte (#4.4.1): ruhiger Überblick über alle möglichen
// Berechtigungen, gruppiert nach Auslöser. Seit 27.09.2026 keine eigene Seite mehr,
// sondern der untere Teil des Leistungs-Kompasses (Schnellcheck mit mitLandkarte):
// oben die eigenen Zahlen, darunter was es sonst gibt. Jeder Punkt öffnet sein bestehendes
// Zuhause. Nur POSITIVE Orientierung, kein Verdikt (Würde). Bewusst KEIN
// GlossarText auf den Labels — die Karte ist selbst ein Button/Link, und ein
// verschachtelter Glossar-Button wäre ungültiges HTML; die Sub-Zeile erklärt.
// `ohne`: Schlüssel, die der Schnellcheck darüber schon mit Zahlen zeigt — hier nicht doppelt.
export const LandkarteGruppen = ({ palette, t, onNavigate, ohne = [] }) => {
  const card = (item) => {
    const base = 'anspruch.items.' + item.key;
    const titel = t(base + '.label');
    const sub = t(base + '.sub');
    const isExternal = !!item.url;

    const cardStyle = {
      display: 'block', width: '100%', textAlign: 'left', boxSizing: 'border-box',
      padding: '12px 14px', marginBottom: space.xs + 'px',
      background: palette.surface, color: palette.text, textDecoration: 'none',
      border: '1px solid ' + palette.border + '44', borderRadius: radius.sm,
      cursor: 'pointer', fontFamily: 'inherit',
      transition: `border-color ${duration.normal}ms ${ease}`,
    };
    const hover = {
      onMouseEnter: (e) => { e.currentTarget.style.borderColor = palette.sage + '55'; },
      onMouseLeave: (e) => { e.currentTarget.style.borderColor = palette.border + '44'; },
    };
    const inner = [
      React.createElement('div', {
        key: 't',
        style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text }
      }, titel),
      React.createElement('div', {
        key: 's',
        style: { fontSize: text.xs, color: palette.mid, marginTop: '2px', lineHeight: leading.relaxed }
      }, sub),
    ];

    return isExternal
      ? React.createElement(ExternerLink, { key: item.key, t, href: item.url, style: cardStyle, ...hover }, inner)
      : React.createElement('button', {
          key: item.key, type: 'button',
          onClick: () => onNavigate(item.view, item.chapterIndex, item.extra),
          style: cardStyle, ...hover
        }, inner);
  };

  // Leere Gruppen fallen weg — z. B. wenn oben schon alles Einkommensabhängige steht.
  const gruppen = ANSPRUCH_GRUPPEN
    .map((g) => ({ ...g, items: g.items.filter((i) => !ohne.includes(i.key)) }))
    .filter((g) => g.items.length > 0);

  return React.createElement(React.Fragment, null,
    gruppen.map((gruppe) =>
      React.createElement('div', { key: gruppe.key, style: { marginBottom: space.xl + 'px' } },
        React.createElement('h3', {
          style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.sageDeep || palette.text, letterSpacing: '0.3px', margin: '0 0 2px 0' }
        }, t('anspruch.gruppen.' + gruppe.key + '.label')),
        React.createElement('p', {
          style: { fontSize: text.xs, color: palette.soft, margin: '0 0 ' + space.sm + 'px 0', lineHeight: leading.relaxed }
        }, t('anspruch.gruppen.' + gruppe.key + '.desc')),
        gruppe.items.map((item) => card(item))
      )
    ),

    // Wer lieber geführt Schritt für Schritt durchgeht (Zahlen → Lebenslage).
    React.createElement('button', {
      type: 'button',
      onClick: () => onNavigate('anspruchcheck'),
      style: {
        display: 'block', minHeight: '44px', background: 'none', border: 'none',
        padding: 0, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        fontSize: text.sm, fontWeight: weight.medium, color: palette.sageDeep || palette.sage,
      },
    }, t('anspruch.gefuehrtLink')),

    React.createElement('p', {
      style: { fontSize: text.xs, color: palette.soft, marginTop: space.sm + 'px', fontStyle: 'italic', lineHeight: leading.relaxed }
    }, t('anspruch.footNote'))
  );
};
