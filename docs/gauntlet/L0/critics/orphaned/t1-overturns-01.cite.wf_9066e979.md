# t1-overturns-01 — CITE LENS review (blind critic)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-01.json` — **24 claims, 24 judged, 0 skipped.**
Every verdict below rests on an artifact **I opened myself**. Machine-audit status is quoted, then
the part a script cannot do: *does the artifact say what the claim says it says?*

**Result: 21 HELD · 3 REFUTED (`NF-4-spd-to-cooldown-formula-recovered`,
`NF-8-survival-mode-is-byte-identical-in-both-builds`, `combat-core/focus-crit-gating-rule-is-held`).**

Two of the three refutations come from the same failure mode and it is worth naming up front:
**a formula that is verbatim-correct in `shs3_android/` is not thereby correct for the web target.**
I located the WEB twin of two android functions this packet promoted to ledger closure and the
constants are *different*. This is the exact hazard `combat/web-stance-reach-multipliers-diverge-from-android`
warns about in its own lane note — and that warning is now vindicated twice more.

---

## REFUTED

### R1 — `NF-4-spd-to-cooldown-formula-recovered` — REFUTED (material)
citelint RESOLVES · own cite: `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2289-2296`

The android transcription is **exact**. `reference/decompiled/shs3_android/scripts/StatsManager.as:1854-1860`
reads verbatim:

```
1854:       internal static function getSkillCooldownModifierVal(speed:int) : Number
1856:          if(speed > 300)
1858:             speed = 300;
1860:          return 1 - speed / 300 * 0.5;
```

The consumer at `InventoryUI.as:1937` and the print at `:2233` are also verbatim-correct.

**But the finding's load-bearing sentence is its ledger closure** — "This closes skills-meters blocker
④ at REBUILD_READINESS.md:195 and the SPD half of progression blocker ① at :200" — and those blockers
are for the **web v0.717** target. I found the web twin. It uses a **different divisor**:

```
reference/decompiled/shs3_payload/scripts/§1t1523s0§.as
2289:       internal static function §1t9590s0§(param1:int) : Number
2291:          if(param1 > 600)
2293:             param1 = 600;
2295:          return 1 - param1 / 600 * 0.5;
```

Twin identity is not guessed. The whole three-function block maps one-to-one:

| android `StatsManager.as` | web `§1t1523s0§.as` | body |
|---|---|---|
| `getBaseReload()` :1839-1842 | `§1t9588s0§()` :2274-2277 | `48 + (SPD + bonus) * 6` — **identical** |
| `getSkillCooldownModifier()` :1844-1852 | `§1t9589s0§()` :2279-2287 | read SPD, `*= 1.5` on a buff/premium flag, delegate |
| `getSkillCooldownModifierVal()` :1854-1861 | `§1t9590s0§()` :2289-2296 | **clamp 300 ÷300  vs  clamp 600 ÷600** |

and `§1t9410s0§:int = 8` (`§1t1523s0§.as:220`) is `STAT_SPEED:int = 8` (`StatsManager.as:186`).

Consequence: at SPD 150 the modifier is **0.75 on android but 0.875 on web**. The finding's own
cross-check ("the payload's own placeholder character sheet prints 0.75, which back-solves to SPD 150")
is doubly wrong — `InventoryUI.as` is the **android** decompile, not "the payload", and under the web
formula 0.75 back-solves to SPD **300**.

The finding's parenthetical defence — "the sibling `getBaseSlashLengthVal` IS identical in both builds"
— is precisely the inference that fails. The sibling *is* identical (I checked: `StatsManager.as:1917-1918`
≡ `§1t1523s0§.as:2346-2347`, `120 + floor((90 + Dan*5) * spd / (20 + spd))`). Sibling identity does not
transfer. Blocker ④ **does** close — on `/600`, not `/300`. See new finding **NF-A**.

### R2 — `NF-8-survival-mode-is-byte-identical-in-both-builds` — REFUTED (material)
citelint QUOTE_UNVERIFIED · own cite: `reference/extracted/bindata/119_1t4646s0.bin` vs `reference/extracted/android/109_WarHexUI_SurvivalModeData.bin` (both parsed and byte-diffed by me)

The four aggregates the finding quotes **all reproduce exactly**, in both files:

```
WEB     wave 39 · enemy 87 · x {-50: 49, 1650: 37, -1650: 1} · ids[0] '400|401|402|403|404'
ANDROID wave 39 · enemy 87 · x {-50: 49, 1650: 37, -1650: 1} · ids[0] '400|401|402|403|404'
```

`XMLBG.as:14 internal var contentWidth:int = 1600;` is verbatim-correct.

**The finding is still refuted, because the blobs are not identical and the headline says they are.**

```
lens 11721 (web) vs 11553 (android)   →  168-byte difference
differing bytes: 1379,  first at offset 9972
web     ... <wave><enemy><id>449|454|449|454|443</id><qty>3</qty><x>-50</x> ...
android ... <wave><enemy><id>449|454</id>            <qty>3</qty><x>-50</x> ...
```

So "its authored content is IDENTICAL" and "**Every figure** matches the android
109_WarHexUI_SurvivalModeData blob **exactly**" are false: at least one wave's enemy-id alternation
list carries five entries in web v0.717 against two in android v0.682. The `<wave>`/`<enemy>`/`<x>`
counts coincide because the divergence is *inside* an existing `<id>` element.

What survives — and I re-file it as **NF-E** — is that survival mode **is present and parseable in the
TARGET build**, so S0-1's gap closes on *presence*, not on *identity*.

### R3 — `combat-core/focus-crit-gating-rule-is-held` — REFUTED (material)
citelint RESOLVES · own cite: `reference/decompiled/shs3_android/scripts/MCSPlayer.as:1156-1170` and `reference/decompiled/shs3_android/scripts/NPCManager.as:1709-1712`

Six of the seven quoted lines are verbatim-correct — `:239 this.maxreload = 5 * 24;`,
`:2977 if(this.reload < this.maxreload / 6)`, `:3098-3104` the on-hit collapse, `:3242-3244` the
zero-at-full, `:3249-3257` the per-stance drain, `BattleUI.as:261-262` the bar + crit-text. I read
every one.

**The recharge rate is wrong.** The finding says "It recharges **+6 per tick**". It does not:

```
MCSPlayer.as:1158  if(this.reload < this.maxreload)
MCSPlayer.as:1160     ++this.reload;                      ← the per-tick fill: +1
MCSPlayer.as:3265  public function bonusReload() : *
MCSPlayer.as:3267     this.reload += 6;                   ← NOT per tick
NPCManager.as:1709 if(deathCount > 0)
NPCManager.as:1711    StatsManager.getPlayer().bonusReload();   ← the only call site: on KILL
```

`grep -rn 'bonusReload' reference/decompiled/shs3_android/scripts/` returns exactly two lines: the
declaration and `NPCManager.as:1711`. `+6` is an **on-kill bonus**, not the tick rate. The finding
contradicts itself — its own "120 frames (5 s at 24 fps)" only holds at +1/tick; at +6/tick the bar
would fill in 20 ticks (0.83 s).

The finding's lane note honestly says "Web-parity not yet checked by value". I checked it, and the web
build diverges on **two** more numbers — `maxreload = 8 * 24` and a flat `-48` on-hit penalty. See
**NF-B**. As filed, this rule must not enter the ledger.

---

## HELD — with the artifact I opened

**`NF-1/ledger-rebirth-25-is-code-sourced-not-film`** · own cite `docs/research/REBUILD_READINESS.md:165` + `:205` + `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2651`.
Both ledger lines are verbatim (`:165 "…film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."`;
`:205 "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."`). The self-contradiction
is real. Web code is verbatim at `:2644 if(§1t7356s0§(§1t9426s0§) == 8)` / `:2646 §1t9713s0§(§1t9413s0§,100);`
/ `:2651 §1t9713s0§(§1t9413s0§,25);`, and `:79-80` banks "rebirth scroll 1000c (+25g)". The +25 survives on
code; the film provenance and the "no 10th-rebirth tier" clause both fall.

**`NF-3-def-mitigation-is-flat-subtraction-both-builds`** · own cite `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3284-3290`.
Verbatim in web (`:3286 if(this.stance == §1t12222s0§) :3288 return defense * 0.8;` else `defense`), and the
three subtraction sites `:3484`, `:3800`, `:4391` all read `_loc5_ -= this.§1t4477s0§();`. Android twin
`MCSPlayer.as:3231-3238` / `:3415` / `:3709` identical. `docs/research/fidelity/SOURCE_CONSTANTS.md:149`
reads verbatim "`dmg -= defenderEffectiveDefense` — **defence SUBTRACTS, it never divides**". No curve exists.

**`NF-3/web-twin-of-repair-and-reinforce`** · own cite `reference/decompiled/shs3_payload/scripts/§1t401s0§.as:1057-1087`.
All six quoted lines verbatim. `§1t1525s0§.§1t9936s0§()` (`§1t1525s0§.as:896-899`) returns
`§1t70s0§.instance.§1t1139s0§(§1t9911s0§)` — the twin of `StageManager.getCurrentNodeLevel()`
(`StageManager.as:782-785 return NodeGenerator.instance.getNodeLevel(currentNode);`). Repair = nodeLevel × 10,
reinforce = flat 5000, both in the WEB build.

**`NF-4/premium-ladder-has-a-2-gold-tier`** · own cite `reference/extracted/android/121_Mobile_PremiumData.bin` joined to `reference/extracted/itemdata.xml` + `docs/gauntlet/L0/index/resolved_names.json`.
I recomputed the join: 176 `<item>` refs, **143 unique**, histogram **`{'1': 20, '2': 2, '3': 94, '5': 4, '12': 23}`** —
an exact match. Names resolve exactly: 2101 *Medium Soldier Pill*, 2126 *25 Duel Tokens*, 2130 *Assassin Outfit*,
2171 *Swords of the Mist*; the 12-Gold tier is 23 rows. Overturn target is real —
`docs/gauntlet/L0/LEDGER_EVIDENCE.md:2264` states the "1/3/5/12 Gold ladder".
⚠ **Correction to the finding's own build tag.** It says "prices WEB itemdata.xml". There is no web
itemdata.xml (see `NF-6`, which I confirmed). `reference/extracted/itemdata.xml` is byte-for-byte
`reference/extracted/android/111_Mobile_ItemData.bin` minus its header/trailer. Re-tag **v0.682**.

**`NF-5/stance-mastery-caps-at-10-not-9`** · own cite `reference/extracted/skilldata.xml` (parsed) + `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3276`.
Skills 1000/1001/1002 each carry exactly 10 `<level>` with `<value>` 1…10. Web `:3262` `(0.5 + 0.4*m*0.1)`,
`:3265` `(1 + 0.2*m*0.1)`, `:3270` `* 1.4` → **0.9 / 1.2 / 1.4 at m = 10**, the wiki triple. Note the web
`*0.1` scaling is itself independent evidence of a 0…10 mastery scale, so the conclusion does not depend
on the (android-sourced) skilldata.xml. `REBUILD_READINESS.md:155` is verbatim as quoted.

**`NF-6-web-payload-carries-no-data-xml`** · citelint QUOTE_UNVERIFIED — **quote located, claim confirmed on every limb.** own cite `reference/extracted/payload.xml` (full 329,520,665-byte scan) + `reference/extracted/bindata/` (all 27 roots parsed).
This is the strongest claim in the packet.
- 27 web bindata files: **19 animdata (100-118) · 1 survivalmodedata (119) · 93 `<obj>` · 94-98 plain name
  tables · 92 `GIF8`** — no data XML, no lang table.
- Full byte scan of payload.xml: `skilldata` **0** · `<npcdata` **0** · `<itemdata` **0** · `<questdata` **0** ·
  `itemdata` **1** (byte 19,503,662) · `questdata` **1** (byte 19,502,336). Both hits sit inside a list of
  `<item>` string constants next to `ByRoomId`, `clanId`, `ByLevel`, `prosperity`, `encounterdata` — BigDB
  table names, exactly as claimed. (My offsets differ from the finding's by 24/27 bytes; immaterial.)
- Sizes match to the byte: 39,003/39,045 · 184,002/184,044 · 228,413/228,455 — the same **42-byte** delta.
  I proved identity mechanically: for skilldata, `web == android[after decl].lstrip(CRLF)[:-2]` is **True**.
- ⚠ small correction: it is the 38-byte declaration + its CRLF + a 2-byte **trailing** CRLF, not "CRLFs"
  generally — interior CRLFs are preserved. questdata's delta is 1 (trailing `\n`).

**`art-anim/43-named-sfx-cues-held-in-web-v0717`** · citelint QUOTE_UNVERIFIED — **quote located.** own cite: my own rerun of the finding's grep + `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:468-479`.
`grep -rhoE '"Snd_[A-Za-z0-9_]+"' reference/decompiled/shs3_payload/scripts/ | sort -u | wc -l` → **43**.
Call sites verbatim: `:472 §1t88s0§.instance.§1t1516s0§("Snd_smallClick");` inside the taken branch and
`:478 …("Snd_error");` inside the else — a legal vs refused stance switch, exactly as described.
Two corrections, both minor: the enumeration lists only **40** of the 43 (it omits `Snd_wrDeploy`,
`Snd_wrMove`, `Snd_wrScout`); and the lane note "the WAVEFORMS remain unrecovered (S0-5 …) and that half
stands" **repeats a dead line** — §0 C3 rules S0-5 dead, the audio IS recovered. Strike that clause; the
ledger overturn of `REBUILD_READINESS.md:240` blocker ① holds *more* strongly than the finding claims.

**`art-anim/severed-limb-death-variant-is-held`** · own cite `reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin` (magic `ef bb bf`, decoded utf-8-sig, regex-scanned).
158 anims total, and all eight quoted rows reproduce exactly: `death 38 · deathenemy 23 · deathnohand 25 ·
deathnohead 31 · deathwitharrow 23 · deathbyarrow 21 · deathdowned 7 · deathinhalf 28`. The file is
UTF-8-with-BOM, confirming §0 C1. Blocker ⑤ at `:240` closes.

**`cite04/android-string-table-has-no-900-block`** · own cite `docs/gauntlet/L0/index/strings.json` (recensused) + `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:111` + `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` crop (230,960)-(560,1070) @4× LANCZOS.
Census reproduces **digit for digit**: 100 · 100 · 90 · 91 · 100 · 100 · 99 · 100 · **79 (max = 880)** ·
**0** · 45. (640 keys are `IDS_*` quest-node names, correctly excluded.) Web `:111` verbatim:
`this.§1t5204s0§ = "<font color=\'#BBBBBB\'>" + §1t1521s0§.getString(960) + "</font>";`, and `:338-356`
show it swapped into HUD field `§1t5169s0§` against the black `getString(175)` alternative.
**I cropped and looked**: the frame VISIBLY shows a green `20/20` bar, a blue `26/26` bar, and directly
beneath them a grey-on-tan label reading **"CANNOT CHANGE STANCE"** (with "150% DAMAGE" below). The
hardest S0-3 parity evidence in the lane.

**`cite04/longplay-frames-are-pillarboxed-scale-is-2.27`** · own cite `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`, my own row/column scan at threshold R+G+B < 25.
Measured myself: **1920×1080 · first lit column x=52 · last lit column x=1867 · content 1816 px · top bar 0 ·
bottom bar 0 · content height 1080.** Column max-sums confirm the boundary is hard (col 51 → 15, col 52 → 186;
col 1867 → 146, col 1868 → 14). `StatsManager.as:80 public static var stageWidth:int = 800;` and
`:82 … stageHeight:int = 480;` verbatim. So 1816/800 = **2.27**, not 1920/800 = 2.4. Ledger item 12 upgrades
from warning to constant.

**`cite04/web-rebirth-pays-25-and-100-heavenly-gold`** · own cite `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2651` + `:228` and `reference/decompiled/shs3_android/scripts/StatsManager.as:194`, `:2201-2207`.
All verbatim. `§1t1523s0§.as:228 internal static const §1t9413s0§:int = 12;` ≡ `StatsManager.as:194
internal static var STAT_HGOLD:int = 12;`. Web pays **100 / 25**; android `:2203/:2207` pays **20 / 5**.
The Dan-8 tier pays exactly 4×. The film's "+25" is the right number with the wrong currency label.

**`combat-core/damage-triple-crit-1p3-and-heavy-def-confirmed-in-web-source`** · own cite `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3276`, `:3284-3290`, `:249`, `:1203-1205`.
Every quoted line verbatim. I closed the one gap the quote leaves open — that `§1t4414s0§`/`§1t4415s0§`
really are reload/maxreload: `:249 this.§1t4415s0§ = 8 * 24; :250 this.§1t4414s0§ = 0;` (same shape as
android `:239-240`), `:1203-1205 if(reload < maxreload) ++reload;`, `:3320 reload += 6;`. So `:3272
if(this.§1t4414s0§ == this.§1t4415s0§)` **is** a full-Focus test and crit is **deterministic**, and
`:3297 this.§1t4414s0§ = 0;` zeroes the bar on the critting slash. Blocker ② at `:189` and skills-meters
blocker ⑤ at `:195` both close.

**`combat-core/flinch-is-nested-inside-the-iframe-window`** · citelint QUOTE_UNVERIFIED — **quote located.** own cite `reference/decompiled/shs3_android/scripts/EnemyZombie.as:449-456` + `:522` + `:544`, `MCSCharacter.as:1309-1329`, `EnemyShield.as:39` + `:122-126`.
All four cites verbatim. I proved the load-bearing premise the quote asserts but does not evidence — that
`gotHitCounter` **is** the invulnerability gate: `EnemyZombie.as:449 override public function gotHit(...) :453
if(gotHitCounter > 0) :455 return false;` and `MCSPlayer.as:3275 checkHitObject(...) :3287 if(gotHitCounter > 0)
:3289 return false;`. And the 8-frame figure checks out in the animation data, in **both** builds:
`reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin` and
`reference/extracted/bindata/103_1t4630s0.bin` each carry `<anim i="flinch" d="8">` and
`<anim i="flinch_weapon" d="8">`. One `updateAnimation()` and one `--gotHitCounter` per NPC update ⇒ same
clock ⇒ flinch (ticks 0-7) nested inside i-frames (ticks 0-11). Held.

**`combat-core/mastery-caps-at-10-per-the-string-table`** · own cite `docs/gauntlet/L0/index/strings.json["8131"]`, `["8132"]`, `["8133"]`, `["6005"]`.
All four verbatim, including `["6005"] = 'Slow but powerful stance… Effective against Balanced Stance.\nDefense -20%'`.
The −20% is the string-table confirmation of `defense * 0.8`. The finding's own CONTRACT-SRC caveat
(android table) is correctly stated.

**`combat-core/stance-counter-triangle-x1.2`** · own cite `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3698-3720`.
Verbatim, and the *ordering* claim is the part that matters and it is right: `:3701` triangle test →
`:3703 damage *= 1.2;` → `:3709 damage -= this.getDefense();` → `:3710-3713` min-damage floor →
`:3716 damage *= 1.5;` behead. `REBUILD_READINESS.md:74` reads verbatim as quoted and carries no triangle
term. See **NF-D**: the web build has the same ×1.2 **plus** a losing-stance ×0.9 android lacks.

**`combat/stance-reach-multipliers-diverge-web-vs-android`** and
**`combat/web-stance-reach-multipliers-diverge-from-android`** — both HELD (near-duplicates; enter once).
own cite `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3091-3158` and `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3027-3082`.
Every line verbatim. Web: `:3094 ×1.4` · `:3105 ×(1 + 0.2·m·0.1)` · `:3116 ×(0.5 + 0.4·m·0.1)` with
`:3117-3119` floor 100 · `:3131 ×1.4` · `:3142 ×1.0` with `:3143-3145` floor 100 · `:3158`
`§1t1541s0§.§1t10094s0§(this.§1t4417s0§)`, and `§1t1541s0§.as:106-108` shows that function assigns
`maxDistance` — the `setMaxDistance` twin. Android: `:3030 ×1.5` · `:3041 ×(1 + 0.5·m·0.01)` ·
`:3052 ×(0.5 + 0.5·m·0.01)` · `:3067 REVERSED ×1.5` · `:3078 DUAL ×1.0`. The stance mapping is not
guessed — android case order is LIGHT/BALANCED/HEAVY/**REVERSED**/**DUAL** and the web switch runs
`§1t12220s0§/§1t12221s0§/§1t12222s0§/§1t12224s0§/§1t12223s0§` with matching `setStanceColor` arguments
(web `:3138` → 2 ≡ android REVERSED `:3074` → 2). Class identity holds: `§1t4420s0§:int = 10` at
`§1t99s0§.as:105` ≡ `baseSlashLength:int = 10` at `MCSPlayer.as:107`, param10 of a 15-arg init at
`:183-199`. Shared SPD base identical in both builds (`§1t1523s0§.as:2346-2347` ≡ `StatsManager.as:1917-1918`).

**`economy/repair-weapon-cost-was-captured-on-film`** · **A1 — I extracted the frames myself.**
own cite `reference/videos/Nr4fQstqHDM.mp4` at 00:21:23 / 00:21:26 / 00:21:27, `ffmpeg -ss … -frames:v 1`
at 1920×1080, read at 640×360.
- **21:23** — "FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS / MATERIALS NEEDED: 2 IRON ORE", wallet **531 COINS / 2 GOLD**.
- **21:26** — "BLACKSMITH / REPAIR YOUR CURRENTLY EQUIPPED WEAPON? / COST: 70 COINS", YES / NO, wallet **531 COINS**.
- **21:27** — menu back to FORGE / REPAIR / REINFORCE / LEAVE, wallet **461 COINS**. 531 − 70 = 461. ✔
I also closed the inference the finding leaves implicit: `InteractUI.as:1002-1003
case "forgeweapon": level = StageManager.getCurrentNodeLevel();` proves the forge dialog's "(LEVEL 7)"
**is the node level**, so 70 = nodeLevel × 10 matches `InteractUI.as:1058` verbatim.
⚠ **STANDING INVARIANT — THE FRAME WINS.** `REBUILD_READINESS.md:215` says "③ Repair-Weapon cost
(never captured)". The frame captures it. The doc is wrong; strike the parenthetical.

**`economy/tournament-payout-formula-is-client-side`** · own cite `reference/decompiled/shs3_payload/scripts/§1t7091s0§.as:406-412`, `:147-180`, `:183-201`, `:205-262`, `:303-360` + `§1t7144s0§.as:572`, `:585`, `:600`, `:610`.
All verbatim. `:408 var _loc1_:int = Math.floor((this.§1t7121s0§ * this.§1t7120s0§ + 5) * 0.75 / 7);` then
4u/2u/1u at `:409-412`. Player ladder 2/4/8/16 with the 2-rung gated on `§1t9725s0§(§1t9464s0§)` at `:157`;
entry fee clamped 0…100 at `:185-197`; level clamps `< 5 || > 80 → 5` and `> 80` at `:205-262`; duration
ladder 0.5/1/2/24/48 h at `:305-359`. Create charges `-5` of stat 20112 at `:585` (waived by the premium
flag at `:583`), join charges `-entryfee` at `:610`. House rake is exactly 25%.
⚠ Two minor blemishes, neither load-bearing: the lane note "**§1t7144s0§.as itself contains NO literals**"
is **false** and is contradicted by the finding's own quote (`:572 … < 5`, `:585 … ,-5`); and the duration
ladder omits a premium-gated `0` ("-") rung at `:321-327`.

**`enemies-ai/boss-rubber-band-is-in-the-web-build`** · own cite `reference/decompiled/shs3_payload/scripts/§1t4523s0§.as:70-96`.
Verbatim: `:77 xp = param1 * 5 + 45;` · `:81 _loc7_ = §1t1523s0§.getLevel();` · `:82 _loc8_ = param1 - _loc7_;` ·
`:83 _loc9_ = 10 + _loc8_;` · `:84 _loc10_ = 18 - _loc8_;` · `:85-88` clamp `<= 3 → 3` · `:89-92` clamp `<= 0 → 1`.
It is in the **web** payload, so `src/config/combat-sim.ts:110-113` (the "INFERRED seed" comment — it exists,
I read it) can be promoted to CONTRACT (0.717).

**`enemies-ai/flinch-is-build-parity-confirmed-in-web-v0717`** · own cite `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:768-786`, `§1t99s0§.as:4679-4696`, `§1t1544s0§.as:170`/`:172`, `reference/extracted/bindata/103_1t4630s0.bin` (parsed).
All verbatim. The save-and-restore pair is `:768-779` (guard, stash actionState/animation/`§1t6269s0§`, set
FLINCH state, play `§1t10421s0§`) and `:781-786` (restore). The player override at `§1t99s0§.as:4688-4695`
branches `§1t10423s0§` ("flinch") vs `§1t10421s0§` ("flinch_weapon") on four sheathed animations.
`§1t1544s0§.as:170 = "flinch_weapon"`, `:172 = "flinch"`. And the web blob carries
`<anim i="flinch_weapon" d="8">` and `<anim i="flinch" d="8">`. Stagger half of blocker ③ closes at the target build.

---

## NEW FINDINGS (unclaimed by anyone; found while judging)

**NF-A — the WEB SPD→cooldown divisor is 600, not 300.** A2 · web v0.717 · HELD · overturns
`REBUILD_READINESS.md:195` "④ SPD→cooldown formula."
`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2289-2296` — `if(param1 > 600) { param1 = 600; }
return 1 - param1 / 600 * 0.5;` against `reference/decompiled/shs3_android/scripts/StatsManager.as:1854-1861`'s
`300`. Twin identity established by the surrounding block (`§1t9588s0§`≡`getBaseReload`,
`§1t9589s0§`≡`getSkillCooldownModifier`) and `§1t9410s0§ = 8 = STAT_SPEED`. **Port the /600 form.**

**NF-B — the WEB Focus meter is 192 frames with a flat −48 on-hit penalty, not android's 120 / max÷3.**
A2 · both · HELD · overturns `REBUILD_READINESS.md:195` "③ Focus numerics (max/fill/switch-cost)."
web `§1t99s0§.as:249 this.§1t4415s0§ = 8 * 24;` vs android `MCSPlayer.as:239 this.maxreload = 5 * 24;`;
web `§1t99s0§.as:3162 this.§1t4414s0§ -= 48;` (clamped ≥ 0 at `:3163-3165`) vs android `MCSPlayer.as:3098-3104`
(`> max/2 → max/3`, else `-= max/6`). Per-tick fill is **+1** in both (web `:1203-1205`, android `:1158-1160`);
`+= 6` is an **on-kill** bonus in both (web `:3320`, android `:3267` ← `NPCManager.as:1711`, `deathCount > 0`).
Web Focus is therefore 8 s at 24 fps, not 5 s.

**NF-D — the WEB build applies a losing-stance ×0.9 penalty that android does not have.** A2 · web v0.717 ·
HELD · overturns `REBUILD_READINESS.md:74` "**Damage math:** Physical = (ATK + WeaponDMG) × stanceMult; Heavy
defender Defense ×0.8 (one way);".
`§1t99s0§.as:3788-3790` is the ×1.2 counter-triangle; `:3796-3798` is its **else-branch**,
`else if(this.stance == §1t12220s0§ && _loc11_ == §1t12222s0§ || … ) { _loc5_ *= 0.9; }` — the reverse
triangle. Repeated at `:4381`/`:4389`. `grep -n '0\.9' reference/decompiled/shs3_android/scripts/MCSPlayer.as`
returns **zero hits**, so this term is web-only. `SOURCE_CONSTANTS.md:148` already records the ×1.2/×0.9 pair;
the ledger's damage-math line carries neither.

**NF-E — survival mode is present in the WEB build but its content is NOT identical to android's.** A2 · both ·
HELD · corrects S0-1 and replaces `NF-8`.
`reference/extracted/bindata/119_1t4646s0.bin` (11,721 B) parses cleanly: 39 `<wave>`, 87 `<enemy>`, spawn-x
histogram `{-50: 49, 1650: 37, -1650: 1}` — every aggregate matching
`reference/extracted/android/109_WarHexUI_SurvivalModeData.bin` (11,553 B). But 1,379 bytes differ, first at
offset 9,972, where web reads `<id>449|454|449|454|443</id>` and android `<id>449|454</id>`. S0-1's gap closes
on **presence in the target build**, not on identity — and the web wave content is the one to port.

**NF-F — machine proof of §0 C2, independent of the payload scan.** A3 · both · HELD.
`reference/extracted/skilldata.xml` is byte-for-byte `reference/extracted/android/117_Mobile_SkillData.bin`
with the 38-byte XML declaration + its CRLF removed from the head and a 2-byte CRLF removed from the tail:
`web == android[after '?>'].lstrip(b'\r\n')[:-2]` evaluates **True**. Same 42-byte delta for itemdata
(184,002/184,044) and npcdata (228,413/228,455); questdata differs by 1 byte (trailing `\n`). Any diff
between these four files and the android blobs is circular, exactly as C2 says.

---

## Residual STILL_UNHELD noted while judging
- Currency stat **20112** (tournament create/join) still has no name — absent from `itemdata.xml` and from
  the v0.682 string table. `economy/tournament-payout-formula-is-client-side` states this honestly.
- Whether the web build carries the android **stance-triangle damagetext colour** semantics
  (`damagetextcol = 16777215`) is unchecked; web `:3791-3793` sets `_loc12_ = 16777215` under
  `controlledBy != 0`, android `:3704-3707` under the same condition. Not load-bearing here.
