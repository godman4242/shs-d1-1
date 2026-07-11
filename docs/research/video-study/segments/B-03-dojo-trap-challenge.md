# B-03 Dojo Trap Challenge (3:57–5:16)

Source: video B (`Nr4fQstqHDM.mp4`), study-only reference, absolute t=03:57→05:16.
32 frames sampled (~0.4 fps). A gold "SOUND360TM" watermark floats above the player's
head in nearly every frame — this is a recorder/overlay artifact from the source video,
**not** in-game UI; ignored below.

## Screens & layout   (positions, colors, typography, exact HUD contents; short UI labels verbatim OK)

Static side-on camera inside a dojo corridor (same tatami/shoji-door room dressing as
other dojo segments). HUD is identical to normal overworld/dojo HUD:

- **Top-left cluster:** coin/paper icon "**425 COINS**" + red circular "**+**" button;
  gold-coin icon "**2 GOLD**"; red "**GET GOLD**" button (t=03:57, persists whole clip).
- **Top-right:** fan/diamond icon "**14,391 / 16,350 EXPERIENCE POINTS**" (unchanged
  the entire segment — no XP awarded from repeated deaths or the eventual clear).
- **Location banner** (black bar, gold text): "**TRAP CHALLENGE**" while inside the
  challenge corridor (t=03:57–05:01); swaps to "**CHIKADA DOJO**" once the player exits
  north into the reward room (t=05:04, frame_0028).
- **Quest tracker** (white text under location banner, unchanged all segment): "**STORY
  QUEST: FIND WORK AT KAKUCHI TOWN**" — confirms Trap Challenge is a side-activity, not
  part of the active story quest.
- **Minimap** top-right: square compass (N/S/E/W labels, center triangle = facing
  direction) reading "**TERRITORY (23,52)**" / "**INSIDE SECTOR (5,4)**" throughout.
- **Player HUD** bottom-left: portrait bust icon, green HP bar "**19/20**" at clip
  start, red "+" button beside it, blue bar "**26/26**" (stamina or MP — no numeric
  drain observed this segment), label "**HEAVY STANCE**" (current stance name).
  HP reads **20/20** on every post-respawn re-entry (full heal on respawn).
- **Bottom toolbar** (center-right, icon row): chat bubble "…", tan blob icon, yin-yang
  icon, saw/scale icon, yellow scroll icon, gray hexagon-stone icon, black ninja-mask
  silhouette icon (tooltip reads "**NINJA SERVICES**" at t=04:44, frame_0020), gear
  icon. A sword-hilt icon tooltip reads "**DUEL**" at t=04:51 (frame_0023) — same
  toolbar row, icon swaps art depending on hover/context.
- **Room exit signs:** wooden arrow-signpost props, "**S**" on the left wall, "**N**"
  on the right wall. Floating label above the N sign names the room beyond it:
  "**TRAP CHALLENGE (N)**" while unsolved, "**CHIKADA DOJO (N)**" once cleared.

### Death cinematic (red kill-silhouette screen)
Full-screen solid dark red (~#990000) background, flat black silhouettes only (no
color/detail) — player ragdoll + the trap that killed them, e.g. a round boulder
silhouette (t=04:19, frame_0010; t=04:54, frame_0024) or a radial spray of small
dagger/kunai silhouettes (t=04:32, frame_0015). This holds ~1–2 sampled frames before
resolving to:

- **"YOU WERE DEFEATED!"** splash: red gradient outlined text over a black ink-splatter
  slash-mark graphic, still on the same solid-red background. Two buttons below it:
  "**LEAVE AREA**" and "**FREE RESPAWN**" (t=04:22 frame_0011; t=04:34 frame_0016;
  t=05:09 frame_0030 — three separate defeats recorded in this 79s window).
- Room-to-room transitions (challenge corridor ⇄ respawn point) show as a bright thin
  horizontal white line/streak wipe across a black frame (t=04:36 frame_0017; t=05:11
  frame_0031) — a scene-wipe FX, not a loading bar per se.

### Chest/reward popup (t=05:14, frame_0032)
Gold-framed modal, header "**YOU RECEIVED**", silhouette portrait of the player behind
it. Contents shown: a white paper/scroll-tag icon × **40**, plus two equipment-slot
icon cards: a navy/dark-purple shorts-type leg piece, and a white ankle-boot/tabi piece
(both outlined in blue/gray = "new item" highlight). Red "**OK**" button to confirm.
Behind the popup: player kneeling at an open green chest, floating label "**SEARCH
CHEST**". A gold "**ACHIEVEMENT UNLOCKED**" banner is visible clipped at the very
bottom edge of frame, simultaneous with the loot popup.

## Mechanics observed (rules, numbers, timings, damage/HP/cost values you can read — cite frame t=MM:SS for each claim)

- Entering the corridor from the dojo hub costs nothing observed; HUD coins/gold never
  change (425 coins / 2 gold constant t=03:57→05:14).
- HP is **19/20** at clip start (t=03:57) and **20/20** on every respawn thereafter
  (t=04:24 frame_0012, t=04:59 frame_0026) — respawn fully heals HP to max; the 26/26
  blue bar never drops at all, so it isn't consumed by traps or running.
- **Trap type 1 — rolling boulder:** a large tan/gray sphere prop appears rolling along
  the floor toward the player (first seen stationary/approaching t=04:17 frame_0009,
  player mid-air jump attempting to clear it). Contact = instant defeat, no partial
  damage state shown (HP bar never ticks down before the death screen) — reads as a
  one-hit-kill trap. Confirmed kill again at t=04:54 (frame_0024).
- **Trap type 2 — kunai/dagger volley:** a burst of small thrown-dagger silhouettes
  sprays in a wide radial/fan arc from an off-screen source (roughly 12+ individual
  daggers countable in frame_0015, t=04:32), instant-kill on contact, no HP depletion
  shown before the death screen.
- Single stray kunai/dagger props are also visible embedded in/near the doorway during
  normal traversal (t=03:59 frame_0002, t=04:07 frame_0005, t=04:46 frame_0021) —
  likely idle/decorative instances of the same trap prop before it triggers.
- A star/shuriken-shaped object appears briefly overhead at t=04:29 (frame_0014),
  consistent with a ceiling-mounted spinning-blade trap element, though it isn't seen
  actively cycling in the sampled frames.
- **Death → respawn loop timing:** from a death silhouette frame to the player back at
  full HP standing in the corridor is roughly 5–7s of sampled real time (e.g. death at
  t=04:19 → back in corridor at t=04:24; death at t=04:54 → back at t=04:59) — the
  player is choosing "FREE RESPAWN" (free, no coin/gold cost each time) rather than
  "LEAVE AREA".
- At least **3 confirmed deaths** inside this 79-second window (t≈04:22, 04:34, 05:09)
  before a successful clear, i.e. the challenge is intentionally punishing/trial-and-
  error, expecting multiple retries.
- On success, location banner flips from "TRAP CHALLENGE" to "**CHIKADA DOJO**"
  (t=05:04 frame_0028) and the player reaches a lootable chest.
- Chest reward (t=05:14 frame_0032): **40×** an unlabeled paper/scroll-icon item
  (icon too small/generic to name with confidence — looks like a crafting material or
  currency token, not coins/gold since those HUD counters don't change), plus **2 new
  equipment pieces** (a leg/shorts piece and a boot/tabi piece), plus an Achievement
  unlock banner.
- XP counter (14,391/16,350) does not move across the whole segment, including at the
  chest reward — this challenge's reward is gear/items, not XP, at least not shown by
  t=05:16.

## Story/dialogue     (OWN-WORDS summary; names/quest titles OK; no verbatim dialogue)

No dialogue or story text appears in this segment beyond the persistent quest tracker
label "Find work at Kakuchi Town," which is unrelated to the Trap Challenge and stays
untouched throughout — confirming this room is an optional side-challenge accessible
from inside the dojo hub, not a story beat. The room itself is named "Chikada Dojo"
once cleared, suggesting the dojo the player is standing in belongs to (or is named
after) a character/faction called Chikada.

## Feel               (pacing, camera, animation weight, FX; if combat: rough per-encounter durations in seconds)

- Camera is fixed/static, pure side-scroll within one dojo room — no vertical or
  tracking movement, matching the rest of the dojo hub scenes studied elsewhere.
- Player sprint/run cycle and a jump-tumble animation are both used to attempt trap
  avoidance (visible airborne pose at t=04:17, t=04:29, t=05:04) — movement reads as
  fast and committed, consistent with an obstacle-dodge minigame rather than combat.
- Each attempt (corridor entry → death or clear) is short: roughly **5–10 seconds** of
  sprinting before the player either dies or reaches the far door, based on frame
  spacing between "back in corridor" and the next red-screen death.
- Death FX is a hard cut to a flat, high-contrast red/black silhouette scene — no
  slow-mo, no particle gore, stylistically consistent with the "cinematic" framing
  described in the task (abrupt, poster-like kill screen rather than a gameplay damage
  animation).
- Scene transitions (corridor↔hub) use a quick bright horizontal wipe/streak effect
  rather than a fade or loading spinner.
- Overall pacing across the 79s clip: enter → die → free-respawn → re-enter, repeated
  3 times, then a successful run into the reward chest — a tight fail-retry loop
  typical of a "trial and error" trap gauntlet minigame.

## Recreation notes   (config values to add/adjust, which build Stage this maps to, anything contradicting the repo's spec/research docs)

- This is a **distinct challenge-room game mode** (per task framing), separate from
  the core `Sim` combat loop (`core/` scenes are render-only, `Sim` owns state per
  CLAUDE.md) — recommend a new dedicated mode/scene (e.g. `TrapChallengeScene`) rather
  than folding this into the duel/combat state machine, since mechanics are
  instant-kill hazard avoidance, not HP-attrition combat.
- Config values to add under `src/config/` (all currently INFERRED, need a CONTRACT
  pass before implementation):
  - `TRAP_CHALLENGE_RESPAWN_HEAL = full` (HP always resets to max on respawn — no
    partial-heal value observed).
  - `TRAP_CHALLENGE_RESPAWN_COST = 0` ("FREE RESPAWN" implies no coin/gold charge;
    HUD currency never changed across 3 deaths).
  - `TRAP_CHALLENGE_BOULDER_KILL = instant` (one-hit kill, no damage tick visible).
  - `TRAP_CHALLENGE_VOLLEY_COUNT ≈ 12` (rough count of daggers in the radial burst at
    t=04:32; needs a slower-motion re-watch to pin exact count/spacing before treating
    as CONTRACT).
  - `TRAP_CHALLENGE_REWARD_ITEM_QTY = 40` + 2 equipment-slot drops (leg piece, boot
    piece) + achievement flag, awarded once on first clear (unclear if repeatable —
    this clip doesn't show a second clear to test that).
- Nothing here contradicts existing repo docs/specs directly, but it does add a new
  fact not yet captured elsewhere: hub rooms can contain **named sub-locations**
  reachable via directional signposts (S/N) whose floating label swaps text depending
  on challenge state (e.g. "TRAP CHALLENGE (N)" → "CHIKADA DOJO (N)") — worth folding
  into whatever doc tracks the dojo hub's room graph.
- Palette invariant reminder for implementation: the red death-screen red and the
  in-game UI reds (GET GOLD button, HP bar red) should all get the same ±5–8% HSL
  trade-dress shift applied consistently, not just the primary UI chrome.

## VERIFIED
