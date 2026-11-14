import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref } from "vue";
import BlessDateTimePicker from "./BlessDateTimePicker.vue";
import BlessDatePicker from "./BlessDatePicker.vue";
import BlessField from "./BlessField.vue";
import BlessTimePicker from "./BlessTimePicker.vue";

// DatePicker asks for a coarse pointer after mount; jsdom has no matchMedia
beforeAll(() => vi.stubGlobal("matchMedia", () => ({ matches: false })));
afterAll(() => vi.unstubAllGlobals());

const parts = (w: ReturnType<typeof mount>) => ({
  date: w.findComponent(BlessDatePicker),
  time: w.findComponent(BlessTimePicker),
});

test("BlessDateTimePicker: the value is set only when both parts are chosen", async () => {
  const w = mount(BlessDateTimePicker);
  const { date, time } = parts(w);
  await date.vm.$emit("update:modelValue", "2026-11-14");
  expect(w.emitted("update:modelValue")).toBeUndefined();
  await time.vm.$emit("update:modelValue", "09:30");
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual(["2026-11-14T09:30"]);
  await time.vm.$emit("update:modelValue", "");
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual([undefined]);
});

test("BlessDateTimePicker: a value from outside fills both parts", async () => {
  const v = ref<string | undefined>("2026-11-14T18:45");
  const w = mount(() => h(BlessDateTimePicker, { modelValue: v.value }));
  expect(parts(w).date.props("modelValue")).toBe("2026-11-14");
  expect(parts(w).time.props("modelValue")).toBe("18:45");
  v.value = undefined;
  await nextTick();
  expect(parts(w).time.props("modelValue")).toBe("");
});

test("BlessDateTimePicker: min and max limit the time only on their own day", async () => {
  const w = mount(BlessDateTimePicker, {
    props: { modelValue: "2026-11-14T10:00", min: "2026-11-14T09:00", max: "2026-11-20T17:00" },
  });
  expect(parts(w).date.props()).toMatchObject({ min: "2026-11-14", max: "2026-11-20" });
  expect(parts(w).time.props()).toMatchObject({ min: "09:00", max: undefined });
  await w.setProps({ modelValue: "2026-11-17T10:00" });
  expect(parts(w).time.props()).toMatchObject({ min: undefined, max: undefined });
  await w.setProps({ modelValue: "2026-11-20T10:00" });
  expect(parts(w).time.props("max")).toBe("17:00");
});

test("BlessDateTimePicker: in a Field the label names the date, and the time has its own id and name", () => {
  const w = mount(
    defineComponent({
      render: () => h(BlessField, { label: "Starts" }, () => h(BlessDateTimePicker)),
    }),
  );
  const forId = w.find("label").attributes("for");
  expect(parts(w).date.props("id")).toBe(forId);
  const input = w.find(".bless-time input");
  expect(input.attributes("id")).toBe(`${forId}-time`);
  expect(input.attributes("aria-label")).toBe("Time");
  expect(new Set(w.findAll("[id]").map((e) => e.attributes("id"))).size).toBe(
    w.findAll("[id]").length,
  );
});
