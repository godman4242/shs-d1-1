#!/usr/bin/env python3
"""citeLint.py — the deterministic half of the GAUNTLET §0 cite lens.

§0's law: *a verdict that does not cite an artifact is VOID, and a claim whose
cite does not resolve is REFUTED, full stop.* Half of that is not a judgement at
all — "does the file exist / is the line in range" is a `for` loop. §2's standing
rule is **A SCRIPT BEATS A SWARM**, so this runs BEFORE the agent critics and
kills fabricated or mis-resolved cites at zero agent cost. The critics then spend
their whole budget on the part a script genuinely cannot do: whether the artifact
actually *says* what the claim says it says.

STATUSES — deliberately three, not two:

    RESOLVES          every cited path exists, every line ref is in range, and the
                      quote was located in a cited text artifact.
    BROKEN            a HARD, unambiguous defect: a path that is not there, a line
                      past end-of-file, or an artifact class asserted with no cite
                      at all. Auto-REFUTED under §0. Never enters the ledger.
    QUOTE_UNVERIFIED  paths and lines are fine, but the quoted text could not be
                      located in any cited text file. A PRIORITY TARGET for the
                      agent cite-critics — NOT an automatic kill.
    UNCHECKABLE       an honest STILL_UNHELD with no cite, or a cite naming no repo
                      path. Not a pass: a human or an agent still has to judge it.

**Why QUOTE_UNVERIFIED is soft, measured not assumed.** In this corpus the `quote`
field is a prose GLOSS with verbatim material embedded in it — "Visible in the
crop: a 'GUEST' fighter ... Code side: public static var equipment:Vector.<Item>"
— not a clean excerpt. Demanding a whole-quote match failed 642 of 1,087 real
claims; matching quoted spans, XML runs and 6-word shingles cuts that to 177.
A gate that cries wolf 642 times gets ignored, which is worse than no gate, so the
script reports what it can prove and routes the ambiguous residue to the critics.

Exit code is 1 if any claim is BROKEN, so it works as a binary gate (L0-A).

Usage:
    python3 scripts/gauntlet/citeLint.py docs/gauntlet/L0/run2/claims.json \\
        --repo . --out docs/gauntlet/L0/citelint.json
"""

from __future__ import annotations

import argparse
import glob as globlib
import json
import re
import sys
from pathlib import Path

# Cited paths are anchored on a known repo root. Anchoring (rather than "any token
# with a slash") is what stops prose like `crop=iw*0.55:ih*0.20` and `t=48:04`
# being mistaken for a file reference.
# `scripts/` is NOT a root. A cite saying `scripts/§1t51s0§/` means a package inside
# a decompiled bundle, not `<repo>/scripts/` — anchoring on it invented a
# MISSING_PATH and killed a claim whose other cite was sound. Only the repo's real
# script subdirectories count.
ROOTS = ("reference/", "src/", "tests/", "docs/", "public/",
         "scripts/gauntlet/", "scripts/anim/", "scripts/art/")

# A path token: a root, then any run of characters plausible in a filename. `§` is
# deliberately allowed — the decompiled web payload really does contain files
# named `§1t5957s0§.as`. Braces survive the token so `{t1004.800,t1005.000}.png`
# arrives whole; `resolve()` expands them.
#
# The lookbehind is load-bearing: `scripts/` is a root, so without it a cite that
# elides a prefix — ".../scripts/Damage.as" — would anchor on the mid-path
# fragment and report a MISSING_PATH for a file that is right there under its full
# path elsewhere in the same cite. A false BROKEN auto-refutes a real finding
# under §0, so the parser must never invent one.
PATH_RE = re.compile(
    r"(?<![\w/§.\-])(?:" + "|".join(re.escape(r) for r in ROOTS) + r")"
    # a run of ordinary filename characters, OR a whole `{a,b}` / `[0-9]` group —
    # the group alternatives keep a comma inside braces, or a bracketed character
    # class in a glob, from ending the token early.
    r"(?:\{[^{}]*\}|\[[^\[\]]*\]|[^\s,;()\[\]'\"])*"
)

# Line specs GLUED to a path token. `/` is a legal filename character, so
# `WarHex.as:424/478/521/541` arrives as one token with the whole run attached.
# Deliberately strict: an unrecognised tail stays part of the path and surfaces as
# MISSING_PATH, which is the safe direction for a lint to err in.
GLUED_SPEC_RE = re.compile(r":\d+(?:-\d+)?(?:[,/](?::)?\d+(?:-\d+)?)*$")

# Line specs that TRAIL a path in the surrounding prose: `StatsManager.as:158,:160`.
LINESPEC_RE = re.compile(r"^(?::(\d+)(?:-(\d+))?|[,/](?::)?(\d+)(?:-(\d+))?)")

# Artifact classes whose evidence is an image, a video or a packed binary:
# existence is checkable, the content is not. Never demand a quote match of these.
TEXTLESS_SUFFIXES = {
    ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp", ".mp4", ".mov", ".webm",
    ".swf", ".bin", ".zip", ".ttf", ".otf", ".mp3", ".wav", ".ogg",
}

# `reference/extracted/payload.xml` is 329 MB. Reading it to substring-match a
# quote would make the gate unusable, so past this size the quote check is SKIPPED
# — and says so. A silent skip would read as a pass (§3 "no silent caps").
QUOTE_SCAN_MAX_BYTES = 12 * 1024 * 1024

# Below this a candidate is too generic to prove anything: `return` or `<name>`
# would match almost any file in the corpus.
MIN_CANDIDATE_CHARS = 15

# Spans the surveyors actually mark as verbatim, and the shingle fallback for the
# ones they don't.
QUOTED_SPAN_RE = re.compile(r'"([^"]{15,})"|“([^”]{15,})”|\'([^\']{15,})\'')
XML_RUN_RE = re.compile(r"(<[a-z_][\w:-]*>[^<]{1,80}</[a-z_][\w:-]*>)", re.I)
SHINGLE_WORDS = 6
LONG_TOKEN_CHARS = 28


def normalise(text: str) -> str:
    """Collapse whitespace and lowercase, so a re-wrapped quote still matches.

    Also un-escapes the literal `\\n` / `\\t` sequences agents paste when they
    hand-transcribe a multi-line excerpt into a single JSON string.
    """
    text = text.replace("\\n", " ").replace("\\t", " ").replace('\\"', '"').replace("\\'", "'")
    return re.sub(r"\s+", " ", text).strip().lower()


def expand_spec(spec: str) -> list[int]:
    """`:149-170` -> [149, 170]; `,:160` -> [160]. Only the endpoints are checked."""
    return [int(n) for n in re.findall(r"\d+", spec)]


def parse_cites(cite: str) -> list[tuple[str, list[int]]]:
    """Pull (path, [line numbers]) out of a free-prose cite string.

    Surveyors write cites as sentences, not as structured data:
        "Damage.as:149-170 (getMinDamage) + MCSPlayer.as:3415-3418 (call site)"
    so the parser walks the string and, after each path token, consumes as many
    line specs as are attached to it.
    """
    out: list[tuple[str, list[int]]] = []
    for match in PATH_RE.finditer(cite):
        path = match.group(0)
        pos = match.end()
        lines: list[int] = []

        glued = GLUED_SPEC_RE.search(path)
        if glued:
            path = path[: glued.start()]
            lines.extend(expand_spec(glued.group(0)))

        while True:
            nxt = LINESPEC_RE.match(cite[pos:])
            if not nxt:
                break
            lines.extend(expand_spec(nxt.group(0)))
            pos += nxt.end()

        path = path.rstrip(".,;:'\")`")
        if path:
            out.append((path, lines))
    return out


def quote_candidates(quote: str) -> set[str]:
    """Independently-checkable fragments of a quote.

    The corpus's quotes interleave verbatim excerpts with the surveyor's own
    annotations, so a whole-quote match is hopeless and a single long shingle
    straddles the boundary. Candidates are therefore: anything the surveyor
    themselves marked as quoted, any complete XML element, any 6-word run, and any
    single very long token (an obfuscated identifier or a full path). ONE landing
    in a cited file is enough to show the quote came from the artifact.
    """
    out: set[str] = set()
    for m in QUOTED_SPAN_RE.finditer(quote):
        span = next((g for g in m.groups() if g), "")
        out.add(normalise(span))
    for m in XML_RUN_RE.finditer(quote):
        out.add(normalise(m.group(1)))

    words = normalise(quote).split()
    out |= {" ".join(words[i:i + SHINGLE_WORDS])
            for i in range(0, max(0, len(words) - SHINGLE_WORDS + 1))}
    out |= {w for w in words if len(w) >= LONG_TOKEN_CHARS}
    return {c for c in out if len(c) >= MIN_CANDIDATE_CHARS}


class Corpus:
    """Normalised file bodies, read once. The AS3 corpus is re-cited constantly."""

    def __init__(self) -> None:
        self._cache: dict[str, str] = {}

    def text(self, path: Path) -> str:
        key = str(path)
        if key not in self._cache:
            try:
                self._cache[key] = normalise(path.read_text(encoding="utf-8", errors="replace"))
            except OSError:
                self._cache[key] = ""
        return self._cache[key]


def expand_braces(rel: str) -> list[str]:
    """`frames/{t1004.800,t1005.000}.png` -> both paths.

    Agents cite sibling frames and sibling classes with shell brace expansion.
    `glob` does not implement it, so without this the pair reads as one absent
    file and the claim is falsely killed.
    """
    m = re.search(r"\{([^{}]*)\}", rel)
    if not m:
        return [rel]
    out: list[str] = []
    for option in m.group(1).split(","):
        out.extend(expand_braces(rel[: m.start()] + option.strip() + rel[m.end():]))
    return out


def resolve(rel: str, repo: Path) -> list[Path]:
    """Expand a cited path: brace forms, the `bindata/*.bin` glob form, or a plain path.

    Falls back to peeling a trailing line spec the strict parser would not touch
    (`Damage.as:5ff`, `InteractUI.as:1058-1061ff`). Recovering the file is right:
    the alternative is a MISSING_PATH that auto-refutes a sound claim over a typo.
    """
    found: list[Path] = []
    for variant in expand_braces(rel):
        if "*" in variant or "?" in variant:
            found.extend(Path(p) for p in sorted(globlib.glob(str(repo / variant))))
            continue
        target = repo / variant
        if target.exists():
            found.append(target)
            continue
        head = re.split(r":\d", variant, maxsplit=1)[0]
        if head != variant and (repo / head).exists():
            found.append(repo / head)
            continue
        # `Sprite_755/1-5.png` is the frame-RANGE shorthand for an exported sprite
        # (`1.png` … `5.png`), not a filename. Accept the first frame as proof the
        # artifact is there rather than killing the claim over the shorthand.
        rng = re.match(r"^(.*?)(\d+)-(\d+)(\.[A-Za-z0-9]+)$", variant)
        if rng and (repo / f"{rng.group(1)}{rng.group(2)}{rng.group(4)}").exists():
            found.append(repo / f"{rng.group(1)}{rng.group(2)}{rng.group(4)}")
            continue
        # `strings.json["4041"]` is a key lookup INTO the artifact, not a filename.
        # The bracket group has to stay in the token (glob character classes need
        # it), so the subscript is peeled here instead.
        keyed = re.sub(r"\[[^\[\]]*\]$", "", variant)
        if keyed != variant and (repo / keyed).exists():
            found.append(repo / keyed)
            continue
        # Same key lookup, but with prose glued straight onto it —
        # `strings.json["83"]='Blacksmith'`. Truncating at the first `[` recovers the
        # file whatever follows it. Last resort, and only when nothing above matched.
        head = variant.split("[", 1)[0]
        if head != variant and head and (repo / head).is_file():
            found.append(repo / head)
    return found


def check_claim(claim: dict, repo: Path, corpus: Corpus) -> dict:
    """Lint one claim. Returns its report row."""
    cid = claim.get("id") or "<no-id>"
    klass = (claim.get("artifact_class") or "").strip()
    cite = (claim.get("cite") or "").strip()
    quote = (claim.get("quote") or "").strip()
    problems: list[str] = []
    notes: list[str] = []

    if not cite:
        # STILL_UNHELD with no cite is the CORRECT answer under §0, not a defect.
        # Any other class asserting an artifact without naming one is a violation.
        if klass in ("", "STILL_UNHELD"):
            return {"id": cid, "artifact_class": klass, "status": "UNCHECKABLE",
                    "problems": ["NO_CITE_STILL_UNHELD"], "notes": [], "paths": []}
        return {"id": cid, "artifact_class": klass, "status": "BROKEN",
                "problems": [f"EMPTY_CITE:class={klass}"], "notes": [], "paths": []}

    refs = parse_cites(cite)
    if not refs:
        return {"id": cid, "artifact_class": klass, "status": "UNCHECKABLE",
                "problems": ["NO_PARSEABLE_PATH"], "notes": [], "paths": []}

    candidates = quote_candidates(quote)
    quote_found = False
    quote_scannable = False
    seen_paths: list[str] = []

    for rel, lines in refs:
        seen_paths.append(rel)
        matches = resolve(rel, repo)
        if not matches:
            problems.append(f"MISSING_PATH:{rel}")
            continue

        for target in matches:
            if target.is_dir():
                continue  # a directory cite ("the 8 slot-dummy classes in .../scripts/")

            if target.suffix.lower() in TEXTLESS_SUFFIXES:
                if lines:
                    # Citing a line inside a PNG or a packed .bin is meaningless but
                    # harmless — the artifact is still there. Note it, do not kill it.
                    notes.append(f"LINE_ON_BINARY:{rel}")
                continue

            try:
                body = target.read_text(encoding="utf-8", errors="replace")
            except OSError as exc:  # present but unreadable — say so, never guess
                problems.append(f"UNREADABLE:{rel}:{exc.__class__.__name__}")
                continue

            if lines:
                total = body.count("\n") + 1
                for n in lines:
                    if n < 1 or n > total:
                        problems.append(f"LINE_OOR:{rel}:{n}>{total}")

            if candidates and not quote_found:
                if target.stat().st_size > QUOTE_SCAN_MAX_BYTES:
                    notes.append(f"QUOTE_SKIPPED_LARGE:{rel}")
                    continue
                quote_scannable = True
                hay = corpus.text(target)
                if any(c in hay for c in candidates):
                    quote_found = True

    if problems:
        status = "BROKEN"
    elif candidates and quote_scannable and not quote_found:
        status = "QUOTE_UNVERIFIED"
        notes.append("QUOTE_NOT_LOCATED")
    else:
        status = "RESOLVES"

    return {"id": cid, "artifact_class": klass, "status": status,
            "problems": problems, "notes": notes, "paths": seen_paths}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("claims", help="a claims JSON (list of claim objects)")
    ap.add_argument("--repo", default=".", help="repo root the cites are relative to")
    ap.add_argument("--out", required=True, help="where to write the JSON report")
    ap.add_argument("--quiet", action="store_true", help="suppress the per-problem listing")
    args = ap.parse_args()

    repo = Path(args.repo).resolve()
    claims = json.loads(Path(args.claims).read_text(encoding="utf-8"))
    if isinstance(claims, dict):  # tolerate {"claims": [...]} wrappers
        claims = claims.get("claims") or []

    corpus = Corpus()
    rows = [check_claim(c, repo, corpus) for c in claims]

    def count(status: str) -> int:
        return sum(1 for r in rows if r["status"] == status)

    summary = {
        "total": len(rows),
        "resolves": count("RESOLVES"),
        "broken": count("BROKEN"),
        "quote_unverified": count("QUOTE_UNVERIFIED"),
        "uncheckable": count("UNCHECKABLE"),
    }
    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    Path(args.out).write_text(
        json.dumps({"summary": summary, "repo": str(repo), "claims": rows},
                   indent=1, sort_keys=True),
        encoding="utf-8")

    print(f"citeLint: {summary['total']} claims — {summary['resolves']} RESOLVES · "
          f"{summary['broken']} BROKEN · {summary['quote_unverified']} QUOTE_UNVERIFIED · "
          f"{summary['uncheckable']} UNCHECKABLE  -> {args.out}")
    if not args.quiet:
        for r in rows:
            if r["status"] == "BROKEN":
                print(f"  BROKEN  {r['id']}  {'; '.join(r['problems'])}")
    return 1 if summary["broken"] else 0


if __name__ == "__main__":
    sys.exit(main())
