# Datenschutzerklärung — Maloja Plana

**Gemäss neuem Datenschutzgesetz (nDSG), in Kraft seit 1. September 2023**
**Stand: Juni 2026**

---

## 1. Verantwortliche Person (Art. 19 Abs. 2 lit. a nDSG)

Sophie Stebler
Basel, Schweiz
E-Mail: sophie.stebler@gmail.com
Web: steblerstudios.github.io/maloja-plana

Maloja Plana ist ein nicht-kommerzielles Open-Source-Projekt. Es gibt keinen Datenschutzberater im Sinne von Art. 10 nDSG, da die Datenbearbeitung ausschliesslich lokal auf dem Gerät der nutzenden Person stattfindet.

---

## 2. Grundsatz: Lokale Datenverarbeitung

Maloja Plana ist eine **Local-First-Webanwendung**. Das bedeutet:

- Alle persönlichen Daten werden **ausschliesslich auf Deinem Gerät** gespeichert (im Browser-localStorage und in der IndexedDB).
- Es gibt **keinen Server, kein Backend und keine Cloud**, die Deine Daten empfängt oder verarbeitet.
- Es gibt **kein Benutzerkonto** und keine Registrierung.
- Die Anwendung funktioniert **vollständig offline**.

**Es findet keine systematische Übermittlung von Personendaten an die Betreiberin oder an Dritte statt.**

---

## 3. Welche Daten werden lokal gespeichert?

Die folgenden Daten werden ausschliesslich in Deinem Browser gespeichert:

| Datenkategorie | Speicherort | Zweck |
|---|---|---|
| Persönliche Angaben (Name, Geburtsdatum, Adresse, Kontaktdaten) | localStorage (`or5_data`) | Selbstorganisation, Kapitelübersichten |
| Haushaltsdaten (Wohnsituation, Miete, Einkommen) | localStorage (`or5_data`) | Budget- und Sozialhilfe-Orientierung |
| Versicherungsdaten (KVG-Prämien, Policen) | localStorage (`or5_data`) | Versicherungsübersicht |
| Dokumente und Dateien | IndexedDB (`ordnung-ruhe-documents`) | Dokumentenablage |
| Erinnerungen und Fristen | localStorage (`or5_reminders`) | Fristenverwaltung |
| Backups | IndexedDB (`ordnung-ruhe-backups`) | Datensicherung |
| Einstellungen (Sprache, Theme, Onboarding) | localStorage (`or5_lang`, `or5_theme`, `or5_onboarding_done`) | App-Konfiguration |

**Diese Daten verlassen Dein Gerät nicht**, ausser Du exportierst sie aktiv als Datei (ZIP-Backup).

---

## 4. Besonders schützenswerte Personendaten (Art. 5 lit. c nDSG)

Maloja Plana kann je nach Eingabe folgende besonders schützenswerte Daten enthalten:

- **Gesundheitsdaten**: Medikamentenlisten, Organspende-Wunsch, Patientenverfügung
- **Daten zu Sozialhilfemassnahmen**: Sozialhilfe-Berechnungen, Prämienverbilligung
- **Religiöse/weltanschauliche Überzeugungen**: nur wenn freiwillig eingegeben

Da diese Daten **ausschliesslich lokal** gespeichert werden und **nie an einen Server übertragen** werden, ist das Risiko für die Persönlichkeitsrechte gering. Die technische Schutzmassnahme besteht in der vollständigen Vermeidung von Datenübertragungen.

---

## 5. Datenbearbeitung durch Dritte

### 5.1 Hosting

Die statische Webanwendung (HTML, CSS, JavaScript — ohne Nutzerdaten) wird über **Vercel** gehostet. Beim Abruf der Webseite werden standardmässig folgende technische Daten durch den Hosting-Provider verarbeitet:

- IP-Adresse (in Server-Logs, automatisch gelöscht)
- Browsertyp, Betriebssystem
- Zeitpunkt des Zugriffs

Diese Verarbeitung liegt in der Verantwortung des Hosting-Providers und ist technisch notwendig für die Auslieferung der Webseite.

### 5.2 Keine weiteren Dritten

Es gibt **keine** weiteren Datenempfänger:
- Keine Werbung, kein Tracking, keine Analyse-Cookies
- Keine Social-Media-Plugins
- Keine Datenverkäufe oder -weitergaben
- Keine Cloud-Dienste für Nutzerdaten
- Keine externen APIs, die Nutzerdaten erhalten

---

## 6. Datentransfer ins Ausland (Art. 16–18 nDSG)

Personendaten werden **nicht ins Ausland übertragen**, da sie Dein Gerät nicht verlassen.

Die einzige grenzüberschreitende Datenbearbeitung betrifft die in Abschnitt 5 genannten technischen Daten (Server-Logs) durch Vercel Inc. in den USA. Diese Übermittlung stützt sich auf das Swiss-U.S. Data Privacy Framework.

---

## 7. Deine Rechte (Art. 25–29 nDSG)

### 7.1 Auskunftsrecht (Art. 25 nDSG)
Da alle Daten lokal auf Deinem Gerät gespeichert sind, hast Du jederzeit **direkten Zugang** zu allen Deinen Daten. Du brauchst kein Auskunftsgesuch — Du kannst Deine Daten direkt in der App einsehen und als ZIP-Datei exportieren.

### 7.2 Recht auf Löschung
Du kannst Deine Daten jederzeit löschen:
- **In der App**: Einzelne Einträge löschen oder alle Daten zurücksetzen
- **Im Browser**: Browserdaten/localStorage löschen
- Es gibt **keine serverseitigen Kopien**, die gelöscht werden müssten

### 7.3 Recht auf Datenherausgabe (Art. 28 nDSG)
Du kannst Deine Daten jederzeit als ZIP-Datei exportieren. Das Exportformat enthält maschinenlesbare JSON-Dateien.

### 7.4 Weitere Rechte
Da die Betreiberin **keine personenbezogenen Daten** auf eigenen Servern speichert, entfallen die typischen Betroffenenrechte gegenüber der Betreiberin. Für Fragen zum Hosting und zu Performance-Metriken wende Dich an sophie.stebler@gmail.com.

---

## 8. Datensicherheit (Art. 8 nDSG / Art. 1–3 DSV)

### Technische Massnahmen
- **Keine Datenübertragung**: Nutzerdaten verlassen das Gerät nicht
- **HTTPS/TLS**: Alle Verbindungen zur Webseite sind verschlüsselt
- **Verschlüsselte Backups**: Lokale Backup-Dateien können verschlüsselt exportiert werden
- **Kein serverseitiger Datenzugriff**: Weder die Betreiberin noch Dritte können auf Deine Daten zugreifen
- **Open Source**: Der Quellcode ist öffentlich einsehbar und überprüfbar

### Deine Verantwortung
Da alle Daten lokal gespeichert werden, liegt die Sicherheit Deiner Daten in Deiner eigenen Verantwortung:
- Sichere Dein Gerät mit einem Passwort/PIN
- Erstelle regelmässig Backups (die App erinnert Dich daran)
- Lösche Deine Browserdaten, wenn Du ein geteiltes Gerät verwendest

---

## 9. Automatisierte Einzelentscheidungen (Art. 21 nDSG)

Maloja Plana trifft **keine automatisierten Einzelentscheidungen** im Sinne des nDSG. Alle Berechnungen (Steuerrechner, Sozialhilfe, Prämien) dienen ausschliesslich der Orientierung und haben keine rechtliche Wirkung.

---

## 10. Datenschutz-Folgenabschätzung (Art. 22 nDSG)

Eine formelle DSFA ist nicht erforderlich, da:
- Keine systematische, umfangreiche Bearbeitung besonders schützenswerter Daten stattfindet
- Keine Profiling-Aktivitäten durchgeführt werden
- Keine Daten an Dritte zur Weiterverarbeitung übermittelt werden
- Das Risiko durch die rein lokale Speicherung minimiert wird

---

## 11. Cookies

Maloja Plana verwendet **keine Cookies**. Weder eigene noch Drittanbieter-Cookies. Die lokale Datenspeicherung erfolgt über die Web Storage API (localStorage) und IndexedDB, nicht über Cookies.

---

## 12. Browser-Benachrichtigungen

Maloja Plana kann Browser-Benachrichtigungen für Fristen-Erinnerungen verwenden. Diese Funktion:
- Erfordert Deine **ausdrückliche Zustimmung** (Browser-Berechtigungsdialog)
- Wird vollständig lokal verarbeitet (kein Push-Server)
- Kann jederzeit in den Browser-Einstellungen widerrufen werden

---

## 13. Minderjährige

Maloja Plana richtet sich nicht an Minderjährige und erhebt wissentlich keine Daten von Personen unter 16 Jahren.

---

## 14. Änderungen

Diese Datenschutzerklärung kann bei wesentlichen Änderungen aktualisiert werden. Das Datum der letzten Änderung ist oben angegeben.

---

## 15. Kontakt und Aufsichtsbehörde

**Fragen zum Datenschutz:**
sophie.stebler@gmail.com

**Zuständige Aufsichtsbehörde:**
Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter (EDÖB)
Feldeggweg 1, CH-3003 Bern
https://www.edoeb.admin.ch
