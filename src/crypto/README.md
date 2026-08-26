# crypto/ — bewusst dormant (kein Toter Code)

Dieser Ordner enthält den Krypto-Kern für ein **optionales Zero-Knowledge-Server-Backup**:
[`vault.js`](./vault.js) (Envelope-Verschlüsselung, Phase 1) mit eigener Testdatei
([`__tests__/vault.test.js`](./__tests__/vault.test.js), 13 Tests). Reines WebCrypto,
keine Krypto-Bibliothek. Spec: [`docs/context/SECURITY_PHASE_1_PLAN.md`](../../docs/context/SECURITY_PHASE_1_PLAN.md).

## Status: gebaut, getestet — im Produkt NICHT verdrahtet

Kein `.jsx` und kein aktiver `.js`-Pfad importiert `vault.js`. Die einzige Erwähnung im
Quelltext ist ein **Kommentar** in [`../utils/secureStore.js`](../utils/secureStore.js) (Zeile 7),
der die Namensgebung abgrenzt — kein Import. Ein `grep` nach `crypto/vault` findet also genau
diese eine Kommentarzeile plus die Tests, sonst nichts.

**Das ist Absicht, kein Rückstand** — dieselbe Lage wie bei [`../runtime/`](../runtime/README.md):

- Der **Tresor** (`utils/secureStore.js`) ist **Level 1**: At-Rest-Verschlüsselung der lokalen
  Stores mit einer Passphrase. Auch er ist heute dormant (2b-UI bewusst zuletzt, mit der
  Logins-Phase).
- Der **Vault** (`crypto/vault.js`) ist **Level 2**: Envelope/Recovery/Server — der DEK wird
  doppelt gewrappt (WebAuthn-PRF **oder** Recovery-Code), nur das Chiffrat verlässt das Gerät.
  Das ergibt erst dann Sinn, wenn es überhaupt einen **Server-Backup-Weg** gibt.

Maloja ist heute **local-first, ohne Server, ohne Konten** (CSP `connect-src 'self'`, keine
Netzwerkpfade in `src/`). Ein Server-seitiges Zero-Knowledge-Backup ist also eine Stufe, die
das Produkt bewusst noch **nicht** anbietet. Der Kern liegt vorgebaut und getestet bereit,
statt halbfertig mitzulaufen.

## Wann wird er verdrahtet?

Erst wenn ein optionales **Server-Backup** tatsächlich gebaut wird (die Person entscheidet sich,
eine verschlüsselte Kopie ausser Haus zu legen). Dann wird `vault.js` für *dieses* Feature
verdrahtet — mit dem Krypto-Design aus `SECURITY_PHASE_1_PLAN.md` als Teil der Definition-of-Done.
Nie „auf Vorrat" pauschal einschalten; nichts verlässt ohne ausdrückliche Handlung der Person
das Gerät.

## Warum dieses README existiert

Ohne diesen Zettel sah `vault.js` in einer Architektur-Durchsicht (2026-07-20) wie **vergessener
toter Code** aus — anders als `runtime/`, das seinen Status selbst erklärt. Der Code ist echt und
gehört zu einem bewussten Krypto-Plan; dieses README hält das fest, damit die nächste Durchsicht
ihn nicht fälschlich als Altlast behandelt (oder löscht).
