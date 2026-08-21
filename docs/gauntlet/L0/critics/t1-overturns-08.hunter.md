# t1-overturns-08 — HUNTER LENS review

Packet: `docs/gauntlet/L0/worklist/t1-overturns-08.json` — **24 findings, 24 judged, 0 skipped.**
Every verdict below rests on an artifact I opened myself in this session. No finding was
graded from another agent's prose; `docs/gauntlet/L0/critics/*.md` and `sources/*.md` were
never opened.

## What I did

- Rendered `reference/extracted/sprites/DefineSprite_1650/1.png` (808x480 RGBA) composited
  on white, whole at x2 and cropped `(520,60)-(808,380)` at x4 LANCZOS, and sampled ring
  hexes with PIL.
- Rendered `DefineSprite_1691_1t401s0/1.png` (856x853) whole and cropped
  `(500,260)-(850,420)` at x3.
- Rendered `DefineSprite_1810_1t5495s0/1.png` — **819x500, not the 813x480 the finding
  claims** — whole at x2.
- Read the cited AS3 by line in `reference/decompiled/shs3_payload/scripts/` (web v0.717),
  `shs3_android/scripts/` and `shs3_android_payload/scripts/` (v0.682).
- Parsed `reference/extracted/skilldata.xml` with ElementTree and joined every
  `<req><has><id>28|29|30|31</id>` row to `docs/gauntlet/L0/index/strings.json`.
- Read `docs/research/REBUILD_READINESS.md` lines 20-38 (staleness banner), 157-167 (§3),
  188-249 (§4) for the overturn check.

## Verdict table

| # | id | refuted | overturn upheld | severity |
|---|---|---|---|---|
| 1 | rebirth/dragon-dance-ui-art-recovered | no | **no** | minor |
| 2 | rebirth/element-atk-budget-is-100 | no | **no** | minor |
| 3 | rebirth/element-circle-art-FOUND | no | yes | — |
| 4 | rebirth/element-circle-art-is-held | no | yes | — |
| 5 | rebirth/element-circle-art-is-on-disk | **yes** | no | minor |
| 6 | rebirth/element-circle-art-recovered | no | yes | — |
| 7 | rebirth/elemental-gate-roster | no | **no** | minor |
| 8 | rebirth/elemental-gate-table | no | **no** | minor |
| 9 | rebirth/hgold-is-premium-currency | no | **no** | minor |
| 10 | rebirth/ledger-film-phantom-source | no | yes | — |
| 11 | rebirth/no-elemental-status-effects | no | yes | — |
| 12 | rebirth/no-elemental-status-effects-exist | no | yes | minor |
| 13 | rebirth/romaji-dan-ladder | **yes** | yes | minor |
| 14 | rebirth/romaji-dan-ladder-in-v0717 | no | yes | — |
| 15 | skilldata/web-cooldown-modifier-caps-spd-at-600 | no | yes | — |
| 16 | skills-meters/43-sfx-event-names-in-web-bundle | no | **no** | minor |
| 17 | skills-meters/canchangestance-is-a-named-gate | no | yes | — |
| 18 | skills-meters/crit-is-deterministic-at-full-reload-bar | no | yes | — |
| 19 | skills-meters/dan-caps-at-9-and-the-100-gold-tier-is-real | no | yes | — |
| 20 | skills-meters/elemental-kunai-ammo-costs | **yes** | no | material |
| 21 | skills-meters/focus-fill-rate-plus-one-per-frame | no | yes | minor |
| 22 | skills-meters/focus-reload-meter-web-numbers | **yes** | yes | minor |
| 23 | skills-meters/focus-skill-web-effect | no | **no** | minor |
| 24 | skills-meters/kunai-ammo-cost | **yes** | no | material |

4 refuted · 8 inflated overturns knocked down · 12 clean.

## The four refutations

### 20 + 24 — the kunai-ammo pair is wrong in the same place

`SkillSlotButton.as:118` `usesKunaiAmmo()` puts `SKILL_TRAP, SKILL_TRAPFIRE,
SKILL_TRAPWATER, SKILL_TRAPWIND, SKILL_TRAPEARTH` in the **x1** branch alongside the five
kunai throws. `SkillManager.as:467-479` (android) deducts exactly **1** for all five traps:

```
case SKILL_TRAP: case SKILL_TRAPFIRE: case SKILL_TRAPWATER:
case SKILL_TRAPWIND: case SKILL_TRAPEARTH:
   if(owner.isPlayer()) { if(StatsManager.getStat(2501) == 0) { return false; }
                          StatsManager.changeStat(2501,-1); }
```

Web agrees: `§1t120s0§.as:503-514`, cases `§1t10134s0§`-`§1t10138s0§` (= skills 1024,
1025-1028), `changeStat(2501,-1)`.

The `/4` at `SkillSlotButton.as:172` is `SkillManager.SKILL_WINDMILL` only — **skill 1051
"Windmill Shuriken"**, whose own skilldata description reads *"Uses 4 kunai."* It is a
ninja-tree skill gated on `<has><id>1010</id>` (Smoke Bomb), not an elemental skill.

So **"traps cost four kunai each" (24) is false**, and **"the kunai family spends 1, 4 and
8 across its three tiers" (20) is false**: there is no three-tier kunai ladder. The three
deduction sites in the web bundle are
- `-1` → `§1t10139s0§`-`§1t10142s0§` = skills **1029-1032**, the four elemental Kunai (and
  separately the five traps at `-1`),
- `-4` → `§1t10158s0§` = skill **1051 Windmill Shuriken**,
- `-8` → `§1t10176s0§` = skill **1077**, which has **no row in skilldata.xml at all**.

Only the first is elemental, so "three of the elemental blanks are closed" is also wrong.

### 5 — a label invented from an occluded render

The finding reads a "**STRONG AGAINST / WEAK AGAINST** label ring" off
`DefineSprite_1691_1t401s0/1.png`, where the character bust covers most of the disc. The
clean asset — `DefineSprite_1650/1.png`, the same `elementCircle` symbol un-occluded —
shows **four labels, all reading "STRONG AGAINST"**. `grep -rn "WEAK AGAINST"
reference/extracted/` returns nothing, and no string-table entry contains it.
**The clean artifact wins over the occluded one**, exactly as the frame-wins rule wins over
a measurement doc. Secondary defect: `artifact_class` is `A1`, but the cite is a sprite
export, not a video frame under `reference/frames/`.

The finding's *core* — "the element circle is recoverable art, already extracted" — is true
and is carried correctly by findings 3, 4 and 6, so nothing of value is lost by striking it.

### 13 — "absent from the android build" is false

```
reference/decompiled/shs3_android/scripts/PlayerPanel.as:388  dantext = "(nidan)";
reference/decompiled/shs3_android/scripts/PlayerPanel.as:409  dantext = "(kyudan) " + LangManager.getString(467);
reference/decompiled/shs3_android/scripts/PlayerPanel.as:412  dantext = "(judan) "  + LangManager.getString(467);
```

The android v0.682 build ships the identical hard-coded romaji ladder. "Absent from the
string table" IS true (I searched all 2,533 entries for nidan/sandan/…/judan: zero hits).
Finding 14 states the same discovery without the false clause and survives intact.

### 22 — one android number smuggled into a web claim

Everything in this finding verifies to the exact line except the last sentence. Web
`§1t99s0§.as:3058-3062` refuses a stance change below a **flat 48** frames
(= `maxreload/4`, since `maxreload = 8*24 = 192` at `:249`); `maxreload/6` is the
**android** rule at `MCSPlayer.as:2977` (`120/6 = 20`). The longplay is v0.717, so the
"CANNOT CHANGE STANCE" caption it films is the flat-48 gate. Repairable, not fatal — every
other number in the finding is right.

## The eight inflated overturns

**1 (Dragon Dance art) → "④ Dragon Dance input + Kanji-statue bonus".** The art is real and
I looked at it: eight white nodes with green rings each bearing a green 天, eight dark-red
bagua trigrams on an inner ring, a taijitu centre labelled FIRE, red ✕ top-right. But art is
not input, and the Kanji-statue bonus is untouched. **Both halves of blocker ④ survive this
finding's own evidence.** The input rule does exist — see new finding N4 — but it is at
`DragonDanceUI.as:367`, which the claim text never reaches.

**2, 7, 8 → "Dragon Dance unlocks at 3x/6x same-element rebirths — explains why
point-stacking matters."** This sentence is *correct*. Each rebirth grants +10 base element
ATK below DAN 8 (`InteractUI.as:849-856`), the Step gate is `qty 30` and the Step II gate is
`qty 60` — so 3 rebirths and 6 rebirths, exactly as written. Finding 8's own lane_impact
concedes it: *"the ledger's Dragon Dance sentence is correct as written."* All three
findings are TRUE and valuable; none falsifies the sentence they point at. Finding 2's
100-point budget *reinforces* "point-stacking matters" rather than overturning it.

**9 (hgold) → "film shows a flat +25 gold every rebirth, no 10th-rebirth tier."** The
currency identification is right — `§1t9413s0§ = 12 = STAT_HGOLD` — but the game's own HUD
calls that counter **"Gold"**: `strings.json["64"] = 'Gold'`, bound at `OverworldHUD.as:207`
to `goldlabel`, and `OverworldHUD.as:1351` feeds it `getHeavenlyGold()`. `strings.json["63"]
= 'Coins'` is the other counter. So "+25 gold" is terminologically correct and is not
falsified. The clause that *does* fall — "no 10th-rebirth tier" — falls on finding 19's
cite, not this one.

**16 (43 SFX names) → "### skills-meters — 33".** The 43 names are exactly right; I
reproduced the identical sorted list with `grep -rhoE '"Snd_[A-Za-z0-9_]+"'`. But a lane
score heading is not a falsifiable sentence, the finding is about audio rather than
skills/meters, and the ledger's own staleness banner already tells the reader to treat §2's
numbers as a floor. The sentence this should have named is line 241,
*"① **ALL AUDIO** — every SFX + music param is INFERRED"* — and against that one it is a
**partial** overturn: the event vocabulary is held, the params are not.

**20, 24** — dealt with above; both rest on a false figure.

**23 (Focus skill effect) → "③ Focus numerics (max/fill/switch-cost)."** Verified exactly
(`§1t120s0§.as:18` `= 1005`, `:230-231` `reload = maxreload - 1`), and the string-table name
really is plain **"Focus"**, not "Replenish Focus". But a skill's effect is none of max,
fill or switch-cost. Blocker ③ falls to findings 21 and 22, not to this one.

## What I verified for the twelve clean findings

- **3, 4, 6 — element circle.** I opened the PNG. FIRE 火 top / EARTH 土 right / WIND 風
  bottom / WATER 水 left, four grey arcs each captioned "STRONG AGAINST" on a #808080 field.
  Arrowheads read **clockwise: FIRE→EARTH→WIND→WATER→FIRE**. Sampled hexes match finding 6
  exactly: FIRE `#FF3300`, EARTH `#7D5500`, WIND `#BBBBBB`, WATER `#0099FF`, disc `#333333`.
  `payload.xml:626581` carries `characterId="1650" … name="elementCircle"`;
  `§1t401s0§.as:9` embeds `symbol1691`, `:77` declares `elementCircle:MovieClip`, `:574`
  shows it beside `getString(611)` = *"Choose an element to specialize in."*
  **Bonus corroboration nobody claimed:** `StatsManager.as:1836` builds elemental defense as
  `fireDef←WATERATK, windDef←EARTHATK, waterDef←WINDATK, earthDef←FIREATK` — i.e. water
  counters fire, wind counters water, earth counters wind, fire counters earth. The code
  wheel and the artwork agree with no measurement doc in between.
- **7, 8 — elemental gate table.** ElementTree over `skilldata.xml`: exactly **24** skills
  carry an element gate, split **12 / 8 / 4** at qty **10 / 30 / 60**, ids
  `1013, 1025-1035 / 1056-1059 + 1070-1073 / 1060-1063`. Names resolve through the string
  table to precisely the roster claimed. Finding 8's three line anchors are dead on:
  `:988`, `:1726`, `:1884`. 1056-1063 all carry `<passive>1</passive>`.
- **10 — phantom source.** `REBUILD_READINESS.md:165` says film shows +25 flat;
  `:205` says both longplays are pre-rebirth. A pre-rebirth longplay cannot film a DAN 8→9
  payout. The payload settles it against the ledger.
- **11, 12 — no elemental status.** `Damage.as:26-48` is the complete field list, `:6-24`
  the launchType enum, `StatsManager.as:288-312` the complete `BUFF_*` list — all cited to
  the line and all exact. `MCSPlayer.as:3347-3420` mitigates each element channel against
  its matching DEF, floors at 1, and sums into one `setHP()` call. No status anywhere.
  Two caveats worth recording: the "negative grep across all *Projectile*.as" is not
  literally clean (`redFreeze`, `animFrozen` and the ItemGenerator affix words "Burning" /
  "Frozen" all match), but on inspection none is a status effect; and finding 12's *"the
  Damage packet has no field to carry one"* overstates — `launchType` can carry
  `Damage.STUN` (`:18`) and `Damage.DEATHTOUCH` (`:20`). The grounded statement is that no
  elemental skill uses them. I confirmed that: Tornado = `LAUNCH_AIR`, Inferno / Tsunami /
  Earthquake = `LAUNCH_KNOCKDOWN`, all four with physical `damage = 0`.
- **14 — romaji ladder in v0.717.** `§1t408s0§.as:532-565`, Renshi (465) at dan 3-5, Kyoshi
  (466) at 6-7, Hanshi (467) at 8-9, rendered at `:581`. Quote line `:533` is really `{`;
  `case 0:` is `:534`. Cosmetic.
- **15 — SPD→cooldown.** `§1t1523s0§.as:2289-2295`: cap 600, `1 - param1/600*0.5`; consumed
  at `§1t105s0§.as:318` after `cooldown * 24`. Android `StatsManager.as:1854-1860`: cap 300,
  `1 - speed/300*0.5`. The x1.5 buff step is in both. **The SPD-10 re-pin checks out
  arithmetically:** skilldata gives Chi Punch cd 5, Focus L1 cd 10, Focus L2 cd 9; at SPD 10
  the web modifier is `1 - 10/1200 = 0.991667` → 4.958 / 9.917 / 8.925, i.e. the measured
  4.96 / 9.92 / 8.92. At SPD 5 you get 4.98 / 9.96, which does not fit.
- **17 — canChangeStance.** `§1t99s0§.as:3048/3050/3058/3060/3062`, every line exact. The
  reload deduction at `:3162` sits inside `setStance` (`§1t3489s0§`, `:3083`) behind an
  is-battle guard, so in-combat switching is live in v0.717 and costs 48. §3 #4's hard-lock
  falls, and the banner explicitly says the §3 corrections still stand — so this is a live
  sentence being overturned, not a stale one.
- **18 — crit.** `§1t99s0§.as:3272-3274` `if(reload == maxreload) return dmg*1.3 +
  §1t1243s0§`, where `§1t1243s0§` is set from `param6` at `:278` — the same slot android
  fills with `STAT_CRITICALDMG` (`MCSPlayer.as:249/256`). `BattleUI.as:102` binds crittext
  to `getString(175)` = "Critical Hit"; `:262` shows it at `percentage >= 1`. Android
  retunes to x1.5 Light / x1.2 else at `:3215-3221`. Also: `§1t99s0§.as:3295-3297` zeroes
  the bar on a crit.
- **19 — dan cap + 100-gold tier.** `§1t1523s0§.as:2644/2646/2647/2653/2655`, all exact;
  `§1t9426s0§ = 25 = STAT_DAN` at `:254`, `§1t9413s0§ = 12 = STAT_HGOLD` at `:228`. Quote
  lines "2650/2652" are really 2649/2651 — cosmetic.
- **21 — fill rate.** `§1t99s0§.as:1203-1205` `if(reload < maxreload) ++reload`. The
  SPD-scaled seed really is dead: `grep -n "§1t4419s0§"` returns **exactly two** hits, `:103`
  (init 48) and `:191` (assigned from `param7`), and nothing reads it. Seed source is
  `§1t4906s0§.as:54`, not `:53` — cosmetic.

## New findings (nobody in this packet claimed these)

See the structured return. Headlines: four **web-only skill ids 1074-1077** that exist in no
skilldata row and in no android build; the **elemental ATK-vs-DEF formula** (rebirth-elements
blocker ②) is fully held; the **Dragon Dance input rule** (blocker ④'s input half) is fully
held at `DragonDanceUI.as:367`; **all 24 elemental skills' chi + cooldown + description** are
in skilldata, so blocker ① is not "names only"; the string table's **ten kanji dan ranks
455-464** independently pin MAX_DAN_RANK=10; and android pays **20/5** heavenly gold on
rebirth where web pays **100/25** — a real tuning divergence.

### N4 detail — the Dragon Dance input rule, in the TARGET build

`reference/decompiled/shs3_payload/scripts/§1t5495s0§.as:382` (web v0.717, symbol1810):

```
if(Boolean(this.§1t5519s0§ && this.§1t5518s0§.length == 4)
   && Boolean(this.§1t5512s0§[1]) && Boolean(this.§1t5512s0§[2])
   && Boolean(this.§1t5512s0§[4]) && Boolean(this.§1t5512s0§[6]))
```

The android twin is `DragonDanceUI.as:367`, whose deobfuscated names identify every field:
`earlierHeaven && sequence.length == 4 && clickedArray[1] && [2] && [4] && [6]` →
`setLaterHeaven()` at `:369`. Cross-referencing `§1t5495s0§.as:70` — the Earlier-Heaven node
array `["sky","wind","water","mountain","earth","thunder","fire","lake"]` — indices 1/2/4/6
are **wind, water, earth, fire**. So the input is: click those four bagua nodes, in any
order, four clicks total, and the wheel flips from Earlier to Later Heaven, at which point
`§1t5495s0§.as:71`'s `["fire","earth","lake","sky","water","mountain","thunder","wind"]`
becomes the active mapping. This is blocker ④'s **input** half, held in v0.717 with no
android-parity caveat. Only the Kanji-statue bonus remains open.
