import { mount } from "@vue/test-utils";
import BlessSkuField, { gs1Valid } from "./BlessSkuField.vue";

test("gs1Valid: EAN-13, UPC-A, EAN-8, and wrong check digits or lengths", () => {
  expect(gs1Valid("4006381333931")).toBe(true);
  expect(gs1Valid("036000291452")).toBe(true);
  expect(gs1Valid("96385074")).toBe(true);
  expect(gs1Valid("4006381333932")).toBe(false);
  expect(gs1Valid("12345")).toBe(false);
});

const sheet = (props = {}) => {
  const w = mount(BlessSkuField, {
    props: { "onUpdate:modelValue": (v: string) => w.setProps({ modelValue: v }), ...props },
  });
  return w;
};

test("BlessSkuField: digits only, a bad check digit stops the scan, a good one scans and can clear", async () => {
  const w = sheet({ clearOnScan: true });
  await w.find("input").setValue("40-0638 1333932");
  expect(w.props("modelValue")).toBe("4006381333932");
  await w.find("form").trigger("submit");
  expect(w.find("input").attributes("aria-invalid")).toBe("true");
  expect(w.find("[role=status]").text()).toBe("✕ This barcode is not valid. Check the digits.");
  expect(w.emitted("scan")).toBeUndefined();
  await w.find("input").setValue("4006381333931");
  await w.find("form").trigger("submit");
  expect(w.emitted("scan")).toEqual([["4006381333931"]]);
  expect(w.find("[aria-live]").text()).toBe("Scanned 4006381333931");
  expect(w.props("modelValue")).toBe("");
});

test("BlessSkuField: a SKU is upper case and not checked", async () => {
  const w = sheet({ kind: "sku" });
  expect(w.find("label").text()).toBe("SKU");
  await w.find("input").setValue("mic-usb 01");
  expect(w.props("modelValue")).toBe("MIC-USB01");
  await w.find("form").trigger("submit");
  expect(w.emitted("scan")).toEqual([["MIC-USB01"]]);
});
