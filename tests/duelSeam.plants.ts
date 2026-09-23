/**
 * CHAOS PLANTS — THE UNITS AND THE WINDUP (findings 15 and 18, closed 2026-09-23).
 *
 * Applied and judged by `npm run chaos` (`scripts/gates/chaos.ts`). Each entry breaks
 * ONE guard the seam's tests claim; the named suite must go red.
 *
 * PROVENANCE. All six are written here, at the fix, and were watched going red on the
 * session that wrote them — they carry that session's reasoning, marked `reauthored:`.
 * Two of them are the two wrong fixes this session could have shipped: the kickoff's
 * own instruction (convert the actor's distances at the seam — finding 15 turned out
 * not to be a defect) and the kickoff's own suggested detector (a clip restart, which
 * a looping walk also produces).
 */
import type { ChaosPlant } from '../scripts/gates/chaosPlant.ts';

const SEAM = 'tests/duelSeam.test.ts';
const CONTROLLER = 'tests/npcController.test.ts';

export const PLANTS: ChaosPlant[] = [
  {
    name: 'units: scale the distance the actor sees at the seam (the kickoff\'s conversion)',
    file: 'src/core/npc/NpcController.ts',
    find: '    this.proxy.x = view.playerPos.x;',
    replace: '    this.proxy.x = view.enemyPos.x + (view.playerPos.x - view.enemyPos.x) * (OG_FPS / FIXED_HZ + ONE);',
    tests: [SEAM],
    note: 'reauthored:2026-09-23 — finding 15 closed as not-a-defect; any seam scale leaves the commit band',
  },
  {
    name: 'windup: telegraph only the first attack (what the spike measured)',
    file: 'src/core/npc/NpcController.ts',
    find: '      if (this.attacksStarted !== attacksBefore) {',
    replace: '      if (this.attacksStarted !== attacksBefore && this.attacksStarted === ONE) {',
    tests: [SEAM],
    note: 'reauthored:2026-09-23 — the too-few half of finding 18\'s gate',
  },
  {
    name: 'windup: telegraph every step spent in ATTACK',
    file: 'src/core/npc/NpcController.ts',
    find: '      if (this.attacksStarted !== attacksBefore) {',
    replace: '      if (npc.actionState === OG_STATE.ATTACK) {',
    tests: [SEAM],
    note: 'reauthored:2026-09-23 — the too-many half: a gate proving only "more telegraphs" passes this',
  },
  {
    name: 'windup: treat any clip restart as a swing (a looping walk\'s wrap included)',
    file: 'src/core/npc/NpcController.ts',
    find: '      if (this.attacksStarted !== attacksBefore) {',
    replace: '      if (npc.frameCounter === ZERO) {',
    tests: [SEAM],
    note: 'reauthored:2026-09-23 — the kickoff\'s suggested detector, unguarded; the loop-wrap test must catch it',
  },
  {
    name: 'katana: enter ATTACK by assignment, around startAction',
    file: 'src/core/npc/EnemyKatana.ts',
    find: [
      '          if (this.x - playerX < OG_KATANA.melee.x && this.y - playerY < OG_KATANA.melee.dyLeft) {',
      '            this.startAction(OG_STATE.ATTACK);',
    ].join('\n'),
    replace: [
      '          if (this.x - playerX < OG_KATANA.melee.x && this.y - playerY < OG_KATANA.melee.dyLeft) {',
      '            this.actionState = OG_STATE.ATTACK;',
      '            this.startAnim(OG_ANIM.KATANAATTACK);',
    ].join('\n'),
    tests: [CONTROLLER, SEAM],
    note: 'reauthored:2026-09-23 — the one bypass the windup cannot see; the source scan and the duel both catch it',
  },
  {
    name: 'seam: stop relaying the actor\'s walk once it has attacked (a real statue)',
    file: 'src/core/npc/NpcController.ts',
    find: '    if (stepped) this.heldMoveX = Math.sign(moved);',
    replace: '    if (stepped) this.heldMoveX = this.attacksStarted === ZERO ? Math.sign(moved) : ZERO;',
    tests: [SEAM],
    note: 'reauthored:2026-09-23 — the statue test is the guard that the katana re-closes when the gap opens',
  },
];
