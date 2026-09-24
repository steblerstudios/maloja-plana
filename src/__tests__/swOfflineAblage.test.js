import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// K59 (Bau-Liste §15): Gemessen am 17.09.2026 blieb die App nach dem ersten Besuch
// offline leer — Haupt-Skript, Stylesheet und Sprachdatei lagen nicht im Cache, und
// ein Server mit `Vary: Origin` liess den Cache zusätzlich ins Leere greifen.
// Der Service Worker läuft hier in einer Sandbox mit einem Cache-Fake.

const QUELLE = readFileSync(new URL('../../public/sw.js', import.meta.url), 'utf8');
const ORIGIN = 'https://malojaplana.ch';
const HTML = `<!doctype html><html><head>
<script src="/theme-init.js"></script>
<script type="module" crossorigin src="/assets/index-abc123.js"></script>
<link rel="modulepreload" crossorigin href="/assets/vendor-def456.js">
<link rel="stylesheet" crossorigin href="/assets/index-789.css">
<link rel="canonical" href="https://malojaplana.ch/">
<link rel="icon" href="https://fremd.example/assets/x.js">
</head><body><div id="root"></div></body></html>`;

function swLaden({ netz = true } = {}) {
  const abgelegt = new Map();
  const cache = {
    add: async (url) => { if (!netz) throw new Error('offline'); abgelegt.set(new URL(url, ORIGIN).pathname, 'inhalt'); },
    put: async (req, res) => { abgelegt.set(new URL(typeof req === 'string' ? req : req.url, ORIGIN).pathname, res); },
    match: async (req, opts) => {
      const pfad = new URL(typeof req === 'string' ? req : req.url, ORIGIN).pathname;
      if (!abgelegt.has(pfad)) return undefined;
      return (opts && opts.ignoreVary) ? { pfad } : undefined; // wie `Vary: Origin`
    },
  };
  const hoerer = {};
  const self = {
    location: { origin: ORIGIN },
    addEventListener: (typ, fn) => { hoerer[typ] = fn; },
    skipWaiting: () => {},
    clients: { claim: () => {} },
    registration: {},
  };
  const kontext = {
    self, URL, Set, Promise, Array, Response: { error: () => ({ fehler: true }) }, console,
    caches: { open: async () => cache, keys: async () => [], match: cache.match, delete: async () => true },
    fetch: async () => {
      if (!netz) throw new Error('offline');
      return { ok: true, clone: () => ({ text: async () => HTML }) };
    },
  };
  vm.runInNewContext(QUELLE, kontext);
  const warten = (ereignis) => {
    let p;
    ereignis.waitUntil = (x) => { p = x; };
    return { ereignis, fertig: () => p };
  };
  return { hoerer, abgelegt, cache, warten, kontext };
}

describe('Service Worker: Offline-Ablage nach dem ersten Besuch (K59)', () => {
  it('legt beim Install die Dateien ab, die die Startseite einbindet — nur eigene unter /assets/', async () => {
    const sw = swLaden();
    const { ereignis, fertig } = sw.warten({});
    sw.hoerer.install(ereignis);
    await fertig();
    const pfade = [...sw.abgelegt.keys()];
    expect(pfade).toEqual(expect.arrayContaining([
      '/', '/theme-init.js', '/assets/index-abc123.js', '/assets/vendor-def456.js', '/assets/index-789.css',
    ]));
    expect(pfade.filter((p) => p.startsWith('/assets/'))).toHaveLength(3); // nicht das fremde /assets/x.js
  });

  it('nimmt gemeldete Dateien nur an, wenn sie eigene /assets/ sind', async () => {
    const sw = swLaden();
    const { ereignis, fertig } = sw.warten({
      data: { type: 'assets-ablegen', adressen: [
        `${ORIGIN}/assets/de-111.js`,
        `${ORIGIN}/assets/de-111.js`,
        'https://fremd.example/assets/boese.js',
        `${ORIGIN}/sw.js`,
        'kein url ::',
      ] },
    });
    sw.hoerer.message(ereignis);
    await fertig();
    expect([...sw.abgelegt.keys()]).toEqual(['/assets/de-111.js']);
  });

  it('nimmt auch Bilder unter /assets/ an — den Logo-Schriftzug (E36)', async () => {
    // Seit dem 24.09.2026 liegt der Schriftzug des Logos nicht mehr im Bundle,
    // sondern als eigene Datei (src/components/marken-schriftzug.svg; 4,14 kB gzip
    // aus der Startdatei heraus). Offline ist er nur da, wenn ihn dieser Weg
    // mitnimmt — die Filterung fragt nach /assets/, nicht nach der Endung.
    // Ohne diesen Test wäre das eine Behauptung: im Browser-Pane lässt sich die
    // Registrierung eines Service Workers nicht ausführen (am 24.09. geprüft,
    // schlägt auf dem unveränderten Stand genauso fehl).
    const sw = swLaden();
    const { ereignis, fertig } = sw.warten({
      data: { type: 'assets-ablegen', adressen: [
        `${ORIGIN}/assets/marken-schriftzug-Du4ZOqH-.svg`,
        `${ORIGIN}/assets/index-abc123.js`,
      ] },
    });
    sw.hoerer.message(ereignis);
    await fertig();
    expect([...sw.abgelegt.keys()]).toContain('/assets/marken-schriftzug-Du4ZOqH-.svg');
  });

  it('ignoriert fremde Nachrichten', () => {
    const sw = swLaden();
    let gewartet = false;
    sw.hoerer.message({ data: { type: 'anderes' }, waitUntil: () => { gewartet = true; } });
    sw.hoerer.message({ data: null, waitUntil: () => { gewartet = true; } });
    expect(gewartet).toBe(false);
  });

  it('findet abgelegte Dateien trotz `Vary`, und liefert offline die Startseite nur für Seitenaufrufe', async () => {
    const sw = swLaden();
    sw.abgelegt.set('/assets/index-abc123.js', 'inhalt');
    sw.abgelegt.set('/', 'startseite');
    sw.kontext.fetch = async () => { throw new Error('offline'); };
    const antwort = async (url, mode) => {
      let r;
      sw.hoerer.fetch({ request: { method: 'GET', url: `${ORIGIN}${url}`, mode }, respondWith: (p) => { r = p; } });
      return r;
    };
    expect(await antwort('/assets/index-abc123.js', 'cors')).toEqual({ pfad: '/assets/index-abc123.js' });
    expect(await antwort('/', 'navigate')).toEqual({ pfad: '/' });
    expect(await antwort('/fonts/fehlt.woff2', 'cors')).toEqual({ fehler: true });
  });
});
