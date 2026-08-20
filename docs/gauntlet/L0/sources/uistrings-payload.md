# L0 SOURCE SWEEP — `uistrings-payload`

**Unit:** `reference/extracted/ui_strings.txt` (472 lines, WEB v0.717 static TextField dump)
+ `reference/extracted/payload.xml` (329 MB / 2,653,557 lines, WEB v0.717 SWF as XML).
**Cross-referenced against:** `docs/gauntlet/L0/index/strings.json` (ANDROID v0.682
`118_Mobile_Lang_EN.bin`, 2,533 entries) and both decompiled script trees.
**Date:** 2026-08-20. **Ledger under audit:** `docs/research/REBUILD_READINESS.md`.

---

## THE HEADLINE — Priority ONE answered, and the answer is BOTH directions

The brief asked: *"diff what `ui_strings.txt` says against the corresponding Android strings.
Where they AGREE, the parity caveat weakens."*

It does weaken — **for the copy that exists in both**. It does **not** weaken for the web
build's UI as a whole, and the reason is worse than a wording drift:

> **The web v0.717 client calls 1,313 distinct `getString(N)` ids. The Android v0.682 table
> resolves 765 of them. 548 — 41.7% — are NOT IN THE ANDROID TABLE AT ALL.**
> The Android client calls 771 ids and every single one resolves.

The missing 548 sit in two contiguous, entirely web-only blocks — **11000–11515** (339 ids,
41 classes) and **22000–22104** (93 ids, 19 classes) — plus 101 scattered in 0–999 and a
handful of outliers. The Android table's largest numeric key is **9010**. There is no
overlap to argue about: the web build's PvP / tournament / betting / chat / clan-HQ UI
addresses an id space the Android table never had.

And the second half of the finding is the trap:

> **`ui_strings.txt` is NOT shipped v0.717 UI copy.** It is a dump of *design-time
> `DefineEditText` default text* — the placeholder a designer typed into the Flash IDE.
> For every field the client writes with `getString()` at runtime, the dump is **stale text
> from an older revision**. I proved this exhaustively on the War Room rules (12/12 fields),
> and the payload's own numbers show the scale: **807 authored `DefineEditTextTag` fields vs
> 1,313 runtime `getString` ids.**

That kills the brief's Priority TWO premise (*"`ui_strings.txt` is verbatim UI copy"*) and it
kills `docs/GAUNTLET.md`'s licensing table row *"UI copy … `ui_strings.txt` … ✅ decided —
interface text"*: that row is greenlighting a placeholder.

**What survives, and is worth a great deal:** the payload's authored fields still give the
**FORMAT, the FIELD SET, the BOX GEOMETRY and the TYPOGRAPHY** of every screen — which is
exactly what ui-hud blocker ⑤ asks for — and they preserve an **earlier design revision** of
the War Room that is now recoverable design history. They do not give shipped numbers.

### The measured diff

Filtering `ui_strings.txt` to clean UI copy (≥8 normalised chars, no residual font-tag
fragment, ≥60% alphabetic) leaves **255 lines**:

| bucket | count | share |
|---|---:|---:|
| exact match (normalised) to an Android table entry | 74 | 29.0% |
| fuzzy match ≥0.85 to an Android table entry | 18 | 7.1% |
| **has an Android counterpart** | **92** | **36.1%** |
| no Android counterpart at any threshold | 163 | 63.9% |

Over the whole 472-line file, 127 lines normalise onto an Android entry.

**Where both builds carry the same string, the copy is close to identical** — e.g.
`ui_strings.txt:295` *"flags indicate battles that theclans are currently engaged in"* vs
`strings.json["564"]` *"Flags indicate battles that the clans are currently engaged in"*
(ratio 0.99); `:306` vs `["768"]` (0.99); `:127` vs `["321"]` (0.93). That is the honest
good news: **the two builds share their UI voice**, so an Android string ported into a
v0.717 recreation will read right.

**But at least seven shared strings carry a substantive difference**, and one of them is a
hard economy number (5 gold vs 2 Gold — §D1 below). So S0-3's parity caveat is not
decorative. It bites, and it bites on money.

---

## CLAIMS

### 1. `uistrings-payload/web-ui-string-ids-outrun-android-table` — HELD [A2] ⚑ CORRECTS STAGE-0b S0-3

548 of the web v0.717 client's 1,313 distinct UI string ids do not exist in the Android
v0.682 table, so 42% of the web build's interface copy is **unheld**, not merely
"build-labelled".

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t396s0§.as:80`; id inventory in
  `docs/gauntlet/L0/index/strings.json` (2,533 entries, max numeric key 9010)
- **Quote:** `this.betlabel.text = §1t1521s0§.getString(11003);`
- **Measurement:**
  `grep -rhoE 'getString\([0-9]+\)' reference/decompiled/shs3_payload/scripts/ | sort -u`
  → 1,313 distinct ids; 765 present in `strings.json`; **548 absent**, bucketed
  `{0–999: 101, 1000–1999: 6, 3000: 1, 10000s: 4, 11000–11515: 339, 20000: 1,
  22000–22104: 93, 30000: 1, 40000: 1, 60000: 1}`. Same command over
  `shs3_android/scripts/` → 771 distinct ids, **0 absent**.
- **Corrects:** S0-3's *"MEASURED resolution: itemdata 804 rows / 0 unresolved · skilldata
  73 / 0 · npcdata 484 / 6"* — true for the DATA XMLs (shared 2000–8xxx id space) and
  **false for the UI**. The Android table is sized for the Android client.
- **Build:** web v0.717 vs android v0.682.
- **Lane impact:** ui-hud, meta-social, economy. Any lane porting an Android string into a
  v0.717 surface must first check the web client actually calls that id. For the 11000/22000
  blocks there is nothing to port — those strings live only in the never-archived
  `shs3_en.xml` under `/lang/` (`payload.xml:120326` `<item>/lang/</item>`).

### 2. `uistrings-payload/uistrings-is-design-time-not-shipped` — HELD [A2] ⚑ OVERTURNS GAUNTLET §-licensing

`ui_strings.txt` and the payload's 807 `DefineEditText` `initialText` values are design-time
placeholders, overwritten at runtime — not shipped v0.717 copy.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7924s0§.as:96` and `:119`, against
  `reference/extracted/payload.xml:528040` and `:528080`
- **Quote:** `§1t7924s0§.as:96  this.warrulestitle.text = §1t1521s0§.getString(369);`
  · `§1t7924s0§.as:119  this.warruleswords.text = §1t1521s0§.getString(380);`
  · `payload.xml:528040 initialText=…War room rules 1/6  (joining a battle)`
  · `payload.xml:528080 initialText=…War room rules 6/6  (rank)`
- **Proof:** all twelve War Room rule fields — payload characterIDs **744–755**, at
  `payload.xml:528040 / 528044 / 528048 / 528052 / 528056 / 528060 / 528064 / 528068 /
  528072 / 528076 / 528080 / 528084` — are written at runtime by `getString(369)`…
  `getString(380)` at `§1t7924s0§.as:96,97,102,103,106,107,110,111,114,115,118,119`.
  The authored page 6 says **"(rank)"**; the id the client actually fetches for page 6 is
  **380**, which the Android table renders **"- Once the contruction of a structure is
  initiated by an Officer…"**. The authored text is a whole revision out of date.
- **Overturns:** `docs/GAUNTLET.md:306` — *"| **UI copy** — *"action points"*, War Room
  rules, betting-odds text | `ui_strings.txt` | ✅ decided — interface text; a paraphrased
  HUD is not 1:1 |"*
- **Scale:** 807 `DefineEditTextTag` in `payload.xml` vs 1,313 distinct runtime
  `getString` ids in the same build.
- **Build:** web v0.717.
- **Lane impact:** every lane. The rule to adopt: **an authored TextField gives you the
  format and the geometry; it does not give you the words or the numbers unless you have
  shown no `getString` writes that field.**

### 3. `uistrings-payload/warroom-rules-web-uses-android-id-set` — HELD [A2]

Because the web client fetches ids **369–380 in the same order and the same twelve slots**
as `shs3_android/scripts/WarRules.as:94–117`, the Android table's rules pages **are** the
v0.717 runtime copy. This is the one place the parity caveat genuinely collapses.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7924s0§.as:96-119` vs
  `reference/decompiled/shs3_android/scripts/WarRules.as:94`
- **Quote:** web `this.warrulestitle.text = §1t1521s0§.getString(369);` · android
  `this.warrulestitle.text = LangManager.getString(`
- **Build:** both. The id contract is shared; only the language file differs, and 369–380
  are all ≤ 9010 so they are held.
- **Lane impact:** meta-social. The six War Room rules pages are portable verbatim from
  `strings.json["369"]`…`["380"]` with a *weak* caveat, not a strong one. Shipped page order
  is: 1 joining a battle · 2 Turns AND MOVES · 3 attacking and defending · 4 CAPTURING
  Sectors · 5 **rank** · 6 **building structures**.

### 4. `uistrings-payload/warroom-earlier-design-preserved-in-payload` — HELD [A2]

The web payload's stale authored text preserves an **earlier War Room design** that the
shipped build replaced. It is design history, and it must NOT be coded.

- **Cite:** `reference/extracted/payload.xml:528052`, `:528072`, `:528076`, `:528084`
- **Quote:** `:528052` *"- Each turn, every player gets 3 moves.- Moves can be used to deploy
  troops, attack enemy troops, move to a different sector or to spy on the enemy.- moves can
  only be used on sectors near the player."* · `:528072` *"War room rules 5/6  (WINNING AND
  LOSING)"* · `:528076` *"- A side wins when it controls 80% of the battlefield.- A side
  loses when it&amp;apos;s Castle HQ is captured."* · `:528084` *"- donating coins to the war
  effort will also help the player to rise in rank faster."*
- **Superseded by (shipped, `strings.json`):** `["372"]` *"- Each turn, every player gets a
  number of moves based on their rank… or build structures… sectors **adjacent** to the
  player **that are not blocked**… fire arrows… terrain… mountains have the highest tactical
  advantage"* · `["376"]` *"- The Clan that captures all the control points in the
  battlefield will gain control of the territory."* · `["378"]` *"- donating coins to build
  structures will also help you rise in rank faster."*
- **Note:** the deprecated **80%-of-battlefield / Castle-HQ-captured win condition** is
  recorded NOWHERE else in this corpus; the shipped condition is control points. Also, the
  authored web text carries the typo *"kidk them off the battlefield"* (`:528060`) which the
  shipped table fixes to *"kick"* (`strings.json["374"]`) — an independent proof of the
  authored text's staleness that does **not** depend on the version numbers.
- **Contradicts:** `docs/gauntlet/L0/critics/meta-social.precedence.md:212`'s use of string
  372 is correct for the shipped build; anyone reading `ui_strings.txt:19` would conclude a
  flat 3 moves/turn and be wrong. Flagging the trap, not the critic.
- **Build:** the authored text is pre-v0.717 web; the table text is the shipped copy.
- **Lane impact:** meta-social. Do not code 80%/Castle HQ; do not code flat 3 moves.

### 5. `uistrings-payload/duel-betting-book-is-web-only-with-full-odds-math` — HELD [A2] ⚑ OVERTURNS §4 economy blocker ④

The web v0.717 client runs a **pari-mutuel betting book on live duels**, with the complete
odds formula and the house rake in the shipped code. It has no counterpart in the Android
build — zero files and zero table entries mention odds.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t396s0§.as:222-239`
- **Quote:**
  ```
  222  var _loc7_:int = param1.totalbetsonplayer1 + param1.totalbetsonplayer2;
  223  if(_loc7_ <= 10 && Boolean(param1.acceptingbets))   // → both odds 0.7
  232        _loc10_ = _loc7_ * 0.8;      // pool > 100  ⇒ 20% rake
  236        _loc10_ = _loc7_ * 0.85;     // pool ≤ 100  ⇒ 15% rake
  238  _loc11_ = Math.round((_loc10_ - param1.totalbetsonplayer1) / param1.totalbetsonplayer1 * 10) / 10;
  239  _loc12_ = Math.round((_loc10_ - param1.totalbetsonplayer2) / param1.totalbetsonplayer2 * 10) / 10;
  ```
  i.e. `odds_i = round((pool × rake − bets_i) / bets_i × 10) / 10`, quantised to 0.1,
  floored at 0.7 while the pool is ≤ 10 and still open.
- **Absence check:** `grep -rlie odds reference/decompiled/shs3_android/scripts/` → 0 files;
  `"odds"` in `strings.json` → 0 of 2,533 entries.
- **Overturns:** §4 economy — *"④ token/tournament economy numbers."*
- **Build:** web v0.717 only.
- **Lane impact:** economy + meta-social. This is a **gold faucet** with a known rake, which
  is directly what meta-social blocker ④ *"offline gold faucet rate"* asks for.

### 6. `uistrings-payload/bets-are-tokens-paid-out-in-gold` — PARTIAL [A2]

The betting help panel states the currency crossing: you stake **tokens**, you are paid
**gold**, and odds float until the book closes.

- **Cite:** `reference/extracted/payload.xml:533246` (characterID 862, Edo SZ 14 px
  `#ffffff`, `leading="40"`, `align="0"`)
- **Quote:** *"\"Odds\" refers to the estimated profit that you will make for each token that
  you bet."* / *"example: If you bet 2 tokens at 1.5 odds, you will make an estimated profit
  of 3 gold when your bet wins."* / *"Note: Odds are changed whenever someone makes a bet and
  are only finalized when betting is closed."*
- **Why PARTIAL:** this is authored TextField copy (claim 2's trap). It is *corroborated* by
  the code — the 0.1 quantisation in `§1t396s0§.as:238` is exactly what makes "1.5 odds"
  expressible, and `acceptingbets` at `:223` is exactly "finalized when betting is closed".
  The worked example (2 × 1.5 = 3) matches `profit = stake × odds`. But the label id itself
  is `getString(11003)` — web-only, unresolvable — so the shipped wording is unheld.
- **Build:** web v0.717.
- **Lane impact:** economy — an explicit token→gold conversion path the ledger's currency
  model does not have.

### 7. `uistrings-payload/golden-tokens-are-spendable-in-v0717` — PARTIAL [A2] ⚑ OVERTURNS §4 meta-social surface

Golden Tokens are a **spendable currency** in the web v0.717 build — they are the tournament
entry fee — not a quest item.

- **Cite:** `reference/extracted/payload.xml:534288` (characterID 879) and
  `reference/decompiled/shs3_payload/scripts/§1t7144s0§.as:22`
- **Quote:** `payload.xml:534288` → *"entry fee: 2 golden tokens"* (full field:
  *"status: waiting for participants ( 5 / 8 ) | players: 8 | entry fee: 2 golden tokens |
  First prize: 3 Gold | second prize: 2 Gold | third prize: 1 Gold | level requirement:
  10 - 30 | autostarts upon full roster | round duration: 30 min | autoresolves upon round
  timeout | organizer: chronos"*) · `§1t7144s0§.as:22 public var goldenTokenText:TextField;`
- **Overturns:** §4 meta-social Surface — *"Golden Token reads as a **quest item** in v0.717
  vs a spendable currency in the wiki — version-check needed."*
- **Why PARTIAL:** the *numbers* in the card are design-time placeholders; the **currency
  role** is proved twice over (authored copy + a live `goldenTokenText` field on the
  tournament UI class).
- **Build:** web v0.717.

### 8. `uistrings-payload/tournament-field-set-and-create-form` — PARTIAL [A2] — STRENGTHENS `economy/tournament-is-web-only`

The banked claim said *"A follow-up pass should read `§1t7144s0§.as` and its f[ields]"*. The
authored UI gives the whole spec sheet without needing it.

- **Cite:** `reference/extracted/payload.xml:534288`, `:534304`–`:534361`
- **Quote:** create-form labels at cid 883–896: *title · players · entry fee · min level ·
  max level · round duration · autostart · prizes (1st / 2nd / 3rd)*, with authored sample
  values `10` (`:534336`), `80` (`:534344`), `24 hours` (`:534348`), `yes` (`:534352`),
  `400 / 200 / 100` (`:534361`). Detail card at `:534288` adds *autostarts upon full roster*
  and *autoresolves upon round timeout*.
- **Build:** web v0.717 only (Android: 0 code files, 0 table entries for "tournament").
- **Why PARTIAL:** field set = real; numbers = placeholders.
- **Lane impact:** economy blocker ④ / meta-social. A recreation can build the tournament
  screen from this list without a single guess about *what* is configurable.

### 9. `uistrings-payload/server-rpc-surface-is-enumerable` — HELD [A2] ⚑ OVERTURNS §6

§6 says the server topology has *"nothing to copy"*. The web payload's AS3 string pool holds
the **complete named RPC surface — 60 endpoints — and the save/load wire field lists.**

- **Cite:** `reference/extracted/payload.xml:119329` and `:119343`
- **Quote:** `:119329 <item>loaddata.php</item>` · `:119343 <item>savedata.php</item>`
- **The surface, contiguous at `payload.xml:118550–121372`:**
  - **account (12):** `login_internal.php` `:119271`, `login_external.php` `:119275`,
    `login_flashvars.php` `:119277`, `logout.php` `:119279`, `registeruser.php` `:119280`,
    `getemail.php` `:119281`, `edituser.php` `:119282`, `sendverify.php` `:119283`,
    `createcharacter.php` `:119284`, `deletecharacter.php` `:119286`, `changename.php`
    `:119372`, `/playerio/checkemailverified.php` `:120354`
  - **war (11):** `/war/getclanmembercount.php` `:119301`, `/war/getwarmaps.php` `:119306`,
    `/war/getwarhex.php` `:119312`, `/war/warmessage.php` `:119315`,
    `/war/getwarhexdata.php` `:119318`, `/war/warsentry.php` `:119319`,
    `/war/getwarenemysentry.php` `:119321`, `/war/setwarhex.php` `:119322`,
    `/war/startbuild.php` `:119323`, `/war/dobuild.php` `:119324`,
    `/war/spawnpointcreate.php` `:119358`, `/war/spawnpointdestroy.php` `:119360`
  - **town/territory (5):** `/town/updatetownprosperity.php` `:119354`,
    `/town/createtown.php` `:119355`, `/town/gettowndata.php` `:119357`,
    `/town/getterritorydata.php` `:119361`, `/town/getterritorygroupdata.php` `:119363`
  - **duel/social (7):** `whoishere.php` `:119287`, `getopponents.php` `:119288`,
    `getopponentdata.php` `:119289`, `getleaderboards.php` `:119293`, `giveitem.php`
    `:119295`, `getnotifications.php` `:119297`, `duelend.php` `:119299`,
    `getfrienddata.php` `:121269`
  - **replay (2):** `savereplay.php` `:119347`, `getreplay.php` `:119350`
  - **globals/persistence (4):** `loaddata.php` `:119329`, `savedata.php` `:119343`,
    `updateglobalvar.php` `:119351`, `getglobalvar.php` `:119353`
  - **content roots:** `/res/` `:120324`, `/lang/` `:120326`, `/data/` `:120328`
    (+ `/testres/`, `/testlang/`, `/testdata/` staging twins)
- **The save schema wire fields**, adjacent to their endpoint in the same pool:
  `loaddata.php` → `lastupdate` `:119330`, `apupdate` `:119331`, `dtupdate` `:119332`,
  `warupdate` `:119333`, `skillslots` `:119334`, `stash` `:119335`, `questitems` `:119336`,
  `intstats` `:119337`, `achievementstats` `:119338`, `booleanstats` `:119339`, `ignore`
  `:119340`, `purchases` `:119341`, `goldbought` `:119342`; `savedata.php` → `battlestats`
  `:119344`, `playerlocation` `:119345`, `playerdan` `:119346`.
- **Overturns:** §6 — *"**Server-sim topology & save format** — nothing to copy; design a
  single-player persistence schema from the observed field set."*
- **Contradicts (partially):** the banked `world-exploration/save-format-is-copyable` closes
  with *"The server-sim-topology half of the same sentence stands."* It does not. The
  topology is enumerable to the endpoint name and, for persistence, to the wire field.
- **Build:** web v0.717.

### 10. `uistrings-payload/pvp-transport-is-rtmfp-p2p` — HELD [A2] ⚑ OVERTURNS §6

Live PvP did not run over the Player.IO socket alone — it ran over **Adobe RTMFP
peer-to-peer**, against a named private server plus Adobe's public Cirrus rendezvous.

- **Cite:** `reference/extracted/payload.xml:120466` and `:120467`
- **Quote:** `:120466 <item>rtmfp://218.99.12.19/shs3/</item>` ·
  `:120467 <item>rtmfp://p2p.rtmfp.net</item>`
- **Corroborating pool entries:** `stratusid` `:119285`, `NET_STATUS` `:119389`,
  `netConnectionHandler: ` `:119390`, `nearID` `:119392`, `farID` `:119396`,
  `Unable to connect to ` `:119393`, `connected to netgroup` `:119398`,
  `rejected by netgroup` `:119399`, `NetConnection.Connect.Success` `:119400`.
- **This explains the NAT error copy** authored at `payload.xml:2628339` (cid 3447):
  *"Error: Your device/computer is behind a NAT or router that is preventing it from
  receiving messages from the game server."* — a P2P NAT-traversal failure, not a firewall
  message.
- **Overturns:** §6 — *"**The live clan-war** — warring alongside thousands of real players
  is impossible offline"* is still true, but the sentence's premise that the multiplayer
  architecture is unknowable is false: the transport, the rendezvous service and the
  application URI are all in the payload.
- **Build:** web v0.717.
- **Lane impact:** meta-social. Also a P0 postscript: `p2p.rtmfp.net` was Adobe Cirrus,
  retired with Flash — so even a revived Player.IO backend would not restore PvP.

### 11. `uistrings-payload/nine-embedded-fonts-not-two` — HELD [A2] ⚑ CORRECTS STAGE-0 S0-2

S0-2 closed the font question with "Edo SZ (+ Calibri)". The payload embeds **nine** faces
with full copyright lines, and two of them are display faces nobody has named.

- **Cite:** `reference/extracted/payload.xml:2633161` and `:2633162`
- **Quote:** `:2633161 <item type="DefineFontNameTag" fontCopyright="Allen R. Walden's
  Friendly Fonts (Unprotected. Please distribute freely.)" fontId="3538" fontName="Olivia
  Brush" forceWriteAsLong="true"/>` · `:2633162 <item type="DefineEditTextTag" align="2" …
  characterID="3539" fontHeight="1600" fontId="3538"` → initialText **`FIGHT!`**
- **The full roster:** fontID 2 **Edo SZ** (`:84`, name tag `:15899`, *fontCopyright="2008
  Vic Fieger"*, ascent 18505 / descent 4315 / leading 2926) · 47 `_sans` (`:50748`) · 60
  **Calibri Bold** (`:62495`, `:98881`) · 533 **Calibri** (`:442040`, `:478441`) · 1273
  **Adobe 고딕 Std B** (`:576878`, `:577145`) · 1296 **Arial** (`:577916`) · 1482 **EPSON
  太行書体Ｂ** (`:588965`, name tag `:590471`, *"(C) 2000 SEIKO EPSON CORP."*) · 2212 **Times
  New Roman** (`:693554`, `:694549`) · 3538 **Olivia Brush** (`:2631822`, `:2633161`).
- **The two that matter for the 1:1 look:**
  - **`FIGHT!` is set in Olivia Brush at fontHeight 1600 twips = 80 pt** (cid 3539,
    `payload.xml:2633162`). That is the duel-intro word mark, and its face was previously
    unidentified.
  - **EPSON 太行書体Ｂ** — a Japanese semi-cursive brush face — is used by exactly one field,
    cid 1483 at `payload.xml:590472`, fontHeight 320 (16 pt), whose text is **`(十段)`** —
    the Dan-10 kanji title. Independent corroboration from a third artifact class that a
    tenth Dan rank is a real, rendered thing (ledger §3.7 wanted `MAX_DAN_RANK=10` demoted
    to INFERRED).
- **Overturns:** §4 art-anim-audio-feel blocker — *"② font (unidentified)"* — and narrows
  S0-2's *"the game font is CLOSED"* to "the body font is closed; the display faces were
  not looked at."
- **Licensing note (CLAUDE.md invariant — third-party assets are NOT covered by the Lut
  grant):** Calibri = Microsoft, Times New Roman = Monotype, Adobe 고딕 Std B = Adobe,
  EPSON 太行書体Ｂ = Seiko Epson — all commercial. Edo SZ (Vic Fieger) and Olivia Brush
  ("Unprotected. Please distribute freely.") are the two that are freely redistributable.
- **Build:** web v0.717.

### 12. `uistrings-payload/character-stat-sheet-complete` — HELD [A2] — STRENGTHENS `ui-hud/typography-edo-sz`

The whole character stat sheet — 17 rows, in order, with the exact box, font and leading —
is one authored field. The existing typography claim quoted two lines of it; this is all
of it plus the geometry.

- **Cite:** `reference/extracted/payload.xml:592221` (characterID 1548) and `:592222`
- **Quote (row order, verbatim):** `hp: 123 / 123  (hp regen 12 )` · `chi: 123 / 434  (chi
  regen 13)` · *(blank)* · `physical dmg: 1234 - 1235  (heavy)` · `critical dmg: 1234-1235
  *(heavy)` · `piercing dmg: 20` · `fire atk: 23` · `water atk: 1` · `wind atk: 2` ·
  `earth atk: 3` · *(blank)* · `physical def: 100 (heavy)` · `fire def: 23` · `water def: 1`
  · `wind def: 2` · `earth def: 3` · *(blank)* · `slash distance: 345 (heavy)` ·
  `skill cooldown modifier: 0.75`
- **Metrics:** `align="2"` (centre), `fontHeight="280"` (14 pt), `fontId="2"` (Edo SZ),
  `leading="40"` (2 pt), `textColor` RGBA 204/204/204 (`:592223`), bounds
  `Xmin="-40" Xmax="5240" Ymin="-40" Ymax="7392"` (`:592222`) = **264 × 371.6 px**. Its
  parent sprite 1549 (`:592225`) places `closeWindow` at `translateX="15119"` twips
  = 755.95 px, consistent with the 800-px-wide authored stage.
- **The stance-qualifier rule:** exactly **four** rows carry the `(stance)` suffix —
  *physical dmg*, *critical dmg*, *physical def*, *slash distance*. Elemental atk/def and
  piercing dmg do **not**. That matches `InventoryUI.as:1940-1970`'s four-modifier table
  (dmg / crit / def / slash) exactly, from the opposite direction.
- **Also new here:** `piercing dmg`, `hp regen`, `chi regen` and `skill cooldown modifier`
  are all first-class *displayed* stats. All three of the first are corroborated in the
  Android table — `strings.json["876"] "Piercing Damage"`, `["112"] "HP Regen"`,
  `["115"] "Chi Regen"` — a clean three-for-three parity hit.
- **Numbers are placeholders** (claim 2). `slash distance: 345` is exactly the discrepancy
  the banked `combat-core/slash-distance-is-player-visible` flagged; claim 2 explains it —
  it is authored mock data from an older revision, not a stale formula.
- **Build:** web v0.717 authored; Android v0.682 for the three label corroborations.
- **Lane impact:** ui-hud blocker ⑤ (a full screen's metrics, free), combat-core.

### 13. `uistrings-payload/warroom-build-menu-is-ladder-in-web-copy` — HELD [A2]

The 5,000-coin barrier-bypass structure is **`HEX_LADDER`** in both builds' code; only the
*displayed name* was reworded. The banked meta-social claim's "Tunnels" is the Android
wording, not a universal name.

- **Cite:** `reference/extracted/payload.xml:485373` (characterID 639) vs
  `reference/decompiled/shs3_android/scripts/WarHexUIBuildMenu.as:195`
- **Quote:** `payload.xml:485373` → *"Ladder | - total cost: 5000 | - Bypasses barriers
  surrounding the sector"* · `WarHexUIBuildMenu.as:195 case WarHex.HEX_LADDER:` →
  `getString(568)` = **"Tunnels"**, `getString(569)` = **"Bypasses the surrounding natural
  obstacles"**
- **Full web build menu, authored:** `Build Menu` (cid 638, `:485368`) · `Barricades -
  total cost: 10000 - Grants a defense bonus to the sector` (cid 734, `:527783`) ·
  `forward base - total cost: 10000 - allows clan samurai to spawn closer to the front
  lines` (cid 736, `:527793`) · `Ladder - total cost: 5000 - Bypasses barriers surrounding
  the sector` (cid 639, `:485373`). Costs match the banked 10000/5000/10000 exactly — so
  the *numbers* survived the revision and only the *copy* moved.
- **Build:** web v0.717 authored vs android v0.682 table.
- **Lane impact:** meta-social. Ports must use the internal name `HEX_LADDER` and pick a
  display string deliberately.

### 14. `uistrings-payload/emote-and-chat-command-surface` — HELD [A2]

A 21-command chat surface and an 11-emote set — absent from all twelve ledger systems, from
the Android table, and from every prior L0 sweep.

- **Cite:** `reference/extracted/payload.xml:121490` and `:121163`
- **Quote:** `:121490 <item>/bow, /kneel, /sit, /stand, /fart, /sadtrombone, /rimshot,
  /gangnamstyle, /rest, /seppuku, /shoulderweapon</item>` ·
  `:121163 <item>/emotes - lists the available emotes</item>`
- **The command set,** `payload.xml:121163–121185` and `:121471–121478`:
  `/emotes` `/ping` `/showally` `/ally [player name]` `/allyroom` `/stopally [player name]`
  `/stopallyall` `/help` `/hidehud` `/disablepvp` (`:121172`, `:121178`), `/picture`
  (`:121271`), `/recall` `/leavetown`
  `/tournament` `/list` `/join [` `/help:emotes` `/help:channel`; plus `/leave` `:121486`,
  `/kick [` `:121487`, `/ban [` `:121488`, `/unban [` `:121489`.
  Two headers exist — `\nAvailable PvP commands:` `:121161` and `\nAvailable Duel commands:`
  `:121162` — i.e. the room type changes the help list.
  The PvP-only emote subset is narrower: `/fart, /sadtrombone, /rimshot, /seppuku`
  (`:121171`).
- **Build:** web v0.717 only (`"emote"` → 0 of 2,533 Android table entries).
- **Lane impact:** meta-social. `/seppuku` is a suicide emote and `/rest`, `/hidehud`,
  `/shoulderweapon` are state changes, not just animations — each implies an authored
  character pose the art lane has no entry for.

### 15. `uistrings-payload/duel-replay-is-a-first-class-feature` — HELD [A2]

Duels were recorded server-side and shareable by URL — a whole feature the ledger's
meta-social entry does not list.

- **Cite:** `reference/extracted/payload.xml:119347`, `:119350`, `:121368`
- **Quote:** `:119347 <item>savereplay.php</item>` · `:119350 <item>getreplay.php</item>` ·
  `:121368 <item>http://www.strawhatsamuraiduels.com/watch?id=</item>`
- **Corroborating:** authored fields cid 3577 / 3580 at `payload.xml:2640123` and `:2640172`
  both read `http://www.strawhatsamuraiduels.com/watch?name=orochi`; the pool also carries
  `shareDuelTVOnWall` `:119387` (Facebook share) and `http://www.strawhatsamuraiduels.com/comic.php`
  `:121359`. The banked `ui-hud` sweep already found the `savereplaybutton` (string 483
  "Save Replay") — this supplies the transport and the public URL shape it fed.
- **Build:** web v0.717.
- **Lane impact:** meta-social + §6. Two URL forms — `watch?id=` and `watch?name=` — so a
  replay was addressable by duel id *and* by player name.

### 16. `uistrings-payload/clan-hq-rooms-staff-missions-absent-from-all-12-systems` — PARTIAL [A2]

An entire **base-building / staff / mission / graveyard subsystem** is authored in the web
payload and live as node types in the Android build, and it appears in **none** of the
ledger's twelve systems and in no prior L0 sweep.

- **Cite:** `reference/extracted/payload.xml:666623` and `:672110`
- **Quote:** `:666623` (cid 1993) *"assign staff to this room | to send them on missions."* ·
  `:672110` (cid 2074) *"note: graveyard is full. the oldest corpse will be replaced when a
  new corpse arrives."*
- **The vocabulary, contiguous at `payload.xml:665876–684584`:** `merchant training room`
  (cid 1955, `:665912`) · `modify living quarters` (cid 1965, `:666263`) · `upgrade to
  level 2` (cid 1966, `:666268`) · `demolish room` (cid 1973, `:666296`) · `no available
  missions.` (cid 1992, `:666619`) · `mission in progress` (cid 2023, `:668811`) ·
  `success probability: 90%` (cid 2025, `:668819`) · `high risk | recommended level: 80`
  (cid 2040, `:670323`) · `capacity: 5/5 (Full)` (cid 2056, `:670630`) · `graveyard is
  empty.` (cid 2071, `:672096`) · `mission result` (cid 2077, `:672684`) · `select 5 crates`
  (cid 2087, `:673319`) · `is now a member of your staff!` (cid 2116, `:684272`). Six
  `10000 / 10000` progress fields sit either side of the room list (cid 1948–1953
  `:665884–:665904`, cid 1979–1984 `:666324–:666344`) — a build/upgrade cost meter.
- **Cross-build:** `"staff"`, `"living quarters"`, `"training room"`, `"kitchen"`,
  `"workshop"`, `"ninja crates"`, `"capacity"`, `"crates"` all return **0** of 2,533 Android
  table entries; `graveyard` returns 1 (`strings.json["1016"] "Graveyard"`) and appears in
  **9** Android script files (`NodeGenerator.as`, `BigmapRoom.as`, `TerritoryData.as`,
  `QuestGenerator.as`, `ActiveQuest.as`, `SoundManager.as`, `GameStage.as`, `QuestItem.as`,
  `HistoryItem.as`) — so the graveyard is a live world node in Android while the room/staff
  UI is web-authored.
- **Why PARTIAL:** I proved the UI is authored and that the graveyard node is live; I did
  **not** prove the room/staff/mission loop shipped. The web scripts are name-obfuscated
  (`§1t…s0§`), so an identifier-level absence check is not evidence there. This is the same
  class of finding as S0-1's `<survivalmodedata>`: a system the twelve-lane board has no
  slot for.
- **Build:** web v0.717 authored; android v0.682 for the node-type half.

### 17. `uistrings-payload/weapon-unbreakable-price-differs-between-builds` — PARTIAL [A2]

The same dialog, same string id, different price — and the web's shipped value is **unheld**.

- **Cite:** `reference/extracted/payload.xml:2634709` (characterID 3562) vs
  `reference/decompiled/shs3_payload/scripts/§1t5777s0§.as:180`
- **Quote:** `payload.xml:2634709` → *"your weapon broke! | would you like to make it
  unbreakable for 5 gold?"* · `§1t5777s0§.as:180  this.msgText.text =
  §1t1521s0§.getString(669);` · Android `strings.json["669"]` → *"Your weapon broke!\nWould
  you like to make it unbreakable for 2 Gold?"* (and `["636"]` *"Name your currently equipped
  weapon and make it unbreakable for 2 Gold?"*, reached at `§1t401s0§.as:620` in the web
  build too).
- **Why PARTIAL, and this is the important half:** the authored **5 gold** is overwritten at
  runtime by `getString(669)`, whose *web* value lives in the never-archived `shs3_en.xml`.
  So the honest state is: **android says 2 Gold; the web authored text says 5 gold; the web
  runtime value is UNHELD.** Anyone who "corrects" the ledger to 5 gold from
  `ui_strings.txt:471` would be shipping a placeholder, and anyone who ports 2 Gold is
  making a labelled cross-build assumption.
- **Build:** web v0.717 vs android v0.682.
- **Lane impact:** economy blocker ③. This is the single cleanest demonstration that S0-3's
  parity caveat has teeth on money.

### 18. `uistrings-payload/war-sector-panel-format` — PARTIAL [A2]

- **Cite:** `reference/extracted/payload.xml:484834` (characterID 634)
- **Quote:** *"sector: (2,4) | status: under attack | friendly Troops: 256 | enemy troops:
  ??? | samurai on guard: | boba (1) | bonga (2) | fish (3)"*
- **Reading:** friendly strength is numeric, **enemy strength renders as `???`**, and the
  war RPC set carries a matching pair `/war/warsentry.php` (`:119319`) and
  `/war/getwarenemysentry.php` (`:119321`) — i.e. enemy troop counts are fog-gated behind
  the spy action that shipped rules string `["372"]` names. Defender nameplates use
  `name (level)`, matching the banked `nameplate (N)=level` fact.
- **Why PARTIAL:** authored field (claim 2). The `???` is a format literal rather than a mock
  number, and the only `"???"` literal I could find in either script tree
  (`§1t3318s0§.as:3169`, `QueryManagerPIO.as:2816`) is the **clan-acronym** fallback, not the
  troop counter — so the fog-of-war reading is inference from the endpoint pair, not proof.
- **Build:** web v0.717.
- **Lane impact:** meta-social blocker ② (board/adjacency) — this is the sector inspector's
  field set, not the topology.

### 19. `uistrings-payload/payload-tag-families-unswept` — STILL_UNHELD

Three tag families in `docs/gauntlet/L0/index/payload_histogram.json` are still untouched by
any sweep and I did not open them: `morphFillStyles`/`morphLineStyles` (9 each — DefineMorph
shape tweens, i.e. authored shape morphs the art lane has no entry for),
`zonedata`/`zoneTable` (554 / 9 — DefineFontAlignZones hinting), and `surfaceFilterList`
(263 — per-placement filters; I opened exactly one, the GLOWFILTER at
`payload.xml:592239`, `blurX/blurY 10.0, strength 5.0, black`, on the stats window). The
263 filter lists are the most likely home of the ledger's *"FX **blend modes**"* blocker.
Refusing to characterise them without opening them.

---

## COVERAGE — what I did NOT open

- **`payload.xml` shape/render data.** 1,822 `<shapes>`, 2,394 `<shapeRecords>`, 4,997
  `<fillStyles>`, 785 `<gradient>`, 6,493 `<matrix>` — the actual vector art. Out of scope
  for a strings unit and a full sweep would be its own lane. I opened only the tags a text
  field pulls in (bounds, textColor, one surfaceFilterList).
- **262 of 263 `surfaceFilterList` entries** — see claim 19.
- **All `morphFillStyles`/`morphLineStyles`, `zonedata`/`zoneTable`, `glyphShapeTable`,
  `fontAdvanceTable`/`fontBoundsTable`/`fontKerningTable`** — named, not opened.
- **The 2 `<abc>` / `<bodies>` blocks** (the raw AS3 bytecode). I read the decompiled
  `scripts/` trees instead, which is the same content already indexed at
  `docs/gauntlet/L0/index/actionscript.json`.
- **~740 of the 807 `DefineEditText` fields.** I extracted all 807 `initialText` values to a
  scratch file and read every one whose text was longer than ~26 characters, plus targeted
  greps. Short fields (single digits, `aaa`, `asdasd`, single letters) were read in bulk from
  `ui_strings.txt` but not individually traced to a characterID.
- **No frames were opened.** Deliberate: every claim here is about static TextField defaults
  and AS3 string constants, and — per claim 2 — those defaults are *placeholder text that
  never reached a screen*, so there is nothing in the reference footage that could confirm or
  refute them. The one place a frame could rule (the character stat panel) is already
  frame-checked in `docs/gauntlet/L0/systems/combat-core.md`. I did not manufacture a frame
  cite to raise my artifact class.
- **`shs3_en.xml` / `shs3_fr.xml` / `shs3_es.xml` / `shs3_zh-CN.xml`** — the web build's own
  language tables. **Not on disk.** They are the 548 missing ids of claim 1 and the true
  source for every string this unit had to caveat. `payload.xml:120326` `<item>/lang/</item>`
  confirms the fetch path; a Wayback CDX query against
  `strawhatsamuraiduels.com/lang/` is the one close-path that would collapse most of the
  caveats in this document at once.
