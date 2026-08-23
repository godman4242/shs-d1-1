export const meta = {
  name: 'gauntlet-l0-finish-wf3',
  description: 'GAUNTLET L0 finish, run 3: judge the 610 uncritiqued critic new_findings, batched by tier',
  whenToUse: 'After WF-2. Pass args "t1" (203 overturn-claimers, cite+hunter) or "t2" (407 corroborating, cite).',
  phases: [
    { title: 'Judge', detail: 'blind refuting critics over batched findings — never one agent per finding' },
  ],
}

const REPO = '/Users/kheshav/kheshav-code/SSHD 1-1'
const IDX = `${REPO}/docs/gauntlet/L0/index`
const OUT = `${REPO}/docs/gauntlet/L0`
const WORK = `${OUT}/worklist`

// Two tiers, differing in DEPTH and never in coverage. Every one of the 610 unjudged
// critic findings sits in exactly one batch: §0 gives no third option, and a claim
// nobody judges is a lead forever.
const TIERS = {
  t1: {
    prefix: 't1-overturns',
    batches: 9,
    lenses: ['cite', 'hunter', 'contradiction'],
    what: 'CLAIMS A LEDGER OVERTURN — surviving, it REWRITES REBUILD_READINESS.md',
  },
  t2: {
    prefix: 't2-corroborating',
    batches: 9,
    lenses: ['cite'],
    what: 'claims no overturn — surviving, it only CORROBORATES an existing finding',
  },
}

const tierKey = (typeof args === 'string' ? args : args?.tier) || 't1'
const TIER = TIERS[tierKey]
if (!TIER) throw new Error(`unknown tier "${tierKey}" — expected t1 or t2`)

// The batch count MOVES between runs: every stage adds new critic findings, so
// buildWorklist emits more packets each time. Passing it in beats a literal that
// silently drops the tail batches — and dropping a batch means those findings stay
// UNJUDGED, which under §0 kills them.
const batchCount = (typeof args === 'object' && args?.batches) || TIER.batches

// A run-unique suffix for every review filename. buildWorklist RENUMBERS batches on every
// build — judged findings drop out, new ones arrive — so `t1-overturns-01` names a
// different claim set each run. Without a tag the filename collides and a later run's
// partial work silently overwrites an earlier run's committed review. That happened at
// wall #8; git had the originals, but only by luck.
const TAG = (typeof args === 'object' && args?.tag) ? `.${args.tag}` : ''

// ⛔ WALL INSURANCE. Eight usage walls have hit this lane. Prose alone is NOT enough:
// at wall #8 seven finished reviews sat on disk as .md while the journals held zero
// result records, so the STRUCTURED VERDICTS were destroyed — and §3.2 bars a blind
// re-judge from reading another agent's prose, so they could not be recovered from it.
// Every agent now writes the exact object it is about to return, as JSON, next to its
// prose. scripts/gauntlet/salvageJournal.py --critic-json extracts those even when the
// run returns nothing at all.
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
  CORRECT answer. Guessing is not. Never invent a cite.

STANDING INVARIANT: when a measurement doc and a frame DISAGREE, THE FRAME WINS.
Say so out loud whenever it happens.

⚠ YOUR OWN CITE IS MACHINE-CHECKED. scripts/gauntlet/citeLint.py opens every path you
name and checks every line number against the file's real length. Cite paths RELATIVE
TO THE REPO ROOT. Cite LINE NUMBERS, never record/entry IDs — "strings.json:6143"
already killed two claims this lane, because strings.json has 2,535 lines and 6143 was
a string ID. Write ID lookups as strings.json["6143"].

DO NOT MODIFY ANY FILE outside your assigned journal path. This lane touches no source
code. src/core/Sim.ts and tests/duel-baseline.test.ts are NO-TOUCH (§4).
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
  skilldata.xml  75 <skill> · 182 <level> · 182 <chi> · 182 <cooldown>
  npcdata.xml    495 <npc> · 425 <ai> · 647 <skill>
  itemdata.xml   982 <item> · 550 <baseprice> · 412 <modifier> · 371 <defense>

⛔ S0-3 — THE §2.1 STRING-TABLE BLOCKER IS DEAD. Any claim asserting item/skill/npc
names are unresolvable numeric IDs is auto-REFUTED. 118_Mobile_Lang_EN.bin is a
UTF-16LE XLIFF table, 2,533 entries, already parsed into ${IDX}/strings.json and
resolved_names.json. Measured: itemdata 804/0 · skilldata 73/0 · npcdata 484/6.
  ⚠ CAVEAT: ANDROID build v0.682 (shs3_android/scripts/StatsManager.as:30) vs the web
  build's v0.717. Data-XML row counts match exactly; UI copy and combat tuning parity
  is NOT established. A claim resting on an Android string while asserting WEB
  behaviour has a real build-parity hole.
S0-1: all 27 web bindata files identified — 100-118 <animdata>, 119 <survivalmodedata>
  (a whole game mode absent from all 12 ledger systems), 93 room objects, 94-98 name
  tables, 92 a GIF.
S0-2: the game font is CLOSED — ui_strings.txt:100 face="Edo SZ", :182 face="Calibri".
S0-4: <anim> over the 18 MCSCharacter_* Android blobs = 471 (measured 2026-08-20), not
  the board's "~150". 99_HumanAnimationData alone = 158.
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

const CRITIC_SCHEMA = {
  type: 'object',
  required: ['verdicts', 'judged_count', 'packet_size'],
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
          overturn_upheld: {
            type: 'boolean',
            description: 'ONLY for a claim with overturns_ledger=true: does the ledger sentence it names really fall? A claim can be TRUE and still not overturn what it points at.',
          },
        },
      },
    },
    new_findings: {
      type: 'array',
      description: 'anything you found while judging that nobody has claimed',
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
    skipped: { type: 'array', items: { type: 'string' }, description: 'ids you did NOT judge, and there must be none' },
  },
}

const LENSES = {
  cite: `LENS 1 — THE CITE LENS. You hunt OVER-CLAIMING.
For every finding: OPEN THE CITED ARTIFACT YOURSELF. Does the file exist? Is the line
number right? Does the quoted text actually appear there? Does it actually SAY what the
finding says it says, or is it an inference dressed as a citation?
A finding whose cite does not resolve is REFUTED, full stop.

START WITH THE MACHINE AUDIT — every claim carries a "citelint" field:
  BROKEN            a path is absent or a line is past end-of-file. Already proven
                    wrong mechanically — confirm and refute, do not re-litigate.
  QUOTE_UNVERIFIED  paths and lines are fine, but the quoted text could not be located
                    in any cited file. THESE ARE YOUR PRIORITY. Either you find the
                    quote (and it survives) or you have caught a real one.
  RESOLVES          mechanically clean. Your job is the part a script cannot do: does
                    the artifact SAY what the claim says it says?`,

  contradiction: `LENS 3 — THE CONTRADICTION LENS. You hunt findings that FIGHT EACH OTHER.

This is the one gap the other two lenses structurally cannot close. Every one of the
1,600 banked findings was judged ALONE: "is this true, and does it overturn what it
names?" NOBODY has ever asked whether two findings that both survived can both be true.
That question only becomes expensive later — the rewrite packets carry 1,309 usable
findings, and where two of them disagree a writer picks one ARBITRARILY and the ledger
inherits a coin flip presented as evidence.

Your corpus is docs/gauntlet/L0/LEDGER_EVIDENCE.md (every surviving finding, grouped) and
docs/gauntlet/L0/SEEN_CLAIM_IDS.txt. For every finding in YOUR packet:

(a) FIND ITS NEIGHBOURS. Which already-UPHELD findings speak to the same number, file,
    symbol, frame or ledger sentence? Search by the artifact it cites, not by its words —
    two findings can contradict while sharing no vocabulary at all.

(b) CAN BOTH BE TRUE? If not, ONE OF THEM IS WRONG and you must say which, with your own
    artifact. Do not split the difference and do not report "these are in tension" — that
    is a lead, and §0 does not admit leads. Open the artifact and settle it.

(c) THE BUILD-PARITY TRAP is the most likely source of a false contradiction, so check it
    before declaring one: C2 is UNDISCHARGED. A value measured in the ANDROID v0.682 blobs
    and a different value measured in the WEB v0.717 payload DO NOT contradict — they are
    two builds, and the finding that fails to LABEL its build is the defective one. Say so
    and name the build each side belongs to.

(d) AND CHECK IT AGAINST THE STAGE-0 CORRECTIONS ABOVE. A finding that assumes a
    universal XOR key of 109, or that all 42 blobs are UTF-16LE, or that the audio is
    unrecoverable, contradicts C1/C3 and is REFUTED on that ground alone.

A finding that survives your lens with no live contradiction is a finding the rewrite can
build on. Record what you compared it against — an empty result is only credible if that
list is full.`,

  hunter: `LENS 2 — THE HUNTER LENS. You hunt UNDER-CLAIMING and OVERSTATED IMPACT.
Two distinct jobs, both mandatory:

(a) For every finding marked STILL_UNHELD or PARTIAL: GO TRY TO FIND IT. Search the
    other payload files, the 27 web bindata files, the 42 Android blobs, the 2,768
    decompiled AS3 classes, the string table, the frames manifest. If you find it, the
    STILL_UNHELD verdict is REFUTED and you supply the cite in new_findings.

(b) THE OVERTURN CHECK, which is why this tier exists. Every finding here asserts it
    overturns a specific REBUILD_READINESS.md sentence, quoted in its ledger_text.
    OPEN docs/research/REBUILD_READINESS.md AND READ THAT SENTENCE IN ITS CONTEXT.
    Then ask: does the evidence actually make THAT sentence false?
    A finding can be perfectly TRUE and still not overturn what it points at — it may
    answer a neighbouring question, or restate something the ledger already concedes
    two lines later, or overturn a weaker version of the sentence than the one written.
    Set overturn_upheld=false in that case and say exactly what the sentence still
    claims that survives. Refuting an inflated overturn is as valuable as refuting a
    false claim: 203 claimed overturns are about to rewrite that document.`,
}

function judgePrompt(batch, lens) {
  return `${LAW}
${INDEX_BRIEF}

=== YOU ARE A BLIND CRITIC ===
Your packet: ${WORK}/${batch}.json
READ IT FIRST. It holds structured findings, joined to the machine cite audit.

These findings were produced by OTHER CRITICS while reviewing earlier surveys. Nobody
has ever judged them, so under §0 every one of them is a LEAD and none may enter the
ledger until you rule. Each one ${TIER.what}.

⛔ You see the finding and the ARTIFACTS. You do not see, and must not seek out, the
reasoning that produced it (§3.2). Do not open ${OUT}/critics/*.md or
${OUT}/sources/*.md — those are other agents' prose, and judging an argument instead
of evidence is exactly how a wrong claim survives.

⛔ DO NOT RE-SURVEY. These findings already exist. You judge them.

YOUR JOB IS TO REFUTE. Default to refuted=true when uncertain. A finding survives only
if you personally opened an artifact and it held up. You must supply own_cite for EVERY
verdict: the artifact YOU opened. A verdict without own_cite is VOID under §0 and is
discarded — costing your whole review.

Do not refute something for being merely incomplete; refute it for being WRONG,
UNGROUNDED, or MIS-CITED. Over-refuting honest STILL_UNHELD answers is also a failure.

JUDGE EVERY FINDING IN THE PACKET. A finding you skip stays UNJUDGED, and under §0 an
unjudged claim is a LEAD that may never enter the ledger — so a skipped finding is a
finding destroyed. Set judged_count and packet_size honestly and leave the skipped list empty;
if you genuinely could not rule on one, name it there and say why. NO SILENT CAPS (§3).

${LENSES[lens]}

${writeBack(`${OUT}/critics/${batch}.${lens}${TAG}`)}`
}

// ---------------------------------------------------------------------------

const BATCHES = Array.from({ length: batchCount }, (_, i) =>
  `${TIER.prefix}-${String(i + 1).padStart(2, '0')}`)

phase('Judge')
log(`WF-3 tier ${tierKey}: ${BATCHES.length} batches x ${TIER.lenses.length} lens(es) = ` +
    `${BATCHES.length * TIER.lenses.length} agents. Batched, never one agent per finding.`)

const deadAgents = []
const reviews = []

const results = await parallel(
  BATCHES.flatMap((batch) =>
    TIER.lenses.map((lens) => () =>
      agent(judgePrompt(batch, lens), {
        label: `judge:${batch}:${lens}`,
        phase: 'Judge',
        schema: CRITIC_SCHEMA,
      }).then((r) => {
        if (!r) deadAgents.push(`judge:${batch}:${lens}`)
        else reviews.push({ batch, lens, review: r })
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

// A batch whose critics ALL died is not a batch that was judged clean. Fail closed.
const judgedBatches = new Set(reviews.map((r) => r.batch))
const unjudgedBatches = BATCHES.filter((b) => !judgedBatches.has(b))

const coverage = reviews.map((r) => ({
  batch: r.batch,
  lens: r.lens,
  judged: r.review.judged_count ?? null,
  packet: r.review.packet_size ?? null,
  skipped: r.review.skipped || [],
  verdicts: (r.review.verdicts || []).length,
  new_findings: (r.review.new_findings || []).length,
}))
const shortfalls = coverage.filter(
  (c) => (c.judged !== null && c.packet !== null && c.judged < c.packet) || c.skipped.length > 0)

const overturnRulings = liveVerdicts.filter((v) => v.overturn_upheld !== undefined)

log(`WF-3 ${tierKey} done: ${live.length}/${BATCHES.length * TIER.lenses.length} critics returned · ` +
    `${liveVerdicts.length} live verdicts · ${verdicts.length - liveVerdicts.length} VOID · ` +
    `${newFindings.length} new findings · ${deadAgents.length} agents died.`)

const clean = deadAgents.length === 0 && unjudgedBatches.length === 0 && shortfalls.length === 0

return {
  tier: tierKey,
  critics_run: live.length,
  critics_expected: BATCHES.length * TIER.lenses.length,
  verdicts_total: verdicts.length,
  verdicts_live: liveVerdicts.length,
  verdicts_void: verdicts.length - liveVerdicts.length,
  refuted_count: liveVerdicts.filter((v) => v.refuted).length,
  overturns_ruled_on: overturnRulings.length,
  overturns_upheld: overturnRulings.filter((v) => v.overturn_upheld).length,
  overturns_rejected: overturnRulings.filter((v) => v.overturn_upheld === false).length,
  new_findings_count: newFindings.length,
  dead_agents: deadAgents,
  unjudged_batches: unjudgedBatches,
  coverage,
  shortfalls,
  INTEGRITY: clean
    ? `CLEAN — all ${BATCHES.length * TIER.lenses.length} critics returned, every packet fully judged, ` +
      `0 agents died, 0 VOID verdicts`
    : `INCOMPLETE — ${live.length}/${BATCHES.length * TIER.lenses.length} critics returned · batches with ` +
      `NO live critic: [${unjudgedBatches.join(', ') || 'none'}] · packets only partly judged: ` +
      `[${shortfalls.map((s) => `${s.batch}:${s.lens} ${s.judged}/${s.packet}`).join(', ') || 'none'}] · ` +
      `${deadAgents.length} agents DIED (${deadAgents.join(', ') || 'none'}). ` +
      `Zero live critics means UNJUDGED, never confirmed (§0). A stage where agents died is NOT a ` +
      `stage that found nothing, and may not count toward convergence.`,
  verdicts: liveVerdicts,
  void_verdicts: verdicts.filter((v) => !(v.own_cite || '').trim()),
  new_findings: newFindings,
}
