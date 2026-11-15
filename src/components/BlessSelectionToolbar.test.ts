import { mount } from "@vue/test-utils";
import BlessSelectionToolbar from "./BlessSelectionToolbar.vue";

const actions = [
  { id: "bold", label: "Bold", icon: "B" },
  { id: "quote", label: "Quote" },
];

beforeAll(() => {
  Range.prototype.getBoundingClientRect = () =>
    ({ left: 100, top: 200, width: 40, bottom: 220 }) as DOMRect;
});

function select(node: Node, from: number, to: number) {
  const r = document.createRange();
  r.setStart(node, from);
  r.setEnd(node, to);
  getSelection()!.removeAllRanges();
  getSelection()!.addRange(r);
  document.dispatchEvent(new Event("selectionchange"));
}

test("BlessSelectionToolbar: shows above a selection in the area, and an action gets the text", async () => {
  const w = mount(BlessSelectionToolbar, {
    props: { actions },
    slots: { default: "<p>Hello podcast world</p>" },
    attachTo: document.body,
  });
  const bar = w.find("[role=toolbar]");
  expect((bar.element as HTMLElement).style.display).toBe("none");
  select(w.find("p").element.firstChild!, 6, 13);
  await w.vm.$nextTick();
  expect((bar.element as HTMLElement).style.display).toBe("");
  expect(bar.attributes("style")).toContain("left: 120px");
  expect(bar.attributes("style")).toContain("top: 192px");
  expect(bar.attributes("aria-label")).toBe("Text actions");
  const [bold, quote] = w.findAll("button");
  expect(bold!.attributes("aria-label")).toBe("Bold");
  expect(quote!.text()).toBe("Quote");
  await quote!.trigger("click");
  const [id, sel] = w.emitted("action")![0]! as [string, { text: string; range: Range }];
  expect(id).toBe("quote");
  expect(sel.text).toBe("podcast");
  expect(sel.range.toString()).toBe("podcast");
  expect((bar.element as HTMLElement).style.display).toBe("none");
  w.unmount();
});

test("BlessSelectionToolbar: ignores a selection outside the area or too short, and Escape hides it", async () => {
  const outside = document.createElement("p");
  outside.textContent = "elsewhere";
  document.body.append(outside);
  const w = mount(BlessSelectionToolbar, {
    props: { actions, minLength: 3 },
    slots: { default: "<p>ab cdef</p>" },
    attachTo: document.body,
  });
  const shown = () => (w.find("[role=toolbar]").element as HTMLElement).style.display !== "none";
  select(outside.firstChild!, 0, 4);
  await w.vm.$nextTick();
  expect(shown()).toBe(false);
  select(w.find("p").element.firstChild!, 0, 2);
  await w.vm.$nextTick();
  expect(shown()).toBe(false);
  select(w.find("p").element.firstChild!, 3, 7);
  await w.vm.$nextTick();
  expect(shown()).toBe(true);
  await w.trigger("keydown", { key: "Escape" });
  expect(shown()).toBe(false);
  w.unmount();
  outside.remove();
});
