import { mount } from "@vue/test-utils";
import BlessTaskList, { type BlessTask } from "./BlessTaskList.vue";

const sheet = (tasks: BlessTask[], props = {}) => {
  const w = mount(BlessTaskList, {
    props: {
      modelValue: tasks,
      today: "2026-11-16",
      "onUpdate:modelValue": (v: BlessTask[]) => w.setProps({ modelValue: v }),
      ...props,
    },
  });
  return w;
};
const tasks = (w: ReturnType<typeof sheet>) => w.props("modelValue") as BlessTask[];

test("BlessTaskList: done tasks go to the bottom, late dates say so, subtasks count, and the assignee shows", () => {
  const w = sheet([
    { id: "a", title: "Book the guest", done: true },
    {
      id: "b",
      title: "Edit episode 41",
      due: "2026-11-14",
      assignee: { name: "Budi" },
      subtasks: [
        { id: "b1", title: "Cut the intro", done: true },
        { id: "b2", title: "Level the voices" },
      ],
    },
    { id: "c", title: "Write notes", due: "2026-11-20" },
  ]);
  expect(w.findAll(".bless-tasks__task").map((t) => t.find(".bless-tasks__title").text())).toEqual([
    "Edit episode 41",
    "Write notes",
    "Book the guest",
  ]);
  const b = w.findAll(".bless-tasks__task")[0]!;
  expect(b.find(".bless-tasks__due").text()).toBe("due Nov 14 · late");
  expect(b.find(".bless-tasks__count").text()).toBe("1 of 2");
  expect(b.find(".bless-avatar").exists()).toBe(true);
  expect(w.findAll(".bless-tasks__task")[1]!.find(".bless-tasks__due").text()).toBe("due Nov 20");
});

test("BlessTaskList: check a task and a subtask, and add a task with Enter", async () => {
  const w = sheet([{ id: "a", title: "A", subtasks: [{ id: "a1", title: "A1" }] }]);
  const boxes = w.findAll("input[type=checkbox]");
  (boxes[1]!.element as HTMLInputElement).checked = true;
  await boxes[1]!.trigger("change");
  expect(tasks(w)[0]!.subtasks![0]!.done).toBe(true);
  (boxes[0]!.element as HTMLInputElement).checked = true;
  await w.findAll("input[type=checkbox]")[0]!.trigger("change");
  expect(tasks(w)[0]!.done).toBe(true);
  await w.find(".bless-tasks__field").setValue("  Post the clip  ");
  await w.find("form").trigger("submit");
  expect(tasks(w).at(-1)).toMatchObject({ title: "Post the clip", done: false });
  expect((w.find(".bless-tasks__field").element as HTMLInputElement).value).toBe("");
});
