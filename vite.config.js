import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// ─── PWA: Cache-Name an Bundle-Hash koppeln ────────────────────────────────
// Ersetzt '__BUILD_HASH__' in der ausgelieferten sw.js (im Ausgabeordner, auch mit
// --outDir) durch den Hash des Entry-Bundles (z. B. index-1fb26e10.js → 1fb26e10). Dadurch ändern sich die
// sw.js-Bytes bei jedem Deploy garantiert → der Browser erkennt das SW-Update
// zuverlässig → activate räumt den alten Cache. Kein manuelles Hochzählen mehr.
// Zero-deps (nur node:fs/node:path), läuft nur beim Build.
function stampServiceWorkerCacheVersion() {
  let buildHash = '';
  let outDir = '';
  return {
    name: 'maloja-stamp-sw-cache-version',
    apply: 'build',
    configResolved(config) {
      // K66: build.outDir ist relativ zu root (oder absolut) — nicht fest 'dist'.
      outDir = path.resolve(config.root, config.build.outDir);
    },
    generateBundle(_options, bundle) {
      const entry = Object.values(bundle).find((c) => c.type === 'chunk' && c.isEntry);
      // Seit Vite 5 ist der Hash base64url (A–Z, a–z, 0–9, _ und -), immer 8 Zeichen.
      // Vorher nur [a-z0-9] — das träfe ein «-» im Hash nicht und fiele still auf den
      // Zeitstempel zurück. Darum: genau die letzten 8 Zeichen vor «.js».
      const match = entry?.fileName.match(/-([A-Za-z0-9_-]{8})\.js$/);
      // Fallback: falls kein Hash im Namen (unerwartet), Zeitstempel — nie leer lassen.
      buildHash = match ? match[1] : Date.now().toString(36);
    },
    closeBundle() {
      const swPath = path.join(outDir, 'sw.js');
      if (!fs.existsSync(swPath)) return;
      const src = fs.readFileSync(swPath, 'utf8');
      if (!src.includes('__BUILD_HASH__')) return;
      fs.writeFileSync(swPath, src.replaceAll('__BUILD_HASH__', buildHash));
    },
  };
}

export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [react(), stampServiceWorkerCacheVersion()],
  server: {
    port: Number(process.env.PORT) || 5174,
    strictPort: true,
    host: '127.0.0.1',
    open: false,
  },
  test: {
    // `.claude/worktrees/*` sind vollstaendige Arbeitskopien des Repos. Sie sind
    // via .gitignore aus git raus, aber vitest kennt .gitignore nicht — ohne
    // dieses Exclude zaehlt `npm test` die Tests jeder offenen Parallel-Sitzung
    // mit (Zahlen vervielfacht, fremde halbfertige Branches faerben das
    // Ergebnis rot). Das Deploy-Gate muss nur diesen Arbeitsbaum messen.
    exclude: [...configDefaults.exclude, '**/.claude/**'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      // MESSUNG: zweite Seite baum3d.html nur in diesem Arbeitsbaum.
      input: { main: 'index.html', baum3d: 'baum3d.html' },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor';
          if (id.includes('data/plzGemeinde')) return 'plzGemeinde';
          if (id.includes('data/praemienDetail')) return 'praemienDetail';
        },
      },
    },
  },
});
