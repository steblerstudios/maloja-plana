import React from 'react';

// ─── Frucht-Silhouetten — die reifenden Früchte der Lebensbaum-Äste ─────────
//
// Eine Schweizer Frucht pro Lebensbereich ([[project_navigation_spine]]).
// Als SILHOUETTE gezeichnet, damit die Form der tragende, graustufen-sichere
// Kanal ist (WCAG: nie Farbe allein). Farbe kommt über `currentColor` von der
// Elternfarbe (Ast-Farbe aus lebensbereiche.js) — funktioniert hell + dunkel.
//
// Konventionen wie IconSystem.jsx: viewBox 0 0 24 24, fill currentColor.
// Innere Rillen (Aprikose/Zwetschge/Baumnuss) sind echte Aussparungen
// (fill-rule evenodd), damit sie ohne Kenntnis der Hintergrundfarbe lesbar sind.

const p = (d, extra) => React.createElement('path', Object.assign({ d, fill: 'currentColor' }, extra));
const circle = (cx, cy, r, extra) => React.createElement('circle', Object.assign({ cx, cy, r, fill: 'currentColor' }, extra));
const frag = (...kids) => React.createElement(React.Fragment, null, ...kids.filter(Boolean).map((k, i) => React.cloneElement(k, { key: i })));

// Jede Frucht = Funktion, die die SVG-Kinder liefert.
const FRUITS = {
  // Apfel — runde Pome mit Delle oben, Stiel + Blatt.
  apfel: () => frag(
    p('M12 8 C 10.5 6.6 7.4 6.6 6.3 9.4 C 5.4 11.8 6 17 9 19.4 C 10.4 20.5 13.6 20.5 15 19.4 C 18 17 18.6 11.8 17.7 9.4 C 16.6 6.6 13.5 6.6 12 8 Z'),
    React.createElement('path', { d: 'M12 8 L12 4.4', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round', fill: 'none' }),
    p('M12 6 C 13 4.2 15.4 3.6 16.6 4.4 C 15.8 6.4 13.6 7 12 6 Z')
  ),
  // Birne — schmaler Hals, runder Bauch, Stiel.
  birne: () => frag(
    p('M12 5.4 C 11.1 5.4 10.6 6.9 11.1 8.7 C 8.6 9.9 7.4 13 8.3 16.2 C 9.1 19 11 20.6 12 20.6 C 13 20.6 14.9 19 15.7 16.2 C 16.6 13 15.4 9.9 12.9 8.7 C 13.4 6.9 12.9 5.4 12 5.4 Z'),
    React.createElement('path', { d: 'M12 5.6 L12 3.6', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round', fill: 'none' })
  ),
  // Aprikose — rund mit senkrechter Naht (echte Aussparung), kurzer Stiel.
  aprikose: () => frag(
    React.createElement('path', {
      fillRule: 'evenodd', fill: 'currentColor',
      d: 'M12 6 C 8.1 6 6 9.5 6 13.2 C 6 16.9 8.7 19.6 12 19.6 C 15.3 19.6 18 16.9 18 13.2 C 18 9.5 15.9 6 12 6 Z '
       + 'M11.7 7.2 C 10.6 10.7 10.6 15.3 11.7 18.4 L 12.3 18.4 C 11.2 15.3 11.2 10.7 12.3 7.2 Z',
    }),
    React.createElement('path', { d: 'M12 6.2 L12.6 4.4', stroke: 'currentColor', strokeWidth: 1.1, strokeLinecap: 'round', fill: 'none' })
  ),
  // Heidelbeere — eine Beere mit 5-zackiger Krone (Kelch) oben.
  heidelbeere: () => frag(
    circle(12, 14, 6),
    p('M12 8.6 L10.6 5.6 L12 7 L13.4 5.6 L12 8.6 Z M9.6 9.4 L6.8 8.4 L8.8 9 L8.4 6.9 L9.6 9.4 Z M14.4 9.4 L15.6 6.9 L15.2 9 L17.2 8.4 L14.4 9.4 Z')
  ),
  // Hagebutte — ovale Frucht mit kleinem Sternkelch (Zacken) unten.
  hagebutte: () => frag(
    React.createElement('ellipse', { cx: 12, cy: 12, rx: 5.2, ry: 6.4, fill: 'currentColor' }),
    p('M12 18 L10.4 21 L12 19.4 L13.6 21 L12 18 Z M9.2 17.4 L7.2 19.6 L9 18.4 L9.2 17.4 Z M14.8 17.4 L14.8 18.4 L16.8 19.6 L14.8 17.4 Z'),
    React.createElement('path', { d: 'M12 5.8 L12 3.6', stroke: 'currentColor', strokeWidth: 1.1, strokeLinecap: 'round', fill: 'none' })
  ),
  // Haselnuss — Nuss mit gezackter Hülle (Kappe) oben — Eichel-artig.
  haselnuss: () => frag(
    p('M7 11 C 7 16 9 20 12 20 C 15 20 17 16 17 11 Z'),
    p('M6.2 11 C 6.2 8.2 8.6 6.4 12 6.4 C 15.4 6.4 17.8 8.2 17.8 11 C 16.4 10.2 14.9 11.4 13.6 10.4 C 12.7 11.6 11.3 11.6 10.4 10.4 C 9.1 11.4 7.6 10.2 6.2 11 Z'),
    React.createElement('path', { d: 'M12 6.4 L12 4.2', stroke: 'currentColor', strokeWidth: 1.1, strokeLinecap: 'round', fill: 'none' })
  ),
  // Kirsche — zwei Früchte an gemeinsamem Y-Stiel.
  kirsche: () => frag(
    circle(8.4, 17, 3.8),
    circle(15.6, 17, 3.8),
    React.createElement('path', { d: 'M8.4 13.4 C 9.5 8 12 5 14 4 M15.6 13.4 C 15 9 14.6 6 14 4', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round', fill: 'none' })
  ),
  // Traube — nach unten spitze Cluster aus Beeren + Stiel/Blatt.
  traube: () => frag(
    circle(9, 10, 2),
    circle(12, 10, 2),
    circle(15, 10, 2),
    circle(10.5, 13.4, 2),
    circle(13.5, 13.4, 2),
    circle(12, 16.8, 2),
    React.createElement('path', { d: 'M12 8 L12 4.4', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round', fill: 'none' }),
    p('M12 5.4 C 13.2 3.8 15.4 3.6 16.4 4.4 C 15.6 6.2 13.4 6.4 12 5.4 Z')
  ),
  // Baumnuss (Walnuss) — runde Nuss mit geschwungener Mittelnaht (Aussparung).
  baumnuss: () => frag(
    React.createElement('path', {
      fillRule: 'evenodd', fill: 'currentColor',
      d: 'M12 5.6 C 7.6 5.6 5.4 9 5.4 12.6 C 5.4 16.8 8.4 20 12 20 C 15.6 20 18.6 16.8 18.6 12.6 C 18.6 9 16.4 5.6 12 5.6 Z '
       + 'M11.6 7 C 12.6 9 10.8 10.6 11.6 12.6 C 12.4 14.6 10.8 16.6 11.9 18.6 L 12.4 18.6 C 11.4 16.6 13 14.6 12.2 12.6 C 11.4 10.6 13.2 9 12.4 7 Z',
    })
  ),
  // Vogelbeere — Dolde aus vielen kleinen Beeren, oben breit auffächernd.
  vogelbeere: () => frag(
    circle(7, 12, 1.8),
    circle(10.2, 11.2, 1.8),
    circle(13.8, 11.2, 1.8),
    circle(17, 12, 1.8),
    circle(8.8, 14.6, 1.8),
    circle(12, 15, 1.8),
    circle(15.2, 14.6, 1.8),
    React.createElement('path', { d: 'M12 13 L12 4.4 M12 6 L9 4 M12 6 L15 4', stroke: 'currentColor', strokeWidth: 1.1, strokeLinecap: 'round', fill: 'none' })
  ),
  // Zwetschge — hohes schmales Oval mit senkrechter Furche (Aussparung).
  zwetschge: () => frag(
    React.createElement('path', {
      fillRule: 'evenodd', fill: 'currentColor',
      d: 'M12 5 C 8.6 5 6.8 8.6 6.8 12.4 C 6.8 16.6 9 20.4 12 20.4 C 15 20.4 17.2 16.6 17.2 12.4 C 17.2 8.6 15.4 5 12 5 Z '
       + 'M11.7 6.4 C 10.8 10 10.8 15 11.7 19 L 12.3 19 C 11.4 15 11.4 10 12.3 6.4 Z',
    }),
    React.createElement('path', { d: 'M12 5.2 L12.6 3.4', stroke: 'currentColor', strokeWidth: 1.1, strokeLinecap: 'round', fill: 'none' })
  ),
};

// name = Frucht-Schlüssel (apfel, birne, …). size in px. color über CSS `color`.
export default function FruchtSilhouette({ name, size = 20, style, title }) {
  const draw = FRUITS[name];
  if (!draw) return null;
  return React.createElement('svg', {
    viewBox: '0 0 24 24',
    width: size, height: size,
    role: title ? 'img' : undefined,
    'aria-label': title || undefined,
    'aria-hidden': title ? undefined : 'true',
    focusable: 'false',
    style: Object.assign({ display: 'block' }, style),
  }, draw());
}

export { FRUITS };
