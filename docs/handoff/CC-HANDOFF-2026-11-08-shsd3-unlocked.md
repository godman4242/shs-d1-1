# 2026-11-07/08 — shsd3 (2015 web Duels) fully unlocked — handoff to Claude Code

**What happened:** the last locked file — `shsd3_DUELS_protected.swf`, the 2015 web Duels edition whose bytecode was the only missing piece — was fully decrypted and decompiled on the night of 2026-11-07 (JClaw side, ~20 min of actual work). "One encrypted file stands between engine-recovered and full-game-understood" is resolved. There is no encrypted file left.

**Where to look first:** the full technical record is `shs-recovery/notes/FINDINGS-2026-11-07-UNLOCK.md` in the JClaw workspace; the layman-sequel is `shs-course-final/UNLOCK-PLAIN.pdf`. This doc carries only what CC needs to work — plus the plan deltas it changes.

**New artifacts copied into this repo (all under the gitignored `reference/`):**
- `reference/decrypted/shsd3_DUELS_decrypted.swf` — the main game, CWS v17, byte-exact (inflate = header 11,434,597; unpacked size verified).
- `reference/decrypted/shsd3_DUELS_unlocked_wrapper.swf` — the magichtml-protected outer wrapper (blob 9 of the protected file), itself a clean SWF after the outer crack.
- `reference/decrypted/shs3_loader_la_decrypted.swf` — the `la`-class loader SWF recovered from inside the PRELOADER (its RC4 blob 9; complements the preloader stub decompile).
- `reference/decompiled/shsd3_web/` — **974 ActionScript files (~5.9 MB), real class names, NOT stubs**: `DuelModeUI`, `DuelSlot`, `DuelLeaderboardUI`, `DuelRequestDialog`, `DuelIntroBar`, `NetworkManager` (129 KB), `ConnectionPIO` (52 KB, full PlayerIO client SDK), `ConnectionP2P`, `ArmorGames`, `MCSPlayer`, `PlayerPanel`, `OverworldHUD` (ref at NetworkManager), clans/quests/crafting/bank UIs, `Bigmap`+Room+Exit, ~30 projectile classes, 40 `shs3_fla` frame classes (`Town_*`, `Minimap*`, `warchoose_*`, `InteractUI_*`, `ProcGenSky`...). `MainTimeline` holds `sharedObject:SharedObject` — the `.sol` save machinery.
- `reference/decompiled/shsd3_wrapper/` + `reference/decompiled/shsd3_loader/` — the two protection-layer stubs (la + com.swfdefender.{MD5, Comp, DomainMsg, IntUtil}).

## The protection chain (why the old "PASSWORD-LOCKED" verdict was wrong)
Two layers, no password anywhere:
1. **Outer — tinyloader/`lb`:** DefineBinaryData blob; RC4 with key = the blob's OWN last 8 bytes; only the first 64 bytes encrypted (header + start of zlib). Same scheme the 2016 chain already cracked (`scripts/payload/tinyloader_crack.py`).
2. **Inner — magichtml SWF Protection (`la` doc class + com.swfdefender.*):** config lives in an **embedded class resource** (not the blob head — the earlier misparse that produced the false "password-locked" alarm read the head at wrong offsets and got pure noise). True layout: magic(u32) width height level(u8) keyLen(u16) key domainsLen(u16) domains… allowLocal showDomainMsg doNavigate navUrlLen navUrl showMsg msgType msgLen msg watermark showLogo [logo] password(u8) [pw strings] payload. **shsd3 real values: magic=0xe4, 800×690, level=1 → RC4 (Comp.C2), keyLen=8, key = ASCII `uDbgBn15`, domains NONE, allowLocal=1, watermark/logo 0, password flag = 0 — no password, key stored in clear.** Payload = 6,687,980 B; first 64 bytes RC4-decrypted → CWS v17, zlib body intact byte-exact. The password code path (MD5 vs config.passwordhash, `displayLogin`/`unlockProtection`) exists but is UNUSED in this build — relevant only if some other captured copy turns up genuinely password-locked.

## What this changes in the plans (deltas)
1. **Calibration source upgrade:** the 1:1 rebuild ported from the 2016 v0.682 payload; players REMEMBER the 2015 web build. `shsd3_web/` is now the era-faithful baseline — diff shared-engine classes (Player, combat, StatsManager equivalents) between 2015-web and 2016-mobile and settle divergences deliberately. Any rule that drifted 2015→2016 must be caught, not silently rebuilt from one side.
2. **Old-save lane (.sol import):** the save format/schema is now READABLE (`MainTimeline.sharedObject` + saving flows). Build Plans pending item "add .sol import to shs-solo" can move from concept to implementation design when unblocked.
3. **PvP/Solo backend:** `DuelModeUI`/`NetworkManager`/`ConnectionPIO`/`ConnectionP2P`/full playerio SDK = the arena protocol and duel rules are now readable text — the backend design can be grounded in the REAL match flow instead of reconstruction.
4. **Guest-mode / hut black-screen fixes** were runtime stubs around encrypted code; with the bytecode in hand, cause-level fixes (exact save routine, hut handler) become possible in the web build lineage.
5. **Build Plans app** card `shs-solo-duels` already carries the resolved decrypt item with the evidence summary (2026-11-07, 21:35 KL).

## Open next steps (owner: whichever harness picks this up)
1. Ruffle boot test of `reference/decrypted/shsd3_DUELS_decrypted.swf` — done means: game's own loading/menu screen renders (screenshot evidence, not just "runs").
2. 2015-web vs 2016-mobile logic diff for the shared engine — done means: written divergence list (or "none") feeding CALIBRATION.md.
3. `.sol` schema extraction from `shsd3_web` SharedObject usage — done means: documented field layout of the save file.
4. Version string hunt in `shsd3_web` (quick greps for v0.68x came up empty; the badge likely lives in loading-screen assets/XML) — confirms which v# this 2015 build actually is.
5. Known-not-recoverable (don't spend time): developer comments/source, PlayerIO server infrastructure.

## How this transfer is wired (harness reality, 2026-11-08)
- The ACP harness route from JClaw → Claude Code is dead for now (upstream login/credit wall on the Claude Code account — not a JClaw defect). This handoff therefore went the durable route: everything copied into THIS repo + this doc — so ANY future harness (CC in VS Code, ACP after re-sub, or JClaw itself) reads the same ground truth from here, not from JClaw's chat history.