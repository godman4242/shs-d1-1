/**
 * DUEL ARENA CONFIG — pure data, no logic. ALL values INFERRED.
 *
 * Stage-2 duel layout: fighter positions/hitboxes on the 1024×576 stage.
 * Stats come from combat-sim.ts (PLAYER_BASE / ENEMY_BASE) — this file only
 * places bodies in the arena. Stage-1's DUMMY_SPAWN/DUEL_ATTACKER test-dummy
 * setup was superseded here in Stage 2 M2 (pins moved in the same commit).
 */
export interface SpawnPoint {
  /** Structurally identical to core's Vec — config may not import core. */
  pos: { x: number; y: number };
  halfW: number;
  halfH: number;
}

/** INFERRED — player left-of-center, enemy right, both on the foreground
 * ground band of the 1024×576 stage. Hitboxes ≈ 52×120 px capsules. */
export const DUEL_SPAWNS: Record<'player' | 'enemy', SpawnPoint> = {
  player: { pos: { x: 260, y: 430 }, halfW: 26, halfH: 60 },
  enemy: { pos: { x: 700, y: 430 }, halfW: 26, halfH: 60 },
};

/** INFERRED — Stage-2 duel opponent identity (nameplate "NAME (LEVEL)" —
 * fidelity tell 22; level 1 makes the Victory rewards read +10/+8 exactly,
 * the Stage-2 gate numbers). */
export const DUEL_ENEMY = { name: 'RONIN', level: 1 };

/** INFERRED — jump arc: 24 frames = 0.4 s at FIXED_HZ. */
export const JUMP_DURATION_FRAMES = 24;
/** INFERRED — jump apex height in px (screen y-down: subtracted). */
export const JUMP_APEX_PX = 120;
