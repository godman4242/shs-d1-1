# Blind cite-lens review — packet `t1-overturns-02` (S26C)

**Packet size 7 · judged 7 · skipped 0 · refuted 0 · overturns upheld 5 of 7**

Every verdict below rests on an artifact I opened myself. Where I could not close a gap
from the artifact, I say STILL_UNHELD rather than guess.

---

## Headline

**I refuted nothing, and that is the honest answer.** This is the best-cited packet I have
seen in this lane: 34 of the 34 line ranges named across the seven findings land on the
exact lines claimed, and every verbatim quote is verbatim. Two findings even under-claim.

The two things I *did* find are corrections in the other direction:

1. **A frame closed the one open question in the packet.** Two findings hinge on the text of
   web string 960, which neither could resolve because the android v0.682 table has no such
   key. I opened a frame and read it: **`getString(960)` = "CANNOT CHANGE STANCE"**. The
   PARTIAL becomes HELD.
2. **The frame also overturns a measurement doc, and I say so out loud.** The video-study
   segment notes describe this HUD element wrongly, and `REBUILD_READINESS.md` inherited the
   error. **THE FRAME WINS.**

Two findings are TRUE but do **not** overturn the ledger sentence they name. I marked those
`overturn_upheld: false` and said why — a claim can be right and still not knock down the
thing it is pointed at.

---

## The frame that decided it

`reference/frames/session11/crit-focus/t1003.000.png`, 1920×1080, crop **(0,820)–(660,1080)**
upscaled **3× LANCZOS** (the HUD is small; I cropped before grading, per §0).

What is **visibly** in it: the player portrait in a red ring, then **three stacked bars** —

| slot | what the frame shows |
|---|---|
| 1 | green bar, white numerals **14/20** |
| 2 | blue bar, white numerals **31/31** |
| 3 | **empty track**, with **CANNOT CHANGE STANCE** in **pale grey** centred on it |
| below | **150% DAMAGE** in saturated **yellow** |

Now the same crop of `t1082.100.png` in the same session: green **11/20**, blue **31/47**,
and the third bar is **about 28% filled with NO text on it at all**.

Read that against `§1t113s0§.as:326-358`:

```
:328   var _loc3_:Number = (param1 - 48) / (param2 - 48);
:336-342   if(_loc3_ == 0) { ... htmlText = §1t5204s0§; visible = true; }
:343-346   else if(_loc3_ > 0 && _loc3_ < 1 && visible) { visible = false; }
:347-358   else if(_loc3_ >= 1) { Snd_criticalDamage; htmlText = §1t5203s0§; visible = true; }
```

and `:111  this.§1t5204s0§ = "<font color='#BBBBBB'>" + §1t1521s0§.getString(960) + "</font>";`

t1003 is the `ratio == 0` branch, photographed. t1082 is the hide branch, photographed. The
grey `#BBBBBB` is on screen. **String 960 is "CANNOT CHANGE STANCE"** — resolved by artifact,
not by inference.

I confirmed the field's owner rather than assume it: `§1t113s0§.as:117` sets a text field to
`getString(45)` = **'Hit Combo'**, so `§1t113s0§` is the battle HUD; and `§1t99s0§.as:256,
:1208, :3169, :3325` all call `§1t5205s0§(this.§1t4414s0§, this.§1t4415s0§)`, so the third
bar is the **reload meter against its max**.

### THE FRAME WINS — a measurement doc falls

`docs/research/video-study/segments/B-11-castle-gate-lever-puzzle.md:71` reads this slot as
*"the small green 'X/20' bar (stance-lock resource, label 'CANNOT CHANGE STANCE')"*, `:45`
has it fluctuating 4/20 → 2/20 → 3/20, `:7` calls the label *"Yellow text"*, and
`A-16-...:23` calls it a *"blue bar … 20/20"*.

The frame says otherwise. The label sits on a **separate, numeral-free third bar**; the
numeric bars are the green HP and the blue Chi **above** it; and the label is **pale grey**,
plainly not the saturated yellow of the `150% DAMAGE` line directly beneath it — the two are
side by side in the same crop, and the contrast is not subtle. The notes conflated the third
bar with the HP bar and the label's colour with the buff banner's.

**Standing invariant applied: when a measurement doc and a frame disagree, the frame wins.**
Do not port a "green X/20 stance-lock resource" into config. It does not exist.

---

## RR:158 dies on executable code, not on interpretation

Both stance findings argue the label is a readout rather than a lock. They are right, but
the ledger sentence falls on something blunter that neither cited:

```
§1t99s0§.as:3048-3051   §1t4470s0§() : return §1t4469s0§() && this.§1t4414s0§ >= 48;
§1t99s0§.as:3058-3081   §1t4472s0§() : if(reload < 48) return;
                                        -1 -> light, light -> balanced,
                                        balanced -> heavy, heavy -> light
```

Its **only two callers are in combat**: `§1t113s0§.as:468-479`, the battle HUD's own button
handler (`Snd_smallClick` on success, `Snd_error` on refusal, and it assigns
`§1t1523s0§.stance`), and `§1t1541s0§.as:607`, the **SPACE** key.

In-combat stance cycling is **live shipped code in web v0.717**. RR:158's "removed 2014
behavior" is backwards: the recreation's Focus-gated switch *is* the original. The matching
`[CONTRACT]` rows at `docs/research/SHSD_MASTER_REFERENCE.md:388` and `:2099` rest on the
same false premise and should fall with it.

---

## Verdicts

### 1. `rebirth/reach-dan-10-is-a-shipped-achievement-string` — **NOT REFUTED**, overturn upheld

citelint flagged `QUOTE_UNVERIFIED` only because the quote is an **ID lookup**, not literal
file text — exactly the failure mode §0 warns about in the other direction. I opened
`strings.json` myself: `["8121"]='Reach Dan 2.'`, `["8122"]='Reach Dan 3.'`,
`["8123"]='Reach Dan 6.'`, `["8124"]='Reach Dan 10.'` — all four verbatim.

`§1t1523s0§.as:2644-2659` is exactly the rebirth block, and I resolved the opaque stat ids
rather than take them on trust:

- `:228  internal static const §1t9413s0§:int = 12;` and `:2865  currentHGold = §1t7356s0§(§1t9413s0§);` → 9413 is **heavenly gold**
- `:254  internal static const §1t9426s0§:int = 25;` → 9426 is **DAN**, displayed as stat+1 at `:2659`
- `:2644  if(§1t7356s0§(§1t9426s0§) == 8)` → `:2646  §1t9713s0§(§1t9413s0§,100);` and `:2647` announces the literal `"10"`
- `:2651  §1t9713s0§(§1t9413s0§,25);` otherwise · `:2653  if(§1t7356s0§(§1t9426s0§) < 9)`

**Overturn upheld, and harder than claimed.** RR:164-165 says *"film shows a flat +25 gold
every rebirth, no 10th-rebirth tier."* The web build has exactly that tier and pays exactly
100. `MAX_DAN_RANK=10` and `tenthGold=100` are **CONTRACT**.

*Build note:* the strings are android v0.682, but the web code carries the literal `"10"` and
the literal `100` on its own, so the overturn does not lean on the android table.

### 2. `skills-meters/stance-mastery-ceiling-is-10-not-9` — **NOT REFUTED**, overturn upheld

`:3262` and `:3265` are verbatim. I checked the variable identities instead of assuming:
`:3221-3241` branch on `this.stance` and pair `§1t12220s0§`↔`§1t4421s0§`,
`§1t12221s0§`↔`§1t4422s0§`, `§1t12222s0§`↔`§1t4423s0§`. Arithmetic: `0.5+0.04m` → **0.86 at
m=9, exactly 0.90 at m=10**; `1+0.02m` → **1.18 at m=9, exactly 1.20 at m=10**.

I added a third artifact the finding did not use: `reference/extracted/skilldata.xml` gives
skills 1000/1001/1002 **exactly ten `<level>` rows each, max `<value>10`**. The ceiling is 10
by data, not only by achievement copy. RR:155's "MASTERY-9 CEILING" is wrong on the number.

### 3. `ui-hud/cannot-change-stance-is-the-reload-meter-low-end-readout` — **NOT REFUTED**, overturn upheld (fatal to RR:158)

Cite resolves line for line. The one thing it had to infer — that the on-screen label *is*
string 960 — I closed with the frame above. Upgraded from a strong inference to an artifact.

### 4. `ui-hud/nameplate-level-suffix-is-gated-on-level-greater-than-zero-web-only` — **NOT REFUTED**, but **overturn NOT upheld**

The evidence is impeccable — the most precisely cited finding in the packet. All four web
if/else sites land exactly (`:92-99`, `:802-809`, `:915-921`, `:1416-1422`) and the headline
quote is verbatim to the character. Android `EnemyPlayer.as:84, :776, :881` are bare
`setDisplayName` calls with **no else**. `§1t8638s0§.as:79-86` and `Obj_NPCAggro.as:74-81`
both carry the `lvl == 0` split with namecolor `10027008` (0x990000, the red plate) in
**both** builds. And `:1763-1766` really is a **spectator** predicate, not a level predicate —
the finding was right to flag that.

**But the overturn does not land.** RR:219 says `nameplate (N)=level`. That is an *identity*
claim and it is **true** — the parenthetical N is the level. The finding adds a **gate** to
it; it does not falsify it. This is an enrichment, not an overturn. It should enter the
ledger as the refined rule

```
suffix = level > 0 && !spectator ? " (" + level + ")" : ""
```

with RR:219 left standing. Marked `severity: minor` for that reason and no other.

### 5. `ui-hud/the-cannot-change-stance-label-is-the-focus-gate-readout` — **NOT REFUTED**, overturn upheld

An honest **PARTIAL** that earns its hedge: it declares its own gap ("string 960 … I cannot
resolve to text") instead of papering over it. That is the correct posture, and over-refuting
it would itself be the failure §0 warns about. Its cites resolve exactly. I upgraded it
twice — the frame resolves 960, and `§1t4472s0§` kills RR:158 outright. **PARTIAL → HELD.**

### 6. `world-exploration/farm-yield-and-whiff-are-on-disk-too` — **NOT REFUTED**, but **overturn NOT upheld (scope only)**

Every line exact: `:607` the whiff gate verbatim, `:609-610` the patchlevel/dice roll,
`:613  addLootItemBasic(2115,1)`, `:55  internal var gracePeriod:int = 900;`, and case 4 at
`:160-169` really does carry only PLANTED/READYFORHARVEST with **no ROTTED branch**, unlike
the case immediately above it. `skilldata.xml:755` is `<id>1020</id>`, resolved to displayname
**'Farming'**, desc *"Train to improve your abilities as a farmer."* — so `1/(10 - farmingLevel)`
is right.

I checked the one thing that could have made the whole ladder dead code, which the finding did
not mention: **`:589  var dice:int = 0;`**. `dice = Math.random() * patchlevel` therefore
**truncates to an integer** in `[0, patchlevel-1]`, so the `dice == 0..5` chain is live and
not a float comparison that never fires. `:457-479` confirms `getPatchLevel` is a six-rank
ladder at 10/20/30/40/50 harvests.

**Overturn not upheld, on scope alone.** RR:225 blocker ② reads *"gather/mine/farm yield +
whiff + respawn tables."* This closes the **farm** third **outright** — yield, whiff and
timers. The gather and mine thirds rest on sibling findings that were **not in my packet**,
so I cannot verify them and will not take them on another agent's word (§3.2). The finding's
own `text` is scrupulous about this; its `lane_impact` is the part that overreaches.

### 7. `world/war-map-renders-at-10px-per-territory` — **NOT REFUTED**, overturn upheld

Everything checkable checks out:

- `md5 reference/extracted/bindata/92_1t4648s0.bin` = **13068dfa1a5cc5628720a25782f93fed** — exactly as quoted
- PIL: format **GIF**, size **(63, 72)**, RGB census **735 white / 3801 black** (= 4536 px) — the 735 land pixels are real
- `WarSelectUI.as:15/:17/:19` = `WARMARKERSHIFTX:int = 8`, `TERRSHIFTX:int = 21`, `TERRSHIFTY:int = 51`
- `:233-234` and `:253-254` verbatim

I closed two things the finding left open:

**(a) The GIF really is the war board's own bitmap, not a lookalike.**
`WarSelectUI.as:153  this.mapBitmapData = QuestEngine.getMapBitmapData();` and
`Mobile_MapBitmapData.as:5  [Embed(source="/_assets/110_Mobile_MapBitmapData.bin", …)]`, whose
md5 is the **same** `13068dfa1a5cc5628720a25782f93fed`. The game names the file's role.

**(b) The build-parity hole is closed on the WEB side.** The real web twin carries
`TERRSHIFTX = 21` at `§1t7934s0§.as:17`, `TERRSHIFTY = 51` at `:19`, and the identical pitch
at `:299-300`:

```
:299   _loc11_.x = (_loc8_ + §1t12536s0§) * 10 + 4.5;
:300   _loc11_.y = (_loc9_ + §1t12537s0§) * 10 + 8.8;
```

**Overturn upheld.** RR:225 blocker ① prescribes *"mine Fandom Category:Territories via API;
trace the map image"* and calls the world *"not a W×H grid"*. It **is** a 63×72 grid with 735
land cells, shipped in the payload, at a 10 px pitch, **in both builds**. No Fandom, no
tracing.

*One minor error, not in the cite field:* the `build` note calls the web twin `§1t1524s0§` —
that file has none of these constants; `§1t7934s0§` does. The substantive half of the note
("the shift constants are identical") is correct, and I verified it independently.

---

## New findings (6) — see the JSON for full cites

| id | class | what |
|---|---|---|
| `ui-hud/string-960-is-cannot-change-stance-frame-resolved` | **A1** | The frame resolves the web-only string 960. Closes the packet's only PARTIAL. |
| `ui-hud/the-video-study-notes-misread-the-cannot-change-stance-slot` | **A1** | **THE FRAME WINS** over `B-11:7,:45,:71` and `A-16:23`. There is no "green X/20 stance-lock resource". |
| `combat-core/in-combat-stance-cycling-is-live-code-in-v0717` | A2 | `§1t4472s0§` is a live in-combat stance cycler. Kills RR:158 and `SHSD_MASTER_REFERENCE.md:388, :2099`. |
| `world/the-war-map-mask-is-byte-identical-across-web-and-android` | A2 | Web bindata 92 ≡ android blob 110 by md5. A **non-circular** parity datum — C2's warning does not apply, because 92 is web-side. |
| `skills-meters/heavy-stance-damage-is-flat-and-only-heavy-reach-scales` | A2 | RR:155 packs two formulas into one sentence and pairs them backwards. Heavy **damage** is flat ×1.4; **light reach** is the flat one; heavy reach has a hard floor of 100. |
| `strings/the-android-lang-table-skips-ids-881-999-entirely` | A2 | Evidence hygiene: "id absent from `strings.json`" ⇏ "v0.717 addition". Ids **881–999 are a 119-id block gap**; there are 20 such gaps. |

The last one is worth a line on its own. Two findings in this packet inferred *"v0.717
addition"* from string 960's absence. Parsing the raw UTF-16LE XLIFF in
`reference/extracted/android/118_Mobile_Lang_EN.bin` gives 2555 trans-unit ids, and in
850–1010 they run `850…865, 867…880`, then jump straight to `1000`. The inference is harmless
here — the frame resolved 960 directly — but it is **unsound as a rule** and should not be
reused. It is the same family of false-negative trap as correction **C1**, one layer up.

---

## What I did not establish

- The heavy-stance **reach base** `§1t4420s0§`. RR:155's reach triple `300/200/100` is not
  reproducible from these multipliers at any single base I tried. **STILL_UNHELD.**
- Whether `startingIndex + 2 == 1` in `InteractUI_crops.as:607` is literally "the first
  harvest" depends on when the counter increments, which I did not trace. **STILL_UNHELD.**
- The **gather** and **mine** thirds of RR:225 ②. Not in my packet; I will not take them from
  another agent's summary (§3.2). **STILL_UNHELD by me.**
