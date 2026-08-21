# t1-overturns-02 — HUNTER LENS review (blind critic, LENS 2)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-02.json` — **24 findings, 24 judged, 0 skipped.**
Every verdict below carries an artifact **I** opened. No critic/source prose was read (§3.2 honoured).

## Headline

**0 of 24 claims are factually refuted.** This packet is unusually clean on the *facts* —
every AS3 line, every animation blob row, and both frame reads reproduced under my own hands.

**But 15 of the 24 claimed ledger overturns DO NOT HOLD.** That is the whole point of this tier:
203 claimed overturns are about to rewrite `REBUILD_READINESS.md`, and in this packet **five
claims name a "ledger sentence" that is not in `REBUILD_READINESS.md` at all** (it is another
agent's survey prose), while **ten more are true but aimed at a neighbouring question**, or at a
sentence the ledger already concedes.

Machine check used for the "not in the ledger" calls:

```
$ grep -c -F "obfuscated"          docs/research/REBUILD_READINESS.md   -> 0
$ grep -c -F "cannot be cross-read" docs/research/REBUILD_READINESS.md  -> 0
$ grep -c -F "17.3"                docs/research/REBUILD_READINESS.md   -> 0
$ grep -c -F "0.005"               docs/research/REBUILD_READINESS.md   -> 0
$ grep -c -F "flat 1.5"            docs/research/REBUILD_READINESS.md   -> 0
$ grep -c -F "exact permutation"   docs/research/REBUILD_READINESS.md   -> 0
```

## The one place the frame and a doc disagreed — and THE FRAME WON

`REBUILD_READINESS.md:216` — *"Forge 700c (the −70 HUD read is a **capture artifact**)"*.

I pulled the video myself. It is not a capture artifact. It is a purchase, and the game
**prints the price on screen**:

| t | own-eyes read (1920×1080 ffmpeg still, top-left wallet + dialog) |
|---|---|
| 21:23 | `FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS / MATERIALS NEEDED: 2 IRON ORE` — wallet **531** |
| 21:25 | BLACKSMITH menu (FORGE / REPAIR / REINFORCE / LEAVE) — wallet **531** |
| **21:26** | **`REPAIR YOUR CURRENTLY EQUIPPED WEAPON? / COST: 70 COINS`** — wallet **531** |
| 21:27 | BLACKSMITH menu — wallet **461** |
| 21:28 | `REINFORCE … COST: 5000 COINS / 1 SILVER ORE` — wallet 461 |

531 − 461 = **−70**, matched to a dialog that literally says 70. `InteractUI.as:1058`
(`cost = StageManager.getCurrentNodeLevel() * 10;`) then reads back a node level of 7, which the
21:23 forge dialog independently prints as `(LEVEL 7)`.

**THE MEASUREMENT DOC AND THE FRAME DISAGREE, SO THE FRAME WINS.** The parenthetical must be struck.

## Per-claim verdicts

| # | id | refuted | overturn holds | note |
|---|---|---|---|---|
| 1 | combat-core/web-as3-is-readable | no | **NO** | ledger sentence not in the ledger |
| 2 | combat-core/web-behead-is-1.3 | no | **NO** | true, but cite off by 2 lines; ledger line 189 is *confirmed*, not falsified |
| 3 | combat-core/web-build-as3-is-readable | no | **NO** | "no live build" is still true; source ≠ live build |
| 4 | combat-core/web-crit-is-1.3-flat | no | **YES** | blocker ② closes at source |
| 5 | combat-core/web-damage-stance-curves | no | **NO** | supplies detail for "×stance"; confirms crit 1.3 + Heavy def ×0.8 |
| 6 | combat-core/web-heavy-damage-1.4 | no | **NO** | ledger sentence not in the ledger |
| 7 | combat-core/web-maxreload-192 | no | **NO** | ledger sentence not in the ledger; source *agrees* with the frame |
| 8 | combat-core/web-maxreload-192-and-48-offset | no | **YES** | blocker ⑤ closes at source |
| 9 | combat-core/web-reach-and-damage-curves-match-repo | no | **YES** | the 300/200/120 "mastery-9" line is false |
| 10 | combat-core/web-stance-damage-and-reach-are-inverse | no | **YES** | blocker ① closes; DUAL/REVERSED mapping independently confirmed |
| 11 | combat-core/web-v0717-ast-is-readable | no | **NO** | readability ≠ the crit read; claim 4 does that work |
| 12 | economy/ap-cap-is-40-not-30 | no | **NO** | ledger already says "base 30, +1/point"; sub-cite `:196` is wrong |
| 13 | economy/calcxp-hard-cutoffs | no | **NO** | the sentence's subject is coins-per-kill, untouched |
| 14 | economy/minus-70-is-repair-not-artifact | no | **YES** | see above — frame wins |
| 15 | economy/quest-coin-reward-formula | no | **NO** | quest faucet ≠ coins-per-kill |
| 16 | economy/quest-prosperity-plus5-is-client-side | no | **NO** | daily-sim + sell-price both survive (the claim says so itself) |
| 17 | economy/rebirth-pays-heavenly-gold | no | **NO** | ledger already says "gold"; the purse bug is in `src/config`, not the ledger |
| 18 | economy/tournament-is-web-only | no | **NO** | blocker ④ asks for NUMBERS; existence is not numbers |
| 19 | enemies-ai/NEW-npc-die-override-count-is-18-not-3 | no | **NO** | says nothing about severed limbs; also mis-classed A3 (it is a grep = A2) |
| 20 | enemies-ai/boss-rubber-band-hits-to-kill | no | **YES** | "level→stat formula absent" is false, and now cross-read on v0.717 |
| 21 | enemies-ai/eight-death-animations-by-killing-blow | no | **NO** | deaths are not telegraph/stagger — mis-aimed at ③ instead of ⑤ |
| 22 | enemies-ai/elite-boss-second-level-formula-rubber-band | no | **YES** | same as #20 |
| 23 | enemies-ai/flinch-is-8-frames | no | **YES** (stagger clause only) | telegraph/active/recovery untouched |
| 24 | enemies-ai/flinch-is-a-real-8-frame-state | no | **NO** | claims blocker ③ dead in BOTH halves; the telegraph half is untouched |

## Evidence I reproduced (own cites)

### Web v0.717 AS3 is readable — confirmed, but already known since 2026-07-25
- `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36` → `public static var §1t9323s0§:Number = 0.717;`
- `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:9-19` → `standingRange:int = 50`, `jumpThreshhold:int = 100`, `lightSlashSpeed 50 / balancedSlashSpeed 40 / heavySlashSpeed 30`
- `reference/decompiled/payload_export.log:4` → `Exported script 1/1079 mx.core.mx_internal`
- `find reference/decompiled/shs3_payload -name '*.as' | wc -l` → 1079 · `ls .../scripts/ | grep -c '§'` → 612
- `ls 'reference/decompiled/shs3_payload/scripts/§1t51s0§/' | wc -l` → 1

### The combat block (all read by me, `§1t99s0§.as`)
```
:249   this.§1t4415s0§ = 8 * 24;                                   // maxreload = 192
:1203  if(this.§1t4414s0§ < this.§1t4415s0§) { ++this.§1t4414s0§;   // inside `override public function update()`
:3050  return this.§1t4469s0§() && this.§1t4414s0§ >= 48;          // stance-change gate
:3162  this.§1t4414s0§ -= 48;                                      // stance-change cost
:3094  this.§1t4417s0§ = this.§1t4420s0§ * 1.4;                    // LIGHT reach
:3105  ... * (1 + 0.2 * m * 0.1)                                   // BALANCED reach
:3116  ... * (0.5 + 0.4 * m * 0.1)   + floor 100                   // HEAVY reach
:3131  ... * 1.4     (case §1t12224s0§)                            // REVERSED reach
:3142  ... * 1       + floor 100 (case §1t12223s0§)                // DUAL reach
:3258  var _loc1_:int = this.minDamage + Math.random() * this.damageRange;
:3262/:3265/:3270  light (0.5+0.04m) · balanced (1+0.02m) · heavy/dual/reversed 1.4
:3272-:3274  if(reload == maxreload) return _loc2_ * 1.3 + this.§1t1243s0§;   // crit, FLAT 1.3 + additive
:3288  return defense * 0.8;                                       // Heavy defender
:3295-:3310  crit zeroes reload to 0; per-slash cost slashUsage /2 · ×1 · ×1.5
```
`§1t113s0§.as:328` → `var _loc3_:Number = (param1 - 48) / (param2 - 48);` and `:352`
`§1t88s0§.instance.§1t1516s0§("Snd_criticalDamage");` when the bar reads full.

**SWF header parsed by me** from `reference/decrypted/shs3_payload_decoded.swf`: `CWS`, version 17,
stage **800.0 × 690.0**, **frameRate 24.0**, 6,880,328 bytes. → (192−48)/24 = **6.000 s** visible bar,
192/24 = 8.000 s for the whole counter.

### The android/web divergence is real and large (both files read by me)
| constant | WEB v0.717 (`§1t99s0§.as`) | ANDROID v0.682 (`MCSPlayer.as`) |
|---|---|---|
| crit | flat ×**1.3** (:3274) | ×1.2 non-light / ×**1.5** light (:3219/:3221) |
| heavy/dual/rev damage | ×**1.4** (:3270) | ×**1.5** (:3213) |
| light reach | ×**1.4** (:3094) | ×**1.5** (:3030) |
| mastery coefficient | **0.02 / 0.04** | **0.005 / 0.005** |
| maxreload | **8×24 = 192**, hide 48 (:249) | **5×24 = 120**, hide 24 (:239/:3272) |
| behead | ×**1.3** (`§1t68s0§.as:472-475`) | ×**1.5** (`NPC.as:451-453`) |
| rebirth payout | HGOLD +**25**, +**100** at DAN 8 (`§1t1523s0§.as:2644-2652`) | HGOLD +**5**, +**20** at DAN 8 (`StatsManager.as:2201-2208`) |
| base slash length | identical: `120 + floor((90 + DAN*5)*SPD/(20+SPD))` (`§1t1523s0§.as:2346-2347` ≡ `StatsManager.as:1917-1918`) | |

Stat-id table is **1:1 identical** between builds (`§1t1523s0§.as:226-256` = 11…25 ≡
`StatsManager.as:192-220` STAT_GOLD 11 / STAT_HGOLD 12 / STAT_DAN 25), which is how I confirmed
`§1t9413s0§` = HGOLD and `§1t9426s0§` = DAN.

### Animation blobs — **the §0 UTF-16LE warning is WRONG for these two files**
`reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin` and `94_…Human2….bin` are
**UTF-8 with a BOM** (`b'\xef\xbb\xbf<?xml version="1.0"?>'`). Decoding them as UTF-16LE returns
mojibake and 0 `<anim>` hits. Decoded as `utf-8-sig` I get 158 anims in 99_ and 25 in 94_, and
every row the packet quotes:

```
death 38 · deathbyarrow 21 · deathdowned 7 · deathenemy 23 · deathinhalf 28
deathnohand 25 · deathnohead 31 · deathwitharrow 23
gotlaunchedupwards_parta 4 / _partb 9 / _partc 7 · gotlauncheddowned 18
gotlauncheddownedend 1 · downed 23 · downedup 4 · downedup2 25
94_: flinch_weapon 8 · flinch 8
```

### Frames (my own crops)
- `reference/frames/Nr4fQstqHDM/seg-28/frames/frame_0007.jpg` (image is **1024×576**, not 1080p),
  crop (470,110)-(780,290) upscaled ×4 LANCZOS → visibly `HP 20 / 30`, `CHI 47 / 47`, `AP 30 / 40`,
  ATK/DEF/SPD diamonds right. Claim 12's read is exact.
- `reference/frames/zFtCaTO0_1M/seg-29/frames/frame_0013.jpg`, crop (480,335)-(770,465) ×5 LANCZOS →
  `REWARD / 250 XP / 30 COINS / TOWN PROSPERITY: +5`. Exact.

---

## NEW FINDINGS (nobody in this packet claimed these)

### N1 — **Tournament economy numbers ARE in the client. Ledger economy blocker ④ falls.**
Claim 18 says a follow-up should read `§1t7144s0§.as` "for entry fees, payouts and bracket rules".
I did. `§1t7144s0§.as` only *reads fields off a server object* (`_loc1_.entryfee`, `.firstprize`,
`.secondprize`, `.thirdprize`, `.maxplayers`, `.minlvl`, `.maxlvl`, `.organizer`) — no literals.
The literals are in its sibling, the **create panel** `§1t7091s0§.as`:

```
§1t7091s0§.as:406-412
   internal function §1t7141s0§() : * {
      var _loc1_:int = Math.floor((this.§1t7121s0§ * this.§1t7120s0§ + 5) * 0.75 / 7);
      var _loc2_:int = _loc1_ * 4;
      var _loc3_:int = _loc1_ * 2;
      var _loc4_:int = _loc1_;
      this.prizefield.text = _loc2_ + " / " + _loc3_ + " / " + _loc4_;
   }
```
so **unit = floor((entryFee × players + 5) × 0.75 / 7)**, payouts **4u / 2u / 1u**.
Ladders and clamps, same file: player count **2 / 4 / 8 / 16** (2 gated on a premium flag, :149-180);
entry fee **0…100** (:185-200); level range clamped **5…80** (:205-300); round duration
**0.5 / 1 / 2 / 24 / 48 h** (:303-360). Costs, `§1t7144s0§.as:572` + `:585` — creating charges
**5** of currency-stat **20112** (waived on the premium flag); `:600` + `:610` — joining charges
`entryfee` of the same stat 20112. (20112 is not in `itemdata.xml`; it is a stat id, unresolved.)

### N2 — **`REBUILD_READINESS.md:165` "no 10th-rebirth tier" is FALSE in the shipped build.**
```
§1t1523s0§.as:2644  if(§1t7356s0§(§1t9426s0§) == 8)      // STAT_DAN == 8
:2646                  §1t9713s0§(§1t9413s0§,100);        // +100 HGOLD
:2651               else §1t9713s0§(§1t9413s0§,25);       // +25 HGOLD
:2653-2655          if(STAT_DAN < 9) STAT_DAN += 1;
```
There **is** a tier, at DAN 8→9 — which the in-game announcement prints as rank `DAN+1` = **10**
(`:2659`, mirroring `StatsManager.as:2214`). So `MAX_DAN_RANK=10` (display) and `tenthGold=100` are
**CONTRACT on v0.717**, not INFERRED, and the wiki's "kyudan/9th" was not garbled — it is the raw
DAN ceiling of 9. The film's "flat +25" is true only because the player never reached DAN 8.

### N3 — **`calcXP` has a WEB v0.717 twin. Claim 13's build-parity hole is closed.**
Claim 13 cites only android. The identical three functions are in the web bundle:
`§1t68s0§.as:113-129` (grey level: `<6→0`; `<40→ lvl-floor(lvl/10)-5`; `<60→ lvl-floor(lvl/5)-1`;
else `lvl-9`), `:131-183` (zero-difference ladder), `:185-209` (`if(param2 <= greyLevel) return 0;`
`if(param2 - param1 > 3) return 0;` `×(1+0.05·Δ)` / `×(1−Δ/zeroDiff)` / `×2` if elite).
Byte-for-byte the same model in the shipped build. (Also: the ladder in `NPC.as:112-164` has **12**
branches, not the "eleven bands" claim 13 states — cosmetic.)

### N4 — **Claim 21's evidence overturns art-anim blocker ⑤, not ③.**
`REBUILD_READINESS.md:240` blocker ⑤ is *"severed-limb death variant"*. `deathnohand` (25f),
`deathnohead` (31f) and `deathinhalf` (28f) in `99_MCSCharacter_HumanAnimationData.bin` close it
outright. Claim 21 aimed at ③ and misses; ⑤ is left standing by the packet purely by mis-aiming.

### N5 — **`REBUILD_READINESS.md:99-101` "never wired into `resolveSlash`" is stale.**
Reach is wired now: `src/core/slash.ts::resolveSlash`, `src/core/DrawnStroke.ts` ("Spend the REACH
BUDGET along the drawn arc"), `src/core/fighterAnimator.ts::reachFor`. And `src/config/reach.ts`
already carries the exact web-build curve family (`lightMult 1.4`, `balancedPerMastery 0.02`,
`heavyBase 0.5`, `heavyPerMastery 0.04`, `heavyFloor 100`, base `120 / 90 / 5 / 20`). Claim 9's
"exactly the values already in src/config" is literally true — which also means claim 9 is a
*confirmation* of the repo, not a new number.

### N6 — **`SOURCE_CONSTANTS.md` mined the 0.682 file while claiming 0.717.**
`docs/research/fidelity/SOURCE_CONSTANTS.md` §0: *"Build identified as v0.717 — the same build our
video measurements came from. 189 constants extracted."* But `grep -c "§1t" SOURCE_CONSTANTS.md` →
**0**: it never cites a single web-bundle class. `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:30`
→ `clientVersion:Number = 0.682`, and `diff -q shs3_android/scripts/StatsManager.as shs3_android_payload/scripts/StatsManager.as`
is silent (identical files). So the 189 "v0.717" constants were read off the **v0.682** decompile.
Given the divergence table above (crit, reach, damage, maxreload, behead, rebirth), that mislabelling
is material and should be audited constant-by-constant. This is the real, unclaimed force behind
claims 1/3/11 — and it is a `SOURCE_CONSTANTS.md` problem, not a `REBUILD_READINESS.md` one.

### N7 — **`REBUILD_READINESS.md:117` + `:171` "native canvas / native resolution is 800×480 (5:3)" is contradicted by the payload's own header.**
My parse of `reference/decrypted/shs3_payload_decoded.swf` gives stage **800 × 690**. The ledger's
aspect-ratio blocker (ui-hud ①) is therefore reasoning from the wrong stage height. STILL_UNHELD as
to which stage the *game view* uses — the payload's 690 may include chrome — but the flat "800×480"
assertion is not supported by the only header we hold.

### N8 — **Ledger economy blocker ③ "Repair-Weapon cost (never captured)" is dead.**
`Nr4fQstqHDM.mp4` t=21:26 prints `REPAIR YOUR CURRENTLY EQUIPPED WEAPON? / COST: 70 COINS`, and the
21:23 forge dialog prints the node level `(LEVEL 7)`. With `InteractUI.as:1058`
(`cost = getCurrentNodeLevel() * 10`) that is repair = **nodeLevel × 10**, frame-confirmed. It was
captured; nobody looked.

---

## Two cite defects worth logging (neither changes a verdict)
1. **Claim 2** cites `§1t68s0§.as:470-472`. The behead block is at **:472-475** (`:470` is
   `_loc3_ = param2.§1t1088s0§();`). citeLint's `QUOTE_NOT_LOCATED` was right.
2. **Claim 12**'s lane_impact says *"APINTERVAL, web `§1t1523s0§.as:196` = 60"*. Line **:196** is
   `internal static const §1t9398s0§:int = 60 * 60;` (**3600**). The `= 60` const is at **:192**.
