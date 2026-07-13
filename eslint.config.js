// ─── ESLint Flat Config (v9) ─────────────────────────────────────────────
// Bewusst schlank & signalstark (Prinzip „keine Bloat-Regeln"): die Basis-
// Empfehlungen von ESLint plus die zwei bewährten React-Hooks-Regeln. Keine
// experimentellen React-Compiler-Regeln, kein Prop-Types-Lärm — der Code nutzt
// grösstenteils React.createElement.
//
// Ausführen: `npm run lint`  (Flat-Config ersetzt das alte, in v9 entfernte --ext).
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  // Nicht linten: Build-Artefakte, Fremdcode, native Hülle.
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'ios/**',
      'src/vendor/**',
      'public/**',
      '**/*.min.js',
    ],
  },

  // Basis-Empfehlungen (fängt echte Fehler: no-undef, no-unreachable, …).
  js.configs.recommended,

  // Projektweite Anpassungen an die tatsächlichen Muster von Maloja:
  {
    rules: {
      // Leere catch-Blöcke sind hier Absicht (defensive localStorage-/Crypto-
      // Zugriffe: „im Fehlerfall still weiter, Daten bleiben lokal"). Andere leere
      // Blöcke bleiben ein Fehler.
      'no-empty': ['error', { allowEmptyCatch: true }],
      // Ungenutzte Namen als nicht-blockierende Warnung; führende `_` sind Absicht.
      // caughtErrors:'none' → ein `catch (e)` ohne Nutzung bleibt erlaubt (hilft beim
      // Debuggen). ignoreRestSiblings → `const { data, ...meta } = doc` (Weglass-Muster)
      // meldet `data` nicht als ungenutzt.
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrors: 'none',
        ignoreRestSiblings: true,
      }],
    },
  },

  // App-Code (Browser + ES-Module + JSX).
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: { 'react-hooks': reactHooks },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Regelverstösse gegen die Hooks-Reihenfolge = echte Bugs → Fehler.
      'react-hooks/rules-of-hooks': 'error',
      // Fehlende Effekt-Abhängigkeiten = Hinweis (nicht blockierend).
      'react-hooks/exhaustive-deps': 'warn',
      // no-unused-vars wird projektweit oben konfiguriert (inkl. caughtErrors/RestSiblings).
    },
  },

  // Node-Kontext: Vite-Konfig, Build-/Deploy-Skripte, diese Konfig selbst.
  {
    files: ['*.config.js', 'scripts/**/*.{js,mjs,cjs}'],
    languageOptions: {
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },

  // Tests: Vitest-Globals (describe/it/expect …) + Node.
  {
    files: ['src/**/__tests__/**/*.{js,jsx}', 'src/**/*.{test,spec}.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.node, ...globals.vitest },
    },
  },
];
