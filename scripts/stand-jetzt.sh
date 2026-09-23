#!/usr/bin/env bash
# ─── stand-jetzt.sh: die Stand-Zeile, gemessen statt geschrieben ─────────────
#
# WARUM: Die Stand-Zeile in SESSION_START.md war zwischen 21. und 23.09.2026 sechsmal
# falsch — am eigenen Merge, an fremder Arbeit, an einem Deploy sechs Minuten nach dem
# Schreiben. Eine von Hand geschriebene Zeile in einer committeten Datei KANN nicht
# stimmen: sie enthält nie ihren eigenen Merge, und alles, was nach ihr passiert, fehlt.
# Darum steht der Stand nicht mehr in einer Datei, sondern wird hier gemessen, jedes Mal.
#
# WAS (nur lesen; einziger Netz-Schritt ins Repo ist `git fetch`):
#   main   — origin/main nach frischem fetch
#   live   — der Commit aus https://malojaplana.ch/version.json (schreibt deploy.sh
#            seit 23.09.2026). Fehlt sie, steht «Commit unbekannt» da — NICHT der
#            Release-Tag als Ersatz: der wandert nur mit der Versionsnummer und hat
#            einmal 133 statt 4 Commits Rückstand gemeldet.
#   dazwischen — Commits von live bis main (nur wenn der live-Commit bekannt ist)
#   PRs    — offene Pull Requests, via gh
# Gegenprobe: eine erfundene Adresse muss 404 geben, sonst misst der Abruf nichts
# (manche Hoster liefern jeder Adresse dieselbe Seite aus).
#
# Nutzung:  bash scripts/stand-jetzt.sh            # eine Zeile, zum Einfügen
#           bash scripts/stand-jetzt.sh --ohne-fetch
# Exit 0 = alles gemessen · 1 = mindestens ein Teil unbekannt (steht in der Zeile)
set -uo pipefail
cd "$(dirname "$0")/.." || exit 2
SEITE="${MALOJA_URL:-https://malojaplana.ch}"
unbekannt=0

[ "${1:-}" = "--ohne-fetch" ] || git fetch -q origin 2>/dev/null || { echo "⚠️ git fetch gescheitert — origin/main ist der letzte lokale Stand" >&2; unbekannt=1; }
MAIN="$(git rev-parse --short origin/main 2>/dev/null || echo '?')"
MAIN_ZEIT="$(TZ=Europe/Zurich git log -1 --format='%cd' --date=format-local:'%d.%m. %H:%M' origin/main 2>/dev/null || echo '?')"

# live
LIVE="unbekannt"; LIVE_TEXT=""
GEGEN="$(curl -s -o /dev/null -w '%{http_code}' -H 'Cache-Control: no-cache' "${SEITE}/version-gibtesnicht-0000.json" 2>/dev/null)"
if [ "$GEGEN" != "404" ]; then
  LIVE_TEXT="live nicht messbar (Gegenprobe gab ${GEGEN:-nichts} statt 404)"; unbekannt=1
else
  JSON="$(curl -s -f -H 'Cache-Control: no-cache' "${SEITE}/version.json" 2>/dev/null || true)"
  LIVE="$(printf '%s' "$JSON" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const v=JSON.parse(s);if(/^[0-9a-f]{40}$/.test(v.commit))console.log(v.commit)}catch{}})' 2>/dev/null)"
  if [ -n "$LIVE" ]; then
    DETAIL="$(printf '%s' "$JSON" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const v=JSON.parse(s);console.log(`${v.version}, gebaut ${String(v.gebaut).slice(8,10)}.${String(v.gebaut).slice(5,7)}. ${String(v.gebaut).slice(11,16)}${v.sauber===false?", ⚠️ aus ungespeichertem Arbeitsbaum":""}`)})')"
    LIVE_TEXT="live = \`$(git rev-parse --short "$LIVE" 2>/dev/null || echo "${LIVE:0:7}")\` (${DETAIL})"
  else
    BUNDLE="$(curl -s -H 'Cache-Control: no-cache' "${SEITE}/" | grep -oE 'index-[A-Za-z0-9_-]+\.js' | head -1)"
    LIVE="unbekannt"
    LIVE_TEXT="live = \`${BUNDLE:-?}\`, Commit unbekannt (keine version.json — ausgeliefert vor deren Einführung)"
    unbekannt=1
  fi
fi

# dazwischen
if [ "$LIVE" != "unbekannt" ] && git cat-file -e "${LIVE}^{commit}" 2>/dev/null; then
  N="$(git rev-list --count "${LIVE}..origin/main")"
  if [ "$N" = "0" ]; then ZWISCHEN="live = main"; else ZWISCHEN="**${N} Commits** zwischen live und main"; fi
elif [ "$LIVE" != "unbekannt" ]; then
  ZWISCHEN="live-Commit lokal nicht bekannt (fetch?)"; unbekannt=1
else
  ZWISCHEN="Abstand nicht messbar"
fi

# PRs
PRS="$(gh pr list --state open --json number,isDraft --jq 'map("#\(.number)" + (if .isDraft then " (Entwurf)" else "" end)) | if length==0 then "keine" else join(", ") end' 2>/dev/null)" \
  || { PRS="unbekannt (gh?)"; unbekannt=1; }

echo "**Stand, gemessen $(TZ=Europe/Zurich date '+%d.%m.%Y %H:%M'):** main = \`${MAIN}\` (${MAIN_ZEIT}) · ${LIVE_TEXT} · ${ZWISCHEN} · offene PRs: ${PRS}"
exit $unbekannt
