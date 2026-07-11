# B-15 Ieriya Dungeon: key and locked door pt2 (35:26–35:34)

## Screens & layout   (positions, colors, typography, exact HUD contents; short UI labels verbatim OK)
- Top-left: coin/currency panel — icon "507" (grey scroll/coin icon labeled COINS) + gold coin icon "2" (GOLD) + red "GET GOLD" button. Unchanged all segment.
- Top-right: diamond icon "8" + "20880 / 20900" EXPERIENCE POINTS (unchanged throughout, no XP gain this segment).
- Zone banner top-left, changes twice this segment:
  - t=35:26–35:27: "W IERIYA DUNGEON" (indoor stone-brick corridor, dark, torches/wooden pillars).
  - t=35:29 onward: "W IERIYA RUINS" (outdoor jungle-temple background, overgrown archway, Buddha-head statue, distant teal pagoda silhouette).
- Below zone banner, persistent quest box: "SIDE QUEST: GET RESERVED SHARP IRON SWORD OF WATER FOR SHIGENOI TOKIMASA" — unchanged all frames, quest text is a paraphrase-safe short UI label (kept verbatim as it is a functional quest-tracker string, <15 words).
- Minimap top-right: gold-bordered square frame, cardinal letters N/E/S/W at edges. Two minimap states seen:
  - Zoomed/simple mode (t=35:26–35:27, indoor): shows a coarse corridor path (line segments) with a small yellow player arrow-triangle icon, "TERRITORY (24,51)" and "INSIDE SECTOR (0,2)" captions below.
  - Zoomed-out grid mode (t=35:28 onward, outdoor): numbered column headers "0 1 2 N 3 4 5" across top, row labels "0..5" down the side with "W" left / "E" right / "S" bottom; a grid of dungeon cells drawn as thin white line-segments (walls/corridors), a gold flag icon at cell (2,2)-ish marking start/quest point, a yellow "X" icon at roughly (3,1), a yellow up-arrow player marker moving along a dashed white path line down into the grid, and small "!" / arch-shaped icons near bottom row (quest markers / dungeon entrance icons). Caption below reads "TERRITORY (24,51)" / "SECTOR (0,2)" then updates to "SECTOR (1,2)" by the final frame (t=35:34, cut to black/bamboo transition).
  - No key icon or locked-door icon is visible on the minimap in any of the 16 sampled frames of this specific 8-second window — the "key/locked door" mechanic described in the segment's map context is not directly on-screen here; this window instead shows pure traversal (running) between the dungeon corridor and the ruins exterior while carrying an item.
- Bottom-left player HUD (unchanged all frames): circular red-ringed portrait, green bar "5 / 20" (HP), blue bar "47 / 47" (stamina/chi?), label "HEAVY STANCE" beneath the bars, small "+" button.
- Bottom toolbar icons (unchanged, left to right): chat bubble "…", tan/brown blob (item), yin-yang symbol, saw/weapon icon, yellow scroll, grey hexagon/stone, black ninja silhouette, grey gear (settings).
- Bottom-right status: yellow text "150% DAMAGE" with a countdown timer beside it, ticking down each frame from 00:10 (t=35:26) → 00:09 → 00:08 → 00:07 → 00:06 → 00:05 → 00:04 (t=35:33), i.e. a temporary buff expiring in real time roughly 1 second per frame-sample.
- Player character sprite: white/red samurai outfit, carrying a large red rectangular object slung across the back (visually reads as a wrapped package/plank — the "loot object" referenced in the map context), running left-to-right across both the dungeon corridor and the outdoor ruins screens.
- Background NPC/scenery figures: small greyscale kneeling statue figures scattered in both the corridor and ruins screens (stone idols, not enemies — no combat or health bars for them).
- At t=35:32–35:33 a wooden signpost with "E" (east) direction label appears on right edge, and text "W IERIYA FOREST (E)" appears near the minimap area, indicating an upcoming zone transition.
- Final frame (t=35:34) cuts to a bamboo-forest background silhouette (green vertical stalks on black) with minimap caption "SECTOR (1,2)" — the zone transition into W Ieriya Forest.

## Mechanics observed (rules, numbers, timings, damage/HP/cost values you can read — cite frame t=MM:SS for each claim)
- HP reads 5 / 20 throughout the entire 8-second window (t=35:26 through t=35:33) — no damage taken, no healing, static.
- Secondary blue bar reads 47 / 47 throughout (full, unchanged) — stance-stat/stamina bar, tied to "HEAVY STANCE" label.
- COINS = 507, GOLD = 2, unchanged across all 16 frames.
- XP = 20880 / 20900 (Level 8, per diamond icon), unchanged — no XP gained from traversal.
- "150% DAMAGE" buff timer counts down 00:10 → 00:04 across the ~8-second sample window (t=35:26 to t=35:33), i.e. roughly real-time 1:1 countdown, expiring shortly after this clip ends (confirms a timed buff mechanic, not a stack/charge counter).
- Zone transition sequence observed: W IERIYA DUNGEON (t≈35:26–27) → W IERIYA RUINS (t≈35:28–33) → transition toward W IERIYA FOREST (E) (signpost + label visible t≈35:32–33) → cut to bamboo forest visual at t=35:34.
- Minimap sector coordinate changes from "SECTOR (0,2)" (t=35:26–35:32) to "SECTOR (1,2)" (t=35:34), consistent with the player moving one sector east between dungeon-grid cells.
- No locked door, key icon, or key-pickup UI element appears on-screen in this specific 8-second sample — the "key and locked door" mechanic named in the segment title/map-context is not directly observable in these 16 sampled frames; it likely occurred just before or after this exact window (this window is pure corridor-to-ruins traversal carrying an already-held loot object).
- No combat, no enemy encounters, no damage numbers, no drops observed in this window.

## Story/dialogue     (OWN-WORDS summary; names/quest titles OK; no verbatim dialogue)
- The player character is mid-way through a side quest to retrieve a reserved iron sword ("Iron Sword of Water") on behalf of an NPC named Shigenoi Tokimasa, per the persistent quest tracker box. In this clip the player is simply running from the dungeon's western interior corridor out into a ruined, overgrown temple courtyard exterior (statues, a large stone Buddha-head, a distant teal-roofed pagoda visible through fog), while carrying a large wrapped object on their back — presumably the quest loot/sword bundle. No dialogue or story beats play out in this window; it is a traversal-only segment bridging dungeon interior to the outdoor ruins zone, heading toward a forest zone next.

## Feel               (pacing, camera, animation weight, FX; if combat: rough per-encounter durations in seconds)
- Pure lateral run-cycle: camera is fixed/locked, background scrolls at a moderate parallax pace (near statues/pillars move faster than the distant pagoda silhouette, giving multi-layer depth).
- Player run animation carries visible weight — character leans forward, carried object bounces slightly with the stride, consistent with the game's grounded, non-floaty movement feel established elsewhere in the study.
- No FX, no screen shake, no combat impacts in this window — a calm connective-tissue traversal beat between set-pieces.
- Ambient ruins art has a soft painterly fog/atmosphere (pale teal-grey sky, low-contrast background silhouettes) contrasted against the flat dark stone-brick dungeon interior seen at the very start of the clip — a deliberate mood shift from claustrophobic interior to open, hazy exterior.
- The 150% damage buff countdown ticking down in the corner while the player is simply running (not fighting) suggests the buff was picked up just before this window and is now quietly expiring during a non-combat traversal beat — a small pacing/tension detail (player "wasting" a combat buff while forced to travel).

## Recreation notes   (config values to add/adjust, which build Stage this maps to, anything contradicting the repo's spec/research docs)
- Confirms existing HUD contract elements already noted elsewhere: HP bar format "cur / max" (5/20 here), secondary stat bar "cur/max" (47/47), stance label under bars ("HEAVY STANCE"), coins/gold/XP panels, bottom toolbar icon set (8 icons) — reuse existing config values, no new numbers to add from this segment beyond confirming 150%-damage-buff has a visible mm:ss countdown timer UI element (worth adding a `buffTimerDisplay` UI config note if not already present).
- New UI element worth flagging for `src/config/`: minimap has (at least) two render modes — a coarse "local corridor" view (indoors) and a "sector grid" view with numbered axes and a dashed path-trail line (outdoors) — plus a "SECTOR (x,y)" coordinate readout that increments as the player crosses sector boundaries. This is a bigger minimap system than a simple static icon; flag for whichever Stage handles world-map/minimap UI (likely a later Stage — repo is presumably still early per RESUME_HERE.md; confirm before scoping).
- This specific 8-second window does NOT show the locked-door/key mechanic implied by the segment's map-context description — recommend a follow-up dense-study pass on the immediately preceding or following few seconds (e.g. 35:15–35:26 or 35:34–35:45) if the key/locked-door interaction is needed for spec purposes, since it is not visible here.
- No numeric contradictions found versus existing repo docs in this window (HP/stance/currency formats all consistent with prior segment notes, per naming conventions already in use).

## VERIFIED
All 16 extracted frames (t=35:26 through t=35:34) were read and reviewed directly; findings above are grounded only in on-screen content actually observed in those frames. Frames 3, 4, 15, and 16 were heavily letterboxed/near-black (mid-transition or scene-cut frames) and contributed only partial minimap/text fragments (noted above), not full-screen detail.
