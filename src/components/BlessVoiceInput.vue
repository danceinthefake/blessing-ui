<template>
  <span class="bless-voice" :class="`is-${state}`">
    <button
      type="button"
      class="bless-voice__button"
      :aria-pressed="state === 'listening'"
      :aria-label="state === 'listening' ? text.stop : text.start"
      :title="
        state === 'unsupported' ? text.unsupported : state === 'listening' ? text.stop : text.start
      "
      :disabled="disabled || state === 'unsupported'"
      :style="{ '--_level': level }"
      @click="toggle"
    >
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <rect x="5.5" y="1.5" width="5" height="8" rx="2.5" />
        <path d="M3 7.5a5 5 0 0 0 10 0M8 12.5v2" />
      </svg>
    </button>
    <span v-if="interim" class="bless-voice__interim" aria-hidden="true">{{ interim }}</span>
    <span v-else-if="state === 'unsupported' || state === 'denied'" class="bless-voice__note">
      {{ state === "denied" ? text.denied : text.unsupported }}
    </span>
    <span class="bless-sr" role="status">{{ status }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { micLevel } from "../composables/micLevel";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessVoiceInput" });
const pack = useLabelPack("BlessVoiceInput");

// the Web Speech API has no types in the DOM library yet: this is the part the component uses
interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult:
    | ((e: {
        resultIndex: number;
        results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
      }) => void)
    | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

const props = withDefaults(
  defineProps<{
    /** the language of the speech, for example `id-ID`; default: the language of the page */
    lang?: string;
    /** keep listening after a pause, until the reader stops it */
    continuous?: boolean;
    disabled?: boolean;
    labels?: Partial<{
      start: string;
      stop: string;
      listening: string;
      stopped: string;
      unsupported: string;
      denied: string;
    }>;
  }>(),
  { continuous: true },
);
/** the text: each finished phrase is added at the end */
const model = defineModel<string>({ default: "" });
const emit = defineEmits<{ result: [text: string]; error: [error: string] }>();

const text = computed(() => ({
  start: "Start dictation",
  stop: "Stop dictation",
  listening: "Listening…",
  stopped: "Dictation stopped",
  unsupported: "Speech to text is not available in this browser",
  denied: "The microphone is not allowed",
  ...pack(),
  ...props.labels,
}));

type State = "idle" | "listening" | "unsupported" | "denied";
const state = ref<State>("idle");
const interim = ref("");
const level = ref(0);
const status = ref("");
let rec: Recognition | undefined;
let stream: MediaStream | undefined;
let stopMeter = () => {};

// the browser support is read after mount, so the server and the first client render agree
onMounted(() => {
  const w = window as unknown as Record<string, (new () => Recognition) | undefined>;
  if (!(w.SpeechRecognition ?? w.webkitSpeechRecognition)) state.value = "unsupported";
});

function release() {
  stopMeter();
  stopMeter = () => {};
  stream?.getTracks().forEach((t) => t.stop());
  stream = undefined;
  level.value = 0;
  interim.value = "";
}
async function start() {
  const w = window as unknown as Record<string, (new () => Recognition) | undefined>;
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return void (state.value = "unsupported");
  rec = new Ctor();
  rec.lang = props.lang ?? (document.documentElement.lang || "en-US");
  rec.continuous = props.continuous;
  rec.interimResults = true;
  rec.onresult = (e) => {
    let live = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i]!;
      const t = r[0].transcript.trim();
      if (!r.isFinal) live += r[0].transcript;
      else if (t) {
        model.value = model.value ? `${model.value.replace(/\s+$/, "")} ${t}` : t;
        emit("result", t);
      }
    }
    interim.value = live.trim();
  };
  rec.onerror = (e) => {
    if (e.error === "not-allowed" || e.error === "service-not-allowed") state.value = "denied";
    emit("error", e.error);
  };
  rec.onend = () => {
    release();
    if (state.value === "listening") state.value = "idle";
    status.value = state.value === "denied" ? text.value.denied : text.value.stopped;
  };
  rec.start();
  state.value = "listening";
  status.value = text.value.listening;
  // the meter is a bonus: dictation still works if this second request fails
  try {
    stream = await navigator.mediaDevices?.getUserMedia({ audio: true });
    if (stream && state.value === "listening")
      stopMeter = micLevel(stream, (l) => (level.value = l));
    else release();
  } catch {
    /* no meter */
  }
}
function toggle() {
  if (state.value === "listening") rec?.stop();
  else void start();
}
onBeforeUnmount(() => {
  if (rec) rec.onend = null;
  rec?.stop();
  release();
});
</script>

<style>
.bless-voice {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-voice__button {
  position: relative;
  display: inline-grid;
  flex: none;
  place-items: center;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border: var(--bless-border-width) solid var(--bless-color-border);
  border-radius: 50%;
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  cursor: pointer;
}
.bless-voice__button svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
}
.bless-voice__button:hover:not(:disabled) {
  background: var(--bless-color-surface-2);
}
.bless-voice__button:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-voice__button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
/* listening: a filled button, and a ring that grows with the loudness of the voice */
.is-listening .bless-voice__button {
  border-color: var(--bless-color-danger);
  background: var(--bless-color-danger);
  color: var(--bless-color-on-accent);
}
.is-listening .bless-voice__button::before {
  content: "";
  position: absolute;
  inset: -4px;
  border: 2px solid var(--bless-color-danger);
  border-radius: 50%;
  opacity: 0.5;
  scale: calc(1 + var(--_level) * 0.45);
  transition: scale 80ms linear;
}
.bless-voice__interim {
  min-inline-size: 0;
  overflow: hidden;
  color: var(--bless-color-text-muted);
  font-style: italic;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-voice__note {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
@media (prefers-reduced-motion: reduce) {
  .is-listening .bless-voice__button::before {
    scale: 1;
    transition: none;
  }
}
</style>
