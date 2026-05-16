import React from 'react';
export const ThemeToggle = ({ palette, t, isDarkMode, onToggle }) => {
  return React.createElement('button', {
    onClick: onToggle,
    style: { padding: '6px 10px', background: palette.gold, color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', whiteSpace: 'nowrap' }
  }, isDarkMode ? '○ ' + (t ? t('theme.light') : 'Light') : '● ' + (t ? t('theme.dark') : 'Dark'));
};
export default ThemeToggle;
