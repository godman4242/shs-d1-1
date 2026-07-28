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
 * ⚠️ SESSION22 A9.1: the measuring core moved VERBATIM to `inkShareLib.ts` so
 * GATE A9-B can hold these numbers in the suite; this file is the CLI printing.
 *
 * Run:  npx vite-node scripts/art/inkShare.ts
 */
import { inkShareOf } from './inkShareLib';
import type { InkShare } from './inkShareLib';
import { FIGHTER_SHAPES } from '../../src/game/art/fighterShapes';

/** Every shape the dressed fighter can draw — the registry holds the branch too (A9.6). */
function allShares(): InkShare[] {
  return [...FIGHTER_SHAPES.values()].map((s) => inkShareOf(s)).sort((a, b) => b.share - a.share);
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
