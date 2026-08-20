# CITE-LENS REVIEW — unit `src-uistrings-payload`

Blind critic. I did not see the surveyor's reasoning. I opened every cited artifact
myself and re-derived every number I could re-derive. Verdicts below are mine.

**Headline:** this is the most cite-accurate unit I have audited in this lane. 19 claims,
**19 cites resolve**, **19 quotes appear verbatim at the stated line**, **0 fabricated
cites**, **0 off-by-N line numbers**. Every cross-build absence check ("0 of 2,533") that
I re-ran came back exactly as stated. The tag counts in the STILL_UNHELD claim are exact
*including self-closing elements* — my first grep disagreed and my grep was the wrong one.

Six claims carry a factual error that I could demonstrate. One of those is material and
changes what a port would build.

---

## Re-derivations that came back EXACT

| stated | my command | result |
|---|---|---|
| 1,313 distinct web `getString(N)` ids | `grep -rhoE '\.getString\([0-9]+\)' scripts/ \| grep -oE '[0-9]+' \| sort -nu \| wc -l` | **1313** ✓ |
| 765 resolve / 548 absent / 41.7% | joined against `docs/gauntlet/L0/index/strings.json` | **765 / 548 / 41.7%** ✓ |
| block 11000-11515 = 339 ids, 41 classes | id filter + `grep -rl` | **339 / 41** ✓ |
| block 22000-22104 = 93 ids, 19 classes | id filter + `grep -rl` | **93 / 19** ✓ |
| Android 771 ids, 0 unresolved | same join on `shs3_android/scripts` | **771 / 0** ✓ |
| strings.json largest numeric key = 9010 | `max(int(k))` | **9010** ✓ |
| 807 `DefineEditTextTag` | `grep -c` | **807** ✓ (but **806** `initialText=`) |
| 263 `surfaceFilterList` | 524 paired + 1 self-closing | **263** ✓ |
| 9 `morphFillStyles` / 9 `morphLineStyles` | 18 occurrences each | **9 / 9** ✓ |
| 554 `zonedata` / 9 `zoneTable` | 1108 paired; 14 paired + 2 self-closing | **554 / 9** ✓ |
| 60 `.php` endpoint strings | `grep -c '<item>[^<]*\.php</item>'` | **60** ✓ (range wrong, see below) |
| 11 emotes | `payload.xml:121490` | **11** ✓ |
| graveyard in 9 Android scripts | `grep -rli graveyard` | **9, exactly the 9 named** ✓ |
| odds/tournament/emote/staff/kitchen/workshop/crates/capacity = 0 of 2,533 | scan of strings.json values | **all 0**; graveyard **1** (`["1016"]`) ✓ |
| bounds 264 × 371.6 px | `payload.xml:592222` Xmax-Xmin=5280tw, Ymax-Ymin=7432tw | **264 × 371.6** ✓ |
| GLOWFILTER blur 10/10 strength 5 passes 1 | `payload.xml:592239` | ✓ |

---

## REFUTATIONS

### R1 — MATERIAL — `warroom-rules-web-uses-android-id-set`

**The web build ships SEVEN War Room rules pages, not six.**

```
reference/decompiled/shs3_payload/scripts/§1t7924s0§.as:23   internal var max:int = 7;
reference/decompiled/shs3_payload/scripts/§1t7924s0§.as:121  case 7:
reference/decompiled/shs3_payload/scripts/§1t7924s0§.as:122  this.warrulestitle.text = §1t1521s0§.getString(11016);
reference/decompiled/shs3_payload/scripts/§1t7924s0§.as:123  this.warruleswords.text = §1t1521s0§.getString(11017);

reference/decompiled/shs3_android/scripts/WarRules.as:23     internal var max:int = 6;
```

Ids **11016 / 11017 sit inside the dead 11000 block** the same unit's claim 1 proves is
unresolvable — so page 7's copy is UNHELD and unrecoverable from this corpus.

Worse for portability: the six Android titles are literally page-numbered.
`strings.json["369"]` = `War room rules 1/6  (joining a battle)` … `["379"]` =
`War room rules 6/6  (building structures)`. A seven-page reader cannot ship titles that
say "1/6". So the claim's core sentence — *"the Android table's rules pages ARE the v0.717
runtime copy"* — is false for all six **titles**, and the deck is short by one whole page.

What survives: the twelve id slots 369-380 are fetched in the same order in both builds
(`§1t7924s0§.as:96-119` vs `WarRules.as:94-117`, both verified line-by-line), so the six
**body** strings remain the best available v0.717 text. Fix: re-scope the claim to bodies
370/372/374/376/378/380, re-number the titles, and record page 7 as unheld.

### R2 — MATERIAL — `uistrings-is-design-time-not-shipped`

The rule is right; the **universal quantifier is not established**. The cite proves the
runtime overwrite for **12 fields** (characterIDs 744-755 — I read all twelve and confirm
the authored deck is a different revision: authored 5/6 = *WINNING AND LOSING*, 6/6 =
*rank*; shipped 5/6 = *rank*, 6/6 = *building structures*). The claim then asserts it of
all **807**.

Counterexample, opened by me: `payload.xml:2633162` characterID 3539 (instance name
`colorText`, inside sprite 3540) has `initialText` = **`FIGHT!`**. It *is* overwritten at
runtime — `reference/decompiled/shs3_payload/scripts/§1t5533s0§.as:72`
`this.§1t5147s0§.§1t15877s0§.colorText.text = §1t1521s0§.getString(104);` — and
`strings.json["104"]` = **`FIGHT!`**. Authored words == shipped words. So "not shipped
v0.717 copy" is false for at least this field, and 1,313 ids > 807 fields does not entail
that every field is written.

Also: 806 fields carry `initialText`, not 807 (one `DefineEditTextTag` has none).

The surveyor's own `lane_impact` already states the correct, hedged rule ("…unless you
have shown no getString writes that field"). Promote that sentence into the claim text and
drop the 807-wide assertion.

### R3 — MINOR — `server-rpc-surface-is-enumerable`

Core HELD and independently re-derived: `payload.xml:119329` `<item>loaddata.php</item>`
with its wire fields at :119330 `lastupdate` … :119342 `goldbought`, `savedata.php` at
:119343 with :119344 `battlestats` … :119346 `playerdan`. §6's "nothing to copy" for
server topology is dead.

But **"60 endpoints contiguous at payload.xml:118550-121372"** is wrong twice:
- Not contiguous — the 60 `.php` strings run 107645 → 121359 with 3 big gaps.
- The stated range holds **58** of them; the two outside it are `http://www.ngads.com/gateway_v2.php` (:107645) and `adtest.php` (:116864), which are ad-network, not RPC. :121372 is `<item>hatscolor</item>`, not an endpoint.
- The claim's own category breakdown sums to 43, not 60; the balance is ads, `.facebook.com/restserver.php` (:119821), `comic.php` (:121359) and PlayerIO auth.

### R4 — MINOR — `nine-embedded-fonts-not-two`

Nine embedded faces is right — I count nine `DefineFont3Tag` fontNames (Edo SZ :84,
_sans :50748, Calibri Bold :62495, Calibri :442040, Adobe 고딕 Std B :576878, Arial :577916,
EPSON 太行書体Ｂ :588965, Times New Roman :693554, Olivia Brush :2631822). **"with full
copyright lines" is wrong for two of them**: there are only **seven** `DefineFontNameTag`
entries. `_sans` (fontID 47) and `Arial` (fontID 1296) have no name tag and therefore no
copyright string at all.

Second problem: the "not two" baseline is stale. `art-anim-audio-feel/font-identified` is
already banked and already names **four** faces (Edo SZ, EPSON 太行書体Ｂ, Adobe 고딕 Std B,
MS UI Gothic 標準) from the Android blobs. This claim strengthens that one and should say
so; as written it reads as if only Stage-0 S0-2 existed.

Both the `FIGHT!` (Olivia Brush 1600tw = 80pt, cid 3539) and `(十段)` (EPSON, cid 1483)
usages verified exactly as stated.

### R5 — MINOR — `character-stat-sheet-complete`

Not 17 rows. The field's `initialText` holds **19 `<p>` elements, three of which are empty
spacers → 16 content rows**: hp · chi · physical dmg · critical dmg · piercing dmg ·
fire/water/wind/earth atk · physical def · fire/water/wind/earth def · slash distance ·
skill cooldown modifier. No reading of the field yields 17 (counting hp regen / chi regen
separately gives 18).

Everything else verified exactly: characterID 1548, Edo SZ, fontHeight 280 (14pt),
`align="2"` (centre), `leading="40"`, bounds 264 × 371.6 px, textColor 204/204/204, and
**exactly four** stance-qualified rows (physical dmg, critical dmg, physical def, slash
distance) — matched from the other side by `shs3_android/scripts/InventoryUI.as:1940-1970`,
which I opened: `dmgModifier` / `critModifier` / `defModifier` / `slashModifier` and
nothing else. Parity hits `strings.json["876"]`/`["112"]`/`["115"]` all confirmed.

### R6 — MINOR — `emote-and-chat-command-surface`

11 emotes exact ✓. **"21-command" undercounts.** Parsing every `<item>/…</item>` in
payload.xml 121100-121600 I get **31 distinct non-emote commands**, including three the
claim's stated ranges miss entirely: `/picture` (:121271), `/enableconsole` (:121506),
`/transitionoff` (:121507) — debug/console commands, not player chat. Full set:
/ally /allyroom /ban /createprivate /disablepvp /emotes /enableconsole /help /help:ally
/help:channel /help:emotes /hidehud /ignore /invite /join /kick /leave /leavetown /list
/picture /ping /recall /showally /showignore /stopally /stopallyall /stopignore
/tournament /transitionoff /unban /whoisonline.
(20 carry an inline `#CCCCCC` help description; the bracketed-arg forms split theirs
across items, which is probably where "21" came from.)

---

## CLAIMS THAT SURVIVED MY OWN CHECK, UNCHANGED

- **`web-ui-string-ids-outrun-android-table`** — every number reproduced exactly. I also
  confirmed the negative: no `resname="11003"` exists in any of the 42 Android blobs
  (UTF-16LE-decoded before searching, per the lane's trap note), and no lang table lives
  in `reference/extracted/bindata/`. The 11000/22000 blocks really are unportable.
  *Nit only:* "42% of the web build's interface copy" is id-weighted, not
  frequency-weighted — 42% of the **ids**, not provably 42% of the words on screen.
- **`warroom-earlier-design-preserved-in-payload`** — cid 744-755 read in full. `kidk`
  typo at :528060 confirmed, `strings.json["374"]` fixes it to `kick`. The authored deck
  has *no building-structures page at all*, which is even stronger staleness evidence than
  the typo. **Frame-vs-doc invariant does not apply here — no frame shows this screen.**
- **`duel-betting-book-is-web-only-with-full-odds-math`** — formula, rake tiers and 0.7
  case all verified. See N4 below: a decompiler artifact at :230 would make a re-deriver
  think the rake branch tests an uninitialised NaN. It does not.
- **`bets-are-tokens-paid-out-in-gold`** — honest PARTIAL, cite exact.
- **`golden-tokens-are-spendable-in-v0717`** — both cites exact (`§1t7144s0§.as:22` is
  `public var goldenTokenText:TextField;`). Honest PARTIAL.
- **`tournament-field-set-and-create-form`** — field set and all five sample-value lines
  verified (cid 891 `10`, 893 `80`, 894 `24 hours`, 895 `yes`, 897 `400 / 200 / 100`).
- **`pvp-transport-is-rtmfp-p2p`** — *stronger than claimed*. It is not just string-pool
  presence: `§1t251s0§.as:279` `§1t2035s0§ = "rtmfp://218.99.12.19/shs3/";` and :283
  `= "rtmfp://p2p.rtmfp.net";` are live assignments, and `§1t2027s0§.as:338` constructs
  `new NetGroup(...)` on that connection. Upgrade the cite.
- **`warroom-build-menu-is-ladder-in-web-copy`** — exact. `WarHexUIBuildMenu.as:195`
  `case WarHex.HEX_LADDER:` with 5000 on the next line; web cid 639 says *Ladder*,
  `strings.json["568"]` says *Tunnels*.
- **`duel-replay-is-a-first-class-feature`** — all six cites exact.
- **`clan-hq-rooms-staff-missions-absent-from-all-12-systems`** — all fourteen sampled
  lines verified verbatim. Honest PARTIAL with an honest limit statement. See N2: the
  subsystem has a name and the name is not obfuscated.
- **`weapon-unbreakable-price-differs-between-builds`** — the cleanest claim in the set.
  `ui_strings.txt:471` = 5 gold, `strings.json["669"]` = 2 Gold, `§1t5777s0§.as:180`
  overwrite, `§1t401s0§.as:620` getString(636). All four opened.
- **`war-sector-panel-format`** — honest PARTIAL that refutes its own inference. Both
  `"???"` literals are the clan-acronym fallback, exactly as stated
  (`§1t3318s0§.as:3169`, `QueryManagerPIO.as:2816`, both `param1.acronym = "???";`).
- **`payload-tag-families-unswept`** — a correct STILL_UNHELD with exact counts. Do not
  penalise this; it is the right answer, right.

---

## NEW FINDINGS

- **N1 `warroom-web-has-a-seventh-rules-page`** — see R1.
- **N2 `tower-is-the-name-of-the-thirteenth-system`** — the room/staff/mission subsystem
  of claim 16 is called the **Tower**, and its identifiers are *not* obfuscated:
  `payload.xml:121698-121702` `TowerRoomStairs` / `TowerRoomHut` / `TowerRoomHutEntrance` /
  `TowerRoomHutKitchen` / `TowerRoomHutWorkshop`, resolved at runtime in
  `§1t412s0§.as:866-928`. It has its own language file (`tower_en.xml` :118543), its own
  RPC (`playerio/logtowerget.php` :119328) and its own gate fields (`towerreq` :106222,
  `notowerget` :120371). **`tower` returns 0 files in `shs3_android/scripts` and 0 of
  2,533 table entries — web-only**, like the tournament and the betting book. This closes
  claim 16's own stated gap ("the web scripts are name-obfuscated so an identifier-absence
  check is not evidence there") — for this subsystem they are not.
- **N3 `web-lang-files-are-en-fr-es-only`** — the exact Wayback target list, which the
  coverage note guessed at: `payload.xml:118534` `<item>strings/</item>`, :118535-118537
  `shs3_en.xml` / `shs3_fr.xml` / `shs3_es.xml`, :118543-118545 `tower_en.xml` /
  `tower_fr.xml` / `tower_es.xml`. There is **no `_zh-CN`** in the pool. Loader copy at
  :118531-118533 confirms three locales (EN/FR/ES) and nothing else.
- **N4 `rake-branch-tests-the-pool-not-a-nan`** — protects claim 5 from a re-deriver.
  `§1t396s0§.as:230` reads `if(_loc10_ > 100)` where `_loc10_` was declared `NaN` at :121
  and never assigned — an FFDec register-aliasing artifact, which would make the whole
  rake rule look like dead code. The **second copy of the same routine in the same file**
  disambiguates it: `§1t396s0§.as:545` `if(_loc7_ > 100)` with `_loc7_` = pool at :537.
  The rake rule as claimed (0.80 above 100, else 0.85) is correct.
- **N5 `fight-wordmark-is-the-live-duel-intro-field`** — upgrades claim 11 from a static
  tag to a live render path, and is R2's counterexample: cid 3539 (Olivia Brush, 80pt) is
  placed as `colorText` in sprite 3540 and written at `§1t5533s0§.as:72` with
  `getString(104)` = `FIGHT!`, the same words it was authored with. Android twin:
  `DuelIntroBar.as:69`.
- **N6 `web-and-android-font-sets-diverge`** — the web payload embeds **Arial**
  (`fontID="1296"`, :577916), `_sans`, Calibri, Calibri Bold, Times New Roman and Olivia
  Brush that the banked Android font list does not have; the Android build embeds
  **MS UI Gothic 標準**, which the web payload does **not**. Any "the font is closed"
  statement has to say which build.
- **N7 `chat-surface-is-31-commands-including-three-debug`** — see R6.

---

## PROCESS NOTE

No reference frame can rule on any claim in this unit — every one is about static
`DefineEditText` defaults or AS3 string constants, and the unit's own claim 2 establishes
that those defaults never reached a screen. The surveyor declined to manufacture a frame
cite to raise its artifact class and said so in the coverage note. That is the correct
behaviour under §0 and I am recording it as such, not as an omission. I searched
`reference/frames/` for a duel-intro `FIGHT!` frame that could test N5 visually and did
not find one; N5 rests on A2 and says so.
