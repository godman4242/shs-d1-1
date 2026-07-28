/**
 * THE INK RULER (SESSION21 A8.3) — how much of each part is BLACK OUTLINE,
 * ours measured against the OG's own art. BUILD-TIME ONLY, but it reads nothing
 * from `reference/`: both sides are committed shapes, so it runs anywhere.
 *
 * ⛔ WHY IT EXISTS. The owner looked at the render and said the garments "have
 * too much black outline to the point it bleeds into the actual garment image
 * for one or 2 of them". He was right, and he was right about the COUNT — but
 * nothing in the repo could say which two, or by how much. §P4.13 of the SESSION
 * 21 kickoff had measured black as a share of the WHOLE FIGURE (35.9 % ours vs
 * 28.8 % the source's), which cannot name a garment.
 *
 * ⭐ THE REFERENCE IS THE OG'S OWN ART, NOT A ROUND NUMBER. Each shape is
 * rasterised alone, scaled to a fixed box, and its black pixels counted against
 * its inked pixels. The OG's 15 shapes set the range a part is ALLOWED to sit
 * in; a traced garment outside that range is over-inked by the original's own
 * standard rather than by taste.
 *
 * ⚠️ SCALE-INVARIANT ON PURPOSE. Stroke widths are in shape-local units, so
 * scaling a shape to the box scales its outline with it. That is what makes a
 * 12-world-px sleeve comparable with a 50-world-px hakama.
 *
 * ⚠️ WHAT IT CANNOT SEE. It counts black, not black's SHAPE. A garment can pass
 * with a clean stroke or with a ragged blob of the same area. Pair it with a
 * look at `renders/garments_alone.png`.
 *
 * Run:  npx vite-node scripts/art/inkShare.ts
 */
import { planShape } from '../../src/core/artPlan';
import type { DrawOp, ShapeInput } from '../../src/core/artPlan';
import { rasterise } from './rasterise';
import { FIGHTER_SHAPES } from '../../src/game/art/fighterShapes';
import { SHAPE_2641 } from '../../src/game/art/generated/shape2641';

/** Every shape is measured at this size so stroke weight is comparable. */
const BOX = 200;
/** A pixel this dark, at full coverage, is outline. */
const BLACK = 40;
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
    if ((r.rgb[p] ?? 0) < BLACK && (r.rgb[p + 1] ?? 0) < BLACK && (r.rgb[p + 2] ?? 0) < BLACK) {
      black += 1;
    }
  }
  return { id: shape.id, inked, black, share: (100 * black) / inked, traced: shape.id >= 9000 };
}

/** Every shape the dressed fighter can draw, OG art and traced garments alike. */
export function allShares(): InkShare[] {
  const shapes = [...FIGHTER_SHAPES.values(), SHAPE_2641];
  return shapes.map((s) => inkShareOf(s)).sort((a, b) => b.share - a.share);
}

function main(): void {
  const rows = allShares();
  // ⚠️ 2670 is the HAIR and it is 100 % black BY DESIGN — it is a solid mass, not
  // an outline. Including it in the reference range would licence any amount of
  // ink on anything, so it is named and excluded rather than quietly dropped.
  const reference = rows.filter((r) => !r.traced && r.id !== 2670);
  const worstOg = Math.max(...reference.map((r) => r.share));
  const meanOg = reference.reduce((a, r) => a + r.share, 0) / reference.length;

  console.log('   id    inked    black   BLACK SHARE');
  for (const r of rows) {
    const tag = r.traced ? '  <- OURS (traced)' : r.id === 2670 ? '  <- OG hair, solid BY DESIGN' : '';
    const over = r.traced && r.share > worstOg ? '  ⛔ OVER the OG range' : '';
    console.log(
      `${String(r.id).padStart(6)} ${String(r.inked).padStart(8)} ${String(r.black).padStart(8)}` +
        `   ${r.share.toFixed(1).padStart(5)}%${tag}${over}`,
    );
  }
  console.log(
    `\n  OG reference (${String(reference.length)} shapes, hair excluded): ` +
      `mean ${meanOg.toFixed(1)}%, worst ${worstOg.toFixed(1)}%`,
  );
  const over = rows.filter((r) => r.traced && r.share > worstOg);
  console.log(
    over.length === 0
      ? '  ✅ no traced garment is inkier than the OG\'s own worst part'
      : `  ⛔ ${String(over.length)} traced garment(s) over the OG's own worst: ` +
          over.map((r) => `${String(r.id)} ${r.share.toFixed(1)}%`).join(', '),
  );
}

// Runs on import, the same convention as `scorePose.ts` — this file is a CLI.
main();
