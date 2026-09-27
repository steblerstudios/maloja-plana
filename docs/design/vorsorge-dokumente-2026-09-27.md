# Vorsorgeauftrag, Bestattungswünsche, Testament — Entwurf zur Prüfung

*Stand 27.09.2026 · Entwurf, noch nicht gebaut · Fortsetzung von «Patientenverfügung und solche
Dinge» (Wunsch Stebler Studios). Vorbild: `docs/design/patientenverfuegung-fragen-2026-09-27.md`
(PR #440) — gleiche Regeln: eine Frage pro Seite, «Weiss ich noch nicht», kein Standardwert,
nichts vorbelegt, Hinweise auf Begleitblatt, kein `trust.localOnly`.*

## Übersicht — was wir vorschlagen

| Dokument | Form nach Gesetz | Was Maloja liefert |
|---|---|---|
| Vorsorgeauftrag | eigenhändig (von Anfang bis Ende von Hand, datiert, unterzeichnet) oder öffentlich beurkundet — ZGB Art. 361 Abs. 1 und 2 | **Abschreib-Vorlage**: Fragen → fertiger Text, den man von Hand abschreibt. Der Ausdruck selbst ist **kein** Vorsorgeauftrag. |
| Bestattungswünsche | keine Formvorschrift im Bundesrecht — **zur Prüfung** | Druckdokument wie die Patientenverfügung |
| Testament | eigenhändig (Art. 505 Abs. 1), öffentlich (Art. 499) oder mündlich (Art. 498, 506 ff.) | **kein Generator**, nur Wegweiser — Begründung unten |

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
| KESB prüft und validiert, wenn Urteilsunfähigkeit eintritt | Art. 363 | Hinweis im Begleitblatt |
| Entschädigung: fehlt eine Anordnung, legt die KESB eine angemessene fest | Art. 366 | Frage «Entschädigung» |
| Beauftragte Person kann kündigen | Art. 367 | Ersatzperson begründen |

**Fragen — eine pro Seite:**

| # | Frage | Antworten |
|---|---|---|
| 1 | Gibt es schon einen Vorsorgeauftrag? | Nein · Ja, dieser ersetzt ihn · Ja, dieser ergänzt ihn (+ Datum) |
| 2 | Wer soll für mich handeln? | Name, Geburtsdatum, Adresse, Beziehung |
| 3 | Für welche Bereiche? | Mehrfach: Personensorge · Vermögenssorge · Vertretung im Rechtsverkehr |
| 4 | Gibt es Weisungen? | Freitext, freiwillig (z. B. Wohnung behalten, Spenden weiterführen) |
| 5 | Wer, wenn diese Person nicht kann oder will? | Ersatzperson(en) |
| 6 | Entschädigung? | Nur Spesen · Angemessene Entschädigung · Weiss ich noch nicht (→ Art. 366, die KESB legt fest) |
| 7 | Soll der Auftrag beim Zivilstandsamt eingetragen werden? | Hinweis, keine Antwort ins Dokument |

**Schluss:** Text in grosser, gut abschreibbarer Schrift, Zeilen mit Platz. Oben gross:
*«Dieser Ausdruck ist kein Vorsorgeauftrag. Gültig ist nur, was Sie ganz von Hand abschreiben,
datieren und unterschreiben — oder öffentlich beurkunden lassen.»*

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
- Formfehler machen es anfechtbar (Art. 520).
- Kurz: ein Fragebogen kann hier eine Beratung nicht ersetzen, und ein Fehler trifft die Familie
  erst, wenn niemand mehr nachfragen kann.

Wegweiser zeigt: die drei Formen (Art. 498), eigenhändig heisst ganz von Hand (Art. 505 Abs. 1),
Hinterlegung möglich (Art. 505 Abs. 2, kantonal), Beratung bei Notariat oder Anwaltschaft.

## Bündel

Startdatei nach #437 + #440 ≈ 64,80 / 65 kB. Vorschlag: **keine neue Route** für den Vorsorgeauftrag
— die Vorlage kommt in die bestehende Ansicht `#/vorsorgeauftrag`. Bestattungswünsche brauchen eine
Route (≈ +0,05 kB) — vorher messen.
