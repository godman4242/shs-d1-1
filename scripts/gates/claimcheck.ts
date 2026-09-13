/**
 * `npm run claimcheck` — RESOLVES EVERY `<File>.as:<line>` IN THE REPO AGAINST THE REAL
 * DECOMPILED SOURCE, and cross-checks every cited numeric config value against the line
 * it claims to come from.
 *
 * Two halves, and the second is the one that earns its keep:
 *   EXISTENCE + RANGE over `src/config/**` and `src/core/npc/**` — does the cited file
 *     exist in the pinned tree, and is the line inside it?
 *   ±N LITERAL over `src/config/**` — does the number actually appear where the comment
 *     says it does? All three real bugs this gate has found were IN RANGE, so the first
 *     half passed them clean.
 *
 * The rules, the exemptions and the reasons for both live in `claimcheckLib.ts`. Read
 * that header before changing anything here: every rule in it replaced a simpler rule
 * that measurement falsified.
 *
 * ⚠️ NEEDS `reference/` — the decompiled sources are study-only, local-only and
 * gitignored (`RECREATE, NEVER RIP`). With no `reference/` tree this exits 0 and says
 * loudly that it checked NOTHING, and `tests/claimcheck.test.ts` carries the same skip
 * with the same reason. That is the one fail-open in the gate and it is deliberate: the
 * alternative is a suite that cannot pass in a clean clone. The hermetic unit tests in
 * that file always run.
 *
 * USAGE
 *   npm run claimcheck            the report; exit 1 on any failure
 *   npm run claimcheck -- --all   also list every PASS (long)
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Cite } from './claimcheckLib.ts';
import { literalNear, moduleCites, numericFields, prepare, scopeFor } from './claimcheckLib.ts';

const ROOT = resolve(import.meta.dirname, '..', '..');

/**
 * THE PINNED SOURCE TREE. Never a repo-wide basename search: `Projectile.as` exists in
 * four decompiled trees with four different line counts, and two of them are the
 * PREDECESSOR GAMES (shs1, shs2), where a cite resolves and means something else.
 */
const AS_DIR = 'reference/decompiled/shs3_android_payload/scripts';

/** Trees to sweep. `src/core/**` has no numeric half — it has no numbers. */
const CITE_ROOTS = ['src/config', 'src/core/npc'];
const NUMERIC_ROOT = 'src/config';

/**
 * `ogAi.ts` transcribes `NPCManager.as`'s dispatch switch as DATA — ai ordinals, XML
 * placement attributes, and source LINE NUMBERS. A ±N window over those is a category
 * error, and it produced 58 of the 66 raw failures when this gate was sized. It is NOT
 * unchecked: its own header records that `tests/ogAiData.test.ts` byte-checks it with an
 * INDEPENDENT parser, which is strictly stronger than this.
 */
const NUMERIC_EXEMPT = new Set([
  'src/config/ogAi.ts',
  // `fidelity.ts` holds values MEASURED OFF 1080p STUDY FRAMES, not transcribed from the
  // ActionScript — its header says so outright ("measured reference assertions from the
  // original game's frames"). Its single `.as` cite covers the two caption COLOURS and
  // nothing else, so a ±N window over it asks whether a frame-measured x of 202 appears
  // near a font tag: a category error, exactly like ogAi's. Its own gates are
  // `tests/fidelity-probes.test.ts` and `tests/fidelityCompare.test.ts`.
  'src/config/fidelity.ts',
]);

/**
 * ±N. The kickoff specified ±2; this ships ±1 because the measurement said ±1 catches
 * everything ±2 catches while roughly halving the false-PASS surface — decompiled AS is
 * one-statement-per-line and brace-padded, so a ±2 window admits four to six unrelated
 * small integers and `midDiv: 10` would pass against any of 40 / 10 / 5 / 60. Tighter is
 * never gate-softening; `npm run claimcheck -- --window 2` re-measures the looser one.
 */
const DEFAULT_WINDOW = 1;

/**
 * DERIVED VALUES — the literal genuinely is not in the source, and the derivation is
 * written out here so a reader can check it by hand.
 *
 * Kept deliberately tiny. The rejected alternative was to make the gate evaluate simple
 * `A * B` expressions it finds in the window: that generalises, but it widens the pass
 * surface to any two numbers in the window whose product happens to match, which trades
 * a named exception for an unnamed one. `tests/claimcheck.test.ts` asserts every entry
 * here STILL FAILS the plain check, so an entry that stops being needed is reported
 * instead of rotting.
 */
const DERIVED: Array<{ file: string; key: string; value: number; why: string }> = [
  {
    file: 'src/config/ogEnemyBear.ts',
    key: 'cooldownFrames',
    value: 120,
    why: 'EnemyBear.as:200 writes `this.idleCounter = 5 * 24;` — five seconds at OG_FPS 24. The literal 120 appears nowhere in the file.',
  },
];

interface Failure {
  readonly kind: 'MISSING-FILE' | 'LINE-OOR' | 'UNRESOLVED' | 'LITERAL-ABSENT' | 'STALE-DERIVED';
  readonly where: string;
  readonly detail: string;
}

function tsFilesUnder(rel: string): string[] {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) return [];
  return readdirSync(abs).flatMap((entry) => {
    const p = join(abs, entry);
    if (statSync(p).isDirectory()) return tsFilesUnder(join(rel, entry));
    return entry.endsWith('.ts') ? [join(rel, entry)] : [];
  });
}

const sourceCache = new Map<string, string[] | null>();

/** The cited AS file's lines, or null if it does not exist. */
function asLines(cite: Cite): string[] | null {
  // A cite carrying its own `reference/…` path is honoured verbatim — exactly one does,
  // and it points into a different decompiled tree than every other cite.
  const rel = cite.file.includes('/') ? cite.file : join(AS_DIR, cite.file);
  const hit = sourceCache.get(rel);
  if (hit !== undefined) return hit;
  const abs = join(ROOT, rel);
  const lines = existsSync(abs) ? readFileSync(abs, 'utf8').split('\n') : null;
  sourceCache.set(rel, lines);
  return lines;
}

const argv = process.argv.slice(2);
const showAll = argv.includes('--all');
const windowArg = argv.indexOf('--window');
const WINDOW = windowArg === -1 ? DEFAULT_WINDOW : Number(argv[windowArg + 1] ?? DEFAULT_WINDOW);

if (!existsSync(join(ROOT, AS_DIR))) {
  process.stdout.write(
    `\n⚠️  claimcheck CHECKED NOTHING.\n   ${AS_DIR} is absent — the decompiled sources are study-only, local-only and\n   gitignored, so a clean clone has none. This is not a pass.\n\n`,
  );
  process.exit(0);
}

const failures: Failure[] = [];
let citesChecked = 0;
let valuesChecked = 0;
let uncited = 0;

// ── half one: every cite resolves ────────────────────────────────────────────────
for (const rel of CITE_ROOTS.flatMap(tsFilesUnder)) {
  const mod = prepare(readFileSync(join(ROOT, rel), 'utf8'));
  for (const cite of moduleCites(mod)) {
    citesChecked += 1;
    const lines = asLines(cite);
    if (lines === null) {
      failures.push({
        kind: 'MISSING-FILE',
        where: `${rel}:${cite.line}`,
        detail: `\`${cite.raw}\` → ${cite.file} does not exist in ${AS_DIR} (filename via ${cite.via})`,
      });
      continue;
    }
    if (cite.start < 1 || cite.end > lines.length || cite.end < cite.start) {
      failures.push({
        kind: 'LINE-OOR',
        where: `${rel}:${cite.line}`,
        detail: `\`${cite.raw}\` → ${cite.file} has ${lines.length} lines, cite names ${cite.start}-${cite.end} (filename via ${cite.via})`,
      });
    }
  }
}

// ── half two: every cited numeric value appears where its cite says ──────────────
for (const rel of tsFilesUnder(NUMERIC_ROOT)) {
  if (NUMERIC_EXEMPT.has(rel)) continue;
  const mod = prepare(readFileSync(join(ROOT, rel), 'utf8'));
  for (const field of numericFields(mod)) {
    const cites = scopeFor(mod, field.line).filter((c) => asLines(c) !== null);
    if (cites.length === 0) {
      uncited += 1;
      continue;
    }
    valuesChecked += 1;
    const found = cites.some((c) => literalNear(asLines(c) ?? [], c, field.value, WINDOW));
    const derived = DERIVED.find((d) => d.file === rel && d.key === field.key && d.value === field.value);
    if (found && derived !== undefined) {
      failures.push({
        kind: 'STALE-DERIVED',
        where: `${rel}:${field.line}`,
        detail: `${field.key} = ${field.value} now PASSES the plain check — delete its DERIVED entry in scripts/gates/claimcheck.ts`,
      });
    }
    if (!found && derived === undefined) {
      const spans = cites.map((c) => `${c.file}:${c.start}${c.end === c.start ? '' : `-${c.end}`}`).join(', ');
      failures.push({
        kind: 'LITERAL-ABSENT',
        where: `${rel}:${field.line}`,
        detail: `${field.key} = ${field.value} appears nowhere within ±${WINDOW} of ${spans}`,
      });
    } else if (showAll) {
      process.stdout.write(`  ok  ${rel}:${field.line} ${field.key} = ${field.value}\n`);
    }
  }
}

process.stdout.write(`\n${'═'.repeat(100)}\nCLAIMCHECK\n${'═'.repeat(100)}\n`);
process.stdout.write(`cites resolved       ${citesChecked}\n`);
process.stdout.write(`cited values checked ${valuesChecked}  (±${WINDOW}; ${uncited} numeric fields carry no resolvable cite and are out of scope)\n`);
process.stdout.write(`derived exceptions   ${DERIVED.length}\n`);
process.stdout.write(`numeric-half exempt  ${[...NUMERIC_EXEMPT].join(', ')} (each has its own independent gate)\n`);

if (failures.length === 0) {
  process.stdout.write('\n✅ every cite resolves and every cited value is where it says it is.\n\n');
  process.exit(0);
}

process.stderr.write(`\n❌ ${failures.length} failure(s):\n`);
for (const f of failures) process.stderr.write(`   [${f.kind.padEnd(14)}] ${f.where}\n      ${f.detail}\n`);
process.stderr.write(
  '\nA cite is a CLAIM ABOUT THE SOURCE. Fix the cite, or fix the value — never widen the\nwindow to make a run pass.\n\n',
);
process.exit(1);
