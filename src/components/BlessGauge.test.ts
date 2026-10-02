import { mount } from "@vue/test-utils";
import BlessGauge from "./BlessGauge.vue";

const zones = [
  { to: 60, color: "success", label: "Fine" },
  { to: 85, color: "warning", label: "Warm" },
  { to: 100, color: "danger", label: "Hot" },
];

test("is a meter with range, value and a text that names the zone", () => {
  const w = mount(BlessGauge, {
    props: { value: 70, zones, label: "CPU", format: (v: number) => `${v}%` },
  });
  const m = w.find('[role="meter"]');
  expect(m.attributes()).toMatchObject({
    "aria-label": "CPU",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-valuenow": "70",
    "aria-valuetext": "70%, Warm",
  });
  expect(w.find(".bless-gauge__value").text()).toBe("70%");
});

test("the value is clamped for assistive tech but shown as given; past the last zone uses the last", () => {
  const w = mount(BlessGauge, { props: { value: 140, zones } });
  expect(w.find('[role="meter"]').attributes("aria-valuenow")).toBe("100");
  expect(w.find(".bless-gauge__value").text()).toBe("140");
  expect(w.find('[role="meter"]').attributes("aria-valuetext")).toBe("140, Hot");
  w.setProps({ value: -5 });
});

test("arc: a band per zone, token names become theme colours, the needle sits at the value", () => {
  const w = mount(BlessGauge, { props: { value: 50, zones } });
  const bands = w.findAll(".bless-gauge__band");
  expect(bands).toHaveLength(3);
  expect(bands[0].attributes("style")).toContain("var(--bless-color-success)");
  // halfway round a half circle the needle points straight up: x stays at the centre
  const n = w.find(".bless-gauge__needle");
  expect(Number(n.attributes("x1"))).toBeCloseTo(100, 1);
  expect(Number(n.attributes("x2"))).toBeCloseTo(100, 1);
  expect(Number(n.attributes("y2"))).toBeLessThan(Number(n.attributes("y1")));
});

test("unsorted zones and plain CSS colours work; no zones means no bands", () => {
  const w = mount(BlessGauge, {
    props: {
      value: 10,
      zones: [
        { to: 100, color: "#00f" },
        { to: 30, color: "#f00" },
      ],
    },
  });
  expect(
    w.findAll(".bless-gauge__band").map((b) => (b.element as SVGElement).style.stroke),
  ).toEqual(["rgb(255, 0, 0)", "rgb(0, 0, 255)"]);
  const bare = mount(BlessGauge, { props: { value: 10 } });
  expect(bare.findAll(".bless-gauge__band")).toHaveLength(0);
  expect(bare.find('[role="meter"]').attributes("aria-valuetext")).toBe("10");
});

test("a custom range maps onto the scale; linear draws segments and a marker", () => {
  const w = mount(BlessGauge, {
    props: { value: 0, min: -20, max: 20, variant: "linear", zones: [{ to: 0 }, { to: 20 }] },
  });
  expect(w.find(".bless-gauge__mark").attributes("style")).toContain("left: 50%");
  const segs = w.findAll(".bless-gauge__seg").map((s) => s.attributes("style"));
  expect(segs[0]).toContain("width: 50%");
  expect(segs[1]).toContain("left: 50%");
  expect(w.find("svg").exists()).toBe(false);
});
