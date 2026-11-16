import { mount } from "@vue/test-utils";
import BlessDowntimePicker from "./BlessDowntimePicker.vue";

const reasons = [
  { id: "jam", label: "Jam", icon: "⛔" },
  { id: "tool", label: "Tool change" },
  { id: "break", label: "Break", planned: true },
];

test("BlessDowntimePicker: unplanned and planned groups, a radio per reason, and save with a note", async () => {
  const w = mount(BlessDowntimePicker, {
    props: {
      reasons,
      machine: "Press 2",
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v as string }),
    },
  });
  expect(w.find(".bless-downtime__title").text()).toBe("Why did Press 2 stop?");
  expect(w.findAll("legend").map((l) => l.text())).toEqual(["Unplanned", "Planned"]);
  expect(w.find("button[type=submit]").attributes("disabled")).toBeDefined();
  await w.findAll("input[type=radio]")[0]!.setValue(true);
  expect(w.props("modelValue")).toBe("jam");
  await w.find(".bless-downtime__note input").setValue(" Sheet folded ");
  await w.find("form").trigger("submit");
  expect(w.emitted("save")).toEqual([["jam", "Sheet folded"]]);
});
