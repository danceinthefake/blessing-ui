import { mount } from "@vue/test-utils";
import BlessRuleBuilder, { type BlessRule } from "./BlessRuleBuilder.vue";

const props = {
  triggers: [{ id: "motion", label: "motion in the hall" }],
  conditions: [{ id: "night", label: "it is after sunset" }],
  actions: [
    { id: "lamp", label: "turn on the hall lamp" },
    { id: "cam", label: "start the camera" },
  ],
};
const sheet = () => {
  const w = mount(BlessRuleBuilder, {
    props: { ...props, "onUpdate:modelValue": (v: BlessRule) => w.setProps({ modelValue: v }) },
  });
  return w;
};

test("BlessRuleBuilder: save needs a trigger and an action, and the sentence reads the rule", async () => {
  const w = sheet();
  const submit = () => w.find("button[type=submit]");
  expect(submit().attributes("disabled")).toBeDefined();
  expect(w.find(".bless-rule__preview span").text()).toBe("When …, then ….");
  await w.findAll("select")[0]!.setValue("motion");
  await w.find(".bless-rule__add").trigger("click");
  await w.findAll("select")[1]!.setValue("night");
  await w.findAll("select")[2]!.setValue("lamp");
  await w.findAll(".bless-rule__add")[1]!.trigger("click");
  await w.findAll("select")[3]!.setValue("cam");
  expect(w.find(".bless-rule__preview span").text()).toBe(
    "When motion in the hall, if it is after sunset, then turn on the hall lamp and start the camera.",
  );
  await w.find("form").trigger("submit");
  expect(w.emitted("save")).toEqual([[{ when: "motion", if: ["night"], then: ["lamp", "cam"] }]]);
  // remove the condition, named by what it removes
  const x = w.find(".bless-rule__x");
  expect(x.attributes("aria-label")).toBe("Remove: it is after sunset");
  await x.trigger("click");
  expect((w.props("modelValue") as BlessRule).if).toEqual([]);
});
