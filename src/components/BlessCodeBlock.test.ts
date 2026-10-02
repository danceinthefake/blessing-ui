import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessCodeBlock from "./BlessCodeBlock.vue";

let w: VueWrapper<any>;
afterEach(() => {
  w?.unmount();
  vi.useRealTimers();
});
const mk = (props = {}, slots = {}) =>
  (w = mount(BlessCodeBlock, {
    props: { code: "const a = 1;\nconst b = 2;\n\nlog(a + b);\n", ...props },
    slots,
    attachTo: document.body,
  }));
const text = () => w.findAll(".bless-code__line").map((l) => l.text());

test("renders one line per line of code, dropping the final newline", () => {
  mk({ lang: "ts", filename: "sum.ts" });
  expect(text()).toEqual(["const a = 1;", "const b = 2;", "", "log(a + b);"]);
  expect(w.find(".bless-code__lang").text()).toBe("ts");
  expect(w.find(".bless-code__name").text()).toBe("sum.ts");
  expect(w.find(".bless-code__scroll").attributes("aria-label")).toBe("sum.ts");
});

test("line numbers are decoration: not read, not selectable text of the line", () => {
  mk({ lineNumbers: true });
  const no = w.findAll(".bless-code__no");
  expect(no.map((n) => n.text())).toEqual(["1", "2", "3", "4"]);
  expect(no[0].attributes("aria-hidden")).toBe("true");
});

test("lines marks single lines and ranges, from a string or an array", () => {
  mk({ lines: "1,3-4" });
  expect(
    w.findAll(".bless-code__line").map((l) => l.classes().includes("bless-code__line--hl")),
  ).toEqual([true, false, true, true]);
  w.unmount();
  mk({ lines: [2] });
  expect(w.findAll(".bless-code__line--hl")).toHaveLength(1);
});

test("copy writes the code, flips the label, announces, and resets", async () => {
  vi.useFakeTimers();
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  mk();
  await w.find(".bless-code__copy").trigger("click");
  await nextTick();
  expect(writeText).toHaveBeenCalledWith("const a = 1;\nconst b = 2;\n\nlog(a + b);\n");
  expect(w.emitted("copy")![0]).toEqual(["const a = 1;\nconst b = 2;\n\nlog(a + b);\n"]);
  expect(w.find(".bless-code__copy").text()).toBe("Copied");
  expect(w.find(".bless-code__live").text()).toBe("Copied to clipboard");
  await vi.advanceTimersByTimeAsync(2100);
  expect(w.find(".bless-code__copy").text()).toBe("Copy");
  vi.unstubAllGlobals();
});

test("copy:false hides the button; with nothing to show there is no header", () => {
  mk({ copy: false });
  expect(w.find(".bless-code__copy").exists()).toBe(false);
  expect(w.find(".bless-code__head").exists()).toBe(false);
});

const files = [
  { name: "index.ts", code: "export {};", lang: "ts" },
  { name: "style.css", code: "a { color: red }", lang: "css" },
];

test("files become tabs; arrows switch (wrapping) and the panel follows", async () => {
  mk({ files, active: 0, "onUpdate:active": (v: number) => w.setProps({ active: v }) });
  const tabs = () => w.findAll('[role="tab"]');
  expect(tabs().map((t) => t.text())).toEqual(["index.ts", "style.css"]);
  expect(tabs().map((t) => t.attributes("tabindex"))).toEqual(["0", "-1"]);
  expect(text()).toEqual(["export {};"]);
  await tabs()[0].trigger("keydown", { key: "ArrowRight" });
  expect(text()).toEqual(["a { color: red }"]);
  expect(w.find(".bless-code__lang").text()).toBe("css");
  expect(w.find('[role="tabpanel"]').attributes("aria-labelledby")).toBe(
    tabs()[1].attributes("id"),
  );
  await tabs()[1].trigger("keydown", { key: "ArrowRight" });
  expect(tabs()[0].attributes("aria-selected")).toBe("true");
});

test("copy takes the active file; the code slot replaces the plain lines", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  mk(
    { files, active: 1 },
    {
      code: '<template #code="{ code, lang, lines }"><b class="hl">{{ lang }}:{{ lines.length }}:{{ code }}</b></template>',
    },
  );
  expect(w.find(".hl").text()).toBe("css:1:a { color: red }");
  expect(w.find(".bless-code__pre").exists()).toBe(false);
  await w.find(".bless-code__copy").trigger("click");
  expect(writeText).toHaveBeenCalledWith("a { color: red }");
  vi.unstubAllGlobals();
});
