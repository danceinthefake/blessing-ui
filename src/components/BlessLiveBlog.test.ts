import { mount } from "@vue/test-utils";
import BlessLiveBlog from "./BlessLiveBlog.vue";

const first = [
  { id: "2", time: "14:10", body: "Second", key: true },
  { id: "1", time: "14:00", title: "Start", body: "First", pinned: true },
];

test("BlessLiveBlog: pinned first, key moments marked, and new updates wait behind a button", async () => {
  const w = mount(BlessLiveBlog, {
    props: { updates: first, live: true },
    attachTo: document.body,
  });
  expect(w.find(".bless-live__badge").text()).toBe("Live");
  expect(w.findAll(".bless-live__body").map((b) => b.text())).toEqual(["First", "Second"]);
  expect(w.find(".is-key .bless-live__tag").text()).toBe("★ Key moment");
  expect(w.find(".bless-live__new").exists()).toBe(false);
  await w.setProps({
    updates: [
      { id: "4", time: "14:30", body: "Fourth" },
      { id: "3", time: "14:20", body: "Third" },
      ...first,
    ],
  });
  expect(w.findAll(".bless-live__body")).toHaveLength(2);
  expect(w.find(".bless-live__new").text()).toBe("↑ Show 2 new updates");
  expect(w.find("[role=status]").text()).toBe("Show 2 new updates");
  await w.find(".bless-live__new").trigger("click");
  expect(w.findAll(".bless-live__body").map((b) => b.text())).toEqual([
    "First",
    "Fourth",
    "Third",
    "Second",
  ]);
  expect(w.find(".bless-live__new").exists()).toBe(false);
  w.unmount();
});

test("BlessLiveBlog shows the updates that load after mount, not behind the button", async () => {
  const w = mount(BlessLiveBlog, { props: { updates: [] as typeof first, live: true } });
  await w.setProps({ updates: first });
  expect(w.findAll(".bless-live__body")).toHaveLength(2);
  expect(w.find(".bless-live__new").exists()).toBe(false);
});
