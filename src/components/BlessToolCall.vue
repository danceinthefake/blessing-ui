<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessSpinner from "./BlessSpinner.vue";

defineOptions({ name: "BlessToolCall" });
const pack = useLabelPack("BlessToolCall");

const props = withDefaults(
  defineProps<{
    /** the name of the tool, for example `search_web` */
    name: string;
    status?: "running" | "done" | "error";
    /** a short line after the name, for example the search words */
    summary?: string;
    /** the arguments: a text, or data that shows as JSON */
    input?: unknown;
    /** the result or the error: a text, or data that shows as JSON */
    output?: unknown;
    labels?: Partial<{
      running: string;
      done: string;
      error: string;
      input: string;
      output: string;
    }>;
  }>(),
  { status: "running" },
);

const text = computed(() => ({
  running: "Running",
  done: "Done",
  error: "Failed",
  input: "Input",
  output: "Output",
  ...pack(),
  ...props.labels,
}));
const open = defineModel<boolean>("open", { default: false });
const show = (v: unknown) => (typeof v === "string" ? v : JSON.stringify(v, null, 2));
</script>

<template>
  <details
    class="bless-toolcall"
    :class="`bless-toolcall--${status}`"
    :open
    @toggle="open = ($event.target as HTMLDetailsElement).open"
  >
    <summary class="bless-toolcall__head">
      <span class="bless-toolcall__icon" aria-hidden="true">
        <BlessSpinner v-if="status === 'running'" size="sm" label="" />
        <svg v-else viewBox="0 0 16 16" width="14" height="14">
          <path
            :d="status === 'done' ? 'M3 8.5 6.5 12 13 4.5' : 'M4 4l8 8M12 4l-8 8'"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <code class="bless-toolcall__name">{{ name }}</code>
      <span v-if="summary" class="bless-toolcall__summary">{{ summary }}</span>
      <span class="bless-toolcall__status">{{ text[status] }}</span>
    </summary>
    <div class="bless-toolcall__body">
      <section v-if="input !== undefined || $slots.input">
        <p class="bless-toolcall__label">{{ text.input }}</p>
        <slot name="input"><pre class="bless-toolcall__data">{{ show(input) }}</pre></slot>
      </section>
      <section v-if="output !== undefined || $slots.output">
        <p class="bless-toolcall__label">{{ text.output }}</p>
        <slot name="output"><pre class="bless-toolcall__data">{{ show(output) }}</pre></slot>
      </section>
    </div>
  </details>
</template>

<style>
.bless-toolcall {
  border: var(--bless-border-width) solid var(--bless-color-border);
  border-radius: var(--bless-radius-plate);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-toolcall__head {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2) var(--bless-space-3);
  cursor: pointer;
  list-style: none;
}
.bless-toolcall__head::-webkit-details-marker {
  display: none;
}
.bless-toolcall__head::after {
  content: "";
  flex: none;
  inline-size: 6px;
  block-size: 6px;
  margin-inline-start: var(--bless-space-1);
  border-inline-end: 1.5px solid currentColor;
  border-block-end: 1.5px solid currentColor;
  rotate: -45deg;
  transition: rotate var(--bless-duration-fast) var(--bless-ease-out);
}
[dir="rtl"] .bless-toolcall__head::after {
  rotate: 135deg;
}
.bless-toolcall[open] > .bless-toolcall__head::after {
  rotate: 45deg;
}
.bless-toolcall__head:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-toolcall__icon {
  display: inline-flex;
  flex: none;
}
.bless-toolcall--done .bless-toolcall__icon {
  color: var(--bless-color-success);
}
.bless-toolcall--error .bless-toolcall__icon {
  color: var(--bless-color-danger);
}
.bless-toolcall__name {
  font-family: var(--bless-font-mono);
  font-weight: var(--bless-font-weight-bold);
}
.bless-toolcall__summary {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--bless-color-text-muted);
}
.bless-toolcall__status {
  margin-inline-start: auto;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-toolcall__body {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3);
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-toolcall__label {
  margin: 0 0 var(--bless-space-1);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.bless-toolcall__data {
  max-block-size: 16rem;
  margin: 0;
  padding: var(--bless-space-2);
  overflow: auto;
  background: var(--bless-color-surface-2);
  font-family: var(--bless-font-mono);
  font-size: var(--bless-text-xs);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
@media (prefers-reduced-motion: reduce) {
  .bless-toolcall__head::after {
    transition: none;
  }
}
</style>
