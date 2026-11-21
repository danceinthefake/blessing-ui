<template>
  <div class="bless-term" @click="focusInput">
    <div v-if="title" class="bless-term__bar">{{ title }}</div>
    <div ref="box" class="bless-term__screen" role="log" :aria-label="text.output" tabindex="0">
      <div
        v-for="(l, i) in lines"
        :key="i"
        class="bless-term__line"
        :class="`is-${l.kind ?? 'out'}`"
      >
        <span v-if="l.kind === 'in'" class="bless-term__prompt" aria-hidden="true">{{
          `${prompt} `
        }}</span>
        <span v-if="l.kind === 'err'" class="bless-sr">{{ `${text.error} ` }}</span>{{ l.text }}
      </div>
    </div>
    <form v-if="!readonly" class="bless-term__input" @submit.prevent="run">
      <span class="bless-term__prompt" aria-hidden="true">{{ prompt }}</span>
      <input
        ref="input"
        v-model="draft"
        :aria-label="text.command"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        @keydown.up.prevent="walk(1)"
        @keydown.down.prevent="walk(-1)"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessTerminal" });
const pack = useLabelPack("BlessTerminal");

export interface BlessTerminalLine {
  /** "in" is a command that the person typed, "err" is an error, "out" is the rest */
  kind?: "in" | "out" | "err";
  text: string;
}

const props = withDefaults(
  defineProps<{
    lines: BlessTerminalLine[];
    prompt?: string;
    title?: string;
    /** without input, the terminal only shows output, for example a build log */
    readonly?: boolean;
    labels?: Partial<{ output: string; command: string; error: string }>;
  }>(),
  { prompt: "$" },
);
const emit = defineEmits<{ run: [command: string] }>();

const text = computed(() => ({
  output: "Terminal output",
  command: "Command",
  error: "Error:",
  ...pack(),
  ...props.labels,
}));
const draft = ref("");
const box = ref<HTMLElement>();
const input = ref<HTMLInputElement>();
// the commands typed so far, newest last; the arrow keys walk them
const history = computed(() => props.lines.filter((l) => l.kind === "in").map((l) => l.text));
let back = -1;
function walk(d: 1 | -1) {
  const h = history.value;
  if (!h.length) return;
  back = Math.max(-1, Math.min(h.length - 1, back + d));
  draft.value = back < 0 ? "" : h[h.length - 1 - back]!;
}
// a click moves the focus to the input, unless the person selects text to copy
const focusInput = () => !window.getSelection()?.toString() && input.value?.focus();
function run() {
  const c = draft.value.trim();
  back = -1;
  draft.value = "";
  if (c) emit("run", c);
}
watch(
  () => props.lines.length,
  async () => {
    await nextTick();
    box.value?.scrollTo?.({ top: box.value.scrollHeight });
  },
);
</script>

<style>
.bless-term {
  display: grid;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-mono, ui-monospace, monospace);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-term__bar {
  padding: var(--bless-space-1) var(--bless-space-3);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-surface-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-term__screen {
  max-block-size: 20rem;
  overflow: auto;
  padding: var(--bless-space-3) var(--bless-space-3) 0;
  line-height: 1.5;
}
.bless-term__screen:focus-visible,
.bless-term__input:focus-within {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-term__line {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.bless-term__line.is-in {
  font-weight: var(--bless-font-weight-bold);
}
/* errors differ by a bar and the color, and screen readers hear "Error:" */
.bless-term__line.is-err {
  padding-inline-start: var(--bless-space-2);
  border-inline-start: 3px solid var(--bless-color-danger);
  color: var(--bless-color-danger-text);
}
.bless-term__prompt {
  font-weight: var(--bless-font-weight-bold);
}
.bless-term__input {
  display: flex;
  align-items: center;
  gap: 1ch;
  padding: var(--bless-space-1) var(--bless-space-3) var(--bless-space-3);
}
.bless-term__input input {
  flex: 1;
  min-inline-size: 0;
  padding: 0;
  border: 0;
  outline: 0;
  background: none;
  color: inherit;
  font: inherit;
  caret-color: var(--bless-color-accent);
}
</style>
