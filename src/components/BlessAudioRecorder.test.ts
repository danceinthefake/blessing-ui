import { flushPromises, mount } from "@vue/test-utils";
import BlessAudioRecorder from "./BlessAudioRecorder.vue";

// a stand-in for the browser's recorder: it hands one chunk over when it stops
class FakeRecorder {
  static last: FakeRecorder;
  state = "inactive";
  mimeType = "audio/webm";
  ondataavailable: ((e: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  constructor(public stream: unknown) {
    FakeRecorder.last = this;
  }
  start() {
    this.state = "recording";
  }
  pause() {
    this.state = "paused";
  }
  resume() {
    this.state = "recording";
  }
  stop() {
    this.state = "inactive";
    this.ondataavailable?.({ data: new Blob(["abc"], { type: "audio/webm" }) });
    this.onstop?.();
  }
}
const stopTrack = vi.fn();
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("MediaRecorder", FakeRecorder);
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia: vi.fn(async () => ({ getTracks: () => [{ stop: stopTrack }] })) },
  });
  URL.createObjectURL = vi.fn(() => "blob:rec");
  URL.revokeObjectURL = vi.fn();
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
const button = (w: ReturnType<typeof mount>, t: string) =>
  w.findAll("button").find((b) => b.text().includes(t))!;

test("BlessAudioRecorder: record, pause, resume, stop: a blob, a preview, and the mic released", async () => {
  const w = mount(BlessAudioRecorder);
  await button(w, "Record").trigger("click");
  await flushPromises();
  expect(w.find("[role=status]").text()).toBe("Recording");
  vi.advanceTimersByTime(3000);
  await flushPromises();
  expect(w.find(".bless-rec__clock").text()).toBe("0:03");
  await button(w, "Pause").trigger("click");
  expect(FakeRecorder.last.state).toBe("paused");
  vi.advanceTimersByTime(5000); // a pause does not count
  await button(w, "Resume").trigger("click");
  vi.advanceTimersByTime(1000);
  await button(w, "Stop").trigger("click");
  const [blob] = w.emitted("record")![0] as [Blob];
  expect(blob.type).toBe("audio/webm");
  expect(stopTrack).toHaveBeenCalled();
  expect(w.find("audio").attributes("src")).toBe("blob:rec");
  expect(w.find("[role=status]").text()).toBe("Recorded 0:04");
  await button(w, "Record again").trigger("click");
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:rec");
});

test("BlessAudioRecorder: maxDuration stops by itself", async () => {
  const w = mount(BlessAudioRecorder, { props: { maxDuration: 2 } });
  await button(w, "Record").trigger("click");
  await flushPromises();
  vi.advanceTimersByTime(2200);
  expect(w.emitted("record")).toHaveLength(1);
});

test("BlessAudioRecorder: no permission shows why and emits error", async () => {
  (navigator.mediaDevices.getUserMedia as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
    new Error("NotAllowedError"),
  );
  const w = mount(BlessAudioRecorder);
  await button(w, "Record").trigger("click");
  await flushPromises();
  expect(w.find("[role=status]").text()).toBe("The microphone is not available");
  expect(w.emitted("error")).toHaveLength(1);
  expect(button(w, "Record").exists()).toBe(true);
});
