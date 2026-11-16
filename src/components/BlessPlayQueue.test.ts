import { mount } from "@vue/test-utils";
import BlessPlayQueue, { type BlessQueueTrack } from "./BlessPlayQueue.vue";

const tracks: BlessQueueTrack[] = [
  { id: "a", title: "Intro", artist: "Studio", seconds: 65 },
  { id: "b", title: "Talk", seconds: 3725 },
];
const sheet = () => {
  const w = mount(BlessPlayQueue, {
    props: {
      current: { id: "z", title: "Now", seconds: 200 },
      modelValue: tracks,
      "onUpdate:modelValue": (v: BlessQueueTrack[]) => w.setProps({ modelValue: v }),
    },
  });
  return w;
};

test("BlessPlayQueue: now playing, the total, clock times, play and remove named with the track, and clear", async () => {
  const w = sheet();
  expect(w.find(".is-now .bless-queue__title").text()).toBe("Now");
  expect(w.find(".bless-queue__total").text()).toBe("2 tracks, 1:03:10");
  const times = w
    .findAll(".bless-queue__time")
    .slice(1)
    .map((t) => t.text());
  expect(times).toEqual(["1:05", "1:02:05"]);
  await w.find('[aria-label="Play Talk"]').trigger("click");
  expect(w.emitted("play")).toEqual([["b"]]);
  await w.find('[aria-label="Remove Intro"]').trigger("click");
  expect((w.props("modelValue") as BlessQueueTrack[]).map((t) => t.id)).toEqual(["b"]);
  await w.find(".bless-queue__clear").trigger("click");
  expect(w.find(".bless-queue__empty").text()).toBe("The queue is empty.");
});
