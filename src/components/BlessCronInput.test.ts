import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessCronInput from "./BlessCronInput.vue";
import { blessCronNext, cronField } from "./cron";

test("cronField: stars, lists, ranges, steps, and bad text", () => {
  expect([...cronField("*/15", 0)!]).toEqual([0, 15, 30, 45]);
  expect([...cronField("1-5", 4)!]).toEqual([1, 2, 3, 4, 5]);
  expect([...cronField("1,7", 4)!]).toEqual([1, 0]);
  expect([...cronField("10-20/5", 1)!]).toEqual([10, 15, 20]);
  expect([...cronField("50/5", 0)!]).toEqual([50, 55]);
  for (const bad of ["60", "5-1", "*/0", "a", "", "1-"]) expect(cronField(bad, 0)).toBeNull();
  expect(cronField("0", 2)).toBeNull(); // days start at 1
});

const at = (s: string) => new Date(s);
const iso = (ds: Date[]) => ds.map((d) => d.toString().slice(0, 21));

test("blessCronNext: the next matching minutes, across days and months", () => {
  // Saturday 14 November 2026, 10:07 local time
  const from = at("2026-11-14T10:07:30");
  expect(iso(blessCronNext("*/15 * * * *", from, 2))).toEqual([
    "Sat Nov 14 2026 10:15",
    "Sat Nov 14 2026 10:30",
  ]);
  // weekdays at nine: skips the weekend
  expect(iso(blessCronNext("0 9 * * 1-5", from, 2))).toEqual([
    "Mon Nov 16 2026 09:00",
    "Tue Nov 17 2026 09:00",
  ]);
  // both day fields: either one matches
  expect(iso(blessCronNext("0 0 1 * 0", from, 2))).toEqual([
    "Sun Nov 15 2026 00:00",
    "Sun Nov 22 2026 00:00",
  ]);
  expect(iso(blessCronNext("30 6 29 2 *", from))).toEqual(["Tue Feb 29 2028 06:30"]);
  expect(blessCronNext("0 0 31 2 *", from)).toEqual([]);
  expect(blessCronNext("bad", from)).toEqual([]);
});

test("BlessCronInput: a field per part, the model joined by spaces, next runs after mount", async () => {
  const w = mount(BlessCronInput, { props: { modelValue: "0 9 * * 1-5", locale: "en-GB" } });
  await nextTick();
  const inputs = w.findAll("input");
  expect(inputs.map((i) => i.element.value)).toEqual(["0", "9", "*", "*", "1-5"]);
  expect(w.findAll("label").map((l) => l.find("span").text())).toEqual([
    "Minute",
    "Hour",
    "Day",
    "Month",
    "Weekday",
  ]);
  expect(w.findAll("time")).toHaveLength(3);
  await inputs[1]!.setValue(" 1 8 ");
  await inputs[1]!.trigger("change");
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual(["0 18 * * 1-5"]);
});

test("BlessCronInput: a bad part is marked and the runs give way to a hint", async () => {
  const w = mount(BlessCronInput, { props: { modelValue: "0 25 * * *" } });
  await nextTick();
  expect(w.findAll("input")[1]!.attributes("aria-invalid")).toBe("true");
  expect(w.findAll("input")[0]!.attributes("aria-invalid")).toBeUndefined();
  expect(w.find(".bless-cron__invalid").text()).toBe("Check the marked part");
  expect(w.find("time").exists()).toBe(false);
});
