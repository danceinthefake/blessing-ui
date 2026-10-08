export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vr: number;
  color: string;
  round: boolean;
  /** 0..1 of its life left; fades out over the last part */
  life: number;
}

export interface BurstOptions {
  count: number;
  /** viewport px */
  origin: { x: number; y: number };
  /** where the burst points, degrees, 0 = right, 270 = up */
  angle: number;
  /** total width of the cone, degrees */
  spread: number;
  /** px per second at launch (the strongest piece) */
  power: number;
  colors: string[];
}

/** The pieces of one burst; `rand` is injected so a test can fix it. */
export function burst(o: BurstOptions, rand: () => number = Math.random): Particle[] {
  return Array.from({ length: o.count }, (_, i) => {
    const a = ((o.angle + (rand() - 0.5) * o.spread) * Math.PI) / 180;
    const v = o.power * (0.45 + rand() * 0.55);
    return {
      x: o.origin.x,
      y: o.origin.y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      size: 5 + rand() * 6,
      rot: rand() * Math.PI * 2,
      vr: (rand() - 0.5) * 12,
      color: o.colors[i % o.colors.length]!,
      round: rand() < 0.3,
      life: 1,
    };
  });
}

/** Advance a piece by `dt` seconds: gravity pulls down, the air slows it, it fades near the end. */
export function step(p: Particle, dt: number, gravity: number, lifetime: number): void {
  p.vx *= 1 - 1.6 * dt;
  p.vy = p.vy * (1 - 1.6 * dt) + gravity * dt;
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  p.rot += p.vr * dt;
  p.life -= dt / lifetime;
}
