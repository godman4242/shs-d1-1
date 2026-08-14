# GAUNTLET L0 — HUNTER critic: **items-equipment**

Blind critic pass, 2026-08-15. I did not see the surveyor's reasoning — only its claim
list. Every verdict below cites an artifact **I opened myself**. Lens 2 (hunter): I went
looking for the things the survey marked STILL_UNHELD / PARTIAL, and for the places where
it under-claimed what is actually on disk.

**Headline:** the survey is mostly sound and the 42 -> 78 direction is right, but it
contains **one wrong overturn of a CORRECT ledger line** (the defense min-floor — the
generic damage floor exists and the surveyor cited a downstream copy of it), **two
build-scoped errors** (soul-infusion, sell weight term), **two phantom/overreach claims**
(stance "gate", "no icon art to recover"), and **one inverted UI conclusion** (the item
border IS the rarity ladder). Against that, it also **under-claimed five recoverable
systems**, including the one it marked STILL_UNHELD — the paperdoll slot map is fully
resolved in AS3 and matches the frame box-for-box.

Artifacts I opened first-hand: `reference/frames/s21_weapon/t708.0.png` (1920x1080,
crops listed inline), `reference/extracted/itemdata.xml` (parsed with ElementTree, counts
below), `reference/decompiled/shs3_android/scripts/` (Item, ItemGenerator, XMLItem,
StatsManager, MCSCharacter, MCSItem, InventoryUI, ShopUI, ShopItem, CraftingUI,
EnemyPlayer, **Damage**, **ResourceManager**, GameEngine),
`reference/decompiled/shs3_payload/scripts/§1t17s0§.as` + `§1t5374s0§.as` + `§1t104s0§.as`
(web v0.717), `docs/gauntlet/L0/index/strings.json`, `reference/extracted/sprites/`,
`reference/extracted/android/115_Mobile_SHS3Resource.bin`.

---

## A. REFUTED — claims that do not survive

### R-1 · `defense-min-floor-is-wrong` — **REFUTED, fatal.** The ledger was right; the surveyor cited a copy, not the original.

The claim says the ledger bullet "defense min-floor (EnemyLevel/4)" is *"wrong in both
variable and shape … it lives in boss auto-scaling, not the generic defense pipeline."*

It lives in the generic pipeline. `reference/decompiled/shs3_android/scripts/Damage.as:149-172`:

```as3
public function getMinDamage() : int {
   if(this.damage == 0)        { return 0; }
   if(this.attackerlvl == 0)   { return this.damage; }
   if(this.attackerlvl <= 10)  { return 1 + this.piercingDamage; }
   if(this.attackerlvl <= 20)  { return this.attackerlvl / 8 + this.piercingDamage; }
   if(this.attackerlvl <= 30)  { return this.attackerlvl / 6 + this.piercingDamage; }
   return this.attackerlvl / 4 + this.piercingDamage;
}
```

and it is applied immediately after defense subtraction on every hit —
`MCSPlayer.as:3415-3418`:

```as3
damage -= this.getDefense();
if(damage < damageObj.getMinDamage()) { damage = damageObj.getMinDamage(); }
```

The same two lines repeat in `EnemyWolf.as:384`, `EnemyShield.as:347`,
`EnemyNianMonster.as:383`, `EnemyClone.as:222/443`, `EnemyJiangSi.as:304`,
`MCSPlayer.as:3710`. The variable is **attacker level** — which, for an enemy hitting the
player, **is the enemy's level**. So "EnemyLevel/4" is the correct top band of a
1 / /8 / /6 / /4 ladder, and it is exactly a *post-defense min-floor*.

`EnemyPlayer.as:107-123` — the code the surveyor quoted — is the **boss HP-sizing mirror**
of that same ladder (`bossHP = playerhit * hitsToKillBoss`), reached only inside
`if(this.isBoss)`. The surveyor found the echo and declared the original nonexistent.

Consequence if shipped: the builder deletes the real damage floor from combat and
re-implements it as a boss-only rule. Ledger line stays; it needs *extending* (four bands,
attacker-side, `+ piercingDamage`), not overturning.

### R-2 · `purple-border-is-unique-not-rarity` — **REFUTED, material.** The border *is* the 4-tier ladder.

Claim: *"border tracks `<unique>`, text colour tracks the 4 tiers"* and it "prevents
mis-wiring the border colour to the 4-tier rarity ladder."

`ShopItem.as:51-52` and `:219-220`:

```as3
this.borderType = itemRef.getShopItemType();   // "unique" | "rare" | "special" | "normal"
gotoAndStop(this.borderType + "_default");
```
with `_selected`, `_mouseover`, `_selectedmouseover` at `:116,:283,:287,:295` — i.e.
**4 border types x 4 states = 16 named frames on the slot symbol.**

And the game's own tip list carries *both*: `GameEngine.as:568` —
`"Tip: A blue border indicates that an item is rare."` — sitting one branch above the
purple/unique tip the surveyor quoted at `:572`.

So purple is the `unique` **tier** returned by `getShopItemType()` (which is derived from
`unique==1` OR quest-item OR player-named), not a separate flag channel. Wiring the border
to `getShopItemType()` is correct; wiring it to `<unique>` alone loses the blue rare
border that the game explicitly documents.

### R-3 · `modifier-id-stat-table` — **REFUTED, material.** Not "fully resolved", and cited from the wrong table.

The cite is `XMLItem.as:231-298`, which is the *XML-authored* modifier display switch:
cases 0-16 then `default: if(id<2000 && id>100) "Set: "+id`.

The **runtime** table — the one that names what `ItemGenerator` actually rolls — is
`Item.as:1004-1042`, and it adds **ten more channels** the claim does not have:

```as3
case 28: getString(507)  // Fire ATK      case StatsManager.STAT_FIREDEF(200):  getString(871) // Fire DEF
case 29: getString(508)  // Wind ATK      case STAT_WINDDEF(201):  getString(872)  // Wind DEF
case 30: getString(509)  // Water ATK     case STAT_WATERDEF(202): getString(873)  // Water DEF
case 31: getString(510)  // Earth ATK     case STAT_EARTHDEF(203): getString(874)  // Earth DEF
                                          case STAT_CRITICALDMG(204): getString(875) // Critical Damage
                                          case STAT_PIERCINGDMG(205): getString(876) // Piercing Damage
```
(ids from `StatsManager.as:226-260`; strings resolved in `strings.json`.)

Those ten are not decoration — `ItemGenerator.as:583-640` writes generated affixes with
exactly these `STAT_*` ids, and 11 of the 17 affix pools map into them.

Worse for the claim's lane_impact (*"the 412 `<modifier>` rows … become readable stat
grants"*): I parsed `itemdata.xml` myself —

```
modifier rows 412  distinct ids 34
[(0,13),(1,3),(2,3),(3,13),(5,2),(6,1),(7,1),(8,2),(9,2),(12,1),(13,3),(15,3),(25,1),
 (38,6),(78,2),(79,2),(82,2),(84,2),(90,1),(96,1),(97,1),(98,1),(99,1),(101,1),(102,1),
 (103,223),(104,42),(105,40),(106,33),(117,1),(122,1),(123,1),(124,1),(40000,1)]
```

**338 of 412 rows (82%) are ids 103-106**, which are *not* stat grants: `Item.as:1044-1053`
shows `case 103: case 106:` printing the **contained item's display name** (`"- " + itemxml.displayname`),
and `case 102` printing a travel-node code. Under the claim's "Set band 101-1999" reading
those 223 rows render as `"Set: 103"`. The id space is resolvable — but from `Item.as`,
and it is not what the claim says it is.

### R-4 · `soul-infusion-is-code` — **REFUTED, material.** Android-only; the v0.717 target build transfers two more channels.

The Android quote is accurate. But the shipped **web v0.717** combine —
`reference/decompiled/shs3_payload/scripts/§1t5374s0§.as:686-724` — is a superset:

```as3
_loc6_ = designXML.defense;  _loc7_ = statsXML.defense;
if(_loc3_.§1t523s0§(7) == 0) { _loc3_.§1t493s0§(7, _loc7_ - _loc6_); }   // DEFENSE delta -> mod id 7, ALL types
else { _loc4_ = _loc3_.§1t524s0§(7); _loc4_.value += _loc7_ - _loc6_; }
if(_loc1_ == 4 || _loc1_ == 11) {                                        // armor + pants
   _loc8_ = statsItem.getWeight(); _loc9_ = designXML.weight;
   _loc3_.§1t478s0§ = _loc8_ - _loc9_;                                   // WEIGHT delta
}
if(_loc1_ == 13) { … mindamage delta -> mod id 6 …
   if(_loc5_.durability != 0) { _loc3_.uses = statsItem.uses; } }        // durability gated
```
plus a clone branch for item 2218 (`§1t5374s0§.as:682-686`).

Implement the claim as written and **armour soul-infusion transfers nothing** — which is
the entire point of the feature for non-weapons. The Android build (v0.682) simply predates
it. This is exactly the S0-3 build-parity caveat biting; the claim is labelled Android but
is presented as "the executable rules", and the 1:1 target is v0.717.

### R-5 · `slashusage-stancerestriction-omitted` — **REFUTED, material.** `stancerestriction` is dead data — the same phantom the survey correctly killed for `condition`.

`slashusage` half is fine (counts verified below). But `stancerestriction` is **never
enforced anywhere in either build**. Full occurrence set:

- Android: `XMLItem.as:38` (decl), `:160-166` (parse, default 0), `:321-327` (append
  `getString(125)="Stance Restriction"` to the description string). That is all — grep over
  the whole 2,768-class corpus returns nothing else.
- Web v0.717 `§1t104s0§.as:30,172,174,178` — declared, parsed, **never read at all.**

So calling it one of "two items-owned **combat inputs**" / "the stance gate" is the same
class of error the survey earned credit for dissolving two claims earlier ("condition is
display-only"). It is display-only too. The 53 rows and their values (4, 6) are real; the
mechanic is not.

Bonus correction on the other half: `StatsManager.getSlashUsage()` returns 48 whenever
`itemdata.slashusage < 48`, so the single `<slashusage>24</slashusage>` row is **inert in
the player's hands** — the live value set is {48, 72, 96}, not {24, 72, 96}.

### R-6 · `ui-slot-mapping-unknown` (STILL_UNHELD) — **REFUTED.** The map is in the code, and it matches the frame box-for-box.

`InventoryUI.as:163-179` declares the nine UI slots **in screen reading order**:

```as3
SLOT_HAT 0 · SLOT_MASK 1 · SLOT_ARMOR 2 · SLOT_GLOVES 3 · SLOT_PANTS 4
SLOT_WEAPON 5 · SLOT_RING1 6 · SLOT_SHOES 7 · SLOT_RING2 8
```

and `InventoryUI.refreshEquipment()` (`:459-540`) binds each to its model index:

```as3
case 7: tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY1];
        this.acc1Icon.visible = true;  tempShopItem = this.equippedSlots[this.SLOT_RING1];
case 8: tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY2];
        this.acc2Icon.visible = true;  tempShopItem = this.equippedSlots[this.SLOT_RING2];
```

My frame check (`reference/frames/s21_weapon/t708.0.png`, full-frame read at 1:1 plus crop
(170,240)-(870,1040) x2 LANCZOS) shows the nine boxes in exactly that order: row 1 straw
hat / oni-mask outline; row 2 grey haori / gauntlet outlines; row 3 white hakama / pickaxe;
row 4 ring outline / sandals / ring outline. Declaration order == layout order, so
**RING1 is the left ring box, RING2 the right**, and **`EQ_NECK` is not in the paperdoll at
all** (it is worn via quest scripts — `StatsManager.as:2265,2278,3236` equip items 10000/10001
directly). Answer, not a gap.

### R-7 · `no-separate-icon-manifest` — **REFUTED, minor.** The compositing insight holds; "nothing to recover" does not.

`MCSItem.setArmor` is quoted correctly. But there are **17 named placeholder icon symbols**
that must be authored and are *visible in the frame*:

- 8 inventory dummies in `MCSItem.as`: `HatDummyIcon` (:70,:95,:126), `MaskDummyIcon` (:158),
  `WeaponDummyIcon` (:183), `AccessoryDummyIcon` (:232), `GlovesDummyIcon` (:255),
  `ShoesDummyIcon` (:285), `ArmorDummyIcon` (:330), `PantsDummyIcon` (:368);
- 9 empty-slot icons in `InventoryUI.refreshEquipment()`: `hatIcon, armorIcon, glovesIcon,
  pantsIcon, maskIcon, weaponIcon, shoesIcon, acc1Icon, acc2Icon`, each `.visible = true`
  when its slot is empty.

Those nine are precisely the ghosted oni-mask, gauntlet and ring outlines I can see in the
paperdoll crop. So "no icon-authoring pass is needed" is wrong by a small but on-screen
art set. The main finding — equipped-item icons are the MCS part stack at published
offsets — survives intact.

### R-8 · `per-item-art-payload-unknown` (STILL_UNHELD) — **REFUTED in part, minor.** The disjunction is resolved; the payload is still unreadable.

The claim leaves open *"either obfuscated in the web SWF or inside the encrypted CWS blobs."*
It is not in the web SWF, and that is provable:

- `StatsManager.as:360` — `public static var useExternalResource:Boolean = true;` (re-set at
  `:508`). Every `getMCSComponent()` therefore takes the **ResourceManager branch**, never
  `getDefinitionByName`.
- `ResourceManager.as:41` —
  `resourceFileNameArray = ["shs3resource.swf","musicresource.swf","soundresource.swf","imageresource.swf","bgresource.swf"]`,
  loaded over HTTP POST (`getresource.php`, `pass=12345&num=<n>`) with the loading-screen
  string `"Loading art assets... "` (`:139`). `init()` loads BASE + BG + IMAGE on the
  **non-mobile (web) path**.
- Corroboration by count: `reference/extracted/sprites/` (827 sprites from the web payload)
  contains exactly **22** MCS part symbols — `DefineSprite_2647_torso4000`,
  `…_2642_weapon13002`, `…_2665_head8000`, etc. — i.e. only the naked defaults. Same 21-22
  count in all three decompiled bundles.

So: the roster art was **streamed from the dead server**, and the only local copy is
`reference/extracted/android/115_Mobile_SHS3Resource.bin` (654 KB). I tried to open it —
header `b'CWSy\xb1\x89gh…'`, `zlib.decompress(d[8:])` fails with *"unknown compression
method"* — consistent with S0-5. **No recovery claim.** But the residual blocker should be
restated: *"art lives in the held-but-encrypted resource blob; the getDefinitionByName
symbol-name path is dead code in shipped builds"*, not *"we don't know where it is."*

---

## B. HELD — verified first-hand, with corrections where the wording overshoots

| claim | verdict | what I checked |
|---|---|---|
| `sprite-compositing-contract-held` | HELD (2 corrections) | `MCSCharacter.as:10-62` 27 constants read; `:120` `partListLength=22`; `:141-146` loop `i<=partListLength`. **Only 23 layers are created (0-22).** `PART_l_shoulder 23 / r_shoulder 24 / l_knee 25 / r_knee 26` are declared and *never used* — grep returns only their declarations; indexing `partList[23..26]` would be out of range. Also `setArmor` claims **8** parts, not 7: it sets `neck` conditionally at `:1073-1088`. |
| `sell-price-formula` | HELD (1 build caveat) | `Item.as:1582-1593` and web `§1t17s0§.as:1977-1988` are byte-identical in body. **But the `getWeight()` they call is not:** Android `:1564-1579` returns `weight * quantity`; web `:1958-1974` returns `(weight + §1t478s0§) * quantity`, where `§1t478s0§` is a per-item weight modifier written by web soul-infusion (R-4). Also `ShopUI.as:394-397`: **itemID 13002 (Branch) sells for 0**, and `ShopUI.sellPercentage = 0.5` (`:58`) is declared but never referenced — `onSell` (`:536-540`) pays exactly `getCost()`. |
| `sell-price-corrects-section3-item9` | HELD | Ledger line 168 quoted correctly. Arithmetic: 5 = (1+0)*5, 25 = (1+4)*5, both weight<10; a weight>=10 item cannot produce 5. No level term exists. |
| `condition-has-no-damage-multiplier` | HELD | `Item.as:1481-1496` read; `grep -rn getCondition` over the whole bundle returns **exactly two** hits — the definition and `Item.as:714` inside `getDesc()`. `StatsManager.as:1863-1903` confirms the binary cliff. |
| `condition-tier-thresholds` | HELD (+1) | `Item.as:712-746` and web `§1t17s0§.as:1004-1026` are line-for-line the same ladder; strings 387-392/639 resolved in `strings.json` and match. The web build adds one branch the Android build lacks (`§1t17s0§.as:1027-1035`, `getString(11496)`, an id absent from the Android table). |
| `affix-suffix-pool-and-counts` | HELD (1 correction) | I counted the arrays programmatically: **13 prefix pools / 13 suffix pools, 104 + 104 strings.** Distributions and `if(isLegendaryItem && numEnchant > 2) numEnchant--;` (`:371-374`) verified verbatim. **Correction:** the elemental-DEF pool reuse at `:142-145` is *not* an obvious "shipped bug" — it is a consistent counter-element cycle (FIREDEF←water, WATERDEF←wind, WINDDEF←earth, EARTHDEF←fire), i.e. armour that resists fire is named "Icy … of Ice". Copy it; don't "fix" it. |
| `stat-vs-level-curve` | HELD (2 corrections) | `itemdata.xml:7906-7915` and `:9925-9937` read verbatim. Parsed totals: **982 items; 158 rows carry `mindamage`; mindamage 1..81; maxdamage 2..108; minlvl range -4..79 — but only 122 of the 158 damage rows carry a `minlvl`** (155 rows repo-wide). `MAXINDEX=79` (`:58`); prog arrays at `:150-183` verified. **The `+10` spike is on prog1/prog2/prog3 only** — prog4 and prog5 get no `[MAXINDEX] += 10`. Also missing from the claim: `generateItem` jitters the input level first (`nodelvl += rng.rand(5) - 2`, or `nodelvl--` for legendary, `:385-392`). |
| `item-save-format-held` (PARTIAL) | HELD | `Item.as:6-16` and `:47-104` read; `MCSCharacter.as:348` mcsString counted — **12 pipe-separated fields**, colour sub-fields appended as `,80@<rgb>#81@<rgb>#`. PARTIAL scoping is correct: §6 line 351 still stands for server topology. |
| `paperdoll-is-13-slots-not-9` (PARTIAL) | HELD (1 correction) | `StatsManager.as:108` `Vector.<Item>(13)`, `:262-286` the 13 EQ_ ids, `:1765` the 11-arg `initMCS`. Frame: 9 boxes, confirmed by my own read. **Correction: 12 of 13 slots have a render path, not 11** — `StatsManager.as:3330-3332` routes `EQ_ACCESSORY1` to `setProp2()` (layer `PART_prop2 = 21`). Only `EQ_ACCESSORY2` never renders. Note also that `initMCS` does *not* re-apply prop2, so a full re-init drops the accessory art. |
| `rarity-is-derived-not-a-field` | HELD (under-claimed) | `Item.as:382-405`, `:417-451` and web `§1t17s0§.as:675-716` verified; my own parse of `itemdata.xml` reproduces **253 rows `<unique>1</unique>`, 116 rows `<unique>2</unique>`, 613 absent**, and `NetworkManager.as:1981` (`unique != 0`) + `ShopUI.as:332,541` (`unique == 0`) confirm the third state. **Under-claim:** the web build has a **fifth, higher-priority name class the Android build lacks** — `if(this.xp != null)` -> `#ff9900` (loot toast) / `#ff6600` (inventory), above `unique`. Eight colours, not six. |
| `weight-cap-is-a-base-not-a-cap` | HELD | `StatsManager.as:2298-2301` and `BankUI.as:264` read verbatim; 11 call sites of `getCarryingWeight()` confirm it is the live gate (`Obj_PathBush`, `Obj_DirectionSign`, `InteractUI:1730`, …). Frame "WEIGHT: 43 / 100" confirmed in my own read of the full frame. |
| `eq-comparison-frame-payload-identity` | HELD — best claim in the set | I read the tooltip directly: `DMG: 1 - 2 (EQ: 1 - 3)` with the `2` red, `WEIGHT: 1`, `BRANCH`, `LEVEL 1`. `itemdata.xml:7906-7915` = id 13002 / name 4041 / mindamage 1 / maxdamage 2 / weight 1; `strings.json["4041"] = "Branch"`. `compareValue` (`Item.as:759-773`) gives `#00A606` / `#FF0000`. Bonus: the `(EQ: …)` label is `getString(199) = "Eq"`. The equipped 1-3 weapon is id 13001 (mindamage 1, maxdamage 3) — the pickaxe in slot 5. |

Frame-vs-doc conflicts encountered: **none.** Where I could compare (9 boxes, tooltip
numbers, weight readout, 2-of-7 purple borders — border pixel sampled at RGB(144,102,203),
a real and common pixel in that crop) the frame and the payload agree. Said out loud as
required by the standing invariant.

---

## C. NEW — held evidence the survey did not bank

1. **Per-item-type affix eligibility matrix + forced first affix** (`ItemGenerator.as:397-455`).
   Eight 17-wide 0/1 gates, one per item type, e.g. `WEAPON = [1,1,1,1,1,1,0,1,1,1,1,0,0,0,0,1,1]`,
   `ARMOR = [1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1]`, `ACCESSORY = [1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1]`;
   and the first roll is forced — armour -> DEFENSE, weapon -> ATTACK, shoes -> SPEED, with
   that channel then zeroed out of the pool. This is the missing half of the affix system.
2. **Generic post-defense damage floor** (R-1) — hand it to the combat lane, not the item lane.
3. **Complete modifier-ID -> name table incl. elementals** (R-3).
4. **Border contract: 4 rarity types x 4 states = 16 named frames** (R-2).
5. **Web-only soul-infusion channels: defense delta + weight delta** (R-4).
6. **Art delivery model: external `shs3resource.swf` over HTTP; symbol-name fallback is dead code** (R-8).
7. **`stancerestriction` is dead data in both builds** (R-5) — delete it from the combat plan.
8. **Fifth name colour (`xp != null`, `#ff9900` / `#ff6600`) in web v0.717** (table above).
9. **17 placeholder icon symbols** (R-7) — the only genuine item-icon art debt.
10. **`partList` is 23 layers; shoulders/knees are dead constants** (table above).

## D. Score

The claim set is right about the big thing — all five listed blockers do resolve against
the payload, and four of them resolve as executable code. But R-1 alone would corrupt the
combat lane, R-4 would ship a broken crafting feature, and R-2/R-3/R-5 would each mis-wire
a subsystem. Net of the refutations *and* of the STILL_UNHELD I was able to close (R-6),
I would land this system at **72-75**, not 78 — the recoverable surface is if anything
larger than claimed, but the survey's own error rate on load-bearing formulas (4 of 20
claims materially wrong, 1 fatally) is the reason to hold the number down until the
corrections are folded in.
