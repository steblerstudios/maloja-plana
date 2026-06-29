# Changelog

Alle wesentlichen Änderungen an Maloja Plana werden hier dokumentiert.
Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.1.0/).

---

## [0.1.5-beta] — 2026-06-29

Geführte Lebensereignis-Abläufe und das UX-Playbook. Schwerpunkt: zusammenhängende
Wege statt isolierter Werkzeuge (Maloja verwaltet Zusammenhänge, nicht nur Informationen).

### Neu
- **Wiederverwendbare Ablauf-Schale** und sechs geführte Abläufe: Krankenkasse wechseln, Zusatzversicherung kündigen, **Umzug**, **Unfall oder Krankheit — was tun?**, **Neuer Job**, **Stelle verloren / RAV** — ruhige Orientierung mit Crosslinks, Fristen in den Kalender und Verkettung untereinander
- **Notrufnummern** (144/1414/145/112) als anrufbare `tel:`-Links im Unfall-/Krankheit-Ablauf
- **Loop-Closure Brief → Scan → Ablage**: nach dem Brief-Erstellen ruhiger Weg in den Dokumenten-Tresor (vorgefiltert aufs passende Kapitel)
- **UX-Playbook** (`docs/UX_PLAYBOOK.md`) als „Grundgesetz" + App-Teardowns (Budgetberatung, BlueBudget, Coople)
- **Persona-Walkthrough** (qualitativer Journey-Test der 8 Personas)

### Behoben
- BriefGenerator nutzte undefiniertes `palette.accent` → Druck-Button im Hellmodus unsichtbar; auf Palette-Konventionen umgestellt (Theme-sicher)
- KVG-Kündigungsbrief: Kassenname füllt korrekt (kkInsurer); Frist-Tag zählt; Speicher-Bestätigung nur bei Erfolg
- KTG-Hinweis konkretisiert (steht meist auf dem Lohnausweis)

---

## [0.1.4-beta] — 2026-06-28

Sammelrelease der Korrekturen aus dem 6-Domänen-Audit (Architektur, Schweizer Berechnungen, Design, Barrierefreiheit, Mehrsprachigkeit, Governance).

### Behoben
- **13. AHV-Rente**: Jahresrente rechnet ab 2026 mit ×13 statt ×12
- **SKOS-Vermögensfreibetrag** vereinheitlicht und auf Stand 2026 (6'000 Alleinstehende / 12'000 Paare / +3'000 pro Kind) — zuvor zwei widersprüchliche Werte
- **Prämienverbilligung im Dashboard-Schnellcheck** nutzt jetzt den kantonalen Rechner — keine abweichende Pauschalzahl mehr
- **Datenverlust-Schutz**: Autosave fängt vollen Speicher ab, Datei-Uploads sind grössenbegrenzt
- **Vertiefte Links** zu Einstellungen, Steuer-Import und Rechtlichem überstehen Neuladen und Teilen
- Korrekte Domain `malojaplana.ch` in Finanz-Ausdruck und PDF-Fuss
- Zwei fehlende Übersetzungstexte ergänzt (Generika-Hinweis, AHV-Feld im Kassen-Scanner)

### Geändert
- **Schulden-Abbau-Plan** ruhiger und barrierearm: klare Überschriften, Tab-Rollen, beschriftete Felder, wertungsfreier Status
- **Vorlesen** jetzt auch auf Schulden, Sozialhilfe, Asyl, Finanz-Übersicht, Stipendien, Prämienverbilligung und Flyer; Vorlese-Beschriftung in allen Sprachen
- Überfällig-Hinweis und Armuts-Einordnung optisch beruhigt
- Junge Erwachsene (19–25) bei der Prämienverbilligung als eigene Kategorie ausgewiesen

### Technisch
- `@capacitor/cli` in die Entwicklungs-Abhängigkeiten verschoben (Laufzeit bleibt abhängigkeitsfrei)
- Radius-Token zwischen JS und CSS synchronisiert
- Ereignis-Bus mit Ringpuffer und Fehler-Isolation gehärtet

---

## [0.1.3-beta] — 2026-06-28

### Hinzugefügt
- **Schulden-Abbau-Plan**: Konsequenz-Priorität nach Schweizer Beratungs-Praxis (existenzsichernd → amtlich → übrige nach Lawine/Schneeball) + wertungsfreie Beratungs-Box (0800 708 708)
- **Einfache Ansicht** ausgebaut: Kapitel-Karten icon-forward (nur Symbol + Titel) und grössere, kontrastreiche Formularfelder; Vorlesen pro Feld
- **Lebenslauf**: alle Anstellungen (Mehrfach-Jobs) erscheinen in Vorschau, HTML und JSON/ATS
- **Pilot-Einladung / One-Pager** (docs/proof-of-concept.md)

### Behoben
- Lebenslauf zeigte bisher nur den aktuellen Job, nicht die weiteren Anstellungen

---

## [0.1.2-beta] — 2026-06-28

### Hinzugefügt
- **Einstellungen-Bereich**: zentrale Seite, bündelt Anzeige/Sprache/Anrede u.a. — „jederzeit änderbar", mit Schnellzugriff Daten bearbeiten/sichern
- **Erwachsene im Haushalt**: einzeln hinzufügen wie Kinder (Vorname + Beziehung)
- **Schwarzweiss-/Ruhe-Modus**: entsättigte, reizarme Ansicht (dumbphone-nah)
- **Maschinenlesbarer Lebenslauf**: JSON-Resume-Export (ATS) im CV-Generator
- **Einfache Ansicht (Inkrement 1)**: Icon-Dashboard + automatisches Vorlesen; Umschalter in Menü, BetaGate und Onboarding
- **Sonne/Mond-Icons** am Hell/Dunkel-Schalter
- **Foodshiner** als Herzensempfehlung

### Geändert
- **Sprachauswahl**: eingeklappt kompaktes Kürzel (DE/EN/FR/IT/RM), aufgeklappt volle native Namen

### Behoben
- **Kanton-Crosslink** im Steuer-Brief: las `wohnen.canton` statt `basis.canton` → der Brief erhält jetzt den tatsächlich gesetzten Kanton

---

## [0.1.1-beta] — 2026-06-28

### Hinzugefügt
- **In-App-Suche**: Tools und Kapitel direkt finden
- **Merkliste**: persönliche To-Do-Liste mit Deeplinks zu Rechnern/Kapiteln (im verschlüsselten Backup enthalten)
- **Probier-Modus (Sandbox)**: Szenarien neben dem eigenen Stand durchrechnen, „leer starten", prominenter Einstieg auf Rechner-Seiten
- **PLZ-Vorschlags-Dropdown**: lokale, barrierearme PLZ→Ort/Kanton-Autofüllung im Wohnen-Feld
- **Vermögen & Wertschriften**: neue Sektion im Finanzen-Kapitel, gespiegelt in Finanz-Übersicht und Behörden-Dossier (Preview/Druck/JSON)
- **Steuerdatei-Import**: Eckwerte aus der Steuererklärung übernehmen
- **Sozialhilfe: Vermögensfreibetrag-Orientierung** (SKOS C.7)
- **Green-Hosting-Hinweis** im Footer (verifiziert via Green Web Foundation)

### Geändert
- **Finanz-Daten auf Stand 1.1.2026 (quellenverifiziert)**: AHV-/BVG-Werte (Min-/Max-Rente, Ehepaar-Plafond, Koordinationsabzug, Eintrittsschwelle, Grenzbeträge), Säule-3a-Höchstabzüge und SKOS-Grundbedarf aktualisiert. Direkte Bundessteuer auf den amtlichen ESTV-Tarif 2026 umgestellt (Stufen + Abzüge) — die Berechnung deckt sich nun aufs Rappen mit der ESTV-Tariftabelle. Quellen: BSV, ESTV/EFD (kalte Progression), SKOS.
- **Mehrsprachigkeit**: DE/FR/IT/RM auf volle EN-Parität (asyl, flyer, Suche, Merkliste, Vorsorge-international u. a.)
- **Akzentfarbe** als CSS-Token `--mp-accent`

### Behoben
- **PLZ-Kanton-Autofüllung** nur noch aus präziser Datenbank — der Range-Fallback lieferte bei ~18 % der Grenz-PLZ falsche, „klebende" Kantone
- **SKOS-Doppelquelle**: `cantonalData.js` und `sozialhilfeRechner.js` zeigten widersprüchliche Grundbedarfs-Werte (1'031 vs. 1'061) im selben View; vereinheitlicht + Konsistenz-Test
- **PLZ-Performance/Robustheit**: 165 kB eager im Initial-Bundle → dynamisch; verlorene Validierung; Blur-Timer-Leak
- Diverse i18n-Lücken, die auf EN zurückfielen

### Tests & Infrastruktur
- **Test-Guards** gegen Drift: i18n-Key-/Platzhalter-/Anrede-Parität, `createT`-Kern, Finanz-/Sozialhilfe-/IPV-/EL-Logik (~186 → 314+ Tests)
- **Schriftlizenzen**: SIL OFL 1.1 Texte zu den WOFF2 gelegt
- **Deploy**: lokales SFTP-Script zu Infomaniak; CI-Auto-Deploy pausiert (Infomaniak blockt CI-Runner-IPs)

---

## [0.1.0-beta] — 2026-06-23

### Hinzugefügt
- **Wartungs-Infrastruktur**: Automatische Quartals-Erinnerungen via GitHub Actions, Wartungskalender, Claude-Wartungs-Prompts
- **Ticketing**: GitHub Issue Templates (Bug, Feature, Wartung)
- **Changelog**: Dieses Dokument

### Geändert
- Version von `0.1.0-alpha` auf `0.1.0-beta` aktualisiert

---

## [0.1.0-alpha.8] — 2026-06-23

### Hinzugefügt
- **Print-Stylesheet**: Sauberes A4-Layout, Footer/Header ausgeblendet
- **Unicode-Fix**: `font-variant-emoji: text` verhindert Emoji-Rendering auf Android
- **CTA-Bereinigung**: Doppelter Demo-Button auf Dashboard entfernt

### Geändert
- `known-issues-beta.md` komplett überarbeitet (28 erledigte Verbesserungen dokumentiert)

---

## [0.1.0-alpha.7] — 2026-06-23

### Hinzugefügt
- **Bundle-Splitting**: PLZ- und Prämien-Daten als separate Chunks (247KB → 124KB)
- **Error Boundaries**: Per-View Fehlerbehandlung (App crasht nicht komplett)
- **A11y**: Skip-Link, focus-visible, ARIA-Labels, Logo als Keyboard-Link
- **Rätoromanisch 100%**: 2000+ Keys, volle DE-Parität

### Geändert
- PraemienOrientierung-Chunk von 247KB auf 124KB reduziert

---

## [0.1.0-alpha.6] — 2026-06-22

### Hinzugefügt
- **Trust-Panel**: Aufklappbare Datenschutz-Erklärung im Footer (5 Sprachen)
- **PWA**: manifest.id für stabiles Install-Tracking
- **SEO**: canonical, Schema.org, OG/Twitter Cards, SafeSearch-Rating
- **Ressourcen**: Threema, SecureSafe, IncaMail, Beratungsstellen, Petitionen
- **KVG-Leistungen**: Franchise-Tracker und Rechnungserklärung
- **Feature-Walkthrough**: Alle 15 Views systematisch verifiziert

---

## [0.1.0-alpha.5] — 2026-06-21

### Hinzugefügt
- **Finanz-Übersicht**: Kompaktansicht aller Rechner-Ergebnisse + BFS-Branchenvergleich
- **Cross-Links**: Steuer-, IPV-, Sozialhilfe-, Vorsorge-Rechner verlinken zueinander
- **Dashboard-Snippets**: Versicherungen, Behörden, Notfall, Finanzen
- **Behörden-Checkliste**: Interaktive Checkliste (localStorage-persistent, 5 Sprachen)
- **Demo-Einstieg**: Prominente Demo-Card für Erstnutzer
- **Dropdown-UX**: Custom Chevron + appearance:none für alle Selects

---

## [0.1.0-alpha.4] — 2026-06-20

### Hinzugefügt
- **Fortschrittskarte**: Status-Label über Berglandschaft + Kapitel-Labels
- **Rätoromanisch**: 5. Sprache (Grundausstattung)
- **3a-Guthaben-Feld**: Eigenes Eingabefeld für Säule-3a-Stand
- **Sozialhilfe**: Rückzahlungs-Info + Disclaimer visuell hervorgehoben

---

## [0.1.0-alpha.3] — 2026-06-19

### Hinzugefügt
- **Kantonale Links**: Direkt-Links zu allen 26 Kantonen
- **Behörden-Dossier**: JSON-Export für Sozialamt-Termine
- **Backup-Versionierung**: Automatische Versionierung bei Export

---

## [0.1.0-alpha.2] — 2026-06-18

### Hinzugefügt
- **Design-Asymmetrie**: Layout-Verfeinerungen (A-030 Audit)
- **17 kaputte Links gefixt**: Kantonal + federal
- **SW-Cache v7**: Service Worker Cache-Invalidierung

---

## [0.1.0-alpha.1] — 2026-06

### Hinzugefügt
- **Phase 5 komplett**: Encrypted Backup (AES-256-GCM), Data Validation, Print CSS
- **Phase 4 komplett**: Alle 7 Kapitel, Rechner (Steuer, IPV, Sozialhilfe, Vorsorge, EO, Budget)
- **Phase 3 komplett**: i18n (DE/EN/FR/IT), Datenimport, Migration
- **Phase 2 komplett**: Dashboard, Navigation, Theme Toggle
- **Phase 1 komplett**: Grundstruktur, BetaGate, localStorage
