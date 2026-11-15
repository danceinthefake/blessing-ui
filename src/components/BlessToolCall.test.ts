import { mount } from "@vue/test-utils";
import BlessToolCall from "./BlessToolCall.vue";

test("BlessToolCall: name, summary and status in a details summary; data shows as JSON", async () => {
  const w = mount(BlessToolCall, {
    props: {
      name: "search_web",
      summary: "podcast tips",
      input: { q: "tips", n: 3 },
      output: "3 results",
    },
  });
  expect(w.element.tagName).toBe("DETAILS");
  expect(w.find("summary").text()).toBe("search_webpodcast tipsRunning");
  expect(w.find(".bless-spinner").exists()).toBe(true);
  expect(w.findAll("pre").map((p) => p.text())).toEqual([
    '{\n  "q": "tips",\n  "n": 3\n}',
    "3 results",
  ]);
  expect(w.findAll(".bless-toolcall__label").map((p) => p.text())).toEqual(["Input", "Output"]);
  await w.setProps({ status: "error", labels: { error: "Gagal" } });
  expect(w.classes()).toContain("bless-toolcall--error");
  expect(w.find(".bless-toolcall__status").text()).toBe("Gagal");
  expect(w.find(".bless-spinner").exists()).toBe(false);
});

test("BlessToolCall: v-model:open follows the toggle, and a missing part is left out", async () => {
  const w = mount(BlessToolCall, { props: { name: "t", status: "done", open: true } });
  expect(w.attributes("open")).toBeDefined();
  expect(w.findAll("section")).toHaveLength(0);
  (w.element as HTMLDetailsElement).open = false;
  await w.trigger("toggle");
  expect(w.emitted("update:open")).toEqual([[false]]);
});
