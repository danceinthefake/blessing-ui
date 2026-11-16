import { mount } from "@vue/test-utils";
import BlessWorkOrderCard from "./BlessWorkOrderCard.vue";

const base = {
  number: "WO-0091",
  product: "Desk mic",
  target: 200,
  done: 50,
  station: "Line 2",
  due: "15:00",
};

test("BlessWorkOrderCard: state in words, the progress named, and the buttons of each state", async () => {
  const w = mount(BlessWorkOrderCard, { props: { ...base, state: "running" as const } });
  expect(w.find(".bless-workorder__state").text()).toBe("▶ Running");
  expect(w.find(".bless-workorder__meta").text()).toBe("Line 2 · Due 15:00");
  expect(w.find(".bless-workorder__count").text()).toBe("50 of 200 pcs");
  expect(w.find("progress").attributes()).toMatchObject({
    value: "50",
    max: "200",
    "aria-label": "50 of 200 pcs",
  });
  expect(w.findAll("button").map((b) => b.text())).toEqual(["Pause", "Finish"]);
  await w.findAll("button")[0]!.trigger("click");
  expect(w.emitted("pause")).toHaveLength(1);
  const q = mount(BlessWorkOrderCard, { props: { ...base, state: "queued" as const } });
  expect(q.findAll("button").map((b) => b.text())).toEqual(["Start"]);
  const p = mount(BlessWorkOrderCard, { props: { ...base, state: "blocked" as const } });
  expect(p.findAll("button").map((b) => b.text())).toEqual(["Resume", "Finish"]);
  expect(
    mount(BlessWorkOrderCard, { props: { ...base, state: "done" as const } })
      .find("button")
      .exists(),
  ).toBe(false);
});
