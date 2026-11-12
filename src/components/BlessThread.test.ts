import { mount } from "@vue/test-utils";
import { h } from "vue";
import BlessThread, { type BlessThreadComment } from "./BlessThread.vue";
import { provideLabels } from "../composables/useLabels";

const chain = (depth: number, id = 0): BlessThreadComment => ({
  id,
  name: `Person ${id}`,
  body: `Comment ${id}`,
  replies: depth ? [chain(depth - 1, id + 1)] : undefined,
});
const comments: BlessThreadComment[] = [
  {
    id: "a",
    name: "Megumi Kato",
    time: "2 h ago",
    body: "First",
    replies: [
      { id: "b", name: "Tomoya Aki", body: "Reply", replies: [{ id: "c", body: "Deeper" }] },
      { id: "d", name: "Eriri Spencer", body: "Second reply" },
    ],
  },
  {
    id: "e",
    name: "Utaha Kasumigaoka",
    body: "Top level",
    collapsed: true,
    replies: [{ id: "f" }],
  },
];

test("BlessThread: nested lists of messages, replies in details that count every descendant", () => {
  const w = mount(BlessThread, { props: { comments } });
  expect(w.findAll(".bless-message")).toHaveLength(6);
  expect(w.find("ol > li .bless-message__content").text()).toBe("First");
  const toggles = w.findAll("summary");
  expect(toggles.map((t) => t.text())).toEqual(["3 replies", "1 reply", "1 reply"]);
  const details = w.findAll("details");
  expect(details[0]!.attributes("open")).toBeDefined();
  expect(details[2]!.attributes("open")).toBeUndefined(); // collapsed: true
});

test("BlessThread: replies past maxDepth stop indenting", () => {
  const w = mount(BlessThread, { props: { comments: [chain(4)], maxDepth: 2 } });
  const lists = w.findAll("ol.bless-thread");
  expect(lists).toHaveLength(5);
  expect(lists.map((l) => l.classes().includes("bless-thread--flat"))).toEqual([
    false,
    false,
    false,
    true,
    true,
  ]);
});

test("BlessThread: slots reach every level with the comment and its depth", () => {
  const w = mount(BlessThread, {
    props: { comments },
    slots: {
      default: ({ comment, depth }: { comment: BlessThreadComment; depth: number }) =>
        `${comment.id}@${depth}`,
      footer: ({ comment }: { comment: BlessThreadComment }) =>
        h("button", { class: "reply" }, `Reply to ${comment.id}`),
    },
  });
  const texts = w.findAll(".bless-message__content").map((c) => c.text());
  expect(texts).toEqual(["a@0", "b@1", "c@2", "d@1", "e@0", "f@1"]);
  expect(w.findAll("button.reply")).toHaveLength(6);
});

test("BlessThread: reply words come from labels or a label pack", () => {
  const Root = {
    setup() {
      provideLabels({ BlessThread: { replies: (n: number) => `${n} balasan` } });
      return () => h(BlessThread, { comments });
    },
  };
  expect(mount(Root).find("summary").text()).toBe("3 balasan");
  const w = mount(BlessThread, {
    props: { comments, labels: { replies: (n: number) => `Show ${n}` } },
  });
  expect(w.findAll("summary").map((s) => s.text())).toEqual(["Show 3", "Show 1", "Show 1"]);
});
