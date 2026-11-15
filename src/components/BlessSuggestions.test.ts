import { mount } from "@vue/test-utils";
import BlessSuggestions from "./BlessSuggestions.vue";

test("BlessSuggestions: a button per item; a click sends the prompt, or the label", async () => {
  const w = mount(BlessSuggestions, {
    props: {
      items: [
        "Short title",
        { label: "Summary", prompt: "Write a summary of the episode", icon: "✍" },
      ],
    },
  });
  expect(w.attributes("aria-label")).toBe("Suggestions");
  const b = w.findAll("button");
  expect(b.map((x) => x.text())).toEqual(["Short title", "✍ Summary"]);
  expect(b[1]!.find("[aria-hidden=true]").text()).toBe("✍");
  await b[0]!.trigger("click");
  await b[1]!.trigger("click");
  expect(w.emitted("select")!.map((e) => e[0])).toEqual([
    "Short title",
    "Write a summary of the episode",
  ]);
});

test("BlessSuggestions: disabled, scroll, and a label pack word", async () => {
  const w = mount(BlessSuggestions, {
    props: { items: ["a"], disabled: true, scroll: true, labels: { label: "Saran" } },
  });
  expect(w.classes()).toContain("bless-suggestions--scroll");
  expect(w.attributes("aria-label")).toBe("Saran");
  expect(w.find("button").attributes("disabled")).toBeDefined();
});
