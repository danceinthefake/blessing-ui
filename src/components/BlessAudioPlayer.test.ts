import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessAudioPlayer from "./BlessAudioPlayer.vue";

beforeAll(() => {
  HTMLMediaElement.prototype.play = function () {
    this.dispatchEvent(new Event("play"));
    return Promise.resolve();
  };
  HTMLMediaElement.prototype.pause = function () {
    this.dispatchEvent(new Event("pause"));
  };
  HTMLMediaElement.prototype.load = () => {};
});

const tracks = [
  { src: "/1.mp3", title: "One", artist: "A" },
  { src: "/2.mp3", title: "Two" },
];

test("toggle play/pause, track list select, ended advances", async () => {
  const w = mount(BlessAudioPlayer, { props: { tracks } });
  expect(w.find("audio").attributes("src")).toBe("/1.mp3");
  expect(w.find(".bless-audio__title").text()).toBe("One");
  expect(w.findAll(".bless-audio__track")).toHaveLength(2);

  await w.find(".bless-audio__toggle").trigger("click");
  expect(w.find(".bless-audio__toggle").attributes("aria-pressed")).toBe("true");
  expect(w.emitted("play")![0][0]).toEqual(tracks[0]);

  await w.findAll(".bless-audio__track")[1].trigger("click");
  expect(w.emitted("update:modelValue")![0]).toEqual([1]);
  await nextTick();
  expect(w.find("audio").attributes("src")).toBe("/2.mp3");

  await w.find("audio").trigger("ended");
  expect(w.emitted("ended")![0][0]).toEqual(tracks[1]);
  expect(w.find(".bless-audio__toggle").attributes("aria-pressed")).toBe("false");
});
