import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessTimezonePicker from "./BlessTimezonePicker.vue";
import { offsetText, zoneOffset, zoneOptions } from "./timezone";

const jan = new Date("2026-01-15T12:00:00Z");
const jul = new Date("2026-07-15T12:00:00Z");

test("zoneOffset reads the offset from Intl, summer time included", () => {
  expect(zoneOffset("Asia/Jakarta", jan)).toBe(420);
  expect(zoneOffset("Asia/Kolkata", jan)).toBe(330);
  expect(zoneOffset("UTC", jan)).toBe(0);
  expect(zoneOffset("America/New_York", jan)).toBe(-300);
  expect(zoneOffset("America/New_York", jul)).toBe(-240);
});

test("offsetText writes whole hours, part hours, and zero", () => {
  expect(offsetText(420)).toBe("UTC+7");
  expect(offsetText(330)).toBe("UTC+5:30");
  expect(offsetText(-210)).toBe("UTC-3:30");
  expect(offsetText(0)).toBe("UTC");
});

test("zoneOptions sorts west to east then by name, with a readable label", () => {
  const o = zoneOptions(
    ["Asia/Jakarta", "America/New_York", "Asia/Bangkok", "Asia/Ho_Chi_Minh"],
    jan,
  );
  expect(o.map((x) => x.value)).toEqual([
    "America/New_York",
    "Asia/Bangkok",
    "Asia/Ho_Chi_Minh",
    "Asia/Jakarta",
  ]);
  expect(o[0].label).toBe("America/New York (UTC-5)");
  expect(o[3].label).toBe("Asia/Jakarta (UTC+7)");
});

test("BlessTimezonePicker: detect fills the device zone and the list shows the offset", async () => {
  vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({
    timeZone: "Asia/Jakarta",
  } as Intl.ResolvedDateTimeFormatOptions);
  const w = mount(BlessTimezonePicker, {
    props: { zones: ["Asia/Jakarta", "Europe/Paris"], at: jan, detect: true },
    attachTo: document.body,
  });
  await nextTick();
  expect(w.emitted("update:modelValue")![0]).toEqual(["Asia/Jakarta"]);
  // with a zone chosen, the box shows its label and the list narrows to it
  expect(w.find("[role=option]").text()).toContain("Asia/Jakarta (UTC+7)");
  w.unmount();
  vi.restoreAllMocks();
});

test("BlessTimezonePicker: detect leaves a chosen zone alone and skips a zone that is not offered", async () => {
  vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({
    timeZone: "Mars/Olympus",
  } as Intl.ResolvedDateTimeFormatOptions);
  const w = mount(BlessTimezonePicker, {
    props: { zones: ["Asia/Jakarta"], at: jan, detect: true },
  });
  await nextTick();
  expect(w.emitted("update:modelValue")).toBeUndefined();
  vi.restoreAllMocks();
  const set = mount(BlessTimezonePicker, {
    props: { zones: ["Asia/Jakarta"], at: jan, detect: true, modelValue: "Asia/Jakarta" },
  });
  await nextTick();
  expect(set.emitted("update:modelValue")).toBeUndefined();
});
