import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ANGABE_ZIELE, angabeZiele, springeZuAngabe } from '../data/angabeZiele.js';
import { ergebnis, ERGEBNIS_ART } from '../data/ergebnisArt.js';
import { ergebnisSatzTeile } from '../components/ErgebnisArt.jsx';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';
import { AlvRechner } from '../AlvRechner.jsx';
import { EOrechner } from '../EOrechner.jsx';
import { StipendienView } from '../StipendienView.jsx';
import { Stundenlohn } from '../Stundenlohn.jsx';
import { SozialhilfeRechner } from '../SozialhilfeRechner.jsx';

// Kapitel 5, C (10.11.2026): «Noch nötig: Beitragsmonate» mit Sprung zum Feld, app-weit.

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const tStub = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (C, props) => renderToStaticMarkup(React.createElement(C, { palette, t: tStub, onNavigate: () => {}, ...props }));
const leer = { persoenlich: {}, finanzen: {}, ausbildung: {}, haushalt: { personen: [] } };

describe('jede Ziel-ID steht im Rechner, der sie meldet', () => {
  const rechner = { alv: AlvRechner, eo: EOrechner, stipendien: StipendienView, stundenlohn: Stundenlohn, sozialhilfe: SozialhilfeRechner };
  // Felder, die nur unter einer Bedingung erscheinen — und nur dann auch als fehlend gemeldet werden.
  const bedingt = { sozialhilfe: ['erwerbsunkosten'] };
  for (const [view, ziele] of Object.entries(ANGABE_ZIELE)) {
    it(view, () => {
      expect(rechner[view], 'Rechner für ' + view + ' im Test eintragen').toBeTruthy();
      const html = render(rechner[view], { data: leer });
      for (const [name, id] of Object.entries(ziele)) {
        if ((bedingt[view] || []).includes(name)) continue;
        expect(html, view + '.' + name + ' → #' + id).toContain('id="' + id + '"');
      }
    });
  }
  it('ohne Eintrag kein Ziel', () => {
    expect(angabeZiele('lohnEinordnung')).toBeNull();
    expect(angabeZiele(undefined)).toBeNull();
  });
});

describe('der Satz lässt sich an der Liste teilen — in allen fünf Sprachen', () => {
  const e = ergebnis(ERGEBNIS_ART.SCHAETZUNG, { fehlend: ['beitragsmonate', 'geburtsdatum'] });
  for (const [lang, texte] of Object.entries({ de, fr, it: it_, en, rm })) {
    it(lang, () => {
      const t = createT({ [lang]: texte, de }, lang, 'sie');
      const teile = ergebnisSatzTeile(e, t);
      expect(teile).not.toBeNull();
      expect(teile.namen.map((n) => n.name)).toEqual(['beitragsmonate', 'geburtsdatum']);
      // Zusammengesetzt ergibt es genau den bisherigen Satz.
      expect(teile.vorher + teile.namen.map((n) => n.label).join(', ') + teile.nachher).toBe(teile.ganz);
    });
  }
  it('ohne fehlende Angaben nichts zu teilen', () => {
    const t = createT({ de }, 'de', 'sie');
    expect(ergebnisSatzTeile(ergebnis(ERGEBNIS_ART.SCHAETZUNG), t)).toBeNull();
  });
});

describe('springeZuAngabe', () => {
  const knoten = (tag, extra = {}) => ({ tagName: tag, parentElement: null, open: false, matches: () => false, querySelector: () => null, ...extra });
  it('öffnet zugeklappte <details> darüber und fokussiert das Feld', () => {
    const details = knoten('DETAILS');
    const aufrufe = [];
    const feld = knoten('INPUT', { parentElement: details, matches: () => true, focus: (o) => aufrufe.push(['focus', o]), scrollIntoView: () => aufrufe.push(['scroll']) });
    const doc = { getElementById: (id) => (id === 'alv-monate' ? feld : null) };
    expect(springeZuAngabe('alv-monate', doc)).toBe(true);
    expect(details.open).toBe(true);
    expect(aufrufe).toEqual([['scroll'], ['focus', { preventScroll: true }]]);
  });
  it('eine Gruppe (Einzelwahl) gibt den Fokus an das erste fokussierbare Element darin', () => {
    let fokus = null;
    const option = knoten('BUTTON', { focus: () => { fokus = 'option'; } });
    const gruppe = knoten('DIV', { querySelector: () => option });
    expect(springeZuAngabe('stip-status', { getElementById: () => gruppe })).toBe(true);
    expect(fokus).toBe('option');
  });
  it('fehlt das Feld, passiert nichts', () => {
    expect(springeZuAngabe('gibt-es-nicht', { getElementById: () => null })).toBe(false);
    expect(springeZuAngabe('', { getElementById: () => null })).toBe(false);
  });
});
