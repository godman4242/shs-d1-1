export const meta = {
  name: 'gauntlet-l0-rewrite',
  description: 'GAUNTLET L0 final stage: rewrite REBUILD_READINESS.md from the judged evidence, one writer per ledger slice, each blind-verified',
  whenToUse: 'After WF-3 (judging) and WF-4 (convergence), once buildLedgerPackets.py has written docs/gauntlet/L0/packets/. Pass a run-unique tag.',
  phases: [
    { title: 'Write', detail: 'one writer per ledger slice, citing only its own packet' },
    { title: 'Verify', detail: 'a blind verifier per slice, hunting fabricated cites and overstated claims' },
  ],
}

const REPO = '/Users/kheshav/kheshav-code/SSHD 1-1'
const OUT = `${REPO}/docs/gauntlet/L0`
const PACKETS = `${OUT}/packets`
const LEDGER = `${REPO}/docs/research/REBUILD_READINESS.md`

// The 12 systems own §2's scorecard rows and §4's per-system gap ledgers. `six` and
// `corrections` are split out because their gates are specific and binary: L0-E is
// decided entirely by §6, and §3 is where a correction to the project's own docs lands.
const SYSTEMS = [
  'combat-core', 'skills-meters', 'progression', 'rebirth-elements', 'items-equipment',
  'economy', 'enemies-ai', 'world-exploration', 'quests-story', 'ui-hud',
  'art-anim-audio-feel', 'meta-social',
]
const SLICES = (typeof args === 'object' && args?.slices) || [...SYSTEMS, 'six', 'corrections']

// buildLedgerPackets renumbers nothing, but review filenames still collide across runs
// if two runs write the same slice. Wall #8 cost committed prose to exactly that.
const TAG = (typeof args === 'object' && args?.tag) ? `.${args.tag}` : ''

// ⛔ WALL INSURANCE — see l0-finish-wf3.workflow.js. Prose alone is not enough: at wall
// #8 seven finished reviews sat on disk as .md while the journals held zero result
// records, so the STRUCTURED output was destroyed. Every agent writes the exact object
// it is about to return, as JSON, next to its prose.
function writeBack(stem) {
  return `⛔ BEFORE YOU RETURN — TWO FILES, and this run dies without them:
  1. Your full prose to ${stem}.md
  2. The EXACT structured object you are about to return, as JSON, to ${stem}.json
     — same fields, same values, valid JSON, no markdown fence around it.
This lane has hit the usage limit EIGHT times. At wall #8 the prose survived and the
structured output did NOT. Write file 2 even if you think you are about to return
normally. THEN return the structured object.`
}

const LAW = `
=== GAUNTLET §0 — THE LAW. READ IT BEFORE YOU DO ANYTHING. ===
Straw Hat Samurai: Duels is DEAD. There is no playable build (proven definitively,
REBUILD_READINESS.md §5). You have NEVER seen this game run and you never will.
Therefore you may NOT reason from memory of the game, from plausibility, from another
agent's summary, or from "it looks right". Those verdicts are VOID.

A statement is only admissible if it cites exactly one ARTIFACT:
  A1  a video frame under ${REPO}/reference/frames/ — path + what is VISIBLY in it.
      The fighter is ~270 px tall in a 1080p frame: crop and upscale before grading.
  A2  a payload row under ${REPO}/reference/extracted/ or reference/decompiled/ —
      file + line + the XML/AS3 line QUOTED verbatim.
  A3  a byte-check / test in the suite — test name + pasted output.
  A4  a measured number in a fidelity ledger carrying its OWN frame cite.
  A5  Kheshav's own logged LOOK verdict — quote the log line.
  Otherwise the honest answer is STILL_UNHELD. "STILL_UNHELD" is a RESPECTED, CORRECT
  answer that gate L0-F accepts by name. Guessing is not. Never invent a cite.

STANDING INVARIANT: when a measurement doc and a frame DISAGREE, THE FRAME WINS. Say so
out loud whenever it happens.

DO NOT MODIFY ANY FILE outside your assigned journal paths. This lane touches no source
code. src/core/Sim.ts and tests/duel-baseline.test.ts are NO-TOUCH (§4).
`

const REWRITE_LAW = `
=== THE FOUR RULES THAT DECIDE WHETHER YOUR SECTION SURVIVES THE GATE ===

1. YOU MAY CITE ONLY WHAT IS IN YOUR PACKET. Write a reference inline as [[unit/slug]],
   copied EXACTLY from your packet. Gate L0-B resolves every reference in the finished
   ledger against the pooled verdicts and goes RED — naming the id — on anything
   unjudged, refuted, or invented. A plausible-looking id you compose yourself does not
   fail quietly; it fails the whole lane. If you need evidence your packet does not
   hold, say so in still_unheld. Do NOT go and find it: an unjudged claim is a LEAD (§0)
   and may not enter the ledger no matter how true it looks.

2. A "TRUE BUT REJECTED" FINDING DELETES NOTHING. Your packet's section ② holds findings
   that SURVIVED as claims while the ledger sentence they aimed at did NOT fall. 210 of
   580 claimed overturns were rejected on exactly this — the finding answers a
   neighbouring question, or restates something the ledger already concedes two lines
   later, or overturns a weaker version of the sentence than the one written. Cite those
   findings as new knowledge. Never use one to delete a line.

3. EVERY FACTUAL SENTENCE CARRIES ITS EVIDENCE OR SAYS STILL_UNHELD. A sentence with
   neither is the exact failure this whole lane exists to stop: SESSION 18's A4-D graded
   a bare doll as a clothed fighter because it worked second-hand from a measurement doc.
   A section that hedges honestly beats a section that sounds finished.

4. NEVER SOFTEN A NUMBER TO FIT A STORY (§3.6). If the evidence does not move a score,
   do not move it. A score that goes UP without a cite behind it is worse than a stale
   one, because the next lane will plan against it.
`

const SLICE_BRIEF = {
  six: `=== YOU OWN §6 — "What is structurally UNRECOVERABLE" — AND GATE L0-E IS BINARY ON IT ===

The current §6 lists SIX entries. Every one of them is under fire from judged, surviving
findings in your packet — the audio one especially: 122_Mobile_SoundResource.bin decodes
at XOR key 111 into a valid SWF with 13 DefineSound tags, so "the exact waveforms are
not study-able" may simply be false now.

EACH ENTRY ENDS EXACTLY ONE OF TWO WAYS. There is no third.

  (a) DELETED — because a judged finding in your packet recovers the thing. Say which
      [[id]] kills it, in the deletion note you return.

  (b) KEPT — and then the surviving bullet line MUST contain the literal marker
      "NEGATIVE-SEARCH:" followed by the COMMAND YOU RAN and its OUTPUT, pasted. Gate
      L0-E greps for that marker on every bullet in §6 and goes RED without it. "I
      looked and did not find it" is worthless without the command (§3, no silent caps).
      Search all of: the web payload, the 27 web bindata files, the 42 Android blobs
      (remember C1 — six of them are NOT greppable plain text), the decompiled AS3, and
      the frames manifest.

⚑ AN EMPTY §6 IS A LEGAL, PASSING RESULT. The gate's own words: a provably minimal list
may be empty. Do not keep an entry out of caution. Keep it because a pasted search
failed to find it.`,

  corrections: `=== YOU OWN §3 — "Corrections this pass forced on the project's own docs" ===

This section is the ledger's highest-value output: it changes what the next build session
actually codes. Your packet holds the findings that land here, including the ones that
correct THIS PROJECT'S OWN prior conclusions.

Three corrections are already judged and carried by the lane — state them plainly, with
their [[ids]] from your packet where it holds them:
  C1  the Android blobs are NOT all UTF-16LE. 36 of 42 are plain text; ONE is UTF-16LE
      (118_Mobile_Lang_EN.bin); FIVE are XOR'd zlib SWFs (113/115/120/122/124, key
      'm'=109 then inflate); one is a GIF. Grepping those six returns 0 hits for content
      that IS there.
  C2  the build-parity caveat is UNDISCHARGED and the old "byte-identical" proof was
      CIRCULAR — the web payload carries ZERO questdata/skilldata/npcdata/itemdata roots,
      so those four XMLs came from the ANDROID build and diffing them against the Android
      blobs compares a file with itself. Every row ported from them is v0.682 until a
      WEB-side artifact says otherwise. This RAISES risk for L1-L4.
  C3  S0-5 is DEAD: the audio is RECOVERED, not encrypted.

Do not restate a correction the ledger already makes. Correct what is WRONG.`,
}

function systemBrief(slice) {
  return `=== YOU OWN THE SYSTEM "${slice}" — its §2 scorecard row and its §4 gap ledger ===

Two artifacts, both required.

1. THE §2 SCORECARD ROW, in the existing table's shape:
     | **${slice}** | <score> | <rebuild-ready now> | <the thing blocking a 1:1> |
   ⚑ GATE L0-F IS BINARY ON THIS ROW: it must contain either a [[claim]] reference or
   the literal word STILL_UNHELD. A score with neither is a number with no evidence, and
   the gate names the system and goes RED.

2. THE §4 PER-SYSTEM GAP LEDGER, under the heading "### ${slice} — <score>", listing what
   is HELD (with its [[ids]]) and what is still BLOCKING (each either [[cited]] as
   confirmed-absent or marked STILL_UNHELD).

THE SCORE IS A JUDGEMENT AND YOU MUST SHOW ITS WORK. The old score was set in 2026-07-20,
before the payload extraction landed, so it is stale in an unknown direction. Move it only
as far as your packet's evidence carries it, and say in score_rationale which [[ids]] moved
it and what still holds it down. A score that goes up without a cite is worse than a stale
one — the next lane plans against it.`
}

const WRITER_SCHEMA = {
  type: 'object',
  required: ['slice', 'section_markdown', 'cited_ids', 'still_unheld'],
  properties: {
    slice: { type: 'string' },
    section_markdown: {
      type: 'string',
      description: 'the finished markdown for your section, ready to paste into the ledger',
    },
    scorecard_row: {
      type: 'string',
      description: 'systems only: the single §2 table row, pipes included',
    },
    new_score: { type: 'integer', description: 'systems only: 0-100' },
    old_score: { type: 'integer' },
    score_rationale: {
      type: 'string',
      description: 'which [[ids]] moved the score, and what still holds it down',
    },
    cited_ids: {
      type: 'array', items: { type: 'string' },
      description: 'every [[id]] you cited, without the brackets. All must be in your packet.',
    },
    still_unheld: {
      type: 'array', items: { type: 'string' },
      description: 'what your section says is STILL_UNHELD, and why the packet cannot close it',
    },
    deleted_lines: {
      type: 'array',
      description: 'every line of the old section you removed, and the UPHELD id that kills it',
      items: {
        type: 'object',
        required: ['old_line', 'killed_by'],
        properties: { old_line: { type: 'string' }, killed_by: { type: 'string' } },
      },
    },
    survived_attack: {
      type: 'array', items: { type: 'string' },
      description: 'lines a finding aimed at and FAILED to overturn, which you deliberately KEPT',
    },
    notes_for_lead: { type: 'string' },
  },
}

const VERIFIER_SCHEMA = {
  type: 'object',
  required: ['slice', 'approve', 'issues'],
  properties: {
    slice: { type: 'string' },
    approve: { type: 'boolean', description: 'false if ANY fatal issue stands' },
    fabricated_ids: {
      type: 'array', items: { type: 'string' },
      description: 'cited ids that are NOT in the packet. Each one is fatal on its own.',
    },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        required: ['severity', 'what', 'evidence'],
        properties: {
          severity: { type: 'string', enum: ['fatal', 'material', 'minor'] },
          what: { type: 'string' },
          quote: { type: 'string', description: 'the sentence in the rewrite you are attacking' },
          evidence: { type: 'string', description: 'the artifact YOU opened. Required.' },
          fix: { type: 'string' },
        },
      },
    },
    score_verdict: {
      type: 'string',
      description: 'systems only: does the new score follow from the cited evidence? Say why.',
    },
    own_cite: { type: 'string', description: 'the artifact YOU opened. Your review is VOID without it.' },
  },
}

function writerPrompt(slice) {
  const brief = SLICE_BRIEF[slice] || systemBrief(slice)
  return `${LAW}
${REWRITE_LAW}

=== YOU ARE REWRITING ONE SLICE OF THE READINESS LEDGER ===
Your packet: ${PACKETS}/${slice}.md
READ IT FIRST, ALL OF IT. It holds every finding you may cite and nothing you may not,
plus the current ledger text for your slice, verbatim.

The ledger you are rewriting: ${LEDGER}
Read your own section there in its full context before you change a word of it. You may
read the whole file for context; you may only REWRITE your slice.

${brief}

⚑ WHAT THIS LEDGER IS FOR. It tells the next lane what to build and what to go measure.
Every wrong confident sentence in it sends agents to frame-count a number the payload
already states, or to code a value nobody verified. Every honest STILL_UNHELD sends them
to the right place. Write it for that reader.

${writeBack(`${OUT}/rewrite/${slice}${TAG}`)}`
}

function verifierPrompt(slice, draft) {
  return `${LAW}

=== YOU ARE A BLIND VERIFIER. YOUR JOB IS TO REFUTE THIS REWRITE. ===
Slice: ${slice}
Packet (the ONLY evidence the writer was allowed to cite): ${PACKETS}/${slice}.md

⛔ You see the writer's OUTPUT and the ARTIFACTS. You do NOT see and must not seek out
its reasoning (§3.2) — do not open ${OUT}/rewrite/${slice}${TAG}.md. Judging an argument
instead of evidence is exactly how a wrong claim survives.

=== THE REWRITE, AS SUBMITTED ===
${draft}
=== END OF THE REWRITE ===

FIVE CHECKS, in this order. Default to NOT approving when uncertain.

1. FABRICATION — the fatal one, and the cheapest to run. For EVERY [[id]] in the rewrite,
   confirm that exact id appears in the packet. An id that is not there is fatal on its
   own and goes in fabricated_ids, whether or not the sentence around it is true.

2. OVERSTATEMENT. Open each cited finding in the packet and compare it to the sentence
   built on it. Does the finding actually SAY that? A finding that establishes a value in
   the ANDROID v0.682 build does not establish it for WEB v0.717 (C2: the build-parity
   caveat is UNDISCHARGED). A finding marked PARTIAL does not close a blocker.

3. FALSE DELETION. For every line of the old section that is now gone, is there an UPHELD
   overturn behind it in the packet's section ①? A line deleted on a section-② finding —
   TRUE, but the line SURVIVES — is a fatal error. This is the single most likely way
   this rewrite is wrong: 36% of claimed overturns did not overturn their target.

4. FALSE CONFIDENCE. Any factual sentence carrying neither a [[cite]] nor STILL_UNHELD?
   Any blocker quietly dropped without evidence that it closed?

5. THE SCORE (systems only). Does it follow from the cited evidence, in that direction and
   by roughly that much? Say what you would have scored and why.

⚑ AND CHECK THE OPPOSITE FAILURE TOO: a rewrite that hedges everything to STILL_UNHELD
while its packet holds the answer has also failed. Name anything the packet closes that
the rewrite left open.

You MUST supply own_cite: an artifact YOU opened. Without it your review is VOID under §0.

${writeBack(`${OUT}/rewrite/${slice}.verify${TAG}`)}`
}

// ---------------------------------------------------------------------------

phase('Write')
log(`L0 rewrite: ${SLICES.length} slices x (writer + blind verifier) = ${SLICES.length * 2} agents. ` +
    `Pipelined — each slice verifies the moment its writer lands, no barrier.`)

const dead = []

const results = await pipeline(
  SLICES,
  (slice) =>
    agent(writerPrompt(slice), {
      label: `write:${slice}`, phase: 'Write', schema: WRITER_SCHEMA,
    }).then((r) => {
      if (!r) dead.push(`write:${slice}`)
      return r
    }),
  (draft, slice) => {
    // A slice whose writer died has nothing to verify. Fail closed: it is UNWRITTEN,
    // never "written and clean" (§0 — zero live critics means unjudged, never confirmed).
    if (!draft) return { slice, draft: null, verify: null }
    return agent(verifierPrompt(slice, draft.section_markdown), {
      label: `verify:${slice}`, phase: 'Verify', schema: VERIFIER_SCHEMA,
    }).then((v) => {
      if (!v) dead.push(`verify:${slice}`)
      return { slice, draft, verify: v }
    })
  },
)

const landed = results.filter(Boolean).filter((r) => r.draft)
const unwritten = SLICES.filter((s) => !landed.some((r) => r.slice === s))
const unverified = landed.filter((r) => !r.verify).map((r) => r.slice)
const rejected = landed.filter((r) => r.verify && !r.verify.approve).map((r) => r.slice)
const fabricated = landed.flatMap((r) => (r.verify?.fabricated_ids || []).map((id) => `${r.slice}:${id}`))
const fatal = landed.flatMap((r) =>
  (r.verify?.issues || []).filter((i) => i.severity === 'fatal')
    .map((i) => ({ slice: r.slice, ...i })))

const clean = dead.length === 0 && unwritten.length === 0 && unverified.length === 0 &&
              rejected.length === 0 && fabricated.length === 0

log(`L0 rewrite done: ${landed.length}/${SLICES.length} slices written · ` +
    `${landed.length - unverified.length} verified · ${rejected.length} rejected · ` +
    `${fabricated.length} fabricated ids · ${dead.length} agents died.`)

return {
  slices_expected: SLICES.length,
  slices_written: landed.length,
  unwritten,
  unverified,
  rejected,
  fabricated_ids: fabricated,
  fatal_issues: fatal,
  dead_agents: dead,
  INTEGRITY: clean
    ? `CLEAN — all ${SLICES.length} slices written and verified, 0 rejected, 0 fabricated ids, 0 agents died`
    : `INCOMPLETE — slices never written: [${unwritten.join(', ') || 'none'}] · written but ` +
      `NEVER VERIFIED: [${unverified.join(', ') || 'none'}] · verifier REJECTED: ` +
      `[${rejected.join(', ') || 'none'}] · FABRICATED ids: [${fabricated.join(', ') || 'none'}] · ` +
      `${dead.length} agents DIED (${dead.join(', ') || 'none'}). An unverified slice is NOT a ` +
      `clean slice (§0), and a slice whose writer died is UNWRITTEN — do not paste it into the ` +
      `ledger and do not count it toward the gate.`,
  slices: landed.map((r) => ({
    slice: r.slice,
    section_markdown: r.draft.section_markdown,
    scorecard_row: r.draft.scorecard_row ?? null,
    old_score: r.draft.old_score ?? null,
    new_score: r.draft.new_score ?? null,
    score_rationale: r.draft.score_rationale ?? null,
    cited_ids: r.draft.cited_ids || [],
    still_unheld: r.draft.still_unheld || [],
    deleted_lines: r.draft.deleted_lines || [],
    survived_attack: r.draft.survived_attack || [],
    notes_for_lead: r.draft.notes_for_lead ?? null,
    approved: r.verify ? r.verify.approve : null,
    verifier_issues: r.verify?.issues || [],
    score_verdict: r.verify?.score_verdict ?? null,
  })),
}
