#!/usr/bin/env python3
"""buildLedgerPackets.py — scope the `REBUILD_READINESS.md` rewrite, mechanically.

The rewrite is the point of lane L0, and it is the one step where an agent inventing a
claim id would be most expensive. `GAUNTLET.md` §2's standing rule is **A SCRIPT BEATS A
SWARM**, so the partition is a `for` loop: each writer receives ONLY the findings
admissible for its own slice of the ledger, and may cite nothing else.

**Why a partition and not "everyone reads the evidence doc".** `LEDGER_EVIDENCE.md` is
~3,000 lines covering 229 attacked ledger sentences. A swarm of writers each skimming
all of it will collectively drop findings, and nothing in the pipeline would notice —
the gate only re-checks what the rewrite *did* cite, never what it silently ignored.
A partition that provably covers the usable set cannot drop one, so this script asserts
CONSERVATION and exits non-zero if it is ever violated.

**Routing, strongest rule first.** Each rule is a different quality of evidence about
where a finding belongs, so they are tried in descending order of directness:

    ledger_text     the finding names the ledger sentence it attacks, and that sentence
                    is located in the ledger — so the section that CONTAINS it owns the
                    finding. Direct, and the only rule that needs no interpretation.
    id_prefix       `combat-core/reach-cap` is a claim a combat-core surveyor raised.
    lane_impact     the finding says which lane it moves, in prose.
    frame_fallback  genuinely cross-cutting ("all lanes L1..L11") or unroutable. These
                    belong to the framing sections (§0/§1/§3/§5/§7), not to a system.

**§0's bar is enforced here, not trusted.** A KILLED claim — refuted by its critics, or
never judged at all — may not enter any packet. An unjudged claim is a LEAD, and a lead
in a writer's hand is a lead in the ledger.

**And the distinction this lane paid 210 rejected overturns to learn:** a NOT-UPHELD
finding is TRUE and worth banking, but the ledger sentence it aimed at DOES NOT FALL.
The packet says so in words a writer cannot skim past, because collapsing "true" into
"deletes the line" is how a readiness ledger gets rewritten by findings that never
contradicted it.

Usage:
    python3 scripts/gauntlet/buildLedgerPackets.py --root docs/gauntlet/L0 \\
        --ledger docs/research/REBUILD_READINESS.md --out docs/gauntlet/L0/packets
"""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path

# The 12 ledger systems, in scorecard order. Each gets one packet and one writer.
SYSTEMS = [
    "combat-core", "skills-meters", "progression", "rebirth-elements", "items-equipment",
    "economy", "enemies-ai", "world-exploration", "quests-story", "ui-hud",
    "art-anim-audio-feel", "meta-social",
]

# Two framing sections get their own writer because their gates are specific:
#   six          §6's "structurally UNRECOVERABLE" list — gate L0-E is binary on it.
#   corrections  §3, where a correction to the project's own docs actually lands.
# Everything else framing (§0 TL;DR, §1 quadrants, §5 close-path, §7 verdict) is
# assembled by the lead from the `frame` packet.
EXTRA = ["six", "corrections", "frame"]

# What a lane_impact line calls each system when it does not use the slug. Deliberately
# NO short lane codes (L1/L2/…): "L1" matches "L11" and would misroute silently. Order
# is the iteration order, so a line naming two systems resolves deterministically to the
# first listed — recorded in ROUTING.json either way.
ALIASES: dict[str, list[str]] = {
    "combat-core": ["combat core", "combat-core"],
    "skills-meters": ["skills-meters", "skills meters", "skill/meter", "chi cost"],
    "progression": ["progression", "xp curve"],
    "rebirth-elements": ["rebirth", "elemental", "elements"],
    "items-equipment": ["items-equipment", "equipment", "paperdoll", "item "],
    "economy": ["economy", "prices"],
    "enemies-ai": ["enemies-ai", "enemies", "enemy", "npc"],
    "world-exploration": ["world-exploration", "world", "exploration"],
    "quests-story": ["quests-story", "quest", "story", "campaign", "dialogue"],
    "ui-hud": ["ui-hud", "hud", "ui "],
    "art-anim-audio-feel": ["art-anim-audio-feel", "animation", "audio", "sprite", "anim "],
    "meta-social": ["meta-social", "clan", "war room", "war-room", "social"],
}

USABLE = ("UPHELD", "NOT-UPHELD")


def norm(text: str | None) -> str:
    """Markdown emphasis and whitespace stripped, so a quote matches its source line."""
    return re.sub(r"\s+", " ", re.sub(r"[*_`]", "", text or "")).strip()


def owners(ledger: str) -> list[str]:
    """For each ledger LINE, the packet that owns it.

    §4's per-system blocks own their lines by their `### <system>` heading; §2's
    scorecard rows own themselves by the system they name; §6 is `six`, §3 is
    `corrections`, and every other section is `frame`.
    """
    out: list[str] = []
    section, system = "0", None
    for line in ledger.splitlines():
        head = re.match(r"^##\s*(\d+)\.", line)
        if head:
            section, system = head.group(1), None
        sub = re.match(r"^###\s+([a-z\-]+)\s+—", line)
        if sub and sub.group(1) in SYSTEMS:
            system = sub.group(1)

        if section == "6":
            out.append("six")
            continue
        if section == "2" and line.strip().startswith("|"):
            named = next((s for s in SYSTEMS if re.search(rf"\*\*{re.escape(s)}\*\*", line)), None)
            out.append(named or "frame")
            continue
        if section == "4" and system:
            out.append(system)
            continue
        out.append("corrections" if section == "3" else "frame")
    return out


def locate(sentence: str, lines: list[str], owner: list[str]) -> str | None:
    """The packet owning the ledger line this sentence appears on, if it appears at all.

    Whole-sentence match first; then an 8-word shingle, because a finding often quotes a
    sentence with an ellipsis or trims a trailing clause. Shorter than 8 words is not
    attempted — a 3-word shingle matches half the document and would misroute silently.
    """
    target = norm(sentence)
    if not target:
        return None
    words = target.split()
    shingles = [" ".join(words[i:i + 8]) for i in range(len(words) - 7)] if len(words) >= 8 else []
    for i, line in enumerate(lines):
        if not line:
            continue
        if target in line or any(sh in line for sh in shingles):
            return owner[i]
    return None


def route(claim: dict, lines: list[str], owner: list[str]) -> tuple[str, str]:
    """Where this finding belongs, and which rule decided. Never returns None."""
    dest = locate(claim.get("ledger_text"), lines, owner)
    if dest:
        return dest, "ledger_text"

    prefix = (claim.get("id") or "").split("/")[0]
    if prefix in SYSTEMS:
        return prefix, "id_prefix"

    impact = (claim.get("lane_impact") or "").lower()
    if impact:
        for system in SYSTEMS:
            if system in impact:
                return system, "lane_impact"
        for system, words in ALIASES.items():
            if any(word in impact for word in words):
                return system, "lane_impact"

    unit = claim.get("unit")
    if unit in SYSTEMS:
        return unit, "unit"

    return "frame", "frame_fallback"


def render(dest: str, claims: list[dict], ledger_section: str) -> str:
    """One writer's whole admissible world, in the order it should be read."""
    overturns = [c for c in claims if c["status"] == "UPHELD" and c.get("claims_overturn")]
    rejected = [c for c in claims if c["status"] == "NOT-UPHELD"]
    corroborating = [c for c in claims if c["status"] == "UPHELD" and not c.get("claims_overturn")]

    out = [
        f"# LEDGER PACKET — `{dest}`",
        "",
        "> **This is the ONLY evidence you may cite.** Every id below was JUDGED by blind",
        "> artifact-citing critics and SURVIVED (GAUNTLET.md §0). Cite one inline as",
        f"> `[[id]]`, exactly as written. Gate **L0-B** resolves every reference against the",
        "> pooled verdicts and goes RED on anything unjudged, refuted, or invented — so a",
        "> claim id you do not see here cannot enter the ledger, and neither can a",
        "> plausible-looking one you compose yourself.",
        "",
        f"**{len(overturns)} surviving overturns · {len(rejected)} true-but-rejected · "
        f"{len(corroborating)} corroborating.**",
        "",
        "---",
        "",
        "## The ledger text you are rewriting, verbatim",
        "",
        "```markdown",
        ledger_section.rstrip(),
        "```",
        "",
        "---",
        "",
    ]

    def block(title: str, note: str, rows: list[dict]) -> None:
        out.append(f"## {title}")
        out.append("")
        out.append(note)
        out.append("")
        if not rows:
            out.append("*(none)*")
            out.append("")
            return
        for c in sorted(rows, key=lambda r: r.get("id") or ""):
            crit = c.get("live_critics")
            out.append(f"### `[[{c.get('id')}]]` — {c.get('status')} "
                       f"[{c.get('artifact_class')}] ({crit} critic{'' if crit == 1 else 's'})")
            out.append("")
            out.append(c.get("text") or "")
            out.append("")
            if c.get("cite"):
                out.append(f"- **Cite:** `{c['cite']}`")
            if c.get("build"):
                out.append(f"- **Build:** {c['build']}")
            if c.get("ledger_text"):
                verb = ("KILLS this line" if c["status"] == "UPHELD"
                        else "aimed at this line, which SURVIVES")
                out.append(f"- **{verb}:** \"{norm(c['ledger_text'])[:400]}\"")
            if c.get("lane_impact"):
                out.append(f"- **Lane impact:** {c['lane_impact']}")
            out.append("")

    block("① Surviving overturns — these REWRITE the lines they name",
          "A critic opened the sentence, read it in context, and ruled that it falls.",
          overturns)
    block("② TRUE, but the line SURVIVES — do NOT delete anything for these",
          "The finding held up; the overturn did not. 36% of claimed overturns were "
          "rejected this way. Bank the knowledge, keep the sentence.",
          rejected)
    block("③ Corroborating — new knowledge, no line deleted",
          "These add or sharpen; they do not contradict.",
          corroborating)

    out += [
        "---",
        "",
        "## What is NOT here, and why",
        "",
        "Refuted claims and claims no critic ever judged (§0: an unjudged claim is a LEAD)",
        "are excluded by `buildLedgerPackets.py`. If you believe something is missing, say so",
        "in your return — do not reconstruct it from memory, and do not cite it.",
        "",
    ]
    return "\n".join(out)


def sections(ledger: str, owner: list[str]) -> dict[str, str]:
    """The ledger text each packet is responsible for, verbatim."""
    grouped: dict[str, list[str]] = {}
    for line, dest in zip(ledger.splitlines(), owner):
        grouped.setdefault(dest, []).append(line)
    return {k: "\n".join(v) for k, v in grouped.items()}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", default="docs/gauntlet/L0")
    ap.add_argument("--ledger", default="docs/research/REBUILD_READINESS.md")
    ap.add_argument("--out", default="docs/gauntlet/L0/packets")
    args = ap.parse_args()

    evidence = json.loads((Path(args.root) / "LEDGER_EVIDENCE.json").read_text(encoding="utf-8"))
    ledger = Path(args.ledger).read_text(encoding="utf-8")
    owner = owners(ledger)
    lines = [norm(l) for l in ledger.splitlines()]
    body = sections(ledger, owner)

    usable = [c for c in evidence["claims"] if c.get("status") in USABLE]
    buckets: dict[str, list[dict]] = {name: [] for name in SYSTEMS + EXTRA}
    routed, rules = [], Counter()
    for claim in usable:
        dest, rule = route(claim, lines, owner)
        buckets.setdefault(dest, []).append(claim)
        routed.append({"id": claim.get("id"), "dest": dest, "rule": rule})
        rules[rule] += 1

    placed = sum(len(v) for v in buckets.values())
    conserved = placed == len(usable) and len({r["id"] for r in routed}) == len(routed)

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    for dest, rows in buckets.items():
        (out_dir / f"{dest}.md").write_text(render(dest, rows, body.get(dest, "")),
                                            encoding="utf-8")

    report = {
        "usable": len(usable),
        "placed": placed,
        "conserved": conserved,
        "destinations": {k: len(v) for k, v in sorted(buckets.items())},
        "rules": dict(rules),
        "routed": routed,
    }
    (out_dir / "ROUTING.json").write_text(json.dumps(report, indent=1, sort_keys=True),
                                          encoding="utf-8")

    print(f"buildLedgerPackets: {len(usable)} usable findings -> {len(buckets)} packets")
    for dest, rows in sorted(buckets.items(), key=lambda kv: -len(kv[1])):
        print(f"  {dest:22s} {len(rows):4d}")
    print(f"  rules: {dict(rules)}")
    if not conserved:
        # A partition that loses a finding is worse than no partition: it reads as full
        # coverage. Fail closed and say which ones (§3, no silent caps).
        lost = {c.get("id") for c in usable} - {r["id"] for r in routed}
        print(f"⛔ CONSERVATION VIOLATED — {len(usable) - placed} finding(s) unplaced: "
              f"{', '.join(sorted(str(x) for x in lost)) or 'duplicate ids'}")
        return 1
    print(f"✅ CONSERVED — every one of the {len(usable)} usable findings is in exactly one packet")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
