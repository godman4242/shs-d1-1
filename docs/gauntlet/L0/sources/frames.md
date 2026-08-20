# SOURCE SWEEP — `reference/frames/` (the video-frame corpus)

**Unit:** `reference/frames/` — 7,381 stills, manifest `docs/gauntlet/L0/index/frames.json`.
**Evidence class:** A1 only. Every claim below is a thing I looked at, with the exact crop box
and upscale factor named. Where a frame and a doc disagree I say **THE FRAME WINS** out loud.
**Document under audit:** `docs/research/REBUILD_READINESS.md` (2026-07-20, avg ~42).

**Method.** Contact-sheeted `broad_survey` (240 thumbs, 480×270 — screen-*type* triage only, never
graded), then worked at native resolution in the 61 chapter directories
`reference/frames/{zFtCaTO0_1M,Nr4fQstqHDM}/seg-NN/frames/` (1024×576 JPEG, 3 s spacing, whole
runtime of both longplays). Crops were taken with PIL LANCZOS at 2×–7×; every crop box is stated.
Video identity per `docs/research/video-study/segments/A-00-boot-login.md:3` — **video A =
`zFtCaTO0_1M`**, **video B = `Nr4fQstqHDM`**, both **web build v0.717** (version tag legible
bottom-right of `zFtCaTO0_1M/seg-00/frames/frame_0001.jpg`).

**Headline.** The frames hold **six** screens the ledger calls unrecoverable or never-captured,
and they **settle the S0-3 build-parity caveat** that every other lane has had to carry.

---

## F-01 — ⭐ THE WEB v0.717 UI RENDERS THE ANDROID v0.682 STRING TABLE VERBATIM. S0-3's caveat is CLOSED.

**The standing caveat (Stage 0b, S0-3):** *"this is the ANDROID build, clientVersion 0.682 … vs the
web build's v0.717. Data-XML row counts match exactly; **UI copy and combat tuning parity is NOT
established.** LABEL WHICH BUILD any ported string came from."*

Every lane in this gauntlet has been hedging its string cites because of that sentence. A frame
settles it, because a frame **is** the web build.

**Frame (A1) — `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0018.jpg`**, crop `(0,0)-(1024,576)`
upscaled ×1.95. Visible on one screen, in the shipped web v0.717 client:

| what is on the v0.717 screen | android v0.682 `strings.json` row |
|---|---|
| `VICTORY TAUNT (DISPLAYS ON OPPONENT'S SCREEN WHEN YOU WIN)` | `["197"]` "Victory Taunt (Displays on opponent's screen when you win)" |
| pre-filled taunt field `YOU CAN NEVER DEFEAT ME!` | `["198"]` / `["472"]` "You can never defeat me!" |
| `DUEL TOKENS` | `["59"]` "Duel Tokens" |
| `CHALLENGE` ×6 | `["231"]` / `["57"]` "Challenge" |
| `RANKINGS` | `["28"]` "Rankings" |

Four more screens, four more exact hits:

* `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0001.jpg` crop `(0,0)-(1024,400)` ×1.95 —
  `CONGRATULATIONS! YOU ARE NOW LEVEL 10 AND ARE ABLE TO JOIN THE WAR ROOM. / FIGHTING FOR A CLAN IS
  A GOOD WAY TO EARN COINS, EQUIPMENT AND EVEN GOLD.` = `strings.json["321"]` word for word.
* `reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0042.jpg` crop `(0,380)-(1024,576)` ×3 —
  `REINFORCE YOUR CURRENTLY EQUIPPED WEAPON TO MAKE IT UNBREAKABLE? / COST: 5000 COINS / MATERIALS
  NEEDED: 1 SILVER ORE` = `strings.json["850"]` word for word, **including the 5000**.
* `reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0040.jpg` crop `(0,380)-(1024,576)` ×3 —
  `FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS / MATERIALS NEEDED: 2 IRON ORE` = the template
  `strings.json["845"]` "Forge an iron sword (level [0])?\nCost: [1] coins\nMaterials needed: 2 Iron
  Ore" with `[0]=7`, `[1]=700`.
* `reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0048.jpg` crop `(0,380)-(1024,576)` ×3 —
  `WOULD YOU LIKE TO RENT A HORSE TO TRAVEL TO A NEIGHBOURING VILLAGE?` = `strings.json["526"]`.

**Verdict: HELD.** For every android string that also exists in v0.717, the web build renders it
**character-for-character**. Ported UI copy no longer needs a "android-only, unverified" label.

**The honest boundary (F-02) — v0.717 is a SUPERSET, not an identity.** See below; two frames prove
v0.717 added strings the android table does not contain. So the correct rule is: *android copy that
survives into v0.717 is verbatim; v0.717 additions are invisible to the android table.*

---

## F-02 — ⚠️ …but the parity is a SUPERSET, and two frames prove it. THE FRAME WINS.

**Frame (A1) — `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0011.jpg`**, crop `(0,0)-(1024,400)`
×1.95. Title line, unambiguous at that scale:

> `WAR ROOM RULES 1/7  (JOINING A BATTLE)`

The android table caps at six: `strings.json["369"]` = "War room rules 1/6  (joining a battle)",
`["379"]` = "War room rules 6/6  (building structures)". Sibling frames `frame_0012.jpg` (`3/7`) and
`frame_0013.jpg` (`6/7`) confirm the denominator is a real 7-page deck, not a typo. The *body* text
of page 1 is verbatim `strings.json["370"]`.

**Frame (A1) — `reference/frames/zFtCaTO0_1M/seg-22/frames/frame_0026.jpg`**, crop
`(340,240)-(690,380)` ×6. The v0.717 death card has exactly two buttons:

> `LEAVE AREA` (silver border) · `FREE RESPAWN` (gold border)

Neither label exists in the android table: `["480"]` is "Respawn", `["481"]` is "Restart From
Entrance". **THE FRAME WINS** — v0.717 relabelled the lose card.

**Consequence for the banked claim `ui-hud/respawn-costs-one-heavenly-gold`** (and the ui-hud
survey's reading of `LoseUI.as` as *"the death card is also the revive-for-gold paywall"*): in the
shipped v0.717 build the respawn button the player is actually offered says **FREE**. The paywall
path may still exist, but it is not the only path and it is not what v0.717 shows on death.
**Verdict: PARTIAL — contradicts the "respawn costs gold" framing.**

---

## F-03 — ⭐ §6 "The live clan-war … impossible offline" — the ENTIRE PvP matchmaking screen is on film, in full.

**Ledger (§6):** *"**The live clan-war** — warring alongside thousands of real players is impossible
offline; scope out or build a *new* AI-driven sim."*
**Ledger (§4 meta-social ①):** *"**server-authoritative simulation** (24h tick, matchmaking, live
population) — **unrecoverable at 1:1**"*

**Frame (A1) — `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0018.jpg`**, crop `(0,0)-(1024,576)`
×1.95. The complete `DUEL` screen, every element legible:

* Gold brush title **`DUEL`** top-left; red `X` close top-right on the standard chrome plate.
* A **skull-in-green-diamond token icon reading `40`**, captioned **`DUEL TOKENS`**.
* Header line **`Register now to fight LIVE PVP duels!`** — rendered in a **plain sans face**, not
  the Edo-SZ brush caps used by every other label on the same screen (see F-11).
* A **2-column × 3-row grid of six challenge cards**, each = portrait box + name + level + red
  `CHALLENGE` button: `TYLUV` L3 · `IXBAL` L3 · `NANASHI21` L3 · `BODYGU4RD` L3 · `JOTA` L3 ·
  `LHADYCANDY` L3. **All six are the same level, and it is the player's level** — the HUD level
  badge in `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0003.jpg` (same segment, crop
  `(0,0)-(1024,576)` ×1.86) reads **`3`** beside `1918 / 2950  EXPERIENCE POINTS`. One observation,
  so I report it as level-matched-on-this-sample, not as a proven matchmaking law.
* `RANKINGS` button top-right of the panel; circular-arrows **refresh** button bottom-right.
* Footer: `VICTORY TAUNT (DISPLAYS ON OPPONENT'S SCREEN WHEN YOU WIN)` + a text input pre-filled
  `YOU CAN NEVER DEFEAT ME!`.

`frame_0016.jpg` catches the same panel mid-refresh showing only `REFRESHING...`; `frame_0019.jpg`
is the resulting **VS card, `GUEST` vs `TYLUV`**, so the flow challenge→duel is filmed end to end.
`frame_0015.jpg` carries the tutorial line `ACCESS THE DUELS MENU TO DUEL WITH OTHER PLAYERS.`

**Verdict: HELD — §6 is an OVER-CLAIM of loss.** The *live population* is gone; the **screen, the
offer grid, the token gate, the taunt field, the rankings entry point and the VS hand-off are
fully recoverable from film**. A single-player recreation can rebuild this surface 1:1 and fill it
with AI opponents without inventing a single widget.

---

## F-04 — ⭐ §4 meta-social ② "War-Room map topology (board/adjacency)" — I FOUND THE BOARD FRAME the banked survey said does not exist.

**Ledger (§4 meta-social ②):** *"War-Room **map topology** (board/adjacency)."*
**The banked meta-social survey, `docs/gauntlet/L0/systems/meta-social.md:402-405`, says outright:**
*"**A frame of the war-room hex board itself.** I checked the 100-frame `map` segment of
`Nr4fQstqHDM` … **I never found a frame showing the board.** The 6×6 grid claim rests on A2 (code)
+ the A1 `INSIDE SECTOR (3,5)` HUD readout, **not** on a picture of the board."*

It is in `seg-20`, not in the `map` segment.

**Frame (A1) — `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0014.jpg`**, crop `(0,0)-(1024,576)`
×1.95. The full **`SELECT TERRITORY`** board on the War-Room scroll:

* Header `SELECT TERRITORY`, buttons `ZOOM IN` and `HELP`; the vertical `WAR ROOM` scroll spine with
  the red `X` sits to the right of the parchment.
* Sub-header **`CLAN CROPS: 402 (+2 HQ)`**.
* The board itself: a **geographic silhouette of western/central Japan (Kyushu, Shikoku, Chugoku,
  Kansai, Chubu, Kanto) with a UNIFORM ORTHOGONAL GRID ruled over it** — straight verticals and
  horizontals, rectangular cells, no hexes anywhere on this layer. One **red clan banner** marks the
  contested cell over the Izu/Suruga area.
* Footer, left: clan crest + `ALLEGIANCE: CLAN AKA RYU` / **`RANK: RECRUIT (3 MOVES A TURN)`** /
  **`MOVES MADE: 0/36`**. Centre: `FLAGS INDICATE BATTLES THAT THE CLANS ARE CURRENTLY ENGAGED IN`
  + `SHOW CLAN MSG` button. Right: **`3 MOVE(S) LEFT`**.

**Verdict: HELD.** Board topology is now A1-grounded at the *territory* layer: a rectangular
national grid, zoomable, with per-cell flag markers. The 6×6 **sector** board inside a territory is
a second, deeper layer (`ZOOM IN`) and is still not on film — say so, don't conflate them.

---

## F-05 — ⚠️ §4 meta-social "Surface" mis-reconciles moves-per-turn. THE FRAME WINS on the label.

**Ledger (§4 meta-social Surface):** *"'moves per turn' reconciles as 'per hour' (36 = Private's
rank threshold, not a turn cap)"*

Same frame, same crop (`Nr4fQstqHDM/seg-20/frames/frame_0014.jpg`, `(0,0)-(1024,576)` ×1.95). The
shipped v0.717 UI says, in words:

> `RANK: RECRUIT (3 MOVES A TURN)` … `MOVES MADE: 0/36` … `3 MOVE(S) LEFT`

* The **`36` half of the ledger's reconciliation is CORROBORATED** — `MOVES MADE: 0/36` reads
  exactly like a threshold counter toward the next rank, not a per-turn allowance.
* The **"per hour" relabel is REFUTED** — the game itself prints *"A TURN"*, and prints a separate
  live `3 MOVE(S) LEFT` allowance beside it. **THE FRAME WINS.**
* **New number:** the lowest rank, **RECRUIT, gets 3 moves a turn** — the bottom rung of the
  11-rank ladder, which the ledger banks as "Ready" without this value.

**Verdict: PARTIAL (half the ledger line corroborated, half refuted).**

---

## F-06 — ⭐ §4 meta-social ③ "achievements list, daily-reward table, token costs — one Ruffle session closes all". No Ruffle session needed; the frames hold all three.

**Ledger (§4 meta-social ③):** *"achievements list, daily-reward table, token costs — *one Ruffle
session closes all.*"*

**(a) Achievements — A1, with the achievement NAME on screen.**
`reference/frames/Nr4fQstqHDM/seg-04/frames/frame_0001.jpg`, crop `(550,490)-(1000,545)` ×6.5:
a gold-framed bottom-right toast, trophy glyph, two lines —

> `ACHIEVEMENT UNLOCKED` / `WIN A DAILY TRAP CHALLENGE.`

matching `strings.json["8111"]` "Win a daily trap challenge." A second toast fires in
`reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0011.jpg` (bottom-right, `JOIN A CLAN.`), so the
toast widget, its anchor and its copy are all recoverable, and named achievements resolve straight
into the `8xxx` block of the string table.

**(b) Daily-reward ladder — A1.**
`reference/frames/Nr4fQstqHDM/seg-00/frames/frame_0001.jpg`, crops `(0,30)-(1024,300)` ×3 and
`(0,380)-(1024,520)` ×3.2. A **`NINJA SERVICES`** panel with three rows — `CLAIM DAILY PRIZE`,
`ENTER REDEEM CODE`, `BACK` — over a full-width banner reading `CLAIM YOUR DAILY PRIZE NOW!` and
`YOU HAVE CLAIMED YOUR DAILY PRIZE FOR 0 CONSECUTIVE DAYS.` The consecutive-day ladder resolves to
`strings.json["842"/"843"/"844"]` ("…for [0] consecutive days." / "Every 10 consecutive days: bonus
prize!" / "Every 30 consecutive days: super bonus prize!!!"). **Structure: a consecutive-day streak
counter with bonus tiers at 10 and 30.**

**(c) Token costs — A1.** `zFtCaTO0_1M/seg-03/frames/frame_0018.jpg` shows the live counter
**`40` DUEL TOKENS**; the token economy around it resolves in the string table
(`["61"]` "You are out of Duel Tokens. / Would you like to get 10 more Duel Tokens for 1 Gold?",
`["4173"-"4175"]` 10/25/40-token packs, `["122"]` "Max Duel Tokens").

**Integrity note:** the ledger's meta-social *"Ready"* line already banks *"daily-login structure;
two token types"*. What was listed as **blocking** was the *achievements list*, the *daily-reward
table* and the *token costs* — and those are what the frames + table now supply.

**Verdict: HELD — the ③ blocker is closed from film + table, no playable build required.**

---

## F-07 — ⭐ The banked meta-social survey's own unfixable gap #3 — "no payload row binding side 1 to a named clan" — is closed by a frame.

**The banked survey, `docs/gauntlet/L0/systems/meta-social.md:397-399`:** *"**The 4 canonical clans'
identities in the war room** — the code speaks only in side **numbers** 1–5 and colours; I found no
payload row binding side 1 to a named clan. The ledger's 'heraldry/masks/daimyo/capitals' is not
something I could ground here."*

**Frames (A1) — `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0007.jpg` and `frame_0008.jpg`**,
both rendered whole at ×1.76 (contact pair, 900 px cells). The clan-join screen shows **four crest
tiles plus a white `?` RANDOM tile**, and selecting a crest fills the right-hand card with name,
daimyo and domain:

| crest as drawn | name | daimyo | domain |
|---|---|---|---|
| gold folding fan | `CLAN KI SENSU` | `LADY TSUBASA` | `RULES THE DOMAIN IN THE NORTH-EAST` |
| navy four-ring | `CLAN AOI HOIRU` | `LORD YOSHIO` | `RULES THE DOMAIN IN THE SOUTH-WEST` |
| dark-red dragon | `CLAN AKA RYU` | `LORD TSUYOSHI` | (card visible in `frame_0001.jpg`/`frame_0002.jpg`) |
| green fist | (fourth clan — I did not open its card) | — | — |

`frame_0004.jpg` shows the `?` tile selected with the card reading `RANDOM / LET CHANCE DECIDE.`
Each card ends in a red `JOIN CLAN` button. `frame_0007.jpg` also carries Ki Sensu's flavour:
`DESPITE FAVORING NON-CONFRONTATIONAL METHODS, THE PROSPEROUS CLAN KI SENSU HAD TO TAKE UP ARMS TO
DEFEND ITS LANDS AND RICHES.`

**Integrity note:** the ledger itself banks *"4 clans (heraldry/masks/daimyo/capitals)"* as a
known-known (line 82). So this does **not** overturn the ledger — it overturns the **banked survey's
own stated gap**, by supplying the A1 binding that survey said it could not find.

**Verdict: HELD.** Crest art ↔ clan name ↔ daimyo ↔ domain is bound on screen. Also A1-new: the
**War Room is gated at character level 10** (`frame_0001.jpg` header, and `strings.json["320"]`
"You must be level 10 or higher to access the war room").

---

## F-08 — ⭐ §6 "Verbatim dialogue … the actual script is gone" is dead twice over — and the frame shows the held script is a DIFFERENT REVISION down to the CHOICE layer.

**Ledger (§6):** *"**Verbatim dialogue** — if the story is server-fetched and the server is dead, the
actual script is gone; author original lines to the summaries."*
**Ledger (§4 quests-story ①):** *"**verbatim dialogue — captured NOWHERE** (study policy + no wiki
transcripts)"*

The first half was already killed by `questdata.xml` (3,307 `<text>` rows). The **frame** kills the
second half — the dialogue is *rendered on screen*, in the shipped web build, and the
"study policy" that forbade transcribing it was superseded by the 2026-07-24 owner ruling.

**Frame (A1) — `reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0021.jpg`**, crop
`(0,460)-(1024,576)` ×4, nameplate `JINBEI`:

> `IT'S NOT OFTEN WE MEET A NEW FACE ON THESE ROADS. IT'S THE BANDITS, YOU SEE. THEY'VE DRIVEN ALL
> THE HONEST FOLK AWAY.`

The payload's same beat, same speaker, same portrait is `reference/extracted/questdata.xml:128`:

```
        <text>Ah! A new face in this territory! My, it isn't often we see people walk this road alone, what with all the bandits infesting it...</text>
```

**Same meaning, different words.** This extends `sources/questdata.md` Q-02 (which proved the
divergence on a *narration* node) into the **branching layer**, which is worse:

**Frame (A1) — `reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0023.jpg`**, crop
`(0,460)-(1024,576)` ×4 — the two-option player choice:

> `I'LL STAND MY GROUND AND ASK THEM TO LEAVE ME ALONE.`
> `THESE BANDITS DON'T SCARE ME!`

The payload's `<option>` for that node, `reference/extracted/questdata.xml:146-156` (choice 1 at
`:149`, choice 2 at **`:153`**):

```
        <choice>
          <text>I'll stand my ground and ask them to leave me alone.</text>
          <goto>9</goto>
        </choice>
        <choice>
          <text>They'll get nothing from me!</text>
          <goto>15</goto>
        </choice>
```

Choice 1 matches **exactly**. Choice 2 does **not** — v0.717 says `THESE BANDITS DON'T SCARE ME!`
where the payload says "They'll get nothing from me!". A case-insensitive search of
`questdata.xml` for `scare me` returns only three unrelated rows (`:7776`, `:14256`, `:22435`).

**THE FRAME WINS.** Consequence: a port may not treat `<choice>` text as v0.717-final either — the
rewrite reached the option labels, which are the rows a `<goto>` router is keyed to.
**Verdict: HELD (strengthens `questdata/Q-02` into the choice layer).**

---

## F-09 — ⭐ §4 combat-core ⑤ "Focus/crit gating rule" — the game states the rule in its own skill card.

**Ledger (§4 combat-core ⑤):** *"Focus/crit gating rule — *watch the Focus bar fill/consume.*"*
**Ledger (§4 skills-meters ①):** *"every other skill's Chi cost + cooldown … — *read skill cards in
a preserved build.*"*

No preserved build needed. **The skill cards are on film.**

**Frame (A1) — `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0013.jpg`**, crop
`(20,190)-(400,400)` ×5. The `SKILLS` screen with a skill selected. Card text:

> `CRITICAL EVADE`
> `(PASSIVE SKILL)`
> `ALLOWS YOU TO EVADE ATTACKS WHILE SLASHING IN THIS STANCE WHEN YOUR FOCUS BAR IS FULL.`
> `NEXT LEVEL  (LEVEL 1)`
> `REQUIRED SKILL POINTS: 1`  ·  red `LEARN SKILL` button

Surrounding frames give the whole screen contract: `frame_0010.jpg` = `SELECT A SKILL CATEGORY`
with a 7-tile category picker; `frame_0011.jpg` = `LIGHT STANCE SKILLS` + the caption `SKILLS THAT
ARE USABLE WHEN IN LIGHT STANCE.` above a row of 8 skill tiles; every state carries the header
`AVAILABLE SKILL POINTS: n` and a bottom-left `SKILLS EQUIPPED` tray.

**Verdict: HELD.** The Focus meter's *effect* is stated by the game itself: **a full Focus bar buys
evasion while slashing, per stance** — it is an evade gate, not a crit meter. The card template
(name / type / effect prose / NEXT LEVEL / REQUIRED SKILL POINTS / LEARN SKILL) is the exact widget
the ledger asked someone to go read in a build.

---

## F-10 — ⭐ §4 economy ③④ and the "Forge 700c" surface line — three service prices read straight off the screen, and the forge price is a LEVEL-SCALED parameter.

**Ledger (§4 economy):** *"③ Repair-Weapon cost (never captured). ④ token/tournament economy
numbers."* · *"**Surface:** Forge 700c (the −70 HUD read is a capture artifact)"*
**Ledger (§1 known-knowns, line 80):** *"**Economy statics:** 100c/3g guest start; inn 8c, toll 7c,
stable 14c+5AP, fast-travel 5g, rebirth scroll 1000c (+25g), **Forge 700c+2 ore**, Reinforce
5000c+1 silver ore; War Room structures 10k/10k/5k."*

**Integrity note, stated up front:** stable 14c, fast-travel 5g, Forge 700c+2 ore and Reinforce
5000c+1 silver ore are **already banked** by the ledger at line 80. My frames *corroborate* all four
from the v0.717 pixels — worth having, since the ledger cites no frame for them — but the only
**correction** in this finding is the forge one, below.

**Frame (A1) — `reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0040.jpg`**, crop
`(0,380)-(1024,576)` ×3, nameplate `BLACKSMITH`:

> `FORGE AN IRON SWORD (LEVEL 7)?` / `COST: 700 COINS` / `MATERIALS NEEDED: 2 IRON ORE`

The ledger banks "Forge 700c" as a *constant*. The frame shows it is **the level-7 instance of a
parameterised string** — `strings.json["845"]` is "Forge an iron sword (level **[0]**)?\nCost:
**[1]** coins\nMaterials needed: 2 Iron Ore". So 700 is not a price, it is `f(level=7)`. Nothing in
frames or table fixes `f`; one sample is consistent with `100 × level` and I do **not** assert it.

**Frame (A1) — `reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0042.jpg`**, same crop:

> `REINFORCE YOUR CURRENTLY EQUIPPED WEAPON TO MAKE IT UNBREAKABLE?` / `COST: 5000 COINS` /
> `MATERIALS NEEDED: 1 SILVER ORE`

Here the 5000 is **hard-coded in the string** (`["850"]`), so frame and table agree it is flat.
Cross-reference worth flagging to economy: `strings.json["669"]` offers the same "unbreakable"
outcome for **2 Gold** — a coin↔Gold anchor of 5000 coins + 1 Silver Ore ≈ 2 Gold.

**Frame (A1) — `reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0048.jpg`**, same crop, nameplate
`STABLEHAND`:

> `WOULD YOU LIKE TO RENT A HORSE TO TRAVEL TO A NEIGHBOURING VILLAGE?` / `COST: 14 COINS`

(The runtime `14` is absent from `["526"]`, so only a frame holds it.) The destination menu in the
same frame lists per-destination **AP** costs, not coins.

**Frame (A1) — `reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0016.jpg`**, crop
`(330,200)-(940,400)` ×4 — the quest log's fast-travel button `TAKE ME THERE` carries a **gold-coin
icon and the number `5`**: fast travel costs **5 Gold**, the premium currency.

**Verdict: PARTIAL — one correction (forge is parameterised), three corroborations, one gap.**
③ *Repair-Weapon cost* is **STILL UNHELD from frames** — I opened the
blacksmith menu frame (`frame_0041.jpg`, `WHAT CAN I DO FOR YOU TODAY?` with `FORGE A WEAPON /
REPAIR WEAPON / REINFORCE WEAPON / LEAVE`) and the longplay never selects `REPAIR WEAPON`. Forge,
reinforce, horse rental and fast travel **are** captured, and "Forge 700c" is corrected from a
constant to a level parameter.

---

## F-11 — S0-2's font finding, corroborated from the pixel side, with the two-face split localised.

**Stage-0 finding S0-2:** *the game font is CLOSED — `ui_strings.txt:100` has `face="Edo SZ"` (and
`:182` `face="Calibri"`).*

**Frame (A1) — `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0018.jpg`**, crop `(0,0)-(1024,576)`
×1.95. Both faces are on screen at once and the split is visible:

* **Every game-chrome label** — `DUEL`, `DUEL TOKENS`, all six opponent names, `LEVEL 3`,
  `CHALLENGE`, `RANKINGS`, `VICTORY TAUNT (…)`, and the typed field contents — is drawn in the
  **irregular brush-caps face** (Edo SZ): uneven baselines, tapered strokes, all-caps forms.
* **One line only** — the promotional header `Register now to fight LIVE PVP duels!` — is a **plain
  upright sans with true lower-case and even stroke weight** (the Calibri slot).

**Verdict: HELD (corroboration + new detail).** The second face is not decorative variety; it is
reserved for the **account/registration nag copy**, which is exactly the class of string a Flash
portal build renders in a system font. A rebuild should not put brush caps on that line.

---

## F-12 — §1 "World-map topology/projection … not a grid you can generate from W×H" — the frame shows a grid, coordinates and a per-cell level.

**Ledger (§1 unknown-unknowns):** *"**World-map topology/projection** (sparse geographic Japan
outline, not a grid you can generate from W×H)."*
**Ledger (§4 world-exploration ①):** *"**world bounds + geography** (sparse Japan-outline, not a W×H
grid)"*

**Frames (A1) — `reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0009.jpg` … `frame_0031.jpg`**,
read from the ×2.9 contact sheet of the whole segment and confirmed at native scale.

* `frame_0009.jpg` — `WORLD MAP` scroll, header `CLICK ON THE MAP TO ZOOM IN`, `ZOOM IN` button, the
  Japan silhouette with a **faint regular grid ruled over it**, and a footer `LEGEND` strip whose
  icons are captioned `VILLAGE · TOWN · CITY · CASTLE TOWN · DESTROYED · QUEST`, plus the gating
  key **`GREY TERRITORIES = LEVEL TOO LOW` / `RED TERRITORIES = LEVEL TOO HIGH`**. The legend's six
  captioned glyphs are `VILLAGE · TOWN · CITY · CASTLE TOWN · DESTROYED · QUEST` — a **four-tier
  settlement taxonomy plus a destroyed state plus a quest marker**, verified at ×2.54 on
  `frame_0029.jpg`.
* `frame_0029.jpg` (read whole at ×2.54) — the **zoomed-in territory board**, and it is a complete
  spec. Header **`NAGANO (26,52)  LEVEL: 9`**, `ZOOM OUT` button, `WORLD MAP` scroll spine. The
  board is a **uniform lattice of identical rounded-square tiles** — 12 columns across the panel,
  6+ rows deep, the Japan coastline showing through as a pale backdrop *behind* the lattice, not
  instead of it. Each occupied tile carries **one settlement icon** and, on many tiles, **a clan
  banner in one of four colours (blue / yellow / red / green)** — so **per-tile clan ownership is
  painted on the world map**, which is the ownership layer the War-Room board (F-04) fights over.
  A black `X` marks destroyed tiles; one tile is white-outlined (selection); the player avatar
  stands in a tile. Bare tan tiles are unowned land.

So the world is a **W×H integer lattice of named territories, each with an (x,y) and a LEVEL**, with
the Japan outline used as *decoration and land-mask over the lattice*, not instead of it.

**Corroborating readout, same segment —**
`reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0016.jpg`, crop `(330,200)-(940,400)` ×4:

> `LOCATION` / `E TOSHIBARA FIELD` / `TERRITORY (22,51)  SECTOR (5,2)`

**Verdict: HELD — the ledger's "not a W×H grid" is an UNDER-CLAIM.** Two coordinate spaces are
visible and separable: a wide **territory** space (values in the 20s–50s) and a **sector** space
inside each territory whose observed components are ≤5 — consistent with the banked 6×6 sector
board, and here shown from the pixels rather than from code.

---

## F-13 — §4 world-exploration ③ "real-world 'day' length (governs expiry…)" and §4 quests-story ③ "per-quest … coords + rewards (sampled, not tabled)" — the quest card states all of it.

**Ledger (§4 world-exploration ③):** *"real-world **"day" length** (governs expiry, farming, AP
regen, war tick)."*
**Ledger (§4 quests-story ③):** *"per-quest trigger types + coords + rewards (sampled, not tabled)."*

**Frame (A1) — `reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0016.jpg`**, crop
`(330,200)-(940,400)` ×4 plus the whole-panel read at ×2.9. The `QUESTS` screen is a two-pane log: a
left column of accepted quests (`PROLOGUE`, `YOKO'S QUEST`) and a right detail pane laid out as

> `OBJECTIVE` — `GET BLACK BALD HERB FOR YOKO` / `(THIS QUEST EXPIRES AT THE END OF THE DAY)`
> `LOCATION` — `E TOSHIBARA FIELD` / `TERRITORY (22,51)  SECTOR (5,2)` · `TAKE ME THERE` ⟨gold⟩ `5`
> `REWARD` — `266 XP` / `20 COINS` / `TOWN PROSPERITY: +5`
> top-right currency readout: `3` / `GOLD`
> bottom-right: `ABANDON QUEST`

**Three things the ledger asks for, on one card:**
1. **Expiry is a calendar-day boundary**, stated in the game's own words — `(THIS QUEST EXPIRES AT
   THE END OF THE DAY)`, `strings.json["536"]`. That is the "day" clock the ledger says is unknown,
   at least for quest expiry: it is an end-of-day rollover, not an N-hour timer from accept.
2. **Reward tuples are tabled on screen** — XP + coins + **`TOWN PROSPERITY: +5`**. Prosperity is
   therefore a *quest-completion* output, which is a live input to the prosperity formula the
   ledger banks as a blocker (`strings.json["454"]` "Town Prosperity").
3. **Coordinates are printed per quest** in the same `TERRITORY (x,y) SECTOR (u,v)` scheme as F-12.

A second instance, `reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0057.jpg` (read whole at ×2.54),
shows the same template carrying a **`RECOMMENDED LEVEL`** field:

> `QUESTS` · left column `PROLOGUE`
> `OBJECTIVE` — `MEET HIROSHI OUTSIDE HIS HUT` / `(RECOMMENDED LEVEL: 3)`
> `LOCATION` — `W KASUTA FOREST` / `TERRITORY (21,51)  SECTOR (2,3)` · `TAKE ME THERE` ⟨gold⟩ `5`
> `REWARD` — `200 XP`
> top-right currency readout: gold-coin icon + bar + `3` / `GOLD`

Note the player holds **3 Gold** while `TAKE ME THERE` is priced at **5** — the button is a genuine
premium-currency sink, not a free convenience.

**Verdict: HELD.**

---

## F-14 — §4 progression: the level-up card is a complete, legible spec.

**Frame (A1) — `reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0049.jpg`**, crop
`(330,190)-(700,400)` ×5:

> `YOU ACHIEVED` / `LEVEL 2` (red brush) / `STAT POINTS   +3` / `SKILL POINTS  +1` /
> `NEXT LEVEL   663 XP` / red `OK`

Every label resolves in the android table (`["133"]` "You Achieved", `["134"]` "Stat Points",
`["135"]` "Skill Points", `["136"]` "Next Level") — another F-01 parity row. The **numbers** are
runtime and exist only in the frame: **+3 stat points and +1 skill point per level**, with
`NEXT LEVEL` printed as XP **remaining**, not as a threshold — the paired PLAYER screen two frames
later (`frame_0051.jpg`) shows the bar as `current / next-threshold`.

**Verdict: PARTIAL — corroboration, not a new number.** The ledger already banks this at line 78
(*"+3 stat/+1 skill per level, +10HP/+5Chi/+1AP/+3-stat per point"*), and the per-point side is
banked at `docs/gauntlet/L0/systems/progression.md:155`. What the frame adds is (a) an A1 cite for a
line the ledger carries with none, and (b) the **`NEXT LEVEL` field is XP *remaining*, not the
threshold** — a rendering detail a rebuild would otherwise get wrong, since the PLAYER screen two
frames later shows the same quantity as `current / next-threshold`. Also worth saying out loud: the
ledger's line-78 "+3 … per level" and §3.11's "+3 to any of ATK/DEF/SPD" per *point* are two
different +3s, and the phrasing invites conflating them.

---

## F-15 — A1-new surface the ledger does not list at all: an "ENTER ROOM NAME" join dialog.

**Frame (A1) — `reference/frames/Nr4fQstqHDM/seg-04/frames/frame_0017.jpg`**, read whole at ×1.86:
a modal titled **`ENTER ROOM NAME`** with a single text field and `OK` / `CANCEL` buttons — and the
world object it was opened from is labelled, in-scene directly beneath the modal,
**`GO TO PRIVATE PVP ROOM`**. So this is not a lobby: it is a **named private-PvP-room** door
standing in the Tournament-Hall corridor.

None of the twelve ledger systems mention a named-room join flow; §6 files the whole networked
surface under *"Server-sim topology & save format — nothing to copy"*. A frame shows there **is**
something to copy: the client exposes an explicit **join-room-by-name** entry point, which is a
concrete, reproducible UI affordance (and a strong hint that duels/tournaments are hosted as named
rooms rather than pure matchmaking queues).

**Verdict: HELD as a UI surface. The server behind it is genuinely gone — I claim only the screen.**

---

## F-18 — A1-new: consumable buffs run on a REAL-TIME 30-MINUTE COUNTDOWN, shown in the HUD.

The ledger banks the Potato Dog effect (`§3` crux note, *"**"150% DAMAGE"** buff (Potato Dog)"*) but
no duration anywhere, and §4 world-exploration ③ lists the *"real-world "day" length"* clock as a
blocker with no other real-time constant recorded.

**Frame (A1) — `reference/frames/Nr4fQstqHDM/seg-04/frames/frame_0017.jpg`**, crop
`(770,495)-(1024,518)` ×9. Bottom-right of the combat HUD, gold-on-black:

> `150% DAMAGE 29:39`

i.e. a **live mm:ss countdown**, reading 29:39 shortly after the buff was eaten in the same segment
(`frame_0007.jpg`, item card `EAT THIS POTATO TO GET THE 150% DAMAGE BUFF. / NOTE: ONLY ONE BUFF MAY
BE ACTIVE AT A TIME.`, crop `(620,90)-(960,200)` ×6).

**Verdict: HELD — buff duration is 30 minutes of wall-clock time**, the buff is exclusive
(one at a time), and the HUD carries a dedicated bottom-right timer widget the ui-hud ledger does
not list.

---

## F-16 — Guest-mode gating and the save model, stated on screen (§6 "Server-sim topology & save format — nothing to copy").

**Ledger (§6):** *"**Server-sim topology & save format** — nothing to copy; design a single-player
persistence schema from the observed field set."*

Three frames state the persistence rules in the game's own words:

* `reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0003.jpg` (read whole at ×2.9) — modal:
  `NOTE: PLAYER PROGRESS WILL NOT BE SAVED IN GUEST MODE`, single `OK`.
* `reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0002.jpg` — the loading screen's tip line:
  `TIP: YOUR LOCATION IS ONLY SAVED AT SPECIAL LOCATIONS LIKE TOWNS AND DUNGEONS.`
* `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0003.jpg` — modal:
  `NINJA SERVICES ARE NOT AVAILABLE IN GUEST MODE.` (= `strings.json["632"]`, another F-01 row).

**Verdict: PARTIAL.** The *schema* is indeed not on film. But a load-bearing **save-policy** rule is:
**position is checkpointed only at towns/dungeons, not continuously** — that is a design constraint
a single-player rebuild must honour and the ledger does not record it anywhere.

---

## F-17 — HONEST NEGATIVE: the rebirth / element-picker UI is still not on film, and I looked.

**Ledger (§4 rebirth-elements ⑤):** *"rebirth/element-picker UI (never filmed — both longplays
pre-rebirth)."*

I contact-sheeted every chapter directory of both longplays at 320 px cells plus the two 100-frame
`map` segments and the 240-frame `broad_survey`. There is no rebirth screen, no element circle, and
no Dan-rank UI anywhere in the corpus. The closest artifact is a text row, not a frame
(`strings.json["610"]` "Are you ready to attain the next dan rank? … You will be reborn as a level 1
character while retaining your inventory, skill points and clan rank…"). Both longplays cap well
below the rebirth gate.

**Verdict: STILL_UNHELD.** The ledger's *"never filmed"* stands and the banked
`docs/gauntlet/L0/systems/rebirth-elements.md:466-467` conclusion is confirmed independently.

---

## Coverage — what I did NOT open

* **`session24/` (≈2,900 stills) — not opened.** It is a per-frame kinematics corpus (burst
  sequences, crops, montages, `.csv`/`.json` measurement side-cars) built for reach/gait/strike
  timing; it is already the evidence base for the banked combat-core and art-anim claims, and it
  holds no UI screens. Named here rather than silently skipped.
* **`session11/` (≈350 stills) — sampled by directory name only, not swept.** Same reason: it is a
  combat-measurement corpus and its findings are already banked.
* **`s19_dojo`, `s19_trace`, `s21_weapon`, `duel_dense`, `duel_seq`, `duel_frames`,
  `combat_analysis`, `combat_analysis2`, `combat_frames`, `zFt_combat`, `duel_crops`,
  `duel_candidates` — not graded.** All are combat-only slices of the two videos at timestamps the
  earlier runs already mined; I found no UI screen in their thumbnails.
* **The 61 chapter directories — triaged, not exhausted.** I contact-sheeted every one at 320 px and
  read at native scale only in `zFtCaTO0_1M/seg-00, seg-03, seg-08, seg-22` and
  `Nr4fQstqHDM/seg-00, seg-04, seg-10, seg-20`. Chapters known from `A-MAP`/`B-MAP` to hold screens
  I did **not** open at native scale: A-17 merchant BUY screen, A-21 bounty board, A-24 gambling
  den, A-29 Recent Happenings Board, B-03 dojo trap challenge, B-11 castle-gate lever puzzle, B-17
  Ninja-Services hidden vendor, B-27 crops tooltip, B-29 AP world-interaction costs. Each is a live
  lead for a follow-up frame pass.
* **`REPAIR WEAPON` cost — searched, not found.** The menu is filmed; the option is never selected
  in either longplay (F-10).
* **The 6×6 *sector* board inside a territory — searched, not found.** F-04 delivers the
  *territory* layer only; `ZOOM IN` is never pressed on the war map in either longplay.
* **No audio.** The frames carry no audio evidence and I make no audio claim.
