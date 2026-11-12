import { mount } from "@vue/test-utils";
import BlessDataTable from "./BlessDataTable.vue";

type Row = { id: number; name: string; city: string; total: number };
const rows: Row[] = [
  { id: 1, name: "Megumi", city: "Tokyo", total: 3 },
  { id: 2, name: "Eriri", city: "Osaka", total: 5 },
];
const heads = (w: ReturnType<typeof mount>) =>
  w.findAll("thead th[data-key]").map((th) => th.attributes("data-key"));

test("BlessDataTable: pinned columns move to their side and stick with summed offsets", () => {
  const w = mount(BlessDataTable<Row>, {
    props: {
      rowKey: "id",
      rows,
      columns: [
        { key: "city", label: "City" },
        { key: "total", label: "Total", pin: "end" },
        { key: "name", label: "Name", pin: "start" },
        { key: "id", label: "ID", pin: "start" },
      ],
      widths: { name: 120, id: 60, total: 80 },
    },
  });
  expect(heads(w)).toEqual(["name", "id", "city", "total"]);
  const [name, id, city, total] = w.findAll("thead th[data-key]");
  expect(name!.classes()).toContain("bless-datatable__pin--start");
  expect(name!.classes()).not.toContain("bless-datatable__pin--edge");
  expect(id!.classes()).toContain("bless-datatable__pin--edge");
  expect(city!.classes()).not.toContain("bless-datatable__pin");
  expect(name!.attributes("style")).toContain("inset-inline-start: 0px");
  expect(id!.attributes("style")).toContain("inset-inline-start: 120px");
  expect(total!.attributes("style")).toContain("inset-inline-end: 0px");
  // body cells stick too
  const cells = w.findAll("tbody tr")[0]!.findAll("td, th");
  expect(cells[1]!.attributes("style")).toContain("inset-inline-start: 120px");
});

test("BlessDataTable: with a start pin, the select column sticks first", () => {
  const w = mount(BlessDataTable<Row>, {
    props: {
      rowKey: "id",
      rows,
      selectable: true,
      columns: [
        { key: "name", label: "Name", pin: "start" },
        { key: "city", label: "City" },
      ],
    },
  });
  expect(w.find("thead th[data-key='__check']").classes()).toContain("bless-datatable__pin--start");
});

test("BlessDataTable: arrow keys on a resize handle change the width, never below 48px", async () => {
  const w = mount(BlessDataTable<Row>, {
    props: {
      rowKey: "id",
      rows,
      resizable: true,
      columns: [
        { key: "name", label: "Name" },
        { key: "city", label: "City", resizable: false },
      ],
      widths: { name: 120, city: 100 },
    },
  });
  const handles = w.findAll('[role="separator"]');
  expect(handles).toHaveLength(1); // city opted out
  expect(handles[0]!.attributes("aria-label")).toBe("Resize Name");
  expect(handles[0]!.attributes("aria-valuenow")).toBe("120");
  await handles[0]!.trigger("keydown", { key: "ArrowRight" });
  expect(w.emitted("update:widths")!.at(-1)).toEqual([{ name: 136, city: 100 }]);
  await w.setProps({ widths: { name: 50, city: 100 } });
  await handles[0]!.trigger("keydown", { key: "ArrowLeft" });
  expect(w.emitted("update:widths")!.at(-1)).toEqual([{ name: 48, city: 100 }]);
});

test("BlessDataTable: once every column has a width, the layout is fixed to their sum", () => {
  const w = mount(BlessDataTable<Row>, {
    props: {
      rowKey: "id",
      rows,
      resizable: true,
      columns: [
        { key: "name", label: "Name" },
        { key: "city", label: "City" },
      ],
      widths: { name: 120, city: 100 },
    },
  });
  const style = w.find("table").attributes("style")!;
  expect(style).toContain("table-layout: fixed");
  expect(style).toContain("width: 220px");
  const partial = mount(BlessDataTable<Row>, {
    props: {
      rowKey: "id",
      rows,
      resizable: true,
      columns: [
        { key: "name", label: "Name" },
        { key: "city", label: "City" },
      ],
      widths: { name: 120 },
    },
  });
  expect(partial.find("table").attributes("style")).toBeUndefined();
});
