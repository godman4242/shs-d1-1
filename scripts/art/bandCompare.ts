/**
 * THE BAND REPORT (LANE L3B) — GATE A13-A's verdict, cell by cell, on the
 * console. BUILD-TIME ONLY; needs no `reference/`, because both sides are
 * committed data or our own raster.
 *
 * `tests/a13Bands.test.ts` ENFORCES this; this file EXPLAINS it. Same rule,
 * imported from `./bandLedger` rather than restated — a gate whose CLI has its
 * own copy of the threshold is a gate with two thresholds.
 *
 * ⚠️ IT IMPORTS THE GAME'S REGISTRY, so like `poseRaster.ts` it is unreachable
 * from the suite (`tests/no-game-imports.test.ts`). Everything decidable lives
 * in `./bandLedger`, which the test drives with the shapes rebuilt from
 * `art/generated/**` — nothing here is load-bearing but the formatting.
 *
 * Run:  npx vite-node scripts/art/bandCompare.ts
 *       npx vite-node scripts/art/bandCompare.ts -- --ledger   # our side as a TS literal
 *
 * `--ledger` exists for ONE job: recording a render's ledger so the gate can be
 * pointed back at it later. That is what turns A13-A's red-proof from a pasted
 * console log into a test that still runs after the shapes it condemned are gone.
 */
import { FIGHTER_SHAPES } from '../../src/game/art/fighterShapes';
import { bandLedger, gradeLedger, GATE_A13A, PAINT_CLASSES } from './bandLedger';
import { renderPoseWith } from './poseScene';
import { HELDOUT_BANDS, TRACING_BAND_FRAME, TRACING_BANDS } from './sourceBands';

const ours = bandLedger(renderPoseWith('dressed', FIGHTER_SHAPES).raster);

if (process.argv.includes('--ledger')) {
  for (const row of ours) {
    const share = PAINT_CLASSES.map((c) => `${c}: ${row.share[c].toFixed(3)}`).join(', ');
    console.log(`  { band: '${row.band}', pixels: ${String(row.pixels)}, share: { ${share} } },`);
  }
  process.exit(0);
}

const verdicts = gradeLedger(ours, TRACING_BANDS, HELDOUT_BANDS);

console.log(`GATE A13-A — our dressed render against ${TRACING_BAND_FRAME}`);
console.log(
  `rule: |ours - target| <= max(${String(GATE_A13A.noiseFloorPp)} pp, ` +
    `${String(GATE_A13A.spreadMultiple)} x the source's own frame-to-frame spread)\n`,
);
console.log(`${'band'.padEnd(13)}${'paint'.padEnd(7)}${'OURS'.padStart(7)}${'TARGET'.padStart(8)}${'delta'.padStart(8)}${'spread'.padStart(8)}${'tol'.padStart(7)}  verdict`);

let previous = '';
for (const v of verdicts) {
  if (previous !== '' && v.band !== previous) console.log('');
  previous = v.band;
  console.log(
    `${v.band.padEnd(13)}${v.paint.padEnd(7)}${v.ours.toFixed(1).padStart(7)}${v.target.toFixed(1).padStart(8)}` +
      `${v.delta.toFixed(1).padStart(8)}${v.spread.toFixed(1).padStart(8)}${v.tolerance.toFixed(1).padStart(7)}  ` +
      (v.pass ? 'ok' : `⛔ FAIL by ${(v.delta - v.tolerance).toFixed(1)} pp`),
  );
}

const failed = verdicts.filter((v) => !v.pass);
console.log(
  failed.length === 0
    ? `\n✅ GATE A13-A GREEN — all ${String(verdicts.length)} cells within tolerance`
    : `\n⛔ GATE A13-A RED — ${String(failed.length)} of ${String(verdicts.length)} cells out of tolerance:\n` +
        failed
          .sort((a, b) => b.delta - b.tolerance - (a.delta - a.tolerance))
          .map((v) => `   ${v.band}/${v.paint}: ours ${v.ours.toFixed(1)}% vs ${v.target.toFixed(1)}% (tol ${v.tolerance.toFixed(1)} pp)`)
          .join('\n'),
);

const worst = Math.max(...verdicts.map((v) => v.delta - v.tolerance));
console.log(`\nworst overshoot: ${worst.toFixed(6)} pp   (the A13-A ratchet's number)`);
