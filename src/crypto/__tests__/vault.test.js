import { describe, it, expect } from 'vitest';
import {
  generateRecovery,
  sealBackup,
  openBackupWithPrf,
  openBackupWithRecovery,
  parseRecovery,
  bytesToGroupedHex,
  RECOVERY_BYTES,
} from '../vault.js';

// Simuliert den WebAuthn-PRF-Output (im echten Login liefert ihn der Authenticator).
const prf = (seed = 1) => new Uint8Array(32).map((_, i) => (i * 31 + seed) & 0xff);
const SAMPLE = JSON.stringify({ basis: { firstName: 'Anna', lastName: 'Beispiel' }, geheim: 'ärztlich' });

describe('vault — roundtrips', () => {
  it('entschlüsselt via PRF wieder zum Original', async () => {
    const prfOut = prf();
    const rec = generateRecovery();
    const sealed = await sealBackup(SAMPLE, prfOut, rec.bytes);
    expect(await openBackupWithPrf(sealed, prfOut)).toBe(SAMPLE);
  });

  it('entschlüsselt via Recovery-Bytes wieder zum Original', async () => {
    const rec = generateRecovery();
    const sealed = await sealBackup(SAMPLE, prf(), rec.bytes);
    expect(await openBackupWithRecovery(sealed, rec.bytes)).toBe(SAMPLE);
  });

  it('entschlüsselt via getippten Recovery-Code (mit Bindestrichen/Leerzeichen/Kleinschreibung)', async () => {
    const rec = generateRecovery();
    const sealed = await sealBackup(SAMPLE, prf(), rec.bytes);
    const sloppy = ('  ' + rec.display.toLowerCase().replace(/-/g, ' ') + ' ');
    expect(await openBackupWithRecovery(sealed, sloppy)).toBe(SAMPLE);
  });

  it('funktioniert auch für grosse Daten (>64 KB, Chunk-Base64)', async () => {
    const big = JSON.stringify({ blob: 'x'.repeat(100_000), umlaut: 'öäü' });
    const prfOut = prf();
    const sealed = await sealBackup(big, prfOut, generateRecovery().bytes);
    expect(await openBackupWithPrf(sealed, prfOut)).toBe(big);
  });
});

describe('vault — Sicherheits-Eigenschaften', () => {
  it('falscher PRF-Output entsperrt NICHT', async () => {
    const sealed = await sealBackup(SAMPLE, prf(1), generateRecovery().bytes);
    await expect(openBackupWithPrf(sealed, prf(2))).rejects.toBeTruthy();
  });

  it('falsches Recovery-Geheimnis entsperrt NICHT', async () => {
    const sealed = await sealBackup(SAMPLE, prf(), generateRecovery().bytes);
    await expect(openBackupWithRecovery(sealed, generateRecovery().bytes)).rejects.toBeTruthy();
  });

  it('manipuliertes Chiffrat schlägt fehl (GCM-Auth-Tag)', async () => {
    const prfOut = prf();
    const sealed = await sealBackup(SAMPLE, prfOut, generateRecovery().bytes);
    // ein Byte im Base64-Chiffrat kippen
    const bytes = atob(sealed.ct);
    const arr = Uint8Array.from(bytes, (c) => c.charCodeAt(0));
    arr[0] ^= 0x01;
    sealed.ct = btoa(String.fromCharCode(...arr));
    await expect(openBackupWithPrf(sealed, prfOut)).rejects.toBeTruthy();
  });

  it('der Server-Blob enthält weder Klartext noch einen Schlüssel', async () => {
    const secret = 'streng-geheim-diagnose-12345';
    const sealed = await sealBackup(JSON.stringify({ x: secret }), prf(), generateRecovery().bytes);
    const asJson = JSON.stringify(sealed);
    expect(asJson).not.toContain(secret);
    expect(asJson).not.toContain('streng-geheim');
    // nur erwartete, chiffrierte Felder — kein rohes DEK/KEK-Feld
    expect(Object.keys(sealed).sort()).toEqual(
      ['alg', 'ct', 'iv', 'prfSalt', 'recoverySalt', 'v', 'wrappedPrf', 'wrappedRecovery'].sort(),
    );
  });

  it('zwei Versiegelungen derselben Daten ergeben unterschiedliche Chiffrate (frischer DEK + IV)', async () => {
    const prfOut = prf();
    const a = await sealBackup(SAMPLE, prfOut, generateRecovery().bytes);
    const b = await sealBackup(SAMPLE, prfOut, generateRecovery().bytes);
    expect(a.ct).not.toBe(b.ct);
    expect(a.iv).not.toBe(b.iv);
    // trotzdem beide korrekt entschlüsselbar
    expect(await openBackupWithPrf(a, prfOut)).toBe(SAMPLE);
    expect(await openBackupWithPrf(b, prfOut)).toBe(SAMPLE);
  });

  it('weist ein Backup mit fremder Version oder fremdem Algorithmus klar zurück', async () => {
    const prfOut = prf();
    const base = await sealBackup(SAMPLE, prfOut, generateRecovery().bytes);
    // v/alg sind mit-authentifiziert (AAD) UND werden explizit geprüft → klarer Fehler,
    // kein stilles Fehl-Entschlüsseln.
    await expect(openBackupWithPrf({ ...base, v: 2 }, prfOut)).rejects.toThrow(/Format/);
    await expect(openBackupWithPrf({ ...base, alg: 'XChaCha20' }, prfOut)).rejects.toThrow(/Format/);
  });
});

describe('vault — Recovery-Kodierung', () => {
  it('generiert ein Geheimnis der erwarteten Länge und lesbarer Gruppierung', () => {
    const rec = generateRecovery();
    expect(rec.bytes).toHaveLength(RECOVERY_BYTES);
    expect(rec.display).toMatch(/^([0-9A-F]{4}-)+[0-9A-F]{4}$/);
  });

  it('parseRecovery ist invers zur Anzeige', () => {
    const rec = generateRecovery();
    expect(Array.from(parseRecovery(rec.display))).toEqual(Array.from(rec.bytes));
  });

  it('parseRecovery weist zu kurze Eingaben zurück', () => {
    expect(() => parseRecovery('ABCD-1234')).toThrow();
  });
});
