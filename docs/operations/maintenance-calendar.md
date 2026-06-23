# Wartungskalender — Maloja Plana

> Regelmässige Aufgaben, damit die App aktuell, sicher und funktional bleibt.
> Benachrichtigung: Automatisch via GitHub Actions an info@steblerstudios.ch

---

## Januar — Datenquellen-Update (Priorität: hoch)

| Aufgabe | Quelle | Betroffene Dateien | Aufwand |
|---|---|---|---|
| BAG Prämien 2027 importieren | priminfo.admin.ch | `src/data/praemienDetail.js` | 30 Min (Script: `scripts/build-praemien-detail.mjs`) |
| BAG IPV-Modelle prüfen | ch.ch/de/gesundheit | `src/premiumCalc.js` (kantonale Modelle) | 15 Min |
| BFS Medianlöhne prüfen | bfs.admin.ch LSE | `src/data/branchenLohn.js` (alle 2 Jahre) | 15 Min |
| SKOS Grundbedarf prüfen | skos.ch Richtlinien | `src/data/sozialhilfeRechner.js` | 10 Min |
| Bundessteuer-Tarife prüfen | estv.admin.ch | `src/TaxCalculator.jsx` | 15 Min |
| BVG-Grenzwerte prüfen | bsv.admin.ch | `src/VorsorgeRechner.jsx` (Koordinationsabzug, Eintrittsschwelle) | 10 Min |
| 3a-Maximalbetrag prüfen | bsv.admin.ch | `src/VorsorgeRechner.jsx`, `src/TaxCalculator.jsx` | 5 Min |
| EO-Taggeld-Maximum prüfen | bsv.admin.ch | `src/EOrechner.jsx` | 5 Min |

**Geschätzter Gesamtaufwand Januar:** 1.5–2 Stunden

---

## Quartalsweise (März, Juni, September, Dezember)

| Aufgabe | Details | Aufwand |
|---|---|---|
| `npm audit` | Sicherheitslücken in Dependencies prüfen | 10 Min |
| Vite/React Versionen prüfen | Major-Updates evaluieren, Minor/Patch einspielen | 15 Min |
| Kantonal Links stichprobenartig prüfen | 5 zufällige Links aus `src/data/direktLinks.js` öffnen | 10 Min |
| GitHub Actions Status prüfen | CI/Deploy Workflows grün? | 5 Min |
| Bundle-Grösse prüfen | `npm run build` — kein Chunk > 300KB gzip | 5 Min |

**Geschätzter Gesamtaufwand pro Quartal:** 45 Minuten

---

## Jährlich (Juni) — Grosser Review

| Aufgabe | Details | Aufwand |
|---|---|---|
| Alle kantonalen Links prüfen | ~50 Links in `direktLinks.js` + `premiumCalc.js` | 1 Stunde |
| Browser-Kompatibilität testen | Safari, Chrome, Firefox — Desktop + Mobile | 30 Min |
| Lighthouse-Audit | Performance, A11y, SEO, PWA | 30 Min |
| Übersetzungen Stichprobe | FR/IT/EN je 10 Screens stichprobenartig prüfen | 30 Min |
| Service Worker Cache-Version prüfen | `sw.js` CACHE_NAME aktuell? | 5 Min |
| known-issues-beta.md aktualisieren | Neue Issues, erledigte streichen | 15 Min |
| Audit-Log nachführen | `docs/governance/audit-log.md` | 15 Min |

**Geschätzter Gesamtaufwand jährlich:** 3 Stunden

---

## Bei Bedarf

| Trigger | Aufgabe |
|---|---|
| Neue Kantonsregelung (IPV, Sozialhilfe) | Betroffenen Kanton in `premiumCalc.js` / `sozialhilfeRechner.js` aktualisieren |
| Browser bricht Feature-Support | Polyfill oder Workaround evaluieren |
| User meldet Bug | Issue erstellen, priorisieren, fixen |
| Neue SKOS-Richtlinien | `sozialhilfeRechner.js` Grundbedarfswerte anpassen |
| Gesetzesänderung (nDSG etc.) | `docs/legal/` Texte prüfen, LegalView aktualisieren |

---

## Datenquellen-Versionsregister

| Quelle | Aktueller Stand | Letzte Prüfung | Nächste Prüfung |
|---|---|---|---|
| BAG Prämien | 2026 | 2026-06 | 2027-01 |
| BFS Medianlöhne (LSE) | 2022 | 2026-06 | 2027-06 |
| SKOS Grundbedarf | 2026 | 2026-06 | 2027-01 |
| Bundessteuer-Tarife | 2026 | 2026-06 | 2027-01 |
| BVG-Grenzwerte | 2026 | 2026-06 | 2027-01 |
| EO-Taggeld | 2026 | 2026-06 | 2027-01 |
| 3a-Maximum | 2026 (CHF 7'056) | 2026-06 | 2027-01 |
| Kantonale IPV-Modelle | 2026 | 2026-06 | 2027-01 |

---

## Wartungsprotokolle

### 2026-06-23 — Erste Baseline (Q2)

**npm audit:**
- 2 Vulnerabilities: esbuild ≤0.24.2 (moderate), vite ≤6.4.2 (high)
- Fix erfordert Vite 8 Major-Upgrade (breaking change) — zurückgestellt
- Risiko: nur Dev-Server betroffen, nicht Production-Build

**Dependency-Status:**
| Package | Installiert | Latest | Aktion |
|---|---|---|---|
| vite | 4.5.14 | 8.0.16 | Major-Upgrade evaluieren (Q3) |
| react | 18.3.1 | 19.2.7 | Major-Upgrade evaluieren (React 19 Compiler) |
| react-dom | 18.3.1 | 19.2.7 | Mit React zusammen |
| @vitejs/plugin-react | 4.7.0 | 6.0.3 | Mit Vite zusammen |

**Build (Production):**
| Metrik | Wert |
|---|---|
| Module | 115 |
| Build-Zeit | 1.44s |
| Grösster Chunk | index: 243KB (56KB gzip) |
| Vendor | 141KB (45KB gzip) |
| Sprach-Chunks | 95–105KB (33–36KB gzip) |
| Daten-Chunks | plzGemeinde: 165KB, praemienDetail: 124KB |
| Total CSS | 5.9KB (1.6KB gzip) |

**A11y-Audit:**
- 0 Issues nach Fix (Dashboard-Input Label verknüpft)
- Skip-Link: vorhanden
- Landmarks: banner, main, contentinfo vorhanden
- Focus-Visible: aktiv
- 59 Buttons, alle mit Accessible Name
