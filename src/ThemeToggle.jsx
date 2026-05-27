import React from 'react';
import { text, weight, radius, space } from './config/tokens.js';
export const ThemeToggle = ({ palette, t, isDarkMode, onToggle }) => {
  return React.createElement('button', {
    onClick: onToggle,
    style: { padding: space.sm - 2 + 'px ' + (space.sm + 2) + 'px', background: palette.gold, color: '#000', border: 'none', borderRadius: radius.sm, cursor: 'pointer', fontSize: text.xs, fontWeight: weight.semi, whiteSpace: 'nowrap' }
  }, isDarkMode ? '○ ' + (t ? t('theme.light') : 'Light') : '● ' + (t ? t('theme.dark') : 'Dark'));
};
export default ThemeToggle;
