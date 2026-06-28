#!/usr/bin/env bash
# Deploy-Check für Maloja Plana.
# Prüft, dass alle vom Live-index.html referenzierten Asset-Chunks erreichbar
# sind (HTTP 200) — inkl. der dynamisch importierten Sprach-/Daten-Chunks.
# Fängt unvollständige FTP-Uploads ab (z. B. fehlender fr-*.js → "kein FR").
#
# Nutzung:  bash scripts/check-deploy.sh [URL]
#           (Default-URL: https://malojaplana.ch)
#
# Exit 0 = alles erreichbar, Exit 1 = etwas fehlt. macOS-bash-3.2-kompatibel.
set -eu

BASE="${1:-https://malojaplana.ch}"
BASE="${BASE%/}"
echo "→ Prüfe Deploy auf $BASE"

index="$(curl -fsS --max-time 20 "$BASE/")" || { echo "✗ index.html nicht erreichbar"; exit 1; }

# Direkt referenzierte Assets aus index.html (script/link)
assets="$(printf '%s' "$index" | grep -oE 'assets/[a-zA-Z0-9._-]+\.(js|css)' || true)"

# Dynamisch importierte Chunks aus dem Haupt-Bundle (Vite-Hash: name-XXXXXXXX.js)
for a in $(printf '%s\n' "$assets" | grep -E 'assets/index-.*\.js' | sort -u); do
  js="$(curl -fsS --max-time 20 "$BASE/$a" || true)"
  more="$(printf '%s' "$js" | grep -oE '[a-zA-Z0-9._-]+-[a-zA-Z0-9]{8}\.js' | sed 's#^#assets/#' || true)"
  assets="$assets
$more"
done

uniq_assets="$(printf '%s\n' "$assets" | sed '/^$/d' | sort -u)"

missing=""
count=0
for a in $uniq_assets; do
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$BASE/$a")"
  count=$((count + 1))
  if [ "$code" = "200" ]; then
    echo "  ✓ $a"
  else
    echo "  ✗ $a ($code)"
    missing="$missing $a"
  fi
done

swver="$(curl -fsS --max-time 20 "$BASE/sw.js" | grep -oE 'v[0-9]+' | head -1 || true)"
echo "→ Service Worker: ${swver:-unbekannt}  ·  $count Assets geprüft"

if [ -n "$missing" ]; then
  echo "✗ Fehlende/fehlerhafte Assets:$missing"
  echo "  → FTP-Upload unvollständig. Den dist/assets-Ordner vollständig neu hochladen."
  exit 1
fi
echo "✓ Alle referenzierten Assets erreichbar."
