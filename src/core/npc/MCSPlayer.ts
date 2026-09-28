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
 * `endFlinch` and their helpers; the body's HP, chi and defences), and slice 6b, THE LAUNCH AND
 * THE GETUP (`gotLaunched`, `gotKneeGroin`, `doLaunched` and the switches' reception groups).
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
 * source's no-op. An `Npc` method the source overrides and the port has not reached yet is
 * SHADOWED by one too (6a), so the duellist can never fall into the mobs' reception. An override
 * whose AI path is its `super` call alone (`gotKnockDown`, `gotFly`, `gotFlyAway`, `doFly`, and
 * `gotBackThrow`, whose own guard repeats `NPC`'s) is not carried: the duellist runs `NPC`'s,
 * the same shape in both builds (6b).
 *
 * AS3 stores every one of these into an `int`, so each result is truncated (`asInt`).
 */
import { OG_ANIM, OG_LAUNCH, OG_PART, OG_STATE, type OgPart, type OgState } from '../../config/ogActor';
import { OG_NO_STANCE, OG_STANCE } from '../../config/ogDuellistProfile';
import {
  OG_CLIP_END_LABELS,
  OG_DO_ACTION_LABELS,
  OG_GETUP,
  OG_MOVE_DIST_SQ,
  OG_RECEPTION,
  OG_SLASH,
  OG_SLASH_END,
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
import type { Rng } from '../Sim';
import type { DuellistBody } from './duellistBody';
import { getMastery, type SkillStat } from './duellistProfile';
import { asInt } from './MCSActor';
import { Npc } from './Npc';
import { NpcDamage } from './NpcDamage';
import type { AnimLibrary, HitGeometry, HitShape, NpcTarget, PlayerWorld } from './types';

/** A call into an `MCSPlayer` group not ported yet: throws, naming the AS3 function (and the label a switch was handed). */
export function unported(fn: string, label?: string): never {
  throw new Error(label === undefined ? `unported: ${fn}` : `unported: ${fn} (${label})`);
}

/** `OG_STATE`'s key for a state, for a switch's `unported` message. */
function stateName(s: OgState): string {
  return Object.keys(OG_STATE).find((k) => OG_STATE[k as keyof typeof OG_STATE] === s) ?? String(s);
}

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
  /** `MCSPlayer.as:129` — the skills and their levels; `EnemyPlayer.init` fills it (slice 7), so it is null here. */
  skillList: readonly SkillStat[] | null = null;

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
    // `EnemyPlayer`'s constructor (`EnemyPlayer.as:51-52`) starts FALL, then this. FALL is ported
    // (5b) but its call is not carried: every body would start falling, which is the spawn's
    // question (slice 8; DIVERGENCES "L5-OPP SLICE 5b").
    this.aiCounterMax = OG_STATE_MACHINE.aiCounterMax;
  }

  /**
   * `EnemyPlayer.update` (`EnemyPlayer.as:908`, web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:956`, the same): a body
   * alive and unfrozen whose target is gone or dead re-aims at the nearest enemy, and with none
   * left goes IDLE, BEFORE the frame; then `MCSPlayer.update`. Its closing skill-cooldown tick
   * runs only when `skillList != null`: slice 7 carries both (§3's slice-7 row).
   */
  override update(): void {
    if (!this.dead && !this.animFrozen && (this.target === null || this.target.isDead())) {
      this.target = this.world.nearestEnemy(asInt(this.getMapPosition()), !this.isFriendly);
      if (this.target === null) this.startAction(OG_STATE.IDLE);
    }
    this.playerUpdate();
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
      unported('Projectile.removeProjectile');
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
      case S.SLASH:
        this.doSlash();
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

  /** `EnemyPlayer.AI` (`EnemyPlayer.as:990`, web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1040`), which overrides `MCSPlayer.AI`: slice 7. */
  AI(): void {
    unported('EnemyPlayer.AI');
  }

  /** `MCSPlayer.as:4369` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4738`: the log substitution's end, slice 7 (ERRATUM 15). */
  cancelLogSub(): void {
    unported('MCSPlayer.cancelLogSub');
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
    const d = OG_STANCE_DAMAGE;
    let maxDamage = ZERO;
    // Inlined as the source does. `EnemyPlayer` overrides BOTH getters for a boss (`minDamage`):
    // `getDamage` in both builds (`EnemyPlayer.as:1199`, web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1249`),
    // `getBaseDamage` in the web only (`reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1258`). Slice 7 carries them.
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

  /** `MCSPlayer.as:3226` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3279`, the same. */
  getBaseDamage(): number {
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
    if (this.actionState === S.FORWARDROLL) {
      const rolllvl = this.getSkillLevel(R.rollSkill);
      let dodgechance = ZERO;
      if (rolllvl === R.rollLevelLow) dodgechance = R.rollChanceLow;
      else if (rolllvl === R.rollLevelMid) dodgechance = R.rollChanceMid;
      else if (rolllvl >= R.rollLevelTop) dodgechance = R.rollChanceTop;
      if (asInt(this.rng() * R.rollDice) < dodgechance) return this.evade();
    }
    const F = R.focusEvadeSkill;
    const st = this.stance;
    if (
      this.isSlashing() && this.reload === this.maxreload &&
      ((st === OG_STANCE.light && this.getSkillLevel(F.light) > ZERO) ||
        (st === OG_STANCE.balanced && this.getSkillLevel(F.balanced) > ZERO) ||
        (st === OG_STANCE.heavy && this.getSkillLevel(F.heavy) > ZERO))
    ) {
      return this.evade();
    }
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
        unported('Projectile.removeProjectile');
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

  /** The two evades' shared end (web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3378-3380`, `:3385-3387`): guard 12 frames, `Snd_jump`, "hit". */
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
   * THE SHADOWS (6a): each overrides a reception method the source overrides too, so a hit can
   * never fall into the mobs' `Npc` code. 6c replaces them.
   */

  /** `MCSPlayer.as:3580` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3661`: 6c. */
  override gotHit(target: OgPart, damageObj: NpcDamage): boolean {
    void target;
    void damageObj;
    return unported('MCSPlayer.gotHit');
  }

  /** `MCSPlayer.as:3952` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4057`: 6c. */
  override die(): void {
    unported('MCSPlayer.die');
  }

  /** `EnemyPlayer.as:1634` · web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1730`, which overrides `MCSPlayer`'s: 6c. */
  gotDeathTouch(flyVelX: number, flyVelY: number): void {
    void flyVelX;
    void flyVelY;
    unported('EnemyPlayer.gotDeathTouch');
  }

  /** `EnemyPlayer.as:1604` · web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1700`: 6c. */
  override deathAnimEnd(): void {
    unported('EnemyPlayer.deathAnimEnd');
  }

  /** `EnemyPlayer.as:1281` · web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1342`: 6c. */
  override createLoot(): void {
    unported('EnemyPlayer.createLoot');
  }

  /** `EnemyPlayer.as:1307` · web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1372`: 6c. */
  override rewardXP(): void {
    unported('EnemyPlayer.rewardXP');
  }
}
