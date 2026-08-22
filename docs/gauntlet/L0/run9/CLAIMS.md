# L0 — salvaged claim set (raw surveyor output)

> **UNVERIFIED.** These are surveyor claims. A claim is only CONFIRMED
> once blind artifact-citing critics have judged it (GAUNTLET.md §0/§3.3).
> Banked: 0 surveys · 10 critic reviews · 32 claims · 288 verdicts.

## unassigned — re-scored ?

### `newfind/mastery-ceiling-is-10-not-9` — HELD [A2] ⚑ OVERTURNS LEDGER

The mastery domain's ceiling is 10, not 9, so the ledger's 'mastery-9 ceilings' phrase is off by one — the stance tables are MASTERY-10 ceiling values. Three independent artifacts: skilldata.xml:73-79 gives skill 1000 (displayname 6000 = 'Light Stance Mastery') a top <value>10</value>; strings.json["8131"] is the achievement 'Light Stance Mastery Level 10.' (so 10 is reachable); and only m=10 substituted into the v0.717 damage switch reproduces the ledger's own 0.9 / 1.2 / 1.4 table — m=9 yields 0.86 / 1.18 and reproduces nothing. getStat(1000/1001/1002) routes through StatsManager.as:3956-3962 to skillStat.getValue(), returning 0 when unlearned, so the full domain is 0 / 1-10. The 'ceiling, not base' half of the ledger sentence survives; only its number falls.

- **Cite:** `reference/extracted/skilldata.xml:73-79 · docs/gauntlet/L0/index/strings.json (entry ["8131"]) · reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3262 and :3265 · reference/decompiled/shs3_android/scripts/StatsManager.as:3956-3962`
- **Quote:** skilldata.xml:74 '<value>10</value>' (skill 1000's top level, block closes at :80) · strings.json["8131"] = 'Light Stance Mastery Level 10.' · §1t99s0§.as:3262 '_loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);' -> 0.9 at m=10 · :3265 '* (1 + 0.2 * this.§1t4422s0§ * 0.1)' -> 1.2 at m=10 · StatsManager.as:3960 'return skillStat.getValue();'
- **Overturns:** "the stance tables are **mastery-9 ceilings**, not base"
- **Lane impact:** L5 combat-core — replace 'mastery-9' with 'mastery-10' wherever it appears, and ship the domain as 0/1-10. This is also why I refuted combat-core/mastery-is-0-to-9 and combat-core/mastery-is-single-digit.

### `android-blobs/blob-xor-key-is-per-file-not-109` — HELD [A3]

Stage-0 C1's 'key m=109' is one of FIVE keys, and the transform is not a plain XOR. ResourceManager.as:186 and Mobile.as:352 both pass resourceFileNameArray[n].charCodeAt(1), so: 115_SHS3Resource = 'h' = 104, 113_MusicResource = 'u' = 117, 122_SoundResource = 'o' = 111, 124_ImageResource = 'm' = 109, 120_BGResource = 'g' = 103. The transform itself (ResourceManager.as:205-214) touches only bytes 3..255 and, when i%11==0, first SWAPS ba[i] with ba[i+256]. I decrypted all five: every one yields CWS\x11 and inflates (image 1,908,229 B, bg 4,412,340 B, shs3 1,040,849 B, sound 29,623 B, music 1,402,677 B).

- **Cite:** `reference/decompiled/shs3_android/scripts/ResourceManager.as:41,:186,:200-217 + Mobile.as:352; all five blobs under reference/extracted/android/ decrypted and inflated by me`
- **Quote:** ResourceManager.as:41 `internal static var resourceFileNameArray:Array = ["shs3resource.swf","musicresource.swf","soundresource.swf","imageresource.swf","bgresource.swf"];` · :186 `ba = decryptByteArray(ba,resourceFileNameArray[num].charCodeAt(1));` · :209-211 `temp = int(ba[i]); ba[i] = ba[i + 256]; ba[i + 256] = temp;`
- **Lane impact:** Method, all lanes: anyone re-deriving from the blobs with a single key 109 will silently fail on four of the five and re-report them as unrecoverable - which is exactly how the equipment-art blocker was invented.

### `android-blobs/farthest-plane-also-has-a-blur-cutoff` — HELD [A2]

The ground plane is not the only plane with a per-layer blur exception. BG_Loader.as:186 wraps the farthest-plane blur in `if(!(this.bgType == BG_FORESTSPOOKY && i > 2))`, so BG_ForestSpooky's farthest layers 3 and 4 render sharp. Separately, FIVE bgdata records carry gcount=4, not four: id 6 BG_ForestSpooky, 32 BG_Graveyard, 48 BG_TempleExteriorFog, 49 BG_TempleRuinsFog, 51 BG_DungeonFog.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/BG_Loader.as:186-191 + reference/extracted/android/123_Mobile_BGData.bin (gcount census)`
- **Quote:** BG_Loader.as:186 `if(!(this.bgType == BG_FORESTSPOOKY && i > 2))` 188 `if(farthestLayerBlur != 0)` 190 `ColorCode.blur(mc,farthestLayerBlur);` · gcount histogram over 49 records = {2:34, 0:6, 4:5, 1:4}
- **Lane impact:** L6 art-anim: bounds android-blobs/ground-blur-applies-to-two-layers-only. The depth-of-field rule is per-plane AND per-background, not a single ladder with one exception.

### `android-blobs/shs3resource-decrypts-1912-equipment-symbols` — HELD [A2]

THE EQUIPMENT-ART BLOCKER IS DEAD. 115_Mobile_SHS3Resource.bin decrypts with ResourceManager.decryptByteArray at key 'shs3resource.swf'.charCodeAt(1) = 'h' = 104 and inflates to a 1,040,849-byte CWS v17 SWF. Its SymbolClass/ExportAssets tables name 1,912 exported symbols: 151 torso / 151 lowarm / 151 uparm / 151 pelvic / 150 stomach / 112 item / 109 weapon / 96 hat / 85 calf / 85 crotch / 85 thigh / 79 skill / 73 hair / 60 prop / 59 mask / 44 foot / 44 foottop / 38 head / 33 hand / 33 neck / 8 acc / 5 achievement, plus complete bear, boar, deer, horse and wolf part sets. The roster art has been in the repo the whole time.

- **Cite:** `reference/extracted/android/115_Mobile_SHS3Resource.bin (decrypted per reference/decompiled/shs3_android/scripts/ResourceManager.as:200-217, key 104) + Mobile.as:50 and :330`
- **Quote:** ResourceManager.as:200 `internal static function decryptByteArray(source:ByteArray, key:int) : ByteArray` :205 `for(var i:int = 3; i < 256; i++)` :207 `if(i % 11 == 0)` :213 `ba[i] ^= key;` · Mobile.as:50 `internal static const SHS3Resource:Class = Mobile_SHS3Resource;` :330 `this.processResource(ByteArray(new SHS3Resource()),resourceIndex);` · decoded: 1,912 exported symbols incl. hair6000, calf11000, hat7000, mask9000, acc3000-3008
- **Lane impact:** L6 art + L3 items-equipment: overturns art-anim/equipment-art-was-server-streamed's residual blocker. Equipment art must NOT be authored from frames; it must be transcribed from this SWF.

### `art-anim-audio-feel/startshake-first-arg-is-duration-not-amplitude` — HELD [A2]

Every screen-shake number in this lane is being read in the wrong slot. StageManager.as:1200 declares `public static function startShake(shakeDuration:int, shakeAmt:int = 30)`, so the single-argument call sites - startShake(12) at MCSPlayer.as:911 and :4180 and HeavenlySwordProjectile.as:76, startShake(24) at MCSPlayer.as:946, startShake(6) at Trap_CrusherBlockAuto.as:88 and Trap_CrusherColumnAuto.as:90, startShake(val) at StatsManager.as:3535 - all set DURATION IN TICKS and inherit amplitude 30. The only data-driven amplitude in the game is Marker_RumbleTrigger.as:44 `StageManager.startShake(this.shakeDuration,this.shakeAmt)`.

- **Cite:** `reference/decompiled/shs3_android/scripts/StageManager.as:1200-1206 + Marker_RumbleTrigger.as:44 + my grep of all 8 startShake( call sites`
- **Quote:** StageManager.as:1200 `public static function startShake(shakeDuration:int, shakeAmt:int = 30) : *` :1203 `screenShakeCounter = shakeDuration;` :1204 `screenShakeAmt = shakeAmt;` · Marker_RumbleTrigger.as:44 `StageManager.startShake(this.shakeDuration,this.shakeAmt);`
- **Lane impact:** L6 art-anim: a rebuild that ships 'crusher trap shakes at amplitude 6' will be wrong twice over - wrong axis and wrong default. The shake API needs (durationTicks, amplitude=30).

### `cite-lens-s26b/five-resource-blobs-all-decrypt` — HELD [A2]

All five XOR-obfuscated Android resource blobs decrypt and inflate, and 115_Mobile_SHS3Resource.bin IS the per-item art manifest. The cipher is in the corpus: ResourceManager.as:200-217 decryptByteArray touches only bytes 3..255 (with an i%11==0 swap to i+256) and the key is the SECOND CHARACTER OF THE RESOURCE FILENAME - Mobile.as:352 / ResourceManager.as:186 pass resourceFileNameArray[n].charCodeAt(1), and ResourceManager.as:41 names the five files. Keys are therefore h=104 (shs3resource), u=117 (musicresource), o=111 (soundresource), m=109 (imageresource), g=103 (bgresource). Running that over all five: 115 -> 1,040,849 B, 113 -> 1,402,677 B, 122 -> 29,623 B, 124 -> 1,908,229 B, 120 -> 4,412,340 B, every one a CWS v17 that zlib-inflates cleanly. Parsing SymbolClass/ExportAssets out of the inflated 115 yields 1,912 exported symbols whose prefixes are exactly the getMCSComponent partTypes: torso/stomach/uparm/lowarm/pelvic 151 each, item 112, weapon 109, hat 96, calf/crotch/thigh 85 each, skill 79, hair 73, prop 60, mask 59, foot/foottop 44 each, head 38, hand/neck 33 each, backleg/frontleg 12 each, tail 9, acc 8, achievement 5, plus *_wolf_ and *_horse_ creature sets. Sample names: item0, item1, item009, item010, item2100..., acc3000..acc3008, weapon13000..weapon13056. NOTE the C1 brief gives key 'm'=109 as the example; that is the IMAGE resource key specifically, not a single key for all five.

- **Cite:** `reference/decompiled/shs3_android/scripts/ResourceManager.as:41,186,200-217; reference/decompiled/shs3_android/scripts/Mobile.as:352; reference/extracted/android/115_Mobile_SHS3Resource.bin`
- **Quote:** ResourceManager.as:200 'internal static function decryptByteArray(source:ByteArray, key:int) : ByteArray' / :205 'for(var i:int = 3; i < 256; i++)' / :207 'if(i % 11 == 0)' / :210-211 'ba[i] = ba[i + 256]; ba[i + 256] = temp;' / :213 'ba[i] ^= key;'  ||  Mobile.as:352 'ba = ResourceManager.decryptByteArray(ba,ResourceManager.resourceFileNameArray[resourceIndex].charCodeAt(1));'  ||  ResourceManager.as:41 'internal static var resourceFileNameArray:Array = ["shs3resource.swf","musicresource.swf","soundresource.swf","imageresource.swf","bgresource.swf"];'  ||  decode output: 115 key 104 hdr b'CWS
- **Lane impact:** L6 (art) - CLOSES the icon/art blocker outright rather than scoping it. The item####, acc####, weapon####, hat####, mask#### and paperdoll part symbol families the items-equipment survey calls unrecoverable are in a held file and enumerable today. It also invalidates any lane plan that budgets for authoring ~1,900 symbols from scratch, and it retires the last 'S0-5 stands' language wherever it survives.

### `cite-lens-s26b/green-border-tip-completes-the-ladder` — HELD [A2]

There is a THIRD border-colour tip that no claim in this packet cites, four lines above the blue one: GameEngine.as:564 'Tip: A green border indicates that an item is special.' Together with :568 (blue = rare) and :572 (purple = unique) the game's own tip list names three of the four getShopItemType() tiers, which is far stronger corroboration for the 4-tier border ladder than the two-tip argument the border claims actually make.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:564,568,572`
- **Quote:** GameEngine.as:564 'str = "Tip: A green border indicates that an item is special.";' / :568 'str = "Tip: A blue border indicates that an item is rare.";' / :572 'str = "Tip: A purple border indicates that an item is unique.";'
- **Lane impact:** L5 (UI/HUD) + L6 (art) - the border tier names are green=special, blue=rare, purple=unique, with normal as the default tan. Any lane building the ShopItem border art now has a named colour for three of the four tiers straight from shipped in-game copy.

### `cite-lens-s26b/mcswolf-partlist-is-49-not-26` — HELD [A2]

MCSWolf's partList ends up 49 entries long, not 26. Its constructor calls super() FIRST (MCSWolf.as:11), which runs MCSCharacter's own loop and pushes 23 clips (indices 0..22); only then does it set partListLength = 25 (:13) and push 26 MORE (:14-18). Indices 23-26, which MCSWolf then binds as leg segments at :184/:188/:193/:197, therefore land in the second batch. Every claim in this packet that says 'MCSWolf raises partListLength to 25' is right about the field and silent about the list. A second consequence: MCSCharacter.as:246 'for(var i:* = int(this.partListLength - 1); i >= 0; i--)' walks only indices 24..0 on a wolf, so it never touches the upper half of that 49-entry list.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSWolf.as:9-19,184-197; reference/decompiled/shs3_android/scripts/MCSCharacter.as:141-146,238,246`
- **Quote:** MCSWolf.as:11 'super();' / :13 'partListLength = 25;' / :14 'for(var i:int = 0; i <= partListLength; i++)' / :17 'partList.push(mc);'  ||  MCSCharacter.as:141 'for(var i:int = 0; i <= this.partListLength; i++)' with :120 'internal var partListLength:int = 22;'  ||  MCSCharacter.as:246 'for(var i:* = int(this.partListLength - 1); i >= 0; i--)'
- **Lane impact:** L6 (art/animation) - the creature-rig contract is not 'human 23 + 4 extras'. A wolf gets a fresh 26-slot block stacked on top of the inherited 23, and the PART_* indices 23-26 address the new block. Anyone porting the quadruped rig from the packet's partList claims will build the wrong container count and the wrong z-order for creatures.

### `cite-lens-s26b/rarity-colour-key-has-two-palettes` — HELD [A2]

The rarity colour key is exact and there are TWO palettes, not one. Item.as:417-434 (the branch taken when the loot dialog or gift dialog is up and the inventory is not) emits unique #b048f8, rare #0080ff, special #1eff00, normal #FFFFFF. The else branch starting Item.as:436 uses a darker set for the same ladder, beginning unique #6600cc. The same four-tier test - itemxml.unique == 1 OR isPickableQuestItem() OR itemID in 20103..20107 OR isPlayerNamed(), then mods>=3, then mods>0 - drives both, and is the same test as getShopItemType() at Item.as:382-404.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:382-404,417-440`
- **Quote:** Item.as:421 'output += "<font color=\"#b048f8\">";' / :425 '#0080ff' / :429 '#1eff00' / :433 '#FFFFFF' / :438 '#6600cc'
- **Lane impact:** L5 (UI/HUD) - exact hex for the item-name colour ladder, and the fact that the loot/gift dialog uses a brighter palette than the inventory panel. A builder implementing one palette gets the loot popup wrong.

### `cite-lens-s26b/web-stance-gate-is-artifact-backed` — HELD [A2]

The web v0.717 half of the stance-gate claim was cited only as 'the documented Focus >= 48 gate' - a pointer to a document, not an artifact. It is in the payload: §1t99s0§.as:3058 opens the stance-rotation function (same four-way stance cycle as MCSPlayer.nextStance) and :3060 reads 'if(this.§1t4414s0§ < 48) { return; }'. The canChangeStance mirror is :3043-3045 (identical actionState disjunction to MCSPlayer.as:2966) with :3050 'return this.§1t4469s0§() && this.§1t4414s0§ >= 48;'. Against §1t99s0§.as:249 '= 8 * 24' (192) that is a quarter bar, versus MCSPlayer.as:2977 'this.maxreload / 6' over MCSPlayer.as:239 '5 * 24' (120) = a sixth.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249,3043-3050,3058-3060`
- **Quote:** §1t99s0§.as:3050 'return this.§1t4469s0§() && this.§1t4414s0§ >= 48;' / :3060 'if(this.§1t4414s0§ < 48)' / :3061-3062 '{ return; }' / :249 'this.§1t4415s0§ = 8 * 24;'
- **Lane impact:** L-combat-core / L-ui-hud - closes the un-cited half of itemdata-hunter/stance-gate-threshold-differs-by-build. The v0.717 stance gate is a hard 48 against a 192 max (one quarter), and it is now readable off a payload line rather than off a measurement doc.

### `coins-gold-hud-strip-correct-frame` — HELD [A1]

The COINS/GOLD dual-currency HUD strip is real and I have opened it — but it is NOT in frame_0027, which NF-2/coins-and-gold cites. frame_0027 is a 'YOU RECEIVED' loot dialog on a full-screen red freeze (coin icon + 15, 'XP 510', three PANTS slots, OK button) with no HUD strip at all. The strip appears in the same directory at frame_0029, frame_0030, frame_0040, frame_0041 and frame_0042. Visible in the top band, left to right: a silver coin icon with '480' over the label 'COINS'; a red '+' button; a gold coin icon with '2' over the label 'GOLD'; a red 'GET GOLD' button; and at the right a level badge '7' beside a yellow bar reading '14901 / 16350' over 'EXPERIENCE POINTS'. 16350 is expArray[7], consistent with a level-7 player. The code mapping the claim pairs with it is sound: STAT_GOLD = id 11 renders as COINS and STAT_HGOLD = id 12 renders as GOLD, and character creation sets 11 -> 100 and 12 -> 3. THE FRAME WINS: bank frame_0029, not frame_0027.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-05/frames/frame_0029.jpg (top strip crop 0,0-1024,52, ~x1.46 LANCZOS) + reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:226, :228, :1023-1024 + reference/decompiled/shs3_android/scripts/StatsManager.as:192, :194`
- **Quote:** Visibly in the crop of frame_0029: silver coin '480' / 'COINS' · '+' · gold coin '2' / 'GOLD' · 'GET GOLD' · level badge '7' · '14901 / 16350' / 'EXPERIENCE POINTS'. · §1t1523s0§.as:226 `internal static const §1t9412s0§:int = 11;` :228 `…§1t9413s0§:int = 12;` :1023 `§1t7357s0§(§1t9412s0§,100);` :1024 `§1t7357s0§(§1t9413s0§,3);` · StatsManager.as:192 `internal static var STAT_GOLD:int = 11;` :194 `internal static var STAT_HGOLD:int = 12;`
- **Lane impact:** L10 ui-hud / L4 economy: gives the dual-currency HUD a frame cite that actually opens. Also settles that getGold()/changeGold() are COIN operations, so every 'gold' price read out of StatsManager is a coin price.

### `combat-core/cannot-change-stance-string-is-driven-by-the-48-offset` — HELD [A2]

The 'you cannot switch while the visible bar reads empty' equivalence is not an inference — it is one line of web v0.717 code. The HUD bar writer computes its fill as (raw - 48) / (max - 48) and prints the CANNOT-CHANGE-STANCE string precisely when that ratio is 0, which is the same raw < 48 predicate the stance-switch guard uses. Source and frame therefore agree with no arbitration needed.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:326-343; guard at reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3060; cost at :3162; corroborated in reference/frames/session11/crit-focus/t1003.000.png crop (0,910)-(620,1080) 2x`
- **Quote:** §1t113s0§.as:328  var _loc3_:Number = (param1 - 48) / (param2 - 48);   ///   :336-342  if(_loc3_ == 0) { if(this.§1t5169s0§.htmlText != this.§1t5204s0§) { this.§1t5169s0§.htmlText = this.§1t5204s0§; } this.§1t5169s0§.visible = true; }   ///   §1t99s0§.as:3060  if(this.§1t4414s0§ < 48) { return; }
- **Lane impact:** L5 + L8 — the third HUD bar's display transform is (raw-48)/(max-48), the empty-bar label is a code-driven state and not a separate UI mode, and the same :348-358 branch fires Snd_criticalDamage and swaps to the full-meter string at ratio >= 1. Anyone laying out the meter can take offset 48 and the two label states straight from this function.

### `economy/duel-token-badge-identity-is-still-unheld` — STILL_UNHELD [A1]

Which premium tile is item 2125 ('10 Duel Tokens') cannot be settled from the artifacts in this packet, and two surveyed claims give opposite answers. In the 48:04 shop the skull icons split into two families: three GREY skulls at badges 5 / 10 / 15 and two GOLD skulls at badges 1 and 10. The DUEL TOKENS counter in the same frame's top bar uses a WHITE/GREY skull, which points at the grey family (badges 5/10/15 against heavenlyprice 1/2/3, a clean x5) — but the tile order that a PremiumData-derived mapping produces points at the gold family instead. Until a hover tooltip names one of the five skull tiles, this is STILL_UNHELD.

- **Cite:** `self-extracted reference/videos/Nr4fQstqHDM.mp4 t=2884s: rows-1-2 crop (185,260)-(950,640) 2x LANCZOS and DUEL TOKENS HUD crop (1500,120)-(1750,230) 4x LANCZOS; heavenlyprice rows at reference/extracted/itemdata.xml:375-379 (2125=1), :389-393 (2126=2), :403 (2127=3), :28-32 (2100=1), :42-46 (2101=2), :56-60 (2102=3)`
- **Quote:** Row 1 tiles 3-4: one grey skull badge 5, two grey skulls badge 10. Row 2 tile 1: five grey skulls badge 15. Row 2 tiles 2-3: one GOLD skull badge 1, five GOLD skulls badge 10. Top-bar HUD: a white/grey skull in a green diamond, '40/40', label 'DUEL TOKENS'.
- **Lane impact:** L3/L10 — do not bank any per-SKU premium price that depends on the skull-tile mapping. The three badge-1 tiles remain a fact; naming the third one does not. Closing this needs one hover tooltip over a skull tile from any shop session in either longplay.

### `economy/premium-15g-apparel-tiles-are-training-gear-with-no-0682-row` — HELD [A1]

The two 15-gold apparel tiles in the 48:04 premium shop are TRAINING HELMET and TRAINING GARMENT — tooltip-named on film — not items 7034 Assassin Hood and 4065 Assassin Robes. Neither name exists anywhere in the 2,533-entry android v0.682 string table, and neither has an itemdata row, so no heavenlyprice ratio can be computed for them in either direction. The contrast is sharp and useful: SANTA HAT and SANTA SUIT, also priced at 15 gold in the same shop session, DO have rows (items 7067 and 4069, both `<heavenlyprice>3</heavenlyprice>`), and 3 x 5 = 15 — the x5 prior holds cleanly for them, and for the Santa Outfit box (item 2133, heavenlyprice 12, filmed at badge 60). So the frame overturns the tile-to-id mapping, not the x5 prior.

- **Cite:** `self-extracted reference/videos/Nr4fQstqHDM.mp4, hover tooltips sampled every 2 s over t=2860-2920, crop 1100x220 at (1250,230); plus the t=2884s grid crop (185,260)-(950,1035) 2x LANCZOS; rows at reference/extracted/itemdata.xml:5373-5378 (7067 Santa Hat), :3156-3160 (4069 Santa Suit), :561-566 (2133 Santa Outfit); names in docs/gauntlet/L0/index/strings.json["4207"], ["4203"]`
- **Quote:** Tooltips read, verbatim: 'TRAINING HELMET / OWNED: 0' badge 15; 'TRAINING GARMENT / OWNED: 0 / LEVEL 7' badge 15; 'SANTA HAT / OWNED: 0 / LEVEL 7' badge 15; 'SANTA SUIT / OWNED: 0 / LEVEL 7' badge 15; 'WRIT OF RELEASE / OWNED: 0' badge 25. String-table search over 2,533 entries: 'training' -> Training Hall / Training Sword / Training Dummy only, no garment and no helmet; 'soul-infused' -> 0; 'levels up as you gain' -> 0; 'santa' -> Santa Suit (4203), Santa Pants, Santa Beard, Santa Hat (4207), Santa Outfit.
- **Lane impact:** L3/L10/L11 — STANDING INVARIANT APPLIED: the frame beats the PremiumData-order inference. Delete '7034/4065 hp=3 -> 15' from the premium price table and put Training Helmet / Training Garment in the DIVERGENT column: they are filmed v0.717 SKUs with no v0.682 row, carrying a SOUL-INFUSED / 'levels up as you gain XP' mechanic and a LEVEL badge that no extracted data source describes. Santa Hat 7067, Santa Suit 4069 and Santa Outfit 2133 are the opposite case and can be banked at x5.

### `economy/web-build-does-embed-27-xml-data-blobs` — HELD [A2]

The web v0.717 build is not data-free. It embeds 27 XML/binary blobs: nineteen <animdata> tables (100-118), one <survivalmodedata> (119), one room-object definition file (93), five name tables (94-98) and one GIF89a (92). What it does NOT embed is the four gameplay tables — itemdata, skilldata, npcdata, questdata — which it URL-loads. Any restatement of 'the web build ships no data XML at all' must be narrowed to those four or it contradicts the Stage-0 S0-1 inventory.

- **Cite:** `header dump of all 27 files in reference/extracted/bindata/ (first 60 bytes each); reference/extracted/bindata/119_1t4646s0.bin; reference/extracted/bindata/92_1t4648s0.bin; load sites at reference/decompiled/shs3_payload/scripts/§1t1524s0§.as:334,357,453,479,505,528,554,580,606,632,658,683`
- **Quote:** 100_1t4627s0.bin '<?xml version="1.0"?><animdata><anim i="ogre_idle" d=' ... 118_1t4645s0.bin '<?xml version="1.0"?><animdata><anim i="light_stance"' · 119_1t4646s0.bin '<?xml version="1.0" encoding="UTF-8"?><survivalmodedata>' · 93_1t4647s0.bin '<?xml version="1.0" encoding="UTF-8"?><!--<obj><id' · 94_1t4651s0.bin 'AkenoAkifusaAkihideAkihikoAkihiraAkihiroAkihito' · 92_1t4648s0.bin 'GIF89a'
- **Lane impact:** Cross-lane bookkeeping — animation timings, the survival-mode table, room-object definitions and the NPC name generator ARE web-side v0.717 artifacts and do not carry the 0.682 caveat. Only itemdata/skilldata/npcdata/questdata do.

### `economy/web-iap-usd-tiers-are-identical-to-android` — HELD [A2]

The web v0.717 PayUI carries the SAME five USD price points as android v0.682 — 4.99 / 9.99 / 14.99 / 19.99 / 24.99 — in its non-Kongregate branch, alongside a 50/100/150/200/250 KREDS ladder for the Kongregate branch. That is what makes the gold change a pure redenomination: identical real money buys 5x more nominal heavenly gold on web, and that gold buys 1/5 the coins. Neither surveyed claim cites this line, though one asserts it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t410s0§.as:323-338 against reference/decompiled/shs3_android/scripts/PayUI.as:137-141`
- **Quote:** §1t410s0§.as:325-329  this.pricetext0.text = "50 KREDS"; ... this.pricetext4.text = "250 KREDS";  ///  :333-337  this.pricetext0.text = "4.99 USD"; this.pricetext1.text = "9.99 USD"; this.pricetext2.text = "14.99 USD"; this.pricetext3.text = "19.99 USD"; this.pricetext4.text = "24.99 USD";  ///  PayUI.as:137-141  oldpricetext0..4 = "4.99" / "9.99" / "14.99" / "19.99" / "24.99"
- **Lane impact:** L10/L11 — the USD anchor is build-invariant, so real-money value per tier is the correct cross-build unit and nominal gold is not. It also fixes the top-tier anomaly's meaning: web tier 5 gives 400 gold for the same 24.99 that buys 75 android gold, a 5.33x bonus tier rather than a broken multiplier.

### `enemies-ai/npc-die-has-four-paths-before-the-seven-way-dice` — HELD [A2]

The 7-way human death dice is the LAST of five branches in NPC.die(), and the four ahead of it are unheld by any claim in this packet. NPC.as:909-913 returns bare dead=true from GOTLAUNCHED_STATE with no animation at all; :914-925 handles isDowned() with DEATHDOWNED plus a 90-degree torso emitter at variance 15; :926-954 handles SEPPUKU_START, splitting into SEPPUKU_MID or, when behead is set and censorship is off, SEPPUKU_NOHEAD with its own 3-way emitter dice over PART_neck at 130 degrees and the detached head at 180; and :1084+ handles a plain behead. Only if none of those fire does :1005 roll Math.random()*7.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:898-1005 read in full`
- **Quote:** NPC.as:909 `if(actionState == GOTLAUNCHED_STATE) { dead = true; return; }` · :914 `if(this.isDowned())` :917 `startAnim(DEATHDOWNED);` · :926 `if(mcs.animation == SEPPUKU_START)` :939 `startAnim(SEPPUKU_NOHEAD);` :941 `dice = Math.random() * 3;` · :1005 `dice = Math.random() * 7;`
- **Lane impact:** L2 enemies-ai + L6 art-anim: a rebuild wiring only the 7-way dice loses the launched, downed and seppuku deaths entirely, and StatsManager.censored gates the emitters on every one of them.

### `enemies-ai/seg10-wave-spawn-is-witnessed-across-three-frames` — HELD [A1]

The seg-10 drop-in is not a single ambiguous airborne pose: across three consecutive extracted frames the wave materialises. At frame_0019 none of the three hostiles is on screen; at frame_0020 all three are present with one still fully airborne and its HP bar already tracking it; at frame_0021 all three are grounded and engaging the player. That sequence excludes a jump-attack reading and makes NPCManager's posY - Math.random()*200 spawn offset a filmed behaviour rather than a code-only one.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-10/frames/frame_0019.jpg, frame_0020.jpg, frame_0021.jpg — identical crop (400,150)-(1024,470) 2x LANCZOS on all three; rule at reference/decompiled/shs3_android/scripts/NPCManager.as:411,424,437`
- **Quote:** NPCManager.as:411  createEnemy(npcHolder.getNPCID(),npcHolder.getXPos(),posY - Math.random() * 200,npcHolder.getFatal(),npcHolder.getLvl());  — identical at :424 (createNeutral) and :437 (createObjective). Frames: 0019 shows only the player and a red slash trail; 0020 shows three hostiles, one airborne with a green bar above it; 0021 shows all three grounded.
- **Lane impact:** L0 enemies-ai — the drop-in spawn can be stamped A1+A2 on a three-frame witness rather than a single still, and the same sequence shows the HP bar is attached at spawn, before the actor lands.

### `gauntlet-s26b/behead-multiplier-diverges-1p5-to-1p3` — HELD [A2]

The behead damage multiplier is a v0.682->v0.717 TUNING DIVERGENCE: android NPC.as multiplies a behead hit by 1.5, the web NPC class multiplies it by 1.3. Both sit in the same method of the same class, after the same defense subtraction and the same getMinDamage floor, so this is a straight retune and not a structural difference. A v0.717-targeted recreation must port 1.3.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:451-453 vs reference/decompiled/shs3_payload/scripts/§1t68s0§.as:472-474`
- **Quote:** android NPC.as:451-453 `if(behead) { damage *= 1.5; }`  ·  web §1t68s0§.as:472-474 `if(this.§1t1071s0§) { _loc3_ *= 1.3; }`
- **Lane impact:** L-enemies-ai + L-combat-core: a fourth proven build divergence, and the one that sinks the packet's 'build parity is ESTABLISHED' reading (claim 10) using claim 10's own cited file. The S0-3 parity caveat stays undischarged: the two bundles diverge on combat tuning even inside classes whose structure matches line for line.

### `gauntlet-s26b/createnpc-switch-is-35-distinct-classes` — HELD [A2]

The android createNPC switch resolves 38 cases to 35 DISTINCT classes - 32 Enemy* plus 3 Friendly* - not 34. EnemyWolf (case 8) and EnemyWolf2 (case 10) are separate classes, not one class used twice; only EnemyPlayer (x3, cases 0/9/14) and EnemySpearElite (x2, cases 28/37) actually repeat. 3 + 2 + 33 = 38. Separately, 34 Enemy*.as files exist on disk, so two Enemy* classes are never reached by this switch.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:516-636 + reference/decompiled/shs3_android/scripts/EnemyWolf2.as:3`
- **Quote:** NPCManager.as:548-552 `case 10: actor = new EnemyWolf2(); break; case 11: actor = new EnemyWolfAlpha();` · EnemyWolf2.as:3 `public class EnemyWolf2 extends EnemyWolf` · my counts over :516-636 -> 35 distinct `new X`, 32 Enemy*, 3 Friendly*
- **Lane impact:** L-enemies-ai: the corrected form of packet claim 5, which I refuted for shipping 34/31+3 as a lane correction. The error came from a `grep -oE 'new [A-Za-z_]*'` character class that silently ate the trailing digit of EnemyWolf2. Claim 5's true half - that createRoomNPC at NPCManager.as:671-700 is a SECOND, independent ai dispatch and the path every overworld object takes (Obj_NPCAggro.as:63, Obj_NPCCivilian.as:24, Obj_Corpse.as:28) - stands and should enter the ledger in this corrected form.

### `gauntlet-s26b/itemdata-ships-nineteen-empty-item-rows` — HELD [A2]

itemdata.xml ships NINETEEN completely empty item records, not one: ids 4021, 4022, 4070, 4102, 4103, 4104, 4105, 4106, 4107, 4110, 4111, 4112, 4113, 4114, 4115, 4116, 4117, 4138 and 7075 each carry an <id> and no other field. A further 147 rows carry only <id> plus <type> and/or <unique>, giving 166 stub rows in total out of 982.

- **Cite:** `reference/extracted/itemdata.xml:5449-5451, :2775-2777, :3165-3167, :3457-3459 (plus my own scan of all 982 <item> blocks)`
- **Quote:** itemdata.xml:5449-5451 `<item>` / `<id>7075</id>` / `</item>` · my scan: 19 blocks whose only tag is <id>, 166 blocks whose tag set is a subset of {id, type, unique}
- **Lane impact:** L-items-equipment: sharpens packet claim 44 (which I upheld) - its 'around 90 further rows are stubs' measures 166, and 7075 is one of nineteen empty rows rather than a singleton. The 1:1-vs-deviate decision the claim asks for therefore applies to a whole class of rows, not to one anomaly.

### `gauntlet-s26b/weapon-part-parry-is-universal-not-undead` — HELD [A2]

The free weapon-part parry is a BASE-CLASS rule, not an EnemyZombie quirk: NPC.as carries the identical `case mcs.partList[MCSCharacter.PART_weapon]: gotHitFlag = false; damage = 0; return false;` in its own hit switch, and the web NPC class confirms it in v0.717. Every NPC in the game nullifies a blade-path hit that intersects its rendered weapon, and the hit is aborted before the HP path rather than merely reduced.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:437-440 + reference/decompiled/shs3_payload/scripts/§1t68s0§.as:458-461 (contrast the EnemyZombie override at reference/decompiled/shs3_android/scripts/EnemyZombie.as:502-505)`
- **Quote:** NPC.as:437-440 `case mcs.partList[MCSCharacter.PART_weapon]: gotHitFlag = false; damage = 0; return false;` · §1t68s0§.as:458-461 `case mcs.§1t6231s0§[§1t75s0§.§1t12380s0§]: this.§1t3256s0§ = false; _loc3_ = 0; return false;` with §1t75s0§.as:19 `= 3` and MCSCharacter.as:16 `PART_weapon:int = 3`
- **Lane impact:** L-combat-core: packet claims 12 and 13 both read the EnemyZombie override correctly but scope the mechanic to the undead. It is universal and build-stable, which promotes it from an undead flavour note to a first-order blade-path rule: the per-part damage verdict needs a NULLIFY outcome for every enemy, and the rendered sword is a parry surface on the whole roster.

### `gauntlet-s26b/web-npcmanager-switch-is-the-name-mapping-anchor` — HELD [A2]

The web NPCManager is §1t1543s0§.as and its ai switch has 38 cases in the SAME ORDER as the android createNPC switch, which turns the obfuscated enemy roster into a one-pass name-recovery job. Confirmed pairs: ai 0 -> §1t122s0§ = EnemyPlayer (same `,true,false` args), ai 2 -> §1t4542s0§ = EnemyArcher, ai 25 -> §1t4539s0§ = EnemyGoblinThrower, ai 36 -> §1t4545s0§ = EnemyKanjiGuardian, ai 37 -> §1t4523s0§ = EnemySpearElite(boss, same trailing `true`).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1543s0§.as:615-730 vs reference/decompiled/shs3_android/scripts/NPCManager.as:516-636`
- **Quote:** §1t1543s0§.as:615 `switch(_loc6_.ai)` · :623-624 `case 2: _loc5_ = new §1t4542s0§(§1t1744s0§.§1t1559s0§());` · :692-693 `case 25: _loc5_ = new §1t4539s0§(...);` · :725-726 `case 36: _loc5_ = new §1t4545s0§(...);`  vs  NPCManager.as case 2 = `new EnemyArcher(...)`, case 25 = `new EnemyGoblinThrower(...)`, case 36 = `new EnemyKanjiGuardian(...)`
- **Lane impact:** ALL AS3-SOURCED LANES: this is the schedulable anchor claim 9 asked for, already half-built. It is also the artifact that refutes claim 14 - without the case map, §1t4539s0§ looks like the archer and the knockdown mechanic gets deleted from the port.

### `newfind/1071-is-the-behead-flag-and-it-moved-1p5-to-1p3` — HELD [A2]

§1t1071s0§ is the BEHEAD flag, and the behead multiplier is a sixth counted web-vs-android combat divergence: 1.5 on android v0.682, 1.3 on web v0.717. It is set by a switch over the hat/head/neck part slots at §1t99s0§.as:3736-3747 and again at §1t4904s0§.as:406-410; android does the identical thing at MCSPlayer.as:3689-3692 with the name 'behead'. The two web classes also disagree on ORDER: §1t4904s0§ applies x1.3 at :409 BEFORE the defence subtraction at :431, while §1t99s0§ applies it at :3805-3807 AFTER the min-damage floor — so the same head hit produces different numbers on the two paths, and a port must pick per class.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3736-3747 and :3805-3807 · reference/decompiled/shs3_payload/scripts/§1t4904s0§.as:406-410 and :431 · reference/decompiled/shs3_android/scripts/MCSPlayer.as:3689-3692 and :3714-3716`
- **Quote:** web §1t99s0§.as:3738-3741 'case mcs.§1t6231s0§[§1t75s0§.§1t12394s0§]: case […12393…]: case […12389…]: §1t1071s0§ = true;' :3745 'default: §1t1071s0§ = false;' :3805-3807 'if(§1t1071s0§) { _loc5_ *= 1.3; }'  ||  §1t4904s0§.as:409-410 '_loc3_ *= 1.3; §1t1071s0§ = true;'  ||  android MCSPlayer.as:3692 'behead = true;' :3714-3716 'if(behead) { damage *= 1.5; }'
- **Lane impact:** L5 + L4 — retires combat-core/web-only-1.3-state-multiplier's phantom 'fifth damage term' and replaces it with a divergence row plus an ordering warning. Prevents double-counting +30 % on every head hit.

### `newfind/cannot-change-stance-is-getstring-960` — HELD [A2]

A source-side proof of the 'CANNOT CHANGE STANCE' build divergence that is stronger than any English-text search. The web build builds that label from §1t1521s0§.getString(960) at §1t113s0§.as:111 — the sibling line to the getString(175) 'Critical Hit' label at :110. The android string table has NO key 960: its numeric keys skip the entire 940-999 band, with 1000 the next present entry. So the divergence is proven at the ID level and does not depend on any assumption about how the copy was worded.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:110-111 · docs/gauntlet/L0/index/strings.json (entries ["175"], ["1000"]; no entry ["960"])`
- **Quote:** §1t113s0§.as:111 'this.§1t5204s0§ = "<font color=\'#BBBBBB\'>" + §1t1521s0§.getString(960) + "</font>";' — and §1t113s0§.as:336-342 assigns §1t5204s0§ to the bar's label when the fill is exactly 0. strings.json has no key "960"; the numeric keys jump from the 800s to "1000".
- **Lane impact:** L8 + L5 — upgrades combat-core/cannot-change-stance-not-in-android-strings from an exhaustive-search argument to a source-side one, and gives the recreation the exact string slot to fill.

### `newfind/heavy-defence-penalty-is-in-the-string-table` — HELD [A2]

The game's own tooltip copy sources two combat constants the lane has only ever read out of AS3. strings.json["6005"] (heavy stance description) ends 'Defense -20%', which is the player-facing statement of getDefense()'s 'return defense * 0.8'. And strings.json["IDS_Q50S3NODE2"] states the stance triangle in words — 'Balanced is effective against Light. Heavy is effective against Balanced. Light is effective against Heavy.' — which is the artifact that fixed the triangle's DIRECTION and refuted combat-core/stance-triangle-1.2-and-damage-order. strings.json["IDS_Q50S3NODE1"] additionally fixes the HUD ring colours: 'Light stance - blue, Balanced stance - brown, Heavy stance - red', matching setStanceColor 1/2/3.

- **Cite:** `docs/gauntlet/L0/index/strings.json (entries ["6005"], ["IDS_Q50S3NODE1"], ["IDS_Q50S3NODE2"]) · reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3286-3288`
- **Quote:** strings.json["6005"] = 'Slow but powerful stance. Damage inflicted is increased but slash range is shorter.\nEffective against Balanced Stance.\nDefense -20%' · ["IDS_Q50S3NODE2"] = 'Balanced is effective against Light. Heavy is effective against Balanced. Light is effective against Heavy.' · ["IDS_Q50S3NODE1"] = 'Your stance is indicated by the color of the circle around your portrait: Light stance - blue, Balanced stance - brown, Heavy stance - red.' · §1t99s0§.as:3288 'return defense * 0.8;'
- **Lane impact:** L5 + L8 — a second, player-facing source for the heavy defence penalty and the stance triangle direction, and a check on the stance ring colours the frames show (t1003.000.png's ring is red = heavy).

### `newfind/per-stat-caps-diverge-between-builds` — HELD [A2]

The per-stat CAP formulas diverge between builds in four of six rows, and one of them feeds the reach model directly. Positionally aligned, same six handlers in the same order: MAXHP web '10 + (lvl+10)*10' vs android '10 + (lvl+10)*5'; MAXCHI identical in both; MAXAP web '30 + (lvl+10)*5' vs android '20 + (lvl+10)'; ATK/DEF/SPD web '1 + (lvl+10)*3' vs android 'lvl + 10'. At level 8 the SPD cap is 55 on web and 18 on android — a 3x difference in the input to baseSlashLength = 120 + floor((90+5*DAN)*SPD/(20+SPD)). This makes the web level-8 Dan-0 reach ceiling 120 + floor(90*55/75) = 186, not the ~130 an android-capped reading gives.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3341-3346 · reference/decompiled/shs3_android/scripts/InventoryUI.as:2407-2412`
- **Quote:** web §1t5957s0§.as:3341 '< 10 + (_loc2_ + 10) * 10' :3342 '< 10 + (_loc2_ + 10) * 5' :3343 '< 30 + (_loc2_ + 10) * 5' :3344-3346 '< 1 + (_loc2_ + 10) * 3'  ||  android InventoryUI.as:2407 '< 10 + (charlevel + 10) * 5' :2408 '< 10 + (charlevel + 10) * 5' :2409 '< 20 + (charlevel + 10)' :2410-2412 '< charlevel + 10'
- **Lane impact:** L1 + L4 + L10 — a 6th/7th/8th/9th counted web-vs-android divergence beyond the five in combat-core/web-android-combat-tuning-diverges-on-four-constants, and the concrete resolution of the 'SPD 205 is impossible' leg of the reach-magnitude gap. Any progression or reach row derived from the android caps is wrong for v0.717 by a wide margin.

### `newfind/stance-enum-pinned-by-declared-value` — HELD [A2]

The five obfuscated stance constants are pinned by their DECLARED INTEGER VALUE, not by a HUD-colour fingerprint, and the value proof is strictly stronger. §1t99s0§.as and MCSPlayer.as declare them at IDENTICAL line numbers with IDENTICAL values: 27 -> 0, 29 -> 1, 31 -> 2, 33 -> 3, 35 -> 4, against LIGHT/BALANCED/HEAVY/DUAL/REVERSED. setStanceColor cannot separate them on its own — it emits 2 for BOTH BALANCED and REVERSED and 3 for BOTH HEAVY and DUAL — so any claim resting on colour alone is under-determined. This is the artifact that settles §1t12223s0§ = DUAL and §1t12224s0§ = REVERSED, and it is what killed combat-core/reversed-and-dual-reach. Generalises: for any obfuscated enum with a named android twin, compare the declaration block first.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:27-35 · reference/decompiled/shs3_android/scripts/MCSPlayer.as:27-35`
- **Quote:** web §1t99s0§.as:27 'internal static var §1t12220s0§:int = 0;' :29 '§1t12221s0§:int = 1;' :31 '§1t12222s0§:int = 2;' :33 '§1t12223s0§:int = 3;' :35 '§1t12224s0§:int = 4;'  ||  android MCSPlayer.as:27 'internal static var LIGHT_STANCE:int = 0;' :29 'BALANCED_STANCE:int = 1;' :31 'HEAVY_STANCE:int = 2;' :33 'DUAL_STANCE:int = 3;' :35 'REVERSED_STANCE:int = 4;'
- **Lane impact:** L5 + every lane reading the obfuscated web bundle — a general de-obfuscation method, and the decisive evidence for the DUAL/REVERSED reach rows.

### `npcdata-category11-grant-census-corrected` — HELD [A2]

Corrected grant census for the category-11 (NPC-only) skills in npcdata.xml, replacing the numbers in NF-11-category-11-skills-are-in-npcdata. Measured by raw occurrence of `<skill><id>NNNN</id><lvl>` over the whole file: 1500 (Reversed-stance mastery) 5 rows at lines 3662, 3683, 3898, 4290, 4349, all <lvl>3</lvl>; 1501 (Dual-stance mastery) 2 rows at 3934, 3956, both <lvl>3</lvl>; 1064 4 rows (3898, 3934, 3956, 4290); 1065 4 rows (same four); 1066 1 row (3879); 1067 1 row (3879); 1068 (SkillManager.SKILL_UNDYING) 2 rows — 3934 at <lvl>1</lvl> and 4349 at <lvl>2</lvl>. Category 11 holds exactly seven skilldata rows: 1064, 1065, 1066, 1067, 1068, 1500, 1501. The encoding point stands: npcdata nests these as `<skill><id>N</id><lvl>N</lvl></skill>`, which is why a `<skill>NNNN</skill>` grep finds nothing.

- **Cite:** `reference/extracted/npcdata.xml:3662, :3683, :3879, :3898, :3934, :3956, :4290, :4349 + reference/extracted/skilldata.xml (category-11 rows) + reference/decompiled/shs3_android/scripts/SkillManager.as:96`
- **Quote:** npcdata.xml:3934 `<skills><skill><id>1501</id><lvl>3</lvl></skill>…<skill><id>1064</id><lvl>1</lvl></skill><skill><id>1065</id><lvl>1</lvl></skill><skill><id>1068</id><lvl>1</lvl></skill></skills>` · npcdata.xml:4349 `…<skill><id>1068</id><lvl>2</lvl></skill>` · SkillManager.as:96 `public static var SKILL_UNDYING:int = 1068;`
- **Lane impact:** L2 skills-meters / L2 enemies-ai: replaces a peer claim's overstated census. Anyone sizing the elite-enemy skill grants from the old numbers would over-provision 1064/1065 by 25%, 1066/1067 by 100% and 1068 by 150%.

### `web-charsheet-heavy-defence-0.8-is-web-side` — HELD [A2]

Heavy-stance Defence x0.8 has a THIRD confirmation nobody has banked, and it is entirely web-side — no android string and no wiki. The web v0.717 character sheet sets its defence modifier per stance at §1t5957s0§.as:2728 (light = 1), :2737 (balanced = 1) and :2746 (heavy = 0.8), and consumes it at :2947 as `int(_loc3_ * _loc47_)` beside the stance name — the positional twin of android InventoryUI.as:2166 `"physical def: " + int(defense * defModifier) + " (" + stanceName + ")"`. So in v0.717 the character sheet and the simulation AGREE on defence (§1t99s0§.as:3288 `return defense * 0.8;`), unlike the android build where they contradict each other on crit. That agreement is itself worth banking: it means the v0.717 char-sheet path is a usable cross-check, whereas the v0.682 one is not.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:2728, :2737, :2746, :2947 + §1t99s0§.as:3288`
- **Quote:** §1t5957s0§.as:2746 `_loc47_ = 0.8;` (heavy branch) · :2728 `_loc47_ = 1;` · :2737 `_loc47_ = 1;` · :2947 `_loc55_ += §1t1521s0§.getString(987) + ": " + _loc53_ + int(_loc3_ * _loc47_).toString() + _loc52_ + " (" + _loc45_ + ")<br>";` · §1t99s0§.as:3288 `return defense * 0.8;`
- **Lane impact:** L5 combat-core: promotes the Heavy def x0.8 term from android-plus-skill-description to a two-site web v0.717 fact, and establishes that the v0.717 character sheet is a trustworthy cross-check on the sim (the v0.682 one demonstrably is not).

### `web-charsheet-per-stance-slash-reach-ladder` — PARTIAL [A2]

UNCLAIMED AND LANE-RELEVANT: the web v0.717 character sheet carries a per-stance SLASH-DISTANCE ladder that no claim in this packet touches, and it is the mirror image of the damage ladder. In the same three stance branches that set damage and crit, §1t5957s0§.as sets a fourth modifier: :2729 light = 1.4 flat; :2738 balanced = 1 + 0.2*balancedMastery*0.1; :2747 heavy = 0.5 + 0.4*heavyMastery*0.1. It is consumed at :3013 as `int(_loc21_ * _loc48_)` beside the stance name — positionally the twin of android InventoryUI.as:2232 `"slash distance: " + int(baseSlashLength * slashModifier) + " (" + stanceName + ")"`, where the variable is literally named slashModifier. At mastery 10 the ladder reads Light 1.4 / Balanced 1.2 / Heavy 0.9, exactly inverting the damage ladder 0.9 / 1.2 / 1.4 that NEW-2 confirms from the same file. PARTIAL, not HELD, for one reason: this is the DISPLAY path, and NF-3/NF-5 prove a shipped build can display a modifier its own sim does not apply (v0.682 crit). It is not yet shown that the v0.717 sim uses the same coefficients — that needs the InputManager.setMaxDistance call site in the web bundle. What it does do is give the reach question its first ratio-shaped web-build evidence, and it is not a static text field, so SOURCE_CONSTANTS.md:33-36's placeholder ruling does not apply to it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:2729, :2738, :2747, :3013 + reference/decompiled/shs3_android/scripts/InventoryUI.as:2232`
- **Quote:** §1t5957s0§.as:2729 `_loc48_ = 1.4;` · :2738 `_loc48_ = 1 + 0.2 * _loc46_ * 0.1;` · :2747 `_loc48_ = 0.5 + 0.4 * _loc46_ * 0.1;` · :3013 `_loc55_ += §1t1521s0§.getString(982) + _loc53_ + int(_loc21_ * _loc48_).toString() + _loc52_ + " (" + _loc45_ + ")<br>";` · InventoryUI.as:2232 `str += "slash distance: " + FONTCOLOR1 + int(baseSlashLength * slashModifier).toString() + FONTEND + " (" + stanceName + ")<br>";`
- **Lane impact:** L5 combat-core / L2 skills-meters: the reach blocker has been stuck on '345 and 200 are placeholders' with nothing to put in their place. This is a web-build, computed (not static-text) reach ratio ladder of 1.4 / 1.2 / 0.9 at max mastery. It must be confirmed against the web sim's own setMaxDistance call site before it is promoted past PARTIAL — the v0.682 crit case proves the char sheet can lie.

### `web-parity/web-payload-carries-the-same-resizehandler` — HELD [A2]

The build-parity hole on the whole canvas/letterbox contract is CLOSED from the web side. reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:269-320 is the web v0.717 payload's own resize handler and it declares :271 _loc2_=800, :272 _loc3_=480, :273 _loc4_=690, then the identical '<=' with-bar aspect test, the identical fit-width/fit-height branch with the same centring offsets, and publishes the same six stage values that InputManager reads back. 800x480 base + a 210px bar is a WEB fact, not an Android inference.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:269-320`
- **Quote:** 271 `var _loc2_:int = 800;` 272 `var _loc3_:int = 480;` 273 `var _loc4_:int = 690;` 277 `if(_loc7_ <= _loc6_)` 280 `_loc3_ = _loc4_;` 281 `§1t1523s0§.§1t9362s0§ = true;` 313-314 `§1t1523s0§.§1t9363s0§ = _loc2_; §1t1523s0§.§1t9364s0§ = _loc3_;`
- **Lane impact:** L-ui-hud / L-render: HUD x-fraction re-basing on 800x480 is now legitimate for the web build. Kills the 'every canvas constant is Mobile-only' caveat.
