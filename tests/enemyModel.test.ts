/**
 * src/core/enemyModel.ts (SESSION13 D3) — the named duellist's HP and damage
 * are DERIVED from the player, never authored.
 *
 * The single cleanest statement of the original's combat design, and the reason
 * this module exists: **the player kills in K hits, the enemy kills the player
 * in D hits.** Both sides are tuned in HITS; neither is tuned in hit points. So
 * hits-to-kill is the knob and HP is an OUTPUT — which is why `ENEMY_BASE.hp`
 * is 1 rather than the old PvP-dummy 150 (a 150 would win the source's own
 * `max(scaledBase, …)` and quietly turn HP back into an input).
 */
import { describe, expect, it } from 'vitest';
import { PLAYER_BASE } from '../src/config/combat-sim';
import { DUEL_ENEMY, ENEMY_D_BASE, ENEMY_KD_FLOOR, ENEMY_K_BASE } from '../src/config/duel';
import { deriveEnemy, type EnemyAuthored, type PlayerSide } from '../src/core/enemyModel';
import { duelEnemyDerived } from '../src/core/duelSetup';

const player = (over: Partial<PlayerSide> = {}): PlayerSide => ({
  maxHp: 100,
  minDamage: 10,
  damageRange: 0,
  level: 9,
  ...over,
});
const enemy = (over: Partial<EnemyAuthored> = {}): EnemyAuthored => ({
  baseHp: 1,
  baseMinDamage: 1,
  defense: 5,
  level: 9,
  ...over,
});

describe('deriveEnemy — the level-matched duel (Δ = 0)', () => {
  it('K = 10 and D = 18 — the NAMED-DUELLIST pair, not the generic 8/16', () => {
    const d = deriveEnemy(player(), enemy());
    expect(d.k).toBe(ENEMY_K_BASE);
    expect(d.d).toBe(ENEMY_D_BASE);
  });
  it('enemy HP = effPlayerDmg × K: (10 − 5) × 10 = 50', () => {
    expect(deriveEnemy(player(), enemy()).hp).toBe(50);
  });
  it('enemy min damage = playerMaxHp / D: 100 / 18 = 5.56', () => {
    expect(deriveEnemy(player(), enemy()).minDamage).toBeCloseTo(100 / 18, 9);
  });
  it('xpReward = level × 5 + 45 ⇒ 90 at level 9 (NOT the old +10 seed)', () => {
    expect(deriveEnemy(player(), enemy()).xpReward).toBe(90);
  });
});

describe('deriveEnemy — HP is an OUTPUT: it tracks the PLAYER, not an authored number', () => {
  it('a stronger player gets a proportionally tougher enemy, so the fight stays K hits', () => {
    const weak = deriveEnemy(player({ minDamage: 10 }), enemy());
    const strong = deriveEnemy(player({ minDamage: 30 }), enemy());
    expect(strong.hp).toBeGreaterThan(weak.hp);
    // Both still die in exactly K hits of their respective player's damage.
    expect(weak.hp / (10 - 5)).toBeCloseTo(weak.k, 9);
    expect(strong.hp / (30 - 5)).toBeCloseTo(strong.k, 9);
  });
  it('a tougher PLAYER makes the enemy hit harder, so the player still dies in D hits', () => {
    const squishy = deriveEnemy(player({ maxHp: 100 }), enemy());
    const beefy = deriveEnemy(player({ maxHp: 400 }), enemy());
    expect(beefy.minDamage).toBeGreaterThan(squishy.minDamage);
    expect(400 / beefy.minDamage).toBeCloseTo(beefy.d, 9);
  });
  it('the damage ROLL midpoint feeds the estimate (damageRange/2)', () => {
    const flat = deriveEnemy(player({ minDamage: 10, damageRange: 0 }), enemy());
    const rolled = deriveEnemy(player({ minDamage: 10, damageRange: 8 }), enemy());
    expect(rolled.hp).toBeGreaterThan(flat.hp); // midpoint 14 vs 10
  });
});

describe('deriveEnemy — K and D swing with the level gap, and are FLOORED at 3', () => {
  it('a HIGHER-level enemy is a slog: Δ=+8 ⇒ K=18, D=10', () => {
    const d = deriveEnemy(player({ level: 1 }), enemy({ level: 9 }));
    expect(d.k).toBe(18);
    expect(d.d).toBe(10);
  });
  it('both floor at 3 rather than inverting', () => {
    const under = deriveEnemy(player({ level: 40 }), enemy({ level: 1 }));
    expect(under.k).toBe(ENEMY_KD_FLOOR); // 10 + (1−40) would be −29
    const over = deriveEnemy(player({ level: 1 }), enemy({ level: 40 }));
    expect(over.d).toBe(ENEMY_KD_FLOOR); // 18 − 39 would be −21
  });
});

describe('GATE ITEM 8 — the `level ≤ 8` override, and that it fires AFTER the HP line', () => {
  it('at level 8 the enemy\'s damage AND defence are forced to 1', () => {
    const d = deriveEnemy(player(), enemy({ level: 8 }));
    expect(d.minDamage).toBe(1);
    expect(d.defense).toBe(1);
  });
  it('…but its HP STILL SCALES — the override lands after the derivation', () => {
    // This ordering is the whole point: if the override ran first, HP would be
    // computed against a defence of 1 and come out different. Read verbatim
    // from the payload, the block sits at the END of the scaling routine.
    const lvl8 = deriveEnemy(player(), enemy({ level: 8 }));
    expect(lvl8.hp).toBeGreaterThan(1);
    // defence 5 was used for effPlayerDmg (10 − 5 = 5), giving 5 × K.
    expect(lvl8.hp).toBe(5 * lvl8.k);
  });
  it('at level 9 it is DORMANT — which is exactly why both fighters went to 9', () => {
    const d = deriveEnemy(player(), enemy({ level: 9 }));
    expect(d.minDamage).toBeGreaterThan(1);
    expect(d.defense).toBe(5);
  });
  it('our old level-1 duel was literally unlosable, and this proves it', () => {
    const old = deriveEnemy(player({ level: 1 }), enemy({ level: 1 }));
    expect(old.minDamage).toBe(1);
    expect(old.defense).toBe(1);
  });
});

describe('the shipped duel uses the derivation (scene and harness share it)', () => {
  it('duelEnemyDerived matches the formula for the shipped fighters', () => {
    const d = duelEnemyDerived();
    expect(d.hp).toBe(50);
    expect(d.k).toBe(10);
    expect(d.d).toBe(18);
    expect(d.xpReward).toBe(90);
    expect(DUEL_ENEMY.level).toBe(PLAYER_BASE.stats.level); // Δ = 0
  });
});
