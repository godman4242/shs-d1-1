# Blind cite-lens review — packet `t2-corroborating-01` (45 findings)

**Verdict summary: 45 judged, 0 skipped, 0 refuted, 6 new findings.**

All forty-five findings in this packet are corroborating (`overturns_ledger=false`), so no
overturn had to be adjudicated. I opened an artifact myself for every one. Nothing in the
packet failed the cite lens badly enough to be REFUTED — but nine findings carry defects that
must not enter the ledger unfixed, and two of those defects are checkably-false sentences
rather than cosmetic slips.

I re-derived, rather than re-read, wherever a claim was a measurement: the four SWF headers,
the XLIFF id/resname census, the questdata word counts, the map-bitmap frozen-ring count, the
SHS3Resource SymbolClass table, and three frame pixel scans. Every one of those reproduced the
finding's numbers.

---

## 1. Findings whose numbers I reproduced independently (not merely re-read)

| finding | my recomputation | agreement |
|---|---|---|
| `cite-audit/shs3-swf-loader-is-cws-v10` | own SWF header parse of all four files | exact — shs3.swf **CWS v10** 800x690 24.000 fps 2 frames; preloader v10; payload v17; android payload v26 800x480 |
| `cite-audit/lang-bin-id-column-is-contiguous...` | own utf-16-le parse of `118_Mobile_Lang_EN.bin` | exact — 2,555 trans-units, ids `set == set(range(2555))` **True**, 1,905 numeric resnames, the same **12** resname gaps, and the same **12** resnames missing from `strings.json` (665, 820, 5002, 5017, 5022–5025, 5034, 7003, 7041, 9000) |
| `housekeeping/questdata-text-word-count-is-40119` | own ElementTree + regex counts | exact — 3,307 nodes, **40,119** vs **40,135**; the 16-word delta is 14 `<br/>` + 2 `<font>` pairs |
| `world-exploration/frozen-ring-is-19-territories-recomputed` | own PIL decode of `110_Mobile_MapBitmapData.bin` | exact — GIF89a 63x72, **735** land cells, **19** in the Manhattan≤4 diamond, `{3:1, 4:2, 5:4, 6:5, 7:7}` |
| `s26d/acc3007-has-no-symbol...` | own XOR-key-104 decrypt + SymbolClass parse of `115_Mobile_SHS3Resource.bin` | exact — CWS v17, 1,040,849 bytes inflated, 1,912 symbols, acc family = **acc3000–3006 + acc3008**, acc3007 absent |
| `world/placenames-blob-is-byte-identical-across-builds` | `cmp` + byte compare | exact — identical at 5,698 bytes, 677 entries, index 660 `Iwakuni` |
| `cite-audit/frame-to-stage-vertical-transform...` | own numpy scans of `Nr4fQstqHDM_428.0.png` | exact — content cols **52..1867** (1816 px), slot box **1448–1559 / 961–1072** at thr 150, centre **(1503.5, 1016.5)** |
| `nf/web-only-survival-enemy-443-is-named` | own difflib diff of the two survival blobs | exact — web `449\|454\|449\|454\|443`, android `449\|454`; 14 divergent rows; npc 443 = **Soldier** |

The A1 frame claims I judged by cropping and looking, never from a filename:

* `nf/war-turn-timer-bracketed-on-film` — crop (0.60,0.84)-(0.99,0.96) x4: frame_0019 **“2 MOVE(S) LEFT / NEXT TURN IN 1:00:00”**, frame_0020 **“NEXT TURN IN 59:58”**. Bracketed.
* `s26d/seg10-frame0020-carries-four-hostiles-not-three` — crop (150,250)-(1024,500) x2: **four** green HP bars over four hostiles (one still fully airborne, bar already drawn), plus the yellow-labelled `GUEST` player. frame_0019 at the same crop: none of them. **THE FRAME WINS over the head-count of three.**
* `newfind/frame-confirms-web-maxdueltokens-40` — top-bar crop x3: `BUY`, `COINS 630` (grey ingot in a green diamond), `GOLD 2` (yellow oval), `GET GOLD`, `REFRESH SHOP`, and `40/40` under `DUEL TOKENS`.
* `newfind/writ-badge-glyph-is-premium-gold-not-coins` — badge crop x10 shows `25` + the **yellow-oval** glyph; my wider tile crop shows the tile is literally titled **WRIT OF RELEASE / OWNED: 0 / USE THIS ITEM TO LEAVE YOUR CLAN**, matching `resolved_names.json` item 2203 name *and* desc. Stronger than the finding claimed.
* `world/kasuta-is-on-film-in-the-web-build` — banner crop x3: **E KASUTA FIELD** with travel row **E KASUTA MOUNTAIN PATH (N)**; minimap crop: **TERRITORY (21,51) / SECTOR (4,3)**.

---

## 2. Defects recorded (survive, but must be corrected before banking)

**Two checkably-false sentences (material):**

1. `cite-audit/carry-weight-pvp-exemption-covers-only-five-of-eight-sites` — “only eight carry
   the `!GameEngine.isPvPRoomMode()` prefix” is **false**. My grep: **nine** exempt, **seven**
   unexempt. The finding also misses `Obj_Hut.as:48`, a seventh unexempted site. Every one of
   its eleven named per-site claims is correct, and the operational conclusion is strengthened,
   not weakened — but the tally is wrong.
2. `cite-audit/duel-hud-second-bar-is-chi-not-ap` — “The reference frames label it directly …
   `frame_0020.jpg` shows ‘CHI 15/15’” is **false as stated**. I opened it: the duel HUD prints
   a bare `16/20` and `15/15` with **no word CHI**. The literal CHI label lives on the PLAYER
   STATS screen. The finding's conclusion survives on code (`BattleUI` declares `hpbar` and
   `chibar` and nothing named `apbar` — my grep returns zero) plus the value test (blue bar
   31/31 while AP reads 32/35 on the stats screen 1.3 s earlier).

**Line-label slips (minor, all inside a correctly-given range):**

3. `cite-audit/gameengine-283-290...` — its own tail says “StatsManager writes :306-311”; the
   six writes are **:307-312** and the sixth is `stageBaseHeight`. (A cite-hygiene finding with
   a cite defect.) Its headline is exactly right: :283-290 really is `}` `}` `else` `{`
   `stageShowingFriendBar = false;` `}` `newScale` `offsetX`, and the fit branch is at :302-305.
4. `s26d/aoe-narrow-phase-is-2d-hittest` — `hitTestObject` is at **:331** not :332, `gotHit` at
   **:333** not :334.
5. `ui-hud/two-dan-title-renderers-romaji-and-kanji` — `default:` is at **:564**, not :563.
6. `s26d/web-statue-is-1t8703s0...` — the appended digit is `this.num` (props−8), not a
   “node digit”.

**Scope caveats (minor):**

7. `nf/slashusage-48-floor-is-duplicated-on-the-npc-path` — “no path in **either build**” is
   proven for the android player+NPC paths and the web *player* path (`§1t1523s0§.as:2353-2355`
   floors at 48); the web NPC path was not shown.
8. `save-schema/is-android-only-evidence` — the grep table reproduces byte for byte, and the
   conclusion is right, but the *method* is weaker than it reads: the web payload is
   name-obfuscated, so a zero-hit grep for `saveUpdate` there was guaranteed. That widens the
   hole rather than closing it. (See new finding 6.)
9. `cite-audit/frame-to-stage-vertical-transform...` — its evidence (1) (52-px pillarboxes) does
   not actually cut against Model A, which also uses 2.270 horizontally; the only real
   discriminator is the y-residual (Model B 0.2 game-px vs Model A 1.78 against a code-known
   450). The finding says so itself (“Model A is not disproved”). I additionally closed its
   stated build-parity worry — see new finding 2.

---

## 3. New findings (6)

1. **`nf-judge/carry-weight-exemption-split-is-nine-seven-and-obj-hut-48-is-a-seventh-unexempt-site`** —
   9 exempt / 7 unexempt; `Obj_Hut.as:48` is unclaimed.
2. **`nf-judge/web-battleui-carries-the-same-slot-constants-760-minus-60i-and-450`** —
   `§1t113s0§.as:170-171` carries `x = 760 - i*60` / `y = 450`, identical to android
   `BattleUI.as:133-134`. The transform anchor is a **web** constant.
3. **`nf-judge/resizehandler-statsmanager-writes-are-307-312`** — six writes, incl. `stageBaseHeight`.
4. **`nf-judge/duel-hud-never-prints-the-word-CHI`** — `BattleUI.updateChi` writes only
   `chi + "/" + maxchi`; confirmed on film.
5. **`nf-judge/resource-decrypt-key-is-filename-charcode-1-per-resource`** — the XOR key is
   `resourceFileNameArray[num].charCodeAt(1)`, i.e. the **second letter of the filename**:
   shs3resource **104**, musicresource **117**, soundresource **111**, imageresource **109**,
   bgresource **103**. This reconciles the brief's C1 (109) and C3 (111) and predicts the rest.
   `decryptByteArray` also only touches bytes 3..255, which is why these blobs still start with
   a readable `CWS` magic.
6. **`nf-judge/name-greps-over-the-web-payload-are-not-evidence-of-absence`** — `getSellAmt` is
   `§1t546s0§`, `isNoChangeTown` is `§1t70s0§.§1t1140s0§`. “Zero hits under `shs3_payload`” is
   the state of the evidence, never a finding about the web build.

---

## 4. Why nothing was refuted

This packet is unusually clean because most of its findings were already *corrections* of
earlier claims, produced by re-opening the artifact rather than by re-reading a summary. The
strongest confirmations came where a finding predicted something checkable that it had not
itself checked — e.g. the frozen-ring level histogram falling out of a GIF decode I ran from
scratch, the acc-symbol set falling out of a decrypt whose key I derived from
`ResourceManager.as:41` + `:186` rather than taking on trust, and the shop tile turning out to
be titled *Writ of Release* with the exact `<desc>` string `resolved_names.json` carries for
item 2203.

Machine-audit status was not predictive: of the eleven `QUOTE_UNVERIFIED` findings, **all
eleven** located their quote once I opened the file — the linter was defeated by `this.`
prefixes, escaped quotes, `·`-separated multi-file quotes, and quotes that were computed output
(a dict, a `cmp` result, a pixel scan) rather than file text. The real defects were in
`RESOLVES` claims, which is where the lens has to do the part a script cannot.
