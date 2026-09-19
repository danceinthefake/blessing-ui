import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import BlessCascadeSelect from "./BlessCascadeSelect.vue";
import BlessDialogHost from "./BlessDialogHost.vue";
import BlessOrgChart from "./BlessOrgChart.vue";
import BlessTreeSelect from "./BlessTreeSelect.vue";
import BlessTreeTable from "./BlessTreeTable.vue";
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
  await m.find(".bless-chip__remove").trigger("click"); // removes "idx"
  expect(m.emitted("update:modelValue")!.at(-1)![0]).toEqual(["readme"]);
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
  expect(w.findAll('[role="treeitem"]')).toHaveLength(3);
  expect(w.findAll(".bless-org__children")).toHaveLength(1);
  await w.findAll(".bless-org__node")[1].trigger("click");
  expect(w.emitted("update:selected")![0]).toEqual(["m"]);
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
