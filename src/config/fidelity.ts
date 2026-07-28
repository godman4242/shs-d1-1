/**
 * FIDELITY — measured reference assertions from the original game's frames.
 * Pure data, no logic.
 *
 * All values are CONTRACT: measured off 1920×1080 study frames of the
 * original (video B = Nr4fQstqHDM, segment B-23 VS-duel window t=3771–3783 s;
 * median across 3–4 frames, per-point spread ≤ a few counts unless noted).
 * Colors carry YouTube-codec headroom in `tol` (per-channel 0–255); the
 * archived lossless wiki PNGs are the planned v2 refinement source
 * (docs/research/reference-sources.md).
 *
 * Coordinates are FRACTIONS of the stage (origin top-left), measured on the
 * original's full-bleed 16:9 frame — they transfer 1:1 to our 1024×576 stage.
 * Each probe asserts "this exact color sits at this exact spot", so a probe
 * doubles as a position pin: a mispositioned element fails its color probe.
 *
 * Sampling states (dev-only harness, src/game/fidelity.ts):
 * - 'fighting'     — combat live, a few seconds in: HP/Chi full (spawn
 *                    invulnerability is still up, so nothing has landed) and
 *                    Focus PARTIALLY filled. ⚠️ It used to be "t≈0, full
 *                    Focus"; SESSION13 D4 made the meter start EMPTY with its
 *                    first 48 units invisible, so t≈0 now shows a blank pill
 *                    while the probe below was measured mid-fight.
 * - 'result-win'   — the YOU WIN card.
 * - 'result-defeat' — the YOU WERE DEFEATED card (A-22 world defeat is the
 *   only capture; the VS-duel defeat variant is unverified — noted per probe).
 * - 'vs-intro'     — DuelIntro held at the VS beat (black band + red glyph).
 * - 'fight-splash' — DuelIntro held at the FIGHT! beat (band + orange glyph).
 */
export type FidelityState =
  | 'fighting'
  | 'result-win'
  | 'result-defeat'
  | 'vs-intro'
  | 'fight-splash';

export interface FidelityProbe {
  readonly id: string;
  /** Canonical render state this probe samples. */
  readonly state: FidelityState;
  /** Normalized stage coords — fraction of width/height, origin top-left. */
  readonly x: number;
  readonly y: number;
  /** Expected sRGB at that point, 0–255 per channel. */
  readonly rgb: readonly [number, number, number];
  /** Max per-channel delta tolerated (video-codec headroom). */
  readonly tol: number;
  /** Provenance: source frame timestamp + landmark. */
  readonly note: string;
}

export const FIDELITY_PROBES: readonly FidelityProbe[] = [
  // ── AUTO SLASH OFF plate (top-left parchment box, box (74,24)–(367,85)) ──
  {
    id: 'plate-fill',
    state: 'fighting',
    x: 0.1302,
    y: 0.0352,
    rgb: [84, 44, 6],
    tol: 26,
    note: 'B t=3772-3776 (62:52-62:56) AUTO SLASH OFF plate fill above the text row (spread ≤2; first sampling at y=0.0417/0.0509 caught glyph AA — re-measured)',
  },
  {
    id: 'plate-fill-left',
    state: 'fighting',
    x: 0.0469,
    y: 0.037,
    rgb: [84, 44, 8],
    tol: 26,
    note: 'B t=3772-3776 plate fill left of the text start (spread ≤2)',
  },

  // ── Player HP bar (x 246→513, y 972→989; fill green #02990b) ──
  {
    id: 'hp-bar-left',
    state: 'fighting',
    x: 0.1406,
    y: 0.9102,
    rgb: [2, 153, 11],
    tol: 24,
    note: 'B t=3772-3776 HP fill near left edge (spread ≤3)',
  },
  {
    id: 'hp-bar-right-end',
    state: 'fighting',
    x: 0.263,
    y: 0.9102,
    rgb: [2, 153, 11],
    tol: 24,
    note: 'B t=3772-3776 HP fill just inside right end — pins bar LENGTH at full HP',
  },

  // ── Player Chi bar (same span, y 1005→1017; fill blue #2e49e2) ──
  {
    id: 'chi-bar-left',
    state: 'fighting',
    x: 0.1458,
    y: 0.9361,
    rgb: [46, 73, 226],
    tol: 24,
    note: 'B t=3772-3776 blue bar fill near left edge (zero spread)',
  },
  {
    id: 'chi-bar-right-end',
    state: 'fighting',
    x: 0.263,
    y: 0.9361,
    rgb: [46, 73, 226],
    tol: 24,
    note: 'B t=3772-3776 blue bar fill just inside right end — pins bar LENGTH',
  },

  // ── Bar gradient pins (the bars are vertically shaded — see BAR_GRADIENTS) ──
  {
    id: 'hp-bar-gradient-top',
    state: 'fighting',
    x: 0.1406,
    y: 0.9023,
    rgb: [58, 181, 95],
    tol: 24,
    note: 'B t=3772-3776 HP fill top row (974) — bright end of the vertical gradient',
  },
  {
    id: 'hp-bar-gradient-bottom',
    state: 'fighting',
    x: 0.1406,
    y: 0.9139,
    rgb: [0, 154, 3],
    tol: 24,
    note: 'B t=3772-3776 HP fill bottom row (987) — deep end of the gradient',
  },
  {
    id: 'chi-bar-gradient-top',
    state: 'fighting',
    x: 0.1458,
    y: 0.9296,
    rgb: [82, 114, 234],
    tol: 24,
    note: 'B t=3772-3776 blue fill top row (1004) — light end of the gradient',
  },
  {
    id: 'chi-bar-gradient-bottom',
    state: 'fighting',
    x: 0.1458,
    y: 0.9417,
    rgb: [27, 36, 207],
    tol: 24,
    note: 'B t=3772-3776 blue fill bottom row (1017) — deep end of the gradient',
  },

  // ── Focus strip (white pill, y ≈1030→1045, left-aligned with bars) ──
  {
    id: 'focus-strip-left',
    state: 'fighting',
    x: 0.1432,
    y: 0.9593,
    rgb: [238, 238, 238],
    tol: 24,
    note: 'B t=3774 white focus pill near left edge (fill length varies in-fight)',
  },

  // ── Portrait ring (center ≈(161,1021), outer r≈64, ring red #950d00) ──
  {
    id: 'portrait-ring-left',
    state: 'fighting',
    x: 0.0563,
    y: 0.9454,
    rgb: [149, 13, 0],
    tol: 26,
    note: 'B t=3772-3776 ring band, left of center (spread ≤6)',
  },
  {
    id: 'portrait-ring-right',
    state: 'fighting',
    x: 0.1203,
    y: 0.9324,
    rgb: [139, 19, 10],
    tol: 26,
    note: 'B t=3772-3776 ring band, right of center (spread ≤4; cross-checked A-28 scan: center ≈(170,1007) r≈63)',
  },

  // ── Skill slots (3 squares ≈108px: x 1462/1585/1722, y 957→1070) ──
  {
    id: 'slot1-interior',
    state: 'fighting',
    x: 0.7813,
    y: 0.9167,
    rgb: [19, 19, 19],
    tol: 18,
    note: 'B t=3772-3776 slot 1 dark interior beside kunai icon (zero spread)',
  },
  {
    id: 'slot2-interior-corner',
    state: 'fighting',
    x: 0.8344,
    y: 0.9769,
    rgb: [0, 0, 0],
    tol: 18,
    note: 'B t=3772-3776 slot 2 bottom-left interior corner (zero spread)',
  },
  {
    id: 'slot3-interior-corner',
    state: 'fighting',
    x: 0.9063,
    y: 0.9769,
    rgb: [0, 0, 0],
    tol: 18,
    note: 'B t=3772-3776 slot 3 bottom-left interior corner (zero spread)',
  },
  {
    id: 'slot-border-top',
    state: 'fighting',
    x: 0.7896,
    y: 0.888,
    rgb: [49, 49, 49],
    tol: 20,
    note: 'B t=3772-3776 slot 1 grey border, top edge (spread ≤1)',
  },

  // ── YOU WIN card (flat red field + dark silhouette band) ──
  {
    id: 'win-bg-left',
    state: 'result-win',
    x: 0.1563,
    y: 0.1852,
    rgb: [153, 0, 0],
    tol: 20,
    note: 'AUTHORED #990000 — byte-exact in lossless archive shots (A5.PNG ×2 pts, Wiki14.PNG, A8 combo numeral); video read #a30e00 (codec shift of this). B t=3783 flat-field cross-check',
  },
  {
    id: 'win-bg-right',
    state: 'result-win',
    x: 0.8333,
    y: 0.1852,
    rgb: [153, 0, 0],
    tol: 20,
    note: 'Same authored #990000 (see win-bg-left provenance; B t=3783 flat-field cross-check), right side',
  },
  {
    id: 'win-silhouette-band',
    state: 'result-win',
    x: 0.1563,
    y: 0.8611,
    rgb: [0, 0, 0],
    tol: 16,
    note: 'B t=3783.2-3783.8 tableau band interior (300,930) — RE-MEASURED slice 2b: three frames read (0,1,0); the v1 olive (25,34,9) did not reproduce (assertion follows measurement). Band top has a soft dark-red fade y 882-896, so the point sits deeper at y=930',
  },

  // ── VS-intro beat (B-23: black center band over the live arena, red VS
  //     glyph, names in-band; measured off 60fps dense frames ×3) ──
  {
    id: 'vs-band-fill-left',
    state: 'vs-intro',
    x: 0.3438,
    y: 0.4815,
    rgb: [0, 0, 0],
    tol: 16,
    note: 'B t=3771.55-3772.55 band interior at clear column (660,520) — pure #000, zero spread; band spans rows 448-584 @1080',
  },
  {
    id: 'vs-band-fill-right',
    state: 'vs-intro',
    x: 0.6146,
    y: 0.4815,
    rgb: [0, 0, 0],
    tol: 16,
    note: 'B t=3771.55-3772.55 band interior at clear column (1180,520), zero spread',
  },
  {
    id: 'vs-band-fill-edge',
    state: 'vs-intro',
    x: 0.0208,
    y: 0.4815,
    rgb: [0, 0, 0],
    tol: 16,
    note: 'B t=3771.55-3772.55 band reaches the screen edge — (40,520) black in all frames (full-width band, no inset)',
  },
  {
    id: 'vs-glyph-core-v',
    state: 'vs-intro',
    x: 0.4583,
    y: 0.4815,
    rgb: [255, 24, 0],
    tol: 24,
    note: 'B t=3771.55-3772.55 VS glyph stroke interior (880,520), stable ×3; glyph bbox (754,392)-(1118,640) @1080',
  },
  {
    id: 'vs-glyph-core-s',
    state: 'vs-intro',
    x: 0.5208,
    y: 0.4444,
    rgb: [255, 24, 0],
    tol: 24,
    note: 'B t=3771.55-3772.55 VS glyph S-curve interior (1000,480), reads (255,23-24,0) ×3',
  },

  // ── FIGHT! beat (same band, orange gradient glyph; VS-duel build has NO
  //     letterbox — video A world-fight adds one, duel layout truth is B) ──
  {
    id: 'fight-band-fill-left',
    state: 'fight-splash',
    x: 0.3333,
    y: 0.4815,
    rgb: [0, 0, 0],
    tol: 16,
    note: 'B t=3773.48-3773.65 band interior (640,520) during the FIGHT! beat — same rows 448-584 band as the VS beat',
  },
  {
    id: 'fight-band-fill-right',
    state: 'fight-splash',
    x: 0.6771,
    y: 0.4815,
    rgb: [0, 0, 0],
    tol: 16,
    note: 'B t=3773.48-3773.65 band interior (1300,520), zero spread',
  },
  {
    id: 'fight-glyph-upper',
    state: 'fight-splash',
    x: 0.4318,
    y: 0.4741,
    rgb: [255, 109, 0],
    tol: 26,
    note: 'B t=3773.48-3773.65 FIGHT! F-stem interior (829,512) — upper anchor of the vertical gradient; glyph bbox (824,492)-(1090,572) @1080, stable ×3',
  },
  {
    id: 'fight-glyph-lower',
    state: 'fight-splash',
    x: 0.4318,
    y: 0.5093,
    rgb: [255, 181, 0],
    tol: 26,
    note: 'B t=3773.48-3773.65 FIGHT! F-stem interior (829,550) — lower gradient anchor, stable ×3',
  },

  // ── YOU WERE DEFEATED card (A-22 world defeat, t=3361-3364.3; the only
  //     defeat capture — VS-duel defeat variant unverified, flagged) ──
  {
    id: 'defeat-field-left',
    state: 'result-defeat',
    x: 0.1563,
    y: 0.35,
    rgb: [153, 0, 0],
    tol: 20,
    note: 'AUTHORED #990000 — A t=3361-3364 defeat field reads (163,14,0) ×3, the identical codec shift as the win card (win-bg-left provenance); point (300,378) clears headline/splash/buttons',
  },
  {
    id: 'defeat-field-right',
    state: 'result-defeat',
    x: 0.8333,
    y: 0.35,
    rgb: [153, 0, 0],
    tol: 20,
    note: 'Same authored #990000, right side (1600,378); A t=3361-3364 ×3',
  },
  {
    id: 'defeat-border-left',
    state: 'result-defeat',
    x: 0.013,
    y: 0.5,
    rgb: [0, 0, 0],
    tol: 16,
    note: 'A t=3361-3364 black pillar left of the field (25,540); field starts x=56 in A, x=53 in the B win card (shared card system, ≤4px build jitter)',
  },
  {
    id: 'defeat-border-right',
    state: 'result-defeat',
    x: 0.9896,
    y: 0.5,
    rgb: [0, 0, 0],
    tol: 16,
    note: 'A t=3361-3364 black pillar right of the field (1900,540); field ends x=1861 in A / 1865 in B',
  },
  {
    id: 'defeat-splash-dark',
    state: 'result-defeat',
    x: 0.4688,
    y: 0.4352,
    rgb: [34, 3, 0],
    tol: 24,
    note: 'A t=3363.9-3364.3 headline brush-splash interior (900,470), stable ×3; splash bbox (560,204)-(1418,518) @1080',
  },
  {
    id: 'defeat-splash-dark-2',
    state: 'result-defeat',
    x: 0.3646,
    y: 0.2778,
    rgb: [44, 3, 0],
    tol: 24,
    note: 'A t=3363.9-3364.3 splash interior second point (700,300), reads (44-49,1-3,0-1) ×3',
  },
  {
    id: 'defeat-btn1-fill',
    state: 'result-defeat',
    x: 0.4349,
    y: 0.4917,
    rgb: [92, 18, 0],
    tol: 22,
    note: 'A t=3363.9-3364.3 LEAVE AREA button resting fill (835,531), zero spread; button box x 814-1115, interior rows 516-547 @1080',
  },
  {
    id: 'defeat-btn2-fill',
    state: 'result-defeat',
    x: 0.4349,
    y: 0.5769,
    rgb: [92, 18, 0],
    tol: 22,
    note: 'FREE RESPAWN fill (835,623) — the A t=3363.9-3364.3 capture caught it mouse-HOVERED at (145-146,22-23,0); resting fill asserted from btn1 (identical chrome). Interior rows 608-638 @1080',
  },
  {
    id: 'defeat-silhouette-band',
    state: 'result-defeat',
    x: 0.3125,
    y: 0.8889,
    rgb: [0, 0, 0],
    tol: 16,
    note: 'A t=3361-3364 tableau band interior (600,960) — pure black ×3; band top y=906 in A (B win card: 894)',
  },

  // ── Win-card pillars (missed in v1 — the field is inset, not full-bleed) ──
  {
    id: 'win-border-left',
    state: 'result-win',
    x: 0.013,
    y: 0.5,
    rgb: [0, 0, 0],
    tol: 16,
    note: 'B t=3783.2-3783.8 black pillar left (25,540) ×3; red field starts x=53',
  },
  {
    id: 'win-border-right',
    state: 'result-win',
    x: 0.9896,
    y: 0.5,
    rgb: [0, 0, 0],
    tol: 16,
    note: 'B t=3783.2-3783.8 black pillar right (1900,540) ×3; field ends x=1865',
  },
] as const;

/**
 * Edge-scan assertions — pin element EDGES, not interiors. Each scan walks a
 * pixel line on the live canvas and asserts where the target color's first
 * sustained run begins (core/fidelityCompare.ts compareScan does the math).
 *
 * `axis` is the axis the scan MOVES along ('x' = horizontal line, `at` is the
 * fixed y; 'y' = vertical line, `at` is the fixed x). `from` > `to` scans in
 * reverse (e.g. right-to-left / bottom-up). `edge` is the expected first-match
 * position as a fraction of that axis; `tolPx` is canvas pixels (1024×576),
 * `minRun` is consecutive matching canvas pixels required (kills noise).
 */
export interface FidelityScan {
  readonly id: string;
  readonly state: FidelityState;
  readonly axis: 'x' | 'y';
  /** Fixed coordinate on the other axis (normalized). */
  readonly at: number;
  readonly from: number;
  readonly to: number;
  /** Expected first-match position along the scan (normalized). */
  readonly edge: number;
  /** Allowed |found − expected| in canvas px. */
  readonly tolPx: number;
  readonly rgb: readonly [number, number, number];
  readonly tol: number;
  /** Consecutive matching samples (canvas px) required to count as found. */
  readonly minRun: number;
  readonly note: string;
}

export const FIDELITY_SCANS: readonly FidelityScan[] = [
  // ── Intro band edges (rows 448/584 @1080 in BOTH beats) ──
  {
    id: 'vs-band-top-edge',
    state: 'vs-intro',
    axis: 'y',
    at: 0.3438,
    from: 0.3,
    to: 0.6,
    edge: 0.4153,
    tolPx: 4,
    rgb: [0, 0, 0],
    tol: 22,
    minRun: 4,
    note: 'B t=3771.55-3772.55 band top edge at x=660: arena→black at row 448 ×3 (448.5/1080)',
  },
  {
    id: 'vs-band-bottom-edge',
    state: 'vs-intro',
    axis: 'y',
    at: 0.3438,
    from: 0.65,
    to: 0.45,
    edge: 0.5412,
    tolPx: 4,
    rgb: [0, 0, 0],
    tol: 22,
    minRun: 4,
    note: 'B t=3771.55-3772.55 band bottom edge, scanned bottom-up at x=660: first black at row 584 ×3 (584.5/1080)',
  },
  {
    id: 'fight-band-top-edge',
    state: 'fight-splash',
    axis: 'y',
    at: 0.6771,
    from: 0.3,
    to: 0.6,
    edge: 0.4153,
    tolPx: 4,
    rgb: [0, 0, 0],
    tol: 22,
    minRun: 4,
    note: 'B t=3773.48-3773.65 band top edge at x=1300 — identical row 448 as the VS beat ×3',
  },
  {
    id: 'fight-band-bottom-edge',
    state: 'fight-splash',
    axis: 'y',
    at: 0.6771,
    from: 0.65,
    to: 0.45,
    edge: 0.5412,
    tolPx: 4,
    rgb: [0, 0, 0],
    tol: 22,
    minRun: 4,
    note: 'B t=3773.48-3773.65 band bottom edge at x=1300, row 584 ×3',
  },

  // ── Result-card field pillars + tableau top ──
  {
    id: 'win-field-left-edge',
    state: 'result-win',
    axis: 'x',
    at: 0.5,
    from: 0,
    to: 0.1,
    edge: 0.0279,
    tolPx: 4,
    rgb: [153, 0, 0],
    tol: 20,
    minRun: 4,
    note: 'B t=3783.2-3783.8 win field starts at x=53 ×3 (53.5/1920); authored #990000 field',
  },
  {
    id: 'win-field-right-edge',
    state: 'result-win',
    axis: 'x',
    at: 0.5,
    from: 1,
    to: 0.9,
    edge: 0.9716,
    tolPx: 4,
    rgb: [153, 0, 0],
    tol: 20,
    minRun: 4,
    note: 'B t=3783.2-3783.8 win field ends at x=1865 ×3, scanned right-to-left (1865.5/1920)',
  },
  {
    id: 'win-silhouette-top-edge',
    state: 'result-win',
    axis: 'y',
    at: 0.875,
    from: 0.75,
    to: 0.95,
    edge: 0.8282,
    tolPx: 5,
    rgb: [0, 0, 0],
    tol: 22,
    minRun: 4,
    note: 'B t=3783.2-3783.8 tableau band top at x=1680: soft dark-red fade rows 882-896 then black from 894 ×3 (894.5/1080)',
  },
  {
    id: 'defeat-field-left-edge',
    state: 'result-defeat',
    axis: 'x',
    at: 0.5,
    from: 0,
    to: 0.1,
    edge: 0.0279,
    tolPx: 4,
    rgb: [153, 0, 0],
    tol: 20,
    minRun: 4,
    note: 'Shared card system — B win-card geometry (x=53) is the duel-build truth; A t=3361-3364 defeat read x=56 (≤3px build jitter)',
  },
  {
    id: 'defeat-field-right-edge',
    state: 'result-defeat',
    axis: 'x',
    at: 0.5,
    from: 1,
    to: 0.9,
    edge: 0.9716,
    tolPx: 4,
    rgb: [153, 0, 0],
    tol: 20,
    minRun: 4,
    note: 'Shared card system — B win-card x=1865; A t=3361-3364 defeat read x=1861',
  },
  {
    id: 'defeat-silhouette-top-edge',
    state: 'result-defeat',
    axis: 'y',
    at: 0.875,
    from: 0.75,
    to: 0.95,
    edge: 0.8282,
    tolPx: 5,
    rgb: [0, 0, 0],
    tol: 22,
    minRun: 4,
    note: 'Shared card system — B win tableau top y=894; A t=3361-3364 defeat read y=906 (12px jitter across builds/contexts, B wins)',
  },

  // ── Fighting HUD element edges (v1 interiors already pin lengths; these
  //     pin the left EDGES of the same measured elements) ──
  {
    id: 'hp-bar-left-edge',
    state: 'fighting',
    axis: 'x',
    at: 0.9102,
    from: 0.1,
    to: 0.16,
    edge: 0.1284,
    tolPx: 4,
    rgb: [2, 153, 11],
    tol: 24,
    minRun: 3,
    note: 'B t=3772-3776 HP fill starts at x=246 (v1 bar-span measurement; 246.5/1920)',
  },
  {
    id: 'chi-bar-left-edge',
    state: 'fighting',
    axis: 'x',
    at: 0.9361,
    from: 0.1,
    to: 0.16,
    edge: 0.1284,
    tolPx: 4,
    rgb: [46, 73, 226],
    tol: 24,
    minRun: 3,
    note: 'B t=3772-3776 blue bar fill starts at x=246 (v1 span; same left edge as HP)',
  },
  {
    id: 'plate-left-edge',
    state: 'fighting',
    axis: 'x',
    at: 0.0352,
    from: 0.01,
    to: 0.08,
    edge: 0.0388,
    tolPx: 4,
    rgb: [84, 44, 6],
    tol: 26,
    minRun: 3,
    note: 'B t=3772-3776 AUTO SLASH OFF plate box starts x=74 (v1 box measurement; 74.5/1920)',
  },
  {
    id: 'slot1-interior-left-edge',
    state: 'fighting',
    axis: 'x',
    at: 0.9167,
    from: 0.74,
    to: 0.79,
    edge: 0.7576,
    tolPx: 5,
    rgb: [12, 12, 12],
    tol: 10,
    minRun: 3,
    note: 'B t=3771.55-3772.55 slot 1 left edge anatomy at row 990: arena → bright rim (70,70,70) x=1448 → dark inner line → interior ramp (12→17) from x=1454 (1454.5/1920)',
  },
] as const;

/**
 * Player-bar vertical gradients — CONTRACT, measured per OUR stage row.
 * The original's bars are gradient-shaded (confirmed lossless in A8.PNG;
 * measured row-by-row off B t=3772-3776 at 1080p, spreads ≤9; focus strip
 * from the single stable frame t=3774 — its fill length moves in-fight).
 * Each entry is the original's color at that exact stage row's screen
 * position (rows: hp 518-526, chi 535-542, focus 549-557 @1024×576) — the
 * best-possible downsample, so row probes match by construction.
 */
export const BAR_GRADIENTS = {
  hp: [0x3ab55f, 0x3ab55f, 0x31ad58, 0x26a641, 0x129827, 0x079913, 0x02990b, 0x05960c, 0x009a03],
  chi: [0x5272ea, 0x4d6ee6, 0x4362e2, 0x3a56e4, 0x2e49e2, 0x253fe6, 0x1930ef, 0x1b24cf],
  focus: [0xf2f2f2, 0xf2f2f2, 0xefefef, 0xefefef, 0xeeeeee, 0xeaeaea, 0xe8e8e8, 0xe5e5e5, 0xe3e3e3],
} as const;

/**
 * Enemy overhead HP bar — anchored to the enemy, not the screen, so it is
 * asserted as an offset from the sim's enemy position (our stage px).
 * Offset is INFERRED (our sprite anchor); the fill color is CONTRACT.
 */
export const FIDELITY_ENEMY_BAR = {
  /** Stage-px offset from enemy pos to a point inside the bar fill. */
  dx: 0,
  dy: -88,
  rgb: [23, 155, 50] as const,
  tol: 26,
  note: 'B t=3774 enemy overhead bar green (brighter than player HP green)',
} as const;

/**
 * `?fidelity=auto` (SESSION23): ms between the game's READY event and the
 * auto-runner firing the gate. INFERRED — one breath for the boot scene to
 * draw. ⚠️ History: this was briefly 8000 to "fix" the FIGHT!-glyph probes
 * reading black; that pass was coincidence. The REAL cause was the harness's
 * devHoldAt racing the restarted intro's create() (fixed in DuelIntro —
 * create() now re-applies a pre-recorded hold instead of nulling it), so the
 * settle is back to a plain warm-up and the gate must hold at ANY load.
 */
export const AUTO_FIDELITY_SETTLE_MS = 1000;
