import { prisma } from './db.js';

// Audit-Log für sicherheitsrelevante Ereignisse. Bewusst OHNE PII/Token/Klartext —
// nur Ereignisname, optional userId und IP. Ein Fehler beim Loggen darf die eigentliche
// Anfrage nie scheitern lassen.
export async function logAudit(req, event, userId = null) {
  try {
    await prisma.auditLog.create({ data: { event, userId, ip: req.ip ?? null } });
  } catch (err) {
    req.log?.warn({ err, event }, 'audit log failed');
  }
}
