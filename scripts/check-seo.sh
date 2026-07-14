#!/usr/bin/env bash
# SEO/GEO-Fundament-Gate für Maloja Plana.
# Prüft am gebauten dist/-Stand (bzw. übergebenem Ordner), dass die statische
# Hülle die SEO/GEO-Grundlagen enthält, BEVOR deployt wird — analog zum
# /seo-geo-Skill (Stebler Studios) Modus C, aber deterministisch & offline.
# Hintergrund: Maloja rendert clientseitig; KI-Crawler ohne JS sehen nur diese
# Hülle + JSON-LD. Fehlt hier ein Baustein, ist die Seite für Suche/KI blind.
#
# Nutzung:  bash scripts/check-seo.sh [dist-ordner]
#           (Default: dist)
#
# Exit 0 = Fundament vollständig (Warnungen erlaubt), Exit 1 = Pflicht fehlt.
# macOS-bash-3.2-kompatibel. Keine Abhängigkeiten außer grep/sed/wc.
set -eu

DIR="${1:-dist}"
HTML="$DIR/index.html"
echo "→ Prüfe SEO/GEO-Fundament in $DIR/"

[ -f "$HTML" ] || { echo "✗ $HTML fehlt — zuerst 'npm run build'."; exit 1; }
html="$(cat "$HTML")"

fail=0
warn=0

# ── Pflicht: muss vorhanden sein (sonst Exit 1) ──
need() { # need "<beschreibung>" "<grep-muster>"
  if printf '%s' "$html" | grep -qE "$2"; then
    echo "  ✓ $1"
  else
    echo "  ✗ $1"
    fail=$((fail + 1))
  fi
}

need "<title> vorhanden"            '<title>[^<]+</title>'
need "meta description"             'name="description" content="[^"]+"'
need "<html lang=…>"                '<html[^>]*lang='
need "canonical-Link"               'rel="canonical"'
need "og:title"                     'property="og:title"'
need "og:description"               'property="og:description"'
need "og:image"                     'property="og:image"'
need "og:url"                       'property="og:url"'
need "JSON-LD (structured data)"    'application/ld\+json'

# robots.txt / sitemap.xml als Dateien im Deploy-Ordner
if [ -f "$DIR/robots.txt" ]; then echo "  ✓ robots.txt vorhanden"; else echo "  ✗ robots.txt fehlt"; fail=$((fail + 1)); fi
if [ -f "$DIR/sitemap.xml" ]; then echo "  ✓ sitemap.xml vorhanden"; else echo "  ✗ sitemap.xml fehlt"; fail=$((fail + 1)); fi

# ── Weich: Warnung, kein Abbruch (Feinschliff / mehrsprachige App) ──
soft() { # soft "<beschreibung>" "<grep-muster>"
  if printf '%s' "$html" | grep -qE "$2"; then
    echo "  ✓ $1"
  else
    echo "  ⚠ $1 — fehlt (empfohlen)"
    warn=$((warn + 1))
  fi
}
soft "hreflang (mehrsprachig)"      'hreflang='
soft "twitter:card"                 'name="twitter:card"'

# og:image-Datei wirklich vorhanden? (Pfad aus dem Tag, führenden / strippen)
ogimg="$(printf '%s' "$html" | sed -n 's/.*property="og:image" content="[^"]*\/\([^"/]*\)".*/\1/p' | head -1)"
if [ -n "$ogimg" ]; then
  if [ -f "$DIR/$ogimg" ]; then echo "  ✓ og:image-Datei ($ogimg) vorhanden"; else echo "  ⚠ og:image-Datei ($ogimg) nicht in $DIR/ gefunden"; warn=$((warn + 1)); fi
fi

# Titel-Länge (weich: Google schneidet bei ~60 Zeichen ab)
title="$(printf '%s' "$html" | sed -n 's/.*<title>\([^<]*\)<\/title>.*/\1/p' | head -1)"
if [ -n "$title" ]; then
  tlen="$(printf '%s' "$title" | wc -m | tr -d ' ')"
  if [ "$tlen" -gt 65 ]; then
    echo "  ⚠ <title> ist $tlen Zeichen — Google schneidet ~60 ab, kürzen empfohlen"
    warn=$((warn + 1))
  else
    echo "  ✓ <title>-Länge ok ($tlen Zeichen)"
  fi
fi

echo "→ $((fail)) Pflicht-Fehler · $((warn)) Warnung(en)"
if [ "$fail" -gt 0 ]; then
  echo "✗ SEO/GEO-Fundament unvollständig — nicht deployen, bis grün."
  exit 1
fi
echo "✓ SEO/GEO-Fundament vollständig."
