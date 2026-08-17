# Critic — items-equipment — LENS 3 (PRECEDENCE / stale-claiming)

Blind review. I did not see the surveyor's reasoning. Every verdict below carries an
artifact **I** opened. Frames were cropped and upscaled by me before grading (§0).

**Headline:** the survey is unusually well-cited — 15 of 20 claims held verbatim at the
exact line numbers given, and the two STILL_UNHELD answers are honest and correct. But
three claims commit the precedence error this lens exists to catch: **they source the
Android v0.682 decompile and then assert parity / completeness for the shipping web
v0.717 build, in the exact functions where the two builds diverge.** One of those is
fatal and it is load-bearing for the score.

Recommended score: **78 → 71.** Ledger blocker ⑤ is only half dead.

---

## FATAL — `no-separate-icon-manifest` is REFUTED. The icon manifest is still a blocker.

The claim: *"the inventory icon is composed from the SAME MCS part symbols as the
paperdoll … there is no separate icon art set to recover."*

The cite is real — `MCSItem.setArmor` (MCSItem.as:324-349) does composite stomach/pelvic/
torso/uparm/lowarm at published offsets, exactly as quoted. But the surveyor read one
method out of eleven. Two sibling methods in the **same class** draw from icon symbol
families that have **no PART_\* body counterpart at all**:

```
MCSItem.as:203  public function setConsumable(id:int) : *
                   this.displayItem = this.getMCSComponent("item",id);
                   if(this.displayItem == null) { this.displayItem = new item0(); ... }

MCSItem.as:226  public function setAccessory(id:int) : *
                   this.displayItem = this.getMCSComponent("acc",id);
                   if(this.displayItem == null) { this.displayItem = new AccessoryDummyIcon(); ... }
```

`getMCSComponent(partType, id)` resolves `partType + art` (MCSItem.as:406-437), so these
name the classes `item<art>` and `acc<art>`. Neither `"item"` nor `"acc"` appears in
`MCSCharacter`'s 27 PART_ constants. They are a second art pipeline, not the paperdoll one.

**THE FRAME WINS, and it settles this on its own.** I opened
`reference/frames/s21_weapon/t708.0.png`, crop (900,590)-(1640,960) upscaled ×2 LANCZOS.
The inventory grid holds **7 icons**: a branch, a red-capped scroll/tube, a blue feather,
an onigiri rice ball (×3), a katana, a black stone, a white feather. An onigiri is not a
`stomach + pelvic + torso + uparm + lowarm` stack. Neither is a scroll, a stone, or a
feather. Whatever a measurement of `setArmor` says, the frame shows icon art that cannot
come from the paperdoll parts.

Sizing it, counted this run over `reference/extracted/itemdata.xml`:
paperdoll-composited equipment bands (4000 armor 152 · 5000 gloves 35 · 6000 hair 73 ·
7000 hat 98 · 8000 head 38 · 9000 mask 60 · 10000 neck 14 · 11000 pants 93 ·
12000 shoes 55 · 13000 weapon 177) = **795 rows**. Everything else — band 2000 (99),
band 3000 (9), band 20000 quest (79) — is **~187 rows needing `item*`/`acc*` symbols**.

And accessories compound it: `EQ_ACCESSORY1`/`EQ_ACCESSORY2` are equipment, but there is
no ring/accessory index in the PART_ enum and `initMCS` is never passed them
(StatsManager.as:1765). Rings are **icon-only** — the very case the claim says cannot exist.

Consequence for the board: blocker ⑤'s *layer-order* half is genuinely dead (see below);
its *icon manifest* half is **alive and unchanged**. The 78 was priced on both halves.

---

## MATERIAL — two Android-parity assertions disproved by the web build they cite

### `rarity-is-derived-not-a-field` — the web v0.717 build has a colour tier Android does not

Derivation holds verbatim (Item.as:382-405) and all eight hexes are real in both builds.
But the claim says the web cross-check *"removes the S0-3 Android-parity caveat for them."*
It does the opposite. In the very function cited, the web build has a **higher-precedence
fifth state that the Android build lacks entirely**:

```
shs3_payload/scripts/§1t17s0§.as:679    _loc1_ += "<font color=\"#ff9900\">";   (loot palette)
shs3_payload/scripts/§1t17s0§.as:700    else if(this.xp != null)
                                        _loc1_ += "<font color=\"#ff6600\">";   (inventory palette)
```

Gated on `this.xp` — `§1t17s0§.as:42  internal var xp:§1t98s0§ = null;`. There is **no
`xp` member anywhere in the Android `Item` class** (`grep -n "this.xp" shs3_android/scripts/Item.as`
→ no hits; `grep -n "ff9900\|ff6600" shs3_android/scripts/Item.as` → no hits).

The claim's own cite list — `:683,687,691,704,708,712` — steps directly over 679 and 700.
A builder copying the Android 4-tier ladder ships a game missing a colour state that the
target build has. Also: the claim says "all six tier colours" and then enumerates eight.

### `item-save-format-held` — "copyable byte-for-byte" is false for the shipping build

The Android schema is exactly as quoted (Item.as:6-16, :47-104; MCSCharacter.as:348 is a
true 12-field pipe string). But the web v0.717 `Item` serializes **a sixth reserved
modifier ID the Android class does not define**:

```
§1t17s0§.as:18    public static var §1t8739s0§:int = 206;
§1t17s0§.as:304   _loc2_ += §1t8739s0§ + "@" + this.xp.§1t697s0§() + "#";
§1t17s0§.as:119 / :187 / :429   parse side
```

Android `Item.as:1-16` reserves 80 / 81 / 82 / 89 / 125 only. Round-tripping an Android-shaped
string through the web format silently drops the item's XP/soul payload.

Second omission, same claim: `Item.copyModifiers` (**Item.as:317-330**) blacklists four
further non-copyable modifier IDs the "five reserved IDs" list never mentions —
`if(modid != 85 && modid != 86 && modid != 87 && modid != 88)`.

The claim was already marked PARTIAL and its §6 overturn stands; it is the
*byte-for-byte* conclusion that is wrong.

---

## MINOR corrections (claims stand; the wording will mislead a builder)

**`sprite-compositing-contract-held` — the human part stack is 23 deep, not 27.**
The 27 PART_ constants are real and index *is* addChild order — but the constructor only
builds 23 of them:
```
MCSCharacter.as:120   internal var partListLength:int = 22;
MCSCharacter.as:141   for(var i:int = 0; i <= this.partListLength; i++) { ... addChild(mc); ... }
```
Indices 23-26 (`PART_l_shoulder`, `PART_r_shoulder`, `PART_l_knee`, `PART_r_knee`) are
**creature-rig only** — the sole readers are `MCSWolf.as:184,188,193,197`, and `MCSWolf.as:13`
raises `partListLength = 25` to reach them. So the equipment compositing contract the
score rationale calls "a 27-entry z-ordered PART_* enum" is a **23-layer** stack for the
human paperdoll. (Aside, do not copy blindly: with `partListLength = 25` the wolf builds
26 clips (0-25) yet `MCSWolf.as:193` reads `partList[PART_r_knee]` = index 26. Either the
decompile is off by one or the original throws; worth a note, not a claim.)

**`affix-suffix-pool-and-counts` — the "shipped bug" gloss is an unsupported inference,
and it is a 1:1 hazard.** Everything measurable holds: 13 prefix arrays × 8 = 104, 13
suffix arrays × 8 = 104, both distributions, the legendary `numEnchant--`, and the line
cites are exact to the line (I verified FIREDEF/WINDDEF/WATERDEF/EARTHDEF land on
ItemGenerator.as:142/143/144/145). But the reuse is not random:
```
FIREDEF  <- wateratk   ("Wet","Chill","Icy" … "of Frost","of Winter")
WATERDEF <- windatk
WINDDEF  <- earthatk
EARTHDEF <- fireatk
```
That is a consistent **elemental-opposition** mapping — fire resistance named "Icy … of
Frost" reads as deliberate design, not a swap error. Calling it a bug invites a builder to
"fix" it and diverge from 1:1. Downgrade to "cross-mapped by opposition; copy as-is".

**`stat-vs-level-curve` — "complete 158-row ladder (minlvl -4..79)" is 3 rows loose.**
Measured: `grep -c "<mindamage>"` = **158**, `grep -c "<minlvl>"` = **155**. minlvl domain
is genuinely -4 … 79. Both cited rows (13002 at :7906, 13225 at :9925) are verbatim.
Say "158 damage-bearing rows, 155 of which carry minlvl".

**`eq-comparison-frame-payload-identity` — the stated crop does not contain half of what
it claims to show.** I rendered the exact stated crop, (1320,240)-(1620,320) upscaled ×4:
it contains `DMG: 1 - 2 (EQ: 1 - 3)` with the 2 in red, and `WEIGHT: 1`. It does **not**
contain "BRANCH" or "LEVEL 1" — those sit at x≈1050-1120 in the original, outside the
stated x-range. Both are in the frame (I confirmed on the full plate), so the finding is
true and the identity check is genuinely the cleanest in this system — but §0 requires the
crop to be stated correctly, and this one is not.

**`condition-has-no-damage-multiplier` — the "nowhere" proof is Android-only by
construction.** I re-ran it across all 559 Android scripts: `getCondition` occurs at
exactly `Item.as:714` (getDesc) and `Item.as:1481` (definition). Nothing else. The web
build cannot be grepped by name (obfuscated), so "no multiplier anywhere" is provable only
for v0.682 — though the web build's condition ladder is structurally identical
(§1t17s0§.as:1005-1025), which makes the risk low. Worth carrying as a caveat, not a defect.

---

## Verified clean (opened and matched, no correction)

| claim | what I opened |
|---|---|
| `sell-price-formula` | Item.as:1582-1593 **and** §1t17s0§.as:1977-1988 — both verbatim, line-exact. Two-build confirmation is real. |
| `sell-price-corrects-section3-item9` | REBUILD_READINESS.md:168 quoted verbatim; formula carries no level term. |
| `condition-tier-thresholds` | Item.as:712-746 + §1t17s0§.as:1005-1025 + strings.json 387-392/639 all resolve exactly as quoted. |
| `soul-infusion-is-code` | CraftingUI.as:494-525 verbatim, incl. `LangManager.getString(698)` = "Both items must be of the same type". |
| `paperdoll-is-13-slots-not-9` | **I counted the boxes myself.** Frame `s21_weapon/t708.0.png`, crop (170,240)-(870,1040) ×2 LANCZOS: exactly 9 boxes — kasa (filled), oni-mask outline, grey haori, gauntlet outlines, white hakama, pickaxe, ring outline, sandals, ring outline, around a "GUEST" fighter. Code side confirmed: `Vector.<Item>(13)` (StatsManager.as:108), 13 EQ_ constants (:262-286), 11 passed to `initMCS` (:1765). Honest PARTIAL, correctly reasoned. |
| `purple-border-is-unique-not-rarity` | GameEngine.as:572 verbatim. I sampled the frame myself over (900,590)-(1640,960): RGB(144,102,203) present 48×; 2 of 7 icons bordered. |
| `defense-min-floor-is-wrong` | EnemyPlayer.as:107-123 verbatim; ledger bullet at REBUILD_READINESS.md:209 says "defense min-floor (EnemyLevel/4)". Correct catch — it is `playerLVL`, four bands, divisors 1/8/6/4, inside boss auto-scaling. |
| `weight-cap-is-a-base-not-a-cap` | StatsManager.as:2298-2301 and BankUI.as:264 verbatim; I rendered crop (1400,540)-(1780,600) ×4 and it reads `WEIGHT: 43 / 100`. |
| `modifier-id-stat-table` | XMLItem.as:231-298 + strings.json — spot-checked 110/111/116/117/118/121/122/123/124/125/59/63/64/102, all resolve as stated. |
| `slashusage-stancerestriction-omitted` | Counted myself: 106 `<slashusage>` rows = 24(×1)/72(×70)/96(×35); 53 `<stancerestriction>` = 4(×7)/6(×46). XMLItem.as:152-159 default 48 ✓; StatsManager getSlashUsage / getBaseSlashLengthVal ✓. Best hand-off in the set. |
| `ui-slot-mapping-unknown` | Correct STILL_UNHELD. In my own paperdoll crop the two ring boxes are visually identical unlabelled outlines. |
| `per-item-art-payload-unknown` | Correct STILL_UNHELD, and my check strengthens it: the web payload exports **only default classes** — `item0.as`, `torso4000`, `stomach4000`, `hair6000/6001`, `head8000/8004`, `weapon13000/13002`, `foottop12000` … across 652 scripts there is no `item<art>` beyond `item0` and no `acc*` at all. |

---

## Score

78 assumed blocker ⑤ fully resolved. Half of it — the layer-order / symbol-name contract —
genuinely is, and that is a real gain. The icon manifest half is not, and ~187 roster rows
plus every accessory still need art that does not exist in any held artifact. Two further
claims mis-state web-build parity in ways a builder would ship.

**71**, with blocker ⑤ rewritten as: *"layer order + symbol-name contract HELD (23-layer
human stack); item/accessory icon symbol families `item*` / `acc*` STILL UNHELD."*
