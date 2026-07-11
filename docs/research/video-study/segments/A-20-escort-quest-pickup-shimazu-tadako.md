# A-20 Escort quest pickup: Shimazu Tadako (42:00–43:30)

## Screens & layout   (positions, colors, typography, exact HUD contents; short UI labels verbatim OK)
**Overworld HUD (present in all non-combat frames):**
- Top-left: item/coin icon + coin count, label "COINS" beneath (e.g. `259 COINS`).
- Top-center: red-bordered "REGISTER" button, with caption beneath "TO SAVE YOUR PROGRESS AND PLAY ONLINE!" (guest-mode nag, persistent).
- Top-right: diamond icon + XP fraction, label "EXPERIENCE POINTS" beneath (e.g. `8093 / 8350`).
- Below coins: a gold-bordered quest/zone panel. Line 1 = current zone name in caps (`N CHIKADA DUNGEON`). Line 2 rotates between: (a) a chat-bubble icon + NPC name when standing near an NPC with dialogue (e.g. `Mori Masayori`), or (b) an orange "!" icon + quest text (`TALK TO SHIMAZU TADAKO` / `GUIDE SHIMAZU TADAKO TO N CHIKADA` in a smaller line below it), or (c) a footprint icon + a previously-visited waypoint name (`N Chikada Dungeon`).
- Top-right, below XP: a bordered minimap grid with numbered columns/rows (0–5), a player marker (bird/chevron), sector icons (bell, door "S"/"E"/"W", chest "X", scroll "!"), captioned "TERRITORY (23.52)" / "SECTOR (2.0)" (or "INSIDE SECTOR (2.0)" while indoors, showing a compass rose N/S/E/W instead of the grid).
- Bottom-left: circular player portrait (red ring) + two stacked bars: green HP bar labeled `n/20`, blue bar labeled `n/20` (stamina), and a stance label beneath (`HEAVY STANCE`).
- Bottom-center: horizontal icon bar: chat bubble, dumpling/food icon, yin-yang, crossbow/catapult icon, scroll icon, hexagon/shield icon, ninja-mask icon, gear (settings) icon.
- NPC/ally name tags float above heads in gold/yellow text; quest-relevant NPCs show a floating blue/orange `!` above their tag.

**Combat HUD (forest fight, t=42:00–42:32 and t=43:15–43:28):**
- Top-left: bordered button "AUTO SLASH OFF" (toggle, brown/gold border).
- Top-right: red circular pause button.
- Bottom-left: same portrait + HP (`n/20`, green) + second bar (`n/20`, blue) as overworld, plus a third **unlabeled white bar** that displays transient status text in place of a number: observed strings `CRITICAL HIT` and `CANNOT CHANGE STANCE`.
- Top-right (combat only): large red number + black bar captioned "HIT COMBO" (e.g. `1 HIT COMBO`, `4 HIT COMBO`, `3 HIT COMBO`).
- Bottom-right: 2–3 numbered square ability/item icons (slots "2" and "3" visible and populated; slot "1" empty/black in this segment).
- Enemy/ally HP bars: thin green bars float above combatant heads, no numeric HP shown except once: `SHIMAZU TADAKO (8)` — a name tag with a parenthetical level number, distinct from the plain `GUEST` tag used elsewhere for the same character.
- Defeat screen: full-screen dark-red duotone silhouette of the last combat frame, centered jagged white/red text "YOU WERE DEFEATED!", two stacked buttons below: "LEAVE AREA" and "FREE RESPAWN".

**Dialogue box (talking to NPCs):**
- Bottom third of screen: dark brown/black box, NPC name in a small header tab above it (`Mori Masayori`, `Guest`), a line of NPC speech, then two selectable rows: "TALK" (dark gray) and "LEAVE" (red, appears to be the default/highlighted option). A small NPC portrait bust is rendered bottom-right of the box.
- Tip strings appear in the same box style keyed to the NPC, e.g. "TIP: WINS ARE ADDED TO THE LEADERBOARDS ONLY WHEN YOU DEFEAT A LIVE PLAYER IN A DUEL." and "TIP: WHEN NOT IN BATTLE, TRY SAYING '/KNEEL'."

**Dungeon interior (t≈42:58):** stone/brick corridor room, wood support pillars, two barrels + a bench as static props, wooden directional signposts at both screen edges (e.g. "N CHIKADA DUNGEON (W)" pointing left, plain arrow sign pointing right/"E"). A second room variant (t≈43:00) adds more clutter props: chests, a large jar/urn, a crate. A hostile NPC there is tagged `BANDIT M.` in red text (red = hostile, contrasts with blue `Mori Masayori` / white-ish `Guest`/`Shimazu Tadako` tags for friendlies).

## Mechanics observed (rules, numbers, timings, damage/HP/cost values you can read — cite frame t=MM:SS for each claim)
- Player max HP = 20 in both overworld and combat contexts (t=42:00 `12/20`; t=43:15 `20/20`).
- Player secondary (blue/stamina) bar also scaled to 20 (t=42:00 `20/20`).
- First (pre-existing) forest encounter, HP trace: 12/20 (t=42:00) → 11/20 (t=42:08) → 11/20 (t=42:10) → 9/20 (t=42:12) → 9/20 (t=42:15) → 9/20 (t=42:18) → 3/20 (t=42:20) → defeat screen by t=42:22. That is a loss of 9 HP in roughly 2 seconds of screen time (t=42:18→42:20), suggesting a multi-enemy gang-up or a heavy attack landed while the ally NPC was between the player and a second bandit.
- Hit-combo counter observed values during that losing fight: `1 HIT COMBO` (t=42:05), `4 HIT COMBO` (t=42:10) — so the player was landing combo hits even while losing net HP, implying enemies were dealing more/faster damage than the player's combo was returning.
- `SHIMAZU TADAKO (8)` level tag appears at t=42:08, green HP bar nearly full — read as: the escortee has a level number (8) surfaced only in this specific combat-adjacent name-tag state.
- Death → respawn: after "YOU WERE DEFEATED!" (t≈42:22–42:25), the very next content frame (t=43:00) shows the player back at full HP (`20/20` / `20/20`) standing near the same ruin entrance with the quest tracker already reset to the pickup step — implies "Free Respawn" drops the player back at (or very near) the last quest-relevant waypoint with full HP restored, no visible HP/coin penalty (coins unchanged at 259, XP unchanged at 8093/8350 across the death).
- Coins held: 259 (constant across the whole segment, t=43:00 through t=43:28 — no coin cost was charged for respawn or for quest pickup).
- XP: 8093 / 8350 toward next threshold (constant across the segment — no XP awarded yet for this quest stage).
- Minimap coordinates: "Territory (23.52)" / "Sector (2.0)" outdoors; switches to "Territory (23.52)" / "Inside Sector (2.0)" once indoors (t=42:58), with the minimap widget itself swapping from a grid view to a compass-rose (N/S/E/W) view while indoors.
- Second (retry) forest encounter after quest re-pickup, HP trace: 20/20 (t=43:15, "ATTACK NOW!" prompt) → 17/20 (t=43:18) → 16/20 (t=43:20) → 14/20 (t=43:25/43:28). Hit combo `3 HIT COMBO` shown at t=43:22.
- A status message "CANNOT CHANGE STANCE" is shown in the third HUD bar slot repeatedly during combat frames (t=42:12, t=42:15, t=43:12, t=43:22) — reads as a fixed/standing combat-state label (stance locked while an action/animation is in progress), not a one-off event.
- Dungeon interior encountered a distinctly-tagged hostile, `BANDIT M.` (red name), inside the first room reached from the ruin's west door; the player did not engage and instead used a "LEAVE N CHIKADA DUNGEON" exit prompt/signpost to back out (t≈43:08), returning to the forest exterior and re-approaching Shimazu Tadako from there — reads as: the marked dungeon door is not the intended escort route, or is a harder/optional room to be avoided at this quest stage.

## Story/dialogue     (OWN-WORDS summary; names/quest titles OK; no verbatim dialogue)
Segment opens mid-fight in the misty forest outside N Chikada's ruined dungeon entrance: the player is already accompanied by an ally tagged "GUEST" against a pair of bandits, but the fight goes badly and the player is defeated. After a full-screen "You were defeated!" interstitial, the player respawns near the same ruin entrance at full health, with the quest tracker already reading a side quest to guide a woman named Shimazu Tadako to the N Chikada area. The player first approaches a man named Mori Masayori, who greets them casually and offers a passing tip about leaderboards only counting duel wins against live players, plus a slash-command tip. The player then approaches Shimazu Tadako, who gives a friendly greeting; talking to her formally updates the quest tracker to "guide Shimazu Tadako to N Chikada." The pair (player + Shimazu, the latter now tagged "GUEST") head toward the ruins entrance and step inside a stone dungeon room, but a hostile figure labeled "Bandit M." is present in that room; rather than fight there, the player backs out via a "leave dungeon" exit and returns to the forest exterior. Back outside, re-approaching Shimazu Tadako triggers a combat prompt ("attack now") and a fresh 2-enemy bandit ambush begins in the forest, with Shimazu fighting alongside the player as an ally.

## Feel               (pacing, camera, animation weight, FX; if combat: rough per-encounter durations in seconds)
- Fixed side-view camera, same framing for overworld traversal and combat — no camera cut when combat starts, just a HUD swap (quest/coin/XP panels disappear, "Auto Slash"/pause/combo HUD appears).
- Background: dense vertical dead-tree silhouettes with parallax fog layers in teal/grey, static rock and thicket props scattered on the grass foreground band; ruin structure (stone hut with mossy thatch roof) sits stage-right as a landmark.
- Combat animation weight is fairly heavy/deliberate: sword-swing sprites leave a brief blue motion-streak; hit reactions show red blood-splatter particles at the impact point; a red horizontal "threat line" appears connecting player and an approaching enemy just before contact (visible t=43:12).
- Dialogue interactions are instant on approach (no walk-up animation gating) — the "!" prompt appears the moment the NPC is in proximity, and pressing talk immediately opens the text box.
- Encounter durations (frame-sampled, ~2–3s cadence so these are approximate): first (losing) encounter spans at least t=42:00–42:22 (~22s+, likely longer before segment start) ending in defeat; second (retry) encounter spans t=43:12(attack prompt)–43:28+ (at least ~16s of frames captured, still ongoing at segment end, HP still dropping — the enemies here again seem to be out-trading the player, going from 20/20 to 14/20 within ~13s of combat).
- Defeat screen uses a duotone red silhouette treatment of the frozen combat frame behind the "YOU WERE DEFEATED!" text — a distinct FX moment, not just a plain color card.

## Recreation notes   (config values to add/adjust, which build Stage this maps to, anything contradicting the repo's spec/research docs)
- Player HP scale confirmed as 20 (not 100) across both overworld and combat views — matches whatever HP_MAX convention the repo has already inferred from earlier segments; flag for cross-check against `src/config/` if a different max HP constant was set from another segment.
- Escort NPCs are implemented as a generic "GUEST"-tagged ally unit that fights alongside the player once recruited, with an alternate name+level tag (`NAME (level)`) surfacing in some combat HUD states — worth deciding at design time whether the recreation shows escortee level numbers at all (original inconsistency between "GUEST" and "NAME (N)" tags may just be a Flash-era HUD bug, not an intentional feature).
- Free/instant respawn at last waypoint with no coin or XP penalty is a notable difficulty-softening mechanic — relevant to Stage(s) covering death/respawn flow and stakes design; the repo's spec should confirm whether SSHD 1:1 intends to keep respawn free or add a penalty (trade-dress/feel decision, not just palette).
- The escort route includes a "wrong turn" dungeon room with a named hostile (`Bandit M.`) that the player is expected to avoid/leave rather than fight at this stage — implies the escort quest area has at least one deliberate dead-end/trap room distinct from the intended forest path; worth modeling as a branch in whatever N Chikada map/quest-graph structure the recreation uses.
- Combat "CANNOT CHANGE STANCE" status text suggests a stance-lock mechanic during active attack/hit animations — a config-relevant timing value (lock duration) to pin down from a slower/cleaner combat segment; this segment only confirms the message exists, not its duration in frames/ms.
- Minimap widget swaps between an outdoor numbered-grid mode and an indoor compass-rose mode — a UI-state detail worth capturing in the recreation's map/HUD component design (two distinct minimap render modes, not a single persistent grid).
- HP-loss rates observed here (9 HP lost in ~2s in the first encounter; 6 HP lost in ~13s in the second) are noisy/inconsistent between the two samples of the "same" fight — do not treat either as a reliable damage-per-hit constant; a cleaner single-enemy duel segment should be used to derive per-hit damage values instead.

## VERIFIED
