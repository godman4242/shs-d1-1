#!/usr/bin/env python3
"""androidIndex.py — GAUNTLET Stage 0b: the Android payload + the STRING TABLE.

Found 2026-08-14 during L0: reference/decrypted/shs3_android_payload_decoded.swf
carries 42 DefineBinaryData blobs that are CLASS-NAMED, where the web payload's
27 are anonymous. One of them, Mobile_Lang_EN, is the string table that
GAUNTLET.md §2.1 declared "NOT located" and made a hard blocker on lanes L2/L3.

Resolving 982 item names, 75 skill names and 495 NPC names through that table is a
deterministic transform, so it gets a script and a byte-check, never a fan-out
(GAUNTLET.md §2, "a script beats a swarm").

Emits into docs/gauntlet/L0/index/:
  strings.json         resname -> source text, every trans-unit
  android_blobs.json   all 42 blobs: bytes, kind, root, tag histogram
  resolved_names.json  item/skill/npc id -> resolved name + desc, plus miss lists

Usage:  python3 scripts/gauntlet/androidIndex.py [--export] [--out DIR]
        --export re-runs the ffdec binaryData export (needs java); otherwise it
        reuses reference/extracted/android/ if already populated.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SWF = REPO / "reference/decrypted/shs3_android_payload_decoded.swf"
FFDEC = REPO / "reference/tools/ffdec/ffdec.jar"
BLOBS = REPO / "reference/extracted/android"
EXTRACTED = REPO / "reference/extracted"

TAG_RE = re.compile(r"<([A-Za-z_][\w.\-]*)[\s/>]")
BARE_AMP_RE = re.compile(r"&(?!(?:#\d+|#x[0-9A-Fa-f]+|[A-Za-z][A-Za-z0-9]*);)")


def export_blobs() -> None:
    BLOBS.mkdir(parents=True, exist_ok=True)
    proc = subprocess.run(
        ["java", "-jar", str(FFDEC), "-export", "binaryData", str(BLOBS), str(SWF)],
        capture_output=True, text=True, check=False,
    )
    if proc.returncode != 0:
        print(proc.stdout[-2000:], proc.stderr[-2000:], file=sys.stderr)
        raise SystemExit("ffdec export failed")
    print(f"  exported binaryData -> {BLOBS.relative_to(REPO)}")


def blob_paths() -> list[Path]:
    return sorted(BLOBS.rglob("*.bin"), key=lambda p: int(p.name.split("_")[0]))


def decode(raw: bytes) -> str | None:
    for enc in ("utf-16-le", "utf-8-sig", "utf-8"):
        try:
            text = raw.decode(enc)
        except (UnicodeDecodeError, UnicodeError):
            continue
        if "<" in text[:400]:
            return text
    return None


def index_blobs() -> dict:
    out = {}
    for path in blob_paths():
        raw = path.read_bytes()
        entry: dict = {"bytes": len(raw), "file": str(path.relative_to(REPO))}
        if raw[:3] == b"GIF":
            entry["kind"] = "image/gif"
        elif raw[:3] in (b"CWS", b"FWS", b"ZWS"):
            # A nested SWF. The Mobile_*Resource blobs are these; ffdec cannot
            # open them directly, so they are a LEAD (notably audio for L7),
            # not a solved artifact. Say so rather than implying they are read.
            entry["kind"] = "nested-swf (ENCRYPTED — not opened)"
            entry["lead"] = "same obfuscation the top-level payload needed; decrypt path unproven here"
        else:
            text = decode(raw)
            if text and TAG_RE.search(text.replace("<?xml", " ")):
                tags = TAG_RE.findall(text)
                entry["kind"] = "xml"
                entry["root"] = TAG_RE.search(text.replace("<?xml", " ")).group(1)
                entry["tags"] = dict(Counter(tags).most_common(12))
            else:
                try:
                    entry["kind"] = "text"
                    entry["lines"] = len(raw.decode("utf-8").splitlines())
                except UnicodeDecodeError:
                    entry["kind"] = "binary"
        out[path.name] = entry
    return out


def build_string_table() -> dict[str, str]:
    """Parse Mobile_Lang_EN (UTF-16LE XLIFF) into resname -> source."""
    match = [p for p in blob_paths() if "Lang_EN" in p.name]
    if not match:
        raise SystemExit("Mobile_Lang_EN blob not found — run with --export")
    text = match[0].read_bytes().decode("utf-16-le").lstrip("﻿")
    # The shipped file is not well-formed: bare "&" appears in copy such as
    # 'Full HP & CHI' (line 1793). Flash's parser tolerated it; ElementTree does
    # not. Escape only ampersands that do not already start a valid entity.
    text = BARE_AMP_RE.sub("&amp;", text)
    root = ET.fromstring(text)
    table: dict[str, str] = {}
    # XLIFF is namespaced; match on the local tag name so the ns URI is irrelevant.
    for unit in root.iter():
        if not unit.tag.endswith("trans-unit"):
            continue
        resname = unit.get("resname") or unit.get("id")
        source = next((c for c in unit if c.tag.endswith("source")), None)
        if resname is not None and source is not None and source.text is not None:
            table[resname] = source.text
    return table


def resolve_names(table: dict[str, str]) -> dict:
    """Fill item/skill/npc name+desc IDs from the table. Report every miss."""
    spec = [
        ("itemdata.xml", "item", ("name", "desc")),
        ("skilldata.xml", "skill", ("displayname", "desc")),
        ("npcdata.xml", "npc", ("name",)),
    ]
    out: dict = {}
    for filename, row_tag, fields in spec:
        path = EXTRACTED / filename
        if not path.is_file():
            continue
        root = ET.fromstring(path.read_text(encoding="utf-8-sig", errors="replace"))
        rows, misses = {}, []
        for row in root.iter(row_tag):
            row_id = row.findtext("id")
            if row_id is None:
                continue
            entry = {}
            for field in fields:
                raw = row.findtext(field)
                if raw is None or not raw.strip():
                    continue
                key = raw.strip()
                if key in table:
                    entry[field] = table[key]
                else:
                    misses.append({"row": row_id, "field": field, "id": key})
            if entry:
                rows[row_id] = entry
        out[filename] = {
            "rows_resolved": len(rows),
            "misses": len(misses),
            "miss_sample": misses[:20],
            "resolved": rows,
        }
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", default=str(REPO / "docs/gauntlet/L0/index"))
    parser.add_argument("--export", action="store_true")
    args = parser.parse_args()

    if not SWF.is_file():
        print(f"FATAL: {SWF} missing", file=sys.stderr)
        return 2
    if args.export or not any(BLOBS.glob("*.bin")):
        export_blobs()

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    blobs = index_blobs()
    table = build_string_table()
    resolved = resolve_names(table)

    (out_dir / "android_blobs.json").write_text(
        json.dumps(blobs, indent=1, sort_keys=True), encoding="utf-8")
    (out_dir / "strings.json").write_text(
        json.dumps(table, indent=1, sort_keys=True), encoding="utf-8")
    (out_dir / "resolved_names.json").write_text(
        json.dumps(resolved, indent=1, sort_keys=True), encoding="utf-8")

    print(f"\nblobs indexed      {len(blobs)}")
    print(f"string table       {len(table)} entries")
    for filename, data in resolved.items():
        print(f"  {filename:16s} resolved {data['rows_resolved']:>4} rows, "
              f"{data['misses']} unresolved ids")
    print("\nspot checks (the §2.1 blocker, resolved):")
    for rid in ("4000", "4172", "4050", "6000", "5009"):
        print(f"  resname {rid:>5} -> {table.get(rid)!r}"[:120])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
