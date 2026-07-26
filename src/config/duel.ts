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
/**
 * ⚠️ SESSION14 A1: this `'player' | 'enemy'` is a SANCTIONED survivor of the
 * N-actor refactor. It is not a gameplay path — it is the DUEL's two spawn
 * POINTS, and a duel has exactly two. Encounters get their own layout in A2
 * (INFERRED, per D10) rather than widening this one.
 */
export const DUEL_SPAWNS: Record<'player' | 'enemy', SpawnPoint> = {
  player: { pos: { x: 190, y: 358 }, halfW: 22, halfH: 50 },
  enemy: { pos: { x: 557, y: 358 }, halfW: 22, halfH: 50 },
};

/**
 * Duel opponent identity (nameplate "NAME (LEVEL)" — fidelity tell 22).
 *
 * ⚠️ LEVEL 9, NOT 1 (SESSION13 D3). Level 1 sat inside the source's
 * `if (level <= 8) { minDamage = 1; defense = 1; }` override, which forced the
 * enemy to 1 damage and 1 defence and made the duel literally unlosable. Nine
 * is the LOWEST level that escapes it — the smallest change that makes the
 * fight a fight. Both fighters go to 9 so Δ = 0 and the duel is the original's
 * own level-matched one: K = 10, D = 18.
 */
export const DUEL_ENEMY = { name: 'RONIN', level: 9 };

// ── The named-duellist K/D pair and the XP reward (SESSION13 D3, source) ──
/** CONTRACT-SRC — `K = max(10 + Δ, 3)`: hits the PLAYER needs. */
export const ENEMY_K_BASE = 10;
/** CONTRACT-SRC — `D = max(18 − Δ, 3)`: hits the ENEMY needs. */
export const ENEMY_D_BASE = 18;
/** CONTRACT-SRC — both K and D are floored at 3. */
export const ENEMY_KD_FLOOR = 3;
/** CONTRACT-SRC — `xpReward = level × 5 + 45` → 90 at level 9. */
export const XP_PER_LEVEL = 5;
export const XP_REWARD_BASE = 45;
/**
 * CONTRACT-SRC — the low-level override: at or below this level the enemy's
 * damage AND defence are forced to 1, AFTER the HP derivation. Dormant at
 * level 9, but kept implemented because it governs every Stage-4 mob.
 */
export const LOW_LEVEL_OVERRIDE = { maxLevel: 8 } as const;

/** INFERRED — jump arc: 24 frames = 0.4 s at FIXED_HZ. */
export const JUMP_DURATION_FRAMES = 24;
/** INFERRED — jump apex height in WORLD px (y-down: subtracted). Was 120 stage. */
export const JUMP_APEX_PX = 100;
