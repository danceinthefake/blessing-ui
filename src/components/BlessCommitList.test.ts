import { mount } from "@vue/test-utils";
import BlessCommitList from "./BlessCommitList.vue";

test("BlessCommitList: days newest first, changes in words, and a copy button named with the hash", () => {
  const w = mount(BlessCommitList, {
    props: {
      timeZone: "UTC",
      commits: [
        { sha: "aaaaaaa111", title: "Old", author: "Ana", time: "2026-11-16T09:00:00Z" },
        {
          sha: "bbbbbbb222",
          title: "New",
          author: "Budi",
          time: "2026-11-17T10:30:00Z",
          added: 1200,
          removed: 4,
          url: "/c/b",
        },
      ],
    },
  });
  expect(w.findAll("section").map((s) => s.attributes("aria-label"))).toEqual([
    "Commits on Nov 17, 2026",
    "Commits on Nov 16, 2026",
  ]);
  const first = w.find("li");
  expect(first.find("a").text()).toBe("New");
  expect(first.find(".bless-commits__meta").text()).toBe("Budi · 10:30 AM");
  expect(first.find(".bless-commits__diff").text()).toBe(
    "+1,200−41200 lines added, 4 lines removed",
  );
  expect(first.find("button").text()).toBe("Copy bbbbbbb");
  expect(w.findAll("li")[1]!.find(".bless-commits__diff").exists()).toBe(false);
});
