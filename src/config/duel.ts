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

/**
 * INFERRED — player left-of-center, enemy right, both on the foreground
 * ground band. WORLD SPACE (SESSION13 A0, 800×480): converted once from the
 * old stage values via `(x − 32)/1.2` for x and `/1.2` for y and lengths —
 * player 260 → 190, enemy 700 → 557 (gap 440 → 367), ground 430 → 358,
 * hitbox 26×60 → 22×50 (≈ 44×100 world px capsules, rendering back to the
 * same 52×120 stage box).
 */
export const DUEL_SPAWNS: Record<'player' | 'enemy', SpawnPoint> = {
  player: { pos: { x: 190, y: 358 }, halfW: 22, halfH: 50 },
  enemy: { pos: { x: 557, y: 358 }, halfW: 22, halfH: 50 },
};

/** INFERRED — Stage-2 duel opponent identity (nameplate "NAME (LEVEL)" —
 * fidelity tell 22; level 1 makes the Victory rewards read +10/+8 exactly,
 * the Stage-2 gate numbers). */
export const DUEL_ENEMY = { name: 'RONIN', level: 1 };

/** INFERRED — jump arc: 24 frames = 0.4 s at FIXED_HZ. */
export const JUMP_DURATION_FRAMES = 24;
/** INFERRED — jump apex height in WORLD px (y-down: subtracted). Was 120 stage. */
export const JUMP_APEX_PX = 100;
