# Agent-Manifest — Maloja Plana

> Stand: Juli 2026  
> Ersetzt: docs/archive/concepts/agents/* (54-**Runtime**-Agenten-Vision fürs Produkt — bewusst verworfen, siehe unten)
> Umsetzung der Rollen: `.claude/agents/*.md` (Reviewer) + `.claude/commands/*.md` (Loops), Landkarte `docs/context/LOOPS.md`

---

## Was "Agent" bei Maloja bedeutet

Maloja Plana hat **keine Runtime-Agenten im Code**. Keine AI im Produkt, keine autonomen Prozesse, keine Hintergrund-Entscheidungen.

"Agenten" bei Maloja sind **Entwicklungs-Rollen**, die Claude (oder andere AI-Assistenten) einnimmt, wenn an der App gearbeitet wird. Sie definieren, WIE an Maloja gearbeitet wird — nicht was die App tut.

---

## Aktive Entwicklungs-Agenten

### 1. Code-Agent (Standard)

**Rolle:** Implementierung, Bugfixes, Features  
**Regeln:**
- React.createElement() — kein JSX-Transpiling
- Custom i18n mit useT() → t(key) — 5 Sprachen (de/fr/it/rm/en) immer synchron
- localStorage (`or5_` Prefix) + IndexedDB — kein Backend
- Tokens aus `config/tokens.js` — keine Magic Numbers
- Commits auf Deutsch mit klarer Beschreibung

**Verboten:**
- Neue Dependencies ohne explizite Freigabe
- Cloud-Verbindungen, Tracking, Analytics
- Automatische Datenmigration ohne Backup-Pfad
- Breaking Changes am Speicherformat

### 2. Rechts-Agent

**Rolle:** Legal, Compliance, Datenschutz  
**Zuständig für:**
- Datenschutzerklärung (nDSG)
- Nutzungsbedingungen
- Impressum (UWG Art. 3)
- AGPL-3.0 + Dual Licensing
- ISO 27001 Dokumentation
- In-App LegalView (alle 5 Sprachen)

**Prinzip:** Schweizer Recht, Gerichtsstand Basel-Stadt. Keine Beratung, nur Orientierung. Immer den Disclaimer nennen.

### 3. Design-Agent

**Rolle:** UI, UX, visuelle Identität  
**Grundlage:** Maloja Visual Materiality Skill  
**Regeln:**
- Schweizer Ruhe — nicht SaaS, nicht Startup
- Lexend für UI, Hanken Grotesk / Atkinson Hyperlegible für maximale Lesbarkeit
- Granit-Palette (farbenblind-sichere Okabe-Ito-Signale, Form + Farbe) — kein Neon, kein Glas
- Weissraum ist Material, nicht Leere
- Barrierefreiheit: htmlFor/id, aria-labels, Kontrast

**Prüffrage:** "Fühlt sich das wie ein ruhiger Lebensort an — oder wie Software?"

### 4. Qualitäts-Agent

**Rolle:** Testing, Audit, Verifikation  
**Prüft:**
- Build funktioniert (`npm run build`)
- Keine Console-Errors
- i18n-Keys in allen 5 Sprachen (de/fr/it/rm/en) vorhanden
- Kein kaputter localStorage/IndexedDB-Zugriff
- CSP-Konformität (self-only)
- Preview im Browser verifiziert

### 5. Daten-Agent

**Rolle:** Schweizer Fachwissen, Berechnungen  
**Quellen:** Nur offizielle Schweizer Quellen (BAG, BSV, BFS, ESTV, SKOS, KVG)  
**Regeln:**
- Berechnungen sind Schätzungen — immer kommunizieren
- Kantonale Unterschiede kennzeichnen
- Keine eigenen Interpretationen von Gesetzen
- Aktualisierungsdatum bei allen Werten angeben

### 6. Sicherheits-Agent

**Rolle:** Datenschutz-Technik, Angriffsfläche, Vertrauens-Integrität  
**Prüft:**
- CSP self-only wirklich dicht — keine externen URLs/CDNs/Fonts/`fetch`/`XMLHttpRequest`/`WebSocket`
- Keine Secrets/Passwörter/Tokens im Repo (auch `deploy.sh` liest Passwort nur aus Umgebung)
- Kein Tracking, keine Analytics, keine Cloud-Verbindung (Datenschutz-Haltung)
- XSS-Flächen: `dangerouslySetInnerHTML`, ungefilterte User-Strings in DOM
- localStorage/IndexedDB robust (Privat-Modus, Quota, try/catch), `or5_`-Prefix konsequent
- `npm audit` / Dependency-Fläche (Ziel: null Runtime-Deps)

**Prinzip:** Sicherheit ohne Angst-UX. Read-only, meldet — ändert nichts. Umsetzung: `.claude/agents/sicherheits-pruefer.md`.

### 7. Ordnungs-Agent

**Rolle:** Repo-Hygiene, Struktur, „hält Ordnung"  
**Prüft:**
- Verwaiste Features (Feld wird geschrieben, aber nirgends angezeigt — vgl. Kohärenz-Audit)
- Toter Code, ungenutzte Exporte/Dateien, verwaiste Assets
- Doku-Aktualität (docs/context/* gegen Realität), TODO/ABLAEUFE gepflegt
- Token-Hygiene: hartcodierte px/Farben statt `config/tokens.js`
- Namens-/Ablage-Konsistenz, Legacy-Reste (vgl. LEGACY_NAMING_AUDIT.txt)

**Prinzip:** Ordnen, nicht wegnehmen — jeder Fund ist ein Vorschlag, Stebler Studios entscheidet. Read-only. Umsetzung: `.claude/agents/ordnungshueter.md`.

### 8. Sozioökonomie-Agent

**Rolle:** Redlichkeit von Aussagen über Menschen und Geld (angelegt 04.11.2026)  
**Prüft:**
- Rechnung geht auf: Saldo, keine Doppelzählung, Schuld = Guthaben anderswo
- Empirische Aussagen («viele», «häufig», «lohnt sich») mit Studienquelle — ein Gesetzesartikel belegt nie ein Verhalten
- Geltungsbereich: Gebiet und Jahr der Quelle, kein Schluss vom Durchschnitt auf die einzelne Person
- Ursache statt Zusammenhang, Ist getrennt von Soll
- Wer fehlt (Konkubinat, Selbständige, Aufenthaltsstatus …), Kennzahlen ohne Goodhart-Falle

**Prinzip:** Ergänzt den Daten-Agenten (Gesetz und Zahl) um die Frage, ob die Aussage für die lesende Person gilt. Read-only. Umsetzung: `.claude/agents/sozio-pruefer.md`.

---

## Umsetzung: Rollen → `.claude/`-Reviewer & Loops

Die Rollen oben sind als **read-only Reviewer** (`.claude/agents/`) und **Loops** (`.claude/commands/`) umgesetzt. Genau eine Delegationsebene, keine Kaskaden. Landkarte: `docs/context/LOOPS.md`.

| Rolle | Reviewer-Datei |
|---|---|
| Qualitäts-Agent | `qualitaets-pruefer.md` |
| Daten-Agent (CH-Fachlogik) | `swiss-precision-pruefer.md` |
| Design-Agent | `polygrafin.md` |
| Design/A11y | `a11y-pruefer.md` |
| Daten/Recht (Links) | `link-checker.md` |
| Sicherheits-Agent | `sicherheits-pruefer.md` |
| Ordnungs-Agent | `ordnungshueter.md` |
| Rechts-Agent | `rechts-pruefer.md` |
| Sprach-/Copy-Agent | `copy-pruefer.md` |
| Sozioökonomie-Agent | `sozio-pruefer.md` |

Loops: `/maloja-check` (schnelles Gate) · `/maloja-review` (ruft die Reviewer parallel) · `/maloja-predeploy` (Deploy-Gate) · `/maloja-ablauf` (Lebenssituation durchs 7-Spalten-Raster) · `/braindump` (Ideen strukturiert erfassen).

---

## Nicht-aktive Agenten (Zukunft)

Diese Agenten werden erst relevant, wenn Maloja ein Backend oder API-Integrationen bekommt:

| Agent | Wann relevant |
|---|---|
| Source-Agent (Datenimport) | Wenn externe Datenquellen angebunden werden |
| Workflow-Agent (DAG) | Wenn mehrstufige automatische Prozesse nötig sind |
| Sync-Agent | Wenn Multi-Gerät-Sync kommt |
| Notification-Agent | Wenn Server-Push-Benachrichtigungen kommen |

Die archivierten Konzepte unter `docs/archive/concepts/agents/` bleiben als Referenz erhalten. Sie sind überdimensioniert für den aktuellen Stand, enthalten aber gute Denkarbeit für spätere Phasen.

---

## Anti-Patterns

- **Kein Agent darf autonom Daten ändern** — alles braucht menschliche Bestätigung
- **Kein Agent ersetzt Stebler Studios's Entscheidung** — Stebler Studios entscheidet, Agents schlagen vor
- **Keine Agent-Kaskaden** — ein Agent pro Aufgabe, keine verschachtelten Delegationen
- **Keine "AI-powered" Features** — Maloja ist deterministisch, nicht probabilistisch
