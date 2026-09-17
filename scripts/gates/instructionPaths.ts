/**
 * INSTRUCTION-PATH GATE — every repo path the four standing instruction files name must exist.
 *
 * ─────────────────────────────────────────────────────────────────────────────────
 * WHY IT EXISTS — a rule in CLAUDE.md was false for nine days and nothing noticed.
 * ─────────────────────────────────────────────────────────────────────────────────
 * `CLAUDE.md` told every session the per-turn ship-bar contract auto-injects from
 * `.claude/ship-bar.md`. Commit 995bb52 (2026-09-08) deliberately deleted that file —
 * the contract is global now — and left the pointer behind. Prose is not compiled, so
 * the false line survived every gate this repo has. JClaw hit the class harder:
 * 0dfcd451 corrected SIX claims its AGENTS.md made that the code contradicted, inside a
 * block already stamped "Verified 2026-09-09". A date in a comment is not a check.
 *
 * ─────────────────────────────────────────────────────────────────────────────────
 * WHY IT IS THIS SMALL — the scope IS the design, and it was measured.
 * ─────────────────────────────────────────────────────────────────────────────────
 * The first version of this gate read six files including `RESUME_HERE.md`. Measured
 * over the whole set: 24 unresolved tokens, of which exactly ONE was a real defect —
 * 4% precision, needing six classes of suppression on day one. 19 of the 24 false reds
 * were in RESUME_HERE.md, which contributed ZERO true ones: it is a 991-line session
 * scratchpad, committed 164 times a quarter, mandated to be rewritten not appended, and
 * full of deliberate templates (`src/core/npc/<Name>.ts`), brace shorthand and run-scoped
 * fragments. Policing it is how a gate becomes the thing people bypass with --no-verify.
 *
 * So the scope is the four STANDING files — the ones that state rules and change rarely
 * (9 commits in 3 months). Over that set the gate needs NO exemption list at all: the
 * only non-defect misses were the layer names in the dependency-direction rule, and
 * those were fixed by writing `src/core/` instead of `core/`, which is more accurate
 * prose anyway. An exemption list is a hiding place — "bare fragment" would have had to
 * swallow `core/` and `run2/`, and a genuinely deleted `docs/loop/` is byte-identical to
 * that idiom. Zero exemptions means a red is always real.
 *
 * ⚠️ WHAT THIS DOES NOT CLAIM. It checks that a named path RESOLVES, not that the
 * sentence around it is true. "`git grep -P`, never `-E`" is a claim no resolver can judge.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..', '..');

/** The standing instruction files. NOT RESUME_HERE.md (a scratchpad — see the header)
 *  and NOT ~/.claude/CLAUDE.md (outside the repo; a test that reads it cannot pass in CI). */
export const FILES = [
  'CLAUDE.md',
  'src/core/CLAUDE.md',
  'src/config/CLAUDE.md',
  'src/game/CLAUDE.md',
] as const;

/** Declared top-level entries, so an EXTENSIONLESS token is still a path reference.
 *  Without this, `.githooks/pre-commit` — the path the Quality gate section leans on —
 *  is silently dropped and never checked. Every entry is asserted to exist AND to be
 *  tracked, so a gitignored directory can never be added here and red a clean clone. */
export const ROOTS = ['src', 'tests', 'scripts', 'docs', '.githooks', '.claude', '.github'] as const;

const TOKEN = /`([^`\n]+)`/g;
const PATHY = /^[A-Za-z0-9._~/@-]+$/;
const EXT = /\.(ts|tsx|js|mjs|cjs|json|md|sh|py|yml|yaml|html|css|toml)$/;

/**
 * A path-ish backticked token. Bare filenames (no slash) are out of scope on purpose:
 * prose is full of them (`Sim.ts`, `ogPose.ts`) and they carry no location to check.
 * `~`-rooted tokens are out of scope too — they name files on one machine, and
 * resolving them against $HOME would make this gate GREEN over its own founding defect,
 * since `.claude/ship-bar.md` does exist at ~/.claude/ship-bar.md. Measured, not reasoned.
 */
export function extract(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(TOKEN)) {
    const t = (m[1] ?? '').trim().replace(/:\d+(-\d+)?$/, '');
    if (!t.includes('/') || !PATHY.test(t)) continue;
    if (t.startsWith('~') || /^(https?|git@)/.test(t)) continue;
    const first = t.split('/')[0] ?? '';
    if (!EXT.test(t) && !t.endsWith('/') && !(ROOTS as readonly string[]).includes(first)) continue;
    out.push(t);
  }
  return out;
}

export interface Report {
  readonly tokens: ReadonlyArray<{ readonly file: string; readonly token: string }>;
  readonly dead: readonly string[];
  /** Gitignored study-only trees (`reference/`). Skipped and COUNTED: they resolve only
   *  on a machine that holds them, so checking them would red every clean clone and CI
   *  run. Same loud-skip idiom `tests/claimcheck.test.ts` already uses for that tree. */
  readonly ignoredSkipped: readonly string[];
  readonly missingRoots: readonly string[];
  readonly emptyFiles: readonly string[];
}

/** Batched `git check-ignore --stdin`. Exit 1 means "none matched" and still carries the
 *  partial list on stdout, so it is a result, not an error. */
function gitIgnored(root: string, tokens: readonly string[]): Set<string> {
  const uniq = [...new Set(tokens)];
  if (uniq.length === 0) return new Set();
  try {
    const out = execFileSync('git', ['-C', root, 'check-ignore', '--stdin'], { input: uniq.join('\n'), encoding: 'utf8' });
    return new Set(out.split('\n').filter(Boolean));
  } catch (e: unknown) {
    const err = e as { status?: number; stdout?: string };
    if (err.status === 1) return new Set((err.stdout ?? '').split('\n').filter(Boolean));
    throw e;
  }
}

export function check(root: string = ROOT): Report {
  const all = FILES.flatMap((file) =>
    extract(readFileSync(join(root, file), 'utf8')).map((token) => ({ file, token })));
  const ignored = gitIgnored(root, all.map((t) => t.token));
  const ignoredSkipped = all.filter((t) => ignored.has(t.token)).map((t) => t.token);
  const tokens = all.filter((t) => !ignored.has(t.token));
  const dead = tokens
    .filter(({ token }) => !existsSync(join(root, token)))
    .map(({ file, token }) => `${file} -> ${token}`);
  const missingRoots = ROOTS.filter((r) => !existsSync(join(root, r)));
  /** A file contributing no tokens is indistinguishable from one never opened. This is
   *  the broken-extractor guard, and it is deliberately NOT a count floor: a floor is a
   *  second copy of a number that every prose edit can drift, which is this repo's own
   *  documented killer. "Each file yields at least one" needs no number at all. */
  const emptyFiles = FILES.filter((f) => !tokens.some((t) => t.file === f));
  return { tokens, dead, ignoredSkipped, missingRoots, emptyFiles };
}

export function problems(r: Report): string[] {
  const out: string[] = [];
  for (const d of r.dead) out.push(`names a path that does not exist: ${d}`);
  for (const f of r.emptyFiles) out.push(`${f} yielded no path tokens — the extractor is broken, or the file moved`);
  for (const m of r.missingRoots) out.push(`ROOTS entry \`${m}\` does not exist — a top-level directory was renamed`);
  return out;
}

if (import.meta.filename === process.argv[1]) {
  const r = check();
  const bar = '='.repeat(84);
  process.stdout.write(`\n${bar}\nINSTRUCTION PATHS\n${bar}\n`);
  process.stdout.write(`files read          ${FILES.length}  (the standing rule files; RESUME_HERE.md is out of scope by design)\n`);
  process.stdout.write(`path tokens checked ${r.tokens.length}\n`);
  process.stdout.write(`gitignored, skipped ${r.ignoredSkipped.length}  (study-only trees a clean clone does not have)\n`);
  const probs = problems(r);
  if (probs.length > 0) {
    process.stdout.write(`\n❌ ${probs.length} problem(s):\n`);
    for (const p of probs) process.stdout.write(`   - ${p}\n`);
    process.stdout.write('\n');
    process.exit(1);
  }
  process.stdout.write('\n✅ every path an instruction file names resolves.\n\n');
}
