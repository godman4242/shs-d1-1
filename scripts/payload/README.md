# scripts/payload/ — the three crackers that turn the shipped SWF into the payload

**Tracked mirror of `reference/tools/*.py`.** These are ORIGINAL work by this project —
not Lut Games assets — so they carry no distribution question and belong in git. They lived
only under gitignored `reference/` until 2026-08-24, which meant 295 lines of
reverse-engineering had no copy anywhere off this disk.

| Script | Implements |
|---|---|
| `payload_decode.py` | the stage-3 preloader transform, read verbatim out of `shs3preloader_fla.MainTimeline` method `§1t136s0§`, key = 104 |
| `swfdefender_unwrap.py` | SWF Defender (magichtml.com) unwrapper; config layout read out of the decompiled `la` class |
| `tinyloader_crack.py` | the RC4 scheme from `shs3.swf`'s `lb` class — key is the blob's own last 8 bytes, only the first 64 bytes are encrypted |

⚠️ **Run them from `reference/tools/`, not here.** L0's banked evidence cites that path
(`docs/research/fidelity/SOURCE_CONSTANTS.md:95-97`, `docs/gauntlet/L0/LEDGER_EVIDENCE.md`,
several critic files), and the kickoff's §6 forbids invalidating banked cites. This copy
exists to survive a disk loss, not to be the working path. If you edit one, edit both.
