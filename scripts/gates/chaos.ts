/**
 * `npm run chaos` — THE PLANT HARNESS. Breaks the source on purpose, one guard at a
 * time, and requires the suite to notice.
 *
 * ─────────────────────────────────────────────────────────────────────────────────
 * WHY THIS IS IN THE REPO NOW (it was a scratchpad script for 34 sessions).
 * ─────────────────────────────────────────────────────────────────────────────────
 * Chaos plants are the highest-yield gate this project has. Over L4b slice 3, 40 plants
 * ran and **2 stayed green — and both were real missing tests** (the deer test only ever
 * used a LIVE target, so a planted target re-acquire never fired; the stag charge test
 * drove only one of the two direction branches). No typecheck, no lint and no amount of
 * reading finds that. The harness was nevertheless rewritten from scratch in the
 * scratchpad once per slice, so each rewrite re-earned its own bugs and not one of the
 * plants survived the session that wrote it.
 *
 * ─────────────────────────────────────────────────────────────────────────────────
 * ⛔ NOT IN PRE-COMMIT, AND NEVER WILL BE. IT REWRITES SHIPPED SOURCE.
 * ─────────────────────────────────────────────────────────────────────────────────
 * A run that dies mid-plant must not be able to leave the tree dirty, so:
 *   · it REFUSES to start if any file it would mutate is dirty in git — we cannot tell
 *     our damage from yours;
 *   · it REFUSES to start if `.chaos-backup/` survives from a previous run, and prints
 *     what to do about it rather than guessing;
 *   · every original is on disk BEFORE the first byte is mutated;
 *   · `SIGINT` / `SIGTERM` / an uncaught throw all restore before the process leaves;
 *   · every restore is verified byte-for-byte, and the run ends with a
 *     `git status --porcelain` over every touched file that must come back empty.
 * It is a SLICE GATE: run it by hand before you claim a slice is closed.
 * What IS in pre-commit is `tests/chaosGate.test.ts`, which reads every plant's anchor
 * without applying any of them — so anchor drift is caught on the commit that causes it.
 *
 * ─────────────────────────────────────────────────────────────────────────────────
 * THE TWO FAIL-OPEN HOLES IN THE SCRATCHPAD VERSION, CLOSED HERE.
 * ─────────────────────────────────────────────────────────────────────────────────
 * 1. **It never proved the baseline was green.** Every plant was judged by "did the run
 *    exit non-zero", so if a named test file was ALREADY failing, every plant aimed at
 *    it scored red for free and proved nothing. Here each distinct test set is run
 *    UNPLANTED first and must come back green with tests actually executed.
 * 2. **It accepted any non-zero exit as red.** A plant that breaks the *compile* exits
 *    non-zero while telling you nothing about the test that was supposed to catch it.
 *    Here a plant is RED only if vitest reports at least one FAILED TEST; anything else
 *    non-zero is `INCONCLUSIVE`, which fails the gate. See `chaosLib.classify`.
 *
 * The gate is fail-closed throughout. A plant that could not be applied, did not mutate,
 * or produced an unreadable result is a FAILURE — never a skip. The one thing this
 * harness must never do is let "nothing happened" look like "nothing is wrong".
 *
 * Executed by Node directly (native TypeScript, ≥ 22.18) — no runner, no new dependency,
 * no build step.
 *
 * ─────────────────────────────────────────────────────────────────────────────────
 * USAGE
 *   npm run chaos                  every plant; this is the gate
 *   npm run chaos -- --list        print the plants and their provenance, touch nothing
 *   npm run chaos -- 3a            FILTERED (substring match) — a debugging aid, NOT a gate
 * ─────────────────────────────────────────────────────────────────────────────────
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { ChaosPlant } from './chaosPlant.ts';
import { applyPlant, baselineIsGreen, classify, testCounts, validatePlant } from './chaosLib.ts';

const ROOT = resolve(import.meta.dirname, '..', '..');
const PLANT_DIR = join(ROOT, 'tests');
const BACKUP_DIR = join(ROOT, '.chaos-backup');

/**
 * THE PLANT COUNT BINDS, exactly as the test count does.
 *
 * Without it, deleting a plant file quietly shrinks the gate and the run still says
 * "all green". L4b slice 3 ran 40 plants and the harness finish added 3 for the gaps its
 * adjudicated run confirmed; the units-and-windup session added 6 (`tests/duelSeam.plants.ts`);
 * L5-OPP slice 0 (the animList) added 4 (`tests/animList.plants.ts`), one of them
 * for the hold table its gauntlet review found missing; slice 1a (the profile strings)
 * added 8 (`tests/duellistProfile.plants.ts`), one of which found a missing test; slice 1b-i
 * (the derived stats) added 10 (`tests/duellistStats.plants.ts`); slice 1b-ii (the body) added 13
 * (`tests/duellistBody.plants.ts`); slice 2 (the profile writers) added 8 (`tests/duellistWriter.plants.ts`); slice 3a (the stance)
 * added 12 (`tests/mcsPlayer.plants.ts`), one of them for the claimcheck hole it closed; slice 3b
 * (the movement) added 16, slice 4a (the stroke makers) 20, slice 4b (the slash start) 34 and
 * slice 4c (the slash end) 37, in the same file.
 * That is the floor this repo has already paid for. Raise it when a slice adds plants; never lower it to make a run pass. A filtered
 * run skips this check and says so, loudly, in its output.
 *
 * `tests/chaosGate.test.ts` pins the same number from the other side, so the two cannot
 * drift apart silently.
 */
const EXPECTED_TOTAL = 211;

type Status = 'RED' | 'STAYED-GREEN' | 'PLANT-FAILED' | 'NO-OP' | 'INCONCLUSIVE' | 'RESTORE-FAILED';

interface Result {
  readonly plant: ChaosPlant;
  readonly status: Status;
  readonly detail: string;
}

/** A plant with the module it came from, so the report can name its source. */
interface LoadedPlant {
  readonly plant: ChaosPlant;
  readonly source: string;
}

/** Die loudly. Every fail-closed path lands here. */
function fatal(lines: string[]): never {
  process.stderr.write(`\n❌ CHAOS GATE ABORTED\n   ${lines.join('\n   ')}\n\n`);
  process.exit(1);
}

function message(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function git(args: string[]): string {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

/** Run vitest over `files`, returning its exit code and combined output. */
function runVitest(files: readonly string[]): { code: number; out: string } {
  try {
    const out = execFileSync('npx', ['vitest', 'run', ...files], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 900_000,
      // Colour codes would sit between "Tests" and its counts. `classify` tolerates
      // them, but there is no reason to make it work harder.
      env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' },
    });
    return { code: 0, out };
  } catch (err) {
    const e = err as { status?: number | null; stdout?: string; stderr?: string };
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
}

/** Load every `tests/*.plants.ts` module, in filename order. */
async function loadPlants(): Promise<LoadedPlant[]> {
  const files = readdirSync(PLANT_DIR)
    .filter((f) => f.endsWith('.plants.ts'))
    .sort();
  if (files.length === 0) fatal([`no *.plants.ts files in ${PLANT_DIR} — the gate has nothing to run`]);

  const loaded: LoadedPlant[] = [];
  for (const file of files) {
    // A runtime-built specifier on purpose: it keeps `allowImportingTsExtensions` out of
    // the tsconfigs, and the shared type arrives as a type-only import that Node erases
    // before it ever has to resolve a path.
    const mod = (await import(pathToFileURL(join(PLANT_DIR, file)).href)) as { PLANTS?: unknown };
    const list = mod.PLANTS;
    if (!Array.isArray(list)) fatal([`${file}: must export a PLANTS array`]);
    list.forEach((raw, i) => {
      try {
        loaded.push({ plant: validatePlant(raw, `${file}[${i}]`), source: file });
      } catch (err) {
        fatal([message(err)]);
      }
    });
  }
  return loaded;
}

// ── the run ──────────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const listOnly = argv.includes('--list');
const filters = argv.filter((a) => !a.startsWith('--'));
const filtered = filters.length > 0;

const all = await loadPlants();

if (!filtered && all.length !== EXPECTED_TOTAL) {
  fatal([
    `PLANT COUNT DRIFTED: found ${all.length}, expected ${EXPECTED_TOTAL}.`,
    'A gate that silently shrinks is worse than no gate. If a slice really added or',
    'removed plants, change EXPECTED_TOTAL here AND in tests/chaosGate.test.ts and say',
    'so in the commit — never to make a run pass.',
  ]);
}

const selected = filtered
  ? all.filter(({ plant, source }) => filters.some((f) => plant.name.includes(f) || source.includes(f)))
  : all;
if (selected.length === 0) fatal([`no plant matches ${filters.join(' ')}`]);

if (listOnly) {
  process.stdout.write(`\nCHAOS PLANTS — ${selected.length} of ${all.length}\n${'─'.repeat(100)}\n`);
  selected.forEach(({ plant, source }, i) => {
    process.stdout.write(
      `${String(i + 1).padStart(3)}. ${plant.name}\n     ${plant.file}  ←  ${source}  [${plant.note}]\n`,
    );
  });
  process.stdout.write(`${'─'.repeat(100)}\nnothing was touched (--list)\n\n`);
  process.exit(0);
}

if (filtered) {
  process.stdout.write(`\n⚠️  FILTERED RUN — ${selected.length} of ${all.length} plants. THIS IS NOT THE GATE.\n`);
}

// Fail-closed pre-flight 1: a previous run died without restoring.
if (existsSync(BACKUP_DIR) && readdirSync(BACKUP_DIR).length > 0) {
  const left = readdirSync(BACKUP_DIR);
  fatal([
    `${BACKUP_DIR} still holds ${left.length} backup(s) from a run that did not finish:`,
    ...left.map((f) => `  ${f}`),
    'Each filename is its repo path with "/" written as "__". Restore by hand, or if the',
    'tree is already clean (`git status`), delete the directory. Not doing this',
    'automatically is deliberate: it is the one situation where a script guessing wrong',
    'destroys real work.',
  ]);
}

// Fail-closed pre-flight 2: nothing we are about to mutate may already be dirty.
const targets = [...new Set(selected.map(({ plant }) => plant.file))].sort();
const dirty = git(['status', '--porcelain', '--', ...targets]).trim();
if (dirty.length > 0) {
  fatal([
    'these files are already modified, so a restore could not be told from your work:',
    ...dirty.split('\n').map((l) => `  ${l}`),
    'Commit or stash them, then re-run.',
  ]);
}

// The in-flight plant, restored by every exit path there is. `exit` covers normal
// termination, `process.exit()` and an uncaught throw; the two signals have no default
// 'exit' behaviour, so they are wired explicitly.
let inFlight: { abs: string; original: Buffer; backup: string } | null = null;
function restoreInFlight(): void {
  if (inFlight === null) return;
  const { abs, original, backup } = inFlight;
  inFlight = null;
  writeFileSync(abs, original);
  if (existsSync(backup)) rmSync(backup);
  process.stderr.write(`\n[chaos] restored ${abs} on the way out\n`);
}
process.on('exit', restoreInFlight);
process.on('SIGINT', () => {
  restoreInFlight();
  process.exit(130);
});
process.on('SIGTERM', () => {
  restoreInFlight();
  process.exit(143);
});

mkdirSync(BACKUP_DIR, { recursive: true });

// Fail-closed pre-flight 3: every distinct test set must be GREEN unplanted. Without
// this, a test file that is already red hands a free pass to every plant aimed at it.
const baselines = new Set<string>();
for (const { plant } of selected) {
  const key = [...plant.tests].join(' ');
  if (baselines.has(key)) continue;
  process.stdout.write(`[baseline] ${key} … `);
  const { code, out } = runVitest(plant.tests);
  const { failed, passed } = testCounts(out);
  if (!baselineIsGreen(code, out)) {
    process.stdout.write('FAIL\n');
    fatal([
      `baseline for '${key}' is not green: exit ${code}, ${passed ?? '?'} passed, ${failed ?? '?'} failed.`,
      'Every plant against it would score red for the wrong reason. Fix the suite first.',
    ]);
  }
  baselines.add(key);
  process.stdout.write(`green (${passed} tests)\n`);
}

process.stdout.write(`\nCHAOS PLANTS — ${selected.length} plant(s), one vitest run each, serially.\n`);
process.stdout.write('(serial on purpose: plants mutate shared files, and parallel writes to shared\n');
process.stdout.write(" state is this repo's documented parallel-overwrite failure mode)\n\n");

const results: Result[] = [];
for (const [i, { plant, source }] of selected.entries()) {
  process.stdout.write(`${String(i + 1).padStart(3)}/${selected.length} ${plant.name}\n`);

  const abs = join(ROOT, plant.file);
  const original = readFileSync(abs);
  const text = original.toString('utf8');

  let mutatedText: string;
  try {
    mutatedText = applyPlant(text, plant);
  } catch (err) {
    // LOUD, never a skip: a plant that cannot be applied must not resemble one that
    // passed. `applyPlant` refuses an anchor that matches anything other than once, and
    // refuses a substitution that changes nothing.
    const detail = message(err);
    const status: Status = detail.includes('unchanged') ? 'NO-OP' : 'PLANT-FAILED';
    results.push({ plant, status, detail });
    process.stdout.write(`      → ${status} (${detail})\n`);
    continue;
  }

  const backup = join(BACKUP_DIR, plant.file.replaceAll('/', '__'));
  writeFileSync(backup, original);
  inFlight = { abs, original, backup };
  writeFileSync(abs, Buffer.from(mutatedText, 'utf8'));

  const { code, out } = runVitest(plant.tests);

  // Restore FIRST, always, before judging anything.
  writeFileSync(abs, original);
  const readBack = readFileSync(abs);
  inFlight = null;
  rmSync(backup);

  if (!readBack.equals(original)) {
    results.push({ plant, status: 'RESTORE-FAILED', detail: `${plant.file} did not come back byte-identical` });
    process.stdout.write('      → RESTORE-FAILED\n');
    continue;
  }

  switch (classify(code, out)) {
    case 'red': {
      const { failed } = testCounts(out);
      const first = out.split('\n').find((l) => l.trim().startsWith('×'))?.trim() ?? '';
      results.push({ plant, status: 'RED', detail: `${failed} test(s) failed · ${first.slice(0, 90)}` });
      process.stdout.write(`      → RED (${failed} failed) · ${source} [${plant.note}]\n`);
      break;
    }
    case 'green':
      results.push({
        plant,
        status: 'STAYED-GREEN',
        detail: 'MISSING TEST — no test in the named files covers this guard',
      });
      process.stdout.write('      → STAYED-GREEN ⚠️  MISSING TEST\n');
      break;
    case 'inconclusive':
      results.push({
        plant,
        status: 'INCONCLUSIVE',
        detail: `vitest exited ${code} without reporting a failed test — the plant probably broke the compile, which proves nothing about the test`,
      });
      process.stdout.write(`      → INCONCLUSIVE (exit ${code}, no failed test reported)\n`);
      break;
  }
}

rmSync(BACKUP_DIR, { recursive: true, force: true });

// Fail-closed post-flight: the tree must be exactly as we found it.
const stillDirty = git(['status', '--porcelain', '--', ...targets]).trim();

const red = results.filter((r) => r.status === 'RED').length;
const bad = results.filter((r) => r.status !== 'RED');
const restored = results.filter((r) => r.status !== 'RESTORE-FAILED').length;

process.stdout.write(`\n${'═'.repeat(100)}\nCHAOS PLANT REPORT\n${'═'.repeat(100)}\n`);
for (const [i, r] of results.entries()) {
  process.stdout.write(
    `${r.status === 'RED' ? 'OK  ' : 'BAD '}${String(i + 1).padStart(3)}. [${r.status.padEnd(14)}] ${r.plant.name}\n`,
  );
  process.stdout.write(`             → ${r.detail}\n`);
}
process.stdout.write(`${'═'.repeat(100)}\n`);
process.stdout.write(`${red}/${results.length} plants went RED.\n`);
process.stdout.write(
  `${restored}/${results.length} files restored byte-identical; git says ${stillDirty === '' ? 'the tree is clean' : 'THE TREE IS DIRTY'}.\n`,
);
if (filtered) process.stdout.write('⚠️  FILTERED RUN — this was not the gate.\n');

if (stillDirty !== '') {
  fatal(['the run finished but left the tree dirty:', ...stillDirty.split('\n').map((l) => `  ${l}`)]);
}
if (bad.length > 0) {
  process.stderr.write(`\n❌ ${bad.length} plant(s) did not go red:\n`);
  for (const r of bad) process.stderr.write(`   [${r.status}] ${r.plant.name}\n      ${r.detail}\n`);
  process.stderr.write(
    '\nA STAYED-GREEN plant is a missing test — re-author the TEST, never the plant.\n' +
      'A PLANT-FAILED / NO-OP / INCONCLUSIVE plant proved nothing — fix the plant.\n\n',
  );
  process.exit(1);
}
process.stdout.write('\n✅ every plant went red and every file came back byte-identical.\n\n');
