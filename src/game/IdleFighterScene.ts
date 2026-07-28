/**
 * `?art=idle` — THE WHOLE OG FIGHTER, AT ITS RECORDED TRANSFORMS (SESSION18 A4.4).
 * `?art=dressed` — THE SAME FIGHTER WEARING TRACED GARMENT ART (SESSION19 A5.2).
 *
 * 14 imported shapes, placed at the 19 node transforms the payload's own
 * animation data records, plus the two code-level aliases — 21 drawn parts,
 * back to front. Render-only: `composePose` and `planPose` in `src/core/` do
 * every piece of arithmetic, and this scene calls Earcut and draws.
 *
 * ⚠️ THE CANVAS IS TRANSPARENT ON THIS ROUTE (`src/main.ts`), for the same
 * reason as `?art=og`: SESSION17 §P2 measures ink as the box of pixels at ≥ 50 %
 * ALPHA, which is meaningless over an opaque background. The default route keeps
 * its background, so the 55/55 fidelity gate is untouched.
 *
 * ⚠️ `?art=idle&debug=1` paints each part in its own colour — §6 Risk 2's
 * prescribed one-off check. With 21 overlapping parts a single mis-slotted limb
 * is invisible in a silhouette AND in a proportion measurement, both of which
 * only read the outer box. Off by default.
 *
 * Numbers live in `src/config/art.ts` — this file holds none, so its
 * `tests/game-purity-ratchet.test.ts` baseline entry is an empty multiset.
 */
import Phaser from 'phaser';
import {
  EARCUT_DIMENSIONS,
  INK_ALPHA_THRESHOLD,
  OG_DEBUG_PART_COLORS,
  OG_IDLE_STAGE,
} from '../config/art';
import { HALF, ONE, ZERO } from '../config/nums';
import { OG_DRESSED_NODES, OG_DRESSED_SLOT_SHAPES, OG_IDLE_NODES, OG_SLOT_ALIASES, OG_SLOT_SHAPES } from '../config/ogPose';
import { inkedBounds, trianglesOf, type DrawOp } from '../core/artPlan';
import { composePose } from '../core/composePose';
import { inkBox, type InkBox } from '../core/inkBox';
import { planPose } from '../core/planPose';
import { VIEW } from '../core/viewport';
import { FIGHTER_SHAPES } from './art/fighterShapes';
import { settleFrames } from './fidelity';
import { captureArea, drawPlan } from './OgArtScene';

/**
 * `Earcut.deviation` EXISTS in the pinned build but is NOT in Phaser's `.d.ts`.
 * SESSION17 gate A3-F confirmed it in a live console on 3.90.0
 * (`typeof … === 'function'`), and it is the only numeric, 0-means-correct check
 * available for hole rendering — worth reaching for, not worth a blind cast.
 *
 * So: fetched through `unknown`, verified at runtime, and throws if a future
 * Phaser drops it. A missing `deviation` must fail A4-A loudly rather than
 * quietly reporting no holes to check.
 */
type DeviationFn = (data: number[], holeIndices: number[], dimensions: number, triangles: number[]) => number;

function earcutDeviation(): DeviationFn {
  const fn: unknown = (Phaser.Geom.Polygon.Earcut as unknown as { deviation?: unknown }).deviation;
  if (typeof fn !== 'function') {
    throw new Error('poseProbe: Phaser.Geom.Polygon.Earcut.deviation is missing — GATE A4-A cannot be measured');
  }
  return fn as DeviationFn;
}

/** One packed polygon's triangulation verdict — GATE A4-A. */
export interface HoleCheck {
  readonly vertices: number;
  readonly holes: number;
  readonly triangles: number;
  /** `Earcut.deviation` — EXACTLY 0 when the triangulation is correct. */
  readonly deviation: number;
}

/** What `__poseProbe.measure()` hands back. */
export interface PoseProbeResult {
  readonly parts: number;
  readonly ops: number;
  readonly holeChecks: readonly HoleCheck[];
  readonly region: { x: number; y: number; width: number; height: number };
  readonly expected: { width: number; height: number };
  readonly measured: InkBox;
  readonly deltaSpan: { width: number; height: number };
  readonly deltaCovered: { width: number; height: number };
  readonly devicePixelRatio: number;
}

export class IdleFighterScene extends Phaser.Scene {
  constructor() {
    super('IdleFighter');
  }

  create(): void {
    /**
     * SESSION19 A5.2 — `?art=dressed` swaps the SLOT MAP and nothing else.
     *
     * Kickoff D3: the dressed fighter is a second array, not new code, and
     * `?art=idle` must keep drawing the BARE doll — every height measurement
     * SESSION 18 passed was taken against it, so the two routes have to remain
     * separately runnable for that evidence to stay checkable.
     */
    const query = new URLSearchParams(window.location.search);
    const dressed = query.get('art') === 'dressed';
    const slotShapes = dressed ? OG_DRESSED_SLOT_SHAPES : OG_SLOT_SHAPES;
    // SESSION22 A9.6: the dressed fighter applies equipment facings; the bare
    // fighter keeps the recorded, byte-checked pose (same rule as poseScene).
    const nodes = dressed ? OG_DRESSED_NODES : OG_IDLE_NODES;
    const parts = composePose(nodes, slotShapes, OG_SLOT_ALIASES);
    const origin = { x: OG_IDLE_STAGE.anchorX, y: OG_IDLE_STAGE.anchorY };
    const plan = planPose(parts, FIGHTER_SHAPES, origin, VIEW);

    const g = this.add.graphics().setDepth(OG_IDLE_STAGE.artDepth);
    if (query.get('debug') === '1') {
      // One part at a time, each recoloured — §6 Risk 2. Kept out of the normal
      // path entirely so it cannot tint a measured render by accident.
      parts.forEach((part, i) => {
        const only = planPose([part], FIGHTER_SHAPES, origin, VIEW);
        const color = OG_DEBUG_PART_COLORS[i % OG_DEBUG_PART_COLORS.length] ?? ZERO;
        drawPlan(g, only.map((op) => ({ ...op, color })));
      });
    } else {
      drawPlan(g, plan);
    }

    this.add
      .text(
        OG_IDLE_STAGE.labelX,
        OG_IDLE_STAGE.labelY,
        `OG idle pose${dressed ? ' + traced kasa' : ''} — ${String(parts.length)} parts at their recorded transforms.`,
        { fontFamily: 'monospace', fontSize: `${String(OG_IDLE_STAGE.labelSizePx)}px`, color: '#ffffff' },
      )
      .setOrigin(HALF)
      .setDepth(OG_IDLE_STAGE.labelDepth);

    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>).__poseProbe = {
        measure: async (): Promise<PoseProbeResult> => this.measure(parts.length, plan),
      };
    }
  }

  /**
   * GATE A4-A + the silhouette read, measured rather than eyeballed.
   *
   * `Earcut.deviation` returns 0 when a triangulation is fully correct, so the
   * hole rendering is a NUMBER rather than a look — which matters because a
   * mis-packed hole produces a plausible mesh, not an error (SESSION18 A4.1).
   */
  private async measure(partCount: number, plan: readonly DrawOp[]): Promise<PoseProbeResult> {
    const holeChecks: HoleCheck[] = [];
    for (const op of plan) {
      if (op.kind !== 'holedFill') continue;
      const flat = [...op.flatXY];
      const holes = [...op.holeIndices];
      const indices = Phaser.Geom.Polygon.Earcut(flat, holes, EARCUT_DIMENSIONS);
      holeChecks.push({
        vertices: flat.length / EARCUT_DIMENSIONS,
        holes: holes.length,
        triangles: trianglesOf(flat, indices).length,
        deviation: earcutDeviation()(flat, holes, EARCUT_DIMENSIONS, indices),
      });
    }

    const ink = inkedBounds(plan);
    const pad = OG_IDLE_STAGE.snapshotPad;
    const x = Math.floor(ink.minX - pad);
    const y = Math.floor(ink.minY - pad);
    const width = Math.ceil(ink.maxX + pad) - x;
    const height = Math.ceil(ink.maxY + pad) - y;

    const captured = captureArea(this.game, x, y, width, height);
    await settleFrames(this.game, ONE);
    const pixels = await captured;

    const measured = inkBox(pixels.data, pixels.width, pixels.height, INK_ALPHA_THRESHOLD);
    const expected = { width: ink.maxX - ink.minX, height: ink.maxY - ink.minY };

    return {
      parts: partCount,
      ops: plan.length,
      holeChecks,
      region: { x, y, width, height },
      expected,
      measured,
      deltaSpan: { width: measured.spanX - expected.width, height: measured.spanY - expected.height },
      deltaCovered: { width: measured.coveredX - expected.width, height: measured.coveredY - expected.height },
      devicePixelRatio: window.devicePixelRatio,
    };
  }
}
