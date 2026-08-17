# CITE-LENS CRITIC — unit: items-equipment

Blind review. I did not see the surveyor's reasoning. For every claim below I opened
the cited artifact myself; every verdict carries the artifact **I** opened.

**Headline:** this is a strong survey. 17 of 19 claims resolve to real artifacts at
the stated line numbers, and several quotes are byte-exact. **2 claims are refuted**
— one on a backwards inference (`purple-border-is-unique-not-rarity`), one on a
mis-cite that points at a render string and calls it a save format
(`item-save-format-held`). Nine more carry minor over-claims worth correcting before
they enter the ledger.

Recommended score: **74** rather than 78 (−4 for the two material errors; the five
blockers really do resolve, so the bulk of the lift is earned).

---

## REFUTED — material

### R1. `items-equipment/purple-border-is-unique-not-rarity` — REFUTED
**My cite:** `reference/decompiled/shs3_android/scripts/ShopItem.as:51-52` and
`reference/decompiled/shs3_android/scripts/GameEngine.as:564,568,572`

The cited line exists and says what the claim quotes. The problem is that the file
disproves the claim's conclusion **four lines above the cited line**:

```
GameEngine.as:564   str = "Tip: A green border indicates that an item is special.";
GameEngine.as:568   str = "Tip: A blue border indicates that an item is rare.";
GameEngine.as:572   str = "Tip: A purple border indicates that an item is unique.";
```

And the wiring is explicit:

```
ShopItem.as:51   this.borderType = itemRef.getShopItemType();
ShopItem.as:52   gotoAndStop(this.borderType + "_default");
```

The border **frame label is literally the 4-tier rarity string** returned by
`getShopItemType()` — the same function that drives the text colour. The claim's
lane_impact ("prevents mis-wiring the border colour to the 4-tier rarity ladder;
border tracks `<unique>`, text colour tracks the 4 tiers") is exactly backwards:
border and text colour are the *same* channel.

Second error in the same claim: "unique" is not the `<unique>` XML flag. Per
`Item.as:389`, the unique tier fires on
`itemxml.unique == 1 || isPickableQuestItem() || isTradeQuestItem || isPlayerNamed()`.
A player-named item with `<unique>0</unique>` gets a purple border.

The **frame half is fine** — I re-cropped `reference/frames/s21_weapon/t708.0.png`
at (900,590)-(1640,960) upscaled ×2 and confirm exactly 2 of 7 inventory icons
(blue sword, white feather) carry a purple border. It is the inference on top that
is wrong.

### R2. `items-equipment/item-save-format-held` — REFUTED (equipment half)
**My cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:4417-4445`
and `reference/decompiled/shs3_android/scripts/MCSCharacter.as:618`

The `Item.parse` half is correct and verified (`Item.as:47-104`, constants at
`Item.as:6-16` — PCOLORMODID 80 / SCOLORMODID 81 / USESMODID 82 / NAMEMODID 89 /
CREATORMODID 125 all exact).

The equipment half is a mis-cite. `MCSCharacter.as:348` `mcsString` is **not** the
equipment save format — it is the character *appearance* string, returned only by
`getMCSString()` at `MCSCharacter.as:618`. It has 12 fields, includes `propid` and
`prop2id` (not equipment slots), and **omits scabbard and both accessories**.

The real equipment serialization is:

```
StatsManager.as:4417  public static function getEquipmentString() : String
StatsManager.as:4420     var max:int = int(equipment.length);        // 13
StatsManager.as:4425     str += equipment[i].toStringNoQty() + "|";
StatsManager.as:4435  public static function parseEquipmentString(str:String) : *
StatsManager.as:4438     var strArray:Array = str.split("|");
StatsManager.as:4442     equipment.push(Item.parseNoQty(strArray[i]));
```

i.e. a **13**-field pipe-joined list of `Item.toStringNoQty()` records
(`Item.as:229-259`), carrying modifiers, colours, uses, name and creator per slot.
A builder copying `:348` as the equipment schema loses the scabbard, both accessory
slots, and every per-slot modifier, and gains two prop fields that are not equipment.

The claim's PARTIAL verdict and its overturn of §6 (`REBUILD_READINESS.md:351`,
quote verified verbatim) survive — but with the correct cite.

---

## SURVIVES — with corrections (minor)

| # | claim | correction |
|---|---|---|
| C1 | `sprite-compositing-contract-held` | `partListLength = 22` (`MCSCharacter.as:120`) and the loop is `i <= partListLength` (`:141`) → **23** MovieClips exist, but 27 constants are declared. `PART_l_shoulder(23) / PART_r_shoulder(24) / PART_l_knee(25) / PART_r_knee(26)` index past the end. Also armor drives **8** parts, not 7 — `neck` is added conditionally at `:1071-1088` (no default class). |
| C2 | `sell-price-formula` | Formula shape confirmed in both builds. But its *input* is not: Android `getWeight()` is `weight * getQuantity()` (`Item.as:1564-1579`); web is `(weight + §1t478s0§) * §1t484s0§()` (`§1t17s0§.as:1958-1973`). The `>= 10` test is a **stack**-weight test, not an item-weight test. |
| C3 | `sell-price-corrects-section3-item9` | The "level" half of `REBUILD_READINESS.md:168` is genuinely refuted. The "rarity" half is **correct** — rarity *is* modifier count (`Item.as:396-403`). Present it as a half-correction, not a full one. |
| C4 | `affix-suffix-pool-and-counts` | `RNG.as:72-75` — `rand(num) = Math.floor(rnd() * num)` → 0..num-1. So `rand(11)`'s trailing `return 0` at `ItemGenerator.as:251` is **unreachable dead code**: a rare item never rolls 0 affixes. Also the elemental-DEF cross-wiring (`:142-145`) is a clean counter-element cycle (fire-DEF←water words, wind-DEF←earth, water-DEF←wind, earth-DEF←fire); calling it "the shipped bug" is an unsupported reading. |
| C5 | `stat-vs-level-curve` | Only **122 of the 158** `<mindamage>` rows carry `<minlvl>` (measured this run), so "complete 158-row ladder" overstates. The `+10` spike hits `prog1/prog2/prog3` only (`ItemGenerator.as:157,165,173`) — `prog4` and `prog5` have none. |
| C6 | `paperdoll-is-13-slots-not-9` | 13 − 9 = **4** model slots absent from the UI, not 3. The claim names hair, head, scabbard and omits **NECK**. `StatsManager.as:1765` passes NECK to `initMCS` but never ACCESSORY1/ACCESSORY2 — so the two ring boxes are the accessories, and NECK is the un-boxed one. |
| C7 | `rarity-is-derived-not-a-field` | Says "six tier colours"; its own quote lists **eight** (all eight verified in web at `§1t17s0§.as:683,687,691,695,704,708,712,716`). And "removes the S0-3 Android-parity caveat" is **wrong** — see N4 below. |
| C8 | `modifier-id-stat-table` | "Fully resolved" overstates. 11 of the 34 distinct modifier ids present in `itemdata.xml` — **25, 38, 78, 79, 84, 90, 96, 97, 98, 99, 40000** (19 of 412 rows, measured) — fall outside both the 0..16 switch and the 101..1999 Set band, so they hit `XMLItem.as:293` `trace("ErrorValue: ...")` and stay unnamed. |
| C9 | `slashusage-stancerestriction-omitted` | No correction — I re-counted from the XML and it is exact (106 rows {24,72,96}; 53 rows {4,6}). Listed here only to record that I verified it independently rather than trusting the index. |

---

## CLEAN — opened, exact, no correction

`no-separate-icon-manifest` (`MCSItem.as:324-349`, offsets verbatim) ·
`condition-has-no-damage-multiplier` (`Item.as:1481`, sole call site `:714`;
`StatsManager.as:1862-1902`) · `condition-tier-thresholds` (all 7 branches + all 7
string ids checked against `strings.json`) · `soul-infusion-is-code`
(`CraftingUI.as:494-525` verbatim; string 698 = "Both items must be of the same
type") · `defense-min-floor-is-wrong` (`EnemyPlayer.as:107-123` verbatim; ledger
quote at `REBUILD_READINESS.md:209` verbatim) · `weight-cap-is-a-base-not-a-cap`
(`StatsManager.as:2298-2301`, `BankUI.as:264`; I re-cropped the frame and read
"WEIGHT: 43 / 100") · `eq-comparison-frame-payload-identity` (best claim in the set
— see N6) · both STILL_UNHELDs are honest and correctly refused.

---

## NEW FINDINGS

**N1 — the border IS the rarity ladder.** `ShopItem.as:51-52` + `GameEngine.as:564,568`.
Basis for R1. One channel, four frame labels: `normal_default` / `special_default` /
`rare_default` / `unique_default`.

**N2 — the equipment save format is a 13-field pipe string of Item records.**
`StatsManager.as:4417-4445`. Basis for R2.

**N3 — blocker ② is dead in BOTH builds, not just Android.** `grep -n "§1t536s0§"`
over `reference/decompiled/shs3_payload/scripts/§1t17s0§.as` returns exactly two
hits: the definition at `:1868` and one call at `:995`, inside `getDesc`. The web
v0.717 build has no condition→damage multiplier either. This **closes the S0-3
build-parity caveat** for blocker ② that the surveyor left open.

**N4 — the web build has a FIFTH item-colour state Android lacks.**
`§1t17s0§.as:679` `#ff9900` (loot toast) and `:700` `#ff6600` (inventory), both
gated on `this.xp != null`. `grep -c "ff9900\|ff6600"` over the Android `Item.as`
returns 0. So colour parity between builds is **not** clean, contra C7.

**N5 — 23 render slots, 27 constants.** `MCSCharacter.as:120,141`. See C1.

**N6 — the frame's EQUIPPED weapon resolves too.** The surveyor matched the hovered
item (Branch → `itemdata.xml:7906-7915`, id 13002, name 4041 → "Branch", 1-2, wt 1).
The equipped one also resolves: **id 13022 "Pickaxe", mindamage 1, maxdamage 3,
weight 10** — matching both the pickaxe visible in the weapon box and the on-screen
"(EQ: 1 - 3)". I confirmed the crop myself at (1320,240)-(1620,320) ×4: "DMG: 1 - 2
(EQ: 1 - 3)" with the 2 in red, "WEIGHT: 1". Two independent frame→payload identities
in one screenshot.

**N7 — the residual art blocker is now quantified.** Both `shs3_payload/scripts/`
and `shs3_android/scripts/` export exactly **21** MCS part classes: `calf11000
crotch11000 foot12000 foottop12000 hair6000 hair6001 hand5000 hat7000 head8000
head8004 lowarm4000 mask9000 neck10000 pelvic4000 prop13000 stomach4000 thigh11000
torso4000 uparm4000 weapon13000 weapon13002`. That is the naked defaults plus three
extras. The per-item art for the 982-row roster is **confirmed absent from both
decompiled script exports** — so it is obfuscated elsewhere in the SWF or inside the
S0-5 encrypted CWS blobs. `per-item-art-payload-unknown` stays STILL_UNHELD, but the
gap is now 21-of-982, not unbounded.

**N8 — 11 modifier ids stay unnamed.** See C8.

---

## Method note

No frame/doc disagreement arose in this unit. Every frame I opened
(`reference/frames/s21_weapon/t708.0.png`, 1920×1080, four crops at ×2 and ×4)
**agreed** with the payload — including two exact item identities. Where the survey
went wrong, it went wrong against *code*, not against a frame.

No file outside this path was modified.
