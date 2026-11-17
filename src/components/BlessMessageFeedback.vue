<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { copyText } from "../composables/copyText";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";
import BlessTextarea from "./BlessTextarea.vue";
import "./sr.css";

defineOptions({ name: "BlessMessageFeedback" });
const pack = useLabelPack("BlessMessageFeedback");

export interface BlessMessageFeedbackEvent {
  rating: "good" | "bad";
  /** the reason the reader picked, for a bad mark */
  reason?: string;
  /** the words the reader typed, for a bad mark */
  note?: string;
}

const props = defineProps<{
  /** the text of the reply; with it, a copy button shows */
  copy?: string;
  /** show a button that asks for a new reply */
  retry?: boolean;
  /** reasons to pick from after a bad mark, for example `["Not true", "Too long"]` */
  reasons?: string[];
  labels?: Partial<{
    good: string;
    bad: string;
    copy: string;
    copied: string;
    retry: string;
    ask: string;
    note: string;
    send: string;
    cancel: string;
    thanks: string;
  }>;
}>();
/** the mark of the reader: `good`, `bad`, or none */
const rating = defineModel<"good" | "bad" | undefined>("rating");
const emit = defineEmits<{ feedback: [event: BlessMessageFeedbackEvent]; retry: [] }>();

const text = computed(() => ({
  good: "Good reply",
  bad: "Bad reply",
  copy: "Copy",
  copied: "Copied",
  retry: "Try again",
  ask: "What was wrong?",
  note: "Tell us more (optional)",
  send: "Send",
  cancel: "Cancel",
  thanks: "Thanks for the feedback",
  ...pack(),
  ...props.labels,
}));

const asking = ref(false);
const reason = ref<string>();
const note = ref("");
const live = ref("");
function mark(r: "good" | "bad") {
  if (rating.value === r) {
    rating.value = undefined;
    asking.value = false;
    return;
  }
  rating.value = r;
  asking.value = r === "bad";
  reason.value = undefined;
  note.value = "";
  if (r === "good") done({ rating: "good" });
}
function done(e: BlessMessageFeedbackEvent) {
  emit("feedback", e);
  asking.value = false;
  live.value = text.value.thanks;
}
const send = () =>
  done({ rating: "bad", reason: reason.value, note: note.value.trim() || undefined });

const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
async function doCopy() {
  await copyText(props.copy!);
  copied.value = true;
  live.value = text.value.copied;
  clearTimeout(timer);
  timer = setTimeout(() => (copied.value = false), 2000);
}
onBeforeUnmount(() => clearTimeout(timer));

const ICON = {
  good: "M5 7v7H2.5V7H5Zm0 0 3-5.5c1 0 1.7.8 1.5 1.8L9 6h4a1.3 1.3 0 0 1 1.3 1.5l-1 5.3A1.5 1.5 0 0 1 11.8 14H5",
  copy: "M5.5 5.5V2.5h8v8h-3M2.5 5.5h8v8h-8z",
  check: "M3 8.5 6.5 12 13 4.5",
  retry: "M13.5 8a5.5 5.5 0 1 1-1.6-3.9M12 1.5v3h-3",
};
</script>

<template>
  <div class="bless-feedback">
    <div class="bless-feedback__bar">
      <BlessButton
        v-if="copy !== undefined"
        variant="ghost"
        size="sm"
        :aria-label="copied ? text.copied : text.copy"
        :title="text.copy"
        @click="doCopy"
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path :d="copied ? ICON.check : ICON.copy" />
        </svg>
      </BlessButton>
      <BlessButton
        variant="ghost"
        size="sm"
        class="bless-feedback__mark"
        :aria-label="text.good"
        :title="text.good"
        :aria-pressed="rating === 'good'"
        @click="mark('good')"
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path :d="ICON.good" />
        </svg>
      </BlessButton>
      <BlessButton
        variant="ghost"
        size="sm"
        class="bless-feedback__mark"
        :aria-label="text.bad"
        :title="text.bad"
        :aria-pressed="rating === 'bad'"
        @click="mark('bad')"
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" class="is-down">
          <path :d="ICON.good" />
        </svg>
      </BlessButton>
      <BlessButton
        v-if="retry"
        variant="ghost"
        size="sm"
        :aria-label="text.retry"
        :title="text.retry"
        @click="emit('retry')"
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path :d="ICON.retry" />
        </svg>
      </BlessButton>
      <span class="bless-sr" role="status">{{ live }}</span>
    </div>
    <form v-if="asking" class="bless-feedback__form" @submit.prevent="send">
      <p class="bless-feedback__ask">{{ text.ask }}</p>
      <div v-if="reasons?.length" class="bless-feedback__reasons">
        <button
          v-for="r in reasons"
          :key="r"
          type="button"
          class="bless-feedback__reason"
          :aria-pressed="reason === r"
          @click="reason = reason === r ? undefined : r"
        >
          {{ r }}
        </button>
      </div>
      <BlessTextarea v-model="note" :rows="2" :aria-label="text.note" :placeholder="text.note" />
      <div class="bless-feedback__actions">
        <BlessButton type="submit" size="sm">{{ text.send }}</BlessButton>
        <BlessButton variant="ghost" size="sm" @click="asking = false">{{
          text.cancel
        }}</BlessButton>
      </div>
    </form>
  </div>
</template>

<style>
.bless-feedback {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-feedback__bar {
  display: flex;
  align-items: center;
  gap: var(--bless-space-1);
  color: var(--bless-color-text-muted);
}
.bless-feedback__bar svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.bless-feedback__bar svg.is-down {
  rotate: 180deg;
}
/* a pressed mark is filled, so the state is more than a color */
.bless-feedback__mark[aria-pressed="true"] {
  color: var(--bless-color-text);
}
.bless-feedback__mark[aria-pressed="true"] svg {
  fill: currentColor;
}
.bless-feedback__form {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-2);
  max-inline-size: 28rem;
  margin-block-start: var(--bless-space-2);
  padding: var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  border-radius: var(--bless-radius-plate);
}
.bless-feedback__ask {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-feedback__reasons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
}
.bless-feedback__reason {
  padding: var(--bless-space-1) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  border-radius: var(--bless-radius-petal);
  background: none;
  color: var(--bless-color-text);
  font: inherit;
  font-size: var(--bless-text-xs);
  cursor: pointer;
}
.bless-feedback__reason[aria-pressed="true"] {
  border-color: var(--bless-color-text);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-feedback__reason:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-feedback__actions {
  display: flex;
  gap: var(--bless-space-2);
}
.bless-feedback__form {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
