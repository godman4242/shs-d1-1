/**
 * CHAOS PLANTS — THE DUELLIST'S BODY STATS (L5-OPP slice 1b-ii, 2026-09-29).
 *
 * Applied and judged by `npm run chaos` (`scripts/gates/chaos.ts`). Each entry breaks
 * ONE guard in `core/npc/duellistBody.ts` or its config; the named suite must go red.
 * Four re-plant the Android build this slice ruled against (the level bands, ×0.8, the
 * 5-second reload, no stance argument); one re-plants the local player's seven-argument
 * `initAttackStats`, which is the call a reader would assume.
 *
 * PROVENANCE. All written here, at the port, and watched going red on the cycle that
 * wrote them — marked `reauthored:`.
 */
import type { ChaosPlant } from '../scripts/gates/chaosPlant.ts';

const PORT = 'src/core/npc/duellistBody.ts';
const CONFIG = 'src/config/ogDuellistProfile.ts';
const SUITE = 'tests/duellistBody.test.ts';

export const PLANTS: ChaosPlant[] = [
  {
    name: 'duellist body: scale every level above 30 (the Android band)',
    file: PORT,
    find: '  if (level > s.strong.above && level < s.strong.below) return s.strongMult;\n',
    replace: '  if (level > s.strong.above) return s.strongMult;\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — web `§1t122s0§.as:812` adds `level < 80`; Android `EnemyPlayer.as:792` does not',
  },
  {
    name: 'duellist body: scale below 10 by the Android 0.8',
    file: CONFIG,
    find: '  weakMult: 0.9,\n',
    replace: '  weakMult: 0.8,\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — web `§1t122s0§.as:820` ×0.9, Android `EnemyPlayer.as:800` ×0.8; ruled WEB',
  },
  {
    name: 'duellist body: the Android 5-second maxreload',
    file: CONFIG,
    find: '  maxReloadSec: 8,\n',
    replace: '  maxReloadSec: 5,\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — web `§1t99s0§.as:249` `8 * 24`, Android `MCSPlayer.as:239` `5 * 24`; ruled WEB',
  },
  {
    name: 'duellist body: ignore the web stance argument (Android has none)',
    file: PORT,
    find: '  if (stance !== OG_NO_STANCE) return stance;\n',
    replace: '',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — web `§1t122s0§.as:858` `if(param1.stance != -1)`',
  },
  {
    name: 'duellist body: pass critical and piercing into the body (the local player\'s 7-argument call)',
    file: PORT,
    find: '    criticalDmg: ZERO,\n    piercingDmg: ZERO,\n',
    replace: '    criticalDmg: d.criticalDmg,\n    piercingDmg: d.piercingDmg,\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — `EnemyPlayer.as:762` passes five arguments; only `StatsManager.as:1835` passes seven',
  },
  {
    name: 'duellist body: start at the saved current HP instead of full',
    file: PORT,
    find: '    hp: maxHp,\n',
    replace: '    hp: d.currentHp,\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — `EnemyPlayer.as:764-767` `if(controlledBy == 1) setHP(xml.hp)`',
  },
  {
    name: 'duellist body: refill chi to the max',
    file: PORT,
    find: '    chi: d.currentChi,\n',
    replace: '    chi: d.chi,\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — `MCSPlayer.as:187` `setChi(chi)` is the saved current chi; nothing refills it',
  },
  {
    name: 'duellist body: STAT_ATK from minDamage instead of attack',
    file: PORT,
    find: '    statAtk: d.attack,\n',
    replace: '    statAtk: d.minDamage,\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — `EnemyPlayer.as:762` `initAttackStats(xml.attack, …)`',
  },
  {
    name: 'duellist body: round the level scaling instead of truncating',
    file: PORT,
    find: '    minDamage: (d.minDamage * scale) | ZERO,\n',
    replace: '    minDamage: Math.round(d.minDamage * scale),\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — `minDamage` is an `int` field (`MCSPlayer.as:69`): `*= 0.9` stores ToInt32',
  },
  {
    name: 'duellist body: truncate the slash length instead of flooring',
    file: PORT,
    find: '(sp.slashLength.base + Math.floor((sp.slashLength.maxIncrement',
    replace: '(sp.slashLength.base + Math.trunc((sp.slashLength.maxIncrement',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — `EnemyPlayer.as:757` `Math.floor`, which differs from truncation below zero',
  },
  {
    name: 'duellist body: test 1501 (dual) before 1500 (reversed)',
    file: PORT,
    find: '  if (getMastery(d.skills, OG_STANCE_SKILL.reversed) > ZERO) return OG_STANCE.reversed;\n  if (getMastery(d.skills, OG_STANCE_SKILL.dual) > ZERO) return OG_STANCE.dual;\n',
    replace: '  if (getMastery(d.skills, OG_STANCE_SKILL.dual) > ZERO) return OG_STANCE.dual;\n  if (getMastery(d.skills, OG_STANCE_SKILL.reversed) > ZERO) return OG_STANCE.reversed;\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — `EnemyPlayer.as:836` tests 1500 first, `:840` 1501',
  },
  {
    name: 'duellist body: let light win the light = heavy tie',
    file: PORT,
    find: '  if (light > balanced && light >= heavy) selected = OG_STANCE.light;\n  if (heavy > balanced && heavy >= light) selected = OG_STANCE.heavy;\n',
    replace: '  if (heavy > balanced && heavy >= light) selected = OG_STANCE.heavy;\n  if (light > balanced && light >= heavy) selected = OG_STANCE.light;\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — `EnemyPlayer.as:850-858`: the heavy test runs second, so it wins the tie',
  },
  {
    name: 'duellist body: draw the random stance even when the masteries do not tie',
    file: PORT,
    find: '  if (light === balanced && balanced === heavy) return (rng() * OG_RANDOM_STANCE_COUNT) | ZERO;\n',
    replace: '  const draw = (rng() * OG_RANDOM_STANCE_COUNT) | ZERO;\n  if (light === balanced && balanced === heavy) return draw;\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — `EnemyPlayer.as:846`: `Math.random()` is called only in the tie branch',
  },
];
