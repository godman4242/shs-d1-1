/**
 * THE NPC TEST-HARNESS PREFLIGHT — the checks that catch a TEST bug before it reads as a
 * PORT bug.
 *
 * ─────────────────────────────────────────────────────────────────────────────────
 * WHY. Session 35 wrote 99 tests across L4b slice 3 and **3 of 3 first-run failures were
 * TEST bugs, not port bugs.** Every one cost a debugging cycle, and every one read as
 * `expected 10 to be 1` — bare `OG_STATE` integers with no hint of what moved.
 * ─────────────────────────────────────────────────────────────────────────────────
 *
 * ⚠️ THE HARNESS KICKOFF GOT THE SHARED ROOT WRONG, and this file is built on the
 * corrected one. It claimed all three failures shared one root — "an actor parked in a
 * state its own `doAction` left at once". Measured against the source, that is true of
 * exactly ONE of the three:
 *
 * | session 35 failure | what actually went wrong | caught by |
 * |---|---|---|
 * | the bear's cooldown | the test WROTE `idleCounter = 1`; `doAction` TICKED it to 0 **before** the branch READ it | `readsWhatYouWrote` |
 * | the alpha parked in FALL | it really was in FALL at setup, and the first `update()` landed it — the LAND clip then masked the clip under test | `parked` |
 * | an rng of 0.9 | the actor FAILED to leave IDLE: one `seq` value had to satisfy two different bands, and the seq CLAMPS rather than complaining | `rollsFor` |
 *
 * The root they DO share, and the one this module is designed around:
 * **a test's setup silently did not hold at the moment of the assertion** — the state it
 * parked, the counter it wrote, or the rng value it supplied. Three failures, three
 * different pieces of setup, three checks. Two helpers could not have covered it, and
 * `parked()` alone would have been actively wrong on the bear: leaving RUN for ATTACK is
 * the assertion under test in the very next test in that file.
 *
 * ─────────────────────────────────────────────────────────────────────────────────
 * ALSO THE END OF SIX COPIES OF `seq`.
 * ─────────────────────────────────────────────────────────────────────────────────
 * `seq` was redefined verbatim in six suites and `counting` in four (in two variants).
 * They live here now. The parameterised `counting` is the one exported, because it
 * subsumes the hard-wired 0.5 form the earlier slices used.
 *
 * NOT collected as a suite: `vite.config.ts` sets `include: ['tests/**\/*.test.ts']`, and
 * this file is not a `.test.ts`.
 */
import { OG_STATE } from '../../src/config/ogActor';
import type { OgState } from '../../src/config/ogActor';
import type { Rng } from '../../src/core/Sim';

/**
 * A deterministic rng over `vals`.
 *
 * ⚠️ IT CLAMPS. Once the values run out it returns the LAST one forever — it never throws,
 * never wraps and never yields `undefined`. That clamp is not a quirk to fix: it is how
 * session 35's `seq(0.9)` silently fed one value to three rolls with two different bands,
 * and it is exactly why `rollsFor` has to exist. A seq can never tell you it was
 * under-sized. (An empty `seq()` returns 0 forever, which `noUncheckedIndexedAccess`
 * forces us to spell out.)
 */
export const seq = (...vals: number[]): Rng => {
  let i = 0;
  return () => vals[Math.min(i++, vals.length - 1)] ?? 0;
};

/** An rng that always returns `val` and counts how many times it was asked. */
export const counting = (val = 0.5): Rng & { calls: number } => {
  const f = (() => {
    f.calls++;
    return val;
  }) as Rng & { calls: number };
  f.calls = 0;
  return f;
};

/**
 * `OG_STATE.FALL` → `'FALL'`.
 *
 * `OG_STATE` is a dense numeric map, so every state mismatch in this suite reads as bare
 * integers: `expected 5 to be 4`. A preflight whose message is `FALL → LAND` is worth more
 * than the check itself.
 */
export function stateName(state: number): string {
  const hit = Object.entries(OG_STATE).find(([, v]) => v === state);
  return hit?.[0] ?? `OG_STATE(${state})`;
}

/** The public surface these checks need. Deliberately structural — no class import. */
interface Parkable {
  actionState: OgState;
  getAnim(): string;
}

/**
 * ASSERT THE ACTOR IS STILL IN `state` — and say what moved it if not.
 *
 * ⚠️ PLACE IT WHERE THE ASSERTION IS, NOT WHERE THE SETUP IS. This is the one thing the
 * kickoff's wording hides. An actor parked with `startAction(OG_STATE.FALL)` really IS in
 * FALL when setup ends, so a `parked()` immediately after setup passes and catches nothing.
 * The alpha left FALL inside the FIRST `update()` — `y >= groundY` with `velY === 0` lands
 * it — so the check belongs after the frames are driven and before the clip is read.
 *
 * It never calls `startAction` itself: the suites park actors BOTH ways, and a direct
 * `actionState =` assignment is used deliberately to bypass the clip and rng side effects
 * a real `startAction` would trigger.
 */
export function parked(npc: Parkable, state: OgState, note = ''): void {
  if (npc.actionState === state) return;
  const where = note === '' ? '' : ` (${note})`;
  throw new Error(
    `PREFLIGHT parked(): the actor left ${stateName(state)} for ${stateName(npc.actionState)}${where}. ` +
      `Its animation is now "${npc.getAnim()}", which is probably masking what the test is reading. ` +
      `Park it somewhere its own doAction will not leave — e.g. set y above world.groundY before entering FALL.`,
  );
}

/**
 * RUN `body` AND REPORT EVERY RNG VALUE IT CONSUMED.
 *
 * Returns the count AND the values, and the values are the half that matters. A count is
 * identical whether the seq was right or wrong — session 35's failing `seq(0.9)` and its
 * working `seq(0.5)` both make three rolls before the decision — so a count-only check is
 * green in both worlds. Knowing the values makes the fix writable as
 * `seq(0.9, 0.9, 0.5)`: one value per roll, instead of leaning on the clamp.
 *
 * ⚠️ IT REWRITES `npc.rng` FOR THE DURATION. The field is `protected readonly`, so this
 * needs a cast — the only one in this module, and it is restored in a `finally` so a
 * throwing body cannot leave a wrapped rng behind.
 */
export function rollsFor(npc: object, body: () => void): { calls: number; values: number[] } {
  const holder = npc as unknown as { rng: Rng };
  const inner = holder.rng;
  const values: number[] = [];
  holder.rng = () => {
    const v = inner();
    values.push(v);
    return v;
  };
  try {
    body();
  } finally {
    holder.rng = inner;
  }
  return { calls: values.length, values };
}

/**
 * ASSERT THE BODY READ THE NUMBER THE TEST WROTE.
 *
 * The third check, and the one the kickoff did not ask for — because the failure it catches
 * is not a state change and not an rng roll. The bear's `doAction` DECREMENTS `idleCounter`
 * at the top, before the `switch` that reads it, so a test that writes `idleCounter = 1` is
 * tested at 0. Nothing about the actor's state or its rolls is wrong; the setup simply did
 * not survive to the branch.
 *
 * `useDefineForClassFields: true` makes these plain own properties, so a temporary
 * accessor can record the first value the body actually READ. Throws naming both numbers.
 */
export function readsWhatYouWrote(npc: object, field: string, body: () => void): void {
  const bag = npc as unknown as Record<string, number>;
  const written = bag[field] ?? 0;
  let reads = 0;
  // THE LAST read, not the first. The bear's `doAction` reads the counter once for its
  // `> 0` guard, decrements it, and reads it AGAIN in the branch that decides the swing.
  // The first read always matches setup — it is the SECOND one that the assertion hangs
  // on, so a first-read check is green on the exact bug it was written for. (Measured:
  // the first draft of this helper checked `firstRead` and caught nothing.)
  let consulted = written;
  let live = written;
  Object.defineProperty(npc, field, {
    configurable: true,
    get() {
      reads += 1;
      consulted = live;
      return live;
    },
    set(v: number) {
      live = v;
    },
  });
  try {
    body();
  } finally {
    Reflect.deleteProperty(npc, field);
    bag[field] = live;
  }
  if (reads === 0) {
    throw new Error(
      `PREFLIGHT readsWhatYouWrote(): the body never read '${field}' at all, so writing it in setup proved nothing. ` +
        `Either the branch you meant to drive was not reached, or '${field}' is not the field it consults.`,
    );
  }
  if (consulted !== written) {
    throw new Error(
      `PREFLIGHT readsWhatYouWrote(): setup wrote ${field} = ${written}, but the body CONSULTED ${consulted}. ` +
        `It mutated the field before the branch read it — the bear ticks idleCounter at the TOP of doAction, ` +
        `before the switch that tests it, so a cooldown of 1 is already spent on the same frame. ` +
        `Write ${written + (written - consulted)} if you meant the branch to see ${written}.`,
    );
  }
}
