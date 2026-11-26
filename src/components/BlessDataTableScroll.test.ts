import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessDataTable from "./BlessDataTable.vue";

type Row = { id: number; name: string };
const props = { rowKey: "id" as const, rows: [{ id: 1, name: "Megumi" }], columns: [{ key: "name" as const, label: "Name" }] };

function mountWithWidth(scrollWidth: number, caption?: string) {
  const sw = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollWidth");
  const cw = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth");
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", { configurable: true, get: () => scrollWidth });
  Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, get: () => 300 });
  try {
    return mount(BlessDataTable<Row>, { props: { ...props, caption } });
  } finally {
    if (sw) Object.defineProperty(HTMLElement.prototype, "scrollWidth", sw);
    if (cw) Object.defineProperty(HTMLElement.prototype, "clientWidth", cw);
  }
}

test("BlessDataTable: a box that scrolls sideways is a focusable, named region", async () => {
  const w = mountWithWidth(600, "Trade-offs");
  await nextTick();
  const box = w.get(".bless-datatable__scroll");
  expect(box.attributes("tabindex")).toBe("0");
  expect(box.attributes("role")).toBe("region");
  expect(box.attributes("aria-label")).toBe("Trade-offs");
});

test("BlessDataTable: a box that fits takes no focus", async () => {
  const w = mountWithWidth(300);
  await nextTick();
  const box = w.get(".bless-datatable__scroll");
  expect(box.attributes("tabindex")).toBeUndefined();
  expect(box.attributes("role")).toBeUndefined();
});

test("BlessDataTable: the column button and the row count come from labels", () => {
  const w = mount(BlessDataTable<Row>, { props: { ...props, labels: { columns: "Kolom", rows: (n: number) => `${n} baris` } } });
  expect(w.get(".bless-datatable__cols-btn").text()).toContain("Kolom");
  expect(w.get(".bless-datatable__foot").text()).toContain("1 baris");
});
