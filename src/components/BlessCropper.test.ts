import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessCropper from "./BlessCropper.vue";
import { initialBox, moveBox, resizeBox, scaleBox } from "../composables/cropBox";

const close = (a: number, b: number) => expect(a).toBeCloseTo(b, 6);

test("initialBox: free is 90% centred; a ratio is the largest centred box of that shape", () => {
  const free = initialBox(0);
  [free.l, free.t, free.r, free.b].forEach((v, i) => close(v, i < 2 ? 0.05 : 0.95));
  const wide = initialBox(2);
  close((wide.r - wide.l) / (wide.b - wide.t), 2);
  close((wide.l + wide.r) / 2, 0.5);
  const tall = initialBox(0.5);
  close((tall.r - tall.l) / (tall.b - tall.t), 0.5);
});

test("moveBox stops at the image edge and keeps the size", () => {
  const m = moveBox({ l: 0.2, t: 0.2, r: 0.6, b: 0.5 }, 1, -1);
  close(m.r, 1);
  close(m.l, 0.6);
  close(m.t, 0);
  close(m.b - m.t, 0.3);
});

test("resizeBox: edges move one side; the minimum size holds; a ratio keeps the shape", () => {
  const b = { l: 0.2, t: 0.2, r: 0.6, b: 0.6 };
  expect(resizeBox(b, "e", 0.9, 0)).toEqual({ ...b, r: 0.9 });
  expect(resizeBox(b, "w", 0.7, 0).l).toBeCloseTo(0.55);
  const sq = resizeBox(b, "se", 0.9, 0.7, 1);
  close(sq.r - sq.l, sq.b - sq.t);
  close(sq.l, 0.2); // the opposite corner stays
  close(sq.t, 0.2);
  const nw = resizeBox(b, "nw", 0, 0, 2);
  close((nw.r - nw.l) / (nw.b - nw.t), 2);
  close(nw.r, 0.6);
});

test("scaleBox grows around the centre and never leaves the image", () => {
  const s = scaleBox({ l: 0.4, t: 0.4, r: 0.6, b: 0.6 }, 0.2);
  close(s.r - s.l, 0.4);
  close((s.l + s.r) / 2, 0.5);
  const big = scaleBox({ l: 0.05, t: 0.05, r: 0.95, b: 0.95 }, 1);
  expect(big.l).toBeGreaterThanOrEqual(0);
  expect(big.r).toBeLessThanOrEqual(1);
});

// --- component, with a fake 200 x 100 image and a canvas that records draws ---
const draws: unknown[][] = [];
beforeAll(() => {
  class FakeImage {
    naturalWidth = 200;
    naturalHeight = 100;
    onload?: () => void;
    onerror?: () => void;
    crossOrigin = "";
    set src(v: string) {
      queueMicrotask(() => (v.includes("bad") ? this.onerror?.() : this.onload?.()));
    }
  }
  vi.stubGlobal("Image", FakeImage);
  HTMLCanvasElement.prototype.getContext = (() => ({
    translate() {},
    rotate() {},
    drawImage: (...a: unknown[]) => draws.push(a),
  })) as never;
  HTMLCanvasElement.prototype.toBlob = function (cb: BlobCallback) {
    cb(new Blob(["x"], { type: "image/png" }));
  };
});
afterAll(() => vi.unstubAllGlobals());

let w: VueWrapper<any>;
const mk = async (props = {}) => {
  w = mount(BlessCropper, { props: { src: "a.png", ...props }, attachTo: document.body });
  await flushPromises();
  await nextTick();
};
afterEach(() => w?.unmount());
const rect = () => w.emitted("update:modelValue")!.at(-1)![0];

test("loads, emits ready, and reports a 90% centred rect in image pixels", async () => {
  await mk();
  expect(w.emitted("ready")).toHaveLength(1);
  expect(rect()).toEqual({ x: 10, y: 5, width: 180, height: 90, rotation: 0 });
  expect(w.find(".bless-cropper__readout").text()).toContain("180 × 90 px");
});

test("a bad src shows an alert and emits error", async () => {
  await mk({ src: "bad.png" });
  expect(w.find('[role="alert"]').exists()).toBe(true);
  expect(w.emitted("error")).toHaveLength(1);
});

test("aspect locks the shape and leaves only the corner handles", async () => {
  await mk({ aspect: 1 });
  const r = rect() as { width: number; height: number };
  expect(r.width).toBe(r.height);
  expect(w.findAll(".bless-cropper__handle")).toHaveLength(4);
});

test("free crop has eight handles", async () => {
  await mk();
  expect(w.findAll(".bless-cropper__handle")).toHaveLength(8);
});

test("keyboard: arrows move, Shift moves further, + and − resize, with an announcement", async () => {
  await mk();
  const f = w.find(".bless-cropper__frame");
  await f.trigger("keydown", { key: "-" });
  const small = rect() as { width: number; height: number };
  expect(small.width).toBeLessThan(180);
  expect(w.find(".bless-cropper__live").text()).toMatch(/pixels, from/);
  await f.trigger("keydown", { key: "ArrowLeft", shiftKey: true });
  expect((rect() as { x: number }).x).toBeLessThan(10);
  await f.trigger("keydown", { key: "Tab" }); // untouched keys do nothing
});

test("rotating swaps the axes and resets the box", async () => {
  await mk();
  await w.findAll(".bless-cropper__controls button")[1].trigger("click");
  await nextTick();
  expect(rect()).toEqual({ x: 5, y: 10, width: 90, height: 180, rotation: 90 });
  await w.findAll(".bless-cropper__controls button")[0].trigger("click");
  await w.findAll(".bless-cropper__controls button")[0].trigger("click");
  await nextTick();
  expect((rect() as { rotation: number }).rotation).toBe(270);
});

test("toBlob draws the crop out of the full-size image, optionally scaled down", async () => {
  await mk();
  draws.length = 0;
  const blob = await w.vm.toBlob({ maxWidth: 90 });
  expect(blob).toBeInstanceOf(Blob);
  const crop = draws.at(-1)!; // (canvas, sx, sy, sw, sh, 0, 0, dw, dh)
  expect(crop.slice(1)).toEqual([10, 5, 180, 90, 0, 0, 90, 45]);
});
