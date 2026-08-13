# CRITIC — items-equipment · LENS 4 (THE FRAME LENS)

Blind review. I did not see the surveyor's reasoning. Every verdict below carries an
artifact **I** opened myself. Crops are stated. Frames are 1024x576 (not 1080p) — the
surveyor stated that correctly and I confirmed it with `sips`.

**Bottom line:** the ActionScript half of this survey is unusually clean — I re-opened
15 of the 19 cites at the exact line numbers given and they are verbatim-accurate,
including four independent byte-size matches on binary blobs. But the two claims that
carry the most weight are wrong, and one of them is wrong in exactly the way this lens
exists to catch: **a UI claim graded from a code array while a frame of that UI was
sitting in `reference/frames/`.**

---

## FATAL — `items-equipment/paperdoll-13-slots` is REFUTED BY THE FRAME

**Claim:** "The paperdoll is 13 equipment slots, not the 9 the ledger claims."
Cited `StatsManager.as:108` — `new Vector.<Item>(13)`.

That line is real; I read it. But the surveyor never opened a frame of the equipment
screen, and one exists.

**My artifact:** `reference/frames/zFtCaTO0_1M/seg-13/frames/frame_0019.jpg`, 1024x576,
crop `(110,120)-(480,560)`, upscaled 2.6x LANCZOS. Independently re-checked on
`frame_0031.jpg` of the same segment, same crop at 2.4x.

Visibly in the crop — the PLAYER paperdoll, arranged around the character figure:

| row | left | centre | right |
|---|---|---|---|
| 1 | HAT (straw hat, filled) | — | MASK (empty, ghost oni mask) |
| 2 | ARMOR (grey robe, filled) | *character figure* | GLOVES (empty, ghost gauntlets) |
| 3 | PANTS (green border, filled) | *character figure* | WEAPON (katana, filled) |
| 4 | ACCESSORY (ring) | SHOES (sandals, filled) | ACCESSORY (ring) |

**Count: 9 slots. Not 13.** On `frame_0031.jpg` the left ring slot is filled with a gold
ring and the right is still an empty ghost — same 9-slot grid, different fill state, so
this is not a rendering accident of one frame.

The reconciliation is arithmetic, and it *confirms the ledger*: the AS3 `equipment`
Vector is an **internal** array of 13 that includes four entries which are not
user-facing paperdoll slots — `EQ_HAIR` (2), `EQ_HEAD` (4), `EQ_NECK` (6),
`EQ_SCABBARD` (10). 13 − 4 = 9, and the surviving nine are precisely
ARMOR · GLOVES · HAT · MASK · PANTS · SHOES · WEAPON · ACCESSORY1 · ACCESSORY2 —
exactly the nine tiles in the frame.

**Per §0's standing invariant: the measurement (an array length from the Android
decompile) and the frame disagree, and THE FRAME WINS.** The ledger's "9-slot
paperdoll" Ready bullet was right and must not be rewritten to 13. Neither should
GAUNTLET.md's L3 description.

Note also that the surveyor's own hedge is arithmetically broken: they wrote "Three of
the 13 (HEAD, NECK, SCABBARD) are excluded ... which is likely where '9' came from."
Three exclusions from thirteen is **ten**, not nine. The missing fourth is HAIR — and
the exclusion is a *UI* fact, not the weight-rollup fact they reached for
(`findWeight` skips exactly HEAD/NECK/SCABBARD, which is a different set of three).

---

## FATAL — `items-equipment/string-table-partial` is REFUTED: the item names are in the file

**Claim:** "every item name id (4000+) sits ABOVE that slice, so item names remain
unheld." Repeated in the score rationale as blocker (a).

I extracted char-id 118 from `reference/decrypted/shs3_android_payload_decoded.swf`
myself (SWF tag-87 walk after zlib-inflating the CWS body). It is **500,024 bytes**,
matching the surveyor's figure to the byte, and decodes as UTF-16LE XLIFF with
**2,555 `<trans-unit>` entries, ids 0–2554, contiguous** — all of that is correct.

Then I read it. Ids 980–1011 are a contiguous block of **English item base names**:

```
980 Stick     981 Branch    982 Bamboo    983 Flute   984 Spoon   985 Fork
986 Bat       987 Stick with nail         988 Katar   989 Training Sword
990 Iron Sword            991 Iron Sabre  992 Dragon Blade   993 Thunder Blade
994 Bevel Edge  995 Defender  996 Heavy Armor  997 Cleaver  998 Potion
999 Scroll   1000 Amulet   1001 Arrow   1002 Bullet  1003 Bomb  1004 Berry
1005 Broken Sandal ...
```
and further out `1063 Worn Sandals`, `1083 Sword Repair Kit`, `1085 Bronze Sword`,
`1100 Steel Sword`, `1190 Smudge Sword`, `1215 Gaius Sword`, `1307 Inokichi's Club (Broken)`.

**The surveyor's own cited frame contains one of these strings.**
`reference/frames/zFtCaTO0_1M/seg-17/frames/frame_0024.jpg`, crop `(0,420)-(640,500)`,
3x LANCZOS — I opened it and it reads, verbatim:

> I AM LOOKING FOR **DRAFTY SHARP IRON SWORD OF PIERCING** .

`IRON SWORD` is trans-unit **990**. The name they declared unheld is legible in the
frame they cited and legible in the table they extracted.

The falsification test they ran was `grep -c "Katana|Wakizashi|Tanto|Nodachi" = 0`.
I reproduced it — it is genuinely 0. But that is a test built from *what a samurai
game's swords ought to be called*, not from what the artifact shows. §0 forbids exactly
that move. The game's vocabulary is Iron / Bronze / Steel / Dragon / Thunder, and it
was one frame away.

Two smaller errors in the same claim:
- "**every** item name id sits above that slice" is a false universal. Of 804 `<name>`
  ids in `reference/extracted/itemdata.xml`, **74 are below 2555** — 68 items in the
  6xxx hair band all pointing at id 34 (`Hair`), items 2122/2123/2124 → 443/444/445
  (`(八段)` `(九段)` `(十段)`), and 3 in the 20xxx band.
- The mechanism claim is right and valuable: `XMLItem.as:64` is
  `this.displayname = LangManager.getString(xml.name);`, and `ItemGenerator.as:677`
  returns `itemXML.displayname` as the base name. So `<name>` → string table is
  confirmed. That part holds.

**The honest replacement statement:** the English string *content* is HELD (2,555
strings, including a large item-name block). What is **not** held is the
`<name>`-id → string *mapping*, because the Android table's id space stops at 2554
while the web `itemdata.xml` `<name>` ids reach 4427. That is a far smaller and far
more actionable blocker than "names are unheld", and it changes L1b's exit condition
again.

### New hazard the surveyor did not report: the two artifacts are from different builds

I found hard evidence of id-space drift, and it silently contaminates any
"resolved against the table" step above roughly id 200.

`Item.getDesc()` (both `shs3_android` and `shs3_android_payload` decompiles agree)
picks condition text from string ids 639, 392, 387, 388, 389, 390, 391. In the
extracted table those resolve to:

```
639 Mine Titanium Deposit          392 You are not supposed to be here!
387 Pick flower                    388 Game Paused
389 has joined the chat.           390 has left the chat.
391 Intruder!
```

Nonsense as condition labels. Meanwhile everything under ~200 aligns perfectly —
`108 Dmg`, `109 Def`, `110 HP`, `111 Max HP`, `116 Attack`, `117 Defense`,
`123 Set`, `124 Level Required`, `125 Stance Restriction`, and `199 Eq` (which is the
literal `(EQ:` label visible in the shop frame). So the two artifacts share a prefix
and diverge later. Any future ID resolution must state which build it is resolving in.

**Bonus, and it closes a ledger bullet:** the condition tier names the ledger lists as
"condition tier names" (unnumbered) are in the table at **368–373**, six of them:
`Condition: Broken` · `Condition: Poor` · `Condition: Used` · `Condition: Usable` ·
`Condition: Good` · `Condition: Well-Maintained`. The surveyor had this file open and
did not look.

---

## MATERIAL — `items-equipment/modifier-id-semantics` overstates "fully decoded"

The 0–16 mapping is correct; I resolved every one of those string ids in the table and
they came back `HP · Max HP · HP Regen · Chi · Max Chi · Chi Regen · Attack · Defense ·
Speed · XP · Level  · Coins · Gold · AP · Max AP · Duel Tokens · Max Duel Tokens`,
exactly as claimed. The `defense != 0` suppression of modifier 7 is real
(`XMLItem.as`, the `if(!(this.defense != 0 && ...id == 7))` guard).

But "**fully** decoded end-to-end" and "**all 412** `<modifier>` blocks ... are now
readable" are false. The switch's `default` branch only handles `100 < id < 2000`;
everything else falls through to `trace("ErrorValue: " + id)` and emits no text at all.
Counting `reference/extracted/itemdata.xml` myself:

```
UNDECODABLE ids -> {25:1, 38:6, 78:2, 79:2, 82:2, 84:2, 90:1, 96:1, 97:1, 98:1, 99:1, 40000:1}
blocks affected: 21 of 412   (decodable: 391)
```

And modifier id **83** is demonstrably load-bearing elsewhere — `Item.isBroken()` reads
`this.uses >= itemXML.durability + this.getModifierBonus(83)`, i.e. a durability bonus.
So ids above 16 carry real semantics this switch does not name. 391/412 is a good
result; it is not "fully decoded end-to-end".

---

## MATERIAL — `items-equipment/premium-catalog-held` mischaracterises what is in the file

The artifact checks out perfectly. I extracted char-id 121 myself: **4,504 bytes**,
matching to the byte, and the XML is verbatim as quoted — `<default>` opening
`2208 · 2209 · 2212`, a commented-out `<special>` block, then `<rotation>` with
`<!-- Assassin outfit -->` `2130 · 7034 · 4065 · 5008 · 11036 · 12018`. Verified.

What is wrong is the sentence "the **designers' own named** outfit sets". Reading
further into the same file, the rotation sets are:

```
Assassin · Dark Assassin · Santa · Ichigo · Zaraki · Byakuya · Hitsugaya · Mayuri ·
Komamura · Finn · Sasuke Taka · Obito · Madara · Itachi Akatsuki · Kakashi ...
```

Ichigo / Zaraki / Byakuya / Hitsugaya / Mayuri / Komamura are *Bleach*; Obito / Madara /
Itachi / Kakashi / Sasuke are *Naruto*; Finn is *Adventure Time*. These are third-party
character cosplay sets, not original design work. The project's own invariant is
explicit that "third-party assets ... are NOT covered" by the Lut Games grant, so the
lane_impact's recommendation — "the Gold-priced item economy is **reconstructible** from
premiumdata" — points a rebuild straight at other people's IP. The catalogue is on disk;
most of its rotation is not ours to reproduce. That needs flagging, not encouraging.

---

## The A1 work that HELD — and it held well

`items-equipment/pot-mask-frame-confirmed`. I re-cut the surveyor's exact crop:
`reference/frames/zFtCaTO0_1M/seg-17/frames/frame_0031.jpg`, `(575,140)-(1015,420)`,
3x LANCZOS. Every transcribed line is right, down to the digit tints:

```
PANTS (green name)      OWNED: 0      LEVEL 4
DEFENSE: +1(red)   (EQ: 3)      FIRE DEF: +1(green) (EQ: 0)
WIND DEF: +2(green)(EQ: 0)      EARTH DEF: 0(red)   (EQ: 1)
CRITICAL DAMAGE: 0(red) (EQ: 1) MAX CHI: 0(red)     (EQ: 5)
CHI REGEN: 0(red)  (EQ: 2)      WEIGHT: 5
```

and the tints match `Item.compareValue`'s `#00A606` / `#FF0000` on every single line.
I went one step further than the survey and checked what `EQ:` actually binds to —
`Item.as:843`, `var equippedItem:Item = StatsManager.equipment[itemType];` — it is the
**same-slot** equipped item, which is what makes this real corroboration rather than a
coincidence: the equipped PANTS carry CRIT DMG, EARTH DEF, MAX CHI and CHI REGEN, all
of which the code's PANTS mask `[1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0]` permits, and none
of the forbidden elemental-ATK / PIERCING lines appear. Independently, table id 199 is
literally `Eq`.

One calibration note, not a refutation: the tooltip is a *union* of both items' stats,
so the absence of elemental-ATK and PIERCING lines is one sample of consistency, not
proof of prohibition. "Consistent with the mask" is the defensible phrasing; "confirms
the mask" is a shade strong. The positive half (elemental DEF and CRIT DMG present on a
pants-slot item) is genuinely confirmatory.

`items-equipment/name-template-frame-confirmed` also held on re-cut, and is now
*stronger* than the survey knew — `basename = "Iron Sword"` is not an inference, it is
trans-unit 990.

---

## Verified without objection (I opened each)

| claim | what I checked |
|---|---|
| affix-suffix-pool | all 17 pre/suf arrays verbatim at `ItemGenerator.as` ~106–148; the opposing-element borrow (FIREDEF←wateratk, WINDDEF←earthatk, WATERDEF←windatk, EARTHDEF←fireatk) is exactly as described |
| affix-count-rule | `getEnchantmentCount` verbatim; legendary `numEnchant--` when `>2` at ~371 |
| stat-vs-level-curve | prog1..prog5 verbatim; all 8 slot masks; forced-first ATTACK/DEFENSE/SPEED; `itemlvl -= levelrestriction` on weapon-ATTACK and armor-DEFENSE |
| condition-no-damage-multiplier | `getMinDamage` / `getDamageRange` / `isBroken` verbatim — damage is binary on `isBroken()`, there is no condition multiplier. Correct and important overturn |
| sell-price-formula | `XMLShopItem.as:31/:68/:86` exact; `ShopUI.as:58` exact; my own `grep -rn sellPercentage` over all 559 files returns the single declaration and nothing else |
| art-manifest-rule | `getMCSComponent` verbatim incl. `partType + "0"` fallback; `XMLItem` `art` defaults to `id`; all 12 named sprite dirs exist under `reference/extracted/sprites/` |
| compositing-part-order | PART_ enum 0–26 verbatim; `mcsString` at `:348` verbatim; `[Embed(... symbol="symbol1970")]` |
| rarity-4-tiers-exact | all eight hex colours verbatim at `Item.as:419–450`; `<unique>` has exactly 2 values over 369 rows (1×253, 2×116) |
| weight-cap-is-not-flat-100 | `getCarryingWeight() = 100 + getStat(1009)*20` verbatim. Frame check: `seg-13/frame_0031.jpg` crop `(600,240)-(1000,330)` 3x reads `WEIGHT: 73 / 100` — consistent, though no frame in the set shows a cap other than 100 |
| soul-infusion-transfer-rule | `CraftingUI.as` ~506–527 verbatim |
| weapon-slash-budget-and-reach | formula verbatim; `itemdata.xml:8742–8752` verbatim; and I re-derived every value domain: slashusage {24:1, 72:70, 96:35} = 106, stancerestriction {4:7, 6:46} = 53, uses {50:1, 60:34, 80:34, 100:46} = 115, weight 745 rows 0–500, heavenlyprice 304 rows over {0,1,2,3,5,8,12,25,100}. All exact |
| no-items-config-still-true | `ls src/config/` reproduces exactly; honestly self-labelled as a repo byte-check rather than a vitest test |

## Minor corrections worth banking

- **`type-is-slot-index`** — the routing conclusion holds, but the map is not as clean as
  stated. `<type>0</type>` **never appears literally** in `itemdata.xml`; the distinct
  literal values are 1–12. The 153 "type 0" items carry **no `<type>` element at all** and
  default to 0 via E4X. Breakdown: 152 in the 4xxx armor band + exactly one in 7xxx
  (**id 7075**) — so the surveyor's spotted anomaly is real and I can name it. They missed
  a second: **id 2211 carries `<type>12</type>`** in the 2xxx band. And types 10 and 12
  are *not* equipment-array indices at all (the enum has 10=SCABBARD, 12=ACCESSORY2, while
  the data uses them for consumables and quest items) — which is precisely why
  `Item.as:845` guards `if(itemType != 10 && itemType != 12)`.
- **`condition-no-damage-multiplier`** — the enumerated display branches are seven
  (`uses==0`, `uses==1`, `==0`, `<25`, `<50`, `<75`, else), not the six stated; the six
  are the *names*, now recovered at table ids 368–373.
