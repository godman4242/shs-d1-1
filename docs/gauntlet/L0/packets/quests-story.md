# LEDGER PACKET — `quests-story`

> **This is the ONLY evidence you may cite.** Every id below was JUDGED by blind
> artifact-citing critics and SURVIVED (GAUNTLET.md §0). Cite one inline as
> `[[id]]`, exactly as written. Gate **L0-B** resolves every reference against the
> pooled verdicts and goes RED on anything unjudged, refuted, or invented — so a
> claim id you do not see here cannot enter the ledger, and neither can a
> plausible-looking one you compose yourself.

**10 surviving overturns · 0 true-but-rejected · 34 corroborating.**

---

## The ledger text you are rewriting, verbatim

```markdown
| **quests-story** | 42 | quest-log model, archetypes, reward tuples, Season-1 step chains | **verbatim dialogue**; Ep4–12 (10 chapters); per-quest trigger types; choice consequence |
### quests-story — 42
- **Ready:** quest-log UI + data model; archetype taxonomy (story/normal/trade + bounty/escort/gather/timed); turn-in modal chain; 9 reward tuples; full Season-1 (Prologue–Ep3) step chains + haikus; character roster + roles; plot spine; LEAVE AREA vs FREE RESPAWN (closed); the "two Yasukas" = one person (closed).
- **Blockers:** ① **verbatim dialogue — captured NOWHERE** (study policy + no wiki transcripts) — *transcribe from a preserved build, IF it loads offline; else original-author to the summaries.* ② **Ep4–12 + epilogue** (10 undocumented chapters). ③ per-quest trigger types + coords + rewards (sampled, not tabled). ④ are player choices consequential?
- **Surface:** the +3-stat and "player named Satoshi" contradictions are already resolvable; QUEST_LOG_CAP = 7 (1 story + 6 side).
```

---

## ① Surviving overturns — these REWRITE the lines they name

A critic opened the sentence, read it in context, and ruled that it falls.

### `[[frames/choice-text-diverges-from-payload]]` — UPHELD [A1] (2 critics)

The payload/v0.717 script divergence already found for narration reaches the branching layer: a player CHOICE rendered in v0.717 is worded differently from the corresponding questdata <choice> row, so <goto>-keyed option labels cannot be treated as v0.717-final either.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0023.jpg (crop 0,460-1024,576 @4x) vs reference/extracted/questdata.xml:153`
- **Build:** web v0.717 frame vs the extracted questdata (v0.706-era revision)
- **KILLS this line:** "① verbatim dialogue — captured NOWHERE (study policy + no wiki transcripts)"
- **Lane impact:** quests-story: strengthens questdata/Q-02 from the narration layer into the choice/routing layer

### `[[questdata/dialogue-is-a-branching-VM]]` — UPHELD [A2] (2 critics)

questdata.xml is not a linear script - it is a branching dialogue interpreter, and no claim in the packet mentions any of its control flow. 715 <goto> nodes jump over 163 <label> targets (label1 x87, label2 x38, label3 x25, label4 x10, label5 x2, label6 x1) or to numeric dialogue ids. 196 <option> blocks hold 471 <choice> elements, each a player line plus its own <goto>. 386 <outcome> blocks carry <id>, <set> (194 quest-variable writes; domain includes 0,1,2,5,12,15,27,1000), <modify> (74; 69x'0', 3x'1', 1x'5', 1x'-1') and <end> (386). Also unmentioned: 62 <condition> step gates, 54 <startin>, 14 <teleportnode> + 14 <teleportposx> forced world-graph jumps, 5 empty <ending> terminators, 32 <completedquest> prerequisites, 9 <has>/<comp> inventory gates.

- **Cite:** `reference/extracted/questdata.xml:146 (<option>), :148 and :152 (<choice>), :150 and :154 (<goto>), :161 (<label>label2</label>), :164-167 (<outcome><id>111</id><set>5</set><end>0</end>), :178 (<modify>0</modify>), :185 (<goto>label2</goto>)`
- **Build:** web v0.717 (source is reference/extracted/questdata.xml)
- **Lane impact:** L9 quests-story: any recreation that ingests questdata as a flat script will render the wrong story. The engine needs a label/goto interpreter, a choice UI, and a quest-variable store with set/modify semantics. Nothing in the 12 ledger systems models this.

### `[[quests-story/ally-waves-unlisted-system]]` — UPHELD [A2] (6 critics)

An entire subsystem is missing from the §4 block: scripted ALLIES in quest waves — 70 <wave><friend> entries resolving to Fumio x16, Yuudai x15, Satoshi x14, Old Guard x6, Soldier x8, Mitsuo/Hachimaru/Shou x3 each, Hiroshi, Chikako; 59 of 70 carry <fatal>0</fatal> (allies knock down, do not die). The same table gives 151 <enemy> rows (lvl 2-35, qty 1-10, spawn x -400..2000) and 4 <endless> waves.

- **Cite:** `reference/extracted/questdata.xml — 70 <wave><friend> / 151 <wave><enemy> / 2 <wave><neutral>, ids resolved via docs/gauntlet/L0/index/resolved_names.json`
- **KILLS this line:** "- Ready: quest-log UI + data model; archetype taxonomy (story/normal/trade + bounty/escort/gather/timed); turn-in modal chain; 9 reward tuples; full Season-1 (Prologue–Ep3) step chains + haikus; character roster + roles; plot spine; LEAVE AREA vs FREE RESPAWN (closed); the "two Yasukas" = one person (closed)."
- **Lane impact:** L1 CAMPAIGN must spawn allies; L4 ENEMIES+AI gains a per-quest encounter table (151 rows with level and spawn x) and an ally-AI requirement its §4 block never mentions.

### `[[quests-story/choices-are-consequential]]` — UPHELD [A2] (2 critics)

Player choices ARE consequential: consequence is positional, not nested — <goto> lands the display walker in a branch that carries its own <outcome> nodes, and 54 of 195 multi-choice options reach divergent outcomes.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/CutsceneManager.as:203-206 + XMLQuestStep.as:158-212 + reference/extracted/questdata.xml:971, :814, :1851, :2410`
- **KILLS this line:** "④ are player choices consequential?"
- **Lane impact:** L1 CAMPAIGN — REVERSES the surveyor's lane impact. L1 MUST build the outcome/consequence system: a positional display walker with index-based <goto>, per-branch outcome application, and divergent end codes (1=leaveOK starts the fight, -1=leaveCancel aborts it). 54 options break without it.

### `[[quests-story/choices-are-consequential-via-goto]]` — UPHELD [A2] (2 critics)

Player choices ARE consequential: 55 of the 196 shipped <option> blocks have choices whose branches write different StatsManager state or terminate the scene differently, even though zero choices carry a <outcome> child.

- **Cite:** `reference/extracted/questdata.xml:814-882 (worked case) + simulation of all 196 options under XMLQuestStep.getXMLIntroList / CutsceneManager.display semantics`
- **KILLS this line:** "④ are player choices consequential?"
- **Lane impact:** L1 CAMPAIGN — the answer to blocker ④ is YES, delivered positionally rather than declaratively. Building 'a flat jump table, not a consequence system' and dropping L1's runtime risk (as quests-story/choices-not-consequential advises) would produce wrong save state.

### `[[quests-story/cutscene-director-held]]` — UPHELD [A2] (6 critics)

The cutscene director is fully recovered: 55 <cutscene> blocks, 399 timed commands, and a CLOSED 15-verb instruction set with time (0-8 s), actor handle, param and x (-200..1600) — including 23 `sound` cue points and 7+7 addemitter/removeemitter particle calls.

- **Cite:** `reference/extracted/questdata.xml:27414-27420 (+ measured verb histogram over all 399 <data> commands)`
- **KILLS this line:** "- Ready: quest-log UI + data model; archetype taxonomy (story/normal/trade + bounty/escort/gather/timed); turn-in modal chain; 9 reward tuples; full Season-1 (Prologue–Ep3) step chains + haikus; character roster + roles; plot spine; LEAVE AREA vs FREE RESPAWN (closed); the "two Yasukas" = one person (closed)."
- **Lane impact:** L1 CAMPAIGN — the cutscene director is a 15-opcode interpreter, fully specified. L7 AUDIO gains 23 exact cue points; L6 ART gains a named particle-emitter requirement its blocker list calls uncatalogued.

### `[[quests-story/maxquests-cap-is-real]]` — UPHELD [A2] (2 critics)

The quest-log cap is a real accept-time constant, not a UI row count: MAXQUESTS = 7 refuses quest acceptance when the log is full, while story progression bypasses it.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:164, :1252-1273, :1303-1323, :1276-1301 (identical line numbers in reference/decompiled/shs3_android/scripts/StatsManager.as)`
- **KILLS this line:** "QUESTLOGCAP = 7 (1 story + 6 side)."
- **Lane impact:** L1 CAMPAIGN + L8 UI — ship BOTH: the pooled 7-quest acceptance cap (addActiveQuests returns false when full) AND the 7-row scroller (QuestLogUI.as:88-96, x=60, y=73+55i). Only the ledger's '(1 story + 6 side)' gloss is wrong: there is no reserved story slot; setActiveQuest pushes story steps unconditionally.

### `[[quests-story/questitem-archetype-templates]]` — UPHELD [A2] (2 critics)

The ledger's trade/bounty/escort/gather archetypes are not invented — they are a second, real enum: QuestItem holds 17 QUEST_* procgen templates and 20 REASON_* motives, orthogonal to QuestType's 9 values.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/QuestItem.as:26-58 (templates) and :60-98 (reasons)`
- **KILLS this line:** "archetype taxonomy (story/normal/trade + bounty/escort/gather/timed)"
- **Lane impact:** L1 CAMPAIGN — side quests need a GENERATOR port (17 templates x 20 reasons composed at runtime by QuestGenerator.as, which writes only questData.type = 3), not a table port and not the deletion the surveyor recommends. Runtime type rewrites live in QuestEngine.as:736/752/756/760, not in QuestGenerator.

### `[[quests-story/reward-and-roster-undercount]]` — UPHELD [A2] (6 critics)

Two 'Ready' bullets under-claim badly: there are 77 <reward> blocks (69 <exp> + 18 <loot>), not '9 reward tuples'; and the character roster is 68 distinct <img> portrait tokens including emotional variants (mitsuo_dying, yasuka_hurt, jinbei_angry, chikako_blush, magoichi_masked, yuudai_before), i.e. a complete story-mode portrait manifest.

- **Cite:** `reference/extracted/questdata.xml — measured: 77 <reward>, 69 <exp> {100,200,250,290,500,600,750,1000,2000,3000}, 18 <loot>, 68 distinct <img>`
- **KILLS this line:** "turn-in modal chain; 9 reward tuples; full Season-1 (Prologue–Ep3) step chains + haikus; character roster + roles"
- **Lane impact:** L1 CAMPAIGN gets the exp/loot table; L6 ART gets a closed 68-asset portrait manifest to draw against.

### `[[quests-story/step-action-enum-closed]]` — UPHELD [A2] (2 critics)

The <step><action> enum is held: GameEngine defines a 15-value ACTION_* namespace, and the campaign's measured domain decodes to NOTHING x169, FIGHT x37, DUEL x5, SURVIVECLEANUP x3, SURVIVE x1.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/GameEngine.as:81-109; namespace confirmed at QuestEngine.as:1214 and :1239/:1243; read into the step at QuestAction.as:49`
- **KILLS this line:** "③ per-quest trigger types + coords + rewards (sampled, not tabled)."
- **Lane impact:** L1 CAMPAIGN — the quest state machine's step-dispatch switch is fully specified, closing the surveyor's STILL_UNHELD Q-14. Ten unused members (ASSASSINATE, ESCORT, REACHMARKER, HARVEST, SURVIVALMODE, WARROOMBATTLE, PLAYBACK, PVPROOM, CUTSCENE, ADVENTURE) are inputs for L9 WORLD and L11.

## ② TRUE, but the line SURVIVES — do NOT delete anything for these

The finding held up; the overturn did not. 36% of claimed overturns were rejected this way. Bank the knowledge, keep the sentence.

*(none)*

## ③ Corroborating — new knowledge, no line deleted

These add or sharpen; they do not contradict.

### `[[NF-shira-tancho-is-player-clan]]` — UPHELD [A2] (1 critic)

'Shira Tancho' is the PLAYER's own clan and is held 104 times in questdata.xml, with named members and a crane-feather heraldry — refuting the packet's claim that it is unsourced, and confirming rather than overturning the ledger's 'Shira Tancho story-only' line. Its Old Guard even has an NPC row.

- **Cite:** `reference/extracted/questdata.xml:514, :550, :560 and reference/extracted/npcdata.xml:2418`
- **Build:** web v0.717
- **KILLS this line:** "Ready: 4 clans (heraldry/masks/daimyo/capitals) + Shira Tancho story-only."
- **Lane impact:** L-quests-story + L-meta-social: the clan is fully sourced, with heraldry (crane feathers), an Old Guard NPC actor, and named members (Shinmen, Ito, Takahasi, Yuudai — Yuudai is npcdata id 168, ai 31 FriendlySpearElite at :3506).

### `[[android-blobs/dead-portrait-throws-it-does-not-fall-back]]` — UPHELD [A2] (1 critic)

The shipped `chikako_maked` reference does not degrade to a fallback — it crashes: getPortrait returns null for a missing definition and QuestDialogueUI immediately calls addChild on that null, which is an AS3 ArgumentError #2007, with the bust already hidden one line earlier.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/ResourceManager.as:294-297 + reference/decompiled/shs3_android_payload/scripts/QuestDialogueUI.as:69-71 + reference/extracted/android/116_Mobile_QuestData.bin:12460`
- **Build:** android v0.682
- **Lane impact:** L-quests-story + L10 ui-hud. CORRECTS the remediation advice in android-blobs/portraits-decrypted-and-one-dead-reference ('a 1:1 recreation should reproduce the fallback, not invent a portrait'). There is no fallback on the portrait!="" branch — the bust is hidden at :69 and addChild(null) throws at :71. A 1:1 recreation should either fix the typo to chikako_mask or reproduce a hard failure, and must not silently substitute portrait_noportrait, which the original never reaches here.

### `[[android-blobs/parallax-z-order-is-authored-not-code]]` — UPHELD [A2] (1 critic)

The five parallax planes are not composited by the loader at all — each layer is fetched by name as an existing child of ONE authored stageContent MovieClip, so the z-order that decides what occludes the fighter is baked into the BGResource symbol and is unrecoverable from any single frame.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/BG_Loader.as:182, :205, :225, :245, :257`
- **Build:** android v0.682
- **Lane impact:** L6 art-anim + method. This is the reason I refuted android-blobs/foreground-layer-occludes-the-fighters: no A1 frame can tell you whether an occluding band is ground_i or fg_i, because the code never decides — the FLA author did. Two ways to settle any such question, both cheap: measure the band's pixel displacement against the fighter's across a pan (gscroll=1 vs fgscroll=2), or decode the named children of the relevant BG_* symbol in the decrypted 120_Mobile_BGResource. It also tells a rebuilder that the 874 layer slots in bgdata are counts of pre-placed children, not a runtime spawn list.

### `[[android-blobs/portraits-decrypted-and-one-dead-reference]]` — UPHELD [A2] (2 critics)

The 66 dialogue portraits and 16 story cards are decrypted and enumerated — 51 of the 52 questdata-referenced portraits are present, the 52nd (chikako_maked) is a shipped authoring TYPO that resolves to nothing, and 12 unreferenced portraits form a clan-officer grid of 4 colours x 3 ranks.

- **Cite:** `reference/extracted/android/124_Mobile_ImageResource.bin (1,734,935 B; key 'm'=109 -> CWS v17, declared 1,908,237 B, inflates to 1,908,229 B; 85 exported symbols) cross-checked against the banked <dialogue><img> manifest in docs/gauntlet/L0/run2/claims.json`
- **Build:** android v0.682
- **Lane impact:** L-quests-story + L10 ui-hud + L0 meta-social. STRENGTHENS the banked quests-story/portraits-held-but-encrypted by discharging the 'encrypted' half and giving the exact manifest. NEW defect: `chikako_maked` is a dead reference in shipped questdata — ResourceManager.getPortrait resolves it to nothing at runtime, so a 1:1 recreation should reproduce the fallback, not invent a portrait. NEW content: the 12 clan-officer portraits are War-Room/clan art that appears in no dialogue and in no ledger.

### `[[android-blobs/web-payload-holds-zero-data-roots]]` — UPHELD [A2] (2 critics)

The web v0.717 payload contains ZERO of ten XML data roots (questdata, itemdata, skilldata, npcdata, nodedata, achievementdata, uidata, bgdata, premiumdata, mapdata) that the Android v0.682 payload carries one of each — so the Android blobs are the SOLE source for ten of the game's thirteen data roots and the S0-3 build caveat is not dischargeable for any of them.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf vs reference/decrypted/shs3_android_payload_decoded.swf (both CWS, zlib-inflated: 11,892,053 B vs 21,688,584 B)`
- **Build:** both
- **Lane impact:** Cross-cutting, hits all 12 lanes. Strengthens the banked quests-story/payload-provenance-is-android from 4 roots to 10, and re-derives it independently (root-tag census of both inflated payloads, not mtime ordering). Practical effect: every quest line, item row, skill row, NPC row, world node, achievement, UI menu, background definition and premium SKU in the L0 corpus is an Android v0.682 measurement with no web counterpart in existence to check it against.

### `[[bindata/item-colour-palette-11]]` — UPHELD [A2] (1 critic)

An eleven-entry exact-hue palette used for procedurally generated quest items, selected by rng.rand(11) and applied through ColorCode.changeColor. Present in three classes in the Android build and in the web build.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/QuestGenerator.as:38 · ItemGenerator.as:701 · Obj_PickableItemProcGen.as:57-60 + reference/decompiled/shs3_payload/scripts/§1t8608s0§.as:60`
- **Build:** both
- **Lane impact:** L-art: eleven exact OG hues, a preferred fidelity target. Scoped to procgen quest items, not to the fighter.

### `[[frames/jinbei-greeting-diverges-too]]` — UPHELD [A1] (2 critics)

A second, independent instance of the same divergence: the first NPC greeting of the Prologue is worded differently on screen than in the payload row for the same beat, speaker and portrait.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0021.jpg (crop 0,460-1024,576 @4x) vs reference/extracted/questdata.xml:128`
- **Build:** web v0.717 frame vs extracted questdata
- **Lane impact:** quests-story: raises confidence that the whole held script is a pre-v0.717 revision, not just one node

### `[[questdata/cutscene-say-lines-are-string-ids]]` — UPHELD [A2] (2 critics)

The claim that the campaign script is verbatim on disk needs one bounded qualifier: 16 cutscene spoken lines are NOT inline text. <action>say</action> carries <param>9000..9009</param> (16 uses, 10 distinct ids) which resolve through the string table, not through questdata. Nine of the ten resolve in the Android table; id 9000 does not resolve at all.

- **Cite:** `reference/extracted/questdata.xml:102, :108, :773, :779, :11732 joined to docs/gauntlet/L0/index/strings.json["9001"], ["9002"], ["9003"]`
- **Build:** web v0.717 questdata joined to android v0.682 string table
- **Lane impact:** L9 quests-story: bounds the verbatim-script claim precisely. 16 lines out of 3,307 live elsewhere; 15 of them are recovered here, 1 (id 9000) is genuinely missing from the Android table and is a real build-parity hole. Note 'Motoharah' in the recovered line is itself a generator output ('Moto'+'harah'), independently corroborating the place-name finding.

### `[[questdata/dialogue-carries-inline-html-markup]]` — UPHELD [A2] (2 critics)

Dialogue text is HTML-formatted, not plain text: it embeds <br/> line breaks (14) and <font color="..."> spans (2). Quest item names inside dialogue are highlighted in #b048f8, a purple. Under the 2026-07-24 owner-project ruling, exact OG hues are permitted, so this is directly usable as a UI token.

- **Cite:** `reference/extracted/questdata.xml:3898, :3899, :3901 (<br/>) and :3908, :4193 (<font color="#b048f8">Inokichi's club</font>)`
- **Build:** web v0.717
- **Lane impact:** L10 ui-hud / L9 quests-story: the dialogue box must be an HTML text field, not a plain label, and quest-item names render in #b048f8. Also fixes the bounty-board layout: reward text is a separate <br/>-delimited line ('Reward: 100 coins').

### `[[questdata/extracted-xml-is-verbatim-the-android-embed]]` — UPHELD [A3] (2 critics)

reference/extracted/questdata.xml is not merely 'android-provenanced by inference' — it is byte-for-byte the payload of reference/extracted/android/116_Mobile_QuestData.bin. The blob is 796,384 bytes and contains the 796,383-byte XML verbatim (one trailing byte difference). This is the single cleanest proof of the provenance claim and nobody in the packet gave it.

- **Cite:** `byte-compare of reference/extracted/questdata.xml (796,383 B) against reference/extracted/android/116_Mobile_QuestData.bin (796,384 B); both begin '<questdata>\n<quest>\n  <id>0</id>\n  <startin>0</startin>'`
- **Build:** android v0.682
- **Lane impact:** Hardens quests-story/payload-provenance-is-android from a size/absence argument to an identity argument. Every quest/dialogue measurement in this run is a v0.682 measurement and must carry that label.

### `[[quests-story/blank-choice-rows]]` — UPHELD [A2] (1 critic)

Four of the 471 <choice> rows carry no <text> at all, so the option UI must tolerate a blank row.

- **Cite:** `reference/extracted/questdata.xml — ElementTree path census: intro/option/choice 469 vs intro/option/choice/text 465; ending/option/choice 2 vs ending/option/choice/text 2`
- **Lane impact:** L8 UI — the quest option list must render a choice with an empty label (the Fighting/Mining Tutorial auto-options are among them) rather than assuming every row has text.

### `[[quests-story/choices-are-consequential-positionally]]` — UPHELD [A2] (2 critics)

Player choices ARE consequential: the engine applies consequence positionally, so a <goto> that lands past an <outcome> node changes persisted game state, and 12 shipped <option> blocks (86 under a looser test) have branches that write different stats.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLQuestStep.as:193-201 + CutsceneManager.as:80-102,202-205 + XMLQuestOutcome.as:50-90 + reference/extracted/questdata.xml quest id 0, step[8] <intro>`
- **KILLS this line:** "quests-story/choices-not-consequential: "Blocker (4) is ANSWERED and the answer is no ... all 471 are pure <goto> jumps ... the choice graph is a flat jump table, not a consequence system""
- **Lane impact:** L1 CAMPAIGN — REVERSES the surveyor's risk call. L1 must implement the CutsceneManager display-list walker with the null-padded index space and apply <outcome> at traversal time; a flat jump table silently drops three setStat writes in the Prologue alone. Also feeds L9 (save schema): branch-dependent stat writes must persist.

### `[[quests-story/condition-grammar-closed]]` — UPHELD [A2] (1 critic)

The <condition>/<startcondition> grammar is fully recovered, including a probabilistic 'rand' comparator and negated quest prerequisites — so the quest prerequisite DAG is on disk, not open.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:4152-4260`
- **Lane impact:** L1 CAMPAIGN — the quest unlock graph (62 <condition> + 17 <startcondition> + 97 <activequest> + 32 <completedquest>) is generatable. Note the 'rand' comparator needs the injected RNG, never Math.random, per the src/core invariant.

### `[[quests-story/dialogue-divergence-is-build-divergence]]` — UPHELD [A1] (2 critics)

The Prologue dialogue mismatch is not a "rewrite" of a near-verbatim source — it is a build divergence between the web v0.717 renderer and the v0.682 Android script the payload actually holds, which is empirical proof that the Android caveat bites hardest on exactly the unit that declared it retired.

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4 t=62/68/72/76, crop (0,700)-(1400,1060) upscaled to 2100x540 -> /private/tmp/claude-501/-Users-kheshav-kheshav-code-SSHD-1-1/70279977-fb70-4a26-ba27-9b32a10d27dc/scratchpad/crit_q/c62.png c68.png c72.png c76.png`
- **Lane impact:** L1 CAMPAIGN — its done-criterion cannot be "3,307 lines byte-exact", because byte-exact to the Android script is known-wrong on screen. L1 must (a) transcribe every scene visible in the two longplays from frames and let those win, (b) ship the remaining ~2,700 lines labelled 'Android v0.682 wording, diverges from the shipped web build', and (c) budget a frame-transcription pass as real work, not a checkbox. Also feeds L7/L6: the same two builds may diverge in audio cues and portrait art.

### `[[quests-story/ending-track-unclaimed]]` — UPHELD [A2] (1 critic)

<ending> is a second dialogue track per step that every claim in this unit ignores: XMLQuestStep builds BOTH an intro and an ending vector through the same parser, and 5 <ending> blocks ship with their own option/choice and outcome nodes.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLQuestStep.as:130-131 + reference/extracted/questdata.xml — parentage 5 quest/step/ending/outcome, 2 quest/step/ending/option/choice`
- **Lane impact:** L1 CAMPAIGN — post-battle scenes are a separate track from pre-battle intros and use the identical opcode set; the cutscene interpreter must be driven for both vectors.

### `[[quests-story/goto-index-semantics]]` — UPHELD [A2] (1 critic)

<goto> is an index into a flattened display list in which each <option> occupies one slot followed by ONE NULL SLOT PER <choice>, and <choice> itself occupies none — without this rule every branch target in the file lands on the wrong line.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLQuestStep.as getXMLIntroList() + CutsceneManager.as:80-96, :174-179 + verified against reference/extracted/questdata.xml:8722-8808`
- **Lane impact:** L1 CAMPAIGN — the cutscene interpreter is now fully specified end to end (flatten rule + display switch + outcome end codes 0/1/-1 = nextStep / leaveOK / leaveCancel). A null slot traces and falls through to nextStep().

### `[[quests-story/img-tokens-are-two-asset-classes]]` — UPHELD [A2] (1 critic)

The 68 distinct <img> tokens are NOT 68 portraits: 52 distinct (1,902 uses) are speaker portraits under <dialogue>, one of which is the `noportrait` null sentinel, and 16 distinct are full-screen chapter plates that are direct <intro> children rendered through a different UI.

- **Cite:** `reference/extracted/questdata.xml — <img> census by parent tag + reference/decompiled/shs3_android_payload/scripts/XMLQuestStep.as getXMLIntroList `case "img"` + CutsceneManager.as:190-196`
- **Lane impact:** L6 ART — the closed manifest is 51 character portraits PLUS 16 full-screen chapter/exposition plates, two different art briefs at two different resolutions. Briefing L6 with '68 portraits' (per quests-story/reward-and-roster-undercount) would have it draw 17 things that are not people.

### `[[quests-story/ledger-banner-already-banks-two-overturns]]` — UPHELD [A4] (2 critics)

REBUILD_READINESS.md retired its own quests-story §4/§6 and §3.8 claims in a dated staleness banner two days before this run, so the two ledger overturns the surveyor scores as new were already on the board.

- **Cite:** `docs/research/REBUILD_READINESS.md:20-40 (STALENESS BANNER dated 2026-08-13); the superseded bodies it retires live at :229-231 and :347`
- **Lane impact:** SCORING, all lanes. Any unit quoting a REBUILD_READINESS.md body without checking the 2026-08-13 banner above it will double-count novelty. Q-01 and Q-02 both do. The gauntlet's scoring pass should discount overturns_ledger:true whenever the banner table already names the same correction, and every other L0 unit's ledger quotes should be re-checked against :20-40 for the same error.

### `[[quests-story/loot-count-19]]` — UPHELD [A2] (1 critic)

The <loot> row count is 19, not the 18 asserted in two claims.

- **Cite:** `reference/extracted/questdata.xml — lxml parentage: 19 quest/step/reward/loot`
- **Lane impact:** L1 CAMPAIGN — trivial, but the reward table is 19 rows; anything generated from the claimed 18 drops one.

### `[[quests-story/loot-count-correction]]` — UPHELD [A2] (2 critics)

Two counts in the survey are wrong: <loot> is 19 rows, not 18 (asserted twice), and satoshi* <img> portrait tokens total 411, not 406.

- **Cite:** `reference/extracted/questdata.xml — grep -c '<loot>' = 19; <img> histogram`
- **Lane impact:** L1 CAMPAIGN — the loot table has 19 rows to port, not 18; the cited excerpt at :442-456 truncates the third loot row (<id>20108</id> = 'Crane Feather'). L6 ART's portrait manifest is unaffected (68 distinct tokens is correct).

### `[[quests-story/maxquests-7-is-real]]` — UPHELD [A2] (1 critic)

The quest log DOES have a hard accept-time cap of 7 concurrent active quests, enforced in StatsManager, with a shipped error string for hitting it — Dialogue-type quests are exempt and outcome opcode 110 force-adds past it, which is exactly the ledger's '1 story + 6 side'.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:164,1262,1313,3418 + Overworld.as:251 + docs/gauntlet/L0/index/strings.json['195']`
- **KILLS this line:** "QUESTLOGCAP = 7 (1 story + 6 side)."
- **Lane impact:** L1 CAMPAIGN + L8 UI — RESTORES the ledger bullet the survey deleted. Ship BOTH: a 7-quest accept cap (with the 'exceeded the maximum number of concurrent quests' dialog and Dialogue-type exemption) AND the 7-row scroller at x=60, y=73+55i. Shipping only the scroller, as the survey's lane_impact instructs, is a fidelity bug.

### `[[quests-story/nested-roomobj-waves]]` — UPHELD [A2] (1 critic)

12 additional waves holding 18 additional enemy rows are hidden inside a nested <xml> document within room-object <property> elements — true totals are 169 <enemy> and 118 <wave>, not 151 and 106.

- **Cite:** `reference/extracted/questdata.xml:20569 (also :20601, :20633) — parentage quest/step/roomobj/property/obj/property/xml/wave/enemy`
- **Lane impact:** L4 ENEMIES+AI — the encounter table is 18 rows / 12 waves larger than claimed, and some encounters are attached to room objects (trap/ambush triggers) rather than quest steps. L9 WORLD inherits the room-object spawn wiring.

### `[[quests-story/npc-name-collisions-and-typo]]` — UPHELD [A2] (1 critic)

'One name => one NPC row' is not a general rule and one shipped portrait token is misspelled: npc 171 and npc 811 both resolve to 'Chikako', npc 806 and 807 both to 'Soldier', and the token list contains `chikako_maked` (1 use) alongside `chikako_mask` (77).

- **Cite:** `docs/gauntlet/L0/index/resolved_names.json (npc 171, 811 both 'Chikako'; 806, 807 both 'Soldier') + reference/extracted/questdata.xml <img> census`
- **Lane impact:** L4 ENEMIES+AI must keep 171 (dialogue speaker) and 811 (wave combatant) as separate rows despite the shared name; L6 ART must ship the misspelled `chikako_maked` token or that one dialogue node renders portrait-less.

### `[[quests-story/outcome-id-is-a-22-opcode-director]]` — UPHELD [A2] (2 critics)

The <outcome><id> namespace is fully closed: getStatType partitions the id space into 10 bands, and inside PLAYERSTAT setStat is a 22-opcode cutscene director — all 28 ids used in the campaign resolve, including 47 music cues and 4 SFX cues.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:2926-2964 (getStatType), :3352-3560 (setStat opcodes), :164-260 (STAT_* table) + XMLQuestOutcome.as`
- **Lane impact:** L1 CAMPAIGN — closes the survey's second STILL_UNHELD; the save-game story-flag section is the BOOLEANSTAT 40000-49999 band. L7 AUDIO gains 47 music cues (id 111) + 4 SFX cues (id 112) on top of the 23 <cutscene> sound verbs the survey counted — the cue sheet is ~3x what was claimed. L6 ART gains three named VFX: white-in (120, x14), screen shake (126, x4), dark-blur bust (130, x2). L9 WORLD gains the teleport triple 113/114/115 as the room-transition contract.

### `[[quests-story/outcome-id-is-stat-namespace]]` — UPHELD [A2] (1 critic)

The <outcome><id> namespace is the StatsManager stat-id space, not a private story-flag space: id 11 is coins, 2000<=id<30000 is an itemdata id granted as loot, id 9 is XP, everything else is a stat write.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLQuestOutcome.as:50-77; reference/decompiled/shs3_android_payload/scripts/StatsManager.as:188`
- **Lane impact:** L1 CAMPAIGN + L9 WORLD (save schema) — closes the surveyor's STILL_UNHELD Q-15. The quest flag namespace and the save-game stat namespace are one namespace, so the 194 <set> writes over 28 distinct ids (42..40002) are stat/item writes and the save's story section is just the stat table.

### `[[quests-story/outcome-id-is-statsmanager]]` — UPHELD [A2] (2 critics)

CLOSES most of the STILL_UNHELD <outcome><id> namespace: it is the StatsManager stat/flag id space, with id 11 = coins, 2000<=id<30000 = real item ids, id 9 = XP, and the low ids named by StatsManager's STAT_* table (including STAT_CHIKAKOLOVE = 42, an affinity meter quest outcomes modify).

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLQuestOutcome.as applyOutcome() + StatsManager.as:170-260 + reference/extracted/questdata.xml:8776, :8785, :8794`
- **Lane impact:** L1 CAMPAIGN + L9 WORLD — the save-game's story section is StatsManager's stat map and can be schema'd now. Ids 100-130 sit above the stat table and behave as story flags; 30017/40000/40002 above that. Also surfaces a romance/affinity meter (Chikako) that appears in no ledger system block.

### `[[quests-story/outcome-id-is-statsmanager-namespace]]` — UPHELD [A2] (1 critic)

The <outcome><id> namespace is StatsManager's stat-id space, with a carve-out band [2000,30000) that means itemdata item ids; id 42 is STAT_CHIKAKOLOVE, an affection stat the campaign increments that no ledger system mentions.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLQuestOutcome.as:50-90 + StatsManager.as:188,192,246,248 + reference/extracted/questdata.xml <outcome> id domain`
- **KILLS this line:** "quests-story/outcome-id-namespace: "I did not open XMLQuestOutcome.as or StatsManager.checkConditions, so any mapping of id ranges to 'story flags' / 'quest items' / 'stats' would be a guess.""
- **Lane impact:** L1 CAMPAIGN + L9 SAVE SCHEMA — the quest flag namespace IS the stat array, not a separate table; <end> is a named 3-value enum (-1 abort, 1 step-complete, 0 continue). L1 must also model STAT_CHIKAKOLOVE (a romance/affection track absent from all 12 ledger systems) and the [2000,30000) item-grant band. STILL PARTIAL: the individual meanings of story-flag ids 100-130 remain unnamed.

### `[[quests-story/pipe-delimited-enemy-pools]]` — UPHELD [A2] (1 critic)

The enemy <id> field is a PIPE-DELIMITED random pool, not a scalar id: 114 of the 169 enemy rows use forms like 11|12|13|14|15, so spawns are randomised picks and ids cannot be one-to-one name-resolved.

- **Cite:** `reference/extracted/questdata.xml:4054, :5195, :6120, :10089 (114 rows total, measured)`
- **Lane impact:** L4 ENEMIES+AI — the spawner contract needs a pool-pick (RNG through the injected mulberry32, per the Sim invariant), not a scalar lookup. Any 'encounter table with resolved names' derived from these rows is wrong for two thirds of them.

### `[[quests-story/player-name-satoshi-resolved]]` — UPHELD [A1] (6 critics)

The 'player named Satoshi' contradiction is RESOLVED: the player has no canonical name (the dialogue nameplate is the account name — 'GUEST' unauthenticated, 'SOUND360TM' in the other longplay), speaks as <id>-2</id>, and Satoshi is NPC id 161, a portrait-bearing companion who fights beside the player in 14 quest waves.

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4 @ t=68 s, crop (0,700)-(1400,1060) [nameplate tab reads GUEST]; reference/frames/broad_survey/Nr4fQstqHDM_0090.jpg [PLAYER sheet, name field reads SOUND360TM]; corroborated A2 reference/extracted/questdata.xml:158`
- **Lane impact:** L1 CAMPAIGN — the dialogue box must substitute the player's chosen name for speaker id -2; Satoshi is an ally NPC to spawn, not the PC.

### `[[quests-story/step-action-is-gameengine-action]]` — UPHELD [A2] (1 critic)

CLOSES the STILL_UNHELD <step><action> enum: it is GameEngine.ACTION_*, passed straight into initBattleMode, so the 215 shipped steps are 169 ACTION_NOTHING, 37 ACTION_FIGHT, 5 ACTION_DUEL, 3 ACTION_SURVIVECLEANUP, 1 ACTION_SURVIVE.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/GameEngine.as:81-109 + QuestEngine.as:1214-1218 + Overworld.as:258 + Obj_NPCAggro.as:139,:214`
- **Lane impact:** L1 CAMPAIGN — the quest state machine's trigger dispatch is now fully named and buildable; action 0 = non-combat step, action > 0 = spawn the wave, action 6 (duel) additionally starts the player at x=150 instead of 400. Also hands L4 the fact that only 5 story steps are duels.

### `[[quests-story/step-action-is-gameengine-action-enum]]` — UPHELD [A2] (2 critics)

The <step><action> integer is GameEngine.ACTION_*, a 15-value enum, of which the 225 shipped steps use five: 169 ACTION_NOTHING (talk), 37 ACTION_FIGHT, 5 ACTION_DUEL, 3 ACTION_SURVIVECLEANUP, 1 ACTION_SURVIVE.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/GameEngine.as:81-109 + QuestEngine.as:1214-1219 + GameEngine.as:990 + Obj_NPCAggro.as:139,214`
- **KILLS this line:** "quests-story/step-action-enum-semantics: "I did not find the enum mapping those ints to behaviours (talk-to / kill / gather / enter-room). Per-step trigger TYPES are therefore enumerated but not named.""
- **Lane impact:** L1 CAMPAIGN — closes the quest state machine's trigger dispatch: build the 15-value GameEngine.ACTION_* enum, wire 0/1/4/6/14. Scope fact for the board: only 5 of 225 story steps are DUELS, 37 are FIGHT, 169 are pure dialogue. L2/L4: ACTION_DUEL steps spawn the player at startingPosX 150 instead of 400.

### `[[quests-story/two-yasukas-confirmed]]` — UPHELD [A2] (6 critics)

The 'two Yasukas = one person' Ready bullet holds, now on a payload cite rather than inference: exactly one NPC resolves to the name 'Yasuka' (id 156), and questdata uses two portrait tokens for her (yasuka, yasuka_hurt) — one character, two emotional states.

- **Cite:** `docs/gauntlet/L0/index/resolved_names.json -> npcdata.xml resolved: id 156; reference/extracted/questdata.xml:1508 <img>yasuka</img>`
- **Lane impact:** L1 CAMPAIGN — no disambiguation work needed; L4 gets one NPC row, not two.

### `[[quests-story/wave-enemy-count-correction]]` — UPHELD [A2] (1 critic)

The campaign encounter table is 169 <wave><enemy> rows totalling 773 enemy instances by <qty>, not the 151 rows the survey states.

- **Cite:** `reference/extracted/questdata.xml — own ElementTree parse with parent map over all 169 <enemy> elements`
- **Lane impact:** L4 ENEMIES+AI — the per-quest encounter table is 12% larger than the survey reports, and the useful figure for content budgeting is 773 spawned enemies across the 14 chapters. L1 CAMPAIGN: <loot> is 19 rows, not 18.

### `[[quests-story/web-payload-has-no-quest-data]]` — UPHELD [A3] (1 critic)

The web payload contains NO quest, item, npc or skill XML at all — all four data XMLs in reference/extracted/ are Android-build (v0.682) artifacts, which means every L0 unit built on them inherits the S0-3 build caveat rather than escaping it.

- **Cite:** `reference/extracted/payload.xml (hex grep, 329 MB FFDec export of the web payload) + reference/extracted/bindata/ (27 files, ls -la) + ls -la reference/decrypted/`
- **Lane impact:** ALL LANES, not just L1. Every L0 unit that cites reference/extracted/{quest,item,npc,skill}data.xml is citing Android v0.682, so L1 CAMPAIGN, L2/L3 (skilldata), L4 ENEMIES+AI (npcdata) and L5 ITEMS (itemdata) must each carry the v0.682 label and treat web-build parity as UNHELD, not established. Close-path: re-run the payload_decode + ffdec export against reference/decrypted/shs3_payload_decoded.swf and enumerate whether the web build fetches these XMLs from the dead Player.IO backend — if it does, the web data is genuinely unrecoverable and Android is the only source we will ever have.

---

## What is NOT here, and why

Refuted claims and claims no critic ever judged (§0: an unjudged claim is a LEAD)
are excluded by `buildLedgerPackets.py`. If you believe something is missing, say so
in your return — do not reconstruct it from memory, and do not cite it.
