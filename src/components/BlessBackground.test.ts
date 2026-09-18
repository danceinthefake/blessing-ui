import { mount } from "@vue/test-utils";
import { BlessBackground } from "../index";

test("BlessBackground pattern fallback and image with offset", () => {
  const p = mount(BlessBackground);
  expect(p.attributes("aria-hidden")).toBe("true");
  expect(p.classes()).toContain("bless-background--pattern");
  expect(p.classes()).toContain("bless-background--absolute");
  expect(p.attributes("style")).toContain("center 0px");

  const i = mount(BlessBackground, {
    props: { src: "/bg.png", offset: -300, mode: "fixed", opacity: 0.5 },
  });
  expect(i.classes()).not.toContain("bless-background--pattern");
  expect(i.attributes("style")).toContain('url("/bg.png")');
  expect(i.attributes("style")).toContain("center -300px");
  expect(i.attributes("style")).toContain("opacity: 0.5");
});
