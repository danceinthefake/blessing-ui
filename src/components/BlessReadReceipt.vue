<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessReadReceipt" });
const pack = useLabelPack("BlessReadReceipt");

export type BlessReceiptStatus = "sending" | "sent" | "delivered" | "read" | "failed";

const props = withDefaults(
  defineProps<{
    status: BlessReceiptStatus;
    /** who read it, in a group chat */
    readBy?: string[];
    /** when, as text */
    time?: string;
    labels?: Partial<
      Record<BlessReceiptStatus, string> & {
        retry: string;
        readBy: (names: string) => string;
      }
    >;
    locale?: string;
  }>(),
  { locale: "en" },
);
const emit = defineEmits<{ retry: [] }>();

const text = computed(() => ({
  sending: "Sending",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
  failed: "Not sent",
  retry: "Try again",
  readBy: (n: string) => `Read by ${n}`,
  ...pack(),
  ...props.labels,
}));
const words = computed(() =>
  props.status === "read" && props.readBy?.length
    ? text.value.readBy(
        new Intl.ListFormat(props.locale, { type: "conjunction" }).format(props.readBy),
      )
    : text.value[props.status],
);
// a clock for sending, one tick for sent, two for delivered; read adds the accent color and its word
const MARK: Record<BlessReceiptStatus, string> = {
  sending: "◷",
  sent: "✓",
  delivered: "✓✓",
  read: "✓✓",
  failed: "!",
};
</script>

<template>
  <span class="bless-receipt" :class="`is-${status}`" :title="words">
    <span v-if="time" class="bless-receipt__time">{{ time }}</span>
    <span class="bless-receipt__mark" aria-hidden="true">{{ MARK[status] }}</span>
    <span class="bless-receipt__words">{{ words }}</span>
    <button
      v-if="status === 'failed'"
      type="button"
      class="bless-receipt__retry"
      @click="emit('retry')"
    >
      {{ text.retry }}
    </button>
  </span>
</template>

<style>
.bless-receipt {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-2xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-receipt__mark {
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: -0.3em;
  padding-inline-end: 0.3em;
}
.bless-receipt.is-read .bless-receipt__mark {
  color: var(--bless-color-accent);
}
.bless-receipt.is-failed {
  color: var(--bless-color-danger-text);
  font-weight: var(--bless-font-weight-bold);
}
/* sending, sent, and delivered differ in the mark, so their words are for screen readers only;
   read and failed show their words, so they do not rest on color */
.bless-receipt:is(.is-sending, .is-sent, .is-delivered) .bless-receipt__words {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.bless-receipt__retry {
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
}
.bless-receipt__retry:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
