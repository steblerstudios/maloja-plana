# Messung Systemblick IPV — BAG-Modellhaushalte — 2026-10-24

> Erzeugt mit `node scripts/systemblick-messen.mjs`. Prototyp, **nicht veröffentlichen**, bevor das
> Konzept (`docs/STATISTIK-SYSTEMBLICK.md`) freigegeben und der swiss-precision-pruefer gelaufen ist.

**Haushalte:** die sieben Modellhaushalte aus Ecoplan/BAG, «Wirksamkeit der Prämienverbilligung – Monitoring 2020»,
Mai 2022, S. 12 (Abb. K-2), mit deren Bruttoeinkommen. Von Maloja gesetzt: Geburtsjahre, Kinderalter ganzzahlig,
Netto aus Brutto mit dem App-Richtwert, Rente = AHV-Maximalrente 2026 + BVG-Rest, Franchise 300, kein 13.
**Prämie:** BAG-Durchschnittsprämie 2026 am Hauptort je Person (≈ «Mittlere Prämie» des Monitorings).

**Lesart:** Werte = Prämienverbilligung pro Jahr in CHF, so wie der Maloja-Rechner sie für genau dieses Profil zeigen
würde. Die Kantone rechnen mit ihrem eigenen massgebenden Einkommen — **kein amtlicher Kantonsvergleich**.
`0` = belegt kein Anspruch · `keine Zahl` = das Kantonsmodell zeigt für dieses Profil bewusst keinen Betrag.

## Haushalte, für die Maloja rechnen kann

- **BAG 1 · Alleinstehende Rentnerin** — Rente CHF 45'000/Jahr
- **BAG 3 · Einelternfamilie mit zwei Kindern (3.5 und 5 Jahre)** — Brutto CHF 60'000/Jahr ≈ Netto CHF 4'540/Monat

| Kanton (Hauptort) | BAG1 Verbilligung · Prämie/Mt · Anteil | BAG3 Verbilligung · Prämie/Mt · Anteil |
|---|---:|---:|
| ZH (Zürich) | 1'416 · 488 · 24 % | 4'623 · 760 · 51 % |
| BE (Bern) | 0 · 508 · 0 % | 4'147 · 774 · 45 % |
| LU (Luzern) | 0 · 426 · 0 % | 3'798 · 649 · 49 % |
| UR (Altdorf (UR)) | 543 · 363 · 12 % | 1'946 · 547 · 30 % |
| SZ (Schwyz) | keine Zahl · 398 · — | keine Zahl · 603 · — |
| OW (Sarnen) | 546 · 371 · 12 % | 4'139 · 562 · 61 % |
| NW (Stans) | 900 · 376 · 20 % | keine Zahl · 570 · — |
| GL (Glarus) | 947 · 417 · 19 % | keine Zahl · 633 · — |
| ZG (Zug) | 1'385 · 312 · 37 % | 4'434 · 484 · 76 % |
| FR (Fribourg) | 0 · 470 · 0 % | 4'383 · 714 · 51 % |
| SO (Solothurn) | keine Zahl · 467 · — | keine Zahl · 704 · — |
| BS (Basel) | 312 · 545 · 5 % | 6'876 · 845 · 68 % |
| BL (Liestal) | 0 · 533 · 0 % | keine Zahl · 816 · — |
| SH (Schaffhausen) | 0 · 456 · 0 % | 2'349 · 692 · 28 % |
| AR (Herisau) | 0 · 406 · 0 % | 4'172 · 617 · 56 % |
| AI (Appenzell) | 1'490 · 323 · 38 % | 4'242 · 496 · 71 % |
| SG (St. Gallen) | 0 · 434 · 0 % | 3'784 · 668 · 47 % |
| GR (Chur) | 1'416 · 427 · 28 % | keine Zahl · 656 · — |
| AG (Aarau) | 0 · 440 · 0 % | keine Zahl · 670 · — |
| TG (Frauenfeld) | keine Zahl · 414 · — | keine Zahl · 635 · — |
| TI (Bellinzona) | 0 · 588 · 0 % | keine Zahl · 887 · — |
| VD (Lausanne) | 360 · 537 · 6 % | 5'208 · 828 · 52 % |
| VS (Sion) | 0 · 454 · 0 % | 5'246 · 685 · 64 % |
| NE (Neuchâtel) | 1'320 · 529 · 21 % | 4'776 · 799 · 50 % |
| GE (Genève) | 1'440 · 586 · 20 % | 7'344 · 890 · 69 % |
| JU (Delémont) | keine Zahl · 520 · — | keine Zahl · 776 · — |

| Kennzahl | BAG1 | BAG3 |
|---|---:|---:|
| Kantone mit Betrag | 12 | 16 |
| Kantone ohne Anspruch | 10 | 0 |
| Kantone ohne Zahl | 4 | 10 |
| Tiefster Betrag (CHF/Jahr) | 312 | 1'946 |
| Median Betrag (CHF/Jahr) | 1'134 | 4'313 |
| Höchster Betrag (CHF/Jahr) | 1'490 | 7'344 |
| Median verbilligter Anteil (Kantone mit Zahl, inkl. 0) | 5 % | 52 % |

## Haushalte, für die Maloja heute keine Zahl zeigt

In **allen 26 Kantonen** «keine Zahl». Das ist eine Lücke in Maloja, nicht im System:
- **zwei Erwachsene** — jedes Kantonsmodell bricht ab (`haushalt`, Riegel `mehrereErwachsene`);
- **junge Erwachsene 19–25** — eigene Kategorie in den Kantonen, oft abhängig von einer Ausbildung, nach der die App
  nicht fragt (`alter`, `ausbildung`, `geJungeErwachsene`, `neJeuneAdulte`, `vsJungeErwachsene`).

Betroffen sind 5 von 7 BAG-Modellhaushalten:

- **BAG 2 · Familie mit zwei Kindern (3.5 und 5 Jahre)** — Brutto CHF 70'000/Jahr · Gründe: `haushalt, steuerbaresEinkommen, tgSteuerbetrag`
- **BAG 4 · Familie mit vier Kindern (3.5, 5, 8, 10 Jahre)** — Brutto CHF 85'000/Jahr · Gründe: `haushalt, steuerbaresEinkommen, tgSteuerbetrag`
- **BAG 5 · Familie mit einem Kind (16) und einer jungen Erwachsenen in Ausbildung (20)** — Brutto CHF 70'000/Jahr · Gründe: `haushalt, steuerbaresEinkommen, tgSteuerbetrag`
- **BAG 6 · Alleinstehender junger Erwerbstätiger (24 Jahre)** — Brutto CHF 38'000/Jahr · Gründe: `alter, geJungeErwachsene, steuerbaresEinkommen, neJeuneAdulte, ausbildung, tgSteuerbetrag, vsJungeErwachsene`
- **BAG 7 · Ehepaar ohne Kinder** — Brutto CHF 60'000/Jahr · Gründe: `haushalt, steuerbaresEinkommen, tgSteuerbetrag`

## Warum «keine Zahl» (rechenbare Haushalte)

Grund (Schlüssel aus dem Kantonsmodell) → betroffene Zellen.

- `mindestanspruch` (3×): BL BAG3 · GL BAG3 · NW BAG3
- `steuerbaresEinkommen` (2×): JU BAG1 · JU BAG3
- `soSkalaUnklarFristVorbei` (2×): SO BAG1 · SO BAG3
- `tgSteuerbetrag` (2×): TG BAG1 · TG BAG3
- `szGrenzeMietzinsregion` (1×): SZ BAG1
- `agKinder` (1×): AG BAG3
- `grKinder` (1×): GR BAG3
- `szKinderMindestanspruch` (1×): SZ BAG3
- `tiKinder` (1×): TI BAG3
