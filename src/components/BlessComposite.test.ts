import { mount } from "@vue/test-utils";
import { h, nextTick, ref } from "vue";
import BlessCarousel from "./BlessCarousel.vue";
import BlessDataTable from "./BlessDataTable.vue";
import BlessNavigationMenu from "./BlessNavigationMenu.vue";
import BlessResizable from "./BlessResizable.vue";
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
