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
  return `⛔ BEFORE YOU RETURN — TWO FILES, IN THIS ORDER. This run dies without file 1.
  1. FIRST, before you compose a single line of prose: the EXACT structured object you
     are about to return, as JSON, to ${stem}.json — same fields, same values, valid
     JSON, no markdown fence around it. Write it the moment you have your verdicts.
     THIS FILE IS THE WORK. Everything else is a record of it.
  2. THEN your full prose to ${stem}.md.

⛔ THE ORDER IS NOT A STYLE PREFERENCE — IT IS THE WHOLE INSURANCE. This lane has hit the
usage limit NINE times. At wall #8, seven finished reviews sat on disk as .md while the
journals held zero results, and every structured verdict was lost. At wall #9 it happened
again to two more batches, for one reason only: they wrote the prose first. A blind
re-judge may NEVER read another agent's prose (§3.2), so a lost verdict cannot be
recovered from a surviving review — it has to be earned again from nothing.

Write file 1 even if you are certain you are about to return normally.`
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
failed to find it.

⛔ ONE FORMATTING RULE, AND IT DECIDES THE GATE. L0-E treats EVERY line in §6 starting
with "- " or "* " as a surviving unrecoverable entry, and reds it if it lacks the
NEGATIVE-SEARCH: marker. So a bulleted deletion note — "- Verbatim dialogue: DELETED,
killed by [[id]]" — reads to the gate as an entry you KEPT without a search, and turns
the gate red on work you actually did correctly.

  ONLY a surviving unrecoverable may be a bullet in §6.
  Write deletions, context and commentary as PROSE or as a TABLE. Both are ungated.

Return the deletions in deleted_lines regardless — that is how the lead records what
§6 lost and why.`,

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

// TWO INDEPENDENT VERIFIERS PER SLICE, with DISTINCT lenses (widened 2026-08-23).
// With one verifier, "majority refute" is not a thing: a single miss goes into the ledger
// and gate L0-A/B catch it only AFTER the whole run, costing a full re-write. Two
// identical refuters would be redundant, so each owns the half of the check list it is
// best placed to run to the bottom. Both still run FABRICATION — it is fatal and cheap.
const VERIFY_LENSES = [
  {
    key: 'evidence',
    name: 'EVIDENCE — does the packet actually say this?',
    brief: `Checks 1, 2 and 3. Open EVERY cited finding in the packet and read it against the
sentence built on it. Your specialism is the gap between what a finding establishes and what
the rewrite claims it establishes — an ANDROID v0.682 value asserted for WEB v0.717 (C2 is
UNDISCHARGED), a PARTIAL finding closing a blocker, a NOT-UPHELD finding used to delete a
line. Check 3 is the single most likely way this rewrite is wrong: 60 of 554 claimed
overturns were TRUE but did not overturn their target. Walk every deleted line back to an
UPHELD overturn in section ① of the packet, or call it a fatal false deletion.`,
  },
  {
    key: 'calibration',
    name: 'CALIBRATION — is the confidence and the score earned?',
    brief: `Checks 4 and 5, plus the opposite failure. Your specialism is TONE AND DEGREE, in
both directions. Hunt every factual sentence carrying neither a [[cite]] nor STILL_UNHELD,
and every blocker quietly dropped. Then hunt the mirror image: a rewrite that hedges to
STILL_UNHELD while its own packet holds the answer has ALSO failed, and nobody else is
looking for that. On the score, say what YOU would have scored from the cited evidence
alone and why — a score that moved further than its evidence supports is a fatal issue,
and so is one that did not move when the evidence clearly closed a blocker.`,
  },
]

function verifierPrompt(slice, draft, lens) {
  return `${LAW}

=== YOU ARE A BLIND VERIFIER. YOUR JOB IS TO REFUTE THIS REWRITE. ===
Slice: ${slice}
Your lens: ${lens.name}
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

=== ⚑ WHERE *YOU* SPEND YOUR DEPTH — ${lens.name} ===
TWO verifiers are reading this slice independently and neither sees the other. Run all
five checks, but the checks below are YOURS to run to the bottom: if you have time for
one thing only, it is these. Do not assume the other verifier caught anything.
${lens.brief}

${writeBack(`${OUT}/rewrite/${slice}.verify.${lens.key}${TAG}`)}`
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
    if (!draft) return { slice, draft: null, verifiers: [] }
    return parallel(VERIFY_LENSES.map((lens) => () =>
      agent(verifierPrompt(slice, draft.section_markdown, lens), {
        label: `verify:${slice}:${lens.key}`, phase: 'Verify', schema: VERIFIER_SCHEMA,
      }).then((v) => {
        if (!v) dead.push(`verify:${slice}:${lens.key}`)
        return v ? { lens: lens.key, ...v } : null
      }),
    )).then((vs) => ({ slice, draft, verifiers: vs.filter(Boolean) }))
  },
)

const landed = results.filter(Boolean).filter((r) => r.draft)
const unwritten = SLICES.filter((s) => !landed.some((r) => r.slice === s))

// ⛔ FAIL CLOSED, TWICE OVER — and this block is why the singular `r.verify` had to go.
// A slice with NO live verifier is UNVERIFIED. A slice that got only ONE of its two
// lenses is PARTIALLY verified: the other lens's checks were never run by anyone, so it
// is not clean either. §0 — zero live critics means unjudged, never confirmed.
const unverified = landed.filter((r) => r.verifiers.length === 0).map((r) => r.slice)
const partial = landed
  .filter((r) => r.verifiers.length > 0 && r.verifiers.length < VERIFY_LENSES.length)
  .map((r) => `${r.slice}(${r.verifiers.map((v) => v.lens).join('+')} only)`)

// APPROVAL IS UNANIMOUS, NOT MAJORITY. With two verifiers a "majority" is either
// unanimity or a tie, so majority is not a rule here — one refusal is a refusal.
const rejected = landed
  .filter((r) => r.verifiers.length > 0 && !r.verifiers.every((v) => v.approve))
  .map((r) => `${r.slice}(${r.verifiers.filter((v) => !v.approve).map((v) => v.lens).join(',')})`)

// Deduped: both lenses run the fabrication check, so both may name the same id.
const fabricated = [...new Set(landed.flatMap((r) =>
  r.verifiers.flatMap((v) => (v.fabricated_ids || []).map((id) => `${r.slice}:${id}`))))]
const fatal = landed.flatMap((r) => r.verifiers.flatMap((v) =>
  (v.issues || []).filter((i) => i.severity === 'fatal')
    .map((i) => ({ slice: r.slice, lens: v.lens, ...i }))))

const clean = dead.length === 0 && unwritten.length === 0 && unverified.length === 0 &&
              partial.length === 0 && rejected.length === 0 && fabricated.length === 0

log(`L0 rewrite done: ${landed.length}/${SLICES.length} slices written · ` +
    `${landed.length - unverified.length - partial.length} fully verified (both lenses) · ` +
    `${partial.length} one lens only · ${rejected.length} rejected · ` +
    `${fabricated.length} fabricated ids · ${dead.length} agents died.`)

return {
  slices_expected: SLICES.length,
  slices_written: landed.length,
  unwritten,
  unverified,
  partially_verified: partial,
  rejected,
  fabricated_ids: fabricated,
  fatal_issues: fatal,
  dead_agents: dead,
  INTEGRITY: clean
    ? `CLEAN — all ${SLICES.length} slices written and verified by BOTH lenses ` +
      `(${VERIFY_LENSES.map((l) => l.key).join(' + ')}), 0 rejected, 0 fabricated ids, 0 agents died`
    : `INCOMPLETE — slices never written: [${unwritten.join(', ') || 'none'}] · written but ` +
      `NEVER VERIFIED: [${unverified.join(', ') || 'none'}] · only ONE lens ran: ` +
      `[${partial.join(', ') || 'none'}] · verifier REJECTED: [${rejected.join(', ') || 'none'}] · ` +
      `FABRICATED ids: [${fabricated.join(', ') || 'none'}] · ` +
      `${dead.length} agents DIED (${dead.join(', ') || 'none'}). An unverified slice is NOT a ` +
      `clean slice (§0); a slice only ONE lens read is NOT verified, because the other lens's ` +
      `checks were run by nobody; and a slice whose writer died is UNWRITTEN — do not paste it ` +
      `into the ledger and do not count it toward the gate.`,
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
    // null (not false) when NO lens ran: "nobody checked" is not "checked and rejected".
    approved: r.verifiers.length ? r.verifiers.every((v) => v.approve) : null,
    lenses_run: r.verifiers.map((v) => v.lens),
    verifier_issues: r.verifiers.flatMap((v) => (v.issues || []).map((i) => ({ lens: v.lens, ...i }))),
    score_verdict: r.verifiers.map((v) => ({ lens: v.lens, verdict: v.score_verdict ?? null })),
  })),
}
