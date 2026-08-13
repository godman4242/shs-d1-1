export const meta = {
  name: 'gauntlet-l0-resurvey',
  description: 'GAUNTLET L0: re-survey all 12 systems against the payload, two orthogonal sweeps, blind refuting critics',
  whenToUse: 'Run once, first, before any other gauntlet lane (GAUNTLET.md §2 ordering rule + R2).',
  phases: [
    { title: 'Sweep-A/System', detail: '12 surveyors, one per system, re-scored against the evidence index' },
    { title: 'Critics-A', detail: 'blind refuting critics: cite / hunter / precedence, + frame lens on visual systems' },
    { title: 'Sweep-B/Source', detail: '8 surveyors, one per evidence source — orthogonal decomposition' },
    { title: 'Critics-B', detail: 'blind refuting critics: cite / hunter' },
    { title: 'Dry-loop', detail: 'hunters re-sweep until two consecutive rounds surface nothing new' },
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
Say so out loud, in the finding, whenever it happens.

DO NOT MODIFY ANY FILE outside your assigned journal path. This lane touches no
source code. src/core/Sim.ts and tests/duel-baseline.test.ts are NO-TOUCH (§4).
`

const INDEX_BRIEF = `
=== YOUR EVIDENCE INDEX (built by script, Stage 0 — trust it over hand-counting) ===
${IDX}/questdata.json      tag-paths, value domains, first line numbers
${IDX}/skilldata.json      "
${IDX}/npcdata.json        "
${IDX}/itemdata.json       "
${IDX}/bindata.json        all 27 bindata files IDENTIFIED (see below)
${IDX}/ui_strings.json     UI fields + embedded font faces
${IDX}/frames.json         reference/frames manifest by directory (7,381 files)
${IDX}/actionscript.json   2,768 classes across 8 decompiled bundles
${IDX}/payload_histogram.json  streamed tag histogram of the 329 MB payload.xml

Counts already VERIFIED first-hand this run — do not re-derive, do not contradict
without a pasted command showing otherwise:
  questdata.xml  61 <quest> · 2771 <dialogue> · 3307 <text> · 471 <choice> · 196 <option>
                 · 55 <cutscene> · 118 <wave> · 225 <step>
  skilldata.xml  75 <skill> · 182 <level> · 182 <chi> · 182 <cooldown>
  npcdata.xml    495 <npc> · 425 <ai> · 647 <skill>
  itemdata.xml   982 <item> · 550 <baseprice> · 412 <modifier> · 371 <defense>

STAGE-0 FINDING S0-1 (already banked, docs/gauntlet/L0/journal.md): GAUNTLET.md
§2.1 was WRONG that bindata/ was unsurveyed. All 27 files are now identified:
  100-118 (19 files) = <animdata>, 19 animation sets incl. light/balanced/heavy/
          reversed/dual_stance, mining, and 10 creature idles (ogre bear horse zom
          deer guardian wolf spider gob boar)
  119 = <survivalmodedata> — an ENTIRE GAME MODE absent from all 12 ledger systems
  93  = room-object defs (Obj_FloorSwitch, Obj_Lever, x, trigger properties)
  94,95,96,97,98 = five name-generator tables (male / court / clan / female / place)
  92  = GIF89a 63x72 raster
STAGE-0 FINDING S0-2: the game font is CLOSED. reference/extracted/ui_strings.txt:100
  contains face="Edo SZ" (and :182 face="Calibri"). REBUILD_READINESS.md §2 lists
  "font (unidentified)" as an open art-anim blocker. It is no longer open.

KNOWN BLOCKER (GAUNTLET.md §2.1): item/skill/npc <name>, <desc>, <displayname> and
cutscene <param> are NUMERIC IDS indexing a string table NOT YET LOCATED.
ui_strings.txt is NOT it. bindata/ is now EXHAUSTED as a candidate. So numbers are
portable today; NAMES ARE NOT. Never claim a name is held unless you found the table.
`

const SYSTEMS = [
  { key: 'combat-core', score: 42, visual: true },
  { key: 'skills-meters', score: 33, visual: false },
  { key: 'progression', score: 55, visual: false },
  { key: 'rebirth-elements', score: 30, visual: false },
  { key: 'items-equipment', score: 42, visual: true },
  { key: 'economy', score: 48, visual: false },
  { key: 'enemies-ai', score: 34, visual: true },
  { key: 'world-exploration', score: 35, visual: false },
  { key: 'quests-story', score: 42, visual: false },
  { key: 'ui-hud', score: 57, visual: true },
  { key: 'art-anim-audio-feel', score: 56, visual: true },
  { key: 'meta-social', score: 31, visual: false },
]

const SOURCES = [
  { key: 'questdata', brief: 'reference/extracted/questdata.xml (796 K) — quests, steps, dialogue, choices, cutscene direction, waves' },
  { key: 'skilldata', brief: 'reference/extracted/skilldata.xml (37 K) — 75 skills x 182 level rows, chi/cooldown/value/required' },
  { key: 'npcdata', brief: 'reference/extracted/npcdata.xml (219 K) — 495 NPCs, mcs paperdoll slots, ai, lvl, hp, attack, defense, reward/loot' },
  { key: 'itemdata', brief: 'reference/extracted/itemdata.xml (173 K) — 982 items, type, baseprice, weight, modifiers, defense, unique, heavenlyprice' },
  { key: 'bindata', brief: 'reference/extracted/bindata/ — all 27 files (19 animdata, survivalmodedata, room objects, 5 name tables, 1 GIF). READ THEM.' },
  { key: 'actionscript', brief: 'reference/decompiled/**/*.as — 2,768 classes, 8 bundles; shs3_payload has 1,079 files. The string table may be here.' },
  { key: 'frames', brief: 'reference/frames/ — 7,381 stills. A1 territory. Crop+upscale before grading anything.' },
  { key: 'uistrings-payload', brief: 'reference/extracted/ui_strings.txt (471 fields) + payload.xml tag histogram (329 MB, indexed)' },
]

const CLAIM_SCHEMA = {
  type: 'object',
  required: ['id', 'text', 'artifact_class', 'cite', 'verdict'],
  properties: {
    id: { type: 'string', description: 'stable slug, e.g. combat-core/reach-cap' },
    text: { type: 'string', description: 'the claim, one sentence' },
    artifact_class: { type: 'string', enum: ['A1', 'A2', 'A3', 'A4', 'A5', 'STILL_UNHELD'] },
    cite: { type: 'string', description: 'file:line, frame path + crop, test name, or ledger §. Empty ONLY if STILL_UNHELD.' },
    quote: { type: 'string', description: 'the verbatim line/row, or what is visibly in the crop' },
    verdict: { type: 'string', enum: ['HELD', 'PARTIAL', 'STILL_UNHELD'] },
    overturns_ledger: { type: 'boolean', description: 'true if this disproves a REBUILD_READINESS.md claim' },
    ledger_text: { type: 'string', description: 'the exact ledger sentence this overturns, quoted' },
    lane_impact: { type: 'string', description: 'which gauntlet lane (L1..L11) this changes, and how' },
  },
}

const SURVEY_SCHEMA = {
  type: 'object',
  required: ['unit', 'claims', 'journal_path'],
  properties: {
    unit: { type: 'string' },
    new_score: { type: 'integer', description: '0-100 re-score; only for system sweeps' },
    score_rationale: { type: 'string' },
    claims: { type: 'array', items: CLAIM_SCHEMA },
    journal_path: { type: 'string' },
  },
}

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
      items: CLAIM_SCHEMA,
      description: 'anything you found the surveyor missed',
    },
  },
}

function surveyorPrompt(unit, brief, mode) {
  return `${LAW}
${INDEX_BRIEF}

=== YOUR JOB ===
You are a ${mode} surveyor. Your unit: **${unit}**.
${brief}

The document under audit is ${REPO}/docs/research/REBUILD_READINESS.md (2026-07-20,
avg score ~42). It was written BEFORE the payload was extracted and was never
reconciled with it. Your job is to find where it is WRONG — in BOTH directions:

  OVER-CLAIM  it says we have something we do not.
  UNDER-CLAIM it says something is "unrecoverable" / "captured NOWHERE" /
              "absent" / a "blocker" when the payload or the frames HOLD IT.
              §6 "structurally UNRECOVERABLE" is the highest-value target in the
              whole document: it currently lists "Verbatim dialogue ... the actual
              script is gone" while 3,307 verbatim <text> lines sit on disk.

METHOD
1. Read the index JSON for your unit FIRST. It is authoritative on counts.
2. Then open the actual files and READ THEM. Quote real lines with real line numbers.
3. For each claim: assign an artifact class, a cite, and a verbatim quote.
4. If the ledger says X and the evidence says not-X, set overturns_ledger=true and
   quote the exact ledger sentence in ledger_text.
5. Where a frame and a doc disagree, THE FRAME WINS — say so in the claim text.
6. Anything you cannot ground: artifact_class=STILL_UNHELD, verdict=STILL_UNHELD.
   You are graded on HONESTY, not on volume of HELD claims.

WRITE YOUR RESULT TO DISK BEFORE YOU RETURN — this run must survive a crash:
  ${OUT}/${mode === 'system' ? 'systems' : 'sources'}/${unit}.md
Include every claim with its cite and quote. Then return the structured object,
setting journal_path to that file.

Aim for 8-20 claims. Depth over breadth. A single overturned §6 line is worth
more than ten restatements of things the ledger already knows.`
}

function criticPrompt(lens, unitLabel, surveyJson) {
  const lenses = {
    cite: `LENS 1 — THE CITE LENS. You hunt OVER-CLAIMING.
For every claim: OPEN THE CITED ARTIFACT YOURSELF. Does the file exist? Is the line
number right? Does the quoted text actually appear there? Does it actually SAY what
the claim says it says, or is the claim an inference dressed as a citation?
A claim whose cite does not resolve is REFUTED, full stop.
A claim citing a NAME as held when only a numeric ID exists is REFUTED (§2.1).`,
    hunter: `LENS 2 — THE HUNTER LENS. You hunt UNDER-CLAIMING, which is the failure
this whole lane exists to fix. For every claim marked STILL_UNHELD or PARTIAL: go
try to FIND IT. Search the other payload files, the 27 bindata files, the 2,768
decompiled AS3 classes, the frames manifest. If you find it, the STILL_UNHELD
verdict is REFUTED and you supply the cite in new_findings.
Refuting a "we don't have it" is the most valuable thing you can do here.`,
    precedence: `LENS 3 — THE PRECEDENCE LENS. You hunt STALE-claiming.
This repo has been burned twice by trusting a superseded document:
  - COMBAT_MEASUREMENTS.md §S24-H "Verify-pass corrections" WINS over the raw §S24 rows.
  - REBUILD_READINESS.md §3 item 1 ("movement is HOLD-mouse-to-run per Tip #27") was
    REVERSED by measurement on 2026-07-25 and was never actually sourced.
So: does this claim import a doc statement that a later measurement, ruling, or frame
overturned? Does it cite a doc where a FRAME exists that would settle it directly?
Citing a measurement doc second-hand when a frame exists is REFUTED by §0.`,
    frame: `LENS 4 — THE FRAME LENS. This unit is VISUAL. §0's standing invariant is
THE FRAME WINS over any measurement doc. For every visual claim: does a frame exist
under reference/frames/ that settles it? Use ${IDX}/frames.json to locate candidates,
then ACTUALLY OPEN THE IMAGE, crop to the region, and upscale — the fighter is ~270 px
tall in a 1080p frame. State your crop.
REFUTE any visual claim that was graded from a document while a frame was available.
This is the exact SESSION 18 A4-D failure (a bare doll graded as a clothed fighter)
and it is why this lens exists.`,
  }

  return `${LAW}
${INDEX_BRIEF}

=== YOU ARE A BLIND CRITIC ===
You did NOT see the surveyor's reasoning and you never will — only its output, below,
and the artifacts themselves. YOUR JOB IS TO REFUTE. Default to refuted=true when
uncertain. A claim survives only if you personally opened an artifact and it held up.

You must supply own_cite for EVERY verdict: the artifact YOU opened. A verdict
without own_cite is VOID under §0 and will be discarded — costing your whole review.
Do not mark something refuted for being merely incomplete; refute it for being WRONG,
UNGROUNDED, or MIS-CITED. Over-refuting honest STILL_UNHELD answers is also a failure.

${lenses[lens]}

=== THE OUTPUT UNDER REVIEW (unit: ${unitLabel}) ===
${surveyJson}

Write your review to ${OUT}/critics/${unitLabel}.${lens}.md before returning.`
}

// ---------------------------------------------------------------------------

phase('Sweep-A/System')
log(`L0 armed: ${SYSTEMS.length} systems x (1 surveyor + 3-4 blind critics), then ${SOURCES.length} orthogonal source sweeps.`)

const seen = new Set()
const confirmed = []
const allClaims = []

function keyOf(c) {
  return `${(c.id || '').toLowerCase()}|${(c.cite || '').toLowerCase()}`
}

function harvest(survey, critiques) {
  if (!survey || !survey.claims) return
  const kills = new Map()
  for (const cr of critiques.filter(Boolean)) {
    for (const v of cr.verdicts || []) {
      if (!v.own_cite || !v.own_cite.trim()) continue // VOID under §0
      if (!v.refuted) continue
      kills.set(v.claim_id, (kills.get(v.claim_id) || 0) + 1)
    }
    for (const nf of cr.new_findings || []) {
      allClaims.push({ ...nf, unit: survey.unit, origin: 'critic' })
    }
  }
  const threshold = critiques.filter(Boolean).length >= 3 ? 2 : 1
  for (const c of survey.claims) {
    allClaims.push({ ...c, unit: survey.unit, origin: 'surveyor' })
    if ((kills.get(c.id) || 0) >= threshold) continue
    confirmed.push({ ...c, unit: survey.unit, new_score: survey.new_score })
  }
}

const sweepA = await pipeline(
  SYSTEMS,
  (sys) =>
    agent(
      surveyorPrompt(
        sys.key,
        `This system currently scores ${sys.score}/100 in REBUILD_READINESS.md §2, and §4 has a "### ${sys.key} — ${sys.score}" block with Ready / Blockers / Surface bullets. Audit every bullet in that block.`,
        'system',
      ),
      { label: `survey:${sys.key}`, phase: 'Sweep-A/System', schema: SURVEY_SCHEMA },
    ),
  (survey, sys) => {
    if (!survey) return null
    const lenses = sys.visual ? ['cite', 'hunter', 'precedence', 'frame'] : ['cite', 'hunter', 'precedence']
    const json = JSON.stringify(survey, null, 1)
    return parallel(
      lenses.map((lens) => () =>
        agent(criticPrompt(lens, sys.key, json), {
          label: `critic:${sys.key}:${lens}`,
          phase: 'Critics-A',
          schema: CRITIC_SCHEMA,
        }),
      ),
    ).then((critiques) => {
      harvest(survey, critiques)
      return { survey, critiques }
    })
  },
)

log(`Sweep-A done: ${allClaims.length} claims seen, ${confirmed.length} survived the critics.`)
for (const c of allClaims) seen.add(keyOf(c))

phase('Sweep-B/Source')

const sweepB = await pipeline(
  SOURCES,
  (src) =>
    agent(
      surveyorPrompt(
        src.key,
        `${src.brief}

You are the ORTHOGONAL sweep. A parallel set of agents is auditing by SYSTEM
(combat-core, ui-hud, ...). You audit by SOURCE. Your value is finding what a
system-siloed reader structurally CANNOT see: facts that sit between systems, or in
a file nobody thought to open for that system. Read your source EXHAUSTIVELY and
report everything of consequence, then map each finding onto whichever of the 12
systems it lands in (combat-core, skills-meters, progression, rebirth-elements,
items-equipment, economy, enemies-ai, world-exploration, quests-story, ui-hud,
art-anim-audio-feel, meta-social) via lane_impact.`,
        'source',
      ),
      { label: `source:${src.key}`, phase: 'Sweep-B/Source', schema: SURVEY_SCHEMA },
    ),
  (survey, src) => {
    if (!survey) return null
    const json = JSON.stringify(survey, null, 1)
    return parallel(
      ['cite', 'hunter'].map((lens) => () =>
        agent(criticPrompt(lens, `src-${src.key}`, json), {
          label: `critic:${src.key}:${lens}`,
          phase: 'Critics-B',
          schema: CRITIC_SCHEMA,
        }),
      ),
    ).then((critiques) => {
      harvest(survey, critiques)
      return { survey, critiques }
    })
  },
)

log(`Sweep-B done: ${allClaims.length} claims total, ${confirmed.length} confirmed.`)
for (const c of allClaims) seen.add(keyOf(c))

phase('Dry-loop')

let dry = 0
let round = 0
const HUNTS = [
  'the §6 "structurally UNRECOVERABLE" list — attack every one of its six entries; each must be DELETED with a cite or KEPT with a pasted negative search across payload + bindata + decompiled + frames',
  'the string table (§2.1) — item/skill/npc names are numeric IDs. bindata is exhausted. Hunt reference/decompiled/**/*.as and payload.xml. Report ABSENT with pasted negative searches if truly absent.',
  'anything held in the payload that NO system-surveyor and NO source-surveyor claimed — survival mode, room objects, name tables, the 19 animation sets, loot/reward tables, startcondition/comp operators',
]

while (dry < 2 && round < 4) {
  round += 1
  const seenList = [...seen].slice(0, 400).join('\n')
  const hunted = await parallel(
    HUNTS.map((h, i) => () =>
      agent(
        `${LAW}\n${INDEX_BRIEF}

=== DRY-LOOP HUNTER, round ${round}, target ${i + 1} ===
Find what the previous rounds MISSED. Your target:
${h}

ALREADY SEEN (do not re-report these; id|cite pairs):
${seenList}

Report ONLY genuinely new, artifact-cited findings. If you find nothing new, return
an empty claims array — that is a correct and useful answer, and two consecutive
empty rounds end this loop. Do not pad.
Write to ${OUT}/critics/dryloop-r${round}-t${i + 1}.md before returning.`,
        { label: `hunt:r${round}:t${i + 1}`, phase: 'Dry-loop', schema: SURVEY_SCHEMA },
      ),
    ),
  )

  const fresh = []
  for (const h of hunted.filter(Boolean)) {
    for (const c of h.claims || []) {
      if (seen.has(keyOf(c))) continue
      seen.add(keyOf(c))
      fresh.push({ ...c, unit: h.unit, origin: `dryloop-r${round}` })
    }
  }
  allClaims.push(...fresh)
  confirmed.push(...fresh)
  log(`Dry-loop round ${round}: ${fresh.length} new (dry streak ${fresh.length === 0 ? dry + 1 : 0}).`)
  dry = fresh.length === 0 ? dry + 1 : 0
}

phase('Completeness')

const completeness = await agent(
  `${LAW}\n${INDEX_BRIEF}

=== COMPLETENESS CRITIC — the final lens ===
${confirmed.length} claims survived across 12 system sweeps, 8 source sweeps and
${round} dry-loop rounds. Your ONLY job is to name what is still missing:
  - which evidence source was never actually opened by anyone?
  - which of the 12 systems got a shallow pass?
  - which surviving claim is still unverified, or rests on a single cite that
    nobody independently re-opened?
  - which §6 "unrecoverable" entry still lacks either a kill-cite or a pasted
    negative search?
Be specific and cite. Findings here become the next round of work, so vagueness is
worthless. Write to ${OUT}/critics/completeness.md before returning.

THE SURVIVING CLAIM SET:
${JSON.stringify(confirmed.map((c) => ({ id: c.id, unit: c.unit, verdict: c.verdict, cite: c.cite, overturns: c.overturns_ledger })), null, 1)}`,
  { label: 'completeness', phase: 'Completeness', schema: CRITIC_SCHEMA },
)

return {
  seen_count: seen.size,
  claims_total: allClaims.length,
  confirmed_count: confirmed.length,
  dry_rounds: round,
  overturns: confirmed.filter((c) => c.overturns_ledger).length,
  systems: sweepA.filter(Boolean).map((r) => ({ unit: r.survey.unit, new_score: r.survey.new_score })),
  sources: sweepB.filter(Boolean).map((r) => r.survey.unit),
  confirmed,
  completeness,
}
