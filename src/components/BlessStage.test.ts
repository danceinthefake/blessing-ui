import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { BlessSidebarNav, BlessStage } from "../index";

function mockMedia(matches: boolean) {
  const listeners: Array<() => void> = [];
  window.matchMedia = () =>
    ({
      matches,
      addEventListener: (_: string, fn: () => void) => listeners.push(fn),
      removeEventListener: () => {},
    }) as unknown as MediaQueryList;
}

const items = [
  { label: "Home", href: "/" },
  { label: "News", href: "/news/", meta: "04.04", badge: true },
  { label: "Shop", href: "https://x", external: true, badge: "SALE" },
];

test("BlessSidebarNav marks active, renders meta/badge, emits select", async () => {
  const w = mount(BlessSidebarNav, { props: { items, active: "/news/" } });
  const links = w.findAll("a");
  expect(links[1].attributes("aria-current")).toBe("page");
  expect(links[1].text()).toContain("04.04");
  expect(links[1].find(".bless-badge").text()).toBe("NEW!");
  expect(links[2].attributes("target")).toBe("_blank");
  expect(links[2].find(".bless-badge").text()).toBe("SALE");
  await links[0].trigger("click");
  expect(w.emitted("select")![0][0]).toEqual(items[0]);
});

test("BlessStage desktop: no toggle, sidebar not inert", () => {
  mockMedia(false);
  const w = mount(BlessStage, { slots: { sidebar: "side", default: "body", footer: "foot" } });
  expect(w.find(".bless-stage__toggle").exists()).toBe(false);
  expect(w.find("aside").attributes("aria-hidden")).toBeUndefined();
  expect(w.find("footer").text()).toBe("foot");
});

test("BlessStage mobile: toggle opens drawer, Esc closes", async () => {
  mockMedia(true);
  const w = mount(BlessStage, { slots: { sidebar: "side", default: "body" } });
  await nextTick();
  const aside = w.find("aside");
  expect(aside.attributes("aria-hidden")).toBe("true");
  await w.find(".bless-stage__toggle").trigger("click");
  expect(w.find(".bless-stage__toggle").attributes("aria-expanded")).toBe("true");
  expect(aside.attributes("aria-hidden")).toBeUndefined();
  expect(w.emitted("update:open")![0]).toEqual([true]);
  await w.trigger("keydown", { key: "Escape" });
  expect(aside.attributes("aria-hidden")).toBe("true");
});
