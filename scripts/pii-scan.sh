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
# 🛑 Fehlt die Liste, LIEF DIESER SCAN BISHER STILL WEITER — nur mit den generischen
# Mustern, ohne Vornamen und Benutzernamen, und meldete «sauber». Genau so ist am
# 23.09.2026 ein Vorname nach `main` gelangt: der Commit entstand in einem frischen
# Worktree, und `.pii-deny.txt` ist gitignoriert, wird also nicht mitkopiert.
# Ein Wächter, der ohne seine halbe Regelmenge arbeitet und das verschweigt, ist
# schlimmer als keiner — er erteilt eine Freigabe, die er nicht decken kann.
# Exit 2 = Scan unvollständig, NICHT «sauber».
if [ ! -f .pii-deny.txt ]; then
  echo "✗ PII-Scan NICHT gelaufen: .pii-deny.txt fehlt in $(pwd)." >&2
  echo "  Der Scan liefe sonst ohne die projektspezifischen Tokens (Vorname," >&2
  echo "  Benutzername, Hoster-Kennungen) und meldete faelschlich «sauber»." >&2
  echo "  In einem Worktree verlinken:  ln -s ../../../.pii-deny.txt .pii-deny.txt" >&2
  echo "  Vorlage: .pii-deny.txt.example" >&2
  exit 2
fi
DENY="$DENY
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
# Ausnahmen gelten nur für die erlaubte Stelle selbst, nicht für die ganze Zeile
# (Befund 16.09.2026: eine Zeile mit «Stebler Studios» verdeckte einen fremden
# Namen daneben). Darum: erlaubte Teile herausschneiden, Rest erneut prüfen.
# perl statt grep -P: läuft gleich auf macOS und Linux und versteht dieselben
# PCRE-Muster wie git grep -P. Ein Muster, das perl nicht versteht, bricht ab
# (Exit 2), statt still «sauber» zu melden.
# public/licenses/** ist ausgenommen (23.09.2026): das sind fremde Lizenztexte, die
# wortgetreu mitgeliefert werden MÜSSEN — MIT verlangt «shall be included in all
# copies». Die Copyright-Zeilen darin nennen fremde Autoren samt E-Mail
# (z. B. loose-envify). Sie zu kürzen wäre ein Lizenzverstoss, nicht Datenschutz.
# Die Ausnahme gilt NUR diesem Ordner; Lizenztexte werden nie von Hand bearbeitet.
HITS=$(git grep -nIP -f <(printf '%s\n' "$DENY") -- \
        ':!scripts/pii-scan.sh' ':!*.example' ':!.pii-deny.txt' \
        ':!public/vendor/**' ':!public/licenses/**' 2>/dev/null \
      | DENY="$DENY" ALLOW="$ALLOW" perl -ne '
          BEGIN {
            @d = grep { length } split /\n/, $ENV{DENY};
            @a = grep { length } split /\n/, $ENV{ALLOW};
            for (@d, @a) { eval { qr/$_/ } or do { print STDERR "Muster ungültig: $_\n"; exit 2 } }
          }
          chomp; my $z = $_; (my $rest = $z) =~ s/^[^:]*:\d+://;
          $rest =~ s/$_//g for @a;
          for my $p (@d) { if ($rest =~ /$p/) { print "$z\n"; last } }
        ')
[ $? -eq 2 ] && { echo "✗ PII-Scan: Muster ungültig (siehe oben)"; exit 2; }

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
