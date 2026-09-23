# K48 — Fragen an die Jurist:in

> **Stand: 23.09.2026**, Code-Stand `main` `2f15946`.
> Ergänzt 23.09.2026 um F5–F7 (EU-Produkthaftung, Cyber Resilience Act, AGPL § 13)
> und G1–G4 (freiwillige Unterstützungsbeiträge).
> Zweck: Die juristische Durchsicht vorbereiten, damit die Zeit in die **Fragen**
> geht und nicht ins Einlesen. Jede Frage nennt, **was daran hängt** — ohne
> Entscheid ist eine Antwort nur teuer.
> Einordnung und Belege: `docs/security/compliance-overview.md`.

---

## Was Maloja Plana ist — in vier Sätzen

Ein Orientierungs- und Ordnungswerkzeug für das Leben in der Schweiz: Sozialhilfe,
Prämienverbilligung, Steuern, AHV/BVG, Dokumente, Lebenssituationen. Es läuft
**vollständig im Browser der nutzenden Person** — kein Server, kein Login, kein
Konto, keine Datenübertragung an die Anbieterin. Die Rechner geben **Frankenbeträge**
aus (z. B. «Geschätzte AHV-Altersrente CHF 715/Monat»), immer mit einem Hinweis, dass
es Orientierung ist. Heute: geschlossene Beta, **kostenlos**, Open Source (AGPL-3.0).

**Anbieterin:** Stebler Studios, Basel · **Gerichtsstand laut Impressum:** Basel-Stadt

---

## Was **nicht** geprüft werden muss (ist gemessen, nicht behauptet)

Das spart Zeit — diese Punkte sind am Code bzw. am Bild belegt, Stand 23.09.2026:

- Keine Cookies, keine externen Netzwerkaufrufe, CSP `connect-src 'self'`, Schriften
  lokal. Es fliessen keine Nutzerdaten ab.
- **15 von 15** gerechneten Ansichten zeigen einen Hinweis («Orientierung»,
  «Unverbindlich», «Keine rechtsverbindliche Auskunft») im gerenderten Bild. Das ist
  keine Handmessung mehr, sondern ein Test, der alle 15 Ansichten rendert
  (`src/__tests__/hinweisImBild.test.js`); dass er auf ein Entfernen reagiert, ist
  mit einer Mutationsprobe belegt.
- Alle 10 Lebenssituationen tragen in **allen fünf** Sprachen einen
  Keine-Beratung-Hinweis. Ein Test hält das fest.
- Es gibt **keinen** bezahlten Link (0 von 26 Empfehlungen), **keinen** Versicherer-
  und **keinen** Produktnamen als Empfehlung.
- Keine Dosierungs-, Wechselwirkungs- oder Symptomlogik in den Gesundheits-Ansichten.

---

## A · Haftung und Abgrenzung — die Kernfrage

**A1. Trägt der Haftungsausschluss bei einem Rechenfehler — und gilt er überhaupt?**
Die Rechner nennen konkrete Beträge; jemand könnte danach handeln (z. B. kein
IPV-Gesuch stellen, weil die App «kein Anspruch» andeutet). OR Art. 100 Abs. 1 macht
die Wegbedingung für grobe Fahrlässigkeit nichtig.
**Die Vorfrage ist aber eine andere:** Bei kostenloser Nutzung gibt es gar keinen
Vertrag. Dann geht es nicht um Vertragshaftung, sondern um **Art. 41 OR und
Vertrauenshaftung** — und dort hilft ein Ausschluss in Nutzungsbedingungen nicht,
weil ihn niemand vereinbart hat. Umgekehrt spricht **OR Art. 99 Abs. 2** für uns:
milderes Haftungsmass, «wenn das Geschäft für den Schuldner keinerlei Vorteil
bezweckt» — dieser Vorteil entsteht mit der Paywall.
→ *Was hängt daran:* ob die heutigen Formulierungen reichen oder ob es eine andere
Konstruktion braucht (z. B. Beträge nur als Spannen, oder ein aktiver Vorbehalt vor
dem Ergebnis) — und ob sich die Lage mit dem Preis grundlegend ändert.

**A2. Wo läge hier grobe Fahrlässigkeit?**
Konkret: ein Kanton ändert seine Ansätze, wir merken es drei Monate nicht, die App
rechnet weiter mit alten Werten. Ist das leichte oder grobe Fahrlässigkeit?
→ *Was hängt daran:* wie eng der Aktualisierungs-Prozess für Fachdaten sein muss —
das ist Bauarbeit, keine Textarbeit.

**A3. Ist der Brief-Generator noch Vorlage oder schon Rechtsdienstleistung?**
Er erstellt u. a. Einsprachen gegen Verfügungen der Krankenkasse mit Fristangabe
(ATSG Art. 52), Lohnforderungen (OR Art. 322/323) und Kündigungen — teilweise mit
vorausgefüllten persönlichen Daten.
→ *Was hängt daran:* ob es kantonale Bewilligungspflichten für berufsmässige
Rechtsberatung berührt (BS und Umgebung), und ob die Vorlagen anders gerahmt werden
müssen.

---

## B · Aufsichtsrecht — hängt ganz am Oktober-Entscheid

**B1. Ab wann ist ein Affiliate-Link Versicherungsvermittlung (VAG Art. 40/41)?**
Heute gibt es keinen. Geplant ist eventuell ein Affiliate-Programm.
Art. 40 Abs. 1 knüpft an das **Anbieten oder Abschliessen** von Versicherungsverträgen
an, nicht an den Geldfluss.
Unterfragen: Ist ein Link mit Provision schon ein «Anbieten»? Macht es einen
Unterschied, ob **pro Vertrag** oder **pro Klick** gezahlt wird? Zählt die Aufnahme
eines Versicherers in eine Empfehlungsliste schon als Vermittlung? Und: Würden wir zu
**gebundenen** Vermittlern (Art. 40 Abs. 3) — dann kein Registereintrag, aber Art. 43,
44 und die Informationspflicht nach Art. 45?
→ *Was hängt daran:* ob das Affiliate-Modell überhaupt gebaut wird. Die heutige
Trennlinie im Code lautet: **kein bezahlter Link zu Finanz- oder
Versicherungsanbietern** (ein Test hält sie).

**B2. Ab wann ist der 3a-/Vorsorge-Teil Anlageberatung (FIDLEG)?**
Heute wird nur erfasst und gerechnet, ohne Produktnamen. 3a-Konten und
Freizügigkeitskonten sind keine Finanzinstrumente.
→ *Was hängt daran:* ob der Vorsorge-Rechner je Produktvergleiche zeigen darf.

**B3. White-Label und Dual Licensing**
Kommerzielle Lizenzen sollen erlaubt sein, die App unter fremdem Namen zu betreiben.
Haftet die Anbieterin für die Rechner in einer fremden Instanz? Was muss der
Lizenzvertrag dazu regeln?

---

## C · Datenschutz

**C0. Ist das DSG hier überhaupt anwendbar?**
**Art. 2 Abs. 2 lit. a**: nicht anwendbar auf «Personendaten, die von einer
natürlichen Person ausschliesslich zum persönlichen Gebrauch bearbeitet werden».
Wenn die Daten das Gerät nie verlassen, bearbeitet die nutzende Person ihre eigenen
Daten — Stebler Studios wäre dafür nicht Verantwortliche (Art. 5 lit. j), sondern nur
für das Hosting.
→ *Was hängt daran:* ob Bearbeitungsverzeichnis und DSFA Pflicht oder freiwillige
Übererfüllung sind. Wir führen sie so oder so weiter; die Frage ist, was wir öffentlich
behaupten dürfen.

**C1. Ist «Auskunftsrecht nicht anwendbar» haltbar?**
Unsere Position: Die Anbieterin hat keinen Zugriff auf die Daten, also läuft DSG
Art. 25 ins Leere. Bleibt eine Restpflicht (Information nach Art. 19, Auskunft über
das Nichtvorhandensein)?
→ *Was hängt daran:* ein Absatz in der Datenschutzerklärung — und ob wir uns hier
auf etwas berufen, das nicht trägt.

**C2. Braucht es eine vollständige DSFA (Art. 22)?**
Es werden besonders schützenswerte Daten bearbeitet (Art. 5 lit. c Ziff. 2
Gesundheit und Ziff. 6 Massnahmen der sozialen Hilfe) — aber ausschliesslich lokal.
Eine Kurzfassung liegt vor (`dsfa-kurzfassung.md`).

**C3. Deckt die Datenschutzerklärung den Hosting-Fall?**
Beim Laden verarbeitet der Hoster (Infomaniak, CH) technische Daten. § 5 der
Erklärung nennt das. Reicht die Formulierung?

**C4. Was ändert sich, wenn ein Backend dazukommt?**
Zurzeit nicht geplant, aber Kunden-Stages und Synchronisation stehen im Raum.
→ *Was hängt daran:* ob eine Architekturentscheidung juristische Folgekosten hat.

---

## D · Urheberrecht

**D1. SKOS-Richtlinien.** Sie sind das Werk eines privaten Vereins, also kein
amtlicher Erlass nach URG Art. 5 lit. a. **Aber:** mehrere Kantone erklären sie in
ihrem Sozialhilferecht für verbindlich.
Frage: Werden sie dadurch für diesen Kanton zum amtlichen Erlass? Und wie weit darf
die **Struktur** (Kapitelaufbau, Kategorienlogik) nachgebaut werden, nicht nur die
Beträge?
→ *Was hängt daran:* der Sozialhilfe-Rechner, eines der meistgenutzten Teile.

**D2. Kantonale Steuertabellen und Handbücher.** Wo verläuft die Grenze zwischen
freier Tatsache und geschütztem Werk?

---

## E · Marke

**E1. Ist «Maloja Plana» in den Klassen 9 und 42 eintragungsfähig?**
Registerlage (Swissreg, 23.09.2026): nur **eine** aktive «maloja»-Marke, IR 1786104
der Maloja Clothing GmbH, Klassen 18/25/35. Die Klassen 9 und 42 sind frei.
Offen: «Maloja» ist ein Ortsname in Graubünden — Gemeingut oder Herkunftsangabe nach
MSchG Art. 2 lit. a/c? Und braucht es gegenüber IR 1786104 eine
Ähnlichkeitsrecherche, obwohl die Klassen auseinanderliegen?
→ *Was hängt daran:* CHF 550 und der Zeitpunkt der Anmeldung.

**E2. Trägt der White-Label-Passus vor der Eintragung?**
`trademark-notice.md` behandelt den Namen schon wie eine Marke.

---

## F · Bezahlversion (Entscheid Oktober)

**F0. Kontaktadresse nach UWG Art. 3 Abs. 1 lit. s Ziff. 1 — gilt das heute schon?**
Diese Frage betrifft im Unterschied zum Rest dieses Abschnitts das **kostenlose,
heute live stehende** Angebot, nicht die Bezahlversion. Zwei Teile:
(a) Greift lit. s überhaupt, wenn es keinen Bestellvorgang und keinen Vertrag
gibt? Der Einleitungssatz spricht von «elektronischem Geschäftsverkehr».
(b) Falls ja: Impressum, Datenschutz-Reiter und `/rechtliches/` nennen heute
Name, Ort und E-Mail, **aber keine Strasse** — und `/rechtliches/` trägt zugleich
den Satz «Angaben gemäss Art. 3 Abs. 1 lit. s UWG», behauptet also eine
Vollständigkeit, die sie ohne Strasse nicht hat.
→ *Was hängt daran:* ob der Satz bleiben darf, und ob eine c/o- oder
Geschäftsadresse genügt oder die Wohnadresse nötig ist. Eine erreichbare
Adresse setzen wir so oder so — die Frage ist nur, ob sie geschuldet ist.
→ *Stand 23.09.2026:* Die Stelle ist als sichtbarer Platzhalter markiert und
durch einen absichtlich roten Test gesichert
(`src/__tests__/impressumAdresse.test.js`); ausliefern lässt sich dieser
Stand nicht. Aufgeschlagen ist die Lücke bei einer Durchsicht von aussen.

**F1. Bestellstrecke nach UWG Art. 3 Abs. 1 lit. s Ziff. 2–4.**
Der Wortlaut verlangt: Hinweis auf die technischen Schritte zum Vertragsschluss,
Mittel zur Erkennung und Korrektur von Eingabefehlern, unverzügliche elektronische
Bestätigung. Was heisst das konkret für eine App mit Abo?
→ *Was hängt daran:* **Bauarbeit**, die vor dem Verkaufsstart fertig sein muss.

**F2. Abo-Recht und AGB.** Laufzeit, Kündigung, automatische Verlängerung,
Preisänderungen — welche Vorgaben gelten, und was gehört in die AGB? Dazu **UWG
Art. 8**: welche Klauseln wären ein «erhebliches und ungerechtfertigtes Missverhältnis»?
Das trifft zugleich unseren Haftungsausschluss.

**F2a. Gerichtsstand.** Impressum und App nennen Basel-Stadt. **ZPO Art. 35 Abs. 1
lit. a** verbietet den Vorausverzicht auf den Konsumentengerichtsstand (Art. 32).
Heute folgenlos, weil es keinen Vertrag gibt. Mit der Paywall: müssen wir die Klausel
ändern — und was setzen wir stattdessen hin?

**F3. Verkauf an Personen in der EU — ausschliessen oder erfüllen?**
Bei EU-Verbrauchern käme die **DSGVO** dazu. Beim **European Accessibility Act**
(RL (EU) 2019/882) greift dagegen voraussichtlich **Art. 4 Abs. 5**: Kleinstunternehmen,
die Dienstleistungen anbieten, sind ausgenommen (< 10 Beschäftigte, ≤ 2 Mio. EUR,
Art. 3 Nr. 23).
Fragen: Trägt die Kleinstunternehmen-Ausnahme auch für eine Schweizer Anbieterin?
Und ab welcher Grösse fiele sie weg?
→ *Was hängt daran:* ob der Kauf auf die Schweiz beschränkt wird — eine
Produktentscheidung mit Rechtsfolge, nicht umgekehrt.

**F4. MWST.** Steuerpflicht ab CHF 100 000; elektronische Dienstleistung — wo ist
der Ort der Leistung bei Kundschaft im Ausland?

**F5. EU-Produkthaftung für Software.** Richtlinie (EU) 2024/2853 erstreckt die
verschuldensunabhängige Haftung ausdrücklich auf Software; die Mitgliedstaaten
müssen sie **bis 9. Dezember 2026** umsetzen.
Fragen: Greift sie bei einem Verkauf an EU-Verbraucher auch für eine Schweizer
Anbieterin? Ist ein falscher Frankenbetrag in einem Rechner ein «Fehler» im Sinn der
Richtlinie? Und: Gibt es in der Schweiz eine Entsprechung — deckt das PrHG reine
Software?
→ *Was hängt daran:* ob ein EU-Verkauf überhaupt in Frage kommt. Das ist die
schärfste der drei EU-Regeln.

**F6. Cyber Resilience Act.** VO (EU) 2024/2847 gilt ab 11.12.2027, die
**Meldepflichten nach Art. 14 bereits seit 11.9.2026**, Kapitel IV seit 11.6.2026.
**Vorfrage zuerst:** Erwägungsgrund 12 nimmt Websites, die kein Produkt mit digitalen
Elementen unterstützen, und Cloud-/SaaS-Dienste vom Anwendungsbereich aus. Ist eine im
Browser ausgelieferte Web-Anwendung damit ganz draussen — und wird eine **native
App-Store-App** (`ios/`, Capacitor) zum Produkt mit digitalen Elementen?
Erst danach: Fällt eine kostenpflichtige AGPL-Anwendung aus der FOSS-Ausnahme, und ab
welcher Form der Monetarisierung (Abo? Spende? Dual Licensing? White-Label?)? Und
greifen die Pflichten für «Verwalter quelloffener Software» nach **Art. 24** auch ohne
Monetarisierung?
→ *Was hängt daran:* zuerst die Vertriebsform, dann die Monetarisierung.

**F7. AGPL § 13 bei White-Label.** Betreibt ein Lizenznehmer eine eigene Instanz,
muss er den Nutzenden den Quellcode anbieten. Was muss der Lizenzvertrag dazu
regeln, damit die Pflicht nicht bei der Anbieterin landet?

---

## G · Freiwillige Unterstützungsbeiträge (vor dem Einbau eines Unterstützen-Knopfs)

Überlegt wird ein Hinweis «Maloja Plana unterstützen» — freiwilliger Beitrag,
**keine Gegenleistung**, ausdrücklich **nicht steuerlich abzugsfähig** (DBG Art. 33a
setzt eine steuerbefreite Empfängerin voraus). Die App bliebe vollständig kostenlos.
Heute gibt es keinen solchen Knopf. Die MWST-Seite ist geklärt: echte Spenden sind
Nicht-Entgelt (MWSTG Art. 18 Abs. 2 lit. d) und zählen nicht zur Umsatzgrenze.
Offen ist die Einkommensseite.

**G1. Schenkung oder Einkommen?**
Beiträge von Nutzenden, die die Weiterentwicklung eines Werkzeugs unterstützen, stehen
in Zusammenhang mit einer Tätigkeit der Empfängerin. Sind sie steuerfreie Schenkung
(DBG Art. 24 lit. a, dafür allenfalls kantonale Schenkungssteuer Basel-Stadt) oder
Einkommen aus selbständiger Erwerbstätigkeit (DBG Art. 18)? Beides zugleich geht nicht.
Ändert es etwas, ob der Knopf in der App, auf einer separaten Seite oder nur im
Repository steht — oder ob Unterstützende namentlich genannt werden (MWSTG Art. 3
lit. i erlaubt die Nennung «in neutraler Form»)?
→ *Was hängt daran:* welche Steuer überhaupt anfällt — und ob die Formulierung auf
der Seite daran etwas ändern kann oder nur die Tätigkeit selbst.

**G2. Ab wann gilt Maloja Plana als selbständige Erwerbstätigkeit?**
Heute kostenlos, ohne Einnahmen. Mit Beiträgen, später allenfalls Bezahlversion,
White-Label und Dual Licensing (B3, F). Stebler Studios ist dieselbe natürliche
Person — macht der Name einen Unterschied, oder nur die Tätigkeit?
→ *Was hängt daran:* ob die Struktur (Einzelfirma, GmbH, Verein) **vor** dem
Unterstützen-Knopf festgelegt werden muss.

**G3. AHV auf den Beiträgen.**
Falls Einkommen: Beitragspflicht als Selbständigerwerbende; für geringe
Nebenerwerbseinkommen gilt AHVV Art. 19 (Beiträge nur auf Verlangen).
→ *Was hängt daran:* ob eine Anmeldung bei der Ausgleichskasse nötig wird, und ab
welchem Betrag.

**G4. Was kippt die Einordnung?**
Unsere Annahme: Jede Gegenleistung — Abzeichen, freigeschaltete Funktion,
«Supporter-Version» — macht aus dem Beitrag Entgelt und löst die Folgen der
Bezahlversion aus (F1, F2, F2a; OR Art. 99 Abs. 2 aus A1 fiele weg). Stimmt die
Grenze, und zählt schon ein öffentlicher Dank in der App als Gegenleistung?
→ *Was hängt daran:* die Trennlinie, die ein Test im Code halten soll, wie beim
Affiliate-Verbot (B1).

*Technische Randbedingung, keine Rechtsfrage:* Ein eingebetteter Zahlungsknopf (TWINT,
Stripe u. ä.) bräche die CSP `connect-src 'self'` und das Versprechen «keine externen
Netzwerkaufrufe». Ohne Verbindung nach aussen ginge ein einfacher Link oder eine
QR-Rechnung als statisches Bild — die aber Name und Adresse der Empfängerin im
öffentlichen Repository zeigt.

---

## Unterlagen, die bereitliegen

| Dokument | Inhalt |
|---|---|
| `docs/security/compliance-overview.md` | Einordnung aller Regime, mit Belegen und Stolperdrähten |
| `docs/legal/impressum.md` | Impressum, Haftungsausschluss, Gerichtsstand |
| `docs/legal/nutzungsbedingungen.md` | Nutzungsbedingungen |
| `docs/legal/datenschutzerklaerung-ndsg.md` | Datenschutzerklärung |
| `docs/legal/bearbeitungsverzeichnis-ndsg.md` | Bearbeitungsverzeichnis |
| `docs/legal/dsfa-kurzfassung.md` | DSFA-Kurzfassung |
| `docs/legal/non-legal-advice-boundary.md` | Abgrenzung zur Rechtsberatung, mit Fundstellen |
| `docs/legal/trademark-notice.md` | Markenhinweis + Registerrecherche |
| `docs/product/privacy-security-position.md` | Was die App wirklich macht und was nicht |

---

## Reihenfolge, wenn die Zeit knapp ist

1. **A1–A3** (Haftung) — betrifft jede Nutzung, heute schon
2. **B1** (Affiliate) — blockiert den Oktober-Entscheid
3. **F3/F5/F6** (EU ja/nein) — **eine** Frage mit drei Rechtsfolgen: Barrierefreiheit,
   Produkthaftung für Software, Cyber Resilience Act. Wird der Verkauf auf die Schweiz
   beschränkt, fallen alle drei weg. Das ist der grösste Hebel auf dieser Liste
4. **F1** (Bestellstrecke) — Bauarbeit mit Vorlauf
4. **D1** (SKOS) — betrifft ein gebautes Kernstück
5. **C1–C3** (Datenschutz) — Position ist dokumentiert, Risiko wirkt klein
6. **E1** (Marke) — wichtig, aber nicht dringend

**G1–G2** (Unterstützungsbeiträge) rücken nach vorn, sobald ein Unterstützen-Knopf
gebaut werden soll — sie sind die Bedingung dafür, nicht eine Folge davon.
