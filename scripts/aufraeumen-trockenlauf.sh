#!/usr/bin/env bash
# Trockenlauf für das Aufräumen verwaister Build-Dateien in assets/ (deploy.sh).
#
# Zeigt, WAS der --delete-Spiegel auf dem Server entfernen und hochladen würde —
# und ändert dabei NICHTS: lftp läuft mit --dry-run, es wird weder gesendet noch
# gelöscht. Gedacht als Beleg VOR dem ersten echten Lauf des Aufräum-Blocks.
#
# Warum ein eigenes Skript: `deploy.sh --stage` überspringt das Aufräumen bewusst
# (Stage hat keinen Altbestand), testet den Block also gar nicht. Der einzige
# ehrliche Test läuft gegen die Produktion — und der muss trocken sein.
#
# Aufruf:  bash scripts/aufraeumen-trockenlauf.sh          # Produktion, trocken
#          SFTP_PASSWORD='…' bash scripts/aufraeumen-trockenlauf.sh
#
# Voraussetzung: dist/ liegt aus einem frischen `npm run build` (das Skript baut
# nicht selbst, damit es genau den Stand zeigt, den du gleich deployen würdest).
set -euo pipefail

cd "$(dirname "$0")/.."

[ -f .deploy.local ] && . ./.deploy.local
SFTP_HOST="${SFTP_HOST:-DEIN-HOST.ftp.example.com}"
SFTP_USER="${SFTP_USER:-DEIN-USER}"
REMOTE_DIR="${REMOTE_DIR:-/home/clients/DEIN-KLIENT-HASH/sites/malojaplana.ch/}"

command -v lftp >/dev/null 2>&1 || { echo "✗ lftp fehlt — installieren mit:  brew install lftp"; exit 1; }
[ -d dist/assets ] && [ -f dist/index.html ] || { echo "✗ dist/ fehlt oder unvollständig — erst:  npm run build"; exit 1; }

LOKAL_ANZAHL="$(find dist/assets -type f | wc -l | tr -d ' ')"
LOKAL_BUNDLE="$(grep -oE 'assets/index-[A-Za-z0-9_-]+\.js' dist/index.html | head -1)"
echo "→ Lokaler Build: ${LOKAL_ANZAHL} Dateien in dist/assets/, Bundle ${LOKAL_BUNDLE:-?}"

if [ -z "${SFTP_PASSWORD:-}" ]; then
  read -r -s -p "SFTP-Passwort für ${SFTP_USER}@${SFTP_HOST}: " SFTP_PASSWORD
  echo
fi

PROTOKOLL="$(mktemp -t aufraeumen-trockenlauf)"
echo "→ Trockenlauf gegen ${SFTP_HOST}:${REMOTE_DIR%/}/assets  (nichts wird geändert)…"
# LC_ALL=C: englische lftp-Meldungen, damit die Zählung unten sprachunabhängig ist.
LC_ALL=C LFTP_PASSWORD="${SFTP_PASSWORD}" lftp -u "${SFTP_USER}" --env-password "sftp://${SFTP_HOST}" \
  -e "set sftp:auto-confirm yes; set net:max-retries 3; set net:timeout 20; mirror -R --delete --dry-run --verbose ./dist/assets/ \"${REMOTE_DIR%/}/assets\"; bye" \
  > "$PROTOKOLL" 2>&1 || { echo "✗ lftp-Fehler:"; tail -5 "$PROTOKOLL"; exit 1; }

# Gezählt wird über die BEFEHLSZEILEN, nicht über die Meldungen. Gemessen am
# 15.09.2026 gegen die Produktion: lftp schreibt pro ersetztem File «Removing old
# file …» UND «Transferring file …», dazu je einen «rm»- bzw. «get -e»-Befehl —
# eine Zählung über die Meldungen war deshalb doppelt (11185 statt 5535).
#   rm  <url>          = echtes Löschen einer verwaisten Datei
#   get -e … <lokal>   = Ersetzen einer aktuellen Datei (-e = Ziel vorher löschen)
# Zur Gegenprobe steht lftps eigene Summe («Removed: … files», «Modified: … files»)
# am Ende des Protokolls; beide Zahlen müssen übereinstimmen.
grep '^rm ' "$PROTOKOLL" | grep -oE '/assets/[^ ]+' | sed 's#.*/assets/##' | sort -u > "${PROTOKOLL}.rm" || true
grep '^get ' "$PROTOKOLL" | grep -oE 'dist/assets/[^ ]+' | sed 's#dist/assets/##' | sort -u > "${PROTOKOLL}.get" || true
ENTFERNEN="$(wc -l < "${PROTOKOLL}.rm" | tr -d ' ')"
SENDEN="$(wc -l < "${PROTOKOLL}.get" | tr -d ' ')"
LFTP_REMOVED="$(grep -oE '^Removed: [0-9]+ directories, [0-9]+ files' "$PROTOKOLL" | grep -oE '[0-9]+ files' | grep -oE '[0-9]+' || echo '?')"
LFTP_MODIFIED="$(grep -oE '^Modified: [0-9]+ files' "$PROTOKOLL" | grep -oE '[0-9]+' || echo '?')"

echo
echo "  Würde entfernen (verwaist):   ${ENTFERNEN} Dateien   (lftp-Summe: ${LFTP_REMOVED})"
echo "  Würde ersetzen (aktuell):     ${SENDEN} Dateien   (lftp-Summe: ${LFTP_MODIFIED})"
echo "  Protokoll:                    ${PROTOKOLL}"
echo

# Plausibilität: Was entfernt würde, darf NICHT im lokalen Build liegen; was
# ersetzt würde, MUSS im lokalen Build liegen; und meine Zählung muss lftps
# eigener Summe entsprechen. Ein Treffer heisst: Muster falsch oder Build
# veraltet — dann nicht deployen, sondern erst schauen.
FEHLER=0
while IFS= read -r f; do
  [ -n "$f" ] && [ -f "dist/assets/$f" ] && { echo "  ✗ würde entfernen, liegt aber im lokalen Build: $f"; FEHLER=1; }
done < "${PROTOKOLL}.rm"
while IFS= read -r f; do
  [ -n "$f" ] && [ ! -f "dist/assets/$f" ] && { echo "  ✗ würde ersetzen, liegt aber nicht im lokalen Build: $f"; FEHLER=1; }
done < "${PROTOKOLL}.get"
if [ "$LFTP_REMOVED" != "?" ] && [ "$LFTP_REMOVED" != "$ENTFERNEN" ]; then
  echo "  ✗ Zählung (${ENTFERNEN}) und lftp-Summe (${LFTP_REMOVED}) stimmen nicht überein."; FEHLER=1
fi
if [ "$LFTP_MODIFIED" != "?" ] && [ "$LFTP_MODIFIED" != "$SENDEN" ]; then
  echo "  ✗ Zählung (${SENDEN}) und lftp-Summe (${LFTP_MODIFIED}) stimmen nicht überein."; FEHLER=1
fi

if [ "$FEHLER" = "1" ]; then
  echo "✗ Trockenlauf NICHT plausibel — nichts deployen, Protokoll lesen."
  exit 1
fi
if [ "$ENTFERNEN" = "0" ] && [ "$SENDEN" = "0" ]; then
  echo "  (0/0 kann heissen: Server ist schon sauber — ODER die Zählmuster passen nicht zur lftp-Ausgabe."
  echo "   Gegenprobe: Protokoll öffnen und die ersten Zeilen lesen.)"
fi
echo "✓ Trockenlauf fertig. Nichts wurde geändert."
