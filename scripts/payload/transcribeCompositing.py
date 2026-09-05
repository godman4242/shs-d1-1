#!/usr/bin/env python3
"""THE COMPOSITING TRANSCRIBER (lane L3, compositing half) — MCSCharacter.as ->
committed config.

Reads the ORIGINAL'S OWN AS3 and emits `src/config/ogCompositing.ts`: the
equipment-slot -> part-slot contract, the component-name prefixes, the naked
fallback ids, and the explicit within-part z-order. GAUNTLET.md §2 — "a script
beats a swarm": this is a deterministic extraction, so it gets a generator and a
byte-check, never a fan-out. Same shape as `transcribeItems.py` (652eebb).

WHY THIS FILE EXISTS. L3's gate is *"a dressed fighter composites in the OG's
layer order against A1"*. The repo has composited a dressed fighter since
SESSION 19, but its within-slot order was the file's own self-declared INFERRED
("calf before foottop, head before hair") — and GAUNTLET.md §1 is explicit that
a lane which infers a number the payload states outright has failed its own gate.
The payload states it outright.

THE THREE THINGS THE AS3 SAYS (all A2, all verifiable in the cites below):

1. ONE equipment slot dresses MANY part slots. `setArmor` alone writes EIGHT
   (uparm ×2, lowarm ×2, neck, stomach, pelvic, torso) — so "9 slots" and
   "27 parts" are not two views of one list, they are a MAP.

2. Art is resolved BY NAME: `getMCSComponent(<prefix>, itemId)` looks up a
   symbol like `torso4085`, falling back to a naked default class when the
   symbol is absent (`new torso4000()`). ⚠️ Those symbols live in the CDN-hosted
   asset SWFs we do NOT hold, which is why this repo can carry all 982 item ROWS
   and still render only the outfit it has traced by hand. The contract is
   portable; the art is not.

3. The naked fallbacks name the base-art id bands outright — torso/…**4000**
   (armor) · hand**5000** (gloves) · hair**6000** · hat**7000** · head**8000** ·
   mask**9000** · neck**10000** · calf/thigh/crotch**11000** (pants) ·
   foot/foottop**12000** (shoes) · weapon/prop**13000**. Those are exactly the
   `<type>` id bands the data half found in `itemdata.xml`, from the other side.

WITHIN-PART Z-ORDER — the part of the contract that was INFERRED and is not any
more. Flash child index 0 is the BOTTOM of the display list (drawn first, at the
BACK); a plain `addChild` appends to the TOP (the FRONT).

  head (part 16), all four indices set EXPLICITLY, so it is order-independent:
      setHead    head.setChildIndex(component, 0)   <- BACK
      setMask    head.setChildIndex(headMask, 1)
      setHatHair head.setChildIndex(hatHair,  2)
      setHair    head.setChildIndex(hair,     3)   <- FRONT
    ✅ CONFIRMS the repo's inferred "head before hair".

  calf (parts 7 and 11), TWO writers and only one of them pins an index:
      setShoes   l_calf.addChild(foottop); l_calf.setChildIndex(foottop, 0)  <- BACK
      setPants   l_calf.addChild(calf)                                       <- FRONT
    ⛔ CONTRADICTS the repo's inferred "calf before foottop". The foottop is
       pinned to 0 by an explicit call, so the order holds whichever setter runs
       first — it is not an accident of `initMCS`'s sequence.

Usage:  python3 scripts/payload/transcribeCompositing.py [SRC_DIR] [OUT_TS]
Writes: src/config/ogCompositing.ts   (fails loudly on any grammar surprise)

The two optional paths exist so the CHAOS-PLANT can point this at a mutated COPY
of the decompiled source and watch it die. Normal runs take no arguments.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SRC_DIR = Path(sys.argv[1]) if len(sys.argv) > 1 else REPO / "reference" / "decompiled" / "shs3_android_payload" / "scripts"
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else REPO / "src" / "config" / "ogCompositing.ts"

# Equipment slot -> the setter that dresses it. EQ_ACCESSORY1/2 are deliberately
# absent: they are equipped and stat-granting but the renderer never receives
# them (GAUNTLET.md §2.2), so they have no setter and dress no part.
EQUIP_SETTERS: tuple[tuple[str, str], ...] = (
    ("EQ_ARMOR", "setArmor"),
    ("EQ_GLOVES", "setGloves"),
    ("EQ_HAIR", "setHair"),
    ("EQ_HAT", "setHat"),
    ("EQ_HEAD", "setHead"),
    ("EQ_MASK", "setMask"),
    ("EQ_NECK", "setNeck"),
    ("EQ_PANTS", "setPants"),
    ("EQ_SHOES", "setShoes"),
    ("EQ_WEAPON", "setWeapon"),
    ("EQ_SCABBARD", "setProp"),
)


def die(msg: str) -> None:
    sys.exit(f"transcribeCompositing: {msg}")


def read(name: str) -> str:
    p = SRC_DIR / name
    if not p.exists():
        die(f"missing {p} — the decompiled payload is gitignored; see docs/RECOVERY.md")
    return p.read_text()


def parse_int_consts(source: str, prefix: str, where: str) -> dict[str, int]:
    """`public static var PART_x:int = N;` -> {'x': N}. Order-independent."""
    out: dict[str, int] = {}
    for m in re.finditer(
        rf'static var {prefix}(\w+)\s*:\s*(?:int|\*)\s*=\s*(\d+)\s*;', source
    ):
        name, value = m.group(1), int(m.group(2))
        if name in out:
            die(f"{where}: duplicate {prefix}{name}")
        out[name] = value
    if not out:
        die(f"{where}: found no {prefix}* constants — the decompilation shape changed")
    return out


def setter_body(source: str, name: str) -> str:
    start = source.find(f"public function {name}(")
    if start < 0:
        die(f"MCSCharacter.as: no `public function {name}(` — grammar changed")
    nxt = source.find("public function ", start + 10)
    return source[start : nxt if nxt > 0 else len(source)]


def main() -> None:
    mcs = read("MCSCharacter.as")
    stats = read("StatsManager.as")

    parts = parse_int_consts(mcs, "PART_", "MCSCharacter.as")
    equips = parse_int_consts(stats, "EQ_", "StatsManager.as")

    # The part indices must be a dense 0..n-1 range, or "index == z-order" is a lie.
    values = sorted(parts.values())
    if values != list(range(len(values))):
        die(f"PART_ indices are not dense 0..{len(values) - 1}: {values}")
    if sorted(equips.values()) != list(range(len(equips))):
        die(f"EQ_ indices are not dense 0..{len(equips) - 1}: {sorted(equips.values())}")

    by_index = {v: k for k, v in parts.items()}

    rows: list[str] = []
    for eq_name, setter in EQUIP_SETTERS:
        # `parse_int_consts` keys by the SUFFIX ('ARMOR'), not the full constant.
        eq_key = eq_name.removeprefix("EQ_")
        if eq_key not in equips:
            die(f"StatsManager.as has no {eq_name} — the model changed")
        body = setter_body(mcs, setter)

        touched: list[int] = []
        for m in re.finditer(r'partList\[PART_(\w+)\]', body):
            part = m.group(1)
            if part not in parts:
                die(f"{setter}: writes unknown PART_{part}")
            if parts[part] not in touched:
                touched.append(parts[part])
        if not touched:
            die(f"{setter}: writes no part at all — grammar changed")

        prefixes = sorted(set(re.findall(r'getMCSComponent\("(\w+)"', body)))
        if not prefixes:
            die(f"{setter}: calls no getMCSComponent — art resolution changed")

        # `new foottop12000()` — the naked fallback classes, prefix + base item id.
        naked: list[tuple[str, int]] = []
        for m in re.finditer(r'new ([a-z_]+?)(\d{4,5})\(\)', body):
            pair = (m.group(1), int(m.group(2)))
            if pair not in naked:
                naked.append(pair)
        if not naked:
            die(f"{setter}: no naked fallback class — the default path changed")

        base_ids = sorted({i for _, i in naked})
        if len(base_ids) != 1:
            die(f"{setter}: naked fallbacks disagree on the base id: {naked}")

        rows.append(
            "  { equip: '" + eq_name + "', equipIndex: " + str(equips[eq_key])
            + ", setter: '" + setter + "'"
            + ", parts: [" + ", ".join(str(p) for p in sorted(touched)) + "]"
            + ", componentPrefixes: [" + ", ".join(f"'{p}'" for p in prefixes) + "]"
            + ", nakedBaseId: " + str(base_ids[0]) + " },"
        )

    # The explicit within-part z-order: `<part>.setChildIndex(<what>, N)`.
    # Anything NOT pinned here is a plain addChild and therefore lands in FRONT
    # of everything that is pinned.
    # Attribute every pin to the setter it sits in, so `componentObject` — a
    # decompiler local that names nothing — resolves to the art it actually is.
    setter_spans = sorted(
        (m.start(), m.group(1))
        for m in re.finditer(r'public function (\w+)\s*\(', mcs)
    )

    def enclosing_setter(pos: int) -> str:
        found = "<none>"
        for start, name in setter_spans:
            if start <= pos:
                found = name
            else:
                break
        return found

    pinned: list[str] = []
    seen: set[tuple[int, int]] = set()
    for m in re.finditer(r'(\w+)\.setChildIndex\((?:this\.)?(\w+)\s*,\s*(\d+)\)', mcs):
        holder, what, idx = m.group(1), m.group(2), int(m.group(3))
        if holder not in parts:
            die(f"setChildIndex on `{holder}`, which is not a PART_ name")
        setter = enclosing_setter(m.start())
        if what == "componentObject":
            # The generic local: name it by the LAST thing assigned to it before
            # this call. `setShoes` assigns foottop then foot, so the setter's
            # prefix list alone cannot disambiguate — position can.
            before = mcs[:m.start()]
            # `var componentObject:MovieClip = this.getMCS…` in some setters and a
            # bare re-assignment in others — the type annotation is optional.
            assigns = re.findall(
                r'componentObject(?::\w+)? = this\.getMCSComponent\("(\w+)"', before
            )
            if not assigns:
                die(f"{setter}: `componentObject` pinned before it is ever assigned")
            what = assigns[-1]
        key = (parts[holder], idx)
        if key in seen:
            continue
        seen.add(key)
        pinned.append(
            "  { part: " + str(parts[holder]) + ", partName: '" + holder
            + "', child: '" + what + "', childIndex: " + str(idx)
            + ", setter: '" + setter + "' },"
        )
    if not pinned:
        die("no setChildIndex calls found — the within-part z-order is the whole point")
    pinned.sort(key=lambda r: (int(r.split("part: ")[1].split(",")[0]),
                               int(r.split("childIndex: ")[1].split(",")[0])))

    part_rows = "\n".join(
        f"  '{by_index[i]}'," for i in range(len(by_index))
    )

    body_ts = f'''/**
 * OG_COMPOSITING — the original's paperdoll compositing contract, TRANSCRIBED
 * (lane L3, compositing half). Generated by
 * `scripts/payload/transcribeCompositing.py` from the payload's own
 * `MCSCharacter.as` + `StatsManager.as`; NEVER hand-keyed. Byte-checked against
 * the source by `tests/ogCompositing.test.ts` using an INDEPENDENT parser.
 *
 * ONE equipment slot dresses MANY part slots — `setArmor` writes eight of them —
 * so the "9 equip boxes / 12 rendered / 13-slot model" numbers (GAUNTLET.md
 * §2.2) and the {len(by_index)} PART slots are related by THIS MAP, not by counting.
 *
 * ⚠️ ART IS RESOLVED BY NAME AND WE DO NOT HOLD IT. The OG calls
 * `getMCSComponent(prefix, itemId)` for a symbol like `torso4085` and falls back
 * to a naked class (`new torso4000()`). Those symbols live in the CDN-hosted
 * asset SWFs that died with the studio. This contract is therefore portable and
 * complete; the 982 items' ART is not, and the repo renders only what it has
 * traced by hand. Recording the contract is this lane's job; inventing the art
 * is not.
 *
 * ⚠️ Z-ORDER IS FLASH DISPLAY-LIST ORDER: child index 0 is the BACK. A part not
 * named in `OG_WITHIN_PART_Z` is added with a plain `addChild`, so it lands in
 * FRONT of every pinned child of that part.
 *
 * ⚠️ C2 — this is the ANDROID build (v0.682); no web-side artifact corroborates
 * it yet (GAUNTLET.md §2.1).
 *
 * DO NOT EDIT BY HAND — re-run the transcriber.
 */

/** Part slot names, INDEXED BY SLOT — so the index is the creation/z-order. */
export const OG_PART_NAMES: readonly string[] = [
{part_rows}
];

/** One equipment slot's dressing contract. */
export interface OgEquipSlot {{
  /** The `StatsManager` constant name, verbatim. */
  readonly equip: string;
  /** Its index in the 13-wide equipment vector. */
  readonly equipIndex: number;
  /** The `MCSCharacter` method that dresses it, verbatim. */
  readonly setter: string;
  /** Every PART slot this equipment slot writes, ascending (= back to front). */
  readonly parts: readonly number[];
  /** The `getMCSComponent` prefixes it looks symbols up by. */
  readonly componentPrefixes: readonly string[];
  /** The item id whose art is the naked fallback for this slot. */
  readonly nakedBaseId: number;
}}

/**
 * The map. EQ_ACCESSORY1/EQ_ACCESSORY2 are absent ON PURPOSE — they are
 * equipped and stat-granting but the renderer never receives them, so they
 * dress no part (GAUNTLET.md §2.2). Their absence is asserted by the test.
 */
export const OG_EQUIP_SLOTS: readonly OgEquipSlot[] = [
{chr(10).join(rows)}
];

/** A child whose depth inside its part is pinned EXPLICITLY by the source. */
export interface OgWithinPartZ {{
  readonly part: number;
  readonly partName: string;
  /** What lands at this depth. `componentObject` is resolved to the setter's own
   *  `getMCSComponent` prefix, because the decompiler's local name says nothing. */
  readonly child: string;
  /** Flash display-list depth. 0 is the BACK. */
  readonly childIndex: number;
  /** The `MCSCharacter` method that pins it, verbatim. */
  readonly setter: string;
}}

/**
 * Explicit `setChildIndex` calls — the within-part z-order that was INFERRED in
 * `ogPose.ts` until this transcription. Two consequences, both load-bearing:
 *
 *   - part 16 (head): head 0 · headMask 1 · hatHair 2 · hair 3, back to front.
 *     ✅ CONFIRMS the old inference "head before hair".
 *   - parts 7 and 11 (calf): the SHOES' `foottop` is pinned to 0 (BACK) and the
 *     PANTS' `calf` is a plain addChild (FRONT). ⛔ REVERSES the old inference
 *     "calf before foottop". Because the index is pinned, the order does not
 *     depend on which setter runs first.
 */
export const OG_WITHIN_PART_Z: readonly OgWithinPartZ[] = [
{chr(10).join(pinned)}
];
'''
    OUT.write_text(body_ts)
    print(f"transcribeCompositing: wrote {OUT}")
    print(f"  part slots        {len(by_index)}")
    print(f"  equipment slots   {len(equips)} ({len(rows)} dress parts, {len(equips) - len(rows)} render-only-absent)")
    print(f"  pinned z-indices  {len(pinned)}")


if __name__ == "__main__":
    main()
