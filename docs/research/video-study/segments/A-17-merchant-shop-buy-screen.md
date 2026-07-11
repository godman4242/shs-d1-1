# A-17 Merchant shop: BUY screen (34:50–36:10)

## Screens & layout   (positions, colors, typography, exact HUD contents; short UI labels verbatim OK)

**Overworld HUD (persists across all non-shop frames, e.g. t=34:50, t=35:40):**
- Top-left: green book/scroll icon + "COINS" count (249 → 259 across segment), small red "+" button beside it.
- Top-center: red bordered banner "REGISTER — TO SAVE YOUR PROGRESS AND PLAY ONLINE!" (persistent nag banner).
- Top-right: cyan diamond icon "5" + amber XP bar "7593 / 8350 — EXPERIENCE POINTS".
- Top-right below XP: a bordered minimap/compass panel with N/S/E/W labels, a grid of pictograph icons (torii gate, sleeping "Zzz" icon, dialogue-bubble icon, arrow icon, lock icon) marking points of interest; below it "TERRITORY (23.52)" and "SECTOR (1,3)" / "INSIDE SECTOR (1,3)" text (t=34:50, t=35:38–36:05).
- Top-left below coins: area-name plaque (black bg, gold border) that changes as player walks: "CHIKADA CITY GATES" → "CITY ENTRANCE" → "MAIN STREET" → "MERCHANT DISTRICT" (t=34:50, 34:58, 35:40, 35:45, 35:52). Directly under it, a smaller white-text quest reminder: "STORY QUEST: MEET SATOSHI AT THE INN" (persists, disappears only while an NPC dialogue prompt is showing).
- Bottom-left: player portrait roundel (red ring), two stacked bars — green HP "19 / 20" and blue Chi "20 / 20" — with stance label "HEAVY STANCE" beneath, and a red "+" heal button to the right of the portrait.
- Bottom bar (full width): row of circular icons — chat bubble, dumpling/leaf shape, yin-yang symbol, wood-saw/tool icon, a light cream tool icon, a grey hex/rock icon, a black ninja-mask icon, and a gear (settings) icon at far right.
- World signage: wooden directional signposts with single-letter compass labels ("W", "E", "N", "S") mark map exits (t=34:50 "W", 35:12 "E", 35:38 "N", 35:45 "S").

**Peddler shop cart (world object, t=35:00):** red-roofed wooden cart with hanging red lanterns, a clothing rack of colored garments beside it, and an old bearded peddler NPC (grey robe, wide straw hat, blue sack on back) standing at the cart. Floating name label above his head reads "PEDDLER" once close enough to interact (t=35:02).

**Peddler Shop root menu (t=35:00, 35:12, 35:20):**
- Top bar duplicated: "COINS" (green icon) on the left, then a NEW "GOLD" currency readout (yellow coin icon) "3" plus a red "GET GOLD" button — confirms Gold is a separate premium currency from Coins.
- Left panel, brown parchment-style buttons, title "PEDDLER SHOP":
  - "BUY" (moneybag icon)
  - "SELL" (moneybag icon)
  - "LEAVE" (up-arrow icon)
- Lower-left dialogue box, header "PEDDLER": `"THANKS FOR DROPPING BY. COME! HAVE A LOOK AROUND!"` (verbatim, short functional line).

**SELL screen (t=35:05–35:18):** Full-screen dark reddish-brown gradient overlay with a large silhouette of the player character on the right. Title "SELL" top-left, white "X" close button top-right. Coins/Gold/GET GOLD readout repeated at top. A 4-column item grid (up to 5 rows) fills the left ~55% of the panel; each slot is a grey square icon with sell price + coin icon in the bottom-right corner. Selected item gets a green border. Right side shows: item icon (large), item name (white caps), "OWNED: n", level tag, a stat list, and a red "SELL" button at the bottom of the info pane.
- Grid contents observed (sell prices in Coins): straw hat 5, white cloth/garment 5, grey pants "15" (green-bordered = selected), rice-ball/onigiri 1, sword 10, sickle/scythe "15" (green-bordered = selected), tanto/short-sword 5, hooded garment 5, cloth 5, pickaxe 10, torn garment 5 (dupe slot), stick 0, red potion 1, onigiri 1.
- "TORN GARMENT" detail panel (t=35:15): icon, "OWNED: 1", "LEVEL 1", stat "DEFENSE: +1 (EQ: 1)", "WEIGHT: 5", sell price 5 Coins.
- "TORN PANTS" detail panel (t=35:20, after a sale — Coins went 249→254→259, i.e. +5 Coins twice, matching two 5-Coin sales): "OWNED: 1", "LEVEL 1", stats "DEFENSE: 0 (EQ: 3)", "EARTH DEF: 0 (EQ: 1)", "CRITICAL DAMAGE: 0 (EQ: 1)", "MAX CHI: 0 (EQ: 5)", "CHI REGEN: 0 (EQ: 2)", "WEIGHT: 5", sell price 15 Coins.
  - Note the "(EQ: n)" suffix on every stat line — reads as "currently-equipped item's stat for comparison," i.e. the sell/buy panel shows a diff against what's worn.

**BUY screen — Peddler (t=35:22–35:32):** Same dark-gradient/silhouette chrome as SELL, title "BUY" instead. 4-column grid, scrollable (small triangle "▼"/"▲" arrows appear centered right of the grid at t=35:28/35:30 confirming vertical scroll).
- Page 1 grid (top-down, left-right), price + currency-icon per slot:
  - Row1: katana/sword icon 100 (Coins), grey rectangular whetstone-shaped icon "20" (Coins), stacked gold-bar icon "40" (Coins), kunai/dagger icon "5" (Coins, selected black-highlight at t=35:25)
  - Row2: four colored medicine-vial icons — red "100" (Coins), blue "1000" (Coins, selected at t=35:28), orange "1000" (Coins), purple "1000" (Coins)
  - Row3: four potato/onigiri-like round icons, each "5" with a small gold-coin badge (priced in **Gold**, not Coins) — same icon repeated with slight color variants
  - Row4 (partially visible before scroll): two more Gold-priced round items "5" each, a red hooded garment "50" (Coins), a grey rock/whetstone icon "50" (Coins)
- Selected-item detail panel, "KUNAI" (t=35:25): "OWNED: 0", "WEIGHT: 1", price 5 Coins, red "BUY" button.
- Selected-item detail panel, "REBIRTH SCROLL" (blue vial, t=35:28): "OWNED: 0", price 1000 Coins, description text: `"NEW GAME + / PROGRESS ON TO THE NEXT DAN RANK AND SPECIALIZE IN AN ELEMENT. / LEVEL 80 REQUIRED. / GOLD: +25"` — confirms a prestige/NG+ mechanic tied to "Dan rank" and elemental specialization, gated at character level 80, rewarding +25 Gold on use.
- Scrolled page (t=35:30–35:32): row of 2 Gold-priced round food items "5"/"5", red hooded garment "50", grey stone "50"; next row 4 pairs of pants "50" each; next row 4 pairs of white/black sandals-boots "20" each; final row one more sandal "20" and a pickaxe "100" (Coins).
- "SANDALS" detail panel (t=35:30/35:32): icon, "OWNED: 0", "LEVEL 1", stat "DEFENSE: +1 (EQ: 0)", "WEIGHT: 1", price 20 Coins.

**Merchant District — NPC beats (t=35:42–36:08):**
- Walking from Main Street into "MERCHANT DISTRICT (N)" a floating exclamation mark and name label "GOJO OTONDO" appear over an NPC (blue name text = quest-giver color convention) as player character "GUEST" walks past (t=35:42).
- Arriving at a market stall, a second NPC "KAWASHI MASATSUGU" is interactable with two prompts: a speech-bubble icon "KAWASHI MASATSUGU" (talk) and an eye icon "MERCHANT" (open shop) (t=35:45, 36:00).
- Talking to Kawashi Masatsugu opens a dialogue box titled "GUEST": `"HAJIMEMASHITE. (NICE TO MEET YOU.)"` (verbatim, short line, includes an in-fiction Japanese greeting + parenthetical translation) with 3 options: "QUEST", "TRADE", "LEAVE" (t=36:00). QUEST is highlighted red/selected.
- Follow-up box titled "KAWASHI MASATSUGU": `"THANKS!"` (t=36:02) — reads as an auto-resolved trivial "quest" interaction (e.g., a greeting/tutorial quest), not a real fetch quest.
- Separately, "GOJO OTONDO" gives an actual fetch-quest line, dialogue box titled "GOJO OTONDO": `"I AM LOOKING FOR"` + a blue-highlighted procedurally-named item `"DRAFTY SHARP IRON SWORD OF PIERCING"` + `"."` (t=35:48). The item name is color-highlighted mid-sentence, confirming it's a dynamically generated item-name string (prefix "Drafty" + quality "Sharp" + material "Iron" + base type "Sword" + suffix "of Piercing").

**Merchant (Kawashi Masatsugu) BUY screen (t=36:05–36:08):** Same BUY chrome as the Peddler's, but items are now rarity-color-bordered (green border = common tier, blue border = rare/uncommon tier) and priced much higher — this is a distinct, better-stocked vendor from the roadside Peddler.
- Grid row1: brimmed hat "410" (green border), dark pants "450" (green border), purple hakama/pants "850" (blue border), white boots "420" (blue border)
- Row2: white cloak/garment "750" (blue border), white/black sandals "420" (blue border, selected at t=36:05), white robe "750" (blue border), gold-hilted sword "501" (green border)
- Row3: sandals "5" (Gold), tan garment "5" (Gold), curved sword "5" (Gold), grey sword "5" (Gold)
- Row4: white garment "5" (Gold), red-trimmed cloak "5" (Gold), long sword "5" (Gold), black chainmail-look cloak "5" (Gold)
- "PANTS" detail panel (t=36:05, green rarity name text): "OWNED: 0", "LEVEL 4", stats "DEFENSE: +1 (EQ: 3)", "FIRE DEF: +1 (EQ: 0)", "WIND DEF: +2 (EQ: 0)", "EARTH DEF: 0 (EQ: 1)", "CRITICAL DAMAGE: 0 (EQ: 1)", "MAX CHI: 0 (EQ: 5)", "CHI REGEN: 0 (EQ: 2)", "WEIGHT: 5", price 450 Coins.
- "SANDALS" detail panel (t=36:08, blue rarity name text): "OWNED: 0", "LEVEL 4", stats "DEFENSE: +5 (EQ: 0)", "WIND ATK: +1 (EQ: 0)", "ATTACK: +1 (EQ: 0)", "SPEED: +3 (EQ: 0)", "WEIGHT: 1", price 420 Coins.
- Item-name text color appears tied to rarity tier: green = common, blue = rare (matches the grid border colors).

## Mechanics observed (rules, numbers, timings, damage/HP/cost values you can read — cite frame t=MM:SS for each claim)
- Two currencies exist simultaneously: **Coins** (green icon, earned in-world, 249→259 across this segment) and **Gold** (yellow coin icon, premium/rare, flat "3" the whole segment — never spent or earned here) (t=35:00 onward).
- A "GET GOLD" red button sits next to the Gold readout on every shop screen — almost certainly an IAP/monetization hook (t=35:00, 35:22, 36:05).
- Peddler SELL prices seen: straw hat 5, cloth 5, pants 15, onigiri 1, sword 10, sickle 15, tanto 5, hooded garment 5, cloth 5, pickaxe 10, torn garment 5, stick 0, red potion 1, onigiri 1 (all Coins) (t=35:05).
- Torn Garment: Level 1, Defense +1, Weight 5, sells for 5 Coins (t=35:15).
- Torn Pants: Level 1, Defense 0, Earth Def 0, Critical Damage 0, Max Chi 0, Chi Regen 0, Weight 5, sells for 15 Coins (t=35:20).
- Two sales occurred off-screen between t=35:05 and t=35:20: Coins rose 249 → 254 → 259 (two +5 increments), consistent with selling two 5-Coin items (t=35:05, 35:10, 35:20).
- Peddler BUY prices seen: sword 100, whetstone(?) 20, gold-bar item 40, kunai 5 (Coins); 4 potions 100/1000/1000/1000 (Coins); several food items 5 Gold each; hooded garment 50, stone item 50, 4× pants 50 each, 5× sandals/boots 20 each, pickaxe 100 (all Coins) (t=35:22–35:32).
- Kunai: Weight 1, price 5 Coins (t=35:25).
- Rebirth Scroll: price 1000 Coins, unlocks **New Game+** — "progress on to the next Dan rank and specialize in an element," requires character **Level 80**, grants **+25 Gold** (t=35:28). This is the single most important economy/progression fact in the segment — confirms a rebirth/prestige system exists and Gold can be earned in-game (not purely paid) via this scroll.
- Sandals (Peddler tier): Level 1, Defense +1, Weight 1, price 20 Coins (t=35:30).
- Merchant (Kawashi Masatsugu) BUY prices are far higher and rarity-tiered: hat 410, pants 450, pants 850, boots 420, cloak 750, sandals 420, robe 750, sword 501 (Coins, green/blue rarity borders); plus a second row of 8 items priced 5 Gold each (t=36:05).
- Merchant Pants (green/common): Level 4, Defense +1, Fire Def +1, Wind Def +2, Earth Def 0, Critical Damage 0, Max Chi 0, Chi Regen 0, Weight 5, price 450 Coins (t=36:05).
- Merchant Sandals (blue/rare): Level 4, Defense +5, Wind ATK +1, Attack +1, Speed +3, Weight 1, price 420 Coins (t=36:08). Notably a rare item skips flat stat scaling seen on commons (no Fire/Earth/Chi lines) in favor of offense/speed stats — rarity tiers appear to roll different stat pools, not just bigger numbers.
- Stat panels consistently show a "(EQ: n)" comparison number next to every stat — reads as the currently-equipped item's value for that same stat, for buy/sell comparison.
- Player state unchanged throughout: HP 19/20, Chi 20/20, Heavy Stance, XP 7593/8350 (t=34:50 through 36:08) — shopping does not consume time/resources beyond Coins/Gold.
- Minimap shows "TERRITORY (23.52)" and a "SECTOR (x,y)" coordinate, currently "(1,3)", that persists across all area transitions in this segment (t=34:50–36:05) — world is segmented into a coordinate grid of sectors.

## Story/dialogue     (OWN-WORDS summary; names/quest titles OK; no verbatim dialogue)
The player character walks from the Chikada City Gates through the City Entrance and Main Street into the Merchant District, passing a roadside peddler's cart along the way. The main story-quest reminder throughout is to find a character named Satoshi at the inn. Along Main Street the player brushes past an NPC named Gojo Otondo, who is flagged with a quest-alert icon; Otondo is on the hunt for a specific procedurally-named sword (a "Drafty Sharp Iron Sword of Piercing"), suggesting a fetch/craft-style side quest tied to the game's randomized item-naming system. In the Merchant District proper, the player meets a shopkeeper named Kawashi Masatsugu, greets him, is offered a trivial introductory "quest" option that resolves instantly with a thank-you, and can otherwise open his trade menu. Kawashi's stock is visibly a cut above the roadside peddler's — pricier, rarity-color-coded gear alongside cheap Gold-priced consumables.

## Feel               (pacing, camera, animation weight, FX; if combat: rough per-encounter durations in seconds)
- Overworld movement is a smooth horizontal side-scroll; the player sprite runs at a moderate jog past static background NPCs and prop stalls, screen pans to keep the player roughly centered-left.
- Area transitions (Chikada City Gates → City Entrance → Main Street → Merchant District) are seamless, no loading screen or fade — confirmed by one corrupted/letterboxed transition frame (t=34:55) that appears to be mid-scroll-transition compression artifact rather than an actual game screen.
- Shop menus open as a hard cut to a separate full-screen UI (dark gradient + character silhouette), no animated transition observed in the captured frames; closing is via an explicit "X" button top-right.
- NPC interaction uses a floating "!" quest-alert icon plus a name-label bob/flicker effect (the name text visibly glitches/overlaps with "GUEST" label at close range, e.g. t=35:45, 35:50, 36:00 — likely a UI z-order/overlap quirk in the original rather than an intentional effect) when the player walks near a quest-giver.
- No combat in this segment — pure economy/dialogue/traversal beat.

## Recreation notes   (config values to add/adjust, which build Stage this maps to, anything contradicting the repo's spec/research docs)
- This segment is pure UI/economy content — maps to whatever Stage introduces the shop/inventory UI and item-stat system, not the combat Sim. No Phaser-scene-relevant physics/combat numbers here.
- Two-currency economy (Coins earned in-world + Gold as a premium/rare currency with a "GET GOLD" IAP-style button) should be modeled as two separate CONTRACT config values/balances; per repo invariant, do not hardcode any of the observed prices in `src/core/` — they belong in `src/config/` labeled INFERRED (exact values read off-screen, not from original source) since these are read from gameplay, not decompiled.
- Item stat panel pattern worth replicating: every stat line shows the item's own value alongside "(EQ: n)" — the currently-equipped item's value for the same stat — for at-a-glance comparison. Good UX pattern to carry into our own inventory UI.
- Rarity tiers (green = common, blue = rare, confirmed by border color + item-name text color) drive both price and stat-pool shape (commons get flat elemental defense stats; the one rare example swapped those for offense/speed stats) — if the recreation ports the rarity system, config should define per-tier stat-roll pools, not just a price multiplier.
- Confirmed a New-Game+/prestige mechanic ("Rebirth Scroll", Level 80 gate, "next Dan rank", "specialize in an element", +25 Gold reward) exists in the original — flag for whoever owns the long-term feature-scope doc; this is a deep-endgame system, almost certainly out of scope for early build stages, but worth a placeholder note so nobody "discovers" it as new later.
- The BUY grid is scrollable (small ▲/▼ triangle control, not a static single-page grid) — if our shop UI is a fixed grid, note this as a deliberate simplification versus the original, not an oversight.
- Item-name generation ("Drafty Sharp Iron Sword of Piercing") confirms a prefix+quality+material+base+suffix naming template exists for at least some quest/loot items — relevant to whichever system owns procedural item names, if the recreation implements one.
- No on-screen confirmation of the Whet Stone's descriptive tooltip text ("improve the condition of your equipped weapon") mentioned in the task's map-context brief — the grey rectangular icon priced 20/50 Coins in the Peddler's BUY grid is inferred to be the Whetstone by icon shape and position, but its detail-panel description was not captured in any of the 32 sampled frames (the panel was open on Kunai, then Rebirth Scroll, then Sandals instead). Flag this as an open item for a future targeted re-watch if the exact Whet Stone description text is needed verbatim.

## VERIFIED
