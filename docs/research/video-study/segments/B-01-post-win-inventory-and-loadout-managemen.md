# B-01 Post-win inventory and loadout management pt2 (2:30–2:38)

> **CONTENT MISMATCH FLAG:** The kickoff described this window as a "post-win inventory/loadout"
> screen (YOU WIN → equips/stats tab). The actual frames at video B (`Nr4fQstqHDM.mp4`) 2:30–2:38
> show **overworld side-scrolling traversal through Chikada Forest**, not an inventory screen —
> no equips panel, stats tab, Bandana, or overweight warning appear anywhere in the 16 sampled
> frames. Documented exactly what is on screen below; flagged for the sweep owner to re-timestamp
> the intended post-win-inventory beat elsewhere in video B.

## Screens & layout   (positions, colors, typography, exact HUD contents; short UI labels verbatim OK)
- **Top-left resource cluster:** scroll icon + "425" (coins), red circular "+" button, gourd/bell icon + "2" (gold), red button "GET GOLD" — all frames, unchanged (t=02:30–02:38).
- **Top-right XP cluster:** fan icon with badge "7" (player level), label "EXPERIENCE POINTS", bar reading "14391 / 16350" — unchanged all frames.
- **Top-right minimap:** framed parchment-style panel, grid columns "0 1 2 N 3 4 5", rows "0..5", gold glyphs marking points of interest (torii/shrine glyph, U-shape, Π-shape, X-marker), dashed white arrow path pointing player direction, white up-arrow + triangle marker = player position. Footer text "TERRITORY (23,52)" always on screen; "SECTOR (2,4)" at t=02:30–02:32, changes to "SECTOR (2,3)" from t=02:32 onward (frame_0007+) — confirms a sector boundary crossing mid-segment.
- **Location banner (top-left, below resources):** dark-brown bordered box, gold bold caps text. Reads "S CHIKADA FOREST" t=02:30–02:31 (frames 1–3), then "CHIKADA FOREST" t=02:34 onward (frame_0009+) — zone name shortens after the transition.
- **Quest line (white caps, below banner):** "STORY QUEST: FIND WORK AT KAKUCHI TOWN" — present whenever the banner shows, disappears during the brief location-transition popups.
- **Location-transition popups (temporary, replace quest line):** a stacked list of footprint-icon rows naming adjacent sub-zones/exits, e.g. single row "S CHIKADA FOREST (S)" (t=02:32, frame_0006; t=02:34, frame_0008), or two-row list "S CHIKADA FOREST (S)" + "CHIKADA FOREST (N)" under header "CHIKADA FOREST" (t=02:34, frame_0009). Each row = brown pill button with a footprint icon, presumably a fast-travel/waypoint menu triggered by proximity to a signpost.
- **Full black frame:** exactly one full-black frame at t=02:33 (frame_0007) — a hard cut/loading flash between two Chikada Forest sub-areas (background art changes from live-green trees to bare/dead grey-teal trees immediately after).
- **Bottom-left player HUD:** circular portrait (straw-hat samurai, red ring), green HP bar "19 / 20", blue CHI bar "26 / 26", red circular "+" button beside bars, label "HEAVY STANCE" beneath — unchanged for the entire 8s (no damage, no chi spend).
- **Bottom-center icon strip (left to right):** speech-bubble/ellipsis icon ("..." chat), brown teardrop/leaf icon, yin-yang icon, crossbow/bow icon, scroll+pin icon, grey hexagon/gem icon, black ninja silhouette icon, gear/settings icon. Consistent across all frames — persistent overworld quick-menu.
- **Player name tag:** "SOUND360TM" in yellow text floating above the character's head at all times — this is a streamer/player nickname overlay, not a game-native UI element (do not recreate).
- **World art:** 2D side-view forest, teal-desaturated color grade, layered parallax trees (dark silhouette background, mid-green foliage, foreground grass strip that scrolls at character speed). Wooden signposts carved with directional letters ("N"/"S" at t=02:30–02:33, "E" at t=02:36–02:38) beside a stone lantern prop. Scattered rocks/boulders as ground clutter.

## Mechanics observed (rules, numbers, timings, damage/HP/cost values you can read — cite frame t=MM:SS for each claim)
- HP: 19/20 constant, t=02:30 through t=02:38 (frames 1–16) — no damage taken while traversing.
- CHI: 26/26 constant, same range — no chi spent by running.
- Coins: 425 constant; Gold: 2 constant — no pickups in this window.
- XP: 14391/16350 constant, level badge "7" constant — no XP gained from walking.
- Territory coordinate fixed at (23,52) for the whole segment; Sector changes from (2,4) → (2,3) between t=02:30–02:32 and t=02:32 onward, i.e. one sector step occurs mid-traversal (frame_0005→frame_0006, ~t=02:32).
- One hard scene-cut (full black, single sampled frame) occurs at t=02:33 (frame_0007), marking a sub-zone load boundary inside "Chikada Forest."
- Location name shortens from "S Chikada Forest" to "Chikada Forest" after that cut (t=02:34, frame_0008 still shows "S Chikada Forest" transiently, frame_0009 t=02:34 shows plain "Chikada Forest" banner) — suggests "S Chikada Forest" and "Chikada Forest" are two contiguous but distinct sub-areas of the same named region, both listed as waypoint options from a signpost trigger.
- By t=02:38 (frame_0016) a new transition label "CHIKADA MOUNTAIN PATH (E)" appears next to an "E" signpost — the player is approaching the boundary into a third area just as the sampled window ends.
- Stance label reads "HEAVY STANCE" throughout — stance is displayed on the overworld HUD even outside combat, i.e. stance is a persistent player-state, not combat-only UI.

## Story/dialogue     (OWN-WORDS summary; names/quest titles OK; no verbatim dialogue)
No dialogue in this window. The active objective, shown as a standing quest banner, is to travel toward Kakuchi Town to find work — consistent with an early-game fetch/travel quest. The player (tagged "SOUND360TM") is simply walking/running east through the Chikada Forest region, crossing at least two named sub-areas (S Chikada Forest, Chikada Forest) and about to enter a third (Chikada Mountain Path) by the end of the clip. No NPCs, no combat, no cutscene text appear.

## Feel               (pacing, camera, animation weight, FX; if combat: rough per-encounter durations in seconds)
- Pure traversal beat: character runs continuously rightward for the full 8s with only one interruption (the black-flash zone cut at t=02:33).
- Camera: fixed side-view, world scrolls under a roughly screen-locked player sprite; multi-layer parallax (background trees near-static, foreground grass scrolling faster) gives modest depth.
- Character animation: sprint/run cycle, torso leaning forward, sheathed katana bouncing against the back, cloth/hakama trailing — reads as lightweight, floaty run rather than a heavy, grounded stride.
- Zone transitions are abrupt: no fade, just a single black frame then the new background pops in — likely a very short (≤1 frame in our 2fps sample, so under ~0.5s) hard cut rather than a cross-fade.
- Transition popups (footprint waypoint lists) appear to be proximity-triggered by the signposts and auto-dismiss once past them (quest banner returns within ~1–2s of the popup appearing).
- No combat FX, no hit-stop, no particle effects in this window — purely ambient exploration.

## Recreation notes   (config values to add/adjust, which build Stage this maps to, anything contradicting the repo's spec/research docs)
- **This segment does NOT match the requested "post-win inventory/loadout" beat.** No equips screen, stats tab, Bandana, LEVEL REQUIRED warning, weight/overweight state, or YOU WIN screen appear anywhere in 2:30–2:38 of video B. Recommend the sweep owner re-scan video B for the actual post-win inventory moment (likely a different timestamp) before treating this file as covering that beat.
- What *is* here is useful for a different build concern: **overworld traversal HUD + zone-transition system** (persistent resource bar, XP bar, minimap with territory/sector coordinates, location banner, footprint waypoint popups, hard-cut zone loading, always-visible stance label). If SSHD 1:1's build has (or will have) an overworld/hub scene, these are the reference values:
  - Persistent player-state bars (HP/CHI) and stance label shown at all times, not gated to combat scenes.
  - Two-tier location naming: parent region name + directional sub-area suffix (e.g. "S Chikada Forest" vs "Chikada Forest (N)"), exposed via signpost-triggered popups.
  - Minimap uses an (x,y) "Territory" coordinate plus a separate small "Sector" grid coordinate that increments as the player crosses local zone boundaries — two coordinate systems, not one.
- No combat numbers, damage ticks, prices, or item drops to log in this window — nothing here maps to Stage combat-tuning work.
- Because the streamer name tag ("SOUND360TM") is a third-party overlay burned into the source capture, it must not be treated as a game-native UI element in any recreation.

## VERIFIED
All 16 sampled frames (t=02:30 through t=02:38) were read and cross-checked against each other for HUD value consistency (HP/CHI/coins/gold/XP/territory all confirmed unchanged except the noted sector-index change and location-banner text change). The content mismatch versus the requested "post-win inventory" topic was confirmed by inspecting every frame in the range — no inventory/equip screen appears at any sampled point in this 8-second window.
