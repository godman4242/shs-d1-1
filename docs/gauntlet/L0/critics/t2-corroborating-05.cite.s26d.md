# Blind critic — CITE LENS — packet `t2-corroborating-05` (s26d)

**Packet size 48 · judged 48 · skipped 0 · refuted 3 · held 45 · new findings 6**

Own-cite machine check: `scripts/gauntlet/citeLint.py` over all 54 cites I supply
(48 verdicts + 6 new findings) → **54 RESOLVES · 0 BROKEN · 0 QUOTE_UNVERIFIED · 0 UNCHECKABLE**.

Structured verdicts (the work): `docs/gauntlet/L0/critics/t2-corroborating-05.cite.s26d.json`
— written before this prose, per the wall-#8/#9 rule.

I opened no `critics/*.md` and no `sources/*.md`. Every verdict below rests on an artifact I
opened in this session.

---

## The three refutations

### 1. `rebirth/statue-sequence-v0717-diverges` — **REFUTED · fatal · wrong class AND no divergence**

The finding pins `reference/decompiled/shs3_payload/scripts/§1t8702s0§.as` as the Kanji statue
"by `getAPUse()->2` at :324 and `abs(x-param1.x)<100` at :344". Both lines are really there. But
**neither identifies anything** — every `Obj_` sibling has them. `Obj_DragonDanceStatue.as` itself
has `getAPUse` at :224 and `abs(x - mc.x) < 100` at :240.

The real discriminator is the method the finding quotes, whose name **survived obfuscation**:

```
§1t8702s0§.as:150            internal function generateSequence() : String
Obj_DragonDancePath.as:150   internal function generateSequence() : String
```

Line-for-line the same function, seed included:

```
§1t8702s0§.as:155    var _loc1_:§1t58s0§ = §1t58s0§.§1t8804s0§(§1t1525s0§.§1t9935s0§() * §1t1525s0§.§1t7341s0§() + 21);
Obj_DragonDancePath.as:155   var rng:RNG = new RNG(StageManager.getCurrentNode() * StageManager.getCurrentRoom() + 21);
```

So `§1t8702s0§` is the web **Obj_DragonDancePath**, not the statue. Two consequences, either of
which sinks the claim:

- the three regimes (3 / 5 / 6 clicks) belong to the dance **path** object, not the Kanji statue;
- they are present **verbatim in the android build** at `Obj_DragonDancePath.as:150-224`, so the
  headline "the v0.717 statue dance diverges" asserts a build split that does not exist.

I then found the actual web statue by grepping the unique literal `"4216"`, which returns exactly
three classes per tree. `§1t8703s0§.as` is it, and it is *identical* to android:

```
§1t8703s0§.as:37     if(this.num >= 8)
§1t8703s0§.as:39        this.num -= 8;
§1t8703s0§.as:48           §1t5518s0§ = "4216" + this.num;
§1t8703s0§.as:63     else
§1t8703s0§.as:65        §1t5518s0§ = param1;
```

Bonus for the lane: the unresolved `<20 / <60` gating value the finding could not decode is
**`NodeGenerator.getNodeLevel(currentNode)`**, and the second seed term is
`StageManager.getCurrentRoom()`. Both readable straight off the android twin.

### 2. `rebirth/status-not-on-damage-packet` — **REFUTED · material · cite refutes the claim**

`Damage.as:50` is verbatim the eight-parameter constructor. But **parameter 3, `launchType`, *is*
the status channel**, and the same file says so:

```
Damage.as:18       public static var STUN:int = 6;
Damage.as:98       public function isStun() : Boolean
Damage.as:100         return this.launchType == STUN;
Damage.as:137      public function setStunTime(num:int, stunPosX:int = 0) : *
```

`setStunTime` is a **duration** setter — precisely the field the claim says does not exist. And the
shipped data uses it:

```
FlashbangProjectile.as:26         damageObj = new Damage(0,0,Damage.STUN);
FlashbangProjectile.as:27         damageObj.setStunTime(24 * 2);
```

Zero damage, 48-frame stun, riding the packet — for skill 1052, whose tooltip is *"Stuns and blinds
nearby enemies."* The lane_impact ("a status would have to be applied by the projectile or inside
`NPCManager.checkHitObject`") is exactly backwards: the projectile applies it **on** the damage
packet. What survives is only the far weaker "no *element-typed* status field", which is not what
was written.

### 3. `rebirth/elemental-aoe-is-a-horizontal-band` — **REFUTED · material · half right**

**Survives:** `dist` really is a horizontal half-width, not a radius — `NPCManager.as:1429`
`distsq = dist * dist`, `:1441` `enemydist = enemy.getMCS().x - thing.x`. And the four numbers
reproduce: `BigFireBreathProjectile.as:32` = 600, `BigWaveProjectile.as:34` = 400,
`BigTornadoProjectile.as:33` = 200, `BigEarthquakeProjectile.as:68` = 50.

**Falls:** "the hit test compares x-distance only … a band ±N px wide with **unbounded y**". The very
line the finding quotes ends with a second conjunct:

```
NPCManager.as:1444   if(enemydist * enemydist < distsq && enemy.checkHitObject(thing,damage,checkByAttacker))
```

and that callee is a full 2D test:

```
NPC.as:332      if(mc.hitTestObject(thing))
```

The band is broad-phase; the narrow phase is per-part bounding-box overlap. So the lane_impact
("a circular-radius implementation would let an airborne or elevated target dodge an ultimate that
in the original **always connects**") is the wrong architectural instruction. The correct model is
`|dx| < dist` **AND** 2D part overlap. Filed as new finding
`s26d/aoe-narrow-phase-is-2d-hittest`.

---

## What held, and how hard

**The Dan ladder cluster (4 findings) — all exact.** `InventoryUI.as:2276-2278` is the blank case-0;
`:2280` is `getString(456)`. `strings.json["455"]='(初段)'`, `["456"]='(弐段)' … ["464"]='(十段)'`.
I ran the grep myself: **`getString(455)` returns zero hits across all three decompiled trees**,
while `getString(456)` returns exactly two (android `:2280`, web `§1t5957s0§.as:3067`). The desktop
twin `§1t5957s0§.as:3063-3065` is the same three lines. `PlayerPanel.as:384-386` is the second blank
path, and the romaji ladder at `:388`–`:412` is verbatim. I also diffed the two android
`PlayerPanel.as` copies — byte-identical, so `rebirth/romaji-dan-ladder-is-cross-build-not-desktop-only`'s
choice of `shs3_android/` over `shs3_android_payload/` is safe. **String 455 is shipped-but-dead.**

**`s26c/survival-mode-id-sets-are-IDENTICAL-across-builds` — cleanest reproduction in the packet.**
I re-parsed both blobs from scratch: 62 distinct ids each, `{400-429, 435-451, 453-456, 700-710}`,
web-only set empty, android-only set empty, 443 in both, 87 `<enemy>` rows each, differing indices
`[73..86]` inclusive, and rows 85-86 really are `451|456|451|456|443` at qty 6. Every stated number
to the digit.

**The elemental census — verified to the row.** 24 skills gated on stats 28-31, and my script
counted exactly 24. Per element: 3 at qty 10 (Breath/Stomp/Combo/Punch, Element Trap, Element Kunai),
2 at qty 30 (Dragon Dance Step + AoE ultimate), 1 at qty 60 (Step II) = 6 × 4. Only 1056-1063 carry
"(Later Heaven)" in their desc. And only 4 of the 24 have per-level numbers — 1013/1033/1034/1035,
five levels each at 80/90/100/110/120 % — the other 20 have one level row with an empty `<desc>`.

**Every blank-cell and level-row census recomputed independently.** chi 101/182 empty · cooldown
84/182 empty · 28 skills with an empty cooldown = 26 passive + ids 1500/1501 (no displayname, one
level each) · 182 level rows / 47 blank / 135 resolved / **83 containing a digit** / 52 digit-free ·
14 distinct cooldown values with **3.5 the only non-integer**. All four findings that rest on these
numbers reproduce exactly.

**`skills-meters/baseReload-is-a-dead-stat` and its three siblings.** I ran the grep in both bundles.
Web `§1t4419s0§`: exactly three hits — declaration `§1t99s0§.as:103`, assignment `:191`, copy
constructor `§1t4904s0§.as:49`. **No read site.** Android `baseReload`: declaration `:105`, parameter
`:182`, assignment `:190`, `EnemyClone.as:49`, and local `48 + xml.speed * 6` computations in the
Enemy/Friendly classes. Never read. Fill is `++` per tick (web `:1205`, android `:1160`) against a
constant ceiling (web `8*24`, android `5*24`). **SPD does not touch the meter in either build.**

**The stance table — confirmed three ways inside the web bundle.** `§1t1544s0§.as:824` = `"dual_stance"`,
`:866` = `"reversed_stance"`; `§1t99s0§.as:3130` (stance 4) → reach ×1.4 → plays `§1t11115s0§`;
`:3141` (stance 3) → reach ×1.0, floor 100 → plays `§1t11073s0§`. Slash cost at `:3299-3311` groups
Reversed with Balanced (×1.0) and Dual with Heavy (×1.5). Android `MCSPlayer.as:33/35` and
`:3067/:3078` agree. **The two off-stances really are inverted in the survey.**

**`skills-meters/kunai-ammo-*` — provable, not merely observed.** I grepped every occurrence of
`2501` in android `SkillManager.as`: exactly six lines (254/259/308/313/474/479), costs 1 and 4 only.
The web 8-cost tier at `§1t120s0§.as:347/:351` genuinely has no android counterpart — and its skill
const is `§1t10176s0§ = 1077`, the id with no `<skill>` row.

**`skills-meters/roll-dodge-is-75-85-95-in-web` — three shipped sources, three different ladders.**
Web 75/85/95 (`§1t99s0§.as:3366/:3370/:3374`), android code 80/85/90 (`MCSPlayer.as:3304/:3308/:3312`),
android string table 60/80/100 (`strings.json["7004"-"7006"]`). The proposed board rule — *the
recovered string table is not web-true either* — is earned.

---

## Corrections carried inside surviving findings

These do **not** refute the claim sentence, but must be struck before the ledger takes them:

| finding | strike |
|---|---|
| `skills-meters/full-focus-negates-a-hit` | "*real ids stop at 1068, then 1500/1501*" is **false**. 1069 Chi Charge, 1070 Inferno, 1071 Tsunami, 1072 Tornado, 1073 Earthquake all exist. Ids stop at **1073**. (1074/1075/1076 are genuinely absent — that half is right.) |
| `skills-meters/elemental-per-level-numbers-are-blank` | "*20 of 24 effect magnitudes live in projectile classes*" overstates by four: the ultimates 1070-1073 carry `150% <element> ATK` in their **skill-level** desc, just not in a level row. |
| `rebirth/v717-stance-multipliers` | 294 px / 357 px are **asymptotic ceilings** as SPD → ∞ (`§1t1523s0§.as:2347`), not values "at Dan 0" / "at Dan 9". |
| `skills-meters/spd-inputs-are-buffable` | writes obfuscated symbols as bare ids — "`getStat(9410)`", "buff `9455`". The real ids are **8** (`STAT_SPEED`, `§1t1523s0§.as:220`) and **3** (`BUFF_SPEED`, `:332`). A coder copying the sentence literally ships the wrong stat. |
| `rebirth/dragon-dance-v0717-parity` | "byte-identical … at the same line numbers" is loose: the web symbols are obfuscated, and the trigger sits at `:382` web vs `:367` android. The parity substance holds. |
| `rebirth/statue-rng-only-later-heaven` | quote labels `if(this.num >= 8)` as line 37; it is **38** (37 is `this.num = int(props);`). The cited range :37-42 still contains everything quoted. |
| `rebirth/payout-is-the-premium-gold-purse` | "MONEDAS = STAT_GOLD" is inferred from the sprite pair, not code-cited. The HGOLD side is code-solid (`OverworldHUD.as:1567` writes `info.goldtext`). |
| `rebirth/skills-meters/roll-dodge-*` | android also has an unreachable **level-4** branch (`MCSPlayer.as:3314-3316`, dodge 95) that skilldata's 3-level Roll can never reach. |

The QUOTE_UNVERIFIED flags on `rebirth/string-455-never-displayed`,
`skills-meters/heavy-defense-penalty-is-web-true`, `skills-meters/skill-slot-base-is-web-sourced`
and `skills-meters/web-maxreload-is-192` are all the **same formatting artifact** — the quotes carry
`file:line` prefixes (`"3286:   if(this.stance == …"`). Stripped, every one is verbatim. The other
three QUOTE_UNVERIFIED findings carry **computed censuses** rather than quotes; I recomputed all
three and they reproduce to the digit. None of the seven is a real mis-cite.

---

## New findings (6)

1. **`s26d/web-statue-is-1t8703s0-and-has-full-parity`** — the web Kanji statue is `§1t8703s0§.as`
   and carries both sequence modes identically. The statue rule can be promoted from
   android-caveated to **build-agnostic CONTRACT**.
2. **`s26d/1t8702s0-is-the-dance-PATH-not-the-statue`** — plus the method rule this taught: pin an
   obfuscated web class by a **surviving method name or a unique literal**, never by a virtual
   override every sibling shares.
3. **`s26d/status-and-duration-DO-ride-the-damage-packet`** — `launchType` + `setStunTime` is the
   game's status channel. Tells the lane exactly where to look for a per-element burn/slow: each
   elemental projectile's `new Damage(...)` call.
4. **`s26d/aoe-narrow-phase-is-2d-hittest`** — the correct AoE model, replacing the refuted
   "unbounded y" band.
5. **`s26d/web-crit-is-1.3-flat-android-is-1.2-1.5-split`** — a **fourth** confirmed build tuning
   split nobody claimed. Web `§1t99s0§.as:3274` is a flat ×1.3 regardless of stance; android
   `MCSPlayer.as:3219/:3221` is ×1.2 off-Light / ×1.5 Light. **The ledger's "crit 1.3×" is confirmed
   for the web build** and must be labelled web-specific.
6. **`s26d/web-reach-and-cooldown-formulas-recovered`** — ledger blocker ④ (SPD→cooldown) **closed**
   with a web cite: `1 - min(SPD,600)/600*0.5` at `§1t1523s0§.as:2289-2295`, and the reach base
   `int(120 + floor((90 + STAT_DAN*5) * SPD / (20 + SPD)))` at `:2344-2347`.

No frame (A1) evidence was needed for this packet — every claim was A2/A3 code and data. The
standing invariant (frame beats measurement doc) never came into play, and I did not invoke it.
