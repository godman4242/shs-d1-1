export const meta = {
  name: 'gauntlet-l0-finish-wf1',
  description: 'GAUNTLET L0 finish, run 1 of 4: the 4 source surveys that never ran, each with 2 blind refuting critics',
  whenToUse: 'After 4 checkpointed L0 runs. Runs ONLY what never executed; reads the on-disk state for everything else.',
  phases: [
    { title: 'Surveys', detail: 'android-blobs, string-table, frames, uistrings-payload — never opened by any agent' },
    { title: 'Critics', detail: 'blind refuting critics per survey: cite + hunter' },
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

⚠ YOUR CITE IS MACHINE-CHECKED. scripts/gauntlet/citeLint.py opens every path you
name, checks every line number against the file's real length, and looks for your
quote inside the file. A path that does not exist, or a line past end-of-file, is
BROKEN and auto-REFUTED under §0. Cite paths RELATIVE TO THE REPO ROOT
(reference/..., src/..., docs/...). Cite LINE NUMBERS, never record/entry IDs —
"strings.json:6143" already killed two claims this lane, because strings.json has
2,535 lines and 6143 was a string ID. Write ID lookups as strings.json["6143"].

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
${IDX}/android_blobs.json  the 42 CLASS-NAMED Android blobs, with tag histograms
${IDX}/strings.json        the STRING TABLE, 2,533 entries, already parsed
${IDX}/resolved_names.json item/skill/npc id -> name + desc, already resolved
${IDX}/payload_histogram.json  streamed tag histogram of the 329 MB payload.xml

Counts already VERIFIED first-hand — do not re-derive, do not contradict without a
pasted command showing otherwise:
  questdata.xml  61 <quest> · 2771 <dialogue> · 3307 <text> · 471 <choice> · 196 <option>
                 · 55 <cutscene> · 118 <wave> · 225 <step>
  skilldata.xml  75 <skill> · 182 <level> · 182 <chi> · 182 <cooldown>
  npcdata.xml    495 <npc> · 425 <ai> · 647 <skill>
  itemdata.xml   982 <item> · 550 <baseprice> · 412 <modifier> · 371 <defense>

STAGE-0 FINDING S0-1: all 27 web bindata files are identified. 100-118 (19 files) =
  <animdata>; 119 = <survivalmodedata> (an ENTIRE GAME MODE absent from all 12 ledger
  systems); 93 = room-object defs; 94-98 = five name-generator tables; 92 = a GIF.
STAGE-0 FINDING S0-2: the game font is CLOSED — ui_strings.txt:100 has face="Edo SZ"
  (and :182 face="Calibri"). REBUILD_READINESS.md §2's "font (unidentified)" is dead.

STAGE-0b FINDING S0-3 — ⛔ THE §2.1 STRING-TABLE BLOCKER IS DEAD. DO NOT REPEAT IT.
GAUNTLET.md §2.1 says item/skill/npc names are unresolvable numeric IDs. THAT IS NOW
FALSE and any claim asserting it is auto-REFUTED. The table was found and verified:
  reference/decrypted/shs3_android_payload_decoded.swf holds 42 CLASS-NAMED
  DefineBinaryData blobs (the web payload's 27 are anonymous). Exported to
  reference/extracted/android/. 118_Mobile_Lang_EN.bin is a UTF-16LE XLIFF string
  table, 2,533 resolvable entries.
  MEASURED resolution: itemdata 804 rows / 0 unresolved · skilldata 73 / 0 ·
  npcdata 484 / 6 (all one missing id, 5017).
  ALREADY RESOLVED FOR YOU, do not re-parse: ${IDX}/strings.json (resname -> text)
  and ${IDX}/resolved_names.json (item/skill/npc id -> name + desc).
  Worked example: itemdata.xml:28 item 2100 <name>4000</name> <desc>4172</desc>
  -> "Small Soldier Pill" / "Replenish your AP without waiting!".
  ⚠ CAVEAT TO CARRY IN EVERY CLAIM: this is the ANDROID build, clientVersion 0.682
  (shs3_android/scripts/StatsManager.as:30), vs the web build's v0.717. Data-XML row
  counts match exactly; UI copy and combat tuning parity is NOT established. LABEL
  WHICH BUILD any ported string came from.

STAGE-0b FINDING S0-4 — more Android blobs, each hitting a named ledger blocker:
  112_Mobile_NodeData (535 ids, 372 <x>, 343 <obj>) -> world-exploration's "ZERO
    world numbers" / "world bounds + geography"
  114_Mobile_AchievementData (61 achievements) -> meta-social blocker ③
  90_InteractUI_UIData (167 ids, 139 option/label/icon) -> ui-hud blocker ⑤
  123_Mobile_BGData (49 backgrounds) · 84_QuestEngine_TrapRoomData (314 room objects)
  ⚑ MEASURED 2026-08-20: <anim> summed over the 18 MCSCharacter_* blobs = 471, not
    the board's assumed "~150". 99_HumanAnimationData alone = 158. L6 is 3.1x.
STAGE-0b FINDING S0-5 — audio is HELD but ENCRYPTED, and is a LEAD not an artifact.
  113_Mobile_MusicResource (1.34 MB), 122_Mobile_SoundResource, 115_Mobile_SHS3Resource,
  120_Mobile_BGResource, 124_Mobile_ImageResource all begin "CWS" = nested compressed
  SWF; ffdec cannot open them. You may NOT claim audio is recovered. You MAY claim it
  is held-but-encrypted.
`

const STATE_BRIEF = `
=== WHAT IS ALREADY BANKED — DO NOT RE-DERIVE ANY OF IT ===
Four earlier runs of this lane banked 1,087 claims / 1,767 verdicts / 0 VOID.
  ${OUT}/SEEN_CLAIM_IDS.txt   every claim id already banked, grouped by unit. READ IT.
  ${OUT}/systems/*.md         all 12 system surveys, full prose
  ${OUT}/sources/*.md         6 source sweeps ALREADY DONE: questdata, skilldata,
                              npcdata, itemdata, bindata, actionscript
  ${OUT}/critics/*.md         41 critic reviews
  ${OUT}/citelint.json        machine cite-audit of all 1,087 claims

A finding whose id matches one in SEEN_CLAIM_IDS.txt is NOT new. Report it ONLY if
you can materially STRENGTHEN it with a better artifact, or CONTRADICT it — and say
explicitly which, in the claim text. Your value is what four runs did not see.
`

const CLAIM_SCHEMA = {
  type: 'object',
  required: ['id', 'text', 'artifact_class', 'cite', 'verdict'],
  properties: {
    id: { type: 'string', description: 'stable slug, e.g. android-blobs/nodedata-holds-world-coords' },
    text: { type: 'string', description: 'the claim, one sentence' },
    artifact_class: { type: 'string', enum: ['A1', 'A2', 'A3', 'A4', 'A5', 'STILL_UNHELD'] },
    cite: { type: 'string', description: 'repo-relative file:line, frame path + crop, test name, or ledger §. Empty ONLY if STILL_UNHELD.' },
    quote: { type: 'string', description: 'the verbatim line/row, or what is visibly in the crop' },
    verdict: { type: 'string', enum: ['HELD', 'PARTIAL', 'STILL_UNHELD'] },
    overturns_ledger: { type: 'boolean', description: 'true if this disproves a REBUILD_READINESS.md claim' },
    ledger_text: { type: 'string', description: 'the exact ledger sentence this overturns, quoted' },
    lane_impact: { type: 'string', description: 'which gauntlet lane (L1..L11) this changes, and how' },
    build: { type: 'string', description: 'web v0.717 | android v0.682 | both — REQUIRED when the claim rests on a string or a value that could differ between builds' },
  },
}

const SURVEY_SCHEMA = {
  type: 'object',
  required: ['unit', 'claims', 'journal_path'],
  properties: {
    unit: { type: 'string' },
    claims: { type: 'array', items: CLAIM_SCHEMA },
    journal_path: { type: 'string' },
    coverage_note: { type: 'string', description: 'what you did NOT open, and why. §3: no silent caps.' },
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
    new_findings: { type: 'array', items: CLAIM_SCHEMA, description: 'anything you found the surveyor missed' },
  },
}

const SOURCES = [
  {
    key: 'android-blobs',
    brief: `reference/extracted/android/ — the 42 CLASS-NAMED Android blobs (S0-3/S0-4).
NOBODY HAS SURVEYED THESE IN FOUR RUNS. This is where the remaining value is concentrated.
Their class names are the map: 112_Mobile_NodeData, 114_Mobile_AchievementData,
90_InteractUI_UIData, 123_Mobile_BGData, 84_QuestEngine_TrapRoomData,
109_WarHexUI_SurvivalModeData, 119_Mobile_MapData, 121_Mobile_PremiumData,
110_Mobile_MapBitmapData, 85-89_NameGenerator_*, 111_Mobile_ItemData, 116_Mobile_QuestData,
117_Mobile_SkillData, 125_Mobile_NpcData, and the 18 MCSCharacter_*AnimationData (471 anims).
⚠ THEY ARE UTF-16LE. A byte-level grep returns 0 hits and will fool you — decode first
(python3: open(p, encoding='utf-16-le') or read+decode, then confirm the root tag).
${IDX}/android_blobs.json has bytes / kind / root / tag histogram for every one.
Priorities: (1) 112_Mobile_NodeData vs world-exploration's "ZERO world numbers";
(2) 114_Mobile_AchievementData vs meta-social blocker ③; (3) 90_InteractUI_UIData vs
ui-hud blocker ⑤; (4) 109 survival mode, absent from all 12 ledger systems;
(5) 111/116/117/125 — do the Android data XMLs DIFFER from the web ones? That is the
build-parity question S0-3 left open, and it is answerable by diffing.
Report what each blob HOLDS against the 12 systems.`,
  },
  {
    key: 'string-table',
    brief: `reference/extracted/android/118_Mobile_Lang_EN.bin via ${IDX}/strings.json (2,533
entries) + ${IDX}/resolved_names.json. NOBODY HAS READ IT FOR MECHANICS IN FOUR RUNS.
The table is ALREADY PARSED — do not re-parse it, do not re-verify that it resolves names.
YOUR JOB IS TO MINE THE PROSE for what the ledger calls missing. These strings are the
game's own documentation of itself: skill descriptions carrying REAL NUMBERS ("Fire Damage:
150% Fire ATK"), condition/status tiers, rebirth and dan-rank rules, War Room rules,
betting-odds copy, HUD labels, achievement text, tutorial tips, error messages, shop copy.
A tutorial tip stating a rule IS an A2 artifact for that rule.
Method: read the strings themselves, in bulk, and pattern-hunt — every string containing
a %, a number, "increase"/"decrease"/"per", a stance name, "chi"/"focus"/"AP"/"dan", a
cooldown, a duration. Map each to whichever of the 12 systems it lands in.
⚠ Every claim from this file is ANDROID v0.682. Set build accordingly and say so.`,
  },
  {
    key: 'frames',
    brief: `reference/frames/ — 7,381 stills, manifest at ${IDX}/frames.json. A1 TERRITORY.
Crop and upscale before grading ANYTHING — the fighter is ~270 px tall in a 1080p frame.
You are the only surveyor in this whole lane whose evidence class is the video frame, and
§0's standing invariant is THE FRAME WINS over any measurement doc. So: go find the places
where a frame SETTLES something the ledger calls unknown, and the places where a frame
CONTRADICTS a number some doc asserts. Both are top-value.
Directories to work through (see the manifest for the full list): duel_dense, combat_frames,
combat_analysis, combat_analysis2, broad_survey, session11/*, s21_weapon.
Priorities: UI/HUD layout and exact on-screen metrics; what is visibly ON the fighter
(equipment, clothing, VFX) that no payload row states; enemy roster and behaviour actually
observed; screens the ledger lists as never-seen; anything where a doc number and the pixels
disagree — say THE FRAME WINS out loud when it happens.
State the exact crop box and upscale factor in every cite.`,
  },
  {
    key: 'uistrings-payload',
    brief: `reference/extracted/ui_strings.txt (471 fields, index at ${IDX}/ui_strings.json)
+ reference/extracted/payload.xml (329 MB — the tag histogram is at
${IDX}/payload_histogram.json; STREAM it, never load it whole).
ui_strings.txt is the WEB v0.717 build's UI copy — which makes it the ONLY direct evidence
on the S0-3 build-parity question, because 118_Mobile_Lang_EN.bin is Android v0.682.
Priority ONE: diff what ui_strings.txt says against the corresponding Android strings.
Where they AGREE, the parity caveat weakens and every ported string gets safer. Where they
DIFFER, that is a first-class finding — the ledger and L2/L3 both need it.
Priority TWO: ui_strings.txt is verbatim UI copy the ledger lists as missing (ui-hud blocker
⑤: "pause/options/dialogue-box exact metrics"; War Room rules; betting-odds text).
Priority THREE: payload.xml holds tags nothing else does — use the histogram to find tag
families no surveyor has touched, then stream just those.`,
  },
]

function surveyorPrompt(src) {
  return `${LAW}
${INDEX_BRIEF}
${STATE_BRIEF}

=== YOUR JOB ===
You are an ORTHOGONAL SOURCE surveyor. Your unit: **${src.key}**.
${src.brief}

The document under audit is ${REPO}/docs/research/REBUILD_READINESS.md (2026-07-20,
avg score ~42). It was written BEFORE the payload was extracted and never reconciled
with it. Find where it is WRONG — in BOTH directions:

  OVER-CLAIM  it says we have something we do not.
  UNDER-CLAIM it says something is "unrecoverable" / "captured NOWHERE" / "absent" /
              a "blocker" when the payload or the frames HOLD IT. §6 "structurally
              UNRECOVERABLE" is the highest-value target in the whole document.

Twelve systems to map findings onto via lane_impact: combat-core, skills-meters,
progression, rebirth-elements, items-equipment, economy, enemies-ai, world-exploration,
quests-story, ui-hud, art-anim-audio-feel, meta-social.

METHOD
1. Read your index JSON first. It is authoritative on counts.
2. Then OPEN THE ACTUAL FILES AND READ THEM. Quote real lines with real line numbers.
3. Check SEEN_CLAIM_IDS.txt before reporting — new, strengthened, or contradicting only.
4. For each claim: artifact class, repo-relative cite, verbatim quote, and a build label when
   a string or tuning value could differ between web v0.717 and android v0.682.
5. If the ledger says X and the evidence says not-X: overturns_ledger=true, and quote the
   exact ledger sentence in ledger_text.
6. Where a frame and a doc disagree, THE FRAME WINS — say so in the claim text.
7. Anything you cannot ground: artifact_class=STILL_UNHELD, verdict=STILL_UNHELD.
   You are graded on HONESTY, not on volume of HELD claims.
8. coverage_note: say what you did NOT open and why. §3 — NO SILENT CAPS. Silent
   truncation reads as "covered everything" when it didn't.

WRITE YOUR RESULT TO DISK BEFORE YOU RETURN — this run must survive a usage wall:
  ${OUT}/sources/${src.key}.md
Full prose, every claim with its cite and quote. Then return the structured object with
journal_path set to that file.

Aim for 10-25 claims. Depth over breadth. One overturned §6 line is worth ten
restatements of what the ledger already knows.`
}

function criticPrompt(lens, unitLabel, surveyJson) {
  const lenses = {
    cite: `LENS 1 — THE CITE LENS. You hunt OVER-CLAIMING.
For every claim: OPEN THE CITED ARTIFACT YOURSELF. Does the file exist? Is the line
number right? Does the quoted text actually appear there? Does it actually SAY what the
claim says it says, or is the claim an inference dressed as a citation?
A claim whose cite does not resolve is REFUTED, full stop.
Two specific traps in this lane:
  - The Android blobs are UTF-16LE. If you grep them as bytes you will see nothing and
    wrongly refute a sound claim. Decode before you judge.
  - A claim resting on an ANDROID v0.682 string while asserting a WEB v0.717 behaviour
    has a build-parity hole. That is a REAL defect — mark it material, not fatal, and
    say what would close it.`,
    hunter: `LENS 2 — THE HUNTER LENS. You hunt UNDER-CLAIMING, which is the failure this
whole lane exists to fix. For every claim marked STILL_UNHELD or PARTIAL: GO TRY TO FIND
IT. Search the other Android blobs, the 27 web bindata files, the 2,768 decompiled AS3
classes, the frames manifest, the string table. If you find it, the STILL_UNHELD verdict
is REFUTED and you supply the cite in new_findings.
Also read the surveyor's coverage_note and go open what they admitted they skipped.
Refuting a "we don't have it" is the most valuable thing you can do here.`,
  }

  return `${LAW}
${INDEX_BRIEF}
${STATE_BRIEF}

=== YOU ARE A BLIND CRITIC ===
You did NOT see the surveyor's reasoning and you never will — only its output, below, and
the artifacts themselves. YOUR JOB IS TO REFUTE. Default to refuted=true when uncertain.
A claim survives only if you personally opened an artifact and it held up.

You must supply own_cite for EVERY verdict: the artifact YOU opened. A verdict without
own_cite is VOID under §0 and will be discarded — costing your whole review. Do not refute
something for being merely incomplete; refute it for being WRONG, UNGROUNDED, or MIS-CITED.
Over-refuting honest STILL_UNHELD answers is also a failure.

JUDGE EVERY CLAIM IN THE SET. A claim you skip is UNJUDGED, which under §0 makes it a
lead that may never enter the ledger — so a skipped claim is a claim destroyed.

${lenses[lens]}

=== THE OUTPUT UNDER REVIEW (unit: ${unitLabel}) ===
${surveyJson}

Write your review to ${OUT}/critics/${unitLabel}.${lens}.md before returning.`
}

// ---------------------------------------------------------------------------

phase('Surveys')
log(`WF-1 armed: ${SOURCES.length} never-run source surveys x (1 surveyor + 2 blind critics) = ${SOURCES.length * 3} agents.`)

const allClaims = []
const confirmed = []
const unjudged = []
const refuted = []
const deadAgents = []

function harvest(survey, critiques) {
  if (!survey || !survey.claims) return
  const live = critiques.filter(Boolean)
  const kills = new Map()
  for (const cr of live) {
    for (const v of cr.verdicts || []) {
      if (!v.own_cite || !v.own_cite.trim()) continue // VOID under §0
      if (!v.refuted) continue
      kills.set(v.claim_id, (kills.get(v.claim_id) || 0) + 1)
    }
    for (const nf of cr.new_findings || []) {
      allClaims.push({ ...nf, unit: survey.unit, origin: 'critic' })
    }
  }

  // FAIL CLOSED. A claim that NO critic judged is UNJUDGED, never confirmed — run 1 of
  // this lane promoted 225 claims judged by nobody, because the threshold was computed
  // from a critic list that was empty. Under §0 an unjudged claim is a lead, not a finding.
  for (const c of survey.claims) {
    const row = { ...c, unit: survey.unit, critics: live.length }
    allClaims.push({ ...c, unit: survey.unit, origin: 'surveyor' })
    if (live.length === 0) unjudged.push(row)
    else if ((kills.get(c.id) || 0) >= (live.length >= 3 ? 2 : 1)) refuted.push(row)
    else confirmed.push(row)
  }
}

const results = await pipeline(
  SOURCES,
  (src) =>
    agent(surveyorPrompt(src), {
      label: `source:${src.key}`,
      phase: 'Surveys',
      schema: SURVEY_SCHEMA,
    }),
  (survey, src) => {
    if (!survey) {
      // A DEAD surveyor is not a surveyor that found nothing. Record it loudly.
      deadAgents.push(`survey:${src.key}`)
      return null
    }
    const json = JSON.stringify(survey, null, 1)
    return parallel(
      ['cite', 'hunter'].map((lens) => () =>
        agent(criticPrompt(lens, `src-${src.key}`, json), {
          label: `critic:${src.key}:${lens}`,
          phase: 'Critics',
          schema: CRITIC_SCHEMA,
        }),
      ),
    ).then((critiques) => {
      critiques.forEach((c, i) => {
        if (!c) deadAgents.push(`critic:${src.key}:${['cite', 'hunter'][i]}`)
      })
      harvest(survey, critiques)
      return { survey, critiques }
    })
  },
)

const landed = results.filter(Boolean)
log(`WF-1 done: ${landed.length}/${SOURCES.length} surveys landed, ${allClaims.length} claims, ` +
    `${confirmed.length} survived, ${unjudged.length} UNJUDGED, ${deadAgents.length} agents died.`)

const clean = deadAgents.length === 0 && unjudged.length === 0 && landed.length === SOURCES.length

return {
  surveys_run: landed.length,
  surveys_expected: SOURCES.length,
  claims_total: allClaims.length,
  confirmed_count: confirmed.length,
  unjudged_count: unjudged.length,
  refuted_count: refuted.length,
  dead_agents: deadAgents,
  INTEGRITY: clean
    ? `CLEAN — all ${SOURCES.length} surveys landed, every claim judged by >=1 artifact-citing critic, 0 agents died`
    : `INCOMPLETE — ${landed.length}/${SOURCES.length} surveys landed · ${unjudged.length} claims UNJUDGED · ` +
      `${deadAgents.length} agents DIED (${deadAgents.join(', ') || 'none'}). Unjudged claims are LEADS, ` +
      `not findings (§0). Do NOT write them into REBUILD_READINESS.md. A stage where agents died is NOT a ` +
      `stage that found nothing.`,
  coverage_notes: landed.map((r) => ({ unit: r.survey.unit, note: r.survey.coverage_note || '(none given)' })),
  confirmed,
  unjudged,
  refuted,
  all_claims: allClaims,
}
