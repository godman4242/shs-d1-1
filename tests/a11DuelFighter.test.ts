/**
 * GATE A11-A — THE GAME DRAWS THE COMPOSED OG FIGHTER (SESSION23 A11.1).
 *
 * Three sessions of fighter work (A4 pose → A5/A9 garments → A9.6 branch) were
 * only ever drawn on the `?art=` study routes; the actual duel still rendered
 * the hand-drawn `drawSamurai` doll. This file is the gate that the swap
 * happened and cannot quietly regress:
 *
 *   1. SOURCE GATE — `src/game/DuelScene.ts` may not reference `drawSamurai`
 *      at all (the kickoff's own measure: `grep -c drawSamurai … → 0`), and
 *      must route through the composed pipeline (`composePose` → `planPose` →
 *      `drawPlan`) with the DRESSED fighter (kickoff D2: the videos never show
 *      a bare one). Tests cannot import a Phaser scene
 *      (`tests/no-game-imports.test.ts`), so this reads the file as text —
 *      exactly what the gate's grep does.
 *
 *   2. COMPOSE GATE — the same parts + plan the scene builds, built here from
 *      config + core + the generated art (the pure-data carve-out
 *      `tests/planPose.test.ts` and `tests/poseRender.test.ts` already use),
 *      at the duel's own ground line. Pins that the swap did not move the
 *      fighter off the line `drawSamurai` stood on (`ps.y + 60`, now
 *      `OG_DUEL_STAGE.groundOffsetY`) and did not regress the measured height
 *      ceiling (A6: ≤ 140.5 stage px).
 *
 * Numbers below are MEASURED (probe run 2026-07-28, this commit's art):
 * height 140.484, feet 1.35 px below the ground line (foot outline width),
 * ink center 3.07 px left of the anchor. Tolerances bracket those readings;
 * the byte-exact duty for the art itself stays with `tests/a6Score.test.ts`.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { OG_DUEL_STAGE } from '../src/config/art';
import { DUEL_SPAWNS } from '../src/config/duel';
import { OG_DRESSED_NODES, OG_DRESSED_SLOT_SHAPES, OG_SLOT_ALIASES } from '../src/config/ogPose';
import type { ShapeInput } from '../src/core/artPlan';
import { inkedBounds } from '../src/core/artPlan';
import { composePose } from '../src/core/composePose';
import { planPose } from '../src/core/planPose';
import { VIEW, worldToStage } from '../src/core/viewport';
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

/** Rebuilt from the generated art — the same pure-data path as poseRender.test.ts. */
const SHAPES: ReadonlyMap<number, ShapeInput> = new Map(
  [
    SHAPE_2641, SHAPE_2644, SHAPE_2646, SHAPE_2648, SHAPE_2650, SHAPE_2653, SHAPE_2655, SHAPE_2658,
    SHAPE_2664, SHAPE_2667, SHAPE_2670, SHAPE_2672, SHAPE_2674, SHAPE_2676, SHAPE_2678,
    SHAPE_9001, SHAPE_9011, SHAPE_9012, SHAPE_9014, SHAPE_9015, SHAPE_9017, SHAPE_9019,
  ].map((s) => [s.id, s]),
);

const duelSceneSource = readFileSync(
  fileURLToPath(new URL('../src/game/DuelScene.ts', import.meta.url)),
  'utf8',
);

describe('A11-A source gate — DuelScene renders through the composed pipeline', () => {
  it('never references drawSamurai (the kickoff measure: grep -c → 0)', () => {
    expect(duelSceneSource.includes('drawSamurai')).toBe(false);
    expect(duelSceneSource.includes("from './samurai'")).toBe(false);
  });

  it('routes through composePose → planPose → drawPlan with the DRESSED fighter', () => {
    expect(duelSceneSource.includes('composePose(')).toBe(true);
    expect(duelSceneSource.includes('planPose(')).toBe(true);
    expect(duelSceneSource.includes('drawPlan(')).toBe(true);
    // D2: the duel fighter is the dressed one — nodes AND slot map.
    expect(duelSceneSource.includes('OG_DRESSED_NODES')).toBe(true);
    expect(duelSceneSource.includes('OG_DRESSED_SLOT_SHAPES')).toBe(true);
    expect(duelSceneSource.includes('OG_SLOT_ALIASES')).toBe(true);
    expect(duelSceneSource.includes('OG_DUEL_STAGE')).toBe(true);
  });

  it('draws BOTH combatants and keeps the spawn-invuln blink alive', () => {
    // Two fighters ⇒ at least two drawPlan calls in the file.
    const drawPlanCalls = duelSceneSource.split('drawPlan(').length - 1;
    expect(drawPlanCalls).toBeGreaterThanOrEqual(2);
    // The invuln blink (research CONTRACT: blinking spawn indicator) must
    // survive the art swap — the alpha it computes has to reach a draw call.
    expect(duelSceneSource.includes('playerAlpha')).toBe(true);
  });
});

describe('A11-A compose gate — the duel fighter stands where drawSamurai stood', () => {
  const parts = composePose(OG_DRESSED_NODES, OG_DRESSED_SLOT_SHAPES, OG_SLOT_ALIASES);
  const ps = worldToStage(DUEL_SPAWNS.player.pos);
  const es = worldToStage(DUEL_SPAWNS.enemy.pos);
  const origin = { x: ps.x, y: ps.y + OG_DUEL_STAGE.groundOffsetY };
  const plan = planPose(parts, SHAPES, origin, VIEW);
  const bounds = inkedBounds(plan);

  it('the ground offset IS the line the old doll stood on (ps.y + 60)', () => {
    expect(OG_DUEL_STAGE.groundOffsetY).toBe(60);
  });

  it('both spawns share one ground line, so one offset serves both fighters', () => {
    expect(es.y).toBe(ps.y);
  });

  it('composes the full dressed figure — 19 parts, plan non-trivial', () => {
    // 21 → 19 at LANE L3B: the two bare-foot slots draw nothing when dressed.
    expect(parts.length).toBe(19);
    expect(plan.length).toBeGreaterThan(0);
  });

  /**
   * ⚠️ RENAMED AND ITS FLOOR WIDENED BY 1 px AT LANE L3B, DELIBERATELY. The part
   * that used to define the ground line was the SANDAL; a dressed fighter no
   * longer draws one, so the HAKAMA'S HEM is the ground line now — as it is in
   * `zFt_0061.png`, where the white column runs into the grass and no foot shows.
   * The hem measures 0.87 stage px ABOVE the anchor, inside the ±1 px the repo
   * already concedes as this method's own noise floor (`inkBox.test.ts` header).
   * ⛔ THE ALTERNATIVE WAS REJECTED: dropping the hakama ~0.7 world px to close
   * the gap would push the figure back to 139.1 stage px and give up the 138.3
   * height ceiling this same commit ratcheted down. A tighter ceiling is worth
   * more than a sub-noise-floor gap.
   * Veto = restore the 0 floor, and either re-grow the figure or draw the feet.
   */
  it('the hem lands ON the ground line — ink ends within 1 px above / 3 px below the anchor', () => {
    const feetDelta = bounds.maxY - origin.y;
    expect(feetDelta).toBeGreaterThanOrEqual(-1);
    expect(feetDelta).toBeLessThanOrEqual(3);
  });

  it('height stays under the measured A6 ceiling (≤ 138.3 stage px)', () => {
    // ⬇️ 140.5 → 138.3 at LANE L3B, in lockstep with `a6Score.test.ts`. A
    // ceiling in two files is a ceiling that can drift; both move together or
    // neither moves.
    expect(bounds.maxY - bounds.minY).toBeLessThanOrEqual(138.3);
  });

  it('the figure is centred on its anchor, not flung sideways (|Δx| ≤ 8)', () => {
    const centerXDelta = (bounds.minX + bounds.maxX) / 2 - origin.x;
    expect(Math.abs(centerXDelta)).toBeLessThanOrEqual(8);
  });
});
