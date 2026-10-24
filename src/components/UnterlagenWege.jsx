import React from 'react';
import { PanelTitle } from './Heading.jsx';
import { Icon } from '../IconSystem.jsx';
import { text, weight, radius, leading, space, ease, duration } from '../config/tokens.js';

// «Meine Unterlagen» — früher eine eigene Seite (MeineUnterlagen.jsx), die vor allem auf die
// Ablage zeigte. Seit 24.10.2026 ein Abschnitt unten in der Dokumentenablage
// (docs/entscheide/seiten-buendeln.md, Gruppe H): die Dossiers, die Briefvorlagen und die
// Datensicherung. #/unterlagen leitet hierher (UMLEITUNGEN), Sprungmarke UNTERLAGEN_ANKER.
// Texte unverändert (unterlagen.*); die Karte «Ablage» entfällt — man steht schon darin.

export const UNTERLAGEN_ANKER = 'mp-unterlagen';

// Eine Zeile je Dossier — ein echter Knopf (Enter und Leertaste ohne eigenes Tastatur-Handling).
const Weg = ({ palette, title, description, status, icon, onClick }) =>
  React.createElement('button', {
    type: 'button', onClick,
    style: {
      display: 'flex', alignItems: 'flex-start', gap: '12px', width: '100%', textAlign: 'left',
      padding: '16px', background: palette.up, borderRadius: radius.sm, fontFamily: 'inherit',
      border: '1px solid ' + palette.border, marginBottom: '10px', cursor: 'pointer',
      transition: `border-color ${duration.fast}ms ${ease}`,
    },
  },
    React.createElement('span', { 'aria-hidden': 'true', style: { flexShrink: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: palette.sand } },
      React.createElement(Icon, { name: icon, size: 22 })),
    React.createElement('span', { style: { flex: 1, display: 'block' } },
      React.createElement('span', { style: { display: 'block', fontSize: text.body, fontWeight: weight.semi, color: palette.text, marginBottom: space.xs } }, title),
      React.createElement('span', { style: { display: 'block', fontSize: text.sm, color: palette.mid, lineHeight: leading.normal } }, description),
      status && React.createElement('span', { style: { display: 'block', fontSize: text.sm, color: palette.soft, marginTop: space.xs } }, status)
    )
  );

export const UnterlagenWege = ({ palette, t, onNavigate }) => {
  if (!onNavigate) return null;
  return React.createElement('section', {
    id: UNTERLAGEN_ANKER, 'aria-labelledby': 'mp-unterlagen-titel',
    style: { marginTop: space.xl + 'px', paddingTop: space.md + 'px', borderTop: '1px solid ' + palette.border, scrollMarginTop: 'var(--mp-sprungabstand)' },
  },
    React.createElement(PanelTitle, { palette, id: 'mp-unterlagen-titel', style: { margin: '0 0 4px 0' } }, t('unterlagen.title')),
    React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px 0', lineHeight: leading.normal } }, t('unterlagen.subtitle')),

    React.createElement(Weg, { palette, icon: 'home', onClick: () => onNavigate('lebensmappe'),
      title: t('unterlagen.dossier.lebensmappe.title'), description: t('unterlagen.dossier.lebensmappe.description'), status: t('lebensmappe.openDossier') }),
    React.createElement(Weg, { palette, icon: 'emergency', onClick: () => onNavigate('notfalldossier'),
      title: t('unterlagen.dossier.notfall.title'), description: t('unterlagen.dossier.notfall.description'), status: t('notfallDossier.openDossier') }),
    React.createElement(Weg, { palette, icon: 'legal', onClick: () => onNavigate('behoerdendossier'),
      title: t('unterlagen.dossier.behoerden.title'), description: t('unterlagen.dossier.behoerden.description'), status: t('behoerdenDossier.openDossier') }),
    React.createElement(Weg, { palette, icon: 'documents', onClick: () => onNavigate('briefe'),
      title: t('unterlagen.dossier.briefe.title'), description: t('unterlagen.dossier.briefe.description') }),
    React.createElement(Weg, { palette, icon: 'lock', onClick: () => onNavigate('export'),
      title: t('unterlagen.backup.title'), description: t('unterlagen.backup.description'), status: t('unterlagen.backup.action') })
  );
};

export default UnterlagenWege;
