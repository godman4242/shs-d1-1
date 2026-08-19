# CITE-LENS CRITIC — items-equipment

Lens: over-claiming. Every cite below was opened by me, first-hand. Frame crops were
re-cut and re-read by me at the stated boxes (§0: the fighter is ~270 px tall in a
1080p frame — crop before grading).

**Headline:** this is an unusually precise survey. 16 of 18 non-UNHELD line-number
ranges land *exactly* on the construct they name — I spot-checked every one and found
no fabricated cite, no phantom file, no misquoted line. Two claims are nonetheless
**materially wrong**, and both would push a builder in the wrong direction:

- `condition-has-no-damage-multiplier` … survives (correct).
- `no-separate-icon-manifest` … **REFUTED** — a second icon symbol family exists.
- `defense-min-floor-is-wrong` … **REFUTED** — the ledger bullet is right; the
  surveyor cited the wrong call site.
- `purple-border-is-unique-not-rarity` … **REFUTED** — the adjacent tip string
  disproves the framing.

Plus one STILL_UNHELD I was able to close outright.

---

## 1. REFUTED (material) — `items-equipment/no-separate-icon-manifest`

**Claim:** "the inventory icon is composed from the SAME MCS part symbols as the
paperdoll … there is no separate icon art set to recover."

**What I opened.** `MCSItem.as` in full, not just the cited `:324-349`.
The cited `setArmor` block is verbatim accurate. But `MCSItem` has **eleven**
setters, and two of them do NOT reach for paperdoll parts:

```
MCSItem.as:203  public function setConsumable(id:int) : *
MCSItem.as:206     this.displayItem = this.getMCSComponent("item",id);
MCSItem.as:209        this.displayItem = new item0();
MCSItem.as:228     this.displayItem = this.getMCSComponent("acc",id);   // setAccessory
```

`"item"` and `"acc"` are **icon-only symbol families**. No `MCSCharacter.PART_*`
index consumes them; they never appear in `setArmor` / `setPants` / `setHead` /
`setWeapon`. They are exactly the "item icon manifest" the ledger names.

**How much of the roster.** `ShopItem.as:134-198` dispatches by ID band, first-hand:

```
ShopItem.as:145   else if(itemID < 3000 && itemID > 1999)  → setConsumable
ShopItem.as:149   else if(itemID < 4000 && itemID > 2999)  → setAccessory
ShopItem.as:191   else if(itemID < 30000 && itemID >= 20000) → setConsumable
```

I re-parsed `reference/extracted/itemdata.xml` myself: band 2000-2999 = **99** rows,
band 20000-29999 = **79** rows, band 3000-3999 = **9** rows. **187 of 982 items
(19%) render from a symbol family with no paperdoll equivalent.**

**And it is not recovered.** In the web payload:

```
$ ls reference/decompiled/shs3_payload/scripts | grep -cE '^item[0-9]'   → 1   (item0.as, the fallback)
$ ls reference/decompiled/shs3_payload/scripts | grep -cE '^acc[0-9]'    → 0
```

So blocker ⑤'s icon half is **partially still open**, not a category error. The
surveyor's own claim 20 (`per-item-art-payload-unknown`) is the honest answer here
and claim 2 contradicts it.

**Bonus defect found in the same dispatch:** `ShopItem.as:177` reads
`else if(!(this.itemID < 11000 && this.itemID > 9999))` — the **neck band
10000-10999 (14 items) is deliberately excluded from icon dispatch entirely.**

---

## 2. REFUTED (material) — `items-equipment/defense-min-floor-is-wrong`

**Claim:** the ledger's `defense min-floor (EnemyLevel/4)` is "wrong in both variable
and shape … keyed to playerLVL … and it lives in boss auto-scaling, not the generic
defense pipeline."

**The generic pipeline has exactly this floor.** `Damage.as:150-172`:

```
Damage.as:150   public function getMinDamage() : int
Damage.as:162      if(this.attackerlvl <= 10)   return 1 + this.piercingDamage;
Damage.as:166      if(this.attackerlvl <= 20)   return this.attackerlvl / 8 + this.piercingDamage;
Damage.as:170      if(this.attackerlvl <= 30)   return this.attackerlvl / 6 + this.piercingDamage;
Damage.as:172      return this.attackerlvl / 4 + this.piercingDamage;
```

**Applied post-defense**, in the hit path, `MCSPlayer.as:3415-3419`:

```
damage -= this.getDefense();
if(damage < damageObj.getMinDamage())
{
   damage = damageObj.getMinDamage();
}
```

**And `attackerlvl` is the ATTACKER's level, i.e. the enemy's** when an enemy hits
the player — constructed at the strike site:

```
EnemyWolf.as:296        target.checkHitObject(..., new Damage(damage,level));
EnemyFox.as:169         target.checkHitObject(..., new Damage(damage,level));
EnemyNianMonster.as:295 target.checkHitObject(..., new Damage(damage,level));
EnemyJiangSi.as:206     target.checkHitObject(mcs, new Damage(damage,level));
```

So for enemy→player above L30 the post-defense floor **is** `EnemyLevel / 4` —
precisely what the ledger records. The block the surveyor cited
(`EnemyPlayer.as:107-123`) is a *different* site: its output feeds
`bossHP = playerhit * hitsToKillBoss` two lines later (`EnemyPlayer.as:124`) — it is
boss HP auto-scaling that happens to reuse the same four-band shape.

The ledger bullet is **incomplete** (it omits the three lower bands and the
`+piercingDamage` term), not **wrong**. Publishing "the ledger is wrong, this is
boss-only" would send L1/L2 in the opposite direction from the code.

---

## 3. REFUTED (material) — `items-equipment/purple-border-is-unique-not-rarity`

The quoted tip at `GameEngine.as:572` is verbatim correct. But I read the four lines
above it:

```
GameEngine.as:568   str = "Tip: A blue border indicates that an item is rare.";
GameEngine.as:572   str = "Tip: A purple border indicates that an item is unique.";
```

Borders encode the **rarity ladder**, not a separate unique axis — and "unique" IS
one of the four tiers `getShopItemType()` returns (`Item.as:382-405`:
`"unique" / "rare" / "special" / "normal"`). The claim's own lane_impact —
*"prevents mis-wiring the border colour to the 4-tier rarity ladder; border tracks
`<unique>`, text colour tracks the 4 tiers"* — would make a builder **drop the blue
rare border** that the game ships.

The frame half of the claim is correct: my crop of `t708.0.png` at
(900,590)-(1640,960) x2 shows 7 inventory icons, of which exactly **2 carry a purple
border** (the blue sword, the white feather).

---

## 4. CLOSED — the STILL_UNHELD `ui-slot-mapping-unknown` is resolvable

The surveyor honestly scoped this to "the AS3 I read". It is in the AS3 they didn't:

```
InventoryUI.as:163   internal var SLOT_HAT:int    = 0;
InventoryUI.as:165   internal var SLOT_MASK:int   = 1;
InventoryUI.as:167   internal var SLOT_ARMOR:int  = 2;
InventoryUI.as:169   internal var SLOT_GLOVES:int = 3;
InventoryUI.as:171   internal var SLOT_PANTS:int  = 4;
InventoryUI.as:173   internal var SLOT_WEAPON:int = 5;
InventoryUI.as:175   internal var SLOT_RING1:int  = 6;
InventoryUI.as:177   internal var SLOT_SHOES:int  = 7;
InventoryUI.as:179   internal var SLOT_RING2:int  = 8;
```

and `refreshEquipment()` — `InventoryUI.as:459` `for(var i:int = 0; i < 9; i++)` —
binds each box to its model slot (`:472, :482, :490, :498, :506, :510, :518, :522,
:530`):

| UI box | SLOT_ | EQ_ |
|---|---|---|
| hat | SLOT_HAT 0 | EQ_HAT |
| mask | SLOT_MASK 1 | EQ_MASK |
| armor | SLOT_ARMOR 2 | EQ_ARMOR |
| gloves | SLOT_GLOVES 3 | EQ_GLOVES |
| pants | SLOT_PANTS 4 | EQ_PANTS |
| weapon | SLOT_WEAPON 5 | EQ_WEAPON |
| **ring-left** | **SLOT_RING1 6** | **EQ_ACCESSORY1** |
| shoes | SLOT_SHOES 7 | EQ_SHOES |
| **ring-right** | **SLOT_RING2 8** | **EQ_ACCESSORY2** |

**Neither ring is EQ_NECK.** The SLOT_ index order matches my crop of `t708.0.png`
at (170,240)-(870,1040) x2 in exact reading order. The 4 model slots with no UI box
are **EQ_HAIR, EQ_HEAD, EQ_NECK, EQ_SCABBARD** — claim 11 names only three of the
four (it omits NECK).

---

## 5. Held, with precision notes

Everything below survived. Cite ranges I re-derived line-by-line and confirmed exact:

- `Item.as:1582-1593` getSellAmt and `§1t17s0§.as:1977-1988` — **byte-for-byte the
  same function in both builds.** Best cite in the set.
- `§1t17s0§.as:1011,1015,1019` (<25 / <50 / <75) and `:683,687,691,704,708,712`
  (the six rarity hexes) — every single obfuscated-file line number lands on the
  stated construct. I verified all nine individually.
- `ItemGenerator.as:102-127` — 13 pool pairs × 8 = **104 prefixes / 104 suffixes**,
  counted. `:128-148` assignment loop, `:371-374` legendary `numEnchant--`, all exact.
  `MAXINDEX = 79` at `:58`. `getMaxTier` at `:321-346`. prog1..prog5 at `:150-183`.
- `itemdata.xml` — I re-parsed it: **982 items · 158 rows with `<mindamage>`, all
  `<type>9</type>` · minlvl −4..79 · mindamage 1..81 · maxdamage 2..108 ·
  slashusage 106 rows / exactly {24, 72, 96} · stancerestriction 53 rows / {4, 6} ·
  412 `<modifier>` · unique 369 rows = 253×`1` + 116×`2`.** Every number the survey
  states reproduces.
- `strings.json` — all 29 ids I sampled (59, 63, 64, 102, 108-125, 387-392, 639, 698)
  resolve to exactly the text claimed.
- `StatsManager.as:1863-1902` (binary broken/not-broken damage cliff), `:1915-1919`
  (reach), `:1921-1930` (slash usage), `:2298-2301` (carrying weight), `:108`,
  `:262-286`, `:1765` — all exact.
- **`getCondition()` really is called once.** My own recursive grep over the whole
  `shs3_android` tree returns only `Item.as:1481` (definition) and `Item.as:714`
  (inside `getDesc`). Claim 5 holds.
- **Frame reads I re-cut and confirmed with my own eyes:** exactly 9 paperdoll boxes
  in the stated fill states; `DMG: 1 - 2 (EQ: 1 - 3)` with the 2 in red and
  `WEIGHT: 1`; `WEIGHT: 43 / 100`.

### Precision notes (none refuting)

1. **`armor=7` is 8.** `setArmor` drives torso, stomach, l_uparm, r_uparm, l_lowarm,
   r_lowarm, pelvic **and neck** (`MCSCharacter.as:1071`, conditional on the symbol
   existing). `pants=5` is exact.
2. **27 declared, 23 allocated for humanoids.** `MCSCharacter.as:120`
   `partListLength:int = 22`, and `:141` `for(i = 0; i <= partListLength; i++)` →
   23 clips. Indices 23-26 (`l_shoulder`, `r_shoulder`, `l_knee`, `r_knee`) are only
   reached by creature rigs — `MCSWolf.as:13` sets `partListLength = 25` and rebuilds.
   A builder copying "27 z-order layers" for the samurai overshoots by four.
3. **The "shipped bug" is probably deliberate.** `ItemGenerator.as:142-145` maps
   FIREDEF→water pools, WINDDEF→earth, WATERDEF→wind, EARTHDEF→fire. That is a
   consistent opposing-element rotation, not a paste error. Do not "fix" it, and do
   not label it a bug in the config.
4. **The +10 spike is on prog1/prog2/prog3 only.** `ItemGenerator.as:157, :164, :171`.
   prog4 (`:172-177`) and prog5 (`:178-183`) have no `+= 10`.
5. **Only 122 of the 158 weapon rows carry `<minlvl>`** — 36 have none. "Complete
   L−4..L79 ladder" is 36 rows short of complete.
6. **"BRANCH" and "LEVEL 1" are not inside the cited crop.** In the 1920px frame they
   sit at x ≈ 1030-1150; the cited box starts at x = 1320. They ARE in the frame — I
   confirmed both at (1250,120)-(1780,420) x3 and on the full-frame downscale — so
   this is crop-box imprecision, not a fabricated observation.
7. **"six tier colours" but eight are quoted**, and the web build carries a fifth
   inventory colour the Android branch lacks: `§1t17s0§.as:700` `#ff6600` for
   `this.xp != null`. Worth carrying into L5.
8. **Sell price: the ledger's "rarity" half was already right.** Modifier count IS
   the rarity determinant (`Item.as:382-405`: ≥3 → rare, >0 → special). Only the
   "level" half of `REBUILD_READINESS.md:168` is refuted.
9. **`getEnchantmentCount` header is at `:205`,** not `:206` (the cite points at the
   opening brace). Immaterial.

---

## 6. Verdict on the score

42 → 78 is defensible on volume, but two of the five "blockers resolved" are
overstated: blocker ⑤'s icon-manifest half is **partly still open** (187/982 items,
§1 above), and two of the four "ledger is wrong" corrections do not survive (§2, §3).
A score in the low-to-mid 70s is better supported. The `STILL_UNHELD` pair
(claims 19, 20) were the most honest items in the set — one of which I closed
outright, and the other of which I independently confirmed is genuinely open.
