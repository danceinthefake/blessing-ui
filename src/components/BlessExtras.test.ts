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
