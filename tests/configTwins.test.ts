/**
 * THE TWIN TABLE — every config value the ORIGINAL reaches by two paths, in one place.
 *
 * The rule itself is in `src/config/CLAUDE.md`. This file is its enforcement: one table of
 * declared twins whose equality is asserted, one table of declared NON-twins that must
 * never be pinned, and a count so the tables cannot quietly shrink.
 *
 * ─────────────────────────────────────────────────────────────────────────────────
 * WHY A SINGLE TABLE, when several of these pairs are already asserted in their own
 * slice suites.
 * ─────────────────────────────────────────────────────────────────────────────────
 * Slice 3 made the import-or-pin judgement three times with no written rule, so each was
 * re-litigated from scratch. The pins that did get written live scattered across four test
 * files — `npcSlice3a`, `npcSlice3b`, `ogSkillData` and `enemyModel` — and an enumeration of
 * 31 declared twin RELATIONSHIPS (which expand to the 36 field-level pairs below, plus 2
 * resolved by import) found that **13 had no assertion anywhere**: the whole of slice 2a's
 * civilian config appeared in ZERO tests, and `chaseDist: 400` had three config homes and
 * no pin at all. A scattered pin cannot answer "is this declared twin covered?" — a table
 * can, which is the only reason to accept the duplication below.
 *
 * ─────────────────────────────────────────────────────────────────────────────────
 * ⚠️ THE DENY-LIST IS THE DANGEROUS HALF, AND IT IS WHY THIS FILE IS HAND-WRITTEN.
 * ─────────────────────────────────────────────────────────────────────────────────
 * A generated twin-finder that pinned "same number, adjacent purpose" would freeze at
 * least four coincidences in place and make a future OG correction to one side impossible:
 * `OG_STAG.chargeSpeed` and `OG_ANIMAL.runSpeedRoom` are both 15 and are NOT twins;
 * `OG_ALPHA.runSpeed` is 15 against the wolf's room/overworld PAIR; `OG_BEAR.idle.dice`
 * and `OG_HORSE.idle.dice` are both 3 for different clip sets.
 *
 * And the WORD "twin" does not settle it. `OG_SPEAR_ELITE.boss.trivialLevel` is documented
 * as a twin of `OG_NPC_SET_LEVEL.trivialLevel`, and the two numbers are **5 and 10** — a
 * twin RULE, not a twin VALUE. A test that trusted the comment would have gone red the day
 * it was written.
 */
import { describe, expect, it } from 'vitest';
import { CRIT_MULT, DAMAGE_FLOOR, MIN_DAMAGE_TIERS } from '../src/config/combat';
import { OG_BEAR } from '../src/config/ogEnemyBear';
import { OG_BOAR } from '../src/config/ogEnemyBoar';
import { OG_CIVILIAN } from '../src/config/ogEnemyCivilian';
import { OG_FOX } from '../src/config/ogEnemyFox';
import { OG_HORSE } from '../src/config/ogEnemyHorse';
import { OG_SPEAR } from '../src/config/ogEnemySpear';
import { OG_SPEAR_ELITE } from '../src/config/ogEnemySpearElite';
import { OG_STAG } from '../src/config/ogEnemyStag';
import { OG_WOLF } from '../src/config/ogEnemyWolf';
import { OG_ALPHA } from '../src/config/ogEnemyWolfAlpha';
import { OG_ANIMAL } from '../src/config/ogNpcAnimal';
import { OG_NPC_FLOATING_TEXT, OG_NPC_FLY, OG_NPC_LAUNCH, OG_NPC_SET_LEVEL } from '../src/config/ogNpcBase';
import { OG_FRIENDLY } from '../src/config/ogNpcFriendly';
import {
  OG_HUMANOID_DOWNED_BAR_X,
  OG_HUMANOID_DOWNEDUP_STEP,
  OG_HUMANOID_FALL_GRAVITY,
  OG_HUMANOID_GETUP_STEP,
} from '../src/config/ogNpcHumanoid';
import { OG_GETUP, OG_SPECIAL_SKILL_MASTERY, OG_STANCE_DAMAGE, OG_STANCE_REACH } from '../src/config/ogMcsPlayer';
import { REACH } from '../src/config/reach';
import { LAUNCH_UNLOCK_LEVEL } from '../src/config/stances';

/** A declared twin: two config paths the original reaches by two routes. */
interface Twin {
  /** `LEFT ↔ RIGHT`, written the way the declaring comment writes it. */
  readonly name: string;
  readonly left: unknown;
  readonly right: unknown;
  /** Where the twin is DECLARED, so a reader can check the claim. */
  readonly declaredIn: string;
}

/**
 * EVERY DECLARED TWIN IN THE REPO, at field level.
 *
 * Some of these are ALSO asserted in their own slice suite; `declaredIn` names where the
 * twin is declared, not where it is pinned. The duplication is deliberate and cheap: one
 * place has to answer "is this declared twin covered?", and a duplicate assertion costs
 * microseconds where a missing one costs a silent divergence.
 */
const TWINS: Twin[] = [
  // ── the {5, 45} animal xp curve: FIVE config homes, and only two were pinned ──────
  { name: 'OG_ANIMAL.xp ↔ OG_WOLF.xp', left: OG_ANIMAL.xp, right: OG_WOLF.xp, declaredIn: 'ogNpcAnimal.ts header' },
  { name: 'OG_ALPHA.xp ↔ OG_WOLF.xp', left: OG_ALPHA.xp, right: OG_WOLF.xp, declaredIn: 'ogEnemyWolfAlpha.ts' },
  // NEW PINS — declared from both sides and asserted nowhere before this file. The whole
  // of slice 2a's civilian config appeared in zero tests.
  { name: 'OG_CIVILIAN.xp ↔ OG_WOLF.xp', left: OG_CIVILIAN.xp, right: OG_WOLF.xp, declaredIn: 'ogEnemyCivilian.ts + ogEnemyWolf.ts (both sides)' },
  { name: 'OG_SPEAR_ELITE.boss.xp ↔ OG_WOLF.xp', left: OG_SPEAR_ELITE.boss.xp, right: OG_WOLF.xp, declaredIn: 'ogEnemySpearElite.ts' },

  // ── FALL gravity 3: the animal, the wolf, and the nine humanoids ─────────────────
  { name: 'OG_ANIMAL.fallGravity ↔ OG_WOLF.fallGravity', left: OG_ANIMAL.fallGravity, right: OG_WOLF.fallGravity, declaredIn: 'ogNpcAnimal.ts:81-82' },
  { name: 'OG_WOLF.fallGravity ↔ OG_HUMANOID_FALL_GRAVITY', left: OG_WOLF.fallGravity, right: OG_HUMANOID_FALL_GRAVITY, declaredIn: 'ogNpcHumanoid.ts (nine .as twins, each verified to read `velY += 3;`)' },
  { name: 'OG_ANIMAL.fallGravity ↔ OG_HUMANOID_FALL_GRAVITY', left: OG_ANIMAL.fallGravity, right: OG_HUMANOID_FALL_GRAVITY, declaredIn: 'ogNpcAnimal.ts:81-82 (the half its slice test did not pin)' },

  // ── run speeds: the animal's two against the wolf's pair ─────────────────────────
  { name: 'OG_ANIMAL.runSpeed ↔ OG_WOLF.run.adventure', left: OG_ANIMAL.runSpeed, right: OG_WOLF.run.adventure, declaredIn: 'ogNpcAnimal.ts header' },
  { name: 'OG_ANIMAL.runSpeedRoom ↔ OG_WOLF.run.room', left: OG_ANIMAL.runSpeedRoom, right: OG_WOLF.run.room, declaredIn: 'ogNpcAnimal.ts header' },

  // ── arriveX 10 ───────────────────────────────────────────────────────────────────
  { name: 'OG_ANIMAL.arriveX ↔ OG_WOLF.arriveX', left: OG_ANIMAL.arriveX, right: OG_WOLF.arriveX, declaredIn: 'ogNpcAnimal.ts' },
  { name: 'OG_ALPHA.arriveX ↔ OG_WOLF.arriveX', left: OG_ALPHA.arriveX, right: OG_WOLF.arriveX, declaredIn: 'ogEnemyWolfAlpha.ts' },

  // ── the alpha's pounce and multiplier twins of the wolf ──────────────────────────
  { name: 'OG_ALPHA.pounceHighDice ↔ OG_WOLF.pounceHighDice', left: OG_ALPHA.pounceHighDice, right: OG_WOLF.pounceHighDice, declaredIn: 'ogEnemyWolfAlpha.ts' },
  { name: 'OG_ALPHA.pounceStep ↔ OG_WOLF.pounceStep', left: OG_ALPHA.pounceStep, right: OG_WOLF.pounceStep, declaredIn: 'ogEnemyWolfAlpha.ts' },
  { name: 'OG_ALPHA.partMult ↔ OG_WOLF.partMult', left: OG_ALPHA.partMult, right: OG_WOLF.partMult, declaredIn: 'ogEnemyWolfAlpha.ts' },
  // The whole 4-field object, not the 2 fields the slice suite happened to pin.
  { name: 'OG_ALPHA.idle ↔ OG_WOLF.idle (all four fields)', left: OG_ALPHA.idle, right: OG_WOLF.idle, declaredIn: 'ogEnemyWolfAlpha.ts:45 + ogEnemyWolf.ts:21-23' },
  { name: 'OG_ALPHA.walkBackwardsDiv ↔ OG_WOLF.walkBackwardsDiv', left: OG_ALPHA.walkBackwardsDiv, right: OG_WOLF.walkBackwardsDiv, declaredIn: 'ogEnemyWolfAlpha.ts ("same as the wolf")' },
  { name: 'OG_ALPHA.downedFrames ↔ OG_WOLF.downed.launchedFrames', left: OG_ALPHA.downedFrames, right: OG_WOLF.downed.launchedFrames, declaredIn: 'ogEnemyWolfAlpha.ts:86-90' },

  // ── the alpha's setLevel against the spear boss's — the pair that is HALF a twin ──
  { name: 'OG_ALPHA.setLevel.floor ↔ OG_SPEAR_ELITE.boss.floor (all seven fields)', left: OG_ALPHA.setLevel.floor, right: OG_SPEAR_ELITE.boss.floor, declaredIn: 'ogEnemyWolfAlpha.ts:128-136' },
  { name: 'OG_ALPHA.setLevel.hitsToKillBossBase ↔ OG_SPEAR_ELITE.boss.hitsToKillBossBase', left: OG_ALPHA.setLevel.hitsToKillBossBase, right: OG_SPEAR_ELITE.boss.hitsToKillBossBase, declaredIn: 'ogEnemyWolfAlpha.ts:115' },
  { name: 'OG_ALPHA.setLevel.hitsToKillPlayerMin ↔ OG_SPEAR_ELITE.boss.hitsToKillPlayerMin', left: OG_ALPHA.setLevel.hitsToKillPlayerMin, right: OG_SPEAR_ELITE.boss.hitsToKillPlayerMin, declaredIn: 'ogEnemySpearElite.ts:37 ("same as the boss")' },
  { name: 'OG_ALPHA.setLevel.damageRangeDiv ↔ OG_FRIENDLY.damageRangeDiv', left: OG_ALPHA.setLevel.damageRangeDiv, right: OG_FRIENDLY.damageRangeDiv, declaredIn: 'ogNpcFriendly.ts twin list — and note OG_SPEAR_ELITE.boss has NO such field; the boss reads OG_FRIENDLY directly' },

  // ── chaseDist 400: three homes, and before this file, ZERO pins ──────────────────
  { name: 'OG_STAG.chaseDist ↔ OG_BEAR.chaseDist', left: OG_STAG.chaseDist, right: OG_BEAR.chaseDist, declaredIn: 'ogEnemyStag.ts ("Twin of")' },
  { name: 'OG_BOAR.chaseDist ↔ OG_BEAR.chaseDist', left: OG_BOAR.chaseDist, right: OG_BEAR.chaseDist, declaredIn: 'ogEnemyBoar.ts (names both twins by config path)' },

  // ── launch and fly edge behaviour ────────────────────────────────────────────────
  { name: 'OG_WOLF.launched.gravity ↔ OG_NPC_LAUNCH.gravity', left: OG_WOLF.launched.gravity, right: OG_NPC_LAUNCH.gravity, declaredIn: 'ogEnemyWolf.ts ("twins of")' },
  { name: 'OG_WOLF.launched.edgeMargin ↔ OG_NPC_LAUNCH.edgeMargin', left: OG_WOLF.launched.edgeMargin, right: OG_NPC_LAUNCH.edgeMargin, declaredIn: 'ogEnemyWolf.ts ("twins of")' },
  { name: 'OG_WOLF.launched.edgeBounceMult ↔ OG_NPC_LAUNCH.edgeBounceMult', left: OG_WOLF.launched.edgeBounceMult, right: OG_NPC_LAUNCH.edgeBounceMult, declaredIn: 'ogEnemyWolf.ts ("twins of")' },
  { name: 'OG_NPC_FLY.edgeMargin ↔ OG_NPC_LAUNCH.edgeMargin', left: OG_NPC_FLY.edgeMargin, right: OG_NPC_LAUNCH.edgeMargin, declaredIn: 'ogNpcBase.ts ("same edge bounce as doLaunched") — a twin INSIDE one file' },
  { name: 'OG_NPC_FLY.edgeBounceMult ↔ OG_NPC_LAUNCH.edgeBounceMult', left: OG_NPC_FLY.edgeBounceMult, right: OG_NPC_LAUNCH.edgeBounceMult, declaredIn: 'ogNpcBase.ts ("same edge bounce as doLaunched")' },

  // ── the walk the elite shares with the plain spearman ────────────────────────────
  { name: 'OG_SPEAR_ELITE.walk ↔ OG_SPEAR.walk', left: OG_SPEAR_ELITE.walk, right: OG_SPEAR.walk, declaredIn: 'ogEnemySpearElite.ts ("twin of") — crosses slice 1 → slice 2b' },

  // ── the boss floor ladder against combat.ts, where the FIELD NAMES differ ────────
  { name: 'OG_SPEAR_ELITE.boss.floor.tier1Level ↔ MIN_DAMAGE_TIERS.tier1MaxLevel', left: OG_SPEAR_ELITE.boss.floor.tier1Level, right: MIN_DAMAGE_TIERS.tier1MaxLevel, declaredIn: 'ogEnemySpearElite.ts (by config path)' },
  { name: 'OG_SPEAR_ELITE.boss.floor.tier2Level ↔ MIN_DAMAGE_TIERS.tier2MaxLevel', left: OG_SPEAR_ELITE.boss.floor.tier2Level, right: MIN_DAMAGE_TIERS.tier2MaxLevel, declaredIn: 'ogEnemySpearElite.ts' },
  { name: 'OG_SPEAR_ELITE.boss.floor.tier2Div ↔ MIN_DAMAGE_TIERS.tier2Divisor', left: OG_SPEAR_ELITE.boss.floor.tier2Div, right: MIN_DAMAGE_TIERS.tier2Divisor, declaredIn: 'ogEnemySpearElite.ts' },
  { name: 'OG_SPEAR_ELITE.boss.floor.tier3Level ↔ MIN_DAMAGE_TIERS.tier3MaxLevel', left: OG_SPEAR_ELITE.boss.floor.tier3Level, right: MIN_DAMAGE_TIERS.tier3MaxLevel, declaredIn: 'ogEnemySpearElite.ts' },
  { name: 'OG_SPEAR_ELITE.boss.floor.tier3Div ↔ MIN_DAMAGE_TIERS.tier3Divisor', left: OG_SPEAR_ELITE.boss.floor.tier3Div, right: MIN_DAMAGE_TIERS.tier3Divisor, declaredIn: 'ogEnemySpearElite.ts' },
  { name: 'OG_SPEAR_ELITE.boss.floor.tier4Div ↔ MIN_DAMAGE_TIERS.tier4Divisor', left: OG_SPEAR_ELITE.boss.floor.tier4Div, right: MIN_DAMAGE_TIERS.tier4Divisor, declaredIn: 'ogEnemySpearElite.ts' },
  { name: 'OG_SPEAR_ELITE.boss.floor.tier1Min ↔ DAMAGE_FLOOR', left: OG_SPEAR_ELITE.boss.floor.tier1Min, right: DAMAGE_FLOOR, declaredIn: 'ogEnemySpearElite.ts' },

  // ── L5-OPP slice 3a: the duellist's setStance / getDamage against the Sim player's copies ──
  // (The factored per-mastery terms, `0.2 * m * 0.1` vs REACH's `0.02`, are not equal as
  // doubles; `tests/mcsPlayer.test.ts` pins them close.)
  { name: 'OG_STANCE_REACH.lightMult ↔ REACH.lightMult', left: OG_STANCE_REACH.lightMult, right: REACH.lightMult, declaredIn: 'ogMcsPlayer.ts + reach.ts (both read web setStance)' },
  { name: 'OG_STANCE_REACH.heavy.base ↔ REACH.heavyBase', left: OG_STANCE_REACH.heavy.base, right: REACH.heavyBase, declaredIn: 'ogMcsPlayer.ts + reach.ts' },
  { name: 'OG_STANCE_REACH.floor ↔ REACH.heavyFloor', left: OG_STANCE_REACH.floor, right: REACH.heavyFloor, declaredIn: 'ogMcsPlayer.ts + reach.ts' },
  { name: 'OG_STANCE_DAMAGE.critMult ↔ CRIT_MULT', left: OG_STANCE_DAMAGE.critMult, right: CRIT_MULT, declaredIn: 'ogMcsPlayer.ts + combat.ts (ERRATUM 2 item 8: the Sim runs the web ×1.3)' },
];

/**
 * Twins resolved by IMPORT. These cannot drift — the assertion is IDENTITY, which is a
 * real check: it goes red the day someone "tidies" the import into a copy, which is the
 * only way one of these can ever start drifting.
 */
const IMPORTED: Twin[] = [
  { name: 'OG_STAG.idle IS OG_HORSE.idle (same object)', left: OG_STAG.idle, right: OG_HORSE.idle, declaredIn: 'ogEnemyStag.ts:3-5 + ogEnemyHorse.ts:16-17' },
  { name: 'OG_ALPHA.floatingText IS OG_NPC_FLOATING_TEXT (same object)', left: OG_ALPHA.floatingText, right: OG_NPC_FLOATING_TEXT, declaredIn: 'ogEnemyWolfAlpha.ts:143' },
];

describe('the twin table — declared twins do not drift', () => {
  it.each(TWINS.map((t) => [t.name, t] as const))('%s', (_label, twin) => {
    expect(twin.left, `declared in ${twin.declaredIn}`).toEqual(twin.right);
  });

  it.each(IMPORTED.map((t) => [t.name, t] as const))('%s', (_label, twin) => {
    // `toBe`, not `toEqual`: the claim is that there is ONE object, not two equal ones.
    expect(twin.left, `declared in ${twin.declaredIn}`).toBe(twin.right);
  });

  /**
   * The table must not quietly shrink. Deleting a row is how a twin stops being covered
   * without anything going red — the same failure mode the chaos plant count guards.
   */
  it('holds every twin relationship the enumeration found', () => {
    expect(TWINS).toHaveLength(40);
    expect(IMPORTED).toHaveLength(2);
  });

  it('names where every twin is DECLARED, so the claim can be checked', () => {
    for (const t of [...TWINS, ...IMPORTED]) {
      expect(t.declaredIn.length, t.name).toBeGreaterThan(8);
    }
  });
});

/**
 * ─────────────────────────────────────────────────────────────────────────────────
 * THE DENY-LIST. Same number, different rule. Pinning any of these would freeze a
 * coincidence and make a future correction to one side impossible.
 * ─────────────────────────────────────────────────────────────────────────────────
 * Each one asserts what makes the pair DIFFERENT — the shape
 * `tests/ogSkillData.test.ts` already uses for `SKILL_COOLDOWN_MS.stab`. Asserting
 * nothing would leave the reasoning in a comment where the next person deletes it.
 */
describe('the deny-list — equal numbers that are NOT twins', () => {
  it('OG_STAG.chargeSpeed is 15 and OG_ANIMAL.runSpeedRoom is 15, and a charge is not a run', () => {
    expect(OG_STAG.chargeSpeed).toBe(OG_ANIMAL.runSpeedRoom);
    // The rule that separates them: RUN steps down in the overworld, the CHARGE does not.
    // `tests/npcSlice3a.test.ts` carries the behavioural proof; this records that the
    // equality above is a COINCIDENCE and must never become a pin.
    expect(OG_ANIMAL.runSpeed).not.toBe(OG_ANIMAL.runSpeedRoom);
    expect(OG_STAG.chargeSpeed).toBe(15);
  });

  it('OG_ALPHA.runSpeed is a scalar where OG_WOLF.run is a room/overworld PAIR', () => {
    expect(OG_ALPHA.runSpeed).toBe(15);
    expect(OG_WOLF.run).toEqual({ room: 15, adventure: 12 });
    // There is nothing to be a twin OF: the alpha has no second speed.
    expect(Object.keys(OG_WOLF.run)).toHaveLength(2);
  });

  it('OG_BEAR.idle.dice and OG_HORSE.idle.dice are both 3 for different clip sets', () => {
    expect(OG_BEAR.idle.dice).toBe(OG_HORSE.idle.dice);
    // The bear rolls IDLE/SIT/FIDGET and the horse IDLE/GRAZING/PAWING, so the field that
    // USES the die differs — which is the proof they are not one value.
    expect(OG_BEAR.idle).not.toEqual(OG_HORSE.idle);
  });

  /**
   * THE SUBTLEST ENTRY IN THE REPO. The comment says "twin" and the numbers are 5 and 10.
   * It is a twin RULE — the same clamp, applied at a different level. A twin-enumerating
   * test that trusted the word would have gone red on the day it was written.
   */
  it('OG_SPEAR_ELITE.boss.trivialLevel is a twin RULE of OG_NPC_SET_LEVEL, not a twin VALUE', () => {
    expect(OG_SPEAR_ELITE.boss.trivialLevel).toBe(5);
    expect(OG_NPC_SET_LEVEL.trivialLevel).toBe(10);
    expect(OG_SPEAR_ELITE.boss.trivialLevel).not.toBe(OG_NPC_SET_LEVEL.trivialLevel);
    // Only the STAT half matches, and that half really is shared.
    expect(OG_SPEAR_ELITE.boss.trivialStat).toBe(OG_NPC_SET_LEVEL.trivialStat);
  });

  it('OG_ANIMAL.arriveDice is a COIN and OG_WOLF.arriveDice is a d3', () => {
    expect(OG_ANIMAL.arriveDice).toBe(2);
    expect(OG_WOLF.arriveDice).toBe(3);
  });

  it('OG_FOX.arriveDice equals the animal coin but is declared against the WOLF as a divergence', () => {
    // Two relationships in one value: it diverges from the wolf's d3 (declared) and
    // coincides with the animal coin (NOT declared). Recorded so a future session does
    // not read the coincidence as a twin.
    expect(OG_FOX.arriveDice).not.toBe(OG_WOLF.arriveDice);
    expect(OG_FOX.arriveDice).toBe(OG_ANIMAL.arriveDice);
  });

  /**
   * The Sim player's INFERRED launch unlock (light 3, balanced 5, heavy 5) against the
   * duellist's AI-branch mastery (3 / 5 / 3). Two of three coincide, but the rules differ:
   * the source's HUMAN unlocks by skill ownership (1014 / 1017 / 1019), not mastery, and the
   * heavy value disagrees (ERRATUM 2 item 4, DIVERGENCES "L5-OPP SLICE 3a").
   */
  it('LAUNCH_UNLOCK_LEVEL is NOT the duellist\'s launch mastery: heavy differs, 5 against 3', () => {
    expect(LAUNCH_UNLOCK_LEVEL.heavy).toBe(5);
    expect(OG_SPECIAL_SKILL_MASTERY.heavy.launch).toBe(3);
    expect(LAUNCH_UNLOCK_LEVEL.heavy).not.toBe(OG_SPECIAL_SKILL_MASTERY.heavy.launch);
  });

  /**
   * The duellist's getups (`OG_GETUP`, `MCSPlayer.as:542-682`) against the humanoid mobs'
   * (`OG_HUMANOID_*`, `EnemyKatana.as` and its six twins): the same clips, separate classes.
   * The front getup's 40 and the downed bar's −100 coincide; the DOWNEDUP step does not, 120
   * against 100, which is the proof the two were tuned apart (L5-OPP slice 6b).
   */
  it('OG_GETUP is NOT the humanoids\' getup: the DOWNEDUP step is 120 against 100', () => {
    expect(OG_GETUP.frontStep).toBe(OG_HUMANOID_GETUP_STEP);
    expect(OG_GETUP.downedBarX).toBe(OG_HUMANOID_DOWNED_BAR_X);
    expect(OG_GETUP.downedUpStep).toBe(120);
    expect(OG_HUMANOID_DOWNEDUP_STEP).toBe(100);
  });

  it('OG_BOAR.runSpeed is slower than every wanderer, deliberately', () => {
    expect(OG_BOAR.runSpeed).toBeLessThan(OG_ANIMAL.runSpeed);
  });
});
