# Regionale Vergünstigungen — Recherche-Matrix (alle 26 Kantone)

> Stand: 2026-07-06 · lebendes Arbeitsdokument
>
> **Zweck:** kanton-für-kanton echte, web-verifizierte Zusatz-Angebote „über die
> KulturLegi hinaus" sammeln, bevor sie in `src/data/regionaleVerguenstigungen.js`
> (`REGIONS`) landen. **Regel: nur mit live-verifizierter URL eintragen — nie raten
> (Haftung).** Die regionale KulturLegi/CarteCulture selbst ist für ALLE Kantone
> schon verlinkt (`KULTURLEGI_REGIONS`); hier geht es nur um Extras.
>
> Verwandt: `src/data/regionaleVerguenstigungen.js`, Braindump #26 Punkt 3a.

## Legende
- ✅ verifiziert + in App · 🔎 zu prüfen (Web) · — vermutlich keins · KL = via KulturLegi

## Verifizierter Befund (2026-07-06)
- **Regional-Link:** alle 26 Kantone haben eine KulturLegi- (DE) bzw. CarteCulture-
  Seite (GE/JU/NE/VD); TI nur national → `'check'`. Alle einzeln web-verifiziert.
- **Eigene „Freikarten & Aktionen"-Unterseite:** **nur Zürich** unter stabilem Pfad
  (`/zuerich/angebote/freikarten-und-aktionen`, ✅ in App). Aargau/Bern/Zentralschweiz
  liefern denselben Pfad **404** → kein einheitliches Muster, nicht ausrollbar.

## Zwischenfazit (2026-07-06)
Geprüft: BS/BL (Sonderfall, viele Extras), ZH (Aktionsseite), AG/SO (FerienPass),
BE + SG (**keine** kantonsweite Rabattkarte — nur KulturLegi + IPV +
Kinderbetreuungs-Zuschüsse; Stadt-Angebote wie Berns „Angebotskompass" sind
kommunal, **nicht** unter Kanton listen = kein Over-Reach). **Muster:** Basel ist die
Ausnahme; die meisten Kantone haben als „regionale Vergünstigung" nur die KulturLegi
(für alle 26 bereits verlinkt). Distinkte Extras sind selten → gezielt statt
flächendeckend suchen; Kinderbetreuungs-Zuschüsse/Familienzulagen sind eine **andere
Kategorie** (gehören ggf. in einen eigenen Berechtigungs-Punkt, nicht in diese
Rabatt-Liste).

## Matrix

| Kanton | Regional-KL | Familienpass | Günstige Zahnmedizin | Bildung/VHS | Aktions-/Gutscheinseite |
|--------|:-----------:|:------------:|:--------------------:|:-----------:|:-----------------------:|
| ZH | ✅ | 🔎 | 🔎 | 🔎 | ✅ Freikarten & Aktionen |
| BE | ✅ | — (nur Stadt Bern „Angebotskompass", nicht kantonsweit) | 🔎 | 🔎 | 🔎 (kein stabiler Pfad) |
| LU | ✅ | 🔎 | 🔎 | 🔎 | 🔎 |
| UR | ✅ | 🔎 | 🔎 | 🔎 | 🔎 |
| SZ | ✅ | 🔎 | 🔎 | 🔎 | 🔎 |
| OW | ✅ | 🔎 | 🔎 | 🔎 | 🔎 |
| NW | ✅ | 🔎 | 🔎 | 🔎 | 🔎 |
| GL | ✅ | 🔎 | 🔎 | 🔎 | 🔎 |
| ZG | ✅ | 🔎 | 🔎 | 🔎 | 🔎 |
| FR | ✅ | 🔎 | 🔎 | 🔎 | 🔎 |
| SO | ✅ | ✅ FerienPass A-Welle (mit KL halber Preis) | 🔎 | 🔎 | 🔎 |
| BS | ✅ | ✅ Familienpass Region Basel | ✅ Volkszahnklinik | ✅ VHS beider Basel | 🔎 |
| BL | ✅ | ✅ Familienpass Region Basel | 🔎 | ✅ VHS beider Basel | 🔎 |
| SH | ✅ | 🔎 | 🔎 | 🔎 | 🔎 |
| AR | ✅ | 🔎 | 🔎 | 🔎 | 🔎 |
| AI | ✅ | 🔎 | 🔎 | 🔎 | 🔎 |
| SG | ✅ | — (keine kantonsweite Karte; nur KulturLegi + Kinderbetreuungs-Zuschüsse) | 🔎 | 🔎 | 🔎 |
| GR | ✅ | 🔎 | 🔎 | 🔎 | 🔎 |
| AG | ✅ | ✅ FerienPass A-Welle (mit KL halber Preis) | 🔎 | 🔎 | 🔎 (Pfad 404) |
| TG | ✅ | 🔎 | 🔎 | 🔎 | 🔎 |
| TI | check (national) | 🔎 | 🔎 | 🔎 | 🔎 |
| VD | ✅ CarteCulture | 🔎 | 🔎 | 🔎 | 🔎 |
| VS | ✅ | 🔎 | 🔎 | 🔎 | 🔎 |
| NE | ✅ CarteCulture | 🔎 | 🔎 | 🔎 | 🔎 |
| GE | ✅ CarteCulture | 🔎 | 🔎 | 🔎 | 🔎 |
| JU | ✅ CarteCulture | 🔎 | 🔎 | 🔎 | 🔎 |

## Arbeitsweise (wenn Web-Suche wieder läuft)
1. Pro Kanton je Spalte suchen (z. B. „Familienpass Kanton X", „Volkszahnklinik X",
   „KulturLegi X Aktionen").
2. URL live abrufen (200 + relevanter Inhalt) — sonst 🔎 lassen.
3. Verifizierte Angebote als `{ key, url }` in `REGIONS[<KT>].offers` + i18n
   `regio.offers.<key>` ×5 eintragen; Matrix-Zelle auf ✅.
