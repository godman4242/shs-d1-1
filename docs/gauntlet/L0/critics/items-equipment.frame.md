# Critic — items-equipment — LENS 4 (THE FRAME LENS)

Blind review. I did not see the surveyor's reasoning. Every verdict below carries an
artifact **I** opened. Frames were cropped and upscaled by me; crops are stated.

**Headline:** this is a strong survey — 17 of 20 claims survive, and every line number
I spot-checked (and I checked ~25 of them) landed exactly on the quoted code. The
frame-side work is genuine: the surveyor really opened `t708.0.png` and really read it.

**But three claims are wrong, and two of the three are the ones the score rationale
leans on hardest** — the two "the ledger's Ready bullets are WRONG" claims and the
"icon manifest doesn't exist" claim. All three fail the same way: a correct local
reading generalised past the evidence, when the disproof was 4 lines away, in the
same file, or visible in the surveyor's own frame.

---

## Frames I opened

| crop | source | tool | what I read |
|---|---|---|---|
| full page @0.5× | `reference/frames/s21_weapon/t708.0.png` (1920×1080) | PIL LANCZOS | player/inventory screen orientation |
| `(170,240)-(870,1040)` ×2 | same | PIL LANCZOS | paperdoll — **9 boxes**, 5 filled / 4 ghost-outline |
| `(1300,230)-(1650,330)` ×4 | same | PIL LANCZOS | `DMG: 1 - 2 (EQ: 1 - 3)`, the `2` red, the leading `1` **plain white**; `WEIGHT: 1` |
| `(1400,540)-(1790,600)` ×4 | same | PIL LANCZOS | `WEIGHT: 43 / 100`, white text |
| `(900,580)-(1650,960)` ×2 | same | PIL LANCZOS | 7 inventory icons, **2 purple-bordered**; border pixel sampled `(155,102,205)` at (1280,640) |

The surveyor's paperdoll reading is exactly right, box for box: hat(filled) mask(ghost)
armor(filled) gloves(ghost) pants(filled) weapon-pickaxe(filled) ring(ghost)
shoes(filled) ring(ghost). I counted the same 9.

---

## REFUTED — 3

### R1 · `no-separate-icon-manifest` — **material**

> "the inventory icon is composed from the SAME MCS part symbols as the paperdoll …
> there is no separate icon art set to recover"

**The surveyor's own frame refutes this.** In my `(900,580)-(1650,960)` ×2 crop the
inventory row contains a yellow scroll, a rice ball (×3), a black stone and a white
feather. None of those is a body part. There is no `stomach` or `torso` symbol that
composes into a rice ball.

The code says the same thing. `MCSItem.setArmor` (the surveyor's only cite) is the
*armor* case, and it was generalised to all items. The dispatcher is
`ShopItem.as:134-200`, and it routes by ID band:

```
else if(this.itemID < 3000 && this.itemID > 1999) { this.itemMCS.setConsumable(this.itemID); }
else if(this.itemID < 4000 && this.itemID > 2999) { this.itemMCS.setAccessory(this.itemID); }
...
else if(this.itemID < 30000 && this.itemID >= 20000) { this.itemMCS.setConsumable(this.itemID); }
```

and those two branches reach **two symbol families that have no paperdoll counterpart
at all**:

```
MCSItem.as:203  setConsumable  ->  this.getMCSComponent("item",id)  ... fallback  new item0()
MCSItem.as:226  setAccessory   ->  this.getMCSComponent("acc",id)   ... fallback  new AccessoryDummyIcon()
```

`item####` and `acc####` are icon-only art. Accessories are additionally never passed
to the renderer (`StatsManager.as:1765` `initMCS(...)` takes 11 args, none of them
`EQ_ACCESSORY1/2`), so `acc*` cannot be a doll part even in principle.

Measured from `reference/extracted/itemdata.xml` (my count, 982 rows):
`2xxx` = 99 rows, `3xxx` = 9 rows, `20xxx` = 79 rows → **187 of 982 items (19%) need
icon art with no paperdoll stack to compose it from.** A further 14 rows in the
`10xxx` neck band hit `ShopItem.as:178` `else if(!(this.itemID < 11000 && this.itemID > 9999))`
and get **no** icon call at all.

Blocker ⑤'s "item **icon manifest**" half is therefore *not* a category error. It is a
real, still-open art blocker for a fifth of the roster — and the web payload holds
exactly one of those classes (`item0.as`; zero `acc*.as`), i.e. the default, not the set.

### R2 · `defense-min-floor-is-wrong` — **material**

> "the real code is a four-band floor on the PLAYER's post-defense hit keyed to
> playerLVL … and it **lives in boss auto-scaling, not the generic defense pipeline**"

The generic defense pipeline is exactly where it lives. `Damage.as:149-172`:

```
public function getMinDamage() : int {
   if(this.damage == 0)          { return 0; }
   if(this.attackerlvl == 0)     { return this.damage; }
   if(this.attackerlvl <= 10)    { return 1 + this.piercingDamage; }
   if(this.attackerlvl <= 20)    { return this.attackerlvl / 8 + this.piercingDamage; }
   if(this.attackerlvl <= 30)    { return this.attackerlvl / 6 + this.piercingDamage; }
   return this.attackerlvl / 4 + this.piercingDamage;
}
```

Same four-band shape (1 · /8 · /6 · /4) — but keyed on **`attackerlvl`**, not
`playerLVL`. And it is applied on the player's damage-taking path, immediately after
defense subtraction, `MCSPlayer.as:3415-3419`:

```
damage -= this.getDefense();
if(damage < damageObj.getMinDamage()) { damage = damageObj.getMinDamage(); }
```

`damageObj.getMinDamage()` is applied in **9 files** (`EnemyClone`, `EnemyJiangSi`,
`EnemyNianMonster`, `EnemyWolfAlpha`, `EnemyShield`, `EnemyZombie`, `EnemySpearElite`,
`MCSPlayer` ×2, …). When an enemy hits the player, the attacker is the enemy — so the
floor above attacker level 30 **is `EnemyLevel/4`**, precisely what the ledger bullet
says. `EnemyPlayer.as:107-123` (the surveyor's cite) is the *player-attacking-a-boss*
mirror of the same ladder, used to size boss HP; it is real, but it is not the rule,
it is one instance of it.

The ledger's `defense min-floor (EnemyLevel/4)` is **correct** — incomplete (it omits
the three lower bands and the `+piercingDamage` term), but not wrong in variable and
not wrong in shape. Editing it per this claim would replace a right line with a wrong one.

### R3 · `purple-border-is-unique-not-rarity` — **material**

> "border tracks `<unique>`, text colour tracks the 4 tiers … prevents mis-wiring the
> border colour to the 4-tier rarity ladder"

`ShopItem.as:51-52` wires the border to the ladder and nothing else:

```
this.borderType = itemRef.getShopItemType();
gotoAndStop(this.borderType + "_default");
```

`getShopItemType()` is the function the surveyor themselves quote in
`rarity-is-derived-not-a-field` — it returns `"unique" | "rare" | "special" | "normal"`.
There is one MovieClip border frame per tier (`_default`, `_selected`, `_mouseover`,
`_selectedmouseover`). Wiring the border to the 4-tier ladder is exactly correct.

And the disproof sat **four lines above the surveyor's own cite**. They quoted
`GameEngine.as:572`; `GameEngine.as:568` reads:

```
str = "Tip: A blue border indicates that an item is rare.";
```

Two claims in this unit therefore contradict each other, and the code sides against
this one. Secondary error: the border does not track the `<unique>` XML field —
`getShopItemType` returns `"unique"` for `itemxml.unique == 1` **OR**
`isPickableQuestItem()` **OR** the five trade-quest IDs (20103-20107) **OR**
`isPlayerNamed()`. Four sources, one of which is runtime state.

*(My frame crop does corroborate the surveyor's visual: 2 of 7 icons purple-bordered,
border pixel ≈ RGB(155,102,205) at (1280,640) — consistent with their (144,102,203).
The observation is fine; the inference from it is not.)*

---

## REFUTED — 1 more, constructively

### R4 · `ui-slot-mapping-unknown` — **minor** — the answer exists

Declared STILL_UNHELD ("cannot be established from the frames or the AS3 I read").
Honest, but reachable. `InventoryUI.as:163-179`:

```
SLOT_HAT 0 · SLOT_MASK 1 · SLOT_ARMOR 2 · SLOT_GLOVES 3 · SLOT_PANTS 4
SLOT_WEAPON 5 · SLOT_RING1 6 · SLOT_SHOES 7 · SLOT_RING2 8
```

That index order **is the frame's reading order**, box for box, in my ×2 paperdoll crop:
row1 hat·mask, row2 armor·gloves, row3 pants·weapon, row4 ring·shoes·ring.
`InventoryUI.as:261-269` and `:522-535` bind `SLOT_RING1 -> EQ_ACCESSORY1` and
`SLOT_RING2 -> EQ_ACCESSORY2`. `EQ_NECK` appears nowhere in `InventoryUI.as`.

**Left ring = ACCESSORY1. Right ring = ACCESSORY2. NECK has no box.** Frame and code
agree; nothing is unheld here.

---

## REFUTED — 1, wording only

### R5 · `modifier-id-stat-table` — **minor** — "fully resolved" is not true

The cited switch (`XMLItem.as:231-298`) is verbatim correct and the string IDs all
resolve. But I counted the modifier IDs actually present in `itemdata.xml`
(412 blocks, 34 distinct IDs) and **11 distinct IDs / 19 rows fall outside every band
the claim names** (0-16, the 101-1999 Set band, the six reserved IDs):

```
25(×1) 38(×6) 78(×2) 79(×2) 84(×2) 90(×1) 96(×1) 97(×1) 98(×1) 99(×1) 40000(×1)
```

Two resolve elsewhere — `25 = STAT_DAN`, `38 = STAT_BUFFTYPE` (`StatsManager.as:262`
region) — because `findBonusStat` matches `modifierID == StatID` against the full
`STAT_*` space, not the description switch. Nine have no name I could find anywhere,
and `40000` hits `trace("ErrorValue: …")`. The lane_impact's "the 412 `<modifier>` rows
… become readable stat grants instead of opaque numbers" is false for those.

---

## HELD — 15 (verified first-hand)

| claim | what I checked | result |
|---|---|---|
| `sprite-compositing-contract-held` | `MCSCharacter.as:10-62` (PART_l_hand@10 … PART_r_knee@62 ✓), `:141-146` loop, `:581-607` getMCSComponent, `:915` setArmor (7 parts + conditional neck), `:1091` setPants (5 parts); all 18 named default classes present in `shs3_payload/scripts/` | HELD, **-4 correction** → see NF5 |
| `sell-price-formula` | `Item.as:1582-1593` verbatim; web `§1t17s0§.as:1977-1988` identical structure | HELD |
| `sell-price-corrects-section3-item9` | ledger text verbatim at `REBUILD_READINESS.md:168` | HELD (+ NF7) |
| `condition-has-no-damage-multiplier` | my grep: `getCondition` has exactly **2** hits in the whole Android tree — the definition (`Item.as:1481`) and one call (`:714`). Read the full player damage path `MCSPlayer.as:3415-3419`: no condition term anywhere | HELD, strengthened |
| `condition-tier-thresholds` | `Item.as:713-744` verbatim; web `§1t17s0§.as:1011/1015/1019` = the `<25/<50/<75` branches, exact; all 7 strings resolve | HELD |
| `affix-suffix-pool-and-counts` | 13 pool pairs × 8 = 104/104, read out; `getEnchantmentCount:206-252` verbatim; legendary at `:371-373` | HELD, one gloss disputed → NF8 |
| `stat-vs-level-curve` | `itemdata.xml:7906-7915` (13002) and `:9925-9937` (13225) verbatim; `getMaxTier:321-346`; prog1-5 `:150-183`; `levelrestriction` subtraction `:460-490`. My count: **158** rows carry `mindamage`, all `type 9`; mindamage 1..81, maxdamage 2..108 | HELD, 2 corrections → NF6 |
| `item-save-format-held` | `Item.as:5-16` five reserved IDs; `parse:47-104` — reserved IDs route to fields, **not** to `addModifier` (so `getModifierCount` is clean); `MCSCharacter.as:348` 12-field pipe string | HELD (PARTIAL correct) |
| `soul-infusion-is-code` | `CraftingUI.as:494-525` verbatim | HELD |
| `paperdoll-is-13-slots-not-9` | my ×2 crop: 9 boxes. `StatsManager.as:108` `Vector.<Item>(13)`; `:262-286` 13 EQ_ constants; `:1765` initMCS 11 args | HELD, **-1 correction** → NF1 |
| `rarity-is-derived-not-a-field` | `Item.as:382-405` + `:421-446`; web `:683,687,691,704,708,712` all exact. My count: `<unique>1</unique>` **253**, `<unique>2</unique>` **116** ✓ | HELD |
| `weight-cap-is-a-base-not-a-cap` | `StatsManager.as:2298-2301`; `BankUI.as:264`; my ×4 crop reads `WEIGHT: 43 / 100` | HELD |
| `eq-comparison-frame-payload-identity` | my ×4 crop; **exactly one** itemdata row has dmg 1-2 / weight 1 → id 13002 → `strings.json["4041"] = "Branch"` | HELD, strongest in unit → NF9 |
| `slashusage-stancerestriction-omitted` | my count: 106 slashusage rows `{72:70, 96:35, 24:1}`; 53 stancerestriction rows `{6:46, 4:7}`; `XMLItem.as` default 48; `StatsManager.as:1915-1930` | HELD, counts exact |
| `per-item-art-payload-unknown` | corroborated: `shs3_payload/scripts/` holds **1** `item*` class (`item0`), **0** `acc*`, **1** `torso*`, **2** `weapon*` — the naked defaults only | HELD, correctly unheld |

---

## New findings

**NF1 — the 9 UI boxes are the 9 *stat-bearing* slots.** `findBonusStat`
(`StatsManager.as:1944`) skips `EQ_HEAD`, `EQ_NECK`, `EQ_SCABBARD`, `EQ_HAIR`. The
remaining 9 are precisely the 9 boxes in the frame. So the four hidden model slots are
cosmetic-only, and the surveyor's "loses hair, head and scabbard" is **four** slots,
not three — NECK is missing too. (`findWeight`, `:1983`, skips only HEAD/NECK/SCABBARD
— so hair carries weight but grants no stats.)

**NF2 — border = the 4-tier ladder** (`ShopItem.as:51-52`, `GameEngine.as:568`). See R3.

**NF3 — the generic min-damage floor is attacker-keyed** (`Damage.as:149-172`,
`MCSPlayer.as:3415-3419`). See R2. Hand-off to L1/L2: this belongs in combat-core, not items.

**NF4 — `item####` / `acc####` are a second icon art family**, 187+14 of 982 rows. See R1.

**NF5 — the part stack is 23 deep, not 27.** `MCSCharacter.as:120` `partListLength:int = 22`
and `:141` `for(i = 0; i <= this.partListLength; i++)` create **23** MovieClips (0-22).
`PART_l_shoulder(23) · PART_r_shoulder(24) · PART_l_knee(25) · PART_r_knee(26)` are
declared but never instantiated and never indexed; `PART_prop3(22)` exists but is never
referenced. Only **22** indices are used. Building 27 z-layers ships 5 dead ones.

**NF6 — two corrections to the weapon ladder.** (a) `minlvl` is present on only **122**
of the 158 weapon rows, so "a complete 158-row ladder (minlvl -4..79)" overstates — 36
rows have no level anchor. (b) the `+10` spike at index 79 applies to **prog1, prog2,
prog3 only**; `prog4` (speed) and `prog5` get no spike (`ItemGenerator.as:157,164,171` —
and note there is no `prog4[MAXINDEX] += 10`).

**NF7 — the sell-price weight test is on STACK weight.** `Item.as:1564-1571`
`getWeight()` returns `this.weight * this.getQuantity()`. So `getSellAmt`'s
`getWeight() >= 10` fires on a stack of 10 weight-1 items, moving it to the ×10 tier.
A builder implementing unit weight gets a different economy for consumables.

**NF8 — the elemental-DEF pool reuse is probably not a bug.** The claim's lane_impact
calls `ItemGenerator.as:142-145` "the shipped bug where the four elemental-DEF channels
reuse the wrong prefix/suffix pools". The mapping is `FIREDEF <- water`, `WINDDEF <- earth`,
`WATERDEF <- wind`, `EARTHDEF <- fire` — a consistent opposing-element wheel ("Icy … of
Frost" for fire resistance). Reads as deliberate. Don't ship it labelled a bug.

**NF9 — the frame's equipped weapon is id 13022 "Pickaxe".** The tooltip's `(EQ: 1 - 3)`
plus the pickaxe visibly in the weapon box resolve to the only weight-10 row with
dmg 1-3. The whole frame is now identified end to end: item on cursor = 13002 Branch,
equipped = 13022 Pickaxe, and `WEIGHT: 43/100` is the `stat1009 = 0` guest case.

---

## Score

`78` is defensible but a notch high. Blocker ⑤ is **half** closed, not closed: the
paperdoll compositing contract is genuinely held (with NF5's correction), but the icon
manifest is a live art blocker for ~20% of the roster and the claim closing it is
refuted. Net of R1 + R2 + R3 I would land **72-74**, with `defense min-floor` and
`purple border` struck from the "ledger is wrong" list entirely — the ledger is right
on the first and the surveyor is wrong on the second.
