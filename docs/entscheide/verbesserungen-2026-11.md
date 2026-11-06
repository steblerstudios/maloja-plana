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
| **A2** | «Lebensereignisse» zeigt **36 Abläufe als flache Liste**. Jeder Ablauf trägt schon seinen Lebensbereich (`bereich` in `ABLAEUFE`: Behörden 8, Finanzen 5, Familie 5, Arbeit 5, Wohnen 3, Vorsorge 3, Gesundheit 3, Versicherungen 2, Person 2) | Innerhalb der Gruppe nach Lebensbereich gliedern, mit den Namen der Lebensbereiche als Zwischentitel | **ja** · mittel. Die Namen gibt es schon (`data/lebensbereiche.js`) |
| **A3** | Werkzeuge und Abläufe stehen in **vier Verzeichnissen**: Werkzeuggruppen der Übersicht, Rucksack (Abläufe nach Lebensbereich als Ausrüstungsstücke, `data/gepaeck.js`), Menü (5 feste Anker, `imMenue`) und Suche. Die Übersicht verlinkt selbst «Alle Werkzeuge im Rucksack» | Die Rolle je Verzeichnis festschreiben und als Test sichern: **Suche** = alles · **Menü** = die 5 Anker · **Rucksack** = alle Lebensereignisse · **Übersicht** = Einstieg nach Lage (Gruppen wie «Ankommen», «Mit 18») | **zuerst entscheiden** · mittel. Hängt am Gamification-Blatt (Rucksack, Obstgarten) |

## B · Verbessern (Kanten und Fehler)

| | Befund | Vorschlag | Empfehlung · Aufwand |
|---|---|---|---|
| **B1** | Der Aufklapp-Pfeil der Werkzeuggruppen zeigt **immer «zu»**, auch bei offener Gruppe: `aufklappZeichen(false)` ist fest gesetzt (`WerkzeugGruppen.jsx`). Anderswo folgt der Pfeil dem Zustand (`Lebenssituationen.jsx`: `aufklappZeichen(wegeOffen)`). Am 05./06.11. im Browser gesehen | Zustand je Gruppe halten und den Pfeil danach zeichnen | **ja** · klein. Ein Fehler, der Orientierung kostet |
| **B2** | **Vier verschiedene Tests** waren in zwei Tagen unter Last rot, jedes Mal Zeitüberschreitung nach 5 s, einzeln grün: `erinnerungImBeispiel`, `vorsorgeVorbezugNeuberechnung`, `ipvBernAnzeige`, `demoLeise` | Diesen Dateien eine längere Zeitgrenze geben oder die Testreihe mit weniger gleichzeitigen Prozessen laufen lassen. Gefahr sonst: Rot wird normal und echte Fehler gehen unter | **ja** · klein |
| **B3** | Startbündel **64 107 / 65 000 Bytes**, also 0,9 kB Luft. G1 hätte die Grenze allein gesprengt (65 050) | Regel: neue Teile der Übersicht laden nach. Als Nächstes die grössten fest geladenen Teile der Übersicht messen und den nächsten Kandidaten benennen | **ja** · mittel. Messen vor dem Umbau |

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
A3, C3 und D3 brauchen zuerst einen Entscheid.

**Nicht geprüft für dieses Blatt:** Bedienung jedes Formulars und Rechners, Lesbarkeit mit Vorlesen,
Nutzungszahlen (es gibt keine, local-first), wie Testende von aussen die Wege erleben.
