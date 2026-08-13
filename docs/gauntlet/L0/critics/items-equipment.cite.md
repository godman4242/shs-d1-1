# CITE-LENS REVIEW — unit `items-equipment`

Critic: blind (surveyor reasoning not seen). Every verdict below was reached by opening the
artifact myself. §0 law applied: cite must resolve, quote must appear, claim must not
out-run what the artifact says.

**Headline: 15 of 19 claims survive. 4 are refuted — one FATALLY.**
The fatal one is `string-table-partial`: **the item-name string table is HELD, not unheld.**
The surveyor keyed the XLIFF on the wrong attribute.

---

## FATAL — claim `items-equipment/string-table-partial` is REFUTED

The surveyor extracted the right file and then read the wrong column.

Each `<trans-unit>` in char-id 118 carries **two** attributes — a sequential `id` (0…2554)
and a **`resname`**, which is the key the game actually looks up. The surveyor matched on
`id`, found item name ids 4000+ "above the slice", and declared names unheld.

Verbatim, from my own decode of char-id 118 of
`reference/decrypted/shs3_android_payload_decoded.swf` (inflate at offset 8 → parse tag
code 87 → 500,024 B UTF-16LE):

```
<trans-unit id="988" resname="4048"><source>Katar</source></trans-unit>
<trans-unit id="989" resname="4049"><source>Training Sword</source></trans-unit>
<trans-unit id="990" resname="4050"><source>Iron Sword</source></trans-unit>
```

`reference/extracted/itemdata.xml:8743-8745` — item 13113 — carries `<name>4050</name>`.
**4050 → "Iron Sword".** And `reference/frames/zFtCaTO0_1M/seg-17/frames/frame_0024.jpg`
(the surveyor's own A1) reads **"DRAFTY SHARP IRON SWORD OF PIERCING"**. Payload row →
string table → live frame, all three agree.

### Proof that `resname` is the key, not `id`

`ItemGenerator.as:91` builds `colorNameList` from `LangManager.getString(432…442)` and
`ItemGenerator.as:701` matches it against an 11-entry `colorhexlist`
`[16711680, 16737792, 16763904, 39168, 13311, 6684927, 16751103, 6697728, 16777215, 10066329, 0]`
— i.e. eleven **colours**.

| key 432…442 | by `resname` | by `id` |
|---|---|---|
| 432 | Red | Town |
| 433 | Orange | City |
| 434 | Yellow | Castle Town |
| 435 | Green | Town Prosperity |
| 436 | Blue | (初段) |
| … | … | … |
| 442 | Black | (七段) |

`resname` yields exactly the eleven colours the hex list needs. `id` yields nonsense.
`LangManager.getString` → `Locale.loadStringEx(num.toString(), language)`
(`LangManager.as:73-79`); Flash's `fl.lang.Locale` keys XLIFF by `resname`.

### Coverage measured, not estimated

| file | tag | resolved |
|---|---|---|
| itemdata.xml | `<name>` | **804 / 804** |
| itemdata.xml | `<desc>` | **178 / 178** |
| npcdata.xml | `<name>` | **490 / 490** |
| skilldata.xml | `<desc>` | **201 / 201** |
| skilldata.xml | `<displayname>` | **73 / 73** |

Cross-check: char-id 121 `premiumdata` comments `<!-- Assassin outfit -->` over items
2130/7034/4065/11036/12018 → resnames resolve to **Assassin Outfit / Assassin Hood /
Assassin Robes / Assassin Pants / Assassin Boots**. Independent corroboration.

**This overturns the standing GAUNTLET §2.1 blocker for items, skills AND npcs**, not just
this unit. It also invalidates score-rationale bullet (a) — item names are portable today.

---

## REFUTED — `items-equipment/type-is-slot-index` (material)

Cite resolves (`Item.as:841`, `:845` verbatim), but the claim out-runs it. There are
**three disjoint type-code spaces** in this build:

1. `itemdata.xml <type>` 0-12 (what the claim reads),
2. `ItemGenerator.getItemType()` (`ItemGenerator.as:254-291`) — `13xxx→0`, `4xxx→1`,
   `5xxx→2`, `6-7xxx→5`, `8-9xxx→6`, `10-11xxx→3`, `12xxx→4`, `3xxx→7`,
3. the `InventoryUI` slot remap where a `<type>9</type>` weapon becomes `tempValue 13`
   (`InventoryUI.as:1195-1197`; `CraftingUI.as:508` keys weapons on `designType == 13`).

And `<type>` is **not** the equipment index for 187 of 982 items:
`EQ_SCABBARD = 10` but type 10 is consumables (98 items); `EQ_ACCESSORY2 = 12` but type 12
is quest items (80). The AS3 special-cases exactly those two (`Item.as:845`,
`Item.as:891`) because indexing `equipment[10]` with a consumable is meaningless. The
scabbard slot is actually filled with **item 13100, `<type>9</type>`**
(`StatsManager.as:735`). Accessories (type 11) route to slot 11 **or** 12 at runtime
(`InventoryUI.as:1203-1226`).

The lane_impact — "item→slot routing for the whole catalogue is a lookup" — would ship a
port that files potions into the scabbard.

Also imprecise: the 152 4xxx rows do not "carry type 0". They carry **no `<type>` tag at
all**; `XMLItem.as:72-77` defaults `this.type = 0`. Same for the single 7xxx anomaly. A
naive XML port gets `undefined`, not `0`. (Surveyor also missed a second anomaly: item
2211 sits in the 2xxx band with `<type>12</type>`.)

---

## REFUTED — `items-equipment/pot-mask-frame-confirmed` (material)

I opened the frame. `reference/frames/zFtCaTO0_1M/seg-17/frames/frame_0031.jpg`
(1024×576), crop (575,140)-(1015,420), 3× LANCZOS: everything the surveyor describes is
visibly there — green border, green "PANTS", "OWNED: 0", "LEVEL 4", DEFENSE +1 (EQ: 3) in
red, FIRE DEF +1 (EQ: 0) and WIND DEF +2 (EQ: 0) in green, EARTH DEF / CRITICAL DAMAGE /
MAX CHI / CHI REGEN all 0 with EQ values, WEIGHT: 5 clipped at the crop edge. (They also
missed a "450" gold price on the icon.)

**But the frame cannot confirm a mask.** `Item.as:891-898`:

```
modArrayCheck = equippedItem.getModifierArray().concat(this.getModifierArray());
modArrayCheck.sortOn("modifierID");
```

The tooltip iterates the **union of the candidate item's and the equipped item's
modifiers**. A stat absent from the list is absent from *both items* — it says nothing
about what the slot *allows*. Proof from the same frame: the PANTS mask
`[1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0]` sets indices 0-6, so it **allows** MAX HP, HP REGEN,
ATTACK and SPEED on pants — and none of those four appear in the frame either.

Frame and code do not conflict here, so the frame-wins invariant is not triggered. The
frame is *consistent with* the mask; it does not *confirm* it. This is an inference dressed
as a citation.

---

## REFUTED — `items-equipment/modifier-id-semantics` (material)

The cite is exact — `XMLItem.as:231-298` is verbatim — and every string resolution the
surveyor gives is correct (I checked all 22 against the table: 110 HP · 111 Max HP ·
112 HP Regen · 113 Chi · 114 Max Chi · 115 Chi Regen · 116 Attack · 117 Defense ·
118 Speed · 119 XP · 120 "Level " · 63 Coins · 64 Gold · 102 AP · 121 Max AP ·
59 Duel Tokens · 122 Max Duel Tokens · 123 Set · 124 Level Required ·
125 Stance Restriction · 108 Dmg · 109 Def). Credit where due.

What is refuted is **"fully decoded end-to-end"** and **"all 412 `<modifier>` blocks … now
readable"**. My own parse of `reference/extracted/itemdata.xml`: 412 blocks, 34 distinct
ids —

```
0 1 2 3 5 6 7 8 9 12 13 15 | 25 38 78 79 82 84 90 96 97 98 99 | 101 102 103 104 105 106 117 122 123 124 | 40000
```

**Twelve** of those 34 (25, 38, 78, 79, 82, 84, 90, 96, 97, 98, 99, 40000 — 21 blocks) fall
outside *both* declared ranges and land in `XMLItem.as:293-297`'s
`trace("ErrorValue: " + …)` branch. They are not readable under the claimed enum.

Worse, the enum is the wrong shape. Generated items store modifiers under **StatsManager
`STAT_*` ids** (`ItemGenerator.as:583-637`), and those run to `STAT_FIREATK = 28` …
`STAT_EARTHATK = 31` and `STAT_FIREDEF = 200` … `STAT_PIERCINGDMG = 205`
(`StatsManager.as:226-261`) — plus `getStat(1009)` for carry weight, which the surveyor's
own claim 13 relies on. The modifier-id space **is** the stat-id space. The elemental
DEF / CRITICAL DAMAGE lines the surveyor read off frame_0031 are exactly the family their
enum omits (resnames 851 Fire DEF · 852 Wind DEF · 853 Water DEF · 854 Earth DEF ·
855 Critical Damage · 856 Piercing Damage). A porter following this claim silently drops
every elemental affix.

---

## HELD — with corrections worth carrying

| claim | verdict | correction |
|---|---|---|
| `paperdoll-13-slots` | **HELD** | `Vector.<Item>(13)` at `StatsManager.as:108` and EQ_* 0-12 at `:262-286` are verbatim. But the *stat* rollup excludes **four** slots, not three — `StatsManager.as:1945` also drops `EQ_HAIR` (and `EQ_WEAPON` when `skipWeapon`). Only the *weight* rollup (`:2002`) excludes exactly HEAD/NECK/SCABBARD. |
| `affix-suffix-pool` | **HELD** | Verbatim at `ItemGenerator.as:102-148`. The opposing-element borrow (FIREDEF←wateratk, WINDDEF←earthatk, WATERDEF←windatk, EARTHDEF←fireatk) is exactly as stated. 17 pools × 8 tiers, `num = floor(i/10)` over `MAXINDEX = 79`. |
| `affix-count-rule` | **HELD** | Dice tables verbatim at `:206-252`; legendary decrement at `:371-373`. |
| `stat-vs-level-curve` | **HELD** | Progressions `:150-182` verbatim. Note `prog4` and `prog5` do **not** get the `[MAXINDEX] += 10` bump — only prog1/2/3 do. prog→stat routing confirmed line-by-line: prog1 `:462-474`, prog4 `:492-494`, prog2 `:512-515`, prog3 `:533-545`, prog5 `:563-565`. |
| `condition-no-damage-multiplier` | **HELD** | `getMinDamage` `:1863-1888` and `getDamageRange` `:1890-1902` confirm damage is binary on `isBroken()` (`Item.as:1467-1478`). Correction: **seven** display bands, not six — and they are now nameable: 639 "Unbreakable", 392 "Condition: Well-Maintained", 387 "Condition: Broken" (red), 388 "Poor", 389 "Used", 390 "Usable", 391 "Good". |
| `sell-price-formula` | **HELD (PARTIAL is right)** | All cites resolve; `grep -rn sellPercentage` over all 970 `.as` files returns the single declaration at `ShopUI.as:58` — I reproduced it. `onSell` (`ShopUI.as:539-540`) pays `getCost()` at full value. Footnote: `gvalue` = `<baseprice>` (`XMLItem.as:88`) but **defaults to 1** when absent (`:92`) — only 550 of 982 items carry a `<baseprice>`. |
| `art-manifest-rule` | **HELD (PARTIAL is right)** | All 12 sprite dirs exist. `XMLItem.as:110-117` (`this.art = this.id`) is exact to the line. I **independently reproduced the decode failure** on char-ids 115 (654,169 B) and 120 (4,204,635 B) — both `CWS`-headered, both fail zlib and raw-deflate. The stuck-stop was correct. Correction: `MCSItem.as` has **18** partTypes and `neck` is **not** among them (it is `MCSCharacter`'s, `:806`); the surveyor's parenthetical lists 19 names. The true union across both classes is **20** — add `prop`. |
| `compositing-part-order` | **HELD (PARTIAL is right)** | 27-part enum verbatim; `mcsString` at `:348` verbatim; hair/hat exclusion at `:374` verbatim. Cite nit: the `[Embed]` is at line **6**, not 5, and `PART_r_knee` is at **62**, outside the stated `:5-60`. |
| `rarity-4-tiers-exact` | **HELD** | Eight hex colours verbatim at `Item.as:416-450`. `<unique>`: 369 rows, `{1: 253, 2: 116}` — confirmed by my own parse. |
| `name-template-frame-confirmed` | **HELD** | I opened frame_0024.jpg, crop (0,420)-(640,500) 3×: "I AM LOOKING FOR" white, "DRAFTY SHARP IRON SWORD OF PIERCING" bright blue, " ." — exactly as described. Decomposition confirmed against `ItemGenerator.as:744-746` (case 3 = `pre(mod2) + pre(mod0) + basename + suf(mod1)`) and the forced-first ATTACK at `:439-443`. **Correction:** "index 16, allowed ONLY by the WEAPON mask" is false — the ARMOR mask `:401-404` and the ACCESSORY mask `:425-428` both set index 16. It is barred on gloves/shoes/mask/pants/hat only. **Bonus:** the basename is no longer frame-only — resname 4050 = "Iron Sword" (see FATAL above). |
| `weight-cap-is-not-flat-100` | **HELD** | `:2298-2300` and `:1983-2025` verbatim. `<weight>`: 745 rows, range 0-500 — confirmed. |
| `soul-infusion-transfer-rule` | **HELD** | `CraftingUI.as:506-527` verbatim; modifier 6 = "Attack" per the table. |
| `weapon-slash-budget-and-reach` | **HELD** | Formula verbatim at `:1915-1921`; `slashusage` default 48 at `XMLItem.as:158`; `itemdata.xml:8742-8752` is exactly item 13113. My own parse confirms every count: slashusage `{72:70, 96:35, 24:1}` = 106; stancerestriction `{6:46, 4:7}` = 53; uses `{100:46, 80:34, 60:34, 50:1}` = 115. Nit: **"in px" is an inference** — the AS3 never names a unit. Flash stage units make it a good inference, but the ledger blocker says "px" and the code does not. |
| `premium-catalog-held` | **HELD** | I dumped char-id 121 myself: 4,504 B, `<premiumdata>` with `<default>`, a commented-out `<special>`, and `<rotation>` sets headed `<!-- Assassin outfit -->` / `<!-- Dark Assassin outfit -->` / `<!-- Santa outfit -->` / `<!-- Ichigo outfit -->`. Quote is verbatim. `<heavenlyprice>`: 304 rows, values {0,1,2,3,5,8,12,25,100} — confirmed. |
| `no-items-config-still-true` | **HELD** | `ls src/config/` matches the quote exactly (27 `.ts` + `CLAUDE.md`); no `items.ts` / `equipment.ts` / `affixes.ts`. The A3 self-caveat ("a repo byte-check, NOT a vitest test") is exactly the right kind of honesty. |

Every `ledger_text` quote checked against `docs/research/REBUILD_READINESS.md` — lines 209,
210, 129, 352 — all verbatim. No fabricated ledger text.

---

## SCORE

The surveyor's 84 was **held down by a mistake**, not inflated by one. Their single largest
open item — item names — is closed, and closed by the very file they extracted. Against
that, three claims over-read their artifacts (type→slot, the frame-as-mask-proof, and the
modifier enum's completeness). Those are porting hazards, not research gaps.

Net: the evidence supports a **higher** score than 84 on names, and a **narrower** one on
the modifier enum. I would not move the number far — call it a wash — but §4 blocker ⑤ and
the L1b string-table lane both need rewriting on the strength of the `resname` finding.

## NO FILES TOUCHED

Read-only pass. Only this file was written. `src/core/Sim.ts` and
`tests/duel-baseline.test.ts` untouched (§4).
