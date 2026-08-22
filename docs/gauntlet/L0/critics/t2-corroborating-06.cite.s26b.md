# BLIND CRITIC — CITE LENS — packet `t2-corroborating-06` (48 claims, all judged)

Judged 48 / 48. Skipped: none. **8 refuted, 40 survive.**

Every verdict below rests on an artifact **I** opened this run. Where the packet gave a
line range I re-derived the line number with `grep -n` rather than trusting the range.
Where a claim carried a measured count I re-measured it from the source file.

---

## 1. The single biggest thing this review found: **the art blocker is DEAD**

Three claims in this packet ([8], [15], [40]) rest on the proposition that the five
XOR-obfuscated Android resource blobs cannot be opened, and therefore that the per-item
icon/art manifest "exists in no held artifact". **That is false, and the brief's own C1
already gave the recipe.**

`ResourceManager.as:200-217` is the whole cipher, verbatim:

```
internal static function decryptByteArray(source:ByteArray, key:int) : ByteArray
   ...
   for(var i:int = 3; i < 256; i++)
   {
      if(i % 11 == 0) { temp = int(ba[i]); ba[i] = ba[i + 256]; ba[i + 256] = temp; }
      ba[i] ^= key;
   }
```

and the key is per-file, taken from the **second character of the resource filename** —
`Mobile.as:352` / `ResourceManager.as:186`:

```
ba = ResourceManager.decryptByteArray(ba,ResourceManager.resourceFileNameArray[resourceIndex].charCodeAt(1));
```

with `ResourceManager.as:41`:

```
internal static var resourceFileNameArray:Array = ["shs3resource.swf","musicresource.swf","soundresource.swf","imageresource.swf","bgresource.swf"];
```

So keys are `'h'=104, 'u'=117, 'o'=111, 'm'=109, 'g'=103`. Only bytes 3..255 (plus the
`i%11==0` swap partners at `i+256`) are touched — which is exactly why `CWS` sits in the
clear at byte 0 and why a naive whole-file XOR scan finds "key 0" and then fails to
inflate. **That is the trap [8] fell into.**

Running the real algorithm over all five blobs:

```
115_Mobile_SHS3Resource.bin  key 104  hdr b'CWS\x11...'  INFLATE OK -> 1040849 bytes
113_Mobile_MusicResource.bin key 117  hdr b'CWS\x11...'  INFLATE OK -> 1402677 bytes
122_Mobile_SoundResource.bin key 111  hdr b'CWS\x11...'  INFLATE OK ->   29623 bytes
124_Mobile_ImageResource.bin key 109  hdr b'CWS\x11...'  INFLATE OK -> 1908229 bytes
120_Mobile_BGResource.bin    key 103  hdr b'CWS\x11...'  INFLATE OK -> 4412340 bytes
```

Five for five. CWS v17. (Key 111 on the sound blob reproduces C3's number independently,
which is a good sanity check on the method.)

Parsing the SymbolClass/ExportAssets tables out of the inflated `115` gives **1,912
exported symbols**, and the prefix census is the item art manifest itself:

```
lowarm 151 · pelvic 151 · stomach 151 · torso 151 · uparm 151 · item 112 · weapon 109 ·
hat 96 · calf 85 · crotch 85 · thigh 85 · skill 79 · hair 73 · prop 60 · mask 59 ·
foot 44 · foottop 44 · head 38 · hand 33 · neck 33 · backleg 12 · frontleg 12 · tail 9 ·
acc 8 · achievement 5 · *_horse_ / *_wolf_ creature sets
sample item*:   item0, item1, item009, item010, item2100, item2101, item2102, ...
sample acc*:    acc3000, acc3001, acc3002, acc3003, acc3004, acc3005, acc3006, acc3008
sample weapon*: weapon13000 ... weapon13056
```

Those are precisely the `getMCSComponent(partType, art)` names — `partType + art.toString()`
per `ResourceManager.as:245-248`. The `item####` and `acc####` families the packet calls
"still-unrecovered" are sitting in a held file.

**Consequence for the packet:** [8], [15] and [40] are refuted on their status claim.
[16], [38] and [39] state the same structural facts *correctly* and put the "blocker
stays open" line only in `lane_impact`, so I let them stand and flagged the lane note as
superseded rather than destroying six correct structural findings over one shared,
now-stale inference.

---

## 2. The eight refutations

### [8] `items-equipment/art-payload-is-a-named-external-swf` — REFUTED (fatal)
Cite resolves; `ResourceManager.as:41`, `:238-252`, `StatsManager.as:360` are all verbatim
correct, and the *headline* ("the art is an external `shs3resource.swf`") is right and now
proven right. But the lane instruction — *"all five blobs still fail zlib after the CWS
magic, so S0-5 stands"* — is false (§1 above) and is a verbatim repetition of the line
the brief's C3 declares dead. Salvage the first half, delete the second.

### [10] `items-equipment/border-is-four-tier-frame-labels` — REFUTED (material)
Asserts *"an 8-frame MovieClip label set — {normal,special,rare,unique} × {_default,_selected}"*
and instructs *"a builder needs eight border states"*. The same file it cites has four
suffixes, not two:
```
ShopItem.as:52   gotoAndStop(this.borderType + "_default");
ShopItem.as:116  gotoAndStop(this.borderType + "_selected");
ShopItem.as:283  gotoAndStop(this.borderType + "_selectedmouseover");
ShopItem.as:287  gotoAndStop(this.borderType + "_mouseover");
```
4 tiers × 4 suffixes = **16** frames. Its siblings [9] and [11] carry the right number; the
guidance in [10] would ship half the art.

### [14] `items-equipment/build-provenance-drift-in-ui-claims` — REFUTED (material)
The cite is a *fabricated grep result*. It claims
`grepped EQ_ACCESSORY1/EQ_ACCESSORY2/EQ_NECK/ring: zero hits` and its quote field says
`[no EQ_ACCESSORY / EQ_NECK / ring slot binding anywhere in the file]`. Reality:
```
InventoryUI.as:175  internal var SLOT_RING1:int = 6;
InventoryUI.as:179  internal var SLOT_RING2:int = 8;
InventoryUI.as:268  this.equippedSlots[this.SLOT_RING1] = this.equipAccessory1;
InventoryUI.as:269  this.equippedSlots[this.SLOT_RING2] = this.equipAccessory2;
InventoryUI.as:522  tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY1];
InventoryUI.as:530  tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY2];
```
Only `EQ_NECK` genuinely has zero hits. And the conclusion inverts: the Android UI renders
**exactly** the 9-box layout the frame shows, two ring boxes included — so the frame and
the v0.682 code *agree* here rather than being "demonstrably different". The surviving true
half ("no per-item LEVEL label in the Android UI") is already carried, with proper cites,
by [41] and [42].

### [15] `items-equipment/consumable-accessory-icon-families` — REFUTED (material)
Two independent errors. (a) Scope: it puts the icon-only art set at *"the ~824 non-weapon
rows"*. Measured, the `item`/`acc` namespaces cover bands `1`, `2000-2999` (99), `3000-3999`
(9) and `20000-29999` (79) = **187** rows; non-weapon is **805** (982 − 177 type-9), so
824 matches neither quantity. (b) It calls the set "still-unrecovered" and points at
`115_Mobile_SHS3Resource` as "encrypted, S0-5" — see §1. Its sibling [38] gives 187/19%
correctly.

### [36] `items-equipment/icon-art-is-a-separate-family` — REFUTED (material)
This is an **A1** claim, so the frame reading is the load-bearing part, and the frame
reading is mis-attributed. I opened `reference/frames/s21_weapon/t708.0.png` and cropped
`(170,240)-(870,1040)` at ×2 LANCZOS: the four empty paperdoll boxes do show an oni-mask
outline, a gauntlet pair and two ring outlines, exactly as described. But those are **not**
"four of the eleven `*DummyIcon` placeholder artworks". They are InventoryUI's own
empty-slot children:
```
InventoryUI.as:81   public var acc1Icon:MovieClip;
InventoryUI.as:95   public var maskIcon:MovieClip;
InventoryUI.as:103  public var glovesIcon:MovieClip;
InventoryUI.as:501  this.maskIcon.visible = true;      // fires when itemID == 0
InventoryUI.as:525  this.acc1Icon.visible = true;
```
The `*DummyIcon` classes are `[Embed(source="/_assets/assets.swf", symbol="symbol1281")]`
classes that `MCSItem` instantiates only when a **populated** slot's symbol lookup misses
(`MCSItem.as:232`). Two different placeholder systems; the frame shows the first, the claim
credits the second. (The A2 half of [36] — two icon namespaces, `item0` / `AccessoryDummyIcon`
miss cases — is true and is carried correctly by [16] and [39].)

### [40] `items-equipment/icon-symbol-families-still-unheld` — REFUTED (material)
Band arithmetic is exact (795 + 187 = 982, verified). The claim that sinks it is
*"item*/acc* art that exists in no held artifact"* — `reference/extracted/android/115_Mobile_SHS3Resource.bin`
is held and yields `item0…item2xxx`, `acc3000…acc3008`, `weapon13000…weapon13056` (§1).

### [44] `items-equipment/mcs-human-rig-is-23-layers` — REFUTED (minor)
Self-contradictory on the boundary index. It says *"a 23-deep addChild stack"* — which is
indices **0..22** — and in the same sentence assigns *"PART_prop3/l_shoulder/r_shoulder/
l_knee/r_knee (22-26)"* to the creature rig. `MCSCharacter.as:120` `partListLength = 22` and
`:141` `for(var i:int = 0; i <= this.partListLength; i++)` allocate index 22 on **every**
human. The correct boundary — human 0..22 ending at PART_prop3, creature-only 23..26 — is
stated properly by [4], [5], [32], [33], [34], [35] and [43], so nothing is lost.
(It is true that no human code path *reads* `PART_prop3`; only `MCSWolf.as:148` does. But
"only MCSWolf allocates" is the wrong word and it breaks the claim's own layer count.)

### [45] `items-equipment/mcs-partlist-is-23-layers` — REFUTED (material)
The cite is the refutation: it reads *"(grep for the four constants returns only their
declarations)"* and the text says the four are *"declared but never used anywhere in the
corpus"*. My grep:
```
$ grep -rn "PART_l_shoulder\|PART_r_shoulder\|PART_l_knee\|PART_r_knee" reference/decompiled/
  .../shs3_android/scripts/MCSCharacter.as:56,58,60,62      (declarations)
  .../shs3_android/scripts/MCSWolf.as:184  var r_frontleg1:MovieClip = partList[PART_r_shoulder];
  .../shs3_android/scripts/MCSWolf.as:188  var l_frontleg1:MovieClip = partList[PART_l_shoulder];
  .../shs3_android/scripts/MCSWolf.as:193  var r_backleg2:MovieClip  = partList[PART_r_knee];
  .../shs3_android/scripts/MCSWolf.as:197  var l_backleg2:MovieClip  = partList[PART_l_knee];
  (+ the identical four in shs3_android_payload/)
```
A cite that asserts a grep result the grep does not produce is mis-cited under Lens 1, and
the assertion is the exact opposite of what six of its own siblings establish. Its two
useful asides do hold — `StatsManager.as:3330 case EQ_ACCESSORY1: getPlayerMCS().setProp2(itemid);`
and `setArmor` reading 8 part containers (`torso, stomach, l_uparm, r_uparm, l_lowarm,
r_lowarm, pelvic, neck`) — but they belong to a claim that is not this one.

---

## 3. The three QUOTE_UNVERIFIED flags I cleared

The machine audit flagged five claims. Four are false alarms of one kind: an A1 visual
description or a `/`-joined composite quote can never be located as a literal substring.

* **[11]** and **[12]** — every code fragment is verbatim: `ShopItem.as:27` `internal var
  borderType:String = "normal";`, `:51-52`, `:283/:287/:295/:299`, and
  `GameEngine.as:568/:572` word-for-word. [11]'s frame census also reproduced **exactly**
  in my crop `(900,590)-(1640,960)` ×2 LANCZOS: 7 tiles = 2 purple-bordered + 1 darkened
  tile with an unchanged tan border + 4 plain tan. Both survive.
* **[24]** — every visual element is there in my full-frame read and the ×4 crop
  `(1320,240)-(1620,320)`: header `BRANCH`, `DMG: 1 - 2  (EQ: 1 - 3)` with the `2` in red,
  `WEIGHT: 1`, and a brown-hafted pickaxe in the weapon box. The payload identity is
  stronger than claimed — I parsed all 982 rows and **exactly one** has mindamage 1 /
  maxdamage 2: id 13002, name id 4041 → `strings.json["4041"] = "Branch"`, weight 1.
  id 13022 → name 4244 → "Pickaxe", 1-3, weight 10. Survives.
* **[41]** and **[42]** — `LEVEL 1` is plainly on screen under the Branch tile. I traced
  the formula myself: `XMLItem.as:130 this.levelrestriction = xml.minlvl;` with
  `itemdata.xml:7911 <minlvl>-4</minlvl>`; `Item.as:274-299 getLevel()` with zero modifiers
  gives `maxlevel = 0`, then `if(lvl < baselevel)` is `0 < -4` = false, so it returns **0**;
  and both render sites (`Item.as:1102`, `:1300`) are gated on `itemlevel > 0`. I also ran
  the field census: `grep -n "itemPanel\." InventoryUI.as` yields exactly
  `selectItem, selectItemName, selectItemAttribute, chatbutton` (+ `visible`,
  `add/removeEventListener`) — **no level field**. Both survive.
  **THE FRAME WINS, and I am saying so out loud:** the caption is on screen in web v0.717
  and no Android v0.682 formula produces it. Do not port `getLevel()` into that panel.

The fifth, **[25]**, is `UNCHECKABLE / NO_CITE_STILL_UNHELD` — an honest STILL_UNHELD with
no cite. Its two factual sub-claims are true (`minlvl -4`; no `<levelrestriction>` tag
anywhere in `itemdata.xml`), it asserts nothing into the ledger, and the brief says
STILL_UNHELD is a respected answer. Not refuted — but it is fully subsumed by [41]/[42],
which carry cites, so admit those and drop this one as a duplicate.

---

## 4. Measurements I reproduced first-hand (all exact)

| Claim | Assertion | My measurement |
|---|---|---|
| [2] | 303 non-zero `<heavenlyprice>`, 300 write `<baseprice>0</baseprice>`, 11037 the only `.` | **exact** (982 items parsed) |
| [7] | 146 `<art>` rows, 68 distinct, max 20052 | **exact** |
| [18][19] | `<uses>` on 115 of 982, values {50,60,80,100}, no `<durability>` tag | **exact** |
| [23][46] | 412 modifier rows, 34 distinct ids, 47 in 0-16, 344 in 101-1999, 19 rows / 11 unnamed ids | **exact** |
| [26] | ids 103-106 = 82% of modifier rows | 338/412 = **82.0%** |
| [26] | strings 507-510 / 871-876 | `Fire/Wind/Water/Earth ATK`, `Fire/Wind/Water/Earth DEF`, `Critical Damage`, `Piercing Damage` — **exact** |
| [28] | `damageObj.getMinDamage()` appears in 9 files | **exactly 9** |
| [32] | six `setChildIndex`, zero `swapChildren`, none on top-level partList | **exact** (`:683,:706,:724,:755,:873,:885` — all on `head`/`l_calf`/`r_calf`) |
| [37] | band census 99/9/152/35/73/98/38/60/14/93/55/177/79 | **exact**, sums to 982, 0 unaccounted |
| [38][39] | 187 rows (19%); 11 `*DummyIcon` classes | **exact** — 11 distinct: Accessory, Achievement, Armor, Consumable, Gloves, Hat, Invalid, Mask, Pants, Shoes, Weapon |
| [1] | `find -iname "*shs3_en*"` empty; `Slaughter` / `of Attack` = 0 in payload.xml | **exact** |

On **[23]/[46]**: both correctly *exclude* id 82 from the "unnamed" set even though it also
falls outside `XMLItem`'s switch — `Item.as:12 public static var USESMODID:int = 82;` gives
it a name. Twelve ids / 21 rows hit `trace("ErrorValue")`; eleven ids / 19 rows are
genuinely nameless. The claims are right and the distinction is deliberate.

On **[21]** I let it stand but two things in it are loose and should not be transcribed:
"the element that counters it" describes a 4-**cycle** (fire→water→wind→earth→fire), not a
pairwise counter-pairing; and "32 of the 104 affix names" should be 32 of 136 PreSuf pairs
(17 channels × 8 tiers). The mapping itself — `ItemGenerator.as:142-145` — is verbatim
correct in all three of [20], [21], [22], and copying it verbatim is the right instruction
regardless of whether "deliberate" is provable (it is not; intent is not in the artifact,
the systematic permutation is).

On **[2]** the `build` field reads `both (schema parity proven)`. Under **C2** that is
ungrounded — `reference/extracted/itemdata.xml` is an Android-side file and there is no
web-side `<itemdata>` root to diff against. The finding survives on its facts; **record it
as `android v0.682` and strip the parity parenthetical.**

---

## 5. What [0] was missing, and where I found it

[0] pins the web stance gate on "the documented Focus >= 48 gate" — a pointer to a document,
not an artifact. The Android half is exact (`MCSPlayer.as:239 this.maxreload = 5 * 24;`,
`:2977 if(this.reload < this.maxreload / 6)`) and `§1t99s0§.as:249 this.§1t4415s0§ = 8 * 24;`
is exact. I located the missing half myself:

```
§1t99s0§.as:3043  public function §1t4469s0§() : Boolean          <- canChangeStance, same actionState shape as MCSPlayer.as:2965
§1t99s0§.as:3050  return this.§1t4469s0§() && this.§1t4414s0§ >= 48;
§1t99s0§.as:3058  public function §1t4472s0§() : *                 <- nextStance, same stance rotation
§1t99s0§.as:3060  if(this.§1t4414s0§ < 48) { return; }
```

48 / 192 = **1/4** on web v0.717 against 20 / 120 = **1/6** on Android v0.682. The claim
survives and is now fully artifact-backed on both sides.

---

## 6. New findings (nobody in this packet claimed them)

1. **All five XOR'd resource SWFs decrypt and inflate; `shs3resource.swf` holds 1,912
   symbols.** Kills the art blocker outright. Method + output in §1.
2. **`GameEngine.as:564` — "Tip: A green border indicates that an item is special."**
   A *third* border-colour tip, four lines above the blue one. Nobody in this packet cites
   it, and it completes the ladder that [9]/[10]/[11]/[12] argue for from two tips only.
3. **The full name/border colour key**, `Item.as:417-434`: unique `#b048f8`, rare `#0080ff`,
   special `#1eff00`, normal `#FFFFFF` — and a second, darker palette on the non-loot path
   starting `Item.as:437` with unique `#6600cc`. Two palettes, not one.
4. **`MCSWolf`'s partList is 49 entries, not 26.** `MCSWolf.as:11 super();` runs first and
   pushes the inherited 23; only then does `:13 partListLength = 25;` and `:14 for(i = 0;
   i <= partListLength; i++)` push **26 more**. Indices 23-26 therefore land in the second
   batch. Every packet claim that says "MCSWolf raises partListLength to 25" is right about
   the field and wrong-by-omission about the list. It also means
   `MCSCharacter.as:246 for(i = partListLength - 1; i >= 0; i--)` walks only 24..0 on a wolf.
5. **The web stance gate is artifact-backed**, `§1t99s0§.as:3050` and `:3060` — see §5.

---

## 7. Bottom line for the ledger

Admit: [0]-[7], [9], [11]-[13], [16]-[35], [37]-[39], [41]-[43], [46], [47] — 40 claims.
Reject: [8], [10], [14], [15], [36], [40], [44], [45] — 8 claims.
Amend on admission: strip "(schema parity proven)" from [2]; strip the "blocker stays
open" lane note from [16], [38], [39]; strip "the element that counters it" and "32 of
the 104" from [21]; fold [25] into [41]/[42].
