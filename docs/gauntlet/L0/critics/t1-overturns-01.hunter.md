# t1-overturns-01 — HUNTER LENS review (blind critic)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-01.json` — **24 findings, 24 judged, 0 skipped.**

> **NOTE — THE PACKET WAS RE-SLICED MID-REVIEW.** The file changed on disk while I was
> writing. Still 24 items, but six `android-blobs-hunter/*` findings rotated **in** and six
> `combat-core/*` findings rotated **out** (`stance-reach-modifiers`, `v0717-crit-is-flat-1.3`,
> `v0717-stance-curves-are-already-in-config`, `v0717-stance-multipliers`,
> `v0717-stance-slash-multipliers`, `v0717-stance-table`). **I judged all six new arrivals from
> scratch (§B below) AND I am keeping the six rulings I had already finished (§C), so nothing is
> destroyed.** My structured `verdicts` array covers the 24 ids in the packet as it now stands.
Every verdict below rests on an artifact **I opened myself**. Where I only re-read another
agent's cite I say so; where I re-ran the byte-check I paste the output.

---

## ⛔ FIRST, THE THING THAT OVERTURNS THE GAUNTLET'S OWN LAW

**S0-5 IS FALSE. THE AUDIO IS RECOVERED, NOT MERELY HELD-BUT-ENCRYPTED.**

S0-5 says *"audio is HELD but ENCRYPTED (nested 'CWS' SWFs ffdec cannot open). You may NOT
claim audio is recovered."* Its stated basis — that ffdec cannot open them — is true and
irrelevant. I ran the game's own decryptor and it opened them on the first try:

```
=== 113_Mobile_MusicResource.bin 1340647 bytes; raw head: 43 57 53 64 48 12 60 75
  after decode head: 43 57 53 11 3d 67 15 00 sig b'CWS' ver 17 declen 1402685
  INFLATES -> 1402685 (body 1402677 )
=== 122_Mobile_SoundResource.bin 23928 bytes; raw head: 43 57 53 7e d0 1c 6f 6f
  after decode head: 43 57 53 11 bf 73 00 00 sig b'CWS' ver 17 declen 29631
  INFLATES -> 29631 (body 29623 )
```

Both are ordinary SWFs holding **13 `DefineSound` MP3 tags each, 11 025 Hz / 16-bit / mono**,
with `SymbolClass` names attached. I extracted two and ffprobe agrees:

```
122 SFX  : deflect die1 die2 die3 slash1 slash2 slash3 punch hitmetal fart goodkoto sumo refund
113 MUSIC: bgm_lose bgm_levelup bgm_gangnam flutes battledrums battlechants
           safeambience safekoto safepercussion
           dungeonambience dungeonflute dungeonpercussion dungeonpiano
$ ffprobe slash1.mp3      -> format_name=mp3 duration=0.572000 bit_rate=16000
$ ffprobe battledrums.mp3 -> format_name=mp3 duration=79.872000 bit_rate=16000
```

**Per the STANDING INVARIANT I say it out loud: the byte-check beats the doc.** S0-5 should be
struck and every claim previously refuted under it re-opened.

**But keep the caveat S0-5 should have carried instead:** these are the **ANDROID v0.682**
resource blobs. `reference/preservation/` holds only `shs3.swf`, `shs3preloader.swf`,
`shs3_payload.swf`, `shs3_android_payload.swf` — **no `soundresource.swf` / `musicresource.swf`.**
The web build fetched those from the dead CDN (`ResourceManager.as:41`). Web-audio *waveform*
parity is NOT established. The *architecture* is (see NF-1).

---

# §A — THE FIRST SLICE (18 of these are still in the packet; 6 rotated out — see §C)

⚠️ The `#` column below is the **original** packet order, not the current one. Ids are stable;
use those. The six rows numbered 18, 19, 20, 21, 22, 23 are the ones that rotated out.

## THE OVERTURN CHECK — the scoreboard

19 of the 23 findings that claim an overturn are TRUE. Only **12** actually falsify the
REBUILD_READINESS.md sentence they point at.

| # | id | claim true? | overturn upheld? |
|---|---|---|---|
| 0 | NEW-3 full XP curve | ✅ | ✅ **fatal to blocker ② + §6** |
| 1 | NEW-4 paperdoll 13 slots | ✅ | ✅ |
| 2 | NEW-6 Shunpo effect | ✅ | ✅ |
| 3 | 24Hz killbeat web parity | ✅ | ❌ *targets a sentence its own evidence confirms* |
| 4 | animdata hold table | ✅ (I re-measured 487/487) | ❌ *orthogonal to "15fps"* |
| 5 | music 13 stems / 18 presets | ✅ (+ upgraded to BOTH builds) | ✅ |
| 6 | SWF header 24fps + 800×690 | ✅ (I re-parsed) | ⚠️ **half** — 800×480 SURVIVES |
| 7 | ResourceManager decrypt | ✅ (I re-ran) | ✅ **fatal, + kills S0-5** |
| 8 | audio waveforms recovered | ✅ (ffprobe reproduced exactly) | ✅ **fatal** |
| 9 | music is layered stems | ✅ | ✅ |
| 10 | reach/crit configs correct | ✅ | ❌ **its ledger_text IS NOT IN THE LEDGER** |
| 11 | reach table is mastery-zero | ✅ | ✅ (reach half of L155) |
| 12 | ditto + base formula | ✅ | ✅ (reach half of L155) |
| 13 | reach.ts was right | ✅ | ✅ (the "mastery-9" clause of L100-101) |
| 14 | slash distance player-visible | ✅ facts | ❌ *re-opens an already-closed placeholder trap* |
| 15 | dmg ceiling is mastery-10 | ✅ | ❌ *one-word fix, the sentence is CONFIRMED* |
| 16 | stance modifier table | ✅ | ✅ (SPD half) — **but its crit column is unsafe** |
| 17 | stance reach mastery-zero base | ✅ | ✅ (reach half of L155) |
| 18 | stance reach modifiers | ✅ | ✅ **fatal to combat-core blocker ①** |
| 19 | v0717 crit flat 1.3 | ✅ | ✅ |
| 20 | curves already in config | ✅ | ✅ (redundant with 13) |
| 21 | v0717 stance multipliers | ✅ core | n/a (`overturns_ledger=false`) — **but one clause is false** |
| 22 | v0717 slash multipliers | ✅ | ✅ (reach half) — **but its negative grep is false** |
| 23 | v0717 stance table | ✅ | ❌ *its own lane_impact says it CONFIRMS the sentence* |

---

## FINDING-BY-FINDING

### 0 · NEW-3-full-xp-curve-is-shipped-in-both-builds — **HELD, overturn UPHELD (fatal)**
`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364` is real and I parsed it:
```
web    §1t1523s0§.as:364  len=99 idx10=31400 idx80=4285800 last=29395800 lastidx=98
android StatsManager.as:78 len=99 idx10=31400 idx80=4285800 last=29395800 lastidx=98
```
Identical 99-entry arrays in two independent bundles; index 10 = 31 400 matches the ledger's own
L1–L10 caps (line 77); level cap 80 is stamped beside it (`§1t1523s0§.as:362 = 80`,
`StatsManager.as:76 levelCap = 80`). **REBUILD_READINESS.md:200 blocker ② and :350 are both
false.** Delete the INFERRED extrapolation; paste index 0–80. The citelint `QUOTE_NOT_LOCATED`
flag is a false alarm — the quote is the line, elided with "…".
This is the single largest un-banked win in the packet.

### 1 · NEW-4-paperdoll-is-13-slots-not-9 — **HELD, overturn UPHELD**
`StatsManager.as:262-286` reads exactly as quoted (EQ_ARMOR 0 … EQ_ACCESSORY2 12).
**I added the WEB half the finding lacked:** `§1t76s0§.as:38` carries the identical
`"4017|0|6019|0|8005|0|0|11017|12017|13002|13002|0|0"` (13 pipe-separated fields) and
`§1t1523s0§.as:132` allocates `new Vector.<§1t17s0§>(13)`. `npcdata.xml`'s `<mcs>` blocks use
twelve of them — I histogrammed all 495: `armor 479 · gloves 58 · hair 462 · hat 287 · head 115 ·
mask 131 · neck 29 · pants 489 · shoes 472 · weapon 470 · prop1 217 · prop2 1`. **"9-slot
paperdoll" at :82 and :209 is wrong in both places.**

### 2 · NEW-6-shunpo-effect-recovered — **HELD, overturn UPHELD**
Traced end-to-end rather than trusting the index: `skilldata.xml` skill 1039 →
`<displayname>6082</displayname><desc>6085</desc>`, and `strings.json["6082"]='Shunpo'`,
`["6085"]='Ultimate Light Stance technique. \n\nHold down the skill icon to increase the damage
it inflicts…'`. Also `<req><has><id>1000</id><qty>10</qty></has></req>`, `<chi>50</chi>`,
`<cooldown>60</cooldown>` — so it is gated on **Light Stance Mastery 10** (skill 1000, ten
`<level>` rows). Blocker ② at :195 closes, and the ledger's own suspicion (slowmo = SHS2) is
vindicated rather than overturned.

⚠️ **Its `build` line over-claims:** *"skilldata row ids identical in the web payload"* is not
checkable — the web payload has **no skilldata at all** (see NF-6). **But I found a stronger
substitute the finding didn't have:** web `§1t120s0§.as:54 §1t10146s0§:int = 1039` (same class,
same line as android `SkillManager.as:54 SKILL_SHUNPO = 1039`), and web `§1t113s0§.as:704, :743,
:777` group 1039 with the charge/hold skills exactly as android `BattleUI.as:571, :610, :644`.
**So the id and the hold-to-charge mechanic ARE web-confirmed; only the display copy is android.**

### 3 · NEW-24hz-killbeat-is-web-parity-closed — **HELD, overturn NOT upheld**
The four web lines are exactly as quoted and line-for-line match the android:
```
web §1t1525s0§.as:1026 if(§1t9905s0§ == 24 * 5)      | android StageManager.as:903  if(redFreezeCounter == 24 * 5)
web                :1049 else if(§1t9905s0§ == 24*3)  | android              :926  else if(redFreezeCounter == 24 * 3)
web                :1225 §1t9905s0§ = 24 * 3 + 6;     | android              :1096 redFreezeCounter = 24 * 3 + 6;
web                :1230 §1t9905s0§ = 24 * 6;         | android              :1101 redFreezeCounter = 24 * 6;
```
**But it points at the art-anim "Ready (strongest slice)" list at :239 — and that list ENDS with
"kill-beat".** The evidence *confirms* the sentence's own item. And a bare multiplier of `24` is
not a frame-rate proof; nothing here makes "15fps pose latch / gaits / slash frames /
hit-stagger / death collapse / proportions / combat-crouch idle" false. The 24 Hz proof belongs
to finding 6 (SWF header) plus android `Mobile.as:117 GameEngine.getStageMC().frameRate = 24`.
File this as **web-parity corroboration of an existing Ready item**, not an overturn.

### 4 · animdata-code-injected-hold-table — **HELD (strongest new SPEC in the packet), overturn NOT upheld**
Every cite is exact: `AnimData.as:15` `this.duration = xml.@d;`, `:23-141` the
`switch(xml.@i.toString())` tail table (13 `*SLASH_POSE` +10 · 10 `*FALLSLASH_END`/`*JUMPSLASH_LAND`
+15 · `sheathesword`/`sheathesword3` +24 · six death anims + `KNEEGROIN_VICTIM` +6 ·
`ogre_nap1_mid` +48 · `DEATHTOUCH_PARTA` +50 …), `MCSCharacter.as:1316` and `:1334` verbatim.

**I re-measured the load-bearing claim myself** over the 19 WEB animdata blobs in
`reference/extracted/bindata/`:
```
total <anim> rows in animdata blobs: 487 · with @d == count(<f>): 487 · mismatches: 0
```
**And I found the WEB twin of the table the finding didn't cite:**
`reference/decompiled/shs3_payload/scripts/§1t783s0§.as:17` (`this.duration = param1.@d;`) and
`:27-146` — the same tail groups (+10 ×13, +15 ×10, +24 sheathesword pair, +6 death set, +48, +50…).
The web version even states the latch more cleanly at `§1t783s0§.as:149-156`: the frame getter
**clamps** `if(param1 >= §1t787s0§) param1 = §1t787s0§ - 1`. So this is a **both-builds** fact.

**Overturn not upheld:** the sentence's "15fps pose latch" is a *step-rate* claim; a hold-tail
table is a *terminal-hold* claim. They are orthogonal — you can have both. Nothing in this cite
sets a Hz. **Bank this as a NEW ledger row (the pose-latch spec the ledger asserts but does not
contain), not as an overturn.**

### 5 · music-is-13-stems-and-18-layer-presets — **HELD, overturn UPHELD**
`MusicManager.as:50-76` gives TRACK_BATTLECHANTS 0 … TRACK_LOSE 12, `TOTALTRACKS = 13`;
`:133-186` builds 18 boolean layer masks; `ACTION_FADEIN/FADEOUT` at `:78-82`. All four sampled
presets are verbatim right (TOUGHBATTLE = flutes+battledrums+battlechants; DOJO = flutes+
safeambience+safekoto+safepercussion; DUNGEONCREEPYDANGER = the four dungeon stems; QUIET = flutes
alone). The 13 TRACK_* names map 1:1 onto the 13 `DefineSound` names I extracted.
**Upgrade (NF-1): this is BOTH BUILDS, not android-only** — web `§1t133s0§.as:115-127` loads the
same 13 stem names in the same order, `:76 §1t1730s0§:int = 13`, and `grep -c "= new
Array(this.§1t1730s0§)" → 18`.

### 6 · web-swf-header-is-24fps-and-800x690 — **HELD, overturn HALF upheld (material)**
I re-parsed both headers with my own RECT bit-reader:
```
shs3_payload_decoded.swf         sig CWS ver 17 stage 800.0 x 690.0 framerate 24.0 framecount 6
shs3_android_payload_decoded.swf sig CWS ver 26 stage 800.0 x 480.0 framerate 24.0 framecount 6
```
**UPHELD half — "15fps pose latch" falls.** frameRate is 24.0 in both, android `Mobile.as:117`
hard-sets `frameRate = 24`, and `MCSCharacter.updateAnimation` advances exactly one `frameList`
entry per call. A 15 fps *game* clock is not in the build. (The project's own
`DIVERGENCES.md:333` already notes the longplays carry "~15 fps of unique content in a 60 fps
container" — i.e. a **capture** rate. 60/24 = 2.5 would give a 2-3-2-3 pattern, not the exact
4-duplicate blocks that were measured; 15 unique fps is the recorder, not the game.)

**NOT UPHELD half — "native canvas is 800×480 (5:3)" SURVIVES INTACT.** 800×690 is the
**friend-bar layout**, and the web payload says so itself:
```
web §1t1540s0§.as:271-273   _loc2_ = 800;  _loc3_ = 480;  _loc4_ = 690;
android GameEngine.as:269-271  originalWidth = 800;  originalHeight = 480;  originalHeightWithBar = 690;
web §1t1523s0§.as:104,106   stageWidth:int = 800;  stageHeight:int = 480;
```
Line-for-line the same resize handler, with a `stageShowingFriendBar` flag. So the lane_impact's
*"Any recreation … assuming a single 800x480 canvas is wrong"* over-reaches: the native **game**
canvas is 800×480; 690 is 480 + a 210 px social bar. Ledger line 117 stands; what is genuinely
new is that a **second layout mode** exists.

### 7 · RECOVERED-not-encrypted-resourcemanager-decrypt — **HELD, overturn UPHELD (fatal). KILLS S0-5.**
`ResourceManager.as:200-216` is the quoted routine verbatim (`for(i=3; i<256)`, `if(i % 11 == 0)`
swap `ba[i] ↔ ba[i+256]`, then `ba[i] ^= key`); `:186 key = resourceFileNameArray[num].charCodeAt(1)`;
`:41` the five filenames ⇒ keys h=104 u=117 o=111 m=109 g=103. **I ran it.** Output pasted at the
top of this file: 26 byte-exact MP3s. Ledger :240 blocker ① and :348 both fall — the exact
waveforms are not "not study-able", they are in hand. The listen-pass plan at :323-324 is
superseded for these 26 assets.
**Caveat that must ride with the overturn:** android v0.682 only; study-only/local-only under
`docs/OWNER_PERMISSION_RULING.md`; no web `soundresource.swf`/`musicresource.swf` is held.

### 8 · NEW-audio-waveforms-are-recovered-not-encrypted — **HELD, overturn UPHELD (fatal)**
Every number in the quote reproduced exactly on my run: `113 k=117 ver 17 declen 1402685 actual
1340647 INFLATES -> 1402677`; `122 k=111 ver 17 declen 29631 actual 23928 INFLATES -> 29623`;
13+13 `DefineSound`; and the two ffprobe lines to the microsecond (`0.572000`, `79.872000`,
`bit_rate=16000`). The self-derivation `key = byte[3] XOR 0x11` checks out (`0x64^0x11=117`,
`0x7e^0x11=111`) because every blob is CWS v17. `reference/tools/payload_decode.py:22-29` is the
committed transform. **REBUILD_READINESS.md:348 falls.** The finding's own "byte-check beats the
doc" call is correct and I second it.

### 9 · NEW-music-is-layered-stems-not-tracks — **HELD, overturn UPHELD**
My extraction, independently:
```
882144 samples (79.872 s): battlechants battledrums flutes safeambience safekoto safepercussion
504288 samples (45.740 s): dungeonambience dungeonflute dungeonpercussion dungeonpiano
one-shots: bgm_lose 38880 · bgm_levelup 328320 · bgm_gangnam 40032
```
Exactly the finding's table. Identical sample counts within a family is the signature of co-mixed
layers, and `MusicManager` selects between them by boolean mask. Ledger :240 blocker ① falls, and
the finding is right that **no ledger system holds a layered-music model**. Also both builds (NF-1).

### 10 · reach-and-crit-configs-already-correct — **HELD on the facts, overturn REFUSED (fatal mis-target)**
The facts are right and I checked all of them: `§1t99s0§.as:3094 * 1.4`, `:3105 * (1 + 0.2 * m *
0.1)`, `:3116-3119 * (0.5 + 0.4 * m * 0.1)` with `if(… < 100) { … = 100; }`, `:3274 return _loc2_
* 1.3 + this.§1t1243s0§;` — against `src/config/reach.ts` (`lightMult: 1.4`,
`balancedPerMastery: 0.02`, `heavyBase: 0.5`, `heavyPerMastery: 0.04`, `heavyFloor: 100`) and
`src/config/combat.ts:17 export const CRIT_MULT = 1.3;`. The DO-NOT-TOUCH ruling is correct.

**But its `ledger_text` is not a REBUILD_READINESS.md sentence.**
```
$ grep -n "three live constants\|are WRONG against the source" docs/research/REBUILD_READINESS.md
(no output)
```
It is another agent's survey prose. This finding **cannot rewrite the ledger** because the
sentence it names is not in it. Filed as an overturn it would corrupt the tally.

⚠️ **Do not act on its lane_impact prescription.** *"Only stances.ts LAUNCH_UNLOCK_LEVEL.heavy
(5, source 3 in both builds) is a genuine live bug"* — I could not find that source. The nearest
`3` is `MCSPlayer.as:3501 if(!(damageObj.stance == -1 && this.launchCount >= 3))`, which is a
**juggle-count cap**, not an unlock level. `src/config/stances.ts:57` labels
`LAUNCH_UNLOCK_LEVEL` **INFERRED**. Leave it alone until someone produces a real cite.

### 11 · reach-table-is-mastery-zero — **HELD, overturn UPHELD**
### 12 · reach-table-is-mastery-zero-not-a-ceiling — **HELD, overturn UPHELD**
### 17 · stance-reach-is-mastery-zero-base — **HELD, overturn UPHELD**
Judged together because they make one argument. Everything checks out:
```
web  §1t1523s0§.as:2344-2348   _loc2_ = 90 + §1t7356s0§(§1t9426s0§) * 5;
                               return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));
android StatsManager.as:1915-1919  getBaseSlashLengthVal(speed) — identical, with STAT_DAN
```
Base asymptotes to **210 px at Dan 0**. Mastery-0 stance multipliers 1.4 / 1.0 / 0.5 give
**294 / 210 / 105**; mastery-10 gives **294 / 252 / 189**; mastery-9 gives **294 / 248 / 181**.

**The negative half of the claim is airtight and decisive on its own, two ways:**
1. Light reach is a bare `* 1.4` with **no mastery variable in the expression** (`:3094`). A
   constant cannot be a mastery-9 *ceiling* distinct from its own base.
2. Heavy's 100 is a **FLOOR** (`:3117-3119 if(… < 100) { … = 100; }`) — a minimum. Calling a
   floor a "ceiling" is backwards. And the ledger's *own next clause* (:156) already concedes
   "Heavy's *reach* also scales ×0.5→×0.9", which is incompatible with a 3:2:1 mastery-9 reach.

**So the reach half of REBUILD_READINESS.md:155 is FALSE and the remediation at :320 ("relabel
mastery-9") is backwards for reach.** Overturn upheld for all three.

⚠️ **One caveat the three findings share, which I am adding, not deducting for.** The *positive*
mapping ("300/200/100 IS the mastery-0 reading") is weaker than the negative one, because the
repo's own fidelity ledger warns the wiki's **200 may be a static initialiser**:
`docs/research/fidelity/SOURCE_CONSTANTS.md:37-40` names `maxDistance = 200` as "almost certainly
the origin of the wiki's 'Balanced reach = 200'". I verified it exists:
`InputManager.as:51 internal static var maxDistance:int = 200;`, overwritten on every `setStance`
(`:108`). Write the ledger fix as **"not a mastery-9 ceiling; reach is a formula"**, not as
"300/200/100 = mastery-0".

⚠️ Small error in **17**: *"210 × 0.5 = 105, clamped to 100"* — 105 is **above** the 100 floor, so
it is not clamped. The point survives; the gloss does not.

### 13 · reach-ts-was-right — **HELD, overturn UPHELD**
### 20 · v0717-stance-curves-are-already-in-config — **HELD, overturn UPHELD (redundant with 13)**
Both cite the same verified lines, plus `§1t99s0§.as:3258-3271` (damage) which I read at
`:3262 _loc2_ = _loc1_ * (0.5 + 0.4 * §1t4421s0§ * 0.1)`, `:3265 * (1 + 0.2 * §1t4422s0§ * 0.1)`,
`:3270 * 1.4`. The **v0.717 build stamp is real**: `§1t1523s0§.as:36 public static var
§1t9323s0§:Number = 0.717;` (android's twin: `StatsManager.as:30 clientVersion:Number = 0.682`).
Ledger :100-101's "**mastery-9** values" clause is false for the same reason as 11/12/17 →
overturn upheld. Note the sentence is doubly stale: `src/config/stances.ts:19-26` records that
`STANCE_TABLE`'s `reach` **and** `dmgMult` "HAVE BEEN REMOVED", so it no longer "carries reach
300/200/120" at all.
**These two plus 10 are three findings on one pair of lines — one ledger edit, not three.**
Also note `docs/research/fidelity/SOURCE_CONSTANTS.md:191-206` already prints this exact formula
and mastery table, and REBUILD_READINESS.md:11-14's own precedence clause says the fidelity
ledgers win over it. So the "overturn" is really "the ledger never absorbed a ruling that already
outranked it."

### 14 · slash-distance-is-player-visible — **HELD on the facts, overturn REFUSED (material)**
Both cites are verbatim right, and I went further: `slash distance: 345 (heavy)` really is in the
**WEB** payload — I streamed all 329 MB of `reference/extracted/payload.xml` and found it once, in
an `Edo SZ` `DefineEditText` block sitting beside `skill cooldown modifier: 0.75`.

**But the "open conflict" it opens is already closed, and closed by name.**
`docs/research/fidelity/SOURCE_CONSTANTS.md:31-36`:
> **⚠️ Two placeholder traps caught this session** … 1. **Static UI mockup text.** The payload
> contains Flash-IDE dummy strings: `slash distance: 345 (heavy)` · `physical dmg: 1234 - 1235` ·
> `hp: 123 / 123` · `chi: 123 / 434`. A naive read hands you "Balanced reach = 345". **Nothing
> sourced from a static text field is admissible.**

Its neighbours give it away: `1234 - 1235`, `123 / 123`, `123 / 434`. This is designer dummy text,
tagged `PLACEHOLDER` under that file's §0 — *"NO — never a value"*. The finding's own instinct
("Do NOT treat 345 as measured") is right, but framing it as an unresolved discrepancy re-opens
exactly the trap SOURCE_CONSTANTS §0 was written to prevent.
**Overturn refused:** combat-core blocker ① asks for a *number*; this finding supplies a label and
declines to supply a number. Finding 18 is what closes ①.

### 15 · stance-damage-mastery10-ceiling — **HELD, overturn REFUSED (material)**
`§1t99s0§.as:3255-3276` is verbatim as quoted; `skilldata.xml` skills 1000/1001/1002 have exactly
10 `<level>` rows each and resolve to "Light/Balanced/Heavy Stance Mastery". So the ceiling is
mastery **10** and the ledger's "mastery-9" is off by one. All true.

**But that does not falsify the sentence it names.** REBUILD_READINESS.md:155-156 says the tables
are *"CEILING values, not base"* and that *"A level-1 Shugyosha does Light ×0.5 / Balanced ×1.0 /
Heavy ×1.4 (Heavy is fixed)"*. The code says **exactly that**: at m=0, `0.5 + 0.4·0·0.1 = 0.5`,
`1 + 0.2·0·0.1 = 1.0`, Heavy flat `1.4`. And at m=9 the code yields **0.86 / 1.18 / 1.4**, which
rounds to the ledger's own 0.9/1.2/1.4. This is a **one-word correction (9→10)**, and the
provenance upgrade (wiki → shipped client) the lane_impact describes. Bank it as a correction;
do not count it as an overturn of a sentence whose substance the code confirms verbatim.
⚠️ Its "ten levels" evidence is the **android** skilldata (NF-6).

### 16 · stance-modifier-table-in-payload — **HELD, overturn UPHELD, but ONE COLUMN IS UNSAFE**
`InventoryUI.as:1940-1970` and `:2232` are verbatim right.

**⚠️ MATERIAL DEFECT I FOUND: the `critModifier` column is contradicted by the same build's own
damage function.** InventoryUI says Light 1.2 / Balanced 1.5 / Heavy 1.5. But
`MCSPlayer.as:3215-3221` says:
```
if(this.reload == this.maxreload) {
   if(this.stance != LIGHT_STANCE) { return maxDamage * 1.2 + this.STAT_CRITICALDMG; }
   return maxDamage * 1.5 + this.STAT_CRITICALDMG;
}
```
— **exactly inverted.** v0.682's character sheet displays a crit range its own combat code does
not produce. **Do not ship this table's crit column.** (Moot for the target build anyway: v0.717
is a flat ×1.3 with no stance branch — finding 19.) The dmg/def/slash columns do match
`getDamage`/`getDefense`.

**Overturn UPHELD** on progression blocker ① (:200) — but only its **SPD** half, and via lines the
finding cited without naming: `:1937-1938` consume `StatsManager.getSkillCooldownModifierVal(newSpeed)`
and `getBaseSlashLengthVal(newSpeed)`. I read the first one: `StatsManager.as:1854-1860`
`if(speed > 300) speed = 300; return 1 - speed / 300 * 0.5;` — **the SPD→cooldown formula is
recovered.** The **DEF mitigation curve** half is NOT closed by this cite (`defModifier 0.8` is a
stance modifier, not the DEF-stat curve) — I supply the cite that does close it in NF-3.

### 18 · stance-reach-modifiers — **HELD, overturn UPHELD (fatal). Best finding in the packet.**
All ten cited lines verified in both builds, including the two the others omit:
`§1t99s0§.as:3130` (REVERSED `* 1.4`) and `:3141-3145` (DUAL `= base`, floored at 100). I
confirmed the stance mapping is not guesswork: android declares `DUAL_STANCE = 3`,
`REVERSED_STANCE = 4` and its switch runs LIGHT/BALANCED/HEAVY/REVERSED(×1.5)/DUAL(base) — so
web `§1t12224s0§` = REVERSED and `§1t12223s0§` = DUAL. The android divergence is real:
`MCSPlayer.as:3030 * 1.5`, `:3041 * (1 + 0.5 * balancedMastery * 0.01)`,
`:3052 * (0.5 + 0.5 * heavyMastery * 0.01)`.
Arithmetic spot-check: Dan-1 asymptote `(120+95) × 1.4 = 301 ≈ 300` ✓.
**Combat-core blocker ① at :190 dies in full**: reach = `120 + floor((90+5·Dan)·SPD/(20+SPD))`
× per-stance multiplier, in the game's own display units — the same integer it prints to the
player as "slash distance" (finding 14 supplies that half). "Wiki gives units of unknown scale"
is answered.

### 19 · v0717-crit-is-flat-1.3 — **HELD, overturn UPHELD**
`§1t99s0§.as:3272-3276` verbatim. **I pinned the obfuscated symbols** by lining it up against
android `MCSPlayer.as:3215-3221`: `§1t4414s0§ == §1t4415s0§` is `reload == maxreload` and
`§1t1243s0§` is `STAT_CRITICALDMG`. The android has a stance split (Light ×1.5 / others ×1.2)
that **v0.717 removed** in favour of a flat ×1.3 — so the "×1.5 behead" story is a v0.682-only
retune, exactly as claimed. Blocker ② at :190 closes **in the ledger's own favour** (:152-153
already argued 1.3), so it confirms §3.2 while closing the blocker.
Cite nit: the lane_impact's `SOURCE_CONSTANTS.md:158` is real but the file lives at
**`docs/research/fidelity/SOURCE_CONSTANTS.md`**, not `docs/research/`. Line 158 reads
`| body-part crit | **1.3**, parts 12 neck / 16 head / 17 hat | a *second*, stacking 1.3 |` ✓.

### 21 · v0717-stance-multipliers — **HELD on the core; TWO FALSE CLAUSES (`overturns_ledger=false`, so no overturn ruling)**
All six lines verified, including `:3130` and `:3141`. `shs3_android_payload/scripts/StatsManager.as:1834`
exists (`player.initPlayer(...)`) ✓. "Mastery is skill level 1..10, NOT a 0-100 percentage" is
right and I confirmed it in **both** builds: web `§1t5957s0§.as:2725/2734/2743`
`§1t9714s0§(1000/1001/1002)` and android `EnemyElite.as:104 balancedMastery = xml.getMastery(1001)`,
with skilldata capping those three skills at 10 levels. "FIVE stances" ✓.

**❌ FALSE CLAUSE 1 — do not act on it.** *"…which vindicates the ledger's 0.9/1.2/1.4 line as
REACH-at-mastery-ceiling."* The ledger explicitly labels `0.9/1.2/1.4` as **dmg** and gives reach
separately as `300/200/100`. And `0.9/1.2/1.4` **is** the damage ceiling — `§1t99s0§.as:3262-3270`
at m=10 gives Light 0.9 / Balanced 1.2 / Heavy 1.4. The reach ceilings are Light 1.4 / Balanced
1.2 / Heavy 0.9 — **the same three numbers in reverse stance order**, a coincidence of the
permutation `src/config/reach.ts` documents. Re-labelling the ledger's dmg row as reach would
corrupt it.

**❌ FALSE CLAUSE 2.** *"differ from android on every constant"* — overstated. Heavy's `0.5` base,
the `100` floor and DUAL's `×1.0` are **identical** in both builds (`MCSPlayer.as:3052`, `:3055`,
`:3078-3081`). Only Light/Reversed (1.4 vs 1.5) and the per-mastery terms (0.02/0.04 vs
0.005/0.005) differ.

### 22 · v0717-stance-slash-multipliers — **HELD, overturn UPHELD (reach half); ONE FALSE CLAUSE**
**The identification chain is the best work in the packet and I verified it end-to-end:**
`§1t99s0§.as:282` defines `public function §1t4446s0§(param1:int, param2:int, param3:int,
param4:int)`; `§1t1523s0§.as:2270` calls it with four element-defence stats; android
`MCSPlayer.as:260 initElementDefenseStats(STAT_FIREDEF, STAT_WINDDEF, STAT_WATERDEF,
STAT_EARTHDEF)` is called identically from `EnemyPlayer.as:763`. **`§1t99s0§` IS the web
MCSPlayer.** The param-order pin at `:183-199` is real and it fixes the symbols:
`§1t4420s0§` = `baseSlashLength` (param 10) and `§1t4421s0§/§1t4422s0§/§1t4423s0§` =
light/balanced/heavy mastery (params 12-14), matching android `MCSPlayer.as:195-197`.

**❌ FALSE CLAUSE.** *"the surveyor's grep terms ('0.005', '0.5 + 0.5 *') exist in neither build,
so its negative grep proved nothing."* — Half wrong, and I checked:
```
$ grep -rn "0\.5 + 0\.5 \*" reference/decompiled/shs3_android/scripts/
MCSPlayer.as:3052   slashLength = baseSlashLength * (0.5 + 0.5 * this.heavyMastery * 0.01);
MCSPlayer.as:3205   maxDamage   = baseDamage      * (0.5 + 0.5 * this.lightMastery * 0.01);
InventoryUI.as:1945 dmgModifier   = 0.5 + 0.5 * mastery * 0.01;
InventoryUI.as:1966 slashModifier = 0.5 + 0.5 * mastery * 0.01;
$ grep -rl "0\.005" (both builds)  -> no hits
```
`0.5 + 0.5 *` occurs **four times in the android build**. Only `0.005` is absent from both.
Dismissing another survey on a negative grep that is itself wrong is the same error twice.
**Overturn upheld but scoped:** the multipliers alone falsify the *reach* half of :155
(ceilings 1.4:1.2:0.9 = 1.56:1.33:1, not 3:2:1); the *damage* half of the same sentence stands.

### 23 · v0717-stance-table — **HELD (best single cite), overturn REFUSED by its own words**
`§1t5957s0§.as:2721-2747` is verbatim right and is the densest artifact in the packet — one
character-sheet function carrying **damage, crit, defence and reach** for all three stances with
their mastery terms, keyed off `§1t9714s0§(1000/1001/1002)` (getMastery). Note `_loc42_ = 1.3` on
**every** row: v0.717's crit really is stance-independent.

**Overturn refused — the finding refutes itself.** Its own lane_impact: *"At mastery 9 the damage
row is 0.86/1.18/1.4, i.e. the wiki's 0.9/1.2/1.4 rounded, **which CONFIRMS the ledger's mastery-9
reading rather than overturning it**."* A finding that says it confirms the sentence cannot be
filed as overturning it. What it actually delivers — an exact formula replacing an approximate
wiki table, plus proof that android ≠ web — should be banked as a **new ledger row**.

---

## NEW FINDINGS (mine, while judging)

**NF-1 — the layered-music model is BOTH BUILDS, not android-only.** `A2`, web v0.717.
`reference/decompiled/shs3_payload/scripts/§1t133s0§.as:115-127` loads the same 13 stems in the
same TRACK order (`battlechants, battledrums, flutes, safeambience, safekoto, safepercussion,
dungeonambience, dungeonflute, dungeonpercussion, dungeonpiano, bgm_gangnam, bgm_levelup,
bgm_lose`); `:76 §1t1730s0§:int = 13`; `grep -c "= new Array(this.§1t1730s0§)" → 18`.
Upgrades findings 5 and 9 from "android v0.682" to "both".

**NF-2 — the AnimData hold-tail table is BOTH BUILDS.** `A2`, web v0.717.
`reference/decompiled/shs3_payload/scripts/§1t783s0§.as:17` and `:27-146` — same tail groups as
android `AnimData.as:23-141`. `§1t783s0§.as:149-156` clamps the frame getter to the last frame,
which is a cleaner statement of the pose latch than android's `frameCounter < frameList.length`.
Web adds one tail entry android lacks and drops `light_afterslashpose`.
Upgrades finding 4 from "android" to "both".

**NF-3 — DEF mitigation is FLAT SUBTRACTION in both builds; no curve exists.** `A2`, both.
web `§1t99s0§.as:3484`, `:3800`, `:4391` all read `_loc5_ -= this.§1t4477s0§();`, and
`§1t99s0§.as:3284-3290` is `if(stance == HEAVY) return defense * 0.8; return defense;`.
android twins: `MCSPlayer.as:3415`, `:3709`, `:3231-3238`.
**This closes the DEF half of REBUILD_READINESS.md:200 progression blocker ①** — *"DEF mitigation
curve … measure per-point deltas in a build"* — no build needed, and no curve to measure. It
corroborates `docs/research/fidelity/SOURCE_CONSTANTS.md:149` (*"defence SUBTRACTS, it never
divides"*), which the ledger never absorbed.

**NF-4 — the SPD→cooldown formula is recovered.** `A2`, android v0.682.
`StatsManager.as:1854-1860`: `if(speed > 300) speed = 300; return 1 - speed / 300 * 0.5;`.
Closes skills-meters blocker ④ at :195 and the SPD half of progression ① at :200.

**NF-5 — v0.682's character sheet contradicts its own damage function on CRIT.** `A2`, android.
`InventoryUI.as:1946/:1955/:1964` → Light 1.2 / Balanced 1.5 / Heavy 1.5.
`MCSPlayer.as:3215-3221` → `stance != LIGHT ? ×1.2 : ×1.5`. Exactly inverted.
**Never ship finding 16's crit column.**

**NF-6 — the WEB payload contains NO itemdata / skilldata / npcdata / questdata.** `A3`.
`docs/gauntlet/L0/index/bindata.json` lists all 27 web blobs: **19 animdata, 1 survivalmodedata,
1 `obj`, 5 text name-tables, 1 GIF** — no data XML and no lang table. And all four
`reference/extracted/*.xml` are the ANDROID blobs: `skilldata.xml` (39 003 B) is
`android/117_Mobile_SkillData.bin` (39 045 B) minus its XML declaration and CRLFs; the same 42-byte
delta holds for itemdata (184 002/184 044) and npcdata (228 413/228 455), and questdata differs by 1.
`grep -c` over the 329 MB `payload.xml` finds `skilldata` **0** times and `<npcdata` **0** times.
⚠️ **This qualifies the §0 preamble's *"Data-XML row counts match exactly"*** — there is no web
data XML to compare against. Every skilldata/itemdata/npcdata/questdata claim in this lane carries
the v0.682 caveat, including findings 2, 15 and 21.

**NF-7 — 800×690 is the friend-bar layout, not a second native canvas.** `A2`, both.
web `§1t1540s0§.as:271-273` (`800 / 480 / 690`) mirrors android `GameEngine.as:269-271`
(`originalWidth / originalHeight / originalHeightWithBar`), and web `§1t1523s0§.as:104,106` sets
`stageWidth 800 / stageHeight 480`. **REBUILD_READINESS.md:117's "native canvas is 800×480 (5:3)"
SURVIVES.** What is new is a second layout mode gated by `stageShowingFriendBar`.

**NF-8 — Shunpo's hold-to-charge mechanic is web-confirmed in code.** `A2`, web v0.717.
`§1t120s0§.as:54 §1t10146s0§:int = 1039` (android `SkillManager.as:54 SKILL_SHUNPO = 1039` — same
line) and `§1t113s0§.as:704, :743, :777` group 1039 with the charge skills, matching android
`BattleUI.as:571, :610, :644`. Removes the android caveat from finding 2's *mechanic*; only the
display copy stays v0.682.

**NF-9 — `slash distance: 345 (heavy)` is an already-ruled-inadmissible placeholder.** `A4`.
`docs/research/fidelity/SOURCE_CONSTANTS.md:31-36` names it, beside `physical dmg: 1234 - 1235`,
`hp: 123 / 123`, `chi: 123 / 434`, as Flash-IDE dummy text; §0 of that file tags such values
`PLACEHOLDER — NO, never a value`. Related, `:37-40`: `maxDistance = 200`
(`InputManager.as:51`, overwritten at `:108`) is *"almost certainly the origin of the wiki's
'Balanced reach = 200'"*. Kills finding 14's "open discrepancy" and caveats the positive half of
findings 11/12/17.

**NF-10 — no WEB audio is held.** `A3`. `ls reference/preservation/` → `shs3.swf`,
`shs3preloader.swf`, `shs3_payload.swf`, `shs3_android_payload.swf`, `shs3_payload_version.swf`,
`p0_ruffle_titlescreen.png`. No `soundresource.swf` / `musicresource.swf`; neither decoded payload
holds a single `DefineSound` tag (I histogrammed both: web 4 051 tags, android 3 311 tags,
`DefineSound(14) = 0` in each). The 26 recovered waveforms are **v0.682 only**; the *architecture*
(NF-1) is both builds.

---

## THE ONE-LINE SUMMARY FOR THE LEDGER EDITOR (first slice)

Twelve real overturns, and three of them are load-bearing: **the L11–80 XP curve is a shipped
99-entry constant** (:200, :350 die), **all 26 audio waveforms are byte-exact recoverable**
(:240 ①, :348 die — and S0-5 dies with them), and **combat-core blocker ① dies in full** (:190 ①).
Eleven claims either point at a sentence they confirm, at a sentence that isn't in the document,
or at a question the repo's own fidelity ledger closed on 2026-07-25.

---

# §B — THE SIX FINDINGS THAT ROTATED IN (judged from scratch)

None of these six names a REBUILD_READINESS.md sentence. Two target **gauntlet §0 law**
(S0-5, S0-1) and four target **other banked claims**. I judged each on the same rule: does the
evidence make the quoted sentence false?

### B1 · android-blobs-hunter/audio-decrypts-26-named-mp3-streams — **HELD, overturn UPHELD (S0-5 falls)**
Independently reproduced in full (my decrypt/inflate/tag dump is at the top of this file). Its
per-cue table is right where I sampled it: `safepercussion 882144 (80.01 s)`, `battledrums 882144`,
`slash1 3809 (0.35 s)`, `deflect 8700 (0.79 s)`, `hitmetal 5717 (0.52 s)` — all four match my
`DefineSound` header parse to the sample. Cites resolve: `shs3_android_payload/ResourceManager.as`
carries the loop at **:205-216** (the finding says :206-217 — off by one, harmless) and
`Mobile.as:352` is verbatim `ResourceManager.decryptByteArray(ba,
ResourceManager.resourceFileNameArray[resourceIndex].charCodeAt(1))`.
**This is the best-behaved of the four audio findings in the packet** because it states its own
limit honestly — *"I did NOT listen to or grade any of it; I read tag headers only"* — and because
its lane_impact correctly separates what dies in S0-5 (the "ffdec cannot open it" premise) from
what survives (nobody has graded the audio yet). Prefer its wording over findings 13/14 when
rewriting S0-5.

### B2 · android-blobs-hunter/bgdata-override-vocabulary-is-22-tags — **HELD, overturn UPHELD**
I decoded `123_Mobile_BGData.bin` (UTF-8, 623 content lines, 49 `<bg>`) and built the histogram
myself. **Every one of the 22 counts matches the quote exactly:**
```
id 49 · name 49 · ffcount 49 · fcount 49 · ppcount 49 · gcount 49 · fgcount 49
contentwidth 17 · wrap 17 · fscroll 16 · ffscroll 14 · fwrap 11 · fblur 11
ppwrap 9 · ppblur 9 · ffwrap 8 · ppscroll 6 · ffblur 3 · fgscroll 3 · gscroll 2 · fgblur 2 · gblur 1
```
And all three "breaks the ladder" anomalies check out against `XMLBG.as`'s defaults
(`:48-56` farthest 0.25 / far 0.3333 / playerPlane 0.5 / ground 1 / foreground 2):
`<gscroll>` is authored twice and **both values are `0`** (locked ground plane); `<fgscroll>` is
authored three times and **all three are `1.2`** (against the default 2.0); `<ffscroll>` includes a
`1` (farthest plane collapsed onto the camera). `<gwrap>`, `<fgwrap>`, `<groundy>`, `<flatground>`
appear **zero** times. The two corrections to the banked claim both land: **ffwrap is 8 rows**
(`1670, 1640, 2000, 1750, 2000, 1770, 2000, 2000`), not 6, and **ffscroll's range is 0.05–1.0**
(`{0.05, 0.1, 0.125, 0.14, 0.27, 1}`), not 0.05–0.27. Clean.

### B3 · android-blobs-hunter/foreground-plane-is-the-most-blurred-element — **HELD, overturn UPHELD. I OPENED THE FRAME.**
This is an **A1** claim, so I did the A1 work: opened
`reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` (1920×1080), cut the finding's own crop
`(760,780)-(1240,1010)`, upscaled ×3 NEAREST, **and looked at it.**

**What is visibly in the crop:** a grass band across the bottom third whose blades have **soft,
fuzzy, gradient edges and no outline at all**, occluding the lower legs of both fighters — while
the purple ninja and the tan samurai above it carry **hard near-black bold-vector outlines** on
every limb. The blue blade arc at left is likewise crisply outlined. The contrast is not subtle.

My own gradient measurement, run independently on the finding's own boxes:
```
grass A (780,885)-(850,955)              p99grad=  3.0   (finding: 3.0)
grass B (1100,885)-(1230,955)            p99grad=  3.0   (finding: 3.0)
grass C (300,885)-(560,955)              p99grad=  3.2   (finding: 3.4)
far rock (1300,300)-(1500,450)           p99grad=  7.5   (finding: 7.0)
tan fighter torso (960,700)-(1080,840)   p99grad= 85.2   (finding: 82.0)
purple shoulder (820,830)-(900,880)      p99grad= 88.6   (finding: 101.6)
```
And the outline test the finding asserts — I ran it: the three grass boxes bottom out at
luminance **20–27**, i.e. **no near-black pixels**, while the fighter-torso box reaches **0.0**.

`XMLBG.as:46 internal var foregroundLayerBlur:int = 8;` and `:38 farthestLayerBlur:int = 8;` —
tied for the hardest blur in the ladder, exactly as claimed.

**STANDING INVARIANT, SAID OUT LOUD: THE FRAME WINS.** The banked claim
*"a sharply-outlined grass band … The grass carries the same outline weight as the fighters"* is
**inverted**. The occlusion half survives; the outline half is false. Building crisp foreground
grass off that wording would be a visible 1:1 miss on all 49 backgrounds that declare `<fgcount>`.

### B4 · android-blobs-hunter/item-icon-coverage-corrected — **HELD, overturn UPHELD**
I decrypted `115_Mobile_SHS3Resource.bin` (key 104, `CWS v17`, inflates to 1 040 857 B) and did
the join myself. **Every figure reproduces exactly:**
```
SymbolClass names: 1912          item#### symbols: 112      skill#### symbols: 79
band 2000-2999 : rows=99 covered=50 MISSING=49
   -> 2000 2001 2131..2139 2142 2144..2175 2204 2206 2500 2502 2503      (identical to the quote)
band 20000-29999: rows=79 covered=58 MISSING=21
   -> 20005 20009..20012 20017 20023 20054..20058 20100..20107 20111     (identical to the quote)
skilldata: 75 rows, 68 with a skill#### icon, 7 without -> 1064 1065 1066 1067 1068 1500 1501
           11 skill symbols have no skilldata row
```
**I checked the obvious way this could be an artifact and it is not.** Accessories do NOT ship
under `item####` — they ship under `acc####` — so I enumerated every symbol prefix in the file
(`torso 151 · lowarm 151 · uparm 151 · pelvic 151 · stomach 150 · item 112 · weapon 109 · hat 96 ·
calf/crotch/thigh 85 · skill 79 · hair 73 · prop 60 · mask 59 · … · acc 8`) and confirmed
`acc#### = {3000..3006, 3008}` — **8 of the 9 accessory rows, with 3007 the sole gap**, exactly as
the finding retains from the banked claim. Then I asked whether any *other* prefix covers the 49
"missing" consumables: **none does.** The 50/99 figure is real.
The banked claim's "94/99 consumables", "67/79 quest items" and its five-item residual list are
all wrong; the corrected numbers are 50/99, 58/79 and a 49-item list. Its PARTIAL verdict is
honest — the art IS on disk, the coverage is just half what was banked.
(The prefix census also independently corroborates finding 1's 13-slot paperdoll: torso, lowarm,
uparm, pelvic, stomach, calf, crotch, thigh, foot, foottop, head, hand, neck, hair, hat, mask,
weapon, prop, acc.)

### B5 · android-blobs-hunter/shipped-vector-art-yields-solid-fill-palettes — **HELD, overturn UPHELD**
I decrypted all three resource SWFs (115 key 104, 120 key 103, 124 key 109 — all `CWS v17`, all
inflate) and wrote my own `DefineShape/2/3/4` FILLSTYLEARRAY parser. **Shape-record counts match
to the unit: 115 → 1755, 120 → 562, 124 → 106** (= the finding's 2,423 total). Fill rankings are
identical in all three files, and the mid-table counts match exactly
(`#333333 x160 · #CCCCCC x147 · #FECA98 x127 · #B78F6C x120` in 115;
`#30291D x35 · #5A4D2E x33 · #3A3323 x23 · #251F16 x21 · #453929 x21` in 120). My top-1/top-2
counts run 5–20 % higher because my parser recovered a few more records (1669/516/99 with solid
fills vs. their implied totals) — a parser delta, not a disagreement.
**All three per-symbol resolutions reproduce exactly:**
```
torso4000 -> charId 1195 -> shape 1194 (DefineShape4) fills ['#FECA98', '#B78F6C']
skill1000 -> charId  145 -> shape  144                fills ['#C0AC4B']
acc3000   -> charId 3726 -> shape 3725                fills ['#ABABAB', '#EEE684']
```
The semantic sanity check passes both ways (skin tones dominate the portrait file, earth tones the
background file). The banked claim *"not one DefineShape record was decoded, so no fill colour …
is held"* is now false.
⚠️ **Two limits to carry with it.** (a) The finding's own honest limit is right and should stay:
first-fill-array only, no edge records, no outline weights. (b) I add one it does not state — the
histogram is **fill-style-SLOT frequency, not rendered area**. `#000000 x243` means 243 shapes
declare a black fill slot, not that black covers the most pixels. Do not build a palette ranking
from it. And these are **v0.682** resource files; no web `shs3resource.swf` is held (NF-10).
Its acc3000 line quotes only the first of two fills — cosmetic.

### B6 · android-blobs-hunter/survival-achievement-premium-namegen-blobs-unread — **HELD, overturn UPHELD, and I UPGRADED IT TO BOTH BUILDS**
Every cited line resolves, verbatim:
```
109:3 <wave>  :4 <enemy>  :5 <id>400|401|402|403|404</id>  :6 <qty>4</qty>  :7 <x>-50</x>
114:4 <achievement> :5 <id>0</id> :6 <img>1</img> :7 <name>8000</name> :8 <desc>8080</desc>
     :9 <stat>60000</stat> :10 <val>1</val>
121:3 <default>  :22 <special>  :35 <rotation>  :37 <set>
strings.json["8000"] = 'Duelist I'   ["8080"] = 'Win an online duel.'
```
Counts reproduce: 109 → **39 `<wave>`, 87 `<enemy>`**, x histogram **`-50` ×49, `1650` ×37,
`-1650` ×1**; 114 → **61 `<achievement>`**, `<img>` values exactly `{1,2,3,4}`; 121 → **23 `<set>`,
176 `<item>`**. The citelint `LINE_ON_BINARY` flag on 109 is a **false alarm** — the `.bin`
decodes to plain UTF-8 XML and its line numbers are meaningful; I read them.
`XMLBG.as:14 internal var contentWidth:int = 1600;` is the default, so the "just off both edges of
a 1600-wide stage" reading is right.

**MY UPGRADE — survival mode is not merely "present in both payloads", it is IDENTICAL in both.**
I parsed the WEB blob `reference/extracted/bindata/119_1t4646s0.bin`:
```
WEB survivalmodedata: <wave> 39 · <enemy> 87 · x histogram {-50: 49, 1650: 37, -1650: 1}
                      id alternation ['400|401|402|403|404', …]
```
Byte-for-byte the same content as the android blob. **S0-1's "a whole game mode absent from all 12
ledger systems" is confirmed as a gap and now has its authored content in hand, in the TARGET
build.**
⚠️ Minor: the NameGenerator counts are `wc -l` values. Actual entry counts are male **398**,
female **291**, place **677**, samurai family **36**, noble family **33** = **1,435** proper
nouns, not 1,430.

---

# §C — RULINGS I HAD ALREADY FINISHED ON THE SIX FINDINGS THAT ROTATED OUT

Preserved so the work is not destroyed. All six were verified against artifacts I opened.

- **`combat-core/stance-reach-modifiers`** — **HELD, overturn UPHELD (fatal).** The strongest
  finding I saw. All ten cited lines verified in both builds, including `§1t99s0§.as:3130`
  (REVERSED ×1.4) and `:3141-3145` (DUAL = base, floored 100), and I confirmed the stance mapping
  is not guesswork (android `DUAL_STANCE = 3`, `REVERSED_STANCE = 4`, switch order
  LIGHT/BALANCED/HEAVY/REVERSED/DUAL ⇒ web `§1t12224s0§` = REVERSED, `§1t12223s0§` = DUAL).
  **Combat-core blocker ① at REBUILD_READINESS.md:190 dies in full.** `(120+95) × 1.4 = 301 ≈ 300` ✓.
- **`combat-core/v0717-crit-is-flat-1.3`** — **HELD, overturn UPHELD.** `§1t99s0§.as:3272-3276`
  verbatim, and I pinned the symbols against android `MCSPlayer.as:3215-3221`: `§1t4414s0§ ==
  §1t4415s0§` is `reload == maxreload`, `§1t1243s0§` is `STAT_CRITICALDMG`. v0.682 has a stance
  split (Light ×1.5 / others ×1.2) that v0.717 **removed** for a flat ×1.3. Blocker ② at :190
  closes, in the ledger's own favour. `SOURCE_CONSTANTS.md:158` verified (file lives at
  `docs/research/fidelity/`, not `docs/research/`).
- **`combat-core/v0717-stance-curves-are-already-in-config`** — **HELD, overturn UPHELD**, and
  redundant with `reach-ts-was-right`. Build stamp confirmed: `§1t1523s0§.as:36 §1t9323s0§:Number
  = 0.717` (android twin `StatsManager.as:30 clientVersion = 0.682`).
- **`combat-core/v0717-stance-multipliers`** (`overturns_ledger=false`) — **HELD on the core, TWO
  FALSE CLAUSES.** (a) *"vindicates the ledger's 0.9/1.2/1.4 line as REACH-at-mastery-ceiling"* is
  **false** — the ledger labels that triple `dmg`, and it IS the damage ceiling
  (`§1t99s0§.as:3262-3270` at m=10 → Light 0.9 / Balanced 1.2 / Heavy 1.4). Reach at ceiling is
  1.4 / 1.2 / 0.9 — the same three numbers in **reverse stance order**. Re-labelling the dmg row as
  reach would corrupt the ledger. (b) *"differ from android on every constant"* is overstated:
  Heavy's 0.5 base, the 100 floor and DUAL's ×1.0 are **identical** in both builds.
- **`combat-core/v0717-stance-slash-multipliers`** — **HELD, overturn UPHELD (reach half), ONE
  FALSE CLAUSE.** The identification chain is excellent and I verified it end-to-end
  (`§1t99s0§.as:282` defines a 4-int `§1t4446s0§`; `§1t1523s0§.as:2270` calls it with four
  element-defence stats; android `MCSPlayer.as:260 initElementDefenseStats(...)` called the same
  way from `EnemyPlayer.as:763` ⇒ **`§1t99s0§` IS the web MCSPlayer**; param order at `:183-199`
  pins `§1t4420s0§ = baseSlashLength` and `§1t4421s0§/§1t4422s0§/§1t4423s0§` = light/balanced/heavy
  mastery). **But its negative grep is wrong:** `0.5 + 0.5 *` occurs **four times** in the android
  build — `MCSPlayer.as:3052`, `:3205`, `InventoryUI.as:1945`, `:1966`. Only `0.005` is absent from
  both. Dismissing another survey on a grep that is itself wrong is the same error twice.
- **`combat-core/v0717-stance-table`** — **HELD (best single cite in the whole packet), overturn
  REFUSED by its own words.** `§1t5957s0§.as:2721-2747` is verbatim right and is the densest
  artifact I read: one character-sheet function carrying damage, crit, defence AND reach for all
  three stances with their mastery terms, keyed off `§1t9714s0§(1000/1001/1002)`, with
  `_loc42_ = 1.3` on every row. **But its own lane_impact says it "CONFIRMS the ledger's mastery-9
  reading rather than overturning it."** A finding that says it confirms the sentence cannot be
  filed as overturning it. Bank it as a new ledger row.

---

# §D — FINAL TALLY FOR THE PACKET AS IT NOW STANDS (24 ids)

**24 judged · 0 skipped · 0 refuted · 18 overturns upheld · 5 overturns refused · 1 scoped.**

Not one claim in this packet is false at its core — every single cite I opened resolved, and the
numeric claims I re-ran (the 99-entry XP array, 487/487 `@d == count(<f>)`, both SWF headers, both
audio decrypts + ffprobe, the 22-tag BGData histogram, the item-icon join, 2,423 shape records, the
frame gradients, 39 survival waves) reproduced to the unit. This is an unusually strong packet.

**The five overturns I refuse, and why:**

| id | why the overturn fails |
|---|---|
| `combat-core/reach-and-crit-configs-already-correct` | **its `ledger_text` is not in REBUILD_READINESS.md** — `grep` returns nothing. It overturns another agent's survey, not the ledger. |
| `art-anim-audio-feel/NEW-24hz-killbeat-is-web-parity-closed` | points at the art-anim **Ready** list, whose own "kill-beat" item its evidence *confirms*. A `24 * N` multiplier is not a frame-rate proof. |
| `art-anim-audio-feel/animdata-code-injected-hold-table` | a terminal-**hold** table is orthogonal to a **step-rate** claim; nothing in it sets a Hz. (Best new *content* in the packet — bank it as a new row.) |
| `combat-core/slash-distance-is-player-visible` | the "345 conflict" was closed by name on 2026-07-25 as a Flash-IDE placeholder (`SOURCE_CONSTANTS.md:31-36`); and the finding declines to supply the number blocker ① asks for. |
| `combat-core/stance-damage-mastery10-ceiling` | the sentence it names is **confirmed verbatim** by the code (ceiling not base; level-1 = ×0.5 / ×1.0 / ×1.4 fixed; Heavy reach ×0.5→×0.9). Only "9" should read "10". |

**Scoped:** `art-anim-audio-feel/web-swf-header-is-24fps-and-800x690` overturns "15fps pose latch"
but **NOT** "native canvas is 800×480" — 800×690 is the friend-bar layout
(`§1t1540s0§.as:271-273`, `GameEngine.as:271 originalHeightWithBar:int = 690`).

**The three that actually rewrite the document:**
1. **L11–80 XP curve** — a shipped 99-entry constant in both builds. `:200` blocker ② and `:350` die.
2. **All 26 audio waveforms** — byte-exact recoverable. `:240` ① and `:348` die, **and S0-5 dies**.
3. **Combat-core blocker ①** — reach in stage px is an exact formula. `:190` ① dies.

**And two gauntlet §0 laws need editing, not just the ledger:**
- **S0-5 is FALSE** and must be replaced with the honest residue: *the containers open with the
  game's own key schedule; 26 named MP3 cues are in hand; nobody has listened to or graded them;
  they are v0.682 and web audio is not held.*
- **S0-1's "Data-XML row counts match exactly"** premise cannot be checked — the web payload
  carries **no** itemdata/skilldata/npcdata/questdata at all (NF-6). Survival mode, by contrast,
  IS byte-identical across both payloads (B6).
