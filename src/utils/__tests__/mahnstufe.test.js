import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MAHNSTUFEN, leseStufe, naechsterWeg } from '../mahnstufe.js';
import { MahnstufenLeiste } from '../../SchuldenManager.jsx';
import { LIGHT_PALETTE } from '../../config/constants.js';
import { createT } from '../../i18n/index.js';
import de from '../../i18n/de.js';

// Mahnstufe (27.09.2026): Rechnung → Mahnung → Zahlungsbefehl (SchKG Art. 38 Abs. 2).
describe('Mahnstufe', () => {
  it('drei Stufen in Reihenfolge; Unbekanntes = keine Angabe', () => {
    expect(MAHNSTUFEN).toEqual(['rechnung', 'mahnung', 'zahlungsbefehl']);
    expect(leseStufe('mahnung')).toBe('mahnung');
    expect(leseStufe(undefined)).toBe('');
    expect(leseStufe('betreibung')).toBe('');
  });
  it('nächster Weg: Mahnung → Ablauf Mahnung, Zahlungsbefehl → Betreibung, sonst nichts', () => {
    expect(naechsterWeg({ stufe: 'mahnung', status: 'open' }).view).toBe('mahnung');
    expect(naechsterWeg({ stufe: 'zahlungsbefehl', status: 'overdue' }).view).toBe('betreibung');
    expect(naechsterWeg({ stufe: 'rechnung', status: 'open' })).toBeNull();
    expect(naechsterWeg({ status: 'open' })).toBeNull(); // alte Einträge ohne Feld
    expect(naechsterWeg({ stufe: 'zahlungsbefehl', status: 'paid' })).toBeNull();
  });
  it('Stufenleiste: Text + Form, aktuelle Stufe mit aria-current, Weg zur Mahnung', () => {
    const t = createT({ de }, 'de', 'sie');
    const ziele = [];
    const html = renderToStaticMarkup(React.createElement(MahnstufenLeiste, {
      debt: { id: 1, status: 'open', stufe: 'mahnung' }, palette: LIGHT_PALETTE, t, inputStyle: {}, onChange: () => {}, onNavigate: (v) => ziele.push(v),
    }));
    expect(html).toContain('aria-current="step"');
    expect(html).toMatch(/aria-current="step"[^>]*>.*Mahnung erhalten/);
    expect(html).toContain(de.schulden.stufe.linkMahnung);
    expect(html).toContain('aria-describedby="stufe-1-hilfe"');
    expect(de.schulden.stufe.linkZahlungsbefehl).toContain('ab Zustellung');
    expect(html).not.toMatch(/[●○→]/);
  });
  it('ohne Angabe: nur die Auswahl, keine Leiste, kein Weg', () => {
    const t = createT({ de }, 'de', 'sie');
    const html = renderToStaticMarkup(React.createElement(MahnstufenLeiste, { debt: { id: 2, status: 'open' }, palette: LIGHT_PALETTE, t, inputStyle: {}, onChange: () => {} }));
    expect(html).toContain('<select');
    expect(html).not.toContain('<ol');
  });
});
