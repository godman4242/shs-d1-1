export const meta = {
  name: 'jclaw-lessons',
  description: 'Read-only: study JClaw harness areas vs our harness, merge+rank lessons, adversarially refute each, fail-closed accounting',
  phases: [
    { title: 'Study', detail: 'one read-only agent per JClaw area, plus a coverage critic' },
    { title: 'Merge', detail: 'one agent merges duplicates across areas and ranks' },
    { title: 'Refute', detail: 'two adversarial lenses per ranked lesson' },
  ],
}

const J = args.jclaw
const OUT = args.out
const OURS = `OURS lives in three places (all readable):
- SSHD 1:1 repo: /Users/kheshav/kheshav-code/SSHD 1-1 — CLAUDE.md, src/core/CLAUDE.md, src/config/CLAUDE.md, .githooks/pre-commit, package.json, vite.config.ts, tsconfig.json, eslint.config.mjs, scripts/gates/{chaos,chaosLib,chaosPlant,claimcheck,claimcheckLib}.ts, tests/{chaosGate,claimcheck,config-purity,configTwins,duel-baseline}.test.ts, tests/utils/npcHarness.ts, tests/*.plants.ts, .claude/workflows/measure-verify.js, docs/research/HARNESS.md, docs/research/runs/, docs/sessions/-SESSION-LOG.md, scripts/build-loop.sh, RESUME_HERE.md
- agent-harness repo (PUBLIC, the generic versions): /Users/kheshav/kheshav-code/agent-harness — harness/README.md, harness/chaos/{chaos,chaosLib}.mjs + tests, harness/workflows/measure-refute.js + .test.mjs, harness/plants/, commit-gate/{README.md,pre-commit.template}, hooks/, playbooks/*.md
- global: /Users/kheshav/.claude/CLAUDE.md (graph engineering + harness engineering sections), /Users/kheshav/.claude/ship-bar.md (injected every turn), /Users/kheshav/.claude/settings.json, memory /Users/kheshav/.claude/projects/-Users-kheshav-kheshav-code-SSHD-1-1/memory/*.md (MEMORY.md is the index)`

const RULES = `READ-ONLY on every repo: write nothing in them; run no state-changing command (no git checkout/commit/stash, no gradle, pnpm, npm install, jclaw.sh). Never touch the LIVE JClaw install at ~/JClaw or ~/.jclaw. The ONE file you write is your own result JSON at the path given, written BEFORE you return — a usage wall can kill you after the work, and that file is the salvage.
Evidence: path:line + an exact quote you read, or the exact command and what it printed. Never carry a number from a doc — re-derive it. Label inference as inference.`

const THEIRS = `THEIRS — JClaw, a Java/Nuxt agent platform whose own development runs a heavy verification harness. Read-only clone at ${J} (v0.18.60, 4153 commits). \`git -C ${J} log\` / \`git -C ${J} show\` show how and why it evolved.`

const CONTEXT = `WHY: we want to know what JClaw can teach OUR harness — a solo developer's Claude Code setup: Workflow-tool fan-outs; SSHD's gates (vitest pre-commit, \`claimcheck\` resolving every source cite at ±0, \`chaos\` plants that must turn tests red); agent-harness shipping generic versions (zero-dep chaos runner, the \`measure-refute\` fan-out with fail-closed accounting, playbooks, commit-gate, per-turn ship-bar hook); global rules (graph engineering: node contracts, stop conditions, five known killers — state-schema drift, parallel overwrite, fail-open accounting, non-idempotent replay, unbounded review cycles). Constraints that decide fit: one developer with ADD (cognitive load matters), an 8 GB machine, ONE workflow in flight at a time, SSHD takes no new runtime dependency, every rule injected per turn costs tokens, simplest change wins, fail-closed over fail-open.`

const UNITS = [
  { name: 'gate-guards',
    about: 'tests that guard the gates themselves — a suite that silently runs nothing, a checker switched off or downgraded, a build input nobody tracks, schema drift',
    read: 'test/TestDiscoveryConformanceTest.java, test/NullnessGateConformanceTest.java, test/ResourceLeakGateConformanceTest.java, test/SpaBuildInputsConformanceTest.java, test/SidecarDefaultPortsConformanceTest.java, test/EvalSuiteConformanceTest.java, test/ApiConversationsControllerSchemaDriftTest.java, test/SkillConformanceServiceConformTest.java, AGENTS.md "Running and verifying"',
    ours: 'SSHD .githooks/pre-commit (its docs-only fast path and CI skip), package.json, vite.config.ts, tsconfig.json, eslint.config.mjs, tests/chaosGate.test.ts, tests/claimcheck.test.ts; agent-harness commit-gate/ and harness/chaos/' },
  { name: 'architecture-rules',
    about: 'architecture rules enforced as tests with FROZEN violation stores (named, reasoned exceptions — only new violations fail), clock and concurrency seams, property-based tests',
    read: 'test/ArchitectureTest.java, archunit_store/*, app/utils/AppClock.java, app/utils/TaskScope.java, test/PropertyBasedTest.java, AGENTS.md sections "Wall clock — AppClock", "Structured concurrency", "Nullness", "Resource leaks", "Capabilities"',
    ours: 'SSHD tests/config-purity.test.ts, tests/configTwins.test.ts, src/core/CLAUDE.md, src/config/CLAUDE.md, the CONTEXT exception list in scripts/gates/claimcheck*.ts, tests/duel-baseline.test.ts, eslint.config.mjs' },
  { name: 'evals-ruler',
    about: 'the eval ruler — errored is not failed, suite-content fingerprints, baseline regression compare, calibration declared by the suite, validating a harness against a known-zero case',
    read: 'evals/README.md, evals/schema/eval-suite.schema.json, evals/suites/*.json (skim), app/services/evals/*.java, test/EvalScorerTest.java, test/EvalCalibrationTest.java, test/EvalRunnerTest.java, test/EvalCaptureTest.java, test/MemoryEvalTest.java',
    ours: 'agent-harness harness/workflows/measure-refute.js + measure-refute.test.mjs, SSHD .claude/workflows/measure-verify.js, docs/research/HARNESS.md, docs/research/runs/, memory feedback-fail-closed-agent-accounting.md and feedback-probe-parser-must-match.md' },
  { name: 'subagent-lifecycle',
    about: 'how the platform spawns, bounds, cancels, checkpoints, sweeps orphans of, and recovers subagent runs and lost tasks',
    read: 'app/tools/Subagent*.java, app/services/SubagentRegistry.java, app/models/SubagentRun.java, app/agents/CancellationManager.java, app/jobs/OrphanSubagentSweepJob.java, app/jobs/SubagentOrphanRecoveryJob.java, app/jobs/LostTaskScanJob.java, app/jobs/OrphanReArmJob.java, app/services/LostTaskDetector.java, docs/user-guide/subagents.md, test/OrphanSubagentSweepJobTest.java, test/LostTaskDetectorTest.java, test/AgentRunnerSubagentTest.java',
    ours: 'global CLAUDE.md graph-engineering section; memory project-workflow-salvage-pattern.md, feedback-one-workflow-at-a-time.md, reference-graph-engineering.md, reference-workflow-registry.md, project-orphaned-processes-and-tunnel.md (~12 orphaned dev servers left by past runs); SSHD scripts/build-loop.sh; agent-harness playbooks/crash-resilience.md and playbooks/handoff.md; measure-refute.js and measure-verify.js (their dead-agent and resume story)' },
  { name: 'resilience-gates',
    about: 'runtime guards around model and tool calls — circuit breakers with half-open probes, model fallback, tool-result verification, dangerous-action gating, compaction, stubbing large tool results behind a retrieve handle',
    read: 'app/utils/CircuitBreaker.java, app/utils/CircuitBreakers.java, app/llm/LlmResilience.java, app/agents/ModelResolver.java, app/agents/ToolResultVerifier.java, app/agents/DangerousActionGate.java, app/agents/CompactionGate.java, app/agents/ToolResultPruner.java, app/agents/TruncationDiagnostics.java, test/CircuitBreakerTest.java, test/DangerousActionGateTest.java',
    ours: 'measure-refute.js and measure-verify.js (what happens when agents hit a usage wall); memory reference-fable5-credits-exhausted.md (a wall killed 10 agents after ~687k tokens), project-workflow-salvage-pattern.md; global CLAUDE.md (external-platform risk check, destructive-op rules); /Users/kheshav/.claude/settings.json hooks' },
  { name: 'agent-instructions',
    about: 'how they instruct coding agents — a harness-agnostic AGENTS.md whose policy block is stamped "Verified <date> against <sha>", settled verdicts in docs/spikes/ checked before re-proposing work, behavioural guidelines (Know What Is Verified, Reach For What Exists, the comment delete test), slash-command playbooks',
    read: 'AGENTS.md, CLAUDE.md, docs/spikes/*.md (the verdict format), .claude/commands/quality.md, .claude/commands/deploy.md, .claude/commands/docs.md, _bmad/custom/config.toml; git log -p on AGENTS.md',
    ours: 'global CLAUDE.md, ship-bar.md, SSHD CLAUDE.md + src/*/CLAUDE.md, RESUME_HERE.md, docs/research/HARNESS.md, memory MEMORY.md and reference-ship-bar-drift.md (measured ~6.7k tokens/turn of injected rules on SSHD — weigh any addition against that), agent-harness playbooks/*.md and hooks/*.template' },
  { name: 'hooks-ci-sandbox',
    about: 'the fast/slow gate split (pre-commit lint-only under 5 s, pre-push full suite), hook edge cases, CI, and OS-level sandboxing of harness processes',
    read: '.githooks/pre-commit, .githooks/pre-push, .githooks/post-checkout, Jenkinsfile, jclaw.sh (only the test subcommand and hook installation — find them with grep), docs/spikes/jclaw-671-harness-sandboxing.md, app/tools/HarnessSandbox.java, app/tools/SubagentHarnessPermissions.java, test/HarnessSandboxTest.java; git log on .githooks/',
    ours: 'SSHD .githooks/pre-commit, agent-harness commit-gate/pre-commit.template + README.md, harness/chaos/chaos.mjs (lock, signals), memory feedback-reexecute-agent-evidence.md (sandbox-exec re-execution)' },
  { name: 'harness-evolution',
    about: 'the defects JClaw found IN ITS OWN harness over time and how each was closed — the history, not the current state',
    read: 'method: git -C <clone> log --format="%h %ad %s" --date=short over commits touching .githooks/, test/*Conformance*, test/ArchitectureTest.java, archunit_store/, evals/, app/services/evals/, AGENTS.md, Jenkinsfile, .claude/commands/ — then git show the ~15 most instructive (a gate that false-passed, one that false-failed, a rule reversed, a fail-open vs fail-closed choice)',
    ours: 'SSHD docs/research/HARNESS.md, docs/sessions/-SESSION-LOG.md (search false-pass), memory feedback-*.md. Deliver lessons we have NOT already learned the hard way' },
]

const CANDIDATE = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    pattern: { type: 'string' },
    failurePrevented: { type: 'string' },
    jclawEvidence: { type: 'string', description: 'path:line + exact quote' },
    builtAndExercised: { type: 'string', description: 'the test or commit proving it runs, or PLAN ONLY' },
    ourState: { type: 'string', enum: ['HAVE', 'PARTIAL', 'GAP'] },
    ourEvidence: { type: 'string', description: 'path + quote, or the exact searches that came back empty' },
    proposal: { type: 'string', description: 'smallest change: which file, what shape' },
    doneCriterion: { type: 'string', description: 'observable pass/fail' },
    cost: { type: 'string' },
    verdict: { type: 'string', enum: ['ADOPT', 'ADAPT', 'SKIP'] },
    why: { type: 'string' },
  },
  required: ['id', 'pattern', 'failurePrevented', 'jclawEvidence', 'builtAndExercised', 'ourState', 'ourEvidence', 'proposal', 'doneCriterion', 'cost', 'verdict', 'why'],
}
const STUDY_SCHEMA = {
  type: 'object',
  properties: {
    unit: { type: 'string' },
    summary: { type: 'string' },
    candidates: { type: 'array', items: CANDIDATE },
    antiPatterns: { type: 'array', items: { type: 'object', properties: { what: { type: 'string' }, evidence: { type: 'string' }, whyNotForUs: { type: 'string' } }, required: ['what', 'evidence', 'whyNotForUs'] } },
    integrity: { type: 'string', description: 'what you verified by command vs inferred; what you did not read' },
  },
  required: ['unit', 'summary', 'candidates', 'antiPatterns', 'integrity'],
}
const CRITIC_SCHEMA = {
  type: 'object',
  properties: {
    unread: { type: 'array', items: { type: 'object', properties: { area: { type: 'string' }, paths: { type: 'string' }, why: { type: 'string' } }, required: ['area', 'paths', 'why'] } },
    integrity: { type: 'string' },
  },
  required: ['unread', 'integrity'],
}
const MERGE_SCHEMA = {
  type: 'object',
  properties: {
    clusters: { type: 'array', items: { type: 'object', properties: {
      id: { type: 'string' }, title: { type: 'string' }, members: { type: 'array', items: { type: 'string' } },
      pattern: { type: 'string' }, failurePrevented: { type: 'string' }, jclawEvidence: { type: 'string' }, builtAndExercised: { type: 'string' },
      ourState: { type: 'string' }, ourEvidence: { type: 'string' }, proposal: { type: 'string' }, doneCriterion: { type: 'string' }, cost: { type: 'string' },
      verdict: { type: 'string', enum: ['ADOPT', 'ADAPT', 'SKIP'] }, bitten: { type: 'string', description: 'evidence this defect class already bit us, or "none found"' }, rank: { type: 'number' },
    }, required: ['id', 'title', 'members', 'pattern', 'failurePrevented', 'jclawEvidence', 'builtAndExercised', 'ourState', 'ourEvidence', 'proposal', 'doneCriterion', 'cost', 'verdict', 'bitten', 'rank'] } },
    skipped: { type: 'array', items: { type: 'object', properties: { members: { type: 'array', items: { type: 'string' } }, why: { type: 'string' } }, required: ['members', 'why'] } },
    integrity: { type: 'string' },
  },
  required: ['clusters', 'skipped', 'integrity'],
}
const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['STANDS', 'AMENDED', 'REFUTED', 'UNVERIFIED'] },
    checks: { type: 'array', items: { type: 'object', properties: { claim: { type: 'string' }, command: { type: 'string' }, output: { type: 'string' }, result: { type: 'string' } }, required: ['claim', 'command', 'output', 'result'] } },
    amendment: { type: 'string', description: 'for AMENDED: the changed proposal and done-criterion; else empty' },
    integrity: { type: 'string' },
  },
  required: ['verdict', 'checks', 'amendment', 'integrity'],
}

const FABLE = { model: 'fable', effort: 'high' }
const safe = (p) => p.catch(() => null)

const studyPrompt = (u) => `${RULES}

${THEIRS}
YOUR AREA: ${u.name} — ${u.about}.
Read first-hand (paths relative to the clone): ${u.read}.

${CONTEXT}
${OURS}
Most relevant of ours for this area: ${u.ours}.

DELIVER every pattern in your area that would make OUR harness catch a defect it currently cannot, or stop a failure that has already bitten us. Per pattern: the failure it prevents; JClaw evidence and proof it is built and exercised (or PLAN ONLY — docs/architecture/jclaw-agentic-refactor.md is a plan, and a spike may recommend AGAINST); our state HAVE/PARTIAL/GAP with our evidence or the exact searches that came back empty; the smallest adoption (file + shape) with an observable done-criterion; cost; ADOPT/ADAPT/SKIP and why. Ids: ${u.name}-1, ${u.name}-2, … Also antiPatterns: what JClaw does that we should NOT copy, or already do better — with evidence.
Quality over count. A GAP claim is the likeliest to be wrong: search all three of our locations before making one.
Write your result JSON to ${OUT}/study-${u.name}.json, then return it.`

const criticPrompt = `${RULES}

${THEIRS}
${CONTEXT}
Eight independent readers are each studying one JClaw area: ${UNITS.map((u) => `${u.name} (${u.read})`).join(' | ')}.
Using \`git -C ${J} ls-files\` and quick reads, list the JClaw areas relevant to a VERIFICATION or AGENT-ORCHESTRATION harness (verification, evaluation, orchestration, safety, observability, development process) that NONE of them reads — each with paths and one line on what it might teach. Only areas with a concrete lesson; say so if there are none.
Write your result JSON to ${OUT}/critic.json, then return it.`

const mergePrompt = (studies) => `${RULES}

${CONTEXT}
Eight independent studies compared JClaw's harness areas with ours. Their results (JSON):
${JSON.stringify(studies)}

MERGE candidates that are the same lesson (keep every member id and the strongest evidence from each side). Every candidate id lands in exactly one cluster or in skipped, with a reason — drop nothing silently. Re-judge ADOPT/ADAPT/SKIP per cluster rather than averaging. Rank ADOPT/ADAPT clusters 1..n by: the defect class has ALREADY bitten us (cite the evidence in ours in \`bitten\`) > could plausibly bite us > speculative; then by cheapness; then by standing cost (tokens per turn, pre-commit seconds, maintenance). SKIP clusters get rank 0. Spot-check a citation with grep if it decides a rank; do not re-study.
Write your result JSON to ${OUT}/merge.json, then return it.`

const LENSES = [
  { key: 'facts', ask: `(a) Verify the JClaw evidence verbatim (grep -n in ${J}) and that it is BUILT and EXERCISED — a test that runs it, a commit that wired it — not a plan, a stub, or a spike that recommended against it. (b) Hunt OUR counter-example: search the SSHD repo, agent-harness, global CLAUDE.md, ship-bar.md and the memory files for an existing equivalent under any name. "We lack X" is the claim most likely to be wrong. REFUTED if JClaw does not really do it or we already have it; AMENDED if our state is PARTIAL rather than GAP, or the evidence needs correcting.` },
  { key: 'fit', ask: `Steelman SKIP. Name the defect class this would catch and find evidence it has actually bitten us (session log, memory, HARNESS.md, git log of our repos); none found means speculative. Weigh standing cost (tokens per turn, pre-commit seconds, maintenance, cognitive load), conflicts with our standing rules, and whether the done-criterion is really observable. Is there a strictly simpler version, or a hole in the proposal (it could itself false-pass)? REFUTED if speculative or net-negative; AMENDED with the simpler or corrected version.` },
]

const refutePrompt = (c, lens) => `${RULES}

${THEIRS}
${CONTEXT}
${OURS}

You are trying to BREAK a proposed lesson for our harness. Assume it looks true and is wrong somewhere.
THE LESSON (JSON): ${JSON.stringify(c)}

YOUR LENS — ${lens.key}: ${lens.ask}

Record every check as claim / exact command / what it printed / result. Verdict, fail-closed: REFUTED (would build the wrong thing, or is not needed) · AMENDED (stands but must change — give the changed proposal and done-criterion) · STANDS (you RAN checks and broke nothing) · UNVERIFIED (you could not run the checks — never STANDS then).
Write your result JSON to ${OUT}/refute-${c.id}-${lens.key}.json, then return it.`

// ── Study (+ critic, concurrently). A barrier is right here: Merge needs every study. ──
phase('Study')
const [studyRaw, critic] = await Promise.all([
  parallel(UNITS.map((u) => () => safe(agent(studyPrompt(u), { label: `study:${u.name}`, phase: 'Study', schema: STUDY_SCHEMA, ...FABLE })))),
  safe(agent(criticPrompt, { label: 'critic:coverage', phase: 'Study', schema: CRITIC_SCHEMA, ...FABLE })),
])
const isStudy = (s) => typeof s === 'object' && s !== null && Array.isArray(s.candidates)
const studies = UNITS.map((u, i) => (isStudy(studyRaw[i]) ? { ...studyRaw[i], unit: u.name } : null))
const deadStudies = UNITS.filter((_, i) => studies[i] === null).map((u) => u.name)
const allCandidates = studies.filter(Boolean).flatMap((s) => s.candidates.map((c) => ({ ...c, unit: s.unit })))
log(`studied ${UNITS.length - deadStudies.length}/${UNITS.length} areas · ${allCandidates.length} candidates · dead: ${deadStudies.join(', ') || 'none'} · critic ${critic ? 'live' : 'DEAD'}`)

// ── Merge ──
phase('Merge')
const merged = allCandidates.length ? await safe(agent(mergePrompt(studies.filter(Boolean)), { label: 'merge:rank', phase: 'Merge', schema: MERGE_SCHEMA, ...FABLE })) : null
const mergeLive = typeof merged === 'object' && merged !== null && Array.isArray(merged.clusters)

let clusters
let unaccounted = []
if (mergeLive) {
  clusters = merged.clusters
  const named = new Set([...merged.clusters.flatMap((c) => c.members), ...merged.skipped.flatMap((s) => s.members)])
  unaccounted = allCandidates.filter((c) => !named.has(c.id)).map((c) => c.id)
  if (unaccounted.length) log(`merge dropped ${unaccounted.length} candidate ids — carried as their own clusters: ${unaccounted.join(', ')}`)
  const rankAfter = Math.max(0, ...clusters.map((c) => c.rank || 0))
  allCandidates.filter((c) => unaccounted.includes(c.id)).forEach((c, i) => clusters.push({ ...c, title: c.pattern, members: [c.id], bitten: 'unranked — merge dropped it', rank: c.verdict === 'SKIP' ? 0 : rankAfter + 1 + i }))
} else {
  log('merge agent DEAD — refuting unmerged ADOPT/ADAPT candidates in study order')
  clusters = allCandidates.map((c, i) => ({ ...c, title: c.pattern, members: [c.id], bitten: 'unranked — merge died', rank: c.verdict === 'SKIP' ? 0 : i + 1 }))
}

const CAP = 16
const ranked = clusters.filter((c) => c.verdict !== 'SKIP').sort((a, b) => a.rank - b.rank)
const toRefute = ranked.slice(0, CAP)
const belowCut = ranked.slice(CAP)
if (belowCut.length) log(`CAP ${CAP}: ${belowCut.length} ranked lessons NOT refuted: ${belowCut.map((c) => c.id).join(', ')}`)

// ── Refute: pipeline per lesson, two lenses each ──
phase('Refute')
const LIVE = new Set(['STANDS', 'AMENDED', 'REFUTED'])
const isLive = (v) => typeof v === 'object' && v !== null && LIVE.has(v.verdict)
const judged = await pipeline(toRefute, (c) =>
  parallel(LENSES.map((lens) => () => safe(agent(refutePrompt(c, lens), { label: `refute:${c.id}:${lens.key}`, phase: 'Refute', schema: VERDICT_SCHEMA, ...FABLE })))).then((vs) => {
    const verdicts = LENSES.map((l, i) => (isLive(vs[i]) ? { lens: l.key, ...vs[i] } : { lens: l.key, verdict: 'UNVERIFIED', checks: [], amendment: '', integrity: 'agent died or returned no valid verdict' }))
    const live = verdicts.filter(isLive)
    const outcome = live.some((v) => v.verdict === 'REFUTED') ? (live.length === LENSES.length ? 'REFUTED' : 'REFUTED-PARTIAL')
      : live.length < LENSES.length ? 'UNVERIFIED'
      : live.some((v) => v.verdict === 'AMENDED') ? 'AMENDED' : 'CONFIRMED'
    return { ...c, outcome, verdicts }
  }))
const results = toRefute.map((c, i) => judged[i] ?? { ...c, outcome: 'UNVERIFIED', verdicts: LENSES.map((l) => ({ lens: l.key, verdict: 'UNVERIFIED', integrity: 'lesson fell out of the run' })) })

const expectedRefuters = toRefute.length * LENSES.length
const liveRefuters = results.flatMap((r) => r.verdicts).filter(isLive).length
const by = (o) => results.filter((r) => r.outcome === o)
const complete = deadStudies.length === 0 && critic !== null && mergeLive && unaccounted.length === 0 && liveRefuters === expectedRefuters
log(`refuters live ${liveRefuters}/${expectedRefuters} · CONFIRMED ${by('CONFIRMED').length} · AMENDED ${by('AMENDED').length} · REFUTED ${by('REFUTED').length + by('REFUTED-PARTIAL').length} · UNVERIFIED ${by('UNVERIFIED').length}`)

return {
  status: complete ? 'VERIFIED' : 'UNVERIFIED',
  integrity: `studies ${UNITS.length - deadStudies.length}/${UNITS.length} (dead: ${deadStudies.join(', ') || 'none'}); critic ${critic ? 'live' : 'DEAD'}; merge ${mergeLive ? 'live' : 'DEAD'}; unaccounted ids ${unaccounted.length}; refuters ${liveRefuters}/${expectedRefuters}; below cap ${belowCut.length}. Anything missing from these counts DIED — it was not clean.`,
  confirmed: by('CONFIRMED'),
  amended: by('AMENDED'),
  refuted: [...by('REFUTED'), ...by('REFUTED-PARTIAL')],
  unverified: by('UNVERIFIED'),
  belowCut,
  skippedClusters: clusters.filter((c) => c.verdict === 'SKIP').map((c) => ({ id: c.id, title: c.title, members: c.members })),
  mergeSkipped: mergeLive ? merged.skipped : [],
  antiPatterns: studies.filter(Boolean).flatMap((s) => s.antiPatterns.map((a) => ({ unit: s.unit, ...a }))),
  studyIntegrity: studies.map((s, i) => ({ unit: UNITS[i].name, integrity: s ? s.integrity : 'DEAD' })),
  critic,
}
