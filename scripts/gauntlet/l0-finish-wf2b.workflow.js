export const meta = {
  name: 'gauntlet-l0-finish-wf2b',
  description: 'GAUNTLET L0 finish, run 2b: re-run the 4 source packets whose critics died at wall #5',
  whenToUse: 'After the WF-1/WF-2 salvage. Judges the 140 claims still carrying no verdict. Does NOT re-survey.',
  phases: [
    { title: 'Source critics', detail: '4 surviving packets x (cite + hunter), reading the blind-safe worklist packets' },
  ],
}

const REPO = '/Users/kheshav/kheshav-code/SSHD 1-1'
const IDX = `${REPO}/docs/gauntlet/L0/index`
const OUT = `${REPO}/docs/gauntlet/L0`
const WORK = `${OUT}/worklist`

const LAW = `
=== GAUNTLET §0 — THE LAW. READ IT BEFORE YOU DO ANYTHING. ===
Straw Hat Samurai: Duels is DEAD. There is no playable build (proven definitively,
REBUILD_READINESS.md §5). You have NEVER seen this game run and you never will.
Therefore you may NOT reason from memory of the game, from plausibility, from
another agent's summary, or from "it looks right". Those verdicts are VOID.

A verdict is only admissible if it cites exactly one ARTIFACT that YOU opened:
  A1  a video frame under ${REPO}/reference/frames/ — path + what is VISIBLY in it.
      The fighter is ~270 px tall in a 1080p frame: you MUST crop and upscale before
      grading. State the crop you used.
  A2  a payload row under ${REPO}/reference/extracted/ or reference/decompiled/ —
      file + line + the XML/AS3 line QUOTED verbatim.
  A3  a byte-check / test in the suite — test name + pasted output.
  A4  a measured number in a fidelity ledger that carries its OWN frame cite —
      give the ledger § AND the cite it carries.
  A5  Kheshav's own logged LOOK verdict — quote the log line.
  Otherwise the honest answer is STILL_UNHELD. "STILL_UNHELD" is a RESPECTED,
  CORRECT answer. Guessing is not. Never invent a cite; a fabricated cite is the
  worst outcome available to you.

STANDING INVARIANT: when a measurement doc and a frame DISAGREE, THE FRAME WINS.
Say so out loud whenever it happens.

⚠ YOUR OWN CITE IS MACHINE-CHECKED. scripts/gauntlet/citeLint.py opens every path
you name and checks every line number against the file's real length. Cite paths
RELATIVE TO THE REPO ROOT. Cite LINE NUMBERS, never record/entry IDs —
"strings.json:6143" already killed two claims this lane, because strings.json has
2,535 lines and 6143 was a string ID. Write ID lookups as strings.json["6143"].

DO NOT MODIFY ANY FILE outside your assigned journal path. This lane touches no
source code. src/core/Sim.ts and tests/duel-baseline.test.ts are NO-TOUCH (§4).
`

const INDEX_BRIEF = `
=== YOUR EVIDENCE INDEX (built by script — trust it over hand-counting) ===
${IDX}/questdata.json ${IDX}/skilldata.json ${IDX}/npcdata.json ${IDX}/itemdata.json
${IDX}/bindata.json        all 27 web bindata files IDENTIFIED
${IDX}/ui_strings.json     UI fields + embedded font faces
${IDX}/frames.json         reference/frames manifest by directory (7,381 files)
${IDX}/actionscript.json   2,768 classes across 8 decompiled bundles
${IDX}/android_blobs.json  the 42 CLASS-NAMED Android blobs, with tag histograms
${IDX}/strings.json        the STRING TABLE, 2,533 entries, already parsed
${IDX}/resolved_names.json item/skill/npc id -> name + desc, already resolved
${IDX}/payload_histogram.json  streamed tag histogram of the 329 MB payload.xml

VERIFIED COUNTS — do not re-derive, do not contradict without a pasted command:
  questdata.xml  61 <quest> · 2771 <dialogue> · 3307 <text> · 471 <choice> · 196 <option>
                 · 55 <cutscene> · 118 <wave> · 225 <step>
  skilldata.xml  75 <skill> · 182 <level> · 182 <chi> · 182 <cooldown>
  npcdata.xml    495 <npc> · 425 <ai> · 647 <skill>
  itemdata.xml   982 <item> · 550 <baseprice> · 412 <modifier> · 371 <defense>

⛔ S0-3 — THE §2.1 STRING-TABLE BLOCKER IS DEAD. GAUNTLET.md §2.1 says item/skill/npc
names are unresolvable numeric IDs. THAT IS FALSE and any claim asserting it is
auto-REFUTED. reference/extracted/android/118_Mobile_Lang_EN.bin is a UTF-16LE XLIFF
string table, 2,533 entries; already parsed into ${IDX}/strings.json and
${IDX}/resolved_names.json. Measured resolution: itemdata 804/0 · skilldata 73/0 ·
npcdata 484/6. Worked example: itemdata.xml:28 item 2100 <name>4000</name> ->
"Small Soldier Pill".
  ⚠ CAVEAT: that is the ANDROID build, clientVersion 0.682 (shs3_android/scripts/
  StatsManager.as:30), vs the web build's v0.717. Data-XML row counts match exactly;
  UI copy and combat tuning parity is NOT established. A claim resting on an Android
  string while asserting WEB behaviour has a real build-parity hole.
S0-1: all 27 web bindata files identified — 100-118 <animdata>, 119 <survivalmodedata>
  (a whole game mode absent from all 12 ledger systems), 93 room objects, 94-98 name
  tables, 92 a GIF.
S0-2: the game font is CLOSED — ui_strings.txt:100 face="Edo SZ", :182 face="Calibri".
S0-4: <anim> summed over the 18 MCSCharacter_* Android blobs = 471 (measured
  2026-08-20), not the board's "~150". 99_HumanAnimationData alone = 158.
S0-5: audio is HELD but ENCRYPTED (nested "CWS" SWFs ffdec cannot open). You may NOT
  claim audio is recovered. You MAY claim it is held-but-encrypted.
⚠ THE ANDROID BLOBS ARE UTF-16LE. A byte-level grep returns 0 hits and WILL fool you
  into wrongly refuting a sound claim. Decode before you judge.
`

const CRITIC_SCHEMA = {
  type: 'object',
  required: ['verdicts'],
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['claim_id', 'refuted', 'reason', 'own_cite'],
        properties: {
          claim_id: { type: 'string' },
          refuted: { type: 'boolean' },
          reason: { type: 'string' },
          own_cite: { type: 'string', description: 'the artifact YOU opened to judge. Your verdict is VOID without it.' },
          severity: { type: 'string', enum: ['fatal', 'material', 'minor'] },
        },
      },
    },
    new_findings: {
      type: 'array',
      description: 'anything you found the surveyor missed',
      items: {
        type: 'object',
        required: ['id', 'text', 'artifact_class', 'cite', 'verdict'],
        properties: {
          id: { type: 'string' },
          text: { type: 'string' },
          artifact_class: { type: 'string', enum: ['A1', 'A2', 'A3', 'A4', 'A5', 'STILL_UNHELD'] },
          cite: { type: 'string' },
          quote: { type: 'string' },
          verdict: { type: 'string', enum: ['HELD', 'PARTIAL', 'STILL_UNHELD'] },
          overturns_ledger: { type: 'boolean' },
          ledger_text: { type: 'string' },
          lane_impact: { type: 'string' },
          build: { type: 'string', description: 'web v0.717 | android v0.682 | both' },
        },
      },
    },
    judged_count: { type: 'integer', description: 'how many claims in the packet you actually ruled on' },
    packet_size: { type: 'integer', description: 'how many claims the packet contained' },
  },
}

const UNITS = [
  { key: 'itemdata', file: 'src-itemdata.claims.json', source: 'reference/extracted/itemdata.xml (173 K) — 982 items, type, baseprice, weight, modifiers, defense, unique, heavenlyprice' },
  { key: 'bindata', file: 'src-bindata.claims.json', source: 'reference/extracted/bindata/ — all 27 web files (19 animdata, survivalmodedata, room objects, 5 name tables, 1 GIF)' },
  { key: 'actionscript', file: 'src-actionscript.claims.json', source: 'reference/decompiled/**/*.as — 2,768 classes across 8 bundles; shs3_payload has 1,079 files, obfuscated §1t<N>s0§.as names' },
  { key: 'frames', file: 'src-frames.claims.json', visual: true, source: 'reference/frames/ — 7,381 stills, manifest at ' + IDX + '/frames.json. A1 TERRITORY: the fighter is ~270 px tall in a 1080p frame.' },
]

const LENSES = {
  frame: `LENS 1V — THE FRAME LENS. This packet is VISUAL, so the cite lens IS the frame
lens. §0's standing invariant is THE FRAME WINS over any measurement doc, and its
corollary binds you: a visual claim graded from a document while a frame was available
is REFUTED. That is the exact SESSION 18 A4-D failure — a bare doll graded as a clothed
fighter because the grader worked second-hand from a measurement doc — and it is why
this lens exists.

For every claim: OPEN THE CITED IMAGE YOURSELF. Crop to the stated region and UPSCALE
before you judge — the fighter is ~270 px tall in a 1080p frame, and a 480x270 survey
thumbnail cannot settle a pixel value. State the crop box and the upscale factor you
used, in every own_cite.

REFUTE: a frame path that does not exist · a crop where the described thing is not
visible · a value read off a survey-scale thumbnail and presented as measured · a claim
that says THE FRAME WINS when the frame and the doc do not actually disagree.
UPHOLD, loudly: a genuine doc-vs-pixel contradiction. Say THE FRAME WINS out loud.`,
  cite: `LENS 1 — THE CITE LENS. You hunt OVER-CLAIMING.
For every claim: OPEN THE CITED ARTIFACT YOURSELF. Does the file exist? Is the line
number right? Does the quoted text actually appear there? Does it actually SAY what the
claim says it says, or is the claim an inference dressed as a citation?
A claim whose cite does not resolve is REFUTED, full stop.

START WITH THE MACHINE AUDIT. Every claim in your packet carries a "citelint" field:
  BROKEN            a path is absent or a line is past end-of-file. Already proven
                    wrong mechanically — confirm and refute, do not re-litigate.
  QUOTE_UNVERIFIED  paths and lines are fine, but the quoted text could not be located
                    in any cited file. THESE ARE YOUR PRIORITY. Either you find the
                    quote (and the claim survives) or you have caught a real one.
  RESOLVES          mechanically clean. Your job on these is the part a script cannot
                    do: does the artifact SAY what the claim says it says?
Two traps: the Android blobs are UTF-16LE (grep them as bytes and you will see nothing
and wrongly refute); and a claim resting on an ANDROID v0.682 string while asserting
WEB v0.717 behaviour has a build-parity hole — material, not fatal, and say what
would close it.`,

  hunter: `LENS 2 — THE HUNTER LENS. You hunt UNDER-CLAIMING, which is the failure this
whole lane exists to fix. For every claim marked STILL_UNHELD or PARTIAL: GO TRY TO
FIND IT. Search the other payload files, the 27 web bindata files, the 42 Android
blobs, the 2,768 decompiled AS3 classes, the string table, the frames manifest. If you
find it, the STILL_UNHELD verdict is REFUTED and you supply the cite in new_findings.
Refuting a "we don't have it" is the most valuable thing you can do here.

Also hunt the SILENCE: this source has been read once, by one agent, with one set of
questions. What is IN this file that no claim in the packet mentions at all? A whole
tag family, a value domain, a cross-reference into another file, an enum nobody
decoded. Those go in new_findings too, and they are worth more than a re-judgement.`,
}

function criticPrompt(unit, lens) {
  return `${LAW}
${INDEX_BRIEF}

=== YOU ARE A BLIND CRITIC ===
Your packet: ${WORK}/${unit.file}
Its source:  ${unit.source}

READ THE PACKET FILE FIRST. It holds the structured claims a surveyor produced from
that source, joined to the machine cite audit.

⛔ DO NOT READ ${OUT}/sources/${unit.key}.md. That file is the surveyor's PROSE,
including its reasoning, and §3.2 says a critic sees the OUTPUT and the ARTIFACTS and
never the reasoning. The packet is the output. The payload is the artifact. Reading the
surveyor's write-up would make you a reviewer of an argument instead of a judge of
evidence, which is exactly how a wrong claim survives.

⛔ DO NOT RE-SURVEY. These claims already exist. You judge them.

YOUR JOB IS TO REFUTE. Default to refuted=true when uncertain. A claim survives only if
you personally opened an artifact and it held up. You must supply own_cite for EVERY
verdict: the artifact YOU opened. A verdict without own_cite is VOID under §0 and is
discarded — costing your whole review.

Do not refute something for being merely incomplete; refute it for being WRONG,
UNGROUNDED, or MIS-CITED. Over-refuting honest STILL_UNHELD answers is also a failure.

JUDGE EVERY CLAIM IN THE PACKET. A claim you skip stays UNJUDGED, and under §0 an
unjudged claim is a LEAD that may never enter the ledger — so a skipped claim is a
claim destroyed. Set judged_count and packet_size honestly; if they differ, say which
you skipped and why in the last verdict's reason. NO SILENT CAPS (§3).

${LENSES[lens]}

Write your full review to ${OUT}/critics/src-${unit.key}.${lens}.md BEFORE you return —
this run must survive a usage wall. Then return the structured object.`
}

// ---------------------------------------------------------------------------

phase('Source critics')
log(`WF-2b armed: ${UNITS.length} surviving packets x 2 blind critics = ${UNITS.length * 2} agents. ` +
    `140 banked claims that still carry no verdict after wall #5.`)

const deadAgents = []
const reviews = []

const results = await parallel(
  UNITS.flatMap((unit) =>
    ['cite', 'hunter'].map((lens) => () =>
      agent(criticPrompt(unit, unit.visual && lens === 'cite' ? 'frame' : lens), {
        label: `critic:${unit.key}:${lens}`,
        phase: 'Source critics',
        schema: CRITIC_SCHEMA,
      }).then((r) => {
        if (!r) deadAgents.push(`critic:${unit.key}:${lens}`)
        else reviews.push({ unit: unit.key, lens, review: r })
        return r
      }),
    ),
  ),
)

const live = results.filter(Boolean)
const verdicts = live.flatMap((r) => r.verdicts || [])
// VOID under §0: a verdict with no artifact of its own never counted as judgement.
const liveVerdicts = verdicts.filter((v) => (v.own_cite || '').trim())
const newFindings = live.flatMap((r) => r.new_findings || [])

// A unit whose critics ALL died is not a unit that was judged clean. Fail closed.
const judgedUnits = new Set(reviews.map((r) => r.unit))
const unjudgedUnits = UNITS.map((u) => u.key).filter((k) => !judgedUnits.has(k))

const coverage = reviews.map((r) => ({
  unit: r.unit,
  lens: r.lens,
  judged: r.review.judged_count ?? null,
  packet: r.review.packet_size ?? null,
  verdicts: (r.review.verdicts || []).length,
  new_findings: (r.review.new_findings || []).length,
}))
const shortfalls = coverage.filter((c) => c.judged !== null && c.packet !== null && c.judged < c.packet)

log(`WF-2b done: ${live.length}/${UNITS.length * 2} critics returned · ${liveVerdicts.length} live verdicts · ` +
    `${verdicts.length - liveVerdicts.length} VOID · ${newFindings.length} new findings · ` +
    `${deadAgents.length} agents died.`)

const clean = deadAgents.length === 0 && unjudgedUnits.length === 0 && shortfalls.length === 0

return {
  critics_run: live.length,
  critics_expected: UNITS.length * 2,
  verdicts_total: verdicts.length,
  verdicts_live: liveVerdicts.length,
  verdicts_void: verdicts.length - liveVerdicts.length,
  refuted_count: liveVerdicts.filter((v) => v.refuted).length,
  new_findings_count: newFindings.length,
  dead_agents: deadAgents,
  unjudged_units: unjudgedUnits,
  coverage,
  shortfalls,
  INTEGRITY: clean
    ? `CLEAN — all ${UNITS.length * 2} critics returned, every packet fully judged, 0 agents died, 0 VOID verdicts`
    : `INCOMPLETE — ${live.length}/${UNITS.length * 2} critics returned · units with NO live critic: ` +
      `[${unjudgedUnits.join(', ') || 'none'}] · packets only partly judged: ` +
      `[${shortfalls.map((s) => `${s.unit}:${s.lens} ${s.judged}/${s.packet}`).join(', ') || 'none'}] · ` +
      `${deadAgents.length} agents DIED (${deadAgents.join(', ') || 'none'}). ` +
      `Zero live critics means UNJUDGED, never confirmed (§0). A stage where agents died is NOT a ` +
      `stage that found nothing, and may not count toward convergence.`,
  verdicts: liveVerdicts,
  void_verdicts: verdicts.filter((v) => !(v.own_cite || '').trim()),
  new_findings: newFindings,
}
