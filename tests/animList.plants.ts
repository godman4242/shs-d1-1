/**
 * CHAOS PLANTS — THE ANIMLIST (finding 19, closed 2026-09-23; L5-OPP slice 0).
 *
 * Applied and judged by `npm run chaos` (`scripts/gates/chaos.ts`). Each entry breaks
 * ONE guard over the clip table, now that it carries all 18 files the source loads;
 * the named suites must go red.
 *
 * PROVENANCE. All four are written here, at the fix, and were watched going red on
 * the session that wrote them — marked `reauthored:`. Each targets a clip from a file
 * OTHER than the one the table used to read, because that is exactly the coverage the
 * old table lacked and the old byte-check could not see.
 */
import type { ChaosPlant } from '../scripts/gates/chaosPlant.ts';

const CLIPS = 'tests/ogAnimClips.test.ts';
const ATTACKERS = 'tests/animList.test.ts';

export const PLANTS: ChaosPlant[] = [
  {
    name: 'animList: drop one clip from a file the old table never read (the bear\'s attack)',
    file: 'src/config/ogAnimClips.ts',
    find: '  bear_attack: { durationFrames: 18, loop: false },',
    replace: '  // bear_attack dropped',
    tests: [CLIPS, ATTACKERS],
    note: 'reauthored:2026-09-23 — finding 19 in miniature: the byte-check, the 428-of-429 pin and the bear all see it',
  },
  {
    name: 'animList: make an attack clip loop, so it never finishes (the boar\'s)',
    file: 'src/config/ogAnimClips.ts',
    find: '  boar_attack: { durationFrames: 16, loop: false },',
    replace: '  boar_attack: { durationFrames: 16, loop: true },',
    tests: [CLIPS, ATTACKERS],
    note: 'reauthored:2026-09-23 — a looping attack clip reproduces the freeze with every clip DEFINED',
  },
  {
    name: 'animList: drop AnimData\'s hold from the katana\'s attack (the bare d= this table carried until the gauntlet)',
    file: 'src/config/ogAnimClips.ts',
    find: '  katanaattack: { durationFrames: 18, loop: false },',
    replace: '  katanaattack: { durationFrames: 10, loop: false },',
    tests: [CLIPS, 'tests/duelSeam.test.ts'],
    note: 'reauthored:2026-09-23 — the gauntlet\'s finding: the byte-check, the structural pin and the 750 ms telegraph all see it',
  },
  {
    name: 'animList: shift one stance-file duration by a frame (the balanced stance idle)',
    file: 'src/config/ogAnimClips.ts',
    find: '  balanced_stance: { durationFrames: 1, loop: false },',
    replace: '  balanced_stance: { durationFrames: 2, loop: false },',
    tests: [CLIPS],
    note: 'reauthored:2026-09-23 — a stance file is the body L5-OPP ports next; only the byte-check can see a ±1',
  },
];
