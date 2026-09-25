import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessBottomTabs from "./BlessBottomTabs.vue";
import BlessInputMask from "./BlessInputMask.vue";
import { applyMask } from "./mask";
import BlessMockup from "./BlessMockup.vue";
import BlessOrderList from "./BlessOrderList.vue";
import BlessPickList from "./BlessPickList.vue";
import BlessSpeedDial from "./BlessSpeedDial.vue";
import BlessTour from "./BlessTour.vue";
import BlessVirtualScroller from "./BlessVirtualScroller.vue";

beforeAll(() => {
  Element.prototype.scrollIntoView = () => {};
});

test("applyMask formats and BlessInputMask emits masked + raw", async () => {
  expect(applyMask("###-####", "0901234")).toBe("090-1234");
  expect(applyMask("###-####", "090-12")).toBe("090-12");
  expect(applyMask("(##) AA", "12ab")).toBe("(12) ab");
  expect(applyMask("###", "a1b2c3d4")).toBe("123");
  const w = mount(BlessInputMask, { props: { mask: "##/##" } });
  await w.find("input").setValue("1234");
  expect(w.emitted("update:modelValue")!.at(-1)![0]).toBe("12/34");
  expect(w.emitted("update:raw")!.at(-1)![0]).toBe("1234");
});

test("applyMask keeps a literal only when typed or followed by a token", () => {
  expect(applyMask("###-####", "123x")).toBe("123");
  expect(applyMask("###-####", "123-")).toBe("123-");
  expect(applyMask("(##) AA", "1")).toBe("(1");
  expect(applyMask("###-####-####", "+81 90-1234-5678")).toBe("819-0123-4567");
});

test("BlessInputMask rewrites the box, keeps the caret, no maxlength, numeric keypad", async () => {
  const w = mount(BlessInputMask, {
    props: { mask: "###-####", modelValue: "123" },
    attachTo: document.body,
  });
  const input = w.find("input");
  const el = input.element as HTMLInputElement;
  expect(input.attributes("maxlength")).toBeUndefined();
  expect(input.attributes("inputmode")).toBe("numeric");
  el.value = "123x";
  await input.trigger("input");
  expect(el.value).toBe("123"); // model unchanged, box still corrected
  el.value = "1239456"; // a digit inserted after "123", caret right after it
  el.setSelectionRange(4, 4);
  await input.trigger("input");
  expect(el.value).toBe("123-9456");
  expect(el.selectionStart).toBe(5);
  expect(
    mount(BlessInputMask, { props: { mask: "AA-##" } })
      .find("input")
      .attributes("inputmode"),
  ).toBeUndefined();
  w.unmount();
});

test("BlessBottomTabs: active, aria-current, dock hides labels", async () => {
  const items = [
    { label: "Home", value: "h", icon: "⌂" },
    { label: "Search", value: "s", icon: "⌕", badge: 2 },
  ];
  const w = mount(BlessBottomTabs, { props: { items, modelValue: "h", inline: true } });
  expect(w.find("[aria-current=page]").text()).toContain("Home");
  await w.findAll("button")[1].trigger("click");
  expect(w.emitted("update:modelValue")![0]).toEqual(["s"]);
  expect(w.emitted("select")![0][0]).toMatchObject({ value: "s" });
  const d = mount(BlessBottomTabs, { props: { items, variant: "dock", inline: true } });
  expect(d.find(".bless-bottom-tabs__label").exists()).toBe(false);
  expect(d.find("button").attributes("aria-label")).toBe("Home");
  expect(w.findAll("button")[1].find(".bless-bottom-tabs__sr").text()).toBe("2 new");
  expect(d.findAll("button")[1].attributes("aria-label")).toBe("Search, 2 new");
  const off = mount(BlessBottomTabs, {
    props: { items: [{ label: "Old", value: "o", href: "/old", disabled: true }], inline: true },
  });
  const ev = new MouseEvent("click", { cancelable: true });
  off.find("a").element.dispatchEvent(ev);
  expect(ev.defaultPrevented).toBe(true);
});

test("BlessSpeedDial: toggles, select closes, Esc closes", async () => {
  const w = mount(BlessSpeedDial, {
    props: { actions: [{ label: "New", value: "n" }], inline: true },
  });
  const fab = w.find(".bless-speed-dial__fab");
  expect(fab.attributes("aria-expanded")).toBe("false");
  await fab.trigger("click");
  expect(w.emitted("update:open")![0]).toEqual([true]);
  await w.setProps({ open: true });
  await w.find(".bless-speed-dial__action").trigger("click");
  expect(w.emitted("select")![0][0]).toMatchObject({ value: "n" });
  expect(w.emitted("update:open")!.at(-1)![0]).toBe(false);
  await w.setProps({ open: true });
  await w.trigger("keydown", { key: "Escape" });
  expect(w.emitted("update:open")!.at(-1)![0]).toBe(false);
});

test("BlessVirtualScroller renders only a window of rows", async () => {
  const items = Array.from({ length: 1000 }, (_, i) => `row ${i}`);
  const w = mount(BlessVirtualScroller, {
    props: { items, itemHeight: 20, height: "100px", overscan: 2 },
    slots: { default: ({ item }: { item: unknown }) => String(item) },
  });
  const vp = w.element as HTMLElement;
  Object.defineProperty(vp, "clientHeight", { value: 100, configurable: true });
  vp.scrollTop = 0;
  await w.trigger("scroll");
  const rows = w.findAll(".bless-virtual__row");
  expect(rows.length).toBeLessThan(20);
  expect(rows[0].text()).toBe("row 0");
  expect(w.find(".bless-virtual__spacer").attributes("style")).toContain("20000px");
  vp.scrollTop = 5000;
  await w.trigger("scroll");
  expect(w.findAll(".bless-virtual__row")[0].text()).toBe("row 248");
});

test("BlessOrderList: buttons, Alt+arrows and drop reorder", async () => {
  const w = mount(BlessOrderList, { props: { modelValue: ["a", "b", "c"] } });
  await w.findAll(".bless-order__btns button")[1].trigger("click"); // a down
  expect(w.emitted("update:modelValue")![0][0]).toEqual(["b", "a", "c"]);
  expect(w.emitted("move")![0]).toEqual([0, 1]);
  await w.setProps({ modelValue: ["b", "a", "c"] });
  await w.findAll(".bless-order__item")[2].trigger("keydown", { key: "ArrowUp", altKey: true });
  expect(w.emitted("update:modelValue")!.at(-1)![0]).toEqual(["b", "c", "a"]);
  await w.setProps({ modelValue: ["b", "c", "a"] });
  const items = w.findAll(".bless-order__item");
  await items[2].trigger("dragstart");
  await items[0].trigger("drop");
  expect(w.emitted("update:modelValue")!.at(-1)![0]).toEqual(["a", "b", "c"]);
});

test("BlessOrderList: rows keep their own text as name, focus follows a button move", async () => {
  const w = mount(
    {
      components: { BlessOrderList },
      data: () => ({ v: ["a", "b", "c"] }),
      template: `<BlessOrderList v-model="v" />`,
    },
    { attachTo: document.body },
  );
  const row = w.find(".bless-order__item");
  expect(row.attributes("aria-label")).toBeUndefined();
  expect(document.getElementById(row.attributes("aria-describedby")!)?.textContent).toMatch(/Alt/);
  expect(w.findAll("[role=list] > *")).toHaveLength(3); // the live region isn't a list item
  expect(w.find(".bless-order__down").attributes("aria-label")).toBe("Move item 1 down");
  await w.find(".bless-order__down").trigger("click"); // a → position 2
  await new Promise((r) => requestAnimationFrame(r));
  expect(document.activeElement).toBe(w.findAll(".bless-order__down")[1].element);
  await w.findAll(".bless-order__down")[1].trigger("click"); // a → last: its down is disabled
  await new Promise((r) => requestAnimationFrame(r));
  expect(document.activeElement).toBe(w.findAll(".bless-order__item")[2].element);
  w.unmount();
});

test("BlessPickList moves selected and all", async () => {
  const w = mount(BlessPickList, {
    props: {
      source: [
        { value: 1, label: "One" },
        { value: 2, label: "Two" },
      ],
      target: [],
    },
  });
  const btns = w.findAll(".bless-picklist__btns button");
  expect(btns[0].attributes("disabled")).toBeDefined();
  await btns[1].trigger("click"); // all right
  expect(w.emitted("update:source")![0][0]).toEqual([]);
  expect(w.emitted("update:target")![0][0]).toHaveLength(2);
});

test("BlessPickList: buttons name the list, focus and an announcement follow the move", async () => {
  const w = mount(
    {
      components: { BlessPickList },
      data: () => ({ s: [{ value: 1, label: "One" }], t: [] }),
      template: `<BlessPickList v-model:source="s" v-model:target="t" />`,
    },
    { attachTo: document.body },
  );
  const btns = w.findAll(".bless-picklist__btns button");
  expect(btns[1].attributes("aria-label")).toBe("Move all to Selected");
  await btns[1].trigger("click");
  await nextTick();
  expect(w.find(".bless-picklist__live").text()).toBe("Moved 1 to Selected");
  expect(document.activeElement).toBe(w.findAll("[role=listbox]")[1].element);
  expect(w.findAll("[role=listbox]")[1].attributes("aria-activedescendant")).toMatch(/-0$/);
  w.unmount();
});

test("BlessMockup variants", () => {
  const b = mount(BlessMockup, { props: { title: "saenai.tv" }, slots: { default: "x" } });
  expect(b.find(".bless-mockup__title").text()).toBe("saenai.tv");
  expect(
    mount(BlessMockup, { props: { type: "phone" } })
      .find(".bless-mockup__notch")
      .exists(),
  ).toBe(true);
});

test("BlessTour: steps, anchor lookup, finish / skip", async () => {
  const t = document.createElement("button");
  t.id = "tour-target";
  document.body.appendChild(t);
  const w = mount(BlessTour, {
    props: { open: true, steps: [{ target: "#tour-target", text: "one" }, { text: "two" }] },
    attachTo: document.body,
  });
  await nextTick();
  const panel = document.querySelector(".bless-tour")!;
  expect(panel.textContent).toContain("one");
  expect(panel.textContent).toContain("1 / 2");
  expect(document.querySelector(".bless-tour__spot--none")).toBeNull();
  const next = [...panel.querySelectorAll("button")].find((b) => b.textContent!.trim() === "Next")!;
  next.click();
  expect(w.emitted("update:step")![0]).toEqual([1]);
  await w.setProps({ step: 1 });
  await nextTick();
  expect(document.querySelector(".bless-tour__spot--none")).not.toBeNull();
  expect(document.querySelector(".bless-tour--centred")).not.toBeNull();
  const done = [...document.querySelectorAll<HTMLButtonElement>(".bless-tour button")].find(
    (b) => b.textContent!.trim() === "Done",
  )!;
  done.click();
  expect(w.emitted("finish")).toHaveLength(1);
  expect(w.emitted("update:open")!.at(-1)![0]).toBe(false);
  w.unmount();
});

test("BlessKnob: native range drives the model, dial angle follows", async () => {
  const { default: BlessKnob } = await import("./BlessKnob.vue");
  const w = mount(BlessKnob, { props: { modelValue: 50, min: 0, max: 100 } });
  expect(w.find("input[type=range]").attributes("aria-valuetext")).toBe("50");
  expect(w.find(".bless-knob__dial").attributes("style")).toContain("--_fill: 135deg");
  await w.find("input").setValue("75");
  expect(w.emitted("update:modelValue")![0]).toEqual([75]);
});

test("BlessKnob: a drag past max holds at max, 0.1 steps have no float noise, labels", async () => {
  const { default: BlessKnob } = await import("./BlessKnob.vue");
  const w = mount(BlessKnob, { props: { modelValue: 100 } });
  const dial = w.find(".bless-knob__dial");
  const el = dial.element as HTMLElement;
  el.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect;
  el.hasPointerCapture = () => true;
  // just left of the bottom gap: the min end of the arc
  // jsdom has no PointerEvent: a MouseEvent with a pointerId stands in
  const move = async (target: Element, deg: number) => {
    const e = new MouseEvent("pointermove", {
      clientX: 50 + 40 * Math.cos((deg * Math.PI) / 180),
      clientY: 50 + 40 * Math.sin((deg * Math.PI) / 180),
    });
    Object.defineProperty(e, "pointerId", { value: 1 });
    target.dispatchEvent(e);
    await nextTick();
  };
  await move(el, 100);
  expect(w.emitted("update:modelValue") ?? []).not.toContainEqual([0]); // held at max
  await move(el, 0); // back on the arc, three-quarters round: moves normally
  expect(w.emitted("update:modelValue")!.at(-1)![0]).toBeGreaterThan(60);
  const f = mount(BlessKnob, { props: { modelValue: 0, max: 1, step: 0.1 } });
  const fd = f.find(".bless-knob__dial").element as HTMLElement;
  fd.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect;
  fd.hasPointerCapture = () => true;
  for (let d = 100; d <= 440; d += 7) {
    await move(fd, d);
    const v = f.emitted("update:modelValue")?.at(-1)?.[0] as number | undefined;
    if (v != null) expect(String(v).length).toBeLessThanOrEqual(3);
    if (v != null) await f.setProps({ modelValue: v });
  }
  expect(w.find("input").attributes("aria-label")).toBe("Value");
  expect(w.find("label").exists()).toBe(false);
  const l = mount(BlessKnob, { props: { label: "Gain" } });
  expect(l.find("input").attributes("aria-label")).toBeUndefined();
  expect(l.find("label").text()).toBe("Gain");
});

test("BlessWatermarkOverlay tiles an SVG with the text", async () => {
  const C = (await import("./BlessWatermarkOverlay.vue")).default;
  const w = mount(C, { props: { text: "DRAFT <1>" }, slots: { default: "<p>body</p>" } });
  const layer = w.find(".bless-wm-overlay__layer");
  expect(layer.attributes("aria-hidden")).toBe("true");
  expect(decodeURIComponent(layer.attributes("style")!)).toContain("DRAFT &lt;1&gt;");
  // the tile is a mask; the colour is the layer's own, so currentColor follows the theme
  expect(decodeURIComponent(layer.attributes("style")!)).toContain('fill="#000"');
  expect((layer.element as HTMLElement).style.backgroundColor).toBe("currentcolor");
});

test("BlessSignaturePad: strokes set the model, clear resets", async () => {
  const { default: C } = await import("./BlessSignaturePad.vue");
  globalThis.ResizeObserver = class {
    observe() {}
    disconnect() {}
    unobserve() {}
  } as unknown as typeof ResizeObserver;
  HTMLCanvasElement.prototype.getContext = (() => ({
    scale() {},
    beginPath() {},
    moveTo() {},
    lineTo() {},
    stroke() {},
    clearRect() {},
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.toDataURL = () => "data:image/png;base64,xyz";
  HTMLCanvasElement.prototype.setPointerCapture = () => {};
  const w = mount(C, { attachTo: document.body });
  const c = w.find("canvas").element;
  const ev = (type: string) =>
    c.dispatchEvent(new MouseEvent(type, { clientX: 5, clientY: 5, bubbles: true }));
  ev("pointerdown");
  ev("pointermove");
  ev("pointerup");
  await nextTick();
  expect(w.emitted("update:modelValue")![0]).toEqual(["data:image/png;base64,xyz"]);
  expect(w.emitted("end")).toHaveLength(1);
  await w.find("button").trigger("click");
  expect(w.emitted("update:modelValue")!.at(-1)![0]).toBe("");
  w.unmount();
});

test("BlessSignaturePad: a resize draws the signature back; unmount stops observing", async () => {
  const { default: C } = await import("./BlessSignaturePad.vue");
  let resized = () => {};
  let disconnected = false;
  globalThis.ResizeObserver = class {
    constructor(cb: () => void) {
      resized = cb;
    }
    observe() {}
    disconnect() {
      disconnected = true;
    }
    unobserve() {}
  } as unknown as typeof ResizeObserver;
  const drawn: unknown[] = [];
  HTMLCanvasElement.prototype.getContext = (() => ({
    scale() {},
    drawImage: (img: unknown) => drawn.push(img),
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  const RealImage = globalThis.Image;
  globalThis.Image = class {
    onload = () => {};
    set src(_: string) {
      queueMicrotask(() => this.onload());
    }
  } as unknown as typeof Image;
  try {
    const w = mount(C, { props: { modelValue: "data:image/png;base64,xyz" } });
    await Promise.resolve(); // the first fit draws it once
    drawn.length = 0;
    resized(); // a phone rotates: the canvas is resized, which wipes it
    await Promise.resolve();
    expect(drawn).toHaveLength(1);
    w.unmount();
    expect(disconnected).toBe(true);
  } finally {
    globalThis.Image = RealImage;
  }
});

test("BlessQrCode renders one path square per dark module", async () => {
  const { default: C } = await import("./BlessQrCode.vue");
  const { encode } = await import("uqr");
  const m = encode("blessing").data;
  const w = mount(C, { props: { matrix: m, value: "blessing", border: 1 } });
  const dark = m.flat().filter(Boolean).length;
  expect((w.find("path").attributes("d")!.match(/M/g) ?? []).length).toBe(dark);
  expect(w.find("svg").attributes("viewBox")).toBe(`0 0 ${m.length + 2} ${m.length + 2}`);
  expect(w.find("svg").attributes("aria-label")).toBe("QR code: blessing");
});

test("BlessEditor toolbar drives the Tiptap editor", async () => {
  const { default: C } = await import("./BlessEditor.vue");
  const { Editor } = await import("@tiptap/vue-3");
  const { default: StarterKit } = await import("@tiptap/starter-kit");
  const editor = new Editor({ extensions: [StarterKit], content: "<p>hi</p>" });
  const w = mount(C, { props: { editor, tools: ["bold", "|", "undo"] } });
  expect(w.findAll(".bless-editor__tool")).toHaveLength(2);
  expect(w.find('[aria-label="Undo"]').attributes("disabled")).toBeDefined();
  editor.commands.selectAll();
  await w.find('[aria-label="Bold"]').trigger("click");
  expect(editor.getHTML()).toContain("<strong>hi</strong>");
  expect(editor.isActive("bold")).toBe(true);
  editor.destroy();
});
