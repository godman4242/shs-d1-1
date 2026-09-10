/**
 * OG_FRIENDLY — what the two friendlies share, `FriendlyArcher.as:21-34` and
 * `FriendlySpearElite.as:19-32` (byte-identical bodies). Lane L4b, slice 2b. All
 * CONTRACT. A friendly is built from the PLAYER's live stats (`NpcWorld.playerStats`),
 * not from its roster row.
 */
export const OG_FRIENDLY = {
  /** `FriendlyArcher.as:27-29` (twins: `FriendlySpearElite.as:25-27`) — damage, defense and max hp are 0.75 × the player's. */
  statScale: 0.75,
  /** `FriendlyArcher.as:26` (twins: `FriendlySpearElite.as:24`, `EnemySpearElite.as:81`) — the player's attack is `minDamage + damageRange / 2`. */
  damageRangeDiv: 2,
  /** `FriendlyArcher.as:32` (twins: `FriendlySpearElite.as:30`) — a friendly is worth no XP. */
  xp: 0,
} as const;
