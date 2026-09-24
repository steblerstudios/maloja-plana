// E36: Platz im Hauptbundle. Diese Tests halten zwei Dinge fest:
// 1. main.jsx importiert kein Modul statisch, das es zugleich per React.lazy
//    nachlädt — sonst landet die ganze Komponente trotzdem im Hauptbundle
//    (so lagen Onboarding.jsx und Tour.jsx drin, nur wegen isOnboardingDone/isTourDone).
// 2. Die nachgeladenen Module laden weiter und liefern, was main.jsx braucht;
//    die Status-Funktionen verhalten sich wie vorher.
import { describe, it, expect, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { isOnboardingDone, isTourDone, markTourDone } from '../utils/einfuehrungStatus.js';

const mainJsx = readFileSync(new URL('../main.jsx', import.meta.url), 'utf8');

const lazyZiele = [...mainJsx.matchAll(/React\.lazy\(\s*\(\)\s*=>\s*import\(\s*'([^']+)'\s*\)/g)].map((m) => m[1]);
const statischeZiele = [...mainJsx.matchAll(/^import\s[^;]*?from\s+'([^']+)'/gm)].map((m) => m[1]);

function speicher(start = {}) {
  const daten = { ...start };
  return {
    getItem: (k) => (k in daten ? daten[k] : null),
    setItem: (k, v) => { daten[k] = String(v); },
    daten,
  };
}

afterEach(() => { vi.unstubAllGlobals(); });

describe('Hauptbundle: kein statischer Import von Lazy-Modulen (E36)', () => {
  it('findet die Lazy-Importe überhaupt (Muster greift)', () => {
    expect(lazyZiele).toContain('./Onboarding.jsx');
    expect(lazyZiele).toContain('./Tour.jsx');
    expect(statischeZiele).toContain('./Dashboard.jsx');
  });

  it('kein Lazy-Modul wird in main.jsx zusätzlich statisch importiert', () => {
    const doppelt = lazyZiele.filter((z) => statischeZiele.includes(z));
    expect(doppelt).toEqual([]);
  });
});

// Zeitgrenze 30 s: der dynamische Import übersetzt Onboarding.jsx samt Abhängigkeiten
// im Test selbst. Unter Last lag das bei 5,0–5,3 s und fiel als Timeout rot (24.09.2026).
describe('Onboarding und Tour laden weiter nach (E36)', { timeout: 30_000 }, () => {
  it('Onboarding.jsx liefert die Komponente und weiter isOnboardingDone', async () => {
    const m = await import('../Onboarding.jsx');
    expect(typeof m.Onboarding).toBe('function');
    expect(m.isOnboardingDone).toBe(isOnboardingDone);
  });

  it('Tour.jsx liefert die Komponente und weiter isTourDone/markTourDone', async () => {
    const m = await import('../Tour.jsx');
    expect(typeof m.Tour).toBe('function');
    expect(m.isTourDone).toBe(isTourDone);
    expect(m.markTourDone).toBe(markTourDone);
  });
});

describe('einfuehrungStatus: gleiche Schlüssel, gleiches Verhalten', () => {
  it('liest or5_onboarding_done und or5_tour_done', () => {
    vi.stubGlobal('localStorage', speicher({ or5_onboarding_done: 'true' }));
    expect(isOnboardingDone()).toBe(true);
    expect(isTourDone()).toBe(false);
  });

  it('markTourDone schreibt or5_tour_done = "true"', () => {
    const s = speicher();
    vi.stubGlobal('localStorage', s);
    markTourDone();
    expect(s.daten.or5_tour_done).toBe('true');
    expect(isTourDone()).toBe(true);
  });

  it('gesperrter Speicher → false, kein Fehler', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('gesperrt'); },
      setItem: () => { throw new Error('gesperrt'); },
    });
    expect(isOnboardingDone()).toBe(false);
    expect(isTourDone()).toBe(false);
    expect(() => markTourDone()).not.toThrow();
  });
});
