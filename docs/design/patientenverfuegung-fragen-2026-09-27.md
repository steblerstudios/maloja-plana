# Patientenverfügung in Fragen — Entwurf zur Rechtsprüfung

*Stand 27.09.2026 · Entwurf, noch nicht gebaut · Wunsch Stebler Studios («Fragen machen, um die
Patientenverfügung zu erstellen»), Entscheid: **eine Frage pro Seite**, erst nach Rechtsprüfung bauen.*

## Was entsteht

Ein geführter Ablauf, der am Ende ein **druckbares Dokument** ausgibt. Die Person druckt es aus,
datiert und unterschreibt es von Hand. Die App erstellt keine gültige Verfügung selbst — gültig wird
sie erst durch Datum und Unterschrift (ZGB Art. 371 Abs. 1).

Nicht Teil davon: **Vorsorgeauftrag** und **Testament**. Beide müssen ganz von Hand geschrieben
oder öffentlich beurkundet sein (ZGB Art. 361 Abs. 1; Testament ZGB Art. 498 ff.). Für sie gibt es
später höchstens eine Abschreib-Vorlage, nie ein Druckdokument.

## Rechtlicher Rahmen (bereits belegt, Fachprüfung 25.09.2026, `Vorsorgeauftrag.jsx`)

| Regel | Quelle | Folge für den Generator |
|---|---|---|
| Eine **urteilsfähige** Person legt fest, welchen medizinischen Massnahmen sie zustimmt oder nicht | ZGB Art. 370 Abs. 1 | Kern des Fragebogens: Zustimmung / Ablehnung je Massnahme |
| Sie kann eine **natürliche Person** bezeichnen, die mit der Ärztin/dem Arzt bespricht und entscheidet, und ihr Weisungen geben | ZGB Art. 370 Abs. 2 | Frage «Vertretungsperson» |
| **Ersatzverfügung** für den Fall, dass die Person nicht will, nicht kann oder kündigt | ZGB Art. 370 Abs. 3 | Frage «Ersatzperson» |
| **Schriftlich, datiert, unterzeichnet** | ZGB Art. 371 Abs. 1 | Druck + Unterschriftszeile + Datumszeile; kein Handschrift-Zwang |
| Hinweis auf der **Versichertenkarte** möglich | ZGB Art. 371 Abs. 2; VVK Art. 6 | Schluss-Seite: «wo liegt sie?» |
| Widerruf wie beim Vorsorgeauftrag | ZGB Art. 371 Abs. 3 → Art. 362 | Hinweis: neue Fassung datieren, alte vernichten |
| Ärztin/Arzt entspricht ihr, **ausser** Verstoss gegen gesetzliche Vorschriften oder begründete Zweifel am freien Willen / mutmasslichen Willen | ZGB Art. 372 Abs. 2 | Werte-Frage hilft beim mutmasslichen Willen |
| Ohne Verfügung: vertretungsberechtigte Personen der Reihe nach | ZGB Art. 378 | Einstiegs-Erklärung, warum eine Verfügung hilft |

## Die Fragen — eine pro Seite

Jede Frage hat die Antwort **«Weiss ich noch nicht»**. Sie erscheint im Dokument **nicht** als
Entscheid — die Stelle bleibt leer bzw. fällt weg. Jede Frage hat ein aufklappbares
«Warum wird das gefragt?» mit Gesetzesstelle, wo es eine gibt.

| # | Frage | Antworten | Grundlage |
|---|---|---|---|
| 1 | Gibt es schon eine Patientenverfügung? | Nein · Ja, diese ersetzt sie · Ja, diese ergänzt sie | Art. 371 Abs. 3 / 362 (Widerruf) |
| 2 | Was ist wichtig im Leben — und was würde es nicht mehr lebenswert machen? | Freitext, freiwillig | Art. 372 Abs. 2 (mutmasslicher Wille) — **Auslegung, zur Prüfung** |
| 3 | Für welche Situationen soll die Verfügung gelten? | Mehrfachwahl: Notfall ohne Aussicht auf Besserung · dauernde Bewusstlosigkeit · fortgeschrittene Demenz · letzte Phase einer unheilbaren Krankheit | Art. 370 Abs. 1 (Gegenstand frei) |
| 4 | Wiederbelebung bei Herz-Kreislauf-Stillstand? | Ja · Nein · Nur wenn gute Aussicht auf Erholung · Weiss ich noch nicht | Art. 370 Abs. 1 |
| 5 | Lebensverlängernde Massnahmen (Beatmung, Dialyse, Intensivstation) in diesen Situationen? | Ja · Nur für begrenzte Zeit · Nein · Weiss ich noch nicht | Art. 370 Abs. 1 |
| 6 | Künstliche Ernährung und Flüssigkeit? | Ja · Nur für begrenzte Zeit · Nein · Weiss ich noch nicht | Art. 370 Abs. 1 |
| 7 | Linderung von Schmerzen und Atemnot, auch wenn sie das Leben verkürzen könnte? | Ja · Nein · Weiss ich noch nicht | Art. 370 Abs. 1 — **Formulierung zur Prüfung** |
| 8 | Wo und mit wem? (Ort, Begleitung, Seelsorge) | Freitext, freiwillig | Art. 370 Abs. 2 (Weisungen) — **zur Prüfung** |
| 9 | Organspende | **aus dem bestehenden Eintrag übernommen** (`organStatus`, `OrganDonation.jsx`), nur Anzeige + Link | Transplantationsgesetz — **aktuelle Rechtslage zur Prüfung** |
| 10 | Wer soll für mich sprechen? | Name, Beziehung, Telefon | Art. 370 Abs. 2 |
| 11 | Wer, wenn diese Person nicht kann? | Name, Beziehung, Telefon | Art. 370 Abs. 3 |
| 12 | Wo liegt das unterschriebene Original? | Freitext + Hinweis Versichertenkarte | Art. 371 Abs. 2; VVK Art. 6 |

**Schluss-Seite:** Vorschau des Dokuments → «Drucken» → Hinweis *«Erst mit Datum und Unterschrift
gültig»*. Empfehlungen ohne Rechtspflicht, als solche gekennzeichnet: mit der Vertretungsperson und
der Hausärztin/dem Hausarzt darüber reden; ab und zu überprüfen.

## Was im Dokument steht

- Überschrift «Patientenverfügung», Name, Geburtsdatum, Adresse (aus dem Profil, änderbar)
- Satz zur Urteilsfähigkeit: *«Ich erstelle diese Verfügung urteilsfähig und aus freiem Willen.»*
  — **zur Prüfung**: nötig, sinnvoll oder überflüssig?
- Werte (Frage 2), falls ausgefüllt
- Je Situation die Entscheide (Fragen 4–7) — nur beantwortete
- Wünsche zu Ort und Begleitung (Frage 8), falls ausgefüllt
- Organspende-Hinweis (Frage 9)
- Vertretungsperson und Ersatz (Fragen 10–11)
- Bei «ersetzt» (Frage 1): *«Diese Verfügung ersetzt alle früheren.»*
- **Ort, Datum, Unterschrift** — leere Zeilen zum Ausfüllen von Hand

## Offene Fragen an die Prüfung

1. **Form:** Genügt ein gedrucktes Dokument mit angekreuzten Entscheiden + handschriftlichem Datum
   und Unterschrift der Form von Art. 371 Abs. 1? (Erwartung: ja — «schriftlich», keine Handschrift.)
2. **Datum:** Darf das Datum vorgedruckt sein, oder besser von Hand? (Erwartung: beides zulässig;
   von Hand ist robuster, weil Druck- und Unterschriftsdatum auseinanderfallen können.)
3. **Urteilsfähigkeits-Satz:** sinnvoll oder Scheinsicherheit?
4. **Organspende:** Welche Rechtslage gilt am 27.09.2026 (Zustimmungs- oder erweiterte
   Widerspruchslösung, Inkrafttreten)? Stimmt `OrganDonation.jsx` damit überein?
5. **Frage 7 (Linderung mit möglicher Lebensverkürzung):** zulässige, nicht irreführende
   Formulierung? Abgrenzung zur Suizidhilfe (StGB Art. 115) und aktiven Sterbehilfe (StGB Art. 114)
   muss klar sein — die App darf nichts davon anbieten.
6. **Haftung / Grenzen:** Welcher Hinweis ist nötig, dass Maloja keine ärztliche und keine
   Rechtsberatung ist? Bestehender Footer von `Vorsorgeauftrag.jsx` genügt?
7. **Datenschutz:** Die Antworten sind Gesundheitsdaten, besonders schützenswert (nDSG Art. 5
   lit. c Ziff. 2). Was muss die Ansicht dazu sagen? **Kein neues «nur auf deinem Gerät»-Versprechen**
   — Entscheid 27.09.: Konten kommen ab Oktober.
8. **Vorlagen Dritter:** Nicht abschreiben (FMH, SRK, Pro Senectute, Caritas, Dialog Ethik).
   Eigene Formulierungen; nur die Gliederung ist allgemein üblich.

## Nicht in diesem Schritt

Kein Code. Erst Prüfung → Antworten hier eintragen → Skizze → bauen.
