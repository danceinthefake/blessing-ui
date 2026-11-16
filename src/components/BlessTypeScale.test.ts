import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessTypeScale from "./BlessTypeScale.vue";

test("BlessTypeScale: the library sizes by default, smallest first, each in its own size", () => {
  const w = mount(BlessTypeScale);
  const names = w.findAll(".bless-typescale__name").map((n) => n.text());
  expect(names[0]).toBe("--bless-text-2xs");
  expect(names.at(-1)).toBe("--bless-text-display");
  expect(w.find(".bless-typescale__sample").attributes("style")).toContain(
    "font-size: var(--bless-text-2xs)",
  );
});

test("BlessTypeScale: your own steps with a weight, the sample, and the measured size", async () => {
  const w = mount(BlessTypeScale, {
    attachTo: document.body,
    props: {
      sample: "Episode 41",
      steps: [{ name: "Heading", size: "24px", lineHeight: "30px", weight: 700 }],
      labels: { size: "ukuran" },
    },
  });
  await nextTick();
  const s = w.find(".bless-typescale__sample");
  expect(s.text()).toBe("Episode 41");
  expect(s.attributes("style")).toContain("font-weight: 700");
  expect(w.find(".bless-typescale__px").text()).toBe("ukuran 24px · line 30px");
  w.unmount();
});
