# Vorgänge 1.0 (O12) — Entwurf, gegen den Code gelegt

**Stand:** 22.09.2026 · **gemessen gegen:** `main` = `2f15946`, Arbeitsbaum sauber
**Anlass:** ein Fremd-Entwurf (Chat) für „Vorgänge 1.0". Dieses Blatt ist **nicht** die
Abschrift jenes Entwurfs, sondern das, was nach der Messung davon übrig bleibt — plus fünf
Korrekturen und **eine Entscheidung, die nur Stebler Studios fällen kann**.

Verwandt: `docs/BAULISTE-2026-09-30.md` §8.2 (O12, O7, O13, O19) · `docs/product/dashboard-flow-analyse.md`

---

## 1 · Was gemessen wurde (nicht angenommen)

| Messung | Ergebnis |
|---|---|
| Abläufe auf der `AblaufSchale` | **20** Dateien |
| davon mit *irgendeinem* lokalen Zustand | **4** (`UmzugAblauf`, `KVGWechsel`, `SchuldenManager`, `NotfallVorlesekarte`) |
| `UmzugAblauf.jsx` | 163 Zeilen · zwei `useState` (`umzugType` Z. 31, `added` Z. 56) · beide sterben beim Verlassen |
| Frist heute | `const deadline = inDays(14)` (Z. 25) — 14 Tage **ab heute**, nicht ab Umzugsdatum |
| `CURRENT_DATA_VERSION` | **4** (`src/utils/dataMigration.js:12`) |
| `src/domain/`, `src/storage/` | **existieren nicht** |
| Gepäck | `src/data/gepaeck.js` (98 Z.) + `src/Gepaeck.jsx` (210 Z.) — echte Registry mit ehrlicher Reife aus der Lebensmappe |
| direkte `localStorage`-Zugriffe (ohne Tests) | **141** (O5) |
| Testdateien | 83 unter `src/__tests__/` |

**Die wichtigste Einzelmessung:** 19 der 20 Abläufe sind reine, zustandslose Führungsseiten.
Nur der Umzug hat überhaupt eine Wahl, die verloren gehen kann. Der Fremd-Entwurf beginnt
deshalb zu Recht beim Umzug — aber aus dem falschen Grund: nicht weil Umzug der reichste
Ablauf ist, sondern weil er der **einzige mit Zustand** ist.

---

## 2 · Was der Fremd-Entwurf richtig sieht

Kurz, weil es stimmt und keine Nacherzählung braucht:

- Klein anfangen, keine Process Engine, keine BPMN, kein Workflow-Editor.
- Drei Status (`draft` · `active` · `completed`), nicht sieben.
- `applicability` (`applicable` · `notApplicable` · `unknown`) **getrennt** von Erledigt-Status.
  Das ist derselbe Gedanke wie O9 („trifft nicht zu" ≠ „noch offen") und deshalb konsistent.
- Aufgaben aus **Regeln** erzeugen, nicht mit `if` an zwanzig Stellen.
- Die Lebensmappe nicht nochmals fragen, was sie schon weiss.
- Migration **langweilig** halten: keine Rückwirkung auf Altdaten, kein Erraten früherer Umzüge.
- Fristen an `effectiveDate` hängen statt an „heute". Das behebt einen echten, im Code
  belegten Fehler (`UmzugAblauf.jsx:25`).

Diese sieben Punkte werden übernommen.

---

## 3 · Fünf Korrekturen

### K1 — Keine neuen Ordner `src/domain/` und `src/storage/`

Der Entwurf schlägt `src/domain/processes/…` und `src/storage/processRepository.js` vor.
Beide Ordner gibt es nicht; das Repo ordnet nach `src/data/` (datenfrei, deterministisch,
testbar), `src/utils/` (Schreib-APIs), `src/components/`, `src/hooks/`, `src/config/`.

**Stattdessen, im bestehenden Muster:**

```
src/data/vorgaenge.js      Registry + Regeln  ← wie src/data/gepaeck.js
src/utils/vorgaenge.js     Schreibweg
```

Ein zweiter Satz Konventionen neben dem bestehenden läuft still auseinander. Das ist dieselbe
Falle wie „zwei Quellen für eine Wahrheit", nur eine Ebene höher.

> **Nachtrag beim Bauen, 22.09.:** der Schreibweg darf **nicht** dem Muster von
> `utils/merkliste.js` folgen. Die Merkliste hat einen eigenen Schlüssel und schreibt direkt;
> `or5_data` dagegen wird per Autosave aus dem React-Zustand geschrieben
> (`main.jsx:679`, Intervall). Ein direkter Schreibzugriff von aussen würde bei der nächsten
> Runde **still überschrieben** und erst beim Neuladen als Verlust sichtbar.
> Deshalb sind alle Funktionen in `utils/vorgaenge.js` **rein**: `data` hinein, neues `data`
> hinaus, die Oberfläche reicht es an `setData` weiter — wie jedes Kapitel-Feld.
> Nebenwirkung: **null** neue direkte `localStorage`-Zugriffe (O5).

### K2 — Kein neuer `or5_`-Schlüssel. Die Vorgänge gehören **in `or5_data`**.

Der Entwurf lässt offen, wo gespeichert wird. Gemessen: ein neuer oberster Schlüssel
(`or5_vorgaenge`) müsste an **sieben** Stellen nachgetragen werden, sonst fällt er still aus
Sicherung, Wiederherstellung und Tresor:

| Datei | Stelle |
|---|---|
| `src/utils/backupCrypto.js` | Z. 40 (Doku), Z. 61 (Sicherung), Z. 254 (Wiederherstellung) |
| `src/utils/secureStore.js` | `TRESOR_STORES` (Z. 41) |
| `src/utils/prerestore.js` | Schlüsselliste (Z. 15) |
| `src/components/ExportVorschau.jsx` | Z. 53 |
| `src/utils/autoBackup.js` | Z. 124, 299, 390 |
| `src/utils/dataValidation.js` | eigene Form-Prüfung |
| `src/utils/datenLoeschen.js` | **greift automatisch** (`or5_`-Präfix, Z. 42) ✓ |

Liegen die Vorgänge dagegen als `data.vorgaenge` **in `or5_data`**, sind Sicherung,
Wiederherstellung, Tresor, Export, Auto-Backup und Löschen **ohne eine einzige weitere Zeile**
abgedeckt — und die vom Entwurf vorgeschlagene Migration **v4 → v5** wird damit erst zum
richtigen Werkzeug. Gegengeprüft: `validateData` (`dataValidation.js:48–58`) **entfernt
unbekannte oberste Felder nicht** („they may be from future versions"), das Feld überlebt also
auch eine Validierung.

> Der Entwurf kommt bei §12/§13 zum richtigen Ergebnis (v5 + `processes: []`) — aber nur, wenn
> die Vorgänge in `or5_data` liegen. Läge ein eigener Schlüssel daneben, wäre eine
> `or5_data`-Migration schlicht der falsche Ort.

### K3 — Der Fahrplan hat den Ort der Persistenz schon: die `AblaufSchale`

Der Entwurf plant „erst ein richtig guter Umzug, dann prüfen wir die Abstraktion an einem
zweiten Vorgang". In diesem Repo ist die gemeinsame Schale bereits gebaut
(`src/AblaufSchale.jsx`, 83 Zeilen, 20 Nutzer). Der Naht­punkt liegt also dort, nicht in
`UmzugAblauf.jsx`.

**Für V1 ändert das nichts am Umfang** — verdrahtet wird nur der Umzug. Es ändert, wo der
Haken sitzt: ein `vorgangId`-Prop an der Schale, nicht eine Sonderlösung im Umzug.

### K4 — Gepäck ist keine Metapher, sondern eine Registry

Der Entwurf schreibt, Gepäck bekomme „endlich ein echtes Domainmodell". Gemessen:
`src/data/gepaeck.js` ist bereits eine deterministische Registry (6 Gegenstände, 19 Wege) mit
**ehrlicher** Reife aus echten Lebensmappe-Feldern (`gegenstandReadiness`, Z. 93). Der aktive
Vorgang ist dort eine **Ergänzung einer bestehenden Ansicht**, kein neues Modell.

### K5 — Der Umzugs-Typ „Ausland" fehlt in beiden Entwürfen

`UmzugAblauf.jsx:86–88` kennt drei Typen (`gemeinde`, `kanton`, `extra` = anderer Kanton).
`docs/BAULISTE-2026-09-30.md` (O12) nennt ausdrücklich vier: *„innerhalb der Gemeinde,
anderer Kanton, Ausland"*. Zuzug aus dem Ausland ist heute nur als Crosslink abgebildet
(`Z. 102`, KK-Erstanmeldung). **V1 bildet die drei bestehenden Typen ab** — „Ausland" wird
hier als bekannte Lücke notiert, nicht stillschweigend übergangen.

---

## 4 · Die eine Entscheidung (Stebler Studios)

**Der Fremd-Entwurf erwähnt sie nicht, und sie entscheidet über die ganze Bauweise.**

Es gibt heute zwei bewusst getrennte Listen:

| Ort | Was | Regel |
|---|---|---|
| `or5_merkliste` | offene Punkte eines Ablaufs | `{id, text, link, done}` — **bewusst ohne Frist** (`merkliste.js:2`) |
| `or5_reminders` | der Kalender | mit `dueDate`, `category`, `recurrence` |

Der Entwurf gibt seinen Aufgaben **beides** (`status: open/done` **und** `dueDate`) — also eine
dritte Liste, die genau das führt, was die beiden anderen schon führen. Und der Umzug schreibt
heute bereits acht Merkpunkte (`UmzugAblauf.jsx:57–65`). Ungeklärt hiesse: dieselbe Sache
zweimal, an zwei Orten abhakbar, in zwei Zuständen.

**Empfehlung — der Vorgang *verweist*, er *kopiert nicht*:**

```js
// Aufgabe im Vorgang
{
  key: 'einwohnerkontrolle',
  applicability: 'applicable',
  todoId: 'm1758…',      // → or5_merkliste
  reminderId: 'r1758…',  // → or5_reminders
}
// erledigt wird NICHT gespeichert, sondern abgeleitet:
const done = todos.find(t => t.id === task.todoId)?.done === true;
```

Damit:

- bleibt die Merkliste **die eine** Liste offener Punkte — keine neue Oberfläche,
- bleibt der Kalender **der eine** Ort für Fristen — die Regel aus `merkliste.js:2` hält,
- gibt es **keinen Abgleich** zwischen zwei Erledigt-Zuständen, weil es nur einen gibt,
- und der Vorgang beantwortet genau das, was heute fehlt: *Art · Datum · gestartet am ·
  4 von 9 · nächster Schritt.*

*Die Alternative — Aufgaben als eigene, vollwertige Liste — ist nicht falsch, aber sie macht
Merkliste und Kalender zu Nebenschauplätzen. Das wäre ein Produktentscheid, kein technischer.*

---

## 5 · Modell für V1 (nach den Korrekturen)

```js
// data.vorgaenge[] in or5_data
{
  id: crypto.randomUUID(),
  typ: 'umzug',
  status: 'active',              // draft · active · completed
  gestartetAm: '2026-09-22T…',
  geaendertAm: '2026-09-22T…',
  stichtag: '2026-11-01',        // effectiveDate — das Lebensereignis
  kontext: { umzugType: 'extra' },
  aufgaben: [
    { key: 'einwohnerkontrolle', applicability: 'applicable', todoId: null, reminderId: null },
  ],
}
```

Kein `documentIds`/`evidenceIds` in V1 — das ist O13 und hat noch kein Gegenstück im Tresor.
Kein `from`/`to`-Adressobjekt: die Adresse steht in der Lebensmappe (`data.wohnen`), und sie
dort zu spiegeln wäre die zweite Quelle für dieselbe Wahrheit.

**Frist:** `stichtag + 14 Tage` (Anmeldung bei der neuen Gemeinde). Liegt der Stichtag in der
Vergangenheit, wird **keine** Frist in die Zukunft erfunden — dann steht dort ein ruhiger
Hinweis, kein Verdikt. Eine zweite Frist für die *Abmeldung* wird **nicht** erfunden; sie ist
kantonal verschieden und hat im Repo keine Quelle.

---

## 6 · Bau-Reihenfolge

| | Schritt | Grösse | Stand |
|---|---|---|---|
| V1 | `src/data/vorgaenge.js` (Registry + Umzugs-Regeln) + Tests — **ohne UI** | S | ✅ 22.09. |
| V2 | `src/utils/vorgaenge.js` — reine Funktionen auf `data` (s. Nachtrag K1) | S | ✅ 22.09. |
| V3 | Migration **v4 → v5**: `vorgaenge: []`, sonst nichts | S | ✅ 22.09. |
| V4 | Startbild „Umzug starten" (Datum + Typ) | M |
| V5 | `UmzugAblauf` an den Vorgang hängen (`useState` → Vorgang) | M |
| V6 | Aufgaben verweisen auf Merkliste/Kalender (§4) | M |
| V7 | Gepäck zeigt den aktiven Vorgang | S |
| V8 | Sicherung · Wiederherstellung · Export · i18n (5 Sprachen) · Tastatur | M |

V1–V3 sind reine Domänen- und Speicherarbeit, vollständig testbar **ohne** eine Zeile UI.
Bricht das Vorhaben nach V3 ab, ist nichts halb Gebautes in der Oberfläche sichtbar.

**Abweichung vom eigenen Fahrplan, bewusst:** `BAULISTE §8.2` notiert für O12 „kommt nach O3"
(Ergebnis-Arten). O3 betrifft **Rechner**-Ergebnisse (Berechnung · Schätzung · Vorprüfung);
Vorgangs-Aufgaben sind keine Rechner-Ergebnisse. O12 kann deshalb vor O3 laufen — aber das ist
eine Abweichung und steht hier, statt unbemerkt zu passieren.

---

## 7 · Fertig heisst (gekürzt gegenüber dem Entwurf)

Der Fremd-Entwurf listet 20 Punkte. Vier davon sind in diesem Repo **keine Arbeit**, sondern
Folge von K2 — sie werden hier nicht als Aufgabe geführt, damit die Liste ehrlich bleibt:
Export enthält den Vorgang · Wiederherstellung stellt ihn her · alte Sicherungen bleiben
importierbar · kein neuer direkter `localStorage`-Zugriff.

Es bleiben:

- [ ] Vorgang lässt sich bewusst starten; Datum und Typ überleben das Schliessen der Seite.
- [ ] Aufgaben werden deterministisch aus Regeln erzeugt (Test).
- [ ] Nicht anwendbare Aufgaben zählen nicht als offen (Test).
- [ ] Frist hängt am Stichtag, nicht an „heute" (Test).
- [ ] Fortschritt ist gezählt, nicht geschätzt (Test).
- [ ] Vorgang erscheint im Gepäck und lässt sich abschliessen.
- [ ] Abgeschlossener Vorgang bleibt lesbar.
- [ ] Migration v4 → v5 getestet, Altdaten unberührt.
- [ ] DE/FR/IT/EN vollständig; RM bekommt keine neuen **unmarkierten** Lücken.
- [ ] Tastatur und Screenreader auf dem Startbild.

## 8 · Ausdrücklich nicht

Cloud · Konten · Behörden-Schnittstellen · automatisches Einreichen · KI · Workflow-Editor ·
frei konfigurierbare Prozessdefinitionen · 20 Lebensereignisse auf einmal · Dokumente und
Nachweise am Vorgang (das ist O13) · „Nächster Schritt" (das ist O7, und es kommt **nach** V8).

---

*Angelegt 22.09.2026 nach Messung gegen `2f15946`. Der Fremd-Entwurf selbst liegt nicht im
Repo — was von ihm gilt, steht hier.*
