import { mount } from "@vue/test-utils";
import BlessBulkActionBar from "./BlessBulkActionBar.vue";

test("BlessBulkActionBar: hidden at 0; with a count it shows the count, the actions, and clear", async () => {
  const w = mount(BlessBulkActionBar, {
    props: { count: 0 },
    slots: { default: "<button>Archive</button><button>Delete</button>" },
  });
  expect(w.find("[role=toolbar]").exists()).toBe(false);
  expect(w.find("[aria-live]").text()).toBe("");
  await w.setProps({ count: 3 });
  const bar = w.find("[role=toolbar]");
  expect(bar.attributes("aria-label")).toBe("Selected items");
  expect(w.find(".bless-bulkbar__count").text()).toBe("3 selected");
  expect(w.find("[aria-live]").text()).toBe("3 selected");
  expect(bar.findAll("button").map((b) => b.text())).toEqual(["Archive", "Delete", ""]);
  await w.find(".bless-bulkbar__clear").trigger("click");
  expect(w.emitted("clear")).toHaveLength(1);
  expect(w.find(".bless-bulkbar__clear").attributes("aria-label")).toBe("Clear selection");
});

test("BlessBulkActionBar: fixed and labels", () => {
  const w = mount(BlessBulkActionBar, {
    props: { count: 1, fixed: true, labels: { selected: (n: number) => `${n} dipilih` } },
  });
  expect(w.classes()).toContain("bless-bulkbar--fixed");
  expect(w.find(".bless-bulkbar__count").text()).toBe("1 dipilih");
});
