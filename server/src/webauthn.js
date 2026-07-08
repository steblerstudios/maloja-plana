// WebAuthn (Passkeys) — Registrierung + Login.
//
// Sicherste Einstellungen: userVerification Pflicht, discoverable credentials, PRF-
// Extension bei der Registrierung aktiviert (die Schlüsselquelle, deren Output das
// Frontend beim Login abruft — der Server sieht ihn nie), strikte RP-ID/Origin-Prüfung
// und Signatur-Zähler-Abgleich gegen geklonte Authenticators.

import crypto from 'node:crypto';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { config } from './config.js';
import { prisma } from './db.js';
import { createSession } from './auth.js';
import { logAudit } from './audit.js';

const REG_COOKIE = 'reg_challenge';
const LOGIN_COOKIE = 'login_challenge';
const AUTH_RATE = { rateLimit: { max: 10, timeWindow: '1 minute' } };

const b64uToBytes = (s) => Buffer.from(s, 'base64url');
const bytesToB64u = (b) => Buffer.from(b).toString('base64url');

export async function webauthnRoutes(app) {
  // ── Registrierung Schritt 1: Optionen. Challenge + User-Handle kurzlebig + signiert
  // im httpOnly-Cookie für Schritt 2. DB-frei.
  app.post('/auth/webauthn/register/begin', { config: { public: true, ...AUTH_RATE } }, async (req, reply) => {
    const handle = crypto.randomBytes(32); // kein PII
    const options = await generateRegistrationOptions({
      rpName: config.rpName,
      rpID: config.rpID,
      userID: handle,
      userName: 'maloja-user',
      attestationType: 'none',
      authenticatorSelection: { residentKey: 'required', userVerification: 'required' },
      extensions: { prf: {} }, // PRF aktivieren — Schlüsselquelle
    });
    reply.setCookie(
      REG_COOKIE,
      JSON.stringify({ challenge: options.challenge, handle: bytesToB64u(handle) }),
      { ...config.cookie, maxAge: 300 },
    );
    return options;
  });

  // ── Registrierung Schritt 2: Attestation prüfen, User + Credential anlegen, einloggen.
  app.post('/auth/webauthn/register/finish', { config: { public: true, ...AUTH_RATE } }, async (req, reply) => {
    const raw = req.cookies?.[REG_COOKIE];
    const unsigned = raw ? req.unsignCookie(raw) : { valid: false };
    if (!unsigned.valid) return reply.code(400).send({ error: 'no_challenge' });
    const { challenge, handle } = JSON.parse(unsigned.value);

    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response: req.body,
        expectedChallenge: challenge,
        expectedOrigin: config.origin,
        expectedRPID: config.rpID,
        requireUserVerification: true,
      });
    } catch {
      return reply.code(400).send({ error: 'verification_failed' });
    }
    if (!verification.verified || !verification.registrationInfo) {
      return reply.code(400).send({ error: 'not_verified' });
    }

    const { credential } = verification.registrationInfo;
    const user = await prisma.user.create({
      data: {
        handle: b64uToBytes(handle),
        credentials: {
          create: {
            credentialId: b64uToBytes(credential.id),
            publicKey: Buffer.from(credential.publicKey),
            counter: BigInt(credential.counter),
            transports: credential.transports?.join(',') ?? null,
          },
        },
      },
    });

    reply.clearCookie(REG_COOKIE, { path: '/' });
    await createSession(reply, user.id);
    await logAudit(req, 'register_ok', user.id);
    return { ok: true };
  });

  // ── Login Schritt 1: Optionen (discoverable). Das Frontend fügt die PRF-eval mit dem
  // festen Salt hinzu (nur client-seitig — der PRF-Output erreicht den Server nie).
  app.post('/auth/webauthn/login/begin', { config: { public: true, ...AUTH_RATE } }, async (req, reply) => {
    const options = await generateAuthenticationOptions({
      rpID: config.rpID,
      userVerification: 'required',
    });
    reply.setCookie(LOGIN_COOKIE, options.challenge, { ...config.cookie, maxAge: 300 });
    return options;
  });

  // ── Login Schritt 2: Assertion prüfen, Zähler fortschreiben, Session ausstellen.
  app.post('/auth/webauthn/login/finish', { config: { public: true, ...AUTH_RATE } }, async (req, reply) => {
    const raw = req.cookies?.[LOGIN_COOKIE];
    const unsigned = raw ? req.unsignCookie(raw) : { valid: false };
    if (!unsigned.valid) return reply.code(400).send({ error: 'no_challenge' });

    const cred = await prisma.webAuthnCredential.findUnique({
      where: { credentialId: b64uToBytes(req.body?.id ?? '') },
    });
    if (!cred) {
      await logAudit(req, 'login_fail', null);
      return reply.code(401).send({ error: 'unknown_credential' });
    }

    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response: req.body,
        expectedChallenge: unsigned.value,
        expectedOrigin: config.origin,
        expectedRPID: config.rpID,
        requireUserVerification: true,
        credential: {
          id: bytesToB64u(cred.credentialId),
          publicKey: new Uint8Array(cred.publicKey),
          counter: Number(cred.counter),
          transports: cred.transports ? cred.transports.split(',') : undefined,
        },
      });
    } catch {
      await logAudit(req, 'login_fail', cred.userId);
      return reply.code(401).send({ error: 'verification_failed' });
    }
    if (!verification.verified) {
      await logAudit(req, 'login_fail', cred.userId);
      return reply.code(401).send({ error: 'not_verified' });
    }

    // Signatur-Zähler fortschreiben (Klon-Erkennung).
    await prisma.webAuthnCredential.update({
      where: { id: cred.id },
      data: { counter: BigInt(verification.authenticationInfo.newCounter) },
    });

    reply.clearCookie(LOGIN_COOKIE, { path: '/' });
    await createSession(reply, cred.userId);
    await logAudit(req, 'login_ok', cred.userId);
    return { ok: true };
  });
}
