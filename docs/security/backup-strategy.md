# Backup-Strategie — Maloja Plana

**Gemäss ISO 27001:2022 Annex A.8.13**

---

## Architektur

Maloja Plana ist local-first — die Anbieterin erstellt keine Backups der Nutzerdaten. Die Verantwortung liegt vollständig bei der nutzenden Person.

---

## Verfügbare Backup-Mechanismen

| Mechanismus | Format | Verschlüsselung | Auslöser |
|---|---|---|---|
| Sicherung (Klartext) | `maloja-plana-backup-<Datum>.json`, mit Dokumenten | Nein | Werkzeuge → Export, Knopf ohne weitere Eingabe |
| Sicherung (verschlüsselt) | `maloja-plana-backup-<Datum>.maloja`, mit Dokumenten | Ja, AES-256-GCM mit Passphrase der nutzenden Person (mind. 4 Zeichen) | Werkzeuge → Export, erst nach Eingabe und Bestätigung der Passphrase |
| Lebensmappe Export | HTML in neuem Fenster, zum Drucken oder Speichern als PDF; ist das Fenster blockiert, Download als `.html` | Nein (Klartext) | Button in Lebensmappe |
| Datei-Export (Einzeldateien, kein ZIP) | JSON, CSV, `MANIFEST.txt` | Nein | Werkzeuge → Export |
| Automatische Schnappschüsse | Kopie im Browser (IndexedDB `maloja-plana-backups`), keine Datei | Nein | Beim Start der App, höchstens alle 12 Stunden, max. 5 |
| Sicherungs-Erinnerung | — | — | Hinweis im Dashboard, wenn Daten erfasst sind und die letzte Sicherung fehlt oder älter als 7 Tage ist |

**Verschlüsselung ist optional.** Die Klartext-Sicherung ist der Standardweg: Sie braucht keine Eingabe und steht als erster Knopf da. Verschlüsselt wird nur, wer eine Passphrase eingibt und bestätigt. Vor jeder Datei nennt eine Vorschau, was darin steht und ob die Datei verschlüsselt ist («Nicht verschlüsselt: Wer die Datei öffnet, kann sie lesen.»). Belege: `src/utils/backupCrypto.js` Z. 4 («Encryption is optional — plaintext export always available»), Z. 94–97 (`exportPlaintext`) und Z. 103–136 (`exportEncrypted`); `src/ZipExport.jsx` Z. 59–77 (Klartext-Sicherung), Z. 81–108 (Passphrase-Prüfung und verschlüsselte Sicherung), Z. 339–357 (Knöpfe); `src/components/ExportVorschau.jsx` Z. 66–68.

Voreinstellung und Mindestlänge der Passphrase: offen, Bau-Liste E10/E31.

Belege für die übrigen Zeilen: Lebensmappe `src/Lebensmappe.jsx` Z. 23 und `src/utils/helpers.js` Z. 58–72 (`openPrintWindow`); Datei-Export `src/ZipExport.jsx` Z. 32–57 und `src/zipExport.js` Z. 146–161; Schnappschüsse `src/utils/autoBackup.js` Z. 11–15 und `src/main.jsx` Z. 580–587 (in der Demo ausgesetzt); Erinnerung `src/Dashboard.jsx` Z. 1680–1712. Die Erinnerung richtet sich nach `or5_lastBackup`, das nur die beiden Sicherungen setzen (`ZipExport.jsx` Z. 66 und 101), nicht der JSON-/CSV-Export.

Bis zum 16.09.2026 stand hier: «Manuelles Backup · JSON (AES-256-verschlüsselt) · Ja · Button im Dashboard» und «Banner nach 30 Tagen ohne Backup». Das traf nicht zu: Die Verschlüsselung war nie Pflicht, die Sicherung liegt unter Werkzeuge → Export, und die Erinnerung erscheint nach 7 Tagen.

---

## Verschlüsselung (nur die `.maloja`-Sicherung)

- Algorithmus: AES-256-GCM (Web Crypto API)
- Schlüssel: PBKDF2-SHA-256 mit 100 000 Iterationen, abgeleitet aus der Passphrase der nutzenden Person (`src/utils/cryptoCore.js` Z. 18 und 35–47)
- Passphrase: mindestens 4 Zeichen (`backupCrypto.js` Z. 107; `ZipExport.jsx` Z. 82)
- Salt: 16 Byte, zufällig generiert pro Backup
- IV: 12 Byte, zufällig generiert pro Verschlüsselung
- Implementierung: `src/utils/backupCrypto.js`
- Nicht verschlüsselt sind: die Klartext-Sicherung (`.json`), der Datei-Export (JSON, CSV, `MANIFEST.txt`), die Lebensmappe und die automatischen Schnappschüsse im Browser

---

## Wiederherstellung

- Import unter Werkzeuge → Export, Bereich «Sicherung importieren»; angenommen werden `.json` und `.maloja`, höchstens 50 MB (`ZipExport.jsx` Z. 110–142, 369; `backupCrypto.js` Z. 30)
- Die Passphrase wird nur für `.maloja`-Dateien benötigt
- Kein Passwort-Recovery möglich (kein Server)
- Vor dem Schreiben prüft die App den Aufbau der Datei und fragt nach einer Bestätigung; passt der Aufbau nicht, wird nichts geschrieben (`ZipExport.jsx` Z. 169–200; `backupCrypto.js` Z. 286–294)
- Die App legt vorher Sicherheitskopien `or5_*_prerestore` an (`backupCrypto.js` Z. 216–227); sie werden nicht automatisch gelöscht
- Restore überschreibt die bestehenden lokalen Daten, soweit die Datei sie enthält (`backupCrypto.js` Z. 234–276)
- Für die automatischen Schnappschüsse gibt es heute keine Wiederherstellung in der Oberfläche: `restoreBackup` in `src/utils/autoBackup.js` hat ausserhalb der Datei keinen Aufrufer

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

Die Sicherung als Datei ist funktional, aber nicht automatisiert: Eine Datei entsteht nur auf Knopfdruck. Automatisch entstehen nur die Schnappschüsse im Browser, die mit den Browserdaten verloren gehen. Eine Erinnerung erscheint, wenn die letzte Sicherung fehlt oder älter als 7 Tage ist.

(Bis zum 16.09.2026 stand hier «noch nicht automatisiert» ohne die Schnappschüsse und «nach 30 Tagen».)

---

Stand: 16.09.2026, auf Code-Stand `main` 8399deb (0.1.28-beta) gebracht (Bau-Liste K28).
