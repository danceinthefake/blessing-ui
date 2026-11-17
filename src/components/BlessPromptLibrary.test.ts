import { mount } from "@vue/test-utils";
import BlessPromptLibrary, { fillPrompt, promptFields } from "./BlessPromptLibrary.vue";

test("promptFields and fillPrompt: names once each, filled, and empty kept", () => {
  const t = "Write to {{ name }} about {{topic}}. Sign as {{name}}.";
  expect(promptFields(t)).toEqual(["name", "topic"]);
  expect(fillPrompt(t, { name: "Ana", topic: " " })).toBe(
    "Write to Ana about {{topic}}. Sign as Ana.",
  );
});

const prompts = [
  { id: "a", title: "Reply to a customer", text: "Reply to {{name}} kindly.", tags: ["email"] },
  { id: "b", title: "Summarize", text: "Summarize this in 3 lines.", tags: ["writing"] },
];

test("BlessPromptLibrary: search, tags, fields, preview, and use", async () => {
  const w = mount(BlessPromptLibrary, { props: { prompts } });
  await w.find('input[type="search"]').setValue("summ");
  expect(w.findAll(".bless-prompts__title").map((t) => t.text())).toEqual(["Summarize"]);
  await w.find('input[type="search"]').setValue("");
  await w.findAll(".bless-prompts__tags button")[1]!.trigger("click");
  expect(w.findAll(".bless-prompts__title").map((t) => t.text())).toEqual(["Reply to a customer"]);
  await w.find(".bless-prompts__list button").trigger("click");
  expect(w.find(".bless-prompts__field label").text()).toBe("name");
  await w.find(".bless-prompts__field input").setValue("Budi");
  expect(w.find(".bless-prompts__preview").text()).toBe("Reply to Budi kindly.");
  await w.find(".bless-prompts__use").trigger("click");
  expect(w.emitted("use")![0]).toEqual(["Reply to Budi kindly.", prompts[0]]);
  await w.find('input[type="search"]').setValue("zzz");
  expect(w.find("[role=status]").text()).toBe("No prompts match.");
});
