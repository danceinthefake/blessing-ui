import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessSpreadsheet, { columnName, parseTsv } from "./BlessSpreadsheet.vue";

const sheet = (rows: string[][], props = {}) => {
  const w = mount(BlessSpreadsheet, {
    attachTo: document.body,
    props: {
      modelValue: rows,
      "onUpdate:modelValue": (v: string[][]) => w.setProps({ modelValue: v }),
      ...props,
    },
  });
  return w;
};
const cell = (w: ReturnType<typeof sheet>, r: number, c: number) =>
  w.find(`[data-cell="${r}:${c}"]`);
const key = (w: ReturnType<typeof sheet>, k: string, o = {}) =>
  w.find("table").trigger("keydown", { key: k, ...o });

test("columnName and parseTsv", () => {
  expect([0, 25, 26, 27, 701, 702].map(columnName)).toEqual(["A", "Z", "AA", "AB", "ZZ", "AAA"]);
  expect(parseTsv("a\tb\r\nc\td\n")).toEqual([
    ["a", "b"],
    ["c", "d"],
  ]);
});

test("BlessSpreadsheet: a grid with column letters and row numbers, numbers to the end", () => {
  const w = sheet([
    ["Episode", "Plays"],
    ["41", "1,240"],
  ]);
  expect(w.find("table").attributes()).toMatchObject({
    role: "grid",
    "aria-rowcount": "3",
    "aria-colcount": "3",
  });
  expect(w.findAll("thead th").map((t) => t.text())).toEqual(["A", "B"]);
  expect(w.findAll("tbody th").map((t) => t.text())).toEqual(["1", "2"]);
  expect(cell(w, 1, 1).classes()).toContain("is-number");
  expect(cell(w, 0, 0).attributes("tabindex")).toBe("0");
  expect(cell(w, 0, 1).attributes("tabindex")).toBe("-1");
  w.unmount();
});

test("BlessSpreadsheet: arrows move, shift extends the selection, and Delete clears it", async () => {
  const w = sheet([
    ["a", "b"],
    ["c", "d"],
  ]);
  await key(w, "ArrowRight");
  expect(cell(w, 0, 1).classes()).toContain("is-active");
  await key(w, "ArrowDown", { shiftKey: true });
  await key(w, "ArrowLeft", { shiftKey: true });
  expect(w.findAll('[aria-selected="true"]')).toHaveLength(4);
  await key(w, "Delete");
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual([
    [
      ["", ""],
      ["", ""],
    ],
  ]);
  w.unmount();
});

test("BlessSpreadsheet: typing starts an edit, Enter saves and moves down, a new row comes at the end", async () => {
  const w = sheet([["a"]]);
  await key(w, "x");
  const input = w.find("input");
  expect((input.element as HTMLInputElement).value).toBe("x");
  await input.setValue("x1");
  await input.trigger("keydown", { key: "Enter" });
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual([[["x1"], []]]);
  await nextTick();
  expect(cell(w, 1, 0).classes()).toContain("is-active");
  await key(w, "Enter");
  await w.find("input").trigger("keydown", { key: "Escape" });
  expect(w.find("input").exists()).toBe(false);
  w.unmount();
});

test("BlessSpreadsheet: copy gives tab text, paste writes a block and adds rows, readonly does not change", async () => {
  const w = sheet([
    ["a", "b", "c"],
    ["d", "e", "f"],
  ]);
  await key(w, "ArrowRight", { shiftKey: true });
  const data = new Map<string, string>();
  const clip = {
    setData: (t: string, v: string) => data.set(t, v),
    getData: (t: string) => data.get(t) ?? "",
  };
  const copy = new Event("copy", { bubbles: true }) as ClipboardEvent;
  Object.defineProperty(copy, "clipboardData", { value: clip });
  cell(w, 0, 0).element.dispatchEvent(copy);
  expect(data.get("text/plain")).toBe("a\tb");

  await key(w, "ArrowDown");
  data.set("text/plain", "1\t2\n3\t4\n5\t6");
  const paste = new Event("paste", { bubbles: true }) as ClipboardEvent;
  Object.defineProperty(paste, "clipboardData", { value: clip });
  cell(w, 1, 1).element.dispatchEvent(paste);
  await nextTick();
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual([
    [
      ["a", "b", "c"],
      ["d", "1", "2"],
      ["", "3", "4"],
      ["", "5", "6"],
    ],
  ]);
  w.unmount();

  const ro = sheet([["a"]], { readonly: true });
  await key(ro, "x");
  await key(ro, "Delete");
  expect(ro.find("input").exists()).toBe(false);
  expect(ro.emitted("update:modelValue")).toBeUndefined();
  ro.unmount();
});
