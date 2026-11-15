import { mount } from "@vue/test-utils";
import BlessChapterList from "./BlessChapterList.vue";

const chapters = [
  { start: 0, title: "Intro" },
  { start: 90, title: "The room" },
  { start: 600, title: "The microphone" },
];

test("BlessChapterList: each chapter has its start and length, and the current one is marked with its progress", () => {
  const w = mount(BlessChapterList, { props: { chapters, time: 345, duration: 1200 } });
  const items = w.findAll(".bless-chapters__item");
  expect(items.map((i) => i.find(".bless-chapters__time").text())).toEqual([
    "0:00 · 2 min",
    "1:30 · 9 min",
    "10:00 · 10 min",
  ]);
  expect(items[1]!.attributes("aria-current")).toBe("true");
  expect(items[1]!.find(".bless-chapters__progress").attributes("style")).toContain(
    "inline-size: 50%",
  );
  expect(w.attributes("aria-label")).toBe("Chapters");
});

test("BlessChapterList: a click seeks, the last chapter has no length without a duration, and labels translate", async () => {
  const w = mount(BlessChapterList, {
    props: { chapters, labels: { length: (m: number) => `${m} mnt` } },
  });
  const items = w.findAll(".bless-chapters__item");
  expect(items[2]!.find(".bless-chapters__time").text()).toBe("10:00");
  expect(items[0]!.find(".bless-chapters__time").text()).toBe("0:00 · 2 mnt");
  await items[2]!.trigger("click");
  expect(w.emitted("seek")).toEqual([[600]]);
});
