import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import BlessButton from "../components/BlessButton.vue";
import BlessSidebarNav from "../components/BlessSidebarNav.vue";
import { blessLinkKey, isRouterHref } from "./useLink";

// stands in for RouterLink / NuxtLink: renders <a data-to>
const FakeLink = defineComponent({
  props: { to: { type: String, required: true } },
  setup:
    (p, { slots }) =>
    () =>
      h("a", { "data-to": p.to, href: p.to }, slots.default?.()),
});

test("isRouterHref: in-app paths yes; schemes, protocol-relative and hashes no", () => {
  expect(isRouterHref("/news")).toBe(true);
  expect(isRouterHref("news/1")).toBe(true);
  expect(isRouterHref("https://x.test")).toBe(false);
  expect(isRouterHref("mailto:a@b.c")).toBe(false);
  expect(isRouterHref("//cdn.test/a")).toBe(false);
  expect(isRouterHref("#story")).toBe(false);
});

test("with a provided link component, in-app hrefs render it; external and hashes stay <a>", () => {
  const w = mount(BlessSidebarNav, {
    props: {
      items: [
        { label: "News", href: "/news" },
        { label: "Story", href: "#story" },
        { label: "Shop", href: "https://shop.test", external: true },
      ],
    },
    global: { provide: { [blessLinkKey as symbol]: FakeLink } },
  });
  const links = w.findAll("a");
  expect(links[0].attributes("data-to")).toBe("/news");
  expect(links[1].attributes("data-to")).toBeUndefined();
  expect(links[1].attributes("href")).toBe("#story");
  expect(links[2].attributes("target")).toBe("_blank");
  expect(links[2].attributes("data-to")).toBeUndefined();
});

test("without a provider everything is a plain <a>; Button with href follows the same rule", () => {
  const plain = mount(BlessButton, { props: { href: "/go" } });
  expect(plain.element.tagName).toBe("A");
  expect(plain.attributes("data-to")).toBeUndefined();
  const routed = mount(BlessButton, {
    props: { href: "/go" },
    global: { provide: { [blessLinkKey as symbol]: FakeLink } },
  });
  expect(routed.attributes("data-to")).toBe("/go");
});
