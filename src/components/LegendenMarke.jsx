import React from 'react';

// Legenden-Marken der Barometer (Lohn-Einordnung, Regional-/Miet-Barometer): kleine
// SVG-Formen, die die Marken AUF dem Balken spiegeln — eine Symbol-Sprache für alle drei:
//   • fuellung — der abgerundete Füll-Balken (dein Wert)
//   • punkt    — der Punkt mit `surface`-Halo (Median / Regions-Schnitt)
//   • strich   — der 2px-Referenzstrich (Schweizer Schnitt / Branche)
//   • schwelle — das «!» der harten Grenze (Drittel-Regel / Mindestlohn)
// Ersetzt die früheren Unicode-Glyphen ▬ ● ▏, die nur `aria-hidden`-gepflastert waren
// (docs/TODO.md §G3 P1). Rein dekorativ — der Wert steht im Text daneben — deshalb
// `aria-hidden`. Die Farbe kommt vom Aufrufer: dieselbe Variable wie die Marke auf dem
// Balken (eine Marke, eine Farbe), nie eine eigene.
const W = 14;
const H = 10;

const shapes = {
  fuellung: (color) => React.createElement('rect', { x: 0, y: 2, width: W, height: 6, rx: 3, fill: color }),
  punkt: (color, palette) => React.createElement('circle', { cx: 7, cy: 5, r: 3.75, fill: color, stroke: palette.surface, strokeWidth: 1.25 }),
  strich: (color) => React.createElement('rect', { x: 6, y: 0, width: 2, height: H, fill: color }),
  schwelle: (color) => React.createElement('path', { d: 'M7 1.2v4.6M7 8.6h.01', fill: 'none', stroke: color, strokeWidth: 2.2, strokeLinecap: 'round' }),
  // Häuserzeile (Wohnen, 11.11.2026): dieselben drei Rollen als kleine Häuser.
  //   • haus       — gefülltes Haus (Ihre Miete), wie `fuellung`
  //   • hausDach   — Haus mit farbigem Dach (Region), das Dach trägt die Farbe des Punkts
  //   • hausStrich — gestricheltes Haus (Schweizer Schnitt), neutral wie der Strich
  haus: (color) => React.createElement('path', { d: 'M3 10V5L7 1.5L11 5V10Z', fill: color }),
  hausDach: (color, palette) => React.createElement(React.Fragment, null,
    React.createElement('path', { d: 'M3 10V5.5H11V10Z', fill: 'none', stroke: palette.text, strokeWidth: 1.2 }),
    React.createElement('path', { d: 'M2 5.5L7 1.2L12 5.5Z', fill: color })),
  // Drittel-Haus (11.11.2026): der Viertel-Strich als feine Punktlinie, wie im Haus.
  punktlinie: (color) => React.createElement('path', { d: 'M1 5H13', fill: 'none', stroke: color, strokeWidth: 1.5, strokeDasharray: '1 3', strokeLinecap: 'round' }),
  hausStrich: (color) => React.createElement('path', { d: 'M3 10V5L7 1.5L11 5V10Z', fill: 'none', stroke: color, strokeWidth: 1.2, strokeDasharray: '2 1.5' }),
};

export const LegendenMarke = ({ form, color, palette, style }) => {
  const shape = shapes[form];
  if (!shape) return null;
  return React.createElement('svg', {
    width: W, height: H, viewBox: '0 0 ' + W + ' ' + H,
    'aria-hidden': 'true', focusable: 'false',
    style: { display: 'inline-block', verticalAlign: '-1px', marginRight: '4px', flexShrink: 0, ...style },
  }, shape(color, palette || {}));
};

export default LegendenMarke;
