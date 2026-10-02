import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessLoupe from "./BlessLoupe.vue";

let w: VueWrapper<any>;
const mk = (props = {}) => {
  w = mount(BlessLoupe, {
    props: { src: "a.jpg", alt: "A cat", zoom: 2, size: 100, ...props },
    attachTo: document.body,
  });
  // a 400 x 200 picture at (50, 30)
  w.element.getBoundingClientRect = () =>
    ({ left: 50, top: 30, width: 400, height: 200, right: 450, bottom: 230 }) as DOMRect;
  return w;
};
afterEach(() => w?.unmount());
const ptr = (type: string, x: number, y: number, pointerType = "mouse") => {
  const e = new MouseEvent(type, {
    clientX: x,
    clientY: y,
    bubbles: type !== "pointerenter" && type !== "pointerleave",
  });
  Object.defineProperty(e, "pointerType", { value: pointerType });
  w.element.dispatchEvent(e);
  return nextTick();
};
const lens = () => w.find(".bless-loupe__lens");

test("nothing shows until the pointer is over the picture; the picture keeps its alt", async () => {
  mk();
  expect(lens().exists()).toBe(false);
  expect(w.find("img").attributes("alt")).toBe("A cat");
  await ptr("pointermove", 250, 130);
  expect(lens().exists()).toBe(true);
  expect(lens().attributes("aria-hidden")).toBe("true");
  await ptr("pointerleave", 0, 0);
  expect(lens().exists()).toBe(false);
});

test("the lens is centred on the pointer and shows the spot enlarged", async () => {
  mk();
  await ptr("pointermove", 250, 130); // 200, 100 into the picture: its centre
  const s = lens().attributes("style")!;
  expect(s).toContain("width: 100px");
  expect(s).toContain("left: 150px"); // 200 - 50
  expect(s).toContain("top: 50px"); // 100 - 50
  expect(s).toContain("background-size: 800px 400px"); // picture x zoom
  expect(s).toContain("background-position: -350px -150px"); // 50 - 200 * 2, 50 - 100 * 2
  expect(s).toContain("a.jpg");
});

test("past the edge the point is held at the edge; zoomSrc feeds the lens", async () => {
  mk({ zoomSrc: "big.jpg" });
  await ptr("pointermove", 9999, -50);
  const s = lens().attributes("style")!;
  expect(s).toContain("left: 350px"); // x clamped to 400, minus 50
  expect(s).toContain("top: -50px"); // y clamped to 0, minus 50
  expect(s).toContain("big.jpg");
});

test("touch lifts the lens above the finger and hides on lift", async () => {
  mk();
  await ptr("pointermove", 250, 130, "touch");
  expect(lens().attributes("style")).toContain("top: -28px"); // 100 - 50 - (50 + 28)
  await ptr("pointerup", 250, 130, "touch");
  expect(lens().exists()).toBe(false);
});

test("a mouse button release keeps the lens; a cancelled touch removes it", async () => {
  mk();
  await ptr("pointermove", 250, 130);
  await ptr("pointerup", 250, 130);
  expect(lens().exists()).toBe(true);
  await ptr("pointermove", 250, 130, "touch");
  await ptr("pointercancel", 0, 0, "touch");
  expect(lens().exists()).toBe(false);
});

test("keyboard: focus shows the lens at the centre, arrows move it, Escape and blur hide it", async () => {
  mk();
  await w.trigger("focus");
  expect(lens().attributes("style")).toContain("left: 150px"); // centre
  await w.trigger("keydown", { key: "ArrowRight" });
  expect(lens().attributes("style")).toContain("left: 170px"); // +5% of 400
  await w.trigger("keydown", { key: "ArrowDown", shiftKey: true });
  expect(lens().attributes("style")).toContain("top: 90px"); // 100 + 20% of 200 - 50
  await w.trigger("keydown", { key: "Escape" });
  expect(lens().exists()).toBe(false);
  await w.trigger("keydown", { key: "ArrowLeft" });
  expect(lens().exists()).toBe(true);
  await w.trigger("blur");
  expect(lens().exists()).toBe(false);
});
