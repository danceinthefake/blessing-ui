import {
  fmtTime,
  layoutDay,
  moveEvent,
  nextEventId,
  resizeEvent,
  snapTo,
  weekOf,
  type ScheduleEvent,
} from "./schedule";

const ev = (id: string, start: number, end: number, date = "2026-05-04"): ScheduleEvent => ({
  id,
  title: id,
  date,
  start,
  end,
});

test("snapTo rounds to the step", () => {
  expect(snapTo(547, 15)).toBe(540);
  expect(snapTo(548, 15)).toBe(555);
  expect(snapTo(10, 30)).toBe(0);
});

test("fmtTime: 24 h by default, locale style on request", () => {
  expect(fmtTime(0)).toBe("00:00");
  expect(fmtTime(9 * 60 + 5)).toBe("09:05");
  expect(fmtTime(13 * 60 + 30)).toBe("13:30");
  expect(fmtTime(13 * 60 + 30, "en-US")).toMatch(/1:30\s?PM/);
});

test("weekOf finds the Monday or Sunday on or before a day", () => {
  expect(weekOf("2026-05-06", 1)).toBe("2026-05-04"); // a Wednesday -> Monday
  expect(weekOf("2026-05-04", 1)).toBe("2026-05-04");
  expect(weekOf("2026-05-03", 1)).toBe("2026-04-27"); // a Sunday belongs to the week before
  expect(weekOf("2026-05-03", 0)).toBe("2026-05-03");
});

test("layoutDay: events that do not touch get the full width", () => {
  const l = layoutDay([ev("a", 540, 600), ev("b", 600, 660)]);
  expect(l.get("a")).toEqual({ lane: 0, lanes: 1 });
  expect(l.get("b")).toEqual({ lane: 0, lanes: 1 }); // starts exactly when a ends
});

test("layoutDay: overlapping events sit side by side, and a later gap resets", () => {
  const l = layoutDay([ev("a", 540, 660), ev("b", 600, 720), ev("c", 630, 650), ev("d", 900, 960)]);
  expect(l.get("a")).toEqual({ lane: 0, lanes: 3 });
  expect(l.get("b")).toEqual({ lane: 1, lanes: 3 });
  expect(l.get("c")).toEqual({ lane: 2, lanes: 3 });
  expect(l.get("d")).toEqual({ lane: 0, lanes: 1 });
});

test("layoutDay: a lane is reused once its event is over", () => {
  const l = layoutDay([ev("a", 540, 600), ev("b", 560, 700), ev("c", 610, 650)]);
  expect(l.get("c")).toEqual({ lane: 0, lanes: 2 }); // a is over by 610, b still runs
});

test("moveEvent keeps the length and stops at the ends of the day", () => {
  const e = ev("a", 600, 660);
  expect(moveEvent(e, 30, 0, 420, 1200)).toMatchObject({ start: 630, end: 690 });
  expect(moveEvent(e, -600, 0, 420, 1200)).toMatchObject({ start: 420, end: 480 });
  expect(moveEvent(e, 9999, 0, 420, 1200)).toMatchObject({ start: 1140, end: 1200 });
  expect(moveEvent(e, 0, 2, 420, 1200).date).toBe("2026-05-06");
  expect(moveEvent(e, 0, -5, 420, 1200).date).toBe("2026-04-29");
});

test("resizeEvent keeps a minimum length and stays inside the day", () => {
  const e = ev("a", 600, 660);
  expect(resizeEvent(e, 30, 15, 1200).end).toBe(690);
  expect(resizeEvent(e, -500, 15, 1200).end).toBe(615);
  expect(resizeEvent(e, 9999, 15, 1200).end).toBe(1200);
});

test("nextEventId fills the first gap", () => {
  expect(nextEventId([])).toBe("e1");
  expect(nextEventId([ev("e1", 0, 1), ev("e3", 0, 1)])).toBe("e2");
});
