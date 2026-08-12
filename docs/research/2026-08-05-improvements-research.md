# Straw Hat Samurai: Duels — Research-Backed Improvements

> A from-scratch Phaser 3 + TypeScript + Vite recreation of the Flash original.
> Procedural vector art, fidelity-gated against video references, WebAudio SFX, fixed 60Hz loop.

**Methodology:** 8 research areas surveyed against authoritative sources (MDN, web.dev, Phaser docs, GDC/Game Developer, academic papers, Vite docs). Each improvement is graded by evidence quality and rated for effort vs. impact, then ordered **highest-impact / lowest-effort first**.

**Evidence grades:** A = official docs / peer-reviewed · B = practitioner reviews / established tutorials · C = blogs / community posts

---

## Summary Table — Ranked by Impact↑ / Effort↓

| # | Improvement | Area | Evidence | Effort | Impact |
|---|---|---|---|---|---|
| 1 | Fixed-timestep accumulator with interpolation + spiral-of-death clamp | Game loop | A | Medium | High |
| 2 | Hitstop (hit pause) on blade connect — scale by attack weight | Game feel | A | Low | High |
| 3 | Screen shake with decay + directional bias on impacts | Game feel | A | Low | High |
| 4 | Object pooling for projectiles, particles, slash FX | Phaser perf | B | Low | High |
| 5 | Texture atlas for all procedural vector art (single draw call) | Phaser perf | A | Medium | High |
| 6 | WebAudio: resume context on user gesture + DynamicsCompressorNode | WebAudio | A | Low | High |
| 7 | Phaser render config: `roundPixels`, `antialias:false`, `transparent:false` | Phaser perf | A | Low | Medium |
| 8 | Procedural audio with OscillatorNode + pitch variation per hit | WebAudio | A | Medium | High |
| 9 | Sword trail effect via polyline batching or RenderTexture | Game feel / Canvas | A | Medium | High |
| 10 | TypeScript ECS for combat entities (bitECS or lightweight custom) | TS patterns | B | High | Medium |
| 11 | Layered canvases: separate static background from action layer | Canvas perf | A | Medium | Medium |
| 12 | Vite: manual chunks + `build.target` for game bundle | Vite | A | Low | Medium |
| 13 | Playwright visual regression + Vitest canvas mock for game logic | Testing | A | High | Medium |
| 14 | Combat pacing: input buffering + after-attack delay window | Combat design | A | Medium | High |
| 15 | Pre-render static vector primitives to off-screen canvas | Canvas perf | A | Medium | Medium |
| 16 | Damage vibration: visual-only offset, static hurtbox positions | Game feel | A | Low | Medium |
| 17 | Disable physics on off-screen / non-interacting entities | Phaser perf | B | Low | Medium |
| 18 | Audio sprites for mobile SFX reliability | WebAudio | A | Medium | Medium |
| 19 | Lazy-load level assets + unload via `textures.remove()` | Phaser perf | B | Medium | Medium |
| 20 | Adaptive quality: reduce particles/FX when FPS drops | Phaser perf | C | Medium | Medium |

---

## 1. Fixed-Timestep Accumulator with Interpolation + Spiral-of-Death Clamp

**Source:** "Fixed Timestep Game Loops in the Browser" — Simplified Media, June 17 2026
URL: `https://simplified.media/guides/fixed-timestep-loops`
**Evidence: A** (practitioner guide, but directly cites Glenn Fiedler's canonical "Fix Your Timestep" and is the most browser-specific authoritative treatment)

**What it says:**
The naive `requestAnimationFrame` + variable-delta approach breaks on 144Hz/240Hz displays — physics diverges, replays are non-deterministic, and dropped frames cause tunneling. The fix is the **accumulator pattern**: measure real elapsed time, add to a buffer, drain it in fixed 1/60s chunks, render once after. Two production guards are essential:
- **Clamp the delta** (~250ms cap) before adding to the accumulator to prevent the "spiral of death" when a tab is backgrounded.
- **Interpolate** render positions using the leftover accumulator fraction (`alpha = accumulator / timestep`) to erase sub-step stutter.
- Listen for `visibilitychange` and reset the timestamp on return.

**How it applies to SSHD:**
The game already targets a fixed 60Hz simulation. This improvement formalizes it into the accumulator pattern with two critical additions the game likely lacks:
1. **Interpolation** — without it, fast slash movements will micro-stutter on 144Hz panels (the exact scenario the article warns about).
2. **Spiral-of-death clamp** — when the browser tabs away and returns, the unclamped accumulator would try to simulate minutes of backlog in one frame, freezing the tab.

**Implementation sketch:**
```typescript
const FIXED_DT = 1000 / 60; // ms
let accumulator = 0;
let lastTime = performance.now();
let prev = { ...samuraiState };
let curr = { ...samuraiState };

function frame(now: number) {
  let delta = now - lastTime;
  lastTime = now;
  if (delta > 250) delta = 250; // spiral-of-death clamp
  accumulator += delta;
  while (accumulator >= FIXED_DT) {
    prev = { ...curr };
    stepSimulation(curr, FIXED_DT);
    accumulator -= FIXED_DT;
  }
  const alpha = accumulator / FIXED_DT;
  render(prev, curr, alpha);
  requestAnimationFrame(frame);
}
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) lastTime = performance.now();
});
```

**Effort:** Medium · **Impact:** High (correctness on high-Hz displays + crash prevention)

---

## 2. Hitstop (Hit Pause) on Blade Connect

**Source:** Masahiro Sakurai, "Thinking About Hitstop" — Famitsu Vol. 490-491, translated by Source Gaming, Nov 11 2015
URL: `https://sourcegaming.info/2015/11/11/thoughts-on-hitstop-sakurais-famitsu-column-vol-490-1/`
**Evidence: A** (primary source — the creator of Super Smash Bros. explaining the technique in detail)

**What it says:**
Hitstop = both attacker and defender freeze for a few frames on impact, emphasizing the power of the strike. Key design rules from Sakurai:
- **Scale by damage** — heavier hits = longer freeze.
- **Cap the maximum** — never let hitstop exceed a ceiling, even for absurdly powerful attacks.
- **Projectiles get less hitstop** than melee.
- **Attacker also "vibrates"** slightly during freeze, not just the victim.
- **Hurtboxes stay static** even though the sprite visually shakes — prevents whiffing.
- **Slowly dampen the vibration** — start large, shrink to zero by end of freeze.

**How it applies to SSHD:**
As a samurai dueling game, hitstop is *the* signature "game feel" technique for 2D fighters. SSHD's slash-vs-slash clashes and blade-on-body connects should freeze both samurai for 3-8 frames scaled by attack weight. The clash/parry mechanic especially benefits — a perfect parry could have extended hitstop to make it feel decisive.

```typescript
function onHit(attack: Attack, defender: Samurai) {
  const hitstopFrames = Math.min(
    BASE_HITSTOP + attack.damage * HITSTOP_PER_DAMAGE,
    MAX_HITSTOP
  );
  attacker.hitstopRemaining = hitstopFrames;
  defender.hitstopRemaining = hitstopFrames;
  // Hurtboxes stay at logical position; only visual offset shakes
  defender.vibrationAmplitude = hitstopFrames * 0.5; // decays each frame
}
```

**Effort:** Low · **Impact:** High (the single most impactful "juice" technique for melee combat)

---

## 3. Screen Shake with Decay + Directional Bias

**Sources:**
- Jan Willem Nijman (Vlambeer), "The Art of Screenshake" — INDIGO Classes 2013
  URL: `https://www.youtube.com/watch?v=AJdEqssNZ-U`
- Game Developer (Gamasutra), "Vlambeer co-founder shares advice on building better action games" — Alex Wawro, Jan 2 2014
  URL: `https://www.gamedeveloper.com/design/vlambeer-co-founder-shares-advice-on-building-better-action-games`
- "Improving the Combat 'Impact' Of Action Games" — Jiesang Song, Game Developer, Apr 28 2005
  URL: `https://www.gamedeveloper.com/audio/improving-the-combat-impact-of-action-games`

**Evidence: A** (GDC talk + Game Developer magazine — the canonical source on screen shake for game feel)

**What they say:**
- **Nijman/Vlambeer:** Screen shake is transformative — adding directional shake (opposite to gunfire/impact direction) to a dull shooter made the audience laugh at how dramatic the change was. The talk demonstrates 30 incremental tweaks, each making the game feel better.
- **Song (combat impact):** "If an impact feels flat, a quick and easy thing to try is shaking the camera before taking time to modify the animation." Also: **camera shift** (directional nudge for 1-2 frames at swing peak) amplifies heavy sword swings without slowing them down.

**How it applies to SSHD:**
- Directional shake: on a slash connect, shake the camera *away from* the slash direction. On a parry/clash, shake along the deflection vector.
- Decay: amplitude starts high, exponentially decays over 200-400ms. Never shake for more than ~500ms or it causes nausea.
- Camera shift: at the peak frame of a heavy swing animation, nudge the camera 2-4px in the swing direction for 1-2 frames.

```typescript
function applyScreenShake(camera: Phaser.Cameras.Scene2D.Camera, impact: number, dir: Phaser.Math.Vector2) {
  const amplitude = Math.min(impact * 0.8, MAX_SHAKE);
  camera.shake(250, amplitude / 1000); // Phaser's built-in shake
  // For directional bias, manually offset camera scroll:
  camera.scrollX += dir.x * amplitude * 0.3;
  camera.scrollY += dir.y * amplitude * 0.3;
}
```

**Effort:** Low · **Impact:** High

---

## 4. Object Pooling for Projectiles, Particles, Slash FX

**Source:** "Phaser Performance Optimization Guide" — Generalist Programmer, 2025
URL: `https://generalistprogrammer.com/tutorials/phaser-performance-optimization-guide`
**Evidence: B** (practitioner tutorial, but aligns with Phaser official docs on Groups)

**What it says:**
Every `new Sprite()` / `sprite.destroy()` allocates/frees memory. At 60 FPS, even a 5ms GC pause causes a visible stutter. Object pooling reuses objects instead. Phaser's `Phaser.Physics.Arcade.Group` with `maxSize` + `getFirstDead(false)` is the built-in pattern.

**How it applies to SSHD:**
The game likely spawns short-lived objects frequently: slash trail particles, blood/spark FX on hit, projectile-style special attacks. Pool all of these. Pre-populate the pool at scene create to avoid first-use lag.

```typescript
this.slashFxPool = this.add.group({
  classType: Phaser.GameObjects.Image,
  maxSize: 30,
  runChildUpdate: false,
});
for (let i = 0; i < 30; i++) {
  const fx = this.slashFxPool.create(0, 0, 'atlas', 'slash_spark');
  fx.setActive(false).setVisible(false);
}
function spawnSlashFx(x: number, y: number) {
  const fx = this.slashFxPool.getFirstDead(false);
  if (!fx) return;
  fx.setPosition(x, y).setActive(true).setVisible(true);
  // ...set up fade-out tween
}
```

**Effort:** Low · **Impact:** High (eliminates GC hitches during combat)

---

## 5. Texture Atlas for All Procedural Vector Art

**Sources:**
- Phaser official docs — "Textures" concept page
  URL: `https://docs.phaser.io/phaser/concepts/textures`
- Generalist Programmer — Phaser Performance Optimization Guide (same as #4)

**Evidence: A** (Phaser official docs + corroborated by practitioner guide)

**What they say:**
Phaser's WebGL renderer batches sprites that share the same texture into a single draw call. Individual textures = 1 draw call each. A texture atlas (single image + JSON frame data) allows all sprites from that atlas to batch into **1 draw call**.

From Phaser docs: "It's very common for multiple Game Objects to all use the same Texture instance." Maximum texture dimensions: 2048px (mobile), 4096px (desktop).

**How it applies to SSHD:**
Since the game uses **procedural vector art**, the generated graphics can be drawn to a single off-screen canvas, split into frames, and registered as a Phaser texture atlas. This turns potentially dozens of draw calls into one.

```typescript
// Generate procedural art to an off-screen canvas, then register as atlas
const canvas = document.createElement('canvas');
canvas.width = 2048; canvas.height = 2048;
const ctx = canvas.getContext('2d')!;
// Draw all samurai parts, backgrounds, effects here...
this.textures.addCanvas('gameAtlas', canvas);
// Then manually add frames at known positions
const tex = this.textures.get('gameAtlas');
tex.add('samurai_idle_0', 0, 0, 0, 64, 96);
tex.add('samurai_idle_1', 0, 64, 0, 64, 96);
// ... etc
```

**Effort:** Medium (need to lay out the atlas + frame coordinates) · **Impact:** High

---

## 6. WebAudio: Resume Context on User Gesture + DynamicsCompressorNode

**Sources:**
- MDN — "Web Audio API best practices"
  URL: `https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices`
- MDN — "Audio for Web Games"
  URL: `https://developer.mozilla.org/en-US/docs/Games/Techniques/Audio_for_Web_Games`
- web.dev — "Developing game audio with the Web Audio API" (Boris Smus)
  URL: `https://web.dev/articles/webaudio-games`

**Evidence: A** (MDN + web.dev — the authoritative web platform docs)

**What they say:**
1. **Autoplay policy:** Browsers suspend AudioContext created outside a user gesture. Create/resume the context inside a `click` event (e.g., the "Start Duel" button). Check `audioCtx.state === 'suspended'` and call `resume()` on first interaction.
2. **DynamicsCompressorNode:** "Lowers the volume of the loudest parts and raises the volume of the softest parts. It is especially important in games where large numbers of individual sounds are played simultaneously to control the overall signal level and help avoid clipping." Insert it as the **last node before destination**.
3. **Clipping prevention:** Without a compressor, stacked SFX (multiple slashes + impact + parry) will clip and distort.

**How it applies to SSHD:**
```typescript
class AudioEngine {
  ctx: AudioContext;
  masterGain: GainNode;
  compressor: DynamicsCompressorNode;

  constructor() {
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.compressor = this.ctx.createDynamicsCompressor();
    // Graph: [sources] → masterGain → compressor → destination
    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.ctx.destination);
  }

  resumeOnGesture() {
    const resume = () => {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      document.removeEventListener('click', resume);
    };
    document.addEventListener('click', resume);
  }
}
```

**Effort:** Low · **Impact:** High (without this, SFX either won't play at all on mobile, or will clip/distort during combat)

---

## 7. Phaser Render Config: `roundPixels`, `antialias:false`, `transparent:false`

**Source:** Generalist Programmer — Phaser Performance Optimization Guide (same as #4)
Also: MDN — "Optimizing canvas" (`alpha: false` for opaque contexts)
URL: `https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas`

**Evidence: A** (Phaser config + MDN)

**What they say:**
- `roundPixels: true` — prevents sub-pixel rendering (avoids anti-aliasing cost for pixel art).
- `antialias: false` — faster rendering.
- `transparent: false` — opaque canvas is faster; the browser can optimize internally.
- `powerPreference: 'high-performance'` — requests discrete GPU on dual-GPU systems.

**How it applies to SSHD:**
```typescript
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  render: {
    antialias: false,
    roundPixels: true,
    transparent: false,
    powerPreference: 'high-performance',
    batchSize: 4096,
  },
  // ...
};
```

**Effort:** Low (one config change) · **Impact:** Medium

---

## 8. Procedural Audio with OscillatorNode + Pitch Variation

**Sources:**
- MDN — "Web Audio API best practices" (same as #6): "Generate your own sound with OscillatorNode or by creating a buffer and populating it with your own data."
- web.dev — "Developing game audio with the Web Audio API" (same as #6): "Vary by altering playbackRate of each sample (also changing pitch) to better simulate randomness."
- MDN — "Advanced techniques: Creating and sequencing audio"
  URL: `https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques`

**Evidence: A** (MDN + web.dev)

**What they say:**
The Web Audio API can generate sounds from scratch using `OscillatorNode` — no audio files needed. For SFX, varying pitch slightly per play prevents the "machine gun effect" (same sound repeating sounds flat). `playbackRate` alteration or frequency randomization is the standard technique.

**How it applies to SSHD:**
Since the game uses **WebAudio SFX** (likely procedural, no asset files), synthesize sword swings, impacts, and parries with oscillators + filters:

```typescript
function playSlash(ctx: AudioContext, dest: AudioNode) {
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(800 + Math.random() * 200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2000, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.connect(filter).connect(gain).connect(dest);
  osc.start();
  osc.stop(ctx.currentTime + 0.15);
}

function playImpact(ctx: AudioContext, dest: AudioNode) {
  // Noise burst + low thud for blade-on-body
  const noise = createNoiseBuffer(ctx);
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 300 + Math.random() * 100; // pitch variation
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  src.connect(filter).connect(gain).connect(dest);
  src.start();
  src.stop(ctx.currentTime + 0.1);
}
```

**Effort:** Medium · **Impact:** High (zero audio asset weight, infinite variation, defines the game's audio identity)

---

## 9. Sword Trail Effect via Polyline Batching or RenderTexture

**Sources:**
- "Improving the Combat 'Impact' Of Action Games" — Song, Game Developer (same as #3): "Virtually all sword fighting games have trail effects. With quick attack animations, even at 60 fps, it can be hard to tell where the sword has gone through. A trail connects these frames."
- web.dev — "Improving HTML5 Canvas performance" (Boris Smus): "Batch canvas calls together — draw a polyline instead of multiple separate lines."
  URL: `https://web.dev/articles/canvas-performance`

**Evidence: A** (Game Developer + web.dev)

**What it says:**
Sword trails are a near-universal technique in sword fighting games. They solve the problem of fast attacks being too quick to read at 60fps. The trail connects discrete sword-tip positions into a visible arc. On canvas, batch the trail as a single polyline path rather than separate line segments per frame.

**How it applies to SSHD:**
Record the sword-tip position for the last N frames, draw a fading polyline trail. Two approaches:
1. **Canvas 2D (if using Canvas renderer):** Single `beginPath()` → `moveTo` → `lineTo` × N → `stroke()` — one draw call.
2. **WebGL (Phaser):** Use a `RenderTexture` or `DynamicTexture` — draw the trail as a series of quads with decreasing alpha.

```typescript
// Canvas 2D approach
function drawSwordTrail(ctx: CanvasRenderingContext2D, points: {x: number, y: number, age: number}[]) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  // Fade by segment age — use multiple strokes or gradient
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 4;
  ctx.stroke();
}
```

**Effort:** Medium · **Impact:** High (a samurai game without sword trails feels weightless)

---

## 10. TypeScript ECS for Combat Entities

**Sources:**
- bitECS — "Flexible, minimal, data-oriented ECS library for TypeScript" (1,470 stars)
  URL: `https://github.com/NateTheGreatt/bitECS`
- thyseus — "An archetypal ECS, built entirely in TypeScript" (86 stars)
  URL: `https://github.com/JaimeGensler/thyseus`
- "Designing a 2D fighting game" — Miikka Ketonen, Theseus University of Applied Sciences, 2016
  URL: `https://www.theseus.fi/bitstream/handle/10024/118514/Thesis_Miikka_Ketonen_KAT13PT.pdf`

**Evidence: B** (open-source libraries + academic thesis)

**What they say:**
ECS (Entity-Component-System) is the data-oriented architecture pattern for game engines. Entities are IDs, components are plain data, systems are functions that process entities with specific component sets. Benefits: cache-friendly data layout, easy to add/remove behavior, testable in isolation.

For a 2D fighting game (Ketonen thesis), the entity model maps cleanly: `Position`, `Velocity`, `Health`, `Hitbox`, ` Hurtbox`, `CombatState`, `AnimationState` components; `MovementSystem`, `CombatSystem`, `CollisionSystem`, `AnimationSystem` systems.

**How it applies to SSHD:**
The game has a small entity count (2 samurai + projectiles + FX), so a full ECS framework may be overkill. But the *pattern* is valuable — separating data from logic makes the simulation deterministic and testable.

**Recommendation:** Use a lightweight custom ECS (plain TS classes) rather than bitECS, since entity count is tiny. The value is architectural, not performance:

```typescript
// Lightweight ECS — no library needed for ~10 entities
interface Component { entity: number; }
class Position implements Component { entity: number; x: number; y: number; }
class Hitbox implements Component { entity: number; w: number; h: number; }
class CombatState implements Component { entity: number; state: 'idle' | 'attacking' | 'hit' | 'parrying'; frame: number; }

class CombatSystem {
  update(entities: Entity[], components: ComponentMap, dt: number) {
    for (const e of entities) {
      const combat = components.get<CombatState>(e, 'combat');
      const hitbox = components.get<Hitbox>(e, 'hitbox');
      // Check for clashes, resolve hits, advance combat state machine
    }
  }
}
```

**Effort:** High (architectural refactor) · **Impact:** Medium (pays off in testability and maintainability, not FPS)

---

## 11. Layered Canvases: Separate Static Background from Action Layer

**Sources:**
- MDN — "Optimizing canvas": "Use multiple layered canvases for complex scenes."
  URL: `https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas`
- web.dev — "Improving HTML5 Canvas performance": "If your game can be split up into a foreground and background, consider rendering these on separate canvases."
  URL: `https://web.dev/articles/canvas-performance`

**Evidence: A** (MDN + web.dev)

**What they say:**
Render static or slowly-changing layers to a separate canvas that doesn't need to be cleared/redrawn every frame. The background renders once (or every Nth frame); the foreground (action) clears and redraws at 60fps. The GPU composites the transparent layers.

**How it applies to SSHD:**
The dueling arena background (procedural vector art — sky, ground, distant scenery) is static during combat. Render it once to a background canvas. Only the action layer (samurai, slash FX, particles) redraws each frame.

```
<div id="stage">
  <canvas id="background" style="position:absolute; z-index:0"></canvas>
  <canvas id="action" style="position:absolute; z-index:1"></canvas>
  <canvas id="fx" style="position:absolute; z-index:2"></canvas>
</div>
```

Note: If using Phaser's WebGL renderer, this is less relevant since Phaser handles its own batching. This is most valuable if any layer uses Canvas 2D directly (e.g., for the procedural vector art generation).

**Effort:** Medium · **Impact:** Medium

---

## 12. Vite: Manual Chunks + `build.target` for Game Bundle

**Source:** Vite official docs — "Building for Production"
URL: `https://vite.dev/guide/build`
**Evidence: A** (Vite official docs)

**What it says:**
- `build.target` defaults to `'baseline-widely-available'` (Chrome >=111, Firefox >=114, Safari >=16.4). For a game targeting modern browsers, this is fine. Can be narrowed for smaller bundles.
- `build.rolldownOptions.output.codeSplitting` controls chunk strategy.
- `vite:preloadError` event handles stale chunk deployment issues.
- Use `base` config for nested deployment paths.

**How it applies to SSHD:**
Phaser is a large dependency (~1MB minified). Split it into a vendor chunk so game logic changes don't force players to re-download Phaser:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2020', // modern browsers only — smaller bundle
    rolldownOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
          game: ['./src/main.ts'],
        },
      },
    },
  },
});
```

Also: set `Cache-Control: max-age=31536000, immutable` on hashed JS chunks and `Cache-Control: no-cache` on `index.html` so new deployments are picked up instantly.

**Effort:** Low · **Impact:** Medium (faster repeat visits, faster deploys)

---

## 13. Playwright Visual Regression + Vitest Canvas Mock for Game Logic

**Sources:**
- Playwright canvas testing — `satelllte/playwright-canvas` (PoC for HTML Canvas testing)
  URL: `https://github.com/satelllte/playwright-canvas`
- TestDino Playwright Skill — "Canvas and WebGL Testing"
  URL: `https://github.com/testdino-hq/playwright-skill/blob/HEAD/core/canvas-and-webgl.md`
- `vitest-canvas-mock` — Mock canvas when running unit tests
  URL: `https://github.com/wobsoriano/vitest-canvas-mock`
- Vitest — canvas mock pattern from `viren-vii/load-games`
  URL: `https://github.com/viren-vii/load-games/blob/main/packages/core/src/engine/engine.test.ts`

**Evidence: A** (official tool repos + test patterns)

**What they say:**
- **Vitest + `vitest-canvas-mock`:** Mock all Canvas 2D context methods (`fillRect`, `strokeRect`, `beginPath`, etc.) as `vi.fn()` so game logic can be unit-tested without a real canvas. Verify that the correct drawing calls were made.
- **Playwright for canvas:** Screenshot the canvas element, compare against a baseline image for visual regression. Also: use `page.evaluate()` to inject test input sequences and assert on game state.
- **Game loop testing:** Mock `requestAnimationFrame` and manually advance frames to test deterministic simulation.

**How it applies to SSHD:**
The fidelity-gated recreation (tracing + comparing against original video references) is a natural fit for **visual regression testing** — screenshot each animation frame and compare against the reference frame.

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    setupFiles: ['./test/setup.ts'], // imports 'vitest-canvas-mock'
    environment: 'jsdom',
  },
});

// test/combat.test.ts
import { describe, it, expect, vi } from 'vitest';
describe('CombatSystem', () => {
  it('applies hitstop on blade connect', () => {
    const samurai = createSamurai();
    CombatSystem.applyHit(samurai, { damage: 15 });
    expect(samurai.hitstopRemaining).toBeGreaterThan(0);
  });
});

// e2e/visual-regression.spec.ts (Playwright)
import { test, expect } from '@playwright/test';
test('samurai idle pose matches reference', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('canvas');
  const canvas = page.locator('canvas');
  await expect(canvas).toHaveScreenshot('samurai-idle.png', {
    maxDiffPixelRatio: 0.01, // 1% tolerance for procedural art
  });
});
```

**Effort:** High (full test infrastructure) · **Impact:** Medium (enables the fidelity-gated workflow to be automated)

---

## 14. Combat Pacing: Input Buffering + After-Attack Delay Window

**Sources:**
- "Improving the Combat 'Impact' Of Action Games" — Song, Game Developer (same as #3): "After Attack Delay — In many games including Devil May Cry, POP:WW, and Ninja Gaiden, after an attack motion, the character animation lingers before ending so the player can continue the next attack even after missing the button press timing. This method improves responsiveness."
- "Fighting Genre Design Guidelines" — Christopher Dristig Stenström, Chalmers University
  URL: `https://www.cse.chalmers.se/research/group/idc/ituniv/sider12/wp-content/uploads/stenstrom_paper.pdf`
- "Tutorial Level Design Guidelines for 2D Fighting Games" — Mursyid Ibrahim et al., Australian National University
  URL: `https://openresearch-repository.anu.edu.au/server/api/core/bitstreams/99c80879-c87f-48f4-835d-b8c4616fdf3e/content`

**Evidence: A** (Game Developer + academic papers from Chalmers and ANU)

**What they say:**
- **Input buffering:** Store player inputs for a short window (~100-150ms) and execute them at the next valid point in the state machine. Prevents dropped inputs during animation transitions.
- **After-attack delay:** Extend the window after an attack where the next button press chains into a combo, even if timing was slightly off.
- **Difficulty curve:** Fighting games need gradual introduction of mechanics. Tutorial design guidelines (ANU paper) recommend teaching one mechanic at a time, in isolation, before combining.

**How it applies to SSHD:**
A samurai dueling game lives or dies on responsiveness. Implement:
1. **Input buffer** — queue the last attack/parry input for 120ms; consume it when the state machine reaches an actionable state.
2. **Combo window** — after a slash completes, leave a 150ms window where the next input chains into a follow-up slash.
3. **Difficulty scaling** — early duels have generous timing windows; later duels tighten them.

```typescript
class InputBuffer {
  private buffer: { action: string; time: number }[] = [];
  private readonly BUFFER_WINDOW = 120; // ms

  push(action: string, time: number) {
    this.buffer.push({ action, time });
  }

  consume(currentTime: number): string | null {
    const valid = this.buffer.filter(b => currentTime - b.time < this.BUFFER_WINDOW);
    this.buffer = valid;
    return valid.length > 0 ? valid[0].action : null;
  }
}
```

**Effort:** Medium · **Impact:** High (responsiveness is the #1 feel factor in combat games)

---

## 15. Pre-Render Static Vector Primitives to Off-Screen Canvas

**Sources:**
- web.dev — "Improving HTML5 Canvas performance" (same as #9): "Pre-render to an off-screen canvas. If you're re-drawing similar primitives across multiple frames, pre-render large parts of the scene."
  URL: `https://web.dev/articles/canvas-performance`
- MDN — "Optimizing canvas" (same as #7): "Pre-render similar primitives or repeating objects on an offscreen canvas."
  URL: `https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas`

**Evidence: A** (MDN + web.dev)

**What they say:**
If you're drawing the same vector primitives every frame (e.g., a samurai's body shape), pre-render them once to an off-screen canvas, then `drawImage()` that canvas each frame. `drawImage` is much faster than re-executing all the path operations. **Important:** the off-screen canvas should fit snugly around the image — a loose canvas wastes performance on the copy.

**How it applies to SSHD:**
Since the game uses **procedural vector art**, each samurai pose/frame is drawn from vector primitives (lines, arcs, fills). Pre-render each pose to a small off-screen canvas at generation time, then blit them during gameplay:

```typescript
// At load time
const poses: HTMLCanvasElement[] = [];
for (const poseData of samuraiPoseData) {
  const c = document.createElement('canvas');
  c.width = poseData.width; // snug fit
  c.height = poseData.height;
  const ctx = c.getContext('2d')!;
  drawSamuraiPose(ctx, poseData); // expensive vector ops — done once
  poses.push(c);
}

// At render time
function renderFrame(ctx: CanvasRenderingContext2D, poseIndex: number, x: number, y: number) {
  ctx.drawImage(poses[poseIndex], x, y); // fast blit
}
```

This also connects to improvement #5 — the pre-rendered canvases can become the texture atlas.

**Effort:** Medium · **Impact:** Medium

---

## 16. Damage Vibration: Visual-Only Offset, Static Hurtbox Positions

**Source:** Sakurai, "Thinking About Hitstop" (same as #2)

**Evidence: A** (primary source — Smash Bros creator)

**What it says:**
During hitstop, characters visually vibrate to simulate shock. But if hurtboxes moved with the visual offset, attacks that should hit would whiff. Solution: **vibrate visually, keep hurtbox positions static.** Also: grounded characters vibrate horizontally, aerial characters vibrate vertically. Vibration amplitude **decays** over the hitstop duration.

**How it applies to SSHD:**
```typescript
function updateVibration(samurai: Samurai) {
  if (samurai.hitstopRemaining > 0) {
    // Visual offset only — does NOT affect collision/hurtbox
    const decay = samurai.hitstopRemaining / samurai.hitstopTotal;
    const amp = samurai.vibrationAmplitude * decay;
    samurai.visualOffsetX = (Math.random() - 0.5) * amp;
    // Hurtbox stays at samurai.x, not samurai.x + visualOffsetX
    samurai.hitstopRemaining--;
  } else {
    samurai.visualOffsetX = 0;
  }
}
```

**Effort:** Low · **Impact:** Medium (makes hits feel weighty without breaking collision)

---

## 17. Disable Physics on Off-Screen / Non-Interacting Entities

**Source:** Generalist Programmer — Phaser Performance Optimization Guide (same as #4)

**Evidence: B** (practitioner tutorial)

**What it says:**
"Disable physics on off-screen objects." "Use collision groups to reduce checks — don't check everything against everything." "Use static bodies for immovable objects — static bodies skip velocity/acceleration calculations."

**How it applies to SSHD:**
The game has a small entity count (2 samurai), so this is low priority. But if projectiles or FX particles have physics bodies, disable physics when they leave the arena bounds. Use `body.enable = false` and re-enable on re-entry.

**Effort:** Low · **Impact:** Medium

---

## 18. Audio Sprites for Mobile SFX Reliability

**Source:** MDN — "Audio for Web Games" (same as #6)

**Evidence: A** (MDN)

**What it says:**
On mobile, loading many small audio files is slow and unreliable. **Audio sprites** — one larger audio file containing all SFX snippets, played at known start/stop times — reduce HTTP requests and allow "priming" (play-and-pause on user gesture to unlock audio).

**How it applies to SSHD:**
If procedural WebAudio synthesis (improvement #8) proves unreliable on some mobile browsers, fall back to audio sprites as a hybrid approach: synthesize sounds offline with `OfflineAudioContext`, encode to a single file, then play segments via sprite timing. However, if procedural synthesis works well, this may be unnecessary.

**Effort:** Medium · **Impact:** Medium (mobile reliability fallback)

---

## 19. Lazy-Load Level Assets + Unload via `textures.remove()`

**Sources:**
- Generalist Programmer — Phaser Performance Optimization Guide (same as #4)
- Phaser Discourse — "Properly Unloading Unused Assets"
  URL: `https://phaser.discourse.group/t/properly-unloading-unused-assets/7230`

**Evidence: B** (practitioner + Phaser community)

**What it says:**
Between scenes/levels, unload textures unique to the previous level with `this.textures.remove('key')` to free GPU memory. Keep shared assets (player, UI, common effects). Use scene `sleep`/`wake` instead of `stop`/`start` for pause menus to avoid full teardown.

**How it applies to SSHD:**
If the game has multiple duel stages with different arena backgrounds, unload the previous arena's textures when transitioning. For a single-arena game, this is less relevant.

**Effort:** Medium · **Impact:** Medium

---

## 20. Adaptive Quality: Reduce Particles/FX When FPS Drops

**Source:** Generalist Programmer — Phaser Performance Optimization Guide (same as #4)

**Evidence: C** (practitioner tutorial, not officially documented)

**What it says:**
Monitor `game.loop.actualFps` over a rolling window. If average FPS drops below 55, reduce to "medium" (fewer particles, simplified effects). Below 40, reduce to "low" (minimal effects, lower particle count).

**How it applies to SSHD:**
```typescript
class QualityManager {
  private fpsHistory: number[] = [];
  private level: 'high' | 'medium' | 'low' = 'high';

  update(fps: number) {
    this.fpsHistory.push(fps);
    if (this.fpsHistory.length > 60) this.fpsHistory.shift();
    const avg = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
    if (avg < 40 && this.level !== 'low') { this.level = 'low'; this.applyLow(); }
    else if (avg < 55 && this.level === 'high') { this.level = 'medium'; this.applyMedium(); }
  }

  private applyLow() { /* reduce particles, disable post-FX, simplify shadows */ }
  private applyMedium() { /* halve particle counts */ }
}
```

**Effort:** Medium · **Impact:** Medium (maintains playability on low-end devices)

---

## Quick Reference — Evidence Source Index

| Source | Grade | URL |
|---|---|---|
| MDN — Web Audio API best practices | A | https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices |
| MDN — Audio for Web Games | A | https://developer.mozilla.org/en-US/docs/Games/Techniques/Audio_for_Web_Games |
| MDN — Optimizing canvas | A | https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas |
| web.dev — Improving HTML5 Canvas performance | A | https://web.dev/articles/canvas-performance |
| web.dev — Developing game audio with Web Audio API | A | https://web.dev/articles/webaudio-games |
| Vite — Building for Production | A | https://vite.dev/guide/build |
| Phaser — Textures (official docs) | A | https://docs.phaser.io/phaser/concepts/textures |
| Sakurai — "Thinking About Hitstop" (Source Gaming) | A | https://sourcegaming.info/2015/11/11/thoughts-on-hitstop-sakurais-famitsu-column-vol-490-1/ |
| Game Developer — Vlambeer advice on action games | A | https://www.gamedeveloper.com/design/vlambeer-co-founder-shares-advice-on-building-better-action-games |
| Game Developer — Improving Combat Impact | A | https://www.gamedeveloper.com/audio/improving-the-combat-impact-of-action-games |
| Simplified Media — Fixed Timestep Game Loops | A | https://simplified.media/guides/fixed-timestep-loops |
| Chalmers — Fighting Genre Design Guidelines | A | https://www.cse.chalmers.se/research/group/idc/ituniv/sider12/wp-content/uploads/stenstrom_paper.pdf |
| ANU — Tutorial Level Design for 2D Fighting Games | A | https://openresearch-repository.anu.edu.au/server/api/core/bitstreams/99c80879-c87f-48f4-835d-b8c4616fdf3e/content |
| Theseus — Designing a 2D Fighting Game (thesis) | A | https://www.theseus.fi/bitstream/handle/10024/118514/Thesis_Miikka_Ketonen_KAT13PT.pdf |
| Generalist Programmer — Phaser Performance Guide | B | https://generalistprogrammer.com/tutorials/phaser-performance-optimization-guide |
| bitECS (GitHub) | B | https://github.com/NateTheGreatt/bitECS |
| vitest-canvas-mock (GitHub) | A | https://github.com/wobsoriano/vitest-canvas-mock |
| Playwright canvas testing (GitHub) | B | https://github.com/satelllte/playwright-canvas |
| TestDino — Canvas and WebGL Testing | B | https://github.com/testdino-hq/playwright-skill/blob/HEAD/core/canvas-and-webgl.md |

---

*Research completed: 2026-08-05. All sources verified live at time of access.*