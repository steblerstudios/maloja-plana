# Wartungs-Prompt für Claude

> Dieses Dokument ist der ideale Prompt, um Claude bei einer Wartung einzusetzen.
> Kopiere den Prompt-Block unten in eine neue Claude-Session.

---

## Wann verwenden?

- Wenn ein GitHub Issue "Wartung" erstellt wird (automatisch Q1/Q2/Q3/Q4)
- Wenn du manuell eine Wartung starten willst
- Wenn eine Datenquelle aktualisiert werden muss

---

## Prompt: Quartals-Wartung

```
Du bist der Wartungs-Agent für Maloja Plana.

Projekt-Verzeichnis: ~/Projects/maloja plana
Wartungskalender: docs/operations/maintenance-calendar.md
Technologie: React (createElement, kein JSX), Vite, localStorage, kein Backend

Bitte führe folgende Wartungsschritte durch:

### 1. Dependency-Audit
- `npm audit` ausführen
- Kritische Vulnerabilities identifizieren
- Vite, React, Vitest Versionen prüfen (aktuelle vs. installierte)
- Minor/Patch-Updates einspielen wenn unkritisch

### 2. Bundle-Check
- `npm run build` ausführen
- Chunk-Grössen dokumentieren (kein Chunk > 300KB gzip)
- Vergleich mit letztem Quartal (falls im Versionsregister)

### 3. Link-Check (Stichprobe)
- 5 zufällige Links aus `src/data/direktLinks.js` öffnen und prüfen
- Ergebnis dokumentieren: OK / Broken / Redirect

### 4. CI/CD Status
- Letzten CI-Run prüfen (GitHub Actions)
- Deployment-Status prüfen

### 5. Dokumentation aktualisieren
- `docs/operations/maintenance-calendar.md` → Datenquellen-Versionsregister aktualisieren
- `docs/governance/audit-log.md` → Neue Einträge seit letzter Wartung

Am Ende: Zusammenfassung als Kommentar im GitHub Issue posten.
```

---

## Prompt: Januar — Datenquellen-Update

```
Du bist der Wartungs-Agent für Maloja Plana. Es ist Januar — Zeit für das jährliche Datenquellen-Update.

Projekt-Verzeichnis: ~/Projects/maloja plana
Wartungskalender: docs/operations/maintenance-calendar.md

Bitte prüfe und aktualisiere folgende Datenquellen:

### Krankenkassenprämien (höchste Priorität)
- Quelle: priminfo.admin.ch
- Script: `scripts/build-praemien-detail.mjs`
- Zieldatei: `src/data/praemienDetail.js`
- Neue Median-Prämien pro Kanton und Modell importieren

### BVG/AHV-Grenzwerte
- BVG-Eintrittsschwelle, Koordinationsabzug, maximaler versicherter Lohn
- Zieldatei: `src/VorsorgeRechner.jsx`
- Quelle: bsv.admin.ch

### 3a-Maximalbetrag
- Zieldatei: `src/data/saeule3a.js` — **die einzige Stelle**, die den Wert trägt.
  `TaxCalculator.jsx` und `Saeule3aTracker.jsx` importieren ihn von dort.
- Quelle: estv.admin.ch → Direkte Bundessteuer → Steuertarife → «Zinssätze / Höchstabzüge
  Säule 3a», Tabelle «Höchstabzüge Säule 3a». Gegenprobe: faq.bsv.admin.ch
- Prüfen: **beide** Werte — mit 2. Säule und ohne. Der Wert für 2026 steht im Konstanten-Objekt
  samt Abrufdatum; stimmt die ESTV-Tabelle damit überein, nur `abgerufen` nachführen.

> 🛑 **Warum dieser Eintrag eine Quelle braucht.** Bis 23.09.2026 stand hier «Aktueller Wert:
> CHF 7'056 (Stand 2026)» **ohne Quellenzeile** — als einziger Eintrag dieser Liste. Eine
> Prüfung konnte damit nur die Doku gegen sich selbst halten und ging grün aus, während der
> Wert zwei Anpassungen alt war (7'056 galt 2023/2024). Dazu zeigte der Eintrag auf
> `VorsorgeRechner.jsx`, wo der Betrag gar nie stand, und nicht auf `Saeule3aTracker.jsx`, wo
> er stand. **Ein Eintrag ohne Quelle ist keine Prüfung, sondern eine Abschrift.**

### EO-Taggeld-Maximum
- Zieldatei: `src/EOrechner.jsx`
- Quelle: bsv.admin.ch

### Bundessteuer-Tarife
- Zieldatei: `src/TaxCalculator.jsx`
- Quelle: estv.admin.ch

### SKOS Grundbedarf
- Zieldatei: `src/data/sozialhilfeRechner.js`
- Nur bei neuen SKOS-Richtlinien

### BFS Medianlöhne (alle 2 Jahre)
- Zieldatei: `src/data/branchenLohn.js`
- Letzte Daten: LSE 2022
- Nächstes Update: wenn LSE 2024 publiziert

Für jede Quelle: aktuellen Wert in der App vs. offiziellen Wert vergleichen.
Nur ändern wenn offiziell bestätigt. Jede Änderung committen mit Quellenangabe.
Am Ende: Versionsregister in maintenance-calendar.md aktualisieren.
```

---

## Prompt: Jährlicher Gross-Review (Juni)

```
Du bist der Wartungs-Agent für Maloja Plana. Es ist Juni — Zeit für den jährlichen Gross-Review.

Projekt-Verzeichnis: ~/Projects/maloja plana
Wartungskalender: docs/operations/maintenance-calendar.md

### 1. Alle Links prüfen
- Alle Links in `src/data/direktLinks.js` (kantonal + federal)
- Alle Links in `src/premiumCalc.js` (IPV-Quellen)
- Ergebnis: Liste mit Status (OK / Broken / Redirect)

### 2. Browser-Kompatibilität
- App öffnen in Safari, Chrome, Firefox
- Alle 7 Kapitel + Dashboard laden
- Screenshots der wichtigsten Views

### 3. Lighthouse-Audit
- Performance, A11y, SEO, PWA Score
- Vergleich mit letztem Jahr

### 4. Übersetzungen Stichprobe
- FR: 10 Views stichprobenartig prüfen
- IT: 10 Views stichprobenartig prüfen
- EN: 10 Views stichprobenartig prüfen
- Fehler dokumentieren

### 5. Service Worker
- `sw.js` CACHE_NAME aktuell?
- Cache-Invalidierung testen

### 6. Dokumentation
- `docs/ux/known-issues-beta.md` aktualisieren
- `docs/governance/audit-log.md` nachführen
- Version in `package.json` und `src/main.jsx` prüfen

Am Ende: Zusammenfassung mit Empfehlungen für nächstes Halbjahr.
```

---

## E-Mail-Benachrichtigung einrichten

Die einfachste Methode, damit info@malojaplana.ch benachrichtigt wird:

1. **GitHub → Repository → Settings → Watch** → "All Activity" aktivieren
2. **GitHub → Settings → Notifications → Custom Routing** → Für dieses Repo: info@malojaplana.ch eintragen
3. Fertig. Jedes automatisch erstellte Issue landet per E-Mail bei dir.

Alternative (wenn du einen Mailserver hast): SendGrid/Mailgun Secret im Repo hinterlegen und den Workflow erweitern.
