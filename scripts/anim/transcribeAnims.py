#!/usr/bin/env python3
"""THE ANIMATION TRANSCRIBER (SESSION23 A11.3) — bindata -> committed frames.

Reads the payload's own DefineBinaryData animation XML and emits
`src/config/ogAnims.ts` VERBATIM — every number is the source's own integer,
no interpretation, no rounding, no hand-keying (kickoff D4). Interpretation
(15 fps latch, sparse-frame carry-forward, matrix-vs-rotation semantics) is
the A11.4 stepper's job; the data stays as recorded so the byte-check in
`tests/a11AnimData.test.ts` can hold it against the source forever.

Grammar (probed 2026-07-28):
  <anim i="name" d="N" [l="1"]>            duration in frames; l=1 means loop
    <f i="K">                              frames may be SPARSE (changed nodes only)
      <n i="slot" x y (r | a b c d)>       r = degrees; a..d = Flash matrix x100
Slots 8 and 17 never appear — the AS3 aliases them (8<-14, 17<-16), same as idle.

Usage:  python3 scripts/anim/transcribeAnims.py
Writes: src/config/ogAnims.ts (fails loudly if a node is neither form or both)
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
BINDATA = REPO / "reference" / "extracted" / "bindata" / "108_1t4635s0.bin"
OUT = REPO / "src" / "config" / "ogAnims.ts"

# This milestone's animations: the two the duel loop needs first (kickoff P2).
ANIMS = [
    "walk",
    "balancedhorizontalslash_parta",
    "balancedhorizontalslash_partb",
    "balancedhorizontalslash_partc",
]

NODE_RE = re.compile(r'<n ([^>/]*?)/?>')
ATTR_RE = re.compile(r'(\w+)="(-?\d+)"')


def parse_anim(raw: str, name: str) -> dict:
    m = re.search(rf'<anim i="{re.escape(name)}"([^>]*)>(.*?)</anim>', raw, re.S)
    if m is None:
        sys.exit(f"FATAL: no <anim i=\"{name}\"> in {BINDATA}")
    attrs, body = m.group(1), m.group(2)
    d = re.search(r'd="(\d+)"', attrs)
    if d is None:
        sys.exit(f"FATAL: anim {name} has no d= duration")
    frames = []
    for fm in re.finditer(r'<f i="(\d+)"[^>]*>(.*?)</f>', body, re.S):
        idx, fbody = int(fm.group(1)), fm.group(2)
        if idx != len(frames):
            sys.exit(f"FATAL: anim {name} frame indices not dense at f={idx}")
        nodes = []
        for nm in NODE_RE.finditer(fbody):
            kv = {k: int(v) for k, v in ATTR_RE.findall(nm.group(1))}
            known = set(kv) - {"i", "x", "y", "r", "a", "b", "c", "d"}
            if known:
                sys.exit(f"FATAL: anim {name} f={idx}: unknown node attrs {known} — grammar changed, refuse to guess")
            if not {"i", "x", "y"} <= set(kv):
                sys.exit(f"FATAL: anim {name} f={idx}: node missing i/x/y: {kv}")
            has_r = "r" in kv
            has_mat = {"a", "b", "c", "d"} & set(kv)
            if has_r and has_mat:
                sys.exit(f"FATAL: anim {name} f={idx} slot {kv['i']}: BOTH rotation and matrix")
            if not has_r and has_mat != {"a", "b", "c", "d"}:
                sys.exit(f"FATAL: anim {name} f={idx} slot {kv['i']}: partial matrix {has_mat}")
            if not has_r and not has_mat:
                sys.exit(f"FATAL: anim {name} f={idx} slot {kv['i']}: no transform at all")
            if kv["i"] in (8, 17):
                sys.exit(f"FATAL: anim {name} f={idx}: aliased slot {kv['i']} appears — aliasing rule broken")
            nodes.append(kv)
        frames.append(nodes)
    if len(frames) != int(d.group(1)):
        sys.exit(f"FATAL: anim {name}: {len(frames)} frames but d={d.group(1)}")
    return {"loop": 'l="1"' in attrs, "duration": int(d.group(1)), "frames": frames}


def node_ts(kv: dict) -> str:
    if "r" in kv:
        return f"{{ slot: {kv['i']}, x: {kv['x']}, y: {kv['y']}, rotationDeg: {kv['r']} }}"
    return (f"{{ slot: {kv['i']}, x: {kv['x']}, y: {kv['y']}, "
            f"a: {kv['a']}, b: {kv['b']}, c: {kv['c']}, d: {kv['d']} }}")


def main() -> None:
    raw = BINDATA.read_text(encoding="latin1")
    anims = {name: parse_anim(raw, name) for name in ANIMS}

    lines: list[str] = []
    lines.append("/**")
    lines.append(" * OG ANIMATION FRAMES — GENERATED, DO NOT HAND-EDIT (SESSION23 A11.3).")
    lines.append(" *")
    lines.append(" * Source: `reference/extracted/bindata/108_1t4635s0.bin` via")
    lines.append(" * `scripts/anim/transcribeAnims.py`; byte-checked by the skipIf suite in")
    lines.append(" * `tests/a11AnimData.test.ts` (kickoff D4: transcribed, never hand-keyed).")
    lines.append(" * Every number is CONTRACT — the payload's own integer, verbatim.")
    lines.append(" *")
    lines.append(" * Frames are SPARSE exactly where the source is sparse: a frame lists only")
    lines.append(" * the nodes it changes, and playback carries the rest forward (the A11.4")
    lines.append(" * stepper's job — the DATA does not interpolate, invent, or densify).")
    lines.append(" * `rotationDeg` nodes and Flash-matrix nodes (`a..d`, fixed-point x100)")
    lines.append(" * are both recorded forms; a node is always exactly one of the two.")
    lines.append(" */")
    lines.append("")
    lines.append("/** One recorded node: a slot placed this frame. Exactly one transform form. */")
    lines.append("export interface OgAnimNode {")
    lines.append("  readonly slot: number;")
    lines.append("  readonly x: number;")
    lines.append("  readonly y: number;")
    lines.append("  /** Degrees, as recorded — mutually exclusive with the matrix quad. */")
    lines.append("  readonly rotationDeg?: number;")
    lines.append("  /** Flash matrix, fixed-point x100 — present as a full quad or not at all. */")
    lines.append("  readonly a?: number;")
    lines.append("  readonly b?: number;")
    lines.append("  readonly c?: number;")
    lines.append("  readonly d?: number;")
    lines.append("}")
    lines.append("")
    lines.append("/** One recorded animation, frames as sparse as the source stored them. */")
    lines.append("export interface OgAnim {")
    lines.append("  /** The source's d= attribute; always equals frames.length. */")
    lines.append("  readonly durationFrames: number;")
    lines.append("  /** The source's l=\"1\" flag. */")
    lines.append("  readonly loop: boolean;")
    lines.append("  readonly frames: ReadonlyArray<readonly OgAnimNode[]>;")
    lines.append("}")
    lines.append("")
    names_union = " | ".join(f"'{n}'" for n in ANIMS)
    lines.append(f"export type OgAnimName = {names_union};")
    lines.append("")
    lines.append("export const OG_ANIMS: Readonly<Record<OgAnimName, OgAnim>> = {")
    for name, a in anims.items():
        lines.append(f"  {name}: {{")
        lines.append(f"    durationFrames: {a['duration']},")
        lines.append(f"    loop: {'true' if a['loop'] else 'false'},")
        lines.append("    frames: [")
        for frame in a["frames"]:
            if not frame:
                lines.append("      [],")
            else:
                lines.append("      [")
                for kv in frame:
                    lines.append(f"        {node_ts(kv)},")
                lines.append("      ],")
        lines.append("    ],")
        lines.append("  },")
    lines.append("};")
    lines.append("")

    OUT.write_text("\n".join(lines), encoding="utf-8")
    total = sum(len(f) for a in anims.values() for f in a["frames"])
    print(f"wrote {OUT.relative_to(REPO)}: {len(anims)} anims, "
          f"{sum(a['duration'] for a in anims.values())} frames, {total} nodes")


if __name__ == "__main__":
    main()
