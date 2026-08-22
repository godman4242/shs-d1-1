# BLIND CITE REVIEW — t1-overturns-01 (lens 1, cite lens) — s26a

Packet: `docs/gauntlet/L0/worklist/t1-overturns-01.json` — **24 findings, 24 judged, 0 skipped.**
Every verdict below rests on an artifact **I opened in this session**. I did not read
`docs/gauntlet/L0/critics/*.md` or `docs/gauntlet/L0/sources/*.md` (§3.2).

**Result: 21 HELD · 3 REFUTED.** The refutation rate is low because this packet is unusually
well-cited — every claim came in at citelint `RESOLVES` or `QUOTE_UNVERIFIED`-for-size, and
21 of 24 quotes reproduced **character-for-character** when I opened the file. The three that
died are the three where the quoted line is real but the sentence wrapped around it says
something the line does not say.

---

## THE THREE REFUTATIONS

### R1 — `NF-8-survival-mode-is-byte-identical-in-both-builds` — REFUTED (material)

The finding's own aggregate figures are all correct. I reproduced them exactly on both blobs:
39 `<wave>`, 87 `<enemy>`, spawn-x histogram `{-50: 49, 1650: 37, -1650: 1}`.

But the headline — "byte-identical", "its authored content is IDENTICAL", "Every figure
matches the android blob exactly" — is **false**.

```
reference/extracted/bindata/119_1t4646s0.bin              11,721 bytes  (WEB)
reference/extracted/android/109_WarHexUI_SurvivalModeData.bin  11,553 bytes  (ANDROID)
```

Row-by-row diff of the 87 `<enemy>` rows: **14 differ.** The web build's late waves add
enemy 443 to three alternation pools:

| row | WEB v0.717 | ANDROID v0.682 |
|---|---|---|
| 73-76 | `449\|454\|449\|454\|443` | `449\|454` |
| 77-80 | `450\|455\|450\|455\|443` | `450\|455` |
| 81-84 | `451\|456\|451\|456\|443` | `451\|456` |

The unique-id **sets** are not equal either: web-only `{449|454|449|454|443,
450|455|450|455|443, 451|456|451|456|443}`, android-only `{449|454, 450|455, 451|456}`.

The finding measured four aggregates that happen to be invariant under this edit (wave count,
enemy-row count, spawn-x, and the *first* alternation string) and concluded identity. This is
exactly the failure mode correction **C2** warns about — an unearned "the two builds agree".

**What survives:** survival mode IS present in the web payload with 39 authored waves and 87
enemy rows, so S0-1's gap can be specified from the TARGET build. That half is right. The
identity claim is not. Re-filed as new finding `NF-E`.

### R2 — `combat-core/focus-crit-gating-rule-is-held` — REFUTED (material)

Every line number resolves and every quoted string is verbatim. Two of the six mechanics the
finding builds out of them are **wrong about what the code does**.

**(a) "It recharges +6 per tick" — false.** The per-tick fill is `++this.reload`:

```
MCSPlayer.as:1158   if(this.reload < this.maxreload)
MCSPlayer.as:1160      ++this.reload;
```

That is **+1 per tick**. The `+6` at `:3267` lives in `bonusReload()`, and I grepped its only
call site in the whole android bundle:

```
NPCManager.as:1709   if(deathCount > 0)
NPCManager.as:1711      StatsManager.getPlayer().bonusReload();
```

It is a **per-enemy-KILL bonus**, not a tick. A Sim written from this finding would fill Focus
six times too fast. Full census of every write to `reload` in MCSPlayer.as: `:240 =0`,
`:1160 ++`, `:3100 =max/3`, `:3108 =0`, `:3244 =0`, `:3261 =0`, `:3267 +=6`. There is no other
fill path.

**(b) "is penalised on being hit (reload > max/2 collapses to max/3, else -max/6)" — false.**
Lines 3098-3104 are inside `setStance()`:

```
MCSPlayer.as:3019   public function setStance(num:int) : *
...
MCSPlayer.as:3098      if(this.reload > this.maxreload / 2)
MCSPlayer.as:3100         this.reload = this.maxreload / 3;
MCSPlayer.as:3104         this.reload -= this.maxreload / 6;
```

That is the **stance-switch cost** — which is precisely the thing RR:195 ③ ("Focus numerics
(max/fill/switch-cost)") asks for — mislabelled as an on-hit penalty. Two different mechanics.

The rest of the finding (maxreload 5*24, gate at max/6, per-stance slash drain, crit at full,
zero-on-crit-slash, BattleUI scaleX) is verbatim correct. Corrected closure filed as `NF-B` +
`NF-C`, which also carry the **web** values the finding correctly flagged as unchecked.

### R3 — `art-anim/43-named-sfx-cues-held-in-web-v0717` — REFUTED (minor, re-file)

The measurement is **exactly right** — I ran the finding's own command:

```
$ grep -rhoE '"Snd_[A-Za-z0-9_]+"' reference/decompiled/shs3_payload/scripts/ | sort -u | wc -l
      43
```

and the call sites are verbatim: `§1t113s0§.as:472 §1t88s0§.instance.§1t1516s0§("Snd_smallClick");`
on the legal branch, `:478 ... ("Snd_error");` on the refused branch of `§1t5207s0§()`.

It dies on the **C3 auto-refute**. The finding asserts "even though the audio bytes are
encrypted" and "The WAVEFORMS remain unrecovered (S0-5: nested CWS SWFs ffdec cannot open) and
that half stands". S0-5 is dead per the standing correction; a claim that re-asserts the old
version is auto-REFUTED. The 43-cue manifest is too valuable to destroy over a subordinate
clause, so it is re-filed intact, minus the dead clause, as `NF-G`.

(Side note for whoever owns the audio lane: `122_Mobile_SoundResource.bin` is **not** a plain
constant-XOR file. Its stored header is literally `CWS~\xd0\x1coo`; XOR-111 turns that into a
valid SWF header — version byte `0x11` = 17, length field 29,631 — and the body's first two
bytes become `78 9c`, a legal zlib header. But a whole-body XOR-111 inflate fails
(`invalid literal/lengths set`), and I brute-forced a plaintext-tail split at every N from 1 to
4096 with no hit. Whatever `decryptByteArray` does, it is not "XOR the whole file with 111".
This does not disturb C3 — it just means the recipe in the brief is compressed.)

### Nothing else died. The other 21 held.

---

## THE 21 THAT HELD — what I opened

**`NF-1` rebirth-25-is-code-sourced-not-film — HELD.** Both ledger sentences are verbatim at
`REBUILD_READINESS.md:165` and `:205`, and they do contradict each other: :165 says "film shows"
a value :205 says was "never filmed — both longplays pre-rebirth". The code arm is verbatim at
`§1t1523s0§.as:2644-2651`. Overturn upheld: re-tag :165 A2/code-sourced.

**`NF-3` DEF-is-flat-subtraction — HELD.** `§1t99s0§.as:3284-3290` is exactly as quoted, and I
confirmed `§1t12222s0§:int = 2` at `:31` is Heavy (same ordinal as android `HEAVY_STANCE:int = 2`).
`_loc5_ -= this.§1t4477s0§();` at :3484, :3800 **and** :4391 — all three. Android twin verbatim at
`MCSPlayer.as:3231-3238` / `:3415`. There is no curve. RR:200 ① DEF half closes.

**`NF-3/web-twin-of-repair-and-reinforce` — HELD, and stronger than filed.** `§1t401s0§.as:1057-1087`
is a line-for-line twin of android `InteractUI.as:1057-1083`: same `* 10`, same `uses > 1 → 1`,
same `13000` refusal, same achievement `60005`, same flat `5000`. Same `getString(88)/(5)/(637)`,
same `Snd_error`. This is a genuine **WEB-side** close of RR:215 ③.

**`NF-4` SPD→cooldown — HELD (android), and I found the web twin.** `StatsManager.as:1854-1860`
verbatim; consumed at `InventoryUI.as:1937`; printed at `:2233`. **New:** the web build has the
same function with a different constant — `§1t1523s0§.as:2289-2295` reads
`if(param1 > 600) param1 = 600; return 1 - param1 / 600 * 0.5;`, fed from stat `§1t9410s0§ = 8`
(= `STAT_SPEED`) at `:2279-2286` with the same `*= 1.5` buff branch. Filed as `NF-D`. The finding
was honest that web parity was unchecked; it is now checked and it **diverges**.

**`NF-4/premium-ladder` — HELD, build tag corrected.** I recomputed from scratch: 143 unique
premium ids, histogram `{'1': 20, '2': 2, '3': 94, '5': 4, '12': 23}` — exact. Price-2 rows
2101 → strings.json["4001"] "Medium Soldier Pill" and 2126 → ["4174"] "25 Duel Tokens". Price-12
runs 2130 "Assassin Outfit" … 2171 "Swords of the Mist", 23 rows. **Correction:** the finding's
build field says "prices WEB itemdata.xml". Under C2 that is wrong — `reference/extracted/itemdata.xml`
is the android blob (184,002 vs 184,044 B, the 42-byte decl+CRLF delta). Read this as
**android v0.682**, not "both".

**`NF-5` mastery-caps-at-10 — HELD.** skilldata skills 1000/1001/1002 each enumerate exactly
`[1..10]`; 1002's `<desc>6005</desc>` resolves to the Heavy blurb, pinning the mapping. The web
curves evaluate at m=10 to Light 0.9 / Balanced 1.2 / Heavy 1.4 — the published triple. At m=9
they give 0.86/1.18/1.4. **RR:155's "MASTERY-9 CEILING" label is off by one**, and RR:157's
"target mastery-9" advice would ship the wrong table.

**`NF-6` web-payload-carries-no-data-xml — HELD, and I did the part citelint could not.**
citelint flagged QUOTE_UNVERIFIED only because it skipped the 329 MB file. I streamed it myself
in 4 MB chunks:

```
b'skilldata'  0
b'npcdata'    0   (b'<npcdata' 0)
b'itemdata'   1  @ byte 19,503,662
b'questdata'  1  @ byte 19,502,336
```

and read the context at both hits — they sit in a string-constant pool between `<item>clanId</item>`
/ `<item>ByLevel</item>` and `<item>prosperity</item>` / `<item>encounterdata</item>`. BigDB table
names, not XML roots. The finding's byte offsets are ~25 bytes off (token start vs match start),
which is not a mis-cite. The 27 web bindata roots are 19 animdata + 1 survivalmodedata + 1 obj +
5 text + 1 GIF. And `android/117[40:]` equals `skilldata.xml` plus a 2-byte tail — the 42-byte
delta is 40 bytes of `<?xml …?>\r\n` off the head and `\r\n` off the tail.
**This qualifies §0 itself, exactly as filed.**

**`art-anim/severed-limb` — HELD, and upgradeable to BOTH.** 158 `<anim>` in
`99_MCSCharacter_HumanAnimationData.bin` (matches S0-4), with all eight death variants at the
quoted frame counts: deathnohand 25, deathnohead 31, deathinhalf 28, deathbyarrow 21,
deathwitharrow 23, death 38, deathenemy 23, deathdowned 7. Magic bytes are `ef bb bf` — UTF-8
with BOM, as the finding says (already covered by C1). **New:** `md5(reference/extracted/bindata/108_1t4635s0.bin)
== md5(reference/extracted/android/99_…) == bcfd658e79fafb41f52431afb7d10622`. The blob is
byte-identical in the web build, so RR:240 ⑤ closes at the **target** build. Filed as `NF-F`.

**`cite04/android-string-table-has-no-900-block` — HELD, and it is the hardest S0-3 evidence yet.**
My own census over the 1,893 numeric ids reproduces the finding century-for-century:
`0-99:100 · 100-199:100 · 200-299:90 · 300-399:91 · 400-499:100 · 500-599:100 · 600-699:99 ·
700-799:100 · 800-899:79 (max 880) · 900-999:0 · 1000-1099:45`. And `§1t113s0§.as:111` is
verbatim, calling `getString(960)`. The load-bearing half is machine-proved: **web code reads a
string ID the android table does not contain.**
The "CANNOT CHANGE STANCE" identification is inference, not citation — but it is well-made
inference, and I checked it: I cropped `(230,960)-(560,1070)` @4× LANCZOS off
`reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` and the greyed brown bar under the 20/20
green and 26/26 blue bars reads **CANNOT CHANGE STANCE** in plain type. `§1t5169s0§` is the
crit-text field; at `:338-342` it shows the **grey** getString(960) when the bar reads 0 and at
`:354-356` the **black** getString(175) ("Critical Hit") at ≥1 — and stance switching is gated on
that same meter. The reading is consistent from three directions.

**`cite04/longplay-frames-are-pillarboxed` — HELD, reproduced to the pixel.** My own scan of
`Nr4fQstqHDM_428.0.png` at y=540 with the finding's own `R+G+B < 25` rule:
left dark run **52**, right dark run **52**, content width **1816**; at x=960 top 0, bottom 0.
Boundary is sharp (`x=51 (1,2,0) → x=52 (48,49,33) → x=53 (98,99,83)`). `StatsManager.as:80`
`stageWidth:int = 800` and `:82 stageHeight:int = 480` verbatim. **1816/800 = 2.27**, not 2.4 —
a 6% inflation on every horizontal figure taken at 2.4.
One qualifier on "*every* still is 52 px": the second longplay is close but not identical —
`zFt_combat/zFtCaTO0_1M_t0335s.png` gives 55/57 and `t0525s.png` 54/58 at the same threshold; the
true edge there is x≈54 / x≈1861 with encoder blur. Pillarboxing is universal, the exact 52 is
this encode. That does not touch the correction.

**`cite04/web-rebirth-pays-25-and-100` — HELD, and it is the sharper version of NF-1.** Web
`§1t1523s0§.as:2644-2651` verbatim; `:228 §1t9413s0§:int = 12` and `:254 §1t9426s0§:int = 25`,
against android `StatsManager.as:194 STAT_HGOLD:int = 12` and `:220 STAT_DAN:int = 25`. The
android twin at `StatsManager.as:2195-2212` pays **20 / 5**. So web = 25/100 HGold, android = 5/20
HGold. And the Dan arithmetic closes it: at stored Dan 8 the announcement hardcodes `"10"` (:2647)
while `:2653` caps the increment at `< 9`, and `:2659` announces `Dan + 1` — displayed Dan tops out
at **10**. RR item 7's `MAX_DAN_RANK=10` and `tenthGold=100` are both **code-sourced**, and
":165's *no 10th-rebirth tier*" is flatly false.
Minor: this finding's "the film got the currency label wrong" inherits the same phantom film that
NF-1 correctly kills — RR:205 says rebirth was never filmed, so there is no film to be wrong.

**`combat-core/damage-triple` — HELD, verbatim, all of it.** `§1t99s0§.as:3255-3276` reads exactly
as quoted, including `_loc2_ * 1.3 + this.§1t1243s0§` at :3274 gated on `§1t4414s0§ == §1t4415s0§`
(reload == maxreload). I confirmed those are the reload/maxreload fields: `:249 §1t4415s0§ = 8*24`,
`:250 §1t4414s0§ = 0`, `:1205 ++§1t4414s0§`. Crit is **deterministic**, fired by a full Focus bar,
and `:3295-3297` zeroes it on the critting slash. RR:190 ② and RR:195 ⑤ both close.

**`combat-core/flinch-is-nested` — HELD, and I closed the one gap it left implicit.**
`EnemyShield.as:39` and `:123-125` are both inside `override public function update()` (lines
25-127) — one animation advance and one counter decrement per update, so **the same clock**, which
is the load-bearing part. `MCSCharacter.as:1315 ++this.frameCounter;` — one pose per call.
`EnemyZombie.as:522 gotHitCounter = 12;` and `:544 this.startAction(FLINCH_STATE);` are both inside
`gotHit()` (opens :449). And `gotHitCounter` **is** an i-frame counter: `:453-455 if(gotHitCounter > 0)
return false;` at the top of `gotHit()`. Flinch clip is `d="8"` (verified in the blob). 8 nested
inside 12, no held pose, no lockout. Correct.

**`combat-core/mastery-caps-at-10-per-the-string-table` — HELD.** `strings.json["8131"/"8132"/"8133"]`
= "Light/Balanced/Heavy Stance Mastery Level 10." verbatim, and `["6005"]` carries "Defense -20%",
which is the same x0.8 the web `§1t4477s0§()` returns. The finding's own android caveat is correct
and should be kept.

**`combat-core/stance-counter-triangle-x1.2` — HELD, and understated.** `MCSPlayer.as:3701-3703`
verbatim; the ordering claim is right — `:3703 *= 1.2` lands **before** `:3709 damage -= getDefense()`,
before the `:3710-3713` min-damage floor, and before `:3716 behead *= 1.5`. I grepped
`REBUILD_READINESS.md` for the mechanic and found nothing: RR:74 carries only "Heavy defender
Defense ×0.8 (one way)". A missing 20% term in a KNOWN-KNOWN bullet.
**Understated:** the WEB build has *two* arms. `§1t99s0§.as:3788-3798` and `:4379-4389` add
`else if (Light vs Heavy || Balanced vs Light || Heavy vs Balanced) _loc5_ *= 0.9;`. Android has
no `*= 0.9` anywhere. Filed as `NF-A`.

**`combat/stance-reach-multipliers-diverge` and `combat/web-stance-reach-multipliers-diverge`
(duplicate filings) — BOTH HELD, and they are the best-argued pair in the packet.** The whole web
`switch` at `:3091-3155` reads exactly as quoted, including the `case §1t12224s0§` at :3130 →
Reversed ×1.4 and `case §1t12223s0§` at :3141 → Dual ×1.0 floor 100 (the constants are `12223:int=3`
and `12224:int=4`, matching android `DUAL_STANCE=3` / `REVERSED_STANCE=4` — the finding got the
mapping right). Android `:3030/:3041/:3052` verbatim at 1.5 / (1+0.5·m·0.01) / (0.5+0.5·m·0.01).
The class-identity argument is not hand-waving: `§1t99s0§.as:183` is a **15-arg** function whose
assignment order matches `MCSPlayer.initPlayer` slot for slot (param10 → `§1t4420s0§`, declared
`= 10` at `:105`, against `baseSlashLength:int = 10` at `MCSPlayer.as:107`), and `:3158` calls
`§1t1541s0§.§1t10094s0§(…)` which is `{ maxDistance = param1; }` at `§1t1541s0§.as:106-108`, the
literal body of `InputManager.setMaxDistance`. The shared SPD base is byte-for-byte the same
formula in both builds (`§1t1523s0§.as:2346-2347` vs `StatsManager.as:1917-1918`). **Only the
multipliers diverge, and the web ceilings (0.9 Heavy, 1.4 Light) are the ones that reconcile with
RR:156.** RR:190 ① closes on the WEB constants.

**`economy/repair-weapon-cost-was-captured-on-film` — HELD. I re-extracted the frames myself.**
This is an A1 claim so I did not take it second-hand. `ffmpeg -ss {1283,1286,1287}` on
`reference/videos/Nr4fQstqHDM.mp4`, 1920×1080:

- **t=1283 s (21:23)** — "FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS / MATERIALS NEEDED:
  2 IRON ORE", wallet **531 COINS**.
- **t=1286 s (21:26)** — "BLACKSMITH / REPAIR YOUR CURRENTLY EQUIPPED WEAPON? / COST: 70 COINS",
  YES / NO, wallet **531 COINS**.
- **t=1287 s (21:27)** — menu back to FORGE / REPAIR / REINFORCE / LEAVE, wallet **461 COINS**.

531 − 70 = 461. The transaction is on film, at a node the forge dialog independently labels
LEVEL 7, and 7 × 10 = 70 matches `InteractUI.as:1058` and its web twin `§1t401s0§.as:1058`
verbatim. **RR:215 ③ "Repair-Weapon cost (never captured)" is dead.** No frame-vs-doc conflict
here — the frame *confirms* the formula.

**`economy/tournament-payout-formula-is-client-side` — HELD.** `§1t7091s0§.as:408-412` verbatim.
The ladders check out: player count 2/4/8/16 with 2 gated on `§1t9464s0§` (:149-160, :167-178);
entry fee clamped 0…100 (:185-198); level clamped 5…80 (:210-234); round duration 0.5/1/2/24/48 h
(:305-360) — plus a `0` → `"-"` option also gated on the premium flag, which the finding omits.
`§1t7144s0§.as:572/:585` (create −5 of stat 20112, waived on premium) and `:600/:610` (join
−entryfee) are verbatim. I confirmed the residual STILL_UNHELD: `20112` is absent from
`strings.json` and returns 0 hits in `itemdata.xml`.
Minor: the aside "§1t7144s0§.as itself contains NO literals" is self-contradicting — the file
carries ~96 numeric literals, including the `5` the finding itself quotes from `:572`/`:585`.
Wrong sentence, right file; strike the aside, keep the finding.

**`enemies-ai/boss-rubber-band-is-in-the-web-build` — HELD.** `§1t4523s0§.as:77/:82/:83/:84` verbatim,
with the `:85-92` clamps (`_loc9_ <= 3 → 3`, `_loc10_ <= 0 → 1`) present as described, and `_loc7_`
is `§1t1523s0§.getLevel()` at :81 so `_loc8_` really is `enemyLevel − playerLevel`. This is
`shs3_payload`, i.e. the **web** build. RR:220 ① closes at the target build; the config comment can
go to CONTRACT (0.717), not CONTRACT-SRC (0.682).

**`enemies-ai/flinch-is-build-parity-confirmed-in-web-v0717` — HELD, every cite verbatim.**
`§1t68s0§.as:770-778` (guard + save `actionState`/`animation`/`§1t6269s0§`, set FLINCH, play
`§1t10421s0§`) and `:783-785` (restore all three). `§1t99s0§.as:4688-4695` branches
`§1t10423s0§` ("flinch") vs `§1t10421s0§` ("flinch_weapon") on the saved animation.
`§1t1544s0§.as:170 = "flinch_weapon"`, `:172 = "flinch"`. And `bindata/103_1t4630s0.bin` carries
`<anim i="flinch_weapon" d="8">` **and** `<anim i="flinch" d="8">`.
**Strengthened:** `md5(bindata/103_1t4630s0.bin) == md5(android/94_MCSCharacter_Human2AnimationData.bin)
== 6852a591ab2d5895090b3d37ccec9ba2`. The clip is byte-identical across builds. The S0-3 hedge
lifts for this mechanism, as filed.

---

## NEW FINDINGS RAISED WHILE JUDGING

Filed in the structured return as `NF-A` … `NF-G`. In short:

1. **`NF-A`** — the web stance-counter triangle has a **second arm**: losing matchups take
   `×0.9` (`§1t99s0§.as:3796-3798`, `:4387-4389`). Android has no `*= 0.9`. RR:74 is missing both terms.
2. **`NF-B`** — **web Focus numerics differ from android across the board**: maxreload `8*24 = 192`
   (`§1t99s0§.as:249`) vs `5*24 = 120`; stance-switch cost a **flat −48** (`:3162`) vs
   `>max/2 → max/3, else −max/6`; stance gate `reload >= 48` (`:3050`, `:3060`) vs `< max/6`; HUD
   normalisation `(r−48)/(max−48)` (`§1t113s0§.as:328`) vs `(r−24)/(max−24)`. Porting the android
   Focus model to a v0.717 target is wrong on four constants.
3. **`NF-C`** — the Focus meter fills **+1/tick**, and **+6 per enemy killed**. Both builds.
4. **`NF-D`** — web SPD→cooldown saturates at **SPD 600**, not 300 (`§1t1523s0§.as:2289-2295`).
5. **`NF-E`** — survival-mode content is **not** identical across builds (14/87 rows).
6. **`NF-F`** — two animation blobs are md5-identical web↔android, promoting the severed-limb
   deaths and the 8-frame flinch to the target build.
7. **`NF-G`** — the 43-cue web SFX inventory, re-filed without the dead-S0-5 clause.

---

## PROCEDURAL NOTES

- **No frame-vs-doc conflict arose in this packet.** The two A1 claims (pillarbox, repair cost)
  both had the frame *agreeing* with the code. Where I re-measured, the frame governed and it
  matched.
- **The C2 hazard shows up twice** (`NF-4/premium-ladder` calling `itemdata.xml` "WEB", and
  `NF-8-survival` inferring identity from four invariant aggregates). Both are corrected above.
- **citelint's three `QUOTE_UNVERIFIED` flags were all false alarms** caused by scale, not by
  bad quotes: `payload.xml` was skipped for size (I streamed it), and the survival/flinch quotes
  were reconstructions from parsed binaries rather than literal substrings. In every case I
  located the underlying artifact and the quote's content was there — the one that failed
  (`NF-8`) failed on meaning, not on text.
