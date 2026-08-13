#!/usr/bin/env python3
"""payloadIndex.py — GAUNTLET Stage 0: the evidence index.

Builds the machine-readable inventory that every L0 agent is handed, so that
no agent counts anything by hand and no two agents can disagree on a number.
This is the "a script beats a swarm" rule (GAUNTLET.md §2) applied to the
deterministic half of a judgement lane.

Indexes, all under reference/ (gitignored study material, local-only):
  * the four data XMLs      -> tag-path inventory, value domains, line numbers
  * extracted/bindata/*      -> sniffed kind + root element + per-file inventory
  * decompiled/**/*.as       -> package/class/extends symbol index
  * frames/**                -> manifest by directory
  * extracted/ui_strings.txt -> field names + embedded font faces
  * extracted/payload.xml    -> streamed tag histogram only (329 MB)

Every emitted fact carries file + line so an agent citing it produces a
checkable A2 cite. Output lands in docs/gauntlet/L0/index/ as JSON.

Usage:  python3 scripts/gauntlet/payloadIndex.py [--out DIR] [--skip-payload]
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
REF = REPO / "reference"
EXTRACTED = REF / "extracted"
DECOMPILED = REF / "decompiled"
FRAMES = REF / "frames"

DATA_XMLS = ["questdata.xml", "skilldata.xml", "npcdata.xml", "itemdata.xml"]

# Caps keep the index a navigable index, not a second copy of the payload.
MAX_LINES_PER_TAG = 6
MAX_DISTINCT_VALUES = 40
MAX_SAMPLE_CHARS = 160

OPEN_TAG_RE = re.compile(r"<([A-Za-z_][\w.\-]*)[\s/>]")
FONT_FACE_RE = re.compile(r'FACE="([^"\n]{1,64})"', re.IGNORECASE)
AS_PACKAGE_RE = re.compile(r"^\s*package\s+([\w.]*)", re.MULTILINE)
AS_CLASS_RE = re.compile(
    r"^\s*public\s+(?:final\s+|dynamic\s+)*class\s+(\w+)"
    r"(?:\s+extends\s+([\w.]+))?(?:\s+implements\s+([\w.,\s]+))?",
    re.MULTILINE,
)


def _read(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig", errors="replace")


def tag_line_map(path: Path) -> dict[str, list[int]]:
    """First N line numbers each tag name appears on -> checkable A2 cites."""
    lines: dict[str, list[int]] = defaultdict(list)
    with path.open(encoding="utf-8-sig", errors="replace") as fh:
        for lineno, line in enumerate(fh, 1):
            for match in OPEN_TAG_RE.finditer(line):
                seen = lines[match.group(1)]
                if len(seen) < MAX_LINES_PER_TAG:
                    seen.append(lineno)
    return dict(lines)


def walk_paths(elem: ET.Element, prefix: str, acc: dict[str, dict]) -> None:
    """Collect count, value domain and attribute names per tag-path."""
    path = f"{prefix}/{elem.tag}" if prefix else elem.tag
    entry = acc.setdefault(
        path, {"count": 0, "values": set(), "attrs": Counter(), "numeric": []}
    )
    entry["count"] += 1
    for key in elem.attrib:
        entry["attrs"][key] += 1

    text = (elem.text or "").strip()
    if text and not len(elem):
        if len(entry["values"]) < MAX_DISTINCT_VALUES:
            entry["values"].add(text[:MAX_SAMPLE_CHARS])
        try:
            entry["numeric"].append(float(text))
        except ValueError:
            pass

    for child in elem:
        walk_paths(child, path, acc)


def summarise_paths(acc: dict[str, dict], lines: dict[str, list[int]]) -> dict:
    out = {}
    for path, entry in sorted(acc.items()):
        leaf = path.rsplit("/", 1)[-1]
        summary: dict = {
            "count": entry["count"],
            "distinct_values": len(entry["values"]),
            "sample_values": sorted(entry["values"])[:12],
            "first_lines": lines.get(leaf, []),
        }
        if entry["attrs"]:
            summary["attributes"] = dict(entry["attrs"])
        nums = entry["numeric"]
        if nums:
            summary["numeric_range"] = [min(nums), max(nums)]
            summary["numeric_count"] = len(nums)
        # A field whose every value is a bare integer and whose name smells of
        # text is the string-table indirection L1b hunts (GAUNTLET.md §2.1).
        if leaf in {"name", "desc", "displayname", "param"} and nums:
            summary["ID_INDIRECTION"] = True
        out[path] = summary
    return out


def index_xml_file(path: Path) -> dict:
    root = ET.fromstring(_read(path))
    acc: dict[str, dict] = {}
    walk_paths(root, "", acc)
    return {
        "file": str(path.relative_to(REPO)),
        "bytes": path.stat().st_size,
        "root": root.tag,
        "paths": summarise_paths(acc, tag_line_map(path)),
    }


def sniff_bindata() -> dict:
    """Identify every bindata/* file. GAUNTLET.md §2.1 assumed 26 were unknown."""
    out = {}
    bindata = EXTRACTED / "bindata"
    if not bindata.is_dir():
        return out
    for path in sorted(bindata.iterdir()):
        if not path.is_file():
            continue
        head = path.read_bytes()[:4096]
        entry: dict = {"bytes": path.stat().st_size}
        if head[:3] == b"GIF":
            entry["kind"] = "image/gif"
        else:
            text = head.decode("utf-8-sig", errors="replace")
            match = OPEN_TAG_RE.search(text.replace("<?xml", " "))
            if match:
                entry["kind"] = "xml"
                entry["root"] = match.group(1)
                try:
                    root = ET.fromstring(_read(path))
                    entry["root"] = root.tag
                    entry["child_count"] = len(root)
                    entry["child_ids"] = [
                        c.get("i") or c.findtext("id") or c.tag for c in list(root)[:24]
                    ]
                except ET.ParseError as exc:
                    entry["parse_error"] = str(exc)
            else:
                entry["kind"] = "text"
                sample = text.strip().splitlines()
                entry["line_count"] = len(_read(path).splitlines())
                entry["sample"] = [s.strip() for s in sample[:8]]
        out[path.name] = entry
    return out


def index_actionscript() -> dict:
    """package/class/extends across the decompiled AS3 — L1b's search space."""
    classes: dict[str, dict] = {}
    per_bundle: Counter = Counter()
    if not DECOMPILED.is_dir():
        return {"bundles": {}, "classes": {}}
    for path in sorted(DECOMPILED.rglob("*.as")):
        bundle = path.relative_to(DECOMPILED).parts[0]
        per_bundle[bundle] += 1
        try:
            src = _read(path)
        except OSError:
            continue
        pkg_match = AS_PACKAGE_RE.search(src)
        for match in AS_CLASS_RE.finditer(src):
            name, extends, implements = match.groups()
            classes[f"{bundle}:{name}"] = {
                "file": str(path.relative_to(REPO)),
                "package": pkg_match.group(1) if pkg_match else "",
                "extends": extends or None,
                "implements": [s.strip() for s in implements.split(",")]
                if implements
                else [],
            }
    return {"bundles": dict(per_bundle), "class_count": len(classes), "classes": classes}


def index_frames() -> dict:
    """Manifest of reference/frames by directory -> A1 cites agents can reach."""
    out: dict[str, dict] = {}
    if not FRAMES.is_dir():
        return out
    for path in sorted(FRAMES.rglob("*")):
        if not path.is_file():
            continue
        key = str(path.parent.relative_to(FRAMES)) or "."
        entry = out.setdefault(key, {"count": 0, "extensions": {}, "examples": []})
        entry["count"] += 1
        ext = path.suffix.lower()
        entry["extensions"][ext] = entry["extensions"].get(ext, 0) + 1
        if len(entry["examples"]) < 6:
            entry["examples"].append(path.name)
    return out


def index_ui_strings() -> dict:
    path = EXTRACTED / "ui_strings.txt"
    if not path.is_file():
        return {}
    text = _read(path)
    lines = text.splitlines()
    return {
        "file": str(path.relative_to(REPO)),
        "line_count": len(lines),
        "font_faces": sorted(set(FONT_FACE_RE.findall(text))),
        "font_face_lines": [
            i for i, line in enumerate(lines, 1) if FONT_FACE_RE.search(line)
        ][:MAX_LINES_PER_TAG],
        "sample_lines": lines[:10],
    }


def index_payload_histogram() -> dict:
    """payload.xml is 329 MB — stream a tag histogram, never hold it in memory."""
    path = EXTRACTED / "payload.xml"
    if not path.is_file():
        return {}
    hist: Counter = Counter()
    try:
        for event, elem in ET.iterparse(str(path), events=("end",)):
            hist[elem.tag] += 1
            elem.clear()
    except ET.ParseError as exc:
        return {"file": str(path.relative_to(REPO)), "parse_error": str(exc),
                "tags": dict(hist.most_common(120))}
    return {
        "file": str(path.relative_to(REPO)),
        "bytes": path.stat().st_size,
        "distinct_tags": len(hist),
        "tags": dict(hist.most_common(120)),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", default=str(REPO / "docs/gauntlet/L0/index"))
    parser.add_argument("--skip-payload", action="store_true",
                        help="skip the 329 MB payload.xml histogram")
    args = parser.parse_args()

    if not EXTRACTED.is_dir():
        print(f"FATAL: {EXTRACTED} missing — reference/ is gitignored study material.",
              file=sys.stderr)
        return 2

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    written: list[tuple[str, int]] = []

    def emit(name: str, payload) -> None:
        target = out_dir / f"{name}.json"
        target.write_text(json.dumps(payload, indent=1, sort_keys=True), encoding="utf-8")
        written.append((target.name, target.stat().st_size))

    for filename in DATA_XMLS:
        path = EXTRACTED / filename
        if path.is_file():
            emit(path.stem, index_xml_file(path))
            print(f"  indexed {filename}")

    emit("bindata", sniff_bindata())
    print("  indexed bindata/")
    emit("ui_strings", index_ui_strings())
    print("  indexed ui_strings.txt")
    emit("frames", index_frames())
    print("  indexed frames/")
    emit("actionscript", index_actionscript())
    print("  indexed decompiled AS3")
    if not args.skip_payload:
        print("  streaming payload.xml (329 MB, ~1-3 min)...")
        emit("payload_histogram", index_payload_histogram())

    print("\nINDEX WRITTEN")
    for name, size in written:
        print(f"  {name:28s} {size:>10,} bytes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
