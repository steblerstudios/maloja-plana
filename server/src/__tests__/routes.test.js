import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

// DB-Layer mocken: die Tests prüfen die Sicherheits-Logik (Auth, Scoping, Validierung),
// nicht die echte SQL-Ebene. Echte DB-Round-Trips + echter Authenticator = Review-Gate.
vi.mock('../db.js', () => ({
  prisma: {
    session: { findUnique: vi.fn() },
    encryptedBackup: { findUnique: vi.fn(), upsert: vi.fn() },
    user: { delete: vi.fn() },
    auditLog: { create: vi.fn() },
  },
}));

let app;
let prisma;
const cookie = (userId = 'u1', over = {}) => {
  prisma.session.findUnique.mockResolvedValue({
    id: 's1', userId, revokedAt: null, expiresAt: new Date(Date.now() + 3_600_000), ...over,
  });
  return { sid: app.signCookie('tok') };
};

beforeAll(async () => {
  process.env.DATABASE_URL = 'mysql://u:p@127.0.0.1:3306/test';
  process.env.SESSION_SECRET = 'test-secret-mindestens-32-zeichen-lang-1234567890';
  process.env.RP_ID = 'localhost';
  process.env.RP_ORIGIN = 'http://localhost:5173';
  process.env.NODE_ENV = 'test';
  ({ prisma } = await import('../db.js'));
  const { buildApp } = await import('../app.js');
  app = await buildApp();
  await app.ready();
});

beforeEach(() => vi.clearAllMocks());

describe('Auth — Deny-by-default & Session-Lebenszyklus', () => {
  it('GET /health ist öffentlich → 200', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok' });
  });

  it('GET /backup ohne Cookie → 401', async () => {
    const res = await app.inject({ method: 'GET', url: '/backup' });
    expect(res.statusCode).toBe(401);
  });

  it('abgelaufene Session → 401', async () => {
    const cookies = cookie('u1', { expiresAt: new Date(Date.now() - 1000) });
    const res = await app.inject({ method: 'GET', url: '/backup', cookies });
    expect(res.statusCode).toBe(401);
  });

  it('widerrufene Session → 401', async () => {
    const cookies = cookie('u1', { revokedAt: new Date() });
    const res = await app.inject({ method: 'GET', url: '/backup', cookies });
    expect(res.statusCode).toBe(401);
  });

  it('gefälschtes (falsch signiertes) Cookie → 401', async () => {
    const res = await app.inject({ method: 'GET', url: '/backup', cookies: { sid: 'tok.FALSCHE-SIGNATUR' } });
    expect(res.statusCode).toBe(401);
  });
});

describe('Eigentums-Bindung — jede Query fest auf die Session-userId', () => {
  it('GET /backup: kein Backup → 404, Query auf eigene userId gescoped', async () => {
    const cookies = cookie('u1');
    prisma.encryptedBackup.findUnique.mockResolvedValue(null);
    const res = await app.inject({ method: 'GET', url: '/backup', cookies });
    expect(res.statusCode).toBe(404);
    expect(prisma.encryptedBackup.findUnique).toHaveBeenCalledWith({ where: { userId: 'u1' } });
  });

  it('GET /backup: gibt nur das eigene Chiffrat zurück', async () => {
    const cookies = cookie('u1');
    prisma.encryptedBackup.findUnique.mockResolvedValue({ blob: '{"ct":"x"}', version: 1, updatedAt: new Date() });
    const res = await app.inject({ method: 'GET', url: '/backup', cookies });
    expect(res.statusCode).toBe(200);
    expect(res.json().blob).toBe('{"ct":"x"}');
    expect(prisma.encryptedBackup.findUnique).toHaveBeenCalledWith({ where: { userId: 'u1' } });
  });

  it('POST /backup: upsert fest auf die eigene userId', async () => {
    const cookies = cookie('u1');
    prisma.encryptedBackup.upsert.mockResolvedValue({});
    const res = await app.inject({ method: 'POST', url: '/backup', cookies, payload: { blob: '{"ct":"x"}', version: 1 } });
    expect(res.statusCode).toBe(200);
    const arg = prisma.encryptedBackup.upsert.mock.calls[0][0];
    expect(arg.where).toEqual({ userId: 'u1' });
    expect(arg.create.userId).toBe('u1');
    expect(arg.update.userId).toBeUndefined(); // userId ist nie vom Client steuerbar
  });

  it('POST /backup: Fremdfeld (userId) im Body → 400', async () => {
    const cookies = cookie('u1');
    const res = await app.inject({ method: 'POST', url: '/backup', cookies, payload: { blob: 'x', version: 1, userId: 'u2' } });
    expect(res.statusCode).toBe(400);
  });

  it('POST /backup: fehlendes Pflichtfeld → 400', async () => {
    const cookies = cookie('u1');
    const res = await app.inject({ method: 'POST', url: '/backup', cookies, payload: { blob: 'x' } });
    expect(res.statusCode).toBe(400);
  });

  it('DELETE /account: löscht nur das eigene Konto', async () => {
    const cookies = cookie('u1');
    prisma.user.delete.mockResolvedValue({});
    const res = await app.inject({ method: 'DELETE', url: '/account', cookies });
    expect(res.statusCode).toBe(200);
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'u1' } });
  });
});

describe('assertOwner (für spätere Ressourcen-IDs)', () => {
  it('erlaubt Eigentümer, blockt Fremde mit 403', async () => {
    const { assertOwner } = await import('../auth.js');
    expect(() => assertOwner({ userId: 'u1' }, 'u1')).not.toThrow();
    let err;
    try { assertOwner({ userId: 'u1' }, 'u2'); } catch (e) { err = e; }
    expect(err?.statusCode).toBe(403);
  });
});
