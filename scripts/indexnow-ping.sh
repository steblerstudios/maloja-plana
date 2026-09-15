#!/usr/bin/env bash
# IndexNow-Ping (Bing, Yandex, Naver, Seznam teilen sich den Index).
# Meldet die fünf Sprach-URLs als "geändert". Nur NACH einem Deploy ausführen —
# die Schlüsseldatei public/<key>.txt muss live erreichbar sein, sonst 403/422.
#
#   bash scripts/indexnow-ping.sh
#
# Antwort 200 = angenommen, 202 = angenommen (Schlüssel wird noch geprüft),
# 403 = Schlüsseldatei nicht gefunden, 422 = URLs passen nicht zum Host, 429 = zu oft.
set -euo pipefail

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
    "https://${HOST}/",
    "https://${HOST}/?lang=de",
    "https://${HOST}/?lang=fr",
    "https://${HOST}/?lang=it",
    "https://${HOST}/?lang=en",
    "https://${HOST}/?lang=rm"
  ]
}
JSON
)
echo "IndexNow: HTTP $code"
case "$code" in 200|202) exit 0 ;; *) exit 1 ;; esac
