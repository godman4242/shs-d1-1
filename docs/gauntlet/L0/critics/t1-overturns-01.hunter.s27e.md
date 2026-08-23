# t1-overturns-01 — HUNTER LENS (blind critic, s27e)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-01.json` — **7 findings, 7 judged, 0 skipped.**
Structured verdicts: `docs/gauntlet/L0/critics/t1-overturns-01.hunter.s27e.json` (written first, before this file).

**Headline: 7 of 7 survive, and all 7 overturns hold.** That is an unusually clean packet, and I went
looking hard for the reason it might be too clean — five of the seven lean on one file
(`reference/decompiled/shs3_payload/scripts/§1t99s0§.as`), so a single mis-identified obfuscated symbol
would have taken most of the packet down with it. It did not. The load-bearing symbol
(`§1t1525s0§.§1t9948s0§()` = `StageManager.isBattle()`) resolves independently, and the frame half of the
cluster stands on its own without any code at all.

I found **three real defects inside surviving findings** (all minor, none touching an overturn), and
**three unclaimed results** while hunting.

---

## The one that matters most: RR:158 falls on film, before any AS3 is read

`NF-S27D-1` is the only A1 in the packet and it is the strongest thing here, because it settles
REBUILD_READINESS.md:158 **without the decompiler**. I opened all four frames myself — crops as stated,
plus each full 1920×1080 frame downscaled to 960×540 so the caption could not be hiding outside the crop.

| frame | HUD stack | caption |
|---|---|---|
| `combat_frames/Nr4fQstqHDM_t0430s.png` | HP 20/20 · Chi 26/26 · third bar: thin white sliver at left | **ABSENT** |
| `combat_frames/Nr4fQstqHDM_t0435s.png` | HP 19/20 · Chi 26/26 · third bar ≈42 % white fill | **ABSENT** |
| `duel_dense/Nr4fQstqHDM_429.0.png` | HP 20/20 · Chi 26/26 · third bar **empty** | **"CANNOT CHANGE STANCE"** |

All three are the same battle — same `3 HIT COMBO` counter, same `SOUND360TM` nameplate, same scene, and
t0435 additionally shows enemies with HP bars and the red hit-flash, so "not in combat" is not available as
an escape. **A caption that is on at 429.0 s, off at 430 s and off at 435 s inside one fight is not a hard
lock.** THE FRAME WINS over RR:158, and it wins on frame evidence alone.

The code agrees, and I opened it separately rather than taking the finding's word:
`§1t113s0§.as:326-347` computes `ratio = (reload - 48) / (maxreload - 48)` and shows the caption at
`ratio == 0` (:336-343), hides it while `0 < ratio < 1` (:344-347), and at `ratio >= 1` swaps in
`getString(175)` = "Critical Hit" and plays `Snd_criticalDamage` (:348-359). The caption means *you cannot
afford 48 Focus right now*, which is the same statement the other six findings make from the other side.

**Correction inside this finding (minor):** it says the 150 % DAMAGE banner is *absent* from t0425. It is
absent from the HUD stack, but it is on screen bottom-right as `150% DAMAGE 28:28` — yellow label, white
mm:ss countdown (crop `(1520,920)-(1860,970)`, 4× LANCZOS). Overworld buffs move to a **timed** bottom-right
readout; they are not dropped. Banked separately below as `NF-S27E-3`.

---

## The symbol that five findings depend on

`§1t1525s0§.§1t9948s0§()` is the guard that decides whether the 48-Focus charge happens. If it is not
`isBattle()`, findings 2, 3, 6 and 7 all change meaning. It is:

- `§1t1525s0§.as:1152-1155` → `public static function §1t9948s0§() : Boolean { return actionState == §1t9903s0§; }`
- android `StageManager.as:1025-1028` → `public static function isBattle() : Boolean { return actionState == STATE_BATTLE; }`
- sibling check: `§1t1525s0§.as:1073-1076` `§1t9941s0§()` returns a `§1t113s0§`, exactly as android
  `StageManager.getBattleUI()` returns a `BattleUI`.

Confirmed. And `§1t4465s0§` — the first term of the evade predicate — resolves the same way: in both files
it is the fourth `return actionState == X` member and is immediately followed by `internal function
movement(...)`; android calls it `isSlashing()` (`MCSPlayer.as:2885-2888`).

---

## Verdicts

### 1. `NF-S27D-1` — CANNOT CHANGE STANCE is transient · **UPHELD**, overturn UPHELD (minor correction)
Above. RR:158's "HARD-LOCKED" clause is dead. The parenthetical ("appears the instant a fight starts") is
not directly filmed at a fight start, but it is moot: the caption is a Focus-threshold readout, not a lock.

### 2. `NF-S27D-3` — RR:159 is inverted · **UPHELD**, overturn UPHELD
`§1t99s0§.as:3160` wraps `:3162 this.§1t4414s0§ -= 48;` in the battle predicate. I re-ran the enumeration
myself: `grep -n '§1t4414s0§' §1t99s0§.as` returns exactly the 28 lines the finding lists, and the
assign/debit subset is `{250, 3162, 3165, 3297, 3302, 3306, 3310, 3314, 3323}` — **:3162 is the only
stance-switch debit and the only one under a battle guard.** The four other web files touching the member
(`§1t122s0§`, `§1t120s0§`, `§1t4904s0§`, `§1t4909s0§`) carry no stance debit. Both halves of RR:159 are
backwards, so the "label it as a divergence" instruction is backwards too.

**Precision note, not a refutation:** "free *and unrestricted*" overstates it. The cycle entry gate
`§1t4472s0§` at `:3060` (`if(this.§1t4414s0§ < 48) return;`) is **not** battle-gated, so out of combat the
switch is free of charge but still needs Focus ≥ 48. In practice Focus regenerates +1/tick toward 192 with
nothing spending it outside battle, so the gate is near-always satisfied — the finding's *text* ("OUT of
combat a stance switch is FREE") is exactly right; only the lane_impact wording drifts.

### 3. `NF-S27D-4` — full-Focus evade is in web code · **UPHELD**, overturn UPHELD (two corrections)
Predicate present verbatim at `:3383` and `:3707`, inside the hit-resolution override `§1t3274s0§` (opens
`:3328`), and it `return true`s at `:3387`/`:3710` **before** `:3389` ever reads `param2.damage` — the hit is
consumed with no damage math. `§1t120s0§.as:108/110/112` give 1074/1075/1076; `§1t4491s0§` (`:4673-4676`)
is a skill-level lookup, so the passive must be owned. Crit at `:3272-3274` hangs off the identical
`reload == maxreload` test — one state, two effects, and the skill card was never in conflict with the crit
multiplier.

- **(a)** The branch also requires `§1t4465s0§()` = `isSlashing()`. This is **evade while slashing**, not
  blanket immunity on a full bar. The finding quotes the term but its lane_impact drops it. → `NF-S27E-2`.
- **(b)** The `:3707` copy is *not* identical (no `Snd_jump`), and there are **four** copies, not two:
  `§1t4909s0§.as:74` and `:311`.

### 4. `cite-s27d/crit-proc...` — deterministic crit, web-only multiplier · **UPHELD**, overturn UPHELD
`§1t4475s0§` (`:3255`): base roll at `:3258`, stance multiplier, then the function's only conditional is
`:3272 if(reload == maxreload)` → `:3274 return _loc2_ * 1.3 + this.§1t1243s0§;`. No chance roll gates the
crit. `:3293-3298` zeroes a full meter before the per-stance slash cost, so a full bar buys exactly one
crit. Android `MCSPlayer.as:3215/:3219/:3221` returns **1.2** (non-Light) / **1.5** (Light) — the parity trap
is real and `CRIT_MULT = 1.3` must carry a WEB v0.717 label. RR:195 blocker ⑤ ("entirely absent") falls.
One loose phrase: "no dice roll anywhere near it" — there *is* a `Math.random()` at `:3258`, but it is the
min/max damage spread, not a proc.

### 5. `cite-s27d/dan-titles...` · **UPHELD**, overturn UPHELD (one side-claim corrected)
`InventoryUI.as:2274-2316` and `§1t5957s0§.as:3061-3103` are the same switch, read line by line: dan 0 →
blank; dan 1..9 → `getString(456)..getString(464)`; shogo overlay in `#7D5500` — 465 Renshi at dan 3-5, 466
Kyoshi at dan 6-7, 467 Hanshi at dan 8, 9 and default. `grep -rn "getString(455)"` over **both** decompiled
trees returns **0**, so `(初段)` exists in the table and is never displayed as a dan title. Cap:
`StatsManager.as:2209` `if(getPlayerStats(STAT_DAN) < 9)`, twinned at `§1t1523s0§.as:2653-2655`. RR:205
blocker ③ closes, and the shogo layer is a second honorific system the ledger has nowhere.

**Correction (minor):** the lane_impact's "the `< 9` cap means MAX_DAN_RANK is 9 rebirths, not 10" does
**not** follow, and RR:164 survives it. The build displays the rank as `dan + 1`: web `§1t1523s0§.as:2644-2647`
fires **only** at `dan == 8` and announces `getString(864,[name,"10"])` with the literal `10`, and `:2659`
announces `(dan + 1)` generally. Ten ranks, 初段 → 十段, with the 1st-dan title suppressed as a blank field.
Nine *displayed* titles is right; "MAX_DAN_RANK is 9" is not.

### 6. `cite-s27d/focus-fill...` · **UPHELD**, overturn UPHELD
All three paths verified independently.
(a) `:1202` is `§1t3270s0§()` (android `:1157 doAction()`), and `:1203-1210` is `+1` per tick with a HUD
repaint every tick; android `MCSPlayer.as:1158-1160` identical.
(b) `grep -rn '§1t4479s0§'` over the whole web tree returns **exactly two lines** — the definition
(`§1t99s0§.as:3318`, `reload += 6` clamped) and the single call at `§1t1543s0§.as:2049`, under `:2047
if(_loc4_ > 0)` where `_loc4_` is the death counter incremented at `:2041`. Android `NPCManager.as:1709-1711`
+ `bonusReload` at `MCSPlayer.as:3265-3272`, also +6. **Flat +6 per death-sweep, not per kill** — stated
correctly.
(c) `§1t120s0§.as:230-231` `case §1t10128s0§: param3.§1t4414s0§ = param3.§1t4415s0§ - 1;` with
`§1t10128s0§ = 1005` (`:18`), and 1005 resolves as *"Focus — Instantly recharges your focus bar"*; android
`SkillManager.as:218-219` in plain English. The `- 1` lands one point short of `reload == maxreload`, so
Replenish Focus deliberately does **not** hand you a crit.

### 7. `cite-s27d/stance-switch-48` · **UPHELD**, overturn UPHELD
Entry gate `:3060` (`< 48 → return`), setter `§1t3489s0§` at `:3083`, battle-guarded flat `-48` with a clamp
at 0 and a HUD repaint at `:3160-3171`. Android is a genuine divergence: `MCSPlayer.as:2977` gates on
`reload < maxreload/6`, `:3098-3105` charges `maxreload/3` if `reload > maxreload/2` else `-= maxreload/6`.

**Extra number worth carrying:** web `maxreload = 8 * 24 = 192` (`§1t99s0§.as:249`) vs android `5 * 24 = 120`
(`MCSPlayer.as:239`), and the HUD zero-point is 48 on web (`§1t113s0§.as:328`) vs 24 on android
(`MCSPlayer.as:1163-1168`). The flat 48 is `maxreload/4` on web while the android *gate* is `maxreload/6` —
**the two builds do not share the Focus scale**, so `48` must ship labelled WEB v0.717.

---

## Hunter results — three unclaimed findings

**`NF-S27E-1` — web v0.717 carries four skills that have no row in the ported `skilldata.xml`.**
I extracted all 54 skill-id constants from the web SkillManager and diffed them against every `<id>` in
`reference/extracted/skilldata.xml`: exactly `{1074, 1075, 1076, 1077}` are missing. The XML's highest skill
id is 1073 over its 75 `<skill>` rows, and android's last constant is `SKILL_EARTHQUAKE = 1073`
(`SkillManager.as:106`). Three are the per-stance evade passives; the fourth (`§1t120s0§.as:344-352`)
requires **8 × item 2501 = "Kunai"**, refuses below that, spends 8 and spawns two `§1t11304s0§` projectiles
at ±20 px — a web-only 8-kunai skill (Windmill Shuriken, 1051, costs 4). **Consequence: every skill count,
name, chi cost and cooldown the lane holds describes the ANDROID build**, and v0.717 has ≥ 4 skills for
which we hold no name, cost or cooldown in any artifact. This is C2's parity hole with a measured size.

**`NF-S27E-2` — the full-Focus evade only fires while slashing.** See verdict 3(a).

**`NF-S27E-3` — overworld buffs are a timed bottom-right readout, not a HUD-stack banner.** Overworld
(t0425): 2 bars + `HEAVY STANCE` row, buff bottom-right as `150% DAMAGE 28:28`. Battle (t0435, ten seconds
later, same longplay): 3 bars + untimed `150% DAMAGE` banner directly under the stack. A ui-hud port that
renders buffs in one place is wrong in one of the two scenes, and the **buff timer exists only in the
overworld readout** (mm:ss format).

---

## What I did not do

I did not open `docs/gauntlet/L0/critics/*.md` or `docs/gauntlet/L0/sources/*.md` (§3.2). I touched
`LEDGER_EVIDENCE.md` only with `grep -c` to test the findings' own novelty claims, and read exactly one
matched line to check whether verdict 4 was a duplicate — it partially is (the 1.3 multiplier at `:3274` is
already banked against RR:153-154), but its declared overturn target (RR:195 blocker ⑤, the *proc* rule) is
a different sentence and is genuinely new. Novelty is not what I was asked to judge; truth and overturn are,
and both hold. No file outside this journal path was modified.
