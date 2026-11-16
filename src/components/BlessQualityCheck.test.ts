import { mount } from "@vue/test-utils";
import BlessQualityCheck, { checkPasses, type BlessQualityResult } from "./BlessQualityCheck.vue";

const items = [
  { id: "len", label: "Length", min: 99.5, max: 100.5, unit: "mm" },
  { id: "look", label: "No scratches" },
];

test("checkPasses: a measure inside its limits, a pass mark, and undefined until done", () => {
  expect(checkPasses(items[0]!, { value: 100.2 })).toBe(true);
  expect(checkPasses(items[0]!, { value: 101 })).toBe(false);
  expect(checkPasses(items[0]!, {})).toBeUndefined();
  expect(checkPasses(items[1]!, { pass: false })).toBe(false);
});

test("BlessQualityCheck: measure and mark, verdicts in words, the summary, and submit when complete", async () => {
  const w = mount(BlessQualityCheck, {
    props: {
      items,
      "onUpdate:modelValue": (v: BlessQualityResult) => w.setProps({ modelValue: v }),
    },
  });
  expect(w.find("[role=status]").text()).toBe("0 passed, 0 failed, 2 to do");
  expect(w.find(".bless-quality__limits").text()).toBe("99.5 – 100.5 mm");
  const input = w.find("input[type=number]");
  await input.setValue("100.7");
  await input.trigger("change");
  expect(w.find(".bless-quality__verdict").text()).toBe("✕ Out of limits");
  expect(input.attributes("aria-invalid")).toBe("true");
  expect(w.find("button[type=submit]").attributes("disabled")).toBeDefined();
  await w.findAll("input[type=radio]")[0]!.trigger("change");
  expect(w.find("[role=status]").text()).toBe("1 passed, 1 failed, 0 to do · The unit fails.");
  await w.find("form").trigger("submit");
  expect(w.emitted("submit")![0]![1]).toBe(false);
});
