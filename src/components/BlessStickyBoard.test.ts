import { mount } from "@vue/test-utils";
import BlessStickyBoard, { type BlessStickyNote } from "./BlessStickyBoard.vue";

const sheet = (notes: BlessStickyNote[]) => {
  const w = mount(BlessStickyBoard, {
    attachTo: document.body,
    props: {
      modelValue: notes,
      "onUpdate:modelValue": (v: BlessStickyNote[]) => w.setProps({ modelValue: v }),
    },
  });
  return w;
};
const notes = (w: ReturnType<typeof sheet>) => w.props("modelValue") as BlessStickyNote[];

test("BlessStickyBoard: notes at their place, add, type, color, and delete", async () => {
  const w = sheet([{ id: "a", text: "Intro idea", x: 20, y: 30, color: "pink" }]);
  const note = w.find('[data-note="a"]');
  expect(note.attributes("style")).toContain("inset-inline-start: 20px");
  expect(note.classes()).toContain("is-pink");
  expect((note.find("textarea").element as HTMLTextAreaElement).value).toBe("Intro idea");
  await w.find(".bless-sticky__add").trigger("click");
  expect(notes(w)).toHaveLength(2);
  expect(notes(w)[1]!.text).toBe("");
  await note.find("textarea").setValue("Better intro");
  expect(notes(w)[0]!.text).toBe("Better intro");
  await note.find('[aria-label="Change the color"]').trigger("click");
  expect(notes(w)[0]!.color).toBe("blue");
  await note.find('[aria-label="Delete the note"]').trigger("click");
  expect(notes(w).map((n) => n.id)).not.toContain("a");
  w.unmount();
});

test("BlessStickyBoard: the arrow keys move a note, shift moves it more, and it stays on the board", async () => {
  const w = sheet([{ id: "a", text: "", x: 20, y: 30 }]);
  const handle = w.find(".bless-sticky__handle");
  await handle.trigger("keydown", { key: "ArrowRight" });
  expect(notes(w)[0]).toMatchObject({ x: 30, y: 30 });
  await handle.trigger("keydown", { key: "ArrowDown", shiftKey: true });
  expect(notes(w)[0]).toMatchObject({ x: 30, y: 70 });
  await handle.trigger("keydown", { key: "ArrowUp", shiftKey: true });
  await handle.trigger("keydown", { key: "ArrowUp", shiftKey: true });
  expect(notes(w)[0]!.y).toBe(0);
  w.unmount();
});
