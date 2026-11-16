import { mount } from "@vue/test-utils";
import BlessCourseCard from "./BlessCourseCard.vue";

test("BlessCourseCard: title link, facts, and progress in words", async () => {
  const w = mount(BlessCourseCard, {
    props: {
      title: "Vue basics",
      href: "/c/vue",
      teacher: "Rina",
      lessons: 12,
      duration: "4 h",
      level: "Beginner",
      progress: 42.4,
    },
  });
  expect(w.find("h3 a").attributes("href")).toBe("/c/vue");
  expect(w.find(".bless-course__teacher").text()).toBe("by Rina");
  expect(w.findAll(".bless-course__facts li").map((l) => l.text())).toEqual([
    "12 lessons",
    "4 h",
    "Level: Beginner",
  ]);
  expect(w.find(".bless-course__progress").text()).toBe("42% done");
  await w.setProps({ progress: 100 });
  expect(w.find(".bless-course__progress").text()).toBe("✓ Finished");
  await w.setProps({ progress: undefined, href: undefined });
  expect(w.find(".bless-course__progress").exists()).toBe(false);
  expect(w.find("h3").text()).toBe("Vue basics");
});
