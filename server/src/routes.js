// Anwendungs-Routen. /health ist öffentlich; alles andere erbt Deny-by-default aus dem
// authHook und prüft zusätzlich Eigentum. Die DB-Logik füllt Increment 3.

export async function appRoutes(app) {
  app.get('/health', { config: { public: true } }, async () => ({ status: 'ok' }));

  // Eigenes verschlüsseltes Backup laden. req.session ist durch authHook garantiert.
  app.get('/backup', async (req, reply) => {
    // Increment 3: prisma.encryptedBackup nach req.session.userId laden (nur eigenes).
    return reply.code(501).send({ error: 'not_implemented' });
  });

  // Eigenes verschlüsseltes Backup speichern. Body ist strikt validiert:
  // nur { blob, version } — additionalProperties:false weist alles andere ab.
  app.post(
    '/backup',
    {
      schema: {
        body: {
          type: 'object',
          additionalProperties: false,
          required: ['blob', 'version'],
          properties: {
            blob: { type: 'object' },
            version: { type: 'integer', minimum: 1 },
          },
        },
      },
    },
    async (req, reply) => {
      // Increment 3: upsert auf userId==req.session.userId (assertOwner), Chiffrat ablegen.
      return reply.code(501).send({ error: 'not_implemented' });
    },
  );

  // Konto + alle Daten löschen (nDSG-Löschrecht). Cascade räumt Credentials/Backup/Sessions.
  app.delete('/account', async (req, reply) => {
    // Increment 3: prisma.user.delete({ where: { id: req.session.userId } }).
    return reply.code(501).send({ error: 'not_implemented' });
  });
}
