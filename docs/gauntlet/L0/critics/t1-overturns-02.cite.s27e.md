# t1-overturns-02 — CITE LENS (blind critic s27e)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-02.json` · 7 claims · **7 judged, 0 skipped, 0 refuted**
All seven carried `citelint: RESOLVES`. Every one survived the cite lens. Five new findings raised.

I did not open `critics/*.md` or `sources/*.md` (§3.2). Every verdict below rests on a file I opened myself.

## Result

| # | claim | verdict | overturn |
|---|-------|---------|----------|
| 1 | base-slash-length-is-a-closed-formula | **HELD** | RR:190 ①, RR:155 fall |
| 2 | crit-is-deterministic-at-full-focus | **HELD** | RR:195 ⑤ falls |
| 3 | max-dan-rank-10-is-contract | **HELD** (PARTIAL, correctly) | RR:164 half falls |
| 4 | reach-cap-in-stage-px-fully-recovered | **HELD** | RR:190 ①, RR:88 fall |
| 5 | reinforce-three-material-tiers | **HELD** | RR:80 falls |
| 6 | rr-159-is-inverted | **HELD** | RR:159-160 falls |
| 7 | crit-proc-deterministic-full-meter | **HELD** | RR:195 ⑤ falls |

Zero refutations is an unusual outcome and I treated it as a warning sign, so I attacked the three
weakest joints rather than spot-checking quotes. Each held on evidence the claim had not cited.

## The three joints I attacked

**(a) "in STAGE PIXELS" — claim 4.** A UI label printing a number does not make the number pixels;
that step read like inference dressed as a citation. It survives on other evidence: `slashLength` is
consumed as a raw drawing budget (`InputManager.as:106-108` `setMaxDistance`, `:467-485` `drawLine`)
and as raw geometry (`MCSPlayer.as:4638`, `:4663-4681`), in the same space that
`§1t1541s0§.as:343-349` bounds against `§1t1523s0§.stageWidth`/`stageHeight` — which are **800×480**
with the scale `§1t9358s0§` defaulting to **1** (`§1t1523s0§.as:104-114`). Nominal-stage pixels, as
claimed. Residual: on-screen px = units × `stageScale` on a letterboxed device; irrelevant at a fixed
800×480 web stage.

**(b) "NO meter test and NO debit" — claim 6.** An assertion of ABSENCE, which no quote can prove. I
read the whole 41-line handler `§1t406s0§.as:3064-3104`. The absence is real: hell-zone and mail
guards, the three-way cycle, the portrait frame, `Snd_smallClick`. No `§1t4414s0§`, no `48`. I then
went past the claim: the in-combat switch is not merely present but **wired and offered** —
`§1t113s0§.as:470-473` (battle HUD) and `§1t1541s0§.as:607-609` (input) both call `§1t4470s0§()` then
`§1t4472s0§()`, and `§1t99s0§.as:3050` defines that gate as `§1t4469s0§() && §1t4414s0§ >= 48`.
RR:158's quoted `"CANNOT CHANGE STANCE"` hard-lock has no support I can find — no such string exists
in the 2,533-entry table (nearest is `strings.json["125"]` `'Stance Restriction'`, a different concept).

**(c) the obfuscated-member identification — claims 2 and 7.** Claim 7's method reproduces: the
15-argument `initPlayer` at `MCSPlayer.as:182` aligns slot-for-slot with `§1t99s0§.as:185-199`, with
un-obfuscated anchors (`controlledBy`, `defense`, `minDamage`, `damageRange`, `slashUsage`, `level`) at
identical slots. A 15-slot alignment is not coincidence. So `§1t4414s0§` = `reload`, `§1t4415s0§` =
`maxreload`, `§1t4420s0§` = `baseSlashLength`, `§1t4422s0§`/`§1t4423s0§` = balanced/heavy mastery. The
same cross-walk holds on the stat indices: web `:226/:228/:230` = 11/12/13 against android
`:192/:194/:196` = `STAT_GOLD`/`STAT_HGOLD`/`STAT_AP`.

## Two imprecisions found, neither fatal

- **Claim 2** asserts a "192-point bar" with **no cite in its list establishing 192**. The number is
  TRUE — `§1t99s0§.as:249` `this.§1t4415s0§ = 8 * 24;` — so this is an incompleteness, not a mis-cite.
- **Claim 7** says `Math.random()` "appears at :3281 … and nowhere in the crit branch". `:3281` is
  inside `§1t4476s0§`; the damage function's own roll is `:3258`. The conclusion is correct (I read
  `:3255-3277` whole) but the line attribution is loose. Claim 7 also says "confirmed by the android
  twin", which is true for the **determinism** but not the **number**: android crits ×1.2 / ×1.5
  (`MCSPlayer.as:3215-3221`) where web is a flat ×1.3.

Neither is WRONG, UNGROUNDED or MIS-CITED, so neither is a refutation.

## Two honest caveats I was able to discharge

- **Claim 5** says "I could not confirm the 5000 on the web side, so this row is v0.682 under S0-3."
  I found the web side: `§1t401s0§.as:1086-1140` is the same routine — same `cost = 5000`, same
  `<30`/`<60`/else fan-out onto 20064/20065/20066, same itemID-13022→level-59 special case. **The
  S0-3 caveat can be struck from that row; it is CONTRACT on web v0.717.**
- **Claim 1** says the unit-to-stage-px scale "still wants one frame measurement." Closed by (a) above.

Under-claiming is not refutable, so both keep their verdicts; the upgrades are logged as new findings.

## New findings (5)

1. **`cite-s27e/web-rebirth-does-carry-a-tenth-dan-gold-tier`** — overturns RR:165.
   `§1t1523s0§.as:2644-2651`: `if(dan == 8) changeStat(HGOLD,100) else changeStat(HGOLD,25)`.
   RR:165's "flat +25 gold every rebirth, **no 10th-rebirth tier**" is half false — the +25 is right,
   the tier exists. `tenthGold = 100` is CONTRACT on web source, so **RR:164-165 falls whole**, not in
   half as claim 3 conservatively allowed. Android pays 20/5 — do not port it.
2. **`cite-s27e/focus-meter-numerics-are-fully-recovered`** — overturns RR:195 ③.
   MAX 192 (`:249`), FILL +1/tick (`:1203-1205`), SWITCH 48 (`:3050`, `:3162`), BONUS +6 (`:3320`),
   SLASH debit `slashUsage × {0.5 / 1.0 / 1.5}` (`:3302-3310`), CRIT spends the full bar.
   **The trap:** android `maxreload = 5 * 24` = **120**. Every fraction-of-bar ratio diverges.
3. **`cite-s27e/crit-multiplier-is-1-3-in-web-source`** — overturns RR:190 ②. `:3274` is a flat
   `× 1.3 + STAT_CRITICALDMG`. No popup needed. RR:153's "Heavy ×1.82" matches **neither** build.
4. **`cite-s27e/the-stance-tables-are-a-mastery-TEN-ceiling`** — overturns RR:155/157. Damage
   `:3262-3270` = Light 0.5+0.04m, Balanced 1+0.02m, Heavy 1.4 flat. At **m = 10** that is exactly
   0.9 / 1.2 / 1.4 — the ledger's own triple. At m = 9 it is 0.86 / 1.18 / 1.4. Corroborated by
   `strings.json["8131"]-["8133"]` "…Mastery Level 10." Note the ledger's **reach** triple is the
   mastery-**zero** row while its **damage** triple is the mastery-**ten** row — never the same row,
   which is what made the two tables look contradictory.
5. **`cite-s27e/heavy-stance-defence-penalty-is-in-code`** — confirmation, not overturn. `:3286-3288`
   `defense * 0.8` matches `strings.json["6005"]` "Defense -20%". Banked separately: the stance
   triangle (Light▸Heavy▸Balanced▸Light, `strings["6001"]/["6003"]/["6005"]`) is asserted by tooltips
   but I could not locate the term in the damage path — a survey lead, not a finding.

## Standing-invariant note

No measurement-doc-vs-frame conflict arose in this packet: it is entirely A2 (decompiled source), and
I graded no visual claim. The frame-wins rule was not engaged.
