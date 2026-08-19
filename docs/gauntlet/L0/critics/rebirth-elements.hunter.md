# rebirth-elements — HUNTER LENS critique (blind)

Reviewer opened every cited artifact first-hand. Nothing below is taken from the
surveyor's word. §0 discipline: every verdict carries the artifact I personally opened.

---

## HEADLINE — the one STILL_UNHELD in this lane is DEAD

**`rebirth/element-circle-art` is REFUTED. The element-picker art is on disk, fully
legible, with exact OG hues.**

Chain I walked:

1. `reference/extracted/payload.xml:626581`
   ```
   <item type="PlaceObject2Tag" characterId="1650" depth="37" name="elementCircle" ...>
   ```
   → the `elementCircle` MovieClip the surveyor could not find **is DefineSprite 1650**.
2. `reference/extracted/sprites/DefineSprite_1650/1.png` — 808×480 RGBA, already exported.
   Crop used: `(500,60)-(800,370)`, LANCZOS ×3.

**What is VISIBLY in it:** a four-node ring. FIRE 火 top · EARTH 土 right · WIND 風
bottom · WATER 水 left. Each node is a `#333333` disc with a coloured ring + kanji, the
English name in white below. Four grey curved arrows run **clockwise**, each labelled
`STRONG AGAINST`: FIRE→EARTH, EARTH→WIND, WIND→WATER, WATER→FIRE.

Measured palette (dominant-colour histogram per node box):

| element | ring / kanji | note |
|---|---|---|
| FIRE  | `#FF3300` | |
| EARTH | `#7D5500` | identical to the shogo title font colour in `InventoryUI.as:2285` |
| WIND  | `#BBBBBB` | |
| WATER | `#0099FF` | |
| disc fill | `#333333` | |
| arrows + "STRONG AGAINST" | `#999999` | |
| element names | `#FFFFFF` | |

**The art AGREES with the code.** `StatsManager.as:1836` maps fireDEF←waterATK,
windDEF←earthATK, waterDEF←windATK, earthDEF←fireATK — i.e. water beats fire, earth
beats wind, wind beats water, fire beats earth. That is exactly the clockwise arrow
ring in the picture. The "frame wins" rule never had to fire: **for once the picture
and the doc say the same thing**, and I say so out loud.

Ledger blocker ⑤ ("rebirth/element-picker UI — never filmed") is now closed
**outright**: data + flow + copy + icons + ART.

Corroborating render: `reference/extracted/sprites/DefineSprite_1691_1t401s0/1.png` is
the whole `InteractUI` symbol (class `§1t401s0§`) with every child stacked at authoring
time; the same circle is visible behind the character preview at crop `(500,270)-(850,420)`.

---

## SECOND HEADLINE — claim 17 is WRONG, and it is wrong in the direction that matters

`rebirth/stance-slash-multipliers-parity` says a grep of the v0.717 desktop tree for the
stance multipliers "returned no matches, so parity is NOT established." **The desktop
code is there. I found it in two independent places, and the constants are DIFFERENT.**

`reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3083-3155` (`setStance`):
```
case §1t12220s0§:  this.§1t4417s0§ = this.§1t4420s0§ * 1.4;                              // LIGHT
case §1t12221s0§:  this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1); // BALANCED
case §1t12222s0§:  this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);
                   if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }                   // HEAVY
```
Second, independent site — the character sheet, `§1t5957s0§.as:2721-2747` — gives the
**complete v0.717 stance table**:

| stance | dmgModifier | critModifier | defModifier | slashModifier |
|---|---|---|---|---|
| Light    | `0.5 + 0.04·m` | **1.3** | 1.0 | **1.4** |
| Balanced | `1 + 0.02·m`   | **1.3** | 1.0 | `1 + 0.02·m` |
| Heavy    | **1.4**        | **1.3** | 0.8 | `0.5 + 0.04·m`, floor 100 |

vs the android v0.682 the surveyor quoted (`MCSPlayer.as:3029-3081`,
`InventoryUI.as:1942-1968`): Light slash ×1.5, Balanced `1+0.005·m`, Heavy `0.5+0.005·m`,
crit 1.2 (light) / 1.5 (other), dmg 0.5+0.005m / 1+0.005m / 1.5.

Three consequences the surveyor got backwards:

1. **Parity is not "unestablished" — it is DISPROVEN.** The android numbers must not be
   shipped. The desktop values are the v0.717 values.
2. **`mastery` is 0–9, not a 0–100 percentage.** The surveyor's lane_impact says the
   ledger's "mastery-9 ceiling" framing "needs re-checking". It does not. Both builds
   gate abilities on `mastery >= 3 / 4 / 5` (`MCSPlayer.as:3166-3184`,
   `§1t99s0§.as:3231-3241`) — a 0-100 percentage would make those gates meaningless.
3. **The ledger's §3 #3 was RIGHT all along.** At mastery 9 the desktop damage table is
   0.86 / 1.18 / 1.4 — the wiki's 0.9 / 1.2 / 1.4, rounded. And ledger line 101's "Heavy
   should be 100, not 120" is exactly the hard floor constant in both builds.

**Bonus: combat-core blocker ② falls out of the same read.** Ledger line 190 asks
"crit 1.3 vs 3 final — *read one crit popup*". No popup needed:
`§1t99s0§.as:3271-3273` → `return _loc2_ * 1.3 + §1t1243s0§;` on a full reload bar, flat
1.3 in every stance. **CONTRACT.**

---

## What I confirmed and STRENGTHENED

The surveyor cited android-only for four core claims. I found desktop v0.717 parity for
all four, which upgrades them from "android-only, label the build" to "same in both":

| claim | desktop cite I opened | result |
|---|---|---|
| `elemental-damage-ladder` | `§1t8359s0§.as` (fire) `§1t8394s0§` (water) `§1t8398s0§` (wind) `§1t8365s0§` (earth), all `:22-53` | identical {0.8,0.9,1.0,1.1,1.2} × scale {1.0…1.4}, zero physical, radius 200 |
| `aoe-radii-per-element` | `§1t8338s0§.as:36` =600 · `§1t8343s0§.as:38` =400 · `§1t8341s0§.as:37` =200 · `§1t8334s0§.as:72` =50 | identical, and identical launch types |
| `dragon-dance-bagua-input` | `§1t5495s0§.as:70-71`, `:382` | byte-identical arrays, identical `{1,2,4,6}` Later-Heaven trigger |
| `mitigation-flat-min1` | `§1t99s0§.as:3391-3425` | identical flat-subtract, identical hard min-1 per channel |

`element-counter-wheel` also holds in both (`§1t1523s0§.as:2269` has the same
(WATER,EARTH,WIND,FIRE)→(FIRE,WIND,WATER,EARTH)DEF permutation as `StatsManager.as:1836`).

`unlock-gate-is-stat-threshold` holds in both: `+10` element ATK per rebirth, `+20` on
the Dan-8 rebirth (`InteractUI.as:849-860` / `§1t401s0§.as:873-885`), against skilldata
thresholds `qty 10 / 30 / 60` on stat 28 at `skilldata.xml:988 / 1884 / 1726`.

---

## Defects found in claims that otherwise hold

**`dan-ladder-titles` — string 455 (初段) is NEVER DISPLAYED.**
`InventoryUI.as:2277-2280`:
```
case 0:
   this.danfield.text = "";
   break;
case 1:
   this.danfield.text = LangManager.getString(456);   // 456 = '(弐段)' = 2nd dan
```
The ladder the client actually renders is 456…464 for STAT_DAN 1…9, with **nothing at
all** at STAT_DAN 0. A recreation that reads "kanji titles 初段…十段 (strings 455–464)"
onto STAT_DAN 0..9 ships an off-by-one and paints a title on a fresh character.
Also, the claim's "desktop confirm `§1t1523s0§.as:2653-2655`" is a **mis-cite** — those
lines are the `STAT_DAN < 9` cap inside `doRebirth`, not the title table. The real
desktop title sites are `§1t5957s0§.as:3067/3098` (kanji) and `§1t408s0§.as:531-564`
(romaji).

**`kanji-statue-bonus` — the RNG permutation covers only HALF the statues.**
`Obj_DragonDanceStatue.as:38` guards the whole RNG block with `if(this.num >= 8)`. At
`:65-67`, the other branch is:
```
else
{
   sequence = props;
}
```
So Earlier-Heaven statues (props 0-7) take a **literal** sequence from room data; only
Later-Heaven statues (props ≥ 8) get the seeded permutation. The permutation is also 5
characters (`"1246" + this.num`), not 4.

---

## Recovered by the hunt, absent from the survey

- **The romaji Dan ladder, hardcoded in the v0.717 client.** `§1t408s0§.as:531-564`
  (android twin `PlayerPanel.as:380-415`): STAT_DAN 0=`""`, 1=`(nidan)`, 2=`(sandan)`,
  3=`(yondan) Renshi`, 4=`(godan) Renshi`, 5=`(rokudan) Renshi`, 6=`(nanadan) Kyoshi`,
  7=`(hachidan) Kyoshi`, 8=`(kyudan) Hanshi`, 9=`(judan) Hanshi`. This is the direct
  proof for the surveyor's *asserted* reading of the wiki garble: **kyudan is STAT_DAN 8
  = displayed Dan 9**, and the client says so in ASCII. Ledger blocker ③ dead, twice over.
- **The rebirth ENTRY POINT.** It is an inventory item, not an NPC.
  `reference/extracted/itemdata.xml:2311-2325` — item **2202**, `type 10`,
  `baseprice 1000`, `modifier id 25` (= STAT_DAN); strings 4154 = **"Scroll of Rebirth"**,
  4155 = *"New Game +\nProgress on to the next Dan Rank and specialize in an element.\n
  Level 80 required."* Gate at `InventoryUI.as:911-922` (desktop `§1t5957s0§.as:1261-1276`):
  `getLevel() == levelCap` **exactly** — over cap, or `didRebirth` already true this
  session, fires `reportHack("multiple rebirth")`. `levelCap` is a hard 80 in both
  (`StatsManager.as:76`, `§1t1523s0§.as:362` `public static const … = 80`).
  Bonus: the item's second modifier (`id 12`, value 5) is **dead data** — the loop
  `return`s inside the `modid == 25` branch before ever reaching it.
- **No elemental status effects exist.** Refutes `rebirth/element-status-effects`.
  `Damage.as:26-48` declares the complete field set — damage, stance, launchType,
  attackerlvl, piercingDamage, four element channels, flyVelX/Y, victimPosX. **No burn,
  DoT, slow or root field exists to carry one.** All eight elemental projectiles build
  `Damage` with only their own channel populated; the victim path
  (`MCSPlayer.as:3347-3420`) does flat subtraction then one `setHP`, writing no state.
  The `BUFF_*` table (`StatsManager.as:288-312`) is a meta/out-of-combat set — XP, ATK,
  DEF, SPEED, AP, DUELTOKENS, COINS, RARELOOT, MUTE, FULLMUTE, HELL, INJURED, MODERATOR
  — and **no projectile references it**. (`redFreeze` is hit-stop, not a status.)
  Per-element differentiation is exactly three things: damage channel, launch type, AoE
  radius. That is an answer, not an unknown.
- **`slash distance` is player-visible, and the payload's own copy of it does not fit.**
  `InventoryUI.as:2232`:
  ```
  str += "slash distance: " + FONTCOLOR1 + int(baseSlashLength * slashModifier).toString() + FONTEND + " (" + stanceName + ")<br>";
  ```
  and the web payload's authored default text, `reference/extracted/ui_strings.txt:361`:
  `wind def: 2earth def: 3slash distance: 345 (heavy)`. **345 exceeds what v0.717 can
  produce for Heavy**: base ≤ 255 (Dan 9, speed→∞) × Heavy ≤ 0.86 → ≤ 219. Either the
  authored text is stale from an earlier build, or a slash-length term exists outside
  `getBaseSlashLengthVal`. **Flagged OPEN — I do not resolve it.**
- **Bank weight in v0.717 is not the android formula.** The claim-8 lane_impact says
  `100 + DAN*10 + PAIDSTORAGE*10` (android `BankUI.as:264`). Desktop
  `§1t1523s0§.as:3175-3182` has a base that becomes **200** when `getStat(40018) == 1`
  — a permanent capacity unlock with no android counterpart.
- **The android EN string table has real holes.** `strings.json` has **no ids 960–999**
  at all, yet v0.717 calls `getString(979/980/981)` for the three stance names
  (`§1t5957s0§.as:2724/2733/2742`). Claim 1's "every display string … is resolved"
  survives *for this lane*, but the general S0-3 assumption does not: the v0.682 table
  does not cover every v0.717 id.
- **Currency naming trap.** The `+25 / +100` in claim 7 is `STAT_HGOLD = 12` =
  **Heavenly Gold**, the PayVault premium currency (`StatsManager.as:2669-2676`
  `getHeavenlyGold()` adds `QueryManagerPIO.getPayVaultCoins()`), *not* `STAT_GOLD = 11`
  which is what `getGold()` / `getMaxCoins()` / `isCoinPurseFull()` use. The ledger's own
  `c` vs `g` vocabulary matches — but it is the exact **inverse** of the code's naming, so
  a config const named `gold` will land on the wrong stat.
- **Four Dan achievement rows, not one.** `114_Mobile_AchievementData.bin` ids 48/49/50/51
  at `<stat>25</stat>` `<val>` 1/2/5/9 → strings 8121/8122/8123/8124 =
  "Reach Dan 2/3/6/10". Four independent points pinning displayed = STAT_DAN + 1 — the
  surveyor used only the last. Shipped quirk worth reproducing: achievement 49 is *named*
  "Renshi" (8042) but fires at STAT_DAN 2, while the Renshi title itself starts at
  STAT_DAN 3.

---

## Verdict summary

18 claims verified against artifacts I opened myself. **3 refuted** (`dan-ladder-titles`
minor, `kanji-statue-bonus` minor, `stance-slash-multipliers-parity` **material**), **1
STILL_UNHELD overturned** (`element-circle-art` — **material**, the art is on disk), **1
STILL_UNHELD overturned as a bounded negative** (`element-status-effects` — no status
system exists). The remaining 13 hold, four of them more strongly than claimed.

The survey's real failure mode was **trusting a negative grep against an obfuscated
bundle**. String literals are encoded in `shs3_payload` (that is why "multiple rebirth"
and "slash distance" return nothing) — but numeric constants survive intact, and every
one of the four "android-only" mechanics turned out to be sitting in the desktop tree
under a `§1tNNNNs0§` name. Grep numbers, not words.
