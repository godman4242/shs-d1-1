# Session 11 study pass — RAW agent returns (2026-07-25)

Verbatim structured rows from the 6 viewer agents of workflow `wf_725ba028-915`
(1.28M subagent tokens, 537 tool calls, ~40 min). Kept unedited so any distilled
claim in `../COMBAT_MEASUREMENTS.md` can be traced back to the agent that made it,
including the caveats and self-flagged weak rows.

Evidence frames referenced by these rows live in `reference/frames/session11/<agent>/`
(gitignored, local-only, study material).

An earlier 10-agent run (`wf_355d4b15-ee4`) died mid-flight on Fable-5 credit
exhaustion; its frame extracts were salvaged and reused by this run.

| file | agent | rows |
|---|---|---|
| `crux-first-combat.txt` | item (a)/(d) on video A's first fight | 19 |
| `crux-dungeon.txt` | item (a)/(c) on the first-dungeon fights | 16 |
| `damage-ttk.txt` | item (e) damage / HP / TTK | 19 |
| `crit-focus.txt` | item (f) crit + Focus economy | 14 |
| `stance-reach.txt` | item (c) reach + speed per stance | 16 |
| `movement-gesture.txt` | item (b) movement gesture | 17 |

## Gap-fill pass (workflow `wf_40316854-a52`, 5 agents, 93 rows)

Launched after auditing the ledger against the config surface the SESSION12
retune must actually set. These agents **corrected four rows** from the first
pass — see "§00b CORRECTIONS" in `../COMBAT_MEASUREMENTS.md`.

| file | gap | rows |
|---|---|---|
| `gap-named-duel.txt` | B (named-enemy HP) + C (is damage a roll?) | 20 |
| `gap-focus-trigger.txt` | F (what charges Focus) | 20 |
| `gap-move-issue.txt` | G (how a move command is issued) | 21 |
| `gap-enemy-ai.txt` | H (enemy speed / telegraph / cadence) | 16 |
| `gap-gait-hitbox.txt` | E (gait threshold) + K (hitbox width) | 16 |
