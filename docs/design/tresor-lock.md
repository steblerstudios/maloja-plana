# Tresor-Lock — Design-Spec (At-Rest-Schutz)

> Echtes „Schloss auf meinen Unterlagen"-Gefühl, local-first, ohne Server.
> Gemeinsam mit Stebler Studios entschieden, 2026-07-13. **Konzept — noch nicht
> gebaut.** Braucht ausdrückliche Bau-Freigabe.
>
> Auslöser: Sicherheits-Befund dieser Sitzung — die Daten (`or5_data` etc.) liegen
> heute **unverschlüsselt** im localStorage; das Beta-Gate ist nur eine UI-Hürde
> (`BetaGate.jsx:10-13`). Verwandt: `docs/design/design-backlog.md` E, `maloja-trust-layer`.

Stand: Kern-Entscheide geklärt, Spec festgehalten. Verwandt: [[maloja-trust-layer]].

## ⏸️ 2b-UI BEWUSST VERTAGT (Entscheid Stebler Studios, 2026-07-18)

**Die Live-Verdrahtung (2b-UI) wird NICHT jetzt gebaut.** Grundsatz-Entscheid: Der
Tresor/Login ist der komplexeste und folgenreichste Schritt (fasst ALLE Nutzerdaten
an, L5) — er kommt **zuletzt**, wenn der Rest der App gebaut und stabil ist, gebündelt
mit der **„Logins-Phase"** (App-Store/iOS-Recherche, §5). Sonst müsste die
Verschlüsselungs-Schicht bei jedem neuen Feature wieder angefasst werden — genau dort
passieren die teuren Fehler. Das deckt sich mit `SESSION_START.md` (Tresor unter
„Bau-Freigabe nötig / Logins-Phase") und war die ursprüngliche Abmachung.

- **2b-pre (PR #100, schon in `main`)** = nur das Krypto-**Fundament** (`secureStore.js`),
  **dormant**, berührt keine Live-Daten — das durfte gefahrlos liegen bleiben.
- **LockScreen (PR #102)** = die Entsperr-**Wand**, dev-only, nicht im Prod-Bundle.
- **2b-UI (unten „Offen für Phase 2b-UI")** = die eigentliche Live-Verdrahtung an alle
  Daten. **Erst in der Logins-Phase, mit ausdrücklicher Bau-Freigabe.**

> ⚠️ **Für künftige Handoffs/Sessions:** 2b-UI ist NICHT „der nächste Schritt". Nicht
> wieder als sofort-fällige Aufgabe teed. Ein früherer Handoff hat das getan → Verwirrung.
> Reichweiten-Befund (falls doch gebaut wird): die 5 Tresor-Stores werden quer durch die
> App direkt aus `localStorage` gelesen/geschrieben (`reminders.js`, `merkliste.js`,
> `notifications.js`, `OverdueBanner.jsx`, `MerklisteView.jsx`, `docReminders.js`,
> `autoBackup.js`, `dataMigration.js`) — der Modul-Vertrag „nur im React-State, nie
> Klartext" verlangt, ALL diese durch einen In-Memory-Zustand zu führen. Das Daten-Modell
> (In-Memory treu vs. Session-Entschlüsselung) ist ein offener Stebler-Studios-Entscheid.

## ✅ HARTE VORBEDINGUNG behoben (2b-pre, 2026-07-18) — Live-Verdrahtung bleibt offen

**Stand 2026-07-18:** Die vier 🔴 unten UND die Härtung sind auf **Modul-Ebene**
behoben und unit-getestet (`secureStore.js` neu, `cryptoCore.js` Iterations-Parameter,
`backupCrypto.js` Guard; 21 Krypto-Tests grün, volle Suite 748 grün, Size 64.95/65 kB).
Das Modul bleibt **dormant** — nichts aktiviert den Tresor. **Offen für Phase 2b-UI**
(eigene, frische Sitzung): LockScreen + Seam in `main.jsx`, Passphrase-Wand, den
Backup-Export im Flow tatsächlich auslösen (Modul erzwingt jetzt `backupConfirmed`),
Fehlermeldungen durch i18n routen (5 Sprachen), Doc-Blob-Ladepfad (`main.jsx:744`)
an den entsperrten In-Memory-Zustand koppeln. Beleg: PR (feat/tresor-2b-pre).

Ursprünglicher Befund (Predeploy-Review 2026-07-13, Runde 3) am dormanten Fundament,
zur Nachvollziehbarkeit belassen:

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

Zusätzlich (Security-Härtung vor 2b) — **alle in 2b-pre umgesetzt:** ✅ **PBKDF2
100'000 → 600'000 Iterationen** (`PBKDF2_ITERATIONS_TRESOR`, versioniert im V2-Record-Header,
Fallback 100k für V1-Alt-Daten; `cryptoCore.PBKDF2_ITERATIONS`=100k bleibt eingefroren fürs
Backup-Format). ✅ **Passphrase-Mindestlänge** `TRESOR_MIN_PASSPHRASE=12` (Entscheid Stebler Studios
2026-07-18; strenger als Backup ≥4, weil der Tresor ALLE Daten at-rest schützt). **2b-UI-Auftrag:**
die Setup-UX auf „nimm einen ganzen Satz" ausrichten (Passphrase- statt Passwort-Denke — die
Länge kommt aus einem Merksatz, keine Zeichenklassen-Pflicht = ruhige UX). Der Modul-Fehlertext
nudged bereits in diese Richtung.
✅ **Backup-Export-Zwang**: `activateTresor(pw, { backupConfirmed })` wirft ohne Bestätigung
(nicht mehr nur Doku-Konvention). ✅ **`VAULT_*` → `TRESOR_*`/`LOCK_*`** umbenannt inkl.
Record-Key `or5_vault` → `or5_tresor` (dormant, kein gespeichertes Chiffrat → unkritisch).

Ursprungs-Beleg: `/maloja-predeploy` Runde 3, `sicherheits-pruefer` + `/code-review` (alle CONFIRMED).

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

## 7. Langfrist-Zielbild: Schlüssel-Leiter (aus maloja c, 2026-07-18)

> Quelle: `Ideen Kiste/maloja c/maloja-platform-blueprint/ENCRYPTION-RECOVERY.md`
> (Codex-Stand). Zielbild für die Zeit NACH Phase 2b — nichts davon ist
> Vorbedingung für den jetzigen Bau. Maloja entwickelt keine eigene Kryptografie;
> vor Production braucht es ein unabhängiges Krypto-/Protokollreview.

**Schlüsselhierarchie (Zielbild):**

```text
Geräteschlüssel (OS-Schutzspeicher)
  └─ schützt → persönlichen Tresorschlüssel
       └─ schützt → Objekt-/Bereichsschlüssel
            └─ verschlüsseln → Dokumente, Angaben, Fristen
```

Unser Phase-2b-Modell (Passphrase → abgeleiteter Schlüssel → `or5_data`) ist die
**erste Sprosse** dieser Leiter: ein Tresorschlüssel, noch ohne Geräte- und
Objektschlüssel-Ebene. `src/crypto/vault.js` (Level 2, ADR-011) ist die zweite
Sprosse. Jedes verschlüsselte Objekt trägt Algorithmus- und
Schlüsselversions-Metadaten, damit Rotation und Algorithmuswechsel möglich bleiben.

**Merksatz: Authentisierung ist nicht Entschlüsselung.**

```text
Passkey        → Konto anmelden
Geräteschlüssel → Gerät autorisieren
Tresorschlüssel → Inhalte entschlüsseln
```

**Recovery-Modell (Zielbild):** bestehendes Gerät bestätigt neues Gerät ·
offline aufbewahrter Recovery-Code · optional Recovery-Anteile
(Person + Vertrauensperson) · Supportprozess, der ohne Schlüssel nichts
entschlüsseln kann · Wartezeit + Benachrichtigung bei riskanter Wiederherstellung.
**Nicht zulässig:** Master-Hintertür, unverschlüsselte Recovery-Kopie,
Sicherheitsfragen, stilles Zurücksetzen der E2E-Verschlüsselung, Recovery nur
über alte E-Mail-Adresse.

**Web-spezifisch (betrifft uns heute):** XSS-Schutz und strenge CSP sind Teil
des Tresorschutzes — kompromittiertes ausgeliefertes JavaScript schwächt jede
Client-Verschlüsselung. Gehört ins Threat Model der Phase 2b.

**Pflichtprüfungen vor einer Production-Cloud:** unabhängiges Kryptoreview,
ASVS/MASVS, Pentest, Recovery-Übung «alle Geräte verloren», Restore aus alter
Sicherung, Rotation + kompromittierter Schlüssel, Konflikt-/Offline-/
Doppellöschungstests, Klartext-Prüfung von Logs/Crashreports/Push.
