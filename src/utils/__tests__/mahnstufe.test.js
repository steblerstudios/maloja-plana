import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MAHNSTUFEN, leseStufe, naechsterWeg } from '../mahnstufe.js';
import { MahnstufenLeiste } from '../../SchuldenManager.jsx';
import { MahnstufenUebersicht } from '../../components/SchuldenBilder.jsx';
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
  // Seit der Dataviz-Runde (27.09.2026) steht das Bild der Stufen EINMAL in der Übersicht
  // (MahnstufenUebersicht), die Karte trägt nur Auswahl + Weg.
  it('Karte: Auswahl und Weg zur Mahnung; KK-Satz nur bei Krankenkasse', () => {
    const t = createT({ de }, 'de', 'sie');
    const ziele = [];
    const karte = (category) => renderToStaticMarkup(React.createElement(MahnstufenLeiste, {
      debt: { id: 1, status: 'open', stufe: 'mahnung', category }, palette: LIGHT_PALETTE, t, inputStyle: {}, onChange: () => {}, onNavigate: (v) => ziele.push(v),
    }));
    expect(karte('krankenkasse')).toContain(de.schulden.stufe.linkMahnung);
    expect(karte('krankenkasse')).toContain('aria-describedby="stufe-1-hilfe"');
    expect(karte('steuern')).not.toContain(de.schulden.stufe.hilfe);
    expect(de.schulden.stufe.linkZahlungsbefehl).toContain('ab Zustellung');
    expect(karte('krankenkasse')).not.toMatch(/[●○→]/);
  });
  // Die Stufe steht als Text im aria-label der Zeile; die Punkte daneben sind nur Bild.
  it('Übersicht: Stufe als Text, Punkte nur Bild', () => {
    const t = createT({ de }, 'de', 'sie');
    const html = renderToStaticMarkup(React.createElement(MahnstufenUebersicht, {
      palette: LIGHT_PALETTE, t, prioritized: [{ id: 1, creditor: 'KK', status: 'open', stufe: 'mahnung', tier: 1 }],
    }));
    expect(html).toContain('>KK: Mahnung erhalten</span>');
    expect(html).toMatch(/<div aria-hidden="true"[^>]*position:relative;display:grid/);
    expect(html).not.toMatch(/[●○→]/);
  });
  it('ohne Angabe: nur die Auswahl, keine Leiste, kein Weg', () => {
    const t = createT({ de }, 'de', 'sie');
    const html = renderToStaticMarkup(React.createElement(MahnstufenLeiste, { debt: { id: 2, status: 'open' }, palette: LIGHT_PALETTE, t, inputStyle: {}, onChange: () => {} }));
    expect(html).toContain('<select');
    expect(html).not.toContain('<ol');
  });
});
