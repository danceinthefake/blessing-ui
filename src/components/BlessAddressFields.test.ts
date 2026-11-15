import { mount } from "@vue/test-utils";
import BlessAddressFields from "./BlessAddressFields.vue";

const labels = (w: ReturnType<typeof mount>) =>
  w.findAll(".bless-address__row").map((r) =>
    r
      .findAll(".bless-address__label")
      .map((l) => l.text())
      .join(" | "),
  );

test("BlessAddressFields: the order and names follow the country, with autocomplete", () => {
  const us = mount(BlessAddressFields, { props: { modelValue: { country: "US" } } });
  expect(labels(us)).toEqual([
    "Country",
    "Street and number",
    "Apartment, floor, or building (optional)",
    "City | State | ZIP code",
  ]);
  expect(us.find(".is-postal input").attributes("autocomplete")).toBe("postal-code");
  expect(us.find("select option[value=US]").text()).toBe("United States");
  const jp = mount(BlessAddressFields, { props: { modelValue: { country: "JP" } } });
  expect(labels(jp).slice(1, 3)).toEqual(["Postal code", "Prefecture | City"]);
  const de = mount(BlessAddressFields, { props: { modelValue: { country: "DE" } } });
  expect(labels(de)[3]).toBe("Postal code | City");
  // an unknown country uses the default rows
  const xx = mount(BlessAddressFields, {
    props: { modelValue: { country: "BR" }, countries: ["BR"] },
  });
  expect(labels(xx)[3]).toBe("City | Province");
});

test("BlessAddressFields: typing and the country change the model, and labels translate", async () => {
  const w = mount(BlessAddressFields, {
    props: {
      modelValue: { country: "ID", city: "Bandung" },
      labels: { province: "Provinsi" },
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v as never }),
    },
  });
  expect(labels(w)[3]).toBe("City | Provinsi");
  await w.find(".is-postal input").setValue("40115");
  expect(w.props("modelValue")).toEqual({ country: "ID", city: "Bandung", postal: "40115" });
  await w.find("select").setValue("GB");
  expect(labels(w)[4]).toBe("Postcode");
  expect(w.find(".is-line2 input").attributes("required")).toBeUndefined();
  expect(w.find(".is-line1 input").attributes("required")).toBeDefined();
});
