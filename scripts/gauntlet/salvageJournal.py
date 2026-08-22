#!/usr/bin/env python3
"""salvageJournal.py — extract a dead workflow run into durable, readable form.

The salvage pattern (validated 8x, latest 2026-08-22): a dead multi-agent fan-out is
recoverable, because the journal, the per-agent transcripts, the on-disk agent output
and the script all survive. This script does the "extract results to files IMMEDIATELY"
step so nothing depends on the harness's internal journal format later.

TWO INPUTS, because wall #8 proved one was not enough.

  <journal.jsonl>   the harness journal, one JSON object per line, results under
                    `result`. The normal path: it holds every agent that RETURNED.

  --critic-json     a glob over the structured objects agents write to disk THEMSELVES
                    before returning. At wall #8 both workflows reported `0 agents
                    done` while seven finished critic reviews sat on disk — and the
                    journals held zero result records, so this script could extract
                    nothing. The prose survived; the structured verdicts did not, and
                    §3.2 bars a blind re-judge from reading another agent's prose, so
                    that judging was destroyed rather than merely misplaced. The
                    workflows now write the exact returned object alongside the prose,
                    and this flag reads it whether or not the journal ever landed.

Both may be given at once — the usual case after a PARTIAL wall, where some agents
returned and others only reached disk. Rows are deduped so an agent that did both is
not counted twice: verdicts by (claim_id, own_cite, reason), claims by id. Double-
counting a verdict is not cosmetic — gate L0-B decides "refuted" by a majority of live
rulings, and a duplicated ruling is a majority that never happened.

Usage:
    python3 scripts/gauntlet/salvageJournal.py <journal.jsonl> --out docs/gauntlet/L0
    python3 scripts/gauntlet/salvageJournal.py --out docs/gauntlet/L0/run8 \
        --critic-json 'docs/gauntlet/L0/critics/*.s26a.json'
"""

from __future__ import annotations

import argparse
import glob as globlib
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


def load_sidecars(patterns: list[str]) -> list[dict]:
    """Load the structured objects agents wrote to disk themselves.

    A side-file that will not parse is NAMED, never skipped quietly (§3, no silent
    caps): a truncated write is exactly what a usage wall produces, and a salvage that
    silently drops one reads as a salvage that recovered everything.
    """
    results: list[dict] = []
    for pattern in patterns:
        paths = sorted(globlib.glob(pattern))
        print(f"  --critic-json {pattern} matched {len(paths)} files")
        for path in paths:
            try:
                obj = json.loads(Path(path).read_text(encoding="utf-8"))
            except (json.JSONDecodeError, UnicodeDecodeError) as exc:
                print(f"  ⚠ UNPARSEABLE side-file, NOT recovered: {path} ({exc})")
                continue
            if isinstance(obj, dict):
                results.append(obj)
            else:
                print(f"  ⚠ side-file is not an object, NOT recovered: {path}")
    return results


def dedupe(rows: list[dict], key) -> tuple[list[dict], int]:
    """Drop rows whose key was already seen, keeping the first. Returns (kept, dropped)."""
    seen, kept = set(), []
    for row in rows:
        k = key(row)
        if k in seen:
            continue
        seen.add(k)
        kept.append(row)
    return kept, len(rows) - len(kept)


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("journal", nargs="?",
                        help="the harness journal. Omit it when only the agents' own "
                             "on-disk side-files survived — that is wall #8's case.")
    parser.add_argument("--critic-json", action="append", default=[], metavar="GLOB",
                        help="glob over the structured objects agents wrote to disk "
                             "before returning. Repeatable.")
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    if not args.journal and not args.critic_json:
        parser.error("nothing to salvage: give a journal, a --critic-json glob, or both")

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    results = []
    if args.journal:
        results += [r["result"] for r in load(Path(args.journal))
                    if isinstance(r.get("result"), dict)]
    results += load_sidecars(args.critic_json)

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

    # An agent that RETURNED and also wrote its side-file lands twice. Dedupe before
    # anything downstream pools these: gate L0-B rules a claim refuted on a MAJORITY of
    # its live verdicts, so one duplicated ruling manufactures a majority.
    claims, dropped_claims = dedupe(claims, lambda c: c.get("id"))
    verdicts, dropped_verdicts = dedupe(
        verdicts,
        lambda v: (v.get("claim_id"), (v.get("own_cite") or "").strip(), v.get("reason")))

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
          f"claims={len(claims)} verdicts={len(verdicts)} "
          f"(deduped {dropped_claims} claim rows, {dropped_verdicts} verdict rows)")
    for name in ("claims.json", "verdicts.json", "CLAIMS.md"):
        print(f"  wrote {out_dir/name}  ({(out_dir/name).stat().st_size:,} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
