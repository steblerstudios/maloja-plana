# Datenschutz & Sicherheit — Ehrliche Positionsbestimmung

> Stand: 2026-05-29
> Zweck: Dokumentiert, was Maloja Plana heute wirklich macht und was NICHT.
> Keine Marketing-Versprechen. Keine ISO-Behauptungen. Nur Fakten.

---

## Was Maloja Plana heute macht

### Datenspeicherung
- **localStorage** (`or5_data`, `or5_docs`, `or5_reminders`): Alle Nutzerdaten
- **IndexedDB** (`ordnung-ruhe-docs`, `ordnung-ruhe-backups`): Dokumente und Backups
- **Kein Server, kein Backend, kein Login, kein Account**
- **Kein Cloud-Sync, keine Datenübertragung an Dritte**
- Daten verlassen das Gerät nie, ausser der Nutzer exportiert sie aktiv

### Backup
- Automatische lokale Backups im Browser (IndexedDB)
- Manueller Export als Einzeldateien möglich (JSON, CSV, `MANIFEST.txt`; kein ZIP)
- Sicherung als Klartext-JSON oder, auf Wunsch, verschlüsselt als `.maloja` (AES-256-GCM, `src/utils/backupCrypto.js`)

### Offline-Fähigkeit
- Nach dem ersten Laden auch offline nutzbar — in der Regel in den Bereichen, die schon einmal geöffnet wurden
  (der Service Worker legt nachgeladene Teile erst beim ersten Öffnen ab, `public/sw.js`)
- Für die Nutzung selbst ist keine Serververbindung nötig; Links auf Behörden-Seiten brauchen Internet

### Analytics
- **Keine.** Kein Analytics-, Tracking- oder Performance-Messdienst ist eingebunden.
- Belege (geprüft 17.09.2026, K57): keine Vercel- oder Speed-Insights-Abhängigkeit in `package.json`
  und `package-lock.json`, kein Treffer für «vercel»/«speed insights» in `src/` und `index.html`;
  die CSP in `index.html` erlaubt Verbindungen nur zur eigenen Adresse (`connect-src 'self'`).
- Hosting: Infomaniak (Schweiz) über `deploy.sh`, nicht Vercel.
- *Korrigiert 17.09.2026: Hier stand bis dahin «Vercel Speed Insights» — veraltet, das Hosting
  läuft nicht mehr über Vercel und Speed Insights ist nicht im Build.*

---

## Was Maloja Plana NICHT macht / NICHT hat

### Keine Zertifizierungen
- **Keine ISO 27001** (Informationssicherheits-Management)
- **Keine FINMA-Prüfung** (keine Finanzdienstleistung)
- **Keine medizinische Zertifizierung** (keine Medizinprodukt-Eigenschaft)
- **Kein Datenschutz-Audit** durch externe Stelle

### Keine Verschlüsselung
- localStorage ist **nicht verschlüsselt** — jeder mit Zugang zum Browser kann die Daten lesen
- IndexedDB ist **nicht verschlüsselt**
- Exportierte Dateien sind **nicht verschlüsselt**
- Es gibt **keine Passwort-Sperre** für die App

### Keine Rechts-/Finanzberatung
- Berechnungen (SKOS, IPV, Budget, Steuern) sind **Orientierungswerte**
- Kantonale Unterschiede werden **nur teilweise** berücksichtigt
- Schweizer Regelungen können **veraltet oder unvollständig** sein
- Maloja Plana übernimmt **keine Haftung** für Entscheidungen auf Basis der angezeigten Daten

### Kein Zugriffschutz
- Wer das Gerät entsperrt, hat Zugang zu allen Maloja-Daten
- Keine Biometrie, kein PIN, kein Session-Timeout
- Geteilte Geräte = geteilte Daten

---

## Bekannte Risiken

| Risiko | Schwere | Mitigation |
|--------|---------|------------|
| Datenverlust bei Browser-Reset | Hoch | Backup-Export verfügbar, aber Nutzer muss aktiv exportieren |
| QR-Code-Libraries laden von CDN | Mittel | Betrifft nur OrganDonation + KKScanner; funktioniert offline nicht |
| localStorage-Limit (~5-10MB) | Niedrig | StorageWarning-Komponente warnt bei > 80% |
| Unverschlüsselte Daten auf Gerät | Mittel | Geräte-Verschlüsselung liegt beim Nutzer |
| Veraltete Schweizer Regelungen | Mittel | Alpha-Banner + Legal-Disclaimer; keine automatische Aktualisierung |
| Export-Dateien können sensible Daten enthalten | Niedrig | Privacy-Hinweis in Export-View |

---

## Was verbessert werden könnte (kein Versprechen)

| Verbesserung | Aufwand | Priorität |
|-------------|---------|-----------|
| Verschlüsselung localStorage/IndexedDB | Mittel | P2 — nach Beta |
| App-Sperre (PIN/Biometrie) | Hoch | P2 — nach Beta |
| Backup-Verschlüsselung | Mittel | P2 |
| Automatische Regelwerk-Aktualisierung | Hoch | Nicht geplant — widerspricht offline-first |

---

## Fazit

Maloja Plana ist ein **lokales Organisationswerkzeug**, kein Sicherheitsprodukt.

Die Sicherheit basiert auf dem Prinzip **"Deine Daten verlassen Dein Gerät nie"** — das ist ein starkes Versprechen, aber kein vollständiges Sicherheitskonzept.

Für die Beta-Phase ist diese Position ehrlich und angemessen. Verschlüsselung und Zugriffschutz sind sinnvolle Verbesserungen für spätere Phasen, aber keine Beta-Blocker.
