# Grundstück & zwei Modi — die visuelle Vision

> **Status:** Vision / Design-Kanon (noch nicht gebaut). Diese Datei ist die *eine*
> Quelle für die räumliche Metapher und das Verhältnis von Normal- zu Spiel-Modus.
> Bei Widerspruch zu älteren Skizzen gilt diese Datei.
>
> **Verankert an:** [`../archive/concepts/spinnennetz/life-web-concept.md`](../archive/concepts/spinnennetz/life-web-concept.md)
> (die „alles hängt zusammen"-Idee) · [`ipv-lebenslinie.md`](ipv-lebenslinie.md)
> (das Lebenslinie-Muster) · [`../brand/icon-dictionary.md`](../brand/icon-dictionary.md)
> (Icon-Kanon) · Governance: `maloja-feature-governance`.
>
> **Stand:** 2026-07-13

---

## 0 · Der bewusst aufgelöste Konflikt (zuerst lesen)

Das frühere Konzept (`spinnennetz/life-web-concept.md`) hält als Prinzip fest:
**„Nicht: aggressiv · gamifiziert · social media artig · kompliziert."**

Diese Vision *präzisiert* dieses Prinzip, statt es zu brechen. Der Schlüssel ist die
Trennung von **Substanz** und **Spiel-Haut**:

| | gehört wohin | Ton |
|---|---|---|
| **Momentum, Missionen, sichtbarer Fortschritt** | in den **Kern** (Normal-Modus), immer an | ruhig, erwachsen, nüchtern |
| **Verspielte Welt** (Grundstück, Baracke→Villa, Metapher-Icons) | **opt-in Layer** obendrauf | warm, spielerisch, jederzeit abschaltbar |

**Was „gamifiziert" nie heissen darf** (bleibt Anti-Pattern):
Wettbewerb · Vergleich mit anderen · Ranglisten · Punkte-Hetze · Dopamin-Zwang ·
Sucht-Mechanik · Scham bei „wenig Fortschritt".

**Was Momentum sehr wohl heissen darf** (erwünscht):
sinnvolle nächste Schritte · sichtbare Vollständigkeit des eigenen Lebensordners ·
kleine, ruhige „geschafft"-Momente · das Gefühl, *weiterzukommen*.

**Die Wettbewerbs-Leitplanke:** Fortschritt wird **immer nur gegen dich selbst**
gemessen (die Vollständigkeit deines eigenen Lebens), **nie gegen andere Menschen.**
Das ist auch der Grund, warum die Freunde-/Dorf-Idee bewusst geparkt ist (§7).

**Die Demografie-Leitplanke:** Der Standard ist erwachsen und ernst. Das Spiel ist
ein *Geschenk*, keine Voraussetzung. Ein 68-Jähriger, der die Spiel-Haut nie
einschaltet, verliert **nichts** — er bekommt dasselbe Momentum in nüchterner Form.
So deckt die App die breiteste Demografie ab: niemand fühlt sich ausgeschlossen,
weil es „zu kindisch" ist, und niemand fühlt sich gehetzt.

---

## 1 · Die vereinte Metapher: ein Grundstück in der Berglandschaft

Bisher konkurrieren zwei Bilder: die **Berge** und der **Obstgarten/Baum**. Die
Auflösung ist nicht „verschmelzen", sondern **schachteln**:

- **Der Berg = die Welt / Kulisse / der Horizont.** Das grosse Umfeld: das Engadin,
  die lange Zeitachse (Pensionierung, AHV-Horizont). Landschaft, nicht Besitz.
- **Dein Grundstück liegt darin.** Es ist *dein* Besitz, den du aufbaust: das Haus
  (Administration & Schutz) plus der Garten mit dem Obstbaum (Wachstum über Zeit).

Damit sind Berg und Obstgarten **vereint statt im Widerstreit** — das eine ist
Landschaft, das andere Besitz.

### Haus-Mapping

| Bauteil | Lebensbereich | Warum |
|---|---|---|
| **Eingangstür** | Passwörter / Sicherheit | wird stabiler, je aufgeräumter — Checkliste + Empfehlung |
| **Dach** | Versicherungen | „ein Dach überm Kopf" = Schutz |
| **Wände / Fundament** | Basis (AHV, Identität, Zivilstand) | trägt alles andere |
| **Zimmer** | Lebenskapitel (Wohnen, Finanzen, Ausbildung, Behörden, Notfall) | jedes Kapitel = ein Raum, den man betritt |
| **Fenster** | Ausblick / Transparenz | Übersichten, Vergleiche, Lebenslinien — der Blick nach vorn |
| **Bücherregal (Wohnzimmer)** | Alltags-Dokumente | griffbereit, im gemeinsamen Raum |
| **Tresor** | verschlüsselte Sensible | der `cryptoCore`/`secureStore` (heute *dormant*, s. `tresor-lock.md`) |
| **Garage** | Fahrzeug-Finanzierung | steht gut/schlecht je nach Lage (§5) |
| **Garten / Obstbaum** | Wachstum über Zeit | Sparen, 3. Säule, Vermögen — wächst, trägt Früchte |

> Existierende Keime im Code: `Obstgarten.jsx`, `Frucht*.jsx`, `IconSystem.jsx`,
> `Fuehrerausweis.jsx`, `Heirat.jsx`, `UmzugAblauf.jsx`, `Lebenssituationen.jsx`,
> `AblaufSchale.jsx`. Wir *verdrahten und benennen* — wir bauen nicht bei null.

---

## 2 · Die zwei Modi

**Normal-Modus (Standard, immer vollständig)**
Ruhig, erwachsen, editorial. Momentum ist *sichtbar, aber nüchtern*:
„3 von 5 Schritten erledigt · als Nächstes: Hausrat prüfen." Kein Bild nötig.
Wer nie umschaltet, hat eine vollständige, würdevolle App.

**Grundstück-Modus (opt-in, jederzeit aus)**
Dieselben Daten als Welt: Haus, Garten, Obstbaum, Wetter, Aufbau. Dieselben
Missionen — nur als sichtbaren Ort statt als Liste. Nie Pflicht, nie Scham.

**Regel:** Die beiden Modi zeigen *identische Daten und identische Missionen*.
Nur die Erzählung unterscheidet sich. Der Toggle ändert die Haut, nie die Substanz.

---

## 3 · Momentum ohne Wettbewerb (die Mechanik)

- **Missionen = die nächsten sinnvollen Schritte.** Sie sind die Lebenslinien aus
  `spinnennetz` und `ipv-lebenslinie.md` in Handlungsform (z. B. „Umzug: KK-Adresse
  melden → Prämienverbilligung neu prüfen").
- **Fortschritt = Vollständigkeit deines eigenen Lebensordners.** Nie gegen andere.
- **„Die App catcht" = Klarheit + kleines Weiterkommen**, nicht Sucht. Jeder erledigte
  Schritt macht das nächste Stück Leben ruhiger — das ist die Belohnung, nicht ein Punkt.

---

## 4 · Baracke → Villa, ohne Scham

Der Aufbau vom einfachen zum reichen Grundstück ist **charmant für Menschen mit
Rücklagen — und gefährlich für Menschen in Schulden, Arbeitslosigkeit, Sozialhilfe.**
Für sie darf „Baracken-Modus" nie heissen: „dein Leben sieht ärmlich aus."

**Leitplanken:**
- Die Baracke ist ein **warmer Startpunkt**, kein Urteil. „Hier fängt jeder an. Das
  ist dein Fundament."
- Fortschritt ist **Aufbauen**, nie Bewertung. Keine Wertung „arm/schlecht", nur „als Nächstes".
- Eine leere Garage macht das Haus nicht „ärmlich". Kein Bauteil beschämt ein anderes.
- Sprache immer nach `maloja-writing-language` / `maloja-administrative-psychology`:
  Würde zuerst.

---

## 5 · Anschaffungs-Lebenslinien (das Auto/Garage-Muster)

Man „hat" nicht einfach ein Auto. Man kommt auf zwei Wegen dazu — und beide sind
ehrliche, nicht-moralische Budget-Führung (`maloja-budget-philosophy`):

1. **Man besitzt schon eins.** Die Garage spiegelt die Finanzierungslage (gut/knapp).
2. **Man möchte eins.** Dann *zuerst die Garage bauen* = Leistbarkeit vorrechnen →
   Checkliste abarbeiten → erst dann anschaffen. Danach steht es in Maloja.

Dasselbe Muster für **Velo, Töff, Führerausweis** (`Fuehrerausweis.jsx` existiert;
Fahrprüfungs-Schritte + Kosten als Tacho/Anzeige — *Phase-später*). Ein
wiederverwendbares „Anschaffungs-Lebenslinie"-Muster, kein Einzelfall.

---

## 6 · Icons (verankert an `icon-dictionary.md`)

- **Heirat** = Ringe · **Umzug** = Chalet mit Pfeil · **Versicherung** = Schild mit
  dem jeweiligen Symbol (Auto = Auto, Krankenkasse = Kreuz, Reise = Flugzeug).
- **Copyright-Leitplanke:** Reise-/Flug-Stimmung nur mit **generischem** Flugzeug- oder
  Alpen-Symbol. **Kein** Airline-Logo, keine Marke (auch nicht Edelweiss). Die
  Schweizer-Reise-Stimmung entsteht ohne Markenrisiko.

---

## 7 · Bewusst NICHT in dieser Vision (geparkt)

**Freunde-Dörfer / Code teilen / einander sehen (Schrebergarten-Idee).**
Doppelter Konflikt: mit „nicht social media artig" *und* mit local-first/Privacy
(es gibt keinen Server, der Dörfer hält). Wenn überhaupt, nur als *freiwillig
exportierte Schau-Ansicht* — ein eigenes, grosses Governance-Kapitel, nicht Teil
dieser Vision.

---

## 8 · Nächste Bausteine (nur Reihenfolge — nicht jetzt bauen)

1. **Momentum im Kern** (Normal-Modus): Missionen/Fortschritt als ruhige, erwachsene
   Anzeige. Deckt die ganze Demografie ab, bevor irgendeine Spiel-Haut existiert.
2. **Grundstück-Modus als Toggle**: Haus-Mapping (§1) visuell, opt-in, abschaltbar.
3. **Baracke→Villa mit den Scham-Leitplanken** (§4) — live-verifiziert als *eine* Einheit.
4. **Anschaffungs-Lebenslinien** (§5) auf `Fuehrerausweis.jsx` & Co. aufsetzen.
5. **Fahrprüfungs-Tacho** und weitere verspielte Details — zuletzt.

> Jede Phase folgt der Governance: `feat/…` → `--stage` → PR → Deploy nur mit
> Nutzer-Freigabe. Keine Spiel-Haut ohne dass der Normal-Modus allein vollständig ist.
