# birdcore

2D physics engine for slingshot games, written in pure MoonBit.
Powers [MoonBird (怒鸭大战)](https://github.com/tanxiansheng221/moonbird) — playable at https://tanxiansheng221.github.io/moonbird/

## Features

- Semi-implicit Euler integration with fixed timestep (`DT = 1/60`)
- Collision detection: circle-circle, circle-AABB (clamp closest-point), AABB-AABB
- Impulse-based resolution with restitution, mass-ratio separation, slop tolerance
- Sleeping system (low-velocity sleep, wake on high-speed contact) for stable stacking
- Material system: per-material density / restitution / damage threshold / HP
  (wood, ice, stone, pig, TNT, bird, ground)
- Blast: radius damage with falloff + radial impulse; same-frame multi-blast unified resolution (chain-reaction safe)
- Pure logic, zero platform dependency — fully unit-testable with `moon test`

## Usage

Add to your `moon.mod`:

```
import {
  "tanxiansheng221/birdcore@0.1.1",
}
```

Minimal example (see `core/core.mbt` for the full API):

```
let w = World::new()
w.add({ px: 0.0, py: 0.0, vx: 0.0, vy: 0.0, kind: BlockK,
        shape: Box(48, 18), mat: Wood, hp: mat_hp(Wood),
        asleep: false, sleep_t: 0.0, dead: false })
let damages = w.step(DT)   // returns per-step damage events
```

## Tests

```
moon test --target wasm
```

11/11 passing: trajectory consistency, collision geometry, impulse exchange, stack stability regression, blast, level validation.

## License

MIT
