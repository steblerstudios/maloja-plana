#!/usr/bin/env bash
# ─── PII-Scan: verhindert, dass Persönliches ins öffentliche Repo/Live geht ──
#
# Durchsucht alle GETRACKTEN Dateien nach typischen Datenschutz-Lecks:
#   • private E-Mail-Adressen (Gmail, GMX, Bluewin …)
#   • Home-Pfade mit echtem Benutzernamen (/Users/<name>, /home/<name>)
#   • Server-/Klient-Hashes (/home/clients/<hash>)
#   • zusätzliche, projektspezifische Tokens aus der lokalen Datei .pii-deny.txt
#     (Vornamen, Benutzername, Hoster-Kennungen — bewusst NICHT im Repo)
#
# Erlaubt bleibt der gesetzlich nötige volle Name im Impressum ("… Stebler"),
# die Firmen-/Projekt-Mail und die Platzhalter in *.example-Dateien.
#
# Exit 0 = sauber · Exit 1 = etwas gefunden (Details werden ausgegeben).
# Nutzung:  bash scripts/pii-scan.sh      (Teil des Deploy-Gates /maloja-predeploy)
set -uo pipefail
cd "$(dirname "$0")/.." || exit 2

# Generische Verbots-Muster (enthalten selbst KEINE echten Daten):
#  • private Mail-Provider · Home-Pfad mit Benutzernamen · Server-/Klient-Hash.
#  (Kein generisches /home/<x>: Behörden-URLs enthalten „/home/" und wären
#   Fehlalarme — nur der konkrete Klient-Pfad /home/clients/<hash> zählt.)
DENY='@(gmail|gmx|hotmail|outlook|yahoo|icloud|protonmail|proton|bluewin|hispeed|sunrise|windowslive)\.
/Users/[A-Za-z0-9._-]+
/home/clients/[0-9a-f]{8,}'

# Projektspezifische Tokens aus lokaler, gitignorierter Datei ergänzen:
[ -f .pii-deny.txt ] && DENY="$DENY
$(grep -vE '^\s*#|^\s*$' .pii-deny.txt)"

# Ausnahmen (erlaubt, obwohl sie ein Muster treffen könnten):
#  • Voller Name im Impressum (nDSG) · Marken-/Rollen-Begriff „Stebler Studios"
#    (Space UND Bindestrich) — sonst würde ein Nachnamen-Deny-Token die 200+
#    Marken-Nennungen fälschlich flaggen (CI-Falle 2026-07-14).
ALLOW='Sophie Stebler
Stebler[- ]Studios
info@malojaplana
/Users/USER
DEIN-HOST
DEIN-USER
DEIN-KLIENT-HASH'

# Ausschlüsse: der Scan selbst, Vorlagen, die lokale Deny-Liste und Fremd-
# Bibliotheken (public/vendor — deren Copyright-Header nennen Autoren-Mails).
# (docs/archive wurde 2026-07-14 ganz aus dem Repo genommen — kein Ausschluss
#  mehr nötig; käme je wieder Archiv-Material rein, wird es mitgeprüft.)
HITS=$(git grep -nIP -f <(printf '%s\n' "$DENY") -- \
        ':!scripts/pii-scan.sh' ':!*.example' ':!.pii-deny.txt' \
        ':!public/vendor/**' 2>/dev/null \
      | grep -vE -f <(printf '%s\n' "$ALLOW") || true)

if [ -n "$HITS" ]; then
  echo "✗ PII-Scan: mögliche persönliche/sensible Daten in getrackten Dateien:"
  echo "$HITS" | sed 's/^/    /'
  echo
  echo "  → Bereinigen (Rollen-Begriff/Firmen-Mail/Platzhalter) oder, falls ein"
  echo "    Treffer bewusst erlaubt ist, die ALLOW-Liste in scripts/pii-scan.sh"
  echo "    bzw. den Kontext anpassen. Legaler Name gehört NUR ins Impressum."
  exit 1
fi

echo "✓ PII-Scan: keine privaten Mails, Home-Pfade oder gesperrten Tokens in getrackten Dateien."
exit 0
