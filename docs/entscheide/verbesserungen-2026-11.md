# Was man an Maloja verbessern könnte · Web, App, Abläufe (06.11.2026)

*Gemessen am 06.11.2026 auf `main` = `a67a0568` (nach den Merges der Seitenlandkarte) und live auf
malojaplana.ch (Bündel `index-C9PVXT2C.js`, Deploy vom 05.11.). Entscheid: Stebler Studios.
**Nichts gebaut.** Baut auf [`seitenlandkarte-2026-11.md`](seitenlandkarte-2026-11.md) und
[`seiten-buendeln.md`](seiten-buendeln.md) auf. Dort Entschiedenes wird hier nicht neu vorgeschlagen.*

Jeder Punkt nennt den Befund mit Fundstelle, den Vorschlag, die Empfehlung und den Aufwand.
Vor jedem Vorschlag wurde geprüft, ob es die Sache schon gibt oder ob sie bewusst so ist
(Lehre aus Z1 und G3 der Seitenlandkarte).

---

## A · Einfacher machen

| | Befund | Vorschlag | Empfehlung · Aufwand |
|---|---|---|---|
| **A1** | Zwei Gruppen der Übersicht haben je **einen** Eintrag: «Gesundheit» (nur Arztkoffer) und «Unterstützung & Anspruch» (nur «Was steht mir zu?»). Dazu heisst eine dritte Gruppe «Versicherung & Gesundheit» (`components/WerkzeugGruppen.jsx`) | Arztkoffer in «Versicherung & Gesundheit». «Unterstützung & Anspruch» streichen: «Was steht mir zu?» steht schon fest in der Leiste unten | **ja** · klein. Übersicht von 9 auf 7 Gruppen, keine neuen Texte |
| **A2** | «Lebensereignisse» zeigt **36 Abläufe als flache Liste**. Jeder Ablauf trägt schon seinen Lebensbereich (`bereich` in `ABLAEUFE`: Behörden 8, Finanzen 5, Familie 5, Arbeit 5, Wohnen 3, Vorsorge 3, Gesundheit 3, Versicherungen 2, Person 2) | Innerhalb der Gruppe nach Lebensbereich gliedern, mit den Namen der Lebensbereiche als Zwischentitel | **ja** · mittel. ~~Die Namen gibt es schon (`data/lebensbereiche.js`)~~ ⟨korrigiert 06.11.: die Datei hat nur Schlüssel und Farben, die neun Namen sind neu (5 Sprachen)⟩ |
| **A3** | Werkzeuge und Abläufe stehen in **vier Verzeichnissen**: Werkzeuggruppen der Übersicht, Rucksack (Abläufe nach Lebensbereich als Ausrüstungsstücke, `data/gepaeck.js`), Menü (5 feste Anker, `imMenue`) und Suche. Die Übersicht verlinkt selbst «Alle Werkzeuge im Rucksack» | Die Rolle je Verzeichnis festschreiben und als Test sichern: **Suche** = alles · **Menü** = die 5 Anker · **Rucksack** = alle Lebensereignisse · **Übersicht** = Einstieg nach Lage (Gruppen wie «Ankommen», «Mit 18») | **zuerst entscheiden** · mittel. Hängt am Gamification-Blatt (Rucksack, Obstgarten) |

## B · Verbessern (Kanten und Fehler)

| | Befund | Vorschlag | Empfehlung · Aufwand |
|---|---|---|---|
| **B1** | Der Aufklapp-Pfeil der Werkzeuggruppen zeigt **immer «zu»**, auch bei offener Gruppe: `aufklappZeichen(false)` ist fest gesetzt (`WerkzeugGruppen.jsx`). Anderswo folgt der Pfeil dem Zustand (`Lebenssituationen.jsx`: `aufklappZeichen(wegeOffen)`). Am 05./06.11. im Browser gesehen | Zustand je Gruppe halten und den Pfeil danach zeichnen | **ja** · klein. Ein Fehler, der Orientierung kostet |
| **B2** | **Vier verschiedene Tests** waren in zwei Tagen unter Last rot, jedes Mal Zeitüberschreitung nach 5 s, einzeln grün: `erinnerungImBeispiel`, `vorsorgeVorbezugNeuberechnung`, `ipvBernAnzeige`, `demoLeise` | Diesen Dateien eine längere Zeitgrenze geben oder die Testreihe mit weniger gleichzeitigen Prozessen laufen lassen. Gefahr sonst: Rot wird normal und echte Fehler gehen unter | **ja** · klein |
| **B3** | Startbündel **64 107 / 65 000 Bytes**, also 0,9 kB Luft. G1 hätte die Grenze allein gesprengt (65 050) | Regel: neue Teile der Übersicht laden nach. Als Nächstes die grössten fest geladenen Teile der Übersicht messen und den nächsten Kandidaten benennen | **ja** · mittel. Messen vor dem Umbau |

### B3 · gemessen (06.11.2026, main `11b077fd`)

Startbündel **64 293 / 65 000 Bytes** (seit Mittag +170 Bytes durch weitere Merges). Gemessen mit einem Build mit Quellkarten:
jedes Byte der Startdatei der Quelldatei zugeordnet, die es erzeugt. Grösste Anteile (gzip, je Datei für sich gepackt,
die Summe ist darum grösser als das Bündel):

| Datei | gzip | Befund |
|---|---|---|
| `main.jsx` | 15,6 kB | Verteiler für ~90 Ansichten, gehört zum Start |
| `Dashboard.jsx` | 6,6 kB | erste Seite, gehört zum Start |
| `components/BergLandschaft.jsx` | 5,8 kB | das Bild oben auf der Übersicht, im ersten Blick sichtbar, **nicht** nachladen |
| `IconKern.jsx` | 4,2 kB | Zeichen der ersten Seite |
| `config/ansichtenRegister.js` | 3,8 kB | **davon Suchwörter**: roh 6 kB von 18,8 kB; ohne sie gepackt rund **2,4 kB kleiner** |
| `config/constants.js` | 3,3 kB | Farben, Kapitel |
| `GlossarBegriff.jsx` | 1,5 kB | zweiter Kandidat, prüfen, ob er auf der ersten Seite gebraucht wird |
| `data/werkzeugRegister.js` | 1,4 kB | davon Suchwörter roh 1,5 kB, rund 0,5 kB gepackt |

**Nächster Kandidat: die Suchwörter** (`aliases` in `ABLAEUFE`, `SEARCH_VIEWS`, `WERKZEUGE`) in eine eigene, nachgeladene
Datei. Gelesen werden sie nur von der Suche (`SearchView.jsx`, lädt schon nach) und von der Suche im Menü (`MobileNav.jsx`).
Gewinn etwa 2–3 kB, also mehr als alles, was die heutigen Schritte gekostet haben.

**Warum nicht sofort:** Der offene PR #698 «Fassung 9: eine Suche für Lupe und Menü» (andere Sitzung) baut genau diese
Menü-Suche um. Erst nach seinem Merge auslagern, sonst kollidieren zwei Umbauten in denselben Dateien.

**Regel ab jetzt:** Neue Teile der Übersicht laden nach (wie `WerkzeugGruppen.jsx`). Vor jedem Merge, der die Startdatei
berührt, `npx size-limit --json` messen, nie die Grenze anheben.

## C · Ausführlicher (ergänzen)

| | Befund | Vorschlag | Empfehlung · Aufwand |
|---|---|---|---|
| **C1** | Öffentlich gibt es 6 deutsche Erklärseiten. Bereiche, die in der App gross und stark verlinkt sind, fehlen: Vorsorge (30 Verweise), Ergänzungsleistungen (15), Arbeitslosigkeit (11). «Wie die Schweiz entscheidet» liegt als Entwurf in #693 | Nächste Erklärseite. Empfehlung: **Ergänzungsleistungen**, dann ALV, dann AHV/Pensionierung | **ja, eine nach der anderen** · gross je Seite (voller Prüfdurchgang) |
| **C2** | fr/it/en: je 5 Seiten, maschinell geprüft (05.11.), auf `noindex`. Krankenkasse und Kantone im Vergleich nur deutsch | Menschliche Lektüre je Sprache, dann freischalten. Danach Krankenkasse in fr/it/en | **ja** · Lektüre ausserhalb, Freischalten klein |
| **C3** | **1373 Texte** in `rm.js` tragen `TODO(rm): provisorisch` | Entscheiden, ob Rumantsch voll bleibt (dann braucht es eine Fachperson) oder bewusst schmaler wird, zum Beispiel nur Notfall, Erklärseiten und Kern-Abläufe | **zuerst entscheiden** · Umfang je nach Entscheid |

## D · Zusammenbringen (Web ↔ App)

| | Befund | Vorschlag | Empfehlung · Aufwand |
|---|---|---|---|
| **D1** | Seit E1 führt die Erklärseite ins Werkzeug. **Umgekehrt führt die App nie zur eigenen Erklärseite.** Kein Werkzeug verlinkt `/sozialhilfe/`, `/steuern/`, `/praemienverbilligung/` oder `/krankenkasse/` (nur das Beta-Tor) | Im passenden Werkzeug ein ruhiger Link «Wie das funktioniert» auf die Erklärseite. Sozialhilfe-Rechner → `/sozialhilfe/`, Steuern → `/steuern/`, IPV → `/praemienverbilligung/`, Versicherungs-Übersicht → `/krankenkasse/` | **ja** · klein bis mittel, neuer Linktext in 5 Sprachen |
| **D2** | Das Beta-Tor nennt **4 von 6** Erklärseiten (`BetaGate.jsx`): Was steht mir zu?, Prämienverbilligung, Sozialhilfe, Steuern. **Krankenkasse fehlt**, obwohl sie indexiert ist | Krankenkasse ins Tor aufnehmen, Kantone im Vergleich nach dem Deploy | **ja** · klein |
| **D3** | Wer «Maloja Plana» sucht, landet auf `/`, also am Code-Feld. Die Startseite ist das Tor | Nach der Beta: eine öffentliche Startseite, die die Erklärseiten und das Beispiel zeigt. Bis dahin bleibt das Tor | **später** · gross, gehört zur Frage «Beta erst mit Testenden von aussen» |

---

## Übersicht

| Was | Punkte | Ohne Entscheid baubar |
|---|---|---|
| Einfacher | A1, A2, A3 | A1, A2 |
| Verbessern | B1, B2, B3 | B1, B2, B3 |
| Ausführlicher | C1, C2, C3 | C1 (Wahl der Seite), C2 (nach Lektüre) |
| Zusammenbringen | D1, D2, D3 | D1, D2 |

**Reihenfolge-Vorschlag** (klein und sicher zuerst): B1 → B2 → A1 → D2 → D1 → A2 → B3 → C1.
⟨Stand 06.11. ~16:00: B1 #716, B2 #717, A1 #719, D2 #720, D1 #721, A2 #723 gemergt (nicht live). B3 gemessen, siehe oben; Umbau nach #698. Zwischendurch main repariert (#724: «Kantone im Vergleich» nach #691 nicht neu erzeugt). D1 und A2 nicht im Browser geprüft (Ordner durch fremde Dev-Server belegt).⟩
A3, C3 und D3 brauchen zuerst einen Entscheid.

---

## Entscheide 06.11.2026, ~16:50 (Stebler Studios, Auswahl-Dialog)

*Gemessen vorher: main `c5240692`, live `index-C9PVXT2C.js` (05.11.), Startbündel 64 258 / 65 000 auf main `08e7415a`.*

| Punkt | Entscheid | Folge |
|---|---|---|
| **A3** Rollen der vier Verzeichnisse | **«Erst Gamification klären»** | Vorschlag (Suche = alles · Menü = 5 Anker · Rucksack = alle Lebensereignisse · Übersicht = Einstieg nach Lage) bleibt liegen, bis Rucksack und Obstgarten entschieden sind. Kein Test. |
| **C1** nächste Erklärseite | **Ergänzungsleistungen** | Nach `/politsystem/` (#693). Danach ALV, dann AHV/Pensionierung. Voller Prüfdurchgang je Seite. Noch nicht begonnen. |
| **C2** fr/it/en freischalten | **«Ich prüfe zuerst Fedlex»** | Claude prüft die drei Zitate (Art. 3 UWG fr/it, Art. 12 BV en) am Fedlex-Text. Die Lektüre je Sprache macht ein Mensch (Stebler Studios oder jemand, den sie fragt). Erst dann `freigegeben: true`. |
| **C3** Rumantsch voll oder schmal | **«Später entscheiden»** | Rumantsch bleibt wie heute: 1375 von rund 4480 Texten mit `TODO(rm)` (gezählt 06.11. auf `origin/main`), `noindex`. Frage bleibt offen. Beim ersten Fragen kam «ehm ich weiss nicht». Die zweite, einfachere Fassung («überall» oder «nur wichtigste Stellen») führte zu «später». |
| **D3** öffentliche Startseite | **«Jetzt planen»** | Claude skizziert die Startseite als beschriftetes Bild (A–E). Nichts gebaut. |

**Fremde PRs, Merge auf Zuruf (06.11. ~16:45):** gemergt #692 (Prüfdurchgang fr/it/en, schaltet nichts frei), #694 (F8 Besprechen),
#689 (F8-P4 Druck). Vorher alle drei zusammen probeweise auf `c5240692` gemergt: 8316 Tests grün (rc 0),
`build-seiten --pruefen` ok. Nach dem Merge: main `08e7415a`, Baum gleich wie die Probe, `--pruefen` ok, Startbündel 64 258.

**Offen geblieben, mit Grund:**

| PR | Grund |
|---|---|
| #696 → #698 → #701 → #703 → #710 → #712, dazu #722 | Kette der Fassung 9. #696 hat Konflikte mit main, die übrigen zielen auf Zweige der Kette, darum ohne CI gegen main. Erst #696 nachziehen. |
| #713, #718 | Icons, Konflikte. Die Sitzung zu den Icons arbeitet noch. |
| #726 | Bewegung/Tokens, CI grün, sauber. Die Sitzung dazu arbeitet noch, darum nicht angefasst. |
| #693 | `/politsystem/`, Konflikte. Wartet auf den Handy-Test (Entscheid 05.11.). |
| #652 | Wiederkehr zählen, Konflikte, seit 02.11. unberührt. |

**B3 zurückgestellt:** Das Auslagern der Suchwörter wartet auf #698, und #698 wartet auf #696.

**D1 und A2 im Browser: weiter nicht gesehen.** Am 06.11. ~16:30 war der Ordner `~/Claude/Projects` wieder mit fünf fremden
Dev-Servern voll (Ports 4397, 4399, 5321, 5484, 5485). Nicht umgangen. Belegt ist nur der Code: `appZurErklaerseite.test.js` und
`lebensereignisseNachBereich.test.js` grün, 11 Tests.

**SEO gegen live (06.11. ~16:40):** Sitemap live 7 Seiten, main 8. Neu ist `/kantone-im-vergleich/`, live noch 404, kommt mit dem
Deploy. fr-Seiten live `noindex, follow`, ohne `rel="alternate"` (der hreflang-Ring fehlt zu Recht, es gibt erst eine freigegebene
Sprache). Die `hreflang`-Treffer im HTML sind die Sprachwahl-Links. **Beta-Tor auf main:** 5 Erklärseiten, Krankenkasse ist dabei
(D2), «Kantone im Vergleich» fehlt noch. Laut D2 kommt sie nach dem Deploy dazu.

**Nicht geprüft für dieses Blatt:** Bedienung jedes Formulars und Rechners, Lesbarkeit mit Vorlesen,
Nutzungszahlen (es gibt keine, local-first), wie Testende von aussen die Wege erleben.

**C2 · Fedlex-Abgleich (06.11. ~17:05):** Der Volltext kommt über den SPARQL-Endpunkt von Fedlex, die Seite selbst lädt nur
per Skript. Alle drei Zitate wichen ab: fr Art. 3 Abs. 1 Bst. s Ziff. 1 UWG (« celle du » statt « pour le courrier électronique »),
it dieselbe Stelle («compreso quello della» statt «incluso il suo indirizzo di posta elettronica»), en Art. 12 BV frei umschrieben
statt nach der amtlichen Übersetzung. Korrigiert in **Entwurfs-PR #730** (`fix/seiten-fedlex-zitate`), noch nicht gemergt.
**Danach fehlt für die Freigabe nur noch die menschliche Lektüre je Sprache.**

**D3 · Skizze der öffentlichen Startseite (06.11., nichts gebaut):** Handybreite, fünf Flächen von oben nach unten.

| | Fläche | Inhalt |
|---|---|---|
| **A** | Kopf | Name und ein Satz, was Maloja ist («Dein Lebensordner für die Schweiz. Bleibt auf deinem Gerät.») |
| **B** | Hauptknopf | «Ohne Code ausprobieren» führt ins Beispiel. Das Code-Feld steht nur noch klein darunter |
| **C** | Erklärseiten | sechs Kacheln (Was steht mir zu?, Krankenkasse, Prämienverbilligung, Sozialhilfe, Steuern, Kantone im Vergleich). Das ist der Teil, den Google findet |
| **D** | Daten | ein Satz: keine Anmeldung, keine Cloud, kein Tracking |
| **E** | Fuss | Rechtliches, Sprachen, Kontakt, wie auf den Erklärseiten |

Offen vor dem Bau: der Wortlaut von A und D. Der Satz zu den Daten muss zur Datenschutzerklärung passen, darum vorher der
`rechts-pruefer`. Ausserdem: ob `/` die Startseite wird und das Tor nach `/beta/` zieht, oder ob das Tor bleibt und die
Startseite nur verlinkt wird. Die Stufenregel vom 04.11. gilt weiter: Beta heisst Testende von aussen.
