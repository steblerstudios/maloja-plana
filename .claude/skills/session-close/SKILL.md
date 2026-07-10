---
name: session-close
description: Ruhiges Session-Abschluss-Ritual für Maloja — bringt Stand-Doku (SESSION_START.md, FEATURES.md) + Memory auf den echten git-/live-Stand, zieht eine ehrliche Bilanz (gebaut/verifiziert/offen mit Belegen) und fragt am Ende, ob die Sitzung benannt+archiviert werden soll. Nutzen am Sitzungs-Ende oder wenn Sophie „session-close", „abschluss", „sitzung zumachen" sagt. Archiviert NIE automatisch.
---

# Session-Close — der ruhige Sitzungs-Abschluss (Maloja Plana)

Dieser Skill **orchestriert** den Abschluss einer Arbeitssitzung. Er **dupliziert
nicht** `/handoff` (Kontext-Übergabe in einen neuen Chat) oder `/maloja-predeploy`
(Deploy-Gate) — er bietet `/handoff` bei Bedarf an und verweist auf `/maloja-predeploy`,
macht deren Arbeit aber nicht selbst.

**Grundhaltung:** ruhig, ehrlich, governance-treu. Nichts als erledigt ausgeben, was
nur vorgeschlagen ist. Jede Stand-Aussage mit Beleg (Commit-Hash, Bundle-Hash, Datei).
**Wahrheits-Disziplin:** lieber „offen / nicht verifiziert" als eine selbstsichere
Behauptung. **Der einzige unumkehrbar wirkende Schritt (Archivieren) passiert NIE
automatisch** — er wird nur vorgeschlagen und gefragt.

Arbeite die folgenden Schritte der Reihe nach ab.

## 1. Arbeitsbaum klären

- `git status` + `git log --oneline -5` + aktuellen Branch lesen.
- Uncommittete Änderungen? → **entweder** sauber committen (Commit-Hook erzwingt grüne
  Tests) **oder** bewusst offen lassen und als **nächsten Schritt** notieren (Schritt 2).
  Nichts still liegen lassen.
- Unpushed commits? Notieren, ob push noch aussteht.

## 2. Stand-Doku gegen die echte Wahrheit aktualisieren

- **`SESSION_START.md`** (Repo-Root, DIE Stand-Quelle): Branch, worauf `main` steht
  (echter Hash aus `git`), Version (`package.json`), letzter Tag, Datum. Bei Widerspruch
  gilt diese Datei — also muss sie stimmen. Abschnitte „Wo stehen wir", „Verifikations-
  Status", „Nächste Schritte" nachziehen.
- **`FEATURES.md`**: nur auf **verified-live** setzen, was auch live verifiziert wurde
  (Bundle-Hash gegen frischen main-Build geprüft). Sonst built/deployed ehrlich stehen
  lassen.
- Konvertiere relative Daten in absolute (heutiges Datum aus dem Kontext).

## 3. Memory + Index nachziehen

- Neue dauerhafte Fakten dieser Sitzung (Entscheide + Warum, Projekt-Stand, Referenzen)
  in die passende Memory-Datei schreiben — bestehende Datei aktualisieren statt
  duplizieren; falsch Gewordenes löschen.
- Einzeiler-Pointer in `MEMORY.md` nachführen.
- Nichts speichern, was das Repo schon trägt (Code-Struktur, git-Historie).

## 4. Ehrliche Bilanz zeigen

Kurzer, ruhiger Block an Sophie — drei Rubriken, jede mit Beleg:

- **Gebaut** — was diese Sitzung entstand (Dateien, Commits/Hashes).
- **Verifiziert** — was tatsächlich geprüft ist (Tests grün? Build? live per Bundle-Hash?)
  vs. nur lokal gebaut. Trenne beides sauber.
- **Offen** — was bewusst offen bleibt, als konkreter nächster Schritt formuliert.

## 5. Bei laufendem Faden: `/handoff` anbieten

Wenn ein unfertiger Arbeitsfaden offen ist, den ein neuer Chat aufnehmen müsste, biete
an, `/handoff` zu laufen (den kopierbaren Übergabe-Block). Nicht aufdrängen — anbieten.
Nicht selbst nachbauen; das ist `/handoff`s Aufgabe.

## 6. Titel vorschlagen + fragen (Archivieren NIE automatisch)

- Einen prägnanten Titel-Vorschlag für die Sitzung zeigen.
- Dann **fragen**: „Sitzung so benennen und archivieren? [j/N] — oder du machst es
  selbst in der App."
- **Ohne ausdrückliches „ja" wird nichts archiviert.** Sophie behält die Kontrolle über
  den einzigen unumkehrbar wirkenden Schritt und darf immer von Hand archivieren.

---

**Merke:** Dieser Skill deployt nichts und merged nichts. Er schliesst die Sitzung
sauber ab, damit die nächste bei Null Vorwissen den wahren Stand vorfindet.
