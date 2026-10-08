import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessCoachmark from "./BlessCoachmark.vue";

const mk = (props: Record<string, unknown> = {}) =>
  mount(BlessCoachmark, {
    props: { text: "Export is here now", ...props },
    slots: { default: '<button class="target">Export</button>' },
    attachTo: document.body,
  });
beforeEach(() => localStorage.clear());

test("a dot with a name that says what is new, after mount", async () => {
  const w = mk();
  await nextTick();
  const dot = w.find(".bless-coachmark__dot");
  expect(dot.attributes("aria-label")).toBe("New: Export is here now");
  expect(dot.attributes("aria-expanded")).toBe("false");
  w.unmount();
});

test("the dot opens a bubble; Got it dismisses, says so, and is remembered by id", async () => {
  const w = mk({ id: "export" });
  await nextTick();
  await w.find(".bless-coachmark__dot").trigger("click");
  expect(w.find(".bless-coachmark__bubble").text()).toContain("Export is here now");
  await w.find(".bless-coachmark__bubble button").trigger("click");
  expect(w.find(".bless-coachmark__dot").exists()).toBe(false);
  expect(w.emitted("dismiss")).toHaveLength(1);
  expect(localStorage.getItem("bless-coachmark:export")).toBe("1");
  w.unmount();
  const again = mk({ id: "export" });
  await nextTick();
  expect(again.find(".bless-coachmark__dot").exists()).toBe(false);
  again.unmount();
});

test("using the wrapped element counts as seen, unless turned off", async () => {
  const w = mk();
  await nextTick();
  await w.find(".target").trigger("click");
  expect(w.find(".bless-coachmark__dot").exists()).toBe(false);
  w.unmount();
  const keep = mk({ dismissOnUse: false });
  await nextTick();
  await keep.find(".target").trigger("click");
  expect(keep.find(".bless-coachmark__dot").exists()).toBe(true);
  keep.unmount();
});

test("Escape closes the bubble but keeps the dot; labels translate", async () => {
  const w = mk({ labels: { dot: (t: string) => `Baru: ${t}`, ok: "Mengerti" } });
  await nextTick();
  expect(w.find(".bless-coachmark__dot").attributes("aria-label")).toBe("Baru: Export is here now");
  await w.find(".bless-coachmark__dot").trigger("click");
  expect(w.find(".bless-coachmark__bubble button").text()).toBe("Mengerti");
  await w.find(".bless-coachmark").trigger("keydown", { key: "Escape" });
  expect(w.find(".bless-coachmark__bubble").exists()).toBe(false);
  expect(w.find(".bless-coachmark__dot").exists()).toBe(true);
  w.unmount();
});

test("v-model:dismissed hides it without storage", async () => {
  const w = mk({ dismissed: true });
  await nextTick();
  expect(w.find(".bless-coachmark__dot").exists()).toBe(false);
  w.unmount();
});
