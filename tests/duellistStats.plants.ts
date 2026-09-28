/**
 * CHAOS PLANTS — THE DUELLIST'S DERIVED STATS (L5-OPP slice 1b-i, 2026-09-28).
 *
 * Applied and judged by `npm run chaos` (`scripts/gates/chaos.ts`). Each entry breaks
 * ONE guard in `core/npc/duellistStats.ts` or its config; the named suite must go red.
 * Three re-plant a build or premise this slice ruled against: the Android sum (hair
 * read), the kickoff's "the web never adds the table modifiers", and the halving test
 * that Duel Mode never reaches. One re-plants the guess the port refuses to make (a
 * numeric merge where the web source concatenates).
 *
 * PROVENANCE. All ten written here, at the port, and watched going red on the cycle
 * that wrote them — marked `reauthored:`.
 */
import type { ChaosPlant } from '../scripts/gates/chaosPlant.ts';

const PORT = 'src/core/npc/duellistStats.ts';
const SUITE = 'tests/duellistStats.test.ts';

export const PLANTS: ChaosPlant[] = [
  {
    name: 'duellist stats: read the hair slot again (the Android sum)',
    file: 'src/config/ogDuellistProfile.ts',
    find: '[OG_EQ.head, OG_EQ.neck, OG_EQ.scabbard, OG_EQ.hair]',
    replace: '[OG_EQ.head, OG_EQ.neck, OG_EQ.scabbard]',
    tests: [SUITE],
    note: 'reauthored:2026-09-28 — web `§1t1523s0§.as:2476` also skips `§1t9441s0§` (hair); ruled WEB',
  },
  {
    name: 'duellist stats: drop the item row\'s modifiers (the kickoff\'s wrong premise)',
    file: PORT,
    find: '  for (const tableMod of row.modifiers ?? []) {\n',
    replace: '  for (const tableMod of [] as NonNullable<OgItem[\'modifiers\']>) {\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-28 — the web sum reaches them through `Item.getModifiers` (`§1t17s0§.as:1703-1729`)',
  },
  {
    name: 'duellist stats: merge a same-id table modifier by numeric addition instead of refusing',
    file: PORT,
    find: '    if (merges) {\n',
    replace: '    if (merges && tableMod.id < ZERO) {\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-28 — `§1t17s0§.as:1717` adds an XMLList with no `int()`; unmeasured, so it must stay loud',
  },
  {
    name: 'duellist stats: stop capping the HP pool when it merges into an own HP modifier',
    file: PORT,
    find: 'Math.min((own.value + pool) | ZERO, OG_MOD_TO_HP.mergedCap)',
    replace: '(own.value + pool) | ZERO',
    tests: [SUITE],
    note: 'reauthored:2026-09-28 — `§1t17s0§.as:1697-1699`, the 173 cap',
  },
  {
    name: 'duellist stats: keep a negative HP pool instead of dropping it',
    file: PORT,
    find: '  if (pool > ZERO) {\n',
    replace: '  if (pool !== ZERO) {\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-28 — `if(_loc3_ > 0)`: a pool at or below zero vanishes, attack and all',
  },
  {
    name: 'duellist stats: merge the pool into the FIRST own HP modifier, not the last',
    file: PORT,
    find: '      if (mod.modifierID === OG_STAT.maxHp) hpIndex = mods.length - ONE;\n',
    replace: '      if (mod.modifierID === OG_STAT.maxHp && hpIndex < ZERO) hpIndex = mods.length - ONE;\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-28 — `_loc4_` is overwritten on every own HP modifier',
  },
  {
    name: 'duellist stats: treat a buff that expires AT the clock as live',
    file: PORT,
    find: '(stats[OG_STAT.buffExpiry] ?? ZERO) > serverTime',
    replace: '(stats[OG_STAT.buffExpiry] ?? ZERO) >= serverTime',
    tests: [SUITE],
    note: 'reauthored:2026-09-28 — web `§1t76s0§.as:376`: `_loc10_[39] > _loc12_`, strict',
  },
  {
    name: 'duellist stats: floor the buffed stat instead of an int store (negative stats round away from zero)',
    file: PORT,
    find: '    attack = (attack * OG_BUFF_MULT) | ZERO;\n',
    replace: '    attack = Math.floor(attack * OG_BUFF_MULT);\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-28 — `this.attack *= 1.5` into an `int` field is ToInt32: toward zero',
  },
  {
    name: 'duellist stats: port the halving test as if Duel Mode reached it',
    file: PORT,
    find: '  const weaponID = equipment[OG_EQ.weapon]?.itemID ?? ZERO;\n',
    replace: '  if ((stats[OG_STAT.buff2Expiry] ?? ZERO) !== ZERO) attack = (attack / (ONE + ONE)) | ZERO;\n  const weaponID = equipment[OG_EQ.weapon]?.itemID ?? ZERO;\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-28 — the halving test reads a PvP-room / war-room `action`, and the Sim has neither room',
  },
  {
    name: 'duellist stats: "fix" the elemental defences to read their own element',
    file: PORT,
    find: '    fireDef: withBonus(OG_STAT.fireDef, OG_STAT.waterAtk),\n',
    replace: '    fireDef: withBonus(OG_STAT.fireDef, OG_STAT.fireAtk),\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-28 — `XMLNpc.as:334`: FIREDEF = stats[WATERATK], in both builds and the roster constructor',
  },
];
