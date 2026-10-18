import { describe, it, expect, vi } from 'vitest';
import { sollNeuLaden, installiereNeuLadenNachDeploy, SPERRE_MS } from '../neuLadenNachDeploy.js';

function fensterAttrappe({ speicherWirft = false } = {}) {
  const hoerer = {};
  const ablage = new Map();
  return {
    addEventListener: (typ, fn) => { hoerer[typ] = fn; },
    sessionStorage: {
      getItem: (k) => { if (speicherWirft) throw new Error('gesperrt'); return ablage.has(k) ? ablage.get(k) : null; },
      setItem: (k, v) => { if (speicherWirft) throw new Error('gesperrt'); ablage.set(k, v); },
    },
    location: { reload: vi.fn() },
    ausloesen: () => hoerer['vite:preloadError']?.(),
  };
}

describe('sollNeuLaden', () => {
  it('lädt beim ersten Fehler neu', () => {
    expect(sollNeuLaden(1_000_000, NaN)).toBe(true);
    expect(sollNeuLaden(1_000_000, 0)).toBe(true);
  });
  it('lädt innert der Sperre nicht erneut', () => {
    expect(sollNeuLaden(1_000_000, 1_000_000 - SPERRE_MS + 1)).toBe(false);
  });
  it('lädt nach Ablauf der Sperre wieder', () => {
    expect(sollNeuLaden(1_000_000, 1_000_000 - SPERRE_MS)).toBe(true);
  });
});

describe('installiereNeuLadenNachDeploy', () => {
  it('lädt beim ersten fehlenden Programmteil genau einmal neu', () => {
    const f = fensterAttrappe();
    installiereNeuLadenNachDeploy(f);
    f.ausloesen();
    f.ausloesen();
    expect(f.location.reload).toHaveBeenCalledTimes(1);
  });
  it('lädt nie neu, wenn der Speicher gesperrt ist — keine Schleife', () => {
    const f = fensterAttrappe({ speicherWirft: true });
    installiereNeuLadenNachDeploy(f);
    f.ausloesen();
    expect(f.location.reload).not.toHaveBeenCalled();
  });
});
