import { mount } from "@vue/test-utils";
import BlessSearchResult from "./BlessSearchResult.vue";

test("BlessSearchResult: address as parts, marked words, kind, and date", () => {
  const w = mount(BlessSearchResult, {
    props: {
      title: "Renew a passport",
      href: "https://www.example.go.id/services/passport/renew",
      snippet: "How to renew your passport online.",
      query: "renew passport",
      kind: "Service",
      date: "3 Nov 2026",
    },
  });
  expect(w.find(".bless-result__url").text()).toBe("example.go.id › services › passport › renew");
  expect(w.find("h3 a").attributes("href")).toBe(
    "https://www.example.go.id/services/passport/renew",
  );
  expect(w.findAll("h3 mark").map((m) => m.text())).toEqual(["Renew", "passport"]);
  expect(w.findAll(".bless-result__snippet mark").map((m) => m.text())).toEqual([
    "renew",
    "passport",
  ]);
  expect(w.find(".bless-result__snippet").text()).toBe(
    "3 Nov 2026 — How to renew your passport online.",
  );
  const rel = mount(BlessSearchResult, { props: { title: "A", href: "/help/a b" } });
  expect(rel.find(".bless-result__url").text()).toBe("help › a b");
});
