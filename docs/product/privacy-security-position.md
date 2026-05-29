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
- Manueller ZIP-Export möglich
- Backup-Dateien sind unverschlüsselt (Klartext JSON)

### Offline-Fähigkeit
- Vollständig offline nutzbar nach erstem Laden
- Keine Funktionalität erfordert Internetverbindung

### Analytics
- **Vercel Speed Insights**: Anonyme Performance-Metriken (Web Vitals)
- Keine personenbezogenen Daten, keine Cookies, kein User-Tracking
- Kann durch Nutzer nicht deaktiviert werden (eingebettet im Build)

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
| Vercel Speed Insights opt-out | Klein | P2 |
| Automatische Regelwerk-Aktualisierung | Hoch | Nicht geplant — widerspricht offline-first |

---

## Fazit

Maloja Plana ist ein **lokales Organisationswerkzeug**, kein Sicherheitsprodukt.

Die Sicherheit basiert auf dem Prinzip **"Deine Daten verlassen Dein Gerät nie"** — das ist ein starkes Versprechen, aber kein vollständiges Sicherheitskonzept.

Für die Beta-Phase ist diese Position ehrlich und angemessen. Verschlüsselung und Zugriffschutz sind sinnvolle Verbesserungen für spätere Phasen, aber keine Beta-Blocker.
