import { mount } from "@vue/test-utils";
import BlessSavedForm from "./BlessSavedForm.vue";

beforeEach(() => localStorage.clear());
afterEach(() => vi.useRealTimers());

type V = Record<string, unknown>;
const make = (modelValue: V) => {
  const w = mount(BlessSavedForm, {
    props: {
      storageKey: "t",
      modelValue,
      "onUpdate:modelValue": (v: V) => w.setProps({ modelValue: v }),
    },
    slots: { default: "<input />" },
  });
  return w;
};

test("BlessSavedForm: saves after a wait, offers the draft later, resumes, and clears on send", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-17T09:30:00Z"));
  const a = make({ name: "" });
  await a.setProps({ modelValue: { name: "Ana" } });
  expect(localStorage.getItem("t")).toBeNull();
  vi.advanceTimersByTime(700);
  await a.vm.$nextTick();
  expect(JSON.parse(localStorage.getItem("t")!).values).toEqual({ name: "Ana" });
  expect(a.find("[role=status]").text()).toMatch(/^Draft saved at /);
  a.unmount();

  const b = make({ name: "" });
  await b.vm.$nextTick();
  expect(b.find("[role=alert]").text()).toMatch(/^You have a draft from /);
  await b.find(".bless-saved__draft .is-main").trigger("click");
  expect(b.props("modelValue")).toEqual({ name: "Ana" });
  expect(b.find("[role=alert]").exists()).toBe(false);
  await b.find("form").trigger("submit");
  expect(b.emitted("submit")).toEqual([[{ name: "Ana" }]]);
  expect(localStorage.getItem("t")).toBeNull();
});

test("BlessSavedForm: start again drops the draft, and save later stores at once", async () => {
  localStorage.setItem("t", JSON.stringify({ values: { name: "Old" }, at: 0 }));
  const w = make({ name: "" });
  await w.vm.$nextTick();
  await w.findAll(".bless-saved__draft button")[1]!.trigger("click");
  expect(localStorage.getItem("t")).toBeNull();
  await w.setProps({ modelValue: { name: "New" } });
  await w.findAll(".bless-saved__foot button")[1]!.trigger("click");
  expect(JSON.parse(localStorage.getItem("t")!).values).toEqual({ name: "New" });
  expect(w.emitted("later")).toEqual([[{ name: "New" }]]);
});
