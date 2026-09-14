/**
 * OG_SPEAR_ELITE — `EnemySpearElite.as` (584 lines), ai 28 (`isBoss = false`) and ai 37
 * (`isBoss = true`), and the parent of `FriendlySpearElite` (ai 31). Lane L4b, slice 2b.
 * All CONTRACT. The get-up / bar / fall / downstab twins are `ogNpcHumanoid.ts`'s.
 *
 * ⚠️ `AI()` sets `spearSpinCoolDown` for ALL THREE specials (`:541`, `:547`, `:553`);
 * `spearFlurryCoolDown` and `spearLaunchCoolDown` are declared, decremented, and never
 * set. Ported as it reads (DIVERGENCES, L4b slice 2b).
 */
import { OG_FPS } from './timing';

export const OG_SPEAR_ELITE = {
  /** `EnemySpearElite.as:296` — `walkSpeed = random() * 2 + 3`, an int: 3 or 4 (twin of `EnemySpear.as:144`). */
  walk: { range: 2, base: 3 },
  /** `EnemySpearElite.as:517` — in peace, a bowing elite walks once the target is within 100 map px. */
  bowApproachX: 100,
  /** `EnemySpearElite.as:530` — a DOWNED target inside 50 px gets the downstab… */
  stabX: 50,
  /** `EnemySpearElite.as:534-549` — …inside 100 a d4: 1 spin (`:537`), 2 flurry (`:543`), 3 launch (`:549`), else the plain stab… */
  melee: { x: 100, dice: 4, spinOn: 1, flurryOn: 2, launchOn: 3 },
  /** `EnemySpearElite.as:561-574` — …inside 200 a d5: 0 lunge (`:564`), 1 swing (`:569`), 2 kick (`:574`), else nothing. */
  ranged: { x: 200, dice: 5, lungeOn: 0, swingOn: 1, kickOn: 2 },
  /** `EnemySpearElite.as:541` / `:547` / `:553` — `5 * 24` frames: five seconds between specials. */
  cooldown: { sec: 5, fps: OG_FPS },
  /** `EnemySpearElite.as:406` / `:410` — the lunge carries the body 20 px per mid-frame… */
  lungeStep: 20,
  /** `EnemySpearElite.as:430` / `:434` — …the kick 20 on its first mid-clip… */
  kickStep: 20,
  /** `EnemySpearElite.as:445` / `:449` — …and 10 on its second. */
  kickStep2: 10,
  boss: {
    /** `EnemySpearElite.as:62` / `:78` — a boss is worth `lvl * 5 + 45` (twin of `EnemyWolf.as:32`). */
    xp: { perLevel: 5, base: 45 },
    /** `EnemySpearElite.as:84` — the boss should take `10 + (bossLvl − playerLvl)` player hits… */
    hitsToKillBossBase: 10,
    /** `EnemySpearElite.as:85` — …and kill the player in `18 − (bossLvl − playerLvl)`. */
    hitsToKillPlayerBase: 18,
    /** `EnemySpearElite.as:86-93` — floors: never fewer than 3 hits to kill the boss, 1 to kill the player. */
    hitsToKillBossMin: 3,
    hitsToKillPlayerMin: 1,
    /**
     * `EnemySpearElite.as:95-110` — the player's hit is floored by the PLAYER's level: ≤10 → 1,
     * ≤20 → lvl/8, ≤30 → lvl/6, else lvl/4 (int division). The ladder is `Damage.as:150-173`'s
     * (`config/combat.ts` `MIN_DAMAGE_TIERS`) but the chain is an if / else-if that FALLS
     * THROUGH: a hit that clears its own tier's floor is still tested against lvl/4.
     */
    floor: { tier1Level: 10, tier1Min: 1, tier2Level: 20, tier2Div: 8, tier3Level: 30, tier3Div: 6, tier4Div: 4 },
    /** `EnemySpearElite.as:124-127` — at level 5 or below a boss hits and defends for 1 (twin of `NPC.as:253-257` at 10). */
    trivialLevel: 5,
    trivialStat: 1,
  },
} as const;
