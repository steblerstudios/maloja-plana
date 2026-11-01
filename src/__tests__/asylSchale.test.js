import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { ASYL_STATUS, ASYL_PROCESS, ASYL_RIGHTS, ASYL_ORGS } from '../data/asylData.js';
import { AsylView } from '../AsylView.jsx';

// F7-A11 (Entscheid Stebler Studios 27.10.2026): «Asyl & Schutz» in der Ablauf-Schale — Schritte statt freier
// Gliederung, Inhalt unverändert.
beforeEach(() => { globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }; });
const t = createT({ de }, 'de', 'sie');
const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;');
const html = () => renderToStaticMarkup(React.createElement(AsylView, { palette: LIGHT_PALETTE, t, data: { basis: { canton: 'ZH' } }, onNavigate: () => {} }));

describe('Asyl & Schutz in der Schale', () => {
  it('sechs Schritte auf der Passstrasse, die bisherigen Abschnitte als Schritt-Titel', () => {
    const h = html();
    expect(h).toContain('data-ablauf="asyl"');
    expect(h).toContain('Schritt 1 von 6');
    expect(h).toContain('data-kehren="6"');
    for (const k of ['statusTitle', 'processTitle', 'rightsTitle', 'fristenTitle', 'orgsTitle', 'nextStepsTitle']) expect(h).toContain(esc(t('asyl.' + k)));
  });
  it('der ganze Inhalt bleibt: Einleitung, Hinweis, Status, Alltag, Verfahren, Rechte, Fristen, Stellen, Quelle', () => {
    const h = html();
    for (const k of ['intro', 'disclaimer', 'alltagTitle', 'fristenBody', 'fristenKalender', 'linkKkErst']) expect(h).toContain(esc(t('asyl.' + k)));
    for (const st of ASYL_STATUS) expect(h).toContain(esc(t('asyl.status.' + st.key + '.label')));
    for (const p of ASYL_PROCESS) expect(h).toContain(esc(t('asyl.process.' + p)));
    for (const r of ASYL_RIGHTS) expect(h).toContain(esc(t('asyl.rights.' + r)));
    for (const o of ASYL_ORGS) expect(h).toContain(esc(t('asyl.org.' + o.id)));
    expect(h).toContain('data-ablauf-verwandt');
    expect(h.indexOf('fedlex')).toBeGreaterThan(h.indexOf('data-ablauf-verwandt'));
  });
  it('Einleitung und Hinweis stehen oben, vor der Passstrasse', () => {
    const h = html();
    expect(h.indexOf(esc(t('asyl.disclaimer')))).toBeLessThan(h.indexOf('data-ablauf-pass'));
  });
});
