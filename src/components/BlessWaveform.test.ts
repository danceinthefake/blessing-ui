import { flushPromises, mount } from "@vue/test-utils";
import BlessWaveform from "./BlessWaveform.vue";
import { downsample, peaksFromChannel } from "./waveform";

test("downsample keeps the loudest value of each slice and clamps odd input", () => {
  expect(downsample([0.1, 0.9, 0.2, 0.3, 0.8, 0.4], 3)).toEqual([0.9, 0.3, 0.8]);
  expect(downsample([0.5, 2, -1, NaN], 8)).toEqual([0.5, 1, 1, 0]); // fewer peaks than bars: kept
  expect(downsample([], 4)).toEqual([]);
  expect(downsample([1, 1], 0)).toEqual([]);
});

test("peaksFromChannel scales to the loudest slice", () => {
  const data = new Float32Array([0.1, -0.2, 0.4, -0.8]);
  expect(peaksFromChannel(data, 2)).toEqual([0.25, 1]);
  expect(peaksFromChannel(new Float32Array(), 4)).toEqual([]);
  expect(peaksFromChannel(new Float32Array(4), 2)).toEqual([0, 0]); // silence, not NaN
});

test("BlessWaveform: draws one bar per peak and marks the played part", () => {
  const w = mount(BlessWaveform, {
    props: { peaks: [0.2, 0.4, 0.6, 0.8], bars: 4, modelValue: 0.5 },
  });
  expect(w.findAll(".bless-wave__bar")).toHaveLength(4);
  expect(w.findAll(".bless-wave__bar--played")).toHaveLength(2);
  expect(w.find(".bless-wave__bar").attributes("style")).toContain("20%");
  const range = w.find("input[type=range]");
  expect(range.attributes("aria-label")).toBe("Seek");
  expect(range.attributes("aria-valuetext")).toBe("50%");
});

test("BlessWaveform: the range seeks, and valueText names the position", async () => {
  const w = mount(BlessWaveform, {
    props: { peaks: [1, 1], bars: 2, valueText: (p: number) => `${Math.round(p * 120)} seconds` },
  });
  await w.find("input").setValue("0.25");
  expect(w.emitted("update:modelValue")![0]).toEqual([0.25]);
  expect(w.emitted("seek")![0]).toEqual([0.25]);
  await w.setProps({ modelValue: 0.25 });
  expect(w.find("input").attributes("aria-valuetext")).toBe("30 seconds");
});

test("BlessWaveform: src is decoded in the browser into bars; a failed read emits error", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) }),
  );
  vi.stubGlobal(
    "AudioContext",
    class {
      decodeAudioData = async () => ({
        getChannelData: () => new Float32Array([0.5, 1, 0.25, 0.5]),
      });
      close = async () => {};
    },
  );
  const w = mount(BlessWaveform, { props: { src: "/a.mp3", bars: 2 } });
  await flushPromises();
  expect(w.findAll(".bless-wave__bar")).toHaveLength(2);
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
  const bad = mount(BlessWaveform, { props: { src: "/missing.mp3", bars: 2 } });
  await flushPromises();
  expect(bad.findAll(".bless-wave__bar")).toHaveLength(0);
  expect(bad.emitted("error")).toHaveLength(1);
  vi.unstubAllGlobals();
});

test("BlessWaveform: disabled turns the range off", () => {
  const w = mount(BlessWaveform, { props: { peaks: [1], bars: 1, disabled: true } });
  expect(w.find("input").attributes("disabled")).toBeDefined();
});
