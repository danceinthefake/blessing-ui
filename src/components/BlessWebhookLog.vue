<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessWebhookLog" });
const pack = useLabelPack("BlessWebhookLog");

export interface BlessWebhookDelivery {
  id: string | number;
  /** the name of the event, for example `episode.published` */
  event: string;
  /** the HTTP status of the reply; none while it is on its way */
  status?: number;
  /** when it was sent, as text */
  time: string;
  /** how long the reply took, in ms */
  duration?: number;
  /** the body that was sent: a text, or data that shows as JSON */
  request?: unknown;
  /** the body of the reply: a text, or data that shows as JSON */
  response?: unknown;
}

const props = defineProps<{
  deliveries: BlessWebhookDelivery[];
  /** ids that are being sent again: their retry button spins */
  retrying?: (string | number)[];
  labels?: Partial<{
    title: string;
    pending: string;
    ok: string;
    failed: string;
    retry: string;
    request: string;
    response: string;
    empty: string;
  }>;
}>();
const emit = defineEmits<{ retry: [id: string | number] }>();

const text = computed(() => ({
  title: "Webhook deliveries",
  pending: "Pending",
  ok: "Delivered",
  failed: "Failed",
  retry: "Send again",
  request: "Request",
  response: "Response",
  empty: "No deliveries yet",
  ...pack(),
  ...props.labels,
}));
const state = (d: BlessWebhookDelivery) =>
  d.status === undefined ? "pending" : d.status >= 200 && d.status < 300 ? "ok" : "failed";
const show = (v: unknown) => (typeof v === "string" ? v : JSON.stringify(v, null, 2));
</script>

<template>
  <section class="bless-hooks" :aria-label="text.title">
    <p v-if="!deliveries.length" class="bless-hooks__empty">{{ text.empty }}</p>
    <ul v-else class="bless-stagger bless-hooks__list">
      <li v-for="d in deliveries" :key="d.id" class="bless-hooks__item" :class="`is-${state(d)}`">
        <details class="bless-hooks__details">
          <summary class="bless-hooks__head">
            <span class="bless-hooks__status">
              <span class="bless-hooks__dot" aria-hidden="true" />
              <strong>{{ d.status ?? "…" }}</strong>
              <span class="bless-hooks__state">{{ text[state(d)] }}</span>
            </span>
            <code class="bless-hooks__event">{{ d.event }}</code>
            <span class="bless-hooks__time">
              {{ d.time
              }}<template v-if="d.duration !== undefined"> · {{ d.duration }} ms</template>
            </span>
          </summary>
          <div class="bless-hooks__body">
            <section v-if="d.request !== undefined">
              <p class="bless-hooks__label">{{ text.request }}</p>
              <pre class="bless-hooks__data">{{ show(d.request) }}</pre>
            </section>
            <section v-if="d.response !== undefined">
              <p class="bless-hooks__label">{{ text.response }}</p>
              <pre class="bless-hooks__data">{{ show(d.response) }}</pre>
            </section>
          </div>
        </details>
        <BlessButton
          v-if="state(d) === 'failed'"
          class="bless-hooks__retry"
          size="sm"
          variant="outline"
          :loading="retrying?.includes(d.id)"
          @click="emit('retry', d.id)"
        >
          {{ text.retry }}
        </BlessButton>
        <span v-else aria-hidden="true" />
      </li>
    </ul>
  </section>
</template>

<style>
.bless-hooks {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-hooks__empty {
  margin: 0;
  color: var(--bless-color-text-muted);
}
.bless-hooks__list {
  margin: 0;
  padding: 0;
  border: var(--bless-border-width) solid var(--bless-color-border);
  list-style: none;
}
/* every row keeps a column for the retry button, so the times line up */
.bless-hooks__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 7.5rem;
  align-items: start;
  gap: var(--bless-space-2);
  padding: var(--bless-space-1) var(--bless-space-2);
}
.bless-hooks__item + .bless-hooks__item {
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-hooks__details {
  min-inline-size: 0;
}
.bless-hooks__head {
  display: grid;
  grid-template-columns: 9rem minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-2) var(--bless-space-1);
  cursor: pointer;
  list-style: none;
}
.bless-hooks__head::-webkit-details-marker {
  display: none;
}
.bless-hooks__head:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-hooks__status {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  font-variant-numeric: tabular-nums;
}
/* each state has its own dot shape and a word, so the color is not the only sign */
.bless-hooks__dot {
  inline-size: 9px;
  block-size: 9px;
  border-radius: 50%;
  background: var(--bless-color-success);
}
.is-failed .bless-hooks__dot {
  border-radius: 0;
  background: var(--bless-color-danger);
}
.is-pending .bless-hooks__dot {
  border: 2px solid var(--bless-color-text-muted);
  background: none;
}
.bless-hooks__state {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.is-failed .bless-hooks__state {
  color: var(--bless-color-danger-text);
}
.bless-hooks__event {
  overflow: hidden;
  font-family: var(--bless-font-mono);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-hooks__time {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.bless-hooks__body {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: var(--bless-space-3);
  padding: var(--bless-space-2) var(--bless-space-1) var(--bless-space-3);
}
.bless-hooks__label {
  margin: 0 0 var(--bless-space-1);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.bless-hooks__data {
  max-block-size: 14rem;
  margin: 0;
  padding: var(--bless-space-2);
  overflow: auto;
  background: var(--bless-color-surface-2);
  font-family: var(--bless-font-mono);
  font-size: var(--bless-text-xs);
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.bless-hooks__retry {
  justify-self: end;
  margin-block-start: var(--bless-space-1);
}
</style>
