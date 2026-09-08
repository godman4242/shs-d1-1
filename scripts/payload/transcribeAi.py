#!/usr/bin/env python3
"""THE AI DISPATCH TRANSCRIBER (lane L4a) — NPCManager.as + XMLNpc.as -> config.

Emits `src/config/ogAi.ts`: what actor class the original constructs for a given
`<ai>` value, with what constructor arguments, cited to the line it came from.
GAUNTLET.md §2 — "a script beats a swarm": reading a switch statement is a
deterministic transform, so it gets a parser and a byte-check, never a fan-out.
`tests/ogAiData.test.ts` re-derives the same table with an INDEPENDENT regex.

⛔ THIS TRANSCRIBES THE MAP, NOT THE BEHAVIOUR. Building the 34 enemy actors is
lane L4b (GAUNTLET.md §2 routes it to Fable 5 @ `high`); `EnemyKatana.as` alone is
220 lines. This file records WHICH class each value names and stops there.

FOUR SHAPES THAT MAKE THIS MORE THAN "copy the switch":

  1. THERE ARE THREE DISPATCHES, NOT ONE. `createNPC` (`NPCManager.as:500`) is the
     38-case switch everyone quotes. `createRoomNPC` (`:671`) is a DIFFERENT
     if/else chain over the same values — `RoomGoblin`/`RoomOgre`/`RoomZombie`
     instead of `EnemyGoblin`/`EnemyOgre`/`EnemyZombie`, most branches carrying a
     `doChase` flag, and it MERGES ai 11 and 16 into one `EnemyWolfAlpha`.
     `createRoomNPCProcGen` (`:749`) is a third, three branches wide. Transcribing
     only the switch records one third of the map.

  2. THE ARGUMENTS ARE THE BEHAVIOUR. `EnemyPlayer` appears at ai 0, 9 AND 14 with
     different constructor flags, and `EnemySpearElite` at 28 and 37. Capturing only
     the class name collapses five distinct enemies into two rows.

  3. THE FALLBACKS DIFFER, AND ONE OF THEM IS A BUG. `createNPC`'s `default:` only
     `trace()`s — `actor` stays **null** and the very next statement calls
     `actor.addToCanvas(canvas)`. The two room dispatches fall back to a real
     `EnemyCivilian`. That asymmetry is recorded, not smoothed.

  4. THE XML's `ai` IS NOT ALWAYS FINAL. `XMLNpc.as` assigns it in code at FOUR
     places, after the XML is read: `:315` (`= 0`, the duellist), `:479` (`= 32`,
     on `rng.rand(2) == 1`), `:523` (`= 33`) and `:586` (`= bossxml.ai`, the bounty
     target inheriting NPC 18). Plus `isAnimal()` (`:645-647`) partitions the value
     space independently of any dispatch.

⚠️ "34" IS TWO DIFFERENT 34s. The data uses **34 distinct `<ai>` values** (0, 10, 15
and 16 never appear in `npcdata.xml`), and there are separately **34 `Enemy*.as`
classes on disk** (plus 3 `Friendly*` and 3 `Room*`; `RoomGenNode.as` is not an
actor). Same number, disjoint sets — the same coincidence-trap shape
`transcribeItems.py` already pins for its 93s and its 178s.

⚠️ C2 — the decompiled scripts are the ANDROID build (v0.682), same caveat as the
data XMLs (GAUNTLET.md §2.1). The generated header repeats it.

Usage:  python3 scripts/payload/transcribeAi.py [SCRIPTS_DIR] [OUT_TS]
Writes: src/config/ogAi.ts   (fails loudly on any shape surprise)

The two optional paths exist so the CHAOS-PLANT can point this at a mutated COPY
of the decompiled scripts and watch it die, without ever writing to the gitignored
reference material. Normal runs take no arguments.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SCRIPTS = (
    Path(sys.argv[1])
    if len(sys.argv) > 1
    else REPO / "reference" / "decompiled" / "shs3_android_payload" / "scripts"
)
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else REPO / "src" / "config" / "ogAi.ts"

FUNC = re.compile(r"^\s*(?:public |internal |protected |private )*static function (\w+)\s*\(")
CASE = re.compile(r"^\s*case (\d+):\s*$")
COND = re.compile(r"^\s*(?:else )?if\((xml\.ai == \d+(?: \|\| xml\.ai == \d+)*)\)\s*$")
ELSE = re.compile(r"^\s*else\s*$")
NEW = re.compile(r"^\s*actor = new (\w+)\((.*)\);\s*$")
TRACE = re.compile(r"^\s*trace\((.*)\);\s*$")
DEFAULT = re.compile(r"^\s*default:\s*$")

# The three dispatches, and the number of `ai` VALUES each MUST yield. A dispatch
# that parses to a different width means the source moved — die rather than emit a
# shorter map. ⚠️ createRoomNPC has 12 CONDITIONS but 13 values: `xml.ai == 11 ||
# xml.ai == 16` is one branch serving two values, and it is the whole reason this
# count is a value count and not a branch count.
DISPATCHES: tuple[tuple[str, int], ...] = (
    ("createNPC", 38),
    ("createRoomNPC", 13),
    ("createRoomNPCProcGen", 2),
)


def die(msg: str) -> None:
    sys.exit(f"transcribeAi: {msg}")


def ts_str(s: str) -> str:
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"


def split_args(raw: str) -> list[str]:
    """Split a call's argument list on top-level commas. `MCSPool.getMCS()` nests."""
    args: list[str] = []
    depth = 0
    current = ""
    for ch in raw:
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth < 0:
                die(f"unbalanced parentheses in argument list {raw!r}")
        if ch == "," and depth == 0:
            args.append(current.strip())
            current = ""
        else:
            current += ch
    if depth != 0:
        die(f"unbalanced parentheses in argument list {raw!r}")
    if current.strip():
        args.append(current.strip())
    return args


def body_of(lines: list[str], name: str) -> tuple[int, list[tuple[int, str]]]:
    """(1-based declaration line, numbered body lines) for one static function.

    The body ends at the next function declaration — the decompiler emits one
    function per block with no nesting, so this needs no brace counting.
    """
    start = None
    for i, line in enumerate(lines):
        m = FUNC.match(line)
        if m and m.group(1) == name:
            start = i
            break
    if start is None:
        die(f"function {name}() not found in NPCManager.as — the source moved")
    end = len(lines)
    for j in range(start + 1, len(lines)):
        if FUNC.match(lines[j]):
            end = j
            break
    return start + 1, [(k + 1, lines[k]) for k in range(start + 1, end)]


def parse_dispatch(lines: list[str], name: str) -> tuple[int, list[dict[str, object]], dict[str, object]]:
    """Every `ai -> actor` branch in one dispatch, plus its fallback.

    Handles BOTH forms the source uses — `switch(xml.ai)` with `case N:` and the
    `if(xml.ai == N)` / `else if` chain — because `createNPC` is written one way and
    the two room dispatches the other, over the same value space.
    """
    decl, body = body_of(lines, name)
    cases: list[dict[str, object]] = []
    fallback: dict[str, object] | None = None
    pending: list[int] | None = None
    in_default = False

    for lineno, line in body:
        m = CASE.match(line)
        if m:
            pending, in_default = [int(m.group(1))], False
            continue
        m = COND.match(line)
        if m:
            pending = [int(v) for v in re.findall(r"xml\.ai == (\d+)", m.group(1))]
            in_default = False
            continue
        if DEFAULT.match(line) or ELSE.match(line):
            pending, in_default = None, True
            continue
        m = NEW.match(line)
        if m:
            row = {
                "actor": m.group(1),
                "args": split_args(m.group(2)),
                "line": lineno,
            }
            if in_default:
                if fallback is not None:
                    die(f"{name}: two fallback actors — the chain is not what this parser assumes")
                fallback = {"kind": "actor", **row}
                in_default = False
            elif pending is not None:
                for value in pending:
                    cases.append({"ai": value, **row})
                pending = None
            continue
        m = TRACE.match(line)
        if m and in_default:
            # `createNPC`'s default only traces: `actor` stays null and the next
            # statement dereferences it. Recorded as the null it is.
            fallback = {"kind": "none", "trace": m.group(1), "line": lineno}
            in_default = False

    if fallback is None:
        die(f"{name}: no fallback branch found — the source moved")
    return decl, cases, fallback


def main() -> None:
    npcmgr = SCRIPTS / "NPCManager.as"
    xmlnpc = SCRIPTS / "XMLNpc.as"
    for path in (npcmgr, xmlnpc):
        if not path.exists():
            die(f"missing {path} — the decompiled payload is gitignored; see docs/RECOVERY.md")

    mgr_lines = npcmgr.read_text(errors="strict").splitlines()
    npc_lines = xmlnpc.read_text(errors="strict").splitlines()

    parsed: list[tuple[str, int, list[dict[str, object]], dict[str, object]]] = []
    for name, expected in DISPATCHES:
        decl, cases, fallback = parse_dispatch(mgr_lines, name)
        if len(cases) != expected:
            die(f"{name}: parsed {len(cases)} branches, expected {expected} — the source moved")
        parsed.append((name, decl, cases, fallback))

    # createNPC's switch must be DENSE over 0..37 — a gap would mean a case this
    # parser skipped rather than a value the original never handles.
    create_npc = {int(c["ai"]) for c in parsed[0][2]}
    if create_npc != set(range(38)):
        die(f"createNPC does not cover 0..37 exactly: missing {sorted(set(range(38)) - create_npc)}")

    # The four in-code `ai` assignments, read out of XMLNpc.as rather than retyped.
    overrides: list[tuple[int, str, str]] = []
    for i, line in enumerate(npc_lines, start=1):
        m = re.match(r"^\s*this\.ai = (.+);\s*$", line)
        if m:
            overrides.append((i, m.group(1), ""))
    if len(overrides) != 6:
        die(f"XMLNpc.as has {len(overrides)} `this.ai =` assignments, expected 6")
    # :137 and :141 are the constructor's read-or-default, not an override.
    overrides = [o for o in overrides if o[0] not in (137, 141)]
    if [o[0] for o in overrides] != [315, 479, 523, 586]:
        die(f"the in-code ai overrides moved: {[o[0] for o in overrides]}")
    WHY = {
        315: "initDuelist() — a duellist is ALWAYS ai 0 (EnemyPlayer), whatever the XML said",
        479: "initProcGenNPC() — a procgen commoner becomes 32 on rng.rand(2) == 1",
        523: "initProcGenNPC() — the female commoner branch is always 33",
        586: "initProcGenNPC() — a bounty target INHERITS NPC 18's ai (and hp, and chi)",
    }

    # THE FOURTH `ai` SITE, and it is not a dispatch at all: `createNPC` conditions the
    # duellist's SPAWN PLACEMENT on `ai == 0`. Recorded because it is the only place
    # `ai` carries coordinates, and because a reader counting "ai sites" gets 4, not 3.
    duel_line = next(
        (
            i
            for i, l in enumerate(mgr_lines, start=1)
            if "isDuelMode() && xml.ai == 0" in l
        ),
        None,
    )
    if duel_line is None:
        die("createNPC's duel-mode placement rule not found — the source moved")
    block = "\n".join(mgr_lines[duel_line : duel_line + 14])
    placements = re.findall(r"setPosition\((\d+),y\);\s*\n\s*actor\.mcs\.(face\w+)\(\)", block)
    anim = re.search(r"startAnim\(MCSActor\.(\w+)\)", block)
    if len(placements) != 2 or anim is None:
        die(f"the duel placement rule is not the two-branch shape this parser assumes: {placements}")

    animal_line = None
    animal_values: list[int] = []
    for i, line in enumerate(npc_lines, start=1):
        if "return this.ai == " in line:
            animal_line = i
            animal_values = [int(v) for v in re.findall(r"this\.ai == (\d+)", line)]
            break
    if animal_line is None or not animal_values:
        die("XMLNpc.as isAnimal() not found — the source moved")

    default_ai_line = next(
        (i for i, l in enumerate(npc_lines, start=1) if re.match(r"^\s*this\.ai = 1;\s*$", l)),
        None,
    )
    if default_ai_line is None:
        die("XMLNpc.as's `this.ai = 1` default not found — the source moved")

    def case_rows(cases: list[dict[str, object]]) -> str:
        return "\n".join(
            "    { ai: %d, actor: %s, args: [%s], line: %d },"
            % (
                int(c["ai"]),
                ts_str(str(c["actor"])),
                ", ".join(ts_str(a) for a in c["args"]),  # type: ignore[union-attr]
                int(c["line"]),
            )
            for c in cases
        )

    def fallback_row(f: dict[str, object]) -> str:
        if f["kind"] == "actor":
            return "{ kind: 'actor', actor: %s, args: [%s], line: %d }" % (
                ts_str(str(f["actor"])),
                ", ".join(ts_str(a) for a in f["args"]),  # type: ignore[union-attr]
                int(f["line"]),
            )
        return "{ kind: 'none', trace: %s, line: %d }" % (ts_str(str(f["trace"])), int(f["line"]))

    by_name = {name: (decl, cases, fb) for name, decl, cases, fb in parsed}
    header = HEADER.format(
        n_create=len(by_name["createNPC"][1]),
        n_room=len(by_name["createRoomNPC"][1]),
        n_procgen=len(by_name["createRoomNPCProcGen"][1]),
    )

    out: list[str] = [header]
    for const, name in (
        ("OG_AI_CREATE_NPC", "createNPC"),
        ("OG_AI_CREATE_ROOM_NPC", "createRoomNPC"),
        ("OG_AI_CREATE_ROOM_NPC_PROCGEN", "createRoomNPCProcGen"),
    ):
        decl, cases, fb = by_name[name]
        out += [
            f"/** `NPCManager.as:{decl}` — {name}(), {len(cases)} branches. */",
            f"export const {const}: OgAiDispatch = {{",
            f"  fn: {ts_str(name)},",
            f"  line: {decl},",
            "  cases: [",
            case_rows(cases),
            "  ],",
            f"  fallback: {fallback_row(fb)},",
            "};",
            "",
        ]

    out += [
        "/**",
        f" * `NPCManager.as:{duel_line}` — the FOURTH `ai` site, and the only one that is not a",
        " * dispatch. Inside `createNPC`, AFTER the actor exists, `ai == 0` in duel mode picks",
        " * the duellist's spawn x, its facing, and the opening bow. Read out of the source, not",
        " * retyped. ⛔ RECORDED, NOT WIRED — using these numbers moves `src/core/Sim.ts`, which",
        " * is GAUNTLET.md §4's no-touch list and belongs to L5 alone.",
        " */",
        "export const OG_AI_DUEL_PLACEMENT = {",
        "  ai: 0,",
        f"  line: {duel_line},",
        f"  /** `xml.rightPos` true — {placements[0][0]}px, {placements[0][1]}. */",
        f"  rightPos: {{ x: {placements[0][0]}, facing: {ts_str(placements[0][1])} }},",
        f"  leftPos: {{ x: {placements[1][0]}, facing: {ts_str(placements[1][1])} }},",
        f"  anim: {ts_str(anim.group(1))},",
        "} as const;",
        "",
        "/**",
        " * The FOUR places `XMLNpc.as` assigns `ai` in code, AFTER the XML is read. The",
        " * constructor's own read-or-default (`:137`/`:141`) is not here — that is the",
        " * `aiEffective` rule already carried on every `OG_NPCS` row.",
        " */",
        "export const OG_AI_CODE_OVERRIDES: readonly OgAiCodeOverride[] = [",
        *[
            f"  {{ line: {ln}, assigns: {ts_str(expr)}, why: {ts_str(WHY[ln])} }},"
            for ln, expr, _ in overrides
        ],
        "];",
        "",
        "/**",
        f" * `XMLNpc.as:{animal_line}` — `isAnimal()` partitions the ai space independently of",
        " * every dispatch. An animal is not a samurai: L4b will need this before it needs",
        " * any single actor class.",
        " */",
        "export const OG_AI_ANIMAL_VALUES: readonly number[] = ["
        + ", ".join(str(v) for v in animal_values)
        + "];",
        "",
        "/**",
        f" * `XMLNpc.as:{default_ai_line}` — the value a row with no `<ai>` tag receives. 70 of the",
        " * 495 rows take this path, and they are EnemyKnife, not \"no AI\".",
        " */",
        "export const OG_AI_ABSENT_DEFAULT = 1;",
        "",
    ]
    OUT.write_text("\n".join(out))

    print(f"transcribeAi: wrote {OUT}")
    for name, decl, cases, fb in parsed:
        print(f"  {name:22s} line {decl:4d}  {len(cases):2d} branches  fallback={fb['kind']}")
    print(f"  code overrides         {[o[0] for o in overrides]}")
    print(f"  isAnimal()             line {animal_line}  {animal_values}")
    print(f"  duel placement         line {duel_line}  {placements} bow={anim.group(1)}")


HEADER = """/**
 * OG_AI_* — the original's `<ai>` -> actor-class dispatch, TRANSCRIBED (lane L4a).
 * Generated by `scripts/payload/transcribeAi.py` from
 * `reference/decompiled/shs3_android_payload/scripts/NPCManager.as` and `XMLNpc.as`;
 * NEVER hand-keyed. Byte-checked against those sources by `tests/ogAiData.test.ts`
 * using an INDEPENDENT parser.
 *
 * ⛔ THIS IS THE MAP, NOT THE BEHAVIOUR. Building the 34 enemy actors is lane L4b
 * (GAUNTLET.md §2 routes it to Fable 5 @ `high`). Nothing here is wired into the
 * duel: that moves `src/core/Sim.ts` and `tests/duel-baseline.test.ts`, §4's
 * no-touch list, and belongs to L5 alone. `AI_TIERS` in `src/config/ai.ts` is a
 * hand-authored 3-tier stand-in that maps to NO value in this table — see
 * DIVERGENCES.md.
 *
 * Four shapes a reasonable reader gets wrong:
 *
 *   1. THERE ARE THREE DISPATCHES, NOT ONE. `createNPC` is the {n_create}-case switch
 *      everyone quotes. `createRoomNPC` is a DIFFERENT {n_room}-branch if/else chain over
 *      the same values — `RoomGoblin`/`RoomOgre`/`RoomZombie` where the switch says
 *      `EnemyGoblin`/`EnemyOgre`/`EnemyZombie`, most branches carrying a `doChase`
 *      flag, and it MERGES ai 11 and 16 into one `EnemyWolfAlpha`.
 *      `createRoomNPCProcGen` is a third, {n_procgen} branches wide.
 *   2. THE ARGUMENTS ARE THE BEHAVIOUR. `EnemyPlayer` appears at ai 0, 9 AND 14 with
 *      different constructor flags, and `EnemySpearElite` at 28 and 37. `args` is
 *      captured verbatim because the class name alone collapses five enemies into two.
 *   3. THE FALLBACKS DIFFER, AND ONE IS A BUG. `createNPC`'s `default:` only `trace()`s —
 *      `actor` stays null and the very next statement calls `actor.addToCanvas(canvas)`.
 *      The room dispatches fall back to a real `EnemyCivilian`. Recorded, not smoothed.
 *   4. THE XML's `ai` IS NOT ALWAYS FINAL — `OG_AI_CODE_OVERRIDES` holds the four
 *      places `XMLNpc.as` reassigns it after parsing.
 *   5. THERE IS A FOURTH `ai` SITE THAT IS NOT A DISPATCH. `OG_AI_DUEL_PLACEMENT`
 *      (`NPCManager.as`, inside `createNPC` and AFTER the switch) conditions the
 *      duellist's spawn x, facing and opening bow on `ai == 0`. A reader counting
 *      `xml.ai` comparisons in NPCManager.as finds 16, not 15.
 *
 * ⚠️ "34" IS TWO DIFFERENT 34s: `npcdata.xml` uses 34 distinct `<ai>` values (0, 10,
 * 15 and 16 never appear) and there are 34 `Enemy*.as` classes on disk. Same number,
 * disjoint sets. `tests/ogAiData.test.ts` pins them apart.
 *
 * ⚠️ C2 — the decompiled scripts are the ANDROID build (v0.682); no web-side
 * artifact corroborates them yet (GAUNTLET.md §2.1).
 *
 * DO NOT EDIT BY HAND — re-run the transcriber.
 */

/** One `ai` -> actor branch. `args` is the constructor call, VERBATIM. */
export interface OgAiCase {{
  readonly ai: number;
  readonly actor: string;
  readonly args: readonly string[];
  /** The `NPCManager.as` line this branch was read from. */
  readonly line: number;
}}

/**
 * What a dispatch does when no branch matches. `'actor'` constructs a real fallback;
 * `'none'` only traces, leaving `actor` null for the next statement to dereference.
 */
export type OgAiFallback =
  | {{ readonly kind: 'actor'; readonly actor: string; readonly args: readonly string[]; readonly line: number }}
  | {{ readonly kind: 'none'; readonly trace: string; readonly line: number }};

/** One of the three dispatches. */
export interface OgAiDispatch {{
  readonly fn: string;
  /** The `NPCManager.as` line the function is declared on. */
  readonly line: number;
  readonly cases: readonly OgAiCase[];
  readonly fallback: OgAiFallback;
}}

/** One place `XMLNpc.as` assigns `ai` in code, after the XML has been read. */
export interface OgAiCodeOverride {{
  /** The `XMLNpc.as` line. */
  readonly line: number;
  /** The right-hand side, verbatim. */
  readonly assigns: string;
  readonly why: string;
}}
"""


if __name__ == "__main__":
    main()
