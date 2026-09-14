/**
 * OG_CIVILIAN — `EnemyCivilian.as` (355 lines), ai 7 and the room dispatches' fallback,
 * parent of `EnemyCivilianFemale` (ai 33) and `EnemyCivilianOld` (ai 32). Lane L4b,
 * slice 2a. All CONTRACT. The children repeat every line below except the walk speed,
 * which each replaces with a constant (`ogEnemyCivilianFemale.ts`, `ogEnemyCivilianOld.ts`);
 * their twin lines are named per value. The get-up / bar / fall numbers the switch
 * repeats are `ogNpcHumanoid.ts`'s.
 */
export const OG_CIVILIAN = {
  /** `EnemyCivilian.as:34` — every civilian is level 1, whatever the roster row says. */
  level: 1,
  /** `EnemyCivilian.as:35` (twin of `EnemyWolf.as:32`) — `xp = level * 5 + 45`. */
  xp: { perLevel: 5, base: 45 },
  /**
   * `EnemyCivilian.as:135` (`EnemyCivilianFemale.as:28`, `EnemyCivilianOld.as:113`) — two
   * seconds of idle; `EnemyCivilian.as:218` (`EnemyCivilianFemale.as:111`,
   * `EnemyCivilianOld.as:169`) — then one-second re-rolls; `EnemyCivilian.as:219`
   * (`EnemyCivilianFemale.as:112`, `EnemyCivilianOld.as:170`) — `int(random() * 3) == 1`
   * walks, one in three.
   */
  idle: { frames: 48, retryFrames: 24, walkDice: 3, walkOn: 1 },
  /** `EnemyCivilian.as:142` / `:147` / `:245` / `:250` — `random() * 2 + 4`, signed toward `destX`. */
  walk: { range: 2, base: 4 },
  /**
   * `EnemyCivilian.as:152` (`EnemyCivilianFemale.as:45`) — RUN picks one of six clips by d6;
   * `EnemyCivilian.as:177` (`EnemyCivilianFemale.as:70`) — from 2 up it is a real run at 10
   * (`EnemyCivilian.as:181` / `:185`, `EnemyCivilianFemale.as:74` / `:78`); 0 and 1 keep
   * the walk speed under a walk clip.
   */
  run: { dice: 6, fastFrom: 2, speed: 10 },
  /** `EnemyCivilian.as:254` (`EnemyCivilianFemale.as:147`, `EnemyCivilianOld.as:205`) — arrived within 10 px… */
  arriveX: 10,
  /** `EnemyCivilian.as:256` (`EnemyCivilianFemale.as:149`, `EnemyCivilianOld.as:207`) — …then a coin: 0 idles. */
  arriveDice: 2,
  /** `EnemyCivilian.as:312` / `:317` — the player within 300 px IN FRONT is spotted… */
  sightX: 300,
  /** `EnemyCivilian.as:314` / `:319` — …and the civilian bolts at `random() * 3 + 5`, signed. */
  chase: { range: 3, base: 5 },
  /** `EnemyCivilian.as:329-348` — one of five alert lines by d5: `LangManager` ids 410..414. */
  alert: { dice: 5, firstStringId: 410 },
} as const;
