/**
 * CHAOS PLANTS — L4b SLICE 3a, THE FOUR WANDERERS.
 *
 * Applied and judged by `npm run chaos` (`scripts/gates/chaos.ts`). Each entry breaks
 * ONE guard that `tests/npcSlice3a.test.ts` claims to cover; the suite must go red.
 *
 * PROVENANCE, because it is not uniform and pretending otherwise would be the exact
 * kind of unchecked claim this harness exists to catch. Session 35 ran EIGHTEEN plants
 * for this slice (`docs/sessions/-SESSION-LOG.md`, 2026-09-12 01:10, "18/18 plants
 * red"). Its throwaway `scratchpad/chaos3a.py` survives, but only in its FIRST-PASS
 * form, holding FIFTEEN — the other three were added mid-session after the adversarial
 * fan-out surfaced two test gaps, and were never written back to the file. So:
 *   · 15 plants here are transcribed byte-for-byte out of that script, by an AST
 *     extractor rather than by hand, and are marked `recovered:`;
 *   · 3 are RE-AUTHORED here from the guards the session log and `docs/DIVERGENCES.md`
 *     record, and are marked `reauthored:`. They carry this session's reasoning, not
 *     session 35's measurement, and the report prints that distinction on every line.
 *
 * ONE RECOVERED PLANT WAS RE-ANCHORED. The stag-constructor plant's anchor no longer
 * existed at HEAD: the committed file gained a four-line comment between
 * `super(...)` and `this.canGotLaunched`, so the plant that ran in session 35 would
 * now match ZERO times. The runner treats that as a LOUD failure rather than a skip,
 * which is how it was found. Re-anchored to the same intent — assign `_doChase`,
 * which the source never does.
 */
import type { ChaosPlant } from '../scripts/gates/chaosPlant.ts';

const SLICE = 'tests/npcSlice3a.test.ts';
const TREE = 'tests/npcTree.test.ts';

export const PLANTS: ChaosPlant[] = [
  {
    name: 'bear: drop the `> 0` floor on the counter tick',
    file: 'src/core/npc/EnemyBear.ts',
    find: '    if (this.idleCounter > ZERO) this.idleCounter -= ONE;',
    replace: '    this.idleCounter -= ONE;',
    tests: [SLICE],
    note: 'recovered:session35/chaos3a.py',
  },
  {
    name: "bear: tick the counter only in IDLE (the deer's shape)",
    file: 'src/core/npc/EnemyBear.ts',
    find: '    if (this.idleCounter > ZERO) this.idleCounter -= ONE;',
    replace: '    if (this.idleCounter > ZERO && this.actionState === OG_STATE.IDLE) this.idleCounter -= ONE;',
    tests: [SLICE],
    note: 'recovered:session35/chaos3a.py',
  },
  {
    name: 'bear: widen the maul band 100 -> 150',
    file: 'src/config/ogEnemyBear.ts',
    find: 'attack: { rangeX: 100, cooldownFrames: 120 },',
    replace: 'attack: { rangeX: 150, cooldownFrames: 120 },',
    tests: [SLICE],
    note: 'recovered:session35/chaos3a.py',
  },
  {
    name: "bear: face with the base's faceTarget() instead of its own comparison",
    file: 'src/core/npc/EnemyBear.ts',
    find: [
      '        if (this.target !== null && this.x < this.target.x) this.faceRight();',
      '        else this.faceLeft();',
    ].join('\n'),
    replace: '        this.faceTarget();',
    tests: [SLICE],
    note: 'recovered:session35/chaos3a.py',
  },
  {
    name: "bear: fence the swing behind !adventureMode (the wolf's rule)",
    file: 'src/core/npc/EnemyBear.ts',
    find: [
      '        if (target !== null) {',
      "          target.checkHitObject({ kind: 'part', part: OG_PART.r_hand, owner: this }, new NpcDamage(this.damage, this.level));",
    ].join('\n'),
    replace: [
      '        if (target !== null && !this.world.adventureMode) {',
      "          target.checkHitObject({ kind: 'part', part: OG_PART.r_hand, owner: this }, new NpcDamage(this.damage, this.level));",
    ].join('\n'),
    tests: [SLICE],
    note: 'recovered:session35/chaos3a.py',
  },
  {
    name: 'deer: give update() a target re-acquire it does not have',
    file: 'src/core/npc/EnemyDeer.ts',
    find: [
      '    if (this.disposed || this.animFrozen) return;',
      '    const finishedAnimation = this.stepAnimation();',
    ].join('\n'),
    replace: [
      '    if (this.disposed || this.animFrozen) return;',
      '    if (this.target === null || this.target.isDead()) {',
      '      this.target = this.world.nearestEnemy(this.getMapPosition(), true);',
      '      if (this.target === null) return;',
      '    }',
      '    const finishedAnimation = this.stepAnimation();',
    ].join('\n'),
    tests: [SLICE],
    note: 'recovered:session35/chaos3a.py',
  },
  {
    name: 'deer: widen the behind-the-back band 50 -> 200',
    file: 'src/config/ogEnemyDeer.ts',
    find: '  behindDist: 50,',
    replace: '  behindDist: 200,',
    tests: [SLICE],
    note: 'recovered:session35/chaos3a.py',
  },
  {
    name: "horse: drop checkPlayer's !doChase early return",
    file: 'src/core/npc/EnemyHorse.ts',
    find: [
      '    if (!this.doChase) return;',
      '',
    ].join('\n'),
    replace: '',
    tests: [SLICE],
    note: 'recovered:session35/chaos3a.py',
  },
  {
    name: 'horse: drop the doChase fence on the idle act-roll',
    file: 'src/core/npc/EnemyHorse.ts',
    find: '          if (!this.world.cutsceneShowing && this.doChase) {',
    replace: '          if (!this.world.cutsceneShowing) {',
    tests: [SLICE],
    note: 'recovered:session35/chaos3a.py',
  },
  {
    name: "stag: 'fix' the constructor so it assigns doChase",
    file: 'src/core/npc/EnemyStag.ts',
    find: [
      '    void _doChase;',
      '    this.canGotLaunched = false;',
    ].join('\n'),
    replace: [
      '    this.doChase = _doChase;',
      '    this.canGotLaunched = false;',
    ].join('\n'),
    tests: [SLICE],
    note: 'recovered:session35/chaos3a.py (re-anchored 2026-09-13 — the committed file gained a comment block after the plant ran)',
  },
  {
    name: 'stag: drop the extra !doChase from the off-stage red-freeze',
    file: 'src/core/npc/EnemyStag.ts',
    find: [
      '            !this.doChase &&',
      '            this.world.adventureMode &&',
    ].join('\n'),
    replace: '            this.world.adventureMode &&',
    tests: [SLICE],
    note: 'recovered:session35/chaos3a.py',
  },
  {
    name: 'stag: step the CHARGE down in the overworld like RUN',
    file: 'src/core/npc/EnemyStag.ts',
    find: '          this.walkSpeed = -OG_STAG.chargeSpeed;',
    replace: '          this.walkSpeed = this.world.adventureMode ? -OG_ANIMAL.runSpeed : -OG_STAG.chargeSpeed;',
    tests: [SLICE],
    note: 'recovered:session35/chaos3a.py',
  },
  {
    name: "stag: let setLevel keep the ANIMAL xp curve instead of the base's",
    file: 'src/core/npc/EnemyStag.ts',
    find: '    this.xp = lvl * OG_NPC_XP.perLevel + OG_NPC_XP.base;',
    replace: '    this.xp = lvl * OG_ANIMAL.xp.perLevel + OG_ANIMAL.xp.base;',
    tests: [SLICE],
    note: 'recovered:session35/chaos3a.py',
  },
  {
    name: "config: drift the shared animal xp away from the wolf's",
    file: 'src/config/ogNpcAnimal.ts',
    find: '  xp: { perLevel: 5, base: 45 },',
    replace: '  xp: { perLevel: 5, base: 40 },',
    tests: [SLICE],
    note: 'recovered:session35/chaos3a.py',
  },
  {
    name: 'tree gate: give the deer an override the AS3 does not have',
    file: 'src/core/npc/EnemyDeer.ts',
    find: '  override init(xml: OgNpc): void {',
    replace: [
      '  override setLevel(lvl: number): void {',
      '    super.setLevel(lvl);',
      '  }',
      '',
      '  override init(xml: OgNpc): void {',
    ].join('\n'),
    tests: [TREE],
    note: 'recovered:session35/chaos3a.py',
  },
  {
    name: "deer: make the constructor ACT — startAction(IDLE), the wolf's shape",
    file: 'src/core/npc/EnemyDeer.ts',
    find: [
      '    super(world, anims, geometry, rng, target);',
      '    this.canGotLaunched = false;',
    ].join('\n'),
    replace: [
      '    super(world, anims, geometry, rng, target);',
      '    this.startAction(OG_STATE.IDLE);',
      '    this.canGotLaunched = false;',
    ].join('\n'),
    tests: [SLICE],
    note: 'reauthored:2026-09-13 — session 35 added this plant after its adversarial pass surfaced the gap ("nothing pinned that these constructors do NOT act"); its text was never written back to chaos3a.py',
  },
  {
    name: "horse: load the roster's elemental columns in init(), like NPC.init",
    file: 'src/core/npc/EnemyHorse.ts',
    find: [
      '    this.reset();',
      '    this.startAction(OG_STATE.IDLE);',
      '    this.reward = xml.loot ?? [];',
    ].join('\n'),
    replace: [
      '    this.reset();',
      '    this.startAction(OG_STATE.IDLE);',
      '    this.reward = xml.loot ?? [];',
      '    const fire = xml.fire ?? ZERO;',
      '    const earth = xml.earth ?? ZERO;',
      '    this.STAT_FIREATK = fire;',
      '    this.STAT_EARTHDEF = fire;',
      '    this.STAT_EARTHATK = earth;',
      '    this.STAT_WINDDEF = earth;',
      '    this.STAT_WINDATK = ZERO;',
      '    this.STAT_WATERATK = ZERO;',
      '    this.STAT_FIREDEF = ZERO;',
      '    this.STAT_WATERDEF = ZERO;',
    ].join('\n'),
    tests: [SLICE],
    note: "reauthored:2026-09-13 — session 35 added this plant after its adversarial pass surfaced the gap (\"nothing pinned that no animal loads the roster's elemental columns\"); its text was never written back to chaos3a.py",
  },
  /**
   * THE THIRD RE-AUTHORED PLANT, and the one that rests on the least authority.
   *
   * Session 35 ran EIGHTEEN plants for slice 3a and its log names the guard of only
   * seventeen, so this one stands in for the eighteenth rather than reproducing it.
   *
   * ⚠️ IT BREAKS ONE OF TWO BRANCHES, and the name says so. The anchor is the
   * LEFT-facing flee (`EnemyHorse.ts:213-218`); the mirror branch at `:219-224` still
   * enters POSE with `HORSE_REARING`, so `update()`'s `case OG_ANIM.HORSE_REARING`
   * (`:89`) stays reachable and a right-facing horse still telegraphs. That is
   * deliberate, not a shortfall: a single-branch plant proves the test covers THAT
   * branch, and "the test drove only one of the two direction branches" is exactly how
   * slice 3a's stag charge plant was caught STAYING GREEN on its first pass.
   *
   * ⚠️ ITS DIVERGENCE IS NOT IN `docs/DIVERGENCES.md`. The horse rearing where the bear
   * and deer bolt is written down in exactly one place — `src/core/npc/EnemyHorse.ts:18-19`
   * — so unlike the other two re-authored plants (DIVERGENCES' 3a section names both the
   * constructors-do-not-act and elemental-columns gaps), this one rests on this session's
   * reading of the port. Said plainly because an earlier draft of this entry claimed
   * DIVERGENCES backed it, and an adversarial pass refuted that.
   */
  {
    name: 'horse: bolt into RUN on the LEFT-facing flee instead of rearing',
    file: 'src/core/npc/EnemyHorse.ts',
    find: [
      '        this.destX = this.world.stageWidth + OG_ANIMAL.offStage.dest;',
      '        this.startAction(OG_STATE.POSE);',
      '        this.startAnim(OG_ANIM.HORSE_REARING);',
    ].join('\n'),
    replace: [
      '        this.destX = this.world.stageWidth + OG_ANIMAL.offStage.dest;',
      '        this.startAction(OG_STATE.RUN);',
    ].join('\n'),
    tests: [SLICE],
    note: 'reauthored:2026-09-13 — stands in for session 35’s unnamed 18th plant',
  },
];
