import { mount } from "@vue/test-utils";
import BlessButton from "./BlessButton.vue";
import BlessSkew from "./BlessSkew.vue";

test("BlessSkew counter-skews slot", () => {
  const w = mount(BlessSkew, { props: { as: "div", color: "accent" }, slots: { default: "hi" } });
  expect(w.element.tagName).toBe("DIV");
  expect(w.classes()).toContain("bless-skew--accent");
  expect(w.find(".bless-skew__inner").text()).toBe("hi");
});

test("BlessButton renders button by default, anchor with href", () => {
  const b = mount(BlessButton, { slots: { default: "go" } });
  expect(b.element.tagName).toBe("BUTTON");
  expect(b.attributes("type")).toBe("button");

  const a = mount(BlessButton, { props: { href: "/x", disabled: true } });
  expect(a.element.tagName).toBe("A");
  expect(a.attributes("disabled")).toBeUndefined();
  expect(a.attributes("aria-disabled")).toBe("true");
  expect(a.attributes("tabindex")).toBe("-1");
});

test("BlessButton loading keeps focus: aria-disabled, busy, click swallowed", async () => {
  const b = mount(BlessButton, { props: { loading: true } });
  expect(b.attributes("disabled")).toBeUndefined();
  expect(b.attributes("aria-disabled")).toBe("true");
  expect(b.attributes("aria-busy")).toBe("true");
  await b.trigger("click");
  expect(b.emitted("click")).toBeUndefined();
});

test("BlessButton: a disabled link doesn't run the click handler; an active one does", async () => {
  const f = vi.fn();
  const off = mount(BlessButton, { props: { href: "#go", disabled: true }, attrs: { onClick: f } });
  await off.trigger("click");
  expect(f).not.toHaveBeenCalled();
  const on = mount(BlessButton, { props: { href: "#go" }, attrs: { onClick: f } });
  await on.trigger("click");
  expect(f).toHaveBeenCalledOnce();
});

test("outline variant has no skew background", () => {
  const b = mount(BlessButton, { props: { variant: "outline", color: "accent" } });
  expect(b.classes()).toContain("bless-skew--none");
  expect(b.classes()).toContain("bless-button--accent");
});

test("BlessButton: disabled link does not navigate; block and icon classes", async () => {
  const w = mount(BlessButton, { props: { href: "#go", disabled: true } });
  const e = new MouseEvent("click", { cancelable: true, bubbles: true });
  w.element.dispatchEvent(e);
  expect(e.defaultPrevented).toBe(true);
  expect(w.attributes("tabindex")).toBe("-1");
  const b = mount(BlessButton, { props: { block: true, icon: true } });
  expect(b.classes()).toContain("bless-button--block");
  expect(b.classes()).toContain("bless-button--icon");
});
