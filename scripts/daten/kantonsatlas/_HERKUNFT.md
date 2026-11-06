# Kantonsatlas-Daten in Maloja Plana

Kopie aus dem **Maloja-Kantonsatlas** (Unterprojekt von Maloja Plana, liegt neben diesem Repo,
eigene Karte mit 15 Ebenen). Hier liegt nur, was die öffentlichen Seiten brauchen. Gelesen beim
Bauen von `scripts/seiten-figuren.mjs` und `scripts/seiten-vergleich.mjs`, nicht im App-Bündel.

| Datei | Inhalt | Quelle |
|---|---|---|
| `praemien.json` | mittlere Monatsprämie je Kanton und für die ganze Schweiz, Erwachsene (`erw`), junge Erwachsene (`jung`), Kinder (`kind`), alle (`alle`); `y26`, `y27` und Veränderung `pct` in Prozent | BAG, «Kantonale Prämien 2026/2027», 29.09.2026 |
| `last.json` | Prämienlast vor (`lastSingle`, `lastPaar`) und nach Verbilligung (`lastNachIpv`), Bezugsquote, Entlastung, Werte «nur 2025» | ESTV Median-Reineinkommen 2022; BAG Statistik der OKP 2025 (T 4.02, T 4.08); Methode im Atlas, Abschnitt «Stand 01.11.2026» |
| `steuern.json` | Steuerbelastung im Hauptort bei 50/80/120 Tausend Fr., ledig, ohne Kinder und Konfession; tiefste und höchste Gemeinde bei 80'000 | ESTV Steuerbelastungsstatistik, Steuerjahr 2026, abgerufen 24.10.2026 |
| `lohn_miete.json` | Medianlohn 2024/2022 der Grossregion (Vollzeit, brutto); Nettomiete 2024 im Kanton, 3 Zimmer mit Vertrauensintervall; `anteil` = Miete 3 Zimmer in % des Medianlohns | BFS LSE (T1_gr), BFS Strukturerhebung (T 09.03.03.01) |
| `leerwohnungsziffer.json` | Leerwohnungsziffer 1.6.2026 und Vorjahr, Anzahl leerer Wohnungen | BFS Leerwohnungszählung, T 09.03.04.04 |
| `sozialhilfe.json` | Sozialhilfequote 2024, 2023, 2015 | BFS Sozialhilfestatistik |
| `el_quote.json` | EL-Quote zur AHV und IV, Dezember 2025 und Vorjahr | BSV Statistik der EL 2025 |
| `arbeitslosenquote.json` | Arbeitslosenquote September 2026, Vorjahr, Schnitt 2025 | SECO, Lage auf dem Arbeitsmarkt |
| `familienzulagen.json` | Kinder-, Ausbildungs- und Geburtszulagen 2026 | BSV, Arten und Ansätze der Familienzulagen 2026 |
| `kita_abzug.json` | Höchstabzug Kinderdrittbetreuung je Kanton und Bund (`CH_BUND`), Steuerjahr 2026, mit Link je Kanton | ESTV/SSK Kantonsblätter (Februar 2026), DBG Art. 33 Abs. 3 |
| `alimente.json` | Alimentenbevorschussung je Kanton (Höchstbetrag, Grenze, Rechtsgrundlage) — noch auf keiner Seite verwendet | kantonale Erlasse, abgerufen 24.10.2026 |

**Gleich halten:** `node scripts/kantonsatlas-abgleich.mjs` vergleicht mit dem Atlas,
`--uebernehmen` schreibt die Atlas-Fassung hierher. Danach `node scripts/build-seiten.mjs`.

**Was der Test prüft** (`src/__tests__/hintergrundSeiten.test.js`): Für 2027 passt die Kopie zur
Prämienregionen-Datei in `src/data/praemienRegionenDaten.js` — bei Kantonen mit einer Region
gleich, sonst liegt das Kantonsmittel zwischen den Regionswerten.

**Bekannter Unterschied 2026:** `y26` sind die angepassten Vorjahreswerte, mit denen das BAG in der
Tabelle von 2027 vergleicht. Die 2026 ursprünglich genehmigten Prämien in `praemienRegionenDaten.js`
weichen davon um bis zu 8.50 Franken ab (gemessen 04.11.2026). Beides ist richtig, nur anders
definiert; die Seite nennt den Unterschied.
