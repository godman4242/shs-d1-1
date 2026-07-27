/**
 * THE COMPOSER (SESSION18 A4.3) — 19 recorded nodes + 2 aliases → an ordered
 * draw list. GATES A4-B and A4-C.
 *
 * Every risk left in the imported art lives here rather than in the shapes.
 * SESSION 17 proved one shape lands at the right SIZE; it could not say
 * anything about which slot gets which transform, which slots are aliased, or
 * what order they stack in. All three fail SILENTLY and all three look like an
 * art bug rather than a wiring bug:
 *
 *   - miss the 8←14 alias  → the crotch is stranded at the origin, a tan blob
 *                            at the fighter's feet;
 *   - miss a two-part slot → both foottops and the hair vanish, and the
 *                            silhouette barely changes;
 *   - iterate the XML      → z-order inverts, and the fighter still looks like
 *                            a fighter (SESSION18 §2 diagnosis (d)).
 *
 * A silhouette measurement cannot see any of them, by definition — so they are
 * pinned here, in the suite, exactly as paint order was in SESSION 17.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { composePose, type PosedPart } from '../src/core/composePose';
import {
  OG_DRESSED_SLOT_SHAPES,
  OG_IDLE_NODES,
  OG_SLOT_ALIASES,
  OG_SLOT_SHAPES,
  type OgPoseNode,
} from '../src/config/ogPose';

const compose = (): PosedPart[] => composePose(OG_IDLE_NODES, OG_SLOT_SHAPES, OG_SLOT_ALIASES);

const partsAt = (slot: number): PosedPart[] => compose().filter((p) => p.slot === slot);

/** The node the pose records for `slot`, or a loud throw. */
function node(slot: number): OgPoseNode {
  const found = OG_IDLE_NODES.find((n) => n.slot === slot);
  if (found === undefined) throw new Error(`the idle pose carries no node for slot ${String(slot)}`);
  return found;
}

const DEG_TO_RAD = Math.PI / 180;

describe('composePose: the aliased slots (GATE A4-B)', () => {
  /**
   * The headline. No node in the file carries slot 8 — `OG_IDLE_NODES` has 19
   * entries covering 0–7, 9–16 and 18–20 — so a composer that only walks the
   * node list emits nothing here and the crotch renders at the origin.
   */
  it('emits the crotch (slot 8) from the PELVIC node, though no node carries slot 8', () => {
    expect(OG_IDLE_NODES.some((n) => n.slot === 8)).toBe(false);

    const [crotch] = partsAt(8);

    expect(crotch?.shapeId).toBe(2676);
    expect([crotch?.x, crotch?.y]).toEqual([node(14).x, node(14).y]);
  });

  it('gives the crotch the pelvic ROTATION too, not just its position', () => {
    expect(partsAt(8).at(0)?.rotationRad).toBeCloseTo(node(14).rotationDeg * DEG_TO_RAD, 12);
  });

  /**
   * Slot 17 (hat) is EMPTY BY DESIGN, so the real pose draws nothing for it and
   * the 17←16 alias is unobservable in the shipped data. It is pinned against a
   * synthetic slot map instead — otherwise the second half of the aliasing rule
   * is carried by a comment, and the day hat art exists it silently misplaces it.
   */
  it('applies the 17←16 alias too — provable only against a slot map that fills 17', () => {
    const withHat = OG_SLOT_SHAPES.map((shapes, slot) => (slot === 17 ? [7000] : shapes));

    const hat = composePose(OG_IDLE_NODES, withHat, OG_SLOT_ALIASES).find((p) => p.slot === 17);

    expect(hat?.shapeId).toBe(7000);
    expect([hat?.x, hat?.y]).toEqual([node(16).x, node(16).y]);
  });

  it('does NOT emit the empty slots 3, 4 and 17, even though 3 and 4 carry nodes', () => {
    // Nodes exist for weapon and prop — they are the game's own "none"
    // placeholders. Drawing from a node that has no art is the mirror mistake.
    expect(OG_IDLE_NODES.some((n) => n.slot === 3)).toBe(true);
    expect(OG_IDLE_NODES.some((n) => n.slot === 4)).toBe(true);

    expect(compose().length, 'an empty pose would pass this test for free').toBeGreaterThan(0);
    expect(compose().filter((p) => [3, 4, 17].includes(p.slot))).toEqual([]);
  });
});

describe('composePose: the two-part slots (GATE A4-B)', () => {
  it('draws TWO parts in slots 7, 11 and 16 — calf+foottop, calf+foottop, head+hair', () => {
    expect(partsAt(7).map((p) => p.shapeId)).toEqual([2678, 2672]);
    expect(partsAt(11).map((p) => p.shapeId)).toEqual([2678, 2672]);
    expect(partsAt(16).map((p) => p.shapeId)).toEqual([2664, 2670]);
  });

  it('gives both parts of a slot the SAME transform — they share one joint', () => {
    const [head, hair] = partsAt(16);

    // Two undefineds are equal to each other — assert they EXIST first.
    expect([head, hair].every((p) => p !== undefined)).toBe(true);
    expect([hair?.x, hair?.y, hair?.rotationRad]).toEqual([head?.x, head?.y, head?.rotationRad]);
  });

  /**
   * ⚠️ THE KICKOFF'S GATE A4-B SAYS "17 drawn parts" AND THAT NUMBER IS WRONG —
   * its own §P3 slot table gives 21. 21 slots, minus the 3 that are empty by
   * design (3, 4, 17), is 18 occupied slots; slots 7, 11 and 16 draw two each,
   * so 18 + 3 = 21 parts. Derived from the map here rather than transcribed, so
   * the suite owns the number and cannot inherit the arithmetic slip.
   */
  it('draws 21 parts across 18 occupied slots — derived from the map, not transcribed', () => {
    const parts = compose();
    const occupied = OG_SLOT_SHAPES.filter((shapes) => shapes.length > 0);

    expect(occupied).toHaveLength(18);
    expect(parts).toHaveLength(21);
    expect(parts).toHaveLength(occupied.reduce((n, shapes) => n + shapes.length, 0));
  });

  it('uses all 14 distinct fighter shapes, and only those', () => {
    expect([...new Set(compose().map((p) => p.shapeId))].sort((a, b) => a - b)).toEqual([
      2644, 2646, 2648, 2650, 2653, 2655, 2658, 2664, 2667, 2670, 2672, 2674, 2676, 2678,
    ]);
  });
});

describe('composePose: z-order is CREATION order (GATE A4-C)', () => {
  /**
   * The one a node-list-order composer fails. `OG_IDLE_NODES` is stored in the
   * XML's own document order — 20, 19, 18, 14, 16, … — so returning the list in
   * array order puts the near lowarm at the BACK and inverts the whole fighter.
   * It still looks like a fighter, which is why this is a test.
   */
  it('returns parts in ascending slot order — slot 0 at the back, slot 20 at the front', () => {
    const slots = compose().map((p) => p.slot);

    expect(slots).toEqual([...slots].sort((a, b) => a - b));
    expect(slots.at(0)).toBe(0);
    expect(slots.at(-1)).toBe(20);
  });

  it('does NOT follow the node list order, which starts at slot 20', () => {
    expect(OG_IDLE_NODES.at(0)?.slot).toBe(20);

    expect(compose().at(0)?.slot).toBe(0);
  });

  it('puts the near arm in front of the torso, and the far arm behind it', () => {
    const index = (slot: number): number => compose().findIndex((p) => p.slot === slot);

    expect(index(1)).toBeLessThan(index(15)); // far uparm  → behind the torso
    expect(index(19)).toBeGreaterThan(index(15)); // near uparm → in front of it
  });
});

describe('composePose: degrees in, radians out (D5)', () => {
  it('converts every rotation from degrees to radians at the boundary', () => {
    const torso = compose().find((p) => p.slot === 15);

    expect(torso?.rotationRad).toBeCloseTo(-1 * DEG_TO_RAD, 12);
  });

  /**
   * Slot 3 is the weapon at r=142 — the largest rotation in the frame and the
   * only one big enough that "forgot to convert" is unmistakable. It draws
   * nothing, so it is checked through a slot map that fills it.
   */
  it('converts a LARGE angle correctly — 142° is 2.478 rad, not 142', () => {
    const withWeapon = OG_SLOT_SHAPES.map((shapes, slot) => (slot === 3 ? [13000] : shapes));

    const weapon = composePose(OG_IDLE_NODES, withWeapon, OG_SLOT_ALIASES).find((p) => p.slot === 3);

    expect(weapon?.rotationRad).toBeCloseTo(2.4784, 4);
  });
});

describe('composePose: fails closed on a broken pose', () => {
  it('throws when a slot has art but no node and no alias — the stranded-part bug', () => {
    const missingTorso = OG_IDLE_NODES.filter((n) => n.slot !== 15);

    expect(() => composePose(missingTorso, OG_SLOT_SHAPES, OG_SLOT_ALIASES)).toThrow(/slot 15/);
  });

  it('throws when an alias points at a slot the pose does not carry', () => {
    const noPelvic = OG_IDLE_NODES.filter((n) => n.slot !== 14);

    expect(() => composePose(noPelvic, OG_SLOT_SHAPES, OG_SLOT_ALIASES)).toThrow(/alias/i);
  });

  it('throws when an aliased slot ALSO carries its own node — the rule would be ambiguous', () => {
    const withOwnNode = [...OG_IDLE_NODES, { slot: 8, x: 99, y: 99, rotationDeg: 0 }];

    expect(() => composePose(withOwnNode, OG_SLOT_SHAPES, OG_SLOT_ALIASES)).toThrow(/alias/i);
  });
});

/**
 * THE TRANSCRIPTION ITSELF, checked against the payload's own bytes.
 *
 * `OG_IDLE_NODES` is 19 rows × 4 numbers typed out by hand from a kickoff. Every
 * other test in this file would pass just as happily against a typo — they
 * assert the composer's BEHAVIOUR, and a mistyped `y` is behaviourally
 * invisible until it shows up as a limb 10 px out of place, which is precisely
 * the diagnosis this session forbids itself from guessing at.
 *
 * `describe.skipIf`-gated and LAZY, exactly like `tests/svgShape.test.ts`'s
 * re-derivation suite: `reference/` is gitignored, and a read in a describe body
 * took the whole file down in a clean clone once already (SESSION16 finding 4).
 */
const BINDATA = path.join(
  fileURLToPath(new URL('..', import.meta.url)),
  'reference',
  'extracted',
  'bindata',
  '108_1t4635s0.bin',
);
const HAVE_BINDATA = existsSync(BINDATA);

describe.skipIf(!HAVE_BINDATA)('composePose: OG_IDLE_NODES is a faithful transcription', () => {
  /** The idle frame's nodes, parsed straight out of the DefineBinaryData. */
  const fromPayload = (): Map<number, OgPoseNode> => {
    const raw = readFileSync(BINDATA, 'latin1');
    const anim = /<anim i="idle"[^>]*>([\s\S]*?)<\/anim>/.exec(raw)?.[1];
    if (anim === undefined) throw new Error('no <anim i="idle"> in the bindata');
    const frame = /<f i="0">([\s\S]*?)<\/f>/.exec(anim)?.[1];
    if (frame === undefined) throw new Error('no <f i="0"> in the idle animation');

    const out = new Map<number, OgPoseNode>();
    for (const m of frame.matchAll(/<n i="(-?\d+)" x="(-?\d+)" y="(-?\d+)" r="(-?\d+)">/g)) {
      const [, slot, x, y, r] = m.map(Number);
      out.set(Number(slot), {
        slot: Number(slot),
        x: Number(x),
        y: Number(y),
        rotationDeg: Number(r),
      });
    }
    return out;
  };

  it('matches the payload node for node, with nothing added or dropped', () => {
    const payload = fromPayload();

    expect([...payload.keys()].sort((a, b) => a - b)).toEqual(
      [...OG_IDLE_NODES].map((n) => n.slot).sort((a, b) => a - b),
    );
    for (const mine of OG_IDLE_NODES) {
      expect(payload.get(mine.slot), `slot ${String(mine.slot)}`).toEqual(mine);
    }
  });

  /**
   * The aliasing rule, confirmed from DATA rather than from a code comment: the
   * two slots the AS3 aliases are exactly the two the frame omits.
   */
  it('omits slots 8 and 17 in the source too — the two the AS3 aliases', () => {
    const payload = fromPayload();

    expect(payload.has(8)).toBe(false);
    expect(payload.has(17)).toBe(false);
    expect(OG_SLOT_ALIASES.map(([slot]) => slot).sort((a, b) => a - b)).toEqual([8, 17]);
  });
});

/**
 * SESSION19 A5.2 — THE DRESSED SLOT MAP, AND THE 17←16 ALIAS MADE REAL.
 *
 * Kickoff D3: a dressed fighter is a SECOND slot map, never a modified one, so
 * `?art=idle` keeps drawing the bare doll and SESSION 18's evidence survives.
 *
 * ⭐ This retires a stated weakness. The alias test above pins 17←16 against a
 * SYNTHETIC map holding a made-up id `7000`, because slot 17 was empty in all
 * shipped data — so the second half of the aliasing rule was carried by a
 * fixture. With a real traced kasa in slot 17 it is now pinned against the data
 * the game actually draws.
 */
describe('OG_DRESSED_SLOT_SHAPES: the traced outfit (SESSION19 A5.2)', () => {
  const dressed = (): PosedPart[] => composePose(OG_IDLE_NODES, OG_DRESSED_SLOT_SHAPES, OG_SLOT_ALIASES);

  it('fills slot 17 with the traced kasa, where the BARE map is empty', () => {
    expect(OG_SLOT_SHAPES[17], 'the bare fighter must stay bald').toEqual([]);
    expect(OG_DRESSED_SLOT_SHAPES[17]).toEqual([9017]);
  });

  it('differs from the bare map in slot 17 and NOWHERE else (D3)', () => {
    const differing = OG_DRESSED_SLOT_SHAPES.flatMap((shapes, slot) =>
      JSON.stringify(shapes) === JSON.stringify(OG_SLOT_SHAPES[slot]) ? [] : [slot],
    );
    expect(differing, 'A5.2 dresses ONE slot; A5.3 adds the rest deliberately').toEqual([17]);
  });

  it('draws 22 parts — the bare 21 plus the kasa', () => {
    expect(compose()).toHaveLength(21);
    expect(dressed()).toHaveLength(22);
  });

  /** The alias, against real art rather than a fixture id. */
  it('puts the kasa at the HEAD node transform, not at a node of its own', () => {
    expect(OG_IDLE_NODES.some((n) => n.slot === 17), 'slot 17 has no node — that is why it is aliased').toBe(false);

    const hat = dressed().find((p) => p.slot === 17);

    expect(hat?.shapeId).toBe(9017);
    expect([hat?.x, hat?.y]).toEqual([node(16).x, node(16).y]);
    expect(hat?.rotationRad).toBeCloseTo(node(16).rotationDeg * DEG_TO_RAD, 12);
  });

  /**
   * A hat behind the head is the failure this ordering exists to stop, and it
   * would still look like a fighter. z-order is CREATION order = slot order,
   * so 17 > 16 puts the kasa in front of the head it sits on.
   */
  it('draws the kasa AFTER the head and hair', () => {
    const order = dressed();
    const hat = order.findIndex((p) => p.slot === 17);
    const lastHead = order.map((p) => p.slot).lastIndexOf(16);
    expect(hat).toBeGreaterThan(lastHead);
  });
});
