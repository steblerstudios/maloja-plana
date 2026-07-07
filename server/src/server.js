// Einstiegspunkt. config wird beim Import geladen → Fail-fast bei fehlenden Secrets.
import { config } from './config.js';
import { buildApp } from './app.js';

const app = await buildApp();
try {
  await app.listen({ port: config.port, host: config.host });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
