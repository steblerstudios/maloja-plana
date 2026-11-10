// Wischen zum Schliessen der Einstellungs-Schublade (10.11.2026).
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Ohne DOM-Testumgebung: ein kleiner Ersatz für useState/useRef, damit der Hook wie in einer
// Komponente läuft. `render()` zeichnet neu und liefert den aktuellen Stand.
const zustand = { slots: [], i: 0 };
vi.mock('react', async (orig) => {
  const echt = await orig();
  const useState = (start) => {
    const k = zustand.i++;
    if (!(k in zustand.slots)) zustand.slots[k] = typeof start === 'function' ? start() : start;
    return [zustand.slots[k], (v) => { zustand.slots[k] = typeof v === 'function' ? v(zustand.slots[k]) : v; }];
  };
  const useRef = (start) => { const [r] = useState(() => ({ current: start })); return r; };
  return { ...echt, default: { ...echt.default, useState, useRef }, useState, useRef };
});

const {
  useWischSchliessen, wischAchse, wischVersatz, wischSchliesst, WISCH_SCHWELLE,
} = await import('../hooks/useWischSchliessen.js');

describe('wischAchse', () => {
  it('unter der Schwelle: noch keine Richtung (ein Tipp)', () => {
    expect(wischAchse(WISCH_SCHWELLE - 1, 3)).toBe(null);
  });
  it('waagrecht überwiegt → x, senkrecht → y', () => {
    expect(wischAchse(30, 5)).toBe('x');
    expect(wischAchse(5, 30)).toBe('y');
  });
  it('Gleichstand: Scrollen gewinnt (ein falsches Schliessen ist teurer)', () => {
    expect(wischAchse(20, 20)).toBe('y');
    expect(wischAchse(-20, 20)).toBe('y');
  });
});

describe('wischVersatz — nur Richtung Ausgang', () => {
  it('rechts: nach rechts folgt sie, nach links bleibt sie am Rand', () => {
    expect(wischVersatz(80, 'right')).toBe(80);
    expect(wischVersatz(-80, 'right')).toBe(0);
  });
  it('links (Linkshänder-Modus): gespiegelt', () => {
    expect(wischVersatz(-80, 'left')).toBe(-80);
    expect(wischVersatz(80, 'left')).toBe(0);
  });
});

describe('wischSchliesst', () => {
  const breite = 288;
  it('ein Drittel der Breite reicht, auch langsam', () => {
    expect(wischSchliesst({ dx: 96, dt: 2000, breite, seite: 'right' })).toBe(true);
    expect(wischSchliesst({ dx: 95, dt: 2000, breite, seite: 'right' })).toBe(false);
  });
  it('ein schneller kurzer Schnipser reicht auch', () => {
    expect(wischSchliesst({ dx: 60, dt: 100, breite, seite: 'right' })).toBe(true);
  });
  it('in die falsche Richtung schliesst nie, egal wie weit oder schnell', () => {
    expect(wischSchliesst({ dx: -250, dt: 50, breite, seite: 'right' })).toBe(false);
    expect(wischSchliesst({ dx: 250, dt: 50, breite, seite: 'left' })).toBe(false);
  });
  it('links: nach links schliesst', () => {
    expect(wischSchliesst({ dx: -120, dt: 1000, breite, seite: 'left' })).toBe(true);
  });
  it('ohne Breite oder ohne Weg: nichts', () => {
    expect(wischSchliesst({ dx: 100, dt: 10, breite: 0, seite: 'right' })).toBe(false);
    expect(wischSchliesst({ dx: 0, dt: 10, breite, seite: 'right' })).toBe(false);
  });
});

describe('useWischSchliessen', () => {
  let zu, timerStand;
  const render = (seite = 'right') => { zustand.i = 0; return useWischSchliessen({ seite, onClose: zu }); };
  const ziel = (feld = null) => ({ closest: (sel) => (feld && sel.includes(feld) ? {} : null) });
  const panel = { getBoundingClientRect: () => ({ width: 288 }), setPointerCapture: vi.fn() };
  const ev = (x, y, t, mehr = {}) => ({
    pointerId: 1, pointerType: 'touch', isPrimary: true, clientX: x, clientY: y, timeStamp: t,
    target: ziel(), currentTarget: panel, preventDefault: vi.fn(), stopPropagation: vi.fn(), ...mehr,
  });
  const zug = (pfad, { seite = 'right', start = {} } = {}) => {
    const [x0, y0, t0] = pfad[0];
    render(seite).griffe.onPointerDown(ev(x0, y0, t0, start));
    for (const [x, y, t] of pfad.slice(1)) render(seite).griffe.onPointerMove(ev(x, y, t));
    const [x, y, t] = pfad[pfad.length - 1];
    render(seite).griffe.onPointerUp(ev(x, y, t));
  };

  beforeEach(() => {
    zustand.slots = []; zu = vi.fn(); vi.useFakeTimers();
    timerStand = globalThis.document;
    globalThis.document = { documentElement: { dataset: {} } };
    globalThis.window = globalThis.window || {};
  });
  afterEach(() => { vi.useRealTimers(); globalThis.document = timerStand; });

  it('weit genug nach rechts gewischt: gleitet hinaus, dann zu', () => {
    zug([[100, 300, 0], [130, 302, 50], [250, 305, 600]]);
    expect(render().stil.transform).toBe('translateX(288px)');
    expect(zu).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(zu).toHaveBeenCalledTimes(1);
  });

  it('folgt während des Ziehens dem Finger, ohne Verzögerung', () => {
    render().griffe.onPointerDown(ev(100, 300, 0));
    render().griffe.onPointerMove(ev(160, 302, 200));
    const s = render().stil;
    expect(s.transform).toBe('translateX(60px)');
    expect(s.transition).toBe('none');
  });

  it('zu kurz losgelassen: gleitet zurück auf 0 (mit Übergang), bleibt offen', () => {
    zug([[100, 300, 0], [130, 300, 400], [140, 300, 900]]);
    const s = render().stil;
    expect(s.transform).toBe('translateX(0px)');
    expect(s.transition).toMatch(/^transform \d+ms/);
    vi.runAllTimers();
    expect(zu).not.toHaveBeenCalled();
  });

  it('senkrecht = Scrollen: die Schublade bewegt sich nicht, auch wenn es danach waagrecht weitergeht', () => {
    zug([[100, 300, 0], [102, 340, 50], [250, 345, 100]]);
    expect(render().stil.transform).toBe('translateX(0px)');
    vi.runAllTimers();
    expect(zu).not.toHaveBeenCalled();
  });

  it('mit der Maus: kein Wisch (man zieht Text, keine Schubladen)', () => {
    zug([[100, 300, 0], [250, 300, 50]], { start: { pointerType: 'mouse' } });
    vi.runAllTimers();
    expect(zu).not.toHaveBeenCalled();
  });

  it('auf einem Regler oder Auswahlfeld begonnen: kein Wisch', () => {
    zug([[100, 300, 0], [250, 300, 50]], { start: { target: ziel('input') } });
    vi.runAllTimers();
    expect(zu).not.toHaveBeenCalled();
  });

  it('vom Browser abgebrochen (pointercancel): zurück, nicht zu', () => {
    render().griffe.onPointerDown(ev(100, 300, 0));
    render().griffe.onPointerMove(ev(250, 300, 50));
    render().griffe.onPointerCancel(ev(250, 300, 60));
    vi.runAllTimers();
    expect(zu).not.toHaveBeenCalled();
    expect(render().stil.transform).toBe('translateX(0px)');
  });

  it('reduzierte Bewegung (App-Schalter): sofort zu, ohne Hinausgleiten', () => {
    globalThis.document.documentElement.dataset.reduceMotion = '1';
    zug([[100, 300, 0], [250, 300, 600]]);
    expect(zu).toHaveBeenCalledTimes(1);
  });

  it('Linkshänder-Modus: nach links wischen schliesst, nach rechts nicht', () => {
    zug([[200, 300, 0], [80, 300, 600]], { seite: 'left' });
    vi.runAllTimers();
    expect(zu).toHaveBeenCalledTimes(1);
    zustand.slots = []; zu.mockClear();
    zug([[80, 300, 0], [260, 300, 100]], { seite: 'left' });
    vi.runAllTimers();
    expect(zu).not.toHaveBeenCalled();
  });

  it('der Klick nach einem Wisch legt keinen Schalter um; ein gewöhnlicher Tipp schon', () => {
    zug([[100, 300, 0], [140, 300, 400], [150, 300, 900]]); // zurückgeglitten, Schublade offen
    const klick = ev(150, 300, 901);
    render().griffe.onClickCapture(klick);
    expect(klick.stopPropagation).toHaveBeenCalled();
    expect(klick.preventDefault).toHaveBeenCalled();
    // Danach ein Tipp ohne Bewegung: der Klick geht durch.
    zug([[100, 300, 1000], [102, 301, 1050]]);
    const tipp = ev(102, 301, 1051);
    render().griffe.onClickCapture(tipp);
    expect(tipp.stopPropagation).not.toHaveBeenCalled();
  });
});

describe('Einbau', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'MobileNav.jsx'), 'utf8');
  it('der Hook steht vor dem frühen return (Regel der Hooks)', () => {
    expect(src.indexOf('useWischSchliessen({')).toBeGreaterThan(0);
    expect(src.indexOf('if (!isOpen) return null;')).toBeGreaterThan(src.indexOf('useWischSchliessen({'));
  });
  it('nur die Einstellungs-Schublade wischt, nicht das ganzseitige Menü', () => {
    expect(src.match(/\.\.\.wisch\.griffe/g)).toHaveLength(1);
    const settings = src.indexOf("if (mode === 'settings')");
    expect(src.indexOf('...wisch.griffe')).toBeGreaterThan(settings);
    expect(src.indexOf('...wisch.griffe')).toBeLessThan(src.indexOf("'aria-label': t('nav.menu')"));
  });
});
