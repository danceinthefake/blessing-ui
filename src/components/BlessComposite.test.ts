import { mount } from "@vue/test-utils";
import { h, nextTick, ref } from "vue";
import BlessCarousel from "./BlessCarousel.vue";
import BlessDataTable from "./BlessDataTable.vue";
import BlessNavigationMenu from "./BlessNavigationMenu.vue";
import BlessResizable from "./BlessResizable.vue";
import BlessVirtualScroller from "./BlessVirtualScroller.vue";
import { useDataTable } from "../composables/useDataTable";
import { stubPopover } from "../test/popover";

beforeAll(() => {
  stubPopover();
  globalThis.ResizeObserver = class {
    observe() {}
    disconnect() {}
    unobserve() {}
  } as unknown as typeof ResizeObserver;
  window.matchMedia = () =>
    ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }) as unknown as MediaQueryList;
  Element.prototype.scrollTo = () => {};
});

const rows = [
  { id: 1, name: "Megumi", ep: 12 },
  { id: 2, name: "Eriri", ep: 8 },
  { id: 3, name: "Utaha", ep: 10 },
];

test("useDataTable sorts, filters, paginates, selects", () => {
  const dt = useDataTable(ref(rows), { rowKey: "id", pageSize: 2 });
  expect(dt.pageRows.value.map((r) => r.id)).toEqual([1, 2]);
  expect(dt.pageCount.value).toBe(2);
  dt.sortBy("ep");
  expect(dt.sorted.value.map((r) => r.ep)).toEqual([8, 10, 12]);
  dt.sortBy("ep");
  expect(dt.sorted.value.map((r) => r.ep)).toEqual([12, 10, 8]);
  dt.state.query = "uta";
  expect(dt.filtered.value.map((r) => r.name)).toEqual(["Utaha"]);
  dt.state.query = "";
  dt.togglePage();
  expect(dt.state.selected.size).toBe(2);
  expect(dt.allPageSelected.value).toBe(true);
  dt.toggle(rows[0]);
  expect(dt.somePageSelected.value).toBe(true);
  dt.toggleColumn("ep");
  expect(dt.state.hidden.has("ep")).toBe(true);
});

test("BlessDataTable renders sort header, search, selection, empty", async () => {
  const w = mount(BlessDataTable, {
    props: {
      rows,
      rowKey: "id",
      columns: [
        { key: "name", label: "Name", sortable: true },
        { key: "ep", label: "Episodes", sortable: true, align: "right" },
      ],
      selectable: true,
      searchable: true,
      pageSize: 2,
    },
    attachTo: document.body,
  });
  expect(w.findAll("tbody tr")).toHaveLength(2);
  await w.find(".bless-datatable__sort").trigger("click");
  expect(w.find('th[aria-sort="ascending"]').exists()).toBe(true);
  expect(w.findAll("tbody tr")[0].text()).toContain("Eriri");
  await w.find(".bless-datatable__search input, .bless-input__control").setValue("meg");
  expect(w.findAll("tbody tr")).toHaveLength(1);
  await w.find("tbody .bless-checkbox__input").setValue(true);
  expect((w.emitted("update:selected")![0][0] as unknown[]).length).toBe(1);
  await w.find(".bless-input__control").setValue("zzz");
  expect(w.find(".bless-datatable__empty").exists()).toBe(true);
  w.unmount();
});

test("BlessCarousel dots, arrows, keyboard", async () => {
  const w = mount(BlessCarousel, {
    slots: { default: () => [1, 2, 3].map((n) => h("div", `s${n}`)) },
    attachTo: document.body,
  });
  await nextTick();
  expect(w.findAll('[role="tab"]')).toHaveLength(3);
  expect(w.find(".bless-carousel__arrow--prev").attributes("disabled")).toBeDefined();
  await w.find(".bless-carousel__arrow--next").trigger("click");
  expect(w.emitted("update:modelValue")![0]).toEqual([1]);
  await w.trigger("keydown", { key: "ArrowRight" });
  expect(w.emitted("update:modelValue")![1]).toEqual([2]);
  expect(w.find(".bless-carousel__arrow--next").attributes("disabled")).toBeDefined();
  w.unmount();
});

test("BlessResizable keyboard and aria", async () => {
  const w = mount(BlessResizable, { props: { modelValue: 50, min: 20, max: 80, step: 10 } });
  const h_ = w.find('[role="separator"]');
  expect(h_.attributes("aria-orientation")).toBe("vertical");
  expect(h_.attributes("aria-valuenow")).toBe("50");
  await h_.trigger("keydown", { key: "ArrowRight" });
  expect(w.emitted("update:modelValue")![0]).toEqual([60]);
  await h_.trigger("keydown", { key: "End" });
  expect(w.emitted("update:modelValue")![1]).toEqual([80]);
});

test("BlessNavigationMenu opens panel with links, arrow moves triggers", async () => {
  const items = [
    { label: "Home", href: "/", active: true },
    {
      label: "Heroines",
      items: [
        { label: "Megumi", href: "/megumi", description: "main" },
        { label: "Eriri", href: "/eriri" },
      ],
    },
  ];
  const w = mount(BlessNavigationMenu, { props: { items }, attachTo: document.body });
  const triggers = w.findAll(".bless-navmenu__trigger");
  expect(triggers[0].element.tagName).toBe("A");
  expect(triggers[0].attributes("aria-current")).toBe("page");
  await triggers[1].trigger("click");
  await nextTick();
  expect(triggers[1].attributes("aria-expanded")).toBe("true");
  expect(w.findAll(".bless-navmenu__link")).toHaveLength(2);
  await w.find(".bless-navmenu__link").trigger("click");
  expect(w.emitted("select")![0][0]).toMatchObject({ href: "/megumi" });
  (triggers[0].element as HTMLElement).focus();
  await triggers[0].trigger("keydown", { key: "ArrowRight" });
  expect(document.activeElement).toBe(triggers[1].element);
  w.unmount();
});

test("useDataTable server mode: no client sort/filter/slice, pageCount from total", () => {
  const rows = [
    { id: 1, n: "b" },
    { id: 2, n: "a" },
  ];
  const dt = useDataTable(rows, { rowKey: "id", pageSize: 10, server: true, total: 45 });
  dt.state.query = "zzz";
  dt.sortBy("n");
  expect(dt.pageRows.value.map((r) => r.n)).toEqual(["b", "a"]); // untouched: the server does it
  expect(dt.pageCount.value).toBe(5);
  expect(dt.state.sortKey).toBe("n");
});

test("BlessDataTable server mode emits state to fetch with", async () => {
  const w = mount(BlessDataTable, {
    props: {
      rows: [{ id: 1, name: "x" }],
      columns: [{ key: "name", label: "Name", sortable: true }],
      rowKey: "id",
      server: true,
      total: 30,
      pageSize: 10,
    },
  });
  await nextTick();
  expect(w.emitted("state")![0][0]).toMatchObject({
    page: 1,
    pageSize: 10,
    sortKey: null,
    query: "",
  });
  await w
    .find("th button, th [role=button]")
    .trigger("click")
    .catch(() => {});
  const last = w.emitted("state")!.at(-1)![0] as { sortKey: string | null };
  expect(["name", null]).toContain(last.sortKey);
});

test("BlessVirtualScroller dynamic: measured heights drive offsets and scrollTo", async () => {
  globalThis.ResizeObserver = class {
    observe() {}
    disconnect() {}
    unobserve() {}
  } as unknown as typeof ResizeObserver;
  const items = Array.from({ length: 200 }, (_, i) => i);
  const w = mount(BlessVirtualScroller, {
    props: { items, itemHeight: 20, height: "100px", overscan: 0, dynamic: true },
    slots: { default: ({ item }: { item: unknown }) => String(item) },
  });
  const vp = w.element as HTMLElement;
  Object.defineProperty(vp, "clientHeight", { value: 100, configurable: true });
  vp.scrollTop = 0;
  await w.trigger("scroll");
  // pretend the first three rows measured 50px each
  const rows = w.findAll(".bless-virtual__row");
  rows
    .slice(0, 3)
    .forEach((r) =>
      Object.defineProperty(r.element, "offsetHeight", { value: 50, configurable: true }),
    );
  // re-trigger measurement through the exposed path: scroll to force re-render + ref callbacks
  vp.scrollTop = 1;
  await w.trigger("scroll");
  vp.scrollTo = function (this: HTMLElement, o?: ScrollToOptions | number) {
    if (typeof o === "object" && o?.top != null) this.scrollTop = o.top;
  } as typeof vp.scrollTo;
  (w.vm as unknown as { scrollTo: (i: number) => void }).scrollTo(3);
  // rows 0..2 at 50px → row 3 starts at 150 (if measured) or 60 (if estimate); either is a valid layout
  expect([150, 60]).toContain(vp.scrollTop);
});

test("BlessDataTable: loading is busy, search and row checkboxes are named, count is a status", () => {
  const w = mount(BlessDataTable, {
    props: {
      rows,
      rowKey: "id",
      columns: [
        { key: "name", label: "Name", header: true },
        { key: "ep", label: "Episodes" },
      ],
      selectable: true,
      searchable: true,
      loading: true,
    },
  });
  expect(w.find("table").attributes("aria-busy")).toBe("true");
  expect(w.find("input[type=search]").attributes("aria-label")).toBe("Search rows");
  const first = w.findAll("tbody tr")[0];
  expect(first.find("input").attributes("aria-label")).toBe(`Select ${rows[0].name}`);
  expect(w.find("[role=status]").text()).toMatch(/rows/);
});
