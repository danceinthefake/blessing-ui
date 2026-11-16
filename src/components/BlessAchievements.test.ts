import { mount } from "@vue/test-utils";
import BlessAchievements from "./BlessAchievements.vue";

test("BlessAchievements: earned badges with the date, locked ones with a progress bar, and a count", () => {
  const w = mount(BlessAchievements, {
    props: {
      achievements: [
        { id: "a", title: "First take", icon: "🎙", earned: "14 Nov" },
        { id: "b", title: "Ten episodes", icon: "🏆", progress: [4, 10] },
        { id: "c", title: "Night owl", icon: "🦉" },
      ],
    },
  });
  expect(w.find(".bless-achieve__count").text()).toBe("1 of 3 earned");
  const items = w.findAll(".bless-achieve__item");
  expect(items[0]!.classes()).toContain("is-earned");
  expect(items[0]!.find(".bless-achieve__state").text()).toBe("Earned 14 Nov");
  expect(items[0]!.find("progress").exists()).toBe(false);
  const bar = items[1]!.find("progress");
  expect(bar.attributes()).toMatchObject({
    value: "4",
    max: "10",
    "aria-label": "Ten episodes: 4 / 10",
  });
  expect(items[1]!.find(".bless-achieve__state").text()).toBe("Not earned yet");
  expect(items[2]!.find("progress").exists()).toBe(false);
});
