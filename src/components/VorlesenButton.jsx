import React from 'react';

// Outline-Lautsprecher (Kegel + eine Schallwelle) — konsistent mit dem funktionalen Icon-Set.
const speakerCone = 'M4 9 h3 l5 -4 v14 l-5 -4 h-3 Z';
const speakerWave = 'M16 9 a5 5 0 0 1 0 6';

export const VorlesenButton = ({ text, speak, size = 14, color, style = {}, label }) => {
  if (!text) return null;
  return React.createElement('button', {
    type: 'button',
    'aria-label': label || 'Vorlesen',
    onClick: (e) => { e.preventDefault(); e.stopPropagation(); speak(text); },
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '2px',
      // Trefferfläche 44 × 44 wie jede Tippfläche in Maloja (Querschnitt 2, 09.11.2026; vorher 24) —
      // gerade die vorlese-bedürftige Gruppe braucht sie. Der negative Rand hält das Icon klein und die
      // Zeile gleich hoch: die Fläche wächst unsichtbar um 10 px je Seite.
      minWidth: '44px',
      minHeight: '44px',
      margin: '-10px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      verticalAlign: 'middle',
      flexShrink: 0,
      ...style,
    },
  },
    React.createElement('svg', {
      width: size, height: size, viewBox: '0 0 24 24',
      fill: 'none', stroke: color || 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round',
    },
      React.createElement('path', { d: speakerCone }),
      React.createElement('path', { d: speakerWave })
    )
  );
};

export default VorlesenButton;
