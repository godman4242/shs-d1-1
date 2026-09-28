/**
 * CHAOS PLANTS — THE DUELLIST PROFILE WRITERS (L5-OPP slice 2, 2026-09-29).
 *
 * Applied and judged by `npm run chaos` (`scripts/gates/chaos.ts`). Each entry breaks
 * ONE guard in `core/npc/duellistWriter.ts` or its config; the named suite must go red.
 * Three re-plant the Android writer this slice ruled against (no creator comma, 14 fields,
 * no checksum); three break the web writer's own arithmetic (the slash-usage floor, the
 * defense bonus, the checksum modulus); one drops the clan-invitation name (both builds);
 * one swaps two new-player slots, which claimcheck cannot see (both ids sit on its cited lines).
 *
 * PROVENANCE. All written here, at the port, and watched going red on the cycle that
 * wrote them — marked `reauthored:`.
 */
import type { ChaosPlant } from '../scripts/gates/chaosPlant.ts';

const PORT = 'src/core/npc/duellistWriter.ts';
const CONFIG = 'src/config/ogDuellistProfile.ts';
const SUITE = 'tests/duellistWriter.test.ts';

export const PLANTS: ChaosPlant[] = [
  {
    name: 'duellist writer: the Android comma test (a creator alone gets no comma)',
    file: PORT,
    find: '    it.uses > ZERO || it.named || it.creator !== \'\') {\n',
    replace: '    it.uses > ZERO || it.named) {\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — web `§1t17s0§.as:330` tests `creator != ""`; Android `Item.as:232` does not; ruled WEB',
  },
  {
    name: 'duellist writer: the Android 14-field battle string',
    file: PORT,
    find: '  return `${str}${minDamage}|${damageRange}|${slashUsage}|${defense}`;\n',
    replace: '  return str.replace(/\\|$/, \'\');\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — web `§1t1523s0§.as:5153` appends four fields; Android `StatsManager.as:4396-4415` writes 14; ruled WEB',
  },
  {
    name: 'duellist writer: no ^checksum (the Android eq and skill strings)',
    file: PORT,
    find: '  return checksum ? `${str}${OG_PROFILE_SUFFIX_SEP}${profileChecksum(str)}` : str;\n',
    replace: '  return str;\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — web `§1t1523s0§.as:5172`/`:5231` append `^` + checksum by default; Android does not; ruled WEB',
  },
  {
    name: 'duellist writer: the slash-usage floor dropped from the battle string',
    file: PORT,
    find: '    slashUsage = Math.max(row.slashusage ?? OG_ITEM_DEFAULT_SLASHUSAGE, w.slashUsageFloor);\n',
    replace: '    slashUsage = row.slashusage ?? OG_ITEM_DEFAULT_SLASHUSAGE;\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — web `§1t1523s0§.as:5147-5149`: 13031\'s slashusage 24 is written as 48',
  },
  {
    name: 'duellist writer: the defense field without its equipment bonus',
    file: PORT,
    find: '  const defense = ((s.stats[OG_STAT.defense] ?? ZERO) + findBonusStat(OG_STAT.defense, s.equipment)) | ZERO;\n',
    replace: '  const defense = s.stats[OG_STAT.defense] ?? ZERO;\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — web `§1t1523s0§.as:5152` adds `§1t7358s0§(DEFENSE)`: fixture 2 writes 71, not 20',
  },
  {
    name: 'duellist writer: the clan-invitation name branch dropped',
    file: PORT,
    find: '  if (it.named || OG_CLAN_INVITATION_IDS.includes(it.itemID)) str += ',
    replace: '  if (it.named) str += ',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — `Item.as:252`, web `§1t17s0§.as:364`: `named || isClanInvitation(id)`; both builds',
  },
  {
    name: 'duellist writer: the checksum modulus',
    file: CONFIG,
    find: 'export const OG_PROFILE_CHECKSUM_MOD = 54321;\n',
    replace: 'export const OG_PROFILE_CHECKSUM_MOD = 65536;\n',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — web `§1t1523s0§.as:568`; only the 1000 × "9" test passes 54321',
  },
  {
    name: 'new player: pants and shoes swapped (both ids sit on the cited lines, so claimcheck passes it)',
    file: CONFIG,
    find: '    pants: 11017, shoes: 12017,',
    replace: '    pants: 12017, shoes: 11017,',
    tests: [SUITE],
    note: 'reauthored:2026-09-29 — `StatsManager.as:732-733`: EQ_PANTS = 7 gets pantsid 11017, EQ_SHOES = 8 gets shoesid 12017',
  },
];
