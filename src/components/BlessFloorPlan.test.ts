import { mount } from "@vue/test-utils";
import BlessFloorPlan from "./BlessFloorPlan.vue";

const rooms = [
  { id: "studio", name: "Studio", x: 0, y: 0, w: 6, h: 4 },
  { id: "hall", name: "Hall", x: 6, y: 0, w: 2, h: 4 },
];
const devices = [
  { id: "a", name: "Lamp", room: "studio", on: true, icon: "💡" },
  { id: "b", name: "Fan", room: "studio" },
];

test("BlessFloorPlan: rooms on the grid with counts in words, a pressed room, and the room slot", async () => {
  const w = mount(BlessFloorPlan, {
    props: {
      rooms,
      devices,
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v as string }),
    },
    slots: {
      room: `<template #room="{ room, devices }"><p class="detail">{{ room.name }}: {{ devices.length }}</p></template>`,
    },
  });
  const [studio, hall] = w.findAll(".bless-floorplan__room");
  expect(studio!.attributes("style")).toContain("grid-area: 1 / 1 / span 4 / span 6");
  expect(studio!.find(".bless-floorplan__count").text()).toBe("2 devices, 1 on");
  expect(hall!.find(".bless-floorplan__count").text()).toBe("No devices");
  await studio!.trigger("click");
  expect(w.props("modelValue")).toBe("studio");
  expect(w.findAll(".bless-floorplan__room")[0]!.attributes("aria-pressed")).toBe("true");
  expect(w.find(".detail").text()).toBe("Studio: 2");
  await w.findAll(".bless-floorplan__room")[0]!.trigger("click");
  expect(w.props("modelValue")).toBeUndefined();
});
