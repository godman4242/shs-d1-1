/**
 * THE CLOUD GUARD — `scripts/cloud/guard-reference.sh`, which both git hooks call.
 *
 * Owner ruling 2026-09-29 (`docs/OWNER_PERMISSION_RULING.md`, "Cloud sessions"): the
 * study-only corpus under `reference/` may ride to a Claude Code cloud session inside a
 * LOCAL bundle, but it never reaches GitHub. A cloud session is a fresh VM with no memory
 * of that rule, so the rule lives in git, not in a prompt: the pre-commit hook refuses a
 * staged `reference/` path, and the pre-push hook refuses any pushed commit that touches
 * one — and, inside a cloud session, any push to a branch other than `cloud-lane` or the
 * platform's own `claude/…` (an ALLOW-list: the trunk here is `master`, and a deny-list of
 * `main` guarded nothing — caught 2026-09-29 before any cloud run). The parent session on the
 * owner's Mac re-gates every cloud commit with the FULL corpus before it reaches `master`.
 *
 * Every refusal fails CLOSED: a pushed range git cannot walk is refused, never waved on.
 * Hermetic: a throwaway repo per test, hooks never installed in it.
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const GUARD = join(process.cwd(), 'scripts/cloud/guard-reference.sh');
const ZERO = '0'.repeat(40);
let dir = '';

function git(...args: string[]): string {
  const r = spawnSync('git', ['-c', 'commit.gpgsign=false', ...args], { cwd: dir, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${r.stderr}`);
  return r.stdout.trim();
}

function stage(path: string): void {
  mkdirSync(dirname(join(dir, path)), { recursive: true });
  writeFileSync(join(dir, path), `${path}\n`);
  git('add', '-f', path);
}

function commit(path: string): string {
  stage(path);
  git('commit', '-q', '--no-verify', '-m', path);
  return git('rev-parse', 'HEAD');
}

/** Runs the guard as a hook would: `push` reads git's `<lref> <loid> <rref> <roid>` lines. */
function guard(mode: 'staged' | 'push', stdin = '', cloud = false) {
  return spawnSync('sh', [GUARD, mode], {
    cwd: dir,
    input: stdin,
    encoding: 'utf8',
    env: { ...process.env, CLAUDE_CODE_REMOTE: cloud ? 'true' : '' },
  });
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'cloudguard-'));
  git('init', '-q', '-b', 'master');
  git('config', 'user.email', 'guard@test');
  git('config', 'user.name', 'guard');
});
afterEach(() => { rmSync(dir, { recursive: true, force: true }); });

describe('pre-commit: a staged reference/ path is refused', () => {
  it('refuses a force-added corpus file and names it', () => {
    stage('reference/decompiled/shs3_payload/scripts/X.as');
    const r = guard('staged');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('reference/decompiled/shs3_payload/scripts/X.as');
  });

  it('refuses a corpus file git QUOTES — the decompiled names carry a § (\\302\\247)', () => {
    stage('reference/decompiled/shs3_payload/scripts/§1t84s0§.as');
    expect(guard('staged').status).toBe(1);
  });

  it('lets an ordinary staged file through', () => {
    stage('src/core/a.ts');
    expect(guard('staged').status).toBe(0);
  });
});

describe('pre-push: no pushed commit may carry reference/', () => {
  it('refuses a new branch whose history holds a corpus commit (the bundle\'s cloud-reference branch)', () => {
    commit('src/a.ts');
    const bad = commit('reference/decompiled/Y.as');
    const r = guard('push', `refs/heads/cloud-reference ${bad} refs/heads/cloud-reference ${ZERO}\n`);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain(bad);
  });

  it('refuses a commit whose ONLY corpus path is one git quotes', () => {
    const base = commit('src/a.ts');
    const top = commit('reference/decompiled/shs3_payload/scripts/§1t215s0§.as');
    expect(guard('push', `refs/heads/cloud-lane ${top} refs/heads/cloud-lane ${base}\n`).status).toBe(1);
  });

  it('refuses a corpus commit buried under a clean one on an existing branch', () => {
    const base = commit('src/a.ts');
    commit('reference/Z.as');
    const top = commit('src/b.ts');
    expect(guard('push', `refs/heads/cloud-lane ${top} refs/heads/cloud-lane ${base}\n`).status).toBe(1);
  });

  it('lets a clean range through', () => {
    const base = commit('src/a.ts');
    const top = commit('src/b.ts');
    expect(guard('push', `refs/heads/master ${top} refs/heads/master ${base}\n`).status).toBe(0);
  });

  it('lets a cloud session push only cloud-lane or claude/… — the trunk is the parent\'s', () => {
    const base = commit('src/a.ts');
    const top = commit('src/b.ts');
    for (const rref of ['refs/heads/master', 'refs/heads/main', 'refs/heads/dev', 'refs/tags/v1']) {
      expect(guard('push', `refs/heads/master ${top} ${rref} ${base}\n`, true).status, rref).toBe(1);
    }
    for (const rref of ['refs/heads/cloud-lane', 'refs/heads/claude/slice-7b']) {
      expect(guard('push', `refs/heads/master ${top} ${rref} ${base}\n`, true).status, rref).toBe(0);
    }
    expect(guard('push', `refs/heads/master ${top} refs/heads/master ${base}\n`, false).status).toBe(0);
  });

  it('fails CLOSED on a remote tip it cannot walk from', () => {
    const top = commit('src/a.ts');
    expect(guard('push', `refs/heads/master ${top} refs/heads/master ${'f'.repeat(40)}\n`).status).toBe(1);
  });

  it('lets a branch delete through — it sends no commits', () => {
    commit('src/a.ts');
    expect(guard('push', `(delete) ${ZERO} refs/heads/cloud-lane ${'a'.repeat(40)}\n`).status).toBe(0);
  });
});
