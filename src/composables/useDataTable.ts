import { computed, reactive, type Ref, unref } from "vue";

export interface DataTableState {
  sortKey: string | null;
  sortDir: "asc" | "desc";
  page: number;
  pageSize: number;
  query: string;
  selected: Set<string | number>;
  hidden: Set<string>;
}

/**
 * Headless sort / filter / paginate / select.
 * Client mode (default): works over the in-memory row array.
 * Server mode (`server: true`): the rows you pass are *already* the current page; sort, query and
 * page live in `state` for you to send to the API, and `total` (a ref / number) drives the page count.
 */
export function useDataTable<T extends Record<string, unknown>>(
  rows: Ref<T[]> | T[],
  opts: {
    rowKey: keyof T & string;
    pageSize?: number;
    searchKeys?: (keyof T & string)[];
    server?: boolean;
    /** server mode: total row count across all pages */
    total?: Ref<number> | number;
  },
) {
  const state = reactive<DataTableState>({
    sortKey: null,
    sortDir: "asc",
    page: 1,
    pageSize: opts.pageSize ?? 10,
    query: "",
    selected: new Set(),
    hidden: new Set(),
  });

  const filtered = computed(() => {
    const all = unref(rows);
    if (opts.server) return all;
    const q = state.query.trim().toLowerCase();
    if (!q) return all;
    const keys = opts.searchKeys ?? (Object.keys(all[0] ?? {}) as (keyof T & string)[]);
    return all.filter((r) =>
      keys.some((k) =>
        String(r[k] ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  });
  const sorted = computed(() => {
    if (opts.server || !state.sortKey) return filtered.value;
    const k = state.sortKey as keyof T;
    const dir = state.sortDir === "asc" ? 1 : -1;
    return [...filtered.value].sort((a, b) => {
      const x = a[k],
        y = b[k];
      if (x == null) return 1;
      if (y == null) return -1;
      return (
        (typeof x === "number" && typeof y === "number"
          ? x - y
          : String(x).localeCompare(String(y), undefined, { numeric: true })) * dir
      );
    });
  });
  const pageCount = computed(() =>
    Math.max(
      1,
      Math.ceil(
        (opts.server ? (unref(opts.total) ?? sorted.value.length) : sorted.value.length) /
          state.pageSize,
      ),
    ),
  );
  const pageRows = computed(() => {
    if (opts.server) return sorted.value;
    const p = Math.min(state.page, pageCount.value);
    return sorted.value.slice((p - 1) * state.pageSize, p * state.pageSize);
  });
  const keyOf = (r: T) => r[opts.rowKey] as string | number;

  function sortBy(key: string) {
    if (state.sortKey === key) state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
    else {
      state.sortKey = key;
      state.sortDir = "asc";
    }
  }
  function toggle(r: T) {
    const k = keyOf(r);
    state.selected.has(k) ? state.selected.delete(k) : state.selected.add(k);
  }
  const allPageSelected = computed(
    () => pageRows.value.length > 0 && pageRows.value.every((r) => state.selected.has(keyOf(r))),
  );
  const somePageSelected = computed(() => pageRows.value.some((r) => state.selected.has(keyOf(r))));
  function togglePage() {
    const on = !allPageSelected.value;
    for (const r of pageRows.value)
      on ? state.selected.add(keyOf(r)) : state.selected.delete(keyOf(r));
  }
  const selectedRows = computed(() => unref(rows).filter((r) => state.selected.has(keyOf(r))));
  const toggleColumn = (key: string) =>
    state.hidden.has(key) ? state.hidden.delete(key) : state.hidden.add(key);

  return {
    state,
    filtered,
    sorted,
    pageRows,
    pageCount,
    keyOf,
    sortBy,
    toggle,
    togglePage,
    allPageSelected,
    somePageSelected,
    selectedRows,
    toggleColumn,
  };
}
