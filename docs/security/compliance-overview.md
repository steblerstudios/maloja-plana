# Compliance-Übersicht — Maloja Plana

> **Stand: 23.09.2026**, Code-Stand `main` `2f15946`. Nicht juristisch geprüft — die
> juristische Durchsicht ist Bau-Liste **K48** (Oktober).
> *Erweitert am 23.09.2026:* Bis dahin deckte dieses Dokument nur nDSG, ISO 27001 und
> WCAG ab. Aufsichtsrecht (FINMA/FIDLEG/VAG), UWG, OR, URG, Medizinprodukterecht,
> Barrierefreiheitsrecht, Preis-/MWST-Recht, KI-Recht und Markenrecht fehlten ganz.
> Nichts aus der alten Fassung wurde entfernt.

---

## 0. Der Satz, an dem alles hängt

**Maloja Plana ist ein Orientierungs- und Ordnungswerkzeug, das auf dem Gerät der
nutzenden Person läuft. Es hält kein fremdes Geld, vermittelt keinen Vertrag,
empfiehlt kein Produkt und entscheidet nichts.**

Solange dieser Satz stimmt, spricht alles dafür, dass Maloja Plana in keinem
bewilligungs- oder registerpflichtigen Bereich liegt — **juristisch bestätigt ist das
nicht** (K48). Jeder Abschnitt unten prüft einen Teil davon. Wo ein Teil kippen
könnte, steht ein **Stolperdraht**.

Festgehalten im Code, in zwei Dateien:

- `src/__tests__/regulierungsgrenzen.test.js` — 21 Prüfungen, davon **vier
  Gegenproben**. (Hier stand «20 Prüfungen, jede mit Gegenprobe»; das war zu grosszügig
  gezählt, Befund der Rechts-Prüfung 23.09.2026.)
- `src/__tests__/hinweisImBild.test.js` — rendert **alle 15 gerechneten Ansichten** mit
  den echten Texten und prüft, dass die Aussage «Orientierung / unverbindlich / keine
  rechtsverbindliche Auskunft» im Bild steht. Mit Mutationsprobe belegt: Hinweis
  entfernt → rot, zurückgebaut → grün.

---

## 1. Aufsichtsrecht — braucht Maloja eine Bewilligung oder einen Registereintrag?

**Nein.** Und «FINMA-konform» ist keine Eigenschaft, die man haben kann: die FINMA
zertifiziert keine Anwendungen. Es gibt nur die Frage, ob eine Bewilligung oder ein
Registereintrag nötig ist.

| Erlass | Gilt? | Warum | Beleg | Stolperdraht |
|---|---|---|---|---|
| **BankG** (Banken) | Nein | Keine Entgegennahme von Publikumseinlagen, kein Konto, kein Zahlungsverkehr | Kein Backend, kein Login (`docs/product/privacy-security-position.md`) | — |
| **FINIG** (Vermögensverwalter, Trustees) | Nein | Kein fremdes Vermögen wird verwaltet | — | — |
| **KAG** (kollektive Kapitalanlagen) | Nein | Kein Fonds, kein Vertrieb | — | — |
| **GwG** (Geldwäscherei) | Nein | Keine Finanzintermediation, kein Geldfluss über Maloja | — | — |
| **FIDLEG** (Finanzdienstleistungen) | Nein | Keine persönliche Empfehlung zu **Finanzinstrumenten**. `Saeule3aTracker.jsx` und `VorsorgeRechner.jsx` erfassen und rechnen, sie empfehlen kein Produkt. 3a- und Freizügigkeitskonten sind keine Finanzinstrumente: **FIDLEG Art. 3 lit. a** erfasst unter Ziff. 6 nur Einlagen mit **risiko- oder kursabhängigem** Rückzahlungswert (Fedlex, geprüft 23.09.2026) | `src/Saeule3aTracker.jsx`, `src/VorsorgeRechner.jsx` — kein Produktname, keine Empfehlung | **Sobald ein 3a-**Fonds** oder ETF empfohlen wird**, ist das Anlageberatung: Kundenberater-Register, Ombudsstellen-Anschluss, Verhaltensregeln |
| **VAG Art. 41** (Versicherungsvermittlung) | Nein | Kein Vertrag wird vermittelt, keine Provision von einem Versicherer. Die Wechselpfade führen auf **amtliche** Vergleiche, nicht auf Anbieter | `src/KVGWechsel.jsx`, `src/ZusatzWechsel.jsx`; Test C: kein Versicherername in den Wechseltexten (5 Sprachen) | **Sobald Versicherungsverträge angeboten oder vermittelt werden** (Art. 40 Abs. 1) — der Geldfluss ist nicht der Auslöser, siehe unten |
| **KVG/KVAG + Branchenvereinbarung** | Nein | Dasselbe: keine Vermittlung in der Grundversicherung | wie oben | wie oben; in der Grundversicherung zusätzlich die Vorgaben der Branchenvereinbarung |

**Der Auslöser steht in VAG Art. 40, nicht im Geldfluss** (Fedlex, geprüft
23.09.2026). Abs. 1 im Wortlaut: «Versicherungsvermittlerinnen und -vermittler sind,
unabhängig von ihrer Bezeichnung, Personen, die im Interesse von
Versicherungsunternehmen oder anderen Personen Versicherungsverträge **anbieten oder
abschliessen**.»

> **Korrektur vom 23.09.2026:** Der Stolperdraht in der Tabelle oben lautete «sobald
> Geld von einem Versicherer fliesst». Das ist zugleich **zu eng und zu weit**.
> Zu eng, weil der Auslöser das *Anbieten* ist, nicht die Provision. Zu weit, weil
> wer im Interesse eines Versicherers handelt, **gebundener** Vermittler wird
> (Art. 40 Abs. 2/3) — und die Registrierungspflicht nach Art. 41 trifft nur die
> **ungebundenen**. Gebundene unterliegen stattdessen Art. 43 (Fähigkeiten), Art. 44
> (unzulässige Tätigkeiten) und **Art. 45 (Informationspflicht)**. Die richtige Folge
> heisst darum: **Verhaltens- und Informationspflichten, allenfalls Registereintrag.**
> Welche Variante zutrifft, ist eine Rechtsfrage → K48 B1.

**VAG Art. 41 Abs. 1**: «Ungebundene Versicherungsvermittlerinnen und -vermittler
dürfen nur tätig werden, wenn sie im Register nach Artikel 42 eingetragen sind.»
Eingetragen wird, wer Sitz, Wohnsitz **oder eine Niederlassung** in der Schweiz hat,
guten Ruf geniesst, die Fähigkeiten nach Art. 43 nachweist und eine
Berufshaftpflichtversicherung abgeschlossen hat **oder gleichwertige finanzielle
Sicherheiten** vorweist. Diese Fassung ist seit dem **1. Januar 2024** in Kraft
(BG vom 18. März 2022, AS 2023 355).

### Der Affiliate-Entscheid ist der eine Hebel

Die Mechanik ist gebaut (`src/data/direktLinks.js`, Marker `legal.resources.affiliateMarker`,
transparenter Hinweistext in fünf Sprachen), der Entscheid steht auf Oktober
(`docs/BAULISTE-2026-09-30.md`, E4).

**Heute: 0 von 26 Herzensempfehlungen sind Affiliate** — keine ist ein Finanz- oder
Versicherungsanbieter (Test B).

> **Trennlinie für den Oktober-Entscheid:** Affiliate zu einem Saatgut-Shop oder einer
> Suchmaschine ist harmlos. Affiliate zu Krankenkassen, Versicherern, Banken,
> 3a-Anbietern oder Vergleichsportalen ist der Schritt in den regulierten Bereich —
> dort fängt VAG bzw. FIDLEG an.
>
> **Korrektur vom 23.09.2026:** Hier stand «Der Test lässt den zweiten Fall nicht
> durch». Das war falsch. Die erste Fassung suchte nach Wörtern wie «versicher» oder
> «bank» und liess **Raiffeisen, VIAC, frankly, neon, Yuh, Swiss Life, AXA, Helvetia
> und Selma** anstandslos durch — 9 von 10 nachgemessen. Seit dem 23.09. gilt eine
> **Erlaubnisliste**: ein bezahlter Eintrag braucht ein von Hand gesetztes Feld
> `branche` aus `BRANCHEN_ERLAUBT`. Eine Verbotsliste geht an jedem Namen vorbei, den
> sie nicht kennt; eine Erlaubnisliste kann das nicht.

---

## 2. Anwendbare Regulierungen — Überblick

| Regulierung | Status | Bemerkung |
|---|---|---|
| **nDSG** (Schweizer Datenschutzgesetz) | Konform, nicht juristisch geprüft | Datenschutzerklärung + Bearbeitungsverzeichnis vorhanden |
| **UWG** (Impressum, Werbeaussagen) | Konform | Impressum nach Art. 3 Abs. 1 lit. s; Werbeaussagen mit Test gesichert |
| **OR** (Nutzungsbedingungen, Haftung) | Vorhanden, Grenze beachten | Art. 100 OR: Haftung für grobe Fahrlässigkeit lässt sich nicht wegbedingen |
| **URG** (Quellen) | Aufmerksamkeit nötig | Gesetze sind frei — **SKOS-Richtlinien nicht** |
| **MepV** (Medizinprodukte) | Nicht anwendbar | Dosisangaben werden erfasst und wiedergegeben, aber nicht abgeleitet, berechnet oder bewertet |
| **BGFA** (Anwaltsmonopol) | Voraussichtlich nicht anwendbar, **kantonale Prüfung offen** | Rechtsberatung ist in der Schweiz frei; das Monopol betrifft die Parteivertretung vor Gericht. **Aber:** kantonales Recht kann die berufsmässige Vertretung regeln, für Betreibungssachen ausdrücklich **SchKG Art. 27** — und Maloja hat einen Schuldenteil und Briefvorlagen bis zur Betreibung. K48 A3 |
| **DSGVO/GDPR** | Nicht direkt anwendbar | Kein EU-Targeting, keine Datenverarbeitung in der EU |
| **BehiG / WCAG 2.1 AA** | Teilweise konform | Für Private kein gesetzlicher WCAG-Zwang; Produktanspruch trotzdem |
| **PBV / MWST** | Noch nicht anwendbar | Erst mit einer Bezahlversion |
| **KI-Recht (CH/EU)** | Nicht anwendbar | Kein automatisierter Einzelentscheid, kein EU-Markt |
| **UWG Art. 8** (missbräuchliche AGB) | Erst mit Bezahlversion | Der in der Praxis schärfere Hebel neben OR Art. 100 |
| **ZPO Art. 32/35** (Gerichtsstand) | Erst mit Bezahlversion | Gegenüber Konsument:innen ist die Klausel «Basel-Stadt» **nicht** vorab wirksam |
| **PrHG** (CH-Produktehaftung) | Offen | Ob reine Software erfasst ist, ist ungeklärt — K48 F5 |
| **KKG** (Konsumkredit) | Nicht berührt | Nachbarnorm zum Schuldenteil: sobald es Richtung Kredit oder Umschuldung geht, greift die kantonale Bewilligungspflicht (Art. 39) |
| **Kantonales Datenschutzrecht** (z. B. IDG BS) | Nicht anwendbar, aber vorgemerkt | Sobald eine **Gemeinde** die App einsetzt, gilt nicht das DSG, sondern kantonales Recht — andere Aufsicht, andere Meldewege |
| **Markenrecht** | Offen | Keine IGE-Eintragung |
| **ISO 27001:2022** | Dokumentation vorbereitet | Kein Audit durchgeführt |
| **eCH-0059** | Orientierung | Schweizer Accessibility-Standard |

---

## 3. nDSG-Compliance

Verarbeitet werden **besonders schützenswerte Personendaten**: DSG Art. 5 lit. c nennt
ausdrücklich «Daten über die Gesundheit» (Ziff. 2) und «Daten über Massnahmen der
sozialen Hilfe» (Ziff. 6) — beides Kernstoff dieser App (Fedlex, geprüft 23.09.2026).

### Vorfrage: Wer bearbeitet hier eigentlich?

> **Korrektur vom 23.09.2026:** Dieser Abschnitt begann mit «Das ist das eigentliche
> Regime von Maloja Plana». Das überdehnt das DSG in die eigene Richtung — derselbe
> Fehler wie eine zu starke Werbeaussage, nur umgekehrt.
>
> **DSG Art. 2 Abs. 2 lit. a**: «Es ist nicht anwendbar auf: a. Personendaten, die von
> einer natürlichen Person **ausschliesslich zum persönlichen Gebrauch** bearbeitet
> werden.» Solange die Daten das Gerät nie verlassen, bearbeitet die **nutzende
> Person ihre eigenen Daten zum persönlichen Gebrauch**. Stebler Studios ist dafür
> nicht Verantwortliche im Sinn von Art. 5 lit. j. Eine Verantwortlichkeit entsteht
> real erst beim **Hosting** (technische Daten beim Laden).
>
> Dass Verzeichnis (Art. 12) und DSFA (Art. 22) trotzdem geführt werden, ist gut und
> bleibt — aber es ist **Übererfüllung, nicht Pflichterfüllung**. Ob das so trägt, ist
> eine Rechtsfrage → K48 C1.

Dass die Daten das Gerät nicht verlassen, ist die tragende Schutzmassnahme, nicht ein
Nebeneffekt der Architektur.

| Anforderung | Artikel | Umsetzung | Dokument |
|---|---|---|---|
| Datenschutzerklärung | Art. 19 | Vorhanden | `docs/legal/datenschutzerklaerung-ndsg.md` |
| Bearbeitungsverzeichnis | Art. 12 | Vorhanden | `docs/legal/bearbeitungsverzeichnis-ndsg.md` |
| Datensicherheit | Art. 8 + DSV | AES-256 für verschlüsselte Sicherungen, CSP `connect-src 'self'`, Security Headers | `encryption.md`, `architecture.md`, `index.html` |
| Privacy by Design | Art. 7 | Local-First, keine Datenerhebung, keine Cookies, keine externen Aufrufe | Architektur-Entscheidung |
| Auskunftsrecht | Art. 25 | Nicht anwendbar (die Anbieterin hat keinen Zugriff auf die Daten) | — |
| Meldepflicht Datenverlust | Art. 24 | Nicht anwendbar (keine serverseitigen Daten) | `incident-response.md` |
| Automatisierte Einzelentscheidung | Art. 21 | Nicht anwendbar — Maloja entscheidet nichts, es zeigt Orientierung | Test A |
| DSFA | Art. 22 | Kurzfassung vorhanden | `docs/legal/dsfa-kurzfassung.md` |
| **Auftragsbearbeiter** | **Art. 9** | Genau eine reale Drittbearbeitung: der Hoster (Infomaniak, CH). Stand des Auftragsbearbeitungsvertrags → K48 C3 | — |
| **Strafbestimmungen** | **Art. 60/61** | Das nDSG sanktioniert die **natürliche Person**, nicht das Unternehmen — bei einem Einzelunternehmen trifft das die Inhaberin persönlich (Busse bis 250 000 Fr., u. a. für Verletzung der Informationspflicht nach Art. 19) | — |

**Gemessen am 23.09.2026** (`src/`, `index.html`):

- kein `document.cookie` — **keine Cookies**, damit auch keine Einwilligungsfrage nach FMG Art. 45c
- keine externen `fetch`-Aufrufe in `src/`
- CSP: `connect-src 'self'`
- Schriften lokal (`public/fonts/`, 32 `@font-face` in `src/tokens.css`) — **kein Google-Fonts-Abfluss**

**Der wunde Punkt ist nicht die Technik, sondern die Wahrheit der Aussage.** Eine
Datenschutzerklärung, die mehr verspricht als der Code hält, ist zugleich ein
DSG- und ein UWG-Problem. Darum: bei jeder Änderung an Speicherung, Export oder
Hosting **zuerst** `docs/product/privacy-security-position.md` nachführen.

### DSGVO

Massstab ist die **Ausrichtung** auf den EU-Markt, nicht die Erreichbarkeit. Maloja
richtet sich an Menschen in der Schweiz. Die fünf Sprachfassungen (inkl. Englisch)
sind Schweizer Landessprachen plus Verkehrssprache, kein EU-Targeting.

**Stolperdraht:** eine Veröffentlichung in EU-App-Stores oder Werbung in der EU
würde die Ausrichtungsfrage neu stellen — dann DSGVO **und** European Accessibility
Act (siehe 8.).

---

## 4. UWG

| Pflicht | Umsetzung |
|---|---|
| Impressum (Art. 3 Abs. 1 lit. s) | `docs/legal/impressum.md` + Tab «Impressum» in der App: Anbieterin, Ort, E-Mail |
| Bestellablauf (Art. 3 Abs. 1 lit. s Ziff. 2–4) | **Noch nicht anwendbar** — siehe unten |
| Keine irreführenden Angaben (Art. 3 Abs. 1 lit. b) | Absolute Privatheits-Werbung («100 % privat/lokal») ist seit 17.09.2026 untersagt und mit `src/__tests__/e43Werbeaussagen.test.js` in sieben Dateien gesichert |
| Transparenz bezahlter Empfehlungen | Affiliate-Marker + Hinweistext in fünf Sprachen, bevor der erste bezahlte Link existiert |
| **Missbräuchliche AGB (Art. 8)** | **Fehlte bis 23.09.2026 in diesem Dokument.** Unlauter handelt, wer AGB verwendet, die «in Treu und Glauben verletzender Weise zum Nachteil der Konsumentinnen und Konsumenten ein erhebliches und ungerechtfertigtes Missverhältnis» zwischen Rechten und Pflichten vorsehen. Mit einer Bezahlversion ist das der **in der Praxis schärfere Hebel neben OR Art. 100** — er trifft den Haftungsausschluss und die Gerichtsstandsklausel zugleich |

**Wortlaut geprüft (Fedlex, 23.09.2026):** Art. 3 Abs. 1 lit. s richtet sich an
Anbietende von «Waren, Werken oder Leistungen **im elektronischen
Geschäftsverkehr**» und verlangt vier Dinge: (1) klare und vollständige Angaben zu
Identität und Kontaktadresse inkl. E-Mail, (2) Hinweis auf die technischen Schritte
zum Vertragsschluss, (3) technische Mittel, um Eingabefehler vor der Bestellung zu
erkennen und zu korrigieren, (4) unverzügliche elektronische Bestellbestätigung.

> **Korrektur vom 23.09.2026:** Hier stand «Punkt 1 erfüllt, Punkte 2–4 noch nicht
> anwendbar». Das spaltet eine Norm, die als Ganzes an **eine** Bedingung hängt: das
> Anbieten im elektronischen Geschäftsverkehr. Gibt es keines, greift **auch Ziff. 1
> nicht** — und ausserhalb von lit. s kennt das Schweizer Recht keine allgemeine
> Impressumspflicht.
>
> Richtig ist: **lit. s greift heute mangels elektronischem Geschäftsverkehr nicht.
> Das Impressum halten wir trotzdem vor** — freiwillig, weil es zur Haltung gehört und
> weil es mit der Paywall ohnehin Pflicht wird. **Dann greift die Norm vollständig**,
> und die Ziffern 2–4 sind Bauarbeit an der Bestellstrecke, nicht Textarbeit.

---

## 5. OR — Nutzungsbedingungen und Haftung

`docs/legal/nutzungsbedingungen.md`, in der App unter «Nutzung».

**Grenze, im Wortlaut geprüft** (Fedlex, 23.09.2026): «Eine zum voraus getroffene
Verabredung, wonach die Haftung für rechtswidrige Absicht oder grobe Fahrlässigkeit
ausgeschlossen sein würde, ist nichtig» (OR Art. 100 Abs. 1). Ein pauschales «keine
Haftung» trägt also nur begrenzt: gegen Rechenungenauigkeiten im
Orientierungswerkzeug ja, gegen jede Nachlässigkeit nein.

**Und das Argument, das hier fehlte — es spricht für uns:** OR Art. 99 Abs. 2: «Das
Mass der Haftung richtet sich nach der besonderen Natur des Geschäftes und wird
insbesondere **milder** beurteilt, wenn das Geschäft für den Schuldner keinerlei
Vorteil bezweckt.» Für ein **kostenloses** Werkzeug ist das der stärkste Satz im
ganzen Haftungsteil. **Er fällt weg, sobald Geld fliesst** — noch ein Grund, den
Paywall-Entscheid nicht nur als Preisfrage zu behandeln.

**Die Vorfrage, die hier ganz fehlte:** Ohne Vertrag (Gratisnutzung) geht es gar nicht
um Vertragshaftung, sondern um **Art. 41 OR und Vertrauenshaftung** — und dort hilft
ein Haftungsausschluss in Nutzungsbedingungen nicht, weil ihn niemand vereinbart hat.
Das ist die eigentliche Frage an K48 A1, nicht die Formulierung des Ausschlusses.

**Gerichtsstand:** Impressum und App nennen Basel-Stadt. **ZPO Art. 35 Abs. 1 lit. a**
(Fedlex, geprüft): «Auf die Gerichtsstände nach den Artikeln 32–34 können **nicht zum
Voraus** oder durch Einlassung verzichten: a. die Konsumentin oder der Konsument.»
Art. 32 Abs. 1 lit. a gibt der Konsumentin das Gericht am Wohnsitz **einer** Partei.
Heute folgenlos, weil es keinen Vertrag gibt — **mit der Paywall eine unwirksame
Klausel**, und nach UWG Art. 8 zusätzlich angreifbar.

---

## 6. URG — Quellen

**URG Art. 5 im Wortlaut** (Fedlex, geprüft 23.09.2026): «Durch **das Urheberrecht**
nicht geschützt sind: a. Gesetze, Verordnungen, völkerrechtliche Verträge und andere
amtliche Erlasse; … c. Entscheidungen, Protokolle und Berichte von Behörden und
öffentlichen Verwaltungen.» **Abs. 2** ergänzt: «Ebenfalls nicht geschützt sind
amtliche oder gesetzlich geforderte Sammlungen **und Übersetzungen** der Werke nach
Absatz 1.» — für eine fünfsprachige App der nützlichste Teil der Norm: amtliche
Übersetzungen der Gesetzestexte sind frei verwendbar.

| Quelle | Geschützt? | Folge für Maloja |
|---|---|---|
| Gesetze, Verordnungen, Entscheide, amtliche Tarife (Art. 5 URG) | Nein — amtliche Werke | Frei nutzbar; Fedlex-Verweise erwünscht |
| Kantonale Handbücher, Merkblätter | Je nach Herausgeber | Zahlen übernehmen, Formulierungen nicht |
| **SKOS-Richtlinien** | **Vermutlich ja** — Werk eines privaten Vereins, kein amtlicher Erlass | **Beträge und Logik dürfen nachgebaut werden (Fakten sind frei), Wortlaut und Aufbau nicht** |

> **Offene Rechtsfrage für K48:** Mehrere Kantone erklären die SKOS-Richtlinien in
> ihrem Sozialhilferecht für verbindlich. Ob sie dadurch für diesen Kanton zum
> «amtlichen Erlass» im Sinn von Art. 5 lit. a werden, ist eine Auslegungsfrage —
> hier **nicht** entschieden. Die sichere Linie gilt unabhängig davon: Werte
> nachbauen, Wortlaut nicht übernehmen.

Heutiger Stand: `src/data/sozialhilfeRechner.js` nennt die Quelle (SKOS-RL Kapitel
C.3–C.6, D.3.1) und bildet **Werte** ab, keinen übernommenen Text. Das ist die
richtige Linie — sie muss beim nächsten SKOS-Update gehalten werden.

---

## 7. Medizinprodukterecht (MepV)

**Nicht anwendbar.** `MedicationManager.jsx`, `DiseaseManager.jsx` und
`ArztkofferView.jsx` **dokumentieren** — sie geben keine Dosierungsempfehlung, keine
Wechselwirkungsprüfung und keine Symptomauswertung.

> **Korrektur vom 23.09.2026:** Hier stand als Beleg «kein Treffer für
> Dosierung/Wechselwirkung/Interaktion». Diese Messung war wertlos — **der Code ist
> englisch.** `MedicationManager.jsx:21` legt `{ name, substance, dose, unit, frequency,
> notes }` an und rendert ein Dosis-Feld mit Einheiten (`mg`, `µg`, `g`, `ml`, `IE`,
> `Tropfen`, `Hübe`). Es gibt also sehr wohl **Dosierungsdaten**.
>
> Die tragfähige Aussage lautet: **Dosisangaben werden erfasst und wiedergegeben, aber
> nicht abgeleitet, berechnet oder bewertet.** Wer eine Zahl einträgt, bekommt sie
> zurück — die App sagt nicht, ob sie richtig ist. Das Ergebnis (kein Medizinprodukt)
> bleibt, die Begründung ist jetzt belegbar.

> **Stolperdraht:** Der Moment, in dem die App aus Eingaben eine medizinische
> Aussage ableitet («diese zwei Medikamente vertragen sich nicht»), macht sie zu
> Software als Medizinprodukt — mit Konformitätsbewertung und CE-Kennzeichnung.

---

## 8. Barrierefreiheit

- **BehiG** verpflichtet den Bund und verbietet Diskriminierung bei öffentlich
  zugänglichen Dienstleistungen — es schreibt Privaten **keine** WCAG-Konformität vor.
- **eCH-0059 / WCAG 2.1 AA** wären faktisch Pflicht, sobald die öffentliche Hand
  (Gemeinden, Sozialdienste) Kundin wird.
- Für diese Zielgruppe ist Barrierefreiheit ohnehin Produktanspruch, nicht Auflage:
  Atkinson Hyperlegible als Schrift, `docs/legal/accessibility-statement.md`, eigener
  Prüfer im Review.
- **EU European Accessibility Act** (Richtlinie (EU) 2019/882) — **am Text
  nachgelesen, 23.09.2026:** Sie gilt für Produkte, die **nach dem 28. Juni 2025** in
  Verkehr gebracht werden (Art. 2 Abs. 1), und für Dienstleistungen an Verbraucher,
  darunter ausdrücklich **«Dienstleistungen im elektronischen Geschäftsverkehr
  (E-Commerce)»** — mit Anforderungen an Barrierefreiheits-Informationen und an
  barrierefreie **Identifizierungs-, Sicherheits- und Zahlungsfunktionen** (Anhang I).

  > **Korrektur vom 23.09.2026:** Hier stand, mit einer Paywall greife der EAA. Das ist
  > zu streng. **Art. 4 Abs. 5** im Wortlaut: «**Kleinstunternehmen**, die
  > Dienstleistungen anbieten, sind von der Erfüllung der Barrierefreiheitsanforderungen
  > nach Absatz 3 dieses Artikels und von **allen Verpflichtungen** im Zusammenhang mit
  > der Erfüllung dieser Anforderungen **ausgenommen**.» Kleinstunternehmen ist in
  > Art. 3 Nr. 23 definiert: weniger als zehn Beschäftigte **und** höchstens 2 Mio. EUR
  > Jahresumsatz oder Bilanzsumme. Stebler Studios liegt klar darunter.
  >
  > Die EAA-Frage lautet für Maloja also nicht «verkaufen wir in die EU?», sondern
  > **«bleiben wir Kleinstunternehmen?»** — und die Barrierefreiheit bleibt, was sie
  > ohnehin war: Produktanspruch, nicht Auflage.

---

## 9. Preis, MWST, Abo — erst mit einer Bezahlversion

Noch nicht anwendbar (Paywall-Entscheid steht auf Oktober, `docs/BAULISTE-2026-09-30.md` E4).
Dann gilt:

- **UWG Art. 3 Abs. 1 lit. s Ziff. 2–4**: Bestellstrecke, Korrektur von Eingabefehlern,
  elektronische Bestellbestätigung — siehe Abschnitt 4
- **PBV**: Preise inkl. MWST, klar und vollständig angeschrieben
- **MWST**: Steuerpflicht ab CHF 100 000 Jahresumsatz
- **Abo**: kein allgemeines Widerrufsrecht im Schweizer Online-Handel, aber Laufzeit,
  Kündigung und Verlängerung müssen klar sein
- **App-Store-Vertrieb**: die Datenschutz-Angaben im Store müssen zum Code passen

---

## 10. KI-Recht

- **Schweiz — Stand bei der Bundeskanzlei nachgelesen, 23.09.2026:** «In der Schweiz
  besteht bisher noch keine übergreifende Gesetzgebung spezifisch zu KI.» Der
  Bundesrat hat am **12. Februar 2025** eine Auslegeordnung diskutiert; das Bundesamt
  für Justiz erarbeitet **bis Ende 2026** eine Vernehmlassungsvorlage, die die
  KI-Konvention des Europarats umsetzt — Schwerpunkte **Transparenz, Datenschutz,
  Nichtdiskriminierung, Aufsicht**. Das BAKOM erarbeitet parallel bis Ende 2026 einen
  Plan für nicht verbindliche Massnahmen (Branchenlösungen, Selbstverpflichtungen).
  → **Für Maloja heute keine Pflicht, aber ein absehbarer Rahmen.** Die vier
  Schwerpunkte sind genau die, an denen eine Local-First-App ohne automatisierten
  Entscheid gut dasteht.
- **EU AI Act:** nur bei EU-Markt. Dort wäre ein automatisiertes Scoring von
  Sozialleistungsansprüchen Hochrisiko (Anhang III).
- **Für Maloja:** ein guter Grund, bei Orientierung zu bleiben und nie einen
  Anspruch automatisch zu **entscheiden** — dieselbe Linie wie DSG Art. 21.

---

## 11. Markenrecht

Status: **nicht beim IGE eingetragen** (`docs/legal/trademark-notice.md`).

### Registerrecherche, 23.09.2026 (Swissreg, Suchwort «maloja»)

7 Treffer, davon **genau einer aktiv**:

| Marke | Nr. | Klassen | Status | Inhaberin |
|---|---|---|---|---|
| **maloja** | 1786104 (IR) | **18, 25, 35** | **Aktiv, eingetragen** | Maloja Clothing GmbH, Rimsting (DE) |
| MALOJA | 16746/2019 | 12, 39 | Gelöscht | SUEBI LTD |
| Maloja Bergrennen Maloja Hillclimb | 58947/2006 | 18, 20, 25, 28, 32 … | Gelöscht | Automobile Culture AG |
| maloja (fig.) | 526678 | 25, 28 | Gelöscht | Privatperson |
| Maloja-Bitter | 16297/2021 | 25, 33 | Gelöscht | Privatperson |

Zwei weitere Treffer («Segantini», «od open doors») hängen an Engadiner Adressen,
nicht am Namen.

**Ergebnis: In den Klassen 9 (Software) und 42 (SaaS) ist «maloja» in der Schweiz
frei.** Die aktive Marke deckt Leder/Taschen (18), Bekleidung (25) und Werbung/Handel
(35) — andere Waren und Dienstleistungen. «Maloja Plana» selbst ist nirgends
eingetragen.

### Was die Recherche **nicht** klärt

- **Ortsnamen-Frage:** «Maloja» ist ein Ort in Graubünden. Eine Marke kann als
  Herkunftsangabe oder als Gemeingut zurückgewiesen werden (MSchG Art. 2) — die
  Zusammensetzung «Maloja Plana» und der Schweizer Sitz helfen, aber das entscheidet
  das IGE, nicht diese Tabelle.
- Nicht eingetragene Kennzeichen, Firmennamen im Handelsregister und Domains sind
  nicht mitgesucht.
- Die Suche war ein Wortlaut-Treffer auf «maloja», keine Ähnlichkeitsrecherche.

Kosten der Anmeldung: ca. CHF 550 für drei Klassen, 10 Jahre Schutz.

---

## 11a. Weitere Regime — geprüft, heute nicht anwendbar

Nachgetragen am 23.09.2026, weil die Frage «und was noch?» eine Antwort verdient.

### Lizenz-Compliance (AGPL-3.0 und Abhängigkeiten) — **war lückenhaft, am 23.09. geschlossen**

> Dieser Abschnitt sagte zuerst «erfüllt, gemessen». Das war falsch, und die
> Rechts-Prüfung am selben Tag hat es aufgedeckt. Beide Lücken sind geschlossen; der
> Hergang bleibt stehen, weil er die Art des Fehlers zeigt: **gemessen war, welche
> Lizenzen gelten — nicht, ob wir ihre Auflagen erfüllen.**

| | Vorher | Jetzt |
|---|---|---|
| `three` (^0.186.0) im Verzeichnis | **fehlte** in `third-party-licenses.md` und in der In-App-Liste | aufgenommen, dazu die drei transitiven Pakete |
| Ausgelieferte Lizenztexte | **nur 2** (die vendorierten) | **8** — die sechs npm-Pakete kamen dazu |

Der Punkt ist nicht formal: **MIT verlangt, dass der Lizenztext mitgeliefert wird**
(«shall be included in all copies or substantial portions of the Software»), nicht
bloss, dass die Lizenz genannt wird. React, react-dom und three sind ins Bundle
kompiliert; ihre Texte fehlten in der Auslieferung.

| Gemessen 23.09.2026 | Ergebnis |
|---|---|
| Laufzeit-Abhängigkeiten (react, react-dom, three + transitiv) | 6 Pakete, alle MIT |
| Mitgelieferter Fremdcode | `src/vendor/qrcodejs.js` (MIT), `public/vendor/jsQR.js` (Apache-2.0) |
| Lizenztexte ausgeliefert | `public/licenses/`, 8 Dateien → im Build unter `/licenses/` |

MIT und Apache-2.0 sind mit AGPL-3.0 vereinbar. **Der AGPL-Netzwerkparagraf (§ 13)
verlangt, dass Nutzenden einer gehosteten Instanz der Quellcode angeboten wird** —
erfüllt, weil das Repository öffentlich ist. Bei einer White-Label-Instanz gilt das
für die Betreiberin genauso: das gehört in den Lizenzvertrag (K48 F7).

### Die drei EU-Regime, die an **einem** Entscheid hängen

Alle drei greifen erst, wenn Maloja in der EU **verkauft** wird. Der Paywall-Entscheid
im Oktober entscheidet damit über mehr als den Preis.

| Erlass | Was geprüft wurde (EUR-Lex, 23.09.2026) | Folge |
|---|---|---|
| **Produkthaftung**, RL (EU) 2024/2853 | **Art. 2 Abs. 1**: gilt für Produkte, die **nach dem 9. Dezember 2026** in Verkehr gebracht oder in Betrieb genommen werden. **Art. 2 Abs. 2**: «Diese Richtlinie gilt nicht für freie und quelloffene Software, die **ausserhalb einer Geschäftstätigkeit** entwickelt oder bereitgestellt wird.» Dass Software erfasst ist, sagt Erwägungsgrund 6; verbindlich ist die Definition in Art. 4 Nr. 1 | Von den dreien die schärfste, **wenn** sie greift — die FOSS-Tür hängt an derselben Schwelle wie beim CRA |
| **Barrierefreiheit (EAA)**, RL (EU) 2019/882 | Ab 28.6.2025; E-Commerce erfasst. **Aber Art. 4 Abs. 5**: «Kleinstunternehmen, die Dienstleistungen anbieten, sind von der Erfüllung der Barrierefreiheitsanforderungen … **ausgenommen**.» Kleinstunternehmen = < 10 Beschäftigte und ≤ 2 Mio. EUR Umsatz oder Bilanzsumme (Art. 3 Nr. 23) | **Greift für Stebler Studios voraussichtlich gar nicht** — siehe Abschnitt 8 |
| **Cyber Resilience Act**, VO (EU) 2024/2847 | Gilt ab **11.12.2027**; **Art. 14 (Meldepflicht) seit 11.9.2026**, Kapitel IV seit 11.6.2026 (Art. 71 Abs. 2); Art. 14 erfasst auch früher in Verkehr gebrachte Produkte (Art. 69 Abs. 3) | Die Vorfrage ist der Produktbegriff, nicht die Paywall — siehe unten |

> **Korrektur vom 23.09.2026 (Rechts-Prüfung).** Hier stand, die CRA-Ausnahme sei
> «wörtlich an die Monetarisierung geknüpft». Das war in zwei Punkten schief:
>
> 1. **Die Vorfrage ist der Produktbegriff.** Erwägungsgrund 12: «Dagegen fallen
>    Websites, die die Funktionalität eines Produkts mit digitalen Elementen nicht
>    unterstützen, oder Cloud-Dienste … **nicht in den Anwendungsbereich** dieser
>    Verordnung»; für SaaS gilt stattdessen die NIS-2-Richtlinie. Eine im Browser
>    ausgelieferte Web-Anwendung ist damit sehr wahrscheinlich ausserhalb —
>    **unabhängig vom Preis**. Der eigentliche Stolperdraht ist der **App Store**
>    (`ios/`, Capacitor): eine native App ist ein Produkt mit digitalen Elementen.
> 2. **Das Zitat «nicht zu Geld gemacht» stammt aus Erwägungsgrund 18**, nicht aus
>    einem Artikel. Es ist Auslegungshilfe, keine operative Ausnahme. Und **Art. 24**
>    legt «Verwaltern quelloffener Software» eigene Pflichten auf — ganz ohne
>    Monetarisierung.
>
> Was unverändert stimmt: die Daten aus Art. 71 Abs. 2 und Art. 69 Abs. 3.

### App-Store-Vertrieb

Das Repository enthält ein Capacitor-iOS-Projekt (`ios/`). Sobald eine App im Store
liegt, kommen Pflichten **neben** dem Gesetz dazu:

- **Apple App Review Guidelines** und die Datenschutz-Angaben im Store — sie müssen
  zum Code passen. Bei einer Local-First-App ist das leicht, aber es ist eine eigene
  Erklärung, die altert.
- **DSA**: bei Vertrieb in EU-Stores sind Händlerangaben zu hinterlegen.
- Altersfreigabe, Support-Adresse, Datenschutz-URL.

→ Heute nicht anwendbar: die App wird als Web-Anwendung ausgeliefert, nicht über einen
Store.

### Öffentliche Beschaffung

Falls Gemeinden oder Sozialdienste Kundinnen werden, gelten je nach Auftragswert
**BöB/IVöB** — und dann werden Barrierefreiheit (eCH-0059, WCAG) und
Datenschutzauflagen **Vertragsbedingung**, nicht mehr Produktanspruch. Abschnitt 8.

**Und mehr als eine Vertragsbedingung:** Sobald eine Gemeinde oder ein Sozialdienst
die App einsetzt, gilt für diese Bearbeitung **nicht das DSG, sondern das kantonale
Informations- und Datenschutzgesetz** (in Basel-Stadt das IDG). Andere
Rechtsgrundlage, andere Aufsichtsbehörde, andere Meldewege.

### Gesundheitsdaten-Infrastruktur (EPDG)

Maloja verwaltet Gesundheitsangaben lokal und ist **kein** elektronisches
Patientendossier. Eine Anbindung ans EPD wäre ein eigenes, zertifizierungspflichtiges
Vorhaben — die Grenze verläuft beim Austausch mit Gesundheitsfachpersonen.

### Nicht Produkt, sondern Betrieb

Handelsregister-Eintrag (Einzelunternehmen ab CHF 100 000 Umsatz), MWST-Anmeldung,
AHV-Status als Selbständige, Aufbewahrung der Geschäftsbücher (OR Art. 958f, 10
Jahre), Berufshaftpflicht. Gehört **nicht** in dieses Dokument — hier vermerkt, damit
die Lücke nicht für einen Befund gehalten wird.

---

## 12. Swiss Made Software / Digital Trust Label

### Swiss Made Software
- Entwicklung: Schweiz (Basel)
- Hosting: Infomaniak (Genf, CH) — Schweizer Provider, Rechenzentren in der Schweiz. *Ob das für das Label «qualifiziert», steht hier ohne Quelle; «Swiss Made Software» ist eine private, markenrechtlich geschützte Kennzeichnung mit eigenen Kriterien. **Bevor diese Aussage je in der App erscheint, muss sie belegt sein** — sonst ist sie UWG-relevant.*

### Digital Trust Label (Swiss Digital Initiative)

| Kriterium | Status |
|---|---|
| Sicherheit | Teilweise (CSP, Encryption, keine Server-Daten) |
| Datenschutz | Stark (local-first; nDSG-Konformität juristisch nicht geprüft, Bau-Liste K48) |
| Zuverlässigkeit | Beta-Phase, noch nicht produktionsreif |
| Faire Interaktion | Umgesetzt (keine Dark Patterns, transparente Rechner) |
| Kinderschutz | Nicht spezifisch adressiert |

---

## 13. ISO 27001:2022 — Dokumentationsstatus

| Annex-A-Control | Thema | Dokument | Status |
|---|---|---|---|
| A.5.1 | Informationssicherheitsrichtlinien | `architecture.md` | Vorhanden |
| A.5.12 | Klassifikation von Informationen | `data-classification.md` | Vorhanden |
| A.5.23 | Informationssicherheit in der Cloud | — | Nicht anwendbar (local-first) |
| A.5.31 | Gesetzliche Anforderungen | `compliance-overview.md` (dieses Dokument) | Vorhanden |
| A.6.1 | Screening | — | Einzelperson, nicht anwendbar |
| A.8.1 | User Endpoint Devices | `trust-boundaries.md` | Vorhanden |
| A.8.9 | Configuration Management | `CLAUDE.md`, `vite.config.js` | Vorhanden |
| A.8.12 | Data Leakage Prevention | `never-export-data.md`, `data-flow.md` | Vorhanden |
| A.8.13 | Backup | `backup-strategy.md` | Vorhanden |
| A.8.24 | Kryptographie | `encryption.md` | Vorhanden |
| A.8.25 | Secure Development | `CLAUDE.md`, CI/CD | Vorhanden |
| A.8.28 | Secure Coding | CSP, Input-Validierung, React XSS-Schutz | Implementiert |

---

## 14. Offene Punkte

| Punkt | Priorität | Aufwand |
|---|---|---|
| Juristische Durchsicht (K48) — **Fragenliste liegt bereit: `docs/legal/k48-fragen-juristin.md`** | **Hoch** | Externe Jurist:in, halber Tag |
| Markenanmeldung IGE — mit vorheriger Recherche zur Bekleidungsmarke | Hoch | CHF 550, 3–6 Monate |
| Entscheid Affiliate (Oktober): Trennlinie aus Abschnitt 1 halten | Hoch | Entscheid |
| Entscheid Paywall (Oktober) → dann PBV/MWST/Abo-Angaben | Mittel | Entscheid + Texte |
| Penetration Test | Mittel | Extern beauftragen |
| WCAG-Audit mit Screenreader | Mittel | 1–2 Tage |
| Professionelles Lektorat FR/IT/EN | Niedrig | Extern beauftragen |
| ISO 27001 Zertifizierung | Langfristig | Externer Auditor, CHF 5 000–15 000 |

---

## 15. Was **geprüft** ist und was nicht

### Am Gesetzestext gegengelesen, 23.09.2026 (Fedlex)

| Bestimmung | Was geprüft wurde |
|---|---|
| **DSG Art. 5 lit. c** (SR 235.1) | Gesundheit (Ziff. 2) und Massnahmen der sozialen Hilfe (Ziff. 6) sind ausdrücklich genannt |
| **DSG Art. 21** | Informationspflicht bei automatisierter Einzelentscheidung — greift nur bei Rechtsfolge oder erheblicher Beeinträchtigung |
| **URG Art. 5** (SR 231.1) | Wortlaut der nicht geschützten Werke, lit. a und lit. c |
| **OR Art. 100 Abs. 1** (SR 220) | Wegbedingung für Absicht/grobe Fahrlässigkeit ist nichtig |
| **UWG Art. 3 Abs. 1 lit. s** (SR 241) | Alle vier Ziffern; gilt für Angebote «im elektronischen Geschäftsverkehr» |
| **VAG Art. 40/41** (SR 961.01) | Definition der Vermittlung, Registrierungspflicht, Voraussetzungen, Inkraftsetzung 1.1.2024 |
| **DSG Art. 2 Abs. 2 lit. a** | Ausnahme für den ausschliesslich persönlichen Gebrauch |
| **ZPO Art. 32/35** (SR 272) | Konsumentengerichtsstand, Verzichtsverbot zum Voraus |
| **OR Art. 99 Abs. 2** | Mildere Haftung, wenn das Geschäft keinen Vorteil bezweckt |
| **FIDLEG Art. 3 lit. a** | 3a-/Freizügigkeitskonten sind keine Finanzinstrumente |

### An der Quelle nachgelesen, 23.09.2026

| Quelle | Ergebnis |
|---|---|
| **Swissreg** (IGE), Suchwort «maloja» | 7 Treffer, 1 aktiv (Klassen 18/25/35) — Abschnitt 11 |
| **Bundeskanzlei**, Seite «Regulierung» (KI) | Keine KI-Gesetzgebung; Vernehmlassungsvorlage des BJ bis Ende 2026 — Abschnitt 10 |
| **EUR-Lex**, RL (EU) 2019/882 (EAA) | Geltung ab 28.6.2025; E-Commerce erfasst; **Art. 4 Abs. 5 Kleinstunternehmen-Ausnahme** — Abschnitt 8 |
| **EUR-Lex**, RL (EU) 2024/2853 (Produkthaftung) | Art. 2 Abs. 1 (9.12.2026) und Art. 2 Abs. 2 (FOSS ausserhalb einer Geschäftstätigkeit) — Abschnitt 11a |
| **EUR-Lex**, VO (EU) 2024/2847 (CRA) | Art. 71 Abs. 2, Art. 69 Abs. 3, Art. 24, Erwägungsgrund 12 — Abschnitt 11a |

*Bis zur Rechts-Prüfung am 23.09.2026 nannte diese Liste nur die EAA, während die
Tabelle in 11a für alle drei Erlasse «geprüft» behauptete. Die Zahlen stimmten — der
Beleg fehlte. Genau das soll dieser Abschnitt verhindern.*

### Was hier **nicht** belegt ist

- **Nichts davon ist juristisch geprüft.** Die Einordnungen stammen aus dem Code und
  aus den Gesetzestexten, nicht von einer Jurist:in (K48). Einen Artikel gelesen zu
  haben ist nicht dasselbe, wie seine Anwendung auf diesen Fall zu beurteilen.
- Der Stand zum **KI-Recht** ist eine Momentaufnahme vom 23.09.2026 — die
  Vernehmlassungsvorlage ist für Ende 2026 angekündigt und kann jederzeit erscheinen.
  Vor einem Entscheid neu nachsehen.
- Beim **EAA** ist der Text gelesen, nicht seine Umsetzung in den 27
  Mitgliedstaaten — welche nationalen Gesetze im Einzelfall gelten, ist offen.
- Ob die SKOS-Richtlinien in einem Kanton durch Verbindlicherklärung zum amtlichen
  Erlass werden — offene Auslegungsfrage, Abschnitt 6.
- Ob die Formulierungen der Haftungsausschlüsse tragen, ist eine Rechtsfrage, keine
  Code-Frage (siehe `docs/legal/non-legal-advice-boundary.md`).
- Die Tests in `src/__tests__/regulierungsgrenzen.test.js` sichern die **Zusagen**,
  nicht ihre Rechtsfolgen.
