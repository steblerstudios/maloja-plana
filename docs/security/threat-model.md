# Threat Model

Jede Minderung ist seit dem 15.09.2026 als **gebaut** (im Code auf `main` 9e6d9b1 vorhanden) oder als **geplant / nicht gebaut** gekennzeichnet. Bis dahin standen hier alle Minderungen ohne diese Unterscheidung; das versprach Schutz, den die App nicht bietet (DSFA-Entwurf `docs/legal/dsfa-kurzfassung.md`, Abschnitt 7 Punkt 5). Die ursprünglichen Stichworte bleiben stehen, damit sichtbar ist, was das Ziel war.

## Hauptbedrohungen

### Gerät wird gestohlen
Risiko:
- localStorage lesbar
- Browserdaten zugänglich

Minderung — gebaut:
- Verschlüsselter Backup-Export als `.maloja`-Datei (AES-256-GCM, PBKDF2; `src/utils/backupCrypto.js`, Krypto-Primitive in `src/utils/cryptoCore.js`). **Optional** — die nutzende Person wählt beim Export.
- Hinweis an die nutzende Person, das Gerät mit Passwort/PIN zu sichern (Datenschutzerklärung §8; App-Text `legal.privacy.security2` in `src/i18n/de.js`).

Minderung — geplant / nicht gebaut (Stand 15.09.2026):
- **AES-Verschlüsselung** der Daten at rest: die Daten liegen heute unverschlüsselt im localStorage (`or5_*`) und in der IndexedDB. Der Tresor ist als Konzept festgehalten (`docs/design/tresor-lock.md`); das Krypto-Fundament (`src/utils/secureStore.js`) liegt dormant, die Live-Verdrahtung ist bewusst auf die «Logins-Phase» vertagt.
- **Session-Lock**: kein Lock im Prod-Build. `LockScreen.jsx` ist eine Design-Vorschau, die nur im DEV-Modus geladen wird (`src/main.jsx` Z. 70, 1325–1327; `import.meta.env.DEV`).
- **«Kein Klartext-Export»**: trifft nicht zu. Seit Bau-Liste E10 (16.09.2026) ist der verschlüsselte Export die Voreinstellung (`src/ZipExport.jsx` Z. 339–358); der Klartext-Export (JSON) bleibt wählbar, mit Hinweis darunter (Z. 360–367) und mit der Export-Vorschau davor (`src/components/ExportVorschau.jsx` Z. 66–68). Bis dahin war der Klartext-Export der Standardweg, und hier stand, ein Hinweis davor sei offen.

---

### Shared Computer
Risiko:
- Offene Session
- Browser speichert Daten

Minderung — gebaut:
- **Lokale Warnungen**, soweit belegt: Hinweis in den Rechtstexten der App (Datenschutzerklärung §8 «Lösche Deine Browserdaten, wenn Du ein geteiltes Gerät verwendest»; `legal.privacy.security2`). Eine aktive Warnung in der Oberfläche (z. B. beim Start auf einem geteilten Gerät) ist nicht belegt.

Minderung — geplant / nicht gebaut (Stand 15.09.2026):
- **Auto-Lock** und **Session Timeout**: nicht gebaut; Teil des Tresor-Konzepts (`docs/design/tresor-lock.md`), gleiche Vertagung wie oben. Bis dahin bleibt der Weg: Browserdaten für malojaplana.ch löschen (Datenschutzerklärung §7.2). Ein In-App-Reset «alle Daten zurücksetzen» ist ebenfalls nicht gebaut (`storage.clear()` in `src/utils/storage.js` Z. 37–45 ohne Aufrufer).

---

### Browser Storage Limits
Risiko:
- IndexedDB Corruption
- Storage eviction

Minderung — gebaut:
- **Backup Export**: manuell als JSON / CSV / `.maloja` (`src/ZipExport.jsx`); automatische Schnappschüsse in der IndexedDB `maloja-plana-backups`, rollierend max. 5 (`src/utils/autoBackup.js` Z. 11–14); Sicherheitskopien `or5_*_prerestore` vor jedem Import (`backupCrypto.js` Z. 216–227).
- **Storage Monitor**: `src/utils/storageMonitor.js` (Test-Schreibvorgang, fängt `QuotaExceededError`, Z. 82).
- **Export Erinnerungen**: das Dashboard zeigt das Datum des letzten Backups (`or5_lastBackup`, `src/Dashboard.jsx` Z. 748–750; gesetzt in `ZipExport.jsx` Z. 58, 86). Ob daraus eine aktive Erinnerung wird (Hinweis nach Ablauf einer Frist), ist hier nicht geprüft.

---

Stand: 15.09.2026, auf Code-Stand `main` 9e6d9b1 gebracht, nicht juristisch geprüft.
