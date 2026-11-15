import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessVoiceInput from "./BlessVoiceInput.vue";

type Handler = ((e: never) => void) | null;
let last: FakeRec;
class FakeRec {
  lang = "";
  continuous = false;
  interimResults = false;
  onresult: Handler = null;
  onerror: Handler = null;
  onend: (() => void) | null = null;
  started = false;
  constructor() {
    last = this;
  }
  start() {
    this.started = true;
  }
  stop() {
    this.onend?.();
  }
}
const result = (parts: [string, boolean][]) =>
  ({
    resultIndex: 0,
    results: parts.map(([t, f]) => ({ isFinal: f, 0: { transcript: t } })),
  }) as never;

afterEach(() => {
  delete (window as unknown as Record<string, unknown>).SpeechRecognition;
});

test("BlessVoiceInput: no Web Speech API disables the button and says so", async () => {
  const w = mount(BlessVoiceInput);
  await nextTick();
  expect(w.find("button").attributes("disabled")).toBeDefined();
  expect(w.find(".bless-voice__note").text()).toBe(
    "Speech to text is not available in this browser",
  );
});

test("BlessVoiceInput: a click listens, phrases add to the text, and a second click stops", async () => {
  (window as unknown as Record<string, unknown>).SpeechRecognition = FakeRec;
  const w = mount(BlessVoiceInput, {
    props: {
      modelValue: "Notes:",
      lang: "id-ID",
      "onUpdate:modelValue": (v: string) => w.setProps({ modelValue: v }),
    },
  });
  await nextTick();
  await w.find("button").trigger("click");
  expect(last.started).toBe(true);
  expect(last.lang).toBe("id-ID");
  expect(last.interimResults).toBe(true);
  expect(w.find("button").attributes("aria-pressed")).toBe("true");
  expect(w.find("button").attributes("aria-label")).toBe("Stop dictation");
  expect(w.find("[role=status]").text()).toBe("Listening…");
  last.onresult!(result([["record the intro", false]]));
  await nextTick();
  expect(w.find(".bless-voice__interim").text()).toBe("record the intro");
  last.onresult!(result([[" record the intro first ", true]]));
  await nextTick();
  expect(w.props("modelValue")).toBe("Notes: record the intro first");
  expect(w.emitted("result")).toEqual([["record the intro first"]]);
  await w.find("button").trigger("click");
  expect(w.find("button").attributes("aria-pressed")).toBe("false");
  expect(w.find("[role=status]").text()).toBe("Dictation stopped");
});

test("BlessVoiceInput: a denied microphone says so, and labels translate", async () => {
  (window as unknown as Record<string, unknown>).SpeechRecognition = FakeRec;
  const w = mount(BlessVoiceInput, { props: { labels: { denied: "Mikrofon tidak diizinkan" } } });
  await nextTick();
  await w.find("button").trigger("click");
  last.onerror!({ error: "not-allowed" } as never);
  last.onend!();
  await nextTick();
  expect(w.find(".bless-voice__note").text()).toBe("Mikrofon tidak diizinkan");
  expect(w.emitted("error")).toEqual([["not-allowed"]]);
});
