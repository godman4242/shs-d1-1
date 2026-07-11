# B-02 Chikada Dojo Gates and corridor (2:38–3:57)

## Screens & layout   (positions, colors, typography, exact HUD contents; short UI labels verbatim OK)

**Persistent HUD (all frames, non-combat):**
- Top-left: coin icon + "425" (COINS label below), red "+" add button, gold coin icon + "2" (GOLD label below), red "GET GOLD" button.
- Top-right: fan/scroll icon + "14391 / 16350" (EXPERIENCE POINTS label below) — unchanged all segment (t=02:40 through t=03:47).
- Below coins: location name banner in a dark brown parchment box with gold border, e.g. "CHIKADA MOUNTAIN PATH" (t=02:40), "E CHIKADA MOUNTAIN PATH" (t=02:45), "E CHIKADA FIELD" (t=02:48), "CHIKADA DOJO GATES" (t=03:00, t=03:27), "DOJO ENTRANCE" (t=03:30), "CORRIDOR" (t=03:37, t=03:40), "TRAP CHALLENGE" (t=03:47, t=03:52).
- Below banner: "STORY QUEST: FIND WORK AT KAKUCHI TOWN" in smaller white text, persists through the whole segment.
- Bottom-left: player portrait roundel (red ring) + HP bar "19 / 20" (green) + Chi/stance bar "26 / 26" (blue), label "HEAVY STANCE" beneath, red "+" button beside portrait.
- Bottom action bar (outdoor/exploration): chat-bubble icon, brown shell/leaf icon, yin-yang icon, wooden loom-frame icon, yellow scroll/paper icon, gray hexagon-stone icon, black ninja-silhouette icon, gear/settings icon — 8 icons total, evenly spaced, light gray strip background.
- Top-right minimap (outdoor overworld): 6×6 grid (columns 0–5, rows 0–5 labeled), gold ornate corner brackets. Icons seen inside grid: torii-gate glyph (top area, static POI), yellow up-arrow (player position marker), gold play-triangle + dashed line (facing/path indicator), a "U-turn" glyph (∩), an "X" glyph, and a "П"-shaped glyph (gate icon) near bottom — these are fixed territory landmark icons, not moving. Below grid: "TERRITORY (23,52)" then "SECTOR (x,y)" — sector value increments as player walks: (3,3)→(4,3)→(5,3)→(5,4) across the segment (t=02:38 to t=03:00).
- When player enters the dojo building interior (t=03:30 onward) the minimap swaps to a compass-style panel: cardinal letters N (top) / W (left) / E (right) / S (bottom) around a vertical/horizontal track with a triangular player marker and a "∩" U-turn icon; label under it changes from "SECTOR (5,4)" to "INSIDE SECTOR (5,4)" (t=03:30) and later a location-specific right-aligned callout appears, e.g. "TRAP CHALLENGE (N)" (t=03:42, t=03:47).

**Field interaction prompts:**
- t=02:48 "E CHIKADA FIELD": brown prompt box, hand icon + "SEARCH POT" + right-aligned "2 AP" cost — an action-point-gated search interaction on a pot prop.
- t=02:58: floating white label "CHIKADA DOJO (S)" over player head — directional POI callout, pointing south.
- t=03:00 "CHIKADA DOJO GATES": yellow "HARVEST" label with a downward chevron arrow pointing at a "VEGETABLE PATCH" signboard prop in front of the dojo's side building; a star/sparkle icon also appears on the minimap POI cell.
- t=03:03: opening a sub-menu on the vegetable patch — brown "VEGETABLE PATCH" title box, hand icon + "HARVEST" row, left-arrow icon + "BACK" row. Simultaneously a right-side panel "RARE CROPS COLLECTION (0%)" shows a 2×3 grid of gray locked slots each with a white "?" placeholder — a crop-collection meta-progression UI, currently empty.
- Below/behind (partially cut off at t=03:00): "VEGETABLES READY FOR HARVEST" and "SOIL GRADE 1 (HARVESTED 0/10)" — confirms a soil-grade tiering with a per-grade harvest counter (target 10).
- t=03:22 "CHIKADA DOJO GATES" resurfaces with sub-item "VEGETABLE PATCH" still listed under it, meaning the patch remains a persistent interactable at the gate location after harvesting.
- t=03:32 "DOJO ENTRANCE" indoors: yellow "LOOK AT SIGN" label near a wooden sign post — a lore/flavor-text interactable, not gated by AP.
- t=03:45 "TRAP CHALLENGE": brown box, eye icon + "LOOK AT SIGN" row — same sign-reading affordance reused inside the trap room.

**Combat/harvest-slash overlay (t=03:05–03:18, "vegetable patch slashing" minigame):**
- Top-left toggle box: "AUTO SLASH OFF" (persistent throughout the minigame — manual mode).
- Top-right: red circular pause button (⏸).
- Center dialogue bubble (tutorial-style, first-time prompt): "SLASH THE VEGETABLE PATCH TO HARVEST. DRAW A LINE TO SLASH." with a down-pointing chevron aimed at the vegetable patch — same slash-to-attack UI paradigm as combat (draw-a-line gesture).
- A green horizontal health/durability bar sits above the vegetable patch target and depletes red as it's slashed (visible full-green at t=03:05, half-depleted by t=03:10, mostly red by t=03:13, tiny sliver by t=03:15).
- HUD during minigame: HP "19/20" green, Chi "26/26" blue bar, but label under portrait reads "CANNOT CHANGE STANCE" instead of "HEAVY STANCE" — stance-locking during the harvest minigame.
- Bottom-right: two numbered ability-slot icons visible, "2" (a brown/tan icon) and "3" (a yellow up-arrow icon); a first slot area is present but empty/unlabeled in these frames.
- Combo counter, top-right, large red number + "HIT COMBO" label beneath in a black ribbon: seen at 2 (t=03:10), 3 (t=03:13), 6 (t=03:15), 9 (t=03:18) — combo climbs with consecutive successful slashes on the patch.
- A carrot icon is shown flying off the patch at t=03:15, confirming "carrot" as (at least one) harvestable vegetable-patch drop sprite.
- t=03:20: a full-screen dark-red flash/silhouette transition frame (harvest-complete stinger) showing a black silhouette of the player crouched over the patch against solid red — a reward/completion flash effect, very brief (~1 frame captured).

**Dojo exterior architecture (t=03:00–03:27):**
- Two-story Japanese building: dark slate-tiled sloped roof, cream/tan wall panels with dark wood trim, shoji-style windows with white/cream paper grid panes, orange/brown wood-grain sliding gate doors at center with two dark oni/lion-mask door-pull ornaments.
- A wooden sign above the gate doors bears a kanji character "道場" (dojo) rendered as pixel-art-style glyph in a cream panel — décor only, matches the location name.
- Green bamboo stalks (vertical, tall, thin) frame the scene as foreground/midground dressing on both sides.
- Wooden directional sign-posts (brown, arrow-shaped placards) mark N/S/W/E cardinal exits at ground level outside, and reappear inside as plain unlabeled directional posts.

**Dojo interior (t=03:30–03:55):**
- Corridor rendered as a flat side-view row of tall shoji sliding-door panels (cream paper grid, dark wood frame/pillars) repeating as a tileable background — architecturally identical panel unit repeated ~4–5 times per screen width.
- Floor is a dark reddish-brown wood plank strip along the very bottom of the screen.
- A closed dark doorway gap appears mid-corridor at t=03:27 (frame with "GO TO TRAP CHALLENGE" floating prompt) — a specific dark rectangular gap breaks the repeating shoji-panel pattern, marking the trap-room entrance.
- Trap Challenge room (t=03:45): visible on the floor is a large gray circular saw-blade / buzzsaw hazard prop sitting stationary at floor level — a visible environmental hazard telegraphed before the player engages it. Wooden sign-posts (unlabeled directional arrows) also present.
- t=03:52–03:55: player runs and performs a mid-air jump animation (both feet off ground, sword angled down-forward) heading north per the "TRAP CHALLENGE (N)" minimap callout — consistent with a platforming/obstacle-avoidance segment rather than combat.

## Mechanics observed (rules, numbers, timings, damage/HP/cost values you can read — cite frame t=MM:SS for each claim)

- HP 19/20, Chi/Stance meter 26/26 — constant across the whole segment, no damage taken (t=02:40 through t=03:55).
- XP 14391/16350 — unchanged the entire segment; no XP awarded for walking, sign-reading, or the vegetable harvest shown here (t=02:40 → t=03:47).
- Coins 425, Gold 2 — unchanged the entire segment; harvesting the vegetable patch in this clip does not visibly add coins (t=02:40 → t=03:47), though a reward flash occurs at t=03:20 (possibly item/XP granted off-screen or on the cut frame).
- "SEARCH POT" interaction costs "2 AP" (Action Points) — t=02:48. First AP-cost figure seen in this study; confirms an AP-gated field-interaction system separate from combat.
- "SOIL GRADE 1 (HARVESTED 0/10)" — t=03:00 (partially visible before menu opens fully): harvest progress is tracked per soil grade, target count 10 per grade, starting at 0.
- "RARE CROPS COLLECTION (0%)" with a 2×3 (6-slot) locked grid — t=03:03: a meta-collection tracker for rare crop drops, all 6 slots unrevealed at this point in the playthrough.
- Hit-combo counter during the slash-harvest minigame climbs 2 → 3 → 6 → 9 across roughly 8 seconds (t=03:10 to t=03:18), i.e. combo count is not strictly 1 increment per slash-swipe — jumps of +3 observed (3→6, 6→9), suggesting either multi-hit swipes or the counter batching hits per gesture.
- Vegetable-patch green health/durability bar depletes to empty within that same ~8-second window (t=03:05 full → t=03:18 nearly empty) — approx. 8–10s to fully harvest one patch via manual slashing.
- Minimap sector coordinates increment by exactly 1 per screen/room transition while outdoors: (3,3)→(4,3)→(5,3)→(5,4) over t=02:38→03:00, confirming a fixed per-screen sector-grid movement model (matches prior segments' finding).
- Stance is HEAVY STANCE throughout exploration (t=02:40 etc.) but becomes explicitly locked ("CANNOT CHANGE STANCE") during the slash-harvest minigame (t=03:05–03:15) — minigames suspend stance-switching.
- "AUTO SLASH OFF" toggle present but not engaged in this playthrough — implies a player-togglable auto-slash assist option exists for the harvest minigame (relevant for accessibility/auto-play parity in our recreation).

## Story/dialogue     (OWN-WORDS summary; names/quest titles OK; no verbatim dialogue)

No new spoken/written story dialogue appears in this segment. The active story quest banner "Find work at Kakuchi Town" persists throughout, unchanged from earlier segments — the player is still traveling toward Kakuchi Town and passing through Chikada Mountain Path, a field, and the Chikada Dojo along the way. This segment is pure traversal/exploration: walking from the mountain path, through a field with a searchable pot prop, arriving at the Chikada Dojo's outer gates, harvesting a roadside vegetable patch there (a minor side-activity, not the main quest), then entering the dojo itself and walking down an interior corridor toward a room explicitly labeled "Trap Challenge" — implying an upcoming obstacle/hazard gauntlet inside the dojo, distinct from the main story thread.

## Feel               (pacing, camera, animation weight, FX; if combat: rough per-encounter durations in seconds)

- Camera is a fixed side-scrolling 2D view; player auto-runs/is walked rightward and leftward across screens with brief scene-transition wipes between sectors (visible as thin black filmstrip-like frames at t=02:53, 02:55, 03:50 — likely fast pan/blur transition artifacts captured mid-motion by the sampler, not deliberate cutscenes).
- Pacing is unhurried: simple back-and-forth walking, occasional idle direction changes, with UI prompts ("Harvest", "Look at Sign", "Go to Trap Challenge") surfacing contextually as the player nears interactable props — a soft-guidance design (no forced stop, just an overlay chevron/label).
- The harvest minigame has noticeably punchier feedback vs. plain walking: red combo-counter pop-in with bold number + "HIT COMBO" text, a depleting green bar, and a mid-air carrot sprite flying off on a successful hit — same visual language (draw-a-line slash, combo counter) as core combat, reused for a non-combat resource-gathering activity. Full harvest resolves in roughly 8–10 seconds of active slashing.
- A brief (likely sub-second, single captured frame) full-red screen with a black silhouette plays at harvest completion (t=03:20) — a stylized "impact/reward flash" transition, consistent with the game's flat, high-contrast 2D aesthetic seen elsewhere.
- Interior dojo corridor pacing is slower and more atmospheric than outdoor screens — repeating architectural panels, muted brown/cream palette, no wildlife/birds (birds were present outdoors at t=02:45 and t=02:58 but absent indoors), building tension toward the "Trap Challenge" callout.
- The jump animation at t=03:52–03:55 (full body airborne, sword tilted) reads as a deliberate platforming beat — heavier, more committed motion than the light running/walking cycle used elsewhere, signaling the trap room requires timed jumps/dodges rather than dialogue or combat.

## Recreation notes   (config values to add/adjust, which build Stage this maps to, anything contradicting the repo's spec/research docs)

- Confirms (again, consistent with prior segments) an AP (Action Points) resource used for field interactions distinct from HP/Chi — "SEARCH POT: 2 AP" is a concrete number to log in `config/` as an INFERRED action-point cost for a generic "search" interaction type once that system is built (Stage TBD — likely a post-core-combat "world interaction" stage, not Stage 0/1 combat scaffolding).
- Vegetable-patch harvesting reuses the exact combat slash-gesture and combo-counter UI (draw-a-line, HIT COMBO ribbon) for a non-combat gathering minigame — worth noting in `src/game/CLAUDE.md` or a future minigame-scoping doc that the slash input system should be built generically (target-agnostic: enemy hitbox vs. harvest-node hitbox) rather than combat-only, to support 1:1 reuse later.
- "SOIL GRADE 1 (HARVESTED 0/10)" and "RARE CROPS COLLECTION (0%)" indicate a farming/collection meta-system with graded soil and a rare-drop collection log — out of scope for early combat-focused stages but worth a placeholder note in a future features/backlog doc; do not build yet per current staged-gate discipline.
- Minimap's dual-mode behavior (outdoor 6×6 territory/sector grid vs. indoor compass-style N/W/E/S "inside sector" panel) is a concrete UI-state contract to capture in `config/` or a minimap research doc when that HUD element is built — two distinct minimap render modes keyed off indoor/outdoor location state.
- "AUTO SLASH OFF" toggle is a discoverable accessibility/convenience option for the harvest (and likely combat) slash mechanic — flag for later UI/settings-scope research; not contradicting any existing spec, just a new UI element to catalog.
- Nothing in this segment contradicts existing invariants (Heavy Stance naming, slash-to-attack input paradigm, sector-based world grid) already documented in prior segment notes — this is additive detail, not a correction.

## VERIFIED
