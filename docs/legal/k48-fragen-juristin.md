# K48 — Fragen an die Jurist:in

> **Stand: 23.09.2026**, Code-Stand `main` `2f15946`.
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
  «Unverbindlich», «Keine rechtsverbindliche Auskunft») im gerenderten Bild.
- Alle 10 Lebenssituationen tragen in **allen fünf** Sprachen einen
  Keine-Beratung-Hinweis. Ein Test hält das fest.
- Es gibt **keinen** bezahlten Link (0 von 26 Empfehlungen), **keinen** Versicherer-
  und **keinen** Produktnamen als Empfehlung.
- Keine Dosierungs-, Wechselwirkungs- oder Symptomlogik in den Gesundheits-Ansichten.

---

## A · Haftung und Abgrenzung — die Kernfrage

**A1. Trägt der Haftungsausschluss bei einem Rechenfehler?**
Die Rechner nennen konkrete Beträge; jemand könnte danach handeln (z. B. kein
IPV-Gesuch stellen, weil die App «kein Anspruch» andeutet). OR Art. 100 Abs. 1 macht
die Wegbedingung für grobe Fahrlässigkeit nichtig.
→ *Was hängt daran:* ob die heutigen Formulierungen reichen oder ob es eine andere
Konstruktion braucht (z. B. Beträge nur als Spannen, oder ein aktiver Vorbehalt vor
dem Ergebnis).

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
Unterfragen: Genügt ein Link **ohne** Beratung? Macht es einen Unterschied, ob die
Provision **pro abgeschlossenem Vertrag** oder **pro Klick** fliesst? Zählt die
Aufnahme eines Versicherers in eine Empfehlungsliste schon als Vermittlung?
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

**F1. Bestellstrecke nach UWG Art. 3 Abs. 1 lit. s Ziff. 2–4.**
Der Wortlaut verlangt: Hinweis auf die technischen Schritte zum Vertragsschluss,
Mittel zur Erkennung und Korrektur von Eingabefehlern, unverzügliche elektronische
Bestätigung. Was heisst das konkret für eine App mit Abo?
→ *Was hängt daran:* **Bauarbeit**, die vor dem Verkaufsstart fertig sein muss.

**F2. Abo-Recht.** Laufzeit, Kündigung, automatische Verlängerung, Preisänderungen —
welche Vorgaben gelten, und was gehört in die AGB?

**F3. Verkauf an Personen in der EU — ausschliessen oder erfüllen?**
Bei EU-Verbrauchern kämen DSGVO **und** der European Accessibility Act dazu
(Richtlinie (EU) 2019/882, anwendbar seit 28.6.2025; E-Commerce-Dienstleistungen
sind erfasst, inkl. barrierefreier Identifizierungs-, Sicherheits- und
Zahlungsfunktionen).
→ *Was hängt daran:* ob der Kauf auf die Schweiz beschränkt wird — eine
Produktentscheidung mit Rechtsfolge, nicht umgekehrt.

**F4. MWST.** Steuerpflicht ab CHF 100 000; elektronische Dienstleistung — wo ist
der Ort der Leistung bei Kundschaft im Ausland?

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
3. **F1/F3** (Bestellstrecke, EU ja/nein) — sind Bauarbeit mit Vorlauf
4. **D1** (SKOS) — betrifft ein gebautes Kernstück
5. **C1–C3** (Datenschutz) — Position ist dokumentiert, Risiko wirkt klein
6. **E1** (Marke) — wichtig, aber nicht dringend
