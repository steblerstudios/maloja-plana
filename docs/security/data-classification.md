# Datenklassifikation — Maloja Plana

**Gemäss ISO 27001:2022 Annex A.5.12 / nDSG Art. 5**

---

## Klassifikationsstufen

| Stufe | Bezeichnung | Beispiele in Maloja Plana |
|---|---|---|
| **C4 — Besonders schützenswert** | Besonders schützenswerte Personendaten (nDSG Art. 5 lit. c) | AHV-Nummer, Gesundheitsdaten (Organspende, KK-Modell), religiöse/politische Zugehörigkeit |
| **C3 — Vertraulich** | Personendaten mit erhöhtem Schutzbedarf | Einkommen, Steuerdaten, Bankverbindung, Mietvertrag, Arbeitgeber, Schulden |
| **C2 — Intern** | Allgemeine Personendaten | Name, Adresse, Geburtsdatum, Telefon, E-Mail, Nationalität, Familienstand |
| **C1 — Öffentlich** | Keine Personendaten | App-Einstellungen, Sprache, Theme, Onboarding-Status |

---

## Datenfluss und Speicherort

| Klassifikation | Speicherort | Verschlüsselung | Übermittlung |
|---|---|---|---|
| C4 | localStorage + IndexedDB (lokal), unverschlüsselt at rest | Beim Backup-Export **optional** (AES-256-GCM); Klartext-Export gleichberechtigt möglich | Keine |
| C3 | localStorage (lokal), unverschlüsselt at rest | Beim Backup-Export **optional** (AES-256-GCM); Klartext-Export gleichberechtigt möglich | Keine |
| C2 | localStorage (lokal), unverschlüsselt at rest | Beim Backup-Export **optional** (AES-256-GCM); Klartext-Export gleichberechtigt möglich | Keine |
| C1 | localStorage (lokal) | Nein (nicht nötig) | Keine |

**Alle Stufen: Keine serverseitige Verarbeitung, keine Cloud, keine Übermittlung an Dritte.**

Zum Stand der Verschlüsselung (15.09.2026, Code-Stand `main` 9e6d9b1):
- **Gebaut:** verschlüsselter Export als `.maloja`-Datei (AES-256-GCM, PBKDF2, Passphrase mindestens 4 Zeichen — `src/utils/backupCrypto.js` Z. 107, Krypto-Primitive in `src/utils/cryptoCore.js`). Die nutzende Person wählt beim Export; der Klartext-Export (JSON) ist der Standardweg und immer verfügbar (`backupCrypto.js` Z. 4: «Encryption is optional — plaintext export always available»; `src/ZipExport.jsx` Z. 24–28, 56, 85). Die automatischen Schnappschüsse in der IndexedDB `maloja-plana-backups` sind unverschlüsselt.
- **Geplant / nicht gebaut:** Verschlüsselung der Daten at rest (Tresor). Konzept in `docs/design/tresor-lock.md`; das Krypto-Fundament (`secureStore.js`) liegt dormant, die Live-Verdrahtung ist bewusst auf die «Logins-Phase» vertagt.
- Bis zum 15.09.2026 stand in der Tabelle für C2–C4 «AES-256 bei Backup/Export» ohne den Zusatz «optional»; das las sich wie eine Pflicht-Verschlüsselung, die es nicht gibt.

---

## Aufbewahrung und Löschung

| Aktion | Verantwortung |
|---|---|
| Speicherung | Automatisch lokal im Browser |
| Löschung einzelner Daten | Nutzende Person (Felder leeren) |
| Löschung aller Daten | Nutzende Person (Browser-Daten für malojaplana.ch löschen). Ein App-Reset ist nicht gebaut (Stand 15.09.2026): `storage.clear()` in `src/utils/storage.js` Z. 37–45 hat keinen Aufrufer, `src/SettingsView.jsx` enthält keinen Reset |
| Backup | Nutzende Person (Export wahlweise als Klartext-JSON, CSV oder verschlüsselte `.maloja`-Datei; dazu automatische, unverschlüsselte Schnappschüsse in der IndexedDB, rollierend max. 5 — `src/utils/autoBackup.js` Z. 14) |
| Gerätewechsel | Nutzende Person muss Backup/Restore nutzen |

---

## Besonderheit: Local-First-Architektur

Die Anbieterin hat **keinen technischen Zugriff** auf Daten jeglicher Klassifikationsstufe. Die gesamte Verantwortung für Datensicherheit auf Geräteebene liegt bei der nutzenden Person.

Dies reduziert das Risikoprofil erheblich:
- Kein Data Breach durch Server-Kompromittierung möglich
- Kein Zugriff durch Mitarbeitende der Anbieterin
- Keine Anfragen von Behörden an die Anbieterin möglich (keine Daten vorhanden)

---

Stand: 15.09.2026, auf Code-Stand `main` 9e6d9b1 gebracht, nicht juristisch geprüft.
