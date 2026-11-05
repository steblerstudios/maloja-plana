# Kantonsatlas-Daten in Maloja Plana

Kopie aus dem **Maloja-Kantonsatlas** (Unterprojekt von Maloja Plana, liegt neben diesem Repo,
eigene Karte mit 15 Ebenen). Hier liegt nur, was die öffentlichen Seiten brauchen. Gelesen beim
Bauen von `scripts/seiten-figuren.mjs`, nicht im App-Bündel.

| Datei | Inhalt | Quelle |
|---|---|---|
| `praemien.json` | mittlere Monatsprämie je Kanton und für die ganze Schweiz, Erwachsene (`erw`), junge Erwachsene (`jung`), Kinder (`kind`), alle (`alle`); `y26`, `y27` und Veränderung `pct` in Prozent | BAG, «Kantonale Prämien 2026/2027», 29.09.2026 |

**Gleich halten:** `node scripts/kantonsatlas-abgleich.mjs` vergleicht mit dem Atlas,
`--uebernehmen` schreibt die Atlas-Fassung hierher. Danach `node scripts/build-seiten.mjs`.

**Was der Test prüft** (`src/__tests__/hintergrundSeiten.test.js`): Für 2027 passt die Kopie zur
Prämienregionen-Datei in `src/data/praemienRegionenDaten.js` — bei Kantonen mit einer Region
gleich, sonst liegt das Kantonsmittel zwischen den Regionswerten.

**Bekannter Unterschied 2026:** `y26` sind die angepassten Vorjahreswerte, mit denen das BAG in der
Tabelle von 2027 vergleicht. Die 2026 ursprünglich genehmigten Prämien in `praemienRegionenDaten.js`
weichen davon um bis zu 8.50 Franken ab (gemessen 04.11.2026). Beides ist richtig, nur anders
definiert; die Seite nennt den Unterschied.
