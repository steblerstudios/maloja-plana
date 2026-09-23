import React from 'react';

// Status-Form: ein Punkt, dessen FORM die Bedeutung trägt — nicht nur seine Farbe.
//   • voll — trifft zu / gedeckt
//   • kern — teilweise / unklar (Ring mit Kern)
//   • hohl — trifft hier nicht zu / nicht gedeckt. Bewusst ein hohler Ring und
//            kein ✕: Information, kein Alarm.
// Zuerst in der KVG-Statuslogik (Farbenblind-Modus), seit 23.09.2026 auch im
// Stipendien-Check, der vorher ✓ ○ ⓘ als Buchstaben vor den Satz klebte — in
// einer aria-live-Region, also vorgelesen als «weisser Kreis, …».
// Rein dekorativ: das Wort daneben sagt dasselbe, darum `aria-hidden`.
// Die Farbe kommt vom Aufrufer.
const formen = {
  voll: (c) => React.createElement('circle', { cx: '5', cy: '5', r: '4', fill: c }),
  kern: (c) => React.createElement(React.Fragment, null,
    React.createElement('circle', { cx: '5', cy: '5', r: '4', fill: 'none', stroke: c, strokeWidth: '1.4' }),
    React.createElement('circle', { cx: '5', cy: '5', r: '1.6', fill: c })),
  hohl: (c) => React.createElement('circle', { cx: '5', cy: '5', r: '3.6', fill: 'none', stroke: c, strokeWidth: '1.4' }),
};

export const StatusForm = ({ form, color, size = 9, style }) => {
  const zeichne = formen[form];
  if (!zeichne) return null;
  return React.createElement('svg', {
    width: String(size), height: String(size), viewBox: '0 0 10 10',
    'aria-hidden': 'true', focusable: 'false', style: { flexShrink: 0, ...style },
  }, zeichne(color));
};

export default StatusForm;
