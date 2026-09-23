/**
 * FINDING 19, MEASURED AND CLOSED — THE ATTACKERS ON THE SOURCE'S OWN animList.
 *
 * Until 2026-09-23 `OG_ANIM_CLIPS` held one animation file of the 18 the source
 * loads (`MCSCharacter.initAnimationData`), so an actor that asked for a clip from
 * any other file got `null` and `startAnim` no-op'd. Finding 19 guessed the cost
 * ("may never leave ATTACK"). This suite measures it on the REAL `OgAnimLibrary`,
 * in the REAL duel world, behind the REAL `NpcController`, against a still player:
 * seven classes swung once and never changed state again for thirty seconds.
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

type ActorClass = new (world: NpcWorld, anims: AnimLibrary, geometry: HitGeometry, rng: Rng) => Npc;

/** The 13 attacking classes, each with the roster `ai` whose first row spawns it. */
const ATTACKERS: ReadonlyArray<readonly [string, ActorClass, number]> = [
  ['EnemyKatana', EnemyKatana, 3],
  ['EnemyKnife', EnemyKnife, 1],
  ['EnemyArcher', EnemyArcher, 2],
  ['EnemyBear', EnemyBear, 17],
  ['EnemyBoar', EnemyBoar, 18],
  ['EnemyStag', EnemyStag, 21],
  ['EnemySpear', EnemySpear, 4],
  ['EnemyWolf', EnemyWolf, 8],
  ['EnemyWolfAlpha', EnemyWolfAlpha, 11],
  ['EnemyFox', EnemyFox, 24],
  ['RoomGoblin', RoomGoblin, 22],
  ['RoomOgre', RoomOgre, 23],
  ['EnemySpearElite', EnemySpearElite, 28],
];

/** The seven that swung once and froze on the one-file table (2026-09-23). */
const FROZE = ['EnemyBear', 'EnemyBoar', 'EnemyStag', 'EnemyWolf', 'EnemyWolfAlpha', 'EnemyFox', 'EnemySpearElite'];

const SECONDS = 30;
const SPAWN_X = 500;
const GAP = 60;

interface Fight {
  readonly attacksStarted: number;
  readonly startsAfterFirstAttack: number;
  readonly unresolvedClips: readonly string[];
}

/** One actor, spawned in the source's order, against a still player for 30 s. */
function fight(cls: ActorClass, ai: number): Fight {
  const world = createDuelWorld();
  const actor = new cls(world, new OgAnimLibrary(), new DuelHitGeometry(), mulberry32(7));
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
  const results = new Map(ATTACKERS.map(([name, cls, ai]) => [name, fight(cls, ai)]));

  it('no attacker asks for a clip the table does not define, in 30 s of a duel', () => {
    for (const [name, r] of results) {
      expect(r.unresolvedClips, `${name} asked for undefined clips`).toEqual([]);
    }
  });

  it('the seven that froze after one swing now leave ATTACK and swing again', () => {
    for (const name of FROZE) {
      const r = results.get(name);
      expect(r?.startsAfterFirstAttack, `${name} never left its first ATTACK`).toBeGreaterThan(0);
      expect(r?.attacksStarted, `${name} swung only once`).toBeGreaterThan(1);
    }
  });

  it('the three that never enter ATTACK against a still player do so on either table — not this finding', () => {
    // Measured identical on the one-file and the full table: the spear attacks by
    // its charging RUN (WALK <-> RUN, and it passes the player); the goblin and the
    // ogre are room NPCs that wander, idle and nap. Pinned so a later change that
    // makes them swing is SEEN, not assumed to be this fix.
    for (const name of ['EnemySpear', 'RoomGoblin', 'RoomOgre']) {
      expect(results.get(name)?.attacksStarted, name).toBe(0);
    }
  });
});
