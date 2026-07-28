/**
 * THE IDLE FIGHTER'S SHAPE REGISTRY (SESSION18 A4.4).
 *
 * `src/core/` cannot import generated art — `tests/config-purity.test.ts`
 * resolves every import and `src/game/` is out of bounds — so `planPose` takes
 * the shapes as a lookup and this is where that lookup is built. Hand-written,
 * so it is fully ratcheted: it holds no numbers beyond the ids, which ARE the
 * data.
 *
 * The 14 OG shapes here are exactly the ones `src/config/ogPose.ts`'s BARE slot
 * map names; the `SHAPE_90NN` shapes are the traced garments the DRESSED map
 * adds, and `2641` (the training branch) is the DRESSED fighter's starting
 * weapon (`OG_EQUIPMENT`, SESSION22 A9.6). `2662` (alt head) is in the corpus
 * but NOT in the fighter, and is deliberately absent.
 */
import type { ArtShape } from './types';
import { SHAPE_2641 } from './generated/shape2641';
import { SHAPE_2644 } from './generated/shape2644';
import { SHAPE_2646 } from './generated/shape2646';
import { SHAPE_2648 } from './generated/shape2648';
import { SHAPE_2650 } from './generated/shape2650';
import { SHAPE_2653 } from './generated/shape2653';
import { SHAPE_2655 } from './generated/shape2655';
import { SHAPE_2658 } from './generated/shape2658';
import { SHAPE_2664 } from './generated/shape2664';
import { SHAPE_2667 } from './generated/shape2667';
import { SHAPE_2670 } from './generated/shape2670';
import { SHAPE_2672 } from './generated/shape2672';
import { SHAPE_2674 } from './generated/shape2674';
import { SHAPE_2676 } from './generated/shape2676';
import { SHAPE_2678 } from './generated/shape2678';
/** SESSION19 A5.2/A5.3 — TRACED, not extracted. Ids >= 9000 are traced garments. */
import { SHAPE_9001 } from './generated/shape9001';
import { SHAPE_9011 } from './generated/shape9011';
import { SHAPE_9012 } from './generated/shape9012';
import { SHAPE_9014 } from './generated/shape9014';
import { SHAPE_9015 } from './generated/shape9015';
import { SHAPE_9017 } from './generated/shape9017';
import { SHAPE_9019 } from './generated/shape9019';

const ALL: readonly ArtShape[] = [
  SHAPE_2641,
  SHAPE_2644,
  SHAPE_2646,
  SHAPE_2648,
  SHAPE_2650,
  SHAPE_2653,
  SHAPE_2655,
  SHAPE_2658,
  SHAPE_2664,
  SHAPE_2667,
  SHAPE_2670,
  SHAPE_2672,
  SHAPE_2674,
  SHAPE_2676,
  SHAPE_2678,
  SHAPE_9001,
  SHAPE_9011,
  SHAPE_9012,
  SHAPE_9014,
  SHAPE_9015,
  SHAPE_9017,
  SHAPE_9019,
];

/** Keyed by each shape's OWN `id`, never by a hand-typed key — they cannot drift. */
export const FIGHTER_SHAPES: ReadonlyMap<number, ArtShape> = new Map(ALL.map((shape) => [shape.id, shape]));
