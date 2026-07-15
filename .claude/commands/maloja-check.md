---
description: Schneller lokaler Qualitäts-Loop — Tests, Build, Bundle-Grösse, i18n-Parität (5 Sprachen), CSP. Read-only Bericht, deployt/committet nichts.
argument-hint: (optional) Fokus, z.B. "nur i18n" oder "nur tests"
allowed-tools: Bash, Read, Grep, Glob
---

Führe den schnellen **Maloja-Qualitäts-Loop** aus. Das ist ein read-only Gate: nichts committen, nichts deployen, keine App-Dateien ändern. Am Ende ein knapper, priorisierter Bericht.

Reihenfolge (überspringe Schritte nur, wenn `$ARGUMENTS` einen Fokus vorgibt):

1. `git status`; LIVE-Marker aus `SESSION_START.md` lesen, dann `git log --oneline <LIVE>..HEAD | wc -l` → wie viele Commits über LIVE.
2. `npm test -- --run` → Testzahl + alle grün? Fehlschläge exakt zitieren.
3. `npm run build` → läuft durch? Warnungen/Errors zitieren.
4. `npm run size` → Bundle im Budget?
5. **i18n-Parität (5 Sprachen de/fr/it/rm/en):** Fehlen Keys in einer Sprache? Der Test `src/i18n/__tests__/i18n.test.js` deckt das teils ab — bestätige, und greppe bei Verdacht die Chunk-Dateien (`de-*.js` etc. im Build) auf fehlende Übersetzungen. Nenne fehlende Keys pro Sprache.
6. **CSP self-only:** Stichprobe auf externe URLs/CDNs/Fonts in `src/` und `index.html`.

Bericht: ✅ Grün (mit Zahlen) · ⚠️ Flags (Datei:Zeile + Fix) · 🔴 Blocker. Stebler Studios entscheidet, was umgesetzt wird — schlag nichts automatisch als „erledigt" vor, was nicht verifiziert ist.
