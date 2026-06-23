import React from 'react';

const speakerPath = 'M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0012 8.5v1.06a3.5 3.5 0 010 4.88V15.5a4.5 4.5 0 004.5-3.5z';

export const VorlesenButton = ({ text, speak, size = 14, color, style = {} }) => {
  if (!text) return null;
  return React.createElement('button', {
    type: 'button',
    'aria-label': 'Vorlesen',
    onClick: (e) => { e.preventDefault(); e.stopPropagation(); speak(text); },
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '2px',
      opacity: 0.45,
      display: 'inline-flex',
      alignItems: 'center',
      verticalAlign: 'middle',
      flexShrink: 0,
      ...style,
    },
  },
    React.createElement('svg', {
      width: size, height: size, viewBox: '0 0 24 24',
      fill: color || 'currentColor',
    },
      React.createElement('path', { d: speakerPath })
    )
  );
};

export default VorlesenButton;
