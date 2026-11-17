<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatar from "./BlessAvatar.vue";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessTicketView" });
const pack = useLabelPack("BlessTicketView");

export type BlessTicketStatus = "open" | "pending" | "solved";
export type BlessTicketPriority = "low" | "normal" | "high" | "urgent";
export interface BlessTicketMessage {
  id: string;
  from: string;
  /** a customer, an agent, or an internal note that the customer does not see */
  role: "customer" | "agent" | "note";
  /** when, as text */
  time: string;
  body: string;
}

const props = withDefaults(
  defineProps<{
    subject: string;
    number: string;
    customer: { name: string; email?: string };
    priority?: BlessTicketPriority;
    messages: BlessTicketMessage[];
    labels?: Partial<
      Record<BlessTicketStatus, string> &
        Record<BlessTicketPriority, string> & {
          status: string;
          priority: string;
          reply: string;
          note: string;
          send: string;
          addNote: string;
          internal: string;
          placeholder: string;
        }
    >;
  }>(),
  { priority: "normal" },
);
const status = defineModel<BlessTicketStatus>("status", { default: "open" });
const emit = defineEmits<{ reply: [body: string, internal: boolean] }>();

const text = computed(() => ({
  open: "Open",
  pending: "Waiting for the customer",
  solved: "Solved",
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
  status: "Status",
  priority: "Priority",
  reply: "Reply",
  note: "Internal note",
  send: "Send the reply",
  addNote: "Add the note",
  internal: "Only your team sees this note.",
  placeholder: "Write a message",
  ...pack(),
  ...props.labels,
}));
const uid = useId();
const mode = ref<"reply" | "note">("reply");
const body = ref("");
function send() {
  const b = body.value.trim();
  if (!b) return;
  emit("reply", b, mode.value === "note");
  body.value = "";
}
const PRIO = { low: "▽", normal: "○", high: "△", urgent: "▲" } as const;
</script>

<template>
  <article class="bless-tkview">
    <header class="bless-tkview__head">
      <span class="bless-tkview__number">{{ number }}</span>
      <h2 class="bless-tkview__subject">{{ subject }}</h2>
      <div class="bless-tkview__meta">
        <span
          >{{ customer.name
          }}<template v-if="customer.email"> · {{ customer.email }}</template></span
        >
        <span class="bless-tkview__prio" :class="`is-${priority}`">
          <span aria-hidden="true">{{ PRIO[priority] }}</span> {{ text.priority }}:
          {{ text[priority] }}
        </span>
        <label class="bless-tkview__status">
          <span>{{ text.status }}</span>
          <select v-model="status">
            <option value="open">{{ text.open }}</option>
            <option value="pending">{{ text.pending }}</option>
            <option value="solved">{{ text.solved }}</option>
          </select>
        </label>
      </div>
    </header>
    <ol class="bless-tkview__thread" role="list">
      <li v-for="m in messages" :key="m.id" class="bless-tkview__msg" :class="`is-${m.role}`">
        <div class="bless-tkview__box">
          <div class="bless-tkview__from">
            <BlessAvatar :name="m.from" alt="" size="xs" />
            <strong>{{ m.from }}</strong>
            <span v-if="m.role === 'note'" class="bless-tkview__tag">{{ text.note }}</span>
            <span class="bless-tkview__time">{{ m.time }}</span>
          </div>
          <p class="bless-tkview__body">{{ m.body }}</p>
        </div>
      </li>
    </ol>
    <form class="bless-tkview__reply" :class="`is-${mode}`" @submit.prevent="send">
      <div class="bless-tkview__modes" role="radiogroup" :aria-label="text.reply">
        <label
          ><input v-model="mode" type="radio" :name="`${uid}-mode`" value="reply" />
          {{ text.reply }}</label
        >
        <label
          ><input v-model="mode" type="radio" :name="`${uid}-mode`" value="note" />
          {{ text.note }}</label
        >
      </div>
      <textarea
        v-model="body"
        rows="4"
        :aria-label="mode === 'note' ? text.note : text.reply"
        :placeholder="text.placeholder"
        :aria-describedby="mode === 'note' ? `${uid}-internal` : undefined"
      />
      <p v-if="mode === 'note'" :id="`${uid}-internal`" class="bless-tkview__hint">
        {{ text.internal }}
      </p>
      <BlessButton type="submit" size="sm" :disabled="!body.trim()">{{
        mode === "note" ? text.addNote : text.send
      }}</BlessButton>
    </form>
  </article>
</template>

<style>
.bless-tkview {
  display: grid;
  gap: var(--bless-space-4);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-tkview__head {
  display: grid;
  gap: var(--bless-space-1);
}
.bless-tkview__number {
  font-family: var(--bless-font-mono, ui-monospace, monospace);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
/* two classes, so the heading styles of a host page do not win */
.bless-tkview .bless-tkview__subject {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: var(--bless-text-lg);
  line-height: var(--bless-leading-tight);
}
.bless-tkview__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2) var(--bless-space-4);
  font-size: var(--bless-text-xs);
}
.bless-tkview__prio {
  font-weight: var(--bless-font-weight-bold);
}
.bless-tkview__prio.is-urgent {
  color: var(--bless-color-danger-text);
}
.bless-tkview__status {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
}
.bless-tkview__status select,
.bless-tkview__reply textarea {
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
.bless-tkview__status select {
  min-block-size: 2rem;
  padding: 0 var(--bless-space-2);
}
.bless-tkview__thread {
  display: grid;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
/* the space sits on a div, so a list reset of the host page keeps it */
.bless-tkview__box {
  display: grid;
  gap: var(--bless-space-1);
  padding: var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.is-agent > .bless-tkview__box {
  border-inline-start: 4px solid var(--bless-color-text);
}
/* an internal note is dashed, tinted, and named; it must never look like a reply */
.is-note > .bless-tkview__box {
  border: 2px dashed var(--bless-color-text);
  background: var(--bless-color-surface-2);
}
.bless-tkview__from {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-tkview__tag {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-tkview__time {
  margin-inline-start: auto;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text);
}
.bless-tkview__body {
  margin: 0;
  line-height: 1.55;
  white-space: pre-line;
}
.bless-tkview__reply {
  display: grid;
  justify-items: start;
  gap: var(--bless-space-2);
  padding: var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-tkview__reply.is-note {
  border: 2px dashed var(--bless-color-text);
}
.bless-tkview__modes {
  display: flex;
  gap: var(--bless-space-4);
}
.bless-tkview__modes input {
  accent-color: var(--bless-color-accent);
}
.bless-tkview__modes label {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  cursor: pointer;
}
.bless-tkview__reply textarea {
  inline-size: 100%;
  padding: var(--bless-space-2);
  resize: vertical;
}
.bless-tkview__hint {
  margin: 0;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-tkview__status select:focus-visible,
.bless-tkview__reply textarea:focus-visible,
.bless-tkview__modes input:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-tkview {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
