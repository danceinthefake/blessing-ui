import { mount } from "@vue/test-utils";
import BlessOpeningHours, { hoursState, type BlessWeekHours } from "./BlessOpeningHours.vue";

const nine5 = [{ open: "09:00", close: "17:00" }];
// Mon to Fri 9–5, Saturday two shifts and a late one past midnight, Sunday closed
const week: BlessWeekHours = [
  nine5,
  nine5,
  nine5,
  nine5,
  nine5,
  [
    { open: "10:00", close: "14:00" },
    { open: "20:00", close: "02:00" },
  ],
  [],
];

test("hoursState: open with the closing time, closed with the next opening, and a shift past midnight", () => {
  expect(hoursState(week, 0, 10 * 60)).toMatchObject({ open: true, closes: 17 * 60 });
  expect(hoursState(week, 0, 18 * 60)).toEqual({ open: false, opensDay: 1, opens: 9 * 60 });
  expect(hoursState(week, 5, 15 * 60)).toEqual({ open: false, opensDay: 5, opens: 20 * 60 });
  // Sunday 01:00 is still in the Saturday late shift
  expect(hoursState(week, 6, 60)).toMatchObject({ open: true, closes: 120 });
  // after it, the next opening is Monday 9:00
  expect(hoursState(week, 6, 3 * 60)).toEqual({ open: false, opensDay: 0, opens: 9 * 60 });
  expect(hoursState([[], [], [], [], [], [], []], 0, 0)).toEqual({ open: false });
});

test("BlessOpeningHours: the week, today marked, and the status in the zone of the place", () => {
  // Monday 16 Nov 2026, 03:30 UTC = 10:30 in Jakarta
  const w = mount(BlessOpeningHours, {
    props: { hours: week, timeZone: "Asia/Jakarta", now: Date.UTC(2026, 10, 16, 3, 30) },
  });
  expect(w.find(".bless-hours__status").text()).toBe("Open now · closes at 5:00 PM");
  expect(w.find(".bless-hours__status").classes()).toContain("is-open");
  const days = w.findAll(".bless-hours__day");
  expect(days).toHaveLength(7);
  expect(days[0]!.classes()).toContain("is-today");
  expect(days[0]!.find("dt").text()).toBe("Monday · today");
  expect(days[5]!.find("dd").text()).toBe("10:00 AM–2:00 PM8:00 PM–2:00 AM");
  expect(days[6]!.find("dd").text()).toBe("Closed");
});

test("BlessOpeningHours: closed with the next day, and labels translate", () => {
  // Sunday 15 Nov 2026 at noon in Jakarta
  const w = mount(BlessOpeningHours, {
    props: {
      hours: week,
      timeZone: "Asia/Jakarta",
      locale: "id",
      now: Date.UTC(2026, 10, 15, 5, 0),
      labels: { closed: "Tutup", opensAt: (d: string, t: string) => `buka ${d} pukul ${t}` },
    },
  });
  expect(w.find(".bless-hours__status").text()).toBe("Tutup · buka Senin pukul 9.00");
});
