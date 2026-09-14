/**
 * MEASURE → ADVERSARIALLY VERIFY — the fan-out this repo has hand-written once per slice,
 * saved once and parameterised.
 *
 * Invoke as `Workflow({ name: 'measure-verify', args: { … } })`. With no args it runs L4b
 * slice 3a, which is the run it was measured against.
 *
 * ─────────────────────────────────────────────────────────────────────────────────
 * THE ONE RULE THIS SHAPE EXISTS TO ENFORCE: FAN OUT READS, NEVER WRITES.
 * ─────────────────────────────────────────────────────────────────────────────────
 * The classes in a slice share a config file, the `SHIPPED` map in
 * `tests/npcTree.test.ts`, and one test-count contract. Two agents writing those in
 * parallel is the documented parallel-overwrite failure, and this account has already
 * paid for it. So every agent here is READ-ONLY and the parent loop owns every write.
 * `docs/research/HARNESS.md` carries the rule and the evidence.
 *
 * ─────────────────────────────────────────────────────────────────────────────────
 * FAIL-CLOSED ACCOUNTING — the part that is actually deterministic, and the part that
 * has already been wrong here twice.
 * ─────────────────────────────────────────────────────────────────────────────────
 * A DEAD agent and an agent that FOUND NOTHING return the same thing — `null` — and
 * every fan-out this account has shipped that ignored the difference reported a clean
 * pass over work that never ran. So:
 *   · a measure agent that dies       ⇒ `UNMEASURED`, never CLEAN, and it still appears
 *                                       in the result with its lenses marked UNVERIFIED;
 *   · zero live verifiers for a unit  ⇒ `UNVERIFIED`, never CLEAN;
 *   · a single dead verifier          ⇒ that LENS is UNVERIFIED; the others still count;
 *   · the returned `integrity` string states the live/expected counts for both phases,
 *     so "8/8 verdicts" can be read off the result instead of assumed.
 * `scripts/gauntlet/wfcheck.mjs` executes this file with every agent DEAD and with every
 * agent ALIVE, and `tests/workflowScripts.test.ts` asserts the dead branch never yields
 * CLEAN. That is why the accounting is written as plain code rather than left to prompts.
 *
 * ⚠️ WHAT CANNOT BE A BINARY GATE. "Re-running slice 3a re-raises the same single FATAL"
 * is not reproducible and must not be claimed as one: an adversarial agent pass is not
 * deterministic, and two runs over identical inputs can surface different true findings.
 * What IS reproducible, and what the tests pin, is the ACCOUNTING — one verdict per unit
 * per lens, no lens silently missing, and a dead agent that can never read as clean.
 */
export const meta = {
  name: 'measure-verify',
  description: 'Measure a slice of AS3 classes against their TypeScript ports, then adversarially refute each measurement (read-only)',
  whenToUse:
    'Before or after porting a slice of NPC classes: fan out one read-only measurement per class, then refute each with a panel of lenses. Never used for WRITES — the parent loop owns those.',
  phases: [
    { title: 'Measure', detail: 'one read-only agent per unit, reading the .as and the port first-hand' },
    { title: 'Verify', detail: 'one adversarial agent per lens per unit, each trying to REFUTE the measurement' },
  ],
}

// ── defaults: the slice 3a run this was measured against ─────────────────────────
const DEFAULTS = {
  slice: 'L4b slice 3a',
  sourceDir: 'reference/decompiled/shs3_android_payload/scripts',
  tests: ['tests/npcSlice3a.test.ts', 'tests/npcTree.test.ts'],
  units: [
    { name: 'EnemyBear', as: 'EnemyBear.as', port: 'src/core/npc/EnemyBear.ts', config: 'src/config/ogEnemyBear.ts' },
    { name: 'EnemyDeer', as: 'EnemyDeer.as', port: 'src/core/npc/EnemyDeer.ts', config: 'src/config/ogEnemyDeer.ts' },
    { name: 'EnemyHorse', as: 'EnemyHorse.as', port: 'src/core/npc/EnemyHorse.ts', config: 'src/config/ogEnemyHorse.ts' },
    { name: 'EnemyStag', as: 'EnemyStag.as', port: 'src/core/npc/EnemyStag.ts', config: 'src/config/ogEnemyStag.ts' },
  ],
  lenses: [
    { key: 'override-cite', ask: 'Does the port override EXACTLY the methods the .as overrides — no more, no fewer — and does every cite in the port and its config resolve to the line it names?' },
    { key: 'reception', ask: 'Diff the RECEPTION side (gotHit / gotLaunched / gotKnockDown / gotFly / doLaunched / die) statement by statement against NPC.as and the nearest sibling. An inversion of a base guard is not a delta; say which it is.' },
  ],
}

const cfg = { ...DEFAULTS, ...(args ?? {}) }
const UNITS = cfg.units
const LENSES = cfg.lenses

const READONLY = `
⛔ READ-ONLY. Write, edit or delete NOTHING, and run no git command that changes state.
Use read-only tools only (Read/Grep/Glob, and cat/sed -n/grep/rg/wc via Bash).

THIS IS NOT A STYLE PREFERENCE. The classes in a slice share one config file, the
SHIPPED map in tests/npcTree.test.ts and one test-count contract. Parallel writes to
shared state is this repo's documented parallel-overwrite failure and it has already
cost this account a run. The parent loop owns every write.

EVIDENCE DISCIPLINE:
· Read the .as FIRST-HAND. Never carry a number forward from a doc, a kickoff or another
  agent — measure it per file. A count taken over the wrong set of files is the specific
  mistake this repo has made most often.
· Every claim carries a real path plus an exact quoted string you actually read.
· If you cannot verify something, say UNVERIFIED and say what is missing. A confident
  guess is worse than a gap.
`

const MEASURE_SCHEMA = {
  type: 'object',
  properties: {
    unit: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          claim: { type: 'string' },
          evidence: { type: 'string', description: 'path + exact quoted source text you read' },
          detail: { type: 'string' },
        },
        required: ['id', 'claim', 'evidence', 'detail'],
      },
    },
    counts: { type: 'string', description: 'every number, with the command that produced it' },
    integrity: { type: 'string', description: 'what you verified by command vs inferred' },
  },
  required: ['unit', 'findings', 'counts', 'integrity'],
}

const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['CLEAN', 'CORRECTED', 'FATAL', 'UNVERIFIED'] },
    refutations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          target: { type: 'string' },
          problem: { type: 'string' },
          evidence: { type: 'string', description: 'the command you ran and what it printed' },
          correction: { type: 'string' },
        },
        required: ['target', 'problem', 'evidence', 'correction'],
      },
    },
    confirmed: { type: 'array', items: { type: 'string' } },
    integrity: { type: 'string' },
  },
  required: ['verdict', 'refutations', 'confirmed', 'integrity'],
}

function measurePrompt(unit) {
  return `${READONLY}

TASK — MEASURE \`${unit.name}\` for ${cfg.slice}.

Read, in this order and all of them first-hand:
  1. ${cfg.sourceDir}/${unit.as}  — the whole file
  2. ${cfg.sourceDir}/NPC.as      — the base, wherever ${unit.name} overrides it
  3. ${unit.port}                 — the TypeScript port
  4. ${unit.config}               — its numbers

REPORT, as findings:
· Every method the .as overrides, and whether the port overrides exactly that set.
· Every place the port's behaviour could differ from the .as, with the quoted lines.
· Every number in the config, and the source line it comes from — quote the line.
· Anything the .as does that the port CANNOT express through the current seam.
· Source bugs to be ported AS THEY READ, named as such, and distinguished from
  divergences introduced by the port.

Do not propose edits and do not write anything. Measurement only.`
}

function verifyPrompt(unit, lens, measured) {
  return `${READONLY}

TASK — ADVERSARIALLY REFUTE the measurement of \`${unit.name}\` through the ${lens.key} lens.

You are not summarising it; you are trying to break it. This repo has already shipped a
committed doc claim that every test was green around, and a kickoff "trap" that could
never fire because nothing resolved its claim against the source. Assume this report
contains at least one such defect and go find it.

THE LENS: ${lens.ask}

THE MEASUREMENT (JSON):
${JSON.stringify(measured, null, 2)}

HOW TO REFUTE — run real read-only commands and quote real output:
· For every exact string it claims is in a file, verify it verbatim and count its
  occurrences.
· For every count, re-derive it with your own command over the files you choose — check
  WHICH files were counted.
· For every "X appears nowhere" or "nothing pins this", try hard to find a counter-example.
  That is the claim most likely to be wrong.
· For every cite, open the line.

VERDICTS — fail-closed:
· FATAL — at least one claim is wrong in a way that would make the parent build the wrong
  thing.
· CORRECTED — the claims stand but need specific fixes; list them as refutations.
· CLEAN — you ran real checks and could not break anything. Only if you actually ran them.
· UNVERIFIED — you could not run the checks. NEVER return CLEAN in that case.`
}

phase('Measure')

const results = await pipeline(
  UNITS,
  (unit) => agent(measurePrompt(unit), { label: `measure:${unit.name}`, phase: 'Measure', schema: MEASURE_SCHEMA }),
  (measured, unit) => {
    // FAIL-CLOSED: a dead measure agent is UNMEASURED and still reports its lenses as
    // UNVERIFIED. It must never vanish from the result, because a unit that silently
    // disappears reads as a unit with nothing wrong.
    if (!measured) {
      return {
        unit: unit.name,
        status: 'UNMEASURED',
        measured: null,
        verdicts: LENSES.map((l) => ({ lens: l.key, verdict: 'UNVERIFIED', refutations: [], reason: 'the measure agent returned nothing' })),
      }
    }
    return parallel(
      LENSES.map((lens) => () =>
        agent(verifyPrompt(unit, lens, measured), { label: `verify:${unit.name}:${lens.key}`, phase: 'Verify', schema: VERDICT_SCHEMA })
          .then((v) => ({ lens: lens.key, ...(v ?? { verdict: 'UNVERIFIED', refutations: [], integrity: 'the verify agent died — fail-closed' }) })),
      ),
    ).then((verdicts) => {
      const live = verdicts.filter((v) => v && v.verdict !== 'UNVERIFIED')
      return {
        unit: unit.name,
        // Zero live verifiers is UNVERIFIED, never CLEAN — even when the measurement
        // itself came back fine.
        status: live.length === 0 ? 'UNVERIFIED' : 'VERIFIED',
        measured,
        verdicts,
      }
    })
  },
)

// `pipeline` drops a thrown stage to null. A null here is a unit that fell out of the run
// entirely, which is exactly the thing that must not look like a pass.
const byUnit = UNITS.map((u, i) => results[i] ?? { unit: u.name, status: 'UNMEASURED', measured: null, verdicts: [] })

const verdicts = byUnit.flatMap((u) => u.verdicts)
const live = verdicts.filter((v) => v && v.verdict !== 'UNVERIFIED')
const fatal = verdicts.filter((v) => v && v.verdict === 'FATAL')
const expected = UNITS.length * LENSES.length

log(`units: ${byUnit.filter((u) => u.status !== 'UNMEASURED').length}/${UNITS.length} measured`)
log(`verdicts: ${live.length}/${expected} live · FATAL ${fatal.length} · UNVERIFIED ${verdicts.length - live.length}`)

return {
  slice: cfg.slice,
  // Read the accounting off this line rather than inferring it. If live < expected, the
  // difference is agents that DIED, not units that were clean.
  integrity: `${byUnit.filter((u) => u.status !== 'UNMEASURED').length}/${UNITS.length} units measured; ${live.length}/${expected} live verdicts (${LENSES.length} lenses × ${UNITS.length} units); ${fatal.length} FATAL; ${verdicts.length - live.length} UNVERIFIED. A unit or lens missing from the counts DIED — it was not clean.`,
  fatalCount: fatal.length,
  units: byUnit,
}
