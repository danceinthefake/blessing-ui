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
