import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { beispielAusAdresse } from '../BetaGate.jsx';

// Plan «App nach /app/», PR 1 (Entscheid 26.10.2026): Dieselbe App läuft unter `/` und
// unter `/app/`. Heute sichtbar unverändert; erst PR 2 baut mit BASE_URL=/app/.
// Plan: maloja plana/_werkbank/vorstellungsseite/PLAN-app-nach-app.md

const WURZEL = fileURLToPath(new URL('../..', import.meta.url));
const SW = readFileSync(join(WURZEL, 'public/sw.js'), 'utf8');
const ORIGIN = 'https://malojaplana.ch';

function swUnter(scope) {
  const html = `<!doctype html><html><head>
<script src="${scope}theme-init.js"></script>
<script type="module" crossorigin src="${scope}assets/index-abc123.js"></script>
<link rel="stylesheet" crossorigin href="${scope}assets/index-789.css">
<link rel="icon" href="/assets/fremder-ordner.js">
</head><body></body></html>`;
  const abgelegt = new Set();
  const cache = {
    add: async (url) => { abgelegt.add(new URL(url, ORIGIN).pathname); },
    put: async (req) => { abgelegt.add(new URL(typeof req === 'string' ? req : req.url, ORIGIN).pathname); },
    match: async () => undefined,
  };
  const hoerer = {};
  const self = {
    location: { origin: ORIGIN },
    addEventListener: (typ, fn) => { hoerer[typ] = fn; },
    skipWaiting: () => {},
    clients: { claim: () => {} },
    registration: { scope: ORIGIN + scope },
  };
  let abgerufen = null;
  vm.runInNewContext(SW, {
    self, URL, Set, Promise, Array, console, Response: { error: () => ({}) },
    caches: { open: async () => cache, keys: async () => [], match: cache.match, delete: async () => true },
    fetch: async (url) => { abgerufen = url; return { ok: true, clone: () => ({ text: async () => html }) }; },
  });
  return { hoerer, abgelegt, abgerufen: () => abgerufen };
}

async function installieren(sw) {
  let p;
  sw.hoerer.install({ waitUntil: (x) => { p = x; } });
  await p;
}

describe('App pfadneutral: Service Worker folgt seinem Scope', () => {
  it('unter /app/ legt er nur Dateien aus /app/ ab und holt /app/ als Offline-Seite', async () => {
    const sw = swUnter('/app/');
    await installieren(sw);
    const pfade = [...sw.abgelegt];
    expect(sw.abgerufen()).toBe('/app/');
    expect(pfade).toEqual(expect.arrayContaining([
      '/app/', '/app/theme-init.js', '/app/fonts/lexend-latin-400-normal.woff2',
      '/app/assets/index-abc123.js', '/app/assets/index-789.css',
    ]));
    // Nichts von der Website daneben — auch nicht das, was wie ein Asset aussieht.
    expect(pfade.filter((p) => !p.startsWith('/app/'))).toEqual([]);
  });

  it('unter / bleibt alles wie bisher', async () => {
    const sw = swUnter('/');
    await installieren(sw);
    expect(sw.abgerufen()).toBe('/');
    expect([...sw.abgelegt]).toEqual(expect.arrayContaining(['/', '/theme-init.js', '/assets/index-abc123.js']));
  });
});

describe('App pfadneutral: keine festen Wurzel-Pfade im App-Code', () => {
  // Strings in JS schreibt Vite nicht um. Ein fester `/sw.js`, `/icon-…`, `/vendor/` oder
  // `/fonts/` bräche unter `/app/`. tokens.css und index.html schreibt Vite selbst um.
  // Seit PR 2 auch jede Datei mit Endung direkt unter der Wurzel ('/green-hosting-badge.png').
  const MUSTER = /['"`]\/((sw\.js|icon-\d|vendor\/|fonts\/|theme-init\.js|manifest\.json)|[\w.-]+\.(png|svg|ico|json|woff2|js|webp)['"`])/;
  const dateien = [];
  const sammeln = (ordner) => {
    for (const name of readdirSync(ordner)) {
      const pfad = join(ordner, name);
      if (statSync(pfad).isDirectory()) { if (name !== '__tests__') sammeln(pfad); }
      else if (/\.(js|jsx)$/.test(name) && !/\.test\./.test(name)) dateien.push(pfad);
    }
  };
  sammeln(join(WURZEL, 'src'));

  it('findet die App-Dateien überhaupt', () => {
    expect(dateien.length).toBeGreaterThan(50);
  });

  it('kein App-Skript nennt einen festen Wurzel-Pfad', () => {
    const treffer = dateien
      .flatMap((d) => readFileSync(d, 'utf8').split('\n').map((z, i) => [d.slice(WURZEL.length), i + 1, z]))
      .filter(([, , z]) => MUSTER.test(z) && !/^\s*(\/\/|\*)/.test(z))
      .map(([d, n]) => `${d}:${n}`);
    expect(treffer).toEqual([]);
  });

  it('der Service Worker meldet sich für den App-Ordner an, nicht für die ganze Website', () => {
    const quelle = readFileSync(join(WURZEL, 'src/utils/notifications.js'), 'utf8');
    expect(quelle).toMatch(/scope:\s*BASIS/);
    expect(quelle).not.toMatch(/scope:\s*['"]\/['"]/);
  });
});

describe('App pfadneutral: ?beispiel öffnet das Beispiel direkt', () => {
  const ort = (search, hash = '', pathname = '/app/') => ({ pathname, search, hash });

  it('ohne ?beispiel: nichts', () => {
    expect(beispielAusAdresse(ort(''))).toBeNull();
    expect(beispielAusAdresse(ort('?lang=fr'))).toBeNull();
    expect(beispielAusAdresse(null)).toBeNull();
  });

  it('mit ?beispiel: Zusatz weg, Pfad, übrige Zusätze und Anker bleiben', () => {
    expect(beispielAusAdresse(ort('?beispiel'))).toBe('/app/');
    expect(beispielAusAdresse(ort('?beispiel', '#/praemien'))).toBe('/app/#/praemien');
    expect(beispielAusAdresse(ort('?lang=fr&beispiel=1', '#/tax', '/'))).toBe('/?lang=fr#/tax');
  });

  it('die Wand ruft es beim ersten Bild auf und nimmt den Zusatz aus der Adresse', () => {
    const quelle = readFileSync(join(WURZEL, 'src/BetaGate.jsx'), 'utf8');
    expect(quelle).toMatch(/beispielAusAdresse\(\)[\s\S]{0,200}replaceState[\s\S]{0,120}startDemo\(\)/);
  });
});
