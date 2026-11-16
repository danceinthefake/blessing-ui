import { mount } from "@vue/test-utils";
import { contrastRatio, hexToRgb, wcagLevels } from "../composables/contrast";
import BlessContrastChecker from "./BlessContrastChecker.vue";

test("contrast: hex parsing, the WCAG ratio, and the levels", () => {
  expect(hexToRgb("#fff")).toEqual([255, 255, 255]);
  expect(hexToRgb("3f4245")).toEqual([63, 66, 69]);
  expect(hexToRgb("red")).toBeUndefined();
  expect(contrastRatio("#000", "#fff")).toBeCloseTo(21, 5);
  expect(contrastRatio("#fff", "#fff")).toBeCloseTo(1, 5);
  expect(contrastRatio("#777", "#fff")).toBeCloseTo(4.48, 2);
  expect(wcagLevels(4.48)).toEqual({
    aaText: false,
    aaLarge: true,
    aaaText: false,
    aaaLarge: false,
    ui: true,
  });
});

test("BlessContrastChecker: the ratio, pass and fail in words, swap, and a hint for bad input", async () => {
  const w = mount(BlessContrastChecker, {
    props: {
      text: "#777777",
      background: "#ffffff",
      "onUpdate:text": (v: string) => w.setProps({ text: v }),
      "onUpdate:background": (v: string) => w.setProps({ background: v }),
    },
  });
  expect(w.find("[role=status]").text()).toBe("Contrast ratio4.47:1");
  expect(w.findAll(".bless-contrast__checks li").map((l) => l.text())).toEqual([
    "✕ AA, normal text: Fail",
    "✓ AA, large text: Pass",
    "✕ AAA, normal text: Fail",
    "✕ AAA, large text: Fail",
    "✓ Parts of the interface: Pass",
  ]);
  await w.find(".bless-contrast__swap").trigger("click");
  expect(w.props("text")).toBe("#ffffff");
  expect(w.props("background")).toBe("#777777");
  await w.findAll(".bless-contrast__hex")[0]!.setValue("nope");
  expect(w.find(".bless-contrast__invalid").exists()).toBe(true);
  expect(w.find("[role=status] strong").text()).toBe("–");
});
