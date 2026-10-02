import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessSwipeDeck from "./BlessSwipeDeck.vue";

beforeAll(() => {
  Element.prototype.setPointerCapture = () => {};
});

let w: VueWrapper<any>;
const mk = (props = {}) => {
  w = mount(BlessSwipeDeck, {
    props: {
      modelValue: ["a", "b", "c", "d"],
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v }),
      ...props,
    },
    attachTo: document.body,
  });
  return w;
};
afterEach(() => w?.unmount());
const left = () => w.props("modelValue") as string[];
const top = () => w.find(".bless-deck__card--top");
const stage = () => w.find(".bless-deck__stage");
const btn = (t: string) => w.findAll("button").find((b) => b.text() === t)!;

test("shows three cards, only the top one reachable", () => {
  mk();
  const cards = w.findAll(".bless-deck__card");
  expect(cards).toHaveLength(3);
  expect(top().text()).toContain("a");
  expect(cards[1].attributes("aria-hidden")).toBe("true");
  expect(cards[1].attributes("inert")).toBeDefined();
});

test("keys: right accepts, left rejects, up skips, each emits and announces", async () => {
  mk();
  await stage().trigger("keydown", { key: "ArrowRight" });
  await stage().trigger("keydown", { key: "ArrowLeft" });
  await stage().trigger("keydown", { key: "ArrowUp" });
  expect(left()).toEqual(["d"]);
  expect(w.emitted("decide")).toEqual([
    ["a", "accept"],
    ["b", "reject"],
    ["c", "skip"],
  ]);
  expect(w.find(".bless-deck__live").text()).toBe("Skip. 1 left.");
});

test("Backspace and Ctrl+Z undo in reverse order; undo with nothing does nothing", async () => {
  mk();
  await stage().trigger("keydown", { key: "Backspace" });
  expect(left()).toEqual(["a", "b", "c", "d"]);
  await stage().trigger("keydown", { key: "ArrowRight" });
  await stage().trigger("keydown", { key: "ArrowRight" });
  await stage().trigger("keydown", { key: "z", ctrlKey: true });
  expect(left()).toEqual(["b", "c", "d"]);
  await stage().trigger("keydown", { key: "Backspace" });
  expect(left()).toEqual(["a", "b", "c", "d"]);
  expect(w.emitted("undo")).toEqual([["b"], ["a"]]);
});

test("buttons decide and undo; they disable when there is nothing to do", async () => {
  mk({ modelValue: ["a"] });
  expect(btn("Undo").attributes("disabled")).toBeDefined();
  await btn("Accept").trigger("click");
  expect(left()).toEqual([]);
  expect(btn("Accept").attributes("disabled")).toBeDefined();
  expect(w.find(".bless-deck__empty").text()).toBe("No cards left");
  await btn("Undo").trigger("click");
  expect(left()).toEqual(["a"]);
});

const ptr = (el: Element, type: string, x = 0, y = 0) => {
  el.dispatchEvent(new MouseEvent(type, { clientX: x, clientY: y, bubbles: true }));
  return nextTick();
};

test("drag: past the threshold decides by direction, short of it springs back", async () => {
  mk();
  const el = () => top().element;
  await ptr(el(), "pointerdown", 0, 0);
  await ptr(el(), "pointermove", 60, 5);
  expect(top().attributes("style")).toContain("translate(60px, 5px)");
  expect((w.find(".bless-deck__stamp--accept").element as HTMLElement).style.opacity).toBe("0.6");
  await ptr(el(), "pointerup", 60, 5);
  expect(left()).toHaveLength(4); // 60 < 100
  await ptr(el(), "pointerdown", 0, 0);
  await ptr(el(), "pointermove", -150, 10);
  await ptr(el(), "pointerup", -150, 10);
  expect(w.emitted("decide")![0]).toEqual(["a", "reject"]);
  await ptr(el(), "pointerdown", 0, 0);
  await ptr(el(), "pointermove", 10, -140);
  await ptr(el(), "pointerup", 10, -140);
  expect(w.emitted("decide")![1]).toEqual(["b", "skip"]);
  await ptr(el(), "pointerdown", 0, 0);
  await ptr(el(), "pointermove", 20, 200); // down is not a verdict
  await ptr(el(), "pointerup", 20, 200);
  expect(left()).toEqual(["c", "d"]);
});

test("custom labels and exposed methods", async () => {
  mk({ labels: { accept: "Keep", reject: "Toss" } });
  expect(btn("Keep")).toBeTruthy();
  w.vm.reject();
  await nextTick();
  expect(w.emitted("decide")![0]).toEqual(["a", "reject"]);
  expect(w.find(".bless-deck__live").text()).toBe("Toss. 3 left.");
});
