import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessNodeGraph, { type BlessGraphNode } from "./BlessNodeGraph.vue";
import type { GraphEdge } from "../composables/graph";

const N = (): BlessGraphNode[] => [
  { id: "a", x: 0, y: 0, label: "Start" },
  { id: "b", x: 300, y: 0, label: "Build" },
  { id: "c", x: 300, y: 120, label: "Test" },
];
let w: VueWrapper;
const mk = (props: Record<string, unknown> = {}) => {
  w = mount(BlessNodeGraph, {
    props: {
      nodes: N(),
      edges: [{ from: "a", to: "b" }] as GraphEdge[],
      "onUpdate:nodes": (v: unknown) => w.setProps({ nodes: v as BlessGraphNode[] }),
      "onUpdate:edges": (v: unknown) => w.setProps({ edges: v as GraphEdge[] }),
      "onUpdate:selected": (v: unknown) => w.setProps({ selected: v as string | null }),
      ...props,
    },
    attachTo: document.body,
  });
  return w;
};
afterEach(() => w?.unmount());
beforeAll(() => {
  Element.prototype.setPointerCapture = () => {};
});
const node = (id: string) => w.find(`[data-node-id="${id}"]`);
const prop = (k: string) => (w.props() as Record<string, unknown>)[k];
const nodes = () => prop("nodes") as BlessGraphNode[];
const edges = () => prop("edges") as GraphEdge[];
const live = () => w.find(".bless-graph__live").text();
const key = async (id: string, k: string, extra: object = {}) => {
  await node(id).trigger("keydown", { key: k, ...extra });
  await nextTick();
};
const ptr = async (el: Element, type: string, x = 0, y = 0) => {
  el.dispatchEvent(
    Object.assign(new MouseEvent(type, { clientX: x, clientY: y, bubbles: true }), {
      pointerId: 1,
    }),
  );
  await nextTick();
};

test("one node and one link are drawn, each node named with what it connects to", () => {
  mk();
  expect(w.findAll("[data-node-id]")).toHaveLength(3);
  expect(w.findAll(".bless-graph__edge")).toHaveLength(1);
  expect(node("a").attributes("aria-label")).toBe("Start. Links to Build");
  expect(node("b").attributes("aria-label")).toBe("Build. Linked from Start");
  expect(node("a").attributes("aria-roledescription")).toBe("node");
});

test("one node is in the tab order, and it follows the selection", async () => {
  mk();
  expect(node("a").attributes("tabindex")).toBe("0");
  expect(node("b").attributes("tabindex")).toBe("-1");
  await node("c").trigger("pointerdown");
  await nextTick();
  expect(node("c").attributes("tabindex")).toBe("0");
});

test("dragging moves a node by the pointer distance divided by the zoom, and snaps", async () => {
  mk({ snap: 10, view: { x: 0, y: 0, zoom: 2 } });
  const el = node("b").element;
  await ptr(el, "pointerdown", 100, 100);
  await ptr(el, "pointermove", 147, 100); // 47px on screen = 23.5 in the world -> 323.5 -> 320
  await ptr(el, "pointerup", 147, 100);
  expect(nodes().find((n) => n.id === "b")).toMatchObject({ x: 320, y: 0 });
  expect(w.emitted("move")![0]).toEqual(["b", 320, 0]);
});

test("a read-only graph selects but never drags", async () => {
  mk({ editable: false });
  const el = node("b").element;
  await ptr(el, "pointerdown", 0, 0);
  await ptr(el, "pointermove", 80, 0);
  expect(nodes().find((n) => n.id === "b")!.x).toBe(300);
  expect(prop("selected")).toBe("b");
  expect(w.find(".bless-graph__port--out").exists()).toBe(false);
});

test("arrow keys move the focused node, Shift further", async () => {
  mk();
  await key("c", "ArrowRight");
  await key("c", "ArrowDown", { shiftKey: true });
  expect(nodes().find((n) => n.id === "c")).toMatchObject({ x: 308, y: 152 });
});

test("L, arrows, Enter links two nodes and announces it; Enter on an existing link removes it", async () => {
  mk();
  await key("a", "l");
  expect(live()).toContain("Linking from Start");
  await key("a", "ArrowRight"); // -> b
  expect(live()).toBe("Unlink Start to Build? Enter");
  await key("b", "ArrowRight"); // -> c
  expect(live()).toBe("Link Start to Test? Enter");
  expect(w.find(".bless-graph__node--target").attributes("data-node-id")).toBe("c");
  await key("c", "Enter");
  expect(edges()).toContainEqual({ from: "a", to: "c" });
  expect(live()).toBe("Linked Start to Test");
  expect(w.emitted("connect")![0]).toEqual([{ from: "a", to: "c" }]);

  await key("a", "l");
  await key("a", "ArrowRight"); // b, already linked
  await key("b", "Enter");
  expect(edges().some((e) => e.from === "a" && e.to === "b")).toBe(false);
  expect(w.emitted("disconnect")).toHaveLength(1);
});

test("Escape cancels a link; a loop is refused when acyclic", async () => {
  mk({ acyclic: true });
  await key("a", "l");
  await key("a", "Escape");
  expect(live()).toBe("Cancelled");
  expect(edges()).toHaveLength(1);
  await key("b", "l");
  await key("b", "ArrowLeft"); // wraps back to a (target list order: a, b, c)
  await key("a", "Enter");
  expect(edges()).toHaveLength(1);
  expect(live()).toBe("Not linked: Start already leads to Build");
});

test("pulling from the output port onto another node links them", async () => {
  mk();
  const port = node("b").find(".bless-graph__port--out").element;
  document.elementsFromPoint = () => [node("c").element];
  await ptr(port, "pointerdown", 460, 28);
  expect(w.find(".bless-graph__edge--preview").exists()).toBe(true);
  await ptr(port, "pointerup", 400, 150);
  expect(edges()).toContainEqual({ from: "b", to: "c" });
  expect(w.find(".bless-graph__edge--preview").exists()).toBe(false);
});

test("Delete removes the node and its links; focus goes to a neighbour", async () => {
  mk();
  await key("b", "Delete");
  expect(nodes().map((n) => n.id)).toEqual(["a", "c"]);
  expect(edges()).toEqual([]);
  expect(w.emitted("remove")![0]).toEqual(["b"]);
  expect(live()).toBe("Removed Build");
});

test("clicking a link selects it and Delete on the canvas removes it", async () => {
  mk();
  await w.find(".bless-graph__edge-hit").trigger("pointerdown");
  expect(w.find(".bless-graph__edge--sel").exists()).toBe(true);
  await w.find(".bless-canvas").trigger("keydown", { key: "Delete" });
  expect(edges()).toEqual([]);
  expect(w.emitted("disconnect")).toHaveLength(1);
});

test("labels translate the announcements and node names", async () => {
  mk({
    labels: {
      node: (l: string) => `Simpul ${l}`,
      linkFrom: (a: string) => `Menautkan dari ${a}`,
    },
  });
  expect(node("a").attributes("aria-label")).toBe("Simpul Start");
  await key("a", "l");
  expect(live()).toBe("Menautkan dari Start");
});
