import { mount } from "@vue/test-utils";
import BlessMiniPlayer from "./BlessMiniPlayer.vue";

test("BlessMiniPlayer: a seek slider read in words, play and pause, previous, next, and open", async () => {
  const w = mount(BlessMiniPlayer, {
    props: {
      title: "Episode 41",
      artist: "Home Studio",
      duration: 125,
      position: 65,
      "onUpdate:playing": (v: boolean) => w.setProps({ playing: v }),
      "onUpdate:position": (v: number) => w.setProps({ position: v }),
    },
  });
  const seek = w.find("input[type=range]");
  expect(seek.attributes("aria-valuetext")).toBe("1:05 of 2:05");
  await seek.setValue("90");
  expect(w.props("position")).toBe(90);
  const main = w.find(".is-main");
  expect(main.attributes("aria-label")).toBe("Play");
  await main.trigger("click");
  expect(w.find(".is-main").attributes("aria-label")).toBe("Pause");
  await w.find('[aria-label="Next"]').trigger("click");
  await w.find(".bless-mini__track").trigger("click");
  expect(w.emitted("next")).toHaveLength(1);
  expect(w.emitted("open")).toHaveLength(1);
  expect(w.find(".bless-mini__track").text().replace(/\s+/g, " ")).toBe(
    "Open the full player: Episode 41 Home Studio",
  );
});
