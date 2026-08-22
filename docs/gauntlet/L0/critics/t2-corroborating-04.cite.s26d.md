# Blind cite-lens re-judge — packet `t2-corroborating-04` (48 claims)

**Agent:** cite-lens critic, run s26d · **Packet:** `docs/gauntlet/L0/worklist/t2-corroborating-04.json`
**Judged:** 48 / 48 · **Skipped:** none · **Refuted:** 2 · **Held:** 46 · **New findings:** 4

Structured verdicts: `docs/gauntlet/L0/critics/t2-corroborating-04.cite.s26d.json` (written FIRST, before this file).

---

## Headline

Two claims fall, and they fall for opposite reasons — one got the measurement right and
the meaning backwards, the other got the meaning right and measured the wrong class.

1. **`questdata-critic/questdata-no-build-parity-hole` — REFUTED, fatal.** Its byte
   comparison is perfect and I reproduced every digit of it. Its conclusion is the
   circular diff that §0 correction **C2 explicitly bans**. It calls
   `reference/extracted/questdata.xml` the "web" side and concludes web/android parity.
   That file *is* the Android blob. The diff compares a file with itself.

2. **`questdata/projectile-type-enum-47-and-web-delta` — REFUTED, material.** The
   47-name Android enum is verbatim and correct. But the "MEASURED BUILD DELTA: the web
   build ships 9 more projectile types" compares Android's *projectile* enum against the
   web build's *background* enum. `§1t112s0§.as` is **GameStage**, not ProjectileManager.
   The real web ProjectileManager is `§1t1712s0§.as` and the true delta is **+1, not +9**.

The other 46 held, and many held *unusually* well — several reproduced to the digit when
I re-ran the census myself rather than reading the quote.

---

## The two refutations, in full

### 1. `questdata-critic/questdata-no-build-parity-hole` — the banned circular diff

Everything it measured is right. I ran it:

```
android bytes 796384 web bytes 796383 identical? False
android==web+nl? True
<quest> 61 · <title> 260 · Motoharah 5 · Chikada 1
```

Every number matches. And then the text says:

> "The campaign quest script is therefore the same content in web v0.717 and android
> v0.682, and every questdata-sourced claim in this lane is v0.717-valid **without a
> build-parity caveat**."

§0 correction C2:

> "…any 'byte-identical' proof between `reference/extracted/{questdata,skilldata,npcdata,itemdata}.xml`
> and the Android blobs is **CIRCULAR** … Those four XMLs came from the ANDROID build, so
> diffing them against the Android blobs compares a file with itself. **Do NOT cite that
> diff as parity evidence.**"

I verified C2 first-hand rather than deferring to it. My own hex grep over the full
329 MB `reference/extracted/payload.xml`:

```
3c7175657374646174613e : 0   # <questdata>
3c6974656d646174613e   : 0   # <itemdata>
3c6e7063646174613e     : 0   # <npcdata>
3c736b696c6c646174613e : 0   # <skilldata>
4a696e626569           : 0   # Jinbei
3c616e696d646174613e   : 19  # <animdata>  <- control: the grep works
```

The web payload has no quest data at all, and `questdata.xml` sits at offset **0** inside
`116_Mobile_QuestData.bin`. So the identity proves **provenance**, never **parity** — and
it *confirms* the v0.682 hole the finding says it removes. Its `build: "both"` label is
wrong; the correct label is android v0.682 only.

Two other findings in this same packet run the identical byte check and draw the correct
conclusion (`questdata/extracted-xml-is-verbatim-the-android-embed`,
`quests-story/web-payload-has-no-quest-data`). Both held. The difference is one sentence
of interpretation, and it is the whole claim.

### 2. `questdata/projectile-type-enum-47-and-web-delta` — a projectile enum vs a background enum

The Android half is clean: `ProjectileManager.as:94` `PROJ_ARROW:int = 40`, `:96`
`PROJ_ARROWDUD:int = 41`, `:106` `PROJ_EARTHQUAKE:int = 46` — all verbatim, 47 ids 0..46.

The delta is not. The three web line numbers the finding quotes are also verbatim
(`§1t112s0§.as:112` = 51, `:120` = 55, `:122` = 46) — which is exactly what made it
convincing. But look at what that file *is*:

| | web `§1t112s0§.as` | android `GameStage.as` | android `ProjectileManager.as` |
|---|---|---|---|
| extends | `MovieClip` | `MovieClip` | *(nothing)* |
| first member | `:8 …:int = 400` | `:8 visibleBuffer:int = 400` | `:10 projectileList Vector` |
| `:112` | `51` | `BG_DUNGEON_FOG = 51` | *(inside `init()`)* |
| `:120` | `55` | `BG_BAMBOOFORESTTOWN = 55` | — |
| `:122` | `46` | `BG_MINE2 = 46` | — |
| `:126` | `49` | `BG_DOJO4 = 49` | — |
| `:130` | `screenWidth:int = 800` | `screenWidth:int = 800` | *(absent)* |

`§1t112s0§.as` is **GameStage**, line for line. Its 0..55 run is `BG_*`, the background
enum. Android's own GameStage also runs to 55 — so the measured delta on that class is
**zero**.

I then found the real web ProjectileManager by structural signature (three matching
imports, two leading Vectors, enum value 0 at line 14 and 46 at line 106 — unique across
all 2,768 web classes):

```
reference/decompiled/shs3_payload/scripts/§1t1712s0§.as
  :6-8   import flash.display.DisplayObject / MovieClip / geom.Point
  :10    internal static var §1t11271s0§:* = new Vector.<§1t128s0§>();
  :12    internal static var §1t5834s0§:* = new Vector.<§1t129s0§>();
  :14    public static var §1t11272s0§:int = 0;
  :108   public static var §1t11319s0§:int = 47;
```

**True delta: web 48 types (0..47) vs android 47 (0..46) = +1.** The finding's
`lane_impact` calls its number "the first quantified v0.682 vs v0.717 parity measurement
this lane has" — which is precisely why an 8-wide error here is material rather than
cosmetic.

---

## What held, and how hard I pushed on it

I re-ran the underlying census myself wherever one existed. Claims that came back
**identical to the digit**:

| Claim | What I re-measured | Result |
|---|---|---|
| `provenance/extracted-sprites-and-shapes-are-web-v0717` | wrote my own zlib-inflate + SWF tag walker | 827 / 1822 / maxid 3641 web · 675 / 1557 / 2953 android — exact |
| `quests-story/outcome-id-is-a-22-opcode-director` | full `<outcome><id>` census | **all 28 ids and all 28 use-counts** matched (111×47, 120×14, 30017×13 …) |
| `quests-story/wave-enemy-count-correction` | parent-mapped `<enemy>` parse | 169 rows, child tags, lvl 2..35, x −400..2000, **sum(qty) 773** — exact |
| `questdata-critic/namegen-table-sizes-corrected` | split all five `.bin` tables | 398 / 291 / 33 / 36 / 677, first+last names — exact |
| `questdata/fatal-tag-census-correction` | `<fatal>` / `<friend>` census | 75 / 70 / 59-in-friend / 16-in-enemy, all `'0'` — exact |
| `quests-story/step-action-is-gameengine-action` | `<step><action>` histogram | 169 / 37 / 5 / 3 / 1 — exact |
| `quests-story/blank-choice-rows` | recursive path census | 469 choice / 469 goto / 465 text — exact |
| `questdata/count-corrections-to-packet` | NodeData tag histogram + exit deltas | 44 nodes, 535 ids, 16 named; −4096×19 / +4096×18 / ±1×19 under the door-property filter — exact |

Two verifications went further than the claim did:

**`questdata-critic/territory-sector-mapping-closed`** — I ported the LCG
(`seed*9301+49297 mod 233280`, one warm-up call) and both name arrays into Python and ran
the full four-stage chain myself:

```
TERRITORY (23,52) SECTOR (3,5)
  -> nodeid     ((23+341-21)*6+3)<<12 | ((52+341-51)*6+5) = 8443913
  -> territoryID  343<<12 | 342 = 1405270
  -> namex 343 % 137 = 69  (>= 26, so getTownName2)
  -> RNG(2810540) -> namestarting[..] + nameending[..] = "Chikada"
```

Landing on that exact string through four stages is not coincidence. Held.

**`quests-story/goto-index-semantics`** — I flattened the Chikako intro
(`questdata.xml:8687-8809`) under the claimed rule (option = 1 slot + one null per
choice; choice = 0 slots). Gotos **11 / 20 / 22 / 24 / 26 / 28** land on their intended
dialogue exactly; without the null padding every one is off by three. Held.

### THE FRAME WINS — `quests-story/dialogue-divergence-is-build-divergence`

This was the only A1 in the packet and the other agent's crops were gone, so I cut my own
from `reference/videos/zFtCaTO0_1M.mp4` (`crop=1400:360:0:700` upscaled to 2100×540) and
**looked**:

- **t=62**, nameplate `JINBEI`: *"IT'S NOT OFTEN WE MEET A NEW FACE ON THESE ROADS. IT'S
  THE BANDITS, YOU SEE. THEY'VE DRIVEN ALL THE HONEST FOLK AWAY."*
  `questdata.xml:128` reads *"Ah! A new face in this territory! My, it isn't often we see
  people walk this road alone, what with all the bandits infesting it..."* — same beat,
  different script.
- **t=68**, nameplate `GUEST`, two option rows: *"I'LL STAND MY GROUND AND ASK THEM TO
  LEAVE ME ALONE."* = `:149` **word for word**; *"THESE BANDITS DON'T SCARE ME!"* where
  `:153` reads *"They'll get nothing from me!"*.
- **t=76**, `JINBEI`: *"THAT'S TOO BAD, TRAVELER. IT REALLY IS..."* — my own
  `grep -n -i "too bad"` returns only `:4262`, `:19794`, `:24531`, all unrelated. **That
  shipped line exists in no build data we hold.**

**A measurement doc and a frame disagree, and the frame wins.** Saying so out loud, per
the standing invariant. One qualifier I add rather than refute on: what is *proven* is
that the shipped screen diverges from the Android-sourced questdata; whether the cause is
a recompiled script or a server-fetched one is inference. The consequence for L1 is the
same either way — "3,307 lines byte-exact" cannot be the done-criterion.

---

## Minor corrections logged against claims that held

None of these changes a verdict; all are worth banking so the next unit does not inherit them.

| Claim | Correction |
|---|---|
| `progression/web-anticheat-and-console-differ` | `consoleEnabled` is assigned at `shs3_android/StatsManager.as:496` (set false), **not `:586`** — `:586` is `toggleAutoAssignStats()`. `OverworldHUD.as:2715` is exact. |
| `progression/web-calcxp-parity` | calcXP is `§1t68s0§.as:185-211`, not `:180-202` (`:180` is still inside `zeroDifference`). |
| `progression/web-level-cap-is-const` | dead band is `:178-182`, not `:176-179`. And see new finding below — **Android never reassigns `levelCap` either.** |
| `progression/web-only-maxdueltokens-40` | android level-up write is `:1691`, not `:1690` (`:1690` is the AP refill). |
| `progression/spent-points-audit-second-witness` | quoted block is `:3453-3459`, not `:3450-3457`. |
| `progression/web-rebirth-gold-25-not-5` | block starts `:2643`, not `:2644`. |
| `quests-story/step-action-is-gameengine-action` | the file holds **225** `<step>`; 215 carry an explicit `<action>`, 10 omit it and inherit the parser default. |
| `questdata/count-corrections-to-packet` | its 4th sub-claim (40,135 words) is a method artifact — see new finding. |
| `rebirth/damage-packet-has-no-status-field` | field list runs to `:48` (`victimPosX`), not `:47`. |
| `rebirth/dan-zero-has-no-title` | web block starts `:532`; `case 0:` is `:534`, the blank assignment `:535`. |

All ten are line-number drift of one to five lines around text that is otherwise verbatim.
None is a fabricated cite.

---

## New findings (4)

1. **`provenance/web-projectilemanager-is-1t1712s0-not-1t112s0`** — the corrected identity
   and the true +1 delta (above). Also: add `§1t112s0§ = GameStage` to the obfuscation
   name map so the substitution is not repeated.
2. **`ui-hud/two-dan-title-renderers-romaji-and-kanji`** — the Dan rank ships **two**
   renderers side by side in both builds. `InventoryUI` paints the kanji ladder from the
   string table (456..464 + Renshi/Kyoshi/Hanshi); `PlayerPanel` paints a **hardcoded
   ASCII romaji ladder** — `"(nidan)"`, `"(sandan)"` … `"(judan)"` as AS3 literals, with
   only the shogo suffix fetched. Both blank the field at `STAT_DAN 0`, so this packet's
   four dan-0 claims are now confirmed across **four switch statements, two UIs, two builds**.
3. **`housekeeping/questdata-text-word-count-is-40119`** — 40,119 is the prose word count
   (itertext); 40,135 counts the 14 `<br/>` and 2 `<font>` markup tokens as words. The
   "correction" is the worse measurement.
4. **`progression/android-never-reassigns-levelcap-either`** — every `levelCap` reference
   in the Android tree is a read. The const-vs-var contrast is decorative; the conclusion
   (cap 80, `expArray[81..98]` dead) survives on the anti-cheat guard alone.

---

## Notes on the packet's overall quality

This is a strong packet. 46/48 held, and the failure mode in both refutations is the same
shape: **a correct measurement attached to the wrong object.** One compared a file with
itself and called it parity; the other compared a projectile enum to a background enum and
called it a delta. Neither was a fabricated cite — every line number in both was real,
which is exactly why the cite lens alone would have passed them and why the second half of
the job ("does the artifact *say* what the claim says it says") is the part that mattered.

Worth flagging for the scoring pass: the packet contains four near-duplicate dan-0 claims
(`dan-1-has-no-kanji`, `dan-zero-has-no-title`, `dan-zero-shows-no-title`,
`dan0-renders-no-kanji`), three near-duplicate outcome-namespace claims, two duplicate
loot-count claims and two duplicate Damage-field claims. All are correct; they should be
merged rather than counted as independent corroboration, since several rest on the *same*
`InventoryUI.as:2276` / `XMLQuestOutcome.as:50-77` lines.
