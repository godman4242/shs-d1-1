# FIGHTER ART IDS — SESSION 15 A1

**Status: A1 GATE GREEN (2026-07-26).** Every shape ID below is cited to the
decompiled line that names it. No ID was obtained by eyeballing the contact
sheet, per SESSION15 D5.

**Headline: the fighter is CODE-ASSEMBLED from 21 named body-part classes, and
all of its art is recoverable.** P5's suspicion was right; §6 Risk 1 declared
that a successful outcome, and it turned out to be the *good* case — the parts
resolve to **16 distinct vector shapes, 100 % flat solid fill**, and the poses
that arrange them are embedded in the payload as XML.

> **Provenance for everything here**
> - Code: `reference/decompiled/shs3_payload/scripts/` (1,079 `.as`, source dive).
> - Shapes: `reference/extracted/shapes/<id>.svg` (FFDec `-export shape`, §P1).
> - Structure: `reference/extracted/payload.xml` (FFDec `-swf2xml`, §P2).
> - Poses: `reference/extracted/bindata/` — new this session:
>   ```
>   FFDEC_MEMORY=12g reference/tools/ffdec/ffdec.sh -export binaryData \
>     reference/extracted/bindata reference/decrypted/shs3_payload_decoded.swf
>   ```
>   → **27 `DefineBinaryData`, exit 0, 3.5 s.**
> - All of `reference/` is gitignored and stays local (§P6).

---

## 1 · The two classes that matter

| Symbol | characterId | What it is |
|---|---:|---|
| **`§1t75s0§`** | 2640 | **THE FIGHTER.** 23 slot containers, 10 equipment params. |
| `§1t74s0§` | 1160 | The **bust/portrait** doll (head+shoulders only). Not the fighter. |

`§1t75s0§`'s constructor builds the slots as bare containers, which is what makes
it a paper doll rather than a drawn figure:

```as3
var _loc1_:int = 0;
while(_loc1_ <= this.§1t6256s0§)          // §1t6256s0§ = 22  ⇒ slots 0..22
{
   _loc2_ = new MovieClip();
   addChild(_loc2_);                      // creation order == z-order, 0 at back
   this.§1t6231s0§.push(_loc2_);
}
```

Parts are then instantiated **by name at runtime** — the line that makes this an
ID problem rather than a drawing problem (`§1t75s0§.§1t6238s0§`):

```as3
ClassDefinition = Class(getDefinitionByName(partType + art.toString()));
```

⚠️ **Do not mistake shape `1813` for the fighter.** It is a 64.9 × 226 px,
6,082-record single-piece figure — but its only parent, sprite `1814`, places it
beside a sibling instance literally named **`titlelabel`**. It is the
**title-screen illustration**.

---

## 2 · THE SHAPE ID LIST — each with the code line that names it

Slot indices are the `§1t75s0§` static constants; the shape is reached
`class → DefineSprite → PlaceObject2 → DefineShape` (every part sprite is a
1-frame wrapper around exactly one shape).

| Slot | Part | Class | Sprite | **Shape** | Size px | Fills | Naming line (file · function) |
|---:|---|---|---:|---:|---|---|---|
| 0 | hand (far) | `hand5000` | 2668 | **2667** | 11.3×12.8 | 2/2 solid | `§1t75s0§.§1t6262s0§` · `§1t6238s0§("hand",param1)` |
| 1 | uparm (far) | `uparm4000` | 2645 | **2644** | 14.2×28.1 | 2/2 solid | `§1t75s0§.§1t6245s0§` · `§1t6238s0§("uparm",param1)` |
| 2 | lowarm (far) | `lowarm4000` | 2659 | **2658** | 10.6×20.1 | 2/2 solid | `§1t75s0§.§1t6245s0§` · `§1t6238s0§("lowarm",param1)` |
| 3 | weapon | `weapon13000` | 2643 | *(empty)* | — | — | `§1t75s0§.§1t6265s0§` · `§1t6238s0§("weapon",param1)` |
| 4 | prop | `prop13000` | 2652 | *(empty)* | — | — | `§1t75s0§.§1t6266s0§` · `§1t6238s0§("prop",param1)` |
| 5 | foot (far) | `foot12000` | 2675 | **2674** | 17.9×8.9 | 1/1 solid | `§1t75s0§.§1t6263s0§` · `§1t6238s0§("foot",param1)` |
| 6 | thigh (far) | `thigh11000` | 2649 | **2648** | 16.1×36.7 | 2/2 solid | `§1t75s0§.§1t6264s0§` · `§1t6238s0§("thigh",param1)` |
| 7 | calf (far) | `calf11000` | 2679 | **2678** | 13.3×18.9 | 2/2 solid | `§1t75s0§.§1t6264s0§` · `§1t6238s0§("calf",param1)` |
| 7 | foottop (far) | `foottop12000` | 2673 | **2672** | 8.9×11.6 | 3/3 solid | `§1t75s0§.§1t6263s0§` · `§1t6238s0§("foottop",param1)` |
| 8 | crotch | `crotch11000` | 2677 | **2676** | 17.6×15.6 | 1/1 solid | `§1t75s0§.§1t6264s0§` · `§1t6238s0§("crotch",param1)` |
| 9 | foot (near) | `foot12000` | 2675 | **2674** | 17.9×8.9 | 1/1 solid | `§1t75s0§.§1t6263s0§` · second `("foot",param1)` |
| 10 | thigh (near) | `thigh11000` | 2649 | **2648** | 16.1×36.7 | 2/2 solid | `§1t75s0§.§1t6264s0§` · second `("thigh",param1)` |
| 11 | calf (near) | `calf11000` | 2679 | **2678** | 13.3×18.9 | 2/2 solid | `§1t75s0§.§1t6264s0§` · second `("calf",param1)` |
| 11 | foottop (near) | `foottop12000` | 2673 | **2672** | 8.9×11.6 | 3/3 solid | `§1t75s0§.§1t6263s0§` · second `("foottop",param1)` |
| 12 | neck | `neck10000` | 2656 | **2655** | 11.8×17.6 | 1/1 solid | `§1t75s0§.§1t6244s0§` · `§1t6238s0§("neck",param1)` |
| 13 | stomach | `stomach4000` | 2651 | **2650** | 16.4×19.2 | 3/3 solid | `§1t75s0§.§1t6245s0§` · `§1t6238s0§("stomach",param1)` |
| 14 | pelvic | `pelvic4000` | 2654 | **2653** | 22.4×19.1 | 2/2 solid | `§1t75s0§.§1t6245s0§` · `§1t6238s0§("pelvic",param1)` |
| 15 | torso | `torso4000` | 2647 | **2646** | 21.4×25.7 | 2/2 solid | `§1t75s0§.§1t6245s0§` · `§1t6238s0§("torso",param1)` |
| 16 | head | `head8000` | 2665 | **2664** | 14.3×16.9 | 1/1 solid | `§1t75s0§.§1t6239s0§` · `§1t6238s0§("head",param1)` |
| 16 | hair | `hair6000` | 2671 | **2670** | 14.2×15.1 | 1/1 solid | `§1t75s0§.§1t6242s0§` · `§1t6238s0§("hair",param1)` |
| 17 | hat | `hat7000` | 2666 | *(empty)* | — | — | `§1t75s0§.§1t6240s0§` · `§1t6238s0§("hat",param1)` |
| 18 | hand (near) | `hand5000` | 2668 | **2667** | 11.3×12.8 | 2/2 solid | `§1t75s0§.§1t6262s0§` · second `("hand",param1)` |
| 19 | uparm (near) | `uparm4000` | 2645 | **2644** | 14.2×28.1 | 2/2 solid | `§1t75s0§.§1t6245s0§` · second `("uparm",param1)` |
| 20 | lowarm (near) | `lowarm4000` | 2659 | **2658** | 10.6×20.1 | 2/2 solid | `§1t75s0§.§1t6245s0§` · second `("lowarm",param1)` |
| — | mask | `mask9000` | 2657 | *(empty)* | — | — | `§1t75s0§.§1t6243s0§` · `§1t6238s0§("mask",param1)` |

**Also embedded, reachable only by item art id (no code reference):**

| Class | Sprite | **Shape** | Size px | Fills | Note |
|---|---:|---:|---|---|---|
| `weapon13002` | 2642 | **2641** | 70.3×15.5 | 3/3 solid | the wooden branch / training weapon |
| `head8004` | 2663 | **2662** | 15.4×16.9 | 8/8 solid | alt head; the **bust** doll's fallback (`§1t74s0§.§1t6239s0§`) |
| `hair6001` | 2669 | *(empty)* | — | — | the "bald" placeholder |

### The 16 distinct leaf shapes

```
2641 2644 2646 2648 2650 2653 2655 2658
2662 2664 2667 2670 2672 2674 2676 2678
```

**Fill census over all 16: 36 fill styles, 36 solid, 0 gradient, 0 bitmap
— 100 % flat solid colour.** SESSION15 **D3 (mean-colour gradient
approximation) and D4 (bitmap fills) are both MOOT for this target**; nothing
in the fighter needs either. §2's bar B (byte-exact colour) is therefore
achievable with no approximation whatsoever.

### The five empty sprites are deliberate, not missing art
`weapon13000`, `prop13000`, `hat7000`, `mask9000`, `hair6001` contain zero
shapes **because they are the game's own "none" placeholders** — the code says
so directly. From `§1t74s0§.§1t1549s0§`:

```as3
this.§1t6236s0§ = _loc9_ > 0 && _loc9_ != 7000 && _loc9_ != 7049;   // 7000 == no hat
```
and from `§1t6241s0§`:
```as3
if(param1 == 6001 || param1 <= 0) { _loc3_ = 6001; }                // 6001 == bald
```
`weapon13000` is the unarmed fallback (`§1t6265s0§`: `_loc5_ = new weapon13000()`).

---

## 3 · The idle pose is ALSO recoverable — and it is data, not geometry

Poses live in **19 embedded XML blobs** (`§1t4627s0§`…`§1t4645s0§`, loaded by
`§1t75s0§.§1t12425s0§`), now exported to `reference/extracted/bindata/`.
**487 `<anim>` elements → 482 unique names**; the 5 duplicates
(`walkwithspear`, `spearbowjump`, `spearbowdropdown`, `chargewithspear`,
`mining`) collapse because `§1t12425s0§` keys a dictionary by name, so the
last one loaded wins. That reconciles the 482 in the older
`reference/extracted/anim_xml.txt` index exactly.
`108_1t4635s0.bin` holds the 158 human animations.

Each frame is a node list; each node is a **slot index + translation + rotation**:

```xml
<anim i="idle" d="1">
  <f i="0">
    <n i="20" x="-10" y="-64" r="-9"></n>    <!-- slot 20 = lowarm (near) -->
    ...
    <n i="0"  x="0"   y="-56" r="-54"></n>   <!-- slot  0 = hand   (far)  -->
  </f>
</anim>
```

`§1t1360s0§.setPosition` gives the exact semantics — **`x`/`y` are plain pixels
and `r` is degrees** (the `a`/`b`/`c`/`d` branch is used only when `r` is absent,
and those are ÷100):

```as3
param1.x = this.x;  param1.y = this.y;  param1.rotation = this.rotation;
```

⭐ **Two slots are aliased in code, which is why no animation ever carries a node
for them** (`§1t59s0§.setPosition`):

```as3
if(_loc4_ == §1t75s0§.§1t12391s0§)        // node 14 (pelvic)
   _loc3_.setPosition(param1.§1t6258s0§(§1t75s0§.§1t12385s0§));   // ALSO slot 8 (crotch)
else if(_loc4_ == §1t75s0§.§1t12393s0§)   // node 16 (head)
   _loc3_.setPosition(param1.§1t6258s0§(§1t75s0§.§1t12394s0§));   // ALSO slot 17 (hat)
```

Found the hard way: composing without this leaves the crotch stranded at the
origin — a tan blob at the fighter's feet. **A4 must apply 8←14 and 17←16.**

Two more rules from the same class, both needed by A4:
- **`setVisible`** — every slot *not* in the frame's node list is hidden, then
  slots 17 and 8 are forced visible again.
- **`reorderLayers`** — z-order is creation order (slot 0 at the back) *unless*
  the frame carries `r="1"`, in which case the node list order wins. Note
  `§1t59s0§`'s constructor pushes nodes in **reverse** document order.

**Poses the duel needs, all present and all 1-frame:** `idle`,
`lightstanceidle`, `balancedstanceidle`, `heavystanceidle`, plus
`light_stance` / `balanced_stance` / `heavy_stance` / `dual_stance` /
`reversed_stance`, `walk`, `run_sheathed`, the three per-stance runs, the
slash `_parta…parte` chains, `death`, `downed`, `backstep`, `forwardstep`.

---

## 4 · A1 VERIFICATION — it renders as a samurai

Composing the 16 shapes at the recorded node transforms produces six correct,
correctly-jointed fighter poses on the first attempt (scratchpad only — no
committed source; the real converter is A2):

`idle · balanced_stance · light_stance · heavy_stance · balancedstanceidle · walk`

This is the check that the ID list is *right*, not merely *cited*. The
`light_stance` crouch and the `heavy_stance` overhead read exactly as the OG's
do, and the limb joints line up with no manual nudging — which independently
confirms both the slot→part map and the pixel/degree reading of the node data.

---

## 5 · ⚠️ THE HONEST LIMIT — equipment art died with the CDN

`§1t1523s0§.§1t9494s0§` defaults to **`true`**, and when it is true
`§1t75s0§.§1t6238s0§` never touches the embedded classes at all:

```as3
public static var §1t9494s0§:Boolean = true;      // §1t1523s0§
...
if(§1t1523s0§.§1t9494s0§)                          // §1t75s0§.§1t6238s0§
{
   return §1t1522s0§.§1t6238s0§(partType,art);     // external Loader / URLRequest
}
```

`§1t1522s0§` is a `flash.display.Loader` + `URLRequest` asset streamer. In the
live game **all part art was fetched from the server**; the 21 embedded classes
are the offline fallback.

**Checked, and the art is not anywhere else:**
- No part-art SWFs in `reference/preservation/` — only `shs3.swf`,
  `shs3preloader.swf`, `shs3_payload.swf`, `shs3_android_payload.swf`,
  `shs3_payload_version.swf`.
- **The 15 MB Android payload carries the *same 21 default classes and no
  more***, so the trick that recovered the 495-row enemy table does not work
  here.

⇒ **What we have is the base body** — bare torso, bare head, no hat, no armour,
no katana. It is a complete, correctly-jointed fighter, and it is the *only*
fighter art that survives. Equipment variants (`torso4001+`, `hat7001+`,
real weapons) are **unrecoverable**, exactly like the dead Player.IO backend.

> **Decide-and-flag:** SESSION 15 grades §2's ≥90 % IoU against the **base
> body**, and the study frames must be chosen to match — an unequipped fighter.
> *Why:* it is the only OG fighter art in existence, and inventing a hat to
> close a silhouette gap would be the measure-first violation this project
> reverts on sight. *Veto:* supply an archived part-art SWF and this reopens.

⚠️ **This changes what "1:1 art" can mean for equipped characters, and the owner
should know**: the straw hat in the game's own title is not in the payload.

---

## 6 · What A2 needs, now settled

1. **Convert 16 shapes, not 1,822** — and all 16 are flat solid fill.
2. **Curve flattening is the only real converter problem.** Across all 16
   shapes the path command set is exactly **`M L Q Z`** — quadratic only (SWF
   has no cubics), so one quadratic subdivision routine covers everything, and
   `Z` means every contour is explicitly closed.
3. **Shape-local origin = the joint pivot.** FFDec offsets each SVG by its own
   bounds; the shape's true origin is at `(-Xmin/20, -Ymin/20)` px inside the
   SVG viewport. Verified against `payload.xml`'s `<shapeBounds>` for all 16.
   **Getting this wrong is §3.4's "recognisable failure" in a subtler form** —
   parts land at plausible-but-wrong offsets instead of being 20× too big.
4. **Twips → px is ÷20** and is already applied in the `.svg` files themselves;
   `payload.xml` is raw twips. Do not divide twice.
5. Fill colours are `<color type="RGB…">` in `payload.xml`, byte-exact — §2 B
   needs no approximation for this target.
