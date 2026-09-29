# CLOUD LANE — the driver session (you run it; the cloud builds the pieces)

**What this is:** a local session that launches ONE cloud cycle at a time on the $250
cloud credit, re-checks each piece here with the FULL corpus, and moves it to `master`.
It never builds a piece itself. Ruling + guard: `docs/OWNER_PERMISSION_RULING.md` →
"Cloud sessions"; the cloud cycle's rules: `docs/loop/CYCLE.md` → "In a cloud session".

**Before you paste (once):** claim the credit (claude.ai/code) · install the Claude GitHub App
on `shs-d1-1` only · no `build-loop.sh` running on this repo.

**Activate first:** Claude Code CLI in `SSHD 1-1` · fresh session · `/model opus`, effort `medium`
(it orchestrates and re-checks; it doesn't port) · `/fast` OFF (mostly waiting).

Copy everything BETWEEN the `'''` lines:

```
'''
You drive SSHD's cloud lane. Read docs/sessions/CLOUD_LANE_KICKOFF.md, docs/loop/CYCLE.md ("In a cloud session") and docs/OWNER_PERMISSION_RULING.md ("Cloud sessions"). You never edit src/ or tests/; the cloud cycle is the only writer.
Setup: touch docs/loop/PAUSE · on master, clean, `git pull --ff-only` · `git rev-parse --verify cloud-reference` must succeed (the never-pushed corpus branch; if missing, STOP and tell me).
Per piece, repeat:
 1. Launch from this repo: CCR_FORCE_BUNDLE=1 claude --cloud "Read docs/loop/GOAL.md FIRST, then docs/loop/CYCLE.md including 'In a cloud session', and do EXACTLY ONE cycle. Then stop." --model opus --effort high </dev/null  (background, 5-min timeout; keep the session URL it prints). If it can't launch from your shell, give me that exact command for my own terminal.
 2. Wait for `git ls-remote origin refs/heads/cloud-lane` to move (poll 60 s, 90-min cap). Nothing after 45 min → tell me to open the session URL and read its last message.
 3. Check before trusting: `git fetch origin cloud-lane` · exactly ONE new commit (`git rev-list --count master..origin/cloud-lane` = 1) and master is its ancestor · `git diff --name-only master origin/cloud-lane` has no line matching ^"?reference/ · `git ls-remote origin | grep -c cloud-reference` = 0.
 4. Re-gate here with the full corpus: `git checkout --detach origin/cloud-lane` → typecheck, `npx vitest run` (0 failed; paste totals), lint, `npm run claimcheck` (0 failures). Green → `git checkout master && git merge --ff-only origin/cloud-lane && git push origin master`. Red → `git checkout master` (untouched), STOP with the evidence.
 5. A piece that queued a LOOK ("Awaiting human/browser verification"): do it here against reference/frames, screenshot, open the images, and tell me what needs my eyes.
Stop when: 22:30 KL (then `rm docs/loop/PAUSE` and start the night loop: caffeinate -dimsu bash scripts/build-loop.sh) · I say my credit is under $20 · any red · the same failure twice.
Done = every promoted piece pasted as: subject · master sha · tests passed/failed · claimcheck failures · cloud-reference on GitHub (must be 0).
'''
```

**VERIFY (plain English):** after the first piece, `git log --oneline -1` on master shows a new
"L5-OPP slice 7b…" commit, and the session printed that piece's test totals with 0 failed.

**First piece = the pilot.** Open its session URL once and check the FIRST hook line says
"study-only corpus unpacked" — "MISSING" means the bundle did not carry the corpus: stop.

**Bar self-report:** ⚠️ reached for everything checkable from the Mac — the guard (10 tests,
502/502 plants), a bundle rehearsal (27 MB; setup unpacks, deletes the ref, turns hooks on;
claimcheck 2537/719/44). **Limiter:** four things only the pilot can prove — that `claude
--cloud`'s own bundle carries the `cloud-reference` branch like `git bundle --all` did, that the
cloud may push `cloud-lane` (the guard also allows `claude/…` if the platform insists), that
`--model opus --effort high` reach a cloud session (the session page shows its model), and what
one piece costs from the credit.
