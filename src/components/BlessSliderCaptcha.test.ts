import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessSliderCaptcha from "./BlessSliderCaptcha.vue";

beforeAll(() => {
  Element.prototype.setPointerCapture = () => {};
});

let w: VueWrapper<any>;
const mk = (props = {}) => {
  w = mount(BlessSliderCaptcha, {
    props: {
      verified: false,
      "onUpdate:verified": (v: boolean) => w.setProps({ verified: v }),
      ...props,
    },
    attachTo: document.body,
  });
  return w;
};
afterEach(() => {
  w?.unmount();
  vi.restoreAllMocks();
});
const handle = () => w.find(".bless-captcha__handle");
/** the gap sits at this fraction of the track; read it back from the piece's target position */
const gapAt = () => {
  const gap = w.find(".bless-captcha__gap").element as HTMLElement;
  const W = 320,
    piece = 320 * 0.16;
  return parseFloat(gap.style.left) / (W - piece);
};
const ptr = (el: Element, type: string, x = 0) => {
  el.dispatchEvent(new MouseEvent(type, { clientX: x, bubbles: true }));
  return nextTick();
};
/** drag the handle to the fraction `to` of the 320px stage's travel */
async function dragTo(to: number) {
  const travel = 320 - 320 * 0.16;
  await ptr(handle().element, "pointerdown", 0);
  await ptr(handle().element, "pointermove", to * travel);
  await ptr(handle().element, "pointerup", to * travel);
}

test("dropping the piece on the gap verifies and locks the widget", async () => {
  mk();
  await dragTo(gapAt() + 0.01);
  expect(w.props("verified")).toBe(true);
  expect(w.emitted("verify")).toHaveLength(1);
  expect(w.find(".bless-captcha__live").text()).toBe("Verified");
  const at = handle().attributes("style");
  await dragTo(0.1); // locked: no effect
  expect(handle().attributes("style")).toBe(at);
});

test("a miss fails, resets the slider and moves the gap", async () => {
  mk();
  const before = gapAt();
  await dragTo(before + 0.2 > 1 ? before - 0.2 : before + 0.2);
  expect(w.props("verified")).toBe(false);
  expect(w.emitted("fail")).toHaveLength(1);
  expect(handle().attributes("aria-valuenow")).toBe("0");
  expect(w.find(".bless-captcha__live").text()).toBe("Not quite, try again");
  expect(w.find(".bless-captcha").classes()).toContain("bless-captcha--fail");
});

test("keyboard: arrows move, Shift moves further, Enter submits", async () => {
  mk();
  await handle().trigger("keydown", { key: "ArrowRight" });
  expect(handle().attributes("aria-valuenow")).toBe("1");
  await handle().trigger("keydown", { key: "ArrowRight", shiftKey: true });
  expect(handle().attributes("aria-valuenow")).toBe("11");
  await handle().trigger("keydown", { key: "ArrowLeft", shiftKey: true });
  await handle().trigger("keydown", { key: "ArrowLeft", shiftKey: true });
  expect(handle().attributes("aria-valuenow")).toBe("0"); // clamped
  vi.spyOn(Math, "random").mockReturnValue(0.5);
  w.vm.reset();
  await nextTick();
  const target = gapAt();
  for (let i = 0; i < Math.round(target * 100); i++)
    await handle().trigger("keydown", { key: "ArrowRight" });
  await handle().trigger("keydown", { key: "Enter" });
  expect(w.props("verified")).toBe(true);
});

test("reset unlocks and starts over", async () => {
  mk({ verified: true });
  await handle().trigger("keydown", { key: "ArrowRight" });
  expect(handle().attributes("aria-valuenow")).toBe("0"); // locked
  w.vm.reset();
  await nextTick();
  expect(w.props("verified")).toBe(false);
  await handle().trigger("keydown", { key: "ArrowRight" });
  expect(handle().attributes("aria-valuenow")).toBe("1");
});

test("tolerance widens what counts; an image src becomes the background", async () => {
  mk({ tolerance: 0.5, src: "pic.png" });
  expect(w.find(".bless-captcha__stage").attributes("style")).toContain("pic.png");
  await dragTo(Math.min(1, gapAt() + 0.3));
  expect(w.props("verified")).toBe(true);
});
