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

# Seit dem Umzug (Plan «App nach /app/», PR 2) liegt die App unter /app/.
APP="$BASE/app"
index="$(curl -fsS --max-time 20 "$APP/")" || { echo "✗ /app/index.html nicht erreichbar"; exit 1; }

# Direkt referenzierte Assets aus index.html (script/link)
assets="$(printf '%s' "$index" | grep -oE 'assets/[a-zA-Z0-9._-]+\.(js|css)' || true)"

# Dynamisch importierte Chunks aus dem Haupt-Bundle (Vite-Hash: name-XXXXXXXX.js)
for a in $(printf '%s\n' "$assets" | grep -E 'assets/index-.*\.js' | sort -u); do
  js="$(curl -fsS --max-time 20 "$APP/$a" || true)"
  more="$(printf '%s' "$js" | grep -oE '[a-zA-Z0-9._-]+-[a-zA-Z0-9]{8}\.js' | sed 's#^#assets/#' || true)"
  assets="$assets
$more"
done

uniq_assets="$(printf '%s\n' "$assets" | sed '/^$/d' | sort -u)"

missing=""
count=0
for a in $uniq_assets; do
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$APP/$a")"
  count=$((count + 1))
  if [ "$code" = "200" ]; then
    echo "  ✓ $a"
  else
    echo "  ✗ $a ($code)"
    missing="$missing $a"
  fi
done

swver="$(curl -fsS --max-time 20 "$APP/sw.js" | grep -oE 'v[0-9]+' | head -1 || true)"
echo "→ Service Worker: ${swver:-unbekannt}  ·  $count Assets geprüft"

if [ -n "$missing" ]; then
  echo "✗ Fehlende/fehlerhafte Assets:$missing"
  echo "  → FTP-Upload unvollständig. Den Ordner dist/app/assets vollständig neu hochladen."
  exit 1
fi
echo "✓ Alle referenzierten Assets erreichbar."

# Bewegte Figuren der Seite /krankenkasse/ (seit 04.11.2026): Klappt die Seite sie
# als Rahmen auf, muss der Server-Header für /krankenkasse/bewegt/ das Einbetten
# von der eigenen Adresse erlauben (frame-ancestors 'self'). Sonst bleiben die
# Rahmen leer — der Link darunter funktioniert trotzdem.
if curl -fsS --max-time 20 "$BASE/krankenkasse/" 2>/dev/null | grep -q '<iframe src="/krankenkasse/bewegt/'; then
  csp="$(curl -sI --max-time 20 "$BASE/krankenkasse/bewegt/dorf/" | tr -d '\r' | grep -i '^content-security-policy:' || true)"
  if printf '%s' "$csp" | grep -q "frame-ancestors 'self'"; then
    echo "✓ /krankenkasse/bewegt/ darf eingebettet werden (frame-ancestors 'self')."
  else
    echo "✗ /krankenkasse/ bettet die bewegten Figuren ein, der Server verbietet es aber:"
    echo "  ${csp:-kein CSP-Header}"
    echo "  → Block «krankenkasse/bewegt» aus public/.htaccess in die Server-.htaccess übernehmen."
    exit 1
  fi
fi
