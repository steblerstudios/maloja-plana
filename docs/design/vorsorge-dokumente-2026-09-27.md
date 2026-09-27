# Vorsorgeauftrag, Bestattungswünsche, Testament — Entwurf nach Rechtsprüfung

*Geprüft 27.09.2026 von `rechts-pruefer` am Wortlaut: ZGB SR 210 (Stand 1.7.2026), OR SR 220 (1.1.2026),
DSG SR 235.1 (7.7.2025), UWG SR 241 (1.1.2025), ZStV (1.6.2025). Befunde unten unter «Nach der Prüfung» —
sie gehen dem Text darüber vor.*

*Stand 27.09.2026 · Entwurf, noch nicht gebaut · Fortsetzung von «Patientenverfügung und solche
Dinge» (Wunsch Stebler Studios). Vorbild: `docs/design/patientenverfuegung-fragen-2026-09-27.md`
(PR #440) — gleiche Regeln: eine Frage pro Seite, «Weiss ich noch nicht», kein Standardwert,
nichts vorbelegt, Hinweise auf Begleitblatt, kein `trust.localOnly`.*

## Übersicht — was wir vorschlagen

| Dokument | Form nach Gesetz | Was Maloja liefert |
|---|---|---|
| Vorsorgeauftrag | eigenhändig (von Anfang bis Ende von Hand, datiert, unterzeichnet) oder öffentlich beurkundet — ZGB Art. 361 Abs. 1 und 2 | **Abschreib-Vorlage**: Fragen → fertiger Text, den man von Hand abschreibt. Der Ausdruck selbst ist **kein** Vorsorgeauftrag. |
| Bestattungswünsche | keine Formvorschrift im Bundesrecht — **zur Prüfung** | Druckdokument wie die Patientenverfügung |
| Testament | eigenhändig (Art. 505 Abs. 1) oder öffentlich (Art. 499); mündlich **nur** bei ausserordentlichen Umständen (Art. 506) | **kein Generator**, nur Wegweiser — Begründung unten |

## Vorsorgeauftrag — Abschreib-Vorlage

**Rechtlicher Rahmen** (zur Prüfung am Wortlaut):

| Regel | Quelle | Folge |
|---|---|---|
| Eine **handlungsfähige** Person beauftragt eine natürliche oder juristische Person, im Fall ihrer Urteilsunfähigkeit die Personensorge oder die Vermögenssorge zu übernehmen oder sie im Rechtsverkehr zu vertreten | ZGB Art. 360 Abs. 1 | Fragen: wer, welche Bereiche |
| Aufgaben umschreiben, Weisungen erteilen | Art. 360 Abs. 2 | Freitext «Weisungen» |
| Ersatzverfügungen | Art. 360 Abs. 3 | Ersatzperson |
| Eigenhändig: von Anfang bis Ende von Hand, datiert, unterzeichnet | Art. 361 Abs. 2 | Vorlage zum Abschreiben, deutlich: Ausdruck ungültig |
| Eintragung beim Zivilstandsamt auf Antrag | Art. 361 Abs. 3 | Hinweis, freiwillig |
| Widerruf | Art. 362 | wie Patientenverfügung |
| KESB prüft (Abs. 2) und händigt eine Urkunde aus (Abs. 3), wenn Urteilsunfähigkeit eintritt | Art. 363 | Hinweis im Begleitblatt |
| Entschädigung: fehlt eine Anordnung, legt die KESB eine angemessene fest, «wenn dies mit Rücksicht auf den Umfang der Aufgaben als gerechtfertigt erscheint oder wenn die Leistungen … üblicherweise entgeltlich sind»; Spesen werden ohnehin belastet | Art. 366 Abs. 1 und 2 | Frage «Entschädigung» |
| Beauftragte Person kann mit zweimonatiger Frist schriftlich bei der KESB kündigen, aus wichtigen Gründen fristlos | Art. 367 | Ersatzperson begründen |

**Fragen — eine pro Seite:**

| # | Frage | Antworten |
|---|---|---|
| 1 | Gibt es schon einen Vorsorgeauftrag? | Nein · Ja, dieser ersetzt ihn · Ja, dieser ergänzt ihn (+ Datum) |
| 2 | Wer soll für mich handeln? | Name, Geburtsdatum, Adresse, Beziehung |
| 3 | Für welche Bereiche? | Mehrfach: Personensorge · Vermögenssorge · Vertretung im Rechtsverkehr |
| 4 | Gibt es Weisungen? | Freitext, freiwillig (z. B. Wohnung behalten, Spenden weiterführen) |
| 5 | Wer, wenn diese Person nicht kann oder will? | Ersatzperson(en) |
| 6 | Entschädigung? | Unentgeltlich (nur Spesen) · Angemessene Entschädigung · Weiss ich noch nicht |
| 7 | Soll der Auftrag beim Zivilstandsamt eingetragen werden? | Hinweis, keine Antwort ins Dokument |

**Schluss:** Text in grosser, gut abschreibbarer Schrift, Zeilen mit Platz. Oben, **abgesetzt und mit
«nicht abschreiben» markiert**:
*«Dieser Ausdruck ist kein Vorsorgeauftrag – auch nicht mit Ihrer Unterschrift. Die Form verlangt:
von Anfang bis Ende von Ihnen von Hand geschrieben, datiert und unterzeichnet (ZGB Art. 361 Abs. 2)
oder öffentlich beurkundet (Abs. 1). Orientierungshilfe, keine Rechtsberatung.»*
Benennung überall: **«Vorlage zum Abschreiben»**, nie «Vorsorgeauftrag erstellen» (UWG Art. 3 Abs. 1 lit. b).

**Offene Rechtsfragen:**
1. Verhältnis zur Patientenverfügung: Personensorge umfasst medizinische Vertretung? Rangfolge
   Art. 378 Abs. 1 Ziff. 1 («die in einer Patientenverfügung oder in einem Vorsorgeauftrag
   bezeichnete Person») — was, wenn beide Dokumente verschiedene Personen nennen?
2. Juristische Person als Beauftragte: anbieten oder nur natürliche Personen?
3. Ist eine Abschreib-Vorlage haftungsrechtlich heikler als keine (Abschreibfehler, Formmängel)?
4. Wortlaut zum Bereich «Vertretung im Rechtsverkehr»: braucht es Hinweise auf Geschäfte, für
   die eine besondere Vollmacht nötig ist (Grundstücke, Schenkungen)? — nicht belegt.
5. Handlungsfähigkeit (Art. 13) statt nur Urteilsfähigkeit: Folge für minderjährige Nutzer.

## Bestattungswünsche — Druckdokument

**Rechtslage — zur Prüfung, nichts davon belegt:**
- Gibt es eine bundesrechtliche Formvorschrift? Erwartung: nein; Bestattungswesen ist kantonal
  bzw. kommunal.
- Wie verbindlich sind Wünsche der verstorbenen Person für die Angehörigen (Persönlichkeitsrecht
  über den Tod hinaus, Totenfürsorge)? Die App sagt heute im Notfall-Kapitel «Nicht rechtlich
  bindend, aber wichtig für die Familie» — **stimmt das?**
- Asche verstreuen, Naturbestattung: kantonal verschieden — die App behauptet dazu **nichts** und
  verweist auf die Gemeinde.

**Fragen — eine pro Seite:**

| # | Frage | Antworten |
|---|---|---|
| 1 | Erdbestattung oder Kremation? | Erdbestattung · Kremation · Den Angehörigen überlassen · Weiss ich noch nicht |
| 2 | Wo? | Reihengrab · Urnengrab · Gemeinschaftsgrab · Naturbestattung · Anderes (Freitext) · Den Angehörigen überlassen |
| 3 | Abschied / Abdankung | Religiös (Freitext Konfession) · Nicht religiös · Nur engster Kreis · Keine · Den Angehörigen überlassen |
| 4 | Musik, Texte, Blumen | Freitext, freiwillig |
| 5 | Todesanzeige | Ja, in … · Nur Karten · Keine · Den Angehörigen überlassen |
| 6 | Wer soll benachrichtigt werden? | Liste Name/Telefon, freiwillig |
| 7 | Ist schon etwas geregelt oder bezahlt? | Freitext (z. B. Bestattungsvorsorge, Grab reserviert) |

Neu gegenüber der Patientenverfügung: **«Den Angehörigen überlassen»** als eigene Antwort — sie
erscheint im Dokument als ausdrücklicher Satz, weil sie ein Wunsch ist, keine Lücke.

## Testament — kein Generator

Vorschlag: **nicht bauen**, nur Wegweiser. Gründe (zur Bestätigung durch die Prüfung):
- Pflichtteile (ZGB Art. 470 f., Fassung seit 01.01.2023) — eine Vorlage ohne Kenntnis der
  Familienlage kann sie verletzen; Folge: Herabsetzungsklage.
- Güterrecht und Erbrecht greifen ineinander (Ehe, eingetragene Partnerschaft, Konkubinat).
- Formfehler: auf Klage für ungültig erklärt (Art. 520 Abs. 1; Datum: Art. 520a).
- Kurz: ein Fragebogen kann hier eine Beratung nicht ersetzen, und ein Fehler trifft die Familie
  erst, wenn niemand mehr nachfragen kann.

Wegweiser zeigt: ab 18 und urteilsfähig (Art. 467) · Formen (Art. 498): öffentlich mit Urkundsperson und
zwei Zeugen (Art. 499), eigenhändig ganz von Hand mit «Jahr, Monat und Tag» und Unterschrift
(Art. 505 Abs. 1), mündlich **nur** bei ausserordentlichen Umständen vor zwei Zeugen (Art. 506) ·
Aufbewahrung bei einer Amtsstelle möglich (Art. 505 Abs. 2) · Pflichtteile (Art. 470 f., Hälfte) ·
Beratung bei Notariat oder Anwaltschaft.

## Bündel

Startdatei nach #437 + #440 ≈ 64,80 / 65 kB. Vorschlag: **keine neue Route** für den Vorsorgeauftrag
— die Vorlage kommt in die bestehende Ansicht `#/vorsorgeauftrag`. Bestattungswünsche brauchen eine
Route (≈ +0,05 kB) — vorher messen.

## Nach der Prüfung (27.09.2026) — gilt vor dem Text oben

**Vorsorgeauftrag**
- Ab 18 und urteilsfähig (ZGB Art. 13) — als Satz in der Ansicht; Maloja fragt kein Alter ab.
  (Patientenverfügung: urteilsfähig genügt, Art. 370 Abs. 1.)
- Gewählte Bereiche erscheinen **als Satz** in der Vorlage, nicht als Häkchen — die Aufgaben sind
  zu umschreiben (Art. 360 Abs. 2).
- Freiwilliger Hinweis zu Grundstücken, Schenkungen, Vergleich (OR Art. 396 Abs. 3): «wenn gewollt,
  ausdrücklich hinschreiben» — Anwendbarkeit über Art. 365 Abs. 1 **nicht belegt**, keine Rechtsbehauptung.
- Juristische Person als Beauftragte zulässig (Art. 360 Abs. 1) — anbieten.
- **Abgleich mit der Patientenverfügung:** beide Dokumente stehen in Art. 378 Abs. 1 Ziff. 1 auf
  derselben Stufe, eine Kollisionsregel fehlt; bei unterschiedlichen Auffassungen bestimmt die KESB
  (Art. 381 Abs. 2 Ziff. 2). Nennt der Vorsorgeauftrag eine andere Person als `notfall.pvAntworten.vertretung`:
  Hinweis, dieselbe Person oder eine ausdrückliche Rangfolge zu nennen.

**Bestattungswünsche**
- Keine Aussage zur Verbindlichkeit — nicht belegt. Bestehender Hinweis `de.js` ~2152 «Nicht rechtlich
  bindend» ist eine unbelegte Rechtsbehauptung → neu: «Wünsche für Bestattung oder Kremation schriftlich
  festhalten und den Angehörigen sagen, wo sie liegen. Was möglich ist, regeln Kanton und Gemeinde.»
- Frage 2 trennen: **Grabart** und **Ort**. «Naturbestattung» und «Gemeinschaftsgrab» mit Zusatz
  «nicht überall möglich – bei der Gemeinde fragen».
- **Konfession gestrichen** — besonders schützenswert (DSG Art. 5 lit. c Ziff. 1); Frage 3 nur noch
  «Religiös · Nicht religiös · …» ohne Freitext zur Konfession. Freitext bei Musik/Texte bleibt freiwillig.
- Hinweis: Testamente werden erst nach Einlieferung eröffnet (Art. 557 Abs. 1) — Bestattungswünsche
  nicht nur ins Testament schreiben.

**Daten Dritter**
- Nur Nötiges: bei der beauftragten Person Geburtsdatum und Adresse freiwillig; bei zu Benachrichtigenden
  nur Name und Telefon. Datenschutzerklärung nennt «Angaben zu Dritten» (DSG Art. 19 Abs. 1 und 3).
- Solange alles auf dem Gerät bleibt, greift DSG Art. 2 Abs. 2 lit. a (persönlicher Gebrauch); **mit
  Konten fällt das weg** — dann ausdrückliche Einwilligung für besonders schützenswerte Daten.

**Nicht am Wortlaut geprüft**
- Haftung OR 41 ff. / 97 ff. · Personensorge = medizinische Vertretung? · juristische Person als
  medizinische Vertretung · Verbindlichkeit von Bestattungswünschen (Persönlichkeitsrecht, BGer) ·
  kantonales Bestattungsrecht · Erbrecht im Konkubinat
