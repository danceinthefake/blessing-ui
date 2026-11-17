import { mount } from "@vue/test-utils";
import BlessKnowledgeArticle from "./BlessKnowledgeArticle.vue";

// the contents mark the heading in view with an observer, which jsdom does not have
vi.stubGlobal(
  "IntersectionObserver",
  class {
    observe() {}
    disconnect() {}
    unobserve() {}
  },
);

test("BlessKnowledgeArticle: contents, paragraphs, reading time, related, and the helpful question", async () => {
  const words = Array.from({ length: 400 }, () => "word").join(" ");
  const w = mount(BlessKnowledgeArticle, {
    props: {
      title: "Reset your PIN",
      updated: "3 Nov 2026",
      sections: [
        { title: "Before you start", body: "Have your card.\n\nFind a quiet place." },
        { title: "Steps", body: words },
      ],
      related: [{ title: "Lost card", href: "/lost" }],
    },
  });
  expect(w.find(".bless-kb__meta").text()).toBe("Last changed 3 Nov 20262 min read");
  const links = w.findAll(".bless-toc a");
  expect(links.map((a) => a.text())).toEqual(["Before you start", "Steps"]);
  expect(links[1]!.attributes("href")).toBe(`#${w.findAll("h3")[1]!.attributes("id")}`);
  expect(
    w
      .findAll("section")[0]!
      .findAll(".bless-kb__para")
      .map((p) => p.text()),
  ).toEqual(["Have your card.", "Find a quiet place."]);
  expect(w.find(".bless-kb__related a").attributes("href")).toBe("/lost");
  await w.findAll(".bless-kb__ask button")[1]!.trigger("click");
  expect(w.emitted("helpful")).toEqual([[false]]);
  expect(w.find("[role=status]").text()).toContain("Thank you");
});
