# HUNTER REVIEW — unit `src-uistrings-payload`

Blind critic, LENS 2 (hunt under-claiming). Every verdict below rests on an artifact
**I** opened. 19/19 claims judged, 0 skipped.

**Headline:** this is a strong unit. Every one of the 19 cited line numbers exists and
every quoted string is verbatim — I re-opened all of them. 13 claims survive intact.
Six are refuted, and **five of the six are refuted for UNDER-claiming, not for being
wrong**, which is exactly the failure this lane exists to catch. The single material
factual refutation is claim 3 (War Room rules portability), which would have shipped
wrong copy.

---

## Verdict table

| # | claim | refuted | severity | why |
|---|---|---|---|---|
| 1 | web-ui-string-ids-outrun-android-table | no | — | reproduced all five numbers exactly |
| 2 | uistrings-is-design-time-not-shipped | **yes** | minor | scope over-claim; mechanism sound |
| 3 | warroom-rules-web-uses-android-id-set | **yes** | **material** | web deck is 7 pages, Android 6 |
| 4 | warroom-earlier-design-preserved-in-payload | no | — | verified line-for-line |
| 5 | duel-betting-book-is-web-only | no | — | verified + found corroborating 2nd copy |
| 6 | bets-are-tokens-paid-out-in-gold | no | — | PARTIAL is the right grade |
| 7 | golden-tokens-are-spendable-in-v0717 | no | — | correct, and now over-proved (see N4) |
| 8 | tournament-field-set-and-create-form | **yes** | minor | "numbers placeholder" is false (see N3) |
| 9 | server-rpc-surface-is-enumerable | no | — | verified; count off by 2, non-load-bearing |
| 10 | pvp-transport-is-rtmfp-p2p | no | — | all 6 corroborating pool lines verified |
| 11 | nine-embedded-fonts-not-two | no | — | best claim in the set; every line exact |
| 12 | character-stat-sheet-complete | **yes** | minor | 16 content rows, not 17 |
| 13 | warroom-build-menu-is-ladder-in-web-copy | no | — | verified both builds |
| 14 | emote-and-chat-command-surface | **yes** | minor | 21 commands undercounts; 38 shipped |
| 15 | duel-replay-is-a-first-class-feature | no | — | verified all five cites |
| 16 | clan-hq-rooms-staff-missions | no | — | all 14 vocabulary lines decoded verbatim |
| 17 | weapon-unbreakable-price-differs | no | — | verified both sides |
| 18 | war-sector-panel-format | **yes** | **material** | the fog proof EXISTS — I found it |
| 19 | payload-tag-families-unswept | **yes** | minor | blend modes are not in surfaceFilterList |

---

## Refutation 3 (MATERIAL) — the War Room rules do NOT port verbatim

The claim says the web client "fetches War Room rules ids 369-380 in the same order and
the same twelve slots" as Android, therefore "the Android table's rules pages ARE the
v0.717 runtime copy and are portable with only a weak caveat", and gives a six-page
shipped order.

The twelve-slot part is true — I re-read both switches. But the surveyor stopped reading
one case too early:

```
reference/decompiled/shs3_payload/scripts/§1t7924s0§.as:23
      internal var max:int = 7;
reference/decompiled/shs3_payload/scripts/§1t7924s0§.as:121-125
            case 7:
               this.warrulestitle.text = §1t1521s0§.getString(11016);
               this.warruleswords.text = §1t1521s0§.getString(11017);
               this.nextbutton.visible = false;
               this.prevbutton.x = 330;
```

against

```
reference/decompiled/shs3_android/scripts/WarRules.as:23
      internal var max:int = 6;
reference/decompiled/shs3_android/scripts/WarRules.as:115-119
            case 6:
               ...getString(380);
               this.nextbutton.visible = false;
```

**The web v0.717 War Room rules deck has SEVEN pages. The Android v0.682 deck has SIX.**

This kills the portability conclusion outright, because the page count is baked into the
string text itself: `strings.json["369"]` = `'War room rules 1/6  (joining a battle)'`,
`["371"]` = `'War room rules 2/6 ...'`, `["379"]` = `'War room rules 6/6  (building
structures)'`. Porting those into a seven-page web deck ships titles that are provably
wrong on the very first word. And page 7's content — ids 11016/11017 — sits inside the
web-only 11000 block that claim 1 itself proves is unresolvable (max numeric key in
`docs/gauntlet/L0/index/strings.json` is 9010). **Page 7 of the shipped War Room rules is
STILL_UNHELD, and there is no sixth-page "building structures" certainty either.**

Consequence for the lane: strings 369-380 give you the *shape* of six of seven pages, not
the shipped copy. Any port must carry an explicit "titles renumbered, page 7 missing" note.

## Refutation 18 (MATERIAL) — the fog-of-war proof exists, in the surveyor's own build

The claim graded itself PARTIAL and said: *"the only `"???"` string literal I could find
in either script tree (§1t3318s0§.as:3169, QueryManagerPIO.as:2816) is the CLAN-ACRONYM
fallback, not the troop counter — so the fog-of-war reading is inference from the endpoint
pair, not proof. Refusing to grade it HELD."*

That grep missed it because the literal is not `"???"` on its own, it is `": ???\n\n"`
inside a concatenation. It is present in **both** builds:

```
reference/decompiled/shs3_payload/scripts/§1t416s0§.as:651-658    (web v0.717)
            _loc3_ += §1t1521s0§.getString(346) + ": " + this.§1t7776s0§(param1) + "\n";
            if(!this.§1t7762s0§ && this.owner != param1)
            {
               _loc3_ += §1t1521s0§.getString(347) + ": ???\n\n";
            }
            else
            {
               _loc3_ += §1t1521s0§.getString(347) + ": " + _loc6_ + "\n\n";
            }
```
```
reference/decompiled/shs3_android/scripts/WarHex.as:591-598       (android v0.682)
            str += LangManager.getString(346) + ": " + this.getStrength(side) + "\n";
            if(!this.hasSpyData && this.owner != side)
            {
               str += LangManager.getString(347) + ": ???\n\n";
            }
```

with `strings.json["346"]='friendly troops'`, `["347"]='enemy troops'`,
`["348"]='allies here'`. The gate flag is named in the readable build:
`WarHex.as:87 internal var hasSpyData:Boolean = false;`, set true only by
`WarHexUI.as:1178` in `spyClick`, and `WarHexUI.as:931` shows the spy button only when
`!hasSpyData && owner != playerside && isOnFriendly()`. `strings.json["367"]='Scout'` is
the button label.

So: **enemy troop counts are fog-gated behind a one-shot per-hex Scout action, and this is
proved in shipped code in the same build the surveyor was reading.** The claim should be
HELD, not PARTIAL. The same block also hands over the sector-panel build order and the
terrain enum for free — `604/605/606` = `'Terrain: Field' / 'Terrain: Forest' /
'Terrain: Mountain'` — which no claim in this unit mentions.

One divergence worth carrying: the authored web field (payload.xml:484834) reads
`samurai on guard:` where the shipped id 348 reads `allies here`. Another instance of the
unit's own claim 2.

## Refutation 2 (minor) — the mechanism holds, the universal does not

The overwrite mechanism is airtight; I re-read `§1t7924s0§.as:96-119` and the twelve
authored fields at `payload.xml:528040-528084`. But three measurements say the blanket
"807 … are DESIGN-TIME PLACEHOLDERS … not shipped v0.717 copy" is not established:

- `grep -c 'type="DefineEditTextTag"' reference/extracted/payload.xml` = **807**;
  with `initialText=` = **806**. One field has none.
- Stripping HTML from all 806 and matching case-insensitively against the shipped table:
  **212 of 750 non-empty authored fields (28.3%) are verbatim-identical to a
  `strings.json` value.** e.g. cid 45 `loading...` = `["90"]`, cid 288
  `connecting to server...` = `["25"]`, cid 535 `message board` = `["317"]`.
- The web scripts declare **593** `public var …:TextField` and contain only **390**
  distinct `.text=`/`.htmlText=` assignment targets, against 806 authored fields.

The operating rule stated in the claim's `lane_impact` ("an authored TextField gives you
the FORMAT and the GEOMETRY; it does not give you the words … unless you have shown no
getString writes that field") is correct and should be the ledger text. The headline
sentence should not.

## Refutation 12 (minor) — the stat sheet has 16 rows, not 17

Everything else in this claim is exact and I verified it attribute by attribute:
characterID **1548**, `fontHeight="280"` (14 pt), `align="2"` (centre), `leading="40"`,
bounds `Xmin=-40 Xmax=5240 Ymin=-40 Ymax=7392` = 264 × 371.6 px, textColor 204/204/204,
and precisely four `(heavy)` qualifiers on physical dmg / critical dmg / physical def /
slash distance. But the field holds **19 `<p>` elements, three of them empty spacers → 16
content rows**: hp · chi · physical dmg · critical dmg · piercing dmg · fire/water/wind/
earth atk · physical def · fire/water/wind/earth def · slash distance · skill cooldown
modifier. A lane building this panel from the ledger would render one row too many.

## Refutation 14 (minor) — 21 commands undercounts the shipped surface by ~40%

The 11-emote set at `payload.xml:121490` is exactly right. The command count is not. The
shipped dispatcher is a single switch:

```
reference/decompiled/shs3_payload/scripts/§1t406s0§.as — 38 `case "/…":` branches
  emotes (11): /bow /kneel /sit /rest /seppuku /stand /shoulderweapon /gangnamstyle
               /fart /sadtrombone /rimshot
  commands (27): /recall /leavetown /tournament /enableconsole /hidehud /transitionoff
               /ally /allyroom /stopally /stopallyall /showally /ignore /stopignore
               /showignore /list /join /createprivate /invite /leave /whoisonline
               /kick /ban /unban /help /help:channel /help:emotes /help:ally
```
plus `/ping`, `/emotes`, `/disablepvp`, `/showhud`, `/picture`, `/item` in the string pool
— **44 distinct slash tokens file-wide.**

The genuinely new item is that three of these are a **developer console**:
`§1t406s0§.as:2669 case "/enableconsole":`, `:2680 case "/transitionoff":`, and the
`/showhud` / `/hidehud` pair (`payload.xml:121707`, `:121178`). A shipped in-game debug
console is a surface no ledger system has, and it is the natural place to look for
cheat/spawn affordances the lane could mine.

## Refutation 19 (minor) — blend modes are not in `surfaceFilterList`, and there are none

Honest STILL_UNHELD, correctly declared — but the hypothesis inside it is wrong and the
gap it names is closable in one command. SWF blend modes live in `PlaceObject3`'s
`blendMode` attribute, not in a filter list. Measured on `reference/extracted/payload.xml`:

```
grep -o 'blendMode="[^"]*"'                → 0 matches
grep -o 'placeFlagHasBlendMode="true"'     → 0 matches
grep -o 'type="[A-Z]*FILTER"' | uniq -c    → 206 GLOWFILTER · 57 BLURFILTER · 2 DROPSHADOWFILTER
grep -c '<surfaceFilterList>'              → 262   (claim said 263)
```

**The web payload uses no blend modes at all.** Its entire FX vocabulary is three filter
classes, glow-dominant 206:57:2. That is a real, citable characterisation of
art-anim-audio-feel blocker ③ for this SWF (scoped: `payload.xml` is the only SWF exported
to XML; a separate character-art SWF is not covered). Also `<zoneTable>` = 7, not 9;
`morphFillStyles`/`morphLineStyles` = 9 each ✓.

---

## What held, with the artifact I opened

**Claim 1** — reproduced independently. 1,313 distinct `getString(N)` ids across
`reference/decompiled/shs3_payload/scripts/`; 765 resolve against
`docs/gauntlet/L0/index/strings.json`; 548 missing = 41.7%; 339 in 11000-11515 across
**41** classes; 93 in 22000-22104 across **19** classes; Android's own 771 ids resolve
**0 unresolved**. Max numeric key 9010. Every figure exact. Cite line verified:
`§1t396s0§.as:80  this.betlabel.text = §1t1521s0§.getString(11003);`

**Claim 5** — verified, and I found the corroboration the claim needed. ⚠ The cited line
`§1t396s0§.as:230` reads `if(_loc10_ > 100)` where `_loc10_` is *assigned inside the
branch* — a decompiler register-alias artifact. Do not code that literally. The sibling
copy of the same book at `§1t396s0§.as:537-554` is unambiguous:
`:538 if(_loc7_ <= 10 && acceptingbets)` → 0.7, `:545 if(_loc7_ > 100)` → `× 0.8`,
`:551` else `× 0.85`, `:554` same round-to-0.1. So the claim's reading (tier on the
**pool**) is correct — via the sibling, not via the cited line. Two wording nits: 0.85 is
the *payout* fraction (house cut 15%), and the ≤10 case is a flat 0.7, not a floor.
Android: 0 files and 0 of 2,533 table entries contain "odds" — confirmed.

**Claim 11** — the strongest claim in the unit. `grep -o 'fontName="[^"]*"'` yields
exactly nine faces and every line number in the claim is right. `payload.xml:2633161`
`fontCopyright="Allen R. Walden's Friendly Fonts (Unprotected. Please distribute freely.)"
fontId="3538" fontName="Olivia Brush"`, and `:2633162` characterID 3539, fontHeight 1600,
fontId 3538, `initialText` = `FIGHT!` at size 80, letterSpacing −1.00, #000000. EPSON
`fontCopyright="(C) 2000 SEIKO EPSON CORP. All rights reserved."` fontId 1482 at `:590471`
carrying `(十段)` at `:590472`. Licensing split (Edo SZ + Olivia Brush free; Calibri /
Times / Adobe / EPSON commercial) is the correct call under the CLAUDE.md third-party
carve-out.

**Claim 9** — `payload.xml:119329 <item>loaddata.php</item>` ✓ and the wire field lists are
exactly where stated: `:119330-119342` = lastupdate, apupdate, dtupdate, warupdate,
skillslots, stash, questitems, intstats, achievementstats, booleanstats, ignore,
purchases, goldbought (13); `:119343 savedata.php`; `:119344-119346` = battlestats,
playerlocation, playerdan. `/war/` = 12 endpoints, `/town/` = 5, replay = 2 — all confirmed.
Count nit only: **58** `.php` items inside 118550-121372, **60** file-wide. The
cross-reference to the banked `world-exploration/save-format-is-copyable` is real
(`docs/gauntlet/L0/claims.json:2039`) and its "server-sim-topology half … stands" line is
quoted correctly — the contradiction is legitimate.

**Claims 4, 6, 10, 13, 15, 16, 17** — every cited line opened and matched. Highlights:
`payload.xml:528076` carries the 80%/Castle-HQ text verbatim and `:528060` the `kidk`
typo that `strings.json["374"]` fixes to `kick`; `ui_strings.txt:19` is the flat-3-moves
trap ✓. `:120466 rtmfp://218.99.12.19/shs3/` and `:120467 rtmfp://p2p.rtmfp.net`, plus
stratusid `:119285`, NET_STATUS `:119389`, nearID `:119392`, farID `:119396`,
`connected to netgroup` `:119398`, `NetConnection.Connect.Success` `:119400` — all six ✓.
Build menu: cid 638 `Build Menu` `:485368`, cid 734 Barricades 10000 `:527783`, cid 736
forward base 10000 `:527793`, cid 639 Ladder 5000 `:485373`, against
`WarHexUIBuildMenu.as:195 case WarHex.HEX_LADDER:` cost 5000 and `strings.json["568"]='Tunnels'`
— and the *descriptions* diverge too (`["569"]='Bypasses the surrounding natural
obstacles'` vs authored `Bypasses barriers surrounding the sector`), which strengthens the
claim. Replay: `savereplay.php :119347`, `getreplay.php :119350`, `watch?id= :121368`,
cid 3577 `:2640123` and cid 3580 `:2640172` both `watch?name=orochi`, `shareDuelTVOnWall
:119387` ✓. Rooms: I decoded all fourteen cited fields and every one matches word for
word — `merchant training room`, `modify living quarters`, `upgrade to level 2`,
`demolish room`, `no available missions.`, `mission in progress`, `success probability: 90%`,
`high risk | recommended level: 80`, `capacity: 5/5 (Full)`, `graveyard is empty.`,
`note: graveyard is full. the oldest corpse will be replaced when a new corpse arrives.`,
`mission result`, `select 5 crates`, `is now a member of your staff!`; graveyard hits
**exactly 9** Android files with the exact names given. Unbreakable: authored `5 gold` at
`:2634709` vs `strings.json["669"]='Your weapon broke!\nWould you like to make it
unbreakable for 2 Gold?'`, overwritten at `§1t5777s0§.as:180`, `§1t401s0§.as:620` reaching
`getString(636)` ✓.

All five `ledger_text` quotes verified verbatim in the ledgers:
`docs/GAUNTLET.md:306`, `:76`; `docs/research/REBUILD_READINESS.md:215`, `:235`, `:240`,
`:246`, `:349`, `:351`.

---

## NEW FINDINGS (what the surveyor's coverage_note admitted, opened)

**N1 — war-rules deck is 7 pages in web, 6 in Android.** `§1t7924s0§.as:23` `max = 7`
vs `WarRules.as:23` `max = 6`; page 7 = `getString(11016)/(11017)`, both > 9010, UNHELD.

**N2 — fog-of-war is proved, in the web build.** `§1t416s0§.as:651-658`. See above.

**N3 — shipped tournament economy numbers exist; "numbers placeholder" is false.**
Four hardcoded constants in `§1t7144s0§.as`:
`:340 this.goldenTokenText.text = "5";` (create-a-tournament cost, in the `key == "new"`
branch, hidden when `§1t1523s0§.§1t9725s0§(§1t1523s0§.§1t9464s0§)`),
`:448 _loc1_.entryfee = 0;` (**the organizer never pays entry**),
`:462 / :674 players.length == 8 || players.length == 16` (bracket sizes),
`:404 _loc3_ = _loc1_.roundduration - 300;` (300 s offset).
`:620 autostart && maxplayers == players.length + 1` confirms the authored
"autostarts upon full roster" as shipped behaviour.

**N4 — the entry fee is charged against resource id 20112.** `§1t7144s0§.as:600`
`else if(§1t1523s0§.§1t9714s0§(20112) < this.§1t7159s0§.entryfee)` (insufficient-funds
gate) and `:610` `§1t9713s0§(20112,-this.§1t7159s0§.entryfee)` (the debit), writing the
result into `goldtext`. **20112 is not an itemdata id** — `reference/extracted/itemdata.xml`
tops out at 20111 (plus 40000) and contains zero occurrences of 20112 — so it is a special
currency handle. Honest open question I did **not** resolve: whether 20112 is "Gold" or
"Golden Token". Against it being a plain item: `§1t17s0§.as:238/:249/:260` exempt it from
the stack cap alongside 2217, and `§1t6519s0§.as:540` pairs it with 20113 behind a
`getLevel() < 5` gate. Android's parallel field is heavenly gold
(`InteractUI.as:180 this.money.goldtext.text = StatsManager.getHeavenlyGold()`), which
`StatsManager.as:2669` defines as `STAT_HGOLD + PayVault coins` — i.e. the dead-IAP
premium pool named in meta-social blocker ④. Whoever ports this must resolve 20112 first.

**N5 — 38-branch chat dispatcher + a dev console.** See refutation 14.

**N6 — zero blend modes; FX = 206 glow / 57 blur / 2 drop-shadow.** See refutation 19.

**N7 — 28.3% of authored fields are verbatim shipped copy.** See refutation 2.

**N8 — the web build never had a zh-CN or ja language file.**
`reference/decompiled/shs3_payload/scripts/§1t1521s0§.as:81-83` and `:92-94` register
`Locale.addXMLPath` for **en, fr, es only**; `CHINESE:String = "zh-CN"` (`:15`) and
`§1t9275s0§:String = "ja"` (`:17`) are declared constants with no path — the only thing
either does at runtime is `:184-187`, which turns `embedFonts` **off** for those two
locales (the nine embedded faces of claim 11 carry no CJK coverage). The coverage_note's
"shs3_en.xml / _fr / _es / _zh-CN" should read **en/fr/es**. Load roots: `"./data/"` by
default (`:63`), `§1t3317s0§.instance.server + "strings/"` when remote (`:72`).
Bonus contract for whoever recovers the table: `getString(id, args)` does positional
`[0]`,`[1]`… substitution (`:143 _loc3_ = _loc3_.split(_loc6_).join(param2[_loc5_]);`)
and `§1t9288s0§` (`:164`, `:168 _loc3_ = param1.split("%");`) interpolates **inventory
counts** into odd-indexed segments — so a shipped string may contain `%2100%` meaning
"your count of item 2100".

**N10 — there is a SECOND, entirely unrecorded language table: the Tower.**
`§1t1521s0§.as:211`, `:215`, `:219` load `tower_en.xml` / `tower_fr.xml` / `tower_es.xml` from the
same root, through a separate loader `§1t9292s0§`. The three filenames are in the string
pool at `payload.xml:118543-118545`, with `towerreq` at `:106222` and the RPC
`playerio/logtowerget.php` at `:119328`. **Zero** claims in
`docs/gauntlet/L0/SEEN_CLAIM_IDS.txt` contain "tower", and no ledger system has a Tower
entry. This is a second missing-string-table gap on top of the 548 ids of claim 1, and a
second Wayback target (`strawhatsamuraiduels.com/data/tower_en.xml`).

**N9 — a test content-root triplet nobody has named.** `payload.xml:120323 /testres/`,
`:120325 /testlang/`, `:120327 /testdata/`, interleaved with the production
`:120324 /res/`, `:120326 /lang/`, `:120328 /data/`. If a Wayback CDX sweep on
`strawhatsamuraiduels.com/lang/` fails, `/testlang/` is a second URL shape to try.

---

## Where I agree the gap is real

The single close-path the surveyor named is the right one and I could not shortcut it:
there is exactly **one** language blob on disk (`reference/extracted/android/118_Mobile_Lang_EN.bin`)
— no FR/ES/ZH sibling — and the web payload's 27 bindata files are already fully
identified by Stage-0 S0-1 as animdata/survivalmode/room-objects/name-gen/GIF, none of
them a string table. So the 548 web-only ids, page 7 of the war rules, and the shipped
web value of id 669 are genuinely **STILL_UNHELD**, and a Wayback CDX query against
`strawhatsamuraiduels.com/data/shs3_en.xml` (note: `./data/`, not `/lang/`, per
`§1t1521s0§.as:91-92`) is the one action that collapses them.
