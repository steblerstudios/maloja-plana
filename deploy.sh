#!/usr/bin/env bash
# ─── Lokaler Deploy zu Infomaniak (malojaplana.ch) via SFTP ──────────────────
#
# Von einem Rechner mit erlaubter IP ausführen (z.B. Sophies Mac). Infomaniak
# blockt FTP/SSH von GitHub-CI-Rechenzentren per IP-Filter → der Auto-Deploy
# in GitHub Actions funktioniert nicht, ein lokaler Upload schon.
#
# Nutzung:
#   bash deploy.sh                      # deployt den 'main'-Stand, fragt Passwort ab
#   SFTP_PASSWORD='…' bash deploy.sh    # Passwort aus Umgebungsvariable
#   ALLOW_ANY_BRANCH=1 bash deploy.sh   # Notfall: aus einem anderen Branch deployen
#   SKIP_BACKUP=1 bash deploy.sh        # Rollback-Backup der Live-Version überspringen
#
# Voraussetzungen: node/npm + lftp  (lftp installieren: brew install lftp)
# Das Passwort wird NIE in der Datei/im Repo gespeichert.
# Ausführlicher Ablauf + Rollback-Anleitung: siehe RELEASE.md.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SFTP_HOST="${SFTP_HOST:-et9l2r.ftp.infomaniak.com}"
SFTP_USER="${SFTP_USER:-et9l2r_admin}"
REMOTE_DIR="${REMOTE_DIR:-/home/clients/c6c3e5438c4705c1cdcb2a0bc0130c62/sites/malojaplana.ch/}"

# ─── Release-Sicherheit: nur von 'main' deployen (= geprüfter, gemergter Stand) ──
# Grundsatz: Was live ist = 'main' = die "Reinversion". Auf 'dev' wird gebaut,
# über einen PR dev→main gemergt (CI grün), dann von 'main' deployt.
# Bewusster Ausweg (z.B. Notfall-Hotfix): ALLOW_ANY_BRANCH=1.
BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')"
if [ "${ALLOW_ANY_BRANCH:-0}" != "1" ] && [ "$BRANCH" != "main" ]; then
  echo "✗ Du bist auf Branch '$BRANCH', nicht auf 'main'."
  echo
  echo "  So gibst du sauber eine Version raus:"
  echo "    1) PR dev→main mergen (grünes CI-Häkchen abwarten)"
  echo "    2) git checkout main && git pull"
  echo "    3) bash deploy.sh"
  echo
  echo "  Nur im Notfall direkt aus '$BRANCH':  ALLOW_ANY_BRANCH=1 bash deploy.sh"
  exit 1
fi

# 'main' auf Stand mit der Cloud? (sonst würdest du eine veraltete Version live stellen)
git fetch -q origin main 2>/dev/null || true
if [ "${ALLOW_ANY_BRANCH:-0}" != "1" ] && [ -n "$(git rev-list HEAD..origin/main 2>/dev/null || true)" ]; then
  echo "✗ 'main' ist hinter 'origin/main'. Erst aktualisieren:  git pull"
  exit 1
fi

command -v lftp >/dev/null 2>&1 || { echo "✗ lftp fehlt — installieren mit:  brew install lftp"; exit 1; }

if [ -z "${SFTP_PASSWORD:-}" ]; then
  read -r -s -p "SFTP-Passwort für ${SFTP_USER}@${SFTP_HOST}: " SFTP_PASSWORD
  echo
fi

COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo '?')"
STAMP="$(date +%Y%m%d-%H%M%S)"

echo "→ Build…  (Branch ${BRANCH}, Commit ${COMMIT})"
npm run build

# Infomaniak liefert 503, wenn ein .htaccess vorhanden ist (Security-Header laufen
# übers Panel; die App nutzt Hash-Routing, braucht keine Server-Rewrites).
echo "→ .htaccess aus dem Build entfernen…"
rm -f dist/.htaccess

# ─── Rollback-Sicherung: aktuelle Live-Version sichern, BEVOR sie überschrieben wird ──
# Spiegelt den aktuellen Remote-Stand nach ./.deploy-backups/<zeit>/ (gitignored).
# Zurückrollen: den gesicherten Ordner wieder hochspielen (siehe RELEASE.md → Rollback).
# Nicht-fatal: schlägt das Backup fehl, läuft der Deploy trotzdem weiter.
if [ "${SKIP_BACKUP:-0}" != "1" ]; then
  BACKUP_DIR="./.deploy-backups/${STAMP}"
  mkdir -p "$BACKUP_DIR"
  echo "→ Rollback-Backup der aktuellen Live-Version nach ${BACKUP_DIR}…"
  # Passwort via Umgebungsvariable (LFTP_PASSWORD + --env-password), NICHT im
  # Befehlstext — so können Sonderzeichen (Komma, ", \, $ …) nichts zerbrechen.
  # net:max-retries begrenzt: bei Verbindungsproblemen gibt das Backup auf,
  # statt endlos „Verbinde…" zu schleifen (der Upload unten ist das Wichtige).
  LFTP_PASSWORD="${SFTP_PASSWORD}" lftp -u "${SFTP_USER}" --env-password "sftp://${SFTP_HOST}" \
    -e "set sftp:auto-confirm yes; set net:timeout 15; set net:max-retries 2; set net:reconnect-interval-base 5; mirror --verbose \"${REMOTE_DIR}\" \"${BACKUP_DIR}\"; bye" \
    || echo "  ⚠️ Backup fehlgeschlagen — Deploy läuft trotzdem weiter."
fi

echo "→ Upload via SFTP nach ${SFTP_HOST}…"
# Passwort via Umgebungsvariable (siehe Backup-Schritt) — sonderzeichensicher.
LFTP_PASSWORD="${SFTP_PASSWORD}" lftp -u "${SFTP_USER}" --env-password "sftp://${SFTP_HOST}" \
  -e "set sftp:auto-confirm yes; set net:max-retries 3; set net:timeout 20; set net:reconnect-interval-base 5; set mirror:parallel-transfer-count 4; mirror -R --verbose ./dist/ \"${REMOTE_DIR}\"; bye"

echo
echo "✓ Deploy fertig — https://malojaplana.ch"
echo "  Live jetzt: Branch ${BRANCH}, Commit ${COMMIT}"
echo "  Tipp: stabilen Stand markieren →  git tag -a v0.1.x -m 'Release …' && git push origin v0.1.x"
echo "  Zurückrollen? Siehe RELEASE.md → 'Rollback'."
