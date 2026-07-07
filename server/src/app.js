// Fastify-App zusammenbauen: Security-Plugins → Deny-by-default-Auth → generische
// Fehler → Routen. buildApp() ist testbar (kein listen()).

import Fastify from 'fastify';
import { config } from './config.js';
import { registerSecurity } from './security.js';
import { authHook } from './auth.js';
import { webauthnRoutes } from './webauthn.js';
import { appRoutes } from './routes.js';

export async function buildApp() {
  const app = Fastify({
    logger: { level: config.isProd ? 'info' : 'warn' },
    trustProxy: true, // hinter dem Jelastic-Proxy: korrekte Client-IP + Secure-Cookies
    bodyLimit: 2 * 1024 * 1024, // 2 MB
    ajv: { customOptions: { allErrors: false, removeAdditional: false } },
  });

  await registerSecurity(app);

  // Deny-by-default für alle Routen.
  app.addHook('onRequest', authHook());

  // Generische Fehler — nie Stacktraces oder Interna an den Client. 5xx serverseitig loggen.
  app.setErrorHandler((err, req, reply) => {
    const status =
      err.statusCode && err.statusCode >= 400 && err.statusCode < 500 ? err.statusCode : 500;
    if (status >= 500) req.log.error(err);
    const body =
      { 400: 'bad_request', 401: 'unauthorized', 403: 'forbidden', 404: 'not_found', 429: 'rate_limited' }[status] ||
      'server_error';
    reply.code(status).send({ error: body });
  });

  app.setNotFoundHandler({ config: { public: true } }, async (req, reply) =>
    reply.code(404).send({ error: 'not_found' }),
  );

  await app.register(webauthnRoutes);
  await app.register(appRoutes);

  return app;
}
