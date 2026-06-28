# Auffindbarkeit / SEO — operative Schritte

Problem: Eine Suche nach „Maloja Plana" zeigt malojaplana.ch (noch) nicht — der
Name kollidiert mit dem Dorf Maloja, dem Malojapass und der Kleidermarke Maloja,
und die Domain ist neu.

Das **On-Page-SEO ist erledigt** (Titel, Description, hreflang, OG/Twitter,
robots.txt, sitemap.xml, JSON-LD-Entity-Graph mit alternateName/sameAs — Commit
`3fdcb12`). Was bleibt, kann **nur Sophie** tun (braucht Domain-Eigentum):

## 1. Google Search Console (wichtigster Schritt)
1. https://search.google.com/search-console → mit Google-Konto anmelden.
2. Property hinzufügen → **Domain** `malojaplana.ch` (deckt alle Subdomains/Protokolle ab).
3. Verifizierung per **DNS-TXT-Record**: Google zeigt einen `google-site-verification=…`-
   Wert → bei Infomaniak unter Domain → DNS → TXT-Record hinzufügen → in Search
   Console „Bestätigen". (Alternativ HTML-Datei in `public/` legen + deployen.)
4. Nach Bestätigung: **Sitemaps** → `sitemap.xml` einreichen.
5. **URL-Prüfung** für `https://malojaplana.ch/` → „Indexierung beantragen".

→ Danach erscheint die Seite je nach Google in Tagen bis ~2 Wochen im Index.
Marken-Suche („Maloja Plana Lebensordner") greift zuerst, weil eindeutiger.

## 2. Bing Webmaster Tools (optional, schnell)
https://www.bing.com/webmasters → Property kann aus Search Console importiert
werden → Sitemap einreichen. Deckt Bing + DuckDuckGo ab.

## 3. Backlinks / Erwähnungen (mittelfristig, hilft am meisten gegen die Namens-Kollision)
Jeder seriöse Link auf malojaplana.ch stärkt die Marke gegenüber Dorf/Pass/Marke:
- Stebler-Studios-Seite/Impressum verlinkt malojaplana.ch (sameAs ist im JSON-LD).
- GitHub-Repo-Beschreibung + Website-Feld auf malojaplana.ch setzen.
- Einträge in Schweizer Verzeichnissen für gemeinnützige/Social-Tools, sobald
  passend (z. B. soziale-Hilfe-Portale, die wir ohnehin verlinken).

## Kontrolle
- Roher Crawler-Blick: `curl -s https://malojaplana.ch | grep -i "<title>\|description"`
- Indexierungsstatus: in Search Console unter „Seiten".
- `site:malojaplana.ch` in Google — zeigt, was indexiert ist.

Letzte Aktualisierung: 2026-06-28.
