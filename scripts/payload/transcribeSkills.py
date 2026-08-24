#!/usr/bin/env python3
"""THE SKILL TRANSCRIBER (lane L2) — skilldata.xml -> committed config.

Reads the payload's own `skilldata.xml` and emits `src/config/ogSkills.ts`
VERBATIM: every number is the source's own, no interpretation, no rounding,
no hand-keying. GAUNTLET.md §2 — "a script beats a swarm": this is a
deterministic transform, so it gets a generator and a byte-check, never a
fan-out. Same shape as `scripts/anim/transcribeAnims.py` (741fd31).

Grammar (probed 2026-08-24, all 75 skills):
  <skilldata>
    <skill>
      <id>N</id>                  always present, unique
      <displayname>ID</displayname>   string-table id  (73 of 75)
      <desc>ID</desc>                 string-table id  (66 of 75)
      <passive>1</passive>            present ONLY when passive (27); never 0
      <order>N</order>                (68 of 75)
      <category>1..11</category>      always present
      <lvlreq>N</lvlreq>              character level required (33 of 75)
      <req><has><id>N</id><qty>M</qty></has></req>
                                      PREREQUISITE (52 of 75). Exactly one <has>,
                                      always both <id> and <qty>. Two id spaces:
                                      1000..1054 are skill ids ("have skill X at
                                      level qty"); 28..31 are a DIFFERENT space
                                      (qty 10/30/60) whose meaning this lane does
                                      NOT decide — recorded verbatim, unlabelled.
                                      ⚠️ ElementTree's .text on <req> is empty
                                      because the data is in CHILDREN; reading it
                                      as a scalar silently drops all 52 rows.
      <level>                         1, 3, 5 or 10 per skill; ONE skill has 0
        <value>N</value>              always
        <required>N</required>        skill points (180 of 182)
        <chi>N</chi>                  chi cost, integer units (81 of 182)
        <cooldown>N</cooldown>        SECONDS; one non-integer, 3.5 (98 of 182)
        <desc>ID</desc>               per-level string id (135 of 182)
Empty tags are ABSENT DATA, not zero — they are omitted, never defaulted.

Names/descriptions are resolved through `docs/gauntlet/L0/index/resolved_names.json`
(73 of 75 skills, 0 misses).

⚠️ C2 — the four data XMLs are the ANDROID build; the web payload carries no
<skilldata> root. Every row here is v0.682 until a web-side artifact says
otherwise (GAUNTLET.md §2.1). The generated header repeats this.

Usage:  python3 scripts/payload/transcribeSkills.py
Writes: src/config/ogSkills.ts   (fails loudly on any grammar surprise)
"""

from __future__ import annotations

import json
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SRC = REPO / "reference" / "extracted" / "skilldata.xml"
NAMES = REPO / "docs" / "gauntlet" / "L0" / "index" / "resolved_names.json"
OUT = REPO / "src" / "config" / "ogSkills.ts"

SKILL_TAGS = {"id", "displayname", "desc", "passive", "order", "category", "lvlreq", "req"}
LEVEL_TAGS = {"value", "required", "chi", "cooldown", "desc"}


def die(msg: str) -> None:
    sys.exit(f"transcribeSkills: {msg}")


def text(node: ET.Element, tag: str) -> str | None:
    """The tag's text, or None when the tag is absent OR empty. Empty == absent data."""
    found = node.findall(tag)
    if len(found) > 1:
        die(f"tag <{tag}> appears {len(found)}x — the grammar assumed at most one")
    if not found:
        return None
    raw = found[0].text
    if raw is None:
        return None
    stripped = raw.strip()
    return stripped or None


def as_int(raw: str, where: str) -> int:
    try:
        return int(raw)
    except ValueError:
        die(f"{where}: {raw!r} is not an integer")
    raise AssertionError("unreachable")


def as_num(raw: str, where: str) -> str:
    """Cooldowns are seconds and one of them is 3.5 — keep the source's own literal."""
    try:
        float(raw)
    except ValueError:
        die(f"{where}: {raw!r} is not a number")
    return raw


def ts_str(s: str) -> str:
    """A TypeScript single-quoted literal. Newlines are real in these descriptions."""
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n").replace("\r", "") + "'"


def main() -> None:
    if not SRC.exists():
        die(f"missing {SRC} — the reference payload is gitignored; see docs/RECOVERY.md")
    if not NAMES.exists():
        die(f"missing {NAMES}")

    root = ET.parse(SRC).getroot()
    if root.tag != "skilldata":
        die(f"root is <{root.tag}>, expected <skilldata>")

    # CLOSED VOCABULARY, checked recursively. The first cut of this script walked only
    # two levels and read <req> as a scalar, so it silently dropped 52 prerequisites
    # nested under <req><has>. Dying on any unknown tag ANYWHERE is the fix, not a
    # deeper hand-written walk.
    known = SKILL_TAGS | LEVEL_TAGS | {"skilldata", "skill", "level", "has", "qty"}
    for node in root.iter():
        if node.tag not in known:
            die(f"unknown tag <{node.tag}> — grammar changed, do not guess")

    resolved: dict[str, dict[str, str]] = json.loads(NAMES.read_text())["skilldata.xml"]["resolved"]

    skills: list[str] = []
    seen_ids: set[int] = set()
    n_levels = 0

    for skill in root:
        if skill.tag != "skill":
            die(f"unexpected child <{skill.tag}> under <skilldata>")
        for child in skill:
            if child.tag not in SKILL_TAGS and child.tag != "level":
                die(f"unknown skill field <{child.tag}> — grammar changed, do not guess")

        raw_id = text(skill, "id")
        if raw_id is None:
            die("a <skill> has no <id>")
        sid = as_int(raw_id, "skill id")
        if sid in seen_ids:
            die(f"duplicate skill id {sid}")
        seen_ids.add(sid)

        raw_cat = text(skill, "category")
        if raw_cat is None:
            die(f"skill {sid}: no <category>")

        fields = [f"id: {sid}", f"category: {as_int(raw_cat, f'skill {sid} category')}"]

        passive = text(skill, "passive")
        if passive is not None and passive != "1":
            die(f"skill {sid}: <passive> is {passive!r}; only '1' or absent was ever seen")
        fields.append(f"passive: {'true' if passive == '1' else 'false'}")

        for tag, key in (("order", "order"), ("lvlreq", "levelReq"),
                         ("displayname", "displaynameId"), ("desc", "descId")):
            raw = text(skill, tag)
            if raw is not None:
                fields.append(f"{key}: {as_int(raw, f'skill {sid} {tag}')}")

        # <req> carries its data in CHILDREN, not text. Reading it as a scalar returns
        # empty and silently drops all 52 prerequisites — caught by the byte-check's
        # closed-vocabulary guard, which saw a <qty> tag this script never walked.
        req = skill.find("req")
        if req is not None:
            has = list(req)
            if len(has) != 1 or has[0].tag != "has":
                die(f"skill {sid}: <req> holds {[c.tag for c in has]}, expected exactly one <has>")
            req_id = text(has[0], "id")
            req_qty = text(has[0], "qty")
            if req_id is None or req_qty is None:
                die(f"skill {sid}: <has> needs both <id> and <qty>")
            fields.append(
                "requires: { id: " + str(as_int(req_id, f"skill {sid} req id"))
                + ", qty: " + str(as_int(req_qty, f"skill {sid} req qty")) + " }"
            )

        names = resolved.get(str(sid), {})
        if "displayname" in names:
            fields.append(f"name: {ts_str(names['displayname'])}")
        if "desc" in names:
            fields.append(f"desc: {ts_str(names['desc'])}")

        levels: list[str] = []
        for level in skill.findall("level"):
            for child in level:
                if child.tag not in LEVEL_TAGS:
                    die(f"skill {sid}: unknown level field <{child.tag}>")
            raw_value = text(level, "value")
            if raw_value is None:
                die(f"skill {sid}: a <level> has no <value>")
            row = [f"value: {as_int(raw_value, f'skill {sid} level value')}"]
            for tag, key in (("required", "required"), ("chi", "chi"), ("desc", "descId")):
                raw = text(level, tag)
                if raw is not None:
                    row.append(f"{key}: {as_int(raw, f'skill {sid} level {tag}')}")
            cooldown = text(level, "cooldown")
            if cooldown is not None:
                row.append(f"cooldownS: {as_num(cooldown, f'skill {sid} level cooldown')}")
            levels.append("{ " + ", ".join(row) + " }")
            n_levels += 1

        fields.append("levels: [" + (
            "\n      " + ",\n      ".join(levels) + ",\n    " if levels else "") + "]")
        skills.append("  { " + ", ".join(fields[:-1]) + ",\n    " + fields[-1] + " },")

    header = f'''/**
 * OG_SKILLS — the original's skill table, TRANSCRIBED (lane L2, {len(seen_ids)} skills /
 * {n_levels} level rows). Generated by `scripts/payload/transcribeSkills.py` from
 * `reference/extracted/skilldata.xml`; NEVER hand-keyed. Byte-checked against the
 * source by `tests/ogSkillData.test.ts`.
 *
 * Every value is CONTRACT-SRC — the payload's own number, verbatim.
 * Absent fields are ABSENT IN THE SOURCE (an empty tag is missing data, not zero).
 * `cooldownS` is in SECONDS as recorded; `chi` is in the source's integer units.
 *
 * ⚠️ C2 — this is the ANDROID build (v0.682). The web payload carries no
 * <skilldata> root, so no web-side artifact corroborates these rows yet
 * (GAUNTLET.md §2.1). Treat as v0.682 until one does.
 *
 * DO NOT EDIT BY HAND — re-run the transcriber.
 */

/** One level row. Optional fields are absent in the source, never defaulted. */
export interface OgSkillLevel {{
  readonly value: number;
  readonly required?: number;
  readonly chi?: number;
  /** SECONDS, as recorded. One row is fractional (Roll level 2 = 3.5). */
  readonly cooldownS?: number;
  readonly descId?: number;
}}

/** One skill. `passive` is true iff the source carried <passive>1</passive>. */
export interface OgSkill {{
  readonly id: number;
  readonly category: number;
  readonly passive: boolean;
  readonly order?: number;
  readonly levelReq?: number;
  readonly displaynameId?: number;
  readonly descId?: number;
  /**
   * Prerequisite, verbatim (52 of 75). `id` lives in TWO spaces the source does not
   * distinguish: 1000..1054 are skill ids (have that skill at level `qty`); 28..31
   * are a different space entirely (qty 10/30/60). This lane records, it does not
   * decide which — no meaning is attached to 28..31 here.
   */
  readonly requires?: {{ readonly id: number; readonly qty: number }};
  /** Resolved via docs/gauntlet/L0/index/resolved_names.json (73 of 75, 0 misses). */
  readonly name?: string;
  readonly desc?: string;
  readonly levels: readonly OgSkillLevel[];
}}

export const OG_SKILLS: readonly OgSkill[] = [
'''

    OUT.write_text(header + "\n".join(skills) + "\n];\n")
    print(f"transcribeSkills: {len(seen_ids)} skills / {n_levels} level rows -> {OUT.relative_to(REPO)}")


if __name__ == "__main__":
    main()
