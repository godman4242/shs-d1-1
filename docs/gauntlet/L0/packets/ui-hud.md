# LEDGER PACKET — `ui-hud`

> **This is the ONLY evidence you may cite.** Every id below was JUDGED by blind
> artifact-citing critics and SURVIVED (GAUNTLET.md §0). Cite one inline as
> `[[id]]`, exactly as written. Gate **L0-B** resolves every reference against the
> pooled verdicts and goes RED on anything unjudged, refuted, or invented — so a
> claim id you do not see here cannot enter the ledger, and neither can a
> plausible-looking one you compose yourself.

**20 surviving overturns · 8 true-but-rejected · 66 corroborating.**

---

## The ledger text you are rewriting, verbatim

```markdown
| **ui-hud** | 57 | combat-HUD geometry, VS/FIGHT/result cards, chrome family | aspect-ratio truth; dynamic HUD "feel" (bar tween, combo pop); off-screen screens (pause/options/dialogue metrics) |
### ui-hud — 57
- **Ready:** combat-HUD geometry (frame-measured fractions); two-beat VS→FIGHT intro; result cards; overworld HUD layout; 8-icon menu ribbon; minimap; (EQ:n) UX; parchment chrome family; login + character-creation screens; transition timings.
- **Blockers:** ① **aspect-ratio truth** (5:3 native → are x-fractions pillarbox-wrong?) — *inspect `unt.png` for side-bars; read `stage.stageWidth` in a build.* ② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued. ③ floating damage/crit **popups** (absent from the ledger, confirmed to exist). ④ the "3 skill slots" is really ~2 abilities + a stance up-arrow. ⑤ pause/options/dialogue-box exact metrics.
- **Surface:** overworld HUD lives only in segment A-00, not MASTER §8 (which is combat-only); portrait ring is stance-colored, not fixed red.
```

---

## ① Surviving overturns — these REWRITE the lines they name

A critic opened the sentence, read it in context, and ruled that it falls.

### `[[NF-stage-800x480]]` — UPHELD [A2] (2 critics)

The native canvas is 800x480 = 5:3 EXACTLY, as a literal in BOTH builds — so the pillarbox origin that claims 0 and 1 both left open is CLOSED without a build. A 5:3 stage fitted to 1080 px gives 1800 px of picture and 60 px bars; the frames measure 1814-1816 px and 52-53 px bars, i.e. the game's own 5:3 canvas plus ~0.9% recorder stretch. The bars are the GAME's canvas, not the recorder's window. Re-base HUD x as (x-52)/1816 then map onto an 800-wide stage.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:80, :82, :96, :98 and reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:104`
- **Build:** both
- **KILLS this line:** "① aspect-ratio truth (5:3 native → are x-fractions pillarbox-wrong?) — inspect unt.png for side-bars; read stage.stageWidth in a build."
- **Lane impact:** L-ui-hud: blocker ① CLOSED outright and its close-path was wrong — it never needed a build, the literal is in the decompiled source of both builds. Confirms the ledger's own unsourced '800x480 (5:3)' line with an A2 cite.

### `[[actionscript/damage-popup-colors]]` — UPHELD [A2] (2 critics)

Floating damage popups are real, spawn at (actor.x, actor.y − 100), and carry five fixed per-channel colours plus white for a countered hit — so a multi-element hit stacks five popups at one anchor.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:518-534 (web v0.717) · plain-named twin reference/decompiled/shs3_android/scripts/NPC.as:497-513`
- **KILLS this line:** "③ floating damage/crit popups (absent from the ledger, confirmed to exist)."
- **Lane impact:** L-ui-hud: blocker ③ closed byte-exact; L-art-anim-audio-feel and L-combat-core inherit the anchor offset and the white counter-hit tell.

### `[[cite04/android-string-table-has-no-900-block]]` — UPHELD [A2] (4 critics)

The android v0.682 language table has NO entries at all in the 900-999 range - the highest ID below 900 is 880, and IDs resume at 1000. Yet the web v0.717 client renders getString(960) as the greyed label beneath the Focus bar (the 'CANNOT CHANGE STANCE' text visible on film). That is machine-checkable proof that the web language table carries string IDs the android table does not, which is the hardest evidence yet for the S0-3 parity caveat: the android table cannot be used as a complete stand-in for v0.717 UI copy, because some v0.717 strings have no android row to read at all.

- **Cite:** `docs/gauntlet/L0/index/strings.json (per-century census over all 2,533 numeric IDs); reference/decompiled/shs3_payload/scripts/§1t113s0§.as:111; reference/frames/duel_dense/Nr4fQstqHDM_428.0.png crop (230,960)-(560,1070) @4x LANCZOS`
- **Build:** android v0.682 table vs web v0.717 code
- **KILLS this line:** "S0-3 caveat: 'UI copy and combat tuning parity is NOT established' between android v0.682 and web v0.717"
- **Lane impact:** All lanes porting UI copy: the android table is not merely reworded relative to v0.717, it is INCOMPLETE — the whole 900-999 block is missing, so any v0.717 string in that range must come from film, never from strings.json.

### `[[frames/pillarbox-52px]]` — UPHELD [A1] (2 critics)

The longplay frames carry a 52 px black bar on each side: active picture is columns 52..1867 = 1816×1080 = 1.6815:1, which is NOT 16:9 and is within 0.9% of 5:3 — so every HUD x-fraction taken against the full 1920 is wrong by a 52 px offset and a 0.9458 scale factor.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png (1920×1080), confirmed identically on Nr4fQstqHDM_432.0.png. Crops used: crop=960:400:0:380 and crop=960:400:960:380, each upscaled 3× nearest-neighbour; then a full-frame per-column luminance scan.`
- **KILLS this line:** "① aspect-ratio truth (5:3 native → are x-fractions pillarbox-wrong?) — inspect unt.png for side-bars; read stage.stageWidth in a build."
- **Lane impact:** L-ui-hud: blocker ① is measurable TODAY from frames we already hold — no build needed, contrary to the close-path which routes it through 'read stage.stageWidth in a build' (and P0 proved no build exists). THE FRAME WINS: where any HUD-geometry doc quotes an x-fraction of 1920, the frame says the picture is 1816 px wide starting at x=52 — take the frame. PARTIAL and honestly so: a single frame cannot separate a Flash-stage pillarbox from the recorder's own letterboxing of a browser window, and the SOUND360TM watermark proves a recorder overlay was present. The existence and exact width of the bars is HELD; their ORIGIN is STILL_UNHELD.

### `[[frames/v0717-rewords-the-daily-streak-ladder]]` — UPHELD [A1] (4 critics)

The v0.717 web client REWORDS the daily-prize streak ladder relative to the android v0.682 string table: it prepends 'AFTER'. This is a second, independent rewording class alongside the War Room rules 1/6 -> 1/7 page count, and together they mean the S0-3 android-parity hedge cannot be lifted wholesale — it can only be lifted for strings personally seen on film.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-00/frames/frame_0001.jpg (crop 0,380-700,576 @2.14x LANCZOS; source still is 1024x576)`
- **Build:** web v0.717 frame vs android v0.682 string table
- **KILLS this line:** "S0-3 caveat: 'UI copy and combat tuning parity is NOT established' between android v0.682 and web v0.717"
- **Lane impact:** ui-hud, meta-social, and every lane porting UI copy: the android-only hedge stays on any string not confirmed from a frame

### `[[skilldata/skill-slots-3-to-8]]` — UPHELD [A2] (2 critics)

Base skill slots = 3, not '~2 abilities + a stance arrow': getSkillSlotCount() returns 3 + the level of skill 1008 Skill Slots+, which has 5 levels reading '4 skill slots' through '8 skill slots' — and passives never occupy a slot, leaving 41 player-equippable actives competing for 3-8 slots.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:2293-2296; reference/extracted/skilldata.xml:383-417 (skill 1008); level-desc strings 7009-7013; reference/decompiled/shs3_android/scripts/XMLSkill.as:345-348`
- **KILLS this line:** "④ the "3 skill slots" is really ~2 abilities + a stance up-arrow."
- **Lane impact:** ui-hud — blocker ④ answered from source rather than eyeball; skills-meters; progression — 15 SP buys the full 8 slots.

### `[[ui-hud/bars-are-untweened-continuous-scalex]]` — UPHELD [A2] (2 critics)

Ledger blocker (2)'s 'bar tween vs snap' question is closed and the answer is snap: both HP and Chi bars are direct, untweened, continuous scaleX assignments with a paired drop-shadow text field.

- **Cite:** `reference/decompiled/shs3_android/scripts/BattleUI.as:244-256`
- **KILLS this line:** "② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued."
- **Lane impact:** ui-hud lane + art-anim-audio-feel: closes the first third of blocker (2) outright and supplies the exact readout format, which I frame-confirmed (the same crop shows 20/20 and 26/26 centred on full green and blue bars, matching hp + "/" + maxhp). Note the paired *shadow field: every HUD number is drawn twice with an offset, a fidelity detail no ledger row carries. Also corrects claim 6's rider -- the bars are continuous, the cooldown is 12-step quantised; they are not 'the same character'.

### `[[ui-hud/blocker-2-falls-entirely-no-pop-no-ramp]]` — UPHELD [A2] (2 critics)

Ledger blocker (2) 'dynamic HUD feel (bar tween vs snap, combo pop, vignette ramp) — uncatalogued' falls in all three parts. Bars SNAP (direct scaleX). The combo does NOT pop: the web payload's combo container is DefineSprite 3611 with ONE declared frame and four non-sprite children (shape 74 + DefineEditText 3608/3609/3610), so the widget is a static composition toggled by `visible`. The hit vignette does NOT ramp: DefineSprite 3607 (hurtred, 800x480) declares 7 frames and its timeline is PlaceObject2, five bare ShowFrames, then RemoveObject2 — a 6-frame flat hold = 0.25 s at 24 fps, then removed.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf — my own tag walk of DefineSprite id 3611 and id 3607; playback calls at reference/decompiled/shs3_payload/scripts/§1t113s0§.as:498-500, :505 and :534-537; bar writes at §1t113s0§.as:320-323 and :326-333; art on disk at reference/extracted/sprites/DefineSprite_3607_shs3_fla.hurtred_32/1-7.png`
- **Build:** web v0.717
- **KILLS this line:** "② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued."
- **Lane impact:** L8 ui-hud + L6 art-anim-audio-feel: blocker (2) should be STRUCK. Config: bars are untweened continuous scaleX; combo number+shadow snap on/off with no scale or alpha motion; the hurt vignette is a 6-frame (0.25 s) flat flash whose art is already on disk at 800x480, then removed. No easing curves need to be invented for any of the three.

### `[[ui-hud/blocker-4-is-wrong-2-abilities-plus-empty-slot]]` — UPHELD [A1] (2 critics)

Ledger blocker (4) is factually wrong: the three combat slots are two equipped abilities plus one genuinely EMPTY slot, and the gold up-arrow is one of the abilities -- the stance control is a separate widget on the opposite side of the HUD.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png, crop (900,900)-(1880,1080) upscaled 2x and crop (0,780)-(1920,1080), adjudicating reference/decompiled/shs3_android/scripts/BattleUI.as:26,275,374,500-511`
- **KILLS this line:** "④ the "3 skill slots" is really ~2 abilities + a stance up-arrow."
- **Lane impact:** ui-hud lane: blocker (4) should be STRUCK, not narrowed. A rebuild following the ledger would wire the third slot to a stance toggle, which the frame shows is wrong -- the stance toggle is the bottom-left bust portrait and the third slot is simply unequipped in this session. Also explains the bright-vs-dark border difference, which no lane had accounted for.

### `[[ui-hud/blocker4-uparrow-is-an-equipped-skill]]` — UPHELD [A1] (2 critics)

Ledger blocker (4) is wrong: the gold up-arrow in slot 3 is an equipped skill, not the stance control, because a slot only receives a keypress numeral on the branch where StatsManager.skillSlots[i] is non-null.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png crop (1380,920)-(1880,1080) upscaled 3x, adjudicated against reference/decompiled/shs3_android/scripts/BattleUI.as:501-511, SkillSlotButton.as:123-135 and BattleUI.as:275,192`
- **KILLS this line:** "④ the "3 skill slots" is really ~2 abilities + a stance up-arrow."
- **Lane impact:** ui-hud: Pass 1 claim 10 made this call; Pass 2 restated it inside claim ui-hud/hud-symbol-metrics with an EMPTY cite and overturns_ledger:false, which loses a real ledger overturn. Filed here with a cite so it is not dropped. It also fixes the slot reading: slotCount = 3 with two skills equipped, key 3 at i=0 (x=760) and key 2 at i=1 (x=700).

### `[[ui-hud/filmed-session-scale-is-2.27-not-2.25-THE-FRAME-WINS]]` — UPHELD [A1] (2 critics)

The stage scale for the filmed session in reference/frames/duel_dense/ is 2.27-2.28 (FIT-WIDTH), not the 2.25 (fit-height + 8 px engine inset) that a code-only reading predicts. BattleUI.as:133 fixes the skill-slot pitch at exactly 60 game px, which makes the HUD its own ruler: the three slot centres measure 1503.5 / 1640.0 / 1777.0, a pitch of 136.5-137.0 frame px. The width-fit model (s=2.27, x0=52) predicts slot i=0 at 1777.2 against a measured 1777.0 — 0.2 px. The height-fit model (s=2.25, x0=60) predicts 1770.0 — 7.0 px out. The correct conversion is x_game = (x_frame - 52) / 2.27.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png — pillarbox measured at x 52..1867 (content 1816x1080); slot-box dark runs measured in the band y 965..980, x 1400..1880 at luminance < 70 over >80% of the band; ruler from reference/decompiled/shs3_android/scripts/BattleUI.as:133`
- **Build:** web v0.717
- **KILLS this line:** "① aspect-ratio truth (5:3 native → are x-fractions pillarbox-wrong?) — inspect unt.png for side-bars; read stage.stageWidth in a build."
- **Lane impact:** L8 ui-hud and every lane holding frame-measured coordinates. STANDING INVARIANT SAID OUT LOUD: the code-derived model and the frame disagree and THE FRAME WINS. resizeHandler gives the MECHANISM but not the BRANCH — the branch depends on the browser viewport aspect, which no artifact records, so it must be recovered per-video from an in-HUD ruler. BattleUI.as:133's 60-px slot pitch is that ruler and should become the standard calibration for every frame pass. Blocker ① is therefore answerable per-video, not closable from source alone.

### `[[ui-hud/frame-refutes-stance-up-arrow]]` — UPHELD [A1] (2 critics)

Ledger blocker ④ is wrong: the gold up-arrow is a keypress-bound skill in slot 3, not a stance control — the stance control is the bottom-left portrait bust.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png, crops (40,900)-(700,1080) upscaled 2.4x and (1380,920)-(1880,1080) upscaled 3x`
- **KILLS this line:** "④ the "3 skill slots" is really ~2 abilities + a stance up-arrow."
- **Lane impact:** L-ui-hud: closes ledger blocker ④ outright rather than leaving it inside a STILL_UNHELD. Corroborated in code — stance is battlemodebust.hitTestPoint -> stanceButtonClick() (BattleUI.as:275-277), while slot art comes from SkillSlotButton.image and initEmpty() clears keypressText (:124-129). THE FRAME WINS over the ledger. Also touches skills-meters (the slot strip is 3 skill slots, one empty, not 2 skills + a stance widget).

### `[[ui-hud/hud-art-already-exported]]` — UPHELD [A1] (2 critics)

The JPEXS shape/sprite export that this lane's residual says is missing already exists on disk from the WEB payload: 1,822 shape SVGs and 827 rendered DefineSprite directories, including the pause screen at 802x481 and the 5-frame skill-slot box at 56x55.

- **Cite:** `reference/extracted/sprites/DefineSprite_3632_shs3_fla.PauseScreen_51/1.png (opened whole, 802x481, alpha-composited over a dark ground and viewed) and reference/extracted/sprites/DefineSprite_934_shs3_fla.skillSlotBG_755/1-5.png (opened, 5 frames at 56x55, rendered as a 4x NEAREST strip)`
- **KILLS this line:** "⑤ pause/options/dialogue-box exact metrics."
- **Lane impact:** ui-hud lane, and it changes the close-path for every art-bearing lane. The ledger's Tier-3 'overworld HUD pixel geometry' and blocker ⑤'s pause half are closable today by reading files already in the repo - no new export, no video re-pass, and nothing gated on the encrypted 124_Mobile_ImageResource. It also overturns this pass's own STILL_UNHELD residual (ui-hud/hud-symbol-metrics) and removes one of the two reasons its score rationale gives for holding ui-hud below 90. Cross-lane: art-anim-audio-feel and world-exploration inherit the same 1,822-SVG / 827-sprite corpus.

### `[[ui-hud/hud-sprite-art-on-disk]]` — UPHELD [A2] (2 critics)

The web payload's HUD symbol art is already exported to disk — reference/extracted/sprites/ holds 827 DefineSprite renders (39 class-named, PNG per frame) and reference/extracted/shapes/ holds 1,822 shape SVGs — so 'symbol geometry is not on disk' is false and the HUD panel/plaque/slot pixel geometry is available now, at 1:1 game-pixel scale, with no Android caveat.

- **Cite:** `reference/extracted/sprites/ — DefineSprite_3632_shs3_fla.PauseScreen_51/1.png (802x481), DefineSprite_934_shs3_fla.skillSlotBG_755/1-5.png (56x55 canvas, 51x51 bright border), DefineSprite_3621_shs3_fla.autoslashbutton_43/1-2.png (129x31), DefineSprite_3607_shs3_fla.hurtred_32/1-7.png (800x480), DefineSprite_3394_shs3_fla.stancecolor1_56/1-3.png (63x63), DefineSprite_*_animatedBrush_62 (371x166, 8), chatTextBattle_45 (437x212, 2), CharSlot_126 (267x50), MinimapIcon_668 (15x18, 20), MinimapRoomIcon_672 (20x30, 17), speechbubble_422 (137x110, 6), skillnodeinner_89 (64x64, 7), QuestLogButtonBG_548 (314x43, 5), clanemblem_778 (47x47, 7); plus reference/extracted/shapes/ 1822 .svg`
- **KILLS this line:** "⑤ pause/options/dialogue-box exact metrics."
- **Lane impact:** L-ui-hud: refutes the survey's own STILL_UNHELD claim 13 and closes the pause half of blocker ⑤ as art, not just behaviour. Also cross-lane: art-anim-audio-feel (vignette, brush stroke, stance rings) and world-exploration (minimap icon sets, WorldMapMarkerBase, town_* sprites) are all sitting on unmined assets. The next lane should treat reference/extracted/sprites+shapes as a first-class evidence source alongside the XML.

### `[[ui-hud/hurtred-vignette-catalogued]]` — UPHELD [A2] (1 critic)

The damage vignette the ledger calls 'uncatalogued' is fully specified: an 800x480 full-screen red radial (#990000 at alpha 251 on the edge, transparent at centre), played from frame 1, holding 6 identical frames and blanking on frame 7 where it stops — 7 frames = 292 ms at 24 fps.

- **Cite:** `reference/extracted/sprites/DefineSprite_3607_shs3_fla.hurtred_32/1-7.png + reference/decompiled/shs3_android/scripts/BattleUI.as:424-428 + shs3_android_fla/hurtred_29.as:12,15-18`
- **KILLS this line:** "② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued."
- **Lane impact:** L-ui-hud: closes the 'vignette ramp' third of blocker ②, which the survey left open (its claim 6 only extended blocker ② to the cooldown widget). Also feeds art-anim-audio-feel, whose palette digest can now carry the exact hurt-vignette hue and duration.

### `[[ui-hud/pause-is-click-anywhere]]` — UPHELD [A2] (8 critics)

The battle pause is fully specified in code: the pause button exists only outside duel/PvP, pressing it raises pauseScreen to the top of the display list, and any click anywhere resumes — there is no in-battle pause menu.

- **Cite:** `reference/decompiled/shs3_android/scripts/BattleUI.as:179,267-272,324-328`
- **KILLS this line:** "⑤ pause/options/dialogue-box exact metrics."
- **Lane impact:** ui-hud lane: closes the pause half of blocker (5) as behaviour (the remaining unheld part is pixel geometry only, see ui-hud/hud-symbol-metrics).

### `[[ui-hud/pausescreen-sprite-confirms-play-field]]` — UPHELD [A2] (1 critic)

A web-build-native artifact confirms the 800x480 play field, so blocker ① no longer has to borrow the Android build's stage rect — which matters, because the web SWF's own stage rect is 800x690.

- **Cite:** `reference/extracted/sprites/DefineSprite_3632_shs3_fla.PauseScreen_51/1.png; SWF headers of reference/decrypted/shs3_payload_decoded.swf and shs3_android_payload_decoded.swf parsed first-hand`
- **KILLS this line:** "① aspect-ratio truth (5:3 native → are x-fractions pillarbox-wrong?) — inspect unt.png for side-bars; read stage.stageWidth in a build."
- **Lane impact:** L-ui-hud: separates the two numbers the lane has been conflating — the web STAGE is 800x690 (the authored canvas, friend-bar layout) while the web PLAY FIELD is 800x480. Both are now held from web-build artifacts, so no android caveat is needed for either, and the 'read stage.stageWidth in a build' instruction in the ledger is moot.

### `[[ui-hud/skill-icons-are-gestural]]` — UPHELD [A2] (2 critics)

Skill icons are not tap-once buttons: the shipped descriptions state two additional input verbs — hold-the-icon-to-charge (the three stance ultimates plus Charged Shot) and drag-and-drop-the-icon to pick a target location or a direction (Heavenly Sword, and one slot that holds BOTH dashes).

- **Cite:** `strings 6085/6086/6087 (skills 1039/1040/1041), 6099 (1046), 6100 (1047), 6103/6105 (1049/1050) via docs/gauntlet/L0/index/strings.json, rows at reference/extracted/skilldata.xml:1234-1280, :1435-1464, :1483-1511`
- **KILLS this line:** "② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued."
- **Lane impact:** L8 ui-hud — the skill bar needs press-and-hold charge state and drag-to-aim, neither of which is in the ledger. Also L5 combat-core: Charged Shot scales 20/40/60 dmg per second to a 200/400/600 cap (strings 7075-7077) and is cancelled by taking a hit.

### `[[ui-hud/up-arrow-is-a-skill-not-a-stance-control]]` — UPHELD [A1] (1 critic)

Ledger blocker (4) is dead: the gold up-arrow in slot 3 is an ordinary equipped-skill slot, not a stance control, and the third box is an EMPTY slot — the surveyor found this and failed to flag it as overturning the ledger.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png, crop (1380,920)-(1880,1080) upscaled 3x, adjudicating reference/decompiled/shs3_android/scripts/BattleUI.as:133,504 and :112-113,275,374`
- **KILLS this line:** "④ the "3 skill slots" is really ~2 abilities + a stance up-arrow."
- **Lane impact:** L4 ui-hud: retires ledger blocker (4) outright. The surveyor stated the 'not the stance control' half inside its STILL_UNHELD claim but set overturns_ledger:false with an empty ledger_text, so a dead blocker would have stayed on the board. Also feeds L5 skills-meters: the third visible slot is unequipped, so a rebuild must render an empty-slot state, not a third ability.

### `[[ui-hud/up-arrow-is-a-skill-not-the-stance-control]]` — UPHELD [A2] (1 critic)

The gold up-arrow occupying a combat skill slot is an equipped-skill icon, not a stance control, so the ledger's 'really ~2 abilities + a stance up-arrow' reading of the slot strip is wrong.

- **Cite:** `reference/decompiled/shs3_android/scripts/SkillSlotButton.as:87 and BattleUI.as:26,112-113,192-193,275,374`
- **KILLS this line:** "④ the "3 skill slots" is really ~2 abilities + a stance up-arrow."
- **Lane impact:** ui-hud lane: closes blocker ④ as a misreading - the strip is N equipped-skill slots (8 are constructed, BattleUI.as:130-137) and the stance control lives on the portrait bust, elsewhere on the HUD. The pass stated this correctly but buried it inside a STILL_UNHELD claim and never flagged the overturn. Feeds skills-meters: whichever skill carries the up-arrow icon is now a lookup against ResourceManager.getSkillImage plus the 139-icon manifest, not a video-re-pass question.

## ② TRUE, but the line SURVIVES — do NOT delete anything for these

The finding held up; the overturn did not. 36% of claimed overturns were rejected this way. Bank the knowledge, keep the sentence.

### `[[NF-15-consumable-buff-enum-and-150pc-damage-potato]]` — NOT-UPHELD [A1] (2 critics)

The gold '150% DAMAGE' text visible on the duel frame is a CONSUMABLE BUFF readout, not a crit indicator: strings 4132-4135 are the potato buffs granting 150% Damage / Defense / XP / Speed, with an explicit 'only one buff may be active at a time' rule. The full buff enum is thirteen values at StatsManager.as:288-312: XP, ATTACK, DEFENSE, SPEED, AP, DUELTOKENS, COINS, RARELOOT, MUTE, FULLMUTE, HELL, INJURED, MODERATOR.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_431.0.png, my own crop (0,820)-(760,1080) upscaled 3x Lanczos — gold text '150% DAMAGE' under a bar reading 'CANNOT CHANGE STANCE'; resolved via docs/gauntlet/L0/index/strings.json["4132"] and reference/decompiled/shs3_android/scripts/StatsManager.as:288-312`
- **Build:** web v0.717 frame; android v0.682 strings/code
- **aimed at this line, which SURVIVES:** "② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued."
- **Lane impact:** L8 ui-hud and L10 economy — a thirteen-value consumable-buff system with an exclusivity rule appears in no ledger system, and the BUFF_SPEED entry is already load-bearing (StatsManager.as:1847 and :1908 multiply SPD by 1.5 before the cooldown and reach caps). Also a trap: a rebuild reading this frame naively would model '150% DAMAGE' as a crit readout.

### `[[actionscript/slash-line-colour-is-0x990000]]` — NOT-UPHELD [A2] (2 critics)

The drawn slash line and the physical-damage popup both use literal 10027008, which is 0x990000, not 0xA30000 (=10682368, which appears nowhere in reference/decompiled/). The web build additionally carries a second stroke colour, 39168 = 0x009900, on a separate lineStyle setter alongside the red one.

- **Cite:** `reference/decompiled/shs3_android/scripts/InputManager.as:360 and reference/decompiled/shs3_payload/scripts/§1t1541s0§.as:174 and :179`
- **Build:** both
- **aimed at this line, which SURVIVES:** "slash line colour 0xA30000"
- **Lane impact:** L-art-anim-audio-feel / L-ui-hud: the correct hue is 0x990000 (already what src/config/palette.ts:58 carries as winRed); the green 0x009900 variant is an unbanked second render state that needs a frame pass to identify.

### `[[frames/v0717-war-room-rules-are-seven-pages]]` — NOT-UPHELD [A1] (2 critics)

The shipped v0.717 web client renders SEVEN War Room rules pages; the android v0.682 string table and the extracted web ui_strings.txt both say six. A page was inserted and the numbering shifted, so any android war-room rule text ported by page number lands on the wrong page.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0011.jpg, frame_0012.jpg, frame_0013.jpg (1024x576; crop (30,20)-(1000,420) @1.6x LANCZOS) vs docs/gauntlet/L0/index/strings.json["369"],["371"],["373"],["375"],["377"],["379"] and reference/extracted/ui_strings.txt:189-194`
- **Build:** both
- **aimed at this line, which SURVIVES:** "S0-3 caveat: 'UI copy and combat tuning parity is NOT established' between android v0.682 and web v0.717"
- **Lane impact:** meta-social + ui-hud: hard, enumerable v0.682↔v0.717 diff #2 (arrow gravity is #1, the daily-streak rewording #3). It also proves reference/extracted/ui_strings.txt is NOT runtime copy — see the next finding.

### `[[ui-hud/hp-chi-bar-geometry-measured]]` — NOT-UPHELD [A1] (2 critics)

The HP and Chi bar rectangles the ledger calls 'combat-HUD geometry' and the surveyor called ungrounded are measurable straight off a frame, and I measured them.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png, crop (200,940)-(600,1070), colour-keyed masks (green: G>110 and G-R>45 and G-B>45; blue: B>110 and B-R>45 and B-G>25)`
- **aimed at this line, which SURVIVES:** "| ui-hud | 57 | combat-HUD geometry, VS/FIGHT/result cards, chrome family | aspect-ratio truth; dynamic HUD "feel" (bar tween, combo pop); off-screen screens (pause/options/dialogue metrics) |"
- **Lane impact:** L4 ui-hud: partially closes 'combat-HUD geometry' without any JPEXS symbol export. Directly overturns the surveyor's own ui-hud/hud-symbol-metrics STILL_UNHELD, which refused to name these numbers on the grounds that assets.swf symbol shapes were not exported — the frame settles the on-screen geometry, which is what a 1:1 rebuild needs.

### `[[ui-hud/in-combat-hud-is-three-bars]]` — NOT-UPHELD [A1] (1 critic)

The in-combat player HUD has THREE bars, not two: green HP over blue Chi over a third tan/gold reload (Focus) bar. The third bar carries the status text 'CANNOT CHANGE STANCE' when it is below a sixth of max. The two-bar reading comes from overworld frames, where the reload bar is hidden. Separately, the yellow '150% DAMAGE' text under the bars is a temporary food buff, not a stance or crit multiplier — mis-reading it as a combat constant is an easy trap.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_431.0.png, crop (150,960)-(560,1050) upscaled 4x LANCZOS, compared against frames 427.0 and 429.0 (same crop); contrast reference/frames/combat_frames/Nr4fQstqHDM_t0130s.png (full 1920x1080, overworld); docs/gauntlet/L0/index/strings.json["4132"]`
- **Build:** web v0.717
- **aimed at this line, which SURVIVES:** "② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued. [REBUILDREADINESS.md:235]"
- **Lane impact:** L7 ui-hud and L5 combat-core — the HUD spec needs a third meter, and it is the same meter that gates stance switching and triggers criticals. The overworld HUD (two bars + XP + minimap + action row) is a genuinely different layout and should be specced separately.

### `[[ui-hud/jpexs-export-already-on-disk]]` — NOT-UPHELD [A2] (1 critic)

The JPEXS shape/sprite export that this lane schedules as the remaining close-path has already been run and is in the repo — 1,822 web-build SVGs and 827 sprite directories, including the HUD symbols declared missing.

- **Cite:** `reference/extracted/shapes/ (1,822 *.svg) and reference/extracted/sprites/ (827 dirs), e.g. DefineSprite_3621_shs3_fla.autoslashbutton_43/1.png, DefineSprite_934_shs3_fla.skillSlotBG_755/1.png, DefineSprite_3632_shs3_fla.PauseScreen_51/1.png`
- **aimed at this line, which SURVIVES:** "⑤ pause/options/dialogue-box exact metrics."
- **Lane impact:** L-ui-hud: the declared residual is already closed, so the lane's STILL_UNHELD is stale and its Tier-3 recommendation mis-directs. Also feeds art-anim-audio-feel (HUD chrome art no longer needs the encrypted 124_Mobile_ImageResource) and any lane that assumed only scripts/ was recovered from the payload.

### `[[ui-hud/shade-wipe-is-vertical]]` — NOT-UPHELD [A1] (1 critic)

The skill-slot cooldown shade is a straight VERTICAL wipe that reveals right-to-left and dims the slot's border as well as its face — geometry that exists only in the frames, because shade frames 1..13 live inside the unexported assets.swf.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png vs Nr4fQstqHDM_428.9.png, crop (1710,955)-(1845,1080) upscaled 4x side by side; plus max-vertical-luminance-step tracking across all 42 duel_dense frames, interior rows 968..1064`
- **aimed at this line, which SURVIVES:** "② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued."
- **Lane impact:** L4 ui-hud: closes the cooldown-widget part of blocker (2) with the one thing the source cannot supply — the wipe's shape and direction. Confirms the snap-not-tween character from pixels rather than from code inference, and feeds L5 skills-meters (the same shade drives every equipped skill).

### `[[ui-hud/stance-ring-colours-exact]]` — NOT-UPHELD [A2] (1 critic)

The stance-coloured portrait ring is a 63x63 three-frame clip whose colours are exactly #4242FF (light), #996600 (balanced) and #990000 (heavy) — the last identical to the hurt-vignette red.

- **Cite:** `reference/extracted/sprites/DefineSprite_3394_shs3_fla.stancecolor1_56/1-3.png + reference/decompiled/shs3_android/scripts/BattleUI.as:372-374`
- **aimed at this line, which SURVIVES:** "Surface: overworld HUD lives only in segment A-00, not MASTER §8 (which is combat-only); portrait ring is stance-colored, not fixed red."
- **Lane impact:** L-ui-hud: the ledger's surface note said only that the ring is stance-coloured; the three hexes are now held from the web asset. Feeds art-anim-audio-feel's byte-exact HUD palette (note #990000 is reused as the hurt-vignette edge — one red, two uses).

## ③ Corroborating — new knowledge, no line deleted

These add or sharpen; they do not contradict.

### `[[NEW-7-web-friend-bar-resize-parity]]` — UPHELD [A2] (1 critic)

The 800/480/690 resize handler and its friend-panel branch exist in the WEB v0.717 build, so the whole 690/friend-bar cluster has full build parity and does NOT inherit the S0-3 Android caveat. The web twin is byte-for-byte the same algorithm with locals renamed: 800, 480, 690, the same `<=` aspect comparison, the same stageShowingFriendBar flag and the same friend-panel init() call. METHOD WARNING: the finding that claimed android-exclusivity reached that conclusion by grepping shs3_payload for `originalWidth`/`originalHeight` — identifiers the obfuscator rewrites to _loc*. Grep the numeric literals, never the identifiers.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:269-290`
- **Build:** both
- **Lane impact:** L6 art-anim-audio-feel + L8 ui-hud + L11 meta-social: the friend bar is a shipped v0.717 layout mode, not an Android-only artefact, which is why the web SWF document rect is authored at 800×690 while the play-field canvas stays 800×480.

### `[[NF-10-category-tab-mapping-declared-in-code]]` — UPHELD [A2] (1 critic)

The skill-screen tab mapping is declared verbatim in code, not merely inferable from the string table: SkillScreenUI.categoryDesc is a ten-element array of string ids 6024..6033, indexed by category. Category 11 has no entry, which is the code-level proof that it is not a player tab.

- **Cite:** `reference/decompiled/shs3_android/scripts/SkillScreenUI.as:104`
- **Build:** android v0.682
- **Lane impact:** L8 ui-hud — upgrades skilldata/category-to-tree-names from a hand cross-check to a declared contract, and SkillScreenUI.as (910 lines) is an unopened source for the whole skill-screen layout.

### `[[NF-8-focus-bar-displayed-zero-is-24-not-0]]` — UPHELD [A2] (1 critic)

The Focus bar's displayed fill is not reload/maxreload. bonusReload() pushes the bar with updateReload((this.reload - 24) / (this.maxreload - 24)), so the bar maps [24, maxreload] onto [0,1] and the first 24 frames of charge are invisible. bonusReload also grants a flat +6 reload, clamped to maxreload.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3265-3272`
- **Build:** android v0.682
- **Lane impact:** L8 ui-hud and L6 art-anim-audio-feel — a rebuild that maps [0, maxreload] onto the bar will feel wrong even with every number right, because the OG hides the first 24 frames. This is exactly the 'dynamic HUD feel' the ledger's :235 blocker ② says is uncatalogued.

### `[[cite-lens-s26b/rarity-colour-key-has-two-palettes]]` — UPHELD [A2] (1 critic)

The rarity colour key is exact and there are TWO palettes, not one. Item.as:417-434 (the branch taken when the loot dialog or gift dialog is up and the inventory is not) emits unique #b048f8, rare #0080ff, special #1eff00, normal #FFFFFF. The else branch starting Item.as:436 uses a darker set for the same ladder, beginning unique #6600cc. The same four-tier test - itemxml.unique == 1 OR isPickableQuestItem() OR itemID in 20103..20107 OR isPlayerNamed(), then mods>=3, then mods>0 - drives both, and is the same test as getShopItemType() at Item.as:382-404.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:382-404,417-440`
- **Build:** android v0.682
- **Lane impact:** L5 (UI/HUD) - exact hex for the item-name colour ladder, and the fact that the loot/gift dialog uses a brighter palette than the inventory panel. A builder implementing one palette gets the loot popup wrong.

### `[[cite04/web-crit-label-and-sfx-symbol]]` — UPHELD [A2] (1 critic)

The full-bar crit has a named readout and a named sound in the web build: the label under the Focus bar switches to getString(175) = 'Critical Hit' the moment the bar reaches 1.0, and the client plays the sound symbol 'Snd_criticalDamage' on that same transition. This corroborates itemdata-hunter/full-bar-is-the-crit (which is android-only) for the build we are recreating, and it names an audio symbol - useful given S0-5 says the audio is held but encrypted.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:110-111, :348-358; docs/gauntlet/L0/index/strings.json["175"]`
- **Build:** web v0.717
- **Lane impact:** L-ui-hud and L-art-anim-audio-feel: the third-bar label has three states (CANNOT CHANGE STANCE / blank / Critical Hit) and the crit transition carries an SFX cue with a known symbol name.

### `[[frames/HUNT-death-card-header-and-warroom-death]]` — UPHELD [A1] (1 critic)

The death card header DOES resolve to the string table even though its two buttons do not, and there is a separate war-room death string nobody has surfaced. Small but it tightens claim 6: the card is a mix of table-backed and hardcoded copy.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-22/frames/frame_0026.jpg (read whole @1.9x) vs strings.json["92"] and ["831"]`
- **Build:** web v0.717 frame vs android v0.682 table
- **Lane impact:** ui-hud, meta-social

### `[[frames/v0717-is-a-string-superset-not-identity]]` — UPHELD [A1] (2 critics)

The parity in the previous claim is a SUPERSET relation, not identity: v0.717 ships a seven-page War Room rules deck where the android table caps at six, so android absence is not evidence of v0.717 absence.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0011.jpg (crop 0,0-1024,400 @1.95x); siblings frame_0012.jpg and frame_0013.jpg`
- **Build:** web v0.717 (7 pages) vs android v0.682 (6 pages)
- **Lane impact:** meta-social, ui-hud: bounds the parity rule established above

### `[[kh-greenline-and-redline-are-named-in-both-builds]]` — UPHELD [A2] (1 critic)

The second slash-stroke render state is not an unidentified colour needing a frame pass -- the android source names it. InputManager.as:172-175 is 'public static function greenLine()' setting lineStyle to 39168 (0x009900) and :177-180 is 'public static function redLine()' setting it to 10027008 (0x990000). Both builds carry the identical pair (web twin at §1t1541s0§.as:174 and :179). This corrects the build attribution in packet claim actionscript/slash-line-colour-is-0x990000, which says the green is web-only and unidentified.

- **Cite:** `reference/decompiled/shs3_android/scripts/InputManager.as:172-180`
- **Build:** both
- **Lane impact:** L-art-anim-audio-feel + L-ui-hud: two named slash-line states, red 0x990000 and green 0x009900, with function names that say which is which. The remaining open question is only WHEN greenLine() is used -- that part is still STILL_UNHELD from this cite alone.

### `[[questdata/portrait-count-correction]]` — UPHELD [A2] (2 critics)

Correction to this lane's own run-1 claim: there are 52 distinct dialogue portraits, not 68. Run 1's figure was the union of 52 portraits plus the 16 full-screen story cards, mislabelled as portraits.

- **Cite:** `reference/extracted/questdata.xml — parse of <dialogue><img> (52 distinct) vs <intro><img> (16 distinct)`
- **Lane impact:** L11 art-anim / L10 ui-hud: the from-scratch art manifest to build against is 52 character portraits with emotional variants plus 16 full-screen story cards — not 68 portraits.

### `[[string-table/balanced-ring-is-khaki-on-film-not-ochre]]` — UPHELD [A1] (1 critic)

The BALANCED portrait ring as it actually renders in web v0.717 footage is a desaturated khaki (#b3ae76, hue ~55 deg, sat ~34%), materially unlike the banked sprite-export hex #996600 (hue 40 deg, sat 100%) — so a rebuild that paints #996600 flat will not match the film, while the HEAVY ring measures #8e0807 against palette.ts ringRed 0x950d00 and does match.

- **Cite:** `reference/frames/session11/stance-reach/B_t851.933_BALANCED_ring_tan_one-tick-after-click.png, B_t855.800_HEAVY_ring_red.png, B_t851.867_LIGHT_ring_blue_CHANGE-STANCE_tooltip.png`
- **Build:** frames web v0.717; compared against the banked web sprite export
- **Lane impact:** L-ui-hud + L-art-anim-audio-feel: HEAVY reconciles well (#8e0807 filmed vs #990000 asset vs src/config/palette.ts:51 ringRed 0x950d00 — the shipped config is already right). BALANCED does NOT: 100%-saturated ochre cannot compress to 34%-saturated khaki by codec loss alone across a 2-3 px annulus, so either the ring is composited with alpha/blend over the portrait or the balanced frame carries a filter. STATED PLAINLY AS §0 REQUIRES: where the doc and the frame disagree the frame wins on what is on screen — the balanced ring READS khaki on film. I mark this PARTIAL, not HELD, because I cannot separate a compositing rule from codec loss without opening the sprite export myself, which is another unit's surface. Next step is cheap: open reference/extracted/sprites/DefineSprite_3394_shs3_fla.stancecolor1_56/2.png and check for a non-255 alpha or a blend mode before anyone hard-codes #996600.

### `[[string-table/stance-tint-covers-the-whole-medallion]]` — UPHELD [A1] (1 critic)

The stance colour is not confined to the portrait ring — the disc FILL behind the bust is tinted too, so the medallion is a two-part stance-coloured widget: blue ring over navy disc (Light), olive-tan ring over dark-brown disc (Balanced), red ring over dark-maroon disc (Heavy).

- **Cite:** `reference/frames/session11/stance-reach/B_t851.867_LIGHT_ring_blue_CHANGE-STANCE_tooltip.png, B_t851.933_BALANCED_ring_tan_one-tick-after-click.png, B_t855.800_HEAVY_ring_red.png — crops (0,860)-(700,1080) x2 LANCZOS and 200x170+10+915 x4`
- **Build:** web v0.717 (both frames from the longplays)
- **Lane impact:** ui-hud + art-anim-audio-feel — extends the banked ui-hud/stance-ring-colours-exact (which measured only the 63x63 stancecolor1_56 annulus at #4242FF/#996600/#990000) to a second tinted element behind it. A rebuild painting only the ring will be visibly wrong. It also shows the frame binds stance NAME to colour on its own, with no string and no code needed — which is why string-table/stance-ring-colours-named-in-tutorial-copy's novelty argument was unnecessary.

### `[[string-table/the-CANNOT-CHANGE-STANCE-string-id-960-is-absent-from-the-parsed-table]]` — UPHELD [A2] (1 critic)

The web build paints the CANNOT CHANGE STANCE caption from LangManager.getString(960), and id 960 does NOT exist in docs/gauntlet/L0/index/strings.json (2,533 Android entries). The companion CRITICAL HIT caption is getString(175) and resolves fine ('Critical Hit'). So S0-3's 'the string blocker is dead' holds for the DATA tables but not universally for web UI copy: at least one web UI string id has no Android counterpart, which is exactly the build-parity gap the S0 caveat warns about.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:110-111, checked against docs/gauntlet/L0/index/strings.json["960"] (absent) and ["175"] ('Critical Hit')`
- **Build:** both
- **Lane impact:** L8 ui-hud + string-table lane: the exact on-screen wording 'CANNOT CHANGE STANCE' is held by the FRAME (reference/frames/duel_dense/Nr4fQstqHDM_428.0.png, bottom-left crop) and not by the string table — THE FRAME WINS and is the only source for it. Flag: any web UI string whose id exceeds the Android table's range needs a frame or a web-side text source, and the id range where this starts has never been surveyed.

### `[[string-table/ui-hud-md-still-carries-the-refuted-id-drift-table]]` — UPHELD [A2] (1 critic)

systems/ui-hud.md still presents `ui-hud/lang-id-drift-caveat` as HELD and issues a downstream rule ('never resolve by id alone') that is inverted — LangManager keys the XLIFF by resname, so 619 IS 'Auto Slash Off' and 223 IS 'AP', and the doc's two red-X rows are its own mis-keying, not a build-revision drift.

- **Cite:** `docs/gauntlet/L0/systems/ui-hud.md:502-508 + reference/decompiled/shs3_android/scripts/LangManager.as:78 + OverworldHUD.as:211 + BattleUI.as:124-125`
- **Build:** android v0.682 (string table + LangManager); mechanism identical in web v0.717
- **Lane impact:** cross-lane hygiene, NOT a new discovery — the fact is already banked as ui-hud/langmanager-uses-resname-not-id (SEEN_CLAIM_IDS.txt:1058) together with ui-hud/resname-600-proves-pass1-read-the-id-column and ui-hud/web-build-confirms-resname. I report it only because systems/ui-hud.md was never corrected and still hands the wrong resolution rule to the next reader of that survey. It also vindicates this unit: the string-table surveyor keyed by resname throughout and was right to; docs/gauntlet/L0/index/strings.json is resname-keyed and correct.

### `[[ui-hud/150-percent-damage-is-a-buff]]` — UPHELD [A2] (1 critic)

The "150% DAMAGE" line in the duel HUD is the timed BUFF_ATTACK consumable readout, not the stance modifier — the string is a literal in the client.

- **Cite:** `reference/decompiled/shs3_android/scripts/OverworldHUD.as:1388-1428 (updateBuff); docs/gauntlet/L0/index/strings.json id 4132; corroborated in reference/frames/duel_dense/Nr4fQstqHDM_432.0.png crop (52,900)-(700,1080) x3`
- **Lane impact:** ui-hud gains a required buff-text slot (OverworldHUD.bufftext, htmlText, hidden when duration <= 0 or the stats button is hidden). Closes the "un-reconciled" caution the surveyor left on art-anim-audio-feel/hit-reaction-12-ticks, and closes it against the surveyor's own guess.

### `[[ui-hud/24fps-from-swf-headers]]` — UPHELD [A2] (1 critic)

The 24 fps that every millisecond figure in this lane depends on is provable from the SWF headers of both payloads, not from the conditional fallback the pass implicitly relied on.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf and reference/decrypted/shs3_android_payload_decoded.swf (SWF header parse: signature/version/rect/frameRate/frameCount)`
- **Lane impact:** ui-hud lane: puts an A2 floor under every ms conversion in the lane (708 ms close shutter, 667 ms open shutter, 250/417 ms result-card beats, 0/792/2833/3625 ms duel intro, 12-frame damage popup). Cross-lane: combat-core and skills-meters convert frame counts to ms with the same constant and can now cite the header instead of inferring it. Also confirms both build stage rects in one place - web 800x690 authored canvas, android 800x480.

### `[[ui-hud/690-friend-bar-never-filmed]]` — UPHELD [A1] (8 critics)

The 800x690 'friend bar' layout that Pass 1 found in code is exercised in zero reference frames — every captured session ran the 480 layout — so it is code-held but frame-unverified and must be labelled INFERRED-from-source if built.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_427.0.png, duel_frames/Nr4fQstqHDM_t425.0s.png, zFt_combat/zFtCaTO0_1M_t0320s.png, zFt_combat/zFtCaTO0_1M_t0325s.png`
- **Lane impact:** ui-hud lane: bounds Pass 1's claim 2 (dual-layout 480/690). The layout exists in code but nobody has ever seen it rendered; a rebuild that ships it is authoring, not copying. Independently replicates Pass 1's pillarbox measurement to the pixel (52/1816 and 55/1807).

### `[[ui-hud/800x690-is-the-embed-stage-800x480-is-the-viewport]]` — UPHELD [A2] (1 critic)

The 800x690 vs 800x480 conflict resolves cleanly and neither number is wrong. BOTH the outer loader the browser embeds (reference/preservation/shs3.swf) and the decoded payload (reference/decrypted/shs3_payload_decoded.swf) declare an identical stage RECT of 800.0 x 690.0 at 24.000 fps - I parsed both headers. The GAME VIEWPORT is 800 x 480: the full-screen hurt vignette art inside the payload measures exactly 800x480, the BattleUI's skill-slot row sits at y=450, and the filmed content region is 1816 x 1080 = 1.681 aspect = 5:3. So 690 is the embed/authoring stage that carries chrome outside the play area, and RR:117 / RR:171's 800x480 native canvas stands as the viewport.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf and reference/preservation/shs3.swf (my own zlib+RECT header parses) + reference/extracted/sprites/DefineSprite_3607_shs3_fla.hurtred_32/1.png + reference/decompiled/shs3_payload/scripts/§1t113s0§.as:170-171`
- **Build:** web v0.717
- **Lane impact:** L8 ui-hud - settles the 800x690 challenge without discarding the 800x480 canvas; both go in the ledger with their scopes named.

### `[[ui-hud/NEW-hud-buff-line-is-a-hardcoded-string-table]]` — UPHELD [A2] (1 critic)

The battle HUD's buff line is a hard-coded string ladder in OverworldHUD.updateBuff(bufftype, duration), not a computed percentage: eleven literal strings keyed on StatsManager.BUFF_* ids, including four non-potato buffs (coins, rare loot, anti-spam muting, hell imprisonment) that no ledger holds. The line is cleared whenever duration <= 0 or the stats button is hidden.

- **Cite:** `reference/decompiled/shs3_android/scripts/OverworldHUD.as:1388-1440`
- **Build:** android v0.682
- **KILLS this line:** "Surface: overworld HUD lives only in segment A-00, not MASTER §8 (which is combat-only); portrait ring is stance-colored, not fixed red."
- **Lane impact:** L8 ui-hud: independently closes the '150% DAMAGE' question on a string literal rather than on the itemdata/strings inference the two potato-buff claims rest on, and adds five buff types (COINS, RARELOOT, MUTE, FULLMUTE, HELL) plus the exact clear-condition that no ledger holds. Cross-lane into L3 economy: BUFF_COINS and BUFF_RARELOOT are loot/drop-rate modifiers with no numbers exposed here — a real remaining gap.

### `[[ui-hud/blackopen-shutter-is-16-frames]]` — UPHELD [A2] (1 critic)

The two black shutters are NOT symmetric: the closing shutter runs 17 frames (708 ms) because of an explicit counter gate, but the opening shutter has no gate and completes in 16 frames (667 ms).

- **Cite:** `reference/decompiled/shs3_android/scripts/ScreenTransition.as:93-108,159-162`
- **Lane impact:** ui-hud lane: corrects this pass's claim ui-hud/transition-durations-exact, which asserts 17 frames for both shutters. A rebuild that ports 708 ms to the open shutter will be 41.7 ms slow on every room entry, node explore, teleport and rest - i.e. on essentially every world-exploration transition. Also invalidates the stated derivation (n-2)(n-1); the correct displacement law is n(n-1).

### `[[ui-hud/buff-row-is-frame-confirmed-A1]]` — UPHELD [A1] (1 critic)

Frame-level (A1) confirmation of the bottom-left combat HUD stack that claims hud-150-is-potato-buff and hud-150-is-a-potato-buff asserted only at A2 class. The stack is five rows: a red-ringed kasa-wearing portrait; a green HP bar reading 20/20; a blue AP bar reading 26/26; a tan/brown strip reading CANNOT CHANGE STANCE; and beneath it a yellow line reading 150% DAMAGE. The restriction line and the buff line are two SEPARATE rows in two different colours, which is independent visual proof that the 150% figure is a buff readout and not a stance modifier.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_432.0.png — crop (x 0-640, y 820-1080) of the 1920x1080 frame, upscaled 3x with LANCZOS`
- **Build:** web v0.717 (video capture of the live web game)
- **KILLS this line:** "(none — this supplies the A1 evidence class for an existing A2 claim)"
- **Lane impact:** L8 ui-hud gains an active-buff HUD element and a restriction-line element no ledger holds, both frame-measured. Pairs with strings.json["125"] = 'Stance Restriction' and the type-10 / modifier-38 consumable shape at itemdata.xml:237-249.

### `[[ui-hud/frame-to-stage-mapping-is-anisotropic]]` — UPHELD [A2] (1 critic)

The reference video's frame-to-stage mapping is anisotropic — x divides by 2.270 but y divides by 2.250 — and the fit branch in the shipped code explains exactly why.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:283-290, cross-checked against pillarbox measured on reference/frames/duel_dense/Nr4fQstqHDM_428.0.png (cols 52->1867 w 1816, rows 0->1079) and all 240 reference/frames/broad_survey/*.jpg`
- **Lane impact:** Cross-lane measuring convention. Any lane converting a frame Y with 2.270 is 1 % wrong — this lane's own claim 7 did exactly that and published (639.4, 446.0) against a code truth of (640, 450). The lane journal already states the correct rule at docs/gauntlet/L0/systems/ui-hud.md:31-32; the structured claim contradicted it.

### `[[ui-hud/frame-to-stage-transform]]` — UPHELD [A1] (1 critic)

The frame-to-game transform for video B is now pinned: game stage 800x480 rendered at scale 2.2689 with origin (52, -5.0) in frame pixels, fitted on three code-known slot centres with sub-0.4 px residuals.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png — border scanlines at y=1000/1050/1060 across x 1400..1900, plus full-frame pillarbox extents`
- **Lane impact:** Cross-lane tooling, not just ui-hud (L4 ui-hud, but usable by L1 combat-core, L6 art-anim, L11 world-exploration). Any lane measuring anything off Nr4fQstqHDM can now convert frame pixels to game pixels directly. It also corrects the surveyor's transform, which applied the horizontal scale to the vertical axis with y0=0 and so mis-converted the slot row as 446 instead of 450.

### `[[ui-hud/framerate-and-stage-rects-bytechecked]]` — UPHELD [A3] (1 critic)

24.000 fps is byte-verified from the SWF headers of both builds — the missing premise under every millisecond figure in this lane — and the same parse shows the authored WEB stage is 800x690 while the ANDROID stage is 800x480, so the friend bar is a structural difference between the builds, not merely a code path.

- **Cite:** `SWF header parse of reference/decrypted/shs3_payload_decoded.swf, reference/decrypted/shs3_android_payload_decoded.swf, reference/preservation/shs3.swf, reference/preservation/shs3preloader.swf`
- **Lane impact:** L-ui-hud and every lane quoting a millisecond: 24 fps was assumed, never held. Now held. The 800x690 vs 800x480 split also grounds the friend-bar claim structurally (the web build reserves 210 px of authored stage the Android build does not) and warns that any '480' constant lifted from the Android decompile is the GAME AREA height, not the web stage height.

### `[[ui-hud/friend-bar-gated-by-resizehandler]]` — UPHELD [A2] (1 critic)

The 800x690 friend-bar layout was structurally unfilmable at the aspect ratios both longplays were captured at, and the web build authors it into the SWF stage while the Android build does not — a measured build divergence inside the HUD.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:267-280, plus SWF headers of reference/decrypted/shs3_payload_decoded.swf and reference/decrypted/shs3_android_payload_decoded.swf`
- **Lane impact:** L4 ui-hud: upgrades ui-hud/690-friend-bar-never-filmed from 'nobody happened to film it' to a code-proven gate, and supplies the aspect-ratio mechanism ledger blocker (1) ('aspect-ratio truth ... read stage.stageWidth in a build') was asking for — without a build. Also supplies the counterexample that refutes the surveyor's 'android parity retired' conclusion: the two builds ship different authored stage heights.

### `[[ui-hud/friend-bar-is-structurally-unfilmable]]` — UPHELD [A2] (2 critics)

The 800x690 friend-bar layout cannot appear in any 16:9 capture: the game enables it only when the player's window aspect is at most 800/690 = 1.1594, so its absence from the reference videos is structural rather than a sampling accident.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:271-279 (web equivalent reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:271-273), corroborated by my scan of 267 frames sampled across all 45 directories under reference/frames/`
- **Lane impact:** ui-hud: upgrades claim ui-hud/690-friend-bar-never-filmed from PARTIAL (a 7-frame induction) to HELD with a code proof and a 267-frame scan. The practical conclusion is unchanged and correct - if the friend bar is built it must be labelled INFERRED-from-source, because no artifact anywhere shows it rendered.

### `[[ui-hud/friend-bar-is-the-shipped-default]]` — UPHELD [A2] (1 critic)

The 800x690 friend-bar layout is the web build's authored, default-shipped canvas — not an unshipped code path — so building it is copying, not authoring.

- **Cite:** `SWF header of reference/decrypted/shs3_payload_decoded.swf + reference/decompiled/shs3_android/scripts/GameEngine.as:268-280 + OverworldHUD.as:388-390`
- **Lane impact:** ui-hud: bounds P12 the other way. The videos captured the non-default wide mode; the 210 px friend strip below the 480 canvas was the authored default. Also settles that 480 is the game canvas in BOTH builds, so P2's 480 corollary is safe.

### `[[ui-hud/hotkey-numbering-rule]]` — UPHELD [A1] (1 critic)

Skill-slot hotkey numbers are assigned right-to-left by initKeyPressText(slotCount - i) against a right-to-left layout, which reproduces the filmed HUD exactly — three slots, leftmost empty and unnumbered because its skillSlots entry is null, middle key 2, right key 3.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png crop (1050,900)-(1880,1080) upscaled 3x, adjudicating reference/decompiled/shs3_android/scripts/BattleUI.as:133-134,492-512 and SkillSlotButton.as:123-135`
- **Lane impact:** L-ui-hud: turns the survey's rule-level note ('unnumbered empty slot matches initEmpty()') into a full three-slot frame-vs-code match including the gap and the numbering direction. Also bounds ledger blocker ④ ('the 3 skill slots is really ~2 abilities + a stance up-arrow') — the frame shows slot 1 EMPTY, so the filmed session had two equipped skills in a three-slot bar, not two abilities plus a stance control.

### `[[ui-hud/interact-icon-manifest-found]]` — UPHELD [A2] (1 critic)

The InteractUI icon manifest is on disk and the id space is far smaller than assumed: only 20 distinct icon ids appear across the 139 references, and GenericActionButton resolves every one of them to a named MovieClip class.

- **Cite:** `reference/decompiled/shs3_android/scripts/GenericActionButton.as:262-345 and NodeUI.as:13-75, against reference/extracted/android/90_InteractUI_UIData.bin`
- **Lane impact:** ui-hud: refutes the 'no icon manifest for the 139 icon ids' half of claim ui-hud/hud-symbol-metrics and of the score rationale. Only the vector art is unexported; the id->class mapping is complete. Also feeds world-exploration and economy, since the same 20 action icons drive every town interaction menu in 90_InteractUI_UIData.bin.

### `[[ui-hud/interactui-has-six-buttons]]` — UPHELD [A2] (1 critic)

InteractUI's panel is a SIX-button menu, not five. The packet's geometry quote stops one line short of button6: payload.xml:626602-626603 carry name="button6" translateX="200" translateY="6100" -> (10, 305) px, holding the same 39 px row pitch, and :626605-626606 carry name="npcname" translateX="220" translateY="6514" -> (11, 325.7) px. Confirmed in code in BOTH builds. A rebirth/element picker laid out from the five-button quote will be one row short and will have no NPC-name field.

- **Cite:** `reference/extracted/payload.xml:626602-626606 + reference/decompiled/shs3_payload/scripts/§1t401s0§.as:67,133-135 + reference/decompiled/shs3_android/scripts/InteractUI.as:57,131-133`
- **Build:** both
- **Lane impact:** ui-hud + rebirth-elements: the InteractUI layout table must carry six rows (y = 109/148/187/226/265/305 px) plus npcname at (11, 325.7).

### `[[ui-hud/interactui-icon-ids-resolve]]` — UPHELD [A2] (1 critic)

The 139 InteractUI <icon> ids are not 139 unresolved unknowns — they draw on a small enumerated ACTION_* set that resolves by name in code, so only the vector art is missing, not the mapping.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeUI.as (ACTION_* constants) and GenericActionButton.as setInteractIcon(iconID) switch`
- **Lane impact:** L-ui-hud: shrinks the residual the survey priced into its score. Its claim 13 says 'the 139 <icon> ids map to unextracted art', implying 139 unknowns; the id->name mapping is held in code and only the art is unexported. I mark this PARTIAL rather than HELD because I read the switch but did not enumerate every distinct id against every case myself.

### `[[ui-hud/interactui-menu-system]]` — UPHELD [A2] (8 critics)

An entire data-driven interaction-UI subsystem — 19 screens, 47 menu pages, 139 options with icons, inventory gates and error copy — is on disk and is mentioned by neither the ledger's ui-hud block nor Pass 1.

- **Cite:** `reference/extracted/android/90_InteractUI_UIData.bin:5-9,17`
- **Lane impact:** ui-hud lane under-claim: the Ready bullet list (combat HUD, VS/FIGHT, result cards, overworld HUD, ribbon, minimap, parchment chrome, login/char-create) omits the town interaction UI entirely. Directly feeds economy (peddler/market/bank/blacksmith/gambling den option sets), world-exploration (stables, towntoll, vegpatch), rebirth-elements (a 'rebirth' screen exists) and meta-social (leaveclan, joincustomclan*).

### `[[ui-hud/keypress-index-is-reversed]]` — UPHELD [A2] (1 critic)

The on-screen skill number is the reverse of the skill-array index, so key 3 fires skillSlots[0] and key 1 fires the leftmost slot.

- **Cite:** `reference/decompiled/shs3_android/scripts/BattleUI.as:504 with :133 and :500-501`
- **Lane impact:** L4 ui-hud, and L5 skills-meters for the input binding. A rebuild that binds key N to skillSlots[N-1] mirrors the OG's bindings left-to-right. Verified against the frame: the '2' and '3' labels sit on the middle and right boxes respectively, which is only consistent with slotCount - i.

### `[[ui-hud/langmanager-uses-resname-not-id]]` — UPHELD [A1] (8 critics)

LangManager.getString() is keyed by the XLIFF resname attribute, not the id attribute, so every string id Pass 1 of this lane quoted above 211 is wrong — and a video frame, not a document, is what proves it.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png (crop (40,0)-(560,200), upscaled 3x) adjudicating reference/decompiled/shs3_android/scripts/BattleUI.as:124`
- **Lane impact:** Cross-lane, not just ui-hud: any lane that quoted a Mobile_Lang_EN id above 211 must re-derive it against strings.json resnames. Concretely corrects this lane's own Pass 1: 'Pause state string is id 388 "Game Paused"' is wrong (resname 388 = 'Condition: Poor'; 'Game Paused' is resname 407), and 'id 1506 Skill Slots+, ids 1648/1649/1650' should be resnames 6014 and 7009/7010/7011. Pass 1's getString(104)='FIGHT!' is below the divergence point and survives. THE FRAME WINS over both maps.

### `[[ui-hud/paperdoll-9-box-to-eq-slot-map]]` — UPHELD [A2] (1 critic)

The nine paperdoll boxes are explicitly bound to model slots in InventoryUI: hat, mask, armor, gloves, pants, weapon, accessory1 (left ring), shoes, accessory2 (right ring) - so both ring boxes are the two accessory slots and NEITHER is EQ_NECK; the four model slots with no UI box are EQ_HAIR, EQ_HEAD, EQ_NECK and EQ_SCABBARD.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:163-179, :261-269, :459, :472-535`
- **Lane impact:** L5 (UI/HUD) - closes the survey's only STILL_UNHELD UI item outright. The SLOT_ index order (hat, mask, armor, gloves, pants, weapon, ring1, shoes, ring2) matches the frame's reading order exactly, so the layout AND the binding are now both codeable; also sharpens the '9 boxes over a 13-slot model' bullet to name all four unrendered-in-UI slots including NECK.

### `[[ui-hud/pass1-fabricated-transunit-quote]]` — UPHELD [A2] (1 critic)

This lane's Pass-1 journal contains a verbatim XML quote that does not exist in the artifact it cites.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin vs docs/gauntlet/L0/systems/ui-hud.md:465`
- **Lane impact:** ui-hud lane hygiene, and a cross-lane warning: §0 calls a fabricated cite the worst available outcome, and one is already banked in a journal. Pass 2 caught the downstream consequence (resname vs id keying) but not the fabrication itself. Any other lane that re-derived a string from a journal-quoted <trans-unit> line rather than from the blob should be re-checked against reference/extracted/android/118_Mobile_Lang_EN.bin directly.

### `[[ui-hud/pass1-stale-string-rules-still-live]]` — UPHELD [A2] (1 critic)

Two Pass-1 statements that P1's resname discovery kills are still standing in the lane journal as guidance for downstream lanes, and P1 names neither.

- **Cite:** `docs/gauntlet/L0/systems/ui-hud.md:472,475 and :491,508`
- **Lane impact:** ui-hud and every lane reading this journal: resnames reach 7011 and Stage-0 S0-3 measures itemdata 804/0, skilldata 73/0, npcdata 484/6 resolved, so claim 16's limit is dead. Claim 17's cause is wrong (it is the attribute, not the build) and its ~400 threshold is wrong (divergence is exactly at id=212 / resname=222). Both need striking, not just superseding.

### `[[ui-hud/pass1-xliff-quote-is-misquoted]]` — UPHELD [A2] (1 critic)

Pass 1's fenced 'verbatim' XLIFF evidence block in the lane journal silently rewrites the resname attribute on every row above the divergence point, so the journal's own evidence contradicts the artifact and would make P1 look wrong to anyone who checked it.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin adjudicating docs/gauntlet/L0/systems/ui-hud.md:465-467`
- **Lane impact:** ui-hud (and every lane that reads this journal): the single attribute P1's whole thesis turns on was altered inside a block presented as the raw file. Needs a direct correction in systems/ui-hud.md, not just a superseding Pass-2 claim. P1 did not notice it.

### `[[ui-hud/reload-crit-meter-code-live-frame-absent]]` — UPHELD [A2] (1 critic)

A third combat meter exists and is live in code -- a reload bar whose fill drives a 'Critical Hit' label at 100% -- but it renders in zero reference frames, so it is code-held and frame-absent, not recovered.

- **Cite:** `reference/decompiled/shs3_android/scripts/BattleUI.as:48,60,102,259-262 and MCSPlayer.as:241,1168,3112,3272`
- **Lane impact:** skills-meters and combat-core, flagged not banked. It contests the standing line 'OG has NO Critical meter (Focus buys evasion)', but my crop (0,910)-(700,1080) at 2x of duel_dense/Nr4fQstqHDM_428.0.png shows TWO bars only -- no third meter -- so THE FRAME WINS and the existing line survives. Treat as a lead: the widget is compiled in and driven by reload/maxreload with a -24 (one-second-at-24fps) offset, but nothing proves it was ever visible in v0.717.

### `[[ui-hud/resname-600-proves-pass1-read-the-id-column]]` — UPHELD [A2] (1 critic)

resname 600 is 'Special Control Point' while id 600 is 'Auto Slash Off' - direct proof that Pass 1 was reading the id column, which kills its 'different build revision' diagnosis and invalidates the resolution rule it left behind for every other lane.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin, trans-units id/resname 600 and 601, adjudicating docs/gauntlet/L0/systems/ui-hud.md:505-509`
- **KILLS this line:** "The true strings for the mismatches are present at different ids — 600 "Auto Slash Off", 601 "Auto Slash On" … Rule for downstream lanes: ids below ~400 resolve directly; above that, resolve by string search, then corroborate against uistrings.txt or a frame — never by id alone."
- **Lane impact:** Cross-lane. Pass 1 claim 17 is still live in the journal as guidance for other lanes and its rule is wrong. There is no build drift and no need for string search: resolve by resname, always, at every id. reference/extracted/android/118_Mobile_Lang_EN.bin is a single table read with two different keys.

### `[[ui-hud/respawn-costs-one-heavenly-gold]]` — UPHELD [A2] (1 critic)

The lose-card revive has a hard price: exactly 1 Heavenly Gold, with the purchase prompt opening on insufficient funds.

- **Cite:** `reference/decompiled/shs3_android/scripts/LoseUI.as:94-107`
- **Lane impact:** economy lane primarily, ui-hud secondarily. The survey's claim 8 gestured at 'a revive-for-gold paywall' without the number; the number is 1 Heavenly Gold and the telemetry tag is reportPremiumBuy(3,"respawn",1). Android v0.682 caveat applies -- label it as such if ported.

### `[[ui-hud/result-cards-exact]]` — UPHELD [A2] (8 critics)

The win/lose result cards are an 11-frame timeline with exact beats, a DRAW variant the ledger never mentions, and a revive-for-gold paywall on the lose card.

- **Cite:** `reference/decompiled/shs3_android/scripts/WinUI.as:26,32-37,49-55,90 and LoseUI.as:35-36,45,53`
- **Lane impact:** ui-hud lane: upgrades the Ready bullet 'result cards' from structural to frame-exact and adds an unlisted DRAW state. Touches economy (the lose card is a gold-gated revive prompt) and meta-social (replay URL).

### `[[ui-hud/shutter-frame-counts-corrected]]` — UPHELD [A2] (1 critic)

The screen-shutter durations are 16 frames of motion for BOTH shutters, with the close transition holding one extra frame before firing its action: BLACKOPEN completes at frame 16 (667 ms) with no counter gate, BLACKCLOSE meets at frame 16 and fires doAction at frame 17 (708 ms).

- **Cite:** `reference/decompiled/shs3_android/scripts/ScreenTransition.as:77-107,143-163, frame-by-frame simulation; confirmed web-side at reference/decompiled/shs3_payload/scripts/§1t6497s0§.as:79-124`
- **Lane impact:** L-ui-hud: corrects the survey's 'each shutter = 17 frames / 708 ms' to open=16/667 and close=16 motion + action at 17/708. A rebuild shipping 708 ms for the open shutter is wrong on every room exit. Also banks the white-fade coupling: startOpenWhite has exactly one caller (Overworld.as:377) passing ACTION_REFRESHROOMONOPEN, whose case at :289-292 re-arms transitioning=true — without that pairing the counter==2 doAction would freeze the fade at alpha 0.917.

### `[[ui-hud/shutter-is-asymmetric]]` — UPHELD [A2] (1 critic)

The black screen-shutter is asymmetric: closing takes 17 frames (708 ms) but opening takes 16 frames (667 ms), because only the close path is counter-gated.

- **Cite:** `reference/decompiled/shs3_android/scripts/ScreenTransition.as:80-89 vs :95-106; 24.0 fps from the SWF headers of reference/decrypted/shs3_payload_decoded.swf and shs3_android_payload_decoded.swf`
- **Lane impact:** L-ui-hud: corrects the lane's own transition-duration claim. A rebuild that plays both shutters at 17 frames will be 42 ms long on every screen entry.

### `[[ui-hud/skill-slot-widget-geometry-measured]]` — UPHELD [A1] (1 critic)

The skill-slot widget's pixel geometry is not sealed in the symbol after all: the box is 49-50 game px square on a 60 game px pitch centred at y=450, and the code carries the matching hit-band edge at game y=420.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png — empty-box border measured in region (1430,930)-(1580,1080), mean-RGB>150, >=5 px per row/col; numeral centroids measured in rows 930-975 — cross-checked against reference/decompiled/shs3_android/scripts/BattleUI.as:339 and web §1t113s0§.as:451`
- **Lane impact:** ui-hud: partially refutes claim ui-hud/hud-symbol-metrics ('HUD panel/bar/plaque pixel geometry ... remain ungrounded - I will not name any of them'). One HUD widget is now buildable from the frame plus code without any JPEXS export. The panel/bar/plaque chrome genuinely does remain symbol-locked - BattleUI.doResize (:929-936) only sets scaleX/scaleY/x/y on the whole clip - so the rest of that claim stands.

### `[[ui-hud/slot-box-measurement-corrected]]` — UPHELD [A1] (1 critic)

The skill-slot box in the reference frame is 109x109 px with borders at rows 962/1071, not the 121-px span Pass 2 quoted, and the corrected conversion makes the Android-source prediction exact at three slots rather than approximate at one.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png — bright-border scan (max-channel > 150) over y in [930,1080), x in [1400,1900); visual crop (1380,920)-(1880,1080) Lanczos x3`
- **Lane impact:** ui-hud: THE FRAME WINS over Pass 2's quoted rows. Upgrades the build-parity evidence from a one-point ~1 px match to a three-point exact match, which is the strongest frame-to-code agreement in this lane.

### `[[ui-hud/slot-strip-matches-all-three-constants]]` — UPHELD [A1] (1 critic)

Converted with the game's own fit routine rather than a single uniform scale, all three visible skill slots land on the shipped constants, and the y error collapses from 4 px to under 2 px.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png, crop (1380,920)-(1880,1080) upscaled 3x, plus per-column/row luminance extents and digit-glyph centroids over the full 1920x1080 frame`
- **Lane impact:** ui-hud lane: replaces the surveyor's non-reproducible row measurement (they report rows 952->1073, centre 1012.5; no threshold I tried reproduces 952) and its 4-px y error. It also supplies the correct frame<->stage conversion for the whole lane - offsetY=0 with vertical scale 1080/480 = 2.25, NOT a single uniform 2.270 - which every future A1 measurement in ui-hud and combat-core should use, since applying 2.270 vertically biases every stage-y by about -1.8%.

### `[[ui-hud/swf-header-24fps-and-stage-rects]]` — UPHELD [A3] (1 critic)

Byte-check of the SWF headers: the web payload's authored stage is 800x690, the android payload's is 800x480, and BOTH run at exactly 24.000 fps - which is the missing premise under every millisecond figure in this lane.

- **Cite:** `Header parse of reference/decrypted/shs3_payload_decoded.swf, shs3_android_payload_decoded.swf and shs3_binarydata_9_decrypted.swf (CWS signature, zlib body, RECT + frameRate + frameCount fields)`
- **Lane impact:** ui-hud: claim ui-hud/transition-durations-exact asserts 708 ms and 1000 ms 'at the SWF's 24 fps' but cites no artifact for 24 fps; likewise claim ui-hud/result-cards-exact's 250/417 ms. This supplies it for both builds. It also shows the web build's AUTHORED stage is the with-friend-bar size while the LOGICAL stage is 800x480 in both (§1t1523s0§.as:104,106), which is what keeps the frame-vs-code geometry consistent.

### `[[ui-hud/swf-headers-24fps-and-stage-rects]]` — UPHELD [A3] (1 critic)

Both builds run at exactly 24 fps and the web SWF's native stage is 800x690 while the Android SWF's is 800x480 -- the byte-check that every frame-to-milliseconds conversion in this lane silently depends on.

- **Cite:** `SWF header byte-read of reference/decrypted/shs3_android_payload_decoded.swf, reference/decrypted/shs3_payload_decoded.swf, reference/preservation/shs3.swf`
- **Lane impact:** ui-hud lane: grounds claim 2's 708 ms / 1000 ms, claim 8's 250 ms / 417 ms and claim 11's VS/FIGHT beats, all of which asserted '24 fps' without a cite. Also sharpens claim 12: 800x690 is not an exotic branch, it is the web build's OWN stage rect -- the videos were captured with the friend bar suppressed by window aspect (GameEngine.as:275). Third: the 800x480 Android stage independently confirms ScreenTransition's shutter halves parking at +/-240.

### `[[ui-hud/tan-reload-bar-is-static-across-427-432]]` — UPHELD [A1] (1 critic)

The in-combat reload/Focus bar does NOT change length anywhere in the duel_dense window, contrary to the packet's claim that it visibly varies across 427.0 / 429.0 / 431.0. Its top-strip column profile is identical to within compression noise across 427.0, 427.5, 428.0, 428.5, 429.0, 431.0, 431.5 and 432.0, and its right edge measures 509 / 509 / 511 for the three frames the packet contrasts. Anyone re-deriving Focus timing from these frames will get nothing; the meter's behaviour has to come from the source.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_427.0.png, _429.0.png, _431.0.png and 5 more, column-mean profile of rows 1030-1032 over x 250-525, plus right-edge tracking over band y1029-1047 (threshold: >35% of the band's rows above luminance 45)`
- **Build:** web v0.717
- **Lane impact:** L7 ui-hud: strikes the 'fill length changes' evidence from ui-hud/in-combat-hud-is-three-bars. The bar IS a meter, but only BattleUI.as:261 proves it. THE FRAME WINS over the packet's measurement.

### `[[ui-hud/the-stance-label-is-grey-not-yellow-the-frame-wins]]` — UPHELD [A1] (2 critics)

THE FRAME WINS over the measurement docs. SYNTHESIS.md:45 and the B-11, B-24 and A-16 segment notes all describe the in-combat stance label as YELLOW. Measured off the frame, the label's bright pixels average #B3AA9C — a neutral light grey consistent with §1t113s0§.as:111 `<font color='#BBBBBB'>` — while the '150% DAMAGE' buff line directly beneath it averages #EDBD1F. The study docs read the buff line's colour onto the label above it. White HP digits in the same crop measure #DCE7DE, so the label is demonstrably darker and un-tinted.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png — pixel census over crops (260,1025)-(520,1048) label, (260,1050)-(520,1075) buff line, (300,975)-(420,1000) HP digits`
- **Build:** web v0.717
- **KILLS this line:** "Stance lock in combat: the label swaps to "CANNOT CHANGE STANCE""
- **Lane impact:** L8 ui-hud: palette the label grey #BBBBBB, not yellow. Corrects SYNTHESIS.md:45 and three segment docs.

### `[[ui-hud/three-slots-on-screen]]` — UPHELD [A1] (2 critics)

A frame confirms exactly three skill slots on the bottom-right HUD, holding an empty tile, a dimmed gold fist (Chi Punch on cooldown) and a gold up-arrow — matching the payload's base-3 slot count with no conflict to adjudicate.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_431.0.png — crop (1380, 900) -> (1920, 1080) of the 1920x1080 frame, Lanczos-upscaled 3x to 1620x540`
- **Lane impact:** L8 ui-hud — grounds the slot-count claim in the primary reference. The fist is skill 1042 Chi Punch ('Focuses Chi into your fist for a deadly punch') and the up-arrow is skill 1003 Jump per the slot claim; frame and payload agree.

### `[[ui-hud/web-android-cooldown-divergence]]` — UPHELD [A2] (2 critics)

The web build v0.717 and the Android build v0.682 diverge inside SkillSlotButton.update(): Android truncates the cooldown sweep with int(), the web rounds up with Math.ceil(), so the two builds show a different shade frame for essentially every intermediate cooldown value.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5184s0§.as:226 vs reference/decompiled/shs3_android/scripts/SkillSlotButton.as:220`
- **Lane impact:** Cross-lane guard rail. It disproves the survey's licence sentence ('retires the android parity not established caveat for the combat HUD') by counterexample INSIDE the same class, and it establishes the working method for every future claim: shs3_payload/scripts/ is obfuscated but numeric literals and public member names survive, so any constant can be confirmed against the real web build by grepping for the literal. I did it four times (DialogBox -> §1t5474s0§, ScreenTransition -> §1t6497s0§, SkillSlotButton -> §1t5184s0§, GameEngine 690 gate).

### `[[ui-hud/web-battleui-diverges-from-android]]` — UPHELD [A2] (2 critics)

The web v0.717 BattleUI is a strictly larger class than the Android v0.682 one -- 1,344 lines vs 939 -- and calls eleven string ids that do not exist anywhere in the Android string table, so combat-HUD parity between the two builds is disproven, not merely unestablished.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:169-171,1269-1316 vs reference/decompiled/shs3_android/scripts/BattleUI.as (wc -l: 1344 vs 939)`
- **Lane impact:** Cross-lane, and it is the counter to this lane's own claim 7. Any lane that resolved a web-build string id through the Android blob must first check the id EXISTS there -- 11 do not in this one class. It also means the ui-hud lane's Android-sourced HUD behaviour is a lower bound on the web build's, not a match.

### `[[ui-hud/web-build-confirms-resname]]` — UPHELD [A2] (2 critics)

The WEB build proves the resname keying by itself, so the string-id correction carries no Android-build caveat at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/shs3_fla/PauseScreen_51.as:26`
- **Lane impact:** Cross-lane. Every lane that must re-derive a Mobile_Lang_EN id against strings.json resnames can now do so WITHOUT the 'Android v0.682 vs web v0.717 parity not established' caveat the surveyor attached — the web build performs the same lookup on the same key.

### `[[ui-hud/web-cooldown-uses-ceil]]` — UPHELD [A2] (2 critics)

The web v0.717 skill-cooldown quantiser is Math.ceil, not int, so the formula Pass 2 published as this lane's answer is off by one shade frame for every non-exact twelfth of the sweep.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5184s0§.as:226 (and :6, :26, :152 identifying the class)`
- **Lane impact:** ui-hud L-lane and skills-meters: the 12-step / 13th-disabled-frame structure survives, but the arithmetic a rebuild copies must be ceil. Also the general lesson for every lane: shs3_payload/ has the same classes and must be checked before an Android constant is published.

### `[[ui-hud/web-hud-copy-absent-from-android-table]]` — UPHELD [A1] (1 critic)

The web v0.717 combat HUD displays a stance-lock plaque reading CANNOT CHANGE STANCE and a gold buff readout reading 150% DAMAGE, and neither string exists anywhere in the Android v0.682 string table -- so Android/web parity is established for HUD geometry but REFUTED for HUD copy and state.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png, crop (150,995)-(600,1080) upscaled 4x (and (120,900)-(560,1020) 4x for the meters), adjudicating reference/extracted/android/118_Mobile_Lang_EN.bin`
- **Lane impact:** ui-hud lane, and cross-lane. Directly refutes claim 7's 'retires the android parity not established caveat for the combat HUD': S0-3's caveat stands for UI copy exactly as S0-3 warned. Also adds two HUD elements missing from the ledger's ui-hud Ready bullet -- a persistent stance-lock status plaque and an active-buff readout beneath the meters. THE FRAME WINS over the Android string table.

### `[[ui-hud/web-hud-status-lines-absent-from-android]]` — UPHELD [A1] (1 critic)

The web combat HUD carries two status lines under the HP/Chi bars -- a brown CANNOT CHANGE STANCE plaque and a yellow 150% DAMAGE line -- that have no counterpart in any Android artifact, so the frame overrules the Android decompile on combat-HUD parity.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png, crop (0,910)-(700,1080) upscaled 2x`
- **Lane impact:** ui-hud lane: refutes claim 7's 'retires the android parity not established caveat for the combat HUD'. THE MEASUREMENT DOC (the Android decompile) AND THE FRAME DISAGREE, AND THE FRAME WINS. Also adds a HUD element the ledger's Ready bullet list omits: a buff/status readout strip.

### `[[ui-hud/web-payload-confirms-android-claims]]` — UPHELD [A2] (2 critics)

Five of the seven Android-sourced Pass 2 claims are confirmed line-for-line in the web v0.717 payload, so the S0-3 Android caveat can be retired for them — and the unlock was already in this lane's own Pass 1 claim 18.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t6497s0§.as:78-88,102-103,111 · §1t5474s0§.as:46,49,105,147 · §1t113s0§.as:160,170 · §1t6407s0§.as:37-39 · §1t5186s0§.as:26 · §1t5533s0§.as:23`
- **Lane impact:** Cross-lane: shs3_payload/ carries the same classes under obfuscated names and is readable by Pass 1 claim 18's rosetta method. Any lane about to publish an Android constant should check the web analogue first — two of this lane's seven borrowings were already wrong (ceil-vs-int, symbol ids).

### `[[ui-hud/web-payload-is-directly-citable]]` — UPHELD [A2] (2 critics)

The web v0.717 decompile at reference/decompiled/shs3_payload/scripts/ has obfuscated class names but intact numeric literals and public member names, so a grep for a distinctive constant identifies any HUD class and lets this lane cite the WEB build directly instead of inferring parity from Android.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:170-171 (BattleUI), §1t5474s0§.as:46,49,53,105,136,147 (DialogBox), §1t6497s0§.as:89,113 (ScreenTransition), §1t1540s0§.as:271-273 (GameEngine.resizeHandler), §1t5186s0§.as:26 (WinUI), §1t1523s0§.as:104,106 (StatsManager)`
- **Lane impact:** Cross-lane. Pass 1 claim 18 found the Rosetta METHOD but nobody applied it to the HUD; Pass 2 then built its headline parity argument (claim ui-hud/slot-geometry-frame-validated) on a frame inference that was never needed. Before any lane ships an Android-only number it should grep shs3_payload/scripts/ for the literal - a one-command check that just caught a real divergence (see web-vs-android-cooldown-rounding).

### `[[ui-hud/web-payload-logic-is-on-disk]]` — UPHELD [A2] (2 critics)

The web v0.717 payload's ActionScript is on disk as 612 identifier-mangled classes, so every Android-sourced constant in every lane can be checked against the web build directly -- the 'Android parity not established' caveat is dischargeable by grep, not by video re-passes.

- **Cite:** `reference/decompiled/shs3_payload/scripts/ (612 files matching §1t*s0§.as) — verified instances: §1t113s0§.as:170-171, §1t5474s0§.as:46,49,53,57,86,105,107,136,147, §1t6497s0§.as:89,100-103,113`
- **Lane impact:** Cross-lane tooling. Every lane currently hedging with 'this is the ANDROID build, clientVersion 0.682, parity not established' has a cheap, first-hand way to settle it: grep the mangled tree for the literal. It also means claim 7's video-measurement route to parity was unnecessary, and — per the sibling finding on §1t113s0§ — that the answer is not uniformly 'parity holds': the shared classes match exactly, but web BattleUI has 405 extra lines the Android build does not.

### `[[ui-hud/web-resize-handler-names-800x480-and-690-is-the-friend-bar-variant]]` — UPHELD [A2] (2 critics)

The WEB v0.717 build carries the whole stage-fit model on disk, and it names all three numbers the ui-hud lane has been arguing about. 1t1540s0.as:271-273 declares originalWidth 800, originalHeight 480, originalHeightWithBar 690 - so the 690 in the payload SWF header is the FRIEND-BAR stage variant, taken only when the browser viewport aspect is <= 800/690 = 1.1594 (:277), and the game canvas is 800 x 480. :295-307 then picks fit-width (offsetX 0, letterbars) or fit-height (offsetX = (stageWidth - 800*scale)/2, pillarbars) and writes scale/offsetX/offsetY/fitWidth into 1t1523s0.1t9358s0/9359/9360/9361, which 1t113s0.as:375 consumes to convert mouse coords into game space. This CONFIRMS REBUILD_READINESS.md:117 and :171 from a web artifact, kills the 800x690 overturn, and supplies the mechanism the aspect-ratio blocker asked for. The only thing still per-video is the BRANCH, since the viewport aspect is not recorded anywhere.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:269-314 + reference/decompiled/shs3_payload/scripts/§1t113s0§.as:375 + reference/decompiled/shs3_android/scripts/GameEngine.as:267-312`
- **Build:** web v0.717 (android GameEngine.as:267-312 is the identical twin)
- **KILLS this line:** "Aspect-ratio truth - native canvas is 800x480 (5:3)"
- **Lane impact:** L8 ui-hud: RR:117/:171/:235-(1) are VINDICATED, not overturned, and the close-path 'read stage.stageWidth in a build' is discharged from source. The per-video calibration finding 9 prescribes is still needed because the branch depends on the viewport.

### `[[ui-hud/web-symbol-ids-differ]]` — UPHELD [A2] (1 critic)

Every HUD assets.swf symbol id in this lane's residual is an Android id; the web v0.717 build uses different ids, so the stated JPEXS close-path would export the wrong symbols.

- **Cite:** `reference/decompiled/shs3_payload/scripts/{§1t113s0§,§1t6407s0§,§1t5474s0§,§1t5184s0§,§1t5186s0§,§1t5533s0§,§1t6497s0§}.as:6 vs reference/decompiled/shs3_android/scripts/{BattleUI,OptionsUI,DialogBox,SkillSlotButton,WinUI,DuelIntroBar,ScreenTransition}.as`
- **Lane impact:** ui-hud: makes P13's residual actionable against the right build. The frames are web v0.717, so a symbol export that is meant to be graded against a frame must use the web ids.

### `[[ui-hud/web-vs-android-cooldown-rounding]]` — UPHELD [A2] (2 critics)

The web v0.717 build rounds the skill-slot cooldown sweep with Math.ceil while the android v0.682 build truncates with int, so the shipped web sweep is 13 shade steps that reuse the disabled frame, not 12 steps with a 13th reserved frame.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5184s0§.as:226 vs reference/decompiled/shs3_android/scripts/SkillSlotButton.as:220`
- **Lane impact:** ui-hud: refutes claim ui-hud/skill-cooldown-12-step-quantised as written and destroys the 'retires the android parity caveat for the combat HUD' conclusion in claim ui-hud/slot-geometry-frame-validated. Cross-lane (skills-meters, combat-core): this is the first MEASURED counter-example to android/web parity, so Stage-0 finding S0-3's caveat must stay live and every Android-sourced tuning number needs a build label.

### `[[uistrings-payload/duel-replay-is-a-first-class-feature]]` — UPHELD [A2] (1 critic)

Duels were recorded server-side and shareable by public URL in two addressing forms — watch?id= and watch?name= — backed by savereplay.php and getreplay.php, a whole feature the ledger's meta-social entry does not list.

- **Cite:** `reference/extracted/payload.xml:119347`
- **Build:** web v0.717
- **Lane impact:** meta-social + §6 server topology. The banked ui-hud sweep already found the savereplaybutton (string 483 'Save Replay'); this supplies the transport and the public URL shape it fed. getreplay.php :119350; http://www.strawhatsamuraiduels.com/watch?id= :121368; authored fields cid 3577/3580 at :2640123/:2640172 both read watch?name=orochi; shareDuelTVOnWall :119387.

### `[[uistrings-payload/fight-wordmark-is-the-live-duel-intro-field]]` — UPHELD [A2] (2 critics)

The Olivia Brush 80 pt 'FIGHT!' TextField (characterID 3539) is placed as instance `colorText` inside sprite 3540 and is written at runtime with getString(104) — whose value is also 'FIGHT!' — so the word mark's font AND its live render path are both held, and the authored words are identical to the shipped words.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5533s0§.as:72`
- **Build:** web v0.717 (android twin: shs3_android/scripts/DuelIntroBar.as:69)
- **Lane impact:** art-anim-audio-feel + ui-hud — STRENGTHENS nine-embedded-fonts-not-two from a static tag fact to a live render path: the field that carries Olivia Brush at fontHeight 1600 twips really is the duel-intro word mark, so the display face is confirmed for the screen it appears on. It is simultaneously the COUNTEREXAMPLE to uistrings-is-design-time-not-shipped's 807-wide universal — here strings.json["104"] = 'FIGHT!' = the authored initialText, i.e. an authored field whose words ARE the shipped words. Ties to the banked ui-hud intro-bar timing (action word at frame 69, 2 042 ms).

### `[[web-parity/web-payload-carries-the-same-resizehandler]]` — UPHELD [A2] (2 critics)

The build-parity hole on the whole canvas/letterbox contract is CLOSED from the web side. reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:269-320 is the web v0.717 payload's own resize handler and it declares :271 _loc2_=800, :272 _loc3_=480, :273 _loc4_=690, then the identical '<=' with-bar aspect test, the identical fit-width/fit-height branch with the same centring offsets, and publishes the same six stage values that InputManager reads back. 800x480 base + a 210px bar is a WEB fact, not an Android inference.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:269-320`
- **Build:** web v0.717
- **Lane impact:** L-ui-hud / L-render: HUD x-fraction re-basing on 800x480 is now legitimate for the web build. Kills the 'every canvas constant is Mobile-only' caveat.

---

## What is NOT here, and why

Refuted claims and claims no critic ever judged (§0: an unjudged claim is a LEAD)
are excluded by `buildLedgerPackets.py`. If you believe something is missing, say so
in your return — do not reconstruct it from memory, and do not cite it.
