# A-03 Skills screen first open — Critical Evade (8:10–9:20)

## Screens & layout   (positions, colors, typography, exact HUD contents; short UI labels verbatim OK)

**Training Hall base state (t=08:10–08:15, 08:42–08:48, 09:10–09:18):**
- Top-left pill: coin icon (green diamond) + "122" + "COINS" label below.
- Top-center: red/gold bordered banner "REGISTER" / "TO SAVE YOUR PROGRESS AND PLAY ONLINE!" (guest-mode nag, persistent).
- Top-right: purple/blue diamond icon "3" (character level) + gold XP bar "1918 / 2950" + "EXPERIENCE POINTS" label. After the duel win the bar reads "2098 / 2950" (t=09:10).
- Sub-top-left dark banner: "TRAINING HALL" (location name) with quest line below it: "STORY QUEST: TALK TO ITO" (t=08:10–08:40). After returning from the duel this line changes to a boxed brown quest banner: "TALK TO ITO" / "FIGHTING TUTORIAL" with a "!" icon (t=09:10).
- Top-right minimap: gold ornate frame, compass (N/W/E/S labels), small "!" quest marker icon, arrow icon, dash icon; below frame: "TERRITORY (21:51)" and "INSIDE SECTOR (5.2)" — looks like a real-time countdown/territory-control HUD element, not skills-related.
- Bottom HUD bar (persistent, dark wood texture):
  - Bottom-left player portrait roundel (red circle, character bust in straw hat) with two stat bars beneath: green HP bar "12/20" (later "20/20"), blue Chi/AP bar "10/10", and stance label "HEAVY STANCE" underneath.
  - Red "+" button next to portrait (likely quick-heal/item shortcut).
  - Icon row left-to-right: speech-bubble "..." (chat/dialogue), brown fan/leaf icon (unclear, possibly emotes), yin-yang icon (stance swap), forge/anvil-and-blade icon (crafting/repair), yellow scroll/incense icon, hexagon/gem icon (grayed, locked), small dark icon (grayed), gear icon (settings). One of these bottom icons opens QUESTS (green flag icon appears briefly at t=08:18 in place of the dark hexagon — likely a context-sensitive slot that swaps icon depending on nearby NPC/quest state).
- NPC world characters visible: "GUEST" tag over player's own character (guest-mode label), and a second white-robed NPC labeled dynamically ("TALK TO ITO" prompt) standing near a signpost with "E" glyph (interact key hint) to the far right, next to a katana display rack and two vertical Japanese calligraphy scroll banners on the dojo back wall (合気道 / 妙用道場 — dojo signage, background flavor text only).

**Player/Stats popup (t=08:12, triggered before Skills — confirms adjacent menu family):**
- Header "PLAYER" (top-left, gold script font), red X close button top-right.
- Tab: "STATS" (red button, active).
- Row: coin icon "122 COINS", gold coin icon "3 GOLD" (separate currency from Coins), "1918/2950 EXPERIENCE POINTS", "AVAILABLE STAT POINTS: 0" (top-right).
- Left column "GUEST" — equipment paper-doll: 8 empty/filled equip slots (hat equipped, mask slot empty, body/cloak/gloves/pants/boots/2 ring slots — 1 boot slot filled, most others empty).
- Middle column stat bars: HP "20/20" (green), CHI "10/10" (blue), AP "30/30" (light blue) — note AP here reads 30/30, differing from the bottom-HUD "10/10" label seen in the world (bottom HUD bar may be showing CHI, not AP — two different resources).
- Right column derived stats: ATK 7, DEF "7 + 2" (base+bonus shown explicitly), SPD 4.
- Bottom-right: "WEIGHT: 22 / 100" carry-weight meter, with 3 inventory slot icons: rice ball item "x3", a sword icon (unlabeled count), a white feather item "x2" (highlighted/selected, purple border).
- "NINJA SERVICES ARE NOT AVAILABLE IN GUEST MODE." modal (t=08:15) — confirms a "Ninja"-branded shop/service is gated behind account registration; dismissed via red "OK" button in ornate gold-cornered dialog frame (same dialog-frame style reused for Skills tooltips and reward popups).

**SKILLS screen (t=09:32 → t=09:42 [captured absolute t=08:32–08:42]):**
- Header "SKILLS" top-left, gold cursive/script font on dark brown parchment-textured background with a large faded black character-silhouette watermark on the right side (consistent dialog chrome across Player/Skills/Duel screens).
- Red "X" close button, top-right, same square red-bordered style as Player screen.
- Top-right label: "AVAILABLE SKILL POINTS: 2" (before spending), decrementing to "AVAILABLE SKILL POINTS: 1" after learning Critical Evade level 1 (t=08:38).
- **Categories view** (t=08:32): center-right panel headed "SELECT A SKILL CATEGORY" with a 3x2 grid (6 total) of square gold-bordered icon buttons:
  - Row 1: (1) figure lunging with sword (Light Stance icon), (2) figure with staff/pole stance, (3) figure slashing downward, (4) sake-flask/urn-shaped icon, (5) plain up-arrow icon.
  - Row 2: (6) curved blade/sickle icon.
  - No text labels are visible on the category tiles themselves in this view — icons only.
- **Category detail view — "Light Stance Skills"** (t=08:35): left panel shows selected category icon (lunging swordsman) large, label "LIGHT STANCE SKILLS", and description text "SKILLS THAT ARE USABLE WHEN IN LIGHT STANCE." Right panel shows a horizontal row of 6 skill-node icon buttons for this category (small square tiles, sepia/gold): lunge-figure (selected/highlighted white outline), a running/dash figure, a red slash icon, a bladed weapon/pole icon, a jumping-kick figure, a "swoosh"/speed-lines figure. Below the row: red "CATEGORIES" button (breadcrumb back-navigation).
- **Skill detail — Critical Evade** (t=08:38–08:40): left panel now shows the selected skill icon (a figure ducking/leaning back, evasion pose) with roman numeral "II" badge appearing on its category-row icon after leveling (small "II" superscript on the tile in the horizontal row, top-left icon). Text block:
  - Skill name: **"CRITICAL EVADE"**
  - Subtitle: **"(PASSIVE SKILL)"**
  - Description: "ALLOWS YOU TO EVADE ATTACKS WHILE SLASHING IN THIS STANCE WHEN YOUR FOCUS BAR IS FULL."
  - "NEXT LEVEL (LEVEL 1)" (before learning)
  - Lower-left: "REQUIRED SKILL POINTS: 1" and a red **"LEARN SKILL"** button.
  - After clicking Learn Skill: "AVAILABLE SKILL POINTS" drops from 2→1, and the Critical Evade tile in the row gains an "II" marker (suggesting the icon badge shows *current level reached*, i.e. "II" = level 1 learned appears as roman numeral offset by one, OR the tile was already partially leveled before this session — frame timing suggests the badge appears immediately after the Learn Skill click).
- **"SKILLS EQUIPPED"** section (bottom strip of the Skills screen, present in all Skills sub-views): labeled "SKILLS EQUIPPED" left-aligned; right-aligned row of 3 square slot icons: one empty gray slot, one filled slot showing a clawed/paw-like gold icon, and one slot showing a plain up-arrow icon. This looks like a fixed 3-slot loadout bar for equipping learned skills to hotkeys, separate from the "Available Skill Points" allocation panel above it.

**DUEL screen (t=08:52–08:58, entered right after Skills/tutorial prompt):**
- Header "DUEL" top-left, gold script.
- "Register now to fight LIVE PVP duels!" banner top-center (guest-mode gating message, same pattern as Ninja Services).
- Currency: skull icon "40" + "DUEL TOKENS" label, "30" second line (possibly a second currency or a stale/overlapping label — two numbers "40" and "30" stacked, exact meaning ambiguous from frame alone).
- "RANKINGS" red button, top-right.
- Center panel: "REFRESHING..." loading state (t=08:52) transitioning to a populated opponent grid (t=08:55): 6 NPC opponent cards in 2 columns x 3 rows, each with portrait, name, "LEVEL 3", and red "CHALLENGE" button. Opponent names shown: **TYLUV, IXBAL, NANASHI21, BODYGU4RD, JOTA, LHADYCANDY** — all Level 3 (matching player's own level 3).
- Refresh icon (circular arrows) bottom-right of opponent panel.
- Bottom text field: "VICTORY TAUNT (DISPLAYS ON OPPONENT'S SCREEN WHEN YOU WIN)" with editable text input showing default/current taunt: "YOU CAN NEVER DEFEAT ME!"

## Mechanics observed (rules, numbers, timings, damage/HP/cost values you can read — cite frame t=MM:SS for each claim)

- Player HP at Training Hall idle: 12/20 (t=08:10) recovers to 20/20 by t=08:40 — passive regen while walking, or simply a different game-state snapshot (no visible damage source before that point).
- Player CHI/AP bottom-HUD reads 10/10 throughout (t=08:10–09:18), unchanged.
- Player-screen resource split: HP 20/20, CHI 10/10, AP 30/30 (t=08:12) — AP is a third resource distinct from the bottom-HUD's blue bar, whose max differs (30 vs. apparent 10) — likely bottom HUD blue bar is CHI, and AP (30/30) is combo/action-point resource only shown in the Player popup.
- Derived combat stats at Level 3, Guest: ATK 7, DEF 7 (+2 bonus = 9 effective), SPD 4 (t=08:12).
- Currencies: Coins 122 (persistent), Gold 3 (t=08:12), XP 1918/2950 pre-duel → 2098/2950 post-duel (t=09:10), a gain of exactly **+180 XP** for winning the duel (confirmed explicitly on reward screen "XP 180", t=09:12).
- Carry weight: 22/100 (t=08:12).
- Inventory sample: rice ball item x3, one sword item (count not visible), one white feather item x2 (t=08:12).
- Skills: Available Skill Points = 2 before any spending (t=08:32), drops to 1 after learning Critical Evade to its first level (t=08:38–08:40). Critical Evade costs exactly **1 skill point per level** ("REQUIRED SKILL POINTS: 1").
- Critical Evade is a PASSIVE skill; its effect is stance-gated ("usable when in Light Stance" per category header) and further gated by a resource called "Focus Bar" — evasion triggers "while slashing in this stance when your Focus Bar is full." This implies a distinct Focus meter (not yet otherwise observed in this segment — likely a combat-only fill meter, separate from HP/CHI/AP).
- Skill category count: exactly 6 categories in the grid (t=08:32): Light Stance, (unlabeled pole-stance), (unlabeled downward-slash stance), a flask/urn icon (possibly "Consumables"/"Ninjutsu"/alchemy-related), a plain up-arrow (possibly "General"/passive stat-boost tree), and a curved-blade icon (possibly "Ninja"/dagger tree) — only "Light Stance Skills" label was confirmed on-screen; others are inferred from icon shape only, not verified text.
- Light Stance category contains exactly 6 skill nodes in its row (t=08:35), Critical Evade is the first/leftmost node.
- Skills Equipped bar: fixed 3 slots (t=08:32 onward), 1 already filled with an unidentified gold clawed-paw icon skill, 1 empty, 1 showing a plain up-arrow icon (possibly a "stat boost"/default slot, not a real equip).
- Duel: opponent pool of 6, all "LEVEL 3" (matches player level — duel matchmaking appears same-level or player-level-bracketed).
- Duel Tokens: 40 (currency for entering duels), plus a second number "30" whose label wasn't legible/readable in-frame — do not treat as confirmed distinct currency.
- Combat resolved in a single hit: "1 HIT COMBO" indicator (t=08:58) with a red damage number "9" appearing over opponent Tyluv (t=08:58), followed immediately by "YOU WIN" (t=09:02) — i.e., a single ~9-damage hit was lethal, meaning Tyluv's duel HP pool was ≤9 (much lower than the 20 HP shown for the player character, suggesting NPC duel opponents in this early/guest context have very low or scripted HP, OR this was a scripted/tutorial-forced win).
- Duel engaged with "AUTO SLASH OFF" toggle visible top-left throughout the fight (t=08:55–09:02) — confirms an auto-attack toggle exists as a combat option.
- Duel reward: "YOU RECEIVED" popup — XP 180 + one weapon/item icon (blue dagger/knife silhouette, no name text legible) (t=09:12).
- Immediately after returning to Training Hall (t=09:15), a new quest prompt appears: "TALK TO ITO" / "FIGHTING TUTORIAL" with "!" marker — sequences the duel as a pre-tutorial demo before the actual guided fighting tutorial quest.
- Final frame (t=09:18): a second "YOU RECEIVED" popup with a single red/cream cylindrical item icon (no name legible) appears when approaching Ito — likely an automatic quest-start item grant, not related to the duel reward.

## Story/dialogue     (OWN-WORDS summary; names/quest titles OK; no verbatim dialogue)

The player (in Guest/unregistered mode) is in the dojo's Training Hall, under a standing quest to go talk to a character named Ito. Before reaching Ito, the player opens their own Player stat sheet and then the Skills menu, browsing skill categories and choosing to invest a skill point into the passive ability Critical Evade under the Light Stance tree. The player then backs out and opens the Duel menu (a PvP matchmaking screen, gated to "Guest" preview mode since live PvP requires registering an account), picks an opponent named Tyluv from a roster of six level-3 duelists, and fights a very short duel — winning in a single decisive hit. The win nets XP and an item reward. Returning to the Training Hall, the standing objective updates to a new prompt: talk to Ito to begin a "Fighting Tutorial," implying the duel just completed was an informal/demo bout that unlocks or precedes the actual tutorial.

## Feel               (pacing, camera, animation weight, FX; if combat: rough per-encounter durations in seconds)

- Menu-to-menu pacing is fast: Player screen opens and closes within roughly 2–3 seconds of watch time before Skills is opened; navigation between Skills categories and skill-detail is near-instant (single-frame transitions, no visible animation/tween captured at this sampling rate).
- The dialog chrome (ornate gold-leaf cornered frame, dark parchment/silhouette background, gold cursive header font, red bordered buttons) is consistently reused across Player, Skills, Duel, and reward popups — a single shared modal-window visual language for the whole UI.
- The duel encounter itself is extremely short: from "VS" splash (t=~08:55, approx. 08:55) to "YOU WIN" (t=~09:02) is roughly **6–7 seconds** of actual fight time — both characters approach, one attack connects for 9 damage as a "1 HIT COMBO," and the fight ends instantly. No prolonged exchange, blocking, or stance-switching was visible in this encounter (note: "CANNOT CHANGE STANCE" label is shown in the player's bottom-HUD during the duel, meaning stance-switching is explicitly disabled/locked for this fight — possibly a duel-specific rule or a guest-mode restriction).
- Forest duel background: parallax dead-tree silhouettes, teal-grey fog sky, low bushes/rocks as ground clutter — visually distinct from the warm-toned wood-paneled dojo interior, reinforcing "duel = separate arena, not the same room."
- "YOU WIN" screen: full-bleed solid red background with a torn/ink-brushstroke text treatment and a small silhouette vignette of the winning character standing over the fallen opponent — a dramatic full-screen stinger, not a small popup.

## Recreation notes   (config values to add/adjust, which build Stage this maps to, anything contradicting the repo's spec/research docs)

- This segment establishes a **Skills system data shape** worth encoding in `src/config/`: skill categories (6, gated by stance/type), each category holding a small list (~6) of skill nodes, each node having a name, passive/active flag, description text, a numbered "next level" and a skill-point cost per level (Critical Evade = 1 point for level 1). Recommend modeling as `INFERRED` since exact costs for levels 2+ and the other 5 categories were not observed in this window — only Level 1 cost (1 point) is `CONTRACT`-grade confirmed.
- Critical Evade's trigger condition ("Focus Bar full" + "while slashing" + stance-gated) implies the repo's core Sim needs a **Focus resource** distinct from HP/CHI/AP — not yet documented elsewhere in this segment's data; flag for cross-check against other segments/spec before adding to `src/config`.
- Confirms **three distinct player resources**: HP, CHI (labeled differently in different screens — bottom HUD vs. Player popup), and AP (30/30, only visible in Player popup) — recreation should not conflate CHI and AP into one bar; they are shown with different max values (10 vs 30) in the same play session.
- "SKILLS EQUIPPED" is a separate fixed 3-slot loadout bar from the point-allocation tree — recreation needs two distinct UI regions/state: (a) skill tree with points spent per node, (b) a 3-slot hotbar of *equipped* (usable in combat) skills, independently selected.
- Duel/PvP system is clearly gated behind account registration in the original (repeated "Register to..." banners on both Player-adjacent Ninja Services and Duel screens) — for a 1:1 offline recreation, this whole online-duel/leaderboard layer is almost certainly out of scope; recommend explicitly marking PvP/online-duel/registration as NOT to be recreated (single-player only), consistent with "no online services" implied by project scope, but flag for confirmation against the master spec since this session doesn't have that doc loaded.
- "AUTO SLASH OFF" toggle and "CANNOT CHANGE STANCE" (duel-locked) HUD flags are two previously-unlogged combat-modifier states worth adding to whichever segment/doc tracks combat mechanics — cite this file if consolidating.
- This maps to whichever build stage covers the **Skills/passive-ability system and its UI** — likely a mid-to-late Stage given it depends on stance system, combat resource (Focus), and a persistent skill-point economy (XP → level → skill points), all of which presumably need earlier Stages (core Sim, stance system, XP/leveling) to exist first. No numeric contradiction with existing repo spec was found in this segment (no other segment doc was loaded for cross-check per task scope — flag for a later cross-segment reconciliation pass).
- Nothing in this segment contradicts the "no image files, procedural vector art" invariant — screens observed are pure UI (text, icons, bars), which is straightforward to recreate procedurally; no photographic or pixel-art assets are implied by anything seen here.

## VERIFIED
