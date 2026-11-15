import { mount } from "@vue/test-utils";
import BlessAvailabilityGrid from "./BlessAvailabilityGrid.vue";

function make(model: string[] = [], props: Record<string, unknown> = {}) {
  const w = mount(BlessAvailabilityGrid, {
    props: {
      days: ["Mon", "Tue", "Wed"],
      dayStart: 9,
      dayEnd: 11,
      modelValue: model,
      "onUpdate:modelValue": (v: string[]) => w.setProps({ modelValue: v }),
      ...props,
    },
    attachTo: document.body,
  });
  return w;
}
const cell = (w: ReturnType<typeof make>, d: number, t: number) =>
  w.find(`[data-cell="${d},${t}"]`);
// the grid finds the cell under the pointer, as a touch drag keeps its first target
const ptr = (el: Element, type: string) => {
  document.elementFromPoint = () => el;
  el.dispatchEvent(new MouseEvent(type, { bubbles: true, button: 0, clientX: 0, clientY: 0 }));
};

test("BlessAvailabilityGrid: a grid of day × time cells with headers and states in words", () => {
  const w = make(["Tue 09:30"]);
  expect(w.find("table").attributes("role")).toBe("grid");
  expect(w.findAll("thead th").map((t) => t.text())).toEqual(["Mon", "Tue", "Wed"]);
  expect(w.findAll("tbody th").map((t) => t.text())).toEqual(["09:00", "09:30", "10:00", "10:30"]);
  expect(w.findAll("[role=gridcell]")).toHaveLength(12);
  expect(cell(w, 1, 1).attributes("aria-selected")).toBe("true");
  expect(cell(w, 1, 1).text()).toBe("free");
  expect(cell(w, 0, 0).text()).toBe("busy");
  // one Tab stop
  expect(w.findAll("[tabindex='0']")).toHaveLength(1);
  w.unmount();
});

test("BlessAvailabilityGrid: a drag paints the rectangle free, and a drag from a free cell clears", async () => {
  const w = make();
  ptr(cell(w, 0, 0).element, "pointerdown");
  ptr(cell(w, 1, 2).element, "pointermove");
  ptr(cell(w, 1, 2).element, "pointerup");
  await w.vm.$nextTick();
  expect([...w.props("modelValue")!].sort()).toEqual(
    ["Mon 09:00", "Mon 09:30", "Mon 10:00", "Tue 09:00", "Tue 09:30", "Tue 10:00"].sort(),
  );
  ptr(cell(w, 1, 1).element, "pointerdown");
  ptr(cell(w, 1, 2).element, "pointermove");
  ptr(cell(w, 1, 2).element, "pointerup");
  await w.vm.$nextTick();
  expect([...w.props("modelValue")!].sort()).toEqual(
    ["Mon 09:00", "Mon 09:30", "Mon 10:00", "Tue 09:00"].sort(),
  );
  w.unmount();
});

test("BlessAvailabilityGrid: arrows move the focus, Space toggles, disabled does nothing", async () => {
  const w = make();
  await cell(w, 0, 0).trigger("keydown", { key: "ArrowRight" });
  await cell(w, 0, 0).trigger("keydown", { key: "ArrowDown" });
  await w.vm.$nextTick();
  expect(document.activeElement).toBe(cell(w, 1, 1).element);
  await cell(w, 1, 1).trigger("keydown", { key: " " });
  expect(w.props("modelValue")).toEqual(["Tue 09:30"]);
  await cell(w, 1, 1).trigger("keydown", { key: "Enter" });
  expect(w.props("modelValue")).toEqual([]);
  await w.setProps({ disabled: true });
  await cell(w, 1, 1).trigger("keydown", { key: " " });
  ptr(cell(w, 0, 0).element, "pointerdown");
  expect(w.props("modelValue")).toEqual([]);
  w.unmount();
});
