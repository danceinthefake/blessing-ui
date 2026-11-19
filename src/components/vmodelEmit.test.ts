// Under a parent v-model, a defineModel ref keeps the old value until the parent re-renders.
// An event sent right after setting the model must carry the new value, not model.value.
import { mount } from "@vue/test-utils";
import { h, ref, type Component } from "vue";
import BlessInputOTP from "./BlessInputOTP.vue";
import BlessPinPad from "./BlessPinPad.vue";
import BlessSignaturePad from "./BlessSignaturePad.vue";
import BlessWaveform from "./BlessWaveform.vue";

function withModel(C: Component, event: string, props: Record<string, unknown> = {}) {
  const got: unknown[] = [];
  const w = mount(
    {
      setup() {
        const v = ref<unknown>(undefined);
        return () =>
          h(C, {
            ...props,
            modelValue: v.value,
            "onUpdate:modelValue": (x: unknown) => (v.value = x),
            [`on${event[0]!.toUpperCase()}${event.slice(1)}`]: (x: unknown) => got.push(x),
          });
      },
    },
    { attachTo: document.body },
  );
  return { w, got };
}

test("BlessInputOTP: finish carries the full code", async () => {
  const { w, got } = withModel(BlessInputOTP, "finish", { length: 2 });
  const cells = w.findAll("input");
  await cells[0]!.setValue("1");
  await cells[1]!.setValue("2");
  expect(got).toEqual(["12"]);
});

test("BlessPinPad: finish carries the full PIN", async () => {
  const { w, got } = withModel(BlessPinPad, "finish", { length: 2 });
  for (const d of ["4", "2"])
    await w
      .findAll("button")
      .find((b) => b.text() === d)!
      .trigger("click");
  expect(got).toEqual(["42"]);
});

test("BlessWaveform: seek carries the new position", async () => {
  const { w, got } = withModel(BlessWaveform, "seek", { peaks: [1, 1], bars: 2 });
  await w.find("input").setValue("0.5");
  expect(got).toEqual([0.5]);
});

test("BlessSignaturePad: end carries the new image", async () => {
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
  HTMLCanvasElement.prototype.toDataURL = () => "data:image/png;base64,new";
  HTMLCanvasElement.prototype.setPointerCapture = () => {};
  const { w, got } = withModel(BlessSignaturePad, "end");
  const c = w.find("canvas").element;
  for (const type of ["pointerdown", "pointermove", "pointerup"])
    c.dispatchEvent(new MouseEvent(type, { clientX: 5, clientY: 5, bubbles: true }));
  expect(got).toEqual(["data:image/png;base64,new"]);
  w.unmount();
});
