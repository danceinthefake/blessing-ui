import { mount } from "@vue/test-utils";
import BlessPromptInput from "./BlessPromptInput.vue";

const file = (name: string) => new File(["x".repeat(2048)], name);

test("BlessPromptInput: Enter sends the trimmed text and empties the box; Shift+Enter and IME do not", async () => {
  const w = mount(BlessPromptInput, {
    props: {
      modelValue: "  hi  ",
      "onUpdate:modelValue": (v: string) => w.setProps({ modelValue: v }),
    },
  });
  const box = w.find("textarea");
  expect(box.attributes("aria-label")).toBe("Message");
  await box.trigger("keydown", { key: "Enter", shiftKey: true });
  await box.trigger("keydown", { key: "Enter", isComposing: true });
  expect(w.emitted("send")).toBeUndefined();
  await box.trigger("keydown", { key: "Enter" });
  expect(w.emitted("send")).toEqual([[{ text: "hi", files: [] }]]);
  expect(w.props("modelValue")).toBe("");
  // nothing to send: the button is off and Enter does nothing
  expect(w.find(".bless-prompt__go").attributes("disabled")).toBeDefined();
  await box.trigger("keydown", { key: "Enter" });
  expect(w.emitted("send")).toHaveLength(1);
});

test("BlessPromptInput: busy turns send into stop; files show as chips and go with the message", async () => {
  const w = mount(BlessPromptInput, {
    props: {
      attach: "image/*",
      busy: true,
      files: [file("a.png")],
      "onUpdate:files": (f: File[]) => w.setProps({ files: f }),
    },
  });
  expect(w.find(".bless-prompt__go").attributes("aria-label")).toBe("Stop");
  await w.find(".bless-prompt__go").trigger("click");
  expect(w.emitted("stop")).toHaveLength(1);
  expect(w.find("input[type=file]").attributes("accept")).toBe("image/*");
  expect(w.find(".bless-prompt__files").text()).toContain("a.png");
  expect(w.find(".bless-prompt__files").text()).toContain("2 KB");
  await w.setProps({ busy: false });
  await w.find(".bless-prompt__go").trigger("click");
  expect(w.emitted("send")![0]![0]).toMatchObject({ text: "", files: [{ name: "a.png" }] });
  expect(w.props("files")).toEqual([]);
});

test("BlessPromptInput: the attach button is off by default, and labels change the words", () => {
  const w = mount(BlessPromptInput, { props: { labels: { send: "Kirim", placeholder: "Tanya" } } });
  expect(w.find("input[type=file]").exists()).toBe(false);
  expect(w.find(".bless-prompt__go").attributes("aria-label")).toBe("Kirim");
  expect(w.find("textarea").attributes("placeholder")).toBe("Tanya");
});
