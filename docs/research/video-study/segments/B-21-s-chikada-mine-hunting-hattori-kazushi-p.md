# B-21 S Chikada Mine: hunting Hattori Kazushi pt1 (55:19–57:49)

## Screens & layout   (positions, colors, typography, exact HUD contents; short UI labels verbatim OK)

**Player panel (opened repeatedly, t=55:19–55:29, t=56:04–56:09, t=57:12–57:46):**
- Title "PLAYER" top-left, gold serif-ish font on dark brown parchment background; red X close button top-right (square, rounded corners).
- Left column: character name "SOUND360TM" header, then a 3×3-ish equipment slot grid (head, mask/face, chest, gloves, cloak/back, main-hand weapon, ring, boots, ring/off-hand) — each slot outlined in a color keyed to rarity: green outline (common, e.g. head cap, chest armor), blue outline (cloak, boots), purple outline (main-hand sword), grey/no outline (empty/unequipped mask, gloves).
- Center column: "COINS" (grey diamond/scroll icon) — value **710** rising to **720** during the segment; "GOLD" (yellow coin icon) — flat at **2** throughout; "GET GOLD" red button; below, diamond-shaped XP icon with player level **"10"** and XP bar text e.g. **25988 / 31400** (t=55:19), rising to **26027/31400** (t=55:52, post first kill), **26066/31400** (t=56:29), **26234/31400** (t=57:09).
- Stat bars: HP (green, **30/30** flat all segment except mid-combat dips), CHI (blue, **47/47** flat), AP (blue-ish "AP" bar, **35/35** at full alloc, shows **31/40** and **30/40** mid-segment while stat points are being re-spent — max AP fluctuates 35↔40 depending on unspent stat points).
- Right column stat block: **ATK 22**, **DEF 25 + 10**, **SPD** starts **16 + 4**, player clicks "+" twice raising it to **19 + 4** (t=55:19→55:24), consuming "AVAILABLE STAT POINTS" from **2 → 1 → 0**.
- "WEIGHT: 99/100" (white) at rest; after looting in the mine it turns **red** and reads **"WEIGHT: 116/100"** (t=56:04) then **"WEIGHT: 121/100"** (t=56:52) — player is over encumbrance cap.
- Bottom-right inventory grid: 8 visible slots (2 rows × 4), scrollable via a red down-triangle arrow bottom-right of the grid (and an up-triangle appears once scrolled). Item icons include multiple swords (grey/steel, purple-outlined "Cleaver", black-handled dagger/short blade), a pickaxe (grey, tool icon, likely a quest/gathering item), a blue quill/feather-shaped weapon icon, a pale-leg "Shorts" armor icon, a red/white cylindrical scroll icon (Dojo Recall Scroll), and a light-tan cloth sack icon marked "**x5**" (consumable stack).

**Item detail sub-panel (right side of Player screen, appears when an inventory item is selected):**
- Shows item name in colored header (blue = common/iron tier, purple = rare, gold/brown = quest item), an icon tile, "LEVEL n" under the icon, a chat-bubble "..." icon (item description toggle), and a stat list with red/green delta-colored numbers plus a small red down-arrow to expand/collapse more stats.
- "CONDITION: GOOD" / "CONDITION: USABLE" label appears top-right of some weapon detail views (durability state).
- "EQUIP" and "DROP" red buttons at the bottom of the detail panel for weapons/armor; the Dojo Recall Scroll instead shows **"USE"** and "DROP".

**Skills panel (t=56:16–56:22):**
- Title "SKILLS" top-left; "AVAILABLE SKILL POINTS: 1" (then 0) top-right.
- "SELECT A SKILL CATEGORY" grid of 6 icons: a lunging swordsman, a walking swordsman w/ blade trailing, a leaping slash pose, a chi/aura swirl icon, an upward arrow (passive/stat tree?), and a kunai icon.
- Selecting the kunai category shows a 9-icon skill-node row (kunai, sword, hat/scarecrow icon, throwing-star/X icon, eye icon, and 3 humanoid silhouette icons of increasing size/pose) with the kunai node highlighted (white border box).
- Skill detail card (left): icon, name **"THROW KUNAI"**, description "Throws a kunai. Requires kunai ammo.", **"CURRENT LEVEL (LEVEL 1): 20 DAMAGE, COOLDOWN: 1.96 SEC"**, **"NEXT LEVEL (LEVEL 2): 40 DAMAGE, COOLDOWN: 1.96 SEC"**, red text **"REQUIRED SKILL POINTS: 2"** (player only has 1, so can't upgrade yet). "CATEGORIES" red back-button; "SKILLS EQUIPPED" strip bottom-right with an "EQUIP SKILL" button and 2 equipped-skill slot icons + an up-arrow slot (passive stat/dash icon).

**Overworld/mine HUD (exploration, t=55:36 onward):**
- Top-left: coins/gold row identical to Player panel, plus a red **"GET GOLD"** button.
- Below that: a bordered gold-framed location banner **"S CHIKADA MINE"**, with a sub-line that toggles between **"SIDE QUEST: DEFEAT HATTORI KAZUSHI"** (quest tracker, white text) and a footprint-icon prompt **"GO TO S CHIKADA MINE"** (yellow, waypoint nav prompt, t=56:12).
- Top-right: XP diamond + level "10" + XP fraction (same as Player panel); below it a square minimap/compass frame with N/E/S/W labels on each edge, a schematic corridor/room diagram (thin white lines = explored rooms, a triangular player-facing arrow, small icons for locked doors [padlock], keys, torches/light sources, and a "!" marker for the quest objective). Under the minimap: **"TERRITORY (23,52)"** and **"INSIDE SECTOR (3,5)"** — constant across the whole segment (single mine instance, player never leaves this sector).
- Bottom HUD bar: circular player portrait (red-ringed, war-paint headband) labeled **"HEAVY STANCE"**; green HP bar and blue CHI bar under the portrait with numeric fractions (e.g. 30/30, 47/47) and a red "+" quick-heal/stance button; then a row of 7 action icons: chat bubble "...", a tan snail-shell-shaped icon (labeled "PLAYER" once, appears to be a taunt/emote wheel), a yin-yang icon (Chi/stance swap), a crossbow-like brown mechanism icon, a yellow scroll/pencil icon, a red round icon with "!" and label **"WAR ROOM"**, a small black ninja/rogue silhouette icon, and a grey gear icon (settings).

**Combat HUD (t=55:44 onward):**
- Top-left toggle button **"AUTO SLASH OFF"**; top-right red circular pause button (⏸).
- On landing hits, a large red **"n HIT COMBO"** counter animates top-right (observed: **"1 HIT COMBO"**, **"2 HIT COMBO"**).
- Player portrait/HP/CHI bars persist bottom-left; under them a status line **"CANNOT CHANGE STANCE"** replaces "HEAVY STANCE" while a fight is active — stance-locking during combat confirmed.
- Bottom-right: 3 numbered action-skill slots (1, 2, 3). Slot "1" shows a kunai icon with an ammo counter **"0"** (out of kunai ammo — greyed out); slot "2" shows a brown/tan projectile-throw icon; slot "3" shows a plain up-arrow icon (dash/jump-attack). Enemy nameplates float above enemies with a name, a bracketed level number (e.g. "BANDIT (6)", "MURAKAMI TEIJO (7)"), and a green HP bar.
- Speech bubbles appear above combatants during pre-fight/mid-fight beats: enemy taunts **"GET LOST!"** (t≈55:24, guard NPC refusing entry) and **"PREPARE YOURSELF!"** (t=55:49, right before the fight triggers); player taunt **"DIE!"** (t=56:26, mid-swing).

**Victory screen (t=55:56, 56:29, 57:04):**
- Full-bleed solid dark-red background; black silhouette vignette of the player standing over a fallen enemy (sword raised in some frames, sheathed/resting in others), with a small dark object arcing through the air (a coin or dropped item, silhouette only).
- Large jagged red **"YOU WIN"** title, white outline, brush/ink-splatter graphic behind it, centered upper-middle of the screen.
- Immediately followed by a **"YOU RECEIVED"** loot popup: gold-ornamented parchment frame (matches the Player panel's corner flourishes), title "YOU RECEIVED" in gold script, a left-aligned rewards list — grey rectangle icon with quantity **"10"** (looks like a whetstone/scrap-material icon, distinct from the coin icon) and **"XP  39"** — plus a larger centered item-icon tile (observed: a pair of white cloth wraps/bandages) and a red **"OK"** confirm button.

**War Room / clan map overlay (t=55:59, briefly opened mid-segment):**
- Title **"SELECT TERRITORY"** top-left on a tan scroll-paper background; **"ZOOM IN"** and **"HELP"** red buttons top-right; a vertical banner reading **"WAR ROOM"** along the right edge; red **X** close button.
- **"CLAN CROPS: 402 (+2 HQ)"** stat line top-left.
- A stylized grid-overlaid map of Japan with one red clan flag planted near the Tōhoku region.
- Bottom info bar: clan crest icon, **"ALLEGIANCE: CLAN AKA RYU"**, **"RANK: RECRUIT (3 MOVES A TURN)"**, **"MOVES MADE: 0/36"**, a note "FLAGS INDICATE BATTLES THAT THE CLANS ARE CURRENTLY ENGAGED IN", a **"SHOW CLAN MSG"** button, and **"3 MOVE(S) LEFT"** top-right of the bar.

## Mechanics observed (rules, numbers, timings, damage/HP/cost values you can read — cite frame t=MM:SS for each claim)

- Player is level 10, HP 30/30, CHI 47/47, AP 35/35 (full alloc) or 40 max with points banked; ATK 22, DEF 25 (+10 gear bonus), SPD 19 (+4 gear bonus) after spending 2 stat points on SPD (t=55:19–55:24, "AVAILABLE STAT POINTS" 2→1→0).
- Inventory weight cap is **100**; player is over-capacity at **116/100** (t=56:04) and **121/100** (t=56:52) after mine loot, with the weight readout turning red past the cap (no other visible penalty triggers in this window — no move-speed change observed).
- Enemy nameplates show a level number in parentheses next to the name: "BANDIT (6)", "MURAKAMI TEIJO (7)" — both below the player's level 10.
- Bandit guard fight (t≈55:49–55:56): reaches a **"2 HIT COMBO"**, enemy dies almost instantly (sub-2-second exchange) — reward popup: **10** (material icon) + **XP 39** + 1 cloth-wraps item (t=55:59).
- Second Bandit (6) of the bounty-hunter duo, fight t≈56:24–56:29: also ends near "2 HIT COMBO", instant kill, XP total climbs from 26027→26066 across this beat (roughly consistent with another ~+39 XP kill, though a skills-menu detour at t=56:16 makes the exact attribution ambiguous).
- Wolf pack encounter (t≈56:42–56:59): 2–3 wolves visible simultaneously (green HP bars above each), fought while walking forward through the corridor; player HP visibly ticks down each exchange: 30→28 (t=55:44 combo)... in this specific pack: 24→23→22 (t=56:44–56:52) then recovers to display 20/30 post-fight (t=57:09) — wolves land small chip damage (~1–2 HP per hit) versus the player's one-shot kills on them ("1 HIT COMBO" repeated, not a growing combo — implies each wolf dies in a single hit and the combo counter resets per kill).
- Murakami Teiljo (7) bandit-hunter kill (t=57:02–57:04): single **"1 HIT COMBO"**, near-instant kill, straight to "YOU WIN".
- Kunai skill (Throw Kunai), read from Skills menu (t=56:19): Level 1 = 20 damage, 1.96s cooldown; Level 2 = 40 damage, same 1.96s cooldown (flat cooldown across levels, only damage scales); upgrading to Level 2 costs 2 skill points (player only had 1 available, greyed out).
- Weapon stat rolls examined in inventory (all "Iron Sword" base type unless noted, illustrating itemization has randomized/rolled affixes per drop):
  - Iron Sword, Level 4, Condition GOOD: DMG 5–20 (EQ: 11–24), Defense +1 (EQ:0), HP Regen +1 (EQ:1), Piercing Damage +1 (EQ:0), Water ATK 0 (EQ:1), Weight 10 (t=56:04, 57:29).
  - Iron Sword, Level 5, Condition USABLE: DMG 8–13, Max HP +5, HP Regen 0, Wind ATK +1, Water ATK 0 (t=56:09).
  - Iron Sword, Level 5 (different roll), Condition GOOD: DMG 7–15, HP Regen 0, Wind ATK +2, Water ATK 0, Earth ATK +1, Chi Regen +1 (t=57:34).
  - "Cleaver", Level 5, Condition GOOD: DMG 2–25 (wide variance, highest ceiling seen), HP Regen 0, Water ATK 0, Earth ATK 0, Weight 12 (t=56:52, 57:39).
  - "Training Sword", Level 2: DMG 5–9, HP Regen +1, Critical Damage +1, Water ATK 0, Earth ATK 0, Max Chi 0, Weight 5 (t=56:56) — a starter-tier weapon still carried/compared against.
  - "Shorts" (armor, legs slot), Level 7: Defense +1 (EQ:3), Water Def +3 (EQ:0), Earth Def 0 (EQ:1), Critical Damage +2 (EQ:1), Max Chi 0 (EQ:5), Chi Regen 0 (EQ:2), Speed +5 (EQ:0) (t=56:44) — note "EQ:" appears to be a comparison-to-currently-equipped-item delta shown alongside each stat.
- "Dojo Recall Scroll" item text (t=56:46, 56:49): **"Takes you to the nearest dojo. (Can only be used outdoors.)"**, Weight: 1 — confirms it is unusable while inside the mine interior (an indoor/outdoor flag must gate its "USE" action).
- Locked door mechanic: a door prompt reads **"UNLOCK DOOR"** (t=55:56) near a padlock icon on the minimap; a gold key icon is visible lying on the corridor floor shortly after (t=55:42), implying a pickup-key-to-unlock-door puzzle gate within the mine.
- Minimap padlock icon changes state (locked → open) between t=55:39 and t=56:12 frames, consistent with the player unlocking that door partway through the segment.

## Story/dialogue     (OWN-WORDS summary; names/quest titles OK; no verbatim dialogue)

The player enters S Chikada Mine tracking a side quest to defeat a bounty target named Hattori Kazushi. Right at the entrance a lone bandit (level 6) refuses to let the player past a locked storeroom door, taunts them, then squares up for a fight once the player pushes forward — he's dispatched in one clean exchange. Deeper in, the player runs into what looks like the promised "bounty-hunter pair": a second bandit (level 6) and a named swordsman, Murakami Teiljo (level 7), patrolling together. The bandit is cut down first with a taunt of his own thrown back at him. Before finishing off Murakami Teiljo, the player is swarmed by a small pack of wolves in the same corridor and clears them out. Murakami Teiljo is then killed in a single blow. Notably, Hattori Kazushi himself — the actual quest target — is not encountered in this window; this segment reads as the approach/clearing phase before the boss encounter, matching the "pt1" framing of the segment title.

## Feel               (pacing, camera, animation weight, FX; if combat: rough per-encounter durations in seconds)

- Pacing is very lopsided in the player's favor at this power level: every fight in the segment (2 bandits, a wolf pack, and the named Murakami Teiljo) resolves in 1–2 hit combos, none lasting more than a few seconds of active exchange. This reads as "trash mob mopping" ahead of a real boss fight, not a tense duel.
- Camera is a fixed side-scrolling 2D plane, no zoom/pan tricks observed; enemies and player share the same ground line, combat plays out via short forward dashes/lunges rather than root-in-place stance duels.
- Between fights the player repeatedly opens the Player/Skills menus mid-dungeon (not just at a safe hub) — menu access is not gated by being outdoors or out of combat zones, only combat itself locks the stance selector.
- Victory transition has a distinct 2-beat flourish: instant hard-cut to a red silhouette "kill card" ("YOU WIN" splash) held for roughly a second, then a separate loot popup — this is consistent across all 3 kills observed, suggesting it's a fixed system-level sequence rather than per-enemy variation.
- Wolves have a lunging pounce animation (mid-air leap sprite, t=56:44) distinct from the bandits' walk-in/attack cycle — gives them a faster, more erratic silhouette compared to human enemies.
- Encounter durations (fight-start dialogue/aggro to "YOU WIN" splash): Bandit #1 ≈ 7s (55:49→55:56); Bandit #2 of the duo ≈ 5s (56:24→56:29); wolf pack ≈ 15–17s (56:42→56:59, includes multiple single-hit kills back to back); Murakami Teiljo final blow ≈ 2s (57:02→57:04, essentially a formality after the buildup).

## Recreation notes   (config values to add/adjust, which build Stage this maps to, anything contradicting the repo's spec/research docs)

- Confirms combo-counter UI convention: a large red "N HIT COMBO" text pops top-right and appears to reset to "1" on a fresh kill rather than persisting across multiple enemies in the same fight — worth encoding as a per-target or time-window combo reset rule in `core` combat logic design, not a session-long counter.
- Confirms stance-lock-during-combat as a real mechanic ("CANNOT CHANGE STANCE" replaces the stance label the instant a fight starts) — should be a CONTRACT value (a boolean gate) in whichever config governs stance switching, not just flavor text.
- "Dojo Recall Scroll" indoor/outdoor gating is a concrete inventory-item rule worth a CONTRACT flag (e.g. `usableIndoors: false`) if/when fast-travel items are built.
- Weapon/armor stat rolls show an "EQ: X" comparison delta pattern next to every stat in the item-detail view — useful reference for the eventual inventory/tooltip UI, though the specific numeric ranges (DMG 5–20, 7–15, 8–13, 2–25, etc.) are loot-table specifics from the original and should NOT be copied verbatim into config; they're useful only as order-of-magnitude sanity checks (roughly 2–25 damage bands at mid-game gear tiers) given this project's trade-dress-shift mandate.
- Kunai skill numbers (20 dmg @ Lv1 → 40 dmg @ Lv1→Lv2, flat 1.96s cooldown, costs 2 skill points to rank up) are a clean example of a skill-leveling data shape (damage scales, cooldown flat) that could inform `src/config` skill definitions structurally — again, treat exact numbers as reference only, not to be reproduced 1:1 per the palette/trade-dress-shift spirit already applied to visuals.
- This segment is squarely mid/late Stage content (combat encounters, inventory/equipment system, skill tree, clan war minimap overlay) — none of it maps to an early build-stage gate; it's useful primarily for combat feel/pacing and UI-layout reference once the project reaches those stages.
- Nothing here contradicts prior spec/research docs; it reinforces the existing understanding of the HUD bottom-bar icon row (stance portrait, chat, taunt wheel, Chi/stance toggle, ranged-weapon slot, item/scroll slot, War Room, stealth/ninja icon, settings) and the top HUD split between quest banner (left) and minimap/compass (right).

## VERIFIED
