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

test("BlessAudioPlayer seeks from the keyboard through a native range; the button keeps its name", async () => {
  const w = mount(BlessAudioPlayer, { props: { tracks: [{ src: "a.mp3", title: "A" }] } });
  const audio = w.find("audio").element as HTMLAudioElement;
  Object.defineProperty(audio, "duration", { value: 200, configurable: true });
  await w.find("audio").trigger("durationchange");
  const seek = w.find("input[type=range]");
  expect(seek.attributes("max")).toBe("200");
  expect(seek.attributes("aria-valuetext")).toBe("0:00 of 3:20");
  await seek.setValue("83");
  expect(audio.currentTime).toBe(83);
  expect(w.find(".bless-audio__toggle").attributes("aria-label")).toBe("Play");
});

test("BlessAudioPlayer v-model:time reports the time and seeks when the parent writes it", async () => {
  const w = mount(BlessAudioPlayer, { props: { tracks: [{ src: "a.mp3", title: "A" }] } });
  const audio = w.find("audio").element as HTMLAudioElement;
  audio.currentTime = 12;
  await w.find("audio").trigger("timeupdate");
  expect(w.emitted("update:time")!.at(-1)).toEqual([12]);
  await w.setProps({ time: 95 });
  // jsdom has no metadata yet: the seek waits for it
  await w.find("audio").trigger("loadedmetadata");
  expect(audio.currentTime).toBe(95);
  Object.defineProperty(audio, "readyState", { value: 1, configurable: true });
  await w.setProps({ time: 30 });
  expect(audio.currentTime).toBe(30);
});

test("BlessAudioPlayer loads new tracks at the time the parent sets", async () => {
  const load = vi.spyOn(HTMLMediaElement.prototype, "load");
  const w = mount(BlessAudioPlayer, { props: { tracks: [{ src: "a.mp3", title: "A" }] } });
  await w.setProps({ tracks: [{ src: "b.mp3", title: "B" }], time: 40 });
  expect(load).toHaveBeenCalled();
  await w.find("audio").trigger("loadedmetadata");
  expect((w.find("audio").element as HTMLAudioElement).currentTime).toBe(40);
  load.mockRestore();
});

test("BlessAudioPlayer v-model:playing starts and stops it from outside", async () => {
  const w = mount(BlessAudioPlayer, { props: { tracks: [{ src: "a.mp3", title: "A" }] } });
  const audio = w.find("audio").element as HTMLAudioElement;
  let paused = true;
  Object.defineProperty(audio, "paused", { get: () => paused, configurable: true });
  audio.addEventListener("play", () => (paused = false));
  audio.addEventListener("pause", () => (paused = true));
  await w.setProps({ playing: true });
  expect(w.emitted("play")).toHaveLength(1);
  expect(w.find(".bless-audio__toggle").attributes("aria-pressed")).toBe("true");
  await w.setProps({ playing: false });
  expect(w.emitted("pause")).toHaveLength(1);
});
