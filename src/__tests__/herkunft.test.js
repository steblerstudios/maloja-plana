import { describe, it, expect, beforeEach } from 'vitest';
import { setHash, replaceHash, leseHerkunft, merkeStelle, onHashChange } from '../utils/hashRouter.js';

// Entscheid 25.09.2026: Brotkrume + Herkunft. Wer aus einem Kapitel über einen Querverweis
// in ein Werkzeug springt, bekommt «Zurück zu Kapitel …». Die Zusage dahinter: die App
// weiss, woher man kam — und dieses «woher» ist genau der vorige Verlaufs-Eintrag, damit
// history.back() dorthin führt und nicht irgendwohin.

// Kleiner Verlauf wie im Browser: Einträge mit Zustand, ein Zeiger, back() wandert zurück.
const bauVerlauf = () => {
  const eintraege = [{ state: null, hash: '#/dashboard' }];
  let i = 0;
  const location = { get hash() { return eintraege[i].hash; } };
  const history = {
    get state() { return eintraege[i].state; },
    pushState(state, _t, hash) { eintraege.splice(i + 1); eintraege.push({ state, hash }); i += 1; },
    replaceState(state, _t, hash) { eintraege[i] = { state, hash: hash ?? eintraege[i].hash }; },
    back() { if (i > 0) i -= 1; },
  };
  const hoerer = {};
  return {
    location, history, scrollY: 0,
    addEventListener(typ, fn) { (hoerer[typ] = hoerer[typ] || []).push(fn); },
    removeEventListener(typ, fn) { hoerer[typ] = (hoerer[typ] || []).filter((f) => f !== fn); },
    dispatchEvent(typ) { (hoerer[typ] || []).forEach((fn) => fn()); },
  };
};

describe('Herkunft im Verlauf', () => {
  beforeEach(() => { globalThis.window = bauVerlauf(); });

  it('ein Wechsel merkt sich die Adresse davor', () => {
    setHash('chapter', 3);
    setHash('briefe', null);
    expect(leseHerkunft()).toEqual({ view: 'chapter', chapterIndex: 3 });
  });

  it('nach history.back() gilt die Herkunft des früheren Eintrags', () => {
    setHash('chapter', 3);
    setHash('briefe', null);
    window.history.back();
    expect(window.location.hash).toBe('#/chapter/3');
    expect(leseHerkunft()).toEqual({ view: 'dashboard', chapterIndex: null });
  });

  it('Direkteinstieg (Lesezeichen, erster Start) hat keine Herkunft', () => {
    replaceHash('briefe', null);
    expect(leseHerkunft()).toBeNull();
  });

  it('die Scroll-Stelle bleibt am verlassenen Eintrag und kommt mit «Zurück» wieder', () => {
    setHash('chapter', 4);
    window.scrollY = 573;
    merkeStelle();
    setHash('tax', null);
    let angekommen = null;
    const handler = onHashChange((p) => { angekommen = p; });
    window.history.back();
    window.dispatchEvent('popstate');
    handler();
    expect(angekommen).toEqual({ view: 'chapter', chapterIndex: 4, stelle: 573 });
    expect(leseHerkunft()).toEqual({ view: 'dashboard', chapterIndex: null });
  });

  it('fremder oder kaputter Verlaufs-Zustand wird ignoriert', () => {
    expect(leseHerkunft({ von: 42 })).toBeNull();
    expect(leseHerkunft({ von: '#/gibtsnicht' })).toBeNull();
    expect(leseHerkunft('unsinn')).toBeNull();
  });
});
