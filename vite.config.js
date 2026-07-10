import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// ─── PWA: Cache-Name an Bundle-Hash koppeln ────────────────────────────────
// Ersetzt '__BUILD_HASH__' in der ausgelieferten dist/sw.js durch den Hash des
// Entry-Bundles (z. B. index-1fb26e10.js → 1fb26e10). Dadurch ändern sich die
// sw.js-Bytes bei jedem Deploy garantiert → der Browser erkennt das SW-Update
// zuverlässig → activate räumt den alten Cache. Kein manuelles Hochzählen mehr.
// Zero-deps (nur node:fs/node:path), läuft nur beim Build.
function stampServiceWorkerCacheVersion() {
  let buildHash = '';
  return {
    name: 'maloja-stamp-sw-cache-version',
    apply: 'build',
    generateBundle(_options, bundle) {
      const entry = Object.values(bundle).find((c) => c.type === 'chunk' && c.isEntry);
      const match = entry?.fileName.match(/-([a-z0-9]+)\.js$/i);
      // Fallback: falls kein Hash im Namen (unerwartet), Zeitstempel — nie leer lassen.
      buildHash = match ? match[1] : Date.now().toString(36);
    },
    closeBundle() {
      const swPath = path.resolve(__dirname, 'dist/sw.js');
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
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
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
