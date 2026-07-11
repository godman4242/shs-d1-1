# A-08 World Map screen (Nagano territory grid) (18:10–19:30)

## Screens & layout   (positions, colors, typography, exact HUD contents; short UI labels verbatim OK)

**Persistent HUD (all overworld frames)**
- Top-left: item/coin pouch icon + coin count, label "COINS" below (t=18:10, value **118**).
- Top-center: red banner button "REGISTER", subtext "TO SAVE YOUR PROGRESS AND PLAY ONLINE!" (persistent nag, non-interactive during this segment).
- Top-right: diamond-shaped level badge with number **4**, next to a horizontal XP bar (yellow fill) reading **3448 / 5150**, label "EXPERIENCE POINTS" below.
- Bottom-left: circular player portrait (straw hat samurai icon) on red ring; two stacked bars — green HP bar **20 / 20**, blue stamina/chi bar **15 / 15**; stance label **"HEAVY STANCE"** beneath (t=18:10 onward, unchanged all segment).
- Bottom-center: 7-icon action bar (left→right): chat-bubble icon, brown teardrop/leaf icon (tooltip on hover reads **"PLAYER"**, t=18:48 frame_0014), yin-yang icon (stance switch), bracket-shaped katana/sword icon (equipment), scroll/parchment icon, grey hexagon/gem icon, black ninja-mask icon, gear icon (settings) — rightmost.
- Top-right minimap widget (compass-style): a bordered wood-frame box with N/W/E/S labels at that zoom; shows either (a) a simple directional compass with a single triangular player marker + "▶"/"◀" arrows when far from a sector (t=18:10–18:22, "TERRITORY (22,51) / INSIDE SECTOR (2,4)"), or (b) a detailed local 6×6 grid minimap with dashed yellow pathline, castle-town icon, exclamation-mark quest icon, and a black X (destroyed marker), player as a yellow arrow (t=18:28 onward, "TERRITORY (22,51) / SECTOR (2,4)" — label drops "INSIDE" once in the detailed grid mode).

**Quest banner (location-label box, top-left)**
- Location name banner e.g. "INN", "CASTLE TOWN ENTRANCE", "TOSHIBARA CASTLE TOWN GATES", "S TOSHIBARA FOREST", "SE TOSHIBARA FOREST", "E TOSHIBARA FOREST".
- Directly beneath it, quest text appears in a second banner line:
  - t=18:15 "STORY QUEST: MEET UP WITH HIROSHI AT THE RENDEZVOUS POINT" (new quest just triggered).
  - t=18:52 onward: "SIDE QUEST: GET BLACK BALD HERB FOR YOKO" (quest text swapped after Quests-menu inspection, replacing the story-quest line in the HUD — implies only one "current/tracked" quest banner shows at a time, not both).

**"Enter Inn" / rest sequence (t=18:10–18:12)**
- Modal dialog, brown/red parchment-style frame with gold corner ornaments, dark red/black gradient background silhouette of a robed figure. White bold centered text: **"YOU FEEL REFRESHED."** Single red "OK" button, white bold label, centered.
- Behind the modal: Inn interior — tatami-toned walls, a Japanese landscape screen painting (mountains/pine trees) on the left, a low table with 2 sitting NPCs, sake barrels ("酒" characters) on a shelf, an NPC labeled "GUEST" standing (this appears to be the player's own character, oddly tagged "GUEST" rather than a name — possibly the default multiplayer/anonymous player tag pre-login).
- Left panel menu: "INN" header, then two rows: "💬 TALK TO INN KEEPER", "💬 TALK TO YASUKA" (both brown buttons w/ chat-bubble icon).

**Castle Town exterior (t=18:20–18:28)**
- Location label: "CASTLE TOWN ENTRANCE". Action-prompt menu: "👣 ENTER INN" (footprint icon = walk-in prompt).
- Two-story wooden building w/ tiled dark-green roof, bamboo blinds in windows, pink door awning, kanji signboard "客" (guest/customer) hanging by the door.
- Left of the building: a wooden signboard labeled "RECENT HAPPENINGS BOARD" (interactable prop).
- Background NPCs: unnamed grey-robed walker, and one labeled **"YOKO"** in blue name-tag text (a townsperson, walking near a house door).

**Recent Happenings Board menu (t=18:22)**
- Header "RECENT HAPPENINGS BOARD". Two options: "👁 VIEW MORE...", "⬆ LEAVE". Body text (once opened): **"NO EVENTS RECORDED."**

**Toshibara Castle Town Gates (t=18:30–18:45)**
- Large gold-and-black torii/gate structure, bamboo-forest foreground overlay (green bamboo stalks in front of camera as parallax foreground layer).
- Location label "TOSHIBARA CASTLE TOWN GATES"; action prompt "👣 CASTLE TOWN ENTRANCE" (footprint = travel-back prompt).
- Wooden directional signpost prop near the gate.
- A black bird/crow sprite flies across background at one point (t=18:32, purely cosmetic ambient wildlife).

**Quests menu (t=18:40–18:50, opened via bottom-bar scroll/quest icon)**
- Full-screen dark parchment/silhouette background (same "figure at dusk" art as the rest popup). Header "QUESTS", red X close button top-right.
- Left column, tab list: **"PROLOGUE"** (black bg, selected style differs), **"YOKO'S QUEST"** (grey bg — highlighted/active selection).
- Right panel for the selected quest:
  - Top-right small currency counter: coin icon + **"3"**, label "GOLD" beneath (this looks like a *travel-fare* currency separate from the main 118 "COINS" — see Mechanics).
  - "OBJECTIVE" heading: **"GET BLACK BALD HERB FOR YOKO (THIS QUEST EXPIRES AT THE END OF THE DAY)"**.
  - "LOCATION" heading: **"E TOSHIBARA FIELD — TERRITORY (22,51) SECTOR (5,2)"**, with a red "TAKE ME THERE" button showing a coin icon + **"5"** (fast-travel cost).
  - "REWARD" heading: **"266 XP / 20 COINS / TOWN PROSPERITY: +5"**.
  - Bottom-right red button: "ABANDON QUEST".

**Toshibara Forest (t=18:52–19:20)**
- Dense bamboo-stalk foreground (parallax), dark bamboo canopy background, mossy hill mounds, grey stone lanterns and grave-marker-style stones scattered on the ground (graveyard/shrine dressing), wooden directional signposts (single-letter compass labels "W"/"S"/"N").
- Sub-location labels visited in sequence: "S TOSHIBARA FOREST" → "SE TOSHIBARA FOREST" → "E TOSHIBARA FOREST" (walking east/south-east through named sub-sectors).
- Sector coordinate readout updates live in the minimap label as player crosses sub-areas: SECTOR (2,4) → (3,4) → (4,4) → (4,3) → (4,2), while TERRITORY stays fixed at (22,51). This confirms **sector grid is local to a territory, coordinates increment by 1 per screen-transition**.
- t≈19:18 (frame_0027): a distinct teal/blue-green colour-graded sub-area appears (still tagged "E TOSHIBARA FOREST", action prompt "E TOSHIBARA FOREST (S)") with ceramic jugs on the ground and different tree silhouettes — reads as either a time-of-day/weather colour-grade shift or a distinct biome variant within the same forest zone, not a new location name.

**World Map screen — zoomed OUT / country view (t=19:00–19:04, frames 0009–0011)**
- Scroll/parchment-styled frame border (tan woven mat outer edge). Top-left instruction: **"CLICK ON THE MAP TO ZOOM IN"**. Top-right red button: **"ZOOM IN"**.
- Right-hand vertical side-tab (like a hanging scroll spool), reads vertically **"WORLD MAP"**, with a red **✕** close button below it, and a wave/seigaiha pattern decorating the bottom of the scroll spool.
- Map body: a stylised outline map of Japan's main islands rendered in flat tan/brown fill on a lighter tan background, overlaid with a **coarse grid** (each visible cell spans a large stretch of coastline — this is the "region" zoom level, far coarser than the territory-grid zoom). No buildings/icons rendered at this zoom except the player's own sprite (small samurai figure standing directly on the map, roughly over the Chubu/central-Honshu area).
- Legend bar (bottom, always present at both zoom levels): 6 icon glyphs + labels — **"VILLAGE"** (simple hut), **"TOWN"** (hut with peaked roof accent), **"CITY"** (tiered pagoda-style building), **"CASTLE TOWN"** (taller stepped pagoda/castle silhouette), **"DESTROYED"** (hut icon crossed out with a black ✕), **"QUEST"** (an exclamation-mark / scroll glyph).
- Legend right side, two lines of key text (verbatim, short functional UI copy): **"GREY TERRITORIES – LEVEL TOO LOW"**, **"RED TERRITORIES – LEVEL TOO HIGH"**.
- Panning: between frame_0009/0010 (static, ~2s hold) and frame_0011 (t≈19:04) the visible map region has scrolled north — a different, more elongated coastline (reads as Tōhoku) is now shown with the player icon near the bottom-left edge, confirming the zoomed-out view is scrollable/draggable independent of zoom-in click-target.

**World Map screen — zoomed IN / territory-grid view (t≈19:20–19:26, frames 0028–0031)**
- Same scroll frame, but now the top-right button reads **"ZOOM OUT"** (button swaps in place) — confirms zoom is a single toggle button whose label flips between IN/OUT states.
- Grid is now fine (~9 columns × 5–6 rows visible), each cell one territory, rendered as a bordered square directly over the tan landmass (grid lines much tighter than the country view).
- Header text appears once the correct territory is centred/hovered: **"NAGANO (26,52) LEVEL: 9"** (t≈19:22, frame_0029) — top-left, replacing the generic "CLICK ON THE MAP TO ZOOM IN" instruction seen at country zoom.
- Individual territory cells show a building-type icon (village/town/city/castle-town per the legend) plus, on many cells, a **coloured banner/flag graphic** standing beside the building — observed colours: **yellow**, **red**, and **blue** banners, plus plain (bannerless) buildings and black-✕ "destroyed" cells with no banner.
  - Reading against the legend's stated grey/red level-difficulty rule: the **red**-bannered cells most plausibly correspond to "RED TERRITORIES – LEVEL TOO HIGH". The **grey/low-level** state was not clearly distinguishable from ordinary unshaded cells in these JPEG-compressed frames — the yellow/blue banners' exact meaning (owning clan/faction colour vs. some other status) could not be confirmed from this segment alone and needs a closer re-watch/zoom on a still frame.
- One cell in frame_0029 is rendered as a plain **white-bordered blank square** (no building) at grid position roughly (5,2)-ish relative to the player icon — likely the currently-hovered/selected cell (a hover/selection highlight state), sitting adjacent to the player's own village-tile icon.
- The player's own position is drawn as the same small samurai sprite used in the zoomed-out view, standing on one of the territory cells (a village-type icon, left edge of frame_0029).
- Ocean/coastline is rendered as a distinct grey-blue stippled texture at the map edges, contrasting with the tan/brown land-fill (visible in frame_0031, t≈19:25).

## Mechanics observed (rules, numbers, timings, damage/HP/cost values you can read — cite frame t=MM:SS for each claim)

- Coins: **118** (t=18:10, unchanged through whole segment — no purchases made).
- XP: **3448 / 5150** at player **Level 4** (t=18:10, unchanged all segment — no combat/quest completion during this clip).
- HP: **20/20**, Stamina/Chi: **15/15**, both full and static all segment; stance = **"HEAVY STANCE"** (t=18:10 onward).
- Quest "Yoko's Quest" (side quest), read from Quests-menu detail panel (t=18:40–18:50):
  - Objective: get "Black Bald Herb" for Yoko; **expires at end of day** (a real-time or in-game-day daily-reset mechanic).
  - Fast-travel button cost: **5** (currency icon = small gold coin, distinct icon from the "COINS" HUD pouch icon).
  - Reward: **266 XP**, **20 COINS**, **Town Prosperity +5** (a town-level meta-stat, confirms a "town prosperity" system tied to quest completion — new to this segment's docs).
  - A separate **"GOLD"** counter (top-right of the Quests panel) reads **3** — this appears to be a *different currency* from the 118 "COINS" shown in the main HUD; likely a premium/quest-fare currency used specifically for the "TAKE ME THERE" fast-travel cost (5 needed, only 3 held → button is presumably disabled/unaffordable, though no visible greyed-out state was captured).
- Sector coordinates are a small local grid (observed range columns 0–5, rows 0–5 in the minimap widget) nested inside a much larger territory coordinate — confirmed territory **(22,51)** is Toshibara castle town's territory, distinct from **Nagano (26,52)** seen on the World Map — i.e., Toshibara is a different territory a few cells away from Nagano on the territory grid, not the same one (contradicts an assumption that the opening segments all take place "in Nagano" — Toshibara ≠ Nagano; Nagano (26,52) is simply the territory shown/centred on the World Map in this segment, not necessarily the player's current location).
- Nagano territory meta stat: **Level: 9** (t=19:22, frame_0029) — this is the recommended/threshold level for that territory's encounters, consistent with the "grey = too low / red = too high" player-level gating text in the legend.
- World Map has exactly **two zoom levels**: country/region view (coarse grid, button reads "ZOOM IN") and territory-grid view (fine per-territory grid, button reads "ZOOM OUT") — a single toggle button, not a continuous zoom slider.
- Fast-travel affordance exists both from the Quests menu ("TAKE ME THERE", costs Gold) and implicitly from the World Map itself ("CLICK ON THE MAP TO ZOOM IN" / then presumably click a territory tile to travel — travel-by-click on a territory cell was not completed within this clip, so exact click-to-travel confirmation/cost screen was not captured).

## Story/dialogue     (OWN-WORDS summary; names/quest titles OK; no verbatim dialogue)

At the Inn, the player rests and a new main-story objective appears: seek out a character named Hiroshi at an agreed meeting spot. The player then leaves the inn into the castle town, where a bulletin board ("Recent Happenings") is present but currently has nothing posted. Outside, a townsperson named Yoko is nearby. Opening the Quests menu reveals a side objective from Yoko — fetch a specific herb ("Black Bald Herb") for her before the day's timer runs out, in exchange for experience, coin, and a boost to the town's prosperity stat. The player then heads out through the castle town's gate into Toshibara Forest, working sector-by-sector eastward/southeastward (a graveyard-like bamboo forest with old stone markers) — presumably en route to the quest's herb-gathering site or the Hiroshi rendezvous. Partway through the forest walk, the player opens the World Map to orient — panning across a country-scale view of the game's map, then zooming into a specific territory named Nagano to inspect its territory grid before returning to on-foot travel.

## Feel               (pacing, camera, animation weight, FX; if combat: rough per-encounter durations in seconds)

- No combat in this segment; entirely exploration/menu navigation. Overall pacing is slow and deliberate — the player walks at a steady jog between screen-edge exit points, each screen transition triggering a location-name banner pop-in with no loading screen beyond a 1–2 frame black flash cut (t=18:42, 19:06, 19:16 — brief black frames between forest sub-areas, consistent with a scene-swap rather than a real load).
- Menus (Recent Happenings Board, Quests, World Map) all use a hard cut/instant open with no visible tween — the parchment/scroll dialogs simply appear fully formed.
- World Map pan (frame_0009→0011, ~4s apart) shows a smooth drag-scroll of the map underneath a fixed viewport frame, not a re-centering camera cut — reads as a click-and-drag or edge-scroll pan.
- Ambient life touches: a crow/bird sprite flies across the background twice in the forest (t≈18:32 and 19:08) purely as environmental flavour, no gameplay effect observed.
- Foreground bamboo-stalk parallax layer (both at the castle gate and inside the forest) sits between camera and player, reinforcing depth — consistent visual language with earlier segments' foreground-occlusion dressing.

## Recreation notes   (config values to add/adjust, which build Stage this maps to, anything contradicting the repo's spec/research docs)

- This is a **meta-map / world-navigation** screen, not combat — maps to whichever build stage owns the overworld/exploration + fast-travel systems (likely a "Stage: World Map & Travel" milestone distinct from the combat Sim). Needs its own scene, separate from `Sim`, since it's pure UI/state (no 60Hz physics needed) — keep it in `game/` as a Phaser scene reading static territory-grid data from `config/`.
- Confirmed **two required config tables**: (1) territory grid metadata — id, coordinate pair (e.g. Nagano = (26,52)), recommended level, list of sub-tile entries with building-type + banner/status; (2) a **currency split**: main "Coins" (118 seen) vs. a separate small "Gold" pool (3 seen) used specifically for fast-travel cost — do not conflate these into one currency in `config/economy`.
- Add a **Town Prosperity** stat as a quest-reward field (+5 seen) — new mechanic not previously documented in earlier segment notes; needs a home in config (likely per-territory or per-town numeric state) and a way for quests to modify it.
- Quest system needs an **expiry** field ("expires at end of day") — a day/real-time-cycle concept not yet modeled; flag for whoever owns the quest-log Sim/state design.
- Legend's precise grey/red color semantics were **only partially confirmed visually** in this pass (red-bannered tiles plausibly = too-high-level; grey = too-low-level was not clearly visible against JPEG compression) — before hard-coding tile-tint logic, re-check a slow-motion or higher-res pass of frames 0028–0031, or re-watch this exact timestamp range with `--resolution` bumped and `--max-frames` increased, to nail the exact colour rule (e.g., is it the whole tile background that changes colour, or just a banner icon next to the building?).
- Sector-coordinate system confirmed as **local per-territory grid, increments by whole integers per screen transition** (e.g., (2,4)→(3,4)→(4,4)→(4,3)→(4,2) while touring Toshibara Forest) — good concrete contract for `config/` (grid cell size in "screens", not pixels).
- Correction to keep in mind for continuity across segments: **Toshibara (territory (22,51)) is not the same territory as Nagano (26,52)**. Any prior notes assuming the starting village/castle-town is "in Nagano" should be checked against this — this segment is the first hard on-screen evidence distinguishing the two.

## VERIFIED
