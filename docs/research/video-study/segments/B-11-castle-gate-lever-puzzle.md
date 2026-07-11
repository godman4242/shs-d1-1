# B-11 Castle Gate lever puzzle (25:01–27:00)

## Screens & layout   (positions, colors, typography, exact HUD contents; short UI labels verbatim OK)

**Combat HUD (top-left, during fights):**
- "AUTO SLASH OFF" toggle button, top-left, brown/tan bordered box.
- Player portrait bottom-left: circular red-ringed headshot icon, stance name label underneath (e.g. "HEAVY STANCE"), a thin green bar (labelled e.g. "3/20" or "4/20" — reads as a resource/stamina-type meter, NOT the blue HP bar) and a thick blue bar below it labelled "47/47" (this is HP — stayed pinned at 47/47 the whole segment, i.e. player took no damage). Yellow text under the bars: "CANNOT CHANGE STANCE" and "150% DAMAGE" (active buff banner).
- Top-right during combat: large red numeral + black plate reading "HIT COMBO" (e.g. "2", "4", "8", "10" then resets to "1" on a kill) — combo counter that increments per hit landed and resets to 1 after an enemy dies. Pause button (red circle, "II") top-right corner.
- Enemy health bars: thin horizontal green bar floating above each enemy sprite, no numeric HP shown, just a depleting green fill.
- On-screen enemy name tag "SOUND360TM" floats above the player character at all times (likely a debug/watermark artifact, not a game label — appears in every frame, including over enemies' heads at times, so treat as video-source watermark, not UI).

**Victory screen (t=25:16–25:21, and again ~26:45–26:48):**
- Full-bleed dark red background, black silhouette grass/ground strip at bottom.
- Large red-and-white outlined title text "YOU WIN" centered, sitting above a ragged black "ink splatter" graphic that grows in on a short animation (splatter appears small then expands across 2 frames).
- Player silhouette (holding oversized sword) stands in the grass silhouette at bottom center; a second, smaller defeated-enemy silhouette is visible to the right.

**Exploration HUD (non-combat, castle exterior/interior):**
- Top-left: currency/XP bar — coin icon "461 COINS", gold-coin icon "2 GOLD" with a red "GET GOLD" button, diamond-gem icon showing player level "8" next to a yellow XP progress bar reading "19871 / 20900 EXPERIENCE POINTS" (top-right corner).
- Below that, a location breadcrumb/tab strip: two stacked tabs, e.g. "CASTLE OUTER WALLS" (unselected, dim) and "CASTLE GATE" (selected, with an eye icon prefix indicating "currently viewing/discovered"). Later this becomes a single tab "CASTLE INNER WALLS".
- Quest banner directly under the location tabs: "STORY QUEST: RETURN TO THE OLD GUARD HIDEOUT" (yellow/white text, brown plate).
- Top-right: an ornate gold-framed square minimap/compass panel labelled N (top), S (bottom), W (left), E (right), with a small yellow player-direction icon (arrow/triangle, rotates to show facing) inside a black field. Below the panel: "TERRITORY (24.52)" and "INSIDE SECTOR (3.0)" — both values static all segment (t=25:23 through t=26:58).
- Bottom-left player HUD (exploration variant): portrait, green bar "3/20", blue bar "47/47", stance label "HEAVY STANCE", a red "+" button.
- Bottom icon dock (exploration): chat bubble "···", stance yin-yang icon, a bow/weapon icon, a scroll/item icon, a stone/currency icon, a black ninja-mask icon, a gear/settings icon.
- Bottom-right corner during exploration: yellow text "150% DAMAGE" + a live countdown timer MM:SS (observed values: 10:15, 10:12, 10:10, 10:07 … down to 08:34 by end of segment — decreasing at real-time rate, i.e. an active timed buff, not paused while walking/building).
- Wooden directional signposts appear in the level with single-letter labels burned into a board: "W" (t=26:00) and "E" (t=26:05, t=26:13) — simple compass-direction waypoint markers planted in the ground.

**Locked-gate dialog (t=25:23):**
- Modal popup, dark wood-grain panel with gold corner-flourish ornaments, centered on screen, dims the background.
- Body text (verbatim, short functional UI copy): "THE GATE IS LOCKED. PULL THE LEVERS THAT CONTROL THE GATE TO OPEN IT."
- Single red "OK" button, gold border, centered below the text.

**Gate door art:** large ornate wooden double-door set into the tiled castle wall, dark brown planks, a circular brass/gold hub-and-spoke medallion centered on the door (looks like a stylized mon/crest boss), visible at t=25:26–25:36 and again briefly later.

**Ladder-build overlay (recurs twice, t=25:33–25:46 and t=26:15–26:20, then t=26:48–26:58):**
- A wooden ladder sprite rises against the wall.
- Above it, a black horizontal progress-bar box with white fill and centered label "BUILDING…" (first instance) or "BUILD LADDER" (second instance, label sits directly under the player's name tag instead of above the ladder).
- Progress bar fills left-to-right over several seconds while the player character stands still at the ladder's base holding an item.

**"GET LOST!" bubble (t=26:23):** a plain white speech-bubble with black text "GET LOST!" anchored near the ladder/gate area — no speaker sprite visible in frame (letterboxed transition shot), reads as a rejection/blocked-action line rather than lever-puzzle dialogue.

## Mechanics observed (rules, numbers, timings, damage/HP/cost values you can read — cite frame t=MM:SS for each claim)

- Player stats this segment: Level 8, XP 19871/20900 (t=25:23, static through segment), Coins 461, Gold 2 (t=25:23).
- HP bar (blue) stayed at 47/47 the entire segment (t=25:23 through t=26:58) — player took zero damage in either combat encounter shown.
- Green bar under HP fluctuated 4/20 → 2/20 → 3/20 across frames (t=25:01 shows 4/20, t=25:13 shows 2/20, t=26:20+ shows 3/20) while label reads "CANNOT CHANGE STANCE" — reads as a stance-lock/special resource, spent then slowly regenerating, capped at 20.
- "150% DAMAGE" buff has a live countdown clock: 10:15 (t=25:23) → 10:12 (t=25:26) → 10:10 (t=25:28) → 10:07 (t=25:31) → 10:05 (t=25:33) → 10:02 (t=25:36) → 10:00 (t=25:38) → 09:57 (t=25:41) → 09:55 (t=25:43) → 09:53 (t=25:46) → 09:50 (t=25:48) → 09:49 (t=25:51) → 09:46 (t=25:53) → 09:44 (t=25:56) → 09:41 (t=25:58) → 09:29 (t=26:00) → 09:27 (t=26:03) → 09:24 (t=26:05) → 09:20 (t=26:13) → 09:17 (t=26:15) → 08:44 (t=26:48) → 08:41 (t=26:50) → 08:39 (t=26:53) → 08:36 (t=26:55) → 08:34 (t=26:58). Ticks down consistently at real-time rate even through combat and the YOU WIN screen (a ~33s jump between t=26:15 and t=26:48 matches the elapsed real video time, i.e. the buff timer is not paused by combat or victory screens).
- Hit-combo counter observed sequences: first fight (pre-existing, tail end) climbs 2→4→8→10 then resets to 1 on kill (t=25:01–25:11); second fight (t=26:33–26:45) climbs 1→2→5→7 then the encounter ends in YOU WIN at t=26:45–26:48. Neither encounter is shown reaching or exceeding 7 combo hits within this window before victory — the map-context "7-hit-combo fight" appears to correspond to this second encounter (peak observed = 7 at t=26:45).
- Ladder build #1: progress bar visibly fills from near-empty (t=25:38) to roughly half (t=25:58) over ~20s of screen time; the actual wall-crossing/scene-cut to "Castle Inner Walls" happens off-frame between t=26:00 (already inner walls, ladder gone) — so full build likely completes somewhere in the ~20–35s range.
- Ladder build #2 ("BUILD LADDER" label, t=26:15) is interrupted by the "GET LOST!" bubble (t=26:23) and a combat encounter (t=26:33–26:48) before resuming after the YOU WIN screen; a third ladder-build instance restarts from empty at t=26:48 and is still filling (roughly 1/8 full) by segment end at t=26:58.
- Territory/Sector readout is static all segment: "TERRITORY (24.52)" / "INSIDE SECTOR (3.0)" (t=25:23–26:58).
- No lever, lever-pull animation, or lever-puzzle UI is visible anywhere in the 25:01–27:00 window — only the locked-gate dialog text (t=25:23) and the player subsequently building ladders to scale the wall instead of pulling levers.

## Story/dialogue     (OWN-WORDS summary; names/quest titles OK; no verbatim dialogue)

The player finishes off a skirmish outside the castle wall and gets a "You Win" banner. Approaching a large ornate gate, a popup explains the gate is locked and can only be opened by pulling levers somewhere on the wall/gate structure — but rather than showing the player find and pull any levers, the recorded footage instead shows them building a wooden ladder to scale the outer wall directly, bypassing the gate. On the far side ("Castle Inner Walls") the active story objective is to head back to what's referred to as the old guard's hideout. The player continues along, passes a couple of plain wooden signposts marking west/east directions, starts building a second ladder, gets rebuffed with a curt "get lost" from an unseen source, fights off a short group of enemies (peaking at a 7-hit combo), wins again, and resumes ladder-building afterward.

## Feel               (pacing, camera, animation weight, FX; if combat: rough per-encounter durations in seconds)

- Combat is fast and punchy: each strike produces a quick red slash trail and a small burst of blood particles on the enemy; kills leave ragdoll bodies lying in the grass that stay visible as set-dressing afterward.
- Camera is a fixed side-scroll view, no zoom/pan observed within combat; only cut transitions (hard cuts, occasionally with a brief full-black frame or a horizontal letterbox/cinematic-bars shot) mark zone changes (Outer Walls → Gate area → Inner Walls).
- Encounter durations (rough, from frame timestamps): tail-end of first encounter shown lasts only ~10s before YOU WIN (t=25:01→25:11); second full encounter (multiple yellow-hatted spear/sword enemies) runs roughly t=26:33→26:45, about 12s of active combat before the win screen.
- Ladder-building is a slow, deliberate downtime beat — player stands still holding an item while a progress bar fills, contrasting with the fast combat; no camera movement or particle FX during builds, just the bar and "BUILDING…"/"BUILD LADDER" text.
- The YOU WIN screen uses a short "ink splatter" reveal animation under the title text (splatter shape appears to still be growing/settling across the 2–3 captured frames) before holding on the full screen for a beat.

## Recreation notes   (config values to add/adjust, which build Stage this maps to, anything contradicting the repo's spec/research docs)

- **Contradicts the map-context framing**: the task brief describes this segment as showing "the lever puzzle" itself, but the captured 25:01–27:00 window only shows the locked-gate warning dialog text and then the player *avoiding* the puzzle by building a scaling ladder. No lever mechanic, lever sprite, or lever-pull animation appears on screen in this window — worth flagging to whoever maps mechanics so the actual lever-pull footage (if it exists) is looked up in an adjacent segment (likely just before 25:01 or just after 27:00).
- Locked-gate dialog copy is short enough to use verbatim as a functional UI string: "THE GATE IS LOCKED. PULL THE LEVERS THAT CONTROL THE GATE TO OPEN IT." (14 words, under the 15-word verbatim-OK threshold) — safe to reuse directly or paraphrase minimally for our gate-lock modal.
- Ladder-build mechanic is a real, config-relevant gameplay beat distinct from combat: a timed progress-bar action (CONTRACT: needs a duration value — not readable exactly from frames, estimate 15–25s per ladder from timer deltas) that gates traversal between "Outer Walls" and "Inner Walls" sub-areas. Two consecutive ladder-builds occur in this short span, suggesting ladders are a repeatable/per-wall-segment traversal mechanic, not a one-time cutscene.
- The "150% DAMAGE" buff with a live MM:SS countdown (ticking through combat, victory screens, and traversal without pausing) is a good reference for how our own buff timers should behave — real-time decay independent of scene/state.
- Two visually distinct HUD number pairs need separate config semantics: the small green "X/20" bar (stance-lock resource, label "CANNOT CHANGE STANCE") vs. the blue "47/47" bar (actual HP, untouched all segment) — do not conflate these as the same stat when porting to `src/config`.
- Combo-counter reset-to-1-on-kill (not reset-to-0) is worth confirming against other segments before hardcoding into `Sim`.
- Directional signposts ("W"/"E") in Castle Inner Walls suggest simple text-labeled waypoint markers rather than icon-based ones — cheap to recreate procedurally (text on a wood-plank sprite) without needing image assets, consistent with the repo's procedural-vector-art-only constraint.
- Zone breadcrumb tabs ("CASTLE OUTER WALLS" → "CASTLE GATE" → "CASTLE INNER WALLS") imply a simple linear area-naming convention for HUD location text; useful for whatever Stage adds the castle traversal area (likely a post-combat, pre-boss traversal Stage per repo's staged build discipline).

## VERIFIED
