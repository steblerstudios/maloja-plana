# Privacy & Trust Communication Review

Datum: 15. Juni 2026

---

## Was heute kommuniziert wird

| Wo | Was | Sichtbarkeit |
|---|---|---|
| Onboarding (privacyNote) | "100% lokal. Keine Daten verlassen Dein Gerät." | Klein, unter den Feldern |
| Dashboard (tagline) | "100% privat, offline, kostenlos" | Gross, direkt unter Willkommen |
| Dashboard (Disclaimer) | "Frühe Version · Berechnungen dienen der Orientierung" | Banner oben, wegklickbar |
| Footer | "Geschlossene Beta" | Immer sichtbar |
| Rechtliches > Datenschutz | Lokale Datenspeicherung, kein Server, kein Konto, kein Tracking | Vollständig, aber erst nach Klick |
| Notfall-Kapitel | "Diese Informationen werden nur lokal gespeichert" | Im Kapitel |
| Backup-Export | "AES-256-Verschlüsselung, lokal verarbeitet" | Im Export-Dialog |

---

## Was unklar bleibt

### 1. Erste Sekunden nach Beta-Code (KRITISCH)
- Beta-Gate zeigt nur "Zugangscode" → keine Erklärung wofür
- Keine Information über lokale Speicherung VOR der Dateneingabe
- **Nutzer geben Daten ein, bevor sie wissen, wo diese landen**

### 2. Onboarding
- Privacy-Note steht unter den Feldern, nicht darüber
- Nachricht "Alles wird nur auf deinem Gerät gespeichert. Kein Konto nötig." ist vorhanden, aber kommt zu spät — NACH Vorname/Nachname
- **Empfehlung**: Privacy-Note VOR die Eingabefelder setzen, nicht danach

### 3. Dashboard
- "100% privat, offline, kostenlos" ist gut, aber generisch
- Kein Hinweis, dass Daten NICHT synchronisiert werden (Gerätewechsel = Datenverlust)
- **Empfehlung**: Einen Satz ergänzen: "Deine Daten leben nur auf diesem Gerät — ein Backup sichert sie."

### 4. Kapitel-Eingabe
- Kein sichtbarer Hinweis beim ersten Ausfüllen, dass Daten lokal bleiben
- Die "Gespeichert"-Anzeige (Footer) bestätigt das Speichern, aber nicht WO
- **Empfehlung**: Beim allerersten Speichern einmalig anzeigen: "Gespeichert — nur auf diesem Gerät"

### 5. Was fehlt: Datenverlust-Warnung
- Keine Information, dass Browser-Daten löschen = alle Daten weg
- Keine Aufforderung zum Backup
- **Empfehlung**: Nach 10+ Feldern einen sanften Hinweis: "Du hast bereits einiges erfasst. Ein Backup sichert Deine Daten."

---

## Konkrete Verbesserungsvorschläge

### Sofort (P1)
1. **Onboarding**: Privacy-Note über die Felder verschieben, nicht darunter
2. **Onboarding**: Text erweitern: "Alles wird nur auf deinem Gerät gespeichert. Kein Konto nötig. Keine Daten werden gesendet."

### Bald (P2)
3. **Dashboard**: Backup-Hinweis nach X erfassten Feldern
4. **Speichern-Anzeige**: Beim ersten Mal "Gespeichert — nur auf diesem Gerät" statt nur "Gespeichert"
5. **Beta-Gate**: Unter dem Zugangscode-Feld einen Satz: "Maloja Plana speichert alles lokal auf Deinem Gerät."

### Später (P3)
6. **Automatisches Backup-Reminder** nach 30 Tagen ohne Export
7. **Gerätewechsel-Hinweis** im Onboarding

---

## Fazit

Die technische Realität ist vorbildlich — 100% lokal, kein Server, kein Tracking. Aber die **Kommunikation** hinkt hinterher. Ein neuer Nutzer versteht das erst nach aktivem Suchen. Die wichtigste Verbesserung: Privacy-Botschaft VOR die erste Dateneingabe, nicht danach.
