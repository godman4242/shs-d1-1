/**
 * FINDING 19, MEASURED AND CLOSED — THE ATTACKERS ON THE SOURCE'S OWN animList.
 *
 * Until 2026-09-23 `OG_ANIM_CLIPS` held one animation file of the 18 the source
 * loads (`MCSCharacter.initAnimationData`), so an actor that asked for a clip from
 * any other file got `null` and `startAnim` no-op'd. Finding 19 guessed the cost
 * ("may never leave ATTACK"). This suite measures it on the REAL `OgAnimLibrary`,
 * in the REAL duel world, behind the REAL `NpcController`, against a still player:
 * TEN classes — exactly the ten finding 19 named — swung once and never changed
 * state again for thirty seconds.
 *
 * Each is built as the variant that FIGHTS, because three of them only fight
 * sometimes, and a test that builds the other variant measures nothing:
 *   - `EnemySpear` rolls `isStabber` at construction (`EnemySpear.as:19`); only a
 *     stabber enters ATTACK (`:233-235`). The non-stabber charges by RUN instead.
 *   - `RoomGoblin` / `RoomOgre` come from the ROOM dispatch with a `doChase` flag the
 *     room data sets (`Obj_NPCAggro.as:58-63` → `NPCManager.as:710-716`); without it
 *     they wander and nap. (The MAIN dispatch's ai 22/23 are the unported
 *     `EnemyGoblin` / `EnemyOgre`, `NPCManager.as:584-588`.)
 * A first version of this file built all three as the non-fighting variant and
 * called them "not this finding"; the gauntlet review of 2026-09-23 caught it.
 *
 * Construction follows the source's order — `NPCManager.createNPC` calls
 * `setPosition` BEFORE `init` (`NPCManager.as:636-637`) — because the reverse
 * spawns a mid-air wolf whose FALL → LAND ends in a looping `WOLF_DOWNED` that LAND
 * never leaves (`EnemyWolfAlpha.as:151-163`, `:429`): a real source trait, and not
 * this finding.
 */
import { describe, expect, it } from 'vitest';
import { OG_STATE, type OgState } from '../src/config/ogActor';
import { OG_NPCS } from '../src/config/ogNpcs';
import { FIXED_HZ } from '../src/config/timing';
import { EnemyArcher } from '../src/core/npc/EnemyArcher';
import { EnemyBear } from '../src/core/npc/EnemyBear';
import { EnemyBoar } from '../src/core/npc/EnemyBoar';
import { EnemyFox } from '../src/core/npc/EnemyFox';
import { EnemyKatana } from '../src/core/npc/EnemyKatana';
import { EnemyKnife } from '../src/core/npc/EnemyKnife';
import { EnemySpear } from '../src/core/npc/EnemySpear';
import { EnemySpearElite } from '../src/core/npc/EnemySpearElite';
import { EnemyStag } from '../src/core/npc/EnemyStag';
import { EnemyWolf } from '../src/core/npc/EnemyWolf';
import { EnemyWolfAlpha } from '../src/core/npc/EnemyWolfAlpha';
import { RoomGoblin } from '../src/core/npc/RoomGoblin';
import { RoomOgre } from '../src/core/npc/RoomOgre';
import type { Npc } from '../src/core/npc/Npc';
import { NpcController } from '../src/core/npc/NpcController';
import { createDuelWorld, DuelHitGeometry, OgAnimLibrary } from '../src/core/npc/duelSeam';
import type { AnimLibrary, HitGeometry, NpcTarget, NpcWorld } from '../src/core/npc/types';
import { mulberry32 } from '../src/core/rng';
import type { Rng } from '../src/core/Sim';

type Build = (world: NpcWorld, anims: AnimLibrary, geometry: HitGeometry, rng: Rng) => Npc;

/**
 * The 13 attacking classes: how the source builds each (as the variant that fights)
 * and the roster `ai` of the row it is initialised from.
 */
const ATTACKERS: ReadonlyArray<readonly [string, Build, number]> = [
  ['EnemyKatana', (w, a, g, r) => new EnemyKatana(w, a, g, r), 3],
  ['EnemyKnife', (w, a, g, r) => new EnemyKnife(w, a, g, r), 1],
  ['EnemyArcher', (w, a, g, r) => new EnemyArcher(w, a, g, r), 2],
  ['EnemyBear', (w, a, g, r) => new EnemyBear(w, a, g, r), 17],
  ['EnemyBoar', (w, a, g, r) => new EnemyBoar(w, a, g, r), 18],
  ['EnemyStag', (w, a, g, r) => new EnemyStag(w, a, g, r), 21],
  ['EnemySpear', (w, a, g, r) => {
    const spear = new EnemySpear(w, a, g, r);
    spear.isStabber = true;
    return spear;
  }, 4],
  ['EnemyWolf', (w, a, g, r) => new EnemyWolf(w, a, g, r), 8],
  ['EnemyWolfAlpha', (w, a, g, r) => new EnemyWolfAlpha(w, a, g, r), 11],
  ['EnemyFox', (w, a, g, r) => new EnemyFox(w, a, g, r), 24],
  ['RoomGoblin', (w, a, g, r) => new RoomGoblin(w, a, g, r, null, true), 22],
  ['RoomOgre', (w, a, g, r) => new RoomOgre(w, a, g, r, null, true), 23],
  ['EnemySpearElite', (w, a, g, r) => new EnemySpearElite(w, a, g, r), 28],
];

/** Finding 19's ten: on the one-file table each swung once and froze (2026-09-23). */
const FROZE = [
  'EnemyBear', 'EnemyBoar', 'EnemyStag', 'EnemySpear', 'EnemyWolf',
  'EnemyWolfAlpha', 'EnemyFox', 'RoomGoblin', 'RoomOgre', 'EnemySpearElite',
];

const SECONDS = 30;
const SPAWN_X = 500;
const GAP = 60;

interface Fight {
  readonly attacksStarted: number;
  readonly startsAfterFirstAttack: number;
  readonly unresolvedClips: readonly string[];
}

/** One actor, spawned in the source's order, against a still player for 30 s. */
function fight(build: Build, ai: number): Fight {
  const world = createDuelWorld();
  const actor = build(world, new OgAnimLibrary(), new DuelHitGeometry(), mulberry32(7));
  const row = OG_NPCS.find((r) => r.aiEffective === ai);
  if (row === undefined) throw new Error(`no roster row with ai ${String(ai)}`);
  actor.setPosition(SPAWN_X, world.groundY);
  actor.init(row);

  const starts: OgState[] = [];
  const startAction = actor.startAction.bind(actor);
  actor.startAction = (state: OgState): void => {
    starts.push(state);
    startAction(state);
  };
  const unresolved = new Set<string>();
  const startAnim = actor.startAnim.bind(actor);
  actor.startAnim = (name: string): void => {
    if (actor.clipOf(name) === null) unresolved.add(name);
    startAnim(name);
  };

  const controller = new NpcController(actor);
  const proxy: NpcTarget | null = actor.target;
  world.nearestEnemy = (): NpcTarget | null => proxy;
  const player = { x: SPAWN_X - GAP, y: world.groundY };
  for (let frame = 0; frame < SECONDS * FIXED_HZ; frame += 1) {
    controller.next(frame, {
      playerPos: player,
      enemyPos: { x: actor.posX, y: actor.y },
      playerStance: 'balanced',
      enemyStance: 'balanced',
      enemyFocus: 0,
      playerJumping: false,
    });
  }
  const first = starts.indexOf(OG_STATE.ATTACK);
  return {
    attacksStarted: starts.filter((s) => s === OG_STATE.ATTACK).length,
    startsAfterFirstAttack: first < 0 ? 0 : starts.length - first - 1,
    unresolvedClips: [...unresolved],
  };
}

describe('finding 19 — the attackers on the source\'s full animList', () => {
  const results = new Map(ATTACKERS.map(([name, build, ai]) => [name, fight(build, ai)]));

  it('no attacker asks for a clip the table does not define, in 30 s of a duel', () => {
    for (const [name, r] of results) {
      expect(r.unresolvedClips, `${name} asked for undefined clips`).toEqual([]);
    }
  });

  it('the ten that froze after one swing now leave ATTACK and swing again', () => {
    for (const name of FROZE) {
      const r = results.get(name);
      expect(r?.startsAfterFirstAttack, `${name} never left its first ATTACK`).toBeGreaterThan(0);
      expect(r?.attacksStarted, `${name} swung only once`).toBeGreaterThan(1);
    }
  });
});
