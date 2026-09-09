/**
 * OG_ROOM — `RoomGoblin.as` (306) and `RoomOgre.as` (336), the room variants the
 * `createRoomNPC` dispatch selects for ai 22 / 23 instead of `EnemyGoblin` /
 * `EnemyOgre`. Lane L4b, slice 1. All CONTRACT.
 *
 * They are wanderers with an aggro switch (`doChase`, a constructor flag), not
 * hunters: idle, pick a random x, walk to it, repeat — and if `doChase`, watch
 * for the player within a sight range and charge. The two files are copies of
 * each other except where named below, so the shared numbers are cited to the
 * goblin with the ogre's twin line alongside.
 */
import { OG_FPS } from './timing';

export const OG_ROOM = {
  /** `RoomGoblin.as:113` / `:163` (ogre `:120` / `:181`) — two seconds of idle. */
  idleFrames: 48,
  /** `RoomGoblin.as:120` / `:125` (ogre `:127` / `:132`) — `random() * 2 + 4`, signed toward `destX`. */
  walk: { range: 2, base: 4 },
  /** `RoomGoblin.as:203` (ogre `:221`) — arrived when within 10 px of `destX`. */
  arriveX: 10,
  /** `RoomGoblin.as:205` (ogre `:223`) — on arrival, a coin: 0 idles, 1 walks again. */
  arriveDice: 2,
  /** `RoomGoblin.as:164` (ogre `:182`) — idle timeout: `int(random() * 3) == 1` walks. */
  walkDice: 3,
  walkOn: 1,
  /**
   * `RoomGoblin.as:168` — the goblin's fidget roll is `int(Math.random() * 2 == 1)`:
   * the product is compared to 1 BEFORE the int, so it is true only when `random()`
   * returns exactly 0.5. Ported as it reads (DIVERGENCES, L4b slice 1).
   */
  fidgetDice: 2,
  fidgetOn: 1,
  /** `RoomGoblin.as:225` (ogre `:243`) — a charging room actor swings inside 50 px. */
  attackX: 50,
  /** `RoomGoblin.as` spotPlayer `:285` / `:291` (ogre `:317` / `:322`) — charge speed `random() * 3 + 5`, signed. */
  chase: { range: 3, base: 5 },
  /** `RoomGoblin.as:283` / `:289` — the goblin notices the player within 300 px in front… */
  goblinSightX: 300,
  /** `RoomOgre.as:315` / `:320` — …the ogre within 200. */
  ogreSightX: 200,
  /** `RoomGoblin.as:26` — the goblin's bar sits 80 px up… */
  goblinBarY: -80,
  /** `RoomOgre.as:26` — …the ogre's 200. */
  ogreBarY: -200,
  /** `RoomOgre.as:160` — which nap clip: a coin. */
  napDice: 2,
  /** `RoomOgre.as:168` — `(5 + random() * 10) * 24` frames: five to fifteen seconds asleep. */
  nap: { baseSec: 5, rangeSec: 10, fps: OG_FPS },
} as const;
