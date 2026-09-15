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
LOKAL_BUNDLE="$(grep -oE 'assets/index-[a-z0-9]+\.js' dist/index.html | head -1)"
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

ENTFERNEN="$(grep -cE '^(rm |Removing )' "$PROTOKOLL" || true)"
SENDEN="$(grep -cE '^(get |put |Transferring |Sending )' "$PROTOKOLL" || true)"

echo
echo "  Würde entfernen:  ${ENTFERNEN} Dateien"
echo "  Würde senden:     ${SENDEN} Dateien"
echo "  Protokoll:        ${PROTOKOLL}"
echo

# Plausibilität: Was gesendet würde, muss lokal existieren; was entfernt würde,
# darf NICHT im lokalen Build liegen. Ein Treffer hier heisst: Muster falsch
# gezählt oder Build veraltet — dann nicht deployen, sondern erst schauen.
FEHLER=0
grep -E '^(rm |Removing )' "$PROTOKOLL" | grep -oE 'assets/[^ '"'"'`]+' | sed 's#^assets/##' | sort -u > "${PROTOKOLL}.rm" || true
while IFS= read -r f; do
  [ -n "$f" ] && [ -f "dist/assets/$f" ] && { echo "  ✗ würde entfernen, liegt aber im lokalen Build: $f"; FEHLER=1; }
done < "${PROTOKOLL}.rm"

if [ "$FEHLER" = "1" ]; then
  echo "✗ Trockenlauf NICHT plausibel — nichts deployen, Protokoll lesen."
  exit 1
fi
if [ "$ENTFERNEN" = "0" ] && [ "$SENDEN" = "0" ]; then
  echo "  (0/0 kann heissen: Server ist schon sauber — ODER die Zählmuster passen nicht zur lftp-Ausgabe."
  echo "   Gegenprobe: Protokoll öffnen und die ersten Zeilen lesen.)"
fi
echo "✓ Trockenlauf fertig. Nichts wurde geändert."
