#!/usr/bin/env bash
# ─── Lokaler Deploy zu Infomaniak (malojaplana.ch) via SFTP ──────────────────
#
# Von einem Rechner mit erlaubter IP ausführen (z.B. dem Mac der Inhaberin). Infomaniak
# blockt FTP/SSH von GitHub-CI-Rechenzentren per IP-Filter → der Auto-Deploy
# in GitHub Actions funktioniert nicht, ein lokaler Upload schon.
#
# Nutzung:
#   bash deploy.sh                      # PRODUKTION: deployt den 'main'-Stand nach malojaplana.ch
#   bash deploy.sh --stage              # STAGE/Vorschau: deployt den aktuellen Branch nach stage.malojaplana.ch
#   SFTP_PASSWORD='…' bash deploy.sh    # Passwort aus Umgebungsvariable
#   ALLOW_ANY_BRANCH=1 bash deploy.sh   # Notfall: PRODUKTION aus einem anderen Branch deployen
#   SKIP_BACKUP=1 bash deploy.sh        # Rollback-Backup der Live-Version überspringen
#
# Voraussetzungen: node/npm + lftp  (lftp installieren: brew install lftp)
# Das Passwort wird NIE in der Datei/im Repo gespeichert.
# Ausführlicher Ablauf + Rollback-Anleitung: siehe RELEASE.md.
#
# ─── STAGE-Umgebung ──────────────────────────────────────────────────────────
# `--stage` spiegelt denselben Build nach stage.malojaplana.ch statt auf die
# echte Domain. Zweck (GitHub Flow): einen Feature-Branch-Stand live
# gegenprüfen, BEVOR er über PR feat→main auf die Produktion geht. Die Stage
# ist wegwerfbar und übernimmt die Integrations-Rolle — es gibt keinen 'dev'.
# Unterschiede zur Produktion:
#   • deployt aus JEDEM Branch (typisch 'feat/…') — keine main-/origin-Sperre
#   • kein Rollback-Backup (Stage ist wegwerfbar)
#   • eigenes Remote-Ziel + eigene Abschluss-URL
# Einmalige Voraussetzung (Infomaniak-Panel, die Inhaberin): Subdomain
# stage.malojaplana.ch anlegen. Deren Docroot-Pfad unten als STAGE_REMOTE_DIR
# setzen (aus dem Panel ablesen). Zugriffsschutz übernimmt das In-App-BetaGate.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ─── Modus wählen: Produktion (default) oder Stage ───
STAGE=0
for arg in "$@"; do
  case "$arg" in
    --stage) STAGE=1 ;;
    *) echo "✗ Unbekanntes Argument: $arg  (erlaubt: --stage)"; exit 1 ;;
  esac
done

SFTP_HOST="${SFTP_HOST:-et9l2r.ftp.infomaniak.com}"
SFTP_USER="${SFTP_USER:-et9l2r_admin}"
REMOTE_DIR="${REMOTE_DIR:-/home/clients/c6c3e5438c4705c1cdcb2a0bc0130c62/sites/malojaplana.ch/}"
# Docroot der Stage-Subdomain — Pfad aus dem Infomaniak-Panel ablesen und hier
# (oder per Umgebungsvariable STAGE_REMOTE_DIR) setzen, sobald die Subdomain steht.
STAGE_REMOTE_DIR="${STAGE_REMOTE_DIR:-/home/clients/c6c3e5438c4705c1cdcb2a0bc0130c62/sites/stage.malojaplana.ch/}"

if [ "$STAGE" = "1" ]; then
  TARGET_DIR="$STAGE_REMOTE_DIR"
  TARGET_URL="https://stage.malojaplana.ch"
  ENV_NAME="STAGE (Vorschau)"
else
  TARGET_DIR="$REMOTE_DIR"
  TARGET_URL="https://malojaplana.ch"
  ENV_NAME="PRODUKTION (live)"
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')"

# ─── Release-Sicherheit: nur von 'main' deployen (= geprüfter, gemergter Stand) ──
# Grundsatz (GitHub Flow): Was live ist = 'main' = die "Reinversion". Auf einem
# Feature-Branch (feat/…) wird gebaut, über einen PR feat→main gemergt (CI grün),
# dann von 'main' deployt. Kein 'dev', kein Sync-back.
# Bewusster Ausweg (z.B. Notfall-Hotfix): ALLOW_ANY_BRANCH=1.
# Im Stage-Modus entfällt die Sperre bewusst — dort testet man ja gerade den
# Feature-Branch.
if [ "$STAGE" != "1" ]; then
  if [ "${ALLOW_ANY_BRANCH:-0}" != "1" ] && [ "$BRANCH" != "main" ]; then
    echo "✗ Du bist auf Branch '$BRANCH', nicht auf 'main'."
    echo
    echo "  So gibst du sauber eine Version raus:"
    echo "    1) PR feat→main mergen (grünes CI-Häkchen abwarten)"
    echo "    2) git checkout main && git pull"
    echo "    3) bash deploy.sh"
    echo
    echo "  Erst auf der Vorschau prüfen?          bash deploy.sh --stage"
    echo "  Nur im Notfall direkt aus '$BRANCH':  ALLOW_ANY_BRANCH=1 bash deploy.sh"
    exit 1
  fi

  # 'main' auf Stand mit der Cloud? (sonst würdest du eine veraltete Version live stellen)
  git fetch -q origin main 2>/dev/null || true
  if [ "${ALLOW_ANY_BRANCH:-0}" != "1" ] && [ -n "$(git rev-list HEAD..origin/main 2>/dev/null || true)" ]; then
    echo "✗ 'main' ist hinter 'origin/main'. Erst aktualisieren:  git pull"
    exit 1
  fi
fi

command -v lftp >/dev/null 2>&1 || { echo "✗ lftp fehlt — installieren mit:  brew install lftp"; exit 1; }

if [ -z "${SFTP_PASSWORD:-}" ]; then
  read -r -s -p "SFTP-Passwort für ${SFTP_USER}@${SFTP_HOST}: " SFTP_PASSWORD
  echo
fi

COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo '?')"
STAMP="$(date +%Y%m%d-%H%M%S)"

echo "→ Ziel: ${ENV_NAME} — ${TARGET_URL}"
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
# Im Stage-Modus kein Backup: die Vorschau ist wegwerfbar, es gibt nichts zu retten.
if [ "${SKIP_BACKUP:-0}" != "1" ] && [ "$STAGE" != "1" ]; then
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

  # Selbst-Aufräumen: .deploy-backups/ soll nicht endlos wachsen (jede volle
  # Sicherung ist ~100 MB). Wir behalten nur die neuesten KEEP_BACKUPS Stück.
  # Zahl hier anpassen, wenn du mehr/weniger Rückfallpunkte willst.
  KEEP_BACKUPS=3
  if [ -d ./.deploy-backups ]; then
    # 1) leere Fehlstart-Ordner (fehlgeschlagene Backups) entfernen
    find ./.deploy-backups -mindepth 1 -maxdepth 1 -type d -empty -exec rm -rf {} + 2>/dev/null || true
    # 2) nur die neuesten KEEP_BACKUPS behalten, ältere weg
    ls -1dt ./.deploy-backups/*/ 2>/dev/null | tail -n +$((KEEP_BACKUPS + 1)) | while read -r old; do
      echo "  ⌫ alte Rollback-Sicherung entfernen: ${old}"
      rm -rf "$old"
    done
  fi
fi

echo "→ Upload via SFTP nach ${SFTP_HOST}  (${ENV_NAME})…"
# Passwort via Umgebungsvariable (siehe Backup-Schritt) — sonderzeichensicher.
LFTP_PASSWORD="${SFTP_PASSWORD}" lftp -u "${SFTP_USER}" --env-password "sftp://${SFTP_HOST}" \
  -e "set sftp:auto-confirm yes; set net:max-retries 3; set net:timeout 20; set net:reconnect-interval-base 5; set mirror:parallel-transfer-count 4; mirror -R --verbose ./dist/ \"${TARGET_DIR}\"; bye"

echo
echo "✓ Deploy fertig — ${TARGET_URL}  (${ENV_NAME})"
echo "  Stand jetzt: Branch ${BRANCH}, Commit ${COMMIT}"
if [ "$STAGE" = "1" ]; then
  echo "  Das ist die Vorschau. Passt alles? → PR feat→main mergen, dann  bash deploy.sh  (Produktion)."
else
  echo "  Tipp: stabilen Stand markieren →  git tag -a v0.1.x -m 'Release …' && git push origin v0.1.x"
  echo "  Zurückrollen? Siehe RELEASE.md → 'Rollback'."
fi
