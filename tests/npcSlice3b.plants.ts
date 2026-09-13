/**
 * CHAOS PLANTS — L4b SLICE 3b, THE BOAR AND THE ALPHA.
 *
 * Applied and judged by `npm run chaos` (`scripts/gates/chaos.ts`). Each entry breaks
 * ONE guard that `tests/npcSlice3b.test.ts` claims to cover; the suite must go red.
 *
 * All 22 are transcribed byte-for-byte from session 35's `scratchpad/chaos3b.py` by an
 * AST extractor rather than by hand, and every anchor was re-verified to occur exactly
 * once at HEAD before being committed. They went **22/22 red on the first pass**
 * (`docs/sessions/-SESSION-LOG.md`, 2026-09-12 02:10).
 *
 * ONE PLANT IS DELIBERATELY ABSENT and stays absent: the alpha's defence-before-versus-
 * inside-the-alive-check ordering is genuinely unobservable (at HP ≤ 0 neither version
 * applies anything; at HP > 0 both compute the same), so no test can distinguish it and
 * no plant can go red. It is recorded in `docs/DIVERGENCES.md` as ported in the
 * source's order. That is a ruling a human defends in prose — NOT an `expect: 'green'`
 * field, which would be a general-purpose escape hatch for any plant that would not go
 * red. See the note in `scripts/gates/chaosPlant.ts`.
 */
import type { ChaosPlant } from '../scripts/gates/chaosPlant.ts';

const SLICE = 'tests/npcSlice3b.test.ts';
const TREE = 'tests/npcTree.test.ts';

export const PLANTS: ChaosPlant[] = [
  {
    name: "boar: knock-down uses the BASE's body instead of its own launch",
    file: 'src/core/npc/EnemyBoar.ts',
    find: [
      '  override gotKnockDown(): void {',
      '    this.gotLaunched();',
      '  }',
    ].join('\n'),
    replace: [
      '  override gotKnockDown(): void {',
      '    super.gotKnockDown();',
      '  }',
    ].join('\n'),
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: 'boar: gotFly honours the velocities instead of discarding them',
    file: 'src/core/npc/EnemyBoar.ts',
    find: [
      '    void _flyVelX;',
      '    void _flyVelY;',
      '    this.gotLaunched();',
    ].join('\n'),
    replace: [
      '    this.velX = _flyVelX;',
      '    this.velY = _flyVelY;',
      '    this.startAction(OG_STATE.GOTLAUNCHED);',
    ].join('\n'),
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: "boar: canGotFly false (the wolf's value)",
    file: 'src/core/npc/EnemyBoar.ts',
    find: '    this.canGotFly = true;',
    replace: '    this.canGotFly = false;',
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: "boar: add the base's canGotLaunched check to gotLaunched",
    file: 'src/core/npc/EnemyBoar.ts',
    find: '    if (this.actionState === OG_STATE.DOWNED || this.actionState === OG_STATE.DYING) return;',
    replace: '    if (!this.canGotLaunched || this.actionState === OG_STATE.DOWNED || this.actionState === OG_STATE.DYING) return;',
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: "boar: doLaunched lands into DOWNED (the wolf's)",
    file: 'src/core/npc/EnemyBoar.ts',
    find: [
      '        this.startAction(OG_STATE.WALK);',
      '      }',
      '    } else if (',
    ].join('\n'),
    replace: [
      '        this.startAction(OG_STATE.DOWNED);',
      '      }',
      '    } else if (',
    ].join('\n'),
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: "boar: add FLY to gotLaunched's airborne set",
    file: 'src/core/npc/EnemyBoar.ts',
    find: '    if (s === OG_STATE.GOTLAUNCHED || s === OG_STATE.FALL || s === OG_STATE.JUMP) {',
    replace: '    if (s === OG_STATE.GOTLAUNCHED || s === OG_STATE.FALL || s === OG_STATE.JUMP || s === OG_STATE.FLY) {',
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: "boar: fence RUN's hit behind a range test",
    file: 'src/core/npc/EnemyBoar.ts',
    find: [
      '        if (target !== null) {',
      '          target.checkHitObject(',
      "            { kind: 'part', part: OG_PART.head, owner: this },",
    ].join('\n'),
    replace: [
      '        if (target !== null && Math.abs(this.x - target.x) < OG_BOAR.attackRangeX) {',
      '          target.checkHitObject(',
      "            { kind: 'part', part: OG_PART.head, owner: this },",
    ].join('\n'),
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: 'boar: re-roll knocker every frame instead of once per charge',
    file: 'src/core/npc/EnemyBoar.ts',
    find: [
      '        this.knocker = asInt(this.rng() * OG_BOAR.knockerDice) === ZERO;',
      '        break;',
      '      case OG_STATE.ATTACK:',
    ].join('\n'),
    replace: [
      '        break;',
      '      case OG_STATE.ATTACK:',
    ].join('\n'),
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: 'boar: charge at 12 like the wanderers',
    file: 'src/config/ogEnemyBoar.ts',
    find: '  runSpeed: 10,',
    replace: '  runSpeed: 12,',
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: 'boar: roll the arrival coin in a room too',
    file: 'src/core/npc/EnemyBoar.ts',
    find: '          if (this.world.adventureMode && asInt(this.rng() * OG_ANIMAL.arriveDice) === ZERO) {',
    replace: '          if (asInt(this.rng() * OG_ANIMAL.arriveDice) === ZERO) {',
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: "boar: 'fix' the DEER clip on the boar's red-freeze",
    file: 'src/core/npc/EnemyBoar.ts',
    find: '            this.startAnim(OG_ANIM.DEER_IDLE);',
    replace: '            this.startAnim(OG_ANIM.BOAR_IDLE);',
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: "alpha: give gotHit the wolf's !isDowned() guard",
    file: 'src/core/npc/EnemyWolfAlpha.ts',
    find: '        if (damageObj.isLaunchAir() || s === OG_STATE.GOTLAUNCHED || s === OG_STATE.FALL || s === OG_STATE.JUMP) {',
    replace: '        if ((damageObj.isLaunchAir() || s === OG_STATE.GOTLAUNCHED || s === OG_STATE.FALL || s === OG_STATE.JUMP) && !this.isDowned()) {',
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: "alpha: give KNOCKDOWNED its own break and the wolf's 6 frames",
    file: 'src/core/npc/EnemyWolfAlpha.ts',
    find: [
      '      case OG_STATE.KNOCKDOWNED:',
      '      case OG_STATE.DOWNED:',
    ].join('\n'),
    replace: [
      '      case OG_STATE.KNOCKDOWNED:',
      '        this.actionState = OG_STATE.DOWNED;',
      '        this.startAnim(OG_ANIM.WOLF_LAUNCHEDEND);',
      '        this.idleCounter = OG_ALPHA.idle.retryFrames;',
      '        break;',
      '      case OG_STATE.DOWNED:',
    ].join('\n'),
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: 'alpha: drop HOWL from the arrival d4',
    file: 'src/core/npc/EnemyWolfAlpha.ts',
    find: '      } else if (dice === OG_ALPHA.poseOn) {',
    replace: '      } else if (dice === OG_ALPHA.poseOn && false) {',
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: "alpha: step RUN down in the overworld (the wolf's split)",
    file: 'src/core/npc/EnemyWolfAlpha.ts',
    find: [
      '          this.walkSpeed = -OG_ALPHA.runSpeed;',
      '          this.faceLeft();',
      '        } else {',
      '          this.walkSpeed = OG_ALPHA.runSpeed;',
    ].join('\n'),
    replace: [
      '          this.walkSpeed = this.world.adventureMode ? -OG_WOLF_RUN_ADV : -OG_ALPHA.runSpeed;',
      '          this.faceLeft();',
      '        } else {',
      '          this.walkSpeed = this.world.adventureMode ? OG_WOLF_RUN_ADV : OG_ALPHA.runSpeed;',
    ].join('\n'),
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: "alpha: pounce hits only the wolf's two parts",
    file: 'src/core/npc/EnemyWolfAlpha.ts',
    find: [
      "            target.checkHitObject({ kind: 'part', part: OG_PART.torso, owner: this }, new NpcDamage(this.damage, this.level));",
      '',
    ].join('\n'),
    replace: '',
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: 'alpha: howl for help in the overworld too',
    file: 'src/core/npc/EnemyWolfAlpha.ts',
    find: [
      '        this.startAnim(OG_ANIM.WOLF_HOWL);',
      '        if (!this.world.adventureMode) {',
    ].join('\n'),
    replace: [
      '        this.startAnim(OG_ANIM.WOLF_HOWL);',
      '        if (true) {',
    ].join('\n'),
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: "alpha: use the spear boss's 18 instead of its own 15",
    file: 'src/config/ogEnemyWolfAlpha.ts',
    find: '    hitsToKillPlayerBase: 15,',
    replace: '    hitsToKillPlayerBase: 18,',
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: 'alpha: flatten the falling-through floor chain into a max()',
    file: 'src/core/npc/EnemyWolfAlpha.ts',
    find: [
      '    if (playerLVL <= F.tier1Level && playerhit < F.tier1Min) {',
      '      playerhit = F.tier1Min;',
      '    } else if (playerLVL <= F.tier2Level && playerhit < asInt(playerLVL / F.tier2Div)) {',
      '      playerhit = asInt(playerLVL / F.tier2Div);',
      '    } else if (playerLVL <= F.tier3Level && playerhit < asInt(playerLVL / F.tier3Div)) {',
      '      playerhit = asInt(playerLVL / F.tier3Div);',
      '    } else if (playerhit < asInt(playerLVL / F.tier4Div)) {',
      '      playerhit = asInt(playerLVL / F.tier4Div);',
      '    }',
    ].join('\n'),
    replace: [
      '    if (playerLVL <= F.tier1Level) playerhit = Math.max(playerhit, F.tier1Min);',
      '    else if (playerLVL <= F.tier2Level) playerhit = Math.max(playerhit, asInt(playerLVL / F.tier2Div));',
      '    else if (playerLVL <= F.tier3Level) playerhit = Math.max(playerhit, asInt(playerLVL / F.tier3Div));',
      '    else playerhit = Math.max(playerhit, asInt(playerLVL / F.tier4Div));',
    ].join('\n'),
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: "alpha: drop the constructor's startAction(IDLE)",
    file: 'src/core/npc/EnemyWolfAlpha.ts',
    find: [
      '    super(world, anims, geometry, rng, target);',
      '    this.startAction(OG_STATE.IDLE);',
    ].join('\n'),
    replace: '    super(world, anims, geometry, rng, target);',
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: "alpha: let setLevel overwrite xp with the base curve (the stag's)",
    file: 'src/core/npc/EnemyWolfAlpha.ts',
    find: '    this.xp = lvl * OG_ALPHA.xp.perLevel + OG_ALPHA.xp.base;',
    replace: '    this.xp = lvl * 2 + 20;',
    tests: [SLICE],
    note: 'recovered:session35/chaos3b.py',
  },
  {
    name: 'tree gate: give the boar an override the AS3 does not have',
    file: 'src/core/npc/EnemyBoar.ts',
    find: '  override init(xml: OgNpc): void {',
    replace: [
      '  override redFreeze(): void {',
      '    super.redFreeze();',
      '  }',
      '',
      '  override init(xml: OgNpc): void {',
    ].join('\n'),
    tests: [TREE],
    note: 'recovered:session35/chaos3b.py',
  },
];
