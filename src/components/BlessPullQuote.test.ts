import { mount } from "@vue/test-utils";
import BlessPullQuote from "./BlessPullQuote.vue";

test("BlessPullQuote: a blockquote with the cite, and the speaker in the caption", () => {
  const w = mount(BlessPullQuote, {
    props: {
      text: "Soft things stop echo.",
      speaker: "Budi",
      role: "Engineer",
      cite: "/ep41",
      align: "center",
    },
  });
  expect(w.classes()).toContain("is-center");
  expect(w.find("blockquote").attributes("cite")).toBe("/ep41");
  expect(w.find("blockquote p").text()).toBe("Soft things stop echo.");
  expect(w.find(".bless-pullquote__speaker").text()).toBe("Budi");
  expect(w.find(".bless-pullquote__role").text()).toBe("Engineer");
  const slot = mount(BlessPullQuote, { slots: { default: "<em>Hi</em>" } });
  expect(slot.find("blockquote em").text()).toBe("Hi");
  expect(slot.find("figcaption").exists()).toBe(false);
});
