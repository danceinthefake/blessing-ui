import { mount } from "@vue/test-utils";
import { h, nextTick, ref } from "vue";
import BlessBlockUI from "./BlessBlockUI.vue";
import BlessChip from "./BlessChip.vue";
import BlessCompare from "./BlessCompare.vue";
import BlessConfirmPopup from "./BlessConfirmPopup.vue";
import BlessDataView from "./BlessDataView.vue";
import BlessDeferredContent from "./BlessDeferredContent.vue";
import BlessFieldset from "./BlessFieldset.vue";
import BlessFloatLabel from "./BlessFloatLabel.vue";
import BlessInplace from "./BlessInplace.vue";
import BlessInput from "./BlessInput.vue";
import BlessInputNumber from "./BlessInputNumber.vue";
import BlessInputTags from "./BlessInputTags.vue";
import BlessMeterGroup from "./BlessMeterGroup.vue";
import BlessPanel from "./BlessPanel.vue";
import BlessPasswordInput from "./BlessPasswordInput.vue";
import BlessSplitButton from "./BlessSplitButton.vue";
import BlessStepper from "./BlessStepper.vue";
import BlessToolbar from "./BlessToolbar.vue";
import { useAnimateOnScroll } from "../composables/useAnimateOnScroll";
import { stubPopover } from "../test/popover";

beforeAll(stubPopover);

test("BlessChip removable emits", async () => {
  const w = mount(BlessChip, { props: { label: "Megumi", removable: true } });
  await w.find(".bless-chip__remove").trigger("click");
  expect(w.emitted("remove")).toHaveLength(1);
  expect(w.find(".bless-chip__remove").attributes("aria-label")).toBe("Remove Megumi");
});

test("BlessInputNumber: buttons, clamp, arrows, format on blur", async () => {
  const w = mount(BlessInputNumber, {
    props: {
      modelValue: 5,
      min: 0,
      max: 10,
      step: 5,
      format: { style: "currency", currency: "JPY" },
      locale: "ja-JP",
    },
  });
  await w.findAll("button")[1].trigger("click");
  expect(w.emitted("update:modelValue")!.at(-1)![0]).toBe(10);
  await w.setProps({ modelValue: 10 });
  expect(w.findAll("button")[1].attributes("disabled")).toBeDefined();
  await w.find("input").trigger("keydown", { key: "ArrowDown" });
  expect(w.emitted("update:modelValue")!.at(-1)![0]).toBe(5);
  expect((w.find("input").element as HTMLInputElement).value).toBe("￥5");
  await w.find("input").trigger("focus");
  expect((w.find("input").element as HTMLInputElement).value).toBe("5");
});

test("BlessPasswordInput toggles type", async () => {
  const w = mount(BlessPasswordInput, { props: { modelValue: "abc", meter: true } });
  expect(w.find("input").attributes("type")).toBe("password");
  await w.find(".bless-password__toggle").trigger("click");
  expect(w.find("input").attributes("type")).toBe("text");
  expect(w.find(".bless-pwmeter").exists()).toBe(true);
});

test("BlessStepper: panel slot follows step, next/finish", async () => {
  const w = mount(BlessStepper, {
    props: { steps: [{ label: "A" }, { label: "B" }], modelValue: 0 },
    slots: { default: ({ step }: { step: { label: string } }) => `panel ${step.label}` },
  });
  expect(w.find(".bless-stepper__panel").text()).toBe("panel A");
  const next = w.findAll(".bless-stepper__actions button")[1];
  await next.trigger("click");
  expect(w.emitted("update:modelValue")![0]).toEqual([1]);
  await w.setProps({ modelValue: 1 });
  expect(w.find(".bless-stepper__panel").text()).toBe("panel B");
  await w.findAll(".bless-stepper__actions button")[1].trigger("click");
  expect(w.emitted("finish")).toHaveLength(1);
});

test("BlessInputTags: Enter adds, Backspace removes, no duplicates", async () => {
  const w = mount(BlessInputTags, { props: { modelValue: ["a"] } });
  const i = w.find("input");
  await i.setValue("b");
  await i.trigger("keydown", { key: "Enter" });
  expect(w.emitted("update:modelValue")![0][0]).toEqual(["a", "b"]);
  await w.setProps({ modelValue: ["a", "b"] });
  await i.setValue("a");
  await i.trigger("keydown", { key: "Enter" });
  expect(w.emitted("update:modelValue")).toHaveLength(1);
  await i.setValue("");
  await i.trigger("keydown", { key: "Backspace" });
  expect(w.emitted("update:modelValue")!.at(-1)![0]).toEqual(["a"]);
});

test("BlessToolbar / BlessFloatLabel / BlessFieldset / BlessPanel render + toggle", async () => {
  expect(mount(BlessToolbar, { slots: { start: "s", end: "e" } }).attributes("role")).toBe(
    "toolbar",
  );
  const f = mount(BlessFloatLabel, {
    props: { label: "Name", for: "x" },
    slots: { default: () => h(BlessInput, { id: "x", placeholder: " " }) },
  });
  expect(f.find("label").attributes("for")).toBe("x");
  const fs = mount(BlessFieldset, {
    props: { legend: "L", toggleable: true },
    slots: { default: "body" },
  });
  await fs.find(".bless-fieldset__toggle").trigger("click");
  expect(fs.emitted("update:collapsed")![0]).toEqual([true]);
  const p = mount(BlessPanel, {
    props: { title: "T", toggleable: true },
    slots: { default: "body", footer: "f" },
  });
  expect(p.find("h3").text()).toBe("T");
  await p.find(".bless-panel__toggle").trigger("click");
  expect(p.emitted("update:collapsed")![0]).toEqual([true]);
});

test("BlessMeterGroup sizes segments by share", () => {
  const w = mount(BlessMeterGroup, {
    props: {
      segments: [
        { label: "a", value: 30 },
        { label: "b", value: 10 },
      ],
      max: 100,
    },
  });
  const segs = w.findAll(".bless-metergroup__seg");
  expect(segs[0].attributes("style")).toContain("--_p: 30%");
  expect(w.find('[role="meter"]').attributes("aria-valuenow")).toBe("40");
  expect(w.findAll(".bless-metergroup__legend li")).toHaveLength(2);
});

test("BlessSplitButton: main click and menu select", async () => {
  const w = mount(BlessSplitButton, {
    props: { label: "Save", items: [{ label: "Save as", value: "as" }] },
  });
  await w.findAll(".bless-button")[0].trigger("click");
  expect(w.emitted("click")).toHaveLength(1);
  expect(w.find(".bless-split__more").attributes("aria-label")).toBe("More actions");
});

test("BlessBlockUI inerts content, BlessInplace swaps, BlessDeferredContent defers", async () => {
  const b = mount(BlessBlockUI, {
    props: { blocked: true },
    slots: { default: "<button>x</button>" },
  });
  expect(b.find(".bless-block__content").attributes("inert")).toBeDefined();
  expect(b.find('[role="status"]').exists()).toBe(true);
  const i = mount(BlessInplace, {
    props: { closable: true },
    slots: { display: "view", content: "<input>" },
  });
  await i.find(".bless-inplace__display").trigger("click");
  expect(i.emitted("update:active")![0]).toEqual([true]);
  await i.setProps({ active: true });
  expect(i.find("input").exists()).toBe(true);
  await i.find(".bless-inplace__close").trigger("click");
  expect(i.emitted("close")).toHaveLength(1);
  let cb: (e: { isIntersecting: boolean }[]) => void = () => {};
  globalThis.IntersectionObserver = class {
    constructor(f: typeof cb) {
      cb = f;
    }
    observe() {}
    disconnect() {}
    unobserve() {}
  } as unknown as typeof IntersectionObserver;
  const d = mount(BlessDeferredContent, { slots: { default: "heavy", placeholder: "…" } });
  expect(d.text()).toBe("…");
  cb([{ isIntersecting: true }]);
  await nextTick();
  expect(d.text()).toBe("heavy");
  expect(d.emitted("load")).toHaveLength(1);
});

test("BlessConfirmPopup emits confirm / cancel and closes", async () => {
  const w = mount(BlessConfirmPopup, {
    props: { message: "Sure?", open: true },
    slots: { trigger: "<button>go</button>" },
  });
  const btns = w.findAll(".bless-confirm__actions button");
  await btns[1].trigger("click");
  expect(w.emitted("confirm")).toHaveLength(1);
  expect(w.emitted("update:open")!.at(-1)![0]).toBe(false);
});

test("BlessCompare: range drives clip position", async () => {
  const w = mount(BlessCompare, {
    props: { modelValue: 30 },
    slots: { before: "<div>a</div>", after: "<div>b</div>" },
  });
  expect(w.attributes("style")).toContain("--_p: 30%");
  await w.find("input[type=range]").setValue("70");
  expect(w.emitted("update:modelValue")![0]).toEqual([70]);
});

test("BlessDataView: layout switch and pagination", async () => {
  const items = Array.from({ length: 7 }, (_, i) => ({ id: i }));
  const w = mount(BlessDataView, {
    props: { items, pageSize: 3, rowKey: (r: unknown) => (r as { id: number }).id },
    slots: { default: ({ item }: { item: unknown }) => `#${(item as { id: number }).id}` },
  });
  expect(w.findAll(".bless-dataview__item")).toHaveLength(3);
  expect(w.find(".bless-pagination").exists()).toBe(true);
  await w.findAll(".bless-toggle")[1].trigger("click");
  expect(w.emitted("update:layout")![0]).toEqual(["grid"]);
});

test("useAnimateOnScroll flips visible", async () => {
  let cb: (e: { isIntersecting: boolean }[]) => void = () => {};
  globalThis.IntersectionObserver = class {
    constructor(f: typeof cb) {
      cb = f;
    }
    observe() {}
    disconnect() {}
    unobserve() {}
  } as unknown as typeof IntersectionObserver;
  const C = {
    setup() {
      const el = ref<HTMLElement>();
      const { visible } = useAnimateOnScroll(el);
      return () => h("div", { ref: el, "data-visible": visible.value });
    },
  };
  const w = mount(C);
  expect(w.attributes("data-visible")).toBe("false");
  cb([{ isIntersecting: true }]);
  await nextTick();
  expect(w.attributes("data-visible")).toBe("true");
});
