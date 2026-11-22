import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { blessLinkKey } from "../composables/useLink";
import BlessLink from "./BlessLink.vue";

test("BlessLink: a plain link, and an external one that says it opens a new tab", () => {
  const w = mount(BlessLink, { props: { href: "/docs" }, slots: { default: "Docs" } });
  expect(w.element.tagName).toBe("A");
  expect(w.attributes("href")).toBe("/docs");
  expect(w.attributes("target")).toBeUndefined();
  expect(w.find(".bless-link__out").exists()).toBe(false);
  const x = mount(BlessLink, {
    props: { href: "https://vuejs.org", external: true, labels: { newTab: "tab baru" } },
    slots: { default: "Vue" },
  });
  expect(x.attributes("target")).toBe("_blank");
  expect(x.attributes("rel")).toBe("noopener");
  expect(x.find(".bless-link__out").attributes("aria-hidden")).toBe("true");
  expect(x.find(".bless-sr").text()).toBe("(tab baru)");
});

test("BlessLink: an in-app path goes through the provided router link", () => {
  const RouterLink = defineComponent({
    props: { to: String },
    setup:
      (p, { slots }) =>
      () =>
        h("a", { "data-to": p.to }, slots.default?.()),
  });
  const w = mount(BlessLink, {
    props: { href: "/guide" },
    slots: { default: "Guide" },
    global: { provide: { [blessLinkKey as symbol]: RouterLink } },
  });
  expect(w.attributes("data-to")).toBe("/guide");
  expect(w.classes()).toContain("bless-link");
  // negative control: another site stays a plain <a>
  const x = mount(BlessLink, {
    props: { href: "https://vuejs.org", external: true },
    global: { provide: { [blessLinkKey as symbol]: RouterLink } },
  });
  expect(x.attributes("href")).toBe("https://vuejs.org");
});
