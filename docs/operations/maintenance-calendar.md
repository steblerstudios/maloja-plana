# Wartungskalender — Maloja Plana

> Regelmässige Aufgaben, damit die App aktuell, sicher und funktional bleibt.
> Benachrichtigung: Automatisch via GitHub Actions an info@malojaplana.ch

---

## Januar — Datenquellen-Update (Priorität: hoch)

| Aufgabe | Quelle | Betroffene Dateien | Aufwand |
|---|---|---|---|
| BAG Prämien 2027 importieren | priminfo.admin.ch | `src/data/praemienDetail.js` | 30 Min (Script: `scripts/build-praemien-detail.mjs`) |
| BAG IPV-Modelle prüfen | ch.ch/de/gesundheit | `src/premiumCalc.js` (kantonale Modelle) | 15 Min |
| BFS Medianlöhne prüfen | bfs.admin.ch LSE | `src/data/branchenLohn.js` (alle 2 Jahre) | 15 Min |
| SKOS Grundbedarf prüfen | skos.ch Richtlinien | `src/data/sozialhilfeRechner.js` | 10 Min |
| Mietzinsbeiträge-Kantone prüfen | bs.ch / baselland.ch / ge.ch / zg.ch (BWO-Übersicht) | `src/data/mietzinsbeitraege.js` (BS/BL/GE/ZG: Einkommensgrenzen, Beträge, Zielgruppe) | 20 Min |
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
| Analytics-Zahlen ablesen | Server-Log-Statistik (Infomaniak) → Pitch-Zeile ausfüllen, siehe [analytics-weg1-anleitung.md](analytics-weg1-anleitung.md) | 5 Min |

**Geschätzter Gesamtaufwand pro Quartal:** 50 Minuten

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
| Mietzinsbeiträge (BS/BL/GE/ZG) | 2025 | 2026-06 | 2027-01 |
| BVG-Grenzwerte | 2026 | 2026-06 | 2027-01 |
| EO-Taggeld | 2026 | 2026-06 | 2027-01 |
| 3a-Maximum | 2026 (CHF 7'258 mit PK / 36'288 ohne) | 2026-09-23 | 2027-01 |
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

### 2026-09-15 — Q3 (Issue #123, drei Wochen nach Fälligkeit)

*Erhoben von Claude Code auf Stand `main` = `4b922ac`, Stebler Studios merged. Alles gemessen, nichts geraten.*

**`npm audit`:** **0 Lücken in Produktions-Abhängigkeiten** (`--omit=dev`). In den Dev-Abhängigkeiten
meldet `npm audit` Lücken, alle in der Build-/Test-Kette (vite 4, vitest, tar, postcss, xmldom) —
sie laufen nie im Browser der Nutzer. Beheben würde die Majors unten bedeuten.

**Dependency-Status:**
| Package | Installiert | Latest | Aktion |
|---|---|---|---|
| vite | 4.5.14 | 8.3.0 | Major — **nicht** im Q3, eigener Spike mit Build-Vergleich (Q4/Januar) |
| @vitejs/plugin-react | 4.7.0 | 6.1.1 | mit Vite zusammen |
| react / react-dom | 18.3.1 | 19.3.0 | Major — eigener Entscheid (React-19-Compiler, `createElement`-Stil bleibt) |
| vitest | 4.1.9 | 4.1.11 (5.0.1) | **Patch verfügbar** — im nächsten Schritt einspielen (`node_modules` war während der Sitzung mit drei Worktrees geteilt, deshalb nicht mitten im Lauf) |
| eslint | 9.39.5 | 10.10.0 | Major — bleibt |
| size-limit / @size-limit/file | 12.1.0 | 14.0.0 | Major — bleibt |

**Build (Production):**
| Metrik | Wert |
|---|---|
| Build-Zeit | 1.94 s |
| Hauptbundle gzip (`size-limit`) | **63.49 kB von 65 kB** — Reserve 1.5 kB, jedes Feature muss das mitdenken |
| Grösster Chunk | siehe Zeile «grösste Chunks» im PR; kein Chunk über 300 kB gzip |
| Tests | 65 Dateien, **779 grün** |
| ESLint | sauber |

**Link-Stichprobe (5 von 122 URLs in `direktLinks.js`, jede 24.):** skos.ch 200 · plaant.ch 200 ·
steuern.lu.ch 200 · jura.ch 200 · baselland.ch **403** = bekannter WAF-Fehlalarm (im Browser gültig,
siehe Q2). Kein toter Link.

**CI:** die letzten vier Läufe vom 15.09. grün (PR #129, #130 und beide Merges).

**Nicht erledigt, Hand von Stebler Studios:** Analytics-Zeile aus dem Infomaniak-Server-Log ablesen
(`analytics-weg1-anleitung.md`) — braucht das Panel.

**Nächste Wartung:** Dezember (Q4). Januar 2027 = Datenquellen-Update (Tabelle oben).

### 2026-09-23 — Ausserplanmässig: 3a-Maximum war zwei Anpassungen alt

**Auslöser:** Beim Gegenlesen eines fremden Finanz-Dokuments fiel auf, dass Code und Doku im
eigenen Repo verschiedene 3a-Maxima führten — Code 7'258, fünf Dokumente 7'056 «Stand 2026».

**An der Quelle erhoben (23.09.2026):** ESTV, «Höchstabzüge Säule 3a bei der Direkten
Bundessteuer» — 2026 und 2025 je **7'258** (mit 2. Säule) bzw. **36'288** (ohne). 7'056/35'280
galten 2023 und 2024. Gegenprobe BSV-FAQ, identisch. Für 2026 unverändert bestätigt
(Medienmitteilung EFD, 17.11.2025). **Der Code hatte recht, die Doku war zwei Jahre alt.**

**Warum die Prüfung im Juni das nicht sah — zwei Gründe, beide behoben:**

1. Der Eintrag «3a-Maximalbetrag» in `maintenance-prompt.md` war der **einzige** ohne
   Quellenzeile. Die Prüfung konnte den Wert nur gegen die Doku halten, in der er stand.
   *Eine Prüfung, die ihre eigene Liste gegen sich selbst hält, geht immer grün aus.*
2. Der Eintrag nannte als Zieldatei `VorsorgeRechner.jsx` — dort steht der Betrag **nicht** und
   stand er nie. Die Datei, die ihn trug (`Saeule3aTracker.jsx`), war nicht genannt.

**Geändert:** Der Wert liegt neu an **einer** Stelle (`src/data/saeule3a.js`, mit Quelle,
Rechtsgrundlage und Abrufdatum), vorher an zwei Code- und fünf Doku-Stellen. Die
Wartungsanleitung hat jetzt Quelle und richtige Zieldatei.

**Offen, nicht in diesem Durchgang entschieden:** Die App deckelt die 3a-Eingabe für alle bei
7'258. Für Selbständige ohne 2. Säule ist das zu tief (BVV 3 Art. 7 Abs. 1 lit. b: 20 % des
Erwerbseinkommens, höchstens 36'288). Produktentscheid, kein Wartungsfall.
