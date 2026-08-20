# HUNTER REVIEW — unit `src-string-table`

Blind critic, Lens 2 (hunt under-claiming). Every verdict below is backed by an artifact
**I** opened myself. Build labels carried throughout.

---

## 0. Headline

**Citation discipline: excellent. Novelty discipline: poor.**

I re-parsed `reference/extracted/android/118_Mobile_Lang_EN.bin` from bytes (UTF-16LE, 7,675
lines, 2,555 `<trans-unit>` records, 2,533 unique resnames) and re-resolved every line number
the surveyor cited. **All 15 cited line numbers resolve to the exact quoted text.** Not one
broken cite, not one fabricated quote. That half of the work is first-rate.

The failure is elsewhere. The coverage note asserts:

> "I therefore ran a phrase-by-phrase coverage grep of every candidate against
> `docs/gauntlet/L0/{systems,sources,critics}` and report only zero/near-zero-hit material"

**That is false for nine of the seventeen claims.** Claims 1, 2, 3, 4, 7, 10, 12, 14 and 15
all land on surfaces the banked corpus already holds — and in six cases the banked artifact is
*strictly stronger* (AS3 source or a web-build video frame, versus Android prose). Two claims
assert a gap that the corpus has already closed. One claim's headline is a **dead string**.

**Score: 7 refuted (5 material, 2 minor) / 10 upheld.** Nine new findings, all code- or
frame-cited, seven of them genuinely absent from the banked corpus.

---

## 1. The single worst error — the six targeting modes are DEAD STRINGS

`string-table/skill-card-field-set-six-target-modes` is the claim I would most want stopped
before it enters the ledger.

The claim: *"SIX targeting modes (Self, Enemy, Ally, Enemy Area Effect, Ally Area Effect, All),
meaning the skill schema has an ally-targeting branch the single-player ledger never accounts
for."*

Three independent tests, all mine:

1. **Zero call sites.** `getString(161)` … `getString(166)` appear **0 times** across
   `reference/decompiled/shs3_android/` and `reference/decompiled/shs3_payload/`. For contrast,
   the other labels in the same claim: `(126)` → 2, `(158)` → 2, `(159)` → 2, `(160)` → 2,
   `(167)` → 8, `(647)` → 12.
2. **No data field.** `grep -c "<target>"` = **0** in both `reference/extracted/skilldata.xml`
   and `reference/extracted/android/117_Mobile_SkillData.bin`.
3. **The card builder doesn't render one.** `reference/decompiled/shs3_android/scripts/XMLSkill.as`
   is the skill-card composer. Its complete `getString` inventory across `:101-263` is
   **160, 157, 155, 156, 167, 647, 648, 124, 302, 120, 726, 727, 728, 729, 158** — and no
   targeting row anywhere.

Strings 161–166 are vestigial design copy. They fail *exactly the test the surveyor themselves
applied to string 125* when they declined to claim Stance Restriction was live (citing the
banked `items-equipment/stancerestriction-is-dead-data`). The test was applied to one
neighbouring string and not to the six that carried the headline.

The rest of the field set is fine — and `XMLSkill.as` is a **better artifact** for it than the
string table, because it gives the field *order* as well as the labels.

---

## 2. Two claims assert gaps the corpus has already closed

### 2a. AUTO SLASH cadence is not unheld — it has been closed since run 2

Claim 10's lane note: *"its cadence remains STILL_UNHELD, so the §1 known-unknown is narrowed,
not closed."*

`docs/gauntlet/L0/SEEN_CLAIM_IDS.txt:12` — **`actionscript/auto-slash-is-the-enemy-ai`**, banked
HELD, ⚑ OVERTURNS LEDGER, explicitly overturning the string *"AUTO SLASH cadence."*

I re-derived it from source rather than trusting the bank:

- `MCSPlayer.as:1149` — `if((this.controlledBy == 1 || this.controlledBy == 3 || this.autoSlash)
  && !dead && checkAITrigger() && …)` → `this.AI()`. The toggle routes the **player's own
  character through the enemy AI function**. That is a sharper statement of the semantics than
  the tutorial prose the claim rests on.
- `NPC.as:285-294` — `checkAITrigger()` decrements `aiCounter`, returns true and resets when it
  hits 0.
- `NPC.as:22` `aiCounterMax:int = 24`, **overridden to 12 at `MCSPlayer.as:165`** (also
  `EnemyElite.as:18`, `EnemyPlayer.as:52`, `FriendlyElite.as:18`).

⇒ **a decision every 12 frames = 500 ms** at the byte-verified 24.000 fps. The number exists.

### 2b. The crop-market coefficients are not missing

Claim 4: *"the existence and driver of a player-facing commodity market is HELD; no coefficient
is."*

`reference/decompiled/shs3_android/scripts/InteractUI.as:105` `internal var cropPrices:Array =
[10,10,10,10];` and `:497-501`:

```as3
this.cropPrices = [10,10,10,10];
if(maxCrops != leastCrops)
{
   this.cropPrices[leastCropsSide] = 20;
   this.cropPrices[maxCropsSide] = 5;
}
```

Three price points — base **10**, fewest-crops clan pays **20**, most-crops clan pays **5** —
and payout is `count × price` in one lump (`sellCrop`, `:1544-1548`). Banked verbatim at
`docs/gauntlet/L0/systems/economy.md:555-569` (E-16) and `run2/CLAIMS.md:1276`.

The claim also mis-attributes **"Global Effect"**. String 288 is the *title of a different
dialog*: `GlobalVarDialog.as:47` `this.titleText.text = LangManager.getString(288);`, popped
after selling (`InteractUI.as:1552-1553` `updateGlobalVar(50000 + house, count)` →
`globalVarDialog.show()`). The Rare Crops Collection is string **282**, titled at
`InteractUI_crops.as:260`, and it is a **6-slot** screen (`:69 internal var maxItem:int = 6;`)
whose header renders `count/6 × 100 %`. "Global Effect" is not a field on it.

---

## 3. The forge/reinforce claim contradicts the ledger's own text

Claim 3: *"a reagent layer the ledger's 'Forge/Reinforce costs' ready-line does not contain."*

`docs/research/REBUILD_READINESS.md:79-80`:

> **Economy statics:** 100c/3g guest start; inn 8c, toll 7c, stable 14c+5AP, fast-travel 5g,
> rebirth scroll 1000c (+25g), **Forge 700c+2 ore, Reinforce 5000c+1 silver ore**; War Room
> structures 10k/10k/5k.

The reagent layer is in the ledger, in the line above the one quoted. Worse, it is already
banked from a **web v0.717 video frame** — `docs/gauntlet/L0/sources/frames.md:50` reads
*"FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS / MATERIALS NEEDED: 2 IRON ORE"* off the
longplay, which makes the Android string-table version the weaker of the two artifacts.
`economy.md:480-488` (E-13) already holds `cost = min(nodeLevel,80) × 100` and the three-band
reagent structure.

The claim also mis-describes the mechanic. *"Reinforce is a flat 5,000 coins plus **one of**
Silver Ore / Titanium Ore / Uncut Diamond"* reads as a player choice. `InteractUI.as:1097-1130`
is a deterministic switch on the **equipped weapon's own level**:

| weapon level | reagent stat | string | name |
|---|---|---|---|
| `< 30` | 20064 | 850 | Silver Ore |
| `30–59` | 20065 | 851 | Titanium Ore |
| `≥ 60` | 20066 | 852 | Uncut Diamond |

(with `:1098-1101` forcing `weaponlevel = 59` for item 13022, the Pickaxe). The player never
picks. The same is true of forge: `:1002-1047` bands on **node** level, so "iron / bronze /
steel" are `<30` / `30-59` / `≥60`, not menu options.

The one thing the claim genuinely adds is the **ore names** for those stat ids — the banked
work carried the numeric stat ids only. That is worth about one sentence, not a claim.

---

## 4. The 150-HP reframing is backwards

Claim 11: *"the ~150 HP 'PvP-duel dummy' the ledger calls wrong data is in fact the correct
profile for a combat mode the ledger omits."*

`src/config/combat-sim.ts` — `ENEMY_BASE.hp` is **1**, and the comment above it is explicit:

> ⚠️ THE AUTHORED BASE IS 1, NOT 150 (D3). Named-enemy HP is not authored at all — it is
> recomputed at spawn as `effPlayerDmg × K` … **Our old 150 was a PvP-dummy seed modelling
> nothing**

The 150 was never OG data. It was this repo's own fabricated seed, and it has already been
removed. It cannot be "the correct profile" for anything.

The string undercuts the claim a second time. `118_Mobile_Lang_EN.bin:7601` says the offline
opponent *"his samurai will be controlled by the computer"* — the **absent player's own
character**, with that player's stats. That is the opposite of a fixed 150-HP stat block.

The underlying fact — offline duels are AI-driven — is real, new (zero corpus hits for
"controlled by the computer") and worth banking. The reframing on top of it is wrong.

---

## 5. Piercing/Critical Damage — both halves of the caveat are false

Claim 7 carries: *"NOT cross-checked against web v0.717; a stat panel is exactly the surface
that could differ between builds, so the label is Android-only"* and *"the channel's arithmetic
is not [held]"*.

**Cross-build:** `reference/extracted/ui_strings.txt:100` — a **web v0.717** authored TextField:

```
physical dmg: 1234 - 1235 &nbsp;(heavy)critical dmg: 1234-1235 *(heavy)piercing dmg: 20<font face="Edo SZ" …
```

Banked as `uistrings-payload/character-stat-sheet-complete` with the full 17-row stat sheet and
its geometry (`payload.xml:592221-592223`). Both rows are in the web build.

**Arithmetic:** `docs/gauntlet/L0/sources/actionscript.md:1263-1266` and
`systems/combat-core.md:448-449` hold the defence-floor ladder that consumes it —
`lvl ≤ 10 → 1 + piercing`; `≤ 20 → lvl/8 + piercing`; `≤ 30 → lvl/6 + piercing`; else
`lvl/4 + piercing` — plus `itemdata.md:227,235` for the `prog5 PIERCINGDMG` growth curve
(1 → 8 → 16). `actionscript.md:1017` even opens with *"New fact absent from all 12 ledgers."*

---

## 6. The stance-ring claim: right answer, wrong reason

Claim 14's novelty argument is *"[the banked claim] rests on a sprite export … and BattleUI.as,
**which never binds an index to a stance NAME**."*

`MCSPlayer.as:3027-3090`, `setStance()`:

```as3
switch(this.stance)
{
   case LIGHT_STANCE:    … BattleUI.instance.setStanceColor(1); break;   // :3037
   case BALANCED_STANCE: … BattleUI.instance.setStanceColor(2); break;   // :3048
   case HEAVY_STANCE:    … BattleUI.instance.setStanceColor(3); break;   // :3063
   case REVERSED_STANCE: … BattleUI.instance.setStanceColor(2); break;   // :3074
   case DUAL_STANCE:     … BattleUI.instance.setStanceColor(3);          // :3089
}
```

The binding is one call up from `BattleUI.setStanceColor`, in a named switch — and it is
**already banked, cross-build**, at `docs/gauntlet/L0/critics/rebirth-elements.precedence.md:23`
("same five cases, same order, same `setStanceColor` 1/2/3/2/3 sequence" against web
`§1t99s0§.as:3083-3153"). The code also says more than the tutorial string ever could: the
3-frame clip serves **five** stances, with REVERSED reusing brown and DUAL reusing red.

**The frame work is the good part, and it is better than reported.** I opened all three PNGs
myself. The stated crop — `200x170+10+915` — does **not** contain the caption described; at
`x ≤ 210` you get the medallion and, in the LIGHT frame only, a clipped "CHANGE STAN…". Widening
to `(0,860)-(700,1080)` ×2 LANCZOS shows the real binding with no string and no code needed:

- LIGHT frame: blue-violet annulus, HUD caption **"LIGHT STANCE"**, hover tooltip
  **"CHANGE STANCE"** below.
- HEAVY frame: saturated red annulus, HUD caption **"HEAVY STANCE"** at x ≈ 220-420 — outside
  the stated crop.

Pixel-sampled at identical coordinates across the three frames: `(90,1022)` reads
`(98,100,183)` / `(141,134,105)` / `(91,7,5)`. **The frame wins, and it agrees with the string
on mapping and with `stancecolor1_56` on hue.** The surveyor's "brown vs tan" honesty note is
correct — `(170,164,116)` is a desaturated olive-tan.

---

## 7. What genuinely survives

Ten claims. The four strongest:

- **`no-chi-cost-or-cooldown-numbers-in-prose`** and **`no-condition-damage-multiplier-in-prose`**
  — both honest STILL_UNHELDs, both correct. I scanned every record matching
  `chi|cooldown|condition|broken|well-maintained` myself: the only chi numbers in the table are
  7072/7073/7074 *"Steal 20 / 35 / 50 chi"* (effect magnitudes, not costs) and the only cooldown
  text is 647 "Cooldown" / 7067 "Reduced cooldown". `XMLSkill.as:119,123` proves the surveyor's
  reasoning exactly right — the card composes `getString(167) + ": " + cost` and
  `getString(647) + ": " + cooldown.toFixed(2) + " " + getString(648)` from skilldata's
  `<chi>`/`<cooldown>` tags. Correctly scoped, correctly refused.
- **`skill-usage-grammar-…`** — strings 6099 / 6100 / 6103 / 6111 / 6115 have **zero** corpus
  hits. Tap / hold-to-charge / drag-to-aim, the charge-interrupt rule, and the two PvP-banned
  clone skills are all genuinely new rule statements.
- **`jigoku-is-a-timed-penalty-jail`** — new, and stronger than filed: Hell is a first-class
  room type, `XMLRoomData.as:10 ROOMTYPE_HELL:int = 8`, referenced by six classes.
- **`carry-weight-gates-travel`** — the travel-gate reading is right and I upgraded it to code
  (§8 below).

---

## 8. New findings — nine, all opened by me

| # | finding | cite |
|---|---|---|
| 1 | Inn rest is a **floor-set, not a top-up** | `ScreenTransition.as:293-298` |
| 2 | War-room level-10 gate has a **Dan escape hatch** | `OverworldHUD.as:1264` |
| 3 | Strings 161-166 are **dead** | zero call sites + `XMLSkill.as:101-263` |
| 4 | Weight gate is a travel gate **in code**, 8 call sites | `Obj_TownSign.as:44` et al. |
| 5 | Hell is a **room type**, `ROOMTYPE_HELL = 8` | `XMLRoomData.as:10` |
| 6 | War-turn expiry **resets moves to max** | `WarUI.as:525-547` |
| 7 | "Global Effect" titles `GlobalVarDialog`, not the crops screen | `GlobalVarDialog.as:47` |
| 8 | The portrait **disc fill** is stance-tinted, not just the ring | 3 frames, 166 px sampled |
| 9 | `systems/ui-hud.md` §17 still carries the **refuted** id-drift table | `ui-hud.md:495-508` |

Detail on the two that most change a rebuild:

**(1) The inn is a floor, not a faucet.**

```as3
case ACTION_REST:
   if(StatsManager.getPlayerStats(StatsManager.STAT_AP) < StatsManager.getPlayerStats(StatsManager.STAT_MAXAP) / 3)
   {
      StatsManager.setStat(StatsManager.STAT_AP,StatsManager.getPlayerStats(StatsManager.STAT_MAXAP) / 3);
   }
   StatsManager.fullHealth();
```

`ScreenTransition.as:293-298`. A player already above `maxAP/3` gets **nothing** from an inn.
It can never raise AP above a third. The string's "up to a third of your maximum" is right;
"a second, independent AP faucet" is not — it is a floor-raise with a hard cap, and a rebuild
that implements it as `AP += maxAP/3` will be wrong for every rested player above 33 %.

**(2) The war room is not a flat level-10 gate.**

```as3
if(StatsManager.getLevel() < 10 && StatsManager.getPlayerStats(StatsManager.STAT_DAN) == 0)
{
   this.showDialog(LangManager.getString(320),LangManager.getString(5));
   return;
}
```

`OverworldHUD.as:1264-1268`. **A rebirthed character (Dan ≥ 1) enters at any level.** Two
further gates the string never mentions sit either side of it: a per-character disable at
`:1260-1262` and an offline-mode block at `:1269-1272`. The duel gate *is* flat — `:1172`
`else if(StatsManager.getLevel() < 2)` → string 667 — so that half of the claim stands.

**(9) A stale banked doc.** `docs/gauntlet/L0/systems/ui-hud.md:495-508` still presents
`ui-hud/lang-id-drift-caveat` as HELD, calling `619/620` a build-revision mismatch and issuing a
downstream rule *"never [resolve] by id alone"*. That is inverted: `LangManager.getString(n)` →
`Locale.loadStringEx(n.toString())` (`LangManager.as:78`) keys XLIFF by **resname**, and by
resname `619` = "Auto Slash Off" and `223` = "AP" — exactly right for
`OverworldHUD.as:211 apbaricon.text`. Decisive proof: itemdata's `<name>4000</name>` resolves to
"Small Soldier Pill" only under resname (id 4000 does not exist; ids stop at 2554). First
divergence is `id 212 / resname 222`, which is precisely why every "✅" row in that table is
`id ≤ 208`. **This is already banked** as `ui-hud/langmanager-uses-resname-not-id`
(`SEEN_CLAIM_IDS.txt:1058`) — I report it only because the systems doc was never corrected and
still hands a wrong rule to the next reader. It also *vindicates* this unit: the surveyor keyed
by resname throughout, and was right to.

---

## 9. Verdict

The string table was read carefully and cited honestly. What it was not was **read against the
bank**. Six of seventeen claims re-derive banked material with a weaker artifact, two assert
gaps that are closed, one rests on dead strings, and one inverts a config value this repo has
already corrected. The two honest STILL_UNHELDs are the most reliable claims in the set.
