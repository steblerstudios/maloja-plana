import React from 'react';
export const ThemeToggle = ({ palette, t, isDarkMode, onToggle }) => {
  return React.createElement('button', {
    onClick: onToggle,
    style: { padding: '8px 12px', background: palette.gold, color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }
  }, isDarkMode ? '○ ' + (t ? t('theme.light') : 'Light') : '● ' + (t ? t('theme.dark') : 'Dark'));
};
export default ThemeToggle;
