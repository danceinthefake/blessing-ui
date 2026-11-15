import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessSeatPicker from "./BlessSeatPicker.vue";

const zones = [
  { key: "front", label: "Front", price: 40 },
  { key: "back", label: "Back", price: 25 },
];
const rows = [
  {
    label: "A",
    seats: [
      { id: "A1", zone: "front" },
      { id: "A2", zone: "front", taken: true },
      null,
      { id: "A3", zone: "front" },
    ],
  },
  {
    label: "B",
    seats: [
      { id: "B1", zone: "back" },
      { id: "B2", zone: "back" },
      null,
      { id: "B3", zone: "back" },
    ],
  },
];
const sheet = (props = {}) => {
  const w = mount(BlessSeatPicker, {
    attachTo: document.body,
    props: {
      rows,
      zones,
      modelValue: [],
      "onUpdate:modelValue": (v: string[]) => w.setProps({ modelValue: v }),
      ...props,
    },
  });
  return w;
};
const seat = (w: ReturnType<typeof sheet>, id: string) => w.find(`[data-seat="${id}"]`);

test("BlessSeatPicker: seats with names, gaps, taken seats, and one tab stop", () => {
  const w = sheet();
  expect(w.findAll(".bless-seats__seat")).toHaveLength(6);
  expect(w.findAll(".bless-seats__gap")).toHaveLength(2);
  expect(seat(w, "A1").attributes("aria-label")).toBe("Row A, seat 1, Front, $40");
  expect(seat(w, "A2").attributes("aria-label")).toBe("Row A, seat 2, Front, $40, Taken");
  expect(seat(w, "A2").attributes("aria-disabled")).toBe("true");
  // a gap does not count: the seat after the aisle is seat 3
  expect(seat(w, "A3").attributes("aria-label")).toBe("Row A, seat 3, Front, $40");
  expect(w.findAll('[tabindex="0"]').map((b) => b.attributes("data-seat"))).toEqual(["A1"]);
  w.unmount();
});

test("BlessSeatPicker: a click chooses, a taken seat does nothing, the total adds up, and max stops more", async () => {
  const w = sheet({ max: 2 });
  await seat(w, "A1").trigger("click");
  await seat(w, "A2").trigger("click");
  await seat(w, "B1").trigger("click");
  expect(w.props("modelValue")).toEqual(["A1", "B1"]);
  expect(seat(w, "A1").attributes("aria-pressed")).toBe("true");
  expect(w.find("[role=status]").text()).toBe("2 seats · $65");
  await seat(w, "B2").trigger("click");
  expect(w.props("modelValue")).toEqual(["A1", "B1"]);
  expect(seat(w, "B2").attributes("aria-disabled")).toBe("true");
  await seat(w, "A1").trigger("click");
  expect(w.props("modelValue")).toEqual(["B1"]);
  w.unmount();
});

test("BlessSeatPicker: arrow keys move over gaps and between rows", async () => {
  const w = sheet();
  await seat(w, "A1").trigger("keydown", { key: "ArrowRight" });
  await nextTick();
  expect(document.activeElement?.getAttribute("data-seat")).toBe("A2");
  await seat(w, "A2").trigger("keydown", { key: "ArrowRight" });
  await nextTick();
  expect(document.activeElement?.getAttribute("data-seat")).toBe("A3");
  await seat(w, "A3").trigger("keydown", { key: "ArrowDown" });
  await nextTick();
  expect(document.activeElement?.getAttribute("data-seat")).toBe("B3");
  w.unmount();
});
