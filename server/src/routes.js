// Anwendungs-Routen. /health ist öffentlich; alles andere erbt Deny-by-default aus dem
// authHook.
//
// Eigentums-Bindung (das 42→43-Prinzip in der stärksten Form): der Client liefert NIE
// eine Ziel-ID. Jede Query ist fest auf req.session.userId gescoped — es ist strukturell
// unmöglich, fremde Daten zu lesen, zu überschreiben oder zu löschen. Es gibt keinen
// Parameter zum Manipulieren. (assertOwner aus auth.js bleibt für spätere Routen mit
// echten Ressourcen-IDs, z. B. Freigaben in Phase 3.)

import { prisma } from './db.js';
import { logAudit } from './audit.js';

export async function appRoutes(app) {
  app.get('/health', { config: { public: true } }, async () => ({ status: 'ok' }));

  // Eigenes verschlüsseltes Backup laden.
  app.get('/backup', async (req, reply) => {
    const row = await prisma.encryptedBackup.findUnique({ where: { userId: req.session.userId } });
    if (!row) return reply.code(404).send({ error: 'no_backup' });
    return { blob: row.blob, version: row.version, updatedAt: row.updatedAt };
  });

  // Eigenes Backup speichern (upsert auf die eigene userId). Strengeres Rate-Limit als
  // global. Body strikt validiert: nur { blob, version } — sonst 400.
  app.post(
    '/backup',
    {
      config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
      schema: {
        body: {
          type: 'object',
          additionalProperties: false,
          required: ['blob', 'version'],
          properties: {
            // blob = JSON-String aus vault.sealBackup(). Server prüft nur Form, nie Inhalt.
            blob: { type: 'string', minLength: 1, maxLength: 5_000_000 },
            version: { type: 'integer', minimum: 1 },
          },
        },
      },
    },
    async (req, reply) => {
      const { blob, version } = req.body;
      const userId = req.session.userId;
      await prisma.encryptedBackup.upsert({
        where: { userId },
        update: { blob, version },
        create: { userId, blob, version },
      });
      await logAudit(req, 'backup_put', userId);
      return { ok: true };
    },
  );

  // Konto + alle Daten löschen (nDSG-Löschrecht). Cascade räumt Credentials/Backup/Sessions.
  app.delete('/account', async (req, reply) => {
    const userId = req.session.userId;
    await prisma.user.delete({ where: { id: userId } });
    await logAudit(req, 'account_deleted', userId);
    reply.clearCookie('sid', { path: '/' });
    return { ok: true };
  });
}
