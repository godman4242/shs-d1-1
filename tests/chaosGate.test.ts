/**
 * THE CHAOS GATE'S OWN GATE.
 *
 * `npm run chaos` mutates shipped source, so it can never live in pre-commit. This file
 * is the half that can: it reads every plant WITHOUT applying any of them, and it pins
 * every judgement `scripts/gates/chaosLib.ts` makes.
 *
 * ─────────────────────────────────────────────────────────────────────────────────
 * WHY IT EXISTS — an anchor really did drift, and nothing noticed for a day.
 * ─────────────────────────────────────────────────────────────────────────────────
 * Session 35's plants were transcribed here from its throwaway harness. One of the 37 —
 * the stag-constructor plant — no longer matched ANYTHING: after the plant ran, the
 * committed `EnemyStag.ts` gained a four-line comment between `super(...)` and
 * `this.canGotLaunched`, so its anchor went from one match to zero. In the old workflow
 * that would have surfaced only on the next by-hand chaos run, a slice later. Here it is
 * a red test on the commit that causes it, because an anchor is exactly the kind of
 * claim-about-the-source this repo has repeatedly shipped wrong.
 *
 * ⚠️ NOTE WHAT THIS FILE DOES **NOT** CLAIM. It proves each plant is APPLICABLE — the
 * anchor resolves, uniquely, and the substitution would change bytes. It cannot prove a
 * plant goes RED; only `npm run chaos` can, by running it. Do not read a green run here
 * as "the plants are good".
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { ChaosPlant } from '../scripts/gates/chaosPlant.ts';
import { applyPlant, baselineIsGreen, classify, countOccurrences, testCounts, validatePlant } from '../scripts/gates/chaosLib.ts';
import { splitLines } from '../scripts/gates/claimcheckLib.ts';
import { PLANTS as PLANTS_3A } from './npcSlice3a.plants';
import { PLANTS as PLANTS_3B } from './npcSlice3b.plants';
import { PLANTS as PLANTS_SEAM } from './duelSeam.plants';
import { PLANTS as PLANTS_ANIMLIST } from './animList.plants';

const HERE = import.meta.dirname;
const ROOT = join(HERE, '..');

/**
 * Must equal `EXPECTED_TOTAL` in `scripts/gates/chaos.ts`, and a test below proves it
 * does by reading that file. Two copies of one rule that can drift apart silently is a
 * documented failure mode of this account's tooling; this is the cheap cure.
 */
const EXPECTED_PLANTS = 53;

const MODULES: Array<{ file: string; plants: readonly ChaosPlant[] }> = [
  { file: 'npcSlice3a.plants.ts', plants: PLANTS_3A },
  { file: 'npcSlice3b.plants.ts', plants: PLANTS_3B },
  { file: 'duelSeam.plants.ts', plants: PLANTS_SEAM },
  { file: 'animList.plants.ts', plants: PLANTS_ANIMLIST },
];

const ALL: Array<{ module: string; index: number; plant: ChaosPlant }> = MODULES.flatMap((m) =>
  m.plants.map((plant, index) => ({ module: m.file, index, plant })),
);

describe('chaos gate — the plant corpus', () => {
  /**
   * FAIL-CLOSED DISCOVERY. The runner finds plant files by globbing `tests/*.plants.ts`;
   * this test finds them by static import. If the two sets ever disagree — a new plant
   * file nobody added here, or one deleted out from under the runner — that is a gate
   * silently changing size, which is the thing the plant count exists to prevent.
   */
  it('imports exactly the *.plants.ts files that are on disk', () => {
    const onDisk = readdirSync(HERE)
      .filter((f) => f.endsWith('.plants.ts'))
      .sort();
    expect(onDisk).toEqual(MODULES.map((m) => m.file).sort());
  });

  it(`holds exactly ${EXPECTED_PLANTS} plants — the count L4b slice 3, the harness finish, the windup fix and the animList paid for`, () => {
    expect(ALL).toHaveLength(EXPECTED_PLANTS);
  });

  /**
   * One rule, one number: read the runner's constant rather than trusting a copy.
   *
   * ⚠️ READ THE COMMENT-STRIPPED CODE, NOT THE RAW FILE. The first version of this test
   * ran `/const EXPECTED_TOTAL = (\d+);/.exec(src)` over the raw text — unanchored, first
   * match wins — and a stale `// const EXPECTED_TOTAL = 43;` left above a live
   * `= Number(process.env.CHAOS_TOTAL ?? 43)` made it read 43 out of the COMMENT and pass,
   * defeating the one thing it exists to do. Measured, on file copies. Anchoring alone is
   * not enough either: `^` matches a line start, and a line inside a `/* … *\/` block is
   * at a line start too. JClaw shipped and closed this exact bug in 88b142ee — "a required
   * line moved into a comment all passed ... They now strip comments first".
   *
   * Exactly one match is required, so a second declaration cannot shadow the first.
   */
  it('agrees with scripts/gates/chaos.ts on the expected plant count', () => {
    const src = readFileSync(join(ROOT, 'scripts/gates/chaos.ts'), 'utf8');
    const code = splitLines(src)
      .map((l) => l.code)
      .join('\n');
    const found = [...code.matchAll(/^const EXPECTED_TOTAL = (\d+);\s*$/gm)];
    expect(found, 'chaos.ts must declare EXPECTED_TOTAL exactly once, in code, at line start').toHaveLength(1);
    expect(found[0]?.[1]).toBe(String(EXPECTED_PLANTS));
  });

  it('gives every plant a unique name — the report addresses plants by name', () => {
    const names = ALL.map(({ plant }) => plant.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('marks every plant with a provenance the report can print', () => {
    for (const { module, index, plant } of ALL) {
      expect(plant.note, `${module}[${index}]`).toMatch(/^(recovered|reauthored):/);
    }
  });

  it.each(ALL.map(({ module, index, plant }) => [`${module}[${index}] ${plant.name}`, plant] as const))(
    'anchor resolves exactly once — %s',
    (_label, plant) => {
      const abs = join(ROOT, plant.file);
      expect(existsSync(abs), `${plant.file} does not exist`).toBe(true);
      const text = readFileSync(abs, 'utf8');
      // The message matters more than the assertion: an anchor at 0 means the source
      // moved, at 2+ means the plant is ambiguous about which site it breaks.
      expect(
        countOccurrences(text, plant.find),
        `anchor for "${plant.name}" occurs ${countOccurrences(text, plant.find)}× in ${plant.file} — re-anchor it`,
      ).toBe(1);
      // And it must actually mutate: `applyPlant` throws on a no-op.
      expect(() => applyPlant(text, plant)).not.toThrow();
    },
  );

  it('names only test files that exist', () => {
    for (const { plant } of ALL) {
      for (const t of plant.tests) {
        expect(existsSync(join(ROOT, t)), `${plant.name} names a missing test file: ${t}`).toBe(true);
      }
    }
  });

  /**
   * The plants are DATA, not specs — vitest must never collect them as a suite. If a
   * future rename made them match the test glob, they would contribute zero tests and
   * quietly break the "test count binds" contract.
   */
  it('keeps the plant files out of the test glob', () => {
    const collected = execFileSync('npx', ['vitest', 'list', '--filesOnly'], {
      cwd: ROOT,
      encoding: 'utf8',
      env: { ...process.env, NO_COLOR: '1' },
    });
    expect(collected).not.toContain('.plants.ts');
  });
});

describe('chaosLib.testCounts — reading vitest\'s summary', () => {
  it('reads a passing run', () => {
    expect(testCounts('      Tests  1438 passed (1438)\n')).toEqual({ failed: null, passed: 1438 });
  });

  it('reads a mixed run', () => {
    expect(testCounts('      Tests  2 failed | 52 passed (54)\n')).toEqual({ failed: 2, passed: 52 });
  });

  it('reads nothing out of a run that never reported tests', () => {
    expect(testCounts('Error: Failed to load url ./Broken.ts\n')).toEqual({ failed: null, passed: null });
  });

  /**
   * Colour codes carry digits (`ESC-[31m`), so a greedy parse would read the `31` as
   * the failure count. The runner sets NO_COLOR, but a reporter change must not be able
   * to silently corrupt the number the gate judges on.
   */
  it('is not fooled by digits inside ANSI colour codes', () => {
    const coloured = `      Tests  [31m3 failed[0m | [32m51 passed[0m (54)\n`;
    expect(testCounts(coloured)).toEqual({ failed: 3, passed: 51 });
  });
});

describe('chaosLib.classify — the hole the scratchpad harness had', () => {
  it('calls a failed test RED', () => {
    expect(classify(1, '      Tests  1 failed | 53 passed (54)\n')).toBe('red');
  });

  it('calls a clean pass GREEN — which is a MISSING TEST, not a success', () => {
    expect(classify(0, '      Tests  54 passed (54)\n')).toBe('green');
  });

  /**
   * THE WHOLE POINT. The scratchpad harness scored any non-zero exit as red, so a plant
   * that broke the COMPILE counted as a caught plant while proving nothing about the
   * test that was supposed to catch it.
   */
  it('calls a non-zero exit with no failed test INCONCLUSIVE, never red', () => {
    const compileError = [
      ' FAIL  tests/npcSlice3a.test.ts [ tests/npcSlice3a.test.ts ]',
      "Error: Transform failed with 1 error: expected ';'",
      '',
      ' Test Files  1 failed (1)',
      '      Tests  no tests',
    ].join('\n');
    expect(classify(1, compileError)).toBe('inconclusive');
  });

  it('still calls it red when tests failed AND the exit was non-zero for another reason', () => {
    expect(classify(130, '      Tests  1 failed | 1 passed (2)\n')).toBe('red');
  });
});

describe('chaosLib.baselineIsGreen — the other hole the scratchpad harness had', () => {
  it('accepts a genuinely green run', () => {
    expect(baselineIsGreen(0, '      Tests  54 passed (54)\n')).toBe(true);
  });

  it('refuses a suite that is already red — every plant against it would score red for free', () => {
    expect(baselineIsGreen(1, '      Tests  1 failed | 53 passed (54)\n')).toBe(false);
  });

  it('refuses a run that collected NO tests, even though it exited 0', () => {
    // The dangerous one: a typo'd filename makes vitest pass vacuously, so every plant
    // aimed at it would come back STAYED-GREEN and read as a missing test instead of as
    // a broken harness.
    expect(baselineIsGreen(0, '      Tests  no tests\n')).toBe(false);
    expect(baselineIsGreen(0, 'No test files found\n')).toBe(false);
  });

  it('refuses a run that failed to compile', () => {
    expect(baselineIsGreen(1, 'Error: Transform failed\n Test Files  1 failed (1)\n')).toBe(false);
  });

  it('refuses a green-looking run that still reported a failure', () => {
    expect(baselineIsGreen(0, '      Tests  1 failed | 53 passed (54)\n')).toBe(false);
  });
});

describe('chaosLib.applyPlant — fail-closed application', () => {
  const base: ChaosPlant = {
    name: 'probe',
    file: 'probe.ts',
    find: 'const a = 1;',
    replace: 'const a = 2;',
    tests: ['tests/probe.test.ts'],
    note: 'reauthored:unit-probe',
  };

  it('counts OVERLAPPING anchors — `}\\n}` occurs twice in `}\\n}\\n}`, so it is ambiguous, not unique', () => {
    expect(countOccurrences('aaa', 'aa')).toBe(2);
    expect(countOccurrences('  }\n}\n}\n', '}\n}')).toBe(2);
    expect(() => applyPlant('aaa', { ...base, find: 'aa', replace: 'b' })).toThrow(/occurs 2×/);
  });

  it('applies a unique anchor', () => {
    expect(applyPlant('x\nconst a = 1;\ny', base)).toBe('x\nconst a = 2;\ny');
  });

  it('inserts the replacement LITERALLY — `$&`, `$1` and `$$` are String.replace patterns, not plant text', () => {
    // Latent until a plant writes a template literal or a regex: `'$&'` in a replace string
    // makes String.replace re-insert the matched anchor, so the "plant" would mutate into
    // something nobody wrote. Found porting this runner for reuse; no shipped plant had a `$`.
    const dollar = { ...base, replace: 'const a = `$&${b}$$`;' };
    expect(applyPlant('const a = 1;', dollar)).toBe('const a = `$&${b}$$`;');
  });

  it('refuses an anchor that matches nothing — the source moved under the plant', () => {
    expect(() => applyPlant('nothing like it here', base)).toThrow(/occurs 0×/);
  });

  it('refuses an ambiguous anchor — two sites, and it cannot say which it breaks', () => {
    expect(() => applyPlant('const a = 1;\nconst a = 1;', base)).toThrow(/occurs 2×/);
  });

  it('refuses a substitution that changes nothing', () => {
    // Reachable only past validatePlant, and deliberately still checked: this repo has
    // already been fooled by a plant that silently failed to mutate.
    const noop = { ...base, replace: base.find };
    expect(() => applyPlant('const a = 1;', noop)).toThrow(/unchanged/);
  });

  it('replaces only the first occurrence, never all of them', () => {
    // A plant is a single surgical break. `String.replace` with a string pattern hits
    // one site; if this ever became `replaceAll`, a plant could silently break several.
    expect(applyPlant('const a = 1;', base)).toBe('const a = 2;');
  });
});

describe('chaosLib.validatePlant — a malformed plant file is loud', () => {
  const ok = {
    name: 'n',
    file: 'f.ts',
    find: 'a',
    replace: 'b',
    tests: ['tests/t.test.ts'],
    note: 'reauthored:probe',
  };

  it('accepts a well-formed plant', () => {
    expect(validatePlant(ok, 'w')).toMatchObject({ name: 'n', file: 'f.ts' });
  });

  /**
   * A DELETION IS A LEGITIMATE PLANT. Two of slice 3's remove a guard outright (the
   * horse's `!doChase` early return, the alpha's third pounce hit), so `replace` may be
   * empty — and a blanket non-empty rule would have silently excluded both. This test
   * exists because the first draft of the validator did exactly that.
   */
  it('accepts an EMPTY replace — deleting a guard is a plant', () => {
    expect(validatePlant({ ...ok, replace: '' }, 'w').replace).toBe('');
  });

  it.each([
    ['not an object', 42],
    ['a missing name', { ...ok, name: undefined }],
    ['an empty name', { ...ok, name: '' }],
    ['a missing file', { ...ok, file: undefined }],
    ['an empty find', { ...ok, find: '' }],
    ['a non-string replace', { ...ok, replace: 7 }],
    ['no tests', { ...ok, tests: [] }],
    ['a non-array tests', { ...ok, tests: 'tests/t.test.ts' }],
    ['a non-string test entry', { ...ok, tests: [1] }],
    ['a missing note', { ...ok, note: undefined }],
    ['find identical to replace', { ...ok, find: 'same', replace: 'same' }],
  ])('rejects %s', (_label, raw) => {
    expect(() => validatePlant(raw, 'w')).toThrow();
  });

  it('names the offending record so the failure is actionable', () => {
    expect(() => validatePlant({ ...ok, name: '' }, 'npcSlice3a.plants.ts[7]')).toThrow(
      /npcSlice3a\.plants\.ts\[7\]/,
    );
  });
});
