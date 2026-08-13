#!/usr/bin/env python3
"""salvageJournal.py — extract a workflow journal into durable, readable form.

The salvage pattern (validated 4x, latest 2026-08-13): a dead multi-agent fan-out
is recoverable, because the journal, the per-agent transcripts and the script all
survive. This script does the "extract journal results to files IMMEDIATELY" step
so nothing depends on the harness's internal journal format later.

Usage:
    python3 scripts/gauntlet/salvageJournal.py <journal.jsonl> --out docs/gauntlet/L0
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def load(journal: Path) -> list[dict]:
    out = []
    for line in journal.read_text(encoding="utf-8", errors="replace").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            out.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("journal")
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    results = [r["result"] for r in load(Path(args.journal))
               if isinstance(r.get("result"), dict)]
    surveys = [r for r in results if "claims" in r and "unit" in r]
    critics = [r for r in results if "verdicts" in r]

    claims = []
    for survey in surveys:
        for claim in survey.get("claims") or []:
            claims.append({**claim, "unit": survey.get("unit")})

    verdicts = []
    for critic in critics:
        verdicts.extend(critic.get("verdicts") or [])
        for finding in critic.get("new_findings") or []:
            claims.append({**finding, "origin": "critic"})

    (out_dir / "claims.json").write_text(
        json.dumps(claims, indent=1, sort_keys=True), encoding="utf-8")
    (out_dir / "verdicts.json").write_text(
        json.dumps(verdicts, indent=1, sort_keys=True), encoding="utf-8")

    # Human-readable roll-up, grouped by system, overturns first.
    lines = ["# L0 — salvaged claim set (raw surveyor output)", "",
             "> **UNVERIFIED.** These are surveyor claims. A claim is only CONFIRMED",
             "> once blind artifact-citing critics have judged it (GAUNTLET.md §0/§3.3).",
             f"> Banked: {len(surveys)} surveys · {len(critics)} critic reviews · "
             f"{len(claims)} claims · {len(verdicts)} verdicts.", ""]
    by_unit: dict[str, list[dict]] = {}
    for claim in claims:
        by_unit.setdefault(claim.get("unit") or "unassigned", []).append(claim)

    for unit in sorted(by_unit):
        survey = next((s for s in surveys if s.get("unit") == unit), {})
        lines.append(f"## {unit} — re-scored {survey.get('new_score', '?')}")
        if survey.get("score_rationale"):
            lines.append("")
            lines.append(f"{survey['score_rationale']}")
        lines.append("")
        ordered = sorted(by_unit[unit],
                         key=lambda c: (not c.get("overturns_ledger"), c.get("id") or ""))
        for claim in ordered:
            flag = " ⚑ OVERTURNS LEDGER" if claim.get("overturns_ledger") else ""
            lines.append(f"### `{claim.get('id')}` — {claim.get('verdict')}"
                         f" [{claim.get('artifact_class')}]{flag}")
            lines.append("")
            lines.append(f"{claim.get('text', '')}")
            lines.append("")
            if claim.get("cite"):
                lines.append(f"- **Cite:** `{claim['cite']}`")
            if claim.get("quote"):
                lines.append(f"- **Quote:** {claim['quote'][:600]}")
            if claim.get("ledger_text"):
                lines.append(f"- **Overturns:** \"{claim['ledger_text'][:400]}\"")
            if claim.get("lane_impact"):
                lines.append(f"- **Lane impact:** {claim['lane_impact']}")
            lines.append("")
    (out_dir / "CLAIMS.md").write_text("\n".join(lines), encoding="utf-8")

    print(f"surveys={len(surveys)} critics={len(critics)} "
          f"claims={len(claims)} verdicts={len(verdicts)}")
    for name in ("claims.json", "verdicts.json", "CLAIMS.md"):
        print(f"  wrote {out_dir/name}  ({(out_dir/name).stat().st_size:,} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
