import { mount } from "@vue/test-utils";
import BlessFigure from "./BlessFigure.vue";

test("BlessFigure: an image with its own alt text, a caption, and a linked credit", () => {
  const w = mount(BlessFigure, {
    props: {
      src: "a.jpg",
      alt: "A mic",
      caption: "The studio mic.",
      credit: "Ana",
      creditHref: "/ana",
      width: "wide",
    },
  });
  expect(w.element.tagName).toBe("FIGURE");
  expect(w.classes()).toContain("is-wide");
  expect(w.find("img").attributes("alt")).toBe("A mic");
  expect(w.find("figcaption").text()).toContain("The studio mic.");
  expect(w.find(".bless-figure__credit a").text()).toBe("Photo: Ana");
  expect(
    mount(BlessFigure, { props: { src: "a.jpg", alt: "" } })
      .find("figcaption")
      .exists(),
  ).toBe(false);
});
