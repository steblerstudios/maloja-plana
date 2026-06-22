# First Tester Readiness Check

Datum: 15. Juni 2026
Commit: ce0ed78

---

## A. Ampel

**GRÜN — bereit für erste Testperson.**

Keine Blocker. Wenige kosmetische Punkte, die warten können.

---

## B. Blocker

Keine.

---

## C. Geprüfte Bereiche

| Bereich | Status | Anmerkung |
|---|---|---|
| Beta-Gate | OK | Code `maloja2026`, saubere Maske |
| Sprachwahl | OK | DE/EN/FR/IT nach Beta-Code |
| Onboarding | OK | Vorname/Nachname/Kanton, Skip-Option vorhanden |
| Dashboard | OK | 7 Kapitel sichtbar, Orientierungshilfe, Disclaimer-Banner |
| Erste Dateneingabe | OK | Felder reagieren, Auto-Save funktioniert |
| Speichern / Reload | OK | Daten bleiben nach Browser-Reload erhalten |
| Mobile 375px | OK | Dashboard, Kapitel, 404 — alles lesbar und bedienbar |
| Rechtliches | OK | Datenschutz, Nutzung, Impressum — über Footer erreichbar |
| Feedback-Link | OK | "Feedback per E-Mail" im Footer, öffnet mailto |
| Export / Notfallkarte | OK | Druckansicht öffnet neues Fenster, druckbar |
| 404-Seite | OK | "Diese Seite ist nicht Teil deines Lebensordners." + Link zurück |
| i18n DE | OK | Keine rohen Keys sichtbar |
| i18n EN | OK | Keine rohen Keys sichtbar |
| i18n FR | OK | Keine rohen Keys sichtbar |
| i18n IT | OK | Keine rohen Keys sichtbar |
| Console Errors | OK | Null Fehler in allen getesteten Zuständen |
| Synthesen | OK | Wohnkostenanteil, Versicherungsübersicht, Behörden-Zeitstatus, Notfallübergabe — alle korrekt |
| Security Headers | OK | .htaccess vorbereitet (wird mit Deploy aktiv) |
| Dark Mode | OK | Automatisch aktiv, alle Bereiche lesbar |

### Kleine Punkte (können warten)

- Footer überlappt auf Mobile leicht mit dem letzten Inhaltselement — kosmetisch, kein Blocker
- 404-Seite ist nur auf Deutsch — reicht für Beta, mehrsprachig wäre nice-to-have
- Notfallkarte-Druckansicht ebenfalls nur in der aktiven Sprache — korrekt so

---

## D. Testskript für die erste Person

### Vorbereitung
- Beta-Code mitteilen: `maloja2026`
- URL: malojaplana.ch
- Empfehlung: Desktop-Browser (Chrome/Safari/Firefox)
- Keine Anmeldung nötig

### Ablauf (ca. 20 Minuten)

1. **Beta-Code eingeben** (1 Min)
   - Sprache wählen

2. **Onboarding** (2 Min)
   - Vorname und Nachname eingeben
   - Kanton wählen oder überspringen

3. **Dashboard erkunden** (2 Min)
   - Die 7 Kapitel sehen
   - Landscape-Illustration anschauen
   - Disclaimer-Banner lesen

4. **Persönliche Basis ausfüllen** (5 Min)
   - Name, Geburtsdatum
   - Telefon, E-Mail
   - Zivilstand

5. **Ein zweites Kapitel öffnen** (3 Min)
   - Vorschlag: Wohnen oder Finanzen
   - 2-3 Felder ausfüllen

6. **Seite neu laden** (1 Min)
   - Prüfen, ob alles noch da ist

7. **Notfall-Kapitel** (3 Min)
   - Kontaktperson eintragen
   - Notfallkarte drucken (Vorschau genügt)

8. **Sprache wechseln** (1 Min)
   - Auf EN oder FR wechseln
   - Kurz prüfen, ob alles übersetzt ist

9. **Datenschutz lesen** (2 Min)
   - Footer-Link "Datenschutz & Rechtliches" klicken
   - Lokale Speicherung nachvollziehen

---

## E. Was NICHT erklärt werden soll

- Nicht erklären, was die App tut — die Person soll es selbst herausfinden
- Nicht erklären, wo was zu finden ist — die Navigation soll für sich sprechen
- Nicht entschuldigen, dass Dinge fehlen — es ist eine Beta
- Nicht sagen "klick hier" oder "mach das" — beobachten, nicht anleiten
- Nicht fragen "hast du verstanden?" — fragen "was siehst du?"

---

## F. Welche Beobachtungen wichtig sind

### Vertrauen
- Liest die Person den Disclaimer?
- Zögert sie bei der Dateneingabe?
- Fragt sie "wo werden meine Daten gespeichert?"
- Fühlt sich die App sicher an?

### Orientierung
- Findet die Person den Weg zurück zum Dashboard?
- Versteht sie die 7 Kapitel?
- Weiss sie, wo sie gerade ist?
- Benutzt sie das Menü oder die Landscape-Icons?

### Verständnis
- Versteht sie die Sectionintros?
- Sind die Feldbezeichnungen klar?
- Versteht sie "Wohnkostenanteil" oder "Versicherungsübersicht"?
- Liest sie die Orientierungshinweise?

### Frustration
- Wo stockt sie?
- Was tippt sie und löscht es wieder?
- Wo scrollt sie suchend?
- Wann hört sie auf?

### Wert
- Welches Kapitel öffnet sie zuerst?
- Sagt sie irgendwann "ah, das ist praktisch"?
- Würde sie wiederkommen?

---

## Zusammenfassung

Maloja Plana ist bereit für die erste Testperson. Die App funktioniert stabil, speichert zuverlässig, sieht auf Desktop und Mobile vertrauenswürdig aus, und hat keine sichtbaren Fehler. Die wichtigste Beobachtung wird sein: Versteht die Person ohne Erklärung, wofür die App da ist — und traut sie ihr?
