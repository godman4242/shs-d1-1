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
 * - 'fighting'  — combat live, t≈0: full HP/Chi/Focus, fighters at spawns.
 * - 'result-win' — the YOU WIN card.
 */
export interface FidelityProbe {
  readonly id: string;
  /** Canonical render state this probe samples. */
  readonly state: 'fighting' | 'result-win';
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
    rgb: [163, 14, 0],
    tol: 20,
    note: 'B t=3783 (63:03) YOU WIN background, exact flat #a30e00 at 3 points',
  },
  {
    id: 'win-bg-right',
    state: 'result-win',
    x: 0.8333,
    y: 0.1852,
    rgb: [163, 14, 0],
    tol: 20,
    note: 'B t=3783 YOU WIN background, right side (same flat red)',
  },
  {
    id: 'win-silhouette-band',
    state: 'result-win',
    x: 0.1563,
    y: 0.8333,
    rgb: [25, 34, 9],
    tol: 28,
    note: 'B t=3783 bottom silhouette band (dark olive-black ground art)',
  },
] as const;

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
