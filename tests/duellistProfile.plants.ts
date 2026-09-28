/**
 * CHAOS PLANTS — THE DUELLIST PROFILE STRINGS (L5-OPP slice 1a, 2026-09-28).
 *
 * Applied and judged by `npm run chaos` (`scripts/gates/chaos.ts`). Each entry breaks
 * ONE guard in `core/npc/duellistProfile.ts` or its config; the named suite must go
 * red. Four re-plant the Android build's behaviour where ruling R6 shipped the web
 * build's (no battle-string guard, the modifier cap, no id floor, no `^` cut), so a quiet
 * revert to Android cannot pass either.
 *
 * PROVENANCE. All eight are written here, at the port, and were watched going red on
 * the cycle that wrote them — marked `reauthored:`. Writing them found one missing
 * test (an 18-field string through `parsePlayerStats`), added before they ran.
 */
import type { ChaosPlant } from '../scripts/gates/chaosPlant.ts';

const PORT = 'src/core/npc/duellistProfile.ts';
const SUITE = 'tests/duellistProfile.test.ts';

export const PLANTS: ChaosPlant[] = [
  {
    name: 'duellist profile: drop the web build\'s battle-string guard (the Android parse)',
    file: PORT,
    find: '    if (i <= OG_BATTLE_STATS_WEB_LAST_FIELD) stats[statIndex] = asInt(field);\n',
    replace: '    stats[statIndex] = asInt(field);\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-28 — R6: web drops fields 14–17 (`if(_loc5_ <= 13)`); Android lets them overwrite buff2Expiry. The first draft of this plant planted the WEB behaviour as the bug; the review caught it',
  },
  {
    name: 'duellist profile: stop dropping the last field of a slot-by-slot stats string',
    file: PORT,
    find: '  for (let i = ZERO; i < fields.length - ONE; i++) stats[i] = asInt(fields[i]);\n',
    replace: '  for (let i = ZERO; i < fields.length; i++) stats[i] = asInt(fields[i]);\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-28 — `i < strArray.length - 1`, the trailing-separator assumption',
  },
  {
    name: 'duellist profile: stop routing 18-field stats strings through the battle parse',
    file: 'src/config/ogDuellistProfile.ts',
    find: 'export const OG_BATTLE_STATS_LENGTHS: readonly number[] = [14, 18];',
    replace: 'export const OG_BATTLE_STATS_LENGTHS: readonly number[] = [14];',
    tests: [SUITE],
    note: 'reauthored:2026-09-28 — this plant stayed green until the 18-field routing test was added',
  },
  {
    name: 'duellist profile: coerce with a plain truncation instead of AS3 `int()` (junk becomes NaN)',
    file: PORT,
    find: '  return Number(x) | ZERO;\n',
    replace: '  return Math.trunc(Number(x));\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-28 — ToInt32 turns NaN into 0; a truncation does not',
  },
  {
    name: 'duellist profile: re-plant the Android modifier cap the web build does not have',
    file: PORT,
    find: '        modifiers.push({ modifierID: modid, value: asInt(raw) });\n',
    replace: '        modifiers.push({ modifierID: modid, value: Math.min(asInt(raw), OG_PLAYER_STATS_COUNT) });\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-28 — R6: the web build never clamps; any cap below 500 must go red',
  },
  {
    name: 'duellist profile: read modifiers on any item string with two OR MORE comma fields',
    file: PORT,
    find: '  if (parts.length === TWO) {\n',
    replace: '  if (parts.length >= TWO) {\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-28 — `strArray.length == 2` exactly: a third comma drops every modifier',
  },
  {
    name: 'duellist profile: drop the web build\'s skill-id floor (the Android parse)',
    file: PORT,
    find: '  if (id < OG_SKILL_ID_FLOOR) id += OG_SKILL_ID_FLOOR;\n',
    replace: '',
    tests: [SUITE],
    note: 'reauthored:2026-09-28 — R6: a legacy id below 1000 must land on the skill table',
  },
  {
    name: 'duellist profile: drop the web build\'s `^` cut (the Android parse)',
    file: PORT,
    find: '  return str.split(OG_PROFILE_SUFFIX_SEP)[ZERO] ?? str;\n',
    replace: '  return str;\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-28 — R6: a web-format string carries a suffix after `^`',
  },
];
