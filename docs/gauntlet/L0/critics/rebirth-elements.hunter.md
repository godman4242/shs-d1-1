# rebirth-elements — HUNTER CRITIC (blind)

Reviewer opened every artifact itself. No verdict below rests on the surveyor's text.
Standing invariant honoured: no frame/doc conflict arose in this lane, because the
material that closes it is payload art and payload code, not video.

---

## Headline

**Two "STILL_UNHELD" verdicts are wrong, and one of them is the single biggest
under-claim in the unit.** The rebirth element circle is not missing. It is on disk,
rendered, in the **web v0.717** payload, class-linked to InteractUI, and I looked at it.
So is the **entire Dragon Dance bagua UI**. The surveyor wrote its own close-path
("locate the exported symbol for InteractUI's elementCircle MovieClip in the asset SWF")
and then did not run the one-line grep that answers it.

**One HELD claim is wrong in the direction that matters.** The stance slash-length
parity claim rests on a negative grep that is false: v0.717 *does* carry the stance
switch, with *different constants*, and the mastery cap is **10**, not 100 — which means
the ledger's "0.9/1.2/1.4 are mastery-ceiling values" line the surveyor proposed to
re-check is **exactly right**, and the surveyor's correction would have broken it.

---

## Verdict table

| claim | refuted | severity |
|---|---|---|
| rebirth/string-table-resolved | no | minor (mis-tagged ledger sentence) |
| rebirth/dan-ladder-titles | no | minor (初段 never displayed) |
| rebirth/dan-achievements-prove-ten | no | — |
| rebirth/element-picker-uidata | no | minor (no v0.717 counterpart; caveat missing) |
| rebirth/elemental-skill-tooltips | no | — |
| rebirth/dragon-dance-teachable | no | — |
| rebirth/tenth-gold-is-100 | no | minor (currency is HGOLD, not GOLD) |
| combat-core/dan-scaled-slash-length | no | — |
| progression/post-rebirth-sp-economy | no | — |
| rebirth/unlock-gate-is-stat-threshold | no | — |
| rebirth/elemental-damage-ladder | no | — |
| rebirth/aoe-radii-per-element | no | — |
| rebirth/dragon-dance-bagua-input | no | minor ("tier-3" mislabel) |
| rebirth/kanji-statue-bonus | **YES** | **material** |
| rebirth/element-counter-wheel | no | — (now corroborated by ART) |
| rebirth/mitigation-flat-min1 | no | — |
| rebirth/stance-slash-multipliers-parity | **YES** | **fatal** |
| rebirth/element-circle-art | **YES** | **fatal** |
| rebirth/element-status-effects | **YES** | minor |

---

## R1 — `rebirth/element-circle-art` STILL_UNHELD is REFUTED (fatal)

```
$ grep -n "elementCircle" reference/extracted/payload.xml
111134:            <item>elementCircle</item>
626581:        <item type="PlaceObject2Tag" characterId="1650" depth="37" ... name="elementCircle" .../>
```

Enclosing sprite is **spriteId 1691**. Class linkage, from the *web v0.717* decompile:

```
reference/decompiled/shs3_payload/scripts/§1t401s0§.as:9
   [Embed(source="/_assets/assets.swf", symbol="symbol1691")]
   public class §1t401s0§ extends MovieClip      // = InteractUI
```

`§1t401s0§.as:873-881` carries the `firerebirth` grant, so 1691 *is* InteractUI, and
`characterId 1650` at depth 37 inside it *is* the rebirth element circle.

**Rendered art is already exported:**
`reference/extracted/sprites/DefineSprite_1650/1.png` (808×480).
Crop `(510,50)-(808,370)` upscaled 3× (894×960, Lanczos) — I opened it. Visibly:

- Four circular nodes on a ring: **FIRE top (火), EARTH right (土), WIND bottom (風),
  WATER left (水)** — English label under each, kanji inside each.
- Four thick grey arcs with arrowheads running **clockwise**, each captioned
  **"STRONG AGAINST"** on two lines.
- Ring stroke and kanji share one colour per element; node fill is uniform dark grey.
- Display face is the hand-drawn brush font (consistent with Stage-0 finding S0-2, `Edo SZ`).

Sampled pixels (`PIL`, from the same PNG):

| element | ring + kanji | node fill |
|---|---|---|
| FIRE | `#FF3300` | `#333333` |
| EARTH | `#7D5500` | `#333333` |
| WIND | `#BBBBBB` | `#333333` |
| WATER | `#0099FF` | `#333333` |

`#7D5500` is the *same* hex the shogo title is drawn in
(`InventoryUI.as:2286  nametext += " <font color='#7D5500'>"`). Earth gold and Dan-title
gold are one colour.

The claim's stated evidence — "no frame in any of the 113 frame directories shows the
rebirth flow" — is true and irrelevant. This never needed a frame.

**Bonus, same grep family:** sprite 1691's own layout is in the payload in twips
(`payload.xml:626575-626600`), so the panel geometry is held too —
`elementCircle` at (0,0); `titleText` at (206,1400) twips = **(10.3, 70) px**;
`button1..button5` all at x=200 twips = **10 px**, y = 2180/2960/3740/4520/5300 twips =
**109 / 148 / 187 / 226 / 265 px** → uniform **39 px** row pitch.

## R2 — the Dragon Dance UI art is ALSO on disk (new, nobody claimed it)

```
reference/decompiled/shs3_payload/scripts/§1t5495s0§.as:7
   [Embed(source="/_assets/assets.swf", symbol="symbol1810")]
§1t5495s0§.as:70-71
   this.§1t5516s0§ = ["sky","wind","water","mountain","earth","thunder","fire","lake"];
   this.§1t5517s0§ = ["fire","earth","lake","sky","water","mountain","thunder","wind"];
```

→ `§1t5495s0§` is the v0.717 DragonDanceUI, and its symbol renders to
**`reference/extracted/sprites/DefineSprite_1810_1t5495s0/1.png`** (813×480). Opened it.
Visibly: three concentric **dark-red** rings; **8 white click nodes with bright-green
outlines** at the 8 compass points, each carrying a green kanji (frame-1 default 天 =
"sky", matching `earlierHeavenLabel[0]`); **8 dark-red bagua trigram glyphs** on an inner
ring; a **taijitu (yin-yang) centre** with the element name ("FIRE") in the brush font;
a red **✕** close button top-right.

A second, related sprite — `reference/extracted/sprites/DefineSprite_3555_1t6980s0/1.png`
(class `§1t6980s0§`, members `node0..node7`, `clearButton`, `doSkillButton`,
`greenCircle`, `redCircle`) — is the dance-performance/teach variant. Also rendered.

So ledger blocker ④ has no art half left either.

## R3 — `rebirth/stance-slash-multipliers-parity` is REFUTED (fatal)

Claim: *"only in the android v0.682 bundle — I grepped the whole v0.717 desktop tree for
the identical expressions and got zero hits, so parity is NOT established."*

The v0.717 stance switch is at `reference/decompiled/shs3_payload/scripts/§1t99s0§.as`
(= desktop MCSPlayer; it defines `§1t4443s0§`/`§1t4446s0§`, the same two methods
`§1t1523s0§.as:2264-2270` calls):

```
3094  LIGHT     this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3105  BALANCED  this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3116  HEAVY     this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);
3117            if(this.§1t4417s0§ < 100) { ... = 100; }
3130  REVERSED  this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3141  DUAL      this.§1t4417s0§ = this.§1t4420s0§;   floor 100
```

Searching for *identical literal expressions* was the methodological error: **every
constant moved**. Side by side:

| stance | android v0.682 | **web v0.717** |
|---|---|---|
| Light | ×1.5 | **×1.4** |
| Balanced | ×(1 + 0.5·m·0.01) | **×(1 + 0.2·m·0.1)** |
| Heavy | ×(0.5 + 0.5·m·0.01), floor 100 | **×(0.5 + 0.4·m·0.1)**, floor 100 |
| Reversed | ×1.5 | **×1.4** |
| Dual | ×1.0, floor 100 | ×1.0, floor 100 |

And the mastery scale is **not** 0-100. `mastery` is `getStat(1000/1001/1002)`
(`StatsManager.as:1834`), and those three skills have exactly **10** `<level>` rows each
in the *web* `reference/extracted/skilldata.xml` (skill 1000 = "Light Stance Mastery",
levels 1..10; same for 1001/1002).

At the mastery ceiling m=10, v0.717 gives **Light 1.4 / Balanced 1.2 / Heavy 0.9** —
which is the ledger's `0.9/1.2/1.4` triple, exactly. So the ledger line the claim wanted
re-checked is correct, and it is about **reach**, not damage. The claim's lane_impact
("mastery is a 0-100 percentage here, not 0-9, so the ledger's 'mastery-9 ceiling'
framing needs re-checking") would have corrupted combat-core.

Also: the claim lists only three stances. There are **five**.

## R4 — `rebirth/kanji-statue-bonus` is REFUTED (material)

The android form is real, but it is **one of three** regimes, and it is not the v0.717
form. Desktop statue class (`getAPUse()→2` at :324, `abs(x-param1.x) < 100` at :344 —
those two *do* match android), `reference/decompiled/shs3_payload/scripts/§1t8702s0§.as`:

```
150  internal function generateSequence() : String
154     var _loc1_ = RNG.create(StageManager.getCurrentNode() * <fn>() + 21);
155     var _loc2_ = <perNodeLookup>(StageManager.getCurrentNode());
157     var _loc4_ = [0,1,2,3,4,5,6,7];
158     if(_loc2_ < 20)   → 3 random DISTINCT nodes drawn without replacement  (3 clicks)
170     else if(_loc2_ < 60) → permutation of "1246" + _loc1_.rand(8)          (5 clicks)
194     else              → permutation of "1246" + 2 more distinct draws      (6 clicks)
```

vs android `Obj_DragonDanceStatue.as:41-62`, single regime, `new RNG(getCurrentNode())`,
`sequence = "1246"+this.num`.

Three concrete divergences the claim asserts away:
1. **Seed** is `node * X + 21`, not the bare node id.
2. **Length** is 3, 5 or 6 clicks depending on a per-node value, not always 5.
3. The **trailing node is RNG-drawn**, not the statue's own `num`.

The permutation table itself (`"1246"/"4216"/"1642"/"1426"/"6241"`, `rand(5)`) *is*
identical across builds — that part survives. The target build is v0.717 (the longplays
are of the web game), so the claim's stated spec is wrong for the build being recreated.

## R5 — `rebirth/element-status-effects` STILL_UNHELD is REFUTED (minor)

The surveyor named the close-path ("read Damage.as buff fields plus the BUFF_* constants
in StatsManager.as") and didn't run it. It is three commands, and the answer is a clean
negative:

- `Damage.as` (read end to end, 0 lines skipped): the class holds **only**
  `damage, stance, launchType, attackerlvl, piercingDamage, fireDamage, waterDamage,
  windDamage, earthDamage, flyVelX, flyVelY, victimPosX`. There is **no** status,
  duration, tick, or DoT field of any kind, and no setter for one. `launchType`'s ten
  values (`LAUNCH_NONE/AIR/KNOCKDOWN/FLY/FLYAWAY/KNEEGROIN/STUN/DEATHTOUCH/
  SUBSTITUTIONLOG/BACKTHROW`) are all knockback/throw poses.
- `StatsManager.as:288-312` — `BUFF_0..12` are `XP, ATTACK, DEFENSE, SPEED, AP,
  DUELTOKENS, COINS, RARELOOT, MUTE, FULLMUTE, HELL, INJURED, MODERATOR`: an
  account/meta buff system (chat mutes, injury timer, XP boosts), not combat statuses.
  No burn / slow / root / poison exists in the enum.
- `MCSPlayer.as:3347-3420` — the elemental path is subtract-DEF → min-1 floor → sum into
  one `setHP()`. Nothing is written to the victim.
- `NPCManager.checkHitObject:1422-1470` — pure distance loop, delegates to
  `enemy.checkHitObject`. No effect application.

**Verdict: HELD, negatively. Elemental skills apply no status beyond `launchType`.**
Build the recreation that way and label it CONTRACT.

---

## Corrections to claims that otherwise survive

- **`rebirth/dan-ladder-titles`** — `InventoryUI.as:2276-2316` maps `case 0 → danfield.text = ""`.
  String **455 (初段) is never displayed.** The live mapping is STAT_DAN *n* → string
  **455+n for n ≥ 1** (456 弐段 … 464 十段), and STAT_DAN 0 shows a **blank** dan field.
  A recreation that prints 初段 at Dan 1 renders something the OG never renders.
- **`rebirth/tenth-gold-is-100`** — the stat is `STAT_HGOLD = 12`, which is **not**
  `STAT_GOLD = 11` (`StatsManager.as:192,194`; guest start is `STAT_GOLD=100`,
  `STAT_HGOLD=0` at :705-706). HGOLD is the premium currency the UI calls "Gold"
  (string 100: *"…get 10 more AP for 1 Gold?"*). `tenthGold`/`+25` must bind to the
  premium currency, not coins. Everything else in the claim verifies verbatim, including
  `§1t1523s0§.as:36  §1t9323s0§:Number = 0.717` — the desktop bundle really is v0.717.
- **`rebirth/dragon-dance-bagua-input`** — 1056-1059 are **req-30** (the 3× tier), not
  "tier-3"; the 6× tier is 1060-1063, and per `DragonDanceUI.as:322-336` those teach
  nodes **0/4/7/1** in *Later*-Heaven mode. The mechanism the claim describes is correct;
  only the tier label is wrong. **Newly established: full v0.717 parity** —
  `§1t5495s0§.as:70-71` (identical label arrays, same line numbers) and `:382`
  (identical `{1,2,4,6}` Later-Heaven trigger).
- **`rebirth/element-picker-uidata`** — verified verbatim at
  `90_InteractUI_UIData.bin:94-105`. Caveat the claim omits: **there is no v0.717
  counterpart on disk.** `grep -rl firerebirth reference/extracted/` returns only the
  android blob, and `grep -c rebirth reference/extracted/payload.xml` returns **0**.
  On-screen order (Fire/Earth/Wind/Water) and icon ids are v0.682-only. The *grant* does
  have parity (`§1t401s0§.as:873-881`, +20 at Dan 8 else +10).
- **`rebirth/string-table-resolved`** — substance holds (string 610 dumped verbatim from
  `strings.json`). But `overturns_ledger: true` with `ledger_text` = blocker ⑤ is
  bookkeeping inflation: the ledger never claimed the string table was missing; the claim
  retracts the *PASS-1 journal*, by its own wording.

## Confirmations I ran that strengthen surviving claims

- `rebirth/element-counter-wheel` — `MCSPlayer.as:260` signature is
  `initElementDefenseStats(FIREDEF, WINDDEF, WATERDEF, EARTHDEF)`; the call at
  `StatsManager.as:1836` therefore pairs fireDef←**water**ATK, windDef←**earth**ATK,
  waterDef←**wind**ATK, earthDef←**fire**ATK. That is precisely the wheel drawn in
  `DefineSprite_1650/1.png` (Water→Fire, Earth→Wind, Wind→Water, Fire→Earth). Code and
  shipped art agree independently. Desktop confirm `§1t1523s0§.as:2270` identical.
- `rebirth/elemental-skill-tooltips` — "24 elemental skills" is **exactly** right:
  categories 7/8/9/10 in `reference/extracted/skilldata.xml` contain 24 skills
  (1013, 1025-1035, 1056-1063, 1070-1073). Skill 1070 verified: `lvlreq 50`, `chi 50`,
  `cooldown 60`, `req id 28 qty 30`, `desc 6143`. The kunai-ammo aside is real:
  `SkillSlotButton.as:161` reads `StatsManager.getStat(2501)` for kunai skills and
  `:172` `Math.floor(getStat(2501)/4)` for traps — **traps cost 4 kunai each.**
- `combat-core/dan-scaled-slash-length` — verified in both builds
  (`StatsManager.as:1915-1919` ≡ `§1t1523s0§.as:2344-2348`, byte-for-byte in structure
  and constants). "Stage pixels" is grounded, not assumed: `slashLength` feeds
  `InputManager.setMaxDistance` (`MCSPlayer.as:3094`) and is added to
  `getTargetPosition()` to form `startX/startY` (`:4663-4707`) — display coordinates.
  `BankUI.as:264` verbatim.
- `progression/post-rebirth-sp-economy` — `StatsManager.as:2156` ≡ `§1t1523s0§.as:2598`.
  The "79 not 80" correction is independently right: SP starts at 0 (`:711`) and gains
  `+1` per level (`:1652`), so L80/Dan 0 = 79.
- `rebirth/dan-achievements-prove-ten` — `114_Mobile_AchievementData.bin` has **four**
  `stat 25` rows: ids 48/49/50/51 at `val` 1/2/5/9 (lines 436-470). Android-only blob,
  but the ceiling is independently proven in v0.717 by
  `§1t1523s0§.as:2653-2655  if(STAT_DAN < 9) changeStat(STAT_DAN,1);`.
- `rebirth/aoe-radii-per-element` / `rebirth/elemental-damage-ladder` /
  `rebirth/mitigation-flat-min1` — all quoted lines reproduce verbatim.

## What is actually still unheld in this lane, after the hunt

1. **Audio for the rebirth/dance UI** — encrypted (Stage-0 S0-5), unchanged.
2. **v0.717 parity for the element-picker menu order** — no web-side UIData exists.
3. **The per-node gating value** in `§1t8702s0§.generateSequence` (`_loc2_ < 20 / < 60`)
   is an obfuscated lookup I did not resolve; the three regimes are certain, the
   thresholds' *meaning* is not.

That is the whole remaining list. `⑤ rebirth/element-picker UI` is fully closed —
data, flow, copy, geometry **and art**.
