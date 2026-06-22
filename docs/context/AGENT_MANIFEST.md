# Agent-Manifest — Maloja Plana

> Stand: Juni 2026  
> Ersetzt: docs/archive/concepts/agents/* (54-Agenten-Vision, nicht implementiert)

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
- Custom i18n mit useT() → t(key) — 4 Sprachen immer synchron
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
- In-App LegalView (alle 4 Sprachen)

**Prinzip:** Schweizer Recht, Gerichtsstand Basel-Stadt. Keine Beratung, nur Orientierung. Immer den Disclaimer nennen.

### 3. Design-Agent

**Rolle:** UI, UX, visuelle Identität  
**Grundlage:** Maloja Visual Materiality Skill  
**Regeln:**
- Schweizer Ruhe — nicht SaaS, nicht Startup
- DM Sans für UI, Cormorant Garamond für Kapitelmomente
- Sand/Beige/Gold Farbpalette — kein Neon, kein Glas
- Weissraum ist Material, nicht Leere
- Barrierefreiheit: htmlFor/id, aria-labels, Kontrast

**Prüffrage:** "Fühlt sich das wie ein ruhiger Lebensort an — oder wie Software?"

### 4. Qualitäts-Agent

**Rolle:** Testing, Audit, Verifikation  
**Prüft:**
- Build funktioniert (`npm run build`)
- Keine Console-Errors
- i18n-Keys in allen 4 Sprachen vorhanden
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
- **Kein Agent ersetzt Sophie's Entscheidung** — Sophie entscheidet, Agents schlagen vor
- **Keine Agent-Kaskaden** — ein Agent pro Aufgabe, keine verschachtelten Delegationen
- **Keine "AI-powered" Features** — Maloja ist deterministisch, nicht probabilistisch
