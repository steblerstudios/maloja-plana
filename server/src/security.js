// Security-Plugins — bewusst die offiziellen, auditierten Fastify-Plugins statt
// selbstgebauter Header/Rate-Limits. Selbstgebaute Sicherheit ist der klassische Fehler.

import cookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { config } from './config.js';

export async function registerSecurity(app) {
  // Signierte Cookies (für die Session). Secret aus der Env.
  await app.register(cookie, { secret: config.sessionSecret });

  // Sicherheits-Header. API liefert JSON → sehr restriktive CSP, HSTS ein Jahr.
  await app.register(helmet, {
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    contentSecurityPolicy: {
      directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"], baseUri: ["'none'"] },
    },
    referrerPolicy: { policy: 'no-referrer' },
    crossOriginResourcePolicy: { policy: 'same-site' },
  });

  // CORS strikt auf die Frontend-Domain — nie '*', und Credentials nur mit exaktem Origin.
  await app.register(cors, {
    origin: config.origin,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE'],
    maxAge: 600,
  });

  // Globales Rate-Limit. Sensible Endpoints (Login/Backup) bekommen in Increment 3
  // zusätzlich strengere Einzel-Limits.
  await app.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
  });
}
