/**
 * THE PURE HALF OF THE CHAOS GATE — every judgement it makes, with no I/O.
 *
 * Split out of `chaos.ts` for one reason: **the gate has to be gated too.** The runner
 * is a top-level-await script that mutates shipped source, so a test cannot import it
 * without running it. These four functions carry every decision that could be wrong in
 * a way that makes a broken plant look like a caught one, and `tests/chaosGate.test.ts`
 * pins all of them — including the classification hole that let a compile error pass
 * for a red test in the scratchpad version.
 *
 * Nothing here touches the filesystem, git, or the process. It throws; the runner
 * decides what to print and when to die.
 */
import type { ChaosPlant } from './chaosPlant.ts';

/**
 * The counts off vitest's `Tests` summary line, or `null` where it printed none.
 *
 * `null` IS THE POINT. "vitest exited non-zero and never reported a test result" is a
 * different outcome from "a test failed", and the scratchpad harness conflated them:
 * it scored any non-zero exit as RED, so a plant that broke the *compile* counted as a
 * caught plant while proving nothing about the test meant to catch it.
 *
 * ANSI colour is STRIPPED before parsing rather than tolerated inside the pattern. The
 * first version of this function tried to tolerate it with a lazy `\D*?` and was wrong:
 * an escape like `ESC-[31m` carries digits, and `\D` cannot step over the `3` of the
 * count's own colour code, so `3 failed` parsed as `null`. `tests/chaosGate.test.ts`
 * caught it on the first run. The runner sets `NO_COLOR`, so this is belt-and-braces —
 * but the belt was already broken once.
 *
 * The counts are read off the `Tests` summary LINE only, never the whole output: a
 * stack trace or a test name containing "1 failed" must not be able to feed the gate a
 * number.
 */
const ANSI = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g');

export function testCounts(out: string): { failed: number | null; passed: number | null } {
  const line = /^\s*Tests\s+(.*)$/m.exec(out.replace(ANSI, ''))?.[1];
  if (line === undefined) return { failed: null, passed: null };
  const failed = /(\d+)\s+failed/.exec(line)?.[1];
  const passed = /(\d+)\s+passed/.exec(line)?.[1];
  return {
    failed: failed === undefined ? null : Number(failed),
    passed: passed === undefined ? null : Number(passed),
  };
}

/**
 * How a vitest run reads as a plant verdict.
 *
 * · `red`          — at least one test FAILED. The only passing outcome for a plant.
 * · `green`        — the run passed: the guard is not covered, i.e. A MISSING TEST.
 * · `inconclusive` — non-zero exit with no failed test reported: almost always a plant
 *                    that broke the compile. Proves nothing, so it fails the gate.
 */
export type RunVerdict = 'red' | 'green' | 'inconclusive';

export function classify(code: number, out: string): RunVerdict {
  const { failed } = testCounts(out);
  if (failed !== null && failed > 0) return 'red';
  if (code === 0) return 'green';
  return 'inconclusive';
}

/**
 * Is an UNPLANTED run of a test set green enough to judge plants against?
 *
 * The scratchpad harness never asked. It judged every plant by "did the run exit
 * non-zero", so a test file that was ALREADY failing handed a free RED to every plant
 * aimed at it — the gate would report a perfect score while proving nothing. Green here
 * means all four of: a clean exit, no reported failures, a reported pass count, and that
 * count above zero. The last one matters most: a run that collected NO tests exits 0 and
 * would otherwise read as green.
 */
export function baselineIsGreen(code: number, out: string): boolean {
  const { failed, passed } = testCounts(out);
  return code === 0 && failed === null && passed !== null && passed > 0;
}

/** Non-overlapping occurrences of `needle` in `haystack`. */
export function countOccurrences(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

/**
 * `text` with the plant applied.
 *
 * Throws unless the anchor matches EXACTLY ONCE — zero means the source moved under the
 * plant, two means the plant is ambiguous about which site it breaks, and both must be
 * LOUD rather than skipped. One of the 37 plants recovered from session 35 had already
 * drifted to zero matches by the time it was committed here; this check is how it was
 * found. Also throws if the substitution leaves the text unchanged: a plant that does
 * not mutate proves nothing, and this repo has already been fooled by exactly that (a
 * BSD `sed` invocation that silently no-op'd and reported a false pass).
 */
export function applyPlant(text: string, plant: ChaosPlant): string {
  const occurrences = countOccurrences(text, plant.find);
  if (occurrences !== 1) {
    throw new Error(
      `anchor occurs ${occurrences}× in ${plant.file}, expected exactly 1 — re-anchor the plant`,
    );
  }
  const mutated = text.replace(plant.find, plant.replace);
  if (mutated === text) throw new Error(`the substitution left ${plant.file} unchanged`);
  return mutated;
}

/**
 * Validate one record exported by a `*.plants.ts` module. Throws on anything malformed:
 * a plant file that exports garbage must not be able to shrink the gate quietly.
 */
export function validatePlant(raw: unknown, where: string): ChaosPlant {
  if (typeof raw !== 'object' || raw === null) throw new Error(`${where}: plant is not an object`);
  const r = raw as Record<string, unknown>;

  const str = (key: string): string => {
    const v = r[key];
    if (typeof v !== 'string' || v.length === 0) throw new Error(`${where}: '${key}' must be a non-empty string`);
    return v;
  };

  const rawTests: unknown = r.tests;
  if (!Array.isArray(rawTests) || rawTests.length === 0) {
    throw new Error(`${where}: 'tests' must be a non-empty array of strings`);
  }
  const tests: string[] = [];
  for (const t of rawTests) {
    if (typeof t !== 'string' || t.length === 0) {
      throw new Error(`${where}: every entry of 'tests' must be a non-empty string`);
    }
    tests.push(t);
  }

  // `replace` ALONE may be empty: deleting a guard outright is a legitimate plant, and
  // two of slice 3's are exactly that (the horse's `!doChase` early return, the alpha's
  // third pounce hit). A non-empty rule here would have silently excluded both. The
  // safety net is `find !== replace` plus `applyPlant`'s byte comparison.
  const replace = r.replace;
  if (typeof replace !== 'string') throw new Error(`${where}: 'replace' must be a string`);

  const plant: ChaosPlant = {
    name: str('name'),
    file: str('file'),
    find: str('find'),
    replace,
    tests,
    note: str('note'),
  };
  if (plant.find === plant.replace) {
    throw new Error(`${where} (${plant.name}): 'find' and 'replace' are identical — the plant cannot mutate anything`);
  }
  return plant;
}
