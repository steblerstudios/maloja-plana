# Maloja Plana — Beta Readiness Review V2

**Datum:** 2026-06-08
**Commit:** a7ad2e3
**Geprüft:** Dashboard, alle 7 Kapitel, Sidebar, Rechtliches, Export, Desktop + Mobile
**Perspektive:** Kann eine fremde Person Maloja benutzen?

---

## 1. ERSTER EINDRUCK

**Was passiert beim ersten Öffnen?**

Die Nutzerin sieht:
1. Ein Beta-Banner mit klarem Disclaimer ("Frühe Version", "Berechnungen dienen der Orientierung", "Daten bleiben auf diesem Gerät")
2. "Willkommen bei Maloja Plana — Dein persönlicher Schweizer Lebensordner — 100% privat, offline, kostenlos"
3. Eine Bergsilhouette mit 7 Stationen
4. Eine "Ein ruhiger Anfang"-Karte mit 3 konkreten Einstiegspunkten

**Ist klar, was Maloja ist?**
Ja. "Persönlicher Schweizer Lebensordner" + "100% privat, offline, kostenlos" in einem Satz. Die 7 Kapitel-Karten darunter (Basis, Wohnen, Finanzen, Versicherungen, Ausbildung, Behörden, Notfall) bestätigen sofort: hier organisiere ich mein Leben in der Schweiz.

**Ist klar, was man tun soll?**
Ja. "Ein ruhiger Anfang" bietet drei klickbare Schritte:
- → Basisinformationen ergänzen
- → Wichtige Dokumente hinzufügen
- → Notfallinformationen prüfen

Das ist ein guter Einstieg. Die Nutzerin muss nicht wählen — sie kann einfach auf den ersten Pfeil klicken.

**Bewertung Erster Eindruck: Gut.**

---

## 2. ONBOARDING

**Gibt es einen guten ersten Schritt?**
Ja. "→ Basisinformationen ergänzen" führt direkt zu Basis (Chapter 0). Dort steht: "Deine persönlichen Grunddaten sind das Fundament. Beginne mit Name und Kanton — alles andere hat Zeit." Die Section Voice darunter bestätigt: "Dein Name und Geburtsdatum, so wie sie in offiziellen Dokumenten stehen."

Der Weg ist klar: Vorname → Nachname → Geburtsdatum. Kein Zwang, kein Timer, kein Wizard.

**Gibt es Verwirrung?**
Zwei potenzielle Stellen:

1. **Werkzeuge-Bereich auf dem Dashboard:** Unterhalb der Kapitel erscheint "WERKZEUGE & FEATURES" mit 6 Kacheln (Kalender, Budget-Sync, Prämienverbilligung, Dokument-Tresor, Lebenslauf, Meine Unterlagen). Für eine Erstnutzerin, die gerade verstanden hat "hier organisiere ich mein Leben in 7 Kapiteln", ist das ein zweites Paradigma. Die Werkzeuge sind nicht schlecht, aber sie konkurrieren mit der Kapitelstruktur um Aufmerksamkeit.

2. **Sidebar hat 24 Einträge:** Menü öffnen zeigt: 7 Kapitel + Übersicht + 7 Werkzeuge (Unterlagen, Tresor, KK-Scanner, Budget, Schulden, Steuern, Organspende) + "Weitere Werkzeuge" (Kalender, Budget-Sync, IPV, Sozialhilfe, Lebenslauf, Charts, Export, Benachrichtigungen). Für Persona A (25, wenig Verwaltungserfahrung) und Persona C (60, wenig Technikaffinität) ist das zu viel auf einmal.

**Gibt es Sackgassen?**
Keine echten Sackgassen. Jede Seite hat "← Zurück" oder das Menü. Die Kapitel sind nie leer — es gibt immer einen Empty State mit Orientierung.

**Bewertung Onboarding: Gut, mit Ablenkungsrisiko durch Werkzeuge.**

---

## 3. TESTPERSONEN

### Persona A — 25 Jahre, wenig Verwaltungserfahrung

**Prognose: Funktioniert gut.**
- Dashboard ist klar, Einstieg über "Basisinformationen ergänzen" ist niederschwellig
- Section Voices helfen besonders hier: "Die Steuererklärung gehört zum Schweizer Alltag" erklärt, was für diese Person neu sein könnte
- Orientierungshinweise (Helvetia-Layer) an AHV-Nummer, Franchise etc. sind genau richtig
- Risiko: könnte sich in den Werkzeugen verlieren (Budget-Sync, IPV, Sozialhilfe)
- Sprache: Die Du-Form ist angemessen für diese Altersgruppe

### Persona B — 45 Jahre, durchschnittliche Schweizer Verwaltung

**Prognose: Funktioniert am besten.**
- Kennt AHV, Franchise, BVG — muss nicht orientiert werden
- Wird die Kapitelstruktur sofort verstehen ("Ah, das ist wie ein Ordner")
- Section Voices sind angenehm, aber nicht zwingend nötig
- Wird Export/Import schätzen
- Wird Werkzeuge gezielt nutzen (Budget, Steuern)
- Risiko: könnte die App als "zu wenig für mich" empfinden, weil keine Automatisierung

### Persona C — 60 Jahre, wenig Technikaffinität

**Prognose: Funktioniert eingeschränkt.**
- Dashboard ist verständlich, Bergsilhouette hilft als Orientierungsmetapher
- Section Voices helfen ("Dein Hausarzt und Dein bevorzugtes Spital")
- Risiko: Die Sidebar mit 24 Einträgen überfordert
- Risiko: Der Dark Mode Button ("● Dunkel") könnte versehentlich geklickt werden
- Risiko: Datums-Picker (tt.mm.jjjj) ist auf Mobile möglicherweise nicht intuitiv
- Risiko: Kein sichtbares "Speichern"-Button — Auto-Save muss verstanden werden
- Kritisch: Das "✓ Gespeichert" im Footer ist möglicherweise nicht sichtbar oder nicht als Bestätigung erkennbar

### Persona D — Migrationshintergrund, Deutsch nicht Muttersprache

**Prognose: Funktioniert gut dank Mehrsprachigkeit.**
- EN/FR/IT als Ausweichsprachen direkt im Header verfügbar — ein Klick
- Section Voices in allen 4 Sprachen vorhanden
- Orientierungstexte erklären Schweizer Spezifika (AHV, KVG, BVG, Franchise)
- "Dein persönlicher Schweizer Lebensordner" signalisiert: das ist für dich gemacht
- Risiko: Einige Fachbegriffe (Prämienverbilligung, Betreibungsauszug) könnten auch in der Übersetzung schwierig sein
- Risiko: Die Sidebar-Texte mischen teilweise Sprachen — im DE-Modus steht unten "100% local. No data leaves your device." auf Englisch

---

## 4. VERTRAUEN

**Wirkt die App seriös?**
Ja. Die Farbpalette (Creme/Salbei/Anthrazit), die Typografie, die Schweizer Symbole, der ruhige Ton — alles wirkt professionell und vertrauenswürdig. Kein Startup-Gimmick, keine aufdringliche Gamification.

**Wirkt sie sicher?**
Ja. Drei Vertrauenssignale:
1. Beta-Banner: "Deine Daten bleiben vollständig auf diesem Gerät"
2. Datenschutz-Seite: "Kein Server, kein Backend", "Keine Daten an Dritte"
3. Export: AES-256-Verschlüsselung, lokale Verarbeitung

**Fehlen rechtliche Angaben?**
Ja — das ist ein Blocker:

| Seite | Status | Problem |
|-------|--------|---------|
| Datenschutz | ✅ Vorhanden | Vollständig, klar, verständlich |
| Nutzungsbedingungen | ✅ Vorhanden | Haftungsausschluss, Beratungsdisclaimer korrekt |
| Impressum | ⚠️ Platzhalter | "[Name / Organisation — Platzhalter]", "[Adresse — Platzhalter]", "[E-Mail — Platzhalter]" |
| Feedback-E-Mail | ⚠️ Platzhalter | `feedback@example.com` — keine echte Adresse |

**Fehlt Transparenz?**
Zwei Punkte:
1. Es ist nicht klar, wer hinter Maloja steht (Impressum = Platzhalter)
2. "Open-Source-Projekt" wird erwähnt, aber kein Link zum Repository

---

## 5. DATENSCHUTZ

| Element | Status | Bewertung |
|---------|--------|-----------|
| Datenschutzerklärung | ✅ | Klar, verständlich, vollständig. Lokale Speicherung, kein Server, Vercel Speed Insights erwähnt. |
| Nutzungsbedingungen | ✅ | Haftungsausschluss vorhanden, Beratungsdisclaimer korrekt. |
| Impressum | 🔴 Platzhalter | Keine reale Person/Organisation, keine Adresse, keine E-Mail. |
| Feedbackkanal | 🔴 Platzhalter | `feedback@example.com` ist nicht erreichbar. |
| Kontaktmöglichkeit | 🔴 Keine | Kein funktionierender Kontaktweg ausser dem Platzhalter-Mailto. |

---

## 6. TESTAUFGABEN

Fünf Aufgaben für Testpersonen, in steigender Komplexität:

### Aufgabe 1 — Grundlagen
"Trage deinen Vornamen, Nachnamen und Geburtsdatum ein."
*Prüft: Findet die Person den Einstieg? Versteht sie das Auto-Save?*

### Aufgabe 2 — Navigation
"Finde heraus, wo du deine Notfallkontakte hinterlegen kannst, und trage eine Kontaktperson mit Telefonnummer ein."
*Prüft: Kapitelnavigation, Orientierung auf der Seite, Eingabe eines zusammengehörigen Datensatzes.*

### Aufgabe 3 — Versicherung
"Trage deine Krankenkasse und dein KK-Modell ein."
*Prüft: Kann die Person ein mittelschweres Kapitel finden und bedienen? Helfen die Section Voices?*

### Aufgabe 4 — Dokument
"Lade ein Foto deines Ausweises als Dokument hoch (oder simuliere den Vorgang)."
*Prüft: Findet die Person den Dokumente-Tab? Ist der Upload-Vorgang verständlich?*

### Aufgabe 5 — Datensicherung
"Exportiere deine bisherigen Daten als Sicherungsdatei."
*Prüft: Findet die Person die Export-Funktion? Versteht sie den Unterschied zwischen normalem und verschlüsseltem Export?*

---

## 7. FEEDBACK-FRAGEN

10 Fragen nach dem Test, Fokus auf Verständnis, Orientierung, Vertrauen, Gefühl:

1. **Was ist Maloja Plana?** *(In eigenen Worten — prüft, ob die Kernbotschaft angekommen ist)*

2. **Wusstest du jederzeit, wo du dich befindest?** *(Orientierung)*

3. **Gab es einen Moment, wo du nicht wusstest, was du tun sollst?** *(Sackgassen)*

4. **Hast du bemerkt, dass deine Daten automatisch gespeichert werden?** *(Auto-Save-Verständnis)*

5. **Vertraust du dieser App mit persönlichen Daten? Warum / warum nicht?** *(Vertrauen)*

6. **Waren die kursiven Sätze unter den Abschnittsüberschriften hilfreich, störend oder hast du sie nicht bemerkt?** *(Section Voice Wirkung)*

7. **Gab es ein Wort oder einen Begriff, den du nicht verstanden hast?** *(Sprache/Fachbegriffe)*

8. **Was würdest du als Erstes einem Freund über diese App erzählen?** *(Elevator Pitch der Nutzerin)*

9. **Was hat gefehlt?** *(Offene Frage für unerwartete Bedürfnisse)*

10. **Würdest du die App weiter benutzen? Wenn ja: wofür zuerst?** *(Relevanz und Motivation)*

---

## 8. BLOCKER

### Muss vor dem ersten Test erledigt werden

| # | Blocker | Warum | Aufwand |
|---|---------|-------|---------|
| 1 | **Impressum ausfüllen** | Platzhalter "[Name / Organisation — Platzhalter]" ist für Testpersonen sichtbar und untergräbt Vertrauen. Mindestens Name und E-Mail-Adresse eintragen. | 5 Minuten |
| 2 | **Feedback-E-Mail ersetzen** | `feedback@example.com` funktioniert nicht. Testpersonen sollen Feedback geben können. Echte Adresse eintragen. | 5 Minuten |
| 3 | **Sidebar-Sprachmischung beheben** | "100% local. No data leaves your device." steht im DE-Modus auf Englisch. Muss übersetzt oder an die i18n gekoppelt werden. | 15 Minuten |

### Sollte vor dem Test erledigt werden (empfohlen, nicht blockierend)

| # | Empfehlung | Warum | Aufwand |
|---|-----------|-------|---------|
| 4 | **Footer-Overlap auf Mobile prüfen** | Das letzte Eingabefeld wird auf 375px teilweise durch den fixierten Footer verdeckt. Stört bei Testaufgaben. | 30 Minuten |
| 5 | **Werkzeuge-Bereich auf Dashboard überdenken** | "WERKZEUGE & FEATURES" mit 6 Kacheln direkt unter den Kapiteln lenkt Erstnutzerinnen ab. Für einen geschlossenen Beta-Test mit geführten Aufgaben ist das unkritisch, aber für unbegleitete Tests problematisch. | Entscheidung, kein Code |

### Kann nach dem ersten Test erledigt werden

| # | Element | Warum es warten kann |
|---|---------|---------------------|
| 6 | Mikro-Feedback beim Ausfüllen | Funktional korrekt, nur emotional leer. Nutzertest wird zeigen, ob es stört. |
| 7 | Kapitelinterner Fortschritt | Nützlich, aber kein Verständnisproblem. |
| 8 | Sidebar-Umfang (24 Einträge) | Für geführte Tests kein Problem. Für unbegleitete Tests ggf. vereinfachen. |
| 9 | Doktorhut-Icon (Ausbildung) | Schwächstes Icon, aber funktional erkennbar. |

---

## A. Aktuelle Bereitschaft

Maloja Plana ist funktional vollständig für einen geschlossenen Beta-Test:

- ✅ 7/7 Kapitel mit Feldern, Sektionen, Section Voices
- ✅ Dokumenten-Upload und -Verwaltung
- ✅ Export/Import mit Verschlüsselung
- ✅ Viersprachigkeit (DE/EN/FR/IT)
- ✅ Offline-fähig
- ✅ Auto-Save
- ✅ Datenschutz- und Nutzungsseite
- ✅ Dark/Light Mode
- ⚠️ Impressum = Platzhalter
- ⚠️ Feedback-E-Mail = Platzhalter
- ⚠️ Sidebar-Text teilweise auf Englisch

---

## B. Risiken

1. **Vertrauensverlust durch Platzhalter:** Eine Testperson, die das Impressum öffnet und "[Platzhalter]" sieht, wird misstrauisch — gerade bei einer App, die persönliche Daten verwaltet. Das ist der einzige harte Blocker.

2. **Überforderung durch Werkzeuge:** Die Sidebar zeigt 24 Einträge. Für einen geführten Test ist das handhabbar (Testaufgaben lenken den Fokus). Für einen unbegleiteten Test könnte es abschrecken.

3. **Auto-Save nicht kommuniziert:** Es gibt kein explizites "Deine Daten werden automatisch gespeichert". Das "✓ Gespeichert" im Footer ist dezent. Persona C (60, wenig Technikaffinität) könnte unsicher sein, ob etwas gespeichert wurde.

4. **Kein Rückweg zur Startseite ohne Menü:** Es gibt keinen Home-Button. Man muss das Menü öffnen und "Übersicht" wählen. Der "← Zurück"-Button auf Kapitelseiten führt nicht immer eindeutig zur Übersicht.

---

## C. Blocker

**Harte Blocker (3):**
1. Impressum ausfüllen (5 Min.)
2. Feedback-E-Mail ersetzen (5 Min.)
3. Sidebar-Sprachmischung beheben (15 Min.)

**Geschätzter Gesamtaufwand: ~25 Minuten.**

Nach Behebung dieser 3 Punkte ist Maloja bereit.

---

## D. Testpersonen-Plan

| Persona | Profil | Sprache | Begleitet? | Fokus |
|---------|--------|---------|------------|-------|
| A | 25 J., wenig Verwaltungserfahrung | DE | Ja (erste Runde) | Verständnis, Orientierung, Section Voices |
| B | 45 J., Schweizer Verwaltung bekannt | DE | Nein (unbegleitet) | Effizienz, Vollständigkeit, Vertrauen |
| C | 60 J., wenig Technikaffinität | DE | Ja (begleitet) | Bedienbarkeit, Auto-Save, Navigation |
| D | Migrationshintergrund | EN oder FR | Ja (erste Runde) | Sprachqualität, Fachbegriffe, Vertrauen |

**Empfohlene Reihenfolge:** A → D → C → B

Begründung: A und D profitieren am meisten vom begleiteten Test und liefern die wertvollsten Erkenntnisse über Verständlichkeit. C testet Bedienbarkeit. B als unbegleiteter Test prüft, ob Maloja auch ohne Erklärung funktioniert.

**Testdauer pro Person:** 20–30 Minuten (5 Aufgaben + 10 Feedback-Fragen)

---

## E. Testaufgaben

*(Siehe Abschnitt 6 oben)*

1. Trage deinen Vornamen, Nachnamen und Geburtsdatum ein.
2. Finde heraus, wo du deine Notfallkontakte hinterlegen kannst, und trage eine Kontaktperson mit Telefonnummer ein.
3. Trage deine Krankenkasse und dein KK-Modell ein.
4. Lade ein Foto deines Ausweises als Dokument hoch.
5. Exportiere deine bisherigen Daten als Sicherungsdatei.

---

## F. Feedback-Fragen

*(Siehe Abschnitt 7 oben)*

1. Was ist Maloja Plana?
2. Wusstest du jederzeit, wo du dich befindest?
3. Gab es einen Moment, wo du nicht wusstest, was du tun sollst?
4. Hast du bemerkt, dass deine Daten automatisch gespeichert werden?
5. Vertraust du dieser App mit persönlichen Daten? Warum / warum nicht?
6. Waren die kursiven Sätze unter den Abschnittsüberschriften hilfreich, störend oder hast du sie nicht bemerkt?
7. Gab es ein Wort oder einen Begriff, den du nicht verstanden hast?
8. Was würdest du als Erstes einem Freund über diese App erzählen?
9. Was hat gefehlt?
10. Würdest du die App weiter benutzen? Wenn ja: wofür zuerst?

---

## G. Empfehlung

# 🟡 Eingeschränkt bereit

**Maloja Plana ist funktional bereit für eine geschlossene Beta.**

Die App ist vollständig, navigierbar, verständlich und viersprachig. Die Identität reicht von der Oberfläche bis in die Formularabschnitte. Section Voices, Orientierungstexte und Empty States bilden zusammen ein kohärentes Nutzungserlebnis.

**Drei Platzhalter verhindern ein uneingeschränktes Grün:**

1. Impressum ohne Namen/Adresse → Vertrauen
2. Feedback-E-Mail `example.com` → Kontakt nicht möglich
3. Englischer Text in deutscher Sidebar → Qualitätseindruck

**Nach Behebung (~25 Minuten) wechselt die Ampel auf 🟢.**

Die App muss nicht perfekt sein für einen Beta-Test. Sie muss benutzbar, vertrauenswürdig und kontaktierbar sein. Benutzbar: ja. Vertrauenswürdig: fast — Impressum fehlt. Kontaktierbar: nein — E-Mail ist Platzhalter.

Zwei Zeilen Code und ein ausgefülltes Impressum trennen Maloja von der geschlossenen Beta.

---

*Geprüft am 2026-06-08 nach Sprint 0–5.*
*Keine Implementierung. Keine Commits. Nur Beobachtung.*
