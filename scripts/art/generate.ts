/**
 * SESSION 15 A2 — emit committed TypeScript art from an FFDec shape SVG.
 *
 *   npx vite-node scripts/art/generate.ts -- <shapeId> [<shapeId> …]
 *
 * (vite-node ships with vitest, so this needs no new dependency. Plain
 * `node --experimental-strip-types` cannot run it: type-stripping requires
 * explicit `.ts` import specifiers, which the rest of the repo does not use.)
 *
 * Reads `reference/extracted/shapes/<id>.svg` (gitignored, local-only) and
 * writes `src/game/art/generated/shape<id>.ts`. Every emitted file carries a
 * provenance header naming its characterId and the exact command that
 * extracted it — SESSION15 D7 makes a missing header a gate failure.
 *
 * This file is the CLI ONLY. The emitter itself lives in `./emit` so a test can
 * import it without running `main()` — see that file's header (SESSION16 R2
 * finding 5: nothing could check the committed artifact against the converter
 * because importing this module executed the CLI and threw on argv).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { convertShapeSvg } from './svgShape';
import { emit, sourceSvgRelPath, TOLERANCE } from './emit';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const OUT_DIR = path.join(ROOT, 'src', 'game', 'art', 'generated');

function main(): void {
  const ids = process.argv.slice(2).map(Number);
  if (ids.length === 0 || ids.some(Number.isNaN)) {
    throw new Error('usage: generate.ts <shapeId> [<shapeId> …]');
  }
  mkdirSync(OUT_DIR, { recursive: true });
  for (const id of ids) {
    const svg = readFileSync(path.join(ROOT, sourceSvgRelPath(id)), 'utf8');
    const art = convertShapeSvg(svg, id, TOLERANCE);
    const out = path.join(OUT_DIR, `shape${String(id)}.ts`);
    writeFileSync(out, emit(art));
    const fills = art.paints.filter((p) => p.kind === 'fill');
    const verts = fills.reduce((n, f) => n + f.rings.reduce((m, r) => m + r.points.length / 2, 0), 0);

    console.log(
      `shape ${String(id)}: ${String(art.paints.length)} paints (${String(fills.length)} fills), ` +
        `${String(verts)} verts → ${path.relative(ROOT, out)}`,
    );
  }
}

main();
