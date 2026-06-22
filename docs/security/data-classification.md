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
| C4 | localStorage + IndexedDB (lokal) | AES-256 bei Backup/Export | Keine |
| C3 | localStorage (lokal) | AES-256 bei Backup/Export | Keine |
| C2 | localStorage (lokal) | AES-256 bei Backup/Export | Keine |
| C1 | localStorage (lokal) | Nein (nicht nötig) | Keine |

**Alle Stufen: Keine serverseitige Verarbeitung, keine Cloud, keine Übermittlung an Dritte.**

---

## Aufbewahrung und Löschung

| Aktion | Verantwortung |
|---|---|
| Speicherung | Automatisch lokal im Browser |
| Löschung einzelner Daten | Nutzende Person (Felder leeren) |
| Löschung aller Daten | Nutzende Person (Browser-Daten löschen oder App-Reset) |
| Backup | Nutzende Person (verschlüsselter Export) |
| Gerätewechsel | Nutzende Person muss Backup/Restore nutzen |

---

## Besonderheit: Local-First-Architektur

Die Anbieterin hat **keinen technischen Zugriff** auf Daten jeglicher Klassifikationsstufe. Die gesamte Verantwortung für Datensicherheit auf Geräteebene liegt bei der nutzenden Person.

Dies reduziert das Risikoprofil erheblich:
- Kein Data Breach durch Server-Kompromittierung möglich
- Kein Zugriff durch Mitarbeitende der Anbieterin
- Keine Anfragen von Behörden an die Anbieterin möglich (keine Daten vorhanden)
