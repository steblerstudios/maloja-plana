import { describe, it, expect } from 'vitest';
import { vorstellungBauen } from '../../scripts/seiten/vorstellung.mjs';
import { BRILLEN } from '../../scripts/seiten/kantonsatlas.mjs';

// Kantonsatlas als Brückenstück, Teil B (Stebler Studios 09.11.2026, «Ja, A bis C bauen»): Die Website zeigt den
// Atlas als eigenen Abschnitt; jede Brille führt gefiltert hinein (/kantonsatlas/#fuer-<id>, Teil A in #803).
const html = vorstellungBauen();
const abschnitt = html.match(/<section id="atlas" aria-labelledby="t-atlas">[\s\S]*?<\/section>/)[0];

describe('Vorstellungsseite: Abschnitt Kantonsatlas', () => {
  it('steht zwischen «Ein Blick hinein» und «Holen»', () => {
    const i = (s) => html.indexOf(s);
    expect(i('id="t-blick"')).toBeLessThan(i('id="t-atlas"'));
    expect(i('id="t-atlas"')).toBeLessThan(i('id="t-holen"'));
  });

  it('jede Brille mit Name und Frage aus dem Atlas und einem Weg gefiltert hinein', () => {
    for (const b of BRILLEN) {
      expect(abschnitt, b.id).toContain(`<h3>${b.name}</h3><p>${b.frage}</p>`);
      expect(abschnitt, b.id).toContain(`<a href="/kantonsatlas/#fuer-${b.id}">`);
    }
  });

  it('die Zahl der Karten kommt aus den Brillen, ausgeschrieben wie «sieben Kapitel»', () => {
    expect(new Set(BRILLEN.flatMap((b) => b.karten)).size).toBe(10);
    expect(abschnitt).toContain('<a class="knopf zweit" href="/kantonsatlas/">Alle zehn Karten ansehen</a>');
    expect(abschnitt).toContain('zehn Karten der 26 Kantone');
  });

  it('die Wege in den Atlas sind gross genug zum Tippen (44 px)', () => {
    expect(html).toContain('#atlas .liste a{ display:inline-block; padding:13px 0 }');
  });

  it('verspricht nicht für jede Karte eine Rechnung (es gibt nicht zu jeder ein Werkzeug)', () => {
    expect(abschnitt).toContain('nicht Ihre eigene Lage');
    expect(abschnitt).not.toMatch(/rechnet Maloja/);
  });
});
