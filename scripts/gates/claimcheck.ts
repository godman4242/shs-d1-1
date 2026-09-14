/**
 * `npm run claimcheck` — RESOLVES EVERY `<File>.as:<line>` IN THE REPO AGAINST THE REAL
 * DECOMPILED SOURCE, and cross-checks every cited numeric config value against the line
 * it claims to come from.
 *
 * Two halves, and the second is the one that earns its keep:
 *   EXISTENCE + RANGE over `src/config/**` and `src/core/npc/**` — does the cited file
 *     exist in the pinned tree, and is the line inside it?
 *   ±0 LITERAL over `src/config/**`, in both directions — does every cited value appear on
 *     a line its cites name, and does every cite name a line holding a value it governs?
 *     Every real bug this gate has found was IN RANGE, so the first half passed it clean;
 *     and the first version of this half judged only the first direction at ±1, which
 *     let four wrong cites through (see `claimcheckLib.ts`).
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
import type { Cite, ContextCite, Derived } from './claimcheckLib.ts';
import { DEFAULT_WINDOW, checkValues, moduleCites, prepare } from './claimcheckLib.ts';

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
const DERIVED: Derived[] = [
  {
    file: 'src/config/ogEnemyBear.ts',
    key: 'cooldownFrames',
    value: 120,
    why: 'EnemyBear.as:200 writes `this.idleCounter = 5 * 24;` — five seconds at OG_FPS 24. The literal 120 appears nowhere in the file.',
  },
];

/**
 * CONTEXT CITES — correct cites that do not state a value they govern (`ContextCite`).
 *
 * Every entry was classified BY HAND against the cited line: 29 when the per-cite rule first
 * ran (82 failures, the rest real), and 12 more that PASSED only because an unrelated
 * governed literal sat on the line — found by a read-only fan-out over the 172 multi-value
 * cites (`wf_1b4b7826-c2e`) and each re-read before listing (`docs/research/HARNESS.md`). An entry
 * is removed from its values' union as well as exempted per cite, so declaring a cite
 * context can never be what makes a value pass. An entry whose cite governs no value any
 * more is STALE and fails the run. Adding one needs the same thing these have: the cited
 * line opened and read, and the reason written down.
 */
const ctx = (file: string, why: string, ...cites: string[]): ContextCite[] => cites.map((cite) => ({ file, cite, why }));
const CONTEXT: ContextCite[] = [
  ...ctx('src/config/ogEnemyArcher.ts', 'the `if(isFriendly)` branch a friendly archer takes instead of the coin — a guard, not a value', 'EnemyArcher.as:233'),
  ...ctx('src/config/ogEnemyBear.ts', 'the d3 clip roll read twice — the `dice == 1` there is the SIT index, not `walkOn`', 'EnemyBear.as:98-108', 'EnemyBear.as:110'),
  ...ctx('src/config/ogEnemyBear.ts', 'holds `5 * 24`, the derivation of `cooldownFrames` (see DERIVED)', 'EnemyBear.as:200'),
  ...ctx('src/config/ogEnemyBear.ts', 'the maul itself, cited for the guard it LACKS', 'EnemyBear.as:212-214'),
  ...ctx('src/config/ogEnemyBear.ts', "the wolf's `isAdventureMode()` fence — a contrast", 'EnemyWolf.as:294'),
  ...ctx('src/config/ogEnemyBear.ts', '`init` setting `doChase` outside the overworld — the condition, not the 400', 'EnemyBear.as:42-45'),
  ...ctx('src/config/ogEnemyBoar.ts', '`idleCounter = 48` — a cross-reference to `OG_ANIMAL.idleFrames`, which lives in ogNpcAnimal.ts', 'EnemyBoar.as:113'),
  ...ctx('src/config/ogEnemyDeer.ts', 'the `dice == 0` branch — roll 0 keeps the default clip and has no field of its own', 'EnemyDeer.as:80'),
  ...ctx('src/config/ogEnemyDeer.ts', '`idleCounter = 48` — a cross-reference to `OG_ANIMAL.idleFrames`', 'EnemyDeer.as:79'),
  ...ctx('src/config/ogEnemyDeer.ts', 'the `else` that re-enters IDLE — control flow, not a value', 'EnemyDeer.as:149-152'),
  ...ctx(
    'src/config/ogEnemyFox.ts',
    "the header's fox ↔ wolf twin map: each pair holds a WOLF value the fox imports from OG_WOLF, not one of OG_FOX's own",
    'EnemyFox.as:50', 'EnemyWolf.as:227', 'EnemyFox.as:52', 'EnemyWolf.as:229', 'EnemyFox.as:103', 'EnemyWolf.as:237',
    'EnemyFox.as:119', 'EnemyWolf.as:255', 'EnemyFox.as:123', 'EnemyWolf.as:259', 'EnemyFox.as:133', 'EnemyWolf.as:268',
    'EnemyFox.as:177', 'EnemyFox.as:181', 'EnemyWolf.as:304', 'EnemyWolf.as:308', 'EnemyFox.as:202', 'EnemyWolf.as:329',
  ),
  ...ctx('src/config/ogEnemyHorse.ts', '`idleCounter = 48` — a cross-reference to `OG_ANIMAL.idleFrames`', 'EnemyHorse.as:96'),
  ...ctx('src/config/ogEnemySpearElite.ts', "the base's trivial-level rule at 10 — a twin RULE with a different number (see configTwins' deny-list)", 'NPC.as:253-257'),
  ...ctx('src/config/ogEnemyWolf.ts', "the base's weapon DEFLECT the wolf does not have — a contrast", 'NPC.as:437-440'),
  ...ctx(
    'src/config/ogEnemyWolf.ts',
    "the header's reused-base-constant map: the 12 and the −100 there are OG_NPC_HIT_IFRAMES / OG_NPC_FLOATING_TEXT (ogNpcBase.ts), not OG_WOLF's",
    'EnemyWolf.as:392', 'NPC.as:462', 'EnemyWolf.as:405-421', 'NPC.as:497-513',
  ),
  ...ctx('src/config/ogEnemyWolfAlpha.ts', "the constructor's `startAction(IDLE_STATE)` — a call site, not a value", 'EnemyWolfAlpha.as:23'),
  ...ctx('src/config/ogEnemyWolfAlpha.ts', 'the `destX` re-roll inside `startAction(RUN)` — a behaviour, not the 15', 'EnemyWolfAlpha.as:248'),
  ...ctx('src/config/ogNpcAnimal.ts', "the base's `* 2 + 20` xp curve — a contrast", 'NPC.as:218'),
  ...ctx('src/config/ogNpcAnimal.ts', "the stag's `setLevel` overwriting xp with the base curve — a contrast", 'EnemyStag.as:62'),
  ...ctx('src/config/ogNpcAnimal.ts', "the wolf's `random() * 2 + 4` walk — a contrast", 'EnemyWolf.as:144'),
];

interface Failure {
  readonly kind: 'MISSING-FILE' | 'LINE-OOR' | 'UNRESOLVED' | 'LITERAL-ABSENT' | 'NO-VALUE-AT-CITE' | 'STALE-DERIVED' | 'STALE-CONTEXT';
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
const numericFiles = tsFilesUnder(NUMERIC_ROOT).filter((rel) => !NUMERIC_EXEMPT.has(rel));
for (const e of CONTEXT) {
  // An entry for a file the numeric half never reads could never go STALE — so it is one.
  if (!numericFiles.includes(e.file)) {
    failures.push({ kind: 'STALE-CONTEXT', where: e.file, detail: `CONTEXT entry \`${e.cite}\` names a file the numeric half does not read` });
  }
}
for (const rel of numericFiles) {
  const report = checkValues(prepare(readFileSync(join(ROOT, rel), 'utf8')), rel, asLines, WINDOW, DERIVED, CONTEXT);
  valuesChecked += report.checked;
  uncited += report.uncited;
  for (const f of report.failures) failures.push({ kind: f.kind, where: f.line === 0 ? rel : `${rel}:${f.line}`, detail: f.detail });
  if (showAll) for (const p of report.passes) process.stdout.write(`  ok  ${rel}:${p.line} ${p.key} = ${p.value}\n`);
}

process.stdout.write(`\n${'═'.repeat(100)}\nCLAIMCHECK\n${'═'.repeat(100)}\n`);
process.stdout.write(`cites resolved       ${citesChecked}\n`);
process.stdout.write(`cited values checked ${valuesChecked}  (±${WINDOW}; ${uncited} numeric fields carry no resolvable cite and are out of scope)\n`);
process.stdout.write(`derived exceptions   ${DERIVED.length}\n`);
process.stdout.write(`context cites        ${CONTEXT.length}  (correct cites that state no value they govern; each read by hand)\n`);
process.stdout.write(`numeric-half exempt  ${[...NUMERIC_EXEMPT].join(', ')} (each has its own independent gate)\n`);

if (failures.length === 0) {
  process.stdout.write('\n✅ every cite resolves and every cited value is where it says it is.\n\n');
  process.exit(0);
}

process.stderr.write(`\n❌ ${failures.length} failure(s):\n`);
for (const f of failures) process.stderr.write(`   [${f.kind.padEnd(16)}] ${f.where}\n      ${f.detail}\n`);
process.stderr.write(
  '\nA cite is a CLAIM ABOUT THE SOURCE. Fix the cite, or fix the value — never widen the\nwindow to make a run pass.\n\n',
);
process.exit(1);
