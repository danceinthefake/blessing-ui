import { mount } from "@vue/test-utils";
import { h } from "vue";
import BlessUptimeBar from "./BlessUptimeBar.vue";
import { provideLabels } from "../composables/useLabels";

const items = [
  { status: "up", label: "Oct 9" },
  { status: "degraded", label: "Oct 10" },
  { status: "down", label: "Oct 11" },
  { status: "up", label: "Oct 12" },
  { status: "none" },
] as const;

test("BlessUptimeBar: one segment per period, named in its tooltip", () => {
  const w = mount(BlessUptimeBar, { props: { items: [...items], locale: "en" } });
  const segs = w.findAll(".bless-uptime__seg");
  expect(segs).toHaveLength(5);
  expect(segs[1]!.classes()).toContain("bless-uptime__seg--degraded");
  expect(segs[2]!.attributes("title")).toBe("Oct 11: Down");
  expect(segs[4]!.attributes("title")).toBe("No data");
});

test("BlessUptimeBar: the summary counts degraded as up and skips periods without data", () => {
  const w = mount(BlessUptimeBar, { props: { items: [...items], locale: "en" } });
  expect(w.attributes("role")).toBe("group");
  expect(w.attributes("aria-label")).toBe("75% uptime over 5 periods");
  const none = mount(BlessUptimeBar, { props: { items: [{ status: "none" }] } });
  expect(none.attributes("aria-label")).toBe("No data");
  const third = mount(BlessUptimeBar, {
    props: { items: [{ status: "up" }, { status: "up" }, { status: "down" }], locale: "en" },
  });
  expect(third.attributes("aria-label")).toBe("66.67% uptime over 3 periods");
});

test("BlessUptimeBar: words come from labels or a label pack", () => {
  const Root = {
    setup() {
      provideLabels({ BlessUptimeBar: { down: "Mati" } });
      return () => h(BlessUptimeBar, { items: [{ status: "down", label: "11 Okt" }] });
    },
  };
  expect(mount(Root).find(".bless-uptime__seg").attributes("title")).toBe("11 Okt: Mati");
  const w = mount(BlessUptimeBar, {
    props: {
      items: [{ status: "up" }],
      labels: { summary: (p: string) => `up ${p}` },
      locale: "en",
    },
  });
  expect(w.attributes("aria-label")).toBe("up 100%");
});

test("BlessUptimeBar: one tab stop on the newest period, arrows and Home/End walk the rest", async () => {
  const w = mount(BlessUptimeBar, { props: { items: [...items] }, attachTo: document.body });
  expect(w.attributes("role")).toBe("group");
  const segs = () => w.findAll(".bless-uptime__seg");
  expect(segs().map((s) => s.attributes("tabindex"))).toEqual(["-1", "-1", "-1", "-1", "0"]);
  expect(segs()[2]!.attributes("role")).toBe("img");
  expect(segs()[2]!.attributes("aria-label")).toBe("Oct 11: Down");
  await w.trigger("keydown", { key: "Home" });
  expect(document.activeElement).toBe(segs()[0]!.element);
  expect(segs()[0]!.attributes("tabindex")).toBe("0");
  expect(w.find(".bless-uptime__tip").text()).toBe("Oct 9: Operational");
  await w.trigger("keydown", { key: "ArrowRight" });
  expect(document.activeElement).toBe(segs()[1]!.element);
  await w.trigger("keydown", { key: "ArrowLeft" });
  await w.trigger("keydown", { key: "ArrowLeft" });
  expect(document.activeElement).toBe(segs()[0]!.element);
  await w.trigger("keydown", { key: "End" });
  expect(document.activeElement).toBe(segs()[4]!.element);
  w.unmount();
});
