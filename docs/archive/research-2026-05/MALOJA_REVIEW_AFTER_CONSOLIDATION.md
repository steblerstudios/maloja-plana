# Maloja Plana — Post-Consolidation Design Review

**Datum:** 2026-06-08
**Geprüft:** Dashboard, alle 7 Kapitel, Desktop + Mobile (375px)
**Perspektive:** Erstbenutzerin, die Maloja zum ersten Mal öffnet

---

## A. Was heute hervorragend funktioniert

1. **Der Malojapass als Dashboard-Metapher** — Die Bergsilhouette mit 7 Stationen entlang des Pfads ist keine Dekoration, sie ist eine Orientierungskarte. Man versteht sofort: "Ich bin auf einem Weg, ich bin irgendwo, es gibt Stationen." Das ist kein Dashboard, das ist ein Ort.

2. **"Ein ruhiger Anfang"** — Die Willkommenskarte nimmt den Druck sofort weg. "Es muss nicht alles auf einmal erledigt werden" — das ist der vielleicht wichtigste Satz der gesamten App. Für Menschen in belastenden Lebenssituationen (Sozialhilfe, Migration, Schulden) ist das ein Unterschied.

3. **Die Kapitel-Tier-Struktur** — "Dein Alltag", "Deine Absicherung", "Dein Schutz" gruppieren die 7 Kapitel nicht nach Verwaltungslogik, sondern nach Lebensbedeutung. Das ist ein editorialer Ansatz, kein Admin-Panel.

4. **Orientierungstexte in den Kapiteln** — Jedes Kapitel hat einen italischen Satz, der erklärt, warum man hier ist ("Deine Versicherungsdetails an einem Ort. Hilfreich beim Wechsel oder bei Anträgen auf Prämienverbilligung"). Das sind keine Platzhalter — das sind menschliche Begründungen.

5. **Empty States mit Orientierung** — Die sandfarbenen Karten ("Dein Zuhause — wie du wohnst, verändert sich mit der Zeit") sind warmherzig und druckfrei. Sie sagen, wo man beginnen kann, ohne zu fordern.

6. **Spiegelungsschicht (Mirror Layer)** — Die automatisch generierten Lebenssätze ("Sophie, geboren 1990, wohnhaft in Zürich") verwandeln Formulareingaben in einen Spiegel des eigenen Lebens. Das ist das stärkste emotionale Feature.

7. **Helvetia als Behörden-Icon** — Eine klassische allegorische Figur mit Speer, Schild und Strahlenkrone. Sie sagt: "Hier geht es um den Staat, aber du stehst unter seinem Schutz." Das ist kein generisches Amtssymbol.

8. **Der Fünfliber als Finanzen-Icon** — Lorbeerkranz, Schweizer Wappen, "5 FR." — sofort schweizerisch, sofort vertrauenswürdig. Das ist das beste Icon der gesamten App.

9. **Kontextuelle Orientierungshilfen** — Unter Eingabefeldern erscheinen salbeigrüne Hinweise ("Deine AHV-Nummer begleitet Dich Dein ganzes Arbeitsleben"). Diese Helvetia-Layer-Texte sind informierend, nicht belehrend.

10. **Angaben/Dokumente-Tabs** — Die klare Trennung zwischen Eingabe und Dokumentenablage in jedem Kapitel ist pragmatisch und nachvollziehbar.

---

## B. Was noch schwach wirkt

1. **Formularfelder dominieren den Kapitel-Körper** — Nach dem schönen Header mit Icon, Titel und Orientierungstext trifft man auf eine klassische Formularstruktur: Label, Input, Label, Input. Das ist der Moment, wo der "Ort" wieder zur "Verwaltung" wird. Die Empty-State-Karten helfen, aber sobald man tippt, verschwindet die Ortsgefühl-Schicht.

2. **Keine visuellen Abschnitte innerhalb der Formulare** — In "Basis" folgen Person, Familie, Kinder, AHV direkt aufeinander. Es gibt keine sanften visuellen Trennungen zwischen Lebensthemen innerhalb eines Kapitels. Alles ist ein langer Scroll.

3. **Ausbildung wirkt am dünnsten** — Das Doktorhut-Icon ist funktional, aber generisch. Die Kapitelseite selbst hat wenig Tiefe: Schule, Abschluss, EFZ-Nummer, Zertifikate, Beruf. Es fühlt sich nach einem Formular an, nicht nach einem Lebensraum.

4. **Der Footer ("Geschlossene Beta / Feedback / Datenschutz") überlappt auf Mobile** — Er sitzt als fixierter Footer und kollidiert mit dem letzten sichtbaren Formularelement. Auf 375px-Screens wird das letzte Eingabefeld teilweise verdeckt.

5. **Kein visueller Fortschritt innerhalb der Kapitel** — Der 1%-Fortschrittsbalken auf dem Dashboard ist da, aber in den Kapiteln selbst gibt es kein Gefühl von "Ich habe etwas geschafft". Die Spiegelung (Mirror Layer) erscheint nur, wenn Daten da sind — es gibt keinen Übergang vom leeren zum gefüllten Zustand, der sich wie ein Moment anfühlt.

6. **Finanzen-Kapitel: Fünfliber sichtbar, aber Formularkörper nüchtern** — Nach dem atemberaubenden Coin-Icon ist der Formularbereich (Einkommen CHF, Arbeitgeber, Anstellungstyp) rein funktional. Der Kontrast zwischen Icon-Qualität und Formularkörper ist hier am stärksten.

7. **Versicherungen-Kapitel: viele Felder, wenig Wärme** — Grundversicherung, KK-Modell, Prämie, Franchise, Zusatzversicherung, Hausrat, Reise, Cyber, Auto — das ist die längste Feldliste aller Kapitel. Ohne Zwischenüberschriften oder visuelle Pausen fühlt es sich nach Verwaltungsakt an.

8. **Behörden-Kapitel: emotional kälteste Seite** — Trotz Helvetia als Icon ist der Inhalt (Steuerkanton, Steuernummer, Betreibungsstatus, Gerichtsverfahren) der emotional schwerste Bereich. Die Orientierungshilfen helfen, aber es fehlt eine Wärme-Schicht für vulnerable Situationen.

9. **Mountain Trail Icons bei kleiner Grösse** — Auf dem Mobile-Trail sind die Icons ~20px. Helvetia und der Fünfliber verlieren ihre Details und werden zu Konturen. Das ist akzeptabel, aber die Trail-Version nutzt ihre Stärken nicht.

10. **Keine Mikro-Feedback-Momente** — Wenn man ein Feld ausfüllt, passiert nichts Sichtbares ausser der Speicherung. Kein sanftes Aufleuchten, kein Häkchen, kein subtiles Signal "Das hat geklappt." Für eine App, die Ruhe und Vertrauen will, fehlt das positive Feedback.

---

## C. Die 10 stärksten Elemente

| # | Element | Warum es funktioniert |
|---|---------|----------------------|
| 1 | Fünfliber (Finanzen-Icon) | Meisterwerk — Lorbeerkranz, Wappen, Jahreszahl. Sofort schweizerisch. |
| 2 | Helvetia (Behörden-Icon) | Allegorisch, staatlich, schützend. Kein anderes SVG-Icon-Set hat das. |
| 3 | Malojapass-Bergsilhouette | Verwandelt ein Dashboard in eine Landschaft. Orientierung statt Admin. |
| 4 | "Ein ruhiger Anfang"-Karte | Der wichtigste Satz der App. Nimmt Druck, schafft Vertrauen. |
| 5 | Kapitel-Tier-Labels | "Dein Alltag / Deine Absicherung / Dein Schutz" — Lebensbedeutung statt Bürokratie. |
| 6 | Chalet (Wohnen-Icon) | Balkon, Blumenkästen, Fensterläden — erkennbar schweizerisch bis 24px. |
| 7 | Orientierungstexte (Kursiv) | Jedes Kapitel sagt dir, warum du hier bist. Menschlich, nicht technisch. |
| 8 | Empty-State-Karten | Warme, druckfreie Einstiegshilfe. "Beginne mit deiner Krankenkasse." |
| 9 | Salbeigrüne Feld-Hinweise | Kontextwissen direkt am Feld, ohne Tooltip oder Modal. Ruhig, nützlich. |
| 10 | Viersprachigkeit (EN/DE/FR/IT) | Nicht nur übersetzt — kulturell angemessen. Für ein Migrantenprodukt essenziell. |

---

## D. Die 10 schwächsten Elemente

| # | Element | Warum es schwach wirkt |
|---|---------|----------------------|
| 1 | Formularkörper aller Kapitel | Nach dem schönen Header wird es zu Label-Input-Label-Input. Kein Ortsgefühl. |
| 2 | Ausbildung-Kapitel insgesamt | Am dünnsten, am formulartigsten, am wenigsten "Lebensraum". |
| 3 | Versicherungen-Feldliste | Zu lang ohne Zwischenstruktur — Grundversicherung bis Cyber-Police in einem Scroll. |
| 4 | Footer-Overlap auf Mobile | Fixierter Footer verdeckt das letzte Eingabefeld auf 375px. |
| 5 | Behörden-Inhaltstemperatur | Emotional schwerste Themen (Betreibung, Gericht), aber kälteste Darstellung. |
| 6 | Kein Mikro-Feedback beim Ausfüllen | Felder speichern stumm. Kein visuelles "Das hat geklappt." |
| 7 | Kein Kapitel-interner Fortschritt | Man weiss nicht, wie weit man in einem Kapitel ist. |
| 8 | Doktorhut-Icon (Ausbildung) | Funktional, aber universal-generisch. Nicht schweizerisch. |
| 9 | Trail-Icons bei 20px auf Mobile | Helvetia und Fünfliber verlieren ihre Seele bei kleinen Grössen. |
| 10 | Fehlende Abschnittsgrenzen in Kapiteln | Person/Familie/AHV/Kontakt fliessen ineinander ohne visuelle Pausen. |

---

## E. Schweizer Identität

**Wo ist sie sichtbar?**

- **Fünfliber**: Stärkstes Symbol. "5 FR.", Schweizer Wappen, Lorbeerkranz — numismatische Präzision.
- **Helvetia**: Speer, Schild, Strahlenkrone — Bundesdesign-Referenz (Briefmarken, Banknoten).
- **Chalet**: Balkon mit X-Muster (Berner Oberland), Fensterläden, Geranien — regionale Architektur.
- **Malojapass-Silhouette**: Engadiner Bergprofil als topographischer Anker.
- **Versicherungen-Schild**: Schweizer Kreuz + Schutzhand — spezifisch, nicht generisch.
- **Kapitelsprache**: KK-Modell, AHV-Nummer, Steuerkanton, EFZ/EBA, Franchise, Prämienverbilligung — durchgehend schweizerisch.
- **"+41" als Default-Ländervorwahl**: Kleines Detail, grosses Signal.
- **CHF als Währungspräfix**: Konsequent, nie EUR oder USD.
- **Kantonsliste**: Nicht "Bundesland" — Kanton.

**Wo fehlt sie?**

- **Doktorhut (Ausbildung)**: Universell, nicht schweizerisch. Ein schweizerisches Ausbildungssymbol (Lehrbuch mit Schweizer Kreuz? Berufslehre-Werkzeug?) würde den Standard der anderen Icons halten.
- **Formularkörper**: Die Felder selbst sind neutral — die Schweizer Identität kommt nur durch die Feld-Labels und Orientierungstexte, nicht durch die visuelle Sprache des Formulars.

---

## F. Risiko Kitsch

**Kein Kitschrisiko vorhanden.**

Der Fünfliber, die Helvetia und das Chalet operieren alle auf der Ebene von Referenz, nicht Klischee:
- Der Fünfliber ist eine Reproduktion, kein Souvenir.
- Helvetia ist eine allegorische Bundesfigur, keine Heidi-Illustration.
- Das Chalet hat architektonische Details (Büge, Lüftlmalerei-Andeutung), keine Kitsch-Vereinfachung.

**Einziger Beobachtungspunkt:** Die Geranien-Bumps am Chalet-Balkon (Kreise mit opacity 0.18) könnten bei extremer Vergrösserung dekorativ wirken. Bei 24px–48px sind sie unsichtbar — kein Problem.

---

## G. Maloja-Skala

| Kapitel | Bewertung | Begründung |
|---------|-----------|------------|
| **Dashboard** | ★★★★☆ (4/5) | Die Bergsilhouette, der Pfad, die Willkommenskarte und die Tier-Labels ergeben zusammen einen Ort. Abzug: Der Übergang zur Kapitelliste darunter fühlt sich noch wie ein Registerwechsel an. |
| **Basis** | ★★★☆☆ (3/5) | Header mit ID-Karten-Icon und Orientierung sind gut. Formularkörper ist klassisch: Vorname, Nachname, Geburtsdatum. Wird durch Spiegelung besser, wenn Daten da sind. |
| **Wohnen** | ★★★½☆ (3.5/5) | Das Chalet-Icon und "Dein Zuhause" setzen den Ton. Die Empty-State-Karte ist warmherzig. Formular (Adresse, PLZ, Miete) ist zweckmässig, aber nicht atmosphärisch. |
| **Finanzen** | ★★★☆☆ (3/5) | Grösster Kontrast zwischen Icon-Qualität (Fünfliber = 5/5) und Formularkörper (Einkommen, Arbeitgeber = 2/5). Das Icon verspricht mehr, als der Körper hält. |
| **Versicherungen** | ★★½☆☆ (2.5/5) | Schild-Icon ist verbessert. Aber der Inhalt ist die längste Feldliste — Grundversicherung bis Cyberpolice ohne Atempause. Fühlt sich am ehesten nach Versicherungsformular an. |
| **Ausbildung** | ★★☆☆☆ (2/5) | Schwächstes Kapitel. Doktorhut ist generisch, Inhalt ist dünn (Schule, Abschluss, Beruf), wenig Tiefe, wenig Schweizer Spezifik jenseits von EFZ/EBA. |
| **Behörden** | ★★★½☆ (3.5/5) | Helvetia als Icon ist hervorragend. Orientierungstexte sind stark. Aber der Inhalt (Steuern, Betreibung, Gericht) ist emotional schwer und visuell kalt. |
| **Notfall** | ★★★★☆ (4/5) | Das Herz-Kreuz-Icon ist genau richtig — warm, nicht alarmierend. "Das hier vorbereitet zu haben, kann einen echten Unterschied machen" ist der zweitwichtigste Satz der App. Formular ist kurz und fokussiert. |

**Durchschnitt: 3.2 / 5**

---

## H. Schlussurteil

### "Fühlt sich Maloja jetzt wie Maloja an?"

**Ja — auf der Oberfläche. Noch nicht in der Tiefe.**

**Was Maloja ausmacht**, ist jetzt sichtbar:
- Der Malojapass als Orientierungslandschaft
- Die 7 Kapitel als Lebensstationen, nicht als Menüpunkte
- Die Schweizer Symbole (Fünfliber, Helvetia, Chalet) als kulturelle Anker
- Die Orientierungstexte als ruhige, menschliche Stimme
- Die Spiegelungsschicht als emotionaler Kern

**Was noch fehlt**, ist die Durchgängigkeit:
- Die Header der Kapitel fühlen sich wie ein Ort an (Icon, Titel, Orientierung, Tier-Label)
- Die Körper der Kapitel fühlen sich noch wie Formulare an (Label, Input, Repeat)
- Der Übergang zwischen "Willkommen an diesem Ort" und "Bitte fülle aus" ist zu abrupt

**Die zentrale Erkenntnis:**

Maloja hat jetzt eine starke **Fassade** — die Icons, die Bergsilhouette, die Begrüssungstexte, die Tier-Struktur. Das ist real und es funktioniert. Aber hinter der Fassade sind die Räume noch nicht eingerichtet. Die Formulare sind funktional korrekt, aber sie fühlen sich nicht wie Zimmer in einem Haus an — sie fühlen sich wie Verwaltungsformulare mit einem schönen Briefkopf an.

**Das ist kein Vorwurf.** Die Konsolidierung hat genau das getan, was sie tun sollte: die Identität sichtbar machen, die Qualität der Oberfläche heben, die Symbole stärken. Der nächste Schritt wäre, diese Identität in die Tiefe der Formularkörper zu tragen — durch Abschnitte, Atempausen, Mikro-Feedback und emotionale Temperatur.

**Maloja fühlt sich wie Maloja an, wenn man ankommt.**
**Es fühlt sich noch wie ein Formular an, wenn man arbeitet.**

Das ist der ehrliche Stand.

---

*Geprüft am 2026-06-08 nach Abschluss der Consolidation Sprints 0–4.*
*Keine Implementierung. Keine Commits. Nur Beobachtung.*
