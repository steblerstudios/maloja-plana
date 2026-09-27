# Patientenverfügung in Fragen — Entwurf nach Rechts- und Fachprüfung

*Stand 27.09.2026 · Entwurf, noch nicht gebaut · Wunsch Stebler Studios («Fragen machen, um die
Patientenverfügung zu erstellen»), Entscheid: **eine Frage pro Seite**, erst nach Prüfung bauen.*

*Geprüft am 27.09.2026 von `rechts-pruefer` und `swiss-precision-pruefer`, beide am Wortlaut.
Gelesene Fassungen: ZGB 01.07.2026 · DSG 07.07.2025 · VVK 01.01.2023 · URG 01.07.2025 ·
StGB 12.06.2026 · TxG (SR 810.21) konsolidiert ab 01.02.2021 · SAMW-Richtlinien «Umgang mit
Sterben und Tod» (2018, angepasst 2021) und «Patientenverfügungen» (2009, aktualisiert 2013).
Was ausdrücklich **nicht** am Wortlaut geprüft wurde, steht unten unter «Offen».*

## Was entsteht

Ein geführter Ablauf, der am Ende ein **druckbares Dokument** ausgibt. Die Person druckt es aus
und datiert und unterschreibt es von Hand. **Ohne Datum und Unterschrift ist sie nicht gültig**
(ZGB Art. 371 Abs. 1) — gültig ist sie ausserdem nur, wenn die Person beim Errichten urteilsfähig
war (Art. 370 Abs. 1, Begriff Art. 16).

Nicht Teil davon: **Vorsorgeauftrag** (eigenhändig oder öffentlich beurkundet, ZGB Art. 361
Abs. 1 und 2) und **Testament** (Formen in Art. 498: öffentlich Art. 499, eigenhändig Art. 505
Abs. 1, mündlich). Für beide gibt es kein Druckdokument.

## Rechtlicher Rahmen

| Regel | Quelle | Folge für den Generator |
|---|---|---|
| Eine **urteilsfähige** Person legt fest, welchen medizinischen Massnahmen sie zustimmt oder nicht | ZGB Art. 370 Abs. 1 | Kern: Zustimmung / Ablehnung je Massnahme |
| Sie kann eine **natürliche Person** bezeichnen, die mit der Ärztin/dem Arzt bespricht und entscheidet, und ihr Weisungen geben | Art. 370 Abs. 2 | Frage «Vertretungsperson» |
| Ersatzverfügungen für den Fall, dass die Person «nicht geeignet ist, den Auftrag nicht annimmt oder ihn kündigt» | Art. 370 Abs. 3 (Wortlaut) | Frage «Ersatzperson» |
| **Schriftlich, datiert, unterzeichnet** — keine Handschrift verlangt | Art. 371 Abs. 1 | Druck; **Datum und Unterschrift nur als leere Zeilen**, nichts vorbelegen, keine eingefügte Bild-Unterschrift |
| Hinweis auf der Versichertenkarte | Art. 371 Abs. 2; **VVK Art. 6 Abs. 1 lit. i** | Eintragen dürfen nur die im Anhang genannten **Fachpersonen**, mit Einverständnis — nicht die Person selbst |
| Widerruf und neuere Verfügung | Art. 371 Abs. 3 → Art. 362 | Neue Verfügung ersetzt die alte, «sofern er nicht zweifellos eine blosse Ergänzung darstellt» (Art. 362 Abs. 3) → bei «ergänzt» ausdrücklicher Satz mit Datum der alten. Vernichten ist **eine** Art des Widerrufs (Abs. 2), keine Pflicht |
| Ärztin/Arzt klärt anhand der Versichertenkarte ab, ob eine Verfügung vorliegt | Art. 372 Abs. 1 | Frage 13 (Wo liegt sie?) |
| Ärztin/Arzt entspricht ihr, ausser Verstoss gegen gesetzliche Vorschriften oder begründete Zweifel am freien Willen / mutmasslichen Willen | Art. 372 Abs. 2 | Unklare Antworten vermeiden; Werte-Frage hilft |
| Ohne Verfügung: vertretungsberechtigte Personen der Reihe nach; mutmasslicher Wille | Art. 378 Abs. 1 Ziff. 1–7, Abs. 3 | Einstieg; Werte-Frage |
| Psychische Erkrankung in einer Klinik: fürsorgerische Unterbringung | Art. 380 | Hinweis auf der Einstiegsseite |

## Die Fragen — eine pro Seite

Jede Frage hat **«Weiss ich noch nicht»**. Diese Antwort erscheint im Dokument **nie** als
Entscheid. **Kein Standardwert** wird je ins Dokument übernommen — was nicht beantwortet ist,
fehlt. Jede Frage hat ein aufklappbares «Warum wird das gefragt?».

| # | Frage | Antworten | Grundlage |
|---|---|---|---|
| 1 | Gibt es schon eine Patientenverfügung? | Nein · Ja, diese ersetzt sie · Ja, diese ergänzt sie (→ **Datum der früheren**) | Art. 362 Abs. 3 i. V. m. 371 Abs. 3 |
| 2 | Was ist wichtig im Leben — und was würde es nicht mehr lebenswert machen? | Freitext, freiwillig | Art. 372 Abs. 2, 378 Abs. 3 (mutmasslicher Wille) |
| 3 | **Therapieziel:** Was soll Vorrang haben, wenn keine Aussicht auf Heilung mehr besteht? | Leben verlängern · Lebensqualität und Linderung · Weiss ich noch nicht | SAMW «Patientenverfügungen» Ziff. 4.2 |
| 4 | Für welche Situationen soll die Verfügung gelten? | Mehrfachwahl: Notfall ohne Aussicht auf Besserung · dauernde Bewusstlosigkeit · fortgeschrittene Demenz · letzte Phase einer unheilbaren Krankheit | Art. 370 Abs. 1 |
| 5 | Wiederbelebung bei Herz-Kreislauf-Stillstand? | Ja · Nein · Weiss ich noch nicht — **«nur bei guter Aussicht» gestrichen** (zu unbestimmt, Art. 372 Abs. 2) | Art. 370 Abs. 1 |
| 6 | Lebensverlängernde Massnahmen (Beatmung, Dialyse, Intensivstation) in diesen Situationen? | Ja · Nur für begrenzte Zeit · Nein · Weiss ich noch nicht | Art. 370 Abs. 1 |
| 7 | **Künstliche** Ernährung und Flüssigkeit (Sonde, Infusion)? Essen und Trinken anbieten gehört immer zur Grundversorgung. | Ja · Nur für begrenzte Zeit · Nein · Weiss ich noch nicht | SAMW «Patientenverfügungen» |
| 8 | Soll die Linderung von Schmerzen, Atemnot und Angst Vorrang haben? | Ja · Weiss ich noch nicht — **neu formuliert**, ohne «auch wenn es das Leben verkürzt» | SAMW «Umgang mit Sterben und Tod» Ziff. 6.1.2 |
| 9 | Palliative Sedierung: Wenn Beschwerden sich anders nicht lindern lassen — darf ich in einen schlafähnlichen Zustand versetzt werden? | Ja · Nein · Weiss ich noch nicht + Erklärung | SAMW «Umgang mit Sterben und Tod» Ziff. 6.1.3 |
| 10 | Wo und mit wem? (Ort, Begleitung, Seelsorge) | Freitext, freiwillig | Art. 370 Abs. 2 (Weisungen) |
| 11 | **Organspende, Obduktion, Lehre und Forschung** | je Ja · Nein · Nur bestimmte Organe (nur Organspende) · Weiss ich noch nicht — **eigene Frage, nicht aus `organStatus` übernommen** | TxG (Zustimmungslösung, s. u.); Obduktion kantonal |
| 12 | Wer soll für mich sprechen — und wer, wenn diese Person nicht kann? | je Name, Beziehung, Telefon | Art. 370 Abs. 2 und 3 |
| 13 | Wo liegt das unterschriebene Original? | Freitext + Hinweis: Eintrag auf der Versichertenkarte macht eine Fachperson | Art. 371 Abs. 2; 372 Abs. 1; VVK Art. 6 Abs. 1 lit. i |

**Schluss-Seite:** Vorschau → «Drucken» → *«Ohne Datum und Unterschrift ist sie nicht gültig.»*
Empfehlungen, als freiwillig gekennzeichnet: mit Vertretungsperson und Hausärztin/Hausarzt
darüber reden · Urteilsfähigkeit ärztlich bestätigen lassen · ab und zu überprüfen · alte Fassung
vernichten.

**Organspende, Rechtslage:** Zustimmungslösung, Stand 27.09.2026 laut Fedlex. Die Änderung vom
01.10.2021 (erweiterte Widerspruchslösung) ist nicht in der Amtlichen Sammlung, ihr Inkrafttreten
offen (AS 2025 421 setzt voraus, dass sie noch nicht galt). In der App mit Stand-Datum und
«bitte beim BAG prüfen».

## Was im Dokument steht

- «Patientenverfügung», Name, Geburtsdatum, Adresse (aus dem Profil, änderbar)
- *«Ich erstelle diese Verfügung urteilsfähig und aus freiem Willen.»* — bleibt, schadet nicht;
  in der Ansicht **nicht** als Absicherung darstellen (Beweis ist er nicht, Art. 372 Abs. 2 / 373)
- Werte und Therapieziel (Fragen 2–3), falls beantwortet
- Je Situation die Entscheide (Fragen 5–9) — nur beantwortete
- Ort und Begleitung (Frage 10), falls ausgefüllt
- Organspende, Obduktion, Lehre und Forschung (Frage 11) — nur beantwortete
- Vertretungsperson und Ersatz (Frage 12)
- Bei «ersetzt»: *«Diese Verfügung ersetzt alle früheren.»* Bei «ergänzt»: *«Diese Verfügung
  ergänzt meine Verfügung vom ___.»*
- **Ort, Datum, Unterschrift** — leere Zeilen
- **Kein Disclaimer im Dokument selbst** (würde die Erklärung schwächen) → eigenes **Begleitblatt**

## Hinweise in der Ansicht

- Anfang **und** Schluss: *«Orientierungshilfe, keine ärztliche und keine Rechtsberatung.
  Medizinische Entscheide mit der Ärztin oder dem Arzt besprechen.»*
- **Eigener Fussteil ohne `trust.localOnly`** — kein «nur auf diesem Gerät» (Entscheid 27.09.:
  Konten ab Oktober).
- **Datenschutz:** Gesundheitsdaten sind besonders schützenswert (DSG Art. 5 lit. c Ziff. 2).
  Die Ansicht sagt, was gespeichert wird und wo — so wie es heute ist, ohne Zukunftsversprechen.
  Freitexte freiwillig. Sobald Konten kommen: ausdrückliche Einwilligung, bevor etwas das Gerät
  verlässt (Art. 6 Abs. 7 lit. a); Informationspflicht (Art. 19 Abs. 2); Datenschutzerklärung
  nennt Gesundheitsdaten.
- **Strafrecht:** Die App bietet weder Sterbehilfe noch Suizidhilfe an. StGB Art. 115 bestraft
  Verleitung und Beihilfe zum Suizid **aus selbstsüchtigen Beweggründen** — nicht als allgemeines
  Verbot darstellen. Art. 114: Tötung auf Verlangen.

## Vorlagen Dritter

Frei sind nur amtliche Erlasse (URG Art. 5 Abs. 1); Vorlagen von FMH, SRK, Pro Senectute,
Caritas, Dialog Ethik können als Sprachwerk geschützt sein (URG Art. 2). **Beim Schreiben dieses
Entwurfs lag keine dieser Vorlagen offen**; Grundlage waren Gesetz und SAMW-Richtlinien.
Eigene Formulierungen, nur die allgemein übliche Gliederung.

## Offen — nicht am Wortlaut geprüft

- Eigenhändigkeit der Unterschrift (OR Art. 14)
- Haftung aus UWG / UWG Art. 5
- Ob das nationale Organspende-Register läuft; Inkrafttreten der Widerspruchslösung (BAG-Seite nicht gelesen)
- Antibiotika und Spitaleinweisung als eigene Fragen — **nicht belegt**, fachlich prüfen
- **Frage 5–9: Formulierungen von einer Ärztin oder einem Arzt gegenlesen lassen**, bevor sie live gehen

## Nebenbefunde (nicht Teil dieses Entwurfs, als eigene Aufgaben)

- `de.js` ~2151: Vorsorgeauftrag «muss bei der Gemeinde registriert werden» — falsch
  (Art. 361 Abs. 3: Zivilstandsamt, auf Antrag).
- `OrganDonation.jsx:63`: Standard `'registered'` ohne Wahl; Begriffe «Registriert/Widersprochen»
  setzen Register bzw. Widerspruchslösung voraus; zwei Datenquellen (`organStatus`,
  `notfall.organDonor`); `:188` zeigt `trust.localOnly`.
