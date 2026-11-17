import { mount } from "@vue/test-utils";
import BlessMapPins, { project, unproject } from "./BlessMapPins.vue";

test("project and unproject: Web Mercator round trip and known points", () => {
  expect(project(0, 0, 0)).toEqual({ x: 128, y: 128 });
  const p = project(-6.2, 106.8, 12);
  const back = unproject(p.x, p.y, 12);
  expect(back.lat).toBeCloseTo(-6.2, 6);
  expect(back.lng).toBeCloseTo(106.8, 6);
});

test("BlessMapPins: tiles around the center, pins at their place, select, zoom, and arrow keys", async () => {
  const w = mount(BlessMapPins, {
    props: {
      center: [0, 0] as [number, number],
      zoom: 1,
      height: 256,
      pins: [{ id: "a", lat: 0, lng: 0, label: "Null Island" }],
      "onUpdate:center": (v: [number, number]) => w.setProps({ center: v }),
      "onUpdate:zoom": (v: number) => w.setProps({ zoom: v }),
      "onUpdate:selected": (v: string | undefined) => w.setProps({ selected: v }),
    },
  });
  // the width is 640 before mount measures it; zoom 1 is 2 × 2 tiles, wrapped sideways
  const srcs = w.findAll("img").map((i) => i.attributes("src"));
  expect(srcs).toContain("https://tile.openstreetmap.org/1/0/0.png");
  expect(srcs.every((s) => /\/1\/[01]\/[01]\.png$/.test(s!))).toBe(true);
  const pin = w.find(".bless-map__pin");
  expect(pin.attributes("style")).toContain("translate(320px, 128px)");
  await pin.trigger("click");
  expect(w.props("selected")).toBe("a");
  expect(pin.attributes("aria-pressed")).toBe("true");
  await w.find('[aria-label="Zoom in"]').trigger("click");
  expect(w.props("zoom")).toBe(2);
  await w.find("[role=region]").trigger("keydown", { key: "ArrowRight" });
  expect(w.props("center")![1]).toBeCloseTo(28.125, 3);
  expect(w.find(".bless-map__credit").text()).toBe("© OpenStreetMap contributors");
});
