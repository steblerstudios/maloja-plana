# Messung Systemblick IPV — 2026-10-24

> Erzeugt mit `node scripts/systemblick-messen.mjs`. Prototyp, **nicht veröffentlichen**, bevor das
> Konzept (`docs/STATISTIK-SYSTEMBLICK.md`) freigegeben und der swiss-precision-pruefer gelaufen ist.
> Werte = Prämienverbilligung pro **Jahr** in CHF, so wie der Maloja-Rechner sie für genau dieses
> Profil zeigen würde. Die App rechnet mit dem Nettolohn ×12, die Kantone mit ihrem eigenen
> massgebenden Einkommen — darum ist das **kein amtlicher Kantonsvergleich**.

Legende: Zahl = Verbilligung · `0` = belegt kein Anspruch · `keine Zahl` = das Kantonsmodell zeigt
für dieses Profil bewusst keinen Betrag (Grund in der Fussnote).

## Eine erwachsene Person, erwerbstätig

Prämie Haushalt: CHF 450 pro Monat · Nettolohn pro Monat, ohne 13.

| Kanton (Hauptort) | Netto 2'500 | Netto 4'000 | Netto 6'000 |
|---|---:|---:|---:|
| ZH (Zürich) | 2'736 | 1'152 | 0 |
| BE (Bern) | 804 | 0 | 0 |
| LU (Luzern) | 2'088 | 0 | 0 |
| UR (Altdorf (UR)) | 1'818 | 288 | 0 |
| SZ (Schwyz) | 2'284 | keine Zahl | 0 |
| OW (Sarnen) | 2'330 | 0 | 0 |
| NW (Stans) | 2'400 | 600 | 0 |
| GL (Glarus) | 2'747 | 647 | 0 |
| ZG (Zug) | 2'585 | 1'145 | keine Zahl |
| FR (Fribourg) | 1'402 | 0 | 0 |
| SO (Solothurn) | keine Zahl | keine Zahl | 0 |
| BS (Basel) | 3'192 | 240 | 0 |
| BL (Liestal) | 2'271 | 0 | 0 |
| SH (Schaffhausen) | 2'415 | 0 | 0 |
| AR (Herisau) | 1'733 | 0 | 0 |
| AI (Appenzell) | 2'540 | 1'100 | 0 |
| SG (St. Gallen) | 1'960 | 0 | 0 |
| GR (Chur) | 3'516 | 1'116 | 0 |
| AG (Aarau) | 2'068 | 0 | 0 |
| TG (Frauenfeld) | keine Zahl | keine Zahl | keine Zahl |
| TI (Bellinzona) | 4'563 | 0 | 0 |
| VD (Lausanne) | 2'304 | 360 | 0 |
| VS (Sion) | 1'346 | 0 | 0 |
| NE (Neuchâtel) | 2'592 | 1'320 | 0 |
| GE (Genève) | 4'176 | 1'044 | 0 |
| JU (Delémont) | keine Zahl | keine Zahl | keine Zahl |

| Kennzahl | Netto 2'500 | Netto 4'000 | Netto 6'000 |
|---|---:|---:|---:|
| Kantone mit Betrag | 23 | 11 | 0 |
| Kantone ohne Anspruch | 0 | 11 | 23 |
| Kantone ohne Zahl | 3 | 4 | 3 |
| Tiefster Betrag | 804 | 240 | — |
| Median | 2'330 | 1'044 | — |
| Höchster Betrag | 4'563 | 1'320 | — |

## Eine erwachsene Person, ein Kind (7)

Prämie Haushalt: CHF 560 pro Monat · Nettolohn pro Monat, ohne 13.

| Kanton (Hauptort) | Netto 2'500 | Netto 4'000 | Netto 6'000 |
|---|---:|---:|---:|
| ZH (Zürich) | 4'490 | 3'213 | keine Zahl |
| BE (Bern) | 4'084 | 2'716 | 0 |
| LU (Luzern) | 4'572 | 2'124 | 1'046 |
| UR (Altdorf (UR)) | 2'922 | 1'392 | 883 |
| SZ (Schwyz) | keine Zahl | keine Zahl | keine Zahl |
| OW (Sarnen) | 4'442 | 2'593 | 0 |
| NW (Stans) | keine Zahl | keine Zahl | 1'008 |
| GL (Glarus) | keine Zahl | keine Zahl | 1'200 |
| ZG (Zug) | 4'489 | 3'049 | 1'129 |
| FR (Fribourg) | 4'781 | 2'559 | 0 |
| SO (Solothurn) | keine Zahl | keine Zahl | keine Zahl |
| BS (Basel) | 7'212 | 4'680 | 1'800 |
| BL (Liestal) | keine Zahl | keine Zahl | 0 |
| SH (Schaffhausen) | 4'767 | 2'294 | 0 |
| AR (Herisau) | 7'140 | 3'646 | 0 |
| AI (Appenzell) | 4'093 | 3'063 | 827 |
| SG (St. Gallen) | 5'062 | 1'927 | 0 |
| GR (Chur) | keine Zahl | keine Zahl | keine Zahl |
| AG (Aarau) | keine Zahl | keine Zahl | keine Zahl |
| TG (Frauenfeld) | keine Zahl | keine Zahl | keine Zahl |
| TI (Bellinzona) | keine Zahl | keine Zahl | keine Zahl |
| VD (Lausanne) | 5'040 | 3'540 | 1'608 |
| VS (Sion) | 5'989 | 3'296 | 0 |
| NE (Neuchâtel) | 8'640 | 2'856 | 0 |
| GE (Genève) | 5'760 | 5'760 | 4'464 |
| JU (Delémont) | keine Zahl | keine Zahl | keine Zahl |

| Kennzahl | Netto 2'500 | Netto 4'000 | Netto 6'000 |
|---|---:|---:|---:|
| Kantone mit Betrag | 16 | 16 | 9 |
| Kantone ohne Anspruch | 0 | 0 | 9 |
| Kantone ohne Zahl | 10 | 10 | 8 |
| Tiefster Betrag | 2'922 | 1'392 | 827 |
| Median | 4'774 | 2'953 | 1'129 |
| Höchster Betrag | 8'640 | 5'760 | 4'464 |

## Ehepaar, zwei Kinder (4 und 10), ein Einkommen

Prämie Haushalt: CHF 1120 pro Monat · Nettolohn pro Monat, ohne 13.

| Kanton (Hauptort) | Netto 2'500 | Netto 4'000 | Netto 6'000 |
|---|---:|---:|---:|
| ZH (Zürich) | keine Zahl | keine Zahl | keine Zahl |
| BE (Bern) | keine Zahl | keine Zahl | keine Zahl |
| LU (Luzern) | keine Zahl | keine Zahl | keine Zahl |
| UR (Altdorf (UR)) | keine Zahl | keine Zahl | keine Zahl |
| SZ (Schwyz) | keine Zahl | keine Zahl | keine Zahl |
| OW (Sarnen) | keine Zahl | keine Zahl | keine Zahl |
| NW (Stans) | keine Zahl | keine Zahl | keine Zahl |
| GL (Glarus) | keine Zahl | keine Zahl | keine Zahl |
| ZG (Zug) | keine Zahl | keine Zahl | keine Zahl |
| FR (Fribourg) | keine Zahl | keine Zahl | keine Zahl |
| SO (Solothurn) | keine Zahl | keine Zahl | keine Zahl |
| BS (Basel) | keine Zahl | keine Zahl | keine Zahl |
| BL (Liestal) | keine Zahl | keine Zahl | keine Zahl |
| SH (Schaffhausen) | keine Zahl | keine Zahl | keine Zahl |
| AR (Herisau) | keine Zahl | keine Zahl | keine Zahl |
| AI (Appenzell) | keine Zahl | keine Zahl | keine Zahl |
| SG (St. Gallen) | keine Zahl | keine Zahl | keine Zahl |
| GR (Chur) | keine Zahl | keine Zahl | keine Zahl |
| AG (Aarau) | keine Zahl | keine Zahl | keine Zahl |
| TG (Frauenfeld) | keine Zahl | keine Zahl | keine Zahl |
| TI (Bellinzona) | keine Zahl | keine Zahl | keine Zahl |
| VD (Lausanne) | keine Zahl | keine Zahl | keine Zahl |
| VS (Sion) | keine Zahl | keine Zahl | keine Zahl |
| NE (Neuchâtel) | keine Zahl | keine Zahl | keine Zahl |
| GE (Genève) | keine Zahl | keine Zahl | keine Zahl |
| JU (Delémont) | keine Zahl | keine Zahl | keine Zahl |

| Kennzahl | Netto 2'500 | Netto 4'000 | Netto 6'000 |
|---|---:|---:|---:|
| Kantone mit Betrag | 0 | 0 | 0 |
| Kantone ohne Anspruch | 0 | 0 | 0 |
| Kantone ohne Zahl | 26 | 26 | 26 |
| Tiefster Betrag | — | — | — |
| Median | — | — | — |
| Höchster Betrag | — | — | — |

## Warum «keine Zahl»

Grund (Schlüssel aus dem Kantonsmodell) → betroffene Zellen (Kanton, Haushalt, Netto).

- `haushalt` (72×): ZH familie 2'500 · ZH familie 4'000 · ZH familie 6'000 · BE familie 2'500 · BE familie 4'000 · BE familie 6'000 · LU familie 2'500 · LU familie 4'000 · LU familie 6'000 · UR familie 2'500 · UR familie 4'000 · UR familie 6'000 · …
- `tgSteuerbetrag` (9×): TG einzel 2'500 · TG einzel 4'000 · TG einzel 6'000 · TG alleinerziehend 2'500 · TG alleinerziehend 4'000 · TG alleinerziehend 6'000 · TG familie 2'500 · TG familie 4'000 · TG familie 6'000
- `steuerbaresEinkommen` (9×): JU einzel 2'500 · JU einzel 4'000 · JU einzel 6'000 · JU alleinerziehend 2'500 · JU alleinerziehend 4'000 · JU alleinerziehend 6'000 · JU familie 2'500 · JU familie 4'000 · JU familie 6'000
- `mindestanspruch` (7×): ZH alleinerziehend 6'000 · NW alleinerziehend 2'500 · NW alleinerziehend 4'000 · GL alleinerziehend 2'500 · GL alleinerziehend 4'000 · BL alleinerziehend 2'500 · BL alleinerziehend 4'000
- `soSkalaUnklarFristVorbei` (5×): SO einzel 2'500 · SO einzel 4'000 · SO alleinerziehend 2'500 · SO alleinerziehend 4'000 · SO alleinerziehend 6'000
- `grKinder` (3×): GR alleinerziehend 2'500 · GR alleinerziehend 4'000 · GR alleinerziehend 6'000
- `agKinder` (3×): AG alleinerziehend 2'500 · AG alleinerziehend 4'000 · AG alleinerziehend 6'000
- `tiKinder` (3×): TI alleinerziehend 2'500 · TI alleinerziehend 4'000 · TI alleinerziehend 6'000
- `szGrenzeMietzinsregion` (2×): SZ einzel 4'000 · SZ alleinerziehend 6'000
- `szKinderMindestanspruch` (2×): SZ alleinerziehend 2'500 · SZ alleinerziehend 4'000
- `zgNaeherung` (1×): ZG einzel 6'000
