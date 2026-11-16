import { mount } from "@vue/test-utils";
import BlessVersionHistory from "./BlessVersionHistory.vue";

const versions = [
  { id: "v3", label: "Final mix", author: "Budi", time: "16 Nov, 10:00", added: 12, removed: 3 },
  { id: "v2", author: "Ana", time: "15 Nov, 18:40", summary: "Shorter intro" },
  { id: "v1", author: "Ana", time: "14 Nov, 09:00" },
];

test("BlessVersionHistory: the newest is current and shows first, older ones restore, changes in words", async () => {
  const w = mount(BlessVersionHistory, { props: { versions } });
  const items = w.findAll(".bless-versions__item");
  expect(items[0]!.find(".bless-versions__current").text()).toBe("Current");
  expect(items[0]!.classes()).toContain("is-selected");
  expect(items[0]!.find(".bless-versions__restore").exists()).toBe(false);
  expect(items[0]!.find(".bless-versions__diff .bless-sr").text()).toBe("12 added, 3 removed");
  expect(items[1]!.find("strong").text()).toBe("15 Nov, 18:40");
  expect(items[1]!.find(".bless-versions__summary").text()).toBe("Shorter intro");
  const restore = items[2]!.find(".bless-versions__restore");
  expect(restore.attributes("aria-label")).toBe("Restore: 14 Nov, 09:00");
  await restore.trigger("click");
  expect(w.emitted("restore")).toEqual([["v1"]]);
});

test("BlessVersionHistory: a click selects a version to look at", async () => {
  const w = mount(BlessVersionHistory, {
    props: { versions, "onUpdate:selected": (v: unknown) => w.setProps({ selected: v as string }) },
  });
  await w.findAll(".bless-versions__pick")[1]!.trigger("click");
  expect(w.emitted("update:selected")).toEqual([["v2"]]);
  expect(w.findAll(".bless-versions__pick")[1]!.attributes("aria-pressed")).toBe("true");
  expect(w.findAll(".bless-versions__pick")[0]!.attributes("aria-pressed")).toBe("false");
});
