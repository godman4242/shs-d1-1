# L0 — salvaged claim set (raw surveyor output)

> **UNVERIFIED.** These are surveyor claims. A claim is only CONFIRMED
> once blind artifact-citing critics have judged it (GAUNTLET.md §0/§3.3).
> Banked: 4 surveys · 10 critic reviews · 156 claims · 242 verdicts.

## android-blobs — re-scored ?

### `android-blobs/all-thirteen-episode-cards-shipped` — HELD [A2] ⚑ OVERTURNS LEDGER

Bespoke full-screen splash art for every one of episodes 0 through 12 plus the exposition and epilogue cards shipped in the binary — so §3.8's scope decision to cut Ep4-12 as 'canonical-but-unshipped' must be withdrawn, not footnoted.

- **Cite:** `reference/extracted/android/124_Mobile_ImageResource.bin — decrypted SymbolClass/ExportAssets name list (16 story-card symbols)`
- **Quote:** image_episode0 image_episode1 image_episode2 image_episode3 image_episode4 image_episode5 image_episode6 image_episode7 image_episode8 image_episode9 image_episode10 image_episode11 image_episode12 image_exposition image_exposition_epilogue image_epilogue
- **Overturns:** "**Season 1 is Prologue + 12 episodes + epilogue = 14 chapters**, not 4. Only Prologue–Ep3 are documented/reachable; Ep4–12 were likely never shipped. **Scope decision:** faithful campaign = Prologue–Ep3, with Ep4–12 labeled canonical-but-unshipped."
- **Lane impact:** L-quests-story. The staleness banner already killed §3.8 with questdata's 61 quests, but 'the quest rows exist' is weaker than 'the bespoke chapter art for every episode was drawn, exported and shipped'. Nobody ships 13 chapter cards for 4 chapters. §3.8 contains the one line in the ledger that tells a builder what to CUT, and that line rests on a falsehood.

### `android-blobs/bgdata-is-a-parallax-spec` — HELD [A2] ⚑ OVERTURNS LEDGER

123_Mobile_BGData is a 49-background parallax specification holding 874 authored layer instances across five depth planes with per-background scroll and wrap overrides — and no ledger system mentions backgrounds, parallax or layer counts at all.

- **Cite:** `reference/extracted/android/123_Mobile_BGData.bin:4-13 (623 lines, root <bgdata>, 49 <bg>)`
- **Quote:** 4:\t<bg> 5:\t\t<id>0</id> 6:\t\t<name>BG_Forest</name> 7:\t\t<ffcount>2</ffcount> 8:\t\t<fcount>7</fcount> 9:\t\t<ppcount>19</ppcount> 10:\t\t<gcount>2</gcount> 11:\t\t<fgcount>4</fgcount> 12:\t\t<ffwrap>1670</ffwrap> 13:\t</bg>. Summed over all 49 records: farthest 147 · far 211 · player-plane 311 · ground 92 · foreground 113 = 874 layer instances. Ids 0-54 with six unused slots (4,19,23,24,25,43). Overrides present: ffwrap 6 rows (1640/1670/1750/1770/2000/2000), ffscroll 14 rows (0.05-0.27), fscroll 16 rows (0.1-1.0), contentwidth 17 rows (800-5000, widest BG_NinjaVillage 5000 = 6.25 screens
- **Overturns:** "**Ready (strongest slice):** 15fps pose latch; walk + run gaits; per-stance slash frames; hit-stagger; death collapse; proportions; combat-crouch idle; flat-vector bold-outline style; **byte-exact HUD/result palette**; blade-trail colors; kill-beat."
- **Lane impact:** L6 art-anim + L1 world-exploration: an omission. The art 'Ready' list is fighter-only and the world list is node-graph-only; the scene behind and in front of the fighter — 49 named locations, five parallax planes, 874 layer slots — is in neither. The 49 names match the 49 BG_* symbols exported by the decrypted 120_Mobile_BGResource one-for-one.

### `android-blobs/item-and-skill-icon-art-is-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The item/accessory/skill ICON art is on disk after all: 115_Mobile_SHS3Resource exports 112 item####, 8 acc#### and 79 skill#### symbols, covering 94/99 consumables, 8/9 accessories and 67/79 quest items — retiring a banked STILL_UNHELD that read the WEB payload, where the art was never embedded.

- **Cite:** `reference/extracted/android/115_Mobile_SHS3Resource.bin (654,169 B; decrypts per reference/decompiled/shs3_android_payload/scripts/ResourceManager.as:41,200-216 at key 'h'=104 -> CWS v17, declared 1,040,857 B, zlib body inflates to 1,040,849 B) cross-checked against reference/extracted/android/111_Mobile_ItemData.bin`
- **Quote:** 1,912 exported symbols. By alpha prefix: torso 151 · uparm 151 · lowarm 151 · pelvic 151 · stomach 151 · item 112 · weapon 109 · hat 96 · calf 85 · crotch 85 · thigh 85 · skill 79 · hair 73 · prop 60 · mask 59 · foot 44 · foottop 44 · head 38 · hand 33 · neck 33 · acc 8 · achievement 5. Key derivation, ResourceManager.as:41 `internal static var resourceFileNameArray:Array = ["shs3resource.swf","musicresource.swf","soundresource.swf","imageresource.swf","bgresource.swf"];` with Mobile.as:352 `ba = ResourceManager.decryptByteArray(ba,ResourceManager.resourceFileNameArray[resourceIndex].charCodeA
- **Overturns:** "⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L3 items-equipment + L10 ui-hud. CONTRADICTS the banked items-equipment/icon-symbol-families-still-unheld (STILL_UNHELD: 'an item icon art set (~187 of ~983 roster rows, plus every accessory) remains unrecovered') and items-equipment/icon-only-symbol-families-still-open (PARTIAL: 'only the fallback item0 survives in the web payload, with zero acc classes'). Both reasoned from the WEB payload's class list; the art was never in the web payload — the web client streamed shs3resource.swf from the server (ResourceManager.as:41,82). ~169 of the ~187 rows are held, plus 79 skill icons the ledger's ui-hud block never lists. CAVEAT I INSIST ON: I enumerated symbol NAMES, not pixels — no DefineShape was decoded.

### `android-blobs/spider-is-web-only-enemy` — HELD [A2] ⚑ OVERTURNS LEDGER

A complete 10-animation SPIDER enemy ships ONLY in the web v0.717 build — engine-known in the web AS3 — and appears nowhere in the Android npcdata, string table or ActionScript, so the Android corpus every survey reads is blind to a whole creature.

- **Cite:** `reference/extracted/bindata/114_1t4641s0.bin:3,24,503,614,745,909,1357,1566,1755,2106 + reference/decompiled/shs3_payload/scripts/§1t1544s0§.as:480-498`
- **Quote:** 3:<anim i="spider_idle" d="1"> · 24:<anim i="spider_walk" d="25" l="1"> · 503:<anim i="spider_attackstart" d="7"> · 614:<anim i="spider_attackend" d="10"> · 745:<anim i="spider_lunge" d="9"> · 909:<anim i="spider_death" d="26"> · 1357:<anim i="spider_flinch" d="12"> · 1566:<anim i="spider_descend" d="25" l="1"> · 1755:<anim i="spider_dig" d="25" l="1"> · 2106:<anim i="spider_death2" d="9">. Web AS3 §1t1544s0§.as:480 `internal static var §1t10731s0§:String = "spider_idle";` … :498 `internal static var §1t10749s0§:String = "spider_dig";`. Android side, all three greps empty: npcdata.xml 'spider'
- **Overturns:** "**Ready:** full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian) with movesets incl. **the archer** (closed this pass); boss roster; projectile set"
- **Lane impact:** L4 enemies-ai: an enemy outside the ledger's taxonomy, with two entry behaviours (spider_descend = drop-in, spider_dig = burrow, both looping) that no other creature has. The blob's EXISTENCE is already catalogued (docs/gauntlet/L0/journal.md:26 lists spider_idle among the 19 web sets); what is new is that it is web-ONLY, which means the only npcdata we hold carries no spider row, no stats, no AI id and no name — a permanent, now-localised hole.

### `android-blobs/blobs-are-utf8-not-utf16` — HELD [A2]

Method correction to this lane's own standing instruction: 41 of the 42 Android blobs are plain UTF-8 and grep works directly on them with correct line numbers — only 118_Mobile_Lang_EN.bin is UTF-16LE.

- **Cite:** `reference/extracted/android/112_Mobile_NodeData.bin (bytes 0-15) vs reference/extracted/android/118_Mobile_Lang_EN.bin (bytes 0-15)`
- **Quote:** 112_Mobile_NodeData.bin: `3c3f 786d 6c20 7665 7273 696f 6e3d 2231` = `<?xml version="1`. 118_Mobile_Lang_EN.bin: `fffe 3c00 3f00 7800 6d00 6c00 2000 7600` = BOM + `<.?.x.m.l. .v.`. A UTF-16-LE decode of the other blobs yields a document with ZERO newline characters, which is the tell that the decode is wrong.
- **Lane impact:** Method, all lanes reading this unit. The kickoff's standing warning ('⚠ THEY ARE UTF-16LE. A byte-level grep returns 0 hits and will fool you') is true only for the string table. Recorded so run 6 does not pay the decode tax, and so nobody discards a correct grep result as a false negative.

### `android-blobs/boss-timings-recut-across-builds` — HELD [A2]

Ogre and Guardian attack timing was re-cut between v0.682 and v0.717: the Android build ships NO *end recovery clip and folds recovery into a *hit clip up to 3.6x longer, so the telegraph/active/recovery triad that closes enemies-ai blocker ③ is a web-only fact.

- **Cite:** `reference/extracted/bindata/100_1t4627s0.bin:901,1223,1325 and 111_1t4638s0.bin:1174,1316 vs reference/extracted/android/91_MCSCharacter_OgreAnimationData.bin:901,1183 and 102_MCSCharacter_GuardianAnimationData.bin:1174`
- **Quote:** web 100_1t4627s0.bin:901 `<anim i="ogre_swingdown" d="16">` :1223 `<anim i="ogre_swingdownhit" d="5">` :1325 `<anim i="ogre_swingdownend" d="11">` — android 91_MCSCharacter_OgreAnimationData.bin:901 `<anim i="ogre_swingdown" d="14">` :1183 `<anim i="ogre_swingdownhit" d="18">` and no ogre_swingdownend at all. web 111_1t4638s0.bin:1174 `<anim i="guardian_swingdownhit" d="7">` vs android 102_MCSCharacter_GuardianAnimationData.bin:1174 `<anim i="guardian_swingdownhit" d="18">`. Full divergence set (web/android): ogre_swingdown 16/14 · ogre_swingdownhit 5/18 · ogre_swingup 13/11 · ogre_swinguphit 
- **Lane impact:** L4 enemies-ai blocker ③ + L6 art-anim. bindata.md C12 closed the blocker with the WEB numbers (0.67s telegraph / 0.21s active / 0.46s recovery at 24Hz) and is correct — but the Android bundle, which the corpus routinely uses as the readable stand-in, says 0.58 / 0.75 / none, an active window 3.6x too long. Where the builds differ, v0.717 is the 1:1 target.

### `android-blobs/comp-rand-is-the-encounter-roll` — PARTIAL [A2]

The condition system carries a probability primitive — <comp>rand</comp> evaluates Math.random()*id <= qty — and the one authored use in the world data is a flat 50% random-encounter roll on an aggro spawn.

- **Cite:** `reference/extracted/android/112_Mobile_NodeData.bin:117-118 + reference/decompiled/shs3_android_payload/scripts/StatsManager.as:4222-4225`
- **Quote:** 112_Mobile_NodeData.bin:117 `<property>1,3,<xml><wave><enemy><id>1</id><qty>3</qty></enemy><enemy><id>3</id><qty>2</qty></enemy></wave></xml></property>` :118 `<condition><has><id>100</id><qty>50</qty><comp>rand</comp></has></condition>`. StatsManager.as:4222 `if(comparison == "rand") { return Math.random() * id <= val; }` — so id=100, qty=50 is a 50% roll; the default comparison elsewhere is "gte" (StatsManager.as:4171-4177).
- **Lane impact:** L4 enemies-ai blocker ④ + L1 world-exploration. This is spawn PROBABILITY, not aggro radius or leash distance — neither of which is in this blob, and I claim nothing about them. But it is the first authored encounter-rate number in the corpus, and the primitive generalises: any <condition> in nodedata, questdata or uidata can be made probabilistic by the same three tags.

### `android-blobs/data-xml-parity-proofs-are-circular` — HELD [A3]

The banked 'Android blob and web v0.717 XML are byte-identical, so the parity caveat is discharged' proof is CIRCULAR: reference/extracted/{item,skill,npc,quest}data.xml ARE the Android blobs with the XML prolog stripped, and the web payload holds no such root at all.

- **Cite:** `diff reference/extracted/skilldata.xml reference/extracted/android/117_Mobile_SkillData.bin (exit 1); same shape for itemdata.xml/111_Mobile_ItemData.bin, npcdata.xml/125_Mobile_NpcData.bin, questdata.xml/116_Mobile_QuestData.bin`
- **Quote:** 0a1\n> <?xml version="1.0" encoding="utf-8"?>\n1971c1972\n< </skilldata>\n\\ No newline at end of file\n---\n> </skilldata>   — zero content lines changed. Sizes differ by exactly the 40-byte prolog + 2-byte CRLF: 184,002/184,044 · 39,003/39,045 · 228,413/228,455 · 796,383/796,384.
- **Lane impact:** L2 skills-meters, L3 items-equipment, L4 enemies-ai, L-quests-story. CONTRADICTS the banked claim skilldata/android-web-byte-identical ('...which discharges the S0-3 parity NOT established caveat for this unit'). There is no web v0.717 skilldata.xml — comparing a file to itself proves nothing. I explicitly do NOT dispute itemdata/web-android-schema-parity (two AS3 parser classes, a real cross-build comparison) or world-exploration/21-of-27-blobs-are-cross-build-identical (27 web bindata vs android, also real). The S0-3 caveat stands undischarged for questdata/itemdata/skilldata/npcdata.

### `android-blobs/foreground-layer-occludes-the-fighters` — PARTIAL [A1]

A frame confirms the foreground parallax plane is real and is drawn IN FRONT of the fighters: a sharply-outlined grass band occludes both fighters' lower legs in the same frame where the far rock layer is soft-edged.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png — crop (900,560)-(1180,960) of the 1920x1080 PNG upscaled x3 NEAREST (280x400 -> 840x1200); second crop (760,780)-(1240,1010) x3 for the leg line`
- **Quote:** Visible in the crop: the tan-clad fighter is drawn behind a band of hard-black-outlined green grass blades crossing the lower ~25% of the crop; the blades overlap and hide both fighters' lower legs (painted over them, not behind). The grass carries the same outline weight as the fighters — it is not the blurred far layer — while the dark rock forms behind the fighter are soft-edged. Fighter head crown ~y=687, occlusion line ~y=880.
- **Lane impact:** L6 art-anim: grounds bgdata's <fgcount> and XMLBG's foregroundLayerScroll=2 in a frame. BG_Forest declares <fgcount>4</fgcount> at 123_Mobile_BGData.bin:11, and an occluding plane is exactly what a foreground layer is for; a recreation that draws all scenery behind the fighter loses this. HONEST LIMIT: I did NOT read groundY=400 off this frame — the fighter is in the combat crouch and his feet are hidden by the very layer this claim is about, so the standing line is not readable here. That number stays STILL_UNHELD from this frame.

### `android-blobs/mapdata-has-no-web-counterpart` — PARTIAL [A2]

119_Mobile_MapData is a 65-byte empty stub, and the 'possible Android-only stripping' hypothesis is now dead: the web payload contains no <mapdata> root at all, populated or otherwise, so no client-side comparison can exist.

- **Cite:** `reference/extracted/android/119_Mobile_MapData.bin (65 bytes, entire file) + the root-tag census in reference/decrypted/shs3_payload_decoded.swf`
- **Quote:** Entire file: `<?xml version="1.0" encoding="utf-8"?>` newline `<mapdata>` blank line `</mapdata>`. Web inflated payload: <mapdata> occurrences = 0.
- **Lane impact:** L1 world-exploration. Closes the client-side half of the banked STILL_UNHELD world-exploration/mapdata-blob-empty ('possible Android-only stripping … Whether the web v0.717 build shipped a populated mapdata is not established'). Ruled out: stripping of web client content, because there is no web client copy. Still open and permanently unresolvable: whether the web build fetched a populated mapdata from the dead server (ResourceManager.loadResource -> getresource.php / Player.IO).

### `android-blobs/nothing-was-rendered` — STILL_UNHELD [STILL_UNHELD]

Every art claim in this survey is about exported symbol NAMES and counts; not one DefineShape record was decoded, so no fill colour, outline weight, silhouette or per-slot geometry is held by this pass.

- **Quote:** Decrypted tag histograms: 115_Mobile_SHS3Resource 3,756 tags (1,949 DefineSprite, 1,594 DefineShape4, 127 DefineShape, 4 DefineFont3) · 120_Mobile_BGResource 1,124 tags (552 sprites, 370 shapes) · 124_Mobile_ImageResource 330 tags · 113_Mobile_MusicResource and 122_Mobile_SoundResource 22 tags each. Shapes decoded: zero.
- **Lane impact:** L6 art-anim. Stated so the volume of art findings above is not mistaken for having GRADED the art. The ledger's §4 art-anim 'byte-exact HUD/result palette' is untouched by me in both directions, and the banked art-anim-audio-feel/web-audio-parity-unheld note that 'the newly-opened vector art was not rendered or graded this pass' remains true after this pass too.

### `android-blobs/parallax-and-dof-contract` — HELD [A2]

XMLBG declares the complete parallax contract: a five-plane scroll ladder 0.25/0.333/0.5/1/2 and a blur ladder 8/4/0/4/8 that is SYMMETRIC about the player plane — a true depth-of-field with the focal plane on the fighter, not a monotone distance haze — plus groundY 400, contentWidth 1600 and wrapAround true.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLBG.as:10-58`
- **Quote:** internal var groundY:int = 400; internal var flatGround:Boolean = true; internal var contentWidth:int = 1600; internal var wrapAround:Boolean = true; … internal var farthestLayerBlur:int = 8; internal var farLayerBlur:int = 4; internal var playerPlaneLayerBlur:int = 0; internal var groundLayerBlur:int = 4; internal var foregroundLayerBlur:int = 8; internal var farthestLayerScroll:Number = 0.25; internal var farLayerScroll:Number = 0.3333333333333333; internal var playerPlaneLayerScroll:Number = 0.5; internal var groundLayerScroll:Number = 1; internal var foregroundLayerScroll:Number = 2;
- **Lane impact:** L6 art-anim: STRENGTHENS the banked art-anim-audio-feel/depth-of-field-blur, which read BG_Loader.as call sites and reported 'observed constants 4 and 8'. The declaration site gives all five values, their plane assignment (the foreground is blurred as hard as the farthest layer — that is the half a call-site read cannot recover) and the scroll ladder the same layers use. groundY=400 is the authored standing line; contentWidth=1600 is two 800-px screens.

### `android-blobs/portraits-decrypted-and-one-dead-reference` — HELD [A2]

The 66 dialogue portraits and 16 story cards are decrypted and enumerated — 51 of the 52 questdata-referenced portraits are present, the 52nd (chikako_maked) is a shipped authoring TYPO that resolves to nothing, and 12 unreferenced portraits form a clan-officer grid of 4 colours x 3 ranks.

- **Cite:** `reference/extracted/android/124_Mobile_ImageResource.bin (1,734,935 B; key 'm'=109 -> CWS v17, declared 1,908,237 B, inflates to 1,908,229 B; 85 exported symbols) cross-checked against the banked <dialogue><img> manifest in docs/gauntlet/L0/run2/claims.json`
- **Quote:** 66 portrait_* symbols. Present for 51 of the 52 manifest names; the single absent one is `chikako_maked` while the shipped symbol is `portrait_chikako_mask`. 15 symbols ship that questdata never references, 12 of them a clean grid: portrait_{blue,green,red,yellow}{sergeant,captain,general}; the other three are portrait_ladyoiwa_snake2, portrait_takamori_masked, portrait_takamori_standmask.
- **Lane impact:** L-quests-story + L10 ui-hud + L0 meta-social. STRENGTHENS the banked quests-story/portraits-held-but-encrypted by discharging the 'encrypted' half and giving the exact manifest. NEW defect: `chikako_maked` is a dead reference in shipped questdata — ResourceManager.getPortrait resolves it to nothing at runtime, so a 1:1 recreation should reproduce the fallback, not invent a portrait. NEW content: the 12 clan-officer portraits are War-Room/clan art that appears in no dialogue and in no ledger.

### `android-blobs/web-is-an-animation-superset` — HELD [A3]

The web build is a strict animation superset of the Android build — 487 vs 471 animations, delta exactly 16, zero Android-only animations — which reconciles bindata C17's 487 against Stage-0b S0-4's 471 and proves that absence in the Android build never proves absence in the shipped game.

- **Cite:** `<anim  count over reference/extracted/bindata/*.bin (19 blobs) vs reference/extracted/android/*AnimationData.bin (18 blobs); md5 sweep + per-blob name diff`
- **Quote:** WEB per-blob: 100:20 101:7 102:51 103:25 104:13 105:8 106:21 107:20 108:158 109:8 110:21 111:17 112:16 113:26 114:10 115:16 116:21 117:8 118:21 = WEB TOTAL 487. ANDROID TOTAL 471. Delta itemised: 114_1t4641s0.bin has no android counterpart (10 spider_*); ogre gains ogre_swingdownend + ogre_stompend; guardian gains guardian_swingdownend; spear gains spear_relax2 + spear_relax3 + spear_flourish. 10+2+1+3 = 16. Android-only animations: zero.
- **Lane impact:** L6 art-anim + L4 enemies-ai. Both banked counts were right and nobody had reconciled them; the difference is content the Android port dropped, not a counting error. Methodological consequence for the whole corpus: every 'X does not exist' claim resting on an Android grep is provisional.

### `android-blobs/web-payload-holds-zero-data-roots` — HELD [A2]

The web v0.717 payload contains ZERO of ten XML data roots (questdata, itemdata, skilldata, npcdata, nodedata, achievementdata, uidata, bgdata, premiumdata, mapdata) that the Android v0.682 payload carries one of each — so the Android blobs are the SOLE source for ten of the game's thirteen data roots and the S0-3 build caveat is not dischargeable for any of them.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf vs reference/decrypted/shs3_android_payload_decoded.swf (both CWS, zlib-inflated: 11,892,053 B vs 21,688,584 B)`
- **Quote:** Root-tag occurrence counts in the inflated bytes — web / android: <questdata> 0/1 · <itemdata> 0/1 · <skilldata> 0/1 · <npcdata> 0/1 · <nodedata> 0/1 · <achievementdata> 0/1 · <uidata> 0/1 · <bgdata> 0/1 · <premiumdata> 0/1 · <mapdata> 0/1 · <survivalmodedata> 1/1 · <traproomdata> 1/1 · <animdata> 19/18.
- **Lane impact:** Cross-cutting, hits all 12 lanes. Strengthens the banked quests-story/payload-provenance-is-android from 4 roots to 10, and re-derives it independently (root-tag census of both inflated payloads, not mtime ordering). Practical effect: every quest line, item row, skill row, NPC row, world node, achievement, UI menu, background definition and premium SKU in the L0 corpus is an Android v0.682 measurement with no web counterpart in existence to check it against.

## frames — re-scored ?

### `frames/achievements-daily-and-tokens-all-on-film` — HELD [A1] ⚑ OVERTURNS LEDGER

All three items of §4 meta-social blocker ③ are recoverable without a Ruffle session: a named achievement toast, the daily-prize streak ladder and the live duel-token counter are each visible in frames and each resolves into the string table.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-04/frames/frame_0001.jpg (crop 550,490-1000,545 @6.5x); reference/frames/Nr4fQstqHDM/seg-00/frames/frame_0001.jpg (crops 0,30-1024,300 @3x and 0,380-1024,520 @3.2x); reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0018.jpg`
- **Quote:** Toast: 'ACHIEVEMENT UNLOCKED / WIN A DAILY TRAP CHALLENGE.' (== strings.json["8111"]). Ninja Services panel: 'CLAIM DAILY PRIZE / ENTER REDEEM CODE / BACK' over 'CLAIM YOUR DAILY PRIZE NOW!' and 'YOU HAVE CLAIMED YOUR DAILY PRIZE FOR 0 CONSECUTIVE DAYS.' (== ["839"],["842"]; ladder ["843"] every 10 days bonus, ["844"] every 30 days super bonus). Duel screen: counter reads '40 DUEL TOKENS'.
- **Overturns:** "③ achievements list, daily-reward table, token costs — *one Ruffle session closes all.*"
- **Lane impact:** meta-social, economy: closes blocker ③ and supplies the daily streak structure

### `frames/choice-text-diverges-from-payload` — HELD [A1] ⚑ OVERTURNS LEDGER

The payload/v0.717 script divergence already found for narration reaches the branching layer: a player CHOICE rendered in v0.717 is worded differently from the corresponding questdata <choice> row, so <goto>-keyed option labels cannot be treated as v0.717-final either.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0023.jpg (crop 0,460-1024,576 @4x) vs reference/extracted/questdata.xml:153`
- **Quote:** Frame shows two options: 'I'LL STAND MY GROUND AND ASK THEM TO LEAVE ME ALONE.' and 'THESE BANDITS DON'T SCARE ME!'. questdata.xml:149 matches the first exactly; questdata.xml:153 reads '<text>They'll get nothing from me!</text>' — no match. Case-insensitive search for 'scare me' in questdata.xml returns only :7776, :14256, :22435, all unrelated. THE FRAME WINS.
- **Overturns:** "① **verbatim dialogue — captured NOWHERE** (study policy + no wiki transcripts)"
- **Lane impact:** quests-story: strengthens questdata/Q-02 from the narration layer into the choice/routing layer

### `frames/critical-evade-states-the-focus-gate` — HELD [A1] ⚑ OVERTURNS LEDGER

The game states the Focus gating rule in its own skill card: a full Focus bar buys EVASION while slashing in that stance — an evade gate, not a crit meter — and the skill-card widget the ledger told someone to go read in a preserved build is already on film.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0013.jpg (crop 20,190-400,400 @5x); screen context at frame_0010.jpg and frame_0011.jpg`
- **Quote:** 'CRITICAL EVADE / (PASSIVE SKILL) / ALLOWS YOU TO EVADE ATTACKS WHILE SLASHING IN THIS STANCE WHEN YOUR FOCUS BAR IS FULL. / NEXT LEVEL  (LEVEL 1) / REQUIRED SKILL POINTS: 1' with a red 'LEARN SKILL' button; frame_0010 'SELECT A SKILL CATEGORY' (7 tiles), frame_0011 'LIGHT STANCE SKILLS / SKILLS THAT ARE USABLE WHEN IN LIGHT STANCE.' over 8 skill tiles, header 'AVAILABLE SKILL POINTS: n', tray 'SKILLS EQUIPPED'.
- **Overturns:** "⑤ Focus/crit gating rule — *watch the Focus bar fill/consume.*"
- **Lane impact:** combat-core (blocker ⑤ Focus/crit gating), skills-meters (blocker ① the skill-card surface)

### `frames/forge-cost-is-level-parameterised` — HELD [A1] ⚑ OVERTURNS LEDGER

The ledger banks 'Forge 700c+2 ore' as an economy static a builder can code today; the frame shows 700 is the level-7 instance of a level-parameterised string, so the constant is wrong as a constant.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0040.jpg (crop 0,380-1024,576 @3x)`
- **Quote:** 'FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS / MATERIALS NEEDED: 2 IRON ORE' — the runtime fill of strings.json["845"] 'Forge an iron sword (level [0])?\nCost: [1] coins\nMaterials needed: 2 Iron Ore', with [0]=7 and [1]=700. One sample is consistent with 100 x level; I do not assert the formula.
- **Overturns:** "**Economy statics:** 100c/3g guest start; inn 8c, toll 7c, stable 14c+5AP, fast-travel 5g, rebirth scroll 1000c (+25g), Forge 700c+2 ore, Reinforce 5000c+1 silver ore; War Room structures 10k/10k/5k."
- **Lane impact:** economy, items-equipment: 'Forge 700c' must be re-labelled as f(weapon level), not a price

### `frames/private-pvp-room-door` — HELD [A1] ⚑ OVERTURNS LEDGER

The client exposes a named private-PvP-room door — an 'ENTER ROOM NAME' modal opened from a world object labelled 'GO TO PRIVATE PVP ROOM' — a networked surface none of the twelve ledger systems mentions.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-04/frames/frame_0017.jpg (read whole @1.86x)`
- **Quote:** Modal titled 'ENTER ROOM NAME' with one text field and 'OK' / 'CANCEL'; directly beneath it, in-scene, the interactable is labelled 'GO TO PRIVATE PVP ROOM'. HUD in the same frame: 'TERRITORY (23,52) INSIDE SECTOR (5,4)', level 7, '14591 / 16350 EXPERIENCE POINTS', 465 COINS, 2 GOLD.
- **Overturns:** "**Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** meta-social: duels/tournaments are hosted as named rooms, not only as a matchmaking queue

### `frames/pvp-duel-screen-fully-filmed` — HELD [A1] ⚑ OVERTURNS LEDGER

The complete LIVE PvP matchmaking screen — token counter, six-card challenge grid, rankings entry, refresh, and the victory-taunt field — is on film in full, so §6's 'the live clan-war ... impossible offline' over-claims what is lost: only the live population is gone, not the surface.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0018.jpg (crop 0,0-1024,576 @1.95x); flow continues at frame_0016.jpg (REFRESHING...) and frame_0019.jpg (VS card GUEST vs TYLUV)`
- **Quote:** Gold title 'DUEL'; skull-diamond icon reading '40' captioned 'DUEL TOKENS'; header 'Register now to fight LIVE PVP duels!'; 2x3 grid of challenge cards TYLUV / IXBAL / NANASHI21 / BODYGU4RD / JOTA / LHADYCANDY, each 'LEVEL 3' with a red 'CHALLENGE' button; 'RANKINGS' button; circular-arrow refresh; footer 'VICTORY TAUNT (DISPLAYS ON OPPONENT'S SCREEN WHEN YOU WIN)' over a field pre-filled 'YOU CAN NEVER DEFEAT ME!'. All six opponents equal the player's level — the HUD badge in the same segment (frame_0003.jpg) reads 3 beside '1918 / 2950 EXPERIENCE POINTS'.
- **Overturns:** "**The live clan-war** — warring alongside thousands of real players is impossible offline; scope out or build a *new* AI-driven sim."
- **Lane impact:** meta-social: the whole duel/matchmaking UI becomes buildable 1:1 with AI opponents behind it

### `frames/quest-card-expiry-prosperity-and-coords` — HELD [A1] ⚑ OVERTURNS LEDGER

The quest log prints the three things §4 lists as blockers on one card: a calendar-day expiry rule stated in words, a full reward tuple including a Town Prosperity delta, and per-quest territory/sector coordinates.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0016.jpg (read whole @2.54x); second instance reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0057.jpg (@2.54x)`
- **Quote:** frame_0016: 'OBJECTIVE / GET BLACK BALD HERB FOR YOKO / (THIS QUEST EXPIRES AT THE END OF THE DAY)'; 'LOCATION / E TOSHIBARA FIELD / TERRITORY (22,51) SECTOR (5,2)' with 'TAKE ME THERE' priced at 5 gold; 'REWARD / 266 XP / 20 COINS / TOWN PROSPERITY: +5'; 'ABANDON QUEST'; balance readout '3 GOLD'. frame_0057: same template with 'MEET HIROSHI OUTSIDE HIS HUT / (RECOMMENDED LEVEL: 3)', 'W KASUTA FOREST / TERRITORY (21,51) SECTOR (2,3)', 'REWARD / 200 XP'.
- **Overturns:** "③ real-world **"day" length** (governs expiry, farming, AP regen, war tick)."
- **Lane impact:** quests-story (blocker ③ coords + rewards), world-exploration (blocker ③ the day clock, at least for quest expiry), economy (prosperity is a quest-completion output)

### `frames/recruit-gets-three-moves-a-turn` — PARTIAL [A1] ⚑ OVERTURNS LEDGER

The v0.717 War Room UI literally prints 'MOVES A TURN' beside a separate live 'MOVE(S) LEFT' allowance, refuting the ledger's reconciliation of moves-per-turn as 'per hour', while corroborating its reading of 36 as a rank threshold — and it supplies the missing bottom-rung value, Recruit = 3 moves a turn.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0014.jpg (crop 0,0-1024,576 @1.95x)`
- **Quote:** 'RANK: RECRUIT (3 MOVES A TURN)' ... 'MOVES MADE: 0/36' ... '3 MOVE(S) LEFT'. THE FRAME WINS on the label: the game says 'A TURN', not 'per hour'.
- **Overturns:** ""moves per turn" reconciles as "per hour" (36 = Private's rank threshold, not a turn cap)"
- **Lane impact:** meta-social: fixes the 11-rank ladder's units and adds the Recruit rate

### `frames/save-policy-is-checkpoint-at-towns-and-dungeons` — PARTIAL [A1] ⚑ OVERTURNS LEDGER

§6 says there is nothing to copy about the save format; the frames do not give the schema, but they do give a load-bearing save POLICY the ledger records nowhere — position is checkpointed only at towns and dungeons, and guest mode persists nothing.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0002.jpg and frame_0003.jpg (both read whole @1.86x); reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0003.jpg (@1.86x)`
- **Quote:** Loading screen tip: 'TIP: YOUR LOCATION IS ONLY SAVED AT SPECIAL LOCATIONS LIKE TOWNS AND DUNGEONS.' Modal: 'NOTE: PLAYER PROGRESS WILL NOT BE SAVED IN GUEST MODE.' Modal: 'NINJA SERVICES ARE NOT AVAILABLE IN GUEST MODE.' (== strings.json["632"]).
- **Overturns:** "**Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** world-exploration, meta-social: a single-player persistence design must honour checkpoint-at-settlement, not continuous save

### `frames/war-room-territory-board-frame-exists` — HELD [A1] ⚑ OVERTURNS LEDGER

A frame of the War Room board DOES exist — the banked meta-social survey searched the wrong segment and declared it absent — and it shows the territory layer is a uniform orthogonal grid ruled over a Japan silhouette, with allegiance, rank, move budget and clan-crops all printed on the same card.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0014.jpg (crop 0,0-1024,576 @1.95x)`
- **Quote:** 'SELECT TERRITORY' header with 'ZOOM IN' and 'HELP'; 'CLAN CROPS: 402 (+2 HQ)'; rectangular-celled grid over western/central Japan with one red clan banner on the contested cell; footer 'ALLEGIANCE: CLAN AKA RYU / RANK: RECRUIT (3 MOVES A TURN) / MOVES MADE: 0/36', 'FLAGS INDICATE BATTLES THAT THE CLANS ARE CURRENTLY ENGAGED IN', 'SHOW CLAN MSG', '3 MOVE(S) LEFT'. Contradicts docs/gauntlet/L0/systems/meta-social.md:402-405 'I never found a frame showing the board.'
- **Overturns:** "② War-Room **map topology** (board/adjacency)."
- **Lane impact:** meta-social: closes §4 blocker ② at the territory layer; the 6x6 sector board remains a second, unfilmed layer

### `frames/world-map-is-a-tile-lattice-with-clan-banners` — HELD [A1] ⚑ OVERTURNS LEDGER

The world map is a uniform W x H lattice of square territory tiles with the Japan coastline as a backdrop behind it — not a 'sparse geographic outline instead of a grid' — and each tile carries a settlement icon plus, on owned tiles, a clan ownership banner in one of four colours.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0029.jpg (read whole @2.54x); top level at frame_0009.jpg (@2.54x)`
- **Quote:** frame_0029: header 'NAGANO (26,52) LEVEL: 9' with 'ZOOM OUT', a 12-column lattice of identical rounded-square tiles, per-tile settlement icons, blue/yellow/red/green clan banners on many tiles, black X on destroyed tiles, one white-outlined selection tile, the player avatar standing in a tile. Legend: 'VILLAGE · TOWN · CITY · CASTLE TOWN · DESTROYED · QUEST' plus 'GREY TERRITORIES = LEVEL TOO LOW / RED TERRITORIES = LEVEL TOO HIGH'. frame_0009: 'CLICK ON THE MAP TO ZOOM IN' over the Japan silhouette with a coarse orthogonal grid ruled across it.
- **Overturns:** "**World-map topology/projection** (sparse geographic Japan outline, not a grid you can generate from W×H)."
- **Lane impact:** world-exploration (blocker ① world bounds + geography), meta-social (this is the clan ownership layer)

### `frames/clan-identity-bound-on-screen` — HELD [A1]

The clan-join screen binds crest art to clan name to daimyo to domain on screen — the exact binding the banked meta-social survey said no payload row provides.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0007.jpg and frame_0008.jpg (both read whole @1.76x); frame_0001.jpg (@1.95x); frame_0004.jpg`
- **Quote:** frame_0007: gold-fan crest -> 'CLAN KI SENSU' / 'CLAN KI SENSU IS LED BY LADY TSUBASA.' / 'CLAN KI SENSU RULES THE DOMAIN IN THE NORTH-EAST.' frame_0008: navy four-ring crest -> 'CLAN AOI HOIRU' / 'CLAN AOI HOIRU IS LED BY LORD YOSHIO.' / 'CLAN AOI HOIRU RULES THE DOMAIN IN THE SOUTH-WEST.' frame_0001: dark-red dragon crest -> 'CLAN AKA RYU IS LED BY LORD TSUYOSHI.' Four crest tiles plus a white '?' RANDOM tile ('LET CHANCE DECIDE.'), each card ending in a red 'JOIN CLAN'. Header gates it: 'CONGRATULATIONS! YOU ARE NOW LEVEL 10 AND ARE ABLE TO JOIN THE WAR ROOM.'
- **Lane impact:** meta-social: closes the banked survey's stated gap #3 and fixes the War Room unlock at level 10

### `frames/consumable-buffs-run-a-30-minute-real-clock` — HELD [A1]

Consumable buffs run on a 30-minute wall-clock countdown shown by a dedicated bottom-right HUD timer, and only one buff may be active at a time — a real-time constant the ledger records nowhere.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-04/frames/frame_0017.jpg (crop 770,495-1024,518 @9x); item card at reference/frames/Nr4fQstqHDM/seg-04/frames/frame_0007.jpg (crop 620,90-960,200 @6x)`
- **Quote:** HUD bottom-right, gold on black: '150% DAMAGE 29:39'. Item card: 'EAT THIS POTATO TO GET THE 150% DAMAGE BUFF. / NOTE: ONLY ONE BUFF MAY BE ACTIVE AT A TIME.'
- **Lane impact:** ui-hud (an uncatalogued HUD widget), items-equipment, world-exploration (a second real-time clock beside the day rollover)

### `frames/death-card-offers-free-respawn` — PARTIAL [A1]

The shipped v0.717 death card offers exactly two buttons, 'LEAVE AREA' and 'FREE RESPAWN', neither of which exists in the android string table — contradicting the banked reading of LoseUI as a revive-for-gold paywall as the player-facing path.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-22/frames/frame_0026.jpg (crop 340,240-690,380 @6x)`
- **Quote:** Two stacked buttons under 'YOU WERE DEFEATED!': 'LEAVE AREA' (silver border) and 'FREE RESPAWN' (gold border). Android table has ["480"] 'Respawn' and ["481"] 'Restart From Entrance' — neither label matches. THE FRAME WINS.
- **Lane impact:** ui-hud, economy: contradicts banked claim ui-hud/respawn-costs-one-heavenly-gold as the only death path

### `frames/jinbei-greeting-diverges-too` — HELD [A1]

A second, independent instance of the same divergence: the first NPC greeting of the Prologue is worded differently on screen than in the payload row for the same beat, speaker and portrait.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0021.jpg (crop 0,460-1024,576 @4x) vs reference/extracted/questdata.xml:128`
- **Quote:** Frame, nameplate JINBEI: 'IT'S NOT OFTEN WE MEET A NEW FACE ON THESE ROADS. IT'S THE BANDITS, YOU SEE. THEY'VE DRIVEN ALL THE HONEST FOLK AWAY.' questdata.xml:128: '<text>Ah! A new face in this territory! My, it isn't often we see people walk this road alone, what with all the bandits infesting it...</text>' — same meaning, different words. THE FRAME WINS.
- **Lane impact:** quests-story: raises confidence that the whole held script is a pre-v0.717 revision, not just one node

### `frames/levelup-card-corroborates-banked-numbers` — PARTIAL [A1]

The level-up card corroborates the ledger's already-banked '+3 stat/+1 skill per level' with an A1 cite it previously lacked, and adds one rendering rule: NEXT LEVEL is XP REMAINING, not the threshold.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0049.jpg (crop 330,190-700,400 @5x); paired PLAYER screen reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0051.jpg`
- **Quote:** 'YOU ACHIEVED / LEVEL 2 / STAT POINTS   +3 / SKILL POINTS  +1 / NEXT LEVEL   663 XP / OK'. Labels resolve to strings.json["133"-"136"]; the numbers are runtime and exist only in the frame. frame_0051 renders the same quantity as a current/next-threshold bar, so 663 is a remainder.
- **Lane impact:** progression, ui-hud: corroboration plus one widget-semantics correction

### `frames/rebirth-element-picker-still-unfilmed` — STILL_UNHELD [STILL_UNHELD]

After sweeping every chapter directory of both longplays plus both 100-frame map segments and broad_survey, there is no rebirth screen, no element circle and no Dan-rank UI anywhere in the frame corpus — the ledger's 'never filmed' stands.

- **Quote:** No frame found. Nearest artifact is a string, not a picture: strings.json["610"] 'Are you ready to attain the next dan rank? / You will be reborn as a level 1 character while retaining your inventory, skill points and clan rank...'. Independently confirms docs/gauntlet/L0/systems/rebirth-elements.md:466-467.
- **Overturns:** "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** rebirth-elements: blocker ⑤ remains open; no frame-side path to close it

### `frames/repair-weapon-cost-still-unheld` — STILL_UNHELD [A1]

The blacksmith service menu including REPAIR WEAPON is on film, but neither longplay ever selects it, so the Repair-Weapon cost is still not held from any frame.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0041.jpg (crop 0,340-620,576 @3.2x)`
- **Quote:** Nameplate 'BLACKSMITH', body 'WHAT CAN I DO FOR YOU TODAY?'; the option list in the adjacent frames reads 'FORGE A WEAPON / REPAIR WEAPON / REINFORCE WEAPON / LEAVE'. The REPAIR WEAPON branch is never entered in either longplay, so no cost is ever rendered.
- **Overturns:** "③ Repair-Weapon cost (never captured)."
- **Lane impact:** economy: §4 blocker ③ stays open from the frame corpus

### `frames/two-font-faces-and-where-the-second-one-lives` — HELD [A1]

S0-2's two-face finding is corroborated from the pixels, and the split is localised: Edo-SZ brush caps carry every game-chrome label while the plain sans face is reserved for account/registration nag copy.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0018.jpg (crop 0,0-1024,576 @1.95x)`
- **Quote:** On one screen: 'DUEL', 'DUEL TOKENS', six opponent names, 'LEVEL 3', 'CHALLENGE', 'RANKINGS', 'VICTORY TAUNT (…)' all in irregular brush caps with uneven baselines and tapered strokes; the single line 'Register now to fight LIVE PVP duels!' in an upright even-weight sans with true lower-case.
- **Lane impact:** ui-hud, art-anim-audio-feel: tells a rebuild which strings must NOT use the brush face

### `frames/v0717-is-a-string-superset-not-identity` — HELD [A1]

The parity in the previous claim is a SUPERSET relation, not identity: v0.717 ships a seven-page War Room rules deck where the android table caps at six, so android absence is not evidence of v0.717 absence.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0011.jpg (crop 0,0-1024,400 @1.95x); siblings frame_0012.jpg and frame_0013.jpg`
- **Quote:** 'WAR ROOM RULES 1/7  (JOINING A BATTLE)' on frame_0011.jpg; '3/7' on frame_0012.jpg; '6/7' on frame_0013.jpg — against strings.json["369"] 'War room rules 1/6  (joining a battle)' and ["379"] 'War room rules 6/6  (building structures)'. THE FRAME WINS.
- **Lane impact:** meta-social, ui-hud: bounds the parity rule established above

### `frames/web-v0717-renders-android-string-table` — HELD [A1]

The web v0.717 client renders the android v0.682 string table character-for-character across at least 12 strings on 5 unrelated screens, so Stage-0b S0-3's standing caveat that 'UI copy parity is NOT established' is closed for every android string that survives into v0.717.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0018.jpg (crop 0,0-1024,576 @1.95x); corroborated at reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0001.jpg (0,0-1024,400 @1.95x), reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0042.jpg (0,380-1024,576 @3x)`
- **Quote:** On-screen in v0.717: 'VICTORY TAUNT (DISPLAYS ON OPPONENT'S SCREEN WHEN YOU WIN)' / 'YOU CAN NEVER DEFEAT ME!' / 'DUEL TOKENS' / 'CHALLENGE' / 'RANKINGS' == strings.json["197"],["198"],["59"],["231"],["28"]. Also 'CONGRATULATIONS! YOU ARE NOW LEVEL 10 AND ARE ABLE TO JOIN THE WAR ROOM. FIGHTING FOR A CLAN IS A GOOD WAY TO EARN COINS, EQUIPMENT AND EVEN GOLD.' == strings.json["321"]; 'REINFORCE YOUR CURRENTLY EQUIPPED WEAPON TO MAKE IT UNBREAKABLE? / COST: 5000 COINS / MATERIALS NEEDED: 1 SILVER ORE' == strings.json["850"].
- **Lane impact:** ui-hud, and every lane: removes the 'android-only, unverified' hedge that S0-3 forced onto all ported UI copy

## string-table — re-scored ?

### `string-table/achievement-roster-is-61-and-19-slots-unauthored` — HELD [A2] ⚑ OVERTURNS LEDGER

The achievement roster is hard-capped at exactly 61 rows (name ids 8000-8060, desc ids 8080-8140, a mechanical +80 offset), and string-table slots 8061-8079 / 8141-8159 are untranslated placeholders — so the list the ledger says needs a Ruffle session is already fully on disk, and 19 slots were never authored.

- **Cite:** `reference/extracted/android/114_Mobile_AchievementData.bin:436-443 + reference/extracted/android/118_Mobile_Lang_EN.bin:5396,:5450,:5636,:5690 + docs/gauntlet/L0/index/strings.json["8061"]`
- **Quote:** 114_Mobile_AchievementData.bin:436-443 — <achievement> <id>48</id> <img>1</img> <name>8041</name> <desc>8121</desc> <stat>25</stat> <val>1</val> </achievement>; and 118_Mobile_Lang_EN.bin:5396 <source>Achievement62</source>, :5450 <source>Achievement80</source>, :5636 <source>Achievement Desc62</source>, :5690 <source>Achievement Desc80</source>
- **Overturns:** "③ achievements list, daily-reward table, token costs — *one Ruffle session closes all.*"
- **Lane impact:** meta-social — closes blocker ③'s achievements half outright (61 rows, each with img id, driving stat id and threshold val) and kills its close-path, which was impossible anyway since §5 P0 proved no build runs.

### `string-table/castle-assault-is-an-unlisted-system` — HELD [A2] ⚑ OVERTURNS LEDGER

Castle Assault is a complete, self-documenting subsystem — control points, special control points, castle levels, a flag room, a defender spawn, and a 3-hour post-breach vulnerability window — that appears in none of the ledger's 12 systems, and it states the territory victory rule (capture all control points) that blocker ② calls unknown.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin:1745,:1748,:1751,:2273,:2285,:2288,:2294,:2330,:2333,:2378,:2381 + docs/gauntlet/L0/index/strings.json["599"]`
- **Quote:** :1748 "Capture all the control points to gain control of the territory" (599); :2273 "Congratulations! The castle is now vulnerable to attack for the next 3 hours!" (774); :2285 "Objective: Fight your way to the castle flag room and capture the castle flag to open the castle gates." (778); :2378/:2381 "Castle Level 3"/"Castle Level 1" (809/810)
- **Overturns:** "② War-Room **map topology** (board/adjacency)."
- **Lane impact:** meta-social + world-exploration — blocker ② halves: victory rule and sector-node taxonomy (Control Point, Special Control Point, Diplomatic/Unclaimed/Peaceful territory, Terrain Field/Forest/Mountain) are HELD; only board geometry remains. An entire named mode is missing from the 12-system taxonomy, the same omission class as survivalmodedata (Stage-0 S0-1).

### `string-table/offline-duel-opponents-are-ai` — HELD [A2] ⚑ OVERTURNS LEDGER

Offline duel opponents are AI driving another real player's stat block, so the ~150 HP 'PvP-duel dummy' the ledger calls wrong data is in fact the correct profile for a combat mode the ledger omits — both an offline-duel-AI profile and a one-hit field-trash profile must exist.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin:7601,:1358 + docs/gauntlet/L0/index/strings.json["IDS_Q50S7NODE2"]`
- **Quote:** :7601 "If your opponent is online, you will duel him live. If your opponent is offline, his samurai will be controlled by the computer." (IDS_Q50S7NODE2); :1358 "Fight AI" (469)
- **Overturns:** "the shipped `AI_TIERS`/`ENEMY_BASE` are a **PvP-duel dummy** (hp 150), not the ~1-HP-chip field trash the video shows; every PvE number lives only in notes."
- **Lane impact:** enemies-ai — reframes the surface bullet: AI_TIERS/ENEMY_BASE is not a mislabel, it is the duel profile. The ledger's implicit assumption of a single enemy stat model is wrong.

### `string-table/autoslash-is-hands-off-auto-attack` — PARTIAL [A2]

AUTO SLASH is a hands-off auto-attack, not an aim assist: the game's own tutorial says the body moves by itself while the player operates the skill bar — so the ledger's 'AUTO SLASH cadence' unknown is a missing NUMBER on a mode whose semantics are now stated.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin:7589,:1808,:1811 + docs/gauntlet/L0/index/strings.json["IDS_Q50S6NODE1"]`
- **Quote:** :7589 "Try turning autoslash on. Your body will move with muscle memory while you can focus on activating your skills." (IDS_Q50S6NODE1); :1808/:1811 "Auto Slash Off"/"Auto Slash On" (619/620)
- **Lane impact:** combat-core — the mode's control semantics are HELD; its cadence remains STILL_UNHELD, so the §1 known-unknown is narrowed, not closed.

### `string-table/carry-weight-gates-travel` — HELD [A2]

Carrying weight is not an inventory container limit — exceeding it BLOCKS TRAVEL, making Carrying Weight+ (base 100, +20/level to 300) a mobility skill and weight a world-traversal resource.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin:422 + docs/gauntlet/L0/index/strings.json["138"]`
- **Quote:** :422 "You are carrying too many things to travel.\n\nUpgrade the Carrying Weight+ skill to carry more items." (138)
- **Overturns:** "**Ready:** 9-slot paperdoll; 4 rarity tiers; ... condition tier names; weight cap 100"
- **Lane impact:** items-equipment + world-exploration — re-characterises the ledger's 'weight cap 100' ready-item from a container limit into a travel gate, which changes what the stat is FOR.

### `string-table/crop-market-is-supply-and-demand` — PARTIAL [A2]

Crop prices are set by a live supply-and-demand market sold per-clan, and rare crops feed a collection screen carrying a field literally labelled 'Global Effect' — so economy blocker ② is mis-scoped: it needs a market simulation, not just a prosperity formula.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin:2465,:824,:842,:857 + docs/gauntlet/L0/index/strings.json["838"]`
- **Quote:** :2465 "You have [0] crop(s) for sale. (Prices are based on demand and supply)" (838); :824 "Rare Crops Collection" (282); :842 "Global Effect" (288); :857 "Berries Collected" (293)
- **Overturns:** "② sell-price + prosperity-daily-sim formulas."
- **Lane impact:** economy — the existence and driver of a player-facing commodity market is HELD; no coefficient is. Blocker ② ('sell-price + prosperity-daily-sim formulas') understates the mechanism.

### `string-table/forge-and-reinforce-reagent-bills` — HELD [A2]

Forging and reinforcing carry literal bills of materials — iron sword = 2 Iron Ore, bronze = 1 Tin + 2 Copper, steel = 2 Iron + 2 Coal + 1 Titanium; Reinforce is a flat 5,000 coins plus one of Silver Ore / Titanium Ore / Uncut Diamond — a reagent layer the ledger's 'Forge/Reinforce costs' ready-line does not contain.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin:2486,:2489,:2492,:2501,:2504,:2507 + docs/gauntlet/L0/index/strings.json["847"]`
- **Quote:** :2492 "Forge an steel sword (level [0])?\nCost: [1] coins\nMaterials needed: 2 Iron Ore, 2 Coal, 1 Titanium Ore" (847); :2507 "Reinforce your currently equipped weapon to make it unbreakable?\nCost: 5000 coins\nMaterials needed: 1 Uncut Diamond" (852)
- **Overturns:** "**Ready:** currencies + guest start; all service prices; Forge/Reinforce/Rebirth/Writ costs"
- **Lane impact:** economy + items-equipment — supplies the crafting input side that the price-only ready-line omits, and binds the forge to the mining ore ladder (7059-7063). Repair stays a runtime [0] coins, so I do not re-claim the already-banked repair formula.

### `string-table/inn-restores-one-third-of-max-ap` — HELD [A2]

Resting at an inn restores HP and Chi in full but AP only 'up to a third of your maximum' — a hard fractional ceiling that is a second, independent AP faucet alongside the banked 1 AP / 60 s regen, and the reason Soldier Pills and the 1-gold AP purchase stay commercially viable.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin:1487 + docs/gauntlet/L0/index/strings.json["512"]`
- **Quote:** :1487 "Welcome Samurai-dono!\nYou can rest here to replenish your health, chi and up to a third of your maximum AP." (512)
- **Lane impact:** world-exploration + economy — blocker ④ (AP regen rate + cap) is already closed at 1/60 s elsewhere; this adds the inn faucet's cap rule, which the banked work does not carry. Camp and Rest verbs remain unmeasured.

### `string-table/jigoku-is-a-timed-penalty-jail` — HELD [A2]

Jigoku is a shipped, named location that functions as a moderation jail with a variable sentence length keyed to the infraction, with its own action-block message and GM commands — absent from every ledger system.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin:2666,:2669,:2531,:3875 + docs/gauntlet/L0/index/strings.json["1026"]`
- **Quote:** :2669 "If you are here, it means that you have been reported for spamming / cheating / hacking or some other undesirable behavior.\n\nYour character will be released from Hell after a certain duration, based on your infraction." (1026); :2531 "Not allowed in hell." (860); :3875 "/sendtohell (playername)\n/gotohell" (4349)
- **Lane impact:** meta-social + world-exploration — a room and a state machine a 1:1 recreation would otherwise drop silently. Neighbouring GM string 4348 '/tteleport (territory x) (territory y)' independently confirms the world address space is a (territory x, territory y) pair.

### `string-table/level-gates-war-room-10-duel-2` — HELD [A2]

Hard content gates are stated in copy: the War Room opens at character level 10, PvP duels at level 2, and story areas at levels 2 and 5 — and the level-10 message names the war room as a coins/equipment/gold faucet, a third witness for the offline-faucet blocker.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin:938,:941,:1952,:2645,:2648 + docs/gauntlet/L0/index/strings.json["320"]`
- **Quote:** :938 "You must be level 10 or higher to access the war room" (320); :941 "Congratulations! You are now level 10 and are able to join the war room.\nFighting for a clan is a good way to earn coins, equipment and even gold." (321); :1952 "You must be level 2 or higher to duel with other players." (667); :2648 "You need to be level 5 or higher to proceed to the next area." (1019)
- **Lane impact:** progression + meta-social — supplies the content-unlock cadence the ledger's 'unlock cadence' ready-line asserts but never enumerates, and adds a third witness to meta-social blocker ④ (offline gold faucet).

### `string-table/no-chi-cost-or-cooldown-numbers-in-prose` — STILL_UNHELD [STILL_UNHELD]

The string table contains NO Chi cost and NO cooldown number for any skill: the 7000-block gives per-level effects only (7067 is literally the words 'Reduced cooldown' with no number) and 167/647/648 are bare labels — the values live in skilldata.xml's <chi>/<cooldown> tags, so this source cannot close skills-meters blocker ①.

- **Lane impact:** skills-meters — blocker ① stands as written from this source; I pattern-hunted every %, digit, 'sec', 'chi', 'cooldown' and 'per' in all 2,555 records and found no cost or cooldown value.

### `string-table/no-condition-damage-multiplier-in-prose` — STILL_UNHELD [STILL_UNHELD]

The string table names all six condition tiers (Broken/Poor/Used/Usable/Good/Well-Maintained) and both repair consumables with a qualitative 'significantly' difference, but states NO coefficient anywhere — it cannot close items-equipment blocker ② and I will not stretch it.

- **Lane impact:** items-equipment — blocker ② is untouched by this source; the already-banked items-equipment/condition-blocker-dead-in-both-builds closes it from the AS3 side, and nothing here strengthens or contradicts that.

### `string-table/piercing-damage-is-a-stat-channel` — PARTIAL [A2]

The shipped stat vocabulary includes 'Critical Damage' and 'Piercing Damage' as displayed stat rows sitting in the same contiguous run as the four elemental ATK and four elemental DEF labels — two channels the ledger's one-line damage model ((ATK+Wpn)x stance, crit 1.3x, Heavy def x0.8) has no home for.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin:2573,:2576,:2561,:1472 + docs/gauntlet/L0/index/strings.json["876"]`
- **Quote:** Stat-panel labels 875/876 read "Critical Damage" and "Piercing Damage", in the same contiguous run as the elemental rows "Fire DEF" (871) and "Fire ATK" (507).
- **Overturns:** "**Ready:** gesture→attack map; damage formula ((ATK+Wpn)×stance, crit 1.3×, Heavy def ×0.8)"
- **Lane impact:** combat-core + items-equipment — widens the 'ready' damage formula into an under-claim; the label is HELD, the channel's arithmetic is not.

### `string-table/skill-card-field-set-six-target-modes` — HELD [A2]

The skill card's complete label inventory is in the table — Level Required, Stance Restriction, Timer, Required Skill Points, Max Level, Passive Skill, Chi Cost, Cooldown, sec — including SIX targeting modes (Self, Enemy, Ally, Enemy Area Effect, Ally Area Effect, All), meaning the skill schema has an ally-targeting branch the single-player ledger never accounts for.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin:380,:383,:386,:482,:485,:488,:491,:494,:497,:500,:503,:506,:509,:1892,:1895 + docs/gauntlet/L0/index/strings.json["164"]`
- **Quote:** Six targeting modes: "Target: Enemy Area Effect" (164) and "Target: Ally Area Effect" (165) alongside Self/Enemy/Ally/All, plus "Required Skill Points" (158), "Level Required" (124), "Chi Cost" (167), "Cooldown" (647) and "sec" (648).
- **Overturns:** "⑤ pause/options/dialogue-box exact metrics."
- **Lane impact:** ui-hud + skills-meters — the skill panel is the densest data screen in the game and is absent from ui-hud's blocker list entirely; this gives its full field set and shows cooldowns render in seconds, not frames. I deliberately do not claim Stance Restriction is live, since items-equipment/stancerestriction-is-dead-data is already banked for the item side.

### `string-table/skill-usage-grammar-pvp-ban-charge-cancel-drag-target` — HELD [A2]

Skill inputs have three distinct verbs on one hotbar button — tap, hold-to-charge, and drag-and-drop to place or aim — the charge verb has an interrupt rule (being hit cancels it), and two skills carry an explicit PvP-room ban, a PvE/PvP capability split the ledger's skills-meters entry does not model.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin:4817,:4829,:4781,:4784,:4793 + docs/gauntlet/L0/index/strings.json["6099"]`
- **Quote:** :4781 "Shoots a charged projectile from your blade.\n\nHold down the skill icon to increase the damage it inflicts.\n\nGetting hit while charging will cancel the skill." (6099); :4817 "Creates a clone to distract your enemy.\n\nThis skill cannot be used in PvP rooms." (6111); :4784 "Calls down a mystical sword from the heavens.\n\nDrag and drop skill icon to select target location." (6100)
- **Lane impact:** skills-meters + ui-hud — rule statements a rebuild would otherwise get wrong silently; adds a charge-interrupt rule and a per-skill mode ban to the skill model.

### `string-table/stance-ring-colours-named-in-tutorial-copy` — HELD [A2]

STRENGTHENS the banked ui-hud/stance-ring-colours-exact: that claim rests on a sprite export (frame index -> colour) and BattleUI.as, which never binds an index to a stance NAME; the tutorial string does, in words — Light blue, Balanced brown, Heavy red — and I cropped and looked at three web v0.717 frames that confirm all three, making this a cross-build parity check that PASSES.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin:7544 + docs/gauntlet/L0/index/strings.json["IDS_Q50S3NODE1"] + reference/frames/session11/stance-reach/B_t851.867_LIGHT_ring_blue_CHANGE-STANCE_tooltip.png + reference/frames/session11/stance-reach/B_t851.933_BALANCED_ring_tan_one-tick-after-click.png + reference/frames/session11/stance-reach/B_t855.800_HEAVY_ring_red.png`
- **Quote:** :7544 "Your stance is indicated by the color of the circle around your portrait: Light stance - blue, Balanced stance - brown, Heavy stance - red." (IDS_Q50S3NODE1). Crop 200x170+10+915 of each 1920x1080 frame, upscaled x4 lanczos: LIGHT frame shows a violet-blue annulus around the straw-hat bust with a CHANGE STAN... caption; BALANCED frame one tick later shows the same annulus in desaturated tan/olive-brown; HEAVY frame shows a saturated red annulus with the HUD caption HEAVY STANCE.
- **Overturns:** "overworld HUD lives only in segment A-00, not MASTER §8 (which is combat-only); portrait ring is stance-colored, not fixed red."
- **Lane impact:** ui-hud — upgrades the ledger's surface bullet 'portrait ring is stance-colored, not fixed red' from a direction into an exact, cross-build-confirmed table. WHERE THE DOC AND THE FRAME DISAGREE THE FRAME WINS, and here they nearly agree: the designer's word is 'brown' but what is on screen is a desaturated TAN — take the frame as authoritative on hue, the string as authoritative on the mapping.

### `string-table/war-turn-is-clock-driven` — PARTIAL [A2]

STRENGTHENS the banked per-turn/per-hour reconciliation: string 309 'Next turn in ' takes a duration argument, proving a war 'turn' is a timed refill window rather than a player action — so both the ledger's 'per hour' and the wiki's 'per turn' describe the same clock, and three distinct real-world periods are named in the copy (turn refill, hourly ranking tick, 24-hour troop advance).

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin:905,:965,:1136,:1079 + docs/gauntlet/L0/index/strings.json["395"]`
- **Quote:** :905 "Next turn in " (309); :965 " moves a turn" (329); :1136 "Rankings will be updated every hour" (395); :1079 "- use the \"deploy troops\" action to increase the number of troops in a sector.\n\n- Troops will advance on enemy sectors every 24 hours." (376)
- **Overturns:** ""moves per turn" reconciles as "per hour" (36 = Private's rank threshold, not a turn cap)"
- **Lane impact:** meta-social — supplies the missing half of the ledger's own reconciliation; the turn LENGTH is still unheld, the string only proves it is a countdown.

## uistrings-payload — re-scored ?

### `uistrings-payload/character-stat-sheet-complete` — HELD [A2] ⚑ OVERTURNS LEDGER

The whole 17-row character stat sheet is one authored field with exact geometry — characterID 1548, Edo SZ 14 pt #cccccc, align centre, leading 40 twips, bounds 264 × 371.6 px — and exactly four rows carry the (stance) qualifier: physical dmg, critical dmg, physical def and slash distance; elemental atk/def and piercing dmg do not.

- **Cite:** `reference/extracted/payload.xml:592221`
- **Quote:** slash distance: 345 (heavy)
- **Overturns:** "⑤ pause/options/dialogue-box exact metrics."
- **Lane impact:** ui-hud blocker ⑤ (a full screen's metrics, free) + combat-core. STRENGTHENS ui-hud/typography-edo-sz, which quoted two lines of this field for font size only. Row order: hp / chi (with hp regen, chi regen) · physical dmg · critical dmg (asterisk-marked) · piercing dmg · fire/water/wind/earth atk · physical def · fire/water/wind/earth def · slash distance · skill cooldown modifier. The four-stance-qualifier set matches InventoryUI.as:1940-1970's four-modifier table (dmg/crit/def/slash) from the opposite direction. piercing dmg / hp regen / chi regen are three-for-three parity hits (strings.json["876"]/["112"]/["115"]). Bounds at :592222 Xmin=-40 Xmax=5240 Ymin=-40 Ymax=7392; textColor 204/204/204 at :592223. NOTE: the numbers are placeholders — 'slash distance: 345' is exactly the discrepancy the banked combat-core/slash-distance-is-player-visible flagged, and claim uistrings-payload/uistrings-is-design-time-not-shipped explains it as authored mock data from an older revision, not a stale formula.

### `uistrings-payload/duel-betting-book-is-web-only-with-full-odds-math` — HELD [A2] ⚑ OVERTURNS LEDGER

The web v0.717 client runs a pari-mutuel betting book on live duels with the complete odds formula and house rake in shipped code — odds_i = round((pool × rake − bets_i) / bets_i × 10)/10, quantised to 0.1, rake 0.85 when the pool is ≤100 and 0.80 above it, floored at 0.7 while the pool is ≤10 and still open — and it has no counterpart in the Android build (0 files, 0 of 2,533 table entries mention odds).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t396s0§.as:238`
- **Quote:** _loc11_ = Math.round((_loc10_ - param1.totalbetsonplayer1) / param1.totalbetsonplayer1 * 10) / 10;
- **Overturns:** "④ token/tournament economy numbers."
- **Lane impact:** economy blocker ④ and meta-social blocker ④ ('offline gold faucet rate (primary source was dead IAP)') — this is a gold faucet with a KNOWN rake, so the offline economy can be balanced against a real number instead of an authored one. Supporting lines in the same function: :222 pool = totalbetsonplayer1 + totalbetsonplayer2, :223 pool<=10 && acceptingbets → 0.7, :232 pool>100 ⇒ ×0.8, :236 otherwise ×0.85.

### `uistrings-payload/golden-tokens-are-spendable-in-v0717` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Golden Tokens are a spendable currency in the web v0.717 build — they are the tournament entry fee — not a quest item; proved twice, by the authored tournament card and by a live goldenTokenText field on the tournament UI class.

- **Cite:** `reference/extracted/payload.xml:534288`
- **Quote:** entry fee: 2 golden tokens
- **Overturns:** "Golden Token reads as a **quest item** in v0.717 vs a spendable currency in the wiki — version-check needed."
- **Lane impact:** meta-social Surface line closed; economy currency model. PARTIAL because the NUMBERS on the card are design-time placeholders — the currency ROLE is what is held. Second cite: reference/decompiled/shs3_payload/scripts/§1t7144s0§.as:22 'public var goldenTokenText:TextField;'.

### `uistrings-payload/nine-embedded-fonts-not-two` — HELD [A2] ⚑ OVERTURNS LEDGER

The payload embeds NINE faces with full copyright lines, not two: Edo SZ, _sans, Calibri, Calibri Bold, Adobe 고딕 Std B, Arial, EPSON 太行書体Ｂ, Times New Roman and Olivia Brush — and the two previously unnamed display faces are load-bearing: the 'FIGHT!' word mark is Olivia Brush at fontHeight 1600 twips (80 pt, characterID 3539, payload.xml:2633162) and the Dan-10 kanji '(十段)' is set in EPSON 太行書体Ｂ (characterID 1483, payload.xml:590472).

- **Cite:** `reference/extracted/payload.xml:2633161`
- **Quote:** fontCopyright="Allen R. Walden's Friendly Fonts (Unprotected. Please distribute freely.)" fontId="3538" fontName="Olivia Brush"
- **Overturns:** "② font (unidentified)"
- **Lane impact:** art-anim-audio-feel blocker ② — CORRECTS Stage-0 finding S0-2 ('the game font is CLOSED — ui_strings.txt:100 has face="Edo SZ"'), which closed the BODY font and never looked at the display faces. Font tags: Edo SZ :84/:15899 (Vic Fieger 2008), _sans :50748, Calibri Bold :62495/:98881, Calibri :442040/:478441, Adobe 고딕 Std B :576878/:577145, Arial :577916, EPSON 太行書体Ｂ :588965/:590471 (Seiko Epson 2000), Times New Roman :693554/:694549, Olivia Brush :2631822/:2633161. LICENSING (CLAUDE.md invariant — third-party assets are NOT covered by the Lut grant): Calibri/Times/Adobe/EPSON are commercial; only Edo SZ and Olivia Brush are freely redistributable. The (十段) field is also third-artifact-class corroboration that a tenth Dan rank is really rendered, bearing on ledger §3.7's demotion of MAX_DAN_RANK=10.

### `uistrings-payload/pvp-transport-is-rtmfp-p2p` — HELD [A2] ⚑ OVERTURNS LEDGER

Live PvP did not run over the Player.IO socket alone — it ran over Adobe RTMFP peer-to-peer, against a named private application URI plus Adobe's public Cirrus rendezvous, which is also what the authored 'behind a NAT or router' error copy is actually reporting.

- **Cite:** `reference/extracted/payload.xml:120466`
- **Quote:** rtmfp://218.99.12.19/shs3/
- **Overturns:** "- **The live clan-war** — warring alongside thousands of real players is impossible offline; scope out or build a *new* AI-driven sim."
- **Lane impact:** meta-social + §6 + a P0 postscript. The conclusion (offline is impossible) stands, but the premise that the multiplayer architecture is unknowable is false: transport, rendezvous service and application URI are all in the payload. Corroborating pool entries: stratusid :119285, NET_STATUS :119389, nearID :119392, farID :119396, 'connected to netgroup' :119398, NetConnection.Connect.Success :119400, and rtmfp://p2p.rtmfp.net :120467. Because p2p.rtmfp.net (Adobe Cirrus) was retired with Flash, even a revived Player.IO backend could not restore PvP.

### `uistrings-payload/server-rpc-surface-is-enumerable` — HELD [A2] ⚑ OVERTURNS LEDGER

§6's 'nothing to copy' is wrong for server topology as well as save format: the web payload's AS3 string pool holds the complete named RPC surface — 60 endpoints contiguous at payload.xml:118550-121372, covering 12 account, 12 war, 5 town/territory, 8 duel/social, 2 replay and 4 persistence/global calls — plus the save/load WIRE FIELD LISTS adjacent to their endpoint.

- **Cite:** `reference/extracted/payload.xml:119329`
- **Quote:** <item>loaddata.php</item>
- **Overturns:** "- **Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** §6 (highest-value target) + meta-social + world-exploration. CONTRADICTS the banked world-exploration/save-format-is-copyable, which closes 'The server-sim-topology half of the same sentence stands.' It does not: the topology is enumerable to the endpoint name. loaddata.php wire fields at :119330-:119342 = lastupdate, apupdate, dtupdate, warupdate, skillslots, stash, questitems, intstats, achievementstats, booleanstats, ignore, purchases, goldbought; savedata.php at :119344-:119346 = battlestats, playerlocation, playerdan. War RPCs at :119301-:119360; town/territory at :119354-:119363; content roots /res/ :120324, /lang/ :120326, /data/ :120328.

### `uistrings-payload/tournament-field-set-and-create-form` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The complete tournament spec sheet is authored in one field — status/players/entry fee/1st-2nd-3rd prizes/level requirement/autostarts upon full roster/round duration/autoresolves upon round timeout/organizer — plus a create-form label set (title · players · entry fee · min level · max level · round duration · autostart · prizes 1st/2nd/3rd) at characterIDs 883-896.

- **Cite:** `reference/extracted/payload.xml:534288`
- **Quote:** autostarts upon full roster
- **Overturns:** "④ token/tournament economy numbers."
- **Lane impact:** economy blocker ④ / meta-social — STRENGTHENS the banked economy/tournament-is-web-only, whose own close-line said 'A follow-up pass should read §1t7144s0§.as and its fields'. The field set arrives without needing it. PARTIAL: field set real, numbers placeholder. Create-form sample values at :534336 (10), :534344 (80), :534348 (24 hours), :534352 (yes), :534361 (400 / 200 / 100).

### `uistrings-payload/uistrings-is-design-time-not-shipped` — HELD [A2] ⚑ OVERTURNS LEDGER

ui_strings.txt and the payload's 807 DefineEditText initialText values are DESIGN-TIME PLACEHOLDERS overwritten at runtime, not shipped v0.717 copy — proved exhaustively on the War Room rules, where all twelve authored fields (characterIDs 744-755, payload.xml:528040-528084) are rewritten by getString(369)..getString(380) at §1t7924s0§.as:96-119, and the authored page 6 '(rank)' is a whole revision behind the id the client actually fetches.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7924s0§.as:96`
- **Quote:** this.warrulestitle.text = §1t1521s0§.getString(369);
- **Overturns:** "| **UI copy** — *"action points"*, War Room rules, betting-odds text | `ui_strings.txt` | ✅ decided — interface text; a paraphrased HUD is not 1:1 |"
- **Lane impact:** ALL TWELVE LANES + the licensing decision in docs/GAUNTLET.md:306. 807 authored EditText fields vs 1,313 runtime getString ids in the same build. The rule to adopt: an authored TextField gives you the FORMAT and the GEOMETRY; it does not give you the words or the numbers unless you have shown no getString writes that field. This also kills the brief's own Priority TWO premise that ui_strings.txt is 'verbatim UI copy'.

### `uistrings-payload/weapon-unbreakable-price-differs-between-builds` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The same dialog and the same string id carry different prices across builds — the web payload's authored text says 5 gold, the Android table's string 669 says 2 Gold — and because the web client overwrites that field with getString(669) at runtime, the SHIPPED web price is UNHELD in either direction.

- **Cite:** `reference/extracted/payload.xml:2634709`
- **Quote:** would you like to make it unbreakable for 5 gold?
- **Overturns:** "③ Repair-Weapon cost (never captured)."
- **Lane impact:** economy blocker ③ — the single cleanest demonstration that S0-3's parity caveat has teeth ON MONEY, not just on wording. Runtime overwrite at reference/decompiled/shs3_payload/scripts/§1t5777s0§.as:180 'this.msgText.text = §1t1521s0§.getString(669);'; the web's own value for id 669 lives in the never-archived shs3_en.xml. Anyone 'correcting' the ledger to 5 gold from ui_strings.txt:471 would be shipping a placeholder; anyone porting 2 Gold is making a labelled cross-build assumption. Android also prices the Ninja-Services rename+unbreakable at 2 Gold (strings.json["636"], reached in the web build too at §1t401s0§.as:620).

### `uistrings-payload/bets-are-tokens-paid-out-in-gold` — PARTIAL [A2]

The betting help panel states the currency crossing — you stake TOKENS and are paid GOLD, profit = stake × odds, and odds float until the book closes — corroborated by the code's 0.1 quantisation (which is what makes '1.5 odds' expressible) and its acceptingbets flag.

- **Cite:** `reference/extracted/payload.xml:533246`
- **Quote:** example: If you bet 2 tokens at 1.5 odds, you will make an estimated profit of 3 gold when your bet wins.
- **Lane impact:** economy — an explicit token→gold conversion path the ledger's currency model does not have. PARTIAL because this is authored TextField copy under claim uistrings-payload/uistrings-is-design-time-not-shipped: the label id is getString(11003), web-only and unresolvable, so the SHIPPED wording is unheld even though the mechanic is proved by §1t396s0§.as:222-239.

### `uistrings-payload/clan-hq-rooms-staff-missions-absent-from-all-12-systems` — PARTIAL [A2]

An entire base-building / staff / mission / graveyard subsystem is authored in the web payload (rooms, upgrade-to-level-2, demolish, staff assignment, mission success probability and risk tiers, room capacity, a corpse-eviction graveyard) and none of the twelve ledger systems has a slot for it — the same class of gap as Stage-0 finding S0-1's <survivalmodedata>.

- **Cite:** `reference/extracted/payload.xml:666623`
- **Quote:** assign staff to this room
- **Lane impact:** meta-social / world-exploration — a thirteenth system. Vocabulary contiguous at :665876-:684584: merchant training room :665912, modify living quarters :666263, upgrade to level 2 :666268, demolish room :666296, no available missions :666619, mission in progress :668811, success probability: 90% :668819, high risk / recommended level: 80 :670323, capacity: 5/5 (Full) :670630, graveyard is empty :672096, graveyard-full corpse eviction :672110, mission result :672684, select 5 crates :673319, 'is now a member of your staff!' :684272; twelve 10000/10000 progress meters at :665884-:665904 and :666324-:666344. Cross-build: staff / living quarters / training room / kitchen / workshop / ninja crates / capacity / crates all return 0 of 2,533 Android entries; graveyard returns 1 (strings.json["1016"]) and appears in 9 Android script files (NodeGenerator, BigmapRoom, TerritoryData, QuestGenerator, ActiveQuest, SoundManager, GameStage, QuestItem, HistoryItem). PARTIAL: I proved the UI is authored and the graveyard node is live; I did NOT prove the room/staff/mission loop shipped, and the web scripts are name-obfuscated so an identifier-absence check is not evidence there.

### `uistrings-payload/duel-replay-is-a-first-class-feature` — HELD [A2]

Duels were recorded server-side and shareable by public URL in two addressing forms — watch?id= and watch?name= — backed by savereplay.php and getreplay.php, a whole feature the ledger's meta-social entry does not list.

- **Cite:** `reference/extracted/payload.xml:119347`
- **Quote:** <item>savereplay.php</item>
- **Lane impact:** meta-social + §6 server topology. The banked ui-hud sweep already found the savereplaybutton (string 483 'Save Replay'); this supplies the transport and the public URL shape it fed. getreplay.php :119350; http://www.strawhatsamuraiduels.com/watch?id= :121368; authored fields cid 3577/3580 at :2640123/:2640172 both read watch?name=orochi; shareDuelTVOnWall :119387.

### `uistrings-payload/emote-and-chat-command-surface` — HELD [A2]

A 21-command chat surface and an 11-emote set exist in the web v0.717 payload and appear in none of the twelve ledger systems, none of the 2,533 Android table entries, and no prior L0 sweep; the help list is room-type-dependent (separate 'Available PvP commands' and 'Available Duel commands' headers) and the PvP emote subset is narrower.

- **Cite:** `reference/extracted/payload.xml:121490`
- **Quote:** /bow, /kneel, /sit, /stand, /fart, /sadtrombone, /rimshot, /gangnamstyle, /rest, /seppuku, /shoulderweapon
- **Lane impact:** meta-social (no slot exists for it) and art-anim-audio-feel — /seppuku is a suicide emote and /rest, /hidehud, /shoulderweapon are state changes rather than one-shot animations, so each implies an authored character pose the art lane has no entry for. Commands at :121163-:121185 and :121471-:121478; headers at :121161 (PvP) and :121162 (Duel); PvP-only emote subset '/fart, /sadtrombone, /rimshot, /seppuku' at :121171; moderation at :121486 /leave, :121487 /kick [, :121488 /ban [, :121489 /unban [.

### `uistrings-payload/payload-tag-families-unswept` — STILL_UNHELD [STILL_UNHELD]

Three payload tag families remain untouched by any sweep and I did not open them: morphFillStyles/morphLineStyles (9 each — authored shape morphs), zonedata/zoneTable (554/9 — font-align-zone hinting), and 262 of the 263 surfaceFilterList entries, which are the most likely home of the ledger's 'FX blend modes' blocker.

- **Lane impact:** art-anim-audio-feel blocker ③ ('FX blend modes') stays open. The one filter list I did open is the GLOWFILTER on the stats window at payload.xml:592239 (blurX/blurY 10.0, strength 5.0, passes 1, black) — a single sample, not a characterisation. Naming the gap rather than guessing at it.

### `uistrings-payload/war-sector-panel-format` — PARTIAL [A2]

The war sector inspector shows friendly strength as a number but renders enemy strength as '???', and the war RPC set carries a matching pair /war/warsentry.php and /war/getwarenemysentry.php — i.e. enemy troop counts are fog-gated behind the spy action the shipped rules name; defender nameplates use 'name (level)'.

- **Cite:** `reference/extracted/payload.xml:484834`
- **Quote:** enemy troops: ???
- **Lane impact:** meta-social blocker ② — this is the sector inspector's FIELD SET, not the board topology. PARTIAL: authored field (see uistrings-payload/uistrings-is-design-time-not-shipped). The '???' is a format literal rather than a mock number, but the only '"???"' string literal I could find in either script tree (§1t3318s0§.as:3169, QueryManagerPIO.as:2816) is the CLAN-ACRONYM fallback, not the troop counter — so the fog-of-war reading is inference from the endpoint pair (:119319, :119321), not proof. Refusing to grade it HELD.

### `uistrings-payload/warroom-build-menu-is-ladder-in-web-copy` — HELD [A2]

The 5,000-coin barrier-bypass structure is HEX_LADDER in both builds' code and the web build's authored menu calls it 'Ladder — Bypasses barriers surrounding the sector'; 'Tunnels' is only the Android EN table's wording for the same structure (strings.json["568"]/["569"]).

- **Cite:** `reference/extracted/payload.xml:485373`
- **Quote:** Bypasses barriers surrounding the sector
- **Lane impact:** meta-social — qualifies the banked meta-social/structure-costs-and-donation-rate, whose 'Tunnels 5000' is the Android display name, not a universal one. Ports should key on the internal name HEX_LADDER (reference/decompiled/shs3_android/scripts/WarHexUIBuildMenu.as:195) and pick a display string deliberately. Full web build menu: Build Menu cid638 :485368, Barricades 10000 cid734 :527783, forward base 10000 cid736 :527793, Ladder 5000 cid639 :485373 — the COSTS survived the revision, only the copy moved.

### `uistrings-payload/warroom-earlier-design-preserved-in-payload` — HELD [A2]

The web payload's stale authored TextFields preserve an EARLIER War Room design the shipped build replaced — a flat '3 moves' per turn, a 'WINNING AND LOSING' page, and an 80%-of-battlefield / Castle-HQ-captured win condition recorded nowhere else in this corpus — superseded at runtime by rank-based moves (strings.json["372"]) and a control-points win condition (strings.json["376"]).

- **Cite:** `reference/extracted/payload.xml:528076`
- **Quote:** - A side wins when it controls 80% of the battlefield.- A side loses when it&amp;apos;s Castle HQ is captured.
- **Lane impact:** meta-social — recovered design history, and a TRAP: anyone reading ui_strings.txt:19 ('- Each turn, every player gets 3 moves.') would code a flat 3 moves/turn and be wrong. Independent staleness proof that does not rely on version numbers: the authored web text carries the typo 'kidk them off the battlefield' (payload.xml:528060) which the shipped table fixes to 'kick' (strings.json["374"]). Do NOT code 80%/Castle HQ; do NOT code flat 3 moves.

### `uistrings-payload/warroom-rules-web-uses-android-id-set` — HELD [A2]

The web v0.717 client fetches War Room rules ids 369-380 in the same order and the same twelve slots as shs3_android/scripts/WarRules.as:94-117, so the Android table's rules pages ARE the v0.717 runtime copy and are portable with only a weak caveat; shipped page order is 1 joining a battle / 2 Turns AND MOVES / 3 attacking and defending / 4 CAPTURING Sectors / 5 rank / 6 building structures.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7924s0§.as:119`
- **Quote:** this.warruleswords.text = §1t1521s0§.getString(380);
- **Lane impact:** meta-social — this is the one place S0-3's parity caveat genuinely collapses. The six rules pages port verbatim from strings.json["369"]..["380"].

### `uistrings-payload/web-ui-string-ids-outrun-android-table` — HELD [A2]

The web v0.717 client calls 1,313 distinct getString(N) UI-string ids but the Android v0.682 table resolves only 765 of them — 548 (41.7%) are absent, concentrated in two web-only blocks 11000-11515 (339 ids, 41 classes) and 22000-22104 (93 ids, 19 classes) — so 42% of the web build's interface copy is UNHELD, not merely 'build-labelled', while the Android client's own 771 ids all resolve.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t396s0§.as:80`
- **Quote:** this.betlabel.text = §1t1521s0§.getString(11003);
- **Overturns:** "STAGE-0b FINDING S0-3: 'MEASURED resolution: itemdata 804 rows / 0 unresolved · skilldata 73 / 0 · npcdata 484 / 6 (all one missing id, 5017).'"
- **Lane impact:** ui-hud, meta-social, economy — corrects Stage-0b S0-3: the shared 2000-8xxx id space makes the DATA XMLs fully resolvable, but the UI id space diverges hard. strings.json's largest numeric key is 9010, so nothing in the 11000/22000 blocks can be ported at all; those strings live only in the never-archived shs3_en.xml under /lang/ (payload.xml:120326). Every lane must check the web client actually calls an id before porting its Android text.

## unassigned — re-scored ?

### `NF-1-crit-is-deterministic-full-focus` — HELD [A2] ⚑ OVERTURNS LEDGER

The crit proc rule is HELD and it is DETERMINISTIC, not a chance roll. MCSPlayer.getDamage() applies the crit exactly when reload == maxreload, i.e. when the Focus/reload bar is completely full: 1.5x maxDamage in LIGHT_STANCE, 1.2x in every other stance, plus the flat gear stat STAT_CRITICALDMG (StatsManager.as:258 = id 204). There is no random term anywhere in the crit branch.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3215-3222`
- **Quote:** if(this.reload == this.maxreload)
{
   if(this.stance != LIGHT_STANCE)
   {
      return maxDamage * 1.2 + this.STAT_CRITICALDMG;
   }
   return maxDamage * 1.5 + this.STAT_CRITICALDMG;
}
return maxDamage;
- **Overturns:** "⑤ crit **proc** rule (chance vs deterministic) — entirely absent."
- **Lane impact:** L2 skills-meters blocker ⑤ CLOSED and L5 combat-core blocker ② ('crit 1.3 vs 3 final') answered. Also kills REBUILD_READINESS.md:152-153's ruling to 'Keep CRIT_MULT=1.3' — the real multipliers are 1.5x Light / 1.2x other. And it welds crit to the Focus meter: crit is not a separate system, it is the payoff for a full reload bar, which finally explains combat-core blocker ⑤ 'Focus/crit gating rule'.

### `NF-15-consumable-buff-enum-and-150pc-damage-potato` — HELD [A1] ⚑ OVERTURNS LEDGER

The gold '150% DAMAGE' text visible on the duel frame is a CONSUMABLE BUFF readout, not a crit indicator: strings 4132-4135 are the potato buffs granting 150% Damage / Defense / XP / Speed, with an explicit 'only one buff may be active at a time' rule. The full buff enum is thirteen values at StatsManager.as:288-312: XP, ATTACK, DEFENSE, SPEED, AP, DUELTOKENS, COINS, RARELOOT, MUTE, FULLMUTE, HELL, INJURED, MODERATOR.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_431.0.png, my own crop (0,820)-(760,1080) upscaled 3x Lanczos — gold text '150% DAMAGE' under a bar reading 'CANNOT CHANGE STANCE'; resolved via docs/gauntlet/L0/index/strings.json["4132"] and reference/decompiled/shs3_android/scripts/StatsManager.as:288-312`
- **Quote:** strings.json["4132"] = 'Eat this potato to get the 150% Damage buff.\n\nNote: Only one buff may be active at a time.'
StatsManager.as:288-312  BUFF_XP=0, BUFF_ATTACK=1, BUFF_DEFENSE=2, BUFF_SPEED=3, BUFF_AP=4, BUFF_DUELTOKENS=5, BUFF_COINS=6, BUFF_RARELOOT=7, BUFF_MUTE=8, BUFF_FULLMUTE=9, BUFF_HELL=10, BUFF_INJURED=11, BUFF_MODERATOR=12
- **Overturns:** "② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued."
- **Lane impact:** L8 ui-hud and L10 economy — a thirteen-value consumable-buff system with an exclusivity rule appears in no ledger system, and the BUFF_SPEED entry is already load-bearing (StatsManager.as:1847 and :1908 multiply SPD by 1.5 before the cooldown and reach caps). Also a trap: a rebuild reading this frame naively would model '150% DAMAGE' as a crit readout.

### `NF-38-cases-35-classes` — HELD [A2] ⚑ OVERTURNS LEDGER

The ai switch has 38 case arms but only 35 DISTINCT actor classes: EnemyPlayer serves ai 0/9/14 via (isDuelist, isBoss) flags and EnemySpearElite serves ai 28/37. Consequence: ai 9 — the single most common elite profile, 73 NPCs — runs the PLAYER rig, which is why exactly those 73 rows carry the full stance-mastery kit.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPCManager.as:516-634 (all 38 arms parsed) and EnemyPlayer.as:40`
- **Quote:** case 0: actor = new EnemyPlayer(MCSPool.getMCS(),true,false);  ·  case 9: actor = new EnemyPlayer(MCSPool.getMCS(),false,false);  ·  case 14: actor = new EnemyPlayer(MCSPool.getMCS(),false,true);  ·  case 28: actor = new EnemySpearElite(MCSPool.getMCS(),false);  ·  case 37: actor = new EnemySpearElite(MCSPool.getMCS(),true);  ·  EnemyPlayer.as:40  public function EnemyPlayer(mcs:MCSCharacter = null, isDuelist:Boolean = false, isBoss:Boolean = false)
- **Lane impact:** L-enemies-ai: read 35 class files, not 38, and treat ai 0/9/14 as one class with two booleans. It also explains claim 5's '73 NPCs share the standard elite kit' — those are exactly the ai 9 rows.

### `NF-5-per-stance-damage-multipliers` — HELD [A2] ⚑ OVERTURNS LEDGER

The per-stance DAMAGE multipliers are in the source and no claim in the packet mentions them. Light x(0.5 + 0.005*mastery), Balanced x(1 + 0.005*mastery), and Heavy / Dual / Reversed a FLAT x1.5 with no mastery term. baseDamage itself is minDamage + Math.random()*damageRange. This is the exact mirror of the reach formula: Light buys reach and pays damage.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3198-3213`
- **Quote:** internal function getDamage() : int
{
   var baseDamage:int = this.minDamage + Math.random() * this.damageRange;
   switch(this.stance)
   {
      case LIGHT_STANCE:    maxDamage = baseDamage * (0.5 + 0.5 * this.lightMastery * 0.01); break;
      case BALANCED_STANCE: maxDamage = baseDamage * (1 + 0.5 * this.balancedMastery * 0.01); break;
      case HEAVY_STANCE:
      case DUAL_STANCE:
      case REVERSED_STANCE: maxDamage = baseDamage * 1.5;
   }
- **Overturns:** "- **Ready:** gesture→attack map; damage formula ((ATK+Wpn)×stance, crit 1.3×, Heavy def ×0.8); blade-path-with-reach model; combo rules; part-based weak points (shielder legs, undead heads)."
- **Lane impact:** L5 combat-core — the '×stance' term in the ledger's damage formula is now an exact three-way expression, and Heavy/Dual/Reversed damage does NOT scale with mastery at all, which changes the whole build-progression story. L4 enemies-ai: elite NPCs in REVERSED/DUAL stance get the flat 1.5x.

### `NF-9-dragon-dance-input-recovered` — HELD [A2] ⚑ OVERTURNS LEDGER

The Dragon Dance INPUT is fully held in a 650-line UI class nobody in this packet opened. DragonDanceUI builds an eight-node ring (node0..node7) labelled with the eight trigrams in two arrangements — Earlier Heaven ['sky','wind','water','mountain','earth','thunder','fire','lake'] and Later Heaven ['fire','earth','lake','sky','water','mountain','thunder','wind']. The player's input is a DIGIT STRING of clicked node indices. Earlier Heaven completes on a 4-length sequence containing nodes 1, 2, 4 and 6, which promotes the ring to Later Heaven. Validation is a string equality against the target object's sequence. The Kanji statue is Obj_DragonDanceStatue, whose Later-Heaven target sequence is drawn from five fixed permutations by a node-seeded deterministic RNG.

- **Cite:** `reference/decompiled/shs3_android/scripts/DragonDanceUI.as:68, :70, :71, :355, :367, :447; Obj_DragonDanceStatue.as:38-64`
- **Quote:** DragonDanceUI.as:68  this.nodesArray = [this.node0,this.node1,this.node2,this.node3,this.node4,this.node5,this.node6,this.node7];
DragonDanceUI.as:70  this.earlierHeavenLabel = ["sky","wind","water","mountain","earth","thunder","fire","lake"];
DragonDanceUI.as:71  this.laterHeavenLabel = ["fire","earth","lake","sky","water","mountain","thunder","wind"];
DragonDanceUI.as:355 this.sequence += num.toString();
DragonDanceUI.as:367 if(Boolean(this.earlierHeaven && this.sequence.length == 4) && Boolean(this.clickedArray[1]) && Boolean(this.clickedArray[2]) && Boolean(this.clickedArray[4]) && Boolean
- **Overturns:** "④ Dragon Dance **input** + Kanji-statue bonus."
- **Lane impact:** L11 meta+rebirth blocker ④ largely CLOSED. Supporting objects also recovered: Obj_DragonDancePath.as, Obj_DragonDanceLoot.as, DragonDanceInteractiveStageObject.as, Obj_HiddenTemple.as and shs3_android_fla/dragondancewords_212.as (the kanji word clip, symbol1534). Each node click also plays a POSE animation on the player character (MCSActor.POSE4 etc.) gated on canChangeStance(), so the dance is physically performed — an L6 art-anim requirement nobody has recorded. Refutes skilldata/input-field-empty's conclusion that blocker ④'s most likely home was eliminated.

### `NF-ai0-duel-opponent-absent` — HELD [A2] ⚑ OVERTURNS LEDGER

ai 0 — the DUEL opponent, new EnemyPlayer(mcs, isDuelist=true, isBoss=false) — has ZERO npcdata rows, and BOTH packet claims about the ai enum silently drop it (claim 3 scopes to '1-37', claim 4 lists only 10/15/16). The entire Duels roster lives outside npcdata: it is built by XMLNpc.initDuelist() from an equipment string plus a stats string. For a project recreating Duels this is the most consequential absence in this file.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPCManager.as:517-519, XMLNpc.as:36, :346-365 and :703-712; unused-ai census over reference/extracted/npcdata.xml`
- **Quote:** NPCManager.as:517-519  case 0: actor = new EnemyPlayer(MCSPool.getMCS(),true,false); break;   ·   XMLNpc.as:36  public static var DEFAULT_EQSTRING:String = "4017|0|6019|0|8005|0|0|11017|12017|13002|13002|0|0";   ·   XMLNpc.as:705  var equipment:Vector.<Item> = new Vector.<Item>(13);   ·   npcdata <ai> values unused in 0..37 = {0, 10, 15, 16}
- **Overturns:** "④ aggro/leash/spawn geometry."
- **Lane impact:** L-enemies-ai + L-combat-core: stop looking for the duel opponent in npcdata. It is a paperdoll-string + stats-string construction, which is also why packet claim 8's damage math sits on initDuelist().

### `NF-boss-hp-derivation` — HELD [A2] ⚑ OVERTURNS LEDGER

The boss HP/ATK derivation is real shipped code, which vindicates the max() reasoning that packet claim 20 says rests on a false premise. maxhp = max(levelScaledAuthoredHP, playerhit x hitsToKillBoss), and the same shape for attack.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/EnemyPlayer.as:73-77 and :90-137`
- **Quote:** :97 hitsToKillBoss = 8 + lvldiff;  :98 hitsToKillPlayer = 16 - lvldiff;  :107 playerhit = playerATK - defense;  :124 bossHP = playerhit * hitsToKillBoss;  :125 if(bossHP > maxhp) { maxhp = bossHP; setHP(maxhp); }  :131 bosshit = playerHP / hitsToKillPlayer;  :132 bossATK = bosshit + playerDEF;  :133 if(bossATK > minDamage) { minDamage = bossATK; }
- **Overturns:** "Damage math: Physical = (ATK + WeaponDMG) × stanceMult; Heavy defender Defense ×0.8 (one way); Critical = 1.3 × Physical."
- **Lane impact:** L-combat-core: the whole boss-scaling model is now codeable exactly — including the level-banded playerhit floors at :108-123 (lvl<=10 -> 1, <=20 -> L/8, <=30 -> L/6, else L/4). src/config/combat-sim.ts's comment needs one clause fixed ('not authored at all'), not a rewrite.

### `NF-category-11-decoded` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Skill category 11 is the enemy-only special-move bucket with SEVEN members, not a mastery bucket — so the packet's 'category 11 therefore stance mastery' inference is a non-sequitur. The right evidence for two extra stances is positional plus the animation blobs.

- **Cite:** `reference/extracted/skilldata.xml (category-11 census; skill 1500 at :1948, 1501 at :1960) resolved through docs/gauntlet/L0/index/strings.json, plus reference/extracted/npcdata.xml:3662, :3898, :3934 and reference/extracted/android/101_MCSCharacter_DualStanceAnimationData.bin, /95_MCSCharacter_ReversedStanceAnimationData.bin`
- **Quote:** category 11 = {1064 'Back Throw', 1065 'Air Stab', 1066 'Bull Charge', 1067 'Punch Lunge', 1068 'Undying', 1500 (unnamed), 1501 (unnamed)} — all with no <req>, no <desc>. The three masteries are 1000/1001/1002 in categories 1/2/3. Positional evidence: npcdata.xml:3662 Aboshi <skills><skill><id>1500</id><lvl>3</lvl>… , :3898 Magoichi 1500@3, :3934 Gojo Takamori 1501@3 — the exact slot where 1000/1001/1002@3 sit for every other elite.
- **Overturns:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L-skills-meters: the conclusion (two boss-only extra stances, dual-wield and reversed-grip, backed by named animation blobs in both builds) survives; the category argument does not. PARTIAL because 1500/1501 have no string entry at all, so their names are still unheld.

### `NF-enemy-skill-ladder` — HELD [A2] ⚑ OVERTURNS LEDGER

For the EnemyPlayer actor classes (ai 0/9/14 — 88 of the 425 ai-bearing rows, INCLUDING all 73 that carry the 'standard elite kit'), the runtime moveset is not read from npcdata's <skills>: generateSkillList() wipes skillList and rebuilds it from a date-seeded RNG with level gates at 6/10/12/20/70, each skill a 50% coin flip (1/3 for 1005). A complete enemy skill-unlock ladder absent from all 12 ledger systems.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/EnemyPlayer.as:157-250`
- **Quote:** :159 skillList = new Vector.<IntStat>();  :160 var rng:RNG = new RNG(StageManager.getCurrentNode() * QueryManager.instance.getServerDate() + StageManager.getCurrentRoom() * 3);  :161 if(level >= 6) { if(rng.rand(2) == 0) skillList.push(new IntStat(1014,1)); }  … 20->1015 Air Combo · 12->1036 Deflect · 70->1039 Shunpo · 6->1016 Flip-up · 20->1017 · 12->1037 · 70->1040 Thousand Stabs · 6->1018 Stab · 20->1019 · 12->1038 · 70->1041 Deadly Cleave · :245 if(level >= 10) { if(rng.rand(3) == 0) skillList.push(new IntStat(1005,3)); }
- **Overturns:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L-enemies-ai + L-skills-meters: qualifies packet claim 12 ('per-NPC data table') — true for 337 rows, false for the 88 EnemyPlayer rows. Same node x serverDate + room x k seed shape as procgen town, so enemy loadouts rotate by real-world day.

### `NF-four-faction-spawn-model` — HELD [A2] ⚑ OVERTURNS LEDGER

The spawn layer is a FOUR-faction model, not two, and objective NPCs change faction by quest action type — a combat-sim faction model no ledger system carries. There is also a separate network-player spawn path.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPCManager.as:869-937 and :939`
- **Quote:** :869 createEnemy -> enemyList.push(actor)  ·  :884 createFriend -> friendList.push(actor); actor.setIsFriendly()  ·  :900 createNeutral -> neutralList.push(actor)  ·  :915 createObjective -> objectiveList.push(actor); :923-930 if(StageManager.getAction() == GameEngine.ACTION_FIGHT || … ACTION_ASSASSINATE) { enemyList.push(actor); } else if(… ACTION_ESCORT) { friendList.push(actor); }  ·  :939 public static function createNetworkPlayer(id, charname, charlvl, equip, nid, xpos, side, facingRight, pose, stats, skills, taunt, justEntered)
- **Overturns:** "Ready: full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian) with movesets incl. the archer; boss roster; independent-aggro (no coordination — closed)."
- **Lane impact:** L-enemies-ai + L-quests-story: escort/assassinate quest design needs all four lists. Also note setLevel is applied only when a spawn passes lvl != 0, so npcdata's authored lvl/hp is a BASE the wave data rescales.

### `NF-kill-xp-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

Kill-XP is HELD, closing the lead claim 21 opened. Every NPC gets xp = level*2 + 20 at init; bosses and duel opponents get xp = lvl*5 + 45. It was never in npcdata because it is computed in code.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPC.as:218 and :252, plus EnemyPlayer.as:82 and :88`
- **Quote:** NPC.as:218  this.xp = this.level * 2 + 20;   ·   NPC.as:252  this.xp = lvl * 2 + 20;   ·   EnemyPlayer.as:80-89  if(this.isBoss || this.isDuelist) { xp = lvl * 5 + 45; … } else { xp = lvl * 2 + 20; }
- **Overturns:** "① coins-per-kill reality (=8 is an unconfirmed INFERRED seed; 20+ samples show no XP formula either)."
- **Lane impact:** L-progression blocker ④ ('full XP-income model') loses its kill-XP half outright; L-economy's '20+ samples show no XP formula either' is overturned.

### `NF-level10-clamp` — HELD [A2] ⚑ OVERTURNS LEDGER

Every enemy spawned with an explicit level <= 10 is FORCED to 1 HP / 1 damage / 1 defense regardless of authored values, and levels 11-20 are damped by x0.9. This is the mechanism behind the '~1-HP-chip field trash' the videos show.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPC.as:239-260 (clamp at :253-259) and EnemyPlayer.as:138-142`
- **Quote:** NPC.as:241-245  var factor:Number = lvl / this.level; if(lvl <= 20) { factor *= 0.9; }   ·   NPC.as:253-259  if(lvl <= 10) { this.damage = 1; this.defense = 1; maxhp = 1; setHP(maxhp); }   ·   EnemyPlayer.as:138-142  if(lvl <= 5) { minDamage = 1; defense = 1; }
- **Overturns:** "the shipped AI_TIERS/ENEMY_BASE are a PvP-duel dummy (hp 150), not the ~1-HP-chip field trash the video shows; every PvE number lives only in notes."
- **Lane impact:** L-enemies-ai + L-combat-core: the ledger's Surface suspicion is now mechanised, not just censused. It also means the authored lvl 1-10 rows of the five clan armies are moot at runtime.

### `NF-melee-ai-geometry` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The enemy melee AI bodies ARE readable and carry the aggro/trigger geometry that packet claims 3 and 22 both left STILL_UNHELD — approach speed, attack-trigger box, downed-target multiplier, retarget cadence and knockdown pushes, all as literals.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/EnemyKnife.as:64, :68, :104, :108, :113-115, :127, :140, :181, :200; NPC.as:285-294; EnemyPlayer.as:52`
- **Quote:** EnemyKnife.as:140  walkSpeed = Math.random() * 2 + 4;   ·  :181 if(mcs.x - playerX < 50 && mcs.y - playerY < 50)  ·  :200 if(playerX - mcs.x < 50 && mcs.y - playerY < 50)  ·  :113-115 if(target.isDowned()) target.checkHitObject(…, new Damage(damage * 2, level));  ·  :127 target = NPCManager.getNearestEnemy(getMapPosition(), true);  ·  NPC.as:287-292 --this.aiCounter; if(this.aiCounter <= 0) { this.aiCounter = this.aiCounterMax; return true; }  ·  EnemyPlayer.as:52 aiCounterMax = 12;
- **Overturns:** "③ telegraph/active/recovery + stagger frames.  ④ aggro/leash/spawn geometry."
- **Lane impact:** L-enemies-ai: blocker ④ is HELD for one class (nearest-enemy targeting, retarget every 12 frames, no leash term, attack trigger a 50x50 px box) and blocker ③'s trigger half likewise. PARTIAL because I read one of 35 classes; the other 34 follow the same startAction/doAction shape and are equally readable. Bonus: a 2x damage multiplier on downed targets appears nowhere in the ledger.

### `NF-npcdata-silences` — HELD [A2] ⚑ OVERTURNS LEDGER

Four structural facts in npcdata.xml that no claim in the packet mentions at all: (a) FIVE paperdoll-template rows with no name/ai/lvl, not one; (b) ZERO colour-override tags despite the code parsing eight of them; (c) the NPC id-band layout with a 143-id hole; (d) the string-table band partition by consumer file.

- **Cite:** `reference/extracted/npcdata.xml:3, :1511, :3352, :4097, :4437 (template rows) and a full tag census; reference/decompiled/shs3_android_payload/scripts/MCSCharacter.as:523-550; docs/gauntlet/L0/index/strings.json (band lookups by id)`
- **Quote:** (a) rows with no <name>, no <ai>, no <lvl>: ids 0 (:3), 47 (:1511), 160 (:3352), 801 (:4097), 819 (:4437); plus ids 815-818 whose <name>5001</name> resolves to the literal '?'.  (b) census over all 495 blocks: armorpcolor 0, armorscolor 0, pantspcolor 0, pantsscolor 0, hatpcolor 0, hatscolor 0, maskpcolor 0, forshow 0 — while MCSCharacter.as:524-547 parses every one.  (c) id bands: 0-99 = 91 rows, 100-199 = 99, 200-656 = five 57-row armies (285), 800-819 = 20; 657-799 EMPTY; no duplicate ids.  (d) strings.json bands: 4000s item names, 5000s NPC names (5001='?', 5009='Ruffian', 5053='Soldier', 
- **Overturns:** "Ready: 9-slot paperdoll; 4 rarity tiers; affix prefix pool (verbatim); item-name template; full ItemStats field list."
- **Lane impact:** L-items-equipment + L-art-anim: (b) is a hard from-scratch-art constraint — the five clan armies are five separately PAINTED garments, never a tint of one, because no colour override is ever authored. (a) corrects packet claim 25's 'the reference paperdoll' (there are five, plus four '?' placeholder rows). (d) lets any numeric id be routed to its owning file before lookup.

### `NF-procgen-surnames` — HELD [A2] ⚑ OVERTURNS LEDGER

'Hachisuka Kano' and 'Honda Shizuka' are PROCEDURALLY GENERATED names, not missing bosses: Hachisuka and Honda are rows in the SamuraiFamilyNames table, Kano is a male given name and Shizuka a female given name.

- **Cite:** `reference/extracted/bindata/96_1t4652s0.bin (offsets 51, 84), reference/extracted/bindata/94_1t4651s0.bin (offset 692), reference/extracted/bindata/97_1t4650s0.bin (offset 1620); consumer at reference/decompiled/shs3_android_payload/scripts/XMLNpc.as:529`
- **Quote:** bindata/96 (289 B, ASCII CRLF): 'Asai\r\nAskikaga\r\nChosokabe\r\nDate\r\nFukushima\r\nGenji\r\nHachisuka\r\nHattori\r\nHeike\r\nHojo\r\nHonda\r\nHosokawa\r\nIshida…'   ·   bindata/94: '…Kane\r\nKano\r\nKaori\r\nKatsuhiko…'   ·   bindata/97: '…Shiori\r\nShizue\r\nShizuka\r\nShizuyo…'   ·   XMLNpc.as:529  this.name = NameGenerator.getInstance().getSamuraiName(rng,true);
- **Overturns:** "Boss table omits Hachisuka Kano, Honda Shizuka, Zabuza, Tengu Hotaru."
- **Lane impact:** L-enemies-ai + L-quests-story: two of the four 'omitted bosses' are dissolved — they are RNG name draws from the procgen tables, so the boss table omits nothing. Zabuza, Tengu and Hotaru remain genuinely unfound across all extracted XML, all 27 bindata blobs, all 42 android blobs and reference/decompiled/.

### `NF-stage-800x480` — HELD [A2] ⚑ OVERTURNS LEDGER

The native canvas is 800x480 = 5:3 EXACTLY, as a literal in BOTH builds — so the pillarbox origin that claims 0 and 1 both left open is CLOSED without a build. A 5:3 stage fitted to 1080 px gives 1800 px of picture and 60 px bars; the frames measure 1814-1816 px and 52-53 px bars, i.e. the game's own 5:3 canvas plus ~0.9% recorder stretch. The bars are the GAME's canvas, not the recorder's window. Re-base HUD x as (x-52)/1816 then map onto an 800-wide stage.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:80, :82, :96, :98 and reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:104`
- **Quote:** public static var stageWidth:int = 800;  ·  public static var stageHeight:int = 480;  ·  public static var stageBaseWidth:int = 800;  ·  public static var stageBaseHeight:int = 480;   — and independently in the WEB payload's obfuscated StatsManager: public static var stageWidth:int = 800;
- **Overturns:** "① aspect-ratio truth (5:3 native → are x-fractions pillarbox-wrong?) — inspect unt.png for side-bars; read stage.stageWidth in a build."
- **Lane impact:** L-ui-hud: blocker ① CLOSED outright and its close-path was wrong — it never needed a build, the literal is in the decompiled source of both builds. Confirms the ledger's own unsourced '800x480 (5:3)' line with an A2 cite.

### `combat-core/web-stance-damage-and-reach-are-inverse` — HELD [A2] ⚑ OVERTURNS LEDGER

WEB v0.717's stance model is an explicit reach-vs-damage inversion, and both halves use the same mastery coefficients. REACH: Light base x1.4, Balanced base x(1 + 0.02*mastery), Heavy base x(0.5 + 0.04*mastery) floored at 100, Dual base x1 floored at 100, Reversed base x1.4. DAMAGE: Light x(0.5 + 0.04*mastery), Balanced x(1 + 0.02*mastery), Heavy/Dual/Reversed x1.4. So Light = long reach / low damage and Heavy = short reach / high damage, with mastery moving the weak axis. The ANDROID v0.682 numbers the packet ported (x1.5 and 0.005*mastery) are a different tuning.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3091-3155 (setStance / reach) and :3255-3277 (getMaxDamage); base term reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2344-2347`
- **Quote:** §1t99s0§.as:3094  this.§1t4417s0§ = this.§1t4420s0§ * 1.4;                                  // LIGHT reach\n§1t99s0§.as:3105  this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);   // BALANCED reach\n§1t99s0§.as:3116  this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1); // HEAVY reach, floor 100\n§1t99s0§.as:3262  _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);                  // LIGHT damage\n§1t99s0§.as:3265  _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);                    // BALANCED damage\n§1t99s0§.as:3270  _loc2_ = _loc1_ * 1.4;       
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs …) [REBUILD_READINESS.md:194]"
- **Lane impact:** L5 combat-core — this is ledger blocker ①, closed with the TARGET build's numbers. The base term 120 + floor((90 + DAN*5)*SPD/(20+SPD)) is identical in both builds and can be banked as CONTRACT; the five multipliers must come from §1t99s0§.as, not from MCSPlayer.as. Feeds InputManager.setMaxDistance as the drawn-line cap.

### `npcdata/five-stances-reversed-and-dual` — HELD [A2] ⚑ OVERTURNS LEDGER

Skills 1500 and 1501 are not merely unnamed enemy-only entries — they are two additional STANCES. EnemyElite.init dispatches getMastery(1500) > 0 to setStance(REVERSED_STANCE) and getMastery(1501) > 0 to setStance(DUAL_STANCE), with the same dispatch in EnemyPlayer and FriendlyElite, and the build ships dedicated animation payloads for both. The shipped game therefore has FIVE stances (light, balanced, heavy, reversed, dual), not three. Carriers in npcdata: 1500 -> Aboshi (:3662) and Magoichi (:3898); 1501 -> Gojo Takamori (:3934 and :3956).

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/EnemyElite.as:160-167; same dispatch at EnemyPlayer.as:836-840 and FriendlyElite.as:83-87; art at reference/extracted/android/95_MCSCharacter_ReversedStanceAnimationData.bin and 101_MCSCharacter_DualStanceAnimationData.bin; carriers at reference/extracted/npcdata.xml:3662, :3898, :3934, :3956`
- **Quote:** if(xml.getMastery(1500) > 0)
{
   setStance(REVERSED_STANCE);
}
else if(xml.getMastery(1501) > 0)
{
   setStance(DUAL_STANCE);
}
else if(lightMastery == balancedMastery && balancedMastery == heavyMastery)
{
   setStance(Math.random() * 3);
}
- **Overturns:** "Stance system = 3 stances (light / balanced / heavy)"
- **Lane impact:** Any stance model with three states is short two. Reversed and Dual are enemy-only (no string-table name, empty chi/cooldown in skilldata) but ship full animation blobs alongside 108_LightStance, 97_BalancedStance and 106_HeavyStance — so they are renderable, not vestigial. This upgrades the packet's npcdata/boss-movesets hedge ('implying five stance masteries') from an inference to a held fact.

### `npcdata/hp-less-combat-rows-default-to-1` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

XMLNpc defaults hp to 1 whenever the <hp> element is absent. Combined with the census behind my refutation of npcdata/per-enemy-hp, that means 22 combat-<ai> NPCs — including bosses Gojo Takamori (ai29 EnemyElite, 14-skill loadout with Undying) and Magoichi — reach the parser at 1 HP, and they carry no <lvl> either, so NPC.setLevel may never fire with a real level for them. Where their real HP and level come from at spawn is not established by anything I opened.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLNpc.as:143-149; hp-less combat rows at reference/extracted/npcdata.xml blocks 3365, 3424, 3760, 3777, 3863, 3884, 3917, 3939, 4021, 4256, 4275, 4293`
- **Quote:** if(xml.hp.toString() != "")
{
   this.hp = xml.hp;
}
else
{
   this.hp = 1;
}
- **Overturns:** "per-enemy HP authored for all combat NPCs"
- **Lane impact:** A live blocker the packet's per-enemy-hp claim was hiding behind 'the 92 hp-less rows are non-combat NPCs'. Twelve of them carry full <skills> loadouts. Closing it needs the quest/wave spawn path (QuestEngine / NPCManager.createNPC callers) to show what lvl and hp these rows are handed.

### `questdata-critic/overworld-is-generated` — HELD [A2] ⚑ OVERTURNS LEDGER

The overworld is PROCEDURALLY GENERATED, not authored. NodeGenerator exposes generateNode(nodex,nodey), generateRooms(nodeid,...), getLocationType(nodeid), getRoomBG(nodeid) and getNodeName(nodeid). reference/extracted/android/112_Mobile_NodeData.bin holds only 44 <node> elements — the hand-authored story nodes — of which 30 carry a <name>. Any claim treating that file as 'the world graph' is scoped wrong by orders of magnitude.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeGenerator.as:330, :566, :1539, :1570, :1637; node count measured in reference/extracted/android/112_Mobile_NodeData.bin`
- **Quote:** NodeGenerator.as:330  `public function generateNode(nodex:int, nodey:int) : XMLWorldNode`  ||  :566 `public function generateRooms(nodeid:int, generateInnerRooms:Boolean = true, locationType:int = -1, theme:int = -1, overwriteType:int = 0) : Array`  ||  :1637 `public function getNodeName(nodeid:int) : String`
- **Overturns:** "(1) world bounds + geography (sparse Japan-outline, not a WxH grid)"
- **Lane impact:** L8 world-exploration must model a GENERATOR, not a map. This reframes the whole system: there is no finite authored geography to recover beyond 44 story nodes.

### `questdata-critic/placename-generator-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The overworld place-name system is HELD end-to-end and machine-reproducible from the shipped WEB client. getPlaceName(territoryID) splits the id into territoryx = id>>12 & 0xFFF and territoryy = id & 0xFFF, takes namex = territoryx % 137 and namey = territoryy % 26, and either indexes the 677-entry place table at [namex*26+namey] (when namex < 26) or composes namestarting[RNG(id*2).rand(78)] + nameending[rand(37)]. Run unmodified against the coordinates visible in the frames it produces 'Chikada' (tid 1405270), 'Kakuchi' (1409366) and 'Kasuta' (1397077) exactly. Two territory IDs are hard-coded overrides: 1405272 -> 'Ibamaya', 1524045 -> 'Gokura'. The on-screen location bar is a three-part composite: direction + getPlaceName(territoryID) + a room-type string from the string table (strings.json["1005"]='Mine', ["1015"]='Mountain Path', ["1003"]='Forest').

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t136s0§.as:152 (WEB v0.717) and reference/decompiled/shs3_android/scripts/NameGenerator.as:135, :162, :40, :42 + reference/decompiled/shs3_android/scripts/RNG.as:68`
- **Quote:** §1t136s0§.as:152  `var _loc2_:int = param1 >> 12 & 0x0FFF;`  ||  :154 `% 137`  ||  :155 `% 26`  ||  :140 `if(param1 == 1405272)`  ||  NameGenerator.as:162 `public function getTownName2(territoryID:int) : String` -> `namestarting[rng.rand(...)] + nameending[rng.rand(...)]`
- **Overturns:** "(1) world bounds + geography (sparse Japan-outline, not a WxH grid) — mine Fandom Category:Territories via API; trace the map image."
- **Lane impact:** L8 world-exploration blocker (1) is closed for place naming. Refutes questdata/placename-source outright and destroys the inference in questdata/frame-vs-payload-placenames. Recreation needs the 677-entry table, the 78+37 syllable arrays, the LCG seed*9301+49297 mod 233280, and the two hard-coded overrides.

### `questdata-critic/xp-curve-held-web` — HELD [A2] ⚑ OVERTURNS LEDGER

The COMPLETE 99-entry level XP curve is a literal array in the shipped WEB payload, not merely two frame-read points. [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,...,25395800,29395800]. This also corrects the packet's frame-read by-product: L7->L8 is 16350, not 16550 — the 16550 came from reading a 480x270 survey-scale frame without upscaling.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364 (WEB v0.717); duplicated at reference/decompiled/shs3_android/scripts/StatsManager.as:78`
- **Quote:** §1t1523s0§.as:364  `public static const §1t5923s0§:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,...]`
- **Overturns:** "the L11-80 XP curve is likely unrecoverable"
- **Lane impact:** L3 progression: the whole L1-99 XP curve is measured, not inferred. Every INFERRED XP threshold in the config can be promoted to CONTRACT.

### `questdata/archer-ai-firing-rule-and-gravity` — HELD [A2] ⚑ OVERTURNS LEDGER

The live archer AI firing rule and the global projectile gravity constant are both held, closing the ledger's 'arrow arc physics' item outright. Projectile.GRAVITY = 3 (px/frame^2), applied as velY += GRAVITY every update. EnemyArcher.fireArrow() fires from (mcs.x, mcs.y-60) at a target sampled at (target.mcs.x, target.mcs.y-60), solving a fixed-45-degree-ish ballistic: velA = sqrt(GRAVITY*|dx|/0.866), velXa = velA*0.866, t = |dx|/velXa, velYa = (dy - 0.5*GRAVITY*t*t)/t, sign-flipped when firing left, then a uniform aim jitter velYa += Math.random()*8 - 4. Above level 50 a coin flip sets Damage.LAUNCH_KNOCKDOWN on the arrow. EnemyGoblinThrower uses the identical solve; EnemyKanjiGuardian divides by 0.866/3 for a flatter arc.

- **Cite:** `reference/decompiled/shs3_android/scripts/Projectile.as:8, ArrowProjectile.as:56, EnemyArcher.as:271, :277, :281, :286, EnemyGoblinThrower.as:555, EnemyKanjiGuardian.as:464`
- **Quote:** Projectile.as:8  internal static var GRAVITY:Number = 3;  ||  EnemyArcher.as:277  var velA:Number = Projectile.GRAVITY * Math.abs(targetX - fireX) / 0.866;  ||  :281  var velYa:Number = (targetY - fireY - 0.5 * Projectile.GRAVITY * t * t) / t;  ||  :286  velYa += Math.random() * 8 - 4;  ||  ArrowProjectile.as:53  rotation = Math.atan(velY / velX) * 57.2727 + 180;  :56  velY += GRAVITY;
- **Overturns:** "⑤ Undead damage-reflect probability; arrow arc physics."
- **Lane impact:** L7 enemies-ai blocker ⑤ ('arrow arc physics') closes. L1 combat-core gains a hard gravity constant for every ballistic projectile. Directly refutes the stated honest-limit in questdata/projectile-launch-params.

### `questdata/dialogue-is-a-branching-VM` — HELD [A2] ⚑ OVERTURNS LEDGER

questdata.xml is not a linear script - it is a branching dialogue interpreter, and no claim in the packet mentions any of its control flow. 715 <goto> nodes jump over 163 <label> targets (label1 x87, label2 x38, label3 x25, label4 x10, label5 x2, label6 x1) or to numeric dialogue ids. 196 <option> blocks hold 471 <choice> elements, each a player line plus its own <goto>. 386 <outcome> blocks carry <id>, <set> (194 quest-variable writes; domain includes 0,1,2,5,12,15,27,1000), <modify> (74; 69x'0', 3x'1', 1x'5', 1x'-1') and <end> (386). Also unmentioned: 62 <condition> step gates, 54 <startin>, 14 <teleportnode> + 14 <teleportposx> forced world-graph jumps, 5 empty <ending> terminators, 32 <completedquest> prerequisites, 9 <has>/<comp> inventory gates.

- **Cite:** `reference/extracted/questdata.xml:146 (<option>), :148 and :152 (<choice>), :150 and :154 (<goto>), :161 (<label>label2</label>), :164-167 (<outcome><id>111</id><set>5</set><end>0</end>), :178 (<modify>0</modify>), :185 (<goto>label2</goto>)`
- **Quote:** questdata.xml:148  <choice>  :149 <text>I'll stand my ground and ask them to leave me alone.</text>  :150 <goto>9</goto>  ||  :161  <label>label2</label>  ||  :164 <outcome> :165 <id>111</id> :166 <set>5</set> :167 <end>0</end>  ||  :185  <goto>label2</goto>
- **Lane impact:** L9 quests-story: any recreation that ingests questdata as a flat script will render the wrong story. The engine needs a label/goto interpreter, a choice UI, and a quest-variable store with set/modify semantics. Nothing in the 12 ledger systems models this.

### `questdata/node-name-pipeline-END-TO-END` — HELD [A2] ⚑ OVERTURNS LEDGER

The full on-screen node-name pipeline is held and I verified it end-to-end against shipped data. getNodeName() = direction-prefix + generated town name + background-type noun. Direction comes from the node's sector-within-territory: terrSector.y<=1 -> 'N', >=4 -> 'S'; terrSector.x<=1 -> 'W', >=4 -> 'E'. Background nouns are string ids 1002 Field / 1003 Forest / 1006 Road / 1015 Mountain Path / 1020 Beach / 1021 Cave / 1022 Waterfall. Worked proof: questdata.xml:15 <node>8382465</node> -> sector (2046,2049) -> territory (341,341) -> territoryId 1397077 -> getTownName2 = 'Kasuta'; terrSector.x = 0 -> 'W'; bg 4 -> 'Forest'; result 'W Kasuta Forest', which is exactly strings.json["1037"], the <name> stored on that node. Node 8726547 -> 'Yasuoka', matching strings.json["1039"] 'Yasuoka Forest'.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeGenerator.as:296, :305, :314, :1637, :1694, :1701 joined to reference/extracted/android/112_Mobile_NodeData.bin:5-6 and reference/extracted/questdata.xml:15`
- **Quote:** NodeGenerator.as:314  var sectorx:int = nodeid >> 12 & 0x0FFF;  :317 var sectory:int = nodeid & 0x0FFF;  :318 territoryx = sectorx % 6  ||  :1694  return dir + territoryName + " " + bgString;  ||  :1701  return LangManager.getString(557) + "(" + (territory.x - 341 + WarSelectUI.DTERRSHIFTX) + "," + (territory.y - 341 + WarSelectUI.DTERRSHIFTY) + ") " + LangManager.getString(319) + "(" + sector.x + "," + sector.y + ")"  ||  strings.json["398"]='N' ["399"]='S' ["400"]='E' ["401"]='W' ["557"]='Territory' ["319"]='Sector'
- **Lane impact:** L8 world-exploration: closes the axis question the packet's node-packing claim left open. +4096 = one sector East, +1 = one sector South, 6x6 sectors per territory, display origin at territory 341.

### `questdata/placename-generator-DECODED` — HELD [A2] ⚑ OVERTURNS LEDGER

The v0.717 wilderness place-name generator is fully held and deterministic. NameGenerator.getPlaceName(territoryID) special-cases two territory ids, then splits territoryID into territoryx = ID>>12 & 0xFFF and territoryy = ID & 0xFFF; if territoryx % 137 < 26 it indexes the 677-entry place table at (territoryx%137)*26 + (territoryy%26); otherwise it concatenates namestarting[78] + nameending[37] under RNG(territoryID*2), giving 2,886 possible names. 'Chika'+'da' = Chikada, 'Ka'+'kuchi' = Kakuchi, 'Kasu'+'ta' = Kasuta, 'Moto'+'harah' = Motoharah, 'Yasu'+'oka' = Yasuoka, 'Atsu'+'zawa' = Atsuzawa. I re-implemented the shipped LCG and confirmed by brute force.

- **Cite:** `reference/decompiled/shs3_android/scripts/NameGenerator.as:40, :42, :135, :156, :162, :169 and reference/decompiled/shs3_android/scripts/RNG.as:68`
- **Quote:** NameGenerator.as:40  internal var namestarting:Array = ["Cho","Dai",...,"Chika",...,"Ka","Kasu","Kiyo","Ko"];  ||  :42  internal var nameending:Array = ["ta","yama",...,"kuchi","da",...,"maki","bara"];  ||  :135  public function getPlaceName(territoryID:int) : String  ||  :152 var territoryx:int = territoryID >> 12 & 0x0FFF;  ||  :169  return this.namestarting[rng.rand(this.namestarting.length)] + this.nameending[rng.rand(this.nameending.length)];  ||  RNG.as:68  this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;
- **Overturns:** "① **world bounds + geography** (sparse Japan-outline, not a W×H grid) — *mine Fandom Category:Territories via API; trace the map image.*"
- **Lane impact:** L8 world-exploration: wilderness naming is not lost and never needs authoring - it is reconstructible from the node id alone. Overturns this packet's own questdata/placename-source STILL_UNHELD and the 'source not shipped in the client' inference in questdata/frame-vs-payload-placenames. Brute-force confirmation: Chikada <- territoryID 736/1318/5590/6172; Kakuchi <- 9104/9686/10268/15122; Kasuta <- 2833/3415/3997/4579.

### `questdata/wave-encounter-table-and-pipe-grammar` — HELD [A2] ⚑ OVERTURNS LEDGER

questdata carries a complete combat-encounter table nobody in the packet decoded: 118 <wave> blocks holding 169 <enemy> entries across 36 distinct id specs. The <id> field uses a pipe-delimited random-pick grammar - '19|20|21|22|23|24' (74 uses) picks one of six Soldier variants, '40|41|42|43|44|45' Cultists, '11|12|13|14|15|16' Bandits, '86' (24 uses) Undead, '151' the named boss Jinbei. <lvl> spans 2..35 and <qty> 1..10. Four waves carry <endless>1</endless>. 70 <friend> blocks spawn allied NPCs inside waves, each with <fatal>0</fatal> (a per-ally death flag, always 0 in shipped content).

- **Cite:** `reference/extracted/questdata.xml:11713-11720 (wave with <id>86</id><qty>10</qty><lvl>18</lvl> and <endless>1</endless>), :77, :217, :229 (first waves), :11719, :18120, :25350, :26107 (the four <endless>); ids resolved via docs/gauntlet/L0/index/resolved_names.json npcdata.xml resolved["86"]='Undead', ["19"]='Soldier', ["40"]='Cultist', ["11"]='Bandit', ["151"]='Jinbei'`
- **Quote:** questdata.xml:11713  <enemy>  :11714 <id>86</id>  :11715 <qty>10</qty>  :11716 <lvl>18</lvl>  :11717 </enemy>  :11718 <endless>1</endless>
- **Lane impact:** L7 enemies-ai gains 118 authored encounters with exact rosters, levels and counts - a ready-made encounter ladder. L2/L3 gain a real level curve reference (waves span lvl 2..35 across the campaign). The pipe grammar also means npcdata ids come in variant runs of 5-7, which the enemy-roster models should mirror.

### `skilldata/web-cooldown-modifier-caps-spd-at-600` — HELD [A2] ⚑ OVERTURNS LEDGER

WEB v0.717's SPD→cooldown modifier caps SPD at 600 and returns 1 - SPD/1200, i.e. exactly half the per-point effect of the ANDROID v0.682 form (cap 300, 1 - SPD/600). The -50% ceiling and the x1.5 speed-buff step before the cap are the same in both. This also re-pins the reader's SPD in the longplay: the measured 4.96 / 9.92 / 8.92 s cooldowns come from raw 5 / 10 / 9 s at SPD 10, not SPD 5.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2279-2295, consumed at reference/decompiled/shs3_payload/scripts/§1t105s0§.as:318; contrast reference/decompiled/shs3_android/scripts/StatsManager.as:1854-1861`
- **Quote:** §1t1523s0§.as:2289  internal static function §1t9590s0§(param1:int) : Number\n{\n   if(param1 > 600)\n   {\n      param1 = 600;\n   }\n   return 1 - param1 / 600 * 0.5;\n}\n§1t105s0§.as:318  return _loc2_ * §1t1523s0§.§1t9589s0§();\n\n(android StatsManager.as:1856  if(speed > 300) { speed = 300; }  :1860  return 1 - speed / 300 * 0.5;)
- **Overturns:** "④ SPD→cooldown formula. [REBUILD_READINESS.md:195]"
- **Lane impact:** L5 combat-core and skills-meters — closes ledger blocker ④, but with the WEB constants. Porting the android form would double every SPD point's cooldown reduction and would make the two measured Focus cooldowns irreproducible.

### `skills-meters/crit-is-deterministic-at-full-reload-bar` — HELD [A2] ⚑ OVERTURNS LEDGER

The crit proc rule is NOT missing. Criticals are deterministic, not a chance roll: a slash crits exactly when the reload/Focus bar is full (reload == maxreload). WEB v0.717 multiplies by a flat 1.3 and adds the gear stat STAT_CRITICALDMG; ANDROID v0.682 retuned this to x1.5 in Light Stance and x1.2 in every other stance. The UI confirms it — the 'Critical Hit' text is bound to the reload bar being at 100%.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3275 (web v0.717); reference/decompiled/shs3_android/scripts/MCSPlayer.as:3215-3222 (android v0.682); reference/decompiled/shs3_android/scripts/BattleUI.as:262 and :102; docs/gauntlet/L0/index/strings.json["175"]`
- **Quote:** §1t99s0§.as:3272  if(this.§1t4414s0§ == this.§1t4415s0§)\n{\n   return _loc2_ * 1.3 + this.§1t1243s0§;\n}\n\nMCSPlayer.as:3215  if(this.reload == this.maxreload)\n{\n   if(this.stance != LIGHT_STANCE)\n   {\n      return maxDamage * 1.2 + this.STAT_CRITICALDMG;\n   }\n   return maxDamage * 1.5 + this.STAT_CRITICALDMG;\n}\n\nBattleUI.as:262  this.crittext.visible = percentage >= 1 && this.reloadbar.visible;\nstrings.json["175"] = 'Critical Hit'
- **Overturns:** "⑤ crit **proc** rule (chance vs deterministic) — entirely absent. [REBUILD_READINESS.md:195]"
- **Lane impact:** L5 combat-core and skills-meters — closes ledger blocker ⑤ outright. Crit is a skill-expression mechanic, not RNG: hold the Focus bar at max and your next slash crits. Port the WEB value x1.3 flat; the ledger's existing 'crit = 1.3× formula' (REBUILD_READINESS.md:194) was RIGHT and must not be overturned. Also gives the Focus meter its purpose, which the ledger had as a blocker.

### `skills-meters/focus-reload-meter-web-numbers` — HELD [A2] ⚑ OVERTURNS LEDGER

Complete web-build numbers for the Focus/reload meter. Max is a hard constant 8*24 = 192 frames (8 s at 24 fps), NOT 48 + 6*SPD — the getBaseReload() value is stored and never read. It fills +1 per tick, so a full bar takes exactly 8 s. Per-slash drain is the weapon's slashusage (floor 48) scaled by stance: /2 in Light, x1 in Balanced and Reversed, x1.5 in Heavy and Dual. Switching stance costs a flat 48 frames on the web (android cuts to a third above half, else minus a sixth). The Focus skill sets reload to maxreload - 1. And a stance switch is refused outright while reload < maxreload/6 — that is the 'CANNOT CHANGE STANCE' label visible in the longplay.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249, :1203-1205, :3299-3311, :3160-3166; reference/decompiled/shs3_android/scripts/MCSPlayer.as:239, :1158-1160, :2975-2980, :3246-3258; reference/decompiled/shs3_android/scripts/SkillManager.as:218-219; reference/decompiled/shs3_android/scripts/StatsManager.as:1921-1930`
- **Quote:** §1t99s0§.as:249   this.§1t4415s0§ = 8 * 24;          // web maxreload = 192 frames\nMCSPlayer.as:239  this.maxreload = 5 * 24;           // android maxreload = 120 frames\n§1t99s0§.as:1205  ++this.§1t4414s0§;                 // fill: +1 per tick\n§1t99s0§.as:3162  this.§1t4414s0§ -= 48;             // web stance-switch cost, flat\nMCSPlayer.as:3249 this.reload -= this.slashUsage / 2;      // LIGHT\nMCSPlayer.as:3253 this.reload -= this.slashUsage;          // BALANCED / REVERSED\nMCSPlayer.as:3257 this.reload -= this.slashUsage * 1.5;    // HEAVY / DUAL\nMCSPlayer.as:2977 if(this.reload < this
- **Overturns:** "③ Focus numerics (max/fill/switch-cost). [REBUILD_READINESS.md:195]"
- **Lane impact:** L5 combat-core and L7 ui-hud — closes ledger blocker ③ with real numbers, and ties into the crit finding: the bar is a resource you spend to slash and hold full to crit. Also supplies the 'CANNOT CHANGE STANCE' gate the frames show, which nothing in the ledger explains.

### `string-table/piercing-and-crit-are-web-v0717-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The 'Critical Damage' / 'Piercing Damage' stat channels carry NO Android-only caveat: the WEB v0.717 payload's own tooltip authoring text names both, so the survey's build-parity hole on this claim does not exist.

- **Cite:** `reference/extracted/ui_strings.txt:100`
- **Quote:** ="1">physical dmg: 1234 - 1235 &nbsp;(heavy)critical dmg: 1234-1235 *(heavy)piercing dmg: 20<font face="Edo SZ" size="14" color="#cccccc" letterSpacing="0.
- **Overturns:** "**Ready:** gesture→attack map; damage formula ((ATK+Wpn)×stance, crit 1.3×, Heavy def ×0.8)"
- **Lane impact:** L-combat-core + L-items-equipment: retires the 'android v0.682 only, a stat panel is exactly the surface that could differ' caveat on the piercing/crit channels. Combined with combat-core.md:448 (Damage.as:150-172, 'lvl <= 10 -> 1 + piercing ... else lvl/4 + piercing') and the banked items-equipment/stat-vs-level-curve (ItemGenerator.as:150-183, prog5 = PIERCINGDMG), both channels are held in BOTH builds with arithmetic attached — they should be moved off the unknown list, not added to it.

### `ui-hud/in-combat-hud-is-three-bars` — HELD [A1] ⚑ OVERTURNS LEDGER

The in-combat player HUD has THREE bars, not two: green HP over blue Chi over a third tan/gold reload (Focus) bar. The third bar carries the status text 'CANNOT CHANGE STANCE' when it is below a sixth of max. The two-bar reading comes from overworld frames, where the reload bar is hidden. Separately, the yellow '150% DAMAGE' text under the bars is a temporary food buff, not a stance or crit multiplier — mis-reading it as a combat constant is an easy trap.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_431.0.png, crop (150,960)-(560,1050) upscaled 4x LANCZOS, compared against frames 427.0 and 429.0 (same crop); contrast reference/frames/combat_frames/Nr4fQstqHDM_t0130s.png (full 1920x1080, overworld); docs/gauntlet/L0/index/strings.json["4132"]`
- **Quote:** Visibly in the crop: a circular straw-hat portrait medallion ringed in RED; a green bar reading '20/20'; directly below it a blue bar reading '26/26'; directly below that a tan/gold bar with 'CANNOT CHANGE STANCE' overlaid; below the cluster yellow text '150% DAMAGE'. Across frames 427.0 / 429.0 / 431.0 the tan bar's fill length changes, so it is a meter, not a plate. Corroboration: BattleUI.as:60 'public var reloadbar:MovieClip;' and MCSPlayer.as:2977 'if(this.reload < this.maxreload / 6) { return; }'. strings.json["4132"] = 'Eat this potato to get the 150% Damage buff.\n\nNote: Only one buff
- **Overturns:** "② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued. [REBUILD_READINESS.md:235]"
- **Lane impact:** L7 ui-hud and L5 combat-core — the HUD spec needs a third meter, and it is the same meter that gates stance switching and triggers criticals. The overworld HUD (two bars + XP + minimap + action row) is a genuinely different layout and should be specced separately.

### `NF-10-category-tab-mapping-declared-in-code` — HELD [A2]

The skill-screen tab mapping is declared verbatim in code, not merely inferable from the string table: SkillScreenUI.categoryDesc is a ten-element array of string ids 6024..6033, indexed by category. Category 11 has no entry, which is the code-level proof that it is not a player tab.

- **Cite:** `reference/decompiled/shs3_android/scripts/SkillScreenUI.as:104`
- **Quote:** this.categoryDesc = [6024,6025,6026,6027,6028,6029,6030,6031,6032,6033];
- **Lane impact:** L8 ui-hud — upgrades skilldata/category-to-tree-names from a hand cross-check to a declared contract, and SkillScreenUI.as (910 lines) is an unopened source for the whole skill-screen layout.

### `NF-11-category-11-skills-are-in-npcdata` — HELD [A2]

The category-11 enemy skills DO appear in npcdata rows, contrary to the packet's category-11-enemy-only claim. npcdata encodes them as <skill><id>NNNN</id><lvl>N</lvl></skill>, not <skill>NNNN</skill>, which is why the surveyor's grep returned zero. Skill 1500 is granted in 5 npc rows, 1501 in 2, 1068 Undying in 5 (including at <lvl>2</lvl>), 1064/1065 in 5 each, 1066/1067 in 2 each.

- **Cite:** `reference/extracted/npcdata.xml:3934, :3898, :4349, :3662`
- **Quote:** npcdata.xml:3934  <skills><skill><id>1501</id><lvl>3</lvl></skill><skill><id>1003</id><lvl>1</lvl></skill>...<skill><id>1064</id><lvl>1</lvl></skill><skill><id>1065</id><lvl>1</lvl></skill><skill><id>1068</id><lvl>1</lvl></skill></skills>
npcdata.xml:4349  ...<skill><id>1500</id><lvl>3</lvl></skill>...<skill><id>1068</id><lvl>2</lvl></skill>
- **Lane impact:** L4 enemies-ai — the REVERSED_STANCE and DUAL_STANCE NPCs are enumerable BY ROW (5 and 2 respectively), and the two-tier Undying that MCSPlayer.as:2164 branches on has its <lvl>2</lvl> data row at npcdata.xml:4349. Method warning for the whole gauntlet: npcdata's skill encoding differs from skilldata's, and a naive <skill>ID</skill> grep silently returns a false negative.

### `NF-12-web-swf-header-declares-24fps` — HELD [A3]

The WEB build's own SWF header declares frameRate = 24.000 (CWS, SWF version 17, frameCount 6); the Android payload header says 24.000 as well (CWS, version 26). This closes the android-provenance hole in the packet's two 24fps claims, whose only frame-rate cite was Mobile.as:117 — an Android-only wrapper line.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf and reference/decrypted/shs3_android_payload_decoded.swf — SWF header parse (sig/version/RECT skip/frameRate 8.8 fixed LE)`
- **Quote:** ('reference/decrypted/shs3_payload_decoded.swf', 'CWS', 17, 'frameRate=24.000', 'frameCount=6')
('reference/decrypted/shs3_android_payload_decoded.swf', 'CWS', 26, 'frameRate=24.000', 'frameCount=6')
- **Lane impact:** All lanes — the x2.5 rescale from OG frames to this repo's fixed 60Hz Sim is now grounded in the WEB artifact, not inferred from the Android wrapper. Every <anim d="N"> and every cooldown*24 converts at x2.5 with no build caveat.

### `NF-13-steal-was-a-node-action-not-a-skill` — PARTIAL [A2]

Steal shipped in the overworld NODE-ACTION space, not the skill space. NodeUI declares ACTION_STEAL = 22 alongside ACTION_ATTACK and ACTION_BACK, and GenericActionButton maps it to an embedded StealActionIcon. That is why the Steal content has strings (6022, 6023, 7024-7028) and art but no <skill> row — and it is further evidence against attributing it to the missing skill id 1023.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeUI.as:57; GenericActionButton.as:191-193 and :309-311; StealActionIcon.as:5-6`
- **Quote:** NodeUI.as:57  public static var ACTION_STEAL:int = 22;
GenericActionButton.as:191-193  case NodeUI.ACTION_STEAL: this.image = new StealActionIcon(); break;
StealActionIcon.as:5  [Embed(source="/_assets/assets.swf", symbol="symbol1076")]
- **Lane impact:** L11 meta-social and L9 world — reclassifies the orphan Steal set from 'cut skill' to 'node action on the overworld map', which is where an asynchronous PvP theft mechanic would live. PARTIAL because ACTION_STEAL is referenced only by the icon switch in the whole android script set; I did not find a node in the data that issues it, so whether any shipped node offered the button is still open.

### `NF-14-canchangestance-is-a-state-whitelist` — HELD [A2]

Stance switching is gated by an explicit action-state whitelist: only IDLE, POSE, RUN, WALK and SKILL_CHICHARGE permit a change, plus FLINCH if the previous state was one of those. The player-facing form of this rule is visible on a frame as the bar label 'CANNOT CHANGE STANCE'.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:2965-2968; frame corroboration at reference/frames/duel_dense/Nr4fQstqHDM_431.0.png`
- **Quote:** public function canChangeStance() : Boolean
{
   return actionState == IDLE_STATE || actionState == POSE_STATE || actionState == RUN_STATE || actionState == WALK_STATE || actionState == SKILL_CHICHARGE_STATE || actionState == FLINCH_STATE && (prevActionState == IDLE_STATE || prevActionState == POSE_STATE || prevActionState == RUN_STATE || prevActionState == WALK_STATE);
}
- **Lane impact:** L5 combat-core and L8 ui-hud — the stance-switch cost (reload/3 or -reload/6) only applies when this whitelist passes, so the Focus economy and the stance gate are one rule. Note the build-parity signal: 'CANNOT CHANGE STANCE' is visible in the web v0.717 longplay but I found NO matching string in the android v0.682 string table, so UI copy is NOT at parity even though skilldata is byte-identical.

### `NF-16-heavenly-sword-numbers-unclaimed` — HELD [A2]

Heavenly Sword's actual numbers are on disk and no claim in the packet carries them: skill 1047, lvlreq 65, requires skill 1046, chi 50 and cooldown 30 at every level, three levels whose descs 7078/7079/7080 read '500 damage, 5 sec delay', '500 damage, 4 sec delay', '500 damage, 3 sec delay'. Damage is flat across levels; what levels buy is a shorter telegraph.

- **Cite:** `reference/extracted/skilldata.xml:1435-1464; docs/gauntlet/L0/index/strings.json["7078"], ["7079"], ["7080"], ["6100"]`
- **Quote:** skilldata.xml:1436 <id>1047</id>  :1438 <lvlreq>65</lvlreq>  :1440 <req><has><id>1046</id><qty>1</qty></has></req>  :1446 <chi>50</chi>  :1447 <cooldown>30</cooldown>  :1448 <desc>7078</desc>
strings 7078='500 damage, 5 sec delay'  7079='500 damage, 4 sec delay'  7080='500 damage, 3 sec delay'
string 6100='Calls down a mystical sword from the heavens.\n\nDrag and drop skill icon to select target location.'
- **Lane impact:** L5 combat-core and L4 enemies-ai — a 500-damage drag-to-aim delayed AoE with a level-scaled 5/4/3-second telegraph window. Heavenly Sword is in ALL FOUR of EnemyPlayer's range buckets and is the first skill enemies use on a downed target (EnemyPlayer.as:1077), so this is a boss-fight-defining number.

### `NF-17-four-actives-cost-zero-skill-points` — HELD [A2]

Four player actives cost NO skill points, and the file expresses 'free' two different ways. Jump (1003) and Chi Punch level 1 (1042) use an EMPTY <required></required>; Dash Right (1049) and Dash Left (1050) use an explicit <required>0</required>. XMLSkill.as:253 reads it as int(this.levelList[lvl].required), and AS3's int("") is 0, so both spellings work in the OG.

- **Cite:** `reference/extracted/skilldata.xml:240 (skill 1003), :1282 (skill 1042), :1491 (skill 1049), :1506 (skill 1050); reference/decompiled/shs3_android/scripts/XMLSkill.as:253`
- **Quote:** skilldata.xml:1491  <required>0</required>   (skill 1049 Dash Right)
skilldata.xml:1506  <required>0</required>   (skill 1050 Dash Left)
skill 1003 Jump and skill 1042 Chi Punch L1 carry <required></required> (empty)
XMLSkill.as:253  required = int(this.levelList[lvl].required);
- **Lane impact:** L10 progression — the starting kit (Jump, both Dashes, Chi Punch L1) is free, which changes the 80-SP first-run budget arithmetic. PORTING HAZARD: a TypeScript port using parseInt("") gets NaN where AS3's int("") gets 0, silently breaking four skills' affordability check.

### `NF-18-full-skill-prerequisite-dag-unenumerated` — HELD [A2]

skilldata.xml carries the complete skill-tree unlock graph as 52 <req><has><id>N</id><qty>Q</qty></has></req> edges, and no claim in the packet enumerates it as a structure. The edges split three ways: 24 element-stat gates (6 per element on ids 28/29/30/31 at qty 10/30/60), 12 stance-mastery gates (4 per stance on ids 1000/1001/1002 at qty 3/4/5/10), and 16 skill-to-skill chain edges forming the Chi and Ninja ladders (1042->1005, 1005->1006, 1006->1043, 1043->1044, 1044->1045, 1045->1046, 1046->1047; 1007->1024, 1024->1010, 1051->1052, 1052->1053, 1053->1054, 1054->1012, 1012->1055).

- **Cite:** `reference/extracted/skilldata.xml — my own extraction of all 52 <req><has> edges; StatsManager.as:4152-4177 (checkConditions, comp defaults to 'gte')`
- **Quote:** edge targets by count: 28:6, 29:6, 30:6, 31:6, 1000:4, 1001:4, 1002:4, and one edge each to 1005, 1006, 1007, 1010, 1012, 1024, 1042, 1043, 1044, 1045, 1046, 1047, 1051, 1052, 1053, 1054 — 52 edges total
- **Lane impact:** L10 progression and L2 skills-meters — the entire unlock DAG is portable as data today, with no research left. Combined with the <required> SP column and the <lvlreq> ladder, the whole skill-tree economy (what unlocks what, at which character level, for how many SP) is fully specified. Nothing in the 12-system ledger currently holds this graph.

### `NF-2-crittext-gated-on-full-reload-bar` — HELD [A2]

The on-screen 'Critical Hit' label is a pure function of the reload bar being at 100%: BattleUI.updateReload sets crittext.visible = percentage >= 1 && reloadbar.visible, and the text is LangManager.getString(175) = 'Critical Hit'. This is the HUD half of the crit rule and gives a cheap A1 verification target for a future frame pass.

- **Cite:** `reference/decompiled/shs3_android/scripts/BattleUI.as:262 and :102; docs/gauntlet/L0/index/strings.json["175"]`
- **Quote:** BattleUI.as:262  this.crittext.visible = percentage >= 1 && this.reloadbar.visible;
BattleUI.as:102  this.crittext.text = LangManager.getString(175);
strings.json["175"] = 'Critical Hit'
- **Lane impact:** L8 ui-hud — the crit indicator is a discrete label above the reload bar, not a floating popup, and it appears the instant the bar fills rather than on hit. L2 skills-meters corroboration for NF-1.

### `NF-3-inventory-preview-contradicts-sim-on-crit` — HELD [A2]

The shipped build contradicts itself on crit. InventoryUI's gear-comparison panel sets critModifier = 1.2 for LIGHT stance and 1.5 for balanced and heavy — the exact inverse of the simulation's Light-1.5 / non-Light-1.2 at MCSPlayer.as:3217-3221. The 'critical dmg: min - max (stance)' readout at InventoryUI.as:2087 therefore misreports crit damage in at least one stance.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:1946 and :1955 and :1964, versus MCSPlayer.as:3217-3221`
- **Quote:** InventoryUI.as:1943-1946  stanceName = "light"; mastery = StatsManager.getStat(1000); dmgModifier = 0.5 + 0.5 * mastery * 0.01; critModifier = 1.2;
InventoryUI.as:1955  critModifier = 1.5;   (balanced)
InventoryUI.as:1964  critModifier = 1.5;   (heavy)
MCSPlayer.as:3217  if(this.stance != LIGHT_STANCE) { return maxDamage * 1.2 + ... }
- **Lane impact:** L5 combat-core must port the SIM values (MCSPlayer), not the preview values. L3 items-equipment: any 1:1 recreation of the (EQ:n) comparison UX inherits an OG bug — worth reproducing deliberately and labelling, or fixing and labelling, but not silently averaging.

### `NF-4-mastery-domain-is-1-to-10` — HELD [A2]

The stance-mastery term in both the reach and damage formulas is the 1-10 skilldata <value>, not a 0-100 figure. StatsManager.as:1834 passes getStat(1000/1001/1002) into MCSPlayer.initPlayer as lightMastery/balancedMastery/heavyMastery; getStatType routes ids 1000-1999 to SKILL and getStat returns skillStat.getValue(); and MCSPlayer.as:3166-3184 gates Launch/Deflect/AirCombo/Stab on `mastery >= 3 / >= 4 / >= 5`, thresholds only meaningful on a 1-10 ladder. InventoryUI.as:1941-1965 recomputes the identical coefficients from the same getStat calls.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3166-3184 and InventoryUI.as:1941-1965; StatsManager.as:1834, :2940-2943, :3956-3961`
- **Quote:** MCSPlayer.as:3166  this.canLaunch = this.lightMastery >= 3;
MCSPlayer.as:3167  this.canDeflect = this.lightMastery >= 4;
MCSPlayer.as:3168  this.canAirCombo = this.lightMastery >= 5;
StatsManager.as:1834  player.initPlayer(..., getBaseSlashLength(), getSlashUsage(), getStat(1000), getStat(1001), getStat(1002), getLevel());
StatsManager.as:3960  return skillStat.getValue();
- **Lane impact:** L5 combat-core — the reach and damage coefficients are now portable as numbers, no INFERRED label needed. Consequence: Balanced reach spans only x1.005..x1.05 and Heavy x0.505..x0.55, so the hard floor of 100 at MCSPlayer.as:3053-3055 is load-bearing for most of the game, not an edge case. It also unlocks the per-mastery TECHNIQUE ladder (Launch at 3, Deflect at 4, AirCombo/Launch/Stab at 5) which no claim in the packet carries.

### `NF-6-heavy-stance-takes-80pc-defense` — HELD [A2]

getDefense() returns defense * 0.8 in HEAVY_STANCE and defense unmodified in every other stance — the source line behind the ledger's 'Heavy def x0.8'. Confirmed a second time by InventoryUI.as:1964 setting defModifier = 0.8 for heavy in the gear-comparison panel.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3231-3238; corroborated at InventoryUI.as:1964`
- **Quote:** internal function getDefense() : int
{
   if(this.stance == HEAVY_STANCE)
   {
      return defense * 0.8;
   }
   return defense;
}
- **Lane impact:** L5 combat-core — the ledger already carries 'Heavy def x0.8' as Ready but had no source line; this grounds it and shows Dual/Reversed do NOT take the penalty despite sharing Heavy's 1.5x damage.

### `NF-7-focus-drain-is-stance-scaled-and-crit-empties-bar` — HELD [A2]

The Focus/reload drain is stance-scaled, and landing a crit costs the entire bar. deductReloadBar() first zeroes a full bar, then subtracts slashUsage/2 in Light, slashUsage in Balanced and Reversed, and slashUsage*1.5 in Heavy and Dual. So Light rebuilds Focus twice as fast per slash as Balanced and three times as fast as Heavy — and every crit resets the meter to zero.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3240-3263`
- **Quote:** public function deductReloadBar() : *
{
   if(this.reload == this.maxreload)
   {
      this.reload = 0;
   }
   switch(this.stance)
   {
      case LIGHT_STANCE:    this.reload -= this.slashUsage / 2; break;
      case BALANCED_STANCE:
      case REVERSED_STANCE: this.reload -= this.slashUsage; break;
      case HEAVY_STANCE:
      case DUAL_STANCE:     this.reload -= this.slashUsage * 1.5;
   }
- **Lane impact:** L2 skills-meters — completes the packet's focus-is-the-reload-meter claim, which only carried the flat slashusage. L5 combat-core — this is the actual crit economy: Light crits often for 1.5x, Heavy crits rarely for 1.2x, and that tension is the stance meta.

### `NF-8-focus-bar-displayed-zero-is-24-not-0` — HELD [A2]

The Focus bar's displayed fill is not reload/maxreload. bonusReload() pushes the bar with updateReload((this.reload - 24) / (this.maxreload - 24)), so the bar maps [24, maxreload] onto [0,1] and the first 24 frames of charge are invisible. bonusReload also grants a flat +6 reload, clamped to maxreload.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3265-3272`
- **Quote:** public function bonusReload() : *
{
   this.reload += 6;
   if(this.reload > this.maxreload)
   {
      this.reload = this.maxreload;
   }
   StageManager.getBattleUI().updateReload((this.reload - 24) / (this.maxreload - 24));
}
- **Lane impact:** L8 ui-hud and L6 art-anim-audio-feel — a rebuild that maps [0, maxreload] onto the bar will feel wrong even with every number right, because the OG hides the first 24 frames. This is exactly the 'dynamic HUD feel' the ledger's :235 blocker ② says is uncatalogued.

### `NF-shira-tancho-is-player-clan` — HELD [A2]

'Shira Tancho' is the PLAYER's own clan and is held 104 times in questdata.xml, with named members and a crane-feather heraldry — refuting the packet's claim that it is unsourced, and confirming rather than overturning the ledger's 'Shira Tancho story-only' line. Its Old Guard even has an NPC row.

- **Cite:** `reference/extracted/questdata.xml:514, :550, :560 and reference/extracted/npcdata.xml:2418`
- **Quote:** questdata.xml:514  <text>But these retainers, all with the exception of Shinmen, they’re not Shira Tancho men. They’re outsiders.</text>   ·  :550 '…the only men trustworthy enough for the job are the Shira Tancho Old Guard.'  ·  :560 'These crane feathers are symbols of clan Shira Tancho; … The three men in question are Ito, Takahasi and Yuudai'   ·  npcdata.xml:2418 = <npc> id 90, <name>5012</name> -> 'Old Guard', <ai>30</ai>
- **Overturns:** "Ready: 4 clans (heraldry/masks/daimyo/capitals) + Shira Tancho story-only."
- **Lane impact:** L-quests-story + L-meta-social: the clan is fully sourced, with heraldry (crane feathers), an Old Guard NPC actor, and named members (Shinmen, Ito, Takahasi, Yuudai — Yuudai is npcdata id 168, ai 31 FriendlySpearElite at :3506).

### `NF-string-5017-empty-by-design` — HELD [A2]

String 5017 is NOT missing from the EN table — it is present with a deliberately EMPTY <source>, one of 21 empty-source trans-units. NPCs 50-55 are nameless by design (blank nameplate), not a data gap.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin — decoded UTF-16LE, lines 4162-4164`
- **Quote:** <trans-unit id="1385" resname="5017">\n<source></source>\n</trans-unit>   — in an unbroken run: 5015 'Soldier', 5016 'Pugilist', 5017 '', 5018 'Merchant', 5019 'Old man', 5020 'General'. Empty-source resnames in the table: 665, 820, 5002, 5017, 5022, 5023, 5024, 5025, 5034, 7003, 7041, 9000, IDS_Q0TITLE, IDS_Q0S0NODE2, IDS_Q3S1NODE1, IDS_Q3S1NODE2, IDS_Q4S1NODE1, IDS_Q4S1NODE2, IDS_Q7TITLE, IDS_Q50S5NODE1, IDS_Q50S5NODE2 (21 of 2,555).
- **Lane impact:** L-art-anim + L-enemies-ai: closes the one 'unresolved NPC name' in the file. A recreation must render these six townsfolk with NO nameplate. Note the S0 UTF-16LE trap — a raw byte grep for 5017 in this file returns zero hits.

### `android-blobs/android-blob-encoding-census` — HELD [A2]

Exact encoding census of the 42 Android blobs, replacing '41 of 42 are plain UTF-8': 35 are UTF-8 text of which 18 carry a UTF-8 BOM, 1 is UTF-16LE, 5 are CWS binaries and 1 is a GIF.

- **Cite:** `reference/extracted/android/112_Mobile_NodeData.bin:1 (`<?xml version="1.0" encoding="utf-8"?>`), first-8-byte dump of all 42 files in reference/extracted/android/`
- **Quote:** efbbbf3c3f786d6c on all 18 MCSCharacter_*AnimationData.bin (UTF-8 BOM) · 3c3f786d6c207665 on 109,111,112,114,117,119,121,123,125,84,90 · 3c71756573746461 on 116_Mobile_QuestData.bin (no prolog) · plain ASCII on the five NameGenerator tables · 43575379b1896768 / 4357536448126075 / 4357537ed01c6f6f / 4357537c6073706d / 43575376db342467 = CWS on 115/113/122/124/120 · 4749463839613f00 = GIF89a on 110_Mobile_MapBitmapData.bin · fffe3c003f007800 = UTF-16LE BOM on 118_Mobile_Lang_EN.bin ONLY
- **Lane impact:** Method, all lanes reading this unit. SHARPENS android-blobs/blobs-are-utf8-not-utf16, whose headline correction is right — only the string table is UTF-16LE, so grep line numbers on the XML blobs are trustworthy — but whose '41 of the 42' silently includes six binaries where grep is meaningless, and misses that 18 blobs carry a BOM that shifts byte offset 0. Anyone byte-slicing an animation blob rather than line-reading it will be three bytes off.

### `android-blobs/bgdata-override-census-corrected` — HELD [A2]

Correction to android-blobs/bgdata-is-a-parallax-spec's override census: ffwrap is 8 rows not 6, ffscroll's range runs to 1.0 not 0.27, and three override families (ppscroll, gscroll, fgscroll) are missing from the census entirely.

- **Cite:** `reference/extracted/android/123_Mobile_BGData.bin:411 and :530`
- **Quote:** 411:\t\t<ffscroll>1</ffscroll> (also :428) — so ffscroll spans 0.05-1.0 over 14 rows {0.05,0.1,0.125,0.14,0.27,1}, not 0.05-0.27. 530:\t\t<ffwrap>2000</ffwrap> — ffwrap occupies lines 12,23,259,330,356,370,514,530 = 8 rows, four of them 2000. Uncensused: ppscroll 6 rows {0.2,0.6,1}, gscroll 2 rows {0}, fgscroll 3 rows {1.2}.
- **Lane impact:** L6 art-anim + L1 world-exploration. Everything else in that claim reproduced exactly (874 layer instances, 147/211/311/92/113, 49 records, ids 0-54 less {4,19,23,24,25,43}, contentwidth 17 rows 800-5000, wrap 17 rows all 0), so this is a repair, not a demolition. It matters because the omitted families are the ones that override the XMLBG defaults on the near planes: fgscroll=1.2 in three backgrounds contradicts the declared foregroundLayerScroll=2, and gscroll=0 in two backgrounds pins the ground plane still. A rebuilder using the declared ladder alone gets those five scenes wrong.

### `android-blobs/dead-portrait-throws-it-does-not-fall-back` — HELD [A2]

The shipped `chikako_maked` reference does not degrade to a fallback — it crashes: getPortrait returns null for a missing definition and QuestDialogueUI immediately calls addChild on that null, which is an AS3 ArgumentError #2007, with the bust already hidden one line earlier.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/ResourceManager.as:294-297 + reference/decompiled/shs3_android_payload/scripts/QuestDialogueUI.as:69-71 + reference/extracted/android/116_Mobile_QuestData.bin:12460`
- **Quote:** ResourceManager.as:294 `if(!applicationDomain.hasDefinition(mcname))` :296 `return null;`  ||  QuestDialogueUI.as:69 `this.bust.visible = false;` :70 `this.npcPortrait = ResourceManager.getPortrait(portrait);` :71 `this.portraitCanvas.addChild(this.npcPortrait);`  ||  questdata:12460 `<img>chikako_maked</img>`  (shipped symbol is portrait_chikako_mask; portrait_noportrait exists but is never reached on this branch)
- **Lane impact:** L-quests-story + L10 ui-hud. CORRECTS the remediation advice in android-blobs/portraits-decrypted-and-one-dead-reference ('a 1:1 recreation should reproduce the fallback, not invent a portrait'). There is no fallback on the portrait!="" branch — the bust is hidden at :69 and addChild(null) throws at :71. A 1:1 recreation should either fix the typo to chikako_mask or reproduce a hard failure, and must not silently substitute portrait_noportrait, which the original never reaches here.

### `android-blobs/four-shipped-bg-id-collisions` — HELD [A2]

Four background constants shipped with duplicate ids: BG_MINE2, BG_RIVERBANK, BG_DOJO4 and BG_DOJO5 re-use 46, 47, 49 and 50, which already belong to BG_JINMAKU_OUTSIDE, BG_JINMAKU_NIGHT_OUTSIDE, BG_TEMPLERUINS_FOG and BG_TEMPLEINTERIOR2 — so four named scenes resolve to somebody else's background.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/GameStage.as:102, :104, :108, :110, :122, :124, :126, :128`
- **Quote:** 102 `public static var BG_JINMAKU_OUTSIDE:int = 46;` vs 122 `public static var BG_MINE2:int = 46;` · 104 `BG_JINMAKU_NIGHT_OUTSIDE:int = 47;` vs 124 `BG_RIVERBANK:int = 47;` · 108 `BG_TEMPLERUINS_FOG:int = 49;` vs 126 `BG_DOJO4:int = 49;` · 110 `BG_TEMPLEINTERIOR2:int = 50;` vs 128 `BG_DOJO5:int = 50;` (60 BG_* constants declared, 56 distinct ids)
- **Lane impact:** L1 world-exploration + L6 art-anim. Bounds android-blobs/bgdata-is-a-parallax-spec: bgdata holds 49 records over ids 0-54 with six unused slots, and BGResource exports exactly 49 matching BG_* symbols — but GameStage declares 60 constants, so four names (Mine2, RiverBank, Dojo4, Dojo5) have no scene of their own and would load the fog/jinmaku scenes instead. Either they are abandoned constants or a shipped bug; either way a 1:1 recreation must not invent four extra backgrounds to satisfy them.

### `android-blobs/ground-blur-applies-to-two-layers-only` — HELD [A2]

The ground plane is the one exception to the blur ladder: groundLayerBlur is applied only to ground layers 1 and 2, while farthest, far, playerPlane and foreground blur every layer they own — so a recreation that blurs all ground layers at 4 is wrong.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/BG_Loader.as:248-252, contrasted with :188-191, :209-212, :229-232 and :260-263`
- **Quote:** 248 `if(i <= 2 && groundLayerBlur != 0)` 249 `{` 250 `ColorCode.blur(mc,groundLayerBlur);` 251 `mc.cacheAsBitmap = true;` 252 `}`  — every other plane guards only on `if(<plane>LayerBlur != 0)` with no index test. bgdata gcount reaches 4 (BG_ForestSpooky, BG_Graveyard, BG_TempleRuinsFog, BG_DungeonFog), so layers 3 and 4 there are authored to render SHARP.
- **Lane impact:** L6 art-anim. STRENGTHENS android-blobs/parallax-and-dof-contract, which reads the declaration site only and therefore reports groundLayerBlur=4 as a uniform plane property. It is not: it is a per-layer rule with an index cutoff, and four of the 49 backgrounds have ground layers past the cutoff. Also note only those two layers get cacheAsBitmap, so the blur is baked once and the sharp ground layers stay live.

### `android-blobs/item-art-ids-are-shared-not-identity` — HELD [A2]

Item icon art is SHARED, not one-per-item: 146 of the 982 itemdata rows carry an explicit <art> override pointing at another item's art symbol, collapsing onto 68 distinct art targets, with art 2130 alone serving 39 different consumable rows and zero rows self-referential.

- **Cite:** `reference/extracted/android/111_Mobile_ItemData.bin:327 and :485`
- **Quote:** 327:\t\t<art>20041</art>   ·   485:\t\t<art>2130</art>  (146 <art> tags total; 68 distinct targets; art 2130 x39; rows where art==id: 0; by id band — 2000:45, 4000:1, 5000:2, 7000:1, 9000:1, 11000:8, 12000:11, 13000:68, 20000:9)
- **Lane impact:** L3 items-equipment + L10 ui-hud. CONTRADICTS the parenthetical inside android-blobs/item-and-skill-icon-art-is-held ('itemdata has no <art> tag anywhere, so art id = item id'), which is false and, if reproduced as written, yields 50/99 and 58/79 instead of the correct 94/99 and 67/79. Positively, it is a real authoring contract nobody has banked: an icon manifest for a from-scratch build needs 68 targets for those 146 rows, not 146 drawings, and 39 consumables deliberately share one pill icon. The resolution rule is `art = <art> if present else id`, matching XMLItem's `this.art = this.id;` default already banked at itemdata/web-android-schema-parity.

### `android-blobs/parallax-z-order-is-authored-not-code` — HELD [A2]

The five parallax planes are not composited by the loader at all — each layer is fetched by name as an existing child of ONE authored stageContent MovieClip, so the z-order that decides what occludes the fighter is baked into the BGResource symbol and is unrecoverable from any single frame.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/BG_Loader.as:182, :205, :225, :245, :257`
- **Quote:** 182 `mc = MovieClip(this.stageContent.getChildByName("ff_" + i));` · 205 `…getChildByName("f_" + i)` · 225 `…getChildByName("pp_" + i)` · 245 `…getChildByName("ground_" + i)` · 257 `…getChildByName("fg_" + i)` — the only addChild in the class is :52 `addChild(this.stageContent);`
- **Lane impact:** L6 art-anim + method. This is the reason I refuted android-blobs/foreground-layer-occludes-the-fighters: no A1 frame can tell you whether an occluding band is ground_i or fg_i, because the code never decides — the FLA author did. Two ways to settle any such question, both cheap: measure the band's pixel displacement against the fighter's across a pan (gscroll=1 vs fgscroll=2), or decode the named children of the relevant BG_* symbol in the decrypted 120_Mobile_BGResource. It also tells a rebuilder that the 874 layer slots in bgdata are counts of pre-placed children, not a runtime spawn list.

### `combat-core/mastery-domain-is-1-to-10-resolved` — HELD [A2]

The stance-mastery domain is RESOLVED as the skilldata 1-10 <value>, and the WEB coefficients are built for it. Player masteries are getStat(1000)/getStat(1001)/getStat(1002) passed straight into initPlayer; NPC masteries are the npcdata <lvl> returned verbatim by XMLNpc.getMastery. On the web coefficients (0.2*m*0.1 = 0.02 per level, 0.4*m*0.1 = 0.04 per level) that domain gives a real spread — Balanced 1.02→1.20, Heavy 0.54→0.90 — so no 0-100 conversion exists or is needed. The android build's 0.5*m*0.01 form is the anomaly that made the domain look broken.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1834; reference/decompiled/shs3_android/scripts/XMLNpc.as:671-686; reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3105 and :3116; reference/extracted/skilldata.xml:73-79`
- **Quote:** StatsManager.as:1834  player.initPlayer(0,…,getStat(1000),getStat(1001),getStat(1002),getLevel());\nXMLNpc.as:680  if(this.skillList[i].getId() == skillid)\nXMLNpc.as:682     return this.skillList[i].getValue();\nskilldata.xml:74  <value>10</value>   (skill 1000's top level — the domain ceiling)\n§1t99s0§.as:3105  * (1 + 0.2 * this.§1t4422s0§ * 0.1)\n§1t99s0§.as:3116  * (0.5 + 0.4 * this.§1t4423s0§ * 0.1)
- **Lane impact:** L5 combat-core — closes the open question the packet honestly left STILL_UNHELD (combat-core/mastery-domain). Mastery is the raw 1-10 skill level; no rescale, no INFERRED flag needed, as long as the coefficients are taken from the web build.

### `enemies-ai/category-11-skills-are-in-npcdata` — HELD [A2]

All seven category-11 skills DO appear in npcdata rows, contrary to the packet's claim that they appear in zero. The counts are Back Throw 1064 x4, Air Stab 1065 x4, Bull Charge 1066 x1, Punch Lunge 1067 x1, Undying 1068 x2, and the two stance-selector flags 1500 x5 and 1501 x2. The reason a text grep misses them is schema: npcdata writes <skill><id>N</id><lvl>L</lvl></skill>, so the pattern <skill>N</skill> can never match.

- **Cite:** `reference/extracted/npcdata.xml:3898 and :3934 (647 <skill> occurrences across the file, 39 distinct ids)`
- **Quote:** npcdata.xml:3898  <skills><skill><id>1500</id><lvl>3</lvl></skill><skill><id>1003</id><lvl>1</lvl></skill>…<skill><id>1064</id><lvl>1</lvl></skill><skill><id>1065</id><lvl>1</lvl></skill></skills>\nnpcdata.xml:3934  <skills><skill><id>1501</id><lvl>3</lvl></skill>…<skill><id>1064</id><lvl>1</lvl></skill><skill><id>1065</id><lvl>1</lvl></skill><skill><id>1068</id><lvl>1</lvl></skill></skills>
- **Lane impact:** L4 enemies-ai — the enemy-only move set is fully authored per-NPC and can be read straight out of npcdata; no code archaeology needed to know which enemies throw, air-stab, bull-charge or resurrect. It also confirms the reversed/dual stance flags are assigned to specific NPCs (5 and 2 rows) with <lvl>3</lvl>, which is what EnemyPlayer.as:836-843 branches on.

### `gauntlet/no-web-gameplay-code-or-string-table` — HELD [A3]

Two negative results that bound every code-derived and every UI-copy claim in this lane. (1) The WEB decompile holds no gameplay classes at all: reference/decompiled/shs3_payload/scripts/ has 652 files and zero matching 'enemy' — it is skins and asset classes (torso4000.as, hair6000.as, ColorPicker_*). All 34 Enemy* classes live only in the Android bundles. (2) The web payload carries no skill-description strings: a byte-grep of the 329 MB reference/extracted/payload.xml returns 0 hits for 'Defense -20', 'Heavy Stance Mastery' and 'Effective against Balanced Stance', and none of the 27 web bindata files is a lang table. Separately, reference/extracted/android/125_Mobile_NpcData.bin is plain UTF-8, NOT UTF-16LE — the S0 blanket warning does not apply to it.

- **Cite:** `ls reference/decompiled/shs3_payload/scripts/ | grep -ci enemy -> 0 (652 files total); LC_ALL=C grep -c -a over reference/extracted/payload.xml -> 0 for each of three strings; head -60 bytes of reference/extracted/android/125_Mobile_NpcData.bin`
- **Quote:** $ ls reference/decompiled/shs3_payload/scripts/ | grep -ci enemy
0
$ LC_ALL=C grep -c -a "Defense -20" reference/extracted/payload.xml
0
$ LC_ALL=C grep -c -a "Heavy Stance Mastery" reference/extracted/payload.xml
0
$ python3: a[:60] -> b'<?xml version="1.0" encoding="utf-8"?>\r\n<npcdata>\r\n\r\n\t<npc>\r'
- **Overturns:** "web v0.717 code/strings assumed available for cross-check"
- **Lane impact:** Every gameplay-code claim in this packet is Android v0.682 by construction — there is no web AS3 to cross-check against, so this is a lane-wide provenance note rather than a per-claim defect, and it should be stamped on the ledger once instead of refuting ten claims. It also names the exact closing test for the Heavy-stance -20% parity hole: recover the web build's skill-description text from SWF DefineText/DefineEditText assets or a web-side Lang blob.

### `npcdata/kill-xp-formula` — HELD [A2]

Kill-XP is not authored anywhere in the data — it is computed from level in code as xp = lvl * 2 + 20, inside NPC.setLevel. This completes the packet's npcdata/no-kill-xp claim, which correctly found <exp> absent from npcdata but did not locate the real source.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPC.as:252 (inside public function setLevel(lvl:int), :239-260)`
- **Quote:** this.xp = lvl * 2 + 20;
- **Overturns:** "kill-XP source unknown / absent from payload"
- **Lane impact:** Closes the 'where does kill XP come from' question for the progression lane without needing a build: XP per kill = 2*level + 20, a pure function of the spawned level.

### `npcdata/setlevel-pins-everything-to-1-below-11` — HELD [A2]

NPC.setLevel rescales damage, defense and maxhp by lvl/oldLevel, applies an extra 0.9 penalty at lvl <= 20, and then HARD-PINS damage = 1, defense = 1 and maxhp = 1 for any enemy at lvl <= 10 — overriding whatever the XML authored. This is the engine-side twin of the packet's 42-row <hp>1</hp> census: sub-11 trash dying in one hit is a coded rule, not a data quirk.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPC.as:239-260`
- **Quote:** var factor:Number = lvl / this.level;
if(lvl <= 20)
{
   factor *= 0.9;
}
this.level = lvl;
this.damage *= factor;
this.defense *= factor;
maxhp *= factor;
setHP(maxhp);
this.xp = lvl * 2 + 20;
if(lvl <= 10)
{
   this.damage = 1;
   this.defense = 1;
   maxhp = 1;
   setHP(maxhp);
}
- **Overturns:** "enemy level scaling INFERRED"
- **Lane impact:** Gives the combat lane a measured level-scaling rule it did not have: a 0.9 multiplier below level 21, and a hard 1/1/1 floor at or below level 10. It also corroborates SESSION 11's measured 'mobs die in ONE hit' from the code side.

### `questdata-critic/namegen-table-sizes-corrected` — HELD [A2]

Name-generator table sizes are 398 male / 291 female / 33 noble / 36 samurai / 677 place — one more each than the packet's 397/290/32/35/676. All five .bin files end WITHOUT a trailing newline, so wc -l undercounts by one, while NameGenerator.as:50 splits on /\n/ and therefore sees the higher count as the array length used by rng.rand(arrayLength).

- **Cite:** `reference/decompiled/shs3_android/scripts/NameGenerator.as:50 joined to reference/extracted/android/85_NameGenerator_MaleNames.bin (tail has no newline: ends `sada\r\nYutaka`)`
- **Quote:** NameGenerator.as:50  `this.maleNamesArray = s.split(/\n/);`  ||  tail -c 12 of 85_NameGenerator_MaleNames.bin = `7361 6461 0d0a 5975 7461 6b61` = 'sada\r\nYutaka' (no terminating newline)
- **Lane impact:** L12 meta-social / L7 enemies-ai: the generator's index space is 398/291/33/36/677, which matters if anyone reproduces the RNG draw exactly.

### `questdata-critic/questdata-no-build-parity-hole` — HELD [A2]

reference/extracted/android/116_Mobile_QuestData.bin is byte-identical to reference/extracted/questdata.xml plus a single trailing newline (796,384 vs 796,383 bytes; b == w + b'\n' evaluates True). The campaign quest script is therefore the same content in web v0.717 and android v0.682, and every questdata-sourced claim in this lane is v0.717-valid without a build-parity caveat.

- **Cite:** `reference/extracted/android/116_Mobile_QuestData.bin vs reference/extracted/questdata.xml (byte comparison)`
- **Quote:** python3: `android bytes 796384 web bytes 796383 identical? False android==web+nl? True`; token counts inside the android blob: <quest> 61, <title> 260, Motoharah 5, Chikada 1
- **Lane impact:** Removes the standing 'Android string while asserting WEB behaviour' hole from every questdata claim in this packet. Note it does NOT extend to strings.json / itemdata / skilldata, which remain android-sourced.

### `questdata-critic/territory-sector-mapping-closed` — HELD [A2]

The on-screen TERRITORY / SECTOR readout maps to node ids exactly: nodeid = ((terrX + 341 - 21) * 6 + secX) << 12 | ((terrY + 341 - 51) * 6 + secY). Six sectors per territory on each axis. The high 12 bits are the E-W axis — the one left/right room exits traverse by +/-4096 — and the low 12 bits are N-S, traversed by +/-1. Verified against the frame's own readout: TERRITORY (23,52) SECTOR (3,5) yields territoryID 1405270, whose generated place name 'Chikada' is exactly what that frame's location bar shows.

- **Cite:** `reference/decompiled/shs3_android/scripts/OverworldHUD.as:2187 and reference/decompiled/shs3_android/scripts/WarSelectUI.as:17, :19; sector modulus at reference/decompiled/shs3_android/scripts/NodeGenerator.as:318`
- **Quote:** OverworldHUD.as:2187  `nodeid = (int(strArray[1]) + 341 - WarSelectUI.DTERRSHIFTX) * 6 + int(strArray[3]) << 12 | (int(strArray[2]) + 341 - WarSelectUI.DTERRSHIFTY) * 6 + int(strArray[4]);`  ||  WarSelectUI.as:17 `public static var TERRSHIFTX:int = 21;`  ||  :19 `public static var TERRSHIFTY:int = 51;`  ||  NodeGenerator.as:318 `var territoryx:int = sectorx % 6;`
- **Lane impact:** L8 world-exploration: closes the item questdata/node-packing-decoded explicitly left open ('which axis is N-S vs E-W and the mapping onto the on-screen TERRITORY/SECTOR readout').

### `questdata/count-corrections-to-packet` — HELD [A3]

Three measured corrections to numbers asserted inside packet claims. (1) The five name-generator tables hold 398 male / 291 female / 33 noble / 36 samurai / 677 place names - each exactly one more than the packet's 397/290/32/35/676. (2) reference/extracted/android/112_Mobile_NodeData.bin holds 44 <node> elements, not 535; 535 is the count of <id> elements across nodes, rooms and objs. 16 of 44 nodes carry an authored <name>, i.e. 36% named, not 3%. (3) The node-exit delta histogram is -4096 x19, +4096 x18, +1 x19, -1 x19; the packet says +1 x18. (4) questdata's <text> nodes total 40,135 words by my count, not 40,119.

- **Cite:** `reference/extracted/android/85_NameGenerator_MaleNames.bin, 86_NameGenerator_NobleFamilyNames.bin, 87_NameGenerator_SamuraiFamilyNames.bin, 88_NameGenerator_FemaleNames.bin, 89_NameGenerator_PlaceNames.bin (CRLF line counts) and reference/extracted/android/112_Mobile_NodeData.bin (xml.etree tag histogram)`
- **Quote:** CRLF split lengths: 85 -> 398 (first 'Akeno', last 'Yutaka'); 86 -> 33 ('Konoe'..'Yamashina'); 87 -> 36 ('Asai'..'Watanabe'); 88 -> 291 ('Ai'..'Yutsuko'); 89 -> 677 ('Anjo'..'Yamanashi').  ||  112_Mobile_NodeData tag histogram: id 535, obj 343, property 339, name 149, room 98, node 44, roomdata 44, wave 32, search 1
- **Lane impact:** Housekeeping for L7/L8/L12: the generator's namespace is 398x33 + 398x36 male-name pairings (plus 291x33 + 291x36 female) and 677 table place names, and 112_Mobile_NodeData is a 44-node SAMPLE of the world graph, not the world graph. Anyone sizing the overworld off '535 nodes' would be out by 12x.

### `questdata/cutscene-say-lines-are-string-ids` — PARTIAL [A2]

The claim that the campaign script is verbatim on disk needs one bounded qualifier: 16 cutscene spoken lines are NOT inline text. <action>say</action> carries <param>9000..9009</param> (16 uses, 10 distinct ids) which resolve through the string table, not through questdata. Nine of the ten resolve in the Android table; id 9000 does not resolve at all.

- **Cite:** `reference/extracted/questdata.xml:102, :108, :773, :779, :11732 joined to docs/gauntlet/L0/index/strings.json["9001"], ["9002"], ["9003"]`
- **Quote:** questdata.xml:11732  <param>9001</param>  (preceded by <action>say</action>)  ||  strings.json["9001"] = 'The castle town of Motoharah has fallen to our army, my lord.'  ||  strings.json["9002"] = 'All that remains for us to do now is--'  ||  strings.json["9003"] = 'Useless, useless headlice – the lot of them!'  ||  strings.json["9000"] = (absent)
- **Lane impact:** L9 quests-story: bounds the verbatim-script claim precisely. 16 lines out of 3,307 live elsewhere; 15 of them are recovered here, 1 (id 9000) is genuinely missing from the Android table and is a real build-parity hole. Note 'Motoharah' in the recovered line is itself a generator output ('Moto'+'harah'), independently corroborating the place-name finding.

### `questdata/dialogue-carries-inline-html-markup` — HELD [A2]

Dialogue text is HTML-formatted, not plain text: it embeds <br/> line breaks (14) and <font color="..."> spans (2). Quest item names inside dialogue are highlighted in #b048f8, a purple. Under the 2026-07-24 owner-permission ruling, exact OG hues are permitted, so this is directly usable as a UI token.

- **Cite:** `reference/extracted/questdata.xml:3898, :3899, :3901 (<br/>) and :3908, :4193 (<font color="#b048f8">Inokichi's club</font>)`
- **Quote:** questdata.xml:3908  <font color="#b048f8">Inokichi's club</font>  ||  :3898-:3901  <br/> <br/> ... <br/>
- **Lane impact:** L10 ui-hud / L9 quests-story: the dialogue box must be an HTML text field, not a plain label, and quest-item names render in #b048f8. Also fixes the bounty-board layout: reward text is a separate <br/>-delimited line ('Reward: 100 coins').

### `questdata/projectile-type-enum-47-and-web-delta` — HELD [A2]

The complete projectile-type enum is held: 47 named ids, 0..46, in ProjectileManager. This names every createprojectile type id questdata uses that the packet left undecoded - 17 GROUNDPUNCH, 23 CHIBURST, 24 HEAVENLYSWORD, 40 ARROW, 41 ARROWDUD, 42 PURPLEEXPLOSION. Full list: KUNAI 0, FIREBALL 1, SLASHWAVE 2, NINJASMOKE 3, LOGSMOKE 4, NINJASMOKE2 5, FIREBREATH 6, TRAP 7, TRAPEXPLOSION 8, TRAPFIRE 9, TRAPWATER 10, TRAPWIND 11, TRAPEARTH 12, KUNAIFIRE 13, KUNAIWATER 14, KUNAIWIND 15, KUNAIEARTH 16, GROUNDPUNCH 17, WINDKICK 18, WATERSPLASH 19, BLADESLASHFX 20, CHIPUNCH 21, CHIKICK 22, CHIBURST 23, HEAVENLYSWORD 24, YINYANG 25, CHARGEDSHOT 26, CHARGINGSHOTFX 27, CHARGINGFX 28, SHUNPOHIT 29, CLEAVEHIT 30, DASHFX 31, WINDMILL 32, FLASHBANG 33, WHITEOUTFX 34, NINJASMOKE3 35, BOULDER 36, VOIDSKULL 37, VOIDFIRECOLUMN 38, BIGROCK 39, ARROW 40, ARROWDUD 41, PURPLEEXPLOSION 42, INFERNO 43, TORNADO 44, TSUNAMI 45, EARTHQUAKE 46. MEASURED BUILD DELTA: the web v0.717 equivalent class runs to id 55, i.e. the web build ships 9 more projectile types than Android v0.682.

- **Cite:** `reference/decompiled/shs3_android/scripts/ProjectileManager.as:14-106 (esp. :94 PROJ_ARROW = 40, :96 PROJ_ARROWDUD = 41) vs reference/decompiled/shs3_payload/scripts/§1t112s0§.as:14-128`
- **Quote:** ProjectileManager.as:94  public static var PROJ_ARROW:int = 40;  ||  :96  public static var PROJ_ARROWDUD:int = 41;  ||  :106  public static var PROJ_EARTHQUAKE:int = 46;  ||  §1t112s0§.as:122  public static var §1t12603s0§:int = 46;  :112 ...:int = 51;  :120 ...:int = 55;
- **Lane impact:** L7 enemies-ai + L2 skills-meters: every projectile id in questdata and skilldata is now nameable. And this is the first quantified v0.682 vs v0.717 parity measurement this lane has - it bounds S0's open build-parity caveat with a number instead of a worry.

### `string-table/balanced-ring-is-khaki-on-film-not-ochre` — PARTIAL [A1]

The BALANCED portrait ring as it actually renders in web v0.717 footage is a desaturated khaki (#b3ae76, hue ~55 deg, sat ~34%), materially unlike the banked sprite-export hex #996600 (hue 40 deg, sat 100%) — so a rebuild that paints #996600 flat will not match the film, while the HEAVY ring measures #8e0807 against palette.ts ringRed 0x950d00 and does match.

- **Cite:** `reference/frames/session11/stance-reach/B_t851.933_BALANCED_ring_tan_one-tick-after-click.png, B_t855.800_HEAVY_ring_red.png, B_t851.867_LIGHT_ring_blue_CHANGE-STANCE_tooltip.png`
- **Quote:** My own horizontal scanline at y=1007 across the left annulus edge, x=78..100, on each 1920x1080 frame. BALANCED ramps 0c1711 → 343a30 → 787161 → 978c6e → aea874 → PEAK #b3ae76 / #b2b073 → a8a072 → 8f8167. LIGHT ramps 0d123a → 303473 → 5555ad → 6d6dd1 → 8285ec → PEAK #8d92f8 → 7e80e5 → 6665c3. HEAVY ramps 18090e → 2f080b → 560607 → 760807 → 820501 → PEAK #8e0807 → 7d0608 → 5b0508. I also viewed all three crops (10,915)-(210,1080) at x4 lanczos: violet-blue, khaki-tan, red annuli respectively.
- **Lane impact:** L-ui-hud + L-art-anim-audio-feel: HEAVY reconciles well (#8e0807 filmed vs #990000 asset vs src/config/palette.ts:51 ringRed 0x950d00 — the shipped config is already right). BALANCED does NOT: 100%-saturated ochre cannot compress to 34%-saturated khaki by codec loss alone across a 2-3 px annulus, so either the ring is composited with alpha/blend over the portrait or the balanced frame carries a filter. STATED PLAINLY AS §0 REQUIRES: where the doc and the frame disagree the frame wins on what is on screen — the balanced ring READS khaki on film. I mark this PARTIAL, not HELD, because I cannot separate a compositing rule from codec loss without opening the sprite export myself, which is another unit's surface. Next step is cheap: open reference/extracted/sprites/DefineSprite_3394_shs3_fla.stancecolor1_56/2.png and check for a non-255 alpha or a blend mode before anyone hard-codes #996600.

### `string-table/global-effect-titles-a-different-dialog` — HELD [A2]

String 288 'Global Effect' is the title of GlobalVarDialog — the server-global-variable popup shown after selling crops — not a field on the Rare Crops Collection screen, which is string 282 and holds exactly six slots.

- **Cite:** `reference/decompiled/shs3_android/scripts/GlobalVarDialog.as:47,80 + InteractUI_crops.as:69,260 + InteractUI.as:1552-1553`
- **Quote:** GlobalVarDialog.as:47 `this.titleText.text = LangManager.getString(288);` and :80 `return "<font color='#6666FF'>" + LangManager.getString(293) + ":  </font>";`  ·  InteractUI_crops.as:69 `internal var maxItem:int = 6;` and :260 `this.titleText.text = LangManager.getString(282) + " (" + int(count / this.maxItem * 100).toString() + "%)";`  ·  InteractUI.as:1552-1553 `QueryManager.instance.updateGlobalVar(50000 + house,count); OverworldHUD.instance.globalVarDialog.show();`
- **Lane impact:** economy — refutes the 'Global Effect' half of string-table/crop-market-is-supply-and-demand and replaces it with the real structure: crop sales write a per-clan server global at key 50000+house, and a dialog titled 'Global Effect' reports the aggregate. The Rare Crops Collection is a separate 6-slot completion screen rendering count/6 as a percentage. Neither is banked.

### `string-table/hell-is-a-first-class-room-type` — HELD [A2]

Jigoku is not just a location in dialogue — it is an enumerated room type, XMLRoomData.ROOMTYPE_HELL = 8, sitting in the same enum as DOJO 3 / PVP 9 / PVPDOJO 10 / PVPCLAN 11, and it is tested by six classes to suppress normal actions.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLRoomData.as:6-16 + OverworldHUD.as:1168-1171,1274`
- **Quote:** XMLRoomData.as:10 `public static var ROOMTYPE_HELL:int = 8;` (with ROOMTYPE_DEFAULT 0, ROOMTYPE_DOJO 3, ROOMTYPE_PVP 9, ROOMTYPE_PVPDOJO 10, ROOMTYPE_PVPCLAN 11)  ·  OverworldHUD.as:1168-1170 `else if(StageManager.getRoomPrivate() == XMLRoomData.ROOMTYPE_HELL) { this.showDialog(LangManager.getString(860),LangManager.getString(5)); }` — string 860 = "Not allowed in hell."  ·  referenced by InventoryUI, NetworkManager, PlayerPanel, OverworldHUD, QuestLogUI, XMLRoomData
- **Lane impact:** world-exploration + meta-social — strengthens string-table/jigoku-is-a-timed-penalty-jail from copy to schema. A 1:1 recreation needs a room-type enum with a HELL member that suppresses duelling, war-room entry, inventory and quest-log actions, not just a themed room. Zero corpus hits for ROOMTYPE_HELL.

### `string-table/inn-rest-is-a-floor-not-a-faucet` — HELD [A2]

Resting at an inn does not ADD AP — it sets AP to exactly maxAP/3 only if the player is BELOW maxAP/3, so a player already above a third gets nothing and resting can never raise AP above a third.

- **Cite:** `reference/decompiled/shs3_android/scripts/ScreenTransition.as:293-298 + InteractUI.as:791-801`
- **Quote:** ScreenTransition.as:293-298 — case ACTION_REST: if(StatsManager.getPlayerStats(StatsManager.STAT_AP) < StatsManager.getPlayerStats(StatsManager.STAT_MAXAP) / 3) { StatsManager.setStat(StatsManager.STAT_AP,StatsManager.getPlayerStats(StatsManager.STAT_MAXAP) / 3); } StatsManager.fullHealth();  · reached from InteractUI.as:800 `OverworldHUD.instance.screenTransition.startClose(ScreenTransition.ACTION_REST);` on the "innrest" action, priced at :798 getNodeLevel(currentNode) * 2
- **Lane impact:** world-exploration + economy — corrects the string-table claim string-table/inn-restores-one-third-of-max-ap from 'a second AP faucet with a ceiling' to 'a floor-raise with a hard cap'. A rebuild implementing AP += maxAP/3 is wrong for every rested player above 33%. HP and Chi genuinely go to full (fullHealth()); AP does not. Zero corpus hits for ACTION_REST or MAXAP/3.

### `string-table/stance-tint-covers-the-whole-medallion` — HELD [A1]

The stance colour is not confined to the portrait ring — the disc FILL behind the bust is tinted too, so the medallion is a two-part stance-coloured widget: blue ring over navy disc (Light), olive-tan ring over dark-brown disc (Balanced), red ring over dark-maroon disc (Heavy).

- **Cite:** `reference/frames/session11/stance-reach/B_t851.867_LIGHT_ring_blue_CHANGE-STANCE_tooltip.png, B_t851.933_BALANCED_ring_tan_one-tick-after-click.png, B_t855.800_HEAVY_ring_red.png — crops (0,860)-(700,1080) x2 LANCZOS and 200x170+10+915 x4`
- **Quote:** I sampled the same coordinates in all three 1920x1080 frames. Ring at (90,1022): LIGHT (98,100,183) / BALANCED (141,134,105) / HEAVY (91,7,5). Disc interior at (93,959): LIGHT (37,36,153) deep blue / BALANCED (75,74,43) olive / HEAVY (69,6,1) dark red — 166 pixels in the 90<=x<200, 950<=y<1050 window shift blue -> olive -> red across the three frames. The wide crop also shows the HUD captions the narrow crop misses: 'LIGHT STANCE' plus a 'CHANGE STANCE' tooltip in the LIGHT frame, 'HEAVY STANCE' in the HEAVY frame, both at x~220-420, alongside HP 20/20 and CHI 31/31 bars.
- **Lane impact:** ui-hud + art-anim-audio-feel — extends the banked ui-hud/stance-ring-colours-exact (which measured only the 63x63 stancecolor1_56 annulus at #4242FF/#996600/#990000) to a second tinted element behind it. A rebuild painting only the ring will be visibly wrong. It also shows the frame binds stance NAME to colour on its own, with no string and no code needed — which is why string-table/stance-ring-colours-named-in-tutorial-copy's novelty argument was unnecessary.

### `string-table/target-mode-strings-161-166-are-dead` — HELD [A2]

The six 'Target: ...' strings (161-166) are dead design copy, not a shipped skill-card row: they have ZERO call sites in either build, skilldata carries no <target> tag, and the actual skill-card composer XMLSkill.as renders no targeting row at all — so there is no evidence of an ally-targeting branch in the skill schema.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLSkill.as:101,110,119,123,131,183,192,196,263 + grep of reference/decompiled/shs3_android and shs3_payload for getString(161..166) + reference/extracted/skilldata.xml`
- **Quote:** getString(161)..getString(166) = 0 hits across shs3_android/scripts and shs3_payload/scripts, versus (126)->2, (158)->2, (159)->2, (160)->2, (167)->8, (647)->12. `grep -c '<target>' reference/extracted/skilldata.xml` = 0 and the same in 117_Mobile_SkillData.bin. XMLSkill.as's complete getString inventory over :101-263 is 160,157,155,156,167,647,648,124,302,120,726,727,728,729,158 — e.g. :119 `outputString += LangManager.getString(167) + ": " + cost + "<br>";` and :123 `outputString += LangManager.getString(647) + ": " + cooldown.toFixed(2) + " " + LangManager.getString(648) + "<br>";`
- **Lane impact:** skills-meters + ui-hud — refutes the headline of string-table/skill-card-field-set-six-target-modes and stops a phantom ally-targeting branch entering the skill model. It also supplies the CORRECT skill-card contract, which is a better artifact than the string list: field order comes from XMLSkill.getDescription, cooldown renders as toFixed(2) seconds, and chi cost and cooldown are read per level from skilldata.

### `string-table/ui-hud-md-still-carries-the-refuted-id-drift-table` — HELD [A2]

systems/ui-hud.md still presents `ui-hud/lang-id-drift-caveat` as HELD and issues a downstream rule ('never resolve by id alone') that is inverted — LangManager keys the XLIFF by resname, so 619 IS 'Auto Slash Off' and 223 IS 'AP', and the doc's two red-X rows are its own mis-keying, not a build-revision drift.

- **Cite:** `docs/gauntlet/L0/systems/ui-hud.md:502-508 + reference/decompiled/shs3_android/scripts/LangManager.as:78 + OverworldHUD.as:211 + BattleUI.as:124-125`
- **Quote:** ui-hud.md:502 '| `BattleUI.as:124-125` autoslash off/on | 619/620 | "Special Event"/"Unbreakable" | X |' and :505-506 'The true strings for the mismatches are present at different ids — 600 "Auto Slash Off", 601 "Auto Slash On"'. Against: LangManager.as:78 `var output:String = Locale.loadStringEx(num.toString(),language);` — fl.lang.Locale keys XLIFF by resname. By resname, 619='Auto Slash Off' (unit at bin line 1807, `<trans-unit id="600" resname="619">`) and 223='AP', which is exactly right for OverworldHUD.as:211 `this.overworldHUD_ap.apbaricon.text = LangManager.getString(223);`. Decisive:
- **Lane impact:** cross-lane hygiene, NOT a new discovery — the fact is already banked as ui-hud/langmanager-uses-resname-not-id (SEEN_CLAIM_IDS.txt:1058) together with ui-hud/resname-600-proves-pass1-read-the-id-column and ui-hud/web-build-confirms-resname. I report it only because systems/ui-hud.md was never corrected and still hands the wrong resolution rule to the next reader of that survey. It also vindicates this unit: the string-table surveyor keyed by resname throughout and was right to; docs/gauntlet/L0/index/strings.json is resname-keyed and correct.

### `string-table/war-room-gate-has-a-dan-escape-hatch` — HELD [A2]

The war room is NOT a flat level-10 gate: the guard is `getLevel() < 10 && getPlayerStats(STAT_DAN) == 0`, so any rebirthed character (Dan >= 1) enters at any level — and two further gates the copy never mentions bracket it, a per-character War-Room disable flag and an offline-mode block.

- **Cite:** `reference/decompiled/shs3_android/scripts/OverworldHUD.as:1260-1272`
- **Quote:** 1260-1262: this.showDialog("War Room is disabled for this character","OK"); return;  ·  1264-1268: if(StatsManager.getLevel() < 10 && StatsManager.getPlayerStats(StatsManager.STAT_DAN) == 0) { this.showDialog(LangManager.getString(320),LangManager.getString(5)); return; }  ·  1269-1272: if(QueryManager.instance.offlineMode) { this.showDialog("Not available in offline mode",LangManager.getString(5)); return; }
- **Lane impact:** progression + meta-social + rebirth-elements — refutes string-table/level-gates-war-room-10-duel-2's headline rule. The level-10 message is copy, not the rule; the rule is level-10 OR any Dan. This also hands rebirth a second concrete privilege beyond the banked gold faucet. The duel gate IS flat and is confirmed in the same file at :1172 `else if(StatsManager.getLevel() < 2)`. Zero corpus hits for 'STAT_DAN) == 0'.

### `string-table/war-turn-expiry-resets-moves-to-max` — HELD [A2]

When the 'Next turn in' countdown expires the client SETS war moves to getMaxWarMoves() rather than incrementing them, so a turn is a full refill window and unspent moves do not accumulate.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarUI.as:525-547`
- **Quote:** 533-537: maxmoves = StatsManager.getMaxWarMoves(); warmoves = StatsManager.getPlayerStats(StatsManager.STAT_WARMOVES); if(warmoves != maxmoves) { StatsManager.setStat(StatsManager.STAT_WARMOVES,maxmoves); }  ·  546: this.readytomovelabel.text = LangManager.getString(309) + this.getTimeString(-timediff);
- **Lane impact:** meta-social — supplies the missing half of string-table/war-turn-is-clock-driven: the string proves it is a countdown, this proves what the countdown DOES. Combined with the banked getMaxWarMoves() ladder (3,4,4,4,4,5,5,5,5,5,6 by rank, meta-social.md:288) the move economy is fully specified except the period, which is a server delta (timediff) and stays unheld.

### `string-table/weight-gate-is-a-travel-guard-in-code` — HELD [A2]

The carry-weight gate is enforced in code as a travel/interact guard at eight movement objects — `findWeight() > getCarryingWeight()` aborts interact() — and it is exempted inside PvP rooms; the bank's container cap is a separate, independent limit.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_TownSign.as:44-48 + Obj_DirectionSign.as:161 + Obj_Hut.as:72 + Obj_PathBush.as:112 + Obj_HiddenTemple.as:189 + Obj_DragonDancePath.as:277 + NodeUI.as:381 + InteractUI.as:1732 + BankUI.as:641`
- **Quote:** Obj_TownSign.as:44-47 — override public function interact() : * { if(!GameEngine.isPvPRoomMode() && StatsManager.findWeight() > StatsManager.getCarryingWeight()) { OverworldHUD.instance.showDialogBig(LangManager.getString(138),LangManager.getString(5)); return; }  ·  BankUI.as:641 — if(this.storageWeight + this.selectedSlotItem.getWeight() / this.selectedSlotItem.getQuantity() > this.storageMaxWeight)
- **Lane impact:** items-equipment + world-exploration — upgrades string-table/carry-weight-gates-travel from one prose string to eight code call sites, and adds the PvP-room exemption (weight is not enforced inside duel rooms). It also separates the two weight systems the claim conflated: carry weight gates travel, bank storageMaxWeight gates deposits (that second one is already banked at rebirth-elements.md:293).

### `uistrings-payload/chat-surface-is-31-commands-including-three-debug` — HELD [A2]

The web v0.717 chat surface is 31 distinct non-emote commands, not 21 — and three of them are developer/debug commands (/picture, /enableconsole, /transitionoff) that sit outside the help-list ranges any prior sweep quoted.

- **Cite:** `reference/extracted/payload.xml:121506`
- **Quote:** <item>/enableconsole</item>
- **Lane impact:** meta-social + a new debug-surface note. CORRECTS this unit's emote-and-chat-command-surface count. Full set parsed from payload.xml 121100-121600: /ally /allyroom /ban /createprivate /disablepvp /emotes /enableconsole /help /help:ally /help:channel /help:emotes /hidehud /ignore /invite /join /kick /leave /leavetown /list /picture /ping /recall /showally /showignore /stopally /stopallyall /stopignore /tournament /transitionoff /unban /whoisonline, plus the 11 emotes at :121490. Twenty carry an inline #CCCCCC help description; the bracketed-arg forms (/join [ , /ignore [ , /kick [ , /ban [ , /unban [ , /createprivate [ , /invite [ , /stopignore [ , /ally [) split theirs across items, which is the likely source of the '21'. /transitionoff implies a skippable scene transition and /enableconsole implies a shipped debug console — neither has a slot in any of the twelve ledger systems.

### `uistrings-payload/fight-wordmark-is-the-live-duel-intro-field` — HELD [A2]

The Olivia Brush 80 pt 'FIGHT!' TextField (characterID 3539) is placed as instance `colorText` inside sprite 3540 and is written at runtime with getString(104) — whose value is also 'FIGHT!' — so the word mark's font AND its live render path are both held, and the authored words are identical to the shipped words.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5533s0§.as:72`
- **Quote:** this.§1t5147s0§.§1t15877s0§.colorText.text = §1t1521s0§.getString(104);
- **Lane impact:** art-anim-audio-feel + ui-hud — STRENGTHENS nine-embedded-fonts-not-two from a static tag fact to a live render path: the field that carries Olivia Brush at fontHeight 1600 twips really is the duel-intro word mark, so the display face is confirmed for the screen it appears on. It is simultaneously the COUNTEREXAMPLE to uistrings-is-design-time-not-shipped's 807-wide universal — here strings.json["104"] = 'FIGHT!' = the authored initialText, i.e. an authored field whose words ARE the shipped words. Ties to the banked ui-hud intro-bar timing (action word at frame 69, 2 042 ms).

### `uistrings-payload/rake-branch-tests-the-pool-not-a-nan` — HELD [A2]

The betting rake branch decompiles at §1t396s0§.as:230 as `if(_loc10_ > 100)` where _loc10_ is declared NaN at :121 and never assigned — an FFDec register-aliasing artifact that would make the whole rake rule read as dead code — and the second copy of the same routine in the same file, at :545 `if(_loc7_ > 100)` with _loc7_ = pool at :537, proves the branch really tests the pool.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t396s0§.as:545`
- **Quote:** if(_loc7_ > 100)
- **Lane impact:** economy — PROTECTS this unit's duel-betting-book-is-web-only-with-full-odds-math from being wrongly refuted on re-derivation. Anyone who opens only :230 will conclude the 0.80/0.85 rake tiers are unreachable. They are not: the duplicate at :537-554 is unobfuscated on that variable. Standing lesson for every lane reading FFDec output — a `_locN_` that is declared NaN and never assigned is an artifact, not a fact; look for a second copy of the routine before grading the logic.

### `uistrings-payload/tower-is-the-name-of-the-thirteenth-system` — HELD [A2]

The room/staff/mission/graveyard subsystem is called the TOWER and its identifiers are NOT obfuscated in the web payload — TowerRoomStairs / TowerRoomHut / TowerRoomHutEntrance / TowerRoomHutKitchen / TowerRoomHutWorkshop, resolved at runtime by §1t412s0§.as:866-928 — and it is web-only: 0 files in shs3_android/scripts and 0 of 2,533 table entries mention 'tower'.

- **Cite:** `reference/extracted/payload.xml:121701`
- **Quote:** <item>TowerRoomHutKitchen</item>
- **Lane impact:** meta-social / world-exploration — STRENGTHENS and closes the stated limit of this unit's clan-hq-rooms-staff-missions-absent-from-all-12-systems ('the web scripts are name-obfuscated so an identifier-absence check is not evidence there'): for this subsystem they are not obfuscated. The Tower has its own language file (tower_en.xml, payload.xml:118543), its own RPC (playerio/logtowerget.php :119328), gate fields towerreq (:106222) and notowerget (:120371), a room-style resolver keyed on (type, level) at §1t412s0§.as:866, and a named FX symbol shs3_fla.TowerBladeslashfx_580 (:2653284). 'kitchen' and 'workshop' — two of the exact words the parent claim reported as 0-of-2,533 Android hits — are room class names here. This is a thirteenth system with a proper name, same class of gap as Stage-0 S0-1's <survivalmodedata>.

### `uistrings-payload/warroom-web-has-a-seventh-rules-page` — HELD [A2]

The web v0.717 War Room rules screen has SEVEN pages, not six — page 7 fetches getString(11016)/getString(11017), both inside the unresolvable web-only 11000 block — so one whole rules page is UNHELD and the Android table's page-numbered titles ('War room rules 1/6'…'6/6') cannot be the v0.717 shipped titles.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7924s0§.as:23`
- **Quote:** internal var max:int = 7;
- **Lane impact:** meta-social — CONTRADICTS this unit's warroom-rules-web-uses-android-id-set. The twelve body/title slots 369-380 do map identically (§1t7924s0§.as:96-119 vs WarRules.as:94-117, verified line-by-line), but page 7 at §1t7924s0§.as:121-123 has no Android counterpart and no recoverable text. A port must either build six pages and record page 7 as lost, or re-author it — and must re-number all six titles, because strings.json["369"]…["379"] literally read 'N/6'.

### `uistrings-payload/web-and-android-font-sets-diverge` — HELD [A2]

The web payload and the Android build embed DIFFERENT font sets — the web has Arial (fontID 1296), _sans, Calibri, Calibri Bold, Times New Roman and Olivia Brush that the banked Android font finding does not list, while the Android build embeds MS UI Gothic 標準 which the web payload does not contain at all — so no 'the font is closed' statement is valid without naming the build.

- **Cite:** `reference/extracted/payload.xml:577916`
- **Quote:** fontID="1296" fontName="Arial "
- **Overturns:** "② font (unidentified)"
- **Lane impact:** art-anim-audio-feel blocker ② — QUALIFIES the banked art-anim-audio-feel/font-identified (which named Edo SZ, EPSON 太行書体Ｂ, Adobe 고딕 Std B, MS UI Gothic 標準 from the Android blobs) and this unit's nine-embedded-fonts-not-two. Complete web list, nine DefineFont3Tag fontNames: Edo SZ :84, _sans :50748, Calibri Bold :62495, Calibri :442040, Adobe 고딕 Std B :576878, Arial :577916, EPSON 太行書体Ｂ :588965, Times New Roman :693554, Olivia Brush :2631822. Only SEVEN carry a DefineFontNameTag copyright line — _sans and Arial carry none. LICENSING (CLAUDE.md third-party invariant): Arial is Monotype-commercial and must be named explicitly in the do-not-ship list alongside Calibri / Times / Adobe / EPSON; only Edo SZ and Olivia Brush are freely redistributable.

### `uistrings-payload/web-lang-files-are-en-fr-es-only` — HELD [A2]

The web build's language tables are named exactly in the string pool — strings/shs3_en.xml, shs3_fr.xml, shs3_es.xml, plus a second set tower_en.xml / tower_fr.xml / tower_es.xml — three locales, EN/FR/ES, with no zh-CN anywhere in the payload.

- **Cite:** `reference/extracted/payload.xml:118535`
- **Quote:** <item>shs3_en.xml</item>
- **Lane impact:** ALL LANES — this is the exact Wayback CDX target list for the single close-path the unit's coverage note identifies (a query against strawhatsamuraiduels.com/lang/ would collapse most of the caveats in this document at once). The note guessed '_zh-CN'; there is none. Correct targets: /lang/strings/shs3_{en,fr,es}.xml and /lang/strings/tower_{en,fr,es}.xml. Directory literal at :118534 `<item>strings/</item>`; loader copy at :118531-118533 confirms exactly three locales ('Loading language data...' / 'Chargement fichiers langues...' / 'Cargando datos de idioma...'). The tower_*.xml pair is independent corroboration that the Tower is a first-class content module.
