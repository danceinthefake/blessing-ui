import { mount } from "@vue/test-utils";
import BlessBadge from "./BlessBadge.vue";
import BlessDash from "./BlessDash.vue";

test("BlessBadge defaults to NEW!, full size, solid", () => {
  const w = mount(BlessBadge);
  expect(w.text()).toBe("NEW!");
  expect(w.classes()).toContain("bless-badge--badge");
  expect(w.classes()).toContain("bless-badge--solid");
  expect(w.classes()).not.toContain("bless-badge--scaled");
});

test("BlessBadge slot + color + scaled + outline", () => {
  const w = mount(BlessBadge, {
    props: { color: "success", scaled: true },
    slots: { default: "3" },
  });
  expect(w.text()).toBe("3");
  expect(w.classes()).toContain("bless-badge--success");
  expect(w.classes()).toContain("bless-badge--scaled");
  const o = mount(BlessBadge, { props: { variant: "outline" } });
  expect(o.classes()).toContain("bless-badge--outline");
});

test("BlessDash is decorative", () => {
  const w = mount(BlessDash, { props: { color: "muted" } });
  expect(w.attributes("aria-hidden")).toBe("true");
  expect(w.classes()).toContain("bless-dash--muted");
});
