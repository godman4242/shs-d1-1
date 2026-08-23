# L0 — salvaged claim set (raw surveyor output)

> **UNVERIFIED.** These are surveyor claims. A claim is only CONFIRMED
> once blind artifact-citing critics have judged it (GAUNTLET.md §0/§3.3).
> Banked: 0 surveys · 2 critic reviews · 6 claims · 47 verdicts.

## unassigned — re-scored ?

### `nf-judge/carry-weight-exemption-split-is-nine-seven-and-obj-hut-48-is-a-seventh-unexempt-site` — HELD [A2]

The android carry-weight guard split is NINE exempt / SEVEN unexempt, not eight/eight. My own grep -rn 'findWeight() > StatsManager.getCarryingWeight()' over reference/decompiled/shs3_android/scripts returns 16 hits in 11 files. Nine carry the !GameEngine.isPvPRoomMode() prefix: Obj_DragonDancePath.as:275 and :295, Obj_PathBush.as:62 and :110, Obj_HiddenTemple.as:187 and :207, Obj_DirectionSign.as:124 and :159, Obj_TownSign.as:44. Seven do not: Obj_Hut.as:48 and :70, InteractUI.as:1730, NodeUI.as:379, InventoryUI.as:440, CraftingUI.as:233, BankUI.as:348. Obj_Hut.as:48 is a seventh unexempted site that no finding in this packet names - a second hut call site, gated 'findWeight() > getCarryingWeight() || getStat(STAT_AP) <= 0'.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_Hut.as:48,70; Obj_DragonDancePath.as:275,295; Obj_PathBush.as:62,110; Obj_HiddenTemple.as:187,207; Obj_DirectionSign.as:124,159; Obj_TownSign.as:44; InteractUI.as:1730; NodeUI.as:379; InventoryUI.as:440; CraftingUI.as:233; BankUI.as:348`
- **Quote:** Obj_Hut.as:48 `if(StatsManager.findWeight() > StatsManager.getCarryingWeight() || StatsManager.getStat(StatsManager.STAT_AP) <= 0)` - no isPvPRoomMode test, and not cited by any finding in this packet.
- **Lane impact:** items-equipment + world-exploration: the exempt/unexempt tally that goes into the ledger is 9/7, and the unexempt list must include Obj_Hut.as:48.

### `nf-judge/duel-hud-never-prints-the-word-CHI` — HELD [A1]

The duel HUD prints NO textual bar labels at all - the 'CHI' label seen in this lane's frames comes from the PLAYER STATS screen, a different widget. BattleUI.updateChi writes only the numeral pair ('chitext.text = chi + "/" + maxchi') and updateHp the same for HP; there is no label TextField in the pair. Confirmed on film: reference/frames/zFtCaTO0_1M/seg-11/frames/frame_0020.jpg, my crop (0,380)-(560,576) x3 LANCZOS, shows the duel HUD as a green bar reading '16/20' over a blue bar reading '15/15' with 'CANNOT CHANGE STANCE' beneath - and no word CHI anywhere. The labelled ladder (HP / CHI / AP diamonds) appears only on the stats screen, e.g. reference/frames/session11/stance-reach/B_t850.600_PLAYER-screen_HP20-CHI31-AP32of35_ATK22_DEF19_SPD13.png.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-11/frames/frame_0020.jpg (own crop (0,380)-(560,576) x3 LANCZOS) + reference/decompiled/shs3_android/scripts/BattleUI.as:252-257`
- **Quote:** ON SCREEN: green bar '16/20', blue bar '15/15', caption 'CANNOT CHANGE STANCE' - no 'CHI' text. CODE: BattleUI.as:254 `this.chitext.text = chi + "/" + maxchi;` :255 `this.chitextshadow.text = chi + "/" + maxchi;` :256 `this.chibar.bar.scaleX = chi / maxchi;`
- **Lane impact:** ui-hud: a rebuild must NOT draw 'CHI'/'HP' text on the duel bars; the identification of the blue bar as Chi rests on the class fields and on the stats screen, not on an in-duel label.

### `nf-judge/name-greps-over-the-web-payload-are-not-evidence-of-absence` — HELD [A2]

A zero-hit grep for a SOURCE-LEVEL identifier over reference/decompiled/shs3_payload is not evidence that the web build lacks the feature, because the web payload's class, method and field names are obfuscated to §1tNNNNs0§ forms. Proven in this packet twice over: android's getSellAmt is §1t546s0§ in the web build, android Item.as's modifier constants are §1t8734s0§..§1t8741s0§, and android NodeGenerator.isNoChangeTown is §1t70s0§.§1t1140s0§. Web-side absence must be argued from a structural signature (imports + literal constants + call shape), the method actually used to pin §1t1712s0§ and §1t8702s0§ in this same packet - never from a name grep.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1977 (= android Item.as:1582 getSellAmt); §1t70s0§.as:407-415 (= android NodeGenerator.as:393-400 isNoChangeTown); §1t17s0§.as:18-22 (= android Item.as:8-16 modifier ids)`
- **Quote:** web §1t17s0§.as:1977 `public function §1t546s0§() : int`  ||  android Item.as:1582 `public function getSellAmt() : int` - same function, no shared token to grep for.
- **Lane impact:** Gauntlet-wide method rule: 'ZERO hits under shs3_payload' may be quoted as the state of the evidence, never as a finding that the web build lacks the thing.

### `nf-judge/resizehandler-statsmanager-writes-are-307-312` — HELD [A2]

GameEngine.resizeHandler's StatsManager writes run :307-312, not :306-311, and there are SIX of them. :306 is the closing brace of the fit branch; :307 stageScale, :308 stageOffsetX, :309 stageOffsetY, :310 stageFitWidth, :311 stageBaseWidth, :312 stageBaseHeight. Any ledger row transcribing the resize handler's output surface from ':306-311' drops stageBaseHeight.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:306-312`
- **Quote:** :307 `StatsManager.stageScale = newScale;` :308 `StatsManager.stageOffsetX = offsetX;` :309 `StatsManager.stageOffsetY = offsetY;` :310 `StatsManager.stageFitWidth = fitWidth;` :311 `StatsManager.stageBaseWidth = originalWidth;` :312 `StatsManager.stageBaseHeight = originalHeight;`
- **Lane impact:** ui-hud cite hygiene: six writes at :307-312.

### `nf-judge/resource-decrypt-key-is-filename-charcode-1-per-resource` — HELD [A2]

The XOR key for the five obfuscated Android resource blobs is NOT one constant - it is the SECOND CHARACTER of the resource's filename, so every blob has its own key. ResourceManager.as:186 passes 'resourceFileNameArray[num].charCodeAt(1)' into decryptByteArray, and :41 lists the five filenames. That yields shs3resource.swf -> 'h' = 104, musicresource.swf -> 'u' = 117, soundresource.swf -> 'o' = 111, imageresource.swf -> 'm' = 109, bgresource.swf -> 'g' = 103. This reconciles the two keys the Stage-0 brief already carries (C1's 109 from Mobile.as:352 and C3's 111 for the sound blob) and predicts the other three. Also note decryptByteArray only touches bytes 3..255 (swapping every i%11==0 byte with i+256), which is why the files still begin with a readable 'CWS' magic.

- **Cite:** `reference/decompiled/shs3_android/scripts/ResourceManager.as:41,186,200-214; verified by decrypting reference/extracted/android/115_Mobile_SHS3Resource.bin at key 104 -> valid CWS v17 SWF, 1,040,849 bytes inflated, 1,912 SymbolClass entries`
- **Quote:** ResourceManager.as:41 `internal static var resourceFileNameArray:Array = ["shs3resource.swf","musicresource.swf","soundresource.swf","imageresource.swf","bgresource.swf"];` :186 `ba = decryptByteArray(ba,resourceFileNameArray[num].charCodeAt(1));` :205 `for(var i:int = 3; i < 256; i++)` :207 `if(i % 11 == 0)` :213 `ba[i] ^= key;`
- **Lane impact:** Cross-lane extraction rule (art, audio, items): keys are 104/117/111/109/103 by resource, derived not guessed - anyone opening the remaining blobs can stop brute-forcing.

### `nf-judge/web-battleui-carries-the-same-slot-constants-760-minus-60i-and-450` — HELD [A2]

The skill-slot constants used as the code anchor for the frame-to-stage transform are NOT android-only, which removes the build-parity objection to testing them against a web-build frame. The WEB BattleUI, reference/decompiled/shs3_payload/scripts/§1t113s0§.as, builds its slot strip with the identical arithmetic at :170-171: x = 760 - i*60 and y = 450, matching android BattleUI.as:133-134 exactly. Slot i=2 therefore sits at game (640,450) in v0.717 as well as v0.682.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:170-171 vs reference/decompiled/shs3_android/scripts/BattleUI.as:133-134`
- **Quote:** web §1t113s0§.as:170 `_loc1_.x = 760 - _loc2_ * 60;` :171 `_loc1_.y = 450;`  ||  android BattleUI.as:133 `skillSlotButton.x = 760 - i * 60;` :134 `skillSlotButton.y = 450;`
- **Lane impact:** ui-hud: y = 450 is a web-build constant, so the frame-to-stage transform measured on a v0.717 frame against it is not a cross-build import.
