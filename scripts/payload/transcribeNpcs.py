#!/usr/bin/env python3
"""THE NPC TRANSCRIBER (lane L4a) — npcdata.xml -> committed config.

Reads the payload's own `npcdata.xml` and emits `src/config/ogNpcs.ts` VERBATIM:
every number is the source's own, no interpretation, no rounding, no hand-keying.
GAUNTLET.md §2 — "a script beats a swarm": this is a deterministic transform, so
it gets a generator and a byte-check, never a fan-out. Same shape as
`scripts/payload/transcribeItems.py`, with FOUR deliberate deviations named below.

Grammar (probed 2026-09-06, re-measured 2026-09-07, re-confirmed 2026-09-08 —
495 <npc> rows, 32 distinct tag names, 35 path-qualified positions, 29 leaf
positions, nesting 4 deep, zero attributes, zero non-ASCII, zero comments/CDATA/PI,
9,621 CRLF **and 4 bare LF**, 5 empty leaves — all of them <mcs>):

  <npcdata>
    <npc>                       495  ids 0..819, all distinct, NOT sorted, NOT contiguous
      <id>N</id>                495  the primary key. ⚠️ <id> IS AT THREE DEPTHS.
      <name>ID</name>           490  string-table id 5000..5122, NOT a display string
      <lvl>N</lvl>              402  1..80    ⚠️ THE NPC'S OWN — see the depth trap
      <hp>N</hp>                403  1..1000  (92 absent — non-combat NPCs, not 0 HP)
      <ai>N</ai>                425  1..37    (70 absent MEANS 1, not "no AI")
      <attack>N</attack>        406  1..7092
      <defense>N</defense>      394  0..200
      <scalex>/<scaley>       16/16  FLOAT: 0.95 0.99 1 1.1 1.3 2 — there is a 2x giant
      <earth>/<fire>            3/1  both value 10; the elements belong to L11
      <mcs>                     495  the paperdoll, in EQ INDEX ORDER (GAUNTLET §2.2).
        armor gloves hair hat head mask neck pants prop1 prop2 shoes weapon
                              3,210  slot values · 741 comma-LISTS · 193 exactly "0"
      <skills>                   96
        <skill>                 647
          <id>N</id>            647  1000..1501, 39 distinct, all resolve in ogSkills.ts
          <lvl>N</lvl>          647  1..10   ⚠️ NOT the NPC's level
      <reward>                   66
        <loot>                  131
          <id>N</id>            131  0..3 = SENTINEL SPACE, else an item id
          <qty>N</qty>          131  1,2,3,5
          <chance>N</chance>    131  FLOAT on 119 of 131

FOUR DELIBERATE DEVIATIONS from transcribeItems.py — each one is a trap that
cost a measurement to find:

  1. AN EMPTY CONTAINER IS LEGAL, AN EMPTY LEAF IS NOT. itemdata had zero empty
     tags so its text() dies on one. npcdata has 5 — <mcs></mcs> on npc ids
     64/158/192/193/194. Copying that rule verbatim kills the run on legitimate
     data. Present-but-empty != absent: all 495 rows HAVE an <mcs>; 5 are empty
     paperdolls. Leaves still die on empty.

  2. <mcs> SLOT VALUES STAY VERBATIM STRINGS, never parsed to a number.
     741 of 3,210 are comma-separated lists and `0` means empty.
     `MCSCharacter.as:573-578` picks ONE uniformly at spawn:
        internal function processString(xmlstring:String) : int {
           var selectArray:Array = new Array();
           selectArray = xmlstring.split(",");
           return selectArray[int(Math.random() * selectArray.length)];
        }
     Collapsing a list here would bake in one roll of a die the game re-rolls at
     every spawn. THE LISTS ARE WEIGHTED POOLS, NOT SETS — 28 of the 741 repeat
     an element (npc 55's hat list is eleven `0`s of 22 entries, i.e. "no hat" is
     exactly 50%), and processString picks BY INDEX, so de-duplicating or sorting
     changes the odds. Duplicates and order are preserved.

  3. FLOATS ARE FLOATS. <scalex>/<scaley> (16 rows, up to a 2x giant) and
     <chance> (FLOAT on 119 of 131) are emitted with the source's own text. An
     int() on scale destroys the roster's only size variation; an int() on chance
     zeroes 119 of 131 drop rates.

  4. TWO SOURCE ANOMALIES, NOT ONE, AND BOTH LIVE INSIDE A LIST.
     `6015.6017` — a period where a comma belongs — appears 355x, and it is in
     the SHIPPED GAME'S OWN AS3 too (`XMLNpc.as:460` literally writes
     `hairlist = [...,6014,6015.6017,6018,6019]`, so that array silently has one
     fewer element and a float where an int belongs). The 356th dot-bearing
     <hair> value is a SECOND, DIFFERENT anomaly: `6.5006501650265E+47` on npc 55.
     Because slot values stay strings, NOTHING is coerced and NOTHING is dropped —
     the raw text survives in the row. The 356 occurrences are ALSO recorded in
     OG_NPC_SOURCE_ANOMALIES, which the byte-check pins exactly, so a THIRD
     anomaly turns the suite red instead of vanishing.

TWO RULINGS CARRIED IN, settled first-hand 2026-09-07 — not re-derived here:
  - `<ai>` DEFAULTS TO 1. `XMLNpc.as:135-141`:
        if(xml.ai.toString() != "") { this.ai = xml.ai; } else { this.ai = 1; }
    The 70 rows with no <ai> are EnemyKnife. This emits BOTH facts: `ai` is
    absent exactly where the source is silent, and `aiEffective` is always
    present. Emitting only one of the two would be a lie either way.
  - LOOT IDS 0-3 ARE A SENTINEL SPACE, not item ids (`NPC.as:837-855`):
    0 -> 1 coin x qty · 1 -> 5 coins x qty · 2 -> the quest loot item ·
    3 -> a random item at the NPC's level · else -> the item id. `XMLLoot.as`
    types `id` as String. That is why 0/1/2/3 do not resolve against OG_ITEMS
    while 2112/2113/2114/20028 do.

Names are resolved through `docs/gauntlet/L0/index/resolved_names.json`
(484 of 490 named rows, 6 MISSES — all the SAME string id 5017, on npc ids
50-55). "Unnamed" and "name we could not resolve" are DIFFERENT FACTS and are
kept apart: 5 rows carry no <name> tag at all (ids 0, 47, 160, 801, 819), 6
carry one that the string table has no entry for.

⚠️ C2 — the four data XMLs are the ANDROID build; the web payload carries no
<npcdata> root. Every row here is v0.682 until a web-side artifact says
otherwise (GAUNTLET.md §2.1). The generated header repeats this.

Usage:  python3 scripts/payload/transcribeNpcs.py [SRC_XML] [OUT_TS]
Writes: src/config/ogNpcs.ts   (fails loudly on any grammar surprise)

The two optional paths exist so the CHAOS-PLANT can point this at a mutated COPY
of the payload and watch it die, without ever writing to the gitignored reference
material. Normal runs take no arguments.
"""

from __future__ import annotations

import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
NAMES = REPO / "docs" / "gauntlet" / "L0" / "index" / "resolved_names.json"
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else REPO / "reference" / "extracted" / "npcdata.xml"
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else REPO / "src" / "config" / "ogNpcs.ts"

# The NPC's own scalar fields, in the order they are EMITTED. `mcs`, `skills` and
# `reward` are not here: they nest, so they are walked separately.
INT_FIELDS: tuple[tuple[str, str], ...] = (
    ("name", "nameId"),
    ("lvl", "lvl"),
    ("hp", "hp"),
    ("ai", "ai"),
    ("attack", "attack"),
    ("defense", "defense"),
    ("earth", "earth"),
    ("fire", "fire"),
)
# FLOAT, never int() — see deviation 3.
FLOAT_FIELDS: tuple[tuple[str, str], ...] = (("scalex", "scalex"), ("scaley", "scaley"))

# The emit order for one row — identical to the `OgNpc` interface's declaration order.
EMIT_ORDER: tuple[str, ...] = (
    "id", "nameId", "name", "lvl", "hp", "ai", "aiEffective", "attack", "defense",
    "scalex", "scaley", "earth", "fire", "mcs", "skills", "loot",
)

# The 12 paperdoll slots, in the EQ INDEX ORDER `MCSCharacter.initMCS` takes them
# (GAUNTLET.md §2.2). This tuple IS the emit order, so the committed rows read in
# the same order as the source and as the renderer's parameter list.
MCS_SLOTS: tuple[str, ...] = (
    "armor", "gloves", "hair", "hat", "head", "mask",
    "neck", "pants", "prop1", "prop2", "shoes", "weapon",
)

NPC_TAGS = (
    {"id", "mcs", "skills", "reward"}
    | {tag for tag, _ in INT_FIELDS}
    | {tag for tag, _ in FLOAT_FIELDS}
)
SKILL_TAGS = {"id", "lvl"}
LOOT_TAGS = {"id", "qty", "chance"}
INTEGER = re.compile(r"-?\d+$")


def die(msg: str) -> None:
    sys.exit(f"transcribeNpcs: {msg}")


def text(node: ET.Element, tag: str) -> str | None:
    """The tag's text, or None when absent. DIES on an empty LEAF.

    Deviation 1: the 5 empty tags in npcdata are all <mcs>, a CONTAINER, which is
    walked by `mcs_of()` and never reaches here. An empty *leaf* is still a grammar
    change, and silently mapping one to "absent" is the exact class of drop that
    nearly cost L2 its skill tree.
    """
    found = node.findall(tag)
    if len(found) > 1:
        die(f"tag <{tag}> appears {len(found)}x on one row — no NPC scalar may repeat")
    if not found:
        return None
    if len(found[0]) > 0:
        die(f"tag <{tag}> has CHILDREN — its data is not in .text; grammar changed")
    raw = (found[0].text or "").strip()
    if raw == "":
        die(f"tag <{tag}> is an EMPTY LEAF — only <mcs> may be empty; grammar changed")
    return raw


def as_int(raw: str, where: str) -> int:
    if not INTEGER.match(raw):
        die(f"{where}: {raw!r} is not an integer")
    return int(raw)


def as_float(raw: str, where: str) -> str:
    """The source's own float TEXT, validated but not reformatted."""
    try:
        float(raw)
    except ValueError:
        die(f"{where}: {raw!r} is not a number")
    return raw


def ts_str(s: str) -> str:
    """A TypeScript single-quoted literal."""
    return (
        "'"
        + s.replace("\\", "\\\\").replace("'", "\\'").replace("\r", "").replace("\n", "\\n")
        + "'"
    )


HEADER = """/**
 * OG_NPCS — the original's enemy roster, TRANSCRIBED (lane L4a; 495 NPCs,
 * 3,210 paperdoll slot values, 647 skill rows, 131 loot rows). Generated by
 * `scripts/payload/transcribeNpcs.py` from `reference/extracted/npcdata.xml`;
 * NEVER hand-keyed. Byte-checked against the source by `tests/ogNpcData.test.ts`
 * using an INDEPENDENT parser.
 *
 * Every value is CONTRACT-SRC — the payload's own number, verbatim. Absent fields
 * are ABSENT IN THE SOURCE and are never defaulted.
 *
 * Seven shapes a reasonable reader gets wrong:
 *
 *   1. `ai` ABSENT MEANS 1, NOT "NO AI". `XMLNpc.as:135-141` reads
 *      `if(xml.ai.toString() != "") { this.ai = xml.ai } else { this.ai = 1 }`.
 *      The 70 rows with no `<ai>` are EnemyKnife. Both facts are kept: `ai` is
 *      absent exactly where the source is silent, `aiEffective` is always present.
 *   2. `lvl` IS THE NPC'S OWN. The source has 1,049 `<lvl>` tags at TWO depths —
 *      402 here and 647 inside `<skills><skill>`. A depth-blind read would put a
 *      skill's rank in the enemy's level. 414 rows contain a `<lvl>` at some depth
 *      but only 402 own one, so 12 rows have a skill level and no NPC level.
 *   3. `mcs` SLOTS ARE STRINGS, AND 741 OF 3,210 ARE COMMA-SEPARATED LISTS.
 *      `MCSCharacter.as:573-578` (`processString`) splits on ',' and picks ONE
 *      UNIFORMLY AT RANDOM, once, at spawn — so a slot is a POOL, not an id.
 *      They are WEIGHTED pools: 28 lists repeat an element (npc 55's hat list is
 *      eleven `0`s of 22 entries — "no hat" is exactly 50%) and the pick is BY
 *      INDEX, so duplicates and order are load-bearing and are preserved.
 *      `0` means empty. ⚠️ `processString` uses `Math.random()` while
 *      `XMLNpc.as:561` uses the SEEDED `rng.rand()` for the same kind of choice —
 *      two different sources, which matters the day paperdolls must be reproducible.
 *   4. `hp`/`attack`/`defense` ARE BASE VALUES, and 92 rows have no `hp` at all
 *      (non-combat NPCs — absent is not zero). `src/core/enemyModel.ts` is CONTRACT
 *      and recomputes a named duellist's HP at spawn from the PLAYER's stats
 *      (`enemyHP = max(scaledBaseHP, effPlayerDmg x K)`, `K = max(10+delta, 3)`).
 *      Porting these is NOT a licence to start using the raw `hp`.
 *   5. LOOT IDS 0-3 ARE A SENTINEL SPACE, not item ids (`NPC.as:837-855`):
 *      0 -> 1 coin x qty · 1 -> 5 coins x qty · 2 -> the quest loot item ·
 *      3 -> a random item at the NPC's level · anything else -> the item id.
 *      That is why 0/1/2/3 do not resolve against `OG_ITEMS` and 2112/2113/2114/
 *      20028 do. `chance` is a FLOAT on 119 of 131 rows.
 *   6. IDS ARE NEITHER SORTED NOR CONTIGUOUS — 495 distinct spanning 0..819, and
 *      807 sits between 197 and 201. INDEX IS NOT ID. Rows are committed in SOURCE
 *      ORDER and the byte-check pairs row i with source block i.
 *   7. "UNNAMED" AND "UNRESOLVED" ARE DIFFERENT FACTS. 5 rows carry no `<name>`
 *      tag at all (ids 0, 47, 160, 801, 819); 6 carry a `nameId` the string table
 *      has no entry for — all six the SAME id 5017, on npc ids 50-55. Those six
 *      keep their `nameId` and get no `name`. L3 already proved that confusing the
 *      two costs a session.
 *
 * `nameId` is a string-table id (the source's own number); `name` is that id
 * resolved through `docs/gauntlet/L0/index/resolved_names.json` (484 of 490).
 *
 * ⚠️ C2 — this is the ANDROID build (v0.682). The web payload carries no
 * <npcdata> root, so no web-side artifact corroborates these rows yet
 * (GAUNTLET.md §2.1). Treat as v0.682 until one does.
 *
 * ⛔ THIS TABLE IS NOT WIRED INTO THE DUEL. Doing that moves `src/core/Sim.ts` and
 * `tests/duel-baseline.test.ts`, which are GAUNTLET.md §4's no-touch list and belong
 * to L5 alone. `AI_TIERS` in `src/config/ai.ts` remains the hand-authored stand-in;
 * see DIVERGENCES.md.
 *
 * DO NOT EDIT BY HAND — re-run the transcriber.
 */

/**
 * One paperdoll slot pool, VERBATIM. Every value is the source's own TEXT, because
 * 741 of 3,210 are comma-separated lists that `processString` re-rolls at every
 * spawn (`MCSCharacter.as:573-578`) and 193 are exactly `'0'`, meaning empty.
 * Split on ',' at USE time; never at transcribe time.
 */
export interface OgNpcMcs {
  readonly armor?: string;
  readonly gloves?: string;
  readonly hair?: string;
  readonly hat?: string;
  readonly head?: string;
  readonly mask?: string;
  readonly neck?: string;
  readonly pants?: string;
  /** `prop1` IS THE SCABBARD — `XMLNpc.as:398` writes EQ_SCABBARD into it (GAUNTLET §2.2). */
  readonly prop1?: string;
  readonly prop2?: string;
  readonly shoes?: string;
  readonly weapon?: string;
}

/** One learned skill. `lvl` is the SKILL's rank (1..10), never the NPC's level. */
export interface OgNpcSkill {
  readonly id: number;
  readonly lvl: number;
}

/**
 * One loot row. `id` 0..3 is a SENTINEL, not an item id (`NPC.as:837-855`):
 * 0 = 1 coin x qty, 1 = 5 coins x qty, 2 = the quest loot item, 3 = a random
 * item at the NPC's level. Anything else is an `OG_ITEMS` id.
 * `chance` is a FLOAT on 119 of 131 rows.
 */
export interface OgNpcLoot {
  readonly id: number;
  readonly qty: number;
  readonly chance: number;
}

/** One NPC. Optional fields are absent in the source, never defaulted. */
export interface OgNpc {
  readonly id: number;
  /** String-table id, not a display string. Absent on 5 rows. */
  readonly nameId?: number;
  /** Resolved via resolved_names.json. Absent on 11 rows: 5 unnamed + 6 unresolved. */
  readonly name?: string;
  /** THE NPC'S OWN level (1..80). Absent on 93 rows. */
  readonly lvl?: number;
  /** BASE hp (1..1000). Absent on 92 non-combat rows — absent is not zero. */
  readonly hp?: number;
  /** The source's own `<ai>`, ABSENT on 70 rows. Read `aiEffective` to dispatch. */
  readonly ai?: number;
  /** `ai ?? 1` — the value `XMLNpc.as:135-141` actually hands the dispatcher. */
  readonly aiEffective: number;
  readonly attack?: number;
  readonly defense?: number;
  /** FLOAT. 16 rows scale; there is a 2x giant. */
  readonly scalex?: number;
  readonly scaley?: number;
  /** Value 10 on 3 rows / 1 row. The elements belong to L11 — recorded, not built. */
  readonly earth?: number;
  readonly fire?: number;
  /** ALWAYS PRESENT — all 495 rows carry an `<mcs>`. 5 are EMPTY paperdolls (ids 64, 158, 192, 193, 194). */
  readonly mcs: OgNpcMcs;
  /** Source order preserved. 647 rows across 96 NPCs. */
  readonly skills?: readonly OgNpcSkill[];
  /** Source order preserved. 131 rows across 66 NPCs. */
  readonly loot?: readonly OgNpcLoot[];
}

/**
 * A source value that is NOT an integer where one belongs, recorded verbatim.
 * Unlike `OG_ITEM_SOURCE_ANOMALIES`, NOTHING is omitted from the row: `mcs` slots
 * are strings, so the raw text survives in `OG_NPCS` untouched. This ledger exists
 * so the byte-check can pin the anomaly set EXACTLY — a THIRD one appearing in the
 * source turns the suite red instead of being silently normalised.
 *
 * There are exactly TWO distinct values across 356 occurrences:
 *   - `6015.6017` (355x) — a period where a comma belongs, and it is in the
 *     SHIPPED GAME'S OWN AS3: `XMLNpc.as:460` writes
 *     `hairlist = [6000,...,6014,6015.6017,6018,6019]`, so that array silently has
 *     one fewer element and a Number where an int belongs.
 *   - `6.5006501650265E+47` (1x) — npc 55's `<hair>`, a different anomaly entirely.
 * Neither is coerced, "fixed", or `float()`-ed.
 */
export interface OgNpcSourceAnomaly {
  readonly npcId: number;
  readonly slot: string;
  readonly raw: string;
}
"""


def main() -> None:
    if not SRC.exists():
        die(f"missing {SRC} — the reference payload is gitignored; see docs/RECOVERY.md")
    if not NAMES.exists():
        die(f"missing {NAMES}")

    root = ET.parse(SRC).getroot()
    if root.tag != "npcdata":
        die(f"root is <{root.tag}>, expected <npcdata>")

    # CLOSED VOCABULARY, checked RECURSIVELY and FIRST. This is the assertion that
    # caught L2's <req> tree — a tag the generator never walked. Dying on any unknown
    # tag ANYWHERE is the guard; a deeper hand-written walk is not.
    known = (
        NPC_TAGS
        | {"npcdata", "npc", "skill", "loot"}
        | SKILL_TAGS
        | LOOT_TAGS
        | set(MCS_SLOTS)
    )
    for node in root.iter():
        if node.tag not in known:
            die(f"unknown tag <{node.tag}> — grammar changed, do not guess")
        if node.attrib:
            die(f"<{node.tag}> carries attributes {node.attrib} — the source had none")

    resolved: dict[str, dict[str, str]] = json.loads(NAMES.read_text())["npcdata.xml"]["resolved"]

    rows: list[str] = []
    anomalies: list[tuple[int, str, str]] = []
    seen_ids: set[int] = set()
    n_slots = n_lists = n_skills = n_loot = n_named = 0

    for npc in root:
        if npc.tag != "npc":
            die(f"unexpected child <{npc.tag}> under <npcdata>")
        for child in npc:
            if child.tag not in NPC_TAGS:
                die(f"unknown npc field <{child.tag}> — grammar changed, do not guess")

        raw_id = text(npc, "id")
        if raw_id is None:
            die("an <npc> has no <id>")
        nid = as_int(raw_id, "npc id")
        if nid in seen_ids:
            die(f"duplicate npc id {nid}")
        seen_ids.add(nid)

        # Collected by key, then emitted in EMIT_ORDER, so the committed rows read in
        # the same order the `OgNpc` interface declares its fields.
        got: dict[str, str] = {"id": str(nid)}
        for tag, key in INT_FIELDS:
            raw = text(npc, tag)
            if raw is not None:
                got[key] = str(as_int(raw, f"npc {nid} <{tag}>"))
        for tag, key in FLOAT_FIELDS:
            raw = text(npc, tag)
            if raw is not None:
                got[key] = as_float(raw, f"npc {nid} <{tag}>")

        # `ai` absent MEANS 1 (XMLNpc.as:135-141) — emitted as a SECOND field so the
        # source's own silence stays visible beside the value the game actually uses.
        got["aiEffective"] = got.get("ai", "1")

        name = resolved.get(raw_id, {}).get("name")
        if name is not None:
            got["name"] = ts_str(name)
            n_named += 1

        # <mcs> — a CONTAINER, and 5 of them are legitimately EMPTY (deviation 1).
        mcs = npc.find("mcs")
        if mcs is None:
            die(f"npc {nid} has no <mcs> — all 495 rows carry one")
        slot_text: dict[str, str] = {}
        for slot in mcs:
            if slot.tag not in MCS_SLOTS:
                die(f"npc {nid}: unknown <mcs> slot <{slot.tag}>")
            if slot.tag in slot_text:
                die(f"npc {nid}: <mcs> slot <{slot.tag}> repeats")
            if len(slot) > 0:
                die(f"npc {nid}: <mcs> slot <{slot.tag}> has CHILDREN; grammar changed")
            value = (slot.text or "").strip()
            if value == "":
                die(f"npc {nid}: <mcs> slot <{slot.tag}> is EMPTY — a slot is never blank")
            slot_text[slot.tag] = value
            n_slots += 1
            if "," in value:
                n_lists += 1
            # NOT coerced and NOT dropped — the raw text stays in the row, and every
            # non-integer element is ALSO logged (see OG_NPC_SOURCE_ANOMALIES).
            for part in value.split(","):
                if not INTEGER.match(part):
                    anomalies.append((nid, slot.tag, part))
        # Emitted in EQ INDEX ORDER, not in the order this row happened to serialise.
        mcs_ts = ", ".join(
            f"{s}: {ts_str(slot_text[s])}" for s in MCS_SLOTS if s in slot_text
        )
        got["mcs"] = ("{ " + mcs_ts + " }") if mcs_ts else "{}"

        # <skills>/<skill> — carries its data in CHILDREN and REPEATS. Its <lvl> is
        # the SKILL's rank; reading it as the NPC's level is trap 1.
        skills = npc.find("skills")
        if skills is not None:
            parts: list[str] = []
            for skill in skills:
                if skill.tag != "skill":
                    die(f"npc {nid}: unexpected <{skill.tag}> under <skills>")
                for child in skill:
                    if child.tag not in SKILL_TAGS:
                        die(f"npc {nid}: unknown skill field <{child.tag}>")
                sid = text(skill, "id")
                slvl = text(skill, "lvl")
                if sid is None or slvl is None:
                    die(f"npc {nid}: a <skill> is missing <id> or <lvl>")
                parts.append(
                    "{ id: "
                    + str(as_int(sid, f"npc {nid} skill id"))
                    + ", lvl: "
                    + str(as_int(slvl, f"npc {nid} skill lvl"))
                    + " }"
                )
                n_skills += 1
            if not parts:
                die(f"npc {nid}: <skills> is present but holds no <skill>")
            got["skills"] = "[" + ", ".join(parts) + "]"

        # <reward>/<loot> — <chance> is a FLOAT on 119 of 131 rows (deviation 3).
        reward = npc.find("reward")
        if reward is not None:
            parts = []
            for loot in reward:
                if loot.tag != "loot":
                    die(f"npc {nid}: unexpected <{loot.tag}> under <reward>")
                for child in loot:
                    if child.tag not in LOOT_TAGS:
                        die(f"npc {nid}: unknown loot field <{child.tag}>")
                lid, lqty, lch = text(loot, "id"), text(loot, "qty"), text(loot, "chance")
                if lid is None or lqty is None or lch is None:
                    die(f"npc {nid}: a <loot> is missing <id>, <qty> or <chance>")
                parts.append(
                    "{ id: "
                    + str(as_int(lid, f"npc {nid} loot id"))
                    + ", qty: "
                    + str(as_int(lqty, f"npc {nid} loot qty"))
                    + ", chance: "
                    + as_float(lch, f"npc {nid} loot chance")
                    + " }"
                )
                n_loot += 1
            if not parts:
                die(f"npc {nid}: <reward> is present but holds no <loot>")
            got["loot"] = "[" + ", ".join(parts) + "]"

        rows.append(
            "  { " + ", ".join(f"{k}: {got[k]}" for k in EMIT_ORDER if k in got) + " },"
        )

    # Referential integrity, asserted at generation. Both facts were measured; either
    # breaking means these tables are not what this transcriber says they are, so it
    # dies rather than emitting a config that lies.
    if len(seen_ids) != 495:
        die(f"{len(seen_ids)} distinct npc ids, expected 495")
    ai_seen = {
        as_int(t, "ai") for t in (text(n, "ai") for n in root) if t is not None
    }
    if not ai_seen <= set(range(0, 38)):
        die(f"<ai> values outside the 0..37 dispatch space: {sorted(ai_seen - set(range(38)))}")

    anomaly_rows = "\n".join(
        f"  {{ npcId: {i}, slot: '{s}', raw: {ts_str(r)} }}," for i, s, r in anomalies
    )

    body = "\n".join(
        [
            HEADER,
            "export const OG_NPC_SOURCE_ANOMALIES: readonly OgNpcSourceAnomaly[] = [",
            anomaly_rows,
            "];",
            "",
            "export const OG_NPCS: readonly OgNpc[] = [",
            *rows,
            "];",
            "",
        ]
    )
    OUT.write_text(body)

    print(f"transcribeNpcs: wrote {OUT}")
    print(f"  npcs        {len(rows)}")
    print(f"  mcs slots   {n_slots}  ({n_lists} comma-lists)")
    print(f"  skills      {n_skills}")
    print(f"  loot        {n_loot}")
    print(f"  named       {n_named}")
    print(f"  anomalies   {len(anomalies)}  distinct={sorted({a[2] for a in anomalies})}")


if __name__ == "__main__":
    main()
