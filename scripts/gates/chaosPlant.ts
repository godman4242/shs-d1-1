/**
 * THE CHAOS PLANT RECORD — the declarative half of `npm run chaos`.
 *
 * A plant is a deliberate, surgical break in shipped source whose whole purpose is
 * to make a test go RED. If the test stays green, the test does not really cover the
 * guard it claims to cover. Session 35 ran 40 of these by hand over L4b slice 3 and
 * **2 stayed green — and both were real missing tests.** Nothing else in this
 * toolchain finds that class of defect, which is why the harness is now committed
 * instead of being rewritten in the scratchpad once per slice.
 *
 * ⛔ THERE IS NO `expect` FIELD, AND THAT IS DELIBERATE.
 * The obvious extension is `expect: 'red' | 'green'`, so that a code path known to be
 * unobservable (the alpha's defence ordering — when HP ≤ 0 neither version applies
 * anything, when HP > 0 both compute the same) could be asserted as *deliberately*
 * green instead of merely described in prose. It is left out **because it would
 * work**: an `expect: 'green'` mode is a ready-made escape hatch for any plant you
 * could not make red, which is precisely the gate-softening the ship bar forbids. A
 * plant that cannot go red is a conversation with the owner, not a config value.
 * Unobservable paths stay documented in `docs/DIVERGENCES.md`, where a human has to
 * defend them.
 *
 * @see scripts/gates/chaos.ts — the runner
 * @see tests/npcSlice3a.plants.ts, tests/npcSlice3b.plants.ts — the plants
 */
export interface ChaosPlant {
  /**
   * Human name, read aloud in the report. Convention: `<actor>: <what is disarmed>`,
   * e.g. `bear: drop the `> 0` floor on the counter tick`.
   */
  readonly name: string;
  /** Repo-relative path of the file to mutate. */
  readonly file: string;
  /**
   * EXACT current text of `file`, byte for byte, including leading indentation and
   * embedded newlines. It MUST occur exactly once. Zero occurrences (the source moved
   * under the plant) and two occurrences (the plant is ambiguous) are both LOUD
   * failures — never skips. One of the 37 plants recovered from session 35 had already
   * drifted to zero occurrences by the time it was committed here; that is the whole
   * reason the count is checked rather than assumed.
   */
  readonly find: string;
  /**
   * What `find` becomes. Must differ from `find` — a plant that does not mutate proves
   * nothing, and this repo has already been fooled once by exactly that (a BSD `sed`
   * invocation that silently no-op'd and reported a false pass; see
   * `docs/sessions/-SESSION-LOG.md` 2026-08-xx "A plant that does not mutate is a
   * plant that proves nothing").
   *
   * It must also still TYPECHECK: the runner requires vitest to report at least one
   * FAILED TEST, so a plant that breaks the compile is reported as INCONCLUSIVE rather
   * than being allowed to pass as red.
   */
  readonly replace: string;
  /** Repo-relative test files to run while the plant is in place. */
  readonly tests: readonly string[];
  /**
   * Provenance, printed in the report. `recovered:<source>` for a plant transcribed
   * from a previous session's run, `reauthored:<why>` for one written here. The
   * distinction is not cosmetic: it is how a reader knows which plants carry a
   * measurement's authority and which carry only this session's reasoning.
   */
  readonly note: string;
}
