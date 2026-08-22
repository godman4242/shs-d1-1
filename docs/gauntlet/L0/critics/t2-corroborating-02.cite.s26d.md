# Blind cite-lens review — packet `t2-corroborating-02`

**Reviewer lens:** LENS 1, the cite lens. Hunt over-claiming: open the cited artifact, check the
path, check the line, check that the quoted text is really there, check that it really says what the
claim says it says.

**Packet size 48 · judged 48 · skipped 0 · refuted 1 · new findings 8.**

I did not open `docs/gauntlet/L0/critics/*.md` or `docs/gauntlet/L0/sources/*.md`. Every verdict below
rests on a file I opened myself, named in `own_cite` in the JSON companion.

---

## The one refutation

### `meta-social/filmed-build-is-neither-artifact` — REFUTED (material)

The claim says the longplay shows a build that is neither `reference/extracted/payload.xml` (web
v0.717) nor the Android decompile, because the frame's war-rules dialog has **7 pages** while "the
v0.717 payload has 6 pages with completely different wording". It then caps the meta-social score
below 78 and marks every "it came from the WEB build" upgrade in the lane as provisional.

Its frame reading is right. Its premise about the payload is wrong.

**1. `payload.xml` and `shs3_payload/scripts/` are the SAME SWF.** The obfuscated class name
`1t7924s0` appears inside `reference/extracted/payload.xml` at lines **113188** and **2653462**
(the SymbolClass name table). This is not a different revision — it is the same file, dumped two
different ways.

**2. The class that owns those TextFields declares SEVEN pages.**

```
reference/decompiled/shs3_payload/scripts/§1t7924s0§.as
  :7    [Embed(source="/_assets/assets.swf", symbol="symbol756")]
  :23   internal var max:int = 7;
  :96   this.warrulestitle.text = §1t1521s0§.getString(369);
  :121  case 7:
  :122     this.warrulestitle.text = §1t1521s0§.getString(11016);
  :123     this.warruleswords.text = §1t1521s0§.getString(11017);
```

`symbol756` is exactly the `DefineSpriteTag spriteId="756"` at `payload.xml:528088` — the sprite
sitting immediately after the six war-rules title/body pairs the claim cites (characterIDs 744-755
at `:528040`-`:528084`).

**3. The static text is a dead authoring placeholder.** `§1t7933s0§` writes `warrulestitle.text` and
`warruleswords.text` from `getString()` on *every* page turn. The embedded `"War room rules 1/6"`
string is never displayed. This is precisely the trap the sibling claim
`meta-social/rank-ladder-a1-confirmed` correctly flags in `ui_strings.txt:215` — where the placeholder
says `soldier ... 15/60` and the shipped build renders `RECRUIT ... 0/36`.

**4. The claim's own supporting inference is a non sequitur.** "`grep 'room rules'` over
`shs3_payload/scripts/` returns nothing, so those static TextFields ARE the desktop copy." Of course
it returns nothing — v0.717 streams its strings at runtime (`§1t1521s0§.as:5-6`, `URLLoader` /
`URLRequest`), which is the very point the sibling claim `web-lang-is-network-loaded` makes and which
I verified.

**5. Procedural error too.** The stated crop `(60,20)-(300,45)` on a 512×288 frame cannot contain the
body text it quotes — those lines sit near y≈58 and y≈82. The content is genuinely on the frame (I read
it at whole-frame ×3), but not through that rectangle.

**Net:** there is no frame-vs-artifact conflict here. The frame's `1/7` **confirms** v0.717 rather than
contradicting it. The score cap and the lane-wide "provisional" flag are unearned.

Ironically the correct version of this fact is already in this same packet:
`meta-social/desktop-v0717-decompile-was-on-disk-unopened` states "the frame's 1/7 is confirmed by the
target build and no frame-vs-doc conflict ever existed" — and every one of that claim's six sub-checks
verified exactly.

---

## Everything else held. What I actually checked.

### Items / equipment (20 claims)

The four **stack-weight** claims (`sell-price-reads-stack-weight`, `sell-weight-branch-is-stack-weight`,
`sell-weight-is-stack-weight-and-builds-diverge`, `sell-weight-test-is-stack-weight`) all rest on
`Item.as:1564-1568` feeding `:1582-1593`. Both open verbatim. `getWeight()` multiplies by
`getQuantity()`, so `getSellAmt`'s `>= 10` test is a **stack** test. `ShopUI.as:401` is verbatim and
is genuinely the only Android call site. The web divergence at `§1t17s0§.as:1974` is real, and I closed
the PARTIAL: `§1t478s0§` is declared at `:60`, serialised under modifier id **208** at `:300`, and shown
to the player at `:1407` as `getString(139) + ": " + (weight + §1t478s0§)`.

`setarmor-drives-8-parts` — `setArmor` opens at `:915`, its local block `:917-924` is exactly eight
`partList` slots including `PART_neck`, the `removeChildAt(0)` prologue covers only seven, and the neck
attach is at `:1071-1087`. `setNeck`'s two-deep clear at `:795-813` is verbatim. Clean.

`slashusage-24-is-dead` — my own count over `itemdata.xml` reproduces `{72:70, 96:35, 24:1}` exactly,
and `getSlashUsage` at `:1921-1930` is verbatim. I went further: `XMLNpc.as:361-364` applies the same
48 floor, so 24 is dead on the NPC path too.

`stancerestriction-is-dead-data` — `grep -rln` returns exactly one file per tree, at exactly the cited
lines. 53 rows in `itemdata.xml`, matching. Web parses and never reads; Android only prints it.

The four **UI-slot** claims — `InventoryUI.as:162-178` is the nine-constant ladder,
`:268-269` binds RING1/RING2 to `equipAccessory1/2`, `:521-535` and `:823-824` confirm it twice more,
and the web twin `§1t5957s0§.as:175-193` / `:281-289` carries the identical table. **I cropped the frame
myself** (`reference/frames/s21_weapon/t708.0.png`, `(170,240)-(870,1040)` ×2 LANCZOS) and the nine boxes
read hat, mask / armor, gloves / pants, weapon / ring, shoes, ring — SLOT index order exactly, with the
two identical empty rings bottom-left and bottom-right and no neck box anywhere.

`weapon-ladder-minlvl-coverage-and-prog-spike` (QUOTE_UNVERIFIED) — **lint artifact, quote found.**
`ItemGenerator.as:157/164/171` each carry `progN[MAXINDEX] += 10;` and the prog4 and prog5 loops get
none. `MAXINDEX = 79` at `:58`. My own parse: 982 items, 158 with `<mindamage>` all `<type>9</type>`,
122 of those with `<minlvl>`, range −4..79. Every number reproduces. This deserves HELD, not PARTIAL.

The five **fifth-colour** claims are five statements of one fact and every line cite is exact.
`§1t17s0§.as:42` declares `xp`, `:677`/`:679` gives `#ff9900` **above** the unique branch, `:698`/`:700`
gives `#ff6600`, and `:767` / `:834` are two further sites. `grep -rn 'ff9900|ff6600'` over all 559
Android scripts returns **nothing**, and `grep -c xp` over Android `Item.as` returns **0**. Five bands in
the target build, four in Android.

`web-condition-string-11496-unresolved` — the eighth branch is at `:1028-1037` and Android's ladder
stops at seven. `strings.json["11496"]` is `None`, checked directly.

`web-save-format-has-modifier-id-206` — all six references resolve, `copyModifiers` really is
`:317-330` blacklisting 85/86/87/88. Under-claim logged: the web reserves **three** extra ids
(206, 207, 208), not one.

### Combat / AI (5 claims)

`kh-1500-1501-are-reversed-and-dual-stance` — **every quoted line number is exact to the line.**
`EnemyPlayer.as:836/838/840/842/844/846`. I checked the data side too: `skilldata.xml` rows 1500 and
1501 are category 11 with empty `<desc>`, and `strings.json` has no entry for either — so the
STILL_UNHELD residue on their *display* names is honest.

`kh-base-aicountermax-is-24-not-12` — core fact exact (`NP C.as:22` = 24, reload at `:290`,
`EnemyKnife extends NPC`), but "only EnemyPlayer overrides it" is wrong: **four** classes set 12
(`MCSPlayer.as:165`, `EnemyPlayer.as:52`, `EnemyElite.as:18`, `FriendlyElite.as:18`). All four are the
EnemyPlayer rig, so the two-cadence conclusion survives; the enumeration does not.

`kh-boss-scaling-build-divergence` — nine line cites, all nine exact. Web floors
`hitsToKillPlayer` at 3 (`:118`), Android at 2 (`:103-105`). Web sets `minDamage = 1` (`:146`) and
routes `playerHP/hitsToKillPlayer` to a separate field (`:147`); Android derives `bossATK` (`:132-135`).
Bands 1.25/1.2/1.1/0.8 vs 1.1/0.9. Web `:77` sets `10 * lvl` with no Android counterpart. And the
HP half really is identical — the four `playerhit` floors appear byte-for-byte in both.

`kh-dragondance-is-in-the-web-build-too` — `§1t5495s0§.as:70-71` verbatim, and I confirmed the
"same line numbers" claim: `grep -rln` puts the trigram array at line **70** in `DragonDanceUI.as` in
both Android trees and at line **70** in the web class. `§1t8695s0§.as:172/176/188` = `"1246"`,
`"4216"`, `"6241"`, all exact.

`kh-greenline-and-redline-are-named-in-both-builds` — `InputManager.as:172/174/177/179` verbatim, web
twin at `§1t1541s0§.as:174/179`. Arithmetic checks: 39168 = 0x009900, 10027008 = 0x990000.

### Meta / social (23 claims)

**Frames I opened and read myself:**

| frame | what I read |
|---|---|
| `Nr4fQstqHDM/map/frames/frame_0084.jpg` (512×288, ×3) | `WAR ROOM RULES 1/7  (JOINING A BATTLE)` + body matching `strings.json["370"]` word for word, typo "you can may" included |
| `seg-20/frames/frame_0011/0012/0013` (1024×576, ×3) | `1/7`, `3/7`, `6/7` — and my own 20-row title-strip contact sheet shows no other rules page in seg-20 (0001-0010 are the level-10 dialog, 0014 is `SELECT TERRITORY`) |
| `seg-29/frames/frame_0013.jpg` (1024×576, ×3) | `WAR ROOM RULES 3/7 (ATTACKING AND DEFENDING)`, verbatim `strings.json["374"]` |
| `seg-29/frames/frame_0015.jpg` (×2) | `CLAN CROPS: 402 (+2 HQ)` and `ALLEGIANCE: CLAN AKA RYU / RANK: RECRUIT (3 MOVES A TURN) / MOVES MADE: 0/36`, `3 MOVE(S) LEFT` |
| `seg-29/frames/frame_0019.jpg` and `frame_0020.jpg` | `NEXT TURN IN 1:00:00` and `NEXT TURN IN 59:58` |
| `map_analysis/zFtCaTO0_1M_map_006..015` (10 cells) | skills panel, mining NPC, `RARE CROPS COLLECTION (0X)`, `VEGETABLE PATCH` — **no hex board, no war-room map** |

**THE FRAME WINS, twice, and both times the claim that says so is right.**
`android-string-table-is-not-v0717s-copy`: the frame renders `1/7`, `strings.json["369"]` reads
`1/6`. `rank-ladder-a1-confirmed`: the frame renders `RECRUIT` and `/36`, `ui_strings.txt:215` reads
`soldier` and `/60`. Both placeholders must not be ported.

`desktop-v0717-decompile-was-on-disk-unopened` (QUOTE_UNVERIFIED) — **lint artifact.** I verified all
six sub-claims: bundle counts 970/1079 from `actionscript.json`; `max=7` vs `max=6`; the barricade
owner conjunct at `:2123` vs its absence at `:2285`; both `expArray`s parsed to 99 identical entries
with `a[79] = 4025800`; `:192/194/196/264` = 60 / 2·60 / 60·60 / 30; `:1321/1388/1407` = 500 and
`:1413/1423/1433/1443` = 10000/5000/10000/10000. Even the negative holds — `grep '> 60 &&'` finds
`OverworldHUD.as:1333` in Android and nothing in the 645 web scripts.

`clan-pays-5-coins-per-move-and-war-hero-grants-clan-deed` is the strongest of the three coin-per-move
claims because it holds in **code**: `WarUI.as:241` is verbatim
`OverworldHUD.instance.lootDialog.addLootCoins(5);`, the first statement of `useWarMove`. Item 2212
resolves to `Clan Deed`, desc `Form your own clan. / War Hero rank required.`

`enemy-remap-second-witness` (QUOTE_UNVERIFIED) — **lint artifact.** `InteractUI.as:365/370/375/380`
are exact to the line, and the guard the claim adds — `WarHexUI.as:1733`
`if(tempid >= 200 && tempid < 600)` — is exact and is precisely why the 700-block singletons are never
remapped.

`survivalmode-*` (A3) — I re-ran the byte check. Sizes, both SHA-256 prefixes, CRLF-normalised sizes
(11,166 / 10,998), 556 lines, 14 differing, differing enemy indices `[73..86]`, 39 waves / 87 enemies /
351 qty in both, `{400-block 340, 700-block 11}`. **Every figure reproduces.**

`war-boss-npcs-unresolvable` — citelint said UNCHECKABLE for an empty `cite` field, but the quote names
its artifacts precisely and all of them check out: 495 npc rows running 0..656 then jumping to 800..819
with no 7xx row; zero `<id>70x</id>` hits in the 228,455-byte Android npc blob; `resolved_names.json`
returns `None` for 700/701/705/710; and `bindata/119` holds exactly 11 singleton rows. **STILL_UNHELD is
the correct answer and I am not going to punish it for being one.**

`web-chikako-ladder-differs` — I opened the Android counterpart the claim only asserted:
`InteractUI_chikako.as:24` = `[0,10,30,60,100,150]` and `:40` weights achievement score ×1. Web is
`[0,50,150,300,500,750]` and ×5. Exactly 5× steeper, exactly ×5 weighting.

`web-lang-is-network-loaded` — the structural key to the whole packet. `§1t1521s0§.as:5-6` imports
`URLLoader`/`URLRequest`, `:122` is `getString`, `:47`/`:60` print `Loading language data...`, the fetch
is `:228-229`. Android's `LangManager` imports neither. This is why 11016 / 11017 / 11496 resolve to
nothing on disk — and it is what makes the payload.xml placeholder rule (see the refutation) hold
generally.

---

## Corrections logged against claims that still survive

These are cite defects, not wrong findings. Each one is recorded in the JSON `reason`.

| claim | defect |
|---|---|
| `two-ring-slots-are-accessory1-and-2` | "setNeck exists only at MCSCharacter.as:795 and MCSBust.as:47" — `:47` is a **call site**; the declaration is `MCSBust.as:359`, and `CreateCharForm.as:229-237` references it too. Also `setHat`/`setHair`/`setHead` all draw `HatDummyIcon`, so `setAccessory` is not the only repeated dummy. |
| `ui-slot-mapping-resolved` | the 11001 pants test is at `:491`, not `:493` (`:493` is `pantsIcon.visible = true;`). |
| `kh-base-aicountermax-is-24-not-12` | four classes set 12, not one. |
| `clan-pays-five-coins-per-move` | `WarTerrain` constants are at `:8`/`:10`/`:12`; the cite `:9-13` misses `TERRAIN_FIELD`. |
| `web-barricade-guard-stricter` | the Android guard is `WarHexUI.as:2285`, **not `:2287`** (`:2287` is `toValue += 2;`). Two sibling claims give 2285 correctly. |
| `rank-ladder-a1-confirmed` | `NEXT TURN IN 59:58` is `frame_0020`; `frame_0019` reads `1:00:00`. |
| `second-longplay-never-swept` | the skill is `CRITICAL EVADE`, not `CRITICAL EDGE`; the NPC is `TAKAHASI`, not `TAKAMASU`. |
| `warrules-page3-frame` | the frame is 1024×576, not the stated 512×288; and "the only delta on pages 1-6" generalises from three sampled pages. |
| `web-save-format-has-modifier-id-206` | under-claim: three extra modifier ids (206, 207, 208), not one. |
| `sell-weight-is-stack-weight-and-builds-diverge` | "sole call site" is Android-only; the web has two. |
| `desktop-v0717-decompile-was-on-disk-unopened` | `shs3_payload/scripts` holds 652 entries but **645** `.as` files (7 are package dirs); Android 559 / 553. |

Two claims arrived flagged **QUOTE_UNVERIFIED** and were lint artifacts in every case — the quote strings
embed `File.as:NNN` prefixes and inline braces that the matcher cannot find. All four
(`weapon-ladder-minlvl-coverage-and-prog-spike`, `desktop-v0717-decompile-was-on-disk-unopened`,
`enemy-remap-second-witness`, `side-to-clan-bound-in-code`) located cleanly by hand.

---

## New findings (8)

Full records in the JSON. Headlines:

1. **`payload.xml` static DefineEditText copy is authoring placeholder, not shipped UI copy** — the
   general rule behind the refutation, and a lane-wide porting hazard.
2. **`§1t478s0§` is modifier id 208** — closes the PARTIAL on the web sell-weight input, and adds ids
   207/208 to the web save schema.
3. **The 48 slash floor is duplicated on the NPC path** (`XMLNpc.as:361-364`).
4. **Four classes run the 12-frame AI cadence**, not one.
5. **The web build has a second `getSellAmt` call site** (`§1t6172s0§.as:417`).
6. **The war turn is bracketed on film** by frames 0019 (`1:00:00`) and 0020 (`59:58`).
7. **The two clan palettes differ on only two of four sides** (green and cyan).
8. **Web-only survival enemy 443 resolves to 'Soldier'** — the divergent wave rows are fully named.
