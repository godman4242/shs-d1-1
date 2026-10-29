# Kickoff — LANE L3: items + paperdoll

Paste the block below as your FIRST message in a new session. Format adopted from the
IGCSE Malay repo's kickoffs: the framing lives out here, the paste block is the whole
prompt, and the forks get decided **before** any code.

> **Builds on, all landed 2026-08-24:** the architecture review (`962a005` — ratio ruled
> 10/90, R2 amended, R7 names the chops), L2's data half (`91c6010` — 75 skills × 182 rows
> byte-checked), and L2 closed (`6176713` — the Focus caption, and no AP meter *on purpose*).
> Baseline: **65 files / 1023 tests**, fidelity gate **41 points + 14 scans, 0 failures**.
>
> **Why L3 next:** `GAUNTLET.md` §2 ordering after L2 is L3, and it is the same shape L2
> just proved — a deterministic transform with a byte-check gate. The generator, the
> independent-parser discipline and the vocabulary-first rule all carry over intact.

---

```text
You're the lead engineer on SSHD 1:1. Follow the repo's CLAUDE.md and my ship-bar.

READ FIRST, then tell me your fork decisions before you spawn or write anything:
- RESUME_HERE.md         <- top block is SESSION 28; L2 is CLOSED, L3 is next
- docs/GAUNTLET.md       <- §2 lane board, §0 the law, R7 the ratio ruling
- docs/DIVERGENCES.md    <- the two LANE L2 sections at the end; they are the template

WORKING AGREEMENT: a script beats a swarm (§2) — this is a transform, so write the
generator and the byte-check, do NOT fan out agents to copy rows. Red-proof every new
test (watch it fail first). Chaos-plant every guard. Surgical diffs. RESUME_HERE.md +
DIVERGENCES.md updated in the SAME commit. Decide-and-flag every call (decision + why +
a one-line veto) — questions only for destructive ops / money / invariants. Paste gate
output, never assert it.

GOAL: port reference/extracted/itemdata.xml (982 items) into config, byte-checked, then
grade a dressed fighter's compositing against a frame. Lane gate, verbatim from §2:
"982 items byte-exact; a dressed fighter composites in the OG's layer order against A1".

⚠️ THE TRAP THAT ALMOST COST L2 ITS SKILL TREE — do this before writing the generator.
In skilldata, <req> looked empty because its data was in CHILDREN; ElementTree's .text
returns '' and all 52 prerequisites would have shipped as "present but empty". Only a
closed-vocabulary assertion caught it. itemdata has the SAME trap and WORSE: <modifier>
has children AND REPEATS UP TO 10 TIMES PER ITEM (412 total; 319 carry <id>+<value>,
93 carry <id> only). findtext() returns nothing; find() returns 1 of 10.
So FIRST: dump the full recursive tag vocabulary, assert it closed in the test, and
die on any unknown tag. I already measured it — confirm it yourself, don't trust me:
  982 items · 19 fields · nesting only under <item> and <modifier>
  id 982 · type 829 · name 804 · weight 745 · baseprice 550 · modifier 412 · defense 371
  unique 369 · heavenlyprice 304 · desc 178 · mindamage/maxdamage 158 · minlvl 155
  art 146 · uses 115 · slashusage 106 · stancerestriction 53 · nogive 12 · nodrop 7

DESIGN FIRST (~20 min, no code until these are decided and logged with vetoes):
1. <modifier> — record verbatim as a repeated {id, value?} list, or resolve ids to stat
   names? Recommend VERBATIM: 178 items have no <desc> and the modifier id-space is
   unmapped. Recording is this lane's job; deciding what id 4058 means is not.
2. The 178 unnamed items — 804 of 982 have <name>, and resolved_names.json reports
   itemdata 804 rows / 0 misses. So 178 items genuinely have no name tag, not a lookup
   failure. Decide: omit `name`, or mark them explicitly. Say which and why.
3. Scope order — data half FIRST, compositing second, as L2 did. The data half is a
   byte-check; the compositing half needs a frame grade and my LOOK. Recommend yes, and
   commit the data half on its own.
4. <art> (146 items) is the sprite link the paperdoll needs. Decide whether it lands in
   this lane's config or waits for the compositing half.

DON'T BREAK: §4's no-touch list. Sim.ts and the duel-baseline move only in L5. Floors go
UP or stay. src/core/ keeps ZERO numeric literals. Scenes stay render-only. src/game/'s
numeric-literal ratchet WILL fire — take its preferred path (move measured values to
src/config/ with their cites) before refreshing any baseline, and review that diff.

⚠️ C2 APPLIES TO EVERY ROW: itemdata.xml is the ANDROID build (v0.682); the web payload
carries no <itemdata> root. Put that caveat in the generated header, as L2 did.

DONE (measurable — all four, or the lane is open and you say so):
- All 982 items and every repeated <modifier> byte-exact, verified by a test that
  re-parses the source with an INDEPENDENT parser (raw regex vs the generator's DOM) —
  a shared parser only proves the two agree with each other.
- The tag vocabulary is asserted CLOSED, and the generator dies on an unknown tag.
- Chaos-planted: corrupt a value and drop a modifier; watch BOTH go red; restore.
- Gate green with PASTED output: typecheck 0 · lint 0 · vitest · fidelity gate.

Never soften a gate to fit a result — re-author, or come to me for a ruling.

FIRST, DO THIS: confirm the baseline (git log -1 + npm test -> 65 files / 1023), paste
the full itemdata tag vocabulary you dumped yourself, and give me your four fork
decisions with veto notes. Don't write the generator until I ok it.
```

**Start command** (from the repo root):

```bash
cd "/Users/kheshav/kheshav-code/SSHD 1-1" && git log --oneline -3 && npx vitest run 2>&1 | tail -4
```

---

## Smaller alternatives, if you'd rather a quick win

- **`citeLint`'s false negative** (~30 min) — it flags a byte-exact quote as
  `QUOTE_UNVERIFIED`. Fails safe and no gate reads it, so it was deliberately left alone
  mid-L0. L0 is parked now, so the "don't fix a gate input mid-drive" reason has expired.
- **The CONTRACT/INFERRED label test** (~1 h) — `src/config/CLAUDE.md` claimed the label
  invariant was "test-enforced"; the review proved it false and struck the claim. Building
  the real test goes red on `ai.ts`'s unlabeled `AI_TIERS`, so it is a small lane, not a
  one-liner.
- **`150% DAMAGE`** (~45 min) — A1 shows it under the bars where we render
  `BALANCED STANCE`. Logged in DIVERGENCES as L8 scope; could be pulled forward.

## Two rulings still waiting on you

1. **The bar self-report.** Fourteen files carry one; nine verdicts, nine passes, zero
   fails. Keep the polish pass — drop the self-grade? A bar that has never failed anything
   is a signature line. (The review deleted it from `GAUNTLET.md` only, and left your
   kickoff rule alone because it is yours to change, not an agent's.)
2. **The 26 superseded kickoff docs** (64,329 words) — grep-reachable rule sources stating
   *reversed* rulings; `SESSION4_KICKOFF.md` still asserts the no-tracing policy your
   an earlier assumption overturned. `git rm` is destructive, so it waits on you.

## Bar self-report

**Reached, and here is what would have failed it.** The kickoff would fail if it (a) let a
session start coding before the `<modifier>` trap was understood, (b) restated numbers I
had not measured myself, or (c) ran long enough to be axe-sharpening. It names the trap
with counts I measured this session and tells the next lead to re-confirm rather than
trust them. Measured, not estimated: the paste block is **761 words** and the whole doc
**1,274**, against 27 prior kickoffs totalling 66,387 words — an average of **2,458**.
This one is 31% of that average, and it is the deliverable the ratio ruling asks for.

⚠️ **This self-report is itself under review** — see ruling 1 above. It is included
because that rule is still in force, and written to be falsifiable rather than a rubber
stamp.
