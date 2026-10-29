/**
 * `MCSPlayer.as` (4,775 lines), the body the Duel Mode opponent fights with: `EnemyPlayer`
 * extends it, and the AI drives it with the same calls the human's mouse feeds (L5-OPP,
 * ruling R2: one body). Ported slice by slice, on the fields 1b-ii's `DuellistBody` carries:
 * slice 3a, THE STANCE (`canChangeStance`, `setStance`, `getStance`, `initSpecialSkills`,
 * `stopMoving`, `getDamage`, `getBaseDamage`), slice 3b, THE MOVEMENT (`initMove`,
 * `movement`, `movePlayer`, `moveTo`), slice 4a, THE STROKE MAKERS, slice 4b, THE SLASH
 * START (`initSlash`, `checkNextSlash`, `startSlash`, `cancelStealth`), slice 4c, THE
 * SLASH END (`doSlash`, `endSlash`, `endDownStab`, `deductReloadBar`), slice 5a, THE GROUND
 * STROKE (`update` whole, and the three switches' IDLE, RUN, WALK, SLASH and POSE), slice 5b, THE
 * AIR AND THE DOWNSTAB, slice 6a, THE HIT AND THE FLINCH (`checkHitObject`, `doFlinch`,
 * `endFlinch` and their helpers; the body's HP, chi and defences), slice 6b, THE LAUNCH AND
 * THE GETUP (`gotLaunched`, `gotKneeGroin`, `doLaunched` and the switches' reception groups), and
 * slice 6c, THE BLOW, THE DEATH AND THE REWARD (`gotHit`, `die`, `EnemyPlayer`'s `gotDeathTouch`,
 * `createLoot` and `rewardXP`, the death's clip ends and DYING), and slice 7a, THE BRAIN
 * (`EnemyPlayer.AI`, `isUnderSlash`, `doEvade`, the skill bookkeeping, `init`'s cooldown table and
 * `update`'s tick, and `SkillManager.startSkill`'s preamble and tail).
 *
 * Android structure, web numbers (ruling R6). Where the builds differ in STRUCTURE the web
 * side is ported, and `docs/DIVERGENCES.md` "L5-OPP SLICE 3a" rules each:
 *   - a stance change in battle costs a flat 48 frames of reload (Android: to a third
 *     above half of `maxreload`, else a sixth off);
 *   - `stopMoving` returns early for a body that cannot change stance (Android stops it);
 *   - `getDamage`'s full-reload bonus is ×1.3 in every stance (Android ×1.5 light, ×1.2 else).
 *   - `initMove` measures before it sets `destX`, from the untruncated point (DIVERGENCES
 *     "L5-OPP SLICE 3b"; the other three movement functions are the same in both builds).
 *   - `initSlash` puts a downstab on the body's side by `posX` (Android: `mcs.x`, the screen
 *     x), and the web `isAirborne` counts FALL (DIVERGENCES "L5-OPP SLICE 4b").
 *   - `endSlash` names itself the hit's attacker (DIVERGENCES "L5-OPP SLICE 4c").
 *   - `doAction` POSE names the attacker too, and ends in a `break` where Android falls through
 *     into SKILL_BULLCHARGE (DIVERGENCES "L5-OPP SLICE 5a").
 *   - `checkHitObject` refuses the body's own packet, dodges a roll at 75 / 85 / 95 and on a full
 *     Focus bar, never lets the weapon or the prop take the hit, clears the stun only on a landed
 *     hit and caps the juggle per attacker stance; `isUsingSkill` names four more states
 *     (DIVERGENCES "L5-OPP SLICE 6 — THE MAP", "6a").
 *   - `gotLaunched` counts every launch, before `NPC`'s guard; a fly-away hands the packet the
 *     body's velocity as a FLY (DIVERGENCES "L5-OPP SLICE 6b").
 *   - `gotHit` takes × 0.9 from the stance a body beats and × 1.3 on a beheading, clears the
 *     beheading on any other part, and turns a downed or capped body's AIR packet into NONE; a
 *     death clip's end goes on into `doAction`; a friendly body drops nothing (DIVERGENCES "6c").
 *   - the AI with no target wanders within 100 of the edges to `[150, width − 150)` (Android 50);
 *     `canUseSkill` refuses a chi-costing skill at chi 0; a cooldown scales by the human's speed
 *     `/ 600`, capped at 600 (Android `/ 300`) (DIVERGENCES "L5-OPP SLICE 7 — THE MAP", "7a").
 *
 * Only the opponent's path is ported: `controlledBy == 1` (`DuelModeUI.as:381`). The human's
 * branches (`controlledBy` 0 or 2: the UI calls, the network, `initSpecialSkills`' skill-id
 * branch) are out of the lane; `nextStance` is too, because only the human's UI calls it
 * (`BattleUI.as:364`, `InputManager.as:601`).
 *
 * THE HARNESS RULE (L5_OPPONENT_KICKOFF §3): a call into a group not ported yet goes through
 * `unported()`, which THROWS, so a test that reaches it fails loudly rather than no-oping.
 * The count of those sites is pinned in `tests/mcsPlayer.test.ts` and only goes down, once a
 * switch is dispatched: each of the three switches sends the labels not ported yet through ONE
 * site that names the label (`OG_CLIP_END_LABELS` & co.), and a value with no label is the
 * source's no-op. 6a SHADOWED each reception override not ported yet with one, so the duellist
 * could never fall into the mobs' reception; 6c replaced the last. An override whose AI path is
 * its `super` call alone (`gotKnockDown`, `gotFly`, `gotFlyAway`, `doFly`, and `gotBackThrow`,
 * whose own guard repeats `NPC`'s) or `NPC`'s lines again (`EnemyPlayer.deathAnimEnd`) is not
 * carried: the duellist runs `NPC`'s, the same shape in both builds (6b, 6c).
 *
 * AS3 stores every one of these into an `int`, so each result is truncated (`asInt`).
 */
import { OG_ANIM, OG_LAUNCH, OG_PART, OG_STATE, type OgPart, type OgState } from '../../config/ogActor';
import { OG_NO_STANCE, OG_STANCE } from '../../config/ogDuellistProfile';
import {
  OG_AI,
  OG_AI_RANGE_SQ,
  OG_AI_SKILL_LISTS,
  OG_BLOW,
  OG_CHARGING,
  OG_CLIP_END_LABELS,
  OG_DO_ACTION_LABELS,
  OG_DUELLIST_REWARD,
  OG_EVADE,
  OG_EVASION,
  OG_GETUP,
  OG_MOVE_DIST_SQ,
  OG_RECEPTION,
  OG_SLASH,
  OG_SLASH_END,
  OG_SKILL,
  OG_SLASH_TYPE,
  OG_SPECIAL_SKILL_MASTERY,
  OG_STANCE_CHANGE_RELOAD,
  OG_STANCE_DAMAGE,
  OG_STANCE_REACH,
  OG_START_ACTION_LABELS,
  OG_STATE_MACHINE,
  OG_STROKE,
} from '../../config/ogMcsPlayer';
import { OG_NPC_FLOATING_TEXT, OG_NPC_HIT_IFRAMES, OG_NPC_LAUNCH } from '../../config/ogNpcBase';
import { ONE, ZERO } from '../../config/nums';
import { OG_FPS } from '../../config/timing';
import type { Rng } from '../Sim';
import type { DuellistBody } from './duellistBody';
import { getMastery, type SkillStat } from './duellistProfile';
import { asInt } from './MCSActor';
import { Npc } from './Npc';
import { NpcDamage } from './NpcDamage';
import type { AnimLibrary, HitGeometry, HitShape, NpcTarget, PlayerWorld } from './types';
import { getChiCost, getCooldown, skillCooldownModifier, skillData } from './xmlSkill';

/** A call into an `MCSPlayer` group not ported yet: throws, naming the AS3 function (and the label a switch was handed). */
export function unported(fn: string, label?: string): never {
  throw new Error(label === undefined ? `unported: ${fn}` : `unported: ${fn} (${label})`);
}

/** `OG_STATE`'s key for a state, for a switch's `unported` message. */
function stateName(s: OgState): string {
  return Object.keys(OG_STATE).find((k) => OG_STATE[k as keyof typeof OG_STATE] === s) ?? String(s);
}

const K = OG_SKILL;

/** `OG_SKILL`'s key for an id with an arm in `startSkill`'s `switch`, for its `unported` message; none, undefined. */
function skillArm(id: number): string | undefined {
  return Object.keys(K).find((k) => K[k as keyof typeof K] === id);
}

/** `startSkill` lets a charging body through for these four (`SkillManager.as:137`, web `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:149`). */
const CHARGED_SKILLS: readonly number[] = [K.CHARGEDSHOT, K.SHUNPO, K.THOUSANDSTABS, K.DEADLYCLEAVE];

/** A `flash.geom.Point`: one point of a stroke or a move. */
export interface MovePoint {
  readonly x: number;
  readonly y: number;
}

/** `lineArray[0]`: an AS3 `Vector` read past its end throws a RangeError, so this does too. */
function firstPoint(points: readonly MovePoint[]): MovePoint {
  const p = points[ZERO];
  if (p === undefined) throw new RangeError('gotInput: an empty stroke');
  return p;
}

/** `setStance`'s idle clip per stance (`MCSPlayer.as:3033-3085`). */
const STANCE_IDLE: Readonly<Record<number, string>> = {
  [OG_STANCE.light]: OG_ANIM.IDLE_LIGHT,
  [OG_STANCE.balanced]: OG_ANIM.IDLE_BALANCED,
  [OG_STANCE.heavy]: OG_ANIM.IDLE_HEAVY,
  [OG_STANCE.reversed]: OG_ANIM.IDLE_REVERSED,
  [OG_STANCE.dual]: OG_ANIM.IDLE_DUAL,
};

const T = OG_SLASH_TYPE;

/**
 * `startSlash`'s clip per stance and slash type (`MCSPlayer.as:2540-2675`, web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2612-2747`). A type a stance
 * has no clip for (AIR outside light) leaves the clip as it was, as the source's if-chain does.
 */
const SLASH_CLIP: Readonly<Record<number, Readonly<Record<number, string>>>> = {
  [OG_STANCE.light]: {
    [T.hor]: OG_ANIM.LIGHTSLASH_START, [T.horDown]: OG_ANIM.LIGHTSLASHDOWN_START,
    [T.horUp]: OG_ANIM.LIGHTSLASHUP_START, [T.jump]: OG_ANIM.LIGHTJUMPSLASH_START,
    [T.drop]: OG_ANIM.LIGHTFALLSLASH_START, [T.up]: OG_ANIM.LIGHTJUMPSLASH_START,
    [T.air]: OG_ANIM.LIGHTJUMPSLASH_RISE,
  },
  [OG_STANCE.balanced]: {
    [T.hor]: OG_ANIM.BALANCEDSLASH_START, [T.horDown]: OG_ANIM.BALANCEDSLASHDOWN_START,
    [T.horUp]: OG_ANIM.BALANCEDSLASHUP_START, [T.jump]: OG_ANIM.BALANCEDJUMPSLASH_START,
    [T.drop]: OG_ANIM.BALANCEDFALLSLASH_START, [T.up]: OG_ANIM.BALANCEDJUMPSLASH_START,
  },
  [OG_STANCE.heavy]: {
    [T.hor]: OG_ANIM.HEAVYSLASH_START, [T.horDown]: OG_ANIM.HEAVYSLASHDOWN_START,
    [T.horUp]: OG_ANIM.HEAVYSLASHUP_START, [T.jump]: OG_ANIM.HEAVYJUMPSLASH_START,
    [T.drop]: OG_ANIM.HEAVYFALLSLASH_START, [T.up]: OG_ANIM.HEAVYJUMPSLASH_START,
  },
  [OG_STANCE.dual]: {
    [T.hor]: OG_ANIM.DUALSLASH_START, [T.horDown]: OG_ANIM.DUALSLASHDOWN_START,
    [T.horUp]: OG_ANIM.DUALSLASHUP_START, [T.jump]: OG_ANIM.DUALJUMPSLASH_START,
    [T.drop]: OG_ANIM.DUALFALLSLASH_START, [T.up]: OG_ANIM.DUALJUMPSLASH_START,
  },
  [OG_STANCE.reversed]: {
    [T.hor]: OG_ANIM.REVERSEDSLASH_START, [T.horDown]: OG_ANIM.REVERSEDSLASH_START,
    [T.horUp]: OG_ANIM.REVERSEDSLASH_START, [T.jump]: OG_ANIM.REVERSEDJUMPSLASH_START,
    [T.drop]: OG_ANIM.REVERSEDFALLSLASH_START, [T.up]: OG_ANIM.REVERSEDJUMPSLASH_START,
  },
};

/**
 * `doSlash`'s clips per stance, the ones the body travels on (`MCSPlayer.as:2710-2758`, web
 * `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2782-2830`, all 36 names the same): the three flat slashes' start and
 * middle, the fall slash's and the jump slash's middle. A jump or fall slash's START holds still.
 */
const SLASH_TRAVEL: Readonly<Record<number, readonly string[]>> = {
  [OG_STANCE.light]: [
    OG_ANIM.LIGHTSLASH_START, OG_ANIM.LIGHTSLASH_MID, OG_ANIM.LIGHTSLASHDOWN_START, OG_ANIM.LIGHTSLASHDOWN_MID,
    OG_ANIM.LIGHTSLASHUP_START, OG_ANIM.LIGHTSLASHUP_MID, OG_ANIM.LIGHTFALLSLASH_MID, OG_ANIM.LIGHTJUMPSLASH_RISE,
  ],
  [OG_STANCE.balanced]: [
    OG_ANIM.BALANCEDSLASH_START, OG_ANIM.BALANCEDSLASH_MID, OG_ANIM.BALANCEDSLASHDOWN_START, OG_ANIM.BALANCEDSLASHDOWN_MID,
    OG_ANIM.BALANCEDSLASHUP_START, OG_ANIM.BALANCEDSLASHUP_MID, OG_ANIM.BALANCEDFALLSLASH_MID, OG_ANIM.BALANCEDJUMPSLASH_RISE,
  ],
  [OG_STANCE.heavy]: [
    OG_ANIM.HEAVYSLASH_START, OG_ANIM.HEAVYSLASH_MID, OG_ANIM.HEAVYSLASHDOWN_START, OG_ANIM.HEAVYSLASHDOWN_MID,
    OG_ANIM.HEAVYSLASHUP_START, OG_ANIM.HEAVYSLASHUP_MID, OG_ANIM.HEAVYFALLSLASH_MID, OG_ANIM.HEAVYJUMPSLASH_RISE,
  ],
  [OG_STANCE.dual]: [
    OG_ANIM.DUALSLASH_START, OG_ANIM.DUALSLASH_MID, OG_ANIM.DUALSLASHDOWN_START, OG_ANIM.DUALSLASHDOWN_MID,
    OG_ANIM.DUALSLASHUP_START, OG_ANIM.DUALSLASHUP_MID, OG_ANIM.DUALFALLSLASH_MID, OG_ANIM.DUALJUMPSLASH_RISE,
  ],
  [OG_STANCE.reversed]: [
    OG_ANIM.REVERSEDSLASH_START, OG_ANIM.REVERSEDSLASH_MID, OG_ANIM.REVERSEDFALLSLASH_MID, OG_ANIM.REVERSEDJUMPSLASH_RISE,
  ],
};

/** The three flat slash types: `doSlash` does not drop them by `velY`. */
const FLAT_SLASH: readonly number[] = [T.hor, T.horDown, T.horUp];

/** `startSlash`'s speed per stance: dual takes heavy's, reversed balanced's. No stance, no speed. */
const SLASH_SPEED: Readonly<Record<number, number>> = {
  [OG_STANCE.light]: OG_SLASH.lightSpeed,
  [OG_STANCE.balanced]: OG_SLASH.balancedSpeed,
  [OG_STANCE.heavy]: OG_SLASH.heavySpeed,
  [OG_STANCE.dual]: OG_SLASH.heavySpeed,
  [OG_STANCE.reversed]: OG_SLASH.balancedSpeed,
};

/** `startAction` RUN's clip per stance, with a slash to run to (`MCSPlayer.as:1241-1262`). No stance, no clip. */
const RUN_CLIP: Readonly<Record<number, string>> = {
  [OG_STANCE.light]: OG_ANIM.RUN_LIGHT,
  [OG_STANCE.balanced]: OG_ANIM.RUN_BALANCED,
  [OG_STANCE.heavy]: OG_ANIM.RUN_HEAVY,
  [OG_STANCE.dual]: OG_ANIM.RUN_DUAL,
  [OG_STANCE.reversed]: OG_ANIM.RUN_REVERSED,
};

/**
 * `startAction` POSE's clip per stance (`MCSPlayer.as:1341-1451`): a jump or drop slash ends in
 * the fall slash's end, an up slash in the jump slash's landing, the two tilts in their own ends
 * (reversed has none: its flat end), and every other type in the flat end.
 */
const POSE_CLIP: Readonly<Record<number, { fall: string; land: string; down: string; up: string; flat: string }>> = {
  [OG_STANCE.light]: {
    fall: OG_ANIM.LIGHTFALLSLASH_END, land: OG_ANIM.LIGHTJUMPSLASH_LAND,
    down: OG_ANIM.LIGHTSLASHDOWN_END, up: OG_ANIM.LIGHTSLASHUP_END, flat: OG_ANIM.LIGHTSLASH_END,
  },
  [OG_STANCE.balanced]: {
    fall: OG_ANIM.BALANCEDFALLSLASH_END, land: OG_ANIM.BALANCEDJUMPSLASH_LAND,
    down: OG_ANIM.BALANCEDSLASHDOWN_END, up: OG_ANIM.BALANCEDSLASHUP_END, flat: OG_ANIM.BALANCEDSLASH_END,
  },
  [OG_STANCE.heavy]: {
    fall: OG_ANIM.HEAVYFALLSLASH_END, land: OG_ANIM.HEAVYJUMPSLASH_LAND,
    down: OG_ANIM.HEAVYSLASHDOWN_END, up: OG_ANIM.HEAVYSLASHUP_END, flat: OG_ANIM.HEAVYSLASH_END,
  },
  [OG_STANCE.dual]: {
    fall: OG_ANIM.DUALFALLSLASH_END, land: OG_ANIM.DUALJUMPSLASH_LAND,
    down: OG_ANIM.DUALSLASHDOWN_END, up: OG_ANIM.DUALSLASHUP_END, flat: OG_ANIM.DUALSLASH_END,
  },
  [OG_STANCE.reversed]: {
    fall: OG_ANIM.REVERSEDFALLSLASH_END, land: OG_ANIM.REVERSEDJUMPSLASH_LAND,
    down: OG_ANIM.REVERSEDSLASH_END, up: OG_ANIM.REVERSEDSLASH_END, flat: OG_ANIM.REVERSEDSLASH_END,
  },
};

/**
 * The clip-end switch's two ground bands, one clip to the next (`MCSPlayer.as:317-355` and
 * `:426-464`, web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:336-374` and `:445-483`): each of the 13 ground slashes' START
 * opens its MID, and each END its POSE. The 13 ENDs are also the clips `doAction` POSE hits on.
 */
const SLASH_START_MID: Readonly<Record<string, string>> = {
  [OG_ANIM.LIGHTSLASH_START]: OG_ANIM.LIGHTSLASH_MID,
  [OG_ANIM.LIGHTSLASHDOWN_START]: OG_ANIM.LIGHTSLASHDOWN_MID,
  [OG_ANIM.LIGHTSLASHUP_START]: OG_ANIM.LIGHTSLASHUP_MID,
  [OG_ANIM.BALANCEDSLASH_START]: OG_ANIM.BALANCEDSLASH_MID,
  [OG_ANIM.BALANCEDSLASHDOWN_START]: OG_ANIM.BALANCEDSLASHDOWN_MID,
  [OG_ANIM.BALANCEDSLASHUP_START]: OG_ANIM.BALANCEDSLASHUP_MID,
  [OG_ANIM.HEAVYSLASH_START]: OG_ANIM.HEAVYSLASH_MID,
  [OG_ANIM.HEAVYSLASHDOWN_START]: OG_ANIM.HEAVYSLASHDOWN_MID,
  [OG_ANIM.HEAVYSLASHUP_START]: OG_ANIM.HEAVYSLASHUP_MID,
  [OG_ANIM.DUALSLASH_START]: OG_ANIM.DUALSLASH_MID,
  [OG_ANIM.DUALSLASHDOWN_START]: OG_ANIM.DUALSLASHDOWN_MID,
  [OG_ANIM.DUALSLASHUP_START]: OG_ANIM.DUALSLASHUP_MID,
  [OG_ANIM.REVERSEDSLASH_START]: OG_ANIM.REVERSEDSLASH_MID,
};
const SLASH_END_POSE: Readonly<Record<string, string>> = {
  [OG_ANIM.LIGHTSLASH_END]: OG_ANIM.LIGHTSLASH_POSE,
  [OG_ANIM.LIGHTSLASHDOWN_END]: OG_ANIM.LIGHTSLASHDOWN_POSE,
  [OG_ANIM.LIGHTSLASHUP_END]: OG_ANIM.LIGHTSLASHUP_POSE,
  [OG_ANIM.BALANCEDSLASH_END]: OG_ANIM.BALANCEDSLASH_POSE,
  [OG_ANIM.BALANCEDSLASHDOWN_END]: OG_ANIM.BALANCEDSLASHDOWN_POSE,
  [OG_ANIM.BALANCEDSLASHUP_END]: OG_ANIM.BALANCEDSLASHUP_POSE,
  [OG_ANIM.HEAVYSLASH_END]: OG_ANIM.HEAVYSLASH_POSE,
  [OG_ANIM.HEAVYSLASHDOWN_END]: OG_ANIM.HEAVYSLASHDOWN_POSE,
  [OG_ANIM.HEAVYSLASHUP_END]: OG_ANIM.HEAVYSLASHUP_POSE,
  [OG_ANIM.DUALSLASH_END]: OG_ANIM.DUALSLASH_POSE,
  [OG_ANIM.DUALSLASHDOWN_END]: OG_ANIM.DUALSLASHDOWN_POSE,
  [OG_ANIM.DUALSLASHUP_END]: OG_ANIM.DUALSLASHUP_POSE,
  [OG_ANIM.REVERSEDSLASH_END]: OG_ANIM.REVERSEDSLASH_POSE,
};

/**
 * The pose → sheathe group, ONE `case` group in the source (`MCSPlayer.as:465-496`, web
 * `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:484-515`): the 13 ground POSEs, the 5 jump slashes' landings and the 5 fall
 * slashes' ends.
 */
const POSE_ENDS: readonly string[] = [
  ...Object.values(SLASH_END_POSE),
  OG_ANIM.LIGHTJUMPSLASH_LAND, OG_ANIM.BALANCEDJUMPSLASH_LAND, OG_ANIM.HEAVYJUMPSLASH_LAND,
  OG_ANIM.DUALJUMPSLASH_LAND, OG_ANIM.REVERSEDJUMPSLASH_LAND,
  OG_ANIM.LIGHTFALLSLASH_END, OG_ANIM.BALANCEDFALLSLASH_END, OG_ANIM.HEAVYFALLSLASH_END,
  OG_ANIM.DUALFALLSLASH_END, OG_ANIM.REVERSEDFALLSLASH_END,
];

/**
 * The clip-end switch's jump band (`MCSPlayer.as:356-410`, web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:375-429`): a JUMP stroke's
 * START falls into its fall slash, an UP stroke's rises. SOURCE QUIRK, the same in both builds:
 * light's JUMP skips its fall slash's START (`MCSPlayer.as:359`, web `:378`).
 */
const JUMP_START_NEXT: Readonly<Record<string, { readonly fall: string; readonly rise: string }>> = {
  [OG_ANIM.LIGHTJUMPSLASH_START]: { fall: OG_ANIM.LIGHTFALLSLASH_MID, rise: OG_ANIM.LIGHTJUMPSLASH_RISE },
  [OG_ANIM.BALANCEDJUMPSLASH_START]: { fall: OG_ANIM.BALANCEDFALLSLASH_START, rise: OG_ANIM.BALANCEDJUMPSLASH_RISE },
  [OG_ANIM.HEAVYJUMPSLASH_START]: { fall: OG_ANIM.HEAVYFALLSLASH_START, rise: OG_ANIM.HEAVYJUMPSLASH_RISE },
  [OG_ANIM.DUALJUMPSLASH_START]: { fall: OG_ANIM.DUALFALLSLASH_START, rise: OG_ANIM.DUALJUMPSLASH_RISE },
  [OG_ANIM.REVERSEDJUMPSLASH_START]: { fall: OG_ANIM.REVERSEDFALLSLASH_START, rise: OG_ANIM.REVERSEDJUMPSLASH_RISE },
};

/** The clip-end switch's fall band (`MCSPlayer.as:411-425`, web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:430-444`): each fall slash's START opens its MID. */
const FALL_START_MID: Readonly<Record<string, string>> = {
  [OG_ANIM.LIGHTFALLSLASH_START]: OG_ANIM.LIGHTFALLSLASH_MID,
  [OG_ANIM.BALANCEDFALLSLASH_START]: OG_ANIM.BALANCEDFALLSLASH_MID,
  [OG_ANIM.HEAVYFALLSLASH_START]: OG_ANIM.HEAVYFALLSLASH_MID,
  [OG_ANIM.DUALFALLSLASH_START]: OG_ANIM.DUALFALLSLASH_MID,
  [OG_ANIM.REVERSEDFALLSLASH_START]: OG_ANIM.REVERSEDFALLSLASH_MID,
};

/**
 * `startAction` FALL's clip per stance (`MCSPlayer.as:1280-1336`, web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:1332-1388`): an UP
 * stroke's jump slash, any other type the fall slash's MID. SOURCE QUIRK, the same in both builds:
 * light's other is BALANCED's (`MCSPlayer.as:1289`, web `:1341`). No stance, no clip.
 */
const FALL_CLIP: Readonly<Record<number, { readonly up: string; readonly other: string }>> = {
  [OG_STANCE.light]: { up: OG_ANIM.LIGHTJUMPSLASH_SLASH, other: OG_ANIM.BALANCEDFALLSLASH_MID },
  [OG_STANCE.balanced]: { up: OG_ANIM.BALANCEDJUMPSLASH_SLASH, other: OG_ANIM.BALANCEDFALLSLASH_MID },
  [OG_STANCE.heavy]: { up: OG_ANIM.HEAVYJUMPSLASH_SLASH, other: OG_ANIM.HEAVYFALLSLASH_MID },
  [OG_STANCE.dual]: { up: OG_ANIM.DUALJUMPSLASH_SLASH, other: OG_ANIM.DUALFALLSLASH_MID },
  [OG_STANCE.reversed]: { up: OG_ANIM.REVERSEDJUMPSLASH_SLASH, other: OG_ANIM.REVERSEDFALLSLASH_MID },
};

/** `doFlinch`: out of these clips the body flinches bare (`MCSPlayer.as:4319`, web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4688`). */
const BARE_FLINCH: readonly string[] = [OG_ANIM.IDLE_SHEATHED, OG_ANIM.WALK_SHEATHED, OG_ANIM.RUN_SHEATHED, OG_ANIM.TIRED];

/** `isCharging`'s four states (`MCSPlayer.as:2398`, web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2470`, the same). */
const CHARGING_STATES: readonly OgState[] = [
  OG_STATE.SKILL_SHUNPO, OG_STATE.SKILL_THOUSANDSTABS, OG_STATE.SKILL_DEADLYCLEAVE, OG_STATE.CHARGING,
];

/**
 * WEB `isUsingSkill`'s states besides `isCharging`, in its order (`reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2465`): Android's 20
 * (`MCSPlayer.as:2393`) and SKILL_FIREBREATH, SKILL_WATERSPLASH, SMOKEBOMB, SMOKEBOMB2. The web
 * names SKILL_GROUNDPUNCH twice; once is enough here.
 */
const USING_SKILL: readonly OgState[] = [
  OG_STATE.DOSKILL, OG_STATE.SKILL_GROUNDPUNCH, OG_STATE.SKILL_CHIBURST, OG_STATE.WINDKICK, OG_STATE.SKILL_FIREBREATH,
  OG_STATE.SKILL_WATERSPLASH, OG_STATE.SKILL_THOUSANDSTABS, OG_STATE.SKILL_DEATHTOUCH, OG_STATE.SKILL_SPIRITTHIEF,
  OG_STATE.DASH, OG_STATE.BACKSTEP, OG_STATE.SKILL_FLASHBANG, OG_STATE.SKILL_STEALTH, OG_STATE.SKILL_SHADOWCLONE,
  OG_STATE.SKILL_MASSCLONE, OG_STATE.SKILL_SUBSTITUTIONLOG, OG_STATE.SKILL_BACKTHROW, OG_STATE.SKILL_BULLCHARGE,
  OG_STATE.SKILL_INFERNO, OG_STATE.SKILL_TSUNAMI, OG_STATE.SKILL_EARTHQUAKE, OG_STATE.SKILL_TORNADO,
  OG_STATE.SMOKEBOMB, OG_STATE.SMOKEBOMB2,
];

export class MCSPlayer extends Npc {
  declare readonly world: PlayerWorld;

  /** `MCSPlayer.as:59` */
  slashCommitted = false;
  /** `MCSPlayer.as:75-77` — what `startSlash` rolled, and the shunpo skill's flag (never set before slice 7). */
  slashDamage = ZERO;
  doShunpo = false;
  /** `MCSPlayer.as:85` — an `OG_SLASH_TYPE`. */
  slashType: number = OG_SLASH_TYPE.hor;
  /** `MCSPlayer.as:69-71` */
  minDamage: number;
  damageRange: number;
  /** `MCSPlayer.as:79` — the web build starts it at -1 (`reference/decompiled/shs3_payload/scripts/§1t99s0§.as:81`); `init` sets it. */
  stance: number = OG_NO_STANCE;
  /** `MCSPlayer.as:81` — always 0 on the duellist (1b-ii). */
  STAT_CRITICALDMG: number;
  /** `MCSPlayer.as:83` — the hit's piercing damage. */
  STAT_PIERCINGDMG: number;
  /** `MCSPlayer.as:73` — the weapon's reload cost per slash. */
  slashUsage: number;
  /** `MCSPlayer.as:91-93` — frames. */
  reload: number;
  maxreload: number;
  /** `MCSPlayer.as:97` — the reach `setStance` derives. */
  slashLength = ZERO;
  /** `MCSPlayer.as:107` */
  baseSlashLength: number;
  /** `MCSPlayer.as:109-113` */
  lightMastery: number;
  balancedMastery: number;
  heavyMastery: number;
  /** `MCSPlayer.as:117-127` — the special moves `initSpecialSkills` unlocks. */
  canLaunch = false;
  canStab = false;
  canFlipUp = false;
  canAirCombo = false;
  canDeflect = false;
  /** The move target and the slash buffer `stopMoving` clears (slice 3b / 4 own them). */
  destX = ZERO;
  destY = ZERO;
  hasSlash = false;
  hasSlashBuffer = false;
  inputArray: MovePoint[] = [];
  slashArray: MovePoint[] = [];
  slashArrayBuffer: MovePoint[] = [];
  /** `MCSPlayer.as:103` — frames the speech bubble stays up; the AI's taunts set it (slice 7). */
  speechCounter: number = OG_STATE_MACHINE.speechOff;
  /** `MCSPlayer.as:137-139` — frames left in the stealth and the log substitution (their skills are later slices). */
  invisCounter = ZERO;
  logsubCounter = ZERO;
  /**
   * `MCSPlayer.as:135` — the charge's FX clip. Only clip ends behind the clip-end catch-all write
   * it (DASH, BULLCHARGE, CHICHARGE: `MCSPlayer.as:918`, `:1112`, `:1145`), so it stays null here.
   */
  chargingFx: object | null = null;
  /**
   * WEB only (`reference/decompiled/shs3_payload/scripts/§1t99s0§.as:143`, `§1t4438s0§`): the air-juggle count the reception reads
   * (`:3581`, `:3860`, `:4198`; slice 6). FALL's landing resets it (`:2001`); its other writers are
   * in groups not ported yet (DIVERGENCES "L5-OPP SLICE 5b" lists them).
   */
  juggleCount = ZERO;
  /**
   * `MCSPlayer.as:87-89`. `setChi` stores chi × `StatsManager.multiplier` (a random 2–6, an
   * anti-tamper mask) and `getChi` divides it back out; the port keeps the value itself, as
   * `MCSActor` does HP, and so do `getChi` / `setChi` (6b).
   */
  maxchi: number;
  chi: number;
  /** `MCSPlayer.as:129` — the skills and their levels; `EnemyPlayer.init` fills it from the profile (7a). */
  skillList: readonly SkillStat[] | null = null;
  /** `EnemyPlayer.as:24` — frames left per skill id; an id with no entry is never usable (AS3's `undefined == 0` is false). */
  readonly cooldownArray = new Map<number, number>();
  /** `MCSPlayer.as:123` — the AI sees the human's slash; `EnemyPlayer.init` sets it (`EnemyPlayer.as:817`). */
  canSeeSlash = true;
  /**
   * `EnemyPlayer.as:20` — a boss fights at its `minDamage`. Never true on the duellist (OPP-D item
   * 2): the duel's profile builds `new EnemyPlayer(mcs, true, false)` (`NPCManager.as:519`).
   */
  isBoss = false;
  /** `EnemyPlayer.as:28` — the peaceful duel's bow, once. */
  hasBowed = false;
  /** `MCSPlayer.as:151` — the reload the AI waits for before it strokes. */
  doReload: number = OG_AI.doReloadStart;
  /** `MCSPlayer.as:133` — a skill's charge, in frames. */
  chargingTime = ZERO;

  /** `EnemyPlayer.init`'s body (slice 1b-ii); `init`'s closing `setStance` is the caller's. */
  constructor(world: PlayerWorld, anims: AnimLibrary, geometry: HitGeometry, rng: Rng, body: DuellistBody) {
    super(world, anims, geometry, rng);
    this.minDamage = body.minDamage;
    this.damageRange = body.damageRange;
    this.STAT_CRITICALDMG = body.criticalDmg;
    this.STAT_PIERCINGDMG = body.piercingDmg;
    this.slashUsage = body.slashUsage;
    this.level = body.level;
    this.reload = body.reload;
    this.maxreload = body.maxReload;
    this.baseSlashLength = body.baseSlashLength;
    this.lightMastery = body.lightMastery;
    this.balancedMastery = body.balancedMastery;
    this.heavyMastery = body.heavyMastery;
    this.walkSpeed = body.walkSpeed;
    // `initPlayer` (`MCSPlayer.as:182`): HP, chi and defense; `initElementDefenseStats` (`:260`).
    this.setHP(body.hp);
    this.maxhp = body.maxHp;
    this.chi = body.chi;
    this.maxchi = body.maxChi;
    this.defense = body.defense;
    this.STAT_FIREDEF = body.fireDef;
    this.STAT_WINDDEF = body.windDef;
    this.STAT_WATERDEF = body.waterDef;
    this.STAT_EARTHDEF = body.earthDef;
    // `EnemyPlayer.init` (`EnemyPlayer.as:82`): the duellist's xp, which `rewardXP` reads.
    this.xp = body.xp;
    // `EnemyPlayer.init`'s skills (`EnemyPlayer.as:818-831`, web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:838-853`), the
    // `!isBoss` branch: the profile's list, and each id's FULL cooldown at its level, scaled by the
    // human's speed now. An id with no skill data gets no entry.
    this.skillList = body.skills;
    for (const sk of body.skills) {
      const data = skillData(sk.id);
      if (data !== null) this.cooldownArray.set(sk.id, getCooldown(data, sk.value, this.cooldownScale()));
    }
    // `EnemyPlayer`'s constructor (`EnemyPlayer.as:51-52`) starts FALL, then this. FALL is ported
    // (5b) but its call is not carried: every body would start falling, which is the spawn's
    // question (slice 8; DIVERGENCES "L5-OPP SLICE 5b").
    this.aiCounterMax = OG_STATE_MACHINE.aiCounterMax;
  }

  /**
   * `EnemyPlayer.update` (`EnemyPlayer.as:908`, web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:956`, the same): a body
   * alive and unfrozen whose target is gone or dead re-aims at the nearest enemy, and with none
   * left goes IDLE, BEFORE the frame; then `MCSPlayer.update`; then each listed skill's cooldown
   * above 0 ticks down one (`EnemyPlayer.as:921-931`, web `:969-981`). The tick walks the LIST, so
   * an id listed twice ticks twice, and it runs even when `MCSPlayer.update` returned early.
   */
  override update(): void {
    if (!this.dead && !this.animFrozen && (this.target === null || this.target.isDead())) {
      this.target = this.world.nearestEnemy(asInt(this.getMapPosition()), !this.isFriendly);
      if (this.target === null) this.startAction(OG_STATE.IDLE);
    }
    this.playerUpdate();
    if (this.skillList !== null) {
      for (const sk of this.skillList) {
        const left = this.cooldownArray.get(sk.id);
        if (left !== undefined && left > ZERO) this.cooldownArray.set(sk.id, left - ONE);
      }
    }
  }

  /**
   * `MCSPlayer.update`: WEB `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:1179` (Android `MCSPlayer.as:275`, the same blocks): one frame. The clip
   * clock steps and a finished clip is ended; the AI runs once every `aiCounterMax` frames; the
   * state acts; then the reload, the hit guard, the speech bubble, the stealth and the log
   * substitution count down. The body is the AI's (`controlledBy == 1`), so the source's human
   * branches (`playbackAI`, the reload bar, the progress bar) and the web's `§1t4440s0§` timer
   * (never set on it, DIVERGENCES "L5-OPP SLICE 4c") are not carried; `autoSlash` is OR'd with
   * `controlledBy == 1`, so it is not either.
   */
  private playerUpdate(): void {
    if (this.disposed) return;
    if (this.animFrozen && this.getHP() <= ZERO) return;
    const finished = this.stepAnimation();
    if (finished !== '') this.clipEnded(finished);
    const w = this.world;
    if (!this.dead && this.checkAITrigger() && !w.adventureMode && !w.networkPlayBack) this.AI();
    this.doAction();
    if (this.reload < this.maxreload) this.reload += ONE;
    if (this.gotHitCounter > ZERO) this.gotHitCounter -= ONE;
    if (this.speechCounter > ZERO) {
      this.speechCounter -= ONE;
    } else if (this.speechCounter === ZERO) {
      this.speechCounter = OG_STATE_MACHINE.speechOff;
      this.emit({ type: 'speechClear' });
    }
    if (this.invisCounter > ZERO) {
      this.invisCounter -= ONE;
      if (this.invisCounter === ZERO) this.cancelStealth();
    }
    if (this.logsubCounter > ZERO) {
      this.logsubCounter -= ONE;
      if (this.logsubCounter === ZERO) this.cancelLogSub();
    }
  }

  /**
   * The clip-end switch: Android's is inline in `update` (`MCSPlayer.as:298-1147`), the web moved
   * it whole into a helper that returns `false` on `default` (`reference/decompiled/shs3_payload/scripts/§1t99s0§.as:305-1177`); `update`
   * ignores the value. 5a's four bands, 5b's three, 6a's FLINCH and 6b's getups are ported; the
   * other 70 of its 146 labels are unported.
   */
  clipEnded(name: string): boolean {
    const S = OG_STATE;
    const next = SLASH_START_MID[name] ?? FALL_START_MID[name] ?? SLASH_END_POSE[name];
    if (next !== undefined) {
      this.startAnim(next);
      return true;
    }
    const jump = JUMP_START_NEXT[name];
    if (jump !== undefined) {
      if (this.slashType === T.jump) {
        this.startAnim(jump.fall);
        this.y = firstPoint(this.slashArray).y + OG_STATE_MACHINE.jumpSlashDrop;
      } else if (this.slashType === T.up) {
        this.startAnim(jump.rise);
      }
      return true;
    }
    switch (name) {
      case OG_ANIM.SHEATHESWORDCHIBURI:
      case OG_ANIM.SHEATHESWORD:
        // `controlledBy == 0` plays SHEATHETOIDLE instead: the human's.
        if (!this.world.redFreeze) this.startAction(S.IDLE);
        return true;
      case OG_ANIM.SHEATHETOIDLE:
        this.startAction(S.IDLE);
        return true;
      case OG_ANIM.DOWNSTAB:
        // WEB `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:516` (Android `MCSPlayer.as:497`): the web names the attacker (`:520`).
        if (this.actionState !== S.REDFREEZE) {
          const damage = new NpcDamage(this.getDamage() * OG_STATE_MACHINE.downstabDamageMult, this.level);
          damage.setAttacker(this);
          damage.setPiercingDamage(this.STAT_PIERCINGDMG);
          // `controlledBy == 0` asks NPCManager.checkDownStab instead: the human's.
          this.aim().checkHitObject({ kind: 'part', part: OG_PART.weapon, owner: this }, damage);
          this.deductReloadBar();
          if (this.world.redFreeze) this.startAction(S.REDFREEZE);
          else this.startAnim(OG_ANIM.DOWNSTAB_UP);
        }
        return true;
      case OG_ANIM.DOWNSTAB_UP:
        this.endDownStab();
        return true;
      case OG_ANIM.FLINCH_WEAPON:
      case OG_ANIM.FLINCH:
        // `MCSPlayer.as:739` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:759`, the same.
        this.endFlinch();
        return true;
      // The death's ten clips (`MCSPlayer.as:524-541`, web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:544-561`). Android's `return`
      // leaves `update` there; the web returns from the helper, and `update` goes on into
      // `doAction` DYING, so the frame a death clip ends counts the ttl down twice. The
      // `controlledBy == 0` freeze is the human's.
      case OG_ANIM.DEFEATED1:
      case OG_ANIM.ENEMYDEATH:
      case OG_ANIM.DEATH_FORWARD:
      case OG_ANIM.DEFEATED2:
      case OG_ANIM.ENEMYDEATHNOHEAD:
      case OG_ANIM.ENEMYDEATHNOHAND:
      case OG_ANIM.DEATHDOWNED:
      case OG_ANIM.DEATHINHALF:
      case OG_ANIM.SEPPUKU_END:
      case OG_ANIM.SEPPUKU_NOHEAD:
        this.deathAnimEnd();
        return true;
      // The reception's getups (`MCSPlayer.as:542-682`, web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:562-702`), the same.
      // The `controlledBy == 0` display-name calls are the human's.
      case OG_ANIM.FLY_END:
        this.startAction(S.DOWNED);
        return true;
      case OG_ANIM.KNEEGROIN_VICTIM:
        this.startAnim(OG_ANIM.GETUP_FRONT);
        return true;
      case OG_ANIM.BACKTHROW_VICTIM:
        this.actionState = S.DOWNED;
        this.startAnim(this.canFlipUp && !this.world.adventureMode ? OG_ANIM.FLIPUP : OG_ANIM.GOTLAUNCHEDDOWNEDEND);
        this.movePlayer(this.isFacingRight() ? OG_GETUP.backThrowStep : -OG_GETUP.backThrowStep);
        return true;
      case OG_ANIM.GETUP_FRONT:
        this.movePlayer(this.isFacingRight() ? -OG_GETUP.frontStep : OG_GETUP.frontStep);
        this.startAction(S.IDLE);
        return true;
      case OG_ANIM.GOTLAUNCHED_PEAK:
        this.startAnim(OG_ANIM.GOTLAUNCHED_FALL);
        return true;
      case OG_ANIM.GOTLAUNCHEDDOWNED:
        if (this.dead) {
          this.deathAnimEnd();
          return true;
        }
        if (this.getHP() > ZERO && !this.world.redFreeze) this.showHealthBar();
        this.moveHealthBarX(OG_GETUP.downedBarX);
        if (this.canFlipUp && !this.world.adventureMode) {
          this.startAnim(OG_ANIM.FLIPUP);
          this.hideHealthBar();
        } else if (this.actionState === S.KNOCKDOWNED) {
          this.startAnim(OG_ANIM.DOWNEDUP2);
        } else {
          this.startAnim(OG_ANIM.GOTLAUNCHEDDOWNEDEND);
        }
        return true;
      case OG_ANIM.GOTLAUNCHEDDOWNEDEND:
        this.startAnim(OG_ANIM.DOWNEDUP2);
        return true;
      case OG_ANIM.DOWNEDUP:
      case OG_ANIM.DOWNEDUP2:
        this.moveHealthBarX(OG_GETUP.barXReset);
        this.showHealthBar();
        this.movePlayer(this.isFacingRight() ? -OG_GETUP.downedUpStep : OG_GETUP.downedUpStep);
        this.startAction(S.IDLE);
        return true;
      case OG_ANIM.FLIPUP:
        if (!this.world.redFreeze) this.showHealthBar();
        this.moveHealthBarX(OG_GETUP.barXReset);
        this.startAction(S.IDLE);
        return true;
      case OG_ANIM.FORWARDROLL_START:
        this.startAnim(OG_ANIM.FORWARDROLL_END);
        return true;
      case OG_ANIM.FORWARDROLL_END:
      case OG_ANIM.SHEATHEDLAND:
      case OG_ANIM.KUNAITHROW:
      case OG_ANIM.KATANAATTACK:
      case OG_ANIM.PICKUP:
      case OG_ANIM.PUNCH:
      case OG_ANIM.SPARTAKICK_END:
      case OG_ANIM.PUNCH_END:
      case OG_ANIM.KNEEGROIN:
      case OG_ANIM.BOW:
      case OG_ANIM.BOW2:
      case OG_ANIM.THROWGRENADE:
      case OG_ANIM.JUTSU_GROUND_PARTB:
      case OG_ANIM.CHARGEDSHOT_END:
      case OG_ANIM.CHICHARGE_END:
        this.startAction(S.IDLE);
        return true;
      case OG_ANIM.NINJASMOKEBOMB:
        if (this.actionState === S.SMOKEBOMB || this.actionState === S.SMOKEBOMB2) {
          this.emit({ type: 'smoke', x: asInt(this.getMapPosition()), y: asInt(this.y) });
          if (this.isFacingRight()) this.movePlayer(OG_EVASION.smokeEscape);
          else this.movePlayer(-OG_EVASION.smokeEscape);
          this.emit({ type: 'smoke', x: asInt(this.getMapPosition()), y: asInt(this.y) });
          this.startAction(S.LAND);
          this.juggleCount = ZERO;
          this.emit({ type: 'sound', name: 'smokebomb' });
        } else if (this.actionState === S.SKILL_FLASHBANG) {
          this.emit({ type: 'flashbang', x: asInt(this.getMapPosition()), y: asInt(this.y), skillLevel: this.getSkillLevel(K.FLASHBANG) });
          this.startAction(S.IDLE);
        }
        return true;
      case OG_ANIM.DASH_START:
        this.startAnim(OG_ANIM.DASH_END);
        this.actionState = S.POSE;
        if (this.chargingFx !== null) {
          this.emit({ type: 'chargingFx', action: 'remove' });
          this.chargingFx = null;
        }
        return true;
      case OG_ANIM.BACKSTEP_START:
        this.startAnim(OG_ANIM.BACKSTEP_END);
        this.actionState = S.POSE;
        if (this.chargingFx !== null) {
          this.emit({ type: 'chargingFx', action: 'remove' });
          this.chargingFx = null;
        }
        return true;
      case OG_ANIM.DASH_END:
      case OG_ANIM.BACKSTEP_END:
        this.startAction(S.IDLE);
        return true;
    }
    if (POSE_ENDS.includes(name)) {
      if (this.actionState !== S.REDFREEZE && this.world.redFreeze) this.startAction(S.REDFREEZE);
      else if (this.actionState !== S.REDFREEZE) this.startAnim(OG_ANIM.SHEATHESWORD);
      return true;
    }
    if (OG_CLIP_END_LABELS.includes(name)) unported('MCSPlayer.update clip end', name);
    return false;
  }

  /**
   * WEB `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:1258` (Android `MCSPlayer.as:1206`, the same). Records the state and,
   * on a change, removes the charge FX; then the state's entry. `prev` is the source's local, not
   * `Npc.prevActionState` (the flinch's).
   */
  override startAction(actionState: OgState): void {
    const S = OG_STATE;
    const prev = this.actionState;
    this.actionState = actionState;
    if (actionState !== prev && this.chargingFx !== null) {
      this.emit({ type: 'chargingFx', action: 'remove' });
      this.chargingFx = null;
    }
    switch (actionState) {
      case S.IDLE: {
        // The adventure-mode half of the test is `controlledBy == 0`'s: never the AI's.
        const w = this.world;
        const tired = !w.adventureMode && !w.redFreeze && this.getHP() <= this.maxhp / OG_STATE_MACHINE.tiredHpDiv;
        this.startAnim(tired ? OG_ANIM.TIRED : OG_ANIM.IDLE_SHEATHED);
        this.checkNextSlash();
        break;
      }
      case S.RUN: {
        const run = this.hasSlash ? RUN_CLIP[this.stance] : OG_ANIM.RUN_SHEATHED;
        if (run !== undefined) this.startAnim(run);
        if (this.y < this.world.groundY) this.startAction(S.FALL);
        break;
      }
      case S.WALK:
        this.startAnim(OG_ANIM.WALK_SHEATHED);
        if (this.y < this.world.groundY) this.startAction(S.FALL);
        break;
      case S.FALL: {
        const c = FALL_CLIP[this.stance];
        if (c !== undefined) this.startAnim(this.slashType === T.up ? c.up : c.other);
        break;
      }
      case S.SLASH:
        this.startSlash();
        break;
      case S.POSE: {
        const t = this.slashType;
        const c = POSE_CLIP[this.stance];
        if (t === T.downstab) this.startAnim(OG_ANIM.SHEATHESWORD);
        else if (c !== undefined) {
          if (t === T.jump || t === T.drop) this.startAnim(c.fall);
          else if (t === T.up) this.startAnim(c.land);
          else if (t === T.horDown) this.startAnim(c.down);
          else if (t === T.horUp) this.startAnim(c.up);
          else this.startAnim(c.flat);
        }
        this.checkNextSlash();
        break;
      }
      case S.FORWARDROLL:
        this.startAnim(OG_ANIM.FORWARDROLL_START);
        break;
      case S.JUMP:
        this.startAnim(OG_ANIM.SHEATHEDJUMP);
        this.velY = OG_EVASION.jumpVelY;
        break;
      case S.LAND:
        this.startAnim(OG_ANIM.SHEATHEDLAND);
        this.velY = ZERO;
        break;
      case S.SMOKEBOMB:
        this.startAnim(OG_ANIM.NINJASMOKEBOMB);
        break;
      case S.SMOKEBOMB2: {
        const airbornePrev =
          prev === S.DOWNED || prev === S.KNOCKDOWNED || prev === S.GOTLAUNCHED ||
          prev === S.FLY || prev === S.FALL || prev === S.JUMP || prev === S.VICTIM;
        if (airbornePrev) {
          this.emit({ type: 'smoke', x: asInt(this.getMapPosition()), y: asInt(this.y) });
          if (this.y < this.world.groundY - OG_EVASION.smokeBomb2AirMove) {
            this.movePlayer(this.isFacingRight() ? OG_EVASION.smokeBomb2AirMove : -OG_EVASION.smokeBomb2AirMove);
            this.y = this.world.groundY;
            this.startAction(S.LAND);
            this.emit({ type: 'smoke', x: asInt(this.getMapPosition()), y: asInt(this.y) });
            this.juggleCount = ZERO;
          } else {
            this.movePlayer(this.isFacingRight() ? OG_EVASION.smokeBomb2AirMove : -OG_EVASION.smokeBomb2AirMove);
            if (this.isFacingRight()) this.velX = OG_EVASION.smokeBomb2GroundLift;
            this.velX = OG_EVASION.smokeBomb2VelX;
            this.y -= OG_EVASION.smokeBomb2Lift;
            this.velY = ZERO;
            this.startAction(S.FALL);
            this.emit({ type: 'smoke', x: asInt(this.getMapPosition()), y: asInt(this.y) });
            this.juggleCount = OG_EVASION.smokeBomb2Juggle;
          }
          if ((prev === S.DOWNED || prev === S.KNOCKDOWNED || prev === S.FLY) && !this.world.redFreeze) {
            this.showHealthBar();
          }
          if (prev === S.DOWNED || prev === S.KNOCKDOWNED || prev === S.FLY) {
            this.moveHealthBarX(ZERO);
          }
        } else {
          this.startAnim(OG_ANIM.NINJASMOKEBOMB);
          this.juggleCount = ZERO;
        }
        break;
      }
      case S.DASH:
        this.startAnim(OG_ANIM.DASH_START);
        this.velX = this.isFacingRight() ? OG_EVASION.dashVel : -OG_EVASION.dashVel;
        this.chargingFx = {};
        this.emit({ type: 'chargingFx', action: 'create' });
        break;
      case S.BACKSTEP:
        this.startAnim(OG_ANIM.BACKSTEP_START);
        this.velX = this.isFacingRight() ? -OG_EVASION.backstepVel : OG_EVASION.backstepVel;
        this.chargingFx = {};
        this.emit({ type: 'chargingFx', action: 'create' });
        break;
      case S.SKILL_FLASHBANG:
        this.startAnim(OG_ANIM.NINJASMOKEBOMB);
        break;
      case S.GOTLAUNCHED:
        this.startAnim(OG_ANIM.GOTLAUNCHED_RISE);
        break;
      case S.KNOCKDOWNED:
      case S.DOWNED:
        this.startAnim(OG_ANIM.GOTLAUNCHEDDOWNED);
        break;
      default:
        if (OG_START_ACTION_LABELS.includes(actionState)) unported('MCSPlayer.startAction', stateName(actionState));
    }
  }

  /**
   * WEB `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:1936` (Android `MCSPlayer.as:1877`): one frame of the state. RUN and
   * WALK travel to `destX` and then slash or idle; FALL drops under gravity and lands in POSE,
   * hitting with the weapon; SLASH is `doSlash`; POSE hits with the weapon while a ground slash's
   * END plays. WEB: FALL's landing and POSE name the attacker (`:1991`, `:2184`) and FALL's resets
   * the juggle count (`:2001`); POSE ends in a `break` (`:2195`) where Android's falls through into
   * SKILL_BULLCHARGE (DIVERGENCES "L5-OPP SLICE 5a", "5b").
   */
  override doAction(): void {
    const S = OG_STATE;
    switch (this.actionState) {
      case S.IDLE:
        break;
      case S.RUN:
        if (!this.movement(OG_STATE_MACHINE.runSpeed)) this.arrive();
        break;
      case S.WALK:
        if (!this.movement(this.walkSpeed)) this.arrive();
        break;
      case S.FALL: {
        const m = OG_STATE_MACHINE;
        this.velY += m.gravity;
        this.y += this.velY;
        this.movePlayer(this.velX);
        const groundY = this.world.groundY;
        if (this.stance === OG_STANCE.light && this.hasSlash && Math.abs(firstPoint(this.slashArray).x - this.posX) < m.fallSlashRange) {
          this.startAction(S.SLASH);
        } else if (this.y >= groundY) {
          this.y = groundY;
          this.startAction(S.POSE);
          const damage = new NpcDamage(this.slashDamage, this.level, OG_LAUNCH.LAUNCH_NONE, this.stance);
          damage.setAttacker(this);
          damage.setPiercingDamage(this.STAT_PIERCINGDMG);
          // `controlledBy == 0` asks NPCManager instead: the human's.
          this.aim().checkHitObject({ kind: 'part', part: OG_PART.weapon, owner: this }, damage);
          this.juggleCount = ZERO;
        }
        break;
      }
      case S.GOTLAUNCHED:
        this.doLaunched();
        break;
      case S.FLY:
        this.doFly();
        break;
      case S.STUN:
        this.doStun();
        break;
      case S.DOWNED:
        break;
      case S.DYING:
        this.doDying();
        break;
      case S.SLASH:
        this.doSlash();
        break;
      case S.FORWARDROLL:
        if (this.animation === OG_ANIM.FORWARDROLL_END) {
          this.movePlayer(this.isFacingRight() ? OG_EVASION.forwardRollStep : -OG_EVASION.forwardRollStep);
        }
        break;
      case S.JUMP:
        this.y += this.velY;
        this.velY += OG_EVASION.jumpGravity;
        this.movePlayer(this.isFacingRight() ? OG_EVASION.jumpStep : -OG_EVASION.jumpStep);
        if (this.y >= this.world.groundY) {
          this.y = this.world.groundY;
          this.startAction(S.LAND);
        }
        break;
      case S.LAND:
        break;
      case S.DASH:
      case S.BACKSTEP:
        this.movePlayer(this.velX);
        break;
      case S.POSE:
        if (SLASH_END_POSE[this.animation] !== undefined) {
          const damage = new NpcDamage(this.slashDamage, this.level, OG_LAUNCH.LAUNCH_NONE, this.stance);
          damage.setAttacker(this);
          damage.setPiercingDamage(this.STAT_PIERCINGDMG);
          // `controlledBy == 0` asks NPCManager instead: the human's.
          this.aim().checkHitObject({ kind: 'part', part: OG_PART.weapon, owner: this }, damage);
        }
        break;
      default:
        if (OG_DO_ACTION_LABELS.includes(this.actionState)) unported('MCSPlayer.doAction', stateName(this.actionState));
    }
  }

  /** RUN's and WALK's arrival, written twice in the source: stop, then the slash if one waits, else IDLE. */
  private arrive(): void {
    this.velX = ZERO;
    this.startAction(this.hasSlash ? OG_STATE.SLASH : OG_STATE.IDLE);
  }

  /**
   * `EnemyPlayer.AI` (Android `EnemyPlayer.as:990`; web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1040`, the same but the
   * no-target wander, where the web wins), which overrides `MCSPlayer.AI`. Once every 12 frames:
   * not while busy; a downed or launched body only smokes away; 1 in 5 ticks skipped at level 3
   * and under; no target, the wander; at peace, the duel's bow; a hidden target, a wander 1 in 3;
   * then the evade, or a stroke by the target's state: the stroke already made (re-aimed if it
   * would miss), the downed target, the airborne one, and else the skill pick (1 in 4), FOCUS or a
   * wander while `reload < doReload`, a re-roll of `doReload` under 24, and at last the stroke.
   * `rng` stands in for `Math.random()`; every die lands in an `int`.
   */
  AI(): void {
    const S = OG_STATE;
    const A = OG_AI;
    const w = this.world;
    const state = this.actionState;
    if (this.animFrozen || this.isUsingSkill() || state === S.FLINCH || state === S.STUN || state === S.SKILL_UNDYING) return;
    if (this.isDowned() || state === S.GOTLAUNCHED) {
      if (!(this.canUseSkill(K.SMOKEBOMB) && this.getSkillLevel(K.SMOKEBOMB) > A.smokeAwayLevelAbove)) return;
      this.doSkill(K.SMOKEBOMB);
    }
    if (this.level <= A.skipLevelMax && this.rng() * A.skipDice < ONE) return;
    if (this.target === null || this.target.isDead()) {
      this.target = w.nearestEnemy(asInt(this.getMapPosition()), !this.isFriendly);
      if (this.target === null) {
        const at = asInt(this.getMapPosition());
        if (at < A.wanderEdge || at > w.stageWidth - A.wanderEdge) {
          this.moveTo(this.rng() * (w.stageWidth - A.wanderSpan) + A.wanderFrom, w.groundY);
        }
        return;
      }
    }
    const t = this.target;
    if (w.peaceful) {
      if (!this.hasBowed && w.duelMode) {
        this.hasBowed = true;
        this.startAction(S.IDLE);
        this.startAnim(OG_ANIM.BOW2);
      }
      if (this.actionState === S.IDLE && Math.abs(this.getTargetPosition() - asInt(this.getMapPosition())) < A.peacefulNear) {
        this.moveTo(this.rng() * w.stageWidth, w.groundY);
      }
      return;
    }
    // `target != null && alpha < 1 || !visible`: the target is never null here.
    if (t.alpha < ONE || !t.visible) {
      if (asInt(this.rng() * A.hiddenDice) === ZERO) this.moveTo(this.rng() * w.stageWidth, w.groundY);
      return;
    }
    const now = this.actionState;
    if (
      !this.isFriendly && this.canSeeSlash && this.level > A.evadeLevelAbove && w.playerHasSlash &&
      asInt(this.rng() * A.evadeDice) <= A.evadeRollMax && this.isUnderSlash()
    ) {
      this.doEvade();
    } else if (!(now === S.SLASH || now === S.SLASH_START || now === S.FALL)) {
      if (this.hasSlash || this.animation === OG_ANIM.DOWNSTAB || this.animation === OG_ANIM.DOWNSTAB_UP) {
        // Does the stroke already made cross the target? Else aim it again.
        let flag = false;
        for (let i = ZERO; i < this.inputArray.length && !flag; i += ONE) {
          const pt = this.inputArray[i];
          if (pt !== undefined && this.geometry.clipHitTestPoint(t, pt.x, pt.y, true)) flag = true;
        }
        if (!flag) this.slashTarget();
      } else if (t.isDowned()) {
        this.doSkill(K.HEAVENLYSWORDS, this.getTargetPosition());
        const downedDist = Math.abs(this.getTargetPosition() - asInt(this.getMapPosition()));
        if (this.canUseSkill(K.AIRSTAB) && downedDist > A.airStabNear && downedDist < A.airStabFar) {
          this.faceTarget();
          this.doSkill(K.AIRSTAB);
        } else if (this.canStab) {
          this.stabTarget();
        } else if (asInt(this.rng() * A.downedDice) === ZERO) {
          this.slashDownedTarget();
        } else {
          this.moveTo(this.rng() * w.stageWidth, w.groundY);
        }
      } else if (this.canAirCombo && t.isAirborne()) {
        if (
          Math.abs(this.getTargetPosition() - asInt(this.getMapPosition())) < A.airComboRange &&
          (this.stance === OG_STANCE.light || this.stance === OG_STANCE.balanced)
        ) {
          // `target.getMapPosition() < mcs.x`: the map x against the SCREEN x, as the source reads.
          if (this.getTargetPosition() < this.x) this.slashDiagonalLeft();
          else this.slashDiagonalRight();
        }
      } else {
        if (asInt(this.rng() * A.skillDice) === ZERO) {
          this.faceTarget();
          const list = this.getUsableSkills(this.getTargetPosition() - asInt(this.getMapPosition()));
          if (list.length > ZERO) {
            const selected = list[asInt(this.rng() * list.length)];
            if (selected === undefined) throw new RangeError('AI: a pick past the list');
            // OPP-D items 5 and 6: the charged skills' state and charge, then released at once
            // (`doSkill` passes no point); the cleave wears the FLURRY's state.
            if (selected === K.CHARGEDSHOT && this.canUseSkill(selected)) {
              this.chargingTime = A.chargedShotTime;
            } else if (selected === K.SHUNPO && this.canUseSkill(selected)) {
              this.actionState = S.SKILL_SHUNPO;
              this.chargingTime = A.shunpoTime;
            } else if (selected === K.THOUSANDSTABS && this.canUseSkill(selected)) {
              this.actionState = S.SKILL_THOUSANDSTABS;
              this.chargingTime = A.thousandStabsTime;
            } else if (selected === K.DEADLYCLEAVE && this.canUseSkill(selected)) {
              this.actionState = S.SKILL_THOUSANDSTABS;
              this.chargingTime = A.deadlyCleaveTime;
            }
            if (this.doSkill(selected)) return;
          }
        }
        if (this.reload < this.doReload) {
          if (this.doSkill(K.FOCUS)) return;
          if (this.actionState === S.IDLE || this.actionState === S.POSE) this.moveTo(this.rng() * w.stageWidth, w.groundY);
        } else if (this.reload < A.reloadFloor) {
          this.doReload = asInt(A.reloadFloor + this.rng() * (this.maxreload - A.reloadFloor));
          if (this.canUseSkill(K.STEALTH)) {
            this.doSkill(K.STEALTH);
            return;
          }
          this.moveTo(this.rng() * w.stageWidth, w.groundY);
        } else {
          if (asInt(this.rng() * A.launchDice) === ZERO && this.canLaunch && !this.isAirborne()) this.launchTarget();
          else this.slashTarget();
          this.doReload = ZERO;
        }
      }
    }
  }

  /**
   * `EnemyPlayer.as:1208` · web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1267`: does the human's slash cross the body? Each
   * point less the stage position, against the body's own clip's BOUNDING BOX (`hitTestPoint`'s
   * `shapeFlag` defaults to false).
   */
  isUnderSlash(): boolean {
    const offset = asInt(this.world.stagePosition);
    for (const pt of this.world.playerSlashArray) {
      if (this.geometry.clipHitTestPoint(this, pt.x - offset, pt.y, false)) return true;
    }
    return false;
  }

  /**
   * `EnemyPlayer.as:1225` · web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1286`, the same: the first evasive skill that
   * starts (ROLL, JUMP, DASHLEFT, DASHRIGHT, SMOKEBOMB), else a stroke of its own: one of two 60°
   * diagonals from `random * 100 + 80` above, or (2 in 4) flat from 50 above, away from the target.
   * The unused `newangle` and `slashDiag` locals are not carried.
   */
  doEvade(): void {
    if (this.doSkill(K.ROLL)) return;
    if (this.doSkill(K.JUMP)) return;
    if (this.doSkill(K.DASHLEFT)) return;
    if (this.doSkill(K.DASHRIGHT)) return;
    if (this.doSkill(K.SMOKEBOMB)) return;
    const E = OG_EVADE;
    const startX = asInt(this.getMapPosition());
    let startY: number;
    let changeX: number;
    let changeY: number;
    const pick = asInt(this.rng() * E.dice);
    if (pick === ZERO || pick === ONE) {
      startY = asInt(this.y - this.rng() * E.riseDice - E.rise);
      changeY = asInt(-E.step * Math.sin(E.angle));
      changeX = asInt((pick === ZERO ? E.step : -E.step) * Math.cos(E.angle));
    } else {
      // `case 2: case 3:`, the only other faces of the die.
      startY = asInt(this.y - E.flatRise);
      changeX = this.x > this.aim().x ? E.step : -E.step;
      changeY = ZERO;
    }
    this.makeSlash(startX, startY, changeX, changeY);
  }

  /** `EnemyPlayer.as:1366` · web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1445`, the same. A null list is a TypeError (#1009), as there. */
  hasSkill(skillid: number): boolean {
    if (this.skillList === null) throw new TypeError('hasSkill: a null skillList');
    return this.skillList.some((sk) => sk.id === skillid);
  }

  /**
   * WEB `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1460` (Android `EnemyPlayer.as:1379`): owned and cooled down, and
   * (web only) not a skill that costs chi at its level while the body has none. The AI never pays
   * chi (`startSkill` charges the human only), so only the human's effects empty it.
   */
  canUseSkill(skillid: number): boolean {
    if (!(this.hasSkill(skillid) && this.cooldownArray.get(skillid) === ZERO)) return false;
    const data = skillData(skillid);
    if (data === null) throw new TypeError(`canUseSkill: no skill data for ${skillid}`);
    return !(getChiCost(data, this.getSkillLevel(skillid)) > ZERO && this.getChi() === ZERO);
  }

  /**
   * `EnemyPlayer.as:1384` · web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1475`, the same: the usable skills of the list for
   * the range. SOURCE QUIRK (OPP-D item 1): the source first tests `distsq < 40000` and stores the
   * very-close list, then an `if` (not an `else if`) below always overwrites it, so that store is
   * dead and the list is never returned. The dead store is not written here (the lint gate's
   * `no-useless-assignment` refuses it); what it leaves behind is pinned by test and plant.
   */
  getUsableSkills(dist: number): number[] {
    const R = OG_AI_RANGE_SQ;
    const L = OG_AI_SKILL_LISTS;
    const distsq = asInt(dist * dist);
    let list: readonly number[];
    if (distsq < R.close) list = L.close;
    else if (distsq < R.mid) list = L.mid;
    else list = L.long;
    return list.filter((id) => this.canUseSkill(id));
  }

  /**
   * `EnemyPlayer.as:1416` · web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1509`, the same: a usable skill at its level
   * through `startSkill`; a start takes its full cooldown, scaled by the human's speed NOW. The
   * source's `skillDataCache` only saves a lookup, so it is not carried.
   */
  doSkill(skillid: number, xpos: number = OG_AI.noPos, ypos: number = OG_AI.noPos): boolean {
    if (!this.canUseSkill(skillid)) return false;
    const data = skillData(skillid);
    if (data === null) throw new TypeError(`doSkill: no skill data for ${skillid}`);
    const skilllevel = this.getSkillLevel(skillid);
    if (!this.startSkill(skillid, skilllevel, xpos, ypos)) return false;
    this.cooldownArray.set(skillid, getCooldown(data, skilllevel, this.cooldownScale()));
    return true;
  }

  /** `XMLSkill.getCooldown`'s `StatsManager.getSkillCooldownModifier()`: the HUMAN's speed (OPP-D item 7). */
  private cooldownScale(): number {
    return skillCooldownModifier(this.world.playerSpeed, this.world.playerSpeedBuff);
  }

  /**
   * `SkillManager.startSkill` with `owner` this body (Android `SkillManager.as:123-161` and
   * `:705-707`; web `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:131-173` and `:740-742`). The preamble: not at peace or dead;
   * a busy body refused but for the smoke-away and a charging body's four charged skills; the
   * smoke-away only when the body can; a charged shot not dropped at (0, 0) needs a second of
   * charge. Then the stealth ends and the `switch` runs: EVERY arm is unported (7b–7f port them,
   * R8 sends the unreached to `unreachable`), an id with no arm falls out, true. NOT carried: the
   * web's `controlledBy == 0` mode refusal and `useChi` (the human's), the tail's
   * `BattleUI.checkSkillDisabled` (the human's HUD), and the clones' refusal in two game modes,
   * which goes with their arms in 7f (its second mode is undecoded: DIVERGENCES "SLICE 7 — THE MAP").
   */
  startSkill(skillid: number, skilllevel: number, xpos: number, ypos: number): boolean {
    if (this.world.peaceful || this.dead) return false;
    const smokeAway = skillid === K.SMOKEBOMB && skilllevel > OG_AI.smokeAwayLevelAbove;
    if (!smokeAway && !this.canChangeStance() && !(this.isCharging() && CHARGED_SKILLS.includes(skillid))) return false;
    if (smokeAway && !this.canSmokeAway()) return false;
    if (skillid === K.CHARGEDSHOT && !(xpos === ZERO && ypos === ZERO) && this.getChargingTime() === ZERO) return false;
    this.cancelStealth();
    const S = OG_STATE;
    switch (skillid) {
      case K.JUMP:
        this.startAction(S.JUMP);
        break;
      case K.ROLL:
        this.startAction(S.FORWARDROLL);
        break;
      case K.DASHRIGHT: {
        let dashstate: OgState = S.DASH;
        let x = xpos;
        if (x === OG_AI.noPos) x = this.getMapPosition() + ONE;
        else x += this.world.stagePosition;
        if ((x < this.getMapPosition() && this.isFacingRight()) || (x > this.getMapPosition() && !this.isFacingRight())) {
          dashstate = S.BACKSTEP;
        }
        this.startAction(dashstate);
        break;
      }
      case K.DASHLEFT: {
        let dashstate: OgState = S.DASH;
        let x = xpos;
        if (x === OG_AI.noPos) x = this.getMapPosition() - ONE;
        else x += this.world.stagePosition;
        if ((x < this.getMapPosition() && this.isFacingRight()) || (x > this.getMapPosition() && !this.isFacingRight())) {
          dashstate = S.BACKSTEP;
        }
        this.startAction(dashstate);
        break;
      }
      case K.SMOKEBOMB:
        if (skilllevel === ONE) this.startAction(S.SMOKEBOMB);
        else this.startAction(S.SMOKEBOMB2);
        break;
      case K.FLASHBANG:
        this.startAction(S.SKILL_FLASHBANG);
        break;
      default: {
        const arm = skillArm(skillid);
        if (arm !== undefined) unported('SkillManager.startSkill', arm);
      }
    }
    return true;
  }

  /** `MCSPlayer.as:4344` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4713`, the same: the charge in whole seconds, at most 10. */
  getChargingTime(): number {
    const num = asInt(this.chargingTime / OG_FPS);
    return num > OG_CHARGING.cap ? OG_CHARGING.cap : num;
  }

  /** `MCSPlayer.as:4354` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4723`, the same. */
  cancelChargingTime(): void {
    this.chargingTime = ZERO;
  }

  /** `MCSPlayer.as:2970` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3053`, the same (GOTLAUNCHED is named twice there). */
  canSmokeAway(): boolean {
    const s = this.actionState;
    return this.canChangeStance() || this.isDowned() || s === OG_STATE.GOTLAUNCHED || s === OG_STATE.FALL || s === OG_STATE.JUMP;
  }

  /** `MCSPlayer.as:4369` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4738`: the log substitution's end, slice 7 (ERRATUM 15). */
  cancelLogSub(): void {
    unported('MCSPlayer.cancelLogSub');
  }

  /** `MCSPlayer.as:4184` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4561`: the log substitution itself, slice 7 (ERRATUM 15). */
  doSubstitutionLog(): void {
    unported('MCSPlayer.doSubstitutionLog');
  }

  /** `MCSPlayer.as:2965` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3043`, the same. */
  canChangeStance(): boolean {
    const S = OG_STATE;
    const s = this.actionState;
    const p = this.prevActionState;
    return (
      s === S.IDLE || s === S.POSE || s === S.RUN || s === S.WALK || s === S.SKILL_CHICHARGE ||
      (s === S.FLINCH && (p === S.IDLE || p === S.POSE || p === S.RUN || p === S.WALK))
    );
  }

  /**
   * WEB `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2439` (Android `MCSPlayer.as:2363`). The web guard also returns for a
   * body that cannot change stance, and the web `destY` is the ground (Android: `mcs.y`).
   * The `informNetwork` argument only reaches `controlledBy == 0`, so it is not carried.
   */
  stopMoving(): void {
    if (this.actionState === OG_STATE.IDLE || !this.canChangeStance()) return;
    this.destX = this.posX;
    this.destY = this.world.groundY;
    this.hasSlash = false;
    this.hasSlashBuffer = false;
    this.startAction(OG_STATE.IDLE);
    unported('StageManager.clearInteractTarget');
  }

  /** WEB `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3083` (Android `MCSPlayer.as:3019`). */
  setStance(num: number): void {
    const battle = this.world.battle;
    this.stance = num;
    if (battle) this.stopMoving();
    this.slashCommitted = false;
    const r = OG_STANCE_REACH;
    const base = this.baseSlashLength;
    switch (this.stance) {
      case OG_STANCE.light:
        this.slashLength = asInt(base * r.lightMult);
        break;
      case OG_STANCE.balanced:
        this.slashLength = asInt(base * (r.balanced.base + r.balanced.perMastery * this.balancedMastery * r.balanced.scale));
        break;
      case OG_STANCE.heavy:
        this.slashLength = asInt(base * (r.heavy.base + r.heavy.perMastery * this.heavyMastery * r.heavy.scale));
        if (this.slashLength < r.floor) this.slashLength = r.floor;
        break;
      case OG_STANCE.reversed:
        this.slashLength = asInt(base * r.reversedMult);
        break;
      case OG_STANCE.dual:
        this.slashLength = base;
        if (this.slashLength < r.floor) this.slashLength = r.floor;
        break;
    }
    const idle = STANCE_IDLE[this.stance];
    if (battle && idle !== undefined) this.startAnim(idle);
    if (battle) {
      this.reload -= OG_STANCE_CHANGE_RELOAD.cost;
      if (this.reload < OG_STANCE_CHANGE_RELOAD.floor) this.reload = OG_STANCE_CHANGE_RELOAD.floor;
    }
    this.initSpecialSkills();
  }

  /** `MCSPlayer.as:3122` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3179` */
  getStance(): number {
    return this.stance;
  }

  /** `MCSPlayer.as:3127` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3184`: the AI's branch (from `MCSPlayer.as:3164` / web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3221`). */
  initSpecialSkills(): void {
    const m = OG_SPECIAL_SKILL_MASTERY;
    if (this.stance === OG_STANCE.light) {
      this.canLaunch = this.lightMastery >= m.light.launch;
      this.canDeflect = this.lightMastery >= m.light.deflect;
      this.canAirCombo = this.lightMastery >= m.light.airCombo;
      this.canFlipUp = false;
      this.canStab = false;
    } else if (this.stance === OG_STANCE.balanced) {
      this.canFlipUp = this.balancedMastery >= m.balanced.flipUp;
      this.canDeflect = this.balancedMastery >= m.balanced.deflect;
      this.canLaunch = this.balancedMastery >= m.balanced.launch;
      this.canStab = false;
      this.canAirCombo = false;
    } else if (this.stance === OG_STANCE.heavy) {
      this.canLaunch = this.heavyMastery >= m.heavy.launch;
      this.canDeflect = this.heavyMastery >= m.heavy.deflect;
      this.canStab = this.heavyMastery >= m.heavy.stab;
      this.canFlipUp = false;
      this.canAirCombo = false;
    } else if (this.stance === OG_STANCE.reversed || this.stance === OG_STANCE.dual) {
      this.canStab = true;
      this.canDeflect = true;
      this.canLaunch = true;
      this.canFlipUp = true;
      this.canAirCombo = true;
    }
  }

  /** WEB `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255` (Android `MCSPlayer.as:3198`); `rng` stands in for `Math.random()`. */
  getDamage(): number {
    // `EnemyPlayer`'s override, first (`EnemyPlayer.as:1199`, web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1249`): a
    // boss fights at `minDamage`. The duellist is none, so `super`'s formula below runs.
    if (this.isBoss) return this.minDamage;
    const d = OG_STANCE_DAMAGE;
    let maxDamage = ZERO;
    // Inlined as the source does.
    const baseDamage = asInt(this.minDamage + this.rng() * this.damageRange);
    switch (this.stance) {
      case OG_STANCE.light:
        maxDamage = asInt(baseDamage * (d.light.base + d.light.perMastery * this.lightMastery * d.light.scale));
        break;
      case OG_STANCE.balanced:
        maxDamage = asInt(baseDamage * (d.balanced.base + d.balanced.perMastery * this.balancedMastery * d.balanced.scale));
        break;
      case OG_STANCE.heavy:
      case OG_STANCE.dual:
      case OG_STANCE.reversed:
        maxDamage = asInt(baseDamage * d.otherMult);
        break;
    }
    if (this.reload === this.maxreload) return asInt(maxDamage * d.critMult + this.STAT_CRITICALDMG);
    return maxDamage;
  }

  /**
   * `MCSPlayer.as:3226` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3279`, the same, behind the WEB `EnemyPlayer`
   * override (`reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1258`; Android has none): a boss's is `minDamage`.
   */
  getBaseDamage(): number {
    if (this.isBoss) return this.minDamage;
    return asInt(this.minDamage + this.rng() * this.damageRange);
  }

  /** `MCSPlayer.as:2237` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2311`, the same. The opponent passes no offset. */
  lineArrayDeepCopy(lineArray: readonly MovePoint[], offset = ZERO): MovePoint[] {
    return lineArray.map((pt) => ({ x: pt.x + offset, y: pt.y }));
  }

  /**
   * `EnemyPlayer.gotInput` (`EnemyPlayer.as:958`, web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1008`), the
   * same in both builds and with no `super`: `MCSPlayer`'s own is the human's (`InputManager.as:280`),
   * out of the lane. A stroke while the body is busy is buffered; otherwise it slashes, and a move
   * moves. The source's `mcs == null` clause never holds here (the actor is its own clip), and the
   * unused `posX` parameter is not carried. The move branch also tests GOTLAUNCHED, DOWNED, JUMP
   * and FORWARDROLL (`EnemyPlayer.as:983`); all four already went to the buffer (DOWNED through
   * `isDowned()`), so only FALL (in light stance) is live there. TypeScript refuses three of them;
   * the DOWNED one it accepts, and it is dropped as dead with them.
   */
  gotInput(lineArray: readonly MovePoint[], isLine: boolean): void {
    if (this.getHP() <= ZERO || this.dead) return;
    let line = isLine;
    if (this.world.peaceful) line = false;
    const S = OG_STATE;
    const s = this.actionState;
    if (
      this.slashCommitted || (s === S.FALL && this.stance !== OG_STANCE.light) || s === S.GOTLAUNCHED ||
      this.isDowned() || s === S.JUMP || s === S.FORWARDROLL
    ) {
      if (line) {
        this.slashArrayBuffer = this.lineArrayDeepCopy(lineArray);
        this.hasSlashBuffer = true;
      }
    } else {
      // The source's `else if(!slashCommitted)`: always true here, the first test took it.
      if (line) {
        this.slashArray = this.lineArrayDeepCopy(lineArray);
        this.initSlash(firstPoint(this.slashArray));
      } else if (s !== S.FALL) {
        this.initMove(firstPoint(lineArray));
      }
    }
  }

  /**
   * The WEB `NPC.isAirborne` (`reference/decompiled/shs3_payload/scripts/§1t68s0§.as:793`): FALL counts, on the ground
   * too. Android's (`NPC.as:772`) is height only, as the ported `Npc` is. Neither build's
   * `MCSPlayer` overrides it; the override is here so R6 reaches the duellist without touching
   * the mobs, which wait for the owner's ruling (DIVERGENCES "L5-OPP SLICE 4b").
   */
  override isAirborne(): boolean {
    return this.actionState === OG_STATE.FALL || super.isAirborne();
  }

  /** `MCSPlayer.as:4359` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4728`, the same. */
  cancelStealth(): void {
    if (!this.visible || this.alpha < ONE) {
      this.emit({ type: 'smoke', x: asInt(this.getMapPosition()), y: asInt(this.y) });
    }
    this.visible = true;
    this.alpha = ONE;
  }

  /**
   * WEB `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2475` (Android `MCSPlayer.as:2403`): read the stroke's type
   * from its ends, then slash where it stands or run to it. The one difference: the web puts a
   * downstab on the body's side by `posX`, Android by `mcs.x` (the SCREEN x).
   */
  initSlash(firstPt: MovePoint): void {
    const k = OG_SLASH;
    const S = OG_STATE;
    this.cancelStealth();
    this.destX = this.clampToStage(asInt(firstPt.x));
    this.destY = asInt(firstPt.y);
    this.hasSlash = true;
    this.hasSlashBuffer = false;
    this.slashType = T.hor;
    const lastPt = this.slashArray[this.slashArray.length - ONE];
    if (lastPt === undefined) throw new RangeError('initSlash: an empty slashArray');
    if (this.stance === OG_STANCE.light && this.actionState === S.FALL) {
      this.slashType = this.destY - this.y > k.dropBelow ? T.drop : T.air;
    } else if (this.y - this.destY > k.jumpThreshhold) {
      this.slashType = T.jump;
    } else if (this.canStab && this.destY < lastPt.y && Math.abs(this.destX - lastPt.x) < k.stabSpanX) {
      this.slashType = T.downstab;
    } else if (this.destY - lastPt.y > k.jumpThreshhold && !this.isAirborne()) {
      this.slashType = T.up;
    } else {
      const diff = asInt(this.destY - lastPt.y);
      if (diff > k.tilt) this.slashType = T.horUp;
      else if (diff < -k.tilt) this.slashType = T.horDown;
    }
    if (this.slashType === T.downstab) {
      this.destX = this.clampToStage(this.posX < this.destX ? this.destX - k.downstabShort : this.destX + k.downstabShort);
    }
    if (this.actionState !== S.GOTLAUNCHED && Math.abs(this.destX - this.posX) < k.standingRange) {
      const index = Math.max(ZERO, Math.min(k.lengthThreshhold - ONE, this.slashArray.length - ONE));
      const aim = this.slashArray[index];
      if (aim !== undefined && this.posX < aim.x) this.faceRight();
      else this.faceLeft();
      this.startAction(S.SLASH);
    } else if (this.actionState !== S.FALL) {
      this.startAction(S.RUN);
    }
  }

  /** `destX`'s clamp to the stage, written three times in the source. */
  private clampToStage(x: number): number {
    if (x < ZERO) return ZERO;
    if (x > this.world.stageWidth) return this.world.stageWidth;
    return x;
  }

  /** `MCSPlayer.as:2503` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2575`, the same. The buffer BECOMES `slashArray`, uncopied. */
  checkNextSlash(): void {
    if (this.hasSlash) {
      this.initSlash(firstPoint(this.slashArray));
    } else if (this.hasSlashBuffer) {
      this.slashArray = this.slashArrayBuffer;
      this.initSlash(firstPoint(this.slashArray));
    }
  }

  /**
   * `MCSPlayer.as:2516` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2588`, the same: commit, pick the
   * clip, aim at the stroke's end and set the velocity that reaches it at the stance's speed.
   * A downstab keeps its facing and takes no speed, so `dist / 0` sends its velocity to 0. The
   * `controlledBy == 0` `InputManager.clearCanvas` is the human's.
   */
  startSlash(): void {
    const k = OG_SLASH;
    let slashSpeed = ZERO;
    this.slashCommitted = true;
    const first = firstPoint(this.slashArray);
    const last = this.slashArray[this.slashArray.length - ONE] ?? first;
    if (this.slashType === T.downstab) {
      this.y = this.world.groundY;
      this.startAnim(OG_ANIM.DOWNSTAB);
    } else {
      if (first.x < last.x) this.faceRight();
      else this.faceLeft();
      const clip = SLASH_CLIP[this.stance]?.[this.slashType];
      if (clip !== undefined) this.startAnim(clip);
      slashSpeed = SLASH_SPEED[this.stance] ?? ZERO;
    }
    this.destX = this.clampToStage(asInt(last.x));
    this.destY = last.y > this.world.groundY - k.jumpThreshhold ? this.world.groundY : asInt(last.y);
    const xdiff = asInt(this.destX - this.posX);
    const ydiff = asInt(this.destY - first.y);
    const dist = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
    const time = dist / slashSpeed;
    this.velX = asInt(xdiff / time);
    this.velY = asInt(ydiff / time);
    this.slashDamage = this.getDamage();
    if (this.doShunpo) {
      this.setPosition(this.destX, this.destY);
      this.slashDamage *= k.shunpoDamageMult;
      this.endSlash();
    }
  }

  /**
   * `MCSPlayer.as:2708` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2780`, the same: one frame of the slash.
   * On its stance's travelling clips the body runs at the stance's speed and ends the slash on
   * arrival; a slash that is not flat also drops by `velY` while above the ground. The frame goes
   * on after `endSlash`, as the source's does.
   */
  doSlash(): void {
    if (!SLASH_TRAVEL[this.stance]?.includes(this.animation)) return;
    if (!this.movement(SLASH_SPEED[this.stance] ?? ZERO)) this.endSlash();
    if (!FLAT_SLASH.includes(this.slashType) && this.y < this.world.groundY) this.y += this.velY;
  }

  /**
   * WEB `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2839` (Android `MCSPlayer.as:2767`): pay the reload, hand the
   * stroke to the hit, land or fall, face the way the stroke ran and take the buffered one. The
   * web adds the packet's attacker, and a closing block (`:2933`) that ends a timer only the
   * human and the network player ever start: ruled out (DIVERGENCES "L5-OPP SLICE 4c"). The
   * `controlledBy == 0` draw, sound and canvas are the human's.
   */
  endSlash(): void {
    const k = OG_SLASH_END;
    const w = this.world;
    const offset = w.stagePosition;
    if ((w.playerCanSeeSlash || (w.playback && w.playbackShowSlash)) && !w.redFreeze) {
      this.emit({ type: 'enemyLine', points: this.slashArray, offset, slashLength: this.slashLength });
    }
    this.deductReloadBar();
    this.hasSlash = false;
    let launchType: number = OG_LAUNCH.LAUNCH_NONE;
    if (this.slashType === T.up && this.canLaunch) launchType = OG_LAUNCH.LAUNCH_AIR;
    const end = this.slashArray[this.slashArray.length - ONE];
    if (end === undefined) throw new RangeError('endSlash: an empty slashArray');
    const damage = new NpcDamage(this.slashDamage, this.level, launchType, this.stance);
    damage.setPiercingDamage(this.STAT_PIERCINGDMG);
    damage.setAttacker(this);
    if (w.groundY - end.y > OG_SLASH.jumpThreshhold) {
      this.y = end.y + k.airDrop;
      this.velY = ZERO;
      this.startAction(OG_STATE.FALL);
      this.checkPlayerHit(this.slashArray, offset, damage);
    } else {
      this.y = w.groundY;
      this.velY = ZERO;
      this.checkPlayerHit(this.slashArray, offset, damage);
      this.startAction(OG_STATE.POSE);
    }
    // Re-read after the hit, as the source does (`slashArrayLength`, `MCSPlayer.as:2817`).
    const len = this.slashArray.length;
    const last = this.slashArray[len - ONE];
    const from = this.slashArray[Math.max(ZERO, len - OG_SLASH.lengthThreshhold + ONE)];
    if (last === undefined || from === undefined) throw new RangeError('endSlash: an empty slashArray');
    if (last.x > from.x) {
      this.velX = k.driftX;
      this.faceRight();
    } else {
      this.velX = -k.driftX;
      this.faceLeft();
    }
    if (this.hasSlashBuffer) {
      this.slashArray = this.slashArrayBuffer;
      this.hasSlash = true;
    }
    this.hasSlashBuffer = false;
    this.slashCommitted = false;
    if (this.doShunpo) this.doShunpo = false;
  }

  /** `NPCManager.checkPlayerHit(slashArray, offset, damage)`: the stroke against the player, the seam's (slice 8). */
  checkPlayerHit(slashArray: readonly MovePoint[], offset: number, damage: NpcDamage): void {
    void slashArray;
    void offset;
    void damage;
    unported('NPCManager.checkPlayerHit');
  }

  /** `MCSPlayer.as:2862` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2940`, the same. */
  endDownStab(): void {
    this.hasSlash = false;
    this.startAction(OG_STATE.POSE);
    if (this.hasSlashBuffer) {
      this.slashArray = this.slashArrayBuffer;
      this.hasSlash = true;
    }
    this.hasSlashBuffer = false;
    this.slashCommitted = false;
  }

  /** `MCSPlayer.as:3240` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3293`, the same. A full bar empties first. */
  deductReloadBar(): void {
    const k = OG_SLASH_END;
    if (this.reload === this.maxreload) this.reload = ZERO;
    switch (this.stance) {
      case OG_STANCE.light:
        this.reload = asInt(this.reload - this.slashUsage / k.lightUsageDiv);
        break;
      case OG_STANCE.balanced:
      case OG_STANCE.reversed:
        this.reload -= this.slashUsage;
        break;
      case OG_STANCE.heavy:
      case OG_STANCE.dual:
        this.reload = asInt(this.reload - this.slashUsage * k.heavyUsageMult);
    }
    if (this.reload < ZERO) this.reload = ZERO;
  }

  /**
   * WEB `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2394` (Android `MCSPlayer.as:2318`). The web
   * measures `int(posX - dest.x)` and only then sets `destX`; Android sets `destX` first, so a
   * move refused in adventure mode still moves it, and measures from the truncated `destX`.
   */
  initMove(dest: MovePoint): void {
    const s = this.actionState;
    const dist = asInt(this.posX - dest.x);
    if (
      this.world.adventureMode &&
      (dist * dist < OG_MOVE_DIST_SQ.adventureMin || s === OG_STATE.JUMP || s === OG_STATE.FALL ||
        this.isDowned() || this.isAirborne() || s === OG_STATE.GOTLAUNCHED)
    ) return;
    this.destX = asInt(dest.x);
    if (this.destX < ZERO) this.destX = ZERO;
    else if (this.destX > this.world.stageWidth) this.destX = this.world.stageWidth;
    this.destY = asInt(dest.y);
    this.hasSlash = false;
    this.hasSlashBuffer = false;
    this.startAction(dist * dist <= OG_MOVE_DIST_SQ.walkMax ? OG_STATE.WALK : OG_STATE.RUN);
  }

  /** `MCSPlayer.as:2890` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2968`, the same. False once it arrives. */
  movement(speed: number): boolean {
    if (this.posX - this.destX < -speed) {
      this.faceRight();
      this.velX = speed;
    } else {
      if (this.posX - this.destX <= speed) {
        this.movePlayer(this.destX - this.posX);
        return false;
      }
      this.faceLeft();
      this.velX = -speed;
    }
    this.movePlayer(this.velX);
    return true;
  }

  /**
   * `MCSPlayer.as:2921` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2999`, the same: clamp to the stage,
   * then the `controlledBy != 0` branch. The rest (the stage scroll, the minimap) is the human's.
   */
  movePlayer(dist: number): void {
    let d = dist;
    if (this.posX + d < ZERO) d -= this.posX + d;
    else if (this.posX + d > this.world.stageWidth) d -= this.posX + d - this.world.stageWidth;
    this.movePositionX(d);
  }

  /** `MCSPlayer.as:4565` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4934`, the same. The parameters are `int`s. */
  moveTo(posX: number, posY: number): void {
    this.inputArray.length = ZERO;
    this.inputArray.push({ x: asInt(posX), y: asInt(posY) });
    this.gotInput(this.inputArray, false);
  }

  /**
   * The target the stroke makers and `doAction` POSE read. The source reads `target.…` unguarded
   * (only `slashTarget` checks), so a null target is a TypeError there (#1009), and here.
   */
  private aim(): NpcTarget {
    if (this.target === null) throw new TypeError('read a null target');
    return this.target;
  }

  /**
   * `EnemyPlayer.getTargetPosition` (`EnemyPlayer.as:1194`, web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1244`):
   * the target's MAP position. `MCSPlayer`'s own (`MCSPlayer.as:4572`) subtracts the stage
   * position; the opponent never reaches it.
   */
  getTargetPosition(): number {
    return asInt(this.aim().getMapPosition());
  }

  /** `MCSPlayer.as:4577` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4946`, the same: straight up from the target's feet. */
  launchTarget(): void {
    const k = OG_STROKE.launch;
    this.makeSlash(this.getTargetPosition(), asInt(this.aim().y), k.changeX, k.changeY);
  }

  /**
   * The two diagonals' angle: to the target, less 10°. NaN when the two stand on one point.
   * `getMapPosition()` is `:int` in the source (`MCSActor.as:1053`), so it truncates here too.
   */
  private diagonalAngle(): number {
    const t = this.aim();
    return Math.atan(Math.abs(this.y - t.y) / Math.abs(asInt(this.getMapPosition()) - this.getTargetPosition())) -
      OG_STROKE.diagonal.angleOffset;
  }

  /**
   * `MCSPlayer.as:4590` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4959`, the same. The source's x step is
   * `-20 * Math.sin` too, not `cos`: both steps come out equal. Its unused `slashDiag` local is
   * not carried.
   */
  slashDiagonalLeft(): void {
    const k = OG_STROKE.diagonal;
    const angle = this.diagonalAngle();
    this.makeSlash(
      asInt(this.getMapPosition()), asInt(this.y - k.rise),
      asInt(k.leftChangeX * Math.sin(angle)), asInt(k.changeY * Math.sin(angle)),
    );
  }

  /** `MCSPlayer.as:4606` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4975`, the same. */
  slashDiagonalRight(): void {
    const k = OG_STROKE.diagonal;
    const angle = this.diagonalAngle();
    this.makeSlash(
      asInt(this.getMapPosition()), asInt(this.y - k.rise),
      asInt(k.rightChangeX * Math.cos(angle)), asInt(k.changeY * Math.sin(angle)),
    );
  }

  /** `MCSPlayer.as:4622` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4991`, the same: down, from behind the target. */
  stabTarget(): void {
    const k = OG_STROKE.stab;
    const t = this.aim();
    const startX = t.isFacingRight() ? this.getTargetPosition() - k.behind : this.getTargetPosition() + k.behind;
    const endY = asInt(t.y + k.below);
    this.makeSlash(startX, asInt(endY - this.slashLength / k.lengthDiv), k.changeX, k.changeY);
  }

  /** `MCSPlayer.as:4644` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5013`, the same. */
  slashTarget(): void {
    const t = this.target;
    if (t === null) return;
    const k = OG_STROKE.slash;
    const far = (this.slashLength * k.far.num) / k.far.den;
    const near = this.slashLength / k.nearDiv;
    const startY = asInt(t.y - k.rise);
    if (t.x < this.x) {
      const startX = asInt(this.getTargetPosition() + (t.isFacingRight() ? far : near));
      this.makeSlash(startX, startY, -k.changeX, k.changeY);
    } else {
      const startX = asInt(this.getTargetPosition() - (t.isFacingRight() ? near : far));
      this.makeSlash(startX, startY, k.changeX, k.changeY);
    }
  }

  /** `MCSPlayer.as:4687` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5056`, the same: flat, through the point behind the target. */
  slashDownedTarget(): void {
    const k = OG_STROKE.downed;
    const t = this.aim();
    const targetX = t.isFacingRight() ? this.getTargetPosition() - k.behind : this.getTargetPosition() + k.behind;
    const startY = asInt(t.y - k.rise);
    const half = this.slashLength / k.lengthDiv;
    if (targetX < this.posX) this.makeSlash(asInt(targetX + half), startY, -k.changeX, k.changeY);
    else this.makeSlash(asInt(targetX - half), startY, k.changeX, k.changeY);
  }

  /**
   * `MCSPlayer.as:4719` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5088`, the same: `int(slashLength / 20)`
   * points (the first always), handed to `gotInput` as a stroke. The `controlledBy == 0`
   * `drawLine` is the human's.
   */
  makeSlash(startX: number, startY: number, changeX: number, changeY: number): void {
    this.inputArray.length = ZERO;
    const pointsmax = asInt(this.slashLength / OG_STROKE.pointGap);
    this.inputArray.push({ x: startX, y: startY });
    for (let i = ONE; i < pointsmax; i += ONE) {
      this.inputArray.push({ x: startX + i * changeX, y: startY + i * changeY });
    }
    this.gotInput(this.inputArray, true);
  }

  /**
   * WEB `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3328` (Android `MCSPlayer.as:3275`): `thing` touches the body. The guards, the two
   * evades, then the parts it touches in the source's order: the first that is neither the weapon
   * nor the prop takes the hit. The AI's branch (`controlledBy == 1`) only: the human's (the
   * playback and PvP tests, the HUD, the invincible cheat) and the network's (the P2P hit, the
   * server-side duel, `sendDamage`) are out of the lane. At 0 HP neither build kills the AI here:
   * the attacker's `checkDie` does (slice 8). The web's fourth parameter (only parts 14 / 15 or a
   * point test count) is `NPCManager`'s, default false: slice 8 decides it. `checkByAttacker`
   * only steers the log substitution, which on the AI is `cancelLogSub` either way.
   */
  override checkHitObject(thing: HitShape, damage: NpcDamage, checkByAttacker = false): boolean {
    void checkByAttacker;
    const R = OG_RECEPTION;
    const S = OG_STATE;
    if (this.gotHitCounter > ZERO || this.world.transitioning || this.actionState === S.SKILL_UNDYING) return false;
    if (damage.attacker === this) return false;
    if (this.rollDodges() || this.focusEvades()) return this.evade();
    let physical = damage.damage;
    const fireDamage = Npc.elemental(damage.fireDamage, this.STAT_FIREDEF);
    const waterDamage = Npc.elemental(damage.waterDamage, this.STAT_WATERDEF);
    const windDamage = Npc.elemental(damage.windDamage, this.STAT_WINDDEF);
    const earthDamage = Npc.elemental(damage.earthDamage, this.STAT_EARTHDEF);
    for (const part of this.geometry.partsHitBy(thing)) {
      // `thing is Projectile && canBreak()`: a projectile that cannot break scans on.
      if (this.canDeflect && this.isSlashing() && thing.breakable === true) {
        this.emit({ type: 'breakProjectile' });
        this.emit({ type: 'sound', name: 'deflect' });
        return false;
      }
      if (part === OG_PART.weapon || part === OG_PART.prop) continue;
      if (this.logsubCounter > ZERO) {
        // On the AI every branch of the source's test is `cancelLogSub()`; the web
        // `setSubstitutionLog` (it zeroes the four elements too) and the five damages zeroed
        // follow. The log substitution is slice 7's, whole (ERRATUM 15).
        this.cancelLogSub();
      }
      this.stunCounter = ZERO;
      if (this.chargingFx !== null && !(this.actionState === S.SKILL_CHICHARGE && damage.launchType === OG_LAUNCH.LAUNCH_NONE)) {
        this.emit({ type: 'chargingFx', action: 'remove' });
        this.chargingFx = null;
      }
      physical -= this.getDefense();
      if (physical < damage.getMinDamage()) physical = damage.getMinDamage();
      this.setHP(this.getHP() - (physical + fireDamage + windDamage + waterDamage + earthDamage));
      this.gotHitCounter = OG_NPC_HIT_IFRAMES;
      this.cancelStealth();
      this.setHealthBarFraction(this.getHP() / this.maxhp);
      this.emit({ type: 'sound', name: 'hit' });
      if (this.getHP() <= ZERO) {
        this.setHP(ZERO);
        this.target = null;
        return true;
      }
      damage.setVictimPosX(asInt(this.getMapPosition()));
      const s = this.actionState;
      if (damage.isKneeGroin()) {
        this.gotKneeGroin(damage.flyVelX, damage.flyVelY, damage.attackerlvl);
      } else if (damage.isBackThrow()) {
        this.gotBackThrow(damage.flyVelX, damage.flyVelY);
      } else if (
        (damage.isLaunchAir() || s === S.GOTLAUNCHED || s === S.FALL || s === S.JUMP) &&
        !this.isDowned() && !damage.isSubstitutionLog()
      ) {
        // The juggle cap reads the ATTACKER's stance (`:3581-3583`). The source's
        // `launchType = LAUNCH_AIR` here is a local nothing reads again.
        const cap = damage.stance === OG_STANCE.light ? R.juggleCapLight : R.juggleCap;
        if (this.juggleCount < cap) {
          damage.setLaunchDir(this.isFacingRight());
          this.gotLaunched();
        }
      } else if (damage.isKnockDown()) {
        damage.setLaunchDir(this.isFacingRight());
        this.gotKnockDown();
      } else if (damage.isFly()) {
        this.gotFly(damage.flyVelX, damage.flyVelY);
      } else if (damage.isFlyAway()) {
        // WEB `:3602-3603`: away from `thing.x`, an `int` parameter (`NPC.gotFlyAway` never reads
        // the y), then the web `setFlyAwayPos` hands the packet the body's new velocity, as a FLY.
        if (thing.x === undefined) throw new TypeError('checkHitObject: a fly-away needs the thing\'s x');
        this.gotFlyAway(asInt(thing.x), this.y);
        damage.setFlyAwayPos(this.velX, this.velY);
      } else if (damage.isStun()) {
        this.gotStun(damage.flyVelX, damage.flyVelY);
      } else if (!this.isDowned()) {
        this.doFlinch();
      }
      if (damage.isDeathTouch()) this.gotDeathTouch(damage.flyVelX, damage.flyVelY);
      const T = OG_NPC_FLOATING_TEXT;
      const text = (amount: number, colour: number): void => {
        if (amount > ZERO) this.emit({ type: 'floatingText', x: this.x, y: this.y + T.yOffset, text: String(amount), colour });
      };
      text(physical, T.colour.physical);
      text(fireDamage, T.colour.fire);
      text(windDamage, T.colour.wind);
      text(waterDamage, T.colour.water);
      text(earthDamage, T.colour.earth);
      return true;
    }
    return false;
  }

  /**
   * The forward roll's dodge, written twice in the web (`checkHitObject`
   * `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3361-3376`, `gotHit` `:3686-3701`, the same lines): a
   * FORWARDROLL hit draws one die, whatever the skill's level.
   */
  private rollDodges(): boolean {
    if (this.actionState !== OG_STATE.FORWARDROLL) return false;
    const R = OG_RECEPTION;
    const rolllvl = this.getSkillLevel(R.rollSkill);
    let dodgechance = ZERO;
    if (rolllvl === R.rollLevelLow) dodgechance = R.rollChanceLow;
    else if (rolllvl === R.rollLevelMid) dodgechance = R.rollChanceMid;
    else if (rolllvl >= R.rollLevelTop) dodgechance = R.rollChanceTop;
    return asInt(this.rng() * R.rollDice) < dodgechance;
  }

  /**
   * WEB only, written twice (`checkHitObject` `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3383`, `gotHit` `:3707`): slashing on
   * a full bar with the stance's full-Focus passive (1074 / 1075 / 1076) evades.
   */
  private focusEvades(): boolean {
    const F = OG_RECEPTION.focusEvadeSkill;
    const st = this.stance;
    return (
      this.isSlashing() && this.reload === this.maxreload &&
      ((st === OG_STANCE.light && this.getSkillLevel(F.light) > ZERO) ||
        (st === OG_STANCE.balanced && this.getSkillLevel(F.balanced) > ZERO) ||
        (st === OG_STANCE.heavy && this.getSkillLevel(F.heavy) > ZERO))
    );
  }

  /** `checkHitObject`'s evades' shared end (web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3378-3380`, `:3385-3387`): guard 12 frames, `Snd_jump`, "hit". */
  private evade(): boolean {
    this.gotHitCounter = OG_NPC_HIT_IFRAMES;
    this.emit({ type: 'sound', name: 'jump' });
    return true;
  }

  /** `MCSPlayer.as:3231` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3284`, the same. `:int`, so heavy's product truncates. */
  getDefense(): number {
    if (this.stance === OG_STANCE.heavy) return asInt(this.defense * OG_RECEPTION.heavyDefenseMult);
    return this.defense;
  }

  /** `MCSPlayer.as:2885` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2963`, the same. */
  isSlashing(): boolean {
    return this.actionState === OG_STATE.SLASH;
  }

  /** WEB `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2465` (Android `MCSPlayer.as:2393`): see `USING_SKILL`. */
  isUsingSkill(): boolean {
    return USING_SKILL.includes(this.actionState) || this.isCharging();
  }

  /** `MCSPlayer.as:2398` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2470`, the same. */
  isCharging(): boolean {
    return CHARGING_STATES.includes(this.actionState);
  }

  /**
   * `EnemyPlayer.getSkillLevel` (`EnemyPlayer.as:1348`, web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1426`, the same but a
   * `trace`): the first entry's level; 0 with no entry, or no list at all.
   */
  getSkillLevel(skillid: number): number {
    return this.skillList === null ? ZERO : getMastery(this.skillList, skillid);
  }

  /**
   * `MCSPlayer.as:4309` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4678`, the same. Not while charging chi, flinching or
   * slashing; out of a sheathed or tired clip the body flinches bare, else with the weapon.
   */
  override doFlinch(): void {
    const S = OG_STATE;
    if (this.actionState === S.SKILL_CHICHARGE || this.actionState === S.FLINCH || this.actionState === S.SLASH) return;
    this.prevActionState = this.actionState;
    this.prevAnim = this.animation;
    this.prevFrameCounter = this.frameCounter;
    this.actionState = S.FLINCH;
    this.startAnim(BARE_FLINCH.includes(this.prevAnim) ? OG_ANIM.FLINCH : OG_ANIM.FLINCH_WEAPON);
  }

  /**
   * `MCSPlayer.as:4329` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4698`, the same: back to the state, clip and frame the flinch
   * interrupted; out of a skill or POSE, IDLE instead. Then the AI: `controlledBy == 1 ||
   * autoSlash` is always true on the AI's body.
   */
  override endFlinch(): void {
    this.actionState = this.prevActionState;
    this.startAnim(this.prevAnim);
    this.frameCounter = this.prevFrameCounter;
    if (this.isUsingSkill() || this.actionState === OG_STATE.POSE) this.startAction(OG_STATE.IDLE);
    this.AI();
  }

  /*
   * THE LAUNCH (6b). `gotKnockDown`, `gotBackThrow`, `gotFly`, `gotFlyAway` and `doFly` are
   * `NPC`'s: `MCSPlayer`'s add only the human's UI (the file header).
   */

  /**
   * WEB `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4497` (Android `MCSPlayer.as:4137`): the web counts every launch, first
   * (`:4499`), outside the human's branch and before `NPC`'s guard; Android counts nothing here.
   */
  override gotLaunched(): void {
    this.juggleCount += ONE;
    super.gotLaunched();
  }

  /**
   * `MCSPlayer.as:4197` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4574`, the same on the AI: `NPC`'s guard repeated, so
   * a body `NPC`'s refuses keeps its chi; then the chi less `chiDamage`, floored at 0 (`:4203-4208`).
   */
  override gotKneeGroin(posx: number, posy: number, chiDamage: number): void {
    if (!this.canGotKneeGroin || this.isDowned() || this.actionState === OG_STATE.DYING) return;
    super.gotKneeGroin(posx, posy, chiDamage);
    this.setChi(this.getChi() - chiDamage);
    if (this.getChi() < ZERO) this.setChi(ZERO);
  }

  /** `MCSPlayer.as:168` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:169`, the same, less the × `StatsManager.multiplier` mask (see `chi`). */
  getChi(): number {
    return this.chi;
  }

  /** `MCSPlayer.as:173` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:174`, the same; the `controlledBy == 0` HUD call is the human's. */
  setChi(val: number): void {
    this.chi = val;
  }

  /**
   * `MCSPlayer.as:3887` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3991`, the same: `MCSPlayer`'s OWN arc, not `NPC`'s. It
   * lands on reaching the ground whatever `velY`'s sign, never bounces off the stage's edge, and
   * resets the juggle count on landing (`:3913` / web `:4017`). The AI moves by `movePositionX`,
   * unclamped (`movePlayer` is `controlledBy == 0`'s).
   */
  override doLaunched(): void {
    const k = OG_NPC_LAUNCH;
    this.y += this.velY;
    this.movePositionX(this.velX);
    this.velY += k.gravity;
    if (this.velY < ZERO && this.velY > k.peakBandTop) this.startAnim(OG_ANIM.GOTLAUNCHED_PEAK);
    const groundY = this.world.groundY;
    if (this.y >= groundY) {
      this.y = groundY;
      this.startAction(OG_STATE.DOWNED);
      this.hideHealthBar();
      this.juggleCount = ZERO;
    }
  }

  /*
   * THE BLOW, THE DEATH AND THE REWARD (6c). `deathAnimEnd` is `NPC`'s: `EnemyPlayer`'s
   * (`EnemyPlayer.as:1604`, web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1700`) repeats it line for line but for one
   * guard on disposal, `controlledBy == 2 && isPvPRoomMode()`, never true on the AI.
   */

  /**
   * WEB `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3661` (Android `MCSPlayer.as:3580`): the blow. `checkHitObject`'s guard and both
   * evades, but SILENT, and without its self-hit and transition tests; the stun cleared and the
   * charge FX removed on every call past them. Then, on a live body: a head, hat or neck hit is a
   * beheading and any other part clears it (web, `:3745`); the stance triangle on the ATTACKER's
   * stance, × 1.2 and the web's × 0.9; the defence and the floor; a beheading × 1.3 (web; Android
   * × 1.5). A downed body, or one at the juggle cap, turns an AIR packet into NONE (web,
   * `NpcDamage.cancelLaunch`). `target` null is the whole body (`getMCS()`, `gotDeathTouch`'s).
   * At 0 HP neither build kills the AI here, and the web's `param1 = null` is the parameter: the
   * body keeps its target, where `checkHitObject` clears it. Every `controlledBy` 0 / 2 / 3 line
   * is out of the lane; so is the web's white text colour, which only the human's text reads.
   */
  override gotHit(target: OgPart | null, damageObj: NpcDamage): boolean {
    const S = OG_STATE;
    if (this.gotHitCounter > ZERO || this.actionState === S.SKILL_UNDYING) return false;
    if (this.rollDodges() || this.focusEvades()) {
      this.gotHitCounter = OG_NPC_HIT_IFRAMES;
      return true;
    }
    if (this.logsubCounter > ZERO) {
      // The web `setSubstitutionLog` on the packet follows: slice 7's, whole (ERRATUM 15).
      this.doSubstitutionLog();
    }
    this.stunCounter = ZERO;
    if (this.chargingFx !== null && !(this.actionState === S.SKILL_CHICHARGE && damageObj.launchType === OG_LAUNCH.LAUNCH_NONE)) {
      this.emit({ type: 'chargingFx', action: 'remove' });
      this.chargingFx = null;
    }
    if (this.getHP() <= ZERO) return false;
    this.behead = target === OG_PART.hat || target === OG_PART.head || target === OG_PART.neck;
    this.gotHitFlag = true;
    const B = OG_BLOW;
    const fireDamage = Npc.elemental(damageObj.fireDamage, this.STAT_FIREDEF);
    const waterDamage = Npc.elemental(damageObj.waterDamage, this.STAT_WATERDEF);
    const windDamage = Npc.elemental(damageObj.windDamage, this.STAT_WINDDEF);
    const earthDamage = Npc.elemental(damageObj.earthDamage, this.STAT_EARTHDEF);
    const L = OG_STANCE.light;
    const M = OG_STANCE.balanced;
    const H = OG_STANCE.heavy;
    const me = this.stance;
    const foe = damageObj.stance;
    let damage = damageObj.damage;
    if ((me === L && foe === M) || (me === M && foe === H) || (me === H && foe === L)) {
      damage = asInt(damage * B.stanceAdvantageMult);
    } else if ((me === L && foe === H) || (me === M && foe === L) || (me === H && foe === M)) {
      damage = asInt(damage * B.stanceDisadvantageMult);
    }
    damage -= this.getDefense();
    if (damage < damageObj.getMinDamage()) damage = damageObj.getMinDamage();
    if (this.behead) damage = asInt(damage * B.headMult);
    this.setHP(this.getHP() - (damage + fireDamage + windDamage + waterDamage + earthDamage));
    this.gotHitCounter = OG_NPC_HIT_IFRAMES;
    this.cancelStealth();
    this.setHealthBarFraction(this.getHP() / this.maxhp);
    this.emit({ type: 'sound', name: 'hit' });
    if (this.getHP() <= ZERO) {
      this.setHP(ZERO);
      return true;
    }
    this.behead = false;
    damageObj.setVictimPosX(asInt(this.getMapPosition()));
    if (this.isDowned()) damageObj.cancelLaunch();
    const s = this.actionState;
    if ((damageObj.isLaunchAir() || s === S.GOTLAUNCHED || s === S.FALL || s === S.JUMP) && !this.isDowned() && !damageObj.isSubstitutionLog()) {
      const cap = foe === L ? OG_RECEPTION.juggleCapLight : OG_RECEPTION.juggleCap;
      if (this.juggleCount >= cap) {
        damageObj.cancelLaunch();
      } else {
        damageObj.setLaunchDir(this.isFacingRight());
        this.gotLaunched();
      }
    } else if (damageObj.isKnockDown()) {
      damageObj.setLaunchDir(this.isFacingRight());
      this.gotKnockDown();
    } else if (damageObj.isFly()) {
      this.gotFly(damageObj.flyVelX, damageObj.flyVelY);
    } else if (damageObj.isFlyAway()) {
      // `param1.x`, an `int` parameter: the struck part's x (the whole body's for `getMCS()`).
      this.gotFlyAway(asInt(target === null ? this.x : this.geometry.partX(target)), this.y);
      damageObj.setFlyAwayPos(this.velX, this.velY);
    } else if (damageObj.isStun()) {
      this.gotStun(damageObj.flyVelX, damageObj.flyVelY);
    } else if (!this.isDowned()) {
      this.doFlinch();
    }
    if (damageObj.isDeathTouch()) this.gotDeathTouch(damageObj.flyVelX, damageObj.flyVelY);
    const T = OG_NPC_FLOATING_TEXT;
    const text = (amount: number, colour: number): void => {
      if (amount > ZERO) this.emit({ type: 'floatingText', x: this.x, y: this.y + T.yOffset, text: String(amount), colour });
    };
    text(damage, T.colour.physical);
    text(fireDamage, T.colour.fire);
    text(windDamage, T.colour.wind);
    text(waterDamage, T.colour.water);
    text(earthDamage, T.colour.earth);
    return true;
  }

  /**
   * `MCSPlayer.as:3952` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4057`, the same: the charge FX goes, then `NPC.die`
   * (the `controlledBy == 0` block is the human's). The web `NPC.die` adds one guard, `mcs ==
   * null` → return (`reference/decompiled/shs3_payload/scripts/§1t68s0§.as:928`), which the AI never meets: a disposed body is dead,
   * and every caller on its path skips the dead.
   */
  override die(): void {
    if (this.chargingFx !== null) {
      this.emit({ type: 'chargingFx', action: 'remove' });
      this.chargingFx = null;
    }
    super.die();
  }

  /**
   * `EnemyPlayer.as:1634` · web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1730`, which overrides `MCSPlayer`'s: the guard
   * cleared, a 500 packet at attacker level 0 through `gotHit` on the whole body: a level-0
   * packet's floor is its whole damage (`Damage.getMinDamage`), so the defence cannot reduce it,
   * but the blow still runs `gotHit`'s guard, bar and reaction. Then a fly if the packet carried
   * a velocity, then no chi. The web's `controlledBy == 2 → 0` is the network's.
   */
  gotDeathTouch(flyVelX: number, flyVelY: number): void {
    this.gotHitCounter = ZERO;
    this.gotHit(null, new NpcDamage(OG_BLOW.deathTouchDamage, ZERO, OG_LAUNCH.LAUNCH_NONE));
    if (flyVelX !== ZERO) this.gotFly(flyVelX, flyVelY);
    this.setChi(ZERO);
  }

  /**
   * `EnemyPlayer.as:1281` · web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1342`, the duellist's branch (`isDuelist`): a random
   * item at the body's level, then coins, always at level 10 and under, else 1 in 3, worth
   * `int(random × level)`. The item's own rolls are the loot dialog's (`LootDialog.as:448`:
   * `alwaysGive` false, so 1 in 2), hence its own kind. WEB: a friendly body drops nothing. The
   * network and war-mode branches are out of the lane.
   */
  override createLoot(): void {
    if (this.isFriendly) return;
    const R = OG_DUELLIST_REWARD;
    const level = this.level;
    this.emit({ type: 'loot', kind: 'randomItemChance', amount: ONE, itemId: null, level });
    if (level <= R.coinLevelMax || asInt(this.rng() * R.coinDice) === ZERO) {
      this.emit({ type: 'loot', kind: 'coins', amount: asInt(this.rng() * level), itemId: null, level });
    }
  }

  /**
   * `EnemyPlayer.as:1307` · web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1372`, the same, the duellist's branch: a player
   * under level 10 gets `calcXP` × 3, from 10 up `calcXP` as elite.
   */
  override rewardXP(): void {
    const R = OG_DUELLIST_REWARD;
    const playerLevel = this.world.playerLevel;
    const amount = playerLevel < R.xpLowLevelBelow
      ? Npc.calcXP(playerLevel, this.level, this.xp, false) * R.xpLowLevelMult
      : Npc.calcXP(playerLevel, this.level, this.xp, true);
    this.emit({ type: 'xp', amount });
  }
}
