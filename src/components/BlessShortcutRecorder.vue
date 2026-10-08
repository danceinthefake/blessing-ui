<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { isModifierKey, shortcutFromEvent, splitShortcut } from "../composables/shortcut";
import BlessKbd from "./BlessKbd.vue";

defineOptions({ name: "BlessShortcutRecorder" });

const props = withDefaults(
  defineProps<{
    /** combos already taken, as a list or `{ "Ctrl+K": "Open search" }` to say by what */
    taken?: string[] | Record<string, string>;
    /** accept a bare key such as `G`; off asks for Ctrl, Alt or Meta, or a function key */
    allowBare?: boolean;
    disabled?: boolean;
    label?: string;
    placeholder?: string;
    /** button wording and the messages said while recording or on a refusal */
    labels?: Partial<{
      button: (label: string, combo: string) => string;
      pressKeys: string;
      recording: string;
      set: (combo: string) => string;
      needsModifier: (combo: string) => string;
      usedBy: (combo: string, by: string) => string;
      taken: (combo: string) => string;
    }>;
  }>(),
  { label: "Shortcut", placeholder: "Not set" },
);
const text = computed(() => ({
  button: (l: string, c: string) => `${l}: ${c || "not set"}. Press Enter to change.`,
  pressKeys: "Press keys…",
  recording: "Recording. Press the keys you want. Escape cancels, Backspace clears.",
  set: (c: string) => `Set to ${c}`,
  needsModifier: (c: string) => `Add Ctrl, Alt or Meta to ${c}`,
  usedBy: (c: string, by: string) => `${c} is already used by ${by}`,
  taken: (c: string) => `${c} is already taken`,
  ...props.labels,
}));
const model = defineModel<string>({ default: "" });
const emit = defineEmits<{ conflict: [combo: string, by: string | undefined] }>();

const id = useId();
const recording = ref(false);
const held = ref("");
const error = ref("");
const live = ref("");
const btn = ref<HTMLButtonElement>();

const owner = (combo: string) =>
  Array.isArray(props.taken)
    ? props.taken.includes(combo)
      ? ""
      : undefined
    : props.taken?.[combo];
const shown = computed(() => (recording.value ? held.value : model.value));
const parts = computed(() => (shown.value ? splitShortcut(shown.value) : []));

function start() {
  if (props.disabled) return;
  recording.value = true;
  held.value = "";
  error.value = "";
  live.value = text.value.recording;
}
function stop(msg = "") {
  recording.value = false;
  held.value = "";
  live.value = msg;
}
const needsModifier = (combo: string) =>
  !props.allowBare &&
  !/^(Ctrl|Alt|Meta)\+/.test(combo.replace(/Shift\+/, "")) &&
  !/^F\d{1,2}$/.test(combo.split("+").at(-1)!);

function onKey(e: KeyboardEvent) {
  if (!recording.value) {
    if (e.key === "Enter" || e.key === " ") (e.preventDefault(), start());
    return;
  }
  e.preventDefault();
  e.stopPropagation();
  if (isModifierKey(e)) {
    held.value = [
      e.ctrlKey && "Ctrl",
      e.altKey && "Alt",
      e.shiftKey && "Shift",
      e.metaKey && "Meta",
    ]
      .filter(Boolean)
      .join("+");
    return;
  }
  const bare = !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey;
  if (bare && e.key === "Escape") return stop("Cancelled");
  if (bare && (e.key === "Backspace" || e.key === "Delete")) {
    model.value = "";
    error.value = "";
    return stop("Cleared");
  }
  const combo = shortcutFromEvent(e)!;
  if (needsModifier(combo)) {
    held.value = combo;
    error.value = text.value.needsModifier(combo);
    live.value = error.value;
    return;
  }
  const by = owner(combo);
  if (by !== undefined && combo !== model.value) {
    held.value = combo;
    error.value = by ? text.value.usedBy(combo, by) : text.value.taken(combo);
    live.value = error.value;
    emit("conflict", combo, by || undefined);
    return;
  }
  model.value = combo;
  error.value = "";
  stop(text.value.set(combo));
}
function onKeyup(e: KeyboardEvent) {
  // a held modifier let go with nothing else pressed: back to waiting
  if (recording.value && isModifierKey(e) && !error.value)
    held.value = [
      e.ctrlKey && "Ctrl",
      e.altKey && "Alt",
      e.shiftKey && "Shift",
      e.metaKey && "Meta",
    ]
      .filter(Boolean)
      .join("+");
}
defineExpose({ start, focus: () => btn.value?.focus() });
</script>

<template>
  <div
    class="bless-shortcut"
    :class="{ 'bless-shortcut--rec': recording, 'bless-shortcut--bad': !!error }"
  >
    <button
      :id
      ref="btn"
      type="button"
      class="bless-shortcut__btn"
      :disabled
      :aria-label="text.button(label, model)"
      :aria-describedby="error ? `${id}-err` : undefined"
      :aria-invalid="!!error || undefined"
      @click="recording ? stop() : start()"
      @keydown="onKey"
      @keyup="onKeyup"
      @blur="recording && stop()"
    >
      <span v-if="recording && !parts.length" class="bless-shortcut__hint">{{
        text.pressKeys
      }}</span>
      <BlessKbd v-else-if="parts.length" :keys="parts" />
      <span v-else class="bless-shortcut__hint">{{ placeholder }}</span>
    </button>
    <p v-if="error" :id="`${id}-err`" class="bless-shortcut__error" role="alert">{{ error }}</p>
    <span class="bless-shortcut__live" aria-live="polite">{{ live }}</span>
  </div>
</template>

<style>
.bless-shortcut {
  display: inline-flex;
  flex-direction: column;
  gap: var(--bless-space-1);
  position: relative;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
}
.bless-shortcut__btn {
  display: inline-flex;
  align-items: center;
  min-width: 160px;
  min-height: 36px;
  padding: var(--bless-space-1) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  font: inherit;
  cursor: pointer;
}
.bless-shortcut__btn:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-shortcut--rec .bless-shortcut__btn {
  border-color: var(--bless-color-accent);
}
.bless-shortcut--bad .bless-shortcut__btn {
  border-color: var(--bless-color-danger-text);
}
.bless-shortcut__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.bless-shortcut__hint {
  color: var(--bless-color-text-muted);
}
.bless-shortcut__error {
  margin: 0;
  color: var(--bless-color-danger-text);
  font-size: var(--bless-text-xs);
}
.bless-shortcut__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>
