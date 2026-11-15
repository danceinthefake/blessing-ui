import { mount } from "@vue/test-utils";
import BlessLeaderboard, { rankLeaders } from "./BlessLeaderboard.vue";

const rows = [
  { id: "a", name: "Ana", score: 90, previous: 2 },
  { id: "b", name: "Budi", score: 120, previous: 1 },
  { id: "c", name: "Citra", score: 90, previous: 2 },
  { id: "d", name: "Dimas", score: 40 },
  { id: "e", name: "Eka", score: 10, previous: 3 },
];

test("rankLeaders: high first, equal scores share a place, and the next place skips", () => {
  expect(rankLeaders(rows).map((r) => `${r.rank}${r.id}`)).toEqual(["1b", "2a", "2c", "4d", "5e"]);
  expect(rankLeaders([])).toEqual([]);
});

test("BlessLeaderboard: a table with places, the move in words, and the reader's row marked", () => {
  const w = mount(BlessLeaderboard, { props: { rows, me: "d" } });
  const trs = w.findAll("tbody tr");
  expect(trs.map((t) => t.find(".bless-leaders__rank").text())).toEqual(["1", "2", "2", "4", "5"]);
  expect(trs.map((t) => t.find(".bless-leaders__move .bless-sr").text())).toEqual([
    "no change",
    "no change",
    "no change",
    "new",
    "down 2",
  ]);
  expect(trs[4]!.find(".bless-leaders__move [aria-hidden]").text()).toBe("▼ 2");
  expect(trs[3]!.attributes("aria-current")).toBe("true");
  expect(trs[3]!.find(".bless-leaders__you").text()).toBe("you");
  expect(trs[0]!.classes()).toContain("is-top1");
  expect(w.find("caption").text()).toBe("Leaderboard");
});

test("BlessLeaderboard: a limit keeps the reader's row after a gap, and labels translate", () => {
  const w = mount(BlessLeaderboard, {
    props: { rows, me: "e", limit: 2, labels: { you: "kamu" }, format: (v: number) => `${v} pts` },
  });
  const trs = w.findAll("tbody tr");
  expect(trs).toHaveLength(4);
  expect(trs[2]!.classes()).toContain("bless-leaders__gap");
  expect(trs[3]!.find(".bless-leaders__name").text()).toBe("EEkakamu");
  expect(trs[0]!.find(".bless-leaders__score").text()).toBe("120 pts");
});
