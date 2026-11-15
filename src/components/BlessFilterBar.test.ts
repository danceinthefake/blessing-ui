import { mount } from "@vue/test-utils";
import BlessFilterBar from "./BlessFilterBar.vue";
import type { BlessQueryRule } from "./query";

const fields = [
  { name: "title", label: "Title" },
  {
    name: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { value: "live", label: "Live" },
      { value: "draft", label: "Draft" },
    ],
  },
  { name: "date", label: "Date", type: "date" as const },
];

function make(rules: BlessQueryRule[]) {
  const w = mount(BlessFilterBar, {
    props: {
      fields,
      modelValue: rules,
      "onUpdate:modelValue": (v: BlessQueryRule[]) => w.setProps({ modelValue: v }),
    },
    attachTo: document.body,
  });
  return w;
}

test("BlessFilterBar: a chip per rule in words, with the option label and date words", () => {
  const w = make([
    { field: "status", op: "eq", value: "live" },
    { field: "date", op: "gt", value: "2026-11-01" },
    { field: "title", op: "empty", value: "" },
    { field: "title", op: "contains", value: "" },
  ]);
  expect(w.findAll(".bless-filterbar__edit").map((b) => b.text())).toEqual([
    "Status is Live",
    "Date is after 2026-11-01",
    "Title is empty",
    "Title contains …",
  ]);
  expect(w.attributes("aria-label")).toBe("Filters");
  expect(w.findAll(".bless-filterbar__x")[0]!.attributes("aria-label")).toBe(
    "Remove filter: Status",
  );
  w.unmount();
});

test("BlessFilterBar: add picks a field and opens its editor; edits, remove and clear change the rules", async () => {
  const w = make([]);
  expect(w.find(".bless-filterbar__list").exists()).toBe(false);
  await w.findAll(".bless-filterbar__pick")[1]!.trigger("click");
  expect(w.props("modelValue")).toEqual([{ field: "status", op: "eq", value: "" }]);
  await w.vm.$nextTick();
  await w.vm.$nextTick();
  // the new filter's editor is open
  expect(w.findAllComponents({ name: "BlessPopover" })[0]!.props("open")).toBe(true);
  await w.findComponent({ name: "BlessSelect" }).vm.$emit("update:modelValue", "neq");
  expect(w.props("modelValue")![0]).toMatchObject({ op: "neq" });
  await w.find(".bless-filterbar__x").trigger("click");
  expect(w.props("modelValue")).toEqual([]);
  await w.setProps({ modelValue: [{ field: "title", op: "eq", value: "a" }] });
  const clear = w.findAll("button").find((b) => b.text() === "Clear all")!;
  await clear.trigger("click");
  expect(w.props("modelValue")).toEqual([]);
  w.unmount();
});
