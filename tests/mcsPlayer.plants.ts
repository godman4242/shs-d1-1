/**
 * CHAOS PLANTS — THE DUELLIST'S STANCE (L5-OPP slice 3a, 2026-09-29).
 *
 * Applied and judged by `npm run chaos` (`scripts/gates/chaos.ts`). Each entry breaks ONE
 * guard in `core/npc/MCSPlayer.ts`, its config, or the claimcheck fix this slice needed; the
 * named suite must go red. Four re-plant the Android rule this slice ruled against (×1.5
 * reach, the stop without the stance guard, the light crit, heavy launch at the Sim's 5);
 * the rest break the web rule's own arithmetic or the harness rule.
 *
 * PROVENANCE. All written here, at the port, and watched going red on the cycle that
 * wrote them — marked `reauthored:`.
 */
import type { ChaosPlant } from '../scripts/gates/chaosPlant.ts';

const PORT = 'src/core/npc/MCSPlayer.ts';
const CONFIG = 'src/config/ogMcsPlayer.ts';
const SUITE = 'tests/mcsPlayer.test.ts';

export const PLANTS: ChaosPlant[] = [
  {
    name: 'duellist stance: the Android light reach (×1.5)',
    file: CONFIG,
    find: '  lightMult: 1.4,\n',
    replace: '  lightMult: 1.5,\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — web `§1t99s0§.as:3094` ×1.4; Android `MCSPlayer.as:3030` ×1.5; ruled WEB',
  },
  {
    name: 'duellist stance: the heavy reach floor dropped',
    file: PORT,
    find: '        this.slashLength = asInt(base * (r.heavy.base + r.heavy.perMastery * this.heavyMastery * r.heavy.scale));\n        if (this.slashLength < r.floor) this.slashLength = r.floor;\n',
    replace: '        this.slashLength = asInt(base * (r.heavy.base + r.heavy.perMastery * this.heavyMastery * r.heavy.scale));\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — both builds floor heavy at 100 (web `:3117`, Android `:3053`)',
  },
  {
    name: 'duellist stance: the reload cost charged through the intro too',
    file: PORT,
    find: '    if (battle) {\n      this.reload -= OG_STANCE_CHANGE_RELOAD.cost;\n',
    replace: '    {\n      this.reload -= OG_STANCE_CHANGE_RELOAD.cost;\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — the cost sits under `isBattle()` (web `:3160`); the stub passed the "free" test, this plant proves it',
  },
  {
    name: 'duellist stance: the reload floor dropped (30 → -18)',
    file: PORT,
    find: '      if (this.reload < OG_STANCE_CHANGE_RELOAD.floor) this.reload = OG_STANCE_CHANGE_RELOAD.floor;\n',
    replace: '',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — web `:3163-3165`',
  },
  {
    name: 'duellist stance: the Android stopMoving (no stance guard)',
    file: PORT,
    find: '    if (this.actionState === OG_STATE.IDLE || !this.canChangeStance()) return;\n',
    replace: '    if (this.actionState === OG_STATE.IDLE) return;\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — web `:2442` adds `!canChangeStance()`; Android `MCSPlayer.as:2366` does not; ruled WEB',
  },
  {
    name: 'duellist stance: stopMoving without its IDLE return (init\'s call would stop an idle body)',
    file: PORT,
    find: '    if (this.actionState === OG_STATE.IDLE || !this.canChangeStance()) return;\n',
    replace: '    if (!this.canChangeStance()) return;\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — the IDLE return is what makes init\'s battle and intro calls agree; the stub passed that test, this plant proves it',
  },
  {
    name: 'duellist stance: heavy launches at the Sim\'s INFERRED 5',
    file: CONFIG,
    find: '    launch: 3,\n    /** `MCSPlayer.as:3183`',
    replace: '    launch: 5,\n    /** `MCSPlayer.as:3183`',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — ERRATUM 2 item 4: the AI branch launches heavy at 3 (`MCSPlayer.as:3182`, web `:3239`)',
  },
  {
    name: 'duellist stance: a flinch may change stance out of any state',
    file: PORT,
    find: '      (s === S.FLINCH && (p === S.IDLE || p === S.POSE || p === S.RUN || p === S.WALK))\n',
    replace: '      s === S.FLINCH\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — `MCSPlayer.as:2967`, web `:3045`: only out of idle, pose, run or walk',
  },
  {
    name: 'duellist stance: the Android light crit (×1.5)',
    file: PORT,
    find: '    if (this.reload === this.maxreload) return asInt(maxDamage * d.critMult + this.STAT_CRITICALDMG);\n',
    replace: '    if (this.reload === this.maxreload) return asInt(maxDamage * (this.stance === OG_STANCE.light ? 1.5 : d.critMult) + this.STAT_CRITICALDMG);\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — web `:3274` ×1.3 every stance; Android `MCSPlayer.as:3215-3221` ×1.5 light / ×1.2 else; ruled WEB',
  },
  {
    name: 'duellist stance: STAT_CRITICALDMG left out of the crit',
    file: PORT,
    find: '    if (this.reload === this.maxreload) return asInt(maxDamage * d.critMult + this.STAT_CRITICALDMG);\n',
    replace: '    if (this.reload === this.maxreload) return asInt(maxDamage * d.critMult);\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — both builds add it (web `:3274`)',
  },
  {
    name: 'duellist stance: startAction no-ops instead of throwing (the harness rule)',
    file: PORT,
    find: '    void actionState;\n    unported(\'MCSPlayer.startAction\');\n',
    replace: '    void actionState;\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — L5_OPPONENT_KICKOFF §3: a call into an unported group must fail loudly',
  },
  {
    name: 'claimcheck: read the digits inside a §-quoted web name again',
    file: 'scripts/gates/claimcheckLib.ts',
    find: "    if (re.test((sourceLines[n - 1] ?? '').replace(/§[^§]*§/g, ' '))) return true;\n",
    replace: "    if (re.test(sourceLines[n - 1] ?? '')) return true;\n",
    tests: ['tests/claimcheck.test.ts'],
    note: 'reauthored:2026-09-29 — the fourth false-pass hole: `§1t4414s0§` vouched for 0 and 1 on any web line',
  },
];
