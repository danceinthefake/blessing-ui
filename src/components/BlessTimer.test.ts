import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessTimer from "./BlessTimer.vue";

beforeEach(() =>
  vi.useFakeTimers({ toFake: ["setInterval", "clearInterval", "setTimeout", "performance"] }),
);
afterEach(() => {
  w?.unmount();
  vi.useRealTimers();
});
let w: VueWrapper<any>;
const mk = (props = {}) => (w = mount(BlessTimer, { props, attachTo: document.body }));
const clock = () => w.find(".bless-timer__clock").text();
const btn = (t: string) => w.findAll("button").find((b) => b.text() === t)!;
const run = async (ms: number) => {
  await vi.advanceTimersByTimeAsync(ms);
  await nextTick();
};

test("countdown shows the full time, runs down, and finishes once", async () => {
  mk({ duration: 5 });
  expect(clock()).toBe("00:05");
  await btn("Start").trigger("click");
  await run(2000);
  expect(clock()).toBe("00:03");
  await run(3500);
  expect(clock()).toBe("00:00");
  expect(w.emitted("finish")).toHaveLength(1);
  expect(w.find(".bless-timer__live").text()).toBe("Finished");
  expect(w.find(".bless-timer").classes()).toContain("bless-timer--done");
  await run(2000);
  expect(w.emitted("finish")).toHaveLength(1);
});

test("pause keeps the time, resume carries on, reset starts over", async () => {
  mk({ duration: 60 });
  await btn("Start").trigger("click");
  await run(10_000);
  await btn("Pause").trigger("click");
  const held = clock();
  expect(held).toBe("00:50");
  await run(30_000);
  expect(clock()).toBe(held);
  await btn("Resume").trigger("click");
  await run(5000);
  expect(clock()).toBe("00:45");
  await btn("Reset").trigger("click");
  expect(clock()).toBe("01:00");
});

test("stopwatch counts up with hours past 59:59", async () => {
  mk({ mode: "stopwatch" });
  expect(clock()).toBe("00:00");
  await btn("Start").trigger("click");
  await run(61_000);
  expect(clock()).toBe("01:01");
  await run(3600_000);
  expect(clock()).toBe("1:01:01");
  expect(w.emitted("finish")).toBeUndefined();
});

test("interval walks the phases and rounds, announcing each change", async () => {
  mk({
    mode: "interval",
    phases: [
      { label: "Work", seconds: 3 },
      { label: "Rest", seconds: 2 },
    ],
    rounds: 2,
  });
  expect(w.find(".bless-timer__phase").text()).toBe("Work · round 1 of 2");
  expect(clock()).toBe("00:03");
  await btn("Start").trigger("click");
  await run(3200);
  expect(w.find(".bless-timer__phase").text()).toBe("Rest · round 1 of 2");
  expect(clock()).toBe("00:02");
  expect(w.find(".bless-timer__live").text()).toBe("Rest, round 1 of 2");
  await run(2000);
  expect(w.find(".bless-timer__phase").text()).toBe("Work · round 2 of 2");
  await run(5200);
  expect(w.emitted("finish")).toHaveLength(1);
  expect(w.emitted("phase")!.map((e) => [(e[0] as { label: string }).label, e[2]])).toEqual([
    ["Rest", 1],
    ["Work", 2],
    ["Rest", 2],
  ]);
});

test("autostart runs at once; v-model:running controls it; changing the plan resets", async () => {
  mk({ duration: 10, autostart: true, controls: false });
  expect(w.findAll("button")).toHaveLength(0);
  await run(3000);
  expect(clock()).toBe("00:07");
  await w.setProps({ duration: 20 });
  expect(clock()).toBe("00:20");
  w.vm.pause();
  await nextTick();
  const t = clock();
  await run(5000);
  expect(clock()).toBe(t);
});

test("v-model:running mirrors and drives the clock", async () => {
  mk({
    duration: 10,
    running: false,
    "onUpdate:running": (v: boolean) => w.setProps({ running: v }),
  });
  await btn("Start").trigger("click");
  expect(w.props("running")).toBe(true);
  await run(2000);
  expect(clock()).toBe("00:08");
  await w.setProps({ running: false });
  await run(5000);
  expect(clock()).toBe("00:08");
});

test("Start after finishing begins a fresh run", async () => {
  mk({ duration: 2 });
  await btn("Start").trigger("click");
  await run(2500);
  expect(clock()).toBe("00:00");
  await btn("Start").trigger("click");
  await run(1000);
  expect(clock()).toBe("00:01");
});
