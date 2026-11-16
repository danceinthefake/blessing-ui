import { mount } from "@vue/test-utils";
import BlessContactPicker from "./BlessContactPicker.vue";

const contacts = [
  { id: "c", name: "Citra", detail: "citra@example.com" },
  { id: "a", name: "Ana", detail: "Editor" },
  { id: "b", name: "Budi" },
];
const sheet = (props = {}) => {
  const w = mount(BlessContactPicker, {
    props: {
      contacts,
      recent: ["b"],
      "onUpdate:modelValue": (v: string[]) => w.setProps({ modelValue: v }),
      ...props,
    },
  });
  return w;
};

test("BlessContactPicker: recent first, all by name, search, and the none status", async () => {
  const w = sheet();
  expect(w.findAll("legend").map((l) => l.text())).toEqual(["Recent", "All people"]);
  expect(w.findAll(".bless-contacts__name").map((n) => n.text())).toEqual([
    "Budi",
    "Ana",
    "Budi",
    "Citra",
  ]);
  await w.find("input[type=search]").setValue("example");
  expect(w.findAll(".bless-contacts__name").map((n) => n.text())).toEqual(["Citra"]);
  await w.find("input[type=search]").setValue("zzz");
  expect(w.find("[role=status]").text()).toBe("Nobody matches the search.");
});

test("BlessContactPicker: pick many with chips that remove, or one with radios", async () => {
  const w = sheet();
  await w.findAll("input[type=checkbox]")[1]!.setValue(true);
  await w.findAll("input[type=checkbox]")[3]!.setValue(true);
  expect(w.props("modelValue")).toEqual(["a", "c"]);
  expect(w.findAll(".bless-chip button").map((c) => c.attributes("aria-label"))).toEqual([
    "Remove Ana",
    "Remove Citra",
  ]);
  await w.find(".bless-chip button").trigger("click");
  expect(w.props("modelValue")).toEqual(["c"]);

  const one = sheet({ multiple: false });
  const radios = one.findAll("input[type=radio]");
  await radios[1]!.setValue(true);
  await radios[3]!.setValue(true);
  expect(one.props("modelValue")).toEqual(["c"]);
});
