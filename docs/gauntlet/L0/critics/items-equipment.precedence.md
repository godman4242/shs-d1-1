# items-equipment — LENS 3 (PRECEDENCE) critic review

Reviewer: blind critic, run 3. I did not see the surveyor's reasoning — only its claim
list and the artifacts. Every verdict below carries an artifact **I opened myself**.

**Headline: 3 of 19 claims refuted. Two of the three are precedence failures of exactly
the kind this lens hunts — the surveyor cited a weak/derivative artifact when a stronger
one sat feet away in the same file or the same call graph.**

Overall the survey is unusually honest: the A1 frame cites are real and reproduce
verbatim, the payload counts I re-derived all match, and the two STILL_UNHELD answers are
correct answers, not laziness. The refutations are concentrated in the L5/L6 (UI + art)
claims, where the surveyor generalised from one function without reading its neighbours.

---

## REFUTED — 3

### R1 · `purple-border-is-unique-not-rarity` — **FATAL** (precedence failure)

The surveyor cited `GameEngine.as:572`, a randomised loading-tip string, for the border
contract. The executable path settles it directly, and contradicts the claim:

```
ShopItem.as:27   internal var borderType:String = "normal";
ShopItem.as:51   this.borderType = itemRef.getShopItemType();
ShopItem.as:248  gotoAndStop(this.borderType + "_default");
ShopItem.as:280  gotoAndStop(this.borderType + "_selectedmouseover");
ShopItem.as:293  gotoAndStop(this.borderType + "_selected");
```

`getShopItemType()` is the **4-tier ladder** the surveyor itself documented in
`rarity-is-derived-not-a-field` — it returns `"unique" | "rare" | "special" | "normal"`
(`Item.as:382-405`). The slot border is a MovieClip whose frame label is
`borderType + state`. So the border is wired to the whole rarity ladder; purple is simply
its `unique` branch.

Worse, the surveyor's own cited function contains the disproof **three lines above the
line it quoted**:

```
GameEngine.as:568   str = "Tip: A blue border indicates that an item is rare.";
GameEngine.as:572   str = "Tip: A purple border indicates that an item is unique.";
```

The claim's lane_impact — *"prevents mis-wiring the border colour to the 4-tier rarity
ladder; border tracks `<unique>`, text colour tracks the 4 tiers"* — is exactly backwards.
Both the border and the text colour are driven by the same derived tier. A builder
following this claim ships a UI with no blue rare border.

What survives: purple *does* mean unique. Nothing else in the claim does.

---

### R2 · `no-separate-icon-manifest` — **FATAL**

The surveyor read `MCSItem.setArmor` (`MCSItem.as:324-349`) and generalised "the icon IS
the paperdoll part stack" to the whole roster. That holds for the nine wearable slots. It
is false for the majority of the item table, and the counter-evidence is 120 lines *above*
the cited function in the same file:

```
MCSItem.as:203  public function setConsumable(id:int) : * {
MCSItem.as:206     this.displayItem = this.getMCSComponent("item",id);
MCSItem.as:209     if(this.displayItem == null) { this.displayItem = new item0(); ... }

MCSItem.as:226  public function setAccessory(id:int) : * {
MCSItem.as:229     this.displayItem = this.getMCSComponent("acc",id);
MCSItem.as:232     if(this.displayItem == null) { this.displayItem = new AccessoryDummyIcon(); ... }
```

`item####` and `acc####` are **icon-only symbol families with no paperdoll counterpart**.
There is no `PART_` index for a consumable or an accessory — the doll never renders a rice
ball or a ring. The web payload confirms the family exists by exporting its default:
`reference/decompiled/shs3_payload/scripts/item0.as`.

Scale, counted this run from `reference/extracted/itemdata.xml` (982 `<item>` rows):

| type | rows |
|---|---|
| 9 (weapons) | 177 |
| everything else (1-8, 10-12, untyped) | 805 |
| rows carrying `<art>` | 146 |

And the Android build ships **eleven** dummy-icon classes, not one — including
`ConsumableDummyIcon` and `InvalidDummyIcon`, which the claim never mentions:
`AccessoryDummyIcon, AchievementDummyIcon, ArmorDummyIcon, ConsumableDummyIcon,
GlovesDummyIcon, HatDummyIcon, InvalidDummyIcon, MaskDummyIcon, PantsDummyIcon,
ShoesDummyIcon, WeaponDummyIcon`.

The lane_impact — *"one art pipeline, not two … no icon-authoring pass is needed"* — is the
dangerous part. A builder following it ships a game where ~800 of 982 items have no icon.
Blocker ⑤'s "item icon manifest" half is **not** a category error; it is still open, and
it is now precisely scoped: recover or author the `item####` / `acc####` families.

---

### R3 · `defense-min-floor-is-wrong` — **MATERIAL** (precedence failure)

The surveyor cited `EnemyPlayer.as:107-123` and concluded the ledger's Ready bullet
*"defense min-floor (EnemyLevel/4)"* is *"wrong in both variable and shape … it lives in
boss auto-scaling, not the generic defense pipeline."*

There **is** a generic defense pipeline, and it carries the same floor. The surveyor cited
a derivative copy:

```
Damage.as:53   public function Damage(damage:int = 0, attackerlvl:int = 0, launchType:int = 0, ...)
Damage.as:149  public function getMinDamage() : int {
Damage.as:158     if(this.attackerlvl <= 10) { return 1 + this.piercingDamage; }
Damage.as:162     if(this.attackerlvl <= 20) { return this.attackerlvl / 8 + this.piercingDamage; }
Damage.as:166     if(this.attackerlvl <= 30) { return this.attackerlvl / 6 + this.piercingDamage; }
Damage.as:172     return this.attackerlvl / 4 + this.piercingDamage;
```

applied at the single place damage meets defense:

```
MCSPlayer.as:3415   damage -= this.getDefense();
MCSPlayer.as:3416   if(damage < damageObj.getMinDamage())
MCSPlayer.as:3418      damage = damageObj.getMinDamage();
```

and identically in `NPC.as:447`, `EnemyZombie.as:512`, `EnemyWolf.as:384`,
`EnemyShield.as:347`, `EnemyClone.as:222/443`, `EnemyJiangSi.as:304`,
`EnemyNianMonster.as:383`, `EnemyWolfAlpha.as:481`, `MCSPlayer.as:3710`.

The floor is keyed to **`attackerlvl`** — the attacker's `level`, passed at construction
(`MCSPlayer.as:1930  new Damage(this.slashDamage,level,0,this.stance)`). When an enemy
hits the player, the attacker **is** the enemy. So the ledger's "**Enemy**Level/4" names the
right variable, in the right pipeline, and gives the correct top band (attacker lvl > 30).

`EnemyPlayer.as:107-123` (and its clones in `EnemyElite.as:63`, `EnemyKanjiGuardian.as:88`,
`EnemySpearElite.as:107`, `EnemyWolfAlpha.as:109`) re-uses the same four-band shape in the
*opposite* direction — to invert-solve boss HP from the player's expected hit. It is a copy
of the rule, not the rule.

Correct verdict on the ledger bullet: **incomplete, not wrong**. It should read
`floor = 1 (atkLvl≤10) / atkLvl÷8 (≤20) / atkLvl÷6 (≤30) / atkLvl÷4, plus piercingDamage`.
The surveyor's guidance — *"implementing 'EnemyLevel/4' as written produces different
numbers at every level band below 30"* — is true only because three bands are missing, not
because the variable or the shape is wrong. Deleting the ledger bullet as "not an
item/defense rule" would lose a correct entry.

---

### R4 · `sprite-compositing-contract-held` — **MATERIAL** (headline number wrong)

The 27 `PART_*` constants are real. The render stack is **23**, not 27:

```
MCSCharacter.as:120   internal var partListLength:int = 22;
MCSCharacter.as:141   for(var i:int = 0; i <= this.partListLength; i++) { mc = new MovieClip(); addChild(mc); this.partList.push(mc); }
```

`i = 0..22` → 23 entries, indices 0..22. `PART_prop3 = 22` is the last one backed by a
MovieClip. **`PART_l_shoulder(23)`, `PART_r_shoulder(24)`, `PART_l_knee(25)`,
`PART_r_knee(26)` do not exist on a human character** — `partList[23]` is out of range on
`MCSCharacter`.

Those four are quadruped-only, and their names lie:

```
MCSWolf.as:6     public class MCSWolf extends MCSCharacter
MCSWolf.as:12-18 super(); partListLength = 25; for(i=0; i<=25; i++) { ... partList.push(mc); }
MCSWolf.as:184   var r_frontleg1:MovieClip = partList[PART_r_shoulder];
MCSWolf.as:188   var l_frontleg1:MovieClip = partList[PART_l_shoulder];
MCSWolf.as:193   var r_backleg2:MovieClip  = partList[PART_r_knee];
MCSWolf.as:197   var l_backleg2:MovieClip  = partList[PART_l_knee];
```

Blocker ⑤ is about the **equipment paperdoll**. For that, the z-order table is
0..22 = 23 layers. A builder coding the claimed "27-entry z-ordered PART_* enum" as the
equipment stack authors four phantom layers and gets the wolf's legs.

**What survives, and it is the important part:** index *is* the addChild z-order; the
symbol contract really is `partType + <art>` with a `partType + "0"` fallback
(`MCSCharacter.as:582-611`); one slot really does drive many parts (`setArmor` touches
torso, stomach, l_uparm, r_uparm, l_lowarm, r_lowarm, pelvic + conditionally neck —
`MCSCharacter.as:915-1085`); and all 17 named default part classes the surveyor listed do
exist in the web payload — I checked every one. Only the count and the "27 directly
codeable" guidance are wrong.

---

## HELD — 15, each re-opened

| claim | own cite I opened | note |
|---|---|---|
| `sell-price-formula` | `Item.as:1582-1593` + `§1t17s0§.as:1977-1988` | Formula body byte-identical in both builds. **But its input is not** — see N1. |
| `sell-price-corrects-section3-item9` | `Item.as:1582-1593`, `:307-309`, `:47-104` | Holds. `getModifierCount()` = `modifiers.length`; colour/name/creator go to dedicated *fields* in `parse`, so they can't inflate it. **§3's "rarity" half actually survives** — see N2. |
| `condition-has-no-damage-multiplier` | `Item.as:714` + `§1t17s0§.as:995` (grepped **both** builds for every call site) | Holds, and *stronger* than claimed: `getCondition` / `§1t536s0§` has exactly **one** call site in each build. Cross-build confirmed. |
| `condition-tier-thresholds` | `Item.as:712-746`, `§1t17s0§.as:995-1037`, `strings.json` 387-392/639 | Ladder and all 7 strings confirmed. **The two builds are not identical here** — see N3. |
| `affix-suffix-pool-and-counts` | `ItemGenerator.as:102-148, 206-249, 371-374` | 13 pools × 8 = 104 each, verbatim. Distributions exact. **"Shipped bug" characterisation is unsupported** — see N4. |
| `stat-vs-level-curve` | `itemdata.xml:7906-7915, 9925-9937`; `ItemGenerator.as:58, 150-183, 321-347` | I re-derived every number: 158 damage rows, minlvl −4..79, mindamage 1..81, maxdamage 2..108, `MAXINDEX = 79`. All match. Two precision notes in N5. |
| `item-save-format-held` (PARTIAL) | `Item.as:6-16, 47-104`; `MCSCharacter.as:348` | Verbatim. PARTIAL is the right call. **Four more reserved IDs exist** — see N6. |
| `soul-infusion-is-code` | `CraftingUI.as:494-525` | Verbatim, including the `floor(id/1000)` gate and the modifier-6 damage delta. |
| `paperdoll-is-13-slots-not-9` (PARTIAL) | **the frame itself**, `s21_weapon/t708.0.png` crop (170,240)-(870,1040) ×2 LANCZOS; `StatsManager.as:108, 262-286, 1765` | I counted the boxes myself: 2+2+2+3 = **9**. Code side: `Vector.<Item>(13)`, 13 `EQ_` constants, `initMCS` receives 11. Fully confirmed. Frame and doc genuinely do not disagree. |
| `rarity-is-derived-not-a-field` | `Item.as:382-405, 417-451`; counted `<unique>` myself | 6 hexes verbatim. `<unique>`: **253 rows = 1, 116 rows = 2** — surveyor's count exact, and the `2` third state is real. |
| `weight-cap-is-a-base-not-a-cap` | `StatsManager.as:2298-2301`, `BankUI.as:264`, + **my own crop** (1400,540)-(1780,600) ×4 | Crop reads `WEIGHT: 43 / 100`. Both formulas verbatim. |
| `eq-comparison-frame-payload-identity` | **my own crop** (1320,240)-(1620,320) ×4; `itemdata.xml:7906-7915`; `Item.as:759-770` | Crop reads `DMG: 1 - 2 (EQ: 1 - 3)` with the 2 in red, `WEIGHT: 1`, `BRANCH`, `LEVEL 1`. And I checked uniqueness: **13002 is the only row in all 982** with mindamage 1 / maxdamage 2 / weight 1. The identity is exact *and* unique. One unexplained field — N7. |
| `modifier-id-stat-table` | `XMLItem.as:231-298` + `strings.json` | Verbatim, all 17 cases + the 101-1999 Set band. |
| `slashusage-stancerestriction-omitted` | `itemdata.xml` counted myself; `StatsManager.as:1915-1930` | `slashusage`: 106 rows, `{72:70, 96:35, 24:1}`. `stancerestriction`: 53 rows, `{6:46, 4:7}`. Reach formula verbatim. **The `24` is dead** — N8. |
| `ui-slot-mapping-unknown` (STILL_UNHELD) | my paperdoll crop + `StatsManager.as:262-286` | Correct and honest. The two ring boxes are pixel-identical outlines, and the Android `InventoryUI` has no accessory-slot binding at all. Do not penalise. |
| `per-item-art-payload-unknown` (STILL_UNHELD) | `itemdata.xml` (146 of 982 rows carry `<art>`); web payload exports only default part classes + `item0` | Correct and honest. Consistent with what I found independently. |

---

## NEW FINDINGS the surveyor missed

**N1 — the sell formula is cross-build identical; its *input* is not.**
`Item.getWeight()` differs between builds. Android (`Item.as:1560-1580`) returns the raw
`weight`; web v0.717 (`§1t17s0§.as:1974`) returns `(this.weight + <bonus>) * <multiplier>()`.
`getSellAmt` branches on `getWeight() >= 10`, so the *same item* can land on opposite sides
of the 5×/10× step in the two builds. Label the formula CONTRACT, the weight input INFERRED
until the web `getWeight` is decoded. (Bonus: Android's `getWeight` multiplies by quantity
on the cached path but not the first-call path — a shipped inconsistency.)

**N2 — §3 correction #9 is half right, and the surviving half matters.**
§3 says sell price *"scales with rarity/level"*. The **level** half falls. The **rarity**
half is *correct by construction*: rarity is defined as modifier count
(`Item.getShopItemType`, `modifierCount >= 3` → rare, `> 0` → special), and sell price is
`(1 + modifierCount) × {5,10}`. Rarity and sell price are the same variable wearing two
names. Do not strike the whole §3 bullet.

**N3 — the web v0.717 condition block has a branch the Android build does not, and its
string is unrecoverable from S0-3.**
`§1t17s0§.as:1028-1037` appends `getString(11496)` after the 7-state ladder. Id `11496` is
**absent** from `docs/gauntlet/L0/index/strings.json` (2,533 entries — I checked). The
S0-3 table resolves the Android build; it does not cover every v0.717 string. Any claim
that the string table "closes" UI copy for the web build needs this caveat.

**N4 — the elemental-DEF pool reuse is almost certainly deliberate, not "the shipped bug".**
`ItemGenerator.as:142-145` maps FIRE_DEF←water pool, WIND_DEF←earth pool, WATER_DEF←wind
pool, EARTH_DEF←fire pool. That is a consistent opposition scheme (fire resistance named
"Icy … of Frost"), not a scramble. The surveyor's claim body is fine; the lane_impact's
"shipped bug" label is an unsupported reading and should not be ported as a bug.

**N5 — two precision slips inside a held claim.** (a) `minlvl` appears on only **122** of
the 177 type-9 rows (155 across all 982), not on all 158 damage-carrying rows — the ladder
has holes. (b) The `+10` end spike applies to **prog1, prog2 and prog3 only**
(`ItemGenerator.as:157, 164, 171`); prog4 and prog5 have no spike.

**N6 — four more reserved modifier IDs.** The surveyor names 80/81/82/(83)/89/125. But
`Item.copyModifiers` (`Item.as:317-330`) explicitly refuses to copy **85, 86, 87, 88** —
a distinct non-transferable band that soul-infusion silently drops. The surveyor's two
claims also disagree with each other on whether 83 is in the reserved set (five IDs in
`item-save-format-held`, six in `modifier-id-stat-table`).

**N7 — the frame's per-item `LEVEL 1` label has no source in the matched payload row.**
Row 13002 carries `minlvl -4` and no `<levelrestriction>`. The web UI nonetheless prints
`LEVEL 1`. The display rule (clamp? different field? different build's UI?) is
**STILL_UNHELD**, and it sits inside the survey's flagship frame→payload identity check.

**N8 — the `<slashusage>24</slashusage>` value is dead code.**
`StatsManager.getSlashUsage()` returns 48 whenever `itemdata.slashusage < 48`
(`StatsManager.as:1921-1930`). The single row carrying 24 can never take effect. The live
domain is `{48 default, 72, 96}`, not `{24, 72, 96}`.

**N9 — build-provenance drift running through the whole unit.** Every A1 frame here is the
**web v0.717** build; almost every A2 cite is **Android v0.682** (S0-3 caveat). That is fine
for data-XML rows, which match. It is *not* established for UI layout: the Android
`InventoryUI` has no accessory-slot binding and no per-item LEVEL label, so the 9-box
paperdoll in `t708.0.png` may not be the layout the cited Android UI code renders at all.
Any L5 claim that pairs a v0.717 frame with v0.682 UI code should say so explicitly. This
is what makes R1 and R2 worse than simple oversights — both are v0.682 UI code
generalised onto a v0.717 screenshot.

---

## Score comment

78 is defensible for the **data** half of this system and too generous for the **art** half.
Blocker ⑤ was scored as fully dead; R2 shows its icon-manifest half is open for ~800 of 982
rows, and R4 shows the compositing half ships with the wrong layer count. I would land this
at **70-72**: blockers ①③④ genuinely dead, ② genuinely dissolved, ⑤ half-dead.
