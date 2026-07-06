import React from 'react';
import FruchtSilhouette from './FruchtSilhouette.jsx';
import { Icon } from './IconSystem.jsx';

// ─── Frucht mit eingestanztem Bereichs-Icon ─────────────────────────────────
//
// Die Frucht (in Ast-Farbe) trägt das Bereichs-Icon (Chalet etc.) als Negativ —
// das Icon erscheint in der Hintergrundfarbe „ausgestanzt". So bekommen die
// Früchte ihr Zuhause am Lebensbaum (Sophie 2026-07-06):
// „die Früchte nur im Baum … und darin das Negativ des jeweiligen Icons".
//
// fruit      = Frucht-Schlüssel (apfel, birne, …)
// iconName   = Icon-Schlüssel (basis, wohnen, … → IconSystem)
// color      = Ast-Farbe (Fruchtkörper)
// cutColor   = Hintergrundfarbe, in der das Icon „ausgestanzt" erscheint
// size       = Kantenlänge in px; ripeness 0..1 = Reifegrad (Deckkraft)
export default function FruchtMitIcon({ fruit, iconName, color, cutColor = '#F4F1EC', size = 40, ripeness = 1, title }) {
  const iconSize = Math.round(size * 0.46);
  return React.createElement('span', {
    role: title ? 'img' : undefined,
    'aria-label': title || undefined,
    style: {
      position: 'relative', display: 'inline-flex', width: size, height: size,
      alignItems: 'center', justifyContent: 'center', color, opacity: 0.45 + ripeness * 0.55,
    },
  },
    React.createElement(FruchtSilhouette, { name: fruit, size }),
    // Icon als Negativ — in der Hintergrundfarbe auf den Fruchtkörper gestanzt.
    iconName ? React.createElement('span', {
      style: {
        position: 'absolute', top: '52%', left: '50%', transform: 'translate(-50%,-50%)',
        width: iconSize, height: iconSize, color: cutColor, display: 'inline-flex',
      },
    }, React.createElement(Icon, { name: iconName, size: iconSize })) : null,
  );
}
