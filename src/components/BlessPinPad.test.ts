import { mount } from "@vue/test-utils";
import { h, ref } from "vue";
import BlessPinPad from "./BlessPinPad.vue";
import { provideLabels } from "../composables/useLabels";

const key = (w: ReturnType<typeof mount>, label: string) =>
  w.findAll("button").find((b) => b.text() === label || b.attributes("aria-label") === label)!;

test("BlessPinPad: keys fill the PIN, stop at length, and emit complete once", async () => {
  const w = mount(BlessPinPad, { props: { length: 4, name: "pin" } });
  for (const d of ["1", "9", "8", "4", "5"]) await key(w, d).trigger("click");
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual(["1984"]);
  expect(w.emitted("complete")).toEqual([["1984"]]);
  await w.setProps({ modelValue: "1984" });
  expect(w.findAll(".bless-pinpad__dot--on")).toHaveLength(4);
  expect(w.find('input[type="hidden"]').attributes("value")).toBe("1984");
  expect(w.find('[aria-live="polite"]').text()).toBe("4 of 4 digits entered");
  expect(w.attributes("aria-label")).toBe("PIN");
});

test("BlessPinPad: delete removes the last digit, clear removes all", async () => {
  const w = mount(BlessPinPad, { props: { modelValue: "123" } });
  await key(w, "Delete").trigger("click");
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual(["12"]);
  await key(w, "Clear").trigger("click");
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual([""]);
});

test("BlessPinPad: a hardware keyboard types, deletes, and clears", async () => {
  const w = mount(BlessPinPad, { props: { modelValue: "" } });
  await w.trigger("keydown", { key: "7" });
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual(["7"]);
  await w.setProps({ modelValue: "78" });
  await w.trigger("keydown", { key: "Backspace" });
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual(["7"]);
  await w.trigger("keydown", { key: "Delete" });
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual([""]);
  await w.trigger("keydown", { key: "a" });
  await w.trigger("keydown", { key: "1", ctrlKey: true });
  expect(w.emitted("update:modelValue")).toHaveLength(3);
});

test("BlessPinPad: disabled ignores every key", async () => {
  const w = mount(BlessPinPad, { props: { disabled: true } });
  await key(w, "5").trigger("click");
  await w.trigger("keydown", { key: "5" });
  expect(w.emitted("update:modelValue")).toBeUndefined();
});

test("BlessPinPad: words come from labels or a label pack", () => {
  const Root = {
    setup() {
      provideLabels({ BlessPinPad: { clear: "Hapus", delete: "Hapus satu" } });
      return () => h(BlessPinPad);
    },
  };
  const w = mount(Root);
  expect(key(w, "Hapus")).toBeDefined();
  expect(key(w, "Hapus satu")).toBeDefined();
  const own = mount(BlessPinPad, {
    props: { modelValue: "1", labels: { entered: (n: number, l: number) => `${n}/${l}` } },
  });
  expect(own.find('[aria-live="polite"]').text()).toBe("1/4");
});

test("BlessPinPad: complete fires under a parent v-model", async () => {
  const done: string[] = [];
  const Root = {
    setup() {
      const pin = ref("");
      return () =>
        h(BlessPinPad, {
          modelValue: pin.value,
          "onUpdate:modelValue": (v: string) => (pin.value = v),
          onComplete: (v: string) => done.push(v),
        });
    },
  };
  const w = mount(Root);
  for (const d of ["1", "2", "3", "4"]) await key(w, d).trigger("click");
  expect(done).toEqual(["1234"]);
});
