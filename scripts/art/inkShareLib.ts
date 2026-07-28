/**
 * THE INK RULER'S MEASURING CORE (SESSION21 A8.3, extracted SESSION22 A9.1) —
 * how much of one shape is BLACK OUTLINE, as a share of its own inked pixels.
 * Split from `inkShare.ts` so the SUITE can hold the number as GATE A9-B
 * without executing a CLI's `main()` on import. The CLI keeps the printing
 * AND the shape roster (`fighterShapes.ts` is a runtime module the
 * no-game-imports guard rightly keeps away from tests); this file keeps the
 * per-shape measurement. The numbers are the same numbers.
 *
 * ⚠️ SCALE-INVARIANT ON PURPOSE. Stroke widths are in shape-local units, so
 * scaling a shape to the fixed box scales its outline with it. That is what
 * makes a 12-world-px sleeve comparable with a 50-world-px hakama.
 *
 * ⚠️ WHAT IT CANNOT SEE. It counts black, not black's SHAPE. A garment can
 * pass with a clean stroke or with a ragged blob of the same area. Pair it
 * with a look at `renders/garments_alone.png`.
 */
import { planShape } from '../../src/core/artPlan';
import type { DrawOp, ShapeInput } from '../../src/core/artPlan';
import { rasterise } from './rasterise';
import { INK_CHANNEL } from './grammar';

/** Every shape is measured at this size so stroke weight is comparable. */
const BOX = 200;
/** Below this coverage a pixel is a supersampled edge, not a decision. */
const SOLID = 200;

export interface InkShare {
  readonly id: number;
  readonly inked: number;
  readonly black: number;
  /** Black pixels as a percentage of the part's own inked pixels. */
  readonly share: number;
  readonly traced: boolean;
}

function bboxOf(shape: ShapeInput): [number, number, number, number] {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  const eat = (pts: readonly number[]): void => {
    for (let i = 0; i + 1 < pts.length; i += 2) {
      const x = pts[i] ?? 0;
      const y = pts[i + 1] ?? 0;
      if (x < x0) x0 = x;
      if (y < y0) y0 = y;
      if (x > x1) x1 = x;
      if (y > y1) y1 = y;
    }
  };
  for (const p of shape.paints) {
    if (p.kind === 'fill') for (const r of p.rings) eat(r.points);
    else for (const l of p.polylines) eat(l);
  }
  return [x0, y0, x1, y1];
}

export function inkShareOf(shape: ShapeInput): InkShare {
  const [x0, y0, x1, y1] = bboxOf(shape);
  const scale = Math.min((BOX - 8) / (x1 - x0), (BOX - 8) / (y1 - y0));
  const ops: DrawOp[] = planShape(
    shape,
    { x: 4 - x0 * scale, y: 4 - y0 * scale },
    { scale, offsetX: 0, offsetY: 0 },
  );
  // Magenta backdrop: the fighter is painted in no colour near it, so "inked"
  // never has to mean "not the backdrop" (SESSION20's own backdrop guard).
  const r = rasterise(ops, {
    region: { x: 0, y: 0, width: BOX, height: BOX },
    backdrop: 0xff00ff,
    supersample: 3,
  });
  let inked = 0;
  let black = 0;
  for (let i = 0; i < r.coverage.length; i += 1) {
    if ((r.coverage[i] ?? 0) < SOLID) continue;
    inked += 1;
    const p = i * 3;
    if (
      (r.rgb[p] ?? 0) < INK_CHANNEL &&
      (r.rgb[p + 1] ?? 0) < INK_CHANNEL &&
      (r.rgb[p + 2] ?? 0) < INK_CHANNEL
    ) {
      black += 1;
    }
  }
  return { id: shape.id, inked, black, share: (100 * black) / inked, traced: shape.id >= 9000 };
}
