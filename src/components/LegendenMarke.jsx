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
};

export const LegendenMarke = ({ form, color, palette, style }) => {
  const shape = shapes[form];
  if (!shape) return null;
  return React.createElement('svg', {
    width: W, height: H, viewBox: '0 0 ' + W + ' ' + H,
    'aria-hidden': 'true', focusable: 'false',
    style: { display: 'inline-block', verticalAlign: '-1px', marginRight: '5px', flexShrink: 0, ...style },
  }, shape(color, palette || {}));
};

export default LegendenMarke;
