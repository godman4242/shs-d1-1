# src-actionscript — HUNTER CRITIC (blind)

Packet: `docs/gauntlet/L0/worklist/src-actionscript.claims.json` — **45 claims, 45 judged, 0 skipped.**
Method: every verdict below rests on a file **I** opened this session (`awk 'NR>=a && NR<=b'` line-exact
reads, `python3` measurements, and for the one A1 claim a PIL crop I made and looked at myself).
I did **not** read `docs/gauntlet/L0/sources/actionscript.md`.

Refuted: **10 of 45** (1 minor, 9 material). Held: 35.

---

## A. REFUTATIONS (own cites)

### R1 — claim `actionscript/paperdoll-compositing-contract` — **the paperdoll is 23 slots, not 27** · MATERIAL
`reference/decompiled/shs3_android/scripts/MCSCharacter.as:120` `internal var partListLength:int = 22;`
and `:141` `for(var i:int = 0; i <= this.partListLength; i++)` → **23** MovieClips (0..22) are allocated.
The four extra constants the claim counts — `PART_l_shoulder 23 · PART_r_shoulder 24 · PART_l_knee 25 ·
PART_r_knee 26` (`MCSCharacter.as:56-62`) — are **never allocated by the human rig**. Their only readers in
the whole tree are the quadruped: `MCSWolf.as:184` `r_frontleg1 = partList[PART_r_shoulder]`, `:188`
`l_frontleg1 = partList[PART_l_shoulder]`, `:193` `r_backleg2 = partList[PART_r_knee]`, `:197`
`l_backleg2 = partList[PART_l_knee]`, and `MCSWolf.as:148` reuses `PART_prop3` as `tail3`. MCSWolf raises
the count itself: `MCSWolf.as:13` `partListLength = 25;`.
Web parity, same numbers: `reference/decompiled/shs3_payload/scripts/§1t75s0§.as:125` `= 22;` and `:159`
`while(_loc1_ <= this.§1t6256s0§)`.
**Survives:** the z-order table itself, the `getMCSComponent` naming rule, the head sub-stack. Those are
verified EXACT (`MCSCharacter.as:602/:606`, `:683/:755/:706/:724`).
**Dies:** "27 named body slots" — a renderer built to 27 human layers is wrong by four.

### R2 — claim `actionscript/focus-meter-numerics` — **+6 is a KILL bonus, not a landed-hit bonus** · MATERIAL
`reference/decompiled/shs3_android/scripts/NPCManager.as:1685-1712`: the loop counts `deathCount++` only
for `!enemy.isDead() && enemy.checkDie()`, then `:1709` `if(deathCount > 0)` `:1711`
`StatsManager.getPlayer().bonusReload();`. `MCSPlayer.as:3265-3267` `bonusReload()` `this.reload += 6;`.
Web is the same shape: `§1t1543s0§.as:2035-2049` — `_loc4_` counts dead enemies, `_loc5_` counts beheads,
`:2047` `if(_loc4_ > 0)` `:2049` `…§1t4479s0§();`.
So Focus is rewarded **per kill**, not per connected slash. A long duel against one enemy earns no bonus
at all until it dies — a materially different meter economy from the claim's.
**Second error in the same claim:** the impact says the displayed bar is `(reload-24)/(max-24)`. That is
the **Android** formula (`MCSPlayer.as:1163-1168`). The **web v0.717** bar is
`reference/decompiled/shs3_payload/scripts/§1t113s0§.as:328` `var _loc3_:Number = (param1 - 48) / (param2 - 48);`
— a **48**-unit dead zone, exactly the stance-change cost.
**Survives, all EXACT:** max `8*24` (`§1t99s0§.as:249`), `+1`/frame (`:1203-1205`), `-slashUsage/2 · -slashUsage ·
-slashUsage*1.5` (`:3302/:3306/:3310`), flat `-48` on in-battle stance change (`:3162`), weapon floor 48
(`StatsManager.as:1921-1927`).

### R3 — claim `actionscript/crit-is-focus-gated-deterministic` — **the crit is spent on RELEASE, not on landing** · MATERIAL
`MCSPlayer.as:2767-2796` `endSlash()`: `:2778` `this.deductReloadBar();` (which zeroes a full bar,
`:3242-3244`) runs **before** `:2796` `NPCManager.checkHit(this.slashArray,offset,damage);`.
Web identical order: `§1t99s0§.as:2850` `this.§1t4478s0§();` then `:2869`/`:2882`
`§1t1543s0§.§1t3273s0§(this.§1t4403s0§,_loc1_,_loc5_);`. Damage was frozen earlier still
(`MCSPlayer.as:2699` `this.slashDamage = this.getDamage();`).
A whiffed crit burns the whole meter. The claim's "landing the crit zeroes the bar" inverts that.
**Survives, EXACT:** `§1t99s0§.as:3272-3274` (deterministic gate, flat ×1.3, `+ STAT_CRITICALDMG` after
the multiply) and `:3295-3297`.

### R4 — claim `actionscript/spd-to-cooldown` — **the web cap is 600, not 300; the "twin not found" reason is dead** · MATERIAL
The claim says it could not locate the web twin because "'300 * 0.5' returns nothing there". It returns
nothing because **the web constant is 600**:
`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2289-2295`
```
internal static function §1t9590s0§(param1:int) : Number
{ if(param1 > 600) { param1 = 600; } return 1 - param1 / 600 * 0.5; }
```
Android is 300 (`StatsManager.as:1854-1860`, verified EXACT). So v0.717 doubles the SPEED cooldown cap.
Corroborated by `§1t406s0§.as:1544` `if(…(§1t9413s0§) > 300 && …(§1t9426s0§) < 9)` — 300 is only an
achievement threshold in the web build, not the cap.
Also parity-closed while hunting: `getBaseReload = 48 + SPEED*6` **is** identical in both
(`StatsManager.as:1841` ≡ `§1t1523s0§.as:2276`).
**Survives:** the SHAPE (linear, hard-clamped, max 50% reduction). **Dies:** "SPEED 300 is the cap".

### R5 — claim `actionscript/stance-counter-triangle` — **the counter bonus IS in the code, in the file it half-cited** · MATERIAL
The claim searched `getStance()` readers and concluded "may be advisory flavour … Do NOT encode a counter
bonus". The mechanic reads `Damage.stance`, not `getStance()`:
`MCSPlayer.as:3654` `var enemyStance:int = damageObj.stance;` → `:3701-3707`
`if(this.stance == LIGHT_STANCE && enemyStance == BALANCED_STANCE || … ) { damage *= 1.2; … damagetextcol = 16777215; }`.
Web carries both directions: `§1t99s0§.as:3788` (×1.2 at `:3790`, white popup at `:3793`) and `:3796`
(×0.9 at `:3798`); duplicated at `§1t4904s0§.as:419-429`.
The shipped text and the code AGREE (strings.json `"6001"` Light→Heavy, `"6003"` Balanced→Light,
`"6005"` Heavy→Balanced; and `§1t99s0§.as:3288` `return defense * 0.8;` for the −20%).
**Dies:** the negative conclusion and the "do not encode" instruction. (Packet claim
`stance-counter-triangle-confirmed` already supersedes it and is HELD.)

### R6 — claim `actionscript/three-shipped-languages` — **the two extra tables are NOT held anywhere** · MATERIAL
Manifest half is true and I add a web cite: `StatsManager.as:62/64/66/68` and web
`§1t1523s0§.as:70/72/74/76` (15/16/17/18).
But the claim asserts "two more complete 2,533-entry string tables **exist**" and tells the next actor to
cross-check with them. They are not on disk and not in either build:
`reference/decompiled/shs3_android/scripts/` contains `Mobile_Lang_EN.as` and **no** `Mobile_Lang_ZHCN` /
`Mobile_Lang_JA`; `Mobile_Lang_EN.as:5` `[Embed(source="/_assets/118_Mobile_Lang_EN.bin"…)]` is the only
embed. `reference/extracted/android/` (42 files) holds `118_Mobile_Lang_EN.bin` only. The 27 web bindata
blobs contain no language table either. `FILE_LANG_ZHCN=16 / FILE_LANG_JA=17` are slots in the **remote**
resource manifest — Player.IO downloads, dead with the server.

### R7 — claim `actionscript/repair-cost` (STILL_UNHELD) — **the repair cost formula is on disk** · MATERIAL
`reference/decompiled/shs3_android/scripts/InteractUI.as:1057-1081`:
```
case "repairweapon":
   cost = StageManager.getCurrentNodeLevel() * 10;
   … StatsManager.changeGold(-cost);
   if(weapon.uses > 1) { weapon.uses = 1; }
```
Blocker ③ closes with a *formula*: **repair = currentNodeLevel × 10 coins**, and it restores the weapon to
`uses = 1` (one use short of pristine), gated on having a real weapon (`itemID != 0 && != 13000`).
There is also a premium branch: `GetGoldPromptDialog.as:227-234` — **2 Heavenly Gold** to make the weapon
unbreakable + named (`strings.json "669"` = *"Your weapon broke!\nWould you like to make it unbreakable for
2 Gold?"*), fired from `GameEngine.as:1295-1297` on `isBroken()`.
This also lightly dents packet claim `repair-cost-is-two-consumables` ("**not** a priced service") — the
consumables are right and EXACT, but a priced service does exist alongside them. I left that claim HELD.

### R8 — claim `actionscript/drawn-line-render-contract` — **the blade colour is 0x990000, and there are two line colours** · MATERIAL
`10027008` decodes to **`0x990000`**, not `0xA30000` (`0xA30000` = 10682368). The claim's TEXT states the
contract as "colour 0xA30000" — an implementer copying the claim paints the wrong red on the single most
visible element in the game.
Second: it is not one stroke colour. `InputManager.as:172-179` names them —
`greenLine()` → `39168` = **`0x009900`**, `redLine()` → `10027008` = **`0x990000`**; web twin
`§1t1541s0§.as:172-179` identical. The green stroke is the skill-gesture stroke (`SkillUI.as:75`), the red
one the invalid-combo stroke (`SkillUI.as:136`).
**Survives, EXACT:** thickness 8 (`:57`), largestUnit 20 (`:59`), taper-to-zero lineStyle (`:360`), AI line
drawn black (`:492`), 2 px min step (`:356` `distanceTravelledSQ < 4`).

### R9 — claim `actionscript/focus-bar-is-the-third-hud-bar` (A1) — **I reproduced the picture and the pixels; both numbers are wrong** · MATERIAL
I cropped `(230,960)-(560,1070)` of `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` and `_433.0.png`,
upscaled 4× LANCZOS, and **looked**. Confirmed by eye: green 20/20, blue 26/26, third slot a dark-gold
trough carrying "CANNOT CHANGE STANCE" in 428.0 and a white left-anchored fill in 433.0, "150% DAMAGE" in
gold beneath, no fourth bar. The qualitative claim HOLDS.
Measured myself (leading run of R,G,B>170 from x=246, rows y=1032/1036/1040; trough 246→~514):
`432.4:0 · 432.5:2 · 432.6:6 · 432.7:10 · 432.8:15 · 432.9:19 · 433.0:19` px — reproducing the claim's
2/6/10/15/19/19 exactly, i.e. **42.5 px/s**.
- **"code-predicted 38.3 px/s" is wrong.** 38.3 comes from the Android dead zone 24 → 168 frames → 7.0 s.
  The web display code is `§1t113s0§.as:328` `(param1 - 48) / (param2 - 48)` → 144 frames → 6.0 s →
  **44.7 px/s**. Measured 42.5 is 4.9% off the web prediction and 11.0% off the claim's.
- **"in every frame where the message shows the fill sits at 7–22%" is not reproducible.** By the claim's
  own stated method the fill is **0 px in every message frame** (427.0, 428.0, 431.0–432.4). That is the
  *better* result: with a 48 dead zone, displayed fill = 0 ⟺ reload ≤ 48 ⟺ the stance change is blocked.
  The bar and the gate are the same predicate, exactly.
**Said out loud per §0:** here the frame and the **web** code agree to 5%. There is no frame-vs-doc
override — what failed is a constant mis-transferred from the Android build into a web prediction.

### R10/R11 — two minor
- `actionscript/animation-manifest-with-durations` · MINOR. Counts EXACT (`§1t1544s0§.as` 1144 lines /
  442 String constants; `:702` = `"light_horslash_parta"`; `anim_xml.txt` 482 `<anim>`). But "**every**
  slash is a four-part clip whose second part loops" is false: of 30 part-suffixed slash families only
  **13** conform (the hor/up/down of light·balanced·heavy·dual + `reversed_slash`). All ten `*fallslash`
  are **three**-part, and every `*jumpslash` has a non-looping `partb`. Measured over `anim_xml.txt`.
- `actionscript/damage-popup-colors` · **NOT refuted** but note: the quote's gloss "`10027008` // 0xA30000
  physical" is wrong — it is `0x990000`. The other four decode correctly (`0xFF6600 · 0xCCCCCC ·
  0x0066FF · 0x663300`) and the claim TEXT carries no hex, so the claim itself stands.

---

## B. HELD — spot-audit of the strongest (all line-exact, opened by me)

`adaptive-music-system` 13 stems `§1t133s0§.as:115-127`; 18 states `MusicManager.as:12-46`; preset matrix
`:133-187`; phase-lock `:203-215`; ±0.05 `:301/:329`; driven per ENTER_FRAME `GameEngine.as:883/:923/442`.
`affix-generator-complete` `ItemGenerator.as:111` (suffix pool), `:150-152` + 5 prog arrays, `:206-231`
dice table; web numerics byte-identical `§1t1644s0§.as:169/178/…/255-282`. (Nit: it is **17** stat channels
× 8 name bands drawing on **13** distinct suffix arrays, not "16x8".)
`ap-and-war-clocks` `StatsManager.as:158/160/162/:1099-1103/:707` + `QueryManagerBase.as:39/:104/:111/:15`.
`auto-slash-is-the-enemy-ai` `MCSPlayer.as:1149/:165/:4426/:4530`, `NPC.as:22`, `:285-294` checkAITrigger,
`EnemyElite.as:18` `EnemyPlayer.as:52` `FriendlyElite.as:18`.
`build-divergence` all six confirmed (`§1t99s0§.as:3270/3274/3262/3094/249` vs
`MCSPlayer.as:3213/3219+3221/3205/3030/239`). Nit: the Android stance-change cost is two-branch
(`MCSPlayer.as:3098-3104` — `>maxreload/2 → maxreload/3`, else `−maxreload/6`), not simply `maxreload/6`.
`coins-per-kill-is-data` `NPC.as:806/839/843`; `npcdata.xml` npc id 1 exactly as quoted.
`damage-is-a-random-roll` `§1t99s0§.as:3258`; `StatsManager.as:1877/1881/1892/1903`.
`dan-cap-and-post-rebirth-sp` `StatsManager.as:2209/2211/2214/2156/:76/:1917` — all EXACT.
`defense-is-flat-subtraction` `§1t99s0§.as:3800/3801/3803`; `Damage.as:160/164/167/171`; `NPC.as:393-428`.
`enemy-level-scaling-and-1hp-trash` `§1t68s0§.as:258-278` ≡ `NPC.as:239-259`; 403 `<hp>` rows measured.
`farming-and-prosperity-numbers` `InteractUI_crops.as:55/61/63/105-107/457-479/549/552/555/558`;
`TerritoryData.as:788/800`. (Nit: `getTownLevel` returns 0..5 = six bands.)
`hit-registration-window` `NPC.as:301-321` — front-to-back walk, EXACT.
`in-combat-stance-not-hard-locked` `§1t99s0§.as:3050/3060-3062/3160-3162` — EXACT, and my frame
measurement (R9) confirms the predicted re-crop *more* tightly than predicted.
`loot-tables-held` `LootDialog.as:456/467/471/493/:67-85`; programmatic diff: all 11 distinct arrays
byte-identical to `§1t6172s0§.as`.
`multi-target-full-damage` `NPCManager.as:1225/1230/1232/1254/1286` (quote labels off by 1-2 lines).
`native-resolution` `StatsManager.as:80-98`. **Web cite the claim lacked:** `§1t1523s0§.as:104/:106`
carry unobfuscated `stageWidth = 800 / stageHeight = 480`.
`no-condition-damage-multiplier` exactly 2 `getCondition()` hits tree-wide; `Item.as:714/1490`; my own
count over `itemdata.xml`: 982 items, `<uses>` 115 in id 13014–13227 = 100×46/80×34/60×34/50×1,
`<slashusage>` 106 = 72×70/96×35/24×1 — the claim's numbers reproduce exactly.
`reach-formula` / `reach-300-200-100-refuted` `StatsManager.as:1915-1919` ≡ `§1t1523s0§.as:2346-2347`;
`§1t99s0§.as:3094/3105/3116/3119/3131/3142/3145/3158`; `InputManager.as:106-109`. Ratio argument sound.
`repair-cost-is-two-consumables` `itemdata.xml:293/:306`; `InventoryUI.as:994`; `strings.json "4141"/"4143"/"393"`.
`save-schema` `QueryManagerPIO.as:1047-1187`, `QueryManagerBase.as:15/:97`, `StatsManager.as:4362-4380`
(`checksum %= 54321` at `:4379`). Nit: 100/101/102 are timers, 103 is battlestats — 3 timers, not 4.
`screenshake-and-killbeat` `StageManager.as:1200/1225-1227/1096/1101`, all six call sites EXACT.
`sell-price-formula` `Item.as:1582-1592` ≡ `§1t17s0§.as:1977-1987`.
`shunpo-is-teleport-double-damage` `MCSPlayer.as:1751/1752/2702/2703/1706/4344-4351`;
web `§1t99s0§.as:1810/2775`.
`slash-frames-ordering-conflict` `src/config/timing.ts:37-41` EXACT; measured light_horslash 13/9/6/1 = 29
vs heavy_horslash 5/8/7/1 = 21. Honest that this is payload-vs-config, not frame-vs-doc.
`stance-damage-is-mastery-10` `§1t99s0§.as:3261-3270`; skills 1000/1001/1002 each carry 10 `<level><value>`
1..10 (measured). Ceilings check: Light 0.5+0.4·10·0.1 = 0.9, Balanced 1+0.2·10·0.1 = 1.2, Heavy 1.4.
`stance-counter-triangle-confirmed` `§1t99s0§.as:3788-3798` + `§1t4904s0§.as:419-429`; Android
`MCSPlayer.as:3701-3707` has only the ×1.2; `NPC.as:444-460` has neither — exactly as claimed.
`territory-daily-sim-vocabulary` `HistoryItem.as:176/188/219/239/299` EXACT.
`war-board-is-a-hex-grid` `WarHex.as:11-37` (14 typed roles), `:41-55` arrows,
`WarHexUI_SurvivalModeData.as:5`, `WarRules.as:23` `max = 6`.
`web-payload-obfuscated` true; nit — 645 top-level `.as`, of which **611** are `§`-named and **34** are
plain-named asset symbols, not "645 named `§1t<N>s0§.as`".
`xp-curve-l11-80` measured: 99 entries, **identical across three copies** (`StatsManager.as:78`,
`§1t1523s0§.as:364`, `§1t29s0§.as:28`); `expArray[11]=37400`, `[80]=4285800`; `:1591` semantics EXACT.
`xp-income-model` `§1t68s0§.as:187/191/196/200/204/237`; `NPC.as:94-110` + `:112-164`.
`anim-format`, `behead-and-weapon-parry`, `damage-popup-colors`, `bindata`-adjacent — all EXACT.

---

## C. THE SILENCE — what is in this source that no claim touches

1. **The town-service action table.** `InteractUI.as` `case "…"` verbs, ~40 of them, most with an explicit
   cost. Named here for the first time in this lane: `repairweapon` (nodeLevel×10, `:1058`),
   `reinforceweapon` (5000 gold, `:1083`), `forgeweapon`, `nameweapon` (2 HGold, `:974`), `fullhpchi`
   (1 HGold, `:991`), `convertgold` (**1 HGold → 1000 coins**, `:921-923`), `innrest`, `plant/harvest/
   sellcrop`, `deposit/withdraw/bankstorage`, `bet/chohan`, `buypremium`, `paytowntoll`, `crafting`,
   `dailyprize`, `barberbuy`, `peddlerbuy/sell`, `merchantbuy/sell`, `leaveclan`,
   `joincustomclanrecruit/general`. This is most of L-economy's open surface.
2. **The elemental-rebirth reward table.** `InteractUI.as:848-899`: `firerebirth/windrebirth/waterrebirth/
   earthrebirth` each `changeStat(STAT_<X>ATK, 10)`, **or 20 when `STAT_DAN == 8`**, and consume one unit
   of stat `2202`. Core L-rebirth-elements, absent from every claim.
3. **The 10th-rebirth tier exists.** `StatsManager.as:2201-2207`: rebirth pays `HGOLD +20` when
   `STAT_DAN == 8`, else `+5`. Together with (2) the final rebirth is a deliberate double/quadruple tier —
   which is what the ledger's garbled "tenthGold" row was groping at, and it is **not** "a flat +25 gold".
4. **The buff table.** `StatsManager.as:288-312` (13 buffs) with HUD copy at `OverworldHUD.as:1398-1425`:
   XP/DAMAGE/DEFENSE/SPEED = **150%**, AP-regen/duel-token-regen = **200%**, plus COINS, RARELOOT, MUTE,
   FULLMUTE, HELL, INJURED, MODERATOR.
   **Methodological consequence for every video lane:** the gold "150% DAMAGE" under the third HUD bar in
   `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` is `OverworldHUD.as:1404` `buffstr = "150% DAMAGE"`,
   i.e. `BUFF_ATTACK` is **active in that longplay**. It is not a stance readout. **Any damage or TTK
   measured off those frames is inflated ×1.5.**
5. **A gesture-drawn skill input mode.** `SkillUI.as` — 8 hit-tested nodes (`node0..node7`), the crossed
   sequence concatenated into a `skillStr` (`:119-126`), `greenCircle`/`redCircle` state, `clearButton`/
   `doSkillButton`/`closeButton`, per-node 4-frame art, and `checkNode` calling
   `StatsManager.getPlayer().doPose(i)` (`:164`) so the fighter poses per node crossed. Web twin
   `§1t6980s0§.as`. Vestigial in both builds (only `"012"` invalid and `"345"` wired), but it is a whole
   input surface and a whole render surface nobody has claimed.
6. **The blade-impact VFX contract.** `NPCManager.as:1236-1246`: on a connecting polyline point, spawn
   `bladeslashfx` at that exact point, `rotation = Math.atan2(dy,dx) * 57.2727` from the local segment,
   suppressed while `StageManager.isRedFreeze()`.
7. **HP/Chi regeneration is per-battle, not per-second.** `StatsManager.as:1724-1739`
   `saveHealthAfterBattle()`: `hp += maxhp/10 + bonus(STAT_HPREGEN)`, `chi += maxchi/10 +
   bonus(STAT_CHIREGEN)`, both clamped to max. Twin `saveHealthAfterBattleNoRegen()` at `:1742`.
   The packet has **no claim about Chi at all**, and Chi is the blue 26/26 bar in the frames.
8. **The new-character stat block.** `StatsManager.as:694-712`: HP/MAXHP 10, HPREGEN 1, CHI/MAXCHI 10,
   CHIREGEN 1, ATTACK 1, DEFENSE 1, SPEED 1, LEVEL 1, GOLD 100, HGOLD 0, AP/MAXAP 30, DUELTOKENS/MAX 20,
   SKILLPOINTS 0, STATPOINTS 0. A complete Stage-1 seed.
9. **Weapon-parry is in the WEB build too.** The claim cited it only from Android. Web NPC twin
   `§1t68s0§.as:458-461` `case mcs.§1t6231s0§[§1t75s0§.§1t12380s0§]: this.§1t3256s0§ = false; _loc3_ = 0;
   return false;` and the behead ×1.3 at `:472-474`. The obfuscated part ids decode via
   `§1t75s0§.as:19/37/45/47` → `3/12/16/17` = weapon/neck/head/hat, which independently reproduces the
   Android z-order table in the web build.
10. **Modifier id 83 = durability bonus.** `Item.as:1478/1489` `itemXML.durability + getModifierBonus(83)`
    — the sibling of the claimed id 82 (repair).
11. **A seventh and eighth build-divergence row** for the `build-divergence` table: SPEED cooldown cap
    300 (Android) vs **600** (web) — R4; Focus-bar dead zone 24 (Android) vs **48** (web) — R2/R9.
12. **The web payload ships exactly one fallback paperdoll art set** as plain-named classes — 34 non-`§`
    top-level files: `calf11000 crotch11000 foot12000 foottop12000 hair6000/6001 hand5000 hat7000
    head8000/8004 item0 lowarm4000 mask9000 neck10000 pelvic4000 prop13000 stomach4000 thigh11000
    torso4000 uparm4000 weapon13000/13002`, plus `portrait_kojuro`, `StageObject`, `RedBG` and the
    ColorPicker skins. That set *is* the `<partType>0` fallback the claimed naming rule falls back to.
