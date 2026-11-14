import { mount } from "@vue/test-utils";
import { lexer } from "marked";
import { defineComponent, h, provide } from "vue";
import { blessLinkKey } from "../composables/useLink";
import BlessMarkdown from "./BlessMarkdown.vue";

const md = (source: string, props = {}) =>
  mount(BlessMarkdown, { props: { source, lexer, ...props } });

test("BlessMarkdown: blocks and inline marks become their elements; # is h2 by default", () => {
  const w = md(
    "# Title\n\nSome **bold**, *em*, ~~old~~ and `code`.\n\n> quote\n\n- a\n- b\n\n3. c\n\n---",
  );
  expect(w.find("h2").text()).toBe("Title");
  expect(w.find("strong").text()).toBe("bold");
  expect(w.find("em").text()).toBe("em");
  expect(w.find("del").text()).toBe("old");
  expect(w.find("p code").text()).toBe("code");
  expect(w.find("blockquote").text()).toBe("quote");
  expect(w.findAll("ul li").map((l) => l.text())).toEqual(["a", "b"]);
  expect(w.find("ol").attributes("start")).toBe("3");
  expect(w.find("hr").exists()).toBe(true);
  expect(md("## Sub", { level: 3 }).find("h4").text()).toBe("Sub");
});

test("BlessMarkdown: raw HTML shows as text and never becomes markup", () => {
  const w = md('<script>alert(1)</script>\n\nHi <img src=x onerror="alert(1)"> there');
  expect(w.find("script").exists()).toBe(false);
  expect(w.find("img").exists()).toBe(false);
  expect(w.text()).toContain("<script>alert(1)</script>");
  expect(w.text()).toContain('<img src=x onerror="alert(1)">');
});

test("BlessMarkdown: only safe links and images; an unsafe one keeps its text", () => {
  const w = md(
    "[ok](https://example.com) [rel](/docs) [mail](mailto:a@b.c) [bad](javascript:alert(1)) [tab](java\tscript:alert(1)) ![pic](data:image/svg+xml,x) ![fine](/a.png)",
  );
  expect(w.findAll("a").map((a) => a.attributes("href"))).toEqual([
    "https://example.com",
    "/docs",
    "mailto:a@b.c",
  ]);
  expect(w.text()).toContain("bad");
  expect(w.findAll("img").map((i) => i.attributes("src"))).toEqual(["/a.png"]);
  expect(w.find('a[href="https://example.com"]').attributes("target")).toBe("_blank");
});

test("BlessMarkdown: a provided router link takes in-app paths", () => {
  const RouterLink = defineComponent({
    props: { to: String },
    setup:
      (p, { slots }) =>
      () =>
        h("a", { "data-to": p.to }, slots.default?.()),
  });
  const w = mount(
    defineComponent({
      setup() {
        provide(blessLinkKey, RouterLink);
        return () => h(BlessMarkdown, { source: "[docs](/docs)", lexer });
      },
    }),
  );
  expect(w.find("a").attributes("data-to")).toBe("/docs");
  expect(w.find("a").text()).toBe("docs");
});

test("BlessMarkdown: GFM tables with alignment, task lists, code blocks with a language", () => {
  const w = md(
    "| a | b |\n|---|--:|\n| 1 | 2 |\n\n- [x] done\n- [ ] todo\n\n```ts\nconst x = 1 < 2;\n```",
  );
  expect(w.findAll("th").map((t) => t.text())).toEqual(["a", "b"]);
  expect(w.findAll("td")[1]!.attributes("style")).toContain("text-align: right");
  const boxes = w.findAll('input[type="checkbox"]');
  expect(boxes.map((b) => (b.element as HTMLInputElement).checked)).toEqual([true, false]);
  expect(boxes[0]!.attributes("disabled")).toBeDefined();
  // each box is named by its task, with no "[x]" left in the text
  const name = (i: number) => w.find(`#${boxes[i]!.attributes("aria-labelledby")}`).text();
  expect([name(0), name(1)]).toEqual(["done", "todo"]);
  expect(w.find("pre code").classes()).toContain("language-ts");
  expect(w.find("pre code").text()).toBe("const x = 1 < 2;");
});

test("BlessMarkdown: entities in text read as their characters", () => {
  expect(md("Tom &amp; Jerry &lt;3").text()).toBe("Tom & Jerry <3");
});
