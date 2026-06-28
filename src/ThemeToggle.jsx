import React from 'react';
import { text, weight, radius, space } from './config/tokens.js';

// Sonne = wechselt zu Hell, Mond = wechselt zu Dunkel. Reine SVG-Icons
// (currentColor), damit sie ruhig zur Granit-/Gold-Palette passen.
const SunIcon = () => React.createElement('svg', {
  width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true'
},
  React.createElement('circle', { cx: '12', cy: '12', r: '4' }),
  React.createElement('path', { d: 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41' })
);
const MoonIcon = () => React.createElement('svg', {
  width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true'
},
  React.createElement('path', { d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' })
);

export const ThemeToggle = ({ palette, t, isDarkMode, onToggle }) => {
  return React.createElement('button', {
    onClick: onToggle,
    'aria-label': isDarkMode ? (t ? t('theme.light') : 'Light mode') : (t ? t('theme.dark') : 'Dark mode'),
    style: { display: 'inline-flex', alignItems: 'center', gap: '5px', padding: space.sm - 2 + 'px ' + (space.sm + 2) + 'px', background: palette.gold, color: '#000', border: 'none', borderRadius: radius.sm, cursor: 'pointer', fontSize: text.xs, fontWeight: weight.semi, whiteSpace: 'nowrap' }
  },
    isDarkMode ? React.createElement(SunIcon, { key: 'icon' }) : React.createElement(MoonIcon, { key: 'icon' }),
    React.createElement('span', { key: 'label' }, isDarkMode ? (t ? t('theme.light') : 'Light') : (t ? t('theme.dark') : 'Dark'))
  );
};
export default ThemeToggle;
