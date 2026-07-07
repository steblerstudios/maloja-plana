// Zentrale Konfiguration — Fail-fast: fehlt ein Pflicht-Secret, startet der Server gar
// nicht erst. Secrets kommen AUSSCHLIESSLICH aus Umgebungsvariablen, nie aus dem Code.

const REQUIRED = ['DATABASE_URL', 'SESSION_SECRET', 'RP_ID', 'RP_ORIGIN'];

export function loadConfig(env = process.env) {
  const missing = REQUIRED.filter((k) => !env[k] || String(env[k]).trim() === '');
  if (missing.length) {
    throw new Error(
      'Fehlende Pflicht-Umgebungsvariablen: ' + missing.join(', ') +
      '. Siehe server/.env.example. Secrets NIE im Code hinterlegen.',
    );
  }
  if (String(env.SESSION_SECRET).length < 32) {
    throw new Error('SESSION_SECRET muss mindestens 32 Zeichen lang sein (hohe Entropie).');
  }

  const isProd = env.NODE_ENV === 'production';
  return {
    isProd,
    port: Number(env.PORT) || 8080,
    host: '0.0.0.0',
    databaseUrl: env.DATABASE_URL,
    sessionSecret: env.SESSION_SECRET,
    rpID: env.RP_ID,
    rpName: env.RP_NAME || 'Maloja Plana',
    origin: env.RP_ORIGIN,
    // Cookie-Härtung: httpOnly (kein JS-Zugriff), Secure (nur HTTPS in Prod),
    // SameSite=Strict (CSRF-Schutz), signiert.
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/',
      signed: true,
    },
    sessionTtlMs: 1000 * 60 * 60 * 24 * 7, // 7 Tage
  };
}

export const config = loadConfig();
