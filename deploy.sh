#!/usr/bin/env bash
# ─── Lokaler Deploy zu Infomaniak (malojaplana.ch) via SFTP ──────────────────
#
# Von einem Rechner mit erlaubter IP ausführen (z.B. Sophies Mac). Infomaniak
# blockt FTP/SSH von GitHub-CI-Rechenzentren per IP-Filter → der Auto-Deploy
# in GitHub Actions funktioniert nicht, ein lokaler Upload schon.
#
# Nutzung:
#   bash deploy.sh                      # fragt das Passwort sicher ab
#   SFTP_PASSWORD='…' bash deploy.sh    # Passwort aus Umgebungsvariable
#
# Voraussetzungen: node/npm + lftp  (lftp installieren: brew install lftp)
# Das Passwort wird NIE in der Datei/im Repo gespeichert.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SFTP_HOST="${SFTP_HOST:-et9l2r.ftp.infomaniak.com}"
SFTP_USER="${SFTP_USER:-et9l2r_admin}"
REMOTE_DIR="${REMOTE_DIR:-/home/clients/c6c3e5438c4705c1cdcb2a0bc0130c62/sites/malojaplana.ch/}"

command -v lftp >/dev/null 2>&1 || { echo "✗ lftp fehlt — installieren mit:  brew install lftp"; exit 1; }

if [ -z "${SFTP_PASSWORD:-}" ]; then
  read -r -s -p "SFTP-Passwort für ${SFTP_USER}@${SFTP_HOST}: " SFTP_PASSWORD
  echo
fi

echo "→ Build…"
npm run build

# Infomaniak liefert 503, wenn ein .htaccess vorhanden ist (Security-Header laufen
# übers Panel; die App nutzt Hash-Routing, braucht keine Server-Rewrites).
echo "→ .htaccess aus dem Build entfernen…"
rm -f dist/.htaccess

echo "→ Upload via SFTP nach ${SFTP_HOST}…"
lftp -c "set sftp:auto-confirm yes; set net:max-retries 3; set net:timeout 20; set mirror:parallel-transfer-count 4; open -u \"${SFTP_USER}\",\"${SFTP_PASSWORD}\" sftp://${SFTP_HOST}; mirror -R --verbose ./dist/ \"${REMOTE_DIR}\""

echo "✓ Deploy fertig — https://malojaplana.ch"
