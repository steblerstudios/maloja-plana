# Maloja Plana — Post Section Voice Review (V2)

**Datum:** 2026-06-08
**Commit:** a7ad2e3 (Add section voice layer to chapter forms)
**Geprüft:** Dashboard, alle 7 Kapitel, Desktop + Mobile (375px)
**Perspektive:** Erstbenutzerin, die Maloja zum ersten Mal öffnet
**Vergleich mit:** MALOJA_REVIEW_AFTER_CONSOLIDATION.md (nach Sprint 0–4)

---

## A. Veränderung seit dem letzten Review

Das erste Review endete mit dem Satz:

> "Maloja fühlt sich wie Maloja an, wenn man ankommt. Es fühlt sich noch wie ein Formular an, wenn man arbeitet."

Sprint 5 (Section Voice Layer) adressiert genau diesen Bruch. 29 kursive Einleitungssätze in Salbeigrün erscheinen jetzt zwischen Sektionsüberschrift und erstem Eingabefeld. Die Wirkung:

**Was sich verändert hat:**

1. **Der Bruch nach dem Header ist weicher.** Wo vorher direkt unter den Angaben/Dokumente-Tabs ein Label-Input-Block begann, steht jetzt ein Satz, der den Kontext setzt. "Dein Name und Geburtsdatum, so wie sie in offiziellen Dokumenten stehen." Das ist keine Instruktion — es ist eine Einordnung.

2. **Sektionen haben jetzt Temperatur.** Vorher war eine Sektion nur eine Linie mit einem Label ("Person", "Kontakt", "Familie"). Jetzt ist sie ein kleiner Absatz mit Überschrift und Stimme. Der Unterschied ist subtil, aber spürbar: aus Verwaltungsabschnitten werden benannte Lebensthemen.

3. **Die längsten Kapitel profitieren am meisten.** Versicherungen hatte 17 Felder ohne Atempause. Jetzt gibt es 6 Sektionen mit je einer ruhigen Einleitung — "Jede Person in der Schweiz hat eine Krankenkasse", "Was passiert, wenn etwas Unerwartetes eintritt?" — die das Scrollen gliedern.

4. **Die Designsprache ist durchgängig.** Die Section Voices verwenden exakt die gleiche typografische Behandlung wie die Kapitel-Intros (kursiv, Salbeigrün, text.sm, leading.relaxed). Es gibt keine neue Ebene — es ist die gleiche Stimme, die jetzt auch in der Tiefe spricht.

5. **Vier Sprachen gleichwertig.** Alle 29 Sätze existieren in DE, EN, FR, IT. Keine Platzhalter, keine maschinenübersetzten Fragmente.

**Was sich nicht verändert hat:**

- Das Dashboard ist unverändert (war bereits stark)
- Die Kapitelheader sind unverändert (waren bereits stark)
- Die Feldstrukturen selbst (Label, Input) sind identisch
- Kein Mikro-Feedback beim Ausfüllen (bleibt eine Lücke)
- Kein kapitelinterner Fortschritt (bleibt eine Lücke)
- Footer-Overlap auf Mobile (bleibt vorhanden)

---

## B. Neue Maloja-Skala

| Kapitel | Sprint 0–4 | Sprint 5 | Δ | Begründung |
|---------|-----------|----------|---|------------|
| **Dashboard** | 4.0 | 4.0 | — | Unverändert. Bergsilhouette, Tier-Labels, "Ein ruhiger Anfang" — alles wie gehabt. War und bleibt der stärkste Einstieg. |
| **Basis** | 3.0 | 3.5 | +0.5 | Person/Kontakt/Familie haben jetzt je einen einleitenden Satz. Der Übergang vom Header in die Felder ist weniger abrupt. "Wer zu Deinem Haushalt gehört, beeinflusst Steuern, Versicherungen und Unterstützungsansprüche" — das ist kein Formularhinweis, das ist Lebenskontext. |
| **Wohnen** | 3.5 | 4.0 | +0.5 | 4 Sektionen (Adresse, Kosten, Vermieter, Eigentum) geben dem Kapitel eine klare Erzählstruktur. "Mietkosten und Nebenkosten — wichtig für die Steuererklärung und für Unterstützungsanträge" macht die Eingabe sinnvoll, nicht pflichtmässig. |
| **Finanzen** | 3.0 | 3.5 | +0.5 | 6 Sektionen verwandeln die längste Zahlenparade in benannte Etappen. "Ein grober Überblick genügt. Exakte Beträge sind weniger wichtig als die Grössenordnung" nimmt den Druck. Der Kontrast zwischen Fünfliber und Formularkörper ist kleiner geworden — der Körper hat jetzt selbst Stimme. |
| **Versicherungen** | 2.5 | 3.5 | +1.0 | **Grösster Gewinn.** Von 17 Feldern in einem endlosen Scroll zu 6 benannten Sektionen. "Jede Person in der Schweiz hat eine Krankenkasse" ist genau die Einordnung, die eine Erstnutzerin braucht. Das Kapitel fühlt sich nicht mehr nach Versicherungsformular an, sondern nach organisierter Übersicht. |
| **Ausbildung** | 2.0 | 2.5 | +0.5 | 3 Sektionen (Bildung, Arbeit, Sprachen) geben Struktur. "Deine schulische und berufliche Ausbildung. Nützlich für Bewerbungen und Anerkennungsverfahren" ist gut. Bleibt aber das dünnste Kapitel — wenige Felder, generisches Icon, wenig Tiefe. |
| **Behörden** | 3.5 | 4.0 | +0.5 | "Die Steuererklärung gehört zum Schweizer Alltag. Hier behältst Du Fristen und Zuständigkeiten im Blick." — das normalisiert ein Thema, das für viele Menschen stressbeladen ist. Helvetia als Icon + ruhige Stimme = der emotional schwere Inhalt wird tragbar. |
| **Notfall** | 4.0 | 4.5 | +0.5 | **Stärkstes Kapitel insgesamt.** "Wer soll zuerst informiert werden? Ein Name und eine Telefonnummer genügen als Anfang." — das ist menschlich, nicht klinisch. Die 4 Sektionen (Kontakt, Medizinisches, Ärztliche Betreuung, Vorsorge) bilden eine natürliche Erzählung vom Akutfall bis zur Langzeitvorsorge. |

**Durchschnitt Sprint 0–4: 3.2 / 5**
**Durchschnitt Sprint 5: 3.7 / 5**
**Verbesserung: +0.5 Punkte**

---

## C. Grösste Gewinne

### 1. Versicherungen: vom Formular zur Übersicht (+1.0)

Das vorher schwächste Arbeitskapitel hat den grössten Sprung gemacht. 6 Sektionen mit je einer ruhigen Einleitung verwandeln eine Endlos-Feldliste in eine gegliederte Bestandesaufnahme. Der Satz "Was passiert, wenn etwas Unerwartetes eintritt?" vor den Zusatzversicherungen gibt dem Thema eine menschliche Rahmung.

### 2. Notfall: vom guten zum besten Kapitel (+0.5 → 4.5)

Notfall war schon vor Sprint 5 emotional stimmig. Mit den Section Voices wird die Erzählung komplett: Notfallkontakt → Medizinisches → Ärztliche Betreuung → Vorsorge. Jede Sektion hat jetzt eine eigene Einleitung, die den Übergang vom Akuten zum Langfristigen begleitet. Das ist kein Formular — das ist ein durchdachtes Vorsorgegespräch.

### 3. Behörden: emotionale Temperatur korrigiert (+0.5 → 4.0)

Das letzte Review kritisierte die "kälteste Seite". Die Section Voices bringen genau die Wärme, die fehlte: "Die Steuererklärung gehört zum Schweizer Alltag" normalisiert, "Hier kannst du festhalten, wer dich in rechtlichen Fragen vertritt" gibt Handlungsmacht statt Ohnmacht.

### 4. Die Identitätslücke ist kleiner geworden

Die zentrale Kritik des ersten Reviews war: "Maloja fühlt sich wie Maloja an, wenn man ankommt. Es fühlt sich noch wie ein Formular an, wenn man arbeitet." Sprint 5 schliesst diese Lücke nicht vollständig — die Felder selbst bleiben Label-Input-Blöcke — aber die Sektionen dazwischen tragen jetzt die Maloja-Stimme. Der Übergang von "Willkommen" zu "Bitte ausfüllen" ist ein Gleiten statt ein Bruch.

---

## D. Verbleibende Lücken

### 1. Die Felder selbst bleiben stumm

Die Section Voices adressieren den Raum *zwischen* den Feldgruppen. Aber die Felder selbst — das, womit die Nutzerin die meiste Zeit verbringt — sind weiterhin neutrale Label-Input-Paare. Wenn man tippt, ist man im Formular, nicht in Maloja. Das ist kein Mangel des Section Voice Layers, sondern die Grenze dessen, was er leisten kann.

### 2. Kein Mikro-Feedback beim Ausfüllen

Wenn man ein Feld ausfüllt und weitergeht, passiert nichts Sichtbares. Kein sanftes Checkmark, kein Farbwechsel, kein "Gespeichert"-Signal am Feld. Für eine App, die Ruhe und Bestätigung kommunizieren will, bleibt das eine fehlende Schicht. (Es gibt ein globales "✓ Gespeichert" im Footer — aber das ist nicht feld-nah.)

### 3. Ausbildung bleibt das schwächste Kapitel

Sprint 5 gibt Ausbildung 3 Sektionen, aber das Grundproblem bleibt: wenige Felder, generisches Icon (Doktorhut), wenig Tiefe. Die Section Voices können einem dünn bestückten Kapitel nicht die Dichte geben, die ihm als Inhalt fehlt.

### 4. Footer-Overlap auf Mobile

Auf 375px-Screens kollidiert der fixierte Footer ("Geschlossene Beta · Feedback · Datenschutz") noch immer mit dem letzten Eingabefeld. Das ist ein technisches, kein gestalterisches Problem, aber es stört die sonst ruhige Mobile-Erfahrung.

### 5. Dashboard kennt die Section Voices nicht

Das Dashboard (Bergsilhouette, Tier-Labels, Willkommenskarte) ist unverändert. Es gibt keinen Hinweis darauf, dass die Kapitel jetzt begleitende Texte haben. Das ist kein Fehler — das Dashboard muss nicht alles ankündigen — aber es bedeutet, dass die Section Voices eine Überraschung sind. Ob das gut oder neutral ist, zeigt erst der Nutzertest.

### 6. Kein kapitelinterner Fortschritt

Man weiss in einem Kapitel nicht, wie weit man gekommen ist. Die Section Voices geben dem Scrollen eine Struktur ("Ah, jetzt kommt Sparen"), aber einen Fortschrittshinweis bieten sie nicht.

---

## E. Schlussurteil

### Die 10 Fragen

**1. Fühlt sich Maloja jetzt wie Maloja an?**
Ja — deutlicher als vor Sprint 5. Die Identität reicht jetzt vom Dashboard über die Kapitelheader bis in die Sektionsebene der Formulare. Es gibt drei Schichten, die "Maloja sprechen": die Berglandschaft, die Kapiteleinführungen und neu die Sektionsstimmen.

**2. Wo wirkt noch Verwaltung?**
In den Eingabefeldern selbst. Label → Input → Label → Input ist nach wie vor der Grundrhythmus. Die Section Voices gliedern diesen Rhythmus, aber sie verändern ihn nicht.

**3. Wo wirkt jetzt Lebensraum?**
In der Gesamtbewegung eines Kapitels. Wer Notfall öffnet, erlebt: Herz-Icon → "Wichtige Informationen für den Notfall" → "Wer soll zuerst informiert werden?" → Felder → "Was Ärzte wissen sollten" → Felder → "Dein Hausarzt" → Felder → "Patientenverfügung". Das ist eine Erzählung, kein Formular.

**4. Welche Kapitel haben am meisten gewonnen?**
Versicherungen (+1.0), Behörden (+0.5 auf 4.0), Notfall (+0.5 auf 4.5).

**5. Welche Kapitel bleiben schwach?**
Ausbildung (2.5) — strukturelles Problem, nicht lösbar durch Stimme allein.

**6. Funktionieren die Section Voices?**
Ja. Sie setzen den emotionalen Ton, bevor die Felder erscheinen. Sie erklären, warum dieser Abschnitt existiert. Sie normalisieren schwierige Themen (Schulden, Betreibung, Blutgruppe). Und sie tun das in einem Satz — nie aufdringlich, nie belehrend.

**7. Sind sie zu viel?**
Nein. Die Voices sind typografisch zurückhaltend (kursiv, salbeigrün, 13px) und inhaltlich knapp (1–2 Zeilen). Sie konkurrieren nicht mit den Feldern — sie leiten sie ein. In keinem Kapitel entstand das Gefühl von "zu viel Text".

**8. Sind sie zu wenig?**
An manchen Stellen könnte man argumentieren, dass der Satz allein den Ortswechsel nicht vollständig schafft. Aber: für einen ersten Layer ist die Dosierung richtig. Mehr wäre riskant — die Felder müssen Raum behalten.

**9. Wirkt etwas künstlich?**
Nein. Die Sprache ist durchgehend sachlich, ruhig und auf Augenhöhe. Kein Coaching-Ton ("Du schaffst das!"), kein Verwaltungsdeutsch ("Bitte geben Sie ein"), kein falscher Optimismus. Die Sätze klingen, als hätte eine erfahrene Sozialarbeiterin sie diktiert — nicht eine Marketingagentur.

**10. Wirkt etwas kitschig?**
Nein. Kein einziger Satz ist sentimental, emotional überladen oder motivational. "Auch kleine Rücklagen zählen" ist nüchtern ermutigend, nicht kitschig. "Patientenverfügung, Vorsorgeauftrag, Bestattungswünsche — Themen, die man einmal klären und dann ablegen kann" ist sachlich-realistisch. Die Tonalität trifft die Mitte zwischen Wärme und Nüchternheit.

---

### Die wichtigste Frage:

> "Ist die Identität jetzt tief genug im Produkt verankert, um erstmals echte Nutzerfeedbacks einzuholen?"

**Ja.**

Maloja Plana hat nach Sprint 5 drei funktionierende Identitätsschichten:

1. **Oberfläche** (Sprint 0–4): Dashboard-Landschaft, Kapitel-Icons, Kapitelheader mit Orientierungstexten, Tier-Labels, Empty-State-Karten.
2. **Mittlere Tiefe** (Sprint 5): Section Voices, die den Formularraum in benannte, menschlich gerahmte Abschnitte gliedern.
3. **Punktuelle Tiefe** (Sprint 1–3): Orientierungshinweise an einzelnen Feldern (Helvetia-Layer), Materialität der Oberflächen, typografischer Lift.

Die Identität reicht jetzt vom ersten Bildschirm bis in die einzelnen Formularabschnitte. Sie bricht nicht mehr abrupt ab, wenn man beginnt, Felder auszufüllen. Sie begleitet die Nutzerin von der Ankunft über die Orientierung bis zur konkreten Eingabe.

Was fehlt — Mikro-Feedback, kapitelinterner Fortschritt, stärkere Feld-Identität — sind Verfeinerungen, die sinnvoller nach echtem Nutzerfeedback priorisiert werden als aus der Entwicklerperspektive. Die Grundfrage "Versteht jemand, was das hier ist und warum es so ist?" ist beantwortbar. Maloja ist bereit für Testpersonen.

**Neuer Gesamtstand: 3.7 / 5**
**Bereitschaft für Nutzertest: Ja**

---

*Geprüft am 2026-06-08 nach Abschluss der Consolidation Sprints 0–5.*
*Keine Implementierung. Keine Commits. Nur Beobachtung und Vergleich.*
