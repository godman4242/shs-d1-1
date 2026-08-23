# LEDGER PACKET — `six`

> **This is the ONLY evidence you may cite.** Every id below was JUDGED by blind
> artifact-citing critics and SURVIVED (GAUNTLET.md §0). Cite one inline as
> `[[id]]`, exactly as written. Gate **L0-B** resolves every reference against the
> pooled verdicts and goes RED on anything unjudged, refuted, or invented — so a
> claim id you do not see here cannot enter the ledger, and neither can a
> plausible-looking one you compose yourself.

**31 surviving overturns · 1 true-but-rejected · 0 corroborating.**

---

## The ledger text you are rewriting, verbatim

```markdown
## 6. What is structurally UNRECOVERABLE (make these honest, labeled deviations)

A faithful *feel* recreation can absorb these; a literal byte-1:1 cannot. Flag each as recreation-authored, never as original fidelity.

- **Verbatim dialogue** — if the story is server-fetched and the server is dead, the actual script is gone; author original lines to the summaries (RECREATE-NEVER-RIP already requires original dialogue anyway).
- **Exact original SFX & music synthesis params** — the *character* is study-able from audio; the exact waveforms/envelopes are not.
- **The live clan-war** — warring alongside thousands of real players is impossible offline; scope out or build a *new* AI-driven sim.
- **L11–80 XP curve** — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED.
- **Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set.
- **The dead IAP economy** — design an offline gold faucet; `HAS_CASH_PURCHASE=false` already commits to this.

---
```

---

## ① Surviving overturns — these REWRITE the lines they name

A critic opened the sentence, read it in context, and ruled that it falls.

### `[[actionscript/save-schema]]` — UPHELD [A2] (2 critics)

The complete client-side save schema exists — 20 data slots plus 4 timer slots, each with a named serializer, a pipe-delimited wire format and a %54321 checksum — and the client ships its own offline SharedObject persistence path, so a single-player save model does not have to be invented.

- **Cite:** `reference/decompiled/shs3_android/scripts/QueryManagerPIO.as:1047-1187 (slot map) + QueryManagerBase.as:15 (DATASLOTS=20) + StatsManager.as:4362-4381 (wire format) + QueryManagerPIO.as:1024-1029 and :1218 (offline path) + QueryManagerBase.as:97 (SharedObject)`
- **KILLS this line:** "Server-sim topology & save format — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** L-meta-social, L-progression, L-world-exploration; also deletes the §1 unknown-unknown 'Save/serialization schema for every system (the original was server-side, so there's nothing to copy — must be designed)'.

### `[[actionscript/xp-curve-l11-80]]` — UPHELD [A2] (2 critics)

The complete XP threshold table for levels 1–98 is a literal array in the source, byte-identical in the web v0.717 payload and the Android v0.682 build — the L11–80 curve is not extrapolated, not partial, and not lost.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:78 (parity: reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364; programmatic compare printed 'entries 99 / android entries 99 / IDENTICAL: True')`
- **KILLS this line:** "L11–80 XP curve — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED."
- **Lane impact:** L-progression: §4 blocker ② deleted outright; the system's 55/100 score floor rises. Also kills the §0 bullet listing the L11-80 curve as structurally unrecoverable.

### `[[art-anim-audio-feel/music-13-stems-measured]]` — UPHELD [A3] (8 critics)

The music is 13 named MP3 stems, all held, and the six overworld stems are exactly 79.872 s while the four dungeon stems are exactly 45.760 s — bit-identical lengths are the mechanism that lets them layer in phase.

- **Cite:** `reference/extracted/android/113_Mobile_MusicResource.bin (key=117) -> 13 DefineSound + SymbolClass; durations measured with macOS afinfo on the extracted MP3s`
- **KILLS this line:** "Exact original SFX & music synthesis params — the character is study-able from audio; the exact waveforms/envelopes are not."
- **Lane impact:** art-anim-audio-feel: §6's 'structurally UNRECOVERABLE' audio bullet falls. Also kills §5 Tier-1 item 3 ('Listen-pass on existing audio ... the deepest gap') — never listen-pass a YouTube rip when the master stem is on disk.

### `[[art-anim-audio-feel/predecessor-sfx-lineage]]` — UPHELD [A3] (2 critics)

Two of the thirteen Duels SFX (punch, slash1) are BYTE-IDENTICAL to assets held in the unencrypted, web-distributed predecessor SWFs SHS1 and SHS2, and seven more share identical sample counts and byte lengths with same-named SHS2 assets — the SFX set is a franchise-inherited library.

- **Cite:** `MD5 comparison of my extracted Duels SFX (from 122_Mobile_SoundResource k=111) against my extractions from reference/predecessors/shs1_462631_shunpo202c.swf (10 DefineSound) and reference/predecessors/shs2_kon.swf (20 DefineSound)`
- **KILLS this line:** "Exact original SFX & music synthesis params — the character is study-able from audio; the exact waveforms/envelopes are not."
- **Lane impact:** L6 art-anim-audio-feel: bounds the survey's 'all audio must carry an Android v0.682 label'. For punch and slash1 an independent WEB-distributed Lut Games build carries the exact bytes, so those two need no build caveat. Graded PARTIAL because 11 of 13 are still Android-only and SHS2 is a different game, not proof of Duels web parity. Also opens a lead nobody has worked: SHS1 and SHS2 hold 30 DefineSound tags plus a 310-block streamed music track, all in the clear.

### `[[bindata/NEW-audio-waveforms-are-recovered-not-encrypted]]` — UPHELD [A3] (2 critics)

The audio is RECOVERED, not merely held-but-encrypted. 113_Mobile_MusicResource.bin and 122_Mobile_SoundResource.bin decode with the transform this repo already commits (reference/tools/payload_decode.py), and the key is derivable from the file itself because every blob is CWS v17: key = byte[3] XOR 0x11 (117 and 111 respectively). Both inflate on the first try and each is an ordinary SWF holding 13 DefineSound MP3 tags at 11,025 Hz mono — 26 real waveforms, byte-exact. ffdec cannot open them; this transform can.

- **Cite:** `reference/extracted/android/122_Mobile_SoundResource.bin and reference/extracted/android/113_Mobile_MusicResource.bin, decoded with reference/tools/payload_decode.py:22-29; DefineSound tags extracted and written to MP3, verified with ffprobe`
- **Build:** android v0.682
- **KILLS this line:** "Exact original SFX & music synthesis params — the character is study-able from audio; the exact waveforms/envelopes are not."
- **Lane impact:** L6 art-anim-audio-feel: blocker ① 'ALL AUDIO — every SFX + music param is INFERRED' does not need closing by synthesis at all; the originals are extractable. REBUILD_READINESS.md:348 ('the exact waveforms/envelopes are not [study-able]') falls. This also contradicts the §0 preamble S0-5 ('audio is HELD but ENCRYPTED ... You may NOT claim audio is recovered'): S0-5's stated basis is that ffdec cannot open the nested CWS SWFs, which is true and irrelevant — the repo's own decoder opens them. Per the standing invariant I say it out loud: the byte-check beats the doc. Caveat: these are the ANDROID v0.682 resource blobs; web v0.717 audio parity is not established, and the assets stay study-only/local-only under the permission ruling.

### `[[bindata/original-rng-is-a-specific-lcg]]` — UPHELD [A2] (2 critics)

The original game's RNG is a fully specified three-line LCG, so every procedural system it seeds — place names, trap-room selection, room generation, daily loot, enemy-player placement — is bit-reproducible today.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/RNG.as:10-19,65-73`
- **KILLS this line:** "Server-sim topology & save format — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** world-exploration + meta-social. Overturns half of §6's highest-value line: the SAVE FORMAT is indeed gone, but 'nothing to copy' is false for the generation half — the world's daily content is a pure deterministic function of a seed through this LCG. Build flag: CLAUDE.md mandates mulberry32; the original is this LCG, so the divergence must be labelled, not presented as original fidelity.

### `[[bindata/war-boss-ids-are-rival-players]]` — UPHELD [A2] (2 critics)

The 11 "boss" ids 700–710 in the war-wave table are not missing NPC definitions — they are rival PLAYERS injected at runtime from a server sentry string, so 28 of the 39 waves are fully recoverable content and only 11 slots are permanently lost.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin:18,49,80,111,142,173,204,235,266,297,328 + reference/decompiled/shs3_android_payload/scripts/WarHexUI.as:1405-1414 + QuestEngine.as:1035-1043`
- **KILLS this line:** "The live clan-war — warring alongside thousands of real players is impossible offline; scope out or build a new AI-driven sim."
- **Lane impact:** meta-social + enemies-ai. Upgrades this source-lane's own prior run-3 claim C19 from STILL_UNHELD to explained-and-closed. Converts a whole-system §6 write-off into a bounded one: 39/39 wave compositions, spawn x, qty and mob ids are HELD; only the 11 player-avatar boss slots must be re-authored (an offline rival-loadout generator is the honest substitute).

### `[[economy/iap-tiers-held-both-builds]]` — UPHELD [A2] (6 critics)

The real-money IAP tier tables are HELD verbatim for BOTH builds, including two discount ladders — the ledger's 'IAP tiers' Ready bullet is now cited rather than assumed, and the prior survey's STILL_UNHELD verdict is overturned.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t410s0§.as:136-140 + :325-329 + :274-278 + :296-300 (web); reference/decompiled/shs3_android/scripts/PayUI.as:127-141 (Android)`
- **KILLS this line:** "The dead IAP economy — design an offline gold faucet; HASCASHPURCHASE=false already commits to this."
- **Lane impact:** L10/L11: the whole cash→gold→coin chain now closes end-to-end (50 KREDS → 50 gold → 10,000 coins). §6 must stop calling the IAP economy structurally unrecoverable; only the payment processor is dead.

### `[[economy/premium-exchange-rate-200]]` — UPHELD [A2] (6 critics)

1 heavenly gold buys 200 coins in the web v0.717 build, not the 1000 the Android build pays — frame and web payload agree against the Android row.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t401s0§.as:948-959 (web convertgold) vs reference/decompiled/shs3_android/scripts/InteractUI.as:918-923; corroborated by the '200' banknote at 1 gold in the t=48:04 frame`
- **KILLS this line:** "The dead IAP economy — design an offline gold faucet; HASCASHPURCHASE=false already commits to this."
- **Lane impact:** L10/L11: the premium→coin sink is fully specified for the rebuild target at 200 coins/gold. Also corrects the prior gauntlet economy survey's E-08, which banked 1000.

### `[[economy/premiumdata-blob-is-extracted]]` — UPHELD [A2] (6 critics)

The premium storefront catalogue blob IS on disk and is plain XML — 16 permanent SKUs, a commented-out special list, and rotating outfit sets carrying the developers' own comment headers — overturning the prior survey's finding that it was never extracted.

- **Cite:** `reference/extracted/android/121_Mobile_PremiumData.bin (4,504 bytes, XML 1.0); rotation seeding at reference/decompiled/shs3_android/scripts/XMLShopData.as:101`
- **KILLS this line:** "The dead IAP economy — design an offline gold faucet; HASCASHPURCHASE=false already commits to this."
- **Lane impact:** L3 (ITEMS/PAPERDOLL): each rotation <set> is a free 6-7-slot paperdoll manifest with a human-readable outfit name. L10/L11: hourly rotation rule is `setRNGSeed(serverDate * floor(serverTime/3600))`.

### `[[frames/private-pvp-room-door]]` — UPHELD [A1] (2 critics)

The client exposes a named private-PvP-room door — an 'ENTER ROOM NAME' modal opened from a world object labelled 'GO TO PRIVATE PVP ROOM' — a networked surface none of the twelve ledger systems mentions.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-04/frames/frame_0017.jpg (read whole @1.86x)`
- **Build:** web v0.717
- **KILLS this line:** "Server-sim topology & save format — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** meta-social: duels/tournaments are hosted as named rooms, not only as a matchmaking queue

### `[[frames/pvp-duel-screen-fully-filmed]]` — UPHELD [A1] (2 critics)

The complete LIVE PvP matchmaking screen — token counter, six-card challenge grid, rankings entry, refresh, and the victory-taunt field — is on film in full, so §6's 'the live clan-war ... impossible offline' over-claims what is lost: only the live population is gone, not the surface.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0018.jpg (crop 0,0-1024,576 @1.95x); flow continues at frame_0016.jpg (REFRESHING...) and frame_0019.jpg (VS card GUEST vs TYLUV)`
- **Build:** web v0.717
- **KILLS this line:** "The live clan-war — warring alongside thousands of real players is impossible offline; scope out or build a new AI-driven sim."
- **Lane impact:** meta-social: the whole duel/matchmaking UI becomes buildable 1:1 with AI opponents behind it

### `[[frames/save-policy-is-checkpoint-at-towns-and-dungeons]]` — UPHELD [A1] (2 critics)

§6 says there is nothing to copy about the save format; the frames do not give the schema, but they do give a load-bearing save POLICY the ledger records nowhere — position is checkpointed only at towns and dungeons, and guest mode persists nothing.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0002.jpg and frame_0003.jpg (both read whole @1.86x); reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0003.jpg (@1.86x)`
- **Build:** web v0.717
- **KILLS this line:** "Server-sim topology & save format — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** world-exploration, meta-social: a single-player persistence design must honour checkpoint-at-settlement, not continuous save

### `[[hunter-s26a/full-offline-save-schema-is-19-fields-in-both-builds]]` — UPHELD [A2] (2 critics)

The offline SharedObject save is not one field, it is the whole player. QueryManagerBase.as:2903 opens SharedObject.getLocal(cookieName + '_' + charname); :2910-2930 is the offlineMode branch and it writes NINETEEN fields, each with a matching StatsManager get*String/parse*String pair: nextAPUpdate, nextDTUpdate, lastUpdate, playerlevel, playerStats, equipment, skillStats, skillSlots, inventory, stash, questItems, intStats, achievementStats, booleanStats, activeQuestList, completedQuestList, playerlocation, taunt, friends. The WEB build carries the same path: §1t1832s0§.as:2797-2800 writes data.equipment and data.playerlevel to the same per-character SharedObject, and the reset function at :2813-2825 enumerates the same field set (playerLevel, equipment, inventory, stash, ...).

- **Cite:** `reference/decompiled/shs3_android/scripts/QueryManagerBase.as:2903-2932 + reference/decompiled/shs3_payload/scripts/§1t1832s0§.as:2797-2800 and :2813-2825`
- **Build:** both — android v0.682 full branch, web v0.717 same SharedObject path
- **KILLS this line:** "Server-sim topology & save format — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** L10 persistence. hunter05/offline-sharedobject-save-path-exists named ONE field and hedged 'web parity not checked'; the real artifact is a 19-field schema present in both builds. §6 :351 does not merely bend, it inverts - the schema is already written and does not need designing.

### `[[hunter-s26a/web-sound-resource-decrypts-to-13-mp3-sfx]]` — UPHELD [A2] (2 critics)

The audio is not merely 'named' - 13 SFX waveforms are RECOVERED. reference/extracted/android/122_Mobile_SoundResource.bin decrypts by the game's own routine (ResourceManager.as:200-217 decryptByteArray: XOR bytes 3..255 with key, swapping ba[i]<->ba[i+256] where i%11==0; key = 'soundresource.swf'.charCodeAt(1) = 111 per ResourceManager.as:41) into a CWS v17 SWF of 29,631 bytes that inflates to 29,623 bytes containing 13 DefineSound tags - every one format 2 (MP3), rate 1 (11 kHz), 16-bit, mono - plus a SymbolClass table naming all 13: deflect, die2, sumo, slash3, die3, refund, die1, slash2, slash1, goodkoto, hitmetal, fart, punch. Sample counts: 8700, 7264, 31928, 2976, 9545, 8033, 5290, 6130, 3809, 17331, 5717, 4608, 3456.

- **Cite:** `reference/extracted/android/122_Mobile_SoundResource.bin (my own decrypt + inflate + SWF tag walk) + reference/decompiled/shs3_android/scripts/ResourceManager.as:41 and :200-217`
- **Build:** android v0.682 (the 43 Snd_* trigger names are web v0.717)
- **KILLS this line:** "Exact original SFX & music synthesis params — the character is study-able from audio; the exact waveforms/envelopes are not."
- **Lane impact:** L7 audio + §6. Nobody in this packet aimed at REBUILD_READINESS.md:348, and it is the sentence that actually falls: the exact waveforms ARE recoverable for 13 named SFX. :240's 'every SFX param is INFERRED' falls with it. This also independently re-verifies brief correction C3 first-hand rather than on trust.

### `[[hunter05/offline-sharedobject-save-path-exists]]` — UPHELD [A2] (2 critics)

The game has a LOCAL, server-free persistence path: the equipment string is written to and read back from a Flash SharedObject, so §6's 'Server-sim topology & save format — nothing to copy' is wrong twice over (a serializer exists AND an offline save path exists).

- **Cite:** `reference/decompiled/shs3_android/scripts/QueryManagerBase.as:2907, :2917, :2980`
- **Build:** android v0.682 (web parity not checked)
- **KILLS this line:** "Server-sim topology & save format — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** L10 persistence — a single-player schema does not have to be designed from scratch; the client already ships one, including its offline storage target.

### `[[itemdata/xp-curve-l1-l98-held]]` — UPHELD [A2] (2 critics)

The complete L1–L98 experience table is on disk as a literal array, byte-identical in the Android v0.682 and web v0.717 bundles, and a v0.717 video frame confirms it is the shipped curve — so §6's 'L11–80 XP curve is structurally UNRECOVERABLE' is false.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:78 (and reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364, same 99 values); A1 corroboration reference/frames/s21_weapon/t655.0.png, XP-bar crop (860,120)-(1290,215) of the 1920x1080 frame`
- **KILLS this line:** "L11–80 XP curve — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED."
- **Lane impact:** L3 progression — its second-named blocker and its §2 'thing blocking a 1:1' both dissolve; the score floor moves up. Also ui-hud (the XP bar's denominator is expArray[level]).

### `[[items-equipment/equipment-save-format-is-13-field]]` — UPHELD [A2] (1 critic)

The equipment save format is StatsManager.getEquipmentString/parseEquipmentString -- all 13 equipment slots joined by "|", each field an Item.toStringNoQty() record carrying id plus modifiers, colours, uses, name and creator. MCSCharacter's 12-field mcsString is the character APPEARANCE string, not persistence.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:4417-4445; Item.as:229-259; MCSCharacter.as:618`
- **KILLS this line:** "Server-sim topology & save format — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** L10 (persistence) -- corrects the surveyor's cite. Copying MCSCharacter.as:348 instead loses the scabbard, both accessory slots and every per-slot modifier, and adds two prop fields that are not equipment slots.

### `[[meta-social/section6-live-clan-war-overbroad]]` — UPHELD [A2] (6 critics)

§6's "the live clan-war is structurally unrecoverable" is over-broad: only the hosted population and the authoritative tick are gone — every rule of the clan war is client-side and now readable.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUI.as:1052 (deploy), :1104 (arrows), :2281-2307 (terrain), WarHexUIBuildMenu.as:185-213 (costs), StatsManager.as:162,824-1013 (ranks), string 376 (24h)`
- **KILLS this line:** "The live clan-war — warring alongside thousands of real players is impossible offline; scope out or build a new AI-driven sim."
- **Lane impact:** L0 meta-social — the scoping decision (offline AI sim) stays right, but it must be built to the ORIGINAL numbers, not authored ones.

### `[[meta-social/xp-curve-has-a-web-cite]]` — UPHELD [A2] (2 critics)

The L11-80 XP curve is in the WEB v0.717 payload twice over, not just the Android build — so the §6 'structurally unrecoverable' line is retired with no version caveat at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364 and §1t29s0§.as:28`
- **KILLS this line:** "L11–80 XP curve — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED."
- **Lane impact:** L1/L-progression — src/config/xp.ts can move from INFERRED to CONTRACT on a web-build cite; also kills the §2 note 'L11–80 curve (likely unrecoverable)'.

### `[[meta-social/xp-curve-in-web-build]]` — UPHELD [A2] (2 critics)

The 99-entry XP array is in the WEB v0.717 build and is byte-for-byte identical to the Android copy, so the recovered L11-80 curve carries no version caveat at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364 (also §1t29s0§.as:28) compared element-wise to reference/decompiled/shs3_android/scripts/StatsManager.as:78`
- **KILLS this line:** "L11–80 XP curve — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED."
- **Lane impact:** L1/L-progression -- retires REBUILD_READINESS.md:350 and :200 outright on a desktop cite; src/config/xp.ts can drop the INFERRED label rather than merely relabelling it 'measured (Android)'.

### `[[meta-social/xp-curve-is-in-the-web-build]]` — UPHELD [A2] (2 critics)

The 99-entry XP array is in the WEB v0.717 payload, not only the Android build — the L11-80 §6 line closes with no build caveat at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364 (same class whose line 36 sets clientVersion) and §1t29s0§.as:28`
- **KILLS this line:** "L11–80 XP curve — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED."
- **Lane impact:** L1/L-progression — the §6 'structurally unrecoverable' line and the §2 progression note both retire on WEB evidence; src/config/xp.ts's INFERRED extrapolation can be replaced with measured v0.717 values.

### `[[meta-social/xp-curve-is-web-native]]` — UPHELD [A2] (2 critics)

The 99-entry L1-L80 XP array is byte-identical in the WEB v0.717 payload, so the lane's biggest cross-lane overturn carries no Android caveat at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364 vs reference/decompiled/shs3_android/scripts/StatsManager.as:78 (parsed and compared: equal True)`
- **KILLS this line:** "L11–80 XP curve — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED."
- **Lane impact:** L1/L-progression -- src/config/xp.ts can drop the INFERRED label entirely and take the measured v0.717 values, not an Android port.

### `[[meta-social/xp-curve-l11-80-recovered]]` — UPHELD [A2] (6 critics)

CROSS-LANE (progression), but it is a §6 line: the "L11–80 XP curve, likely unrecoverable" is a 99-entry array in the payload, and level 80 is exactly the rebirth gate.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:78`
- **KILLS this line:** "L11–80 XP curve — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED."
- **Lane impact:** L1/L-progression — retires a §6 "structurally unrecoverable" line and the §2 note "L11–80 curve (likely unrecoverable)"; the labeled-INFERRED extrapolation in src/config/xp.ts can be replaced with measured values.

### `[[progression/expArray-validated-on-camera]]` — UPHELD [A1] (2 critics)

The recovered 99-entry XP table is not merely on disk — its low end is confirmed by the primary reference three separate times, so frame and payload AGREE rather than merely not contradicting. Video A at -ss 653.0 renders '2098 / 2950 EXPERIENCE POINTS' beside a level-3 badge, and expArray[3] = 2950. At -ss 1600 it renders '5110 / 5150' beside a level-4 badge, and expArray[4] = 5150. Segment B-18 records the XP bar reading 24881/25900 then 25354/25900, and expArray[9] = 25900. All three thresholds match the array exactly, and all three are consistent with the game's own getLevel() (StatsManager.as:1586-1596, first q where expArray[q] > XP).

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4 @ -ss 653.0 ('2098 / 2950', badge 3) and @ -ss 1600 ('5110 / 5150', badge 4), crop=iw*0.55:ih*0.35:iw*0.42:ih*0.12 x2 lanczos — my own extraction; checked against reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364 and docs/research/video-study/segments/B-18-turn-in-and-hattori-kazushi-bounty-accep.md:32`
- **Build:** web v0.717
- **KILLS this line:** "- L11–80 XP curve — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED."
- **Lane impact:** L4 progression — this is the piece the five duplicate XP-curve claims all lacked: an A1 confirmation that the payload array is the array the shipped game actually rendered. src/config/xp.ts can move to CONTRACT on frame-plus-payload agreement, not on a decompiled array alone. Nothing of :350 survives.

### `[[questdata/epilogue-verbatim-script]]` — UPHELD [A2] (2 critics)

§6's highest-value 'structurally unrecoverable' line is dead, and the proof extends to the very last beat of the campaign: the Epilogue's villain reveal is verbatim on disk, complete with a shipped authoring typo that no reconstruction would contain.

- **Cite:** `reference/extracted/questdata.xml:27552, :27557, :27617 (quest 59 'Epilogue' begins :27347)`
- **KILLS this line:** "Verbatim dialogue — if the story is server-fetched and the server is dead, the actual script is gone; author original lines to the summaries (RECREATE-NEVER-RIP already requires original dialogue anyway)."
- **Lane impact:** L9 quests-story blocker ① closed and §6's dialogue bullet must be deleted. 3,307 <text> nodes / 2,771 <dialogue> blocks / 40,119 words, complete through the Epilogue. The duplicated clause at :27617 ('has finally arrived. has arrived.') is a shipped authoring error — the strongest available proof this is the authored script rather than a summary. Carries the A-06 caveat: verbatim where it exists, not proven exhaustive for v0.717.

### `[[quests-story/payload-provenance-is-android]]` — UPHELD [A3] (2 critics)

reference/extracted/questdata.xml — and itemdata.xml, npcdata.xml, skilldata.xml with it — are ANDROID v0.682 files, not web v0.717: the inflated web payload ships zero quest/item/npc/skill XML, so the whole run's data measurements are mobile-build measurements and must be labelled as such.

- **Cite:** `byte-check over reference/decrypted/shs3_payload_decoded.swf vs reference/decrypted/shs3_android_payload_decoded.swf (both zlib-inflated), plus ls -laT mtime ordering of reference/extracted and reference/decrypted`
- **KILLS this line:** "Verbatim dialogue — if the story is server-fetched and the server is dead, the actual script is gone; author original lines to the summaries (RECREATE-NEVER-RIP already requires original dialogue anyway)."
- **Lane impact:** Cross-cutting, hits L1 CAMPAIGN, L1b STRING TABLE, L3 ITEMS, L2 SKILLS, L4 ENEMIES. The ledger's §6 fear was half right: for the WEB build the script really is absent from the client. The corpus we hold is the Android script, which is why the frame and the payload disagree. Every data claim in this run derived from questdata/itemdata/npcdata/skilldata must carry the v0.682 label, and any scene visible in the two longplays must be frame-reconciled rather than ported byte-exact.

### `[[quests-story/questdata-is-live-updated]]` — UPHELD [A2] (2 critics)

questdata.xml (and the other nine data XMLs) is a server-live-updated file: the extracted copy is the baked-in version 1 fallback, and the client fetched newer revisions from PlayerIO gameFS — which is the mechanism behind the frame-vs-payload dialogue divergence.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:479,70 + Mobile.as:216,244 + QuestEngine.as:281 + QueryManagerPIO.as:124`
- **KILLS this line:** "Verbatim dialogue — if the story is server-fetched and the server is dead, the actual script is gone; author original lines to the summaries (RECREATE-NEVER-RIP already requires original dialogue anyway)."
- **Lane impact:** CROSS-LANE, all 12 systems. The ledger's 'server-fetched' fear was HALF right: the corpus is on disk, but the on-disk copy is version 1 and the live client preferred a server revision. Every data-XML claim in L1 (quests), L2/L3 (items), L4 (npcs), L5 (skills), L9 (nodes/bg) must be labelled 'embedded v1 — the shipped build may have live-updated past this'. L1's done-criterion 'all 3,307 lines byte-exact' is provably not on-screen fidelity; the two longplays are the only arbiter for scenes they cover.

### `[[quests-story/web-build-fetches-questdata]]` — UPHELD [A2] (2 critics)

The shipped web v0.717 build does NOT carry the quest script at all — it downloads questdata.xml from the Player.IO CDN at runtime; only the Android v0.682 build embeds a copy, and that copy is the one we hold.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1524s0§.as:330-658 + reference/decompiled/shs3_android_payload/scripts/QuestEngine.as:281-291 + reference/decompiled/shs3_android_payload/scripts/Mobile_QuestData.as:5 + grep -c binaryData reference/extracted/payload.xml -> 27`
- **KILLS this line:** "- Verbatim dialogue — if the story is server-fetched and the server is dead, the actual script is gone; author original lines to the summaries (RECREATE-NEVER-RIP already requires original dialogue anyway)."
- **Lane impact:** L1 CAMPAIGN — the ledger's antecedent is TRUE, not false: the script IS server-fetched on the shipped build. What survives is an Android v0.682 SNAPSHOT, which is why the longplay Prologue is reworded. Every ported line must be labelled 'v0.682 Android embed, may differ from shipped', and every scene visible in the two longplays must be frame-reconciled. Kills the basis of quests-story/android-caveat-retired and the 'not server-fetched' half of quests-story/verbatim-script-held.

### `[[uistrings-payload/pvp-transport-is-rtmfp-p2p]]` — UPHELD [A2] (1 critic)

Live PvP did not run over the Player.IO socket alone — it ran over Adobe RTMFP peer-to-peer, against a named private application URI plus Adobe's public Cirrus rendezvous, which is also what the authored 'behind a NAT or router' error copy is actually reporting.

- **Cite:** `reference/extracted/payload.xml:120466`
- **Build:** web v0.717
- **KILLS this line:** "- The live clan-war — warring alongside thousands of real players is impossible offline; scope out or build a new AI-driven sim."
- **Lane impact:** meta-social + §6 + a P0 postscript. The conclusion (offline is impossible) stands, but the premise that the multiplayer architecture is unknowable is false: transport, rendezvous service and application URI are all in the payload. Corroborating pool entries: stratusid :119285, NET_STATUS :119389, nearID :119392, farID :119396, 'connected to netgroup' :119398, NetConnection.Connect.Success :119400, and rtmfp://p2p.rtmfp.net :120467. Because p2p.rtmfp.net (Adobe Cirrus) was retired with Flash, even a revived Player.IO backend could not restore PvP.

### `[[world-exploration/save-schema-recovered]]` — UPHELD [A2] (6 critics)

§6's claim that the save format is unrecoverable is wrong: the complete persistence schema is 20 numbered data slots plus four timer slots, each with a named serializer, and slot 10 is the world position.

- **Cite:** `reference/decompiled/shs3_android/scripts/QueryManagerPIO.as:1047-1187; QueryManagerBase.as:15; StatsManager.as:208,248,5073-5080`
- **KILLS this line:** "Server-sim topology & save format — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** L1 world-exploration (blocker 'save model') and every other lane that inherits §6. The topology half of the ledger sentence stands (Player.IO BigDB is dead); the save-format half is false. Slots: 0 playerlevel, 1 playerstats (+103 battlestats), 2 equipment, 3 skillstats, 4 inventory, 5 questitems, 6 intstats, 7 booleanstats, 8 activequest, 9 completedquest, 10 location, 11 taunt, 12 friendlist, 14 skillslots, 15 side, 16 playerdan, 17 stash, 18 options, 19 achievementstats, 100 nextAPUpdate, 101 nextDTUpdate, 102 nextWarTurn. STAT_LOCATION=19 holds the packed node id, STAT_LOCATION_ROOM=43 the room index. There is also a real offlineMode branch and a saveCharCookieData() local path. The schema needs transcribing, not designing.

## ② TRUE, but the line SURVIVES — do NOT delete anything for these

The finding held up; the overturn did not. 36% of claimed overturns were rejected this way. Bank the knowledge, keep the sentence.

### `[[world-exploration/web-decompile-holds-full-logic]]` — NOT-UPHELD [A2] (1 critic)

reference/decompiled/shs3_payload/ is the complete web v0.717 game-logic decompile under obfuscated class names, not 'only display symbols' - so cross-build parity is checkable for every world constant by grepping values instead of names.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36 (StatsManager), §1t70s0§.as:146,:399-404 (NodeGenerator), §1t6481s0§.as:17-21,:285-286 (WorldMapUI), §1t58s0§.as (RNG), §1t136s0§.as:40,42 (NameGenerator), §1t8621s0§.as:82-138 (Obj_VegePatch), §1t72s0§.as:32,98 (XMLWorldNode)`
- **aimed at this line, which SURVIVES:** "Server-sim topology & save format — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** Affects EVERY L0 unit, not just L1. The Stage-0b caveat 'this is the ANDROID build, clientVersion 0.682 ... combat tuning parity is NOT established' is far weaker than assumed: the web v0.717 logic is on disk and greppable by constant. Verified identical across builds in this lane: APINTERVAL 60, DTINTERVAL 2*60, WARMOVEINTERVAL 60*60, start AP/MAXAP 30, STAT_LOCATION 8382465, quest 24*60*60, level formula abs(x-341)+abs(y-341)+3 with cap 200 (and the cap-100 variant), territory = floor(sector/6), TERRSHIFTX 21 / TERRSHIFTY 51 / WARMARKERSHIFTX 8, projection *10+5 and *10+8.5, LCG 9301/49297/233280, crop timers 15m/1h/6h/12h + 15m grace, and both NameGenerator arrays element-for-element (78 and 37 entries, diffed: IDENTICAL). New standing rule for the board: before declaring an Android-only caveat, grep shs3_payload for the VALUE. Only divergence found here: XMLWorldNode does XMLList(param1.search).copy() on web vs xml.search on android.

## ③ Corroborating — new knowledge, no line deleted

These add or sharpen; they do not contradict.

*(none)*

---

## What is NOT here, and why

Refuted claims and claims no critic ever judged (§0: an unjudged claim is a LEAD)
are excluded by `buildLedgerPackets.py`. If you believe something is missing, say so
in your return — do not reconstruct it from memory, and do not cite it.
