export const meta = {
  name: 'gauntlet-l0-finish-wf4',
  description: 'GAUNTLET L0 finish, run 5: dry-loop until two rounds that ACTUALLY RAN find nothing, then the completeness critic',
  whenToUse: 'Last. After WF-1/2/3a/3b have landed and SEEN_CLAIM_IDS.txt has been regenerated from the full claim set.',
  phases: [
    { title: 'Dry-loop', detail: 'hunters re-sweep until two consecutive rounds that ran surface nothing new' },
    { title: 'Completeness', detail: 'what modality was not run, what source unread, what claim unverified' },
  ],
}

const REPO = '/Users/kheshav/kheshav-code/SSHD 1-1'
const IDX = `${REPO}/docs/gauntlet/L0/index`
const OUT = `${REPO}/docs/gauntlet/L0`

const LAW = `
=== GAUNTLET §0 — THE LAW. READ IT BEFORE YOU DO ANYTHING. ===
Straw Hat Samurai: Duels is DEAD. There is no playable build (proven definitively,
REBUILD_READINESS.md §5). You have NEVER seen this game run and you never will.
Therefore you may NOT reason from memory of the game, from plausibility, from
another agent's summary, or from "it looks right". Those verdicts are VOID.

A claim is only admissible if it cites exactly one ARTIFACT:
  A1  a video frame under ${REPO}/reference/frames/ — path + what is VISIBLY in it.
      The fighter is ~270 px tall in a 1080p frame: crop and upscale before grading.
      State the crop you used.
  A2  a payload row under ${REPO}/reference/extracted/ or reference/decompiled/ —
      file + line + the XML/AS3 line QUOTED verbatim.
  A3  a byte-check / test in the suite — test name + pasted output.
  A4  a measured number in a fidelity ledger that carries its OWN frame cite.
  A5  Kheshav's own logged LOOK verdict — quote the log line.
  Otherwise the honest answer is STILL_UNHELD. "STILL_UNHELD" is a RESPECTED, CORRECT
  answer. Guessing is not. Never invent a cite.

STANDING INVARIANT: when a measurement doc and a frame DISAGREE, THE FRAME WINS.

⚠ YOUR CITE IS MACHINE-CHECKED by scripts/gauntlet/citeLint.py. Repo-relative paths.
LINE NUMBERS, never record IDs — write ID lookups as strings.json["6143"].

DO NOT MODIFY ANY FILE outside your assigned journal path. src/core/Sim.ts and
tests/duel-baseline.test.ts are NO-TOUCH (§4).
`

const INDEX_BRIEF = `
=== YOUR EVIDENCE INDEX (built by script — trust it over hand-counting) ===
${IDX}/questdata.json ${IDX}/skilldata.json ${IDX}/npcdata.json ${IDX}/itemdata.json
${IDX}/bindata.json  ${IDX}/ui_strings.json  ${IDX}/frames.json  ${IDX}/actionscript.json
${IDX}/android_blobs.json  ${IDX}/strings.json  ${IDX}/resolved_names.json
${IDX}/payload_histogram.json

⛔ S0-3 — THE §2.1 STRING-TABLE BLOCKER IS DEAD. Any claim asserting item/skill/npc
names are unresolvable numeric IDs is auto-REFUTED. 118_Mobile_Lang_EN.bin is a
UTF-16LE XLIFF table, 2,533 entries, already parsed into ${IDX}/strings.json and
resolved_names.json. itemdata 804/0 · skilldata 73/0 · npcdata 484/6.
  ⚠ ANDROID v0.682 vs web v0.717 — label the build on every string-derived claim.
S0-1: all 27 web bindata files identified (100-118 animdata, 119 survivalmodedata,
  93 room objects, 94-98 name tables, 92 a GIF).
S0-2: the font is CLOSED — ui_strings.txt:100 face="Edo SZ", :182 face="Calibri".
S0-4: <anim> over the 18 MCSCharacter_* Android blobs = 471 (measured 2026-08-20).
=== ⚑ CORRECTIONS TO THE STAGE-0 BRIEF, judged and carried forward (2026-08-20) ===
Earlier stages of THIS lane overturned three things the Stage-0 brief asserted. They are
corrected here, and a claim that repeats the OLD version is auto-REFUTED.

C1 — THE BLOB ENCODING RULE. The old brief said "the Android blobs are UTF-16LE". That is
  over-general in a way that HIDES CONTENT. Magic-byte census over all 42 files:
    36 of 42  plain greppable text
    1         UTF-16LE, BOM fffe — 118_Mobile_Lang_EN.bin only
    5         XOR-obfuscated zlib SWFs — 113_MusicResource, 115_SHS3Resource,
              120_BGResource, 122_SoundResource, 124_ImageResource (magic "CW")
              -> ResourceManager.decryptByteArray, key 'm'=109 (Mobile.as:352), then inflate
    1         GIF89a 63x72 — 110_Mobile_MapBitmapData.bin (magic "GI")
  A plain grep of those SIX returns 0 hits for content that IS THERE. That is the real
  false-negative trap, and it is what hid the portrait, icon and audio inventories.

C2 — THE S0-3 PARITY CAVEAT IS UNDISCHARGED, and any "byte-identical" proof between
  reference/extracted/{questdata,skilldata,npcdata,itemdata}.xml and the Android blobs is
  CIRCULAR. Verified first-hand: the web payload carries ZERO <questdata>, <skilldata>,
  <npcdata> or <itemdata> roots — not in payload.xml, not in any of the 27 web bindata
  files. Those four XMLs came from the ANDROID build, so diffing them against the Android
  blobs compares a file with itself. Every row ported from them is v0.682 until a WEB-side
  artifact says otherwise. Do NOT cite that diff as parity evidence.

C3 — S0-5 IS DEAD: THE AUDIO IS RECOVERED, NOT ENCRYPTED. 122_Mobile_SoundResource.bin
  decodes at XOR key 111 into a valid CWS v17 SWF holding 13 DefineSound tags plus a
  SymbolClass table naming every SFX, all extracted to playable MP3. Survived 8 critics.
  Also held: 13 named music stems (six overworld at exactly 79.872 s, four dungeon at
  exactly 45.760 s), the adaptive-music engine (17 boolean presets over the 13 stems,
  crossfade +/-0.05 per tick, new stems entering at the anchor stem's playhead), and the
  SFX playback contract. You MAY now claim audio is recovered. The old "held-but-encrypted"
  line is superseded.

`

// Run-unique suffix — see the wf3 note: dry-loop round numbers restart every run, so
// `dryloop-r1-t1.md` collides across runs without it.
const TAG = (typeof args === 'object' && args?.tag) ? `.${args.tag}` : ''

const CLAIM_SCHEMA = {
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
}

const HUNT_SCHEMA = {
  type: 'object',
  required: ['unit', 'claims', 'journal_path', 'searched'],
  properties: {
    unit: { type: 'string' },
    claims: { type: 'array', items: CLAIM_SCHEMA },
    journal_path: { type: 'string' },
    searched: {
      type: 'string',
      description: 'what you actually opened this round. An empty claims array is only credible if this is full. §3: no silent caps.',
    },
  },
}

// Distinct targets, so the rounds are not three copies of one search. Each is a place
// four runs could plausibly have missed something, not a re-tread of what they covered.
const HUNTS = [
  `THE §6 "structurally UNRECOVERABLE" LIST. Open docs/research/REBUILD_READINESS.md §6
and attack every entry. Each one must end EITHER deleted with a kill-cite, OR kept with
a PASTED NEGATIVE SEARCH across the web payload, the 27 bindata files, the 42 Android
blobs, the decompiled AS3, and the frames manifest. "I looked and did not find it" is
worthless without the command and its output. This is gate L0-E and it is binary.`,

  `WHAT NOBODY CLAIMED. Four runs asked their own questions; this hunt asks what fell
between them. Candidates nobody has mapped onto a system: 119 <survivalmodedata> (a
whole game mode absent from all 12 ledger systems), 84_QuestEngine_TrapRoomData (314
room objects), the five name-generator tables, 121_Mobile_PremiumData,
110_Mobile_MapBitmapData, 123_Mobile_BGData, loot/reward tables, startcondition/comp
operators, and any tag family in payload_histogram.json that no claim mentions.
Method: take the histogram and the blob inventory, subtract everything SEEN_CLAIM_IDS
covers, and go read what is left.`,

  `THE BUILD-PARITY QUESTION. S0-3 left it open: the string table and 42 blobs are
ANDROID v0.682; the web build is v0.717. Every ported string inherits that risk and the
ledger rewrite is about to bake it in. Settle what can be settled: diff the Android data
XMLs (111_Mobile_ItemData, 116_Mobile_QuestData, 117_Mobile_SkillData, 125_Mobile_NpcData)
against their web counterparts in reference/extracted/, and diff ui_strings.txt (web)
against the corresponding Android strings. Report each surface as PARITY PROVEN with the
diff, or PARITY BROKEN with the specific divergence. A proven parity is worth as much as
a divergence — it de-risks L2 and L3 outright.`,

  `THE FRAMES, AGAINST THE DOCS. §0's standing invariant is THE FRAME WINS, and only one
surveyor in this whole lane worked in A1. Go find contradictions: a number some doc
asserts that the pixels disagree with, and a question the ledger calls open that a frame
settles outright. Use ${IDX}/frames.json to locate candidates, then ACTUALLY OPEN THE
IMAGE, crop, and upscale — the fighter is ~270 px tall in a 1080p frame. State the crop.
Say THE FRAME WINS out loud whenever a doc loses.`,
]

function huntPrompt(hunt, round, idx) {
  return `${LAW}
${INDEX_BRIEF}

=== DRY-LOOP HUNTER, round ${round}, target ${idx + 1} ===
Five earlier stages banked their claims. YOUR JOB IS TO FIND WHAT THEY MISSED.

${hunt}

ALREADY SEEN — read this file FIRST and dedup against it:
  ${OUT}/SEEN_CLAIM_IDS.txt
It lists every claim id banked so far, grouped by unit. A finding matching one of those
is NOT new. Report it only if you can materially STRENGTHEN it with a better artifact or
CONTRADICT it — and say explicitly which.

⛔ Dedup against everything SEEN, not everything CONFIRMED. Re-reporting a finding the
critics already rejected is what makes a dry-loop never converge.

Report ONLY genuinely new, artifact-cited findings. IF YOU FIND NOTHING NEW, RETURN AN
EMPTY claims ARRAY — that is a correct and valuable answer, and two consecutive empty
rounds end this loop. Do not pad. A padded round costs another whole round of agents.

Fill in "searched" with what you actually opened. An empty result is only credible if
that field is full, and a full one is how the next reader knows the ground was covered.

Write to ${OUT}/critics/dryloop-r${round}-t${idx + 1}${TAG}.md before you return.`
}

// ---------------------------------------------------------------------------

phase('Dry-loop')

const seen = new Set()
const fresh = []
const deadAgents = []
let round = 0
let dry = 0
let deadRounds = 0
const roundLog = []

while (dry < 2 && round < 4) {
  round += 1
  const hunted = await parallel(
    HUNTS.map((h, i) => () =>
      agent(huntPrompt(h, round, i), {
        label: `hunt:r${round}:t${i + 1}`,
        phase: 'Dry-loop',
        schema: HUNT_SCHEMA,
      }).then((r) => {
        if (!r) deadAgents.push(`hunt:r${round}:t${i + 1}`)
        return r
      }),
    ),
  )

  const live = hunted.filter(Boolean)

  // A ROUND WHERE EVERY HUNTER DIED IS NOT A ROUND THAT FOUND NOTHING. Run 1 of this
  // lane reported "dry_rounds: 2" when all six hunters had been killed by a usage
  // limit — convergence declared because the agents stopped existing, not because
  // they stopped finding. Only a round that actually ran may count toward dryness.
  if (live.length === 0) {
    deadRounds += 1
    roundLog.push({ round, hunters_live: 0, new_claims: null, counted_as_dry: false,
                    note: 'ALL HUNTERS DIED — not a dry round' })
    log(`Dry-loop round ${round}: ALL ${HUNTS.length} HUNTERS DIED — NOT counted as dry. Aborting loop.`)
    break
  }

  const newThisRound = []
  for (const h of live) {
    for (const c of h.claims || []) {
      const key = `${(c.id || '').toLowerCase()}|${(c.cite || '').toLowerCase()}`
      if (seen.has(key)) continue
      seen.add(key)
      newThisRound.push({ ...c, unit: h.unit, origin: `dryloop-r${round}` })
    }
  }
  fresh.push(...newThisRound)

  // A round where only SOME hunters ran is a partial round. It may still count as dry
  // if it found nothing — but the shortfall is recorded, never smoothed over.
  const partial = live.length < HUNTS.length
  dry = newThisRound.length === 0 ? dry + 1 : 0
  roundLog.push({
    round, hunters_live: live.length, hunters_expected: HUNTS.length,
    new_claims: newThisRound.length, counted_as_dry: newThisRound.length === 0, partial,
    searched: live.map((h) => ({ unit: h.unit, searched: (h.searched || '').slice(0, 400) })),
  })
  log(`Dry-loop round ${round}: ${live.length}/${HUNTS.length} hunters returned, ` +
      `${newThisRound.length} new, dry streak ${dry}.`)
}

phase('Completeness')

const completeness = await agent(
  `${LAW}
${INDEX_BRIEF}

=== COMPLETENESS CRITIC — the final lens on lane L0 ===
Five stages have run: 12 system surveys, 10 source sweeps, ~50 blind critics, a judging
pass over 610 uncritiqued findings, and ${round} dry-loop round(s) of which ${dry} found
nothing new. YOUR ONLY JOB IS TO NAME WHAT IS STILL MISSING. Findings here become the
next round of work, so vagueness is worthless — be specific and cite.

Answer each, concretely:
 1. Which evidence source was never actually OPENED by anyone? Check every entry in
    ${IDX}/android_blobs.json and ${IDX}/bindata.json against
    ${OUT}/SEEN_CLAIM_IDS.txt and ${OUT}/sources/. Name files, not categories.
 2. Which of the 12 systems got a SHALLOW pass — few claims, thin cites, or claims that
    all rest on one file?
 3. Which surviving claim rests on a SINGLE cite that no second agent independently
    re-opened? Those are the ones most likely to be wrong and least likely to be caught.
 4. Which §6 "structurally unrecoverable" entry still lacks EITHER a kill-cite OR a
    pasted negative search? (Gate L0-E is binary on exactly this.)
 5. Is the ANDROID v0.682 / WEB v0.717 build-parity question settled per surface, or is
    the ledger about to inherit an unquantified risk? Name the surfaces still open.
 6. What did the four earlier runs structurally CANNOT have seen, given how they were
    decomposed — by system, then by source? What falls between both decompositions?

READ, do not assume: ${OUT}/SEEN_CLAIM_IDS.txt · ${OUT}/citelint.json (the machine cite
audit: which claims are BROKEN or QUOTE_UNVERIFIED) · ${OUT}/worklist/MANIFEST.json ·
${OUT}/sources/ · docs/research/REBUILD_READINESS.md.

Write to ${OUT}/critics/completeness${TAG}.md before you return.`,
  { label: 'completeness', phase: 'Completeness', schema: HUNT_SCHEMA },
)

if (!completeness) deadAgents.push('completeness')

// Convergence is only real if a round ACTUALLY RAN and found nothing, twice.
const converged = dry >= 2 && deadRounds === 0

return {
  rounds_run: round,
  dry_streak: dry,
  dead_rounds: deadRounds,
  converged,
  new_claims: fresh.length,
  dead_agents: deadAgents,
  round_log: roundLog,
  completeness_ran: Boolean(completeness),
  completeness_findings: completeness ? (completeness.claims || []).length : null,
  INTEGRITY: converged && deadAgents.length === 0 && completeness
    ? `CLEAN — ${round} rounds run, two consecutive rounds that ACTUALLY RAN found nothing new, ` +
      `0 agents died, completeness critic returned`
    : `INCOMPLETE — converged=${converged} (dry streak ${dry}, dead rounds ${deadRounds}) · ` +
      `${deadAgents.length} agents DIED (${deadAgents.join(', ') || 'none'})` +
      `${completeness ? '' : ' · COMPLETENESS CRITIC DID NOT RETURN'}. ` +
      `A round where agents died is NOT a round that found nothing and may not count toward ` +
      `convergence (§0). Gate L0-C stays RED until two rounds that ran come back empty.`,
  claims: fresh,
  completeness,
}
