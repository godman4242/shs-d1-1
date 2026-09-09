/**
 * GATES L4b-C and L4b-D — THE TREE HAS THE SOURCE'S SHAPE.
 *
 * For every class of the in-scope tree that has shipped, this file reads BOTH
 * sides — the `.as` under `reference/decompiled/` and the `.ts` under
 * `src/core/npc/` — with its own flat grammar, and demands:
 *   - it `extends` what the AS3 says it extends;
 *   - its `override` set is EXACTLY the AS3's `override … function` set
 *     (`noImplicitOverride` makes the TS keyword mandatory, so it is the signal);
 *   - the base carries every one of `NPC.as`'s 51 functions by name.
 *
 * And the two shape pins a later "cleanup" would break, read from the source
 * today so they bind before those slices ship: `EnemyWolf2` overrides exactly
 * ONE method, and `EnemyVegePatch` overrides NEITHER `startAction` NOR `doAction`.
 *
 * ⚠️ THE THIRD 34. L4a pinned two 34s apart (34 distinct `<ai>` values, 34
 * `Enemy*.as` files). The in-scope tree is a third 34 — five of it are not
 * `Enemy*` and five `Enemy*` files are not in it — pinned disjoint below so a
 * future reader cannot "verify" this lane with a coincidence.
 *
 * ⚠️ C2 — the decompiled scripts are the ANDROID build (v0.682).
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { OG_AI_CREATE_NPC, OG_AI_CREATE_ROOM_NPC, OG_AI_CREATE_ROOM_NPC_PROCGEN } from '../src/config/ogAi';
import { OG_NPCS } from '../src/config/ogNpcs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SCRIPTS = path.join(ROOT, 'reference', 'decompiled', 'shs3_android_payload', 'scripts');
const NPC_DIR = path.join(ROOT, 'src', 'core', 'npc');
const HAVE_SOURCE = existsSync(path.join(SCRIPTS, 'NPC.as'));

/**
 * THE IN-SCOPE TREE: AS3 class → AS3 parent. 34 descendants of `NPC`, plus `NPC`
 * itself under `MCSActor`. `EnemyPlayer`'s branch (extends `MCSPlayer`) and
 * `CutsceneActor` are NOT here — L5's and L1's respectively (L4B_KICKOFF.md).
 */
const TREE: Readonly<Record<string, string>> = {
  NPC: 'MCSActor',
  EnemyArcher: 'NPC',
  FriendlyArcher: 'EnemyArcher',
  EnemyCivilian: 'NPC',
  EnemyCivilianFemale: 'EnemyCivilian',
  EnemyCivilianOld: 'EnemyCivilian',
  EnemySpearElite: 'NPC',
  FriendlySpearElite: 'EnemySpearElite',
  EnemyWolf: 'NPC',
  EnemyFox: 'EnemyWolf',
  EnemyWolf2: 'EnemyWolf',
  EnemyBear: 'NPC',
  EnemyBoar: 'NPC',
  EnemyDeer: 'NPC',
  EnemyGoblin: 'NPC',
  EnemyGoblinThrower: 'NPC',
  EnemyHorse: 'NPC',
  EnemyJiangSi: 'NPC',
  EnemyKanjiGuardian: 'NPC',
  EnemyKatana: 'NPC',
  EnemyKnife: 'NPC',
  EnemyNianMonster: 'NPC',
  EnemyNinja: 'NPC',
  EnemyOgre: 'NPC',
  EnemyShield: 'NPC',
  EnemySorcererBoss: 'NPC',
  EnemySpear: 'NPC',
  EnemyStag: 'NPC',
  EnemyTrainingDummy: 'NPC',
  EnemyVegePatch: 'NPC',
  EnemyWolfAlpha: 'NPC',
  EnemyZombie: 'NPC',
  RoomGoblin: 'NPC',
  RoomOgre: 'NPC',
  RoomZombie: 'NPC',
};

/** AS3 class → TS file, for the classes that have SHIPPED. Each slice appends. */
const SHIPPED: Readonly<Record<string, string>> = {
  MCSActor: 'MCSActor.ts',
  NPC: 'Npc.ts',
  // slice 1
  EnemyKatana: 'EnemyKatana.ts',
  EnemyKnife: 'EnemyKnife.ts',
  EnemySpear: 'EnemySpear.ts',
  RoomGoblin: 'RoomGoblin.ts',
  RoomOgre: 'RoomOgre.ts',
};

/** AS3 name → TS class name, where they differ. */
const TS_NAME: Readonly<Record<string, string>> = { NPC: 'Npc' };
const tsName = (as3: string): string => TS_NAME[as3] ?? as3;

/**
 * `MCSActor.as` functions the TS parent does not carry under the same name, each
 * with its reason. `getMCS()` returns the display object, which is folded INTO
 * the actor; `updateAnimation` on the display object is `stepAnimation` here
 * because `NPC.as:272` declares its own `updateAnimation` wrapper over it.
 */
const FOLDED: ReadonlySet<string> = new Set(['getMCS']);

interface As3Fn {
  name: string;
  override: boolean;
}
const AS3_FN = /^\s+(override )?(?:(?:public|internal|protected|private|static) )*function (\w+)\s*\(/;
const AS3_CLASS = /^\s*public class (\w+) extends (\w+)/m;
const TS_METHOD = /^ {2}(override )?(?:(?:static|private|protected|public|readonly) )*(\w+)\s*\(/;
const TS_CLASS = /^export class (\w+)(?: extends (\w+))?/m;

const readAs3 = (cls: string): { ext: string | null; fns: As3Fn[] } => {
  const src = readFileSync(path.join(SCRIPTS, `${cls}.as`), 'utf8');
  const ext = AS3_CLASS.exec(src)?.[2] ?? null;
  const fns: As3Fn[] = [];
  for (const line of src.split('\n')) {
    const m = AS3_FN.exec(line);
    if (m) fns.push({ name: m[2] ?? '', override: m[1] !== undefined });
  }
  return { ext, fns };
};

const readTs = (file: string): { name: string; ext: string | null; methods: As3Fn[] } => {
  const src = readFileSync(path.join(NPC_DIR, file), 'utf8');
  const cm = TS_CLASS.exec(src);
  const methods: As3Fn[] = [];
  for (const line of src.split('\n')) {
    const m = TS_METHOD.exec(line);
    if (m && m[2] !== 'constructor') methods.push({ name: m[2] ?? '', override: m[1] !== undefined });
  }
  return { name: cm?.[1] ?? '', ext: cm?.[2] ?? null, methods };
};

const overridesOf = (fns: readonly As3Fn[]): string[] => fns.filter((f) => f.override).map((f) => f.name).sort();

describe('L4b-D structural pins — run everywhere', () => {
  it('the in-scope tree is 34 descendants of NPC, and NPC sits under MCSActor', () => {
    const descendants = Object.keys(TREE).filter((k) => k !== 'NPC');
    expect(descendants.length).toBe(34);
    expect(TREE.NPC).toBe('MCSActor');
    // Every parent is in the tree (a shallow tree, but a REAL one: 4 in-scope classes have children).
    for (const [cls, parent] of Object.entries(TREE)) {
      if (cls !== 'NPC') expect(TREE[parent], `${cls} extends ${parent}`).toBeDefined();
    }
    expect(descendants.filter((c) => TREE[c] !== 'NPC').sort()).toEqual([
      'EnemyCivilianFemale', 'EnemyCivilianOld', 'EnemyFox', 'EnemyWolf2', 'FriendlyArcher', 'FriendlySpearElite',
    ]);
  });

  it('THE THIRD 34 is neither of L4a\'s: five are not Enemy*, and two in-scope classes are reached by NO roster row', () => {
    const descendants = Object.keys(TREE).filter((k) => k !== 'NPC');
    expect(descendants.filter((c) => !c.startsWith('Enemy')).sort()).toEqual([
      'FriendlyArcher', 'FriendlySpearElite', 'RoomGoblin', 'RoomOgre', 'RoomZombie',
    ]);
    // The other 34: distinct <ai> VALUES in the data — a set of numbers, not names.
    const used = new Set(OG_NPCS.map((n) => n.ai).filter((v): v is number => v !== undefined));
    expect(used.size).toBe(34);
    // Through every dispatch, the used values reach 32 of the 34 in-scope classes.
    const reached = new Set<string>();
    for (const d of [OG_AI_CREATE_NPC, OG_AI_CREATE_ROOM_NPC, OG_AI_CREATE_ROOM_NPC_PROCGEN]) {
      for (const c of d.cases) if (used.has(c.ai)) reached.add(c.actor);
    }
    expect(descendants.filter((c) => !reached.has(c)).sort()).toEqual(['EnemyNianMonster', 'EnemyWolf2']);
    // …and the used values reach 3 classes OUTSIDE the tree — the EnemyPlayer branch,
    // L5's. (`EnemyPlayerGiant` sits at ai 15, which no row uses, so it is not reached.)
    expect([...reached].filter((c) => !(c in TREE)).sort()).toEqual(['EnemyElite', 'EnemyPlayer', 'FriendlyElite']);
  });

  it('every shipped class file exists, exports the class under its TS name, and extends what the tree says', () => {
    for (const [as3, file] of Object.entries(SHIPPED)) {
      expect(existsSync(path.join(NPC_DIR, file)), file).toBe(true);
      const ts = readTs(file);
      expect(ts.name, file).toBe(tsName(as3));
      const parent = TREE[as3];
      if (parent !== undefined) expect(ts.ext, `${as3} extends`).toBe(tsName(parent));
    }
  });
});

describe.skipIf(!HAVE_SOURCE)('L4b-C byte-check — each shipped class has the source\'s override surface', () => {
  it('the TREE table itself matches every `extends` in the source', () => {
    for (const [cls, parent] of Object.entries(TREE)) {
      expect(readAs3(cls).ext, cls).toBe(parent);
    }
  });

  it('the 34 Enemy*.as on disk and the 34-class tree overlap on 29, and each has 5 the other lacks', () => {
    const enemies = readdirSync(SCRIPTS).filter((f) => f.startsWith('Enemy') && f.endsWith('.as')).map((f) => f.slice(0, -3));
    expect(enemies.length).toBe(34);
    const descendants = Object.keys(TREE).filter((k) => k !== 'NPC');
    expect(descendants.filter((c) => enemies.includes(c)).length).toBe(29);
    expect(enemies.filter((e) => !(e in TREE)).sort()).toEqual([
      'EnemyClone', 'EnemyElite', 'EnemyPlayer', 'EnemyPlayerGiant', 'Enemy_VegePatch',
    ]);
  });

  it('MCSPlayer extends NPC — the player is a DESCENDANT of this base, not a sibling root', () => {
    expect(readAs3('MCSPlayer').ext).toBe('NPC');
    expect(readAs3('EnemyPlayer').ext).toBe('MCSPlayer');
  });

  it('every shipped class overrides EXACTLY the methods its AS3 overrides', () => {
    for (const [as3, file] of Object.entries(SHIPPED)) {
      expect(overridesOf(readTs(file).methods), as3).toEqual(overridesOf(readAs3(as3).fns));
    }
  });

  it('NPC.as has 51 functions and Npc.ts carries every one by name; MCSActor.as has 19 and MCSActor.ts all but the folded getMCS', () => {
    const npc = readAs3('NPC');
    expect(npc.fns.length).toBe(51);
    const ts = new Set(readTs('Npc.ts').methods.map((m) => m.name));
    const missing = npc.fns.map((f) => f.name).filter((n) => n !== 'NPC' && !ts.has(n));
    expect(missing).toEqual([]);
    // The base's three overrides over MCSActor are the source's three.
    expect(overridesOf(npc.fns)).toEqual(['deathAnimEnd', 'die', 'redFreeze']);

    const actor = readAs3('MCSActor');
    expect(actor.fns.length).toBe(19);
    const tsActor = new Set(readTs('MCSActor.ts').methods.map((m) => m.name));
    const missingActor = actor.fns.map((f) => f.name).filter((n) => n !== 'MCSActor' && !FOLDED.has(n) && !tsActor.has(n));
    expect(missingActor).toEqual([]);
  });

  it('L4b-D: EnemyWolf2 overrides exactly ONE method, and it is doAction', () => {
    expect(overridesOf(readAs3('EnemyWolf2').fns)).toEqual(['doAction']);
  });

  it('L4b-D: EnemyVegePatch overrides TEN methods and NEITHER startAction NOR doAction — a prop, not a fighter', () => {
    const ov = overridesOf(readAs3('EnemyVegePatch').fns);
    expect(ov.length).toBe(10);
    expect(ov).not.toContain('startAction');
    expect(ov).not.toContain('doAction');
    expect(ov).toContain('update');
    expect(ov).toEqual([
      'addToCanvas', 'checkHit', 'checkHitObject', 'clearFilter', 'die', 'movePositionX',
      'redFreeze', 'removeFromCanvas', 'setPosition', 'update',
    ]);
  });

  it('the override VOCABULARY is 22 methods over the 34 in-scope classes — the kickoff\'s 31 is the count over all 39', () => {
    // Measured 2026-09-09 against the source: L4B_KICKOFF.md trap 3 says "31 distinct
    // methods across the tree". That is the 39-class figure; the NINE extra names all
    // belong to the out-of-scope EnemyPlayer branch. The source wins, and both are pinned.
    const vocabOf = (classes: readonly string[]): Set<string> => {
      const vocab = new Set<string>();
      for (const cls of classes) for (const n of overridesOf(readAs3(cls).fns)) vocab.add(n);
      return vocab;
    };
    const inScope = Object.keys(TREE).filter((k) => k !== 'NPC');
    const outOfScope = ['EnemyPlayer', 'EnemyElite', 'EnemyPlayerGiant', 'FriendlyElite', 'CutsceneActor'];
    const v34 = vocabOf(inScope);
    const v39 = vocabOf([...inScope, ...outOfScope]);
    expect(v34.size).toBe(22);
    expect(v39.size).toBe(31);
    expect([...v39].filter((n) => !v34.has(n)).sort()).toEqual([
      'AI', 'createLoot', 'getDamage', 'getSkillLevel', 'getTargetPosition',
      'gotDeathTouch', 'gotInput', 'gotNetworkDamage', 'rewardXP',
    ]);
    for (const spine of ['update', 'startAction', 'doAction', 'init', 'die']) expect(v34.has(spine), spine).toBe(true);
  });
});
