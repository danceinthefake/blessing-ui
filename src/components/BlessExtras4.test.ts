import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import BlessCascadeSelect from "./BlessCascadeSelect.vue";
import BlessDialogHost from "./BlessDialogHost.vue";
import BlessOrgChart from "./BlessOrgChart.vue";
import BlessTreeSelect from "./BlessTreeSelect.vue";
import BlessTreeTable from "./BlessTreeTable.vue";
import BlessTree from "./BlessTree.vue";
import { useDialog } from "../composables/useDialog";
import { stubPopover } from "../test/popover";

beforeAll(() => {
  stubPopover();
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

const cascade = [
  {
    value: "jp",
    label: "Japan",
    children: [
      { value: "tokyo", label: "Tokyo", children: [{ value: "shinjuku", label: "Shinjuku" }] },
      { value: "osaka", label: "Osaka" },
    ],
  },
  { value: "kr", label: "Korea", disabled: true },
];

test("BlessCascadeSelect: drill by click, keyboard, path text", async () => {
  const w = mount(BlessCascadeSelect, { props: { options: cascade, open: true } });
  await w.find(".bless-cascade__trigger").trigger("click");
  await nextTick();
  expect(w.findAll(".bless-cascade__col")).toHaveLength(1);
  await w.findAll(".bless-cascade__option")[0].trigger("click"); // Japan → opens column 2
  expect(w.findAll(".bless-cascade__col")).toHaveLength(2);
  await w.findAll(".bless-cascade__col")[1].findAll(".bless-cascade__option")[1].trigger("click"); // Osaka
  expect(w.emitted("update:modelValue")![0]).toEqual(["osaka"]);
  expect(
    (w.emitted("select")![0][1] as { label: string }[]).map((o: { label: string }) => o.label),
  ).toEqual(["Japan", "Osaka"]);
  await w.setProps({ modelValue: "shinjuku" });
  expect(w.find(".bless-cascade__text").text()).toBe("Japan › Tokyo › Shinjuku");
  // keyboard: → into children, Enter picks
  const panel = w.find(".bless-cascade__panel");
  await panel.trigger("keydown", { key: "ArrowLeft" });
  await panel.trigger("keydown", { key: "ArrowLeft" });
  await panel.trigger("keydown", { key: "ArrowRight" });
  await panel.trigger("keydown", { key: "ArrowDown" });
  await panel.trigger("keydown", { key: "Enter" });
  expect(w.emitted("update:modelValue")!.at(-1)![0]).toBe("osaka");
});

const nodes = [
  {
    label: "src",
    id: "src",
    open: true,
    children: [
      { label: "index.ts", id: "idx" },
      { label: "lib", id: "lib", children: [{ label: "a.ts", id: "a" }] },
    ],
  },
  { label: "README", id: "readme" },
];

test("BlessTreeSelect: single closes, multiple toggles chips, leafOnly", async () => {
  const w = mount(BlessTreeSelect, { props: { nodes } });
  await w.find(".bless-treeselect__trigger").trigger("click");
  await w.findAll(".bless-tree__row--leaf")[0].trigger("click"); // index.ts
  expect(w.emitted("update:modelValue")![0]).toEqual(["idx"]);
  await w.setProps({ modelValue: "idx" });
  expect(w.find(".bless-treeselect__text").text()).toBe("index.ts");
  const m = mount(BlessTreeSelect, {
    props: { nodes, multiple: true, modelValue: ["idx"], leafOnly: true },
  });
  expect(m.findAll(".bless-chip")).toHaveLength(1);
  await m.find(".bless-treeselect__trigger").trigger("click");
  await m.find(".bless-tree__row").trigger("click"); // "src" summary label — branch, ignored with leafOnly
  expect(m.emitted("update:modelValue")).toBeUndefined();
  await m.findAll(".bless-tree__row--leaf").at(-1)!.trigger("click"); // README
  expect(m.emitted("update:modelValue")![0][0]).toEqual(["idx", "readme"]);
  // chips are plain labels inside the combobox; Backspace removes the last pick
  expect(m.find(".bless-chip__remove").exists()).toBe(false);
  await m.setProps({ modelValue: ["idx", "readme"] });
  await m.find(".bless-treeselect__trigger").trigger("keydown", { key: "Backspace" });
  expect(m.emitted("update:modelValue")!.at(-1)![0]).toEqual(["idx"]);
});

test("BlessTreeSelect: disabled doesn't open on click; ArrowDown opens; a Field names it", async () => {
  const { default: BlessField } = await import("./BlessField.vue");
  const d = mount(BlessTreeSelect, { props: { nodes, disabled: true } });
  await d.find(".bless-treeselect__trigger").trigger("click");
  expect(d.find(".bless-treeselect__trigger").attributes("aria-expanded")).toBe("false");
  expect(d.find(".bless-treeselect__trigger").attributes("tabindex")).toBe("-1");
  const w = mount(BlessTreeSelect, { props: { nodes } });
  await w.find(".bless-treeselect__trigger").trigger("keydown", { key: "ArrowDown" });
  expect(w.find(".bless-treeselect__trigger").attributes("aria-expanded")).toBe("true");
  const f = mount(BlessField, {
    props: { label: "File" },
    slots: { default: () => h(BlessTreeSelect, { nodes }) },
  });
  const t = f.find("[role=combobox]");
  expect(t.attributes("aria-label")).toBeUndefined();
  expect(t.attributes("aria-labelledby")).toBe(f.find("label").attributes("id"));
});

test("BlessTreeTable: flattens by expansion, toggle expands", async () => {
  const rows = [
    { id: 1, name: "src", size: "-", children: [{ id: 2, name: "index.ts", size: "1 KB" }] },
    { id: 3, name: "README", size: "2 KB" },
  ];
  const w = mount(BlessTreeTable, {
    props: {
      rows,
      rowKey: "id",
      columns: [
        { key: "name", label: "Name" },
        { key: "size", label: "Size" },
      ],
    },
  });
  expect(w.findAll("tbody tr")).toHaveLength(2);
  await w.find(".bless-treetable__toggle").trigger("click");
  expect(w.findAll("tbody tr")).toHaveLength(3);
  expect(w.findAll("tbody tr")[1].text()).toContain("index.ts");
  expect(w.findAll("tbody tr")[1].find(".bless-treetable__cell").attributes("style")).toContain(
    "--_d: 1",
  );
  const c = mount(BlessTreeTable, {
    props: { rows, rowKey: "id", columns: [{ key: "name", label: "Name" }], expanded: [1] },
  });
  expect(c.findAll("tbody tr")).toHaveLength(3);
  await c.find(".bless-treetable__toggle").trigger("click");
  expect(c.emitted("update:expanded")![0]).toEqual([[]]);
});

test("BlessOrgChart: nested lists, select", async () => {
  const w = mount(BlessOrgChart, {
    props: {
      nodes: [
        {
          label: "Tomoya",
          id: "t",
          children: [
            { label: "Megumi", id: "m" },
            { label: "Eriri", id: "e" },
          ],
        },
      ],
    },
  });
  // lists of buttons, not a tree it can't navigate like one
  expect(w.find('[role="tree"]').exists()).toBe(false);
  expect(w.findAll(".bless-org__item")).toHaveLength(3);
  expect(w.findAll(".bless-org__children")).toHaveLength(1);
  await w.findAll(".bless-org__node")[1].trigger("click");
  expect(w.emitted("update:selected")![0]).toEqual(["m"]);
  await w.setProps({ selected: "m" });
  expect(w.findAll(".bless-org__node").map((b) => b.attributes("aria-pressed"))).toEqual([
    "false",
    "true",
    "false",
  ]);
  expect(w.emitted("select")![0][0]).toMatchObject({ label: "Megumi" });
});

test("useDialog: open resolves with close(result); host renders", async () => {
  const host = mount(BlessDialogHost, { attachTo: document.body });
  const { open } = useDialog();
  const Body = defineComponent({
    props: { close: { type: Function, required: true }, name: String },
    setup: (p) => () => h("button", { id: "ok", onClick: () => p.close("yes " + p.name) }, "ok"),
  });
  const done = open<string>({ title: "Confirm", component: Body, props: { name: "megumi" } });
  await nextTick();
  expect(document.querySelector(".bless-modal__title")?.textContent).toContain("Confirm");
  (document.querySelector("#ok") as HTMLButtonElement).click();
  await expect(done).resolves.toBe("yes megumi");
  await nextTick();
  expect(document.querySelector(".bless-modal")).toBeNull();
  host.unmount();
});

test("BlessTree: arrow keys walk visible rows, → opens, ← closes / goes to parent", async () => {
  const w = mount(BlessTree, {
    props: {
      nodes: [
        {
          label: "src",
          id: "src",
          open: true,
          children: [
            { label: "a.ts", id: "a" },
            { label: "b.ts", id: "b" },
          ],
        },
        { label: "README", id: "r" },
      ],
    },
    attachTo: document.body,
  });
  const rows = () => w.findAll(".bless-tree__row");
  // jsdom: offsetParent is null everywhere; stub it so rows count as visible
  Object.defineProperty(HTMLElement.prototype, "offsetParent", {
    get: () => document.body,
    configurable: true,
  });
  (rows()[0].element as HTMLElement).focus();
  await rows()[0].trigger("keydown", { key: "ArrowDown" });
  expect(document.activeElement?.textContent?.trim()).toBe("a.ts");
  await rows()[1].trigger("keydown", { key: "ArrowLeft" }); // leaf ← → parent row
  expect(document.activeElement?.textContent?.trim()).toContain("src");
  await rows()[0].trigger("keydown", { key: "ArrowLeft" }); // branch ← closes
  expect((w.element.querySelector("details") as HTMLDetailsElement).open).toBe(false);
  await rows()[0].trigger("keydown", { key: "ArrowRight" }); // branch → opens
  expect((w.element.querySelector("details") as HTMLDetailsElement).open).toBe(true);
  await rows()[0].trigger("keydown", { key: "End" });
  expect(document.activeElement?.textContent?.trim()).toBe("README");
  w.unmount();
});

test("BlessTree is one Tab stop and branches report aria-expanded", async () => {
  const w = mount(BlessTree, {
    attachTo: document.body,
    props: { nodes: [{ label: "src", children: [{ label: "a.ts" }] }, { label: "README" }] },
  });
  const rows = () => w.findAll(".bless-tree__row").map((r) => r.element as HTMLElement);
  expect(rows().map((r) => r.tabIndex)).toEqual([0, -1, -1]);
  rows()[2].dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
  expect(rows().map((r) => r.tabIndex)).toEqual([-1, -1, 0]);
  const branch = w.find("[role=treeitem]");
  expect(branch.attributes("aria-expanded")).toBe("false");
  const d = w.find("details").element as HTMLDetailsElement;
  d.open = true;
  d.dispatchEvent(new Event("toggle"));
  await nextTick();
  expect(branch.attributes("aria-expanded")).toBe("true");
  w.unmount();
});

test("BlessVirtualScroller rows carry the real size and position", async () => {
  const { default: V } = await import("./BlessVirtualScroller.vue");
  const items = Array.from({ length: 10000 }, (_, i) => i);
  const w = mount(V, { props: { items, itemHeight: 20 } });
  const first = w.find("[role=listitem]");
  expect([first.attributes("aria-setsize"), first.attributes("aria-posinset")]).toEqual([
    "10000",
    "1",
  ]);
});
