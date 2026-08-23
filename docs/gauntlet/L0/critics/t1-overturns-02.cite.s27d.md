# BLIND CRITIC — CITE LENS — packet `t1-overturns-02` (s27d)

**Packet size 7 · judged 7 · skipped 0 · refuted 1 · held 6 (two with material corrections) · 5 new findings.**

Machine audit said `RESOLVES` on all seven. That is the easy half. The job was the part a script
cannot do: open the artifact and ask whether it says what the claim says it says. It mostly did —
this is a strong packet, better than the citelint status alone would predict — but three claims
carry assertions their own artifacts contradict, and one of those three ships a false number into
config as its headline deliverable.

---

## The one refutation

### ✗ `the-focus-meter-contract-is-fully-recovered-in-web-v0717` — REFUTED, material

Its capacity, spend and crit-gate lines are all verbatim-correct. I checked every one. But it
ships two numbers that are false, and it claims completeness it does not have.

**1. "Stance switch is free above 48 — changing stance costs nothing."** Wrong. The stance setter
`§1t3489s0§` (`§1t99s0§.as:3083`) ends with, at `:3160-3170`:

```
if(§1t1525s0§.§1t9948s0§())
{
   this.§1t4414s0§ -= 48;
   ...clamp to 0...
   §1t1525s0§.§1t9941s0§().§1t5205s0§(this.§1t4414s0§,this.§1t4415s0§);
}
```

A flat 48-Focus charge. The android twin de-obfuscates the guard — `MCSPlayer.as:3096`
`if(StageManager.isBattle())` — and charges a *different* price (`:3098-3105`,
`reload > maxreload/2 → maxreload/3`, else `-= maxreload/6`). So the switch costs Focus in both
builds, and the two builds disagree on how much. RR:195 blocker ③ asks for exactly
"max/**fill**/**switch-cost**"; this finding answers switch-cost with "nothing".

**2. "Regen +6/tick."** Wrong. The per-tick regen is `§1t99s0§.as:1203-1205` — `++this.§1t4414s0§`,
**plus one** — repainting the HUD at `:1208`. The `+= 6` at `:3320` is a **kill bonus**: its only
caller is `§1t1543s0§.as:2047-2049`, `if(_loc4_ > 0)` where `_loc4_` is the death count, and the
android twin is literally named `bonusReload`, called from `NPCManager.as:1709-1711` under
`if(deathCount > 0)`.

**3. "That is the complete fill/consume/gate contract in one place."** False on its face: a third
fill path exists — `§1t120s0§.as:231` `param3.§1t4414s0§ = param3.§1t4415s0§ - 1;` (android
`SkillManager.as:218-219`, `case SKILL_FOCUS`) — Replenish Focus fills to max **minus one**,
deliberately stopping short of the crit.

The true parts do not die with it: I have re-filed capacity, spend, the corrected fill model and the
48-cost as my own findings, under my own cites.

---

## The six that held

### ✓ `cannot-change-stance-...` — the strongest item in the packet
I opened **both frames myself**, crop `x40-760, y920-1080`, 2× LANCZOS.

- `duel_dense/Nr4fQstqHDM_428.0.png`: green **20/20**, blue **26/26**, third bar an **empty brown
  track** carrying pale-grey `CANNOT CHANGE STANCE`, yellow `150% DAMAGE` beneath.
- `duel_frames/Nr4fQstqHDM_t435.0s.png`: same fighter, same buff, seven seconds later — green
  **19/20**, and that third bar is **~40 % filled solid white with no text on it at all**.

The bar fills; the words go away. Every code line resolves verbatim (`§1t113s0§.as:328/336/340/344/346/348`,
`:111` building the grey label from `getString(960)` at `#BBBBBB`), and `strings.json` has **no key
960** across all 2,533 entries — web-only, as claimed. I then closed a loop the finding left open:
`§1t99s0§.as:3325` shows the reload meter pushing `(reload, maxreload)` into that very HUD function,
and android `BattleUI.as:259-262` is the plain-named twin `updateReload(percentage)` with `crittext`
visible at `percentage >= 1`. The third bar **is** the Focus meter, frame-confirmed and code-confirmed.

**THE FRAME WINS OVER THE MEASUREMENT DOC HERE, AND I SAY SO OUT LOUD.** RR:178's own first-hand LOOK
verdict read a transient low-Focus readout as a permanent lock, and RR:158-160 built "removed 2014
behavior" on top of it. `§1t99s0§.as:3058-3081` is a live in-combat stance **cycler** that early-returns
only `if(this.§1t4414s0§ < 48)`. Both fall.

*One correction to carry:* the label shows while `reload <= 48`, the cycler unlocks at `>= 48` — a
one-tick overlap at exactly 48. Cosmetic; does not touch the overturn.

### ✓ `crit-1.3-and-heavy-defence-0.8` — verbatim, and under-claimed
`§1t99s0§.as:3272-3274` and `§1t5957s0§.as:2727/2736/2745/2746/2751-2752` all match character for
character. I also opened the defence side it did not cite: `§1t99s0§.as:3284-3288`,
`if(this.stance == §1t12222s0§) { return defense * 0.8; }` — the one-way Heavy-defender penalty in
target-build source. RR:153-154's open ask *"(Read a real OG crit popup to fully seal it.)"* is
discharged; RR:190 blocker ② closes. Its self-imposed limit ("`:3272` tests an equality, not a
probability") is *honest*, and I do not refute honesty — but the android twin de-obfuscates it
(`MCSPlayer.as:3215 'if(this.reload == this.maxreload)'`), so the proc rule is deterministic. Filed
separately, along with the hazard it misses: **android's crit is 1.2/1.5, not 1.3.**

### ✓ `dan-rank-is-mechanical-not-cosmetic` — held on its headline, **two corrections**
The mechanic is real and verified in both builds: `§1t1523s0§.as:2346`
`var _loc2_:int = 90 + §1t7356s0§(§1t9426s0§) * 5;`, `:254` `§1t9426s0§ = 25`, android
`StatsManager.as:220 STAT_DAN = 25` and `:1915-1917 getBaseSlashLengthVal` — a function whose name
settles that this **is** the blade path, wired to `InputManager.setMaxDistance` at `MCSPlayer.as:3094`.
Asymptote 210 px at dan 0 → 255 px at dan 9, arithmetic correct.

- **Correction 1 — mis-cite.** The ledger sentence it quotes is rebirth-elements blocker ③ at
  **`REBUILD_READINESS.md:205`**, not `:245`. RR:245 is *meta-social*, whose ③ is "achievements list,
  daily-reward table, token costs" — untouched by this evidence.
- **Correction 2 — the ids are backwards.** "Must cite ids 455-464, not 456-464" is the wrong way
  round. Both builds emit `""` for dan 0 then `getString(456)…getString(464)` for dan 1-9
  (`§1t5957s0§.as:3064-3102`, android `InventoryUI.as:2274-2315`); `getString(455)` has **zero hits**
  in either tree. Ten dan states, **nine** displayed titles.

I held it because the overturn it names — dan is mechanical, not cosmetic — survives both errors
intact, and refuting would destroy a first-hand-verified mechanic over a naming detail. Minor: `+5`
is to the *base*, which then runs the per-stance multipliers (`MCSPlayer.as:3030/3041/3052`), so
Light actually gains ~7.5 per dan.

### ✓ `forge-cost-is-a-node-level-formula` — clean
`:1954` reads the node level, `:1955-1958` clamps to 80, `:1959` `param1 = _loc3_ * 100`. The three
tiers sit at `:1968 / :1980 / :1993` and their material spends match `strings.json` 845/846/847
word for word against `resolved_names.json` (20061 Iron, 20062 Tin, 20063 Copper, 20060 Coal,
20065 Titanium). Android `InteractUI.as:1002-1046` is structurally identical with plain names,
which identifies `§1t9936s0§` as `getCurrentNodeLevel` beyond argument. I also checked the aside:
`InteractUI.as:1051 addRandomSword(level)` — a random sword of that level, correct. RR:79-80's
"Forge 700c+2 ore" is the node-level-7 instance of the **lowest of three** tiers, filed under
ECONOMY STATICS. Overturn upheld. C2 does not bite: the formula is read from the **web** payload.

### ✓ `repair-weapon-cost-is-node-level-times-ten` — clean, blocker closes
`§1t401s0§.as:1058` `cost = §1t1525s0§.§1t9936s0§() * 10;` — same accessor as the forge block in the
same file. `:662` formats `getString(848)` with `[_loc1_ * 10]`; `strings.json["848"]` =
*"Repair your currently equipped weapon?\nCost: [0] coins"*. Android `InteractUI.as:1057-1075` gives
the semantics in plain names, including the durability reset `if(weapon.uses > 1) { weapon.uses = 1; }`
and the refusal on itemID 0/13000 — and I confirmed the web build carries the identical guard at
`:1067-1080`. **RR:215 blocker ③ "Repair-Weapon cost (never captured)" can be struck.**

### ✓ `spd-to-cooldown-...-diverges-from-android` — held, and the divergence is the valuable half
`§1t1523s0§.as:2291/2293/2295` match verbatim; the feeder at `:2279-2287` reads STAT_SPEED (`:220` = 8)
plus gear and applies ×1.5 under the buff. Android `getSkillCooldownModifierVal` (`:1854-1860`) caps
at **300**, web at **600**. Verified both sides myself. RR:195 ④ closes as CONTRACT; RR:200 ① loses its
cooldown half. Note for whoever rewrites RR:200: its **range** half also closes, via the dan/slash-length
formula judged above in this same packet.

---

## New findings (mine, own cites)

1. **`stance-switch-in-battle-costs-48-focus-flat`** — `§1t99s0§.as:3160-3170` vs android
   `MCSPlayer.as:3096-3105`. Closes the switch-cost third of RR:195 ③ and is a second, independent
   kill on RR:159-160.
2. **`focus-fill-is-+1/tick, +6/kill-batch, replenish→max-1`** — `§1t99s0§.as:1203-1208`,
   `§1t1543s0§.as:2047-2049`, `§1t120s0§.as:231` (+ android twins). Closes RR:190 ⑤ **without** a
   "watch the bar" session.
3. **`crit-proc-is-deterministic-on-a-full-meter`** — `§1t99s0§.as:3272` / android `MCSPlayer.as:3215`.
   Closes RR:195 ⑤ ("entirely absent"). Carries the parity trap: android crit is **1.2 / 1.5**.
4. **`dan-titles-are-nine-strings-456-464`** — plus an uncatalogued shogo layer appended to the
   character name in `#7D5500`: Renshi (dan 3-5), Kyoshi (6-7), Hanshi (8+), ids 465/466/467.
   Also: the `< 9` cap means MAX_DAN_RANK is **9 rebirths**, bearing on RR:164-165.
5. **`hud-reload-normalisation-diverges-48-web-vs-24-android`** — `§1t113s0§.as:328` vs
   `MCSPlayer.as:3272`. Same capacity formula, different zero point; a HUD ported from the blobs
   draws the third bar wrong.

## Parity note (C2 discipline)
Every load-bearing number above is read from the **web** payload first, with the android file used
only to de-obfuscate names. The two places where the builds genuinely disagree — SPD cap 600/300,
stance-switch cost, crit 1.3 vs 1.2/1.5, HUD zero point 48/24 — are called out as divergences rather
than reconciled. The dan **titles** are the one item resting on v0.682 string text and carry the S0-3
UI-copy caveat; the `90 + DAN*5` formula does not.
