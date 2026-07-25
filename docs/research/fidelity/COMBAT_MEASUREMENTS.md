# Combat measurements — Session 11 study pass (a)–(g)

Ledger ordered by SESSION11_KICKOFF study items. METHOD: ffmpeg frame
extracts from the two v0.717 longplays (A = `zFtCaTO0_1M` world/story,
B = `Nr4fQstqHDM` duels/dungeons; study-only, gitignored) → coarse 1fps
scans to locate moments → 60fps full-res bursts → pixel measurement
(PIL/numpy) + own-eyes frame reads. Evidence frames:
`reference/frames/session11/<agent>/t<sec>.png` (local-only).
Conversion: px @1080 ÷ 1.875 = stage px (canvas 1024×576).
Workflow: `wf_355d4b15-ee4` (10 viewer agents, 2026-07-24).

Standing rule: assertion follows MEASUREMENT. Every row is tagged
MEASURED (read from frames / developer-authored on-screen text),
FORUM (player-community consensus from KONGREGATE_FORUM_FINDINGS.md —
secondary), or INFERRED (deduced; inference stated). Contradictions get
both readings, never an average.

> **Evidence-class note.** The strongest rows here are **developer-authored
> on-screen text** (tutorial dialogue, menu strings, HUD labels) — the game
> telling you its own rules. Those outrank forum consensus, which outranks
> our own inference. Rows marked `DEV-TEXT` are that top class.

> **Raw agent returns (unedited, with their own caveats):**
> `session11-raw/` — 6 files, one per viewer agent, 101 structured rows.
> Every distilled claim below traces to one of them.

---

## ⚠️ §00 THE SAMPLING FLOOR — read before trusting any timing number

**Both longplays are 60 fps containers carrying only ~15 fps of UNIQUE content.**
Identical-frame runs are exactly 4 long, verified independently by **three**
agents on both videos (e.g. video A frames f164–167 byte-identical in the
nameplate region, then a step at f168).

Consequences, and they are not small:
- The finest resolvable interval from this footage is **66.7 ms**. No frame
  count measured from these recordings can be finer than a multiple of 4.
- **Any prior claim of "1-frame" (16.7 ms) behaviour is unresolvable here** —
  including Session 9's `DASH_SLASH_PX = 127` "1-frame snap". See row d-2.
- 60 fps extraction is 4× wasted disk/time on these sources; extract at 15 fps.
- This is a property of the *archival capture*, not necessarily of the Flash
  game (which likely ran 24–30 fps). It bounds what we can ever learn from
  video, not what the original did.

## ⚠️ §00b CORRECTIONS — rows below that a later pass OVERTURNED

A second, gap-filling pass (`wf_40316854-a52`, 5 agents, 93 rows, raw in
`session11-raw/gap-*.txt`) was run specifically to fill what the SESSION12
retune needs. It **corrected four rows from the first pass**. The originals are
left in place for traceability; **these corrections win.**

| row | first pass said | CORRECTED to |
|---|---|---|
| **f-8 / f-10** | "Focus buys EVASION, not crit damage" · "crit NOT FOUND" | ❌ **WRONG.** Focus **IS** the crit meter: when the bar fills, the HUD prints **"CRITICAL HIT"** inside it (A t=1747.000, t=2175.933 — the only two full-bar events in 65.8 min). The *Critical Evade* skill text is a **separate Balanced passive** that also keys off a full bar; the first pass read it as the bar's only purpose. The forum's "full Focus bar enables a critical slash" was **right**. |
| **f-9** | "−20 % per landed slash" | ❌ **NOT a general rule.** Only **19 real drops in 111 cycles / 59,262 frames**; 92 cycles have **no drop at all**. Drop size is constant *within* a fight but differs *between* fights (−19.8 %, −15.4 %, −11/−16 %, −46.5 %, −58.8 %). One cycle rose monotonically 2→100 px through a completed dash and **two registered hits** with zero drop. |
| **e-7** | "enemy HP bar's TOTAL WIDTH shrinks" | ❌ **False for NAMED enemies.** Their track is **fixed at 130 px**, the green fill shrinks inside it, remainder **dark red**. The original reading survives only for 1-hit mobs, which are only ever seen at 100 %. |
| **a-6** | "the line vanishes on the tick the player LANDS" | ❌ The stroke **vanishes on the FIRST DASH tick**, before the landing. |

**One first-pass technique is also contested — do not rely on it blindly:** the
`movement-gesture` agent proved a tooltip sliding 115 px while its object stayed
fixed and concluded tooltips render *at the cursor*. The `gap-move-issue` agent
found dojo/overworld interaction tooltips rendering in a **fixed boxed slot at the
top-left**, carrying no cursor information. Both readings recorded; most likely
there are **two tooltip families**. Verify which you are looking at first.

---

## §00c GAP-FILL RESULTS — the numbers SESSION12 actually needs

### Named enemies: HP, hits-to-kill, and the percentage bar

| enemy | player | total HP | hits to kill | damage seen |
|---|---|---|---|---|
| **JINBEI (4)** | GUEST **L5**, HP 20, Chi 20, Heavy | **132** (range 130–134) | **3** (42+48+42 = 132 exactly) | 36 / 10 / 30 / 27 / 42 / 48 / 42 |
| **HONDA SHIZUKA (7)** | SOUND360TM **L10**, HP 30, Chi 47, Heavy | **~44** (43–45) | **3** (21, 17, killer unreadable) | 21 / 17 |

- The bar is a **percentage** bar — **px-per-HP is NOT constant** (JINBEI 0.985 px/HP
  vs HONDA 2.95 px/HP on the same 130 px track). JINBEI's 1 px ≈ 1 HP is a
  coincidence; never hard-code px-per-HP.
- **HONDA SHIZUKA is the closest analogue to our `DuelScene`**: challenge → VS card
  → FIGHT! → YOU WIN → reward card, opponent labelled `NAME (LEVEL)`.
- ⚠️ **A LEVEL 10 player dealt LESS raw damage (17–21) than a LEVEL 5 player
  (27–48).** Player damage is **not** a function of level — weapon and target
  defence dominate. Do not scale damage from level alone.

### (gap C) Is damage fixed or a min/max ROLL? — **A ROLL**
Seven popups on ONE target, at ONE level, in ONE stance, with ONE weapon:
**36, 10, 30, 27, 42, 48, 42** — a spread far beyond read error, matching the
forum's "1 ATK adds ≈ +1 min and +1 max damage". ⇒ modelling it faithfully means
`physicalDamage` needs the **injected RNG**, which touches determinism and the
24-seed fingerprint. *(The lone `10` may be a different attack type — flagged.)*

### (gap F) What charges Focus — ANSWERED: **holding the slash input**
Charge begins **before or on the same tick** as the stroke, never after. Leads of
**0.933 s** and **1.200 s** were measured with the player's nameplate pinned to
±0.3 px and **no line on screen** — identical pose, identical position; the only
change is invisible input. The bold stroke is anchored at the *cursor* ~300 px
away and grows at 660 px/s (drag speed), so a held-but-motionless mouse charges
Focus while drawing nothing.
- Rate **45.05 ± 0.30 px/s** ⇒ empty→full **5.97 s** (confirms 6.00 s).
- Does **not** pause while the stroke is drawn (rms 0.76–1.01 px over 8 cycles).
- Does **not** charge while idle — **94.06 %** of sampled frames read zero.
- ✅ **Free exact readout:** `"CANNOT CHANGE STANCE"` ⇔ focus **== 0**; the fill
  replaces it the tick focus > 0; **"CRITICAL HIT"** overprints it at 100 %.

### (gap G) In combat there is NO separate move command — ANSWERED
Every travel leg in A t=114.0–121.9 (camera provably static, 33/33 unanimous) is
caused by **one drawn stroke**, in exactly two phases:
1. **APPROACH-RUN** ~655 px/s @1080 (**349 stage px/s**) to one endpoint of the stroke;
2. **DASH** along the stroke to the other endpoint — fixed **2–3 ticks (133–200 ms)**;
3. dead stop.

Landings accurate to **1–2 px** against the stroke bbox. **Zero stroke-free
movement ticks exist in combat.** Stroke→movement windup 133–200 ms; post-landing
the character is pixel-static for 733–1133 ms.
- Strokes appear at **full final length within one tick** — a partially-drawn
  stroke is never visible (clean NOT-FOUND).
- **Hold-to-run-toward-the-current-cursor is FALSIFIED in combat** by the abrupt
  2.7× speed change at exactly the stroke's near endpoint. The
  **latch-on-mousedown** variant survives.
- **Out of combat** movement is entirely strokeless, two gaits, and — unlike the
  combat approach — it **decelerates into its target**.

### (gap E) Gait selection is DESTINATION-TYPE first, not distance
The distance-threshold model is **falsified** by two camera- and pose-verified
counter-examples: a **202.2 stage px WALK** toward a map-exit hotspot, and an
**87.4 stage px RUN** toward a "BANDIT (4)" enemy.
⇒ **exit/transition ⇒ walk at any distance · hostile ⇒ run at any distance**, with
a distance threshold only for ordinary ground clicks — narrowed to
**(105.2, 130.8] stage px**.

### Speed readings across three independent agents — report the RANGE

| gait | movement-gesture | gap-move-issue | gap-gait-hitbox |
|---|---|---|---|
| WALK | 126 | 116 | 112.5 |
| RUN | 341 (mean) | 349 (mean) | 440 (**top**) |

Stage px/s. Walk consistent at **112–126**; run means agree at **341–349**, peak **440**.
Use a range, or state which statistic you picked.

### (gap H) Enemy AI — measured

| fact | value |
|---|---|
| approach gait | **walk only** (upright short-step); the deep-lean run is used *only* as the attack lunge |
| walk speed | median **128 stage px/s** (105–161 across 8 enemies) |
| ⚠️ correction | the earlier "~22 px/tick" is the **peak** of a stuttering walk (per-tick 17,22,11,23,0,23,…), mean **16–18**. Building at 22 makes every mob ~25 % too fast |
| attack lunge | **484 stage px/s** (~3.3× walk) |
| cadence (landed hits) | min **0.467 s**, median **0.733 s**, mean 0.853 s, max 1.933 s (n=10) |
| telegraph, approach attack | **0.600 s** — ✅ confirms our ≥520 ms assertion |
| telegraph, point-blank repeat | **0.267 s** — ❌ **fails** it. A single global ≥520 ms telegraph is **wrong**; the OG has two cases |
| telegraph FX | **none** — pose change only. Do NOT give enemies a drawn stroke line |
| attack geometry | a **dash-THROUGH**, the same mechanic as the player: commit at **194 stage px**, damage resolves at the END of the dash when the enemy is **96 stage px PAST** the player. A radius check cannot reproduce this |
| simultaneous attackers | **enemies take TURNS** — 1 at a time (occasionally 2). With 8 on screen the player's hit rate is no higher than 1v1. Implement an attack token |
| block / parry / dodge | **NONE** in ~70 s across ~30 enemies — clean negative. ⚠️ our `AISeamController.react()` models blocking the OG does not have |
| other | enemies leap (~80 stage px, landing into a lunge); waves spawn by falling in from above |

### (gap K) Hitbox width — honest NOT-FOUND, with a confound worth knowing
Not bracketed. One clean far-side MISS at **40.3 stage px beyond** a stroke's far
end — an upper bound only, no tighter than the first pass's ~4 px.
⚠️ **The confound is itself a finding:** damage appeared to resolve over the whole
**dash sweep from the player's start position**, not only the drawn line — two
enemies *behind* the line's near end died in one slash. **This tensions with a-5
strand ②** (a body that ran through an enemy dealt zero damage); the likely
reconciliation is that the harmless pass was the **approach-run**, while only the
**dash** phase damages (gap G). Unresolved — next session should use a
single-enemy stationary duel and read hits from the red numerals, not bar loss.

### New measurement trap (#6)
A **full** Focus bar carrying the "CRITICAL HIT" caption reads as a **79 px (29 %)
fill** to a left-edge contiguous-run measure — check whether x 498–513 is lit
before believing any mid-range value. Also: faint thin red tails persist at
focus 0; only the saturated RGB(167,16,3) head is a live stroke.

## §0 Developer-authored text — transcribed verbatim (video A)

| # | t (s) | Verbatim on-screen text | Bears on | Tag |
|---|---|---|---|---|
| D-1 | ~393.0 | "YOUR STANCE IS INDICATED BY THE COLOR OF THE CIRCLE AROUND YOUR PORTRAIT: LIGHT STANCE – BLUE, BALANCED STANCE – BROWN, HEAVY STANCE – RED." | HUD portrait ring (fidelity) | DEV-TEXT |
| D-2 | ~395.0 | "THERE ARE 3 BASIC STANCES: LIGHT, BALANCED AND HEAVY." | (c) | DEV-TEXT |
| D-3 | ~396.0 | "BALANCED IS EFFECTIVE AGAINST LIGHT. HEAVY IS EFFECTIVE AGAINST BALANCED. LIGHT IS EFFECTIVE AGAINST HEAVY." | (c) counter triangle | DEV-TEXT |
| D-4 | ~397.0 | "TRY ATTACKING THIS TRAINING DUMMY WITH THE HEAVY STANCE." + a **"CHANGE STANCE"** pointer arrow aimed at the **portrait** | stance-switch input | DEV-TEXT |
| D-5 | ~112 | "DRAW A LINE TO SLASH" | (a) core verb | DEV-TEXT |
| D-6 | **470.0** | **"TRY TURNING AUTOSLASH ON. YOUR BODY WILL MOVE WITH MUSCLE MEMORY WHILE YOU CAN FOCUS ON ACTIVATING YOUR SKILLS."** | **(g)** | DEV-TEXT |
| D-7 | ~441 | "NOW USE THE CHI PUNCH SKILL ON THIS TRAINING DUMMY." | skills | DEV-TEXT |
| D-8 | ~466/467 | "WHENEVER YOU LEVEL UP, YOU WILL RECEIVE SKILL POINTS TO LEARN NEW SKILLS AND UPGRADE EXISTING SKILLS." / "ACCESS THE SKILLS MENU TO LEARN AND EQUIP NEW SKILLS." | progression | DEV-TEXT |
| D-9 | ~469.3 | "SOME OF MY STUDENTS ARE EAGER TO SPAR WITH YOU. WOULD YOU GRANT THEM THE HONOR?" | dojo sparring | DEV-TEXT |
| D-10 | in combat | HUD reads **"CANNOT CHANGE STANCE"** under the portrait | in-combat stance lock | DEV-TEXT |

Evidence frames: `session11/lead/t393.0…`, `t395.0…`, `t396.0…`, `t470.0…`.

**D-3 settles the counter triangle by developer text.** It reads
balanced ▸ light, heavy ▸ balanced, light ▸ heavy — i.e. exactly the
`light > heavy > balanced > light` direction already in `core/stance.ts`.
Previously "wiki-confirmed"; now DEV-TEXT confirmed. Do not relitigate.

## §0b HUD anatomy + baseline stats (MEASURED, video A)

| # | Fact | Value | Evidence | Tag |
|---|---|---|---|---|
| H-1 | Early player pools + stats (PLAYER screen, level 2) | **HP green · Chi 10/10 · AP 30/30**; **ATK 1 · DEF 1 (+2) · SPD 1**; weight **14/100**; available stat points 3 | A t≈152 PLAYER screen, re-read at full resolution (a first pass off a downscaled survey thumbnail wrongly recorded AP as 50/50 — **corrected**); combat HUD `session11/lead/t114.0_first-combat-hud.png` | MEASURED |
| H-1b | AP is a real third stat but **never appears on the battle HUD** — only on the PLAYER screen. Corroborated independently: the crit-focus agent read AP 30/30 off the character sheet at B t=710. | AP 30/30 | A t≈152; B t=710 | MEASURED |
| H-2 | HP grows to **20/20** by the dojo tutorial; Chi still **10/10** | 20/20 · 10/10 | A t≈420–520 tutorial frames | MEASURED |
| H-3 | Chi pool is a **~10 pool** (not 100) → skill costs are single-digit | 10/10 at L1 | H-1; corroborates REBUILD_READINESS §3 | MEASURED |
| H-4 | Battle HUD carries **exactly two player bars**: green HP + blue Chi. No third meter is visible bottom-left | 2 bars | `t114.0_first-combat-hud.png`, `t119.75_drawn-stroke.png` | MEASURED |
| H-5 | Stance ring colour ↔ stance confirmed live: red ring + "HEAVY STANCE" label | red=heavy | `t583.65_overworld-heavy-stance-hud.png` | MEASURED |
| H-6 | XP curve reads: L1 bar `0 / 550`; L2 `787 / 1450`; level-up popup "STAT POINTS +3 / SKILL POINTS +1 / NEXT LEVEL 663 XP" | see values | A boot survey | MEASURED |
| H-7 | Combat plate reads **"AUTO SLASH OFF"** in every combat frame inspected | OFF | t114.0, t119.75 | MEASURED |
| H-8 | Version stamp on the title screen | **v0.717** | A t≈0–5 | MEASURED |
| **H-9** | **The portrait ring IS stance-coloured — a live build bug.** Same HUD element, same video: at t=114.0 and t=121.98 (BALANCED) the ring band (r≈44–52 px @1080 about centre ≈(166,999)) is **ochre/brown ≈ `#8c642e`** with *no* red anywhere; at t=583.65 (HEAVY, label reads "HEAVY STANCE") the same band is **deep red ≈ `#8a110b`**. This matches DEV-TEXT D-1 exactly. `DuelScene.ts` hardcodes `COL.ringRed` and its comment claims the ring "reads constant RED in the original (both videos, both stances) — the stance-colored ring was our invention, dropped for fidelity." **That claim is REFUTED**: the earlier pass sampled only heavy-stance frames (B t=3772–3776 duel + A-28), so red was the only hue it could ever see. LIGHT (blue per D-1) still needs a frame. | balanced `#8c642e` · heavy `#8a110b` (≈ existing `ringRed 0x950d00`, measured off B) · light = blue, unmeasured | `session11/lead/t114.0_first-combat-hud.png` vs `t583.65_overworld-heavy-stance-hud.png`; radial band sampling | MEASURED |
| H-10 | In combat the stance line sits on a brown/tan plate reading "CANNOT CHANGE STANCE"; out of combat it is plain white text ("HEAVY STANCE") on the black smear, no plate | two treatments | same two frames | MEASURED |

## (a) THE CRUX — blade-path-with-reach vs move-to-target

| # | Fact | Value | Evidence | Tag |
|---|---|---|---|---|
| a-1 | Instance 1 (duel, prior session): one long horizontal blade arc reaches ACROSS a gap, bloodies MULTIPLE strung-out enemies at once, then retracts; body flash-steps a MODEST distance along the cut (not a teleport); the FAR enemy keeps full HP → finite reach, damage lives on the line | blade-path-with-reach CONFIRMED | B `duel_dense/Nr4fQstqHDM_428.0.png`→`_428.9.png` own-eyes read 2026-07-18; also `combat_analysis/…t428.5.png`, `duel_dense/…432.3.png` (far enemy full HP) | MEASURED |

| a-2 | **Instance 2 — the game's FIRST fight (video A, level 1, Balanced, HP 10/10, 5 enemies strung out).** The drawn stroke renders as **ONE continuous world-anchored line**: a thin dark-red line that tapers into a bold bright-red head segment. Released ~t=119.3; it spans x≈680→1455 @1080 at head height (y≈695–733), passing directly OVER the two nearest enemies. The player then flash-steps rightward along it; at t=120.25 blood sprays on an enemy the LINE crossed, and by t=120.35–120.45 two enemies are dead on the ground — **while the player's body is ~300 px @1080 (~160 stage px) to their RIGHT and never occupied their position.** Damage therefore follows the LINE, not the body → **blade-path CONFIRMED a second time, on independent footage.** | line length ≈775 px @1080 ≈ 413 stage px | A t=119.25→120.45; `session11/lead/t119.65_stroke-fullres.png`, `t120.25_first-blood.png`, `t120.35_enemy-down.png` | MEASURED |
| a-3 | The line is **world-anchored, not screen-anchored** — it drifts leftward across the frame exactly as the camera pans right, so it is a world-space stroke, not a HUD overlay | — | same window, 7-frame montage | MEASURED |
| a-4 | **Two visual families must not be confused:** the **RED** thin→bold line is the *drawn input stroke*; the **BLUE** arc seen in the duel corpus is the *executed blade FX*. Earlier notes describing "a long horizontal blue arc" and this red line are the same mechanic at different render stages | — | a-1 (blue, duel_dense) vs a-2 (red, video A) | INFERRED |

### a-5 — THE FALSIFICATION TEST, RESOLVED: blade-path WINS, move-to-target REFUTED

Run on video A's first fight (level 1, Balanced, 5 enemies strung out). Three
**independent** strands, any one of which alone would be suggestive; together
they settle it:

| strand | evidence | verdict |
|---|---|---|
| **① TIMING** | Slash S3: the victim's HP bar starts draining on the **very tick the line appears** (t=119.267), and the player's body does not arrive until t=119.667 — **0.40 s later**. Damage *precedes* arrival. | blade-path |
| **② BODY-PATH NEGATIVE** | Slash S2: the player's body travelled x 405→781 **straight through** an enemy standing at 585 and dealt him **zero** damage (bar width 129–130 constant every tick). Walking onto an enemy does nothing. | blade-path |
| **③ LINE COVERAGE** | Every damaged enemy's centre lies **inside** the drawn line's span; the only survivor's centre lies **41 px @1080 (22 stage px) outside** it. | blade-path |

**Caveat the agent raised itself:** damage lands on enemies covered by the faint
**thin tail** as well as the bold head (both S0 and S3 victims sat under the tail).
So the damaging span is the **whole drawn line**, not just the bold segment.

⚠️ **Strand ① is contested — see Contradiction #4.** Strands ② and ③ do not
depend on it, and `crux-dungeon` reproduced the same conclusion independently,
so the verdict stands on ②+③ even if ① is discarded.

### a-6 — The line is BOTH the cut AND the dash path (this is the synthesis)

Lifecycle, identical across all 4 dungeon instances **and** the 2 clean
first-combat instances: mouse-down blob → **whole line appears within one
content tick** (it is not drawn progressively) → line hangs motionless in
**world** space for 0.13–0.93 s → player dashes along it → **the line vanishes
on the exact tick the player lands at its far endpoint**.

Arrival-pinned to the pixel: S1 line ends 428, player stops 427 (1 px error);
S2 line ends 835, player stops 831 (4 px error).

**This is why the owner's feel-run was half right.** He saw the body run to the
line and concluded the line was a move command. It *is* a move command — and it
is *also* the blade path, resolving damage along itself at commit time,
independent of where the body ends up. Both halves are true at once.

### a-7 — ONE line can kill TWO enemies

Dungeon t=1401.833: 3 enemy bars → 1, with a connected-component detector
confirming exactly **one** stroke present on every content tick. The two victims
were 63.5 stage px apart. Multi-target-per-stroke is real.

### a-8 — Stroke render anatomy

One continuous line = faint **thin tail** + saturated **bold head**. The bold
sits at the end drawn **last**, so it flips side with drag direction (bold-left
in S0, bold-right in S1/S2/S3). Bold 12–14 px @1080 (6.4–7.5 stage px); thin
2–6 px (1.1–3.2 stage px); bold colour ≈ RGB(160–180, 12–22, 0–10). Bold fraction
of the full line varied 47 %/62 %/82 %/100 % across four strokes — **no hard
clamp on slash length was observed at level 1**. Strokes may be straight, curved
or zig-zag.

<!-- later rows merge here -->

## (b) Movement gesture + travel speed

| # | Fact | Value | Evidence | Tag |
|---|---|---|---|---|
| b-0 | In-game Tip #27 states hold-mouse-to-run toward cursor; the 2026-07-20 research pass found NO tap/click=move gesture | hold-run leading model (pre-study prior) | REBUILD_READINESS §3 | FORUM |

### b-1 — VERDICT: click-destination (M2) leading; hold-run (M1) NOT strictly falsified

**This reverses the project's working assumption.** Tagged **INFERRED / medium** —
the agent was explicitly instructed to be willing to return UNDECIDABLE and did
not force a verdict.

**Methodological unlock:** the interaction tooltip is rendered **at the mouse
cursor**, not anchored to the object it names — proven by the "LOOK AT SIGN"
text sliding 115 px horizontally and ~50 px vertically while both the sign and
the camera stayed pixel-identical. So **a lit tooltip is a direct cursor readout**
(to ±150 px). Reusable in every future session.

Evidence for M2:
1. **Gait and speed are LATCHED for a whole leg** and never track live cursor
   distance. In 5 separate arrivals the character was still doing +54/+55 px per
   tick (**full run**) while already *inside* the cursor's own tooltip span. A
   live-cursor model with this game's demonstrable distance-based gait would have
   dropped to the 236 px/s walk on final approach. It never does.
2. **The engine has no acceleration ramp** — 0 → +57 px in one 67 ms tick from a
   2.6 s standstill, idle pose → full deep-lean run in the same tick. So any
   gradual speed change must be input-driven, and none is observed.
3. **The only apparent M1 signature is a scripted zone-entry walk.** After every
   zone transition the character spawns at screen x≈232 and **auto-walks** to
   x≈397 before player control resumes — measured at 396.2 / 396.9 / 401.6 in
   three different zones. That removes the "smooth walk→run mid-leg" datum.
4. Two interior **stop → pause → resume-same-direction** events (0.267 s, 0.800 s).
5. Arriving at an interactive object **auto-fires** the interaction on the tick
   the character halts.

**Honest residual (why this is not a falsification):** no frame shows the
character moving *away* from, or *past*, a lit tooltip. And a hold-to-move
variant that **latches target + gait on mouse-down** would be behaviourally
identical in this footage. The 15 Hz floor hides sub-67 ms transitions, mouse
state is never visible, and there is no click marker to reveal it.

**What would decide it:** a frame where the character moves while a lit tooltip
is *behind* it, or runs *past* a lit tooltip's x, or a HUD-button click mid-travel
with the character continuing. None occurred in the windows examined.

**Build consequence that holds under BOTH models:** the movement target and gait
are **latched at command time**, not re-read every frame. Our `Sim` currently
re-reads `moveTargetX` from the live cursor every tick — that is wrong either way.

### b-2 — Travel speeds: our single speed matches NEITHER gait

| gait | px/s @1080 | **stage px/s** | per 15 Hz tick |
|---|---|---|---|
| WALK (upright, short step) | 236 (216–254) | **126** (115–135) | 15.7 px @1080 |
| RUN (deep lean, bounding) | 639 (626–658) | **341** (334–351) | 42.6 px @1080 |

Ratio run : walk = **2.71**. Each figure from **4 independent legs** with camera
scroll verified zero (template-anchored on a static signpost), tracked via the
rigid "GUEST" nameplate.

Our build's `PLAYER_MOVE_SPEED = 0.28 px/ms` = 280 stage px/s = **2.22× the walk
and 0.82× the run** — it matches neither. The build needs **two** gaits.

### b-3 — Gait is chosen ONCE per leg, by the leg's total length

WALK used for legs of 63 / 84 / 88 stage px. RUN used for legs of 132 / 221 /
334 / 486 / 756 stage px. **Threshold lies in 88–132 stage px and is unresolved** —
no observed leg falls in the gap. Distance-latched, not live.

### b-4 — Arrival signature: no deceleration ramp

Full speed right up to the last tick, then **one clamped partial tick**, then
zero (+22→0; +55,+11,+6→0; +54,+9.7→0). Total stop ≤2 ticks (≤133 ms). Consistent
with a `min(speed, distanceRemaining)` clamp — present in both candidate models,
so not itself discriminating.

### b-5 — NOT-FOUND rows (absence is the finding)

- **No click-marker / destination FX anywhere** — no decal, ring, cross, dust or
  particle at any destination, checked on every arrival plus the 3 ticks before
  and after. **The build must not add one.**
- **No developer text explains movement.** A full sweep of video A t=95–190 found
  combat gets "DRAW A LINE TO SLASH" but movement gets nothing. This was the one
  route to a MEASURED verdict and it is closed — hence b-1 stays INFERRED.

### b-6 — Camera behaviour (needed to convert screen→world)

The character pins at screen x≈1072–1082 @1080 (**≈56 % of stage width**) when
running right; the camera then scrolls at exactly the character's world speed
(measured 587 px/s @1080 = 313 stage px/s). The camera **clamps at zone edges** —
when clamped the character crosses the whole screen unaided.

⚠️ Method warning: naive frame-differencing of the ground band under-reports
camera scroll by ~3× because the character's white body dominates the match.
Track a discrete world-fixed feature (a signpost) instead.

### b-7 — Scripted zone-entry walk (a build requirement in its own right)

After every zone transition: spawn at screen x = 231.5–232.5 @1080 (123.5 stage
px), auto-walk to x = 396.2–401.6 (211–214 stage px) — a fixed 88–91 stage px
over 0.667–0.733 s at walk speed — **before player control resumes.** Observed in
four separate zones.

## (c) Slash reach + speed per stance

| # | Fact | Value | Evidence | Tag |
|---|---|---|---|---|
| c-0 | Wiki stance tables are mastery-9 CEILINGS, not base (Heavy ceiling reach 100; L1 Shugyosha dmg Light ×0.5 / Balanced ×1.0 / Heavy ×1.4) | current `STANCE_TABLE` 300/200/100 = ceiling values | REBUILD_READINESS §3 ③ | FORUM |
| c-1 | Strike-to-strike swing intervals (no movement): 12f / 16f / 20f light/balanced/heavy | `SLASH_FRAMES` (landed Session 8B) | MOTION_MEASUREMENTS.md (B t=3774–3780 cadence analysis) | MEASURED |

### c-2 — REACH PER STANCE, measured: Light ✅ confirmed, Heavy ✅ confirmed, Balanced ❌ NOT confirmed

Method: distance from the player's body to the **far end of the drawn stroke**,
counting only strokes whose near end starts within 30 px of the player.

| stance | plateau (stage px) | max (stage px) | n | wiki table | verdict |
|---|---|---|---|---|---|
| **Light** | 233–241 | **303** | 17 | 300 | ✅ **CONFIRMED** (max 303 lands on 300) |
| **Balanced** | 116–131 | **131** | 17 | 200 | ❌ **NOT CONFIRMED** — measured 131 |
| **Heavy** | 97–103 | 121 | 25 | 100 | ✅ **CONFIRMED** (plateau sits on 100) |

**Ordering Light > Balanced > Heavy is unambiguously CONFIRMED.** Measured ratio
2.3 : 1.15 : 1.0 vs the wiki's 3 : 2 : 1.

⚠️ **The Balanced gap cannot be resolved from this footage.** The *only* Balanced
combat in either video is the level-1 tutorial fight; Light and Heavy were both
measured on a **level-8** character. A 1 fps scan of video B t=880–4080 and video
A t=100–2400 found the player in **HEAVY for essentially the entire rest of both
runs**. So "wiki value wrong" cannot be separated from "level-1 mastery". Both
readings reported, never averaged.

### c-3 — Reach is **NOT a body-centred radius** (structural, affects the hit test)

Two independent demonstrations:
- Dungeon t=1401.833: an enemy **232 stage px to the LEFT was killed** while one
  **245 stage px to the RIGHT was untouched**. t=1450.833: an enemy **106 stage
  px away on the wrong side survived** while one **194 stage px away died**.
- First combat: farthest-**damaged** at 262 px @1080 vs nearest-**undamaged** at
  158 px @1080 — the bracket comes out **inverted**, which by itself refutes a
  radius.

Restated **line-relative**, it is consistent across every resolved instance:
*every enemy whose body centre falls inside the drawn line's span took damage;
the one whose centre fell outside took nothing, by a margin of ≤22 stage px.*
The hit test is against the **drawn polyline**, not a circle — and the hitbox is
**narrower than the sprite** (an enemy whose sprite edge overlapped the line by
~4 px still took nothing).

✅ **Our current implementation already has this structure right**: `resolveSlash`
requires the stroke to *cross the hitbox* **and** be within reach. The crossing
test supplies the direction-sensitivity the radius alone lacks. The Session-11
adjudication's per-segment gate stands; only the reach **values** need revisiting.

### c-4 — STANCE SWITCH: solved, and it is FREE

Clicking the bottom-left **portrait** cycles stance — proven by the "CHANGE
STANCE" hover tooltip rendered under the portrait in the exact frame pair where
LIGHT flips to BALANCED one content tick later (B t=851.867 → t=851.933).
**Cycle order LIGHT → BALANCED → HEAVY.**

Three things change together and nothing else: ring colour (blue/tan/red),
portrait background tint (navy/olive/maroon), and the stance text.

**COST IS ZERO** — HP 20/20 and Chi 31/31 are pixel-identical either side of
**both** observed switches. (AP is NOT-FOUND: it renders only on the PLAYER
screen, which is closed during a switch.) In combat the switch is locked and the
strip reads "CANNOT CHANGE STANCE".

⇒ Our `FOCUS_SWITCH_COST = 34 × WEAPON_WEIGHT` has **no measured basis**. The OG
charges nothing out of combat and forbids it in combat.

### c-5 — Swing cadence: FLAGGED UNUSABLE, keep INFERRED

Minimum strike-to-strike was **0.133 s in BOTH Light and Heavy**, and Heavy's
modal interval came out *shorter* than Light's — the **opposite** of the prior
12f/16f/20f ordering. Medians are dominated by how fast the human drew, and in
duels both fighters draw strokes.

⚠️ This puts Session 8B's `SLASH_FRAMES` (12/16/20 light/balanced/heavy) **in
doubt**. It is not refuted — that measurement came from a different window and
method — but it is no longer corroborated. Left unchanged; flagged.

### c-6 — Two corrections to earlier project readings

1. **"150 % DAMAGE" is a TIMED BUFF, not a Heavy-stance property.** It renders as
   "150% DAMAGE 21:23" with an **mm:ss countdown**, appears in *both* Light and
   Heavy fights, and is absent from the Balanced fight. (It is the Potato Dog
   consumable from B-MAP.) The `duel_dense` note calling it a stance indicator
   is wrong.
2. **The big coloured blade slab is the EQUIPPED WEAPON sprite, not a
   stance-coloured arc.** The player swapped weapons at B t=807–824 (blue
   big-sword before, red after); a later Light fight still produced 250–630 px
   strokes, so **reach tracks stance, not weapon**.

## (d) Body travel per swing

| # | Fact | Value | Evidence | Tag |
|---|---|---|---|---|
| d-1 | Dash-through slash displacement is a ONE-video-frame snap of ~238 px @1080 = 127 stage px; landing pose holds 4–12f; streak renders AFTER arrival | `DASH_SLASH_PX = 127` (landed Session 9) | MOTION_MEASUREMENTS.md (strike-C f176–248, 3 dashes) | MEASURED |

### d-2 — ⚠️ The swing displacement is a MULTI-TICK RUN, not a 1-frame snap — `DASH_SLASH_PX` is contested

Measured on video A's first fight (Balanced, level 1), player x from the rigid
nameplate, camera verified static:

| slash | displacement | duration | per-tick deltas (px @1080) |
|---|---|---|---|
| S2 | +404 px @1080 = **+215 stage px** | 6 ticks = 0.400 s | +28, +26, +55, +57, +26, +104, +108 |
| S1 | −646 px @1080 = **−345 stage px** | 11 ticks = 0.733 s | −58, −28, −53, −56, −25, −54, −54, −31, −96, −133 |
| S0 | +112 px @1080 = +60 stage px | 7 ticks | — |

**Largest single-tick displacement anywhere = 133 px @1080 = 71 stage px**, i.e.
**56 % of the 238 px** that Session 9's `DASH_SLASH_PX = 127` claims happens in
one frame. Both runs visibly **accelerate** (last two ticks are 2–4× the earlier
ones) and show 6–11 distinct intermediate positions. A sprite-based cross-check
on S2 agrees (+376 px = 200 stage px).

**The sampling floor does NOT rescue the old reading:** at 15 Hz a genuine 1/60 s
snap would *still* appear as one ≥238 px jump between adjacent ticks. No such
jump exists in this window.

**Contested, not overturned** — see Contradiction #3. Session 9's measurement came
from **video B** (a level-8 duel, strike-C), this one from **video A** (a level-1
overworld mob fight). `DASH_SLASH_PX = 127` is left **unchanged** pending a
same-method re-measure on video B.

The dungeon agent independently timed the traverse at **333–709 stage px/s** with
a 0.067–0.200 s latency between the line appearing and the dash starting.

## (e) Damage / HP / TTK

| # | Fact | Value | Evidence | Tag |
|---|---|---|---|---|
| e-0 | Early PvE player HP reads 20/20 (SMALL pools → fast TTK); config seeds 100/150 are PvP-dummy spec numbers, flagged for ONE coherent retune with this section | player 20/20 | `duel_dense/…428.x` HUD read 2026-07-18 (incidental) | MEASURED |
| e-1 | A 3-hit combo TAKEN dropped player 20/20 → 4/20 (27 total claimed by prior read — arithmetic suspect, re-read queued) | ~5–9 HP per enemy hit | SHSD_MASTER_REFERENCE (A-16 t≈32:45) | MEASURED (re-read pending) |

### e-2 — 💥 ORDINARY MOBS DIE IN **ONE HIT**

Across **3 encounters and >15 bar-disappearance events**, no non-named enemy's
HP bar was ever observed at anything other than **100 % green on the last frame
it existed**. Partial bars belong *only* to NAMED characters (e.g. "JINBEI (4)").
Verified on 4 individually-tracked enemies in the dungeon fight, plus every enemy
in the level-1 forest fight and the 8-enemy dungeon fight.

⇒ **hits-to-kill on standard early mobs = 1** · **HP fraction dropped per hit = 100 %**

This is the single largest gap between the OG and our build, which needs
**19 slashes** to kill a 150-HP enemy at 8 damage. It also explains the research
note that PvE trash resolves in 3–10 s: that is *travel and approach* time, not
grinding an HP bar down.

### e-3 — Popup COLOUR encodes direction (proven, not guessed)

**Dark/black popup = damage the PLAYER took. Red popup = damage dealt to an
ENEMY.** The black number equalled the player's HP loss on the same frame in
**13 of 14** events (7×"2" in the beach duel, 6×"1" in the dungeon).

Popups are small numerals that rise ~25 px @1080 (13.3 stage px) over ~0.200 s
while fading, and **scale UP as they rise** (29×40 px → 42×62 px over 15 frames),
so glyph size alone can never identify a crit.

### e-4 — Measured damage numbers

| context | player HP | stance | damage |
|---|---|---|---|
| dungeon mobs → player | 20 | Heavy | exactly **1** per hit |
| JINBEI (4) → player | 20 | Heavy | exactly **2** per hit (a clean 2× on mobs) |
| player → JINBEI (4) | — | Heavy | red **36 / 30 / 27** |
| player → mobs, level 1 | 10 | Balanced | red **1** and **2** |

The 27/30/36 spread lands on the same target, same stance, same fight, seconds
apart — consistent with the forum's "wide min/max damage roll", not with a
distinct crit tier (see f-9).

### e-5 — Two corrections to earlier project claims

1. ❌ **The "3-hit combo dropped the player 20/20 → 4/20 (27 total)" is WRONG.**
   The beach duel **starts at 16/20**, and the fall to 4/20 is **seven separate
   2-damage hits** across t=1959.60–1963.57. `SHSD_MASTER_REFERENCE`'s A-16 entry
   (and the `e-1` row above, inherited from it) should be corrected. The
   arithmetic that never worked (27/3 = 9 ≠ 5.3) was the tell.
2. ❌ **"Full-screen red flash = kill-cam" is only half right.** A red **tint with
   the scene still in colour** is the *player-hurt vignette* (~0.20 s, fires on
   every hit taken). The **kill-cam** is red with **black silhouettes** and
   precedes YOU WIN. Our `t125.467` "kill flash" is actually the hurt vignette.

### e-6 — Honest contradiction (reported, not averaged)

In the level-1 fight the player loses **4 HP in a single 1/60 s step** at
t=125.467 while only one black "2" is visible. Most likely two attackers landing
on the same tick with overlapping popups — flagged, unresolved.

### e-7 — Enemy HP bar is a WIDTH-SHRINKING widget, not a draining fill

The bar's **total width shrinks** with current HP (left-anchored); it is not a
coloured fill inside a fixed frame. Full bar = **129–131 px @1080 = 69–70 stage
px**, fill rows y 627–637, fill colour ≈ RGB(4,154,6)–(23,156,39). Bar centre
sits ~+19 px right of the sprite centre. Useful as an exact per-tick damage
detector — **with two traps**, below.

## (f) Crit / Focus economy

| # | Fact | Value | Evidence | Tag |
|---|---|---|---|---|
| f-0 | A FULL Focus bar enables a critical slash; boss fights end in a coup-de-grâce finisher; crits aimed "preferably on the head" | full-bar crit gating | KONGREGATE_FORUM_FINDINGS (combat-core; Amaya thread) | FORUM |
| f-1 | Stance switch: SPACE quick-toggles only if the Focus bar is full enough; in duels stance is normally pre-set by clicking your own portrait | Focus pays stance switch | KONGREGATE_FORUM_FINDINGS (Basics thread) | FORUM |
| f-2 | Crit multiplier: game wiki (2016+2025) states Critical = 1.3× Physical; the "3×" folklore reads as 1.3× compounded with per-stance crit-damage stats + item crit lines; the iaido-duel "measured 3.0×" was a DIFFERENT GAME (VOID here) | `CRIT_MULT = 1.3` default | REBUILD_READINESS §3 ② | FORUM |
| f-3 | Level-12 PvP hits usually land 1–5 with occasional ~20 spikes (wide min/max spread or crits) | popup magnitude context | KONGREGATE_FORUM_FINDINGS (items-equipment) | FORUM |

| **f-4** | **THE THIRD METER EXISTS AND IS REAL — Focus.** The OG duel HUD carries **three** stacked elements sharing left edge x=246 @1080: green **HP** (`14/30`), blue **Chi** (`47/47`, full track ends x=513), and below them a **white fill on a brown track with no numeric label**. The white one visibly fills during the fight. This closes open contradiction #1: our build's HP + Chi + Focus-strip layout matches the OG. | 3 elements, track **268 px** @1080 = 143 stage px | B t=3773.5–3774.8, `session11/lead/` + `hudB` crops; bar-extent pixel scan at t=3774.0 | MEASURED |
| **f-5** | **Focus fills PASSIVELY and LINEARLY with time** — two independent ramps: 3→93 px over t=3772.50→3774.50 (**45.0 px/s**) and 2→131 px over t=3776.30→3779.10 (**46.1 px/s**). Per-0.1 s deltas are a flat ≈4.55 px with **no event-driven jumps**, so the charge is time-based, not per-hit. | **≈45.5 px/s** | B t=3772–3779, 10 fps fill-width scan | MEASURED |
| **f-6** | **Focus empty→full ≈ 5.9 s** (268 px ÷ 45.5 px/s). Our build's Critical meter takes **12.5 s** (fills 8/s to CRITICAL_MAX) — **the OG is ≈2.1× faster**, which quantifies the owner's feel-run complaint "crit fill too slow" with a number for the first time. | **≈5.9 s** vs our 12.5 s | derived from f-5 + f-4 track width | **rate MEASURED; total INFERRED** — the observed ramps only span 0→49 % of the track, so the full time extrapolates a constant rate; no full-fill or consumption event was captured |
| f-7 | The third strip is **shared with stance messaging**: when the game shows "CANNOT CHANGE STANCE" (t=3774.6–3775.0) the message replaces the bar in the same slot. Apparent "resets" to 0 in the fill scan are this takeover, **not** the meter emptying — do not read them as consumption events. | shared slot | B t=3774.8 crop vs fill scan | MEASURED |

### f-8 — 💥 THE OG HAS **NO CRITICAL METER**. Focus is real, developer-named, and buys **EVASION**

Exactly **three** meters exist: **HP** (green), **CHI** (blue), **FOCUS** (white,
no numerals). There is no fourth bar anywhere.

**Developer text names it and states what it does** — the Balanced-stance passive
**CRITICAL EVADE** reads verbatim:

> "ALLOWS YOU TO EVADE ATTACKS WHILE SLASHING IN THIS STANCE **WHEN YOUR FOCUS
> BAR IS FULL**" — video B t=740.0

⇒ **A full Focus bar buys i-frames while slashing, NOT crit damage.** The forum's
"Focus gates crits" almost certainly came from players conflating the *skill name*
"Critical **Evade**" with critical *hits*. Our `critical.ts` models a standalone
Critical meter that the original does not have.

**Geometry** (all three bars share one track): x 245–514 @1080 = 130.7–274.1 stage
px, width 269–270 @1080 = **143.5–144.0 stage px**; rows y 972–988 (HP),
1000–1017 (Chi), 1030–1046 (Focus).

### f-9 — Focus economy, measured

| quantity | value | basis |
|---|---|---|
| charge rate | 44.8–45.0 px/s, **perfectly linear** | 3 independent 60 fps regressions |
| **empty → full** | **6.00 s** | agreeing to 0.5 % (6.01 / 6.00 / 5.98) |
| cost per landed slash | **53 ± 2 px = 19.7 % ± 0.7 %** (≈20 %) | 7 events |
| end of slash run | **zeroes whatever remains** | 5 events |
| net | regen 16.67 %/s; a hit costs ≈1.2 s of regen | derived |

**What does NOT move it:** taking damage does not interrupt the charge (HP 11→10
mid-cycle, line unbroken). Landing hits do not step it up.

**It is not an idle-regen meter** — it read 0 on **96.7 %** of sampled frames
across B t=940–1440. It is tied to an explicit player action, **INFERRED to be
holding the slash input**: frames show the player standing dead still with no
drawn line for the first ~1.1 s of a cycle, then the red draw-line appears and
lengthens as Focus keeps climbing, then the lunge resolves and the bar drops.

✅ **My own independent measurement agrees**: 45.5 px/s ⇒ ≈5.9 s (f-5/f-6 above),
against the agent's 45.0 ⇒ 6.00 s. Two methods, two windows, same number.

### f-10 — CRIT: **NOT FOUND**. Do not adopt 1.3× *or* 3× as measured

Across **~845 s** of sampled play the Focus bar **never once reached full**
(max 67.7 % at B t=837.683), so the Critical Evade proc was never observed.
There is **no "CRITICAL" popup, no gold or oversized popup, and no crit-vs-normal
popup pair** anywhere in the windows examined.

The 36/27 = 1.333 ratio from e-4 *does* match the forum-derived 1.3 — but 30 sits
between them, the spawn geometry is pixel-identical across all three, and there is
no visual tell. That is a **damage roll, not a crit tier**. ⇒ `CRIT_MULT` stays
**1.3 INFERRED**; this footage cannot source it either way.

The only numeric damage multiplier the OG actually surfaces on screen is the
timed global buff "150% DAMAGE 23:45" (c-6).

### f-11 — Chi is a SKILL resource only, and AP is not on the HUD

Blue bar = **CHI**, proven by exact numeric identity (HUD 20/20 + 26/26 at
B t=708 vs the character sheet's HP 20/20, CHI 26/26, AP 30/30 at t=710).
**AP is a real third stat but never appears on the battle HUD.**

**Chi never moved in any sampled fight** (31/31 and 47/47 throughout) — it is
spent only by skills. Transcribed costs: **Slash Wave CHI COST 10**, **Dash Left
CHI COST 2**. A full verbatim skill-tree transcription (6 categories, with
damage / chi-cost / cooldown / level-required for Slash Wave, Throw Kunai, Dash
Left, Roll, Critical Evade) is in `session11-raw/crit-focus.txt`.

### f-12 — Out of combat there is no Focus row at all

Out of combat the third strip is **absent** and shows the stance name instead;
in combat its empty state renders "CANNOT CHANGE STANCE" over the brown track.

## (g) AUTO SLASH

| # | Fact | Value | Evidence | Tag |
|---|---|---|---|---|
| g-0 | AUTO SLASH is a toggle button at the TOP-LEFT of the battle screen; ON = character auto-fights with basic movement and slashes, incl. auto-launches/executes once unlocked; NO hotkey; no sub-toggle to disable auto-launches; heavy+autoslash was the story-grind meta (9 threads) | toggle + auto-fight behavior | KONGREGATE_FORUM_FINDINGS (combat-core + ui-hud) | FORUM |
| g-1 | Auto-slash tracks jumping oni/undead poorly; consensus OFF vs Tengu / PvP / Statue Guardian | behavior quality notes | KONGREGATE_FORUM_FINDINGS | FORUM |

| **g-2** | **DEVELOPER TEXT settles what AUTO SLASH does:** "TRY TURNING AUTOSLASH ON. **YOUR BODY WILL MOVE WITH MUSCLE MEMORY WHILE YOU CAN FOCUS ON ACTIVATING YOUR SKILLS.**" → ON = the game drives BOTH movement AND basic slashes; the player is left to fire skills. Matches the forum's "auto-fights with basic movement and slashes" exactly. | auto-move + auto-slash; player retains skills | A **t=470.0**, `session11/lead/t470.0_autoslash-tip.png` | **DEV-TEXT** |
| g-3 | The plate is a top-left brown parchment box reading "AUTO SLASH OFF"; it reads OFF in every combat frame inspected so far in video A | OFF throughout | A t=114.0, t=119.75 | MEASURED |

<!-- workflow rows g-4+ merge here -->

## Contradictions / open

1. ~~**Where is the Focus meter?**~~ **CLOSED by f-4/f-7.** The OG duel HUD has
   three stacked elements — green HP, blue Chi, and a white **Focus** bar — and
   that third strip doubles as the stance-message slot. The level-1 HUD (H-4)
   looked like "only two bars" purely because the "CANNOT CHANGE STANCE" message
   was occupying the third strip in every frame sampled. Our HP + Chi + Focus-strip
   layout is correct. **Build step 5 is confirmed as the right change**: the OG
   shows exactly ONE meter in that slot, and the forum has it doing BOTH jobs
   (gate crits + pay stance switches), whereas our Sim carries TWO separate
   meters (`Focus` + `Critical`). Fold them, and re-rate the fill to f-6.

2. **Movement gesture (b) is still UNSETTLED.** "In-game Tip #27 = hold-mouse-to-run"
   is asserted in `REBUILD_READINESS.md` §3 **without a verbatim quote or a primary
   source**, and a full-text search of the 128-thread forum corpus finds **no**
   thread describing the movement control at all. The mouse pointer is **not
   rendered** in either recording, so cursor tracking is impossible; only the
   hover-tooltip trick pins the cursor, and then only occasionally. Treat hold-run
   as the *working default the build already implements*, not as a measured fact,
   until the (b) agent reports.

3. **`DASH_SLASH_PX = 127` (Session 9) vs d-2's multi-tick run.** Session 9
   measured a **1-frame ~238 px @1080 snap** on **video B** (level-8 duel,
   strike-C, 3 dashes). Session 11 measured a **6–11 tick accelerating run**
   (largest single tick 133 px) on **video A** (level-1 overworld mob fight), and
   showed the 15 Hz floor does not explain the difference. Both readings stand;
   neither is discarded. Plausible reconciliations, none yet tested: duels vs
   overworld differ; level 8 vs level 1 differ; or one of the two trackers
   (nameplate centroid vs hat displacement) is biased. **`DASH_SLASH_PX` is left
   UNCHANGED.** Resolving it needs a same-method re-measure on video B.

4. **Is strand ① of the crux falsification contaminated?** `crux-first-combat`
   read enemy M2's bar draining monotonically (121→93→75→67→57→29→21→gone) as
   damage beginning the tick the line appeared. But `damage-ttk` established that
   **ordinary mobs never show a partial bar** (e-2), and that **foreground bamboo
   is drawn in front of enemy HP bars and splits them**, making a full bar read as
   25–70 %. A mob walking behind a bamboo trunk would produce exactly that
   monotone "drain". `crux-first-combat` was aware of the trunk and cross-checked
   fragment widths summing to 130, but the two findings still collide.
   **Consequence: treat strand ① as UNSAFE.** The crux verdict does not depend on
   it — strands ② (body ran through an enemy, zero damage) and ③ (line coverage)
   are independent, and `crux-dungeon` reached the same verdict on separate
   footage. Recorded so no one later cites strand ① as settled.

5. **`SLASH_FRAMES` 12/16/20 (Session 8B) vs c-5's cadence.** The new pass found
   0.133 s minimum strike-to-strike in **both** Light and Heavy, with Heavy's mode
   *shorter* than Light's — the opposite ordering. The agent flagged its own row
   unusable (human draw speed dominates; both fighters draw in duels). Not a
   refutation, but `SLASH_FRAMES` is no longer corroborated. Left unchanged.

6. **Balanced reach 200 vs measured 131.** Unresolvable from existing footage:
   the only Balanced combat anywhere is the level-1 tutorial fight, while Light
   and Heavy were measured at level 8. "Wiki value wrong" and "level-1 mastery"
   are not separable. Both readings kept (c-2).

---

## Measurement traps — read before automating anything on this footage

Four ways this corpus lies to a naive detector. Every one of them was hit by an
agent this session and corrected only by looking at the pixels.

1. **Foreground bamboo occludes enemy HP bars** and splits them into fragments;
   a naive green-run measurement reads a full bar as 25–70 % and **invents damage
   that never happened**. Verify by checking fragment widths sum to ~130 px.
2. **"CANNOT CHANGE STANCE" reads as a ~74 %-full Focus bar** to a white-pixel
   mask, because the caps text sits on the same track. Always measure the
   contiguous run **from the track's left edge**, then confirm by eye.
3. **Naive ground-band frame-differencing under-reports camera scroll by ~3×**
   because the character's white body dominates the match. Track a discrete
   world-fixed feature (a signpost) instead. Background layers parallax at
   0.45–0.68× and are **not** valid anchors.
4. **The 15 Hz content floor** (§00) — 60 fps extraction is 4× wasted work, and
   any sub-67 ms claim is unresolvable.

Plus one positive technique worth reusing:

5. **The tooltip is a cursor readout.** Interaction tooltips render *at the mouse
   cursor*, not on the object they name (b-1). Whenever one is lit you can read
   the mouse position to ±150 px — the only way to see the mouse in a recording
   that never draws it.
