import React from 'react';
import { PageTitle } from './components/Heading.jsx';
import { ANSPRUCH_GRUPPEN } from './data/anspruchLandkarte.js';
import { text, weight, leading, space, radius, duration, ease } from './config/tokens.js';

// Anspruchs-Landkarte (#4.4.1): ruhiger Überblick über alle möglichen
// Berechtigungen, gruppiert nach Auslöser. Erweiterung der Dashboard-Sektion
// „Was steht mir zu?", keine vierte Tür — jeder Punkt öffnet sein bestehendes
// Zuhause. Nur POSITIVE Orientierung, kein Verdikt (Würde). Bewusst KEIN
// GlossarText auf den Labels — die Karte ist selbst ein Button/Link, und ein
// verschachtelter Glossar-Button wäre ungültiges HTML; die Sub-Zeile erklärt.
export const AnspruchLandkarte = ({ palette, t, onNavigate }) => {
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
      }, titel + (isExternal ? ' ↗' : ' →')),
      React.createElement('div', {
        key: 's',
        style: { fontSize: text.xs, color: palette.mid, marginTop: '2px', lineHeight: leading.relaxed }
      }, sub),
    ];

    return isExternal
      ? React.createElement('a', { key: item.key, href: item.url, target: '_blank', rel: 'noopener noreferrer', style: cardStyle, ...hover }, inner)
      : React.createElement('button', {
          key: item.key, type: 'button',
          onClick: () => onNavigate(item.view, item.chapterIndex, item.extra),
          style: cardStyle, ...hover
        }, inner);
  };

  return React.createElement('div', { style: { maxWidth: '640px' } },
    React.createElement(PageTitle, { palette, style: { margin: '0 0 ' + space.xs + 'px 0' } }, t('anspruch.pageTitle')),
    React.createElement('p', {
      style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.lg + 'px 0', lineHeight: leading.relaxed }
    }, t('anspruch.intro')),

    ANSPRUCH_GRUPPEN.map((gruppe) =>
      React.createElement('div', { key: gruppe.key, style: { marginBottom: space.xl + 'px' } },
        React.createElement('div', {
          style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.sageDeep || palette.text, letterSpacing: '0.3px', marginBottom: '2px' }
        }, t('anspruch.gruppen.' + gruppe.key + '.label')),
        React.createElement('p', {
          style: { fontSize: text.xs, color: palette.soft, margin: '0 0 ' + space.sm + 'px 0', lineHeight: leading.relaxed }
        }, t('anspruch.gruppen.' + gruppe.key + '.desc')),
        gruppe.items.map((item) => card(item))
      )
    ),

    React.createElement('p', {
      style: { fontSize: text.xs, color: palette.soft, marginTop: space.md + 'px', fontStyle: 'italic', lineHeight: leading.relaxed }
    }, t('anspruch.footNote'))
  );
};

export default AnspruchLandkarte;
