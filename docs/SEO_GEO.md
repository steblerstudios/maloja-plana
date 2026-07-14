# SEO & GEO — Maloja Plana

*Eine Quelle der Wahrheit für Auffindbarkeit (Suche) und Zitierbarkeit (KI-Antworten).
Stand: 2026-07-14.*

**SEO** = klassische Suche (Google-Ergebnisliste). **GEO** = zwei Bedeutungen:
*Generative* Engine Optimization (in KI-Antworten von ChatGPT/Perplexity/Google-AI/
Claude genannt werden) und *geografisch*/Local. Für Maloja zählt vor allem SEO +
**generatives** GEO — Maloja ist **kein Lokalgeschäft** (keine Adresse, kein
`LocalBusiness`-Schema; das ist bewusst korrekt so, nicht vergessen).

Prozedur: der wiederverwendbare Stebler-Studios-Skill `/seo-geo` (Modi A optimieren /
B schreiben / C auditieren). Diese Datei hält den **Maloja-spezifischen Stand** fest.

---

## Das Deploy-Gate (automatisch)

`scripts/check-seo.sh` prüft den gebauten `dist/`-Stand deterministisch (bash, keine
Abhängigkeiten, offline) und läuft **automatisch in `deploy.sh`** direkt nach dem Build —
fehlt ein Pflicht-Baustein, bricht der Deploy ab, bevor etwas hochgeht.

Manuell: `bash scripts/check-seo.sh dist`

**Pflicht (Exit 1 bei Fehlen):** `<title>` · meta description · `<html lang>` · canonical ·
`og:title/description/image/url` · JSON-LD · `robots.txt` · `sitemap.xml`.
**Weich (nur Warnung):** hreflang · twitter:card · og:image-Datei vorhanden ·
`<title>`-Länge ≤ 65 Zeichen.

Warum ein statisches Gate: Maloja rendert **clientseitig** (React). KI-Crawler ohne
JS-Ausführung (GPTBot, PerplexityBot) sehen nur die statische Hülle + JSON-LD — genau
das, was dieses Gate absichert.

---

## Befund (Audit 2026-07-14, `/seo-geo` Modus C)

Gesamt: **sehr gut**. Vollständige OG-/Twitter-Tags, JSON-LD-`@graph`
(Organization + WebSite + WebApplication), canonical, hreflang×5, `robots.txt` +
`sitemap.xml` mit hreflang. `og-image.png` vorhanden.

| Bereich | Stand |
|---|---|
| head / basis | stark |
| semantik | Inhalt erst per JS (siehe offen ①) |
| structured data | sehr gut (@graph) |
| local | N/A — kein Lokalgeschäft, korrekt weggelassen |
| crawl | sehr gut (robots + sitemap + hreflang) |
| performance | Font-Preload, CSP; Rest nur live messbar |

### Erledigt
- **`<title>` von 80 → 60 Zeichen gekürzt** (`Maloja Plana — Schweizer Lebensordner:
  Steuern & Sozialhilfe`), damit Google nicht abschneidet. *(index.html, 2026-07-14)*

### Offen
1. **Clientseitiges Rendering (🟡, bewusster Kompromiss):** JS-lose GEO-Crawler sehen
   nur Hülle + JSON-LD, keinen Fließtext. Für eine App legitim; falls KI-Zitierbarkeit
   wichtiger wird, wäre statischer Kern-Text oder Prerender der Startseite der Hebel.
2. **`FAQPage`-JSON-LD (🟢):** falls ein Hilfe-/FAQ-Bereich entsteht — echte Fragen
   („Wer hat Anspruch auf IPV?") sind ein starkes GEO-Signal und passen zum Inhalt.
3. **`<meta name="keywords">` (🟢):** wird von Suchmaschinen ignoriert, kann raus.
4. **`sitemap.xml` `lastmod` (🟢):** bei Release mitziehen (steht auf 2026-07-09).

---

## Bei Änderungen beachten
- Neue Seite/Sprache → `sitemap.xml` + hreflang mitpflegen.
- JSON-LD-Angaben müssen **konsistent zum sichtbaren Inhalt** sein (Wahrheits-Disziplin,
  vgl. `CLAUDE.md`) — nichts behaupten, was die App nicht belegt.
- `robots.txt`: KI-Crawler **nicht** blocken (aktuell `Allow: /` für alle — korrekt).
