# SYNTHESIS — SHS:Duels reference-video study

**Sources:** two FlashGamesArchive longplays of the original Flash build **v0.717**
(login footer, A-00) — video A = PART 1 (69m45s), video B = PART 2 (65m51s).
**Evidence base:** 61 dense segment notes in `segments/` (A-00…A-30, B-00…B-29),
each ending `## VERIFIED`, every numeric claim cited to a frame timestamp. Chapter
maps: `A-MAP.md`, `B-MAP.md`. This file is the **organized catalogue + index**;
the segment files are the evidence record. Cite style here: `(A-02 t=7:05)`.

**Coverage discipline:** coverage starts at **0:00** — `A-00` densely covers
video A 0:00–2:57 (login page at t=0:00, loading, intro, first fights); the
`A-MAP.md` chapter list intentionally starts at 3:00 because of that. The main
sweep then studied 48 slices (every high-priority chapter in both maps); a
follow-up tranche studied 12 more dropped slices that held new mechanics. 28
map slices were deliberately skipped as repetitive grind/travel/outros — list
at the bottom. Videos have no commentary; all findings
are frame-visual only (no audio evidence).

**Trust rule (from A-00):** this March-2020 longplay of v0.717 is *newer* than the
v0.715 patch notes and 2014-era wiki pages behind `../original-game-facts.md` — on
conflict, prefer the video.

---

## 1. Mechanics catalogue

### 1.1 Combat core (→ Stage 1–2)

- **Input is draw-a-line slash** from the very first fight: tutorial overlay "DRAW
  A LINE TO SLASH" with dashed red demo line (A-00 t=1:18); a red directional
  stroke renders at attack moment (A-02 t=6:52). The same gesture+combo system is
  reused for the harvest minigame on non-combat targets (B-02 t=03:10).
- **AUTO SLASH toggle** ("AUTO SLASH OFF") is a persistent combat-HUD element in
  every combat frame across both videos (A-02, A-14, B-10, B-16…) — an auto-attack
  assist exists, default off.
- **Three stances**, named+colored: **Light=Blue, Balanced=Brown, Heavy=Red**,
  shown as a colored ring around the player portrait (A-02 t=7:00; ring colors
  re-confirmed Light=blue / Heavy=red in B-24). Research triangle
  Light>Heavy>Balanced>Light not contradicted (not directly observable).
- **Stance switching is an instant, no-cooldown out-of-combat toggle** on the
  bottom-HUD yin-yang icon (Light→Heavy swapped 3 s apart, B-24 t=14:11/14:14);
  the chosen stance **persists across fights and zones** (B-25). Stance choice
  matters: the same NPC duel was lost in Light with a weak sword, then won in
  Heavy with a better blade (B-24).
- **Stance lock in combat:** the label swaps to **"CANNOT CHANGE STANCE"** the
  instant a fight starts — a hard lock, not a meter/cooldown (B-24) — and during
  tutorial scripted attacks, harvest minigame, and duels (A-02, B-21, B-02,
  B-23 — universal). ⚠ This is bigger than the spec's "switch stances mid-duel
  via Focus meter" framing — see §6 contradictions.
- **Hit-combo counter:** big red numeral + "HIT COMBO" plate, top-right, only in
  live combat (not scripted dummy kills, A-02). Resets to **1, not 0**, per kill
  (B-11, B-21); breaks on taking damage (A-12 t=25:14) and on gaps in the hit
  chain (B-19); also resets when a mook fight hands off to a boss duel (11 → 1,
  B-28). Observed peaks: 5–11 (B-11 7, B-19 9, B-13 8, B-26 11).
- **Chi skills** (hotbar = 3 slots, mirrored in Skills screen "SKILLS EQUIPPED"):
  | Skill | L1 | L2 | Chi | Cooldown | Note |
  |---|---|---|---|---|---|
  | Chi Punch | 10 dmg | 20 dmg | 2 | 4.96 s (both) | L2 costs 2 SP (A-02 t=7:05) |
  | Throw Kunai | 20 dmg | 40 dmg | ? | 1.96 s (both) | 2 SP rank-up; LEVEL REQUIRED: 10 gate (B-21 t=56:19, B-07) |
  | Focus | — | — | 5 | 9.92 s → 8.92 s | −1.00 s per level, cost flat (A-21) |
  | Dash L / Dash R | — | — | 2 | 3.92 s | same stats, drag-and-drop one slot — model as one skill + direction (B-07) |
  | Lay Trap | 20 dmg | — | ? | 4.92 s | requires Level 15 **+ Throw Kunai prerequisite** — skill-tree prereq chains exist (A-28) |
  Cooldowns all end in .92/.96 — frame-quantized values; keep the pattern in mind
  when picking config values.
- **Passives:** Critical Evade (Light tree): "evade attacks while slashing in this
  stance when your Focus Bar is full" — names a **Focus Bar** resource (A-03).
  Heavy Stance Mastery: +slash range, **−20% defense while heavy-stanced**,
  effective vs balanced (A-14) — corroborates research's defense-×0.8 framing of
  the heavy penalty (apply ONE penalty form, never both — Stage 2 landmine).
- **Skill costs:** learn L1 = 1 SP (Critical Evade, A-03); rank-ups usually 2 SP
  (Chi Punch L2, Kunai L2, Focus L2, Balanced Mastery L2→L3 — A-02, A-21, A-06)
  **but Heavy Stance Mastery L1→L2 costs only 1 SP** (A-14) — rank-up cost varies
  per skill, don't encode a flat 2. Skills screen: 6 top-level categories,
  ~6 nodes each, CATEGORIES back button.
- **Enemy presentation:** nameplate "NAME (LEVEL)" — "JINBEI (3)" (A-00),
  "BANDIT LEADER (6)" red tag (A-11), "INOKICHI (8)" read as gold small-caps
  (A-23) — tag color varies by read, verify at Stage 2; green HP bars overhead;
  level shown, HP not.
- **Encounter banners are one template family:** FIGHT! / VS / YOU WIN / YOU WERE
  DEFEATED all share the brush-font red-splatter treatment (A-11) — build ONE
  reusable match-banner component. VS card (named duels) = red cracked "VS" glyph,
  player portrait left (yellow), enemy right (white) (B-23).
- **Combat pacing (PvE, level-parity):** trash mobs resolve in **3–10 s**
  (B-00 3–6 s, B-13 5–10 s, A-15 3-hit near-instant); multi-enemy brawls 8–50 s;
  bosses/minibosses 15–25 s (B-14 Bandit Leader 15–17 s, A-22 fatal fight 22 s).
  The spec harness's ~24.7 s median duel is a *boss/PvP* number — PvE trash must
  feel arcade-fast (Stage 2 tuning input).
- **Ranged enemies:** archers chip ~1 HP per landed arrow, visible projectile arc
  (A-10); wolves also ~1 HP per hit (A-30). A bandit throws a hammer mid-fight
  (A-00) — thrown-object projectiles exist in PvE. ⚠ Archer close-up moveset was
  NEVER capturable — the A-25 follow-up window opens on the finishing blow;
  only a drawn-bow silhouette + diagonal arrow-trail sprite exist on film.
  Recreate archer behavior from A-10's chip-damage observations + spec, labeled
  INFERRED.
- **Damage feedback:** floating damage numbers (read red at 54 under a 150%
  buff in B-10, white in A-25 — color varies by context, verify at Stage 2);
  low-HP full-screen **red vignette** that intensifies as HP drops (A-11, A-16 —
  a damage/low-HP overlay, NOT sunset lighting); combat scenes additionally
  carry a persistent warm/red tint separate from the low-HP ramp (A-30);
  near-death hard red flash (B-07). Post-combat/passive HP regen ticks exist
  (12/30 → 14/30 shortly after a win, B-29).
- **Death & respawn:** death = hard cut to flat dark-red screen, black silhouette
  tableau (~3 s), then "YOU WERE DEFEATED!" with **LEAVE AREA / FREE RESPAWN**
  (A-22, B-03, A-12). Free Respawn: instant, costs nothing, full heal, returns to
  the **encounter-trigger checkpoint** (not a dungeon reload; not last position)
  (A-22 t=56:02, A-20). No coin/XP/item penalty observed (INFERRED — no counter
  moved). LEAVE AREA branch never observed — open question.
- **Encounter retry resets fully:** player back at max HP/CHI on re-trigger
  (A-23); boss HP bar did NOT appear reset after one player death (A-11) —
  conflicting observations, flag for Stage 2 decision.
- **Duels top up player HP to full pre-fight** (VS card fights), while trash
  fights don't (A-16, single observation — INFERRED).
- **Win condition is enemy HP = 0 regardless of player HP** — clutch win at 5/20
  observed (A-23).
- **Spawn invulnerability** (research: 5 s + blinking indicator, v0.715 patch
  notes) — not directly observable in these PvE videos; keep as research-CONTRACT.

### 1.2 Player model & progression (→ Stage 3)

- **Resource triad: HP (green) / CHI (blue) / AP (pale gold)** — three distinct
  pools on the Player sheet (A-00, B-22 "HP 20/30, CHI 47/47, AP 30/40"). **AP is
  never rendered on the overworld HUD** — only HP + CHI + stance are; AP lives in
  the Player▸Stats menu (B-29) — a deliberate original design choice to keep or
  improve. Possible passive AP regen (27/40 → 28/40 over ~10 s idle, B-29 —
  INFERRED, n=2). ⚠ Several segment notes call the blue bar "stamina", "stance
  meter", or even "HP" — reconciled: it is **CHI** (grows 10→15→20→26→31→47 with
  stat points; see §6).
- **Guest start (L1):** 100 coins, 3 gold, HP 10, CHI 10, AP 30, ATK 1, DEF 1,
  branch weapon, weight 14/100 (A-00; starter clothes render as a grey gi + white
  pants — research's "torn garments" matches the Level-1 "Torn Garment"/"Torn
  Pants" items seen owned later, A-17/A-15). SPD 1 is INFERRED by symmetry —
  only ATK 1 and DEF 1 were read directly on-screen (A-00).
- **Level-up: +3 stat points, +1 skill point** — modal-confirmed (A-00, A-06,
  A-21, B-19) and matches research + spec. Full refill on level-up per research.
- **XP thresholds are cumulative bar caps.** Observed table (cap to finish level):
  | Level | XP cap | Growth |
  |---|---|---|
  | 1 | 550 | — (A-00) |
  | 2 | 1,450 | ×2.64 (A-01) |
  | 3 | 2,950 | ×2.03 (A-03) |
  | 4 | 5,150 | ×1.75 (A-06) |
  | 5 | 8,350 | ×1.62 (A-14) |
  | 6 | 12,150 | ×1.46 (A-21) |
  | 7 | 16,350 | ×1.35 (B-04; B-05 once showed 15,350 — single-frame read anomaly) |
  | 8 | 20,900 | ×1.28 (B-08) |
  | 9 | 25,900 | ×1.24 (B-18) |
  | 10 | 31,400 | ×1.21 (B-22) |
  Growth ratio decays smoothly toward ~1.2 — fit a curve for config
  `XP_THRESHOLDS`, don't hardcode a flat multiplier. (New config territory.)
  Known display glitch: +200 XP reward rendered 787/1450 → 9987/1450 (A-01) —
  upstream bug, do not replicate.
- **Stat-point effects:** CHI +5 per point (A-06); HP +10 max per point (A-00,
  single sample); ATK/DEF/SPD observed at **+3 per point** in A-14 but **+1 per
  point (ATK/DEF) and +3 (SPD)** in A-21 — CONTRADICTORY samples, needs a decision
  at Stage 3 (see §6).
- **Kill XP has no flat formula.** Samples: 53 (3 bandits, L1), 66, 96, 100, 110,
  112, 123, 125 (×2 identical), 132, 140, 160, 164, 170, 280, 286, 304, 416, 420,
  444, 510, 864. Named enemies pay ~4.6× a same-level generic (Jinbei 304 vs
  Bandit 66, A-16 — INFERRED, n=1). Research's "10 XP/foe-level" stays
  unverifiable; treat spec's KILL_REWARD as INFERRED tuning.
- **Level cap 80 corroborated:** Rebirth Scroll requires Level 80 (A-17) — meshes
  with research's "80 SP first run, level cap 80".
- **Rebirth (New Game+):** Rebirth Scroll costs 1,000 coins: "progress to next Dan
  rank, specialize in an element", grants +25 gold (A-17) — video **confirms** the
  research model (elemental specialization + 25-gold schedule) and **re-confirms
  the spec's flat "+10 Attack" is wrong**. Supports MAX_DAN_RANK=10 default.

### 1.3 Items & equipment (→ Stage 3)

- **Paperdoll: 9 slots** — Hat, Mask, Garment, Gloves, Pants, Weapon, Ring L,
  Ring R, Sandals; center sprite live-updates on equip, instant swap (A-13).
- **Canonical ItemStats shape** (union of observed stat lines): DMG range,
  DEFENSE, per-element ATK (Water/Wind/Earth in B-14/B-09; Fire in A-17, A-27,
  B-28), per-element DEF, MAX HP, HP REGEN, MAX CHI, CHI REGEN, CRITICAL DAMAGE,
  PIERCING DAMAGE (B-28), SPEED, WEIGHT, LEVEL REQUIRED,
  CONDITION (B-14, B-09, A-13, A-23). Item cards show **"(EQ: n)"** — the
  currently-equipped item's value per stat, green if better / red otherwise
  (A-13) — signature comparison UX, port it.
- **Rarity border colors:** grey/none=common, green=uncommon, blue=rare,
  purple=epic (B-04); rarity shifts the *stat-pool shape*, not just magnitude
  (rare sandals rolled ATK/SPD/Wind-ATK; common pants rolled flat elemental DEF)
  (A-17).
- **Procedural affix naming:** up to 2 prefixes + 1 suffix — "Blessed Reserved
  Fiery Pants of Crit", "Drafty Sharp Iron Sword of Piercing", "Blessed Sharp
  Iron Sword of Healing" (A-09, A-17, B-18). Quest items reference affixed names.
- **Condition/durability tiers:** UNBREAKABLE / WELL-MAINTAINED / GOOD / USABLE
  observed; condition materially scales displayed DMG (Iron Sabre GOOD L5 6-16 vs
  UNBREAKABLE L7 12-19, B-09); Whet Stone repairs condition (A-17, tooltip
  uncaptured); broken tools re-bought from peddler (A-04). Blacksmith Reinforce
  makes a weapon unbreakable (§1.4).
- **Level-gated equipment:** hard block with red "LEVEL REQUIRED: N" / "YOU ARE
  NOT SKILLED ENOUGH TO USE THIS ITEM" (B-00, B-14, A-21, A-23).
- **Weight system:** cap 100 everywhere. Over-cap is shown in red and **blocks
  travel/fast-travel** (B-04 hard-stuck at 101/100; B-00; B-06 explicit "UPGRADE
  THE CARRYING WEIGHT+ SKILL" popup) but other segments walked zones fine at
  102–121/100 (B-09, B-14, B-18, B-21) — reconciliation: over-cap blocks *some*
  transitions (fast-travel certainly; certain zone/travel actions), never combat.
  Open question — see §6. A "Carrying Weight+" upgradeable skill raises the cap.
- **Consumables:** stack with count badges; Small Rice Ball +10 HP, weight 1
  (A-01); Onigiri instant heal (A-13); Potato Dog buff (§1.4); Dojo Recall Scroll
  "Takes you to the nearest dojo. (Can only be used outdoors.)", weight 1 (B-21).
- **Buffs:** Potato Dog = 150% damage ×~30:00 wall-clock countdown; verbatim rule
  "only one buff may be active at a time" (B-04 t=05:31). The mm:ss timer ticks
  through menus, dialogue, transitions, combat — real-time, never paused
  (B-04, B-08, B-09, B-10, B-11, B-14, B-15 — observed continuously from 29:54
  down to 00:04 across segments). One-buff slot + wall-clock duration = new
  config territory (`BUFFS`).
- **Soul-infused gear:** equipment carries its own level and scales stats via XP
  (Ninja Services context, B-17) — a second progression axis; out of near-term
  scope, log only.
- **DROP ITEM? YES/NO** confirm modal gates all discarding (B-14, B-22).

### 1.4 Economy (→ Stage 3/4)

- **Two main currencies:** Coins (soft, scroll icon, HUD) vs Gold (premium, coin
  icon, Player-sheet + shop screens). Guest starts 100c/3g. Gold sinks:
  fast-travel (5g flat via Quests "TAKE ME THERE" — 8+ independent sightings; one
  B-28 frame read the icon ambiguously, trust the majority), Ninja Services shop
  gear, Writ of Release (25g). Gold sources in original: IAP tiers
  50/125/200/275/400 gold for $4.99–$24.99 + offer walls (B-17), "GET GOLD"
  button on every shop screen. **Our `HAS_CASH_PURCHASE=false` deviation stands**
  (decide-and-flag confirmed; recreation keeps gold as a scarce earned currency).
- **Two niche token currencies:** Duel Tokens (40 held; PvP duel screen, B-07,
  A-25) and Golden Token — tooltip verbatim "USED FOR ENTERING TOURNAMENTS AND
  FOR PLACING FIGHT BETS" (B-27): a tournament/betting economy attached to the
  dojo Tournament Hall. Log-only for now (Stage 4+ flavor).
- **Price anchors** (relative values only — palette-shift discipline applies to
  trade dress, numbers are mechanics): Iron Sword L1 100c · potatoes 5c · rare
  potions 1,000c · rings/cloaks 50–100c · pickaxe 10c (B-09) · Kunai 5c · Sandals
  20c peddler vs 420c city-rare · Pants 450c (A-17) · Rebirth Scroll 1,000c
  (A-17). Sell baselines: Torn Garment 5c, Torn Pants 15c (A-17); worn sandals
  5c, straw hat 5c, iron/training sword 25c, rice ball 1c, bandana 15c, pickaxe
  10c (A-27). Item-weight seed table: rice ball 1 · branch 1 · hat 1 · garment 5
  · sword 5 · shoes 2 · coal 5 · crops 1 · pickaxe 10 · Cleaver 12 (A-26, B-27,
  A-13, B-26).
- **Two vendor tiers:** roadside Peddler (cheap, uncolored stock) vs city
  Merchant (pricier, rarity-bordered stock) (A-17); BUY grid 4×4, vertically
  scrollable, 2+ pages (B-09); menus BUY/SELL/LEAVE.
- **Services:** Inn rest = 8 coins flat, restores HP+Chi+AP (A-07). Town toll =
  7 coins at clan-owned Kakuchi Castle Town, PAY TOLL / LEAVE menu (B-09, B-06).
  Stable horse rental = 14 coins + **5 AP** per trip, two destinations shown
  (B-10). Blacksmith **Forge**: Iron Sword (L7) = 700 coins + 2 Iron Ore — but
  HUD delta was −70 (B-10, unresolved discrepancy, do NOT hardcode); **Reinforce
  Weapon** (→unbreakable) = 5,000 coins + 1 Silver Ore (B-10).
- **Ninja Services hub:** Ninja Shop · Name and Reinforce Weapon · Transfer Item
  Stats · Claim Prizes! · Achievements (B-17). Seasonal cosmetics rotate into the
  shop. Mostly monetization-adjacent meta — recreate the hub as flavor at
  Stage 4+, skip IAP plumbing.
- **Town Prosperity:** a per-town meta-stat granted by quest rewards (+5/+10),
  displayed on the Recent Happenings Board (PROSPERITY 494) alongside a daily
  background sim of mercenary/oni/ronin tallies independent of the player (B-09,
  A-08 — note A-08's board showed the empty state "NO EVENTS RECORDED"; the
  populated tallies are B-09). Some quests also move "Aka Ryu Influence on Town"
  via a separate GLOBAL EFFECT popup (B-23, B-28).

### 1.5 Quests (→ Stage 4)

- **Quest archetypes observed:** story (episodic) · side/fetch · gather · kill ·
  **barter/trade** (auto-converts to a fetch quest if you lack the item, A-09) ·
  **bounty** (board-sourced, proof-item turn-in, A-21/A-23) · **escort** (A-20,
  B-19) · **timed daily** ("expires at the end of the day", multiple) — plus
  repeatable dojo challenges (§1.7).
- **Quest log:** episode tabs (PROLOGUE / EPISODE 1 / …) + per-giver quest lines;
  detail panel = OBJECTIVE (+ recommended level) / LOCATION (zone + Territory,
  Sector coords) / REWARD (XP, coins, Town Prosperity) / red TAKE ME THERE (5g) /
  ABANDON QUEST (A-00, A-08, B-10). **Hard concurrent cap** with blocking message
  "QUEST LOG IS FULL…" — 7 concurrent quests visible when full (B-13, A-21;
  exact cap uncertain, ≥7).
- **Reward bundles** (XP / coins / prosperity): 200/—/— · 250/30/+5 (×2, exact
  HUD-delta match A-29) · 236/35/+5 · 266/20/+5 (full reward line on-screen,
  A-08) · 473/35/+10 · 500/30/+10 · 600/—/— · 750/30/— · 1000/—/— (story, A-24 +
  A-25 exact) (A-01, B-13, A-08, B-16, A-19, B-18). Turn-in flow: GLOBAL EFFECT modal (prosperity) then YOU
  RECEIVED modal (items/XP) (B-18); big turn-ins chain up to 5 modals — kill
  cinematic → reward → dialogue → global effect → reward, each needing OK (B-28).
- **Timed quests fully confirmed (B-28):** journal entry carries "(THIS QUEST
  EXPIRES AT THE END OF THE DAY)" with side-by-side **FINISH QUEST / ABANDON
  QUEST** buttons; the field-offer variant of the same quest shows only a MAYBE
  LATER decline — journal state ≠ offer state.
- **Faction-influence tradeoff (new, B-28 t=58:53):** a bounty turn-in's GLOBAL
  EFFECT modal showed TOWN PROSPERITY +5 **and** "AKA RYU INFLUENCE ON TOWN" +5
  simultaneously — quest completion feeds the clan-war layer, not just the town.
- **Quests auto-chain:** finishing Masatora's mushroom fetch immediately issues
  his next fetch (A-29); the same NPC can also run a separate standalone barter
  offer at his stall (A-29).
- **Completion triggers vary:** the Prologue chapter completes simply by ARRIVING
  at Chikada Town — a location trigger, not a dialogue turn-in (A-25 t=34:45).
- **Escort variance:** A-20's Shimazu Tadako joins as an actual combat ally with
  her own tag; B-19's Masayori vanishes after acceptance and is an abstract
  destination trigger — BOTH patterns exist; pick one per quest at Stage 4.
- **Bounty flow:** board dialog → ACCEPT BOUNTY QUEST (+250 XP on accept, A-21)
  → kill target → trophy QUEST ITEM ("INOKICHI'S CLUB (BROKEN)") → board turn-in
  (A-23). Bounties can be time-limited with named affixed-item rewards (B-18).

### 1.6 World structure (→ Stage 4)

- **Two-tier coordinates:** TERRITORY (X,Y) world grid + SECTOR (x,y) local grid;
  sector increments exactly 1 per screen transition (traced repeatedly: A-09 7
  zones in 50 s, B-08, B-02). Indoors switches the minimap to a compass panel
  labeled "INSIDE SECTOR (x,y)" (A-01, A-20). Minimap outdoor = 6×6 grid, gold
  ornate corners, N/E/S/W edges, building glyphs, "!" objective marker (A-00);
  dashed path-trail render (B-15); padlock/key icons appear on it for locked
  doors (§1.7).
- **World Map screen:** exactly 2 zoom levels (country ↔ territory grid, one
  toggle button); zoomed-out is pannable. Legend verbatim: "GREY TERRITORIES –
  LEVEL TOO LOW" / "RED TERRITORIES – LEVEL TOO HIGH"; icons Village / Town /
  City / Castle Town / Destroyed / Quest (A-08, B-16). Territories have their own
  LEVEL (Nagano (26,52) Level 9; "TERRITORY LEVEL: 6" for Chikada) and can be
  "DIPLOMATIC TERRITORY (CANNOT BE CAPTURED)" (A-21).
- **Zone graph is node-based** with directional signpost exits (W/E/N/S wooden
  posts + footprint waypoint popups), discrete static-camera rooms, not
  continuous scrolling (A-07, B-18, A-19). Districts chain within one sector
  (Merchant District → Main Street → Entertainment District → Gambling Den…)
  (A-18). Transitions: hard black-frame cuts outdoors (B-01); bright horizontal
  wipe inside dojos (B-03).
- **Towns are living:** territory/clan control driven by samurai quest activity —
  towns collapse into bandit ruins if neglected, rise if guarded (Yasuka's
  worldbuilding speech, A-07); Recent Happenings Board shows the daily sim (B-09).

### 1.7 Gathering, AP & interactables (→ Stage 4)

- **AP is the world-interaction budget** (pale-gold third pool, base 30, grows
  to 40 by L10; menu-only, never on the overworld HUD — B-29): observed cost
  table — Pick Silky Herb / Pick Bald Herb / Pick Dried Mushroom **1 AP** ·
  Mine Coal Deposit / Search Pot / Search Bush / Search Rocks **2 AP** · stable
  travel **5 AP** (A-04, A-09, A-15, A-28, B-19, B-29, B-10). Pick Muddy Flower
  appears only as a quest name, its cost never on-screen — 1 AP by pattern,
  INFERRED.
  Pattern: picks 1, searches/mining 2, transport 5. Searches can whiff ("YOU DID
  NOT MANAGE TO FIND ANYTHING", A-15). Inn rest restores AP (A-07); level-up
  refills (research); possible slow passive regen (B-29, INFERRED). New config
  territory: `AP_COSTS`.
- **Mining requires an equipped pickaxe** — hard gate "YOU NEED TO EQUIP A
  PICKAXE" (B-27 t=44:40); coal = weight-5 stacking QUEST ITEM.
- **Gathering trio taught in tutorial order:** mining (Takahasi; instant resolve,
  deliberately trivial, tool durability via pickaxe) → farming (Yuudai; Vegetable
  Patch menu: SOIL GRADE 1, HARVESTED 0/10 per instance, RARE CROPS COLLECTION
  0% — a 6-slot mystery-collection gacha panel) → foraging pickups (A-04, A-05).
  Harvest is the combat slash-gesture reused, combo counter and all (B-02).
  Crops are QUEST-ITEM-tagged inventory, weight 1 — tooltip verbatim "CROPS CAN
  BE SOLD AT THE FARMERS' MARKET IN TOWN." (B-27 t=44:58, B-14).
- **Locked doors + keys are abstract quest-flags, not physical pickups:** the
  minimap shows key + padlock icons (B-14); the padlock flips open once the
  guarding enemy is defeated — no pickup toast/animation exists (A-30
  t=1:07:38); "UNLOCK DOOR" contextual prompt on adjacent approach (A-11, B-21).
  Demon-face sealed door variant in first dungeon (A-11).
- **Environmental puzzles:** castle-gate lever puzzle — locked-gate dialog
  verbatim "THE GATE IS LOCKED. PULL THE LEVERS THAT CONTROL THE GATE TO OPEN
  IT." (B-11). **Ladder traversal is a BUILD action, not a climb:** "BUILD
  LADDER" prompt at the base → player idles while a "BUILDING…" progress bar
  fills (~15–60 s observed; combat can interrupt it) → hard cut to the far side
  (B-11, B-25 — the only ladder in both videos).
- **Trap Challenge** (dojo side-mode, "Daily"): instant-kill hazards (rolling
  boulder; radial ~12-kunai burst), no partial damage, free-respawn retry loop
  (~5–10 s attempts), chest + achievement + gear reward on clear, XP never moves
  (B-03). Recreate as its own scene mode, not the HP-attrition Sim.
- **Dojo hubs** also hold: Tournament Hall (kanji banners 合気道/妙用道場, katana
  racks), Private PvP Room (create/enter by name dialog), sparring, Trap
  Challenge (B-04). Door prompt "GO TO TRAINING HALL" lands in banner
  "TOURNAMENT HALL" — source inconsistency, pick one name (B-04).

### 1.8 Social & meta systems (log-only; mostly out of single-player scope)

- **War Room** (clan war layer): unlocks at **Level 10** (B-19, matches
  research); 5 clan choices — Aka Ryu (NE, Lord Tsuyoshi), Ki Sensu, Aoi Hoiru
  (SW), a green-fist clan (= Midori Ken by research heraldry: encircled yellow
  fist on green), or Random (B-20) — video count matches research's four Great
  Clans + random. 7-page rules tutorial: join battles, attack/defend, build
  structures (Command HQ, Forward Base, Barricades, Tunnels, Towns); **structure
  build = 500 coins per contributing player** (refines research's "500 per-turn
  donation"); Recruit rank = 3 moves/turn, "Moves made: 0/36" cycle counter;
  shared clan resource Crops 402 (+2 HQ) (B-20, B-21). Ki Sensu's card
  duplicates Aka Ryu's NE-domain text — source copy-paste bug, don't replicate.
  Accessible mid-dungeon via HUD icon as a map overlay (B-21).
- **PvP/duels:** VS-card duels vs named NPCs confirmed single-player (B-23,
  A-15); LIVE PvP + Ninja Services gated behind account registration (A-03);
  Duel mode has its own currencies (skull token, DUEL TOKENS) + victory-taunt
  text field (B-07). Multiplayer chat/trade feed broadcasts other players' drops
  and level-ups (B-18). Daily login rewards: bonus every 10 consecutive days,
  super bonus every 30 (B-00). All out of offline scope — recreate surfaces as
  flavor/disabled, decision logged in A-00 notes (veto-able).
- **Achievements:** toasts for cumulative feats ("Defeat 100 enemies", A-15;
  "Join a Clan", B-20) + dojo-challenge unlocks (B-03).

---

## 2. Story & characters (spoiler-ordered, own words)

**Frame:** prequel to SHS 1/2 — "many know the legend of the Straw Hat Samurai,
but he wasn't the first" (A-00 intro crawl). Player = unnamed Shugyosha ("GUEST"
tag) on musha-shugyō, sent east by their late sensei to find Hiroshi.

- **Prologue (A-00→A-06):** Bandit king **Jinbei** ambushes the player demanding
  an "escort fee"; **Hiroshi** (old comrade of the sensei; black-bird companion
  **Kinme**) joins mid-brawl. At his hut: Shogun **Masahiro** (Shira Tancho
  daimyo, 5 years of fragile peace) faces a plot; the disbanded elite **Vanguard**
  and a loyalist named **Shinmen** are in play. Player recruits Hiroshi's old
  unit: **Ito** (dojo instructor → stance/Chi tutorials), **Takahasi** (mining),
  **Yuudai** (farming; refuses to fight). Shinmen's plan: deliver the coded
  message "prepare the toast to the Shogun's health" to winemaker **Yasuka** at
  the Toshibara inn — a wine-shipment cover; A-25 confirms the cargo: **weapons
  smuggled in wine barrels** toward the Shogun's palace. Jinbei returns for a
  beach rematch (A-16). The Prologue chapter completes on arrival at Chikada
  Town (A-25).
- **Episode 1 (Chikada, A-18→A-24):** find **Satoshi** (drunk swordsman) at the
  inn; quest hub with givers Gojo Otondo, Kawashi Masatsugu, Masatora, Akitoshi,
  Yasuo; escort **Shimazu Tadako**; bounty on **Inokichi** (club trophy);
  gambling-den crime boss **Tanaka** (debt/favor beat). Climax: a letter reveals
  **Lord Masahiro is dead** → head to the Old Guard Hideout (A-24 — the map's
  "Hiroshi refuses company" beat was a mis-projection; the letter reveal is
  what's on screen).
- **Episode 2 (Kakuchi/Ieriya, video B):** work at Kakuchi; aid **Fumio** of the
  **Shira Tancho** (sensei's clan — story-only faction, matches research);
  **Mai** describes bounty-hunter leader **Tadao**; a captive father Yasuka
  thread (⚠ same name as the winemaker — verify whether same person before
  writing our outline); Old Guard Hideout arc; **Hattori Kazushi** bounty; ruins
  dungeon at Ieriya; War Room/clan join at L10; VS duel vs **Honda Shizuka**.
- **Name-plumbing bugs in the source** (do not replicate; pick one name each):
  challenger popup "Saioji Akitsuna" vs nameplate "Ashikaga Mariko" (A-15);
  challenge prompt "Tokimasu" vs VS card "Honda Shizuka" (B-23); challenge popup
  "Shoda" vs nameplate "Fukushima Chiko" (B-24) — three instances, so the duel
  challenge popup pulls a wrong/placeholder name systematically. A-24's "player
  character named Satoshi" is almost certainly a misread of NPC Satoshi's
  speaker plaque — player remains "GUEST" everywhere else (see §6).
- **Full named-NPC roster seen:** Hiroshi, Jinbei, Kinme (bird), Ito, Takahasi,
  Yuudai, Shinmen, Masahiro, Yasuka (×1–2), Yoko, Kojuro, Mai, Satoshi,
  Akitoshi, Masatora, Gojo Otondo, Kawashi Masatsugu, Yasuo, Boss Tanaka,
  Inokichi, Shimazu Tadako, Mori Masayori, Ashikaga Mariko, Ashikaga Masayori,
  Fukushima Chiko, Fumio, Tadao, Hattori Kazushi, Murakami Teiljo, Ooka Chisato,
  Honda Shizuka, Honda Gin, Hojo Taka, Hachisuka Kano, Inokuma Kinkiyo, Niji,
  Masakiyo, Atsuko, Shigenoi Tokimasa, Lord Tsuyoshi.

---

## 3. UI inventory (every distinct screen/panel seen)

Shared chrome: **one ornate gold-corner parchment frame family** covers dialogue
boxes, results/YOU RECEIVED, level-up, guest warning, quests, player sheet, drop
confirms (A-00, A-03) — build ONE component. Menu screens share a dark parchment
bg with a robed-samurai silhouette watermark (A-18).

| Screen | Key contents | Evidence |
|---|---|---|
| Login page | bamboo parallax bg, logo, USERNAME/EMAIL + PASSWORD, REGISTER/LOGIN, PLAY AS GUEST, language dropdown, Facebook, v0.717 footer | A-00 t=0:00 |
| Loading | dimmed art, logo, LOADING…, rotating TIP line | A-00 t=0:03 |
| Guest warning modal | parchment frame, OK | A-00 t=0:06 |
| Intro cinematic | red sky, silhouettes, upward text crawl, skip ▶ | A-00 |
| Episode title cards | white bg, black brush "PROLOGUE", 3-line haiku + swash | A-00 t=0:39 |
| Gameplay HUD | coins · location banner + quest line · REGISTER nag (guest) · level fan + XP bar · minimap · portrait + HP/CHI + stance ring · bottom icon ribbon (chat/inventory/skills/forge/quests/war-room/ninja/settings) | A-00 t=0:45 |
| Dialogue box | parchment box, black nameplate tab, full-body speaker art right, red-highlight choice rows, ▶ advance; grey comic bubbles for ambient speech | A-00, A-01 |
| Combat HUD | letterboxed strip, FIGHT! splash, AUTO SLASH toggle, pause, portrait+bars, CANNOT CHANGE STANCE, 3 skill slots + gold up-arrow with charge count, enemy HP bars, HIT COMBO counter | A-00 t=1:18 |
| VS card | cracked red VS, portraits/names both sides | B-23, A-15 |
| YOU WIN / YOU WERE DEFEATED | red silhouette tableau; win = red-fill text; defeat = red-outline text + LEAVE AREA / FREE RESPAWN | A-22 (same layout system) |
| YOU RECEIVED / GLOBAL EFFECT modals | gold frame; items + XP; prosperity separately | B-18 |
| Level-up modal | crossed-katanas crest, +3/+1 rows, next-level XP | A-00 |
| Player sheet | STATS tab, currencies, 9-slot paperdoll, HP/CHI/AP with [+], ATK/DEF/SPD base+gear split, WEIGHT n/100, stat points | A-00, A-13, B-22 |
| Skills screen | 6 categories → ~6 nodes each, learn/upgrade costs, SKILLS EQUIPPED 3-slot row, UNEQUIP | A-03 |
| Quests screen | episode tabs, quest list, objective/location/reward, TAKE ME THERE 5g, ABANDON, log-full warning | A-08, B-12 |
| World Map | 2 zoom levels, pannable, legend, level-gated grey/red tiles | A-08 |
| Shop BUY/SELL | 4×4 scrollable grid, item cards with (EQ:n), GET GOLD button | A-17, B-09 |
| Blacksmith | Forge a Weapon / Reinforce Weapon confirm dialogs | B-10 |
| Inn | Rest 8c, "restores Health, Chi and AP" | A-07 |
| Toll gate menu | PAY TOLL / LEAVE, clan ownership line | B-09 |
| Stable | 2 destinations, 14c + 5 AP | B-10 |
| Bounty board | bounty text + ACCEPT BOUNTY QUEST / LEAVE | A-21 |
| Recent Happenings Board | PROSPERITY n + daily combat tallies (B-09; A-08 shows only the empty state "NO EVENTS RECORDED"; full contents on the wishlist) | B-09, A-08 |
| Vegetable Patch | HARVEST/BACK, SOIL GRADE, 0/10, Rare Crops Collection 0% (6-slot) | A-05 |
| War Room | rules 1/7 pager, clan cards, Japan-map overlay, clan resources | B-20, B-21 |
| Ninja Services | 6-row menu (shop/reinforce/transfer/prizes/achievements/leave) | B-17 |
| Trade (barter) | item-for-item offer, convert-to-fetch-quest flow | A-09 |
| Trap Challenge | banner swap, hazards, SEARCH CHEST | B-03 |
| Private PvP room dialog | ENTER ROOM NAME, OK/CANCEL | B-04 |
| Chat/Trade feed | multiplayer loot/level broadcast panel | B-18 |
| Drop confirm | DROP ITEM? YES/NO | B-14 |
| Duel setup | skull tokens, DUEL TOKENS, taunt text field | B-07 |

Known UI bug to avoid: NPC + player nameplates collide into merged unreadable
text at close range (B-18 t=52:24).

---

## 4. Feel notes (→ every stage's tuning)

- **Camera:** side-scroll follow with gentle ease; combat pulls into a
  letterboxed strip (A-00). Static-camera discrete rooms in towns (A-07).
- **Kill beats are hard cuts** to flat red + black silhouettes — no fades;
  ~0.6–1 s hold before YOU WIN text (A-14; B-11 adds only "held for a beat");
  ink-splatter reveal on the title (A-14, B-11).
- **Blood:** saturated directional bursts that **stain scenery persistently**
  during brawls (A-00); gravestone/urn markers persist where packs died (A-10).
- **Trash combat is arcade-punchy:** 1–3-hit kills in ~2–3 s at level parity
  (A-14); death is equally fast (Bandit Leader killed player in ~4 s from 6/20,
  A-12). Tune Stage 2 so trash resolves in seconds, bosses in tens of seconds.
- **Transitions:** hard black-frame cuts between zones (sub-second, B-01);
  bright horizontal wipes in dojo interiors (B-03); FIGHT! splash uses a 3-strip
  screen-wipe (B-00).
- **Low-HP dread ramp:** red vignette starts ~50% HP and intensifies ~8–10 s into
  a black-silhouette freeze at death (A-22) — a gradual ramp, not a binary state.
- **Parallax layered biomes** (bamboo forest, mountain silhouettes + pastel sky,
  sunset-free — the red tint is damage feedback); deeper parallax on later paths
  (B-05); ruins use a giant broken Buddha + hazy teal pagoda backdrop (B-13).
- **Dialogue text renders instantly** (no typewriter), manual ▶ advance (A-05).
- **Buff/quest timers run on wall-clock**, indifferent to menus — the world feels
  continuous, not turn-gated (B-04 et al.).

---

## 5. Cross-check vs `../original-game-facts.md`

| Research verdict | Video evidence | Outcome |
|---|---|---|
| Chi Punch = 10 dmg L1 (confirmed) | exactly 10 dmg, 2 Chi, 4.96 s CD on-screen (A-02 t=7:05) | ✅ double-confirmed + enriched (cost/CD) |
| Level-up +3 stat/+1 skill, refill | +3/+1 modal seen repeatedly | ✅ double-confirmed |
| Level cap 80 / 80 SP | Rebirth Scroll gate "requires Level 80" (A-17) | ✅ corroborated |
| Rebirth = elemental spec + 25g (not +10 ATK) | Scroll text: "progress to next Dan rank, specialize in an element", +25 gold (A-17) | ✅ corroborated — keep elemental design, MAX_DAN_RANK=10 default stands |
| Stance triangle L>H>B>L | not observable in PvE footage | ➖ unchanged (research-only) |
| Gestures (slash/jump/launch/stab) | draw-line slash confirmed everywhere; jump seen in Trap Challenge; launch/stab not isolable at 0.4 fps | ✅ partial visual confirmation |
| Heavy penalty = DEF ×0.8 (one form only) | Heavy Stance Mastery tooltip: "−20% defense while heavy-stanced" (A-14) | ✅ corroborated — defense-side penalty is correct |
| War Room L10 unlock, four clans, 500 donation | L10 unlock (B-19); 4 named clans + Random (B-20); 500c per contributing player per structure (B-20) | ✅ confirmed + refined wording |
| Currencies: gold sold for cash | IAP tiers + offer walls on-screen (B-17) | ✅ confirmed; `HAS_CASH_PURCHASE=false` stays a deliberate deviation |
| 10 XP / 8 coins per foe level (unverifiable) | 20+ samples show NO flat formula; named ~4.6× premium | ⬆ upgraded to **contradicted-as-formula**; keep KILL_REWARD INFERRED |
| Duel length 20–60 s (weak) | PvE trash 3–10 s; bosses 15–25 s | ⚠ refined: 20–60 s only brushes the top of observed boss fights; PvP unmeasured |
| Spawn invuln 5 s + blink | not observable (no PvP footage) | ➖ unchanged |
| CRIT_MULT 1.3 (changed from 3) | no legible crit numbers in either video | ➖ unchanged — 1.3 stands on research |
| Smoke Bomb / Stab+Deflect parries | not observed (skills never equipped by this player) | ➖ unchanged |
| Reach Light~300/Bal~200/Heavy~100 | not measurable at this sampling | ➖ unchanged |
| Shugyosha start, branch weapon, torn garments | paperdoll shows branch + basic gi starter kit at L1 (A-00); L1 "Torn Garment"/"Torn Pants" items seen owned (A-17) | ✅ double-confirmed |
| Characters (Ito/Takahasi/Hiroshi/Masahiro) | all on-screen in stated roles | ✅ double-confirmed |
| Shira Tancho story-only | appears only as sensei's clan in story (B-06) | ✅ consistent |

**New CONTRACT-grade material research never had:** XP threshold curve (§1.2),
skill cost/cooldown table (§1.1), AP cost table (§1.7), buff system (§1.3),
tolls/inn/stable/forge prices (§1.4), quest-log cap ≥7, weight cap 100,
rarity/affix/condition itemization (§1.3), death/respawn flow (§1.1).

---

## 6. Contradictions & open questions (internal to the study)

1. **Stance switching mid-combat:** every combat frame in BOTH videos shows
   "CANNOT CHANGE STANCE", and B-24 confirms the out-of-combat toggle is instant
   and meterless — so in v0.717 PvE, stance is chosen between fights, full stop.
   Either in-combat switching unlocks via a skill/meter this player never had
   (Focus Bar full?), or it's PvP-only, or spec's mid-duel stance dance is from
   an older build. **Stage 2 decision** — recommend: implement
   switch-out-of-combat (CONTRACT) + Focus-bar-gated in-combat switching as
   INFERRED, matching Critical Evade's "when your Focus Bar is full" language
   (A-03) and the spec's two-meter note (Focus for stance switch) in RESUME_HERE
   landmines.
2. **Stat-point rates conflict:** +3 ATK/DEF/SPD per point (A-14) vs +1 ATK/DEF,
   +3 SPD once (A-21). Possibly diminishing/varying rates or a misread. Default:
   +3 flat, flag INFERRED; revisit with a dense re-pass if Stage 3 needs it.
3. **Weight over-cap behavior:** hard travel-block (B-04/B-06/B-00) vs free
   walking at 102–121/100 (B-09/B-14/B-18/B-21). Default: red warning always;
   block fast-travel + inter-territory travel only.
4. **Forge price:** dialog said 700c + 2 ore; HUD lost 70c (B-10). Do not encode
   either until re-verified.
5. **Boss HP persistence across player death:** A-11 saw a non-reset boss bar
   after a real death+respawn. A-23's "full reset" is weaker evidence than it
   looks — its HP-crash cut into a scripted taunt cutscene, not a confirmed
   death screen, before a fresh FIGHT! at full HP. Default: full reset (simpler,
   matches retry feel), but treat A-11's observation as the only clean data
   point.
6. **Player-name "Satoshi" (A-24)** vs Satoshi-the-NPC (A-19): treat as NPC
   speaker plaque misread; player stays GUEST/custom-named.
7. **Two Yasukas** (winemaker, Toshibara; captive father, Episode 2): same
   person? Story outline blocker only, not config.
8. **XP cap 16,350 vs 15,350** single-frame discrepancy (B-05): trust 16,350
   (two other segments agree).
9. **Map-label errors found by dense passes** (sparse maps mispredict — segments
   win): A-16 "8/20 HP sunset" was bright daytime damage-vignette; A-28's
   "straw-hat samurai mirror duel" doesn't exist (generic BANDIT (6) reskin);
   A-29's window has a BOUNTY BOARD, not the Recent Happenings Board (board
   contents remain captured only via A-08/B-09 summaries); A-27's window holds
   the Episode-1 climax, not Dojo Recall Scroll browsing (its tooltip is fully
   captured in B-21/B-27 anyway).
10. **Blue-bar identity:** agents variably wrote stamina/stance-meter/MP/CHI —
    B-25 even swapped HP and CHI. Reconciled to: green /20–30 bar = HP, blue
    growing bar = CHI (see §1.2); read segment notes accordingly.
11. **A-27 "1 stat point per level-up"** contradicts the repeatedly
    modal-confirmed +3 stat/+1 skill — treat as a misread (it was inferred from
    a panel delta, not a level-up modal).
12. **A-26 "XP only on quest turn-in"** — its window showed no per-kill XP, but
    dozens of other segments show per-kill YOU RECEIVED XP popups; treat A-26's
    note as window-local, not a rule.

## 7. Config territory to fold into `src/config/` (by stage)

| Constant (proposed) | Value(s) | Grade | Stage |
|---|---|---|---|
| `XP_THRESHOLDS` | 550, 1450, 2950, 5150, 8350, 12150, 16350, 20900, 25900, 31400, … | CONTRACT (observed) | 3 |
| `LEVEL_UP_GAINS` | +3 stat, +1 skill, full refill | CONTRACT | 3 |
| `GUEST_START` | 100 coins, 3 gold, HP10/CHI10/AP30, ATK/DEF 1 (SPD 1 INFERRED), weight 14/100 | CONTRACT | 3 |
| `CHI_PER_STAT_POINT` | +5 | CONTRACT (A-06) | 3 |
| `HP_PER_STAT_POINT` | +10 | INFERRED (n=1) | 3 |
| `SKILLS.chiPunch` | 10/20 dmg, 2 chi, 4.96 s | CONTRACT | 2 |
| `SKILLS.throwKunai` | 20/40 dmg, 1.96 s, L10 gate | CONTRACT | 2 |
| `SKILLS.focus` | 5 chi, 9.92→8.92 s | CONTRACT | 2 |
| `SKILLS.dash` | 2 chi, 3.92 s, directional | CONTRACT | 2 |
| `SKILL_COSTS` | learn 1 SP; rank-up 2 SP typical, per-skill (Heavy Mastery 1 SP) | CONTRACT (per-skill) | 2/3 |
| `HOTBAR_SLOTS` | 3 | CONTRACT | 2 |
| `AP_COSTS` | picks (herb/mushroom) 1 · searches+mining (pot/bush/rocks/coal) 2 · stable 5 | CONTRACT (flower 1 INFERRED) | 4 |
| `SKILLS.layTrap` | 20 dmg, 4.92 s, L15 + Kunai prereq | CONTRACT | 2 |
| `FACTION_INFLUENCE` | quest turn-ins move clan influence on towns (+5 seen) | CONTRACT (B-28) | 4/5 |
| `LADDER_BUILD` | timed progress action, combat-interruptible | CONTRACT | 4 |
| `AP_BASE/GROWTH` | 30 base → 40 @L10 | CONTRACT (samples) | 3 |
| `BUFFS.potatoDog` | ×1.5 dmg, 30 min wall-clock, single slot | CONTRACT | 3 |
| `WEIGHT_MAX` | 100 (+ Carrying Weight+ skill) | CONTRACT | 3 |
| `FAST_TRAVEL_GOLD` | 5 | CONTRACT | 4 |
| `INN_REST_COINS` | 8 (restores HP/Chi/AP) | CONTRACT | 4 |
| `TOLL_COINS` | 7 (clan-owned towns) | CONTRACT | 4 |
| `STABLE_COST` | 14 coins + 5 AP | CONTRACT | 4 |
| `QUEST_LOG_CAP` | ≥7 (exact unknown) | INFERRED | 4 |
| `RESPAWN` | free, full heal, encounter-trigger checkpoint | CONTRACT | 2 |
| `COMBO_RULES` | reset-to-1 on kill; break on damage taken / chain gap | CONTRACT | 2 |
| `NAMED_XP_MULT` | ~4.6× | INFERRED (n=1) | 3 |
| `REBIRTH_SCROLL` | 1000c, L80 gate, +25 gold, elemental Dan | CONTRACT | 3+ |
| `TIMED_QUESTS` | day-expiry, Finish/Abandon, prosperity rewards | CONTRACT | 4 |
| `PROSPERITY_REWARDS` | +5/+10 per quest tier | CONTRACT | 4 |

(Values are mechanics facts, not trade dress — the ±5–8% HSL palette-shift
invariant applies to art, never to these numbers.)

## 8. Deliberately skipped map slices (28 — all re-runnable later)

Video A: 4:40–6:10 travel · 9:20–10:40 travel · 15:20–16:40 travel · 31:50–32:00
sliver · 38:50–42:00 forest travel (low) · 43:30–50:10 escort combat repeats
(escort mechanics captured in A-20/B-19) · 52:10–55:00 Inokichi-hunt grind (boss
+ death captured in A-22/A-23) · 68:40–69:45 outro card.
Video B: 16:28–18:26 bounty-hunter fight repeats · 21:44–25:01 castle-wall guard
fights (kill-cam in B-05) · 29:30–30:57 courtyard combat (ladder/guard mechanics
in B-25) · 35:34–37:32 recovery/stat-spend (captured A-14) · 42:01–45:18 mine
grind slivers (loot captured B-26/B-27) · 46:06–48:04 mine depth walk (economy
bits in B-27) · 48:44–51:22 mine exit backtrack · 63:13–65:11 herb side quest
(herb loop captured A-09) · 65:11–65:51 outro.
(Boundaries are approximate where follow-up windows overlapped dropped slices;
the counts net out: 40 dropped − 12 followed up = 28 skipped.)
Rationale: every skipped slice's *systems* are evidenced in a kept segment; only
repetition was dropped. Re-run any of them with the watch-skill command in
`STUDY_PROTOCOL.md` if a Stage needs more samples.

## 9. Follow-up wishlist (denser passes, only if a Stage needs them)

- Hit-by-hit damage timing at full fps over a clean duel (A-15/B-23 both flagged
  0.4 fps too sparse) — Stage 2 tuning aid.
- Archer moveset close-up — never captured despite two attempts (A-16 window
  ended at the FIGHT! splash; A-25 opened on the finishing blow). Best remaining
  candidates: video A ~32:20–33:18 at full fps, or B-07's mountain-path archer
  fights re-pulled denser.
- Whet Stone tooltip text (A-17 missed it); "YOU FEEL REFRESHED" inn popup and
  blacksmith failure popup (B-10 missed both); Recent Happenings Board full
  contents (A-29's window only had a bounty board).
- LEAVE AREA branch of the defeat screen (never taken in either video).
- Per-click stat costs disambiguation (A-14 vs A-21).
- The combat gold up-arrow button's charge counter ("3") from A-00.
- Pot-search completion (both B-29 prompts were walked past — AP deduction never
  filmed); chest-room interiors (B-27 found only a decorative chest).
- Gathering-tool loot tooltips: dynamite stick, skull, crops basket (B-26 saw
  icons only).
