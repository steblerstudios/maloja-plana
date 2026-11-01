# Digitale Ordnung — Schweizer Konzept

> **Detailblatt zu [`../IDEEN.md`](../IDEEN.md) §1.** Status: Konzept vom 01.11.2026, nichts
> gebaut. Anstoss war das Datenschutz-Spiel Reclaim City
> (play.multiversegames.ai/reclaim-city). Übernommen wird der Gedanke, nicht dessen Texte.
> Die Darstellung als Haus folgt [`grundstueck-und-modi.md`](grundstueck-und-modi.md).
> Geprüft am 01.11.2026 mit `rechts-pruefer`; seine Befunde sind eingearbeitet. Das ersetzt
> nicht die Prüfung der App-Texte (§8).

## 1 · Die Idee in einem Satz

Maloja führt in ruhigen Schritten durch das, was man selbst tun kann, damit Konten, Geräte und
persönliche Daten in der Schweiz in Ordnung sind. Jede Aufgabe ist eine echte Handlung ausserhalb
der App. Maloja erklärt, verlinkt die Stelle und merkt sich den eigenen Haken.

## 2 · Was Maloja dabei nicht tut

| Grenze | Grund |
|---|---|
| Fragt nie nach Passwörtern, Codes oder Kontodaten | Betrugsschutz und Vertrauen: dieselbe Regel lehrt das Konzept selbst |
| Verbindet sich mit keinem Konto und prüft nichts im Hintergrund | local-first, CSP self-only, keine stillen Datenabflüsse |
| Prüft keine E-Mail-Adresse bei fremden Diensten | das wäre eine Datenübermittlung; ein Link zum Selbstprüfen wäre ein eigener Entscheid |
| Speichert keine Ausweiskopie | die Briefe nennen sie nur als Beilage, wenn die Stelle sie verlangt |
| Zeigt keinen Risiko-Wert | eine Angst-Zahl ist weder belegbar noch ruhig |
| Keine Serie, keine Punkte, kein Vergleich | Anti-Pattern aus `grundstueck-und-modi.md` §0 |
| Empfiehlt keinen Anbieter gegen Geld | Unabhängigkeit; siehe §6 |

Der Ablauf speichert lokal nur den Stand je Schritt: offen, erledigt oder «trifft nicht zu».
Kontonamen werden nicht abgefragt. Name und Adresse im Brief kommen aus den vorhandenen
Angaben oder werden nur für den Brief eingetippt; **wie genau, ist beim Bau zu entscheiden.**

## 3 · Die acht Bereiche

Eigene Reihenfolge und eigene Namen. Sie beginnt bei dem, woran am meisten hängt.

| # | Bereich | Was man tut | Beleg |
|---|---|---|---|
| 1 | **Schlüssel** | Für jeden Dienst ein eigenes Passwort · Passwortmanager · Zwei-Faktor, wo möglich · bei der Haupt-E-Mail anfangen (unsere Einschätzung) | [BACS, Geräteschutz](https://www.bacs.admin.ch/de/geraeteschutz) |
| 2 | **Geräte** | Sicherheits-Updates automatisch · Mobilgeräte und Router aktuell · Datensicherung nach der 3-2-1-Regel | [BACS, Geräteschutz](https://www.bacs.admin.ch/de/geraeteschutz), [BACS, Erste Schritte](https://www.bacs.admin.ch/de/erste-schritte-privat) |
| 3 | **Wichtige Konten** | Dieselben Regeln zuerst dort anwenden, wo es zählt, etwa Bank, Krankenkasse, Steuern | unsere Einschätzung, kein Amtstext |
| 4 | **Sichtbar sein** | Werbesperre im Telefonverzeichnis · adressierte Werbung · soziale Medien absichern | UWG Art. 3 Abs. 1 lit. u, [SDV](https://sdv-konsumenteninfo.ch/robinsonliste/), [BACS, Erste Schritte](https://www.bacs.admin.ch/de/erste-schritte-privat) |
| 5 | **Wer hat meine Daten** | Auskunft verlangen · Falsches berichtigen lassen · Löschung verlangen | DSG Art. 25, 32, [EDÖB-Musterbriefe](https://www.edoeb.admin.ch/de/musterbriefe-datenschutz) |
| 6 | **Betrug erkennen** | Zeitdruck erkennen · über einen zweiten Weg prüfen · Passwörter nie über einen Link eingeben | [BACS, Geräteschutz](https://www.bacs.admin.ch/de/geraeteschutz), [BACS, Erste Schritte](https://www.bacs.admin.ch/de/erste-schritte-privat) |
| 7 | **Wenn es passiert ist** | Passwort ändern · bei Finanzdiensten den Anbieter sofort kontaktieren · melden · Anzeige prüfen | [BACS, Konto gehackt](https://www.bacs.admin.ch/de/konto-gehackt) |
| 8 | **Wenn ich ausfalle** | Regeln, wer im Notfall Zugang bekommt, ohne Passwörter in Maloja abzulegen | noch zu erarbeiten, gehört zum Nachlass-Zugang (IDEEN §11) |

Jeder Bereich läuft in vier Stufen: **ansehen → prüfen → schützen → erledigt**. Jeder Schritt lässt
«trifft nicht zu» zu, und nichts verfällt.

## 4 · Belege und Grenzen

Stand gelesen am 01.11.2026, DSG/DSV/UWG auf Fedlex. Vor dem Bau neu prüfen.

- **Geltung:** Das DSG gilt für Private und Bundesorgane (Art. 2 Abs. 1). Vor jedem Brief fragt
  Maloja deshalb, wer die Daten hat. Gegen Bundesorgane läuft der Anspruch über Art. 41 DSG, nicht
  Art. 32, und der EDÖB führt getrennte Vorlagen. Für kantonale und kommunale Stellen gilt:
  «Kantonales Datenschutzrecht, nicht in dieser Vorlage.»
- **Auskunft:** Jede Person kann Auskunft verlangen, ob Personendaten über sie bearbeitet werden
  (DSG Art. 25 Abs. 1). Sie ist kostenlos (Abs. 6), ausnahmsweise ist bei unverhältnismässigem
  Aufwand eine Beteiligung bis CHF 300 möglich (DSV Art. 19). Sie wird «in der Regel innerhalb von
  30 Tagen» erteilt (Abs. 7), die Frist ist verlängerbar (DSV Art. 18 Abs. 2). Das Begehren ist
  schriftlich zu stellen, und man wirkt bei der Identifikation mit (DSV Art. 16). Die Auskunft kann
  mit Begründung verweigert, eingeschränkt oder aufgeschoben werden (DSG Art. 26).
- **Berichtigung:** Unrichtige Daten kann man berichtigen lassen, ausser bei einem gesetzlichen
  Änderungsverbot oder Archivzwecken im öffentlichen Interesse (Art. 32 Abs. 1). Lässt sich die
  Richtigkeit nicht klären, bleibt ein Bestreitungsvermerk (Abs. 3).
- **Löschung:** Man kann sie verlangen. Durchsetzbar ist sie vor allem, wenn die Bearbeitung
  widerrechtlich ist oder der Zweck weggefallen ist (Art. 6 Abs. 4, 30, 32 Abs. 2). Eine Stelle kann
  ablehnen, etwa mit einem überwiegenden Interesse oder einem Gesetz (Art. 31 Abs. 1). Das Blatt
  verspricht deshalb kein bedingungsloses «Recht auf Löschung». Art. 32 und 41 nennen dafür keine
  Frist: ein Datum im Brief ist eine eigene Bitte, keine gesetzliche Frist. Den Ton der EDÖB-Vorlage
  («unverzüglich», Satz zu den Behörden) übernimmt Maloja nicht unverändert.
- **Auskunfteien:** Der EDÖB sagt, Bonitätsdaten dürften grundsätzlich ohne Einwilligung bearbeitet
  werden. Wer die Bearbeitung für widerrechtlich hält, verlangt die Löschung schriftlich und kann
  bei Ablehnung ans Zivilgericht gelangen ([EDÖB, Kredit und Inkasso](https://www.edoeb.admin.ch/de/kredit-inkasso)).
  Grundsätzlich sind auch die Grundzüge eines Scores zu erklären. Bei Schulden verweist der EDÖB
  für Abzahlung und Betrag auf die Schuldenberatung; dorthin führt auch Maloja. Das
  Betreibungsregister richtet sich nach dem SchKG, nicht nach dem DSG (DSG Art. 2 Abs. 4): ein
  DSG-Löschbrief ist dort der falsche Weg.
- **Telefon:** Unlauter handelt, wer den Vermerk im Telefonverzeichnis nicht beachtet: keine
  Werbung von Personen ohne Geschäftsbeziehung und keine Weitergabe der Daten für Direktwerbung.
  Kunden ohne Verzeichniseintrag sind gleichgestellt (UWG Art. 3 Abs. 1 lit. u), für sie führt
  der Schritt also auf «trifft nicht zu». Betrugsanrufe stoppt das nicht zwingend (unsere
  Einordnung). **Offen:** wie man den Vermerk setzt, ist nicht belegt.
- **Briefkasten:** Der Stopp-Kleber wirkt nur gegen unadressierte Werbung
  ([Post](https://www.post.ch/en/receiving-mail/advertising-in-your-letter-box)). Die
  [Robinsonliste](https://sdv-konsumenteninfo.ch/robinsonliste/) führt der SDV Schweizer
  Dialogmarketing Verband: gratis, je Person einzeln, Wirkung nach rund 2–3 Monaten, bindet nicht
  alle Firmen. Das Formular ist nicht getestet.
- **Melden und Anzeige:** Cybervorfälle gehen über das
  [Meldeformular des Bundes](https://www.report.ncsc.admin.ch/de/chat?path=406%3E407%3E1) mit
  automatisierter Ersteinschätzung. Anzeige erstattet man bei der zuständigen Kantonspolizei,
  das BACS verweist für die Suche auf suisse-epolice.ch und nennt sie insbesondere bei finanziellem
  Schaden ([BACS](https://www.bacs.admin.ch/de/konto-gehackt)). Ob online angezeigt werden kann, ist
  nicht überall gleich belegt: nie als überall möglich beschreiben.
- **E-ID:** Am 30.06.2026 wurde der Start verschoben, ein neues Datum haben wir nicht gefunden
  ([Bund](https://www.eid.admin.ch/en/20260625-neuer-zeitplan-fuer-die-einfuehrung-der-e-id-und-der-vertrauensinfrastruktur-en);
  die Seite verweist heute auf swiyu.admin.ch). Deshalb keine Aufgabe, nur eine Wiedervorlage.

**Noch ohne ausreichenden Beleg, so nicht in die App:** Adresssperre bei der Einwohnerkontrolle
(kantonal, nur ein älterer Presseartikel) · Liste der Auskunfteien und Adresshändler (CRIF,
Moneyhouse und Dun & Bradstreet tauchen in den Quellen auf; Adressen und Abläufe je Stelle fehlen).

## 5 · So fügt es sich in Maloja ein

Die Feature-Regeln verlangen: kein neues Modul, keine neue Dashboard-Zone.

- **Normal-Modus zuerst:** ein Ablauf in der bestehenden Ablauf-Schale, Einstieg im Kapitel Notfall
  (Vorschlag). «3 von 8 Bereichen · als Nächstes: Zwei-Faktor bei der Haupt-E-Mail.»
- **Briefe:** Auskunft, Berichtigung und Löschung als Vorlage, lokal erzeugt, angelehnt an die
  EDÖB-Musterbriefe. Gesendet wird von Hand. **Bedingung:** sichtbarer Hinweis «Orientierungshilfe,
  keine Rechtsberatung» in Ablauf und Brief, Schweizer Quelle je Aussage, ungeprüfte Bausteine mit
  `verify: true`. Ob der bestehende Briefgenerator und sein Hinweistext das tragen, ist nicht geprüft.
- **Wiedervorlage:** höchstens jährlich ein ruhiger Hinweis «Digitale Ordnung ansehen», abschaltbar.
- **Haus (abschaltbare Haut):** Die Eingangstür spiegelt Bereich 1, weitere Bauteile erst nach
  Entscheid. Dieselben Daten wie im Normal-Modus, und «trifft nicht zu» zählt als erledigt.

**Kleinste sinnvolle erste Fassung:** nur Bereiche 1, 6 und 7. Sie brauchen keine Vorlagen, helfen
sofort und stützen sich fast nur auf das BACS.

## 6 · Anbieter wie Proton

**Entscheid 01.11.2026 (Stebler Studios): beides.** Maloja beschreibt zuerst die Eigenschaften und
nennt danach mehrere Beispiele. Proton Mail kann eines davon sein, nie eine Pflicht, und erst, wenn
die Belege unten geprüft sind. Der Wechsel des E-Mail-Anbieters ist eine freiwillige Kür. Unsere Einschätzung: Er ist aufwendig, und die
abgesicherte bestehende Adresse bringt meist schneller etwas.

- **Regel:** zuerst die Eigenschaft nennen (Standort, Verschlüsselung, Geschäftsmodell), dann
  mehrere Beispiele. Keine Rangliste, keine Affiliate-Links, jeweils mit Prüfdatum.
- **Ehrlich bleiben:** «Schweizer Anbieter» heisst nicht automatisch «Daten liegen in der Schweiz».
  Laut [heise](https://www.heise.de/en/news/Surveillance-Proton-relocates-parts-of-its-infrastructure-from-Switzerland-10538664.html)
  verlegt Proton wegen der geplanten VÜPF-Revision Teile der Infrastruktur, sagt aber zugleich, das
  heisse nicht, die Schweiz zu verlassen. Der Sitz ist laut Proton-Datenschutzerklärung Genf.
  Vor jeder Nennung den Primärtext verlinken. Der heutige Stand von Revision und Standorten ist
  **nicht geprüft**.
- **Noch nicht geprüft:** Threema, Infomaniak und weitere Beispiele.

## 7 · Offene Entscheide

1. Name: «Digitale Ordnung» oder ein anderer.
2. Einstieg: Kapitel Notfall oder anderswo.
3. ~~Anbieter nennen oder nur Eigenschaften beschreiben.~~ ✅ Beides (§6).
4. Regel «aufgeräumter, nie reicher» als Grundsatz bestätigen.

## 8 · Bevor es gebaut wird

Texte durch `rechts-pruefer`, `swiss-precision-pruefer`, `copy-pruefer`, Links durch `link-checker`.
Lücken aus §4 und §6 schliessen, die Rechtsprechung zu DSG Art. 30–32 ist nicht geprüft.
Hinweis und Quellen aus §5 sind Bedingung für jeden Brief. Bau frühestens nach Fassung 7/8.
