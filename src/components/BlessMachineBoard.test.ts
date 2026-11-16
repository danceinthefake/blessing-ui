import { mount } from "@vue/test-utils";
import BlessMachineBoard from "./BlessMachineBoard.vue";

const machines = [
  {
    id: "a",
    name: "Press 1",
    state: "running" as const,
    minutes: 95,
    job: "WO-91",
    reading: "92 pcs/h",
  },
  { id: "b", name: "Press 2", state: "down" as const, minutes: 12 },
  { id: "c", name: "Lathe", state: "running" as const },
];

test("BlessMachineBoard: down first, state and time in words, a summary, and select", async () => {
  const w = mount(BlessMachineBoard, { props: { machines } });
  expect(w.find("[role=status]").text()).toBe("2 running, 1 down");
  const tiles = w.findAll(".bless-machines__tile");
  expect(tiles.map((t) => t.find(".bless-machines__name").text())).toEqual([
    "Press 2",
    "Press 1",
    "Lathe",
  ]);
  expect(tiles[0]!.find(".bless-machines__state").text()).toBe("✕ Down for 12 min");
  expect(tiles[1]!.find(".bless-machines__state").text()).toBe("▶ Running for 1 h 35 min");
  expect(tiles[1]!.find(".bless-machines__reading").text()).toBe("92 pcs/h");
  await tiles[0]!.trigger("click");
  expect(w.emitted("select")).toEqual([["b"]]);
});
