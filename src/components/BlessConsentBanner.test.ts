import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessConsentBanner from "./BlessConsentBanner.vue";

const categories = [
  { key: "needed", label: "Needed", required: true },
  { key: "stats", label: "Statistics", description: "Counts visits." },
  { key: "ads", label: "Ads" },
];
const btn = (w: ReturnType<typeof mount>, t: string) =>
  w.findAll("button").find((b) => b.text() === t)!;

beforeEach(() => localStorage.clear());

test("BlessConsentBanner: accept and reject keep the needed category on, and the banner goes away", async () => {
  const w = mount(BlessConsentBanner, {
    props: {
      categories,
      persist: "consent",
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v as never }),
    },
  });
  await nextTick();
  expect(w.find(".bless-consent").exists()).toBe(true);
  await btn(w, "Only the needed ones").trigger("click");
  expect(w.emitted("change")).toEqual([[{ needed: true, stats: false, ads: false }]]);
  expect(JSON.parse(localStorage.getItem("consent")!)).toEqual({
    needed: true,
    stats: false,
    ads: false,
  });
  expect(w.find(".bless-consent").exists()).toBe(false);
});

test("BlessConsentBanner: choose opens switches, the needed one is locked, and save keeps the choice", async () => {
  const w = mount(BlessConsentBanner, { props: { categories, position: "static" } });
  await btn(w, "Choose").trigger("click");
  const switches = w.findAllComponents({ name: "BlessSwitch" });
  expect(switches).toHaveLength(3);
  expect(switches[0]!.props("disabled")).toBe(true);
  expect(w.find(".bless-consent__desc").text()).toBe("Counts visits.");
  switches[1]!.vm.$emit("update:modelValue", true);
  await nextTick();
  await btn(w, "Save my choice").trigger("click");
  expect(w.emitted("change")).toEqual([[{ needed: true, stats: true, ads: false }]]);
});

test("BlessConsentBanner: a stored choice hides the banner after mount, and labels translate", async () => {
  localStorage.setItem("c2", JSON.stringify({ needed: true, stats: true, ads: true }));
  const w = mount(BlessConsentBanner, { props: { categories, persist: "c2" } });
  await nextTick();
  expect(w.find(".bless-consent").exists()).toBe(false);
  expect(w.emitted("update:modelValue")).toEqual([[{ needed: true, stats: true, ads: true }]]);
  const t = mount(BlessConsentBanner, {
    props: { categories, labels: { accept: "Terima semua" } },
  });
  await nextTick();
  expect(t.findAll("button").at(-1)!.text()).toBe("Terima semua");
});
