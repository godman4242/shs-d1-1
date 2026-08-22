# Blind cite-lens review — t2-corroborating-02 (s26b)

**Packet:** `docs/gauntlet/L0/worklist/t2-corroborating-02.json` — 48 corroborating findings.
**Judged:** 48/48. **Skipped:** none. **Refuted:** 4. **New findings:** 6.
**Lens:** LENS 1 (the cite lens) — I opened every cited artifact myself. I did not read
`docs/gauntlet/L0/critics/*.md` or `docs/gauntlet/L0/sources/*.md` (§3.2).

---

## Headline

Four claims fall, and three of them fall to the same root cause: **agents concluded that
something was absent when they had only failed to open it.**

1. `art-anim/equipment-art-was-server-streamed` — **FATAL**. It declares the equipment-art
   blocker permanent ("zlib fails: unknown compression method … equipment art must be
   authored from frames"). I decrypted `115_Mobile_SHS3Resource.bin` in one pass and got
   **1,912 exported symbols**, including 151 torsos, 109 weapons, 96 hats, 85 calfs and
   73 hairs. The roster art has been sitting in the repo the whole time.
2. `art-anim-audio-feel/web-payload-has-no-game-code` — **MATERIAL**. "No game-logic
   classes at all" in `shs3_payload/scripts/`. There are **612 obfuscated `§1t…s0§.as`
   classes at the top level of that directory**, and I read two of them: the RNG and
   AnimData.
3. `art-anim-audio-feel/web-and-android-stages-differ` — **MATERIAL**. Its SWF-header
   measurement is exact, but the caveat it imposes ("every canvas/letterbox constant is
   Mobile-only") is refuted by the **web build's own resizeHandler**, which declares
   800 / 480 / 690 identically.
4. `art-anim-audio-feel/pose-cadence-is-15hz-measured` — **MATERIAL**, and the subtle one.
   I reproduced its numbers to three decimals. It measures the **video's** temporal
   resolution, not the game's pose rate.

The other 44 hold. Several of them are the best-measured claims I have seen in this lane —
`bindata/matrix-nodes-and-reorder-frames`, `art-anim-audio-feel/16pct-of-frames-are-authored-holds`,
`art-anim-audio-feel/hit-reaction-ladder-not-uniform` and
`bindata/NEW-web-android-survival-data-differ-in-14-lines` reproduced **file-for-file and
digit-for-digit** against my own independent parses.

---

## The four refutations, in evidence

### 1. `art-anim/equipment-art-was-server-streamed` — REFUTED (fatal)

What holds: `StatsManager.as:360 public static var useExternalResource:Boolean = true;`
· `ResourceManager.as:41` the five-name resource array · `:91` the `getresource.php` URL ·
`:105 variables.pass = "12345";` · and the `getDefinitionByName` path really is dead
(`MCSItem.as:419-421` and `MCSCharacter.as:594-596` return through
`ResourceManager.getMCSComponent` before reaching it).

What is false — two things:

- **"the roster art was never in either payload."** `Mobile.as:50
  internal static const SHS3Resource:Class = Mobile_SHS3Resource;` and `:330
  this.processResource(ByteArray(new SHS3Resource()),resourceIndex);`. On Android the art
  ships **embedded**.
- **"zlib fails: 'unknown compression method'."** This is precisely the Stage-0 C1
  false-negative trap. The decryption is at `ResourceManager.as:200-217`: bytes 3..255 only,
  with `ba[i] ↔ ba[i+256]` swapped when `i % 11 == 0`, then `ba[i] ^= key`, where the key is
  `resourceFileNameArray[num].charCodeAt(1)` — `'shs3resource.swf'[1] = 'h' = 104`.
  It inflates to a **1,040,849-byte CWS v17 SWF**.

I parsed its `SymbolClass`/`ExportAssets` tables. 1,912 exported symbols:

```
lowarm 151 · pelvic 151 · torso 151 · uparm 151 · stomach 150 · item 112 · weapon 109
hat 96 · calf 85 · crotch 85 · thigh 85 · skill 79 · hair 73 · prop 60 · mask 59
foot 44 · foottop 44 · head 38 · hand 33 · neck 33 · acc 8 · achievement 5
+ full bear / boar / deer / horse / wolf part sets
first rows: acc3000 acc3001 … hair6000 hair6001 … calf11000 … hat7000 … mask9000
```

A recreation does not need to author equipment art from video frames. It needs to
transcribe this SWF.

### 2. `art-anim-audio-feel/web-payload-has-no-game-code` — REFUTED (material)

The observation is true: `StageManager.as`, `MCSPlayer.as`, `AnimData.as`, `GameEngine.as`
etc. are absent **by name**. The conclusion inverts it. `ls
reference/decompiled/shs3_payload/scripts/` returns 652 entries and **612 of them are
`§1t…s0§.as`**; `find -name '*.as'` returns **1,079**. The "art + mx/fl/com frameworks only"
characterisation is what you get from reading only the alphabetically-first page.

I opened two of the obfuscated files:

```
§1t58s0§.as:84   this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;
§1t58s0§.as:85   return this.randomSeed / 233280;
§1t783s0§.as:17  this.duration = param1.@d;
§1t783s0§.as:18  this.looping = param1.@l == 1;
§1t783s0§.as:42…145  the post-clip duration ladder, 30 cases
```

That is the RNG and AnimData, in the web build. The blanket "every code claim in this run
is Android v0.682 only" caveat this claim tries to impose on all 11 lanes does not follow,
and I closed one such hole myself during this review (below).

### 3. `art-anim-audio-feel/web-and-android-stages-differ` — REFUTED (material)

Headers reproduce exactly (`shs3_payload_decoded.swf` CWS 17 · 800×690 · fps 24.0 · 6 frames
· 6,880,328 B; `shs3_android_payload_decoded.swf` CWS 26 · 800×480 · fps 24.0 · 6 frames).
But the conclusion — that `GameEngine.as`'s canvas constants cannot be asserted for web —
dies at `reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:269-320`:

```
271  var _loc2_:int = 800;
272  var _loc3_:int = 480;
273  var _loc4_:int = 690;
277  if(_loc7_ <= _loc6_)
280      _loc3_ = _loc4_;
281      §1t1523s0§.§1t9362s0§ = true;      // stageShowingFriendBar
284      §1t406s0§.instance.§1t6500s0§.init();   // friendpanel.init()
313-314  publishes stageBaseWidth / stageBaseHeight
```

Same handler, same constants, same branch structure, in the **web v0.717 payload**.

### 4. `art-anim-audio-feel/pose-cadence-is-15hz-measured` — REFUTED (material)

I extracted with `-fps_mode passthrough` and computed luma MAE on `[400:1000, 500:1500]`:

```
Nr4fQstqHDM t=428, 150 frames — mod-4 means [0.061, 3.076, 0.026, 0.069]
raw deltas 0.42 5.94 0.05 0.02 0.02 5.29 0.02 0.02 0.03 4.95 0.00 0.03 0.00 3.17
zFtCaTO0_1M t=900, 120 frames — mod-4 means [0.003, 0.040, 6.438, 0.078]
```

Identical to the claim. The measurement is impeccable; the inference is not. A **15 fps
capture of a 24 Hz game produces a bit-identical signature**, and phases 0/2/3 sitting at
0.003–0.078 MAE — *nothing at all* changes between updates, not parallax, not particles,
not the HUD — is the signature of a 15 fps **source**, not of a 24 Hz renderer with a pose
latch.

Against it, from the bytes: both payload headers read 24.0 · AnimData durations are integer
stage-frame ticks advanced once per `MCSCharacter.as:1315 ++this.frameCounter` · the AnimData
tails are multiples of 6 and 24 · and **896 animdata frames carry no node updates on
alternating indices** — 12 Hz content authored *inside* a 24 Hz clock, which cannot be
authored against a 15 Hz clock.

**The frame does not disagree with the byte here; it under-samples it.** The standing
frame-wins invariant does not fire. The honest verdict on "does the shipped game step poses
at 15 Hz" is STILL_UNHELD. Note that this packet's own twin claim
`videos-are-60fps-frames-do-arbitrate` states it correctly — "sampled at 15 Hz against a
24 Hz sim" — and survives.

---

## Where the frame was opened

Per §0 I cropped and upscaled rather than grading second-hand.

- `reference/frames/duel_dense/Nr4fQstqHDM_432.0.png` (1920×1080), crop (40,760)–(760,1060)
  at 2× Lanczos: the bottom-left HUD stack reads a green 20/20 bar, a blue 26/26 bar, then
  **CANNOT CHANGE STANCE** and **150% DAMAGE**. Confirms four claims at once. The yellow
  `SOUND360TM` nameplate carries a visible glow halo over a visibly blurred background,
  confirming a fifth.
- `reference/frames/duel_dense/Nr4fQstqHDM_427.1.png`, crop (640,540)–(990,775) → 700×470
  Lanczos: a large blue lens/wedge with white chevron highlights converging at the fighter's
  hands, **plus a separate thick red stroke** crossing the scene. The blue object is
  equipment, not a trail; the transient slash mark is red.
- `reference/frames/session24/reach-A28-forest-duel/ev2_S3_wintint_hz031.png` (1100×630) at
  0.87×: uniform saturated red field, every actor a solid black silhouette with no interior
  detail, two white diamond highlights surviving. The kill beat has a visual spec now.
- Pillarbox measured directly off `Nr4fQstqHDM_432.0.png`: non-black content spans columns
  52–1867 over all 1080 rows = **1816×1080, aspect 1.6815**.

---

## Measurements I reproduced independently

| Claim | My result | Verdict |
|---|---|---|
| 16% authored holds | 487 anims / 5,596 `<f>` / **896 empty = 16.0%**; zom_getup 49/95, gangnam 44/88, ogre_death 28/54 | exact |
| loop + reorder attrs | anim `{('d','i'):385, ('d','i','l'):102}`; f `{('i',):5338, ('i','r'):258}` | exact |
| matrix nodes | 81,706 `<n>` / 79,867 r-form / **1,839 matrix** / matA −101..150 / 258 reorder, 89 in file 108; per-file split identical | exact |
| gotHitCounter ladder | 23×12, 3×0, 2×24, 1×26, 1×16, 1×84 | exact |
| 8 startShake sites | 8 | exact (but see below) |
| 18 of 34 `override die` | 18/34, same names | exact |
| gore humanoid-only | 17/34 without DEATHNOHEAD, same names | exact |
| item `<art>` | 146 tags / 68 targets / 2130×39 / 0 self-ref / 982 items | exact |
| survival drift | 14 lines, exactly the cited numbers; 556/556, 39 waves, 87 enemies | exact |
| trap census | raw 70 rooms / 314 objs → comment-stripped **69 / 297** | exact |
| DefineSound | slash1 = 3,809 samples @11025 = **0.345 s**; stems 882,144 = 80.013 s and 504,288 = 45.740 s | exact |
| predecessor SFX | shs2 20 tags, shs1 10 tags, exactly **2 MD5 collisions**: punch and slash1/sword1 | exact |
| gore frame scan | 7,364 files, median **507** red px, top-60 = 107,191–97,376, all full-screen freezes | replicated |
| BGResource ↔ bgdata | 49 BG_* exported symbols, 49 bgdata names, **zero difference either way**; 874 layer slots | exact |
| place-name table | 677 lines, :676 Uenohara, :677 Yamanashi, max index 675 | exact |

**Note, and say it out loud:** `definesound-samplecount-is-authoritative` **overturns the
Stage-0 C3 numbers**. C3 states the overworld stems are 79.872 s and the dungeon stems
45.760 s. Those are afinfo estimates. The DefineSound `sampleCount` — what Flash actually
plays — gives **80.013 s** and **45.740 s**. The tag wins.

---

## Corrections carried forward on claims that survived

These do not sink their claims, but they must not be copied into the ledger as written.

- **`startShake`'s first argument is DURATION, not amplitude.** `StageManager.as:1200
  public static function startShake(shakeDuration:int, shakeAmt:int = 30)`. So "crusher
  traps shake at amplitude 6" is wrong twice — 6 is a 6-tick duration, at the default
  amplitude 30. The only data-driven amplitude is `Marker_RumbleTrigger.as:44`.
  (Affects both `three-missed-shake-triggers` and `three-uncatalogued-shake-triggers`.)
- **The ground plane is not the only blur exception.** `BG_Loader.as:186
  if(!(this.bgType == BG_FORESTSPOOKY && i > 2))`. And **five** bgdata records carry
  `gcount=4`, not four — `BG_TempleExteriorFog` (id 48) is missing from the list.
- **"No hold frames anywhere in the data" is wrong** (impact clauses of
  `animdata-loop-flag-parsing-trap` and `no-hold-frames-verified-exhaustively`). `@d` never
  pads a clip — that part is universal, 487/487 — but **896 individual `<f>` elements carry
  zero `<n>` children**. `ogre_walk` holds on every odd frame.
- **`AnimData.as:28-40` is thirteen `*SLASH_POSE` cases, not twelve** (`REVERSEDSLASH_POSE`
  at :40 is the thirteenth).
- **`damagetextcol = 16777215` is at :3706, not :3705**, and it is guarded by
  `if(this.controlledBy != 0)` — so white is the popup colour when the victim is *not* the
  player-controlled fighter.
- **`payload.xml`'s ffdec header is on lines 5–6, not line 1.**
- **`light_run` lives in `118_1t4645s0.bin`, not `108`** (still missed by a strict parse, so
  the parsing-trap point stands).
- **The `duel_dense` set is not 42 *consecutive* frames** — there is a hole between 429.0
  and 431.0. The 21/21 run from 427.0–429.0 settles the persistence question on its own.
- **`rig-is-23-parts-27-slots`' node-count histogram sums to 385**, which is the count the
  *strict* `<anim i=… d=…>` regex returns — it was computed with the very parse trap this
  packet documents elsewhere. The load-bearing negative (21 never occurs) survives under
  both parses.
- `gore-roll-is-per-class` says "8 of 35 Enemy*.as"; the denominator is **34**.

---

## Six new findings

1. **`web-parity/web-payload-carries-the-same-resizehandler`** — `§1t1540s0§.as:269-320`
   declares 800 / 480 / 690 in the web build. The canvas parity hole is closed.
2. **`android-blobs/shs3resource-decrypts-1912-equipment-symbols`** — key 104, 1,912 symbols,
   the entire equipment roster.
3. **`android-blobs/blob-xor-key-is-per-file-not-109`** — the key is
   `resourceFileNameArray[n].charCodeAt(1)`: 104 / 117 / 111 / 109 / 103. And it is not a
   plain XOR — bytes 3..255 only, with an `i % 11` swap. All five blobs decrypt and inflate.
   Corrects Stage-0 C1.
4. **`art-anim-audio-feel/startshake-first-arg-is-duration-not-amplitude`**.
5. **`android-blobs/farthest-plane-also-has-a-blur-cutoff`** — plus the fifth gcount=4 record.
6. **`enemies-ai/npc-die-has-four-paths-before-the-seven-way-dice`** — `NPC.as:909` bare
   launched death, `:914` downed death, `:926-954` seppuku with its own 3-way emitter dice,
   `:1084` plain behead, and only then `:1005 Math.random() * 7`. `StatsManager.censored`
   gates the emitters on every one.
