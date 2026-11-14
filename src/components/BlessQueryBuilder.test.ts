import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import BlessQueryBuilder from "./BlessQueryBuilder.vue";
import type { BlessQueryField, BlessQueryGroup } from "./query";

const fields: BlessQueryField[] = [
  { name: "title", label: "Title" },
  { name: "episodes", label: "Episodes", type: "number" },
  { name: "aired", label: "Aired", type: "date" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "airing", label: "Airing" },
      { value: "done", label: "Done" },
    ],
  },
];
const mk = (start: BlessQueryGroup, props = {}) => {
  const q = ref(start);
  const w = mount(
    {
      components: { BlessQueryBuilder },
      setup: () => ({ q, fields, props }),
      template: `<BlessQueryBuilder v-model="q" :fields v-bind="props" />`,
    },
    { attachTo: document.body },
  );
  return { w, q };
};
const selects = (w: ReturnType<typeof mount>) => w.findAll("select");

test("BlessQueryBuilder: add a rule, pick a field, and the operators follow its type", async () => {
  const { w, q } = mk({ match: "all", rules: [] });
  await w
    .findAll("button")
    .find((b) => b.text() === "Add rule")!
    .trigger("click");
  expect(q.value.rules).toEqual([{ field: "title", op: "eq", value: "" }]);
  const ops = () =>
    selects(w)[2]!
      .findAll("option")
      .map((o) => o.text());
  expect(ops()).toContain("contains");
  await selects(w)[1]!.setValue("aired");
  expect(ops()).toEqual([
    "is",
    "is not",
    "is before",
    "is on or before",
    "is after",
    "is on or after",
    "is empty",
    "is not empty",
  ]);
  expect(w.find("input").attributes("type")).toBe("date");
  await selects(w)[2]!.setValue("gt");
  await w.find("input").setValue("2015-01-01");
  expect(q.value.rules[0]).toEqual({ field: "aired", op: "gt", value: "2015-01-01" });
  // a field without that operator falls back to its first one, and the value clears
  await selects(w)[1]!.setValue("status");
  expect(q.value.rules[0]).toEqual({ field: "status", op: "eq", value: "" });
  expect(w.find("input").exists()).toBe(false);
  expect(selects(w)).toHaveLength(4);
  w.unmount();
});

test("BlessQueryBuilder: empty operators hide the value; match switches all and any", async () => {
  const { w, q } = mk({ match: "all", rules: [{ field: "title", op: "empty", value: "" }] });
  expect(w.find("input").exists()).toBe(false);
  await selects(w)[0]!.setValue("any");
  expect(q.value.match).toBe("any");
  w.unmount();
});

test("BlessQueryBuilder: groups nest up to maxDepth; remove keeps focus in the group", async () => {
  const { w, q } = mk({ match: "all", rules: [{ field: "title", op: "eq", value: "x" }] });
  const button = (t: string) => w.findAll("button").filter((b) => b.text() === t);
  await button("Add group")[0]!.trigger("click");
  expect(q.value.rules[1]).toEqual({
    match: "all",
    rules: [{ field: "title", op: "eq", value: "" }],
  });
  // depth 2 is the limit: the inner group has no "Add group"
  expect(button("Add group")).toHaveLength(1);
  await button("Remove group")[0]!.trigger("click");
  expect(q.value.rules).toHaveLength(1);
  await w.find("button[aria-label='Remove rule']").trigger("click");
  await nextTick();
  expect(q.value.rules).toEqual([]);
  expect(document.activeElement?.textContent?.trim()).toBe("Add rule");
  w.unmount();
});
