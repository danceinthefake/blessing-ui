<script setup lang="ts">
import { computed, h, useId, type VNodeChild } from "vue";
// types only: the library never loads marked itself, so an app that does not use this needs no marked
import type { Token, Tokens } from "marked";
import { useLink } from "../composables/useLink";

defineOptions({ name: "BlessMarkdown" });

const props = withDefaults(
  defineProps<{
    /** the Markdown text */
    source: string;
    /** turns the text into tokens: pass `lexer` from marked (`import { lexer } from "marked"`) */
    lexer: (source: string) => Token[];
    /** the HTML level of a `#` heading; deeper ones follow, up to h6 */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
  }>(),
  { level: 2 },
);

const link = useLink();

// Only these schemes may be a link or an image source. A relative path has no scheme. Control
// characters and spaces are removed first, so "java\tscript:" is caught too.
const SAFE = /^(https?|mailto|tel):/i;
function safeUrl(url: string): string | undefined {
  const bare = url.replace(/[\u0000- \u007f]/g, "");
  return !/^[a-z][a-z0-9+.-]*:/i.test(bare) || SAFE.test(bare) ? url : undefined;
}
const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" };
const decode = (t: string) => t.replace(/&(amp|lt|gt|quot|#39);/g, (_, e: string) => ENTITIES[e]!);

const inline = (tokens: Token[] | undefined): VNodeChild[] => (tokens ?? []).map(node);
function node(t: Token): VNodeChild {
  switch (t.type) {
    case "heading":
      return h(`h${Math.min(6, props.level + t.depth - 1)}`, inline(t.tokens));
    case "paragraph":
      return h("p", inline(t.tokens));
    case "text":
      return t.tokens ? inline(t.tokens) : decode(t.text);
    case "escape":
      return t.text;
    case "strong":
      return h("strong", inline(t.tokens));
    case "em":
      return h("em", inline(t.tokens));
    case "del":
      return h("del", inline(t.tokens));
    case "codespan":
      return h("code", decode(t.text));
    case "br":
      return h("br");
    case "hr":
      return h("hr");
    case "code":
      return h("pre", h("code", { class: t.lang ? `language-${t.lang}` : undefined }, t.text));
    case "blockquote":
      return h("blockquote", inline(t.tokens));
    case "list": {
      const l = t as Tokens.List;
      const items = l.items.map((it) => {
        if (!it.task) return h("li", inline(it.tokens));
        // the item's text names its checkbox, so a screen reader hears the task and its state
        const id = `${uid}-task-${tasks++}`;
        return h("li", { class: "bless-markdown__task" }, [
          h("input", {
            type: "checkbox",
            checked: it.checked,
            disabled: true,
            "aria-labelledby": id,
          }),
          h("span", { id }, inline(it.tokens)),
        ]);
      });
      return l.ordered
        ? h("ol", { start: l.start !== 1 && l.start !== "" ? l.start : undefined }, items)
        : h("ul", items);
    }
    case "link": {
      const href = safeUrl(t.href);
      if (!href) return h("span", inline(t.tokens));
      const { is, attrs } = link(href, /^(https?:)?\/\//i.test(href));
      const a = { ...attrs, title: t.title ?? undefined };
      // an element takes its children as an array, a router link as a slot
      return typeof is === "string" ? h(is, a, inline(t.tokens)) : h(is, a, () => inline(t.tokens));
    }
    case "image": {
      const src = safeUrl(t.href);
      return src
        ? h("img", { src, alt: t.text, title: t.title ?? undefined, loading: "lazy" })
        : t.text;
    }
    case "table": {
      const tb = t as Tokens.Table;
      const cell = (tag: "th" | "td", c: Tokens.TableCell) =>
        h(tag, { style: c.align ? { textAlign: c.align } : undefined }, inline(c.tokens));
      return h("div", { class: "bless-markdown__table" }, [
        h("table", [
          h(
            "thead",
            h(
              "tr",
              tb.header.map((c) => cell("th", c)),
            ),
          ),
          h(
            "tbody",
            tb.rows.map((r) =>
              h(
                "tr",
                r.map((c) => cell("td", c)),
              ),
            ),
          ),
        ]),
      ]);
    }
    case "space":
    case "def":
    case "checkbox": // a task item draws its own box
      return null;
    // raw HTML and anything unknown show as the text that was written, never as markup
    default:
      return "text" in t ? (t.text as string) : t.raw;
  }
}
const uid = useId();
let tasks = 0;
const content = computed(() => {
  tasks = 0;
  return inline(props.lexer(props.source));
});
const Content = () => content.value;
</script>

<template>
  <div class="bless-markdown"><Content /></div>
</template>

<style>
.bless-markdown {
  font-family: var(--bless-font-sans);
  line-height: var(--bless-leading-normal);
  color: var(--bless-color-text);
  overflow-wrap: anywhere;
}
.bless-markdown > :first-child {
  margin-block-start: 0;
}
.bless-markdown > :last-child {
  margin-block-end: 0;
}
.bless-markdown :is(p, ul, ol, blockquote, pre, hr, .bless-markdown__table) {
  margin-block: 0 var(--bless-space-4);
}
.bless-markdown :is(h1, h2, h3, h4, h5, h6) {
  margin-block: var(--bless-space-6) var(--bless-space-3);
  line-height: var(--bless-leading-tight);
  font-weight: var(--bless-font-weight-bold);
}
.bless-markdown h1 {
  font-size: var(--bless-text-xl);
}
.bless-markdown h2 {
  font-size: var(--bless-text-lg);
}
.bless-markdown :is(h3, h4, h5, h6) {
  font-size: var(--bless-text-md);
}
.bless-markdown :is(ul, ol) {
  padding-inline-start: var(--bless-space-6);
}
/* set, not assumed: CSS resets (Tailwind's preflight, VitePress) remove list markers */
.bless-markdown ul {
  list-style: disc;
}
.bless-markdown ol {
  list-style: decimal;
}
.bless-markdown li + li {
  margin-block-start: var(--bless-space-1);
}
.bless-markdown .bless-markdown__task {
  list-style: none;
}
/* the box takes the place of the bullet, inside the list's own indent */
.bless-markdown__task > input {
  margin: 0 var(--bless-space-2) 0 calc(-1 * var(--bless-space-6) + var(--bless-space-1));
  vertical-align: -0.1em;
}
.bless-markdown a {
  color: var(--bless-color-accent-text);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.bless-markdown blockquote {
  padding-inline-start: var(--bless-space-4);
  border-inline-start: 3px solid var(--bless-color-rule);
  color: var(--bless-color-text-muted);
}
.bless-markdown :is(code, pre) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.9em;
}
.bless-markdown :not(pre) > code {
  padding: 0.1em 0.35em;
  background: var(--bless-color-surface);
}
.bless-markdown pre {
  overflow-x: auto;
  padding: var(--bless-space-3) var(--bless-space-4);
  background: var(--bless-color-surface);
}
.bless-markdown hr {
  border: 0;
  border-block-start: var(--bless-border-width) solid var(--bless-color-rule);
}
.bless-markdown img {
  max-inline-size: 100%;
  block-size: auto;
}
.bless-markdown__table {
  overflow-x: auto;
}
.bless-markdown table {
  border-collapse: collapse;
}
.bless-markdown :is(th, td) {
  padding: var(--bless-space-2) var(--bless-space-3);
  border-block-end: var(--bless-border-width) solid var(--bless-color-rule);
  text-align: start;
}
.bless-markdown th {
  border-block-end-color: var(--bless-color-text);
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
}
</style>
