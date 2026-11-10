#!/usr/bin/env node
// Build für malojaplana.ch: Website auf `/`, App unter `/app/`.
// Plan «App nach /app/», PR 2 (Entscheid 26.10.2026). Aufruf: `npm run build`.
//
//   dist/                 Website: Erklärseiten, Rechtliches, robots, sitemap, 404,
//                         Schriften, Favicons, og-image … (alles aus public/ ausser App-Hülle)
//   dist/index.html       Wurzelseite aus website/index.html (PR 3: Vorstellungsseite)
//   dist/weiterleitung.js alte Links `/#/…`, `/?lang=` → `/app/…`
//   dist/sw.js            Abschieds-Service-Worker (website/sw-abschied.js)
//   dist/app/             die App (Vite, base '/app/') mit ihrer Hülle aus APP_HUELLE
//
// public/ bleibt EINE Quelle. Was die App braucht, steht unten als Erlaubnisliste —
// alles andere kommt aus dem App-Ordner wieder raus. Für iOS: `npm run build:ios`.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Was die App unter /app/ aus public/ braucht (belegt am Code, 09.11.2026: index.html,
// manifest.json, sw.js, notifications.js, kkScanner.js, qrSicher.js, LegalView.jsx, tokens.css).
export const APP_HUELLE = [
  'sw.js', 'manifest.json', 'theme-init.js', 'vendor', 'fonts',
  'app-icon.svg', 'apple-touch-icon.png', 'favicon.ico', 'favicon.svg',
  'icon-192.png', 'icon-512.png', 'icon-maskable-192.png', 'icon-maskable-512.png',
  'green-hosting-badge.png',
];

// Gehört nur der App — auf der Wurzel stünde sonst ein zweiter Service Worker bzw.
// ein Manifest, das sich als App ausgibt.
export const NUR_APP = ['sw.js', 'manifest.json', 'theme-init.js', 'vendor'];

// Aus website/ in die Wurzel: Quelle → Ziel.
export const WEBSITE = [
  ['index.html', 'index.html'],
  ['weiterleitung.js', 'weiterleitung.js'],
  ['reise.js', 'reise.js'],
  ['sw-abschied.js', 'sw.js'],
];

const kopieren = (von, nach) => fs.cpSync(von, nach, { recursive: true });

/**
 * Stellt die Website um einen fertigen App-Build herum zusammen.
 * Erwartet `ziel/app/` aus Vite (mit allen public/-Dateien, wie Vite sie kopiert).
 */
export function zusammenstellen({ publicOrdner, websiteOrdner, ziel }) {
  const appOrdner = path.join(ziel, 'app');
  if (!fs.existsSync(path.join(appOrdner, 'index.html'))) {
    throw new Error(`${appOrdner}/index.html fehlt — zuerst den App-Build laufen lassen`);
  }
  const huelle = new Set(APP_HUELLE);
  const nurApp = new Set(NUR_APP);
  for (const name of fs.readdirSync(publicOrdner)) {
    // App-Ordner: nur die Hülle behalten.
    if (!huelle.has(name)) fs.rmSync(path.join(appOrdner, name), { recursive: true, force: true });
    // Wurzel: alles ausser der App-Hülle.
    if (!nurApp.has(name)) kopieren(path.join(publicOrdner, name), path.join(ziel, name));
  }
  for (const [quelle, datei] of WEBSITE) {
    kopieren(path.join(websiteOrdner, quelle), path.join(ziel, datei));
  }
  return { appOrdner };
}

async function main() {
  const ziel = path.join(WURZEL, 'dist');
  fs.rmSync(ziel, { recursive: true, force: true });
  process.env.BASE_URL = '/app/';
  const { build } = await import('vite');
  await build({ root: WURZEL, build: { outDir: path.join(ziel, 'app'), emptyOutDir: true } });
  zusammenstellen({ publicOrdner: path.join(WURZEL, 'public'), websiteOrdner: path.join(WURZEL, 'website'), ziel });
  console.log('✓ Website in dist/, App in dist/app/');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((fehler) => { console.error(fehler); process.exit(1); });
}
