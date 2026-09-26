import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessColorPicker from "./BlessColorPicker.vue";
import BlessFileInput from "./BlessFileInput.vue";
import BlessIndicator from "./BlessIndicator.vue";
import BlessListbox from "./BlessListbox.vue";
import BlessPasswordMeter from "./BlessPasswordMeter.vue";
import BlessRating from "./BlessRating.vue";
import BlessScrollTop from "./BlessScrollTop.vue";
import BlessStack from "./BlessStack.vue";
import BlessSteps from "./BlessSteps.vue";
import BlessSwap from "./BlessSwap.vue";
import BlessTimeline from "./BlessTimeline.vue";
import BlessTree from "./BlessTree.vue";

test("BlessRating readonly is one named image, not disabled radios", () => {
  const w = mount(BlessRating, { props: { modelValue: 4, readonly: true, label: "Score" } });
  expect(w.attributes("role")).toBe("img");
  expect(w.attributes("aria-label")).toBe("Score: 4 of 5");
  expect(w.find("input").exists()).toBe(false);
  expect(w.findAll(".bless-rating__star--on")).toHaveLength(4);
});

test("BlessRating: radios, click sets, click again clears", async () => {
  const w = mount(BlessRating, { props: { modelValue: 2 } });
  const inputs = w.findAll("input");
  expect(inputs).toHaveLength(5);
  expect((inputs[1].element as HTMLInputElement).checked).toBe(true);
  await inputs[3].trigger("change");
  expect(w.emitted("update:modelValue")!.at(-1)![0]).toBe(4);
  await w.setProps({ modelValue: 4 });
  await inputs[3].trigger("click");
  expect(w.emitted("update:modelValue")!.at(-1)![0]).toBe(0);
});

test("BlessFileInput: change and drop add files, remove works", async () => {
  const w = mount(BlessFileInput, { props: { multiple: true } });
  const f = new File(["x"], "a.txt");
  const input = w.find("input").element as HTMLInputElement;
  Object.defineProperty(input, "files", { value: [f], configurable: true });
  await w.find("input").trigger("change");
  expect(w.emitted("update:modelValue")![0][0]).toEqual([f]);
  await w.setProps({ modelValue: [f] });
  expect(w.find(".bless-file__name").text()).toBe("a.txt");
  await w.find(".bless-file__remove").trigger("click");
  expect(w.emitted("update:modelValue")!.at(-1)![0]).toEqual([]);
});

test("BlessFileInput: accept filters dropped files by mime, wildcard and extension", async () => {
  const w = mount(BlessFileInput, { props: { multiple: true, accept: "image/*,.pdf,text/csv" } });
  const files = [
    new File([""], "a.png", { type: "image/png" }),
    new File([""], "b.pdf", { type: "application/pdf" }),
    new File([""], "c.csv", { type: "text/csv" }),
    new File([""], "d.exe", { type: "application/octet-stream" }),
  ];
  await w.find(".bless-file__zone").trigger("drop", { dataTransfer: { files } });
  expect((w.emitted("update:modelValue")![0][0] as File[]).map((f) => f.name)).toEqual([
    "a.png",
    "b.pdf",
    "c.csv",
  ]);
});

test("BlessColorPicker: swatch click sets model and aria-pressed", async () => {
  const w = mount(BlessColorPicker, {
    props: { modelValue: "#e85078", swatches: ["#e85078", "#a759ff"] },
  });
  const sw = w.findAll(".bless-color__swatch");
  expect(sw[0].attributes("aria-pressed")).toBe("true");
  await sw[1].trigger("click");
  expect(w.emitted("update:modelValue")![0][0]).toBe("#a759ff");
});

test("BlessPasswordMeter scores rules", async () => {
  const w = mount(BlessPasswordMeter, { props: { value: "abc", showRules: true } });
  expect(w.attributes("data-score")).toBe("0");
  await w.setProps({ value: "Abcdefg1!" });
  expect(w.attributes("data-score")).toBe("4");
  expect(w.find(".bless-pwmeter__label").text()).toBe("Strong");
  expect(w.findAll(".bless-pwmeter__rule--ok")).toHaveLength(4);
});

test("BlessSteps: aria-current, done steps clickable", async () => {
  const w = mount(BlessSteps, {
    props: {
      steps: [{ label: "A" }, { label: "B" }, { label: "C" }],
      modelValue: 2,
      clickable: true,
    },
  });
  expect(w.findAll("[aria-current=step]")).toHaveLength(1);
  expect(w.findAll("button.bless-steps__marker")).toHaveLength(2);
  await w.find("button.bless-steps__marker").trigger("click");
  expect(w.emitted("select")![0]).toEqual([0]);
  expect(w.emitted("update:modelValue")![0]).toEqual([0]);
});

test("BlessTimeline renders items with colour class", () => {
  const w = mount(BlessTimeline, {
    props: { items: [{ title: "T", time: "2019", color: "accent" }, { title: "U" }] },
  });
  expect(w.findAll("li")).toHaveLength(2);
  expect(w.find("li").classes()).toContain("bless-timeline__item--accent");
  expect(w.find("time").text()).toBe("2019");
});

test("BlessIndicator: count, max, dot, hidden", async () => {
  const w = mount(BlessIndicator, { props: { value: 120 }, slots: { default: "x" } });
  expect(w.find(".bless-indicator__badge").text()).toBe("99+");
  await w.setProps({ value: true });
  expect(w.find(".bless-indicator__badge").classes()).toContain("bless-indicator__badge--dot");
  await w.setProps({ value: 0 });
  expect(w.find(".bless-indicator__badge").exists()).toBe(false);
});

test("BlessIndicator: the label is read in full from a status region that stays", async () => {
  const w = mount(BlessIndicator, { props: { value: 0, label: "0 unread" } });
  expect(w.find('[role="status"]').text()).toBe("");
  await w.setProps({ value: 4, label: "4 unread" });
  expect(w.find('[role="status"]').text()).toBe("4 unread");
  expect(w.find(".bless-indicator__badge").attributes("aria-hidden")).toBe("true");
});

test("BlessStack maps gap and alignment", () => {
  const w = mount(BlessStack, {
    props: { direction: "row", gap: 4, align: "center", justify: "between" },
  });
  const s = w.attributes("style")!;
  expect(s).toContain("--bless-space-4");
  expect(s).toContain("center");
  expect(s).toContain("space-between");
});

test("BlessScrollTop shows after threshold and scrolls", async () => {
  const w = mount(BlessScrollTop, { props: { threshold: 100 } });
  expect(w.find("button").exists()).toBe(false);
  Object.defineProperty(window, "scrollY", { value: 500, configurable: true });
  window.dispatchEvent(new Event("scroll"));
  await nextTick();
  expect(w.find("button").exists()).toBe(true);
  window.scrollTo = vi.fn();
  await w.find("button").trigger("click");
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  expect(document.activeElement).toBe(document.body); // focus went up with the page, not lost
  expect(document.body.getAttribute("tabindex")).toBe("-1");
});

test("BlessListbox: keyboard moves, Enter picks, multiple toggles", async () => {
  const opts = [
    { value: "a", label: "A" },
    { value: "b", label: "B", disabled: true },
    { value: "c", label: "C" },
  ];
  const w = mount(BlessListbox, { props: { options: opts } });
  await w.trigger("keydown", { key: "ArrowDown" });
  await w.trigger("keydown", { key: "Enter" });
  expect(w.emitted("update:modelValue")![0][0]).toBe("c"); // skipped disabled B
  const m = mount(BlessListbox, { props: { options: opts, multiple: true, modelValue: ["a"] } });
  expect(m.attributes("aria-multiselectable")).toBe("true");
  await m.findAll('[role="option"]')[2].trigger("click");
  expect(m.emitted("update:modelValue")![0][0]).toEqual(["a", "c"]);
  await m.setProps({ modelValue: ["a", "c"] });
  await m.findAll('[role="option"]')[0].trigger("click");
  expect(m.emitted("update:modelValue")!.at(-1)![0]).toEqual(["c"]);
});

test("BlessTree: nested details, select emits path and sets v-model:selected", async () => {
  const w = mount(BlessTree, {
    props: {
      nodes: [
        { label: "src", open: true, children: [{ label: "index.ts", id: "idx" }] },
        { label: "README" },
      ],
    },
  });
  expect(w.findAll("details")).toHaveLength(1);
  expect(w.findAll('[role="treeitem"]')).toHaveLength(3);
  await w.findAll(".bless-tree__row--leaf")[0].trigger("click");
  expect(w.emitted("select")![0][0]).toMatchObject({ label: "index.ts" });
  expect(w.emitted("update:selected")![0]).toEqual(["idx"]);
});

test("BlessSwap toggles via checkbox", async () => {
  const w = mount(BlessSwap, { props: { label: "Theme" }, slots: { on: "☾", off: "☀" } });
  expect(w.classes()).not.toContain("bless-swap--on");
  await w.find("input").setValue(true);
  expect(w.emitted("update:modelValue")![0]).toEqual([true]);
});

test("BlessListbox: starts on the selected option, named by a Field, submits values", async () => {
  const { default: BlessField } = await import("./BlessField.vue");
  const { h } = await import("vue");
  const options = [
    { label: "A", value: "a", disabled: true },
    { label: "B", value: "b" },
    { label: "C", value: "c" },
  ];
  const w = mount(BlessListbox, { props: { options, modelValue: "c", name: "pick" } });
  expect(w.attributes("aria-activedescendant")).toMatch(/-2$/);
  expect(w.find("input[type=hidden]").attributes()).toMatchObject({ name: "pick", value: "c" });
  const none = mount(BlessListbox, { props: { options } });
  expect(none.attributes("aria-activedescendant")).toMatch(/-1$/); // skips the disabled first row
  const f = mount(BlessField, {
    props: { label: "Letter" },
    slots: { default: () => h(BlessListbox, { options }) },
  });
  const lb = f.find("[role=listbox]");
  expect(lb.attributes("aria-labelledby")).toBe(f.find("label").attributes("id"));
});

test("BlessPasswordMeter: symbols are not letters of any script; rules speak their state", () => {
  const score = (value: string) =>
    Number(mount(BlessPasswordMeter, { props: { value } }).attributes("data-score"));
  expect(score("パスワード")).toBe(0);
  expect(score("pass_word")).toBe(2); // 8+ characters, and _ is a symbol
  const w = mount(BlessPasswordMeter, { props: { value: "abc", showRules: true } });
  expect(w.findAll(".bless-pwmeter__state").map((s) => s.text())).toEqual([
    "not met",
    "not met",
    "not met",
    "not met",
  ]);
});

test("BlessPasswordInput: new-password with a meter, override wins, constant toggle name", async () => {
  const { default: BlessPasswordInput } = await import("./BlessPasswordInput.vue");
  expect(mount(BlessPasswordInput).find("input").attributes("autocomplete")).toBe(
    "current-password",
  );
  expect(
    mount(BlessPasswordInput, { props: { meter: true } })
      .find("input")
      .attributes("autocomplete"),
  ).toBe("new-password");
  const o = mount(BlessPasswordInput, { attrs: { autocomplete: "off" } });
  expect(o.find("input").attributes("autocomplete")).toBe("off");
  const t = o.find(".bless-password__toggle");
  await t.trigger("click");
  expect([t.attributes("aria-label"), t.attributes("aria-pressed")]).toEqual([
    "Show password",
    "true",
  ]);
});

test("BlessPaletteToggle: showDefault includes or leaves out the default swatch", async () => {
  const { default: P } = await import("./BlessPaletteToggle.vue");
  const all = mount(P).findAll("button").length;
  expect(mount(P, { props: { showDefault: false } }).findAll("button")).toHaveLength(all - 1);
});

test("BlessFileInput: removing a file hands focus to the next ×, then to the input", async () => {
  const a = new File(["a"], "a.png", { type: "image/png" });
  const b = new File(["b"], "b.png", { type: "image/png" });
  const w = mount(BlessFileInput, {
    props: { multiple: true, modelValue: [a, b] },
    attachTo: document.body,
  });
  const first = w.findAll(".bless-file__remove")[0];
  (first.element as HTMLElement).focus();
  await first.trigger("click");
  await w.setProps({ modelValue: [b] });
  await new Promise((r) => setTimeout(r));
  expect(document.activeElement?.getAttribute("aria-label")).toBe("Remove b.png");
  await w.find(".bless-file__remove").trigger("click");
  await w.setProps({ modelValue: [] });
  await new Promise((r) => setTimeout(r));
  expect(document.activeElement).toBe(w.find("input").element);
  w.unmount();
});
