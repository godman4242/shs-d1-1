#!/usr/bin/env python3
"""THE CLIP-TABLE TRANSCRIBER (seam spike) — bindata -> committed clip facts.

`scripts/anim/transcribeAnims.py` transcribes the FRAMES of four animations,
because the duel loop draws those four. The actor family needs something much
smaller and much wider: every clip's DURATION and LOOP flag, for all 158 clips
the payload defines. `MCSCharacter.startAnim`/`updateAnimation` read exactly
those two fields (`AnimClip` in `src/core/npc/types.ts`), and a `NPC`
descendant's whole `update()` switch is driven by which clip finished when.

So this emits `src/config/ogAnimClips.ts` VERBATIM — the payload's own `d=` and
`l=` for every `<anim>`, no interpretation, no hand-keying, the same discipline
as its sibling. It does NOT read frames beyond counting them to prove `d=` is
honest; frames stay the sibling's job.

Usage:  python3 scripts/anim/transcribeAnimClips.py
Writes: src/config/ogAnimClips.ts (fails loudly if the grammar moved)
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
BINDATA = REPO / "reference" / "extracted" / "bindata" / "108_1t4635s0.bin"
OUT = REPO / "src" / "config" / "ogAnimClips.ts"

ANIM_RE = re.compile(r'<anim i="([^"]+)"([^>]*)>(.*?)</anim>', re.S)
FRAME_RE = re.compile(r'<f i="(\d+)"')
ATTR_RE = re.compile(r"(\w+)=")


def main() -> None:
    if not BINDATA.exists():
        sys.exit(f"FATAL: {BINDATA} is missing — reference/ is study-only and gitignored")
    raw = BINDATA.read_text(encoding="latin1")
    blocks = ANIM_RE.findall(raw)
    if not blocks:
        sys.exit("FATAL: no <anim> blocks — grammar changed, refuse to guess")

    clips: dict[str, tuple[int, bool]] = {}
    for name, attrs, body in blocks:
        unknown = set(ATTR_RE.findall(attrs)) - {"d", "l"}
        if unknown:
            sys.exit(f"FATAL: anim {name}: unknown anim attrs {unknown} — grammar changed")
        d = re.search(r'd="(\d+)"', attrs)
        if d is None:
            sys.exit(f"FATAL: anim {name} has no d= duration")
        duration = int(d.group(1))
        # `d=` is the contract; prove it against the frames actually recorded so
        # a truncated payload cannot pass a wrong duration off as the source's.
        frames = FRAME_RE.findall(body)
        if len(frames) != duration:
            sys.exit(f"FATAL: anim {name}: d={duration} but {len(frames)} <f> blocks")
        if name in clips:
            sys.exit(f"FATAL: anim {name} defined twice — the table would lose one")
        clips[name] = (duration, 'l="1"' in attrs)

    lines: list[str] = []
    lines.append("/**")
    lines.append(" * OG ANIMATION CLIP FACTS — GENERATED, DO NOT HAND-EDIT (seam spike).")
    lines.append(" *")
    lines.append(" * Source: `reference/extracted/bindata/108_1t4635s0.bin` via")
    lines.append(" * `scripts/anim/transcribeAnimClips.py`; byte-checked by the skipIf suite")
    lines.append(" * in `tests/ogAnimClips.test.ts`. Every number is CONTRACT — the payload's")
    lines.append(" * own `d=` integer, verbatim, and `loop` is its own `l=\"1\"` flag.")
    lines.append(" *")
    lines.append(" * This is the DURATION table, not the frame table. `OG_ANIMS` (its sibling)")
    lines.append(" * holds the per-frame node transforms for the four clips the duel DRAWS;")
    lines.append(" * this holds `{durationFrames, loop}` for all of them, which is exactly what")
    lines.append(" * `AnimLibrary` (`src/core/npc/types.ts`) serves to an `NPC` descendant —")
    lines.append(" * every `update()` switch in the actor family turns on which clip finished.")
    lines.append(" *")
    lines.append(" * ⚠️ NOT EVERY `OG_ANIM` NAME IS HERE. `OG_ANIM` (`ogActor.ts`) is the AS3")
    lines.append(" * table of 429 animation KEYS; this payload defines 158 clips. A name with")
    lines.append(" * no clip is the source's own `trace(\"missing animation\")` case, and")
    lines.append(" * `startAnim` no-ops on it — faithfully, not as a gap to be filled in.")
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
    print(f"wrote {OUT.relative_to(REPO)}: {len(clips)} clips, {looping} looping")


if __name__ == "__main__":
    main()
