#!/usr/bin/env python3
"""buildLedgerEvidence.py — what the judged claim set actually proves about the ledger.

The `REBUILD_READINESS.md` rewrite is the point of lane L0, and it has exactly one
admissible input: claims that were JUDGED and SURVIVED (§0). Deciding which those are
by reading 1,300 claims by hand is how a refuted claim slips back in, so a script does
it and the binary gate (L0-B) independently re-checks the result.

**The three-way status, and why the middle one exists.**

    UPHELD      judged, survived its critics, and — where a critic ruled on the
                overturn specifically — the ledger sentence it names really does fall.
                These may rewrite the ledger.
    NOT-UPHELD  judged and survived AS A CLAIM, but the overturn was REJECTED: the
                sentence it points at does not fall. WF-3a rejected 46% of claimed
                overturns this way. The finding is still true and still worth banking
                as new knowledge — it just may not delete the line it aimed at.
    KILLED      refuted by a majority of its live critics, or never judged at all.
                Neither may enter the ledger; an unjudged claim is a LEAD (§0).

That middle bucket is the whole reason this script exists. "True" and "overturns the
thing it says it overturns" are different questions, and collapsing them is how a
readiness ledger gets rewritten by findings that never actually contradicted it.

Output: `docs/gauntlet/L0/LEDGER_EVIDENCE.md` + `.json`, grouped by the ledger sentence
each claim names, ready for the rewrite to work from section by section.

Usage:
    python3 scripts/gauntlet/buildLedgerEvidence.py --root docs/gauntlet/L0
"""

from __future__ import annotations

import argparse
import json
import re
from collections import defaultdict
from pathlib import Path

SYSTEMS = [
    "combat-core", "skills-meters", "progression", "rebirth-elements", "items-equipment",
    "economy", "enemies-ai", "world-exploration", "quests-story", "ui-hud",
    "art-anim-audio-feel", "meta-social",
]


def load_pooled(root: Path, kind: str) -> list[dict]:
    """Pool `<kind>.json` across every extracted run directory. Runs pool, never supersede."""
    rows: list[dict] = []
    for run_dir in sorted(root.glob("run*")):
        path = run_dir / f"{kind}.json"
        if path.is_file():
            rows += json.loads(path.read_text(encoding="utf-8"))
    return rows


def strength(claim: dict) -> tuple:
    klass = (claim.get("artifact_class") or "").strip()
    return (0 if klass in ("", "STILL_UNHELD") else 1,
            len(claim.get("cite") or ""), len(claim.get("quote") or ""))


def classify(rulings: list[dict]) -> tuple[str, str]:
    """(status, why) for one claim, from its LIVE verdicts only."""
    if not rulings:
        return "KILLED", "UNJUDGED — no artifact-citing critic ever ruled on it (§0: a lead, not a finding)"

    kills = sum(1 for v in rulings if v.get("refuted"))
    # Majority refute kills it (§3.3); with fewer than 3 critics, one refute is a majority.
    if kills >= (2 if len(rulings) >= 3 else 1):
        return "KILLED", f"REFUTED by {kills} of {len(rulings)} live critics"

    # The overturn is judged SEPARATELY from the claim. A claim can survive intact while
    # its overturn is rejected — that is the 46% case WF-3a found.
    rulings_on_overturn = [v for v in rulings if v.get("overturn_upheld") is not None]
    if rulings_on_overturn:
        upheld = sum(1 for v in rulings_on_overturn if v["overturn_upheld"])
        if upheld == 0:
            return "NOT-UPHELD", (
                f"claim survives, but {len(rulings_on_overturn)} critic(s) ruled the ledger "
                f"sentence it names does NOT fall")
        return "UPHELD", f"survived {len(rulings)} critic(s); overturn upheld by {upheld}"

    return "UPHELD", f"survived {len(rulings)} live critic(s); overturn not separately ruled on"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", default="docs/gauntlet/L0")
    args = ap.parse_args()
    root = Path(args.root)

    claims = load_pooled(root, "claims")
    verdicts = load_pooled(root, "verdicts")

    # VOID under §0: a verdict with no artifact of its own is not judgement.
    live: dict[str, list[dict]] = defaultdict(list)
    for v in verdicts:
        if (v.get("own_cite") or "").strip():
            live[v.get("claim_id")].append(v)

    by_id: dict[str, list[dict]] = defaultdict(list)
    for c in claims:
        by_id[c.get("id") or "<no-id>"].append(c)

    rows = []
    for cid, dupes in by_id.items():
        best = max(dupes, key=strength)
        status, why = classify(live.get(cid) or [])
        rows.append({
            "id": cid,
            "unit": best.get("unit") or "critic-new_finding",
            "status": status, "why": why,
            "artifact_class": best.get("artifact_class"),
            "cite": best.get("cite"), "text": best.get("text"),
            "build": best.get("build"),
            "claims_overturn": bool(best.get("overturns_ledger")),
            "ledger_text": (best.get("ledger_text") or "").strip(),
            "lane_impact": best.get("lane_impact"),
            "live_critics": len(live.get(cid) or []),
        })

    usable = [r for r in rows if r["status"] in ("UPHELD", "NOT-UPHELD")]
    overturns = [r for r in rows if r["status"] == "UPHELD" and r["claims_overturn"] and r["ledger_text"]]

    # Group the surviving overturns by the ledger sentence they name, so the rewrite can
    # work sentence by sentence instead of claim by claim.
    targets: dict[str, list[dict]] = defaultdict(list)
    for r in overturns:
        targets[r["ledger_text"][:220]].append(r)

    counts = {s: sum(1 for r in rows if r["status"] == s)
              for s in ("UPHELD", "NOT-UPHELD", "KILLED")}
    summary = {
        "claims_total": len(rows),
        **{k.lower().replace("-", "_"): v for k, v in counts.items()},
        "usable_findings": len(usable),
        "surviving_overturns": len(overturns),
        "ledger_sentences_hit": len(targets),
        "overturns_claimed_but_not_upheld": sum(
            1 for r in rows if r["status"] == "NOT-UPHELD" and r["claims_overturn"]),
    }

    (root / "LEDGER_EVIDENCE.json").write_text(
        json.dumps({"summary": summary, "claims": rows}, indent=1, sort_keys=True),
        encoding="utf-8")

    md = [
        "# L0 — LEDGER EVIDENCE",
        "",
        "> Generated by `scripts/gauntlet/buildLedgerEvidence.py`. The ONLY admissible input",
        "> to the `REBUILD_READINESS.md` rewrite: claims that were JUDGED and SURVIVED (§0).",
        "> Gate **L0-B** independently re-checks every `[[claim-id]]` the rewrite ends up citing.",
        "",
        f"- **UPHELD** {counts['UPHELD']} — survived, and where a critic ruled on the overturn, it holds.",
        f"- **NOT-UPHELD** {counts['NOT-UPHELD']} — TRUE, but the ledger sentence it names does not fall.",
        f"- **KILLED** {counts['KILLED']} — refuted by its critics, or never judged at all (a LEAD, §0).",
        "",
        f"**{len(overturns)} surviving overturns land on {len(targets)} distinct ledger sentences.**",
        f"**{summary['overturns_claimed_but_not_upheld']} claimed overturns were rejected** — the finding is",
        "real, the deletion it asked for is not. Collapsing those two is how a readiness ledger",
        "gets rewritten by findings that never actually contradicted it.",
        "",
        "---",
        "",
        "## Surviving overturns, grouped by the ledger sentence they name",
        "",
    ]
    for target, group in sorted(targets.items(), key=lambda kv: -len(kv[1])):
        md.append(f"### “{target}”")
        md.append("")
        md.append(f"*{len(group)} surviving finding(s) hit this line.*")
        md.append("")
        for r in sorted(group, key=lambda x: x["id"]):
            build = f" · build **{r['build']}**" if r.get("build") else ""
            md.append(f"- **`[[{r['id']}]]`** [{r['artifact_class']}] "
                      f"({r['live_critics']} critic{'s' if r['live_critics'] != 1 else ''}{build})")
            md.append(f"  - {r['text']}")
            md.append(f"  - Cite: `{(r['cite'] or '')[:300]}`")
            if r.get("lane_impact"):
                md.append(f"  - Lane impact: {r['lane_impact'][:300]}")
        md.append("")

    md += ["---", "", "## Rejected overturns — TRUE findings that do NOT delete the line they aim at", ""]
    for r in sorted((x for x in rows if x["status"] == "NOT-UPHELD" and x["claims_overturn"]),
                    key=lambda x: x["id"]):
        md.append(f"- **`{r['id']}`** — {r['why']}")
        md.append(f"  - aimed at: “{r['ledger_text'][:180]}”")
        md.append(f"  - the finding itself: {r['text']}")
    md.append("")

    md += ["---", "", "## Per-system tally of usable findings", "",
           "| system | UPHELD | NOT-UPHELD | KILLED |", "|---|---:|---:|---:|"]
    for unit in SYSTEMS + ["critic-new_finding"]:
        sub = [r for r in rows if r["unit"] == unit]
        if sub:
            md.append(f"| {unit} | {sum(1 for r in sub if r['status'] == 'UPHELD')} "
                      f"| {sum(1 for r in sub if r['status'] == 'NOT-UPHELD')} "
                      f"| {sum(1 for r in sub if r['status'] == 'KILLED')} |")
    md.append("")
    (root / "LEDGER_EVIDENCE.md").write_text("\n".join(md), encoding="utf-8")

    print(f"buildLedgerEvidence: {len(rows)} claims — "
          f"{counts['UPHELD']} UPHELD · {counts['NOT-UPHELD']} NOT-UPHELD · {counts['KILLED']} KILLED")
    print(f"  {len(overturns)} surviving overturns on {len(targets)} distinct ledger sentences")
    print(f"  {summary['overturns_claimed_but_not_upheld']} claimed overturns REJECTED "
          f"(true finding, wrong target)")
    print(f"  -> {root/'LEDGER_EVIDENCE.md'} + .json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
