import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessGlossary from "./BlessGlossary.vue";

test("BlessGlossary: a focusable term described by its definition, with the headword in the tip", async () => {
  const w = mount(BlessGlossary, {
    props: { definition: "The loudness of a sound over time.", term: "LUFS" },
    slots: { default: "loudness units" },
    attachTo: document.body,
  });
  await nextTick();
  const b = w.find("button.bless-glossary");
  expect(b.text()).toBe("loudness units");
  const tip = document.querySelector('[role="tooltip"]')!;
  expect(b.attributes("aria-describedby")).toBe(tip.id);
  expect(tip.querySelector(".bless-glossary__term")!.textContent).toBe("LUFS");
  expect(tip.textContent).toContain("The loudness of a sound over time.");
  w.unmount();
});

test("BlessGlossary: no headword when the term is the text itself", () => {
  const w = mount(BlessGlossary, { props: { definition: "x" }, slots: { default: "echo" } });
  expect(w.find(".bless-glossary__term").exists()).toBe(false);
});
