import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessCardInput from "./BlessCardInput.vue";
import BlessDurationInput from "./BlessDurationInput.vue";
import BlessPhoneInput from "./BlessPhoneInput.vue";
import { caretAfterDigits, cardBrand, cardDigits, formatCard, luhn } from "./card";
import { formatDuration, parseDuration } from "./duration";
import { COUNTRIES, joinPhone, nationalDigits, splitPhone } from "./phone";

test("cardBrand reads the leading digits", () => {
  const cases: [string, string][] = [
    ["4242424242424242", "visa"],
    ["5555555555554444", "mastercard"],
    ["2221000000000009", "mastercard"],
    ["378282246310005", "amex"],
    ["6011111111111117", "discover"],
    ["3530111333300000", "jcb"],
    ["30569309025904", "diners"],
    ["6200000000000005", "unionpay"],
    ["9", "unknown"],
  ];
  for (const [n, b] of cases) expect(cardBrand(n), n).toBe(b);
});

test("formatCard groups by brand and cardDigits cuts to the brand length", () => {
  expect(formatCard("4242424242424242")).toBe("4242 4242 4242 4242");
  expect(formatCard("378282246310005")).toBe("3782 822463 10005");
  expect(formatCard("424242")).toBe("4242 42");
  expect(cardDigits("3782 8224 6310 0059999")).toBe("378282246310005");
  expect(cardDigits("4a2")).toBe("42");
  expect(formatCard("")).toBe("");
});

test("luhn accepts real test numbers and rejects a changed digit", () => {
  expect(luhn("4242424242424242")).toBe(true);
  expect(luhn("378282246310005")).toBe(true);
  expect(luhn("4242424242424241")).toBe(false);
  expect(luhn("1234")).toBe(false);
});

test("caretAfterDigits skips the spaces", () => {
  expect(caretAfterDigits("4242 4242", 4)).toBe(4);
  expect(caretAfterDigits("4242 4242", 5)).toBe(6);
  expect(caretAfterDigits("4242 4242", 0)).toBe(0);
  expect(caretAfterDigits("42", 9)).toBe(2);
});

test("BlessCardInput: types any text, holds digits, shows groups, reports the brand", async () => {
  const w = mount(BlessCardInput, { props: { modelValue: "" }, attachTo: document.body });
  const input = w.find("input");
  expect(input.attributes("autocomplete")).toBe("cc-number");
  expect(input.attributes("inputmode")).toBe("numeric");
  (input.element as HTMLInputElement).value = "4242-4242 4242x4242";
  await input.trigger("input");
  expect((input.element as HTMLInputElement).value).toBe("4242 4242 4242 4242");
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual(["4242424242424242"]);
  expect(w.emitted("brand")![0]).toEqual(["visa"]);
  w.unmount();
});

test("BlessCardInput: a complete number that fails Luhn is flagged after blur only", async () => {
  const w = mount(BlessCardInput, { props: { modelValue: "4242424242424241" } });
  expect(w.find("[aria-invalid]").exists()).toBe(false);
  await w.find("input").trigger("blur");
  expect(w.find("input").attributes("aria-invalid")).toBe("true");
  expect(w.find("[role=alert]").text()).toBe("Check the card number");
  await w.setProps({ modelValue: "4242424242424242" });
  expect(w.find("[role=alert]").exists()).toBe(false);
  await w.setProps({ modelValue: "4242424242424241", validate: false });
  expect(w.find("[role=alert]").exists()).toBe(false);
});

test("parseDuration reads colons and units", () => {
  expect(parseDuration("1:30:00")).toBe(5400);
  expect(parseDuration("1:30")).toBe(90); // m:ss with seconds
  expect(parseDuration("1:30", false)).toBe(5400); // h:mm without
  expect(parseDuration("1h 30m")).toBe(5400);
  expect(parseDuration("90s")).toBe(90);
  expect(parseDuration("1.5h")).toBe(5400);
  expect(parseDuration("2h5m10s")).toBe(7510);
  for (const bad of ["", "abc", "1:99", "1h x", "12"]) expect(parseDuration(bad), bad).toBeNull();
});

test("formatDuration pads and can drop seconds", () => {
  expect(formatDuration(5400)).toBe("1:30:00");
  expect(formatDuration(75)).toBe("0:01:15");
  expect(formatDuration(5430, false)).toBe("1:30");
  expect(formatDuration(-5)).toBe("0:00:00");
});

test("BlessDurationInput: typing sets seconds, blur normalizes, bad text is flagged", async () => {
  const w = mount(BlessDurationInput, { props: { modelValue: null } });
  const input = w.find("input");
  await input.setValue("1h 30m");
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual([5400]);
  await w.setProps({ modelValue: 5400 });
  await input.trigger("blur");
  expect((input.element as HTMLInputElement).value).toBe("1:30:00");
  await input.setValue("soon");
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual([null]);
  await w.setProps({ modelValue: null });
  await input.trigger("blur");
  expect(input.attributes("aria-invalid")).toBe("true");
  expect(w.find("[role=alert]").text()).toContain("Enter a time");
});

test("BlessDurationInput: min and max clamp, and a value from outside is shown", async () => {
  const w = mount(BlessDurationInput, { props: { modelValue: null, max: 3600 } });
  await w.find("input").setValue("2h");
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual([3600]);
  await w.setProps({ modelValue: 60, seconds: true });
  expect((w.find("input").element as HTMLInputElement).value).toBe("0:01:00");
});

test("splitPhone picks the longest code, and prefer settles a shared code", () => {
  expect(splitPhone("+628123456789", COUNTRIES)).toMatchObject({
    country: { code: "ID" },
    national: "8123456789",
  });
  expect(splitPhone("+14155550100", COUNTRIES)!.country.code).toBe("US");
  expect(splitPhone("+14155550100", COUNTRIES, "CA")!.country.code).toBe("CA");
  expect(splitPhone("+3581234", COUNTRIES)!.country.code).toBe("FI"); // 358, not 3
  expect(splitPhone("8123", COUNTRIES)).toBeNull();
  expect(splitPhone("+999", COUNTRIES)).toBeNull();
});

test("nationalDigits drops the trunk zero and caps the E.164 length; joinPhone is empty without digits", () => {
  expect(nationalDigits("0812-3456 789", "62")).toBe("8123456789");
  expect(nationalDigits("1".repeat(30), "62")).toHaveLength(13);
  expect(joinPhone("62", "")).toBe("");
  expect(joinPhone("62", "812")).toBe("+62812");
});

test("BlessPhoneInput: typing builds the E.164 value; the country select changes the code", async () => {
  const w = mount(BlessPhoneInput, {
    props: { modelValue: "", defaultCountry: "ID", locale: "en" },
  });
  const select = w.find("select");
  const input = w.find("input");
  expect((select.element as HTMLSelectElement).value).toBe("ID");
  expect(input.attributes("type")).toBe("tel");
  expect(input.attributes("autocomplete")).toBe("tel-national");
  expect(input.attributes("aria-label")).toBe("Phone number");
  expect(select.attributes("aria-label")).toBe("Country code");
  await input.setValue("0812 3456 789");
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual(["+628123456789"]);
  await w.setProps({ modelValue: "+628123456789" });
  await select.setValue("SG");
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual(["+658123456789"]);
  expect(w.emitted("update:country")!.at(-1)).toEqual(["SG"]);
  await input.setValue("");
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual([""]);
});

test("BlessPhoneInput: a value from outside picks the country and fills the number", async () => {
  const w = mount(BlessPhoneInput, { props: { modelValue: "+819012345678", locale: "en" } });
  await nextTick();
  expect((w.find("select").element as HTMLSelectElement).value).toBe("JP");
  expect((w.find("input").element as HTMLInputElement).value).toBe("9012345678");
  await w.setProps({ modelValue: "+442071838750" });
  expect((w.find("select").element as HTMLSelectElement).value).toBe("GB");
  expect((w.find("input").element as HTMLInputElement).value).toBe("2071838750");
  const names = w.findAll("option").map((o) => o.text());
  expect(names).toContain("Japan (+81)");
});
