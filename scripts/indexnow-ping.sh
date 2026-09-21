#!/usr/bin/env bash
# IndexNow-Ping (Bing, Yandex, Naver, Seznam teilen sich den Index).
# Meldet die kanonische URL als "geändert". Nur NACH einem Deploy ausführen —
# die Schlüsseldatei public/<key>.txt muss live erreichbar sein, sonst 403/422.
#
#   bash scripts/indexnow-ping.sh
#
# Antwort 200 = angenommen, 202 = angenommen (Schlüssel wird noch geprüft),
# 403 = Schlüsseldatei nicht gefunden, 422 = URLs passen nicht zum Host, 429 = zu oft.
set -euo pipefail

# Nur die kanonische URL. Bis 20.09.2026 standen hier zusätzlich die fünf
# ?lang=-Adressen — sie liefern gemessen byte-identisches HTML und zeigen
# canonical auf "/", eine Meldung darüber ist also eine Meldung über "/".
# Zurück kommen sie, wenn die Sprachvarianten eigenen Inhalt ausliefern.
# Siehe public/sitemap.xml und docs/audits/seo-audit-2026-09-20.md
HOST="malojaplana.ch"
KEY="0c31c72b57ddb2ec70030591f84ee0f9"
KEY_URL="https://${HOST}/${KEY}.txt"

# Schlüsseldatei muss live sein, bevor gepingt wird.
live=$(curl -sS -o /dev/null -w "%{http_code}" "$KEY_URL")
if [ "$live" != "200" ]; then
  echo "✗ Schlüsseldatei nicht live ($live): $KEY_URL — zuerst deployen." >&2
  exit 1
fi

code=$(curl -sS -o /dev/null -w "%{http_code}" \
  -H "Content-Type: application/json; charset=utf-8" \
  -X POST "https://api.indexnow.org/indexnow" \
  --data @- <<JSON
{
  "host": "${HOST}",
  "key": "${KEY}",
  "keyLocation": "${KEY_URL}",
  "urlList": [
    "https://${HOST}/"
  ]
}
JSON
)
echo "IndexNow: HTTP $code"
case "$code" in 200|202) exit 0 ;; *) exit 1 ;; esac
