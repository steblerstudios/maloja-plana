# SKOS-Vermögensfreibetrag 2026 — Kantons-Übersicht mit Quellen

**Zweck:** Die App rechnet aktuell für **alle** Kantone mit derselben Zahl
(`vermoegensfreibetragSKOS` in `src/data/sozialhilfeRechner.js`, Stand dieser
Recherche: 6'000 CHF Einzelperson / 12'000 CHF Paar / +3'000 CHF je
minderjähriges Kind / Deckel 15'000 CHF). Die SKOS-Übersichtskarte zeigt aber
**26 unterschiedliche kantonale Werte**. Dieses Dokument hält fest, welcher
Betrag pro Kanton laut Karte gilt, und prüft ihn — wo möglich — gegen die
kantonale Rechtsgrundlage.

**Wahrheits-Regel:** Jede Zahl mit Quelle und Abrufdatum. Wo keine amtliche
kantonale Quelle gefunden wurde, steht das explizit da — der Kartenwert gilt
dann nur als «laut SKOS-Übersicht», nicht als kantonal geprüft.

---

## Schritt 1 — Die SKOS-Karte ausgelesen

**Quelle:** SKOS, «Höhe des Vermögensfreibetrags — Übernahme empfohlen
spätestens per 1.1.2026», Stand 1.1.2026.
<https://skos.ch/fileadmin/user_upload/skos_main/public/pdf/richtlinien/260101_Vermoegensfreibetrag.pdf>
— abgerufen 16.09.2026.

**Methode:** Die Karte enthält keine Textwerte pro Kanton, nur eine
eingefärbte Schweizer-Karte mit einer Farblegende. Die Kantons-Zuordnung
wurde daher aus den **Füllfarben** der Kantonsflächen gelesen, nicht aus
Text:

1. PDF mit `pdftoppm -r 300` verlustfrei als PPM (roh, 3000×2250 px)
   gerendert (keine erneute Kompression, keine Farbraum-Umrechnung).
2. Mit einem kleinen Python-Skript (nur Standardbibliothek, kein zusätzliches
   Paket) für jeden der 26 Kantone und für jedes der 9 Legenden-Rechtecke ein
   kleines Pixel-Raster um eine Punktkoordinate innerhalb der Fläche
   abgetastet, Text-/Rand-Pixel (nahe Schwarz/Weiss) verworfen und die
   häufigste Restfarbe (Modus) genommen.
3. Jede Kantonsfarbe gegen die 9 Legendenfarben per euklidischem
   Farbabstand zugeordnet (Distanz 0–8 bei allen 26 Kantonen — eindeutige
   Treffer, keine Grenzfälle).
4. Gegenprobe: Summe der 26 Zuordnungen ergibt exakt die Legenden-Stückzahlen
   (1+2+1+1+3+2+14+1+1 = 26) — die Zuordnung ist in sich konsistent.
5. Sichtprüfung: alle Grenzfälle (AR/AI/SG, BS/TI) zusätzlich mit
   gezoomten Kartenausschnitten von Auge bestätigt.

Gelesene Legendenfarben (RGB, aus der Karte):

| Betrag laut Karte | RGB | Anzahl Kantone |
|---|---|---|
| CHF 1'500 | (255,245,204) | 1 |
| CHF 2'000 | (255,235,153) | 2 |
| CHF 2'200 | (255,224,102) | 1 |
| CHF 2'500 | (213,240,209) | 1 |
| CHF 4'000 | (179,215,173) | 3 |
| CHF 4'000 «Erhöhung in Diskussion» | (146,208,80) | 2 |
| CHF 6'000 | (130,210,118) | 14 |
| CHF 8'000 | (75,134,66) | 1 |
| CHF 10'000 | (65,155,51) | 1 |

**Ergebnis — Kanton → Betrag laut SKOS-Karte:**

| Kanton | Betrag laut Karte | Anmerkung Karte |
|---|---|---|
| AG | CHF 1'500 | |
| SH | CHF 2'000 | |
| SO | CHF 2'000 | |
| BL | CHF 2'200 | |
| SG | CHF 2'500 | |
| NE | CHF 4'000 | |
| BE | CHF 4'000 | |
| FR | CHF 4'000 | |
| VD | CHF 4'000 | «Erhöhung in Diskussion» |
| GE | CHF 4'000 | «Erhöhung in Diskussion» |
| JU | CHF 6'000 | |
| ZH | CHF 6'000 | |
| TG | CHF 6'000 | |
| AR | CHF 6'000 | |
| AI | CHF 6'000 | |
| ZG | CHF 6'000 | |
| SZ | CHF 6'000 | |
| LU | CHF 6'000 | |
| NW | CHF 6'000 | |
| GL | CHF 6'000 | |
| OW | CHF 6'000 | |
| UR | CHF 6'000 | |
| GR | CHF 6'000 | |
| VS | CHF 6'000 | |
| BS | CHF 8'000 | |
| TI | CHF 10'000 | |

**Wichtige Einschränkung:** Die Karte zeigt pro Kanton nur **eine** Zahl,
ohne Beschriftung, ob es sich um den Betrag für Einzelpersonen, Paare oder
sonst eine Bezugsgrösse handelt. Angenommen wird — analog zur SKOS-Systematik
und zur App-Logik — dass es sich um den **Grundbetrag für Einzelpersonen**
handelt. Diese Annahme wird unten je Kanton, wo eine kantonale Quelle
vorliegt, gegengeprüft.

---

## Schritt 2 — Kantonale Prüfung

Status-Legende: ✅ kantonal belegt (amtliche Quelle mit Zahl) ·
⚠️ nur SKOS-Karte, keine amtliche kantonale Einzelquelle gefunden ·
🔍 in Arbeit.

| Kanton | Einzel | Paar | je Kind | Max | Quelle | Art der Quelle | Status |
|---|---|---|---|---|---|---|---|
| _wird in den folgenden Commits ergänzt_ | | | | | | | 🔍 |

*(Tabelle wird nach Kanton befüllt; siehe Zitate weiter unten je Kanton.)*

---

## Zitate je Kanton

*(wird ergänzt)*

---

## Die SKOS-Empfehlung selbst (+3'000/Kind, Deckel 15'000)

*(wird ergänzt — Recherche nach der aktuellen SKOS-Richtlinie D.3.1 bzw.
ihrer aktuellen Nummerierung läuft.)*

---

## Folge für die App

*(wird nach Abschluss der kantonalen Prüfung ergänzt: welche Kantone von den
aktuell einheitlich verwendeten 6'000/12'000 abweichen, und in welche
Richtung.)*
