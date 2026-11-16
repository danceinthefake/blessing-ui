import { mount } from "@vue/test-utils";
import BlessLessonPath from "./BlessLessonPath.vue";

const lessons = [
  { id: "a", title: "Your room", meta: "5 min", done: true },
  { id: "b", title: "Your microphone", meta: "8 min" },
  { id: "c", title: "Your first take" },
];

test("BlessLessonPath: done, current, and locked lessons with words, and select", async () => {
  const w = mount(BlessLessonPath, { props: { lessons } });
  expect(w.find(".bless-path__progress").text()).toBe("1 of 3 lessons done");
  const items = w.findAll(".bless-path__item");
  expect(
    items.map((i) =>
      i.classes().find((c) => c.startsWith("is-") && c !== "is-right" && c !== "is-left"),
    ),
  ).toEqual(["is-done", "is-current", "is-locked"]);
  expect(items[1]!.find("button").attributes("aria-current")).toBe("step");
  expect(items[1]!.find(".bless-path__meta").text()).toBe("8 min · start here");
  expect(items[2]!.find(".bless-path__meta").text()).toBe("locked");
  expect(items[2]!.find("button").attributes("disabled")).toBeDefined();
  await items[0]!.find("button").trigger("click");
  expect(w.emitted("select")).toEqual([["a"]]);
});
