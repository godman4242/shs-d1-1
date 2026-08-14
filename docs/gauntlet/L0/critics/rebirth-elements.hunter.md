# rebirth-elements — HUNTER critic (blind)

Reviewed: the PASS-2 surveyor output for `rebirth-elements` (new_score 88, 19 claims).
Every verdict below was reached by opening the artifact myself. Nothing here is carried
from the surveyor's reasoning — I never saw it.

**Headline: 16 of 19 claims HOLD, verbatim, at the exact cited lines. All three
non-HELD verdicts are wrong — two STILL_UNHELDs and one PARTIAL are all findable on
disk, and I found them.** That is the exact failure mode this lane exists to catch.

---

## 1. Refutations (the under-claiming)

### R1 — `rebirth/stance-slash-multipliers-parity` — REFUTED (material)

The claim: *"only in the android v0.682 bundle — I grepped the whole v0.717 desktop tree
for the identical expressions and got zero hits, so parity is NOT established."*

The v0.717 numbers are on disk. `reference/decompiled/shs3_payload/scripts/§1t99s0§.as`
is the desktop `MCSPlayer` (it defines `§1t4446s0§`, the `initElementDefenseStats`
callee at `§1t1523s0§.as:2270`). Its `setStance` switch, **:3091–3155**, is structurally
identical to android `MCSPlayer.as:3027–3095` — same five cases in the same order, same
`setStanceColor` args 1/2/3/2/3, same `< 100` floor on HEAVY and DUAL — and the numbers
are **different**:

```
:3094  LIGHT     slashLength = baseSlashLength * 1.4                          (android 1.5)
:3105  BALANCED  slashLength = baseSlashLength * (1 + 0.2 * balMastery * 0.1)  (android 1 + 0.5*m*0.01)
:3116  HEAVY     slashLength = baseSlashLength * (0.5 + 0.4 * hvyMastery*0.1)  (android 0.5 + 0.5*m*0.01)
:3117-19          if(slashLength < 100) slashLength = 100;
:3131  REVERSED  slashLength = baseSlashLength * 1.4                          (android 1.5)
:3142  DUAL      slashLength = baseSlashLength;  floor 100
```

The grep could never have hit: `0.005` appears in **neither** build, and `0.5 + 0.5 *`
is android-only phrasing. v0.717 scales mastery by `* 0.1`, not `* 0.01`. A negative
grep on terms lifted from the *other* build is not evidence of absence.

Parity is not "unestablished" — it is **established as different**, and the desktop
v0.717 values win.

### R2 — `rebirth/element-circle-art` — REFUTED (material)

The claim: *"The element-picker circle's art, layout and colours remain unrecovered."*
Its own close-path was *"locate the exported symbol for InteractUI's elementCircle
MovieClip in the asset SWF."* That export already exists on disk.

**`reference/extracted/sprites/DefineSprite_1650/1.png`, 808×480 px** (viewed whole, then
crop `(230,80)-(620,420)` upscaled ×3). Visibly: four element badges on a ring —
**FIRE** top (red ring, 火 in red on a near-black disc), **EARTH** right (dark-gold ring,
土), **WIND** bottom (light-grey/white ring, 風), **WATER** left (blue ring, 水) — joined
by grey curved arrows each labelled **"STRONG AGAINST"**, running FIRE→EARTH→WIND→WATER→FIRE.

Two independent confirmations that this is the right sprite:

1. It is a child of the InteractUI symbol. Desktop `InteractUI` = `§1t401s0§` =
   `symbol1691` (`§1t401s0§.as:9`), and `reference/extracted/sprites/DefineSprite_1691_1t401s0/1.png`
   is the composite render of that symbol — crop `(520,250)-(860,470)` ×4 shows the
   `STRONG AGAINST` / `…AGAINST` / `WIND` label text bleeding through, partly occluded by
   the chohan bowl (`DefineSprite_1687` / `1688_shs3_fla.InteractUI_chohan_621`, both
   262×262 — I checked, the brown disc is the dice bowl, not the element circle).
2. **The art's arrow direction matches the code wheel exactly.** `StatsManager.as:1836`
   (desktop confirm `§1t1523s0§.as:2270`) sets `FIREDEF=WATERATK, WINDDEF=EARTHATK,
   WATERDEF=WINDATK, EARTHDEF=FIREATK` → fire beats earth, earth beats wind, wind beats
   water, water beats fire. That is the ring in the picture. Art and AS3 corroborate
   each other with no doc in between.

Bonus from the same pass: `elementCircle.visible = true` at `InteractUI.as:559` fires in
`UIMODE_REBIRTH` `menuState == 1` alongside `detailstext.text = LangManager.getString(611)`
— **string 611 = "Choose an element to specialize in."**, the picker's own prompt copy,
which the surveyor's UIData claim did not carry. And the sprite being **808×480** is
independent corroboration of ledger §3 #12's 800×480 native stage.

### R3 — `rebirth/element-status-effects` — REFUTED (material)

The claim: *"unverified in either direction … I did not read Damage.as buff fields plus
the BUFF_* constants in StatsManager.as."* I read both. It takes one command.

`reference/decompiled/shs3_android_payload/scripts/Damage.as` — the **complete** field
list is `damage, stance, launchType, attackerlvl, piercingDamage, fireDamage,
waterDamage, windDamage, earthDamage, flyVelX, flyVelY, victimPosX` (`:26–48`). There is
**no** burn / slow / root / DoT / duration field anywhere on the damage packet. The only
status-shaped thing is the `launchType` enum at `:6–24` (`LAUNCH_NONE/AIR/KNOCKDOWN/FLY/
FLYAWAY/KNEEGROIN/STUN/DEATHTOUCH/SUBSTITUTIONLOG/BACKTHROW`).

`StatsManager.as:288–312` — every `BUFF_*` constant is meta/economy, none is combat and
none is elemental: `BUFF_XP 0, ATTACK 1, DEFENSE 2, SPEED 3, AP 4, DUELTOKENS 5, COINS 6,
RARELOOT 7, MUTE 8, FULLMUTE 9, HELL 10, INJURED 11, MODERATOR 12`.

The honest answer is not STILL_UNHELD, it is **HELD-negative**: elemental skills apply no
status beyond their launch type, because the packet has no field to carry one. A
recreation should ship them statusless and say so.

---

## 2. Corrections that do not refute the claim

| # | Claim | Correction |
|---|---|---|
| C1 | `rebirth/aoe-radii-per-element` | All four numbers verbatim at the exact cited lines. But they are **not radii**. `NPCManager.as:1422` is `checkHitObject(thing, damage, dist=100, …)` and `:1442–1444` compares **x only** (`enemydist = enemy.getMCS().x - thing.x; if(enemydist*enemydist < distsq …)`). It is a horizontal half-width band ±dist, not a circle. Build it as a band. |
| C2 | `rebirth/unlock-gate-is-stat-threshold` | Core claim exact (reqs 10/30/60 on stat 28; `STAT_FIREATK=28`; `+10` per rebirth, `+20` at `STAT_DAN==8`, both builds). But the lane_impact line **"Gear affixes on stats 28-31 count toward the same threshold" is wrong.** `StatsManager.checkCondition` (`:4216`) special-cases `id >= 28 && id <= 31` to `output = getStat(id)` (`:4230–4233`) with **no `findBonusStat`** — unlike `initAttackStats` (`:1835`) which adds it explicitly. Gear does **not** open skills. |
| C3 | `rebirth/dan-ladder-titles` | Shogo bands exact (465 at cases 3/4/5, 466 at 6/7, 467 at 8/9, `InventoryUI.as:2285–2312`). But `case 0: this.danfield.text = "";` (`:2277`) — **STAT_DAN 0 renders a blank title**. String 455 (初段) exists in the table and is never displayed. The mapping is 456…464 → STAT_DAN 1…9, not 455…464 → 0…9. |
| C4 | `rebirth/tenth-gold-is-100` | Numbers exact. Label needs an id: `§1t9413s0§ = 12 = STAT_HGOLD`, and `getHeavenlyGold()` (`StatsManager.as:2669–2675`) adds `QueryManagerPIO.getPayVaultCoins()` while `OverworldHUD.updateHGoldText` (`:1567–1569`) writes `info.goldtext`. So the rebirth pays the **premium, IAP-linked "GOLD"** purse, not `STAT_GOLD=11` (the coin/"MONEDAS" purse — see `DefineSprite_1671` "MONEDAS" vs `DefineSprite_1674` "GOLD"). The claim's word "gold" matches the game's own HUD label, so it is not mis-cited — but `REBIRTH.earlyGold/tenthGold` must be wired to the premium currency or the economy lane inherits a silent bug. |
| C5 | `rebirth/elemental-damage-ladder` | Ladder + `new Damage(0,0,2,-1,damage)` verbatim, but the latter is at **`FireBreathProjectile.as:53`**, not `:51`. The claim's unstated premise — that `damage` is the caster's element ATK — I confirmed independently: `MCSPlayer.as:781` `createProjectile(PROJ_FIREBREATH, …, STAT_FIREATK, getSkillLevel(SKILL_FIREBREATH), this)`. |
| C6 | `rebirth/kanji-statue-bonus` | Verbatim, but scope it: the RNG permutation branch only runs when `props >= 8` (`Obj_DragonDanceStatue.as:38`); for `props < 8` the statue takes a fixed `sequence = props` straight from room data. |
| C7 | `rebirth/string-table-resolved` | True, but it is Stage-0b finding S0-3 restated, and the `ledger_text` it claims to overturn (blocker ⑤, the picker UI) is not what string resolution overturns. Low marginal value, not wrong. |

---

## 3. New findings the surveyor missed

**N1 — the v0.717 stance DAMAGE multipliers, and mastery caps at 10 not 9.**
Same desktop file, `§1t99s0§.as:3255–3271`:

```
_loc1_ = minDamage + Math.random() * damageRange
LIGHT     dmg = _loc1_ * (0.5 + 0.4 * lightMastery * 0.1)
BALANCED  dmg = _loc1_ * (1   + 0.2 * balMastery   * 0.1)
HEAVY / DUAL / REVERSED   dmg = _loc1_ * 1.4
```

`initPlayer` param order (`:183–199`) pins `§1t4421s0§/4422/4423` = light/balanced/heavy
mastery = `getStat(1000/1001/1002)`; `reference/extracted/skilldata.xml` skills **1000,
1001, 1002 each carry exactly ten `<level><value>` rows, 1…10**. So mastery ranges 0–10,
and at mastery 10 the multipliers are **0.9 / 1.2 / 1.4** — the wiki's stance-damage table
exactly. Ledger §3 #3 calls these "MASTERY-9 CEILING values"; **it is the mastery-10
ceiling.** Its "level-1 Shugyosha does Light ×0.5 / Balanced ×1.0 / Heavy ×1.4 (Heavy is
fixed)" is confirmed as the mastery-0 row.

**N2 — the wiki reach table 300/200/100 is the mastery-0 BASE, not a ceiling.**
`getBaseSlashLengthVal` (`§1t1523s0§.as:2344–2348`, android `StatsManager.as:1915–1919`)
asymptotes to `120 + 90 = 210` at Dan 0. Apply the v0.717 *reach* multipliers at mastery
0 — Light ×1.4, Balanced ×1.0, Heavy ×0.5 — and you get **294 / 210 / 105 ≈ 300/200/100**.
At mastery 10 the same stances give 294 / 252 / 189. Ledger §3 #3 sweeps both tables into
"mastery-9 ceiling"; the damage table is a mastery-10 ceiling and the reach table is a
mastery-0 base. They are not the same row. Note the crossover: the mastery-scaled term is
each stance's *weak* axis (Light's damage, Heavy's reach) while its strong axis is fixed.

**N3 — combat-core blocker ② ("crit 1.3 vs 3 final") is closed by v0.717.**
`§1t99s0§.as:3272–3276`: `if(reload == maxreload) return dmg * 1.3 + STAT_CRITICALDMG;`
— a flat **×1.3 for every stance** at full reload, plus the gear crit-damage affix. Not
×3. (Android v0.682 differs again: `MCSPlayer.as:3215–3221`, ×1.2 non-Light / ×1.5 Light.)
Ledger §3's forum-sourced "crit 1.3" is now first-party-confirmed for the shipped build.

**N4 — the Dragon Dance UI art is fully held.**
`reference/extracted/sprites/DefineSprite_1810_1t5495s0/1.png`, 819×500 (viewed whole):
a dark-red double outer ring; eight clickable nodes as green-outlined white discs each
bearing a kanji; an inner dark-red bagua trigram ring; a black/white taiji centre with the
element name (**"FIRE"**) written across it; an X close button top-right.
`§1t5495s0§.as:70–71` is the desktop `DragonDanceUI` (it holds `["sky","wind","water",
"mountain","earth","thunder","fire","lake"]` / `["fire","earth","lake","sky","water",
"mountain","thunder","wind"]`), so `DefineSprite_1810_1t5495s0` is its symbol by
class-link. Children: `DefineSprite_1800` (green bagua ring, 437×437),
`DefineSprite_1802` (dark-red bagua ring, 437×437), `DefineSprite_1808` (taiji, 242×242),
`DefineSprite_1797_shs3_fla.dragondancewords_235` (39×40, **58 frames** — the kanji glyph
strip that `DragonDanceUI.as:359/:364` indexes as `word.gotoAndStop(num + 11)` for Earlier
Heaven and `(num + 31)` for Later Heaven), `DefineSprite_1798_1t5501s0` (64×64 node).
Green ring vs red ring = the two arrangements. Blocker ④'s art half is held too.

**N5 — build divergence is wider than the one number the surveyor flagged.**
Between android v0.682 and desktop v0.717 I found divergence in: rebirth payout
(5/20 vs 25/100), Light/Reversed reach (×1.5 vs ×1.4), Balanced/Heavy mastery scaling
(`*0.01` vs `*0.1`, coefficient 0.5 vs 0.4/0.2), stance damage (Heavy ×1.5 vs ×1.4),
full-reload crit (×1.2/×1.5 split vs flat ×1.3), and the stance-change reload penalty
(`maxreload/3`, `-maxreload/6` vs a flat `-48`). **Every combat-tuning number checked so
far moved between builds.** Treat any android-only combat number as INFERRED until the
desktop line is found; the desktop file to check first is `§1t99s0§.as`.

---

## 4. Verified-and-held (no action)

`string-table-resolved` (610 verbatim) · `dan-ladder-titles` (see C3) ·
`dan-achievements-prove-ten` (`114_Mobile_AchievementData.bin:463–470`, `<stat>25</stat>
<val>9</val>`, 8044="Ultimate Warrior" / 8124="Reach Dan 10.") ·
`element-picker-uidata` (`90_InteractUI_UIData.bin:94–105` — order Fire 507/24, Earth
510/27, Wind 508/25, Water 509/26, and the `comp gte` Dan-10 short-circuit, all verbatim) ·
`elemental-skill-tooltips` (6143 verbatim; `skilldata.xml:1880–1893` chi 50 / cd 60 /
lvlreq 50; kunai-ammo cost confirmed at string 6070) · `dragon-dance-teachable` (6125
verbatim) · `tenth-gold-is-100` (`§1t1523s0§.as:2644–2652` verbatim; see C4) ·
`dan-scaled-slash-length` (both builds verbatim; `BankUI.as:264` verbatim) ·
`post-rebirth-sp-economy` (both builds verbatim; `levelCap:int = 80` at
`StatsManager.as:76`) · `unlock-gate-is-stat-threshold` (see C2) ·
`elemental-damage-ladder` (see C5) · `aoe-radii-per-element` (see C1) ·
`dragon-dance-bagua-input` (`DragonDanceUI.as:70–71`, `:354–355`, `:367` verbatim) ·
`kanji-statue-bonus` (see C6) · `element-counter-wheel` (both builds verbatim, and now
picture-confirmed — see R2) · `mitigation-flat-min1` (`MCSPlayer.as:3347–3357`, `:3420`
verbatim).

## 5. Score

The surveyor withheld 12 points for two things it called unclosable — the element-circle
art and the v0.717 stance parity. Both are closed by files already on disk, and the third
withheld item (status effects) resolves to a clean negative. Against that, one lane_impact
assertion (gear counting toward the unlock gate) is wrong in a way that would ship a bug.
Net: the evidence supports a higher score than 88 on coverage, but the 88 was reached
partly by not looking. The lane's remaining genuine gap is narrower than stated: nothing
in rebirth-elements is now art-blocked.
