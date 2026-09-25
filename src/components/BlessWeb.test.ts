import { mount } from "@vue/test-utils";
import { h, nextTick, ref } from "vue";
import BlessCircularProgress from "./BlessCircularProgress.vue";
import BlessClientOnly from "./BlessClientOnly.vue";
import BlessImg from "./BlessImg.vue";
import BlessLoadingBar from "./BlessLoadingBar.vue";
import BlessRange from "./BlessRange.vue";
import BlessTimePicker from "./BlessTimePicker.vue";
import BlessUploader from "./BlessUploader.vue";
import BlessVideo from "./BlessVideo.vue";
import { useLoadingBar } from "../composables/useLoadingBar";
import { useResizeObserver, useScroll, useVisibility } from "../composables/useBrowser";

test("BlessCircularProgress: dashoffset follows value; indeterminate has no valuenow", () => {
  const w = mount(BlessCircularProgress, {
    props: { value: 25, size: 40, thickness: 4, showValue: true },
  });
  const c = 2 * Math.PI * 18;
  expect(Number(w.find(".bless-circular__bar").attributes("stroke-dashoffset"))).toBeCloseTo(
    c * 0.75,
    3,
  );
  expect(w.find(".bless-circular__value").text()).toBe("25%");
  const i = mount(BlessCircularProgress);
  expect(i.attributes("aria-valuenow")).toBeUndefined();
  expect(i.classes()).toContain("bless-circular--indeterminate");
});

test("BlessRange: two thumbs, gap enforced, fill percentages", async () => {
  const w = mount(BlessRange, { props: { modelValue: [20, 60], gap: 10 } });
  const [lo, hi] = w.findAll("input");
  expect(w.attributes("style")).toContain("--_lo: 20%");
  expect(w.attributes("style")).toContain("--_hi: 60%");
  await lo.setValue("55");
  expect(w.emitted("update:modelValue")![0][0]).toEqual([50, 60]);
  await w.setProps({ modelValue: [20, 60] });
  await hi.setValue("10");
  expect(w.emitted("update:modelValue")!.at(-1)![0]).toEqual([20, 30]);
});

test("BlessRange: a thumb pushed past the other snaps back even when the model doesn't change", async () => {
  const w = mount(BlessRange, { props: { modelValue: [50, 60], gap: 10, name: "price" } });
  const [lo, hi] = w.findAll("input");
  await lo.setValue("58"); // clamps to 50: the same as now, so nothing re-renders
  expect((lo.element as HTMLInputElement).value).toBe("50");
  expect([lo.attributes("name"), hi.attributes("name")]).toEqual(["price", "price"]);
});

test("BlessTimePicker: native time input with a datalist of steps", () => {
  const w = mount(BlessTimePicker, {
    props: { step: 30, min: "09:00", max: "10:00", hour12: true },
  });
  expect(w.find("input").attributes("type")).toBe("time");
  const opts = w.findAll("option");
  expect(opts.map((o) => o.attributes("value"))).toEqual(["09:00", "09:30", "10:00"]);
  expect(opts[0].text()).toBe("9:00 AM");
  // step spaces the suggestions only: any minute can still be typed
  expect(w.find("input").attributes("step")).toBe("60");
  (w.find("input").element as HTMLInputElement).value = "09:07";
  expect((w.find("input").element as HTMLInputElement).checkValidity()).toBe(true);
  expect(w.find("input").attributes("aria-label")).toBe("Time");
});

test("BlessImg: skeleton until load, error state", async () => {
  const w = mount(BlessImg, { props: { src: "/x.png", alt: "x", ratio: "1 / 1" } });
  expect(w.find(".bless-img__skeleton").exists()).toBe(true);
  await w.find("img.bless-img__img").trigger("load");
  expect(w.classes()).toContain("bless-img--loaded");
  const e = mount(BlessImg, { props: { src: "/nope.png", alt: "gone" } });
  await e.find("img.bless-img__img").trigger("error");
  expect(e.find(".bless-img__error").attributes("aria-label")).toBe("gone");
});

test("BlessVideo: iframe by default, <video> when native", () => {
  expect(
    mount(BlessVideo, { props: { src: "https://e/x", title: "t" } })
      .find("iframe")
      .exists(),
  ).toBe(true);
  expect(
    mount(BlessVideo, { props: { src: "/a.mp4", title: "t", native: true } })
      .find("video")
      .exists(),
  ).toBe(true);
});

test("useLoadingBar: start/stop with nesting, bar reflects state", async () => {
  vi.useFakeTimers();
  const w = mount(BlessLoadingBar);
  const bar = useLoadingBar();
  bar.start();
  bar.start();
  await nextTick();
  expect(w.classes()).toContain("bless-loadingbar--on");
  bar.stop();
  await nextTick();
  expect(w.classes()).toContain("bless-loadingbar--on"); // one still pending
  bar.stop();
  await nextTick();
  expect(bar.state.progress).toBe(100);
  vi.advanceTimersByTime(400);
  await nextTick();
  expect(w.classes()).not.toContain("bless-loadingbar--on");
  vi.useRealTimers();
});

test("BlessUploader: queues, manual upload via event, done/fail", async () => {
  const w = mount(BlessUploader, { props: { maxSize: 100 } });
  const small = new File(["a"], "a.txt");
  const big = new File([new Uint8Array(200)], "big.bin");
  w.findComponent({ name: "BlessFileInput" }).vm.$emit("update:modelValue", [small, big]);
  await nextTick();
  const items = w.findAll(".bless-uploader__item");
  expect(items).toHaveLength(2);
  expect(items[1].classes()).toContain("bless-uploader__item--error");
  await w.findAll(".bless-uploader__actions button")[1].trigger("click"); // Upload
  expect(w.emitted("upload")).toHaveLength(1);
  const [item, progress, done] = w.emitted("upload")![0] as [
    { status: string; progress: number },
    (n: number) => void,
    () => void,
  ];
  progress(50);
  expect(item.progress).toBe(50);
  done();
  expect(item.status).toBe("done");
  expect(w.emitted("done")).toHaveLength(1);
  await nextTick();
  expect(w.find(".bless-uploader__live").text()).toBe("a.txt uploaded");
  expect(w.find(".bless-uploader__x").attributes("aria-label")).toBe("Remove a.txt");
});

test("BlessClientOnly renders after mount; browser composables read state", async () => {
  const c = mount(BlessClientOnly, { slots: { default: "client", fallback: "ssr" } });
  await nextTick();
  expect(c.text()).toBe("client");
  globalThis.ResizeObserver = class {
    constructor(f: (e: { contentRect: { width: number; height: number } }[]) => void) {
      setTimeout(() => f([{ contentRect: { width: 320, height: 40 } }]), 0);
    }
    observe() {}
    disconnect() {}
    unobserve() {}
  } as unknown as typeof ResizeObserver;
  const C = {
    setup() {
      const el = ref<HTMLElement>();
      const { width } = useResizeObserver(el);
      const { visible } = useVisibility();
      const { y, direction } = useScroll();
      return () =>
        h("div", {
          ref: el,
          "data-w": width.value,
          "data-v": visible.value,
          "data-y": y.value,
          "data-d": direction.value ?? "",
        });
    },
  };
  const w = mount(C);
  await new Promise((r) => setTimeout(r, 5));
  expect(w.attributes("data-w")).toBe("320");
  expect(w.attributes("data-v")).toBe("true");
  Object.defineProperty(window, "scrollY", { value: 120, configurable: true });
  window.dispatchEvent(new Event("scroll"));
  await nextTick();
  expect(w.attributes("data-y")).toBe("120");
  expect(w.attributes("data-d")).toBe("down");
});

test("BlessVideo takes caption tracks; BlessImg's broken image isn't read twice", async () => {
  const { default: BlessVideo } = await import("./BlessVideo.vue");
  const v = mount(BlessVideo, {
    props: { src: "a.mp4", title: "Trailer", native: true },
    slots: { default: '<track kind="captions" src="a.vtt" srclang="ja" />' },
  });
  expect(v.find("video track").attributes("kind")).toBe("captions");
  const i = mount(BlessImg, { props: { src: "missing.jpg", alt: "Megumi" } });
  await i.find("img.bless-img__img").trigger("error");
  expect(i.find("img.bless-img__img").attributes("aria-hidden")).toBe("true");
  expect(i.find(".bless-img__error").attributes("aria-label")).toBe("Megumi");
});
