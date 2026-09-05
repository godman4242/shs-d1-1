#!/usr/bin/env python3
"""THE ITEM TRANSCRIBER (lane L3) — itemdata.xml -> committed config.

Reads the payload's own `itemdata.xml` and emits `src/config/ogItems.ts`
VERBATIM: every number is the source's own, no interpretation, no rounding,
no hand-keying. GAUNTLET.md §2 — "a script beats a swarm": this is a
deterministic transform, so it gets a generator and a byte-check, never a
fan-out. Same shape as `scripts/payload/transcribeSkills.py` (91c6010).

Grammar (probed 2026-09-05, all 982 items — 21 FIELD POSITIONS (19 under <item>
plus <modifier>/<id> and <modifier>/<value>), 22 distinct tag names, 23 distinct
path-qualified positions; nesting ONLY under <item> and <modifier>, max depth 3,
zero attributes, zero comments/CDATA/PIs, CRLF throughout, zero non-ASCII):

  <itemdata>
    <item>
      <id>N</id>                982 — always present, all 982 distinct
      <type>1..12</type>        829 — the paperdoll slot; ABSENT on the 4k
                                      "armor" band (152 items) and on 7075
      <name>ID</name>           804 — string-table id, NOT a display string
      <baseprice>N</baseprice>  550 — ⚠️ 549 integers and ONE literal '.'
                                      (item 11037). See ANOMALIES below.
      <heavenlyprice>N</…>      304
      <weight>N</weight>        745
      <desc>ID</desc>           178 — string-table id
      <minlvl>N</minlvl>        155 — ⚠️ 13 are NEGATIVE (down to -4)
      <mindamage>N</mindamage>  158
      <maxdamage>N</maxdamage>  158
      <defense>N</defense>      371
      <uses>N</uses>            115 — only 50/60/80/100
      <slashusage>N</…>         106 — only 24/72/96
      <stancerestriction>N</…>   53 — only 4/6
      <unique>N</unique>        369 — ⚠️ values 1 AND 2. NOT a boolean.
      <art>ID</art>             146 — ⚠️ an ITEM->ITEM pointer: all 68 distinct
                                      targets are item ids in this same file,
                                      and no target carries its own <art> (no
                                      alias chains). It means "render me using
                                      item X's artwork". 2130 is shared by 39.
      <nogive>1</nogive>         12
      <nodrop>1</nodrop>          7
      <modifier>                412 elements across only 93 ITEMS, up to 10 per
        <id>N</id>                    item. ⚠️ REPEATS, and its data is in
        <value>N</value>              CHILDREN — findtext() returns nothing and
      </modifier>                     find() returns 1 of 10. 319 carry
                                      <id>+<value>, 93 carry <id> only, and the
                                      id-only form is a property OF THE ID: 11
                                      of 34 ids are always id-only, the other
                                      23 always carry a value.

⚠️ TWO COINCIDENCE TRAPS in the counts above, both verified disjoint:
  - 412 modifiers live in 93 ITEMS, and 93 MODIFIER ELEMENTS are id-only.
    Different 93s.
  - 178 items have no <name>, and 178 items carry a <desc>. Different 178s —
    zero unnamed items have a desc. The unnamed are the base body/armor art
    (151 of the 178 are worn by an NPC paperdoll in npcdata.xml).

ANOMALIES. One source value is not a number: `<baseprice>.</baseprice>` on item
11037. It is NOT coerced (0 would invent a free item) and NOT dropped: the field
is omitted from the typed row and the raw text is preserved in
OG_ITEM_SOURCE_ANOMALIES, which the byte-check pins exactly. A SECOND anomaly
appearing in the source therefore turns the test red instead of vanishing.

Names/descriptions are resolved through `docs/gauntlet/L0/index/resolved_names.json`
(804 of 982 items, 0 misses; 178 of those also carry a desc).

⚠️ C2 — the four data XMLs are the ANDROID build; the web payload carries no
<itemdata> root. Every row here is v0.682 until a web-side artifact says
otherwise (GAUNTLET.md §2.1). The generated header repeats this.

Usage:  python3 scripts/payload/transcribeItems.py [SRC_XML] [OUT_TS]
Writes: src/config/ogItems.ts   (fails loudly on any grammar surprise)

The two optional paths exist so the CHAOS-PLANT can point this at a mutated COPY
of the payload and watch it die, without ever writing to the gitignored reference
material. Normal runs take no arguments.
"""

from __future__ import annotations

import json
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
NAMES = REPO / "docs" / "gauntlet" / "L0" / "index" / "resolved_names.json"
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else REPO / "reference" / "extracted" / "itemdata.xml"
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else REPO / "src" / "config" / "ogItems.ts"

# The 18 scalar item fields, in the order they are EMITTED. `modifier` is not here:
# it repeats and nests, so it is walked separately.
SCALAR_FIELDS: tuple[tuple[str, str], ...] = (
    ("type", "type"),
    ("name", "nameId"),
    ("desc", "descId"),
    ("baseprice", "baseprice"),
    ("heavenlyprice", "heavenlyprice"),
    ("weight", "weight"),
    ("minlvl", "minlvl"),
    ("mindamage", "mindamage"),
    ("maxdamage", "maxdamage"),
    ("defense", "defense"),
    ("uses", "uses"),
    ("slashusage", "slashusage"),
    ("stancerestriction", "stancerestriction"),
    ("unique", "unique"),
    ("art", "art"),
    ("nogive", "nogive"),
    ("nodrop", "nodrop"),
)
ITEM_TAGS = {"id"} | {tag for tag, _ in SCALAR_FIELDS} | {"modifier"}
MODIFIER_TAGS = {"id", "value"}


def die(msg: str) -> None:
    sys.exit(f"transcribeItems: {msg}")


def text(node: ET.Element, tag: str) -> str | None:
    """The tag's text, or None when absent.

    Unlike the skill transcriber this DIES on an empty tag rather than treating it
    as absent data: the probe found ZERO empty leaves in itemdata, so an empty one
    is a grammar change, not a known shape. Silently mapping it to "absent" is the
    exact class of drop that nearly cost L2 its skill tree.
    """
    found = node.findall(tag)
    if len(found) > 1:
        die(f"tag <{tag}> appears {len(found)}x — only <modifier> may repeat")
    if not found:
        return None
    if len(found[0]) > 0:
        die(f"tag <{tag}> has CHILDREN — its data is not in .text; grammar changed")
    raw = (found[0].text or "").strip()
    if raw == "":
        die(f"tag <{tag}> is EMPTY — itemdata had zero empty leaves; grammar changed")
    return raw


def as_int(raw: str, where: str) -> int:
    try:
        return int(raw)
    except ValueError:
        die(f"{where}: {raw!r} is not an integer")
    raise AssertionError("unreachable")


def ts_str(s: str) -> str:
    """A TypeScript single-quoted literal. 6 names carry an apostrophe, 12 a newline."""
    return (
        "'"
        + s.replace("\\", "\\\\").replace("'", "\\'").replace("\r", "").replace("\n", "\\n")
        + "'"
    )


HEADER = """/**
 * OG_ITEMS — the original's item table, TRANSCRIBED (lane L3, 982 items /
 * 412 modifier rows). Generated by `scripts/payload/transcribeItems.py` from
 * `reference/extracted/itemdata.xml`; NEVER hand-keyed. Byte-checked against the
 * source by `tests/ogItemData.test.ts` using an INDEPENDENT parser.
 *
 * Every value is CONTRACT-SRC — the payload's own number, verbatim. Absent fields
 * are ABSENT IN THE SOURCE and are never defaulted; the source has zero empty tags,
 * so the generator DIES on one rather than reading it as absent.
 *
 * Four shapes that a reasonable reader gets wrong:
 *
 *   1. `unique` is NOT a boolean — the source uses 1 (253x) and 2 (116x).
 *   2. `art` is an ITEM -> ITEM pointer, not a sprite id. All 68 distinct targets
 *      are item ids in this same table and none carries its own `art` (no chains).
 *      It means "render me using item X's artwork"; 2130 is shared by 39 items.
 *   3. `minlvl` is NEGATIVE on 13 rows (to -4). Recorded, no meaning attached.
 *   4. `modifiers` repeats up to 10x per item, 412 rows across only 93 items, and
 *      93 of those rows carry an `id` with NO `value`. That is a property of the
 *      id: 11 of the 34 ids are always id-only, the other 23 always carry a value.
 *      The id-space is UNMAPPED — this table records it and attaches no meaning.
 *
 * `nameId`/`descId` are string-table ids (the source's own numbers); `name`/`desc`
 * are those ids resolved through `docs/gauntlet/L0/index/resolved_names.json`
 * (804 of 982 named, 0 misses). The 178 items with no `name` are not junk: they are
 * base body/armor art, and 151 of them are worn by an NPC paperdoll in `npcdata.xml`.
 *
 * ⚠️ C2 — this is the ANDROID build (v0.682). The web payload carries no
 * <itemdata> root, so no web-side artifact corroborates these rows yet
 * (GAUNTLET.md §2.1). Treat as v0.682 until one does.
 *
 * DO NOT EDIT BY HAND — re-run the transcriber.
 */

/**
 * One modifier row, VERBATIM. `id` indexes an UNMAPPED space (34 distinct ids,
 * 0..40000); `value` is absent on 93 of 412 rows and spans -1000000..9902095.
 * Deciding what id 102 means is not this lane's job — recording it is.
 */
export interface OgItemModifier {
  readonly id: number;
  readonly value?: number;
}

/** One item. Optional fields are absent in the source, never defaulted. */
export interface OgItem {
  readonly id: number;
  /** Paperdoll slot. ABSENT on the 4k "armor" band (152 items) and on item 7075. */
  readonly type?: number;
  /** String-table id, not a display string. Absent on 178 items. */
  readonly nameId?: number;
  readonly descId?: number;
  readonly baseprice?: number;
  readonly heavenlyprice?: number;
  readonly weight?: number;
  /** NEGATIVE on 13 rows (to -4), as recorded. */
  readonly minlvl?: number;
  readonly mindamage?: number;
  readonly maxdamage?: number;
  readonly defense?: number;
  readonly uses?: number;
  readonly slashusage?: number;
  readonly stancerestriction?: number;
  /** 1 or 2 — NOT a boolean. */
  readonly unique?: number;
  /** ITEM -> ITEM pointer: render me using that item's artwork. */
  readonly art?: number;
  readonly nogive?: number;
  readonly nodrop?: number;
  /** Resolved via docs/gauntlet/L0/index/resolved_names.json (804 of 982, 0 misses). */
  readonly name?: string;
  readonly desc?: string;
  /** Source order preserved. Up to 10 per item; present on 93 items. */
  readonly modifiers?: readonly OgItemModifier[];
}

/**
 * A source value that is NOT a number, preserved verbatim rather than coerced.
 * The field is omitted from its `OgItem` row and recorded here instead, so nothing
 * is lost and nothing is invented. `tests/ogItemData.test.ts` pins this list
 * EXACTLY, so a second anomaly appearing in the source turns the suite red rather
 * than being silently dropped.
 */
export interface OgItemSourceAnomaly {
  readonly itemId: number;
  readonly field: string;
  readonly raw: string;
}
"""


def main() -> None:
    if not SRC.exists():
        die(f"missing {SRC} — the reference payload is gitignored; see docs/RECOVERY.md")
    if not NAMES.exists():
        die(f"missing {NAMES}")

    root = ET.parse(SRC).getroot()
    if root.tag != "itemdata":
        die(f"root is <{root.tag}>, expected <itemdata>")

    # CLOSED VOCABULARY, checked RECURSIVELY and FIRST. This is the assertion that
    # caught L2's <req> tree — a tag the generator never walked. itemdata's <modifier>
    # is the same class and worse: it nests AND repeats up to 10x. Dying on any unknown
    # tag ANYWHERE is the guard; a deeper hand-written walk is not.
    known = ITEM_TAGS | {"itemdata", "item"} | MODIFIER_TAGS
    for node in root.iter():
        if node.tag not in known:
            die(f"unknown tag <{node.tag}> — grammar changed, do not guess")
        if node.attrib:
            die(f"<{node.tag}> carries attributes {node.attrib} — the source had none")

    resolved: dict[str, dict[str, str]] = json.loads(NAMES.read_text())["itemdata.xml"]["resolved"]

    rows: list[str] = []
    anomalies: list[tuple[int, str, str]] = []
    seen_ids: set[int] = set()
    n_modifiers = 0
    n_named = 0

    for item in root:
        if item.tag != "item":
            die(f"unexpected child <{item.tag}> under <itemdata>")
        for child in item:
            if child.tag not in ITEM_TAGS:
                die(f"unknown item field <{child.tag}> — grammar changed, do not guess")

        raw_id = text(item, "id")
        if raw_id is None:
            die("an <item> has no <id>")
        iid = as_int(raw_id, "item id")
        if iid in seen_ids:
            die(f"duplicate item id {iid}")
        seen_ids.add(iid)

        fields = [f"id: {iid}"]

        for tag, key in SCALAR_FIELDS:
            raw = text(item, tag)
            if raw is None:
                continue
            try:
                fields.append(f"{key}: {int(raw)}")
            except ValueError:
                # NOT coerced and NOT dropped — recorded verbatim (see OG_ITEM_SOURCE_ANOMALIES).
                anomalies.append((iid, tag, raw))

        names = resolved.get(str(iid), {})
        if "name" in names:
            fields.append(f"name: {ts_str(names['name'])}")
            n_named += 1
        if "desc" in names:
            fields.append(f"desc: {ts_str(names['desc'])}")

        # <modifier> carries its data in CHILDREN and REPEATS up to 10x. findtext()
        # returns nothing here and find() returns 1 of 10 — findall() + a child walk
        # is the only correct read.
        mods: list[str] = []
        for mod in item.findall("modifier"):
            for child in mod:
                if child.tag not in MODIFIER_TAGS:
                    die(f"item {iid}: unknown modifier field <{child.tag}>")
            if len(mod) == 0:
                die(f"item {iid}: a <modifier> has no children")
            mod_id = text(mod, "id")
            if mod_id is None:
                die(f"item {iid}: a <modifier> has no <id>")
            parts = [f"id: {as_int(mod_id, f'item {iid} modifier id')}"]
            mod_value = text(mod, "value")
            if mod_value is not None:
                parts.append(f"value: {as_int(mod_value, f'item {iid} modifier value')}")
            mods.append("{ " + ", ".join(parts) + " }")
            n_modifiers += 1

        head = "  { " + ", ".join(fields)
        if mods:
            rows.append(head + ",\n    modifiers: [" + ", ".join(mods) + "] },")
        else:
            rows.append(head + " },")

    # Referential integrity of the item->item <art> pointer, asserted at generation.
    # Both facts were measured; either breaking means the pointer is not what this
    # transcriber says it is, so it dies rather than emitting a table that lies.
    art_of: dict[int, int] = {}
    for it in root:
        raw_art = text(it, "art")
        if raw_art is not None:
            art_of[as_int(text(it, "id") or "", "id")] = as_int(raw_art, "art")
    missing = sorted(set(art_of.values()) - seen_ids)
    if missing:
        die(f"<art> points at non-existent item ids {missing} — dangling artwork pointer")
    chained = sorted(t for t in set(art_of.values()) if t in art_of)
    if chained:
        die(f"<art> forms a CHAIN via items {chained} — the flat-pointer assumption is dead")

    anomaly_rows = "\n".join(
        f"  {{ itemId: {i}, field: '{f}', raw: {ts_str(r)} }},".replace("\r", "")
        for i, f, r in anomalies
    )

    body = "\n".join(
        [
            HEADER,
            "export const OG_ITEM_SOURCE_ANOMALIES: readonly OgItemSourceAnomaly[] = [",
            anomaly_rows,
            "];",
            "",
            "export const OG_ITEMS: readonly OgItem[] = [",
            *rows,
            "];",
            "",
        ]
    )
    OUT.write_text(body)

    print(f"transcribeItems: wrote {OUT}")
    print(f"  items      {len(rows)}")
    print(f"  modifiers  {n_modifiers}")
    print(f"  named      {n_named}")
    print(f"  anomalies  {len(anomalies)}  {anomalies if anomalies else ''}")


if __name__ == "__main__":
    main()
