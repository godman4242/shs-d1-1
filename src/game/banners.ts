import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/display';
import { COL } from '../config/palette';

/**
 * The one match-banner template family (fidelity tell 25 / SYNTHESIS §1.1:
 * FIGHT! / VS / YOU WIN / YOU WERE DEFEATED all share a brush-font,
 * red-splatter treatment — build ONE component). Original procedural art:
 * a deterministic ink-splatter blob cluster behind heavy slanted text.
 * Numbers are render geometry (tolerated until the M8 ratchet).
 */
export interface BannerHandle {
  container: Phaser.GameObjects.Container;
  destroy(): void;
}

/** Deterministic pseudo-noise for splatter placement (render-only). */
const wobble = (i: number, salt: number): number =>
  Math.sin(i * 12.9898 + salt * 78.233) * 0.5 + 0.5;

export function showBanner(
  scene: Phaser.Scene,
  text: string,
  opts: { y?: number; scale?: number; sub?: string } = {},
): BannerHandle {
  const y = opts.y ?? GAME_HEIGHT / 2;
  const scale = opts.scale ?? 1;
  const container = scene.add.container(GAME_WIDTH / 2, y).setDepth(1000);

  // Ink splatter: one heavy blob + satellites, red family on dark red.
  const splat = scene.add.graphics();
  const w = Math.max(220, text.length * 34 * scale);
  splat.fillStyle(COL.bloodDark, 0.92);
  splat.fillEllipse(0, 0, w, 86 * scale);
  splat.fillStyle(COL.blood, 0.9);
  splat.fillEllipse(0, 0, w * 0.94, 72 * scale);
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const r = (w / 2) * (0.82 + wobble(i, 1) * 0.35);
    const sx = Math.cos(a) * r;
    const sy = Math.sin(a) * (30 + wobble(i, 2) * 26) * scale;
    splat.fillStyle(i % 3 === 0 ? COL.bloodBright : COL.blood, 0.85);
    splat.fillCircle(sx, sy, (3 + wobble(i, 3) * 9) * scale);
  }
  container.add(splat);

  // Heavy slanted display text (brush-adjacent without font assets).
  const label = scene.add
    .text(0, 0, text, {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontStyle: 'bold italic',
      fontSize: `${Math.round(64 * scale)}px`,
      color: '#efedc2',
      stroke: '#040304',
      strokeThickness: 8,
    })
    .setOrigin(0.5);
  container.add(label);

  if (opts.sub !== undefined) {
    const sub = scene.add
      .text(0, 52 * scale, opts.sub, {
        fontFamily: 'Georgia, serif',
        fontStyle: 'bold',
        fontSize: '22px',
        color: '#efedc2',
        stroke: '#040304',
        strokeThickness: 5,
      })
      .setOrigin(0.5);
    container.add(sub);
  }

  // Ink-splatter reveal: snap in slightly oversized, settle fast (hard-cut
  // feel — no slow fades; SYNTHESIS §4).
  container.setScale(1.25).setAlpha(0);
  scene.tweens.add({ targets: container, alpha: 1, scale: 1, duration: 90, ease: 'Quad.easeOut' });

  return {
    container,
    destroy: () => {
      container.destroy(true);
    },
  };
}
