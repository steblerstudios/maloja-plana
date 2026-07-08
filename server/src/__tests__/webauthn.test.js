import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

vi.mock('@simplewebauthn/server', () => ({
  generateRegistrationOptions: vi.fn(),
  verifyRegistrationResponse: vi.fn(),
  generateAuthenticationOptions: vi.fn(),
  verifyAuthenticationResponse: vi.fn(),
}));

vi.mock('../db.js', () => ({
  prisma: {
    user: { create: vi.fn() },
    webAuthnCredential: { findUnique: vi.fn(), update: vi.fn() },
    session: { create: vi.fn() },
    auditLog: { create: vi.fn() },
  },
}));

let app;
let prisma;
let swa;

const b64u = (s) => Buffer.from(s).toString('base64url');

beforeAll(async () => {
  process.env.DATABASE_URL = 'mysql://u:p@127.0.0.1:3306/test';
  process.env.SESSION_SECRET = 'test-secret-mindestens-32-zeichen-lang-1234567890';
  process.env.RP_ID = 'localhost';
  process.env.RP_ORIGIN = 'http://localhost:5173';
  process.env.NODE_ENV = 'test';
  ({ prisma } = await import('../db.js'));
  swa = await import('@simplewebauthn/server');
  const { buildApp } = await import('../app.js');
  app = await buildApp();
  await app.ready();
});

beforeEach(() => {
  vi.clearAllMocks();
  prisma.session.create.mockResolvedValue({ id: 's1' });
});

describe('Registrierung', () => {
  it('begin → 200, setzt Challenge-Cookie', async () => {
    swa.generateRegistrationOptions.mockResolvedValue({
      challenge: 'chal', rp: { id: 'localhost' },
      authenticatorSelection: { userVerification: 'required', residentKey: 'required' },
      extensions: { prf: {} },
    });
    const res = await app.inject({ method: 'POST', url: '/auth/webauthn/register/begin' });
    expect(res.statusCode).toBe(200);
    expect(res.json().authenticatorSelection.userVerification).toBe('required');
    expect(res.headers['set-cookie']).toMatch(/reg_challenge=/);
  });

  it('finish ohne Challenge-Cookie → 400', async () => {
    const res = await app.inject({ method: 'POST', url: '/auth/webauthn/register/finish', payload: {} });
    expect(res.statusCode).toBe(400);
  });

  it('finish verifiziert → User+Credential anlegen, einloggen; UV Pflicht geprüft', async () => {
    swa.verifyRegistrationResponse.mockResolvedValue({
      verified: true,
      registrationInfo: { credential: { id: b64u('cred1'), publicKey: new Uint8Array([1, 2, 3]), counter: 0, transports: ['internal'] } },
    });
    prisma.user.create.mockResolvedValue({ id: 'u1' });
    const regCookie = app.signCookie(JSON.stringify({ challenge: 'chal', handle: b64u('handle') }));

    const res = await app.inject({
      method: 'POST', url: '/auth/webauthn/register/finish',
      cookies: { reg_challenge: regCookie }, payload: { id: b64u('cred1') },
    });

    expect(res.statusCode).toBe(200);
    const verifyArgs = swa.verifyRegistrationResponse.mock.calls[0][0];
    expect(verifyArgs.requireUserVerification).toBe(true);
    expect(verifyArgs.expectedRPID).toBe('localhost');
    expect(verifyArgs.expectedOrigin).toBe('http://localhost:5173');
    expect(verifyArgs.expectedChallenge).toBe('chal');
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
    expect(prisma.session.create).toHaveBeenCalledTimes(1); // eingeloggt
    expect([].concat(res.headers['set-cookie']).join(';')).toMatch(/sid=/);
  });

  it('finish nicht verifiziert → 400, kein User angelegt', async () => {
    swa.verifyRegistrationResponse.mockResolvedValue({ verified: false });
    const regCookie = app.signCookie(JSON.stringify({ challenge: 'chal', handle: b64u('handle') }));
    const res = await app.inject({
      method: 'POST', url: '/auth/webauthn/register/finish',
      cookies: { reg_challenge: regCookie }, payload: {},
    });
    expect(res.statusCode).toBe(400);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});

describe('Login', () => {
  it('begin → 200, setzt Login-Cookie', async () => {
    swa.generateAuthenticationOptions.mockResolvedValue({ challenge: 'lchal', userVerification: 'required' });
    const res = await app.inject({ method: 'POST', url: '/auth/webauthn/login/begin' });
    expect(res.statusCode).toBe(200);
    expect(res.headers['set-cookie']).toMatch(/login_challenge=/);
  });

  it('finish mit unbekanntem Credential → 401', async () => {
    prisma.webAuthnCredential.findUnique.mockResolvedValue(null);
    const loginCookie = app.signCookie('lchal');
    const res = await app.inject({
      method: 'POST', url: '/auth/webauthn/login/finish',
      cookies: { login_challenge: loginCookie }, payload: { id: b64u('cred1') },
    });
    expect(res.statusCode).toBe(401);
  });

  it('finish verifiziert → Zähler fortschreiben, einloggen; UV Pflicht geprüft', async () => {
    prisma.webAuthnCredential.findUnique.mockResolvedValue({
      id: 'c1', userId: 'u1', credentialId: Buffer.from('cred1'), publicKey: Buffer.from([1, 2, 3]), counter: 0n, transports: 'internal',
    });
    swa.verifyAuthenticationResponse.mockResolvedValue({ verified: true, authenticationInfo: { newCounter: 5 } });
    prisma.webAuthnCredential.update.mockResolvedValue({});
    const loginCookie = app.signCookie('lchal');

    const res = await app.inject({
      method: 'POST', url: '/auth/webauthn/login/finish',
      cookies: { login_challenge: loginCookie }, payload: { id: b64u('cred1') },
    });

    expect(res.statusCode).toBe(200);
    const verifyArgs = swa.verifyAuthenticationResponse.mock.calls[0][0];
    expect(verifyArgs.requireUserVerification).toBe(true);
    expect(verifyArgs.expectedRPID).toBe('localhost');
    expect(prisma.webAuthnCredential.update).toHaveBeenCalledWith({ where: { id: 'c1' }, data: { counter: 5n } });
    expect(prisma.session.create).toHaveBeenCalledTimes(1);
  });

  it('finish nicht verifiziert → 401', async () => {
    prisma.webAuthnCredential.findUnique.mockResolvedValue({
      id: 'c1', userId: 'u1', credentialId: Buffer.from('cred1'), publicKey: Buffer.from([1, 2, 3]), counter: 0n, transports: null,
    });
    swa.verifyAuthenticationResponse.mockResolvedValue({ verified: false });
    const loginCookie = app.signCookie('lchal');
    const res = await app.inject({
      method: 'POST', url: '/auth/webauthn/login/finish',
      cookies: { login_challenge: loginCookie }, payload: { id: b64u('cred1') },
    });
    expect(res.statusCode).toBe(401);
    expect(prisma.session.create).not.toHaveBeenCalled();
  });
});
