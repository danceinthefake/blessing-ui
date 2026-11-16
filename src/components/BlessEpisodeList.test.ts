import { mount } from "@vue/test-utils";
import BlessEpisodeList from "./BlessEpisodeList.vue";

const episodes = [
  { id: "1", number: 1, title: "The room", minutes: 40, progress: 1 },
  { id: "2", number: 2, title: "The mic", minutes: 40, progress: 0.3, summary: "Pick one." },
  { id: "3", number: 3, title: "The edit", minutes: 50 },
];

test("BlessEpisodeList: progress in words, the current one, and play buttons named with the episode", async () => {
  const w = mount(BlessEpisodeList, { props: { episodes, current: "3" } });
  const items = w.findAll(".bless-episodes__item");
  expect(items[0]!.find(".bless-episodes__meta").text().replace(/\s+/g, " ")).toBe(
    "40 min · Watched",
  );
  expect(items[1]!.find(".bless-episodes__meta").text().replace(/\s+/g, " ")).toBe(
    "40 min · 28 min left",
  );
  expect(items[1]!.find(".bless-episodes__bar span").attributes("style")).toContain(
    "inline-size: 30%",
  );
  expect(items[2]!.attributes("aria-current")).toBe("true");
  expect(items[2]!.find(".bless-episodes__meta").text()).toContain("Playing now");
  const play = items[1]!.find(".bless-episodes__thumb");
  expect(play.attributes("aria-label")).toBe("Play episode 2: The mic");
  await play.trigger("click");
  expect(w.emitted("play")).toEqual([["2"]]);
});
