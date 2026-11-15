import { mount } from "@vue/test-utils";
import BlessReactions from "./BlessReactions.vue";

const start = () => [
  { emoji: "🔥", count: 12 },
  { emoji: "👏", count: 1, active: true },
];

test("BlessReactions: a click adds or removes your reaction, and a count of zero drops the chip", async () => {
  const w = mount(BlessReactions, {
    props: {
      modelValue: start(),
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v as never }),
    },
  });
  const chips = () => w.findAll(".bless-reactions__chip:not(.bless-reactions__add)");
  expect(chips()[0]!.attributes("aria-label")).toBe("🔥 12 reactions");
  expect(chips()[1]!.attributes("aria-pressed")).toBe("true");
  await chips()[0]!.trigger("click");
  expect(chips()[0]!.text()).toBe("🔥13");
  expect(chips()[0]!.attributes("aria-pressed")).toBe("true");
  await chips()[1]!.trigger("click");
  expect(chips()).toHaveLength(1);
  expect(w.emitted("toggle")).toEqual([
    ["🔥", true],
    ["👏", false],
  ]);
});

test("BlessReactions: a picked emoji adds a new chip, and the max stops more", async () => {
  const w = mount(BlessReactions, {
    props: {
      modelValue: start(),
      max: 2,
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v as never }),
    },
  });
  w.findComponent({ name: "BlessEmojiPicker" }).vm.$emit("select", {
    char: "🎧",
    name: "headphone",
    group: "objects",
  });
  await w.vm.$nextTick();
  const last = w.findAll(".bless-reactions__chip:not(.bless-reactions__add)").at(-1)!;
  expect(last.text()).toBe("🎧1");
  expect(w.find(".bless-reactions__add").attributes("disabled")).toBeDefined();
  expect(w.findAll(".bless-reactions__chip")[0]!.attributes("disabled")).toBeDefined();
});

test("BlessReactions: no add button on request, and labels translate", () => {
  const w = mount(BlessReactions, {
    props: { modelValue: start(), noAdd: true, labels: { group: "Reaksi" } },
  });
  expect(w.find(".bless-reactions__add").exists()).toBe(false);
  expect(w.attributes("aria-label")).toBe("Reaksi");
});
