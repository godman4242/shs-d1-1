# t1-overturns-04 — BLIND CRITIC, LENS 2 (HUNTER)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-04.json` · 24 findings · 24 judged · 0 skipped.
Ledger read in full: `docs/research/REBUILD_READINESS.md` (378 lines).

⚠ **PACKET CHANGED ON DISK MID-RUN.** The file I first read (md5 differs) held 24 findings
ending `itemdata/reload-bar-max-is-a-hard-constant-and-diverges`, `itemdata/two-gold-items-are-coin-buyable`,
`items-equipment/condition-blocker-dead-in-both-builds`, `items-equipment/equipment-save-format-is-13-field`,
`items-equipment/generic-defense-floor-is-attacker-keyed`, `items-equipment/icon-namespaces-item-and-acc`.
The current file (md5 `0efc5e6b701e03b8b69977af6ec85468`) replaces those six with the six
`frames/HUNT-*` + `frames/v0717-*` items. **I judged the CURRENT 24.** The six dropped ids are
therefore UNJUDGED by this lane and need re-packeting.

---

## Summary of verdicts

- **2 REFUTED (material):** `hunter/buff-table-and-video-contamination`, `hunter/tenth-rebirth-tier-exists`.
- **22 upheld** as true-and-correctly-cited.
- **Only 3 of 24 claimed overturns survive the overturn check** (#14 repair cost, #19 SPD→cooldown,
  #21 reach-per-stance). **21 are inflated.** Six of them (`ledger_text: null`) name no ledger
  sentence at all, so nothing identifiable can fall; four point at a sentence the ledger already
  concedes verbatim two sections later; two point at a peer claim rather than the ledger; one
  (#5) points at a caveat its own evidence *confirms*.

---

## The four "already-conceded" cases — these must NOT rewrite the ledger

| Finding | Names as overturned | What the ledger already says |
|---|---|---|
| `frames/HUNT-war-tick-is-24-hours` | world-exploration ③ "day length … war tick" | :116 literally writes **"the War-Room 24h tick"**; :244 lists **"24h resolution"** under *Ready*. Expiry / farming / AP-regen — the other three-quarters of the blocker — are untouched. |
| `frames/HUNT-stance-triangle-and-ring-colours` | (none named) | :169 + :236 already give the ring enum **verbatim** ("Light blue / Balanced brown / Heavy red"); :74 + :189 already give **"Heavy defender Defense ×0.8"**. Only the counter-triangle is new, and it *adds*. |
| `hunter/interactui-service-cost-table` | seven Systems-formula gaps (:92-93) | Closes **none** of the seven. Its headline price, **Reinforce 5000c**, is already at :80; "all service prices" already *Ready* at :214. New datum = 1 HGold → 1000 coins. |
| `hunter/buff-table-and-video-contamination` | (none named) | :178 already records **"'150% DAMAGE' buff (Potato Dog)"** in these exact frames. |

## The mis-targeted overturns

- `hunter/hp-chi-regen-is-per-battle` names world-exploration ③ (real-world *day* length) and ④
  (**AP** regen rate + cap). Its evidence is **HP and CHI** regen at a **per-battle** clock. Different
  resource, different clock. Neither blocker moves. (:199 already lists start pools HP10/Chi10/AP30.)
- `hunter/elemental-rebirth-reward-table` names §3 item 7 (`MAX_DAN_RANK`/`tenthGold` labelling).
  An elemental-ATK grant table says nothing about either value.
- `itemdata/nine-paperdoll-slots-are-fully-named` names a **peer claim**, not a ledger sentence. It
  correctly kills that peer claim; the ledger's own "9-slot paperdoll" (:82, :209) is **confirmed**.
- `frames/v0717-rewords-the-daily-streak-ladder` names the S0-3 parity caveat — and its evidence
  **strengthens** that caveat. Nothing falls.

## The compound-blocker cases (partial, so the sentence survives as written)

`skills-meters ③ "Focus numerics (max/fill/switch-cost)"` is named by three findings, each supplying
one third: #22 → max (192), #10 → fill (+6/kill), #18 → the render dead zone. None falsifies the
compound sentence alone. **I closed the missing third myself** — see NEW-3.
Likewise `items-equipment ⑤` (compositing contract **+ icon manifest**) survives its icon half
against #13, and `combat-core ⑤` (fill trigger / amount / **consumption**) survives two thirds against #8.

---

## The two refutations

### REFUTED — `hunter/buff-table-and-video-contamination` (material)
The 13-entry buff enum (`StatsManager.as:288-312`) and the HUD strings (`OverworldHUD.as:1388-1425`)
verify **exactly**, and I read the frame myself: `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`
crop (230,960)-(560,1070) @4× LANCZOS shows HP **20/20**, Chi **26/26**, a third bar carrying
**"CANNOT CHANGE STANCE"**, and gold **"150% DAMAGE"** below it.

Its **operative instruction is wrong.** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:210-212`
(and web `§1t99s0§.as:211-213`, identical) is:

    if(StatsManager.hasBuff(StatsManager.BUFF_ATTACK)) { this.minDamage *= 1.5; }

It scales **`minDamage` only**. `damageRange` is untouched, and `getDamage` rolls
`baseDamage = minDamage + Math.random() * damageRange` (`MCSPlayer.as:3201`). So "any TTK/damage read
from `reference/frames/duel_dense/` must be divided by 1.5" **systematically over-corrects** — only
the floor of the roll is buffed, not the roll. Adopting it would corrupt every measurement lane it
claims to protect. Corrected version filed as **NEW-8**.

### REFUTED — `hunter/tenth-rebirth-tier-exists` (material)
The android cite is **exact** (I read 2201/2203/2205/2207 — citelint's `QUOTE_NOT_LOCATED` is a false
alarm). But the correction it asserts — *"tenthGold is real but is 20 HGold not 100 gold, and the base
is 5 HGold not 25 gold — the film read the wrong currency"* — is **false for the build we recreate.**

`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2652` (web v0.717):

    if(§1t7356s0§(§1t9426s0§) == 8) { §1t9713s0§(§1t9413s0§,100); ... }
    else                            { §1t9713s0§(§1t9413s0§,25); }

`§1t9413s0§` is declared `= 12` at `§1t1523s0§.as:228`; android's `STAT_HGOLD:int = 12` sits at
`StatsManager.as:194`. So v0.717 pays **25 Heavenly Gold** normally and **exactly 100** at Dan 8 —
`tenthGold=100` and the film's "+25g" are **exactly right**. And the currency claim fails on its own
terms: the game's UI calls Heavenly Gold "Gold" (`strings.json["636"]` "…unbreakable for **2 Gold**?"
is paid by `spendHeavenlyGold(2)`, `InteractUI.as:974`), while `STAT_GOLD` is displayed as *coins*
(`strings.json["848"]` "Cost: [0] **coins**", paid by `changeGold`, `InteractUI.as:1072`).
Letting this in would replace correct config with android-only numbers. What *does* fall in ledger
item 7 is filed as **NEW-4**.

---

## Build-parity work I did that the packet did not

Every A2 finding in this packet that is android-only, I re-opened in the **web v0.717** tree:

| Fact | android v0.682 | web v0.717 | verdict |
|---|---|---|---|
| repair cost | `InteractUI.as:1058` nodeLvl×10 | `§1t401s0§.as:1058` **identical** | parity ✓ |
| reinforce | `InteractUI.as:1083` 5000 | `§1t401s0§.as:1087` 5000 | parity ✓ |
| elemental rebirth | `InteractUI.as:848-899` +10/+20 | `§1t401s0§.as:872-921` **identical** | parity ✓ |
| drawn-line colours | `InputManager.as:172-179` | `§1t1541s0§.as:172-179` **identical** | parity ✓ |
| SkillUI gesture | `SkillUI.as:126/178/181` | `§1t6980s0§.as:126/180/183` | parity ✓ |
| paperdoll depth | `MCSCharacter.as:120` = 22 | `§1t75s0§.as:125` = 22 | parity ✓ |
| XP table | `StatsManager.as:78`, 99 entries | `§1t1523s0§.as:364`, 99 entries | parity ✓ |
| **crit / stance damage** | ×1.2 non-Light, ×1.5 Light; Heavy ×1.5 | **flat ×1.3 all stances; Heavy ×1.4** | **DIVERGES** |
| **rebirth payout** | 5 / 20 HGold | **25 / 100 HGold** | **DIVERGES** |
| **per-stance reach** | Light ×1.5; mastery ·0.01 | **Light ×1.4; mastery ·0.1** | **DIVERGES** |
| **stance gate / cost** | `reload < maxreload/6`; graded cost | **flat 48 gate, flat 48 cost** | **DIVERGES** |
| **SPD cooldown cap** | 300 | 600 | DIVERGES (already claimed, #19) |
| **Focus bar max / dead zone** | 120 / 24 | 192 / 48 | DIVERGES (already claimed, #18, #22) |

---

## NEW FINDINGS (mine, each with an artifact I opened)

**NEW-1 — the complete L1–L80+ XP table is in BOTH builds. "L11–80 XP curve is likely
unrecoverable" is dead.** `reference/decompiled/shs3_android/scripts/StatsManager.as:78` and
`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364` both hold a **99-entry** `expArray`.
Indices 1–10 are `550, 1450, 2950, 5150, 8350, 12150, 16350, 20900, 25900, 31400` — **exactly** the
ledger's own "XP caps L1–L10 (550…31 400)" (:77), which authenticates the array. Index 79 =
`4,025,800`. Kills :62, :200 ②, :350.

**NEW-2 — web v0.717 damage/crit formula: `CRIT_MULT=1.3` is VINDICATED, not overturned.**
`§1t99s0§.as:3255-3276`: LIGHT ×(0.5 + 0.4·mastery·0.1), BALANCED ×(1 + 0.2·mastery·0.1),
HEAVY/DUAL/REVERSED ×1.4; then `if(reload == maxreload) return dmg * 1.3 + STAT_CRITICALDMG;` —
**flat 1.3, every stance, deterministic on a full bar.** Closes combat-core ② ("crit 1.3 vs 3") and
skills-meters ⑤ ("crit proc rule … entirely absent"). At mastery 9 the stance ceilings are
0.86 / 1.18 / **1.40** — the ledger's §3.3 "0.9 / 1.2 / 1.4 are mastery-9 ceilings" is confirmed.

**NEW-3 — in-combat stance switching in v0.717 is FOCUS-GATED AT 48, not hard-locked. Ledger §3.4
is wrong and the recreation was right.** `§1t99s0§.as:3050` (`canChangeStance() && reload >= 48`),
`:3060` (`if(reload < 48) return;`), `:3162` (`reload -= 48`, inside the StageManager battle
predicate at `:3160` — structurally aligned with android's `if(StageManager.isBattle())` at
`MCSPlayer.as:3096`). Corroborated on film: the third bar in
`reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` (crop 230,960-560,1070 @4×) reads
**"CANNOT CHANGE STANCE"** with no visible fill — exactly the reload ≤ 48 state.
**This closes the switch-cost third of skills-meters ③.**

**NEW-4 — what actually falls in ledger item 7.** `§1t1523s0§.as:2644-2652` +
`:2652-2654` (`if(DAN < 9) changeStat(DAN, 1)`): a tenth-rebirth tier **does** exist (25 → 100 HGold)
and DAN caps at 9 ⇒ **10 dan ranks**. So "no 10th-rebirth tier" and "should be INFERRED, not
CONTRACT" both fall — while the **values** `tenthGold=100` and `+25g` are confirmed exactly.

**NEW-5 — the live blade stroke tapers 8 px → 0 px across the reach cap.**
`reference/decompiled/shs3_android/scripts/InputManager.as:360` and
`reference/decompiled/shs3_payload/scripts/§1t1541s0§.as:360` (identical):
`lineStyle(thickness - thickness * ((maxDistance - distanceLeft) / maxDistance), 10027008, …)`
with `thickness:int = 8` at `:57` in both. `greenLine()`/`redLine()` are the **gesture-pad** styles —
their only callers are `SkillUI.as:75` and `:136`. The blade's own render contract is `:360`, and it
gives a free on-screen reach readout: the stroke reaches zero width exactly at the reach cap.

**NEW-6 — web v0.717 per-stance REACH coefficients differ from android (rider on #21).**
`§1t99s0§.as:3094` LIGHT ×1.4 · `:3104` BALANCED ×(1 + 0.2·mastery·0.1) · `:3116` HEAVY
×(0.5 + 0.4·mastery·0.1) floored 100 · `:3131` REVERSED ×1.4 · `:3142` DUAL ×1 floored 100.
Base function and stage width are parity: `§1t1523s0§.as:2347` `120 + floor((90 + DAN*5)*SPD/(20+SPD))`,
`§1t1523s0§.as:104` `stageWidth = 800`. **Close the reach blocker with these, not the android set.**

**NEW-7 — territory owners are OPEN-ENDED, not four and not five (rider on #6).**
The four canonical clans are named at `strings.json["275"]-["278"]` — Aka Ryu / Midori Ken /
Aoi Hoiru / Ki Sensu (red / green / blue / gold, matching the banners I saw). But `["491"]` is
`'Neutral'`, and `["4400"]` `'Clan Deed'` + `["4401"]` `'Form your own clan. War Hero rank required.'`
+ `["4405"]` `"Edit your Clan's name, acronym, **color and banner**"` + `["816"]` `'Clan Color'` +
`["834"]/["835"]` `'Minor/Major Clan ( [0] territories owned )'` mean **player-founded clans own
territory and pick their own banner colour.** "≥5 owners" is a floor, not the model.

**NEW-8 — corrected replacement for the refuted #7.** The 13-entry buff table is real and verified
(`StatsManager.as:288-312`; `OverworldHUD.as:1388-1425`): XP/DAMAGE/DEFENSE/SPEED 150%, AP-regen and
duel-token-regen 200%, plus COINS, RARELOOT, MUTE, FULLMUTE, HELL, INJURED, MODERATOR. The footage
**is** buffed. But the buff is `minDamage *= 1.5` only (`MCSPlayer.as:210-212`; web `§1t99s0§.as:211-213`),
and the branches are an `else if` chain, so **exactly one** buff applies at a time. `BUFF_INJURED`
is the mirror: `minDamage *= 0.5; defense *= 0.5; baseSlashLength *= 0.5` (`:218-221`) — note it
halves **reach** too, which no lane has recorded.

---

## Minor corrections recorded but not fatal

- `itemdata-hunter/reload-bar-max-is-flat-not-speed` claims `baseReload` has **"NO read"**. It has one:
  `reference/decompiled/shs3_android/scripts/EnemyClone.as:49` `this.baseReload = owner.baseReload;`
  — plus three producers (`FriendlyElite.as:49`, `EnemyPlayer.as:754`, `EnemyElite.as:99`, each
  `48 + xml.speed * 6`). Functionally still dead (EnemyClone then sets `maxreload = 5 * 24` at `:77`),
  so the conclusion stands; the grep evidence does not.
- `hunter/web-focus-bar-dead-zone-is-48` carries an **uncited** measurement ("44.7 px/s predicted vs
  42.5 measured vs 38.3"). Not load-bearing — the code cite alone carries the finding — but it is not
  admissible under §0 as written.
- `hunter/paperdoll-is-23-slots-plus-quadruped-extension` verifies down to the constant:
  `MCSCharacter.as:56/58/60/62` give `PART_l_shoulder 23 / r_shoulder 24 / l_knee 25 / r_knee 26`,
  and `MCSWolf.as:13` raises `partListLength` to 25 with `:148` `tail3 = partList[PART_prop3]`,
  `:184` `r_frontleg1 = partList[PART_r_shoulder]`, `:193` `r_backleg2 = partList[PART_r_knee]`. Exact.
- `itemdata/nine-paperdoll-slots-are-fully-named` — I opened
  `reference/frames/s21_weapon/t708.0.png` crop (170,240)-(870,1045) @2× and counted the boxes myself:
  hat / mask · armor / gloves · pants / weapon · ring / shoes / ring = **nine**, matching
  {0,1,3,5,7,8,9,11,12} box-for-box. Confirmed.

## Standing-invariant call

**THE FRAME WINS** — invoked once, in `frames/v0717-rewords-the-daily-streak-ladder`. I cropped
`reference/frames/Nr4fQstqHDM/seg-00/frames/frame_0001.jpg` (0,380)-(700,576) @2.14× and read
**"AFTER EVERY 10 CONSECUTIVE DAYS: BONUS PRIZE!"** on screen, against `strings.json["843"]`
`'Every 10 consecutive days: bonus prize!'`. The android string table is wrong for v0.717 here;
the frame is right. Second instance corroborated independently: `reference/extracted/ui_strings.txt:193`
reads "War room rules **5/6**" while `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0012.jpg`
renders "WAR ROOM RULES **3/7**" — v0.717 added a page.
