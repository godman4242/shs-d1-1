# rebirth-elements — PRECEDENCE LENS critic (blind)

Reviewer opened every artifact itself. No verdict below rests on the surveyor's text.
Standing invariant honoured: where a frame and a doc could disagree, I opened the frame.

**Headline:** the lane is unusually well-sourced — 13 of 19 claims are pinpoint-exact,
several cite to the correct line with zero drift. But **two claims are wrong, and one of
those two is the most consequential claim in the whole unit.**

- ⛔ **FATAL — `rebirth/stance-slash-multipliers-parity`.** The surveyor concluded, from a
  negative grep, that the v0.717 per-stance slash multipliers are not on disk. **They are.**
  `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3092-3146` carries the identical
  `setStance` switch with *different constants*, and
  `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:2721-2748` carries the full v0.717
  stance table. The grep searched for the **android** literals (`0.005`, `1 + 0.5 *`,
  `0.5 + 0.5 *`) and therefore could only ever return zero. Worse, the claim's `lane_impact`
  tells combat-core to re-check the ledger's "mastery-9 ceiling" framing because "mastery is a
  0-100 percentage" — that is the **v0.682 android** rescale. In v0.717 mastery is a **0-10**
  scale (`* 0.1`), which *corroborates* the ledger instead of contesting it.
- ⚠️ **MATERIAL — `rebirth/unlock-gate-is-stat-threshold`** contradicts its own cited data.
- ⚠️ **MATERIAL — `rebirth/dan-ladder-titles`** is not "fully recovered": Dan 1 renders **blank**,
  and v0.717 ships a **second, romaji** Dan ladder the claim never mentions.

Everything else survives. The two STILL_UNHELD answers are honest and I decline to punish them.

---

## Per-claim verdicts

### 1. `rebirth/string-table-resolved` — SURVIVES (minor)
Opened `docs/gauntlet/L0/index/strings.json`: 2533 entries; key `610` is verbatim as quoted,
including the closing sentence *"Slash length and bank storage is increased with each dan rank."*
Keys 455-467, 507-510, 750, 864, 6117/6125, 6143-6146, 8044/8124 all resolve exactly as used.

*Caveat (feeds finding B):* "every display string this system needs" is not covered by the cited
table. The v0.717 desktop prints its Dan titles from a **hard-coded romaji ladder in AS3**, not
from `LangManager` — see finding B. On disk, yes; in `strings.json`, no.

### 2. `rebirth/dan-ladder-titles` — **REFUTED (material)**
Opened `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2273-2317` and the
desktop twin `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3062-3103`.

What holds: STAT_DAN 0..9, cap enforced (`StatsManager.as:2209-2211`, desktop
`§1t1523s0§.as:2653-2655`), and the shogo bands **Renshi 3-5 / Kyoshi 6-7 / Hanshi 8-9** — exactly
as claimed, in both bundles.

What is wrong:
1. **`case 0: this.danfield.text = "";`** — in *both* builds. String `455 = '(初段)'` is **never
   displayed**; `grep -rn "getString(455)"` over the android tree returns nothing. The claim's
   "kanji titles 初段…十段 (strings 455–464)" would make a recreation render `(初段)` where the OG
   renders an empty field. The mapping is STAT_DAN n → string **456+(n-1)** for n≥1, blank at 0.
2. **"fully recovered" is falsified.** v0.717 carries a *second* Dan ladder — hard-coded romaji —
   in `§1t408s0§.as:532-566`, rendered in the versus/duel panel as
   `"Level: " + N + " (yondan) Renshi"`. The claim sourced its titles from the **android**
   InventoryUI and never looked for the desktop's other display site.

Core ladder survives; the display facts do not.

### 3. `rebirth/dan-achievements-prove-ten` — SURVIVES
Opened `reference/extracted/android/114_Mobile_AchievementData.bin`. Lines **463-470** are the
`<id>51</id>` record verbatim — `<stat>25</stat><val>9</val>`, `<name>8044</name>` →
'Ultimate Warrior', `<desc>8124</desc>` → **'Reach Dan 10.'**. Cite is off by zero.
`grep -n "<stat>25</stat>"` returns exactly four rows (441/450/459/468), matching "the four Dan
achievement rows". Android-only blob, but the desktop `if(DAN < 9)` cap corroborates independently.

### 4. `rebirth/element-picker-uidata` — SURVIVES (exact)
Opened `reference/extracted/android/90_InteractUI_UIData.bin`, `<title>rebirth</title>` block at
lines 93-106. Menu 2 is verbatim:

```
<option><label>507</label><icon>24</icon><action><id>firerebirth</id></action></option>  <!-- "fire" fireicon-->
<option><label>510</label><icon>27</icon><action><id>earthrebirth</id></action></option> <!-- "earth" fireicon-->
<option><label>508</label><icon>25</icon><action><id>windrebirth</id></action></option>  <!-- "wind" fireicon-->
<option><label>509</label><icon>26</icon><action><id>waterrebirth</id></action></option> <!-- "water" fireicon-->
```

507/510/508/509 → Fire ATK / Earth ATK / Wind ATK / Water ATK. Order, icons and the Dan-10
short-circuit (`<has><id>25</id><qty>9</qty><comp>gte</comp></has>` → `firerebirth`, comment
`>=10 dan, no element boost`) are all exactly as stated. Best-cited claim in the unit.

### 5. `rebirth/elemental-skill-tooltips` — SURVIVES (minor cite drift)
`strings.json` 6143-6146 verbatim. `skilldata.xml:1879-1894` is skill 1070 as described.
The kunai-ammo note in `lane_impact` is real: `6070 = 'Throws a kunai that deals fire damage.\n\n
Requires kunai ammo.'`, `6062` same for traps.

Drift: the inline numbers are one off — `<chi>50</chi>` is at **:1890** (claim says 1889) and
`<cooldown>60</cooldown>` at **:1891** (claim says 1890). `<lvlreq>50</lvlreq>` at :1882 is right.
All inside the cited 1880-1893 range. Cosmetic, logged not punished.

### 6. `rebirth/dragon-dance-teachable` — SURVIVES
`strings.json` 6117 / 6125 verbatim, and the mechanic is real in code:
`DragonDanceUI.as:447` — `if(this.danceTarget != null && this.danceTarget.getSequence() == this.sequence)`
→ `this.danceTarget.validSequence()`. Player-to-player transmission confirmed, not inferred.
"Later Heaven" is the game's own word (`laterHeavenLabel`, `DragonDanceUI.as:71`).

### 7. `rebirth/tenth-gold-is-100` — SURVIVES, and I add a frame that strengthens it
Opened `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2638-2656` — the quote is verbatim,
`:2644-2652` is off by zero. `§1t9413s0§:int = 12` at :228 ✓, `§1t9426s0§:int = 25` at :254 ✓,
client version `§1t9323s0§:Number = 0.717` at :36 ✓. Android twin at `StatsManager.as:2201-2207`
does pay **5/20** — the build-drift point is real and well made.

**I checked the currency, because "gold" in this codebase is a trap.** `STAT_GOLD = 11` is actually
the *soft* currency (`isCoinPurseFull()` compares it to `getMaxCoins()`; anti-cheat at
`OverworldHUD.as:1338` calls a `STAT_GOLD > 10000` breach `reportHack("coins")`). `STAT_HGOLD = 12`
is the premium currency (`reportHack("gold")` at `:1333`). So the claim's "+25 gold" is right *in the
game's own display terms*, and the frame proves it:

> **A1 —** `reference/frames/Nr4fQstqHDM/seg-05/frames/frame_0025.jpg`, top 22% strip, 2× LANCZOS.
> Visibly: a silver-coin icon reading **"507 / COINS"**, a *separate* gold-coin icon reading
> **"2 / GOLD"**, and a **"GET GOLD"** purchase button between them. Two distinct currencies,
> premium one purchasable. `STAT_HGOLD` is the on-screen "GOLD".

Also see finding E: the ledger's *"film shows a flat +25 gold"* attribution is itself unsourceable.

### 8. `combat-core/dan-scaled-slash-length` — SURVIVES (minor, but read the caveats)
`getBaseSlashLengthVal` verbatim in `StatsManager.as:1915-1919`; desktop twin `§1t1523s0§.as:2345-2348`
is character-identical, so this one is genuinely dual-build. `BankUI.as:264` is exact:
`storageMaxWeight = 100 + STAT_DAN * 10 + STAT_PAIDSTORAGE * 10`. Arithmetic checks: asymptote
120+90 = **210** at Dan 0, 120+135 = **255** at Dan 9.

Two things the next lane must not inherit uncritically:
- **"stage pixels" is asserted, not demonstrated.** The value is a display-space distance
  (`InputManager.setMaxDistance(slashLength)`, and raw `startX/startY` offsets at
  `MCSPlayer.as:4663-4714`). Nothing on disk pins the stage-px : 1080p-frame-px ratio. The ledger's
  "measure from footage" step is *narrowed*, not retired.
- **210/255 is the BASE, not the per-stance reach** the ledger blocker asks for. Per-stance needs the
  multiplier — and claim 17 supplies the wrong build's multiplier (see below). With the correct
  v0.717 Light ×1.4 the Dan-0 light reach is **294**, not the 315 an android ×1.5 would give.

### 9. `progression/post-rebirth-sp-economy` — SURVIVES (minor scope)
`StatsManager.as:2156` verbatim; desktop `§1t1523s0§.as:2598` is the same expression, and desktop
`levelCap` is confirmed 80 (`§1t9470s0§:int = 80` at `:362`). The 80→**79** correction to the
ledger's "80 SP first run" (`REBUILD_READINESS.md:78, :199`) is right.

Scope note: the cited line lives in `unAssignSkillPoints()`, whose only caller is
`InventoryUI.as:990` — the skill-**reset** button. `doRebirth()` does *not* call it. So this is the
total-SP **invariant**, which correctly implies the economy, but it is not literally the rebirth code
path the claim id advertises.

### 10. `rebirth/unlock-gate-is-stat-threshold` — **REFUTED (material)**
The thresholds are right. The conclusion is not.

`grep -n "<id>28</id><qty>"` over `reference/extracted/skilldata.xml` returns exactly six rows:
**612, 924, 988** (qty 10) · **1658, 1884** (qty 30) · **1726** (qty 60). And
`InteractUI.as:848-859` grants **+10** element ATK per rebirth (**+20** at DAN 8), desktop twin
`§1t401s0§.as:873-881` identical.

So a **first** rebirth = +10 = the qty-10 tier only. That is **3 of the element's 6 skills**
(orders 0-2). Still locked after rebirth #1:
- `1070` — the AoE ultimate, `<lvlreq>50</lvlreq> <chi>50</chi> <cooldown>60</cooldown>`, **qty 30**
- `1056` — Dragon Dance Step: Fire, **qty 30**
- `1060` — Dragon Dance Step: Fire II (Later Heaven), **qty 60**

The claim's sentence *"the entire usable elemental kit lands on the FIRST rebirth into that element"*
is contradicted by the rows the claim itself cites. (Its own `lane_impact` gets this right — "opens
each element's Kunai, Trap AND tier-2 attack" — but the claim text is what downstream consumes.)

### 11. `rebirth/elemental-damage-ladder` — SURVIVES (exact)
`FireBreathProjectile.as:15-52` verbatim: `{0.8, 0.9, 1.0, 1.1, 1.2}` against FX scale
`{1, 1.1, 1.2, 1.3, 1.4}`. `Damage.as:50` signature confirms slot 5 is `fireDamage` and slot 1
`damage`, so `new Damage(0,0,2,-1,damage)` is physical-zero. `BigFireBreathProjectile.as:23` is
`damage * 1.5`. All four ultimates carry the ×1.5.

### 12. `rebirth/aoe-radii-per-element` — SURVIVES (exact)
All four verbatim: `BigFireBreathProjectile.as:32` → 600, `BigWaveProjectile.as:34` → 400,
`BigTornadoProjectile.as:33` → 200, `BigEarthquakeProjectile.as:68` → 50. Tornado alone is
`Damage.LAUNCH_AIR` (`:24`); the other three `LAUNCH_KNOCKDOWN`. Bonus the claim did not mention:
each writes a *different* Damage slot (fire/water/wind/earth), which corroborates claim 15.

### 13. `rebirth/dragon-dance-bagua-input` — SURVIVES (minor mislabel)
`DragonDanceUI.as:70-71` and `:367-369` are off by zero. Node map verified end-to-end against the
resolved names: `1056` Fire, `1057` Water, `1058` Wind, `1059` Earth; `earlierHeavenLabel` indices
fire=6, water=2, wind=1, earth=4 → **6/2/1/4**, exactly the `{1,2,4,6}` set the code tests. Elegant
and correct.

Mislabel: those four are called "tier-3 passives". By the claim's own 10/30/60 tiering they are the
**qty-30 (tier-2)** passives; the qty-60 tier-3 set is `1060-1063`, the "… II (Later Heaven)" line
(`6125`/`6119`… resolve as such). Cosmetic.

### 14. `rebirth/kanji-statue-bonus` — SURVIVES (minor scope omission)
All four cites off by zero: `Obj_DragonDanceStatue.as:37-62` (RNG block), `:185`
(`StatsManager.setStat(40002 + int(props),1)` — the permanent unlock), `:224-226` (`getAPUse` → 2),
`:238-240` (`abs(x - mc.x) < 100`).

Omission: the RNG permutation is inside `if(this.num >= 8)` — the *Later Heaven* statues. The
`else` branch is `sequence = props;`, i.e. an **authored** sequence straight off the room-object
property. The guard is inside the quoted range but outside the quote, so the claim reads as though
*all* statues are RNG-permuted. Half of them are not.

### 15. `rebirth/element-counter-wheel` — SURVIVES
`StatsManager.as:1836` verbatim, joined to the parameter names at `MCSPlayer.as:260`
(`initElementDefenseStats(STAT_FIREDEF, STAT_WINDDEF, STAT_WATERDEF, STAT_EARTHDEF)`). Resolves to a
clean 4-cycle: FIREDEF←WATERATK, EARTHDEF←FIREATK, WINDDEF←EARTHATK, WATERDEF←WINDATK, i.e.
**fire → earth → wind → water → fire**. Gear affixes ride the same channels (stat ids 200-203 at
`StatsManager.as:250+`), which is the gear↔rebirth link the ledger says was never made.

### 16. `rebirth/mitigation-flat-min1` — SURVIVES (exact)
`MCSPlayer.as:3347-3358` and `:3420` verbatim. Flat subtraction, hard min-1 per channel when the
incoming elemental component is > 0, zero otherwise, summed into one `setHP` call. The claim's
warning that this is a *different* mechanism from the physical `getMinDamage()` ladder (`:3416-3419`)
is correct and worth keeping.

### 17. `rebirth/stance-slash-multipliers-parity` — **REFUTED (fatal)**

The android numbers are right. The **conclusion is a false negative**, and the instruction it hands
combat-core is backwards.

I reproduced the surveyor's grep — `0.005`, `1 + 0.5`, `0.5 * ` over `shs3_payload/scripts/` — and it
is literally true that it returns nothing relevant. But that grep looked for **android literals**, so
it could only ever return zero. The code is there under different constants:

`reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3083-3146` — the v0.717 `setStance`:
```as3
case §1t12220s0§:   // LIGHT
   this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
case §1t12221s0§:   // BALANCED
   this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
case §1t12222s0§:   // HEAVY
   this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);
   if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }
```
(`§1t4417s0§` = slashLength, `§1t4420s0§` = baseSlashLength — both fixed by the `initPlayer`
parameter order at `:194-198`, the same signature as android `MCSPlayer.as:182-198`.)

And the full v0.717 stance table, `§1t5957s0§.as:2721-2748`:

| stance | dmg | crit | def | slash |
|---|---|---|---|---|
| Light  | `0.5 + 0.4·m·0.1` → **0.9** @ m=10 | **1.3** | 1 | **×1.4** |
| Balanced | `1 + 0.2·m·0.1` → **1.2** @ m=10 | **1.3** | 1 | `1 + 0.2·m·0.1` |
| Heavy | **1.4** (flat) | **1.3** | **0.8** | `0.5 + 0.4·m·0.1` |

Three consequences:

1. **Parity is not "unestablished" — it is disproven, and the correct numbers are recoverable.**
   Light is **×1.4** in the shipping build, not ×1.5. Android light crit is 1.2
   (`InventoryUI.as:1944`); v0.717 crit is a **flat 1.3 across all three stances**.
2. **The mastery-scale instruction is backwards.** v0.717 multiplies by `0.1` → mastery is a
   **0-10** scale. The 0-100 scale is the android v0.682 rescale. So the ledger's *"stance tables
   are MASTERY-9 CEILING values"* framing is **corroborated** by the shipping build, and telling
   combat-core to re-check it sends that lane the wrong way.
3. The ledger's `dmg 0.9/1.2/1.4` is now exactly explained: 0.9 and 1.2 are the mastery-ceiling
   values for Light/Balanced, and 1.4 is Heavy's **flat** constant. The already-banked "crit 1.3"
   correction is confirmed at source.

This is the one claim in the unit that would actively damage a downstream lane.

### 18. `rebirth/element-circle-art` — STILL_UNHELD, honest, **not punished**
Independently checked. `docs/gauntlet/L0/index/frames.json` has **exactly 113** directory keys
totalling **7381** files — the claim's count is right. The close-path is real, not hand-waved:
`InteractUI.as:63` declares `public var elementCircle:MovieClip;`, hidden at `:171`, shown at `:559`,
so the symbol name to hunt in the asset SWF is confirmed to exist.

And the "never filmed" premise is now **frame-supported**, not doc-supported:
> **A1 —** `reference/frames/Nr4fQstqHDM/seg-05/frames/frame_0025.jpg` and
> `reference/frames/zFtCaTO0_1M/seg-20/frames/frame_0019.jpg`, top-22% HUD strips at 2× LANCZOS.
> Visibly: level badge **8** with `20880 / 20900 EXPERIENCE POINTS`, and level badge **5** with
> `8093 / 8350 EXPERIENCE POINTS` (plus "REGISTER TO SAVE YOUR PROGRESS" — a guest session).
> Both longplays are 70+ levels below the L80 rebirth gate. No rebirth can have been filmed.
> The Dan field is empty in both, matching `case 0: danfield.text = ""`.

### 19. `rebirth/element-status-effects` — STILL_UNHELD, honest, **not punished**, and narrowable
Correctly conservative. It can be tightened for free: the entire `BUFF_*` enum is 13 entries
(`StatsManager.as:288-312`) — XP, ATTACK, DEFENSE, SPEED, AP, DUELTOKENS, COINS, RARELOOT, MUTE,
FULLMUTE, HELL, INJURED, MODERATOR. **None is burn / slow / root / DoT.** A grep for
`setOnFire|burning|poison|slowed|frozen` over the android tree returns only background-art
`redFreeze()` and a guardian stomp animation. So no elemental status can ride the buff system; the
residual is limited to per-projectile ad-hoc effects.

---

## New findings

### A. `combat-core/v0717-stance-table` — the v0.717 stance table is on disk (A2, HELD)
See §17. `§1t99s0§.as:3092-3146` + `§1t5957s0§.as:2721-2748`. Overturns
`REBUILD_READINESS.md:189` combat-core blocker ① — *"measure blade-FX tip-to-body span in
Light/Bal/Heavy from footage, or slash a dummy in a preserved build"* — no footage measurement and
no build are needed for the **multipliers**; only the stage-px : frame-px conversion still is.

### B. `rebirth/romaji-dan-ladder` — v0.717 ships a second, ROMAJI Dan ladder (A2, HELD)
`reference/decompiled/shs3_payload/scripts/§1t408s0§.as:532-566`:
```as3
case 0: dantext = "";                                       case 5: dantext = "(rokudan) "  + getString(465);
case 1: dantext = "(nidan)";                                case 6: dantext = "(nanadan) "  + getString(466);
case 2: dantext = "(sandan)";                               case 7: dantext = "(hachidan) " + getString(466);
case 3: dantext = "(yondan) "  + getString(465);            case 8: dantext = "(kyudan) "   + getString(467);
case 4: dantext = "(godan) "   + getString(465);            case 9: dantext = "(judan) "    + getString(467);
```
rendered at `:582` as `getString(155) + ": " + level + " " + dantext` → **"Level: 74 (yondan) Renshi"**.
Not in `strings.json` — hard-coded English romaji, absent from the android build entirely.
**This is the actual explanation of the ledger's garble complaint** (`REBUILD_READINESS.md:164-165`,
*"The only wiki datum is garbled (\"dan rank 5 (kyudan)\" — kyudan=9th)"*): the game itself prints
**"(kyudan)"** at STAT_DAN 8. A wiki editor transcribing the versus panel would write exactly that.
Note `(nanadan)` for 7th is a non-standard romanisation — copy it, don't "fix" it.

### C. `rebirth/dan1-renders-blank` — string 455 `(初段)` is dead in both builds (A2, HELD)
`InventoryUI.as:2275-2277` and `§1t5957s0§.as:3063-3065`: `case 0: danfield.text = "";`.
`grep -rn "getString(455)"` over both trees returns nothing. Corrects claim
`rebirth/dan-ladder-titles`.

### D. `rebirth/no-elemental-buff-channel` — BUFF_* carries no elemental status (A2, PARTIAL)
`StatsManager.as:288-312`. Narrows blocker ① residual from "unverified either way" to "not via the
buff system; only per-projectile effects remain to check".

### E. `ledger/film-shows-rebirth-is-unsourced` — precedence-lens catch (A1, HELD)
`REBUILD_READINESS.md:165` asserts *"film shows a flat +25 gold every rebirth, no 10th-rebirth tier."*
Both longplays are frame-verified at **level 8** and **level 5** (frames cited in §18); rebirth gates
at L80. `REBUILD_READINESS.md:205` blocker ⑤ says so itself — *"never filmed — both longplays
pre-rebirth."* **The ledger contradicts itself, and the frame settles it: nothing about rebirth was
ever filmed.** The "+25" is not a film observation — it is the value already sitting in the ledger's
own KNOWN-KNOWNS at `:79` (*"rebirth scroll 1000c (+25g)"*), and it is now **CONFIRMED** by v0.717
code. Only the "no 10th-rebirth tier" half of §3 #7 is disproven; the +25 half was never in dispute
and its stated provenance is fictitious.

---

## Score comment

88 is too high given §17. The unit's evidence work is genuinely strong — claims 4, 11, 12, 14, 16
are model citations — but the lane exports a **fatally wrong cross-lane instruction** to combat-core
and a self-contradicting sentence in claim 10. Deducting for those and crediting findings A/B
(which close more than they cost), a defensible score is **78-80**.
