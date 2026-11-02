import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { STIPENDIEN_KANTONE_URL, STIPENDIEN_OFFICIAL } from '../data/stipendienData.js';
import { StipendienView } from '../StipendienView.jsx';

const KANTONE = 'AG AI AR BE BL BS FR GE GL GR JU LU NE NW OW SG SH SO SZ TG TI UR VD VS ZG ZH'.split(' ');
// Amtliche Domain je Kanton: eine fremde Adresse darf hier nie als Stipendienstelle erscheinen.
const DOMAIN = { BL: 'baselland.ch', JU: 'jura.ch' };

const palette = new Proxy({}, { get: () => '#000000' });
const t = (k, v) => (v?.canton ? `${k}:${v.canton}` : k);
const render = (canton) => renderToStaticMarkup(
  React.createElement(StipendienView, { palette, t, data: { basis: { canton } } }),
);

describe('Stipendienstelle je Kanton', () => {
  it('alle 26 Kantone und keine weiteren', () => {
    expect(Object.keys(STIPENDIEN_KANTONE_URL).sort()).toEqual(KANTONE);
  });

  it.each(KANTONE)('%s: https auf der amtlichen Domain', (k) => {
    const url = new URL(STIPENDIEN_KANTONE_URL[k]);
    expect(url.protocol).toBe('https:');
    const domain = DOMAIN[k] || `${k.toLowerCase()}.ch`;
    expect(url.hostname === domain || url.hostname.endsWith(`.${domain}`)).toBe(true);
  });

  it('mit Kanton: direkter Link, und das EDK-Verzeichnis bleibt für einen anderen Elternkanton', () => {
    const html = render('BS');
    expect(html).toContain(STIPENDIEN_KANTONE_URL.BS);
    expect(html).toContain(STIPENDIEN_OFFICIAL.edkCantonalOffices);
  });

  it('ohne Kanton: nur das EDK-Verzeichnis', () => {
    const html = render('');
    expect(html).toContain(STIPENDIEN_OFFICIAL.edkCantonalOffices);
    expect(html).not.toContain('stip.officeLink');
  });
});
