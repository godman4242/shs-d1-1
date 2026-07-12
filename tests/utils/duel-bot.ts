/**
 * Scripted duel runner for the 24-seed harness + determinism fingerprints
 * (Stage 2 spec item 14). Mirrors DuelScene's wiring exactly: ONE mulberry32
 * stream shared by Sim and AISeamController (normal tier), spawns from
 * config. Policies:
 * - 'good': slashes through the enemy every 45 frames and jump-dodges
 *   strike telegraphs (jump scheduled +10 frames so the arc covers the
 *   commit at telegraph+32) — competent play, must win every seed.
 * - 'none': no input at all — must lose every seed.
 */
import { AI_TIERS } from '../../src/config/ai';
import { ENEMY_BASE, PLAYER_BASE } from '../../src/config/combat-sim';
import { DUEL_SPAWNS } from '../../src/config/duel';
import { FIXED_HZ } from '../../src/config/timing';
import { AISeamController } from '../../src/core/AISeamController';
import { DrawnStroke } from '../../src/core/DrawnStroke';
import { mulberry32 } from '../../src/core/rng';
import { Sim } from '../../src/core/Sim';

export interface DuelOutcome {
  winner: 'player' | 'enemy' | 'timeout';
  frames: number;
  seconds: number;
  playerHp: number;
  enemyHp: number;
  /** Order-sensitive rolling checksum of the full state trace. */
  checksum: number;
}

const MAX_DUEL_S = 120;
const SLASH_EVERY_FRAMES = 45;
const DODGE_DELAY_FRAMES = 10;

export function runDuel(seed: number, policy: 'good' | 'none'): DuelOutcome {
  const rng = mulberry32(seed);
  const sim = new Sim(rng, new AISeamController(rng, AI_TIERS.normal), {
    player: { ...PLAYER_BASE, ...DUEL_SPAWNS.player, pos: { ...DUEL_SPAWNS.player.pos } },
    enemy: { ...ENEMY_BASE, ...DUEL_SPAWNS.enemy, pos: { ...DUEL_SPAWNS.enemy.pos } },
  });
  sim.beginCombat();

  let checksum = 0;
  const fold = (x: number): void => {
    // FNV-ish integer fold — deterministic, order-sensitive.
    checksum = (Math.imul(checksum ^ Math.round(x * 256), 16777619) >>> 0);
  };

  // The bot swings on a humanized tempo: its OWN rng stream (separate from
  // the sim's) adds 0–11 frames of per-swing jitter, like a real player.
  // Without it, kills quantize to the swing grid and seed durations collide.
  const botRng = mulberry32(seed ^ 0x5eed);
  let nextSlash = SLASH_EVERY_FRAMES;
  let jumpAt = -1;
  const maxFrames = MAX_DUEL_S * FIXED_HZ;

  while (sim.phase === 'fighting' && sim.frame < maxFrames) {
    sim.tick();
    const events = sim.drainEvents();
    for (const ev of events) {
      fold(ev.type.length);
      if (policy === 'good' && ev.type === 'enemyTelegraph' && ev.kind === 'strike') {
        jumpAt = sim.frame + DODGE_DELAY_FRAMES;
      }
    }
    if (policy === 'good') {
      if (sim.frame === jumpAt && !sim.playerJumping) {
        const p = sim.player.pos;
        sim.applyStroke(new DrawnStroke([{ x: p.x, y: p.y }, { x: p.x + 8, y: p.y - 160 }]));
      }
      if (sim.frame >= nextSlash) {
        const e = sim.enemy.pos;
        sim.applyStroke(new DrawnStroke([{ x: e.x - 140, y: e.y }, { x: e.x + 140, y: e.y }]));
        nextSlash = sim.frame + SLASH_EVERY_FRAMES + Math.floor(botRng() * 12);
      }
    }
    fold(sim.player.hp);
    fold(sim.enemy.hp);
    fold(sim.player.pos.x);
    fold(sim.enemy.pos.x);
  }

  const winner: DuelOutcome['winner'] =
    sim.enemy.hp === 0 ? 'player' : sim.player.hp === 0 ? 'enemy' : 'timeout';
  return {
    winner,
    frames: sim.frame,
    seconds: sim.frame / FIXED_HZ,
    playerHp: sim.player.hp,
    enemyHp: sim.enemy.hp,
    checksum,
  };
}

/** Compact deterministic fingerprint of one seeded good-play duel. */
export function duelFingerprint(seed: number): string {
  const r = runDuel(seed, 'good');
  return JSON.stringify(r);
}
