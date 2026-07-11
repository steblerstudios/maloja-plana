import React from 'react';
import { FRUITS } from './FruchtSilhouette.jsx';
import Icons from './IconSystem.jsx';

// ─── Frucht mit ausgestanztem Bereichs-Icon (echtes Negativ) ────────────────
//
// Die Frucht (in Ast-Farbe) trägt das Bereichs-Icon als ECHTE Aussparung:
// das Icon wird per SVG-Maske aus dem Fruchtkörper gestanzt, der Hintergrund
// scheint durch. Kein weisser Klecks obendrauf mehr (Stebler Studios 2026-07-06).
// „die Früchte nur im Baum … und darin das Negativ des jeweiligen Icons".
//
// Cluster-Früchte (keine Vollkörper) bekommen eine solide Scheibe als Körper,
// damit das Negativ nicht zwischen den Beeren verschwindet.
const CLUSTER_FRUITS = new Set(['vogelbeere', 'kirsche', 'traube']);

// Realistische, aber legbare Grössenverhältnisse (Vollkörper grösser als Beeren).
const SIZE_FACTOR = {
  apfel: 1.0, birne: 1.0, aprikose: 0.94, zwetschge: 0.9, baumnuss: 0.9,
  hagebutte: 0.86, haselnuss: 0.88, heidelbeere: 0.82, kirsche: 0.86,
  traube: 0.92, vogelbeere: 0.84,
};

let _uid = 0;

export default function FruchtMitIcon({ fruit, iconName, color, cutColor, size = 44, ripeness = 1, title }) {
  const maskId = React.useMemo(() => 'frucht-cut-' + (_uid++), []);
  const draw = FRUITS[fruit];
  const iconFactory = Icons[iconName];
  if (!draw) return null;

  const factor = SIZE_FACTOR[fruit] || 1;
  const px = Math.round(size * factor);
  const isCluster = CLUSTER_FRUITS.has(fruit);

  // Alles im 24er-Koordinatenraum. Fruchtkörper-Mitte liegt etwas unter der Box-Mitte
  // (Stiele oben), darauf zentrieren wir das Icon.
  const bodyCx = 12, bodyCy = 13.2;
  const iconU = 11;                 // Icon-Kantenlänge in Einheiten
  const dx = bodyCx - iconU / 2;
  const dy = bodyCy - iconU / 2;

  return React.createElement('svg', {
    viewBox: '0 0 24 24', width: px, height: px,
    role: title ? 'img' : undefined, 'aria-label': title || undefined,
    'aria-hidden': title ? undefined : 'true', focusable: 'false',
    style: { display: 'block', color, opacity: 0.5 + ripeness * 0.5 },
  },
    React.createElement('defs', null,
      React.createElement('mask', { id: maskId, maskUnits: 'userSpaceOnUse' },
        // weiss = Frucht sichtbar, schwarz = ausgestanzt (Icon-Form)
        React.createElement('rect', { x: 0, y: 0, width: 24, height: 24, fill: 'white' }),
        // Icon in Schwarz = ausgestanzte Form. Rohe Icon-SVG (nicht der HTML-Wrapper),
        // positioniert + skaliert über die verschachtelte SVG.
        iconFactory ? React.createElement('g', { style: { color: 'black' } },
          React.cloneElement(iconFactory(), { x: dx, y: dy, width: iconU, height: iconU })
        ) : null
      )
    ),
    React.createElement('g', { mask: 'url(#' + maskId + ')' },
      // Cluster-Früchte: solider Körper hinter dem Cluster, sonst greift die Aussparung ins Leere.
      isCluster ? React.createElement('circle', { cx: bodyCx, cy: bodyCy, r: 7, fill: 'currentColor' }) : null,
      React.createElement('g', { style: { color } }, draw())
    )
  );
}
