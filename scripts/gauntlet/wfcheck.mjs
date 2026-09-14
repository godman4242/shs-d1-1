// wfcheck.mjs — the only check that has ever run over this repo's workflow scripts.
//
// These files are ~1,100 lines that spawn 40+ agents each, and until 2026-08-23 NOTHING
// validated them: a typo shipped straight into a live wave and cost the wave. `npm test`
// never saw them, and `node --check` REJECTS every one of them — they use a top-level
// `return`, which is legal only inside a function body, so the checker must compile them
// the way the runtime does.
//
// Usage:  node scripts/gauntlet/wfcheck.mjs <script.workflow.js> [compile|run] [argsJSON]
//
// Two modes:
//   compile  parse only.
//   run      execute the body against stubs, TWICE — once with every agent DEAD and once
//            with every agent ALIVE. Both branches matter: the dead branch is the
//            fail-closed accounting, and the alive branch is the code that only ever runs
//            when the wave succeeds. Catches what parsing cannot — a `const` spread into
//            an array declared above it throws ReferenceError at evaluation, not at parse.
//
// pipeline() REALLY RUNS ITS STAGES here. A stub that returns nulls without calling the
// stages reports a confident pass on code it never executed — which is how the first
// version of this file passed a script whose verify stage was broken.
import fs from 'node:fs'

const path = process.argv[2]
const mode = process.argv[3] || 'run'
const src = fs.readFileSync(path, 'utf8').replace(/^export const meta/m, 'const meta')
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

let fn
try {
  fn = new AsyncFunction('agent', 'parallel', 'pipeline', 'log', 'phase', 'workflow', 'args', 'budget', src)
} catch (e) {
  console.error(`SYNTAX FAIL  ${path}\n  ${e.message}`)
  process.exit(1)
}
console.log(`SYNTAX OK    ${path}`)
if (mode === 'compile') process.exit(0)

// A permissive object: any field a workflow reads comes back plausible, so the ALIVE
// branch exercises the real accounting instead of dying on a property access.
const ALIVE = new Proxy({}, {
  get(_, k) {
    if (k === 'then' || typeof k === 'symbol') return undefined
    if (['approve', 'refuted', 'overturn_upheld'].includes(k)) return true
    if (['judged_count', 'packet_size', 'old_score', 'new_score'].includes(k)) return 1
    if (['unit', 'slice', 'lens', 'section_markdown', 'searched', 'journal_path',
         'score_rationale', 'notes_for_lead', 'severity'].includes(k)) return 'stub'
    return []
  },
})

async function smoke(label, alive) {
  let agents = 0
  const agentStub = async () => { agents += 1; return alive ? ALIVE : null }
  const parallelStub = async (thunks) => Promise.all((thunks || []).map((t) => t()))
  const pipelineStub = async (items, ...stages) => {
    const out = []
    for (let i = 0; i < (items || []).length; i++) {
      let v = items[i]
      for (const st of stages) v = await st(v, items[i], i)   // deliberately NOT caught
      out.push(v)
    }
    return out
  }
  try {
    const out = await fn(agentStub, parallelStub, pipelineStub, () => {}, () => {},
                         async () => ({}), JSON.parse(process.argv[4] || '{}'),
                         { total: null, spent: () => 0, remaining: () => Infinity })
    // The result's SCALAR fields, so a test can pin what a consumer would read off a dead
    // run — `fatalCount: 0` beside `0/8 live verdicts` is exactly the shape that lies.
    const scalars = out && typeof out === 'object'
      ? Object.fromEntries(Object.entries(out).filter(([k, v]) => k !== 'INTEGRITY' && (v === null || typeof v !== 'object')))
      : {}
    console.log(`  RUN OK  [${label}]  ${agents} agents spawned` +
                (out?.INTEGRITY ? `\n    INTEGRITY: ${String(out.INTEGRITY)}` : '') +
                (Object.keys(scalars).length ? `\n    RESULT: ${JSON.stringify(scalars)}` : ''))
    return true
  } catch (e) {
    console.error(`  RUN FAIL [${label}]\n    ${e.constructor.name}: ${e.message}`)
    return false
  }
}

const a = await smoke('all agents DEAD', false)
const b = await smoke('all agents ALIVE', true)
process.exit(a && b ? 0 : 1)
