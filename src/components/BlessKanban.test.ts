import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessKanban from "./BlessKanban.vue";

const board = () => [
  { id: "todo", title: "To do", items: ["a", "b"] },
  { id: "doing", title: "Doing", items: ["c"], limit: 1 },
  { id: "done", title: "Done", items: [] as string[] },
];
const mk = () =>
  mount(BlessKanban, {
    props: {
      modelValue: board(),
      "onUpdate:modelValue": (v: unknown[]) =>
        w.setProps({ modelValue: v as ReturnType<typeof board> }),
    },
    attachTo: document.body,
  });
let w: VueWrapper;
const cols = () =>
  w.findAll("[data-kanban-col]").map((c) => c.findAll(".bless-kanban__body").map((b) => b.text()));
const grip = (c: number, i: number) => w.find(`[data-grip="${c}:${i}"]`);

beforeAll(() => {
  Element.prototype.setPointerCapture = () => {};
});
afterEach(() => w?.unmount());

test("keyboard: grab, move down, across columns, drop", async () => {
  w = mk();
  await grip(0, 0).trigger("keydown", { key: " " });
  await grip(0, 0).trigger("keydown", { key: "ArrowDown" });
  expect(cols()[0]).toEqual(["b", "a"]);
  await grip(0, 1).trigger("keydown", { key: "ArrowRight" }); // Doing is full (limit 1)
  expect(cols()[1]).toEqual(["c"]);
  expect(w.find(".bless-kanban__live").text()).toBe("Doing is full");
  await grip(0, 1).trigger("keydown", { key: "ArrowUp" });
  await grip(0, 0).trigger("keydown", { key: "ArrowLeft" }); // no column to the left
  expect(cols()[0]).toEqual(["a", "b"]);
});

test("keyboard: moving into the next column keeps the index, Escape restores", async () => {
  w = mk();
  await grip(1, 0).trigger("keydown", { key: "Enter" });
  await grip(1, 0).trigger("keydown", { key: "ArrowRight" });
  await nextTick();
  expect(cols()).toEqual([["a", "b"], [], ["c"]]);
  await grip(2, 0).trigger("keydown", { key: "Escape" });
  expect(cols()).toEqual([["a", "b"], ["c"], []]);
});

test("arrows do nothing until a card is grabbed", async () => {
  w = mk();
  await grip(0, 0).trigger("keydown", { key: "ArrowRight" });
  expect(cols()).toEqual([["a", "b"], ["c"], []]);
});

/** jsdom has no layout: columns at x 0 / 100 / 200, cards 40px tall */
function layout() {
  document.elementsFromPoint = (x: number) => {
    const col = w.findAll("[data-kanban-col]")[Math.floor(x / 100)];
    return col ? [col.element] : [];
  };
  w.findAll("[data-kanban-col]").forEach((col) =>
    col.findAll("[data-kanban-card]").forEach((card, i) => {
      card.element.getBoundingClientRect = () =>
        ({ top: i * 40, height: 30, left: 0, width: 90 }) as DOMRect;
    }),
  );
}
const ptr = async (el: Element, type: string, x = 0, y = 0) => {
  el.dispatchEvent(new MouseEvent(type, { clientX: x, clientY: y, bubbles: true }));
  await nextTick();
};

test("pointer: drag a card to another column, between cards, emits move", async () => {
  w = mk();
  layout();
  const g = grip(0, 0).element;
  await ptr(g, "pointerdown");
  await ptr(g, "pointermove", 250, 5); // Done column, above nothing
  expect(w.findAll(".bless-kanban__list")[2].classes()).toContain("bless-kanban__list--end");
  await ptr(g, "pointerup");
  expect(cols()).toEqual([["b"], ["c"], ["a"]]);
  expect(w.emitted("move")![0]).toEqual([
    "a",
    { column: "todo", index: 0 },
    { column: "done", index: 0 },
  ]);
});

test("pointer: a full column refuses the drop; same column reorders", async () => {
  w = mk();
  layout();
  const g = grip(0, 0).element;
  await ptr(g, "pointerdown");
  await ptr(g, "pointermove", 150, 5); // Doing, limit 1, already holds c
  await ptr(g, "pointerup");
  expect(cols()).toEqual([["a", "b"], ["c"], []]);
  await ptr(g, "pointerdown");
  await ptr(g, "pointermove", 50, 90); // below both cards of To do
  await ptr(g, "pointerup");
  expect(cols()[0]).toEqual(["b", "a"]);
});
