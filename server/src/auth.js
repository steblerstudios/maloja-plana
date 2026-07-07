// Sessions, Deny-by-default-Auth und Eigentümer-Prüfung.
//
// Sessions sind opake Zufalls-Token in einem signierten httpOnly-Cookie. Serverseitig
// wird nur der SHA-256-Hash gespeichert — so ist Logout serverseitig widerrufbar
// (statt nur clientseitig ein Token zu vergessen).

import crypto from 'node:crypto';
import { prisma } from './db.js';
import { config } from './config.js';

const COOKIE = 'sid';
const hashToken = (t) => crypto.createHash('sha256').update(t).digest('hex');

export async function createSession(reply, userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  await prisma.session.create({
    data: { userId, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + config.sessionTtlMs) },
  });
  reply.setCookie(COOKIE, token, config.cookie);
  return token;
}

export async function getSession(req) {
  const raw = req.cookies?.[COOKIE];
  if (!raw) return null; // kein Cookie → gar kein DB-Zugriff (Deny-Pfad ist DB-frei)
  const unsigned = req.unsignCookie(raw);
  if (!unsigned.valid || !unsigned.value) return null;

  const s = await prisma.session.findUnique({ where: { tokenHash: hashToken(unsigned.value) } });
  if (!s || s.revokedAt || s.expiresAt < new Date()) return null;
  return { userId: s.userId, sessionId: s.id };
}

export async function revokeSession(req) {
  const raw = req.cookies?.[COOKIE];
  if (!raw) return;
  const unsigned = req.unsignCookie(raw);
  if (!unsigned.valid) return;
  await prisma.session.updateMany({
    where: { tokenHash: hashToken(unsigned.value), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

// Deny-by-default: onRequest-Hook. JEDE Route ist geschützt, ausser sie markiert sich
// ausdrücklich als { config: { public: true } }.
export function authHook() {
  return async (req, reply) => {
    if (req.routeOptions?.config?.public) return;
    const session = await getSession(req);
    if (!session) {
      return reply.code(401).send({ error: 'unauthorized' });
    }
    req.session = session;
  };
}

// Eigentümer-Prüfung (das 42→43-Prinzip): wirft 403, wenn die Ressource nicht der
// eingeloggten Person gehört. Auf JEDER ressourcenbezogenen Route aufzurufen.
export function assertOwner(session, resourceUserId) {
  if (!session || session.userId !== resourceUserId) {
    const err = new Error('forbidden');
    err.statusCode = 403;
    throw err;
  }
}
