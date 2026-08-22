# Blind cite-lens review — packet `t1-overturns-01` (judge s26c)

**Packet size 24 · judged 24 · skipped 0 · refuted 0 · overturns upheld 23 of 24.**

Structured verdicts: `docs/gauntlet/L0/critics/t1-overturns-01.cite.s26c.json` (written BEFORE this file).

I opened every artifact myself. Where a claim rested on a computation (md5 census, SWF
decrypt, XML diff, frame read) I re-ran the computation rather than reading the result.
I did not open `docs/gauntlet/L0/critics/*.md` or `docs/gauntlet/L0/sources/*.md`.

---

## Headline

This is an unusually clean packet. Twenty-four claims, and **not one of them fails the
cite lens.** Every line number I checked resolved; every quoted line was verbatim where
claimed; the two `QUOTE_UNVERIFIED` flags on decompiled files are `§`-glyph encoding
artifacts in the machine pass, and the three on frame/video claims are the expected
false positive when the "quote" is on-screen text no grep can find.

That is a suspicious result for a refutation pass, so I state what I actually did to
try to break them, below. Two claims carry defects I could not call fatal, one claim's
overturn does not land on the sentence it names, and four claims are duplicate pairs
that must be merged rather than counted twice.

---

## The one factual error I found

**`NF-E/survival-mode-content-diverges-14-of-87-rows`** — HELD on its headline, but it
contains a flatly false sentence.

Reproduced and confirmed: 11,721 B (web `bindata/119_1t4646s0.bin`) vs 11,553 B (android
`109_WarHexUI_SurvivalModeData.bin`); 39 `<wave>` and 87 `<enemy>` in both; identical
spawn-x histogram `{-50: 49, 1650: 37, -1650: 1}`; **exactly 14** differing `<enemy>`
rows; web `449|454|449|454|443` against android `449|454`, and the same shape for the
`450|455` and `451|456` pools.

**FALSE:** *"The unique-id sets are unequal in both directions."* I extracted every
`<id>` token from both blobs. Both carry the **same 62 ids** (400–429, 435–451, 453–456,
700–710). Web-only set empty, android-only set empty. **Enemy 443 is present in the
android file too** — what the web build changed is the alternation *pool* of 14 late-wave
rows, not the roster. Strike that sentence or the rewrite will assert a roster
difference that does not exist.

Also imprecise: the differing block runs rows **73–86**, not 73–84. Rows 85–86
(`451|456|451|456|443`, qty 6) went unenumerated. The stated total of 14 is right.

**And its overturn does not land.** The sentence it names is S0-1, *"119 `<survivalmodedata>`
(a whole game mode absent from all 12 ledger systems)"* — which this does not contradict.
It refines *which blob* to author from. What it actually overturns is a sibling finding's
byte-identity claim, not the ledger. `overturn_upheld: false`.

---

## What I did to try to break the rest

- **Focus/reload (2 claims).** Opened both files. Checked not just the lines but the
  *enclosing scope* the claims assert: `§1t99s0§.as:3162` really is inside `§1t3489s0§`
  (declared `:3083`) under the `§1t9948s0§()` isBattle guard at `:3160`. Chased
  `bonusReload` — `grep -rn` returns exactly one caller, `NPCManager.as:1711`, inside
  `if(deathCount > 0)` at `:1709`, and the web twin `§1t1543s0§.as:2049` has the same
  single-caller shape inside `if(_loc4_ > 0)`. The "+6 is a kill bonus, not the tick
  recharge" distinction is correct and is the sharpest thing in the packet.
- **Stance triangle (2 claims).** The defender-frame claim is the one I most expected to
  fail, because it is an inference from `this.stance` vs `param2.stance`. It survives: I
  walked the function table and the declaration enclosing `:3754` is `§1t99s0§.as:3661
  override public function §1t3277s0§(param1:MovieClip, param2:§1t67s0§) : Boolean` —
  the exact signature shape of android `MCSPlayer.as:3580 gotHit(target:MovieClip,
  damageObj:Damage) : Boolean`. The game's own copy agrees: `strings.json["6001"/"6003"/
  "6005"]` read defender-first exactly as the three ×1.2 pairs do. My own grep for
  `* 0.9` over `MCSPlayer.as` exits 1 — zero hits — so the android-lacks-it half holds.
- **SPD→cooldown (2 claims).** Verified with `grep -n`, not by counting, after a manual
  count came out two lines off and would have wrongly killed both claims.
- **Audio (3 claims).** I ran `decryptByteArray` myself over
  `122_Mobile_SoundResource.bin` at key 111: header `CWS\x11`, declared filelen 29,631,
  inflate 29,623, 13 `DefineSound`, `SymbolClass` naming all 13 in the claimed order,
  and all 13 sample counts identical to the list filed. `grep -rhoE '"Snd_[A-Za-z0-9_]+"'
  | sort -u | wc -l` → **43**, and the enumerated names match one for one.
- **Blob parity (2 claims).** Re-ran the md5 census in python over all 27 web blobs
  against all 42 android blobs: **21 exact matches**, six differ, and every differing
  size is right to the byte. `114_1t4641s0.bin` opens `<animdata><anim i="spider_idle"…>`
  and holds exactly the ten named spider clips with no android twin.
- **Frames (3 claims).** I did my own renders rather than reusing the filed crops.

---

## Where the frame wins — said out loud, per the standing invariant

`reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0014.jpg`, my own full-frame
2.5× LANCZOS render (1024×576 → 2560×1440). On screen, unambiguous:

> `ALLEGIANCE: CLAN AKA RYU` · `RANK: RECRUIT (3 MOVES A TURN)` · `MOVES MADE: 0/36` ·
> `3 MOVE(S) LEFT` · `CLAN CROPS: 402 (+2 HQ)` · `FLAGS INDICATE BATTLES THAT THE CLANS
> ARE CURRENTLY ENGAGED IN` · `SHOW CLAN MSG`

**The measurement doc and the frame disagree, and THE FRAME WINS.** RR:246's
reconciliation of "moves per turn" as "per hour" (36 = Private's rank threshold) is
contradicted by the shipped UI copy, which says *A TURN* in the game's own words and
pairs a 3-per-turn allowance with 0/36 as a separate cumulative counter. `3 MOVE(S) LEFT`
agrees with the allowance, not with 36. Both meta-social claims are upheld; they are
duplicates of each other, so merge.

The board is also a uniform square lattice over a vector Japan coastline, at
`WarSelectUI.as:233 warFlag.x = (terrx + TERRSHIFTX) * 10 + 4.5;` — 10 px per territory.

For the progression-on-camera claim I extracted my own frames from
`reference/videos/zFtCaTO0_1M.mp4` at 1.2× LANCZOS, full frame:

| | badge | HP | CHI | AP | ATK | DEF | SPD | points |
|---|---|---|---|---|---|---|---|---|
| `-ss 653.0` | 3 | 20/20 | 10/10 | 30/30 | 7 | 7 (+2) | 4 | 0 |
| `-ss 1600` | 4 | 20/20 | 9/15 | 15/30 | 10 | 10 (+13) | 4 | 0 |

One level-up, base deltas **CHI +5, ATK +3, DEF +3** — three points, matching the web
handlers (`§1t5957s0§.as:3406/:3422/:3434`) and ruling android's +5/+1/+1 out on camera.
The gear terms are rendered in a separate colour and cannot be confused with the base
figures. Claim HELD as filed.

---

## Defects logged that are not refutations

- **Duplicate pairs — merge, do not count twice.** `NF-C`/`NF-D` (SPD→cooldown 600),
  `newfind`/`progression` (mastery-10), and the two `meta-social` war-room claims are
  three pairs of the same artifact judged twice. Counting them as six independent
  sources would inflate confidence the evidence does not support.
- **`hunter-s26a/web-sound-resource-decrypts-to-13-mp3-sfx`** — the slug says *web*, the
  blob is the **android** `122_Mobile_SoundResource.bin`. The `build` field says so
  correctly. Bad slug, not a bad claim; rename on entry.
- **`NF-B/stance-triangle-is-defender-keyed`** — "both ×1.2 branches sit inside gotHit"
  is loose: the web build has **two** ×1.2 branches, `:3790` in the gotHit twin and
  `:4381` in the network-damage path `§1t4486s0§` (declared `:4310`). Only the first is
  in gotHit.
- **`meta-social/…-moves-a-turn-not-per-hour`** points at RR:247; the sentence is at
  RR:246. The `ledger_text` it quotes is verbatim from :246, so the cite is fine.
- **Compound ledger sentences that only half-fall** — flagged in each verdict so the
  rewrite does not delete more than the evidence kills:
  - RR:164 — `MAX_DAN_RANK=10` half falls; the `tenthGold=100` half is untouched, and
    RR:165's "film shows a flat +25 gold every rebirth" still stands against it.
  - RR:351 — the *save format* clause falls; *server-sim topology* is untouched.
  - RR:215 ① — "no XP formula either" falls; **coins-per-kill survives**, exactly as the
    claim itself says.

---

## Four new findings (mine, unclaimed by anyone)

1. **The "271 cap" IS the shipped level-80 base-stat cap — RR:201 is wrong about what it is.**
   `§1t5957s0§.as:3344-3346` gate the ATK/DEF/SPD add-buttons on `stat < 1 + (level + 10) * 3`.
   At the level cap of 80 that is **1 + 90 × 3 = 271 exactly.** So 271 is not a
   gear/rebirth-inclusive total made unreachable by a 237-point budget — it is the
   per-stat hard ceiling, and it is unreachable in one stat because *the panel stops
   granting*. Companion web ceilings from the same block at L80: MAXHP 910, MAXCHI 460,
   MAXAP 480. This strictly strengthens `progression/per-stat-caps-…`, which found the
   formulas but never substituted the level cap.

2. **The web payload carries the same `xp = lvl * 2 + 20` setLevel.**
   `hunter-s26a/per-enemy-xp-formula` hedged "web parity not checked". I checked.
   `§1t68s0§.as:258-279` is a line-for-line twin of android `NPC.as:239-260`, including
   `:271 this.xp = param1 * 2 + 20;` and the `if(param1 <= 10)` clamp of damage/defense/hp
   to 1. `grep '* 2 + 20'` over the web scripts returns **seven** sites. The per-kill XP
   award *and* the sub-L10 one-hit-kill clamp are CONTRACT at the target build. The same
   function also supplies RR:220 ① (enemy level→stat: `factor = lvl / baseLevel`, ×0.9
   below level 21) and ② (per-enemy HP = 1 at or below level 10).

3. **Survival-mode id sets are IDENTICAL across builds** — the correction to `NF-E`
   above. 62 ids each, difference empty both ways, 443 present in android.

4. **The web offline-save reset enumerates the same nineteen fields.**
   `§1t1832s0§.as:2811` opens the per-character SharedObject at `:2813` and blanks
   `:2815`–`:2833` — nineteen fields — whose plain-named members and **tail order**
   match android field for field: `playerlocation`, `taunt`, `friends` at `:2831-2833`
   against `QueryManagerBase.as:2928-2930`. So the 19-field schema is HELD at v0.717,
   not inherited from v0.682. This is what actually closes the build-parity hole the
   parent claim left open with only four plain web members.

---

## Net effect on the ledger if these enter

RR:74 gains two triangle arms (×1.2 winning, ×0.9 losing, defender-keyed, pre-defense
and pre-floor). RR:77/:199's `+10HP/+5Chi/+1AP/+3-stat` is retired as a two-build hybrid
no shipped build ever had — **web is +10/+5/+5/+3/+3/+3, android is +5/+5/+1/+1/+1/+1**,
and the `+1AP` term is wrong for both. RR:155's "mastery-9" becomes mastery-10 (numbers
were right, label off by one) and the RR:157 decide-and-flag evaporates. RR:190 ⑤,
RR:195 ③ and ④ close from source on WEB constants. RR:201's 271 explanation is replaced
by a formula. RR:215 ①'s XP half dies. RR:220 ③'s stagger half and RR:240 ⑤ close at the
target build via the md5 join. RR:240 ①'s "ALL AUDIO … every SFX is INFERRED" and
RR:348's "the exact waveforms are not [recoverable]" both fall for 13 named SFX.
RR:246's "per hour" reconciliation is contradicted on camera. RR:351's save-format
clause falls. RR:80's Reinforce line is one of three tiers.

The recurring theme worth carrying forward: **almost every one of these overturns is a
build-attribution error, not a missing measurement.** The numbers were on disk the whole
time; the ledger took the android ones.
