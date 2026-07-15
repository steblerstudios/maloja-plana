---
description: Voller Review-Loop — lässt die read-only Prüf-Agenten (Qualität, Swiss-Precision, A11y, Polygrafin, Link-Checker) über den aktuellen Stand laufen und sammelt die Funde priorisiert. Stebler Studios entscheidet. Ändert/deployt nichts.
argument-hint: (optional) Umfang, z.B. "nur diff", "nur a11y+design", oder ein Bereich/Datei
allowed-tools: Agent, Bash, Read, Grep, Glob
---

Starte den **Maloja-Review-Loop** über den aktuellen Stand (Standard: die Commits über dem LIVE-Marker aus `SESSION_START.md`, plus uncommitteter Diff). Zweck: ein sauberer, priorisierter Review — **read-only**, nichts wird geändert, committet oder deployt.

**Governance:** Genau eine Delegationsebene — du (Hauptsitzung) rufst die Prüf-Agenten, diese delegieren NICHT weiter (keine Kaskaden). Jeder Agent liefert Vorschläge; Stebler Studios entscheidet, was umgesetzt wird (nichts ungefragt wegnehmen).

Ablauf:

1. Bestimme den Prüf-Umfang aus `$ARGUMENTS` (Default: `git diff <LIVE>..HEAD` + `git status`, LIVE-Marker aus `SESSION_START.md`). Fasse in 2–3 Zeilen zusammen, was sich geändert hat, damit die Agenten Fokus haben.
2. Starte die passenden Prüf-Agenten **parallel** (nur die relevanten laut Umfang):
   - `qualitaets-pruefer` — Tests/Build/i18n/CSP/Speicher.
   - `swiss-precision-pruefer` — CH-Fachlogik/Berechnungen/Quellen/Disclaimer (nur wenn Rechner/Fachdaten betroffen).
   - `a11y-pruefer` — Kontrast/Farbenblind/Fokus/Semantik.
   - `polygrafin` — Typografie/Layout/„wirkt nach AI/SaaS?".
   - `a11y-pruefer` steht oben; ergänze bei Bedarf:
   - `sicherheits-pruefer` — CSP/XSS/Secrets/Datenschutz (bei Speicher-, Link-, Deploy- oder Input-Änderungen).
   - `ordnungshueter` — verwaiste Felder/toter Code/Doku-Drift/Token-Hygiene (bei grösseren oder strukturellen Änderungen).
   - `copy-pruefer` — Wording/Ton/gender-neutral/Sie-Du/i18n-Ton (bei neuer/geänderter Copy).
   - `rechts-pruefer` — Disclaimer/nDSG-Wahrheit/Impressum/Quellen (bei Rechnern, Rechtsaussagen, Datenschutz-Copy).
   - `link-checker` — Behörden-/externe Links (nur wenn Links betroffen).
   Gib jedem Agenten den Umfang + die geänderten Dateien mit.
3. Sammle die Berichte und führe sie zu **einem** priorisierten Ergebnis zusammen, dedupliziert:
   - 🔴 Blocker (Deploy-verhindernd) · ⚠️ Sollte · 💡 Kann/Politur · ✅ Bestätigt gut.
   Jeder Punkt: Befund + Datei:Zeile + welcher Agent + konkreter Fix + grob Aufwand.
4. Schliesse mit einer klaren Frage an Stebler Studios, welche Punkte umgesetzt werden sollen — **nichts automatisch anfangen**.
