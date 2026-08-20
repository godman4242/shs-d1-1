#!/usr/bin/env python3
"""gateL0.py — the BINARY gate for gauntlet lane L0.

`GAUNTLET.md` §3.6: *"Binary. Every item green with pasted output, or the lane is open.
Never soften a gate to fit a result."* A gate a human eyeballs is a gate that gets
softened, so every item here is decided mechanically and the script exits non-zero if
any is red.

    L0-A  CITE INTEGRITY        every claim the ledger cites has a resolving cite
    L0-B  NOTHING UNJUDGED      every claim the ledger cites was JUDGED and SURVIVED
    L0-C  CONVERGENCE IS REAL   two dry rounds that ACTUALLY RAN, zero dead rounds
    L0-D  EVERY SOURCE OPENED   all 10 sources surveyed AND >= 2 critics each
    L0-E  §6 PROVABLY MINIMAL   each surviving entry carries a pasted negative search
    L0-F  SCORECARD CARRIES ITS EVIDENCE  every system score cites a claim or says
                                          STILL_UNHELD out loud

**L0-B is the load-bearing one.** §0 says an UNJUDGED claim is a LEAD and may not enter
the ledger. That rule does not get broken by anyone deciding to break it — it breaks when
a claim quietly drifts into a rewrite nobody re-checked. So the rewritten ledger cites
its evidence as `[[unit/claim-slug]]`, and this gate resolves every reference against the
pooled verdicts. A claim with no verdict, or whose only verdicts are VOID (no `own_cite`,
§0), or which the critics refuted, turns the gate red and names itself.

Usage:
    python3 scripts/gauntlet/gateL0.py --root docs/gauntlet/L0 \\
        --ledger docs/research/REBUILD_READINESS.md --out docs/gauntlet/L0/gate.json
"""

from __future__ import annotations

import argparse
import json
import re
from collections import defaultdict
from pathlib import Path

# The 10 evidence sources. L0 is not done while any of them is unopened or unjudged.
SOURCES = [
    "questdata", "skilldata", "npcdata", "itemdata", "bindata", "actionscript",
    "android-blobs", "string-table", "frames", "uistrings-payload",
]

# The 12 ledger systems, in scorecard order.
SYSTEMS = [
    "combat-core", "skills-meters", "progression", "rebirth-elements", "items-equipment",
    "economy", "enemies-ai", "world-exploration", "quests-story", "ui-hud",
    "art-anim-audio-feel", "meta-social",
]

MIN_CRITICS_PER_SOURCE = 2

# How the rewritten ledger points at its evidence.
CLAIM_REF_RE = re.compile(r"\[\[([^\]\[]+)\]\]")

# A §6 entry that survives must show the search that failed to find it. "I looked and did
# not find it" is worthless without the command and its output (§3, no silent caps).
NEGATIVE_SEARCH_MARKER = "NEGATIVE-SEARCH:"


def load_pooled(root: Path, kind: str) -> list[dict]:
    """Pool `<kind>.json` across every extracted run directory.

    Runs POOL, they never supersede: a later run judges earlier claims and adds new
    ones, so reading only the newest would silently shrink the judged set.
    """
    rows: list[dict] = []
    for run_dir in sorted(root.glob("run*")):
        path = run_dir / f"{kind}.json"
        if path.is_file():
            rows += json.loads(path.read_text(encoding="utf-8"))
    return rows


def load_lint(root: Path) -> dict[str, dict]:
    """Pool every citeLint report, keeping the WORST status seen for each id."""
    rank = {"BROKEN": 3, "QUOTE_UNVERIFIED": 2, "UNCHECKABLE": 1, "RESOLVES": 0}
    worst: dict[str, dict] = {}
    for path in sorted(root.glob("citelint*.json")):
        for row in json.loads(path.read_text(encoding="utf-8"))["claims"]:
            prior = worst.get(row["id"])
            if prior is None or rank[row["status"]] > rank[prior["status"]]:
                worst[row["id"]] = row
    return worst


def section(text: str, number: str) -> str:
    """The body of a numbered markdown section, up to the next same-level heading."""
    match = re.search(rf"^##\s*{re.escape(number)}\.?\s.*$", text, re.M)
    if not match:
        return ""
    rest = text[match.end():]
    nxt = re.search(r"^##\s", rest, re.M)
    return rest[: nxt.start()] if nxt else rest


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", default="docs/gauntlet/L0")
    ap.add_argument("--ledger", default="docs/research/REBUILD_READINESS.md")
    ap.add_argument("--out", default="docs/gauntlet/L0/gate.json")
    args = ap.parse_args()

    root = Path(args.root)
    ledger_path = Path(args.ledger)
    ledger = ledger_path.read_text(encoding="utf-8") if ledger_path.is_file() else ""

    claims = load_pooled(root, "claims")
    verdicts = load_pooled(root, "verdicts")
    lint = load_lint(root)

    known_ids = {c.get("id") for c in claims}
    # A verdict with no artifact of its own is VOID under §0 and is not judgement.
    live: dict[str, list[dict]] = defaultdict(list)
    for v in verdicts:
        if (v.get("own_cite") or "").strip():
            live[v.get("claim_id")].append(v)

    cited = sorted({m.group(1).strip() for m in CLAIM_REF_RE.finditer(ledger)})
    gates: list[dict] = []

    def add(gid: str, title: str, green: bool, detail: str) -> None:
        gates.append({"id": gid, "title": title, "green": green, "detail": detail})

    # ---- L0-A  CITE INTEGRITY ---------------------------------------------
    # THE GATE'S OWN FAIL-OPEN, closed here. With an un-rewritten ledger `cited` is
    # empty, so "every cited claim resolves" and "every cited claim was judged" are
    # both VACUOUSLY TRUE — and a vacuous green reads as a pass. An un-rewritten
    # ledger is an OPEN lane, and both gates must say so rather than smile at nothing.
    NO_REFS = "the ledger cites no claim at all — the rewrite has not happened, so this passes vacuously"
    broken = [cid for cid in cited if (lint.get(cid) or {}).get("status") == "BROKEN"]
    unlinted = [cid for cid in cited if cid in known_ids and cid not in lint]
    add("L0-A", "CITE INTEGRITY", bool(cited) and not broken and not unlinted,
        NO_REFS if not cited
        else "every ledger-cited claim resolves" if not broken and not unlinted
        else "; ".join(filter(None, [
            f"BROKEN cites: {', '.join(broken)}" if broken else "",
            f"never linted: {', '.join(unlinted)}" if unlinted else "",
        ])))

    # ---- L0-B  NOTHING UNJUDGED IN THE LEDGER -----------------------------
    unknown = [cid for cid in cited if cid not in known_ids]
    unjudged = [cid for cid in cited if cid in known_ids and not live.get(cid)]
    refuted = []
    for cid in cited:
        rulings = live.get(cid) or []
        if not rulings:
            continue
        kills = sum(1 for v in rulings if v.get("refuted"))
        if kills >= (2 if len(rulings) >= 3 else 1):
            refuted.append(cid)
    ok = bool(cited) and not (unknown or unjudged or refuted)
    add("L0-B", "NOTHING UNJUDGED IN THE LEDGER", ok,
        NO_REFS if not cited
        else f"all {len(cited)} ledger-cited claims judged and surviving" if ok
        else "; ".join(filter(None, [
            f"NO SUCH CLAIM: {', '.join(unknown)}" if unknown else "",
            f"UNJUDGED (a lead, not a finding): {', '.join(unjudged)}" if unjudged else "",
            f"REFUTED by its critics: {', '.join(refuted)}" if refuted else "",
        ])))

    # ---- L0-C  CONVERGENCE IS REAL ----------------------------------------
    receipt_path = root / "convergence.json"
    if not receipt_path.is_file():
        add("L0-C", "CONVERGENCE IS REAL", False,
            f"no convergence receipt at {receipt_path} — the dry-loop has not run")
    else:
        receipt = json.loads(receipt_path.read_text(encoding="utf-8"))
        dead = int(receipt.get("dead_rounds") or 0)
        streak = int(receipt.get("dry_streak") or 0)
        ok = bool(receipt.get("converged")) and dead == 0 and streak >= 2
        add("L0-C", "CONVERGENCE IS REAL", ok,
            f"{receipt.get('rounds_run')} rounds run, dry streak {streak}, 0 dead rounds" if ok
            else (f"converged={receipt.get('converged')} dry_streak={streak} "
                  f"dead_rounds={dead} — a round where agents died is NOT a round that "
                  f"found nothing (§0) and may not count toward convergence"))

    # ---- L0-D  EVERY SOURCE OPENED ----------------------------------------
    problems = []
    for unit in SOURCES:
        if not (root / "sources" / f"{unit}.md").is_file():
            problems.append(f"{unit}: NEVER SURVEYED")
            continue
        n = len(list((root / "critics").glob(f"src-{unit}.*.md")))
        if n < MIN_CRITICS_PER_SOURCE:
            problems.append(f"{unit}: only {n} critic review(s), need {MIN_CRITICS_PER_SOURCE}")
    add("L0-D", "EVERY SOURCE OPENED", not problems,
        f"all {len(SOURCES)} sources surveyed with >= {MIN_CRITICS_PER_SOURCE} critics each"
        if not problems else "; ".join(problems))

    # ---- L0-E  §6 IS PROVABLY MINIMAL -------------------------------------
    six = section(ledger, "6")
    entries = [ln for ln in six.splitlines() if ln.strip().startswith(("- ", "* "))]
    naked = [ln.strip() for ln in entries if NEGATIVE_SEARCH_MARKER not in ln]
    add("L0-E", "§6 IS PROVABLY MINIMAL", not naked,
        f"{len(entries)} surviving entr(y/ies), each carrying a pasted negative search"
        if not naked else
        f"kept without a pasted negative search: " +
        "; ".join(ln[:110] for ln in naked))

    # ---- L0-F  SCORECARD CARRIES ITS EVIDENCE -----------------------------
    scorecard = section(ledger, "2")
    missing = []
    for unit in SYSTEMS:
        row = next((ln for ln in scorecard.splitlines()
                    if ln.strip().startswith("|") and re.search(rf"\b{re.escape(unit)}\b", ln)), None)
        if row is None:
            missing.append(f"{unit}: no scorecard row")
        elif not CLAIM_REF_RE.search(row) and "STILL_UNHELD" not in row:
            missing.append(f"{unit}: score carries neither a [[claim]] nor an explicit STILL_UNHELD")
    add("L0-F", "SCORECARD CARRIES ITS EVIDENCE", not missing,
        f"all {len(SYSTEMS)} system scores carry an A-class cite or an explicit STILL_UNHELD"
        if not missing else "; ".join(missing))

    report = {
        "green": all(g["green"] for g in gates),
        "gates": gates,
        "pooled": {"claims": len(claims), "verdicts": len(verdicts),
                   "live_verdicts": sum(len(v) for v in live.values()),
                   "judged_ids": len(live), "ledger_refs": len(cited)},
    }
    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    Path(args.out).write_text(json.dumps(report, indent=1, sort_keys=True), encoding="utf-8")

    print(f"GATE L0 — {len(claims)} claims pooled · {len(live)} judged ids · "
          f"{len(cited)} ledger references")
    print("=" * 78)
    for g in gates:
        print(f"  {'GREEN' if g['green'] else ' RED '}  {g['id']}  {g['title']}")
        print(f"           {g['detail']}")
    print("=" * 78)
    print("LANE L0: " + ("✅ GREEN — every gate item passes"
                         if report["green"] else "⛔ OPEN — at least one gate item is RED"))
    return 0 if report["green"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
