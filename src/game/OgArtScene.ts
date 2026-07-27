/**
 * `?art=og` — THE FIRST OBSERVED FRAME OF IMPORTED OG ART (SESSION17 A3.2).
 *
 * Draws ONE imported shape, the samurai's head (`SHAPE_2664`), at a fixed
 * labelled stage position beside the procedural fighter. It replaces nothing
 * (SESSION17 D3) and is parented to nothing (D4): A3 exists to answer a single
 * question — is it the right size? — so scale is the only variable left free.
 *
 * ⚠️ THE DRAW LOOP IS THE POINT. Each op sets its OWN style immediately before
 * drawing, so `paints` order survives to the canvas. SESSION16's superseded
 * recipe said "fillStyle + fillPoints per ring, THEN lineStyle + strokePoints" —
 * all fills then all strokes — which is the defect that turned 26.2 % of shape
 * 2662's ink black. Do not batch these by kind.
 *
 * ⚠️ THE CANVAS IS TRANSPARENT ON THIS ROUTE (`src/main.ts`), and that is not
 * cosmetic: SESSION17 §P2 defines the size measurement as the box of pixels at
 * ≥ 50 % ALPHA "on a transparent-background render of the shape alone". On an
 * opaque background every pixel is alpha 255 and the rule cannot be applied.
 * The default route is untouched, so the 55/55 fidelity gate is unaffected.
 *
 * Numbers live in `src/config/art.ts` (D6) — this file holds none, so its
 * `tests/game-purity-ratchet.test.ts` baseline entry is an empty multiset.
 */
import Phaser from 'phaser';
import { INK_ALPHA_THRESHOLD, OG_ART_STAGE, RGBA_STRIDE } from '../config/art';
import { HALF, ONE, ZERO } from '../config/nums';
import { IDLE_POSE } from '../config/poses';
import { inkedBounds, planShape, trianglesOf, type DrawOp } from '../core/artPlan';
import { inkBox, type InkBox } from '../core/inkBox';
import { VIEW } from '../core/viewport';
import { SHAPE_2664 } from './art/generated/shape2664';
import { settleFrames } from './fidelity';
import { drawSamurai, PLAYER_LOOK } from './samurai';

/** What `__artProbe.measure()` hands back — gate A3-A, in numbers. */
export interface ArtProbeResult {
  /** The snapshot region, in stage px. */
  readonly region: { x: number; y: number; width: number; height: number };
  /** What the PLAN says the ink should span (the A3-A target). */
  readonly expected: { width: number; height: number };
  /** What the CANVAS actually shows, both estimates (see `inkBox`). */
  readonly measured: InkBox;
  /** measured − expected, for both estimates. The gate is ±1 px on either. */
  readonly deltaSpan: { width: number; height: number };
  readonly deltaCovered: { width: number; height: number };
  /** devicePixelRatio at read time — §P2 requires the report to be at 1. */
  readonly devicePixelRatio: number;
}

export class OgArtScene extends Phaser.Scene {
  constructor() {
    super('OgArt');
  }

  create(): void {
    const g = this.add.graphics().setDepth(OG_ART_STAGE.artDepth);

    // D3 — the procedural fighter stays, for a same-frame comparison.
    drawSamurai(
      g,
      OG_ART_STAGE.samuraiX,
      OG_ART_STAGE.samuraiGroundY,
      OG_ART_STAGE.samuraiFacing,
      PLAYER_LOOK,
      IDLE_POSE,
    );

    const plan = planShape(SHAPE_2664, { x: OG_ART_STAGE.headAnchorX, y: OG_ART_STAGE.headAnchorY }, VIEW);
    drawPlan(g, plan);

    this.add
      .text(
        OG_ART_STAGE.labelX,
        OG_ART_STAGE.labelY,
        'SHAPE_2664 (imported OG head) — right, at its measured size. Procedural samurai, left.',
        { fontFamily: 'monospace', fontSize: `${String(OG_ART_STAGE.labelSizePx)}px`, color: '#ffffff' },
      )
      .setOrigin(HALF)
      .setDepth(OG_ART_STAGE.labelDepth);

    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>).__artProbe = {
        measure: async (): Promise<ArtProbeResult> => this.measure(plan),
      };
    }
  }

  /**
   * GATE A3-A, measured rather than eyeballed.
   *
   * Snapshots a padded region around the planned ink and applies §P2's rule via
   * `src/core/inkBox.ts`. The region comes from `inkedBounds`, the same function
   * the suite pins at 17.141 × 20.160 — so the browser is compared against a
   * number the test suite owns, not one re-typed from a kickoff.
   */
  private async measure(plan: readonly DrawOp[]): Promise<ArtProbeResult> {
    const ink = inkedBounds(plan);
    const pad = OG_ART_STAGE.snapshotPad;
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
      region: { x, y, width, height },
      expected,
      measured,
      deltaSpan: { width: measured.spanX - expected.width, height: measured.spanY - expected.height },
      deltaCovered: { width: measured.coveredX - expected.width, height: measured.coveredY - expected.height },
      devicePixelRatio: window.devicePixelRatio,
    };
  }
}

/**
 * Execute a plan on one Graphics, in plan order.
 *
 * Exported so a future scene reuses this loop rather than re-deriving it — the
 * order is the load-bearing part.
 */
export function drawPlan(g: Phaser.GameObjects.Graphics, plan: readonly DrawOp[]): void {
  for (const op of plan) {
    // A polygon with holes cannot be drawn by `fillPoints` at all. The planner
    // has already packed it into Earcut's own argument shape and `trianglesOf`
    // reads the result back (SESSION18 D1), so the only thing this scene adds is
    // the call itself — which is exactly the part no vitest can reach.
    if (op.kind === 'holedFill') {
      const indices = Phaser.Geom.Polygon.Earcut([...op.flatXY], [...op.holeIndices]);
      g.fillStyle(op.color);
      for (const t of trianglesOf(op.flatXY, indices)) g.fillTriangle(...t);
      continue;
    }
    const points = op.points.map((p) => new Phaser.Geom.Point(p.x, p.y));
    if (op.kind === 'fill') {
      g.fillStyle(op.color);
      g.fillPoints(points, true);
      continue;
    }
    g.lineStyle(op.widthStage, op.color);
    // closeShape stays false: a closed OG outline already repeats its first
    // point, so closing again would lay a second segment over the seam.
    g.strokePoints(points);
  }
}

/** Snapshot a canvas region and hand back its RGBA bytes, alpha intact. */
function captureArea(
  game: Phaser.Game,
  x: number,
  y: number,
  width: number,
  height: number,
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    game.renderer.snapshotArea(x, y, width, height, (snap) => {
      if (!(snap instanceof HTMLImageElement)) {
        reject(new Error('artProbe: snapshot returned no image'));
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = snap.width;
      canvas.height = snap.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx === null) {
        reject(new Error('artProbe: 2d context unavailable'));
        return;
      }
      ctx.drawImage(snap, ZERO, ZERO);
      const data = ctx.getImageData(ZERO, ZERO, canvas.width, canvas.height);
      if (data.data.length !== canvas.width * canvas.height * RGBA_STRIDE) {
        reject(new Error('artProbe: snapshot pixel buffer is not RGBA'));
        return;
      }
      resolve(data);
    });
  });
}
