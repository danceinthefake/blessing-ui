import { mount } from "@vue/test-utils";
import BlessMeasureConverter, { convertMeasure, type BlessMeasureKind } from "./BlessMeasureConverter.vue";

test("convertMeasure: exact factors and temperatures through Celsius", () => {
  expect(convertMeasure(1, "mile", "kilometer")).toBeCloseTo(1.609344, 9);
  expect(convertMeasure(1, "pound", "gram")).toBeCloseTo(453.59237, 9);
  expect(convertMeasure(100, "celsius", "fahrenheit")).toBeCloseTo(212, 9);
  expect(convertMeasure(32, "fahrenheit", "kelvin")).toBeCloseTo(273.15, 9);
  expect(() => convertMeasure(1, "meter", "gram")).toThrow();
});

test("BlessMeasureConverter: result in words, swap, and units that follow the kind", async () => {
  const w = mount(BlessMeasureConverter, {
    props: {
      amount: 10,
      "onUpdate:amount": (v: number) => w.setProps({ amount: v }),
      "onUpdate:from": (v: string) => w.setProps({ from: v }),
      "onUpdate:to": (v: string) => w.setProps({ to: v }),
      "onUpdate:kind": (v: BlessMeasureKind) => w.setProps({ kind: v }),
    },
  });
  expect(w.find("output").text()).toBe("6.21371 miles");
  expect(w.find("select option").text()).toBe("millimeters");
  await w.find('[aria-label="Swap the units"]').trigger("click");
  expect(w.find("output").text()).toBe("16.0934 kilometers");
  await w.findAll(".bless-measure__kinds button")[3]!.trigger("click");
  expect(w.props("from")).toBe("celsius");
  expect(w.find("output").text()).toBe("50 degrees Fahrenheit");
  await w.findAll("select")[1]!.setValue("kelvin");
  expect(w.find("output").text()).toBe("283.15 K");
});
