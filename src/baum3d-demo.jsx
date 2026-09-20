import React from 'react';
import { createRoot } from 'react-dom/client';
import { LEBENSBEREICHE } from './data/lebensbereiche.js';

// MESSSEITE — nur im Arbeitsbaum. Lädt den 3D-Baum als NACHGELADENES Stück,
// genau so, wie er später im Dashboard hinge. Damit misst der Build die echte
// Chunk-Grösse, und wir sehen zugleich, wie es aussieht.
const Baum3D = React.lazy(() => import('./Baum3D.jsx'));

// Die Phasen doppelt gepflegt wäre eine Drift-Quelle — die Messseite fragt die
// Wahrheit beim Bauteil ab, sobald es geladen ist.
const PHASEN_FALLBACK = [
  { ab: 0, name: 'Keimling' }, { ab: 12, name: 'Stamm und Äste' }, { ab: 32, name: 'Knospen' },
  { ab: 46, name: 'Blätter und Blüte' }, { ab: 66, name: 'Früchte' }, { ab: 96, name: 'Ausgewachsen' },
];
const phaseVon = (pct) => PHASEN_FALLBACK.reduce((t, p) => (pct >= p.ab ? p : t), PHASEN_FALLBACK[0]).name;

import { formFuerFrucht } from './data/baumFormen.js';

function Demo() {
  const [pct, setPct] = React.useState(55);
  const [dunkel, setDunkel] = React.useState(false);
  const bereiche = React.useMemo(() => LEBENSBEREICHE.map((b, i) => ({
    key: b.key,
    farbe: dunkel ? b.dark : b.light,
    form: formFuerFrucht(b.fruit),
    // Damit man das ungleiche Reifen sieht: die Bereiche liegen um den
    // eingestellten Gesamtstand herum gestreut, wie im echten Leben.
    pct: Math.max(0, Math.min(100, pct + ((i % 5) - 2) * 14)),
  })), [pct, dunkel]);

  return React.createElement('div', { style: { maxWidth: 880, margin: '0 auto', padding: 16, fontFamily: 'system-ui' } },
    React.createElement('h1', { style: { fontSize: 20, fontWeight: 500 } }, 'Messseite — 3D-Lebensbaum'),
    React.createElement('p', { style: { color: '#666', fontSize: 14 } },
      'Elf Äste, einer je Lebensbereich. Jeder reift mit seinem eigenen Ausfüllstand. Ziehen zum Drehen, Pfeiltasten gehen auch.'),
    React.createElement('label', { style: { display: 'block', margin: '12px 0', fontSize: 14 } },
      'Ausfüllstand ' + pct + '% · Phase: ' + phaseVon(pct) + ' ',
      React.createElement('input', {
        type: 'range', min: 0, max: 100, value: pct, style: { width: '100%' },
        onChange: (e) => setPct(+e.target.value),
      })),
    React.createElement('label', { style: { fontSize: 14 } },
      React.createElement('input', { type: 'checkbox', checked: dunkel, onChange: (e) => setDunkel(e.target.checked) }),
      ' Dunkelmodus'),
    React.createElement(React.Suspense, { fallback: React.createElement('p', null, 'Baum wird geladen …') },
      React.createElement(Baum3D, {
        bereiche, isDarkMode: dunkel, gesamtPct: pct, hoehe: 460,
        ariaLabel: 'Lebensbaum, Ausfüllstand ' + pct + ' Prozent',
      }))
  );
}

createRoot(document.getElementById('demo')).render(React.createElement(Demo));
