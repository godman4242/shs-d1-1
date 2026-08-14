# Blind critic — LENS 4 (THE FRAME LENS) — unit: items-equipment

Reviewer opened, first-hand: `reference/frames/s21_weapon/t708.0.png` (1920x1080, verified
`PIL Image.size == (1920,1080)`) with four crops stated below; 12 AS3 files across the Android
v0.682 and web v0.717 bundles; `reference/extracted/itemdata.xml`;
`docs/gauntlet/L0/index/strings.json`; `docs/research/REBUILD_READINESS.md`.

## Crops I actually took (all LANCZOS)

| # | region (full-frame px) | upscale | what is visibly in it |
|---|---|---|---|
| C1 | (170,240)–(870,1040) | x2 | paperdoll: **exactly 9 boxes**. Row1 hat(filled straw kasa) + mask(empty, red oni-mask outline). Row2 armor(filled grey haori) + gloves(empty, gauntlet outline). Row3 pants(filled white hakama) + weapon(filled pickaxe). Row4 ring(empty outline) + shoes(filled sandals) + ring(empty outline). Centre doll: kasa, grey patched haori, white hakama, sandals, pickaxe in hand. |
| C2 | (900,590)–(1640,960) | x2 | 7 inventory icons. Row1 branch (tile **darkened = selected**), red/yellow scroll, blue feather-brush **purple border**, onigiri **x3**. Row2 katana, black stone, white feather **purple border**. 2 of 7 purple. |
| C3 | (1400,540)–(1780,600) | x4 | `WEIGHT: 43 / 100` |
| C4 | (1320,240)–(1620,320) | x4 | `DMG: 1 - 2  (EQ: 1 - 3)` with the **2 rendered red**; `WEIGHT: 1`; header `BRANCH`; label `LEVEL 1` |

The frame is the InventoryUI ("PLAYER" title, STATS button, COINS 122 / GOLD 3, XP 2098/2950,
AVAILABLE STAT POINTS: 0, EQUIP / DROP).

---

## 2 REFUTED

### R1 — `items-equipment/no-separate-icon-manifest` — **MATERIAL**

The claim: *"the inventory icon is composed from the SAME MCS part symbols as the paperdoll …
there is no separate icon art set to recover."* It was graded from **one** of MCSItem's ten
setters (`setArmor`, MCSItem.as:324-349) and generalised.

**The frame refutes it.** In C2, 4 of the 7 inventory icons are **not equipment at all** — a
scroll, onigiri x3, a black stone, a feather. None can be a paperdoll part stack. In C1, four
of the nine boxes render **dedicated placeholder artwork**: the red oni-mask outline, the
gauntlet outline, and two ring outlines.

The code says the same, in the very file cited:

- `MCSItem.as:203-216` — `setConsumable(id)` → `getMCSComponent("item", id)`, miss case
  `new item0()`. `"item"` is a symbol family with **no PART_ constant and no paperdoll
  counterpart** (`grep -o 'getMCSComponent("[a-z]*"' MCSCharacter.as` yields 18 partTypes;
  `"item"` and `"acc"` are absent from that set and present only in MCSItem).
- `MCSItem.as:226-233` — `setAccessory(id)` → `getMCSComponent("acc", id)`, miss case
  `new AccessoryDummyIcon()`. That is the artwork in C1's two ring boxes.
- **11** dedicated `*DummyIcon` classes ship in the build
  (`ls reference/decompiled/shs3_android/scripts/ | grep -ci dummyicon` → `11`):
  Accessory, Achievement, Armor, Consumable, Gloves, Hat, Invalid, Mask, Pants, Shoes, Weapon.
- The web payload exports `item0.as` — the `partType + "0"` fallback for the **consumable**
  family — proving the family is real and separate.

What survives: the *armor* icon really is a 5-part MCS stack at published offsets
(stomach -0.65/5.9, pelvic -0.35/10, torso 0/-2, uparm -5.2/-13.5, lowarm -6.5/4.8) — I read
MCSItem.as:324-357 and it is verbatim. What does not survive is the conclusion, and the score
rationale that rests on it ("the icon manifest turns out not to exist as a separate thing").
Blocker ⑤'s icon half is **NOT closed**.

### R2 — `items-equipment/purple-border-is-unique-not-rarity` — **MATERIAL**

The claim's guidance — *"border tracks `<unique>`, text colour tracks the 4 tiers"* — is wrong,
and the disproof is **six lines above the line the surveyor quoted**:

```
GameEngine.as:568   str = "Tip: A blue border indicates that an item is rare.";
GameEngine.as:572   str = "Tip: A purple border indicates that an item is unique.";
```

and the implementation is one function, not two:

```
ShopItem.as:51-52   this.borderType = itemRef.getShopItemType();
                    gotoAndStop(this.borderType + "_default");
```

`getShopItemType()` (Item.as:382-405) is the **same** derived 4-tier ladder that drives the text
colour — `unique` / `rare` / `special` / `normal`. The border is that ladder rendered as a
MovieClip frame label. Two further consequences the claim gets backwards: `"unique"` is broader
than `<unique>==1` (quest-pickable, the five trade ids 20103-20107, and player-named items all
return `"unique"`), and `"rare"` is `modifierCount >= 3` — a border state with no `<unique>`
involvement whatsoever.

The literal sentence "the purple border is the unique flag" is fine. The lane guidance built on
it would make a builder implement two colour systems where the game has one. Frame corroboration
stands: I resampled the border of the row-1 purple tile myself and the modal pixel is exactly
**RGB(144,102,203)**, reproducing the surveyor's number — an honest measurement.

### R3 — `items-equipment/ui-slot-mapping-unknown` — **MINOR** (STILL_UNHELD → HELD)

Not wrong, but unnecessary. One grep in the file that owns the UI settles it:

```
InventoryUI.as:175   internal var SLOT_RING1:int = 6;
InventoryUI.as:179   internal var SLOT_RING2:int = 8;
InventoryUI.as:268   this.equippedSlots[this.SLOT_RING1] = this.equipAccessory1;
InventoryUI.as:269   this.equippedSlots[this.SLOT_RING2] = this.equipAccessory2;
InventoryUI.as:522   tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY1];
InventoryUI.as:527   tempShopItem = this.equippedSlots[this.SLOT_RING1];
InventoryUI.as:530   tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY2];
InventoryUI.as:535   tempShopItem = this.equippedSlots[this.SLOT_RING2];
```

Left ring = `EQ_ACCESSORY1`, right ring = `EQ_ACCESSORY2`. `EQ_NECK` is not in the UI at all.
Independently over-determined by `StatsManager.findBonusStat` (:1944-1946), which loops all 13
slots but skips `EQ_HEAD`, `EQ_NECK`, `EQ_SCABBARD`, `EQ_HAIR` — leaving exactly the 9 boxes C1
shows. The SLOT_ ordering also reproduces C1's reading order exactly:
HAT 0, MASK 1, ARMOR 2, GLOVES 3, PANTS 4, WEAPON 5, RING1 6, SHOES 7, RING2 8.

---

## 17 HELD (each personally re-opened)

Everything else in the survey reproduced verbatim. Spot notes:

- **sell price** — `Item.as:1582-1593` and web `§1t17s0§.as:1977-1988` are structurally
  identical. Verified.
- **condition ladder** — `Item.as:712-746`; all 7 strings resolve
  (`639 Unbreakable`, `392 Condition: Well-Maintained`, `387 Broken`, `388 Poor`, `389 Used`,
  `390 Usable`, `391 Good`). Web `§1t17s0§.as:1000-1026` carries the identical 25/50/75 ladder.
- **no condition→DMG multiplier** — `getCondition()` has exactly two occurrences in the entire
  Android bundle: its definition (:1481) and one call from `getDesc()` (:714). Confirmed by
  `grep -n getCondition scripts/*.as`.
- **affix pools** — 13 distinct 8-entry prefix arrays and 13 suffix arrays = 104 + 104.
  `MAXINDEX:int = 79` (ItemGenerator.as:58). Legendary rule is `if(isLegendaryItem &&
  numEnchant > 2) numEnchant--;` (:371-374).
- **stat ladder** — both quoted itemdata rows are byte-exact (`13002` Branch, `13225` Steel
  Sabre). `getMaxTier` is verbatim at :321-345.
- **modifier table** — `XMLItem.as:231-298` verbatim, all 17 cases + the `id < 2000 && id > 100`
  → "Set" default.
- **defense min-floor / weight cap** — `EnemyPlayer.as:107-123`, `StatsManager.as:2298-2301`,
  `BankUI.as:264` all verbatim. Both ledger lines quoted by the surveyor exist word-for-word at
  `REBUILD_READINESS.md:209`; blockers ①-⑤ at `:210`; the §3 #9 line at `:168`;
  §6 save-format line at `:351`.
- **per-item art payload STILL_UNHELD** — correct and honest. My own sweep: each of the three
  shs3 bundles exports exactly **22** part-symbol classes (the naked defaults plus `item0` and
  `foottop12000`); none of the 982-row roster's art is present anywhere on disk.

---

## 10 additions the surveyor missed

**A1 — the frame identity is UNIQUE, and the equipped item resolves too.**
I scanned all 982 `<item>` blocks: **exactly one** row has `mindamage 1 / maxdamage 2` — id
13002, name 4041 → "Branch", weight 1. Three rows have `1 / 3`: 13001 "Stick", 13003 "Bamboo",
and **13022 name 4244 → "Pickaxe", weight 10, minlvl -4**. C1 shows a *pickaxe* in the weapon
box and C4 shows `(EQ: 1 - 3)` — so **both** items in the frame resolve to payload rows, and the
selected tile's grey (non-purple) border matches 13002 having no `<unique>` and no modifiers →
`getShopItemType() == "normal"`. This is the strongest frame↔payload identity in the unit.

**A2 — `getWeight()` is stack weight, and it DIFFERS between builds.**
`Item.as` (Android): `if(this.weight != -1) return this.weight * this.getQuantity();`
Web `§1t17s0§.as:1948-1976`: `return (this.weight + this.§1t478s0§) * this.§1t484s0§();`
Two consequences the sell-price claim does not state: (a) `getWeight() >= 10` in `getSellAmt` is
**stack** weight, so ten weight-1 branches cross the x10 step; (b) the web build adds a
weight-modifier term the Android build has no equivalent for. The formula is two-build-confirmed;
its **input** is not.

**A3 — the web build has a FIFTH item-name colour band the Android build lacks.**
`§1t17s0§.as:677-681` and `:698-701` put `if(this.xp != null)` **above** the unique branch:
`#ff9900` on the loot toast, `#ff6600` in the inventory. Android's `Item.as:415-451` has no such
branch, and `grep -c xp Item.as` → **0** (no `xp` field exists in the Android class; the web class
declares it at `:42`). So the claim's "removes the S0-3 Android-parity caveat" is backwards for
this exact item — the **web** build, which is the 1:1 target, carries one more band.

**A4 — hard proof that the S0-3 build-parity caveat is load-bearing.**
Same function, same file position, different tuning:
Android `StatsManager.getSkillCooldownModifierVal`: `if(speed > 300) speed = 300; return 1 - speed/300*0.5;`
Web `§1t1523s0§.as:2290-2296`: `if(param1 > 600) param1 = 600; return 1 - param1/600*0.5;`
A clean 2x divergence between v0.682 and v0.717. Any Android-only combat number must carry the
caveat until checked against `shs3_payload`.

**A5 — the combat half of blocker ② *is* web-confirmed (stronger than claimed).**
`§1t1523s0§.as:2298-2317` (min damage) and `:2320-2331` (damage range) are structurally identical
to the Android originals — broken weapon → `ATK + bonus + 1`, range `0`. The binary cliff is
two-build-confirmed; the surveyor cited Android only.

**A6 — the reach formula is web-confirmed; slashusage 24 is dead.**
`§1t1523s0§.as:2346-2347` is `90 + DAN*5` / `120 + floor(x*speed/(20+speed))` — identical to
Android. And `getSlashUsage` floors anything `< 48` to 48 in **both** builds
(Android :1921-1928, web :2352-2359), so the single `<slashusage>24</slashusage>` row can never
take effect. My counts reproduce the surveyor's exactly: 106 rows `{72:70, 96:35, 24:1}`;
53 `<stancerestriction>` rows `{6:46, 4:7}`.

**A7 — 27 PART_ constants, but only 23 layers exist for a human.**
`MCSCharacter.as:120` `internal var partListLength:int = 22;` and `:141` `for(i = 0; i <=
partListLength; i++)` → indices 0-22. `PART_l_shoulder 23`, `PART_r_shoulder 24`,
`PART_l_knee 25`, `PART_r_knee 26` are never allocated by the human constructor; their only
consumer is `MCSWolf.as` (which raises `partListLength = 25` at :13) for legs and a third tail
segment. A builder coding 27 z-layers for the paperdoll adds four that never render.

**A8 — `setArmor` drives 7 mandatory parts plus a conditional 8th.**
`MCSCharacter.setArmor` calls `getMCSComponent` eight times — torso, stomach, uparm x2,
lowarm x2, pelvic unconditionally, then `neck` guarded by `if(componentObject != null)`.
"armor = 7" is the mandatory count; the neck layer is an optional extra. `setPants` = 5 exactly
(crotch, l/r thigh, l/r calf) — that one is right.

**A9 — the `+10` end-spike is on three of the five progression arrays, not all five.**
`ItemGenerator.as:157, :164, :171` apply `prog1/prog2/prog3[MAXINDEX] += 10`. `prog4` (SPEED) and
`prog5` (PIERCINGDMG) have **no** spike (:176, :182). Attribute mapping confirmed:
prog1 ATTACK|DEFENSE, prog2 MAXHP|MAXCHI, prog3 the eight elemental channels + HPREGEN + CHIREGEN
+ CRITICALDMG, prog4 SPEED, prog5 PIERCINGDMG. Also: 158 rows carry damage but only **155** carry
`<minlvl>` — the "158-row ladder (minlvl -4..79)" conflates two counts. Ranges are right:
minlvl -4..79, mindamage 1..81, maxdamage 2..108.

**A10 — `uses == 0` is a "never wears" sentinel, which is why it maps to "Unbreakable".**
`gotUsed()` returns immediately when `uses == 0` (:1420-1424) and `repair()` clamps to a floor of
**1**, never back to 0 (:1439-1449). So 0 is unreachable once an item has ever worn, and the
ladder's first branch is a flag, not a wear reading. The surveyor got the thresholds right
without stating the mechanism; a builder who treats `uses == 0` as "brand new" will label every
fresh item "Unbreakable".

**A11 (caution, not a finding) — "the shipped bug where the four elemental-DEF channels reuse the
wrong prefix/suffix pools" is an interpretation, not an artifact.**
`ItemGenerator.as:142-145` maps FIREDEF←water words, WINDDEF←earth words, WATERDEF←wind words,
EARTHDEF←fire words. Naming fire-resistance gear "Icy … of Frost" is a coherent counter-element
scheme. Nothing on disk says it is a bug. Under §0 that label should be dropped or downgraded to
a lead.

---

## Score

The surveyor's **78** is a touch high given R1: blocker ⑤ is half-open, not closed — the
compositing contract holds, the icon art set does not. With ⑤ scored as half and ①②③④ genuinely
closed on A2 code, **72-75** is the honest band. The four listed blockers that do close, close
hard and in verbatim executable code; that part of the survey is excellent work.
