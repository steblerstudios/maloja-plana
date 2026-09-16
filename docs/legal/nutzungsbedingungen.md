# Nutzungsbedingungen — Maloja Plana

**Stand: 16.09.2026** (erstellt Juni 2026; Nachführung am Ende)

---

## 1. Geltungsbereich

Diese Nutzungsbedingungen gelten für die Nutzung von Maloja Plana (nachfolgend „Anwendung"), bereitgestellt von Sophie Stebler / Stebler Studios, Basel, Schweiz.

---

## 2. Leistungsbeschreibung

Maloja Plana ist ein kostenloser, quelloffener Schweizer Lebensordner. Die Anwendung bietet:
- Persönliche Datenorganisation in 7 Lebenskapiteln
- Orientierungsrechner (Steuer, IPV, Sozialhilfe, AHV/BVG, EO, Mindestlohn)
- Notfallkarte, Budget-Übersicht, Dokumententresor
- Export-Funktionen (Backup, Lebensmappe)

Die Anwendung funktioniert vollständig im Browser. Es gibt kein Benutzerkonto, kein Backend und keine Cloud-Anbindung.

---

## 3. Keine Beratung

Die Anwendung dient der **Orientierung und Organisation**. Sie ersetzt keine:
- Rechtsberatung
- Steuerberatung
- Versicherungsberatung
- Finanzberatung
- medizinische Beratung

Berechnungen basieren auf öffentlich zugänglichen Rechtsgrundlagen (DBG, KVG, SKOS-Richtlinien, AHVG, BVG, EOG) und können von der individuellen Situation abweichen. Massgebend sind die zuständigen Behörden und Fachstellen.

---

## 4. Datenspeicherung und Eigenverantwortung

- Alle Daten werden ausschliesslich lokal im Browser gespeichert (localStorage, IndexedDB)
- Die Anbieterin hat **keinen Zugang** zu den Daten der nutzenden Person
- Die nutzende Person ist selbst verantwortlich für:
  - Regelmässige Backups (Sicherungsfunktion in der Anwendung unter Werkzeuge → Export; die Sicherungsdatei ist in der Voreinstellung mit einem Passwort verschlüsselt, das die Anbieterin nicht kennt und nicht zurücksetzen kann)
  - Schutz des Geräts vor unbefugtem Zugriff
  - Löschen der Daten bei Gerätewechsel oder -entsorgung (in der Anwendung unter Einstellungen → «Daten auf diesem Gerät» → «Alle Daten auf diesem Gerät löschen», oder über die Browserdaten)
- Das Löschen der Browserdaten oder der Löschweg in der Anwendung führt zum **unwiderruflichen Verlust** aller nicht als Datei gesicherten Daten

---

## 5. Verfügbarkeit

Es besteht kein Anspruch auf ununterbrochene Verfügbarkeit der Anwendung. Die Anbieterin kann die Anwendung jederzeit ändern, einschränken oder einstellen.

---

## 6. Haftung

Die Anbieterin haftet nicht für:
- Schäden aus der Nutzung oder Nichtnutzung der Berechnungen
- Datenverlust durch Browser-Updates, Gerätewechsel oder fehlende Backups
- Folgen von Entscheidungen, die auf Grundlage der Anwendungsinhalte getroffen werden
- Verfügbarkeit oder Fehler der Anwendung

Die Haftung für vorsätzlich oder grobfahrlässig verursachte Schäden bleibt vorbehalten.

---

## 7. Geistiges Eigentum

Der Quellcode ist unter der [GNU Affero General Public License v3.0](../../LICENSE.txt) lizenziert. Die Nutzung unterliegt den Bedingungen dieser Lizenz.

Für kommerzielle Nutzung (White-Label, Enterprise) ist eine separate Lizenz erforderlich. Kontakt: info@malojaplana.ch

---

## 8. Änderungen

Die Anbieterin behält sich vor, diese Nutzungsbedingungen jederzeit zu ändern. Die jeweils aktuelle Fassung gilt ab Veröffentlichung.

---

## 9. Anwendbares Recht und Gerichtsstand

Es gilt Schweizer Recht. Gerichtsstand ist Basel-Stadt, Schweiz.

---

Abschnitt 4 und Kopf-Datum: am 16.09.2026 an Verschlüsselung als Voreinstellung (Bau-Liste E10) und den Löschweg (E18) angeglichen, Code-Stand `main` 3500330 (Bau-Liste K39), nicht juristisch geprüft. Bis dahin stand in Abschnitt 4 «Das Löschen des Browser-Cache oder der Browserdaten führt zum unwiderruflichen Verlust»; die Angaben liegen im localStorage und in der IndexedDB, der Cache des Service Workers enthält nur App-Dateien (`public/sw.js`, Kommentar in `src/utils/datenLoeschen.js` Z. 10–11).
