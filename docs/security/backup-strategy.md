# Backup-Strategie — Maloja Plana

**Gemäss ISO 27001:2022 Annex A.8.13**

---

## Architektur

Maloja Plana ist local-first — die Anbieterin erstellt keine Backups der Nutzerdaten. Die Verantwortung liegt vollständig bei der nutzenden Person.

---

## Verfügbare Backup-Mechanismen

| Mechanismus | Format | Verschlüsselung | Auslöser |
|---|---|---|---|
| Manuelles Backup | JSON (AES-256-verschlüsselt) | Ja, Passwort der nutzenden Person | Button im Dashboard |
| Lebensmappe Export | HTML | Nein (Klartext) | Button in Lebensmappe |
| ZIP-Gesamtexport | ZIP mit JSON + Manifest | Optional | Button in Einstellungen |
| Auto-Backup Erinnerung | — | — | Banner nach 30 Tagen ohne Backup |

---

## Verschlüsselung

- Algorithmus: AES-256-GCM (Web Crypto API)
- Schlüssel: PBKDF2-abgeleitet aus Nutzerpasswort
- Salt: Zufällig generiert pro Backup
- IV: Zufällig generiert pro Verschlüsselung
- Implementierung: `src/utils/backupCrypto.js`

---

## Wiederherstellung

- Import über Backup-Dialog im Dashboard
- Passwort wird zur Entschlüsselung benötigt
- Kein Passwort-Recovery möglich (kein Server)
- Restore überschreibt bestehende lokale Daten

---

## Risiken und Empfehlungen

| Risiko | Empfehlung an Nutzende |
|---|---|
| Browser-Cache gelöscht | Regelmässig Backup erstellen |
| Gerät verloren/defekt | Backup auf separatem Medium speichern |
| Passwort vergessen | Passwort sicher aufbewahren (kein Recovery) |
| Browser-Update löscht Daten | Backup vor grossen Updates |

---

## Hinweis für Tester

Die Backup-Funktion ist funktional, aber noch nicht automatisiert. Eine Erinnerung erscheint nach 30 Tagen ohne Backup.
