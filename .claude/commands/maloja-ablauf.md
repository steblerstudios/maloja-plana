---
description: Prüft eine Lebenssituation als Ablauf durch das 7-Spalten-Raster aus docs/ABLAEUFE.md — findet Bausteine, Lücken und fehlende Crosslinks, schlägt die eine kleinste nächste Aktion vor. Read-only, baut nichts.
argument-hint: Lebenssituation, z.B. "Umzug in andere Gemeinde" oder "Kind wird geboren"
allowed-tools: Bash, Read, Grep, Glob
---

Prüfe die Lebenssituation in `$ARGUMENTS` als **Ablauf** — im Geist von Maloja: die App modelliert *Lebensrealität, nicht Behördenstrukturen*. Menschen leben Situationen, keine Formulare. Read-only: du analysierst und schlägst vor, du baust/änderst nichts.

Leitfrage (Swiss-Life-Model): *„Hilft das den Menschen, ihre Schweizer Lebensrealität ruhiger, verständlicher und mit weniger Aufwand zu organisieren?"*

Vorgehen:

1. Lies zuerst `docs/ABLAEUFE.md` (das Audit-Raster + Konventionen) und prüfe, ob die Situation dort schon erfasst ist. Falls ja: gegen die Realität abgleichen und Abweichungen nennen.
2. Analysiere die Situation durch die **7 Spalten**:
   1. **Auslöser** — welche Lebenssituation startet den Ablauf (nicht der Paragraf)?
   2. **Ideale Schritte** — die ruhigen, sinnvollen Schritte von Anfang bis Ende.
   3. **Vorhandene Bausteine** — welche Views/Module/Funktionen decken Teile? Belege per `grep -rn` in `src/` (Route, Komponente, Rechner).
   4. **Verkettet?** — sind die Bausteine *verbunden* (Crosslinks/`onNavigate`) oder stehen sie isoliert?
   5. **Lücken** — welcher Schritt hat heute keinen Baustein?
   6. **Crosslinks** — welche Verbindung zu anderen Abläufen fehlt (konkretes `onNavigate`-Ziel)?
   7. **Nächste Aktion** — der eine kleinste sinnvolle Schritt zur Verbesserung.
3. Achte auf Maloja-Prinzipien: nichts doppelt eingeben (Daten wiederverwenden), nie zurück-navigieren müssen, würdevolle statt bürokratische Führung, versteckte Berechtigungen proaktiv aufdecken.
4. **Output:** die 7-Spalten-Analyse als kompakte Tabelle/Liste + eine klar priorisierte „nächste Aktion". Frag Stebler Studios am Schluss, ob der Ablauf als Zeile in `docs/ABLAEUFE.md` ergänzt werden soll — **nichts automatisch schreiben oder bauen**.

Governance: Analyse (Level 0–1). Keine App-Änderung, kein Commit, kein Deploy.
