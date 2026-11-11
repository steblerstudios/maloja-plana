// deploy.sh prüft die Freigabe-Marke selbst (10.11.2026).
//
// Bis dahin hielt nur ein Claude-Hook (.claude/settings.json) einen Produktions-Deploy ohne
// frische .maloja/predeploy-ok auf. Im eigenen Terminal griff das nicht: der Deploy vom
// 10.11. lief 40 s vor der Marke. Jetzt bricht deploy.sh selbst ab — vor Passwort und Build.
//
// Der Test spielt das Skript in einem leeren Wegwerf-Repo durch. Er erreicht nie das Netz:
// ohne Marke bricht es vorher ab; mit Marke endet es spätestens an der Passwort-Abfrage
// (keine Eingabe, kein SFTP_PASSWORD) oder an «lftp fehlt».
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtempSync, copyFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const QUELLE = fileURLToPath(new URL('../../deploy.sh', import.meta.url));
let dir;

const git = (...a) => spawnSync('git', a, { cwd: dir, encoding: 'utf8' });
const lauf = (extraEnv = {}, args = []) => {
  const env = { ...process.env, ...extraEnv };
  delete env.SFTP_PASSWORD;
  delete env.ALLOW_ANY_BRANCH;
  if (!('DEPLOY_OHNE_MARKE' in extraEnv)) delete env.DEPLOY_OHNE_MARKE;
  const r = spawnSync('bash', ['deploy.sh', ...args], { cwd: dir, env, input: '', encoding: 'utf8', timeout: 20000 });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
};

beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), 'deploy-marke-'));
  copyFileSync(QUELLE, join(dir, 'deploy.sh'));
  git('init', '-q', '-b', 'main');
  git('-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'add', 'deploy.sh');
  git('-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-q', '-m', 'test');
});
afterAll(() => { if (dir) rmSync(dir, { recursive: true, force: true }); });

describe('deploy.sh · Freigabe-Marke', () => {
  it('ohne Marke: bricht ab, bevor Passwort, lftp oder Build drankommen', () => {
    rmSync(join(dir, '.maloja'), { recursive: true, force: true });
    const r = lauf();
    expect(r.code).not.toBe(0);
    expect(r.out).toContain('Freigabe-Marke fehlt');
    expect(r.out).not.toMatch(/SFTP-Passwort|lftp fehlt|Build…|PII-Scan/);
  });

  it('Marke auf einem anderen Commit: bricht ebenso ab', () => {
    mkdirSync(join(dir, '.maloja'), { recursive: true });
    writeFileSync(join(dir, '.maloja', 'predeploy-ok'), '0000000000000000000000000000000000000000\n2026-11-10T00:00:00Z\n');
    const r = lauf();
    expect(r.code).not.toBe(0);
    expect(r.out).toContain('Freigabe-Marke fehlt');
  });

  it('Marke = HEAD: kommt an der Marke vorbei (endet erst an lftp oder Passwort)', () => {
    const kopf = git('rev-parse', 'HEAD').stdout.trim();
    mkdirSync(join(dir, '.maloja'), { recursive: true });
    writeFileSync(join(dir, '.maloja', 'predeploy-ok'), kopf + '\n2026-11-10T00:00:00Z\n');
    const r = lauf();
    expect(r.out).not.toContain('Freigabe-Marke fehlt');
    expect(r.out).not.toMatch(/Build…|PII-Scan/);
    expect(r.code).not.toBe(0);
  });

  it('Notfall DEPLOY_OHNE_MARKE=1: warnt laut und geht weiter bis lftp/Passwort', () => {
    rmSync(join(dir, '.maloja'), { recursive: true, force: true });
    const r = lauf({ DEPLOY_OHNE_MARKE: '1' });
    expect(r.out).toContain('DEPLOY_OHNE_MARKE=1');
    expect(r.out).not.toContain('Freigabe-Marke fehlt');
    expect(r.out).not.toMatch(/Build…|PII-Scan/);
  });

  it('Stage (--stage): keine Markenpflicht', () => {
    rmSync(join(dir, '.maloja'), { recursive: true, force: true });
    const r = lauf({}, ['--stage']);
    expect(r.out).not.toContain('Freigabe-Marke');
  });
});
