import { mount } from "@vue/test-utils";
import BlessPaletteViewer from "./BlessPaletteViewer.vue";

const palettes = [
  {
    name: "Pink",
    shades: [
      { label: "100", value: "#fde8ee" },
      { label: "700", value: "#9c2348" },
    ],
  },
];

test("BlessPaletteViewer: a swatch per shade with the value, the contrast on white and black, and copy", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.assign(navigator, { clipboard: { writeText } });
  const w = mount(BlessPaletteViewer, { props: { palettes } });
  const shades = w.findAll(".bless-palettes__shade");
  expect(shades).toHaveLength(2);
  expect(shades[0]!.find("code").text()).toBe("#fde8ee");
  // a light shade gets black text, a dark one white
  expect(shades[0]!.find("button").attributes("style")).toContain("color: rgb(0, 0, 0)");
  expect(shades[1]!.find("button").attributes("style")).toContain("color: rgb(255, 255, 255)");
  const r = shades[1]!.findAll(".bless-palettes__ratio").map((x) => x.text());
  expect(r[0]).toMatch(/^\d+\.\d on white AA$/);
  expect(r[1]).toMatch(/^\d+\.\d on black$/);
  const b = shades[1]!.find("button");
  expect(b.attributes("aria-label")).toBe("Copy Pink 700, #9c2348");
  await b.trigger("click");
  await new Promise((res) => setTimeout(res));
  expect(writeText).toHaveBeenCalledWith("#9c2348");
  expect(w.find("[role=status]").text()).toBe("#9c2348 copied");
});
