import { mount } from "@vue/test-utils";
import BlessIcon from "./BlessIcon.vue";
import BlessText from "./BlessText.vue";

const svg = "<svg viewBox='0 0 10 10'><path d='M0 0h10v10z'/></svg>";

test("BlessIcon decorative by default, labelled becomes img", () => {
  const d = mount(BlessIcon, { slots: { default: svg } });
  expect(d.attributes("aria-hidden")).toBe("true");
  expect(d.attributes("role")).toBeUndefined();
  expect(d.attributes("style")).toContain("var(--bless-text-md)");

  const l = mount(BlessIcon, { props: { label: "play", size: "24px" }, slots: { default: svg } });
  expect(l.attributes("role")).toBe("img");
  expect(l.attributes("aria-label")).toBe("play");
  expect(l.attributes("aria-hidden")).toBeUndefined();
  expect(l.attributes("style")).toContain("24px");
});

test("BlessIcon renders built-in stroke and fill icons by name", () => {
  const stroke = mount(BlessIcon, { props: { name: "close", size: "sm" } });
  const sSvg = stroke.find("svg");
  expect(sSvg.exists()).toBe(true);
  expect(sSvg.attributes("fill")).toBe("none");
  expect(sSvg.attributes("stroke")).toBe("currentColor");
  expect(sSvg.findAll("path")).toHaveLength(2);

  const solid = mount(BlessIcon, { props: { name: "play" } });
  const pSvg = solid.find("svg");
  expect(pSvg.attributes("fill")).toBe("currentColor");
  expect(pSvg.attributes("stroke")).toBe("none");
  expect(pSvg.findAll("path")).toHaveLength(1);
});

test("BlessText maps props to classes", () => {
  const w = mount(BlessText, {
    props: { as: "h2", size: "xl", weight: "thin", muted: true, uppercase: true },
    slots: { default: "hi" },
  });
  expect(w.element.tagName).toBe("H2");
  for (const c of [
    "bless-text--xl",
    "bless-text--w-thin",
    "bless-text--muted",
    "bless-text--upper",
  ])
    expect(w.classes()).toContain(c);
});
