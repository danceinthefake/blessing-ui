import { mount } from "@vue/test-utils";
import BlessCallScreen from "./BlessCallScreen.vue";

const people = [
  { id: "a", name: "Ana", speaking: true },
  { id: "b", name: "Budi", muted: true, cameraOff: true },
  { id: "c", name: "Citra" },
];

test("BlessCallScreen: tiles with video from the slot or the avatar, muted and speaking in words", () => {
  const w = mount(BlessCallScreen, {
    props: { people, elapsed: "12:04" },
    slots: { video: `<template #video="{ person }"><video :data-id="person.id" /></template>` },
  });
  const tiles = w.findAll(".bless-call__tile");
  expect(w.find(".bless-call__grid").attributes("style")).toContain("--_cols: 2");
  expect(tiles[0]!.find("video").attributes("data-id")).toBe("a");
  expect(tiles[0]!.classes()).toContain("is-speaking");
  expect(tiles[0]!.find(".bless-call__name").text()).toBe("Ana, speaking");
  expect(tiles[1]!.find("video").exists()).toBe(false);
  expect(tiles[1]!.find(".bless-avatar").exists()).toBe(true);
  expect(tiles[1]!.find(".bless-call__name").text()).toContain("Budi, muted");
  expect(w.find(".bless-call__time").text()).toBe("12:04");
});

test("BlessCallScreen: the controls are toggles, and leave emits", async () => {
  const w = mount(BlessCallScreen, {
    props: { people, "onUpdate:muted": (v: boolean) => w.setProps({ muted: v }) },
  });
  const [mute, camera, share, leave] = w.findAll(".bless-call__btn");
  expect(camera!.attributes("aria-pressed")).toBe("true");
  expect(share!.attributes("aria-pressed")).toBe("false");
  await mute!.trigger("click");
  expect(w.find(".bless-call__btn").attributes("aria-pressed")).toBe("true");
  await leave!.trigger("click");
  expect(w.emitted("leave")).toHaveLength(1);
  expect(w.find("[role=group]").attributes("aria-label")).toBe("Call controls");
});
