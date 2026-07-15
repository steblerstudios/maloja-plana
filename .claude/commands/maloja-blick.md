---
description: Sichtprüfung des Gerenderten — liest Screenshots (oder macht selbst welche via Dev-Server) als Journey und prüft Hierarchie, Raum, Ruhe, Sprache und WCAG 2.2 am sichtbaren Ergebnis. Read-only, Funde sind Vorschläge. Ergänzt die Code-Prüfer um den Blick, den Nutzerinnen haben.
argument-hint: Screenshot-Pfade, eingefügte Bilder, eine Route (z.B. "#/situationen"), oder "dev"/"stage"/"live" + Bereich
allowed-tools: Read, Bash, Grep, Glob, mcp__Claude_Browser
---

Starte den **Maloja-Blick** — die Sichtprüfung des gerenderten Ergebnisses. Maloja ist ein Ort, kein Dashboard: keine Conversion, kein Funnel, keine Engagement-Metriken. Die Zielgrössen sind **Orientierung, Ruhe, Würde, Verständlichkeit, Barrierefreiheit.**

**Governance:** Read-only. Nichts ändern, committen oder deployen. Alle Funde sind VORSCHLÄGE — Stebler Studios entscheidet (nichts ungefragt wegnehmen). Keine Agent-Kaskaden.

## 1. Bilder beschaffen

- Wurden Screenshots eingefügt oder Pfade in `$ARGUMENTS` genannt → diese lesen.
- Ist eine Route oder ein Bereich genannt (z.B. `#/situationen`, „Dashboard", „dev") → selbst
  aufnehmen: Dev-Server über `launch.json` starten (Port 5174), Onboarding-Bypass setzen
  (`or5_onboarding_done` / `or5_lang` / `or5_tour_done` = true), dann die Ansicht in
  **Handy (375 px)** und **Desktop (1280 px)**, je **hell und dunkel** screenshotten.
  Bei „live"/„stage": malojaplana.ch bzw. stage.malojaplana.ch nur betrachten, nichts eingeben.
- 1–5 Ansichten pro Runde; mehr verwässert die Analyse.

## 2. Als Journey lesen, nicht als Einzelbilder

Weiss die Person auf jedem Screen: Wo bin ich? Was ist hier möglich? Was ist der ruhige
nächste Schritt? Was du im Screenshot nicht sicher erkennst, markiere als **Annahme**.
Keine „könnte besser sein"-Sätze — jeder Fund heisst: wo, warum problematisch, Wirkung
auf die Person, konkreter Vorschlag.

## 3. Prüfraster

**A. Hierarchie und Orientierung** — Ist sofort klar, worum es geht? Genau ein ruhiger
primärer nächster Schritt? Konkurrieren Aktionen?

**B. Raum und Rhythmus** — Abstände konsistent (4/8er-Raster)? Ruhig oder gedrängt?
Gruppen durch Raum statt Rahmen getrennt? Vertikaler Rhythmus editorial oder zufällig?

**C. Ruhe-Prüfung** — Entsteht Ruhe oder Aufmerksamkeit? Alarm-Energie, Prozent-/Defizit-
sprache, Dashboard-Raster, Notification-Atmosphäre? Wirkt es wie ein Ort — oder wie
Startup-SaaS / Design-Theater?

**D. Sprache und Würde** — Klar, kurz, gender-neutral? Erzeugt eine Formulierung Scham,
Druck oder Bürokratiestress? Fehlertexte hilfreich und beruhigend? Quellen-Links auf dem
semantischen Wort?

**E. Barrierefreiheit (WCAG 2.2, am sichtbaren Ergebnis)**
- Textkontrast UND Nicht-Text-Kontrast (Buttons, Icons, Fokusringe)
- Fokus sichtbar und **nicht von Sticky-Elementen/Overlays verdeckt** (2.4.11)
- Touch-Zielgrössen min. 44 px (2.5.8 grosszügig ausgelegt)
- Reflow: bleibt das Layout bei Zoom / grösserem Text stabil? (1.4.10)
- Keine Information nur über Farbe — Silhouette + Helligkeit + Wort
- Formulare: Labels, Hilfetexte, Fehlermeldungen eindeutig gekoppelt
- Bedienreihenfolge logisch

**F. Handy und Desktop** — Inhalt gleich, Anordnung passend? Daumenzone, Schubladen,
Bottom-Nav (inkl. Linkshänder-Modus) konsistent? Dark-Mode-Falle (Buttons/Titel ohne
`color`) sichtbar geworden?

**G. Zustände** — Leer-, Lade-, Fehlerzustand vorhanden und würdevoll? Leere Bereiche
als ruhige Einladung statt Sackgasse?

## 4. Priorisieren

Pro Fund: Einstufung (Barrierefreiheit / Orientierung / Ruhe / Sprache / Raum),
dann Severity × Häufigkeit der Ansicht × Aufwand → **P0** (sofort) / **P1** / **P2** / **P3**.
Barrierefreiheits-Funde nie tiefer als P1.

## 5. Bericht

1. Gesamteindruck in 5 Sätzen — inkl. Antwort auf: „Fühlt es sich wie ein Ort an?"
2. Funde nach Priorität, je mit konkretem Vorschlag (+ Datei-Vermutung, falls erkennbar)
3. WCAG-Checkliste: Bestanden / Nicht bestanden / Unsicher (Unsicheres als Annahme markiert)
4. Quick Wins (heute machbar) vs. grössere Umbauten
5. Falls sich eine wiederverwendbare Regel ergibt: als Vorschlag für die Design-System-
   Regeln formulieren (nicht selbst eintragen).

Schliesse mit der Frage an Stebler Studios, welche Punkte umgesetzt werden sollen — nichts
automatisch anfangen.
