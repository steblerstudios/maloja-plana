import { describe, it, expect } from 'vitest';
import React from 'react';
import { NotfallFach, FAECHER } from '../bereiche/notfall/fach.jsx';
import { Impfausweis, Karteikarten, Wochenblister, Fiebertagebuch } from '../bereiche/notfall/notfall.js';

// Ein nachgeladener Baustein für die vier Fächer (23.11.2026, Startbündel unter 65 kB):
// jede Router-Ansicht landet beim richtigen Fach, eine unbekannte bei nichts.
describe('NotfallFach · Ansicht → Fach', () => {
  it('ordnet die vier Ansichten den vier Fächern zu', () => {
    expect(FAECHER).toEqual({ impfausweis: Impfausweis, karteikarten: Karteikarten, blister: Wochenblister, fieber: Fiebertagebuch });
  });

  it('gibt das Fach mit allen übrigen Props zurück, ohne `fach`', () => {
    const el = NotfallFach({ fach: 'blister', t: (k) => k, lang: 'fr', data: {} });
    expect(el.type).toBe(Wochenblister);
    expect(el.props).toEqual({ t: el.props.t, lang: 'fr', data: {} });
    expect('fach' in el.props).toBe(false);
  });

  it('unbekannte Ansicht: nichts', () => {
    expect(NotfallFach({ fach: 'gibtesnicht' })).toBeNull();
    expect(React.isValidElement(NotfallFach({ fach: 'fieber' }))).toBe(true);
  });
});
