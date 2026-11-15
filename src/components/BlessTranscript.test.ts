import { mount } from "@vue/test-utils";
import BlessTranscript from "./BlessTranscript.vue";
import { clockText, currentIndex } from "./media";

const cues = [
  { start: 0, text: "Welcome back.", speaker: "Ana" },
  { start: 4, text: "Today: home studios.", speaker: "Ana" },
  { start: 9, text: "Thanks for having me.", speaker: "Budi" },
  { start: 3700, end: 3705, text: "Bye.", speaker: "Ana" },
];

test("clockText and currentIndex", () => {
  expect(clockText(0)).toBe("0:00");
  expect(clockText(65.9)).toBe("1:05");
  expect(clockText(3700)).toBe("1:01:40");
  expect(currentIndex(cues, -1)).toBe(-1);
  expect(currentIndex(cues, 5)).toBe(1);
  expect(currentIndex(cues, 3702)).toBe(3);
  expect(currentIndex(cues, 3710)).toBe(-1);
});

test("BlessTranscript: the current line is marked, earlier lines are past, and a speaker shows once per turn", () => {
  const w = mount(BlessTranscript, { props: { cues, time: 5 } });
  const rows = w.findAll("li");
  expect(rows[1]!.attributes("aria-current")).toBe("time");
  expect(rows[1]!.classes()).toContain("is-current");
  expect(rows[0]!.classes()).toContain("is-past");
  expect(w.findAll(".bless-transcript__speaker").map((s) => s.text())).toEqual([
    "Ana",
    "Budi",
    "Ana",
  ]);
  expect(w.attributes("role")).toBe("region");
  expect(w.attributes("aria-label")).toBe("Transcript");
});

test("BlessTranscript: a click on a time seeks, and labels translate", async () => {
  const w = mount(BlessTranscript, {
    props: { cues, labels: { seek: (t: string) => `Putar dari ${t}` } },
  });
  const b = w.findAll(".bless-transcript__time")[2]!;
  expect(b.text()).toBe("0:09");
  expect(b.attributes("aria-label")).toBe("Putar dari 0:09");
  await b.trigger("click");
  expect(w.emitted("seek")).toEqual([[9]]);
});
