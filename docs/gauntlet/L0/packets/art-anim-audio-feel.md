# LEDGER PACKET — `art-anim-audio-feel`

> **This is the ONLY evidence you may cite.** Every id below was JUDGED by blind
> artifact-citing critics and SURVIVED (GAUNTLET.md §0). Cite one inline as
> `[[id]]`, exactly as written. Gate **L0-B** resolves every reference against the
> pooled verdicts and goes RED on anything unjudged, refuted, or invented — so a
> claim id you do not see here cannot enter the ledger, and neither can a
> plausible-looking one you compose yourself.

**36 surviving overturns · 6 true-but-rejected · 53 corroborating.**

---

## The ledger text you are rewriting, verbatim

```markdown
| **art-anim-audio-feel** | 56 | motion (15fps latch, gaits, slash frames, death), byte-exact palette | **all audio** (SFX + music params); font; FX blend modes; screen-shake/hitstop |
### art-anim-audio-feel — 56
- **Ready (strongest slice):** 15fps pose latch; walk + run gaits; per-stance slash frames; hit-stagger; death collapse; proportions; combat-crouch idle; flat-vector bold-outline style; **byte-exact HUD/result palette**; blade-trail colors; kill-beat.
- **Blockers:** ① **ALL AUDIO** — every SFX + music param is INFERRED, no composer sourced. *But not unclosable:* ≥3 isolated music-bed rips exist on YouTube (menu/battle/mine) + a 2012 dev trailer — a **listen-pass (watch skill) on the longplay audio + rips** characterizes them (study-only, legal). ② font (unidentified). ③ FX **blend modes**; ④ **screen-shake** + **hitstop-on-landed-hit** (never catalogued); ⑤ severed-limb death variant.
- **Surface:** hit-tint scaling (7/12/16f), death sword-detach, dash-snap, scarf physics, FINISHER_FLASH — all measured/authored but missing from the art digest §5.
```

---

## ① Surviving overturns — these REWRITE the lines they name

A critic opened the sentence, read it in context, and ruled that it falls.

### `[[NF-E/bindata-parity-map-21-of-27-identical-and-a-spider-only-in-web]]` — UPHELD [A3] (3 critics)

md5 census of all 27 web bindata blobs against all 42 android blobs: 21 are BYTE-IDENTICAL, including 108_1t4635s0.bin == 99_MCSCharacter_HumanAnimationData.bin (so the severed-limb deaths deathnohand/deathnohead/deathinhalf are v0.717, not android-only) and 103_1t4630s0.bin == 94_MCSCharacter_Human2AnimationData.bin (so the two 8-frame flinch clips are provably shared). Six differ: ogre (100, 184,193 vs 184,120), skills (102, 333,768 vs 338,096), guardian (111, 117,638 vs 117,596), spear (113, 153,258 vs 132,270), survivalmodedata (119) — and 114_1t4641s0.bin, a SPIDER animation set of 10 anims (spider_idle, spider_walk, spider_attackstart, spider_attackend, spider_lunge, spider_death, spider_flinch, spider_descend, spider_dig, spider_death2) with NO android counterpart at all. An enemy type that exists only in the target build.

- **Cite:** `reference/extracted/bindata/ (27 files) hashed against reference/extracted/android/ (42 files) + docs/gauntlet/L0/index/bindata.json child_ids for 114_1t4641s0.bin`
- **Build:** web v0.717 vs android v0.682
- **KILLS this line:** "⑤ severed-limb death variant."
- **Lane impact:** art-anim ⑤ closes at the TARGET build, not merely at v0.682; enemies-ai gains an unlisted enemy (spider) that no ledger system mentions; and the lane gets a hard parity map saying which animation assets may be ported from android and which may not.

### `[[NF-F/audio-recovered-13-waveforms-against-43-web-cue-names]]` — UPHELD [A2] (2 critics)

The SFX side of the audio blocker is closed on both halves, with a precise residual. The DECRYPT is not a whole-file XOR — ResourceManager.decryptByteArray touches only bytes 3..255, swapping ba[i] with ba[i+256] when i%11==0 and then XORing with charCodeAt(1) of the resource name, which is why the raw blob already reads 'CWS' and a naive XOR fails. For Mobile_SoundResource the key is 'o' = 111; the result is a valid CWS v17 SWF (filelen 29,631, inflate 29,623) carrying 13 DefineSound tags and a SymbolClass table naming every one: punch, fart, hitmetal, goodkoto, slash1, slash2, die1, refund, die3, slash3, sumo, die2, deflect. Separately, the WEB payload's own source names 43 distinct "Snd_*" cues at live call sites. So the residual is exact: 13 waveforms recovered, 43 cue names known, 30 cues with no PCM in blob 122.

- **Cite:** `reference/extracted/android/122_Mobile_SoundResource.bin decoded per reference/decompiled/shs3_android/scripts/ResourceManager.as:200-217 and Mobile.as:352 + my grep over reference/decompiled/shs3_payload/scripts/ with call sites at reference/decompiled/shs3_payload/scripts/§1t113s0§.as:472 and :478`
- **Build:** both (waveforms android blob; cue names web source)
- **KILLS this line:** "- Blockers: ① ALL AUDIO — every SFX + music param is INFERRED, no composer sourced."
- **Lane impact:** L6 art-anim-audio-feel ①: 'every SFX is INFERRED' is false twice over — 13 SFX exist as real PCM and 43 are named with trigger points in web source. The honest remaining gap is 30 named cues without waveforms, not 'all audio'.

### `[[NF-F/two-animation-blobs-are-md5-identical-web-to-android]]` — UPHELD [A3] (2 critics)

Two of the animation blobs are byte-identical between builds, which promotes two art-anim findings from v0.682 to the target build. md5(reference/extracted/bindata/108_1t4635s0.bin) == md5(reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin) == bcfd658e79fafb41f52431afb7d10622 (977,277 bytes each) - so the 158 human anims, including deathnohand/deathnohead/deathinhalf, ship in web v0.717. md5(reference/extracted/bindata/103_1t4630s0.bin) == md5(reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin) == 6852a591ab2d5895090b3d37ccec9ba2 (135,328 bytes each) - so the 8-frame flinch and flinch_weapon clips ship in web v0.717. Note this is NOT the circular diff C2 forbids: bindata/ is extracted from the WEB payload, not from the android blobs.

- **Cite:** `reference/extracted/bindata/108_1t4635s0.bin vs reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin; reference/extracted/bindata/103_1t4630s0.bin vs reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin`
- **Build:** both (byte-identical)
- **KILLS this line:** "⑤ severed-limb death variant."
- **Lane impact:** art-anim-audio-feel + enemies-ai: RR:240 (5) and the stagger half of RR:220 (3) close at the TARGET build, not merely at v0.682. Also a reusable method - the bindata/ <-> android/ md5 join is the one legitimate way to discharge the S0-3 parity caveat per asset.

### `[[NF-G/43-web-sfx-cues-refiled-without-the-dead-s0-5-clause]]` — UPHELD [A2] (2 critics)

Re-filing the SFX cue inventory stripped of the superseded audio-encryption claim that auto-refuted its parent. The web v0.717 payload's decompiled classes carry exactly 43 distinct "Snd_*" string literals, each at a live call site, so the cue set and its trigger map are HELD from primary web source: Snd_addStat, Snd_back, Snd_birds1/2/3, Snd_bowFire, Snd_bowFireMany, Snd_challenge, Snd_click, Snd_criticalDamage, Snd_deflect, Snd_die1/2/3, Snd_drop, Snd_equip, Snd_error, Snd_fart, Snd_goodKoto, Snd_hitMetal, Snd_jump, Snd_mail, Snd_menu, Snd_menuClose, Snd_mining, Snd_ninja, Snd_notification, Snd_punch, Snd_put, Snd_refund, Snd_rimshot, Snd_sadTrombone, Snd_slash1/2/3, Snd_smallClick, Snd_smokebomb, Snd_sumo, Snd_upgradeSkill, Snd_wrAttack, Snd_wrDeploy, Snd_wrMove, Snd_wrScout. Trigger example verified: §1t113s0§.as:472 fires Snd_smallClick on a legal stance switch and :478 fires Snd_error on a refused one; §1t113s0§.as:352 fires Snd_criticalDamage the tick the Focus bar reaches full. Per correction C3 the waveforms are recovered separately, so this is a manifest, not a consolation prize.

- **Cite:** `reference/decompiled/shs3_payload/scripts/ (own grep -rhoE '"Snd_[A-Za-z0-9_]+"' | sort -u | wc -l -> 43) + reference/decompiled/shs3_payload/scripts/§1t113s0§.as:472, :478, :352`
- **Build:** web v0.717
- **KILLS this line:** "- Blockers: ① ALL AUDIO — every SFX + music param is INFERRED, no composer sourced."
- **Lane impact:** L6 art-anim-audio-feel: 'every SFX is INFERRED' is false. A 43-cue manifest with real trigger points exists in the target build and can be authored against directly.

### `[[actionscript/adaptive-music-system]]` — UPHELD [A2] (2 critics)

Music is a 13-stem adaptive layer system driven by 18 named states with an explicit preset matrix, phase-locked stem entry and a ±0.05-per-frame (0.833 s at 24 fps) crossfade; the stem and SFX names are verbatim in BOTH builds, so 'all audio is INFERRED' is wrong about everything except the waveforms.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t133s0§.as:115-127, :306, :334 (web v0.717) · state matrix reference/decompiled/shs3_android/scripts/MusicManager.as:12-46 and :133-187 and :301/:329 · SFX at SoundManager.as:197-352`
- **KILLS this line:** "① ALL AUDIO — every SFX + music param is INFERRED, no composer sourced."
- **Lane impact:** L-art-anim-audio-feel: blocker ① materially reduced — architecture, stem inventory, state machine, mixing rule and fade constant all held; the ledger's proposed YouTube listen-pass becomes validation of a known 13-stem structure rather than blind characterisation.

### `[[actionscript/screenshake-and-killbeat]]` — UPHELD [A2] (2 critics)

Screen-shake exists, is parameterised and self-decays (default amplitude 30 px, uniform ±amp/2 on both axes, amplitude tapering as min(amt, remaining frames)); the kill beat is a separate global redFreeze state budgeted at 24*6 = 144 frames — and there is NO per-hit hitstop.

- **Cite:** `reference/decompiled/shs3_android/scripts/StageManager.as:1200-1228 (shake) and :1075-1106 with stepped release at :903/:916/:926 (redFreeze); call sites MCSPlayer.as:4180 (12f), :911 (12f), :946 (24f), Trap_CrusherBlockAuto.as:88 (6f), Trap_CrusherColumnAuto.as:90 (6f), HeavenlySwordProjectile.as:76 (12f)`
- **KILLS this line:** "④ screen-shake + hitstop-on-landed-hit (never catalogued)"
- **Lane impact:** L-art-anim-audio-feel (blocker ④), L-combat-core (feel). Screen-shake is now fully catalogued with per-event durations at 24fps. The honest other half: hitstop-on-landed-hit does NOT exist — the only global time-stop is the 6-second kill-beat redFreeze, which fans out to gameStage, NPCManager, ProjectileManager, ParticleSystemManager and the player.

### `[[actionscript/slash-frames-ordering-conflict]]` — UPHELD [A2] (2 critics)

The shipped per-stance slash clip table contradicts the project's SLASH_FRAMES config in ordering: the original's Heavy horizontal slash has the SHORTEST windup (5 frames) and shortest total (21), while Light has the longest (13 windup, 29 total) — the opposite of the config's 'Heavy is slowest, only recovery varies'.

- **Cite:** `reference/extracted/anim_xml.txt (light/balanced/heavy/dual horslash parta–partd) · conflicting config src/config/timing.ts:37-41 · frame rate reference/decompiled/shs3_android/scripts/Mobile.as:117`
- **KILLS this line:** "Ready (strongest slice): 15fps pose latch; walk + run gaits; per-stance slash frames; hit-stagger; death collapse; proportions…"
- **Lane impact:** L-art-anim-audio-feel: demotes a §2 'Ready (strongest slice)' item. Stated honestly — this is payload-vs-video, not frame-vs-doc, so the §0 'frame wins' override does not apply; the cheap resolving test is to measure light-vs-heavy WINDUP (mouse-down to first blade motion) on the longplays, where the payload predicts Heavy commits ~2.6x faster.

### `[[android-blobs-hunter/audio-decrypts-26-named-mp3-streams]]` — UPHELD [A2] (1 critic)

The audio blocker is not a wall. ffdec cannot open 113_Mobile_MusicResource and 122_Mobile_SoundResource because they are XOR-obfuscated BEFORE the SWF header; applying the shipped key schedule turns both into ordinary CWS v17 SWFs that inflate and parse. Each holds 13 DefineSound tags, all MP3, 11025 Hz, 16-bit, mono, each bound to a SymbolClass name: music bgm_lose 3.53s, safepercussion/safekoto/safeambience 80.01s each, bgm_levelup 29.78s, bgm_gangnam 3.63s, flutes 80.01s, dungeonpiano/dungeonpercussion/dungeonflute/dungeonambience 45.74s each, battledrums 80.01s, battlechants 80.01s; sfx deflect 0.79s, die1 0.48s, die2 0.66s, die3 0.87s, slash1 0.35s, slash2 0.56s, slash3 0.27s, hitmetal 0.52s, punch 0.31s, sumo 2.90s, refund 0.73s, goodkoto 1.57s, fart 0.42s. The stem structure is itself a design fact: the 'safe' and 'dungeon' beds are 4 and 4 co-length stems (80.01s and 45.74s) - layered adaptive music, not single tracks. I did NOT listen to or grade any of it; I read tag headers only.

- **Cite:** `reference/extracted/android/113_Mobile_MusicResource.bin and 122_Mobile_SoundResource.bin, decrypted with reference/decompiled/shs3_android_payload/scripts/ResourceManager.as:206-217 keyed from Mobile.as:352 (charCodeAt(1) => 'u'=117 and 'o'=111); 13 DefineSound + 13 SymbolClass entries each`
- **Build:** android v0.682
- **KILLS this line:** "S0-5: audio is HELD but ENCRYPTED (nested "CWS" SWFs ffdec cannot open). You may NOT claim audio is recovered."
- **Lane impact:** L6 art-anim-audio-feel. The 'ffdec cannot open it' half of S0-5 is dead - the containers open with the game's own key schedule. What survives of S0-5 is only the honest part: nobody has listened to or graded the audio. A named, timed, format-known 26-cue manifest replaces a black box, and the 4-stem adaptive beds are a mechanic the ledger has nowhere.

### `[[android-blobs/bgdata-is-a-parallax-spec]]` — UPHELD [A2] (2 critics)

123_Mobile_BGData is a 49-background parallax specification holding 874 authored layer instances across five depth planes with per-background scroll and wrap overrides — and no ledger system mentions backgrounds, parallax or layer counts at all.

- **Cite:** `reference/extracted/android/123_Mobile_BGData.bin:4-13 (623 lines, root <bgdata>, 49 <bg>)`
- **Build:** android v0.682 (no web counterpart exists — see web-payload-holds-zero-data-roots)
- **KILLS this line:** "Ready (strongest slice): 15fps pose latch; walk + run gaits; per-stance slash frames; hit-stagger; death collapse; proportions; combat-crouch idle; flat-vector bold-outline style; byte-exact HUD/result palette; blade-trail colors; kill-beat."
- **Lane impact:** L6 art-anim + L1 world-exploration: an omission. The art 'Ready' list is fighter-only and the world list is node-graph-only; the scene behind and in front of the fighter — 49 named locations, five parallax planes, 874 layer slots — is in neither. The 49 names match the 49 BG_* symbols exported by the decrypted 120_Mobile_BGResource one-for-one.

### `[[art-anim-audio-feel/NEW-24hz-killbeat-is-web-parity-closed]]` — UPHELD [A2] (2 critics)

The 24 Hz tick and the 144-tick kill-beat are NOT Android-only. The obfuscated web payload carries the identical redFreeze constants in the identical control structure, so the v0.717-vs-v0.682 caveat on the kill-beat measurement can be struck.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1525s0§.as:1026, :1049, :1225, :1230 — against reference/decompiled/shs3_android/scripts/StageManager.as:903, :926, :1096, :1101`
- **Build:** both
- **KILLS this line:** "Ready (strongest slice): 15fps pose latch; walk + run gaits; per-stance slash frames; hit-stagger; death collapse; proportions; combat-crouch idle;"
- **Lane impact:** L6 art-anim-audio-feel: the 6.000 s red freeze I measured twice in reference/videos/Nr4fQstqHDM.mp4 is against a WEB recording, and the WEB code sets the same 144 ticks — so 24.0 Hz is a web-build fact, not an Android inference. The ledger's '15fps pose latch' is a description of the 15 fps capture, and the sim clock is 24 Hz. This is the general lesson for the whole lane: the obfuscated web payload can be used to check Android-derived constants by structural match even when the symbol names are gone.

### `[[art-anim-audio-feel/adaptive-music-engine]]` — UPHELD [A2] (8 critics)

The adaptive-music engine is fully specified: 17 presets are boolean masks over the 13 stems, crossfades move volume by exactly ±0.05 per tick (~0.83 s at 24 fps), and a newly-enabled stem starts at the playhead of the currently-playing anchor stem so layers enter phase-locked.

- **Cite:** `reference/decompiled/shs3_android/scripts/MusicManager.as:115-190 (stem table + presets), :206 (phase lock), :301 and :329 (fade rate), :279 (loop on SOUND_COMPLETE); SoundManager.as:114-173 (pickMusic BG switch)`
- **KILLS this line:** "all audio (SFX + music params)"
- **Lane impact:** art-anim-audio-feel: the §2 scorecard's blocking phrase 'music params' is void — the params are literal constants in the shipped client, including the per-background preset routing table.

### `[[art-anim-audio-feel/anim-loop-flag]]` — UPHELD [A2] (2 critics)

The animdata carries a third attribute the survey missed — l="1" marks a LOOPING animation, present on 102 of the 487 anims, parsed into AnimData.looping and read by MCSCharacter, so every stance idle, gait and *_partb slash tail cycles rather than latching on its final pose.

- **Cite:** `reference/decompiled/shs3_android/scripts/AnimData.as:10 and :16; MCSCharacter.as:1293; measured across reference/extracted/bindata/*.bin (102 of 487 <anim> carry l="1")`
- **KILLS this line:** "Ready (strongest slice): 15fps pose latch; walk + run gaits; per-stance slash frames; hit-stagger; death collapse; proportions; combat-crouch idle;"
- **Lane impact:** L6 art-anim-audio-feel: completes the motion contract. The survey's model (24 Hz stream + code-added duration tails + hold-on-final-pose) is only the non-looping path; 21% of authored motion loops instead, and it is exactly the motion a duel spends most of its time in. A rebuild following the survey as written will freeze the stance idle. Also confirms across ALL 487 anims (not the survey's 4-anim sample) that @d == the <f> count with zero mismatches.

### `[[art-anim-audio-feel/animdata-code-injected-hold-table]]` — UPHELD [A2] (2 critics)

Because the animation data authors zero hold frames (487/487 rows have @d == len(<f>)), every hold in the game comes from one hard-coded table in AnimData's constructor: a switch on the animation name that adds a per-animation duration tail, then MCSCharacter's frameList.length guard latches the last pose for the extra ticks. ~35 named entries with tails from +2 to +50: all 13 *SLASH_POSE states +10, all 10 *FALLSLASH_END / *JUMPSLASH_LAND +15, sheathesword/sheathesword3 +24, six death anims + KNEEGROIN_VICTIM +6, gotlauncheddownedend +24, downstab_up +10, katanaattack +8, katanadropdown +4, firearrow +10, throwgrenade +12, ogre_nap1_mid +48, DEATHTOUCH_PARTA +50, FLURRY_POSE / CLEAVE_POSE / JUTSU_GROUND_PARTB / GUARDIAN_STOMPFREEZE / AIRSTAB_STAB +24.

- **Cite:** `reference/decompiled/shs3_android/scripts/AnimData.as:16-21 (duration = xml.@d, frameList built from xml.f) and :23-141 (the switch(xml.@i.toString()) tail table); reference/decompiled/shs3_android/scripts/MCSCharacter.as:1316 and :1334`
- **Build:** android v0.682 (the 19 web animdata blobs the table keys on are the WEB build's, and their names match)
- **KILLS this line:** "Ready (strongest slice): 15fps pose latch; walk + run gaits; per-stance slash frames; hit-stagger; death collapse; ..."
- **Lane impact:** This is the actual 'pose latch' spec the ledger calls rebuild-ready but never contains. Every slash recovery window in a recreation is (@d from data) + (this table's tail), played at 24 Hz. It is also directly testable: a rebuild can assert @d == len(<f>) as a data-integrity gate on import.

### `[[art-anim-audio-feel/audio-recovered-not-encrypted]]` — UPHELD [A3] (8 critics)

The audio is RECOVERED, not encrypted: 122_Mobile_SoundResource.bin decodes with the known payload transform at XOR key 111 into a valid CWS v17 SWF holding 13 DefineSound tags plus a SymbolClass table naming every SFX, all extracted to playable MP3 and verified with an independent decoder.

- **Cite:** `reference/extracted/android/122_Mobile_SoundResource.bin decoded with reference/tools/payload_decode.py transform at key=111 -> CWS v17, declared len 29,631, zlib body inflates to 29,623 B; macOS afinfo on the extracted slash1.mp3`
- **KILLS this line:** "① ALL AUDIO — every SFX + music param is INFERRED, no composer sourced."
- **Lane impact:** art-anim-audio-feel (this unit): blocker ① deleted; the SFX lane flips from 'invent a WebAudio synth' to 'match a reference file'. Also overturns Stage-0 finding S0-5 ('You may NOT claim audio is recovered') for all five CWS blobs, which unblocks ui-hud (ImageResource portraits), world-exploration (BGResource, 49 named backgrounds) and items-equipment (SHS3Resource, 1,949 part sprites).

### `[[art-anim-audio-feel/blend-modes-none-at-byte-level-web]]` — UPHELD [A3] (2 critics)

'No blend modes' is provable at byte level and in the WEB build, not just by an AS3 grep: zero of 2,091 PlaceObject3 tags across the web payload, the android payload and all three decoded resource SWFs set the HasBlendMode flag.

- **Cite:** `my recursive DefineSprite/PlaceObject3 walker over reference/decrypted/shs3_payload_decoded.swf, reference/decrypted/shs3_android_payload_decoded.swf, and my decodes of 115_Mobile_SHS3Resource (k=104), 120_Mobile_BGResource (k=103), 124_Mobile_ImageResource (k=109)`
- **KILLS this line:** "③ FX blend modes;"
- **Lane impact:** L6 art-anim-audio-feel: closes blocker ③ with the RIGHT kind of evidence. Flash stores authored blend modes in PlaceObject3, not in code, so the survey's AS3 grep could not have settled this; the byte scan can, and it also carries web parity the grep could not. Positive side-finding for the render budget: 263 sprites in the web payload DO carry filter lists and 54 use cacheAsBitmap.

### `[[art-anim-audio-feel/font-identified]]` — UPHELD [A2] (8 critics)

The font blocker is closed with embedded font programs and vendor copyright strings: the display face is Edo SZ (© 2008 Vic Fieger), alongside EPSON Taigyousho B, Adobe Gothic Std B and MS UI Gothic.

- **Cite:** `DefineFontName tags in reference/extracted/android/115_Mobile_SHS3Resource.bin (key=104), font ids 307/12/61/161, and 124_Mobile_ImageResource.bin (key=109), font id 76`
- **KILLS this line:** "② font (unidentified)."
- **Lane impact:** art-anim-audio-feel blocker ② deleted, and ui-hud gets the text face for every HUD string. Stronger than Stage-0 S0-2 (which had only face="Edo SZ" in ui_strings.txt): we now hold the font programs themselves in two independent containers. LICENCE FLAG: Edo SZ is Vic Fieger's, not Lut's — third-party, outside the owner grant; identify, do not redistribute.

### `[[art-anim-audio-feel/glow-filters-are-the-real-fx-answer]]` — UPHELD [A3] (2 critics)

The shipped web payload authors 205 GlowFilter placements (plus 57 Blur and 2 DropShadow) in PlaceObject3 tags, so blocker ③'s real answer is 'no blend modes, but glow everywhere' — not 'one class with ColorTransform + Blur + ColorMatrix'.

- **Cite:** `my recursive SWF tag scan of reference/decrypted/shs3_payload_decoded.swf: 827 DefineSprite, 7,196 PlaceObject2, 304 PlaceObject3, 0 with PlaceFlagHasBlendMode, 262 filter placements = 205 GlowFilter / 57 BlurFilter / 2 DropShadowFilter across 71 sprites`
- **KILLS this line:** "③ FX blend modes;"
- **Lane impact:** art-anim-audio-feel: blocker ③ is closed correctly only as 'zero blend modes, 205 authored glows'. Also methodological — an ActionScript grep is the wrong instrument for a Flash compositing question, because blend modes and filters are authored into PlaceObject3, not code; the byte scan must be the cite. Cross-lane into ui-hud: at least one glow-bearing sprite is a named UI portrait.

### `[[art-anim-audio-feel/killbeat-6000ms-pins-24hz-tick]]` — UPHELD [A1] (2 critics)

The end-of-battle red freeze measures exactly 6.000 s (360 frames at 60 fps) twice independently, which is redFreezeCounter = 24*6 = 144 ticks and pins the simulation tick rate at 24.0 +/- 0.3 Hz - frame-confirming both the 24 Hz clock and the kill-beat number, and proving the 15 Hz on-screen cadence is the capture rate, not the game.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4, my 60 fps extraction + red-fraction (>0.65 of a 64x36 downscale) measurement at t=514-526 and t=585-597; against reference/decompiled/shs3_android/scripts/StageManager.as:1101`
- **KILLS this line:** "Ready (strongest slice): 15fps pose latch; walk + run gaits; per-stance slash frames; hit-stagger; death collapse; proportions; combat-crouch idle;"
- **Lane impact:** art-anim-audio-feel: raises claim 24fps-keyframe-stream from PARTIAL to frame-confirmed HELD, and confirms claim kill-beat-timings from the frame side. The ledger's '15fps pose latch' is a correct description of the VIDEO and a wrong description of the GAME - the sim ticks at 24 Hz and both uploads were recorded at 15 fps. Bonus: the code's normal exit is at counter==24 (5.0 s), so measuring 6.0 s twice proves the SHEATHESWORDCHIBURI branch at StageManager.as:916 is the common case.

### `[[art-anim-audio-feel/music-is-13-stems-and-18-layer-presets]]` — UPHELD [A2] (2 critics)

The music system is an adaptive layered-stem mixer, not an 18-track jukebox. MusicManager declares 13 TRACK_* stems (TOTALTRACKS = 13) — exactly the 13 DefineSound names in the decrypted 113_Mobile_MusicResource — and builds each of the 18 MUSIC_* presets as a boolean layer mask over those stems, e.g. MUSIC_TOUGHBATTLE = flutes + battledrums + battlechants, MUSIC_DUNGEONCREEPYDANGER = dungeonambience + dungeonflute + dungeonpercussion + dungeonpiano, MUSIC_DOJO = flutes + safeambience + safekoto + safepercussion, MUSIC_QUIET = flutes alone. Stems are loop-length-matched (882,144 or 504,288 samples) so the layers stay phase-locked.

- **Cite:** `reference/decompiled/shs3_android/scripts/MusicManager.as:50-76 (TRACK_BATTLECHANTS=0 .. TRACK_LOSE=12, TOTALTRACKS=13) and :133-186 (presetsArray construction); stem names and sample counts from reference/extracted/android/113_Mobile_MusicResource.bin decrypted per ResourceManager.as:200-216`
- **Build:** android v0.682
- **KILLS this line:** "| art-anim-audio-feel | 56 | ... | all audio (SFX + music params); font; FX blend modes; screen-shake/hitstop |"
- **Lane impact:** Corrects claim bindata/audio-inventory-is-held's '18 music presets with explicit ids' framing — a recreation that synthesises 18 separate tracks reproduces the wrong system. It needs 13 loop-locked stems plus a crossfade layer mask, with fade-in/fade-out actions (ACTION_FADEIN/ACTION_FADEOUT at :78-82).

### `[[art-anim-audio-feel/no-blend-modes]]` — UPHELD [A2] (8 critics)

The 'FX blend modes' blocker is answered in the negative: no game class ever sets a blendMode — the only hit across all 559 client classes is an mx framework interface the game never implements — and the entire compositing vocabulary is one class using ColorTransform, BlurFilter and a luma ColorMatrixFilter.

- **Cite:** `exhaustive grep for blendMode over reference/decompiled/shs3_android/scripts/ and reference/decompiled/shs3_payload/ (only hit: mx/core/IFlexDisplayObject.as:87-89); reference/decompiled/shs3_android/scripts/ColorCode.as:12-120`
- **KILLS this line:** "③ FX blend modes;"
- **Lane impact:** art-anim-audio-feel blocker ③ deleted: the answer is 'none — normal alpha only'. A recreation reaching for additive/screen blending on trails, tints or vignettes is diverging from the original. Corroborated visually by the A1 blade-trail crop (opaque, outlined, occluding).

### `[[art-anim-audio-feel/no-blendmode-holds-for-timeline-tags-too]]` — UPHELD [A3] (2 critics)

The no-blend-mode finding survives the check an ActionScript grep cannot do: every blend-mode flag in the shipped web client's timeline tags is false, 498 of 498.

- **Cite:** `grep -a -o -E '[a-zA-Z]*blendMode="[^"]*"' reference/extracted/payload.xml | sort | uniq -c ; plus my PlaceObject3 flag parse of the three decoded Android resource SWFs`
- **KILLS this line:** "③ FX blend modes;"
- **Lane impact:** art-anim-audio-feel: blocker 3 was closed on an AS3 grep alone, which cannot see a blend mode set in the Flash IDE (PlaceObject3 / DefineButton2 tag flags). I checked those and they are all off, so the 'none - normal alpha only' answer now covers authored timeline content too. A recreation may use plain alpha compositing with confidence.

### `[[art-anim-audio-feel/no-blendmode-in-authored-data]]` — UPHELD [A3] (2 critics)

No blend mode is set in the authored timeline data either, not just in ActionScript: zero PlaceObject3 tags carry the blend-mode flag across all five decoded resource SWFs.

- **Cite:** `my PlaceObject3 flag scan (top-level and nested inside every DefineSprite) of the decoded 115_Mobile_SHS3Resource, 124_Mobile_ImageResource, 120_Mobile_BGResource, 113_Mobile_MusicResource, 122_Mobile_SoundResource`
- **KILLS this line:** "③ FX blend modes;"
- **Lane impact:** art-anim-audio-feel: this is the half of blocker ③ a code grep structurally cannot answer, because in Flash a blend mode is normally authored on the timeline and rides in a PlaceObject3 tag without ever touching ActionScript. With both paths checked, 'none — normal alpha only' is now a closed result rather than an argument from absence.

### `[[art-anim-audio-feel/no-blendmode-in-swf-tags-either]]` — UPHELD [A3] (2 critics)

No blendMode is set at authoring time either: across 1,539 PlaceObject3 tags in the three decoded art containers, not one has the blend-mode flag set.

- **Cite:** `own recursive SWF tag walk (descending into DefineSprite bodies) over the decoded 115_Mobile_SHS3Resource, 120_Mobile_BGResource and 124_Mobile_ImageResource`
- **KILLS this line:** "③ FX blend modes;"
- **Lane impact:** art-anim-audio-feel: closes the remaining hole in blocker ③. An AS3 grep cannot see blend modes authored in the Flash IDE onto symbol instances — those live in the PlaceObject3 flag byte. Both channels now agree on 'none'. Any additive/screen blending in the recreation is an authored deviation.

### `[[art-anim-audio-feel/no-hitstop]]` — UPHELD [A2] (8 critics)

There is no hitstop on a landed hit anywhere in the client: the only time-freeze is STATE_FROZEN, set at exactly two sites (both the battle-intro bar), plus the end-of-battle redFreeze; gotHit sets a 12-tick reaction counter and no global freeze.

- **Cite:** `grep for hitstop|hitpause|freezeframe|slowmo|timeScale|hitFreeze over reference/decompiled/shs3_android/scripts/*.as returns zero hits; STATE_FROZEN set only at StageManager.as:162 and :212; MCSPlayer.as:3719`
- **KILLS this line:** "④ screen-shake + hitstop-on-landed-hit (never catalogued);"
- **Lane impact:** art-anim-audio-feel: the honest answer is 'the mechanism does not exist', so any hitstop in the recreation is an authored deviation and must be labelled. Graded PARTIAL, not HELD, because this is a negative from an exhaustive grep of one build rather than a positive artifact.

### `[[art-anim-audio-feel/npc-death-dice-is-seven-way]]` — UPHELD [A2] (2 critics)

The real death-variant distribution for human enemies is a seven-way dice in the NPC base class, not the goblin's five-way 40/20/20/20, and it contains two death animations plus a flying-weapon/flying-hat beat that the goblin path does not have at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:898 (override die), :1005 (the dice), :1005-1082 (the branches)`
- **KILLS this line:** "⑤ severed-limb death variant."
- **Lane impact:** art-anim-audio-feel: blocker ⑤ is closed, but with THIS distribution, not the goblin one. 31 of 34 Enemy* classes inherit it (only EnemyGoblin, EnemyGoblinThrower and EnemyZombie override). The `else` branch is also the source for the ledger's otherwise-unsourced 'death sword-detach' bullet — createFlyingWeapon() + createFlyingHat() + hair reveal is a named, code-driven beat. Cross-lane into enemies-ai: DEFEATED2 is suppressed during redFreeze, so the end-of-battle kill uses a different variant mix than mid-battle kills.

### `[[art-anim-audio-feel/screen-shake-amplitude-is-inert]]` — UPHELD [A2] (2 critics)

The screen-shake amplitude parameter is effectively dead for every in-game trigger: because shakeAmount = min(amt, counter) and every hard-coded call passes a duration of 24 or less against a default amt of 30, the amplitude is always just the remaining tick count — a pure linear ramp-down from the duration value.

- **Cite:** `reference/decompiled/shs3_android/scripts/StageManager.as:1200, :1225; call sites HeavenlySwordProjectile.as:76, MCSPlayer.as:911/:946/:4180, Trap_CrusherColumnAuto.as:90, Trap_CrusherBlockAuto.as:88, StatsManager.as:3535, Marker_RumbleTrigger.as:44`
- **KILLS this line:** "④ screen-shake + hitstop-on-landed-hit (never catalogued);"
- **Lane impact:** art-anim-audio-feel: sharpens blocker ④. The recreation should implement shake as `offset = uniform(-t/2, +t/2)` on both axes where t is the REMAINING tick count — a 12-tick Cleave shake starts at ±5.5 px and decays to 0, it never reaches ±15. The 30 default only ever binds through Marker_RumbleTrigger's data-driven amt. Also the full trigger set is 8 call sites, three more than the survey listed: HeavenlySwordProjectile.as:76 (12), Trap_CrusherBlockAuto.as:88 (6), StatsManager.as:3535 (data-driven).

### `[[art-anim-audio-feel/screen-shake-catalogued]]` — UPHELD [A2] (8 critics)

Screen-shake is fully catalogued: a uniform random offset within ±amt/2 on both axes every tick, default amplitude 30 px, auto-tapering over the final amt ticks via min(amt,counter), snapping back to the exact start position — and it keeps running while the action is frozen.

- **Cite:** `reference/decompiled/shs3_android/scripts/StageManager.as:1200-1227 (startShake/doShake), :826-830 (stepped outside the STATE_FROZEN gate); triggers at MCSPlayer.as:911 (Cleave, 12), :946 (Earthquake jutsu, 24), :4180 (player launched, 12), Trap_CrusherColumnAuto.as:90 (6), Marker_RumbleTrigger.as:9-11 (data-driven, defaults 24/30)`
- **KILLS this line:** "④ screen-shake + hitstop-on-landed-hit (never catalogued);"
- **Lane impact:** art-anim-audio-feel blocker ④ half-deleted, and §1's UNKNOWN-UNKNOWNS bullet 'screen-shake and hitstop-on-landed-hit (never catalogued)' plus §5 Tier-1's 'whether there's screen-shake / hitstop' are both closed without any frame-measuring.

### `[[art-anim-audio-feel/sfx-contract-ten-routines]]` — UPHELD [A2] (2 critics)

The SFX playback contract is ten routines covering all thirteen assets, not the four the survey mapped — the five unmapped include playHitMetal, which is fired on a shield hit alongside damage=0.

- **Cite:** `reference/decompiled/shs3_android/scripts/SoundManager.as:187/:221/:255/:268/:281/:294/:307/:320/:333/:346; EnemyShield.as:335-339`
- **KILLS this line:** "① ALL AUDIO — every SFX + music param is INFERRED, no composer sourced."
- **Lane impact:** L6 art-anim-audio-feel: completes blocker ①'s replacement. Every one of the 13 recovered assets now has a named trigger, so the SFX lane is a full asset->event table rather than a partial one. playHitMetal + damage=0 on PART_prop is also an L2 enemies-ai / L1 combat-core fact: shields nullify damage and answer with a distinct metal sound.

### `[[art-anim-audio-feel/sfx-playback-contract]]` — UPHELD [A2] (8 critics)

SFX playback params are held too: slash and death each pick 1-of-3 at random, hit and hurt both play the SAME 'punch' asset, and every call is a bare sound.play() — no SoundTransform, so volume 1.0, pan 0, no loop, no offset.

- **Cite:** `reference/decompiled/shs3_android/scripts/SoundManager.as:187-219 (playSlash), :221-253 (playDie), :255-279 (playHit/playHurt)`
- **KILLS this line:** "① ALL AUDIO — every SFX + music param is INFERRED, no composer sourced."
- **Lane impact:** art-anim-audio-feel: 'every SFX param is INFERRED' is false in both halves — the asset and its playback contract are both held. Note the shared punch asset: a recreation with separate hit/hurt sounds is a deviation.

### `[[art-anim-audio-feel/zero-blendmode-byte-proof]]` — UPHELD [A3] (2 critics)

The no-blend-mode negative is now a byte proof rather than a grep: 2,091 PlaceObject3 tags across all three decoded art containers and both decoded payloads carry zero blend-mode fields.

- **Cite:** `recursive PlaceObject3 parse (descending into every DefineSprite) of reference/extracted/android/115_Mobile_SHS3Resource.bin, 124_Mobile_ImageResource.bin, 120_Mobile_BGResource.bin, reference/decrypted/shs3_payload_decoded.swf, reference/decrypted/shs3_android_payload_decoded.swf`
- **KILLS this line:** "③ FX blend modes;"
- **Lane impact:** art-anim-audio-feel: blocker 3 closes on bytes, not on an ActionScript grep that could not have seen timeline-authored blend modes. Upgrades the survey's evidence class for the same conclusion.

### `[[art-anim/severed-limb-death-variant-is-held]]` — UPHELD [A2] (3 critics)

Art-anim blocker ⑤, 'severed-limb death variant', is dead. The Human animation blob authors three dismemberment-specific deaths alongside the ordinary ones: deathnohand (25 frames), deathnohead (31), deathinhalf (28), plus deathbyarrow (21) and deathwitharrow (23). The packet's animation claim aimed at blocker ③ and therefore left ⑤ standing by mis-aiming.

- **Cite:** `reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin — decoded utf-8-sig (NOT utf-16le) and regex-scanned for `<anim i="…" d="…">`; 158 anims total`
- **Build:** android v0.682 blob (asset, not tuning)
- **KILLS this line:** "⑤ severed-limb death variant."
- **Lane impact:** art-anim-audio-feel: blocker ⑤ closes outright. Also a standing correction to the gauntlet's own §0 note — 99_ and 94_ are UTF-8-with-BOM, not UTF-16LE; the UTF-16LE instruction produces mojibake and zero hits on these two files and will cause false refutations.

### `[[audio/RECOVERED-not-encrypted-resourcemanager-decrypt]]` — UPHELD [A2] (2 critics)

The audio is RECOVERED, not encrypted-beyond-reach. The game's own decryptor is in the repo: ResourceManager.decryptByteArray XORs bytes 3..255 with key = resourceFileNameArray[num].charCodeAt(1) AND swaps ba[i] with ba[i+256] whenever i%11==0. Applying it to all five Mobile_*Resource.bin files yields valid SWFs. 122_Mobile_SoundResource inflates to 29,623 bytes holding 13 DefineSound tags (deflect, die1, die2, die3, slash1, slash2, slash3, punch, hitmetal, fart, goodkoto, sumo, refund) and 113_Mobile_MusicResource inflates to 1,402,677 bytes holding 13 DefineSound music stems (bgm_lose, safepercussion, safekoto, safeambience, bgm_levelup, bgm_gangnam, flutes, dungeonpiano, dungeonpercussion, dungeonflute, dungeonambience, battledrums, battlechants) — all MP3, 11025 Hz, 16-bit, mono. These are byte-exact original assets, not characterisations from a YouTube rip. A plain whole-file XOR fails 68 bytes into the deflate stream, which is why every prior pass concluded 'unopenable'; the i%11 byte-swap is the missing step.

- **Cite:** `reference/decompiled/shs3_android/scripts/ResourceManager.as:200-216 (decryptByteArray), :186 (key = filename.charCodeAt(1)), :41 (resourceFileNameArray) applied to reference/extracted/android/122_Mobile_SoundResource.bin and 113_Mobile_MusicResource.bin`
- **Build:** android v0.682 (the container files ship in the Android build; the decrypt routine is build-agnostic)
- **KILLS this line:** "① ALL AUDIO — every SFX + music param is INFERRED, no composer sourced. · Exact original SFX & music synthesis params — the character is study-able from audio; the exact waveforms/envelopes are not."
- **Lane impact:** L6 art-anim-audio-feel: blocker ① is CLOSED, not half-open. Also overturns gauntlet law S0-5 ('audio is HELD but ENCRYPTED ... You may NOT claim audio is recovered') — that instruction is now false and every downstream claim resting on it should be re-opened. The listen-pass plan at :240 is superseded: there is nothing to characterise by ear, the waveforms are in hand.

### `[[bindata/487-anims-held-4-ported]]` — UPHELD [A3] (2 critics)

The 19 animdata blobs hold 487 animations / 5,596 keyframes / 81,706 joint transforms verbatim, against which the build ships 6 hand-authored poses and has ported exactly 4 animations — so the art-anim score is measured against video when the authored source is on disk, but the recovery work is 0.8% done.

- **Cite:** `tests/a11AnimData.test.ts (npx vitest run) + src/config/ogAnims.ts:39 + counts over reference/extracted/bindata/1[0-1][0-9]_*.bin`
- **KILLS this line:** "| art-anim-audio-feel | 56 | motion (15fps latch, gaits, slash frames, death), byte-exact palette | all audio (SFX + music params); font; FX blend modes; screen-shake/hitstop |"
- **Lane impact:** L-art-anim-audio-feel: the 56 is scored against video measurement when the authored source exists. HONEST COUNTER-WEIGHT, stated so this is not read as triumphalism: the byte-check gate that exists guards only 4 of 487 animations and only from file 108; a grep across src/, scripts/ and tests/ finds references to exactly one bindata file (108_1t4635s0), so the other 18 blobs are untouched. Data held ≠ data ported.

### `[[bindata/NEW-music-is-layered-stems-not-tracks]]` — UPHELD [A3] (2 critics)

The music system is layered STEMS, not a track list. 113_Mobile_MusicResource holds six stems at exactly 882,144 samples / 11,025 Hz = 79.872 s (battlechants, battledrums, flutes, safeambience, safekoto, safepercussion) and four at exactly 504,288 samples = 45.7 s (dungeonambience, dungeonflute, dungeonpiano, dungeonpercussion), plus three one-shots (bgm_lose 3.5 s, bgm_levelup 29.8 s, bgm_gangnam 3.6 s). Identical sample counts within a family is the signature of co-mixed layers, which is what MusicManager's TRACK_* indices select between. No ledger system holds a layered-music model.

- **Cite:** `reference/extracted/android/113_Mobile_MusicResource.bin decoded (k=117); my own DefineSound (tag 14) extraction with SymbolClass name resolution; reference/decompiled/shs3_android_payload/scripts/MusicManager.as:48+ (TRACK_BATTLECHANTS…)`
- **Build:** android v0.682
- **KILLS this line:** "① ALL AUDIO — every SFX + music param is INFERRED, no composer sourced."
- **Lane impact:** L6 art-anim-audio-feel: the 18-preset MusicManager enum is a MIXER state machine over ~13 stems, not 18 separate tracks. A WebAudio recreation should crossfade layers on the same loop clock, not swap files. This is a structural fact no ledger system holds.

### `[[questdata/severed-limb-deaths]]` — UPHELD [A2] (2 critics)

Severed-limb death variants are not missing — deathnohand, deathnohead and deathinhalf are named and used in shipped campaign cutscenes, alongside deathbyarrow and deathenemy.

- **Cite:** `reference/extracted/questdata.xml:18459, :18471, :18477, :24051, :24091`
- **KILLS this line:** "③ FX blend modes; ④ screen-shake + hitstop-on-landed-hit (never catalogued); ⑤ severed-limb death variant."
- **Lane impact:** L11 art-anim-audio-feel blocker ⑤ is closed: three severed-limb death states are named in shipped content, plus deathbyarrow, deathenemy, death, downed, corpse1/2/3 and defeatedanimationv1/v2.

### `[[ui-hud/typography-edo-sz]]` — UPHELD [A2] (8 critics)

HUD and tooltip typography is specified inside the WEB payload's own TextField defaults — Edo SZ at 13/14 px #cccccc for body and 16 px #ffffff for headings — so it carries no Android-build caveat.

- **Cite:** `reference/extracted/ui_strings.txt:100,206,314`
- **KILLS this line:** "② font (unidentified)."
- **Lane impact:** ui-hud lane supplies the missing spec for every HUD text field; also closes the art-anim-audio-feel blocker (2) 'font (unidentified)' with sizes, colours, letterSpacing and kerning attached, not just a face name (this extends Stage-0 finding S0-2).

## ② TRUE, but the line SURVIVES — do NOT delete anything for these

The finding held up; the overturn did not. 36% of claimed overturns were rejected this way. Bank the knowledge, keep the sentence.

### `[[art-anim-audio-feel/hit-reaction-is-a-ladder]]` — NOT-UPHELD [A2] (2 critics)

The hit-reaction window is not a single 12-tick number but a ladder of {12 default, 16, 24, 26, 84} plus 0/-1 sentinels, keyed on action state and body part — and hitting a shield enemy's weapon produces no reaction at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:1454-1465 and :1763-1768; EnemyShield.as:330-339; census of all 32 gotHitCounter assignments across reference/decompiled/shs3_android/scripts/*.as`
- **aimed at this line, which SURVIVES:** "hit-tint scaling (7/12/16f), death sword-detach, dash-snap, scarf physics, FINISHERFLASH — all measured/authored but missing from the art digest §5."
- **Lane impact:** L6 art-anim-audio-feel and L1 combat-core: reverses the survey's verdict. The recreation's 7/12/16-frame tint ladder is NOT an invention to be deleted — the original has its own ladder and it contains 12 and 16. The 84-tick (3.5 s) local-player redfreeze reaction and the shield's damage-nullifying PART_weapon/PART_prop cases are combat mechanics no ledger holds.

### `[[art-anim-audio-feel/hud-150-is-a-potato-buff]]` — NOT-UPHELD [A2] (2 critics)

The '150% DAMAGE' line in the reference frame is a consumable food-buff readout, not a stance modifier - and the shipped stance rock-paper-scissors multiplier is x1.2, not x1.5.

- **Cite:** `reference/extracted/itemdata.xml:237-249 (item 2115) resolved through reference/extracted/android/118_Mobile_Lang_EN.bin; reference/decompiled/shs3_android/scripts/MCSPlayer.as:3701-3703`
- **aimed at this line, which SURVIVES:** "hit-tint scaling (7/12/16f), death sword-detach, dash-snap, scarf physics, FINISHERFLASH - all measured/authored but missing from the art digest S5."
- **Lane impact:** art-anim-audio-feel: overturns the CAUTION inside claim art-anim-audio-feel/hit-reaction-12-ticks, which reads the HUD's '150% DAMAGE' as the stance modifier. It is neither the stance modifier nor a second 1.5 to avoid conflating - it is an active-buff readout from a type-10 consumable, paired with its restriction line 'CANNOT CHANGE STANCE'. Cross-lane: ui-hud gains an active-buff HUD element no ledger holds (buff name + restriction, bottom-left under the HP/Chi bars); combat-core gains the real stance-advantage number, x1.2, contradicting any 1.5 assumption; items-equipment gains the buff-item shape (type 10, modifier id 38, one buff active at a time).

### `[[art-anim-audio-feel/hud-150-is-potato-buff]]` — NOT-UPHELD [A2] (2 critics)

The '150% DAMAGE' line in the battle HUD is a consumable food buff, not the stance modifier and not the behead multiplier — the stance triangle is x1.2, and the string table names a whole potato-buff family with a one-buff-at-a-time rule.

- **Cite:** `docs/gauntlet/L0/index/strings.json entries 4132/4133/4134/4135/4229/4230 and 4125-4128/4227-4228 and 125; reference/decompiled/shs3_android/scripts/MCSPlayer.as:3701-3703; corroborated in reference/frames/duel_dense/Nr4fQstqHDM_432.0.png`
- **aimed at this line, which SURVIVES:** "hit-tint scaling (7/12/16f), death sword-detach, dash-snap, scarf physics, FINISHERFLASH — all measured/authored but missing from the art digest §5."
- **Lane impact:** Resolves the survey's own flagged-unreconciled CAUTION. L1 combat-core gains the real damage pipeline order — stance triangle x1.2, then minus getDefense(), then behead x1.5 — and learns the stance modifier is 1.2 not 1.5. L4 items-equipment / L3 economy gain a six-item consumable buff family with an exclusive-buff rule. L8 ui-hud gains the bottom-left HUD stack read off the frame: portrait, HP 20/20, AP 26/26, restriction line, active-buff line.

### `[[art-anim-audio-feel/no-hold-frames-across-all-487]]` — NOT-UPHELD [A3] (2 critics)

The 'data holds no hold frames' property is universal, not sampled: @d equals the <f> child count for every one of the 487 authored animations across all 19 web animdata blobs.

- **Cite:** `own scan splitting on <anim …> headers across every file in reference/extracted/bindata/ whose root is <animdata>`
- **aimed at this line, which SURVIVES:** "Ready (strongest slice): 15fps pose latch; walk + run gaits; per-stance slash frames; hit-stagger; death collapse; proportions; combat-crouch idle;"
- **Lane impact:** art-anim-audio-feel: the survey measured two blobs and generalized; the generalization is correct and now proven exhaustively. Every hold in the game is code-injected by AnimData's per-animation duration tail and held by the frameList.length guard in MCSCharacter.updateFrame — none of it is authored into the data. This is a directly testable invariant: a rebuild importing these blobs can assert `@d == len(<f>)` as a data-integrity gate.

### `[[art-anim-audio-feel/rig-is-27-parts]]` — NOT-UPHELD [A2] (2 critics)

The skeletal rig is 27 named parts indexed 0-26, not 21: the Human animdata keyframes 20 distinct node indices (0-7, 9-16, 18-21; crotch=8 and hat=17 are never keyframed) and the full index space across all 19 web blobs spans 0-26 with 25 in use.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:10-62; index census of reference/extracted/bindata/108_1t4635s0.bin and all 19 animdata blobs`
- **aimed at this line, which SURVIVES:** "motion (15fps latch, gaits, slash frames, death), byte-exact palette"
- **Lane impact:** L6 art-anim-audio-feel, and any lane building the fighter: the rig spec is 27 slots, with two weapon/prop slots (weapon=3, prop=4) plus prop2/prop3, and four extra joints (l/r_shoulder, l/r_knee) that only the creature rigs use. A 21-node rig is short. Also fixes the matrix-vs-rotation ratio: only 2.0% of node-frames use the skew matrix, discriminated by FrameNodeData's rotation==999 sentinel.

### `[[enemies-ai/NEW-npc-die-override-count-is-18-not-3]]` — NOT-UPHELD [A3] (2 critics)

18 of the 34 Enemy*.as classes override die(), not 3 — and only 3 of those 18 (Archer, Elite, TrainingDummy) call super.die(), so 15 classes bypass the seven-way NPC dice entirely. The seven-way dice governs the humanoid roster that does NOT override (Katana, Knife, Ninja, Shield, Spear, SpearElite, Civilian x3, Player, PlayerGiant, SorcererBoss, Fox, JiangSi, Wolf2, Clone-adjacent, Enemy_VegePatch).

- **Cite:** `grep -ln 'override public function die' over reference/decompiled/shs3_android/scripts/Enemy*.as (34 files), then a per-file body scan for super.die()`
- **Build:** android v0.682
- **aimed at this line, which SURVIVES:** "⑤ severed-limb death variant."
- **Lane impact:** L2 enemies-ai: corrects the lane_impact line inside claim art-anim-audio-feel/npc-death-dice-is-seven-way ('31 of 34 inherit it, only EnemyGoblin, EnemyGoblinThrower and EnemyZombie override'), which is false and must not enter the ledger. The death-variant model is a two-tier system: a humanoid seven-way base dice plus 15 fully custom creature/boss death routines.

## ③ Corroborating — new knowledge, no line deleted

These add or sharpen; they do not contradict.

### `[[NF-1-layered-music-is-both-builds]]` — UPHELD [A2] (1 critic)

The 13-stem / 18-layer-mask adaptive music system is WEB v0.717 parity, not android-only. The web payload's MusicManager loads the identical 13 stem names in the identical TRACK order (battlechants, battledrums, flutes, safeambience, safekoto, safepercussion, dungeonambience, dungeonflute, dungeonpercussion, dungeonpiano, bgm_gangnam, bgm_levelup, bgm_lose), declares TOTALTRACKS = 13, and builds 18 boolean preset arrays over them. This upgrades music-is-13-stems-and-18-layer-presets and NEW-music-is-layered-stems-not-tracks from 'android v0.682' to 'both builds' — the ARCHITECTURE is target-build fact even though the waveforms are v0.682.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t133s0§.as:115-127 (stem loads), :76 (§1t1730s0§:int = 13), :135-184 (18 preset arrays)`
- **Build:** both
- **Lane impact:** L6 art-anim-audio-feel: removes the v0.682 caveat from the music-system claims. A WebAudio recreation should crossfade 13 loop-locked layers under an 18-state mask, and that is now a WEB-build fact.

### `[[NF-10-no-web-audio-is-held]]` — UPHELD [A3] (1 critic)

No WEB audio exists in this repo, so the 26 recovered waveforms cannot be claimed as v0.717 assets. reference/preservation/ holds only shs3.swf, shs3preloader.swf, shs3_payload.swf, shs3_android_payload.swf and shs3_payload_version.swf — no soundresource.swf and no musicresource.swf, the two CDN files ResourceManager names. Neither decoded payload embeds a single sound: I parsed both tag streams (web 4,051 tags, android 3,311 tags) and DefineSound(14) = 0 in each. The web build streamed its audio from the dead strawhatsamuraiduels.com CDN.

- **Cite:** `reference/preservation/ (directory listing) + my tag histogram of reference/decrypted/shs3_payload_decoded.swf and shs3_android_payload_decoded.swf + reference/decompiled/shs3_android/scripts/ResourceManager.as:41`
- **Build:** web v0.717
- **Lane impact:** L6 art-anim-audio-feel: the caveat that must ride with every audio overturn, and the wording S0-5 should have had instead of 'you may not claim audio is recovered'. Same caveat applies to shipped-vector-art-yields-solid-fill-palettes — 115/120/124 are v0.682 resource files.

### `[[NF-12-web-swf-header-declares-24fps]]` — UPHELD [A3] (1 critic)

The WEB build's own SWF header declares frameRate = 24.000 (CWS, SWF version 17, frameCount 6); the Android payload header says 24.000 as well (CWS, version 26). This closes the android-provenance hole in the packet's two 24fps claims, whose only frame-rate cite was Mobile.as:117 — an Android-only wrapper line.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf and reference/decrypted/shs3_android_payload_decoded.swf — SWF header parse (sig/version/RECT skip/frameRate 8.8 fixed LE)`
- **Build:** both
- **Lane impact:** All lanes — the x2.5 rescale from OG frames to this repo's fixed 60Hz Sim is now grounded in the WEB artifact, not inferred from the Android wrapper. Every <anim d="N"> and every cooldown*24 converts at x2.5 with no build caveat.

### `[[NF-2-recovered-audio-is-android-only-web-audio-still-unheld]]` — UPHELD [A3] (1 critic)

The 26 byte-exact waveforms recovered by the ResourceManager decrypt are ANDROID v0.682 assets only. My own tag walk of the decoded WEB payload returns DefineSound (tag 14) = 0 and DefineBinaryData (tag 87) = 27 — the 27 matching S0-1's count of web bindata files, which validates the parser. A filesystem sweep of reference/ finds no web-side *SoundResource* or *MusicResource* container at all. So S0-5 falls, but only for Android; web v0.717 audio parity is STILL_UNHELD and every audio claim must carry that caveat.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf (my own SWF tag walk: DefineSound=0, DefineBinaryData=27)`
- **Build:** web v0.717
- **Lane impact:** L6 art-anim-audio-feel: blocker 1 closes for the ANDROID build's waveforms. The web build's own audio containers are not in this repo, so a 1:1 web-audio claim remains unheld.

### `[[actionscript/anim-format]]` — UPHELD [A2] (2 critics)

The animation system is a keyframe transform-matrix format, not sprite sheets: each <anim> carries a duration d and loop flag l, each <f> frame holds per-part nodes keyed by part index i with x/y plus either a rotation r or a full 2x2 matrix a/b/c/d — and all 13 stance slash POSE anims get a hard-coded +10 frame hold appended at parse time.

- **Cite:** `reference/decompiled/shs3_android/scripts/AnimData.as:12-42 and FrameNodeData.as:29-43`
- **Lane impact:** L-art-anim-audio-feel — this is the SCHEMA for the 19 <animdata> bindata blobs from Stage-0 finding S0-1 and the ~450 animations counted in S0-4, converting an unlabelled binary pile into a parseable animation library. The +10-frame pose hold is the code-side origin of the observed pose latch.

### `[[android-blobs/android-blob-encoding-census]]` — UPHELD [A2] (1 critic)

Exact encoding census of the 42 Android blobs, replacing '41 of 42 are plain UTF-8': 35 are UTF-8 text of which 18 carry a UTF-8 BOM, 1 is UTF-16LE, 5 are CWS binaries and 1 is a GIF.

- **Cite:** `reference/extracted/android/112_Mobile_NodeData.bin:1 (`<?xml version="1.0" encoding="utf-8"?>`), first-8-byte dump of all 42 files in reference/extracted/android/`
- **Build:** android v0.682
- **Lane impact:** Method, all lanes reading this unit. SHARPENS android-blobs/blobs-are-utf8-not-utf16, whose headline correction is right — only the string table is UTF-16LE, so grep line numbers on the XML blobs are trustworthy — but whose '41 of the 42' silently includes six binaries where grep is meaningless, and misses that 18 blobs carry a BOM that shifts byte offset 0. Anyone byte-slicing an animation blob rather than line-reading it will be three bytes off.

### `[[android-blobs/parallax-and-dof-contract]]` — UPHELD [A2] (2 critics)

XMLBG declares the complete parallax contract: a five-plane scroll ladder 0.25/0.333/0.5/1/2 and a blur ladder 8/4/0/4/8 that is SYMMETRIC about the player plane — a true depth-of-field with the focal plane on the fighter, not a monotone distance haze — plus groundY 400, contentWidth 1600 and wrapAround true.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLBG.as:10-58`
- **Build:** android v0.682
- **Lane impact:** L6 art-anim: STRENGTHENS the banked art-anim-audio-feel/depth-of-field-blur, which read BG_Loader.as call sites and reported 'observed constants 4 and 8'. The declaration site gives all five values, their plane assignment (the foreground is blurred as hard as the farthest layer — that is the half a call-site read cannot recover) and the scroll ladder the same layers use. groundY=400 is the authored standing line; contentWidth=1600 is two 800-px screens.

### `[[art-anim-audio-feel/150-percent-damage-is-a-potato-buff]]` — UPHELD [A2] (1 critic)

The HUD's '150% DAMAGE' is a consumable food buff, not the stance modifier and not the behead multiplier — the string table settles it in one lookup.

- **Cite:** `docs/gauntlet/L0/index/strings.json entry 4132 (and 125, 208); cross-checked against reference/decompiled/shs3_android/scripts/MCSPlayer.as stance-matchup branch `damage *= 1.2``
- **Lane impact:** art-anim-audio-feel: closes the survey's own 'CAUTION, un-reconciled' note, which was answerable from the evidence index it was handed. Cross-lane into combat-core (the stance-matchup bonus is x1.2, not x1.5), items-equipment (a timed consumable buff class exists) and ui-hud (an active-buff HUD row exists that no ledger system holds).

### `[[art-anim-audio-feel/150pct-damage-is-a-buff-not-the-stance-modifier]]` — UPHELD [A2] (1 critic)

The frame's '150% DAMAGE' HUD line is a consumable BUFF_ATTACK buff, not the stance modifier - the stance-triangle bonus is x1.2 in the same function, and the string table resolves both HUD lines outright.

- **Cite:** `docs/gauntlet/L0/index/strings.json ids 4132 and 125; reference/decompiled/shs3_android/scripts/MCSPlayer.as:3699-3703 and StatsManager.as:290; HUD text visible in reference/frames/duel_dense/Nr4fQstqHDM_432.0.png bottom-left panel`
- **Lane impact:** art-anim-audio-feel: closes the claim's own 'CAUTION, un-reconciled' note and closes it against the guess. Cross-lane into combat-core (the stance-triangle multiplier is 1.2, a hard number) and ui-hud (the player HUD panel is a buff/debuff stack, and 'CANNOT CHANGE STANCE' is a stance-restriction debuff line).

### `[[art-anim-audio-feel/16pct-of-frames-are-authored-holds]]` — UPHELD [A2] (1 critic)

16.0% of all authored animation frames (896 of 5,596 across the 19 web animdata blobs) contain zero <n> children — they are authored pose holds — so the motion is not 'one keyframe per tick'; ogre_walk and zom_idle alternate pose/hold every other frame, i.e. 12 Hz content inside the 24 Hz clock.

- **Cite:** `my parse of all 19 animdata blobs under reference/extracted/bindata/ (487 <anim>, 5,596 <f>, 896 with no <n>); per-anim worst cases zom_getup 49/95, zom_downedtocrawl 49/92, gangnam 44/88, ogre_death 28/54`
- **Lane impact:** art-anim-audio-feel: the animation player must support empty carry-forward frames as first-class holds, not treat @d == len(<f>) as proof that every tick is a new pose. The fighter's own core clips happen to be hold-free, which is why the surveyor's spot-check missed it; the creature sets are not.

### `[[art-anim-audio-feel/24hz-proven-on-web-build]]` — UPHELD [A3] (1 critic)

The 24 Hz animation clock is provable on the web v0.717 build itself, not only via the Android client or the Kongregate loader shell.

- **Cite:** `SWF header of reference/decrypted/shs3_payload_decoded.swf, decoded and parsed by me`
- **Lane impact:** art-anim-audio-feel: replaces the two weaker cites behind the 24 fps claim. The survey used shs3.swf (the loader shell — 2 frames, DoABC + SymbolClass, no game content) and Mobile.as:117 (Android). This one is the web payload's own header, so the clock carries no Android caveat and the PARTIAL on 24fps-keyframe-stream can be re-argued upward.

### `[[art-anim-audio-feel/690-is-a-friend-panel]]` — UPHELD [A2] (1 critic)

The 800x690 document rect is the 800x480 play area plus a conditionally-shown in-game friend panel with its own class, and the Android payload SWF's own rect is literally 800x480 — so the aspect question is settled by the payload alone, with no frame-vs-byte conflict.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:269-281; plus my SWF header parse of reference/preservation/shs3.swf, reference/decrypted/shs3_payload_decoded.swf and shs3_android_payload_decoded.swf`
- **Lane impact:** art-anim-audio-feel and ui-hud: the play area is 800x480 (confirming, not overturning, REBUILD_READINESS.md:117 and :171). Cross-lane into ui-hud and meta-social: an in-battle friend panel is a UI surface the 12-system board does not list, and it changes the letterbox geometry when the window is narrow.

### `[[art-anim-audio-feel/690-is-the-friend-bar-layout]]` — UPHELD [A2] (1 critic)

The 800x690 stage is not container chrome: it is the client's own friend-bar layout mode, entered whenever the window aspect falls to or below 800:690, in which stageBaseHeight becomes 690 and OverworldHUD's friendpanel is initialised into the extra 210 px.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:269-312 (resizeHandler)`
- **Lane impact:** L-ui-hud and L-meta-social: the game ships TWO responsive layouts, 800x480 and 800x690, and the 210 px delta is an in-game social friend panel nobody's ledger holds. Any HUD reconstruction must state which layout its fractions were measured in.

### `[[art-anim-audio-feel/NEW-hold-tail-table-is-the-animdata-constructor-switch]]` — UPHELD [A2] (1 critic)

The real per-animation hold table is a hard-coded switch in AnimData's constructor, not the XML. AnimData.as:15 copies @d verbatim from the data (which always equals len(<f>)), then :25-141 ADDS the tail: +10 for 'light_afterslashpose' and for all twelve *SLASH_POSE variants, +15 for the five *FALLSLASH_END and five *JUMPSLASH_LAND, +24 for 'sheathesword'/'sheathesword3' and 'gotlauncheddownedend', +6 for the whole death set, and ~25 more single cases running up to +50. This is the table a motion rebuild actually needs, and no amount of data extraction will find it.

- **Cite:** `reference/decompiled/shs3_android/scripts/AnimData.as:15, :25-26, :28-41, :43-53, :55-57, :58-66, :69, :105, :114, :141; reference/decompiled/shs3_android/scripts/MCSCharacter.as:1316 and :1334`
- **Build:** android v0.682
- **KILLS this line:** "Ready (strongest slice): 15fps pose latch; walk + run gaits; per-stance slash frames; hit-stagger; death collapse; proportions; combat-crouch idle;"
- **Lane impact:** L6 art-anim-audio-feel and L1 combat-core: this is the recovery-window table for every slash. Two counters exist — currentAnimationDuration (the @d + code tail, MCSCharacter.as:1316) and frameList.length (MCSCharacter.as:1334) — and the gap between them IS the pose latch. It is the correct replacement for the ledger's '15fps pose latch' shorthand and for the refuted claim art-anim-audio-feel/hold-frames-are-authored-in-data.

### `[[art-anim-audio-feel/android-web-byte-identity]]` — UPHELD [A3] (8 critics)

The Android-build caveat dissolves for animation: 14 of the 18 MCSCharacter animation blobs are MD5-identical between the Android v0.682 export and the web v0.717 payload, including Human, Human2 and all five stance sets.

- **Cite:** `MD5 over reference/extracted/android/*.bin vs reference/extracted/bindata/*.bin — 21 blobs identical overall`
- **Lane impact:** art-anim-audio-feel and every lane citing the Android build: Stage-0 S0-3's standing caveat ('this is the ANDROID build ... parity is NOT established') is now PROVEN for 14/18 animation sets by hash rather than assumed. Animation claims sourced from shs3_android are web-parity; audio claims are not (see the STILL_UNHELD claim).

### `[[art-anim-audio-feel/animdata-loop-and-reorder-attrs]]` — UPHELD [A2] (1 critic)

The animation XML carries two attributes no ledger system holds: 102 of the 487 anims are flagged looping, and 258 individual frames carry a per-frame z-order reorder flag that re-sorts the paperdoll mid-animation.

- **Cite:** `attribute census over all 19 animdata blobs in reference/extracted/bindata/; semantics from reference/decompiled/shs3_android/scripts/AnimData.as:16, FrameData.as:15-17, MCSCharacter.as:1306`
- **Lane impact:** art-anim-audio-feel: mid-animation part re-sorting is authored motion data that a naive renderer will get wrong (limbs will pop in front of the torso on turns). Also explains why a strict `<anim i=".." d="..">` regex undercounts to 385 — the true total is 487, and the survey's 487 is correct.

### `[[art-anim-audio-feel/animdata-loop-flag-parsing-trap]]` — UPHELD [A2] (1 critic)

The d-equals-frame-count invariant holds across ALL 19 web animdata blobs (487/487 anims, zero mismatches), but only under a robust parse: ~100 <anim> tags carry an extra attribute after d, so a strict regex silently drops them and manufactures phantom hold frames.

- **Cite:** `reference/extracted/bindata/*.bin - all 19 animdata blobs, parsed with `<anim\b([^>]*)>(.*?)</anim>` and compared against the strict `<anim i="X" d="N">` form`
- **Lane impact:** art-anim-audio-feel: strengthens art-anim-audio-feel/24fps-keyframe-stream from a 2-blob sample to a proven universal across all 487 authored animations - the data genuinely holds no hold frames anywhere, and every latch is code-added by AnimData's duration tails. Also a standing measurement warning for any lane re-deriving animation counts or durations from the bindata XML: parse `<anim\b[^>]*>`, never `<anim i=".." d="..">`, or you lose the looping animations and invent hold frames that are not there.

### `[[art-anim-audio-feel/blue-object-is-persistent-not-a-trail]]` — UPHELD [A1] (1 critic)

The large blue wedge in the duel footage is a persistent object anchored to the fighter's hands, present in 42 of 42 consecutive duel_dense frames spanning 6.0 s, so it cannot be the 5-frame self-removing bladeslashfx; the transient slash mark in this footage is red, not blue.

- **Cite:** `reference/frames/duel_dense/ all 42 PNGs 427.0-433.0; blue mask b>150 & b-r>110 & b-g>50 & g>60 restricted to y<960, x>400 to exclude the HUD AP bar; identification crops (640,540)-(990,775) at 427.1, (540,740)-(890,975) at 428.9, (860,700)-(1210,935) at 431.2, each upscaled to 700x470 Lanczos`
- **Lane impact:** L-art-anim-audio-feel: kills the survey's only frame-side corroboration of the no-blendMode finding and voids its 'blade-trail width/fade' reading. The ledger's Ready bullet 'blade-trail colors' is now suspect for the same reason — whatever was colour-sampled may have been the equipped blade. THE FRAME WINS: the object's 6-second persistence in the video beats any document that calls it a 0.21 s trail.

### `[[art-anim-audio-feel/definesound-samplecount-is-authoritative]]` — UPHELD [A3] (1 critic)

Flash plays the DefineSound sampleCount, not the raw MP3 stream length, so afinfo durations overstate the in-game length: slash1 is 3,809 samples at 11025 Hz = 0.345 s, while afinfo estimates 0.572 s from the same bytes.

- **Cite:** `own DefineSound parse of the decoded reference/extracted/android/122_Mobile_SoundResource.bin (id 9 samples=3809, rate 11025) vs afinfo on the MP3 carved from that same tag`
- **Lane impact:** L-art-anim-audio-feel: every ported SFX/music duration in this survey must be re-derived as samples/11025 from the SWF tag, not from afinfo. The stems are 80.013 s and 45.741 s, not 79.872 and 45.760; slash1 is 0.345 s, not 0.572 s. Timing a WebAudio recreation to the afinfo numbers would run the whole SFX bed 66% long.

### `[[art-anim-audio-feel/eighteen-of-34-enemy-classes-override-die]]` — UPHELD [A2] (1 critic)

Correction to a sub-claim in npc-death-dice-is-seven-way: 18 of the 34 Enemy*.as classes declare `override public function die()`, not 3. EnemyBoar, EnemyArcher, EnemyDeer, EnemyBear, EnemyClone, EnemyGoblinThrower, EnemyElite, EnemyHorse, EnemyOgre, EnemyGoblin, EnemyKanjiGuardian, EnemyTrainingDummy, EnemyVegePatch, EnemyStag, EnemyWolfAlpha, EnemyNianMonster, EnemyZombie, EnemyWolf. Several delegate straight back (EnemyArcher.as:306 super.die(); EnemyElite.as:199 super.die() unless SKILL_UNDYING), so the seven-way NPC dice does remain the common path for standard human enemies — but 'only EnemyGoblin, EnemyGoblinThrower and EnemyZombie override' is wrong and must not be copied into the ledger.

- **Cite:** `reference/decompiled/shs3_android/scripts/Enemy*.as — grep -l 'override public function die' returns 18 of 34 files; EnemyArcher.as:304-308, EnemyElite.as:195-205, EnemyClone.as:747-755`
- **Build:** android v0.682
- **KILLS this line:** "(none — this corrects a peer claim's laneimpact, not a REBUILDREADINESS.md sentence)"
- **Lane impact:** L2 enemies-ai: the death-variant mix is per-class, and a rebuild needs the override map (three-tier: full replacement, delegate-with-addendum, pure inherit), not a single global dice.

### `[[art-anim-audio-feel/glow-is-part-of-the-vocabulary]]` — UPHELD [A3] (1 critic)

Timeline-authored Glow, Blur and DropShadow filters are a core part of the compositing vocabulary and ColorCode.as never builds them — 1,469 Glow filters in ImageResource alone.

- **Cite:** `same PlaceObject3 parse, filter-list decode; cross-checked against reference/decompiled/shs3_android/scripts/ColorCode.as:1-10 imports`
- **Lane impact:** art-anim-audio-feel and ui-hud: corrects the survey's 'the entire compositing vocabulary is one class'. A recreation built from that sentence would omit glow entirely — and glow is visible in-frame on the yellow nameplate and the HUD text in Nr4fQstqHDM_432.0.png, and the blurred background matches BGResource's 29 Blur filters.

### `[[art-anim-audio-feel/gore-has-no-frame-corroboration]]` — UPHELD [STILL_UNHELD] (1 critic)

The gore system is held from bytes only: a scan of all 7,364 readable frames in reference/frames/ produced no localised blood spray - every saturated-red hit resolved to a full-screen red freeze.

- **Lane impact:** art-anim-audio-feel: bounds blocker 5. The 40/20/20/20 split, the behead flag and the pttl=24 droplets are solid from EnemyGoblin.as and BloodParticleEmitter.as, but the VISUAL half of the severed-limb blocker is still unopened - nobody has shown a frame of it. Compounded by the 15 fps capture rate (NF-1/NF-2): a 1.0 s spray is only ~15 sampled frames wide, so a targeted 60 fps re-extraction around a kill is the cheap way to close it.

### `[[art-anim-audio-feel/gore-is-humanoid-only]]` — UPHELD [A2] (1 critic)

The dismemberment/gore death system applies only to humanoids: 17 of the 34 Enemy*.as classes carry no DEATHNOHEAD branch at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/ - my own grep for DEATHNOHEAD across the 34 Enemy*.as files`
- **Lane impact:** art-anim-audio-feel: bounds the gore win claimed by art-anim-audio-feel/gore-system-not-one-variant, whose cite asserts the selection rule is 'mirrored in every Enemy* class'. Every animal plus the player-clone / elite / boss-monster classes take a plain death path. A recreation wiring the 40/20/20/20 dismemberment split onto wolves, boars or clones is diverging from the original.

### `[[art-anim-audio-feel/gore-roll-is-per-class]]` — UPHELD [A2] (1 critic)

The death-variant roll is per enemy class, not one global 40/20/20/20: NPC (the human enemy) rolls Math.random()*7 over six branches including a non-gore DEFEATED2, EnemyZombie rolls *6, EnemyClone has no gore path at all, and EnemyOgre plays a single OGRE_DEATH.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as die() non-behead branch; EnemyZombie.as die(); EnemyClone.as:747; EnemyOgre.as:351; only 8 of 35 Enemy*.as files contain 'Math.random() * 5'`
- **Lane impact:** art-anim-audio-feel and enemies-ai: the duel-relevant human death table is 7-way with a surrender-shaped DEFEATED2 branch that is suppressed during red-freeze. Do not port EnemyGoblin's 40/20/20/20 as the game's rule.

### `[[art-anim-audio-feel/gothit-is-a-ladder-not-a-constant]]` — UPHELD [A2] (1 critic)

The got-hit reaction is a ladder, not a constant: 12 general, 24 on a shield block, 16 after Deadly Cleave, 26 after Thousand Stabs, 24/84 in redfreeze - so a 16-frame reaction does exist in the original.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyShield.as:335-339; MCSPlayer.as:1457, :1461, :1764, :1768, :3719`
- **Lane impact:** art-anim-audio-feel: blocks the survey's recommendation to delete the recreation's 7/12/16 tint ladder as 'an invention'. The original's reaction window is context-dependent and does contain a 16. Cross-lane into enemies-ai: EnemyShield's PART_prop branch zeroes damage and returns false - a shield is a hard block with its own 24-tick beat and its own SFX (hitmetal), not a damage reduction.

### `[[art-anim-audio-feel/hit-reaction-ladder-not-uniform]]` — UPHELD [A2] (1 critic)

gotHitCounter is not a uniform 12: there is a 12/16/24/26/84 ladder, EnemyShield sets 24 on a shield block, and 16 is in the original for the DEADLYCLEAVE recovery - so the ledger's 7/12/16f tint ladder is not a recreation invention.

- **Cite:** `grep -rhno 'gotHitCounter = [0-9]*' over reference/decompiled/shs3_android/scripts/*.as; contexts at EnemyShield.as:330-342 and MCSPlayer.as:1445-1470, :1752-1775`
- **KILLS this line:** "hit-tint scaling (7/12/16f), death sword-detach, dash-snap, scarf physics, FINISHERFLASH — all measured/authored but missing from the art digest §5."
- **Lane impact:** art-anim-audio-feel: do not ship 'the original's one number is 12'. Cross-lane into combat-core and skills-meters: the per-skill recovery lockouts (THOUSANDSTABS 26, DEADLYCLEAVE 16) and the 84-tick player red-freeze lock are recovery-frame numbers no ledger holds. EnemyShield.as:338 also explains what the recovered `hitmetal` SFX is for - a zero-damage shield block.

### `[[art-anim-audio-feel/hud-150-damage-is-a-buff]]` — UPHELD [A2] (1 critic)

The '150% DAMAGE' text visible in the duel HUD is a timed consumable buff readout, not the stance modifier and not the behead multiplier — it is one of a family of buff strings driven by bufftype.

- **Cite:** `reference/decompiled/shs3_android/scripts/OverworldHUD.as:1388 (updateBuff) and :1404; corroborated by docs/gauntlet/L0/index/strings.json id 4132`
- **Lane impact:** art-anim-audio-feel: resolves the survey's own un-reconciled CAUTION on claim hit-reaction-12-ticks — there was never a second 1.5 to conflate. Cross-lane: ui-hud gains a buff-readout element with a one-buff-at-a-time rule; items-equipment and economy gain a consumable buff family (ATTACK/DEFENSE/SPEED/XP at 150%, AP and duel-token regen at 200%).

### `[[art-anim-audio-feel/kill-beat-timings]]` — UPHELD [A2] (8 critics)

The kill-beat has exact numbers: on victory the action freezes for 24*6 ticks (6.0 s) with the win card shown 1.0 s in, and the freeze will not end at the 24-tick mark while the player is still playing the blood-flick sheathe animation; on defeat it is 24*3 (3.0 s).

- **Cite:** `reference/decompiled/shs3_android/scripts/StageManager.as:898-935 (countdown) and :1095-1101 (setup)`
- **KILLS this line:** "hit-tint scaling (7/12/16f), death sword-detach, dash-snap, scarf physics, FINISHERFLASH — all measured/authored but missing from the art digest §5."
- **Lane impact:** art-anim-audio-feel: the Ready bullet's 'kill-beat' is now a number set, not a vibe, and it is gated on a named animation (SHEATHESWORDCHIBURI). Note the screen shake is deliberately NOT gated off during the freeze (StageManager.as:826-830).

### `[[art-anim-audio-feel/killbeat-looks-like-red-field-black-silhouettes]]` — UPHELD [A1] (1 critic)

The kill beat is visually a flat saturated red field with every actor rendered as a pure black silhouette - ColorCode's makeBlack ColorTransform applied stage-wide - and no frame of it was ever opened.

- **Cite:** `reference/frames/session24/reach-A28-forest-duel/ev2_S3_wintint_hz031.png (1100x630), viewed whole at 0.87x; against reference/decompiled/shs3_android/scripts/ColorCode.as:12`
- **Lane impact:** art-anim-audio-feel: gives the kill-beat a visual spec, not just timings, and corroborates the no-blend-mode compositing vocabulary from the frame side (a full-alpha ColorTransform to black, not a multiply/darken blend). Note the blade wedge in THIS frame does taper to a point, unlike the one in Nr4fQstqHDM_432.0.png - the bladeslashfx silhouette varies across its 5 frames.

### `[[art-anim-audio-feel/no-hold-frames-verified-exhaustively]]` — UPHELD [A3] (1 critic)

The "no hold frames in the data" result is universal, not a spot-check: @d equals the number of <f> children for all 487 authored animations across all 19 web animdata blobs.

- **Cite:** `my parse of every <anim> block in reference/extracted/bindata/*.bin`
- **Lane impact:** art-anim-audio-feel: promotes the survey's four-sample check (light_stance, light_run, walk, death) to a measured universal, which is what lets the "holds are code-injected by AnimData duration tails" model be asserted without qualification. It also means any hold frame observed on screen must come from AnimData's tail table, so that table is a hard requirement for the recreation, not an optimisation.

### `[[art-anim-audio-feel/predecessor-swfs-hold-sfx]]` — UPHELD [A3] (1 critic)

Two SHS3 SFX masters are byte-identical to assets in the studio's earlier WEB Flash games, both already in this repo — so they are provably not Android-only, and 30 predecessor sound assets sit entirely unsurveyed.

- **Cite:** `reference/predecessors/shs2_kon.swf (20 DefineSound) and reference/predecessors/shs1_462631_shunpo202c.swf (10 DefineSound), MD5-compared by me against the decoded reference/extracted/android/122_Mobile_SoundResource.bin`
- **Lane impact:** art-anim-audio-feel: bounds the bound. The STILL_UNHELD on web-audio parity is right that the SHS3 web payload holds no audio, but 'all audio claims here are Android v0.682' is too wide — punch and slash1 shipped unchanged in two web Flash builds. Marked PARTIAL because only 2 of 13 are byte-identical; the other seven shared names match in sample count and byte length but differ in bytes (re-encode). Also flags 7 SHS2 music tracks no lane has ever opened.

### `[[art-anim-audio-feel/preservation-shs3swf-is-the-loader]]` — UPHELD [A3] (1 critic)

reference/preservation/shs3.swf is the 164 KB, 2-frame LOADER stub, not 'the real web client'; the actual client is shs3_payload.swf and it independently reports the same framerate and rect.

- **Cite:** `my SWF header parse of reference/preservation/shs3.swf, shs3preloader.swf and the ffdec export header of the client at reference/extracted/payload.xml line 1`
- **Lane impact:** art-anim-audio-feel: cite hygiene only - the 24.0 fps and 800x690 conclusions are unaffected because the real client agrees, but any future claim sourcing 'the real web client SWF' should cite reference/extracted/payload.xml or reference/preservation/shs3_payload.swf, not the 2-frame stub. Also worth banking: the loader's 24 fps IS the Flash stage rate the player actually ran at, since a loaded child SWF cannot override the root's framerate.

### `[[art-anim-audio-feel/rig-is-19-nodes]]` — UPHELD [A2] (1 critic)

The character rig keys 19 nodes per pose in the stance sets (20 in the human set, 26 max in the wolf set), against 27 named PART_ constants in code — the survey's "21-node rig" matches none of these.

- **Cite:** `reference/extracted/bindata/118_1t4645s0.bin, light_stance frame 0; reference/decompiled/shs3_android/scripts/MCSCharacter.as:10-62`
- **Lane impact:** art-anim-audio-feel (L6): the skeleton spec for the recreation. A 21-joint rig will not map onto the shipped keyframe data; build 19 keyed nodes for stances, 20 for the human set, and reserve the 27-slot part table for equipment/props.

### `[[art-anim-audio-feel/rig-is-23-parts-27-slots]]` — UPHELD [A2] (1 critic)

The paperdoll rig is 23 MovieClips built at runtime over 27 named part slots, and the animdata references 25 distinct node ids — the survey's '21-node rig' matches none of these.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:10-62, :120, :141; plus my <n i=> id scan over all 19 animdata blobs in reference/extracted/bindata/`
- **Lane impact:** art-anim-audio-feel and items-equipment: the paperdoll slot count is load-bearing for both the rig and the equipment-compositing contract. 23 built parts / 27 named slots is the number to code against.

### `[[art-anim-audio-feel/rig-is-23-slots-26-for-wolves]]` — UPHELD [A2] (1 critic)

The character rig is 23 part slots for humans and 26 for wolves, out of 27 named parts — not 21.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:10-62 (PART_ constants), :120 (partListLength), :141 (the build loop); MCSWolf.as:13`
- **Lane impact:** art-anim-audio-feel: the rebuild's skeleton must be 23 slots (0..22) for humans with a 26-slot creature variant, and the `<n i="…">` index in every animdata blob is a direct index into that list. Note indices 8 (crotch) and 17 (hat) are declared but never written by the light-stance blob — they are driven elsewhere (the hat is a separate detachable, see createFlyingHat).

### `[[art-anim-audio-feel/stance-triangle-1p2-before-behead]]` — UPHELD [A2] (1 critic)

Damage resolution order in the shipped client is stance-triangle x1.2, then minus defense, then clamp to the weapon's minimum, then x1.5 if the blade path hit hat/head/neck — so the HUD's '150% DAMAGE' banner cannot be the stance modifier.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3699-3719; HUD text visible in reference/frames/duel_dense/Nr4fQstqHDM_432.0.png bottom-left`
- **Lane impact:** L-combat-core: the stance triangle is a x1.2 multiplier applied BEFORE defense subtraction, and the behead x1.5 is applied AFTER the minimum-damage clamp — an ordering no ledger holds and one that changes low-damage outcomes materially. It also proves the frame's '150% DAMAGE / CANNOT CHANGE STANCE' HUD line is a separate duel modifier, still STILL_UNHELD.

### `[[art-anim-audio-feel/stance-triangle-is-1.2]]` — UPHELD [A2] (1 critic)

The stance rock-paper-scissors damage multiplier is x1.2, not x1.5, and a stance-advantage hit recolours its damage popup to white.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3701-3707`
- **Lane impact:** combat-core: the stance triangle is Light>Balanced>Heavy>Light at a flat x1.2, applied BEFORE defence subtraction and before the x1.5 behead multiplier (order: x1.2, then -= getDefense(), then min-damage clamp, then x1.5 if behead). ui-hud: 0xFFFFFF is the stance-advantage damage-popup colour, a byte-exact HUD value nobody holds.

### `[[art-anim-audio-feel/startshake-first-arg-is-duration-not-amplitude]]` — UPHELD [A2] (1 critic)

Every screen-shake number in this lane is being read in the wrong slot. StageManager.as:1200 declares `public static function startShake(shakeDuration:int, shakeAmt:int = 30)`, so the single-argument call sites - startShake(12) at MCSPlayer.as:911 and :4180 and HeavenlySwordProjectile.as:76, startShake(24) at MCSPlayer.as:946, startShake(6) at Trap_CrusherBlockAuto.as:88 and Trap_CrusherColumnAuto.as:90, startShake(val) at StatsManager.as:3535 - all set DURATION IN TICKS and inherit amplitude 30. The only data-driven amplitude in the game is Marker_RumbleTrigger.as:44 `StageManager.startShake(this.shakeDuration,this.shakeAmt)`.

- **Cite:** `reference/decompiled/shs3_android/scripts/StageManager.as:1200-1206 + Marker_RumbleTrigger.as:44 + my grep of all 8 startShake( call sites`
- **Build:** android v0.682
- **Lane impact:** L6 art-anim: a rebuild that ships 'crusher trap shakes at amplitude 6' will be wrong twice over - wrong axis and wrong default. The shake API needs (durationTicks, amplitude=30).

### `[[art-anim-audio-feel/three-missed-shake-triggers]]` — UPHELD [A2] (1 critic)

The screen-shake trigger set is 8 call sites, not the 5 listed, and one of them takes its amplitude from data so the amplitude set is open-ended.

- **Cite:** `my grep for startShake( over reference/decompiled/shs3_android/scripts/`
- **Lane impact:** art-anim-audio-feel: completes blocker ④'s trigger catalogue. StatsManager.as:3535 passing a variable means the shake amplitude is server/data-driven in at least one path, so the recreation needs a parameterised shake API rather than a fixed enum of five events.

### `[[art-anim-audio-feel/three-uncatalogued-shake-triggers]]` — UPHELD [A2] (1 critic)

Three screen-shake call sites are missing from the survey's trigger set, including a fully data-driven one whose amplitude comes from game data.

- **Cite:** `grep for startShake over reference/decompiled/shs3_android/scripts/ — 8 call sites, not 5`
- **Lane impact:** art-anim-audio-feel: completes blocker 4's trigger catalogue. Cross-lane into skills-meters (HeavenlySword projectile shakes on impact) and world-exploration (both crusher traps shake at amplitude 6).

### `[[art-anim-audio-feel/videos-are-60fps-frames-do-arbitrate]]` — UPHELD [A1] (1 critic)

Both primary reference videos are 60 fps native, so the surveyor's premise that 'no frame can arbitrate the visible cadence' is false - and measured at 60 fps the on-screen content in BOTH longplays updates at exactly 15.0 Hz.

- **Cite:** `ffprobe on reference/videos/Nr4fQstqHDM.mp4 and reference/videos/zFtCaTO0_1M.mp4; my own ffmpeg -fps_mode passthrough extractions at t420/429/2800 (Nr4f) and t600/1200/3000 (zFt), autocorrelated frame-diff series over cols 60..1860`
- **Lane impact:** art-anim-audio-feel: this is the Lens-4 failure the lens exists to catch - a cadence question graded off a pre-baked 10 Hz still set while the 60 fps source sat on disk. Also cross-lane into combat-core, enemies-ai and skills-meters: EVERY frame-measured timing ever taken off these two videos was sampled at 15 Hz against a 24 Hz sim and is under-resolved by 37%. Any gauntlet lane that cites reference/frames/ for a duration should re-extract from the mp4 at 60 fps instead.

### `[[art-anim-audio-feel/web-audio-parity-unheld]]` — UPHELD [STILL_UNHELD] (8 critics)

The web build's own audio is STILL_UNHELD: every one of the web payload's 27 bindata blobs was checked and none is a CWS blob, so the web client streamed its sound resources separately and we do not hold them — all audio claims here are Android v0.682 and must be labelled as such.

- **Lane impact:** art-anim-audio-feel: bounds the audio win. Web-parity is PROVEN for animation (14/18 blobs hash-identical) and UNPROVEN for audio, so ported SFX/music must carry an 'Android v0.682' label. Two further honest gaps: the newly-opened vector art (1,949 DefineSprite in SHS3Resource, 49 named backgrounds in BGResource) was not rendered or graded this pass, and no test in the suite pins any finding in this survey.

### `[[audio/all-43-sfx-names-are-on-one-line-in-the-web-soundmanager]]` — UPHELD [A2] (1 critic)

The web build's SoundManager declares the complete 43-name SFX inventory on a single line - no scraping of scattered call sites needed. Thirteen of those names have recovered waveforms via the android 122_Mobile_SoundResource decode (deflect, die1-3, slash1-3, punch, fart, hitmetal, goodkoto, refund, sumo), so the remaining 30 are the honest synth-target list.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t88s0§.as:56 (and :328 for the hitMetal playback path)`
- **Build:** web v0.717
- **Lane impact:** L7 audio: gives the art-anim-audio-feel lane a single authoritative cite for the event vocabulary and, joined to correction C3, an exact split between the 13 SFX with recovered audio and the 30 that must still be synthesized.

### `[[bindata/anim-duration-holds]]` — UPHELD [A2] (2 critics)

The engine adds fixed post-clip freeze durations on top of the authored keyframes (afterslash pose +10, jumpslash land +15, sheathe +24, deaths +6, deathtouch +50, guardian stompfreeze +24), giving exact feel-timing the ledger lists as never catalogued.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/AnimData.as:24-141`
- **KILLS this line:** "④ screen-shake + hitstop-on-landed-hit (never catalogued); ⑤ severed-limb death variant."
- **Lane impact:** L-art-anim-audio-feel + L-combat-core: these are authored animation HOLDS, explicitly not hitstop and not screen-shake — I do not claim those. But they are the same class of feel-timing the ledger calls absent, and they are exact: duration (not frameList.length) is what updateAnimation compares against, so the extra ticks freeze the last pose.

### `[[bindata/audio-not-in-this-source]]` — UPHELD [STILL_UNHELD] (2 critics)

bindata holds no audio of any kind — the 27 blobs are XML, plain text and one GIF — so the art-anim 'ALL AUDIO' blocker is untouched by this sweep.

- **KILLS this line:** "① ALL AUDIO — every SFX + music param is INFERRED, no composer sourced."
- **Lane impact:** art-anim-audio-feel blocker ①. Stated explicitly because this sweep raises the art-anim lane substantially on motion; that must not be read as movement on audio, which remains held-but-encrypted at best.

### `[[cite-lens-s26b/mcswolf-partlist-is-49-not-26]]` — UPHELD [A2] (1 critic)

MCSWolf's partList ends up 49 entries long, not 26. Its constructor calls super() FIRST (MCSWolf.as:11), which runs MCSCharacter's own loop and pushes 23 clips (indices 0..22); only then does it set partListLength = 25 (:13) and push 26 MORE (:14-18). Indices 23-26, which MCSWolf then binds as leg segments at :184/:188/:193/:197, therefore land in the second batch. Every claim in this packet that says 'MCSWolf raises partListLength to 25' is right about the field and silent about the list. A second consequence: MCSCharacter.as:246 'for(var i:* = int(this.partListLength - 1); i >= 0; i--)' walks only indices 24..0 on a wolf, so it never touches the upper half of that 49-entry list.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSWolf.as:9-19,184-197; reference/decompiled/shs3_android/scripts/MCSCharacter.as:141-146,238,246`
- **Build:** android v0.682
- **Lane impact:** L6 (art/animation) - the creature-rig contract is not 'human 23 + 4 extras'. A wolf gets a fresh 26-slot block stacked on top of the inherited 23, and the PART_* indices 23-26 address the new block. Anyone porting the quadruped rig from the packet's partList claims will build the wrong container count and the wrong z-order for creatures.

### `[[hunter-s26a/five-web-animdata-blobs-have-no-android-twin]]` — UPHELD [A3] (1 critic)

CORRECTION to parity/21-of-27-web-bindata-blobs-are-byte-identical-to-android. The 21/27 count and its enumerated list are exact, but the character-animation layer is NOT entirely byte-identical: five of the nineteen web animdata blobs have no android byte-twin, and they differ in ANIMATION COUNT, not just bytes. Web 100_1t4627s0.bin (ogre) = 20 <anim> / 184,193 B vs android 91_Ogre = 18 / 184,120 B. Web 102_1t4629s0.bin (skills: shunpo, deathtouch, fireball, spartakick) = 51 / 333,768 B vs android 93_Skills = 51 / 338,096 B. Web 111_1t4638s0.bin = 17 vs android 102_Guardian = 16. Web 113_1t4640s0.bin = 26 / 153,258 B vs android 104_HumanSpear = 23 / 132,270 B. Web 114_1t4641s0.bin (10 anims) has no android counterpart at all. So the parity hedge lifts for the 21 named files and MUST NOT lift for these five.

- **Cite:** `md5 over reference/extracted/bindata/*.bin vs reference/extracted/android/*.bin (my own run: 27 web, 42 android, 21 matches) + my ElementTree child counts on reference/extracted/bindata/100_1t4627s0.bin, 102_1t4629s0.bin, 111_1t4638s0.bin, 113_1t4640s0.bin, 114_1t4641s0.bin and reference/extracted/android/91_MCSCharacter_OgreAnimationData.bin, 93_MCSCharacter_SkillsAnimationData.bin, 102_MCSCharacter_GuardianAnimationData.bin, 104_MCSCharacter_HumanSpearAnimationData.bin`
- **Build:** both — web v0.717 vs android v0.682
- **KILLS this line:** "S0-3 caveat: 'UI copy and combat tuning parity is NOT established' between android v0.682 and web v0.717"
- **Lane impact:** L0 art-anim. The hedge comes off 21 files (incl. flinch, which lives in the matched Human2 blob) and stays on the ogre and skills animation sets — exactly the two most gameplay-load-bearing. Any 'the animation layer needs no build hedge' line in the rewrite would be wrong.

### `[[hunter/blade-impact-vfx-contract]]` — UPHELD [A2] (1 critic)

The blade-impact VFX has an exact contract nobody claimed: on each connecting polyline point, spawn a bladeslashfx instance at that point and rotate it by the local segment direction in degrees (atan2 x 57.2727), taking the previous point as the tangent partner or the next one at index 0, and suppress the spawn entirely while the kill-beat redFreeze is running.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:1232-1247`
- **Build:** android v0.682
- **Lane impact:** L-art-anim-audio-feel: a hit-spark placement and orientation rule the recreation can implement exactly, plus the redFreeze suppression that keeps the kill beat clean.

### `[[itemdata/five-stances-and-stance-locked-weapons]]` — UPHELD [A2] (2 critics)

The engine has FIVE stances, not three, and 53 weapons in itemdata are stance-locked — though what the restriction values 4 and 6 encode is not established.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:27-35 + reference/extracted/itemdata.xml (53 <stancerestriction> rows, first at :8737) + XMLItem.as:327`
- **Lane impact:** L5 + L3: the project's STANCE_TABLE models 3 stances; the engine enumerates 5 (dual and reversed also appear as animation sets in bindata per Stage-0 finding S0-1). 53 weapons are slot-locked to a stance subset. STILL UNHELD: the 4/6 encoding — a bitmask reading (4=heavy, 6=balanced+heavy) is a hypothesis with no cite and must not be shipped as fact.

### `[[parity/animation-layer-is-not-byte-parity-five-blobs-differ]]` — UPHELD [A3] (1 critic)

The animation-data layer is NOT parity-clean. Fourteen of the nineteen web animdata blobs are byte-identical to an android twin; five are not - ogre, skills, guardian, spear and spider. The skills blob (which holds shunpo, flurry, deathtouch, spartakick, chargedshot) differs by 4.3 KB and the spear blob by 21 KB, so these are content differences, not padding. Any <anim d="N"> duration read from those five android blobs still needs a build hedge; only the fourteen matched blobs earn an unqualified web-build CONTRACT.

- **Cite:** `md5 + byte-size census over reference/extracted/bindata/*.bin vs reference/extracted/android/*.bin, joined to docs/gauntlet/L0/index/bindata.json for the animdata roots and child ids`
- **Build:** both - web v0.717 vs android v0.682
- **Lane impact:** L0 art-anim: the cheap machine-checkable parity instrument is real and worth keeping, but it must be run PER FILE. A blanket 'the animation layer is parity' licence would silently import android skill-animation timings into v0.717.

### `[[stage0/anim-blobs-are-utf8-bom-not-utf16le]]` — UPHELD [A3] (1 critic)

The MCSCharacter_*AnimationData blobs are UTF-8 WITH BOM, not UTF-16LE. Following the standing S0 warning and decoding them as UTF-16LE returns ZERO <anim> matches and will produce a false refutation of any animation claim.

- **Cite:** `reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin and 99_MCSCharacter_HumanAnimationData.bin — first bytes are EF BB BF, and utf-8-sig decoding yields 25 and 158 <anim> tags respectively while utf-16-le yields 0 and 0`
- **Build:** android v0.682
- **Lane impact:** All lanes — the S0 header's UTF-16LE warning is correct for 118_Mobile_Lang_EN.bin but WRONG for the animation blobs. Applying it blindly is a live false-refutation risk; three sound claims in this packet would have died on it.

### `[[uistrings-payload/payload-tag-families-unswept]]` — UPHELD [STILL_UNHELD] (1 critic)

Three payload tag families remain untouched by any sweep and I did not open them: morphFillStyles/morphLineStyles (9 each — authored shape morphs), zonedata/zoneTable (554/9 — font-align-zone hinting), and 262 of the 263 surfaceFilterList entries, which are the most likely home of the ledger's 'FX blend modes' blocker.

- **Build:** web v0.717
- **Lane impact:** art-anim-audio-feel blocker ③ ('FX blend modes') stays open. The one filter list I did open is the GLOWFILTER on the stats window at payload.xml:592239 (blurX/blurY 10.0, strength 5.0, passes 1, black) — a single sample, not a characterisation. Naming the gap rather than guessing at it.

### `[[uistrings-payload/web-and-android-font-sets-diverge]]` — UPHELD [A2] (2 critics)

The web payload and the Android build embed DIFFERENT font sets — the web has Arial (fontID 1296), _sans, Calibri, Calibri Bold, Times New Roman and Olivia Brush that the banked Android font finding does not list, while the Android build embeds MS UI Gothic 標準 which the web payload does not contain at all — so no 'the font is closed' statement is valid without naming the build.

- **Cite:** `reference/extracted/payload.xml:577916`
- **Build:** web v0.717 vs android v0.682
- **KILLS this line:** "② font (unidentified)"
- **Lane impact:** art-anim-audio-feel blocker ② — QUALIFIES the banked art-anim-audio-feel/font-identified (which named Edo SZ, EPSON 太行書体Ｂ, Adobe 고딕 Std B, MS UI Gothic 標準 from the Android blobs) and this unit's nine-embedded-fonts-not-two. Complete web list, nine DefineFont3Tag fontNames: Edo SZ :84, _sans :50748, Calibri Bold :62495, Calibri :442040, Adobe 고딕 Std B :576878, Arial :577916, EPSON 太行書体Ｂ :588965, Times New Roman :693554, Olivia Brush :2631822. Only SEVEN carry a DefineFontNameTag copyright line — _sans and Arial carry none. LICENSING (CLAUDE.md third-party invariant): Arial is Monotype-commercial and must be named explicitly in the do-not-ship list alongside Calibri / Times / Adobe / EPSON; only Edo SZ and Olivia Brush are freely redistributable.

---

## What is NOT here, and why

Refuted claims and claims no critic ever judged (§0: an unjudged claim is a LEAD)
are excluded by `buildLedgerPackets.py`. If you believe something is missing, say so
in your return — do not reconstruct it from memory, and do not cite it.
