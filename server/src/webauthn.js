// WebAuthn (Passkeys) — sicherste Einstellungen: Nutzerverifikation Pflicht,
// discoverable credentials, und die PRF-Extension ist PFLICHT (sie ist unsere
// Verschlüsselungs-Schlüsselquelle, siehe src/crypto/vault.js im Frontend).

import crypto from 'node:crypto';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { config } from './config.js';

const CHALLENGE_COOKIE = 'reg_challenge';

export async function webauthnRoutes(app) {
  // Registrierung Schritt 1 — Optionen erzeugen. DB-frei: die Challenge wird kurzlebig
  // und signiert im httpOnly-Cookie für den finish-Schritt hinterlegt.
  app.post('/auth/webauthn/register/begin', { config: { public: true } }, async (req, reply) => {
    const userHandle = crypto.randomBytes(32); // kein PII
    const options = await generateRegistrationOptions({
      rpName: config.rpName,
      rpID: config.rpID,
      userID: userHandle,
      userName: 'maloja-user',
      attestationType: 'none',
      authenticatorSelection: {
        residentKey: 'required',
        userVerification: 'required', // Biometrie/PIN Pflicht
      },
      extensions: { prf: {} }, // PRF Pflicht — ohne sie kein Schlüssel, keine Registrierung
    });

    reply.setCookie(CHALLENGE_COOKIE, options.challenge, { ...config.cookie, maxAge: 300 });
    return options;
  });

  // Schritt 2 (finish) + Login folgen in Increment 3 — sie legen User/Credential an bzw.
  // prüfen die Assertion und brauchen dafür die DB. Bewusst als 501 markiert, damit das
  // Gerüst ehrlich zeigt, was noch fehlt (statt Halb-Implementiertes zu verstecken).
  const notYet = async (req, reply) => reply.code(501).send({ error: 'not_implemented' });
  app.post('/auth/webauthn/register/finish', { config: { public: true } }, notYet);
  app.post('/auth/webauthn/login/begin', { config: { public: true } }, notYet);
  app.post('/auth/webauthn/login/finish', { config: { public: true } }, notYet);
}
