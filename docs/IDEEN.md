# Ideen & Vision — die Landkarte

Der *eine* Ort für alles, was Maloja schöner, lebendiger, unverwechselbarer macht.
Nicht was kaputt ist (`BUGS.md`), nicht die technische Arbeitsliste (`docs/TODO.md`) —
sondern die **Seele**: Metaphern, Atmosphäre, grosse Ideen, offene Entscheide.

**Status:** 🌱 Vision (noch nicht gebaut) · 🔨 teilweise gebaut · ⏸ bewusst geparkt · ✅ gebaut · ❓ Design-Entscheid (gemeinsam)

**Wie wir das nutzen:** ein Thema zur Zeit, **Design zuerst, gemeinsam** (oft per Mockup),
schritt für schritt. Nichts wird ohne dein Ja gebaut. Vollständig durchgegangen 2026-07-08
(alle ~30 Braindumps + docs); Detail-Kontext je Idee in den Memory-Notizen.

**Einziger Ort für Visionen (zusammengeführt 2026-09-24).** Bis dahin lagen Visionen an sechs
Stellen: hier, in `design/grundstueck-und-modi.md`, `roadmap/master-roadmap.md`,
`context/VISION.md`, im Masterplan ausserhalb des Repos und in rund acht Gedächtnis-Notizen.
Was nur im Gedächtnis stand, ist jetzt unten eingetragen und mit *⟨Eingang 19.07.⟩* o. ä.
markiert. Beim Zusammenführen wurde **nichts gestrichen und nichts neu bewertet** — sortiert
wird in einem eigenen Schritt.

> **Regel ab jetzt:** Eine neue Vision kommt **hierher**. Andere Dateien dürfen sie
> ausführen (Detailblatt), aber nicht zum zweiten Mal aufzählen. Die Detailblätter:
>
> | Blatt | Wofür |
> |---|---|
> | [`design/grundstueck-und-modi.md`](design/grundstueck-und-modi.md) | Kanon für Grundstück, zwei Modi, Momentum, Baracke → Villa (§2) |
> | [`design/ipv-lebenslinie.md`](design/ipv-lebenslinie.md) | das Lebenslinien-Muster |
> | [`design/haushalt-teilen-berechtigung.md`](design/haushalt-teilen-berechtigung.md) | Haushalt, Teilen, Nachlass-Zugang (§11) |
> | [`design/design-backlog.md`](design/design-backlog.md) | Design-Politur (keine Visionen, sondern Feinschliff) |
> | [`i18n-sprachausbau.md`](i18n-sprachausbau.md) | Sprachen für das Asylwesen (§11) |
>
> `roadmap/master-roadmap.md` ist seit 22.06. die **Historie** der Phasen, keine Planung mehr.
> Was gerade gebaut wird, steht in `BAULISTE-2026-09-30.md`.

---

## Horizonte — was wann dran ist (Stand 24.09.2026)

*Schritt 2 der Runde vom 24.09. Diese Tabelle ist der **einzige Ort für Zeitpunkte**; die
Abschnitte unten beschreiben die Ideen, sie datieren sie nicht. Ein Horizont ist ein
Vorschlag von Claude, kein Beschluss — geändert wird er hier, durch Stebler Studios.*

**Wie sortiert wurde:**
- **Oktober** — klein, ohne offenen Entscheid, verträglich mit «lokal gespeichert» und
  baut auf Vorhandenem auf. Der Oktober ist schon teils belegt (Oktober-Paket der Bauliste:
  Kantons-Nachfragen K30/K32, RM-Gegenlese K29, Umbauten O1–O7), darum bewusst wenig.
- **Winter** (Nov. bis Feb.) — mittelgross, oder es braucht erst einen Baustein aus dem
  Oktober (meist O3 «Ergebnis-Art als festes Feld» oder einen Entscheid). *O3 ist seit 25.09.
  gebaut (#345): Baustein plus 8 Rechner; die übrigen Rechner folgen Stück für Stück.*
- **Irgendwann** — hängt an einem Grundsatz-Entscheid (Gamification, Backend, Konten) oder
  an Menschen ausserhalb (Übersetzung, Partner).

### Oktober — entscheiden

| Entscheid | § | Warum jetzt |
|---|---|---|
| Kern: Ordner oder Ereignisse · zusammen mit der Kapitel-Architektur und der App-Struktur | §0, §6 | davon hängt ab, wie der ganze Winter gebaut wird |
| Gamification: House of Life gegenüber Grundstück-Blatt · dazu die **Berg-Bilder bei 20–100 %** auf dem Dashboard (§15) | §1, §2 | davon hängt die ganze Spalte «irgendwann/Welt» ab |
| UI/UX aus den Runden 3–5: **Löschen ohne Rückgängig** (15 Knöpfe) · **Ladehinweis** beim Nachladen — *vor Oktober ansehen* · ~~zwei Zurück-Knöpfe~~ ✅ Brotkrume (25.09.) | §15 | der Dokumenten-Tresor löscht endgültig — der einzige Weg zu Datenverlust ohne Netz |
| Baum oder Obstgarten · zwei Bäume verschmelzen | §2 | braucht nur ein Mockup, kein Bau |
| Sechs Meinungs-Entscheide (E4), vor allem Preis/Paywall | §11 | Preis bestimmt, was Maloja nach aussen verspricht |
| Bottom-Nav oder Hamburger | §6 | gehört zur Kapitel-Frage |
| Dashboard entschlacken: 11 Abschnitte, 4 «hier anfangen»-Blöcke → Einstiege, nächster Schritt, eigene Übersicht; **Suche sichtbar** statt im Werkzeug-Raster | §6 | zwei Aussenstimmen sagen dasselbe (Codex-Audit 24.09., Tester-Feedback 25.09. in #361) |
| Installationshinweis steht über dem Hero, vor dem Nutzen — später anbieten? | §10 | im Browser bestätigt; klein, aber ein Platz-Entscheid |
| Bildwelten neben dem Berg (Obstgarten, Gepäck, Reserve-Tank, Schutzschild): Sachbegriff voranstellen? | §1 | gehört zur Gamification-Frage oben |
| Silbentrennung in der Bergnavigation («Versiche-rung») — K18 war bewusst, die Nebenwirkung ist echt | §8 | nur ansehen und entscheiden |

*Herkunft der vier Dashboard-Zeilen oben:* eine UX-Durchsicht von Codex (24.09.2026), jeder
Befund am Code geprüft. Was ein **Fehler** war, ist gebaut und live (#344): IPV ohne Sackgassen
(Kanton, Geburtsdatum, PLZ/Ort und Prämie direkt im Rechner), «Vorname ergänzen» statt «Vorname»,
Kacheln ohne unbelegten Frankenbetrag. Hier stehen nur die **Entscheide**.

### Oktober — bauen (klein)

| Idee | § | hängt an |
|---|---|---|
| Speichern in kDrive / Proton Drive, **Weg A** (über «Teilen», mit Hinweis) | §14 | nichts; keine Verbindung nach aussen |
| Karten **Stufe 1**: Link «In OpenStreetMap öffnen» | §14 | Muster `ExternerLink` |
| Herzensempfehlungen: pflegewegweiser.ch und David-Rau-App prüfen und ergänzen (die übrigen 26 sind drin) | §9 | je Angebot prüfen, ob es noch besteht |
| Schwarz-Weiss-Modus: ist der vorhandene Graustufen-Schalter das Gewünschte? | §4 | nur ansehen und entscheiden |

*Korrektur 24.09. spätabends, am Code nachgesehen:* «Vor dem Wechsel prüfen» (KVG und
Zusatz, `checkIntro`) und «Das verlässt dein Gerät» (`ExportVorschau` in elf Ansichten) sind
**schon gebaut** — die Landkarte führte sie seit Juli als Idee. Ebenso **Fristen werden Termine**: die
Abläufe haben Frist-Knöpfe, die Erinnerungen anlegen, exportierbar als `.ics`; #342 rechnet sie
ab dem Ereignis statt ab heute, je mit Gesetzesartikel. Die Herzensempfehlungen stehen
als Buch in der Bibliothek (`direktLinks.js`, 26 Einträge inkl. artfuljana, Leihlager,
Abschiedsagentur, plaant).

### Oktober — vorbereiten, ohne Code

| Idee | § | hängt an |
|---|---|---|
| Kontraste im Dunkelmodus **messen** (Karten, Rahmen, Sekundärtext, Interaktionszustände) — das Audit hat nur geschätzt | §8 | `a11y-pruefer` |
| ✅ **Grauzonen sammeln** — erledigt 25.09.: [`GRAUZONEN.md`](GRAUZONEN.md), 19 Fälle (14 belegt, 5 teilweise); drei live falsche Sätze daraus behoben (#347), EO-Betreuung 14 → 98 Taggelder (#350) | §0 | Bau der Entscheidungsbäume im Winter |
| Übersetzer:innen / Partnerorganisation für Asyl-Sprachen suchen | §11 | Stebler Studios, Kontakt nach aussen |
| Fachaussagen vom 19.07. belegen (KK-Wechsel mit Schulden, Kündigungstermine, Rückforderungen) | §5 | Quellen; `swiss-precision-pruefer` |

### Winter

| Idee | § | hängt an |
|---|---|---|
| Generatoren fürs Lebensende (Vorsorgeauftrag, Testament, Bestattungsauftrag) | §5 | O3; Rechts-Prüfung vor jeder Vorlage |
| Weitere Generatoren: Einsprachen, IPV-Anträge, Kündigungen, Schweizer Briefformat | §5 | O3; Rechts-Prüfung |
| «Nächster Schritt» mit Warum · aus einem Befund wird eine Aufgabe | §5, Bauliste O7 | O3 + Vorgangs-Modell |
| Jedes Ereignis mit 13 Ebenen · Lebenszustände schalten Abläufe um | §0 | Kern-Entscheid (Oktober) |
| Grauzonen als Entscheidungsbäume | §0 | [`GRAUZONEN.md`](GRAUZONEN.md) (liegt vor) |
| Schnellchecks als Instrumente | §3 | Design-Mockup |
| Kapitel-Architektur umsetzen | §6 | Kern-Entscheid (Oktober) |
| Versicherungen: Ablauf melden, günstigere Wege · Pflichten sichtbar machen | §5 | Oktober-Belege |
| Budget: Ziele und Richtwerte · Haushalt genauer erfassen · Hausrat → Hauswert | §5 | Keine-Doppel-Eingabe-Audit |
| Zukunftsrechner-Reste · Kreditkarten · Säule 3b · «Lohnt sich ein Umzug?» | §5 | — |
| KK-Rechnung stimmt nicht · UVG-Brief · Führerschein · Stiftungen und Härtefonds | §5 | Generatoren-Muster |
| Berechtigungs-Landkarte je Kanton · Befreiungen · AHV-Beitragsjahre | §3 | Kantons-Belege (K30/K32) |
| Vergünstigungen weiterer Kantone · eigener Bereich für Beeinträchtigungen · Screening-Abgleich (Faden 3-II) | §3, §5 | je Quelle einzeln belegen |
| Keine-Doppel-Eingabe-Audit · Drei-Schritt-Standard · Robustheits-Checkliste · Quellen-Audit | §6, §7 | O1, O4 |
| Barrierefreiheit systematisch (WCAG 2.1 AA / eCH-0059) · Menschen, die kaum lesen | §8 | — |
| Skeuomorphe Metaphern je Bereich · Lebensbaum: Wuchs, Jahreszeiten, hängende Früchte | §1, §2 | Baum-Entscheid (Oktober); **nicht** an der Gamification |
| Beispiel-Modus mit Personas | §10 | Persona-Durchlauf |
| Steuer-Säule mit Vergleich (Barometer wie Miete/Lohn) | §15 | ESTV-Steuerbelastung belegen |
| Leistungs-Schnellcheck und Anspruchs-Landkarte zu **einer** Seite | §15 | Seiten-Entwurf |

### Irgendwann

| Idee | § | hängt an |
|---|---|---|
| House of Life · Grundstück-Modus · Baracke → Villa · Anschaffungs-Lebenslinien · Haus-Mapping | §1, §2 | **Gamification-Entscheid** |
| Atmosphäre: Leuchtturm, Stempel, seltene Überraschungen · Achievements | §4, §2 | Gamification-Entscheid |
| Backend, Sync, SwissID · Haushalt teilen · Zugang nach dem Tod | §11, §0 | Grundsatz local-first |
| kDrive/Proton direkt angebunden · SecureSafe · Karten Stufe 2/3 | §14 | Grundsatz local-first, neue DSFA |
| Asyl-Sprachen freischalten (Albanisch, Tigrinya, Arabisch) | §11 | Menschen, die übersetzen |
| Canton Rule Engine · Template Engine · Derived State | §6 | wächst aus den Winter-Umbauten |
| Petitionsgenerator · Mietvertrag-Generator | §5 | Generatoren-Muster, Rechts-Prüfung |
| Zertifizierungen · Markenschutz · Business-Modell · Marketing und Pilot | §11 | Preis-Entscheid; «Marketing nach fertig» |
| Freunde-Dörfer | §2 | bleibt geparkt |
| Handy-Gesten / Shake | §8 | erst präzisieren, was sie tun sollen |

---

## 0 · Der Kern — was Maloja eigentlich ist

- ⭐ **Kern-These** *⟨Brain-Dump 30.06.⟩*: «Nicht Budget. Nicht Dokumente. Nicht
  Versicherungen. Sondern: Was passiert im Leben eines Menschen — und was muss ich in der
  Schweiz dafür wissen oder erledigen?» Ausgeführt als Lebensmodell-Matrix in §6.
- 🔨 **Jedes Ereignis gleich gebaut (13 Ebenen)** — Lebensereignis → Auslöser → Folgen →
  Pflichten → Optionen → Dokumente → Versicherungen → Budget → Fristen → Bibliothek →
  Generatoren → Schnellchecks → verwandte Ereignisse. Heute tragen die Abläufe ein
  einfacheres Gerüst (`AblaufSchale`); die volle Uniform ist die nächste Stufe.
- 🌱 **Elf Lebenskapitel mit Unter-Ereignissen** — Geburt & Kindheit · Ausbildung · Arbeit ·
  Beziehung & Familie · Wohnen · Finanzen · Gesundheit · Mobilität · Ausland · Alter · Tod.
- 🔨 **Lebenszustände** (Ereignis *passiert*, Zustand *ist*): alleinstehend, Partnerschaft,
  Konkubinat, verheiratet, mit Kindern, in Ausbildung u. a. Als
  Onboarding-Chips gebaut (§10); dass ein Zustand viele Abläufe gleichzeitig umschaltet,
  fehlt noch.
- 🌱 **Grauzonen als Entscheidungsbäume** — «fast am wichtigsten». Nicht nur der Normalfall,
  sondern die Verzweigungen: arbeitslos → Taggeld? Sozialhilfe? EL? IV? Zwischenverdienst?
  · Krankheit → KTG? UVG? IV? · Trennung → Kinder? Mietvertrag? Unterhalt? Beispiel für eine
  Grauzone, die niemand erklärt: Wer mit 18 mit Unterstützung des Sozialamts ausziehen will,
  braucht eine «Indikation Wohnen» *⟨Eingang 19.07., Fachaussage noch ohne Quelle — vor
  jedem Bau bei der Stelle belegen⟩*. Leitfrage: «Ist jede Grauzone, in die jemand fallen
  kann, abgedeckt und aufgezeigt?»
- 🌱 **Nach dem Tod** *⟨Eingang 19.07.⟩* — wer das Konto übernehmen und aufräumen darf, und
  dass die berechtigte Person erfährt, *dass* und *ab wann* sie berechtigt ist. Hängt an §11
  (Haushalt, Nachlass-Zugang).
- ❓ **Widerspruch zum Masterplan** — der Masterplan (24.08.) sagt «ein digitaler
  Lebensordner für Dokumente, Budget, Versicherungen und Notfall», die Kern-These sagt
  ausdrücklich «nicht Dokumente». **Entscheid 24.09.2026: im Oktober klären, zusammen mit der
  Kapitel-Architektur (§6)** — im Grunde dieselbe Frage: was sieht man zuerst, worauf geht
  die Bauzeit? Hilfsbild aus dem Gespräch: *der Ordner ist das Haus, die Ereignisse sind das,
  was im Leben passiert.* Nach aussen heisst Maloja heute «Schweizer Lebensordner» (Titel,
  Suchmaschinen-Texte, strukturierte Daten in `index.html`).

---

## 1 · Die Skeuomorphismus-Welt (Metapher pro Bereich)

> Kern: nicht „Papier draufklatschen", sondern *jede Funktion bekommt die reale Metapher,
> die unser Gehirn damit verbindet* — eine sorgfältige Lebenswerkzeugkiste.

- 🌱 **House of Life / Swiss Life Estate** *⟨10.07. und Eingang 19.07.⟩* — die grösste Fassung
  dieser Welt: Maloja fühlt sich nicht wie Software an, sondern wie ein kleines Schweizer
  Anwesen, das man erkundet. «Man kommt nicht in eine App, man kommt nach Hause.» Orte statt
  Menüpunkte: **Bibliothek** = Dokumente (das zuletzt geöffnete Buch liegt aufgeschlagen) ·
  **Obstgarten** = Gesundheit · **Gewächshaus** = Finanzen (Rücklagen wachsen) · **Haus** =
  Wohnen (Briefkasten → Mietvertrag, Keller → Inventar, Estrich → Garantien, Werkstatt → DIY)
  · **Archiv** = Versicherungen · **Rathaus** = Behörden · **Lebensweg** = Lebensereignisse
  (Wanderweg Geburt → Nachlass) · **Kuhglocke** am Eingang = Erinnerungen · **Briefkasten** =
  offene Aufgaben. Einstieg als isometrische Karte des Anwesens. Das Anwesen verändert sich
  leise mit Jahreszeit und Lebensfortschritt. Ton: «Apple trifft Architekturmagazin» —
  Muji, Kinfolk, Monocle, japanische Gärten, Museumsausstellung, Monument Valley. **Grenze:**
  kein Cartoon, keine Fantasy. Technik später: räumliches Gehen per Scroll,
  `prefers-reduced-motion` zwingend.
- ❓ **Widerspruch Gamification** — House of Life (19.07.) sagt «keine Gamification»;
  `design/grundstueck-und-modi.md` (13.07.) hat Gamification bewusst **erlaubt**: Momentum im
  Kern, verspielte Welt als abschaltbare Haut, nie Wettbewerb. Beide Texte sind danach nie
  gegeneinander gelegt worden. **Entscheid 24.09.2026: im Oktober klären.** Bis dahin stehen
  beide Texte nebeneinander; beim Sortieren kommt alles Spielerische auf «irgendwann».

- 🔨 **Gesundheit = Leder-Arztkoffer** — Fächer-Ansicht existiert, aber ruhige Liste; der Koffer mit *Instrumenten* (Thermometer/Wochenblister/Karteikarten/Impfausweis/KVG/Notfall) fehlt.
- 🌱 **Dokumente = Aktenschrank** (Ordner/Mappen/Tabs) · **Budget = Thermobeleg** (Coop-Quittung, Monatsabschluss) · **Schulden = Betreibungs-/Verlustschein-Look** (Siegel/Stempel, kein CH-Kreuz).
- 🌱 **Wohnen = kleines Haus** (Zimmer = Themen) · **Miet-Angaben optisch wie ein Mietvertrag** · **Mobilität = Fahrzeugmappe** · **Familie = Fotoalbum** · **Behörden = Bundesordner** · **Arbeit = Bewerbungsmappe** · **Ideen = Notizbuch**.
- 🌱 **KVG-Katalog = Karteikartenbox** · **Bibliothek = Bücherregal** (✅ Direktlinks als Regal gebaut; Ausbau möglich).
- 🌱 **Lebenslauf-Generator skeuomorph darstellen** (CV-Inhalt existiert, Optik nicht).
- ✅ **EL-Icon** gebaut (Aufstockung, keine Almosen-Optik) — hängt an den EL-*Schwerpunkt*-Schritten. Session #38: Todesfall hatte EL nur als Nebensatz im breiten „Renten & Versicherungen melden"-Schritt → auf Wunsch von Stebler Studios **eigener Schritt „4 · Hinterbliebenenrente & EL prüfen" mit Icon** herausgelöst (wie Pensionierung#4/IV#3/Pflege#3), Erbschaft rückt auf #5. Glossar bleibt Text-only-Tooltip (kein Icon-Ort). Damit alle sinnvollen Ablauf-Plätze abgedeckt.
- 🌱 **Heirat = Icon mit zwei Ringen** · **Rückforderungsbeleg-Look** (b83c35f) gefällt optisch nicht → Redesign vor weiterer Status-UI.
- ⏸ **Konto = schlichtes Banking** · **Analysen = modern/Apple-Glas** — bewusst KEINE Metapher.

## 2 · Der Lebensbaum (Nordstern-Atmosphäre)

- 🌱 **Grundstück + zwei Modi** — Kanon in [`design/grundstueck-und-modi.md`](design/grundstueck-und-modi.md)
  (13.07.). Kurz: Berg = Kulisse, Grundstück (Haus + Obstgarten) = Besitz — geschachtelt,
  nicht verschmolzen. **Normal-Modus** immer vollständig, **Grundstück-Modus** opt-in, beide
  mit identischen Daten; der Schalter ändert die Haut, nie die Substanz.
- 🔨 **Momentum im Kern** — Fortschritt nur gegen sich selbst. Gebaut: Pro-Kapitel-Fortschritt
  und «Was ist jetzt dran?» mit Anti-Druck-Zeile (#75).
- 🌱 **Baracke → Villa, ohne Scham** — Aufbau statt Bewertung; nie «dein Leben sieht ärmlich
  aus» für Menschen mit Schulden oder in der Sozialhilfe.
- 🌱 **Anschaffungs-Lebenslinien (Auto/Garage)** — ein Auto erscheint erst, wenn man eins hat
  oder die Leistbarkeit vorgerechnet ist («bau dir erst die Garage»). Gleiches Muster für
  Velo, Töff, Führerausweis; Kosten als Tacho.
- 🌱 **Haus-Mapping, offene Zuordnungen** *⟨Eingang 19.07.⟩* — Eingangstür wird schöner, wenn
  die Passwörter aufgeräumt sind (mit Checkliste); Dach ähnlich; Fenster, Wände, Zimmer noch
  ohne Zuordnung; Versicherungen als Schilder mit ihrem Symbol (nur generische Symbole, keine
  Marken).
- ⏸ **Freunde-Dörfer / Code teilen** — Konflikt mit «nicht social» und local-first.
- 🌱 **Lebenslinien als durchgängiges Muster** *⟨Werkstatt 19.07.⟩* — alles hat einen Ablauf
  über die Zeit (wie die IPV-Lebenslinie), immer mit einer normalen Ansicht daneben.
  Offene Frage aus derselben Werkstatt: *was kommt in welchen Modus, und warum?*

- ❓ **Obstgarten statt/neben 1 Baum** — nie entschieden. Hybrid: Baum als Startbild, Obstgarten beim Zoomen.
- ❓ **Zwei Bäume verschmelzen** — heute Lebensbaum (Frucht=Bereich) + zweiter „Spiegel"-Baum (Werkzeuge). Idee: Werkzeuge wachsen am SELBEN Ast ihres Bereichs.
- 🌱 **Naturgetreuer Wuchs** — Fibonacci/Phyllotaxis, Boids/Murmuration-Mathematik, L-System, Äste verjüngt statt Striche; Knospen *an* Ästen.
- 🌱 **Jahreszeiten** (Knospe→Blüte→Frucht→Ruhe); **Früchte HÄNGEN** von Ästen statt zu sitzen; Schweizer Obst statt Feige.
- ✅ **Schnellcheck als Ast wachsen** — bei gedecktem Anspruch (IPV/Sozialhilfe/EL, ehrliche Engine) bekommt die Bereichs-Frucht am Dashboard-Baum einen ruhigen Ring (A), ihr Klick führt zum benannten Anspruch (B), und die Erinnerungsliste zeigt „Möglicherweise für dich" (C). Single-Source `data/anspruchSignale.js` (Session #38).
- ⏸ **Achievements ohne Gamification-Optik** — Schweizer Steine (Granit/Schiefer/Bergkristall), Gipfel; Badges heikel (Druck/Fairness). **Wilhelm-Tell-Apfel** geparkt (Empfehlung: beim Apfel bleiben, Bedrohungsbild meiden).

## 3 · Schnellchecks & versteckte Berechtigungen

- 🔨 **Schnellchecks als Instrumente** — heute IPV/Sozialhilfe/EL nüchtern; Vision: Tacho/Schutzschild/Tankanzeige/Kompass/Pulsmesser. ← *aktuell in Design-Phase*.
- ✅ **Alle Berechtigungen als Schnellcheck** — Anspruchs-Landkarte (`#/ansprueche`, 16 Einträge nach Auslöser Einkommen/Lebenslage/Ereignis) + geführter Anspruch-Check (`#/anspruchcheck`, 3 Schritte: Zahlen → Lagen → vereintes Ergebnis), max. crosslinked (Session #37).
- 🔨 **Versteckte Vergünstigungen** — KulturLegi/Reka + **kanton-aware Regionalangebote** gebaut (BS/BL Familienpass/Volkszahnklinik/VHS via `regionaleVerguenstigungen.js`, PLZ→Kanton); **GGG Wegweiser Basel** ergänzt + **Pro Senectute** (Senioren-Anker im Vorsorge-Rechner), URLs web-verifiziert (Session #38); offen: weitere Kantone kuratieren (je Quelle einzeln verifizieren, Haftung).
- 🌱 **Kanton-aware Berechtigungs-Landkarte mit Lücken-Kommunikation** — pro Kanton „was möglich ist UND was fehlt"; Lücken = Petitions-Material.
- 🌱 **Versteckte behördliche Befreiungen systematisch** — SERAFE↔EL, ÖV/Kultur-Vergünstigungen, Gerichts-/Verfahrenskosten, kant. Gebührenbefreiungen aufdecken.
- 🌱 **AHV-Beitragsjahre transparent** — Jugendjahre, was Studierende tun (Mindestbeitrag → Lücken vermeiden). Teils via IK-Auszug.
- 🔨 **SBB-Begleitabo** (SwissPass, auf jede bleibende Beeinträchtigung inkl. Autismus verbreitert — Session #36) · 🌱 **Behinderungs-/Beeinträchtigungs-Bereich** (fehlt als eigener Bereich).
- ✅ **IV / Beistand / Waisen — Themencluster** — IV (IvVerfahren) + Waisenrente (Todesfall/`halbwaise`) gebaut; **Beistandschaft/Erwachsenenschutz** als Glossar-Begriff + Vorsorgeauftrag-Wegweiser (KOKES) ergänzt (Session #37).

## 4 · Atmosphäre, Motion & Schweizer DNA (subtil, nie kitschig)

- 🌱 **Leuchtturm = Guide** (sendet Licht statt roter Warnung) · **Kompass = Entscheidungen** · **Wetterstation = Lebensstatus** (Himmel klart auf, je organisierter).
- 🌱 **Stempel als Feedback** (EINGEREICHT/AKZEPTIERT) · Lagerfeuer=Tagesabschluss · Alphütte=Safe Space · Füllfederhalter=Unterschrift.
- 🌱 **Seltene Überraschungen** — 1.-August-Feuerwerk, Weihnachtsschnee, Geburtstags-Wimpel, 100 %→Eule.
- 🌱 **Natur subtil (Apple-Niveau)** — Nebel/Schnee/Tiere; Materialien statt Edelweiss/Kühe; Landschafts-Easter-Eggs naturalisieren.
- 🌱 **Weitere Transitions** (à la Sackmesser-Klappen) — Motion-Vokabular Context/Drill/Continuity, Rule-of-Three; **Flat-Design auf Apple-Niveau mastern**.
- 🔨 **Schwarz-Weiss-Modus** *⟨Eingang 19.07.⟩* — nah am Dumbphone, gegen Bildschirmsucht.
  Eine Graustufen-Einstellung existiert (`settingsGroups.js`); ob sie das Gewünschte ist,
  nicht geprüft.
- **Design-Rückmeldungen vom 19.07.** (Politur, keine Vision — gehört in
  [`design/design-backlog.md`](design/design-backlog.md)): Dunkelmodus zu dunkel · Beige
  überzeugt nicht · «sieht stark nach AI aus» · Dashboard hektisch, «weniger ist mehr, nicht
  weg, nur an andere Orte» · Mond/Sonne statt Kreis für Hell/Dunkel · Footer oder unteres
  App-Menü · Früchte sollen hängen, nicht auf den Ästen sitzen. Seither ist viel Politur
  gelaufen (UI/UX-Runden 1–4); welche davon erledigt sind, ist nicht einzeln geprüft.
- **Tester-Feedback vom 25.09.2026** (eine Testerin, Dashboard). Stand je Punkt:
  - ✅ **Kapitel anklickbar**: vorher waren nur die Felder («Vorname») Knöpfe, nicht
    «Persönliche Basis». Heute ist jede Kapitelzeile ein Knopf (s. nächster Punkt).
    **→ Oktober:** ein Feld öffnet das Kapitel, springt aber nicht zum Feld (Tipp auf
    «PLZ» → Kapitel Wohnen, oben). Gewünscht: hinscrollen + Fokus ins Feld. Gilt ebenso
    für «Was ist jetzt dran? → … ergänzen». Kein bestehender Mechanismus, eigener Umbau.
  - ✅ **Werkzeuge: Lebensereignisse startet eingeklappt**, wie alle anderen Gruppen.
    Die Instrumente bleiben auf dem Dashboard (so gewünscht).
  - ✅/❓ **«Warum nicht *Willkommen bei Maloja Plana*?»**: Entscheid 25.09.: im Produkt
    heisst es **«Maloja Plana»**. Der Rundgang begrüsst jetzt so (5 Sprachen; Italienisch
    neu geschlechtsneutral «Le diamo / Ti diamo il benvenuto» statt «Benvenuto»).
    **→ Oktober:** ob auch über dem Claim auf dem Dashboard ein Gruss steht (Vorschlag:
    nur beim ersten Besuch, er kostet am Handy Platz über dem Berg).
  - ✅ **Fortschritt + Grundordnung sind eine Karte, von Anfang an sichtbar**: eine
    Zeile je Kapitel, aufklappbar, darin die Grundordnungs-Felder dieses Kapitels und
    «Öffnen». Der Abschnitt «Detaillierter Fortschritt» ist weg. Die Karte bleibt ein
    nachgeladenes Stück (1,9 kB gzip), das Hauptbundle wurde nicht grösser.
  - ❓ **Werkzeuge & Features nochmals anschauen**: Bestand + drei Gliederungen (A nach
    Lebensbereich · B nach Anlass · C wenig zeigen, eine Liste) in
    [`design/werkzeuge-gliederung-2026-09-25.md`](design/werkzeuge-gliederung-2026-09-25.md).
    Befund: Menü (18) und Dashboard (53) führen **zwei verschiedene Listen**, einig nur bei 8.
    **Entscheid 25.09.: alle drei in einem, im Rucksack** — «Mein Gepäck» (gibt es schon,
    alle 34 Lebensereignisse in 6 Gegenständen) wird die eine Werkzeug-Seite; Einstellungen,
    Export und Benachrichtigungen wandern in die Einstellungen. Offen: Gegenstand für Geld,
    Ort für Ablegen & Ordnen, die 5 Hervorhebungen (→ Oktober).

## 5 · Rechner & Abläufe (Feature-Ausbau)

- ✅ **AHV-Rechner-Ausbau** — Rest-Lebenserwartung F/M/divers, Frühpension, Weiterarbeiten, **Umwandlungssatz-Option** (PK-eigener Satz), **Alters-Kosten-Orientierung** (Pensionierung-Schritt 5 „Wenn später Pflege nötig wird": wer zahlt was + EL/Hilflosenentschädigung/Hilfsmittel + Pro Senectute), **Senioren-Anker** Pro Senectute im Vorsorge-Rechner (Session #38). Link-Bibliothek via „Offizielle Stelle & Antrag". Umwandlungssatz-Kür (falls gewünscht): weitere Kantone/Feinschliff.
- 🌱 **Zukunftsrechner-Reste** — AHV als Granit-Kapitalsäule (Säulen-Session, Alters-Gating), Drag-Handle mit Live-Tooltip + Snap 63/64/65/70, ~20k-Zinsknick als echtes Modell, 3a-Rollover/Drawdown.
- 🌱 **Kreditkarten-Ausbau** (Limit/Saldo/Schuld pro Karte — heute nur Ja/Nein) · **Säule 3b Ausbau**.
- 🌱 **Petitionsgenerator** (Menschen befähigen, selbst zu petitionieren; „max 10 % fürs KK") · **Mietvertrag-/Untermietvertrag-Generator**.
- 🌱 **Führerschein-Thema** (Erneuerung/Fristen, ärztliche Kontrolle ab 75, Ausweis im Tresor).
- 🌱 **Pflegeweiser / Entlöhnung berechnen** (Betreuungsgutschriften/Entlastung/Hilflosenentschädigung) — teils gebaut.
- 🌱 **„Lohnt sich ein Umzug?"-Check** (Steuerfuss + Miete + KK gemeindeübergreifend, würdevoll).
- 🌱 **Faden 3-II** — persönlicher Screening-Intervall-Abgleich (nur belegbar, mit Evidenzqualität).
- 🌱 **Ablauf „KK-Rechnung stimmt nicht"** (+ Beanstandungs-/Einsprache-Brief) · **„Gezahlt/offen"-Ablauf pro Arztrechnung**.
- 🌱 **UVG → Brief-Automatik** (Angestellte: Unfalldeckung abwählen) · **alle Prämien-Abläufe enden im Brief-Generator** (UVG/Franchise/Wechsel).
- 🌱 **Generatoren fürs Lebensende** *⟨Eingang 19.07.⟩* — Vorsorgeauftrag, Testament,
  Bestattungsauftrag; evtl. bei der Gemeinde hinterlegen (gemeinde- und kantonsabhängig).
  Stand im Code 24.09.: Vorsorgeauftrag als Wegweiser (KOKES) und im Dossier, Bestattung
  im Todesfall-Ablauf, Testament nur als Link — **einen Generator gibt es für keinen der drei.**
- 🌱 **Weitere Generatoren** *⟨Master-Roadmap 22.06.⟩* — Einsprachen (Sozialhilfe, KK,
  Steuern), IPV-Anträge (kantonal verschieden), Kündigungsschreiben mit OR-Fristen.
  Briefvorlagen im Schweizer Format (Empfänger rechts, Policen-/Rechnungsnummer);
  Vorlagen von Mieterverband und K-Tipp als Vorbild nachbauen, nicht abschreiben.
- 🔨 **Kalender** *⟨Eingang 19.07.⟩* — gebaut: Erinnerungen, Frist-Knöpfe in den Abläufen,
  `.ics`-Export mit Vorschau. Offen: Arzttermine mit «ist das gedeckt?».
- 🌱 **Aus einem Befund wird eine Aufgabe** *⟨Eingang 19.07.⟩* — z. B. «darf IPV beziehen» →
  Aufgabe mit Link. Berührt «Nächster Schritt» (Bauliste O7).
- 🌱 **Versicherungen: Ablauf melden, günstigere Wege zeigen** *⟨Eingang 19.07.⟩* — KK,
  Haftpflicht; Prämienvergleich mit «Wunsch-Kasse»; Franchise-Check; KK-Wechsel geht nur ohne
  offene Schulden bei der alten Kasse → im Ablauf sagen. *(Fachaussagen vom 19.07. — vor dem
  Bau je an der Quelle belegen.)*
- 🌱 **Budget: Ziele und Richtwerte** *⟨Eingang 19.07.⟩* — eigene Ziele, Abgleich mit
  Standardwerten, Haushalts-Empfehlungen je Posten mit Bund/WHO als Referenz.
- 🌱 **Haushalt genauer erfassen** *⟨Eingang 19.07.⟩* — weitere Erwachsene wie Kinder
  hinzufügen · Kinder mit Name, Geburtsdatum, Versicherungen, Alter automatisch · mehrere
  Internet-/Telefon-Verträge · Nebenerwerb · Konkubinat und Mehrpersonen-Haushalte ·
  Genossenschafts-Nebenkosten (monatlich + jährliche Abrechnung → Schätzung Folgejahr).
- 🌱 **Hausrat-Quittungen ergeben den Hauswert** *⟨Eingang 19.07.⟩*.
- 🌱 **Pflichten sichtbar machen** *⟨Eingang 19.07.⟩* — Rückzahlungspflicht der Sozialhilfe,
  Stellensuche-Pflicht beim RAV, Rückforderungsbelege fünf Jahre rückwirkend, kantonale
  Kündigungstermine. *(Belegen vor dem Bau.)*
- ✅ **Schulden-Abzahlmethode** — Schneeball und Lawine in `schuldenCalc.js`
  *(Wunsch vom 19.07., im Code gefunden am 24.09.)*.
- 🌱 **Stiftungs- & Härtefonds-Verzeichnisse ausbauen** (nicht nur Ausbildung) + Antrags-Generator.

## 6 · Architektur & Struktur (grosse Entscheide)

- ⭐ **Nordstern: alles ist ein Lebensereignis-Ablauf** — kein Rechner steht allein; Onboarding inklusive. (16 Abläufe ✅; *Nachtrag 25.09.2026:* 34, gezählt im Register `ABLAEUFE`.)
- ⭐ **Schweizer Lebensmodell-Matrix** — „Was passiert im Leben + was in CH tun?", 11 Kapitel Geburt→Tod + Grauzonen + Lebenszustände.
- ❓ **Kapitel-Architektur nach Lebens-Domäne** — Gesundheit als eigener Bereich; Arbeit+Vorsorge+Steuer zusammen statt „Versicherungen"-Sammeltopf. Grosser Design-Entscheid, eigene Session.
- 🌱 **Standard-3-Schritt-Ablauf für ALLE Orientierungsseiten** — (1) Übersicht+Eingaben → (2) Stand+Vergleich → (3) Änderungsarbeiten. App-weit angleichen + Quellen-Checks.
- 🌱 **„Keine Doppel-Eingabe"-Audit** (semantische Kontinuität: Name/Kanton/Haushalt/Einkommen einmal → überall) · **Lärm-Audit** (was schreit vs. flüstert) · **Flow-Health-Check** über die 43 Abläufe.
- ❓ **Bottom-Nav vs. Hamburger** (Daumen-Erreichbarkeit vs. „Ort"-Gefühl) · **Info-Buttons-Systematik** app-weit (inline expand/collapse).
- 🌱 **Exakte-Quellen-Audit-Agent** + periodischer Lauf — jede Behauptung ↔ präzise Fundstelle (rechtlich/Vertrauen, hohe Prio).
- 🌱 **Langfristige Bausteine** *⟨Master-Roadmap 22.06.⟩* — kantonale Regeln als deklaratives
  Schema (Canton Rule Engine) · abgeleitete Felder, einmal erfasst (Derived State) ·
  deterministische Dokumenterzeugung (Template Engine) · Export-Architektur PDF/JSON/CSV/DOCX/ZIP
  mit Manifest. Zurückgestellt: Runtime-Governance P1/P2, KI-Assistenz («deterministisch
  zuerst»).
- ⭐ **Crosslinks sind «die Magie von Maloja»** *⟨Eingang 19.07.⟩* — Kanton am Anfang gilt
  überall; Daten nie zweimal eingeben; Rechner übernehmen Eingaben. Siehe «Keine
  Doppel-Eingabe» oben.
- ❓ **App-Struktur prüfen** *⟨Eingang 19.07.⟩* — Persönliche Basis · Wohnen · Finanzen ·
  Versicherungen · Ausbildung · Behörden · Notfall (+ Lebensereignisse): stimmt das? Gehört
  zum Entscheid «Kapitel nach Lebens-Domäne» oben.
- 🌱 **Schnell und sparsam** *⟨Eingang 19.07.⟩* — kein Akku-Fresser, speicher- und
  energieeffizient.

## 7 · Copy, Ton & Psychologie

- ⭐ **Gender-neutral** wo möglich · **keine Emojis, nüchterner Ton** · **No AI Slop** (klingt wie ein Mensch).
- 🌱 **Robustheits-Checkliste app-weit** — Success/Empty/Error/Loading + Graceful Degradation auf JEDES Feature.
- 🌱 **Testperson A-Verständlichkeit** — „ohne Anleitung verstehen was zu tun ist"; Glossar für Abkürzungen (✅ teils).
- 🌱 **Kohlberg-Moralstufen** als Denkrahmen für würdevolle, nicht-bevormundende Ansprache.
- 🌱 **FR/IT/RM-Gegenlese** — RM ~263 Keys offen (Native-Task, `scripts/i18n-gap-scan.mjs`); tiefere FR/IT-CH-Grammatik-QA.

## 8 · Barrierefreiheit (Grundpfeiler)

- 🔨 **Ein Barrierefreiheits-Menü** — alle a11y-Optionen gebündelt (teils gebaut).
- 🔨 **Farbenblind-Modus** — sage/rosé = Rot-Grün-Falle → Blau/Orange + Form/Icon (teils gebaut; Rest = fokussierter Durchgang).
- 🌱 **WCAG 2.1 AA / eCH-0059** systematisch (grosse Buttons, Kontrast, Tastatur, Fokus, verständliche Fehler).
- ❓ **Handy-Gesten / Shake** — vage, vor dem Bau präzisieren (Shake→was? Kopieren?); Spannung zu Calm/Discoverability.
- ⭐ Merker: Versalien via CSS `text-transform`, nie literale Grossbuchstaben (Screenreader).
- 🌱 **Menschen, die nicht oder kaum lesen, mitdenken** *⟨Eingang 19.07.⟩* — Symbole,
  Vorlesen, kurze Sätze.

## 9 · Herzensempfehlungen (extern verlinkt, nicht integriert)

- 🌱 **Skribble / DocuSign** (E-Signatur — NICHT integrieren, nur empfehlen; Skribble = CH) · **Zollomat** (Zoll-/Einfuhr) · **EGK** (nachhaltige KK — Werte prüfen).
- 🔨 **Weitere Kandidaten** *⟨Eingang 19.07.⟩* — schon im Buch (Stand 24.09.): Leihlager ·
  Foodshiner (ohne Link, Zertifikat abgelaufen) · Abschiedsagentur · Ecosia · plaant ·
  **artfuljana** (bleibt drin, Stebler Studios 24.09.). Noch nicht drin: pflegewegweiser.ch
  (nur als Quelle in `PflegeEntloehnung.jsx`), David-Rau-App. Für Menschen mit IPV: KulturLegi/Caritas, Volkszahnklinik, Familienpass,
  Reka-Ferien, GGG, Volkshochschule (teils schon gebaut, §3). Vor der Aufnahme je prüfen, ob
  das Angebot noch besteht.
- 🌱 **Warme Inhalte bündeln** — Herzensempfehlungen + grün gehostet + Zertifikate als ein ruhiges Hamburger-„Blatt", Links aufs Wort.

## 10 · Onboarding & Beispiel-Modus

- ✅ **Bedürfnis-Onboarding** (Lebenszustände-Chips) + **Tour** (skipbar/verschiebbar).
- 🌱 **Beispiel-Modus mit Personas** — Szenarien (Familie/allein/neu zugezogen/Rentner) — als Nebenprodukt aus einem **Persona-QA-Durchlauf** ableiten, nicht separat erfinden.

## 11 · Strategie & Aussenwelt (eigene Gespräche)

- ⏸ **Backend / Konten / Sync / SwissID** — Grundsatzentscheid Local-First (eigene Session).
  *Stand 24.09.:* Ein Server-Skelett existiert im privaten Repo `maloja-server` (WebAuthn,
  Ende-zu-Ende-verschlüsseltes Backup, «Zero-Knowledge»), seit 08.07. unverändert auf `dev`;
  das Frontend ist nicht angebunden. Mögliche Auflösung: Sync als **Opt-in** über der lokalen
  Basis, der Server sieht nur Chiffrat. Keine Google-/Apple-Logins, SwissID später.
  Treiber wären Zugänge für Gemeinden und Beratungsstellen.
- ❓ **Sechs Meinungs-Entscheide vom 19.07.** — Dynamic Pricing/Paywall (wer über dem
  Medianlohn verdient, zahlt; Working Poor nicht) · Affiliate-Links · B-Corp/MyClimate ·
  KK-Schulden übernehmen ja/nein · Readdle als Empfehlung · PWA vs. native App (Empfehlung:
  PWA). Geführt als E4 in `BAULISTE-2026-09-30.md`, auf Oktober gelegt.
- 🔨 **Asylwesen, Stand 24.09.** — gebaut: Status N/S/F/B, Verfahren, Rechte und Fristen,
  kantonale Rechtsberatung für alle 26 Kantone, «Mein Status im Alltag», Crosslinks;
  Sprach-Auswahl skaliert, RTL vorbereitet. Offen: Übersetzungen (Albanisch, Tigrinya,
  Arabisch) **nur mit Menschen, keine Maschinenübersetzung**, dafür Partnerorganisationen
  finden. Plan: [`i18n-sprachausbau.md`](i18n-sprachausbau.md).
- ⏸ **Haushalt, Teilen & Berechtigung** — wie zwei (+ Kind) als Paar ihre Sachen aufteilen/bezahlen, wer welche Berechtigung/Zugriff hat, und der Nachlass-Zugang. Hängt an Login/Tresor → kommt zuletzt. Voller Faden: [`docs/design/haushalt-teilen-berechtigung.md`](design/haushalt-teilen-berechtigung.md), verlinkt mit der Tresor-Vertagung.
- ⭐ **Datenschutz-Haltung** — keine Daten verkaufen, kein Google/Apple-Login, SwissID ja, cookieless + aggregierte Stats.
- 🌱 **SEO** — hreflang, pro-Sprache-Landing, sitemap.xml, Google Search Console (der eigentliche Auffindbarkeits-Hebel) · **Subdomains** (app./mail./news.).
- 🌱 **Marketing** — mehrsprachige QR-Flyer, Pilot-Outreach (Caritas/HEKS/Gemeinde), Erklär-Seiten pro Thema.
- 🌱 **Asylwesen** + mehr Sprachen (Albanisch/Tigrinya) · **Business-Model-Gerüst** (Zielgruppe/Persona/USP/PoC).
- 🌱 **Zertifizierungen** (B Corp/Digital Trust) · **Markenschutz IGE** · **Business-Mail-Entscheid** (Infomaniak/Proton/IncaMail).

## 13 · Aus «Besser wechseln» (maloja-c-Prototyp, 2026-07-18)

> Quelle: `Ideen Kiste/maloja c/maloja-switch-journey-prototype/`. Der Prototyp selbst
> (Anbieter-Verzeichnis, signierte Bestätigung, verifizierter Nachweis) braucht ein
> Backend → bleibt Zielbild. Zwei Ideen sind aber **jetzt** in bestehende Flows holbar:

- ✅ **„Vor dem Wechsel prüfen"-Schritt** *(gebaut, festgestellt 24.09.)* in `KVGWechsel`/`ZusatzWechsel` — ruhiger
  Anti-Dark-Pattern-Zwischenschritt mit der Haltung *„tieferer Preis / mehr Leistung
  allein ist kein Wechselgrund"*. Kurze Prüfliste (laufende Behandlungen, Franchise-Jahr,
  Kündigungsfrist, Zusatz-Aufnahmevorbehalt). Bremst statt pusht.
- ✅ **Freigabe-/Export-Vorschau „Das verlässt dein Gerät: …"** vor Export-/Dossier-/
  Brief-Versand — zeigt datensparsam und konkret, welche Angaben rausgehen. Passt zur
  Trust-Layer; wiederverwendbar über alle Teilen-Momente.
- ⏸ Geparkt (Zielbild, Backend): zwei getrennte Balken *institutioneller Score* vs.
  *persönliche Passung* (neutrales Ranking sichtbar gemacht), signierter Nachweis
  „Maloja Schritt bestätigt" (ist **kein** Firmen-Gütesiegel).

## 12 · Design-Ressourcen & Tooling (Referenz)

- Icons: fonts.google.com/icons · icons.getbootstrap.com — Fonts: fontshare.com — Farben: coolors.co
- Inspiration: mobbin.com · awwwards.com · dribbble.com — Marken-`::selection`-Farbe setzen.
- Prinzipien: **Jakob's Law** (vertraute Muster nutzen) · Better UX → More A11y → Better SEO (ein Hebel, drei Gewinne).

## 14 · Speicherorte & offene Karten (Brain-Dump 17.09.2026)

**Stand: Idee, nichts gebaut — Oktober oder später.** Leitlinie von Stebler Studios: sich an
Open-Source-Bausteinen, offenen Schnittstellen und Plugins orientieren.

**Was schon gilt** (`docs/ux/feedback-rekonstruktion.md`): «Cloud niemals Pflicht», mögliche
Speicherorte Gerät · kDrive · WebDAV · externe Festplatte; «SecureSafe — nicht jetzt, später
optional, nur für Testament, Vorsorgeauftrag, Patientenverfügung, Passkopien». SecureSafe ist
heute nur verlinkt (Ressourcen), nicht angebunden.

- 🌱 **Dokumente in kDrive oder Proton Drive speichern.** Zwei Wege, sehr verschieden:
  - **A · über das Betriebssystem (empfohlen als erster Schritt):** Maloja erzeugt die Datei
    (verschlüsselte Sicherung, Dokument, Dossier) und übergibt sie an «Teilen» / «Sichern unter».
    Wer die kDrive- oder Proton-Drive-App hat, wählt sie dort als Ziel. Maloja spricht mit keinem
    Server; CSP (`connect-src 'self'`), Datenschutzerklärung und die Aussage «Maloja sendet keine
    Eingaben» bleiben wahr. Klein; ein ruhiger Hinweis «So speichern Sie in kDrive / Proton Drive».
  - **B · direkte Anbindung (Konto verbinden, automatisch ablegen):** braucht die Schnittstelle
    des Anbieters, eine Anmeldung, gespeicherte Zugangsschlüssel, eine CSP-Ausnahme für deren
    Adresse und eine neue Datenschutzerklärung (Datenfluss an Dritte, DSFA neu). Ob und wie kDrive
    (WebDAV?) und Proton Drive das aus dem Browser erlauben, ist **nicht geprüft** — vor jeder
    Planung an der Quelle belegen. Gross; widerspricht dem heutigen Versprechen und gehört zur
    Logins-Phase (E2).
- 🌱 **Tresor-Themen in SecureSafe.** Wie oben: zuerst Weg A (Datei + Hinweis, gezielt für die
  vier Dokumentarten). Eine direkte Anbindung setzt eine Schnittstelle voraus, deren Existenz
  **nicht geprüft** ist. Tresor-UI bleibt vertagt (E2).
- 🌱 **Karten mit offenen Daten statt Google Maps** (z. B. Beratungsstellen, Gemeindeverwaltung,
  Notfall-Standort). Drei Stufen:
  1. **Link** «In OpenStreetMap öffnen» / swisstopo — keine Verbindung, bis man tippt (Muster wie
     `ExternerLink`). Klein.
  2. **Eingebettete Karte mit fremden Kacheln** (Leaflet/MapLibre + OSM- oder swisstopo-Kacheln) —
     jede Kachel ist eine Verbindung zu Dritten (IP-Adresse), braucht CSP-Ausnahmen, Hinweis in der
     Datenschutzerklärung und die Nutzungsbedingungen des Kachel-Dienstes (die freien OSM-Server
     sind nicht für App-Last gedacht — vorher lesen).
  3. **Selbst gehostete Karte** (Schweiz als eine Kachel-Datei auf dem eigenen Hosting) — bleibt
     `'self'`, aber eine grosse Datei und mehr Pflege; Grösse und Aufwand vorher messen.
  Empfehlung: mit Stufe 1 beginnen; Stufe 3, wenn eine Karte wirklich gebraucht wird.
- ⭐ Merker: Jede Anbindung nach aussen ändert Aussagen, die heute live stehen («lokal gespeichert»,
  FAQ `a1`/`a3`, CSP). Solche Bausteine immer zusammen mit Rechts- und Sicherheits-Prüfer planen.

---

## 15 · UI/UX-Entscheide aus den Runden 3–5 (25.09.2026)

*Was in den Runden 3–5 (#332, #336, #341, #364) ein **Fehler** war, ist gebaut und live. Hier
stehen nur die **Gestaltungsfragen**, die übrig blieben — je mit Befund am Code, Varianten
und einem Vorschlag von Claude. Die **vier «hier anfangen»-Blöcke** stehen nicht hier, sondern
oben in der Zeile «Dashboard entschlacken» (Codex-Audit, #363) — dieselbe Frage, ein Ort.*

**Löschen ohne Rückgängig.** 15 Knöpfe in 12 Bereichen löschen sofort und ohne Nachfrage (am Code nachgezählt 25.09.): Dokumente im Tresor
(`DocumentTresor` → `main.jsx`, **endgültig** aus dem Gerätespeicher), Kalender, KVG-Belege,
Merkliste, Schulden (3×), Jobs, Sprachen, Säule 3a, Einzelposten, Ärzt:innen, Medikamente (2×),
Erkrankungen. Ein «Rückgängig» gibt es nirgends (die Treffer für «rückgängig» sind Abhaken und Kommentare). Die ruhige Vorlage für Schweres existiert
(`components/DatenLoeschen.jsx`: erklären, ankreuzen, bestätigen).
- A · **Nachfrage** vor jedem Löschen — sicher, aber elf neue Dialoge.
- B · **Sofort löschen, «Entfernt · Rückgängig»** einige Sekunden lang — ruhig, kein Dialog.
- C · **Mischform:** B für Listen-Einträge, A nur beim Tresor (dort ist die Datei weg).
- *Vorschlag: C.* Aufwand B: S (ein gemeinsamer Hinweis-Baustein); Tresor: M (das Löschen im
  Gerätespeicher muss bis zum Ablauf des Hinweises warten).

**Zwei Zurück-Knöpfe.** In Lebensmappe, Behörden-Dossier, Notfall-Dossier, Briefe und
Notfallpass steht oben «Übersicht» (global, `main.jsx`) **und** ein eigener Knopf «Zurück zu
Meine Unterlagen» bzw. «Zurück zum Notfall» — zwei Wege mit verschiedenem Ziel.
- A · den globalen Knopf dort ausblenden · B · beide zu einer **Brotkrume** zusammenfassen
  («Übersicht › Meine Unterlagen › Dossier») · C · lassen.
- ✅ **Entschieden 25.09.2026 (Stebler Studios): B, die Brotkrume.** Wird gebaut (eigener PR),
  unabhängig von «Bottom-Nav oder Hamburger».
- ✅ **Dazu entschieden 25.09.2026 (Stebler Studios): Brotkrume + Herkunft.** Die Brotkrume
  zeigt die feste Ordnung; wer aus einem Kapitel über einen Querverweis in ein Werkzeug
  springt, bekommt zusätzlich «‹ Zurück zu ‹Kapitel›» — dieselbe Rückkehr wie die
  Zurück-Taste des Browsers, an die Stelle im Kapitel, an der man den Verweis angetippt hat.
  Vorher führte kein Knopf dorthin zurück. Eigener PR (`feat/zurueck-zur-herkunft-2026-09-25`).

**Ladehinweis beim Nachladen.** Sechs Teile in den Kapiteln (Ärzt:innen, Säule 3a, Medikamente,
Sprachen, Erkrankungen, Jobs) und die Einstellungs-Schublade zeigen beim ersten Öffnen kurz
**nichts** (`fallback: null`). Der vorhandene `CalmLoader` hat 160 px Mindesthöhe und keine
Verzögerung — er würde bei kurzem Laden als grosser Block aufblitzen.
- A · lassen · B · kleiner Platzhalter mit fester Höhe, **erst nach ~300 ms** sichtbar.
- *Vorschlag: A, bis es jemand bemerkt.* Die Ladezeit auf einem langsamen Handy ist **nicht
  gemessen** — erst messen, dann bauen.

**Berg-Bilder bei 20–100 %.** Am Fortschritts-Berg erscheinen je nach Ausfüllgrad Tannen,
Edelweiss, Gipfelkreuz, Matterhorn, Kuh, Uhr, Schoggi, Sonne, Fahne (`Dashboard.jsx`, ~Z. 612–680). Dezent
(keine Einblendung, kein Ton) — aber strukturell «mehr ausgefüllt = mehr Belohnung».
- A · behalten · B · auf 2–3 Stufen reduzieren · C · weglassen · D · als abschaltbare «Haut».
- *Vorschlag:* folgt aus dem Gamification-Entscheid oben — «keine Gamification» → C,
  «abschaltbare Haut» → D.

**Steuer-Säule mit Vergleich** (Idee, festgehalten 25.09.2026, Stebler Studios). Das Instrument
«Steuer-Säule» im Dashboard zeigt seit dem Umbau «Was steht mir zu?» nur die **eine** Säule des
eigenen Zivilstands und eine Zahl (Bundessteuer ≈ CHF / Jahr). Gewünscht: irgendwann ein
Vergleich, wie bei Miete und Lohn (`MietVergleich`, `LohnEinordnung`).
- **Haken:** Die direkte Bundessteuer ist in der ganzen Schweiz gleich (DBG Art. 36) — ein
  Regionen-Vergleich ist nur bei Kanton und Gemeinde sinnvoll.
- **Denkbare Form** (Kodierung wie das Miet-Barometer, `docs/design/farb-und-daten-system.md`):
  Füllung = eigene Gesamtsteuer (Bund + Kanton + Gemeinde) in % des Einkommens · ● = Schnitt der
  Kantonshauptorte bei gleichem Einkommen · | = Spanne günstigster bis teuerster Hauptort.
- **Hängt an:** amtliche Vergleichswerte, z. B. ESTV-Statistik «Steuerbelastung in den
  Kantonshauptorten» — **noch nicht geprüft**. Ob `docs/sources/kantonssteuer-tabelle-2026.md`
  dafür reicht, ist offen. Ohne Beleg keine Vergleichszahl.

**Leistungs-Schnellcheck und Anspruchs-Landkarte zu einer Seite** (Idee, 25.09.2026). Auf dem
Dashboard ist das Doppelte aufgelöst (Kompass = Kopf der Leistungsliste, «Alle Ansprüche im
Überblick» als Link). Die Seiten dahinter bleiben zwei: `#/schnellcheck` **rechnet** mit den
eigenen Zahlen, `#/ansprueche` **listet** alle Leistungen nach Auslöser. Denkbar: die Landkarte
mit dem Schnellcheck obenauf — ein eigener Umbau mit Seiten-Entwurf, nicht nebenbei.

**Kleinkram ohne Eile** (Token-Hygiene, bewusst nicht angefasst, weil sichtbar): `radius.pill`
gibt es nicht — 4 Stellen fallen seit jeher auf 10 px zurück, ein echter Pillen-Radius würde das
Aussehen ändern · 13× `text.xs - 1` / `text.body + 1` statt einer Skalenstufe · 16 verschiedene
Deckkraft-Suffixe ohne Token.

## Nächste Schritte (gemeinsam gewählt)

1. ✅ **Diese Landkarte** — vollständig, sichtbar, wählbar.
2. ⏭ **Schnellchecks als Instrumente** (§3) — Design zuerst, Mockup läuft.
3. ⏭ **Obstgarten / lebendiger Baum** (§2) — zuerst die Grundsatzfrage Baum vs. Garten.

**Runde vom 24.09.2026 — Visionen ordnen:**

1. ✅ **Zusammenführen** — alle Visionen an diesem einen Ort (dieser Stand).
2. ✅ **Sortieren nach Horizont** — Tabelle «Horizonte» oben (Vorschlag, kein Beschluss).
3. ⏭ **Entscheiden, gemeinsam, im Oktober** (Entscheid 24.09.) — die beiden Widersprüche (§0 Kern vs. Masterplan, §1
   Gamification), Baum oder Obstgarten (§2), Kapitel-Architektur (§6), die sechs
   Meinungs-Entscheide (§11), das erste grosse Thema nach dem 30.09.
