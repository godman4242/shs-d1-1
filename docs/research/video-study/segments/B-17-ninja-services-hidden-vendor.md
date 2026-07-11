# B-17 Ninja Services hidden vendor (48:04–48:44)

## Screens & layout   (positions, colors, typography, exact HUD contents; short UI labels verbatim OK)
- **BUY shop screen** (frames t=48:04–48:10, t=48:14–48:16): dark brown/orange gradient background with silhouette of a hooded figure (vendor) on right side. Panel layout:
  - Top-left: "BUY" title (yellow-orange serif/hand-drawn font).
  - Top-center: "REFRESH SHOP" button (dark red, gold coin icon).
  - Top bar, left to right: green scroll icon + "630 / COINS", gold coin icon + "2 / GOLD", red "GET GOLD" button, green skull icon + "40/40 / DUEL TOKENS".
  - Close button: red-bordered white "X" top-right corner.
  - Main body split: left = 4x4 (or 4x5, scrollable) grid of item icons with price badges (gold coin icon + number, e.g. "15", "25", "60", "200", "1", "5", "10"); right = detail panel for the currently-selected item (icon, name in orange caps, "OWNED: N", flavor/rarity tag, stat list, red "BUY" button at bottom).
  - Item grid icon borders are color-coded by rarity: grey/tan = common, green = uncommon, purple = rare, orange/gold = epic/event.
  - Small up/down triangle arrows (▲▼) at right edge of grid area for scrolling between rows.
- **Ninja Services menu** (frames t=48:16–48:24, over gameplay-hall background): vertical list panel, dark brown boxes with gold-bordered header "NINJA SERVICES" (yellow-orange caps). Menu items top to bottom, each with a small icon:
  - Money-bag icon + "NINJA SHOP"
  - Money-bag icon + "NAME AND REINFORCE WEAPON"
  - Money-bag icon + "TRANSFER ITEM STATS"
  - Gift-box icon + "CLAIM PRIZES!"
  - Trophy icon + "ACHIEVEMENTS"
  - Up-arrow-in-box icon + "LEAVE"
  - HUD in top-left retained behind menu: coins (630) and gold (2) counters + "GET GOLD" button.
  - Background behind the menu shows an in-progress mine/hall scene: two named characters "SOUND360TM" (player, yellow name) and "BANDIT (7)" (red name, enemy) standing near wooden crates/barrels; a third hooded ninja figure crouches at bottom-right edge of frame (likely the hidden Ninja Services vendor NPC model, black hood/mask, all-black outfit).
- **Side-quest banner** (t=48:12): top-left banner reads "SIDE QUEST: GET FAST SHOES OF FOCUS FOR INOKUMA KINKIYO" (truncated header above it, illegible). Right side has a compass/mini-map widget: "W" / "E" cardinal labels, up-arrow marker, "TERRITORY (24,52)" and "INSIDE SECTOR (5,0)" coordinate readout below.
- **Dialogue bubble** (t=48:12): white speech bubble above player character reading a short warning line ("YOU ARE NOT SUPPOSED TO BE HERE!") attributed to "SOUND360TM" — this is a system/mob voice line triggered on entering a restricted sector, not the vendor.
- **Combat HUD** (t=48:14–48:22): top-left "AUTO SLASH OFF" toggle button (brown border). Top-right large red hit-combo counter (numeral + "HIT COMBO" caption), pause icon (red circle) beside it. Bottom-left player portrait (circular, red ring) + two stacked bars: green (HP, values seen "13/30" → "12/30" → "11/30") and blue (Chi/stamina, steady "47/47"). Caption under bars: "CANNOT CHANGE STANCE". Bottom-right shows 2 ability icons numbered "2" and "3" (one greyed/empty slot, one tan swirl icon, one gold up-arrow icon).
- **Victory screen** (t=48:38–48:42): full-bleed dark-red background, black silhouette ground with fallen-enemy silhouette shapes, samurai silhouette standing with sword; large jagged white/red brush-stroke text "YOU WIN" centered.

## Mechanics observed (rules, numbers, timings, damage/HP/cost values you can read — cite frame t=MM:SS for each claim)
- Player coin balance: 630 coins, 2 gold, 40/40 Duel Tokens — stable across all Ninja Services/shop frames (t=48:04–48:24).
- Shop item prices (gold currency, small coin icon): 200, 1, 5, 10, 15, 10, 5(gift), 5, 25, 25, 25, 5, 60, 15, 15 — visible across scroll positions t=48:04, 48:10, 48:14, 48:16.
- Detail panel example — **Training Helmet** (t=48:04): Level 9, price 15 gold, tag "SOUL-INFUSED / THIS ITEM LEVELS UP AS YOU GAIN XP." Stats: Defense +2 (EQ:1), Wind Def 0 (EQ:2), Max Chi +17 (EQ:16), Speed +5 (EQ:0), Weight: 1.
- **Training Garment** (t=48:06, 48:10): Level 7, price 15 gold, same "SOUL-INFUSED" tag. Stats: Defense +21 (EQ:4), Earth Def +3 (EQ:1), Piercing Damage +2 (EQ:0), Max Chi +15 (EQ:0), Weight: 10.
- **Writ of Release** (t=48:12 shop scroll, actually visible at the frame right after Get Gold close): price 25 gold, description "USE THIS ITEM TO LEAVE YOUR CLAN." (functional consumable, no stats).
- **Santa Suit** (t=48:14, seasonal/event item): Level 7, price 15 gold, "SOUL-INFUSED" tag. Stats: Defense +11 (EQ:4), HP Regen +3 (EQ:0), Water Def +3 (EQ:0), Earth Def 0 (EQ:1), Weight: 5.
- **Santa Hat** (t=48:16, seasonal/event item): Level 7, price 15 gold, "SOUL-INFUSED" tag. Stats: Defense +2 (EQ:1), Max HP +17 (EQ:0), Fire Def +3 (EQ:0), Wind Def 0 (EQ:2), Critical Damage +3 (EQ:0), Max Chi +15 (EQ:16), Weight: 1.
- **Get Gold IAP menu** (t=48:08): 5 tiers — 50 Gold/$4.99, 125 Gold/$9.99, 200 Gold/$14.99 ("MOST POPULAR!"), 275 Gold/$19.99, 400 Gold/$24.99 ("BEST DEAL!"). Also offers free gold via "SuperRewards" and "TrialPay" survey/offer partners, plus a "FEATURE WISHLIST" button. Disclosure text: purchasing gold supports development.
- Gear items each carry an "OWNED: 0" counter in the detail panel and a per-item "LEVEL" (7 or 9 seen) that appears tied to the "SOUL-INFUSED" mechanic — i.e., these gear pieces themselves level up and grant scaling stats as the player earns XP while equipped, independent of/alongside weapon reinforcement.
- Combat sample (post-Ninja-Services, same continuous take): player HP drops 13/30 → 12/30 → 11/30 across the visible slice (t=48:20–48:24), i.e. roughly 1 HP lost per enemy exchange; Chi holds steady at 47/47 throughout (chi not spent by basic attacks in this stance). Hit-combo counter climbs and resets multiple times: seen values 3, 5, 1, 2 (t=48:20–48:32) — indicates combo breaks when switching targets/getting hit, then restarts.
- "CANNOT CHANGE STANCE" persistent HUD caption during this fight — stance-locking is an active combat rule at least in some encounter/mode.
- Fight against multiple mobs simultaneously (archers + melee, at least 4 enemies visible on screen with individual green HP bars) ends in "YOU WIN" screen (t=48:38–48:44), held for several seconds as a static end-of-encounter card.

## Story/dialogue     (OWN-WORDS summary; names/quest titles OK; no verbatim dialogue)
- A side quest is active/updated: fetch a pair of fast movement-boosting shoes for a character named Inokuma Kinkiyo.
- While exploring, a nearby NPC calls out that the player isn't authorized to be in this area — a generic "trespassing" warning line rather than unique vendor dialogue.
- No unique dialogue from the "hidden vendor" itself was visible in this slice; the vendor's presence is inferred from the hooded, all-black NPC sprite lurking at the frame edge near the shop menu, consistent with a mine-level secret merchant who unlocks the Ninja Services menu.

## Feel               (pacing, camera, animation weight, FX; if combat: rough per-encounter durations in seconds)
- Fixed side-scrolling 2D camera; menus overlay directly on the paused/backgrounded game world rather than transitioning to a separate scene.
- Menu navigation is instant (no transition animation observed between shop tabs/scroll).
- Combat is fast and chaotic: multiple enemies (spearmen, archers, another samurai) engage almost simultaneously; hit reactions include full ragdoll-style knockback/flailing limbs and blood spray particles; combo counter and floating damage-adjacent numerals communicate hit feedback.
- The visible combat slice runs roughly 8 seconds (t=48:14 to 48:22) before the "YOU WIN" card appears and holds static for several more seconds (through 48:44) — a full encounter-to-victory beat that reads as quick, arcade-like skirmish resolution.
- "YOU WIN" screen uses a strong red color-wash, jagged brush-stroke typography, and dramatic backlit silhouette staging — a stylistic beat distinct from normal HUD/menu chrome, signaling a hard state transition (combat over).

## Recreation notes   (config values to add/adjust, which build Stage this maps to, anything contradicting the repo's spec/research docs)
- Confirms Ninja Services menu structure exactly as given in the task's map context: Ninja Shop, Name and Reinforce Weapon, Transfer Item Stats, Claim Prizes!, Achievements, Leave — order and icon types now documented (money-bag / money-bag / money-bag / gift / trophy / up-arrow-box).
- New mechanic surfaced not previously called out in task context: gear items (helmets, garments, hats, boots) are themselves "SOUL-INFUSED" and have their own level (independent per-item leveling, e.g. Level 7, Level 9) that scales their stat rolls as the player gains XP — this is a second progression axis alongside "Name and Reinforce Weapon." Worth a config note (e.g. `gearSoulInfusedLevelCurve`) distinct from weapon reinforcement tiers.
- "Writ of Release" item (25 gold, clan-leave consumable) implies a clan/guild system exists — out of scope for current build stage but worth logging as a future system reference.
- Shop currency is dual: soft currency "Coins" (630 seen) for general economy, premium "Gold" (2 seen, IAP-purchasable in tiers 50/125/200/275/400 for $4.99–$24.99) for premium/cosmetic items — most gear items in this shop view are priced in gold (small coin badge), suggesting gold is the primary shop currency shown here, not coins. Needs disambiguation before implementing a shop/economy config (which currency gates which item classes).
- Seasonal/event cosmetic items (Santa Suit, Santa Hat, candy cane) appear in the base shop rotation — confirms a rotating/seasonal shop slot exists ("REFRESH SHOP" button, small coin cost likely tied to refresh).
- "CANNOT CHANGE STANCE" combat lock and stance-switch UI (numbered ability icons 2/3, one greyed) should be captured in the stance/combat config — stance locking appears to be a real rule, not a bug, at least in certain fight contexts (possibly mob/dungeon fights vs. duels).
- Combo counter reset-on-target-switch or reset-on-being-hit behavior (values dropped from 5 to 1 mid-fight) is a candidate for `comboBreakRules` in core combat config — needs a second segment to confirm exact trigger (hit-taken vs. target-switch vs. timeout).
- No direct contradictions with existing repo spec/docs found in this segment; this segment mainly adds detail/confirms structure already anticipated in the task's map context.

## VERIFIED
