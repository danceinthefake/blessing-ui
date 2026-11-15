import { mount } from "@vue/test-utils";
import BlessEventCalendar from "./BlessEventCalendar.vue";

const events = [
  { id: "a", title: "Recording", date: "2026-11-10", start: 600 },
  { id: "b", title: "Launch day", date: "2026-11-10" },
  { id: "c", title: "Edit", date: "2026-11-10", start: 540 },
  { id: "d", title: "Mix", date: "2026-11-10", start: 840, color: "danger" },
  { id: "e", title: "Call", date: "2026-11-30", start: 480 },
];

test("BlessEventCalendar: whole weeks of the month, events in order, and +n more", async () => {
  const w = mount(BlessEventCalendar, { props: { events, date: "2026-11-15" } });
  await w.vm.$nextTick();
  expect(w.find(".bless-evcal__title").text()).toBe("November 2026");
  expect(w.findAll("thead th").map((t) => t.text())).toEqual([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ]);
  // Nov 2026 starts on a Sunday and ends on a Monday: Oct 26 to Dec 6, six weeks
  const weeks = w.findAll("tbody tr");
  expect(weeks).toHaveLength(6);
  expect(w.findAll(".bless-evcal__day--out")).toHaveLength(6 + 6);
  const day = w.findAll("td").find((td) => td.text().startsWith("10"))!;
  expect(day.findAll(".bless-evcal__event").map((e) => e.text())).toEqual([
    "Launch day",
    "9:00 AM Edit",
  ]);
  const more = day.find(".bless-evcal__more");
  expect(more.text()).toBe("+2 more");
  await more.trigger("click");
  expect(day.findAll(".bless-evcal__event")).toHaveLength(4);
  expect(day.find(".bless-evcal__more").text()).toBe("Show less");
  expect(day.findAll(".bless-evcal__event")[3]!.attributes("style")).toContain(
    "var(--bless-color-danger)",
  );
  await day.findAll(".bless-evcal__event")[2]!.trigger("click");
  expect(w.emitted("select")![0]![0]).toMatchObject({ id: "a" });
});

test("BlessEventCalendar: months move with the buttons, Sunday first, labels and a locale", async () => {
  const w = mount(BlessEventCalendar, {
    props: {
      events,
      date: "2026-11-15",
      weekStart: 0 as const,
      locale: "id",
      "onUpdate:date": (d: string | null) => w.setProps({ date: d }),
    },
  });
  expect(w.findAll("thead abbr")[0]!.attributes("title")).toBe("Minggu");
  await w.findAll("button")[2]!.trigger("click");
  expect(w.props("date")).toBe("2026-12-01");
  expect(w.find(".bless-evcal__title").text()).toBe("Desember 2026");
  expect(w.findAll("tbody tr")).toHaveLength(5);
});
