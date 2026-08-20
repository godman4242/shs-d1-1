# SOURCE SWEEP — `string-table` (Android `118_Mobile_Lang_EN.bin`, build **v0.682**)

**Unit:** orthogonal source surveyor, the XLIFF string table.
**Artifact:** `reference/extracted/android/118_Mobile_Lang_EN.bin` — UTF-16LE XLIFF, **7,675 lines**,
2,555 `<trans-unit>` elements, 2,533 unique resnames. Already parsed into
`docs/gauntlet/L0/index/strings.json` (2,533 keys, 640 of them `IDS_*` quest keys) and
`docs/gauntlet/L0/index/resolved_names.json`.

**⚠ BUILD LABEL, CARRIED IN EVERY CLAIM BELOW.** Every string quoted here is **Android
clientVersion 0.682**. Where a web v0.717 artifact was available I cross-checked and say so.
Where I did not cross-check, the claim is Android-only and says that too.

**⚠ THE KICKOFF'S PREMISE IS PARTLY FALSE, AND I AM SAYING SO UP FRONT.** The kickoff states
*"NOBODY HAS READ IT FOR MECHANICS IN FOUR RUNS."* That is not what the banked corpus shows.
`docs/gauntlet/L0/systems/combat-core.md:486-490` quotes the stance-triangle strings; `:475` quotes
6005's `Defense -20%`; `docs/gauntlet/L0/systems/rebirth-elements.md:55-93` reconstructs the full
Dan ladder from strings 455-467 and 8041-8044; `docs/gauntlet/L0/systems/skills-meters.md:463-465`
quotes the 7004/7009-7013 per-level rows; `docs/gauntlet/L0/systems/meta-social.md:216-217` quotes
the 10/30-day prize ladder; `docs/gauntlet/L0/sources/skilldata.md:526` derives base carry weight
100 from 7014-7033; `docs/gauntlet/L0/systems/world-exploration.md:748` already banks the
15m/1h/6h/12h crop timers. **The table has been read hard.** So this sweep is deliberately narrow:
I ran a phrase-by-phrase coverage grep of every candidate against
`docs/gauntlet/L0/{systems,sources,critics}` and report **only strings with zero or near-zero prior
hits.** Anything already banked is listed in §Z below as *not re-derived*, so the omission does not
read as a gap.

---

## ST-01 — The achievement roster is **hard-capped at 61**, and slots 62-80 were **never authored**. `[A2] [meta-social blocker ③]`

**Ledger (§4 meta-social, blockers):** *"③ achievements list, daily-reward table, token costs —
**one Ruffle session closes all**."* No Ruffle session is needed and none ever could have run
(§5 P0 proved the build is dead).

`reference/extracted/android/114_Mobile_AchievementData.bin` (plain UTF-8 XML, 553 lines) holds
**exactly 61** `<achievement>` rows, ids 0-60, each carrying five fields:

```
reference/extracted/android/114_Mobile_AchievementData.bin:436-443
	<achievement>
		<id>48</id>
		<img>1</img>
		<name>8041</name>
		<desc>8121</desc>
		<stat>25</stat>
		<val>1</val>
	</achievement>
```

`<name>` runs 8000-8060 and `<desc>` runs 8080-8140 — a **fixed +80 offset**, so the pairing is
mechanical, not guessed. The string table, however, reserves **80** slots and leaves the last
nineteen as untranslated placeholder keys:

```
reference/extracted/android/118_Mobile_Lang_EN.bin:5396   <source>Achievement62</source>   (resname 8061)
reference/extracted/android/118_Mobile_Lang_EN.bin:5450   <source>Achievement80</source>   (resname 8079)
reference/extracted/android/118_Mobile_Lang_EN.bin:5636   <source>Achievement Desc62</source> (resname 8141)
reference/extracted/android/118_Mobile_Lang_EN.bin:5690   <source>Achievement Desc80</source> (resname 8159)
```

**Consequence for a rebuild:** the achievement list is *closed*, not sampled — 61 rows, each with an
icon id, a driving `<stat>` id and a numeric threshold `<val>`. The 19 empty slots are a shipped
content ceiling the original never filled, and a 1:1 recreation should reproduce 61, not invent more.

Coverage grep: `"Achievement62"` 0 hits, `"Achievement Desc"` 0 hits, `"8061"` 0 hits across all
banked systems/sources/critics.

- **artifact:** A2 · **build:** android v0.682 (achievement blob + string table) · **verdict:** HELD
- **overturns_ledger:** yes — the close-path *"one Ruffle session closes all"* is wrong twice: no
  session is possible, and the list is already on disk.

---

## ST-02 — **Castle Assault** is a whole subsystem absent from all 12 ledger systems, and it states its own victory rule. `[A2] [meta-social blocker ②]`

**Ledger (§4 meta-social, blockers):** *"② War-Room **map topology** (board/adjacency)."*
**Ledger (§4 meta-social, ready):** *"War-Room 6 actions + 11-rank ladder … structure costs;
terrain deploy mods; kill cap 350; flag +120%; 24h resolution."* — no castle, no control point,
no flag room, anywhere in the document.

The string table carries a complete, self-documenting castle-assault mode:

```
reference/extracted/android/118_Mobile_Lang_EN.bin:1745  <source>Control Point</source>                                   (598)
reference/extracted/android/118_Mobile_Lang_EN.bin:1748  <source>Capture all the control points to gain control of the territory</source>   (599)
reference/extracted/android/118_Mobile_Lang_EN.bin:1751  <source>Special Control Point</source>                           (600)
reference/extracted/android/118_Mobile_Lang_EN.bin:2273  <source>Congratulations! The castle is now vulnerable to attack for the next 3 hours!</source>  (774)
reference/extracted/android/118_Mobile_Lang_EN.bin:2285  <source>Objective: Fight your way to the castle flag room and capture the castle flag to open the castle gates.</source>  (778)
reference/extracted/android/118_Mobile_Lang_EN.bin:2288  <source>Friendly castles can function as a Command HQ. The sector will be vulnerable to attack until the castle gates are closed again.</source>  (779)
reference/extracted/android/118_Mobile_Lang_EN.bin:2294  <source>Castle Flag Room</source>        (781)
reference/extracted/android/118_Mobile_Lang_EN.bin:2297  <source>Castle Defender Spawn</source>   (782)
reference/extracted/android/118_Mobile_Lang_EN.bin:2330  <source>Castle Defense</source>          (793)
reference/extracted/android/118_Mobile_Lang_EN.bin:2333  <source>Castle Assault</source>          (794)
reference/extracted/android/118_Mobile_Lang_EN.bin:2378  <source>Castle Level 3</source>          (809)
reference/extracted/android/118_Mobile_Lang_EN.bin:2381  <source>Castle Level 1</source>          (810)
```

That is: castles have **levels** (1 and 3 are the two labelled tiers), a **flag room** with a
**defender spawn**, an assault objective (reach the flag room, capture the flag, gates open) and a
**3-hour post-breach vulnerability window** after which the gates re-close. And the *territory*
win-condition — the thing blocker ② calls missing — is written out in plain English at line 1748:
**capture all the control points**. Blocker ② is therefore not "topology unknown"; it is
"**board geometry** unknown, **victory rule and node taxonomy held**." Sector node types are
enumerated too: `Diplomatic Territory (cannot be captured)` (584, :1703), `Unclaimed Territory`
(585, :1706), `Peaceful Clan Territory` (586, :1709), `Site for Command HQ` (594, :1733),
`Reserved site for Command HQ` (596, :1739), and `Terrain: Field / Forest / Mountain`
(604-606, :1763/:1766/:1769).

Coverage grep: `"Control Point"` 0 · `"Castle Level"` 0 · `"Castle Flag"` 0 · `"castle gates"` 0 ·
`"next 3 hours"` 0 · `"Diplomatic Territory"` 0 · `"Peaceful Clan Territory"` 0 ·
`"Terrain: Mountain"` 0 · `"Special Control Point"` 0.

- **artifact:** A2 · **build:** android v0.682 · **verdict:** HELD
- **overturns_ledger:** yes — blocker ② is half-closed, and an entire named mode ("Castle Assault")
  is missing from the 12-system taxonomy the same way `survivalmodedata` was (Stage-0 S0-1).

---

## ST-03 — Forge and Reinforce carry **reagent bills**, and Reinforce is a flat 5,000 coins × three ore grades. `[A2] [economy / items-equipment]`

**Ledger (§4 economy, ready):** *"Forge/Reinforce/Rebirth/Writ costs"* — costs only. The
**material** half is nowhere in the document, and a builder cannot implement a forge from a price.

```
reference/extracted/android/118_Mobile_Lang_EN.bin:2486  Forge an iron sword (level [0])?\nCost: [1] coins\nMaterials needed: 2 Iron Ore                       (845)
reference/extracted/android/118_Mobile_Lang_EN.bin:2489  Forge an bronze sword (level [0])?\nCost: [1] coins\nMaterials needed: 1 Tin Ore, 2 Copper Ore        (846)
reference/extracted/android/118_Mobile_Lang_EN.bin:2492  Forge an steel sword (level [0])?\nCost: [1] coins\nMaterials needed: 2 Iron Ore, 2 Coal, 1 Titanium Ore (847)
reference/extracted/android/118_Mobile_Lang_EN.bin:2501  Reinforce your currently equipped weapon to make it unbreakable?\nCost: 5000 coins\nMaterials needed: 1 Silver Ore     (850)
reference/extracted/android/118_Mobile_Lang_EN.bin:2504  … Materials needed: 1 Titanium Ore      (851)
reference/extracted/android/118_Mobile_Lang_EN.bin:2507  … Materials needed: 1 Uncut Diamond     (852)
```

Three forge recipes, three reinforce recipes. The forge **cost** is a runtime `[1]` (the banked
`min(lvl,80)×100` formula, `economy.md:486`) but the **bill of materials is a literal** and is
identical to the mining ladder in 7059-7063: Coal → Iron → Tin → Copper → Silver → Titanium →
Diamond. Repair (848, :2495) is `Cost: [0] coins` — a computed value, consistent with the already-
banked `items-equipment/repair-weapon-cost-held`, so I am **not** re-claiming repair.

Coverage grep: `"Materials needed"` 0 · `"2 Iron Ore"` 0 · `"Cost: 5000 coins"` 0 · `"Uncut Diamond"` 0.

- **artifact:** A2 · **build:** android v0.682 · **verdict:** HELD
- **overturns_ledger:** no — it fills an unstated hole in the "ready" line rather than contradicting it.

---

## ST-04 — Crop prices are a **live supply-and-demand market**, and rare crops feed a collection with a **Global Effect**. `[A2] [economy blocker ②]`

**Ledger (§4 economy, blockers):** *"② sell-price + **prosperity-daily-sim formulas**."* The ledger
treats the economy as prices-plus-a-prosperity-tick. It is not: there is an explicit player-driven
commodity market.

```
reference/extracted/android/118_Mobile_Lang_EN.bin:2465  You have [0] crop(s) for sale. (Prices are based on demand and supply)   (838)
reference/extracted/android/118_Mobile_Lang_EN.bin:824   Rare Crops Collection    (282)
reference/extracted/android/118_Mobile_Lang_EN.bin:833   Soil Grade               (285)
reference/extracted/android/118_Mobile_Lang_EN.bin:842   Global Effect            (288)
reference/extracted/android/118_Mobile_Lang_EN.bin:857   Berries Collected        (293)
reference/extracted/android/118_Mobile_Lang_EN.bin:845-854  Aka Ryu Crops / Midori Ken Crops / Aoi Hoiru Crops / Ki Sensu Crops  (289-292)
```

Crops are sold **to a chosen clan** (271-274, :791-:800), each clan's stock is tracked separately,
and a rare-crop collection screen carries a field literally labelled **"Global Effect"** — a
server-wide consequence of aggregate harvesting, which is a different mechanism from town
prosperity. `"Soil Grade"` is the only one of these five with prior coverage
(`world-exploration.md:469`); the market-pricing rule and the Global Effect field are new.

Coverage grep: `"demand and supply"` 0 · `"Global Effect"` 0 · `"Rare Crops"` 0 · `"Berries Collected"` 0.

- **artifact:** A2 · **build:** android v0.682 · **verdict:** PARTIAL — the *existence and driver*
  of the market is held; no coefficient is.
- **overturns_ledger:** no, but blocker ② is mis-scoped: it needs a market sim, not just a formula.

---

## ST-05 — **Jigoku** — a timed penalty jail — is a shipped location with its own GM commands. `[A2] [meta-social]`

Nothing in the ledger's meta-social entry mentions moderation, and a 1:1 recreation would silently
drop a real, named room.

```
reference/extracted/android/118_Mobile_Lang_EN.bin:2666  <source>Jigoku</source>   (1025)
reference/extracted/android/118_Mobile_Lang_EN.bin:2669  If you are here, it means that you have been reported for spamming / cheating / hacking or some other undesirable behavior.\n\nYour character will be released from Hell after a certain duration, based on your infraction.   (1026)
reference/extracted/android/118_Mobile_Lang_EN.bin:2531  <source>Not allowed in hell.</source>   (860)
reference/extracted/android/118_Mobile_Lang_EN.bin:3875  /sendtohell (playername)\n/gotohell   (4349)
```

Sentence length is **variable by infraction**, and while jailed some actions are blocked ("Not
allowed in hell."). The neighbouring GM string 4348 (:3872) is
`/tteleport (territory x) (territory y)` — independent confirmation that the world address space is
a **(territory x, territory y)** pair, matching the on-screen `TERRITORY (24,52) / SECTOR (2,2)`
readout in `reference/frames/session11/stance-reach/B_t855.800_HEAVY_ring_red.png`.

Coverage grep: `"Jigoku"` 0 · `"Not allowed in hell"` 0.

- **artifact:** A2 · **build:** android v0.682 · **verdict:** HELD · **overturns_ledger:** no (omission).

---

## ST-06 — Hard **level gates** on the war room (10), PvP duels (2) and story progress (2, 5). `[A2] [progression / meta-social]`

**Ledger (§4 progression, ready):** *"L1-L10 XP caps; cap 80; unlock cadence."* The *content* gates
those levels open are not in the document.

```
reference/extracted/android/118_Mobile_Lang_EN.bin:938   You must be level 10 or higher to access the war room   (320)
reference/extracted/android/118_Mobile_Lang_EN.bin:941   Congratulations! You are now level 10 and are able to join the war room.\nFighting for a clan is a good way to earn coins, equipment and even gold.  (321)
reference/extracted/android/118_Mobile_Lang_EN.bin:1952  You must be level 2 or higher to duel with other players.   (667)
reference/extracted/android/118_Mobile_Lang_EN.bin:2645  You need to be level 2 or higher to proceed to the next area. Why don't you try duelling?   (1018)
reference/extracted/android/118_Mobile_Lang_EN.bin:2648  You need to be level 5 or higher to proceed to the next area.   (1019)
```

Note what 321 also asserts: the war room is a **coin, equipment and gold** faucet — a third
independent witness for meta-social blocker ④ ("offline gold faucet rate"), alongside string 372's
*"the clan will pay the player 5 coins per move made"* (already banked as
`meta-social/clan-pays-5-coins-per-move`). And 1018 shows the early campaign **funnels the player
into PvP** as a levelling path, which is why the duel gate sits at 2.

Coverage grep: `"level 10 or higher to access the war room"` 0 · `"level 2 or higher to duel"` 0.

- **artifact:** A2 · **build:** android v0.682 · **verdict:** HELD · **overturns_ledger:** no (omission).

---

## ST-07 — **Piercing Damage** is a displayed damage channel the ledger's combat model does not have. `[A2] [combat-core / items-equipment]`

**Ledger (§4 combat-core, ready):** *"damage formula ((ATK+Wpn)×stance, crit 1.3×, Heavy def ×0.8)"* —
one physical channel, one crit multiplier. The stat-label block says otherwise:

```
reference/extracted/android/118_Mobile_Lang_EN.bin:2573  <source>Critical Damage</source>   (875)
reference/extracted/android/118_Mobile_Lang_EN.bin:2576  <source>Piercing Damage</source>   (876)
reference/extracted/android/118_Mobile_Lang_EN.bin:2561-2570  Fire DEF / Wind DEF / Water DEF / Earth DEF   (871-874)
reference/extracted/android/118_Mobile_Lang_EN.bin:1472-1481 Fire ATK / Wind ATK / Water ATK / Earth ATK   (507-510)
```

These sit in the same contiguous run as the elemental ATK/DEF labels, i.e. they are **item/character
stat rows rendered in a stat panel**, not combat-log verbs — `Critical Hit` (175, :533) is the
separate combat-log string. So the shipped stat vocabulary is: ATK, DEF, SPD, four elemental ATKs,
four elemental DEFs, **Critical Damage** and **Piercing Damage**. A recreation building only
`(ATK+Wpn)×stance` will have no home for two of those.

Coverage grep: `"Piercing Damage"` 0 · `"Critical Damage"` 0 · `"Fire DEF"` 0.

- **artifact:** A2 · **build:** android v0.682 — **NOT** cross-checked against v0.717; a stat panel
  is exactly the kind of surface that could differ between builds. · **verdict:** PARTIAL — the
  *label* is held, the channel's arithmetic is not.
- **overturns_ledger:** no, but it widens combat-core's "ready" claim into an under-claim.

---

## ST-08 — The skill card's complete field set, including **six targeting modes**. `[A2] [ui-hud blocker ⑤ / skills-meters]`

**Ledger (§4 ui-hud, blockers):** *"⑤ pause/options/dialogue-box exact metrics."* The skill panel
isn't even on the blocker list, yet it is the densest data screen in the game. Its full label
inventory is in the table, in one contiguous run:

```
reference/extracted/android/118_Mobile_Lang_EN.bin:380  Level Required          (124)
reference/extracted/android/118_Mobile_Lang_EN.bin:383  Stance Restriction      (125)
reference/extracted/android/118_Mobile_Lang_EN.bin:386  Timer:                  (126)
reference/extracted/android/118_Mobile_Lang_EN.bin:482  Required Skill Points   (158)
reference/extracted/android/118_Mobile_Lang_EN.bin:485  Max Level               (159)
reference/extracted/android/118_Mobile_Lang_EN.bin:488  Passive Skill           (160)
reference/extracted/android/118_Mobile_Lang_EN.bin:491  Target: Self            (161)
reference/extracted/android/118_Mobile_Lang_EN.bin:494  Target: Enemy           (162)
reference/extracted/android/118_Mobile_Lang_EN.bin:497  Target: Ally            (163)
reference/extracted/android/118_Mobile_Lang_EN.bin:500  Target: Enemy Area Effect  (164)
reference/extracted/android/118_Mobile_Lang_EN.bin:503  Target: Ally Area Effect   (165)
reference/extracted/android/118_Mobile_Lang_EN.bin:506  Target: All             (166)
reference/extracted/android/118_Mobile_Lang_EN.bin:509  Chi Cost                (167)
reference/extracted/android/118_Mobile_Lang_EN.bin:1892 Cooldown                (647)
reference/extracted/android/118_Mobile_Lang_EN.bin:1895 sec                     (648)
```

**Six targeting modes** — Self, Enemy, Ally, Enemy-AoE, Ally-AoE, All — means the skill schema has a
target-class enum with an **ally** branch, which is a co-op/clan-combat affordance the single-player
ledger never accounts for. Cooldowns are rendered in **seconds**, not frames (648).
I deliberately do **not** claim `Stance Restriction` is live: `items-equipment/stancerestriction-is-dead-data`
is already banked showing the item-side field is dead; whether the skill-side one is live is unproven here.

Coverage grep: `"Target: Enemy Area Effect"` 0 · `"Max Level"` 1 (unrelated).

- **artifact:** A2 · **build:** android v0.682 · **verdict:** HELD (labels) / PARTIAL (semantics)
- **overturns_ledger:** no (omission — the skill card is missing from ui-hud's blocker list entirely).

---

## ST-09 — Skill **usage grammar**: PvP bans, charge-cancel, and drag-to-target. `[A2] [skills-meters]`

These are rule statements, not numbers, and they are the kind of thing a rebuild gets wrong silently.

```
reference/extracted/android/118_Mobile_Lang_EN.bin:4817  Creates a clone to distract your enemy.\n\nThis skill cannot be used in PvP rooms.   (6111 Shadow Clone)
reference/extracted/android/118_Mobile_Lang_EN.bin:4829  Create multiple clones that can attack your enemy.\n\nThis skill cannot be used in PvP rooms.  (6115 Mass Shadow Clone)
reference/extracted/android/118_Mobile_Lang_EN.bin:4781  Shoots a charged projectile from your blade.\n\nHold down the skill icon to increase the damage it inflicts.\n\nGetting hit while charging will cancel the skill.  (6099 Charged Shot)
reference/extracted/android/118_Mobile_Lang_EN.bin:4784  Calls down a mystical sword from the heavens.\n\nDrag and drop skill icon to select target location.  (6100 Heavenly Sword)
reference/extracted/android/118_Mobile_Lang_EN.bin:4793  Short burst of speed.\n\nInterchangable with Dash Left Skill if you drag and drop skill icon to select direction.  (6103 Dash Right)
```

Three distinct input verbs exist on one hotbar button: **tap**, **hold-to-charge** (6085-6087, 6099)
and **drag-and-drop to place/aim** (6100, 6103/6105). The charge verb has an **interrupt rule**
(taking a hit cancels it and, by implication, refunds nothing). And two skills carry an explicit
**mode ban** — a PvP/PvE capability split the ledger's skills-meters entry does not model.

Coverage grep: `"cannot be used in PvP rooms"` 0 · `"Getting hit while charging"` 0 ·
`"Drag and drop skill icon"` 0. (`"Hold down the skill icon"` 2 hits — the ultimate-technique half
is already banked; the cancel and drag rules are not.)

- **artifact:** A2 · **build:** android v0.682 · **verdict:** HELD · **overturns_ledger:** no (omission).

---

## ST-10 — AUTO SLASH is a **hands-off auto-attack**, described by the game as muscle memory. `[A2] [combat-core]`

**Ledger (§1 known-unknowns):** *"AUTO SLASH cadence."* The cadence is still unheld — but the
*semantics* were never stated either, and the tutorial states them:

```
reference/extracted/android/118_Mobile_Lang_EN.bin:7589  Try turning autoslash on. Your body will move with muscle memory while you can focus on activating your skills.   (IDS_Q50S6NODE1)
reference/extracted/android/118_Mobile_Lang_EN.bin:1808  Auto Slash Off   (619)
reference/extracted/android/118_Mobile_Lang_EN.bin:1811  Auto Slash On    (620)
```

So AUTO SLASH is **not** an aim-assist on a player-drawn line — the character attacks on its own and
the player's hands move to the skill bar. That is a different control mode, and it is the reason the
mode exists on a **touch** build. The cadence number is still STILL_UNHELD (see ST-16).

Coverage grep: `"muscle memory"` 0.

- **artifact:** A2 · **build:** android v0.682 — the mode also exists in the web HUD (`Auto Slash`
  toggle), but the tutorial wording is Android-only. · **verdict:** PARTIAL · **overturns_ledger:** no.

---

## ST-11 — Offline duel opponents are **computer-controlled copies of real players** — which explains the "PvP-duel dummy" the ledger flags as wrong. `[A2] [enemies-ai]`

**Ledger (§4 enemies-ai, surface):** *"the shipped `AI_TIERS`/`ENEMY_BASE` are a **PvP-duel dummy**
(hp 150), not the ~1-HP-chip field trash the video shows."* The ledger treats this as a mislabelling
in our config. It is not — the original really does have a second, separate combatant class:

```
reference/extracted/android/118_Mobile_Lang_EN.bin:7601  If your opponent is online, you will duel him live. If your opponent is offline, his samurai will be controlled by the computer.   (IDS_Q50S7NODE2)
reference/extracted/android/118_Mobile_Lang_EN.bin:1358  <source>Fight AI</source>   (469)
```

An offline duel is fought against an **AI driving another player's real stat block** — hence a
~150 HP opponent with player-grade gear, sitting in the same game as one-hit field trash. Our
`AI_TIERS` is not a mislabel; it is the *duel* profile, and both profiles must exist. String 469
`Fight AI` is the explicit menu affordance.

Coverage grep: `"controlled by the computer"` 0.

- **artifact:** A2 · **build:** android v0.682 · **verdict:** HELD
- **overturns_ledger:** yes — the surface bullet's implication ("not the field trash", i.e. wrong
  data) is half wrong: it is the *right* data for the *other* combat mode the ledger omits.

---

## ST-12 — Carrying weight is not an inventory cap; it **gates travel**. `[A2] [items-equipment / world-exploration]`

**Ledger (§4 items-equipment, ready):** *"weight cap 100"* — presented as a container limit.

```
reference/extracted/android/118_Mobile_Lang_EN.bin:422  You are carrying too many things to travel.\n\nUpgrade the Carrying Weight+ skill to carry more items.   (138)
```

Over-weight does not block pickup; it blocks **travel**, which makes weight a world-traversal
resource and makes `Carrying Weight+` (base 100, +20/level to 300 — banked at
`sources/skilldata.md:526`) a mobility skill, not a convenience skill. The stables (525/526,
:1526/:1529) and the `Carrying:` field (527, :1532) sit in the same loop.

Coverage grep: `"carrying too many things to travel"` 0.

- **artifact:** A2 · **build:** android v0.682 · **verdict:** HELD · **overturns_ledger:** no
  (it re-characterises a "ready" item rather than contradicting a number).

---

## ST-13 — The inn restores HP, Chi and **at most one third of max AP**. `[A2] [world-exploration]`

Blocker ④ ("AP regen rate + cap") is already closed elsewhere at 1 AP / 60 s
(`systems/economy.md:346`). This is a **second, independent AP faucet** with a hard fractional cap
that the banked work does not carry:

```
reference/extracted/android/118_Mobile_Lang_EN.bin:1487  Welcome Samurai-dono!\nYou can rest here to replenish your health, chi and up to a third of your maximum AP.   (512)
```

"**up to a third**" is a ceiling, not a top-up: an inn rest can never fully refill AP, which is what
keeps Soldier Pills (4172, :3344 *"Replenish your AP without waiting!"*) and the 1-gold AP purchase
(100, :308 *"10 more AP for 1 Gold"*) commercially viable. Camping (128, :395) and `Rest` (204/205)
are separate verbs whose AP behaviour is **not** stated here.

Coverage grep: `"third of your maximum AP"` 0.

- **artifact:** A2 · **build:** android v0.682 · **verdict:** HELD · **overturns_ledger:** no.

---

## ST-14 — The stance→portrait-ring colours are named in the game's own tutorial copy, and **three v0.717 frames agree**. `[A2 + A1] [ui-hud] [STRENGTHENS `ui-hud/stance-ring-colours-exact`]`

This **strengthens**, it does not duplicate. The banked claim
(`docs/gauntlet/L0/citelint.json` → `ui-hud/stance-ring-colours-exact`) rests on
`reference/extracted/sprites/DefineSprite_3394_shs3_fla.stancecolor1_56/1-3.png` plus
`BattleUI.as` — i.e. **frame index → colour**. It does not, by itself, bind an index to a *stance
name*. The tutorial string does, in words:

```
reference/extracted/android/118_Mobile_Lang_EN.bin:7544  Your stance is indicated by the color of the circle around your portrait: Light stance - blue, Balanced stance - brown, Heavy stance - red.   (IDS_Q50S3NODE1)
```

**I opened the frames and looked** (crop `200×170+10+915` of the 1920×1080 frame — the portrait ring
sits bottom-left of the overworld HUD — then upscaled ×4, lanczos):

- `reference/frames/session11/stance-reach/B_t851.867_LIGHT_ring_blue_CHANGE-STANCE_tooltip.png` —
  visibly a **violet-blue** annulus around the straw-hat bust, `CHANGE STAN…` caption beneath.
- `reference/frames/session11/stance-reach/B_t851.933_BALANCED_ring_tan_one-tick-after-click.png` —
  the same annulus one tick later, **tan / olive-brown**.
- `reference/frames/session11/stance-reach/B_t855.800_HEAVY_ring_red.png` — **saturated red**, and
  the frame's own HUD caption reads `HEAVY STANCE`.

**Where the doc and the frame disagree, the frame wins — and here they very nearly agree.** The
designer's word is "brown"; what is actually on screen is a **desaturated tan** (the frame filename
independently calls it `ring_tan`). Take the frame as authoritative on the hue and the string as
authoritative on the *mapping*. Because the string is v0.682 and the frames are v0.717 longplay,
this is also a **cross-build parity check that passes** — a rare one for a UI surface.

Coverage grep: `"Light stance - blue"` 0 hits (the colour *mapping sentence* was never quoted).

- **artifact:** A2 (string) + A1 (three frames) · **build:** string android v0.682, frames web
  v0.717 · **verdict:** HELD · **overturns_ledger:** no — it upgrades the ledger's
  §4 ui-hud surface bullet *"portrait ring is stance-colored, not fixed red"* from a direction to an
  exact, cross-build-confirmed table.

---

## ST-15 — The war **turn** is clock-driven, and the game says both "turn" and "hour" on purpose. `[A2] [meta-social] [STRENGTHENS `meta-social` per-turn reconciliation]`

**Ledger (§4 meta-social, surface):** *"'moves per turn' reconciles as 'per hour' (36 = Private's
rank threshold, not a turn cap)."* A banked critic
(`docs/gauntlet/L0/critics/meta-social.precedence.md:212`) already used string 372 to show the game
says *"Each turn…"*. The missing half — proof the turn is a **countdown**, not a player action — is
string 309:

```
reference/extracted/android/118_Mobile_Lang_EN.bin:905   <source>Next turn in </source>     (309)
reference/extracted/android/118_Mobile_Lang_EN.bin:965   <source> moves a turn</source>     (329)
reference/extracted/android/118_Mobile_Lang_EN.bin:1136  Rankings will be updated every hour   (395)
reference/extracted/android/118_Mobile_Lang_EN.bin:1079  - use the "deploy troops" action to increase the number of troops in a sector.\n\n- Troops will advance on enemy sectors every 24 hours. …   (376)
```

`Next turn in ` takes a duration argument, so a "turn" is a **timed refill window**, and both the
ledger's "per hour" and the wiki's "per turn" are correct descriptions of the same clock. Three
distinct real-world periods are named in the copy: a turn refill, an **hourly** ranking tick, and a
**24-hour** troop advance.

Coverage grep: `"Next turn in"` 0 · `"Rankings will be updated every hour"` 0 · `"Moves made"` 0.

- **artifact:** A2 · **build:** android v0.682 · **verdict:** PARTIAL (the turn *length* is still
  unheld — the string only proves it is a timer) · **overturns_ledger:** no.

---

## ST-16 — STILL_UNHELD: the string table contains **no Chi cost and no cooldown number** for any skill. `[STILL_UNHELD] [skills-meters blocker ①]`

**Ledger (§4 skills-meters, blockers):** *"① every other skill's Chi cost + cooldown (Smoke Bomb,
Kunai chi, Lay Trap, elemental)."*

I pattern-hunted the entire 2,533-entry table for cost/cooldown prose: every `%`, every `sec`, every
`chi`, every `cooldown`, every digit-bearing string. The 7000-block gives per-level **effects**
(damage, duration, dodge %, capacity) — `7067` is literally the word *"Reduced cooldown"* with no
number — and 167/647/648 are bare **labels** (`Chi Cost`, `Cooldown`, `sec`). **The numbers live in
`skilldata.xml`'s `<chi>` and `<cooldown>` tags, not in the language file.** The string table cannot
close this blocker and I will not pretend it can.

- **artifact:** STILL_UNHELD · **cite:** none · **verdict:** STILL_UNHELD

---

## ST-17 — STILL_UNHELD: the six condition tiers are named, but **no condition→damage multiplier exists in prose**. `[STILL_UNHELD] [items-equipment blocker ②]`

**Ledger (§4 items-equipment, blockers):** *"② condition→DMG **multiplier** (current 'evidence'
confounds condition with a 2-level gap)."*

The table names the ladder — `Condition: Broken / Poor / Used / Usable / Good / Well-Maintained`
(387-392, `118_Mobile_Lang_EN.bin:1112-1127`) — and names the two repair consumables and their
descriptions: `Whet Stone` (4141, :3251) / *"Use this to improve the condition of your equipped
weapon."* (4142, :3254), and `Sword Repair Kit` (4143, :3257) / *"…improve the condition of your
equipped weapon **significantly**."* (4144, :3260). It states **no coefficient anywhere**.
Whatever multiplier exists is in code, not copy. (`items-equipment/condition-blocker-dead-in-both-builds`
is already banked from the AS3 side; nothing in the string table strengthens or contradicts it.)

- **artifact:** STILL_UNHELD · **cite:** none · **verdict:** STILL_UNHELD

---

## §Z — Read, verified, and DELIBERATELY NOT re-claimed (already banked)

Listed so the omissions do not read as gaps. Each was opened and matched against the banked corpus:

| String(s) | Content | Already banked as |
|---|---|---|
| 6001 / 6003 / 6005 | stance triangle + `Defense -20%` | `combat-core/stance-triangle`, `combat-core` §15 |
| IDS_Q50S3NODE2 | "Balanced is effective against Light…" | same triangle claim |
| 455-467, 8041-8044, 8121-8124 | Dan ladder 初段-十段 + Renshi/Kyoshi/Hanshi | `rebirth/dan-romaji-ladder`, `rebirth-elements.md:71-134` |
| 610 | rebirth prompt, "Slash length and bank storage…" | `rebirth-elements.md:271-296`, `progression/slash-length-settles-balanced-reach` |
| 6142-6146, 7034-7057 | elemental 150% AoE, 80-120% ladders | `rebirth-elements.md:183`, `skills-meters.md:728` |
| 7004-7006 | roll dodge 60/80/100 % | `skills-meters/roll-dodge-is-75-85-95-in-web` (web diverges) |
| 7009-7013, 7014-7033 | skill slots 4-8, carry weight 120-300 | `skills-meters/skill-slot-base-is-web-sourced`, `sources/skilldata.md:526` |
| 263-266, 262 | 15m/1h/6h/12h seeds, rot | `world-exploration.md:748` |
| 536, 843-844, 861-862 | day rollover, 10/30-day prize ladder | `world-exploration.md` WX-12, `meta-social.md:216-217` |
| 372, 376, 378, 380 | six war-room rule pages, 5 c/move, 500 c donation | `meta-social/clan-pays-5-coins-per-move`, `critics/meta-social.precedence.md:212` |
| 393, 848 | weapon-broken copy, repair cost | `actionscript/repair-cost-is-two-consumables`, `items-equipment/repair-weapon-cost-held` |
| 609, 4266-4267 | 1 gold → 1000 coins | `economy/2208-is-the-gold-to-coin-sku` |
| 879 | town toll | `economy.md:479,486` (`getNodeLevel`) |
| 4131/4137, 4130/4136 | Level 10 Scroll, Amnesia Scroll | `progression/level-10-scroll-xp-item`, `progression/respec-is-premium-gated` |
| 1036 + 8111-8113 | daily trap challenge | `sources/bindata.md:654` (TrapRoomData, daily rotation) |
| 303 + IDS_Q49* | Survival Mode | `meta-social/survivalmode-web-android-diverge`, Stage-0 S0-1 |
| 767-768, 702-703 | world-map level colour legend | `meta-social/world-map-tiers-and-level-gating` |
| 4132-4135, 4229-4230 | 150 % / 200 % potato buffs | `ui-hud/150-percent-damage-is-a-buff` |
| 9000-9010, IDS_Q*NODE* | verbatim story dialogue | `sources/questdata.md` Q-01 (§6 line already overturned) |

---

## COVERAGE — what I did NOT open, and why (§3: no silent caps)

**Fully read, line by line:** all 2,555 `<trans-unit>` records of
`reference/extracted/android/118_Mobile_Lang_EN.bin`, via a flattened `line / id / resname / text`
dump. No truncation, no sampling. Every record was eyeballed at least once; the numeric-content
records (`%`, digits, `sec`, `per`, `increase`, `chi`, `focus`, `AP`, `dan`, stance names) were read
twice.

**Read but not exhaustively mined:** the 640 `IDS_*` quest-dialogue records (≈ lines 5726-7670).
I read the tutorial arc (`IDS_Q49*`, `IDS_Q50*`, `IDS_Q51*`) in full because tutorial copy states
rules, and skimmed the rest for mechanic-bearing sentences. I did **not** do a narrative pass:
`docs/gauntlet/L0/sources/questdata.md` already owns that surface and has 40,119 words of it banked.

**Opened for cross-check only:** `reference/extracted/android/114_Mobile_AchievementData.bin`
(full, 553 lines, to bound ST-01) and three `reference/frames/session11/stance-reach/` PNGs
(cropped and upscaled, for ST-14).

**NOT opened:**
- `reference/extracted/android/{113_Mobile_MusicResource,115_Mobile_SHS3Resource,120_Mobile_BGResource,122_Mobile_SoundResource,124_Mobile_ImageResource}.bin` — nested `CWS` compressed SWFs, per Stage-0 S0-5 they are **held but encrypted** and outside this unit.
- `reference/extracted/payload.xml` (329 MB) and the AS3 bundles — other units own them; I cite
  banked AS3 findings rather than re-deriving them.
- Any **web v0.717** string source. This is the central limitation of this sweep: **every claim above
  is Android v0.682 unless it carries a frame cite.** `meta-social/android-string-table-is-not-v0717s-copy`
  and `meta-social/web-lang-is-network-loaded` are already banked — the web build fetches its language
  file over the network and that file is dead. So for most of ST-01…ST-13 there is **no way to
  establish v0.717 parity from documents**, and I have not claimed it. ST-14 is the one exception,
  because the frames carry it.
- I did not attempt to close skills-meters blocker ① or items-equipment blocker ② — see ST-16/ST-17,
  reported honestly as STILL_UNHELD rather than stretched.
