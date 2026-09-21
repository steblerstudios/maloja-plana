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

# ── Öffentliche Erklärseiten (seit 20.09.2026) ──────────────────────────────
# Sie liegen VOR dem Beta-Gate und sind der einzige indexierbare Inhalt, den
# Maloja Plana hat — alles andere sieht auch Googlebot nicht. Fehlt eine im
# Build, geht ein Deploy raus, der die Startseite wieder allein lässt, und
# die Sitemap meldet dann vier URLs, die 404 liefern.
# Der ausführliche Wächter ist src/__tests__/oeffentlicheSeiten.test.js; hier
# nur die harte Mindestprüfung, weil deploy.sh keine Tests laufen lässt.
# Erzeugt von scripts/build-seiten.mjs, Inhalt in scripts/seiten-inhalt.mjs.
#
# Seit 21.09.2026 in fünf Sprachen: Deutsch unter /<seite>/, die übrigen unter
# /<sprache>/<seite>/. Ob eine Sprache in die Sitemap gehört, wird NICHT hier
# entschieden und auch nicht hier gepflegt — das stünde sonst an einem zweiten
# Ort und liefe auseinander. Die Seite sagt es selbst: trägt sie «noindex»,
# darf sie nicht in der Sitemap stehen; trägt sie es nicht, muss sie.
for sprache in "" fr/ it/ en/ rm/; do
for seite in was-steht-mir-zu praemienverbilligung sozialhilfe steuern rechtliches; do
  pfad="${sprache}${seite}"
  datei="$DIR/$pfad/index.html"
  if [ ! -f "$datei" ]; then
    echo "  ✗ Erklärseite /$pfad/ fehlt im Build"; fail=$((fail + 1)); continue
  fi
  s_html=$(cat "$datei")
  if ! printf '%s' "$s_html" | grep -q "<title>"; then
    echo "  ✗ /$pfad/ ohne <title>"; fail=$((fail + 1)); continue
  fi
  if ! printf '%s' "$s_html" | grep -q "rel=\"canonical\" href=\"https://malojaplana.ch/$pfad/\""; then
    echo "  ✗ /$pfad/ ohne eigenen canonical"; fail=$((fail + 1)); continue
  fi
  if ! printf '%s' "$s_html" | grep -q 'application/ld+json'; then
    echo "  ✗ /$pfad/ ohne JSON-LD"; fail=$((fail + 1)); continue
  fi
  if printf '%s' "$s_html" | grep -q 'content="noindex'; then
    # Nicht freigegebene Übersetzung: sie DARF nicht in der Sitemap stehen.
    # Stünde sie dort, wäre die Freigabe-Sperre zur Hälfte wirkungslos und
    # ungelesener Text über Schweizer Sozialrecht ginge in den Index.
    if grep -q "<loc>https://malojaplana.ch/$pfad/</loc>" "$DIR/sitemap.xml" 2>/dev/null; then
      echo "  ✗ /$pfad/ trägt noindex, steht aber in der sitemap.xml"; fail=$((fail + 1)); continue
    fi
    echo "  ✓ /$pfad/ (noindex, nicht in der Sitemap — nicht freigegeben)"
  else
    # Die Seite muss in der Sitemap stehen, sonst findet sie niemand.
    if ! grep -q "<loc>https://malojaplana.ch/$pfad/</loc>" "$DIR/sitemap.xml" 2>/dev/null; then
      echo "  ✗ /$pfad/ fehlt in der sitemap.xml"; fail=$((fail + 1)); continue
    fi
    echo "  ✓ Erklärseite /$pfad/ (title, canonical, JSON-LD, in Sitemap)"
  fi
done
done

# ── Weich: Warnung, kein Abbruch (Feinschliff / mehrsprachige App) ──
soft() { # soft "<beschreibung>" "<grep-muster>"
  if printf '%s' "$html" | grep -qE "$2"; then
    echo "  ✓ $1"
  else
    echo "  ⚠ $1 — fehlt (empfohlen)"
    warn=$((warn + 1))
  fi
}
soft "twitter:card"                 'name="twitter:card"'

# hreflang wird NICHT mehr auf der Startseite gesucht. Seit 21.09.2026 steht es
# dort bewusst nicht mehr: der canonical der Startseite ist statisch «/», also
# hätte jede ?lang=-Alternative sich selbst wegkanonisiert — dieselbe Falle, die
# am 20.09. die Sitemap gekostet hat. Begründung im Kopf von index.html.
#
# Gesucht wird es dort, wo es WAHR ist: auf den Erklärseiten, und nur für
# freigegebene Sprachen. Ein Ring aus einem Glied zählt nicht als Ring — solange
# nur Deutsch frei ist, gibt es ihn zu Recht nicht, und das ist kein Mangel.
freie_sprachen=0
for s in "" fr/ it/ en/ rm/; do
  d="$DIR/${s}sozialhilfe/index.html"
  [ -f "$d" ] || continue
  grep -q 'content="noindex' "$d" || freie_sprachen=$((freie_sprachen + 1))
done
if [ "$freie_sprachen" -ge 2 ]; then
  if grep -q 'hreflang=' "$DIR/sozialhilfe/index.html" 2>/dev/null; then
    echo "  ✓ hreflang auf den Erklärseiten ($freie_sprachen freigegebene Sprachen)"
  else
    echo "  ⚠ $freie_sprachen freigegebene Sprachen, aber kein hreflang auf den Erklärseiten"
    warn=$((warn + 1))
  fi
else
  echo "  ✓ hreflang: noch nicht nötig (nur $freie_sprachen freigegebene Sprache)"
fi

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
