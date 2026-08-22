# t1-overturns-01 — BLIND CRITIC, LENS 2 (HUNTER) — s26a

Packet: `docs/gauntlet/L0/worklist/t1-overturns-01.json` — **24 findings, 24 judged, 0 skipped.**
I opened `docs/gauntlet/L0/critics/*.md` and `docs/gauntlet/L0/sources/*.md` **never**.
(One `grep -rn` over `docs/` did spill two lines of `LEDGER_EVIDENCE.md` / a wf-journal into
my terminal. I did not read further, and the one fact it exposed — a web `maxreload` of
`8 * 24` — I then verified myself by opening `§1t99s0§.as:249` directly, which is the cite
I carry. Logged here for honesty.)

Headline: **5 REFUTED · 19 HELD.** But the bigger result is the **overturn audit**:
of 24 claimed ledger overturns, **only 11 actually falsify the sentence they point at.**
The other 13 confirm it, refine it, restate a correction already carried, close one half of
a compound blocker, or aim at the gauntlet §0 brief instead of `REBUILD_READINESS.md`.

---

## §1 — The five refutations

### R1 · `NF-8-survival-mode-is-byte-identical-in-both-builds` — **NOT identical.** (material)

I parsed both blobs. Aggregates match: 39 `<wave>`, 87 `<enemy>`, x-histogram
`{-50: 49, 1650: 37, -1650: 1}` — exactly as filed. **The files are not byte-identical**
(web `bindata/119_1t4646s0.bin` 11,721 B, md5 `f3dd11714d…`; android
`android/109_WarHexUI_SurvivalModeData.bin` 11,553 B — different md5), and the *authored
content* is not identical either. **Waves 33–39 differ in both builds:**

| wave | android v0.682 | web v0.717 |
|---|---|---|
| 33–34 | `449\|454` | `449\|454\|449\|454\|443` |
| 35–36 | `450\|455` | `450\|455\|450\|455\|443` |
| 37–39 | `451\|456` | `451\|456\|451\|456\|443` |

The web build adds enemy **443** to every late-game pool and doubles the base pair, changing
the draw from 1/2·1/2 to 2/5·2/5·1/5. The three aggregates the finding chose to measure are
precisely the three that *cannot* see this — same wave count, same enemy count, same spawn x.
That is why "every figure matches" is not a parity proof.

The true half survives and I re-file it (**NF-D**): survival mode **is** in the target build.

### R2 · `art-anim/43-named-sfx-cues-held-in-web-v0717` — repeats the dead S0-5 line. (material)

The grep reproduces exactly: `grep -rhoE '"Snd_[A-Za-z0-9_]+"' reference/decompiled/shs3_payload/scripts/ | sort -u | wc -l` → **43**, and the two trigger sites at `§1t113s0§.as:472` (`Snd_smallClick`, legal stance switch) / `:478` (`Snd_error`, refused) are verbatim.

But the finding's load-bearing hedge — *"even though the audio bytes are encrypted"* and
*"the WAVEFORMS remain unrecovered (S0-5: nested CWS SWFs ffdec cannot open) and that half
stands"* — is the exact line carried correction **C3** declares dead. I disproved it by hand
rather than by citing C3: `ResourceManager.as:200-217` shows `decryptByteArray` touches only
bytes **3..255** (hence the plain `CWS` magic that makes a naive whole-file XOR fail), with a
swap at `i % 11 == 0` and `ba[i] ^= key`. Key = `charCodeAt(1)` of `Mobile_SoundResource` = `'o'` = **111**
(`Mobile.as:352`). Applying it:

```
header b'CWS\x11\xbfs\x00\x00'  ver 17  filelen 29631 → inflate 29623
tags {69:1, 77:1, 9:1, 86:1, 45:1, 14:13, 82:1, 76:1, 1:1, 0:1}   ← DefineSound(14) × 13
SymbolClass: punch fart hitmetal goodkoto slash1 slash2 die1 refund die3 slash3 sumo die2 deflect
```

The waveforms are recovered. The 43-cue web inventory is real and I re-file it (**NF-F**),
with the precise residual: **13 waveforms vs 43 named cues → 30 cues have no PCM in blob 122.**

### R3 · `combat-core/focus-crit-gating-rule-is-held` — two inverted mechanics. (material)

Cites all resolve; `maxreload = 5 * 24`, the per-stance drain, the zero-at-full, the `1/6`
stance gate and the BattleUI crit-text rule are all real. **Two of its headline sentences are wrong:**

1. *"It recharges +6 per tick."* — It does not. `MCSPlayer.as:1158-1160`:
   `if(this.reload < this.maxreload) { ++this.reload; }` → **+1 per tick**, sitting in the same
   per-tick housekeeping block that decrements `gotHitCounter` and `speechCounter`. The `+6` is
   `bonusReload()` (`:3265-3267`), whose **only** caller is `NPCManager.as:1711`, inside
   `if(deathCount > 0)` — a **kill bonus**, not a recharge. A Sim built from this fills Focus 6× too fast.
2. *"is penalised on being hit (reload > max/2 collapses to max/3, else −max/6)."* — That block
   (`:3098-3104`) is inside **`setStance()`**, which opens at `MCSPlayer.as:3019`, guarded by
   `if(StageManager.isBattle())`. It is the **in-battle stance-switch cost**, not an on-hit penalty.

And the constants are android-only. Corrected, web-sourced version at **NF-A**.

### R4 · `combat-core/stance-counter-triangle-x1.2` — the triangle is real, the direction is backwards. (material)

`MCSPlayer.as:3701-3707` is quoted verbatim and `damage *= 1.2` is real, applied before the
DEF subtraction at `:3709`, the floor at `:3710-3713` and the behead ×1.5 at `:3716` — all confirmed.

But the enclosing method is `override public function gotHit(target:MovieClip, damageObj:Damage)`
at **`MCSPlayer.as:3580`**. `this` is the **defender**; `enemyStance` is assigned
`damageObj.stance` at `:3654` — the **attacker**. So the shipped rule is:

> defender Light + attacker **Balanced** → ×1.2 · defender Balanced + attacker **Heavy** → ×1.2 · defender Heavy + attacker **Light** → ×1.2

i.e. **Balanced beats Light, Heavy beats Balanced, Light beats Heavy** — which is exactly what
the game's own copy says: `strings.json["6001"]` Light *"Effective against Heavy Stance"*,
`["6003"]` Balanced *"Effective against Light Stance"*, `["6005"]` Heavy *"Effective against
Balanced Stance"*. The finding writes *"if (attacker Light vs defender Balanced) … damage *= 1.2"* —
the reverse, which puts the 20% on the three wrong matchups in both directions. Re-filed correctly
at **NF-B**, together with a **web-only ×0.9 term the finding never saw**.

### R5 · `combat/stance-reach-multipliers-diverge-web-vs-android` — the scale claim is false. (material)

The multipliers are exact (web `:3094 ×1.4`, `:3105`, `:3116`; android `:3030 ×1.5`, `:3041`, `:3052`)
and the divergence is real. But *"The mastery scale differs too — android is 0..100, web is 0..10"* is **false**:

- `StatsManager.as:1834` passes `getStat(1000), getStat(1001), getStat(1002)` into `initPlayer` —
  the three stance-mastery **skills**, which `skilldata.xml` enumerates `1..10` (I parsed all three).
- `MCSPlayer.as:3166-3184` gates abilities at mastery `>= 3 / 4 / 5`, identical to web
  `§1t99s0§.as:3223-3241`. A 0..100 scale would make those gates meaningless.

Both builds run 1..10. Only the coefficients differ — and they differ *harder* than the finding
says (android Balanced reaches 1.05 at m=10 where web reaches 1.2; android Heavy 0.55 vs web 0.9).
Believing "android is 0..100" invites a porter to rescale and conclude the builds agree.
The reach divergence itself survives intact via `combat/web-stance-reach-multipliers-diverge-from-android`,
which states the same fact without the error — so refuting this one costs the lane nothing.

### The refuted set, in full

`NF-8-survival-mode-is-byte-identical-in-both-builds` ·
`art-anim/43-named-sfx-cues-held-in-web-v0717` ·
`combat-core/focus-crit-gating-rule-is-held` ·
`combat-core/stance-counter-triangle-x1.2` ·
`combat/stance-reach-multipliers-diverge-web-vs-android`.

In every case the *fact underneath* survives — I re-file each one, corrected, in §4 /
`new_findings`. Nothing in this packet is destroyed by a refutation; four of the five are
refuted for a wrong mechanical statement sitting on top of a right observation.

---

## §2 — The overturn audit (why this tier exists)

I opened `docs/research/REBUILD_READINESS.md` and read each named sentence **in context**.
Ten overturns stand. Fourteen do not, for four distinct reasons:

**(a) It CONFIRMS the sentence rather than falsifying it.**

- `cite04/longplay-frames-are-pillarboxed-scale-is-2.27` → :171 item 12 reads
  *"HUD x-fractions measured off 1920×1080 video **may be** pillarbox-compressed. **Verify** before
  trusting horizontal coords."* The finding performs that verification. I reproduced it on the cited
  frame myself (`reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`, row scan y=540 with R+G+B<25 →
  L=52, R=52, T=0, B=0, content 1816×1080; the pixels at x=52 are real game browns/greens, not
  near-black, so the bar boundary is genuine). Sentence survives, now satisfied. **Upgrade ≠ overturn.**
  Also over-general: *"Every 1920×1080 longplay still"* is video-A only — I sampled 12 frames and
  `zFtCaTO0_1M` measures L≈54 / R≈58, content ≈**1808** (scale 2.26), not 1816.
- `cite04/android-string-table-has-no-900-block` → its ledger_text is the S0-3 caveat, and the
  finding's own text says it is *"the hardest evidence yet for the S0-3 parity caveat."* It is
  evidence **for**. Nothing falls. (The claim itself is excellent and holds — see §3.)

**(b) It restates a correction this lane already carries.**

- `NF-6-web-payload-carries-no-data-xml` → carried correction **C2** already states, verbatim,
  that the web payload has zero `<questdata>/<skilldata>/<npcdata>/<itemdata>` roots and that the
  four extracted XMLs are the android blobs. Every number reproduces (Δ42 B on skilldata/itemdata/npcdata;
  `grep -c skilldata payload.xml` → **0**; `grep -c '<npcdata'` → **0**; the lone `itemdata`/`questdata`
  hits at byte ~19.50 M sit inside an ABC constant-pool dump among `terrX`, `terrY`, `prosperity`,
  `encounterdata`, `battlereports`, `clanId`, `ByLevel` — BigDB table names, exactly as claimed).
  True, verified, **but no `REBUILD_READINESS.md` sentence falls.**

**(c) The ledger already concedes it, two dozen lines earlier.**

- `enemies-ai/boss-rubber-band-is-in-the-web-build` → :220 blocker ① *"enemy level→stat formula …
  absent"* is already struck by the doc's own **STALENESS BANNER at :32**: *"`npcdata.xml` — 495 NPCs,
  full paperdoll + `<lvl>` + `<ai>` + `<skill>`."* And the cited code is the **elite/boss rubber-band**
  (gated on `if(this.§1t4528s0§)`; `_loc8_ = param1 − playerLevel`; `_loc9_ = 10 + _loc8_` clamped ≥3 is the
  hits-to-kill target that sets elite HP at `:110`; `_loc10_ = 18 − _loc8_` clamped ≥1 divides player HP to
  set elite damage at `:117-120`) — a *different mechanism* from the roster-wide level→stat formula the
  sentence names. Its real value is the **0.682 → 0.717 build upgrade**, which I confirm.

**(d) It closes one half of a compound blocker.**

- `combat-core/flinch-is-nested-inside-the-iframe-window` and
  `enemies-ai/flinch-is-build-parity-confirmed-in-web-v0717` → :220 ③ is
  *"telegraph/active/recovery **+** stagger frames."* Both close **stagger** decisively.
  **Telegraph/active/recovery is untouched by either.** Strike half the line, not the line.
- `economy/tournament-payout-formula-is-client-side` → :215 ④ is *"**token**/tournament economy numbers."*
  The tournament half closes completely. The **token** half does not — the finding itself concedes
  currency-stat 20112 has no name in `itemdata.xml` or the v0.682 string table.
- `NF-4/premium-ladder-has-a-2-gold-tier` → its ledger_text is the two words *"Ninja-Services prices"*,
  which appear at :135 and :244 in the **Ready** column with **no values attached**. The ledger never
  says 1/3/5/12, never says 30 bundles. There is nothing there to falsify.

---

## §3 — What held, and what I opened to check it

Every verdict below rests on an artifact **I** opened; nothing is taken on the finding's word.

- **Rebirth (two findings).** `§1t1523s0§.as:2644` `if(§1t7356s0§(§1t9426s0§) == 8)` · `:2646` `…(§1t9413s0§,100)` ·
  `:2651` `…(§1t9413s0§,25)` · `:228` `§1t9413s0§:int = 12`. The stat-index table at `:200-250` maps
  **1:1** onto `StatsManager.as:170-215` (`STAT_HGOLD = 12`), and `:2643` `§1t9712s0§(§1t8755s0§,0)` is
  `setStat(STAT_XP,0)` — the same first line as `doRebirth()`. So the web payout is **25 / 100 Heavenly
  Gold** against android's **5 / 20** (`StatsManager.as:2201-2207`). Ledger item 7 at :164-165 falls:
  `MAX_DAN_RANK=10` and `tenthGold=100` are code-sourced, and *"no 10th-rebirth tier"* is flatly false —
  the Dan-8 arm announces `getString(864,[name,"10"])`.
- **DEF.** `§1t99s0§.as:3284-3290` (`defense * 0.8` in Heavy, else `defense`) and the subtraction at
  `:3484`, `:3800`, `:4391`; android twin `MCSPlayer.as:3709`. Flat subtraction, no curve. The finding
  omits the **min-damage floor** immediately after (`if(_loc5_ < param2.§1t1088s0§()) _loc5_ = param2.§1t1088s0§()`),
  which is part of the model — incomplete, not wrong.
- **Repair economy, twice over.** Code: `§1t401s0§.as:1058` `cost = …§1t9936s0§() * 10`, `:1068` the
  `itemID == 0 || == 13000` refusal, `:1076` charge, `:1077-1080` `uses → 1`, `:1081` achievement 60005,
  `:1086-1087` reinforce 5000 — line-for-line the android `InteractUI.as` `"repairweapon"` / `"reinforceweapon"` cases.
  **Film:** I pulled the frames myself with ffmpeg from `reference/videos/Nr4fQstqHDM.mp4` —
  t=21:23 *"FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS / MATERIALS NEEDED: 2 IRON ORE"*,
  t=21:26 *"BLACKSMITH / REPAIR YOUR CURRENTLY EQUIPPED WEAPON? / COST: 70 COINS"* with wallet **531 COINS**,
  t=21:27 wallet **461 COINS** (3× crop of the HUD strip). **−70 at node level 7 = nodeLevel × 10.**
  :215 ③ *"never captured"* is dead, and the :216 parenthetical *"the −70 HUD read is a capture artifact"*
  dies with it.
- **Crit.** `§1t99s0§.as:3258-3274` — `minDamage + random*damageRange`, then Light `×(0.5+0.04·m)`,
  Balanced `×(1+0.02·m)`, Heavy/Dual/Reversed flat `×1.4`, then `if(reload == maxreload) return ×1.3 + itemCritDmg`.
  Deterministic, at a full bar, spent at `:3295-3297`. :190 ② dies.
- **Mastery 10.** `skilldata.xml` skills 1000/1001/1002 each enumerate `<value>` 1…10 (I parsed all three);
  `strings.json["8131"/"8132"/"8133"]` = *"… Stance Mastery Level 10."*; `["6005"]` = *"Defense -20%"*,
  matching `defense * 0.8` in code. At m=10 the web curve lands on exactly **0.9 / 1.2 / 1.4** — the wiki
  triple. So :155's *"MASTERY-9 CEILING"* is off by one; the published table is the **mastery-10 row**.
  (Caveat I add: the 1..10 enumeration is the **android-sourced** `skilldata.xml` per C2; the web code
  corroborates it only by landing on the wiki triple at m=10.)
- **Reach.** Web `§1t99s0§.as:3094 / 3105 / 3116-3119 / 3131 / 3142 / 3158` vs android
  `MCSPlayer.as:3030 / 3041 / 3052`; shared base `120 + floor((90 + Dan·5)·spd/(20+spd))` identical in both
  (`§1t1523s0§.as:2346-2347` vs `StatsManager.as:1917-1918`); both feed setMaxDistance
  (`§1t1541s0§.as:106-108` ≡ `InputManager.as:106` — **same line number in both builds**). The class
  identification is sound: `§1t99s0§.as:183-199` is the 15-arg `initPlayer` twin, param10 → `§1t4420s0§`
  declared `= 10` at `:105`, exactly `baseSlashLength:int = 10` at `MCSPlayer.as:107`. m=9 arithmetic
  checks: 1.18 / 1.045 and 0.86 / 0.545. :190 ① dies **on the web constants.**
- **Flinch.** `§1t68s0§.as:768-785` save-and-restore; `§1t99s0§.as:4680-4695` player override branching
  `flinch` vs `flinch_weapon`; `§1t1544s0§.as:170/172` the two names; `bindata/103_1t4630s0.bin` carries
  `<anim i="flinch" d="8">` **and** `<anim i="flinch_weapon" d="8">` — and that blob is **md5-identical**
  to android `94_MCSCharacter_Human2AnimationData.bin`. The nesting argument holds too: `EnemyZombie.as:522`
  `gotHitCounter = 12` and `:544` `startAction(FLINCH_STATE)` are in one `gotHit()` call;
  `EnemyShield.as:39` advances the pose exactly once (`MCSCharacter.as:1315 ++frameCounter`) and `:123-125`
  decrements the counter once, per update. The "invulnerability" reading is grounded, not assumed:
  `MCSPlayer.as:3589` `if(gotHitCounter > 0) { return false; }` **inside `gotHit()`**. Ticks 0–7 flinch
  nested in ticks 0–11 i-frames.
- **Tournament.** `§1t7091s0§.as:408-412` prize unit `floor((fee·players + 5)·0.75/7)` paid 4/2/1;
  ladder 2/4/8/16 with 2 premium-gated (`:147-180`); fee clamp 0…100 (`:183-200`); level clamp 5…80
  (`:205-236`); duration 48/24/2/1/0.5 h with a premium-only "-" (`:303-330`); `§1t7144s0§.as:572/585`
  create −5 of stat 20112, `:600/610` join −entryfee. 25% rake confirmed by arithmetic.
- **Premium ladder.** I re-ran the join: `121_Mobile_PremiumData.bin` has 176 `<item>` tags, **143 unique**;
  every one resolves in `itemdata.xml`; histogram **{1:20, 2:2, 3:94, 5:4, 12:23}**; the two 2-Gold rows are
  **2101 "Medium Soldier Pill"** and **2126 "25 Duel Tokens"**; the 12-Gold tier is 23 rows,
  2130 "Assassin Outfit" … 2171 "Swords of the Mist". Exact. One build correction: the finding's
  `build` field says *"prices WEB itemdata.xml"* — under **C2** `reference/extracted/itemdata.xml`
  **is the android blob** (184,002 vs 184,044 = the same Δ42). Both sources are v0.682.
- **Severed limbs.** I decoded `99_MCSCharacter_HumanAnimationData.bin` as **utf-8-sig** (first bytes
  `ef bb bf`) — 158 anims, of which `death 38 · deathenemy 23 · deathnohand 25 · deathnohead 31 ·
  deathwitharrow 23 · deathbyarrow 21 · deathdowned 7 · deathinhalf 28`. Every frame count in the finding
  is right. :240 ⑤ is atomic and dies.
- **The 900-block gap.** `strings.json` census: max ID below 900 = **880**, entries in 900–999 = **0**,
  resumes at **1000**. And `§1t113s0§.as:111` renders `getString(**960**)` in `#BBBBBB` under the bars.
  My own 4× LANCZOS crop of `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` at (230,960)-(560,1070)
  shows HP **20/20**, Chi **26/26**, and a grey **"CANNOT CHANGE STANCE"** immediately below, with
  "150% DAMAGE" under it. The web client reads string IDs the android table has no row for.

---

## §4 — Hunter lens (a): things nobody claimed, found while judging

Full detail in the structured `new_findings`. Summary, all first-hand:

1. **The WEB Focus meter is a different meter.** `maxreload = 8*24 = 192` (`§1t99s0§.as:249`) vs
   android's `5*24 = 120`. In-battle stance switch costs a **flat −48** (`:3162`) vs android's
   proportional collapse. `nextStance` gates at `reload >= 48` (`:3050`, `:3060`) vs `< maxreload/6` (=20).
   Recharge is **+1/tick in both**; `+6` is a kill bonus in both.
2. **The stance triangle has a losing side, and only in the web build.** `§1t99s0§.as:3788-3794` ×1.2,
   then `:3796-3798` **`else if(… reversed matchup …) _loc5_ *= 0.9;`**. Android `MCSPlayer.as:3701-3708`
   has the ×1.2 branch and **no** ×0.9. Six ordered matchups, not three.
3. **The SPD→cooldown formula saturates at 600 in the web build, not 300.** `§1t1523s0§.as:2289-2296`:
   `if(param1 > 600) param1 = 600; return 1 - param1 / 600 * 0.5;` — consumed via `§1t105s0§.as:318`
   `return _loc2_ * §1t1523s0§.§1t9589s0§();` where `_loc2_ = levelList[lvl].cooldown * 24`.
   Android is `300` (`StatsManager.as:1854-1860`). Porting the android constant halves the effect.
4. **A bindata parity map.** 21 of 27 web blobs are **md5-identical** to android blobs. The six that are
   not: ogre (100), skills (102), guardian (111), spear (113), survivalmodedata (119) — and
   **114_1t4641s0.bin, a SPIDER set (10 anims incl. `spider_dig`, `spider_descend`, `spider_death2`)
   with no android counterpart at all.** An enemy type that exists only in the target build.
5. **A WEB-side cite for the 800×480 native**, replacing the android-only one: `§1t1540s0§.as:271-273`
   `var _loc2_:int = 800; var _loc3_:int = 480; var _loc4_:int = 690;` — plus the shipped fit at
   `:296-306` (uniform scale, centre, pillarbox when the viewport is wider than 5:3) and a **second
   supported layout, 800×690**, chosen when the viewport is narrower than 800/690.
6. **The audio decrypt recipe, exactly.** Only bytes 3..255; `i % 11 == 0` swaps with `i+256`; XOR key
   `charCodeAt(1)`. 13 waveforms recovered against **43** named cues in the web payload.
7. **DEF has a floor.** `_loc5_ -= getDefense(); if(_loc5_ < param2.getMinDamage()) _loc5_ = getMinDamage();`
   in all three web damage paths and in android. Defence can never push a hit below the attacker's
   minimum — the flat-subtraction claim is true but incomplete without it.

---

## §5 — Standing note for the rewriter

Two habits produced four of my five refutations:

- **Aggregate agreement was mistaken for identity.** (survival waves)
- **A method's `this` was assumed to be the attacker.** (counter-triangle, Focus penalty)

And one produced the rest: **an android constant promoted to a v0.717 ledger without locating the web
twin.** The web twin existed every time I looked — reach, reload, cooldown saturation, rebirth payout —
and it differed every time. `shs3_payload/` is not a mirror of `shs3_android/`; combat tuning is exactly
where the two builds drift. Treat any combat number cited only from `shs3_android/` as unconfirmed for
the target build until its `§1t…§` twin is on the page.
