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
import { PLAYER_BASE } from '../../src/config/combat-sim';
import { duelSpawns } from '../../src/core/duelSetup';
import { reachFor } from '../../src/core/mastery';
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
/**
 * ⚠️ THE BOT NOW DRAWS A PLAYER-ANCHORED STROKE (SESSION13 B5, §3.3 diagnosis a).
 *
 * It used to draw `enemy.x ± 140` — a line CENTRED ON THE TARGET, which is not
 * what a real stroke looks like and which the kickoff §3.3 names as the first
 * thing to fix. Because such a line always crosses the enemy, the bot could
 * never miss: every fight was exactly K swings plus jitter, and the 24 seeds
 * collapsed into a 34-frame window (15 distinct durations, against the gate's
 * ≥22). Anchoring the stroke at the player — from its own position, one reach
 * along the attack line, exactly what AUTO SLASH synthesises — restores the
 * miss-then-close dynamic the real game has, and with it the seed variance.
 *
 * (The jump numbers were also authored in 1024-space and the A0 split left them
 * behind; converted with the same `/1.2`: 8/160 → 6.7/133.3.)
 */
const JUMP_DX = 6.7;
const JUMP_DY = 133.3;
const SLASH_EVERY_FRAMES = 45;
const DODGE_DELAY_FRAMES = 10;

export function runDuel(seed: number, policy: 'good' | 'none'): DuelOutcome {
  const rng = mulberry32(seed);
  // The enemy is spawned through the SAME derivation the scene uses (D3), so
  // the harness measures the real model rather than an authored seed.
  const sim = new Sim(rng, new AISeamController(rng, AI_TIERS.normal), duelSpawns());
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
        sim.applyStroke(new DrawnStroke([{ x: p.x, y: p.y }, { x: p.x + JUMP_DX, y: p.y - JUMP_DY }]));
      }
      if (sim.frame >= nextSlash) {
        const e = sim.enemy.pos;
        // Anchored AT the player, one reach long, aimed at the enemy — so it
        // whiffs when out of range and the dash has to close the gap.
        const me = sim.player.pos;
        const dir = Math.sign(e.x - me.x) || 1;
        const reach = reachFor(sim.player.stance, PLAYER_BASE.stats);
        sim.applyStroke(
          new DrawnStroke([{ x: me.x, y: me.y }, { x: me.x + dir * reach, y: me.y }]),
        );
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
