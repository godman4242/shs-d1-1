# A-24 Gambling Den + Episode 1 quest wrap-up (60:10–62:10)

## Screens & layout   (positions, colors, typography, exact HUD contents; short UI labels verbatim OK)

**Persistent HUD (same as prior segments, all screens this segment):**
- Top-left: coin pouch icon + count, label "COINS" beneath (340 coins for most of segment, starts at 310).
- Top-center: red "REGISTER" banner button, subtext "TO SAVE YOUR PROGRESS AND PLAY ONLINE!" (persistent nag banner, unrelated to gameplay).
- Top-right: diamond-shaped level badge "6", amber XP bar with "current/total" fraction (e.g. `10431/12150`, `11181/12150`, `11681/12150`), label "EXPERIENCE POINTS" beneath.
- Top-right corner: mini-map compass widget in an ornate gold frame — N/S/E/W labels, a small floor-plan silhouette of the current room, player-position arrow icon, and NPC/loot icons (e.g., a coin-purse icon appears on the mini-map near Boss Tanaka's room, and a "Zzz" icon appears near sleeping/idle NPCs). Below the compass: "TERRITORY (23,52)" and "INSIDE SECTOR (1,3)" — coordinate readout, unchanged all segment (t=1:00:10–1:02:08).
- Location name banner (upper-left, below coins), black plaque with gold border, changes per room: "CITY ENTRANCE" → "MAIN STREET" → "GAMBLING DEN" → "GAMBLING DEN CORRIDOR" → "ENTERTAINMENT DISTRICT" (t=1:00:10 through 1:01:38).
- Directly under location banner: an active-quest reminder strip, dark semi-transparent bar, white text, changes with quest state:
  - "STORY QUEST: TURN IN INOKICHI'S CLUB AT THE BOUNTY BOARD" (t=1:00:10–1:00:15, before turn-in)
  - "STORY QUEST: VISIT BOSS TANAKA IN THE GAMBLING DEN" (t=1:00:42–1:01:12, after turn-in, before dialogue)
  - "STORY QUEST: RETURN TO THE INN TO CELEBRATE!" (t=1:01:25 onward, after gambling-den dialogue)
- Bottom-left: player portrait roundel (red ring, straw-hat samurai icon) + two stacked HP/CHI bars, format "20 / 20" green (HP) and "20 / 20" blue (CHI/Chi resource), label "HEAVY STANCE" beneath in gold caps — confirms current combat stance persists across the whole non-combat segment (t=1:00:10–1:02:08, unchanged).
- Bottom-center: 8-icon action/menu dock (chat bubble, hand/pickup icon, yin-yang icon, katana-on-stand icon, scroll/talisman icon, shield/hexagon icon, black ninja-silhouette icon, gear/settings icon) — consistent across all HUD frames.
- Interactable-NPC name tags float above characters in yellow "GUEST" (player) or colored NPC-name text — "MASATORA" (white/tan), "GOJO OTONDO" (blue), "BOSS TANAKA" (white), "M.GUESTRA" (blue, likely a name-collision/overlap render glitch of "MASATORA" + "GUEST").
- Interaction prompt icons: a small speech-bubble icon + NPC name in a brown plaque = "talk" prompt (e.g. "MASATORA" plaque, t=1:00:45); an eye icon + object name = "look/examine" prompt (e.g. "BOUNTY BOARD" plaque, t=1:00:48; "LOOK AT BOUNTY BOARD" quest-flag variant t=1:00:20).
- Directional exit signposts rendered as wooden arrow signs in-world, labeled with cardinal letter + sometimes destination name, e.g. "W" (t=1:00:15), "ENTERTAINMENT DISTRICT (N)" (t=1:00:32), "GAMBLING DEN CORRIDOR (E)" (t=1:00:52), "MAIN STREET (S)" (t=1:01:35).

**Quest-reward popup (t=1:00:22):**
- Centered modal, ornate gold corner-flourish frame on dark scrim, dark-brown/black gradient background with a faint red-lit silhouette of a standing swordsman behind the text (thematic flavor art, not a real character render).
- Title: "YOU RECEIVED" (gold caps, centered).
- Two reward line-items, left-aligned icon + value:
  - A folded-paper/document icon → **30**
  - "XP" label (gold text) → **750**
- Single red "OK" button, centered, dismisses modal (t=1:00:25, HUD updates: coins 310→340, XP 10431→11181, confirming the +30 is COINS not a separate item — the paper icon is the coin-pouch/ticket icon reused, and the +750 matches the XP delta exactly: 11181-10431=750).

**Gambling Den exterior signage (t=1:00:38, 1:01:30):**
- Large circular signboard mounted on the building facade: green outer ring with two red arc segments (top-right, bottom-left), gold inner ring, black kanji "賭" (gambling) centered on cream background — a mahjong/roulette-wheel motif.
- Building has pink-and-white shoji-style window shutters (lighter palette than the interior).
- Entrant doorway rendered as a green sliding panel with a black circular door-pull/gong graphic.
- On approach, a green rectangular banner overlays the door: yellow "GUEST" nametag + "ENTER GAMBLING DEN" prompt text, player sprite silhouetted against green backdrop (interaction prompt, t=1:00:38).

**Gambling Den Corridor interior (t=1:00:42–1:01:35):**
- Palette shift to warm interior: dark wood-brown floor/walls, gold trim, hanging paper lanterns (warm yellow glow) spaced along the corridor.
- Upper wall band: light blue-grey rectangular panels (frosted shoji/glass) in a row.
- Mid-height sliding door centerpiece: gold/tan panel with a painted cherry-blossom-branch motif in pink/white — a decorative shoji door distinct from the plain white-grid shoji used elsewhere (this appears to be Boss Tanaka's private room entrance).
- No coin/gold/XP HUD values change while walking the corridor — confirms it's pure traversal, no combat encounters in this segment.

**PLAYER stats screen (opened mid-corridor, t=1:01:20):**
- Title "PLAYER" top-left, red X close button top-right.
- Top strip: "STATS" tab button (active/red), coin count "340", small gold-coin icon + "3" (a *second*, separate currency — "GOLD", distinct from Coins), XP bar "11681 / 12150", "AVAILABLE STAT POINTS: 0".
- Left column: equipment paper-doll — "GUEST" label, character sprite center, 8 equipment slot icons around it: hat/kasa (equipped, straw hat icon), mask slot (empty), a red-and-black glove/gauntlet-looking top-left slot (equipped item, ambiguous icon — possibly a cloak/mantle), an accessory slot (empty, dangling charm outline), a cloak/robe slot (equipped, blue-bordered), a curved-blade/feather slot (equipped, purple-bordered — likely the katana), a ring slot (empty, gold circle outline), a footwear slot (empty, sandal outline), and one more empty slot bottom-right.
- Right column top: three stat bars — **HP 20/20** (green), **CHI 20/20** (blue), **AP 30/30** (light-blue/cyan — a third resource, "AP", likely Action Points/stamina, not previously logged as visible in this exact "20/20/30" triple in earlier segments — worth confirming against other stat-screen captures).
- Right column, derived stats box: **ATK 16**, **DEF 16 (+16 in orange, i.e. bonus from gear doubles it)**, **SPD 10**.
- Bottom-right: "WEIGHT: 100 / 100" — inventory/carry-weight cap, currently maxed.
- Bottom: 8-slot quick-inventory row (2 rows of 4): straw hat, sword (blue-highlighted/equipped border), white boots (blue-highlighted/equipped), a rice-ball/onigiri icon (consumable), a curved sword/wakizashi, a green-highlighted headband/hachimaki icon (equipped), a red-cross-marked sword (locked/unusable item, red X badge), another sword variant. A small red down-arrow triangle bottom-right suggests a scrollable second inventory page.

**QUESTS screen (opened right after, t=1:01:22):**
- Title "QUESTS" top-left gold caps, red X close top-right.
- Left panel: tabbed quest list — "EPISODE 1" (top-level header, highlighted/selected), then sub-quests: "GOJO OTONDO'S QUEST", "KAWASHI MASATSUGU'S QUEST", "MASATORA'S QUEST", "AKITOSHI'S QUEST", "YASUO'S QUEST", "GUIDE SHIMAZU TADAKO TO N CHIKADA" — 6 named quest-giver quests visible under Episode 1, list appears to continue below the visible frame (scrollable).
- Right panel (detail for selected quest — "EPISODE 1" story quest currently active): gold-coin+silhouette icon, count "3" (Gold currency again), objective text "RETURN TO THE INN TO CELEBRATE!", a red "TAKE ME THERE" fast-travel button costing a gold-icon "5" (i.e. fast travel costs 5 Gold), then location readout "CHIKADA CITY, MAIN STREET / TERRITORY (23,52) SECTOR (1,3)", "REWARD" label, "1000 XP" reward value.
- Bottom footer, small grey italic text: "NOTE: QUEST LOG IS FULL. COMPLETE OR ABANDON CURRENT QUESTS TO ACCEPT MORE QUESTS." — confirms a quest-log capacity cap exists (exact number not shown, but the 6 visible entries + Episode 1 header fill it).

**Entertainment District exterior (t=1:01:32–1:01:45):**
- Same Gambling Den building reused (green-door, "賭" wheel signage) but seen from the Entertainment District street context; wooden directional signpost "S" pointing back to Main Street.

**Main Street dialogue-choice UI (t=1:00:52–1:01:18 equivalent style reused at t=1:01:40+ for Gojo Otondo):**
- Full-width dark dialogue box at screen bottom, brown/gold ornate border, corner flourish clips (small gold clip icons at box corners).
- Speaker name plaque, top-left of box, black background gold border: "SATOSHI" (player's name, confirmed here — protagonist is named Satoshi, not just "Guest"/"GUEST" as the overworld nametag shows), "BOSS TANAKA", or "GUEST" (used generically for player-choice prompts before a name is established in that exchange).
- Body text: white caps sentence(s), left-aligned, two lines max per box.
- Forward-advance cue: white right-pointing triangle, bottom-right of box.
- **Multiple-choice branches** render as a stacked list of 2–3 selectable rows inside the same box footprint, replacing single-line text: currently-hovered/selected choice highlighted with a solid red bar + white text; unselected choices sit on a dark grey/black bar with light-grey text. Confirmed choice sets seen:
  - Talking to Boss Tanaka, round 1: "THIS CRIMINAL SHOULD BE IN JAIL." / "THIS PLACE IS IMPRESSIVE." (selected) / "WE SHOULD GO." (t=1:01:00)
  - Round 2: "I'D LIKE LEARN ABOUT GAMBLING." / "I COULD DO WITH SOME WORK." (selected) / "THIS ISN'T FOR ME." (t=1:01:05) — note "I'D LIKE LEARN" is a likely in-game typo (missing "TO"), transcribed as literally shown on screen.
  - Round 3 (sub-branch, 2 options only): "TELL ME MORE." / "NOT NOW." (selected) (t=1:01:12)
  - Gojo Otondo street scene, choice: "HIROSHI SHOULD'VE LET US HELP HIM." / "WE NEED TO FIND OUT WHO'S RESPONSIBLE." (selected) / "LET'S GO TO THE HIDEOUT." (t=1:01:58–1:02:02)

## Mechanics observed (rules, numbers, timings, damage/HP/cost values you can read — cite frame t=MM:SS for each claim)

- Quest turn-in reward (Inokichi's Club → Bounty Board), Masatora questgiver: **+30 Coins, +750 XP** (t=1:00:22 popup; confirmed by HUD delta: coins 310→340, XP 10431→11181, t=1:00:20→1:00:28).
- Player level at time of capture: **Level 6**, XP bar denominator **12150** (i.e., level-6-to-7 threshold is 12150 XP), current XP ends segment at 11681/12150 (t=1:01:20).
- Fast-travel cost: **5 Gold** to warp to a quest objective via "TAKE ME THERE" (t=1:01:28, Quests screen).
- Gold currency count at capture: **3 Gold** (separate resource from Coins=340) (t=1:01:20, t=1:01:28) — note the fast-travel button costs 5 Gold but player only has 3, implying the button may be disabled/unaffordable at this moment (not confirmed clickable in frames).
- Player core stats at Level 6, mid-Episode-1: **HP 20/20, CHI 20/20, AP 30/30, ATK 16, DEF 16 base + 16 gear bonus = 32 effective, SPD 10** (t=1:01:20).
- Inventory carry weight: **100/100** (maxed) (t=1:01:20).
- Episode-1 story-quest final reward (before this segment's last quest state): **"Return to the inn to celebrate!" → 1000 XP** (t=1:01:28, Quests detail panel) — this is the payoff for finishing the Boss Tanaka gambling-den conversation.
- Quest log has a hard cap — footer explicitly states "QUEST LOG IS FULL. COMPLETE OR ABANDON CURRENT QUESTS TO ACCEPT MORE QUESTS." with 6 sub-quests + Episode 1 shown filling it (t=1:01:28).
- No combat, no damage numbers, no HP loss anywhere in this segment — entirely dialogue/traversal/menu-driven (t=1:00:10–1:02:08).

## Story/dialogue     (OWN-WORDS summary; names/quest titles OK; no verbatim dialogue)

- Segment opens right after the player (whose name is revealed here as **Satoshi**) turns in Inokichi's confiscated club at the Bounty Board via questgiver Masatora, collecting coins and a large XP reward, closing out that side quest.
- The story quest immediately updates to "Visit Boss Tanaka in the Gambling Den," sending the player north through Main Street into the Entertainment District, then into a new interior area called the Gambling Den, and further into a "Gambling Den Corridor" leading to a private cherry-blossom-decorated back room.
- Player meets **Boss Tanaka**, a large, heavily tattooed crime-boss type character (open purple robe, prominent full-torso tattoo, confident/mocking demeanor) — clearly a set-piece "boss" NPC distinct from rank-and-file street NPCs, rendered in a close-up dialogue-portrait style (character fills most of frame, unlike the small overworld sprites).
- Satoshi and Tanaka have an established rapport — Tanaka calls Satoshi "my prodigal friend," and the conversation implies Satoshi owes Tanaka a debt he's here to settle/pay down.
- Dialogue choices let the player react to Tanaka's gambling den with suspicion (criminal talk), admiration, or disinterest, and separately choose whether to express interest in learning about gambling or taking on work from Tanaka, versus declining.
- Tanaka explains that once a task is completed to the satisfaction of "our agent," payment will follow — setting up Tanaka as a quest-giver/fence figure who assigns work through an intermediary, foreshadowing a future task-based quest line rather than resolving in this exchange.
- Satoshi closes the conversation with a joking aside not to believe everything people say, and hurries the player along to go celebrate — quest updates to "Return to the Inn to celebrate!"
- The player retraces the path back out of the Gambling Den to Main Street, where the reward for finishing Episode 1's current step is confirmed as 1000 XP via the Quests menu.
- On the way back through Main Street, the story cuts to a dramatic beat: NPC **Gojo Otondo** intercepts Satoshi, distracted mid-sentence by spotting a passerby's distinctive golden eye and a pendant/necklace she's wearing — implying recognition of someone significant, left as a loose thread/hook rather than resolved here.
- The scene pivots into a separate flashback-style dialogue where Satoshi reads a letter: the sender opens by saying time is short, then delivers grave news — **Lord Masahiro is dead**. Satoshi is visibly shaken (dialogue notes he's gone pale), and asks who sent the letter, specifically whether it was from Hiroshi.
- The scene resolves into a player choice about how to react to Masahiro's death and who's responsible, followed by a decision to head to the "Old Guard Hideout" per advice attributed to Hiroshi, and to lie low there.
- Note: the map-context blurb described this beat as "Gojo Otondo street dialogue about Hiroshi refusing company" — the frames actually captured show Gojo Otondo's Masahiro-death letter/hideout dialogue instead; no dialogue explicitly about Hiroshi "refusing company" appeared in the 48 sampled frames of this range (possible it occurs in the ~2s gaps between sampled frames, or the map-context description covers a slightly earlier/later beat outside this 60:10–62:10 window).

## Feel               (pacing, camera, animation weight, FX; if combat: rough per-encounter durations in seconds)

- Entirely non-combat: walking transitions between rooms, NPC-approach auto-triggered dialogue, and two full-screen menu opens (Player stats, Quests) inspected mid-corridor.
- Camera is a fixed 2D side-scroll plane per screen/room, no parallax scroll observed within a single room besides the character walking across it; room-to-room transitions are hard cuts with a location-name banner refresh (no fade transition visible in the sampled frames, though gaps between 2–3s samples could hide a quick fade).
- Dialogue-portrait cutscenes (Satoshi close-up, Boss Tanaka close-up) use a different visual register than gameplay: character art is much higher-detail/larger than the in-world sprite, and the background is a blurred/darkened version of the current scene — a lightweight "visual novel" style cutscene layer over the same scene geography, not a separate loading screen.
- Reward popup (t=1:00:22) uses a dramatic thematic silhouette (red-lit swordsman) purely for flavor — reused stock art rather than anything specific to Masatora or the quest.
- Overall pacing is slow/deliberate: several seconds of idle standing during dialogue choices, walking segments are short (one screen-width per room).

## Recreation notes   (config values to add/adjust, which build Stage this maps to, anything contradicting the repo's spec/research docs)

- **New interior confirmed:** "Gambling Den" (exterior door + entry room) and "Gambling Den Corridor" (private back room with cherry-blossom shoji door) — worth adding to the interior/map inventory alongside previously logged interiors, with the circular "賭" gambling-wheel signage as its distinguishing exterior landmark.
- **Dual-currency system confirmed:** Coins (large numbers, e.g. 340) and Gold (small numbers, e.g. 3) are separate resources — Gold appears used specifically for fast-travel ("TAKE ME THERE" cost 5 Gold) and shown in both Player and Quests screens. Config should model these as two distinct currency types, not one.
- **Third resource bar "AP" (30/30) confirmed** alongside HP and CHI on the Player stats screen — distinct cyan/light-blue bar. Should be cross-checked against other segments' Player-screen captures to confirm AP's role (stamina/action-points) before finalizing config semantics — this segment alone doesn't show it draining/refilling.
- **Gear bonus notation confirmed:** DEF display format is "16 + 16" (base stat in white, gear bonus in orange, doubling the base) — useful exact-format reference for a stats-panel recreation.
- **Quest log cap confirmed via UI text** ("QUEST LOG IS FULL...") — recreation should implement a quest-log capacity limit with this exact warning copy (paraphrase-safe short UI string, <15 words, verbatim reuse acceptable per functional-UI-label allowance).
- **Story beat correction vs. map context:** the "Gojo Otondo... Hiroshi refusing company" description in the task brief does not match what appears in this timestamp range — what's actually here is the Masahiro-death-letter reveal and the choice to head to the Old Guard Hideout. Flag this for whoever is building the Episode-1 story outline so the beat list gets corrected/re-sequenced rather than assuming this segment covers "refusing company" dialogue.
- Maps to a **narrative/dialogue-system build stage** (branching dialogue UI, quest-giver NPCs, quest-log with cap, dual currency, fast-travel) rather than a combat-stage — relevant to whichever Stage covers UI/dialogue/quest systems in the repo's staged build plan.

## VERIFIED
All 48 listed frames were opened and inspected (3 frames were solid black/near-black transition frames with no legible content: frame_0004 t=1:00:18, frame_0010 t=1:00:32 partial, frame_0016 t=1:00:48, frame_0032 t=1:01:30 partial, frame_0039 t=1:01:45 partial — these are scene-transition or scroll-edge artifacts, not scored as informative but confirmed empty/non-informative by direct viewing). All numeric claims above are cross-checked against on-screen HUD deltas where possible (e.g., reward popup vs. before/after coin and XP totals).
