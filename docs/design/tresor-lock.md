# Tresor-Lock — Design-Spec (At-Rest-Schutz)

> Echtes „Schloss auf meinen Unterlagen"-Gefühl, local-first, ohne Server.
> Gemeinsam mit Stebler Studios entschieden, 2026-07-13. **Konzept — noch nicht
> gebaut.** Braucht ausdrückliche Bau-Freigabe.
>
> Auslöser: Sicherheits-Befund dieser Sitzung — die Daten (`or5_data` etc.) liegen
> heute **unverschlüsselt** im localStorage; das Beta-Gate ist nur eine UI-Hürde
> (`BetaGate.jsx:10-13`). Verwandt: `docs/design/design-backlog.md` E, `maloja-trust-layer`.

Stand: Kern-Entscheide geklärt, Spec festgehalten. Verwandt: [[maloja-trust-layer]].

## ⛔ HARTE VORBEDINGUNG für Phase 2b (UI-Verdrahtung) — vor JEDER Aktivierung beheben

Der Predeploy-Review (2026-07-13, Runde 3) hat am gebauten, noch **dormant**en
`secureStore`-Fundament vier bestätigte 🔴 gefunden. Sie sind aktuell **kein Live-Risiko**
(nichts aktiviert den Tresor), MÜSSEN aber behoben sein, **bevor** irgendeine UI den Tresor
aktivierbar macht — sonst würde der Tresor ein Schutzversprechen geben, das er nicht hält:

1. **Dokumente bleiben unverschlüsselt.** `secureStore.js` verschlüsselt nur den
   `or5_docs`-**Metadaten**-String; die echten Dokument-Dateien (Ausweis-Scans, Arzt-PDFs
   als dataURLs) liegen weiter im Klartext in **IndexedDB**. Vor dem Verschlüsseln müssen die
   Blobs hydriert werden (wie es der Backup-Pfad via `collectBackupDataAsync`/`getDocBlob`
   bereits tut).
2. **Klartext-Reste überleben.** `activateVault` → `clearStores()` entfernt nur `VAULT_STORES`,
   nicht die `or5_*_prerestore`-Klartext-Kopien (aus `createPreRestoreSnapshot`) → vollständiger
   unverschlüsselter Datensatz bleibt neben dem Chiffrat liegen.
3. **Crash statt Fehlermeldung.** `unlockVault` ruft `unpackRecord`/`atob` VOR dem try/catch →
   korrupter Record wirft rohen `DOMException` statt der freundlichen „beschädigt"-Meldung
   (verletzt die 3-States-Regel aus `src/CLAUDE.md`).
4. **Leeres Backup bei aktivem Tresor.** `collectBackupData` liest `or5_data` etc. direkt aus
   localStorage — die der aktive Tresor gerade entfernt hat → Backup-Datei wäre leer, sieht
   aber gültig aus. Datenverlust-Falle beim späteren Restore.

Zusätzlich (Security-Härtung vor 2b): **PBKDF2 100'000 → ~600'000 Iterationen** (OWASP 2026;
versioniert im Record-Header, Fallback 100k für Alt-Daten), **Passphrase-Mindestlänge/-stärke**
in `secureStore` (wie `backupCrypto` bereits ≥4), **Backup-Export-Zwang** im Aktivierungs-Flow
erzwingen (nicht nur Doku-Konvention), und `VAULT_*` → `TRESOR_*`/`LOCK_*` umbenennen
(Abgrenzung zu `crypto/vault.js` Level 2).

Beleg: `/maloja-predeploy` Runde 3, `sicherheits-pruefer` + `/code-review` (alle CONFIRMED).

## 0. Einordnung ins Gesamtmodell (ADR-011)

Dieses Dokument beschreibt **Level 1** aus [ADR-011](../architecture/ADR-011-auth-strategy.md)
(„Local Auth / Encryption at Rest") — Passphrase → Schlüssel → lokale Stores
ver-/entschlüsseln, **ohne Server**. Zur Vermeidung von Verwechslungen die drei
Krypto-Flächen im Repo:

| Modul | ADR-011 | Status | Zweck |
|---|---|---|---|
| `src/utils/backupCrypto.js` | (danebenliegend) | **live** (via `ZipExport.jsx`) | Passphrase-verschlüsselte Backup-**Datei** (Download/Import) |
| `src/utils/secureStore.js` | **Level 1** (dieses Dok) | dormant, gebaut | Tresor-Lock: lokale Stores *in place* ver-/entschlüsseln |
| `src/crypto/vault.js` | **Level 2** (vertagt, → §5) | dormant, PLAN/ENTWURF, **nicht deployt** | Server-gestütztes Zero-Knowledge-Backup (Envelope DEK/KEK, Passkey-PRF + Recovery) |

Alle drei nutzen dieselbe Web-Crypto-Basis, aber **verschiedene Schutzmodelle** —
`secureStore` ist bewusst schlicht (nur Passphrase), `crypto/vault.js` ist das
Envelope-Modell für die Logins-Phase (§5). Sie sind **nicht redundant**.

**Begriffe (Abgrenzung):** „Tresor" / „Lock" = Level-1-At-Rest (dieses Dokument,
`secureStore.js`). „Vault" (Envelope, Recovery, Server) = Level 2 (`crypto/vault.js`,
[SECURITY_PHASE_1_PLAN.md](../context/SECURITY_PHASE_1_PLAN.md)). `secureStore.js`
trägt intern noch `VAULT_*`-Bezeichner aus der Bauphase — solange dormant und ohne
gespeichertes Chiffrat unkritisch; vor dem Verdrahten (Phase 2b) auf `TRESOR_*`/`LOCK_*`
abgrenzen, damit „Vault" eindeutig für Level 2 reserviert bleibt.

---

## 1. Grundmodell — Client-Verschlüsselung mit Passphrase

Kein neues Krypto erfinden: **dieselbe Primitive wie `src/utils/backupCrypto.js`**
(AES-256-GCM + PBKDF2, 100'000 Iterationen, `deriveKey(passphrase, salt)`).

- **Aktivieren (opt-in):** Nutzer setzt eine Passphrase → Schlüssel ableiten → die
  persönlichen Stores werden verschlüsselt in localStorage abgelegt.
- **App-Start:** Passphrase eingeben → in den Speicher entschlüsseln.
- **Speichern:** mit demselben Schlüssel neu verschlüsseln.

**Ehrlichkeit (nicht verhandelbar):** Ein reiner PIN/Passwort *ohne* Verschlüsselung
wäre nur eine UI-Hürde (gleiche Klasse wie das Beta-Gate) und löst das Problem
**nicht**. Echt = Verschlüsselung.

## 2. Kern-Entscheide (2026-07-13)

| Entscheid | Jetzt | Später (Logins-Phase) |
|---|---|---|
| Aktivierung | **opt-in** — local-first ohne Lock bleibt Default | Pflicht/Login nochmals besprechen |
| Umfang | **nur Passphrase** (solide Basis zuerst) | Biometrie / Face ID / Passkey (WebAuthn) |
| Stores | **alles Persönliche**: `or5_data`, `or5_docs`, `or5_reminders`, `or5_merkliste`, `or5_contacts` | — |
| Recovery | **was jetzt Sinn macht:** Backup-Export beim Setup als Recovery-Pfad | mit Logins/Native nochmals anschauen |

## 3. Das Datenverlust-Risiko

Local-first, kein Server → **vergessene Passphrase = Daten weg.** Muss ehrlich und
ruhig kommuniziert werden (kein Angst-UX, aber klar). Recovery-Pfad jetzt: beim
Aktivieren einen **verschlüsselten Backup-Export** anbieten/erzeugen (den man
woanders sichert) — nutzt den bestehenden `exportEncrypted`-Pfad.

## 4. Migration

Beim Aktivieren die bestehenden Klartext-Stores einmalig verschlüsseln (in-place,
additiv — ein Marker `or5_locked` o. ä. zeigt den Zustand). Deaktivieren =
entschlüsseln zurück. Kein Datenverlust bei sauberem Ab-/Anschalten.

## 5. Bewusst vertagt → „Logins-Phase" (Grundsatzentscheid nötig)

> **Es existiert bereits ein Client-Baustein dafür:** [`src/crypto/vault.js`](../../src/crypto/vault.js)
> (Envelope DEK/KEK, Passkey-PRF + Recovery-Codes, Chiffrat-Upload) aus
> [SECURITY_PHASE_1_PLAN.md](../context/SECURITY_PHASE_1_PLAN.md) — Status PLAN/ENTWURF,
> Server nicht deployt. Das ist **Level 2** (ADR-011), ein anderes Schutzmodell als der
> Level-1-Tresor hier. Beim Bau der Logins-Phase dort andocken, nicht neu erfinden.

Stebler-Studios-Vision: **beim nativen Download einen Ordner auf dem Gerät anlegen
und an einen Secure Safe anschliessen** (OS-Sicherheitsspeicher: iOS Keychain /
Secure Enclave, Android Keystore; ggf. Files-App-Ordner). Das ist ein **Native-App-
Thema** (hängt am App-Store/iOS-Backlog-Punkt) und verändert das Schutzmodell
grundlegend — darum erst dort entscheiden:
- Biometrie/Passkey als bequemer Unlock (gibt den abgeleiteten Schlüssel frei).
- Pflicht-Lock / echtes Login.
- Schlüssel im OS-Secure-Store statt/zusätzlich zur Passphrase.
- PWA vs. native (Capacitor o. ä.) — bestimmt, welche Secure-APIs verfügbar sind.

## 6. Offen vor dem Bau

- Bau-Freigabe (Verschlüsselung berührt ALLE Daten — hohe Sorgfalt).
- UX der Passphrase-Wand (Barrierefreiheit: „Einfache Ansicht"/Vorlesen davor?
  Rechtliches muss wie beim Beta-Gate ohne Passphrase lesbar bleiben).
- Performance (Entschlüsseln bei jedem Start) + Verhalten bei vollem Speicher.
- Zusammenspiel mit dem Backup/Export und dem Beta-Gate.
