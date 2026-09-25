# K123 · AHV-Nummer und Kontaktkarte im QR — Entscheidungsblatt

*Vorbereitet 24.09.2026 auf `main` `5dae403`. Entscheid: Stebler Studios. Keine Rechtsberatung.*

> ✅ **Entschieden 24.09.2026, abends: Option B** (Stebler Studios: «dann b, vielleicht anwählbar
> oder klickbar»). Umgesetzt: Notfall-QR über die Erlaubnisliste `NOTFALL_QR_FELDER`
> (`dossierGenerator.js`, ohne `basis.ahv`; das gedruckte Dossier behält die Nummer), Organspende-QR
> ohne AHV, KK-Karte mit Kästchen «AHV-Nummer in die Codes aufnehmen» — Standard aus, nicht
> gespeichert, für beide KK-Codes. Tests: `k123AhvNurAufWunsch.test.js`, `k123AhvAufrufstelle.test.js`.
> C (Kontaktkarte) bleibt eine eigene Idee für später.

**Die Frage:** Soll die AHV-Nummer in einem QR-Code stehen, den Maloja erzeugt — und wenn ja, in
welchem, und auf wessen Wunsch?

## 1 · Heute-Zustand — gemessen am Code, nicht an der Bauliste

🛑 **Die Bauliste sagt bei K123 «bis dahin unverändert: keine AHV-Nummer im QR». Der Code sagt
etwas anderes:** Ist die AHV-Nummer im Kapitel Basis erfasst, steht sie heute in **drei** QR-Codes,
als offener Text.

| QR | Format | Felder | AHV-Nummer |
|---|---|---|---|
| **Notfall-Dossier** | vCard 3.0, höchstens 640 B | N/FN = Person · TEL = Notfallkontakt · NOTE: Medizin → Kontakt → Vorsorge → Person → Versorgung → Versicherung | **ja, als letzte Zeile** (`dossierGenerator.js` Z. 476; Reihenfolge `NotfallDossier.jsx` Z. 28). Fällt weg, wenn der Platz nicht reicht. |
| **KK-Karte, «lesbar»** | vCard | FN = versicherte Person · NOTE: Versicherer, Kartennummer, AHV, Franchise, Modell | **ja** (`KKScanner.jsx` Z. 36, aus `basis.ahv` vorbelegt Z. 54; Test `kkNotfallQr.test.js` Z. 81 verlangt sie) |
| **KK-Karte, «Übernahme»** | JSON `KK_CARD` | insurer, cardNumber, ahv, franchise, model | **ja** (`kkScanner.js` Z. 112) |
| **Organspende** | vCard | FN · NOTE: Status, Organe, Blutgruppe, AHV | **ja** (`OrganDonation.jsx` Z. 46/51) |
| Flyer | URL | nur die App-Adresse | nein |

Nachgemessen mit `qrNotfallVcard` und erfundenen Musterdaten: mit einem Medikament passt alles
(639 B, AHV drin); mit vier Medikamenten fallen Hausarzt, Spital, Krankenkasse, Kartennummer und
AHV weg. **Ob die Nummer im Notfall-QR steht, hängt also davon ab, wie viel sonst erfasst ist.**

Das Datenfeld ist `basis.ahv` (Kapitel Basis). Angezeigt bzw. ausgegeben wird es ausserdem im
gedruckten Notfall-Dossier, in der Lebensmappe, im Behörden-Dossier (`ahvNumber`), in der
KK-Ansicht und im ZIP-Export. Über allen QR steht der Hinweis «nicht verschlüsselt: Wer ihn
scannt, liest alle Angaben darin» (K101, `notfallDossier.qrHint`).

**Frühere Begründungen:** Eine begründete Entscheidung, die AHV-Nummer *nicht* in den QR zu nehmen,
habe ich in `docs/`, `SESSION_START.md` und den Code-Kommentaren **nicht gefunden**. Belegt ist nur,
dass die Nummer als heikel galt: `qrSicher.js` Z. 15–16 entfernt das `title`-Attribut, weil es einen
«Tooltip mit Gesundheits- und AHV-Daten» zeigte, und #307 (24.09.) ersetzte beim KK-QR «nur diese
App liest ihn» durch «nicht verschlüsselt», weil er «AHV- und Kartennummer als offenen Text» trägt
(`vorabPruefung2409.test.js` Z. 5–6). Die K123-Zeile selbst kam mit #324 (`efe8488`) dazu.

## 2 · Was ein QR anders macht als das Blatt

Ein QR wird auf Papier oder am Bildschirm gezeigt, fotografiert und weitergegeben; jedes Telefon
liest ihn ohne App. Er ist **nicht widerrufbar**: ein ausgedrucktes Exemplar gilt weiter, auch wenn
die Angaben in Maloja geändert werden. Und die Person sieht den Inhalt nicht, nur das Muster.

## 3 · Drei Optionen

**A · So lassen** (AHV in drei QR, sofern erfasst und Platz vorhanden)
- *Nutzen:* eine eindeutige Kennung neben dem Namen. Ob Spital oder Rettung sie aus einem QR
  brauchen, ist **nicht belegt**.
- *Risiko:* Die Nummer liegt offen in einem Code, der fotografiert und weitergegeben wird, bei der
  Organspende zusammen mit Gesundheitsangaben. Im Notfall-QR ist sie zugleich unzuverlässig: sie
  fehlt, sobald mehr erfasst ist.
- *Aufwand:* keiner. Nötig wäre nur, die Bauliste zu berichtigen.

**B · Nur auf ausdrücklichen Wunsch, Standard aus** (Empfehlung, siehe unten)
- *Nutzen:* Datensparsamkeit als Standard; wer die Nummer auf der KK-Karte will, hat sie.
- *Risiko:* gering. Wer den Schalter setzt, entscheidet in Kenntnis des Hinweises.
- *Aufwand:* klein bis mittel: eine Zeile weniger in Notfall- und Organspende-vCard; ein Schalter
  «AHV-Nummer in den Code aufnehmen» an der KK-Karte (lesbarer Code und JSON), Text in 5 Sprachen,
  Sie/Du. *Tests:* eine Erlaubnisliste der NOTE-Felder je QR (nicht «enthält nicht 756», das prüft
  nur das Muster), Standard-aus rot sehen, Mutationsprobe am Schalter; `kkNotfallQr.test.js` Z. 81
  anpassen. Der Rundlauf `parseKKQRCode` darf das Feld weiter lesen.

**C · Kontaktkarte statt/zusätzlich**
- *Heute schon halb da:* Der Notfall-QR **ist** eine vCard, TEL (Notfallkontakt) ist wählbar.
- *Variante:* ein zweiter, kleiner QR nur mit Name + Notfallkontakt (wählbar), ohne Gesundheit und
  ohne AHV — für Schlüsselbund oder Sperrbildschirm, wo man nicht alles zeigen will.
- *Nutzen:* die Angabe, die im Notfall am schnellsten wirkt, ohne alles andere preiszugeben.
- *Risiko:* gering; neu wäre nur die Telefonnummer einer dritten Person im Umlauf.
- *Aufwand:* mittel (zweite Fläche, Texte in 5 Sprachen, Kamera-Probe wie K121 an echtem Gerät).
  Unabhängig von der AHV-Frage.

## 4 · Empfehlung (Entscheid bleibt bei Stebler Studios)

**B.** Die AHV-Nummer steht ohnehin auf der Versichertenkarte, die der Versicherer bedrucken muss
(VVK Art. 3 Abs. 1 Bst. b). Einen belegten Notfallnutzen, der das aufwiegt, habe ich nicht
gefunden. Standard aus heisst: nichts Heikles liegt im Code, ohne dass es jemand gewollt hat. C ist
eine gute, eigene Idee für später und braucht diesen Entscheid nicht.

## 5 · Quellen — belegt / nicht belegt

**Belegt, an der Quelle gelesen (Fedlex, im Browser gerendert, 24.09.2026; Gegenprobe mit
erfundener Adresse → «Seite nicht gefunden»):**
- AHVG (SR 831.10, Stand 1.1.2026) Art. 50c: Zuweisung der AHV-Nummer. Art. 153b: «systematisch»
  heisst, die Nummer wird mit Personendaten verbunden und «in strukturierter Form gesammelt».
  Art. 153c Abs. 1: berechtigt sind nur Behörden, mit Verwaltungsaufgaben Betraute, Bildungs-
  institutionen, Privatversicherer nach VVG Art. 47a und GAV-Kontrollorgane. Art. 153i Abs. 1:
  unberechtigte systematische Verwendung wird mit Geldstrafe bestraft. Die Änderung «Systematische
  Verwendung der AHV-Nummer durch Behörden» gilt seit 1.1.2022 (Fussnote 258).
- VVK (SR 832.105, Stand 1.1.2023) Art. 3 Abs. 1 Bst. b: AHV-Nummer ist auf der Versichertenkarte
  aufgedruckt. Art. 6 Abs. 1 Bst. h: Kontaktadressen für den Notfall können mit Einwilligung
  elektronisch auf der Karte gespeichert werden.
- DSG (SR 235.1, Stand 7.7.2025) Art. 5 Bst. c Ziff. 2: Gesundheitsdaten sind besonders
  schützenswert. Die AHV-Nummer ist dort **nicht** aufgezählt.

**Nicht belegt:**
- Wofür Spital oder Rettungsdienst die AHV-Nummer im Notfall konkret brauchen. Keine Quelle gelesen.
- Ob sich eine AHV-Nummer ändern lässt, wenn sie bekannt geworden ist. Nicht gelesen.
- DSG Art. 2 Abs. 2 Bst. a (persönlicher Gebrauch): nur aus `k48-fragen-juristin.md` C0 übernommen,
  heute nicht an der Quelle gelesen.

**Fragen für die Juristin** (zur Aufnahme in `docs/legal/k48-fragen-juristin.md`):
1. Ist es eine «systematische Verwendung» im Sinne von AHVG Art. 153b, wenn eine App die Nummer mit
   Personendaten strukturiert **auf dem Gerät der Person** speichert und in einen QR schreibt, ohne
   dass die Anbieterin sie je sieht? Wer wäre dann «Verwender»?
2. Verlangt die Datensparsamkeit (DSG), die Nummer standardmässig **nicht** in einen weitergebbaren
   Code zu schreiben, wenn die Person sie selbst erfasst hat?
