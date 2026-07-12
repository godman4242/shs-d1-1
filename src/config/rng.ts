/**
 * MULBERRY32 CONSTANTS — pure data, no logic.
 * Spec-fixed (architecture mandate: "injected mulberry32 RNG, no Math.random
 * in core/"). These are the algorithm's magic numbers (Tommy Ettinger's
 * public-domain mulberry32), NOT gameplay tuning — never "balance" them.
 * tests/rng.test.ts pins the output against an independent reference copy,
 * so a transcription slip here goes red immediately.
 */
export const MULBERRY_INCREMENT = 0x6d2b79f5;
export const MULBERRY_SHIFT_A = 15;
export const MULBERRY_OR_A = 1;
export const MULBERRY_SHIFT_B = 7;
export const MULBERRY_OR_B = 61;
export const MULBERRY_SHIFT_C = 14;
/** 2^32 — divides a uint32 into [0, 1). */
export const UINT32_RANGE = 4294967296;
