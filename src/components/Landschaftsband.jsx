import React from 'react';
import { radius } from '../config/tokens.js';
import landschaft from '../assets/berge/landschaft.webp?url';

// Landschaftsband oben in Ablauf, Kapitel und «Was ansteht» (Muster M5) und die Pfad-Pille darauf.
// Bis 09.11.2026 stand das Band dreimal kopiert (AblaufSchale, ChapterView, CalendarReminders) und lief
// auseinander: Pille mit Milchglas, Deckkraft B8 bzw. E6. Querschnitt 1 A-A (Stebler Studios, 09.11.):
// Material statt Effekt — die Pille ist Papier (surface) mit Haarlinie, ohne Unschärfe.

export const BAND_HOEHE = 112;

// grund: Farbe oben im Verlauf (Bereichston). margin: wie weit das Band in den Seitenrand greift.
export const Landschaftsband = ({ palette, grund, margin = '0 -24px', ...rest }) =>
  React.createElement('div', { 'aria-hidden': 'true', ...rest, style: { position: 'relative', height: BAND_HOEHE + 'px', margin, overflow: 'hidden' } },
    React.createElement('div', { style: { position: 'absolute', inset: 0, backgroundImage: 'url(' + landschaft + ')', backgroundSize: 'cover', backgroundPosition: 'center 72%', opacity: 0.5 } }),
    React.createElement('div', { style: { position: 'absolute', inset: '0 0 -1px 0', background: 'linear-gradient(to bottom, ' + grund + ' 0%, transparent 45%, ' + palette.bg + ' 100%)' } })
  );

export const pfadPilleStil = (palette) => ({
  display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: '0 8px', padding: '0 12px',
  borderRadius: radius.full + 'px', background: palette.surface, border: '1px solid ' + palette.border,
});
