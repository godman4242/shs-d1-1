# src-skilldata — HUNTER CRITIC

Packet: `docs/gauntlet/L0/worklist/src-skilldata.claims.json` — **41 claims, all 41 judged, 0 skipped.**
Source under review: `reference/extracted/skilldata.xml` (1,970 lines).
I did NOT open `docs/gauntlet/L0/sources/skilldata.md`.

**Result: 36 upheld · 5 refuted.** All three STILL_UNHELD claims fell to the hunter lens, plus one
false negative in an A2 claim caused by a wrong grep pattern, plus one PARTIAL whose blocker
conclusion is wrong.

---

## 1. Method — what I actually opened

Every line-number cite in the packet was re-extracted with `sed`/`python` and compared against the
quoted text. The three A1 claims were re-cropped and re-viewed at the stated crop, not taken on
trust. The two A3 parity claims were re-run from scratch with my own normalizer. Counts were
re-derived, never copied.

Crops I generated and looked at (Lanczos 3x, as the claims specify):

| claim | frame | crop | verdict |
|---|---|---|---|
| `skilldata/coin-cap-carry-weight-gold-trap` | `reference/frames/combat_frames/Nr4fQstqHDM_t0130s.png` | (0,0)-(700,260) → 2100x780 | **matches exactly** |
| `skilldata/hud-two-bars-a1` | same frame | (0,820)-(700,1080) → 2100x780 | **matches exactly** |
| `ui-hud/three-slots-on-screen` | `reference/frames/duel_dense/Nr4fQstqHDM_431.0.png` | (1380,900)-(1920,1080) → 1620x540 | **matches exactly** |

The A1 descriptions are unusually good. `t0130s` top-left really does show a silver-coin icon
with `425` over `COINS`, a `+` button, an oval gold-coin icon with `2` over `GOLD`, and a red
`GET G…` button — two independent currency counters, exactly as claimed. The bottom-left cluster
really is green `20 / 20` over blue `26 / 26` with `BALANCED STANCE` under a straw-hat portrait
medallion. `duel_dense/431.0` really is three bevelled slots: empty / `2` dimmed gold fist / `3`
gold up-arrow, with `20/20`, `26/26`, `CANNOT CHANGE STANCE` and `150% DAMAGE` on the left.

My own reproduction of the parity check (`reference/extracted/android/117_Mobile_SkillData.bin`
vs `reference/extracted/skilldata.xml`, XML-decl stripped, whitespace-normalised, blank lines
dropped):

```
android sha1 693f45b95fa1f2c5e35f2f50471937d4704b6808
web     sha1 693f45b95fa1f2c5e35f2f50471937d4704b6808
IDENTICAL
android skills 75 web skills 75  in android not web []  in web not android []
android lines 1895 web lines 1895
```

My sha1 differs from the packet's (different normalizer) but the **conclusion reproduces exactly**,
including the "1,895 lines" figure. Both A3 claims stand.

Counts I re-derived from `reference/extracted/skilldata.xml`, all matching the packet:
75 `<skill>` · 182 `<level>` · 182 `<chi>` · 182 `<cooldown>` · **0 `<input>` · 0 `<imageurl>`** ·
chi distribution `'':101, 10:18, 50:14, 5:11, 20:9, 3:8, 2:5, 6:4, 7:4, 8:4, 0:3, 100:1` (81
non-empty) · cooldown domain `2,3,3.5,4,5,6,8,9,10,15,20,30,60,70` · category histogram
`1:5 2:5 3:5 4:10 5:10 6:9 7:6 8:6 9:6 10:6 11:7`.

---

## 2. REFUTED (5)

### R1 — `skills-meters/crit-proc-rule` — **the crit proc rule IS held. This is the big one.**

The claim says "I found nothing that grounds it — this blocker survives the sweep."
It does not survive. `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3198-3223`:

```
internal function getDamage() : int
{
   var maxDamage:int = 0;
   var baseDamage:int = this.minDamage + Math.random() * this.damageRange;
   switch(this.stance) { ... }
   if(this.reload == this.maxreload)
   {
      if(this.stance != LIGHT_STANCE)
      {
         return maxDamage * 1.2 + this.STAT_CRITICALDMG;
      }
      return maxDamage * 1.5 + this.STAT_CRITICALDMG;
   }
   return maxDamage;
}
```

**The crit is DETERMINISTIC, not a chance roll.** It fires exactly when `reload == maxreload`, i.e.
when the Focus/reload bar is completely full. Multiplier is **1.5x in Light Stance and 1.2x in
every other stance**, plus the flat gear stat `STAT_CRITICALDMG` (`StatsManager.as:258` = id 204).

Corroborated on the HUD side: `BattleUI.as:262` `this.crittext.visible = percentage >= 1 &&
this.reloadbar.visible;` and `BattleUI.as:102` `this.crittext.text = LangManager.getString(175)`,
with `docs/gauntlet/L0/index/strings.json["175"] = 'Critical Hit'`. The "Critical Hit" label is a
pure function of the reload bar being at 100%.

The claim's own quote gets within one step of the answer — it names `STAT_CRITICALDMG:int = 204`
and dismisses it as "not a proc rule" — while `MCSPlayer.as:3219` and `:3221` use that exact field
*inside* the proc. And the surveyor cited `MCSPlayer.as:3098-3105` in a sibling claim, 110 lines
above the crit block, in the same function's neighbourhood.

**Overturns the ledger twice.** `docs/research/REBUILD_READINESS.md:152-153` says the wiki formula
is "Critical = 1.3x Physical. Keep `CRIT_MULT=1.3`." That is **wrong** — the source says 1.5/1.2.
`:190` blocker ② ("crit 1.3 vs 3 final — read one crit popup") and `:195` blocker ⑤ ("crit proc
rule (chance vs deterministic) — entirely absent") are both closed.

### R2 — `combat-core/mastery-domain` — the mastery domain IS resolved: it is 1-10.

The claim says it "is not resolved by anything I read". Three independent artifacts resolve it.

1. `StatsManager.as:1834` passes `getStat(1000),getStat(1001),getStat(1002)` into
   `player.initPlayer(...)` as the `lightMastery/balancedMastery/heavyMastery` arguments
   (`MCSPlayer.as:182`, assigned at `:195-197`).
2. `StatsManager.as:2940-2943` (`getStatType`): ids `1000 <= id < 2000` are `SKILL`, and the
   `case SKILL:` branch at `StatsManager.as:3956-3961` returns `skillStat.getValue()` — the skill's
   `<value>`, which runs 1..10 in `skilldata.xml`.
3. Decisive: `MCSPlayer.as:3166-3184` branches on **the same fields** with
   `this.lightMastery >= 3 / >= 4 / >= 5` to unlock Launch/Deflect/AirCombo. Those thresholds are
   meaningless on a 0-100 scale (they would be true from the first point) and exactly right on a
   1-10 skill ladder.

And the game itself does the arithmetic for us: `InventoryUI.as:1941-1965` recomputes the very same
coefficients from `mastery = StatsManager.getStat(1000/1001/1002)`:

```
stanceName = "light";    mastery = getStat(1000); dmgModifier = 0.5 + 0.5*mastery*0.01; slashModifier = 1.5;
stanceName = "balanced"; mastery = getStat(1001); dmgModifier = 1   + 0.5*mastery*0.01; slashModifier = 1 + 0.5*mastery*0.01;
stanceName = "heavy";    mastery = getStat(1002); dmgModifier = 1.5;                    slashModifier = 0.5 + 0.5*mastery*0.01;
```

So the coefficient **can** be ported as a number. The consequence the claim was groping for is real
but different: with mastery 1-10 the Balanced reach term only spans x1.005..x1.05 and the Heavy
term x0.505..x0.55, which is precisely why `MCSPlayer.as:3053-3055` needs a hard floor of 100 —
Heavy sits on the floor for most of the game. That is a finding, not an unknown.

### R3 — `skilldata/category-11-enemy-only` — "appears in ZERO npcdata rows" is FALSE (wrong grep).

The claim's evidence line is `grep of <skill>NNNN</skill> over reference/extracted/npcdata.xml
returns 0 for all seven`. That grep returns 0 — but only because **npcdata does not use that
encoding**. It writes `<skill><id>NNNN</id><lvl>N</lvl></skill>`. The category-11 skills are all
over npcdata:

- `reference/extracted/npcdata.xml:3898` — `<skill><id>1064</id><lvl>1</lvl></skill><skill><id>1065</id><lvl>1</lvl></skill>`
- `reference/extracted/npcdata.xml:3934` — `<skill><id>1501</id><lvl>3</lvl></skill>` … `<skill><id>1064</id><lvl>1</lvl></skill><skill><id>1065</id><lvl>1</lvl></skill><skill><id>1068</id><lvl>1</lvl></skill>`
- `reference/extracted/npcdata.xml:4349` — `<skill><id>1500</id><lvl>3</lvl></skill>` … `<skill><id>1068</id><lvl>2</lvl></skill>`
- 1500 appears in 5 npc rows, 1501 in 2, 1068 in 5, 1064/1065 in 5 each, 1066/1067 in 2 each.

Three things follow, and all three *improve* the lane:
1. They are **granted in data, not in code**. An enemies-ai reader working npcdata would find them.
2. `npcdata.xml:4349` grants `<id>1068</id><lvl>2</lvl>` — the level-2 Undying that
   `MCSPlayer.as:2164` branches on. The claim says Undying "has no data row" for level 2; the
   NPC row supplies it.
3. The REVERSED/DUAL stance NPCs are now **enumerable by row** (5 + 2), which is a concrete L4 target.

What survives from this claim: category 11 really is 7 rows (I counted the histogram), 1500/1501
really have no `<displayname>`/`<order>`/`<lvlreq>`, and skill 1068 really has no `<level>` element
(`skilldata.xml:1842-1847`). The negative assertion is what fails.

### R4 — `skilldata/input-field-empty` — the `<input>` finding is right; the blocker-④ conclusion is wrong.

`grep -c "<input>"` and `grep -c "<imageurl>"` over `reference/extracted/skilldata.xml` both return
**0**; I re-ran it. `XMLSkill.as:18/:24` declare the fields and `:60-75` parse them. All true.

But the claim's operative conclusion — "blocker ④ confirmed STILL OPEN and **its most likely home
eliminated**" — is refuted. The Dragon Dance input has a home, and it is a whole UI class:

- `reference/decompiled/shs3_android/scripts/DragonDanceUI.as:68` —
  `this.nodesArray = [this.node0,...,this.node7];` — an **eight-node ring**.
- `DragonDanceUI.as:70` — `this.earlierHeavenLabel = ["sky","wind","water","mountain","earth","thunder","fire","lake"];`
- `DragonDanceUI.as:71` — `this.laterHeavenLabel = ["fire","earth","lake","sky","water","mountain","thunder","wind"];`
- `DragonDanceUI.as:355` — `this.sequence += num.toString();` — **the input is a digit string of clicked node indices.**
- `DragonDanceUI.as:367` — Earlier Heaven completes on `sequence.length == 4` with nodes
  **1, 2, 4 and 6** clicked, which then calls `setLaterHeaven()`.
- `DragonDanceUI.as:447` / `:609` — validation is `danceTarget.getSequence() == this.sequence`.
- **Kanji statue:** `Obj_DragonDanceStatue.as` (`[Embed(... symbol="symbol2431")]`, field
  `word:MovieClip`, NPC 801). At `:38-64`, a Later-Heaven statue picks its target sequence from
  five fixed permutations via a **node-seeded deterministic RNG**:
  `rng = new RNG(StageManager.getCurrentNode()); dice = rng.rand(5);` →
  `"1246"+num`, `"4216"+num`, `"1642"+num`, `"1426"+num`, `"6241"+num`.
- Supporting objects: `Obj_DragonDancePath.as`, `Obj_DragonDanceLoot.as`,
  `DragonDanceInteractiveStageObject.as`, `shs3_android_fla/dragondancewords_212.as`.

`REBUILD_READINESS.md:205` blocker ④ ("Dragon Dance **input** + Kanji-statue bonus") is largely dead.

### R5 — `skilldata/focus-and-crit-not-here` — both blockers it declares open are closed.

Its lane_impact: "blockers ③ and ⑤ confirmed still open after an exhaustive read of this source."

- **Blocker ⑤** falls to R1 above.
- **Blocker ③** ("Focus numerics (max/fill/switch-cost)") is closed by the packet's *own*
  `skills-meters/focus-is-the-reload-meter`, every cite of which I verified line-exact:
  `StatsManager.as:1839-1842` (`return 48 + (getPlayerStats(STAT_SPEED) + findBonusStat(STAT_SPEED)) * 6;`),
  `SkillManager.as:218-219` (`case SKILL_FOCUS: owner.reload = owner.maxreload - 1;`),
  `StatsManager.as:1921-1930` (slashusage, floor 48), `MCSPlayer.as:3098-3105` (stance-switch cost).

The narrow statement "skilldata.xml itself contains no crit field" is true and I am not disputing
it. The claim is refuted on its conclusion, which is the part the ledger would consume. Two claims
in one packet asserting opposite fates for blocker ③ is itself a defect.

---

## 3. UPHELD (36) — the ones worth naming

These were checked line-by-line and came back **exact**, quote and range:

- `combat-core/stance-reach-formula` — `StatsManager.as:1915-1919` is `getBaseSlashLengthVal` verbatim;
  `MCSPlayer.as:3030` (Light x1.5), `:3041` (Balanced), `:3052-3055` (Heavy + floor 100), `:3067`
  (Reversed x1.5), `:3078-3081` (Dual + floor), `:3094` `InputManager.setMaxDistance(this.slashLength)`.
  Every single line number lands on the quoted text. Ledger blocker ① at `:190` is genuinely dead.
- `combat-core/five-stances-not-three` — `skilldata.xml:1947-1957` and `:1959-1969` are skills 1500
  and 1501, category 11, no displayname. `EnemyPlayer.as:836-843` is the quoted `getMastery(1500)` /
  `setStance(REVERSED_STANCE)` block **verbatim**. `grep -ic "reversed\|dual" docs/research/REBUILD_READINESS.md`
  returns **0**, exactly as claimed. (Range nit: the same block starts at `EnemyElite.as:160` and
  `FriendlyElite.as:83`, one line before the cited ranges — trivial, and the cited range contains the quote.)
- `progression/required-is-skill-points` — skill 1000's `<required>` column is literally
  `1,1,2,3,4,5,6,7,8,9` = **46**, and `skilldata.xml:73-79` is the level-10 row with `<required>9</required>`.
  `strings.json["158"] = 'Required Skill Points'`. Exact.
- `skilldata/unlock-cadence-and-stance-sp-cost` — I rebuilt the whole 75-row table. Chi tree lvlreq
  `0,5,15,25,35,45,50,55,65,75`; Ninja tree `10,15,20,30,40,50,60,70,80`; **categories 1/2/3 carry no
  `<lvlreq>` at all**. Both stated exceptions (Lay Trap 15, Chi Charge 50) are real. Exact.
- `skilldata/51-skill-animations` — decoded `93_MCSCharacter_SkillsAnimationData.bin` (it is
  **UTF-8 with a BOM**, not UTF-16 — the §0 warning does not apply to this blob) and counted
  `animdata 1 / anim 51 / f 547 / n 8351`. `backthrow d=39` vs `backthrow_victim d=36`;
  `kneegroin d=30` vs `kneegroin_victim d=41`. `flurry_pose`, `cleave_pose`. All exact.
- `skilldata/orphan-buff-animations` — `enchantweapon`, `buffarmor_start/end`, `warcry_start/end` are
  real `<anim>` entries in that blob, and `grep -rli` over the whole android script set returns
  **only** `MCSActor.as`. Exact.
- `skilldata/chi-costs-not-single-digit` — distribution reproduced exactly; `skilldata.xml:1648` is
  `<chi>100</chi>` on Mass Shadow Clone; `:1353` is the explicit `<chi>0</chi>` on Spirit Thief.
  The ledger's `:196` "real Chi costs are single-digit (2/5)" is a frame-read generalised from two
  early skills and is genuinely an over-claim.
- `skills-meters/measured-cooldowns-explained` — I re-ran the arithmetic. `getCooldown` is declared
  `: int`, so `5*24=120 → 120*(1-5/600)=119.0 → 119/24 = 4.9583 → "4.96"`;
  `240*0.9916=238 → 9.9166 → "9.92"`; `216*0.9916=214.2 → int 214 → 8.9166 → "8.92"`.
  Reproduces `REBUILD_READINESS.md:194` to the hundredth. This is the strongest single piece of
  android→web tuning-parity evidence in the packet.
- `skilldata/read-android-not-web` — `§1t120s0§.as:88` is `public static var §1t10163s0§:int = 1064;`
  against `SkillManager.as:88` `SKILL_BACKTHROW:int = 1064`. I counted the constants:
  **exactly 50 `SKILL_*` constants, and all 50 map to a real skilldata id, with zero orphans.**
- `skilldata/enemy-range-bands` / `enemies-ai/npcs-run-on-skilldata` — I counted the four arrays at
  `EnemyPlayer.as:30/:32/:34/:36`: **16 / 13 / 22 / 16**. Exact.
- `skilldata/category-to-tree-names` — upheld, and I found a **better cite than the surveyor's**:
  `SkillScreenUI.as:104` declares `this.categoryDesc = [6024,6025,6026,6027,6028,6029,6030,6031,6032,6033];`
  — the ten-tab mapping is stated in code, not just inferred by cross-check.
- `rebirth-elements/element-gate-is-a-stat-threshold` — `skilldata.xml:1658` is
  `<req><has><id>28</id><qty>30</qty></has></req>`; `StatsManager.as:226/228/230/232` are the four
  STAT ids; `StatsManager.as:4171-4174` is the `comparison = "gte"` default, **verbatim on those exact
  lines**. Also `StatsManager.as:4230` handles `id >= 28 && id <= 31` as one family, confirming
  `skilldata/element-stat-is-one-system`.
- `economy/coin-cap-weight-cap-mining-tiers` — every string checked. `7060` really does ship the typo
  `'Allows you to mine coal, iron, tin and tin deposits.'` The Coin Purse level-5 desc is **7007**,
  not 7024 — because 7024-7028 are the orphaned Steal strings, which quietly corroborates the two
  orphan claims.
- `skilldata/coin-cap-carry-weight-gold-trap` — `getMaxCoins()` at `StatsManager.as:2632-2650` is the
  exact 1000/2000/4000/6000/8000/10000 ladder; `:2655` and `:2300` are verbatim. **THE FRAME WINS
  and the claim says so**: the identifier is `STAT_GOLD` but the frame shows COINS and GOLD as two
  separate counters, so `STAT_GOLD` holds coins. I looked; the claim is right.
- `skilldata/orphan-steal-and-smithing` / `meta-social/pvp-rooms-and-a-cut-steal-skill` — strings
  6022/6023/7024-7028/6051/6055/7042 all verbatim; `GenericActionButton.as:191-193` and `:309-311`
  and `StealActionIcon.as:5-6` verbatim; `skilldata.xml:887` closes 1022 and `:890` opens 1024, so
  **1023 really is the single hole in the 1000-1073 run**. Both claims are honest to refuse the
  id-1023 attribution and I am not going to punish that. See NF-13 for a refinement.

Minor imprecisions I am **not** refuting (they do not touch the operative assertion):
- `skilldata/skill-slots-3-to-8` says "41 player-equippable actives". I count **42** non-passive
  skills in categories 1-10. The figure works only if Jump is excluded as the permanent slot-0
  occupant, which the sibling claim `ui-hud/skill-slots-3-to-8` states. Worth normalising to
  "42 actives, one of which (Jump) is pre-placed in slot 0".
- `skills-meters/focus-is-the-reload-meter` says per-slash drain is "the weapon's slashusage
  (floor 48)". True as a base, but incomplete — see NF-7, the drain is stance-scaled.
- `skilldata/hud-two-bars-a1` calls it "the in-combat player HUD". The frame I opened is the
  **overworld/room** screen (it carries the `…` chat bubble and the COINS/GOLD strip). The
  substance — two bars, raw integers, no Focus or Critical bar in that cluster — is exactly right,
  and the absence of a third bar there is itself consistent with `BattleUI.reloadbar.visible`
  being battle-only. `duel_dense/431.0` shows the battle version, which *does* carry a third bar.

---

## 4. NEW FINDINGS — the silence

Things in or adjacent to this source that **no claim in the packet mentions at all**.

**NF-1 · The crit rule.** See R1. `MCSPlayer.as:3215-3222`. Deterministic, full-Focus-gated,
1.5x Light / 1.2x other, `+ STAT_CRITICALDMG`. Overturns `REBUILD_READINESS.md:152-153` (`CRIT_MULT=1.3`),
`:189`, `:190` blocker ②, `:195` blocker ⑤.

**NF-2 · Crit HUD tell.** `BattleUI.as:262` + `strings.json["175"] = 'Critical Hit'`. The label is a
pure function of `reloadbar` percentage >= 1. Free A1 verification target for a future frame pass:
find a frame where the reload bar is full and "Critical Hit" is on screen.

**NF-3 · The shipped build contradicts itself on crit.** `InventoryUI.as:1946/:1955/:1964` sets
`critModifier = 1.2` for **light**, `1.5` for balanced, `1.5` for heavy — the exact inverse of the
sim's Light-1.5 / other-1.2 at `MCSPlayer.as:3217-3221`. The gear-comparison panel's
"critical dmg: min - max (stance)" readout (`InventoryUI.as:2087`) therefore lies to the player in
at least one stance. A 1:1 rebuild must pick the **sim** and can optionally reproduce the UI bug.

**NF-4 · Mastery is 1-10.** See R2. `InventoryUI.as:1941-1965` + `MCSPlayer.as:3166-3184` +
`StatsManager.as:1834` / `:2940-2943` / `:3956-3961`.

**NF-5 · Per-stance DAMAGE multipliers (nobody claimed these).** `MCSPlayer.as:3198-3213`:
Light `x(0.5 + 0.005*mastery)`, Balanced `x(1 + 0.005*mastery)`, Heavy/Dual/Reversed **flat x1.5**.
This is the exact mirror of the reach formula — Light trades damage for reach — and it means
Heavy/Dual/Reversed damage does **not** scale with mastery at all.

**NF-6 · Heavy stance takes 80% defense.** `MCSPlayer.as:3231-3238` (`getDefense()`, `return defense * 0.8;` at `:3235`), and
`InventoryUI.as:1964` sets `defModifier = 0.8` for heavy. Ledger `:189` already has "Heavy def x0.8" —
this is the source line that grounds it.

**NF-7 · Focus/reload drain is stance-scaled, and a crit empties the bar.**
`MCSPlayer.as:3240-3263` `deductReloadBar()`:
`if(reload == maxreload) reload = 0;` then Light `-= slashUsage/2`, Balanced/Reversed `-= slashUsage`,
Heavy/Dual `-= slashUsage * 1.5`. So (a) landing a crit costs the whole bar, and (b) Light rebuilds
Focus twice as fast per slash as Balanced and three times as fast as Heavy. This completes
`skills-meters/focus-is-the-reload-meter`, which only had the flat `slashusage`.

**NF-8 · The Focus bar's displayed zero is not zero.** `MCSPlayer.as:3265-3272` `bonusReload()`:
`this.reload += 6;` then `updateReload((this.reload - 24) / (this.maxreload - 24));`. The bar maps
`[24, maxreload]` onto `[0,1]`, so the first 24 frames of charge are invisible. A rebuild that maps
`[0,maxreload]` will feel wrong even with the right numbers.

**NF-9 · The Dragon Dance input.** See R4. `DragonDanceUI.as:68-71`, `:355`, `:367`;
`Obj_DragonDanceStatue.as:38-64`. Eight trigram nodes, a digit-string sequence, the 1/2/4/6
Earlier-Heaven gate, and node-seeded deterministic statue sequences.

**NF-10 · The ten-tab mapping is declared in code.** `SkillScreenUI.as:104`.

**NF-11 · Category-11 skills are in npcdata.** See R3. `npcdata.xml:3898`, `:3934`, `:4349`.

**NF-12 · The WEB build's own SWF header says 24 fps.** I parsed the header of
`reference/decrypted/shs3_payload_decoded.swf` (CWS, SWF v17): **frameRate = 24.000, frameCount = 6**;
`reference/decrypted/shs3_android_payload_decoded.swf` (CWS, v26) is also 24.000. This closes the
android-provenance hole in `art-anim/engine-tick-is-24fps` and `skilldata/24fps-tick`, whose only
frame-rate cite was `Mobile.as:117` (Android-only). The x2.5 conversion to this repo's 60Hz Sim is
now grounded in the **web** artifact.

**NF-13 · Steal was a NODE ACTION, not a skill.** `NodeUI.as:57` `public static var ACTION_STEAL:int = 22;`
with an embedded icon at `StealActionIcon.as:5`. `ACTION_STEAL` is referenced only by
`GenericActionButton.as:191`/`:309` in the whole android script set. This refines both orphan claims:
the Steal content sits in the **overworld node-action** space (alongside ACTION_ATTACK/ACTION_BACK),
which is why it has strings and art but no `<skill>` row — and it is further evidence *against*
attributing it to skill id 1023.

**NF-14 · `canChangeStance()` is a state whitelist.** `MCSPlayer.as:2965-2968`: stance may only
change from `IDLE / POSE / RUN / WALK / SKILL_CHICHARGE`, or from `FLINCH` if the previous state was
one of those. The frame I opened (`duel_dense/Nr4fQstqHDM_431.0.png`) shows exactly this rule
surfaced to the player as the bar label **`CANNOT CHANGE STANCE`**.

**NF-15 · The frame's gold `150% DAMAGE` is the potato buff, not a crit readout.**
`strings.json["4132"] = 'Eat this potato to get the 150% Damage buff. Note: Only one buff may be
active at a time.'` and the buff enum at `StatsManager.as:288-312` (`BUFF_XP/ATTACK/DEFENSE/SPEED/
AP/DUELTOKENS/COINS/RARELOOT/MUTE/FULLMUTE/HELL/INJURED/MODERATOR` = 0..12). A rebuild reading that
frame naively would mis-model it as a crit indicator. **A 13-value consumable-buff enum appears in
no ledger system.**

**NF-16 · Heavenly Sword's numbers are on disk and nobody claimed them.**
`skilldata.xml:1435-1464` (skill 1047, lvlreq 65, chi 50, cooldown 30, three levels) with
`strings 7078/7079/7080 = '500 damage, 5 sec delay' / '4 sec' / '3 sec'`. A 500-damage delayed AoE
with a level-scaled telegraph window is a combat-core fact absent from every claim in the packet.

**NF-17 · Four actives cost ZERO skill points.** `skilldata.xml:240` (Jump 1003, `<required></required>`),
`:1282` (Chi Punch 1042 L1, empty), `:1491` (Dash Right 1049, `<required>0</required>`),
`:1506` (Dash Left 1050, `0`). The empty-vs-zero split is a **parser hazard**: `XMLSkill.as:253`
does `required = int(this.levelList[lvl].required);` and `int("")` is 0 in AS3, so it happens to
work — a TypeScript port using `parseInt("")` gets `NaN`.

**NF-18 · The skill-tree DAG is fully specified and nobody enumerated it.** 52
`<req><has><id>N</id><qty>Q</qty></has></req>` edges in `skilldata.xml`: 24 element-stat gates
(6 per element on ids 28/29/30/31), 12 stance-mastery gates (4 per stance on ids 1000/1001/1002),
and 16 skill→skill chain edges (1042→1005, 1005→1006, 1024→1010, 1007→1024, 1006→1043, 1043→1044,
1044→1045, 1045→1046, 1046→1047, 1051→1052, 1052→1053, 1053→1054, 1054→1012, 1012→1055, …).
That is the entire unlock graph, ready to port as data — a `progression`/`skills-meters` asset that
no claim in this packet, and no ledger system, currently holds.

---

## 5. Ledger-precedence note

No measurement-doc-vs-frame conflict arose in this packet: the three A1 claims and the payload
agree everywhere (three HUD slots on screen vs `3 + getStat(1008)`; two integer bars vs raw
`<chi>` values). The one place a source **is** overridden is R1/NF-3, and there the conflict is
code-vs-code (sim vs inventory preview), not doc-vs-frame — the sim wins for gameplay.

Where the ledger loses outright: `REBUILD_READINESS.md:152-153` `CRIT_MULT=1.3` is contradicted by
`MCSPlayer.as:3215-3222`, and `:205` blocker ④ is contradicted by `DragonDanceUI.as`.
