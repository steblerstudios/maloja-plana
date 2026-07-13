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
      // Tap-Target ≥24px (WCAG 2.5.8): Icon bleibt klein/subtil, aber die Trefferfläche
      // erreicht die AA-Mindestgrösse — wichtig, da genau die vorlese-bedürftige Gruppe
      // auf sichere Antippbarkeit angewiesen ist.
      minWidth: '24px',
      minHeight: '24px',
      opacity: 0.45,
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
