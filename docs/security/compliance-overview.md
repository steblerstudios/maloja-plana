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

Solange dieser Satz stimmt, liegt Maloja Plana in keinem bewilligungs- oder
registerpflichtigen Bereich. Jeder Abschnitt unten prüft einen Teil davon. Wo ein
Teil kippen könnte, steht ein **Stolperdraht**.

Festgehalten im Code: `src/__tests__/regulierungsgrenzen.test.js` (20 Prüfungen,
jede mit Gegenprobe).

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
| **FIDLEG** (Finanzdienstleistungen) | Nein | Keine persönliche Empfehlung zu **Finanzinstrumenten**. `Saeule3aTracker.jsx` und `VorsorgeRechner.jsx` erfassen und rechnen, sie empfehlen kein Produkt. 3a-Konten und Freizügigkeitskonten sind keine Finanzinstrumente | `src/Saeule3aTracker.jsx`, `src/VorsorgeRechner.jsx` — kein Produktname, keine Empfehlung | **Sobald ein 3a-**Fonds** oder ETF empfohlen wird**, ist das Anlageberatung: Kundenberater-Register, Ombudsstellen-Anschluss, Verhaltensregeln |
| **VAG Art. 41** (Versicherungsvermittlung) | Nein | Kein Vertrag wird vermittelt, keine Provision von einem Versicherer. Die Wechselpfade führen auf **amtliche** Vergleiche, nicht auf Anbieter | `src/KVGWechsel.jsx`, `src/ZusatzWechsel.jsx`; Test C: kein Versicherername in den Wechseltexten (5 Sprachen) | **Sobald für einen abgeschlossenen Vertrag Geld von einem Versicherer fliesst** — auch als Affiliate-Provision |
| **KVG/KVAG + Branchenvereinbarung** | Nein | Dasselbe: keine Vermittlung in der Grundversicherung | wie oben | wie oben; in der Grundversicherung zusätzlich die Vorgaben der Branchenvereinbarung |

**VAG Art. 41 im Wortlaut** (Fedlex, geprüft 23.09.2026): «Ungebundene
Versicherungsvermittlerinnen und -vermittler dürfen nur tätig werden, wenn sie im
Register nach Artikel 42 eingetragen sind.» Eingetragen wird, wer Sitz oder Wohnsitz
in der Schweiz hat, guten Ruf geniesst, die Fähigkeiten nach Art. 43 nachweist **und
eine Berufshaftpflichtversicherung abgeschlossen hat**. Diese Fassung ist seit dem
**1. Januar 2024** in Kraft (BG vom 18. März 2022, AS 2023 355) — das Datum ist am
Gesetzestext geprüft, nicht erinnert.

### Der Affiliate-Entscheid ist der eine Hebel

Die Mechanik ist gebaut (`src/data/direktLinks.js`, Marker `legal.resources.affiliateMarker`,
transparenter Hinweistext in fünf Sprachen), der Entscheid steht auf Oktober
(`docs/BAULISTE-2026-09-30.md`, E4).

**Heute: 0 von 26 Herzensempfehlungen sind Affiliate** — keine ist ein Finanz- oder
Versicherungsanbieter (Test B).

> **Trennlinie für den Oktober-Entscheid:** Affiliate zu einem Saatgut-Shop oder einer
> Suchmaschine ist harmlos. Affiliate zu Krankenkassen, Versicherern, Banken,
> 3a-Anbietern oder Vergleichsportalen ist der Schritt in den regulierten Bereich —
> dort fängt VAG bzw. FIDLEG an. Der Test lässt den zweiten Fall nicht durch.

---

## 2. Anwendbare Regulierungen — Überblick

| Regulierung | Status | Bemerkung |
|---|---|---|
| **nDSG** (Schweizer Datenschutzgesetz) | Konform, nicht juristisch geprüft | Datenschutzerklärung + Bearbeitungsverzeichnis vorhanden |
| **UWG** (Impressum, Werbeaussagen) | Konform | Impressum nach Art. 3 Abs. 1 lit. s; Werbeaussagen mit Test gesichert |
| **OR** (Nutzungsbedingungen, Haftung) | Vorhanden, Grenze beachten | Art. 100 OR: Haftung für grobe Fahrlässigkeit lässt sich nicht wegbedingen |
| **URG** (Quellen) | Aufmerksamkeit nötig | Gesetze sind frei — **SKOS-Richtlinien nicht** |
| **MepV** (Medizinprodukte) | Nicht anwendbar | Reine Dokumentation, keine Dosierung, keine Auswertung |
| **BGFA** (Anwaltsmonopol) | Nicht anwendbar | Rechtsberatung ist in der Schweiz frei; das Monopol betrifft die Parteivertretung vor Gericht |
| **DSGVO/GDPR** | Nicht direkt anwendbar | Kein EU-Targeting, keine Datenverarbeitung in der EU |
| **BehiG / WCAG 2.1 AA** | Teilweise konform | Für Private kein gesetzlicher WCAG-Zwang; Produktanspruch trotzdem |
| **PBV / MWST** | Noch nicht anwendbar | Erst mit einer Bezahlversion |
| **KI-Recht (CH/EU)** | Nicht anwendbar | Kein automatisierter Einzelentscheid, kein EU-Markt |
| **Markenrecht** | Offen | Keine IGE-Eintragung |
| **ISO 27001:2022** | Dokumentation vorbereitet | Kein Audit durchgeführt |
| **eCH-0059** | Orientierung | Schweizer Accessibility-Standard |

---

## 3. nDSG-Compliance

Das ist das eigentliche Regime von Maloja Plana: verarbeitet werden **besonders
schützenswerte Personendaten**. DSG Art. 5 lit. c nennt ausdrücklich «Daten über die
Gesundheit» (Ziff. 2) und «Daten über Massnahmen der sozialen Hilfe» (Ziff. 6) —
beides Kernstoff dieser App (Fedlex, geprüft 23.09.2026). Dass diese Daten das Gerät
nicht verlassen, ist die tragende Schutzmassnahme, nicht ein Nebeneffekt der
Architektur.

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

**Wortlaut geprüft (Fedlex, 23.09.2026):** Art. 3 Abs. 1 lit. s richtet sich an
Anbietende von «Waren, Werken oder Leistungen **im elektronischen
Geschäftsverkehr**» und verlangt vier Dinge: (1) klare und vollständige Angaben zu
Identität und Kontaktadresse inkl. E-Mail, (2) Hinweis auf die technischen Schritte
zum Vertragsschluss, (3) technische Mittel, um Eingabefehler vor der Bestellung zu
erkennen und zu korrigieren, (4) unverzügliche elektronische Bestellbestätigung.

Heute erfüllt Maloja Punkt 1 — die Punkte 2–4 setzen einen Bestellvorgang voraus,
den es nicht gibt. **Mit der Paywall im Oktober werden sie Pflicht**, und zwar als
Bauarbeit, nicht als Textarbeit (Bestellstrecke, Korrekturmöglichkeit,
Bestätigungsmail).

---

## 5. OR — Nutzungsbedingungen und Haftung

`docs/legal/nutzungsbedingungen.md`, in der App unter «Nutzung».

**Grenze, im Wortlaut geprüft** (Fedlex, 23.09.2026): «Eine zum voraus getroffene
Verabredung, wonach die Haftung für rechtswidrige Absicht oder grobe Fahrlässigkeit
ausgeschlossen sein würde, ist nichtig» (OR Art. 100 Abs. 1). Ein pauschales «keine
Haftung» trägt also nur begrenzt: gegen Rechenungenauigkeiten im
Orientierungswerkzeug ja, gegen jede Nachlässigkeit nein. Frage an K48.

---

## 6. URG — Quellen

**URG Art. 5 im Wortlaut** (Fedlex, geprüft 23.09.2026): nicht geschützt sind
«Gesetze, Verordnungen, völkerrechtliche Verträge und andere amtliche Erlasse»
(lit. a) sowie «Entscheidungen, Protokolle und Berichte von Behörden und öffentlichen
Verwaltungen» (lit. c).

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

Gemessen 23.09.2026: kein Treffer für Dosierung/Wechselwirkung/Interaktion in den
beiden Verwaltungs-Ansichten.

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
  → Solange Maloja nichts an EU-Verbraucher verkauft, greift sie nicht. **Mit einer
  Paywall, die auch in der EU verkauft, greift sie** — und trifft dann genau die
  Bestellstrecke aus Abschnitt 4.

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

## 12. Swiss Made Software / Digital Trust Label

### Swiss Made Software
- Entwicklung: Schweiz (Basel)
- Hosting: Infomaniak (Genf, CH) — **qualifizierend** (Schweizer Provider, Rechenzentren in der Schweiz)

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
| **VAG Art. 41** (SR 961.01) | Registrierungspflicht, Voraussetzungen, Inkraftsetzung 1.1.2024 |

### An der Quelle nachgelesen, 23.09.2026

| Quelle | Ergebnis |
|---|---|
| **Swissreg** (IGE), Suchwort «maloja» | 7 Treffer, 1 aktiv (Klassen 18/25/35) — Abschnitt 11 |
| **Bundeskanzlei**, Seite «Regulierung» (KI) | Keine KI-Gesetzgebung; Vernehmlassungsvorlage des BJ bis Ende 2026 — Abschnitt 10 |
| **EUR-Lex**, Richtlinie (EU) 2019/882 | Geltung ab 28.6.2025; E-Commerce-Dienstleistungen erfasst — Abschnitt 8 |

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
