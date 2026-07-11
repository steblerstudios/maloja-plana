# Ideen & Vision — die Landkarte

Der *eine* Ort für alles, was Maloja schöner, lebendiger, unverwechselbarer macht.
Nicht was kaputt ist (`BUGS.md`), nicht die technische Arbeitsliste (`docs/TODO.md`) —
sondern die **Seele**: Metaphern, Atmosphäre, grosse Ideen, offene Entscheide.

**Status:** 🌱 Vision (noch nicht gebaut) · 🔨 teilweise gebaut · ⏸ bewusst geparkt · ✅ gebaut · ❓ Design-Entscheid (gemeinsam)

**Wie wir das nutzen:** ein Thema zur Zeit, **Design zuerst, gemeinsam** (oft per Mockup),
schritt für schritt. Nichts wird ohne dein Ja gebaut. Vollständig durchgegangen 2026-07-08
(alle ~30 Braindumps + docs); Detail-Kontext je Idee in den Memory-Notizen.

---

## 1 · Die Skeuomorphismus-Welt (Metapher pro Bereich)

> Kern: nicht „Papier draufklatschen", sondern *jede Funktion bekommt die reale Metapher,
> die unser Gehirn damit verbindet* — eine sorgfältige Lebenswerkzeugkiste.

- 🔨 **Gesundheit = Leder-Arztkoffer** — Fächer-Ansicht existiert, aber ruhige Liste; der Koffer mit *Instrumenten* (Thermometer/Wochenblister/Karteikarten/Impfausweis/KVG/Notfall) fehlt.
- 🌱 **Dokumente = Aktenschrank** (Ordner/Mappen/Tabs) · **Budget = Thermobeleg** (Coop-Quittung, Monatsabschluss) · **Schulden = Betreibungs-/Verlustschein-Look** (Siegel/Stempel, kein CH-Kreuz).
- 🌱 **Wohnen = kleines Haus** (Zimmer = Themen) · **Miet-Angaben optisch wie ein Mietvertrag** · **Mobilität = Fahrzeugmappe** · **Familie = Fotoalbum** · **Behörden = Bundesordner** · **Arbeit = Bewerbungsmappe** · **Ideen = Notizbuch**.
- 🌱 **KVG-Katalog = Karteikartenbox** · **Bibliothek = Bücherregal** (✅ Direktlinks als Regal gebaut; Ausbau möglich).
- 🌱 **Lebenslauf-Generator skeuomorph darstellen** (CV-Inhalt existiert, Optik nicht).
- ✅ **EL-Icon** gebaut (Aufstockung, keine Almosen-Optik) — hängt an den EL-*Schwerpunkt*-Schritten. Session #38: Todesfall hatte EL nur als Nebensatz im breiten „Renten & Versicherungen melden"-Schritt → auf Wunsch von Stebler Studios **eigener Schritt „4 · Hinterbliebenenrente & EL prüfen" mit Icon** herausgelöst (wie Pensionierung#4/IV#3/Pflege#3), Erbschaft rückt auf #5. Glossar bleibt Text-only-Tooltip (kein Icon-Ort). Damit alle sinnvollen Ablauf-Plätze abgedeckt.
- 🌱 **Heirat = Icon mit zwei Ringen** · **Rückforderungsbeleg-Look** (b83c35f) gefällt optisch nicht → Redesign vor weiterer Status-UI.
- ⏸ **Konto = schlichtes Banking** · **Analysen = modern/Apple-Glas** — bewusst KEINE Metapher.

## 2 · Der Lebensbaum (Nordstern-Atmosphäre)

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
- 🌱 **Stiftungs- & Härtefonds-Verzeichnisse ausbauen** (nicht nur Ausbildung) + Antrags-Generator.

## 6 · Architektur & Struktur (grosse Entscheide)

- ⭐ **Nordstern: alles ist ein Lebensereignis-Ablauf** — kein Rechner steht allein; Onboarding inklusive. (16 Abläufe ✅.)
- ⭐ **Schweizer Lebensmodell-Matrix** — „Was passiert im Leben + was in CH tun?", 11 Kapitel Geburt→Tod + Grauzonen + Lebenszustände.
- ❓ **Kapitel-Architektur nach Lebens-Domäne** — Gesundheit als eigener Bereich; Arbeit+Vorsorge+Steuer zusammen statt „Versicherungen"-Sammeltopf. Grosser Design-Entscheid, eigene Session.
- 🌱 **Standard-3-Schritt-Ablauf für ALLE Orientierungsseiten** — (1) Übersicht+Eingaben → (2) Stand+Vergleich → (3) Änderungsarbeiten. App-weit angleichen + Quellen-Checks.
- 🌱 **„Keine Doppel-Eingabe"-Audit** (semantische Kontinuität: Name/Kanton/Haushalt/Einkommen einmal → überall) · **Lärm-Audit** (was schreit vs. flüstert) · **Flow-Health-Check** über die 43 Abläufe.
- ❓ **Bottom-Nav vs. Hamburger** (Daumen-Erreichbarkeit vs. „Ort"-Gefühl) · **Info-Buttons-Systematik** app-weit (inline expand/collapse).
- 🌱 **Exakte-Quellen-Audit-Agent** + periodischer Lauf — jede Behauptung ↔ präzise Fundstelle (rechtlich/Vertrauen, hohe Prio).

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

## 9 · Herzensempfehlungen (extern verlinkt, nicht integriert)

- 🌱 **Skribble / DocuSign** (E-Signatur — NICHT integrieren, nur empfehlen; Skribble = CH) · **Zollomat** (Zoll-/Einfuhr) · **EGK** (nachhaltige KK — Werte prüfen).
- 🌱 **Warme Inhalte bündeln** — Herzensempfehlungen + grün gehostet + Zertifikate als ein ruhiges Hamburger-„Blatt", Links aufs Wort.

## 10 · Onboarding & Beispiel-Modus

- ✅ **Bedürfnis-Onboarding** (Lebenszustände-Chips) + **Tour** (skipbar/verschiebbar).
- 🌱 **Beispiel-Modus mit Personas** — Szenarien (Familie/allein/neu zugezogen/Rentner) — als Nebenprodukt aus einem **Persona-QA-Durchlauf** ableiten, nicht separat erfinden.

## 11 · Strategie & Aussenwelt (eigene Gespräche)

- ⏸ **Backend / Konten / Sync / SwissID** — Grundsatzentscheid Local-First (eigene Session).
- ⭐ **Datenschutz-Haltung** — keine Daten verkaufen, kein Google/Apple-Login, SwissID ja, cookieless + aggregierte Stats.
- 🌱 **SEO** — hreflang, pro-Sprache-Landing, sitemap.xml, Google Search Console (der eigentliche Auffindbarkeits-Hebel) · **Subdomains** (app./mail./news.).
- 🌱 **Marketing** — mehrsprachige QR-Flyer, Pilot-Outreach (Caritas/HEKS/Gemeinde), Erklär-Seiten pro Thema.
- 🌱 **Asylwesen** + mehr Sprachen (Albanisch/Tigrinya) · **Business-Model-Gerüst** (Zielgruppe/Persona/USP/PoC).
- 🌱 **Zertifizierungen** (B Corp/Digital Trust) · **Markenschutz IGE** · **Business-Mail-Entscheid** (Infomaniak/Proton/IncaMail).

## 12 · Design-Ressourcen & Tooling (Referenz)

- Icons: fonts.google.com/icons · icons.getbootstrap.com — Fonts: fontshare.com — Farben: coolors.co
- Inspiration: mobbin.com · awwwards.com · dribbble.com — Marken-`::selection`-Farbe setzen.
- Prinzipien: **Jakob's Law** (vertraute Muster nutzen) · Better UX → More A11y → Better SEO (ein Hebel, drei Gewinne).

---

## Nächste Schritte (gemeinsam gewählt)

1. ✅ **Diese Landkarte** — vollständig, sichtbar, wählbar.
2. ⏭ **Schnellchecks als Instrumente** (§3) — Design zuerst, Mockup läuft.
3. ⏭ **Obstgarten / lebendiger Baum** (§2) — zuerst die Grundsatzfrage Baum vs. Garten.
