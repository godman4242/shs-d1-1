#!/usr/bin/env python3
"""THE CLIP-TABLE TRANSCRIBER — the source's own animList -> committed clip facts.

`scripts/anim/transcribeAnims.py` transcribes the FRAMES of four animations,
because the duel loop draws those four. The actor family needs something much
smaller and much wider: every clip's DURATION and LOOP flag. `MCSCharacter.startAnim`
/`updateAnimation` read exactly those two fields (`AnimClip` in
`src/core/npc/types.ts`), and a `NPC` descendant's whole `update()` switch is
driven by which clip finished when.

WHICH clips: the ones the source loads. `MCSCharacter.initAnimationData`
pushes 18 animation files into one list and indexes them into ONE global
`animList` by clip name, a later file overwriting an earlier one. So this reads
the load order FROM THE SOURCE (never restated here), reads each file, and
applies the same last-write-wins rule. Until 2026-09-23 it read one file of the
18 — 158 clips of 466 — and that gap was all of finding 19.

THEN the holds: `AnimData`'s constructor adds a per-name hold to `d=` (58 names,
+2 to +50 frames, the last pose held), and the source's clock plays that total.
Until 2026-09-23 this table carried the bare `d=` (the katana swung in 10, not 18).

It emits `src/config/ogAnimClips.ts` from the source alone: each file's own `d=`
and `l=`, plus `AnimData`'s own holds, no hand-keying. It does NOT read frames
beyond counting them to prove `d=` is honest; frames stay the sibling's job.

Usage:  python3 scripts/anim/transcribeAnimClips.py
Writes: src/config/ogAnimClips.ts (fails loudly if the source or the grammar moved)
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SCRIPTS = REPO / "reference" / "decompiled" / "shs3_android_payload" / "scripts"
MCS_CHARACTER = SCRIPTS / "MCSCharacter.as"
ANIM_DATA = SCRIPTS / "AnimData.as"
MCS_ACTOR = SCRIPTS / "MCSActor.as"
ANDROID = REPO / "reference" / "extracted" / "android"
OUT = REPO / "src" / "config" / "ogAnimClips.ts"

INIT_RE = re.compile(r"function initAnimationData\(\)(.*?)\n {6}\}", re.S)
PUSH_RE = re.compile(r"xmlArray\.push\(XML\(new (\w+)AnimationData\(\)\)\)")
ANIM_RE = re.compile(r'<anim i="([^"]+)"([^>]*)>(.*?)</anim>', re.S)
FRAME_RE = re.compile(r'<f i="(\d+)"')
ATTR_RE = re.compile(r"(\w+)=")


def load_order() -> list[str]:
    body = INIT_RE.search(MCS_CHARACTER.read_text(encoding="utf-8"))
    if body is None:
        sys.exit("FATAL: MCSCharacter.initAnimationData not found — the source moved")
    order = PUSH_RE.findall(body.group(1))
    if not order or len(set(order)) != len(order):
        sys.exit(f"FATAL: load order empty or repeating: {order}")
    return order


def holds() -> dict[str, int]:
    """`AnimData`'s constructor: after `duration = xml.@d`, a switch on the clip name
    adds a hold (`duration += N`) and the last pose is held for it. Every `case` label
    takes the `+= N` its group ends in; a label is a string literal or an `MCSActor`
    constant, resolved through `MCSActor.as`."""
    consts = dict(re.findall(r'static (?:const|var) (\w+):String = "([^"]*)"',
                             MCS_ACTOR.read_text(encoding="utf-8", errors="replace")))
    src = ANIM_DATA.read_text(encoding="utf-8", errors="replace")
    out: dict[str, int] = {}
    labels: list[str] = []
    for line in src[src.index("switch("):].split("\n"):
        labels += [m.strip() for m in re.findall(r"case\s+(.+?):", line)]
        add = re.search(r"duration \+= (\d+);", line)
        if add is None:
            continue
        for label in labels:
            name = label[1:-1] if label.startswith('"') else consts.get(label.removeprefix("MCSActor."))
            if name is None:
                sys.exit(f"FATAL: AnimData hold label {label} does not resolve")
            if name in out:
                sys.exit(f"FATAL: AnimData holds {name} twice")
            out[name] = int(add.group(1))
        labels = []
    if not out:
        sys.exit("FATAL: no AnimData holds found — the source moved")
    return out


def data_file(stem: str) -> Path:
    hits = sorted(ANDROID.glob(f"*_MCSCharacter_{stem}AnimationData.bin"))
    if len(hits) != 1:
        sys.exit(f"FATAL: {stem}AnimationData: expected one data file, found {len(hits)}")
    return hits[0]


def parse(path: Path) -> dict[str, tuple[int, bool]]:
    blocks = ANIM_RE.findall(path.read_text(encoding="latin1"))
    if not blocks:
        sys.exit(f"FATAL: {path.name}: no <anim> blocks — grammar changed, refuse to guess")
    clips: dict[str, tuple[int, bool]] = {}
    for name, attrs, body in blocks:
        unknown = set(ATTR_RE.findall(attrs)) - {"d", "l"}
        if unknown:
            sys.exit(f"FATAL: {path.name} anim {name}: unknown anim attrs {unknown} — grammar changed")
        d = re.search(r'd="(\d+)"', attrs)
        if d is None:
            sys.exit(f"FATAL: {path.name} anim {name} has no d= duration")
        duration = int(d.group(1))
        # `d=` is the contract; prove it against the frames actually recorded so
        # a truncated payload cannot pass a wrong duration off as the source's.
        frames = FRAME_RE.findall(body)
        if len(frames) != duration:
            sys.exit(f"FATAL: {path.name} anim {name}: d={duration} but {len(frames)} <f> blocks")
        if name in clips:
            sys.exit(f"FATAL: {path.name} anim {name} defined twice in one file")
        clips[name] = (duration, 'l="1"' in attrs)
    return clips


def main() -> None:
    for need in (MCS_CHARACTER, ANIM_DATA, MCS_ACTOR, ANDROID):
        if not need.exists():
            sys.exit(f"FATAL: {need} is missing — reference/ is study-only and gitignored")
    order = load_order()
    on_disk = {p.name.split("_MCSCharacter_")[1].removesuffix("AnimationData.bin")
               for p in ANDROID.glob("*_MCSCharacter_*AnimationData.bin")}
    if on_disk != set(order):
        sys.exit(f"FATAL: data files and load order disagree: unlisted {sorted(on_disk - set(order))}, "
                 f"missing {sorted(set(order) - on_disk)}")

    clips: dict[str, tuple[int, bool]] = {}
    blocks = 0
    repeats: list[str] = []
    for stem in order:
        for name, clip in parse(data_file(stem)).items():
            blocks += 1
            if name in clips:
                # Last-write-wins is the source's rule. A repeat that DISAGREED
                # would make the load order load-bearing: refuse rather than absorb.
                if clips[name] != clip:
                    sys.exit(f"FATAL: {name}: {stem} overwrites {clips[name]} with {clip}")
                repeats.append(name)
            clips[name] = clip

    held = holds()
    for name, hold in held.items():
        if name not in clips:
            sys.exit(f"FATAL: AnimData holds {name}, which no loaded file defines")
        duration, loop = clips[name]
        clips[name] = (duration + hold, loop)

    lines: list[str] = []
    lines.append("/**")
    lines.append(" * OG ANIMATION CLIP FACTS — GENERATED, DO NOT HAND-EDIT.")
    lines.append(" *")
    lines.append(" * Source: the source's own `animList` — the 18 animation files")
    lines.append(" * `MCSCharacter.initAnimationData` loads, in its order, a later file")
    lines.append(" * overwriting an earlier one — via `scripts/anim/transcribeAnimClips.py`;")
    lines.append(" * byte-checked by the skipIf suite in `tests/ogAnimClips.test.ts`. Every")
    lines.append(" * number is CONTRACT: `durationFrames` is the file's own `d=` PLUS the hold")
    lines.append(" * `AnimData`'s constructor adds by clip name (the last pose held), which is")
    lines.append(" * the length the source's clock plays; `loop` is the file's own `l=\"1\"`.")
    lines.append(f" * {len(held)} clips carry a hold (+{min(held.values())} to +{max(held.values())} frames).")
    lines.append(" *")
    lines.append(" * This is the DURATION table, not the frame table. `OG_ANIMS` (its sibling)")
    lines.append(" * holds the per-frame node transforms for the four clips the duel DRAWS;")
    lines.append(" * this holds `{durationFrames, loop}` for all of them, which is exactly what")
    lines.append(" * `AnimLibrary` (`src/core/npc/types.ts`) serves to an `NPC` descendant —")
    lines.append(" * every `update()` switch in the actor family turns on which clip finished.")
    lines.append(" *")
    lines.append(f" * {len(order)} files, {blocks} `<anim>` blocks, {len(clips)} clips: {len(repeats)} names")
    lines.append(" * appear in two files, each time with identical facts, so the load order")
    lines.append(" * changes no value. ⚠️ Until 2026-09-23 this table read ONE file (158 clips)")
    lines.append(" * and called that the payload — which is all finding 19 ever was — and it")
    lines.append(" * carried the bare `d=` without the holds (the katana swung in 10, not 18).")
    lines.append(" *")
    lines.append(" * ⚠️ ONE `OG_ANIM` NAME IS NOT HERE: `flurry_parte`. `MCSActor.as` names it")
    lines.append(" * and no file defines it — the source's own `trace(\"missing animation\")`,")
    lines.append(" * on which `startAnim` no-ops, faithfully. Not a gap to fill in.")
    lines.append(" *")
    lines.append(" * ⚠️ ANDROID build (v0.682), the decompile every port reads. The web payload")
    lines.append(" * carries the same 18 plus a web-only spider file; it differs on the ogre (6")
    lines.append(" * durations + 2 web-only clips), the guardian (1 + 1), the spearman (3 web-only")
    lines.append(" * clips + 4 pose-only edits) and 3 Skills poses; and its hold table differs by")
    lines.append(" * two names (web adds `downedup` +12, drops `light_afterslashpose` +10).")
    lines.append(" */")
    lines.append("")
    lines.append("/** One clip's playback facts — structurally `AnimClip`; config may not import core. */")
    lines.append("export interface OgAnimClip {")
    lines.append("  readonly durationFrames: number;")
    lines.append("  readonly loop: boolean;")
    lines.append("}")
    lines.append("")
    lines.append("export const OG_ANIM_CLIPS: Readonly<Record<string, OgAnimClip>> = {")
    for name in sorted(clips):
        duration, loop = clips[name]
        key = name if re.fullmatch(r"[A-Za-z_$][\w$]*", name) else f"'{name}'"
        lines.append(f"  {key}: {{ durationFrames: {duration}, loop: {'true' if loop else 'false'} }},")
    lines.append("};")
    lines.append("")

    OUT.write_text("\n".join(lines), encoding="utf-8")
    looping = sum(1 for _, loop in clips.values() if loop)
    print(f"wrote {OUT.relative_to(REPO)}: {len(order)} files, {blocks} blocks, "
          f"{len(clips)} clips ({looping} looping), {len(repeats)} agreeing repeats, {len(held)} held")


if __name__ == "__main__":
    main()
