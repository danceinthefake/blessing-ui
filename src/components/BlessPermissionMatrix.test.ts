import { mount } from "@vue/test-utils";
import BlessPermissionMatrix from "./BlessPermissionMatrix.vue";

const roles = [
  { key: "owner", label: "Owner", locked: true },
  { key: "editor", label: "Editor" },
  { key: "guest", label: "Guest" },
];
const permissions = [
  { key: "publish", label: "publish episodes", group: "Episodes" },
  { key: "edit", label: "edit episodes", group: "Episodes" },
  { key: "billing", label: "change billing", group: "Account" },
];

test("BlessPermissionMatrix: groups, a locked role with every permission, and a name for each box", () => {
  const w = mount(BlessPermissionMatrix, {
    props: { roles, permissions, modelValue: { editor: ["edit"] } },
  });
  expect(w.findAll(".bless-perms__group th").map((t) => t.text())).toEqual(["Episodes", "Account"]);
  const first = w.findAll("tbody tr:not(.bless-perms__group)")[0]!.findAll("input");
  expect(first.map((i) => (i.element as HTMLInputElement).checked)).toEqual([true, false, false]);
  expect(first[0]!.attributes("disabled")).toBeDefined();
  expect(first[0]!.attributes("aria-label")).toBe("Owner can publish episodes, cannot change");
  expect(first[1]!.attributes("aria-label")).toBe("Editor can publish episodes");
  const all = w.findAll("thead input");
  expect((all[0]!.element as HTMLInputElement).checked).toBe(true);
  expect((all[1]!.element as HTMLInputElement).indeterminate).toBe(true);
});

test("BlessPermissionMatrix: a box and a whole role change the grants", async () => {
  const w = mount(BlessPermissionMatrix, {
    props: {
      roles,
      permissions,
      modelValue: {},
      "onUpdate:modelValue": (v: Record<string, string[]>) => w.setProps({ modelValue: v }),
    },
  });
  const cell = w.findAll("tbody tr:not(.bless-perms__group)")[2]!.findAll("input")[2]!;
  (cell.element as HTMLInputElement).checked = true;
  await cell.trigger("change");
  expect(w.props("modelValue")).toEqual({ guest: ["billing"] });
  const all = w.findAll("thead input")[1]!;
  (all.element as HTMLInputElement).checked = true;
  await all.trigger("change");
  expect(w.props("modelValue")).toEqual({
    guest: ["billing"],
    editor: ["publish", "edit", "billing"],
  });
});
