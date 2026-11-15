import { mount } from "@vue/test-utils";
import BlessSources from "./BlessSources.vue";

const sources = [
  {
    title: "Home studio guide",
    url: "https://www.example.com/studio",
    snippet: "Treat the room first.",
  },
  { title: "Mic test", url: "https://audio.example.org/mics", site: "Audio Lab" },
];

test("BlessSources: a numbered list of links with the site, ids for marks, and a named region", () => {
  const w = mount(BlessSources, { props: { sources, id: "ep41" } });
  const items = w.findAll("li");
  expect(items.map((i) => i.attributes("id"))).toEqual(["ep41-1", "ep41-2"]);
  expect(items[0]!.find("a").attributes("href")).toBe("https://www.example.com/studio");
  expect(items[0]!.find(".bless-sources__site").text()).toBe("example.com");
  expect(items[1]!.find(".bless-sources__site").text()).toBe("Audio Lab");
  expect(items[0]!.find(".bless-sources__snippet").text()).toBe("Treat the room first.");
  expect(w.attributes("aria-labelledby")).toBe("ep41-title");
  expect(w.find("#ep41-title").text()).toBe("Sources");
});

test("BlessSources: an automatic id, a URL that does not parse, and labels translate", () => {
  const w = mount(BlessSources, {
    props: { sources: [{ title: "x", url: "not a url" }], labels: { title: "Sumber" } },
  });
  expect(w.find("li").attributes("id")).toMatch(/^bless-src-.+-1$/);
  expect(w.find(".bless-sources__site").text()).toBe("not a url");
  expect(w.find(".bless-sources__title").text()).toBe("Sumber");
});
