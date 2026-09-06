/**
 * ⭐ GATE A13-A (LANE L3B) — THE PAINT LEDGER, AND THE GATE THAT CAN SEE WHAT
 * THE OWNER SAW.
 *
 * ⛔ WHY THIS FILE EXISTS, AND IT IS THE SECOND ADMISSION OF ITS KIND. GATE A6-C
 * exists because SESSION 19 shipped four outfit defects past a 750-green suite,
 * "because nothing in the repo compared the rendered fighter to the source". It
 * then happened AGAIN: SESSION 29's dressed render scored silhouette 0.9185
 * against a 0.9005 floor, aspect within 0.009, white coverage within 0.8 pp and
 * dark ink within 0.6 pp — four independent aggregates, all green — and the
 * owner looked at it and said *"to be fair it ddint lok liek the video i sent"*
 * (§0 artifact A5, 2026-09-05).
 *
 * ⭐ THE REASON ALL FOUR AGREED IS MEASURED, NOT GUESSED: THE DEFECTS CANCEL.
 * The render carries no white above the hip — the juban and obi ARE painted, in
 * `sourceColour.ts`'s own measured whites, and then covered by the gi's
 * silhouette — and too much white below it, because one traced leg shape is
 * drawn twice, splayed. Summed over the whole figure those two annihilate:
 * 31.0 % white against the source's 31.8 %. Split into bands they do not.
 *
 *     whole-figure class shares   max |delta|    2.5 pp   <- what PASSED
 *     per-band class shares       max |delta|   28.2 pp   <- what this gate reads
 *
 * ⚠️ EVERY GATE HAS A BLIND SPOT AND THE LAST ONE'S WAS UNDECLARED. This one's
 * are written down in `scripts/art/sourceBands.ts`'s header, in full. The three
 * that matter here: a band integrates ACROSS the row, so left-right arrangement
 * is invisible; it grades an ink BUDGET, so a crest and a smear of equal area
 * are one number; and the source's own mask includes the grass the fighter
 * stands in, which is why the hem band's tolerance is the widest in the table.
 * **A green A13-A is necessary and not sufficient — the gate for this lane is
 * still the owner's LOOK.**
 */
import { describe, expect, it } from 'vitest';
import type { ShapeInput } from '../src/core/artPlan';
import { bandLedger, cellDeltas, gradeLedger, paintClassOf, GATE_A13A, PAINT_CLASSES } from '../scripts/art/bandLedger';
import { renderPoseWith } from '../scripts/art/poseScene';
import {
  HELDOUT_BANDS,
  PAINT_ANCHORS,
  PAINT_WITNESSES,
  SOURCE_BANDS,
  TRACING_BANDS,
  type BandShare,
} from '../scripts/art/sourceBands';
import { SHAPE_2641 } from '../src/game/art/generated/shape2641';
import { SHAPE_2644 } from '../src/game/art/generated/shape2644';
import { SHAPE_2646 } from '../src/game/art/generated/shape2646';
import { SHAPE_2648 } from '../src/game/art/generated/shape2648';
import { SHAPE_2650 } from '../src/game/art/generated/shape2650';
import { SHAPE_2653 } from '../src/game/art/generated/shape2653';
import { SHAPE_2655 } from '../src/game/art/generated/shape2655';
import { SHAPE_2658 } from '../src/game/art/generated/shape2658';
import { SHAPE_2664 } from '../src/game/art/generated/shape2664';
import { SHAPE_2667 } from '../src/game/art/generated/shape2667';
import { SHAPE_2670 } from '../src/game/art/generated/shape2670';
import { SHAPE_2672 } from '../src/game/art/generated/shape2672';
import { SHAPE_2674 } from '../src/game/art/generated/shape2674';
import { SHAPE_2676 } from '../src/game/art/generated/shape2676';
import { SHAPE_2678 } from '../src/game/art/generated/shape2678';
import { SHAPE_9001 } from '../src/game/art/generated/shape9001';
import { SHAPE_9011 } from '../src/game/art/generated/shape9011';
import { SHAPE_9012 } from '../src/game/art/generated/shape9012';
import { SHAPE_9014 } from '../src/game/art/generated/shape9014';
import { SHAPE_9015 } from '../src/game/art/generated/shape9015';
import { SHAPE_9017 } from '../src/game/art/generated/shape9017';
import { SHAPE_9019 } from '../src/game/art/generated/shape9019';

/** Rebuilt from the generated art — the pure-data carve-out `poseRender.test.ts` uses. */
const SHAPES: ReadonlyMap<number, ShapeInput> = new Map(
  [
    SHAPE_2641, SHAPE_2644, SHAPE_2646, SHAPE_2648, SHAPE_2650, SHAPE_2653, SHAPE_2655, SHAPE_2658,
    SHAPE_2664, SHAPE_2667, SHAPE_2670, SHAPE_2672, SHAPE_2674, SHAPE_2676, SHAPE_2678,
    SHAPE_9001, SHAPE_9011, SHAPE_9012, SHAPE_9014, SHAPE_9015, SHAPE_9017, SHAPE_9019,
  ].map((s) => [s.id, s]),
);

const ours = (): BandShare[] => bandLedger(renderPoseWith('dressed', SHAPES).raster);

/** One line per failing cell — a bare "expected 0 to be 8" would say nothing useful. */
const report = (verdicts: ReturnType<typeof gradeLedger>): string =>
  verdicts
    .filter((v) => !v.pass)
    .map((v) => `${v.band}/${v.paint}: ours ${v.ours.toFixed(1)}% vs ${v.target.toFixed(1)}% (delta ${v.delta.toFixed(1)}, tol ${v.tolerance.toFixed(1)} pp)`)
    .join('\n');

/**
 * ⛔ THE EIGHT CELLS STILL OPEN, NAMED — because a gate that says "8 failures"
 * and not WHICH is a gate you can satisfy by trading one defect for another.
 *
 * Every one is a garment this lane could not finish, and the reason is recorded
 * in `docs/DIVERGENCES.md` "LANE L3B": three of the seven traced garments cannot
 * be regenerated by the committed scripts, and 9015 — the gi, which occludes the
 * white juban and obi that four of these cells are about — is the worst of them
 * (re-running the tool moves its outer ring and puts back the SESSION 22 balloon,
 * GATE A9-E 0.44 -> 3.50 local px).
 *
 * ⚠️ THIS LIST MAY ONLY SHRINK. Fixing a cell means DELETING its line here, in
 * the same commit. Adding one is a regression the gate will not accept.
 */
const OPEN_CELLS: readonly string[] = [
  'gi body/grey', //        64.0% vs 52.4% — one flat grey where the source has three tones
  'gi body/ink', //         24.9% vs 30.7% — the two black crest marks are not drawn
  'head/collar/white', //    1.0% vs  9.3% — the juban collar is behind the gi's silhouette
  'hem/feet/ink', //        21.1% vs  3.3% — both traced panels close with a hard stroked hem
  'kasa/skin', //            0.1% vs  9.9% — the kasa's bright straw band is not painted
  'obi/waist/ink', //       43.3% vs 32.0% — five outlines cross the waist where the source has two
  'obi/waist/skin', //      14.7% vs  8.0% — the hand reads larger against a narrower figure
  'obi/waist/white', //      3.2% vs 20.9% — the white obi is painted and then covered by the gi
];

/**
 * ⭐ THE RATCHET. Worst (delta - tolerance) over all 30 cells, in percentage
 * points. **May only ever move DOWN**, and only in a commit that says why —
 * `a6Score.test.ts`'s floors, in the other direction.
 *
 * 23.169 at `e2218a8`, the render the owner rejected.
 * 12.778 here: the feet no longer draw below the hakama (`ogPose.ts`).
 */
const RATCHET_WORST_PP = 12.78;

describe('GATE A13-A — the dressed fighter matches the source frame band by band', () => {
  /**
   * ⚠️ NOT "every cell passes" — that assertion would be RED today and a red
   * gate cannot be committed, which is how a gate ends up softened instead.
   * This says the exact set of failures is the DECLARED one, so a new defect
   * anywhere in the 30 cells turns it red even while eight stay open.
   */
  it('fails only on the cells this lane declared open, and never on a new one', () => {
    const failing = gradeLedger(ours(), TRACING_BANDS, HELDOUT_BANDS)
      .filter((v) => !v.pass)
      .map((v) => `${v.band}/${v.paint}`);
    expect(failing.filter((c) => !OPEN_CELLS.includes(c))).toEqual([]);
  });

  it('holds the RATCHET — the worst cell may only ever get closer', () => {
    const worst = Math.max(...gradeLedger(ours(), TRACING_BANDS, HELDOUT_BANDS).map((v) => v.delta - v.tolerance));
    expect(worst, `worst overshoot ${worst.toFixed(3)} pp`).toBeLessThanOrEqual(RATCHET_WORST_PP);
  });

  it('reports WHICH cells are open, so the lane cannot quietly forget them', () => {
    const failing = gradeLedger(ours(), TRACING_BANDS, HELDOUT_BANDS)
      .filter((v) => !v.pass)
      .map((v) => `${v.band}/${v.paint}`)
      .sort();
    expect(failing, report(gradeLedger(ours(), TRACING_BANDS, HELDOUT_BANDS))).toEqual([...OPEN_CELLS].sort());
  });

  /**
   * ⭐ THE RED-PROOF, AS AN EXECUTABLE ARTIFACT RATHER THAN A PASTED LOG.
   *
   * `GAUNTLET.md` §3.6 wants a gate proven RED before it is trusted. A console
   * paste proves it once, for a render that is then deliberately deleted by the
   * very change the gate demanded. So the pre-change render's ledger is RECORDED
   * here and the SAME rule is pointed back at it: the day someone weakens
   * `GATE_A13A`'s constants to make a diff go green, this test goes red, because
   * the rule would start ACCEPTING the render the owner rejected.
   *
   * Recorded 2026-09-06 at `e2218a8` with:
   *   npx vite-node scripts/art/bandCompare.ts -- --ledger
   */
  const PRE_L3B_LEDGER: readonly BandShare[] = [
    { band: 'kasa', pixels: 858, share: { ink: 38.578, white: 0.000, grey: 0.000, skin: 0.233, straw: 61.189 } },
    { band: 'head/collar', pixels: 419, share: { ink: 42.721, white: 0.955, grey: 35.322, skin: 11.933, straw: 9.069 } },
    { band: 'gi body', pixels: 1206, share: { ink: 25.290, white: 0.000, grey: 63.516, skin: 5.390, straw: 5.804 } },
    { band: 'obi/waist', pixels: 517, share: { ink: 44.874, white: 3.868, grey: 31.528, skin: 15.474, straw: 4.255 } },
    { band: 'hakama', pixels: 1868, share: { ink: 18.576, white: 72.323, grey: 2.837, skin: 2.944, straw: 3.319 } },
    { band: 'hem/feet', pixels: 845, share: { ink: 31.479, white: 53.254, grey: 3.195, skin: 10.059, straw: 2.012 } },
  ];

  it('RED-PROOF: the same rule REJECTS the render the owner rejected', () => {
    const failed = gradeLedger(PRE_L3B_LEDGER, TRACING_BANDS, HELDOUT_BANDS).filter((v) => !v.pass);
    expect(failed.map((v) => `${v.band}/${v.paint}`).sort()).toEqual([
      'gi body/grey',
      'gi body/ink',
      'head/collar/white',
      'hem/feet/ink',
      'kasa/skin',
      'obi/waist/ink',
      'obi/waist/skin',
      'obi/waist/white',
    ]);
  });

  /**
   * ⭐ THE PROOF THE RATCHET IS NOT A RUBBER STAMP. The pre-change render fails
   * TODAY's bar, by 10.4 pp — so the number committed above is one the rejected
   * render could not have met, and softening it to 23.2 would light this up.
   */
  it('RED-PROOF: the render the owner rejected also fails today\'s RATCHET', () => {
    const worst = Math.max(
      ...gradeLedger(PRE_L3B_LEDGER, TRACING_BANDS, HELDOUT_BANDS).map((v) => v.delta - v.tolerance),
    );
    expect(worst, `the rejected render's worst overshoot is ${worst.toFixed(3)} pp`).toBeGreaterThan(RATCHET_WORST_PP);
  });

  /**
   * The five named defects, mapped to the cells that carry them. This is the
   * claim "the gate can see what the eye saw", written so it can fail: if a
   * future edit makes one of these cells stop distinguishing the bad render,
   * the mapping breaks here rather than in somebody's confidence.
   */
  it('RED-PROOF: each named defect shows up in a cell, with the sign the eye reports', () => {
    const cells = new Map(
      gradeLedger(PRE_L3B_LEDGER, TRACING_BANDS, HELDOUT_BANDS).map((v) => [`${v.band}/${v.paint}`, v]),
    );
    const signed = (key: string): number => {
      const v = cells.get(key);
      if (v === undefined) throw new Error(`no such cell: ${key}`);
      return v.ours - v.target;
    };
    // 1. hakama: two splayed legs and two sandals where the OG has one column.
    expect(signed('hem/feet/ink')).toBeGreaterThan(20);
    // 2. the juban and obi are painted, then covered by the gi's silhouette.
    expect(signed('obi/waist/white')).toBeLessThan(-10);
    expect(signed('head/collar/white')).toBeLessThan(-5);
    // 3. the gi is flat mid-grey with no crests and no lighter front panel.
    expect(signed('gi body/grey')).toBeGreaterThan(10);
    expect(signed('gi body/ink')).toBeLessThan(-5);
    // 4. the kasa carries none of the source's bright straw.
    expect(signed('kasa/skin')).toBeLessThan(-5);
  });
});

describe('the paint classifier is the same rule on both sides of the language line', () => {
  /**
   * ⚠️ THE WITNESSES ARE THE NEAR-TIES, ON PURPOSE. `bandRuler.py` picks, per
   * class, the in-figure pixel with the SMALLEST gap between its winning anchor
   * and the runner-up. A witness set of obvious pixels would pass with a typo in
   * the anchor table; these fail on one.
   */
  it('sorts every witness pixel the way the Python ruler that emitted it did', () => {
    expect(PAINT_WITNESSES.length).toBeGreaterThan(0);
    for (const w of PAINT_WITNESSES) {
      expect(`${w.rgb.join(',')} -> ${paintClassOf(w.rgb[0], w.rgb[1], w.rgb[2])}`).toBe(`${w.rgb.join(',')} -> ${w.paint}`);
    }
  });

  it('puts every anchor colour in its own class', () => {
    for (const a of PAINT_ANCHORS) {
      expect(paintClassOf(a.rgb[0], a.rgb[1], a.rgb[2])).toBe(a.paint);
    }
  });

  it('names exactly the five classes the ledger reports', () => {
    expect([...new Set(PAINT_ANCHORS.map((a) => a.paint))].sort()).toEqual([...PAINT_CLASSES].sort());
  });
});

describe('the ledger guards fail closed', () => {
  it('bands tile the figure top to bottom with no gap and no overlap', () => {
    expect(SOURCE_BANDS[0]?.lo).toBe(0);
    expect(SOURCE_BANDS[SOURCE_BANDS.length - 1]?.hi).toBe(1);
    for (let i = 1; i < SOURCE_BANDS.length; i += 1) {
      expect(SOURCE_BANDS[i]?.lo).toBe(SOURCE_BANDS[i - 1]?.hi);
    }
  });

  it('every band of our render holds pixels — an empty one is a lost garment, not a small error', () => {
    for (const row of ours()) expect(row.pixels).toBeGreaterThan(0);
  });

  it('refuses to compare two ledgers that disagree about which band is which', () => {
    const shuffled = [...TRACING_BANDS].reverse();
    expect(() => cellDeltas(TRACING_BANDS, shuffled)).toThrow(/not aligned|on one side/);
  });

  it('refuses to compare ledgers of different lengths rather than zipping to the shorter', () => {
    expect(() => cellDeltas(TRACING_BANDS, TRACING_BANDS.slice(1))).toThrow(/banded alike/);
  });

  it('grades against the noise floor, never below it', () => {
    for (const v of gradeLedger(TRACING_BANDS, TRACING_BANDS, HELDOUT_BANDS)) {
      expect(v.tolerance).toBeGreaterThanOrEqual(GATE_A13A.noiseFloorPp);
      expect(v.tolerance).toBeGreaterThanOrEqual(GATE_A13A.spreadMultiple * v.spread);
    }
  });
});
