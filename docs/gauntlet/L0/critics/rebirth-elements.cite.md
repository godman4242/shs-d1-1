# CITE-LENS REVIEW — unit `rebirth-elements`

Reviewer: blind critic (LENS 1 — over-claiming / mis-citation). Every verdict below was
reached by opening the artifact myself. Nothing here is taken from the surveyor's text.

**Headline:** 19 claims audited. **16 survive.** **3 refuted** (1 material +1 material +1
minor). The lane's evidential core — the Dan ladder, the element wheel, the mitigation
formula, the AoE table, the bagua ring, the statue RNG, the SP formula, the Dan-scaled
slash length — is genuinely held and the cites are unusually clean (most resolve to the
exact line). The failures are all of one kind: **the surveyor stopped at the android
v0.682 bundle where the v0.717 desktop bundle also had the answer, and then reported the
absence as a property of the evidence rather than of its search.**

The single most consequential finding of this review is that **claim
`rebirth/stance-slash-multipliers-parity` is backwards**: the v0.717 stance table is not
missing, it is present and it **disagrees numerically with v0.682 in four of five cases.**

---

## Refutations

### R1 — `rebirth/stance-slash-multipliers-parity` — **REFUTED, material**

The claim: *"…recovered … but only in the android v0.682 bundle — I grepped the whole
v0.717 desktop tree for the identical expressions and got zero hits, so parity is NOT
established."*

I reproduced the negative grep — it does return nothing — and then found the code anyway.
The desktop v0.717 bundle carries the **same five-case stance switch**, in the **same case
order**, with the **same `setStanceColor(1/2/3)` calls** and the **same `< 100` floors on
HEAVY and DUAL** — at `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3091-3146`:

```
3093:  case §1t12220s0§:                                                  // LIGHT   (colour 1)
3094:     this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3104:  case §1t12221s0§:                                                  // BALANCED (colour 2)
3105:     this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3115:  case §1t12222s0§:                                                  // HEAVY   (colour 3)
3116:     this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);
3117:     if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }
3130:  case §1t12224s0§:  this.§1t4417s0§ = this.§1t4420s0§ * 1.4;        // REVERSED (colour 2)
3141:  case §1t12223s0§:  this.§1t4417s0§ = this.§1t4420s0§;              // DUAL     (colour 3)
3143:     if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }
```

Side by side with `shs3_android_payload/scripts/MCSPlayer.as:3029-3082` (which I also
opened and which the surveyor quoted correctly):

| stance | android v0.682 | **desktop v0.717** |
|---|---|---|
| LIGHT | `base * 1.5` | **`base * 1.4`** |
| BALANCED | `base * (1 + 0.5·m·0.01)` | **`base * (1 + 0.2·m·0.1)`** |
| HEAVY | `base * (0.5 + 0.5·m·0.01)`, floor 100 | **`base * (0.5 + 0.4·m·0.1)`**, floor 100 |
| REVERSED | `base * 1.5` | **`base * 1.4`** |
| DUAL | `base`, floor 100 | `base`, floor 100 |

Why the grep missed it: the surveyor searched for `0.005`, `'0.5 + 0.5 *'`, `'1 + 0.5 *'`.
`0.005` appears in **neither** bundle (android writes `0.5 * m * 0.01`), and the desktop
coefficients are literally different numbers, so a search for the android's literals could
only ever return zero. The identifiers are obfuscated in the desktop bundle, so
`slashLength` / `LIGHT_STANCE` searches also fail. The correct handle was the structural
one — a 5-case switch that ends in `setStanceColor(1|2|3)`.

**Consequence:** parity is not "unestablished", it is **disproven, with the v0.717 numbers
in hand.** A 1:1 recreation must use 1.4 / (1+0.02·m) / (0.5+0.04·m), not the android
values. And the surveyor's own §A7 caveat is far too gentle — "one in six checked numbers
moved between 0.682 and 0.717" is now at least five in six on this one function alone.

### R1b — the same claim's `lane_impact` is also wrong: mastery is **not** 0-100

The claim asserts *"mastery is a 0-100 percentage here, not 0-9, so the ledger's
'mastery-9 ceiling' framing needs re-checking."* Two artifacts say otherwise:

- `shs3_android_payload/scripts/MCSPlayer.as:3166-3184` gates abilities on
  `lightMastery >= 3`, `>= 4`, `>= 5` (and the same 3/4/5 for balanced and heavy). Those
  are single-digit thresholds on a stat the claim wants to be a percentage.
- `shs3_android_payload/scripts/StatsManager.as:1834` feeds mastery from
  `getStat(1000), getStat(1001), getStat(1002)`.

And the arithmetic settles it. Substituting **mastery = 10** into the v0.717 *damage*
switch at `§1t99s0§.as:3255-3271`:

```
3262:  case §1t12220s0§:  _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);   // LIGHT    → 0.9
3265:  case §1t12221s0§:  _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);     // BALANCED → 1.2
3270:  case 12222/12223/12224:  _loc2_ = _loc1_ * 1.4;                             // HEAVY    → 1.4
```

= **0.9 / 1.2 / 1.4**, which is the ledger's stance damage table exactly. So the ledger's
"mastery-ceiling, not base" reading is **confirmed for damage**, not in need of
re-checking. (Note the android bundle uses `1.5` for the heavy branch — another v0.682 ≠
v0.717 divergence, and the desktop's `1.4` is the one that reproduces the ledger.)

### R2 — `rebirth/unlock-gate-is-stat-threshold` — **REFUTED, material**

The tier structure (10 / 30 / 60 on stat 28-31, a stat threshold rather than a rebirth
counter) **holds** — I verified `skilldata.xml:1884` (qty 30), `:1726` (qty 60), `:988`
(qty 10, inside the skill block opening at :985), `StatsManager.as:226` (`STAT_FIREATK =
28`) and `InteractUI.as:849-855` (+20 at DAN 8, +10 otherwise). What is wrong is the
claim's closing clause:

> "…and the entire usable elemental kit lands on the FIRST rebirth into that element."

That is contradicted by the surveyor's own cite. I enumerated every elemental gate in
`reference/extracted/skilldata.xml`, resolving names through `index/strings.json`:

```
qty 10  1013 Fire Breath · 1025-1028 Element Traps · 1029-1032 Kunai
        1033 Ground Punch · 1034 Wind Combo · 1035 Water Stomp
qty 30  1056-1059 PASSIVE Dragon Dance Step: Fire/Water/Wind/Earth
        1070-1073 Inferno / Tsunami / Tornado / Earthquake        ← the ultimates
qty 60  1060-1063 PASSIVE Dragon Dance Step: Fire/Water/Wind/Earth II
```

The four ultimates — the skills claims 11 and 12 are entirely about — sit at qty **30**,
i.e. the 3× tier. They do not land on the first rebirth.

Second defect: `overturns_ledger: true` is unearned here. The quoted ledger sentence is
"Dragon Dance unlocks at 3×/6× same-element rebirths", and the table above shows Dragon
Dance Step at 30 (3×) and Step II at 60 (6×). **The ledger sentence is correct.** What the
ledger omits is a *different* tier covering *different* skills.

### R3 — `rebirth/dan-ladder-titles` — **REFUTED, minor** (9 of 10 rows hold)

Everything about the shogo tiers is exact — I read
`shs3_android_payload/scripts/InventoryUI.as:2274-2317` and confirmed 3/4/5 → 465 Renshi,
6/7 → 466 Kyoshi, 8/9 → 467 Hanshi, and the `default` also Hanshi. The quoted block at
:2285-2288 is verbatim. `StatsManager.as:2209` (`if(getPlayerStats(STAT_DAN) < 9)`) and the
desktop mirror at `§1t1523s0§.as:2653-2655` both resolve.

The error is at the bottom of the ladder. The claim says *"STAT_DAN 0..9 displays as Dan
1..10, with kanji titles 初段…十段 (strings 455–464)"*. The code:

```
2276:  case 0:
2277:     this.danfield.text = "";
2278:     break;
2279:  case 1:
2280:     this.danfield.text = LangManager.getString(456);   // 456 = '(弐段)' = 2nd dan
```

A Dan-1 (STAT_DAN 0) character displays **no kanji badge at all**. String 455 `'(初段)'`
exists in the table but `grep -rn "getString(455" reference/decompiled/` returns **zero
hits** — it is dead copy in the shipped build. The used range is 456–464 for STAT_DAN 1–9,
nine rows, not ten. A recreation that paints 初段 on a fresh character is wrong.

---

## Survivals (with corrections that do not rise to refutation)

| claim | verdict | what I opened |
|---|---|---|
| `rebirth/string-table-resolved` | HELD | `index/strings.json` key `610`, verbatim match incl. the "Slash length and bank storage is increased with each dan rank" tail |
| `rebirth/dan-achievements-prove-ten` | HELD | `extracted/android/114_Mobile_AchievementData.bin:463-470` — id 51 / name 8044 / desc 8124 / stat 25 / val 9, exact; 8044='Ultimate Warrior', 8124='Reach Dan 10.' |
| `rebirth/element-picker-uidata` | HELD | `extracted/android/90_InteractUI_UIData.bin:93-106` — `<title>rebirth</title>`, two menus, second menu order **507 Fire ATK icon 24 · 510 Earth ATK icon 27 · 508 Wind ATK icon 25 · 509 Water ATK icon 26**, exactly as claimed; the `gte 9 → firerebirth` short-circuit at :97 is verbatim |
| `rebirth/elemental-skill-tooltips` | HELD | `skilldata.xml:1879-1894` + `strings.json:6143` |
| `rebirth/dragon-dance-teachable` | HELD | `strings.json` 6117 / 6125 / 750, all verbatim; corroborated by `DragonDanceUI.as:442-450` (`danceTarget.validSequence()`) |
| `rebirth/tenth-gold-is-100` | HELD | `§1t1523s0§.as:2644-2652`, verbatim; `§1t9413s0§=12` at :228, `§1t9426s0§=25` at :254; android 20/5 at `StatsManager.as:2201-2207`; desktop `clientVersion 0.717` at `§1t1523s0§.as:36`, android `0.682` at `StatsManager.as:30` |
| `combat-core/dan-scaled-slash-length` | HELD | `StatsManager.as:1915-1919` and desktop `§1t1523s0§.as:2344-2348` — **formula identical across both builds**; `BankUI.as:264` exact |
| `progression/post-rebirth-sp-economy` | HELD | `StatsManager.as:2156`; desktop `§1t1523s0§.as:2598` with `§1t9418s0§=17` (:238) and `§1t9470s0§=80` (:362) |
| `rebirth/elemental-damage-ladder` | HELD | `FireBreathProjectile.as:15-53`; `Damage.as:50` signature |
| `rebirth/aoe-radii-per-element` | HELD | 600 / 400 / 200 / 50 at the four cited lines, all exact; `LAUNCH_AIR` at `BigTornadoProjectile.as:24` |
| `rebirth/dragon-dance-bagua-input` | HELD | `DragonDanceUI.as:70-71`, `:354-355`, `:367`, `:447` — all verbatim |
| `rebirth/kanji-statue-bonus` | HELD | `Obj_DragonDanceStatue.as:42-63`, `:185`, `:224-226`, `:238-240` — all four anchors exact |
| `rebirth/element-counter-wheel` | HELD | `StatsManager.as:1836` verbatim; `MCSPlayer.as:260` signature fixes the (fire,wind,water,earth)DEF order; desktop `§1t1523s0§.as:2270` mirrors it with ids 30/31/29/28 |
| `rebirth/mitigation-flat-min1` | HELD | `MCSPlayer.as:3347-3357` and `:3420`, verbatim |
| `rebirth/element-circle-art` | STILL_UNHELD, correct | `index/frames.json` — 113 directories, 7,381 files, matching the claim's own figure |
| `rebirth/element-status-effects` | STILL_UNHELD, correct (partly closable — see N6) | `Damage.as:50` |

### Minor mis-cites logged but not refuted

1. `rebirth/elemental-skill-tooltips` — the inline annotation says `1889 <chi>50</chi>` and
   `1890 <cooldown>60</cooldown>`. They are at **1890** and **1891**. `<lvlreq>50</lvlreq>`
   at 1882 is right. Off-by-one inside a range cite that does contain the values.
2. `rebirth/elemental-damage-ladder` — `damageObj = new Damage(0,0,2,-1,damage);` is at
   `FireBreathProjectile.as:53`, not `:51`.
3. `rebirth/string-table-resolved` — `overturns_ledger: true` is paired with ledger text
   "⑤ rebirth/element-picker UI (never filmed …)". A resolved string table does not
   overturn "never filmed"; the surveyor's own claim 18 concedes the art is unheld. The
   claim's substance is fine; the pairing is not.
4. `rebirth/aoe-radii-per-element` — the four numbers are verbatim, but "radii" is an
   inference about the third argument of `NPCManager.checkHitObject`; nothing in the cited
   lines states the unit or the shape.
5. `rebirth/kanji-statue-bonus` — the required sequence is 5 characters (`"1246" + num`),
   and only 5 of the 24 permutations of {1,2,4,6} are reachable (`rng.rand(5)`), not an
   arbitrary permutation.

---

## New findings this review adds

- **N1 (fatal to R1, material to combat-core).** v0.717 stance table recovered and it
  differs from v0.682 in 4 of 5 cases — see R1. `§1t99s0§.as:3091-3146`.
- **N2.** v0.717 stance *damage* table: `§1t99s0§.as:3255-3271`. At mastery 10 it yields
  0.9 / 1.2 / 1.4 — the ledger's table, reproduced from shipped code.
- **N3.** The reach table is the *opposite* case: at mastery **0** the v0.717 multipliers
  are 1.4 : 1.0 : 0.5 = **2.8 : 2 : 1**, which is the ledger's "reach 300/200/100". So the
  ledger's blanket "*both* tables are mastery-ceiling values, not base" is **half wrong** —
  damage is a ceiling, reach is a floor/base. Cite: `§1t99s0§.as:3094/3105/3116`.
- **N4.** Dan 1 shows no kanji; string 455 is dead. See R3.
- **N5.** The rebirth payout is `STAT_HGOLD = 12`, **not** `STAT_GOLD = 11`.
  `StatsManager.as:2669-2677` — `getHeavenlyGold()` adds
  `QueryManagerPIO.instance.getPayVaultCoins()`, i.e. this is the **premium** currency
  (string 64 = 'Gold'), while `STAT_GOLD` is the coin purse capped by `getMaxCoins()`
  (`:2632-2655`, string 63 = 'Coins'). A `tenthGold` config value must be wired to the
  premium currency. If the ledger's "film shows a flat +25 gold" was read off the *Coins*
  counter, the film and the code are describing different currencies and the film wins.
- **N6.** `Damage.as:50` — the constructor is
  `(damage, attackerlvl, launchType, stance, fireDamage, waterDamage, windDamage,
  earthDamage)`. There is **no status/buff parameter of any kind**, so no elemental status
  can ride the `Damage` object. That does not close `rebirth/element-status-effects` (a
  status could be applied at the projectile or in `checkHitObject`), but it narrows it from
  "unverified in either direction" to "not carried on the damage packet".
- **N7.** `MCSPlayer.as:218-222` — `BUFF_INJURED` applies `this.baseSlashLength *= 0.5`
  alongside `minDamage *= 0.5` and `defense *= 0.5`. A reach modifier neither the ledger
  nor this lane records.
- **N8.** Crit confirmed in v0.717: `§1t99s0§.as:3272-3274` —
  `if(reload == maxreload) return dmg * 1.3 + piercing;`. Crit is a **full-reload**
  condition and the multiplier is 1.3.
- **N9.** `slashLength` is in stage coordinate units — `MCSPlayer.as:4663`
  (`startX = this.getTargetPosition() + this.slashLength * 2 / 3`) and `:4707`
  (`startX = targetX + this.slashLength / 2`) add it directly to X positions. This
  independently grounds claim 8's "stage pixels", which the claim asserted without a
  use-site.

---

## Verdict on the score

88 is too high given R1 and R2. Two of the lane's cross-lane exports were shipped with a
build-parity story that is now known to be false in the surveyor's favour (the v0.717
numbers exist) and a gating story that is false against the surveyor (the ultimates are
3× not 1×). The evidence base is excellent; the reporting overreached in exactly the two
places where a second bundle had to be opened. Recommend re-scoring after the v0.717
stance table is folded in — the lane is genuinely stronger than it claimed on stances and
weaker than it claimed on unlock cadence.
