# t1-overturns-01 — HUNTER LENS review (blind critic)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-01.json` — **24 findings, 24 judged, 0 skipped.**
Every verdict below carries an artifact **I** opened. Ledger = `docs/research/REBUILD_READINESS.md` (378 lines).

**Headline:** 22 of 24 survive on the evidence. **2 are refuted on a load-bearing number**
(`cite04/longplay-frames-are-pillarboxed-scale-is-2.27`, `combat-core/focus-crit-gating-rule-is-held`).
**5 more are TRUE but their claimed ledger overturn is inflated** — they confirm the sentence they
point at, or they point at a §0-brief sentence that is not in the ledger at all.

---

## A. REFUTED ON SUBSTANCE (2)

### R1 — `cite04/longplay-frames-are-pillarboxed-scale-is-2.27` — **material**
The *measurement* holds and I reproduced it: `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`
scanned at y=540 for R+G+B<25 gives **left 52 · right 52 · content 1816 · top 0 · bottom 0**, and the
same 0.9458 content fraction appears on the downscaled sets (27/1024, 13/480), on both videos.

The **derived constant does not hold**. Both builds run ONE uniform letterbox scaler:

- web `reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:295-307`
- android `reference/decompiled/shs3_android/scripts/GameEngine.as:293-305`

```
295/297:  if(originalAspect >= newAspect) { scale = stageWidth / 800; offsetY = (stageHeight - h*scale)/2 }
302-305:  else                            { scale = stageHeight / 480; offsetX = (stageWidth - 800*scale)/2 }
```
A 1920×1080 viewport is *wider* than 5:3, so the **else** arm runs: `scale = 1080/480 = 2.25`,
`offsetX = (1920 − 1800)/2 = 60`. The finding's own hedge — "2.27 (1816/800), or 2.25 vertically" —
concedes a non-uniform pair that **no uniform scaler can produce**. Its actionable prescription
("fix the px conversion at 2.27 and subtract a 52-px left offset") mis-scales every reach figure by
~1% and every x coordinate by 8 px. Correct values: **2.25 and 60**.

Overturn also inflated — ledger :171 says *"HUD x-fractions measured off 1920×1080 video **may be**
pillarbox-compressed. **Verify** before trusting horizontal coords."* Verifying it **confirms** the
sentence. Nothing in :171 becomes false. `overturn_upheld = false`.

### R2 — `combat-core/focus-crit-gating-rule-is-held` — **material**
Everything else in this claim checks out verbatim: `maxreload = 5 * 24` (`MCSPlayer.as:239`), stance
gate `reload < maxreload/6` (:2977), on-hit collapse (:3098-3104), zero-at-full (:3242-3244),
per-stance drain ×0.5/×1/×1.5 (:3249-3257), HUD `scaleX` + `crittext.visible = percentage >= 1`
(`BattleUI.as:261-262`).

**"It recharges +6 per tick" is wrong.** The per-tick recharge is **+1**:
```
MCSPlayer.as:1158-1160   if(this.reload < this.maxreload) { ++this.reload; ... }
```
— inside `override public function update()` (opened at `MCSPlayer.as:275`). The `+6` at :3267 is
`bonusReload()`, and its **only** caller is
```
NPCManager.as:1709-1711   if(deathCount > 0) { StatsManager.getPlayer().bonusReload(); }
```
i.e. **+6 per enemy killed**, not per tick. A Sim built on +6/tick fills the Focus bar in 20 ticks
instead of 120 — **6× too fast**, on the single most load-bearing number in the claim.
The overturn itself still stands (RR:190 ⑤ / RR:195 ③ do fall) — but on corrected numbers.

---

## B. TRUE, BUT THE CLAIMED OVERTURN IS INFLATED (5)

| id | why the ledger sentence survives |
|---|---|
| `NF-4/premium-ladder-has-a-2-gold-tier` | RR:135 / :244 list "Ninja-Services prices" as **READY** and never state a 1/3/5/12 ladder. Refining a ladder the ledger does not carry falsifies nothing. Also the build tag is wrong: "prices WEB itemdata.xml" contradicts carried correction **C2** — `itemdata.xml` is the Android blob. |
| `NF-6-web-payload-carries-no-data-xml` | Its `ledger_text` is the §0 **S0-3 caveat**, not a REBUILD_READINESS.md sentence, and carried correction **C2** already says exactly this. Zero ledger edits follow. |
| `NF-8-survival-mode-is-byte-identical-in-both-builds` | Its `ledger_text` is §0 **S0-1**, not a ledger sentence — and the finding **confirms** it: survival mode is still absent from all 12 RR systems. |
| `cite04/android-string-table-has-no-900-block` | Best-evidenced item in the packet (see below) — and it **strengthens** the S0-3 parity caveat, which is what it names. The finding says so itself ("the hardest evidence yet for the S0-3 parity caveat"). Confirming a sentence is not overturning it, and the sentence is not in the ledger. |
| `cite04/longplay-frames-are-pillarboxed…` | see R1. |

---

## C. UPHELD, WITH A CORRECTION THE LEDGER MUST CARRY (5)

**`combat-core/stance-counter-triangle-x1.2`** — android `MCSPlayer.as:3701-3717` verified verbatim,
and I found the **web twin** at `§1t99s0§.as:3788-3795`, upgrading the build tag from android-only to
both. But the finding **misses the losing arm** the web build adds:
```
§1t99s0§.as:3796-3798   else if(Light vs Heavy || Balanced vs Light || Heavy vs Balanced) _loc5_ *= 0.9;
```
(also `:4387-4389`). Android v0.682 has **no** 0.9 arm. The v0.717 triangle is **×1.2 / ×1.0 / ×0.9**,
not ×1.2 / ×1.0 / ×1.0. A port taking only the ×1.2 term is wrong by 10% on every losing matchup.

**`cite04/web-rebirth-pays-25-and-100-heavenly-gold`** — payout verified (`§1t1523s0§.as:2644-2651`,
stat 12 at `:228` = android `STAT_HGOLD:int = 12` at `StatsManager.as:194`; android pays 20/5 at
`:2201-2207`). But its clause *"the only thing the film got wrong is the currency label — it is
Heavenly Gold … not coins"* is a **strawman**. RR:79-80 writes "+25**g**" in the same c/g notation it
uses for "inn 8**c**" and "fast-travel 5**g**", my own frame extraction at t=1286 s shows the HUD
carrying **"531 COINS"** and **"2 GOLD"** as two separate wallets, and `StatsManager.as:2627-2630`
has `getGold() → STAT_GOLD (11) = coins`. "+25 gold" was already the right currency. Only the
"no 10th-rebirth tier" clause falls.

**`art-anim/43-named-sfx-cues-held-in-web-v0717`** — cue count verified exactly (my grep over
`reference/decompiled/shs3_payload/scripts/` → **43** unique `"Snd_*"`; call sites `§1t113s0§.as:472`
`Snd_smallClick` / `:478` `Snd_error`). But its clause *"the WAVEFORMS remain unrecovered (S0-5:
nested CWS SWFs ffdec cannot open)"* repeats the line **correction C3 supersedes** → auto-REFUTED.
I decrypted it myself — see NEW-4.

**`economy/tournament-payout-formula-is-client-side`** — all five cited ranges verified. Two nits:
the round-duration ladder has a **sixth** rung, `0` rendered "-" (`§1t7091s0§.as:321-327`), gated on
the same premium flag as the 2-player rung; and the aside *"§1t7144s0§.as itself contains NO
literals"* is contradicted by its own cite (`:572 < 5`, `:585 -5`).

**`NF-4-spd-to-cooldown-formula-recovered`** — formula verified verbatim
(`StatsManager.as:1854-1860`, consumed `InventoryUI.as:1937`, printed `:2233`). I then hunted the web
twin and **found none**: `grep '> 300'` over the whole web payload returns one unrelated hit
(`§1t406s0§.as:1544`), `grep '/ 300'` returns only bitmap-width math. So this is **v0.682-only** in
what we hold — the finding's own caveat is correct and must survive into the ledger as
CONTRACT-SRC(0.682), never CONTRACT.

---

## D. UPHELD CLEAN (12)

`NF-1/ledger-rebirth-25-is-code-sourced-not-film` · `NF-3-def-mitigation-is-flat-subtraction-both-builds` ·
`NF-3/web-twin-of-repair-and-reinforce` · `NF-5/stance-mastery-caps-at-10-not-9` ·
`art-anim/severed-limb-death-variant-is-held` · `combat-core/damage-triple-crit-1p3-and-heavy-def-confirmed-in-web-source` ·
`combat-core/flinch-is-nested-inside-the-iframe-window` · `combat-core/mastery-caps-at-10-per-the-string-table` ·
`combat/stance-reach-multipliers-diverge-web-vs-android` · `combat/web-stance-reach-multipliers-diverge-from-android` ·
`economy/repair-weapon-cost-was-captured-on-film` · `enemies-ai/boss-rubber-band-is-in-the-web-build` ·
`enemies-ai/flinch-is-build-parity-confirmed-in-web-v0717`

Notable first-hand confirmations:

- **Repair on film (A1, re-extracted by me).** `ffmpeg -ss 1283/1286/1287 -i reference/videos/Nr4fQstqHDM.mp4`,
  1920×1080. t=1283: *"FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS / MATERIALS NEEDED: 2 IRON ORE"*.
  t=1286: *"BLACKSMITH / REPAIR YOUR CURRENTLY EQUIPPED WEAPON? / COST: 70 COINS"*, wallet **531 COINS**.
  t=1287: wallet **461 COINS** = 531 − 70. 70 = nodeLevel 7 × 10, matching `InteractUI.as:1058` and its
  web twin `§1t401s0§.as:1058`. *Cite-class note:* the finding cites a raw `.mp4` timestamp, not a frame
  under `reference/frames/`, so it is not strictly A1 as §0 defines it — but I reproduced it frame-for-frame.
- **Stance-constant mapping.** `§1t12223s0§ = 3` and `§1t12224s0§ = 4` (`§1t99s0§.as:33/:35`) against
  `DUAL_STANCE:int = 3` / `REVERSED_STANCE:int = 4` (`MCSPlayer.as:33/:35`). The reach findings label
  `:3131` Reversed ×1.4 and `:3142` Dual ×1.0-floor-100 — **correct**, and not obvious from case order.
- **Flinch i-frames.** The finding asserts invulnerability without citing the read site. It is real:
  `EnemyJiangSi.as:240-243` and `EnemyClone.as:353-356` — `if(gotHitCounter > 0) { return false; }`
  at the top of `gotHit()`.
- **Mastery-10.** `skilldata.xml` skills 1000/1001/1002 each carry 10 `<level>` rows, values 1…10;
  `strings.json["8131"/"8132"/"8133"]` = *"… Stance Mastery Level 10."*; `["6005"]` = *"Defense -20%"*;
  web `§1t99s0§.as:3262/3265/3270` evaluate to exactly **0.9 / 1.2 / 1.4 at m = 10**. RR:155's
  "MASTERY-9 CEILING" is off by one, and RR:157's "target mastery-9" would ship 0.86/1.18/1.4.

---

## E. NEW FINDINGS (hunter lens — nobody in this packet has claimed these)

**NEW-1 — THE L11–80 XP CURVE IS NOT UNRECOVERABLE. IT IS IN THE WEB BUILD.**
`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364` carries a **97-entry** exp array,
byte-identical to android `StatsManager.as:78`; `levelCap = 80` at `StatsManager.as:76`.
`[0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,37400,…,4585800(L80),…,29395800]`.
The ledger's L1–L10 caps (550…31 400) are indices 1–10 of this exact array.
**Kills RR:62, RR:127 and RR:200 blocker ② outright** — *"L11–80 XP curve — likely unrecoverable
(no wiki table; both longplays cap at L10; a solo build probably can't reach L11+ offline). Keep the
extrapolation as labeled INFERRED."* The whole table shipped. It is CONTRACT for v0.717.
This is the single biggest ledger overturn in the packet's blast radius and **no finding claimed it.**

**NEW-2 — FOCUS RECHARGE IS +1/TICK AND +6/KILL.** See R2. `MCSPlayer.as:1158-1160` + `NPCManager.as:1711`.

**NEW-3 — THE WEB STANCE TRIANGLE HAS A LOSING ARM ANDROID LACKS.** `§1t99s0§.as:3796-3798` (×0.9),
absent from `MCSPlayer.as:3701-3708`. See section C.

**NEW-4 — I DECRYPTED THE AUDIO MYSELF, AND ONLY 13 OF THE 43 CUES HAVE WAVEFORMS.**
Key = `resourceFileNameArray[n].charCodeAt(1)` (`ResourceManager.as:41`, `:186`), decryptor at
`ResourceManager.as:200-217` (XOR bytes 3…255 after an `i%11` swap with `i+256`).
`122_Mobile_SoundResource.bin` at key **111** (`'o'` of "soundresource.swf") → `CWS` v**17**,
inflates to 29 623 B, **13 DefineSound (tag 14)** + SymbolClass:
`deflect · die1 · die2 · die3 · fart · goodkoto · hitmetal · punch · refund · slash1 · slash2 · slash3 · sumo`.
`113_Mobile_MusicResource.bin` at key **117** → 13 stems: `battlechants · battledrums · bgm_gangnam ·
bgm_levelup · bgm_lose · dungeonambience · dungeonflute · dungeonpercussion · dungeonpiano · flutes ·
safeambience · safekoto · safepercussion`. `115_Mobile_SHS3Resource.bin` at key **104** → 1 912 symbols,
**zero** DefineSound tags. **So 30 of the 43 code-referenced cues** (`Snd_click`, `Snd_menu`,
`Snd_bowFire`, `Snd_smokebomb`, `Snd_criticalDamage`, `Snd_jump`, `Snd_mining`, `Snd_equip`, …)
**have no shipped waveform in any resource we hold.** Correction C3 is confirmed but must be scoped:
audio is *recovered for 13 SFX + 13 stems*, not for the cue set.

**NEW-5 — THE SEVERED-LIMB DEATHS ARE IN THE WEB BUILD TOO.** `reference/extracted/bindata/108_1t4635s0.bin`
carries the same **158** `<anim>` table as android `99_MCSCharacter_HumanAnimationData.bin`, including
`deathnohand d=25 · deathnohead d=31 · deathinhalf d=28 · deathbyarrow d=21 · deathwitharrow d=23 ·
death d=38 · deathenemy d=23 · deathdowned d=7`. Upgrades that finding from *android v0.682 blob* to
**both**. (Web bindata total `<anim>` across all 27 blobs = **487**.)

**NEW-6 — A SECOND NATIVE ASPECT EXISTS: 800×690.** Web `§1t1540s0§.as:271-285` and `:388` —
`originalHeightWithBar = 690`; when the viewport is *narrower* than 800/690 the game switches layout
and calls `friendpanel.init()`. Ledger item 12 (RR:171) and RR:117 only know 800×480. The HUD
geometry lane needs to know there are **two** authored layouts, not one.

**NEW-7 — THE "CANNOT CHANGE STANCE" FIELD IS THE CRIT INDICATOR.** `§1t113s0§.as:110-111`:
```
110:  §1t5203s0§ = "<font color='#000000'>" + getString(175)  + "</font>";   // strings["175"] = "Critical Hit"
111:  §1t5204s0§ = "<font color='#BBBBBB'>" + getString(960)  + "</font>";
```
One HUD field, two strings: black **"Critical Hit"** when Focus is full, grey **"CANNOT CHANGE STANCE"**
otherwise. My crop of `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` at **(230,960)-(560,1070)
@4× LANCZOS** shows the grey variant, under HP 20/20 (green) and a blue 26/26 bar, above "150% DAMAGE".
RR:235 blocker ③ says floating crit popups are *"absent from the ledger"* — here is the static half of
the contract, with its exact hex.

**NEW-8 — `strings.json["8124"] = "Reach Dan 10."`** — a second, independent artifact class confirming
MAX_DAN_RANK = 10, alongside `["864"] = "[0] has rebirthed and is now Dan [1]!"` which the web rebirth
call fills with the literal `"10"` (`§1t1523s0§.as:2647`).

**NEW-9 — ELITE/BOSS HP AND ATK ARE DERIVED FROM THE PLAYER, SO "PER-ENEMY HP" IS UNDEFINED FOR THEM.**
`§1t4523s0§.as:93-120` (web) == `EnemyElite.as:50-80` (android): `playerhit` is floored by level band
(≤10 → 1 · ≤20 → lvl/8 · ≤30 → lvl/6 · else lvl/4), then `bossHP = playerhit × (10+lvldiff)` and
`bossATK = playerHP/(18−lvldiff) + playerDEF`. RR:220 blocker ② ("per-enemy HP") is mis-framed for
elites: there is no per-enemy HP to find, only a rubber-band.

**NEW-10 — `xp = level * 5 + 45` IS UNIVERSAL, NOT ELITE-SPECIFIC.** Present on `EnemyCivilian.as:35`,
`EnemyBoar.as:40`, `EnemyDeer.as:35`, `EnemyBear.as:38`, `EnemyFox.as:26`, `EnemyOgre.as:45`,
`EnemyKanjiGuardian.as:41/:58`, and in 10+ web classes. RR:200 blocker ④ ("full XP-income model") has
its kill-XP arm closed.

---

## F. Method note

Nothing here was taken second-hand. Byte-level checks I ran: `skilldata.xml` is **exactly**
`android/117_Mobile_SkillData.bin[40:39043]` (40-byte XML declaration + trailing CRLF = the 42-byte
delta), `questdata.xml` is `116_Mobile_QuestData.bin` minus one trailing byte;
`grep -c` on the 329 MB `payload.xml` → `skilldata` **0**, `<npcdata` **0**. Survival mode parsed from
**both** blobs independently: 39 `<wave>` · 87 `<enemy>` · x-histogram `{-50: 49, 1650: 37, -1650: 1}`
in each. Premium ladder re-joined from `121_Mobile_PremiumData.bin` (176 refs / 143 unique) against
`itemdata.xml <heavenlyprice>` → `{1:20, 2:2, 3:94, 5:4, 12:23}`, price-2 rows resolving to
**2101 "Medium Soldier Pill"** and **2126 "25 Duel Tokens"**.

**Standing invariant applied once:** on the pillarbox item the *frame* and the *shipped scaler* both
win over the finding's arithmetic — the frame says 52-px bars, and the scaler says the game inside
those bars is drawn at 2.25 with a 60-px offset. The finding's 2.27 is neither.
