import { mount } from "@vue/test-utils";
import { BlessBadge, BlessDash } from "../index";

test("BlessBadge defaults to NEW! and scaled", () => {
  const w = mount(BlessBadge);
  expect(w.text()).toBe("NEW!");
  expect(w.classes()).toContain("bless-badge--badge");
  expect(w.classes()).toContain("bless-badge--scaled");
});

test("BlessBadge slot + color + unscaled", () => {
  const w = mount(BlessBadge, {
    props: { color: "success", scaled: false },
    slots: { default: "3" },
  });
  expect(w.text()).toBe("3");
  expect(w.classes()).toContain("bless-badge--success");
  expect(w.classes()).not.toContain("bless-badge--scaled");
});

test("BlessDash is decorative", () => {
  const w = mount(BlessDash, { props: { color: "muted" } });
  expect(w.attributes("aria-hidden")).toBe("true");
  expect(w.classes()).toContain("bless-dash--muted");
});
