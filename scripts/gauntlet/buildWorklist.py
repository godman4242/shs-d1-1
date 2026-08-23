#!/usr/bin/env python3
"""buildWorklist.py — turn the banked L0 claim set into judgeable work packets.

Three jobs a script does better than an agent (GAUNTLET.md §2, A SCRIPT BEATS A SWARM):

 1. **DEDUPE.** The 1,087 banked rows carry only 1,048 distinct ids — 30 ids appear
    2-4x because a system surveyor and a source surveyor independently found the
    same thing. Judging a duplicate four times wastes four critics and inflates the
    verdict count. Rows are merged id-wise, keeping the strongest cite and unioning
    what the copies knew.

 2. **JOIN the machine cite audit.** Every packet carries each claim's citeLint
    status, so a critic opens the already-suspect ones first instead of rediscovering
    by hand what a `for` loop proved in 11 seconds.

 3. **BLIND-SAFE PROJECTION.** §3.2: a critic sees the worker's OUTPUT and the
    ARTIFACTS, never its reasoning. So the packets carry only the structured claim
    fields. The surveyor's prose in `sources/*.md` is deliberately NOT included and
    critics are told not to read it — that is what keeps the review blind while
    still not re-surveying.

Outputs, under `docs/gauntlet/L0/worklist/`:

    src-<unit>.claims.json    the 6 completed source sweeps, one packet per unit  (WF-2)
    t1-overturns-NN.json      critic findings CLAIMING A LEDGER OVERTURN           (WF-3a)
    t2-corroborating-NN.json  critic findings that only corroborate                (WF-3b)
    MANIFEST.json             every packet, its size, and its lens allocation

EVERY unjudged claim lands in exactly one packet. The tiers differ in DEPTH, never
in coverage: §0 gives no third option, and a claim nobody judges is a lead forever.

Usage:
    python3 scripts/gauntlet/buildWorklist.py --root docs/gauntlet/L0
"""

from __future__ import annotations

import argparse
import json
from collections import defaultdict
from pathlib import Path

# The 12 ledger systems. A claim whose unit is one of these came from a SYSTEM
# survey; anything else with a unit came from a SOURCE sweep.
SYSTEMS = {
    "combat-core", "skills-meters", "progression", "rebirth-elements",
    "items-equipment", "economy", "enemies-ai", "world-exploration",
    "quests-story", "ui-hud", "art-anim-audio-feel", "meta-social",
}

# The 10 evidence sources. A unit drops out of the packet list only when it has BOTH
# no unjudged claims AND the two critic lenses §3.3 requires — the same two questions
# gate L0-D asks, so the worklist and the gate can never disagree about what is left.
ALL_SOURCES = ["questdata", "skilldata", "npcdata", "itemdata", "bindata", "actionscript",
                    "android-blobs", "string-table", "frames", "uistrings-payload"]

# Fields a blind critic may see: the claim itself, never how it was reached.
BLIND_FIELDS = ("id", "text", "artifact_class", "cite", "quote", "verdict",
                "overturns_ledger", "ledger_text", "lane_impact", "unit", "build")

# One batch per critic pair. ~24 keeps a batch judgeable at real depth; bigger
# batches buy throughput by making each verdict shallower, which is the failure
# this lane exists to prevent.
BATCH_SIZE = 24

# §3.3: a heavy lane's finding faces 3-5 lenses, a bounded one 1-2. Two is the floor
# for a source sweep, and it is a SEPARATE question from whether the claims got judged:
# android-blobs had every claim judged by its surviving cite critic while its hunter lay
# dead, so it vanished from the worklist while still failing gate L0-D.
MIN_CRITICS_PER_SOURCE = 2


def strength(claim: dict) -> tuple:
    """Rank duplicate rows so the merged survivor is the best-evidenced one.

    Ordering: a real artifact class beats STILL_UNHELD; a longer cite carries more
    locations; a longer quote carries more verbatim material.
    """
    klass = (claim.get("artifact_class") or "").strip()
    return (
        0 if klass in ("", "STILL_UNHELD") else 1,
        len((claim.get("cite") or "")),
        len((claim.get("quote") or "")),
    )


def merge(rows: list[dict]) -> dict:
    """Collapse duplicate rows for one id into a single claim."""
    best = max(rows, key=strength)
    out = {k: best.get(k) for k in BLIND_FIELDS if best.get(k) not in (None, "")}
    if len(rows) > 1:
        # Never silently drop what a weaker copy knew. §3: no silent caps.
        others = [r for r in rows if r is not best]
        out["duplicate_count"] = len(rows)
        alt = sorted({(r.get("cite") or "").strip() for r in others} - {out.get("cite", "")})
        if any(alt):
            out["alternate_cites"] = [a for a in alt if a]
        out["reported_by"] = sorted({r.get("origin") or "surveyor" for r in rows})
    return out


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", default="docs/gauntlet/L0")
    ap.add_argument("--runs", nargs="+", default=None,
                    help="extracted run directories to pool. Default: every run*/ on disk.")
    ap.add_argument("--lint", nargs="+", default=None,
                    help="citeLint reports to pool. Default: every citelint*.json on disk.")
    ap.add_argument("--batch-size", type=int, default=BATCH_SIZE)
    args = ap.parse_args()

    root = Path(args.root)
    # DISCOVER THE RUNS, NEVER HARDCODE THEM. This list used to be a literal ending at
    # run7, and the moment run8 landed the worklist reported 1,506 rows / 814 judged
    # while gateL0 — which globs — pooled 1,587 / 1,169. It offered 653 already-judged
    # findings for re-judging, and a relaunch would have paid full agent cost to rule on
    # them twice. Nothing warned, because a hardcoded list that is merely OUT OF DATE
    # looks exactly like one that is complete. gateL0.py and buildLedgerEvidence.py both
    # glob; this is the third of three, and now they cannot disagree.
    runs = args.runs if args.runs is not None else [
        d.name for d in sorted(root.glob("run*")) if (d / "claims.json").is_file()]
    lints = args.lint if args.lint is not None else [
        p.name for p in sorted(root.glob("citelint*.json"))]
    # Runs POOL, they do not supersede. A later run judges earlier claims and adds new
    # ones; both halves have to be present or the judged set silently shrinks.
    claims: list[dict] = []
    verdicts: list[dict] = []
    for run in runs:
        claims += json.loads((root / run / "claims.json").read_text(encoding="utf-8"))
        vpath = root / run / "verdicts.json"
        if vpath.is_file():
            verdicts += json.loads(vpath.read_text(encoding="utf-8"))

    lint_rows: list[dict] = []
    for name in lints:
        path = root / name
        if path.exists():
            lint_rows += json.loads(path.read_text(encoding="utf-8"))["claims"]

    lint_by_id: dict[str, dict] = {}
    for row in lint_rows:
        # A duplicated id lints once per row; keep the worst status, since that is
        # the one a critic needs to see.
        prior = lint_by_id.get(row["id"])
        rank = {"BROKEN": 3, "QUOTE_UNVERIFIED": 2, "UNCHECKABLE": 1, "RESOLVES": 0}
        if prior is None or rank[row["status"]] > rank[prior["status"]]:
            lint_by_id[row["id"]] = row

    # A claim is JUDGED only if a critic with a real cite ruled on it. A verdict
    # with an empty own_cite is VOID under §0 and must not count as judgement.
    judged: set[str] = {
        v["claim_id"] for v in verdicts if (v.get("own_cite") or "").strip()
    }

    by_id: dict[str, list[dict]] = defaultdict(list)
    for c in claims:
        by_id[c.get("id") or "<no-id>"].append(c)

    def packet(claim_id: str) -> dict:
        row = merge(by_id[claim_id])
        audit = lint_by_id.get(claim_id)
        if audit:
            row["citelint"] = {"status": audit["status"],
                               "problems": audit.get("problems") or [],
                               "notes": audit.get("notes") or []}
        return row

    out_dir = root / "worklist"
    out_dir.mkdir(parents=True, exist_ok=True)
    for stale in out_dir.glob("*.json"):
        stale.unlink()

    manifest: dict = {"batch_size": args.batch_size, "packets": [], "deferred": []}

    # ---- WF-2: source sweeps still carrying unjudged claims -----------------
    for unit in ALL_SOURCES:
        own = {cid for cid, rows in by_id.items()
               if any((r.get("unit") == unit and r.get("origin") != "critic") for r in rows)}
        unjudged_ids = sorted(own - judged)
        lenses_on_disk = len(list((root / "critics").glob(f"src-{unit}.*.md")))
        short_of_lenses = lenses_on_disk < MIN_CRITICS_PER_SOURCE

        if not unjudged_ids and not short_of_lenses:
            manifest["deferred"].append({
                "unit": unit,
                "reason": f"every claim judged and {lenses_on_disk} critic lenses on disk"})
            continue
        # Short of lenses but fully judged: the packet carries the WHOLE claim set, because
        # the missing lens still has to look at all of it — a hunter that only sees the
        # unjudged remainder cannot hunt what the surviving lens quietly let through.
        ids = unjudged_ids or sorted(own)
        rows = [packet(i) for i in ids]
        path = out_dir / f"src-{unit}.claims.json"
        path.write_text(json.dumps(rows, indent=1, sort_keys=True), encoding="utf-8")
        manifest["packets"].append({
            "file": path.name, "unit": unit, "claims": len(rows), "stage": "WF-2",
            "unjudged": len(unjudged_ids), "critic_lenses_on_disk": lenses_on_disk,
            "reason": "unjudged claims" if unjudged_ids
                      else f"only {lenses_on_disk} critic lens(es) on disk, §3.3 needs {MIN_CRITICS_PER_SOURCE}"})

    # ---- WF-3: the uncritiqued critic new_findings --------------------------
    finding_ids = sorted({cid for cid, rows in by_id.items()
                          if all(r.get("origin") == "critic" for r in rows)
                          and cid not in judged})
    # Overturn-claimers first: they are the only ones that can change the ledger,
    # so if a usage wall lands mid-stage it lands after the work that matters.
    def overturn_first(cid: str) -> tuple:
        rows = by_id[cid]
        return (0 if any(r.get("overturns_ledger") for r in rows) else 1, cid)

    finding_ids.sort(key=overturn_first)

    # TIERED, because the two halves carry different consequences and deserve
    # different depth — not because anything is being skipped. EVERY finding is
    # judged; §0 leaves no third option, an unjudged claim is a lead forever.
    #   T1  claims a ledger overturn -> it can REWRITE REBUILD_READINESS.md, so it
    #       gets two lenses (cite + hunter) on small batches.
    #   T2  no overturn claimed -> it can only CORROBORATE, so one cite lens on a
    #       larger batch is proportionate.
    tier1 = [cid for cid in finding_ids if any(r.get("overturns_ledger") for r in by_id[cid])]
    tier2 = [cid for cid in finding_ids if cid not in set(tier1)]

    def emit(ids: list[str], prefix: str, size: int, stage: str, lenses: list[str]) -> None:
        for n in range(0, len(ids), size):
            chunk = ids[n:n + size]
            idx = n // size + 1
            rows = [packet(i) for i in chunk]
            path = out_dir / f"{prefix}-{idx:02d}.json"
            path.write_text(json.dumps(rows, indent=1, sort_keys=True), encoding="utf-8")
            manifest["packets"].append({
                "file": path.name, "unit": f"{prefix}-{idx:02d}", "claims": len(rows),
                "overturns": sum(1 for r in rows if r.get("overturns_ledger")),
                "stage": stage, "lenses": lenses,
            })

    # THREE lenses on the tier that REWRITES THE LEDGER (§3.3: a heavy lane gives a
    # finding 3-5). `contradiction` is the one the other two cannot cover: every
    # finding here was judged ALONE, so nobody has asked whether two survivors can
    # both be true. Kept in step with TIERS.t1.lenses in l0-finish-wf3.workflow.js —
    # tests/workflowScripts.test.ts fails if the two ever drift.
    emit(tier1, "t1-overturns", args.batch_size, "WF-3a", ["cite", "hunter", "contradiction"])
    emit(tier2, "t2-corroborating", args.batch_size * 2, "WF-3b", ["cite"])
    overturns = len(tier1)

    # ---- the dedup ground-truth every later hunter reads --------------------
    # Regenerated here rather than by hand, so it can never drift from the pooled
    # claim set. A dry-loop that dedups against a stale list re-reports old findings
    # forever and never converges (§3.5).
    seen_lines = [
        "# SEEN CLAIM IDS — every claim banked across every run of L0 so far.",
        "# A finding matching one of these is NOT new. Report it ONLY if you can",
        "# materially STRENGTHEN or CONTRADICT it — and say which, explicitly.",
        f"# {len(claims)} rows, {len(by_id)} unique ids, pooled from: {', '.join(runs)}.",
        f"# {len(judged & set(by_id))} of them carry at least one artifact-citing verdict;",
        "# the rest are LEADS and may not enter the ledger (§0).",
        "",
    ]
    seen_by_unit: dict[str, set[str]] = defaultdict(set)
    for cid, rows in by_id.items():
        unit = next((r.get("unit") for r in rows if r.get("unit")), None) or "critic-new_findings"
        seen_by_unit[unit].add(cid)
    for unit in sorted(seen_by_unit):
        ids = sorted(seen_by_unit[unit])
        n_judged = sum(1 for i in ids if i in judged)
        seen_lines.append(f"## {unit}  ({len(ids)} unique, {n_judged} judged)")
        seen_lines += [f"  {'*' if i in judged else ' '} {i}" for i in ids]
        seen_lines.append("")
    seen_lines.append("# A leading '*' marks a claim that has already been judged.")
    (root / "SEEN_CLAIM_IDS.txt").write_text("\n".join(seen_lines), encoding="utf-8")

    manifest["totals"] = {
        "claim_rows": len(claims),
        "distinct_ids": len(by_id),
        "duplicate_rows_merged": len(claims) - len(by_id),
        "already_judged": len(judged & set(by_id)),
        "source_sweep_unjudged": sum(p["claims"] for p in manifest["packets"] if p["stage"] == "WF-2"),
        "critic_findings_unjudged": len(finding_ids),
        "critic_findings_claiming_overturn": overturns,
    }
    (out_dir / "MANIFEST.json").write_text(json.dumps(manifest, indent=1, sort_keys=True),
                                           encoding="utf-8")

    t = manifest["totals"]
    print(f"buildWorklist: {t['claim_rows']} rows -> {t['distinct_ids']} distinct ids "
          f"({t['duplicate_rows_merged']} duplicate rows merged)")
    print(f"  already judged           {t['already_judged']}")
    print(f"  WF-2 source-sweep claims {t['source_sweep_unjudged']} across "
          f"{sum(1 for p in manifest['packets'] if p['stage'] == 'WF-2')} packets")
    for stage, lenses in (("WF-3a", "cite+hunter+contradiction"), ("WF-3b", "cite")):
        packs = [p for p in manifest["packets"] if p["stage"] == stage]
        print(f"  {stage} critic findings   {sum(p['claims'] for p in packs)} across "
              f"{len(packs)} batches x {lenses} = {len(packs) * len(lenses.split('+'))} agents")
    print(f"  -> {out_dir}")
    print(f"  -> {root/'SEEN_CLAIM_IDS.txt'}  ({len(by_id)} ids, {len(judged & set(by_id))} judged)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
