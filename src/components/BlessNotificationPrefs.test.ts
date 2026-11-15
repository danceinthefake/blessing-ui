import { mount } from "@vue/test-utils";
import { columnState, setCell, setColumn } from "../composables/checkMatrix";
import BlessNotificationPrefs from "./BlessNotificationPrefs.vue";

test("checkMatrix: cells, columns, and the column state", () => {
  let m = setCell({}, "a", "email", true);
  expect(m).toEqual({ a: ["email"] });
  expect(columnState(m, ["a", "b"], "email")).toBe("mixed");
  m = setColumn(m, ["a", "b"], "email", true);
  expect(columnState(m, ["a", "b"], "email")).toBe(true);
  m = setCell(m, "a", "email", false);
  expect(m.a).toEqual([]);
  expect(columnState(setColumn(m, ["a", "b"], "email", false), ["a", "b"], "email")).toBe(false);
});

const events = [
  { key: "comment", label: "New comment", description: "Someone answers you" },
  { key: "episode", label: "New episode" },
];
const channels = [
  { key: "email", label: "Email" },
  { key: "push", label: "Push" },
];

test("BlessNotificationPrefs: a check box per cell with a name, and an all box per column", async () => {
  const w = mount(BlessNotificationPrefs, {
    props: {
      events,
      channels,
      modelValue: { comment: ["email"] },
      "onUpdate:modelValue": (v: Record<string, string[]>) => w.setProps({ modelValue: v }),
    },
  });
  const cells = w.findAll("tbody input");
  expect(cells.map((c) => (c.element as HTMLInputElement).checked)).toEqual([
    true,
    false,
    false,
    false,
  ]);
  expect(cells[1]!.attributes("aria-label")).toBe("New comment by Push");
  const all = w.findAll("thead input");
  expect((all[0]!.element as HTMLInputElement).indeterminate).toBe(true);
  expect(all[0]!.attributes("aria-label")).toBe("All by Email");
  (all[0]!.element as HTMLInputElement).checked = true;
  await all[0]!.trigger("change");
  expect(w.props("modelValue")).toEqual({ comment: ["email"], episode: ["email"] });
  expect((w.findAll("thead input")[0]!.element as HTMLInputElement).indeterminate).toBe(false);
  const push = w.findAll("tbody input")[3]!;
  (push.element as HTMLInputElement).checked = true;
  await push.trigger("change");
  expect(w.props("modelValue")).toEqual({ comment: ["email"], episode: ["email", "push"] });
  expect(w.find(".bless-notify__desc").text()).toBe("Someone answers you");
});
