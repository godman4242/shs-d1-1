/**
 * STAGE-1 DUEL DUMMY CONFIG — pure data, no logic. ALL values INFERRED.
 *
 * Kickoff decision (flagged): the Stage 1 gate needs a 100-HP foe and a
 * jump arc, and core/ bans literals, so their numbers are named here. This
 * file is the Stage-1 test-dummy setup ONLY — Stage 2's combat-sim.ts
 * (PLAYER_BASE / ENEMY_BASE) supersedes it for real duels. Veto = retune.
 */
import type { StanceId } from './stances';

/** INFERRED — gate: "100 HP foe takes partial damage". Stands right-of-center
 * on the foreground band of the 1024×576 stage. Hitbox ≈ 52×120 px capsule. */
export const DUMMY_SPAWN = {
  pos: { x: 700, y: 430 },
  hp: 100,
  stance: 'balanced' as StanceId,
  halfW: 26,
  halfH: 60,
} as const;

/** INFERRED — Stage-1 attacker stats; mirrors Stage 2's PLAYER_BASE
 * (atkPlusWeapon 10) so gate damage math reads 10 × 1.2 = 12 per slash. */
export const DUEL_ATTACKER = {
  atkPlusWeapon: 10,
  stance: 'balanced' as StanceId,
} as const;

/** INFERRED — jump arc: 24 frames = 0.4 s at FIXED_HZ. */
export const JUMP_DURATION_FRAMES = 24;
/** INFERRED — jump apex height in px (screen y-down: subtracted). */
export const JUMP_APEX_PX = 120;
