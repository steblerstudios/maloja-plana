import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { zusammenstellen, APP_HUELLE, NUR_APP } from '../../scripts/build-web.mjs';
import { altenWurzelSwAbmelden } from '../utils/notifications.js';

// Plan «App nach /app/», PR 2: Website auf `/`, App unter `/app/`.
// Plan: maloja plana/_werkbank/vorstellungsseite/PLAN-app-nach-app.md

const WURZEL = fileURLToPath(new URL('../..', import.meta.url));
const lies = (datei) => fs.readFileSync(path.join(WURZEL, datei), 'utf8');

function baum(wurzel, dateien) {
  for (const [datei, inhalt] of Object.entries(dateien)) {
    fs.mkdirSync(path.dirname(path.join(wurzel, datei)), { recursive: true });
    fs.writeFileSync(path.join(wurzel, datei), inhalt);
  }
}

describe('Build: Website und App getrennt zusammenstellen', () => {
  const PUBLIC = {
    'sw.js': 'app-sw', 'manifest.json': '{}', 'theme-init.js': 't', 'vendor/jsQR.js': 'q',
    'fonts/a.woff2': 'f', 'icon-192.png': 'i', '.htaccess': 'h', 'robots.txt': 'r',
    'sitemap.xml': 's', 'krankenkasse/index.html': 'k', '404.html': '4',
  };

  function aufbauen() {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'maloja-web-'));
    const pub = path.join(tmp, 'public');
    const web = path.join(tmp, 'website');
    const ziel = path.join(tmp, 'dist');
    baum(pub, PUBLIC);
    // Vite kopiert ganz public/ in den App-Ordner — genau das räumt zusammenstellen auf.
    baum(path.join(ziel, 'app'), { ...PUBLIC, 'index.html': 'app', 'assets/index-x.js': 'js' });
    baum(web, { 'index.html': 'platzhalter', 'weiterleitung.js': 'w', 'sw-abschied.js': 'abschied' });
    zusammenstellen({ publicOrdner: pub, websiteOrdner: web, ziel });
    const da = (p) => fs.existsSync(path.join(ziel, p));
    return { ziel, da, lies: (p) => fs.readFileSync(path.join(ziel, p), 'utf8') };
  }

  it('im App-Ordner bleibt nur die App-Hülle', () => {
    const { da } = aufbauen();
    for (const p of ['app/index.html', 'app/assets/index-x.js', 'app/sw.js', 'app/manifest.json',
      'app/theme-init.js', 'app/vendor/jsQR.js', 'app/fonts/a.woff2', 'app/icon-192.png']) expect(da(p), p).toBe(true);
    for (const p of ['app/krankenkasse', 'app/robots.txt', 'app/sitemap.xml', 'app/.htaccess', 'app/404.html']) {
      expect(da(p), p).toBe(false);
    }
  });

  it('auf der Wurzel steht die Website, ohne zweiten App-Service-Worker und ohne App-Manifest', () => {
    const { da, lies: l } = aufbauen();
    for (const p of ['krankenkasse/index.html', 'robots.txt', 'sitemap.xml', '404.html', 'fonts/a.woff2', 'weiterleitung.js']) {
      expect(da(p), p).toBe(true);
    }
    expect(l('index.html')).toBe('platzhalter');
    expect(l('sw.js')).toBe('abschied');
    expect(da('manifest.json')).toBe(false);
    expect(da('theme-init.js')).toBe(false);
    expect(da('vendor')).toBe(false);
  });

  it('jede Datei der App-Hülle gibt es in public/', () => {
    for (const name of APP_HUELLE) expect(fs.existsSync(path.join(WURZEL, 'public', name)), name).toBe(true);
    for (const name of NUR_APP) expect(APP_HUELLE).toContain(name);
  });

  it('ohne App-Build bricht das Zusammenstellen ab, statt eine halbe Website zu liefern', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'maloja-web-'));
    expect(() => zusammenstellen({ publicOrdner: tmp, websiteOrdner: tmp, ziel: path.join(tmp, 'dist') })).toThrow(/App-Build/);
  });
});

describe('Abschieds-Service-Worker unter /sw.js', () => {
  function laufen() {
    const hoerer = {};
    const geloescht = [];
    const navigiert = [];
    const self = {
      addEventListener: (typ, fn) => { hoerer[typ] = fn; },
      skipWaiting: vi.fn(),
      registration: { unregister: vi.fn(async () => true) },
      clients: { matchAll: async () => [{ url: 'https://malojaplana.ch/', navigate: async (u) => navigiert.push(u) }] },
    };
    const caches = {
      keys: async () => ['maloja-plana-abc12345', 'maloja-plana-app-xyz98765', 'fremder-cache'],
      delete: async (n) => { geloescht.push(n); return true; },
    };
    vm.runInNewContext(lies('website/sw-abschied.js'), { self, caches, Promise });
    return { hoerer, self, geloescht, navigiert };
  }

  it('räumt nur die Caches des alten Wurzel-SW, meldet sich ab und lädt offene Fenster neu', async () => {
    const sw = laufen();
    let fertig;
    sw.hoerer.activate({ waitUntil: (p) => { fertig = p; } });
    await fertig;
    expect(sw.geloescht).toEqual(['maloja-plana-abc12345']);
    expect(sw.self.registration.unregister).toHaveBeenCalled();
    expect(sw.navigiert).toEqual(['https://malojaplana.ch/']);
  });

  it('fängt keine Anfragen ab', () => {
    const sw = laufen();
    expect(sw.hoerer.fetch).toBeUndefined();
    expect(sw.hoerer.install).toBeTypeOf('function');
  });

  it('der App-SW hat einen eigenen Cache-Präfix, den der Abschieds-SW stehen lässt', () => {
    expect(lies('public/sw.js')).toMatch(/CACHE_PRAEFIX = 'maloja-plana-app-'/);
  });
});

describe('Wurzel: Vorstellungsseite, Weiterleitung nur für App-Adressen (PR 3)', () => {
  const weiter = (search, hash, installiert = false) => {
    const ziele = [];
    vm.runInNewContext(lies('website/weiterleitung.js'), {
      location: { search, hash, replace: (u) => ziele.push(u) },
      window: { matchMedia: () => ({ matches: installiert }), addEventListener: () => {} },
      navigator: {},
    });
    return ziele[0] ?? null;
  };

  it('alte App-Links gehen mit Zusätzen und Anker nach /app/', () => {
    expect(weiter('?lang=fr', '#/tax')).toBe('/app/?lang=fr#/tax');
    expect(weiter('', '#/praemien')).toBe('/app/#/praemien');
    expect(weiter('?beispiel', '')).toBe('/app/?beispiel');
  });

  it('wechselt auf der Website nur der Anker zu #/…, geht es ebenfalls in die App', () => {
    const ziele = [];
    const hoerer = {};
    const location = { search: '', hash: '', replace: (u) => ziele.push(u) };
    vm.runInNewContext(lies('website/weiterleitung.js'), {
      location, navigator: {},
      window: { matchMedia: () => ({ matches: false }), addEventListener: (t, fn) => { hoerer[t] = fn; } },
    });
    expect(ziele).toEqual([]);
    location.hash = '#holen'; hoerer.hashchange();
    expect(ziele).toEqual([]);
    location.hash = '#/tax'; hoerer.hashchange();
    expect(ziele).toEqual(['/app/#/tax']);
  });

  it('die installierte App (startete bis zum Umzug auf /) landet in der App', () => {
    expect(weiter('', '', true)).toBe('/app/');
  });

  it('wer die Website öffnet, bleibt dort — auch mit Seiten-Anker oder fremdem Zusatz', () => {
    expect(weiter('', '')).toBeNull();
    expect(weiter('', '#holen')).toBeNull();
    expect(weiter('?utm_source=x', '')).toBeNull();
    expect(weiter('?language=fr', '')).toBeNull();
  });

  it('der Platzhalter ist weg, die Deploy-Sperre bleibt als Netz', () => {
    expect(lies('website/index.html')).not.toContain('data-platzhalter');
    expect(lies('website/index.html')).toContain('<script src="/weiterleitung.js"></script>');
    expect(lies('deploy.sh')).toMatch(/STAGE" != "1" \] && grep -q 'data-platzhalter="uebergang"' dist\/index\.html[\s\S]{0,400}exit 1/);
  });

  it('deploy.sh räumt app/assets auf, nie die Wurzel', () => {
    const d = lies('deploy.sh');
    expect(d).toContain('mirror -R --delete --verbose ./dist/app/assets/');
    expect(d).not.toContain('mirror -R --delete --verbose ./dist/assets/');
    expect(d).not.toMatch(/mirror -R --delete --verbose \.\/dist\/ /);
  });
});

describe('App unter /app/: Kopf, Manifest, alter Service Worker', () => {
  it('die App ist nicht indexiert und zeigt auf /app/', () => {
    const html = lies('index.html');
    expect(html).toContain('<meta name="robots" content="noindex, follow">');
    expect(html).toContain('<link rel="canonical" href="https://malojaplana.ch/app/">');
  });

  it('Manifest: id bleibt «/» (sonst gilt die installierte App als fremd), Bilder relativ', () => {
    const m = JSON.parse(lies('public/manifest.json'));
    expect(m.id).toBe('/');
    expect(m.start_url).toBe('.');
    const quellen = [...m.icons, ...m.shortcuts.flatMap((s) => s.icons)].map((i) => i.src);
    expect(quellen.filter((q) => q.startsWith('/'))).toEqual([]);
  });

  it('die App meldet nur den alten Wurzel-SW ab, nicht ihren eigenen', async () => {
    const regs = ['https://malojaplana.ch/', 'https://malojaplana.ch/app/'].map((scope) => ({ scope, unregister: vi.fn() }));
    const anzahl = await altenWurzelSwAbmelden({ getRegistrations: async () => regs }, 'https://malojaplana.ch');
    expect(anzahl).toBe(1);
    expect(regs[0].unregister).toHaveBeenCalled();
    expect(regs[1].unregister).not.toHaveBeenCalled();
    expect(await altenWurzelSwAbmelden(undefined, 'x')).toBe(0);
  });

  it('size-limit misst das Startbündel unter dist/app/', () => {
    expect(JSON.parse(lies('package.json'))['size-limit'][0].path).toBe('dist/app/assets/index-*.js');
  });
});
