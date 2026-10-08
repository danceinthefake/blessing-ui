import { mount } from "@vue/test-utils";
import BlessConfetti from "./BlessConfetti.vue";
import { burst, step } from "../composables/confetti";

const seq = (...n: number[]) => {
  let i = 0;
  return () => n[i++ % n.length]!;
};
const opts = {
  count: 6,
  origin: { x: 100, y: 200 },
  angle: 270,
  spread: 0,
  power: 1000,
  colors: ["red", "blue"],
};

test("a burst has `count` pieces at the origin, colours taken in turn, flying along the angle", () => {
  const ps = burst(opts, seq(0.5, 1));
  expect(ps).toHaveLength(6);
  expect(ps.every((p) => p.x === 100 && p.y === 200)).toBe(true);
  expect(ps.map((p) => p.color)).toEqual(["red", "blue", "red", "blue", "red", "blue"]);
  expect(ps[0]!.vy).toBeLessThan(0); // 270° is up
  expect(Math.abs(ps[0]!.vx)).toBeLessThan(1e-6); // spread 0: straight
});

test("a wide spread throws pieces both ways", () => {
  const ps = burst({ ...opts, count: 40, spread: 360, angle: 0 }, Math.random);
  expect(ps.some((p) => p.vx > 0)).toBe(true);
  expect(ps.some((p) => p.vx < 0)).toBe(true);
});

test("step: gravity pulls down, air slows the sideways drift, life runs out", () => {
  const p = burst({ ...opts, spread: 0, angle: 0 }, seq(0.5))[0]!;
  const vx = p.vx;
  step(p, 0.1, 1400, 2);
  expect(p.vy).toBeGreaterThan(0);
  expect(p.vx).toBeLessThan(vx);
  expect(p.life).toBeCloseTo(0.95);
});

const ctx = new Proxy({}, { get: () => () => {}, set: () => true });
const stub = () => {
  HTMLCanvasElement.prototype.getContext = (() => ctx) as never;
  let frames: FrameRequestCallback[] = [];
  vi.spyOn(window, "requestAnimationFrame").mockImplementation(
    (cb) => (frames.push(cb), frames.length),
  );
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  return {
    run: (ms: number) => {
      const next = frames;
      frames = [];
      next.forEach((cb) => cb(ms));
    },
    pending: () => frames.length,
  };
};
const mm = (reduce: boolean) =>
  (window.matchMedia = ((q: string) => ({
    matches: reduce && /reduce/.test(q),
    media: q,
  })) as never);
afterEach(() => vi.restoreAllMocks());

test("fire() animates until every piece has gone, then says done", () => {
  mm(false);
  const t = stub();
  const w = mount(BlessConfetti, { props: { count: 10, duration: 300 } });
  (w.vm as unknown as { fire: () => void }).fire();
  expect(t.pending()).toBe(1);
  let now = performance.now();
  for (let i = 0; i < 60 && t.pending(); i++) t.run((now += 50));
  expect(t.pending()).toBe(0);
  expect(w.emitted("done")).toHaveLength(1);
});

test("under reduced motion nothing is drawn and done comes at once", () => {
  mm(true);
  const t = stub();
  const w = mount(BlessConfetti);
  (w.vm as unknown as { fire: () => void }).fire();
  expect(t.pending()).toBe(0);
  expect(w.emitted("done")).toHaveLength(1);
});

test("the canvas is hidden from assistive tech and lets clicks through", () => {
  const w = mount(BlessConfetti);
  expect(w.find("canvas").attributes("aria-hidden")).toBe("true");
});
