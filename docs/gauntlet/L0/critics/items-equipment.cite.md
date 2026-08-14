# CITE-LENS CRITIC — unit `items-equipment`

**Reviewer:** blind critic (LENS 1 — over-claiming / cite resolution). Saw only the surveyor's
output block; opened every artifact independently.
**Date:** 2026-08-15
**Files touched:** this file only. No source code, no journal, no ledger.

---

## Headline

This is a **strong survey** — unusually strong on cite discipline. I resolved 19 of 21 distinct
file+line cites to the exact byte, including four-digit line numbers in a 2,000-line obfuscated
web-payload class. The two STILL_UNHELD answers are **honest and correct**, and I independently
confirmed one of them (the art payload really is absent from the web scripts).

**But four claims break**, and two of them are the ones the surveyor put in the score rationale as
"two ledger Ready bullets are additionally WRONG":

| # | claim | verdict | why |
|---|---|---|---|
| 1 | `defense-min-floor-is-wrong` | **REFUTED (material)** | Cited enemy-HP auto-scaling; the *generic* defense floor the ledger describes exists and matches the ledger |
| 2 | `no-separate-icon-manifest` | **REFUTED (material)** | `setConsumable`/`setAccessory` use dedicated `item*` / `acc*` icon families, not paperdoll parts |
| 3 | `purple-border-is-unique-not-rarity` | **REFUTED (material)** | Two lines above the surveyor's own cite: green border = special, blue border = rare |
| 4 | `eq-comparison-frame-payload-identity` | **REFUTED (minor, mis-cite)** | The stated crop does not contain "BRANCH" or "LEVEL 1"; substance independently confirmed elsewhere |

Net effect on the score: **78 is too high by roughly 5–8 points**, mostly because the icon-manifest
half of blocker ⑤ is *not* dissolved (it is a real, unrecovered art set covering ~800 of 982 rows),
and because one of the two "ledger is wrong" corrections is itself wrong.

---

## 1. REFUTED — `items-equipment/defense-min-floor-is-wrong` (material)

**Claim:** the ledger's `defense min-floor (EnemyLevel/4)` is "wrong in both variable and shape";
the real thing is a `playerLVL` four-band floor that "lives in boss auto-scaling, not the generic
defense pipeline."

**What I opened:** `reference/decompiled/shs3_android/scripts/Damage.as:149-170`

```as3
public function getMinDamage() : int
{
   if(this.damage == 0)            { return 0; }
   if(this.attackerlvl == 0)       { return this.damage; }
   if(this.attackerlvl <= 10)      { return 1 + this.piercingDamage; }
   if(this.attackerlvl <= 20)      { return this.attackerlvl / 8 + this.piercingDamage; }
   if(this.attackerlvl <= 30)      { return this.attackerlvl / 6 + this.piercingDamage; }
   return this.attackerlvl / 4 + this.piercingDamage;
}
```

and its call site on the player, `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3415-3418`:

```as3
damage -= this.getDefense();
if(damage < damageObj.getMinDamage())
{
   damage = damageObj.getMinDamage();
}
```

That **is** the generic defense pipeline: defense is subtracted, then a floor is applied. The floor
key is `attackerlvl`, which for incoming damage **is the enemy's level**. At attacker level > 30 the
floor is exactly `EnemyLevel / 4`. The ledger bullet is right.

The same floor is applied at 10+ further damage-receipt sites (`EnemyWolf.as:384`,
`EnemyShield.as:347`, `EnemyClone.as:222`/`:443`, `EnemyNianMonster.as:383`, `MCSPlayer.as:3710`, …).

The surveyor's `EnemyPlayer.as:107-123` block is real, and I confirmed it verbatim — but it computes
`bossHP = playerhit * hitsToKillBoss`, i.e. **enemy HP auto-scaling**, and the identical block is
copy-pasted into `EnemySpearElite.as:107`, `EnemyWolfAlpha.as:109`, `EnemyKanjiGuardian.as:88`,
`EnemyElite.as:63`. It is a *second, different* use of the same 1 / ÷8 / ÷6 / ÷4 ladder.

**Consequence:** the surveyor's "shape is wrong" is false — the shape is identical, and the ledger
simply recorded the top band. The lane_impact ("implementing 'EnemyLevel/4' as written produces
different numbers at every level band below 30") would send L1/L2 to *remove* a correct rule.

---

## 2. REFUTED — `items-equipment/no-separate-icon-manifest` (material)

**Claim:** "there is no separate icon art set to recover"; the icon IS the paperdoll part stack.

**What I opened:** `reference/decompiled/shs3_android/scripts/MCSItem.as:203-224` and `:226-247`

```as3
public function setConsumable(id:int) : *
{
   this.clearItem();
   this.displayItem = this.getMCSComponent("item",id);
   if(this.displayItem == null) { this.displayItem = new item0(); addChild(this.displayItem); }
   ...
}
public function setAccessory(id:int) : *
{
   this.displayItem = this.getMCSComponent("acc",id);
   if(this.displayItem == null) { this.displayItem = new AccessoryDummyIcon(); ... }
```

`"item"` and `"acc"` are **not** body-part partTypes. They are two separate symbol namespaces —
`item<art>` and `acc<art>` — with their own fallbacks (`item0`, `AccessoryDummyIcon`). The surveyor
read `setArmor` (which really is a five-part paperdoll stack, and I confirmed it verbatim at
`MCSItem.as:324-352`) and generalised to every item type without opening the sibling function 120
lines above it.

**Scale of the error:** `itemdata.xml` has 982 items, of which only **158** are weapons (type 9,
counted this run). Equipment slots account for a minority; the bulk of the roster is consumables
and quest items rendered through `item<art>`.

**A1 corroboration (my own crop):** `reference/frames/s21_weapon/t708.0.png`,
crop `(900,590)-(1640,960)` upscaled ×2 LANCZOS. The inventory grid shows a red-capped **scroll**,
an **onigiri** with a nori band and an "x3" stack tag, a **black stone**, a **white feather**, and a
blue feather-shaped blade. None of these is a torso/pelvic/uparm/lowarm stack. The frame is decisive
here and it agrees with `MCSItem.as`.

**Also confirmed against the web payload:** `reference/decompiled/shs3_payload/scripts/` contains
exactly **one** `item[0-9]*` class (`item0.as`, the fallback) and **zero** `acc[0-9]*` classes. So the
`item*` family is not merely separate, it is *unrecovered* — which is the surveyor's own
`per-item-art-payload-unknown` STILL_UNHELD, and it applies to icons too.

**Consequence:** lane_impact "one art pipeline, not two … no icon-authoring pass is needed" is exactly
backwards. Blocker ⑤'s "item icon manifest" half is **still open**.

---

## 3. REFUTED — `items-equipment/purple-border-is-unique-not-rarity` (material)

**Claim:** the purple border is the `<unique>` flag, "not a rarity tier";
lane_impact: "border tracks `<unique>`, text colour tracks the 4 tiers."

**What I opened:** `reference/decompiled/shs3_android/scripts/GameEngine.as:564, :568, :572`

```
564:   str = "Tip: A green border indicates that an item is special.";
568:   str = "Tip: A blue border indicates that an item is rare.";
572:   str = "Tip: A purple border indicates that an item is unique.";
```

The surveyor quoted line 572 correctly — and stopped four lines short of the two lines that refute
the conclusion. The border encodes the **whole derived ladder** (special / rare / unique), the same
ladder `getShopItemType()` returns. It is not a `<unique>`-only channel, and border and text colour
are not two different taxonomies.

The claim is also internally inconsistent with the surveyor's own
`items-equipment/rarity-is-derived-not-a-field`, which correctly lists `unique` as one of the four
tiers returned by `Item.getShopItemType()` (`Item.as:382-404`, confirmed).

**A1 note:** my crop `(900,590)-(1640,960)` ×2 shows 2 of 7 icons with a bright purple border and no
green/blue item in view — so the frame neither confirms nor rescues the claim; the code settles it.

---

## 4. REFUTED — `items-equipment/eq-comparison-frame-payload-identity` (minor, mis-cite)

**Claim's quote:** *"Visibly in the crop: 'DMG: 1 - 2 (EQ: 1 - 3)' with the 2 rendered red, and
'WEIGHT: 1', **under the item name "BRANCH" and the label "LEVEL 1"**."*
**Claim's crop:** `(1320,240)-(1620,320)` ×4.

**What I did:** reproduced that crop exactly —
`ffmpeg -i t708.0.png -vf "crop=300:80:1320:240,scale=iw*4:ih*4:flags=lanczos"`.
It contains **two text lines only**: `DMG: 1 - 2 (EQ: 1 - 3)` (the 2 red, the leading 1 white) and
`WEIGHT: 1`. No "BRANCH", no "LEVEL 1".

Widening upward (`crop=560:220:1300:140` ×3) shows the line above is **"AVAILABLE STAT POINTS: 0"** in
a different panel, separated by the panel's grey rule.

On the full frame (downscaled 1440×810 for orientation), **BRANCH** sits at ≈(1087, 260) in
1920-space and **LEVEL 1** at ≈(1088, 523) — in the adjacent item-detail panel, *left of* the cited
crop on x and *below* it on y. The cited crop cannot contain them on either axis.

**The substance is nevertheless true**, and I verified it independently:

- `reference/extracted/itemdata.xml:7906-7915` — `<id>13002</id> <name>4041</name> <minlvl>-4</minlvl>
  <mindamage>1</mindamage> <maxdamage>2</maxdamage> <weight>1</weight>` ✓
- `docs/gauntlet/L0/index/strings.json["4041"]` = `"Branch"` ✓
- `Item.as:759-770` `compareValue` — `a > b → #00A606`, `a < b → #FF0000`, `a == b → plain` ✓,
  which explains white `1`, red `2`.

So this is a **mis-cite, not a false claim**. Under §0 ("state the crop you used") and LENS 1 ("does
the quoted text actually appear there?") it has to be marked refuted, but the finding survives with a
corrected cite: **the whole item-detail panel is `crop=560:420:1000:230`**, not `(1320,240)-(1620,320)`.

---

## Claims that HELD — and what I opened to confirm each

| claim | own_cite I opened | result |
|---|---|---|
| `sprite-compositing-contract-held` | `MCSCharacter.as:10-62` (27 `PART_*` consts, exact lines) + `:141-145` + `:581-607` + all 17 named web-payload part classes (`torso4000.as` … `prop13000.as`) — **all 17 exist** | HELD, one correction below |
| `sell-price-formula` | `Item.as:1582-1593` + web `§1t17s0§.as:1977-1988` — both bodies byte-identical | HELD |
| `sell-price-corrects-section3-item9` | same + ledger `REBUILD_READINESS.md:168` verbatim | HELD |
| `condition-has-no-damage-multiplier` | `grep -rn "getCondition()"` over 559 android scripts → **exactly two hits**: the definition `Item.as:1481` and one call `Item.as:714` (inside `getDesc`) | HELD |
| `condition-tier-thresholds` | `Item.as:712-746`; `strings.json` 387-392,639 all resolve to the quoted English; web ladder confirmed at `§1t17s0§.as:1011,1015,1019` | HELD |
| `affix-suffix-pool-and-counts` | `ItemGenerator.as:102-127` (13 pools × 8 = 104 + 104), `:128-148`, `:206-248`, `:371-374`, `MAXINDEX=79` at `:58` | HELD, one correction below |
| `stat-vs-level-curve` | `itemdata.xml:7906-7915` + `:9925-9937`; my own parse: **982 items, 158 with `<mindamage>`, all `<type>9</type>`, mindamage 1..81, maxdamage 2..108, minlvl −4..79** — every number matches | HELD |
| `item-save-format-held` | `Item.as:7,9,11,13,15` (5 consts), `:47-101` (`parse`), `MCSCharacter.as:348` (12 pipe fields, counted) ; ledger `REBUILD_READINESS.md:351` verbatim | HELD (PARTIAL as stated) |
| `soul-infusion-is-code` | `CraftingUI.as:494-525` verbatim; `strings.json["698"]` = "Both items must be of the same type" | HELD |
| `paperdoll-is-13-slots-not-9` | **my own crop** `(170,240)-(870,1040)` ×2 — I counted **exactly 9 boxes**, contents as described (straw hat filled, oni mask empty, grey haori filled, gauntlets empty, white hakama filled, pickaxe filled, ring empty, sandals filled, ring empty), "GUEST" above; code side `StatsManager.as:108`, `:262-286`, `:1765` (11 args) | HELD |
| `rarity-is-derived-not-a-field` | `Item.as:382-404`, `:417-451`; web `§1t17s0§.as:683,687,691,704,708,712`; my count: **253 `<unique>1</unique>`, 116 `<unique>2</unique>`, 0 `<rarity>`** | HELD, one gap below |
| `weight-cap-is-a-base-not-a-cap` | `StatsManager.as:2298-2301`, `BankUI.as:264`; **my own crop** `(1380,500)+520×120` ×4 reads **"WEIGHT: 43 / 100"** | HELD |
| `modifier-id-stat-table` | `XMLItem.as:231-298` (all 17 cases + Set default); all 21 `strings.json` ids resolve to the quoted names | HELD, one correction below |
| `slashusage-stancerestriction-omitted` | my own counts: slashusage **24×1, 72×70, 96×35 (106 rows, exactly 3 values)**; stancerestriction **4×7, 6×46 (53 rows)**; `XMLItem.as:152-160` default 48; `StatsManager.as:1915-1919`, `:1921-1930` | HELD — best-evidenced claim in the set |
| `per-item-art-payload-unknown` | `reference/decompiled/shs3_payload/scripts/` — 1 `item[0-9]*`, 0 `acc[0-9]*`, 1 `torso[0-9]*`, 2 `weapon[0-9]*` | STILL_UNHELD **correct**; honest |

---

## NEW FINDINGS (things the surveyor missed)

### N1 — the humanoid render stack is **23** layers, not 27 (material for L6)
`MCSCharacter.as:120` — `internal var partListLength:int = 22;` — and the constructor loops
`i = 0; i <= partListLength` (`:141`), so `partList` holds **23** MovieClips, indices 0-22.
`PART_l_shoulder(23) / PART_r_shoulder(24) / PART_l_knee(25) / PART_r_knee(26)` are declared but
never allocated on a human. They are **quadruped** parts: the only reader is `MCSWolf.as:184,188,193,197`,
and `MCSWolf.as:13` raises `partListLength = 25`. The surveyor quoted the loop but not the `22`
sitting 21 lines above it. A builder coding "27 z-ordered layers" gets 4 dead slots on every fighter.

### N2 — the elemental-DEF pool reuse is a **deliberate counter-element wheel**, not "the shipped bug"
`ItemGenerator.as:142-145`: `FIREDEF ← wateratk`, `WINDDEF ← earthatk`, `WATERDEF ← windatk`,
`EARTHDEF ← fireatk`. Every DEF channel borrows the pool of the element that **counters** it — fire
defense is named "of Water / of Ice / of Frost", wind defense "of Stone / of the Mountain". That is a
closed 4-cycle, not a copy-paste slip. The claim's substance is unaffected; only the lane_impact's
"shipped bug" framing is wrong, and porting it as a bug-to-fix would change 32 of 104 affix names.

### N3 — the web build has a **fifth** name colour the Android build does not (material for L5)
`reference/decompiled/shs3_payload/scripts/§1t17s0§.as:698-701`:
```as3
else if(this.xp != null)
{
   _loc1_ += "<font color=\"#ff6600\">";
}
```
This branch sits **between** the two colour blocks the surveyor cited (`:691` and `:704`) and has **no
counterpart** in `Item.as:417-451`. So the claim's "removes the S0-3 Android-parity caveat" is not
established for this system: the v0.717 web build paints XP-bearing items **orange #ff6600**, ahead of
the unique/rare/special/normal ladder. Six colours are byte-exact in both; the seventh is web-only.

### N4 — only **11 %** of `<modifier>` rows are stat grants (material for L4/L7)
My parse of `reference/extracted/itemdata.xml`: 412 `<modifier>` rows, 34 distinct ids.
Against the `XMLItem.as:231-298` table: **47 rows** (11 %) hit the 0-16 stat switch; **344 rows** (83 %)
fall in the 101-1999 Set band and render only as `"Set: <id>"` — still an opaque number; **19 rows**
across **11 distinct ids** (25, 38, 78, 79, 84, 90, 96, 97, 98, 99, 40000) match neither and fall to
`trace("ErrorValue: …")`. lane_impact's "the 412 modifier rows become readable stat grants instead of
opaque numbers" over-states by ~9×.

### N5 — `ui-slot-mapping-unknown` is **resolvable**, and it is ACCESSORY1/ACCESSORY2 (A2)
The surveyor answered STILL_UNHELD on which of `EQ_NECK / EQ_ACCESSORY1 / EQ_ACCESSORY2` the two
identical empty ring boxes are. `MCSItem` — the inventory/slot icon renderer — declares exactly 11
item setters (`MCSItem.as:64,89,120,152,177,203,226,249,279,324,362`): Hat, Hair, Head, Mask, Weapon,
Consumable, Accessory, Gloves, Shoes, Armor, Pants. **There is no `setNeck` in `MCSItem`** — `setNeck`
exists only on the body renderers `MCSCharacter.as:795` and `MCSBust.as`. `EQ_NECK` therefore has no
UI-box renderer at all, and `setAccessory` (partType `"acc"`, `AccessoryDummyIcon` fallback) is the
only setter that would draw two identical empty boxes. The two rings are **EQ_ACCESSORY1 / EQ_ACCESSORY2**.

### N6 — `getSellAmt`'s `weight >= 10` test reads **stack** weight, not item weight (minor, L4)
`Item.as:1564-1580` — `getWeight()` returns `this.weight * this.getQuantity()`. So ten weight-1
branches in one stack trip the `>= 10` branch and each sells at ×10 instead of ×5. Any port that
evaluates the threshold on the row's `<weight>` will mis-price stacks.

### N7 — the sell formula's *input* is **not** byte-identical across builds (minor)
`Item.as:1568` (android) `return this.weight * this.getQuantity();` vs
`§1t17s0§.as:1974` (web v0.717) `return (this.weight + this.§1t478s0§) * this.§1t484s0§();`.
`getSellAmt` itself is identical in both, but the web build adds a weight-modifier term before the
`>= 10` test. "Confirmed in BOTH builds" holds for the function body, not for its dependency.

---

## Verdict on the score

`78` is **not supported**. Blocker ⑤ is half-open (icon manifest, N/§2 above), and one of the two
"the ledger is wrong" corrections used to justify the jump is itself refuted. Blockers ①②③④ are
genuinely and impressively closed. **Suggested band: 70-72**, with ⑤ re-listed as
"paperdoll compositing HELD · item/accessory icon art STILL_UNHELD".
