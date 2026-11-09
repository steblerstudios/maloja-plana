# Bauplan · Kantonsseiten vor dem Gate

**Stand:** 09.11.2026 · Entwurf · Auftrag von Stebler Studios («Ja, Bauplan»), nach der
SEO-Durchsicht vom selben Tag.
**Status:** nichts gebaut. Entscheide E1–E4 gefallen am 09.11.2026 (Abschnitt 9).
Nächster Schritt: PR 1 (Linkfehler BE/GE), dann PR 2 mit den Piloten.

---

## 1. Warum

Gesucht wird mit dem Kanton im Satz: «Prämienverbilligung Kanton Zürich», «IPV Bern
Antrag», «subside assurance maladie Vaud». Die Erklärseiten beantworten die Frage für
die ganze Schweiz und schicken die Person dann weiter. Für die Suchanfrage mit Kanton
gibt es heute keine Seite von Maloja.

Die Amtsseiten sind für genau diese Anfragen stark, aber jede kennt nur ihren Kanton
und spricht Amtssprache. Maloja kann für alle 26 Kantone gleich gebaut und gleich
verständlich erklären: wer zuständig ist, ob man etwas tun muss, wo der Antrag liegt.
Das ist die Fläche aus dem SEO-Audit vom 20.09.2026 («Kanton-Cluster»), die bis jetzt
offen war.

**Gemessener Ausgangspunkt (09.11.2026):**

| | live | main `06be1f27` |
|---|---|---|
| Seiten in der Sitemap | 7 | 10 |
| davon bei Google indexiert | 6 (Search Console) | — |
| Seiten mit Kanton im Titel | 0 | 0 |

## 2. Was gebaut wird · Welle 1: Prämienverbilligung je Kanton

**26 Seiten**, eine pro Kanton, unter dem Thema:

```
/praemienverbilligung/                 ← bestehende Seite, wird zum Knoten
/praemienverbilligung/zuerich/
/praemienverbilligung/bern/
…
/praemienverbilligung/jura/
```

**Warum mit der IPV anfangen:** Kein anderes Thema ist im Repo so gut belegt. In
`src/config/cantonalData.js` (`CANTONAL_IPV`) hat jeder der 26 Kantone

- den **Weg**: von Amtes wegen oder auf Antrag (`noteKey`),
- die **Durchführungsstelle** (SVA, Ausgleichskasse, Amt, Gemeinde),
- die **Rechtsgrundlage** mit Erlass-Nummer (`beleg.quelle`),
- ein **Prüfdatum** (`beleg.stand`, alle zwischen 20.09. und 14.10.2026),
- den Wortlaut der Quellen in `docs/sources/ipv-kantone-2026.md` (5020 Zeilen).

Dazu kommt der Link aufs Amt aus `src/data/direktLinks.js` (`CANTONAL_LINKS[k].ipv`).

**Verteilung der Wege, aus `CANTONAL_IPV` gezählt:**

- von Amtes wegen, aus den Steuerdaten: **BE, UR, AI, VS, JU**
- von Amtes wegen, mit Antwortschein für neu Berechtigte: **NE**
- in der Regel von Amtes wegen, mit benannten Antragsfällen: **GE**
- auf Antrag: die übrigen **19**

Das ist die wichtigste Auskunft der ganzen Seite: «Muss ich etwas tun?» Bei 19 Kantonen
heisst die Antwort Ja. Wer es nicht weiss, verliert Geld.

## 3. Was auf einer Kantonsseite steht

Skizze, Buchstaben für die Besprechung:

```
┌────────────────────────────────────────────────────────┐
│ A  Brotkrume: Versicherungen › Prämienverbilligung ›   │
│    Kanton Zürich                                       │
├────────────────────────────────────────────────────────┤
│ B  h1  Prämienverbilligung im Kanton Zürich            │
│    Ein Satz: was die IPV ist (Link auf die Hauptseite) │
├────────────────────────────────────────────────────────┤
│ C  «Muss ich etwas tun?»                               │
│    Antrag nötig  ·  oder  ·  kommt von Amtes wegen     │
│    (Zeichen + Wort, nie nur Farbe)                     │
├────────────────────────────────────────────────────────┤
│ D  Wer zuständig ist                                   │
│    Stelle · Link aufs Amt · was man dort bekommt       │
├────────────────────────────────────────────────────────┤
│ E  Was in diesem Kanton anders ist                     │
│    1–3 Sätze aus dem Kommentar und dem Quellenblatt    │
│    (z. B. Gemeinde statt SVA, Antwortschein, Zuzug)    │
├────────────────────────────────────────────────────────┤
│ F  Wie viel? → «Das rechnet die App aus, mit Ihren     │
│    Zahlen, auf Ihrem Gerät.» Kein Betrag auf der Seite │
├────────────────────────────────────────────────────────┤
│ G  Rechtsgrundlage · Inhaltlich geprüft: <Monat>       │
│    Nachbarkantone · zurück zur Übersicht               │
└────────────────────────────────────────────────────────┘
```

**Die Regel der Erklärseiten gilt unverändert:** keine Beträge, keine Fristen, keine
Einkommensgrenzen, keine Prozentsätze. Einzige Ausnahme bleibt das sichtbare
Prüfdatum. Der Wächter in `src/__tests__/oeffentlicheSeiten.test.js` deckt die neuen
Seiten mit ab, ohne neue Ausnahme.

Folge für E: Wo das Quellenblatt eine Frist nennt (NE: Antwortschein «innert 30 Tagen»),
sagt die Seite «Die Frist steht im Schreiben des Kantons» und nennt die Zahl nicht.

**Die Hauptseite `/praemienverbilligung/`** bekommt einen Abschnitt «Ihr Kanton» mit den
26 Kantonen als Liste, gruppiert nach Weg (Antrag · von Amtes wegen). Das ist zugleich
der interne Link, ohne den Google die Unterseiten nicht findet (siehe `/krankenkasse/`:
nicht verlinkt, «gefunden – nicht indexiert»).

**Einordnung in die Seiten-Architektur:** Kapitel **Versicherungen**, Ast
Prämienverbilligung (Entscheid 06.11.2026: IPV und Prämien gehören zu Versicherungen).

## 4. Gefahr: 26 fast gleiche Seiten

Google wertet viele Seiten, die sich nur im Ortsnamen unterscheiden, als
«Doorway Pages» ab. Das kann auch den bestehenden Seiten schaden. Drei Riegel dagegen:

1. **Nur bauen, was belegt ist.** Eine Kantonsseite entsteht nur, wenn `beleg.quelle`
   gesetzt ist und der Amtslink geprüft ist. Fehlt eines, gibt es keine Seite, und der
   Kanton erscheint in der Liste ohne Link.
2. **Eigener Inhalt je Seite.** C, D und E sind pro Kanton verschieden. Ein Test misst
   den Anteil Text, den eine Kantonsseite mit keiner anderen teilt, und bricht unter
   einer Schwelle ab. Die Schwelle legen wir beim Bau fest, nachdem wir die erste
   Fassung gemessen haben (nicht vorher raten).
3. **Kein abgeschriebener Erklärtext.** Was für alle Kantone gilt, steht einmal auf der
   Hauptseite und wird verlinkt, nicht 26-mal wiederholt.

## 5. Zwei Befunde aus der Erhebung, die vor dem Bau behoben werden

In `CANTONAL_LINKS` (`src/data/direktLinks.js`) zeigt der Link `sozialdienst` bei zwei
Kantonen auf die **Prämienverbilligung**, nicht auf die Sozialhilfe:

- **BE:** `sozialdienst` = `…/themen/pv.html`, dieselbe Adresse wie `ipv`
- **GE:** `sozialdienst` = `…/informations-generales-subside-assurance-maladie`

Das betrifft schon heute die App, nicht erst die neuen Seiten. Behebung als eigener
kleiner PR, vor Welle 2.

Dazu: `DIREKTLINKS_VERSION` steht auf `2026-06`, es gibt kein Prüfdatum je Link. Vor
Welle 1 prüft der `link-checker` alle 26 `ipv`-Links. Jeder Link bekommt ein Datum.

## 6. Spätere Wellen

Nicht Teil dieses Baus. Hier nur, damit die Adressen von Anfang an passen.

| Welle | Thema | Adresse | Datenlage im Repo |
|---|---|---|---|
| 2 | Sozialhilfe je Kanton | `/sozialhilfe/<kanton>/` | dünn: nur ein Link je Kanton, zwei davon falsch (Abschnitt 5). Braucht eine Erhebung wie `ipv-kantone-2026.md`: Gesetz, SKOS übernommen ja/teilweise, Gemeinde oder Region zuständig |
| 3 | Steuererklärung je Kanton | `/steuern/<kanton>/` | Link + Software (z. B. TaxMe in BE); Tarife bleiben in der App |
| — | Ergänzungsleistungen | offen | Durchführungsstelle je Kanton müsste erhoben werden |

## 7. Sprachen

Welle 1 erscheint **auf Deutsch für alle 26 Kantone**. Das ist für GE, VD, NE, JU, FR,
VS und TI unbefriedigend: Dort sucht man auf Französisch oder Italienisch.

Die französischen und italienischen Fassungen kommen mit der Freigabe der Übersetzungen
(offen seit 05.11.2026: menschliche Lektüre, Fedlex-Zitate). Bis dahin tragen sie wie
die übrigen Übersetzungen `noindex`. Rätoromanisch bleibt draussen.

Die Adressen bleiben deutsch (`/fr/praemienverbilligung/vaud/`), wie bei den
bestehenden Seiten. Ob sie französische Pfade bekommen sollen, ist Entscheid E3.

## 8. Wie gebaut wird

**Kein neues System.** Der bestehende Generator wird erweitert:

- `scripts/build-seiten.mjs` erzeugt die Kantonsseiten aus `CANTONAL_IPV` +
  `CANTONAL_LINKS` + einem neuen, kurzen Textblock je Kanton (für E).
- Der Textblock je Kanton liegt in `scripts/seiten/praemienverbilligung-kantone.mjs`.
  Er wird aus Kommentaren und Quellenblatt geschrieben, nicht erfunden, und vom
  `swiss-precision-pruefer` und vom `rechts-pruefer` gegen
  `docs/sources/ipv-kantone-2026.md` geprüft.
- **Die Sitemap kommt weiter aus derselben Quelle** (10 → 36 Adressen).
- `check-seo.sh` prüft die Kantonsseiten mit, wie die anderen.
- Kein JavaScript, kein Bundle-Zuwachs (statische Seiten, Startbündel unberührt).

**Tests (neu oder erweitert):**

- jede Seite: Weg (C) stimmt mit `noteKey` überein, Stelle (D) und Link vorhanden
- keine Zahl ausser dem Prüfdatum (bestehender Wächter, auf die neuen Seiten ausgedehnt)
- Anteil eigener Text je Seite (Abschnitt 4)
- jede Kantonsseite ist von der Hauptseite verlinkt und steht in der Sitemap
- Prüfdatum je Seite = `beleg.stand` des Kantons, nicht das Build-Datum
- Mutationsprobe für jeden Wächter: absichtlich falschen Weg setzen → rot aus dem
  richtigen Grund

**Prüfer vor dem Merge:** `swiss-precision-pruefer` (Weg, Stelle, Rechtsgrundlage je
Kanton) · `rechts-pruefer` (Haftungsausschluss, Quellen) · `copy-pruefer` (Ton, Sie) ·
`a11y-pruefer` (Zeichen + Wort in C) · `link-checker` (alle Amtslinks).

**Ablauf in PRs, je ein Entwurf:**

1. Linkfehler BE/GE beheben + Prüfdatum je Link (klein, unabhängig)
2. Generator + 3 Pilotkantone (ZH = Antrag bei der SVA, BE = von Amtes wegen,
   TG = Antrag bei der Gemeinde). Im Browser ansehen, Entscheid über das Aussehen
3. die übrigen 23 Kantone + Abschnitt «Ihr Kanton» auf der Hauptseite
4. Brand Book nachführen (neuer Seitentyp), im selben Zweig wie 2

## 9. Entscheide

> ✅ **Entschieden 09.11.2026 von Stebler Studios: alle vier Empfehlungen angenommen**
> (Antwort «Ja, alle vier»). Damit gilt: Thema zuerst in der Adresse · 3 Pilotkantone
> ZH, BE, TG · deutsche Pfade, französische erst mit der Freigabe der Übersetzungen ·
> «Antrag nötig» Gold, «von Amtes wegen» Blau, immer mit Wort und Zeichen.
> Die Tabelle bleibt als Begründung stehen.

| | Frage | Empfehlung |
|---|---|---|
| **E1** | Adresse: `/praemienverbilligung/zuerich/` (Thema zuerst) oder `/kantone/zuerich/praemienverbilligung/` (Kanton zuerst)? | **Thema zuerst.** So ist die Hauptseite der natürliche Knoten, und die Adresse liest sich wie die Suchanfrage. Eine Kantonsübersicht über alle Themen bleibt der Kantonsatlas. |
| **E2** | Mit 3 Pilotkantonen beginnen oder gleich alle 26? | **3 Piloten.** Die Gestaltung und die Schwelle für eigenen Text werden an echten Seiten entschieden, nicht 26-mal nachgebessert. |
| **E3** | Französische Pfade für die Romandie (`/fr/subside-assurance-maladie/vaud/`)? | **Später.** Erst mit der Freigabe der Übersetzungen entscheiden. Bis dahin deutsche Pfade wie überall. |
| **E4** | Zeigt C eine Farbe für «Antrag nötig»? | **Gold**, nach den Farbrollen (Gold heisst handeln). «Von Amtes wegen» in Blau (informieren). Immer mit Wort und Zeichen. |

## 10. Deployment und Rollback

- **Deploy:** wie die übrigen Erklärseiten über `deploy.sh`, Hand von Stebler Studios. Davor
  `/maloja-predeploy`. Gemergt ist nicht live.
- **Nach dem Deploy belegen:** 36 Adressen in der Sitemap · Stichprobe von 5
  Kantonsseiten mit HTTP 200 und `index, follow` · erfundener Kanton
  (`/praemienverbilligung/atlantis/`) gibt 404 · dann `indexnow-ping.sh`, in der Search
  Console die Sitemap neu einreichen.
- **Rollback:** Die Seiten sind statische Dateien ohne Abhängigkeit in der App.
  Zurück geht es mit einem Redeploy des vorherigen Tags (`deploy.sh`), oder gezielt,
  indem der Generator die Kantonsseiten auslässt und neu baut. Bereits indexierte
  Adressen geben danach 404 und fallen nach einigen Wochen aus dem Index. Keine
  Weiterleitung nötig.
- **Jährlicher Unterhalt:** Ändert ein Kanton den Weg oder die Stelle (wie SZ zum
  01.01.2026, Durchführung neu bei der SVA), zieht die Seite beim nächsten Build mit,
  weil sie aus `CANTONAL_IPV` kommt. Das Prüfdatum zeigt, wie alt die Prüfung ist.
  In der Nachprüfung der Werte 2027 (30.11. und 16.12.2026) werden die Wege mitgeprüft.

## 11. Aufwand, geschätzt

| Schritt | Stunden |
|---|---|
| PR 1 · Linkfehler + Linkprüfung | 1–2 |
| PR 2 · Generator, 3 Piloten, Tests, Prüfer | 5–7 |
| PR 3 · 23 Kantone: Text E je Kanton, Prüfer, Hauptseite | 6–9 |
| PR 4 · Brand Book | 1 |
| **Summe Welle 1** | **13–19** |

Der grösste Posten ist Abschnitt E: 26 kurze Texte, jeder gegen das Quellenblatt
geprüft. Das lässt sich nicht beschleunigen, ohne die Prüfung zu schwächen.

**Was Welle 1 nicht verspricht:** mehr Besuche in einer bestimmten Zahl. Eine neue
Seite braucht Wochen, bis Google sie einordnet. Belegt werden kann nach rund 8 Wochen
in der Search Console (Leistung → Seiten, Filter `/praemienverbilligung/`):
Impressionen und Suchanfragen mit Kantonsnamen.
