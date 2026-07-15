---
description: Deploy-Gate für Maloja — verifiziert den zu deployenden Stand, fährt die volle lokale Review-Batterie (maloja-review-Agenten + /code-review + /simplify) und erinnert an ultrareview + de-Chunk-Check. Deployt NICHT selbst (Stebler Studios deployt via deploy.sh bei 10+ Commits).
argument-hint: (optional) "trotzdem" um bei <10 Commits fortzufahren
allowed-tools: Bash, Read, Grep, Glob
---

Führe das **Maloja-Deploy-Gate** aus. Wichtig: Dieser Loop **deployt nie**. Deploy macht Stebler Studios selbst vom eigenen Mac aus (`bash deploy.sh` → SFTP zu Infomaniak). Hier wird nur geprüft und erinnert.

1. **Deploy-Rhythmus:** Den LIVE-Marker (zuletzt live verifizierter Commit) aus `SESSION_START.md` lesen, dann `git log --oneline <LIVE>..HEAD` → wie viele Commits über LIVE? Stebler Studios deployt bewusst erst bei **~10+**. Bei weniger: sag die Zahl und dass es (ausser `$ARGUMENTS` = „trotzdem") noch nicht so weit ist — kein Drängen.
2. **Volles Gate laufen lassen** (wie /maloja-check, aber streng):
   - `npm test -- --run` — alle grün (sonst 🔴 Blocker).
   - `npm run build` — sauber durch, keine neuen Warnungen.
   - **SEO/GEO-Fundament:** `bash scripts/check-seo.sh dist` (nach dem Build) — Pflicht-Bausteine (title/description/lang/canonical/OG/JSON-LD/robots.txt/sitemap.xml) müssen da sein. Exit ≠ 0 = **🔴 Blocker** (identisch mit dem harten Gate in `deploy.sh`). **Weiche Warnungen hier ernst nehmen** (Titel-Länge, hreflang, og:image-Datei, twitter:card) — `deploy.sh` bricht bei ihnen NICHT ab, deshalb ist dies der Ort, sie zu sehen und zu entscheiden. Doku/Befund: `docs/SEO_GEO.md`.
   - `npm run size` — im Budget.
   - **PII-Scan:** `bash scripts/pii-scan.sh` — kein privater Name/Mail/Home-Pfad/
     Hoster-Token in getrackten Dateien (öffentliches Repo!). Exit ≠ 0 = **🔴 Blocker**,
     nicht deployen. Bereinigen (Rollen-Begriff „Stebler Studios"/Firmen-Mail
     `info@malojaplana.ch`/Platzhalter); legaler voller Name gehört NUR ins Impressum.
     (Deny-Tokens: lokale, gitignorierte `.pii-deny.txt`; Vorlage `.pii-deny.txt.example`.)
   - i18n-Parität 5 Sprachen (de/fr/it/rm/en) — keine fehlenden Keys.
   - CSP self-only — keine externen Referenzen dazugekommen.
   - `git status` sauber / keine ungewollten Dateien; `git diff package.json` → keine neuen Dependencies ohne Freigabe.
3. **de-Chunk-Verifikation:** Nach `npm run build` die gebauten Sprach-Chunks (`dist/assets/de-*.js` usw.) auf die zuletzt geänderten Strings greppen — bestätigen, dass neue Texte wirklich im Bundle sind (bekannter Verifikations-Schritt).
4. **Volle lokale Review-Batterie** (günstig + lokal, VOR der billed Cloud-Ultrareview). **Zwei Umfänge — Stebler-Studios-Entscheid 2026-07-11:**
   - **GANZER CODE (immer, nicht diff-scoped)** für die drei Grund-Reviews — vor JEDEM Deploy über die ganze App, nicht nur die geänderten Dateien:
     - **Security:** `sicherheits-pruefer`-Agent über den gesamten `src/` + `index.html` + `public/` (CSP/XSS/Secrets/Datenschutz/local-first).
     - **Accessibility:** `a11y-pruefer`-Agent + built-in `design:accessibility-review` (WCAG 2.1 AA) über die ganze App (Kontrast/Farbenblind/Fokus/Semantik/Touch-Ziele).
     - **Design:** built-in `design:design-critique` über die ganze App (Hierarchie/Konsistenz/Materialität/Calm-UX).
   - **DIFF-scoped** (`<LIVE>..HEAD` + uncommitteter Stand) für die Bug-/Aufräum-Jagd auf den Änderungen:
     - `/maloja-review` — die übrigen Domänen-Agenten: `qualitaets` (Tests/Build/i18n/CSP), `swiss-precision` (CH-Fachlogik/Berechnungen/Quellen), `polygrafin` (Typo/Layout/AI-SaaS-Geruch), `ordnungshueter` (toter Code/Doku-Drift/Token), `copy` (Wording/gender-neutral/Ton), `rechts` (Disclaimer/nDSG/Quellen), `link-checker`.
     - `/code-review` — Korrektheit/Bug-Jagd auf dem Diff.
     - `/simplify` — Aufräumen/Vereinfachung/Effizienz.
   Befunde zu **einem** priorisierten Ergebnis zusammenführen (🔴 Blocker · ⚠️ sollte · 💡 kann · ✅ gut). Umsetzen oder bewusst parken — nichts ohne Stebler Studios’ Wort. Erst wenn das sauber ist, ist der Stand reif für die billed Ultrareview.
   - **Freigabe-Marke schreiben** (nur wenn 0 offene 🔴 Blocker): `mkdir -p .maloja && git rev-parse HEAD > .maloja/predeploy-ok && date -u +%Y-%m-%dT%H:%M:%SZ >> .maloja/predeploy-ok`. Der Deploy-Gate-Hook liest diese Marke; ohne frische Marke (Hash ≠ HEAD) blockt `bash deploy.sh`.
5. **Harness-Dateien aktualisieren** (Schritt 3 des Harness-Plans, `docs/context/HARNESS_PLAN.md`):
   - `SESSION_START.md` — Branch/`main`/Tag, Verifikations-Status und nächste Schritte auf den heutigen Stand bringen.
   - `FEATURES.md` — die Zeilen des ausgehenden Stands von `built` auf `deployed` heben. `verified-live` NICHT hier setzen — das passiert erst nach der Live-Gegenprüfung (Schritt (c) bzw. zu Beginn der nächsten Sitzung), dann mit Bundle-Hash als Beleg.
6. **Erinnerung, nicht Ausführung:** Falls Stebler Studios deployen will, ist die Reihenfolge: (a) `/code-review ultra` laufen lassen (billed, von Stebler Studios ausgelöst — du kannst es nicht starten), (b) Deploy via `bash deploy.sh`, (c) danach LIVE im Browser gegen die geänderten Chunks verifizieren → betroffene `FEATURES.md`-Zeilen auf `verified-live` mit Hash-Beleg, (d) neuen LIVE-Commit in der Memory (`project_maloja_plana.md`) und in `SESSION_START.md` festhalten.

Output: Ampel-Zusammenfassung (Deploy-bereit ja/nein + offene Punkte). Keine Aktion ohne Stebler Studios’ Wort.
